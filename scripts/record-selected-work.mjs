#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import playwright from "/Users/michaelmckerracher/VI Automation/VI Tools/render-service/node_modules/playwright/index.js";

const { chromium } = playwright;

const root = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.join(root, "tmp", "recordings");
const screenshotDirectory = path.join(root, "tmp", "recording-stills");

const allRoutes = [
  {
    name: "rccv-home",
    url: "https://rccv-st-james-limestone-ssr.michael-mckerracher.workers.dev/",
    depth: 0.82,
  },
  {
    name: "rccv-stations",
    url: "https://rccv-st-james-limestone-ssr.michael-mckerracher.workers.dev/faith/stations-of-the-cross/",
    depth: 0.92,
  },
  {
    name: "okanagan-overview",
    url: "https://okanagan-treehouse-preview.michael-mckerracher.workers.dev/",
    depth: 0.84,
  },
  {
    name: "okanagan-treehouse",
    url: "https://okanagan-treehouse-preview.michael-mckerracher.workers.dev/stays/treehouse/",
    depth: 0.9,
  },
  {
    name: "okanagan-cabin",
    url: "https://okanagan-treehouse-preview.michael-mckerracher.workers.dev/stays/cabin/",
    depth: 0.9,
  },
];

const requestedGroup = process.argv[2];
const routes = requestedGroup
  ? allRoutes.filter((route) => route.name.startsWith(requestedGroup))
  : allRoutes;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function smoothScroll(page, target, duration) {
  await page.evaluate(
    ({ targetPosition, scrollDuration }) =>
      new Promise((resolve) => {
        const start = window.scrollY;
        const distance = targetPosition - start;
        const startedAt = performance.now();

        const tick = (now) => {
          const elapsed = Math.min(1, (now - startedAt) / scrollDuration);
          const eased = elapsed < 0.5
            ? 4 * elapsed * elapsed * elapsed
            : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
          window.scrollTo(0, start + distance * eased);
          if (elapsed < 1) requestAnimationFrame(tick);
          else resolve();
        };

        requestAnimationFrame(tick);
      }),
    { targetPosition: target, scrollDuration: duration },
  );
}

async function capture(browser, route) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: outputDirectory,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();
  await page.goto(route.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      html, body { scrollbar-width: none !important; }
      body { cursor: none !important; }
      ::-webkit-scrollbar { display: none !important; }
    `,
  });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await sleep(3200);

  await page.screenshot({
    path: path.join(screenshotDirectory, `${route.name}.png`),
    fullPage: false,
  });

  const target = await page.evaluate((depth) => {
    const available = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    return Math.min(available, innerHeight * depth);
  }, route.depth);

  await sleep(450);
  await smoothScroll(page, target, 1800);
  await sleep(350);
  await smoothScroll(page, 0, 1300);
  await sleep(600);

  const video = page.video();
  await context.close();
  const recordedPath = await video.path();
  const finalPath = path.join(outputDirectory, `${route.name}.webm`);
  await fs.rename(recordedPath, finalPath);
  process.stdout.write(`${finalPath}\n`);
}

await fs.mkdir(outputDirectory, { recursive: true });
await fs.mkdir(screenshotDirectory, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--font-render-hinting=none"],
});

try {
  for (const route of routes) await capture(browser, route);
} finally {
  await browser.close();
}
