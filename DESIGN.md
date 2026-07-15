# Design Systems

This repository currently contains two intentionally separate systems. The production homepage uses the V1 system below. The unlinked `/v2/` route is an assessment and does not inherit V1 CSS or JavaScript.

## V2 Assessment System

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

The workflow accordion is deliberately neutral: overlapping inactive rails use charcoal (`#202422`) with warm-white type and all active content sits on one charcoal stage. Bias to Build uses hard gold and About uses deep forest. The Hero and every Selected Work stage are white; Music is the sole black interlude.

### V2 Typography

- Functional and body type: local DM Sans variable font.
- Workflow and project titles: local Fraunces variable font at an editorial, readable scale. The image remains the dominant evidence.
- Inactive desktop rail names: local DM Sans at 900 weight and `1.2rem` within 64px layered spines. Spines overlap by 22px, use adjacent charcoal values and inset edge depth, and hide the active rail so workflow evidence keeps most of the canvas.
- Editorial accents: local Fraunces variable font, also used for metrics, personal statements, and the music interlude.
- Technical type: monospace only inside real technical artifacts.
- Body leading: approximately `1.55-1.7`; paragraph measure and spacing should remain stable at every breakpoint.

### V2 Composition and Motion

- Use a Z-pattern for Selected Work and let each real artifact lead. RCCV, Boutique Accommodation, Cool Runnings, the proposal, and Why Elevators sit on white stages with subtle separators. Project labels sit immediately below their editorial titles. There is no separator between the centred `Selected Work` heading and the first stage. Music is full-bleed black with square corners.
- Present RCCV as an isolated laptop without the shared screen-bezel wrapper. Use the specific Stations link label rather than a generic interaction label.
- Project copy sits directly on the white stage. Do not place it inside a card, panel, glass surface, or photographic background.
- Do not use eyebrow labels anywhere in V2, including workflow-detail heroes and related-work sections. `Bias to build.` is a full editorial heading and butts directly against the black music interlude. It is followed by the unnumbered sequence Understand, Shape, Build, Measure, Refine, and Systematise. Desktop uses one thin continuous route behind a two-row snake; mobile uses a quiet vertical route without decorative numbering.
- Hero and browser windows share a thick black bevel, rounded corners, restrained perspective, and a strong physical shadow. RCCV is a larger isolated laptop masked by the checked-in alpha cutout. The proposal is an enlarged rounded PDF without a surrounding frame, and the albums remain on image-matched black.
- Centre sectional anchors where it improves rhythm: workflow introduction, outcomes, and experience.
- The neutral workflow accordion expands over approximately 580ms with `cubic-bezier(.22, 1, .36, 1)` and becomes vertical below 1100px. Desktop rails transition between explicit numeric flex bases; never transition through `auto`, which causes the active panel to jump. The active desktop rail collapses visually while its panel opens; mobile keeps the active row visible as the accessible control.
- Content remains complete with reduced motion. Showcase films begin loading well before they enter the viewport, autoplay only while visible, and have no pause-button chrome or fake button semantics. Boutique Accommodation scrubs one compressed 32.88-second video concatenated from the three real site recordings; its browser remains flat. On fine-pointer desktops, wheel gestures over that browser lock the page and scrub the film, while wheel gestures outside it retain normal page scrolling. Boutique, Cool Runnings, and Why Elevators share a restrained 36px right-to-left drift. Why Elevators also rises from a pitched-back state, reaches its final angled pose at 72% of section progress, and holds before leaving the viewport.
- The V2 hero uses the responsive system-map film inside the largest raised black-bevel card beside the copy. The approved overlay labels mask the film's unfinished areas; there is no caption below the film. The final `And sometimes, stuff just for fun.` is a separate italic Fraunces beat. The About portrait uses a V2-only embed inside the Renaissance arch and a 280svh sticky story: paragraph two ends with the practical-value phrase in normal paragraph styling, surrounding copy fully fades, the phrase then grows and changes colour through actual font-size interpolation rather than a scale transform, a gold path draws toward the portrait without crossing the copy, and the process-value statement appears before the section unlocks. One stable parent stage owns pointer input and passes normalized coordinates into the presentation-only iframe, preventing competing cursor and pose systems.
- Heading and section rhythm comes from the named CSS tokens `--type-h1`, `--type-h2`, `--type-h3`, `--space-section`, `--space-heading`, and `--space-copy`. New one-off H1/H2/H3 sizes or unrelated section paddings are regressions unless the design contract itself changes.
- The full-bleed hard-gold contact chapter starts once when 40% of its stage enters view; it is never scrubbed by scroll. Over 4,800ms the actual portfolio objects enter from beyond the upper-left edge and make exactly two inward Archimedean turns. Equal arc-length travel prevents a rushed outer turn or accelerated inner turn, phase spacing creates a continuous stream, each card follows the tangent, and its scale falls from 100% to 55% at the centre. The tight central pose and 55% rendered size transfer directly into locally vendored Matter.js bodies. Four walls, gravity, collision, friction, bounce, and angular motion create the drop. The contact message resolves during the drop and dynamically changes between dark and light treatments when objects cross it. The finale portrait layers its registered head pose over the body plate. Pointer and touch dragging use a dynamic spring-like point constraint; release preserves natural momentum and rotation instead of pinning the object. Reduced motion and script failure preserve a complete static composition.

### V2 Workflow Detail Pages

All five workflow routes share `v2/workflows/workflow-detail.css`. Each includes purpose, rationale, five to seven steps, tools and sources, output, human review, public-safe proof and constraints, and related work. The page accent changes by workflow, but structure and source-safety rules do not.

### V2 Local-Search Case Study

`v2/work/local-search-magnet.html` is an isolated V2 case study linked from the Cool Runnings project. It uses the V2 editorial/object system, the real site film and screenshots, and `data/cool-runnings-metrics-current.json` for the current verified Search Console and GA4 snapshot. It must keep canonical inputs, structured enrichment, deterministic rendering, validation/retry, useful tools, and Human review distinct. It does not alter or import the V1 case-study implementation.

### V2 Publishing Artwork

The deterministic HTML artwork is a publishing ribbon, not a dashboard. It shows the approved six-stage Vercel-to-Webflow sequence at readable scale, with separate desktop and mobile exports. Keep the publishing tint subdued and omit password-led or fictional stages.

## V1 Production System

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
