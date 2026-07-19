# V2 Workflow Source Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the Presentation, Local Prospecting, and Image-to-Website workflow narratives in both generated artwork and workflow-page copy.

**Architecture:** Preserve the existing V2 page and accordion implementation. Generate corrected desktop artwork from each current desktop image, generate a separate mobile composition from each corrected desktop image, then replace the six existing production assets and update source-truth copy and tests.

**Tech Stack:** Static HTML/CSS, Node test runner, built-in image generation, Puppeteer browser QA.

---

### Task 1: Lock the corrected source truth in tests

**Files:**
- Modify: `tests/v2-presentation-publishing.test.mjs`
- Modify: `tests/v2-visual-system-refinement.test.mjs`

- [ ] Add assertions that Presentation includes sales-team HTML authoring, customer branding, the design system, maps, and custom graphics before Cloud Scale Deploy.
- [ ] Add assertions that Prospecting includes Apollo, the generated proposal PDF, map, custom graphic or image, sales review, and an approved send.
- [ ] Add assertions that Image-to-Website includes many hero explorations, mood boards, and direction review before the live HTML proof.
- [ ] Run `node --test tests/v2-presentation-publishing.test.mjs tests/v2-visual-system-refinement.test.mjs` and confirm the new assertions fail against the old copy.

### Task 2: Correct the three workflow pages and prompt manifest

**Files:**
- Modify: `v2/workflows/presentation-publishing.html`
- Modify: `v2/workflows/local-prospecting-enrichment.html`
- Modify: `v2/workflows/image-to-website-production.html`
- Modify: `v2/assets/workflows/README.md`
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] Add the approved authoring stage and tools to Presentation without changing its deployment mechanics.
- [ ] Add Apollo, the real proposal PDF contents, and the reviewed-send outcome to Prospecting.
- [ ] Expand Image-to-Website Visual Direction into hero explorations, mood boards, and direction review.
- [ ] Update the desktop and mobile image-generation prompts with the same required modules and invariants.
- [ ] Run the two targeted test files and confirm their source-truth assertions pass.

### Task 3: Generate corrected desktop artwork

**Files:**
- Replace: `v2/assets/workflows/presentation-publishing-desktop.png`
- Replace: `v2/assets/workflows/local-prospecting-desktop.png`
- Replace: `v2/assets/workflows/image-to-website-desktop.png`

- [ ] Use each current desktop image as an edit target and composition reference in the built-in image-generation tool.
- [ ] Generate Presentation with sales authoring inputs and branded HTML artifact before deployment.
- [ ] Generate Prospecting with Apollo, the detailed proposal PDF, reviewed email attachment, and approved send.
- [ ] Generate Image-to-Website with many hero explorations, mood boards, and direction review.
- [ ] Inspect all three outputs for required labels, recognizable logos, accurate topology, and preservation of the approved visual language.
- [ ] Copy the selected outputs into the three production asset paths.

### Task 4: Generate corrected mobile artwork

**Files:**
- Replace: `v2/assets/workflows/presentation-publishing-mobile.png`
- Replace: `v2/assets/workflows/local-prospecting-mobile.png`
- Replace: `v2/assets/workflows/image-to-website-mobile.png`

- [ ] Use each corrected desktop image as the strict content and style reference.
- [ ] Generate a purpose-built portrait composition with the complete corrected workflow.
- [ ] Inspect the three mobile outputs for legibility, correct ordering, and no desktop crop.
- [ ] Copy the selected outputs into the three production asset paths.

### Task 5: Verify the revised pages

**Files:**
- Modify if required: `scripts/qa-v2.mjs`

- [ ] Run `npm test` and require zero failures.
- [ ] Run `QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-workflow-corrections QA_V2_SCREENSHOT_MODE=lean node scripts/qa-v2.mjs`.
- [ ] Inspect Presentation, Prospecting, and Image-to-Website at 1440px and 390px.
- [ ] Verify the approved Content desktop and both Dashboard SHA-256 hashes remain unchanged.
- [ ] Verify no deterministic workflow renderer has returned.
