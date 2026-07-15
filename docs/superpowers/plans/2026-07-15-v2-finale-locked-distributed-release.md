# V2 Finale Locked Distributed Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hold the contact finale in view during its entrance, retain 70% object scale, and release objects from a distributed central band.

**Architecture:** Keep the isolated `v2/contact-finale.js` runtime and existing Matter.js handoff. Add a small reversible body-lock lifecycle around the entrance, then change only the terminal spiral pose so the physics bodies inherit larger, horizontally distributed starting positions.

**Tech Stack:** Vanilla JavaScript, CSS, Matter.js, Node test runner, Playwright browser QA.

---

### Task 1: Define the new runtime contract

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`
- Modify: `scripts/qa-v2.mjs`

- [ ] Add static assertions for `centreScale = .7`, `lockViewport`, `unlockViewport`, and a responsive distributed release span.
- [ ] Replace the exact-centre browser assertions with checks for a bounded central spread, stable 70% scale, active entrance lock, and restored scrolling at physics release.
- [ ] Run `node --test tests/v2-portfolio.test.mjs` and confirm it fails because the current runtime still uses 55% convergence and has no viewport lock.

### Task 2: Implement the locked distributed release

**Files:**
- Modify: `v2/contact-finale.js`

- [ ] Add reversible viewport-lock helpers that align the stage, preserve body styles and the scrollbar gutter, and restore the page at entrance completion.
- [ ] Call the lock when the entrance starts and release it immediately before the Matter.js handoff.
- [ ] Raise the terminal scale to 70%.
- [ ] Replace the near-zero centre offsets with a responsive horizontal release span and small deterministic vertical offsets that activate only near the spiral endpoint.
- [ ] Run `node --test tests/v2-portfolio.test.mjs` and confirm the contract passes.

### Task 3: Verify the real motion and document it

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] Run `QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-locked-release node scripts/qa-v2.mjs` and confirm desktop/mobile overflow, lock, spiral, release, fall, and drag checks pass.
- [ ] Inspect the mid-spiral and settled desktop captures plus the 390px finale crop.
- [ ] Update the three V2 context documents with the temporary viewport lock, 70% attenuation, and distributed release contract.
- [ ] Run `npm test`, `git diff --check`, and a V1-isolation diff before completion.
