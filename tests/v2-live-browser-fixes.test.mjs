import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("hero crops the empty left quarter while keeping overlays tied to the source frame", async () => {
  const [html, css] = await Promise.all([
    read("v2/index.html"),
    read("v2/styles.css"),
  ]);

  assert.match(html, /class="hero-video-crop"[\s\S]*class="hero-video-source"[\s\S]*hero-video-label-inputs/);
  assert.match(css, /\.hero-system-media\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
  assert.match(css, /\.hero-video-source\s*\{[^}]*width:\s*133\.333%[^}]*transform:\s*translateX\(-25%\)/s);
  assert.match(css, /@media \(max-width:\s*699px\)[\s\S]*?\.hero-video-source\s*\{[^}]*width:\s*100%[^}]*transform:\s*none/s);
});

test("boutique preview is deferred by the app and its cue ends at the browser edge", async () => {
  const [html, css, app, previewCss] = await Promise.all([
    read("v2/index.html"),
    read("v2/styles.css"),
    read("v2/app.js"),
    read("v2/okanagan-preview/styles.css"),
  ]);

  assert.match(html, /<iframe[^>]+data-accommodation-page[^>]+data-src="okanagan-preview\/index\.html"/);
  assert.doesNotMatch(html, /<iframe[^>]+data-accommodation-page[^>]+\ssrc=/);
  assert.match(app, /loadAccommodationPreview/);
  assert.match(app, /rootMargin:\s*"25%\s+0px"/);
  assert.match(html, /viewBox="0 0 72 84"/);
  assert.match(css, /\.accommodation-scroll-cue svg\s*\{[^}]*height:\s*84px/s);
  assert.match(css, /\.work-object-accommodation[\s\S]*grid-template-columns:\s*minmax\(600px,\s*1\.38fr\)\s+minmax\(280px,\s*\.62fr\)/);
  assert.match(previewCss, /\.site-nav__links\s*>\s*a,\s*\.nav-dropdown__trigger\s*\{[^}]*text-transform:\s*uppercase/s);
});

test("below-fold selected-work media does not compete with the hero on first paint", async () => {
  const [html, app] = await Promise.all([
    read("v2/index.html"),
    read("v2/app.js"),
  ]);

  assert.match(html, /data-poster="\.\.\/assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.webp"/);
  assert.match(html, /data-poster="\.\.\/assets\/screens\/cool-runnings-home\.webp"/);
  assert.match(html, /class="cool-laptop-frame"[^>]+data-src="\.\.\/assets\/device-mockups\/laptop-graphite-frame\.png"/);
  assert.match(html, /class="proposal-sheet"[\s\S]*?<img[^>]+data-src="\.\.\/assets\/samples\/vertical-impression-local-proposal-current\.png"/);
  assert.match(app, /loadDeferredImage/);
  assert.match(app, /rootMargin:\s*"25%\s+0px"/);
});

test("scheduled metrics runs publish their source windows on the GitHub Actions summary", async () => {
  const workflow = await read(".github/workflows/refresh-cool-runnings-metrics.yml");
  const summaryScript = await read("scripts/write-cool-runnings-summary.mjs");
  const caseStudy = await read("v2/work/local-search-magnet.js");

  assert.match(workflow, /Publish metrics freshness summary/);
  assert.match(workflow, /GITHUB_STEP_SUMMARY/);
  assert.match(workflow, /write-cool-runnings-summary\.mjs/);
  assert.match(summaryScript, /Search Console/);
  assert.match(summaryScript, /Google Analytics 4/);
  assert.match(summaryScript, /three-day reporting lag/);
  assert.match(caseStudy, /ga4Start/);
  assert.match(caseStudy, /ga4End/);
  assert.match(caseStudy, /Search Console[^`]*\$\{formatDate\(searchStart\)\}[^`]*\$\{formatDate\(searchEnd\)\}/);
  assert.match(caseStudy, /Google Analytics 4[^`]*\$\{formatDate\(ga4Start\)\}[^`]*\$\{formatDate\(ga4End\)\}/);
});
