# Development log

## 2026-10-07: Industry web-design pages
- Published source commit `0e44dbd` through GitHub main to Vercel production (`dpl_CJBmbgH579NXTADW95kWucGVjBfB`). Verified 105 live resources against local hashes, Markdown content negotiation and actual live desktop/mobile rendering.
- Completed 24 individually written pages and a visual industry index. Each page has a distinct generated hero, approximately 950–1,150 words, local context, specific enquiry routes, practical FAQs, canonical/OG metadata and structured data.
- Added responsive WebP variants, shared desktop/mobile styling, sitemap entries, Markdown alternates and agent discovery. The parent website service links to the collection; promotion regenerates it to preserve the change in future releases.
- Browser review: 96 layout/image checks across all 24 pages at 320, 390, 768 and 1440 pixels, plus 24 mobile proof-image checks; no overflow or missing images. Reviewed hero, proof and FAQ rendering and native FAQ expansion. Saved screenshots and check results in docs/industry-pages-2026-10-07.
- 145 non-browser regression tests pass. The existing Puppeteer mobile test remains unavailable in this environment; its baseline browser launch failure predates this work. Responsive review used the connected browser.
- Replaced the old church-film poster on the new school/charity pages with actual St James campus imagery from the website project.
- User approved the visual template and authorised implementation for the researched industries, with industry-specific generated website imagery and no image labels.
- Reusing the clean release checkout at /tmp/portfolio-restore-services, fast-forwarded to current origin/main. Preserving the older dirty portfolio checkout.
- Public claims use Michael's supplied results, including 30% more qualified bookings for Cool Runnings. Generated website visuals do not receive invented client results or reviews.

## 2026-09-27: Consistent service styling
- Added scripts/site-header.mjs and v2/site-header.css; service build synchronizes the homepage header and shares navigation with service/blog pages. Added regression coverage for identical published navigation.
- AI hero uses editorial DM Sans with Fraunces emphasis, shared with web design. CSS halftone backgrounds add texture to forest/gold sections and the laptop stage without editing project assets.
- Fixed inherited centered monogram alignment. Rebuilt and promoted; 123 tests pass, one pre-existing analytics skip.
- Added DataForSEO organic keyword-difficulty evidence and explicit limits on ranking forecasts.

## 2026-09-26: Build approved service concepts
- Applying image-to-code to previously generated and user-selected designs. AI retains calendar hero, replaces handshake with real CC-licensed Okanagan photograph. Marketing explicitly covers websites, social media, video and brand development.
- Baseline tests: 122 pass, one existing GA4 skip. Deployment authorized.

## 2026-09-26: Nine service-page concepts
- Completed nine independent image designs and a noindex gallery with scoring and note export. Saved generation prompts, source paths, dimensions and unique hashes. Documented generated-copy and artwork fidelity limitations. No production code edited.
- Creating independent full-page visual directions using the homepage DM Sans/Fraunces, white/ink/forest/gold system and correctly placed work. AI imagery must communicate owner outcomes; the rejected dental proposal is excluded.

## 2026-09-26: Correct rejected AI hero direction
- The user rejected the client-specific dental proposal as irrelevant to a local owner's understanding of AI implementation. Removing it and its surrounding references. Replacement direction must show a recognizable service situation, rather than require explanation of a client artifact.
- Implemented the illustrative enquiry/calendar direction from the earlier brief: one quote request, follow-up handled and a confirmed appointment. The figure's accessible description identifies it as an example; no client results are claimed. Removed the proposal demo link, related hero copy and metadata image.
- Service CTA now leads to the always-visible process. Regenerated HTML and Markdown; 122 tests pass with the existing GA4 skip. Browser visual verification remains blocked. No publication.

## 2026-09-26: Business-owner positioning and proof-first composition
- User clarified the audience: Okanagan owners buying results and design quality, with no need to understand AI or delivery tools. Applying Impeccable and Marketing Copywriting with existing portfolio identity.
- Design direction: original work as the dominant visual, outcome headlines, local service descriptions, proof before process. Remove the illustrative AI calendar and dense workflow diagram from the sales page; retain deeper implementation routes.
- Checked current local search vocabulary. AI automation/implementation, web design/development, branding and marketing are relevant service terms; no search-volume or ranking claims inferred.
- Implemented the work-first order, exact homepage proposal hero, shorter customer-facing copy and unboxed process. Marketing uses a mixed gallery rhythm for website stories, film and identity; Web includes client-attributed Cool Runnings sales proof.
- Visible local service headings, refreshed descriptions and Coldstream/Vernon/Kelowna coverage feed the existing structured-data and discovery pipeline. Kept free consultation, CAD 900 audit and custom implementation from CAD 2,500/month; other services remain custom quoted.
- Reading the generated Markdown exposed missing image-link labels and joined pricing text. Fixed those and included labeled film links; added one focused regression.
- Built and promoted generated pages, verified syntax and local HTTP response, and passed 122 tests with one existing GA4 skip. Browser visual review still blocked by loopback policy. No publication.

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

## 2026-09-25: Use the actual homepage hero component
- Replaced service-specific hero markup with homepage hero / hero-copy / hero-intro / hero-system-media classes. Removed hero captions, browser title bar, outer tinted cards and location sublabels.
- Restored homepage type scale, layout breakpoints, pill controls and physical screen treatment. Removed redundant feature/project card backgrounds while retaining concise service structure.
- Corrected AI Catalyst preview base-URL resolution so local source logo and hero image load locally.
- 121 active tests pass; one existing skip. Browser confirmed shared hero markup, zero captions and no overflow at 1440 and 390 on all three offerings. Local only.

## 2026-09-26: Service process and reliable project artwork
- Replaced capability boxes with spacious, static problem-to-solution engagement sections on all three offerings.
- Kept homepage fonts, colours and hero components; added a quiet paper process panel with concrete deliverables.
- Restored the original AI Catalyst dither shader in static mode, copied its styles and logo/art assets locally, and disabled interaction in the hero specimen. The external project link remains usable.
- Browser inspection blocked by browser URL policy; do not claim visual acceptance.
- Final verification: 121 tests passed, existing GA4 skip; original shader syntax and local asset references valid. Rendered QA remains unverified due to browser policy rejection.

## 2026-09-26: Source-led service-page design pass
- Reviewed the four supplied references. Adopted their typographic hierarchy, generous spacing, content-sized proof and clear process while keeping the portfolio palette, fonts and surfaces.
- Replaced the AI workflow hero with a static calendar illustration for the bookings outcome. The workflow examples below now use still approved artwork and direct links.
- Replaced reused homepage work objects on the service pages with fitted, static project imagery. Kept the AI Catalyst specimen non-interactive and the St. James film intentionally playable.
- Consolidated the service-specific CSS into one coherent stylesheet and updated the existing discovery test to validate the new proof selection.
- The homepage's existing interactive showcases and unrelated dirty files were preserved. Local render access remains blocked by browser URL policy.
# 2026-09-26 — Service proof and AI booking clarity

- Started a focused revision of the marketing selected work and AI hero. The user requested the exact homepage medium story, AI Catalyst video, Upon This Rock podcast identity, and a legible full calendar tied to bookings and less busywork.
- Baseline `npm test`: 121 pass, one existing GA4 skip. Preserving unrelated working-tree changes.
- Reused the homepage's exact Proposal Story video/poster and destination. Source video is lazy-loaded and only plays in view; reduced-motion visitors see its poster.
- Copied the original 60-second AI Catalyst film and extracted a poster frame from that film. Copied original Upon This Rock hero and first episode artwork. Marketing proof now covers product story, film, podcast identity and local search without invented outcomes.
- Rebuilt the AI hero as a five-row, seven-column month calendar with readable short labels on narrow screens. Shifted opening/process copy to bookings, follow-up and time back. Reduced AI selected work to two concrete systems.
- Regenerated HTML, Markdown and LLM discovery content; bumped the service stylesheet version for preview refresh. `npm test`: 121 pass, one existing GA4 skip. Source syntax, diff whitespace and local HTTP page/media response checks passed. Browser visual review remains blocked by loopback URL policy. No deployment.

## 2026-09-26: Selected service concepts shipped
- Added scripts/concept-services.mjs and v2/services/concepts.css; generated all three selected layouts with homepage typography and palette.
- Added licensed regional photography with credit, optimized calendar imagery, real work proof, pricing and clear outcome-led service definitions.
- Corrected mobile line-break spacing and header alignment. Repaired production Markdown negotiation with 307 redirects; all three returned bodies match local Markdown exactly.
- Production deployed and live rendering reviewed. 122 tests pass, one existing skip. Source artwork excluded from deployment; optimized JPEGs served.

## 2026-09-26: Concise services and local search research
- Removed visible illustrative/project labels; kept photo licensing attribution and accurate accessible image descriptions.
- AI hero is edge-aligned without right padding; mobile puts lifestyle text before the regional photo. Reduced AI Markdown word count from 595 to 461 (about 23%). Compact 2x2 capability layout on desktop, stacked short definitions on phones.
- St James now has website and film links plus linked original poster. Product-story video replaced with a 4.8-second, single-play 1.5 MB GIF, and static reduced-motion fallback.
- Queried DataForSEO Google Ads volumes nationally and in Kelowna, plus four Kelowna-located Google SERPs. Saved raw evidence and findings under docs/seo/.
- Applied primary service/city page titles, descriptions, visible local scope, semantic Service types and areaServed, and contextual links. No fake office or thin city clones.
- Repaired Treehouse CTA to the working project preview from the homepage after its custom-domain TLS failed.
- Content editor: no em dashes or banned phrases in the three service Markdown bodies; retained attributed client result and no fabricated outcome claims. New links verified; Commons and license verified via web after automated HEAD blocks.

## 2026-09-27: Approved AI messaging and narrative
- Applied “Less busywork. More business.” and approved hero explanation of skills, workflows and agents working with existing tools.
- Paired free consultation with a direct “See what I can help with” anchor. Replaced repeated benefit labels with three recognizable problems: enquiries, follow-ups and admin.
- Flow is now introduction, business problems, what gets built, working project proof, process and pricing. Preserved original imagery, type, palette and local SEO metadata.
- Regenerated service HTML and Markdown/LLM discovery. 122 tests pass; one existing analytics skip.

## 2026-10-07: Restore service pages to production source
- Confirmed all commercial routes returned 404 on October 6 deployment. GitHub main lacked the locally deployed service commits; daily metrics commits redeployed the old site.
- Merged service history with current origin/main in isolated /tmp/portfolio-restore-services, preserving current analytics, optimized assets, metrics and security settings. Retained approved October 4 Stations removal.
- 142 non-browser tests pass. The standalone About mobile browser test cannot run because its hard-coded Google Chrome executable is absent.
- Production push and public verification underway.

## 2026-10-07: Remove blog and media clutter
- Removed public blog routes, header/footer links, Markdown discovery and sitemap references. Build now emits only three services.
- Removed image captions and added labels; Okanagan CC attribution moved to a footer-linked image-credits page. Marketing hero film plays without native controls.
- Restored the approved Vertical Impression proposal-story scrolling loop from the earlier source; explicitly allowed video and poster in deployment.
- Updated regression checks for retired blog, clean media and restored film. Publishing through GitHub main.

## 2026-10-07: Mobile workflow image corners
Source PNGs retained. Four mobile diagrams are opaque black artwork, not transparent cutouts; dashboard is a screenshot. Updated mobile media to natural image proportions with 20px image clipping and 28px outer corners, retaining light surrounding paper. No artwork pixels changed.

## 2026-10-07: Additional website and film proof
- Added original ABC Appliance project screenshot and verified canonical .ca link to Web Design.
- Marketing now embeds St James donor film and approved VI scrolling film alongside AI Catalyst. Added full AI Catalyst film link. Removed autoplay attribute so reduced-motion preference is respected by the existing observer.

## 2026-10-07: Correct portfolio imagery
- Replaced the obsolete green ABC preview with a fresh browser capture of the blue/yellow production site. Previous capture came from docs/marketing-pass and did not reflect the live brand.
- RCCV source has an opaque cream ground; preparing transparent laptop with soft shadow.
- Added transparent RCCV laptop PNG with contact shadow; homepage and contact object use the new asset. Original source preserved.
## 2026-10-07: Industry design variety
- User requested more variety because the websites look too similar. Reviewing the artwork and page structures, then developing distinct visual directions using image-to-code.

- Generated and inspected 24 distinct website designs, plus three large layout references. Added four hero compositions and different section ordering while retaining shared navigation, fonts, colours, local copy and existing proof.
- Integrated responsive artwork via `v2/industries/artwork.json`, using versioned WebP URLs. Corrected the clinic image to use Kelowna/Okanagan location text.
- Checked 96 browser combinations (24 pages × four widths) without overflow or broken hero images. Targeted industry/link/schema checks pass.

- Published commit 27dcc21 through GitHub/Vercel. Deployment dpl_BED4WvqCdQCCfaUp535LWq1y5ABe ready on michaelmck.site. All 103 live resources matched; desktop/mobile rendering confirmed.

## 2026-10-08: AEO resource library
- User authorized public local buying guides, listicles and comparisons. Interpreted latest FAQ wording as three precise questions per article.
- Applying answer-engine-optimization and content-quality-editor gates. Research and brief precede drafts.
- Preserve shared navigation and existing DM Sans/Fraunces visual system; editorial content, no portfolio redesign.
- Include Michael in relevant owned best-of comparisons, with authorship and selection basis; no invented independent rankings or third-party endorsements.
- Current working checkout verified clean at 90731bc; baseline test running.

- Completed 12 original articles, three specific visible FAQs each, answer-first summaries, fit-based provider comparisons, local sources and portfolio evidence.
- Added static renderer, existing-style reading layout, Markdown table preservation, collection-aware discovery, source/root synchronisation and Markdown content negotiation.
- Extended tests for full article/FAQ/schema/discovery/link coverage and kept tests protecting retired content, shared navigation, analytics and private Field Notes.
- Browser checks: 52 route/viewport checks (13 routes at 1440/768/390/320), zero page/text/table overflow or observed image errors; inspected desktop index/comparison and mobile article/FAQ/table.
- Test suite: 149 pass; same baseline Chrome-executable absence in pre-existing about-mobile test. No new failures.

- Published commit 94cfa2e via the existing GitHub main → Vercel workflow, preserving the upstream Cool Runnings metrics update during rebase. Deployment dpl_BQZqYKaWVgkGJZwBFbMGd77Mkezz is Ready on michaelmck.site.
- Live verification passed for 40 resources and all 13 Markdown negotiations. Inspected production desktop library/comparison and mobile checklist; temporary viewport override reset.
- Submitted updated sitemap through Search Console; success confirmed. No new-page indexing claim. Saved release report, screenshots, live verification and submission proof.

## 2026-10-08: Dated publishing, Echo editing and contact
- Recovered the existing Echo account credential from the user-authorized prior application integration, retained it privately outside Git, authenticated and edited all 12 articles. Reviewed all outputs, preserved numbers/claims/destinations, normalized single-quoted HTML attributes and removed a copied instruction. No detector score claimed.
- Kept Resources as the umbrella and /blog/ as stable URLs. Added prominent index dates and original/modified dates in visible content and schema. Three city guides remain live; nine approved pieces are queued through November 5. Original October 8 publication preserved.
- Publication eligibility now gates HTML, Markdown, hub, related links, sitemap and LLM discovery. Future source remains private. Added 52 individual 2027 briefs and eight late-2026 briefs, with query intent, proof, service links and research gates.
- Created daily 09:00 Pacific thread heartbeat portfolio-resource-publishing for preparation and verified release through end of 2027.
- Built /contact/ with email and free FormSubmit delivery, labelled minimal inputs, optional service, spam trap, retained input on failure and success-only lead tracking. Shared consultation links route to Contact. Activation is per website; localhost activation observed, production activation and delivery check still pending at this point.
