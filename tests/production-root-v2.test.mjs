import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

const trackedPages = [
  "index.html",
  "proposal-generator.html",
  "v2/index.html",
  "v2/proposal-generator.html",
  "v2/work/local-search-magnet.html",
  "v2/workflows/agency-management-dashboard.html",
  "v2/workflows/content-production.html",
  "v2/workflows/image-to-website-production.html",
  "v2/workflows/local-prospecting-enrichment.html",
  "v2/workflows/presentation-publishing.html",
];

test("the approved V2 homepage is the production root", async () => {
  const [root, v2] = await Promise.all([read("index.html"), read("v2/index.html")]);

  assert.match(root, /<link rel="canonical" href="https:\/\/michaelmck\.site\/">/);
  assert.match(root, /<link rel="stylesheet" href="v2\/styles\.css">/);
  assert.match(root, /<section class="hero page-frame" id="hero"/);
  assert.match(root, /data-work="accommodation"/);
  assert.match(root, /data-workflow-accordion/);
  assert.match(root, /src="v2\/app\.js"/);
  assert.match(root, /src="v2\/contact-finale\.js"/);
  assert.match(root, /href="v2\/workflows\/presentation-publishing\.html"/);
  assert.match(root, /src="v2\/okanagan-preview\/index\.html"/);
  assert.match(root, /src="v2\/portrait\/embed\.html"/);
  assert.doesNotMatch(root, /class="site-shell"/);

  assert.match(v2, /<link rel="canonical" href="https:\/\/michaelmck\.site\/">/);
});

test("the approved V2 proposal builder is the production proposal route", async () => {
  const [root, v2] = await Promise.all([
    read("proposal-generator.html"),
    read("v2/proposal-generator.html"),
  ]);

  assert.match(root, /<link rel="canonical" href="https:\/\/michaelmck\.site\/proposal-generator\.html">/);
  assert.match(root, /<link rel="stylesheet" href="v2\/styles\.css">/);
  assert.match(root, /<link rel="stylesheet" href="v2\/proposal-generator\.css">/);
  assert.match(root, /class="proposal-callout/);
  assert.match(root, /href="v2\/workflows\/local-prospecting-enrichment\.html"/);
  assert.match(root, /src="proposal-generator\.js\?v=20260716-1"/);
  assert.match(v2, /<link rel="canonical" href="https:\/\/michaelmck\.site\/proposal-generator\.html">/);
});

test("every public portfolio page loads one privacy-reduced GA4 tag", {
  skip: !existsSync(new URL("../assets/analytics.js", import.meta.url))
    ? "A dedicated portfolio GA4 property and measurement ID have not been created yet"
    : false,
}, async () => {
  const pages = await Promise.all(trackedPages.map(async (path) => [path, await read(path)]));

  for (const [path, html] of pages) {
    const ids = [...html.matchAll(/googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/g)]
      .map((match) => match[1]);
    assert.equal(ids.length, 1, `${path} must load one GA4 tag`);
    assert.match(html, /assets\/analytics\.js/);
  }

  const analytics = await read("assets/analytics.js");
  assert.match(analytics, /window\.gtag/);
  assert.match(analytics, /allow_google_signals:\s*false/);
  assert.match(analytics, /allow_ad_personalization_signals:\s*false/);
});

test("the sitemap promotes root V2 routes without duplicate assessment URLs", async () => {
  const sitemap = await read("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.ok(locations.includes("https://michaelmck.site/"));
  assert.ok(locations.includes("https://michaelmck.site/proposal-generator.html"));
  assert.ok(!locations.includes("https://michaelmck.site/v2/"));
  assert.ok(!locations.includes("https://michaelmck.site/v2/proposal-generator.html"));
});
