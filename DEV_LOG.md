# Development log

## 2026-09-25 Services expansion

- Read project instructions, source notes and production design contract. Canonical source is v2; root pages are promoted output.
- Existing work is dirty across homepage, styles, tests, sitemap, tools and documentation. Preserving it.
- Baseline: 117 tests passed, one failed, one skipped. Existing failure is the sitemap allowlist missing the already-added tools.html route. Analytics test is conditionally skipped.
- Design decision: Services is the navigation label; AI implementation is the specific service. Portfolio hero, case studies and artwork stay intact.
- Proof: reuse existing case study and report links. Do not copy dated Cool Runnings analytics as current statistics. Preserve client-reported attribution for the sales claim.
- Implementation: static public pages generated from v2 service content and shared templates, with root routes, self-canonicals, sitemap entries and responsive styles using the existing design system.

- Completed 11 pages, approved image reuse, source promotion, public sitemap additions, responsive Services entry and portfolio footer invitation.
- Verified 44 page/viewport combinations (1440, 768, 390, 320), all internal links and anchors, canonical URLs, FAQ behavior, and visual samples on desktop/mobile.
- npm test: 118 passed, 1 skipped. Fixed the sitemap test's pre-existing tools-route mismatch while extending its intended route allowlist.
- Existing browser checks used installed Playwright headless Chromium because Google Chrome is not installed. Homepage and proposal focused checks passed. Broader QA reproduces an identical legacy mobile-overlay failure against pre-change files.
- No production deployment or account changes. Source pages excluded from deployment to avoid duplicate public copies; production styles remain available under v2/services/services.css.

## Rebuild after user rejection

- Replaced the generic services hub and guide expansion with three top-level pages: /ai-implementation/, /web-design/, /marketing-branding/.
- Archived the rejected generated pages under docs/rejected-services-2026-09-25, excluded from deployment. Removed them from sitemap and navigation.
- Added substantial image-led heroes using original proposal, Cool Runnings and Vertical Impression assets. Removed diagonal arrows entirely.
- Copy now leads with enquiries, customer conversations and sales preparation, then explains actual implementation, team adoption and measurement.
- AI audit and monthly offer remain together on the AI page. Website and marketing work have custom quotes.

- Rebuild validation: 118 unit tests pass; one pre-existing telemetry skip. Focused homepage browser test passed. New-page links/anchors passed; 15 page/viewport combinations had no overflow. No publication.

## 2026-09-25: Detailed services, design proof and discovery
- Web design now leads with the exact portfolio Treehouse interactive preview and RCCV laptop film. Cool Runnings follows as local service/search proof. Corrected iframe max-width so the fixed internal canvas fills the device on mobile and desktop.
- Expanded AI scope with enquiry, proposal, content and reporting workflows; ChatGPT, Claude Cowork and Gemini setup; training, ownership and maintenance. Preserved $900 audit and from $2,500/month implementation.
- Expanded marketing with positioning, identity, local SEO, service content, campaigns, sales materials and measurement. All marketing/web work remains custom-quoted.
- Restored /blog/ with three substantive articles and cross-links. Added Person/WebSite/WebPage/Service/Breadcrumb and BlogPosting schema, canonical metadata, Markdown alternates, llms.txt and llms-full.txt. Sitemap covers seven new HTML routes. Robots permits public content and excludes API.
- Vercel configuration serves the seven routes as Markdown for explicit Accept: text/markdown requests; direct index.md links work on the local static preview. Production negotiation requires post-deployment verification.
- Verified 121 tests pass, one pre-existing GA4 skip. Six expanded routes checked at 1440/768/390/320 with no overflow or broken loaded images; Treehouse separately visually checked desktop/390 with matching frame width, RCCV render reviewed. No publishing or indexing submission performed.

## 2026-09-25: Lighter pages with actual portfolio work
- Reduced AI and marketing to five sections including hero; web to seven, preserving both design projects and local proof.
- AI hero now reads More bookings. Less busywork. and reuses the homepage's original responsive prospecting artwork. No generated concepts or RCCV on AI.
- Marketing hero uses actual homepage product-story poster; removed proposal-dashboard positioning. RCCV stays on web with a continuous warm background.
- HTML, Markdown and structured data regenerated together. 121 tests pass, one existing skip. Browser checked all three at 1440/390 without horizontal overflow.

## 2026-09-25: Homepage Selected Work design applied to services
- Reuse actual homepage project markup, shared work stages, Fraunces project titles, device treatments and deferred films. RCCV uses the original alpha mask, eliminating baked background edges.
- Compact typographic introductions lead to selected work. AI has charcoal workflow chapter (content, prospecting, reporting), custom workflows, custom skills, tools and training. Marketing scope is branding, websites, ads and video.
- Added St James patronage film from verified public source (HTTP 200), with original local poster and website/film links, to marketing and web design. No film recreation or generation.
- Awaiting user identification of social-proof site/videos; not substituted with another project or declared complete.
- All 121 active tests pass, one existing analytics skip. Three routes checked at 1440/768/390/320 without overflow; RCCV and AI chapter visually reviewed. Local only.

## 2026-09-25: AI Catalyst web-design hero
- Removed the St James film/project from Web Design; retained it on Marketing & Branding.
- Added the actual AI Catalyst homepage as the Web Design hero, with a live-site link. A noindex local display copy preserves the published HTML and references its original remote assets. Navigation/submission within the display is disabled.
- Verified the rendered hero in-browser after assets loaded. Unit suite passes (121 active, one existing skip). No deployment.

## 2026-09-25: SaaS-style offering pages
- Applied a shared product-marketing design to the three service pages only: offering switcher, split heroes, green primary action, restrained surfaces, service cards, compact project proof and pricing cards.
- Actual work remains the hero material: content workflow, AI Catalyst website and St James campaign film. Homepage and blog design unchanged.
- AI Catalyst display now uses local original logo/hero media and static source HTML to avoid a blank first-paint dependency on external animation scripts. Published site remains linked.
- All 121 active tests pass, one existing analytics skip. Three pages checked at 1440/768/390/320 without overflow, active offering verified. Hero and mobile layout visually reviewed. Local only.

## 2026-09-25: Homepage identity restored within SaaS layout
- Removed duplicate offering switcher; primary navigation is the only top navigation.
- Replaced green SaaS accents with shared homepage ink/paper/gold tokens, DM Sans and Fraunces hierarchy, and pill buttons. Preserved concise SaaS structure and original media.
- 121 tests pass, one existing skip. Browser confirmed no extra tabs, Fraunces accents, ink buttons and no mobile overflow on all three routes; marketing desktop/mobile visually reviewed.
