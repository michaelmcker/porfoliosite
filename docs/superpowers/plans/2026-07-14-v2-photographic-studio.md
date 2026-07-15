# Portfolio V2 Photographic Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the isolated V2 homepage and all five V2 workflow pages around a neutral photographic-studio system with dimensional screens, source-grounded backgrounds, a more physical accordion, and a section-wide interactive About portrait.

**Architecture:** Keep V2 as static HTML, CSS, and JavaScript. Add one shared workflow-detail stylesheet, V2-owned background assets, and a V2-specific portrait bridge so V1 files and shared portrait behavior remain untouched. Extend the existing Node structural tests and Puppeteer browser QA before changing production files.

**Tech Stack:** Semantic HTML, local DM Sans and Fraunces variable fonts, CSS Grid/Flexbox and custom properties, vanilla JavaScript, Node test runner, Puppeteer Core, local image assets.

---

## File Map

- Modify `v2/index.html`: dimensional-screen wrappers, environmental media fields, smaller editorial titles, monochrome accordion links, About breakout phrase and arrow.
- Modify `v2/styles.css`: neutral tokens, shared bevel, selected-work environments, accordion staging, About scroll composition, responsive and reduced-motion behavior.
- Modify `v2/app.js`: staged accordion selection, About pointer bridge, breakout progress, and existing media behavior.
- Create `v2/portrait/embed.html`: V2-only portrait document using the existing approved portrait assets plus a validated parent-coordinate message listener.
- Create `v2/workflows/workflow-detail.css`: shared detail-page system for all five workflow routes.
- Create `v2/workflows/content-production.html`: detailed search-led content workflow.
- Create `v2/workflows/agency-management-dashboard.html`: detailed public-safe dashboard workflow.
- Modify `v2/workflows/presentation-publishing.html`: migrate to the shared V2 workflow template without changing the six-stage source truth.
- Create `v2/workflows/local-prospecting-enrichment.html`: detailed map discovery and enrichment workflow.
- Create `v2/workflows/image-to-website-production.html`: detailed image-led website workflow.
- Modify `v2/workflows/presentation-publishing.css`: retain only route-specific deterministic-artwork sizing after the shared detail rules move into `workflow-detail.css`.
- Create `v2/assets/backgrounds/rccv-parish.jpg`, `boutique-forest.jpg`, `cool-runnings-lawn.jpg`, `proposal-cityscape.jpg`, and `elevator-lobby.jpg`.
- Modify `tests/v2-portfolio.test.mjs`: structural, route, content, asset, interaction, and V1-isolation coverage.
- Modify `scripts/qa-v2.mjs`: runtime verification and capture coverage for homepage, About, accordion states, and five workflow routes.
- Modify `DESIGN.md`, `AGENTS.md`, and `docs/portfolio-working-notes.md`: approved V2 system and exact asset provenance.

## Task 1: Add Failing Contract Tests

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Add shared test helpers and workflow route list**

```js
const workflowRoutes = [
  "content-production.html",
  "agency-management-dashboard.html",
  "presentation-publishing.html",
  "local-prospecting-enrichment.html",
  "image-to-website-production.html",
];

const readWorkflow = (name) => readFile(path.join(root, "v2", "workflows", name), "utf8");
```

- [ ] **Step 2: Add a failing homepage visual-system test**

```js
test("V2 uses one photographic studio system instead of unrelated colour bands", async () => {
  const html = await readFile(path.join(root, "v2", "index.html"), "utf8");
  const css = await readFile(path.join(root, "v2", "styles.css"), "utf8");

  for (const project of ["rccv", "accommodation", "cool-runnings", "proposal", "elevators"]) {
    assert.match(html, new RegExp(`data-project-environment="${project}"`));
  }
  assert.match(css, /--accent:\s*#E3A916/i);
  assert.doesNotMatch(css, /--work-accommodation|--work-proposal|--content-vivid|--about-hard/);
  assert.match(css, /\.screen-bezel/);
  assert.match(css, /font-family:\s*var\(--font-editorial\)/);
});
```

- [ ] **Step 3: Add failing accordion and About interaction tests**

```js
test("accordion stages selection and About bridges section-wide pointer input", async () => {
  const html = await readFile(path.join(root, "v2", "index.html"), "utf8");
  const app = await readFile(path.join(root, "v2", "app.js"), "utf8");

  assert.match(html, /data-about-stage/);
  assert.match(html, /data-about-breakout/);
  assert.match(html, /class="about-curly-arrow"/);
  assert.match(html, /src="portrait\/embed\.html"/);
  assert.match(app, /portfolio-portrait-pointer/);
  assert.match(app, /data-workflow-transitioning/);
  assert.match(app, /requestAnimationFrame/);
});
```

- [ ] **Step 4: Add a failing five-page workflow contract test**

```js
test("all five V2 workflow routes share the detailed public-safe contract", async () => {
  for (const route of workflowRoutes) {
    const html = await readWorkflow(route);
    assert.match(html, /workflow-detail\.css/);
    assert.match(html, /data-workflow-purpose/);
    assert.match(html, /id="why-it-exists"/);
    assert.match(html, /id="how-it-works"/);
    assert.match(html, /id="tools-and-sources"/);
    assert.match(html, /id="what-ships"/);
    assert.match(html, /id="human-review"/);
    assert.match(html, /id="proof-and-constraints"/);
    assert.match(html, /id="related-work"/);
    assert.ok((html.match(/class="workflow-step"/g) || []).length >= 5);
  }
});
```

- [ ] **Step 5: Run the focused tests and confirm RED**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: FAIL because the environments, shared bevel, About bridge, and four new workflow routes do not exist.

- [ ] **Step 6: Commit the red tests**

```bash
git add tests/v2-portfolio.test.mjs
git commit -m "test(v2): define photographic studio contract"
```

## Task 2: Stage Source-Grounded Background Assets

**Files:**
- Create: `v2/assets/backgrounds/rccv-parish.jpg`
- Create: `v2/assets/backgrounds/boutique-forest.jpg`
- Create: `v2/assets/backgrounds/cool-runnings-lawn.jpg`
- Create: `v2/assets/backgrounds/proposal-cityscape.jpg`
- Create: `v2/assets/backgrounds/elevator-lobby.jpg`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Create the V2 background directory**

Run: `mkdir -p v2/assets/backgrounds`

Expected: the directory exists and no V1 path changes.

- [ ] **Step 2: Copy the exact RCCV and Cool Runnings photographs**

Run:

```bash
cp "/Users/michaelmckerracher/Local Websites/St James/rccv-site/public/media/parishes/st-james-golden-distance-poster.jpg" "v2/assets/backgrounds/rccv-parish.jpg"
cp "/Users/michaelmckerracher/Local Websites/Cool Runnings/Website/Assets/ba-lawn-after.jpg" "v2/assets/backgrounds/cool-runnings-lawn.jpg"
```

Expected: both files resolve locally and retain their source pixels.

- [ ] **Step 3: Create the forest background from the approved treehouse source**

Use `assets/frames/accommodation/treehouse/010.jpg` as the only property reference. Generate a clean 16:10 atmospheric image of the same treehouse surrounded by tall Okanagan forest, with no text, logos, navigation, invented buildings, or people. Save the result as `v2/assets/backgrounds/boutique-forest.jpg`.

- [ ] **Step 4: Create the public-safe proposal cityscape**

Generate a wide documentary cityscape showing a Canadian mid-size downtown/commercial district at late afternoon. It must contain no brand marks, billboards, legible business names, fictional media data, or recognizable private property. Save as `v2/assets/backgrounds/proposal-cityscape.jpg`.

- [ ] **Step 5: Stage the elevator-lobby background**

Copy the existing public-safe lobby image:

```bash
cp "/Users/michaelmckerracher/VI Automation/VI Tools/images/adapt-mockups/lobby-panel.jpg" "v2/assets/backgrounds/elevator-lobby.jpg"
```

Expected: a commercial lobby with a screen-ready wall and no client-identifying copy.

- [ ] **Step 6: Record provenance and generation boundaries**

Add this table to `docs/portfolio-working-notes.md`:

```markdown
### V2 selected-work environments

| V2 asset | Source | Rule |
| --- | --- | --- |
| `rccv-parish.jpg` | RCCV St James golden-distance parish photograph | Exact copy; no generative alteration |
| `boutique-forest.jpg` | Generated from `treehouse/010.jpg` | Same property and forest; no invented structures |
| `cool-runnings-lawn.jpg` | Cool Runnings `ba-lawn-after.jpg` | Exact project photograph |
| `proposal-cityscape.jpg` | Public-safe generated cityscape | No brands, clients, inventory, or fictional data |
| `elevator-lobby.jpg` | VI lobby-panel mockup source | Public-safe environmental context only |
```

- [ ] **Step 7: Verify dimensions and file size**

Run: `sips -g pixelWidth -g pixelHeight v2/assets/backgrounds/*.jpg`

Expected: every background is at least 1400px wide except the portrait-oriented lawn source, which may remain portrait and use `object-fit: cover`.

- [ ] **Step 8: Commit the assets and provenance**

```bash
git add v2/assets/backgrounds docs/portfolio-working-notes.md
git commit -m "assets(v2): add source-grounded project environments"
```

## Task 3: Rebuild Homepage Structure Around Dimensional Screens

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Wrap the hero film in the shared bezel structure**

```html
<figure class="hero-system-media screen-bezel screen-bezel-hero">
  <div class="screen-bezel-rim">
    <div class="screen-bezel-viewport">
      <video id="motion-video-hero" data-motion-video data-motion-surface><!-- current sources --></video>
    </div>
  </div>
  <figcaption>Inputs become systems. Systems become useful work.</figcaption>
</figure>
```

- [ ] **Step 2: Add one environmental media field to each selected-work chapter**

```html
<div class="project-environment" data-project-environment="rccv" aria-hidden="true">
  <img src="assets/backgrounds/rccv-parish.jpg" alt="" loading="lazy">
</div>
```

Repeat with the correct V2-owned background for accommodation, Cool Runnings, proposal, and elevators. Keep environmental images decorative and keep meaningful device/artifact alt text unchanged.

- [ ] **Step 3: Convert browser objects to the shared bezel**

Use the same `.screen-bezel > .screen-bezel-rim > .screen-bezel-viewport` hierarchy for accommodation, Cool Runnings, Why Elevators, dashboard media, and workflow hero media. Keep the accommodation URL bar and controls inside the rim.

- [ ] **Step 4: Update workflow CTAs to all five V2 routes**

```html
<a href="workflows/content-production.html">View workflow</a>
<a href="workflows/agency-management-dashboard.html">View workflow</a>
<a href="workflows/presentation-publishing.html">View workflow</a>
<a href="workflows/local-prospecting-enrichment.html">View workflow</a>
<a href="workflows/image-to-website-production.html">View workflow</a>
```

- [ ] **Step 5: Replace page-wide colour tokens with the neutral system**

```css
:root {
  --canvas: #f5f3ed;
  --surface: #fff;
  --ink: #171816;
  --charcoal: #171918;
  --muted: #62655f;
  --hairline: #d7d6cf;
  --accent: #e3a916;
  --font-functional: "DM Sans", sans-serif;
  --font-editorial: "Fraunces", serif;
  --shadow-contact: 0 14px 24px rgba(20, 22, 20, 0.32);
  --shadow-lift: 0 40px 88px rgba(31, 35, 31, 0.18);
}
```

- [ ] **Step 6: Add the dimensional object rules**

```css
.screen-bezel {
  position: relative;
  border-radius: clamp(1.5rem, 3vw, 2.375rem);
  padding: clamp(.65rem, 1.1vw, 1rem);
  background: linear-gradient(145deg, #3a3d3b 0%, #171918 48%, #080908 100%);
  box-shadow: var(--shadow-contact), var(--shadow-lift), inset 1px 1px 0 rgba(255,255,255,.26);
}

.screen-bezel-rim {
  padding: clamp(.32rem, .6vw, .55rem);
  border-radius: inherit;
  background: linear-gradient(145deg, #626663, #202321 45%, #090a09);
  box-shadow: inset 1px 1px 0 rgba(255,255,255,.28), inset -2px -2px 5px rgba(0,0,0,.5);
}

.screen-bezel-viewport {
  overflow: hidden;
  border-radius: calc(clamp(1.5rem, 3vw, 2.375rem) - .75rem);
  background: #070807;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), inset 0 12px 24px rgba(0,0,0,.2);
}
```

- [ ] **Step 7: Reduce editorial title scale**

```css
.work-copy h3,
.workflow-copy h3,
.about-copy h2 {
  font-family: var(--font-editorial);
  font-weight: 520;
  letter-spacing: -0.035em;
}

.work-copy h3 {
  font-size: clamp(2rem, 3.7vw, 3.75rem);
  line-height: .98;
}
```

- [ ] **Step 8: Make Workflows and Outcomes one white chapter**

Set `.workflow-section` and `.outcomes` to `var(--surface)`, remove black/rainbow section fields, retain one hairline between them, and keep `.build-bias` as the sole large yellow field.

- [ ] **Step 9: Run the focused tests**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: homepage visual tests pass; workflow route tests remain red.

- [ ] **Step 10: Commit homepage structure and material system**

```bash
git add v2/index.html v2/styles.css tests/v2-portfolio.test.mjs
git commit -m "refine(v2): unify project environments and screen material"
```

## Task 4: Restore Physical Accordion Motion

**Files:**
- Modify: `v2/app.js`
- Modify: `v2/styles.css`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Add an explicit transition state around selection**

```js
let activeWorkflowIndex = workflowItems.findIndex((item) => item.classList.contains("is-active"));
let workflowTimer;

function activateWorkflow(index, { focus = false } = {}) {
  const safeIndex = Math.max(0, Math.min(index, workflowItems.length - 1));
  if (safeIndex === activeWorkflowIndex) {
    if (focus) workflowTriggers[safeIndex].focus();
    return;
  }

  clearTimeout(workflowTimer);
  const previousItem = workflowItems[activeWorkflowIndex];
  previousItem?.setAttribute("data-workflow-transitioning", "out");

  requestAnimationFrame(() => {
    workflowItems.forEach((item, itemIndex) => {
      const active = itemIndex === safeIndex;
      const panel = item.querySelector("[data-workflow-panel]");
      item.classList.toggle("is-active", active);
      item.toggleAttribute("data-workflow-selected", active);
      workflowTriggers[itemIndex].setAttribute("aria-expanded", String(active));
      panel.setAttribute("aria-hidden", String(!active));
      panel.toggleAttribute("inert", !active);
    });
    activeWorkflowIndex = safeIndex;
    workflowItems[safeIndex].setAttribute("data-workflow-transitioning", "in");
    workflowTimer = setTimeout(() => {
      workflowItems.forEach((item) => item.removeAttribute("data-workflow-transitioning"));
    }, 620);
  });

  if (focus) workflowTriggers[safeIndex].focus();
}
```

- [ ] **Step 2: Add monochrome spine and stagger rules**

```css
.workflow-item { background: var(--charcoal); color: var(--surface); }
.workflow-item.is-active { background: var(--surface); color: var(--ink); }
.workflow-item.is-active .workflow-number { color: #8c6500; }
.workflow-item .workflow-panel-inner > * { opacity: 0; transform: translateY(1rem); }
.workflow-item.is-active .workflow-panel-inner > * { opacity: 1; transform: none; }
.workflow-item.is-active .workflow-copy { transition-delay: 160ms; }
.workflow-item.is-active figure { transition-delay: 230ms; }
```

- [ ] **Step 3: Use spring-like panel timing**

Desktop uses `transition: flex-grow 580ms cubic-bezier(.2,.9,.2,1), background-color 240ms ease;`. Mobile uses grid-row expansion or `max-height` with a content-size-safe upper bound plus opacity/transform staging.

- [ ] **Step 4: Preserve keyboard and hover semantics**

Keep Arrow/Home/End/Enter/Space handling. Add hover preview only inside `@media (hover:hover) and (pointer:fine)` and never call `activateWorkflow()` from pointerenter.

- [ ] **Step 5: Add reduced-motion overrides**

```css
@media (prefers-reduced-motion: reduce) {
  .workflow-item,
  .workflow-panel-inner > * { transition-duration: .01ms !important; transition-delay: 0ms !important; transform: none !important; }
}
```

- [ ] **Step 6: Run focused tests and commit**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: accordion tests pass with keyboard behavior preserved.

```bash
git add v2/app.js v2/styles.css tests/v2-portfolio.test.mjs
git commit -m "feat(v2): restore expanding spine accordion motion"
```

## Task 5: Restore the About Breakout and Section-Wide Portrait Tracking

**Files:**
- Create: `v2/portrait/embed.html`
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/app.js`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Create a V2-specific portrait embed**

Copy the semantic structure and approved asset references from `assets/portrait-final/embed.html` into `v2/portrait/embed.html`, rewriting asset URLs to `../../assets/portrait-final/...`. Add only this message bridge:

```js
window.addEventListener("message", (event) => {
  if (event.source !== window.parent) return;
  if (event.data?.type !== "portfolio-portrait-pointer") return;
  const x = Math.max(0, Math.min(1, Number(event.data.x)));
  const y = Math.max(0, Math.min(1, Number(event.data.y)));
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  renderPose(1 + Math.floor(Math.min(.999, y) * 11), 1 + Math.floor(Math.min(.999, x) * 6));
  window.__v2PortraitMessageCount = (window.__v2PortraitMessageCount || 0) + 1;
});
```

Keep the existing `renderPose(row, column)` function and replace the shared embed’s permissive `portrait-gaze` listener only inside the V2 copy. Do not modify `assets/portrait-final/embed.html`.

- [ ] **Step 2: Add About stage markup and breakout phrase**

```html
<section class="about" data-about-stage>
  <!-- current copy and portrait -->
  <div class="about-breakout" data-about-breakout>
    <p><span>Even when the practical value</span> <strong>is questionable.</strong></p>
    <svg class="about-curly-arrow" viewBox="0 0 220 150" aria-hidden="true">
      <path d="M12 24C84 10 122 44 110 86c-8 28 28 37 77 28" />
      <path d="m170 96 20 18-24 10" />
    </svg>
    <p class="about-breakout-resolution">But there is always value in learning from the process.</p>
  </div>
</section>
```

- [ ] **Step 3: Point the homepage iframe at the V2 embed**

```html
<iframe src="portrait/embed.html" title="Interactive Renaissance portrait of Michael McKerracher. Move the pointer across the About section to change his gaze."></iframe>
```

- [ ] **Step 4: Forward normalized section coordinates**

```js
const aboutStage = document.querySelector("[data-about-stage]");
let portraitPointerFrame;

aboutStage?.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch" || reducedMotion.matches) return;
  cancelAnimationFrame(portraitPointerFrame);
  portraitPointerFrame = requestAnimationFrame(() => {
    const rect = aboutStage.getBoundingClientRect();
    portraitEmbed?.contentWindow?.postMessage({
      type: "portfolio-portrait-pointer",
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }, window.location.origin === "null" ? "*" : window.location.origin);
  });
});
```

- [ ] **Step 5: Drive the breakout from bounded scroll progress**

Use one passive scroll listener scheduled through `requestAnimationFrame`. Calculate progress only while the About section intersects the viewport and set `--about-progress` between `0` and `1` on the section.

```js
const updateAboutProgress = () => {
  const rect = aboutStage.getBoundingClientRect();
  const travel = window.innerHeight + rect.height;
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / travel));
  aboutStage.style.setProperty("--about-progress", progress.toFixed(4));
};
```

- [ ] **Step 6: Style the breakout, larger portrait, and arrow reveal**

```css
.about-breakout p:first-child {
  font-family: var(--font-editorial);
  font-size: clamp(2.3rem, calc(2rem + var(--about-progress) * 5vw), 7rem);
  letter-spacing: calc(-.02em - var(--about-progress) * .04em);
  transform: translateX(calc((.5 - var(--about-progress)) * 4vw));
}
.about-curly-arrow path {
  fill: none;
  stroke: currentColor;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 310;
  stroke-dashoffset: calc(310 * (1 - var(--about-progress)));
}
.portrait-object { width: min(100%, 44rem); }
```

- [ ] **Step 7: Add reduced-motion static state**

The phrase, resolution, and complete arrow render without scroll transforms. Pointer forwarding stops when reduced motion is active, leaving the default approved portrait pose.

- [ ] **Step 8: Run tests and commit**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: About bridge, V2 portrait isolation, arrow, and reduced-motion assertions pass.

```bash
git add v2/portrait/embed.html v2/index.html v2/styles.css v2/app.js tests/v2-portfolio.test.mjs
git commit -m "feat(v2): restore portrait tracking and about breakout"
```

## Task 6: Build the Shared Workflow Detail System

**Files:**
- Create: `v2/workflows/workflow-detail.css`
- Modify: `v2/workflows/presentation-publishing.html`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Build the shared semantic page skeleton**

Every route uses:

```html
<body class="workflow-detail">
  <a class="skip-link" href="#content">Skip to workflow</a>
  <header class="site-header detail-header"><!-- shared V2 navigation --></header>
  <main id="content">
    <section class="workflow-detail-hero page-frame">
      <div data-workflow-purpose><!-- eyebrow, h1, one-sentence purpose --></div>
      <figure class="workflow-hero-media screen-bezel"><!-- route media --></figure>
    </section>
    <section id="why-it-exists" class="workflow-detail-section page-frame"></section>
    <section id="how-it-works" class="workflow-detail-section page-frame"><ol></ol></section>
    <section id="tools-and-sources" class="workflow-detail-section page-frame"></section>
    <div class="workflow-detail-pair page-frame">
      <section id="what-ships"></section>
      <section id="human-review"></section>
    </div>
    <section id="proof-and-constraints" class="workflow-detail-section page-frame"></section>
    <section id="related-work" class="workflow-related page-frame"></section>
  </main>
</body>
```

- [ ] **Step 2: Add shared detail typography and spacing**

Use Fraunces for the hero and section statements, DM Sans for steps and evidence, the shared neutral tokens from `../styles.css`, a two-column hero above `960px`, and one-column layouts below.

- [ ] **Step 3: Add shared step ledger styling**

```css
.workflow-step {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: 1.5rem 0;
  border-top: 1px solid var(--hairline);
}
.workflow-step > span { font-variant-numeric: tabular-nums; color: var(--muted); }
```

- [ ] **Step 4: Migrate Presentation Publishing without changing source truth**

Keep the six existing stages exactly: branded HTML, Vercel API deployment, name/destination validation, Webflow CMS iframe field, full-screen template, published URL verification. Add the shared IDs/classes and import `workflow-detail.css`.

- [ ] **Step 5: Run the focused tests**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: Presentation Publishing passes the shared contract; the four missing routes remain red.

- [ ] **Step 6: Commit the shared workflow foundation**

```bash
git add v2/workflows/workflow-detail.css v2/workflows/presentation-publishing.html tests/v2-portfolio.test.mjs
git commit -m "refine(v2): add shared workflow detail system"
```

## Task 7: Create the Four Missing Detailed Workflow Pages

**Files:**
- Create: `v2/workflows/content-production.html`
- Create: `v2/workflows/agency-management-dashboard.html`
- Create: `v2/workflows/local-prospecting-enrichment.html`
- Create: `v2/workflows/image-to-website-production.html`
- Modify: `v2/index.html`
- Test: `tests/v2-portfolio.test.mjs`

- [ ] **Step 1: Create Content Production with seven accurate steps**

Steps:

1. Pull Search Console, SERP, competitor, and audience-language inputs.
2. Identify intent, gaps, decay, and opportunity.
3. Build a source-backed brief and outline.
4. Draft with the approved brand and factual context.
5. Human-review facts, usefulness, tone, and differentiation.
6. Hand off metadata, internal links, and publishing notes to Drive or CMS.
7. Measure rankings, Search Console movement, and AI visibility to create the next queue.

Tools/sources: Search Console, SERP/search data, competitor pages, audience language, brand context, Drive/CMS, ranking and AI-visibility reporting.

- [ ] **Step 2: Create Agency Management Dashboard with six accurate steps**

Steps:

1. Connect approved client search, analytics, content, community, and delivery sources.
2. Monitor source health and flag unavailable or stale inputs.
3. Normalize account signals into a queryable shared surface.
4. Surface content gaps, movement, Reddit opportunities, and delivery priorities.
5. Route work into reviewable queues rather than auto-publishing.
6. Use the dashboard during reporting and delivery review to decide the next action.

Tools/sources: Search Console, Analytics, SERP/keyword data, Reddit, CMS/blog inventory, backlinks, conversion data, and client notes. Constraints explicitly omit client-identifying records and credentials.

- [ ] **Step 3: Create Local Prospecting and Enrichment with six accurate steps**

Steps:

1. Discover relevant businesses from Google Maps and approved market inputs.
2. Capture location, category, review, website, and public business signals.
3. Enrich the record with public-safe business context.
4. Match the business and audience area to nearby screen inventory.
5. Build opportunity notes and a specific outreach angle.
6. Hand the reviewed record to the proposal or sales follow-up workflow.

Constraints state that visible records are sample/public data and human review controls outreach.

- [ ] **Step 4: Create Image-to-Website Production with seven accurate steps**

Steps:

1. Research the business, audience, competitors, constraints, and page job.
2. Gather exact brand assets, real content, references, and approved photography.
3. Plan information architecture and page narratives.
4. Generate and compare full-page visual directions before coding.
5. Capture the chosen type, colour, spacing, component, and media rules.
6. Build the responsive site with real assets and content.
7. Review taste, clarity, accessibility, conversion, and performance across viewports.

Constraints state that generated imagery cannot replace an exact supplied asset and every public claim remains source-bound.

- [ ] **Step 5: Use route-specific real visuals**

- Content: `../../assets/approved/04-content-production-transparent.png`
- Dashboard: `../../assets/screens/fountainhead-ai-visibility-dashboard-v4-16x9.png`
- Prospecting: `../../assets/approved/05-local-prospecting-transparent.png`
- Website: `../../assets/generated/json-prompt-image-output.png`, captioned as the visual-direction output inside the larger image-to-build process rather than as the whole workflow.

- [ ] **Step 6: Link every related-work cluster locally**

Each workflow page links to at least three other V2 workflow routes and one relevant selected-work anchor or case page.

- [ ] **Step 7: Run focused and full tests**

Run: `node --test tests/v2-portfolio.test.mjs`

Expected: all V2 route and content tests pass.

Run: `npm test`

Expected: all repository tests pass with zero failures.

- [ ] **Step 8: Commit workflow pages**

```bash
git add v2/workflows v2/index.html tests/v2-portfolio.test.mjs
git commit -m "feat(v2): add detailed workflow case pages"
```

## Task 8: Extend Browser QA and Documentation

**Files:**
- Modify: `scripts/qa-v2.mjs`
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] **Step 1: Add all five workflow routes to browser QA**

```js
const workflowDetailPaths = [
  "content-production.html",
  "agency-management-dashboard.html",
  "presentation-publishing.html",
  "local-prospecting-enrichment.html",
  "image-to-website-production.html",
];
```

For each route and each width `1440`, `1024`, `768`, `390`, and `320`, assert HTTP success, no horizontal overflow, a visible purpose, at least five steps, a hero image with non-zero natural dimensions, and live related-work links.

- [ ] **Step 2: Add homepage material and environment checks**

Use `getComputedStyle` to assert the hero bezel radius is at least `24px`, the hero shadow is not `none`, and each project environment image has non-zero rendered width and height.

- [ ] **Step 3: Add accordion transition checks**

Click each workflow trigger, confirm `aria-expanded`, wait for the `data-workflow-transitioning="in"` state, confirm the panel media remains visible, and test Arrow/Home/End navigation.

- [ ] **Step 4: Add About pointer and scroll checks**

Move the mouse to two distant points inside `.about`, verify the V2 iframe receives two normalized pointer messages through an exposed test counter, scroll the breakout through its active range, and assert the arrow dash offset changes. Under reduced motion, verify the arrow is complete and the phrase remains readable.

- [ ] **Step 5: Update documentation**

Document:

- neutral palette and one yellow accent;
- Fraunces project/hero titles;
- shared screen bevel;
- exact environmental asset provenance;
- monochrome accordion motion and function;
- V2-only portrait bridge;
- five detailed V2 workflow routes;
- V1 isolation.

- [ ] **Step 6: Run tests and browser QA**

Run: `npm test`

Expected: zero failures.

Run: `node scripts/qa-v2.mjs`

Expected: homepage and five workflow routes pass at all five widths.

- [ ] **Step 7: Commit QA and documentation**

```bash
git add scripts/qa-v2.mjs AGENTS.md DESIGN.md docs/portfolio-working-notes.md
git commit -m "test(v2): verify photographic studio and workflow routes"
```

## Task 9: Capture, Audit, and Prove V1 Isolation

**Files:**
- No production edits unless verification exposes a defect.

- [ ] **Step 1: Capture required assessment images**

Run:

```bash
QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-photographic-studio node scripts/qa-v2.mjs
```

Expected captures:

- full homepage at `1440`, `1024`, `768`, `390`, and `320`;
- hero desktop/mobile;
- six Selected Work chapters desktop/mobile;
- five accordion states desktop/mobile;
- About start/mid/end desktop/mobile;
- five workflow-page heroes desktop/mobile.

- [ ] **Step 2: Inspect the captures visually**

Check for clipped bezels, shadow banding, illegible environmental images, oversized titles, text over photography, accordion content jumps, About collisions, and mobile horizontal overflow.

- [ ] **Step 3: Run the full verification suite fresh**

Run: `npm test`

Expected: zero failures.

Run: `node scripts/qa-v2.mjs`

Expected: all browser assertions pass.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Prove V1 isolation**

Run: `git diff --name-only d3f0cb4..HEAD`

Expected: only V2 files, V2 tests/QA, and portfolio documentation appear. Root `index.html`, root CSS/JS, proposal routes, and V1 workflow pages must not appear.

- [ ] **Step 5: Preserve unrelated user files**

Run: `git status --short`

Expected: `docs/design-exploration/` and `portfolio-style-round-scorecard.html` remain untracked and unmodified.

- [ ] **Step 6: Route any discovered defect back to its owning task**

If verification exposes a defect, update the exact production file and its existing regression test in Tasks 3–8, rerun `npm test` and `node scripts/qa-v2.mjs`, then commit the explicit files shown by `git status --short` with message `fix(v2): close photographic studio QA gaps`.

## Execution Choice

Execute inline in this thread using `superpowers:executing-plans`. Subagent execution is not available because the user did not authorize subagents and the active developer instruction prohibits inferring that authorization.
