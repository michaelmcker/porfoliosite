# V2 Proposal Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated V2 proposal-builder page with four responsive annotations while preserving and hardening the existing public proposal API boundary.

**Architecture:** Add a V2-only HTML/CSS presentation that reuses the existing root `proposal-generator.js` and exact API/PDF contract through unchanged data hooks. Add static route security headers and small server-side request guards without moving Mapbox, LetzAI, inventory, or PDF generation into browser code. Keep V1 presentation files untouched.

**Tech Stack:** Semantic HTML, CSS, browser JavaScript, Node.js serverless functions, Puppeteer/Chromium PDF generation, Vercel static hosting/functions, Node test runner, Puppeteer browser QA.

---

### Task 1: Lock the V2 page contract

**Files:**
- Create: `tests/v2-proposal-builder.test.mjs`
- Modify: `tests/standalone-proposal.test.mjs`

- [ ] **Step 1: Write the failing V2 route test**

Add assertions that read `v2/proposal-generator.html`, `v2/proposal-generator.css`, `v2/index.html`, and `proposal-generator.js`, then require:

```js
assert.match(html, /data-proposal-form/);
assert.match(html, /src="\.\.\/proposal-generator\.js/);
assert.match(homepage, /href="proposal-generator\.html">Try the generator/);
assert.equal((html.match(/class="proposal-callout/g) || []).length, 4);
for (const label of ["Custom ad", "Custom copy", "Live screen count", "Local map"]) {
  assert.ok(html.includes(label));
}
assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.proposal-annotation-path\s*\{[^}]*display:\s*none/);
assert.match(client, /\/api\/proposal\/suggest/);
assert.match(client, /\/api\/proposal\/generate/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/v2-proposal-builder.test.mjs`

Expected: FAIL because `v2/proposal-generator.html` and its stylesheet do not exist.

### Task 2: Build the annotated V2 page

**Files:**
- Create: `v2/proposal-generator.html`
- Create: `v2/proposal-generator.css`
- Modify: `v2/index.html`

- [ ] **Step 1: Add the V2 semantic page shell**

Create a V2 header, approved introduction, working form, approved-sample PDF preview, loading state, result actions, four annotations, supporting statement, and footer. Preserve every data hook consumed by the existing generator script and load it with:

```html
<script src="../proposal-generator.js?v=20260716-1" type="module"></script>
```

Each callout uses a visible heading and exact explanation from the approved design. Desktop arrows are decorative SVG paths with `aria-hidden="true"`; the textual callouts remain semantic HTML.

- [ ] **Step 2: Add the isolated V2 styling**

Import `styles.css`, then make `proposal-generator.css` responsible only for this page. Use V2 tokens, a white canvas, charcoal workspace, hard-yellow annotations, a sticky form, a slightly rotated letter-sized proposal, and responsive annotation changes.

At `max-width: 700px`:

```css
.proposal-annotation-path { display: none; }
.proposal-callouts { grid-template-columns: 1fr; }
.proposal-pin { display: grid; }
.proposal-preview__frame { transform: none; }
```

Ensure the annotation layer uses `pointer-events: none` and never blocks form, PDF, Open PDF, or Download controls.

- [ ] **Step 3: Point only the V2 homepage to the V2 route**

Change:

```html
<a href="../proposal-generator.html">Try the generator</a>
```

to:

```html
<a href="proposal-generator.html">Try the generator</a>
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/v2-proposal-builder.test.mjs`

Expected: PASS.

### Task 3: Harden the browser and API boundary

**Files:**
- Create: `api/_lib/proposal/request-security.js`
- Modify: `api/proposal/generate.js`
- Modify: `api/proposal/suggest.js`
- Modify: `vercel.json`
- Modify: `tests/standalone-proposal.test.mjs`
- Modify: `tests/v2-proposal-builder.test.mjs`

- [ ] **Step 1: Write failing request-security tests**

Test that the helper rejects oversized bodies, non-JSON generation requests, and cross-site browser requests while allowing same-origin and server-to-server requests:

```js
assert.throws(() => assertSameOrigin({ headers: { origin: "https://evil.example", host: "portfolio.example" } }), /Cross-site/);
assert.doesNotThrow(() => assertSameOrigin({ headers: { origin: "https://portfolio.example", host: "portfolio.example" } }));
assert.throws(() => assertJsonRequest({ headers: { "content-type": "text/plain" } }), /application\/json/);
assert.throws(() => assertBodySize({ headers: { "content-length": "20000" } }, 16_384), /too large/);
```

Also assert that V2 response headers include CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Content-Type-Options`.

- [ ] **Step 2: Run the security tests and verify RED**

Run: `node --test tests/standalone-proposal.test.mjs tests/v2-proposal-builder.test.mjs`

Expected: FAIL because the request helper and V2 headers do not exist.

- [ ] **Step 3: Implement minimal server request guards**

Create pure helpers:

```js
export function assertSameOrigin(request) {
  const origin = request.headers?.origin;
  if (!origin) return;
  const host = request.headers?.['x-forwarded-host'] || request.headers?.host;
  if (!host || new URL(origin).host !== host) throw new RequestSecurityError(403, 'Cross-site request rejected.');
}

export function assertJsonRequest(request) {
  if (!String(request.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new RequestSecurityError(415, 'Use application/json.');
  }
}

export function assertBodySize(request, maximum = 16_384) {
  const length = Number(request.headers?.['content-length'] || 0);
  if (Number.isFinite(length) && length > maximum) throw new RequestSecurityError(413, 'Request body is too large.');
}
```

Call these before generation work. Cap suggestion queries at 180 characters. Return the helper status without leaking stack traces or credentials.

- [ ] **Step 4: Add scoped Vercel security headers**

Add a `/v2/(.*)` header rule with:

```json
[
  { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests" },
  { "key": "X-Content-Type-Options", "value": "nosniff" },
  { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
  { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
  { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" }
]
```

Keep API `private, no-store` and `nosniff` headers.

- [ ] **Step 5: Run the security tests and verify GREEN**

Run: `node --test tests/standalone-proposal.test.mjs tests/v2-proposal-builder.test.mjs`

Expected: PASS.

### Task 4: Add browser QA for desktop, mobile, and API reuse

**Files:**
- Create: `tests/qa-v2-proposal-builder.mjs`
- Modify: `tests/v2-proposal-builder.test.mjs`

- [ ] **Step 1: Add a Puppeteer QA script**

At 1440px, verify the form and preview are side-by-side, all four callouts are visible, arrow paths do not accept pointer events, the sample PDF is loaded, and no horizontal overflow exists. At 390px, verify arrows are hidden, pins and all four text explanations are visible, touch targets are at least 44px, and no overflow exists.

Intercept the two proposal endpoints to prove the page still requests `/api/proposal/suggest` and `/api/proposal/generate` without exposing Mapbox or LetzAI URLs in browser source.

- [ ] **Step 2: Run static and browser QA**

Run:

```bash
node --test tests/v2-proposal-builder.test.mjs
node tests/qa-v2-proposal-builder.mjs
```

Expected: both commands PASS and write desktop/mobile evidence only when `QA_V2_PROPOSAL_SCREENSHOT_DIR` is set.

### Task 5: Check Vercel output and deployed security behavior

**Files:**
- Modify: `docs/portfolio-working-notes.md`
- Modify: `DESIGN.md`
- Modify: `AGENTS.md`
- Create: `docs/security/v2-proposal-builder-security-review.md`

- [ ] **Step 1: Build the Vercel output locally**

Run: `npx vercel build --prod`

Expected: exit 0; `.vercel/output/config.json` contains the scoped V2 headers and both proposal functions.

- [ ] **Step 2: Inspect the linked Vercel project without deploying**

Run `npx vercel project inspect portfolio-remote-preview` and inspect the current production deployment URL. Do not deploy or change environment variables unless separately authorized.

- [ ] **Step 3: Verify deployed/static headers where the current deployment supports the route**

Use `curl -I` against the current production V2 page and method probes against the proposal API. Record whether current production is behind the new local branch; do not claim undeployed headers are live.

- [ ] **Step 4: Record findings and residual risks**

Document:

- secrets and raw inventory remain server-only and ignored by Git;
- the API uses method, input, body-size, content-type, cache, and same-origin browser guards;
- public server-to-server abuse still requires a durable Vercel Firewall rate-limit rule because in-memory serverless counters are not reliable;
- exact Vercel environment-variable presence is checked by name only and values are never logged;
- no deployment was performed during the audit unless the user separately requests it.

- [ ] **Step 5: Update V2 source-truth documents**

Add the V2 route, reuse boundary, annotation behavior, security headers, responsive behavior, and V1 isolation rule to the three project context documents.

### Task 6: Final verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: zero failures.

- [ ] **Step 2: Run browser suites**

Run:

```bash
node tests/qa-v2-proposal-builder.mjs
node scripts/qa-v2.mjs
```

Expected: both PASS.

- [ ] **Step 3: Verify code and isolation**

Run:

```bash
git diff --check
git diff --name-only -- proposal-generator.html proposal-generator.css proposal-generator.js index.html styles.css app.js
git check-ignore -v .vercel/.env.production.local
```

Expected: no whitespace errors; no V1 presentation files changed; the local Vercel environment file is ignored.
