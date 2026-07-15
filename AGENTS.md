# Portfolio Site - Agent Context

## Start Here

1. Read `docs/portfolio-working-notes.md` for source truth, proof constraints, and workflow details.
2. Read `DESIGN.md` for the separate V1 and V2 visual systems.
3. Check `git status --short` before editing. Preserve unrelated work.
4. Run `npm test` before and after implementation changes.

## Current Assessment Gate

The production homepage remains V1. The self-contained assessment is in `v2/` and is intentionally not linked from V1.

The approved first gate contains:

- the complete V2 homepage at `/v2/`;
- the presentation-publishing workflow page at `/v2/workflows/presentation-publishing.html`;
- deterministic presentation-publishing artwork in desktop and mobile forms.

Stop at this gate for visual approval. Do not extend the system to the other four V2 workflow pages or redirect V1 without explicit approval.

## V1 Isolation

- V2 may reuse existing media through relative references into the root `assets/` directory.
- V2 must not import V1 CSS or JavaScript.
- Do not change V1 routes, APIs, proposal generation, data formats, or implementation files while assessing V2.
- New V2 code belongs under `v2/`; V2 tests and renderers belong under `tests/` and `scripts/`.
- Use `git diff <v1-baseline> --name-only` before handoff to prove isolation.

## V2 Design Contract

- Type: local DM Sans for functional text and workflow titles; local Fraunces is limited to selective editorial moments such as the hero emphasis, metrics, and music interlude. Monospace is reserved for real technical artifacts.
- Palette: avoid pastel homepage fields. The workflow uses dark forest, petrol, rust, ochre, and aubergine; Bias to Build uses hard gold; About uses deep teal; Boutique Accommodation and the proposal use acid green and signal orange bands. Neutral canvas still carries the remaining work, Outcomes, Experience, and Contact.
- Composition: laptops, browser windows, documents, and the About portrait are authored objects on an open canvas, not repeated cards.
- Avoid heavy black outlines, graph-paper textures, route dots, harsh rules, mono labels, and box-within-box framing.
- Motion must remain optional, pausable, keyboard accessible, and complete under `prefers-reduced-motion`.

## Interaction Contracts

- Desktop workflow accordion begins at 1100px and uses horizontal expanding spines.
- Below 1100px it becomes a vertical accordion with a dedicated readable composition, not a panned desktop diagram.
- Active workflow hierarchy is always compact high-contrast DM Sans title, larger description and CTA, then dominant media on a light artifact surface. Desktop rail labels are 68px wide, visibly larger, and bold. Do not move the image above the copy or let the title overpower the artwork.
- Selection changes only on click, tap, Enter, or Space. Arrow keys, Home, and End move focus. Inactive regions are `inert` and `aria-hidden`.
- Boutique Accommodation retains its 69-frame wheel, keyboard, and touch interaction with boundary release.
- Showcase videos are lazy-loaded and directly clickable/focusable to pause or play; do not place visible Pause buttons over the media. Reduced motion must remain static until the user explicitly starts a video.
- The V2 hero reuses the responsive system-map film and approved poster inside a raised white card with a soft drop shadow. Do not return it to a full-bleed background treatment.
- Selected Work gives its media column more space than its copy column. RCCV sits on a dark device stage. Boutique Accommodation uses a wide black browser with the real 69-frame interaction and a curved-arrow `Try to scroll` cue. Boutique and the proposal are full-bleed hard-colour bands.
- About reuses the interactive portrait inside the brown arched frame. The composed static portrait is the loading fallback.

## Presentation-Publishing Source Truth

The public-safe sequence is fixed:

1. Branded self-contained HTML presentation.
2. Vercel API deployment.
3. Proposed name and destination validation before a CMS write.
4. Webflow CMS iframe field update.
5. Full-screen presentation template.
6. Published URL verification.

Do not add fictional integrations, duplicate stages, or password-led framing. The page must clearly separate what ships from what remains human-reviewed.

## Verification

Run:

```bash
npm test
node scripts/render-v2-presentation.mjs
node scripts/qa-v2.mjs
```

`scripts/qa-v2.mjs` verifies the homepage and presentation page at 1440, 1024, 768, 390, and 320 pixels. Set `QA_V2_SCREENSHOT_DIR=/absolute/path` to save full-page captures.

The presentation renderer must produce:

- `v2/assets/presentation-publishing-desktop.png` at 1800 x 1100;
- `v2/assets/presentation-publishing-mobile.png` at 900 x 1600.

Both outputs must be deterministic across consecutive renders.
