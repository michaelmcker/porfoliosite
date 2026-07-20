import { readFileSync } from 'node:fs';
import { readFile as readFilePromise, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

import { buildAdPrompt, distanceMiles, proposalCopyFor, selectInventoryPackage, validateProposalInput } from '../_lib/proposal/core.js';
import { generateImage, waitForImage } from '../_lib/proposal/letzai.js';
import { generateMapUrl } from '../_lib/proposal/map.js';
import { renderProposalHtml } from '../_lib/proposal/pdf-template.js';
import {
  RequestSecurityError,
  assertJsonRequest,
  assertRateLimit,
  assertSameOrigin,
  parseJsonBody,
} from '../_lib/proposal/request-security.js';
import { fetchImageAsDataUrl } from '../_lib/proposal/remote-image.js';
import {
  DEFAULT_BG_HEIGHT,
  DEFAULT_BG_WIDTH,
  DEFAULT_SCREEN_CORNERS,
  generateCompositeImage,
} from '../_lib/proposal/perspective.js';

export const config = { maxDuration: 300 };

const CHROMIUM_VERSION = '149.0.0';
const INVENTORY = JSON.parse(readFileSync(new URL('../_lib/proposal/inventory.json', import.meta.url), 'utf8'));
const IMAGE_CACHE_PATH = '/tmp/portfolio-proposal-image-cache.json';
const IMAGE_CACHE_TTL = 60 * 60 * 1000;

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'private, no-store');
  response.end(JSON.stringify(payload));
}

async function geocodeAddress(address) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) throw new Error('Address lookup is not configured.');
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward');
  url.searchParams.set('q', address);
  url.searchParams.set('limit', '1');
  url.searchParams.set('types', 'address');
  url.searchParams.set('access_token', token);
  const geocodeResponse = await fetch(url, { cache: 'no-store' });
  if (!geocodeResponse.ok) throw new Error('Address lookup failed.');
  const data = await geocodeResponse.json();
  const feature = data.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error('Select a complete address from the suggestions.');
  }
  return {
    fullAddress: feature.properties?.full_address || feature.place_name || address,
    lng: Number(coordinates[0]),
    lat: Number(coordinates[1]),
  };
}

async function chromiumPath() {
  if (process.platform === 'linux' && process.env.VERCEL) {
    const architecture = process.arch === 'arm64' ? 'arm64' : 'x64';
    const packUrl = `https://github.com/Sparticuz/chromium/releases/download/v${CHROMIUM_VERSION}/chromium-v${CHROMIUM_VERSION}-pack.${architecture}.tar`;
    return chromium.executablePath(packUrl);
  }
  return process.env.CHROME_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

function assetDataUrl(buffer, type) {
  return `data:${type};base64,${buffer.toString('base64')}`;
}

function imageCacheKey(input) {
  return `${input.businessType}:${input.businessName.toLowerCase()}`;
}

async function readCachedImage(input) {
  try {
    const cache = JSON.parse(await readFilePromise(IMAGE_CACHE_PATH, 'utf8'));
    const entry = cache[imageCacheKey(input)];
    return entry && Date.now() - entry.createdAt < IMAGE_CACHE_TTL ? entry.url : '';
  } catch {
    return '';
  }
}

async function cacheImage(input, url) {
  let cache = {};
  try {
    cache = JSON.parse(await readFilePromise(IMAGE_CACHE_PATH, 'utf8'));
  } catch {
    cache = {};
  }
  cache[imageCacheKey(input)] = { url, createdAt: Date.now() };
  await writeFile(IMAGE_CACHE_PATH, JSON.stringify(cache), 'utf8');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    assertSameOrigin(request, { requireOrigin: true });
    assertJsonRequest(request);
    assertRateLimit(request, {
      bucket: 'proposal-generate',
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });
    const input = validateProposalInput(await parseJsonBody(request));
    const location = await geocodeAddress(input.address);
    const withDistance = INVENTORY.map((row) => ({
      ...row,
      distanceMiles: distanceMiles(location, row),
    })).filter((row) => row.distanceMiles <= 25);

    if (!withDistance.length) {
      return sendJson(response, 422, { error: 'No elevator inventory was found near that address.' });
    }

    const inventory = selectInventoryPackage(withDistance, input.businessType);
    let generatedImageUrl = await readCachedImage(input);
    if (!generatedImageUrl) {
      const generation = await generateImage({
        prompt: buildAdPrompt(input),
        width: 1600,
        height: 900,
        quality: 3,
        mode: 'cinematic',
      });
      const generated = await waitForImage(generation.id, 180_000, 3_000);
      if (!generated.imageUrl) throw new Error('Image generation completed without an image.');
      generatedImageUrl = generated.imageUrl;
      await cacheImage(input, generatedImageUrl);
    }

    const root = process.cwd();
    const [adDataUrl, background, logo, regular, semibold, bold] = await Promise.all([
      fetchImageAsDataUrl(generatedImageUrl),
      readFilePromise(join(root, 'assets', 'proposal', 'elevator-screen-cropped.png')),
      readFilePromise(join(root, 'assets', 'proposal', 'vertical-impression-logo-inverse.png')),
      readFilePromise(join(root, 'assets', 'proposal', 'fonts', 'gilroy-regular.otf')),
      readFilePromise(join(root, 'assets', 'proposal', 'fonts', 'gilroy-semibold.otf')),
      readFilePromise(join(root, 'assets', 'proposal', 'fonts', 'gilroy-bold.otf')),
    ]);

    const composite = await generateCompositeImage(
      assetDataUrl(background, 'image/png'),
      adDataUrl,
      DEFAULT_SCREEN_CORNERS,
      DEFAULT_BG_WIDTH,
      DEFAULT_BG_HEIGHT,
    );

    const mapUrl = generateMapUrl(
      location,
      inventory.selected.map(({ lat, lng }) => ({ lat, lng })),
      {
        width: 1200,
        height: 600,
        mapStyle: 'light-v11',
        businessMarkerColor: '#14b8b0',
        screenMarkerColor: '#071b43',
      },
    );
    const mapDataUrl = await fetchImageAsDataUrl(mapUrl, { maxBytes: 8 * 1024 * 1024 });
    const html = renderProposalHtml({
      businessName: input.businessName,
      fullAddress: location.fullAddress,
      businessType: input.businessType,
      logoDataUrl: assetDataUrl(logo, 'image/png'),
      compositeDataUrl: assetDataUrl(composite, 'image/png'),
      mapDataUrl,
      buildings: inventory.buildings,
      screens: inventory.screens,
      monthlyImpressions: inventory.monthlyImpressions,
      monthlyPrice: inventory.monthlyPrice,
      proposalCopy: proposalCopyFor(input.businessType),
      bodyFontRegularDataUrl: assetDataUrl(regular, 'font/otf'),
      bodyFontSemiboldDataUrl: assetDataUrl(semibold, 'font/otf'),
      bodyFontBoldDataUrl: assetDataUrl(bold, 'font/otf'),
      repName: 'Sales Representative',
      repTitle: 'Account Executive',
      repPhone: '(000) 000-0000',
      repEmail: 'hello@verticalimpression.com',
    });

    const isServerless = process.platform === 'linux' && Boolean(process.env.VERCEL);
    const chromiumArguments = (isServerless
      ? chromium.args
      : ['--no-sandbox', '--disable-setuid-sandbox'])
      .filter((argument) => argument !== '--disable-web-security');
    const browser = await puppeteer.launch({
      args: chromiumArguments,
      executablePath: await chromiumPath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const requestUrl = request.url();
        if (/^(?:about:|blob:|data:)/.test(requestUrl)) request.continue();
        else request.abort();
      });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pdf = await page.pdf({
        width: '8.5in',
        height: '11in',
        printBackground: true,
        pageRanges: '1',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      const filename = `${input.businessName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}-elevator-advertising-proposal.pdf`;
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      response.setHeader('X-Proposal-Screen-Count', String(inventory.screens));
      response.setHeader('Cache-Control', 'private, no-store');
      return response.end(Buffer.from(pdf));
    } finally {
      await browser.close();
    }
  } catch (error) {
    if (!(error instanceof RequestSecurityError)) {
      console.error('Standalone proposal generation failed:', error);
    }
    if (error instanceof RequestSecurityError) {
      if (error.retryAfter) response.setHeader('Retry-After', String(error.retryAfter));
      return sendJson(response, error.statusCode, { error: error.message });
    }
    const message = error instanceof Error ? error.message : 'Proposal generation failed.';
    const clientError = /business name|address|business type|supported|inventory/i.test(message);
    return sendJson(response, clientError ? 400 : 500, {
      error: clientError ? message : 'We could not generate the proposal. Please try again.',
    });
  }
}
