# Desktop Workflow Folder Tabs and Sliding Cards

Status: Approved design
Date: 2026-08-10

## Goal

Desktop uses five discrete shaped folder tabs in permanent top-to-bottom slots down the right edge. Each tab has its own raised lobe and shoulder cutout, with a tight 6px gap to the next tab. Labels read vertically from top to bottom. Selecting a tab retracts the current workflow card rightward behind that column, then slides the selected workflow's loose paper card left into view.

There is no literal folder pocket, paper holder, or new mobile interaction.

## Desktop Structure

- Repeatable Systems remains a full-bleed charcoal chapter.
- At 1100px and wider, five discrete folder-tab silhouettes remain fixed in one vertical column while one paper panel occupies the area to the left.
- Each tab is a separate graphite folder shape with a raised rounded lobe and an inward shoulder, rather than part of one continuous scalloped edge.
- Tab labels read vertically using the existing DM Sans family and remain fully visible: Content, Dashboard, Presentation, Prospecting, Website.
- The five tabs always remain visible in one right-hand sequence and keep identical coordinates across selection changes.
- The active workflow is a separate warm paper-grey card with controlled radius, subtle texture, and a soft shadow. It is not framed by another folder body.
- Copy sits above the approved workflow visual on that card. The visual retains its own authored black field and coloured routes.
- The styling uses the portfolio's charcoal, graphite, warm paper, DM Sans, and Fraunces system. It avoids rainbow folder colours, heavy outlines, glossy effects, and literal office-supply illustration.

## Desktop Selection Motion

1. The current paper card moves toward its tab, loses depth, and fades over roughly 180–220ms.
2. The fixed tab row does not reallocate width or move any label.
3. The new paper card begins slightly to the right and slides left into its resting position over roughly 480–560ms using `cubic-bezier(.22, 1, .36, 1)`.
4. Its shadow deepens during travel and softens when settled, making the card feel pulled from behind the selected tab.
5. Tabs and their labels remain anchored; hover/focus changes only their surface treatment.

The outgoing and incoming cards overlap briefly enough to feel continuous, but never display two readable workflow bodies at once.

## Mobile Boundary

- Do not redesign the mobile accordion.
- Preserve the existing stacked mobile rows, portrait artwork, touch targets, and expansion behavior below 1100px.
- Desktop-only top-tab geometry and card motion must be scoped inside the desktop media query.

## Interaction and Accessibility

- Keep semantic buttons, regions, `aria-expanded`, `aria-controls`, focus states, and Arrow/Home/End/Enter/Space keyboard controls.
- Hover and focus may brighten a tab without changing its position or selection.
- The complete desktop tab remains at least 44px wide.
- Reduced motion removes the retract-and-slide travel while preserving immediate selection.

## Content and Assets

- Do not rewrite workflow copy or replace artwork.
- Retain the quality-90 WebP display derivatives and PNG source masters.
- Retain responsive `<picture>` sources, intrinsic dimensions, lazy loading, and async decoding.

## Verification

- Capture all five selected desktop states at 1440px.
- Confirm the five discrete shaped tabs form one tight vertical right-hand column and all vertical labels remain readable at 1440px, 1280px, and 1100px.
- Confirm the outgoing card retracts before the incoming card slides left.
- Confirm there is no holder or nested folder pocket around the paper card.
- Confirm mobile screenshots at 390px and 320px are visually unchanged.
- Confirm no horizontal overflow, clipped labels, hidden focus, or overlapping readable panels.
- Run the complete test suite and permanent responsive browser QA.

## Out of Scope

- Mobile accordion redesign.
- Workflow copy or artwork changes.
- Colour-coded workflow tabs.
- Reordering workflows.
- Deployment or production merge.
