# Portfolio Correction Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement each owned task. Do not revert unrelated changes.

**Goal:** Restore approved portfolio scale and sequencing, make the public proposal generator use the real Vertical Impression industry system, improve the About narrative animation, and make the Cool Runnings case study accurate and refreshable.

**Architecture:** The portfolio remains a static site with source-locked visuals and replaceable media. The proposal generator remains isolated in VI Automation but shares the established industry taxonomy, copy, radius, pricing, and creative rules. Cool Runnings metrics use a sanitized daily snapshot produced by the Cool Runnings deployment rather than exposing Google credentials to the portfolio.

**Tech Stack:** Static HTML/CSS/JavaScript, Next.js 16, Vercel Functions, Letz.ai, Mapbox, Postgres, Vercel Blob, Google Search Console/GA4 APIs.

---

### Task 1: Restore the approved Selected Work sequence and browser scale

**Files:**
- Modify: `index.html`
- Modify: `styles/selected-work.css`
- Verify: `app.js` accommodation controller remains unchanged

- [ ] Order projects as RCCV, Boutique Accommodation, Cool Runnings, proposal tool, Why Elevators, albums.
- [ ] Replace parity-dependent grid sizing with project-specific geometry.
- [ ] Give Boutique Accommodation an 840-860px desktop browser target and an 8:5 media viewport below a 34px browser bar.
- [ ] Remove the Boutique browser rotation and overhang that cause clipping.
- [ ] Preserve all three accommodation videos, scroll behavior, controls, posters, labels, and start offsets.
- [ ] Verify at 1440, 1024, 768, and 390px.

### Task 2: Correct hero positioning and About scroll narrative

**Files:**
- Modify: `index.html`
- Modify: `styles/hero.css`
- Modify: `styles/continuation.css`
- Modify: `app.js`

- [ ] Change the hero subhead to: “I build websites, product stories, AI-enabled workflows, and fun AI experiments.”
- [ ] Balance the line length at desktop, tablet landscape, tablet portrait, and mobile breakpoints without covering the video diagram.
- [ ] Change the About phrase to “even when the practical value is questionable.”
- [ ] Expand that complete phrase, then draw a materially larger arrow.
- [ ] Reveal “But there’s always value in learning from the process.” before the making-of control.
- [ ] Preserve pointer forwarding and every portrait asset.
- [ ] Provide a static, fully readable reduced-motion state.

### Task 3: Make the public proposal generator use the real VI system

**Files:**
- Modify: `/Users/michaelmckerracher/VI Automation/src/public-proposal/core.ts`
- Create: `/Users/michaelmckerracher/VI Automation/src/public-proposal/industry-config.ts`
- Modify: `/Users/michaelmckerracher/VI Automation/app/public-proposal/page.tsx`
- Modify: `/Users/michaelmckerracher/VI Automation/app/api/public-proposal/generate/route.ts`
- Modify: `/Users/michaelmckerracher/VI Automation/src/public-proposal/pdf-template.ts`
- Modify: `/Users/michaelmckerracher/VI Automation/tests/public-proposal.test.ts`

- [ ] Use the established 12-option taxonomy: accountant, auto dealer, chiropractor, dentist, gym, insurance, lawyer, medical, optometrist, real estate, veterinarian, and other.
- [ ] Reuse existing creative scenes/CTAs and mutable `proposal_copy` content rather than inventing new copy.
- [ ] Reuse established industry radii, `$70/screen`, `$1,000` minimum behavior, and `1/12` loop-share impression math.
- [ ] Match the dense Cedar & Steam letter proposal reference at `assets/samples/vi-generated-cedar-steam-proposal-refined.png` while preserving 8.5x11 output.
- [ ] Add exact taxonomy, copy fallback, pricing, impression, escaping, and one-page rendering tests.
- [ ] Deploy and perform one controlled production generation.

### Task 4: Correct the Cool Runnings programmatic SEO explanation

**Files:**
- Modify: `work-local-yard-care-seo-build.html`
- Modify: `styles/cool-runnings-case.css` only if the corrected module needs layout support

- [ ] Name the real `pseo-planner` method and show the real data flow.
- [ ] Explain the 6-city x 6-service AI-enriched JSON matrix and its rendered service-city pages.
- [ ] Explain the separate 66-guide deterministic JSON system.
- [ ] Show canonical inputs, Gemini enrichment fields, JSON outputs, renderer, internal links, structured data, sitemap, and retry path.
- [ ] Remove claims that unsupported content, duplication, or broken links are blocked until those checks are actual build gates.

### Task 5: Add a secure daily Cool Runnings metrics snapshot

**Files:**
- Create under `/Users/michaelmckerracher/Local Websites/Cool Runnings/Website/api/`
- Modify: `/Users/michaelmckerracher/Local Websites/Cool Runnings/Website/vercel.json`
- Modify: `work-local-yard-care-seo-build.html`
- Modify: `index.html`

- [ ] Define a versioned public aggregate contract for clicks, impressions, returned page rows at position 1-10, returned query rows, returned query rows at position 1-10, optional GA4 active users, date windows, and update status.
- [ ] Add a daily cron protected by `CRON_SECRET` and Google read-only Workload Identity Federation.
- [ ] Store only sanitized aggregates in a public Blob snapshot.
- [ ] Fetch the snapshot in the portfolio with last-known static values and a visible stale state.
- [ ] Do not publish query strings, credentials, OAuth material, or property identifiers.
- [ ] Enable the live refresh after the Google Search Console property and GA4 property grant the dedicated identity read access.

### Task 6: Integrated verification

- [ ] Compare the proposal PDF against the Cedar & Steam reference after rendering both to PNG.
- [ ] Confirm the Boutique browser reaches the approved scale and its wheel/controller transitions still work.
- [ ] Verify About animation order on desktop, tablet, and mobile plus reduced motion.
- [ ] Verify the portfolio loads with the metrics endpoint unavailable and with a valid snapshot.
- [ ] Run proposal unit tests, Next production build, static-site link/media checks, and breakpoint screenshots.
