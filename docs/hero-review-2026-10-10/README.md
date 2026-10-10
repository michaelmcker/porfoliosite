# Homepage hero framing review — October 10, 2026

Local review: http://127.0.0.1:8857/docs/hero-review-2026-10-10/

Sticky shared navigation is implemented in v2/site-header.css, with anchor clearance and resource contents below the header. No live release this session. Original hero assets and production hero CSS are unchanged.

Proposed desktop/tablet source window: x=370–1600, y=90–870 of 1672×941. Proposed portrait window: x=20–921, y=370–1550 of 941×1672. Implemented only in separate review HTML/CSS; no destructive media edits. Proposed portrait height reduces approximately 26% at the same device width.

Browser: 1440 desktop, 1024 landscape tablet, 820 portrait tablet, 390 and 320 mobile; no horizontal overflow. Homepage mobile header remains at y=0 after 633px scroll; Web Design header remains at y=0 after 1000px; resource header y=0 and contents y=110 after 2000px. Screenshot baseline/proposal pairs saved.

Repository baseline and post-change suite: 165 pass, same missing-Chrome browser failure. Three documented browser QA commands cannot launch the unavailable /Applications/Google Chrome.app executable; connected browser checks above completed instead. Source, description and existing unpublished editorial preparation preserved. Crop awaits Michael's approval before production implementation/release.
