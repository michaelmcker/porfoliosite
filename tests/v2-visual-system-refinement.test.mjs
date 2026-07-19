import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repo = new URL("../", import.meta.url);
const workflowSlugs = [
  "content-production",
  "agency-dashboard",
  "presentation-publishing",
  "local-prospecting",
  "image-to-website",
];

const read = (path) => readFile(new URL(path, repo), "utf8");

test("proposal outcome gives its constrained copy a real responsive inset", async () => {
  const [html, css] = await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
  ]);

  assert.match(html, /class="proposal-outcome__inner page-frame"[\s\S]*?<p>/);
  assert.doesNotMatch(html, /<p class="page-frame">One small input set/);
  assert.match(css, /\.proposal-outcome__inner\s*\{[^}]*padding-inline:\s*clamp\(/s);
});

test("selected work makes the reported sales result a distinct proof line", async () => {
  const [html, css] = await Promise.all([
    read("v2/index.html"),
    read("v2/styles.css"),
  ]);

  assert.match(html, /class="[^"]*work-proof-result[^"]*"[\s\S]*?<strong>30% increase in sales<\/strong>/);
  assert.match(html, /Client-reported/);
  assert.match(css, /\.work-proof-result strong\s*\{[^}]*font-size:\s*clamp\(/s);
});

test("tablet widths use a dedicated responsive type and selected-work grid", async () => {
  const css = await read("v2/styles.css");

  assert.match(css, /@media \(min-width: 761px\) and \(max-width: 1099px\)/);
  assert.match(css, /--type-h1:\s*clamp\(/);
  assert.match(css, /--type-h2:\s*clamp\(/);
  assert.match(css, /--type-h3:\s*clamp\(/);
  assert.match(css, /\.work-object\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*\.82fr\)\s+minmax\(0,\s*1\.18fr\)/s);
  assert.match(css, /\.work-object-accommodation\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("workflow routes use responsive artwork from the approved Content visual family", async () => {
  const homepage = await read("v2/index.html");
  const routes = [
    ["content-production.html", "content-production-approved"],
    ["agency-management-dashboard.html", "agency-dashboard"],
    ["local-prospecting-enrichment.html", "local-prospecting"],
    ["image-to-website-production.html", "image-to-website"],
  ];

  for (const slug of ["content-production-approved", "agency-dashboard", "local-prospecting", "image-to-website"]) {
    assert.match(homepage, new RegExp(`assets/workflows/${slug}-mobile\\.png`));
    assert.match(homepage, new RegExp(`assets/workflows/${slug}-desktop\\.png`));
    for (const layout of ["desktop", "mobile"]) {
      await access(new URL(`v2/assets/workflows/${slug}-${layout}.png`, repo));
    }
  }

  for (const [route, slug] of routes) {
    const detail = await read(`v2/workflows/${route}`);
    assert.match(detail, new RegExp(`../assets/workflows/${slug}-mobile\\.png`));
    assert.match(detail, new RegExp(`../assets/workflows/${slug}-desktop\\.png`));
  }

  const presentation = await read("v2/workflows/presentation-publishing.html");
  assert.match(homepage, /assets\/workflows\/presentation-publishing-mobile\.png/);
  assert.match(homepage, /assets\/workflows\/presentation-publishing-desktop\.png/);
  assert.match(presentation, /\.\.\/assets\/workflows\/presentation-publishing-mobile\.png/);
  assert.match(presentation, /\.\.\/assets\/workflows\/presentation-publishing-desktop\.png/);

  await access(new URL("v2/assets/workflows/README.md", repo));
});

test("approved Content style drives image generation while Content and the recovered real Dashboard stay locked", async () => {
  const manifest = await read("v2/assets/workflows/README.md");
  assert.match(manifest, /image-generated portfolio artwork/i);
  assert.match(manifest, /content-production-approved-desktop\.png/);
  assert.match(manifest, /strict style reference/i);
  assert.match(manifest, /pure black canvas/i);
  assert.match(manifest, /warm off-white/i);
  assert.match(manifest, /cobalt-blue, green, red-orange, white and amber connector paths/i);
  assert.match(manifest, /Presentation publishing — desktop/);
  assert.match(manifest, /Local prospecting — desktop/);
  assert.match(manifest, /Image-to-website — desktop/);
  assert.match(manifest, /built-in image-generation tool in reference-image mode/i);

  const lockedAssets = new Map([
    ["v2/assets/workflows/agency-dashboard-desktop.png", "83d00ae1a5ff5746925a3e350de7b8de98c39404a4b5b68e514394631fe1f7ae"],
    ["v2/assets/workflows/agency-dashboard-mobile.png", "83d00ae1a5ff5746925a3e350de7b8de98c39404a4b5b68e514394631fe1f7ae"],
    ["v2/assets/workflows/content-production-approved-desktop.png", "8df1ac85b4813445e5ffd836efcd8cce380a945b2a2e315fcead1c297bb1932b"],
    ["v2/assets/workflows/content-production-approved-mobile.png", "46438ba3988c02c2d488ea8a75bd45fc1e8e6a68d9baa3accf58feada86dba7a"],
  ]);

  for (const [asset, expectedHash] of lockedAssets) {
    const buffer = await readFile(new URL(asset, repo));
    assert.equal(createHash("sha256").update(buffer).digest("hex"), expectedHash, `${asset} changed`);
  }
});

test("workflow rails use ordered physical depth and reset to flat rows below desktop", async () => {
  const css = await read("v2/styles.css");

  assert.match(css, /\.workflow-accordion\s*\{[^}]*perspective:\s*1600px/s);
  assert.match(css, /\.workflow-trigger::before\s*\{/);
  assert.match(css, /--stack-y:/);
  assert.match(css, /\.workflow-item:nth-child\(5\)\s*\{[^}]*z-index:/s);
  assert.match(css, /transform:\s*translate3d\(/);
  assert.match(css, /@media \(max-width: 1099px\)[\s\S]*?\.workflow-trigger\s*\{[^}]*transform:\s*none/s);
  assert.match(css, /@media \(max-width: 1099px\)[\s\S]*?\.workflow-trigger::before\s*\{[^}]*display:\s*none/s);
});

test("Content mobile prompt preserves logos, cards, and coloured routing from the approved desktop image", async () => {
  const [manifest, mobile] = await Promise.all([
    read("v2/assets/workflows/README.md"),
    readFile(new URL("v2/assets/workflows/content-production-approved-mobile.png", repo)),
  ]);

  for (const label of [
    "Linear tasks",
    "Google",
    "DataForSEO",
    "Firecrawl",
    "Perplexity",
    "Brand rules",
    "Brief",
    "Outline",
    "Draft",
    "Audit",
    "Human review",
    "Google Drive",
    "Published article",
    "Shopify",
  ]) {
    assert.ok(manifest.toLowerCase().includes(label.toLowerCase()), `mobile Content source truth is missing ${label}`);
  }
  assert.match(manifest, /pure black canvas/i);
  assert.match(manifest, /warm off-white/i);
  assert.match(manifest, /branching and merging routes/i);
  assert.match(manifest, /Do not merely shrink the desktop image/i);
  const dimensions = { width: mobile.readUInt32BE(16), height: mobile.readUInt32BE(20) };
  assert.ok(dimensions.height >= 1800 && dimensions.height > dimensions.width * 2);
});

test("approved Content mobile and corrected prospecting artwork are wired into cards and workflow pages", async () => {
  const [homepage, contentDetail, prospectingDetail] = await Promise.all([
    read("v2/index.html"),
    read("v2/workflows/content-production.html"),
    read("v2/workflows/local-prospecting-enrichment.html"),
  ]);

  assert.match(homepage, /assets\/workflows\/content-production-approved-mobile\.png/);
  assert.match(contentDetail, /\.\.\/assets\/workflows\/content-production-approved-mobile\.png/);
  assert.match(homepage, /assets\/workflows\/local-prospecting-mobile\.png/);
  assert.match(homepage, /assets\/workflows\/local-prospecting-desktop\.png/);
  assert.match(prospectingDetail, /\.\.\/assets\/workflows\/local-prospecting-mobile\.png/);
  assert.match(prospectingDetail, /\.\.\/assets\/workflows\/local-prospecting-desktop\.png/);
  assert.doesNotMatch(homepage, /\.\.\/assets\/workflows\/local-prospecting\.png/);
});

test("corrected workflow source truth includes sales authoring, Apollo proposals, and broad visual exploration", async () => {
  const [presentation, prospecting, website, manifest] = await Promise.all([
    read("v2/workflows/presentation-publishing.html"),
    read("v2/workflows/local-prospecting-enrichment.html"),
    read("v2/workflows/image-to-website-production.html"),
    read("v2/assets/workflows/README.md"),
  ]);

  for (const phrase of ["sales team", "HTML presentation", "design system", "customer branding", "maps", "custom graphics"]) {
    assert.ok(presentation.includes(phrase), `Presentation source truth is missing ${phrase}`);
  }

  for (const phrase of ["Apollo", "proposal PDF", "local map", "custom graphic or generated image", "approved send"]) {
    assert.ok(prospecting.includes(phrase), `Prospecting source truth is missing ${phrase}`);
  }

  for (const phrase of ["hero-section explorations", "mood boards", "direction review"]) {
    assert.ok(website.includes(phrase), `Image-to-Website source truth is missing ${phrase}`);
  }

  for (const phrase of [
    "SALES AUTHORING",
    "Apollo",
    "CUSTOM PROPOSAL PDF",
    "APPROVED SEND",
    "HERO EXPLORATIONS",
    "MOOD BOARDS",
    "DIRECTION REVIEW",
  ]) {
    assert.ok(manifest.includes(phrase), `Workflow image-generation manifest is missing ${phrase}`);
  }
});

test("deterministic diagram recreation files are absent", async () => {
  await assert.rejects(access(new URL("v2/artifacts/workflow-system.html", repo)));
  await assert.rejects(access(new URL("scripts/render-v2-workflows.mjs", repo)));
  await assert.rejects(access(new URL("scripts/render-v2-content-mobile.mjs", repo)));
});

test("V2 RCCV edit removes the self-referential transition without changing the shared V1 cut", async () => {
  const { stdout } = await execFileAsync("/opt/homebrew/bin/ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    fileURLToPath(new URL("v2/assets/videos/rccv-showcase-laptop.mp4", repo)),
  ]);
  const duration = Number.parseFloat(stdout);
  assert.ok(duration >= 64 && duration <= 68, `unexpected RCCV duration: ${duration}`);

  const { stdout: sharedOutput } = await execFileAsync("/opt/homebrew/bin/ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    fileURLToPath(new URL("assets/videos/rccv-showcase-laptop.mp4", repo)),
  ]);
  const sharedDuration = Number.parseFloat(sharedOutput);
  assert.ok(sharedDuration >= 71 && sharedDuration <= 72, `shared V1 RCCV duration changed: ${sharedDuration}`);
});
