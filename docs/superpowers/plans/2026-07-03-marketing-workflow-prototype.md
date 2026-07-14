# Marketing Workflow Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the local Three.js prototype into a marketing-engineer hero and scroll sequence where the workflow graphic travels into proof and AI pipeline modules.

**Architecture:** Keep the implementation in the existing static prototype page, `three-marketing-map.html`, because the user is already viewing it locally. Use Three.js for the living workflow field, HTML/CSS for readable labels and pipeline modules, and scroll progress to transform the system without adding a build step.

**Tech Stack:** Static HTML, CSS, Three.js CDN, vanilla JavaScript, local Python static server.

---

### Task 1: Replace Prototype Content Model

**Files:**
- Modify: `/Users/michaelmckerracher/Job Search/portfolio-site/three-marketing-map.html`

- [ ] **Step 1: Replace old node language**

Use these labels in the prototype:

```text
Inputs: Research, Plan, Context, APIs
Cycle: AI execute, Human validate, AI deploy, Learn
Focal point: MM
Outputs: Websites, Sales materials, Dashboards, Interactive systems, AI enablement
```

- [ ] **Step 2: Remove old dashboard labels**

Remove old labels such as `Content Library`, `Retail Tech`, and the large `Marketing Engineering` label inside the graphic.

- [ ] **Step 3: Verify by search**

Run:

```bash
rg -n "Content Library|Retail Tech|Marketing Engineering" "/Users/michaelmckerracher/Job Search/portfolio-site/three-marketing-map.html"
```

Expected: no old graphic labels remain except page copy/title if intentionally used.

### Task 2: Build Scroll-Merge Page Structure

**Files:**
- Modify: `/Users/michaelmckerracher/Job Search/portfolio-site/three-marketing-map.html`

- [ ] **Step 1: Create a long-form prototype page**

Page sections:

```text
Hero: Michael McKerracher / Marketing Engineer / marketing workflows
Cycle: Research -> Plan -> AI Execute -> Human Validate -> AI Deploy -> Learn
Proof: retail, AEO/ecomm, AI sales lift, VI estimated time saved
Pipelines: JSON prompt to image, image to website, AI enablement
```

- [ ] **Step 2: Make the WebGL stage sticky**

The animation should remain visible while the user scrolls through the cycle and pipeline modules.

- [ ] **Step 3: Add module landing points**

Each pipeline card should have a visible landing node so the hero output appears to merge into it.

### Task 3: Rebuild Three.js Animation

**Files:**
- Modify: `/Users/michaelmckerracher/Job Search/portfolio-site/three-marketing-map.html`

- [ ] **Step 1: Create a central `MM` synthesis node**

The center node should be dark, restrained, and not covered by long text.

- [ ] **Step 2: Route inputs into the center**

Animated particles should move from Research, Plan, Context, and APIs into `MM`.

- [ ] **Step 3: Route cycle nodes around the center**

The cycle should visibly loop:

```text
AI execute -> Human validate -> AI deploy -> Learn
```

- [ ] **Step 4: Route outputs down/right**

Websites, Sales materials, Dashboards, Interactive systems, and AI enablement should pull forward based on scroll progress.

- [ ] **Step 5: Add hover/focus readout**

Hovering labels should emphasize connected routes without turning the page into a dashboard.

### Task 4: Add Pipeline Visual Cards

**Files:**
- Modify: `/Users/michaelmckerracher/Job Search/portfolio-site/three-marketing-map.html`

- [ ] **Step 1: JSON prompt to image card**

Show readable JSON fields and an output candidate contact sheet.

- [ ] **Step 2: Image to website card**

Show design image -> overlay -> wireframe -> code -> QA.

- [ ] **Step 3: AI enablement card**

Show workflow need -> custom MCT/MCP -> skill -> training -> repeatable output.

- [ ] **Step 4: Proof card**

Include the estimated VI time-saved scenario as an estimate:

```text
4 hours/week x 2 workflows x 2 employees x 52 weeks = 832 hours/year
```

### Task 5: Verify Responsive And Motion

**Files:**
- Test target: `http://127.0.0.1:8787/three-marketing-map.html`

- [ ] **Step 1: Browser smoke test**

Verify:

```text
No Three.js fallback
No horizontal overflow
Canvas visible
Labels readable
Old dashboard labels removed
```

- [ ] **Step 2: Screenshot desktop**

Capture the local page at the current desktop browser size.

- [ ] **Step 3: Screenshot mobile/stacked width**

Verify the animation compresses into a usable shorter stage and cards remain readable.

- [ ] **Step 4: Fix overlap**

If any label overlaps the `MM` node or proof cards, simplify the labels rather than adding more UI.
