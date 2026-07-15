import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const v2 = path.join(root, "v2");
const detailPath = path.join(v2, "workflows", "presentation-publishing.html");
const detailCssPath = path.join(v2, "workflows", "workflow-detail.css");
const artifactPath = path.join(v2, "artifacts", "presentation-publishing.html");
const artifactCssPath = path.join(v2, "artifacts", "presentation-publishing.css");
const desktopPngPath = path.join(v2, "assets", "presentation-publishing-desktop.png");
const mobilePngPath = path.join(v2, "assets", "presentation-publishing-mobile.png");
const fontDirectory = path.join(v2, "assets", "fonts");

const stages = [
  "Branded HTML presentation",
  "Vercel API deployment",
  "Name and destination validation",
  "Webflow CMS iframe field",
  "Full-screen presentation template",
  "Published URL verification",
];

const requiredSections = [
  "Why it exists",
  "How it works",
  "Tools and data sources",
  "What ships",
  "What stays human",
  "Public-safe proof and constraints",
  "Related work",
];

const read = (filePath) => readFile(filePath, "utf8");

function pngDimensions(buffer) {
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG", "asset is not a PNG");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "IHDR", "PNG has no IHDR header");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function relativeLuminance(hex) {
  const channels = hex.match(/[\da-f]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) => channel <= .04045
    ? channel / 12.92
    : ((channel + .055) / 1.055) ** 2.4);
  return .2126 * red + .7152 * green + .0722 * blue;
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + .05) / (darker + .05);
}

function localReferences(html) {
  const references = [];
  for (const match of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) {
      const reference = candidate.trim().split(/\s+/)[0];
      if (!reference || /^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;
      references.push(reference.split(/[?#]/)[0]);
    }
  }
  return references;
}

test("homepage presentation CTA resolves and uses the responsive V2 publishing artwork", async () => {
  const homepage = await read(path.join(v2, "index.html"));
  const presentation = homepage.match(/<article class="workflow-item workflow-presentation">[\s\S]*?<\/article>/)?.[0];

  assert.ok(presentation, "presentation workflow accordion item is missing");
  const cta = presentation.match(/<a href="([^"]+)">View workflow<\/a>/)?.[1];
  assert.equal(cta, "workflows/presentation-publishing.html");
  await access(fileURLToPath(new URL(cta, pathToFileURL(path.join(v2, "index.html")))));
  assert.match(presentation, /<picture>/);
  assert.match(presentation, /<source media="\(max-width: 699px\)" srcset="assets\/presentation-publishing-mobile\.png">/);
  assert.match(presentation, /<img src="assets\/presentation-publishing-desktop\.png"/);
  assert.doesNotMatch(presentation, /presentation-publishing-six-step\.png/);
});

test("detail page has the required public-safe content and ordered publishing story", async () => {
  const [detail, homepage] = await Promise.all([read(detailPath), read(path.join(v2, "index.html"))]);
  assert.match(detail, /<h1[^>]*>Presentation publishing<\/h1>/);
  assert.match(detail, /branded HTML[\s\S]{0,180}prospect-ready URL[\s\S]{0,180}without a manual deployment or CMS handoff/i);

  let sectionCursor = -1;
  for (const section of requiredSections) {
    const next = detail.indexOf(`>${section}<`);
    assert.ok(next > sectionCursor, `missing or out-of-order section: ${section}`);
    sectionCursor = next;
  }

  let stageCursor = -1;
  for (const stage of stages) {
    const next = detail.indexOf(stage);
    assert.ok(next > stageCursor, `missing or out-of-order stage: ${stage}`);
    stageCursor = next;
  }

  for (const phrase of [
    "self-contained HTML",
    "publishing skill",
    "Vercel API",
    "Webflow CMS API",
    "existing-presentation lookup",
    "iframe embed field",
    "browser verification",
    "Final content and design",
    "confirming the intended name and destination",
    "Vercel-hosted artifact",
    "managed Webflow page",
    "final prospect URL",
    "without exposing credentials, tokens, internal identifiers",
    "Public-safe proof and constraints",
  ]) {
    assert.ok(detail.includes(phrase), `missing required wording: ${phrase}`);
  }

  const presentation = homepage.match(/<article class="workflow-item workflow-presentation">[\s\S]*?<\/article>/)?.[0] || "";
  assert.doesNotMatch(`${detail}\n${presentation}`, /password|protected[- ]link|access control|Zapier|Airtable|Slack/i);
});

test("detail page imports only V2 styles and keeps local navigation, contact, and resume links live", async () => {
  const detail = await read(detailPath);
  const stylesheets = [...detail.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(stylesheets, ["../styles.css", "workflow-detail.css"]);
  assert.doesNotMatch(detail, /<script\b/i);
  assert.match(detail, /href="\.\.\/index\.html#workflows"/);
  assert.match(detail, /href="mailto:michael\.mckerracher@gmail\.com"/);
  assert.match(detail, /href="\.\.\/\.\.\/assets\/Michael-McKerracher-Resume\.pdf"/);

  await Promise.all(localReferences(detail).map((reference) => {
    const resolved = fileURLToPath(new URL(reference, pathToFileURL(detailPath)));
    return access(resolved);
  }));
});

test("detail styles preserve the V2 visual and accessibility contract", async () => {
  const css = await read(detailCssPath);
  assert.ok(css.includes("#df5f38"));
  assert.match(css, /max-width:\s*(?:6[4-9]|7[0-4])ch/);
  assert.match(css, /line-height:\s*1\.(?:5[5-9]|6\d|70)/);
  assert.match(css, /font-family:\s*var\(--font-editorial\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.doesNotMatch(css, /repeating-(?:linear|radial)-gradient/);
});

test("normal-size publishing accent text meets WCAG AA contrast against the canvas", async () => {
  const [baseCss, detailCss] = await Promise.all([
    read(path.join(v2, "styles.css")),
    read(detailCssPath),
  ]);
  const canvas = baseCss.match(/--paper:\s*(#[\dA-F]{6})/i)?.[1];
  const accentText = detailCss.match(/data-workflow="presentation"[^}]+--workflow-dark:\s*(#[\dA-F]{6})/i)?.[1];

  assert.ok(canvas, "V2 canvas token is missing");
  assert.ok(accentText, "semantic accent text token is missing");
  assert.ok(contrastRatio(accentText, canvas) >= 4.5,
    `${accentText} has only ${contrastRatio(accentText, canvas).toFixed(2)}:1 contrast against ${canvas}`);
  assert.match(detailCss, /\.workflow-step\s*>\s*span\s*\{[^}]*color:\s*var\(--workflow-dark\)/s);
  assert.ok(baseCss.includes("--accent: #E3A916"), "hard gold accent token should remain available");
});

test("V2 vendors approved variable fonts and has no remote font dependency", async () => {
  const fontFiles = [
    "dm-sans-latin-variable.woff2",
    "fraunces-latin-variable.woff2",
    "OFL-DM-Sans.txt",
    "OFL-Fraunces.txt",
  ];
  await Promise.all(fontFiles.map((filename) => access(path.join(fontDirectory, filename))));

  for (const filename of fontFiles.filter((filename) => filename.endsWith(".woff2"))) {
    const font = await readFile(path.join(fontDirectory, filename));
    assert.equal(font.subarray(0, 4).toString("ascii"), "wOF2", `${filename} is not a WOFF2 font`);
    assert.ok(font.length > 20_000, `${filename} is unexpectedly small`);
  }

  const [baseCss, artifactCss] = await Promise.all([
    read(path.join(v2, "styles.css")),
    read(artifactCssPath),
  ]);
  for (const css of [baseCss, artifactCss]) {
    assert.doesNotMatch(css, /@import|fonts\.googleapis|fonts\.gstatic|https?:\/\//i);
    assert.match(css, /@font-face[\s\S]*?font-family:\s*"DM Sans"[\s\S]*?font-weight:\s*100 1000[\s\S]*?font-display:\s*(?:swap|block)/);
    assert.match(css, /@font-face[\s\S]*?font-family:\s*"Fraunces"[\s\S]*?font-weight:\s*100 900[\s\S]*?font-display:\s*(?:swap|block)/);
  }
  assert.match(baseCss, /url\("assets\/fonts\/dm-sans-latin-variable\.woff2"\)/);
  assert.match(baseCss, /url\("assets\/fonts\/fraunces-latin-variable\.woff2"\)/);
  assert.match(artifactCss, /url\("\.\.\/assets\/fonts\/dm-sans-latin-variable\.woff2"\)/);
  assert.match(artifactCss, /url\("\.\.\/assets\/fonts\/fraunces-latin-variable\.woff2"\)/);
});

test("editable artwork contains the six stages and a purpose-built mobile layout", async () => {
  const [artifact, css] = await Promise.all([read(artifactPath), read(artifactCssPath)]);
  assert.equal([...artifact.matchAll(/<li class="stage"/g)].length, 6);

  let cursor = -1;
  for (const stage of stages) {
    const next = artifact.indexOf(stage);
    assert.ok(next > cursor, `artifact stage missing or out of order: ${stage}`);
    cursor = next;
  }

  assert.match(artifact, /href="presentation-publishing\.css"/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.match(css, /@media\s*\(min-width:\s*701px\)/);
  assert.match(css, /grid-template-columns:\s*repeat\(6,/);
  assert.match(css, /grid-template-columns:\s*1fr/);
  assert.doesNotMatch(css, /repeating-(?:linear|radial)-gradient/);
});

test("rendered artwork PNGs have the exact desktop and mobile dimensions", async () => {
  const [desktop, mobile] = await Promise.all([readFile(desktopPngPath), readFile(mobilePngPath)]);
  assert.deepEqual(pngDimensions(desktop), { width: 1800, height: 1100 });
  assert.deepEqual(pngDimensions(mobile), { width: 900, height: 1600 });
});

test("render script uses installed Chrome with an override and waits for artwork readiness", async () => {
  const script = await read(path.join(root, "scripts", "render-v2-presentation.mjs"));
  assert.match(script, /puppeteer-core/);
  assert.match(script, /process\.env\.CHROME_PATH/);
  assert.match(script, /Google Chrome\.app\/Contents\/MacOS\/Google Chrome/);
  assert.match(script, /document\.fonts\.load/);
  assert.match(script, /document\.fonts\.ready/);
  assert.match(script, /requestAnimationFrame/);
  assert.match(script, /complete/);
  assert.ok(script.includes("1800") && script.includes("1100"));
  assert.ok(script.includes("900") && script.includes("1600"));
  assert.match(script, /presentation-publishing-desktop\.png/);
  assert.match(script, /presentation-publishing-mobile\.png/);
});

test("permanent V2 browser QA directly verifies the presentation detail page and responsive picture", async () => {
  const qa = await read(path.join(root, "scripts", "qa-v2.mjs"));
  for (const marker of [
    "presentation-publishing.html",
    "detailRoutes",
    "presentation-publishing-desktop.png",
    "presentation-publishing-mobile.png",
    "naturalWidth",
    "naturalHeight",
    "complete",
  ]) {
    assert.ok(qa.includes(marker), `detail-page browser QA is missing ${marker}`);
  }
  assert.match(qa, /for\s*\(const route of detailRoutes\)[\s\S]+for\s*\(const width of \[1440,\s*1024,\s*768,\s*390,\s*320\]\)[\s\S]+presentation-publishing/s);
});
