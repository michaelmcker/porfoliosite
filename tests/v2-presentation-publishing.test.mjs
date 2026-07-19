import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const v2 = path.join(root, "v2");
const detailPath = path.join(v2, "workflows", "presentation-publishing.html");
const detailCssPath = path.join(v2, "workflows", "workflow-detail.css");
const artworkManifestPath = path.join(v2, "assets", "workflows", "README.md");
const desktopPngPath = path.join(v2, "assets", "workflows", "presentation-publishing-desktop.png");
const mobilePngPath = path.join(v2, "assets", "workflows", "presentation-publishing-mobile.png");
const fontDirectory = path.join(v2, "assets", "fonts");

const stages = [
  "Create the branded HTML artifact",
  "Call Cloud Scale Deploy",
  "Deploy the existing presentation",
  "Pass the deployed URL to Webflow",
  "Validate and write the CMS record",
  "Publish and return the link",
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
  assert.match(presentation, /<source media="\(max-width: 699px\)" srcset="assets\/workflows\/presentation-publishing-mobile\.png">/);
  assert.match(presentation, /<img src="assets\/workflows\/presentation-publishing-desktop\.png"/);
  assert.doesNotMatch(presentation, /presentation-publishing-six-step\.png/);
});

test("detail page has the required public-safe content and ordered publishing story", async () => {
  const [detail, homepage] = await Promise.all([read(detailPath), read(path.join(v2, "index.html"))]);
  assert.match(detail, /<h1[^>]*>Presentation publishing<\/h1>/);
  assert.match(detail, /existing HTML presentation[\s\S]{0,260}published Webflow link[\s\S]{0,120}without a manual deployment or CMS handoff/i);

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
    "sales team",
    "HTML presentation",
    "design system",
    "customer branding",
    "maps",
    "custom graphics",
    "Cloud Scale Deploy",
    "/deploy/presentation",
    "existing presentation",
    "Vercel API",
    "Webflow CMS API",
    "duplicate name",
    "iframe embed field",
    "Publish the Webflow site",
    "return the final link",
    "final presentation approval",
    "intended page name",
    "Vercel-hosted artifact",
    "managed Webflow page",
    "published Webflow link",
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

  const baseCss = await read(path.join(v2, "styles.css"));
  assert.doesNotMatch(baseCss, /@import|fonts\.googleapis|fonts\.gstatic|https?:\/\//i);
  assert.match(baseCss, /@font-face[\s\S]*?font-family:\s*"DM Sans"[\s\S]*?font-weight:\s*100 1000[\s\S]*?font-display:\s*(?:swap|block)/);
  assert.match(baseCss, /@font-face[\s\S]*?font-family:\s*"Fraunces"[\s\S]*?font-weight:\s*100 900[\s\S]*?font-display:\s*(?:swap|block)/);
  assert.match(baseCss, /url\("assets\/fonts\/dm-sans-latin-variable\.woff2"\)/);
  assert.match(baseCss, /url\("assets\/fonts\/fraunces-latin-variable\.woff2"\)/);
});

test("image-generation source truth contains the five-stage Cloud Scale pipeline", async () => {
  const manifest = await read(artworkManifestPath);
  assert.match(manifest, /image-generated portfolio artwork/i);
  assert.match(manifest, /strict style reference/i);
  assert.match(manifest, /SALES AUTHORING/);
  assert.match(manifest, /CUSTOMER BRAND/);
  assert.match(manifest, /DESIGN SYSTEM/);
  assert.match(manifest, /MAPS \+ CUSTOM GRAPHICS/);
  assert.match(manifest, /BRANDED HTML PRESENTATION/);
  assert.match(manifest, /Cloud Scale Deploy/);
  assert.match(manifest, /\/deploy\/presentation/);
  assert.match(manifest, /Vercel API/);
  assert.match(manifest, /Webflow API/);
  assert.match(manifest, /VALIDATE PAGE NAME[\s\S]*WRITE URL TO IFRAME CMS FIELD/);
  assert.match(manifest, /PUBLISH WEBFLOW SITE[\s\S]*RETURN PUBLISHED LINK/);
  assert.match(manifest, /Desktop and mobile are separate image-generation compositions/i);
  assert.match(manifest, /Do not add password or duplicate verification stages/i);
});

test("image-generated artwork PNGs are high-resolution, responsive compositions", async () => {
  const [desktop, mobile] = await Promise.all([readFile(desktopPngPath), readFile(mobilePngPath)]);
  const desktopDimensions = pngDimensions(desktop);
  const mobileDimensions = pngDimensions(mobile);
  assert.ok(desktopDimensions.width >= 1600 && desktopDimensions.width > desktopDimensions.height);
  assert.ok(mobileDimensions.height >= 1800 && mobileDimensions.height > mobileDimensions.width * 2);
});

test("rejected deterministic workflow renderers cannot overwrite generated artwork", async () => {
  await assert.rejects(access(path.join(root, "scripts", "render-v2-workflows.mjs")));
  await assert.rejects(access(path.join(root, "scripts", "render-v2-content-mobile.mjs")));
  await assert.rejects(access(path.join(v2, "artifacts", "workflow-system.html")));
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
