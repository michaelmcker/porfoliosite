# V2 Motion Polish and Local Search Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the real boutique scroll animation, finish the approved V2 responsive polish, and add a V2-native local-search case study without changing V1 implementation files.

**Architecture:** Build one 800 x 500 concatenated accommodation video from the three tracked source clips, then map section scroll progress to `video.currentTime` in `v2/app.js`. Keep presentation motion expressed through CSS custom properties so the video scrub, browser drift, About story, and reduced-motion state remain independently testable. Add the case study as an isolated HTML/CSS/JS unit under `v2/work/` that reads the checked-in rolling metrics snapshot.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js test runner, Puppeteer Core, FFmpeg, MP4/WebM.

---

## File Map

- Create `scripts/build-v2-accommodation-video.mjs`: deterministic FFmpeg builder for the concatenated MP4 and WebM.
- Create `assets/videos/accommodation/showcase-scroll.mp4`: scroll-scrub MP4 output.
- Create `assets/videos/accommodation/showcase-scroll.webm`: scroll-scrub WebM output.
- Modify `v2/index.html`: hero aside, scrub video markup, unified Bias route, case-study link.
- Modify `v2/styles.css`: browser drift, cue anchoring, album scale, Bias route, About containment, Experience spacing.
- Modify `v2/app.js`: metadata-guarded video scrubbing and shared reveal progress.
- Create `v2/work/local-search-magnet.html`: V2 case-study document.
- Create `v2/work/local-search-magnet.css`: V2 case-study layout and responsive system.
- Create `v2/work/local-search-magnet.js`: checked-in rolling metrics hydration.
- Modify `tests/v2-portfolio.test.mjs`: source, structure, reduced-motion, and V1-isolation contracts.
- Modify `scripts/qa-v2.mjs`: runtime video-seek, cue containment, About non-overlap, case-study, and screenshot checks.
- Modify `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md`: final source-truth and interaction rules.

### Task 1: Lock the approved contract in failing tests

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Add failing homepage and case-study assertions**

Add tests that require:

```js
test("V2 uses a real scroll-scrub accommodation video and keeps a frame fallback", async () => {
  const [html, app] = await Promise.all([readV2("index.html"), readV2("app.js")]);
  assert.match(html, /data-accommodation-scrub/);
  assert.match(html, /showcase-scroll\.webm/);
  assert.match(html, /showcase-scroll\.mp4/);
  assert.match(html, /data-accommodation-fallback/);
  assert.match(app, /loadedmetadata/);
  assert.match(app, /currentTime/);
  assert.match(app, /1\s*\/\s*25/);
  assert.doesNotMatch(app, /setFrameFromScrollProgress/);
});

test("V2 refinement keeps text and motion responsive", async () => {
  const [html, css] = await Promise.all([readV2("index.html"), readV2("styles.css")]);
  assert.match(html, /class="hero-fun"><em>And sometimes, stuff just for fun\.<\/em><\/span>/);
  assert.match(html, /class="bias-route"/);
  assert.equal((html.match(/class="bias-step-arrow/g) || []).length, 0);
  assert.match(css, /translate3d\(calc\(36px\s*\*\s*\(1\s*-\s*var\(--object-reveal/);
  assert.match(css, /\.about-questionable\s*\{[^}]*width:\s*auto[^}]*max-width:\s*100%/s);
  assert.match(css, /\.about-questionable\s*\{[^}]*color:\s*inherit[^}]*font-family:\s*inherit/s);
  assert.doesNotMatch(css, /\.experience-ledger(?: article)?\s*\{[^}]*border-/s);
});

test("V2 includes an isolated local-search case study", async () => {
  const html = await readV2("work/local-search-magnet.html");
  assert.match(html, /local-search-magnet\.css/);
  assert.match(html, /local-search-magnet\.js/);
  assert.match(html, /\.\.\/\.\.\/data\/cool-runnings-metrics-current\.json/);
  assert.match(html, /data-cool-metric="clicks"/);
  assert.match(html, /Human review/);
  assert.match(html, /href="\.\.\/#work"/);
});
```

- [ ] **Step 2: Run the targeted tests and confirm failure**

Run:

```bash
node --test --test-name-pattern='scroll-scrub|refinement|local-search case study' tests/v2-portfolio.test.mjs
```

Expected: FAIL because the scrub markup, unified Bias route, responsive About contract, and V2 case-study files do not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/v2-portfolio.test.mjs
git commit -m "test(v2): lock motion polish and case study contract"
```

### Task 2: Build the concatenated accommodation media

**Files:**
- Create: `scripts/build-v2-accommodation-video.mjs`
- Create: `assets/videos/accommodation/showcase-scroll.mp4`
- Create: `assets/videos/accommodation/showcase-scroll.webm`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Add a deterministic FFmpeg builder**

Create a Node script that checks the three inputs, invokes FFmpeg with the concat filter, preserves 800 x 500 at 25fps, inserts frequent keyframes, and writes both containers:

```js
import { execFileSync } from "node:child_process";
import { accessSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "assets/videos/accommodation");
const inputs = ["overview-scroll.mp4", "treehouse-scroll.mp4", "cabin-scroll.mp4"]
  .map((name) => path.join(directory, name));
inputs.forEach(accessSync);
mkdirSync(directory, { recursive: true });

const inputArgs = inputs.flatMap((input) => ["-i", input]);
const filter = "[0:v][1:v][2:v]concat=n=3:v=1:a=0,scale=800:500,fps=25,format=yuv420p[outv]";

execFileSync("ffmpeg", ["-y", ...inputArgs, "-filter_complex", filter, "-map", "[outv]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-g", "12", "-movflags", "+faststart", path.join(directory, "showcase-scroll.mp4")], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", ...inputArgs, "-filter_complex", filter, "-map", "[outv]", "-an", "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-g", "12", "-row-mt", "1", path.join(directory, "showcase-scroll.webm")], { stdio: "inherit" });
```

- [ ] **Step 2: Generate the two outputs**

Run:

```bash
node scripts/build-v2-accommodation-video.mjs
```

Expected: two successful FFmpeg runs and files under `assets/videos/accommodation/`.

- [ ] **Step 3: Verify dimensions, frame rate, and duration**

Run:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of json assets/videos/accommodation/showcase-scroll.mp4
```

Expected: `800`, `500`, `25/1`, and a duration of approximately `32.88` seconds.

- [ ] **Step 4: Add asset-resolution assertions and run them**

Extend the media test with `access()` checks for both outputs, then run:

```bash
node --test --test-name-pattern='scroll-scrub accommodation video' tests/v2-portfolio.test.mjs
```

Expected: asset checks PASS while markup assertions remain FAIL.

- [ ] **Step 5: Commit the deterministic media**

```bash
git add scripts/build-v2-accommodation-video.mjs assets/videos/accommodation/showcase-scroll.mp4 assets/videos/accommodation/showcase-scroll.webm tests/v2-portfolio.test.mjs
git commit -m "feat(v2): build accommodation scroll video"
```

### Task 3: Replace sparse frame swapping with real video scrubbing

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/app.js`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Replace accommodation viewport markup**

Use a real video plus a reduced-motion fallback:

```html
<div class="browser-viewport accommodation-viewport">
  <video data-accommodation-scrub muted playsinline preload="metadata" poster="../assets/frames/accommodation/overview/001.jpg" aria-label="Scroll-controlled preview of the boutique accommodation website">
    <source src="../assets/videos/accommodation/showcase-scroll.webm" type="video/webm">
    <source src="../assets/videos/accommodation/showcase-scroll.mp4" type="video/mp4">
  </video>
  <img class="accommodation-fallback" data-accommodation-fallback src="../assets/frames/accommodation/overview/001.jpg" alt="Boutique accommodation website preview">
</div>
```

Remove the obsolete `data-frame-sequences` and frame-control instructions. Keep the browser wrapper focusable only if it retains useful keyboard seeking.

- [ ] **Step 2: Implement metadata-guarded scrub state**

Replace the image-sequence initializer with:

```js
const accommodationVideo = document.querySelector("[data-accommodation-scrub]");
const accommodationScrub = {
  ready: false,
  duration: 0,
  pendingProgress: 0,
};
const sourceFrameDuration = 1 / 25;

const seekAccommodation = (progress) => {
  if (!accommodationVideo || reducedMotion.matches) return;
  accommodationScrub.pendingProgress = clampUnit(progress);
  if (!accommodationScrub.ready || !accommodationScrub.duration) return;
  const target = accommodationScrub.pendingProgress * Math.max(0, accommodationScrub.duration - sourceFrameDuration);
  if (Math.abs(accommodationVideo.currentTime - target) >= sourceFrameDuration) accommodationVideo.currentTime = target;
};

accommodationVideo?.addEventListener("loadedmetadata", () => {
  accommodationScrub.ready = true;
  accommodationScrub.duration = accommodationVideo.duration;
  seekAccommodation(accommodationScrub.pendingProgress);
});
```

In the existing scroll update, call `seekAccommodation(progress)` for the accommodation object after setting `--object-reveal`.

- [ ] **Step 3: Add stable video/fallback CSS**

```css
.accommodation-viewport > video,
.accommodation-fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.accommodation-fallback { display: none; }
@media (prefers-reduced-motion: reduce) {
  [data-accommodation-scrub] { display: none; }
  .accommodation-fallback { display: block; }
}
```

- [ ] **Step 4: Run targeted tests**

Run:

```bash
node --test --test-name-pattern='scroll-scrub accommodation video' tests/v2-portfolio.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the real scroll animation**

```bash
git add v2/index.html v2/app.js v2/styles.css tests/v2-portfolio.test.mjs
git commit -m "fix(v2): scrub real accommodation video on scroll"
```

### Task 4: Apply the approved homepage visual refinements

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/app.js`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Separate the hero aside**

Wrap the final sentence in `<span class="hero-fun"><em>And sometimes, stuff just for fun.</em></span>` and style it as a block with `margin-top: .55em`, inherited body size, Fraunces, italic style, and no new card or rule.

- [ ] **Step 2: Add one shared 36px browser drift**

Use `--object-reveal` on accommodation, Cool Runnings, and Why Elevators. Add `translate3d(calc(36px * (1 - var(--object-reveal, 0))), ...)` to each transform while preserving only the elevator's existing perspective motion. Reduced motion sets progress to `1`.

- [ ] **Step 3: Anchor the preview cue as one unit**

Use a two-column inline grid for the arrow and label, align the label with the arrow's upper-right start, and contain it with `max-width: 100%`. At mobile widths, keep the unit inside the 20px content gutters and remove rotation.

- [ ] **Step 4: Enlarge the album composite**

Change the desktop interlude split to `minmax(300px, .62fr) minmax(560px, 1.38fr)` and give its figure `width: min(116%, 980px)` with a small negative inline translation that remains clipped by the black section. Mobile resets to `width: 108%` and a centred translation.

- [ ] **Step 5: Replace local Bias arrows with one route**

Remove the five arrow SVGs from list items. Add one desktop and one mobile route SVG behind the ordered list:

```html
<svg class="bias-route bias-route-desktop" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
  <path d="M205 92C265 92 275 92 330 92S430 92 500 92S690 92 790 92C850 92 860 145 820 186S720 270 650 270H210"/>
  <path d="m226 258-16 12 16 12"/>
</svg>
```

Use a 1.5px ink stroke at 58% opacity. Mobile uses one vertical path beside the labels and one terminal arrowhead. Keep the route behind text and remove per-step arrow layout space.

- [ ] **Step 6: Run refinement tests**

Run:

```bash
node --test --test-name-pattern='refinement keeps text and motion responsive|Bias' tests/v2-portfolio.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit the homepage motion language**

```bash
git add v2/index.html v2/styles.css v2/app.js tests/v2-portfolio.test.mjs
git commit -m "refine(v2): unify browser drift and method route"
```

### Task 5: Fix About containment and tighten Experience

**Files:**
- Modify: `v2/styles.css`
- Modify: `scripts/qa-v2.mjs`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Make the phrase normal at rest**

Set `.about-questionable` to `width: auto`, `max-width: 100%`, `color: inherit`, `font-family: inherit`, `font-size: inherit`, `font-weight: inherit`, and `line-height: inherit`. Move editorial family, gold colour, and responsive growth into scroll-derived custom properties or an `.is-focused`-equivalent state driven by `--about-focus`.

Use viewport-responsive growth:

```css
font-size: calc(1em + (5.1vw * var(--about-growth, 0)));
```

and keep the span constrained to the copy column throughout the story.

- [ ] **Step 2: Strengthen and raise the process route**

Increase the route stroke from `4` to `5.5`, move its layer above the background and below the text/portrait, and retain round caps. Do not add an outer glow.

- [ ] **Step 3: Remove Experience rules and tighten entries**

Remove ledger and article borders. Change article padding from `34px 0` to `22px 0`, keep the centred grid, and reduce the heading-to-role gap from `5px` to `3px`.

- [ ] **Step 4: Add browser non-overlap checks**

In `scripts/qa-v2.mjs`, at 1024, 900, 768, and 390px, scroll the About story to 62% and assert that the questionable phrase rectangle does not intersect the portrait rectangle. Also assert that the preview cue and accommodation viewer remain inside the viewport.

- [ ] **Step 5: Run unit and browser QA**

Run:

```bash
node --test tests/v2-portfolio.test.mjs
node scripts/qa-v2.mjs
```

Expected: all unit tests and viewport checks PASS.

- [ ] **Step 6: Commit responsive containment**

```bash
git add v2/styles.css scripts/qa-v2.mjs tests/v2-portfolio.test.mjs
git commit -m "fix(v2): contain About story and tighten experience"
```

### Task 6: Create the V2 local-search case study

**Files:**
- Create: `v2/work/local-search-magnet.html`
- Create: `v2/work/local-search-magnet.css`
- Create: `v2/work/local-search-magnet.js`
- Modify: `v2/index.html`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Build the semantic case-study document**

Create a standalone V2 document with local font declarations, V2 navigation, split hero and film, rolling outcomes, an editorial five-step system ledger, real city/frost/calculator imagery, human-review and constraints copy, and links to the live site plus `../#work`. Reference assets with `../../assets/...`.

- [ ] **Step 2: Add V2 case-study styling**

Use white canvas, charcoal film chapter, forest evidence chapter, and hard-gold closing chapter. Reuse the V2 bevel/shadow values. Keep results as centred unboxed evidence, system steps as alternating editorial rows separated by whitespace, and collapse to one column below 760px.

- [ ] **Step 3: Hydrate the rolling snapshot**

In `local-search-magnet.js`, fetch `../../data/cool-runnings-metrics-current.json`, map Search Console and GA4 fields to `[data-cool-metric]`, format with `Intl.NumberFormat("en-CA")`, and leave checked-in fallback values visible on failure. Update `[data-cool-metrics-window]` from `snapshot.update.generatedAt` using the Vancouver timezone.

- [ ] **Step 4: Point the homepage case-study link to V2**

Change the Cool Runnings link from `../work-local-yard-care-seo-build.html` to `work/local-search-magnet.html`.

- [ ] **Step 5: Run case-study tests**

Run:

```bash
node --test --test-name-pattern='isolated local-search case study|every referenced V2 asset' tests/v2-portfolio.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the V2 case study**

```bash
git add v2/work/local-search-magnet.html v2/work/local-search-magnet.css v2/work/local-search-magnet.js v2/index.html tests/v2-portfolio.test.mjs
git commit -m "feat(v2): add local search magnet case study"
```

### Task 7: Final QA, screenshots, and documentation

**Files:**
- Modify: `scripts/qa-v2.mjs`
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Extend runtime QA**

Verify the scrub video reaches metadata-ready state, changes `currentTime` after ordinary page scroll, and does not independently play. Load the V2 case study at 1440 and 390px, verify no overflow, and confirm the rolling metrics JSON request succeeds over the QA server.

- [ ] **Step 2: Capture affected surfaces**

Run:

```bash
QA_V2_SCREENSHOT_DIR='/Users/michaelmckerracher/.codex/visualizations/2026/07/14/019f5f0d-f2b8-73d3-b2fa-87e3d932aeff/portfolio-v2-2026-07-15-refinement' node scripts/qa-v2.mjs
```

Capture full-page 1440, 1024, 768, and 390 views plus hero, accommodation, music/Bias transition, About mid-story, Experience, and case-study desktop/mobile images.

- [ ] **Step 3: Update the project contract**

Document the three-video source truth, deterministic builder, currentTime scrub model, 36px shared browser drift, single Bias route, responsive About containment, line-free Experience, and new V2 case-study route in `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md`.

- [ ] **Step 4: Run final verification**

Run:

```bash
node --test tests/v2-portfolio.test.mjs
node scripts/qa-v2.mjs
git diff --check
git diff --name-only
```

Expected: all tests PASS, no whitespace errors, screenshots exist, and no V1 implementation file appears in the final refinement diff.

- [ ] **Step 5: Commit final QA and documentation**

```bash
git add scripts/qa-v2.mjs AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "docs(v2): record scroll media and case study contract"
```
