# Portfolio Site - Agent Context

## Start Here

1. Read `docs/portfolio-working-notes.md` for source truth, proof constraints, and workflow details.
2. Read `DESIGN.md` for the production design system and legacy V1 reference.
3. Check `git status --short` before editing. Preserve unrelated work.
4. Run `npm test` before and after implementation changes.

## Current Production Scope

The approved V2 system is the production site at `/`. The canonical editable source remains under `v2/`; `npm run promote:v2` produces the root homepage and proposal page. Do not hand-edit a promoted root copy without making the corresponding V2 source change first.

The production system currently contains:

- the complete homepage at `/`, sourced from `v2/index.html`;
- the proposal builder at `/proposal-generator.html`, sourced from `v2/proposal-generator.html`;
- five public-safe workflow pages under `/v2/workflows/`;
- the local-search case study at `/v2/work/local-search-magnet.html`;
- one workflow-artwork visual language derived from the approved Search-Optimized Content plate, with workflow-specific topology and separate desktop/mobile exports. The Agency Dashboard is the explicit exception: preserve its approved dashboard view.

Legacy `/v2/` homepage and proposal URLs redirect to their production root equivalents. Keep workflow and case-study routes stable until a separate route-flattening migration is approved.

Production telemetry is an explicit release gate. Use a dedicated personal portfolio GA4 property; never send portfolio traffic into a client or employer property. The Search Console domain property must be verified before its sitemap submission is described as complete. Until those external account steps are done, the conditional GA4 regression test remains skipped rather than accepting a placeholder measurement ID.

## Source and Legacy Isolation

- Production source under `v2/` may reuse existing media through relative references into the root `assets/` directory.
- Production pages must not import the legacy V1 CSS or JavaScript.
- Use `scripts/promote-v2-to-root.mjs`; its deterministic path rewriting and root-route tests are the promotion contract.
- The shared proposal API remains one backward-compatible implementation for the root and redirected V2 presentation routes.
- New production source belongs under `v2/`; tests and renderers belong under `tests/` and `scripts/`.
- The former V1 visual system is documentation and git-history reference only. Do not restore it to `/`.

## V2 Design Contract

- Type: local DM Sans for functional text; local Fraunces carries project titles, workflow titles, metrics, and selected personal/editorial moments. Monospace is reserved for real technical artifacts.
- Palette: the homepage base canvas is white (`#FFFFFF`) with ink `#171813`. Bias to Build uses hard gold `#E3A916` and About uses deep forest `#243C31`. The approved accordion is neutral: overlapping charcoal inactive rails and one charcoal content stage. Do not reintroduce per-workflow rail colours.
- Composition: the Hero and Selected Work remain white behind dimensional laptop, browser, or document objects. Separate them with one contained hairline aligned to the same maximum width and gutters as the navbar; do not use a full-bleed colour field. Individual project stages remain transparent and Music is the one black interlude. Do not add a copy card or photographic project background.
- Material: hero and device surfaces share a thick black bevel, rounded corners, strong physical shadow, and restrained perspective. The portrait keeps its authored brown frame.
- Avoid graph-paper textures, route dots, harsh rules, mono labels, eyebrow labels anywhere in V2, arbitrary cards, and colour used only to fill space.
- Bias to Build is a full editorial section heading and begins immediately after the black music interlude. Its sequence is fixed: Understand, Shape, Build, Measure, Refine, Systematise. Desktop presents the six unnumbered stages as a two-row snake behind one thin continuous route; mobile stacks the same sequence beside a quiet vertical route.
- Spacing and type use the V2 tokens in `v2/styles.css`: `--space-section`, `--space-heading`, `--space-copy`, `--type-h1`, `--type-h2`, and `--type-h3`. The 761–1099px tablet range has its own fluid token values so desktop headings do not survive unchanged into narrow two-column layouts. Do not add one-off heading scales or arbitrary section padding without updating the token contract and viewport proof.
- Motion must remain complete under `prefers-reduced-motion`. Showcase films autoplay only while in view and expose no pause-button chrome or fake control surface.

## Interaction Contracts

- Desktop workflow accordion begins at 1100px and uses horizontal expanding spines.
- Below 1100px it becomes a vertical accordion with a dedicated readable composition, not a panned desktop diagram.
- The workflow heading and accordion form one full-bleed black chapter. Active hierarchy is a compact editorial Fraunces title with the CTA in the same top row, a short description, then dominant media on a consistent charcoal artifact stage. Desktop inactive spines are unnumbered, 64px wide, overlap by 24px, and use ordered perspective, narrow side faces, adjacent charcoal values, and directional shadow so they read as a physical stack. The active rail is visually hidden so the workflow evidence receives most of the canvas. Below 1100px the perspective resets and the controls become flat rows. Keep explicit numeric flex bases on desktop; transitioning through `auto` makes the slide snap.
- Selection changes only on click, tap, Enter, or Space. Arrow keys, Home, and End move focus. Inactive regions are `inert` and `aria-hidden`.
- Boutique Accommodation uses the same-origin `v2/okanagan-preview/` document inside the wide black browser. Source-lock its public navigation and hero copy to the deployed Okanagan Worker: `Stays`, `Things to Do`, `Gallery`, `Reviews`, `About`, `FAQ`, `Blog`, and `Book your stay`, in that order. Preserve both real Stays cards with their deployed names, summaries, prices, guest counts, and ratings, plus the light/dark logo marks and the four-part proof strip on every hero. It copies the actual deployed Okanagan hero structure and exact source media into three sequential sticky scenes—Overview, Treehouse, Cabin—with semantic, selectable nav/headline/subhead/button HTML over local 854px-wide, fast-start H.264 movies with frequent seek keyframes. Keep each source movie below 2.8 MB. Each scene owns its scroll lock and deterministic forward/reverse seek; scrolling the iframe must not move the portfolio page. The full desktop navigation remains visible at the embedded desktop frame width and switches only below 560px. The Stays menu opens, while every preview link prevents navigation. The visible browser URL mirrors the active scene as `okanagantreehouse.ca`, `/treehouse`, or `/cabin` without navigating. Never replace this with flattened screen recordings or a remote iframe. Outer portfolio scroll only moves the shell from a right-hand 3D entry into its final left-tilted pose. Reduced motion keeps all three static semantic scenes and hides their movies.
- Showcase videos begin loading before they enter view, autoplay while visible, and have no visible or invisible pause-button UI.
- The V2 hero reuses the responsive system-map film and approved poster inside the largest raised black-bevel card. Approved HTML overlay labels cover the film's unfinished regions and no caption appears below it. Do not return it to a full-bleed background treatment.
- Selected Work uses one shared desktop stage height on the white canvas for RCCV, Boutique Accommodation, Cool Runnings, the proposal, and Why Elevators. The chapter begins with a contained navbar-aligned hairline; project stages themselves are transparent. Project labels sit below their titles, and the first stage has no additional rule below the section heading. Tablet layouts use a denser two-column grid for ordinary text-and-device cases, but Boutique remains one column so its embedded width never crosses the real site's 560px mobile-navigation breakpoint. Boutique keeps the wide black nested-scroll browser; the curly arrow and `Scroll the preview` occupy a dedicated grid row with 30–40px clearance above the frame, and no status/Previous/Next UI overlays the work.
- RCCV uses the isolated laptop treatment without the shared black screen bezel. Its video is masked with the checked-in alpha cutout so the baked cream background cannot show. V2 uses its own 66.28-second MP4 and WebM files under `v2/assets/videos/`; they remove the first 12 seconds of the previous cut and the later self-referential RCCV/blank transition between the parish homepage and Stations, with a short crossfade joining the two real surfaces. The shared root assets remain the previously approved 71.6-second V1 cut. The project heading is `Bringing a community site to life.` and the specific interaction link is `Explore the interactive Stations of the Cross`.
- The proposal is a larger rounded PDF artifact with no surrounding paper frame. Boutique begins right in 3D and crosses into a slight left tilt as outer-page scroll centres the section. Cool Runnings uses one graphite laptop cutout around the existing sizzle film; never duplicate and clip a second full laptop image as a base. Its laptop is deliberately larger (`min(132%, 1180px)`) but the reveal is quieter: modest translation, 28-degree opening pitch, and only a subtle lateral rotation. It starts before entry and must be complete, visible, and at its final pose when the project text is vertically centred. Why Elevators begins pitched back, finishes at a slight angle by 72% of its scroll progress, and holds that pose before it leaves the viewport.
- About tracks pointer input across the whole section through a V2-only portrait embed inside the approved Renaissance arch. The parent sticky stage is the sole pointer owner and sends normalized coordinates into a presentation-only iframe; the iframe must not install a second cursor or pointer surface. Its desktop story is 280svh and its mobile story is a purpose-built 240svh sticky composition. Both begin with `Even when the practical value is questionable, there is value in the process.` as one uninterrupted, normally styled sentence. An aria-hidden focus copy is measured onto the exact inline phrase before scroll; only then may the surrounding copy fade and the phrase increase its actual font size, weight, family, and colour. On mobile the phrase is capped at 2.35rem, the arch sits bottom-right, the conclusion resolves in the lower-left, and a shorter gold path ends at the frame edge rather than crossing the face. The process conclusion and build-note link must appear before release. Never use a CSS scale transform or allow phrase, conclusion, or portrait to leave the sticky frame.
- Experience is a centred chronological ledger with company, role, and date on one axis. It has no route image, duplicate dots, or timeline markers.
- The contact chapter is progressive enhancement over a complete hard-gold composition. It is not scroll-controlled: an `IntersectionObserver` starts one 4,800ms entrance per page load when 40% of the stage is visible. The stage aligns to the viewport and temporarily locks page movement for the entrance only; scrolling is restored after the final object enters physics, and reduced-motion or failed-script states never lock the page. Portfolio objects enter beyond the upper-left edge and follow exactly two inward Archimedean turns. Equal arc-length mapping keeps their travel speed even, per-object phases form a readable stream, tangent rotation follows the path, and each object scales continuously from 100% to roughly 72% at handoff. Desktop uses the broad circular path; mobile uses a viewport-aware ellipse (`46vw` horizontal radius and `42vh` vertical radius) so the stream crosses both sides without spending most of the entrance offscreen. During the final approach, each card transfers independently into the locally vendored Matter.js field as soon as its own phase reaches the centre. The next card continues orbiting while the previous one falls, avoiding a single clustered handoff. Gravity uses scale `.0017`, a distributed release band, and small alternating initial velocities so the pieces separate promptly without exploding outward. Four boundaries, collisions, friction, and angular motion remain active. Dragging uses a dynamic point constraint with high positional stiffness and no angular stiffness; releasing removes the constraint without zeroing velocity or rotation, so the object can toss, collide, bounce, and settle naturally. Contact copy resolves during the sequential drop and switches between dark and light treatments according to object overlap. Use the actual laptop, browser, proposal, and workflow assets plus the layered head-visible finale portrait rather than placeholder cards. Reduced-motion and failed-script states show the complete composition without the interaction.

## Workflow Detail Contract

All five pages use `v2/workflows/workflow-detail.css` and include:

- one-sentence purpose;
- why the workflow exists;
- five to seven accurate steps;
- tools and data sources;
- what ships;
- what remains human-reviewed;
- public-safe proof and constraints;
- related work.

Keep automation support and human judgment explicit. Do not expose credentials, private client data, internal identifiers, unpublished artifacts, or fictional integrations.

The Image-to-Website route has a fixed seven-stage source-truth sequence: research the existing business plus competitors and best-in-class sites; generate many hero-section explorations and mood boards; complete human direction review; build a selectable HTML proof; after approval create `DESIGN.md` and an HTML style guide; scale and lint the site; complete human design review before publishing.

The approved Search-Optimized Content image defines the visual language for every process workflow: black canvas, off-white artifact cards, recognisable tool logos, realistic browser/table/document surfaces, and thin blue, green, red, and gold routes. Workflow artwork is generated in reference-image mode; do not recreate it with HTML, CSS, SVG, Mermaid, or a shared diagram renderer. Reuse the visual language without forcing every workflow into the same topology:

- Content desktop is the exact approved black workflow plate at `v2/assets/workflows/content-production-approved-desktop.png` (SHA-256 `8df1ac85b4813445e5ffd836efcd8cce380a945b2a2e315fcead1c297bb1932b`). Never redraw, replace, or regenerate it.
- Content mobile is the approved Candidate C chapter-board composition at `v2/assets/workflows/content-production-approved-mobile.png` (SHA-256 `46438ba3988c02c2d488ea8a75bd45fc1e8e6a68d9baa3accf58feada86dba7a`). It preserves the approved tools, logos, artifact detail, and coloured connections across four discrete Research, Human-Guided Production, Review, and Output boards.
- Agency Dashboard uses the exact prior V3 screenshot copied from `assets/screens/fountainhead-ai-visibility-dashboard-v3.png` to both V2 production filenames (SHA-256 `83d00ae1a5ff5746925a3e350de7b8de98c39404a4b5b68e514394631fe1f7ae`). It must retain `Keyword Content`, `Client Notes`, visibility trends, content queues, source health, delivery review, and opportunities. Never replace it with a conceptual flowchart.
- Presentation Publishing, Local Prospecting, and Image-to-Website Production are independently image-generated from the approved Content reference. Each uses its own topology and accurate tools. Desktop and mobile are separate compositions rather than crops.

The full source-truth matrix, exact prompt set, and review gate live in `v2/assets/workflows/README.md`. Shared style means common visual grammar, not copied card positions: keep each workflow's source, stages, output, topology, and human-review language accurate.

## Presentation-Publishing Source Truth

The public-safe sequence is fixed:

1. The sales team builds a customer-branded HTML presentation from the approved design system, maps, custom graphics, and account narrative.
2. Call Cloud Scale Deploy at `/deploy/presentation` with the approved artifact.
3. Deploy the presentation to Vercel through the API and capture its hosted URL.
4. Pass the deployed URL to the Webflow API as the iframe source.
5. Before writing, validate the proposed page name against existing CMS records to prevent a duplicate; then paste the Vercel URL into the iframe CMS field.
6. Publish the Webflow site, verify the managed page, and return the final link.

Sales owns the artifact's narrative, customer branding, maps, and custom graphics. The deployment sequence does not invent claims or revise the artifact after approval. Do not add fictional integrations, duplicate stages, password-led framing, a separate template stage, or a second verification stage. The page must clearly separate what ships from what remains human-reviewed.

Local Prospecting uses Apollo as an explicit enrichment source. The enriched record and nearby inventory produce the real proposal PDF shown elsewhere in V2, including its local map, dynamic screen count, customer-specific copy, and custom graphic or generated image. The PDF is attached to personalized outreach; sales reviews the recipient, message, offer, and proposal before an approved send.

## V2 Proposal Builder Contract

- `/v2/proposal-generator.html` is a V2 presentation layer over the existing `proposal-generator.js`, `/api/proposal/suggest`, and `/api/proposal/generate` contract. Do not fork the generator logic.
- The form remains functional. The annotated proposal explains the custom ad, custom copy, live screen count, and local map without blocking input, preview, open, or download controls.
- Desktop uses opaque warm-paper callout cards in the dark margins and curved hard-gold paths that terminate at the real proposal's edge; copy and containers never cover the proposal. Mobile replaces the paths with four numbered pins and a consistently padded card list. The approved rendered PNG is the initial preview fallback; a generated blob PDF takes over after generation.
- The final hard-gold outcome uses a constrained inner wrapper with its own responsive inline padding. Do not put `.page-frame` directly on the paragraph; width constraint is not text padding.
- The builder is connected to the real local prospecting workflow through a separate outreach handoff: reviewed business context becomes a personalized email draft and custom proposal, then a salesperson reviews the recipient, language, offer, and send decision. Never imply automatic contact.
- Keep Mapbox and LetzAI calls server-side. Browser source must not contain tokens, inventory data, or direct third-party API URLs.
- Proposal generation requires an explicit same-origin browser `Origin`, accepts JSON only, and caps both raw and platform-parsed bodies at 16 KiB. Suggestion and generation endpoints have warm-instance limits, and API responses are private/no-store. Expected guard failures must not be logged as server errors.
- Remote proposal images must use HTTPS, resolve publicly, return an image MIME type, and remain within their byte cap. The PDF and perspective renderers remove Chromium's `--disable-web-security` argument and abort every page request except `about:`, `blob:`, and `data:` URLs.
- Vercel must exclude project instructions, repository automation, and the local scorecard from the static deployment. Production has an edge-level Vercel Firewall rule limiting `/api/proposal/generate` to three requests per IP per hour; keep the in-function limit as defense in depth.
- Security review and current Vercel evidence live in `docs/security/v2-proposal-builder-security-review.md`.

## Verification

Run:

```bash
npm test
node scripts/qa-v2.mjs
node tests/qa-v2-proposal-builder.mjs
```

`scripts/qa-v2.mjs` verifies the homepage, all five workflow pages, and the V2 local-search case study at 1440, 1024, 768, 390, and 320 pixels where applicable. It proves the Okanagan scene order, sticky lock, desktop nav at embedded width, active-scene URL labels, visible/selectable semantic copy, forward and reverse movie seeking, functional non-navigating Stays menu, iframe-only scroll, outer-shell pose, direct `file://` playback, equal Selected Work desktop heights, and Cool Runnings completion at text centre. It also verifies cue clearance, showcase autoplay, accordion interpolation, mobile and desktop About anchors/resolution, and the desktop/mobile contact-finale physics contract. Set `QA_V2_SCREENSHOT_DIR=/absolute/path` to save the complete evidence set. Add `QA_V2_SCREENSHOT_MODE=lean` for compact Hero/Selected Work, Boutique, Cool Runnings, mobile About, and mobile-finale proof captures while retaining the full runtime checks.

The approved Content desktop file and both recovered V3 Dashboard copies are locked. New workflow artwork is generated through the image-generation tool using the reference and prompts in `v2/assets/workflows/README.md`; there is no production HTML renderer.
