# Interactive Portfolio Showcases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight scroll-controlled accommodation showcase to the portfolio and a separate public-safe Vertical Impression proposal generator using Letz.ai, Mapbox, and read-only inventory.

**Architecture:** The accommodation showcase stays inside the static portfolio and uses three locally hosted, scrub-friendly videos with one active scene at a time. The proposal generator lives in VI Automation as a new public Next.js page and dedicated API route; it does not call or expose the internal proposal page or API and does not write to Google Drive, campaign records, or outreach tables.

**Tech Stack:** Static HTML/CSS/JavaScript, WebM/VP9, Next.js 16, React 19, TypeScript, Letz.ai, Mapbox Static Images/Geocoding, Vercel Postgres read-only inventory queries, Puppeteer PDF generation.

---

### Task 1: Accommodation media preparation

**Files:**
- Create: `assets/videos/accommodation/overview-scroll.webm`
- Create: `assets/videos/accommodation/treehouse-scroll.webm`
- Create: `assets/videos/accommodation/cabin-scroll.webm`

- [ ] Re-encode the three approved 1440x900 recordings to 960x600 VP9 with frequent keyframes for responsive timeline seeking.
- [ ] Verify each output has the expected dimensions, duration, and a combined payload below the existing source recordings.

### Task 2: Accommodation scroll controller

**Files:**
- Modify: `index.html`
- Modify: `styles/selected-work.css`
- Modify: `app.js`

- [ ] Replace the single autoplay montage in the Boutique Accommodation browser with three stacked videos and route labels.
- [ ] Add a controller that maps wheel delta to current video time only while the pointer is inside the browser.
- [ ] Crossfade forward at the end and backward at the beginning; release normal page scrolling at the first and last boundaries.
- [ ] Add explicit previous/next controls for touch and keyboard users.
- [ ] Verify desktop wheel, mobile controls, reduced motion, and no horizontal overflow.

### Task 3: Public proposal UI

**Files:**
- Create: `/Users/michaelmckerracher/VI Automation/app/public-proposal/page.tsx`
- Create: `/Users/michaelmckerracher/VI Automation/app/public-proposal/public-proposal.module.css`

- [ ] Build a three-field form: business name, address, and business type.
- [ ] Show deterministic stages for geocoding, inventory matching, image generation, layout, and PDF completion.
- [ ] Return the generated PDF as a downloadable object URL without exposing server credentials or internal records.
- [ ] Add validation, failure states, and an explicit one-generation-at-a-time lock.

### Task 4: Isolated proposal API

**Files:**
- Create: `/Users/michaelmckerracher/VI Automation/app/api/public-proposal/generate/route.ts`
- Create: `/Users/michaelmckerracher/VI Automation/src/public-proposal/prompt.ts`
- Create: `/Users/michaelmckerracher/VI Automation/src/public-proposal/pdf-template.ts`

- [ ] Validate and normalize the three public inputs.
- [ ] Geocode the address with server-side Mapbox credentials.
- [ ] Read nearby screen inventory without returning the raw inventory dataset to the browser.
- [ ] Generate one constrained 16:9 business advertisement through the existing server-side Letz.ai client.
- [ ] Composite the advertisement into the existing elevator-screen mockup.
- [ ] Generate a Mapbox static map and calculate proposal totals.
- [ ] Render one redesigned 8.5x11 PDF in Chromium and return it directly.
- [ ] Exclude Google Drive uploads, Vercel Blob writes, internal proposal copy tables, campaign writes, sales-rep data, custom URLs, and internal API calls.

### Task 5: Verification and portfolio linkage

**Files:**
- Modify: `index.html`
- Test: `/Users/michaelmckerracher/VI Automation/tests/public-proposal.test.ts`

- [ ] Add unit coverage for input validation, prompt constraints, and PDF data calculation.
- [ ] Run the VI Automation production build.
- [ ] Run one live Letz.ai generation with a controlled test business.
- [ ] Verify the returned file is a valid letter-size PDF and contains no API keys or internal URLs.
- [ ] Link the Selected Work proposal item to the public demo while retaining the sample PDF link.
- [ ] Capture desktop, tablet, and mobile screenshots of both portfolio interactions.
