# V2 Two-Turn Spiral Drop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 1.8-second broad orbit with a 4.8-second, two-turn, shrinking Archimedean spiral that releases into gravity at the centre.

**Architecture:** `v2/contact-finale.js` keeps the existing in-view trigger and Matter.js interaction. A normalized Archimedean spiral owns position, tangent rotation, phase spacing, and scale; the final scale is preserved in both the Matter body dimensions and DOM rendering so the centre-to-drop handoff cannot jump.

**Tech Stack:** Plain JavaScript, vendored Matter.js, Node test runner, Puppeteer browser QA.

---

### Task 1: Define the Spiral Contract

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Write the failing assertions**

```js
assert.match(finale, /const entranceDuration = 4800/);
assert.match(finale, /const spiralTurns = 2/);
assert.match(finale, /const centreScale = \.55/);
assert.match(finale, /function spiralPose/);
assert.match(finale, /function buildArcLengthLookup/);
assert.match(finale, /dataset\.poseScale/);
assert.match(finale, /plugin\.renderScale/);
assert.match(finale, /scale\(\$\{body\.plugin\.renderScale\}\)/);
assert.doesNotMatch(finale, /function roundedOrbitPose/);
```

- [ ] **Step 2: Verify RED**

Run:

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
```

Expected: FAIL because the runtime still has a 1,800ms `roundedOrbitPose` entrance.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/v2-portfolio.test.mjs
git commit -m "test(v2): define two-turn spiral drop"
```

### Task 2: Implement the Archimedean Spiral and Scaled Handoff

**Files:**
- Modify: `v2/contact-finale.js`

- [ ] **Step 1: Add exact motion constants**

```js
const entranceDuration = 4800;
const spiralTurns = 2;
const centreScale = .55;
const spiralStartAngle = -Math.PI * .75;
```

- [ ] **Step 2: Build equal arc-length mapping**

Create a 240-sample normalized lookup and interpolate the spiral parameter for a requested travelled distance:

```js
function buildArcLengthLookup() {
  const samples = 240;
  const lookup = [{ n: 0, length: 0 }];
  let total = 0;
  let previous = { x: 1, y: 0 };
  for (let index = 1; index <= samples; index += 1) {
    const n = index / samples;
    const angle = n * spiralTurns * Math.PI * 2;
    const radius = 1 - n;
    const point = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    lookup.push({ n, length: total });
    previous = point;
  }
  lookup.forEach((entry) => { entry.length /= total; });
  return lookup;
}
```

`arcLengthToParameter(progress)` finds the surrounding entries and linearly interpolates their `n` values.

- [ ] **Step 3: Replace the old orbit pose**

Use phase-spaced path progress, tangent-aligned rotation, diagonal radius, and 55% centre scale:

```js
function spiralPose(index, count, progress, width, height) {
  const phaseGap = width < 640 ? .035 : .045;
  const stream = clamp(progress * (1 + phaseGap * (count - 1)) - index * phaseGap);
  const n = arcLengthToParameter(stream);
  const angle = spiralStartAngle + n * spiralTurns * Math.PI * 2;
  const radius = Math.hypot(width, height) * .58 * (1 - n);
  const x = width * .5 + Math.cos(angle) * radius;
  const y = height * .46 + Math.sin(angle) * radius;
  const nextN = Math.min(1, n + .001);
  const nextAngle = spiralStartAngle + nextN * spiralTurns * Math.PI * 2;
  const nextRadius = Math.hypot(width, height) * .58 * (1 - nextN);
  return {
    x,
    y,
    angle: Math.atan2(
      height * .46 + Math.sin(nextAngle) * nextRadius - y,
      width * .5 + Math.cos(nextAngle) * nextRadius - x,
    ),
    scale: lerp(1, centreScale, n),
    opacity: clamp(stream * 8),
  };
}
```

- [ ] **Step 4: Preserve scale through Matter.js**

Store `pose.scale` in `data-pose-scale`. Create each body using `item.offsetWidth * scale` and `item.offsetHeight * scale`, set `body.plugin.renderScale = scale`, and append `scale(${body.plugin.renderScale})` to every physics transform.

- [ ] **Step 5: Run targeted and full tests**

```bash
node --test --test-name-pattern="contact finale" tests/v2-portfolio.test.mjs
npm test
```

Expected: targeted finale test PASS and full suite PASS.

- [ ] **Step 6: Commit the runtime**

```bash
git add v2/contact-finale.js tests/v2-portfolio.test.mjs
git commit -m "feat(v2): spiral finale into centre drop"
```

### Task 3: Verify Runtime Motion

**Files:**
- Modify: `scripts/qa-v2.mjs`

- [ ] **Step 1: Add mid-path and centre assertions**

At entrance progress `0.45–0.6`, assert the first visible object has travelled through more than 360 degrees relative to the stage centre. Before physics, assert all visible objects have `data-pose-scale` between `.54` and `.57`, and their centres fall within 80px desktop or 44px mobile of the stage centre.

- [ ] **Step 2: Assert no size jump**

Record one object’s rendered width at entrance completion and within the first physics frames. Require the difference to remain below 2px while retaining the existing position-delta check.

- [ ] **Step 3: Run browser QA**

```bash
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-two-turn-spiral node scripts/qa-v2.mjs
```

Expected: PASS for automatic timing, two-turn motion, centre release, scaled physics, dynamic dragging, all routes, and responsive overflow.

- [ ] **Step 4: Commit QA**

```bash
git add scripts/qa-v2.mjs
git commit -m "test(v2): verify centre spiral drop"
```

### Task 4: Update Contracts and Run Final Verification

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Replace the broad-curve description**

Document the 4,800ms duration, exactly two Archimedean turns, equal arc-length motion, tangent rotation, full-size-to-55% attenuation, central drop, and scaled Matter handoff.

- [ ] **Step 2: Verify everything fresh**

```bash
git diff --check
npm test
node scripts/render-v2-presentation.mjs
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-two-turn-spiral-final node scripts/qa-v2.mjs
git diff --name-only 82c1124..HEAD
```

Expected: all commands exit `0`, V1 files do not appear, and responsive captures show the completed finale.

- [ ] **Step 3: Commit documentation**

```bash
git add AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "docs(v2): record two-turn spiral finale"
```
