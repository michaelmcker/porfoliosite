# Upon This Rock and full-width service stories, October 10, 2026

- Marketing & Branding and the project page use Michael’s explicitly linked 69-second portrait trailer, with native controls and no autoplay. Shared source/player metadata lives in `scripts/upon-this-rock-video.mjs`.
- Marketing & Branding has an outcome-led skills section below selected work: end-to-end video production, ad design and scaling winners, supported by Higgsfield, ElevenLabs, Suno, AI agents and HyperFrames.

- AI Implementation shows an edge-to-edge Okanagan landscape with the “More time for what matters” message.
- Marketing & Branding opens selected work with a full-bleed Kelowna waterfront image, follows with the scrolling Vertical Impression product story and shows the actual Upon This Rock Classical website and podcast artwork.
- `/work/upon-this-rock/` holds the website, identity and all sixteen selected covers, with responsive layouts, shared navigation, canonical/schema/Markdown discovery and direct service/contact links.
- `scripts/build-portfolio-work.mjs` generates this project; `content/portfolio/upon-this-rock.json` records original artwork dimensions and hashes. Creative originals remain unchanged.

# Sticky shared navigation, October 10, 2026

- Shared homepage, service and resource navigation stays at the top during normal document scrolling. In-page links have clearance below the header.
- Approved desktop/tablet hero crop; mobile retains full source width with height trimmed. Original artwork is preserved.
- Three service pages use unified split heroes and matching editorial grids; marketing shows website, video and brand work.
- Contact embeds the existing Cal.com 30-minute event, with email and form alternatives.
- Resources release Monday/Wednesday/Friday at 09:00 Vancouver; existing queue fills 69 slots through March 19, 2027.

# Free homepage preview funnel, October 9, 2026

- `/free-website-preview/`: dedicated request form, source-led design, free custom homepage design preview before committing to a paid build; full sites from CAD 2,500. Shared Cal.com 30-minute event, lazy embedded calendar and ordinary link fallback.
- Homepage and Web Design feature the preview offer. Contact links to it and the booking event. HTML, FAQ/Service schema, Markdown, sitemap and LLM files are generated together.
- FormSubmit inbox intake uses unique request IDs; provider-confirmed lead event only, no PII in analytics. Standalone pages now load the existing Google tag if missing.
- Production analytics excludes localhost and preview hosts. Campaign context persists across pages within a browser session (maximum 24 hours) and accompanies the private preview intake; form contents are not sent to analytics.
- Private local review board and durable SQLite: `scripts/preview-funnel/`. Owner approves generated design, built website publication, and customer email separately. Artifact hashes, leases, deduplication, bounded generation, audit history and guarded stage transitions are included.
- Installed runtime/data: `~/Business Research/website-preview-funnel`; board at http://127.0.0.1:8854/. Local LaunchAgent starts board after login. Codex processes queue through the separate heartbeat runbook. Customer preview folders contain only approved public static material and carry noindex headers.

# Kelowna website service detail, October 9, 2026

- `/web-design/` remains the main Kelowna and Okanagan commercial page. It now explains deliverables, platform choices, ownership, handover, search foundations and enquiry handling alongside the original portfolio images.
- Six practical buying FAQs share source with FAQ structured data and agent Markdown in `scripts/web-design-content.mjs`. Existing consultation and related-guide links remain crawlable.
- Service modification dates are authored explicitly; resource sitemap dates follow article modification dates rather than rebuild time.
- Cool Runnings proof on this page correctly refers to 30% more qualified bookings.

# Complete private editorial library, October 8, 2026

- 60 complete drafts under content/resources/draft-library, separate from the public article loader and approval queue. Eight slots finish 2026 and 52 cover 2027; dates remain editable.
- Canonical calendars include draft paths, actual article headings, FAQ questions, word counts and commercial destinations. Existing 12 approved resources retain their original release schedule.
- Private reader supports search, topic filtering, responsive tables and local related-article references; exports include individual JSON/Markdown, all-articles.md and calendar.csv.
- scripts/check-draft-library.py validates structure, links, claim-sensitive language and duplication. tests/draft-library.test.mjs guards completeness and publication isolation.
- The existing daily publishing heartbeat refreshes saved drafts near release. Research, API records and draft source are excluded from production.

# Dated resources and contact, October 8, 2026

- Resources is the public umbrella at /blog/. Visible published/updated dates match schema; the index shows dates and content types.
- content/resources/publishing.json gates publication using America/Vancouver dates and approval state. Queued articles have no public HTML or Markdown and are absent from discovery. Preserve original publication dates when re-releasing previously public work.
- Twelve reviewed Echo edits live in content/resources/edited; API credential and raw requests/responses remain private. Future full articles can use content/resources/articles.
- A weekly 2027 editorial calendar contains 52 distinct briefs; eight late-2026 briefs bridge the rollout. A daily thread heartbeat handles research, drafting and release checks.
- /contact/ provides direct email and a free form with name, email, message and optional service. Shared consultation actions lead here. FormSubmit activation and live AJAX delivery to the intended Gmail inbox were confirmed October 8, 2026.

# Public resource library, October 8, 2026

- `/blog/` now contains 12 public articles: three city guides, five practical checklists, three provider comparisons and the Cool Runnings case study. This supersedes the earlier blog removal only for these newly approved articles; the old three posts remain retired.
- Every article opens with a direct summary and has three visible specific FAQs. Provider lists include Michael McKerracher with authorship and selection criteria.
- Shared DM Sans/Fraunces navigation and editorial reading layout; mobile tables, sources, related services and consultation links.
- Source: scripts/resource-content-*.mjs; build: npm run build:resources. Canonical source outputs under v2/blog, production under blog, styles in v2/resources.
- HTML, Markdown, Article/FAQ/ItemList/Breadcrumb schema, sitemap and LLM discovery are generated together. Industry/promotion builds regenerate the collection, and partial discovery writes preserve it.
- Private Field Notes remains excluded from publication.

# Feature additions

## Shared navigation and service styling, September 27, 2026
- Homepage, services and blog use scripts/site-header.mjs and v2/site-header.css. Rebuilding services synchronizes the authored homepage header; promote:v2 publishes it.
- Shared two-row mobile navigation retains all service links and consultation CTA. Service print textures use CSS and respect reduced-motion preferences.

See PRODUCT.md and docs/portfolio-working-notes.md for the existing portfolio.

## Three commercial pages, September 25, 2026

The homepage remains the portfolio. Navigation links directly to /ai-implementation/, /web-design/ and /marketing-branding/. Each page has a substantial hero showing actual work, outcome-led copy, implementation detail, existing proof and email consultation links. AI includes the $900 audit and custom implementation from $2,500/month. Website and marketing engagements are custom-quoted.

The rejected services hub, guides and sample report are archived in docs/rejected-services-2026-09-25 and removed from public routes and sitemap. Source content/template: scripts/build-services.mjs. Canonical generated pages: v2/ai-implementation/, v2/web-design/, v2/marketing-branding/. Shared page styles: v2/services/services.css. Rebuild with npm run build:services then npm run promote:v2.

## Commercial pages and blog discovery
- Three top-level service pages with outcome-led content and existing project imagery.
- Blog index and three articles, linked from the service pages and site navigation.
- Source: scripts/build-services.mjs, service-content.mjs, service-discovery.mjs. Build services then promote:v2 to regenerate HTML; Markdown and LLM files are generated by the service build.
- Structured data and Markdown alternate links on seven generated pages; Vercel explicit Markdown Accept routing; sitemap and robots discovery.

## Service engagement process, September 26, 2026
- Three always-visible process narratives cover discovery, solution development and delivery/support.
- AI Catalyst hero preserves its original dither renderer in static mode and local source logos/styles. Project exploration uses an explicit external link.

## Service-page visual revision, September 26, 2026
- The AI implementation hero illustrates a familiar service situation: a quote enquiry followed up and booked into a calendar. It is explicitly an example, not client performance evidence. The unrelated dental proposal and demo CTA are excluded from this page.
- Web design keeps the original AI Catalyst website specimen, followed by the RCCV laptop artwork and Okanagan Treehouse project imagery.
- Marketing and branding keeps the St. James film, reuses the homepage Vertical Impression Proposal Story recording, and shows the AI Catalyst brand film, Upon This Rock podcast identity and episode art, and Cool Runnings local-search case.
- Selected work uses simple, proportionate image stages and direct project links. The homepage retains its immersive project interactions.
- The three service pages lead with outcome headlines and visible Okanagan service descriptions, then proof before process. Marketing pairs film and podcast identity between the larger website stories. Web includes the attributed Cool Runnings sales result. Titles, descriptions, schema, Markdown and LLM discovery text are generated together.

## Selected commercial designs, September 26, 2026
- Production pages translate selected AI 01, Web 03 and Marketing 03 concepts. Source: scripts/concept-services.mjs; styling: v2/services/concepts.css.
- AI: skills, workflows, deployed agents, tool training, $900 one-time audit and custom systems from $2,500/month.
- Marketing: websites, social media, video and brand development. Web and marketing remain custom quoted.
- Real Okanagan photography carries visible CC BY-SA attribution. Calendar hero is identified as illustrative.
- Markdown Accept requests redirect to actual index.md files, avoiding static HTML route precedence on Vercel.

## Local service targeting and lighter previews
- Service titles and descriptions target Kelowna, with truthful Coldstream base and Okanagan area coverage in visible content and Service schema.
- Reduced AI copy and responsive image spacing; mobile lifestyle copy separates hero and regional photograph.
- St James project/film links and short non-player product-story GIF with reduced-motion still.
- Query evidence, geographic limits and next measurement steps: docs/seo/2026-09-26-local-search-findings.md.
## Industry website pages, October 7, 2026
- 24 industry-specific web-design service pages under `/web-design/{industry}/`, with a visual index at `/web-design/industries/` and a link from the main web-design page.
- Each has independently written industry content, local context, a distinct generated website visual, FAQs, consultation links, shared navigation and responsive layout.
- Canonical HTML, Markdown alternates, structured data, sitemap and LLM discovery are generated together. Content: `scripts/industry-content-*.mjs`; renderer: `scripts/build-industries.mjs`; style/assets: `v2/industries/`.
- `npm run build:industries` rebuilds this collection. `promote:v2` also rebuilds it after promoting the existing service pages.
- The 30% result refers to qualified bookings for Cool Runnings. New industry visuals are not presented as client case studies.


### Industry design variety (2026-10-07)
24 individually designed website examples with four responsive page compositions and varied section order. Canonical renderer: `scripts/build-industries.mjs`; image manifest: `v2/industries/artwork.json`; styling: `v2/industries/industries.css`. Existing industry-specific SEO content, schema and Markdown remain available.

## Contact form copy, October 8, 2026
- Optional interests include Marketing engineering alongside Web design, AI implementation and Marketing and branding.
- The form retains the short enquiry-use sentence, with no visible delivery-provider or mailing-list explanation.

## Resource navigation and scrolling, October 8, 2026
- Desktop guide contents stay visible within the article; mobile contents remain in the reading flow. Plain summary lists replace tinted left-border callouts.
- Live city guides include contextual industry links, service/contact invitations and Resources/Contact footer links. Homepage footer retains email/social links alongside Resources and Contact us.
- The contact finale keeps its spiral and desktop physics interaction without document scroll locking, forced alignment or mobile gesture interception.

## Privacy information
The public `/privacy/` page describes the current enquiry, booking, design and measurement workflow. Contact and homepage-preview forms link to it. Source: `scripts/build-privacy.mjs`; rebuilt with resources; mirrored under V2.

## Resource answer and conversion policy (October 10, 2026)

Informational resources provide a complete opening answer and five distinct, useful FAQs. Commercial pages retain conversion-led openings. Each article declares primaryMoneyPage; `scripts/resource-conversion.mjs` supplies the relevant service/industry label and contextual implementation invitation, with Contact and appropriate homepage-preview links. All sitemap pages have a commercial/contact route. The scheduled library and publisher preserve expanded FAQ coverage and release gating.
