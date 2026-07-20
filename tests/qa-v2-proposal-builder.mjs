import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const screenshotDirectory = process.env.QA_V2_PROPOSAL_SCREENSHOT_DIR;
const requests = [];

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/proposal/suggest') {
    requests.push(url.pathname);
    response.writeHead(200, { 'Content-Type': types['.json'], 'Cache-Control': 'private, no-store' });
    return response.end(JSON.stringify({
      suggestions: [{
        id: 'test-address',
        fullAddress: '600 West Peachtree Street NW, Atlanta, Georgia 30308',
        lat: 33.7705,
        lng: -84.3886,
        relevance: 1,
      }],
    }));
  }

  if (url.pathname === '/api/proposal/generate') {
    requests.push(url.pathname);
    const pdf = await readFile(path.join(repoRoot, 'output/pdf/vertical-impression-local-proposal-sample.pdf'));
    response.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="midtown-family-dental-elevator-advertising-proposal.pdf"',
      'Cache-Control': 'private, no-store',
    });
    return response.end(pdf);
  }

  const pathname = url.pathname === '/' ? '/v2/proposal-generator.html' : decodeURIComponent(url.pathname);
  const target = path.resolve(repoRoot, `.${pathname}`);
  if (!target.startsWith(repoRoot)) {
    response.writeHead(403);
    return response.end('Forbidden');
  }

  try {
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    return response.end(body);
  } catch {
    response.writeHead(404);
    return response.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const origin = `http://127.0.0.1:${address.port}`;
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox'],
});

async function inspectLayout(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
    };
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      workspaceColumns: getComputedStyle(document.querySelector('.proposal-workspace__inner')).gridTemplateColumns,
      callouts: [...document.querySelectorAll('.proposal-callout')].filter(visible).length,
      connectorCount: [...document.querySelectorAll('.proposal-callout')]
        .filter((callout) => getComputedStyle(callout, '::before').display !== 'none').length,
      annotationPointerEvents: getComputedStyle(document.querySelector('.proposal-annotations')).pointerEvents,
      visiblePins: [...document.querySelectorAll('.proposal-pin')].filter(visible).length,
      frameSource: document.querySelector('[data-proposal-frame]').getAttribute('src'),
      sampleVisible: visible(document.querySelector('.proposal-preview__sample')),
      minimumControlHeight: Math.min(...[...document.querySelectorAll('.proposal-form input, .proposal-form select, .proposal-form button, .proposal-preview__actions a')]
        .filter((element) => !element.closest('[hidden]'))
        .map((element) => element.getBoundingClientRect().height)),
      calloutOverlap: [...document.querySelectorAll('.proposal-callout')].some((callout) => {
        const calloutRect = callout.getBoundingClientRect();
        const frameRect = document.querySelector('.proposal-preview__frame').getBoundingClientRect();
        return calloutRect.left < frameRect.right && calloutRect.right > frameRect.left
          && calloutRect.top < frameRect.bottom && calloutRect.bottom > frameRect.top;
      }),
      calloutViewportOverflow: [...document.querySelectorAll('.proposal-callout')].some((callout) => {
        const rectangle = callout.getBoundingClientRect();
        return rectangle.left < 0 || rectangle.right > document.documentElement.clientWidth;
      }),
      calloutBackgroundsOpaque: [...document.querySelectorAll('.proposal-callout')].every((callout) => {
        const color = getComputedStyle(callout).backgroundColor;
        const match = color.match(/rgba?\(([^)]+)\)/);
        if (!match) return false;
        const channels = match[1].split(',').map((value) => Number(value.trim()));
        return channels.length === 3 || channels[3] === 1;
      }),
      minimumCalloutPadding: Math.min(...[...document.querySelectorAll('.proposal-callout')]
        .map((callout) => Number.parseFloat(getComputedStyle(callout).paddingTop))),
      outreachOverflow: (() => {
        const outreach = document.querySelector('.proposal-outreach');
        if (!outreach) return true;
        const rectangle = outreach.getBoundingClientRect();
        return rectangle.left < 0 || rectangle.right > document.documentElement.clientWidth;
      })(),
      emailLocation: document.querySelector('[data-email-location]')?.textContent,
    };
  });
}

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const browserRequests = [];
  desktop.on('request', (request) => browserRequests.push(request.url()));
  await desktop.goto(`${origin}/v2/proposal-generator.html`, { waitUntil: 'networkidle0' });
  const desktopLayout = await inspectLayout(desktop);

  assert.equal(desktopLayout.overflow, 0, 'desktop proposal page overflows horizontally');
  assert.ok(desktopLayout.workspaceColumns.split(' ').length >= 2, 'desktop form and proposal are not side-by-side');
  assert.equal(desktopLayout.callouts, 4, 'desktop annotations are missing');
  assert.equal(desktopLayout.connectorCount, 4, 'desktop anchored connectors are missing');
  assert.equal(desktopLayout.annotationPointerEvents, 'none', 'annotations can block the live builder');
  assert.equal(desktopLayout.visiblePins, 4, 'desktop proposal anchors are missing');
  assert.equal(desktopLayout.frameSource, 'about:blank', 'initial preview downloads a hidden PDF before generation');
  assert.equal(desktopLayout.sampleVisible, true, 'approved sample image is not visible before generation');
  assert.ok(desktopLayout.minimumControlHeight >= 44, `desktop control is below 44px: ${desktopLayout.minimumControlHeight}`);
  assert.equal(desktopLayout.calloutOverlap, false, 'desktop callout copy overlaps the proposal sheet');
  assert.equal(desktopLayout.calloutViewportOverflow, false, 'desktop callout copy leaves the viewport');
  assert.equal(desktopLayout.calloutBackgroundsOpaque, true, 'desktop callouts are not on opaque surfaces');
  assert.ok(desktopLayout.minimumCalloutPadding >= 18, `desktop callout padding is below 18px: ${desktopLayout.minimumCalloutPadding}`);
  assert.equal(desktopLayout.outreachOverflow, false, 'desktop outreach handoff leaves the viewport');

  await desktop.type('input[name="businessName"]', 'Midtown Family Dental');
  await desktop.select('select[name="businessType"]', 'dentist');
  await desktop.type('#proposal-address', '600 West Peachtree');
  await desktop.waitForSelector('[data-address-results] button', { visible: true });
  await desktop.click('[data-address-results] button');
  assert.equal(await desktop.$eval('[data-email-location]', (element) => element.textContent), 'Atlanta');
  assert.equal(await desktop.$eval('[data-email-industry-title]', (element) => element.textContent), 'dental practice');
  assert.equal(await desktop.$eval('[data-email-business]', (element) => element.textContent), 'Midtown Family Dental');
  assert.equal(await desktop.$eval('.proposal-submit', (button) => button.disabled), false);
  await desktop.click('.proposal-submit');
  await desktop.waitForFunction(() => document.querySelector('[data-preview-state]')?.textContent === 'Generated proposal');
  const generated = await desktop.evaluate(() => ({
    frame: document.querySelector('[data-proposal-frame]').src,
    open: document.querySelector('[data-open-pdf]').href,
    download: document.querySelector('[data-download-pdf]').href,
  }));
  assert.match(generated.frame, /^blob:/);
  assert.match(generated.open, /^blob:/);
  assert.match(generated.download, /^blob:/);
  assert.deepEqual(requests, ['/api/proposal/suggest', '/api/proposal/generate']);
  assert.ok(browserRequests.every((url) => !/api\.mapbox\.com|api\.letz\.ai/i.test(url)), 'browser contacted a server-only integration');

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobile.goto(`${origin}/v2/proposal-generator.html`, { waitUntil: 'networkidle0' });
  const mobileLayout = await inspectLayout(mobile);
  assert.equal(mobileLayout.overflow, 0, 'mobile proposal page overflows horizontally');
  assert.equal(mobileLayout.callouts, 4, 'mobile explanation list is incomplete');
  assert.equal(mobileLayout.connectorCount, 0, 'desktop connectors remain visible on mobile');
  assert.equal(mobileLayout.visiblePins, 4, 'mobile numbered pins are incomplete');
  assert.ok(mobileLayout.minimumControlHeight >= 44, `mobile control is below 44px: ${mobileLayout.minimumControlHeight}`);
  assert.equal(mobileLayout.calloutBackgroundsOpaque, true, 'mobile callouts are not on opaque surfaces');
  assert.ok(mobileLayout.minimumCalloutPadding >= 18, `mobile callout padding is below 18px: ${mobileLayout.minimumCalloutPadding}`);
  assert.equal(mobileLayout.outreachOverflow, false, 'mobile outreach handoff leaves the viewport');

  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await desktop.screenshot({ path: path.join(screenshotDirectory, 'v2-proposal-builder-desktop.png'), fullPage: true });
    await mobile.screenshot({ path: path.join(screenshotDirectory, 'v2-proposal-builder-mobile.png'), fullPage: true });
  }

  console.log(JSON.stringify({ desktop: desktopLayout, mobile: mobileLayout, generated: true }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
