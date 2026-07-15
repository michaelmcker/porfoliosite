# V2 Motion, Responsive Polish, and Local Search Case Study

Date: July 15, 2026

## Scope

Refine the approved V2 homepage without changing V1, then create a V2-native local-search case study at `/v2/work/local-search-magnet.html`.

The pass covers:

- hero supporting-copy rhythm;
- real boutique-accommodation scroll animation;
- shared browser-window drift;
- boutique preview-cue anchoring;
- album scale;
- a lighter Bias to Build route;
- responsive About typography and process arrow;
- a tighter line-free Experience ledger;
- the first V2 case-study route.

## Hero

Keep the existing hero copy and raised system-map film. Split the final sentence into its own inline block:

> And sometimes, stuff just for fun.

It uses the editorial face in italics, retains normal reading order, and receives only enough top spacing to register as a personal aside.

## Boutique Accommodation Motion

### Source truth

The animation media is already local and Git-tracked:

- `assets/videos/accommodation/overview-scroll.mp4` and `.webm`;
- `assets/videos/accommodation/treehouse-scroll.mp4` and `.webm`;
- `assets/videos/accommodation/cabin-scroll.mp4` and `.webm`;
- 69 extracted fallback frames under `assets/frames/accommodation/`.

Google Drive is not a runtime or deployment dependency.

### Playback model

The current 69-frame JPG swap does not reproduce the underlying site animation well enough. Replace it with one concatenated, compressed scroll-scrub video derived from the three source clips in this order:

1. Overview
2. Treehouse
3. Cabin

The sources already match at 800 x 500, 25fps, and `yuv420p`. Concatenate compatible streams without an unnecessary upscale; use a single controlled re-encode only if a container requires it. Export MP4 and WebM files at 800 x 500, which matches the browser's 16:10 viewport and keeps interface text sharp at the rendered size.

The video is muted, inline, preloadable, and controlled by page scroll. Scroll progress maps deterministically to `video.currentTime`; it does not autoplay independently of the page. Use `requestAnimationFrame` throttling, seek only when metadata is ready, and avoid unnecessary seeks below one source frame (`1 / 25` second). The existing 69 frames remain the poster/fallback path for reduced motion or unsupported video seeking.

### Browser choreography

Boutique Accommodation, Cool Runnings, and Why Elevators share a restrained horizontal movement: each browser begins 36px to the right and reaches its authored resting position as the section progresses. Cool Runnings adds no other transform. Boutique adds no scale or 3D rotation. Why Elevators retains its existing pitched-back rise, completes by 72% progress, then holds.

### Preview cue

Treat the curved arrow and `Scroll the preview` as one positioned unit. The label aligns with the arrow's upper-right origin while the arrowhead points toward the browser. The unit sits outside the media, remains within the section's content width, and cannot clip at 1024, 768, 390, or 320px.

## Selected Work and Bias to Build

- Increase the album composite's share of the black interlude and allow a slight controlled oversize without horizontal overflow.
- Replace the five heavy local arrows in Bias to Build with one thin continuous route inspired by the earlier approved stepped-line reference.
- The route connects Understand, Shape, Build, Measure, Refine, and Systematise in reading order, uses no numbered markers, and has only one restrained terminal arrowhead.
- Desktop retains the two-row snake. Mobile uses a single vertical route with the same stage order.

## About

At rest, `Even when the practical value is questionable.` reads exactly like the surrounding second paragraph: same colour, family, size, weight, line height, and inline flow.

As the sticky story progresses:

1. surrounding copy fades;
2. the phrase becomes editorial and gold;
3. its font size grows using viewport-responsive interpolation;
4. its maximum width remains constrained to the text column;
5. the gold process route draws toward the portrait;
6. `There’s still value in the process.` and the build note appear before the section releases.

The growing phrase must never enter the portrait's bounding box. At 1024, 900, and 768px, use a viewport-scaled growth amount and column-aware width instead of the current fixed 715px result. Strengthen the process route through stroke width and layer order, not a neon glow.

## Experience

Remove the top and per-entry separators. Tighten entry padding while retaining centred company, role, and date hierarchy. Use whitespace rather than dashed or hairline divisions.

## V2 Local Search Case Study

Create `/v2/work/local-search-magnet.html` with V2-only styling and links back to `/v2/#work`. Keep the root V1 case study untouched.

Reuse the current public-safe evidence and rolling metrics rather than rewriting the source story. The V2 page contains:

1. split hero with the real Cool Runnings film;
2. concise problem and intervention statement;
3. centred rolling outcomes with timeframe/source language;
4. the local-search system shown as an editorial sequence rather than boxed Neo-Brutalist cards;
5. real site, city, frost, guide, and calculator evidence;
6. human-review and constraint notes;
7. links to the live site and back to V2 Selected Work.

The page uses the V2 white, charcoal, forest, and hard-gold system; DM Sans for functional copy; Fraunces for editorial headings; shared browser-window material; and no eyebrow labels.

## Accessibility and Reduced Motion

- Keep real text as HTML outside media.
- The scroll-scrub video is decorative evidence with a useful accessible label and poster.
- Reduced motion shows a stable representative frame and removes browser drift while preserving all project copy and links.
- Focus indicators, touch targets, accordion keyboard behaviour, and portrait controls remain unchanged.

## Verification

Add or update automated coverage for:

- separated italic hero aside;
- tracked concatenated accommodation assets;
- scroll-to-currentTime mapping and metadata guards;
- frame fallback and reduced-motion state;
- shared right-to-left browser drift;
- cue containment at desktop, tablet, and mobile widths;
- larger album media without overflow;
- single light Bias route on desktop and mobile;
- About's identical resting typography and non-overlap at 1024, 900, 768, and 390px;
- line-free compact Experience entries;
- V2 case-study structure, assets, public-safe metrics, and links;
- no V1 implementation-file changes beyond the already authorized V2 documentation and test infrastructure.

Run the existing 24-test V2 suite, extend the browser QA, and capture revised desktop, tablet, and mobile screenshots for the affected sections and the new case study.
