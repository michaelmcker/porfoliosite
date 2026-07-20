import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const currentCoolMetrics = JSON.parse(
  await readFile(path.join(root, "data/cool-runnings-metrics-current.json"), "utf8"),
);
const expectedCaseClicks = String(currentCoolMetrics.metrics.searchConsole.clicks);
const formatMetricDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${value}T12:00:00Z`));
const expectedMetricWindow = [
  formatMetricDate(currentCoolMetrics.windows.searchConsole.startDate),
  formatMetricDate(currentCoolMetrics.windows.searchConsole.endDate),
].join(" to ");
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshotDirectory = process.env.QA_V2_SCREENSHOT_DIR;
const leanScreenshots = process.env.QA_V2_SCREENSHOT_MODE === "lean";
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
  await page.waitForFunction(() => {
    const video = document.querySelector("#motion-video-hero");
    return video?.currentTime > .1 && video.closest(".hero-system-media")?.classList.contains("is-video-playing");
  });
  const desktopHeroGeometry = await page.$eval(".hero-system-media", (media) => {
    const video = media.querySelector("video");
    const overlay = media.querySelector(".hero-video-copy");
    const videoRect = video.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    return {
      source: video.currentSrc,
      ratio: video.offsetWidth / video.offsetHeight,
      overlayDelta: {
        left: Math.abs(videoRect.left - overlayRect.left),
        top: Math.abs(videoRect.top - overlayRect.top),
        width: Math.abs(videoRect.width - overlayRect.width),
        height: Math.abs(videoRect.height - overlayRect.height),
      },
    };
  });
  assert.match(desktopHeroGeometry.source, /portfolio-hero-system-map-desktop-1080p\.mp4/);
  assert.ok(Math.abs(desktopHeroGeometry.ratio - (16 / 9)) < .02, `desktop hero video is still cropped: ${JSON.stringify(desktopHeroGeometry)}`);
  assert.ok(Object.values(desktopHeroGeometry.overlayDelta).every((delta) => delta <= 1), `desktop hero labels do not share the video box: ${JSON.stringify(desktopHeroGeometry)}`);
  await page.$eval("#motion-video-hero", (video) => video.dispatchEvent(new Event("waiting")));
  assert.equal(await page.$eval(".hero-video-copy", (copy) => Number(getComputedStyle(copy).opacity)), 0, "hero labels remain visible while the video is waiting");
  await page.$eval("#motion-video-hero", (video) => video.dispatchEvent(new Event("playing")));
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".hero-video-copy")).opacity) === 1);

  const mobileHeroPage = await browser.newPage();
  await mobileHeroPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobileHeroPage.goto(url, { waitUntil: "domcontentloaded" });
  await mobileHeroPage.waitForFunction(() => {
    const video = document.querySelector("#motion-video-hero");
    return video?.currentTime > .1 && video.closest(".hero-system-media")?.classList.contains("is-video-playing");
  });
  const mobileHeroGeometry = await mobileHeroPage.$eval(".hero-system-media", (media) => {
    const video = media.querySelector("video");
    const overlay = media.querySelector(".hero-video-copy");
    const videoRect = video.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    return {
      source: video.currentSrc,
      ratio: video.offsetWidth / video.offsetHeight,
      overlayDelta: {
        left: Math.abs(videoRect.left - overlayRect.left),
        top: Math.abs(videoRect.top - overlayRect.top),
        width: Math.abs(videoRect.width - overlayRect.width),
        height: Math.abs(videoRect.height - overlayRect.height),
      },
    };
  });
  assert.match(mobileHeroGeometry.source, /portfolio-hero-system-map-mobile-1080p\.mp4/);
  assert.ok(Math.abs(mobileHeroGeometry.ratio - (9 / 16)) < .02, `mobile hero video is still cropped: ${JSON.stringify(mobileHeroGeometry)}`);
  assert.ok(Object.values(mobileHeroGeometry.overlayDelta).every((delta) => delta <= 1), `mobile hero labels do not share the video box: ${JSON.stringify(mobileHeroGeometry)}`);
  await mobileHeroPage.close();
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
  await new Promise((resolve) => setTimeout(resolve, 80));
  const accommodationStart = await page.$eval("[data-scroll-reveal='accommodation']", (object) => ({
    progress: Number.parseFloat(getComputedStyle(object).getPropertyValue("--object-reveal")) || 0,
    transform: getComputedStyle(object).transform,
  }));
  const accommodationFrameHandle = await page.waitForSelector("[data-accommodation-page]");
  const accommodationFrame = await accommodationFrameHandle.contentFrame();
  await accommodationFrame.waitForSelector("[data-okanagan-scene='cabin']");
  await accommodationFrame.waitForFunction(() => {
    const video = document.querySelector("[data-okanagan-scene='overview'] [data-hero-video]");
    return video?.readyState >= 1 && Number.isFinite(video.duration);
  });
  await page.evaluate(() => {
    const section = document.querySelector("[data-work='accommodation']");
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, sectionTop - (window.innerHeight - section.offsetHeight) / 2);
  });
  await new Promise((resolve) => setTimeout(resolve, 120));
  const accommodationTop = await accommodationFrame.evaluate(() => ({
    parentScroll: window.parent.scrollY,
    viewportHeight: window.innerHeight,
    maximum: document.documentElement.scrollHeight - window.innerHeight,
    order: [...document.querySelectorAll("[data-okanagan-scene]")].map((scene) => scene.dataset.okanaganScene),
    headings: [...document.querySelectorAll("[data-okanagan-scene] h1")].map((heading) => heading.textContent.trim()),
    navigation: [...document.querySelectorAll("[data-stays-trigger], .site-nav__links > a, .site-nav__cta")].map((link) => ({
      label: link.textContent.trim(),
      display: getComputedStyle(link).display,
    })),
    navGeometry: (() => {
      const rectangle = document.querySelector(".site-nav").getBoundingClientRect();
      const cta = document.querySelector(".site-nav__cta").getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        left: rectangle.left,
        right: rectangle.right,
        ctaRight: cta.right,
      };
    })(),
    stayCards: [...document.querySelectorAll(".nav-mega__card")].map((card) => ({
      name: card.querySelector(".nav-mega__name")?.textContent.trim(),
      price: card.querySelector(".nav-mega__price")?.textContent.trim(),
      summary: card.querySelector(".nav-mega__summary")?.textContent.trim(),
      meta: card.querySelector(".nav-mega__meta")?.textContent.replace(/\s+/g, " ").trim(),
    })),
  }));
  assert.ok(accommodationTop.maximum > accommodationTop.viewportHeight * 5, "boutique browser does not expose three long internal hero timelines");
  assert.deepEqual(accommodationTop.order, ["overview", "treehouse", "cabin"], "boutique hero sequence order changed");
  assert.deepEqual(accommodationTop.headings, ["Nature.Adventure.Stillness.", "The Treehouse", "The Cabin"], "boutique hero headings are not semantic HTML");
  assert.deepEqual(accommodationTop.navigation.map(({ label }) => label), ["Stays", "Things to Do", "Gallery", "Reviews", "About", "FAQ", "Blog", "Book your stay"], "boutique desktop navigation no longer matches the deployed source experience");
  assert.ok(accommodationTop.navigation.every(({ display }) => display !== "none"), "boutique browser is rendering its mobile navigation inside the desktop device");
  assert.ok(accommodationTop.navGeometry.left >= -1, `boutique desktop navigation is clipped on the left: ${JSON.stringify(accommodationTop.navGeometry)}`);
  assert.ok(accommodationTop.navGeometry.right <= accommodationTop.navGeometry.viewportWidth + 1, `boutique desktop navigation is clipped on the right: ${JSON.stringify(accommodationTop.navGeometry)}`);
  assert.ok(accommodationTop.navGeometry.ctaRight <= accommodationTop.navGeometry.viewportWidth + 1, `boutique booking button is clipped: ${JSON.stringify(accommodationTop.navGeometry)}`);
  assert.deepEqual(accommodationTop.stayCards, [
    {
      name: "The Treehouse",
      price: "From $300",
      summary: "Built 16 feet above the ground between Douglas fir trees, this elevated forest stay has a hanging bridge, roof deck, outdoor kitchen, climbing wall, safety nets, and quiet views across the property.",
      meta: "Up to 6 guests★★★★★4.96",
    },
    {
      name: "The Cabin",
      price: "From $275",
      summary: "A warm handcrafted cabin on five private acres with a king loft, bunk room, hide-a-bed, full kitchen, bathtub, Wi-Fi, Netflix TV, and shared hot tub and sauna access by appointment.",
      meta: "Up to 4 guests★★★★★4.68",
    },
  ], "boutique Stays menu copy no longer matches the deployed source");
  await page.waitForFunction(() => document.querySelector("[data-accommodation-url]")?.textContent.trim() === "okanagantreehouse.ca");

  const setSceneProgress = (frame, key, progress) => frame.evaluate(({ key: sceneKey, progress: sceneProgress }) => {
    const scene = document.querySelector(`[data-okanagan-scene='${sceneKey}']`);
    const travel = scene.offsetHeight - window.innerHeight;
    window.scrollTo(0, scene.offsetTop + travel * sceneProgress);
  }, { key, progress });

  await setSceneProgress(accommodationFrame, "overview", .45);
  await accommodationFrame.waitForFunction(() => Number(document.querySelector("[data-okanagan-scene='overview']").dataset.sceneProgress) > .44);
  await accommodationFrame.waitForFunction(() => [...document.querySelectorAll("[data-okanagan-scene='overview'] h1 span, [data-okanagan-scene='overview'] .hero-copy > p, [data-okanagan-scene='overview'] .hero-actions")]
    .every((node) => Number(getComputedStyle(node).opacity) > .95));
  const overviewMiddle = await accommodationFrame.evaluate(() => ({
    currentTime: document.querySelector("[data-okanagan-scene='overview'] [data-hero-video]").currentTime,
    stickyTop: document.querySelector("[data-okanagan-scene='overview'] [data-okanagan-hero]").getBoundingClientRect().top,
  }));
  assert.ok(overviewMiddle.currentTime > 1, `Overview hero movie did not scrub: ${JSON.stringify(overviewMiddle)}`);
  assert.ok(Math.abs(overviewMiddle.stickyTop) < 2, "Overview hero did not stay locked while its movie played");

  await setSceneProgress(accommodationFrame, "treehouse", .52);
  await accommodationFrame.waitForFunction(() => {
    const video = document.querySelector("[data-okanagan-scene='treehouse'] [data-hero-video]");
    return video?.readyState >= 1 && Number.isFinite(video.duration);
  });
  await accommodationFrame.waitForFunction(() => Number(document.querySelector("[data-okanagan-scene='treehouse']").dataset.sceneProgress) > .51);
  await accommodationFrame.waitForFunction(() => [...document.querySelectorAll("[data-okanagan-scene='treehouse'] h1 span, [data-okanagan-scene='treehouse'] .hero-copy > p, [data-okanagan-scene='treehouse'] .stay-meta, [data-okanagan-scene='treehouse'] .hero-actions")]
    .every((node) => Number(getComputedStyle(node).opacity) > .95));
  const treehouseMiddle = await accommodationFrame.evaluate(() => {
    const scene = document.querySelector("[data-okanagan-scene='treehouse']");
    const heading = scene.querySelector("h1");
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(heading);
    selection.removeAllRanges();
    selection.addRange(range);
    return {
      currentTime: scene.querySelector("[data-hero-video]").currentTime,
      stickyTop: scene.querySelector("[data-okanagan-hero]").getBoundingClientRect().top,
      selectedText: selection.toString().trim(),
    };
  });
  assert.ok(treehouseMiddle.currentTime > 1, `Treehouse hero movie did not scrub: ${JSON.stringify(treehouseMiddle)}`);
  assert.ok(Math.abs(treehouseMiddle.stickyTop) < 2, "Treehouse hero did not stay locked while its movie played");
  assert.equal(treehouseMiddle.selectedText, "The Treehouse", "Treehouse headline is not selectable HTML text");
  await page.waitForFunction(() => document.querySelector("[data-accommodation-url]")?.textContent.trim() === "okanagantreehouse.ca/treehouse");

  await accommodationFrame.$eval("[data-stays-trigger]", (trigger) => trigger.click());
  assert.equal(await accommodationFrame.$eval("[data-stays-trigger]", (trigger) => trigger.getAttribute("aria-expanded")), "true", "Stays dropdown did not open");
  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    const accommodationNavOpen = await page.$("[data-work='accommodation']");
    await accommodationNavOpen.screenshot({ path: path.join(screenshotDirectory, "boutique-desktop-nav-open.png") });
  }
  const previewLocation = await accommodationFrame.evaluate(() => ({ href: location.href, scrollY: window.scrollY }));
  await accommodationFrame.$eval(".nav-mega__card", (link) => link.click());
  assert.deepEqual(await accommodationFrame.evaluate(() => ({ href: location.href, scrollY: window.scrollY })), previewLocation, "preview nav link navigated instead of remaining interactive-only");

  await setSceneProgress(accommodationFrame, "cabin", .55);
  await accommodationFrame.waitForFunction(() => {
    const video = document.querySelector("[data-okanagan-scene='cabin'] [data-hero-video]");
    return video?.readyState >= 1 && Number.isFinite(video.duration);
  });
  await accommodationFrame.waitForFunction(() => Number(document.querySelector("[data-okanagan-scene='cabin']").dataset.sceneProgress) > .54);
  await accommodationFrame.waitForFunction(() => [...document.querySelectorAll("[data-okanagan-scene='cabin'] h1 span, [data-okanagan-scene='cabin'] .hero-copy > p, [data-okanagan-scene='cabin'] .stay-meta, [data-okanagan-scene='cabin'] .hero-actions")]
    .every((node) => Number(getComputedStyle(node).opacity) > .95));
  const cabinMiddle = await accommodationFrame.evaluate(() => {
    const scene = document.querySelector("[data-okanagan-scene='cabin']");
    return {
      currentTime: scene.querySelector("[data-hero-video]").currentTime,
      stickyTop: scene.querySelector("[data-okanagan-hero]").getBoundingClientRect().top,
      heading: scene.querySelector("h1").textContent.trim(),
    };
  });
  assert.ok(cabinMiddle.currentTime > 1, `Cabin hero movie did not scrub: ${JSON.stringify(cabinMiddle)}`);
  assert.ok(Math.abs(cabinMiddle.stickyTop) < 2, "Cabin hero did not stay locked while its movie played");
  assert.equal(cabinMiddle.heading, "The Cabin");
  await page.waitForFunction(() => document.querySelector("[data-accommodation-url]")?.textContent.trim() === "okanagantreehouse.ca/cabin");

  await setSceneProgress(accommodationFrame, "overview", .15);
  await accommodationFrame.waitForFunction(() => Number(document.querySelector("[data-okanagan-scene='overview']").dataset.sceneProgress) < .16);
  const accommodationReverse = await accommodationFrame.$eval("[data-okanagan-scene='overview'] [data-hero-video]", (video) => video.currentTime);
  assert.ok(accommodationReverse < overviewMiddle.currentTime, "Overview hero did not scrub backward");
  await page.waitForFunction(() => document.querySelector("[data-accommodation-url]")?.textContent.trim() === "okanagantreehouse.ca");
  assert.equal(await page.evaluate(() => window.scrollY), accommodationTop.parentScroll, "scrolling the boutique browser moved the portfolio page");

  const accommodationMotion = await page.evaluate(() => {
    const object = document.querySelector("[data-scroll-reveal='accommodation']");
    return {
      progress: Number.parseFloat(getComputedStyle(object).getPropertyValue("--object-reveal")) || 0,
      transform: getComputedStyle(object).transform,
    };
  });
  assert.ok(accommodationMotion.progress > accommodationStart.progress, "outer scroll did not advance the boutique browser reveal");
  assert.notEqual(accommodationMotion.transform, accommodationStart.transform, "boutique browser did not rotate with outer scroll");
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
  assert.equal(reducedVideoRequests.some((requestUrl) => /(?:portfolio-hero-system-map|rccv-showcase-laptop|cool-runnings-sizzle)/.test(requestUrl)), false);
  assert.equal(await reducedPage.$$eval("[data-motion-video]", (videos) => videos.every((video) => !video.matches("[role='button'], [tabindex]"))), true);
  const reducedAccommodationHandle = await reducedPage.waitForSelector("[data-accommodation-page]");
  const reducedAccommodationFrame = await reducedAccommodationHandle.contentFrame();
  await reducedAccommodationFrame.waitForSelector("[data-okanagan-scene='cabin']");
  const reducedAccommodation = await reducedAccommodationFrame.evaluate(() => ({
    sceneHeights: [...document.querySelectorAll("[data-okanagan-scene]")].map((scene) => Math.round(scene.getBoundingClientRect().height)),
    videosHidden: [...document.querySelectorAll("[data-hero-video]")].every((video) => getComputedStyle(video).display === "none"),
    copyVisible: [...document.querySelectorAll(".hero-copy h1 span")].every((line) => Number(getComputedStyle(line).opacity) === 1),
  }));
  assert.equal(new Set(reducedAccommodation.sceneHeights).size, 1, `reduced-motion Okanagan scenes are not equal height: ${JSON.stringify(reducedAccommodation.sceneHeights)}`);
  assert.ok(reducedAccommodation.sceneHeights[0] >= 560, `reduced-motion Okanagan scenes are too short: ${JSON.stringify(reducedAccommodation.sceneHeights)}`);
  assert.equal(reducedAccommodation.videosHidden, true, "reduced-motion Okanagan movies remain visible");
  assert.equal(reducedAccommodation.copyVisible, true, "reduced-motion Okanagan copy remains hidden");
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

  const coolPosition = await page.$eval("[data-work='cool-runnings']", (section) => ({
    top: section.getBoundingClientRect().top + window.scrollY,
    height: section.offsetHeight,
  }));
  const workHeights = await page.$$eval(".work-object", (sections) => sections.map((section) => section.offsetHeight));
  assert.ok(Math.max(...workHeights) - Math.min(...workHeights) <= 2, `Selected Work sections do not share one height: ${JSON.stringify(workHeights)}`);
  await page.evaluate(({ top }) => window.scrollTo(0, top - window.innerHeight * .9), coolPosition);
  await new Promise((resolve) => setTimeout(resolve, 100));
  const coolRevealStart = await page.$eval(".cool-laptop", (laptop) => ({
    progress: Number.parseFloat(getComputedStyle(laptop).getPropertyValue("--object-reveal")) || 0,
    transform: getComputedStyle(laptop).transform,
  }));
  assert.ok(coolRevealStart.progress > .05 && coolRevealStart.progress < .3, `Cool Runnings laptop did not begin its reveal early: ${JSON.stringify(coolRevealStart)}`);

  await page.evaluate(({ top, height }) => window.scrollTo(0, top - (window.innerHeight - height) / 2), coolPosition);
  await page.waitForFunction(() => {
    const video = document.querySelector("#motion-video-cool-runnings");
    return video?.dataset.motionLoaded === "true" && video.readyState >= 2;
  });
  const coolMotionStart = await page.$eval("#motion-video-cool-runnings", (video) => video.currentTime);
  await page.waitForFunction((start) => {
    const video = document.querySelector("#motion-video-cool-runnings");
    return !video.paused && video.currentTime > start + .2;
  }, {}, coolMotionStart);
  const coolRevealMid = await page.$eval(".cool-laptop", (laptop) => ({
    progress: Number.parseFloat(getComputedStyle(laptop).getPropertyValue("--object-reveal")) || 0,
    transform: getComputedStyle(laptop).transform,
    width: laptop.getBoundingClientRect().width,
    bounds: laptop.getBoundingClientRect().toJSON(),
    duplicateBase: Boolean(document.querySelector(".cool-laptop-base")),
  }));
  assert.ok(coolRevealMid.progress >= .99, `Cool Runnings laptop did not finish by the time its text was centred: ${JSON.stringify(coolRevealMid)}`);
  assert.notEqual(coolRevealMid.transform, coolRevealStart.transform, "Cool Runnings laptop did not transform through the section");
  assert.ok(coolRevealMid.width > 760, `Cool Runnings laptop is still undersized: ${coolRevealMid.width}px`);
  assert.ok(coolRevealMid.bounds.bottom > 0 && coolRevealMid.bounds.top < 900, `Cool Runnings laptop was gone when its animation completed: ${JSON.stringify(coolRevealMid.bounds)}`);
  assert.equal(coolRevealMid.duplicateBase, false, "Cool Runnings laptop still has the duplicate frame bar");

  await page.$eval("[data-work='elevators']", (node) => node.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-scroll-reveal='elevators']")).getPropertyValue("--object-reveal")) > .25);
  assert.ok(await page.$eval("[data-scroll-reveal='elevators']", (node) => Number.parseFloat(getComputedStyle(node).getPropertyValue("--object-reveal")) > .25), "elevator browser did not rotate up with scroll progress");

  await page.$eval(".workflow-accordion", (node) => node.scrollIntoView({ block: "center" }));
  const accordionStartWidths = await page.$$eval(".workflow-item", (items) => items.map((item) => item.getBoundingClientRect().width));
  await page.click("[data-workflow-trigger='dashboard']");
  await page.waitForFunction(() => document.querySelector("[data-workflow-trigger='dashboard']")?.getAttribute("aria-expanded") === "true");
  await page.waitForFunction((startingWidth) => {
    const [closing, opening] = [...document.querySelectorAll(".workflow-item")].map((item) => item.getBoundingClientRect().width);
    return closing > 64 && closing < startingWidth && opening > 64 && opening < startingWidth;
  }, { timeout: 1500, polling: "raf" }, accordionStartWidths[0]);
  const transitionWidths = await page.$$eval(".workflow-item", (items) => items.map((item) => item.getBoundingClientRect().width));
  assert.ok(transitionWidths[0] > 64 && transitionWidths[0] < accordionStartWidths[0], "closing workflow panel did not interpolate its width");
  assert.ok(transitionWidths[1] > 64 && transitionWidths[1] < accordionStartWidths[0], "opening workflow panel did not interpolate its width");

  const aboutStoryPosition = await page.$eval("[data-about-scroll-story]", (story) => ({
    top: story.getBoundingClientRect().top + window.scrollY,
    travel: story.offsetHeight - window.innerHeight,
  }));
  await page.evaluate(({ top }) => window.scrollTo(0, top), aboutStoryPosition);
  await page.evaluate(() => document.fonts.ready);
  await new Promise((resolve) => setTimeout(resolve, 80));
  const aboutAnchorDelta = await page.evaluate(() => {
    const inline = document.querySelector("[data-about-questionable-inline]");
    const focus = document.querySelector("[data-about-questionable-focus]");
    const inlineBounds = inline.getBoundingClientRect();
    const focusBounds = focus.getBoundingClientRect();
    const inlineStyle = getComputedStyle(inline);
    const focusStyle = getComputedStyle(focus);
    return {
      x: Math.abs(inlineBounds.left - focusBounds.left),
      y: Math.abs(inlineBounds.top - focusBounds.top),
      inlineSize: inlineStyle.fontSize,
      focusSize: focusStyle.fontSize,
      inlineWeight: inlineStyle.fontWeight,
      focusWeight: focusStyle.fontWeight,
      inlineFamily: inlineStyle.fontFamily,
      focusFamily: focusStyle.fontFamily,
    };
  });
  assert.ok(aboutAnchorDelta.x < 2 && aboutAnchorDelta.y < 2, `About focus phrase is not anchored to the sentence: ${JSON.stringify(aboutAnchorDelta)}`);
  assert.equal(aboutAnchorDelta.focusSize, aboutAnchorDelta.inlineSize, "About focus phrase changes size before scrolling");
  assert.equal(aboutAnchorDelta.focusWeight, aboutAnchorDelta.inlineWeight, "About focus phrase changes weight before scrolling");
  assert.equal(aboutAnchorDelta.focusFamily, aboutAnchorDelta.inlineFamily, "About focus phrase changes family before scrolling");
  await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .72), aboutStoryPosition);
  await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-line")) > .8);
  await page.waitForFunction(() => {
    const contextOpacity = Number.parseFloat(getComputedStyle(document.querySelector(".about-context")).opacity);
    const phraseSize = Number.parseFloat(getComputedStyle(document.querySelector(".about-questionable-focus")).fontSize);
    return contextOpacity < .08 && phraseSize >= 44 && phraseSize <= 62;
  });
  assert.ok(Math.abs(await page.$eval(".about-story-sticky", (node) => node.getBoundingClientRect().top)) < 2, "About story did not remain locked during its reveal");
  assert.ok(await page.$eval(".about-context", (node) => Number.parseFloat(getComputedStyle(node).opacity) < .08), "About context did not fade while the phrase expanded");
  assert.ok(await page.$eval(".about-questionable-focus", (node) => {
    const size = Number.parseFloat(getComputedStyle(node).fontSize);
    return size >= 44 && size <= 62;
  }), "About phrase did not reach its capped standalone size");
  assert.ok(await page.$eval(".about-questionable-focus", (node) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).a - 1) < .02), "About phrase still uses a rasterizing scale transform");
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
    height: story.offsetHeight,
  }));
  await page.evaluate(({ top }) => window.scrollTo(0, top - window.innerHeight * .89), finalePosition);
  await new Promise((resolve) => setTimeout(resolve, 120));
  assert.equal(await page.$eval("[data-contact-story]", (story) => story.dataset.finaleState), "idle", "finale must remain idle below the 12% visibility threshold");
  assert.equal(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.entranceStarts)), 0, "finale must not start before entering view");
  await page.evaluate(({ top }) => window.scrollTo(0, top - window.innerHeight * .86), finalePosition);
  await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.viewportLocked === "true");
  const lockedFinale = await page.evaluate(() => ({
    scrollY: window.scrollY,
    stageTop: document.querySelector("[data-contact-stage]").getBoundingClientRect().top,
    rootOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  assert.ok(Math.abs(lockedFinale.stageTop) < 2, `finale stage did not lock to the viewport top: ${JSON.stringify(lockedFinale)}`);
  assert.equal(lockedFinale.rootOverflow, "hidden", "finale lock must suppress document scrolling during the entrance");
  assert.equal(lockedFinale.bodyPosition, "fixed", "finale lock must hold the document body during the entrance");
  await page.mouse.move(720, 450);
  await page.mouse.wheel({ deltaY: 420 });
  await new Promise((resolve) => setTimeout(resolve, 180));
  assert.equal(await page.evaluate(() => window.scrollY), lockedFinale.scrollY, "wheel input must not move the page during the locked finale entrance");
  await page.waitForFunction(() => Number(document.querySelector("[data-contact-story]")?.dataset.entranceProgress) > .34);
  assert.equal(await page.evaluate(() => window.scrollY), lockedFinale.scrollY, "finale entrance must advance without page scrolling");
  assert.equal(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.entranceStarts)), 1, "finale must start exactly once when 12% is visible");
  const entranceSpacing = await page.$$eval("[data-contact-object]", (items) => {
    const visible = items.map((item) => {
      const rect = item.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        opacity: Number(getComputedStyle(item).opacity),
      };
    }).filter((item) => item.opacity > .25);
    let minimum = Infinity;
    for (let left = 0; left < visible.length; left += 1) {
      for (let right = left + 1; right < visible.length; right += 1) {
        minimum = Math.min(minimum, Math.hypot(
          visible[left].x - visible[right].x,
          visible[left].y - visible[right].y,
        ));
      }
    }
    return { count: visible.length, minimum };
  });
  assert.ok(entranceSpacing.count >= 3, "automatic finale entrance must reveal multiple objects before release");
  assert.ok(entranceSpacing.minimum >= 52, `automatic finale objects are too tightly stacked: ${entranceSpacing.minimum}px`);
  const sampleSpiral = async (target) => {
    await page.waitForFunction((minimum) => Number(document.querySelector("[data-contact-object]")?.dataset.poseProgress) >= minimum, {}, target);
    return page.$eval("[data-contact-object]", (item) => {
      const stage = document.querySelector("[data-contact-stage]");
      return {
        progress: Number(item.dataset.poseProgress),
        x: Number(item.dataset.poseX) - stage.clientWidth * .5,
        y: Number(item.dataset.poseY) - stage.clientHeight * .46,
        scale: Number(item.dataset.poseScale),
      };
    });
  };
  const spiralQuarter = await sampleSpiral(.24);
  const spiralHalf = await sampleSpiral(.49);
  assert.ok(spiralQuarter.x > 0 && spiralQuarter.y > 0, `spiral did not cross the lower-right half turn: ${JSON.stringify(spiralQuarter)}`);
  assert.ok(spiralHalf.x < 0 && spiralHalf.y < 0, `spiral did not return to the upper-left after one turn: ${JSON.stringify(spiralHalf)}`);
  assert.ok(spiralHalf.scale < spiralQuarter.scale, "spiral cards must shrink continuously toward the centre");
  if (screenshotDirectory && !leanScreenshots) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDirectory, "finale-spiral-mid-desktop.png") });
  }
  const spiralThreeQuarter = await sampleSpiral(.74);
  assert.ok(spiralThreeQuarter.x > 0 && spiralThreeQuarter.y > 0, `spiral did not cross the lower-right during its second turn: ${JSON.stringify(spiralThreeQuarter)}`);
  await page.waitForFunction(() => [...document.querySelectorAll("[data-contact-object='portrait'] img")]
    .every((image) => image.complete && image.naturalWidth > 0));
  assert.equal(await page.$$eval("[data-contact-object='portrait'] img", (images) => images.length), 2, "finale portrait must include body and head layers");
  await page.waitForFunction(() => {
    const story = document.querySelector("[data-contact-story]");
    const visibleCount = [...document.querySelectorAll("[data-contact-object]")]
      .filter((item) => getComputedStyle(item).display !== "none").length;
    const releasedCount = Number(story?.dataset.releasedObjects || 0);
    return story?.dataset.finaleState === "releasing"
      && releasedCount > 0
      && releasedCount < visibleCount;
  });
  await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.finaleState === "physics", { timeout: 6500 });
  const releasedViewport = await page.$eval("[data-contact-story]", (story) => ({
    viewportLocked: story.dataset.viewportLocked,
    rootOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  assert.deepEqual(releasedViewport, { viewportLocked: "false", rootOverflow: "", bodyPosition: "" }, "finale must restore document scrolling before gravity begins");
  const centreRelease = await page.$$eval("[data-contact-object]", (items) => {
    const stage = document.querySelector("[data-contact-stage]");
    const centre = { x: stage.clientWidth * .5, y: stage.clientHeight * .46 };
    const visible = items.filter((item) => getComputedStyle(item).display !== "none");
    const scales = visible.map((item) => Number(item.dataset.poseScale));
    const xPositions = visible.map((item) => Number(item.dataset.poseX));
    const yPositions = visible.map((item) => Number(item.dataset.poseY));
    const matrix = new DOMMatrix(getComputedStyle(visible[0]).transform);
    return {
      minimumScale: Math.min(...scales),
      maximumScale: Math.max(...scales),
      horizontalSpan: Math.max(...xPositions) - Math.min(...xPositions),
      verticalSpan: Math.max(...yPositions) - Math.min(...yPositions),
      maximumHorizontalOffset: Math.max(...xPositions.map((x) => Math.abs(x - centre.x))),
      renderedScale: Math.hypot(matrix.a, matrix.b),
    };
  });
  assert.ok(centreRelease.minimumScale >= .7 && centreRelease.maximumScale <= .74, `finale cards became too small before release: ${JSON.stringify(centreRelease)}`);
  assert.ok(centreRelease.horizontalSpan >= 420 && centreRelease.horizontalSpan <= 620, `finale cards did not occupy the distributed central release band: ${JSON.stringify(centreRelease)}`);
  assert.ok(centreRelease.maximumHorizontalOffset <= 330, `finale release spread too far from centre: ${JSON.stringify(centreRelease)}`);
  assert.ok(centreRelease.verticalSpan <= 70, `finale release stagger is too tall: ${JSON.stringify(centreRelease)}`);
  assert.ok(centreRelease.renderedScale >= .69 && centreRelease.renderedScale <= .75, `scaled physics handoff jumped at release: ${JSON.stringify(centreRelease)}`);
  await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.copyState === "visible");
  assert.equal(await page.$eval("[data-contact-story]", (story) => story.dataset.finaleState), "physics", "contact copy must resolve while objects are still dropping");
  await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.finaleState === "settled", { timeout: 8000 });
  assert.ok(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.releaseDelta)) <= .5, "physics bodies must inherit the final spiral positions without a jump");
  const settledRenderScale = await page.$eval("[data-contact-object]", (item) => {
    const matrix = new DOMMatrix(getComputedStyle(item).transform);
    return Math.hypot(matrix.a, matrix.b);
  });
  assert.ok(Math.abs(settledRenderScale - centreRelease.renderedScale) <= .015, "finale cards must retain their centre scale through the gravity drop");
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
  if (screenshotDirectory && !leanScreenshots) {
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
  const headingTarget = await page.$eval("[data-contact-morph-after]", (heading) => {
    const rect = heading.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  await page.mouse.move(draggable.rect.x + draggable.rect.width / 2, draggable.rect.y + draggable.rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(headingTarget.x, headingTarget.y, { steps: 8 });
  await page.mouse.up();
  const releasedPose = await page.$eval(`[data-contact-object="${draggable.key}"]`, (item) => {
    const rect = item.getBoundingClientRect();
    const matrix = new DOMMatrix(getComputedStyle(item).transform);
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      angle: Math.atan2(matrix.b, matrix.a),
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const dynamicPose = await page.$eval(`[data-contact-object="${draggable.key}"]`, (item) => {
    const rect = item.getBoundingClientRect();
    const matrix = new DOMMatrix(getComputedStyle(item).transform);
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      angle: Math.atan2(matrix.b, matrix.a),
    };
  });
  assert.ok(
    Math.hypot(dynamicPose.x - releasedPose.x, dynamicPose.y - releasedPose.y) > 3
      || Math.abs(dynamicPose.angle - releasedPose.angle) > .015,
    "released finale objects must retain dynamic movement or rotation",
  );
  const dynamicBounds = await page.$eval(`[data-contact-object="${draggable.key}"]`, (item) => {
    const itemRect = item.getBoundingClientRect();
    const stageRect = document.querySelector("[data-contact-stage]").getBoundingClientRect();
    return {
      left: itemRect.left - stageRect.left,
      right: stageRect.right - itemRect.right,
      top: itemRect.top - stageRect.top,
      bottom: stageRect.bottom - itemRect.bottom,
    };
  });
  assert.ok(Object.values(dynamicBounds).every((distance) => distance >= -18), `dynamic object escaped the stage: ${JSON.stringify(dynamicBounds)}`);
  await page.evaluate(({ top, height }) => window.scrollTo(0, top + height + 40), finalePosition);
  await new Promise((resolve) => setTimeout(resolve, 120));
  await page.evaluate(({ top }) => window.scrollTo(0, top), finalePosition);
  await new Promise((resolve) => setTimeout(resolve, 120));
  assert.equal(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.entranceStarts)), 1, "finale must not replay after leaving and re-entering view");
  assert.notEqual(await page.$eval("[data-contact-story]", (story) => story.dataset.finaleState), "entrance", "finale must stay in its physics state after re-entry");
  await page.$eval(".site-footer", (footer) => footer.scrollIntoView({ block: "end" }));
  await new Promise((resolve) => setTimeout(resolve, 120));
  assert.ok(await page.$eval(".site-footer", (footer) => footer.getBoundingClientRect().top <= window.innerHeight + 2), "normal scrolling must reach the footer after the finale");

  const mobileFinalePage = await browser.newPage();
  await mobileFinalePage.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await mobileFinalePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobileFinalePage.goto(url, { waitUntil: "domcontentloaded" });
  const mobileFinalePosition = await mobileFinalePage.$eval("[data-contact-story]", (story) => ({
    top: story.getBoundingClientRect().top + window.scrollY,
  }));
  await mobileFinalePage.evaluate(({ top }) => window.scrollTo(0, top - window.innerHeight * .55), mobileFinalePosition);
  try {
    await mobileFinalePage.waitForFunction(
      () => Number(document.querySelector("[data-contact-story]")?.dataset.entranceProgress) > .34,
      { timeout: 30000 },
    );
  } catch (error) {
    const state = await mobileFinalePage.evaluate(() => {
      const story = document.querySelector("[data-contact-story]");
      const stage = document.querySelector("[data-contact-stage]");
      const bounds = stage?.getBoundingClientRect();
      return {
        finaleState: story?.dataset.finaleState,
        progress: story?.dataset.entranceProgress,
        starts: story?.dataset.entranceStarts,
        locked: story?.dataset.viewportLocked,
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        stageTop: bounds?.top,
        stageBottom: bounds?.bottom,
        visibleRatio: bounds
          ? Math.max(0, Math.min(window.innerHeight, bounds.bottom) - Math.max(0, bounds.top)) / bounds.height
          : 0,
      };
    });
    throw new Error(`mobile finale did not start: ${JSON.stringify(state)}`, { cause: error });
  }
  const mobileOrbit = await mobileFinalePage.$$eval("[data-contact-object]", (items) => ({
    visible: items.filter((item) => {
      const bounds = item.getBoundingClientRect();
      const opacity = Number(getComputedStyle(item).opacity);
      return opacity > .25 && bounds.right > -20 && bounds.left < innerWidth + 20 && bounds.bottom > -20 && bounds.top < innerHeight + 20;
    }).length,
    locked: document.querySelector("[data-contact-story]")?.dataset.viewportLocked,
  }));
  assert.equal(mobileOrbit.locked, "true", "mobile finale did not hold the viewport during its entrance");
  assert.ok(mobileOrbit.visible >= 3, `mobile finale ellipse leaves too few objects visible: ${JSON.stringify(mobileOrbit)}`);
  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await mobileFinalePage.screenshot({ path: path.join(screenshotDirectory, "finale-spiral-mid-mobile.png") });
  }
  await mobileFinalePage.waitForFunction(() => Number(document.querySelector("[data-contact-object]")?.dataset.poseProgress) >= .49);
  const mobileOppositeArc = await mobileFinalePage.$eval("[data-contact-object]", (item) => {
    const stage = document.querySelector("[data-contact-stage]");
    return {
      x: Number(item.dataset.poseX) - stage.clientWidth * .5,
      y: Number(item.dataset.poseY) - stage.clientHeight * .46,
    };
  });
  assert.ok(mobileOppositeArc.x < 0 && mobileOppositeArc.y < 0, `mobile finale did not cross the opposite side of its orbit: ${JSON.stringify(mobileOppositeArc)}`);
  if (screenshotDirectory) {
    await mobileFinalePage.screenshot({ path: path.join(screenshotDirectory, "finale-spiral-opposite-mobile.png") });
  }
  await mobileFinalePage.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.finaleState === "physics", { timeout: 6500 });
  assert.equal(await mobileFinalePage.$eval("[data-contact-story]", (story) => story.dataset.viewportLocked), "false", "mobile finale did not release the viewport after its orbit");
  await mobileFinalePage.close();

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
  await filePage.$eval("[data-work='accommodation']", (node) => node.scrollIntoView({ block: "center" }));
  const fileAccommodationHandle = await filePage.waitForSelector("[data-accommodation-page]");
  const fileAccommodationFrame = await fileAccommodationHandle.contentFrame();
  await fileAccommodationFrame.waitForSelector("[data-okanagan-scene='cabin']");
  await fileAccommodationFrame.waitForFunction(() => {
    const video = document.querySelector("[data-okanagan-scene='overview'] [data-hero-video]");
    return video?.readyState >= 1 && Number.isFinite(video.duration);
  });
  await fileAccommodationFrame.evaluate(() => {
    const scene = document.querySelector("[data-okanagan-scene='treehouse']");
    window.scrollTo(0, scene.offsetTop + (scene.offsetHeight - window.innerHeight) * .5);
  });
  await fileAccommodationFrame.waitForFunction(() => {
    const video = document.querySelector("[data-okanagan-scene='treehouse'] [data-hero-video]");
    return video?.readyState >= 1 && Number.isFinite(video.duration);
  });
  await fileAccommodationFrame.waitForFunction(() => {
    const scene = document.querySelector("[data-okanagan-scene='treehouse']");
    return Number(scene.dataset.sceneProgress) > .49
      && scene.querySelector("[data-hero-video]").currentTime > 1
      && [...scene.querySelectorAll("h1 span, .hero-copy > p, .stay-meta, .hero-actions")]
        .every((node) => Number(getComputedStyle(node).opacity) > .95);
  });
  assert.deepEqual(await fileAccommodationFrame.evaluate(() => {
    const scene = document.querySelector("[data-okanagan-scene='treehouse']");
    return {
      heading: scene.querySelector("h1").textContent.trim(),
      sticky: Math.abs(scene.querySelector("[data-okanagan-hero]").getBoundingClientRect().top) < 2,
      playing: scene.querySelector("[data-hero-video]").currentTime > 1,
    };
  }), { heading: "The Treehouse", sticky: true, playing: true }, "direct file preview did not scrub the Treehouse hero");
  await filePage.close();

  if (screenshotDirectory && !leanScreenshots) {
    for (const { label, width, height } of [
      { label: "desktop", width: 1024, height: 640 },
      { label: "mobile", width: 390, height: 640 },
    ]) {
      const scenePage = await browser.newPage();
      await scenePage.setViewport({ width, height, deviceScaleFactor: 1 });
      await scenePage.goto(`http://127.0.0.1:${port}/v2/okanagan-preview/`, { waitUntil: "domcontentloaded" });
      await scenePage.$$eval("[data-hero-video]", (videos) => videos.forEach((video) => {
        video.querySelectorAll("source[data-src]").forEach((source) => {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
        });
        video.load();
      }));
      await scenePage.waitForFunction(() => [...document.querySelectorAll("[data-hero-video]")]
        .every((video) => video.readyState >= 1 && Number.isFinite(video.duration)));
      for (const sceneKey of ["overview", "treehouse", "cabin"]) {
        await scenePage.evaluate((key) => {
          const scene = document.querySelector(`[data-okanagan-scene='${key}']`);
          window.scrollTo(0, scene.offsetTop + (scene.offsetHeight - window.innerHeight) * .5);
        }, sceneKey);
        await scenePage.waitForFunction((key) => {
          const scene = document.querySelector(`[data-okanagan-scene='${key}']`);
          return Number(scene.dataset.sceneProgress) > .49
            && scene.querySelector("[data-hero-video]").currentTime > 1
            && [...scene.querySelectorAll("h1 span, .hero-copy > p, .stay-meta, .hero-actions")]
              .every((node) => Number(getComputedStyle(node).opacity) > .95);
        }, {}, sceneKey);
        await scenePage.screenshot({ path: path.join(screenshotDirectory, `okanagan-${sceneKey}-${label}.png`) });
      }
      await scenePage.close();
    }
  }

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
      return {
        cueLeft: cue.left,
        cueRight: cue.right,
        cueBottom: cue.bottom,
        browserTop: browser.top,
        iframeDisplay: getComputedStyle(document.querySelector("[data-accommodation-page]")).display,
      };
    });
    assert.ok(accommodationGeometry.cueLeft >= -1 && accommodationGeometry.cueRight <= width + 1, `${width}px accommodation cue is clipped horizontally`);
    assert.ok(accommodationGeometry.cueBottom <= accommodationGeometry.browserTop - 8, `${width}px accommodation cue overlaps the browser instead of occupying its own row`);
    assert.notEqual(accommodationGeometry.iframeDisplay, "none", `${width}px reduced-motion accommodation browser should remain visible`);
    const responsiveAccommodationHandle = await page.$("[data-accommodation-page]");
    const responsiveAccommodationFrame = await responsiveAccommodationHandle.contentFrame();
    await responsiveAccommodationFrame.waitForSelector("[data-okanagan-scene='cabin']");
    assert.deepEqual(await responsiveAccommodationFrame.evaluate(() => ({
      sourceOrder: [...document.querySelectorAll("[data-okanagan-scene]")].map((scene) => scene.dataset.okanaganScene),
      videosHidden: [...document.querySelectorAll("[data-hero-video]")].every((video) => getComputedStyle(video).display === "none"),
    })), { sourceOrder: ["overview", "treehouse", "cabin"], videosHidden: true }, `${width}px reduced-motion Okanagan preview changed its static scene contract`);
    const finaleGeometry = await page.evaluate(() => {
      const stageBounds = document.querySelector("[data-contact-stage]").getBoundingClientRect();
      const headingBounds = document.querySelector("[data-contact-morph-after]").getBoundingClientRect();
      const actionBounds = document.querySelector(".contact-actions").getBoundingClientRect();
      return { stage: stageBounds.toJSON(), heading: headingBounds.toJSON(), actions: actionBounds.toJSON() };
    });
    assert.ok(finaleGeometry.heading.left >= -1 && finaleGeometry.heading.right <= width + 1, `${width}px finale heading overflows`);
    assert.ok(finaleGeometry.actions.left >= -1 && finaleGeometry.actions.right <= width + 1, `${width}px finale actions overflow`);
    assert.ok(finaleGeometry.actions.bottom <= finaleGeometry.stage.bottom + 1, `${width}px finale actions fall below the stage`);
    if (screenshotDirectory && !leanScreenshots) {
      await mkdir(screenshotDirectory, { recursive: true });
      await page.$eval("[data-contact-stage]", (stage) => stage.scrollIntoView({ block: "center" }));
      await page.waitForFunction(() => [...document.querySelectorAll("[data-contact-object] img")]
        .filter((image) => getComputedStyle(image.closest("[data-contact-object]")).display !== "none")
        .every((image) => image.complete));
      await page.evaluate(() => document.activeElement?.blur());
      await page.screenshot({ path: path.join(screenshotDirectory, `v2-${width}.png`), fullPage: true });
    }
  }

  for (const width of [1024, 900, 768, 390]) {
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
      const phrase = document.querySelector(".about-questionable-focus").getBoundingClientRect();
      const portrait = document.querySelector(".portrait-object").getBoundingClientRect();
      return {
        phrase: phrase.toJSON(),
        portrait: portrait.toJSON(),
        phraseWidth: phrase.width,
        overlaps: phrase.left < portrait.right && phrase.right > portrait.left
          && phrase.top < portrait.bottom && phrase.bottom > portrait.top,
      };
    });
    assert.ok(aboutGeometry.phraseWidth > 0, `${width}px About phrase collapsed during its scroll beat`);
    assert.equal(aboutGeometry.overlaps, false, `${width}px About phrase overlaps the portrait: ${JSON.stringify(aboutGeometry)}`);
    if (width === 390 && screenshotDirectory) {
      const sticky = await page.$(".about-story-sticky");
      await sticky.screenshot({ path: path.join(screenshotDirectory, "about-mobile-animated.png") });
      await page.evaluate(({ top, travel }) => window.scrollTo(0, top + travel * .9), position);
      await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector("[data-about-scroll-story]")).getPropertyValue("--about-value")) > .95);
      const finalAbout = await page.evaluate(() => {
        const stage = document.querySelector(".about-story-sticky").getBoundingClientRect();
        const conclusion = document.querySelector(".about-process-reveal").getBoundingClientRect();
        const portrait = document.querySelector(".portrait-object").getBoundingClientRect();
        return {
          conclusionVisible: Number(getComputedStyle(document.querySelector(".about-process-reveal")).opacity) > .95,
          conclusionInside: conclusion.left >= stage.left && conclusion.right <= stage.right && conclusion.top >= stage.top && conclusion.bottom <= stage.bottom,
          portraitInside: portrait.left >= stage.left && portrait.right <= stage.right && portrait.top >= stage.top && portrait.bottom <= stage.bottom,
        };
      });
      assert.deepEqual(finalAbout, { conclusionVisible: true, conclusionInside: true, portraitInside: true }, `390px About conclusion does not resolve inside the locked frame: ${JSON.stringify(finalAbout)}`);
      await sticky.screenshot({ path: path.join(screenshotDirectory, "about-mobile-resolved.png") });
    }
  }

  if (screenshotDirectory && leanScreenshots) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const boundary = await page.evaluate(() => {
      const hero = document.querySelector(".hero").getBoundingClientRect();
      const work = document.querySelector(".selected-work").getBoundingClientRect();
      const top = Math.max(0, hero.bottom + window.scrollY - 260);
      return { x: 0, y: top, width: innerWidth, height: Math.min(620, work.bottom + window.scrollY - top) };
    });
    await page.screenshot({ path: path.join(screenshotDirectory, "hero-selected-work-boundary-desktop.png"), clip: boundary });
    await page.$eval("[data-work='accommodation']", (section) => section.scrollIntoView({ block: "center" }));
    const leanAccommodationFrameHandle = await page.waitForSelector("[data-accommodation-page]");
    const leanAccommodationFrame = await leanAccommodationFrameHandle.contentFrame();
    await leanAccommodationFrame.waitForSelector("[data-okanagan-scene='cabin']");
    await leanAccommodationFrame.evaluate(() => window.scrollTo(0, 0));
    await page.$eval("[data-work='accommodation']", (section) => section.scrollIntoView({ block: "center" }));
    const accommodationSection = await page.$("[data-work='accommodation']");
    await accommodationSection.screenshot({ path: path.join(screenshotDirectory, "boutique-desktop-overview.png") });
    await page.$eval("[data-work='cool-runnings']", (section) => section.scrollIntoView({ block: "center" }));
    await page.waitForFunction(() => Number.parseFloat(getComputedStyle(document.querySelector(".cool-laptop")).getPropertyValue("--object-reveal")) >= .99);
    const coolSection = await page.$("[data-work='cool-runnings']");
    await coolSection.screenshot({ path: path.join(screenshotDirectory, "cool-laptop-desktop.png") });
  }

  if (screenshotDirectory && !leanScreenshots) {
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
      const screenshotFrameHandle = await page.waitForSelector("[data-accommodation-page]");
      const screenshotFrame = await screenshotFrameHandle.contentFrame();
      await screenshotFrame.waitForSelector("[data-okanagan-scene='cabin']");
      await screenshotFrame.evaluate(() => window.scrollTo(0, 0));
      await accommodationWork.screenshot({ path: path.join(screenshotDirectory, accommodationFilename) });
      for (const sceneKey of ["overview", "treehouse", "cabin"]) {
        await screenshotFrame.evaluate((key) => {
          const scene = document.querySelector(`[data-okanagan-scene='${key}']`);
          window.scrollTo(0, scene.offsetTop + (scene.offsetHeight - window.innerHeight) * .5);
        }, sceneKey);
        await screenshotFrame.waitForFunction((key) => Number(document.querySelector(`[data-okanagan-scene='${key}']`).dataset.sceneProgress) > .49, {}, sceneKey);
        await screenshotFrame.waitForFunction((key) => [...document.querySelector(`[data-okanagan-scene='${key}']`).querySelectorAll("h1 span, .hero-copy > p, .stay-meta, .hero-actions")]
          .every((node) => Number(getComputedStyle(node).opacity) > .95), {}, sceneKey);
        await accommodationWork.screenshot({ path: path.join(screenshotDirectory, `work-${label}-accommodation-${sceneKey}.png`) });
      }

      const coolFilename = label === "desktop" ? "work-desktop-cool.png" : "work-mobile-cool.png";
      const coolWork = await page.$("[data-work='cool-runnings']");
      await coolWork.screenshot({ path: path.join(screenshotDirectory, coolFilename) });

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
        if (sectionName === "about") {
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
        const structuredArtwork = document.querySelector(".workflow-artwork .website-workflow-visual");
        if (image && !image.complete) await image.decode();
        return {
          heading: document.querySelector("h1")?.textContent.trim(),
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          artworkComplete: image
            ? image.complete && image.naturalWidth > 0
            : Boolean(structuredArtwork && structuredArtwork.children.length >= 7),
          currentSource: image ? new URL(image.currentSrc).pathname : "structured-html",
          naturalWidth: image?.naturalWidth || 0,
          naturalHeight: image?.naturalHeight || 0,
          stepCount: document.querySelectorAll(".workflow-step").length,
          contractComplete: ["why-it-exists", "how-it-works", "tools-and-sources", "what-ships", "human-review", "proof-and-constraints", "related-work"]
            .every((id) => document.getElementById(id)),
        };
      });

      assert.ok(detail.heading, `${route} is missing its heading`);
      assert.ok(detail.scrollWidth <= detail.innerWidth, `${width}px ${route} overflows by ${detail.scrollWidth - detail.innerWidth}px`);
      assert.equal(detail.artworkComplete, true, `${width}px ${route} artwork did not load`);
      assert.ok(detail.stepCount >= 5, `${route} exposes only ${detail.stepCount} workflow steps`);
      assert.equal(detail.contractComplete, true, `${route} is missing part of the workflow contract`);
      assert.deepEqual(detailFailures, [], `${width}px ${route} has failed local assets`);
      assert.ok(requestPaths.some((requestPath) => requestPath.endsWith("dm-sans-latin-variable.woff2")), `${width}px ${route} did not request local DM Sans`);

      if (route === "presentation-publishing.html") {
        const mobile = width < 700;
        const expectedAsset = mobile ? "presentation-publishing-mobile.png" : "presentation-publishing-desktop.png";
        assert.ok(detail.currentSource.endsWith(expectedAsset), `${width}px selected ${detail.currentSource} instead of ${expectedAsset}`);
        if (mobile) {
          assert.ok(
            detail.naturalHeight >= 1800 && detail.naturalHeight > detail.naturalWidth * 2,
            `${width}px presentation mobile artwork is not a high-resolution portrait composition`,
          );
        } else {
          assert.ok(
            detail.naturalWidth >= 1600 && detail.naturalWidth > detail.naturalHeight,
            `${width}px presentation desktop artwork is not a high-resolution landscape composition`,
          );
        }
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
    assert.equal(caseStudy.clicks, expectedCaseClicks, `${width}px local-search case study did not load current metrics`);
    assert.ok(
      caseStudy.metricWindow.includes(expectedMetricWindow),
      `${width}px local-search metric window is stale`,
    );
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
