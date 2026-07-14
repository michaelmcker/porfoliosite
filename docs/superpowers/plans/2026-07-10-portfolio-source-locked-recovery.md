# Portfolio Source-Locked Recovery Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the approved hero, build Selected Work as a faithful code translation of its approved layout reference, and build Selected Workflows around the exact approved workflow graphics without reducing them to thumbnails.

**Architecture:** Treat approved images as immutable design specifications and actual screenshots/videos as content assets. Build Hero, Selected Work, and Selected Workflows as separate components with separate responsive rules; never merge Portfolio outputs with Workflow explanations. Use isolated generated device/artifact assets only after they are reviewed, then implement and compare desktop/mobile screenshots against the approved references.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, existing MP4 hero assets, generated PNG workflow/device assets, Playwright screenshot verification.

* * *
## 1. Source Of Truth
### Approved reference bundle
| File | Status | What it controls |
| --- | --- | --- |
| `assets/approved/01-hero-desktop-mobile.png` | Approved | Hero composition, typography hierarchy, paper/grid treatment, hero copy placement, desktop/mobile framing |
| `assets/approved/02-selected-work-layout-desktop-mobile.png` | Approved layout target; coded version not approved | Selected Work composition, artifact scale, alternating rhythm, compact total height, desktop/mobile ordering |
| `assets/approved/03-selected-workflows-layout-desktop-mobile.png` | Approved layout target | Workflow selector rail, dominant active visual, description placement, mobile accordion behavior |
| `assets/approved/04-content-production-approved.png` | Approved exact visual | Search-optimized content workflow; do not regenerate or replace |
| `assets/approved/05-local-prospecting-approved.png` | Approved exact visual | Local prospecting and enrichment workflow; use verbatim on desktop |
| `assets/approved/06-proposal-direction-letter-needed.png` | Approved direction, not final format | Proposal visual language; final asset must be rebuilt at 8.5 x 11 |
| `assets/approved/07-outcomes-layout-desktop-mobile.png` | Approved for a later phase | Outcomes composition; outside the immediate recovery scope |
### Approved hero runtime assets
- `assets/videos/portfolio-hero-system-map-desktop-4k-sparse-loop.mp4`
  
- `assets/videos/portfolio-hero-system-map-mobile-1080p.mp4`
  
- `assets/videos/portfolio-hero-system-map-desktop-sparse-loop-poster.png`
  
- `assets/videos/portfolio-hero-system-map-mobile-poster.png`
  
### Do not use as source truth
- The current stripped-down `index.html` body.
  
- Any generated full-page image not listed above.
  
- `assets/workflows/content-workflow-approved-stage.png`; it replaced an already approved, more detailed graphic and is rejected.
  
- Existing CSS laptop/browser frames as final visual assets; they have repeatedly drifted from the approved device treatment.
  

* * *
## 2. Page Scope And Order
This recovery pass builds only:

1. Existing header.
  
2. Approved Hero.
  
3. Selected Work.
  
4. Selected Workflows.
  

Outcomes, About, Experience, and Contact remain out of scope until these first three visual sections are approved in code.

* * *
## 3. What The Site Will Show
### Hero
- Michael McKerracher.
  
- Marketing Engineer.
  
- Copy from the approved image: “I build websites, product stories, sales material, and AI-enabled GTM systems that help teams explain, sell, and scale.”
  
- `View selected work` and `Contact` actions.
  
- Existing approved desktop/mobile workflow-map videos.
  
- No selected-work rail inside the hero.
  
### Selected Work
1. **RCCV**
  
  - Large laptop artifact.
    
  - Real RCCV screenshot.
    
  - `View live site` and `View case study` links.
    
2. **Boutique accommodation**
  
  - Large browser-window artifact.
    
  - Real boutique accommodation screenshot.
    
  - One `View project` link.
    
3. **Digital out-of-home proposal tool**
  
  - Intentionally smaller 8.5 x 11 proposal thumbnail.
    
  - `Click to view larger` opens an accessible modal.
    
4. **Agency management dashboard**
  
  - Large close browser-window artifact.
    
  - Label and copy describe organic search, AI search, content operations, client delivery, and opportunity data.
    
5. **Making an overlooked category interesting**
  
  - Separate dark band after the four selected works.
    
  - OOH-la-la and Out Of Home Into My Heart covers.
    
  - Separate Spotify links for both releases.
    
### Selected Workflows
1. Search-optimized content production.
  
2. Local prospecting and enrichment.
  
3. Presentation publishing.
  
4. Image-to-website production.
  

The first two have approved final visuals. Presentation publishing and image-to-website production need isolated image approval before they become active states.

* * *
## 4. How Workflow Graphics Avoid The Thumbnail Problem
### Desktop
- Use the approved selector composition: a 280-320px workflow rail and a dominant 950-1100px visual stage.
  
- Render approved workflow images with `width: 100%; height: auto; object-fit: contain;`.
  
- Never put the active visual inside a second card, browser frame, or nested decorative panel.
  
- Never cap the stage at 500-800px.
  
- Keep the active image at no less than 70% of its 1672px source width on a 1440px viewport.
  
- Keep the title/description below the visual, matching `03-selected-workflows-layout-desktop-mobile.png`.
  

Target layout:

```css
.selected-workflows {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 48px;
}

.workflow-stage img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
```
### Mobile
Do not shrink a 1672 x 941 desktop diagram to 320px.

- Generate a dedicated vertical mobile visual for each workflow from the same approved source content.
  
- Use `<picture>` to switch between desktop and mobile assets.
  
- The mobile visual must stack Research, Human Review, and Output vertically, at readable text size.
  
- The active workflow expands immediately below its selector row, as shown in the approved mobile reference.
  
- No horizontal pan as the primary presentation. Full-size modal can exist as a secondary inspection option.
  

Target markup:

```html
<picture class="workflow-visual">
  <source media="(max-width: 760px)" srcset="assets/approved/content-production-mobile.png">
  <img src="assets/approved/04-content-production-approved.png" alt="Search-optimized content production workflow">
</picture>
```

**Approval gate:** mobile workflow assets must be generated and reviewed before responsive workflow code is accepted.

* * *
## 5. How Selected Work Is Translated Exactly
### Image preparation first
Generate four isolated, implementation-ready artifact images using the real screenshots:

1. RCCV inside the exact black laptop treatment.
  
2. Boutique accommodation inside the exact light browser treatment.
  
3. Proposal as an exact 8.5 x 11 sheet.
  
4. Agency management dashboard inside the exact light browser treatment with a closer crop.
  

These are isolated artifacts, not new full-page designs. Review them together against `02-selected-work-layout-desktop-mobile.png` before writing section HTML.
### Code translation
- Build one 12-column editorial grid, not four viewport-height rows.
  
- Match the approved artifact positions and compact total section height.
  
- Use explicit grid placement for each artifact and copy block.
  
- Keep typography subordinate to the work images.
  
- Use fine routing lines only where visible in the reference.
  
- Mobile uses the exact approved stack order and scale.
  

Target structure:

```html
<section class="selected-work" id="work">
  <header class="selected-work__header">...</header>
  <article class="selected-work__item selected-work__item--rccv">...</article>
  <article class="selected-work__item selected-work__item--stay">...</article>
  <article class="selected-work__item selected-work__item--proposal">...</article>
  <article class="selected-work__item selected-work__item--dashboard">...</article>
</section>
<section class="album-work">...</section>
```

Desktop placement contract:

```css
.selected-work {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
}

.selected-work__item--rccv { grid-column: 1 / -1; }
.selected-work__item--stay { grid-column: 1 / -1; }
.selected-work__item--proposal { grid-column: 1 / 7; }
.selected-work__item--dashboard { grid-column: 5 / -1; }
```

This grid must be tuned against the reference screenshot, not converted into generic equal rows.

* * *
## 6. Implementation Tasks
### Task 1: Restore the approved hero only
**Files:**

- [ ] 
  
  Modify: `index.html`
  
- [ ] 
  
  Create: `styles/hero.css`
  
- [ ] 
  
  Restore the hero markup using the approved copy and existing desktop/mobile videos.
  
- [ ] 
  
  Add only hero-specific CSS in `styles/hero.css`.
  
- [ ] 
  
  Capture 1440 x 1000, 900 x 900, and 390 x 844 screenshots.
  
- [ ] 
  
  Compare against `assets/approved/01-hero-desktop-mobile.png`.
  
- [ ] 
  
  Stop for visual approval before building Selected Work.
  

Verification:

```bash
npx playwright screenshot --browser chromium --viewport-size "1440,1000" http://127.0.0.1:8787/index.html artifacts/review/hero-desktop.png
npx playwright screenshot --browser chromium --viewport-size "390,844" http://127.0.0.1:8787/index.html artifacts/review/hero-mobile.png
```

Expected: approved hero is the first viewport; no Portfolio or Workflow styles influence it.
### Task 2: Generate and approve isolated Selected Work artifacts
**Files:**

- [ ] 
  
  Create: `assets/portfolio/rccv-laptop.png`
  
- [ ] 
  
  Create: `assets/portfolio/boutique-browser.png`
  
- [ ] 
  
  Create: `assets/portfolio/proposal-letter.png`
  
- [ ] 
  
  Create: `assets/portfolio/agency-dashboard-browser.png`
  
- [ ] 
  
  Generate each artifact separately from its real screenshot.
  
- [ ] 
  
  Preserve the device treatments from `02-selected-work-layout-desktop-mobile.png`.
  
- [ ] 
  
  Render the proposal at exact 8.5 x 11 proportions.
  
- [ ] 
  
  Assemble a desktop/mobile review board containing only these four artifacts.
  
- [ ] 
  
  Stop for approval before writing Selected Work HTML.
  

Expected: four approved isolated artifact PNGs, not a new page mockup.
### Task 3: Implement Selected Work from the approved layout
**Files:**

- [ ] 
  
  Modify: `index.html`
  
- [ ] 
  
  Create: `styles/selected-work.css`
  
- [ ] 
  
  Modify: `app.js`
  
- [ ] 
  
  Add semantic Selected Work markup and real links.
  
- [ ] 
  
  Implement the 12-column desktop grid.
  
- [ ] 
  
  Implement the approved mobile stack.
  
- [ ] 
  
  Add the proposal modal with focus return and Escape support.
  
- [ ] 
  
  Add the dark album band with two Spotify links.
  
- [ ] 
  
  Capture the entire section as one desktop image and one mobile image.
  
- [ ] 
  
  Compare side by side with `02-selected-work-layout-desktop-mobile.png`.
  
- [ ] 
  
  Stop for visual approval before building workflows.
  

Expected: section height and image/text balance visibly match the reference; artifacts are large without becoming separate full-screen sections.
### Task 4: Generate dedicated mobile workflow visuals
**Files:**

- [ ] 
  
  Create: `assets/approved/content-production-mobile.png`
  
- [ ] 
  
  Create: `assets/approved/local-prospecting-mobile.png`
  
- [ ] 
  
  Generate a vertical content-system visual preserving all approved source stages.
  
- [ ] 
  
  Generate a vertical local-prospecting visual preserving Maps, enrichment, matching, and handoff.
  
- [ ] 
  
  Review both at 390px CSS width.
  
- [ ] 
  
  Stop for approval.
  

Expected: text and stage labels remain readable without horizontal scrolling.
### Task 5: Implement Selected Workflows from the approved layout
**Files:**

- [ ] 
  
  Modify: `index.html`
  
- [ ] 
  
  Create: `styles/selected-workflows.css`
  
- [ ] 
  
  Modify: `app.js`
  
- [ ] 
  
  Build the desktop selector rail and dominant stage.
  
- [ ] 
  
  Use `04-content-production-approved.png` and `05-local-prospecting-approved.png` unchanged on desktop.
  
- [ ] 
  
  Use `<picture>` for approved mobile alternatives.
  
- [ ] 
  
  Keep presentation publishing and image-to-website visible but inactive until their assets are approved.
  
- [ ] 
  
  Implement accessible tab behavior and mobile active-row expansion.
  
- [ ] 
  
  Capture the entire section at desktop/mobile sizes.
  
- [ ] 
  
  Compare against `03-selected-workflows-layout-desktop-mobile.png`.
  
- [ ] 
  
  Stop for visual approval.
  

Expected: the active visual is the dominant object in the section and is readable without opening a modal.
### Task 6: Visual regression and interaction verification
**Files:**

- [ ] 
  
  Create: `tests/portfolio-visual.spec.js`
  
- [ ] 
  
  Verify Hero desktop/mobile video selection.
  
- [ ] 
  
  Verify RCCV has two links and boutique accommodation has one.
  
- [ ] 
  
  Verify proposal modal opens, closes with Escape, and returns focus.
  
- [ ] 
  
  Verify both album links target their correct Spotify releases.
  
- [ ] 
  
  Verify workflow tab switching preserves a stable stage height.
  
- [ ] 
  
  Verify there is no horizontal overflow at 1440, 900, 760, 390, and 360px.
  
- [ ] 
  
  Save final screenshots under `artifacts/review/source-locked/`.
  

Expected: all interaction checks pass and final screenshots are approved before any later section is introduced.

* * *
## 7. Forbidden Changes During Recovery
- Do not regenerate the hero.
  
- Do not rewrite approved hero copy.
  
- Do not replace the approved content-production graphic.
  
- Do not replace the approved local-prospecting graphic.
  
- Do not combine Selected Work and Selected Workflows.
  
- Do not implement Portfolio as repeated viewport-height rows.
  
- Do not shrink workflow diagrams into thumbnails.
  
- Do not add Outcomes, About, Experience, or Contact until the three recovery sections pass visual review.
  
- Do not keep layering overrides into the existing `styles.css`; use section-specific stylesheets.
  

* * *
## 8. Approval Checkpoints
1. Hero screenshot approval.
  
2. Isolated Selected Work artifact approval.
  
3. Selected Work desktop/mobile code approval.
  
4. Mobile workflow visual approval.
  
5. Selected Workflows desktop/mobile code approval.
  
6. Only then plan the rest of the page.
