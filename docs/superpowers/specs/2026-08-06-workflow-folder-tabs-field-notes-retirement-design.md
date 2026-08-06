# Workflow Folder Tabs and Field Notes Retirement

Date: 2026-08-06

Status: Approved direction, awaiting implementation-plan review

## Goal

Make `The repeatable systems behind the work` read as a stack of traditional file folders without changing the content, accessibility model, or expansion timing. Give every workflow visual a consistent warm-grey presentation surface on the homepage and detail pages. Fully remove Field Notes from the deployed portfolio while preserving its private source, automation, and generated artifacts for a possible later return.

## Chosen Direction

Use overlapping charcoal folder faces with raised horizontal label tabs. The current 780ms accordion remains the interaction model: selecting a visible tab expands that folder and collapses the previous one. The selected tab remains visible and visually joins the open folder body.

The other considered treatments were:

1. Light manila folders. This is the most literal metaphor, but it introduces a second light-paper chapter and weakens the existing charcoal workflow environment.
2. A single top tab bar above one shared panel. This is compact, but it reads as ordinary software navigation rather than a physical stack of authored workflow artifacts.

The selected charcoal-folder approach retains the approved page palette and gives the interaction a clearer physical model.

## Desktop Composition

- Keep the full-bleed charcoal workflow chapter, centred heading, existing workflow copy, artwork, and calls to action.
- Each workflow item becomes a full-height folder sheet with a raised tab attached to its upper edge.
- Labels are horizontal, bold DM Sans, and readable without rotating the head or hovering.
- Folder tabs overlap laterally and use small alternating top offsets, restrained edge highlights, and directional shadows to establish stacking order.
- The complete label for every inactive folder remains visible. The selected tab also remains visible and joins the expanded folder body.
- The active folder body uses the same charcoal family as the tab. Its artwork sits on a distinct warm-grey card rather than directly on the black folder body.
- Hover and keyboard focus lift a closed folder slightly from the stack. Selection preserves the existing 780ms `cubic-bezier(.22, 1, .36, 1)` expansion.
- No new colour coding, numbering, vertical text, thick outlines, or decorative folder icons are introduced.

## Tablet and Mobile Composition

- Below 1100px, folders stack vertically and retain horizontal labels.
- Each closed row reads as a folder: a raised label lip sits at the upper left and the folder face continues beneath it.
- Rows overlap only enough to communicate depth; labels and 44px minimum targets remain unobstructed.
- The active row opens downward using the existing vertical accordion transition and keeps its tab visible.
- The workflow image remains the dominant content and continues using its dedicated mobile artwork.
- Folder shadows and offsets flatten at narrow widths so the stack cannot create horizontal overflow.

## Interaction and Accessibility

- Preserve the current semantic buttons, regions, `aria-expanded`, `aria-controls`, `aria-hidden`, `inert`, and focus behavior.
- Preserve click, tap, Arrow, Home, End, Enter, and Space controls.
- Hover remains a preview of physical depth only and never changes selection.
- Reduced motion removes expansion and lift animation while leaving every state complete and usable.
- No workflow JavaScript rewrite is required unless browser testing reveals a state-specific layout defect.

## Workflow Artwork Surface

The folder section may remain black, but black is not the default background behind workflow images.

- Use the approved desktop and mobile workflow exports already documented in `v2/assets/workflows/README.md`; do not regenerate, cut out, or replace them as part of this change.
- Present every homepage workflow image inside the same warm-grey artwork card currently used as the light paper surface.
- Use that same warm-grey artwork card around the hero visual on every workflow detail page. Replace the detail page's current black image wrapper.
- If an image has transparency or a removed background, the warm-grey card must remain visible behind it. A transparent workflow asset must never resolve onto black.
- If an approved export has its own full background, retain the entire background inside the grey card. Do not crop it away or recolour the export.
- Keep enough inset around the artwork to avoid clipping labels and connector lines, but do not create a thick frame. Desktop and mobile use proportionate padding and the purpose-built asset for that breakpoint.
- The homepage and detail page must share the same artwork-surface colour, radius, padding rhythm, and image-fit rules so the asset does not appear to change style between contexts.
- The Agency Management Dashboard remains the approved dashboard screenshot. It follows the same outer grey-card rule and is not regenerated.

## Field Notes Retirement

Field Notes will be fully hidden from the deployed portfolio, not deleted from the project.

- Remove the Field Notes link from the V2 and promoted production navigation.
- Remove homepage RSS discovery metadata.
- Remove Field Notes URLs from the production sitemap and prevent the renderer from adding them back while the feature is hidden.
- Stop promoting Field Notes output into the production root.
- Exclude both root and V2 Field Notes output directories from Vercel deployment so `/field-notes/`, article routes, CSS, and the feed are unavailable publicly.
- Preserve `content/field-notes/`, `scripts/weekly-field-notes/`, private state, approval rules, and generated local output.
- Keep private workflow tests, but change production-surface tests to assert that Field Notes has no navigation, sitemap, RSS, promotion, or deploy surface.

This is a reversible publication change. Restoring Field Notes later requires an explicit design and publishing decision, not regeneration alone.

## Source and Documentation Changes

- Edit canonical homepage source under `v2/`, then run `npm run promote:v2`.
- Update `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md` with the folder-tab and private Field Notes boundaries.
- Extend the existing `agent/fix-mobile-about-portrait` branch and draft PR #1 so the current mobile About fix and these adjacent portfolio refinements remain in one review surface.

## Verification

- Add failing tests for the folder-tab structure, readable labels, retained selected tab, and unchanged accessible controls before implementation.
- Add failing tests proving Field Notes is absent from navigation, alternate metadata, sitemap, promotion, and Vercel output while private source and automation remain.
- Run the full test suite.
- Run permanent homepage QA at 1440, 1024, 768, 390, and 320 pixels.
- Verify no workflow label clipping, tab collision, horizontal overflow, hidden focus ring, or artwork regression.
- Verify every workflow visual has a warm-grey outer card at every breakpoint, transparent pixels never resolve onto black, and retained-background exports remain uncropped.
- Verify the 780ms desktop transition, vertical mobile transition, keyboard navigation, reduced motion, and direct workflow links.
