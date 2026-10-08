# AEO resource library release — 2026-10-08

## Published

- Live collection: https://michaelmck.site/blog/
- Twelve articles: three city guides, five practical checklists, three provider comparisons and one Cool Runnings case study.
- Every article has a direct summary immediately after its H1, numbered or clearly structured sections, named author, publication date, sources, related pages and three visible specific FAQs.
- Michael is included in all three owned provider comparisons. Selection is explained as project fit and authorship is visible; no independent award or ranking claim.
- BlogPosting, Person, BreadcrumbList and FAQPage schema; appropriate ItemList schema; Markdown alternates; sitemap and LLM discovery updated together.
- Existing homepage, services and industry collection link to Resources. Private Field Notes and retired articles remain protected.

## Production evidence

- GitHub main source commit: `94cfa2e6a5d07acf43ffff8492e8993ec13019b0`.
- Vercel production deployment: `dpl_BQZqYKaWVgkGJZwBFbMGd77Mkezz`.
- Deployment URL: https://portfolio-remote-preview-pms9r709u-michael-mcks-projects.vercel.app
- Ready and aliased to michaelmck.site, verified October 8, 2026.
- `live-verification.json`: 40 public HTML, Markdown, style, image and discovery resources returned successfully and matched local bytes. All 13 content-negotiated Markdown routes returned the correct body and content type.
- Live desktop library/comparison and mobile service checklist inspected. No observed horizontal overflow or broken images. Screenshots saved alongside this report.
- Vercel error-log lookup for this deployment, previous 10 minutes: no logs returned. This is not a claim of complete historical error coverage.

## Search submission

The updated https://michaelmck.site/sitemap.xml was submitted in Google Search Console after publication. Google displayed “Sitemap submitted successfully”. The existing table still showed a last-read date of October 5 and eight discovered pages, so no new article is claimed indexed. Submission proof is saved in `sitemap-submitted.png` and `sitemap-submitted.txt`.

## Validation

- Repository test suite: 149 pass, one pre-existing browser launch failure due to the missing Google Chrome executable. The same failure occurred before changes.
- Three broader browser scripts hit that same absent executable. Responsive validation instead used the connected browser.
- 52 local route/viewport checks: 13 routes at 1440, 768, 390 and 320 pixels; no page, text or table overflow and no observed image errors.
- Three FAQ answers per article matched visible text and JSON-LD. Source/root parity, internal paths and anchors, required source references, comparison inclusion and discovery checked.
- Twenty-one external source URLs checked: 17 direct HTTP 200; four command-line bot restrictions verified through browser or web reader. See `external-link-check.json`.
- Resource regeneration was idempotent; whitespace checks passed.
- Editor gate: PASS, see `EDITOR-REVIEW.md`.

## Scope and limitations

The pages are live and crawlable. Google indexing, rankings, AI citations and conversions are not established by deployment or sitemap acceptance. Provider comparisons are Michael’s fit-based recommendations based on reviewed public service descriptions. Cool Runnings’ 30% result means qualified bookings, not revenue; no unsupported measurement period or isolated causal test is asserted.
