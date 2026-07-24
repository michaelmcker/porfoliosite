# Portfolio Working Notes

Last updated: July 20, 2026

This is the working source for portfolio ideas, evidence, workflow details, media requirements, and unresolved questions. It is intentionally more detailed than the public site.

## Positioning

- Primary frame: Marketing Engineer.
- Supporting value: product marketing, positioning, websites, sales enablement, go-to-market systems, AI visibility, and AI-enabled operations.
- Core public line: I build websites, product stories, sales material, and AI-enabled GTM systems that help teams explain, sell, and scale.
- Philosophy: hard skills, AI, and taste let a small team move from problem to useful work faster.
- Bias to build: trust work that can be used, learned from, measured, and improved.
- Method: Understand, Shape, Build, Measure, Refine, Systematise.
- AI supports execution. Human judgment supplies context, taste, review, and the decision to publish.

## Site Structure

The approved V2 system is live at the production root. `v2/index.html` and `v2/proposal-generator.html` are the canonical sources; `npm run promote:v2` produces `/index.html` and `/proposal-generator.html`. The five workflow pages and local-search case study keep their existing `/v2/` routes for now. The former V1 design remains a historical reference only.

1. Approved animated hero.
2. Selected Work: public-facing outputs and case studies.
3. Bias to Build and the six-stage method.
4. Selected Workflows and Tools: repeatable systems behind the outputs.
5. Outcomes: concise proof with clear provenance.
6. About: personal story plus the interactive Renaissance portrait.
7. Experience: company, title, and dates, with resume download.
8. Contact: email, LinkedIn, and GitHub.

### Production Telemetry Status

- A Search Console domain property for `michaelmck.site` exists but remains unverified. DNS verification and sitemap submission are not complete until Google supplies and accepts the domain token.
- The portfolio does not yet have its own GA4 property or measurement ID. Do not reuse Cool Runnings, Vertical Impression, Fountainhead, or any other client/company property.
- Once the dedicated property exists, add one privacy-reduced tag to each public portfolio page, permit only the required Google endpoints in the proposal CSP, remove the conditional test skip, deploy, and verify a real-time visit.

## Selected Work

### RCCV

- Public title: Bringing a community site to life.
- Story: clean up and modernize the site, make it more community-focused, make bulletins and events easier to use, and bring educational content to life with interaction.
- Media: angled laptop frame; must accept looping video or a still.
- Links: homepage and Interesting Interactions / Stations of the Cross.

### Boutique Accommodation

- Public title: Elevating a boutique accommodation site.
- Story: take underused property assets and weak photography, improve the visual system with AI, and build scroll-led stories for the Overview, Treehouse, and Cabin.
- Media: one browser window with a real URL bar and the local `v2/okanagan-preview/` document. Its assets are copied from the real deployed Okanagan heroes and compressed into `overview-loop.mp4`, `overview-transition.mp4`, `treehouse-hero.mp4`, and `cabin-hero.mp4` under `v2/okanagan-preview/assets/`. Each is 854px wide, H.264 fast-start, uses frequent seek keyframes, and stays below 2.8 MB.
- V2 interaction: keep Overview, Treehouse, and Cabin as three sequential sticky scenes in that order. The deployed Worker is authoritative for public text and navigation: `Stays`, `Things to Do`, `Gallery`, `Reviews`, `About`, `FAQ`, `Blog`, `Book your stay`; both complete Stays cards with their real summaries, prices, guest counts, and ratings; light/dark logo marks; and the proof strip on every hero. Do not shorten, rewrite, or omit these elements for the portfolio preview. Every hero preserves selectable desktop nav/headline/subhead/button HTML over the source movie, locks for its own 300svh scroll travel, seeks forward and backward, then releases to the next scene. Keep the iframe document at 1100px internally and scale that desktop canvas to the outer device so the phone header never appears in the portfolio mockup. The visible portfolio URL changes between `okanagantreehouse.ca`, `/treehouse`, and `/cabin` as the active scene changes without navigation. The Stays dropdown functions but all links prevent navigation. The iframe owns scene scrolling while the portfolio page controls only the browser shell’s right-to-left 3D entry. Do not substitute flattened screen recordings, a remote iframe, stitched footage, or status/Previous/Next controls. Keep the curly preview cue as one unit in a dedicated row, with the label at the start of the line and the arrow tip at the browser's upper edge. Reduced motion hides movies and retains all three static semantic scenes.
- Links: Overview, Treehouse, Cabin.
- Do not mention Airbnb links.

### Cool Runnings / Local Landscaping Business

- Public title: From no web presence to a lead magnet.
- Case title: A local search magnet.
- Story: website, Google Business Profile support, useful calculators and guides, and a programmatic local-search system.
- Canonical inputs include cities, services, coordinates, weather, frost dates, planting zones, hardiness zones, growing seasons, neighbourhoods, FAQs, photography, and related services.
- Enrichment crosses six cities with six services and writes structured JSON records.
- Validation checks required fields, retries failed records, and merges successful output.
- Rendering creates city/service pages, canonical URLs, schema, internal links, sitemap routes, guides, and tools.
- Current verified 28-day proof: 189 organic clicks, 83 pages averaging positions 1-10, and 660 queries averaging positions 1-10.
- Current verified website actions: 7 forms, 4 website phone clicks, and 2 WhatsApp clicks. Show as 13+ tracked actions until direct Business Profile performance data is available.
- V2 route: `/v2/work/local-search-magnet.html`, isolated from the existing V1 case study and dynamically reading `data/cool-runnings-metrics-current.json` when served.
- Client-reported proof: 30% revenue increase after launch and new bookings.
- Refresh contract: show Latest 28 days and a visible Last refreshed date. Do not leave blank metrics.
- Business Profile calls, website clicks, and directions require the Business Profile Performance API for exact attribution. GA4 currently groups Google traffic as organic and cannot isolate listing clicks without tagging.

### Digital Out-of-Home Proposal Tool

- Public demo inputs: business name, validated address, and industry/business type.
- System handles local inventory, Mapbox location, screen and impression counts, tailored copy, generated creative, and the one-page PDF.
- Public demo must not expose internal VI systems or API keys.
- PDF and browser preview must match.
- Use real inventory CSVs and real maps.
- Sales footer: representative photo, name, title, phone, and email. Shared contact email is hello@verticalimpression.com.

### Why Elevator Advertising

- Public title: Explaining a misunderstood medium.
- Story: product positioning that explains why elevator advertising works and makes an overlooked medium understandable.
- Media: angled browser window with visible URL bar; replaceable still or video.

### Making an Overlooked Category Interesting

- Two Vertical Impression music albums created as marketing stunts around digital out-of-home advertising.
- Use the approved overlapping album image on a matched black background.
- Link directly to both Spotify albums rather than creating a campaign subpage.

## Selected Workflows and Tools

V2 presents this as one full-bleed charcoal chapter: the centred section heading leads directly into a neutral dark accordion. Desktop uses overlapping 64px charcoal spines with 24px overlap, ordered perspective, narrow side faces, and a hidden active rail so the controls read as a physical stack; mobile resets to explicit flat rows. Hover or keyboard focus lifts the chosen rail 18px with increased depth, and selection slides over 780ms. Do not restore per-workflow rail colours. Numeric flex bases are required for the desktop slide. Active copy remains on charcoal; only the rounded `#E7E8E3` artifact bed is paper-grey. The authored artwork retains its internal black canvas. The approved Search-Optimized Content plate defines the artwork system for the process workflows: black canvas, off-white cards, recognisable tool logos, realistic artifact fragments, and blue/green/red/gold connecting routes. Presentation, Prospecting, and Website Production use that language with workflow-specific shapes. Agency Dashboard uses the recovered real V3 AI Visibility Dashboard screenshot.

### Search-Optimized Content Production

- Task or opportunity enters the queue.
- SERP and keyword research establish demand, intent, competitors, and gaps.
- Firecrawl gathers source and competitor material where appropriate.
- Perplexity or search APIs enrich the research packet.
- Brand rules and the existing blog catalogue are checked to avoid duplication and maintain voice.
- The system creates an outline, drafts the article, runs AI-content and quality checks, and routes the work through human review.
- Approved content is pushed to Google Drive or the publishing destination.
- Search Console and rank data measure the output and create new tasks.
- Visual should show the real tools, logos, research packet, outline, review gate, published page, and measurement loop without becoming a dashboard.
- Desktop source truth is the user-supplied approved black plate at `v2/assets/workflows/content-production-approved-desktop.png`, SHA-256 `8df1ac85b4813445e5ffd836efcd8cce380a945b2a2e315fcead1c297bb1932b`. Never substitute the older light generic diagram or regenerate this file.
- Mobile uses the approved Candidate C chapter-board composition at `v2/assets/workflows/content-production-approved-mobile.png` (SHA-256 `46438ba3988c02c2d488ea8a75bd45fc1e8e6a68d9baa3accf58feada86dba7a`). Its four portrait boards retain Linear, Google, DataForSEO, Firecrawl, Perplexity, Brand Rules, Brief, Outline, Draft, Audit, Human Review, Drive, Published Article, and Shopify as visually specific modules connected by coloured routes.
- Presentation Publishing, Local Prospecting, and Image-to-Website use independently generated desktop and mobile artwork in the same approved visual family. Do not reconstruct these images with HTML, CSS, SVG, Mermaid, or a common flowchart renderer. The exact prompt set and asset matrix live in `v2/assets/workflows/README.md`.

### Agency Management Dashboard

- Purpose: improve client delivery quality by making customer data accessible and queryable.
- Source truth: `assets/screens/fountainhead-ai-visibility-dashboard-v3.png`, copied byte-for-byte to both V2 dashboard production files (SHA-256 `83d00ae1a5ff5746925a3e350de7b8de98c39404a4b5b68e514394631fe1f7ae`).
- Preserve the real `Keyword Content` and `Client Notes` source labels and the dashboard's visibility trend, content queue, source health, delivery-review queue, and opportunities. Do not substitute a conceptual workflow diagram.
- Sources: Search Console, Analytics, Reddit, SERP data, Keywords, Blog, CMS, Backlinks, conversion data, and client notes.
- Functions: reporting, content queue, keyword discovery, Reddit feed and scoring, response creation, opportunity surfacing, missing-content detection, and delivery review.
- Public name should be plain-language, not internal jargon. Current label: Agency management dashboard.

### Local Prospecting and Enrichment

- Google Maps discovery finds local businesses in the target geography and category.
- Apollo and public-source enrichment add business, company, and relevant contact context with visible provenance.
- Inventory matching connects businesses to nearby digital-out-of-home screens.
- Qualified prospects move into the real proposal PDF generator. The proposal includes customer-specific copy, a local map, dynamic screen count, and a custom graphic or generated image.
- The PDF is attached to personalized outreach and moves through sales review before an approved send.
- Approved visual: browser map with discovery, enrichment, screen matching, and sales handoff.

### Presentation Publishing

- The sales team creates a customer-branded HTML presentation from the approved design system, maps, custom graphics, and account narrative.
- Once approved, Cloud Scale Deploy is called at `/deploy/presentation`.
- The command sends the HTML presentation to Vercel through the API and captures the deployed URL.
- That URL becomes the iframe source passed into the Webflow API.
- Before the CMS write, the proposed page name is checked against existing CMS records so a duplicate page is not created.
- The same CMS operation pastes the Vercel URL into the iframe CMS field.
- The workflow publishes the Webflow site, verifies the managed page, and returns the final link.
- Access control may exist outside the public story when a specific presentation requires it, but it is not a stage or visual emphasis in the V2 workflow.
- Problem solved: sales can build a rich, customer-specific HTML artifact, but putting it into a prospect's hands repeatedly requires hosting, CMS validation, embedding, publication, and verification. This turns the approved artifact into a managed, branded, shareable page.

Public V2 sequence, in order:

1. Build and approve the customer-branded HTML presentation.
2. Call Cloud Scale Deploy at `/deploy/presentation`.
3. Deploy the presentation through the Vercel API.
4. Pass the deployed URL to the Webflow API as the iframe source.
5. Validate the page name against existing CMS records, then write the URL into the iframe CMS field.
6. Publish the Webflow site and return the final link.

The image-generated V2 visual uses this exact sequence in the approved dark card-and-routing language. The two actions in stage four may be visually nested to make the validation/write relationship clear. Do not add a creation stage, duplicate validation, a standalone template stage, fictional integrations, or unreadably small implementation detail.

### Image-to-Website Production

- Scrape the existing business information plus competitor and best-in-class websites, while separating source facts from design inspiration.
- Generate many hero-section explorations and mood boards against the real audience, offer, references, brand assets, and page requirements.
- Complete a direction review that compares and annotates the visual options.
- Convert the selected direction into a selectable, responsive HTML web-page proof.
- After approval, create `DESIGN.md` and an HTML style guide that capture typography, colour, spacing, imagery, components, motion, and accessibility.
- Scale the approved proof into the full responsive site.
- Lint the implementation against `DESIGN.md` and the source-truth rules.
- Complete human design review at real breakpoints before publishing.
- The V2 homepage uses independently image-generated desktop and mobile artwork for this sequence, with the approved Content plate as its strict style reference. Do not substitute the older generic image or rebuild the flow in HTML.

### Website System

- Research the business, audience, competitors, and positioning.
- Gather real content and reference sites.
- Plan information architecture and page narratives.
- Generate or improve photography and copy.
- Establish the design system before coding.
- Build responsive pages with AI assistance.
- Review for taste, clarity, accessibility, and conversion.
- Iterate from real user and performance signals.

### AI Enablement

- Custom MCP servers and API integrations.
- Reusable skills and operating instructions.
- Team training and adoption support.
- Google APIs used across work include Maps, YouTube, Authentication, Gmail, Drive, Search Console, and Analytics.
- Other integrations discussed include Shopify, Firecrawl, Perplexity, SEO/search APIs, Vercel, Webflow, Supabase, and DigitalOcean.
- Only name tools publicly when the integration is verified and disclosure is appropriate.

## Outcomes and Evidence

- $200M+ ecommerce spend managed.
- 600% inbound growth.
- 1,900% agency/client growth should be used only with a clear source and definition.
- 156 hours returned to sales each year is based on one hour per salesperson per week across three salespeople.
- AI-assisted sales increases discussed: roughly $1,000 to $20,000 per month and $3,000 to $60,000 per month. Do not publish without approval and a privacy-safe description.
- Keep proof points consolidated rather than split rigidly by employer.
- Every public metric needs a timeframe, source, and scope note.

## About and Experience

- Born and raised in Toronto.
- First exposure to marketing came at six while helping at the family Chrysler dealership and looking through car brochures and dealership materials.
- Lives in Coldstream, BC.
- Proud father of four, with a cat and a dog.
- Spends an unreasonable amount of time experimenting with AI and building things to see whether they can be done, even when the practical value is questionable.
- The Renaissance portrait is an Easter egg. The practical-value sentence can break out during scroll, followed by: But there is always value in learning from the process.
- Experience section should stay simple: company, title, dates, resume download, and contact.

## Design and Media Rules

The following paper-grid rules describe V1 only. V2 is intentionally isolated and follows `DESIGN.md`.

- The V1 approved hero remains the V1 source of truth.
- V1 uses the paper field, restrained grid, thin routes, serif display type, and small technical labels.
- V1 avoids eyebrows or numbered section labels.
- Selected Work and Selected Workflows are different sections.
- Selected Work uses taller alternating rows: laptop for RCCV, varied browser windows for the other web work, letter-size PDF for the proposal, and overlapping album art on black.
- Media shells must accept either images or looping videos without changing the section layout.
- Workflow images should occupy most of the available stage and never read as thumbnails.
- Mobile selected work can become a carousel; desktop remains an alternating editorial layout.
- Use icon controls for GitHub, LinkedIn, and email in utility navigation.

### V2 Assessment Rules

- Use local DM Sans for functional copy. Use local Fraunces for project titles, workflow titles, metrics, and selective personal/editorial moments. Desktop inactive rail labels are 64px wide, overlap by 24px, use 900 weight and ordered perspective, and disappear when active so workflow evidence owns most of the stage. Tablet and mobile reset the controls to flat rows.
- Do not use eyebrow labels anywhere in V2, including the workflow-detail pages. Bias to Build is a large editorial heading, not a small label.
- Do not use pastel or unrelated flat fields as the homepage structure. Bias to Build uses hard gold and About uses deep forest. The approved Repeatable Systems chapter is charcoal: charcoal inactive rails open onto charcoal active copy with one rounded paper-grey artifact bed. Do not colour-code individual workflows.
- Treat hero media, laptops, browsers, proposal sheets, album artwork, and the About portrait as authored physical objects. Hero and screen surfaces share a black bevel, rounded corners, restrained perspective, and a strong drop shadow. The hero uses a slimmer bezel and an approved roughly 36/64 copy-to-film desktop ratio so the film remains dominant without constraining the headline.
- Keep the Renaissance portrait in About only; never place it in the hero.
- `Selected Work`, `The repeatable systems behind the work`, `Outcomes`, and `Experience` share the same smaller DM Sans chapter-heading treatment. Fraunces remains reserved for selected editorial and personal moments.
- Keep the interactive portrait inside the existing brown frame and show it at a larger scale. A V2-only embed accepts section-wide pointer coordinates. The full practical-value sentence begins inline; a measured duplicate then expands into the scroll moment with an animated gold line.
- Reuse the responsive system-map film in the raised black-bevel hero card, beside the hero copy. Desktop uses `translateX(-18%)` so unused source space is reduced while the complete baked Inputs group remains visible. Inputs, Workflow System, and Outputs are already in the approved film and must not be duplicated in HTML. The only HTML label is the Systems Thinking statement inside the same translated wrapper. The app selects the 67 KB desktop or 62 KB mobile WebP poster before loading the matching 2.1 MB landscape or 1.5 MB portrait H.264 source. Mobile resets the wrapper and preserves native 9:16. The hero subhead ends after `scale.`; `And sometimes, stuff just for fun.` is a separate italic Fraunces beat.
- Hero and Selected Work stay white. A single contained hairline, aligned to the navbar width and gutters, divides the two chapters without a full-bleed colour change. Selected Work project stages remain transparent; Music remains the only black interlude. No project row uses a photographic background or becomes a separate card.
- Selected Work keeps the Z-pattern, one shared desktop stage height, and existing media/interactions. Boutique keeps the wide black browser, but the curly arrow appears before `Scroll the preview`, both form one unit above and outside it. The preview is the same-origin semantic three-scene Okanagan document; outer scroll controls only the browser’s right-to-left 3D pose. Status, Previous, and Next overlays do not sit on the work.
- RCCV is a large isolated laptop treatment, not a laptop inside another screen bezel. Its exact video is masked by `laptop-three-quarter-rccv-cutout.png` to remove the baked cream background. Its restored title is `Bringing a community site to life.` and its specific interaction link is `Explore the interactive Stations of the Cross`.
- The proposal remains the real letter-shaped artifact but loses its surrounding faux frame; the PDF is contained within its stage with deliberate space above and below and receives the rounded corners. Boutique uses the same vertical breathing room around its browser.
- Accommodation begins right in 3D and settles across to a slight left tilt by section centre. Cool Runnings uses one transparent graphite laptop frame around the existing sizzle film. The enlarged `min(132%, 1180px)` laptop uses a restrained 28-degree opening pitch and modest translation; it begins before entry and reaches its complete, visible pose when the text is vertically centred. Never add a second clipped frame as a base. Why Elevators begins pitched back and resolves at a slight angle rather than straight-on.
- Hero, RCCV, and Cool Runnings videos have no visible or invisible Pause control surface. The hero uses fast-start 1080p re-encodes and breakpoint-matched WebP posters rather than loading the 10 MB 4K source. RCCV and Cool Runnings posters, the Cool Runnings shell, the proposal image, and the Okanagan iframe remain explicitly deferred because native lazy loading fetched them during hero paint. The proposal image and Okanagan iframe begin fetching at a 110% root margin so they decode before entry rather than popping in. Intrinsic dimensions prevent layout shift, and films autoplay only while visible; reduced-motion users see static posters. The Okanagan scene movies are deferred independently.
- Bias to Build uses a spacious, unnumbered two-row snake on desktop: Understand → Shape → Build, then Measure → Refine → Systematise from right to left. One thin continuous route connects the full sequence instead of heavy per-label arrows. Mobile keeps the same semantic order beside a quiet vertical route.
- Desktop workflow states use a full-width expanding-spine accordion at 1100px and wider; smaller layouts use vertical rows with mobile-readable artwork. Desktop open and closed states use explicit numeric widths so the spine actually slides. The four inactive rails overlap; the active rail is visually hidden. Active panels are taller and give the workflow image more room. Rails are neutral rather than category-coloured.
- V2 type and padding rhythm is governed by `--type-h1`, `--type-h2`, `--type-h3`, `--space-section`, `--space-heading`, and `--space-copy` in `v2/styles.css`. The 761–1099px range has dedicated fluid type values and a denser selected-work grid; Boutique stays one column in that range so the embedded real site keeps its desktop navigation. Avoid isolated heading clamps and section paddings that do not derive from those roles.
- About uses the Renaissance arch. `Even when the practical value is questionable, there is value in the process.` is one normal sentence at rest. A lightweight layered portrait fills the frame while the interactive iframe initializes. An aria-hidden duplicate is measured onto the exact start of the practical-value clause; scroll then fades the original, interpolates real font size, weight, family, and colour for sharp text, keeps the growing copy inside its column, resolves the process conclusion below it, draws a visible gold line toward the portrait, and only then releases the page. The build note explains the stable base, 66 registered poses, pointer mapping, typing loop, compression, and compositing constraints. Opening it dims the gold route behind an opaque forest panel. Mobile keeps a real 240svh sticky story rather than a static fallback: the phrase caps at 2.35rem, the portrait remains bottom-right, the conclusion resolves beside it at `58svh`, the shorter line ends at the frame edge, and the open note uses a capped scrollable panel. A stable parent stage exclusively owns the pointer and sends normalized coordinates into the presentation-only portrait iframe. Experience is a tighter centred ledger without row rules, route dots, or timeline markers.
- Outcomes are four centred metrics with unchanged claims.
- All five workflow detail pages use one shared structure and stylesheet. Each page states its purpose, rationale, accurate steps, tools and sources, what ships, human review, public-safe proof and constraints, and related work.

### V2 Scroll and Physics Finale — July 15, 2026

- The contact sequence is progressive enhancement over a complete static hard-gold composition.
- The sequence is not controlled by scroll. Matter and the lightweight finale-only WebPs start loading when the story is within 120% of the viewport. When 12% of the stage enters view, it starts once per page load, aligns and locks immediately before its bounded image-decode wait, runs the 4,800ms entrance, and restores scrolling before gravity begins.
- Actual portfolio artifacts enter beyond the upper-left edge and follow exactly two inward Archimedean turns. Equal arc-length mapping keeps the pace even, tangent rotation follows the path, and per-object phase offsets keep the cards readable as a stream.
- Each object scales continuously from 100% at the outer edge to 70% near the middle.
- During the final six percent of the second turn, the objects converge into a responsive horizontal release band rather than one centre point. Each distributed DOM pose and its 70% rendered dimensions transfer directly into a locally vendored Matter.js body with no visible position or size jump.
- Gravity, all four boundaries, collisions, friction, sleeping, and angular movement produce the drop and settlement.
- Dragging uses a high-stiffness dynamic point constraint with no angular stiffness. Releasing removes the constraint without resetting velocity or angular velocity, allowing a restrained toss and natural collisions instead of pinning the body.
- The finale portrait uses the clean body plate plus a registered head-visible pose. Do not substitute the headless plate by itself.
- The contact copy resolves roughly 420ms after the physics drop starts, rather than waiting for every body to sleep. It switches between dark and light treatments according to actual overlap so the message remains legible as objects cross it.
- Normal page scrolling continues through the 100svh finale to the footer. Reduced-motion and runtime failure skip the entrance and physics while preserving the full contact message, actions, and object field.
- V2 remains local-file compatible; do not replace the vendored runtime with a CDN dependency.

### V2 Superseded Background Explorations

- No environmental background is active in V2 Selected Work. RCCV, Boutique Accommodation, Cool Runnings, Proposal, and Why Elevators all share the white canvas beneath the contained chapter divider.
- Earlier forest, lawn, city, lobby, and pew explorations remain source-recorded in `v2/assets/backgrounds/README.md` but are not approved for implementation.

### V2 Proposal Builder — July 16, 2026

- The canonical source is `/v2/proposal-generator.html`; promotion publishes it at `/proposal-generator.html`.
- The page reuses the existing `proposal-generator.js` hooks and the existing `/api/proposal/suggest` and `/api/proposal/generate` endpoints. There is one generation implementation, not a V2 fork.
- Public explanation is limited to four accurate generated elements: Custom map, Generated sample ad, Unique industry copy, and Offer.
- Desktop uses a full-bleed white working area with the live form, a large proposal object, and opaque warm-paper callout cards in a normal-flow column. The system sits directly on that white field; there is no outer paper wrapper. Targets sit on the proposal's map, elevator-screen ad, headline copy, and commercial proof/offer. A responsive SVG layer calculates curves from each callout to those rendered targets and updates through `ResizeObserver`. Mobile hides the long paths, keeps the four preview targets, and uses an 18px-padded matching numbered card list.
- The approved PNG is the initial preview. Generation returns a private custom binary bundle containing a fitted first-page JPEG and the source PDF. The image replaces the preview without browser scrolling; Open PDF and Download use the PDF blob. Do not restore a native PDF iframe: Chrome's viewer is a fixed desktop application that requires mobile panning and zooming.
- The outreach email keeps adjustable values in brackets and uses `[number of screens]` before generation rather than a fictional default. A successful generation returns `X-Proposal-Screen-Count`, and the email replaces the placeholder with the actual unbracketed inventory count used in the PDF.
- A separate warm-paper handoff shows how this output fed the Local Prospecting and Enrichment workflow: reviewed business context, public sources, and nearby inventory became a personalized email draft plus a custom proposal. The workflow prepared those materials; a salesperson reviewed the recipient, language, commercial offer, and final send.
- The visible Midtown Family Dental email sells the local elevator-screen concept rather than repeating proposal-wide network totals. It opens with the practice competing against hundreds of other dental practices on Google's first page, contrasts that crowded search environment with the calculated number of elevator screens within five miles, and introduces a personalised, conversational campaign concept with the ad mocked onto a screen and nearby buildings mapped. Every generated prospect email uses its own calculated nearby inventory.
- Browser code contains no Mapbox or LetzAI credentials, direct third-party calls, or private inventory. Generation requires an explicit same-origin JSON request up to 16 KiB, including already-parsed bodies. Suggestion queries are capped at 180 characters. Responses remain private/no-store, and the proposal page CSP uses `frame-src 'none'`.
- Upstream images are HTTPS-only, bounded by timeout and byte caps, and checked for public addressing plus image content type. Chromium 149 filters disabled web security and blocks non-embedded page requests during PDF and perspective rendering.
- The Vercel production-equivalent build resolves the serverless functions to Node 22 from `package.json`; that intentionally overrides the linked project's older Node 24 dashboard setting. Required encrypted environment variables exist for Production and Preview only.
- `.vercelignore` excludes `AGENTS.md`, `DESIGN.md`, `PRODUCT.md`, `.github/`, and the background working README so project instructions and automation are not published as static assets.
- Production has a durable Vercel Firewall limit of three `/api/proposal/generate` requests per IP per hour, backed by warm-instance limits for generation and address suggestions. Same-origin checks are not authentication, so monitor 429 and 5xx volume and add a human challenge if distributed abuse appears.
- Full evidence and commands are recorded in `docs/security/v2-proposal-builder-security-review.md`.

## Privacy and Open Questions

- Company names can appear in the resume/experience area. Elsewhere, prefer category descriptions when public naming is unnecessary.
- Do not expose private Vertical Impression automation, internal data, API keys, or client-identifying information.
- Confirm which proof points can be public and which need anonymized category labels.
- The Boutique Overview, Treehouse, and Cabin source heroes are active truth for V2 and must remain separate, ordered, semantic, and locally hosted in `v2/okanagan-preview/`. Record a replacement film for Why Elevator Advertising when ready.
- Complete direct Business Profile Performance API authentication before presenting exact profile calls, website clicks, directions, or total profile interactions.
- Verify the presentation-publishing implementation against the current corporate Vercel and Webflow schemas before publishing code-level details.

## Production Repair Backlog

This is the concrete correction list from the July 13 production audit. Items stay here until the live page is visually verified at desktop, tablet, and mobile widths.

### Data and Automation

- Cool Runnings must remain a rolling latest-28-day report, not a frozen claim.
- A successful refresh must update both the metrics and the visible Last refreshed date. A failed pull must leave the previous date and values intact.
- The laptop-bound Codex automation was deleted on July 20, 2026. It must not be restored as the production refresh path.
- The latest scheduled refresh passed on July 24, 2026. The verified snapshot covers Search Console June 24–July 21 and GA4 June 26–July 23, with DataForSEO's July 15 weekly database.
- `.github/workflows/refresh-cool-runnings-metrics.yml` is the operational remote replacement. It has a daily 14:23 UTC schedule and manual trigger, materializes the two approved scoped read-only Google OAuth credentials from GitHub Secrets, runs the all-or-nothing snapshot refresh, writes the Search Console and GA4 windows to the GitHub Actions run summary, commits the verified JSON, and waits for Vercel to serve the exact timestamp. Search Console intentionally ends three days behind the run date; GA4 ends on yesterday. The July 24 scheduled run succeeded, produced a Search Console window through July 21 and GA4 through July 23, and verified the production timestamp.
- The actual Cool Runnings site emits `phone_call` for every `tel:` click, `whatsapp_click` for `wa.me` clicks, and `generate_lead` only after the contact endpoint returns success. The site-side GA4 measurement ID is present on every generated page. Its server metrics implementation has passing coverage for Search Console aggregates, GA4 users/conversions, explicitly tagged Business Profile sessions, and direct Business Profile Performance API totals.
- The separate `cool-runnings-deploy` Vercel project is not operational as a metrics source yet. As of July 17, its environment has GA4 property, GA4 Business Profile campaign, GSC site URL, and Blob credentials, but lacks `CRON_SECRET`, all five Google Workload Identity values needed by the route, and the optional four Business Profile OAuth/location values. The metrics API and cron code are currently uncommitted in the Cool Runnings worktree, so they are not live just because the local 31-test metrics suite passes.
- The server-native Cool Runnings Vercel cron is coded but not operational. The `cool-runnings-deploy` project currently has no metrics environment variables and `/api/metrics` returns 404. It needs Blob storage, Google Workload Identity/Search Console access, GA4 access, `CRON_SECRET`, and optional Business Profile OAuth before it can replace the Codex automation.
- Exact Business Profile calls, views, website clicks, directions, and total interactions remain unavailable until direct Business Profile Performance API access is configured. Do not imply GA4 can separate those values without a tagged listing URL.

### Selected Work Device Frames

- RCCV uses the isolated generated laptop composite. V2's own 66.28-second MP4/WebM files remove the first 12 seconds and the later 14.4–19.4s self-referential/blank transition, joining the parish homepage directly to Stations with a short crossfade. The shared root files remain the approved 71.6-second V1 cut.
- Boutique Accommodation uses its own wide black browser treatment with a real URL bar and the same-origin semantic three-scene preview. The iframe must contain local source movies, copyable text, a functional non-navigating Stays menu, and independent internal scroll; never replace it with flattened recordings or a remote frame.
- Cool Runnings uses one distinct graphite laptop cutout, with the existing sizzle film in its transparent screen aperture and a centre-timed whole-object reveal. Do not duplicate the full laptop image to fake a base.
- Why Elevator Advertising also reuses the generic CSS browser shell. It needs a separate, more dimensional perspective browser with the complete page visible and a replaceable media viewport.
- The proposal PDF should remain a letter-size paper artifact, not be forced into a browser or laptop frame.
- The album section should remain an overlapping album-art composition on a colour-matched black field.
- Generated assets `browser-silver-frame.png`, `browser-silver-green.png`, `laptop-graphite-frame.png`, `laptop-graphite-green.png`, and `laptop-three-quarter-green.png` currently exist but are not connected to any production section. Either convert them into reusable frame/mask pairs or remove them after replacements are approved.
- Every device shell must support a still image or looping video without changing the surrounding layout.

### Selected Workflows and Tools

- V1 Presentation Publishing still uses the obsolete visual. V2 now contains image-generated desktop/mobile artwork showing sales authoring followed by the Cloud Scale deployment path, plus a corrected detail page; do not port them into V1 until V2 is approved.
- V2 workflow panels use dominant, readable desktop/mobile exports from one visual language without forcing one composition on every system. Content uses the exact approved black desktop plate and its faithful mobile adaptation; Agency Dashboard remains unchanged; Presentation, Prospecting, and Website Production use workflow-specific dark card-and-routing layouts. The compact tab labels must not compete with the evidence.
- The Agency Management Dashboard belongs in Selected Workflows and Tools, not Selected Work. Its modal/detail treatment still needs a public-safe explanation of sources, operation, and use.
- Website Production and Image-to-Website Production use the shared approved workflow visual family with a distinct evidence-and-imagery convergence, live HTML proof, documented system, production scale, lint, and human release gate.

### Completed V2 Layout Corrections

- About uses a 280svh desktop sticky story and a 240svh mobile sticky story. The complete sentence initially reads normally, then the measured practical-value clause takes over from its exact inline anchor. Surrounding copy fully fades before the clause grows, the clause and conclusion stay within the available composition, a gold line draws toward the portrait frame, and the process statement appears before release. Reduced motion alone uses the complete static fallback without trapping the viewport.
- `Let’s build something useful.` is a full-bleed hard-gold section.
- Outcomes are four centred metrics with unchanged claims. Experience is a centred chronological ledger with no route image, dots, or markers.
- Desktop and tablet Selected Work share the white canvas with the Hero but begin below a navbar-aligned contained hairline. They retain shared responsive type/spacing tokens, intentional object scale, and consistent internal separators.
- The V2 proposal page's final hard-gold outcome uses a padded inner page frame; `.page-frame` is never applied directly to the large paragraph.
- The hero uses the approved films' baked Inputs, Workflow System, and Outputs labels plus one Systems Thinking HTML statement. The app selects matching desktop/mobile posters and sources before loading; no duplicate label layer is allowed.
- The Okanagan iframe keeps a fixed 1100px internal desktop canvas and scales it into the black device at 1440, 1024, 768, 390, and 320. This prevents the mock site from collapsing into a navbar-only phone layout.
- The focused browser regressions are `tests/qa-v2-home-breakpoints.mjs` and `tests/qa-v2-proposal-builder.mjs`; both cover 1440, 1024, 768, 390, and 320. The homepage check covers hero poster/source, duplicate overlays, heading consistency, overflow, and the Okanagan desktop nav. The proposal check covers all four annotations, connector alignment, generated image/PDF bundle, and fitted mobile output.
- July 24 production verification: deployment `dpl_93LxygfP6JVnpPWuanQSkVe61YeF` passed the same five homepage and proposal widths. A real 390px Mapbox and proposal-generation run returned a fitted 327-screen preview plus functional PDF Open/Download blobs with no iframe, overflow, or client error.
