import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const v2Url = new URL("../v2/", import.meta.url);
const fileUrl = (name) => new URL(name, v2Url);

async function readV2(name) {
  return readFile(fileUrl(name), "utf8");
}

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

test("V2 restores the existing hero film and authored portrait frame", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  assert.match(html, /<video[^>]+id="motion-video-hero"[^>]+data-motion-video[^>]+data-motion-label="portfolio system map"/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-desktop-4k-sparse-loop\.mp4"/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-mobile-1080p\.mp4"/);
  assert.doesNotMatch(html, /class="system-trace"/);
  assert.match(html, /<div class="portrait-frame">\s*<iframe[^>]+portrait-final\/embed\.html/s);
  assert.match(css, /\.portrait-frame\s*\{[^}]*aspect-ratio:\s*2\s*\/\s*3[^}]*border:\s*7px solid #725a3d[^}]*border-radius:[^}]*background(?:-image)?:[^}]*portrait\/poster\.png/s);
  assert.match(css, /@media\s*\(max-width:\s*699px\)[\s\S]*?\.hero-system-media video\s*\{[^}]*aspect-ratio:\s*941\s*\/\s*1672/s);
  assert.match(app, /portrait-frame[\s\S]*?classList\.add\(["']is-loaded["']\)/);
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

test("large showcase videos are lazy, pausable motion with a reduced-motion opt in", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);
  const videos = [...html.matchAll(/<video[^>]+data-motion-video[^>]*>[\s\S]*?<\/video>/g)].map((match) => match[0]);
  const controls = [...html.matchAll(/<button[^>]+data-motion-toggle[^>]*>/g)].map((match) => match[0]);

  assert.equal(videos.length, 3);
  assert.equal(controls.length, 3);
  for (const video of videos) {
    assert.match(video, /data-motion-label="[^"]+"/);
    assert.doesNotMatch(video, /\sautoplay(?:\s|>)/);
    assert.match(video, /preload="none"/);
    assert.doesNotMatch(video, /<source[^>]+\ssrc=/);
    assert.match(video, /<source[^>]+data-src=/);
  }
  assert.match(css, /\.motion-toggle[\s\S]*?(?:min-height|height):\s*44px/);
  assert.match(app, /data-motion-video/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.play\(\)/);
  assert.match(app, /\.pause\(\)/);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
});

test("workflow showcase is full bleed, more vivid, and orders copy above dominant media", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  for (const color of ["#B9C8FF", "#B5DEBE", "#FFC09C", "#F3D76D", "#D2B6F0"]) {
    assert.ok(css.includes(color), `missing vivid workflow colour ${color}`);
  }

  assert.match(css, /\.workflow-accordion\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.workflow-item\s*\{[^}]*color:\s*var\(--ink\)/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.workflow-panel img\s*\{[^}]*max-height:\s*none/s);
  assert.doesNotMatch(css, /\.workflow-panel figure\s*\{[^}]*order:\s*-1/s);

  const panels = [...html.matchAll(/<div class="workflow-panel-inner">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article>/g)];
  assert.equal(panels.length, 5);
  for (const [, panel] of panels) {
    assert.ok(panel.indexOf('class="workflow-copy"') < panel.indexOf("<figure"), "workflow copy must precede media");
  }
});

test("V2 CSS includes the approved tokens, responsive accordion, and overflow and motion safeguards", async () => {
  const css = await readV2("styles.css");

  for (const token of [
    "#F7F6F2", "#FFFFFF", "#1B1D1A", "#676A64", "#D9DAD3",
    "#3F66E8", "#557A5B", "#E98D63", "#1F2322",
    "#E7ECFA", "#E5EEE7", "#F6E8DF", "#F2EBCF", "#EBE7F3",
  ]) {
    assert.ok(css.includes(token), `missing approved colour ${token}`);
  }

  assert.match(css, /font-family:\s*["']DM Sans["']/);
  assert.match(css, /font-family:\s*["']Fraunces["']/);
  assert.match(css, /\.workflow-copy h3\s*\{[^}]*font-family:\s*["']Fraunces["']/s);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /@media\s*\(min-width:\s*1100px\)/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.match(css, /@media\s*\(max-width:\s*479px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /cubic-bezier\(\.22,\s*1,\s*\.36,\s*1\)/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /@media\s*\(max-width:\s*479px\)[\s\S]*?\.laptop-object\s*\{[^}]*width:\s*100%[^}]*margin-left:\s*0/);
});

test("every referenced V2 asset resolves to tracked media on disk", async () => {
  const html = await readV2("index.html");
  const assetReferences = [...html.matchAll(/(?:src|data-src|poster|href)="(\.\.\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1]);

  assert.ok(assetReferences.length >= 15, "expected V2 to reuse the existing media library");
  await Promise.all(assetReferences.map((reference) => access(new URL(reference, fileUrl("index.html")))));
});

test("V2 interactions use keyboard handling and one-time observation without scroll listeners", async () => {
  const app = await readV2("app.js");

  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.unobserve\(/);
  assert.match(app, /addEventListener\(["']keydown["']/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    assert.ok(app.includes(key), `missing keyboard support for ${JSON.stringify(key)}`);
  }
  assert.doesNotMatch(app, /addEventListener\(["']scroll["']/);
});

test("browser QA covers runtime focus, motion, inputs, dialog restoration, and target widths", async () => {
  const qa = await readFile(new URL("../scripts/qa-v2.mjs", import.meta.url), "utf8");
  for (const marker of [
    "puppeteer-core", "inert", "aria-hidden", "ArrowDown", "data-accommodation-next",
    "deltaMode", "prefers-reduced-motion", "data-motion-toggle", "data-dashboard-dialog",
    "1440", "1024", "768", "390", "320", "scrollWidth",
  ]) {
    assert.ok(qa.includes(marker), `browser QA missing ${marker}`);
  }
  assert.match(qa, /portfolio-hero-system-map-(?:desktop|mobile)/);
  assert.match(qa, /rccv-showcase-laptop/);
  assert.match(qa, /cool-runnings-sizzle-25s/);
});
