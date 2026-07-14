import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const v2Url = new URL("../v2/", import.meta.url);
const fileUrl = (name) => new URL(name, v2Url);

async function readV2(name) {
  return readFile(fileUrl(name), "utf8");
}

test("V2 is isolated in its own three production files", async () => {
  const [html, css, app] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("app.js"),
  ]);

  assert.match(html, /<link[^>]+href="styles\.css"/);
  assert.match(html, /<script[^>]+src="app\.js"/);
  assert.doesNotMatch(html, /(?:href|src)="\.\.\/(?:styles\.css|app\.js|workflow-reset\.css|styles\/)/);
  assert.doesNotMatch(css, /@import\s+["']?\.\.\/(?:styles|workflow-reset)/);
  assert.ok(app.length > 0);
});

test("V2 contains the required sections and selected work in the approved order", async () => {
  const html = await readV2("index.html");

  for (const id of ["hero", "work", "method", "workflows", "proof", "about", "resume", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }

  assert.match(html, /Open\.\s*Test\.\s*Send\.\s*Publish\.\s*Measure\./s);
  assert.match(html, /A little about me\./);

  const workOrder = [
    "data-work=\"rccv\"",
    "data-work=\"accommodation\"",
    "data-work=\"cool-runnings\"",
    "data-work=\"proposal\"",
    "data-work=\"elevators\"",
    "data-work=\"music\"",
  ].map((marker) => html.indexOf(marker));
  assert.ok(workOrder.every((position) => position >= 0), "all six selected-work objects must exist");
  assert.deepEqual([...workOrder].sort((a, b) => a - b), workOrder);

  for (const metric of ["1,900%", "600%", "$200M+", "156"]) {
    assert.ok(html.includes(metric), `missing outcome ${metric}`);
  }
});

test("all five workflow controls have unique accessible trigger and panel wiring", async () => {
  const html = await readV2("index.html");
  const triggerPattern = /<button[^>]+data-workflow-trigger="([^"]+)"[^>]+aria-expanded="(true|false)"[^>]+aria-controls="([^"]+)"[^>]*>/g;
  const triggers = [...html.matchAll(triggerPattern)];

  assert.equal(triggers.length, 5);
  assert.equal(new Set(triggers.map((match) => match[1])).size, 5);
  assert.equal(new Set(triggers.map((match) => match[3])).size, 5);
  assert.equal(triggers.filter((match) => match[2] === "true").length, 1);

  const triggerIds = triggers.map((match) => match[0].match(/\bid="([^"]+)"/)?.[1]);
  assert.ok(triggerIds.every(Boolean), "every workflow trigger needs an id");
  assert.equal(new Set(triggerIds).size, 5, "workflow trigger ids must be unique");

  for (const [index, [, key, , panelId]] of triggers.entries()) {
    assert.match(html, new RegExp(`<[^>]+id="${panelId}"[^>]+data-workflow-panel="${key}"[^>]+aria-labelledby="${triggerIds[index]}"`));
  }

  assert.match(html, /href="workflows\/presentation-publishing\.html"/);
});

test("boutique accommodation exposes the real 69-frame sequence to wheel and keyboard input", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);

  assert.match(html, /data-accommodation-viewer[^>]+data-frame-sequences="overview:17,treehouse:28,cabin:24"[^>]+tabindex="0"/);
  assert.match(html, /data-accommodation-frame/);
  assert.match(html, /data-accommodation-status[^>]+aria-live="polite"/);
  assert.match(html, /aria-describedby="accommodation-instructions"/);
  assert.match(html, /id="accommodation-instructions"/);

  assert.match(app, /data-accommodation-viewer/);
  assert.match(app, /frameSequences/);
  assert.match(app, /addEventListener\(["']wheel["']/);
  assert.match(app, /passive:\s*false/);
  assert.match(app, /preventDefault\(\)/);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]) {
    assert.ok(app.includes(key), `missing accommodation keyboard support for ${key}`);
  }
});

test("V2 CSS includes the approved tokens, responsive accordion, and overflow and motion safeguards", async () => {
  const css = await readV2("styles.css");

  for (const token of [
    "#F7F6F2", "#FFFFFF", "#1B1D1A", "#676A64", "#D9DAD3",
    "#3F66E8", "#557A5B", "#E98D63", "#1F2322",
    "#E7ECFA", "#E5EEE7", "#F6E8DF", "#F2EBCF", "#EBE7F3",
  ]) {
    assert.ok(css.includes(token), `missing approved colour ${token}`);
  }

  assert.match(css, /font-family:\s*["']DM Sans["']/);
  assert.match(css, /font-family:\s*["']Fraunces["']/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /@media\s*\(min-width:\s*1100px\)/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.match(css, /@media\s*\(max-width:\s*479px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /cubic-bezier\(\.22,\s*1,\s*\.36,\s*1\)/);
  assert.match(css, /max-width:\s*100%/);
});

test("every referenced V2 asset resolves to tracked media on disk", async () => {
  const html = await readV2("index.html");
  const assetReferences = [...html.matchAll(/(?:src|poster|href)="(\.\.\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1]);

  assert.ok(assetReferences.length >= 15, "expected V2 to reuse the existing media library");
  await Promise.all(assetReferences.map((reference) => access(new URL(reference, fileUrl("index.html")))));
});

test("V2 interactions use keyboard handling and one-time observation without scroll listeners", async () => {
  const app = await readV2("app.js");

  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.unobserve\(/);
  assert.match(app, /addEventListener\(["']keydown["']/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    assert.ok(app.includes(key), `missing keyboard support for ${JSON.stringify(key)}`);
  }
  assert.doesNotMatch(app, /addEventListener\(["']scroll["']/);
});
