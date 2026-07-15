import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const section = document.querySelector("[data-work='accommodation']");
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, sectionTop - (window.innerHeight * .97));
  });
  await page.waitForFunction(() => {
    const video = document.querySelector("[data-accommodation-scrub]");
    return video?.dataset.scrubLoaded === "true" && video.readyState >= 1 && Number.isFinite(video.duration);
  });
  const accommodationStart = await page.$eval("[data-accommodation-scrub]", (video) => video.currentTime);
  await page.evaluate(() => {
    const section = document.querySelector("[data-work='accommodation']");
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, sectionTop - (window.innerHeight * .45));
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const accommodationMotion = await page.evaluate(() => {
    const video = document.querySelector("[data-accommodation-scrub]");
    const object = document.querySelector("[data-scroll-reveal='accommodation']");
    const section = document.querySelector("[data-work='accommodation']");
    return {
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
      progress: getComputedStyle(object).getPropertyValue("--object-reveal").trim(),
      sectionTop: section.getBoundingClientRect().top,
      scrollY: window.scrollY,
    };
  });
  assert.ok(
    accommodationMotion.currentTime > accommodationStart + 1,
    `ordinary page scroll did not advance the boutique source recording from ${accommodationStart}: ${JSON.stringify(accommodationMotion)}`,
  );
  assert.equal(await page.$$eval("[data-accommodation-previous], [data-accommodation-next]", (nodes) => nodes.length), 0);
  await page.$eval("[data-accommodation-viewer]", (viewer) => viewer.scrollIntoView({ block: "center" }));
  await new Promise((resolve) => setTimeout(resolve, 120));
  const accommodationBeforeWheel = await page.evaluate(() => ({
    scrollY: window.scrollY,
    time: document.querySelector("[data-accommodation-scrub]").currentTime,
    bounds: document.querySelector("[data-accommodation-viewer]").getBoundingClientRect().toJSON(),
  }));
  const accommodationWheelTarget = await page.evaluate(({ x, y, width, height }) => {
    const centreX = x + width / 2;
    const centreY = y + height / 2;
    return {
      centreX,
      centreY,
      viewportHeight: window.innerHeight,
      hitsViewer: Boolean(document.elementFromPoint(centreX, centreY)?.closest("[data-accommodation-viewer]")),
    };
  }, accommodationBeforeWheel.bounds);
  assert.ok(
    accommodationWheelTarget.hitsViewer,
    `accommodation wheel target is outside the visible viewer: ${JSON.stringify({ bounds: accommodationBeforeWheel.bounds, target: accommodationWheelTarget })}`,
  );
  await page.mouse.move(
    accommodationBeforeWheel.bounds.x + accommodationBeforeWheel.bounds.width / 2,
    accommodationBeforeWheel.bounds.y + accommodationBeforeWheel.bounds.height / 2,
  );
  await page.mouse.wheel({ deltaY: 520 });
  await new Promise((resolve) => setTimeout(resolve, 180));
  const accommodationAfterWheel = await page.evaluate(() => ({
    scrollY: window.scrollY,
    time: document.querySelector("[data-accommodation-scrub]").currentTime,
  }));
  assert.equal(accommodationAfterWheel.scrollY, accommodationBeforeWheel.scrollY, "wheel over accommodation must not move the page");
  assert.ok(accommodationAfterWheel.time > accommodationBeforeWheel.time, "wheel over accommodation must advance the preview");
  await page.mouse.move(8, 450);
  await page.mouse.wheel({ deltaY: 520 });
  await new Promise((resolve) => setTimeout(resolve, 180));
  assert.ok(await page.evaluate((before) => window.scrollY > before, accommodationAfterWheel.scrollY), "wheel outside accommodation must move the page");

  const reducedPage = await browser.newPage();
  const reducedVideoRequests = [];
  reducedPage.on("request", (request) => {
    if (/\.(?:mp4|webm)(?:$|\?)/.test(request.url())) reducedVideoRequests.push(request.url());
  });
  await reducedPage.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reducedPage.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  requestPaths.length = 0;
  await reducedPage.goto(url, { waitUntil: "domcontentloaded" });
  assert.equal(await reducedPage.$$eval("[data-motion-video]", (videos) => videos.every((video) => video.paused && video.dataset.motionLoaded !== "true")), true);
  assert.deepEqual(reducedVideoRequests, []);
  assert.equal(await reducedPage.$$eval("[data-motion-video]", (videos) => videos.every((video) => !video.matches("[role='button'], [tabindex]"))), true);
  await reducedPage.close();

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
  await page.$eval("[data-work='rccv']", (node) => node.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => {
    const video = document.querySelector("#motion-video-rccv");
    return video?.dataset.motionLoaded === "true" && video.readyState >= 2;
  });
  await page.evaluate(() => document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
  const motionStart = await page.$eval("#motion-video-rccv", (video) => video.currentTime);
  await page.waitForFunction((start) => {
    const video = document.querySelector("#motion-video-rccv");
    return !video.paused && video.currentTime > start + .2;
  }, {}, motionStart);

  await page.$eval("[data-work='cool-runnings']", (node) => node.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => {
    const video = document.querySelector("#motion-video-cool-runnings");
    return video?.dataset.motionLoaded === "true" && video.readyState >= 2;
  });
  const coolMotionStart = await page.$eval("#motion-video-cool-runnings", (video) => video.currentTime);
  await page.waitForFunction((start) => {
    const video = document.querySelector("#motion-video-cool-runnings");
    return !video.paused && video.currentTime > start + .2;
  }, {}, coolMotionStart);

  await page.$eval("[data-work='elevators']", (node) => node.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-scroll-reveal='elevators']")).getPropertyValue("--object-reveal")) > .25);
  assert.ok(await page.$eval("[data-scroll-reveal='elevators']", (node) => Number.parseFloat(getComputedStyle(node).getPropertyValue("--object-reveal")) > .25), "elevator browser did not rotate up with scroll progress");

  await page.$eval(".workflow-accordion", (node) => node.scrollIntoView({ block: "center" }));
  const accordionStartWidths = await page.$$eval(".workflow-item", (items) => items.map((item) => item.getBoundingClientRect().width));
  await page.click("[data-workflow-trigger='dashboard']");
  await page.waitForFunction(() => document.querySelector("[data-workflow-trigger='dashboard']")?.getAttribute("aria-expanded") === "true");
  await new Promise((resolve) => setTimeout(resolve, 90));
  const transitionWidths = await page.$$eval(".workflow-item", (items) => items.map((item) => item.getBoundingClientRect().width));
  assert.ok(transitionWidths[0] > 64 && transitionWidths[0] < accordionStartWidths[0], "closing workflow panel did not interpolate its width");
  assert.ok(transitionWidths[1] > 64 && transitionWidths[1] < accordionStartWidths[0], "opening workflow panel did not interpolate its width");

  const aboutStoryPosition = await page.$eval("[data-about-scroll-story]", (story) => ({
    top: story.getBoundingClientRect().top + window.scrollY,
    travel: story.offsetHeight - window.innerHeight,
  }));
  await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .72), aboutStoryPosition);
  await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-line")) > .8);
  await page.waitForFunction(() => {
    const contextOpacity = Number.parseFloat(getComputedStyle(document.querySelector(".about-context")).opacity);
    const phraseSize = Number.parseFloat(getComputedStyle(document.querySelector(".about-questionable")).fontSize);
    return contextOpacity < .08 && phraseSize >= 44 && phraseSize <= 62;
  });
  assert.ok(Math.abs(await page.$eval(".about-story-sticky", (node) => node.getBoundingClientRect().top)) < 2, "About story did not remain locked during its reveal");
  assert.ok(await page.$eval(".about-context", (node) => Number.parseFloat(getComputedStyle(node).opacity) < .08), "About context did not fade while the phrase expanded");
  assert.ok(await page.$eval(".about-questionable", (node) => {
    const size = Number.parseFloat(getComputedStyle(node).fontSize);
    return size >= 44 && size <= 62;
  }), "About phrase did not reach its capped standalone size");
  assert.ok(await page.$eval(".about-questionable", (node) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).a - 1) < .02), "About phrase still uses a rasterizing scale transform");
  await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .9), aboutStoryPosition);
  await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-value")) > .95);
  assert.ok(await page.$eval(".about-process-reveal", (node) => Number.parseFloat(getComputedStyle(node).opacity) > .95), "About process conclusion did not resolve before the section released");
  await page.waitForSelector(".portrait-frame.is-loaded");
  const portraitGeometry = await page.$eval(".portrait-frame", (frame) => frame.getBoundingClientRect().toJSON());
  const portraitFrameHandle = await page.$(".portrait-frame iframe");
  const portraitContentFrame = await portraitFrameHandle.contentFrame();
  const portraitCountBefore = await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0);
  await page.mouse.move(40, 300);
  await page.mouse.move(
    portraitGeometry.x + portraitGeometry.width / 2,
    portraitGeometry.y + portraitGeometry.height / 2,
    { steps: 8 },
  );
  await new Promise((resolve) => setTimeout(resolve, 120));
  const portraitCountAfter = await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0);
  assert.ok(portraitCountAfter > portraitCountBefore, "portrait must keep receiving parent coordinates over its iframe");
  assert.equal(await page.$eval(".portrait-frame iframe", (iframe) => getComputedStyle(iframe).pointerEvents), "none", "portrait iframe must not create a second pointer surface");
  await page.evaluate(() => window.scrollBy(0, 120));
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0), portraitCountAfter, "scroll alone must not change the portrait pose");

  await page.$eval("#resume", (node) => node.scrollIntoView({ block: "center" }));
  const experienceCenters = await page.$$eval(".experience-ledger article", (items) => items.map((item) => {
    const bounds = item.getBoundingClientRect();
    const heading = item.querySelector("h3").getBoundingClientRect();
    return { itemCenter: bounds.left + bounds.width / 2, headingCenter: heading.left + heading.width / 2 };
  }));
  assert.ok(experienceCenters.every(({ itemCenter, headingCenter }) => Math.abs(itemCenter - headingCenter) < 2), "Experience company names are not centred on their rows");

  const finalePosition = await page.$eval("[data-contact-story]", (story) => ({
    top: story.getBoundingClientRect().top + window.scrollY,
    travel: story.offsetHeight - window.innerHeight,
  }));
  const scrollFinale = (progress) => page.evaluate(
    ({ top, travel, progress: nextProgress }) => window.scrollTo(0, top + travel * nextProgress),
    { ...finalePosition, progress },
  );
  await scrollFinale(.3);
  await new Promise((resolve) => setTimeout(resolve, 100));
  const transformA = await page.$eval("[data-contact-object]", (item) => item.style.transform);
  await scrollFinale(.42);
  await scrollFinale(.3);
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(await page.$eval("[data-contact-object]", (item) => item.style.transform), transformA, "pre-release spiral must be reversible and deterministic");
  await scrollFinale(.6);
  await page.waitForFunction(() => Math.abs(document.querySelector("[data-contact-stage]").getBoundingClientRect().top) < 2);
  assert.ok(Math.abs(await page.$eval("[data-contact-stage]", (stage) => stage.getBoundingClientRect().top)) < 2, "contact stage must pin to the viewport before physics releases");
  await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.finaleState === "settled", { timeout: 8000 });
  assert.ok(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.releaseDelta)) <= .5, "physics bodies must inherit the final spiral positions without a jump");
  await new Promise((resolve) => setTimeout(resolve, 1200));
  assert.equal(await page.$eval("[data-contact-morph-after]", (node) => node.textContent.trim()), "Let’s build something useful.");
  assert.ok(await page.$eval("[data-contact-morph-after]", (node) => Number(getComputedStyle(node).opacity)) > .8, "final text must resolve after settle");
  assert.ok(await page.$eval(".contact-actions", (node) => Number(getComputedStyle(node).opacity)) > .8, "contact actions must resolve after the text morph");
  assert.ok(await page.$eval(".contact-instruction", (node) => Number(getComputedStyle(node).opacity)) < .05, "scroll instruction must stay hidden after the finale settles");
  assert.ok(await page.evaluate(() => {
    const heading = document.querySelector("[data-contact-morph-after]").getBoundingClientRect();
    const actions = document.querySelector(".contact-actions").getBoundingClientRect();
    return actions.top >= heading.bottom + 16;
  }), "contact actions must not overlap the resolved multiline heading");
  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDirectory, "finale-settled-desktop.png") });
  }
  const draggable = await page.$$eval("[data-contact-object]", (items) => {
    const topmost = [...items].reverse().find((item) => {
      const rect = item.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return hit?.closest("[data-contact-object]") === item;
    });
    if (!topmost) return null;
    return {
      key: topmost.dataset.contactObject,
      rect: topmost.getBoundingClientRect().toJSON(),
      transform: topmost.style.transform,
    };
  });
  assert.ok(draggable, "settled finale must expose at least one draggable object");
  await page.mouse.move(draggable.rect.x + draggable.rect.width / 2, draggable.rect.y + draggable.rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    draggable.rect.x + draggable.rect.width / 2 + 80,
    draggable.rect.y + draggable.rect.height / 2 - 40,
    { steps: 6 },
  );
  await page.mouse.up();
  await new Promise((resolve) => setTimeout(resolve, 120));
  assert.notEqual(
    await page.$eval(`[data-contact-object="${draggable.key}"]`, (item) => item.style.transform),
    draggable.transform,
    "settled objects must be draggable",
  );
  await scrollFinale(1);
  await new Promise((resolve) => setTimeout(resolve, 120));
  assert.ok(await page.$eval(".site-footer", (footer) => footer.getBoundingClientRect().top <= window.innerHeight + 2), "continued scroll must release the sticky finale into the footer");

  const filePage = await browser.newPage();
  await filePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await filePage.goto(pathToFileURL(path.join(root, "v2/index.html")).href, { waitUntil: "domcontentloaded" });
  await filePage.$eval("[data-work='rccv']", (node) => node.scrollIntoView({ block: "center" }));
  await filePage.waitForFunction(() => document.querySelector("#motion-video-rccv")?.dataset.motionLoaded === "true");
  const fileMotionStart = await filePage.$eval("#motion-video-rccv", (video) => video.currentTime);
  await filePage.waitForFunction((start) => {
    const video = document.querySelector("#motion-video-rccv");
    return !video.paused && video.currentTime > start + .2;
  }, {}, fileMotionStart);
  await filePage.close();

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const geometry = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(geometry.scrollWidth <= geometry.innerWidth, `${width}px viewport overflows by ${geometry.scrollWidth - geometry.innerWidth}px`);
    const accommodationGeometry = await page.evaluate(() => {
      const cue = document.querySelector(".accommodation-scroll-cue").getBoundingClientRect();
      const browser = document.querySelector("[data-accommodation-viewer]").getBoundingClientRect();
      const scrub = document.querySelector("[data-accommodation-scrub]");
      const fallback = document.querySelector("[data-accommodation-fallback]");
      return {
        cueLeft: cue.left,
        cueRight: cue.right,
        cueBottom: cue.bottom,
        browserTop: browser.top,
        scrubDisplay: getComputedStyle(scrub).display,
        fallbackDisplay: getComputedStyle(fallback).display,
      };
    });
    assert.ok(accommodationGeometry.cueLeft >= -1 && accommodationGeometry.cueRight <= width + 1, `${width}px accommodation cue is clipped horizontally`);
    assert.ok(accommodationGeometry.cueBottom <= accommodationGeometry.browserTop + 24, `${width}px accommodation cue is detached from the browser top`);
    assert.equal(accommodationGeometry.scrubDisplay, "none", `${width}px reduced-motion accommodation video should be hidden`);
    assert.notEqual(accommodationGeometry.fallbackDisplay, "none", `${width}px reduced-motion accommodation fallback should be visible`);
    const finaleGeometry = await page.evaluate(() => {
      const stageBounds = document.querySelector("[data-contact-stage]").getBoundingClientRect();
      const headingBounds = document.querySelector("[data-contact-morph-after]").getBoundingClientRect();
      const actionBounds = document.querySelector(".contact-actions").getBoundingClientRect();
      return { stage: stageBounds.toJSON(), heading: headingBounds.toJSON(), actions: actionBounds.toJSON() };
    });
    assert.ok(finaleGeometry.heading.left >= -1 && finaleGeometry.heading.right <= width + 1, `${width}px finale heading overflows`);
    assert.ok(finaleGeometry.actions.left >= -1 && finaleGeometry.actions.right <= width + 1, `${width}px finale actions overflow`);
    assert.ok(finaleGeometry.actions.bottom <= finaleGeometry.stage.bottom + 1, `${width}px finale actions fall below the stage`);
    if (screenshotDirectory) {
      await mkdir(screenshotDirectory, { recursive: true });
      await page.$eval("[data-contact-stage]", (stage) => stage.scrollIntoView({ block: "center" }));
      await page.waitForFunction(() => [...document.querySelectorAll("[data-contact-object] img")]
        .filter((image) => getComputedStyle(image.closest("[data-contact-object]")).display !== "none")
        .every((image) => image.complete));
      await page.evaluate(() => document.activeElement?.blur());
      await page.screenshot({ path: path.join(screenshotDirectory, `v2-${width}.png`), fullPage: true });
    }
  }

  for (const width of [1024, 900, 768]) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const restingType = await page.$eval(".about-questionable", (phrase) => {
      const phraseStyle = getComputedStyle(phrase);
      const paragraphStyle = getComputedStyle(phrase.closest("p"));
      return {
        phraseFamily: phraseStyle.fontFamily,
        paragraphFamily: paragraphStyle.fontFamily,
        phraseSize: phraseStyle.fontSize,
        paragraphSize: paragraphStyle.fontSize,
        phraseColor: phraseStyle.color,
        paragraphColor: paragraphStyle.color,
      };
    });
    assert.deepEqual(restingType, {
      ...restingType,
      phraseFamily: restingType.paragraphFamily,
      phraseSize: restingType.paragraphSize,
      phraseColor: restingType.paragraphColor,
    }, `${width}px About phrase is styled before its scroll beat`);

    const position = await page.$eval("[data-about-scroll-story]", (story) => ({
      top: story.getBoundingClientRect().top + window.scrollY,
      travel: story.offsetHeight - window.innerHeight,
    }));
    await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .5), position);
    await page.waitForFunction(() => document.querySelector("[data-about-stage]")?.classList.contains("is-about-focused"));
    const aboutGeometry = await page.evaluate(() => {
      const phrase = document.querySelector(".about-questionable").getBoundingClientRect();
      const portrait = document.querySelector(".portrait-object").getBoundingClientRect();
      return { phraseRight: phrase.right, portraitLeft: portrait.left, phraseWidth: phrase.width };
    });
    assert.ok(aboutGeometry.phraseWidth > 0, `${width}px About phrase collapsed during its scroll beat`);
    assert.ok(aboutGeometry.phraseRight <= aboutGeometry.portraitLeft + 1, `${width}px About phrase overlaps the portrait`);
  }

  if (screenshotDirectory) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const work = await page.$("#work");
    await work.screenshot({ path: path.join(screenshotDirectory, "work-desktop.png") });

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
        await page.$eval(`[data-workflow-trigger='${key}']`, (trigger) => trigger.click());
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

      for (const sectionName of ["method", "about", "resume"]) {
        await page.evaluate(() => document.activeElement?.blur());
        const section = await page.$(`#${sectionName}`);
        await section.evaluate((node) => node.scrollIntoView({ block: "center" }));
        if (sectionName === "method") {
          await page.waitForFunction(() => document.querySelector(".bias-sequence")?.classList.contains("is-revealed"));
          await new Promise((resolve) => setTimeout(resolve, 1150));
        }
        if (sectionName === "about" && width >= 1100) {
          const position = await page.$eval("[data-about-scroll-story]", (story) => ({
            top: story.getBoundingClientRect().top + window.scrollY,
            travel: story.offsetHeight - window.innerHeight,
          }));
          await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .9), position);
          await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-value")) > .95);
          const sticky = await page.$(".about-story-sticky");
          await sticky.screenshot({ path: path.join(screenshotDirectory, `${sectionName}-${label}.png`) });
        } else {
          await section.screenshot({ path: path.join(screenshotDirectory, `${sectionName}-${label}.png`) });
        }
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

  const caseFailures = [];
  const recordCaseFailure = (response) => {
    if (response.url().startsWith(`http://127.0.0.1:${port}/`) && response.status() >= 400) {
      caseFailures.push(`${response.status()} ${response.url()}`);
    }
  };
  page.on("response", recordCaseFailure);
  for (const width of [1440, 1024, 768, 390]) {
    caseFailures.length = 0;
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/v2/work/local-search-magnet.html`, { waitUntil: "networkidle0" });
    const caseStudy = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heading: document.querySelector("h1")?.textContent.trim(),
      clicks: document.querySelector("[data-cool-metric='clicks']")?.textContent.trim(),
      metricWindow: document.querySelector("[data-cool-metrics-window]")?.textContent.trim(),
      review: document.querySelector("#review-title")?.textContent.trim(),
    }));
    assert.ok(caseStudy.heading, `${width}px local-search case study is missing its heading`);
    assert.ok(caseStudy.scrollWidth <= caseStudy.innerWidth, `${width}px local-search case study overflows by ${caseStudy.scrollWidth - caseStudy.innerWidth}px`);
    assert.equal(caseStudy.clicks, "189", `${width}px local-search case study did not load current metrics`);
    assert.match(caseStudy.metricWindow, /June 15, 2026 to July 12, 2026/, `${width}px local-search metric window is stale`);
    assert.match(caseStudy.review, /Human review/, `${width}px local-search case study omits its review boundary`);
    assert.deepEqual(caseFailures, [], `${width}px local-search case study has failed local assets`);
    if (screenshotDirectory && [1440, 390].includes(width)) {
      await page.screenshot({ path: path.join(screenshotDirectory, `v2-local-search-magnet-${width}.png`), fullPage: true });
      const label = width === 1440 ? "desktop" : "mobile";
      await (await page.$(".case-hero")).screenshot({ path: path.join(screenshotDirectory, `local-search-hero-${label}.png`) });
      await (await page.$(".results")).screenshot({ path: path.join(screenshotDirectory, `local-search-results-${label}.png`) });
    }
  }
  page.off("response", recordCaseFailure);

  console.log("V2 browser QA passed: homepage interactions, five workflow routes, local-search case study, and responsive overflow checks.");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
