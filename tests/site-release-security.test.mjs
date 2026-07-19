import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertSameOrigin,
  parseJsonBody,
} from "../api/_lib/proposal/request-security.js";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

test("proposal POST origin validation rejects missing and scheme-mismatched origins", () => {
  assert.throws(
    () => assertSameOrigin({ headers: { host: "portfolio.example" } }, { requireOrigin: true }),
    (error) => error.statusCode === 403,
  );
  assert.throws(
    () => assertSameOrigin({
      headers: {
        host: "portfolio.example",
        origin: "http://portfolio.example",
        "x-forwarded-proto": "https",
      },
    }, { requireOrigin: true }),
    (error) => error.statusCode === 403,
  );
  assert.doesNotThrow(() => assertSameOrigin({
    headers: {
      host: "portfolio.example",
      origin: "https://portfolio.example",
      "x-forwarded-proto": "https",
    },
  }, { requireOrigin: true }));
});

test("already-parsed JSON objects still respect the request byte limit", async () => {
  await assert.rejects(
    () => parseJsonBody({
      headers: { "content-type": "application/json" },
      body: { businessName: "x".repeat(20_000) },
    }),
    (error) => error.statusCode === 413,
  );
});

test("proposal admission limits reject repeated requests from one client", async () => {
  const { assertRateLimit } = await import("../api/_lib/proposal/request-security.js");
  const request = { headers: { "x-forwarded-for": `203.0.113.${Date.now() % 200}` } };
  const bucket = `test-${Date.now()}`;
  assert.doesNotThrow(() => assertRateLimit(request, {
    bucket,
    limit: 1,
    windowMs: 60_000,
  }));
  assert.throws(
    () => assertRateLimit(request, {
      bucket,
      limit: 1,
      windowMs: 60_000,
    }),
    (error) => error.statusCode === 429,
  );
});

test("remote proposal images require HTTPS image responses within the byte cap", async () => {
  const { fetchImageAsDataUrl } = await import("../api/_lib/proposal/remote-image.js");
  const fetchImpl = async () => new Response(Uint8Array.from([137, 80, 78, 71]), {
    status: 200,
    headers: { "content-type": "image/png", "content-length": "4" },
  });
  assert.equal(
    await fetchImageAsDataUrl("https://cdn.example/image.png", { fetchImpl, maxBytes: 8 }),
    "data:image/png;base64,iVBORw==",
  );
  await assert.rejects(
    () => fetchImageAsDataUrl("http://cdn.example/image.png", { fetchImpl }),
    /HTTPS/,
  );
  await assert.rejects(
    () => fetchImageAsDataUrl("https://127.0.0.1/image.png", { fetchImpl }),
    /private or local/,
  );
  await assert.rejects(
    () => fetchImageAsDataUrl("https://cdn.example/image.png", {
      fetchImpl: async () => new Response("not an image", {
        status: 200,
        headers: { "content-type": "text/html" },
      }),
    }),
    /image response/,
  );
  await assert.rejects(
    () => fetchImageAsDataUrl("https://cdn.example/image.png", {
      fetchImpl: async () => new Response(Uint8Array.from([1, 2, 3, 4]), {
        status: 200,
        headers: { "content-type": "image/png", "content-length": "4" },
      }),
      maxBytes: 3,
    }),
    /too large/,
  );
});

test("proposal Chromium rendering removes disabled web security and blocks external page requests", async () => {
  const [generate, perspective] = await Promise.all([
    read("api/proposal/generate.js"),
    read("api/_lib/proposal/perspective.js"),
  ]);
  for (const source of [generate, perspective]) {
    assert.match(source, /filter\(\(argument\) => argument !== ["']--disable-web-security["']\)/);
    assert.match(source, /setRequestInterception\(true\)/);
    assert.match(source, /request\.abort\(\)/);
  }
});

test("proposal routes share strict browser headers and API no-store headers", async () => {
  const config = JSON.parse(await read("vercel.json"));
  for (const source of ["/proposal-generator.html", "/v2/proposal-generator.html"]) {
    const route = config.headers?.find((entry) => entry.source === source);
    assert.ok(route, `missing security headers for ${source}`);
    const headers = Object.fromEntries(route.headers.map(({ key, value }) => [key.toLowerCase(), value]));
    assert.match(headers["content-security-policy"], /default-src 'self'/);
    assert.match(headers["content-security-policy"], /frame-src 'self' blob:/);
    assert.equal(headers["x-frame-options"], "SAMEORIGIN");
  }
});

test("production dependencies use the newest compatible serverless Chromium pair", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.equal(packageJson.dependencies["@sparticuz/chromium-min"], "149.0.0");
  assert.equal(packageJson.dependencies["puppeteer-core"], "25.1.0");
});

test("canonical sitemap and robots files expose only intended public routes", async () => {
  const [sitemap, robots] = await Promise.all([read("sitemap.xml"), read("robots.txt")]);
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expected = [
    "https://michaelmck.site/",
    "https://michaelmck.site/proposal-generator.html",
    "https://michaelmck.site/v2/",
    "https://michaelmck.site/v2/proposal-generator.html",
    "https://michaelmck.site/v2/work/local-search-magnet.html",
    "https://michaelmck.site/v2/workflows/agency-management-dashboard.html",
    "https://michaelmck.site/v2/workflows/content-production.html",
    "https://michaelmck.site/v2/workflows/image-to-website-production.html",
    "https://michaelmck.site/v2/workflows/local-prospecting-enrichment.html",
    "https://michaelmck.site/v2/workflows/presentation-publishing.html",
  ];
  assert.deepEqual(locations, expected);
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/michaelmck\.site\/sitemap\.xml$/m);
});

test("internal review scorecard is excluded from Vercel deployment", async () => {
  const ignore = await read(".vercelignore");
  assert.match(ignore, /^portfolio-style-round-scorecard\.html$/m);
  assert.match(ignore, /^v2\/assets\/backgrounds\/$/m);
  assert.match(ignore, /^v2\/assets\/workflows\/candidates\/$/m);
  assert.match(ignore, /^!assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.png$/m);
});
