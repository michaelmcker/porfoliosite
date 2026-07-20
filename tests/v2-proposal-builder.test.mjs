import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

test("V2 proposal builder reuses the working generator contract", async () => {
  const [html, css, homepage, client] = await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
    read("v2/index.html"),
    read("proposal-generator.js"),
  ]);

  for (const hook of [
    "data-proposal-form",
    "data-address-field",
    "data-address-results",
    "data-proposal-error",
    "data-proposal-frame",
    "data-proposal-loading",
    "data-loading-message",
    "data-preview-state",
    "data-preview-actions",
    "data-open-pdf",
    "data-download-pdf",
    "data-submit-label",
  ]) {
    assert.ok(html.includes(hook), `missing working generator hook: ${hook}`);
  }

  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<link rel="stylesheet" href="proposal-generator\.css">/);
  assert.match(html, /src="\.\.\/proposal-generator\.js\?v=20260720-2"/);
  assert.match(homepage, /href="proposal-generator\.html">Try the generator<\/a>/);
  assert.match(client, /\/api\/proposal\/suggest/);
  assert.match(client, /\/api\/proposal\/generate/);
});

test("V2 proposal builder explains the four generated elements", async () => {
  const [html, css] = await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
  ]);

  assert.equal((html.match(/class="proposal-callout/g) || []).length, 4);
  for (const copy of [
    "Custom proposal",
    "Business and industry context shape the copy, elevator creative, and mapped opportunity.",
    "Pricing",
    "Current per-screen pricing is carried into the proposal package.",
    "Screens",
    "Nearby inventory supplies the live number of available screens.",
    "Impressions",
    "The proposal carries the monthly impression estimate for that inventory.",
  ]) {
    assert.ok(html.includes(copy), `missing approved annotation copy: ${copy}`);
  }

  assert.equal((html.match(/data-proposal-target="(proposal|pricing|screens|impressions)"/g) || []).length, 4);
  assert.equal((html.match(/data-proposal-callout="(proposal|pricing|screens|impressions)"/g) || []).length, 4);
  assert.equal((html.match(/data-proposal-path="(proposal|pricing|screens|impressions)"/g) || []).length, 4);
  assert.match(html, /class="proposal-annotation-paths"[^>]+data-proposal-connectors/);
  assert.match(html, /class="proposal-preview__sample"[^>]+vertical-impression-local-proposal-current\.png/);
  assert.match(css, /\.proposal-annotations\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.proposal-explainer\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:/s);
  assert.match(css, /\.proposal-annotation-paths\s*\{[^}]*position:\s*absolute[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.proposal-target\s*\{[^}]*position:\s*absolute[^}]*border-radius:\s*50%/s);
  assert.match(css, /\.proposal-target--pricing\s*\{[^}]*left:\s*14%[^}]*top:\s*79\.5%/s);
  assert.match(css, /\.proposal-target--screens\s*\{[^}]*left:\s*14%[^}]*top:\s*64\.5%/s);
  assert.match(css, /\.proposal-target--impressions\s*\{[^}]*left:\s*14%[^}]*top:\s*71\.5%/s);
  assert.doesNotMatch(css, /\.proposal-annotations\s*\{[^}]*position:\s*absolute/s);
  assert.match(css, /:has\(iframe\[src\^="blob:"\]\)/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.proposal-annotation-paths\s*\{[^}]*display:\s*none/s);
});

test("V2 proposal callouts are boxed off the proposal and connect it to reviewed outreach", async () => {
  const [html, css, workflow] = await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
    read("v2/workflows/local-prospecting-enrichment.html"),
  ]);

  assert.match(css, /\.proposal-callout\s*\{[^}]*padding:\s*18px/s);
  assert.match(css, /\.proposal-callout\s*\{[^}]*background:\s*var\(--proposal-cream\)/s);
  assert.match(html, /class="proposal-outreach"/);
  assert.match(html, /Built to travel with the outreach\./);
  assert.match(html, /class="outreach-email"/);
  assert.match(html, /class="outreach-email__attachment"/);
  assert.match(html, /A salesperson reviewed the recipient, language, offer, and final send\./);
  assert.match(html, /href="workflows\/local-prospecting-enrichment\.html"/);
  assert.doesNotMatch(html, /automatically sends|automatic outreach/i);
  const email = html.match(/<article class="outreach-email"[\s\S]*?<\/article>/)?.[0] || "";
  assert.match(email, /an idea for <span data-email-location>\[Neighbourhood\]<\/span>/);
  assert.match(email, /data-email-industry-title>\[Industry\]<\/span> around <span data-email-location>\[Neighbourhood\]<\/span>/);
  assert.match(email, /competing on the first page of Google with hundreds of other <span data-email-industry-plural>businesses<\/span>/);
  assert.match(email, /<span data-email-screen-count>\[number of screens\]<\/span> elevator screens within five miles/);
  assert.match(email, /apartment and office buildings where <span data-email-audience>potential customers<\/span> live and work/);
  assert.match(email, /a more personal, conversational ad/);
  assert.match(email, /mocked it up on an elevator screen/);
  assert.match(email, /mapped the nearby buildings/);
  assert.match(email, /attached the idea/);
  assert.doesNotMatch(email, /92 buildings|327 screens|223\.5 million|\$70 per screen/);
  assert.match(workflow, /Generate the proposal PDF/);
  assert.match(workflow, /personalized email[\s\S]*custom proposal PDF/);
  assert.match(workflow, /Apollo/);
  assert.match(workflow, /approved send/);
  assert.match(workflow, /href="\.\.\/proposal-generator\.html"/);
});

test("V2 proposal form personalizes the outreach email and explains generation progress", async () => {
  const [html, css, client, generateApi] = await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
    read("proposal-generator.js"),
    read("api/proposal/generate.js"),
  ]);

  for (const hook of [
    "data-email-business",
    "data-email-industry-title",
    "data-email-industry",
    "data-email-industry-plural",
    "data-email-audience",
    "data-email-location",
    "data-email-screen-count",
  ]) {
    assert.ok(html.includes(hook), `missing dynamic email hook: ${hook}`);
  }
  assert.match(client, /function updateEmailPreview/);
  assert.match(client, /function deriveLocalArea/);
  assert.match(client, /x-proposal-screen-count/);
  assert.match(client, /generatedScreenCount == null\s*\?\s*'\[number of screens\]'\s*:\s*String\(generatedScreenCount\)/);
  assert.match(generateApi, /X-Proposal-Screen-Count/);
  assert.match(client, /Generating — should be ready in a few minutes\./);
  assert.match(client, /classList\.add\(['"]is-generating['"]\)/);
  assert.match(client, /classList\.remove\(['"]is-generating['"]\)/);
  assert.match(css, /\.proposal-submit\.is-generating::after\s*\{/);
  assert.match(css, /@keyframes proposal-button-progress/);
  assert.match(css, /\.proposal-workspace\s*\{[^}]*background:\s*#fff[^}]*color:\s*var\(--ink\)/s);
  const workspaceInnerRule = css.match(/\.proposal-workspace__inner\s*\{([^}]*)\}/s)?.[1] || "";
  assert.doesNotMatch(workspaceInnerRule, /background|border-radius|box-shadow/);
  assert.match(client, /function syncProposalConnectors\(\)/);
  assert.match(client, /ResizeObserver/);
});

test("V2 proposal builder keeps secrets and internal inventory out of browser source", async () => {
  const browserSource = (await Promise.all([
    read("v2/proposal-generator.html"),
    read("v2/proposal-generator.css"),
    read("proposal-generator.js"),
  ])).join("\n");

  assert.doesNotMatch(browserSource, /MAPBOX_ACCESS_TOKEN|LETZAI_API_KEY|api\.letz\.ai|inventory\.json/i);
});

test("proposal APIs enforce a bounded same-origin JSON request contract", async () => {
  const helperUrl = new URL("api/_lib/proposal/request-security.js", repoUrl);
  assert.ok(existsSync(helperUrl), "request security helper is missing");
  const {
    assertBodySize,
    assertJsonRequest,
    assertSameOrigin,
    parseJsonBody,
  } = await import(helperUrl);

  assert.throws(
    () => assertSameOrigin({ headers: { origin: "https://evil.example", host: "portfolio.example" } }),
    (error) => error.statusCode === 403 && /Cross-site/.test(error.message),
  );
  assert.doesNotThrow(() => assertSameOrigin({ headers: { origin: "https://portfolio.example", host: "portfolio.example" } }));
  assert.doesNotThrow(() => assertSameOrigin({ headers: {} }));
  assert.throws(
    () => assertJsonRequest({ headers: { "content-type": "text/plain" } }),
    (error) => error.statusCode === 415 && /application\/json/.test(error.message),
  );
  assert.throws(
    () => assertBodySize({ headers: { "content-length": "20000" } }, 16_384),
    (error) => error.statusCode === 413 && /too large/.test(error.message),
  );
  await assert.rejects(
    () => parseJsonBody({ headers: { "content-type": "application/json" }, body: "not json" }),
    (error) => error.statusCode === 400 && /Invalid JSON/.test(error.message),
  );
});

test("Vercel scopes strict browser headers to the new proposal route", async () => {
  const config = JSON.parse(await read("vercel.json"));
  const route = config.headers?.find(({ source }) => source === "/v2/proposal-generator.html");
  assert.ok(route, "V2 proposal security header route is missing");
  const headers = Object.fromEntries(route.headers.map(({ key, value }) => [key.toLowerCase(), value]));

  assert.match(headers["content-security-policy"], /default-src 'self'/);
  assert.match(headers["content-security-policy"], /connect-src 'self'/);
  assert.match(headers["content-security-policy"], /frame-src 'self' blob:/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["x-frame-options"], "SAMEORIGIN");
  assert.equal(headers["referrer-policy"], "strict-origin-when-cross-origin");
  assert.match(headers["permissions-policy"], /camera=\(\)/);
});

test("Vercel does not publish project instructions or repository automation", async () => {
  const ignore = await read(".vercelignore");
  assert.match(ignore, /^AGENTS\.md$/m);
  assert.match(ignore, /^DESIGN\.md$/m);
  assert.match(ignore, /^PRODUCT\.md$/m);
  assert.match(ignore, /^\.github\/$/m);
  assert.match(ignore, /^v2\/assets\/backgrounds\/$/m);
});

test("permanent browser QA covers the V2 proposal layout and API boundary", async () => {
  const qaUrl = new URL("tests/qa-v2-proposal-builder.mjs", repoUrl);
  assert.ok(existsSync(qaUrl), "V2 proposal browser QA is missing");
  const qa = await read("tests/qa-v2-proposal-builder.mjs");

  assert.match(qa, /width:\s*1440/);
  assert.match(qa, /width:\s*390/);
  assert.match(qa, /connectorCount/);
  assert.match(qa, /emailLocation/);
  assert.match(qa, /\/api\/proposal\/suggest/);
  assert.match(qa, /\/api\/proposal\/generate/);
  assert.match(qa, /scrollWidth/);
  assert.match(qa, /44/);
});
