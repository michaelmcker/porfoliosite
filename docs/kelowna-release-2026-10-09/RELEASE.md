# Kelowna service page and discovery release

Date: October 9, 2026
Production commit: `ecc7a53`
Vercel deployment: `HFbWthuXYBQQp7H29HFNwJmrLg7c`
Live page: https://michaelmck.site/web-design/

The existing page now explains website deliverables, platform decisions, ownership, training, search foundations and enquiry handling. Six practical FAQs share content with structured data and agent Markdown. The original hero, project imagery and design remain. Cool Runnings proof correctly describes 30% more qualified bookings.

## Verification

- Ten changed public resources match the local build exactly.
- All 41 sitemap pages return HTTP 200, declare matching canonicals and have no noindex directive.
- Homepage navigation/footer links to the three services, Contact, Resources and Kelowna guide. Web Design links to the industry index and supporting guide.
- Markdown negotiation works for all three services, Contact and Resources.
- Desktop/mobile checks at 1440, 768, 390 and 320 pixels: no horizontal overflow or observed missing images. Native FAQ expansion and enquiry link work.
- 156 tests pass; the sole failure is the unchanged baseline test requiring an absent Chrome executable. The connected browser provided responsive verification.

## Google submissions

All eight URLs received the confirmed “Indexing requested” priority-crawl response:

| URL | State before the request |
| --- | --- |
| https://michaelmck.site/ | Already indexed; recrawl requested |
| https://michaelmck.site/web-design/ | Discovered, currently not indexed |
| https://michaelmck.site/ai-implementation/ | Discovered, currently not indexed |
| https://michaelmck.site/marketing-branding/ | Unknown to Google |
| https://michaelmck.site/contact/ | Unknown to Google |
| https://michaelmck.site/blog/ | Unknown to Google |
| https://michaelmck.site/web-design/industries/ | Discovered, currently not indexed |
| https://michaelmck.site/blog/kelowna-business-website-guide/ | Unknown to Google |

The updated sitemap was successfully resubmitted on October 9. The follow-up API response records submission at 13:56 UTC, pending processing, zero errors and warnings. Its older downloaded inventory reports 36 URLs; the current public sitemap has 41. Submission is not indexing confirmation.

The working owner connection is gsc_abc for read-only checks. Its OAuth scope cannot submit; the existing signed-in Search Console owner UI completed submission. Other connectors do not have verified owner access to this domain.

No advertisements, fees, review requests or outreach messages were sent. No new publishing automation was created.

## Evidence

Machine-readable checks are in `live-verification.json`, `discovery-links.json` and `qa.json`.

Durable screenshots and test logs:
`/Users/michaelmckerracher/Business Research/website-market-2026-10-07/docs/2026-10-09-kelowna-release/`

The Web Design screenshot `web-design-indexing-requested.jpg` shows the exact URL, the accepted request and its still-unindexed state. Each other accepted request and the sitemap confirmation have separate screenshots.
