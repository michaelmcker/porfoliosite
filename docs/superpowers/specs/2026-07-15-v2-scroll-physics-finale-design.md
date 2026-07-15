# Portfolio V2 Scroll, Portrait, and Physics Finale Design

**Status:** Approved direction; written implementation contract for review

## Purpose

Refine the current isolated `/v2/` homepage without changing V1. This pass fixes two existing interaction problems—the boutique-accommodation scrub and the About portrait tracking—and replaces the simple yellow contact band with a larger authored finale.

The finale has one deliberate sequence:

1. Portfolio objects spiral into view as the visitor scrolls.
2. At the end of the spiral, those exact objects transfer into a real-time physics scene and drop to the floor.
3. After the objects settle, the headline morphs into **“Let’s build something useful.”**
4. The contact actions appear, and continued scrolling releases the sticky scene into the footer.

The user remains in control of the scroll-driven portion. Physics begins once, only after the scroll choreography is complete.

## Scope

This pass changes only:

- the boutique-accommodation interaction and section spacing;
- the About phrase sizing and portrait pointer architecture;
- the V2 contact/finale section;
- V2-only tests and documentation needed for those changes.

It does not redesign the accordion, rewrite portfolio claims, alter the workflow pages, change proposal generation, or modify any V1 implementation file.

## 1. Boutique Accommodation: Local Wheel Scrub

### Current problem

The current accommodation preview is not a local scroll experience. Page scroll progress is mapped to `video.currentTime`, so the animation can appear static or finish too quickly. Wheel input over the browser is not intercepted, and the page continues moving behind it.

### Required behaviour

On desktop devices with a fine pointer:

- When the pointer is over `[data-accommodation-viewer]`, wheel input is captured with a non-passive listener.
- The page remains fixed while that wheel input advances or reverses the accommodation video.
- The scrub is continuous across the stitched overview, treehouse, and cabin footage.
- The page remains fixed at the beginning and end of the video; leaving the browser object is the explicit way to resume page scrolling.
- Moving the pointer outside the browser immediately restores native page scrolling.
- The on-screen cue reads as one unit and points to the top-right edge of the browser without clipping it.

The wheel delta is normalized and accumulated into a `0–1` scrub value. `requestAnimationFrame` applies the corresponding media time so a trackpad does not trigger excessive synchronous seeks.

Ordinary page scroll outside the viewer may continue to control the browser object's entrance treatment. It must not compete with a recent manual scrub. A short manual-input cooldown makes the local scrub authoritative.

### Keyboard, touch, and reduced motion

- Keyboard scrolling is never trapped by the media object.
- Touch layouts keep document scrolling native and show the existing representative fallback/poster unless a reliable explicit scrub gesture is added later.
- Reduced-motion mode shows a stable representative frame and does not install the local wheel trap.
- The browser object retains an accessible label explaining that pointer-wheel input scrubs its preview.

### Spacing

Boutique Accommodation is reduced from the generic `120svh` selected-work runway to approximately `100–105svh`, with about 20–25% less vertical padding. This change is specific to the boutique chapter and does not compress the Cool Runnings or Why Elevators motion runways.

## 2. About: One Pointer Coordinate System

### Current problem

The portrait currently has two pointer owners:

- the parent page tracks pointer position across the entire tall About story and sends coordinates into the iframe;
- the iframe separately tracks pointer position over its own stage.

Pointer events do not bubble through the iframe boundary, and the two trackers use different coordinate systems. The iframe also applies a crosshair cursor. The result is a visible cursor change and a head pose that jumps or stops when the pointer crosses into the portrait. Because the parent normalizes against the full `280svh` scroll story, the same physical pointer position can also produce a different pose as the story moves.

### Required architecture

The parent page becomes the only coordinate owner:

- The parent listens across the visible sticky About stage.
- Coordinates are normalized against the stable sticky viewport (`.about-story-sticky` or its visible inner stage), not the full tall scroll runway.
- The portrait iframe is presentation-only and uses `pointer-events: none`.
- The iframe's independent pointer listener and crosshair cursor are disabled in embedded mode.
- The parent continues to send normalized `x` and `y` through the existing typed `postMessage` interface.
- Crossing onto the visible portrait does not change the cursor or coordinate mapping.
- Scrolling without moving the pointer does not create a new head pose.

The iframe remains independently renderable for debugging, but embedded mode has exactly one source of pointer truth.

## 3. About: Capped Scroll Typography

At rest, **“Even when the practical value is questionable.”** remains inline and visually identical to the sentence around it. It does not begin highlighted, enlarged, or detached.

As the About sequence progresses:

1. surrounding copy fades;
2. the questionable-value phrase grows and changes colour;
3. the connecting line draws toward the portrait;
4. **“There’s still value in the process.”** and the build explanation resolve beside the portrait;
5. the sticky section releases only after the sequence is complete.

The enlarged phrase is capped rather than becoming a display billboard:

- desktop maximum: approximately `3.4–3.8rem`;
- process statement maximum: approximately `2.4–2.8rem`;
- tablet and mobile caps reduce responsively.

At the final state, the highlighted phrase, process statement, build explanation/link, and portrait must all fit within the visible `100svh` stage. Text may not slide underneath or be clipped by the portrait frame at any supported width.

## 4. Contact Finale: Scroll to Physics

### Structure

The current short yellow `.contact` band becomes a tall scroll story with a sticky full-viewport stage. The stage remains yellow, preserving the existing page rhythm, but gains enough height for a controlled spiral, one-way release, and final contact state.

The implementation uses three explicit phases.

### Phase A: Scroll-driven spiral

The first approximately 55–60% of the finale's scroll runway is deterministic and reversible.

- Real portfolio media enters on an Archimedean spiral.
- Each object follows an equal-distance path toward a composed release formation.
- Object rotation follows the spiral tangent with restrained individual offsets.
- Scale, opacity, and depth vary by distance so the objects read as a moving collection rather than a flat wheel.
- Scroll progress is the only clock. Stopping scroll freezes the spiral; reversing scroll reverses it before release.
- No physics engine is active during this phase.

Desktop uses roughly 9–11 objects. The source set is drawn only from existing public-safe portfolio media:

- the Renaissance portrait;
- the RCCV laptop;
- the boutique accommodation browser;
- Cool Runnings;
- the proposal artifact;
- Why Elevators;
- search-optimized content production;
- the agency dashboard;
- presentation publishing;
- local prospecting;
- image-to-website production.

These are compact authored objects, not repeated generic cards. Existing browser, laptop, paper, and portrait treatments remain recognizable.

### Phase B: One-way physics release

Crossing the spiral completion threshold triggers a one-way state transition:

- Every physics body is created at the exact on-screen position, angle, and size of its final spiral transform.
- There is no jump between deterministic movement and simulation.
- Gravity, collision, friction, and bounded walls allow objects to tumble and settle naturally at the bottom of the stage.
- The floor and side walls are invisible.
- The scene remains pinned while the initial drop completes.
- Scrolling backward after release does not reverse time or rebuild the spiral. The released session remains in its physics state.

Settling is detected through sleeping bodies or a sustained low linear/angular velocity window, with a maximum timeout as a safety fallback. Once settled, objects become draggable and tossable with pointer input. Dragging must not select images, create browser-native ghost drags, or scroll the document accidentally while an object is held.

Physics is powered by a locally vendored, pinned Matter.js build so the existing `file://` review route works without a CDN or network connection. It loads only as the finale approaches the viewport.

### Phase C: Text morph and contact reveal

The headline is not shown as the final statement before the physics completes.

- When the settled event fires, a short blur/scale/opacity morph resolves into the single final phrase **“Let’s build something useful.”**
- The morph uses local DOM/CSS/SVG-filter techniques inspired by the OriginKit Text Morph mechanism; no React or remote runtime is introduced.
- Email, LinkedIn, and GitHub actions enter after the phrase resolves.
- A small continuation cue then indicates that the page can scroll onward.
- Continued document scroll releases the sticky finale and reveals the existing footer.

This is a finite ending, not a perpetual rotating word list.

## 5. Responsive Behaviour

### Desktop

- Use the full 9–11-object collection.
- Preserve enough central negative space for the final headline.
- Keep draggable settled objects below or around the headline rather than on top of it.

### Tablet

- Reduce object size and initial spiral radius.
- Use 7–9 objects depending on measured collision density.
- Maintain the full three-phase sequence.

### Mobile

- Use 6–7 objects selected from the same source set.
- Shorten the spiral path while keeping it visibly spiral-shaped.
- Use smaller rigid bodies and generous invisible wall insets so objects cannot cause horizontal overflow.
- Touch dragging is enabled only after the initial settle.
- The final phrase and actions remain unobscured and meet 44px touch-target requirements.

## 6. Reduced Motion and Failure States

With `prefers-reduced-motion: reduce`:

- skip spiral travel, falling physics, and text-morph animation;
- render a static settled collage;
- show the final phrase and actions immediately;
- keep all links and content available;
- do not install accommodation wheel capture.

If Matter.js fails to load or initialize, the finale must fall back to the same static settled composition. The contact route never becomes unavailable because of animation failure.

## 7. Performance and Accessibility

- Use transforms and opacity for the scroll-driven spiral.
- Batch DOM reads and writes in `requestAnimationFrame`.
- Pause finale updates when the section is well outside the viewport.
- Use responsive source images and avoid decoding full-size media for small bodies.
- Decorative object duplicates are `aria-hidden`; the final heading and contact links form the semantic content.
- Preserve visible focus states and logical tab order.
- Do not use colour alone to communicate interaction state.
- Do not create a global scroll trap. The accommodation viewer's pointer-local wheel capture is the only intentional scroll interception.

## 8. Acceptance Gates

### Boutique Accommodation

- Wheel input over the browser changes its video time while page `scrollY` remains unchanged.
- Wheel input outside the browser scrolls the page normally.
- Scrubbing works in both directions and across all stitched footage.
- The cue is attached to the browser without clipping.
- The chapter is visibly tighter than before.

### About

- The cursor does not change over the iframe.
- Pointer movement produces continuous head-pose changes across the full sticky stage, including directly over the portrait.
- A stationary pointer does not change pose during page scroll.
- The highlighted phrase begins as normal sentence copy.
- At final focus, all required text and the portrait fit in the viewport at `1440`, `1024`, `768`, and `390` pixels wide.

### Finale

- Spiral position is deterministic from scroll progress before release.
- Release creates no visual jump.
- Bodies fall, collide, settle, and can be dragged afterward.
- The final text morph starts only after settle or the safety timeout.
- The sticky section releases after the final state.
- Reduced-motion and physics-failure paths show a complete static contact section.
- No horizontal overflow occurs at `1440`, `1024`, `768`, or `390` pixels wide.

### Regression and isolation

- Accordion click/tap and keyboard navigation still work.
- Existing selected-work links and media still load.
- V1 implementation files remain unchanged.
- V2 works from the current local `file:///.../v2/index.html` review path.

## Source References

The interaction mechanics are adapted to this static V2 architecture from:

- OriginKit Spiral Images: <https://www.originkit.dev/components/spiralimages>
- OriginKit Gravity Gallery: <https://www.originkit.dev/components/gravitygallery>
- OriginKit Text Morph: <https://www.originkit.dev/components/textmorph>

These references supply motion principles, not visual styling or runtime architecture. The finished implementation remains native HTML/CSS/JavaScript plus a locally vendored physics engine.
