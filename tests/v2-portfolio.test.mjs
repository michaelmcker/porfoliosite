import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const v2Url = new URL("../v2/", import.meta.url);
const fileUrl = (name) => new URL(name, v2Url);
const workflowRoutes = [
  "content-production.html",
  "agency-management-dashboard.html",
  "presentation-publishing.html",
  "local-prospecting-enrichment.html",
  "image-to-website-production.html",
];

async function readV2(name) {
  return readFile(fileUrl(name), "utf8");
}

async function readWorkflow(name) {
  return readV2(`workflows/${name}`);
}

test("V2 keeps Selected Work white with a contained divider except the black music interlude", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.doesNotMatch(html, /data-project-environment=/);
  for (const removedBackground of ["cool-runnings-garden-v3.png", "rccv-pews-real.webp", "boutique-okanagan-v3.png", "proposal-new-york-v3.png", "elevator-lobby-v2.png"]) {
    assert.ok(!css.includes(removedBackground), `${removedBackground} should not remain on a project stage`);
  }
  assert.match(css, /--accent:\s*#E3A916/i);
  assert.doesNotMatch(css, /--selected-work-canvas:/i);
  assert.match(css, /\.selected-work\s*\{[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.selected-work::before\s*\{[^}]*border-top:\s*1px\s+solid\s+var\(--line\)/s);
  assert.match(css, /\.work-object\s*\{[^}]*background:\s*transparent/s);
  assert.doesNotMatch(css, /--work-accommodation|--work-proposal|--content-vivid|--about-hard/);
  assert.match(css, /\.screen-bezel/);
  assert.match(css, /font-family:\s*var\(--font-editorial\)/);
});

test("accordion stages selection and About bridges section-wide pointer input", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);

  assert.match(html, /data-about-stage/);
  assert.doesNotMatch(html, /data-about-breakout/);
  assert.doesNotMatch(html, /class="about-curly-arrow"/);
  assert.match(html, /src="portrait\/embed\.html"/);
  assert.match(app, /portfolio-portrait-pointer/);
  assert.match(app, /data-workflow-transitioning/);
  assert.match(app, /requestAnimationFrame/);
  assert.match(html, /data-about-questionable-inline>Even when the practical value is questionable<\/span>, <span class="about-value-inline">there is value in the process\.<\/span>/);
  assert.match(html, /data-about-questionable-focus[^>]*aria-hidden="true"[^>]*>Even when the practical value is questionable<\/span>/);
  assert.match(html, /data-about-scroll-story/);
  assert.match(html, /class="about-process-line"/);
  assert.match(html, /There is value in the process\./);
  assert.match(app, /--about-progress/);
});

test("all five V2 workflow routes share the detailed public-safe contract", async () => {
  for (const route of workflowRoutes) {
    const html = await readWorkflow(route);
    assert.match(html, /workflow-detail\.css/);
    assert.match(html, /data-workflow-purpose/);
    assert.match(html, /id="why-it-exists"/);
    assert.match(html, /id="how-it-works"/);
    assert.match(html, /id="tools-and-sources"/);
    assert.match(html, /id="what-ships"/);
    assert.match(html, /id="human-review"/);
    assert.match(html, /id="proof-and-constraints"/);
    assert.match(html, /id="related-work"/);
    assert.doesNotMatch(html, /class="eyebrow"/);
    assert.ok((html.match(/class="workflow-step"/g) || []).length >= 5, `${route} needs at least five steps`);
  }
});

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

  assert.match(html, /Understand\.\s*Shape\.\s*Build\.\s*Measure\.\s*Refine\.\s*Systematise\./s);
  assert.match(html, /<h2 id="method-title">Bias to build\.<\/h2>/);
  assert.doesNotMatch(html, /class="bias-step"><span>/);
  assert.doesNotMatch(html, /class="bias-flow"/);
  assert.match(html, /class="bias-route"/);
  assert.doesNotMatch(html, /class="eyebrow"/);
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

test("V2 restores the existing hero film as a raised card and keeps the authored portrait frame", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  assert.match(html, /class="hero-system-media screen-bezel"/);
  assert.match(html, /<video[^>]+id="motion-video-hero"[^>]+data-motion-video/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-desktop-1080p\.mp4"/);
  assert.match(html, /data-src="\.\.\/assets\/videos\/portfolio-hero-system-map-mobile-1080p\.mp4"/);
  assert.doesNotMatch(html, /class="system-trace"/);
  assert.match(html, /<div class="portrait-frame">[\s\S]*?<iframe[^>]+src="portrait\/embed\.html"/s);
  assert.match(css, /\.portrait-frame\s*\{[^}]*aspect-ratio:\s*1023\s*\/\s*1537[^}]*border:\s*7px solid #725a3d/s);
  assert.match(html, /<section class="hero page-frame" id="hero"/);
  assert.match(html, /I build websites, product stories, sales material, and AI-enabled marketing systems that help teams explain, sell, and scale\.<span class="hero-fun"><em>And sometimes, stuff just for fun\.<\/em><\/span>/);
  assert.doesNotMatch(html, /hero-motion-toggle/);
  assert.match(css, /\.hero\s*\{[^}]*grid-template-columns:\s*minmax\(350px,\s*\.62fr\)\s*minmax\(0,\s*1\.38fr\)/s);
  assert.match(css, /\.hero-system-media\s*\{[^}]*width:\s*min\(100%,\s*980px\)[^}]*aspect-ratio:\s*4\s*\/\s*3[^}]*border-width:\s*clamp\(6px,\s*\.7vw,\s*10px\)/s);
  assert.match(css, /\.hero-video-source\s*\{[^}]*width:\s*133\.333%[^}]*transform:\s*translateX\(-25%\)/s);
  assert.match(css, /\.hero-system-media video\s*\{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*cover/s);
  assert.match(css, /\.hero-video-copy\s*\{[^}]*inset:\s*0/s);
  assert.match(css, /\.hero-video-copy\s*\{[^}]*opacity:\s*0[^}]*visibility:\s*hidden/s);
  assert.match(css, /\.hero-system-media\.is-video-playing \.hero-video-copy\s*\{[^}]*opacity:\s*1[^}]*visibility:\s*visible/s);
  assert.match(css, /@media \(max-width:\s*699px\)[\s\S]*?\.hero-system-media\s*\{[^}]*aspect-ratio:\s*9\s*\/\s*16/s);
  assert.match(app, /addEventListener\(["']playing["']/);
  assert.match(app, /addEventListener\(["']waiting["']/);
  assert.match(app, /classList\.toggle\(["']is-video-playing["']/);
  assert.match(app, /portrait-frame[\s\S]*?classList\.add\(["']is-loaded["']\)/);
});

test("selected work gives properly scaled laptop and browser objects more room than the copy", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(css, /--page-width:\s*1380px/);
  assert.match(css, /\.work-object\s*\{[^}]*grid-template-columns:\s*minmax\(300px,\s*\.78fr\)\s*minmax\(520px,\s*1\.22fr\)/s);
  assert.match(css, /\.work-object-accommodation,[\s\S]*?grid-template-columns:\s*minmax\(520px,\s*1\.25fr\)\s*minmax\(300px,\s*\.75fr\)/s);
  assert.match(css, /\.work-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)[^}]*font-size:\s*var\(--type-h3\)/s);
  assert.match(css, /\.laptop-object\s*\{[^}]*width:\s*min\(112%,\s*980px\)/s);
  assert.match(html, /<h3>Bringing a community site to life\.<\/h3>/);
  assert.match(html, /Explore the interactive Stations of the Cross/);
  assert.match(html, /<figure class="laptop-object">/);
  assert.match(css, /\.laptop-object\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.laptop-object video\s*\{[^}]*mask-image:\s*url\("\.\.\/assets\/device-mockups\/laptop-three-quarter-rccv-cutout\.webp"\)/s);
  await access(new URL("../assets/device-mockups/laptop-three-quarter-rccv-cutout.webp", v2Url));
  assert.match(css, /\.browser-object\s*\{[^}]*width:\s*100%/s);
  assert.match(html, /class="cool-laptop"[^>]*data-scroll-reveal="cool-runnings"/);
  assert.match(html, /class="cool-laptop-screen"/);
  assert.doesNotMatch(html, /class="cool-laptop-(?:lid|base)"/);
  assert.equal((html.match(/laptop-graphite-frame\.png/g) || []).length, 1);
  assert.match(css, /\.cool-laptop\s*\{[^}]*width:\s*min\(132%,\s*1180px\)/s);
});

test("project labels and the accommodation cue are specific and keep a wide black scrollable browser", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  assert.match(html, /class="accommodation-showcase"[\s\S]*?data-accommodation-viewer/s);
  assert.match(html, /class="accommodation-scroll-cue"[\s\S]*?<svg[\s\S]*?Scroll the preview/s);
  assert.doesNotMatch(html, /accommodation-status|accommodation-controls|data-accommodation-(?:previous|next)/);
  assert.match(html, /<p class="work-meta">Website \+ SEO<\/p>/);
  assert.match(html, /<p class="work-meta">Sales enablement · GTM engineering<\/p>/);
  assert.match(html, /<h3>Elevating a boutique accommodation site\.<\/h3>\s*<p class="work-meta">Boutique accommodation · Web development<\/p>/);
  assert.match(html, /<h3>From no web presence to a lead magnet\.<\/h3>\s*<p class="work-meta">Website \+ SEO<\/p>/);
  assert.match(css, /\.work-copy\s*\{[^}]*background:\s*transparent[^}]*box-shadow:\s*none/s);
  assert.doesNotMatch(app, /requestedProjectStage/);
  assert.match(css, /\.screen-bezel\s*\{[^}]*border:[^}]*solid #101312[^}]*box-shadow:/s);
  assert.match(css, /\.browser-object-tall \.browser-viewport\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*10/s);
  assert.match(css, /\.accommodation-showcase\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.accommodation-showcase\s*\{[^}]*display:\s*grid[^}]*grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.accommodation-scroll-cue\s*\{[^}]*position:\s*relative[^}]*justify-self:\s*end/s);
});

test("accordion uses wider layered spines, overlaps them tightly, and hides the active desktop tab", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.doesNotMatch(html, /workflow-number/);
  assert.match(css, /\.workflow-item\s*\{[^}]*flex:\s*0\s+0\s+64px[^}]*margin-left:\s*-24px/s);
  assert.match(css, /\.workflow-item\.is-active\s*\{[^}]*flex-basis:\s*calc\(100%\s*-\s*160px\)[^}]*flex-grow:\s*0/s);
  assert.match(css, /\.workflow-item\.is-active \.workflow-trigger\s*\{[^}]*width:\s*0[^}]*opacity:\s*0[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.workflow-trigger\s*\{[^}]*box-shadow:\s*inset/s);
  assert.match(css, /\.workflow-accordion\s*\{[^}]*min-height:\s*880px/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*min-height:\s*880px/s);
  assert.match(css, /\.workflow-panel figure img\s*\{[^}]*max-height:\s*650px/s);
});

test("About holds a sticky scroll story before releasing into the rest of the page", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(html, /data-about-scroll-story[\s\S]*?class="about-story-sticky"/s);
  assert.match(css, /\.about-scroll-story\s*\{[^}]*min-height:\s*280svh/s);
  assert.match(css, /\.about-story-sticky\s*\{[^}]*position:\s*sticky[^}]*min-height:\s*100svh/s);
  assert.match(html, /class="about-context"/);
  assert.match(css, /\.about-context[\s\S]*?opacity:\s*calc\(1\s*-\s*var\(--about-focus,\s*0\)\)/s);
  assert.match(css, /\.about\.is-about-focused \.about-questionable-focus\s*\{[^}]*font-size:\s*clamp\([^;]*var\(--about-growth/s);
  assert.doesNotMatch(css, /\.about-questionable-focus\s*\{[^}]*scale\(/s);
  assert.match(css, /\.portrait-frame\s*\{[^}]*border-radius:\s*48%\s+48%\s+12px\s+12px\s*\/\s*13%\s+13%\s+12px\s+12px/s);
  assert.match(css, /\.about-process-line path\s*\{[^}]*stroke-dasharray:/s);
  assert.match(css, /\.contact-story\s*\{[^}]*background:\s*var\(--accent\)/s);
  assert.match(css, /\.contact-morph\s*\{[^}]*color:\s*#1f1909/s);
});

test("About uses one parent-owned pointer space and keeps its final composition capped", async () => {
  const [html, css, app, portrait] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("app.js"),
    readV2("portrait/embed.html"),
  ]);

  assert.match(html, /class="about-story-sticky"[^>]*data-about-pointer-stage/);
  assert.match(app, /data-about-pointer-stage/);
  assert.match(app, /getBoundingClientRect\(\)/);
  assert.match(app, /portfolio-portrait-pointer/);
  assert.match(css, /\.portrait-frame iframe\s*\{[^}]*pointer-events:\s*none/s);
  assert.doesNotMatch(portrait, /cursor:\s*crosshair/);
  assert.doesNotMatch(portrait, /stage\.addEventListener\(["']pointer(?:move|down)["']/);
  assert.match(portrait, /window\.addEventListener\(["']message["']/);
  assert.match(css, /\.about-questionable-focus\s*\{[^}]*position:\s*absolute/s);
  assert.match(css, /\.about\.is-about-focused \.about-questionable-focus\s*\{[^}]*3\.2rem/s);
  assert.match(app, /data-about-questionable-inline/);
  assert.match(app, /data-about-questionable-focus/);
  assert.match(app, /--about-phrase-x/);
  assert.match(app, /--about-phrase-y/);
  assert.match(app, /--about-phrase-size/);
  assert.match(app, /--about-phrase-weight/);
  assert.match(css, /\.about-process-value\s*\{[^}]*2\.2rem/s);
});

test("contact finale triggers once in view and preserves dynamic drag physics", async () => {
  const [html, css, finale] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("contact-finale.js"),
  ]);

  assert.match(html, /class="contact-story"[^>]*data-contact-story/);
  assert.match(html, /data-finale-state="static"/);
  assert.match(html, /class="contact-stage"[^>]*data-contact-stage/);
  assert.equal((html.match(/data-contact-object=/g) || []).length, 11);
  assert.match(html, /data-contact-portrait-body/);
  assert.match(html, /data-contact-portrait-head/);
  assert.match(html, /riverflow-registered\/pose-r06-c03\.webp/);
  assert.match(html, /data-contact-morph-before[^>]*>Systematise\.<\/span>/);
  assert.match(html, /data-contact-morph-after[^>]*>Let’s build something useful\.<\/span>/);
  assert.match(html, /<script src="contact-finale\.js" defer><\/script>/);
  assert.doesNotMatch(html, /https?:\/\/[^"']*matter/i);
  assert.match(finale, /vendor\/matter\.min\.js/);
  assert.match(finale, /function loadMatterRuntime/);
  assert.match(finale, /IntersectionObserver/);
  assert.match(finale, /function spiralPose/);
  assert.match(finale, /function buildArcLengthLookup/);
  assert.match(finale, /function releaseToPhysics/);
  assert.match(finale, /function markSettled/);
  assert.match(finale, /function updateCopyContrast/);
  assert.match(finale, /const entranceDuration = 4800/);
  assert.match(finale, /const spiralTurns = 2/);
  assert.match(finale, /const centreScale = \.7/);
  assert.match(finale, /function lockViewport/);
  assert.match(finale, /function unlockViewport/);
  assert.match(finale, /dataset\.viewportLocked/);
  assert.match(finale, /const releaseSpan = Math\.min\(width \* \(width < 640 \? \.56 : \.36\), width < 640 \? 220 : 520\)/);
  assert.match(finale, /dataset\.poseScale/);
  assert.match(finale, /dataset\.poseProgress/);
  assert.match(finale, /plugin\.renderScale/);
  assert.match(finale, /scale\(\$\{body\.plugin\.renderScale\}\)/);
  assert.doesNotMatch(finale, /function roundedOrbitPose/);
  assert.match(finale, /threshold:\s*\.12/);
  assert.match(finale, /function startEntrance/);
  assert.match(finale, /requestAnimationFrame\(stepEntrance\)/);
  assert.match(finale, /Constraint\.create/);
  assert.match(finale, /pointB:/);
  assert.match(finale, /Composite\.remove\(engine\.world, dragConstraint\)/);
  assert.doesNotMatch(finale, /updateFromScroll|requestScrollUpdate/);
  assert.doesNotMatch(finale, /Body\.setStatic\(dragged, true\)/);
  assert.doesNotMatch(finale, /plugin\.pinned/);
  assert.match(finale, /dataset\.finaleState/);
  assert.match(finale, /dataset\.copyState/);
  assert.match(finale, /dataset\.entranceProgress/);
  assert.match(css, /data-copy-state="visible"/);
  assert.match(css, /is-contrast-light/);
  assert.doesNotMatch(css, /\.contact-story\.has-finale-js\s*\{[^}]*min-height:\s*340svh/s);
  assert.doesNotMatch(css, /\.contact-story\.has-finale-js\s*\{[^}]*min-height:\s*(?:[2-9]\d{2}|[1-9]\d{3,})svh/s);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*?\.contact-object/s);
  await access(fileUrl("vendor/matter.min.js"));
});

test("all five workflow controls have unique accessible trigger and panel wiring", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);
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
    const panelTag = html.match(new RegExp(`<[^>]+id="${panelId}"[^>]+data-workflow-panel="${key}"[^>]+aria-labelledby="${triggerIds[index]}"[^>]*>`))?.[0];
    assert.ok(panelTag, `missing labelled panel for ${key}`);
    if (key === "content") {
      assert.match(panelTag, /aria-hidden="false"/);
      assert.doesNotMatch(panelTag, /\sinert(?:\s|>|=)/);
    } else {
      assert.match(panelTag, /aria-hidden="true"/);
      assert.match(panelTag, /\sinert(?:\s|>|=)/);
    }
  }

  assert.match(app, /toggleAttribute\(["']inert["']/);
  assert.match(app, /setAttribute\(["']aria-hidden["']/);
  assert.match(html, /href="workflows\/presentation-publishing\.html"/);
});

test("boutique accommodation embeds the copied semantic three-scene Okanagan story", async () => {
  const [html, css, preview, previewCss, previewApp] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("okanagan-preview/index.html"),
    readV2("okanagan-preview/styles.css"),
    readV2("okanagan-preview/app.js"),
  ]);

  assert.match(html, /<iframe[^>]+data-accommodation-page[^>]+src="okanagan-preview\/index\.html"/);
  assert.doesNotMatch(html, /data-accommodation-clip|overview-scroll\.(?:mp4|webm)|treehouse-scroll\.(?:mp4|webm)|cabin-scroll\.(?:mp4|webm)/);
  assert.equal((preview.match(/data-okanagan-scene=/g) || []).length, 3);
  const sceneOrder = ["overview", "treehouse", "cabin"].map((scene) => preview.indexOf(`data-okanagan-scene="${scene}"`));
  assert.ok(sceneOrder.every((position) => position >= 0));
  assert.deepEqual([...sceneOrder].sort((left, right) => left - right), sceneOrder);

  for (const movie of ["overview-loop.mp4", "overview-transition.mp4", "treehouse-hero.mp4", "cabin-hero.mp4"]) {
    assert.match(preview, new RegExp(`assets/${movie.replace(".", "\\.")}`));
    await access(new URL(`okanagan-preview/assets/${movie}`, v2Url));
  }
  for (const copy of ["Nature.", "Adventure.", "Stillness.", "The Treehouse", "The Cabin"]) {
    assert.ok(preview.includes(copy), `missing semantic Okanagan copy: ${copy}`);
  }
  assert.match(preview, /<button[^>]+aria-expanded="false"[^>]+data-stays-trigger/);
  assert.match(preview, /class="nav-mega"/);
  assert.match(previewCss, /\.okanagan-scene\s*\{[^}]*height:\s*300svh/s);
  assert.match(previewCss, /\.okanagan-hero\s*\{[^}]*position:\s*sticky[^}]*height:\s*100svh/s);
  assert.match(previewApp, /preventDefault\(\)/);
  assert.match(previewApp, /currentTime/);
  assert.match(css, /\.accommodation-viewport iframe\s*\{[^}]*width:\s*100%[^}]*height:\s*100%/s);
  assert.match(css, /\.accommodation-showcase\s*\{[^}]*translate3d\(calc\(72px/s);
  assert.match(css, /rotateY\(calc\(12deg/s);
});

test("V2 refinement keeps text and motion responsive", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(html, /class="hero-fun"><em>And sometimes, stuff just for fun\.<\/em><\/span>/);
  assert.match(html, /class="bias-route/);
  assert.equal((html.match(/class="bias-step-arrow/g) || []).length, 0);
  assert.match(css, /translate3d\(calc\(36px\s*\*\s*\(1\s*-\s*var\(--object-reveal/);
  assert.match(css, /\.about-questionable\s*\{[^}]*color:\s*inherit[^}]*font-family:\s*inherit/s);
  assert.match(css, /\.about-questionable-focus\s*\{[^}]*width:\s*min\(650px,\s*calc\(100%\s*-\s*var\(--about-phrase-x/s);
  assert.doesNotMatch(css, /\.experience-ledger(?: article)?\s*\{[^}]*border-/s);
});

test("V2 includes an isolated local-search case study", async () => {
  const [html, script] = await Promise.all([
    readV2("work/local-search-magnet.html"),
    readV2("work/local-search-magnet.js"),
  ]);

  assert.match(html, /local-search-magnet\.css/);
  assert.match(html, /local-search-magnet\.js/);
  assert.match(script, /\.\.\/\.\.\/data\/cool-runnings-metrics-current\.json/);
  assert.match(html, /data-cool-metric="clicks"/);
  assert.match(html, /Human review/);
  assert.match(html, /href="\.\.\/#work"/);
});

test("large showcase videos stay lazy, autoplay once visible, and have no pause-button chrome", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);
  const videos = [...html.matchAll(/<video[^>]+data-motion-video[^>]*>[\s\S]*?<\/video>/g)].map((match) => match[0]);
  const controls = [...html.matchAll(/<button[^>]+data-motion-toggle[^>]*>/g)].map((match) => match[0]);

  assert.equal(videos.length, 3);
  assert.equal(controls.length, 0);
  for (const video of videos) {
    assert.doesNotMatch(video, /data-motion-surface|tabindex="0"|role="button"/);
    assert.match(video, /\sautoplay(?:\s|>)/);
    assert.match(video, /preload="none"/);
    assert.doesNotMatch(video, /<source[^>]+\ssrc=/);
    assert.match(video, /<source[^>]+data-src=/);
  }
  assert.doesNotMatch(css, /\.motion-toggle\s*\{/);
  assert.match(app, /data-motion-video/);
  assert.doesNotMatch(app, /aria-pressed|toggleMotionVideo/);
  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.play\(\)/);
  assert.match(app, /\.pause\(\)/);
  assert.match(app, /canplay/);
  assert.match(app, /pointerdown/);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
});

test("selected work uses equal-height stages and centre-timed device choreography", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  for (const key of ["accommodation", "cool-runnings", "elevators"]) {
    assert.match(html, new RegExp(`data-scroll-reveal="${key}"`));
  }
  assert.doesNotMatch(html, /data-frame-scroll="accommodation"/);
  assert.match(css, /\[data-scroll-reveal\][\s\S]*?--object-reveal/s);
  assert.match(css, /\.accommodation-showcase\s*\{[^}]*rotateY\(calc\(/s);
  assert.doesNotMatch(css, /\.cool-laptop-(?:lid|base)\s*\{/s);
  assert.match(css, /\.cool-laptop\s*\{[^}]*rotateX\(calc\(/s);
  assert.match(html, /class="cool-laptop-frame"[^>]*laptop-graphite-frame\.png/s);
  assert.match(css, /\.browser-object-elevator\s*\{[^}]*rotateX\(calc\(68deg\s*\*\s*\(1\s*-\s*var\(--object-reveal,\s*0\)\)\)\)/s);
  assert.match(css, /--work-section-height:\s*clamp\(/);
  assert.match(css, /\.work-object\s*\{[^}]*height:\s*var\(--work-section-height\)[^}]*min-height:\s*var\(--work-section-height\)/s);
  assert.doesNotMatch(css, /\.work-object-(?:accommodation|cool|elevators)\s*\{[^}]*min-height:/s);
  assert.match(app, /querySelectorAll\("\[data-scroll-reveal\]"\)/);
  assert.match(app, /const centredTop\s*=\s*\(window\.innerHeight\s*-\s*section\.offsetHeight\)\s*\/\s*2/);
  assert.match(app, /revealKey\s*===\s*"cool-runnings"\s*\|\|\s*revealKey\s*===\s*"accommodation"\s*\?\s*centredProgress/s);
  assert.match(app, /revealKey\s*===\s*"elevators"[\s\S]*?rawProgress\s*\/\s*\.72/s);
  assert.match(app, /--object-reveal/);
});

test("Bias uses one light continuous route and butts against Selected Work", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.equal([...html.matchAll(/class="bias-step-arrow(?:\s|\")/g)].length, 0);
  assert.equal([...html.matchAll(/class="bias-route"/g)].length, 1);
  assert.match(css, /\.bias-step:nth-child\(4\)\s*\{[^}]*grid-column:\s*3/s);
  assert.match(css, /\.bias-step:nth-child\(5\)\s*\{[^}]*grid-column:\s*2/s);
  assert.match(css, /\.bias-step:nth-child\(6\)\s*\{[^}]*grid-column:\s*1/s);
  assert.match(css, /\.bias-route\s*\{[^}]*position:\s*absolute/s);
  assert.match(css, /\.bias-route > path\s*\{[^}]*stroke-width:\s*1\.5/s);
  assert.match(css, /\.build-bias\s*\{[^}]*margin-top:\s*0/s);
  assert.match(css, /\.selected-work\s*\{[^}]*padding-block:\s*var\(--space-section\)\s+0/s);
});

test("the proposal is an enlarged rounded PDF artifact without a surrounding frame", async () => {
  const css = await readV2("styles.css");

  assert.match(css, /\.proposal-sheet\s*\{[^}]*width:\s*min\(78%,\s*600px\)[^}]*border:\s*0/s);
  assert.match(css, /\.proposal-sheet img\s*\{[^}]*border-radius:\s*18px/s);
});

test("workflow showcase uses a neutral accordion and orders copy above dominant media", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  for (const removedColor of ["#e0a91c", "#3e8164", "#df5f38", "#4d678c", "#8f5c93"]) {
    assert.ok(!css.includes(removedColor), `workflow accordion still uses ${removedColor}`);
  }

  assert.match(css, /\.workflow-accordion\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.workflow-item\s*\{[^}]*min-width:\s*64px[^}]*color:\s*white/s);
  assert.match(css, /\.workflow-trigger\s*\{[^}]*width:\s*64px[^}]*background:\s*var\(--rail\)/s);
  assert.match(css, /\.workflow-trigger strong\s*\{[^}]*font-size:\s*1\.3rem[^}]*font-weight:\s*900/s);
  assert.match(css, /\.workflow-panel-inner\s*\{[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.workflow-panel figure\s*\{[^}]*background:\s*#e7e8e3/s);
  assert.match(css, /\.workflow-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)[^}]*font-size:\s*clamp\(2\.15rem,\s*3\.15vw,\s*3\.65rem\)/s);
  assert.match(css, /\.workflow-copy p\s*\{[^}]*font-size:\s*clamp\(\.98rem,\s*1\.15vw,\s*1\.12rem\)/s);
  assert.match(css, /\.workflow-copy-head\s*\{[^}]*justify-content:\s*space-between/s);
  assert.doesNotMatch(css, /\.workflow-panel figure\s*\{[^}]*order:\s*-1/s);

  const panels = [...html.matchAll(/<div class="workflow-panel-inner">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article>/g)];
  assert.equal(panels.length, 5);
  for (const [, panel] of panels) {
    assert.ok(panel.indexOf('class="workflow-copy"') < panel.indexOf("<figure"), "workflow copy must precede media");
  }
});

test("method, workflows, outcomes, and About form deliberate full-bleed chapters", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.match(html, /<section class="build-bias"[^>]*>\s*<div class="build-bias-inner page-frame">/s);
  assert.match(html, /<section class="about"[^>]*>[\s\S]*?<div class="about-inner page-frame">/s);
  assert.match(css, /\.build-bias\s*\{[^}]*background:\s*var\(--accent\)/s);
  assert.match(css, /\.bias-sequence\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)[^}]*row-gap:\s*clamp\(96px,\s*10vw,\s*148px\)/s);
  assert.match(css, /\.bias-step\s*\{[^}]*padding:\s*0/s);
  assert.match(css, /\.workflow-section\s*\{[^}]*background:\s*var\(--charcoal\)[^}]*color:\s*white/s);
  assert.match(css, /\.outcomes\s*\{[^}]*background:\s*var\(--surface\)/s);
  assert.match(css, /\.about\s*\{[^}]*background:\s*var\(--forest\)/s);
  assert.match(css, /\.about-inner\s*\{[^}]*display:\s*grid/s);
});

test("V2 CSS includes the revised studio tokens, responsive accordion, and motion safeguards", async () => {
  const css = await readV2("styles.css");

  for (const token of ["#ffffff", "#171813", "#E3A916", "#171a19", "#243c31"]) {
    assert.ok(css.includes(token), `missing approved colour ${token}`);
  }

  assert.match(css, /--font-sans:\s*["']DM Sans["']/);
  assert.match(css, /--font-editorial:\s*["']Fraunces["']/);
  assert.match(css, /\.workflow-copy h3\s*\{[^}]*font-family:\s*var\(--font-editorial\)/s);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(max-width:\s*470px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /cubic-bezier\(\.22,\s*1,\s*\.36,\s*1\)/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /@media\s*\(max-width:\s*1099px\)[\s\S]*?\.laptop-object\s*\{[^}]*width:\s*min\(100%,\s*900px\)/);
});

test("Hero and Selected Work share white while a contained hairline preserves the chapter break", async () => {
  const css = await readV2("styles.css");

  assert.match(css, /--canvas:\s*#ffffff/);
  assert.match(css, /--space-section:\s*clamp\(/);
  assert.match(css, /--space-heading:\s*clamp\(/);
  assert.match(css, /--type-h1:\s*clamp\(/);
  assert.match(css, /--type-h2:\s*clamp\(/);
  assert.match(css, /--type-h3:\s*clamp\(/);
  assert.match(css, /body\s*\{[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.hero\s*\{[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.selected-work\s*\{[^}]*background:\s*var\(--canvas\)/s);
  assert.match(css, /\.selected-work::before\s*\{[^}]*border-top:\s*1px\s+solid\s+var\(--line\)/s);
  assert.doesNotMatch(css, /\.work-object:first-child\s*\{[^}]*border-top:/s);
  assert.doesNotMatch(css, /\.work-object-cool\s*\{[^}]*background-image:/s);
  assert.match(css, /\.section-heading h2,[\s\S]*?font-size:\s*var\(--type-h2\)/s);
  assert.match(css, /\.work-copy h3\s*\{[^}]*font-size:\s*var\(--type-h3\)/s);
});

test("Experience is a centred chronological ledger without route markers", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);

  assert.doesNotMatch(html, /experience-ledger__route|route-dot|timeline-marker/);
  assert.match(css, /\.experience-heading\s*\{[^}]*text-align:\s*center/s);
  assert.match(css, /\.experience-ledger article\s*\{[^}]*grid-template-columns:\s*1fr[^}]*justify-items:\s*center[^}]*text-align:\s*center/s);
  assert.match(css, /\.experience-actions\s*\{[^}]*justify-content:\s*center/s);
});

test("every referenced V2 asset resolves to tracked media on disk", async () => {
  const html = await readV2("index.html");
  const assetReferences = [...html.matchAll(/(?:src|data-src|poster|href)="(\.\.\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1]);

  assert.ok(assetReferences.length >= 15, "expected V2 to reuse the existing media library");
  await Promise.all(assetReferences.map((reference) => access(new URL(reference, fileUrl("index.html")))));
});

test("V2 interactions use keyboard handling, observers, and rAF-throttled scroll expansion", async () => {
  const app = await readV2("app.js");

  assert.match(app, /IntersectionObserver/);
  assert.match(app, /\.unobserve\(/);
  assert.match(app, /addEventListener\(["']keydown["']/);
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    assert.ok(app.includes(key), `missing keyboard support for ${JSON.stringify(key)}`);
  }
  assert.match(app, /addEventListener\(["']scroll["'][\s\S]*?requestAnimationFrame/s);
  assert.match(app, /passive:\s*true/);
});

test("browser QA covers runtime focus, motion, inputs, all workflow routes, and target widths", async () => {
  const qa = await readFile(new URL("../scripts/qa-v2.mjs", import.meta.url), "utf8");
  for (const marker of [
    "puppeteer-core", "inert", "aria-hidden", "ArrowDown", "data-accommodation-page", "data-okanagan-scene",
    "overviewMiddle", "treehouseMiddle", "cabinMiddle", "accommodationReverse", "prefers-reduced-motion", "detailRoutes", "workflow-step",
    "1440", "1024", "768", "390", "320", "scrollWidth",
    "workflow-desktop-", "workflow-mobile-", "hero-desktop.png", "hero-mobile.png",
    "work-desktop-accommodation.png", "work-mobile-accommodation.png",
    "work-desktop-cool.png", "work-mobile-cool.png", "work-desktop.png", "motion-video-rccv", "currentTime", "transitionWidths", "--about-line",
    "cueBottom", "overlaps", "aboutAnchorDelta", "coolRevealStart", "coolRevealMid", "workHeights", "local-search-magnet",
  ]) {
    assert.ok(qa.includes(marker), `browser QA missing ${marker}`);
  }
  assert.ok(!qa.includes("?stage=white"), "browser QA should not retain the removed background comparator");
  assert.match(qa, /portfolio-hero-system-map-(?:desktop|mobile)/);
  assert.match(qa, /rccv-showcase-laptop/);
  assert.match(qa, /cool-runnings-sizzle-25s/);
});
