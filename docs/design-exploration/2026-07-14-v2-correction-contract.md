# Portfolio V2 Correction Contract

## Task

Correct the production HTML/CSS/JavaScript assessment at `/v2/` without changing V1: restore one white Hero-and-Selected-Work canvas, remove unapproved V1 carryover, regularise type and spacing, and finish the Bias, workflow accordion, About, Experience, and Selected Work motion treatments.

## Source truth

- The current `/v2/` route and Michael's July 14 corrections win.
- V1 may supply only the already-approved system-map film treatment, RCCV/device media, browser interactions, proposal artifact, and Renaissance portrait mechanism.
- `v2/index.html`, `v2/styles.css`, and `v2/app.js` are the implementation source.
- `scripts/qa-v2.mjs` and the real browser captures are the proof source.

## Preserve

- The Z-pattern and real authored project artifacts.
- White Hero and Selected Work canvas; black Music interlude; hard-gold Bias and Contact; deep-forest About.
- The six method stages: Understand, Shape, Build, Measure, Refine, Systematise.
- The neutral horizontal desktop accordion and vertical mobile accordion.
- The interactive Renaissance portrait in About only.
- Existing public claims, links, workflow diagrams, and videos.

## Change

- Derive H1, H2, H3, section, heading, and copy spacing from named responsive tokens.
- Make the Bias sequence a coherent two-row snake with connectors anchored to their source labels.
- Remove workflow numbers, overlap inactive rails, hide the active desktop rail, and animate only numeric widths.
- Bind the boutique frame sequence to ordinary page scroll while retaining wheel and keyboard control.
- Make Boutique, Cool Runnings, and Why Elevators visibly rotate from a near-flat presentation plane to a final slight angle.
- Delay About phrase growth until surrounding copy has faded; grow actual font size for sharp text; use the approved Renaissance arch; resolve the process conclusion beside the portrait before release.
- Restore the centred Experience ledger.
- Remove eyebrow labels from the homepage and all V2 workflow-detail pages.

## Forbidden

- Grey Hero or Selected Work canvas.
- Photographic project backgrounds, copy cards, route dots, numbered rails, eyebrow labels, graph paper, or unapproved V1 styling.
- `flex-basis: auto` in the desktop accordion transition.
- CSS scale enlargement of the About phrase.
- Scroll animation that advances only when the pointer is over the preview.
- A route image, duplicate dots, or timeline markers in Experience.

## Design vocabulary

- Layout: open white canvas, Z-pattern, editorial stack, constrained reading measure, centred chronological ledger.
- Typography: responsive type clamp, role-based type scale, paragraph rhythm, vertical rhythm, optical alignment.
- Motion: scroll scrub, first-frame check, pinned scrollytelling, frame hold, composited 3D transform, numeric flex-basis interpolation.
- Interaction: progressive disclosure, visible focus, inert inactive regions, 44px touch targets, reduced-motion static fallback.

## Acceptance gates

- Hero and all five Selected Work project stages compute to white at 1440, 1024, 768, and 390 pixels; Music remains square-cornered black.
- No V2 HTML contains `class="eyebrow"`, workflow numbers, route dots, or project-environment backgrounds.
- Ordinary page scroll advances the real boutique frames; keyboard and wheel input remain functional and do not get immediately overwritten.
- The three browser objects receive slow section-bound progress and Why Elevators begins at a 68-degree `rotateX` presentation angle.
- Desktop accordion widths interpolate during the 580ms transition; inactive rails occupy 44px each with 14px overlap; the active desktop rail is hidden.
- About remains pinned through the phrase, line, and conclusion beats; final type is sharp and process text is visible before release.
- Experience company names are geometrically centred on every row.
- Unit checks pass; browser QA passes on homepage, local `file://`, all five workflow routes, and five viewport widths; no horizontal overflow.

## Route next

- Production frontend implementation, then frontend taste and browser-proof QA.

## Deliverable

- Corrected isolated V2 implementation, updated V2 documentation, and a browser-captured comparison/evidence set. V1 remains unchanged.
