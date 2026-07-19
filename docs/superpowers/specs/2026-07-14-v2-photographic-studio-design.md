# Portfolio V2 Photographic Studio Design
**Status:** Superseded on July 14 by [`docs/design-exploration/2026-07-14-v2-correction-contract.md`](../../design-exploration/2026-07-14-v2-correction-contract.md).

Do not implement from this exploratory specification. Its environmental backgrounds, wider numbered accordion rails, neutral About chapter, and earlier motion model were explicitly rejected. The correction contract, `DESIGN.md`, `AGENTS.md`, and `docs/portfolio-working-notes.md` are the current V2 source truth.
## Purpose
Refine the isolated `/v2/` portfolio so it feels like one authored visual system rather than a sequence of unrelated colour fields. The new system keeps the Z-pattern, real laptops and browser windows, the functional workflow accordion, the Renaissance portrait, and V2-only workflow routes. It replaces the current many-colour treatment with a mostly neutral photographic studio built around dimensional screen objects, selective environmental imagery, serif editorial titles, and richer motion.

V1 remains untouched and V2 remains isolated until separately approved for production.
## Design Principle
The interface is neutral; the work supplies the atmosphere.

Warm white, charcoal, and one ochre-yellow accent form the stable portfolio shell. Each selected-work chapter may use one source-grounded environmental image behind its device or artifact. The image belongs primarily to the media side of the composition so the copy stays readable and the five chapters do not become five competing full-page posters.
## Visual System
### Palette
- Canvas: `#F5F3ED`

- Paper: `#FFFFFF`

- Ink: `#171816`

- Charcoal: `#171918`

- Muted: `#62655F`

- Hairline: `#D7D6CF`

- Ochre-yellow accent: `#E3A916`

- Soft shadow tint: `rgba(31, 35, 31, 0.18)`

- Deep shadow tint: `rgba(20, 22, 20, 0.32)`


The selected-work photography can introduce natural local colour, but the interface must not add a different flat accent to every project. The current acid green, orange, teal, petrol, rust, ochre, and aubergine fields are removed as a page-wide system.

The black album chapter remains because it colour-matches the album artwork. Bias to Build may remain yellow. The Workflow introduction, Outcomes, and the transition between them use white so the systems area reads as one continuous chapter.
### Typography
- DM Sans remains the functional face for navigation, body copy, captions, metrics, controls, and workflow details.

- Fraunces becomes the editorial face for the homepage hero title, Selected Work project titles, the active workflow title, the About heading, and workflow-page hero titles.

- Project titles use responsive sizes between `2rem` and `3.75rem`; they must not dominate the device object.

- Section titles use responsive sizes between `2.4rem` and `5rem` depending on hierarchy.

- Body copy remains `1rem–1.2rem` with `1.55–1.7` leading and a maximum readable measure around `62ch`.

- Monospace remains limited to genuine technical artifacts.

## Shared Dimensional Screen Object
Hero media, browser windows, dashboard screenshots, and workflow hero artwork share one material treatment:

1. A thick charcoal outer bezel with `24–38px` rounded corners.

2. A slightly lighter inner rim that creates a physical bevel.

3. A recessed media viewport with its own smaller radius.

4. A narrow inner highlight along the top and left edges.

5. A two-layer shadow: a tight dark contact shadow and a larger soft shadow tinted to the surrounding image.

6. A subtle perspective tilt only where it supports the object; the hero screen remains close to front-on.


The treatment must accept either an image, video, interactive frame sequence, or `<picture>` without changing the surrounding layout. It is not a generic card around copy.
## Homepage
### Hero
- Preserve the current copy and system-map film.

- Increase the film’s visual share of the split layout so it is the dominant object.

- Place the film inside the shared thick-bezel screen with larger rounded corners and a visibly deeper shadow.

- Keep the hero asymmetric and open; do not return to a full-bleed background video.

- Keep visible playback controls removed. The focusable video surface remains operable by click, Enter, and Space.

### Selected Work
Selected Work retains the real Z-pattern and current links, videos, interactive accommodation frames, proposal artifact, and album artwork.

Each work chapter uses a clean copy field plus an atmospheric media field. Environmental imagery may extend beyond the device and toward the section edge, but it must not sit directly behind long paragraphs.

1. **RCCV — Bringing a community site to life**

  - Use a real RCCV parish photograph as the media-field background.

  - Source: `/Users/michaelmckerracher/Local Websites/St James/rccv-site/public/media/parishes/st-james-golden-distance-poster.jpg`, copied into V2-owned assets with source noted in the working notes.

  - Keep the real RCCV laptop video in front of the photograph.

2. **Boutique Accommodation — Elevating a boutique accommodation site**

  - Use the treehouse and surrounding forest from `assets/frames/accommodation/treehouse/010.jpg` as the reference for a clean atmospheric background without fabricated property features.

  - Keep the 69-frame interactive browser and curved scroll cue.

  - Place the browser in the shared bevel rather than the current flat black shell.

3. **Cool Runnings — From no web presence to a lead magnet**

  - Use the real lush lawn from `/Users/michaelmckerracher/Local Websites/Cool Runnings/Website/Assets/ba-lawn-after.jpg`, copied into V2-owned assets with source noted in the working notes.

  - Keep the existing showcase video and verified proof.

  - Do not add a green flat-colour field behind the photography.

4. **Digital out-of-home proposal tool**

  - Use a cityscape background that communicates local commercial reach without showing fictional data or a specific unapproved client.

  - Prefer an existing Vertical Impression city image if its provenance and public use are clear. Otherwise generate one source-safe background and store it in V2-owned assets.

  - Keep the proposal as a letter-sized paper artifact; do not force it into a browser screen.

5. **Explaining a misunderstood medium**

  - Use a real or generated busy commercial/residential elevator-lobby background.

  - Prefer an existing public-safe Vertical Impression lobby photograph if available.

  - Place the Why Elevators page inside the shared dimensional browser object.

6. **Making an overlooked category interesting**

  - Match the surrounding black to the composite album artwork.

  - Preserve the full-width interlude and current music links.

### Bias to Build and Workflow Transition
- Keep the yellow Bias to Build chapter if it remains the only large flat accent field.

- Make the following Workflow introduction white, visually tying it to Outcomes rather than repeating the album chapter’s black.

- Use spacing and one hairline transition to separate the two sections.

## Workflow Accordion
The accordion remains because it serves a real selection task: it lets visitors compare five system types without scrolling through five complete case studies on the homepage. Detailed explanation belongs on each V2 workflow page.
### Desktop
- Keep the horizontal expanding-spine mechanism at `1100px` and wider.

- Use a mostly monochrome system: charcoal inactive spines, a warm-white active panel, and ochre-yellow for the active number, focus, and small motion cue.

- Inactive rails remain `64–72px` wide with bold DM Sans labels.

- On selection, the prior panel’s content fades and translates slightly before the panel contracts. The selected spine then expands with a spring-like `520–620ms` cubic-bezier motion; media and copy enter with a short stagger.

- Animate `grid-template-columns` only if browser performance remains stable; otherwise animate a registered flex-basis custom property. Do not animate layout with JavaScript on every frame.

- Hover previews depth and the yellow accent but never changes the locked selection.

- Click, Enter, or Space locks a selection. Arrow keys, Home, and End remain supported.

### Tablet and Mobile
- Use stacked vertical rows.

- Closed rows remain `68–76px` high.

- The active row expands in document flow with opacity and transform staging; it never pans a desktop diagram.

- The complete title, one-sentence purpose, dominant visual, and CTA remain available.

- Reduced motion removes stagger and transform while preserving the selected state.

## About Interaction
- Return About to a neutral white chapter so the portrait and copy provide the colour.

- Increase the portrait composition’s size and maintain the approved brown frame.

- Pointer movement anywhere over the About section, not just over the iframe, maps to the portrait’s 66 registered poses.

- The parent page sends normalized pointer coordinates to the portrait iframe with `postMessage`; the iframe validates the message source/type and updates gaze without taking over page scrolling.

- Touch uses the last intentional touch position and does not create a continuous expensive listener.

- During scroll, the phrase “even when the practical value is questionable” breaks out of the paragraph, expands across the available width, and then resolves into the follow-up: “But there is always value in learning from the process.”

- A charcoal hand-drawn curly arrow points from the breakout phrase toward the portrait. Animate it with stroke reveal and a small repeating tip motion. Reduced motion renders the complete arrow statically.

- The existing build-note disclosure remains available after the scroll moment.

## V2 Workflow Pages
Create all five routes under `/v2/workflows/`:

1. `content-production.html`

2. `agency-management-dashboard.html`

3. `presentation-publishing.html`

4. `local-prospecting-enrichment.html`

5. `image-to-website-production.html`


Each page uses the same V2 navigation, Fraunces hero title, shared dimensional media object, neutral palette, and detail-section rhythm. Each page includes:

- One-sentence purpose.

- Why the workflow exists.

- Five to seven accurate ordered steps.

- Tools and data sources.

- What ships.

- What remains human-reviewed.

- Public-safe proof and constraints.

- Related work.


Workflow content must be grounded in `docs/portfolio-working-notes.md`, the existing V1 system pages, the current V2 Presentation Publishing page, and real screenshots/artifacts. Do not invent integrations, credentials, automation claims, client data, or measurement results.

The existing deterministic Presentation Publishing artwork remains the source of truth for its six stages. Other workflow pages reuse the best existing public-safe visuals until a more accurate deterministic composition is required.
## File and Interaction Architecture
- `v2/index.html`: homepage structure and source-grounded content.

- `v2/styles.css`: shared V2 tokens, layout, dimensional object, accordion, About, and responsive behavior.

- `v2/app.js`: homepage accordion, media, accommodation, About pointer bridge, and scroll interaction.

- `v2/workflows/workflow-detail.css`: shared workflow-page layout and object treatment.

- `v2/workflows/*.html`: route-specific semantic content.

- `v2/assets/backgrounds/`: V2-owned selected-work backgrounds with documented sources.

- `tests/v2-portfolio.test.mjs`: structural, route, accessibility, asset, and source-isolation assertions.

- `scripts/qa-v2.mjs`: responsive browser and interaction verification.


No API, proposal-generator, V1 route, V1 CSS, or V1 JavaScript changes are part of this revision.
## Accessibility and Performance
- Maintain WCAG AA contrast for body text and controls.

- Use semantic buttons and regions for accordion state.

- Preserve 44px minimum touch targets and visible focus.

- Respect `prefers-reduced-motion` for accordion staging, arrow drawing, phrase breakout, videos, and portrait movement.

- Environmental backgrounds are decorative and use empty alt text or CSS backgrounds; meaningful project artifacts retain descriptive alt text.

- Lazy-load below-the-fold images and videos.

- Use responsive background assets and avoid loading desktop-scale photography on mobile.

- Prevent horizontal overflow at `1440px`, `1024px`, `768px`, `390px`, and `320px`.

## Source and Isolation Rules
- V1 implementation files remain unchanged.

- Exact existing assets are used when the user named them; generated images are limited to genuinely missing cityscape or lobby backgrounds.

- Any copied RCCV photo keeps a source note in `docs/portfolio-working-notes.md`.

- The two pre-existing untracked user artifacts, `docs/design-exploration/` and `portfolio-style-round-scorecard.html`, remain untouched.

- V2 remains unlinked from production until separately approved.

## Verification Gates
1. Automated tests cover all five V2 workflow routes, shared CSS imports, navigation, required content sections, accordion semantics, About pointer bridge, reduced-motion handling, and valid local assets.

2. Browser QA covers the homepage and all five workflow pages at `1440px`, `1024px`, `768px`, `390px`, and `320px`.

3. Capture the hero, all six Selected Work chapters, all five accordion states on desktop and mobile, the About breakout sequence, and every workflow-page hero.

4. Verify hero/RCCV/Cool Runnings playback, the accommodation frame sequence, accordion keyboard selection, About section-wide pointer tracking, disclosure focus restoration, and portrait fallback.

5. Use Git diff to prove no V1 implementation file changed.

## Acceptance Criteria
- The hero film is visibly larger and reads as a rounded, thick-bezel, dimensional screen.

- Browsers and workflow media share that material language.

- Project sections are no longer identified by unrelated flat colours.

- Project titles are smaller and use Fraunces without reducing body readability.

- RCCV, accommodation, Cool Runnings, proposal, and Why Elevators each have the correct source-grounded environmental treatment.

- Albums remain on matching black; Bias to Build is the only large yellow field; Workflows and Outcomes share a white chapter.

- Accordion selection feels like an expanding physical spine and remains accessible and useful.

- About reacts to pointer movement across the section and restores the expanding practical-value scroll moment with an animated curly arrow.

- All five V2 workflow pages exist, contain accurate detail, share the V2 system, and link from the accordion.

- V1 is unchanged.
