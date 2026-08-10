# Desktop Workflow Folder Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing desktop workflow accordion as five discrete shaped folder tabs in one fixed right-hand column whose loose paper cards retract and slide left into view, without changing mobile.

**Architecture:** Preserve the existing HTML, ARIA wiring, workflow assets, and mobile media-query implementation. On desktop, replace the moving flex geometry with full-size overlaid items, five permanent discrete trigger slots down the right, and an independently positioned paper panel to the left. Use the existing two-phase retract/enter state machine in `activateWorkflow()`. Promote canonical V2 files to root only after focused tests pass.

**Tech Stack:** Static HTML, CSS custom properties and media queries, vanilla JavaScript, Node test runner, Puppeteer browser QA.

---

### Task 1: Lock the desktop folder-spine and paper-card contract

**Files:**
- Modify: `tests/v2-visual-system-refinement.test.mjs`
- Modify: `tests/v2-portfolio.test.mjs`

- [x] **Step 1: Replace the obsolete horizontal-label assertions**

Assert that the desktop block contains `writing-mode: vertical-rl`, hides the desktop plus mark, gives `.workflow-panel-inner` a paper background and shadow, and resets the label direction inside `@media (max-width: 1099px)`.

- [x] **Step 2: Add motion-state assertions**

Assert that `v2/app.js` uses `is-retracting`, `is-entering`, `data-workflow-phase`, a desktop-only retract delay, and the existing reduced-motion bypass.

- [x] **Step 3: Run the focused tests RED**

Run:

```bash
node --test tests/v2-visual-system-refinement.test.mjs tests/v2-portfolio.test.mjs
```

Expected: failures for the missing vertical-spine styling and two-phase card states.

### Task 2: Implement desktop-only top folder tabs and sliding paper cards

**Files:**
- Modify: `v2/styles.css`
- Modify: `v2/app.js`

- [x] **Step 1: Add the desktop-only tab geometry**

Inside `@media (min-width: 1100px)`, keep the accordion horizontal, set narrow graphite tab widths, rotate labels with `writing-mode: vertical-rl`, hide plus marks, and use restrained depth/hover states. Do not alter the `max-width: 1099px` layout beyond resetting inherited label properties.

- [x] **Step 2: Make the active panel one loose paper card**

Give `.workflow-panel-inner` the existing paper-grey surface, ink text, a controlled radius, and one soft shadow. Remove nested holder styling by keeping the panel background transparent and using the workflow figure only as the artwork field.

- [x] **Step 3: Stage retract and enter motion**

Update `activateWorkflow()` so desktop non-reduced-motion selection first adds `is-retracting` to the current item for 200ms, then commits ARIA and active state, adds `is-entering` to the new item, and removes it on the next double animation frame. Clear all transient classes and the phase attribute after 760ms. Mobile and reduced-motion paths commit immediately.

- [x] **Step 4: Run focused tests GREEN**

Run the Task 1 command and expect zero failures.

### Task 3: Promote, visually verify, and document

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`
- Generated: `index.html`
- Generated: `styles.css`
- Generated: `app.js`

- [x] **Step 1: Update source truth**

Replace the obsolete raised horizontal-label folder-sheet contract with the approved desktop vertical-spine, loose paper-card, retract-then-slide-left contract. Explicitly preserve the existing mobile accordion.

- [x] **Step 2: Promote V2**

Run `npm run promote:v2`.

- [x] **Step 3: Run complete verification**

Run:

```bash
npm test
node scripts/qa-v2.mjs
node tests/qa-v2-home-breakpoints.mjs
git diff --check
```

Expected: all tests pass; browser QA passes at 1440, 1024, 768, 390, and 320px; mobile behavior remains unchanged.

- [x] **Step 4: Refresh the visible local preview**

Reload `http://127.0.0.1:8877/?folder-preview=local#workflows` in the in-app browser and leave it open for review.

- [x] **Step 5: Commit the verified implementation**

```bash
git add v2/styles.css v2/app.js tests/v2-visual-system-refinement.test.mjs tests/v2-portfolio.test.mjs AGENTS.md DESIGN.md docs/portfolio-working-notes.md index.html styles.css app.js docs/superpowers/plans/2026-08-10-desktop-workflow-folder-cards-plan.md
git commit -m "Refine desktop workflow folder cards"
```
