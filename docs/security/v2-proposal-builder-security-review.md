# V2 Proposal Builder Security Review

Date: July 19, 2026
Scope: `/v2/proposal-generator.html`, the shared proposal client, `/api/proposal/suggest`, `/api/proposal/generate`, and the linked Vercel project `portfolio-remote-preview`.

## Outcome

The V2 route builds successfully in Vercel's production mode and the existing proposal workflow remains functional. Browser credentials and inventory remain server-only. The API rejects unsupported methods, missing or cross-site generation origins, non-JSON generation requests, malformed JSON, oversized request bodies, excessive request volume, and overlong suggestion queries. Both proposal pages and the API receive explicit security and no-cache headers.

A protected Vercel preview passed the real Mapbox suggestion flow and a full LetzAI, map, perspective, Chromium 149, and one-page PDF generation. Production now has a Vercel Firewall rate-limit rule for the expensive generation route.

## Implemented Controls

- V2 is a presentation-only layer over the existing `proposal-generator.js`; it does not duplicate API or PDF logic.
- `/api/proposal/generate` accepts only `POST` with `application/json` and a maximum 16 KiB body, including when Vercel has already parsed the JSON object.
- Generation requires an explicit same-origin `Origin` whose protocol and host match the forwarded request. Both endpoints also reject cross-site Fetch Metadata.
- Warm-instance defense-in-depth limits generation to three requests per IP per hour and suggestions to 60 requests per IP per minute. Production's edge-level Vercel Firewall independently limits generation to three requests per IP per hour.
- Business name, address, and business type remain length- and allowlist-validated by the shared core.
- User-controlled proposal strings are HTML-escaped before the HTML-to-PDF render.
- Mapbox and LetzAI credentials are read only in serverless functions. The browser does not call those providers directly.
- API responses use `private, no-store`, `nosniff`, `no-referrer`, and `noindex, nofollow`.
- V1 and V2 builders receive the same strict same-origin CSP, `SAMEORIGIN` framing, a restrictive Permissions Policy, and `nosniff`.
- LetzAI and Mapbox images are accepted only over HTTPS from public addresses, must return an image MIME type, and are read through explicit byte caps and timeouts.
- Serverless Chromium is pinned to 149.0.0 with Puppeteer 25.1.0. The renderers filter the package's `--disable-web-security` flag and abort all page requests except embedded `about:`, `blob:`, and `data:` assets.
- Expected 400/403/413/415 request failures are returned without being logged as application errors.
- `.vercelignore` prevents project instructions and repository automation from becoming public static files.
- Vercel environment inventory confirms encrypted `LETZAI_API_KEY` and `MAPBOX_ACCESS_TOKEN` values for Production and Preview. Values were not inspected or copied.
- `npm audit --omit=dev` reports zero known production dependency vulnerabilities.

## Vercel Verification

`vercel build --yes` completed successfully. `npm test` passed 91 tests.

- Effective function runtime: `nodejs22.x` from `package.json`.
- Linked dashboard default: Node 24.x. The package engine correctly overrides it; the warning is informational but the dashboard should eventually be aligned to 22.x to remove ambiguity.
- Generate function duration: 300 seconds.
- Required proposal assets and the shared request-security helper are present in the generated function bundle.
- `/v2/proposal-generator.html` and its approved fallback image are present in static output.
- `AGENTS.md`, `DESIGN.md`, `PRODUCT.md`, `.github/`, and `v2/assets/backgrounds/README.md` are absent from static output.

The protected preview deployment `dpl_Eh4TpzEFy1WARs2xudj5fai3edyw` returned:

- `GET /v2/proposal-generator.html`: `200` with the scoped CSP and browser-security headers.
- Cross-origin `POST /api/proposal/generate`: `403`.
- Same-origin `GET /api/proposal/suggest`: `200` with the expected Atlanta address.
- Same-origin `POST /api/proposal/generate`: `200 application/pdf`, 2.95 MB.

The generated PDF is a tagged, unencrypted, JavaScript-free, one-page US Letter file produced by Chromium/Skia 149. Rendering at 150 DPI confirmed that the custom ad, dynamic 92-building headline, 327-screen evidence, local map, and contact footer are present without clipping or overlap.

## Front-End Verification

Permanent browser QA checks 1440px desktop and 390px mobile layouts using the real proposal client with mocked same-origin API responses and the checked-in proposal PDF.

- Zero horizontal overflow on both viewports.
- Four visible explanations on both viewports.
- Curved paths visible only on desktop; four pins visible only on mobile.
- Desktop annotation copy does not overlap the proposal or leave the viewport.
- Form controls meet the 44px minimum target size.
- Address suggestion, submit enablement, PDF generation, blob preview, open, and download paths complete.
- Browser request capture confirms no direct Mapbox or LetzAI traffic.
- The approved PNG prevents a blank embedded-PDF surface before generation.

## Residual Risks

### Medium priority: monitor public generation

Same-origin enforcement is not authentication, but the production WAF now gives the expensive route a durable three-per-IP hourly limit. Monitor 403, 413, 415, 429, and 5xx responses and tune against legitimate use. If the demo attracts distributed abuse, add a Turnstile-style challenge or authenticated demo access rather than increasing the limit.

### Medium priority: deployment/runtime alignment

The linked Vercel setting says Node 24.x while the repository requests 22.x. Builds currently resolve correctly to 22.x, but aligning the dashboard setting prevents future confusion if the package engine is removed.

### Low priority: upstream asset allowlist

The generated image URL comes from the authenticated LetzAI response and is not direct user input. Protocol, DNS class, redirects, MIME type, timeout, and size are now validated. Add a hostname allowlist only after LetzAI documents a stable image-host contract; do not guess the CDN host and break generation.

## Repeatable Checks

```bash
npm test
npm audit --omit=dev
node tests/qa-v2-home-breakpoints.mjs
node tests/qa-v2-proposal-builder.mjs
vercel build --yes
git diff --check
git diff --name-only -- proposal-generator.html proposal-generator.css proposal-generator.js index.html styles.css app.js
```

## July 24, 2026 Follow-up

- The native PDF iframe was removed from the generated in-page state. Chrome's PDF plugin is a fixed desktop surface that forced pan and zoom on narrow viewports.
- Generation now negotiates a private binary proposal bundle: a four-byte preview-length header, a fitted first-page JPEG, then the original PDF. The responsive image becomes the preview; Open PDF and Download continue to use the PDF blob.
- The proposal CSP is tightened to `frame-src 'none'`. The browser still has no Mapbox, LetzAI, or inventory access.
- Permanent browser QA now covers 1440, 1024, 768, 390, and 320 pixels. All four approved points—Custom map, Generated sample ad, Unique industry copy, and Offer—remain present; desktop curves end on their targets; mobile uses the same numbered targets and a fitted generated page without horizontal panning.
- `npm audit --omit=dev` again reports zero known production vulnerabilities. A filename-only tracked-source scan found no credential values; `.env.example` contains empty names only, the provider code reads `process.env`, and the Mapbox test uses a fake token.
