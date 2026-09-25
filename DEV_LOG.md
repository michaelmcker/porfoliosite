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
