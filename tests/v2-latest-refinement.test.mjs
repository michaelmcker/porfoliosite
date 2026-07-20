import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

test("Cool Runnings shows the client-reported sales result and the live measurement loop", async () => {
  const [homepage, caseStudy] = await Promise.all([
    read("v2/index.html"),
    read("v2/work/local-search-magnet.html"),
  ]);

  assert.match(homepage, /30% (?:increase|growth) in sales/i);
  assert.match(caseStudy, /30% (?:increase|growth) in sales/i);
  assert.match(caseStudy, /client-reported/i);
  assert.match(caseStudy, /Search Console/i);
  assert.match(caseStudy, /Google Analytics|GA4/i);
  assert.match(caseStudy, /DataForSEO|ranking quer/i);
  assert.match(caseStudy, /refresh|updates? (?:daily|live)/i);
});

test("desktop workflow panels do not keep a hidden oversized canvas during transitions", async () => {
  const css = await read("v2/styles.css");

  assert.match(css, /\.workflow-panel\s*\{[^}]*flex:\s*0\s+0\s+0[^}]*width:\s*0[^}]*visibility:\s*hidden/s);
  assert.match(css, /\.workflow-item\.is-active \.workflow-panel\s*\{[^}]*flex:\s*1\s+1\s+auto[^}]*width:\s*auto[^}]*visibility:\s*visible/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%/s);
  assert.match(css, /\.workflow-dashboard \.workflow-panel figure\s*\{[^}]*background:\s*#e7e8e3/s);
  assert.match(css, /\.workflow-dashboard \.workflow-panel figure img\s*\{[^}]*width:\s*100%[^}]*max-height:\s*650px/s);
});

test("image-to-website workflow follows the approved research, proof, system, lint, and review sequence", async () => {
  const [homepage, detail] = await Promise.all([
    read("v2/index.html"),
    read("v2/workflows/image-to-website-production.html"),
  ]);

  for (const phrase of [
    /competitors and best-in-class/i,
    /generate(?:d)? (?:prospective )?(?:site )?imag/i,
    /HTML (?:web )?page/i,
    /DESIGN\.md/i,
    /HTML style guide/i,
    /lint/i,
    /human (?:design )?review/i,
    /publish/i,
  ]) {
    assert.match(`${homepage}\n${detail}`, phrase);
  }
  assert.match(homepage, /assets\/workflows\/image-to-website-desktop\.png/);
  assert.match(homepage, /assets\/workflows\/image-to-website-mobile\.png/);
});

test("finale releases objects individually as they reach the centre", async () => {
  const finale = await read("v2/contact-finale.js");

  assert.match(finale, /const releasedItems = new Set\(\)/);
  assert.match(finale, /function releaseItemToPhysics/);
  assert.match(finale, /pose\.stream\s*>=\s*releaseThreshold/);
  assert.doesNotMatch(finale, /visibleItems\(\)\.map\(\(item\)\s*=>/);
  assert.match(finale, /engine\.gravity\.scale\s*=\s*\.0017/);
});

test("Okanagan preview uses the deployed serif navigation and display typography", async () => {
  const css = await read("v2/okanagan-preview/styles.css");

  assert.match(css, /font-family:\s*"Cormorant Garamond",\s*Georgia,\s*serif/);
  assert.match(css, /\.site-nav__links > a,\s*\.nav-dropdown__trigger\s*\{[^}]*font-size:\s*clamp\(14px,/s);
  assert.match(css, /\.hero-copy h1\s*\{[^}]*font-family:\s*"Inter",\s*"DM Sans"/s);
});
