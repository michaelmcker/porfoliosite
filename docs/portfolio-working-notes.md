# Portfolio Working Notes

Last updated: July 15, 2026

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

V1 remains the production homepage. V2 is an unlinked assessment at `/v2/`; it now contains the complete homepage plus detailed public-safe pages for all five selected workflows.

1. Approved animated hero.
2. Selected Work: public-facing outputs and case studies.
3. Bias to Build and the six-stage method.
4. Selected Workflows and Tools: repeatable systems behind the outputs.
5. Outcomes: concise proof with clear provenance.
6. About: personal story plus the interactive Renaissance portrait.
7. Experience: company, title, and dates, with resume download.
8. Contact: email, LinkedIn, and GitHub.

## Selected Work

### RCCV

- Public title: Bringing a community site to life.
- Story: clean up and modernize the site, make it more community-focused, make bulletins and events easier to use, and bring educational content to life with interaction.
- Media: angled laptop frame; must accept looping video or a still.
- Links: homepage and Interesting Interactions / Stations of the Cross.

### Boutique Accommodation

- Public title: Elevating a boutique accommodation site.
- Story: take underused property assets and weak photography, improve the visual system with AI, and build scroll-led stories for the Overview, Treehouse, and Cabin.
- Media: browser window with a real URL bar; replaceable with nested scroll video.
- V2 interaction: use `v2/embeds/okanagan-treehouse.html`, a same-origin browser document made from the live Overview, Treehouse, and Cabin copy, links, and approved local photography. The live Worker sends `X-Frame-Options: SAMEORIGIN`, so it cannot be the iframe source. Keep the curly preview cue as one unit above the browser and inside the content width; text stays selectable, destinations clickable, iframe scroll stays local, and outer-page scroll gently rotates the browser shell. Reduced-motion keeps the complete interactive document visible.
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

V2 presents this as one black chapter: the centred section heading leads directly into a neutral accordion. Desktop uses overlapping 64px charcoal spines with 22px overlap and a hidden active rail; mobile uses explicit stacked rows. Do not restore per-workflow colours. Numeric flex bases are required for the desktop slide.

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

### Agency Management Dashboard

- Purpose: improve client delivery quality by making customer data accessible and queryable.
- Sources: Search Console, Analytics, Reddit, SERP data, Keywords, Blog, CMS, Backlinks, conversion data, and client notes.
- Functions: reporting, content queue, keyword discovery, Reddit feed and scoring, response creation, opportunity surfacing, missing-content detection, and delivery review.
- Public name should be plain-language, not internal jargon. Current label: Agency management dashboard.

### Local Prospecting and Enrichment

- Google Maps discovery finds local businesses in the target geography and category.
- Enrichment adds business details and fit signals.
- Inventory matching connects businesses to nearby digital-out-of-home screens.
- Qualified prospects move into sales handoff and tailored proposal creation.
- Approved visual: browser map with discovery, enrichment, screen matching, and sales handoff.

### Presentation Publishing

- The sales team creates a self-contained HTML sales presentation using branded design skills.
- The publish skill calls the Vercel API and publishes the presentation to the corporate Vercel account.
- The proposed name and URL are checked against existing presentations to prevent duplicates or accidental replacement.
- The skill calls the Webflow API to create or update the CMS record.
- Shared iframe code is stored in the presentation embed field.
- The custom Webflow template renders the Vercel presentation full screen.
- The skill deploys and publishes the Webflow changes and returns the final sales-facing URL.
- Access control may exist outside the public story when a specific presentation requires it, but it is not a stage or visual emphasis in the V2 workflow.
- Problem solved: HTML artifacts were difficult for salespeople to put into prospects' hands; this turns them into managed, branded, shareable pages.

Public V2 sequence, in order:

1. Branded self-contained HTML presentation.
2. Vercel API deployment.
3. Proposed name and destination validation before any CMS write.
4. Webflow CMS iframe field update.
5. Full-screen presentation template.
6. Published URL verification in both publishing layers.

The deterministic V2 visual uses this exact sequence. Do not add duplicate validation, fictional integrations, or unreadably small implementation detail.

### Image-to-Website Production

- Understand the offer, audience, product, and visual problem.
- Research references and establish a visual direction.
- Create structured JSON prompts for image generation, including model, wardrobe, product, props, environment, lighting, camera logic, and protected details.
- Generate options, assess realism and brand fit, iterate, and approve.
- Translate approved imagery into a design system and website composition.
- Build with AI assistance, review with human taste, test, and deploy.
- Demonstration idea: show a JSON prompt overlay changing a model's shirt colour, product, headphones, and setting, followed by the generated output and website application.

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

- Use local DM Sans for functional copy. Use local Fraunces for project titles, workflow titles, metrics, and selective personal/editorial moments. Desktop inactive rail labels are 64px wide, overlap by 22px, use 900 weight, and disappear when active so workflow evidence owns most of the stage.
- Do not use eyebrow labels anywhere in V2, including the workflow-detail pages. Bias to Build is a large editorial heading, not a small label.
- Do not use pastel or unrelated flat fields as the homepage structure. Bias to Build uses hard gold and About uses deep forest. The approved accordion is neutral: charcoal inactive rails, a warm-paper active rail, and a shared charcoal content stage. Do not colour-code individual workflows.
- Treat hero media, laptops, browsers, proposal sheets, album artwork, and the About portrait as authored physical objects. Hero and screen surfaces share a thick black bevel, rounded corners, restrained perspective, and a strong drop shadow.
- Keep the Renaissance portrait in About only; never place it in the hero.
- Keep the interactive portrait inside the existing brown frame and show it at a larger scale. A V2-only embed accepts section-wide pointer coordinates. The full practical-value sentence begins inline; a measured duplicate then expands into the scroll moment with an animated gold line.
- Reuse the responsive system-map film in the largest raised black-bevel hero card, beside the hero copy. The hero subhead ends after `scale.`; `And sometimes, stuff just for fun.` is a separate italic Fraunces beat.
- Hero and every Selected Work stage use the same white canvas. Music is the only black interlude. No project row uses a photographic or grey background.
- Selected Work keeps the Z-pattern and existing media/interactions. Boutique keeps the wide black browser, but the curly arrow appears before `Scroll the preview`, both form one unit above and outside it. The preview is selectable same-origin HTML, not a video or image swap: internal links and document scroll stay inside the frame while outer scroll controls only the browser’s subtle pose. Status, Previous, and Next overlays do not sit on the work.
- RCCV is a large isolated laptop treatment, not a laptop inside another screen bezel. Its exact video is masked by `laptop-three-quarter-rccv-cutout.png` to remove the baked cream background. Its restored title is `Bringing a community site to life.` and its specific interaction link is `Explore the interactive Stations of the Cross`.
- The proposal remains the real letter-shaped artifact but loses its surrounding faux frame; the PDF itself is larger and receives the rounded corners.
- Accommodation begins slightly right and rotates gently as it settles with outer scroll. Cool Runnings uses the transparent graphite laptop frame and opens its lid around the existing sizzle film. Why Elevators begins pitched back and resolves at a slight angle rather than straight-on.
- Hero, RCCV, and Cool Runnings videos have no visible or invisible Pause control surface. They lazy-load and autoplay while visible; reduced-motion users see static posters.
- Bias to Build uses a spacious, unnumbered two-row snake on desktop: Understand → Shape → Build, then Measure → Refine → Systematise from right to left. One thin continuous route connects the full sequence instead of heavy per-label arrows. Mobile keeps the same semantic order beside a quiet vertical route.
- Desktop workflow states use a full-width expanding-spine accordion at 1100px and wider; smaller layouts use vertical rows with mobile-readable artwork. Desktop open and closed states use explicit numeric widths so the spine actually slides. The four inactive rails overlap; the active rail is visually hidden. Active panels are taller and give the workflow image more room. Rails are neutral rather than category-coloured.
- V2 type and padding rhythm is governed by `--type-h1`, `--type-h2`, `--type-h3`, `--space-section`, `--space-heading`, and `--space-copy` in `v2/styles.css`. Avoid isolated heading clamps and section paddings that do not derive from those roles.
- About uses the Renaissance arch. `Even when the practical value is questionable, there is value in the process.` is one normal sentence at rest. An aria-hidden duplicate is measured onto the exact start of the practical-value clause; scroll then fades the original, interpolates real font size, weight, family, and colour for sharp text, keeps the growing copy inside its column, resolves the process conclusion below it, draws a visible gold line toward the portrait, and only then releases the page. A stable parent stage exclusively owns the pointer and sends normalized coordinates into the presentation-only portrait iframe. Experience is a tighter centred ledger without row rules, route dots, or timeline markers.
- Outcomes are four centred metrics with unchanged claims.
- All five workflow detail pages use one shared structure and stylesheet. Each page states its purpose, rationale, accurate steps, tools and sources, what ships, human review, public-safe proof and constraints, and related work.

### V2 Scroll and Physics Finale — July 15, 2026

- The contact sequence is progressive enhancement over a complete static hard-gold composition.
- The sequence is not controlled by scroll. When 40% of the stage enters view, it starts once per page load, aligns the stage to the viewport, locks page movement for its 4,800ms entrance, and restores scrolling before gravity begins.
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

- No environmental background is active in V2 Selected Work. RCCV, Boutique Accommodation, Cool Runnings, Proposal, and Why Elevators all use the white canvas.
- Earlier forest, lawn, city, lobby, and pew explorations remain source-recorded in `v2/assets/backgrounds/README.md` but are not approved for implementation.

## Privacy and Open Questions

- Company names can appear in the resume/experience area. Elsewhere, prefer category descriptions when public naming is unnecessary.
- Do not expose private Vertical Impression automation, internal data, API keys, or client-identifying information.
- Confirm which proof points can be public and which need anonymized category labels.
- The retired Boutique recordings remain checked in as source history, but V2 now uses the selectable same-origin HTML preview. Record a replacement film for Why Elevator Advertising when ready.
- Complete direct Business Profile Performance API authentication before presenting exact profile calls, website clicks, directions, or total profile interactions.
- Verify the presentation-publishing implementation against the current corporate Vercel and Webflow schemas before publishing code-level details.

## V1 Production Repair Backlog

This is the concrete correction list from the July 13 production audit. Items stay here until the live page is visually verified at desktop, tablet, and mobile widths.

### Data and Automation

- Cool Runnings must remain a rolling latest-28-day report, not a frozen claim.
- A successful refresh must update both the metrics and the visible Last refreshed date. A failed pull must leave the previous date and values intact.
- A daily Codex automation now refreshes Search Console and GA4, updates `data/cool-runnings-metrics-current.json`, runs QA, and deploys the portfolio.
- The server-native Cool Runnings Vercel cron is coded but not operational. The `cool-runnings-deploy` project currently has no metrics environment variables and `/api/metrics` returns 404. It needs Blob storage, Google Workload Identity/Search Console access, GA4 access, `CRON_SECRET`, and optional Business Profile OAuth before it can replace the Codex automation.
- Exact Business Profile calls, views, website clicks, directions, and total interactions remain unavailable until direct Business Profile Performance API access is configured. Do not imply GA4 can separate those values without a tagged listing URL.

### Selected Work Device Frames

- RCCV is the only selected-work item currently using a real generated device composite. Replace its short seven-second composite with the newly approved RCCV hero recording once the exact source asset is confirmed, then provide optimized WebM and MP4 versions.
- Boutique Accommodation now uses its own wide black browser treatment with a real URL bar and the selectable same-origin HTML document; do not replace it with a video viewport.
- Cool Runnings now uses the distinct graphite laptop cutout, with the existing sizzle film in its transparent screen aperture and a scroll-driven opening lid.
- Why Elevator Advertising also reuses the generic CSS browser shell. It needs a separate, more dimensional perspective browser with the complete page visible and a replaceable media viewport.
- The proposal PDF should remain a letter-size paper artifact, not be forced into a browser or laptop frame.
- The album section should remain an overlapping album-art composition on a colour-matched black field.
- Generated assets `browser-silver-frame.png`, `browser-silver-green.png`, `laptop-graphite-frame.png`, `laptop-graphite-green.png`, and `laptop-three-quarter-green.png` currently exist but are not connected to any production section. Either convert them into reusable frame/mask pairs or remove them after replacements are approved.
- Every device shell must support a still image or looping video without changing the surrounding layout.

### Selected Workflows and Tools

- V1 Presentation Publishing still uses the obsolete visual. V2 now contains the corrected deterministic six-stage artwork and detail page; do not port them into V1 until V2 is approved.
- The workflow stage is still too compressed on desktop. The active workflow image should occupy the dominant right-hand area at the same visual scale as Selected Work, with the workflow list functioning as compact tabs rather than competing headlines.
- The Agency Management Dashboard belongs in Selected Workflows and Tools, not Selected Work. Its modal/detail treatment still needs a public-safe explanation of sources, operation, and use.
- Website Production and Image-to-Website Production still need approved workflow visuals.

### Completed V2 Layout Corrections

- About uses a 280svh desktop sticky story. The complete sentence initially reads normally, then the measured practical-value clause takes over from its exact inline anchor. Surrounding copy fully fades before the clause grows, the clause and conclusion stay within the available copy area, a gold line draws toward the portrait, and the process statement appears before release. Mobile and reduced-motion layouts show the complete sentence without trapping the viewport.
- `Let’s build something useful.` is a full-bleed hard-gold section.
- Outcomes are four centred metrics with unchanged claims. Experience is a centred chronological ledger with no route image, dots, or markers.
- Desktop and tablet Selected Work use one white canvas, shared responsive type/spacing tokens, intentional object scale, and consistent separators.
- The hero's approved HTML overlay labels remain anchored over unfinished diagram regions at every breakpoint.
