# Session log

## In progress

Expanded pages complete for local review. Not published; production content negotiation and search indexing remain post-deployment checks.

## Recent sessions

### 2026-09-25: Portfolio services extension

- Requested: preserve the portfolio and add AI implementation, web design/development and branding/marketing services with existing proof.
- Built 11 public pages: services hub, three main services, audit, training, illustrative report, guides index and three guides.
- Added desktop/mobile Services navigation and a small invitation near the portfolio footer. Preserved the hero and work presentation.
- Reused approved images. Linked Cool Runnings case study and performance section with client-reported sales attribution.
- $900 audit: five hours on site over two to three weeks; custom systems from $2,500/month. One-time audit fee and CAD are working assumptions for this unpublished draft.
- Source and styling: scripts/build-services.mjs, v2/services/, v2/guides/. npm run build:services followed by npm run promote:v2 regenerates public routes and extends the sitemap.
- Verification: 118 unit tests pass, one existing analytics test skips. All 11 pages checked at 1440/768/390/320, no overflow detected. Local assets, links and anchors validated. FAQ interaction checked. Focused homepage and proposal browser regressions pass with installed headless Chromium.
- Broader legacy qa-v2.mjs fails its mobile hero overlay geometry assertion. Reproduced identically with pre-change homepage/styles, confirming this is not introduced by services.
- Not published. Search Console and dedicated GA4 setup remain unverified. Initial consult links open an email request, not a calendar booking.
- Existing unrelated user edits remain preserved separately.

### 2026-09-25: Rejected direction replaced

- User rejected the services hub, generic tool-led copy, lack of visual heroes, arrows and unnecessary guide expansion.
- Replaced it with exactly three top-level commercial pages: AI implementation, web design, marketing and branding. Direct homepage navigation; portfolio presentation preserved.
- Large real proposal and website artifacts anchor heroes. Phone layout leads with headline and work. Copy explains enquiries, follow-up, bookings and preparation time, backed by existing cases with attribution.
- AI page explains assessment, configuration, integration, custom building, testing, training, measurement and maintenance. Audit and monthly pricing stay on-page. Web/marketing quoted by project.
- Rejected pages archived under docs and removed from public routes and sitemap. No new guides or services hub.
- Checks: 118 unit tests pass, one existing telemetry skip; focused homepage check passes. Three pages checked at five widths, links/assets/anchors validated. Browser-reviewed desktop and mobile heroes.

### 2026-09-25: Detail and discovery completed
- Corrected Treehouse/RCCV visual proof, expanded all three service scopes, restored three-article blog.
- Added schema, Markdown, LLM discovery files and sitemap coverage; retained public crawler access.
- 121 active tests pass; one existing GA4 test skips. Responsive checks and visual review completed.
- Preview restored at http://127.0.0.1:8846/. No deployment.

### 2026-09-25: Simplified commercial pages
- Applied requested lighter structure and actual homepage work imagery. Details remain in blog; prices preserved.
- Local only. Tests and responsive checks pass.

### 2026-09-25: Shared homepage design and selected projects
- Replaced generic service layouts with source homepage Selected Work components and a compact typographic introduction.
- Added St James original film and revised service taxonomy. Awaiting social-proof project name/link to complete project selection.
- Local changes verified; not deployed.
