# V2 Dashboard Recovery and Tab Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the previous real agency dashboard and give the workflow accordion a coherent, responsive stacked-tab treatment.

**Architecture:** Preserve all existing V2 routes and interaction code. Replace only the two dashboard production image files from the verified V3 source, then implement media-stage consistency and tab depth entirely in CSS with responsive resets.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node test runner, Playwright browser QA.

---

### Task 1: Add recovery and depth regression coverage

**Files:**
- Modify: `tests/v2-visual-system-refinement.test.mjs`

- [ ] Add assertions for the exact V3 dashboard hash in both V2 production assets.
- [ ] Add CSS assertions for accordion perspective, rail side faces, ordered z-index, and the tablet/mobile transform reset.
- [ ] Run `node --test tests/v2-visual-system-refinement.test.mjs` and confirm the new assertions fail.

### Task 2: Restore the real dashboard

**Files:**
- Source: `assets/screens/fountainhead-ai-visibility-dashboard-v3.png`
- Replace: `v2/assets/workflows/agency-dashboard-desktop.png`
- Replace: `v2/assets/workflows/agency-dashboard-mobile.png`
- Modify: `v2/assets/workflows/README.md`
- Modify: `AGENTS.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] Copy the V3 source byte-for-byte to both V2 production asset names.
- [ ] Record the source and hash in the workflow manifest and project context.
- [ ] Remove instructions that identify the conceptual dashboard diagram as locked source truth.

### Task 3: Normalize media staging and create stacked depth

**Files:**
- Modify: `v2/styles.css`
- Modify: `v2/workflows/workflow-detail.css`

- [ ] Give the desktop accordion perspective and ordered rail depth.
- [ ] Add rail side faces, leading edges, directional shadows, and restrained vertical offsets.
- [ ] Normalize all homepage workflow figures to one charcoal stage with consistent padding and image containment.
- [ ] Match detail-page artwork containment to the same stage rules.
- [ ] Reset transforms and pseudo-elements for tablet/mobile vertical rows.

### Task 4: Verify

**Files:**
- Verify: `tests/*.test.mjs`
- Verify: `scripts/qa-v2.mjs`

- [ ] Run the focused visual-system test.
- [ ] Run `npm test`.
- [ ] Run responsive V2 browser QA and inspect the dashboard accordion state at desktop and mobile widths.
- [ ] Confirm no horizontal overflow and no V1 implementation changes from this pass.
