# V2 Two-Turn Spiral Drop

**Date:** July 15, 2026  
**Status:** Approved design

## Goal

Slow the automatic contact-finale entrance and make it read like the OriginKit Spiral Images reference before retaining the approved Gravity Gallery interaction.

## Motion

- The existing once-only 40%-visible trigger remains unchanged.
- The entrance lasts 4,800ms instead of 1,800ms.
- Objects enter from beyond the upper-left edge and travel through exactly two inward Archimedean turns.
- Motion follows equal arc-length progress so the outer turn does not rush and the inner turn does not visibly accelerate.
- Each object rotates along the spiral tangent rather than spinning independently.
- Cards are phase-spaced along the same path, creating a readable stream rather than a stack.
- Each card scales continuously from full size at the outer edge to 55% at the centre.
- At the end of the second turn, the cards converge into a small central release band and transfer into Matter.js without a visible size or position jump.
- Gravity begins only after the centre convergence completes.

## Physics

- Matter.js bodies use the final 55% rendered dimensions, so the drop does not make the objects snap back to full size.
- The established four-wall collision world, overlap-aware copy, dynamic point-constraint dragging, release momentum, rotation, and one-shot behavior remain unchanged.

## Responsive and Fallback Behavior

- Desktop and mobile use the same two-turn path with radius derived from the stage diagonal.
- Mobile uses slightly tighter phase spacing while retaining two complete turns.
- Reduced-motion and runtime-failure states remain complete static compositions.
- V1 remains untouched.

## Verification

Tests and browser QA must prove the 4,800ms duration, two-turn path, centre convergence, progressive scale reduction, scaled Matter body handoff, no position or size jump, dynamic drag physics, once-only trigger, and responsive overflow safety.
