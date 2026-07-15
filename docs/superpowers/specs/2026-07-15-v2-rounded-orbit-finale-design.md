# V2 Rounded-Orbit Finale Refinement

## Scope

Refine only the V2 contact finale and its automated coverage. V1 remains untouched. Preserve the existing hard-gold stage, real portfolio artifacts, local Matter.js runtime, contact actions, reduced-motion fallback, and footer release.

## Approved Motion Path

The scroll-controlled entrance uses one broad, natural, responsive orbit across the whole available stage:

1. Enter from outside the upper-left edge.
2. Sweep down the left side toward the lower left.
3. Travel across the full width through the lower middle toward the lower right.
4. Climb the right side toward the upper right.
5. Arch inward toward the upper middle.
6. Release into gravity and drop to the bottom.

The path is curved rather than a literal rounded rectangle. Desktop and mobile use the same normalized path proportions, calculated from the current stage dimensions. Each visible artifact follows the path with a small phase offset so the collection reads as one moving stream rather than one overlapping stack. The orbit remains reversible while it is controlled by scroll.

At the release threshold, the exact DOM positions and angles transfer into Matter.js bodies without a visible jump. The initial drop retains gravity, collisions, a short bounce, and restrained rotation before settling along the bottom.

## Manual Placement

Physics applies to the initial drop only. Once the finale has settled, dragging is a placement interaction rather than a throw:

- pointer movement repositions the selected body;
- releasing it zeroes linear and angular velocity;
- the body becomes static at the exact release position;
- it does not fall, bounce, or continue spinning;
- other unpinned objects remain in their settled positions.

This behaviour applies equally near the top, middle, and bottom of the stage. Contact links remain excluded from dragging.

## Copy Timing and Contrast

The final copy begins resolving during the drop instead of waiting for every body to sleep. The morph from `Systematise.` to `Let’s build something useful.` starts shortly after physics release and completes before the objects finish settling. Contact actions follow immediately after the heading rather than after the former long settle delay.

The heading uses one of two explicit contrast states:

- dark ink over unobstructed hard gold;
- white with a restrained dark shadow when artifact overlap reaches the heading.

Overlap is recalculated during the physics drop and after manual placement. The whole heading changes state; individual letters do not flicker between colours. Buttons retain their existing high-contrast treatments.

## Portrait Source

The finale portrait must show Michael's head. Replace the headless `assets/portrait/poster.png` usage with a deterministic layered composition using:

- the existing Renaissance body/background plate; and
- an approved local head pose from `assets/portrait-final/assets/poses-webp/riverflow-registered/`.

The head layer is presentation-only, has no pointer surface, and moves as part of the same physics body as the portrait card. The interactive About portrait remains unchanged.

## Accessibility and Fallbacks

- Reduced motion skips the orbit and physics but shows the complete contact message, actions, and head-visible portrait.
- Runtime failure uses the same complete static composition.
- No wheel, keyboard, or page-scroll trap is added to the finale.
- The contact links retain their focus states and touch targets.
- The local `file://` assessment remains functional; no CDN asset or runtime is introduced.

## Verification

Automated coverage will prove:

- the first artifact reaches the left-bottom, right-bottom, right-top, and upper-middle regions in order before release;
- the pre-release orbit remains reversible and deterministic;
- physics inherits the release pose without a positional jump;
- the heading becomes visible during the drop and switches contrast when overlapped;
- a dragged object remains within one pixel of its release point after a post-release wait;
- the portrait contains and loads a head-visible local layer;
- the footer still releases after the finale;
- 1440, 1024, 768, 390, and 320 pixel layouts remain free of horizontal overflow;
- reduced-motion and local-file fallbacks remain complete.

## Isolation

Permitted production changes are limited to V2 finale markup, styles, controller code, local V2 assets if required, tests, QA, and the V2 documentation contract. Root V1 implementation files must not change.
