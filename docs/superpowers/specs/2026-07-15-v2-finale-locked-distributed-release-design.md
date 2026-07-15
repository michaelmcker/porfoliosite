# V2 Finale Locked Distributed Release Design

## Goal

Refine the approved two-turn contact finale so the complete entrance remains visible, the objects retain more visual weight, and gravity begins from a distributed central release rather than one stacked point.

## Approved behaviour

- The entrance remains autonomous and starts once when the contact stage reaches the existing 40% visibility threshold.
- At activation, the contact stage aligns to the top of the viewport and page movement is temporarily locked for the 4,800ms entrance. The lock ends before Matter.js gravity begins, so the user can scroll normally during and after the fall.
- Reduced-motion and failed-script states never lock scrolling.
- The two-turn Archimedean spiral, equal arc-length pacing, tangent rotation, and phase-separated stream remain unchanged.
- Object scale now attenuates from 100% to 70%, preserving more readable media on desktop and mobile.
- During the final six percent of the spiral, objects converge toward a distributed horizontal release band centred around the stage midpoint. The band is capped responsively, keeping the objects close without assigning every object the same coordinates.
- Each object receives a small vertical offset within that band. Matter.js inherits the exact final position, rotation, and 70% scale, then gravity lets the objects fall away and settle naturally.
- Dynamic dragging, tossing, collision, boundaries, copy contrast, and once-only playback remain unchanged.

## Viewport-lock safety

- Store the current scroll position and existing inline body styles before locking.
- Align the contact stage to the viewport before freezing the body.
- Preserve the scrollbar gutter to prevent horizontal layout shift.
- Restore every captured body style and the stored scroll position when the entrance finishes or aborts.
- Listen for `pagehide` so navigation cannot leave the document in a locked state.

## Verification

- Static tests require the 70% scale, viewport-lock helpers, and distributed release calculation.
- Browser QA verifies the stage sits at the viewport top, attempted wheel scrolling cannot move the page during the entrance, the lock clears at physics release, final scale stays near 70%, and release positions occupy a meaningful but bounded horizontal span.
- Existing responsive, reduced-motion, physics, dragging, overflow, and V1-isolation checks must continue to pass.
