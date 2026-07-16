# V2 Proposal Builder Design

## Purpose

Create an isolated V2 proposal-builder page that demonstrates how the working public proposal system turns three business inputs into a tailored digital out-of-home proposal. The page must explain the transformation visually without changing the existing V1 builder, proposal APIs, PDF renderer, inventory model, or server-only integrations.

## Route and Isolation

- Add `v2/proposal-generator.html` and V2-only presentation assets.
- Keep `proposal-generator.html`, `proposal-generator.css`, `proposal-generator.js`, `/api/proposal/suggest`, `/api/proposal/generate`, and the proposal PDF renderer unchanged.
- Reuse the working `proposal-generator.js` behavior through the same semantic form and preview hooks. Do not fork proposal logic.
- Change only the V2 homepage `Try the generator` link to the V2 route.
- The V2 page must work from the project HTTP preview. Direct `file://` viewing may show the approved sample, but live address search and generation still require the existing HTTP API route.

## Visual Direction

The page belongs to Portfolio V2: white canvas, charcoal ink, DM Sans for functional copy, Fraunces for editorial statements, generous spacing, restrained shadows, and hard yellow as the only strong annotation colour. It must not inherit V1 CSS or reintroduce graph-paper backgrounds, heavy outlines, numbered process cards, or repeated box-within-box framing.

Use a concise introduction followed by one annotated live workspace. The workspace is the primary explanation; a second generic process section is unnecessary.

## Page Structure

### Header

Use the V2 monogram, compact portfolio navigation, and social controls. Link back to `v2/index.html#work` and `v2/index.html#workflows`.

### Introduction

Use a short editorial heading that explains the outcome, followed by one paragraph:

> Enter a business name, business type, and address. The system finds nearby inventory, builds a local campaign concept, and assembles a presentation-ready proposal.

Avoid an eyebrow. Keep the heading and paragraph left-aligned inside the normal V2 page frame.

### Annotated Workspace

Use a responsive two-column composition:

- Left: the real working form using business name, business type, and validated address.
- Right: a large letter-shaped proposal preview, slightly rotated and elevated with a soft physical shadow.
- The approved sample PDF remains visible before generation. The exact returned PDF replaces it after generation.
- Keep Open PDF and Download actions when a proposal finishes.

Four hard-yellow curved-arrow callouts point to stable zones around the preview:

1. **Custom ad** — `The system generates an ad from the business name and business type, then perspective-skews it onto the elevator screen.`
2. **Custom copy** — `Industry-specific messaging changes the pitch, supporting language, and value proposition.`
3. **Live screen count** — `Nearby inventory updates the number of screens used in the proposal headline.`
4. **Local map** — `Mapbox plots nearby properties within a reasonable walking distance of the business.`

Desktop callouts sit outside the proposal sheet and connect with curved SVG paths whose arrowheads stop before the paper edge. They must not cover the form, preview text, toolbar, or PDF actions.

### Supporting Description

Below the workspace, use a compact statement that connects the pieces:

> One small input set becomes custom creative, tailored copy, local inventory proof, and a proposal a salesperson can send.

Do not add another numbered process grid.

## Responsive Behavior

- At desktop widths, retain the form-and-preview split and all four anchored curved callouts.
- At tablet widths, stack the form above the preview and move the annotations into two columns below the preview.
- At mobile widths, use four numbered yellow pins over non-critical preview zones and a matching one-column explanation list below it. Do not force desktop arrows into the viewport.
- Maintain 44px touch targets, visible focus, readable form labels, and no horizontal overflow.
- Reduced motion removes the proposal tilt transition and smooth scrolling without hiding content.

## Behavior and Data Flow

The V2 markup preserves the existing data attributes expected by `proposal-generator.js`:

- `[data-proposal-form]`
- `[data-address-field]`
- `[data-address-results]`
- `[data-proposal-error]`
- `[data-proposal-frame]`
- `[data-proposal-loading]`
- `[data-loading-message]`
- `[data-preview-state]`
- `[data-preview-actions]`
- `[data-open-pdf]`
- `[data-download-pdf]`
- `[data-submit-label]`

Input and output behavior remains unchanged:

1. The user enters business name and business type.
2. The user selects a complete address from the existing suggestion endpoint.
3. The existing generate endpoint returns the exact one-page PDF.
4. The V2 preview displays that returned PDF and enables Open PDF and Download.

Mapbox, geocoding, LetzAI, raw inventory, and API credentials remain server-side. No new browser-facing data or endpoints are added.

## Error and Loading States

- Preserve the current inline address suggestion behavior and inline error message.
- Preserve the existing loading step messages and generation-time note.
- Show the approved sample again when generation fails.
- The annotation layer is presentational and cannot block inputs or preview actions.

## Verification

Add a V2 regression contract that proves:

- the new route exists and imports only V2 presentation CSS;
- the V2 homepage points to it;
- all existing proposal data hooks and API behavior are reused;
- the four required annotations and exact descriptions are present;
- Mapbox and LetzAI secrets do not enter browser code;
- mobile annotations replace desktop arrows at the responsive breakpoint;
- V1 proposal files and APIs remain unchanged.

Run the full unit suite, existing proposal tests, V2 browser QA, focused desktop/mobile captures, `git diff --check`, and a V1 isolation diff before completion.
