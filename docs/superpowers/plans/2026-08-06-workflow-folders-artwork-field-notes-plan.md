# Workflow Folders, Artwork Surfaces, and Field Notes Retirement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage workflow accordion into readable stacked folders, give workflow artwork one consistent warm-grey card on homepage and detail pages, and remove Field Notes from every deployed surface while retaining the private renderer and source.

**Architecture:** Keep the existing semantic accordion markup, selection state, and 780ms panel transition. Change only its visual folder treatment and shared artwork surfaces. Treat Field Notes as a private build artifact: preserve `content/field-notes` and the renderer, but remove public discovery, promotion, sitemap mutation, and Vercel deployment.

**Tech Stack:** Static HTML, CSS, Node.js promotion/render scripts, Node test runner, Playwright/Puppeteer browser QA.

---

### Task 1: Lock the folder and artwork contracts with failing tests

**Files:**
- Modify: `tests/v2-visual-system-refinement.test.mjs`
- Modify: `tests/v2-latest-refinement.test.mjs`
- Modify: `tests/v2-production-reliability.test.mjs`
- Test: `tests/v2-visual-system-refinement.test.mjs`

- [ ] **Step 1: Replace the old vertical-spine assertions with the approved folder-tab contract**

Assert that desktop controls use horizontal text, a raised top tab, overlapping sheet depth, a visible selected tab, and a mobile reset. The test must require `.workflow-trigger-label`, reject `writing-mode`, require the active trigger to remain visible, and preserve the 780ms flex transition.

```js
test("workflow controls read as stacked folders with visible horizontal labels", async () => {
  const [html, css] = await Promise.all([read("v2/index.html"), read("v2/styles.css")]);
  assert.equal((html.match(/class="workflow-trigger-label"/g) || []).length, 5);
  assert.doesNotMatch(css, /writing-mode:\s*vertical/);
  assert.match(css, /\.workflow-trigger-label\s*\{[^}]*font-family:\s*var\(--font-sans\)[^}]*font-weight:\s*900/s);
  assert.match(css, /\.workflow-trigger::before\s*\{[^}]*border-radius:\s*[^;]*0\s+0/s);
  assert.match(css, /\.workflow-item\.is-active \.workflow-trigger\s*\{[^}]*visibility:\s*visible/s);
  assert.match(css, /flex-basis\s+780ms/);
  assert.match(css, /@media \(max-width: 1099px\)[\s\S]*?\.workflow-trigger\s*\{[^}]*transform:\s*none/s);
});
```

- [ ] **Step 2: Add a shared warm-grey artwork-surface test**

Assert that homepage figures and workflow detail artwork use the same CSS variable, detail pages no longer use `#111412`, and responsive images remain `object-fit: contain`.

```js
test("homepage and workflow pages share one warm-grey artwork card", async () => {
  const [homeCss, detailCss] = await Promise.all([
    read("v2/styles.css"),
    read("v2/workflows/workflow-detail.css"),
  ]);
  assert.match(homeCss, /--workflow-art-surface:\s*#e7e8e3/);
  assert.match(homeCss, /\.workflow-panel figure\s*\{[^}]*background:\s*var\(--workflow-art-surface\)/s);
  assert.match(detailCss, /\.workflow-artwork\s*\{[^}]*background:\s*var\(--workflow-art-surface\)/s);
  assert.doesNotMatch(detailCss, /\.workflow-artwork\s*\{[^}]*background:\s*#111412/s);
  assert.match(detailCss, /\.workflow-artwork img\s*\{[^}]*object-fit:\s*contain/s);
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
node --test tests/v2-visual-system-refinement.test.mjs tests/v2-latest-refinement.test.mjs tests/v2-production-reliability.test.mjs
```

Expected: FAIL because `.workflow-trigger-label`, visible active folder tabs, and the shared detail artwork surface are not implemented.

### Task 2: Implement the stacked-folder accordion and grey artwork cards

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/workflows/workflow-detail.css`
- Generated: `index.html`
- Test: `tests/v2-visual-system-refinement.test.mjs`

- [ ] **Step 1: Give each workflow control a dedicated horizontal label element**

Wrap each existing control label without changing button IDs, regions, ARIA wiring, or item order:

```html
<strong class="workflow-trigger-label">Content</strong>
```

- [ ] **Step 2: Replace vertical rails with overlapping folder sheets**

Use the existing `.workflow-item`, `.workflow-trigger`, and `.workflow-panel` structure. Keep numeric desktop flex bases and the 780ms transition. Render the raised label lip with `::before`, horizontal label text, adjacent charcoal values, and a visible active control joined to the open body. Hover/focus lifts the closed sheet; it never selects it.

```css
:root { --workflow-art-surface: #e7e8e3; }

.workflow-trigger {
  position: relative;
  flex: 0 0 112px;
  min-width: 112px;
  padding: 88px 22px 28px;
  transform: translate3d(var(--stack-x), var(--stack-y), var(--stack-z));
}
.workflow-trigger::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12px;
  width: min(168px, calc(100% - 12px));
  height: 58px;
  border-radius: 14px 14px 0 0;
  background: var(--rail);
}
.workflow-trigger-label {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 28px;
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 900;
  white-space: nowrap;
}
.workflow-item.is-active .workflow-trigger {
  visibility: visible;
  flex-basis: 168px;
}
.workflow-panel figure { background: var(--workflow-art-surface); }
```

At widths below 1100px, reset perspective and transforms, stack rows vertically, keep the label lip at upper left, and preserve 44px minimum targets and the existing vertical reveal.

- [ ] **Step 3: Replace the workflow detail black wrapper with the shared warm-grey surface**

```css
.workflow-artwork {
  background: var(--workflow-art-surface);
}
.workflow-artwork img {
  width: 100%;
  max-height: 680px;
  object-fit: contain;
}
```

Do not crop, regenerate, recolour, or replace the approved desktop/mobile exports.

- [ ] **Step 4: Promote the canonical V2 homepage**

Run:

```bash
npm run promote:v2
```

Expected: root `index.html` matches the canonical V2 structure with rewritten asset paths.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run:

```bash
node --test tests/v2-visual-system-refinement.test.mjs tests/v2-latest-refinement.test.mjs tests/v2-production-reliability.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the workflow presentation change**

```bash
git add v2/index.html v2/styles.css v2/workflows/workflow-detail.css index.html tests/v2-visual-system-refinement.test.mjs tests/v2-latest-refinement.test.mjs tests/v2-production-reliability.test.mjs
git commit -m "Refine workflow folders and artwork surfaces"
```

### Task 3: Retire Field Notes from production while preserving private tooling

**Files:**
- Modify: `tests/weekly-field-notes-site.test.mjs`
- Modify: `tests/production-root-v2.test.mjs`
- Modify: `tests/site-release-security.test.mjs`
- Modify: `tests/weekly-field-notes-render.test.mjs`
- Modify: `scripts/promote-v2-to-root.mjs`
- Modify: `scripts/weekly-field-notes/render.mjs`
- Modify: `v2/index.html`
- Modify: `sitemap.xml`
- Modify: `.vercelignore`
- Generated: `index.html`

- [ ] **Step 1: Rewrite public-surface tests to require Field Notes retirement**

The site test must prove there is no homepage nav link, RSS discovery, sitemap URL, promotion copy, or deploy surface, while the private renderer/source remain.

```js
test("Field Notes remains private and has no deployed discovery surface", async () => {
  const [sourceHome, productionHome, sitemap, ignore, promoter] = await Promise.all([
    read("v2/index.html"), read("index.html"), read("sitemap.xml"),
    read(".vercelignore"), read("scripts/promote-v2-to-root.mjs"),
  ]);
  for (const html of [sourceHome, productionHome]) {
    assert.doesNotMatch(html, /href="\/field-notes\//);
    assert.doesNotMatch(html, /application\/rss\+xml/);
  }
  assert.doesNotMatch(sitemap, /field-notes/);
  assert.match(ignore, /^field-notes\/$/m);
  assert.match(ignore, /^v2\/field-notes\/$/m);
  assert.doesNotMatch(promoter, /cp\(new URL\("v2\/field-notes\//);
});
```

- [ ] **Step 2: Change renderer tests so local output remains deterministic but sitemap stays untouched**

Keep index, article, schema, feed, privacy, and byte-identical rendering assertions. Replace the sitemap article assertion with:

```js
assert.doesNotMatch(sitemap, /field-notes/);
```

- [ ] **Step 3: Run the Field Notes and release tests and verify RED**

Run:

```bash
node --test tests/weekly-field-notes-site.test.mjs tests/weekly-field-notes-render.test.mjs tests/production-root-v2.test.mjs tests/site-release-security.test.mjs
```

Expected: FAIL because Field Notes is still linked, indexed, promoted, and deployed.

- [ ] **Step 4: Remove public discovery and deployment**

- Remove the RSS alternate and Field Notes nav link from `v2/index.html`.
- Remove every Field Notes URL from `sitemap.xml`.
- Remove the `cp(v2/field-notes, field-notes)` operation from the promotion script.
- Add `field-notes/` and `v2/field-notes/` to `.vercelignore`.
- Remove `updateSitemap()` and its call from the renderer so local rendering cannot republish URLs.
- Remove Field Notes pages from GA4's deployed-page test list because they are no longer public.
- Keep `content/field-notes`, `scripts/weekly-field-notes`, private tests, and locally generated files unchanged.

- [ ] **Step 5: Promote and run the focused tests GREEN**

Run:

```bash
npm run promote:v2
node --test tests/weekly-field-notes-site.test.mjs tests/weekly-field-notes-render.test.mjs tests/production-root-v2.test.mjs tests/site-release-security.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the publication boundary**

```bash
git add .vercelignore sitemap.xml scripts/promote-v2-to-root.mjs scripts/weekly-field-notes/render.mjs v2/index.html index.html tests/weekly-field-notes-site.test.mjs tests/weekly-field-notes-render.test.mjs tests/production-root-v2.test.mjs tests/site-release-security.test.mjs
git commit -m "Retire Field Notes from production"
```

### Task 4: Update source truth and complete verification

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`
- Modify: `docs/superpowers/plans/2026-08-06-workflow-folders-artwork-field-notes-plan.md`

- [ ] **Step 1: Update the design and publication contracts**

Document:

- horizontal raised folder tabs and visible active labels;
- the black folder chapter plus shared warm-grey homepage/detail artwork cards;
- full-background exports remain intact and transparent assets never resolve onto black;
- Field Notes source and tooling are private and excluded from nav, RSS, sitemap, promotion, and Vercel.

- [ ] **Step 2: Run the complete automated test suite**

Run:

```bash
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 3: Run permanent responsive browser QA**

Run:

```bash
node scripts/qa-v2.mjs
node tests/qa-v2-home-breakpoints.mjs
```

Expected: 1440, 1024, 768, 390, and 320 pixel checks pass with no horizontal overflow, tab clipping, hidden focus, image cropping, or workflow-detail regression.

- [ ] **Step 4: Inspect the change boundary**

Run:

```bash
git diff --check
git status --short
git diff HEAD~2 --stat
```

Expected: only workflow presentation, Field Notes publication boundary, tests, generated homepage, and documentation changed.

- [ ] **Step 5: Commit documentation and plan completion**

```bash
git add AGENTS.md DESIGN.md docs/portfolio-working-notes.md docs/superpowers/plans/2026-08-06-workflow-folders-artwork-field-notes-plan.md
git commit -m "Document workflow folders and private Field Notes boundary"
```
