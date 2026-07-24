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
const pageErrors = [];

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
    const [pdf, preview] = await Promise.all([
      readFile(path.join(repoRoot, 'output/pdf/vertical-impression-local-proposal-sample.pdf')),
      readFile(path.join(repoRoot, 'assets/samples/vertical-impression-local-proposal-current.png')),
    ]);
    const header = Buffer.allocUnsafe(4);
    header.writeUInt32BE(preview.length, 0);
    const bundle = Buffer.concat([header, preview, pdf]);
    response.writeHead(200, {
      'Content-Type': 'application/vnd.michael.proposal-bundle',
      'Content-Disposition': 'inline; filename="midtown-family-dental-elevator-advertising-proposal.pdf"',
      'X-Proposal-Screen-Count': '42',
      'Cache-Control': 'private, no-store',
    });
    return response.end(bundle);
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
    const explainerRect = document.querySelector('.proposal-explainer').getBoundingClientRect();
    const frameRect = document.querySelector('.proposal-preview__frame').getBoundingClientRect();
    const connectorPaths = [...document.querySelectorAll('[data-proposal-path]')];
    const targets = [...document.querySelectorAll('[data-proposal-target]')];
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      workspaceColumns: getComputedStyle(document.querySelector('.proposal-workspace__inner')).gridTemplateColumns,
      workspaceBackground: getComputedStyle(document.querySelector('.proposal-workspace')).backgroundColor,
      workspaceInnerBackground: getComputedStyle(document.querySelector('.proposal-workspace__inner')).backgroundColor,
      workspaceInnerBorderWidth: Number.parseFloat(getComputedStyle(document.querySelector('.proposal-workspace__inner')).borderTopWidth),
      callouts: [...document.querySelectorAll('.proposal-callout')].filter(visible).length,
      connectorCount: visible(document.querySelector('[data-proposal-connectors]'))
        ? connectorPaths.filter((path) => path.getAttribute('d')).length
        : 0,
      connectorNumberCount: targets.filter(visible).length,
      connectorAlignment: connectorPaths.every((path) => {
        if (!path.getAttribute('d')) return false;
        const target = document.querySelector(`[data-proposal-target="${path.dataset.proposalPath}"]`);
        const targetRect = target.getBoundingClientRect();
        const pathEnd = path.getPointAtLength(path.getTotalLength());
        const targetX = targetRect.left + (targetRect.width / 2) - explainerRect.left;
        const targetY = targetRect.top + (targetRect.height / 2) - explainerRect.top;
        return Math.abs(pathEnd.x - targetX) <= 2 && Math.abs(pathEnd.y - targetY) <= 2;
      }),
      connectorTargetsInFrame: targets.every((target) => {
        const rectangle = target.getBoundingClientRect();
        const x = rectangle.left + (rectangle.width / 2);
        const y = rectangle.top + (rectangle.height / 2);
        return x >= frameRect.left && x <= frameRect.right && y >= frameRect.top && y <= frameRect.bottom;
      }),
      annotationPointerEvents: getComputedStyle(document.querySelector('.proposal-annotations')).pointerEvents,
      visibleListNumbers: [...document.querySelectorAll('.proposal-callout > span')].filter(visible).length,
      previewSource: document.querySelector('[data-proposal-preview-image]').getAttribute('src'),
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
      emailScreenCount: document.querySelector('[data-email-screen-count]')?.textContent,
      calloutLabels: [...document.querySelectorAll('.proposal-callout h2')].map((heading) => heading.textContent.trim()),
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
  assert.equal(desktopLayout.workspaceBackground, 'rgb(255, 255, 255)', 'proposal workspace is not white');
  assert.equal(desktopLayout.workspaceInnerBackground, 'rgba(0, 0, 0, 0)', 'proposal system is still wrapped in a card');
  assert.equal(desktopLayout.workspaceInnerBorderWidth, 0, 'proposal system wrapper still has a border');
  assert.equal(desktopLayout.callouts, 4, 'desktop annotations are missing');
  assert.equal(desktopLayout.connectorCount, 4, 'desktop anchored connectors are missing');
  assert.equal(desktopLayout.connectorNumberCount, 4, 'desktop connector numbers are missing');
  assert.equal(desktopLayout.connectorAlignment, true, 'desktop connector paths do not end on their named PDF targets');
  assert.equal(desktopLayout.connectorTargetsInFrame, true, 'desktop annotation targets are not anchored inside the PDF');
  assert.equal(desktopLayout.annotationPointerEvents, 'none', 'annotations can block the live builder');
  assert.equal(desktopLayout.visibleListNumbers, 0, 'desktop callouts duplicate their connector numbers');
  assert.match(desktopLayout.previewSource, /vertical-impression-local-proposal-current\.png$/, 'initial approved proposal preview is missing');
  assert.equal(desktopLayout.sampleVisible, true, 'approved sample image is not visible before generation');
  assert.ok(desktopLayout.minimumControlHeight >= 44, `desktop control is below 44px: ${desktopLayout.minimumControlHeight}`);
  assert.equal(desktopLayout.calloutOverlap, false, 'desktop callout copy overlaps the proposal sheet');
  assert.equal(desktopLayout.calloutViewportOverflow, false, 'desktop callout copy leaves the viewport');
  assert.equal(desktopLayout.calloutBackgroundsOpaque, true, 'desktop callouts are not on opaque surfaces');
  assert.ok(desktopLayout.minimumCalloutPadding >= 18, `desktop callout padding is below 18px: ${desktopLayout.minimumCalloutPadding}`);
  assert.equal(desktopLayout.outreachOverflow, false, 'desktop outreach handoff leaves the viewport');
  assert.deepEqual(
    desktopLayout.calloutLabels,
    ['Unique industry copy', 'Generated sample ad', 'Custom map', 'Offer'],
    'desktop proposal points do not match the approved generated elements',
  );

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
    preview: document.querySelector('[data-proposal-preview-image]').src,
    open: document.querySelector('[data-open-pdf]').href,
    download: document.querySelector('[data-download-pdf]').href,
  }));
  assert.match(generated.preview, /^blob:/);
  assert.match(generated.open, /^blob:/);
  assert.match(generated.download, /^blob:/);
  assert.equal(await desktop.$eval('[data-email-screen-count]', (element) => element.textContent), '42');
  assert.ok(browserRequests.every((url) => !/api\.mapbox\.com|api\.letz\.ai/i.test(url)), 'browser contacted a server-only integration');

  const breakpointPages = [];
  const breakpointLayouts = {};
  for (const viewport of [
    { width: 1024, height: 900 },
    { width: 768, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 720 },
  ]) {
    const page = await browser.newPage();
    page.on('pageerror', (error) => pageErrors.push(`${viewport.width}: ${error.message}`));
    breakpointPages.push(page);
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`${origin}/v2/proposal-generator.html`, { waitUntil: 'networkidle0' });
    const layout = await inspectLayout(page);
    breakpointLayouts[viewport.width] = layout;
    assert.equal(layout.overflow, 0, `${viewport.width}px proposal page overflows horizontally`);
    assert.equal(layout.callouts, 4, `${viewport.width}px explanation list is incomplete`);
    assert.equal(layout.connectorNumberCount, 4, `${viewport.width}px PDF target markers are incomplete`);
    assert.equal(layout.connectorTargetsInFrame, true, `${viewport.width}px annotation targets leave the PDF`);
    assert.equal(layout.calloutViewportOverflow, false, `${viewport.width}px callout leaves the viewport`);
    assert.equal(layout.outreachOverflow, false, `${viewport.width}px outreach handoff leaves the viewport`);
    assert.deepEqual(
      layout.calloutLabels,
      ['Unique industry copy', 'Generated sample ad', 'Custom map', 'Offer'],
      `${viewport.width}px proposal points changed`,
    );
  }

  const mobile = breakpointPages[2];
  const mobileLayout = breakpointLayouts[390];
  assert.equal(mobileLayout.overflow, 0, 'mobile proposal page overflows horizontally');
  assert.equal(mobileLayout.connectorCount, 0, 'desktop connectors remain visible on mobile');
  assert.equal(mobileLayout.visibleListNumbers, 4, 'mobile explanation numbers are incomplete');
  assert.ok(mobileLayout.minimumControlHeight >= 44, `mobile control is below 44px: ${mobileLayout.minimumControlHeight}`);
  assert.equal(mobileLayout.calloutBackgroundsOpaque, true, 'mobile callouts are not on opaque surfaces');
  assert.ok(mobileLayout.minimumCalloutPadding >= 18, `mobile callout padding is below 18px: ${mobileLayout.minimumCalloutPadding}`);

  await mobile.type('input[name="businessName"]', 'Midtown Family Dental');
  await mobile.select('select[name="businessType"]', 'dentist');
  await mobile.$eval('#proposal-address', (input) => {
    input.value = '600 West Peachtree';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.deepEqual(pageErrors, [], `proposal page errors: ${pageErrors.join('; ')}`);
  assert.equal(
    requests.at(-1),
    '/api/proposal/suggest',
    `mobile address lookup did not run; value=${await mobile.$eval('#proposal-address', (input) => input.value)}`,
  );
  await mobile.waitForSelector('[data-address-results] button', { visible: true });
  await mobile.$eval('[data-address-results] button', (button) => button.click());
  await mobile.$eval('.proposal-submit', (button) => button.click());
  await mobile.waitForFunction(() => document.querySelector('[data-preview-state]')?.textContent === 'Generated proposal');
  const generatedMobile = await mobile.evaluate(() => {
    const preview = document.querySelector('[data-proposal-preview-image]');
    const host = preview.closest('.proposal-preview__frame');
    return {
      source: preview.src,
      alt: preview.alt,
      width: preview.getBoundingClientRect().width,
      height: preview.getBoundingClientRect().height,
      hostOverflow: getComputedStyle(host).overflow,
      frameRight: preview.getBoundingClientRect().right,
      hostRight: host.getBoundingClientRect().right,
    };
  });
  assert.match(generatedMobile.source, /^blob:/);
  assert.match(generatedMobile.alt, /Midtown Family Dental generated elevator advertising proposal preview/);
  assert.equal(generatedMobile.hostOverflow, 'hidden', 'mobile proposal preview can pan outside its card');
  assert.ok(generatedMobile.frameRight <= generatedMobile.hostRight + 1, 'generated proposal preview exceeds its mobile card');
  assert.ok(generatedMobile.width > 300 && generatedMobile.height > generatedMobile.width, 'generated mobile proposal is not a readable fitted page');
  assert.deepEqual(requests, [
    '/api/proposal/suggest',
    '/api/proposal/generate',
    '/api/proposal/suggest',
    '/api/proposal/generate',
  ]);

  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await desktop.screenshot({ path: path.join(screenshotDirectory, 'v2-proposal-builder-desktop.png'), fullPage: true });
    for (const [index, page] of breakpointPages.entries()) {
      const width = [1024, 768, 390, 320][index];
      await page.screenshot({ path: path.join(screenshotDirectory, `v2-proposal-builder-${width}.png`), fullPage: true });
    }
  }

  console.log(JSON.stringify({
    desktop: desktopLayout,
    breakpoints: breakpointLayouts,
    generatedDesktop: generated,
    generatedMobile,
  }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
