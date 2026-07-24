# Design Systems

The approved V2 system is the production site. Its canonical source lives under `v2/` and is promoted to the root homepage and proposal route with `npm run promote:v2`. The former V1 system remains below only as a legacy design reference and must not be restored to production.

## Production Design System

### Direction

Warm photographic studio with an editorial publishing voice and a practical digital-product edge. V2 preserves the authored laptops, browser windows, proposal sheet, media, and interactions while removing the rigid Neo-Brutalist framing, graph textures, route dots, arbitrary colour blocking, and compressed spacing.

The accordion reference informs expressive type, expanding movement, and small moments of play. It does not determine the whole page structure or require colour-coded categories.

### V2 Colour

- Canvas and surface: `#FFFFFF`
- Warm artifact paper: `#F7F7F3`
- Surface: `#FFFFFF`
- Ink: `#171813`
- Muted: `#66665E`
- Charcoal: `#171A19`
- Deep forest: `#243C31`
- Hard gold: `#E3A916`

The workflow accordion is deliberately neutral and dark: Repeatable Systems is a full-bleed charcoal chapter, overlapping inactive rails use adjacent charcoal values with warm-white type, and the active content remains charcoal. Only the rounded artifact bed uses paper-grey `#E7E8E3`; the artwork keeps its authored black field inside that light object. Bias to Build uses hard gold and About uses deep forest. The Hero and Selected Work are white; a contained hairline aligned to the navbar width separates those chapters without creating a full-bleed colour block. Project stages remain transparent. Music is the other black interlude.

### V2 Typography

- Functional and body type: local DM Sans variable font.
- Workflow and project titles: local Fraunces variable font at an editorial, readable scale. The image remains the dominant evidence.
- Inactive desktop rail names: local DM Sans at 900 weight and `1.3rem` within 64px layered spines. Spines overlap by 24px and use ordered perspective, narrow side faces, adjacent charcoal values, and directional shadow; hover and keyboard focus lift a spine toward the reader without changing selection. The active rail hides so workflow evidence keeps most of the canvas. Below 1100px the controls reset to flat rows.
- Editorial accents: local Fraunces variable font, also used for metrics, personal statements, and the music interlude.
- Technical type: monospace only inside real technical artifacts.
- Body leading: approximately `1.55-1.7`; paragraph measure and spacing should remain stable at every breakpoint.
- Tablet type: 761–1099px uses a dedicated fluid H1/H2/H3 range so desktop display sizes do not remain fixed inside narrower grids.
- `Selected Work`, `The repeatable systems behind the work`, `Outcomes`, and `Experience` use the same smaller DM Sans chapter-heading role. Fraunces remains reserved for project titles and deliberate editorial moments.

### V2 Composition and Motion

- Use a Z-pattern for Selected Work and let each real artifact lead. RCCV, Boutique Accommodation, Cool Runnings, the proposal, and Why Elevators share the white canvas rather than appearing as cards. One navbar-aligned hairline marks the transition from Hero to Selected Work; project rows retain only their subtle internal separators. Project labels sit immediately below their editorial titles. There is no additional separator between the centred `Selected Work` heading and the first stage. Music is full-bleed black with square corners.
- Present RCCV as an isolated laptop without the shared screen-bezel wrapper. V2 uses its own 66.28-second edit, which removes the self-referential bridge before Stations without altering V1's shared 71.6-second cut. Use the specific Stations link label rather than a generic interaction label.
- Project copy sits directly on the white stage. Do not place it inside a card, panel, glass surface, or photographic background.
- Do not use eyebrow labels anywhere in V2, including workflow-detail heroes and related-work sections. `Bias to build.` is a full editorial heading and butts directly against the black music interlude. It is followed by the unnumbered sequence Understand, Shape, Build, Measure, Refine, and Systematise. Desktop uses one thin continuous route behind a two-row snake; mobile uses a quiet vertical route without decorative numbering.
- Hero and browser windows share a black bevel, rounded corners, restrained perspective, and a strong physical shadow. The hero uses a deliberately slimmer bezel and a roughly 36/64 copy-to-film desktop grid so the headline keeps a useful measure. RCCV is a larger isolated laptop masked by the checked-in alpha cutout. The proposal is a contained rounded PDF without a surrounding frame, and the albums remain on image-matched black.
- Centre sectional anchors where it improves rhythm: workflow introduction, outcomes, and experience.
- The neutral workflow accordion expands over approximately 780ms with `cubic-bezier(.22, 1, .36, 1)` and becomes vertical below 1100px. Desktop rails transition between explicit numeric flex bases; never transition through `auto`, which causes the active panel to jump. Inactive panel canvases must collapse to zero width and remain hidden while their spines move; a large hidden `min-width` causes the workflow pages to overlap during the slide. Hover or keyboard focus pulls a rail 18px from the stack with increased depth. The active desktop rail collapses visually while its panel opens; mobile keeps the active row visible as the accessible control.
- Content remains complete with reduced motion. Showcase films load close to viewport entry, autoplay only while visible, and have no pause-button chrome or fake button semantics. Below-fold images are lazy and carry intrinsic dimensions to avoid layout shift. Boutique Accommodation is one nested-scroll browser containing the same-origin `v2/okanagan-preview/`: three sequential 300svh sticky scenes copied from the actual Okanagan Overview, Treehouse, and Cabin heroes. The iframe itself is deferred, and only the scene approaching view loads its scrub movie. Copy, desktop nav, and buttons remain semantic HTML; 854px-wide fast-start H.264 source movies with frequent keyframes sit underneath, remain below 2.8 MB each, and seek deterministically in both directions. The deployed Worker is the text and navigation source of truth: keep all eight desktop items (`Stays`, `Things to Do`, `Gallery`, `Reviews`, `About`, `FAQ`, `Blog`, `Book your stay`), the full two-card Stays menu, light/dark mark behavior, and the proof strip on each hero. The iframe document always remains 1100px wide and is scaled into the portfolio device at every outer breakpoint, including 320px and 390px; the full desktop navigation therefore remains visible rather than reflowing into a phone header. The browser URL label follows the scene (`okanagantreehouse.ca`, `/treehouse`, `/cabin`) without navigation. The Stays dropdown works but links never navigate. The curly preview cue occupies its own row, with its label aligned to the line start and its arrow tip terminating at the browser's upper edge. Outer-page scroll controls only the browser’s right-to-left 3D pose. Reduced motion presents three static semantic scenes with movies hidden. Every desktop Selected Work stage shares one height. Cool Runnings keeps its existing sizzle film inside one transparent graphite laptop shell: the larger `min(132%, 1180px)` object uses a quieter 28-degree reveal, starts transforming before entry, and reaches its full, still-visible pose when its text is vertically centred; a second clipped laptop image must not be used as a base. Why Elevators rises from a pitched-back state, reaches its final angled pose at 72% of section progress, and holds before leaving the viewport.
- The V2 hero uses the responsive system-map film and matching optimized WebP posters inside a raised black-bevel card beside the copy; the 10 MB 4K source is not a first-paint asset. The checked-in 8-second H.264 files are about 2.1 MB desktop and 1.5 MB mobile, with approximately 67 KB and 62 KB first-paint posters. Desktop uses a restrained `-18%` translation so unused source space is reduced without clipping the input routes. Inputs, Workflow System, Outputs, and Systems Thinking are real HTML overlays positioned inside the translated source wrapper; generated lettering inside the film is not trusted as the readable label layer. The overlays remain hidden until the first decoded frame so text and motion arrive together. Mobile resets the wrapper, preserves native 9:16, selects its poster before its source loads, and uses mobile-specific overlay coordinates. There is no caption below the film. The final `And sometimes, stuff just for fun.` is a separate italic Fraunces beat. The About portrait uses a lightweight layered fallback followed by the V2-only interactive embed inside the Renaissance arch and a 280svh desktop / 240svh mobile sticky story: paragraph two initially reads `Even when the practical value is questionable, there is value in the process.` as one normal sentence. A measured focus copy begins on the exact inline phrase, then grows through actual font-size interpolation as surrounding copy fades. Desktop keeps the phrase capped within the copy column. Mobile caps it at 2.35rem, keeps the portrait bottom-right and the conclusion adjacent at `58svh`, and uses a shorter gold path that stops at the frame rather than crossing the face. Opening the expanded construction note dims the path so it cannot cross readable copy; mobile uses a capped scrollable note panel. The section unlocks only after the process statement appears. One stable parent stage owns pointer input and passes normalized coordinates into the presentation-only iframe, preventing competing cursor and pose systems.
- Heading and section rhythm comes from the named CSS tokens `--type-h1`, `--type-h2`, `--type-h3`, `--space-section`, `--space-heading`, and `--space-copy`. New one-off H1/H2/H3 sizes or unrelated section paddings are regressions unless the design contract itself changes.
- The full-bleed hard-gold contact chapter starts once when 12% of its stage enters view; it is never scrubbed by scroll. Matter and the lightweight finale-only WebP art begin loading when the story is within 120% of the viewport. At the entrance threshold, the stage aligns and locks immediately, then completes a bounded image decode before beginning its 4,800ms entrance. This order prevents a fast scroll from passing the chapter while assets initialize. Escape cancels the entrance, restores normal scrolling, and reveals the static composition; no other V2 section prevents wheel or touchmove scrolling. The actual portfolio objects enter from beyond the upper-left edge and make exactly two inward Archimedean turns. Equal arc-length travel prevents a rushed outer turn or accelerated inner turn, phase spacing creates a continuous stream, each card follows the tangent, and its scale falls from 100% to roughly 72% at handoff. Desktop uses the broad circular path; mobile uses a viewport-aware `46vw × 42vh` ellipse so several objects stay legible while the stream crosses both halves of the phone. Each object transfers into Matter.js independently when its own phase reaches the centre: earlier objects begin falling while later objects finish the loop. A responsive release band, `.0017` gravity scale, and small alternating velocities prevent a central pile and make the fall resolve sooner. Scrolling returns after the final handoff. Four walls, gravity, collision, friction, bounce, and angular motion create the drop. The contact message resolves during the sequential drop and dynamically changes between dark and light treatments when objects cross it. The finale portrait layers its registered head pose over the body plate. Pointer and touch dragging use a dynamic spring-like point constraint; release preserves natural momentum and rotation instead of pinning the object. The contact copy and actions keep responsive safe-area padding. Reduced motion and script failure preserve a complete static composition without locking the page.

### V2 Workflow Detail Pages

All five workflow routes share `v2/workflows/workflow-detail.css`. Each includes purpose, rationale, five to seven steps, tools and sources, output, human review, public-safe proof and constraints, and related work. The page accent changes by workflow, but structure and source-safety rules do not.

The approved Search-Optimized Content plate defines the workflow visual language: black field, off-white cards, real tool marks, realistic browser/table/document fragments, and fine blue, green, red, and gold routing. All process workflow artwork is image-generated from that reference; HTML, CSS, SVG, Mermaid, or shared flowchart recreations are not accepted source truth. Each topology follows the actual workflow:

- Content uses the exact approved dense black desktop plate plus a faithful mobile reflow that preserves its tools, artifact detail, and coloured connections.
- Agency Dashboard is the recovered real V3 AI Visibility Dashboard, not a conceptual process diagram. Preserve its `Keyword Content` and `Client Notes` source labels and its edge-to-edge operating view.
- Presentation Publishing begins with sales authoring a customer-branded HTML artifact from the design system, maps, and custom graphics, then uses the approved dark card-and-routing language for the Cloud Scale pipeline.
- Local Prospecting uses discovery, Apollo enrichment, inventory, proposal-PDF, reviewed-outreach, and approved-send branches.
- Image-to-Website uses research and broad visual-direction branches—many hero explorations, mood boards, and direction review—that converge in a live HTML proof, then move through `DESIGN.md`, scaled implementation, linting, and human review.

Desktop and mobile are separately generated compositions, not crops or responsive renders of one diagram. The exact approved Content desktop plate remains byte-for-byte locked. `v2/assets/workflows/README.md` records the asset matrix, generation prompts, and review gate. Shared visual grammar never permits copied card placement or generic topology.

### V2 Local-Search Case Study

`v2/work/local-search-magnet.html` is an isolated V2 case study linked from the Cool Runnings project. It uses the V2 editorial/object system, the real site film and screenshots, and `data/cool-runnings-metrics-current.json` for the latest verified Search Console, GA4, and DataForSEO snapshot. Search Console and GA4 have separate displayed windows: Search Console intentionally uses a three-day reporting lag, while GA4 uses yesterday as its latest complete day. Never label both sources with the Search Console window. The daily GitHub Action writes both windows to the run summary before committing and verifying the deployed snapshot. The 30% increase in sales is a separate client-reported result, not an analytics-derived metric. Exact Business Profile attribution remains unavailable until the Performance API is connected; Google-origin Analytics sessions must not be relabelled as Business Profile actions. The case study must keep canonical inputs, structured enrichment, deterministic rendering, validation/retry, useful tools, and human review distinct. It does not alter or import the V1 case-study implementation.

### V2 Workflow Artwork

Presentation Publishing uses the same dark card-and-routing visual language as the approved Content plate. Sales first builds a customer-branded HTML presentation from the approved design system, maps, custom graphics, and account narrative. The fixed deployment stages then call Cloud Scale Deploy at `/deploy/presentation`; deploy the presentation through the Vercel API; pass the resulting URL to the Webflow API as the iframe source; validate the proposed page name against existing CMS records and write the URL to the iframe field; publish the Webflow site and return the final link. The visual may nest name validation and iframe write as one CMS operation. Do not add a separate full-screen-template stage, password emphasis, fictional integration, or duplicate verification stage.

### V2 Proposal Builder

`v2/proposal-generator.html` keeps the V2 editorial hierarchy while presenting the real proposal as the evidence. The introduction and complete form/proposal/annotation workspace use one open white field without an outer wrapper card; the outcome resolves on hard gold. Warm paper is reserved for the functional form and individual annotation cards. The page must not inherit the V1 proposal stylesheet.

The proposal is a large, lightly tilted paper object. Desktop annotations are opaque warm-paper cards in a normal-flow column beside the proposal. The four approved points are Custom map, Generated sample ad, Unique industry copy, and Offer. Their targets live inside the approved preview at the map, screen creative, headline, and commercial proof. A responsive SVG connector layer calculates each path from its callout to the rendered target with `getBoundingClientRect()` and `ResizeObserver`, so lines terminate on evidence rather than an arbitrary sheet edge. Annotation text and containers must never overlap the sheet or leave the viewport. Below 700px, the long connector paths disappear, the four target markers remain on the preview, and the consistently padded cards stack as a matching numbered list. The approved PNG is the reliable initial visual at every breakpoint. After generation, a private binary response carries a fitted first-page JPEG preview plus the original PDF. The image replaces the in-page preview responsively, while Open PDF and Download use the PDF blob; never embed Chrome's desktop PDF viewer on mobile. The outreach email uses `[number of screens]` before generation; after generation, `X-Proposal-Screen-Count` replaces it with the actual unbracketed inventory count.

The final hard-gold outcome contains a padded inner page frame. Width constraint and paragraph padding are separate responsibilities so the large line never touches the viewport edge.

The visual layer reuses the shared proposal client and API contract rather than imitating generation. Inputs remain selectable, text remains copyable, and open/download actions remain functional. During submission, the button shows a restrained progress sweep and explains that generation should be ready in a few minutes. Completion updates the preview in place without forcing a page scroll. The outreach email is living HTML: business name, industry language, audience, and local area update from the same form state. The strict proposal CSP uses `frame-src 'none'` and applies only to the production proposal route without affecting other embedded V2 experiences.

A warm-paper outreach handoff follows the builder. It pairs editorial context with one authored email object, a visible proposal attachment, and a human-review note. It explains the real relationship to Local Prospecting and Enrichment: reviewed public business context and nearby inventory feed a personalized email draft and custom proposal, but a salesperson still owns recipient choice, language, commercial offer, and final send.

## Legacy V1 Design Reference

### Theme

Warm technical editorial. The visual language uses a paper grid, fine ruled borders, oversized serif display type, restrained sans body copy, and process imagery that feels like working drawings.

### Color Palette

- `--paper: #f3efe6` - main page field
- `--paper-soft: #fbf7ed` - raised panels and cards
- `--paper-deep: #e7dfcf` - image and thumbnail backing
- `--ink: #12130f` - primary text and rules
- `--ink-soft: #37352e` - body text
- `--muted: #766f63` - metadata and quiet labels
- `--faint: #bdb5a7` - secondary rules
- `--green: #5f7f3f` - proof and research signals
- `--blue: #2464bb` - API and data signals
- `--ochre: #b77b21` - review and handoff signals
- `--red: #96382f` - friction, caution, or audit signals

### Typography

- Display: `Instrument Serif`, used for large headlines, case titles, and major evidence statements.
- Body: `Instrument Sans`, used for paragraphs and navigation.
- Mono: `IBM Plex Mono`, used only for compact metadata, file paths, source labels, and code references.

Avoid long runs of all-caps mono text. Use metadata sparingly so the site does not become a dashboard.

### Spacing

The spacing scale is defined in CSS variables:

- `--s1: 4px`
- `--s2: 8px`
- `--s3: 12px`
- `--s4: 16px`
- `--s5: 24px`
- `--s6: 32px`
- `--s7: 48px`
- `--s8: 72px`
- `--s9: 104px`

Large sections use `--s7`; compact cards use `--s5`; small labels and step internals use `--s3` and `--s4`.

### Components

- `site-shell`: bordered page frame with warm paper background.
- `topbar`: persistent identity and navigation.
- `page-hero`: two-column project hero with text plus proof image or note.
- `proof-shot`: framed image surface for real screenshots and generated process plates.
- `system-link`: sparse text rows for system navigation.
- `output-card`: compact evidence card with thumbnail and link row.
- `process-feature`: large workflow visual plus explanatory board.
- `signal-strip`: logo-like provenance chips for APIs, datasets, handoff tools, and review gates.
- `lane-steps`: linear workflow steps for detailed system pages.

Keep proposal generation and deploy presentation as separate system stories. Proposal is local business context, screen inventory, maps, custom ads, and PDF output. Deploy is HTML artifact, protected link, Webflow CMS entry, embed, and tracking handoff.

### Imagery

Use real public screenshots, generated design references, rendered PDFs, and storyboard process plates. Do not substitute hand-drawn placeholder graphics when an approved generated image or real output exists.

### Motion

Use subtle reveal motion, image scale on hover, and restrained line/particle animation. Avoid controls that imply heavy interaction unless the interaction exists. Reduced motion must preserve all content.
