import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Field Notes remains private and has no deployed discovery surface", async () => {
  const [sourceHome, productionHome, sitemap, ignore, promoter] = await Promise.all([
    read("v2/index.html"),
    read("index.html"),
    read("sitemap.xml"),
    read(".vercelignore"),
    read("scripts/promote-v2-to-root.mjs"),
  ]);

  for (const html of [sourceHome, productionHome]) {
    assert.doesNotMatch(html, /href="\/field-notes\//);
    assert.doesNotMatch(html, /application\/rss\+xml/);
  }
  assert.doesNotMatch(sitemap, /field-notes/);
  assert.match(ignore, /^field-notes\/$/m);
  assert.match(ignore, /^v2\/field-notes\/$/m);
  assert.doesNotMatch(promoter, /cp\(new URL\("v2\/field-notes\//);
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

test("private Field Notes source, renderer, and local output remain available", async () => {
  await Promise.all([
    access(new URL("content/field-notes/", root)),
    access(new URL("scripts/weekly-field-notes/render.mjs", root)),
    access(new URL("v2/field-notes/index.html", root)),
    access(new URL("v2/field-notes/feed.xml", root)),
  ]);
});
