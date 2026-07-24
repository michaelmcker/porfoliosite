import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const screenshotDirectory = process.env.QA_V2_HOME_SCREENSHOT_DIR;
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname === '/' ? '/v2/index.html' : decodeURIComponent(url.pathname);
  const target = path.resolve(repoRoot, `.${pathname}`);
  if (!target.startsWith(repoRoot)) {
    response.writeHead(403);
    return response.end('Forbidden');
  }
  try {
    const body = await readFile(target);
    response.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    return response.end(body);
  } catch {
    response.writeHead(404);
    return response.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox'],
});

const viewports = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];
const results = {};

try {
  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });

  for (const viewport of viewports) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`${origin}/v2/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hero-system-media');
    await page.waitForFunction(() => document.querySelector('[data-motion-video]')?.poster);

    const hero = await page.evaluate(() => {
      const video = document.querySelector('#motion-video-hero');
      const copy = document.querySelector('.hero-copy').getBoundingClientRect();
      const media = document.querySelector('.hero-system-media').getBoundingClientRect();
      const headings = [...document.querySelectorAll(
        '.work-heading h2, .workflow-heading h2, .outcomes-heading h2, .experience-heading h2',
      )].map((heading) => {
        const style = getComputedStyle(heading);
        return {
          family: style.fontFamily,
          size: style.fontSize,
          weight: style.fontWeight,
        };
      });
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        poster: video.getAttribute('poster'),
        currentSource: video.currentSrc,
        overlayCount: document.querySelectorAll('.hero-video-copy > *').length,
        heroOverlap: copy.left < media.right && copy.right > media.left
          && copy.top < media.bottom && copy.bottom > media.top,
        mediaWidth: media.width,
        copyWidth: copy.width,
        headings,
        resourceSummary: performance.getEntriesByType('resource').reduce((summary, entry) => {
          summary.count += 1;
          summary.transfer += entry.transferSize || 0;
          if ((entry.transferSize || 0) > summary.largestSize) {
            summary.largestSize = entry.transferSize || 0;
            summary.largest = entry.name;
          }
          return summary;
        }, { count: 0, transfer: 0, largest: '', largestSize: 0 }),
      };
    });

    assert.ok(hero.overflow <= 0, `${viewport.width}px homepage overflows horizontally by ${hero.overflow}px`);
    assert.equal(hero.overlayCount, 4, `${viewport.width}px hero is missing an anchored HTML label overlay`);
    assert.match(
      hero.poster,
      viewport.width <= 699 ? /mobile-poster\.webp$/ : /desktop-poster\.webp$/,
      `${viewport.width}px hero uses the wrong first-paint poster`,
    );
    assert.match(
      hero.currentSource,
      viewport.width <= 699 ? /mobile-1080p\.mp4$/ : /desktop-1080p\.mp4$/,
      `${viewport.width}px hero uses the wrong motion source`,
    );
    assert.equal(hero.heroOverlap, false, `${viewport.width}px hero copy overlaps its video`);
    assert.equal(hero.headings.length, 4, `${viewport.width}px chapter heading set is incomplete`);
    assert.equal(
      new Set(hero.headings.map(({ family }) => family)).size,
      1,
      `${viewport.width}px chapter headings use inconsistent font families`,
    );
    assert.equal(
      new Set(hero.headings.map(({ size }) => size)).size,
      1,
      `${viewport.width}px chapter headings use inconsistent sizes`,
    );

    await page.$eval('[data-work="accommodation"]', (section) => section.scrollIntoView({ block: 'center' }));
    await page.waitForFunction(() => document.querySelector('[data-accommodation-page]')?.getAttribute('src'));
    const iframeHandle = await page.waitForSelector('[data-accommodation-page]');
    const frame = await iframeHandle.contentFrame();
    await frame.waitForSelector('.site-nav__links');
    const accommodation = await page.evaluate(() => {
      const iframe = document.querySelector('[data-accommodation-page]');
      const viewport = document.querySelector('.accommodation-viewport');
      const iframeRect = iframe.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      return {
        iframeCssWidth: getComputedStyle(iframe).width,
        transform: getComputedStyle(iframe).transform,
        iframeRight: iframeRect.right,
        viewportRight: viewportRect.right,
        viewportWidth: viewportRect.width,
        pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    const embedded = await frame.evaluate(() => ({
      innerWidth: window.innerWidth,
      desktopNavigation: getComputedStyle(document.querySelector('.site-nav__links')).display,
      mobileNavigation: getComputedStyle(document.querySelector('.mobile-nav')).display,
      title: document.querySelector('.hero-copy h1')?.innerText.trim(),
    }));

    assert.equal(accommodation.iframeCssWidth, '1100px', `${viewport.width}px Okanagan preview reflows below desktop width`);
    assert.notEqual(accommodation.transform, 'none', `${viewport.width}px Okanagan desktop canvas is not fitted into its device`);
    assert.ok(accommodation.iframeRight <= accommodation.viewportRight + 1, `${viewport.width}px Okanagan preview escapes its device`);
    assert.ok(accommodation.pageOverflow <= 0, `${viewport.width}px Okanagan preview introduces page overflow`);
    assert.equal(embedded.innerWidth, 1100, `${viewport.width}px Okanagan document is not rendered at desktop width`);
    assert.equal(embedded.desktopNavigation, 'flex', `${viewport.width}px Okanagan desktop nav is hidden`);
    assert.equal(embedded.mobileNavigation, 'none', `${viewport.width}px Okanagan mobile nav is shown`);
    assert.match(embedded.title, /Nature\.\s*Adventure\.\s*Stillness\./);
    assert.deepEqual(errors, [], `${viewport.width}px console errors: ${errors.join('; ')}`);

    if (screenshotDirectory) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((resolve) => setTimeout(resolve, 650));
      await page.screenshot({
        path: path.join(screenshotDirectory, `v2-home-hero-${viewport.width}.png`),
      });
      await page.$eval('[data-work="accommodation"]', (section) => section.scrollIntoView({ block: 'center' }));
      await new Promise((resolve) => setTimeout(resolve, 650));
      await page.screenshot({
        path: path.join(screenshotDirectory, `v2-home-okanagan-${viewport.width}.png`),
      });
    }

    results[viewport.width] = { hero, accommodation, embedded };
    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
