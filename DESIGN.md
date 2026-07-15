# Design Systems

This repository currently contains two intentionally separate systems. The production homepage uses the V1 system below. The unlinked `/v2/` route is an assessment and does not inherit V1 CSS or JavaScript.

## V2 Assessment System

### Direction

Warm photographic studio with an editorial publishing voice and a practical digital-product edge. V2 preserves the authored laptops, browser windows, proposal sheet, media, and interactions while removing the rigid Neo-Brutalist framing, graph textures, route dots, arbitrary colour blocking, and compressed spacing.

The accordion reference informs expressive type, restrained colour changes, expanding movement, and small moments of play. It does not determine the whole page structure.

### V2 Colour

- Canvas: `#F1EEE7`
- Paper: `#FBFAF6`
- Surface: `#FFFFFF`
- Ink: `#171813`
- Muted: `#66665E`
- Charcoal: `#171A19`
- Deep forest: `#243C31`
- Hard gold: `#E3A916`

Hard workflow rails:

- Content: `#E0A91C`
- Dashboard: `#3E8164`
- Publishing: `#DF5F38`
- Prospecting: `#4D678C`
- Website production: `#8F5C93`

The active accordion content sits on one charcoal stage so the workflow images stay readable. The hard rail colours are navigation and state cues, not page-filling decoration. Bias to Build uses hard gold and About uses deep forest. Selected Work takes its colour from real project environments rather than flat bands.

### V2 Typography

- Functional and body type: local DM Sans variable font.
- Workflow and project titles: local Fraunces variable font at an editorial, readable scale. The image remains the dominant evidence.
- Inactive desktop rail names: local DM Sans at 900 weight and `1.16rem` within 72px rails.
- Editorial accents: local Fraunces variable font, also used for metrics, personal statements, and the music interlude.
- Technical type: monospace only inside real technical artifacts.
- Body leading: approximately `1.55-1.7`; paragraph measure and spacing should remain stable at every breakpoint.

### V2 Composition and Motion

- Use a Z-pattern for Selected Work and let each real artifact lead. Each project becomes a photographic stage: parish exterior for RCCV, treehouse forest for Boutique, lawn for Cool Runnings, city/product context for the proposal, and a lobby for Why Elevators.
- Hero, laptops, and browsers share a thick black bevel, rounded corners, restrained perspective, and a strong physical shadow. The proposal remains a paper object and the albums remain on image-matched black.
- Centre sectional anchors where it improves rhythm: workflow introduction, outcomes, and experience.
- The workflow accordion expands over approximately 580ms with `cubic-bezier(.22, 1, .36, 1)` and becomes vertical below 1100px. Selection is staged through animation frames so the active spine physically opens rather than swapping abruptly.
- Content remains complete with reduced motion. Showcase films lazy-load and autoplay only while visible; they have no pause-button chrome or fake button semantics.
- The V2 hero uses the responsive system-map film inside the largest raised black-bevel card beside the copy. The About portrait uses a V2-only embed inside the authored brown frame, tracks pointer input across the whole section, and leads into the expanding hard-gold practical-value scroll moment.

### V2 Workflow Detail Pages

All five workflow routes share `v2/workflows/workflow-detail.css`. Each includes purpose, rationale, five to seven steps, tools and sources, output, human review, public-safe proof and constraints, and related work. The page accent changes by workflow, but structure and source-safety rules do not.

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
