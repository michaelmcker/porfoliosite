import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const repoUrl = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, repoUrl), "utf8");

test("Boutique embeds the copied three-scene Okanagan hero experience", async () => {
  const [homepage, preview, styles, app] = await Promise.all([
    read("v2/index.html"),
    read("v2/okanagan-preview/index.html"),
    read("v2/okanagan-preview/styles.css"),
    read("v2/okanagan-preview/app.js"),
  ]);

  assert.match(homepage, /<iframe[^>]+data-accommodation-page[^>]+src="okanagan-preview\/index\.html"/);
  assert.doesNotMatch(homepage, /data-accommodation-clip|overview-scroll\.(?:mp4|webm)|treehouse-scroll\.(?:mp4|webm)|cabin-scroll\.(?:mp4|webm)/);
  assert.equal((preview.match(/data-okanagan-scene=/g) || []).length, 3);
  const order = ["overview", "treehouse", "cabin"].map((scene) => preview.indexOf(`data-okanagan-scene="${scene}"`));
  assert.ok(order.every((position) => position >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);

  for (const copy of ["Nature.", "Adventure.", "Stillness.", "The Treehouse", "The Cabin"]) {
    assert.ok(preview.includes(copy), `missing copied hero copy: ${copy}`);
  }
  assert.match(preview, /<button[^>]+aria-expanded="false"[^>]+data-stays-trigger/);
  assert.match(preview, /class="nav-mega"/);
  assert.match(styles, /\.okanagan-scene\s*\{[^}]*height:\s*300svh/s);
  assert.match(styles, /\.okanagan-hero\s*\{[^}]*position:\s*sticky[^}]*height:\s*100svh/s);
  assert.match(app, /preventDefault\(\)/);
  assert.match(app, /data-stays-trigger/);
  assert.match(app, /currentTime/);
  assert.match(app, /data-okanagan-scene/);
});

test("Okanagan preview mirrors the deployed navigation and public hero copy", async () => {
  const preview = await read("v2/okanagan-preview/index.html");

  const navigation = [
    "Stays",
    "Things to Do",
    "Gallery",
    "Reviews",
    "About",
    "FAQ",
    "Blog",
    "Book your stay",
  ];
  const positions = navigation.map((label) => preview.indexOf(`>${label}<`));
  assert.ok(positions.every((position) => position >= 0), "a deployed navigation label is missing");
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "deployed navigation order changed");

  assert.match(preview, /site-logo__mark-img site-logo__mark-img--light[^>]+logo-white\.webp/);
  assert.match(preview, /site-logo__mark-img site-logo__mark-img--dark[^>]+logo-green\.webp/);
  assert.match(preview, /class="nav-mega__media"/);
  assert.match(preview, /class="nav-mega__body"/);
  assert.match(preview, /class="nav-mega__heading"/);
  assert.match(preview, /class="nav-mega__price">From \$300/);
  assert.match(preview, /class="nav-mega__price">From \$275/);
  assert.match(preview, /Up to 6 guests/);
  assert.match(preview, /Up to 4 guests/);
  assert.match(preview, />4\.96<\/span>/);
  assert.match(preview, />4\.68<\/span>/);

  const sourceCopy = [
    "Two boutique Okanagan stays: a treetop escape and a cozy handcrafted cabin close to farms, lakes, trails, theatre, cider, and quiet country views.",
    "Built 16 feet above the ground between Douglas fir trees, this elevated forest stay has a hanging bridge, roof deck, outdoor kitchen, climbing wall, safety nets, and quiet views across the property.",
    "A warm handcrafted cabin on five private acres with a king loft, bunk room, hide-a-bed, full kitchen, bathtub, Wi-Fi, Netflix TV, and shared hot tub and sauna access by appointment.",
  ];
  sourceCopy.forEach((copy) => assert.ok(preview.includes(copy), `missing deployed copy: ${copy}`));
  assert.equal((preview.match(/class="trust-strip"/g) || []).length, 3, "each deployed hero needs its proof strip");
});

test("copied Okanagan hero movies are local, compressed, and seekable", async () => {
  for (const filename of ["overview-loop.mp4", "overview-transition.mp4", "treehouse-hero.mp4", "cabin-hero.mp4"]) {
    const url = new URL(`v2/okanagan-preview/assets/${filename}`, repoUrl);
    await access(url);
    const details = await stat(url);
    assert.ok(details.size > 100_000, `${filename} is unexpectedly empty`);
    assert.ok(details.size < 5_000_000, `${filename} is not compressed enough: ${details.size} bytes`);
  }
});

test("Selected Work sections share one height and Cool completes at text centre", async () => {
  const [css, app] = await Promise.all([read("v2/styles.css"), read("v2/app.js")]);

  assert.match(css, /--work-section-height:\s*clamp\(/);
  assert.match(css, /\.work-object\s*\{[^}]*height:\s*var\(--work-section-height\)[^}]*min-height:\s*var\(--work-section-height\)/s);
  assert.doesNotMatch(css, /\.work-object-(?:accommodation|cool|elevators)\s*\{[^}]*min-height:/s);
  assert.match(app, /const centredTop\s*=\s*\(window\.innerHeight\s*-\s*section\.offsetHeight\)\s*\/\s*2/);
  assert.match(app, /revealKey\s*===\s*"cool-runnings"[\s\S]*?centredProgress/s);
});
