# V2 Dashboard Recovery and Tab Depth Design

## Goal

Restore the real agency-management dashboard that previously appeared in the portfolio, normalize workflow-media staging, and make the desktop accordion rails read as a deliberate physical stack.

## Source truth

- Desktop and mobile dashboard artwork must use `assets/screens/fountainhead-ai-visibility-dashboard-v3.png`.
- This is the prior edge-to-edge AI Visibility Dashboard containing the `Keyword Content` and `Client Notes` source labels.
- Do not regenerate, redraw, or replace it with a conceptual workflow diagram.
- Copy the source into the existing V2 production asset names so homepage and detail-page routes remain stable.

## Workflow media stage

- Every homepage workflow panel uses one charcoal media stage with the same inset, radius, centring, and image-sizing rules.
- Black workflow diagrams visually merge into the stage.
- The light dashboard screenshot remains a distinct authored object on the same dark stage.
- Detail workflow pages retain the same dark stage and use the same centring and containment logic.

## Desktop tab stack

- Keep the current semantic buttons, keyboard controls, active-panel behavior, and transition timing.
- Add perspective to the accordion.
- Inactive rails overlap by approximately 24px.
- Each rail has a narrow darker side face, a light leading edge, ordered z-index, and a short directional shadow.
- Rails receive small alternating vertical offsets so their physical layering is legible.
- Hover moves a rail forward slightly without changing the selected panel.
- The active rail still collapses completely so the workflow image remains dominant.

## Tablet and mobile

- Reset the desktop 3D transforms below 1100px.
- Vertical accordion rows use a restrained bottom edge and shadow rather than perspective rotation.
- The restored dashboard remains the real screenshot; mobile does not invent a replacement diagram.

## Verification

- Asset hash proves V2 uses the exact prior dashboard source.
- Tests verify homepage and detail routes retain their production asset paths.
- CSS tests verify perspective, side face, ordered depth, and responsive reset.
- Browser QA covers desktop accordion interaction, mobile expansion, and overflow.
