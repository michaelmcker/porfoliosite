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
- the V2-only local-search case study at `/v2/work/local-search-magnet.html`;
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
- Palette: the homepage base canvas is white (`#FFFFFF`) with ink `#171813`. Bias to Build uses hard gold `#E3A916` and About uses deep forest `#243C31`. The approved accordion is neutral: overlapping charcoal inactive rails and one charcoal content stage. Do not reintroduce per-workflow rail colours.
- Composition: Hero and every Selected Work stage are white behind dimensional laptop, browser, or document objects. Music is the one black interlude. Do not add a copy card or photographic project background.
- Material: hero and device surfaces share a thick black bevel, rounded corners, strong physical shadow, and restrained perspective. The portrait keeps its authored brown frame.
- Avoid graph-paper textures, route dots, harsh rules, mono labels, eyebrow labels anywhere in V2, arbitrary cards, and colour used only to fill space.
- Bias to Build is a full editorial section heading and begins immediately after the black music interlude. Its sequence is fixed: Understand, Shape, Build, Measure, Refine, Systematise. Desktop presents the six unnumbered stages as a two-row snake behind one thin continuous route; mobile stacks the same sequence beside a quiet vertical route.
- Spacing and type use the V2 tokens in `v2/styles.css`: `--space-section`, `--space-heading`, `--space-copy`, `--type-h1`, `--type-h2`, and `--type-h3`. Do not add one-off heading scales or arbitrary section padding without updating the token contract and viewport proof.
- Motion must remain complete under `prefers-reduced-motion`. Showcase films autoplay only while in view and expose no pause-button chrome or fake control surface.

## Interaction Contracts

- Desktop workflow accordion begins at 1100px and uses horizontal expanding spines.
- Below 1100px it becomes a vertical accordion with a dedicated readable composition, not a panned desktop diagram.
- The workflow heading and accordion form one full-bleed black chapter. Active hierarchy is a compact editorial Fraunces title with the CTA in the same top row, a short description, then dominant media on a light artifact surface. Desktop inactive spines are unnumbered, 64px wide, overlap by 22px, use 900-weight labels, adjacent charcoal values, and inset edge depth. The active rail is visually hidden so the workflow evidence receives most of the canvas. Keep explicit numeric flex bases on desktop; transitioning through `auto` makes the slide snap.
- Selection changes only on click, tap, Enter, or Space. Arrow keys, Home, and End move focus. Inactive regions are `inert` and `aria-hidden`.
- Boutique Accommodation uses `assets/videos/accommodation/showcase-scroll.webm` and `.mp4`, deterministically concatenated from the real Overview, Treehouse, and Cabin recordings by `scripts/build-v2-accommodation-video.mjs`. Ordinary page scroll scrubs the video timeline. On fine-pointer desktop devices, wheel input directly over the browser is intentionally local: the page stays locked while that wheel gesture scrubs the film, and page scrolling resumes immediately when the pointer leaves the browser. Do not restore the retired 69-image swap loop. Reduced-motion uses the first approved frame as a fallback.
- Showcase videos begin loading before they enter view, autoplay while visible, and have no visible or invisible pause-button UI.
- The V2 hero reuses the responsive system-map film and approved poster inside the largest raised black-bevel card. Approved HTML overlay labels cover the film's unfinished regions and no caption appears below it. Do not return it to a full-bleed background treatment.
- Selected Work uses clean white stages for RCCV, Boutique Accommodation, Cool Runnings, the proposal, and Why Elevators. Project labels sit below their titles, and the first stage has no rule below the section heading. Boutique keeps the wide black 69-frame browser; the curly arrow appears before `Scroll the preview`, both sit above and outside the frame, and no Overview/status/Previous/Next UI overlays the work.
- RCCV uses the isolated laptop treatment without the shared black screen bezel. Its video is masked with the checked-in alpha cutout so the baked cream background cannot show. The project heading is `Bringing a community site to life.` and the specific interaction link is `Explore the interactive Stations of the Cross`.
- The proposal is a larger rounded PDF artifact with no surrounding paper frame. Boutique stays flat while its real video scrubs. Boutique, Cool Runnings, and Why Elevators begin 36px to the right and settle left with scroll; Why Elevators also begins pitched back, finishes at a slight angle by 72% of its scroll progress, and holds that pose before it leaves the viewport.
- About tracks pointer input across the whole section through a V2-only portrait embed inside the approved Renaissance arch. The parent sticky stage is the sole pointer owner and sends normalized coordinates into a presentation-only iframe; the iframe must not install a second cursor or pointer surface. Its 280svh sticky story keeps `Even when the practical value is questionable.` at the end of paragraph two and styles it exactly like the surrounding sentence at rest. Scroll fully fades the surrounding copy before increasing the phrase's actual font size and changing its colour, draws a visible gold line toward the portrait, then reveals `There’s still value in the process.` and the build-note link before releasing the page. Never enlarge the phrase with a CSS scale transform or allow it to cross into the portrait column.
- Experience is a centred chronological ledger with company, role, and date on one axis. It has no route image, duplicate dots, or timeline markers.
- The contact chapter is progressive enhancement over a complete hard-gold composition. It is not scroll-controlled: an `IntersectionObserver` starts one 1,800ms entrance per page load when 40% of the stage is visible. Portfolio objects travel the broad full-frame curve with larger per-object phase offsets, then transfer without a visible jump into locally vendored Matter.js bodies. Gravity, four boundaries, collisions, friction, and angular motion remain active. Dragging uses a dynamic point constraint with high positional stiffness and no angular stiffness; releasing removes the constraint without zeroing velocity or rotation, so the object can toss, collide, bounce, and settle naturally. Contact copy resolves during the drop and switches between dark and light treatments according to object overlap. Use the actual laptop, browser, proposal, and workflow assets plus the layered head-visible finale portrait rather than placeholder cards. Reduced-motion and failed-script states show the complete composition without the interaction.

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

`scripts/qa-v2.mjs` verifies the homepage, all five workflow pages, and the V2 local-search case study at 1440, 1024, 768, 390, and 320 pixels where applicable. It proves the accommodation browser locally captures wheel scrubbing while the page scrolls normally outside it, showcase films advance on HTTP and the local `file://` preview, accordion widths interpolate, and the About phrase and single parent-owned portrait pointer remain stable. For the contact finale it proves idle state below the visibility threshold, automatic elapsed-time progress without page scrolling, wider entrance spacing, once-only playback, no-jump physics release, early copy resolution, both loaded portrait layers, dynamic movement or rotation after drag release, active boundaries, normal footer access, and the reduced-motion fallback. Set `QA_V2_SCREENSHOT_DIR=/absolute/path` to save full-page captures, all five accordion states, and the settled finale.

The presentation renderer must produce:

- `v2/assets/presentation-publishing-desktop.png` at 1800 x 1100;
- `v2/assets/presentation-publishing-mobile.png` at 900 x 1600.

Both outputs must be deterministic across consecutive renders.
