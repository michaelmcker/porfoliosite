import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage avoids loading oversized and below-fold media during first paint", async () => {
  const [html, preview, css] = await Promise.all([
    read("v2/index.html"),
    read("v2/okanagan-preview/index.html"),
    read("v2/styles.css"),
  ]);

  assert.match(html, /portfolio-hero-system-map-desktop-1080p\.mp4/);
  assert.doesNotMatch(html, /portfolio-hero-system-map-desktop-4k-sparse-loop\.mp4/);
  assert.match(html, /<iframe[^>]+data-accommodation-page[^>]+loading="lazy"/);
  assert.equal((preview.match(/preload="auto"/g) || []).length, 0);
  assert.ok((preview.match(/preload="none"/g) || []).length >= 3);

  for (const src of [
    "../assets/device-mockups/laptop-graphite-frame.png",
    "../assets/samples/vertical-impression-local-proposal-current.png",
    "../assets/screens/vertical-impression-why-elevators.png",
    "../assets/campaigns/vertical-impression-albums-composite.png",
    "assets/workflows/content-production-approved-desktop.png",
    "assets/workflows/agency-dashboard-desktop.png",
    "assets/workflows/presentation-publishing-desktop.png",
    "assets/workflows/local-prospecting-desktop.png",
    "assets/workflows/image-to-website-desktop.png",
    "../assets/screens/fountainhead-ai-visibility-dashboard-v4.png",
  ]) {
    const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(html, new RegExp(`<img[^>]+src="${escaped}"[^>]+loading="lazy"[^>]+decoding="async"`));
  }
  assert.match(html, /poster="\.\.\/assets\/videos\/portfolio-hero-system-map-desktop-poster\.webp"/);
  assert.match(html, /poster="\.\.\/assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.webp"/);
  assert.match(html, /poster="\.\.\/assets\/screens\/cool-runnings-home\.webp"/);
  assert.match(css, /mask-image:\s*url\("\.\.\/assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.webp"\)/);
  assert.doesNotMatch(css, /mask-image:\s*url\("\.\.\/assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.png"\)/);
});

test("Vercel publishes every optimized asset introduced by the performance pass", async () => {
  const ignore = await read(".vercelignore");

  for (const asset of [
    "assets/videos/portfolio-hero-system-map-desktop-1080p.mp4",
    "assets/videos/portfolio-hero-system-map-desktop-poster.webp",
    "assets/device-mockups/laptop-three-quarter-rccv-cutout.webp",
    "assets/screens/cool-runnings-home.webp",
    "assets/device-mockups/laptop-graphite-frame.png",
    "assets/samples/vertical-impression-public-proposal-sample-page-1.png",
    "assets/workflows/content-workflow-approved-stage.png",
  ]) {
    assert.match(ignore, new RegExp(`!${asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
  assert.doesNotMatch(ignore, /^assets\/portrait-final\/assets\/production(?:\/|\*)/m);
});

test("workflow evidence uses a black chapter with a paper artifact stage", async () => {
  const css = await read("v2/styles.css");

  assert.match(css, /\.workflow-section\s*\{[^}]*background:\s*var\(--charcoal\)[^}]*color:\s*white/s);
  assert.match(css, /\.workflow-accordion\s*\{[^}]*background:\s*var\(--charcoal\)/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*background:\s*var\(--charcoal\)/s);
  assert.match(css, /\.workflow-panel figure\s*\{[^}]*background:\s*#e7e8e3/s);
});

test("About conclusion resolves beside the portrait rather than at the frame bottom", async () => {
  const css = await read("v2/styles.css");

  assert.doesNotMatch(css, /\.about-process-reveal\s*\{[^}]*6svh\s*\*\s*var\(--about-value/s);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.about-process-reveal\s*\{[^}]*top:\s*58svh/s);
});

test("finale locks immediately, preloads early, and uses lightweight contact art", async () => {
  const [html, finale] = await Promise.all([
    read("v2/index.html"),
    read("v2/contact-finale.js"),
  ]);

  assert.match(finale, /waitForContactImages/);
  assert.match(finale, /prepareContactImages/);
  assert.match(finale, /image\.decode\(\)/);
  assert.match(finale, /rootMargin:\s*"120% 0px"/);
  assert.match(finale, /threshold:\s*\.12/);
  const entrance = finale.match(/async function startEntrance\(\)\s*\{([\s\S]*?)\n  \}/)?.[1] || "";
  assert.ok(
    entrance.indexOf("lockViewport()") >= 0
      && entrance.indexOf("lockViewport()") < entrance.indexOf("await prepareContactImages()"),
    "the finale must lock before it waits for image decoding",
  );

  for (const asset of [
    "cool-runnings.webp",
    "proposal.webp",
    "elevators.webp",
    "content.webp",
    "dashboard.webp",
    "publishing.webp",
    "prospecting.webp",
    "website.webp",
  ]) {
    assert.match(html, new RegExp(`assets/finale/${asset}`));
    const details = await stat(new URL(`../v2/assets/finale/${asset}`, import.meta.url));
    assert.ok(details.size < 400_000, `${asset} is too heavy for the finale: ${details.size} bytes`);
  }
});

test("Fountainhead role uses the approved marketing engineer title", async () => {
  const html = await read("v2/index.html");
  assert.match(html, /Fountainhead\.ai[\s\S]*?Marketing Engineer &amp; Co-Founder/);
  assert.doesNotMatch(html, /GTM Engineer &amp; Co-Founder/);
});

test("proposal preview does not download an unused PDF before generation", async () => {
  const html = await read("v2/proposal-generator.html");
  assert.match(html, /<iframe[\s\S]*?title="Generated elevator advertising proposal"[\s\S]*?src="about:blank"/);
  assert.doesNotMatch(html, /src="\.\.\/output\/pdf\/vertical-impression-local-proposal-sample\.pdf/);
});

test("Cool Runnings metrics refresh is a remote scheduled GitHub Action", async () => {
  const workflow = await read(".github/workflows/refresh-cool-runnings-metrics.yml");

  assert.match(workflow, /schedule:\s*\n\s*-\s*cron:/);
  assert.match(workflow, /GSC_GOOGLE_OAUTH_CREDENTIALS:\s*\$\{\{\s*secrets\.GSC_GOOGLE_OAUTH_CREDENTIALS\s*\}\}/);
  assert.match(workflow, /GA4_GOOGLE_OAUTH_CREDENTIALS:\s*\$\{\{\s*secrets\.GA4_GOOGLE_OAUTH_CREDENTIALS\s*\}\}/);
  assert.match(workflow, /GSC_GOOGLE_APPLICATION_CREDENTIALS:\s*\$\{\{\s*runner\.temp\s*\}\}\/gsc-google-oauth\.json/);
  assert.match(workflow, /GA4_GOOGLE_APPLICATION_CREDENTIALS:\s*\$\{\{\s*runner\.temp\s*\}\}\/ga4-google-oauth\.json/);
  assert.match(workflow, /node scripts\/refresh-cool-runnings-metrics\.mjs/);
  assert.match(workflow, /git push/);
  assert.doesNotMatch(workflow, /google-github-actions\/auth|workload_identity_provider|launchctl|\/Users\/michaelmckerracher|refresh_token/);
});
