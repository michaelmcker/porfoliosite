# Sideways Workflow Folder Tabs

Status: Approved design
Date: 2026-08-10

## Goal

Replace the bulky charcoal workflow sheets with a sideways filing system based on the supplied folder reference. The full folder-tab silhouette rotates 90 degrees: overlapping tongues run down the left edge, their labels read vertically, and the selected workflow opens into one clean paper-grey folder body.

The workflow content, artwork, routes, keyboard behavior, and active-panel selection remain unchanged.

## Visual Model

- Repeatable Systems remains a full-bleed charcoal chapter.
- One large warm paper-grey folder body occupies the content area.
- Five folder tongues overlap vertically down the left edge.
- Each tongue has a broad rounded outer corner and a curved inward shoulder where it joins the folder body, matching the supplied reference's folder silhouette after a 90-degree rotation.
- Labels rotate 90 degrees with the tongues and read vertically: Content, Dashboard, Presentation, Prospecting, Website.
- The system stays monochrome: adjacent charcoal and graphite tongues, warm-white labels, paper-grey folder body, and controlled dark shadows. It does not adopt the reference image's rainbow palette.
- Remove plus symbols, card-like raised lips, heavy individual borders, and the current rectangular-sheet appearance.

## Desktop and Tablet Geometry

At 760px and wider:

- The accordion is a two-part composition: a left tab rail and one flexible folder body.
- Each tongue is approximately 58–66px wide and overlaps the next by 8–12px.
- Tongues are tall enough to hold the complete vertical label without clipping.
- The active tongue moves forward in depth and joins the paper-grey folder body without showing a seam.
- Inactive tongues retain visible edges and enough contrast to remain distinct.
- Hover and keyboard focus move a tongue slightly outward from the stack without changing the selected workflow.
- Selecting a tongue changes the active body with the existing eased transition. The folder body itself does not resize or slide across the entire viewport.
- Workflow copy remains above the dominant visual inside the folder body.

## Mobile Geometry

Below 760px:

- Preserve the sideways filing idea instead of reverting to horizontal cards.
- The five tongues use a narrower 34–42px visual width and overlap more tightly.
- Labels remain vertical and use responsive sizing so every name stays readable.
- The rail consumes no more than roughly 30% of a 390px viewport, leaving about 70% for the open folder body.
- The active panel uses the existing portrait workflow artwork and remains vertically scrollable as part of the page.
- At 320px, tongue overlap increases before label size becomes unreadable.

## Interaction and Accessibility

- Keep the existing semantic buttons, regions, `aria-expanded`, `aria-controls`, focus management, and Arrow/Home/End/Enter/Space keyboard controls.
- Hover previews depth only; it never changes selection.
- The complete tongue remains at least a 44px touch target even when the visible overlap is narrower.
- Focus is visible against every graphite value.
- Reduced motion switches selection immediately while preserving the active-folder state.

## Content and Artwork

- Do not rewrite workflow copy or replace approved visuals.
- Keep the quality-90 WebP display derivatives and full-resolution PNG source masters.
- The active folder body uses the existing `#E7E8E3` artwork surface without an additional nested grey card.
- Workflow images retain intrinsic dimensions, responsive `<picture>` sources, lazy loading, and async decoding.

## Verification

- Capture all five selected states at 1440px and 390px.
- Confirm the five labels are fully visible at 1440, 1024, 768, 390, and 320px.
- Confirm no horizontal overflow and no clipped folder shoulders.
- Confirm the body retains at least 70% of the mobile viewport width at 390px.
- Confirm pointer, touch, and keyboard selection update the same active workflow.
- Confirm hover and focus lift the tongue without selecting it.
- Confirm reduced motion disables decorative travel.
- Run the complete portfolio test suite and permanent responsive browser QA.

## Out of Scope

- Workflow copy changes.
- New workflow artwork.
- Colour-coded workflow categories.
- Reordering workflows.
- Deployment or merging to production.
