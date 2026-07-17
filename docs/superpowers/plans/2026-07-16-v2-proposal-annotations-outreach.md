# V2 Proposal Annotation and Outreach Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the V2 proposal explanation easier to read and show how the generated proposal feeds a reviewed personalized outreach email.

**Architecture:** Keep the existing V2 route, proposal client, and API contract. Change only the V2 HTML/CSS presentation, extend its permanent structural and browser QA, and update the V2 design/source-truth documentation.

**Tech Stack:** Semantic HTML, CSS, Node test runner, Puppeteer browser QA.

---

### Task 1: Lock the Readability and Outreach Contract

**Files:**
- Modify: `tests/v2-proposal-builder.test.mjs`
- Modify: `tests/qa-v2-proposal-builder.mjs`

- [ ] **Step 1: Write failing structural assertions**

Require each callout to use an opaque warm-paper background and at least `18px` padding. Require the outreach section, personalized email object, proposal attachment, human-review language, and link to `workflows/local-prospecting-enrichment.html`.

- [ ] **Step 2: Write failing browser assertions**

Extend `inspectLayout()` to return callout background colours, minimum padding, proposal overlap, and outreach overflow. Assert that all callout backgrounds are opaque, minimum padding is at least `18`, proposal overlap is false, and the outreach section does not overflow at 1440px or 390px.

- [ ] **Step 3: Run the focused test and confirm RED**

Run:

```bash
node --test tests/v2-proposal-builder.test.mjs
```

Expected: failure because the outreach section and boxed callout styles are absent.

### Task 2: Implement Boxed Annotations

**Files:**
- Modify: `v2/proposal-generator.html`
- Modify: `v2/proposal-generator.css`

- [ ] **Step 1: Keep arrow endpoints outside proposal content**

Update the four SVG paths so they begin at each box edge and terminate at the proposal edge. Keep the SVG pointer-inert.

- [ ] **Step 2: Style the callouts as readable cards**

Use an opaque `#f7f7f3` background, dark ink, a restrained warm border, `18px` padding, `8px` radius, left alignment, and approximately `13px` body text. Maintain two side columns and reduce the proposal width only as much as required to keep cards and arrows separate.

- [ ] **Step 3: Preserve the mobile explanation list**

Below 700px, keep paths hidden and pins visible. Use the same warm-paper card treatment with `18px` padding and a consistent gap.

### Task 3: Add the Outreach Handoff

**Files:**
- Modify: `v2/proposal-generator.html`
- Modify: `v2/proposal-generator.css`

- [ ] **Step 1: Add semantic handoff copy**

Add a section between the builder and gold outcome with the approved heading and explanation. Include a compact personalized email example, an attached-proposal row, and an explicit human-review note.

- [ ] **Step 2: Connect the real workflow**

Link the section to `workflows/local-prospecting-enrichment.html`. Describe the proposal as one output of the reviewed prospecting workflow; do not imply automatic outreach.

- [ ] **Step 3: Style the email as an authored object**

Use a white email surface with restrained borders and shadow inside an open warm-paper section. Keep the text selectable and responsive. At mobile widths, stack narrative and email without horizontal overflow.

### Task 4: Verify and Document

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Run focused static tests**

Run:

```bash
node --test tests/v2-proposal-builder.test.mjs
```

Expected: all focused tests pass.

- [ ] **Step 2: Run proposal browser QA**

Run:

```bash
QA_V2_PROPOSAL_SCREENSHOT_DIR=/tmp/v2-proposal-builder-proof node tests/qa-v2-proposal-builder.mjs
```

Expected: desktop and mobile show no overflow or proposal overlap; generation completes.

- [ ] **Step 3: Inspect both screenshots**

Confirm callout text is readable, no box covers the proposal, arrows connect cleanly, mobile cards have consistent padding, and the email handoff looks like part of the V2 site.

- [ ] **Step 4: Update source truth**

Record the boxed annotation treatment, outreach handoff, human-review boundary, and prospecting-workflow link in the three project context documents.

- [ ] **Step 5: Run the complete regression suite**

Run:

```bash
npm test
node scripts/qa-v2.mjs
git diff --check
git diff --name-only -- proposal-generator.html proposal-generator.css proposal-generator.js index.html styles.css app.js
```

Expected: all tests and browser QA pass; the final V1 presentation diff is empty.

### Task 5: Replace the Generic Email with the Real Numbers-Led Outreach

**Files:**
- Modify: `tests/v2-proposal-builder.test.mjs`
- Modify: `v2/proposal-generator.html`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Write the failing copy assertions**

Require the email object to contain the subject `92 buildings near Midtown Family Dental` and the supported sample facts `92 buildings`, `327 screens`, `223.5 million impressions a month`, and `$70 per screen per month`. Require the attached proposal to be the concrete next step.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test tests/v2-proposal-builder.test.mjs
```

Expected: failure because the current email contains generic local-inventory language instead of the sample facts.

- [ ] **Step 3: Replace only the email copy**

Use the real first-email structure from `VI Automation/src/integrations/claude/email-writer.ts`, adapted to the approved Midtown Family Dental proposal sample. Keep the existing email layout, attachment object, workflow link, and human-review note unchanged.

- [ ] **Step 4: Record the source truth**

Document that the portfolio email example uses the approved proposal sample metrics and mirrors the actual numbers-led outreach pattern. Do not imply that every prospect receives the same counts.

- [ ] **Step 5: Verify focused and browser behavior**

Run:

```bash
node --test tests/v2-proposal-builder.test.mjs
QA_V2_PROPOSAL_SCREENSHOT_DIR=/tmp/v2-proposal-builder-proof node tests/qa-v2-proposal-builder.mjs
```

Expected: focused tests pass, the email remains readable on desktop and mobile, generation still completes, and no horizontal overflow appears.
