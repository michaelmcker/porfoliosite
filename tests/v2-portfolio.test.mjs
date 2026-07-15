import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const v2Url = new URL("../v2/", import.meta.url);
const fileUrl = (name) => new URL(name, v2Url);
const workflowRoutes = [
  "content-production.html",
  "agency-management-dashboard.html",
  "presentation-publishing.html",
  "local-prospecting-enrichment.html",
  "image-to-website-production.html",
];

async function readV2(name) {
  return readFile(fileUrl(name), "utf8");
}

async function readWorkflow(name) {
  return readV2(`workflows/${name}`);
}

test("V2 uses one photographic studio system instead of unrelated colour bands", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  for (const project of ["rccv", "accommodation", "cool-runnings", "proposal", "elevators"]) {
    assert.match(html, new RegExp(`data-project-environment="${project}"`));
  }
  assert.match(css, /--accent:\s*#E3A916/i);
  assert.doesNotMatch(css, /--work-accommodation|--work-proposal|--content-vivid|--about-hard/);
  assert.match(css, /\.screen-bezel/);
  assert.match(css, /font-family:\s*var\(--font-editorial\)/);
});

test("accordion stages selection and About bridges section-wide pointer input", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);

  assert.match(html, /data-about-stage/);
  assert.match(html, /data-about-breakout/);
  assert.match(html, /class="about-curly-arrow"/);
  assert.match(html, /src="portrait\/embed\.html"/);
  assert.match(app, /portfolio-portrait-pointer/);
  assert.match(app, /data-workflow-transitioning/);
  assert.match(app, /requestAnimationFrame/);
});

test("all five V2 workflow routes share the detailed public-safe contract", async () => {
  for (const route of workflowRoutes) {
    const html = await readWorkflow(route);
    assert.match(html, /workflow-detail\.css/);
    assert.match(html, /data-workflow-purpose/);
    assert.match(html, /id="why-it-exists"/);
    assert.match(html, /id="how-it-works"/);
    assert.match(html, /id="tools-and-sources"/);
    assert.match(html, /id="what-ships"/);
    assert.match(html, /id="human-review"/);
    assert.match(html, /id="proof-and-constraints"/);
    assert.match(html, /id="related-work"/);
    assert.ok((html.match(/class="workflow-step"/g) || []).length >= 5, `${route} needs at least five steps`);
  }
});

test("V2 is isolated in its own three production files", async () => {
  const [html, css, app] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("app.js"),
  ]);

  assert.match(html, /<link[^>]+href="styles\.css"/);
  assert.match(html, /<script[^>]+src="app\.js"/);
  assert.doesNotMatch(html, /(?:href|src)="\.\.\/(?:styles\.css|app\.js|workflow-reset\.css|styles\/)/);
  assert.doesNotMatch(css, /@import\s+["']?\.\.\/(?:styles|workflow-reset)/);
  assert.ok(app.length > 0);
});

test("V2 contains the required sections and selected work in the approved order", async () => {
  const html = await readV2("index.html");

  for (const id of ["hero", "work", "method", "workflows", "proof", "about", "resume", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }

  assert.match(html, /Open\.\s*Test\.\s*Send\.\s*Publish\.\s*Measure\./s);
  assert.match(html, /A little about me\./);

  const workOrder = [
    "data-work=\"rccv\"",
    "data-work=\"accommodation\"",
    "data-work=\"cool-runnings\"",
    "data-work=\"proposal\"",
    "data-work=\"elevators\"",
    "data-work=\"music\"",
  ].map((marker) => html.indexOf(marker));
  assert.ok(workOrder.every((position) => position >= 0), "all six selected-work objects must exist");
  assert.deepEqual([...workOrder].sort((a, b) => a - b), workOrder);

  for (const metric of ["1,900%", "600%", "$200M+", "156"]) {
    assert.ok(html.includes(metric), `missing outcome ${metric}`);
  }
});

test("V2 restores the existing hero film as a raised card and keeps the authored portrait frame", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  assert.match(html, /class="hero-system-media screen-bezel"/);
  assert.match(html, /<video[^>]+id="motion-video-hero"[^>]+data-motion-video/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-desktop-4k-sparse-loop\.mp4"/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-mobile-1080p\.mp4"/);
  assert.doesNotMatch(html, /class="system-trace"/);
  assert.match(html, /<div class="portrait-frame">\s*<iframe[^>]+src="portrait\/embed\.html"/s);
  assert.match(css, /\.portrait-frame\s*\{[^}]*aspect-ratio:\s*1023\s*\/\s*1537[^}]*border:\s*16px ridge/s);
  assert.match(html, /<section class="hero page-frame" id="hero"/);
  assert.match(html, /I build websites, product stories, sales material, and AI-enabled marketing systems that help teams explain, sell, and scale\. And sometimes stuff just for fun\./);
  assert.doesNotMatch(html, /hero-motion-toggle/);
  assert.match(css, /\.hero\s*\{[^}]*grid-template-columns:\s*minmax\(360px,\s*\.78fr\)\s*minmax\(560px,\s*1\.22fr\)/s);
  assert.match(css, /\.hero-system-media\s*\{[^}]*width:\s*min\(100%,\s*840px\)[^}]*border-width:/s);
  assert.match(css, /\.hero-system-media video\s*\{[^}]*width:\s*100%[^}]*aspect-ratio:\s*4\s*\/\s*3[^}]*object-fit:\s*cover/s);
  assert.match(app, /portrait-frame[\s\S]*?classList\.add\(["']is-loaded["']\)/);
});

test("selected work gives properly scaled laptop and browser objects more room than the copy", async () => {
  const css = await readV2("styles.css");

  assert.match(css, /--page-width:\s*1380px/);
  assert.match(css, /\.work-object\s*\{[^}]*grid-template-columns:\s*minmax\(300px,\s*\.78fr\)\s*minmax\(520px,\s*1\.22fr\)/s);
  assert.match(css, /\.work-object-accommodation,[\s\S]*?grid-template-columns:\s*minmax\(520px,\s*1\.25fr\)\s*minmax\(300px,\s*\.75fr\)/s);
  assert.match(css, /\.work-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)[^}]*font-size:\s*clamp\(2\.35rem,\s*4vw,\s*4\.6rem\)/s);
  assert.match(css, /\.laptop-object\s*\{[^}]*width:\s*min\(100%,\s*880px\)/s);
  assert.match(css, /\.browser-object\s*\{[^}]*width:\s*100%/s);
});

test("project environments replace unrelated colour bands and keep a wide black scrollable browser", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(html, /class="accommodation-showcase"[\s\S]*?data-accommodation-viewer/s);
  assert.match(html, /class="accommodation-scroll-cue"[\s\S]*?Try to scroll[\s\S]*?<svg/s);
  assert.match(css, /data-project-environment="accommodation"[^}]*boutique-forest\.jpg/);
  assert.match(css, /data-project-environment="proposal"[^}]*proposal-city\.jpg/);
  assert.match(css, /\.screen-bezel\s*\{[^}]*border:[^}]*solid #101312[^}]*box-shadow:/s);
  assert.match(css, /\.browser-object-tall \.browser-viewport\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*10/s);
});

test("all five workflow controls have unique accessible trigger and panel wiring", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);
  const triggerPattern = /<button[^>]+data-workflow-trigger="([^"]+)"[^>]+aria-expanded="(true|false)"[^>]+aria-controls="([^"]+)"[^>]*>/g;
  const triggers = [...html.matchAll(triggerPattern)];

  assert.equal(triggers.length, 5);
  assert.equal(new Set(triggers.map((match) => match[1])).size, 5);
  assert.equal(new Set(triggers.map((match) => match[3])).size, 5);
  assert.equal(triggers.filter((match) => match[2] === "true").length, 1);

  const triggerIds = triggers.map((match) => match[0].match(/\bid="([^"]+)"/)?.[1]);
  assert.ok(triggerIds.every(Boolean), "every workflow trigger needs an id");
  assert.equal(new Set(triggerIds).size, 5, "workflow trigger ids must be unique");

  for (const [index, [, key, , panelId]] of triggers.entries()) {
    const panelTag = html.match(new RegExp(`<[^>]+id="${panelId}"[^>]+data-workflow-panel="${key}"[^>]+aria-labelledby="${triggerIds[index]}"[^>]*>`))?.[0];
    assert.ok(panelTag, `missing labelled panel for ${key}`);
    if (key === "content") {
      assert.match(panelTag, /aria-hidden="false"/);
      assert.doesNotMatch(panelTag, /\sinert(?:\s|>|=)/);
    } else {
      assert.match(panelTag, /aria-hidden="true"/);
      assert.match(panelTag, /\sinert(?:\s|>|=)/);
    }
  }

  assert.match(app, /toggleAttribute\(["']inert["']/);
  assert.match(app, /setAttribute\(["']aria-hidden["']/);
  assert.match(html, /href="workflows\/presentation-publishing\.html"/);
});

test("boutique accommodation exposes the real 69-frame sequence to wheel and keyboard input", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);

  assert.match(html, /data-accommodation-viewer[^>]+data-frame-sequences="overview:17,treehouse:28,cabin:24"[^>]+tabindex="0"/);
  assert.match(html, /data-accommodation-frame/);
  assert.match(html, /data-accommodation-status[^>]+aria-live="polite"/);
  assert.match(html, /aria-describedby="accommodation-instructions"/);
  assert.match(html, /id="accommodation-instructions"/);
  assert.equal([...html.matchAll(/data-accommodation-(?:previous|next)/g)].length, 2);

  assert.match(app, /data-accommodation-viewer/);
  assert.match(app, /frameSequences/);
  assert.match(app, /addEventListener\(["']wheel["']/);
  assert.match(app, /passive:\s*false/);
  assert.match(app, /deltaMode/);
  assert.match(app, /preventDefault\(\)/);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
  assert.match(app, /new URL\(source,\s*document\.baseURI\)\.href/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]) {
    assert.ok(app.includes(key), `missing accommodation keyboard support for ${key}`);
  }
});

test("large showcase videos stay lazy and autonomous without pause-button chrome", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);
  const videos = [...html.matchAll(/<video[^>]+data-motion-video[^>]*>[\s\S]*?<\/video>/g)].map((match) => match[0]);
  const controls = [...html.matchAll(/<button[^>]+data-motion-toggle[^>]*>/g)].map((match) => match[0]);

  assert.equal(videos.length, 3);
  assert.equal(controls.length, 0);
  for (const video of videos) {
    assert.doesNotMatch(video, /data-motion-surface|tabindex="0"|role="button"/);
    assert.doesNotMatch(video, /\sautoplay(?:\s|>)/);
    assert.match(video, /preload="none"/);
    assert.doesNotMatch(video, /<source[^>]+\ssrc=/);
    assert.match(video, /<source[^>]+data-src=/);
  }
  assert.doesNotMatch(css, /\.motion-toggle\s*\{/);
  assert.match(app, /data-motion-video/);
  assert.doesNotMatch(app, /aria-pressed|toggleMotionVideo/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.play\(\)/);
  assert.match(app, /\.pause\(\)/);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
});

test("workflow showcase is full bleed, more vivid, and orders copy above dominant media", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  for (const color of ["#e0a91c", "#3e8164", "#df5f38", "#4d678c", "#8f5c93"]) {
    assert.ok(css.includes(color), `missing hard workflow colour ${color}`);
  }

  assert.match(css, /\.workflow-accordion\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.workflow-item\s*\{[^}]*min-width:\s*72px[^}]*color:\s*white/s);
  assert.match(css, /\.workflow-trigger\s*\{[^}]*width:\s*72px[^}]*background:\s*var\(--rail\)/s);
  assert.match(css, /\.workflow-trigger strong\s*\{[^}]*font-size:\s*1\.16rem[^}]*font-weight:\s*900/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.workflow-panel figure\s*\{[^}]*background:\s*#f4f1e9/s);
  assert.match(css, /\.workflow-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)[^}]*font-size:\s*clamp\(2\.5rem,\s*4vw,\s*4\.8rem\)/s);
  assert.match(css, /\.workflow-copy p\s*\{[^}]*font-size:\s*clamp\(1\.05rem,\s*1\.45vw,\s*1\.3rem\)/s);
  assert.doesNotMatch(css, /\.workflow-panel figure\s*\{[^}]*order:\s*-1/s);

  const panels = [...html.matchAll(/<div class="workflow-panel-inner">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article>/g)];
  assert.equal(panels.length, 5);
  for (const [, panel] of panels) {
    assert.ok(panel.indexOf('class="workflow-copy"') < panel.indexOf("<figure"), "workflow copy must precede media");
  }
});

test("method, workflows, outcomes, and About form deliberate full-bleed chapters", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(html, /<section class="build-bias"[^>]*>\s*<div class="build-bias-inner page-frame">/s);
  assert.match(html, /<section class="about"[^>]*>\s*<div class="about-inner page-frame">/s);
  assert.match(css, /\.build-bias\s*\{[^}]*background:\s*var\(--accent\)/s);
  assert.match(css, /\.workflow-section\s*\{[^}]*background:\s*var\(--surface\)/s);
  assert.match(css, /\.outcomes\s*\{[^}]*background:\s*var\(--surface\)/s);
  assert.match(css, /\.about\s*\{[^}]*background:\s*var\(--forest\)/s);
  assert.match(css, /\.about-inner\s*\{[^}]*display:\s*grid/s);
});

test("V2 CSS includes the revised studio tokens, responsive accordion, and motion safeguards", async () => {
  const css = await readV2("styles.css");

  for (const token of ["#f1eee7", "#fbfaf6", "#ffffff", "#171813", "#E3A916", "#171a19", "#243c31"]) {
    assert.ok(css.includes(token), `missing approved colour ${token}`);
  }

  assert.match(css, /--font-sans:\s*["']DM Sans["']/);
  assert.match(css, /--font-editorial:\s*["']Fraunces["']/);
  assert.match(css, /\.workflow-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)/s);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(max-width:\s*470px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /cubic-bezier\(\.22,\s*1,\s*\.36,\s*1\)/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)[\s\S]*?\.laptop-object\s*\{[^}]*width:\s*min\(100%,\s*900px\)/);
});

test("every referenced V2 asset resolves to tracked media on disk", async () => {
  const html = await readV2("index.html");
  const assetReferences = [...html.matchAll(/(?:src|data-src|poster|href)="(\.\.\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1]);

  assert.ok(assetReferences.length >= 15, "expected V2 to reuse the existing media library");
  await Promise.all(assetReferences.map((reference) => access(new URL(reference, fileUrl("index.html")))));
});

test("V2 interactions use keyboard handling, observers, and rAF-throttled scroll expansion", async () => {
  const app = await readV2("app.js");

  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.unobserve\(/);
  assert.match(app, /addEventListener\(["']keydown["']/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    assert.ok(app.includes(key), `missing keyboard support for ${JSON.stringify(key)}`);
  }
  assert.match(app, /addEventListener\(["']scroll["'][\s\S]*?requestAnimationFrame/s);
  assert.match(app, /passive:\s*true/);
});

test("browser QA covers runtime focus, motion, inputs, dialog restoration, and target widths", async () => {
  const qa = await readFile(new URL("../scripts/qa-v2.mjs", import.meta.url), "utf8");
  for (const marker of [
    "puppeteer-core", "inert", "aria-hidden", "ArrowDown", "data-accommodation-next",
    "deltaMode", "prefers-reduced-motion", "data-dashboard-dialog",
    "data-motion-surface",
    "1440", "1024", "768", "390", "320", "scrollWidth",
    "workflow-desktop-", "workflow-mobile-", "hero-desktop.png", "hero-mobile.png",
    "work-desktop-accommodation.png", "work-mobile-accommodation.png",
  ]) {
    assert.ok(qa.includes(marker), `browser QA missing ${marker}`);
  }
  assert.match(qa, /portfolio-hero-system-map-(?:desktop|mobile)/);
  assert.match(qa, /rccv-showcase-laptop/);
  assert.match(qa, /cool-runnings-sizzle-25s/);
});
