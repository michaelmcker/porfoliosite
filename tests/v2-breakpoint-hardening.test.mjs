import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage breakpoint contract avoids duplicate rules and horizontal browser traps", async () => {
  const [css, app] = await Promise.all([
    read("v2/styles.css"),
    read("v2/app.js"),
  ]);

  assert.equal((css.match(/grid-template-columns:\s*minmax\(420px,\s*\.72fr\)\s*minmax\(0,\s*1\.28fr\)/g) || []).length, 1);
  assert.doesNotMatch(css, /\.hero-video-statement small\s*\{[^}]*\}\s*\.hero-video-statement small\s*\{/s);
  assert.match(css, /\.accommodation-viewport\s*\{[^}]*touch-action:\s*pan-y/s);
  assert.doesNotMatch(app, /(?:wheel|touchmove)[\s\S]{0,120}preventDefault/);
});

test("proposal client removes duplicate submission work and contains its generated viewer", async () => {
  const client = await read("proposal-generator.js");

  assert.equal((client.match(/form\?\.addEventListener\('submit'/g) || []).length, 1);
  assert.doesNotMatch(client, /event\.preventDefault\(\);\s*event\.preventDefault\(\);/);
  assert.match(client, /previewImage\.src\s*=\s*generatedPreviewUrl/);
  assert.doesNotMatch(client, /frame\.src|syncProposalPdfViewport|PROPOSAL_PDF_DESKTOP_WIDTH/);
  assert.doesNotMatch(client, /previewImage\?\.scrollIntoView/);
});
