import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshotDirectory = process.env.QA_V2_SCREENSHOT_DIR;
const requestPaths = [];
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    requestPaths.push(pathname);
    const relativePath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    const filePath = path.resolve(root, `.${relativePath}`);
    if (!filePath.startsWith(root)) throw new Error("Path outside QA root");
    const details = await stat(filePath);
    const range = request.headers.range?.match(/bytes=(\d+)-(\d*)/);
    const headers = {
      "Accept-Ranges": "bytes",
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    };

    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Number(range[2]) : details.size - 1;
      response.writeHead(206, {
        ...headers,
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${details.size}`,
      });
      createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, { ...headers, "Content-Length": details.size });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}/v2/`;
const detailRoutes = [
  "content-production.html",
  "agency-management-dashboard.html",
  "presentation-publishing.html",
  "local-prospecting-enrichment.html",
  "image-to-website-production.html",
];
let browser;

try {
  browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--autoplay-policy=no-user-gesture-required"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  requestPaths.length = 0;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(
    requestPaths.some((requestPath) => requestPath.includes("portfolio-hero-system-map-desktop")),
    true,
    "visible hero system-map video did not load",
  );
  for (const deferredShowcase of ["rccv-showcase-laptop", "cool-runnings-sizzle-25s"]) {
    assert.equal(
      requestPaths.some((requestPath) => requestPath.includes(deferredShowcase)),
      false,
      `${deferredShowcase} loaded before its section entered the viewport`,
    );
  }

  const initialWorkflowState = await page.evaluate(() => {
    const panel = document.querySelector("[data-workflow-panel='dashboard']");
    const link = panel.querySelector("button, a");
    link.focus();
    return {
      focusBlocked: document.activeElement !== link,
      inert: panel.inert,
      ariaHidden: panel.getAttribute("aria-hidden"),
    };
  });
  assert.deepEqual(initialWorkflowState, { focusBlocked: true, inert: true, ariaHidden: "true" });

  await page.click("[data-workflow-trigger='dashboard']");
  await page.waitForFunction(() => {
    const heading = document.querySelector("[data-workflow-panel='dashboard'] h3");
    return heading && getComputedStyle(heading).opacity !== "0";
  });
  assert.deepEqual(await page.evaluate(() => {
    const active = document.querySelector("[data-workflow-panel='dashboard']");
    const inactive = document.querySelector("[data-workflow-panel='content']");
    const heading = active.querySelector("h3");
    return {
      activeInert: active.inert,
      activeHidden: active.getAttribute("aria-hidden"),
      inactiveInert: inactive.inert,
      inactiveHidden: inactive.getAttribute("aria-hidden"),
      headingVisible: heading.getBoundingClientRect().height > 0,
      headingFont: getComputedStyle(heading).fontFamily,
    };
  }), {
    activeInert: false,
    activeHidden: "false",
    inactiveInert: true,
    inactiveHidden: "true",
    headingVisible: true,
    headingFont: 'Fraunces, Georgia, serif',
  });
  await page.waitForFunction(() => !document.querySelector("[data-workflow-accordion]")?.hasAttribute("data-workflow-transitioning"));
  assert.equal(await page.$$eval(".workflow-item:not(.is-active) .workflow-panel", (panels) => (
    panels.every((panel) => panel.getBoundingClientRect().height === 0)
  )), true, "closed vertical workflow panels leak content height");

  await page.click("[data-workflow-trigger='content']");
  await page.keyboard.press("ArrowDown");
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.workflowTrigger), "dashboard");

  await page.waitForFunction(() => document.querySelector("[data-accommodation-viewer]")?.dataset.frameIndex === "0");
  await page.click("[data-accommodation-next]");
  assert.equal(await page.$eval("[data-accommodation-viewer]", (node) => node.dataset.frameIndex), "1");
  await page.click("[data-accommodation-previous]");
  assert.equal(await page.$eval("[data-accommodation-viewer]", (node) => node.dataset.frameIndex), "0");
  await page.focus("[data-accommodation-viewer]");
  await page.keyboard.press("End");
  assert.equal(await page.$eval("[data-accommodation-viewer]", (node) => node.dataset.frameIndex), "68");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.$eval("[data-accommodation-viewer]", (node) => node.dataset.frameIndex), "1");

  const wheelResults = await page.evaluate(() => {
    const viewer = document.querySelector("[data-accommodation-viewer]");
    viewer.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    const releasedAtStart = viewer.dispatchEvent(new WheelEvent("wheel", { deltaY: -1, deltaMode: 1, bubbles: true, cancelable: true }));
    const capturedInside = viewer.dispatchEvent(new WheelEvent("wheel", { deltaY: 1, deltaMode: 1, bubbles: true, cancelable: true }));
    const indexAfterLineWheel = viewer.dataset.frameIndex;
    viewer.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    const releasedAtEnd = viewer.dispatchEvent(new WheelEvent("wheel", { deltaY: 1, deltaMode: 2, bubbles: true, cancelable: true }));
    return { releasedAtStart, capturedInside, indexAfterLineWheel, releasedAtEnd };
  });
  assert.deepEqual(wheelResults, {
    releasedAtStart: true,
    capturedInside: false,
    indexAfterLineWheel: "1",
    releasedAtEnd: true,
  });

  const reducedPage = await browser.newPage();
  await reducedPage.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reducedPage.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  requestPaths.length = 0;
  await reducedPage.goto(url, { waitUntil: "domcontentloaded" });
  assert.equal(await reducedPage.$$eval("[data-motion-video]", (videos) => videos.every((video) => video.paused && !video.autoplay)), true);
  assert.equal(requestPaths.some((requestPath) => /\.(?:mp4|webm)$/.test(requestPath)), false);
  assert.equal(await reducedPage.$$eval("[data-motion-video]", (videos) => videos.every((video) => !video.matches("[role='button'], [tabindex]"))), true);
  await reducedPage.close();

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const geometry = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(geometry.scrollWidth <= geometry.innerWidth, `${width}px viewport overflows by ${geometry.scrollWidth - geometry.innerWidth}px`);
    if (screenshotDirectory) {
      await mkdir(screenshotDirectory, { recursive: true });
      await page.screenshot({ path: path.join(screenshotDirectory, `v2-${width}.png`), fullPage: true });
    }
  }

  if (screenshotDirectory) {
    const workflowKeys = ["content", "dashboard", "presentation", "prospecting", "website"];
    for (const { label, width } of [{ label: "desktop", width: 1440 }, { label: "mobile", width: 390 }]) {
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
      await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => document.activeElement?.blur());
      await page.addStyleTag({ content: ".skip-link { display: none !important; }" });

      const hero = await page.$(".hero");
      const heroFilename = label === "desktop" ? "hero-desktop.png" : "hero-mobile.png";
      const workflowScreenshotPrefix = label === "desktop" ? "workflow-desktop-" : "workflow-mobile-";
      await hero.screenshot({ path: path.join(screenshotDirectory, heroFilename) });

      const accommodationFilename = label === "desktop" ? "work-desktop-accommodation.png" : "work-mobile-accommodation.png";
      const accommodationWork = await page.$("[data-work='accommodation']");
      await accommodationWork.screenshot({ path: path.join(screenshotDirectory, accommodationFilename) });

      for (const key of workflowKeys) {
        await page.click(`[data-workflow-trigger='${key}']`);
        await page.waitForFunction((activeKey) => (
          document.querySelector(`[data-workflow-trigger='${activeKey}']`)?.getAttribute("aria-expanded") === "true"
        ), {}, key);
        await page.waitForFunction((activeKey) => {
          const panel = document.querySelector(`[data-workflow-panel='${activeKey}']`);
          const heading = document.querySelector(`[data-workflow-panel='${activeKey}'] h3`);
          const panelStyle = panel && getComputedStyle(panel);
          return heading
            && heading.getBoundingClientRect().height > 0
            && panelStyle.opacity === "1"
            && panelStyle.visibility === "visible";
        }, {}, key);
        await page.waitForFunction(() => !document.querySelector("[data-workflow-accordion]")?.hasAttribute("data-workflow-transitioning"));
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const screenshotPath = path.join(screenshotDirectory, `${workflowScreenshotPrefix}${key}.png`);
        const accordion = await page.$(".workflow-accordion");
        await accordion.screenshot({ path: screenshotPath });
      }

      for (const sectionName of ["method", "about"]) {
        await page.evaluate(() => document.activeElement?.blur());
        const section = await page.$(`#${sectionName}`);
        await section.screenshot({ path: path.join(screenshotDirectory, `${sectionName}-${label}.png`) });
      }
    }
  }

  const detailFailures = [];
  const recordDetailFailure = (response) => {
    if (response.url().startsWith(`http://127.0.0.1:${port}/`) && response.status() >= 400) {
      detailFailures.push(`${response.status()} ${response.url()}`);
    }
  };
  page.on("response", recordDetailFailure);
  await page.setCacheEnabled(false);

  for (const route of detailRoutes) {
    for (const width of [1440, 1024, 768, 390, 320]) {
      detailFailures.length = 0;
      requestPaths.length = 0;
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await page.goto(`http://127.0.0.1:${port}/v2/workflows/${route}`, { waitUntil: "domcontentloaded" });
      const detail = await page.evaluate(async () => {
        await document.fonts.ready;
        const image = document.querySelector(".workflow-artwork img");
        if (!image.complete) await image.decode();
        return {
          heading: document.querySelector("h1")?.textContent.trim(),
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          imageComplete: image.complete,
          currentSource: new URL(image.currentSrc).pathname,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          stepCount: document.querySelectorAll(".workflow-step").length,
          contractComplete: ["why-it-exists", "how-it-works", "tools-and-sources", "what-ships", "human-review", "proof-and-constraints", "related-work"]
            .every((id) => document.getElementById(id)),
        };
      });

      assert.ok(detail.heading, `${route} is missing its heading`);
      assert.ok(detail.scrollWidth <= detail.innerWidth, `${width}px ${route} overflows by ${detail.scrollWidth - detail.innerWidth}px`);
      assert.equal(detail.imageComplete, true, `${width}px ${route} artwork did not load`);
      assert.ok(detail.stepCount >= 5, `${route} exposes only ${detail.stepCount} workflow steps`);
      assert.equal(detail.contractComplete, true, `${route} is missing part of the workflow contract`);
      assert.deepEqual(detailFailures, [], `${width}px ${route} has failed local assets`);
      assert.ok(requestPaths.some((requestPath) => requestPath.endsWith("dm-sans-latin-variable.woff2")), `${width}px ${route} did not request local DM Sans`);

      if (route === "presentation-publishing.html") {
        const mobile = width < 700;
        const expectedAsset = mobile ? "presentation-publishing-mobile.png" : "presentation-publishing-desktop.png";
        const expectedDimensions = mobile ? [900, 1600] : [1800, 1100];
        assert.ok(detail.currentSource.endsWith(expectedAsset), `${width}px selected ${detail.currentSource} instead of ${expectedAsset}`);
        assert.deepEqual([detail.naturalWidth, detail.naturalHeight], expectedDimensions, `${width}px presentation artwork dimensions are wrong`);
      }

      if (screenshotDirectory && [1440, 390].includes(width)) {
        await mkdir(screenshotDirectory, { recursive: true });
        await page.screenshot({ path: path.join(screenshotDirectory, `v2-${path.basename(route, ".html")}-${width}.png`), fullPage: true });
      }
    }
  }
  page.off("response", recordDetailFailure);

  console.log("V2 browser QA passed: homepage interactions plus five detailed workflow routes and overflow at 5 viewport widths.");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
