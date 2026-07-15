# V2 Viewport-Triggered Physics Finale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the contact finale’s scroll-controlled and pinned-drag behavior with a once-only viewport-triggered entrance and OriginKit-style dynamic Matter.js dragging.

**Architecture:** `v2/contact-finale.js` remains the isolated runtime owner. An intersection observer starts a time-based 1,800ms entrance, the existing curve supplies each rendered pose with a wider per-object phase offset, and the last pose transfers into dynamic Matter.js bodies. A temporary Matter constraint follows the pointer while held and is removed on release so velocity, angular motion, collisions, and gravity remain natural.

**Tech Stack:** Plain JavaScript, CSS, vendored Matter.js, Node test runner, Puppeteer browser QA.

---

## File Map

- `tests/v2-portfolio.test.mjs`: static contracts for viewport triggering, elapsed-time entrance, dynamic constraint dragging, and removal of scroll/pinning logic.
- `v2/contact-finale.js`: once-only entrance state machine, Matter body creation, constraint-based pointer interaction, reduced-motion and failure fallback.
- `v2/styles.css`: 100svh non-scroll finale height and updated entrance instruction treatment.
- `v2/index.html`: non-scroll instruction copy.
- `scripts/qa-v2.mjs`: runtime checks for idle-before-intersection, autonomous progress, one-shot trigger, spacing, no-jump release, and post-drag movement.
- `AGENTS.md`, `DESIGN.md`, `docs/portfolio-working-notes.md`: replace the superseded scroll-orbit and pinned-drag contracts.

### Task 1: Define the New Finale Contract

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Write the failing static contract**

Replace the finale assertions that require scroll progress and static pinning with assertions requiring an observer threshold, elapsed-time entrance, a Matter constraint, and dynamic release:

```js
assert.match(finale, /const entranceDuration = 1800/);
assert.match(finale, /threshold:\s*\.4/);
assert.match(finale, /function startEntrance/);
assert.match(finale, /requestAnimationFrame\(stepEntrance\)/);
assert.match(finale, /Constraint\.create/);
assert.match(finale, /pointB:/);
assert.match(finale, /Composite\.remove\(engine\.world, dragConstraint\)/);
assert.doesNotMatch(finale, /updateFromScroll|requestScrollUpdate/);
assert.doesNotMatch(finale, /Body\.setStatic\(dragged, true\)/);
assert.doesNotMatch(finale, /plugin\.pinned/);
assert.doesNotMatch(finale, /dataset\.orbitProgress/);
assert.doesNotMatch(css, /\.contact-story\.has-finale-js\s*\{[^}]*min-height:\s*340svh/s);
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
```

Expected: FAIL because `contact-finale.js` still exposes scroll progress, pins dragged bodies, and has no dynamic drag constraint.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/v2-portfolio.test.mjs
git commit -m "test(v2): define viewport-triggered finale physics"
```

### Task 2: Implement the Automatic Entrance

**Files:**
- Modify: `v2/contact-finale.js`
- Modify: `v2/styles.css`
- Modify: `v2/index.html`

- [ ] **Step 1: Replace scroll state with entrance timing state**

Use one elapsed-time animation with an exact duration and a once-only guard:

```js
let entranceFrame;
let entranceStart = 0;
let entranceStarted = false;
const entranceDuration = 1800;

function startEntrance() {
  if (entranceStarted || reducedMotion.matches) return;
  entranceStarted = true;
  setState("entrance");
  entranceStart = performance.now();
  entranceFrame = requestAnimationFrame(stepEntrance);
}

function stepEntrance(timestamp) {
  const progress = clamp((timestamp - entranceStart) / entranceDuration);
  story.dataset.entranceProgress = progress.toFixed(4);
  applyOrbit(progress);
  if (progress < 1) {
    entranceFrame = requestAnimationFrame(stepEntrance);
    return;
  }
  entranceFrame = undefined;
  releaseToPhysics();
}
```

- [ ] **Step 2: Widen the per-object spacing**

Make each object follow a distinct phase on the same broad path instead of nearly overlapping:

```js
const phaseGap = width < 640 ? .052 : .072;
const itemProgress = clamp(progress * (1 + phaseGap * (count - 1)) - index * phaseGap);
```

Keep body scale and opacity tied to each object’s own `itemProgress`, so later objects enter visibly rather than popping into the release position.

- [ ] **Step 3: Trigger once at 40% visibility**

Use the stage as the observed target and disconnect immediately after starting:

```js
const entranceObserver = new IntersectionObserver((entries, observer) => {
  if (!entries[0]?.isIntersecting) return;
  observer.disconnect();
  startEntrance();
}, { threshold: .4 });
entranceObserver.observe(stage);
```

If `IntersectionObserver` is unavailable, call `startEntrance()` after initialization. Keep the separate visibility observer that pauses and resumes Matter animation work when the finale is offscreen.

- [ ] **Step 4: Remove the artificial scroll chapter**

Change:

```css
.contact-story.has-finale-js { min-height: 100svh; }
.contact-stage { position: relative; }
```

Change the instruction in `v2/index.html` to:

```html
<p class="contact-instruction" data-contact-instruction>The work is gathering.</p>
```

Remove the finale’s `scroll` listener and the scroll-derived `--finale-progress` updates.

- [ ] **Step 5: Run the targeted test and verify the entrance contract passes**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
```

Expected: PASS.

### Task 3: Restore Reference-Style Dynamic Dragging

**Files:**
- Modify: `v2/contact-finale.js`

- [ ] **Step 1: Create a dynamic point constraint on pointer down**

Keep the selected body dynamic and attach it through a high-stiffness constraint:

```js
dragged = body;
dragConstraint = Matter.Constraint.create({
  bodyA: body,
  pointB: point,
  stiffness: .92,
  damping: .12,
  angularStiffness: 0,
  render: { visible: false },
});
Matter.Composite.add(engine.world, dragConstraint);
Matter.Sleeping.set(body, false);
```

- [ ] **Step 2: Move the constraint anchor with the pointer**

```js
dragConstraint.pointB.x = point.x;
dragConstraint.pointB.y = point.y;
Matter.Sleeping.set(dragged, false);
```

Do not set body position, velocity, angle, or static state directly during the drag.

- [ ] **Step 3: Release into natural body motion**

```js
function releaseDrag() {
  if (!dragConstraint) return;
  Matter.Composite.remove(engine.world, dragConstraint);
  dragConstraint = undefined;
  dragged = undefined;
  stage.classList.remove("is-dragging");
  updateCopyContrast();
}
```

Do not zero velocity or angular velocity. Keep pointer capture and link exclusions.

- [ ] **Step 4: Run targeted and full unit tests**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
npm test
```

Expected: targeted finale test PASS; full suite PASS with 48 tests or the new current total.

- [ ] **Step 5: Commit the runtime implementation**

```bash
git add v2/contact-finale.js v2/styles.css v2/index.html tests/v2-portfolio.test.mjs
git commit -m "feat(v2): trigger finale physics on entry"
```

### Task 4: Prove Runtime Timing and Physics

**Files:**
- Modify: `scripts/qa-v2.mjs`

- [ ] **Step 1: Replace scroll sampling with visibility and elapsed-time checks**

The browser QA must position the finale just below the viewport, verify `data-finale-state="idle"`, bring 40% of the stage into view, and then verify `data-entrance-progress` advances while `window.scrollY` remains unchanged:

```js
const scrollAtTrigger = await page.evaluate(() => window.scrollY);
await page.waitForFunction(() => Number(document.querySelector("[data-contact-story]")?.dataset.entranceProgress) > .2);
assert.equal(await page.evaluate(() => window.scrollY), scrollAtTrigger);
```

Sample all visible object centres near mid-entrance and require at least 70px desktop or 30px mobile between neighbouring centres.

- [ ] **Step 2: Verify one-shot behavior**

After physics starts, scroll the stage out of view and back. Assert the stored entrance-start count remains `1` and the state does not return to `entrance`.

- [ ] **Step 3: Verify a released drag remains dynamic**

Drag a topmost object laterally with multiple pointer steps, release it, capture its centre and angle, wait 500ms, and require either position movement greater than 3px or angular change greater than `.015` radians. Assert the object remains within stage boundaries.

- [ ] **Step 4: Run full browser QA with captures**

Run:

```bash
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-entry-physics node scripts/qa-v2.mjs
```

Expected: PASS for homepage interactions, five workflow routes, local-search case study, responsive overflow, automatic finale timing, and dynamic dragging.

- [ ] **Step 5: Commit QA coverage**

```bash
git add scripts/qa-v2.mjs
git commit -m "test(v2): verify automatic finale physics"
```

### Task 5: Update Documentation and Verify Isolation

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Replace superseded contracts**

Document the 40%-visible once-only trigger, 1,800ms autonomous entrance, wider phase spacing, dynamic point-constraint dragging, preserved release momentum, all four boundaries, and reduced-motion fallback. Remove claims that the finale is scroll-controlled or that dragged objects pin in place.

- [ ] **Step 2: Run fresh verification**

```bash
git diff --check
npm test
node scripts/render-v2-presentation.mjs
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-entry-physics-final node scripts/qa-v2.mjs
```

Expected: all commands exit `0`; presentation PNGs remain 1800×1100 and 900×1600; browser QA passes.

- [ ] **Step 3: Prove V1 isolation**

```bash
git diff --name-only e881297..HEAD
```

Expected: only V2 files, V2 tests/QA, and V2 documentation appear; root V1 `index.html`, `styles.css`, and `app.js` do not appear.

- [ ] **Step 4: Commit documentation**

```bash
git add AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "docs(v2): record entry-triggered finale physics"
```
