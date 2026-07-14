# Design System

## Theme

Warm technical editorial. The visual language uses a paper grid, fine ruled borders, oversized serif display type, restrained sans body copy, and process imagery that feels like working drawings.

## Color Palette

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

## Typography

- Display: `Instrument Serif`, used for large headlines, case titles, and major evidence statements.
- Body: `Instrument Sans`, used for paragraphs and navigation.
- Mono: `IBM Plex Mono`, used only for compact metadata, file paths, source labels, and code references.

Avoid long runs of all-caps mono text. Use metadata sparingly so the site does not become a dashboard.

## Spacing

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

## Components

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

## Imagery

Use real public screenshots, generated design references, rendered PDFs, and storyboard process plates. Do not substitute hand-drawn placeholder graphics when an approved generated image or real output exists.

## Motion

Use subtle reveal motion, image scale on hover, and restrained line/particle animation. Avoid controls that imply heavy interaction unless the interaction exists. Reduced motion must preserve all content.
