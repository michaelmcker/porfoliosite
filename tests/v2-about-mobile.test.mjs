import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const target = path.resolve(repoRoot, `.${decodeURIComponent(url.pathname)}`);
  if (!target.startsWith(repoRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(target);
    response.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox"],
});

const overlaps = (a, b) => (
  a.left < b.right
  && a.right > b.left
  && a.top < b.bottom
  && a.bottom > b.top
);

for (const viewport of [
  { width: 390, height: 844 },
  { width: 320, height: 720 },
]) {
  test(`${viewport.width}px About keeps a large portrait and collision-free build note`, async () => {
    const page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.goto(`${origin}/v2/index.html`, { waitUntil: "domcontentloaded" });

    const storyPosition = await page.$eval("[data-about-scroll-story]", (story) => ({
      top: story.getBoundingClientRect().top + window.scrollY,
      travel: story.offsetHeight - window.innerHeight,
    }));
    await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .9), storyPosition);
    await page.waitForFunction(() => Number.parseFloat(
      getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-value"),
    ) > .95);

    const resolved = await page.evaluate(() => {
      const rect = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
      return {
        stage: rect(".about-story-sticky"),
        phrase: rect(".about-questionable-focus"),
        portrait: rect(".portrait-object"),
        reveal: rect(".about-process-reveal"),
        exposedPunctuation: [...document.querySelector("[data-about-questionable-inline]").parentNode.childNodes]
          .filter((node) => node.nodeType === 3)
          .map((node) => node.textContent.trim())
          .join(""),
      };
    });

    assert.ok(
      resolved.portrait.width >= viewport.width * .5,
      `${viewport.width}px portrait remains thumbnail-sized: ${resolved.portrait.width}px`,
    );
    assert.equal(
      overlaps(resolved.portrait, resolved.reveal),
      false,
      `${viewport.width}px resolved copy overlaps the portrait: ${JSON.stringify(resolved)}`,
    );
    assert.equal(
      overlaps(resolved.phrase, resolved.reveal),
      false,
      `${viewport.width}px resolved copy overlaps the expanding phrase: ${JSON.stringify(resolved)}`,
    );
    assert.ok(resolved.portrait.left >= 0 && resolved.portrait.right <= viewport.width);
    assert.ok(resolved.portrait.top >= 0 && resolved.portrait.bottom <= viewport.height);
    assert.equal(resolved.exposedPunctuation.includes(","), false, "About leaves a floating comma after the sentence fades");

    await page.click("[data-about-toggle]");
    await page.waitForSelector("[data-about-note]:not([hidden])");

    const opened = await page.evaluate(() => {
      const rect = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
      const style = (selector) => getComputedStyle(document.querySelector(selector));
      return {
        note: rect("[data-about-note]"),
        phrase: rect(".about-questionable-focus"),
        portrait: rect(".portrait-object"),
        phraseOpacity: Number.parseFloat(style(".about-questionable-focus").opacity),
        portraitOpacity: Number.parseFloat(style(".portrait-object").opacity),
      };
    });

    assert.ok(opened.note.left >= 0 && opened.note.right <= viewport.width);
    assert.ok(opened.note.top >= 0 && opened.note.bottom <= viewport.height);
    assert.ok(
      opened.phraseOpacity < .05 || !overlaps(opened.note, opened.phrase),
      `${viewport.width}px build note overlaps the expanding phrase`,
    );
    assert.ok(
      opened.portraitOpacity < .05 || !overlaps(opened.note, opened.portrait),
      `${viewport.width}px build note overlaps the portrait`,
    );

    await page.close();
  });
}

test.after(async () => {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
});
