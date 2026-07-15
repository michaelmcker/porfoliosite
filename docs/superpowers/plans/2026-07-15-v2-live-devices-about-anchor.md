# V2 Live Devices and Anchored About Phrase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Boutique Accommodation a selectable HTML browser, anchor the About phrase before growth, and present Cool Runnings in a scroll-opening transparent laptop.

**Architecture:** Keep V2 isolated. Add one same-origin accommodation embed, use the existing rAF-throttled reveal progress only for outer object transforms, and reuse the transparent graphite frame as layered lid/base media around the existing Cool Runnings film.

**Tech Stack:** Static HTML, CSS custom properties and 3D transforms, vanilla JavaScript, Node test runner, Playwright browser QA.

---

### Task 1: Define the new content and interaction contract

**Files:**
- Modify: `tests/v2-portfolio.test.mjs`
- Modify: `scripts/qa-v2.mjs`

- [ ] Require a same-origin accommodation iframe and reject `data-accommodation-scrub`, `showcase-scroll.mp4`, `showcase-scroll.webm`, and the image fallback.
- [ ] Require the full inline About sentence plus an `aria-hidden` anchored focus copy.
- [ ] Require Cool Runnings lid, base, transparent frame, and existing screen film markup.
- [ ] Replace video-time accommodation QA with text selection, anchor clicking, iframe-local scrolling, and outer-shell rotation checks.
- [ ] Add About coordinate/typography and Cool Runnings lid-angle browser checks.
- [ ] Run `node --test tests/v2-portfolio.test.mjs` and confirm failure against the current recorded-media implementation.

### Task 2: Build the selectable accommodation preview

**Files:**
- Create: `v2/embeds/okanagan-treehouse.html`
- Create: `v2/assets/accommodation/hero-poster.webp`
- Create: `v2/assets/accommodation/treehouse.webp`
- Create: `v2/assets/accommodation/cabin.webp`
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/app.js`

- [ ] Save the three exact current-site photographs locally.
- [ ] Build a semantic overview, Treehouse, and Cabin document with selectable copy and working links.
- [ ] Replace the accommodation video/fallback with the iframe inside the existing black browser chrome.
- [ ] Remove accommodation duration, seeking, manual-wheel, and deferred-video-loading code.
- [ ] Map `--object-reveal` to a small two-axis browser rotation while preserving iframe pointer interaction.

### Task 3: Anchor and grow the About phrase

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/app.js`

- [ ] Render the full sentence inline in paragraph typography.
- [ ] Add the hidden focus copy and calculate its origin from the inline phrase relative to `.about-copy`.
- [ ] Crossfade the two copies at the same coordinates, then interpolate actual font size, weight, colour, and the existing upward movement.
- [ ] Recalculate the anchor on resize and before each About progress update.

### Task 4: Build the Cool Runnings opening laptop

**Files:**
- Modify: `v2/index.html`
- Modify: `v2/styles.css`
- Modify: `v2/app.js`

- [ ] Place the existing Cool Runnings film in the graphite frame's transparent screen aperture.
- [ ] Layer the same frame as a rotating lid and stationary base using clipped wrappers.
- [ ] Drive the lid from a closed `rotateX` pose to an open pose with `--object-reveal`; set the reduced-motion state fully open.
- [ ] Keep deferred film loading, autoplay visibility control, and the existing poster.

### Task 5: Verify and document

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `docs/portfolio-working-notes.md`

- [ ] Run the static V2 tests and correct only implementation defects.
- [ ] Run `QA_V2_SCREENSHOT_DIR=/tmp/portfolio-v2-live-devices node scripts/qa-v2.mjs` and inspect About, Boutique, Cool Runnings, desktop, and mobile captures.
- [ ] Record the same-origin selectable browser, anchored phrase, and layered laptop rules in the three V2 context documents.
- [ ] Run `npm test`, `git diff --check`, and a diff proving root V1 implementation files did not change.
