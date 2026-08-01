import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { buildFieldNotes, markdownToHtml, parseEntry } from "../scripts/weekly-field-notes/render.mjs";

const repoPath = new URL("../", import.meta.url).pathname;
const fixturePath = join(repoPath, "tests/fixtures/weekly-field-notes/published-entry.md");

async function buildFixture() {
  const root = await mkdtemp(join(tmpdir(), "field-notes-render-"));
  await mkdir(join(root, "content/field-notes"), { recursive: true });
  await cp(fixturePath, join(root, "content/field-notes/2026-W31.md"));
  await writeFile(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://michaelmck.site/</loc></url>\n  <url><loc>https://michaelmck.site/field-notes/</loc></url>\n</urlset>\n`);
  return { root, result: await buildFieldNotes({ repoRoot: root }) };
}

test("entry parsing rejects raw HTML and unknown publication states", async () => {
  const source = await readFile(fixturePath, "utf8");
  const entry = parseEntry(source, "fixture.md");
  assert.equal(entry.slug, "useful-system-began-with-a-refusal");
  assert.equal(entry.status, "published");
  assert.throws(() => markdownToHtml("<script>alert(1)</script>"), /raw HTML/i);
  assert.throws(() => parseEntry(source.replace("status: published", "status: maybe"), "fixture.md"), /status/i);
});

test("renderer creates an accessible disclosed article, index, schema, and feed", async () => {
  const { root, result } = await buildFixture();
  assert.deepEqual(result, { published: 1, slugs: ["useful-system-began-with-a-refusal"] });

  const [index, article, feed, sitemap] = await Promise.all([
    readFile(join(root, "v2/field-notes/index.html"), "utf8"),
    readFile(join(root, "v2/field-notes/useful-system-began-with-a-refusal/index.html"), "utf8"),
    readFile(join(root, "v2/field-notes/feed.xml"), "utf8"),
    readFile(join(root, "sitemap.xml"), "utf8"),
  ]);

  assert.match(index, /<main id="main-content">/);
  assert.match(index, /Codex writes this log\. Mike McKerracher co-authors it/);
  assert.match(index, /How this log works/);
  assert.match(index, /"@type":"Blog"/);
  assert.match(index, /rel="alternate" type="application\/rss\+xml"/);
  assert.match(index, /useful-system-began-with-a-refusal/);

  assert.match(article, /<link rel="canonical" href="https:\/\/michaelmck\.site\/field-notes\/useful-system-began-with-a-refusal\/">/);
  assert.match(article, /<article class="field-note"/);
  assert.match(article, /Codex writes this log\. Mike McKerracher co-authors it/);
  assert.match(article, /"@type":"BlogPosting"/);
  assert.match(article, /<strong>structured prompt<\/strong>/);
  assert.match(article, /<ul>/);
  assert.match(article, /aria-label="Field note navigation"/);

  assert.match(feed, /<rss version="2\.0">/);
  assert.match(feed, /The useful system began with a refusal/);
  assert.match(feed, /https:\/\/michaelmck\.site\/field-notes\/useful-system-began-with-a-refusal\//);
  assert.match(sitemap, /<loc>https:\/\/michaelmck\.site\/field-notes\/useful-system-began-with-a-refusal\/<\/loc>/);
});

test("draft entries are ignored and repeat builds are byte-identical", async () => {
  const { root } = await buildFixture();
  const draft = (await readFile(fixturePath, "utf8")).replace("status: published", "status: draft").replace("slug: useful-system-began-with-a-refusal", "slug: private-draft");
  await writeFile(join(root, "content/field-notes/draft.md"), draft);
  await buildFieldNotes({ repoRoot: root });
  const first = await readFile(join(root, "v2/field-notes/index.html"), "utf8");
  await buildFieldNotes({ repoRoot: root });
  const second = await readFile(join(root, "v2/field-notes/index.html"), "utf8");

  assert.equal(first, second);
  assert.doesNotMatch(first, /private-draft/);
});

test("renderer escapes prose before applying its small Markdown subset", () => {
  const html = markdownToHtml("A & B use **visible proof**.\n\n- One\n- Two");
  assert.match(html, /A &amp; B/);
  assert.match(html, /<strong>visible proof<\/strong>/);
  assert.match(html, /<ul><li>One<\/li><li>Two<\/li><\/ul>/);
});
