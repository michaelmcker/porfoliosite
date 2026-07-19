# V2 Live Devices and Anchored About Phrase Design

> Superseded for Boutique Accommodation and the Cool Runnings timing on July 15, 2026. The current source-of-truth contract is in `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md`: Boutique uses a same-origin semantic copy of the actual three Okanagan heroes with compressed local source movies, and Cool Runnings completes at text centre. The About portion of this document remains historical context.

## Goal

Replace the remaining recorded-media shorthand with authored, interactive device treatments and make the About phrase begin as an ordinary part of its sentence before it becomes a scroll-led statement.

## Root-cause findings

- Boutique Accommodation is a stitched MP4/WebM whose `currentTime` is driven by outer-page and pointer-wheel scroll. Recorded pixels cannot expose selectable text, real links, or browser-native page interaction.
- The live Okanagan Treehouse preview cannot be framed directly because it returns `X-Frame-Options: SAMEORIGIN`.
- The V2 About implementation turns the live inline phrase itself into a block when focus starts. That creates the visible jump before the phrase grows.
- Cool Runnings is still inside the generic black browser frame even though an approved transparent graphite laptop frame already exists locally.

## About sentence

The resting paragraph ends with the complete sentence:

> Even when the practical value is questionable, there is value in the process.

The sentence uses normal paragraph type, weight, colour, and line-height. The first clause is marked as the phrase that will grow, but remains inline. A separate `aria-hidden` focus copy is positioned from the inline clause's real bounding box. At the transition, the focus copy crossfades from the exact same coordinates while the inline copy and surrounding sentence fade. It then gains editorial weight, colour, and actual font size. The later value statement uses `There is value in the process.` and remains adjacent to the portrait.

## Boutique Accommodation browser

Create `v2/embeds/okanagan-treehouse.html` as a same-origin, self-contained HTML preview using real Okanagan Treehouse copy, links, and locally saved photography from the existing preview. It contains an overview hero plus Treehouse and Cabin sections. Text remains selectable. Navigation, detail links, and booking links remain genuine anchors, with external destinations opening in a new tab.

The V2 homepage browser shell contains this document in an iframe. Pointer-wheel input over the document scrolls the document naturally instead of seeking media or moving the portfolio page. The recorded showcase sources, poster fallback, frame-seeking state, and accommodation wheel handlers are removed.

Outer-page scroll still controls the authored object choreography. The browser starts with a small positive `rotateY` and `rotateZ`, then crosses through a restrained opposite angle as the section passes through view. It never lies flat, zooms aggressively, or prevents interaction with the iframe.

## Cool Runnings laptop

Replace the generic browser with a layered transparent laptop built from `assets/device-mockups/laptop-graphite-frame.png`. The screen contains the existing Cool Runnings film. The frame is split visually into a lid layer and a stationary base layer; both reuse the exact transparent PNG.

Outer-page scroll opens the lid from a compressed `rotateX` pose to an upright presentation and adds only a slight final yaw. The screen and lid move as one object. Reduced motion shows the laptop fully open. The video remains lazily loaded and visible only inside the screen aperture.

## Verification

- Static tests reject accommodation video/fallback markup and require the local iframe, real anchors, selectable HTML, the anchored About focus copy, and the layered laptop.
- Browser QA selects and copies text from the iframe, clicks an internal stay link, verifies iframe scroll without outer-page movement, and proves outer-page scroll changes browser rotation.
- Browser QA confirms the About inline clause initially matches paragraph typography and the focus copy begins on the same coordinates before its font size and weight increase.
- Browser QA confirms Cool Runnings uses the transparent frame, the lid opens as the outer page scrolls, and the existing screen film advances.
- Existing keyboard, reduced-motion, responsive-overflow, workflow-route, contact-finale, and V1-isolation checks continue to pass.
