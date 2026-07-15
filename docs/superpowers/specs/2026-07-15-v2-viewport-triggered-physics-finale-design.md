# V2 Viewport-Triggered Physics Finale

**Date:** July 15, 2026  
**Status:** Approved design

## Goal

Make the hard-gold contact finale feel like the OriginKit Gravity Gallery reference: it should start by itself when the section enters view, give the portfolio objects enough room to read individually, and preserve natural spring, momentum, collision, and rotation physics while the visitor moves them.

## Trigger and Sequence

- The finale is not controlled by page-scroll progress.
- An `IntersectionObserver` starts it once per page load when 40% of the contact stage is visible.
- Entry runs autonomously over 1,800ms.
- Objects enter from the upper-left and follow the approved broad loop across the full frame.
- Their time offsets and path offsets keep them visibly separated instead of forming a dense train.
- At the end of the entrance, every object transfers from its rendered pose into a dynamic Matter.js body without a visible coordinate jump.
- The text resolves during the gravity drop, using the existing overlap-aware contrast treatment.
- Scrolling away and back does not replay the sequence. Reloading the page resets it.

## Physics and Dragging

- Matter.js owns gravity, wall collisions, object collisions, surface friction, air friction, angular movement, and sleeping after release.
- Dragging uses a Matter-style point constraint comparable to the reference: high positional stiffness and no angular stiffness.
- A held object remains dynamic. It follows the pointer through the constraint and may rotate as surrounding objects collide with it.
- Releasing the pointer removes the constraint and preserves the body’s natural velocity and angular velocity, allowing a restrained toss.
- Objects are never converted to permanently static bodies after manual placement.
- All four stage boundaries remain active so objects cannot escape the composition.
- Pointer input over links remains link input; contact actions must not be intercepted by the physics layer.

## Layout

- The contact stage retains the full-bleed hard-gold field and current headline/actions.
- Desktop objects start with wider entrance offsets and settle into a less crowded field.
- Mobile uses the same trigger and physics model with smaller bodies and spacing derived from the narrower stage.
- The layered finale portrait remains head-visible.

## Accessibility and Failure States

- `prefers-reduced-motion` skips the moving entrance and physics drop, showing the complete static finale.
- If Matter.js fails to load, the complete static composition, message, and contact actions remain available.
- Keyboard and touch access to all contact links remains unchanged.
- Touch dragging uses the same constraint behavior without blocking normal page scrolling outside an actively held object.

## Verification

Automated and browser QA must prove:

1. The sequence remains idle before the visibility threshold.
2. Intersection starts the entrance without additional scrolling.
3. The entrance progresses on elapsed time rather than scroll position.
4. Objects occupy more separated positions during the entrance.
5. Physics begins without a positional jump.
6. Dragging uses a dynamic constraint and release preserves motion.
7. No dragged body becomes permanently static.
8. The sequence triggers only once per load.
9. Desktop, mobile, reduced-motion, and runtime-failure states remain complete and overflow-free.

## Isolation

This change is limited to the V2 finale, its tests, QA, and V2 documentation. V1 implementation files and routes remain untouched.
