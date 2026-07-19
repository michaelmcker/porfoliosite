import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

test("Hero and Selected Work stay white and use a contained navbar-aligned divider", async () => {
  const css = await read("v2/styles.css");

  assert.doesNotMatch(css, /--selected-work-canvas:/i);
  assert.match(css, /\.hero\s*\{[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.selected-work\s*\{[^}]*position:\s*relative[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.selected-work::before\s*\{[^}]*width:\s*min\(calc\(100%\s*-\s*\(2\s*\*\s*var\(--gutter\)\)\),\s*var\(--page-width\)\)[^}]*border-top:\s*1px\s+solid\s+var\(--line\)/s);
  assert.match(css, /\.work-object\s*\{[^}]*background:\s*transparent/s);
});

test("Boutique cue reserves space and the embedded desktop navigation survives its real frame width", async () => {
  const [homepage, css, previewCss] = await Promise.all([
    read("v2/index.html"),
    read("v2/styles.css"),
    read("v2/okanagan-preview/styles.css"),
  ]);

  assert.match(homepage, /data-accommodation-url>okanagantreehouse\.ca</);
  assert.match(css, /\.accommodation-showcase\s*\{[^}]*display:\s*grid[^}]*grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.accommodation-scroll-cue\s*\{[^}]*position:\s*relative[^}]*justify-self:\s*end/s);
  assert.doesNotMatch(css, /\.accommodation-scroll-cue\s*\{[^}]*position:\s*absolute/s);
  assert.match(previewCss, /@media\s*\(max-width:\s*560px\)/);
  assert.doesNotMatch(previewCss, /@media\s*\(max-width:\s*720px\)/);
});

test("Okanagan scene changes update the visible portfolio URL without navigation", async () => {
  const [parentApp, previewApp] = await Promise.all([
    read("v2/app.js"),
    read("v2/okanagan-preview/app.js"),
  ]);

  assert.match(previewApp, /type:\s*["']okanagan-scene-change["']/);
  assert.match(previewApp, /scene:\s*activeScene/);
  assert.match(parentApp, /data-accommodation-url/);
  assert.match(parentApp, /okanagantreehouse\.ca\/treehouse/);
  assert.match(parentApp, /okanagantreehouse\.ca\/cabin/);
  assert.match(parentApp, /event\.source\s*!==\s*accommodationPage\.contentWindow/);
});

test("Okanagan source movies stay compressed enough for nested file playback", async () => {
  for (const filename of ["overview-loop.mp4", "overview-transition.mp4", "treehouse-hero.mp4", "cabin-hero.mp4"]) {
    const details = await stat(new URL(`v2/okanagan-preview/assets/${filename}`, repoUrl));
    assert.ok(details.size < 2_800_000, `${filename} is still too heavy: ${details.size} bytes`);
  }
});

test("Cool Runnings uses a larger, quieter reveal", async () => {
  const css = await read("v2/styles.css");

  assert.match(css, /\.cool-laptop\s*\{[^}]*width:\s*min\(132%,\s*1180px\)/s);
  assert.match(css, /translate3d\(calc\(42px\s*\*/s);
  assert.match(css, /scale\(calc\(\.86\s*\+\s*\(\.14\s*\*/s);
  assert.match(css, /rotateX\(calc\(28deg\s*\*/s);
});

test("mobile About retains a sticky animation and the finale uses a visible elliptical orbit", async () => {
  const [css, finale] = await Promise.all([
    read("v2/styles.css"),
    read("v2/contact-finale.js"),
  ]);

  const mobile = css.match(/@media \(max-width: 760px\) \{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(mobile, /\.about-scroll-story\s*\{[^}]*min-height:\s*240svh/s);
  assert.match(mobile, /\.about-story-sticky\s*\{[^}]*position:\s*sticky[^}]*min-height:\s*100svh/s);
  assert.doesNotMatch(mobile, /\.about-questionable-focus\s*\{[^}]*display:\s*none/s);
  assert.match(mobile, /\.about-process-line\s*\{[^}]*display:\s*block/s);
  assert.match(finale, /const radiusX\s*=\s*width\s*<\s*640/);
  assert.match(finale, /const radiusY\s*=\s*width\s*<\s*640/);
  assert.match(finale, /width\s*\*\s*\.46\s*\*\s*\(1\s*-\s*n\)/);
  assert.match(finale, /height\s*\*\s*\.42\s*\*\s*\(1\s*-\s*n\)/);
  assert.match(finale, /Math\.cos\(angle\)\s*\*\s*radiusX/);
  assert.match(finale, /Math\.sin\(angle\)\s*\*\s*radiusY/);
});
