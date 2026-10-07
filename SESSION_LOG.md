# Session log

## In progress

2026-09-27: Shared navigation, AI typography and restrained print textures implemented. 123 tests pass; deployed and verified live.

2026-09-27: Approved AI messaging and flow deployed and verified. No remaining implementation work for this revision.

2026-09-26: Refinement and local SEO research complete and deployed. Business Profile/Search Console verification remains an external follow-up, not claimed complete.

No remaining work for the selected service-page release. Deployed and verified September 26, 2026. Earlier local-only notes below are superseded by this release.

## Recent sessions

### 2026-09-27: Shared navigation, print styling and ranking research
- One shared header for homepage, three services and blog. AI heading now uses the same DM Sans/Fraunces hierarchy as web design. Added restrained CSS printed-dot backgrounds without changing approved imagery.
- DataForSEO organic difficulty checked separately from Ads competition; full raw response and targeting recommendations in docs/seo/2026-09-27-ranking-*. No ranking or indexing claim.
- 123 tests pass, one existing analytics skip. Production: portfolio-remote-preview-duvpjqamb-michael-mcks-projects.vercel.app. Live shared-header HTML verified on all five page types. AI visual screenshot and phone/desktop DOM checks passed; service pages show no horizontal overflow. Browser stalled during the final additional review, so full visual coverage at every breakpoint is not claimed.

### 2026-09-27: Clear AI service narrative
- Applied approved “Less busywork. More business.” headline, existing-tools explanation and two actions.
- Added concise enquiries/follow-ups/admin problems before capabilities, proof, process and pricing. Preserved local SEO, visual identity, source imagery and pricing.
- Production deployment: portfolio-remote-preview-e9t9oypnr-michael-mcks-projects.vercel.app. Verified live HTML and Markdown, rendered headline and 390px action wrapping with no horizontal overflow.
- 122 tests pass, one existing analytics skip.


### 2026-09-26: Lighter service pages and local search targeting
- Deployed AI copy/spacing and mobile order refinements, St James website/film links and a short product-story GIF with reduced-motion fallback.
- Researched real DataForSEO volume and four Kelowna-located SERPs. Findings and raw responses in docs/seo/; applied local page metadata, visible geographic copy, Service area/type schema and case-study links.
- Final production: portfolio-remote-preview-flsfquv1j-michael-mcks-projects.vercel.app, aliased to michaelmck.site.
- 122 tests pass, one existing GA4 skip. Live HTML/Markdown exact parity verified. Mobile/desktop layout and media markup inspected. Repaired Treehouse link using the working homepage project preview.
- Organic geo-fencing is unavailable; Business Profile verification and Search Console indexing checks remain follow-up work. No ranking improvement claimed.


### 2026-09-26: Selected concepts built and deployed
- Translated AI 01, Web 03 and Marketing 03 using image-to-code. AI covers custom skills, workflows, deployed agents and training, tied to time, efficiency, revenue and bookings. Marketing explicitly covers websites, social media, video and brand development.
- Retained calendar hero direction; replaced handshake with Adam Jones's CC BY-SA Okanagan Lake photograph and visible attribution. Real project artwork and films retained.
- Published all three pages to michaelmck.site. Final deployment: portfolio-remote-preview-c4iqeyjps-michael-mcks-projects.vercel.app.
- 122 tests pass, one existing GA4 skip. Live HTML, Markdown parity, blog, robots, sitemap and LLM discovery return successfully. Fixed Markdown negotiation using conditional redirects to actual Markdown files.
- Live desktop and mobile renders reviewed; narrow-phone and tablet overflow checked. Preserved unrelated homepage work.


### 2026-09-26: Nine service-page visual directions
- Created three image concepts per offering: work-led agency, outcome-led SaaS and editorial studio.
- Saved nine unique PNGs, prompts, dimensions/hashes, review caveats and a gallery with full-page modal, scoring, notes and export in docs/design-exploration/service-concepts-2026-09-26/.
- Corrected generated web concepts that invented unrelated Cool Runnings work. Source artwork references used for AI Catalyst, RCCV, Treehouse, Upon This Rock and films.
- Gallery links, nine-image inventory and JavaScript syntax checked. No live pages replaced or published; browser visual review blocked as before.

### 2026-09-26: Replace unrelated AI proposal with a service situation
- User explicitly rejected the dental proposal as unrelated to how owners understand AI implementation. Removed the PDF visual, proposal demo CTA and client-specific hero explanation.
- Asked an optional visual-direction question; proceeded with the enquiry/calendar direction from the earlier brief after no response. Show a hypothetical quote enquiry followed up and booked, with accessible illustrative labeling and no client-results claim.
- Primary copy now speaks to appointments, follow-up and everyday admin; secondary CTA leads to the service process. Updated the design contract so future passes do not reintroduce the rejected PDF.
- Rebuilt HTML and discovery outputs. 122 tests pass, one existing GA4 skip; rendered visual verification remains unavailable. Local only.

### 2026-09-26: Business-owner outcomes and work-led design
- Kept the homepage's type, colours and original artwork; replaced the AI calendar with the exact homepage proposal output. AI keeps the actual agency dashboard below, with workflow diagrams on deeper routes.
- Moved selected work ahead of a shorter, unboxed process; paired the AI Catalyst film and Upon This Rock identity in the marketing gallery. Added attributed Cool Runnings sales proof to Web Design.
- Outcome-led hero copy, visible local service headings, refreshed metadata and Vernon/Kelowna service coverage. No unsupported award claims or ranking guarantees.
- Fixed generated Markdown's image-link labels, film links and pricing spacing. Rebuilt all discovery outputs. 122 tests pass, one existing GA4 skip. HTTP preview available; browser visual acceptance remains unverified. No deployment.

### 2026-09-26: Marketing proof and AI booking clarity
- Replaced “Make the opportunity clear” with the homepage’s exact Vertical Impression Proposal Story recording and destination.
- Added the source AI Catalyst brand film with a poster frame from the film, plus Upon This Rock identity and episode artwork; retained Cool Runnings local proof and the St. James hero film.
- Replaced the AI hero's partial week diagram with a static full-month calendar and shorter mobile event labels. Rewrote the AI opening and process around bookings, follow-up and time back; kept two practical workflow examples.
- Rebuilt the seven generated pages and discovery text. Tests: 121 pass, one existing GA4 skip; source syntax, asset presence and local HTTP responses verified. Browser visual review blocked by loopback URL policy. No deployment.

### 2026-09-26: Reference-led service-page redesign
- Requested cleaner service pages, fewer interactive previews, frames sized to the content, and a booking-calendar visual.
- Reviewed The Matter of Design, Marimba, the supplied Awwwards portfolio and Mulberry. Applied their clarity and spacing using the existing portfolio type, colours and shapes.
- Built the static AI booking-calendar hero; replaced service-page showcase interactions with approved still artwork and direct links; kept AI Catalyst as a static website specimen and St. James as the one purposeful film.
- Rebuilt and promoted the three routes. Repository tests pass (121 pass, one existing GA4 skip). Local browser visual review was blocked by URL policy. No deployment.

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

### AI Catalyst placement correction
- AI Catalyst now leads Web Design. RCCV and Treehouse remain selected work; school film remains Marketing & Branding only.
- Local preview verified; remote AI Catalyst media remains a display dependency.

### SaaS-style three-offering design
- Shared SaaS visual system applied to AI, Web Design and Marketing & Branding with original project assets and existing pricing.
- Verified responsive layout, current-offering navigation, generated metadata/Markdown and unit suite. No deployment.

### Homepage style correction
- Three offerings retain SaaS layout while sharing homepage fonts, palette and buttons; duplicate tabs removed. Verified locally; not published.

### Hero correction
- Three offering heroes now directly reuse homepage components; no extra labels or outer cards. Existing work imagery retained. Verified locally.

### 2026-09-26: Static artwork and clearer service process
- Replaced design/build and other capability boxes with larger, static engagement sections: objectives/problem, solution, delivery/support.
- Restored original Catalyst dither shader in static mode; copied source styles and artwork/logos locally; hero specimen does not capture pointer or keyboard interaction.
- Validation: 121 tests pass, one existing GA4 skip. JavaScript syntax, local preview asset references and all three generated process sections checked. HTML/Markdown parity passes.
- Rendered visual verification was blocked by the browser URL policy. No deployment; review at http://127.0.0.1:8846/web-design/.

## 2026-10-07: Restore service pages to production source
- Confirmed all commercial routes returned 404 on October 6 deployment. GitHub main lacked the locally deployed service commits; daily metrics commits redeployed the old site.
- Merged service history with current origin/main in isolated /tmp/portfolio-restore-services, preserving current analytics, optimized assets, metrics and security settings. Retained approved October 4 Stations removal.
- 142 non-browser tests pass. The standalone About mobile browser test cannot run because its hard-coded Google Chrome executable is absent.
- Production push and public verification underway.

## In progress — October 7 cleanup
Remove public blog and image labels, restore approved Vertical Impression scrolling film, publish through main.

## 2026-10-07: Remove blog and media clutter
- Removed public blog routes, header/footer links, Markdown discovery and sitemap references. Build now emits only three services.
- Removed image captions and added labels; Okanagan CC attribution moved to a footer-linked image-credits page. Marketing hero film plays without native controls.
- Restored the approved Vertical Impression proposal-story scrolling loop from the earlier source; explicitly allowed video and poster in deployment.
- Updated regression checks for retired blog, clean media and restored film. Publishing through GitHub main.
