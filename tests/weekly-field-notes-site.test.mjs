import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the portfolio and search surfaces discover the public field notes index", async () => {
  const [sourceHome, productionHome, index, sitemap, robots] = await Promise.all([
    read("v2/index.html"),
    read("index.html"),
    read("v2/field-notes/index.html"),
    read("sitemap.xml"),
    read("robots.txt"),
  ]);

  assert.match(sourceHome, /<nav aria-label="Primary navigation">[\s\S]*href="\/field-notes\/"[^>]*>Field Notes<\/a>/);
  assert.match(productionHome, /href="\/field-notes\/"[^>]*>Field Notes<\/a>/);
  assert.match(index, /<link rel="canonical" href="https:\/\/michaelmck\.site\/field-notes\/">/);
  assert.match(index, /rel="alternate" type="application\/rss\+xml"/);
  assert.match(index, /"@type":"Blog"/);
  assert.match(sitemap, /<loc>https:\/\/michaelmck\.site\/field-notes\/<\/loc>/);
  assert.doesNotMatch(robots, /Disallow:\s*\/field-notes/i);
});

test("private weekly state and source Markdown stay outside the deployed site", async () => {
  const [ignore, publicIndex, feed] = await Promise.all([
    read(".vercelignore"),
    read("field-notes/index.html"),
    read("field-notes/feed.xml"),
  ]);
  assert.match(ignore, /^content\/$/m);
  assert.match(ignore, /^docs\/$/m);

  const publicText = `${publicIndex}\n${feed}`;
  for (const forbidden of [
    ".codex/automations",
    "approval.json",
    "evidence.json",
    "draft.md",
    "gate-report.json",
    "privateTerms",
    "Project Nightjar",
  ]) {
    assert.doesNotMatch(publicText, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("V2 promotion copies the field notes route to production without changing its canonical URL", async () => {
  const [sourceIndex, productionIndex, sourceFeed, productionFeed] = await Promise.all([
    read("v2/field-notes/index.html"),
    read("field-notes/index.html"),
    read("v2/field-notes/feed.xml"),
    read("field-notes/feed.xml"),
  ]);
  assert.equal(productionIndex, sourceIndex);
  assert.equal(productionFeed, sourceFeed);
});
