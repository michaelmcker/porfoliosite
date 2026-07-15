# V2 Rounded-Orbit Finale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the V2 contact finale into a smooth full-frame rounded orbit, physics drop, early adaptive copy reveal, pinned manual placement, and head-visible portrait.

**Architecture:** Keep the isolated `v2/contact-finale.js` controller and locally vendored Matter.js runtime. Replace the current radius-based spiral pose with a normalized piecewise curved orbit evaluated from stage dimensions, retain exact pose transfer into physics, and make post-settle drag releases static. Use a layered portrait inside the existing contact object and CSS state classes for early copy and overlap contrast.

**Tech Stack:** Semantic HTML, CSS transforms and opacity, vanilla JavaScript, Matter.js 0.20.0, Node test runner, Puppeteer browser QA.

---

## File Map

- `tests/v2-portfolio.test.mjs`: static contracts for rounded path, pinned release, adaptive copy, and portrait head layer.
- `scripts/qa-v2.mjs`: behavioral proof for orbit quadrants, early copy, adaptive contrast, pinned placement, fallbacks, and responsive geometry.
- `v2/index.html`: layered head-visible contact portrait markup.
- `v2/styles.css`: portrait layering, early-copy states, adaptive heading contrast, and responsive fallback treatment.
- `v2/contact-finale.js`: normalized orbit interpolation, release timing, overlap detection, and pinned manual placement.
- `AGENTS.md`, `DESIGN.md`, `docs/portfolio-working-notes.md`: revised V2 interaction source truth.

### Task 1: Define the New Finale Contracts

**Files:**
- Modify: `tests/v2-portfolio.test.mjs:218-244`
- Modify: `scripts/qa-v2.mjs:311-380`

- [ ] **Step 1: Write failing static contracts**

Extend the contact-finale test with exact markers:

```js
assert.match(html, /data-contact-portrait-body/);
assert.match(html, /data-contact-portrait-head/);
assert.match(html, /riverflow-registered\/pose-r06-c03\.webp/);
assert.match(finale, /function roundedOrbitPose/);
assert.match(finale, /function evaluateOrbitSegment/);
assert.match(finale, /function updateCopyContrast/);
assert.match(finale, /dataset\.copyState/);
assert.match(finale, /Body\.setStatic\(dragged, true\)/);
assert.match(finale, /Body\.setAngularVelocity\(dragged, 0\)/);
assert.doesNotMatch(finale, /Body\.setVelocity\(dragged, \{ x: dragPoint\.vx, y: dragPoint\.vy \}\)/);
```

- [ ] **Step 2: Add failing behavioral assertions**

Before release, scroll through normalized progress samples and assert that the first object's centre visits the required regions in order:

```js
const orbitSamples = [];
for (const progress of [.09, .22, .36, .50, .61]) {
  await scrollFinale(progress);
  await page.waitForFunction((expected) => (
    Math.abs(Number(document.querySelector("[data-contact-story]").dataset.orbitProgress) - expected) < .03
  ), {}, progress / .68);
  orbitSamples.push(await page.$eval("[data-contact-object]", (item) => {
    const rect = item.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }));
}
assert.ok(orbitSamples[1].x < innerWidth * .25 && orbitSamples[1].y > innerHeight * .5);
assert.ok(orbitSamples[2].x > innerWidth * .45 && orbitSamples[2].y > innerHeight * .55);
assert.ok(orbitSamples[3].x > innerWidth * .7 && orbitSamples[3].y < innerHeight * .35);
assert.ok(orbitSamples[4].x > innerWidth * .35 && orbitSamples[4].x < innerWidth * .65);
```

After dragging, save the released centre, wait 700ms, and assert it remains within one pixel. Assert the copy becomes visible before `data-finale-state="settled"`, the contrast class appears when a body overlaps the heading, and both portrait layers load.

- [ ] **Step 3: Run the targeted test and confirm RED**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
```

Expected: FAIL because the layered head markup, rounded path helpers, pinned release, and adaptive copy state do not exist.

- [ ] **Step 4: Commit the failing contracts**

```bash
git add tests/v2-portfolio.test.mjs scripts/qa-v2.mjs
git commit -m "test(v2): define rounded orbit finale behavior"
```

### Task 2: Add the Head-Visible Portrait and Copy States

**Files:**
- Modify: `v2/index.html:347`
- Modify: `v2/styles.css:825-910`

- [ ] **Step 1: Replace the headless single image with two presentation layers**

Use the existing portrait body and approved head pose:

```html
<figure class="contact-object contact-object-portrait" data-contact-object="portrait" data-body-width="174">
  <img class="contact-portrait-body" data-contact-portrait-body src="../assets/portrait/poster.png" alt="" loading="lazy" decoding="async">
  <img class="contact-portrait-head" data-contact-portrait-head src="../assets/portrait-final/assets/poses-webp/riverflow-registered/pose-r06-c03.webp" alt="" loading="lazy" decoding="async">
</figure>
```

- [ ] **Step 2: Layer the head and add explicit copy states**

Add CSS that keeps both portrait layers inside one physics card and provides stable whole-heading contrast:

```css
.contact-object-portrait { position: absolute; }
.contact-object-portrait .contact-portrait-body { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.contact-object-portrait .contact-portrait-head { position: absolute; z-index: 2; top: 7%; left: 29%; width: 49%; height: auto; object-fit: contain; }
.contact-story[data-copy-state="visible"] .contact-morph { opacity: 1; }
.contact-story[data-copy-state="visible"] [data-contact-morph-before] { animation: contact-morph-out 480ms both; }
.contact-story[data-copy-state="visible"] [data-contact-morph-after] { animation: contact-morph-in 620ms 120ms both; }
.contact-story[data-copy-state="visible"] .contact-actions,
.contact-story[data-copy-state="visible"] .contact-continue { opacity: 1; transform: none; transition-delay: 520ms; }
.contact-resolution.is-contrast-light .contact-morph { color: #fff; text-shadow: 0 3px 18px rgba(23,24,19,.82); }
```

Keep reduced-motion output visible without relying on JavaScript state.

- [ ] **Step 3: Run the targeted test**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
```

Expected: still FAIL only on missing controller behavior.

- [ ] **Step 4: Commit markup and styles**

```bash
git add v2/index.html v2/styles.css
git commit -m "feat(v2): add head-visible finale portrait"
```

### Task 3: Implement the Responsive Rounded Orbit and Early Copy

**Files:**
- Modify: `v2/contact-finale.js:45-145`

- [ ] **Step 1: Replace the radial spiral with normalized curved segments**

Define stage-relative control points and smooth interpolation:

```js
const orbitPoints = [
  [-.14, .12], [.08, .08], [.04, .62], [.5, .72],
  [.92, .58], [.9, .1], [.5, .06],
];

function evaluateOrbitSegment(start, end, amount, width, height) {
  const eased = smooth(amount);
  return {
    x: lerp(start[0], end[0], eased) * width,
    y: lerp(start[1], end[1], eased) * height,
  };
}

function roundedOrbitPose(index, count, progress, width, height) {
  const delayed = clamp(progress * 1.08 - index * .018);
  const scaled = delayed * (orbitPoints.length - 1);
  const segment = Math.min(orbitPoints.length - 2, Math.floor(scaled));
  const point = evaluateOrbitSegment(
    orbitPoints[segment], orbitPoints[segment + 1], scaled - segment, width, height,
  );
  const next = evaluateOrbitSegment(
    orbitPoints[segment], orbitPoints[segment + 1], Math.min(1, scaled - segment + .02), width, height,
  );
  return {
    x: point.x,
    y: point.y,
    angle: Math.atan2(next.y - point.y, next.x - point.x) * .12,
    scale: lerp(.68, 1, smooth(clamp(delayed * 1.8))),
    opacity: clamp(delayed * 2.2),
  };
}
```

Set `story.dataset.orbitProgress` during scroll and release at normalized page progress `.68` after the full orbit reaches the upper middle.

- [ ] **Step 2: Start copy during physics release**

Add a single timer owned by `releaseToPhysics()`:

```js
let copyTimer;

function revealCopy() {
  story.dataset.copyState = "visible";
}

function scheduleCopyReveal() {
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(revealCopy, 420);
}
```

Call `scheduleCopyReveal()` immediately after `setState("physics")` in `releaseToPhysics()`. Call `revealCopy()` synchronously in `showStaticFallback()` so failure never hides contact content.

- [ ] **Step 3: Add adaptive whole-heading contrast**

Calculate overlap against the resolved heading and toggle one class:

```js
function updateCopyContrast() {
  const heading = stage.querySelector("[data-contact-morph-after]").getBoundingClientRect();
  const headingArea = Math.max(1, heading.width * heading.height);
  const overlap = visibleItems().reduce((total, item) => {
    const rect = item.getBoundingClientRect();
    const width = Math.max(0, Math.min(rect.right, heading.right) - Math.max(rect.left, heading.left));
    const height = Math.max(0, Math.min(rect.bottom, heading.bottom) - Math.max(rect.top, heading.top));
    return total + width * height;
  }, 0);
  stage.querySelector("[data-contact-resolution]")
    .classList.toggle("is-contrast-light", overlap / headingArea >= .08);
}
```

Call it from the physics animation frame and after pointer placement.

- [ ] **Step 4: Run the targeted test and full static suite**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
npm test
```

Expected: targeted and full static suites PASS.

- [ ] **Step 5: Commit the rounded orbit**

```bash
git add v2/contact-finale.js
git commit -m "feat(v2): add full-frame rounded finale orbit"
```

### Task 4: Pin Objects After Manual Placement

**Files:**
- Modify: `v2/contact-finale.js:220-290`

- [ ] **Step 1: Change drag release from throw to pin**

Replace velocity restoration with static placement:

```js
function releaseDrag() {
  if (!dragged) return;
  Matter.Body.setVelocity(dragged, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(dragged, 0);
  Matter.Body.setStatic(dragged, true);
  dragged.plugin.pinned = true;
  dragged = undefined;
  stage.classList.remove("is-dragging");
  updateCopyContrast();
}
```

On pointerdown, permit a previously pinned body to move while remaining static. Do not set it dynamic on release.

- [ ] **Step 2: Run the complete browser QA**

Run:

```bash
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-rounded-orbit node scripts/qa-v2.mjs
```

Expected: PASS, including the 700ms pinned-position assertion, early copy, contrast, quadrants, responsive overflow, and local-file checks.

- [ ] **Step 3: Inspect desktop and mobile finale captures**

Inspect:

```text
/tmp/portfolio-v2-rounded-orbit/finale-settled-desktop.png
/tmp/portfolio-v2-rounded-orbit/v2-390.png
```

Confirm the head is visible, the heading and buttons do not overlap, and the dropped objects remain legible.

- [ ] **Step 4: Commit pinned placement and QA**

```bash
git add v2/contact-finale.js scripts/qa-v2.mjs tests/v2-portfolio.test.mjs
git commit -m "fix(v2): pin manually placed finale objects"
```

### Task 5: Update Source Truth and Prove Isolation

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Replace the old finale contract**

Document the approved rounded full-frame orbit, `.68` release threshold, early copy state, overlap contrast, initial-only physics, pinned manual placement, and head-visible layered portrait. Preserve the reduced-motion, local-file, and V1-isolation rules.

- [ ] **Step 2: Run final verification**

Run:

```bash
git diff --check
npm test
node scripts/render-v2-presentation.mjs
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-rounded-orbit node scripts/qa-v2.mjs
git diff --name-only e1281e1..HEAD
```

Expected: no whitespace errors; 48 or more static tests pass; both publishing PNG dimensions remain exact; browser QA passes; changed production files remain inside V2; root `index.html`, `styles.css`, and `app.js` are absent.

- [ ] **Step 3: Commit documentation**

```bash
git add AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "docs(v2): record rounded orbit finale contract"
```
