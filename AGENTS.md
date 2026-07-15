# Portfolio Site - Agent Context

## Start Here

1. Read `docs/portfolio-working-notes.md` for source truth, proof constraints, and workflow details.
2. Read `DESIGN.md` for the separate V1 and V2 visual systems.
3. Check `git status --short` before editing. Preserve unrelated work.
4. Run `npm test` before and after implementation changes.

## Current V2 Scope

The production homepage remains V1. The self-contained assessment is in `v2/` and is intentionally not linked from V1.

The V2 assessment currently contains:

- the complete V2 homepage at `/v2/`;
- five public-safe workflow pages under `/v2/workflows/`;
- deterministic presentation-publishing artwork in desktop and mobile forms.

Do not redirect or replace V1 without explicit approval.

## V1 Isolation

- V2 may reuse existing media through relative references into the root `assets/` directory.
- V2 must not import V1 CSS or JavaScript.
- Do not change V1 routes, APIs, proposal generation, data formats, or implementation files while assessing V2.
- New V2 code belongs under `v2/`; V2 tests and renderers belong under `tests/` and `scripts/`.
- Use `git diff <v1-baseline> --name-only` before handoff to prove isolation.

## V2 Design Contract

- Type: local DM Sans for functional text; local Fraunces carries project titles, workflow titles, metrics, and selected personal/editorial moments. Monospace is reserved for real technical artifacts.
- Palette: the base is warm studio paper (`#F1EEE7`, `#FBFAF6`, `#171813`). Bias to Build uses hard gold `#E3A916`. The accordion uses harder gold, green, orange, blue, and plum rails against one charcoal content stage. About uses deep forest `#243C31`.
- Composition: Selected Work uses real project environments behind raised copy and dimensional laptop, browser, or document objects. Do not reintroduce unrelated flat colour bands.
- Material: hero and device surfaces share a thick black bevel, rounded corners, strong physical shadow, and restrained perspective. The portrait keeps its authored brown frame.
- Avoid graph-paper textures, route dots, harsh rules, mono labels, arbitrary cards, and colour used only to fill space.
- Motion must remain complete under `prefers-reduced-motion`. Showcase films autoplay only while in view and expose no pause-button chrome or fake control surface.

## Interaction Contracts

- Desktop workflow accordion begins at 1100px and uses horizontal expanding spines.
- Below 1100px it becomes a vertical accordion with a dedicated readable composition, not a panned desktop diagram.
- Active workflow hierarchy is an editorial Fraunces title, readable description and CTA, then dominant media on a light artifact surface. Desktop rails are 72px wide with 900-weight labels.
- Selection changes only on click, tap, Enter, or Space. Arrow keys, Home, and End move focus. Inactive regions are `inert` and `aria-hidden`.
- Boutique Accommodation retains its 69-frame wheel, keyboard, and touch interaction with boundary release.
- Showcase videos are lazy-loaded, autoplay while visible, and have no visible or invisible pause-button UI.
- The V2 hero reuses the responsive system-map film and approved poster inside the largest raised black-bevel card. Do not return it to a full-bleed background treatment.
- Selected Work places RCCV over the parish exterior, Boutique over the treehouse forest, Cool Runnings over lawn photography, the proposal over a city/product context, and Why Elevators over a lobby context. Boutique retains the wide black 69-frame browser and curly-arrow `Try to scroll` cue.
- About tracks pointer input across the whole section through a V2-only portrait embed. The practical-value line expands into its own hard-gold scroll moment with an animated curly arrow.

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

`scripts/qa-v2.mjs` verifies the homepage and all five workflow pages at 1440, 1024, 768, 390, and 320 pixels. Set `QA_V2_SCREENSHOT_DIR=/absolute/path` to save full-page captures plus all five accordion states on desktop and mobile.

The presentation renderer must produce:

- `v2/assets/presentation-publishing-desktop.png` at 1800 x 1100;
- `v2/assets/presentation-publishing-mobile.png` at 900 x 1600.

Both outputs must be deterministic across consecutive renders.
