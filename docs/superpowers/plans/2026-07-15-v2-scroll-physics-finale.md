# Portfolio V2 Scroll, Portrait, and Physics Finale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved V2 accommodation scrub, stable portrait tracking, capped About choreography, and scroll-to-physics contact finale without changing V1.

**Architecture:** Keep the existing static V2 page and its `file://` review path. Accommodation and About fixes stay in `v2/app.js`; the finale gets a focused `v2/contact-finale.js` controller and a locally vendored Matter.js build. Static markup/CSS provide a complete reduced-motion and physics-failure fallback, while browser QA verifies input ownership, scroll locking, the one-way physics handoff, and responsive geometry.

**Tech Stack:** Semantic HTML, CSS custom properties and transforms, vanilla JavaScript, Matter.js 0.20.0 vendored locally, Node test runner, Puppeteer/Chrome QA.

---

## File Map

- Modify `tests/v2-portfolio.test.mjs` — static contracts for wheel capture, portrait ownership, About caps, finale structure, and local physics.
- Modify `scripts/qa-v2.mjs` — behavioural browser checks at desktop and responsive widths.
- Modify `package.json` and `package-lock.json` — pin Matter.js as a development source for the vendored browser build.
- Create `v2/vendor/matter.min.js` — local browser runtime copied from the pinned package.
- Modify `v2/index.html` — accommodation semantics and the finale's authored media-object markup.
- Modify `v2/app.js` — local accommodation wheel scrub and parent-owned portrait coordinates.
- Modify `v2/portrait/embed.html` — embedded-mode message-only portrait control.
- Modify `v2/styles.css` — tighter accommodation runway, capped About choreography, and full responsive finale styling.
- Create `v2/contact-finale.js` — deterministic spiral, lazy physics initialization, one-way release, settle detection, drag/toss, morph state, and static fallback.
- Modify `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md` — record the input-ownership and finale source-truth rules after verification.

## Task 1: Lock the New Interaction Contracts in Static Tests

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Replace the obsolete accommodation no-wheel assertion with the approved local-wheel contract**

Replace the current test named `boutique accommodation uses its three real source recordings without overlay controls` with:

```js
test("boutique accommodation owns pointer-wheel scrubbing without trapping keyboard or reduced motion", async () => {
  const [html, css, app] = await Promise.all([readV2("index.html"), readV2("styles.css"), readV2("app.js")]);

  assert.match(html, /data-accommodation-viewer/);
  assert.match(html, /data-accommodation-scrub/);
  assert.match(html, /aria-label="[^"]*wheel[^"]*preview[^"]*"/i);
  assert.match(app, /addEventListener\(["']wheel["']/);
  assert.match(app, /passive:\s*false/);
  assert.match(app, /preventDefault\(\)/);
  assert.match(app, /accommodationWheelProgress/);
  assert.match(app, /matchMedia\(["']\(pointer:\s*fine\)["']\)/);
  assert.doesNotMatch(app, /addEventListener\(["']keydown["'][\s\S]{0,180}preventDefault/);
  assert.match(css, /\.work-object-accommodation\s*\{[^}]*min-height:\s*clamp\([^}]*105svh/s);
  assert.match(app, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Add the portrait single-owner and typography-cap test**

```js
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
  assert.match(css, /\.about\.is-about-focused \.about-questionable\s*\{[^}]*3\.8rem/s);
  assert.match(css, /\.about-process-value\s*\{[^}]*2\.8rem/s);
});
```

- [ ] **Step 3: Add the finale structure and local-runtime test**

```js
test("contact finale exposes a local scroll-to-physics sequence with a static fallback", async () => {
  const [html, css, finale] = await Promise.all([
    readV2("index.html"),
    readV2("styles.css"),
    readV2("contact-finale.js"),
  ]);

  assert.match(html, /class="contact-story"[^>]*data-contact-story/);
  assert.match(html, /data-finale-state="static"/);
  assert.match(html, /class="contact-stage"[^>]*data-contact-stage/);
  assert.equal((html.match(/data-contact-object=/g) || []).length, 11);
  assert.match(html, /data-contact-morph-before[^>]*>Systematise\.<\/span>/);
  assert.match(html, /data-contact-morph-after[^>]*>Let’s build something useful\.<\/span>/);
  assert.match(html, /<script src="contact-finale\.js" defer><\/script>/);
  assert.doesNotMatch(html, /https?:\/\/[^"']*matter/i);
  assert.match(finale, /vendor\/matter\.min\.js/);
  assert.match(finale, /function loadMatterRuntime/);
  assert.match(finale, /IntersectionObserver/);
  assert.match(finale, /function spiralPose/);
  assert.match(finale, /function releaseToPhysics/);
  assert.match(finale, /function markSettled/);
  assert.match(finale, /Body\.setPosition/);
  assert.match(finale, /data-finale-state/);
  assert.match(css, /\.contact-story\.has-finale-js\s*\{[^}]*min-height:\s*340svh/s);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*?\.contact-object/s);
  await access(fileUrl("vendor/matter.min.js"));
});
```

In the existing `About holds a sticky scroll story before releasing into the rest of the page` test, replace the two obsolete `.contact` assertions with:

```js
assert.match(css, /\.contact-story\s*\{[^}]*background:\s*var\(--accent\)/s);
assert.match(css, /\.contact-morph\s*\{[^}]*color:\s*#1f1909/s);
```

- [ ] **Step 4: Run the focused tests and confirm they fail for the missing contracts**

Run:

```bash
node --test --test-name-pattern="boutique accommodation owns|About uses one parent-owned|contact finale exposes" tests/v2-portfolio.test.mjs
```

Expected: three failures identifying the missing wheel listener, stable pointer stage, and finale files/markup.

- [ ] **Step 5: Commit the failing tests**

```bash
git add tests/v2-portfolio.test.mjs
git commit -m "test(v2): define scrub portrait and finale contracts"
```

## Task 2: Implement Pointer-local Accommodation Scrubbing

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/app.js`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Make the browser's accessible name explain its local wheel behaviour**

Update the accommodation figure in `v2/index.html`:

```html
<figure class="browser-object browser-object-tall screen-bezel" data-accommodation-viewer role="group" aria-label="Move the pointer over this browser and use the wheel to scrub the boutique accommodation preview">
```

- [ ] **Step 2: Add normalized wheel accumulation in `v2/app.js`**

Add these declarations beside the current accommodation state:

```js
const finePointer = window.matchMedia("(pointer: fine)");
let accommodationWheelProgress = 0;
let accommodationWheelFrame;
let accommodationManualUntil = 0;

const normalizeWheelDelta = (event) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 18;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
};

const applyAccommodationWheel = () => {
  accommodationWheelFrame = undefined;
  seekAccommodation(accommodationWheelProgress);
};

const scrubAccommodationWithWheel = (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  event.preventDefault();
  loadAccommodationVideo();
  if (!accommodationDuration) return;
  accommodationManualUntil = performance.now() + 900;
  const pixelsForFullScrub = Math.max(900, window.innerHeight * 1.4);
  accommodationWheelProgress = clampUnit(
    accommodationWheelProgress + normalizeWheelDelta(event) / pixelsForFullScrub,
  );
  if (!accommodationWheelFrame) accommodationWheelFrame = requestAnimationFrame(applyAccommodationWheel);
};

accommodationViewer?.addEventListener("wheel", scrubAccommodationWithWheel, { passive: false });
```

In `loadedmetadata`, synchronize the wheel value:

```js
accommodationWheelProgress = accommodationPendingProgress;
```

In `updateObjectReveals`, replace the unconditional accommodation seek with:

```js
if (revealKey === "accommodation" && performance.now() >= accommodationManualUntil) {
  accommodationWheelProgress = progress;
  seekAccommodation(progress);
}
```

- [ ] **Step 3: Tighten only the boutique runway and keep the cue attached**

Replace the shared minimum-height rule with:

```css
.work-object-accommodation { min-height: clamp(820px, 100svh, 105svh); padding-block: clamp(64px, 7vw, 104px); }
.work-object-cool,
.work-object-elevators { min-height: 120svh; }
```

Keep the cue's existing grid and set a safe top/right anchor:

```css
.accommodation-scroll-cue {
  top: clamp(-48px, -3vw, -40px);
  right: clamp(14px, 2vw, 28px);
}
```

- [ ] **Step 4: Run the focused static tests**

Run:

```bash
node --test --test-name-pattern="boutique accommodation owns|project labels and the accommodation cue|real scroll-scrub accommodation" tests/v2-portfolio.test.mjs
```

Expected: all matching tests pass.

- [ ] **Step 5: Commit the accommodation change**

```bash
git add v2/index.html v2/app.js v2/styles.css tests/v2-portfolio.test.mjs
git commit -m "fix(v2): give accommodation preview local wheel scrub"
```

## Task 3: Make the Parent the Portrait's Only Pointer Owner

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/app.js`
- Modify: `v2/portrait/embed.html`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Mark the stable visible About stage**

Update the sticky wrapper in `v2/index.html`:

```html
<div class="about-story-sticky" data-about-pointer-stage>
```

- [ ] **Step 2: Normalize the parent's coordinates against that stable stage**

Replace the current portrait pointer declarations and handlers in `v2/app.js` with:

```js
const aboutPointerStage = document.querySelector("[data-about-pointer-stage]");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitEmbed = portraitFrame?.querySelector("iframe");
let portraitPointerFrame;

portraitEmbed?.addEventListener("load", () => portraitFrame.classList.add("is-loaded"));

const sendPortraitPointer = (event) => {
  if (!aboutPointerStage || !portraitEmbed?.contentWindow) return;
  const bounds = aboutPointerStage.getBoundingClientRect();
  const x = clampUnit((event.clientX - bounds.left) / bounds.width);
  const y = clampUnit((event.clientY - bounds.top) / bounds.height);
  window.cancelAnimationFrame(portraitPointerFrame);
  portraitPointerFrame = requestAnimationFrame(() => {
    portraitEmbed.contentWindow.postMessage({ type: "portfolio-portrait-pointer", x, y }, "*");
  });
};

aboutPointerStage?.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "touch") sendPortraitPointer(event);
});
aboutPointerStage?.addEventListener("pointerdown", sendPortraitPointer);
```

Do not call `sendPortraitPointer` from scroll or resize handlers.

- [ ] **Step 3: Remove the iframe's competing pointer listener**

In `v2/portrait/embed.html`, change the stage CSS to:

```css
.stage { position: relative; width: 100%; height: 100%; overflow: hidden; background: #17130f; cursor: default; user-select: none; }
```

Delete `selectPose()` and both `stage.addEventListener(...)` blocks. Keep the validated `window.addEventListener('message', ...)` handler unchanged.

- [ ] **Step 4: Make the embedded surface pointer-transparent and cap the About type**

Update `v2/styles.css`:

```css
.portrait-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
}

.about.is-about-focused .about-questionable {
  display: block;
  margin-top: 10px;
  color: #fff5d8;
  font-family: var(--font-editorial);
  font-size: clamp(1.32rem, calc(1.32rem + (2.48rem * var(--about-growth, 0))), 3.8rem);
  font-weight: 650;
  line-height: 1.08;
  overflow-wrap: normal;
  transform: translate3d(0, calc(-6svh * var(--about-growth, 0)), 0);
}

.about-process-reveal {
  margin-top: clamp(20px, 3vw, 36px);
  opacity: var(--about-value, 0);
  transform: translateY(calc((18px * (1 - var(--about-value, 0))) - (3svh * var(--about-value, 0))));
}

.about-process-value {
  max-width: 580px;
  margin: 0 0 16px;
  color: white;
  font-family: var(--font-editorial);
  font-size: clamp(1.8rem, 2.5vw, 2.8rem);
  font-weight: 580;
  line-height: 1.08;
}
```

- [ ] **Step 5: Run the focused tests**

Run:

```bash
node --test --test-name-pattern="About uses one parent-owned|About holds a sticky|accordion stages selection and About" tests/v2-portfolio.test.mjs
```

Expected: all matching tests pass.

- [ ] **Step 6: Commit the portrait and type fix**

```bash
git add v2/index.html v2/app.js v2/portrait/embed.html v2/styles.css tests/v2-portfolio.test.mjs
git commit -m "fix(v2): unify portrait pointer tracking"
```

## Task 4: Add the Finale Markup and Static Responsive Composition

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Replace the current contact band with the sticky story**

Replace the existing `<section class="contact ...">` with:

```html
<section class="contact-story" id="contact" data-contact-story aria-labelledby="contact-title" data-finale-state="static">
  <div class="contact-stage" data-contact-stage>
    <div class="contact-object-field" data-contact-field aria-hidden="true">
      <figure class="contact-object contact-object-portrait" data-contact-object="portrait" data-body-width="174"><img src="../assets/portrait/poster.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-laptop" data-contact-object="rccv" data-body-width="250"><img src="../assets/device-mockups/laptop-three-quarter-rccv.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-browser" data-contact-object="accommodation" data-body-width="230"><img src="../assets/frames/accommodation/treehouse/010.jpg" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-browser" data-contact-object="cool-runnings" data-body-width="220"><img src="../assets/screens/cool-runnings.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-paper" data-contact-object="proposal" data-body-width="152"><img src="../assets/samples/vertical-impression-public-proposal-sample-page-1.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-browser" data-contact-object="elevators" data-body-width="220"><img src="../assets/screens/why-elevators.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-workflow" data-contact-object="content" data-body-width="210"><img src="../assets/workflows/content-workflow-approved-stage.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-workflow" data-contact-object="dashboard" data-body-width="210"><img src="../assets/screens/fountainhead-ai-visibility-dashboard-v4-16x9.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-workflow" data-contact-object="publishing" data-body-width="210"><img src="assets/presentation-publishing-desktop.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-workflow" data-contact-object="prospecting" data-body-width="210"><img src="../assets/workflows/local-prospecting.png" alt="" loading="lazy" decoding="async"></figure>
      <figure class="contact-object contact-object-workflow" data-contact-object="website" data-body-width="210"><img src="../assets/generated/json-prompt-image-output.png" alt="" loading="lazy" decoding="async"></figure>
    </div>
    <div class="contact-resolution" data-contact-resolution>
      <h2 id="contact-title" class="contact-morph" aria-label="Let’s build something useful.">
        <span data-contact-morph-before aria-hidden="true">Systematise.</span>
        <span data-contact-morph-after aria-hidden="true">Let’s build something useful.</span>
      </h2>
      <div class="hero-actions contact-actions">
        <a class="button button-primary" href="mailto:michael.mckerracher@gmail.com">Email Michael</a>
        <a class="button button-quiet" href="https://www.linkedin.com/in/michaelmcker/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a class="button button-quiet" href="https://github.com/michaelmcker" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <p class="contact-continue" aria-hidden="true">Continue ↓</p>
    </div>
    <p class="contact-instruction" data-contact-instruction>Scroll to gather the work.</p>
  </div>
</section>
```

Add the finale controller after `app.js`. It will load the local Matter runtime only as the finale approaches:

```html
<script src="contact-finale.js" defer></script>
```

- [ ] **Step 2: Add the structural finale CSS**

Replace the old `.contact` rules with:

```css
.contact-story {
  --finale-progress: 0;
  position: relative;
  min-height: 100svh;
  background: var(--accent);
  color: #1f1909;
}
.contact-story.has-finale-js { min-height: 340svh; }
.contact-stage {
  position: sticky;
  top: 0;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
}
.contact-object-field { position: absolute; z-index: 1; inset: 0; overflow: hidden; }
.contact-object {
  position: absolute;
  left: var(--static-left, 8%);
  bottom: var(--static-bottom, 7%);
  width: var(--body-width, 210px);
  margin: 0;
  overflow: hidden;
  border: 5px solid #151713;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 34px rgba(31,25,9,.24);
  transform: rotate(var(--static-rotate, -4deg));
  transform-origin: center;
  user-select: none;
  touch-action: none;
  will-change: transform, opacity;
}
.contact-object:nth-child(2) { --static-left: 22%; --static-bottom: 4%; --static-rotate: 3deg; }
.contact-object:nth-child(3) { --static-left: 40%; --static-bottom: 8%; --static-rotate: -2deg; }
.contact-object:nth-child(4) { --static-left: 58%; --static-bottom: 5%; --static-rotate: 5deg; }
.contact-object:nth-child(5) { --static-left: 77%; --static-bottom: 8%; --static-rotate: -5deg; }
.contact-object:nth-child(n + 6) { --static-bottom: 25%; }
.contact-object:nth-child(6) { --static-left: 3%; --static-rotate: 4deg; }
.contact-object:nth-child(7) { --static-left: 19%; --static-rotate: -3deg; }
.contact-object:nth-child(8) { --static-left: 69%; --static-rotate: 2deg; }
.contact-object:nth-child(9) { --static-left: 82%; --static-rotate: -3deg; }
.contact-object:nth-child(10) { --static-left: 34%; --static-rotate: 4deg; }
.contact-object:nth-child(11) { --static-left: 53%; --static-rotate: -4deg; }
.contact-story.has-finale-js .contact-object { top: 0; left: 0; bottom: auto; transform: translate3d(-200vw, -200vh, 0); }
.contact-object img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; pointer-events: none; }
.contact-object-portrait { border-radius: 48% 48% 12px 12px / 13% 13% 12px 12px; border-color: #725a3d; }
.contact-object-portrait img,
.contact-object-paper img { aspect-ratio: auto; }
.contact-object-laptop { border: 0; background: transparent; box-shadow: none; filter: drop-shadow(0 18px 24px rgba(31,25,9,.28)); }
.contact-object-laptop img { aspect-ratio: auto; object-fit: contain; }
.contact-resolution {
  position: absolute;
  z-index: 3;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  padding: var(--gutter);
  text-align: center;
  pointer-events: none;
}
.contact-morph {
  position: relative;
  width: min(920px, calc(100vw - (2 * var(--gutter))));
  min-height: 1.2em;
  margin: 0;
  color: #1f1909;
  font-family: var(--font-editorial);
  font-size: clamp(3rem, 7vw, 7rem);
  font-weight: 620;
  line-height: .98;
  opacity: 1;
}
.contact-morph span { position: absolute; inset: 0; display: grid; place-items: center; }
.contact-morph [data-contact-morph-before] { display: none; }
.contact-morph [data-contact-morph-after] { position: static; }
.contact-actions,
.contact-continue { opacity: 1; transform: none; }
.contact-actions { justify-content: center; margin-top: 40px; pointer-events: auto; }
.contact-instruction { position: absolute; z-index: 4; top: 28px; left: 50%; margin: 0; transform: translateX(-50%); font-size: .82rem; letter-spacing: .08em; text-transform: uppercase; }
.contact-story:not(.has-finale-js) .contact-instruction { display: none; }
.contact-story.has-finale-js .contact-morph { opacity: 0; }
.contact-story.has-finale-js .contact-morph span { position: absolute; }
.contact-story.has-finale-js .contact-morph [data-contact-morph-before] { display: grid; }
.contact-story.has-finale-js .contact-actions,
.contact-story.has-finale-js .contact-continue { opacity: 0; transform: translateY(16px); }
.contact-story[data-finale-state="physics"] .contact-instruction { opacity: 0; }
.contact-story[data-finale-state="settled"] .contact-morph { opacity: 1; }
.contact-story[data-finale-state="settled"] [data-contact-morph-before] { animation: contact-morph-out 650ms both; }
.contact-story[data-finale-state="settled"] [data-contact-morph-after] { animation: contact-morph-in 800ms 280ms both; }
.contact-story[data-finale-state="settled"] .contact-actions,
.contact-story[data-finale-state="settled"] .contact-continue { opacity: 1; transform: none; transition: opacity 420ms 900ms ease, transform 420ms 900ms ease; }
.contact-story .button-primary { background: #1f1909; border-color: #1f1909; color: white; }
.contact-story .button-quiet { border-color: rgba(31,25,9,.4); background: rgba(255,255,255,.2); }
@keyframes contact-morph-out { to { opacity: 0; filter: blur(16px); transform: scale(1.12); } }
@keyframes contact-morph-in { from { opacity: 0; filter: blur(18px); transform: scale(.82); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
```

- [ ] **Step 3: Add responsive object counts and the static reduced-motion layout**

```css
@media (max-width: 1099px) {
  .contact-object { --body-width: 170px; }
  .contact-object:nth-child(n + 10) { display: none; }
}
@media (max-width: 639px) {
  .contact-story { min-height: 270svh; }
  .contact-object { --body-width: 128px; border-width: 3px; border-radius: 11px; }
  .contact-object:nth-child(n + 8) { display: none; }
  .contact-morph { font-size: clamp(2.55rem, 13vw, 4.5rem); }
  .contact-actions { width: min(100%, 340px); flex-direction: column; }
  .contact-actions .button { width: 100%; min-height: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  .contact-story { min-height: 100svh; }
  .contact-object { opacity: 1; transition: none; }
  .contact-morph,
  .contact-actions,
  .contact-continue { opacity: 1; transform: none; animation: none; transition: none; }
  [data-contact-morph-before] { display: none !important; }
  [data-contact-morph-after] { position: static !important; }
  .contact-instruction { display: none; }
}
```

- [ ] **Step 4: Run the structural tests to confirm only the missing controller/runtime remain**

Run:

```bash
node --test --test-name-pattern="contact finale exposes|V2 contains the required sections" tests/v2-portfolio.test.mjs
```

Expected: the required sections test passes; the finale test fails only because `contact-finale.js` and `vendor/matter.min.js` do not exist yet.

- [ ] **Step 5: Commit the static finale**

```bash
git add v2/index.html v2/styles.css
git commit -m "feat(v2): add responsive contact finale stage"
```

## Task 5: Vendor the Pinned Physics Runtime

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `v2/vendor/matter.min.js`

- [ ] **Step 1: Install the pinned package as a development source**

Run:

```bash
npm install --save-dev matter-js@0.20.0
```

Expected: `matter-js` appears under `devDependencies`, and the lockfile records version `0.20.0`.

- [ ] **Step 2: Copy the browser build into the V2-owned vendor directory**

Run:

```bash
mkdir -p v2/vendor
cp node_modules/matter-js/build/matter.min.js v2/vendor/matter.min.js
```

Expected: `v2/vendor/matter.min.js` exists and begins with the Matter.js license banner.

- [ ] **Step 3: Verify the local build without a network import**

Run:

```bash
rg -n "Matter\.js|version=\"0\.20\.0\"" v2/vendor/matter.min.js package-lock.json
rg -n "https?://.*matter" v2/index.html
```

Expected: the first command finds the pinned local runtime; the second command returns no matches.

- [ ] **Step 4: Commit the vendored runtime**

```bash
git add package.json package-lock.json v2/vendor/matter.min.js
git commit -m "build(v2): vendor pinned Matter physics runtime"
```

## Task 6: Implement the Deterministic Spiral and One-way Physics Handoff

**Files:**
- Create: `v2/contact-finale.js`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Create controller state, responsive item selection, and deterministic spiral math**

Create `v2/contact-finale.js` with this foundation:

```js
(() => {
  const story = document.querySelector("[data-contact-story]");
  const stage = document.querySelector("[data-contact-stage]");
  const field = document.querySelector("[data-contact-field]");
  if (!story || !stage || !field) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const visibleItems = () => [...field.querySelectorAll("[data-contact-object]")]
    .filter((item) => getComputedStyle(item).display !== "none");

  let state = "static";
  let released = false;
  let scrollFrame;
  let engine;
  let bodies = [];
  let animationFrame;
  let lastTimestamp = 0;
  let releaseTimestamp = 0;
  let quietFrames = 0;
  let dragged;
  let dragPoint;
  let matterPromise;
  let finaleVisible = true;

  function loadMatterRuntime() {
    if (window.Matter) return Promise.resolve(window.Matter);
    if (matterPromise) return matterPromise;
    matterPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "vendor/matter.min.js";
      script.onload = () => window.Matter ? resolve(window.Matter) : reject(new Error("Matter did not initialize"));
      script.onerror = () => reject(new Error("Matter failed to load"));
      document.head.append(script);
    });
    return matterPromise;
  }

  function setState(next) {
    state = next;
    story.dataset.finaleState = next;
  }

  function releaseSlot(index, count, width, height) {
    const columns = Math.min(5, count);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const span = width * .64;
    return {
      x: width * .18 + (columns === 1 ? span / 2 : (column / (columns - 1)) * span),
      y: height * .13 + row * Math.min(92, height * .1),
      angle: ((index % 2 ? 1 : -1) * (2 + (index % 3) * 2)) * Math.PI / 180,
    };
  }

  function spiralPose(index, count, progress, width, height) {
    const itemProgress = smooth(clamp((progress * 1.22) - index * .025));
    const centreX = width * .5;
    const centreY = height * .44;
    const maxRadius = Math.hypot(width, height) * .62;
    const spiralProgress = clamp(itemProgress / .82);
    const theta = index * .78 + (1 - spiralProgress) * Math.PI * 3.6;
    const radius = maxRadius * (1 - spiralProgress * .78);
    const spiralX = centreX + Math.cos(theta) * radius;
    const spiralY = centreY + Math.sin(theta) * radius * .7;
    const slot = releaseSlot(index, count, width, height);
    const slotBlend = smooth((itemProgress - .76) / .24);
    return {
      x: lerp(spiralX, slot.x, slotBlend),
      y: lerp(spiralY, slot.y, slotBlend),
      angle: lerp(theta + Math.PI / 2, slot.angle, slotBlend),
      scale: lerp(.58, 1, itemProgress),
      opacity: clamp(itemProgress * 1.8),
    };
  }

  function applySpiral(progress) {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const items = visibleItems();
    items.forEach((item, index) => {
      const pose = spiralPose(index, items.length, progress, width, height);
      const itemWidth = Number(item.dataset.bodyWidth || 210) * (width < 640 ? .68 : width < 1100 ? .82 : 1);
      item.style.setProperty("--body-width", `${itemWidth}px`);
      item.style.opacity = pose.opacity.toFixed(3);
      item.style.transform = `translate3d(${pose.x - item.offsetWidth / 2}px, ${pose.y - item.offsetHeight / 2}px, 0) rotate(${pose.angle}rad) scale(${pose.scale})`;
      item.dataset.poseX = String(pose.x);
      item.dataset.poseY = String(pose.y);
      item.dataset.poseAngle = String(pose.angle);
    });
  }
```

- [ ] **Step 2: Add scroll progress and the one-way release threshold**

Continue the same file:

```js
  function updateFromScroll() {
    scrollFrame = undefined;
    if (released || reducedMotion.matches) return;
    const bounds = story.getBoundingClientRect();
    const travel = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp(-bounds.top / travel);
    const spiralProgress = clamp(progress / .58);
    story.style.setProperty("--finale-progress", spiralProgress.toFixed(4));
    applySpiral(spiralProgress);
    if (progress >= .58) releaseToPhysics();
  }

  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", () => {
    if (!released) requestScrollUpdate();
    else rebuildBoundaries();
  }, { passive: true });
```

- [ ] **Step 3: Add Matter bodies at the exact final DOM transforms**

Continue the file:

```js
  function createBoundaries(width, height) {
    const { Bodies } = Matter;
    const thickness = 160;
    return [
      Bodies.rectangle(width / 2, height + thickness / 2 - 10, width + thickness * 2, thickness, { isStatic: true, label: "floor" }),
      Bodies.rectangle(-thickness / 2 + 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-left" }),
      Bodies.rectangle(width + thickness / 2 - 10, height / 2, thickness, height * 2, { isStatic: true, label: "wall-right" }),
    ];
  }

  function rebuildBoundaries() {
    if (!engine) return;
    const boundaryLabels = new Set(["floor", "wall-left", "wall-right"]);
    const boundaryBodies = Matter.Composite.allBodies(engine.world).filter((body) => boundaryLabels.has(body.label));
    Matter.Composite.remove(engine.world, boundaryBodies);
    Matter.Composite.add(engine.world, createBoundaries(stage.clientWidth, stage.clientHeight));
  }

  async function releaseToPhysics() {
    if (released) return;
    released = true;
    applySpiral(1);
    setState("physics");
    try {
      await loadMatterRuntime();
    } catch {
      showStaticFallback();
      return;
    }
    engine = Matter.Engine.create({ enableSleeping: true });
    engine.gravity.y = 1;
    engine.gravity.scale = .00115;
    bodies = visibleItems().map((item) => {
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      const body = Matter.Bodies.rectangle(
        Number(item.dataset.poseX),
        Number(item.dataset.poseY),
        width,
        height,
        {
          label: item.dataset.contactObject,
          restitution: .24,
          friction: .62,
          frictionAir: .018,
          sleepThreshold: 45,
          chamfer: { radius: Math.min(14, width * .06) },
        },
      );
      Matter.Body.setAngle(body, Number(item.dataset.poseAngle));
      body.plugin.domElement = item;
      return body;
    });
    story.dataset.releaseDelta = Math.max(...bodies.map((body) => {
      const item = body.plugin.domElement;
      return Math.hypot(
        body.position.x - Number(item.dataset.poseX),
        body.position.y - Number(item.dataset.poseY),
      );
    })).toFixed(3);
    Matter.Composite.add(engine.world, [...createBoundaries(stage.clientWidth, stage.clientHeight), ...bodies]);
    releaseTimestamp = performance.now();
    animationFrame = requestAnimationFrame(stepPhysics);
  }
```

- [ ] **Step 4: Add simulation rendering and deterministic settle detection**

```js
  function markSettled() {
    if (state === "settled") return;
    setState("settled");
    stage.classList.add("is-draggable");
  }

  function stepPhysics(timestamp) {
    animationFrame = undefined;
    const delta = lastTimestamp ? Math.min(32, timestamp - lastTimestamp) : 16.667;
    lastTimestamp = timestamp;
    Matter.Engine.update(engine, delta);
    bodies.forEach((body) => {
      const item = body.plugin.domElement;
      item.style.opacity = "1";
      item.style.transform = `translate3d(${body.position.x - item.offsetWidth / 2}px, ${body.position.y - item.offsetHeight / 2}px, 0) rotate(${body.angle}rad)`;
    });
    if (state !== "settled") {
      const quiet = bodies.every((body) => body.isSleeping || (body.speed < .35 && body.angularSpeed < .018));
      quietFrames = quiet ? quietFrames + 1 : 0;
      if (quietFrames >= 45 || timestamp - releaseTimestamp > 6500) markSettled();
    }
    if (finaleVisible) animationFrame = requestAnimationFrame(stepPhysics);
  }

  function showStaticFallback() {
    released = true;
    applySpiral(1);
    visibleItems().forEach((item, index) => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const column = index % 4;
      const row = Math.floor(index / 4);
      const x = width * (.16 + column * .23);
      const y = height * (.68 + row * .1);
      const angle = (index % 2 ? 4 : -4) * Math.PI / 180;
      item.style.opacity = "1";
      item.style.transform = `translate3d(${x - item.offsetWidth / 2}px, ${y - item.offsetHeight / 2}px, 0) rotate(${angle}rad)`;
    });
    markSettled();
  }
```

- [ ] **Step 5: Add pointer drag/toss only after settle**

```js
  function stagePoint(event) {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  stage.addEventListener("pointerdown", (event) => {
    if (state !== "settled" || !engine) return;
    const point = stagePoint(event);
    const body = Matter.Query.point(bodies, point).at(-1);
    if (!body) return;
    dragged = body;
    dragPoint = { ...point, time: performance.now(), vx: 0, vy: 0 };
    Matter.Body.setStatic(body, true);
    stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragged) return;
    const point = stagePoint(event);
    const now = performance.now();
    const elapsed = Math.max(16, now - dragPoint.time);
    dragPoint.vx = (point.x - dragPoint.x) / elapsed * 16.667;
    dragPoint.vy = (point.y - dragPoint.y) / elapsed * 16.667;
    dragPoint.x = point.x;
    dragPoint.y = point.y;
    dragPoint.time = now;
    Matter.Body.setPosition(dragged, point);
  });

  const releaseDrag = () => {
    if (!dragged) return;
    Matter.Body.setStatic(dragged, false);
    Matter.Body.setVelocity(dragged, { x: dragPoint.vx, y: dragPoint.vy });
    dragged = undefined;
  };
  stage.addEventListener("pointerup", releaseDrag);
  stage.addEventListener("pointercancel", releaseDrag);
```

- [ ] **Step 6: Initialize the normal, reduced-motion, and error paths**

Finish the IIFE:

```js
  const visibilityObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    finaleVisible = Boolean(entries[0]?.isIntersecting);
    if (finaleVisible && engine && !animationFrame) animationFrame = requestAnimationFrame(stepPhysics);
  }, { rootMargin: "50% 0px", threshold: 0 }) : null;
  visibilityObserver?.observe(story);

  if (reducedMotion.matches) {
    setState("static");
  } else {
    story.classList.add("has-finale-js");
    setState("spiral");
    if ("IntersectionObserver" in window) {
      const runtimeObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0]?.isIntersecting) return;
        loadMatterRuntime().catch(() => {});
        observer.disconnect();
      }, { rootMargin: "100% 0px", threshold: 0 });
      runtimeObserver.observe(story);
    }
    applySpiral(0);
    updateFromScroll();
  }
})();
```

- [ ] **Step 7: Run the static tests**

Run:

```bash
node --test --test-name-pattern="contact finale exposes" tests/v2-portfolio.test.mjs
```

Expected: the finale contract passes.

- [ ] **Step 8: Commit the controller**

```bash
git add v2/contact-finale.js tests/v2-portfolio.test.mjs
git commit -m "feat(v2): add scroll-to-physics contact finale"
```

## Task 7: Add Behavioural Browser QA

**Files:**
- Modify: `scripts/qa-v2.mjs`

- [ ] **Step 1: Add a fine-pointer accommodation wheel test before reduced-motion loops**

Add this block after the initial page load checks:

```js
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.$eval("[data-accommodation-viewer]", (viewer) => viewer.scrollIntoView({ block: "center" }));
await page.waitForFunction(() => {
  const video = document.querySelector("[data-accommodation-scrub]");
  return Number.isFinite(video?.duration) && video.duration > 0;
});
const accommodationBefore = await page.evaluate(() => ({
  scrollY: window.scrollY,
  time: document.querySelector("[data-accommodation-scrub]").currentTime,
  bounds: document.querySelector("[data-accommodation-viewer]").getBoundingClientRect().toJSON(),
}));
await page.mouse.move(
  accommodationBefore.bounds.x + accommodationBefore.bounds.width / 2,
  accommodationBefore.bounds.y + accommodationBefore.bounds.height / 2,
);
await page.mouse.wheel({ deltaY: 520 });
await new Promise((resolve) => setTimeout(resolve, 180));
const accommodationAfter = await page.evaluate(() => ({
  scrollY: window.scrollY,
  time: document.querySelector("[data-accommodation-scrub]").currentTime,
}));
assert.equal(accommodationAfter.scrollY, accommodationBefore.scrollY, "wheel over accommodation must not move the page");
assert.ok(accommodationAfter.time > accommodationBefore.time, "wheel over accommodation must advance the preview");
await page.mouse.move(8, 450);
await page.mouse.wheel({ deltaY: 520 });
await new Promise((resolve) => setTimeout(resolve, 180));
assert.ok(await page.evaluate((before) => window.scrollY > before, accommodationAfter.scrollY), "wheel outside accommodation must move the page");
```

- [ ] **Step 2: Add the continuous portrait pointer test**

```js
await page.$eval("[data-about-scroll-story]", (story) => story.scrollIntoView());
await page.waitForSelector(".portrait-frame.is-loaded");
const portraitGeometry = await page.$eval(".portrait-frame", (frame) => frame.getBoundingClientRect().toJSON());
const portraitFrameHandle = await page.$(".portrait-frame iframe");
const portraitContentFrame = await portraitFrameHandle.contentFrame();
const countBefore = await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0);
await page.mouse.move(40, 300);
await page.mouse.move(portraitGeometry.x + portraitGeometry.width / 2, portraitGeometry.y + portraitGeometry.height / 2, { steps: 8 });
await new Promise((resolve) => setTimeout(resolve, 120));
const countAfter = await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0);
assert.ok(countAfter > countBefore, "portrait must keep receiving parent coordinates over its iframe");
const cursor = await page.$eval(".portrait-frame iframe", (iframe) => getComputedStyle(iframe).pointerEvents);
assert.equal(cursor, "none", "portrait iframe must not create a second pointer surface");
await page.evaluate(() => window.scrollBy(0, 120));
await new Promise((resolve) => setTimeout(resolve, 100));
assert.equal(await portraitContentFrame.evaluate(() => window.__v2PortraitMessageCount || 0), countAfter, "scroll alone must not change the portrait pose");
```

- [ ] **Step 3: Add the deterministic spiral, settle, morph, and drag test**

```js
const finalePosition = await page.$eval("[data-contact-story]", (story) => ({
  top: story.getBoundingClientRect().top + window.scrollY,
  travel: story.offsetHeight - window.innerHeight,
}));
const scrollFinale = (progress) => page.evaluate(({ top, travel, progress }) => window.scrollTo(0, top + travel * progress), { ...finalePosition, progress });
await scrollFinale(.3);
await new Promise((resolve) => setTimeout(resolve, 100));
const transformA = await page.$eval("[data-contact-object]", (item) => item.style.transform);
await scrollFinale(.42);
await scrollFinale(.3);
await new Promise((resolve) => setTimeout(resolve, 100));
assert.equal(await page.$eval("[data-contact-object]", (item) => item.style.transform), transformA, "pre-release spiral must be reversible and deterministic");
await scrollFinale(.6);
await page.waitForFunction(() => document.querySelector("[data-contact-story]")?.dataset.finaleState === "settled", { timeout: 8000 });
assert.ok(await page.$eval("[data-contact-story]", (story) => Number(story.dataset.releaseDelta)) <= .5, "physics bodies must inherit the final spiral positions without a jump");
await new Promise((resolve) => setTimeout(resolve, 1200));
assert.equal(await page.$eval("[data-contact-morph-after]", (node) => node.textContent.trim()), "Let’s build something useful.");
assert.ok(await page.$eval("[data-contact-morph-after]", (node) => Number(getComputedStyle(node).opacity)) > .8, "final text must resolve after settle");
assert.ok(await page.$eval(".contact-actions", (node) => Number(getComputedStyle(node).opacity)) > .8, "contact actions must resolve after the text morph");
const draggable = await page.$eval("[data-contact-object]", (item) => ({ rect: item.getBoundingClientRect().toJSON(), transform: item.style.transform }));
await page.mouse.move(draggable.rect.x + draggable.rect.width / 2, draggable.rect.y + draggable.rect.height / 2);
await page.mouse.down();
await page.mouse.move(draggable.rect.x + draggable.rect.width / 2 + 80, draggable.rect.y + draggable.rect.height / 2 - 40, { steps: 6 });
await page.mouse.up();
await new Promise((resolve) => setTimeout(resolve, 120));
assert.notEqual(await page.$eval("[data-contact-object]", (item) => item.style.transform), draggable.transform, "settled objects must be draggable");
await scrollFinale(1);
await new Promise((resolve) => setTimeout(resolve, 120));
assert.ok(await page.$eval(".site-footer", (footer) => footer.getBoundingClientRect().top < window.innerHeight), "continued scroll must release the sticky finale into the footer");
```

- [ ] **Step 4: Extend the responsive loop with final-state geometry checks**

Inside the `[1440, 1024, 768, 390, 320]` reduced-motion loop, add:

```js
const finaleGeometry = await page.evaluate(() => {
  const stage = document.querySelector("[data-contact-stage]").getBoundingClientRect();
  const heading = document.querySelector("[data-contact-morph-after]").getBoundingClientRect();
  const actions = document.querySelector(".contact-actions").getBoundingClientRect();
  return { stage, heading, actions };
});
assert.ok(finaleGeometry.heading.left >= -1 && finaleGeometry.heading.right <= width + 1, `${width}px finale heading overflows`);
assert.ok(finaleGeometry.actions.left >= -1 && finaleGeometry.actions.right <= width + 1, `${width}px finale actions overflow`);
assert.ok(finaleGeometry.actions.bottom <= finaleGeometry.stage.bottom + 1, `${width}px finale actions fall below the stage`);
```

- [ ] **Step 5: Run the full static suite and browser QA**

Run:

```bash
npm test
node scripts/qa-v2.mjs
```

Expected: all Node tests pass; browser QA exits `0` with no overflow, scrub, portrait, finale, or workflow regressions.

- [ ] **Step 6: Commit browser QA**

```bash
git add scripts/qa-v2.mjs
git commit -m "test(v2): verify interactive finale and input ownership"
```

## Task 8: Visual Assessment and Final Polish

**Files:**
- Create screenshots under a temporary ignored directory only.

- [ ] **Step 1: Capture the required widths and finale phases**

Run:

```bash
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-finale-qa node scripts/qa-v2.mjs
```

Expected: screenshots for `1440`, `1024`, `768`, `390`, and `320` plus the existing workflow states are written under `/tmp/portfolio-v2-finale-qa`.

- [ ] **Step 2: Inspect the desktop and mobile contact states**

Open the `1440`, `768`, and `390` captures and verify:

- the yellow finale has intentional negative space rather than a uniform object cloud;
- the final headline and actions are never covered;
- the portrait, laptop, browser, and workflow objects remain identifiable;
- the mobile object count is reduced;
- no object is clipped in a way that looks accidental.

- [ ] **Step 3: Re-run both verification commands after visual inspection**

Run:

```bash
npm test
node scripts/qa-v2.mjs
```

Expected: both commands exit `0`.

## Task 9: Update V2 Source-truth Documentation and Prove Isolation

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Add the interaction ownership contract to `AGENTS.md`**

Add:

```markdown
### V2 interaction ownership

- Boutique Accommodation owns pointer-wheel input only while a fine pointer is over its preview; keyboard, touch, and reduced-motion paths remain document-native.
- The parent About sticky stage is the sole owner of portrait pointer coordinates. The embedded portrait renders validated `postMessage` coordinates and must not install a competing pointer tracker.
- The contact finale is a one-way state machine: scroll-driven spiral → Matter.js release → settled/draggable → final text morph. Physics never reverses when the visitor scrolls upward.
- Matter.js is pinned and vendored under `v2/vendor/` so `/v2/index.html` continues to work from `file://`.
```

- [ ] **Step 2: Add the finale and motion rules to `DESIGN.md`**

Add:

```markdown
### Contact finale

The V2 contact chapter is a yellow full-viewport scroll story built from real portfolio objects. Before release, an Archimedean spiral is deterministic and driven only by scroll progress. At the release threshold, the exact DOM transforms become Matter.js body positions; physics then proceeds one way and does not rewind on upward scroll. After the bodies settle, `Systematise.` morphs once into `Let’s build something useful.` and the contact actions resolve.

Desktop uses the full object set, tablet removes the least legible objects, and mobile uses no more than seven. Reduced motion and JavaScript/physics failure render the same final phrase and a static settled collage. The finale does not introduce a new colour system: it extends the established ochre-yellow Bias to Build accent and uses existing browser, laptop, paper, portrait, and workflow treatments.
```

- [ ] **Step 3: Update `docs/portfolio-working-notes.md` with implementation truth**

Add:

```markdown
## July 15 V2 interaction pass

- Boutique Accommodation uses `assets/videos/accommodation/showcase-scroll.webm` with MP4 fallback. On fine-pointer desktops, wheel input is captured only while the pointer is over the browser and scrubs the stitched overview/treehouse/cabin recording; keyboard, touch, reduced-motion, and pointer-outside paths keep document scrolling native.
- The About sticky stage is the sole portrait coordinate owner. `v2/portrait/embed.html` accepts validated `portfolio-portrait-pointer` messages and does not install its own embedded pointer tracker.
- The contact finale uses the existing portrait poster, RCCV laptop, accommodation frame, Cool Runnings screen, public proposal page, Why Elevators screen, content workflow, dashboard, publishing workflow, prospecting workflow, and image-to-website output.
- Matter.js `0.20.0` is pinned in dependency metadata and vendored at `v2/vendor/matter.min.js` for the `file://` assessment route.
- The finale's fallback is semantic HTML plus a static settled CSS composition; reduced motion does not run wheel capture, spiral travel, falling physics, or text morph animation.
- Verification: `npm test` and `node scripts/qa-v2.mjs`; assessed at `1440`, `1024`, `768`, `390`, and `320` pixels wide.
```

- [ ] **Step 4: Prove V1 implementation isolation**

Run:

```bash
git diff --name-only 4576252..HEAD
```

Expected: changes are limited to V2, V2 tests/QA, dependency metadata, and portfolio documentation. Root V1 `index.html`, `styles.css`, `app.js`, proposal-generation code, and V1 workflow routes are absent.

- [ ] **Step 5: Run final verification**

Run:

```bash
git diff --check
npm test
node scripts/qa-v2.mjs
```

Expected: no whitespace errors; all tests pass; browser QA exits `0`.

- [ ] **Step 6: Commit documentation**

```bash
git add AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "docs(v2): record interactive finale source truth"
```

## Final Assessment Gate

After Task 9, place the `1440`, `768`, and `390` screenshots directly in chat and report:

- the final static-test count;
- browser QA status;
- the V1-isolation file list;
- any evidence-driven differences from this plan;
- the exact local V2 route for assessment.

Do not deploy, redirect V1, or extend the finale pattern into workflow pages without separate approval.
