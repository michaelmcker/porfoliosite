# Design Systems

This repository currently contains two intentionally separate systems. The production homepage uses the V1 system below. The unlinked `/v2/` route is an assessment and does not inherit V1 CSS or JavaScript.

## V2 Assessment System

### Direction

Warm, open, and editorial with a practical digital-product edge. V2 preserves the authored laptops, browser windows, proposal sheet, media, and interactions while removing the rigid Neo-Brutalist framing, graph textures, heavy outlines, route dots, and compressed spacing.

The accordion reference informs expressive type, restrained colour changes, expanding movement, and small moments of play. It does not determine the whole page structure.

### V2 Colour

- Canvas: `#F7F6F2`
- Surface: `#FFFFFF`
- Ink: `#1B1D1A`
- Muted: `#676A64`
- Hairline: `#D9DAD3`
- Cobalt: `#3F66E8`
- Fern: `#557A5B`
- Apricot: `#E98D63`
- Charcoal: `#1F2322`
- Accessible warm accent text: `#9D3F22`

Legacy subdued workflow tints remain available for detail-page surfaces:

- Content: `#E7ECFA`
- Dashboard: `#E5EEE7`
- Publishing: `#F6E8DF`
- Prospecting: `#F2EBCF`
- Website production: `#EBE7F3`

The homepage does not use the pastel workflow tints as large fields. Its accordion uses dark forest `#234A36`, petrol `#164A5A`, rust `#A8432D`, ochre `#755711`, and aubergine `#49345F`, with white type and a light artifact surface. The first workflow is green, not blue. Outside the accordion, Boutique Accommodation uses acid green `#C7DB35`, the proposal uses signal orange `#F06B3D`, Bias to Build uses hard gold `#E3A916`, and About uses deep teal `#0F675F`.

### V2 Typography

- Functional and body type: local DM Sans variable font.
- Workflow titles: local DM Sans variable font in high-contrast white, kept smaller than their supporting image; workflow descriptions run larger for easier reading. Inactive desktop rail names are larger and 800 weight.
- Editorial accents: local Fraunces variable font, used selectively for the hero emphasis, metrics, personal statements, and the music interlude.
- Technical type: monospace only inside real technical artifacts.
- Body leading: approximately `1.55-1.7`; paragraph measure and spacing should remain stable at every breakpoint.

### V2 Composition and Motion

- Use a Z-pattern for Selected Work and let each real artifact lead. At desktop widths, the media column is wider than the copy column and project names remain compact. RCCV is grounded on a dark stage; Boutique uses a wide black browser with a curved scroll cue; Boutique and the proposal break the neutral sequence with hard full-bleed colour bands.
- Give media objects consistent soft lighting, shadow, caption scale, and whitespace without forcing them into a universal card.
- Centre sectional anchors where it improves rhythm: workflow introduction, outcomes, and experience.
- The workflow accordion expands over approximately 480ms with `cubic-bezier(.22, 1, .36, 1)` and becomes vertical below 1100px. Each active state puts its title first, description and CTA second, and dominant media below.
- Content must remain complete with reduced motion. Videos remain lazy and user-controllable directly from the focusable media surface, without visible Pause buttons.
- The V2 hero uses the responsive system-map film inside a raised white card with a soft shadow, beside the copy rather than behind it. The About portrait keeps the interactive embed inside the authored brown arch frame on the deep-teal section, with a composed static portrait visible while it loads.

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
