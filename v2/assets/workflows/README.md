# V2 Workflow Artwork Source Truth

These workflow diagrams are image-generated portfolio artwork. Do not recreate them with HTML, CSS, SVG, Mermaid, or a shared flowchart renderer.

## Visual reference

`content-production-approved-desktop.png` is the exact approved style reference.

- SHA-256: `8df1ac85b4813445e5ffd836efcd8cce380a945b2a2e315fcead1c297bb1932b`
- Preserve byte-for-byte.
- Visual grammar: pure black canvas; warm off-white, realistic interface cards; recognizable tool marks; thin blue, green, red-orange, white, and amber routes; small junction dots; subtle depth; dense but legible workflow-specific composition.
- Shared style does not mean shared topology. Each workflow must express its real stages and branching structure.

`agency-dashboard-desktop.png` and `agency-dashboard-mobile.png` are byte-for-byte copies of the prior real dashboard at `assets/screens/fountainhead-ai-visibility-dashboard-v3.png` (SHA-256 `83d00ae1a5ff5746925a3e350de7b8de98c39404a4b5b68e514394631fe1f7ae`). It preserves `Keyword Content`, `Client Notes`, the visibility trend, content queue, source health, delivery-review queue, and opportunity panels. Do not regenerate it or replace it with a conceptual flowchart. The dashboard is the exception to the separate-composition rule: both production sizes intentionally use the same real source screenshot.

`references/apollo-brand-reference.png` is the supplied current Apollo identity. Local prospecting artwork uses the exact supplied black radial starburst and black `Apollo` wordmark on its fluorescent-yellow brand plaque. Do not restore the older triangular mark or redraw the supplied identity generatively.

## Production assets

| Workflow | Desktop | Mobile |
| --- | --- | --- |
| Search-optimized content | `content-production-approved-desktop.png` | `content-production-approved-mobile.png` |
| Agency dashboard | `agency-dashboard-desktop.png` | `agency-dashboard-mobile.png` |
| Presentation publishing | `presentation-publishing-desktop.png` | `presentation-publishing-mobile.png` |
| Local prospecting | `local-prospecting-desktop.png` | `local-prospecting-mobile.png` |
| Image-to-website | `image-to-website-desktop.png` | `image-to-website-mobile.png` |

Except for the recovered real dashboard, desktop and mobile are separate image-generation compositions. Mobile is a portrait reflow, not a crop or scaled desktop export.

## Search-content mobile selection

Candidate C was approved on 2026-07-18 and promoted byte-for-byte to `content-production-approved-mobile.png` (SHA-256 `46438ba3988c02c2d488ea8a75bd45fc1e8e6a68d9baa3accf58feada86dba7a`). It uses four discrete, poster-like chapter boards for Research, Human-Guided Production, Review, and Output.

| Candidate | File | Composition |
| --- | --- | --- |
| A | `candidates/content-mobile-a-editorial-stack.png` | Four editorial stage stacks with larger cards and a familiar chapter hierarchy |
| B | `candidates/content-mobile-b-staggered-spine.png` | Alternating cards around one continuous process spine |
| C — approved | `candidates/content-mobile-c-chapter-boards.png` | Four discrete, poster-like chapter boards |

## Generation method

Use the built-in image-generation tool in reference-image mode. Attach the approved Content desktop image for every new desktop workflow. For a mobile adaptation, attach the corresponding generated desktop workflow and ask for a purpose-built portrait re-composition.

The site supplies workflow titles outside the artwork, so generated diagrams must not add a giant page title.

## Prompt set

All prompts begin with:

> Use case: infographic-diagram. Input image: the approved Search-Optimized Content Production image is the strict style reference. Match its premium generated infographic language: pure black canvas, warm off-white floating UI cards, recognizable real tool logos, realistic miniature browser/API/CMS/table/document surfaces, thin precise cobalt-blue, green, red-orange, white and amber connector paths, small junction dots, restrained soft shadows, and technical lane labels. Create workflow-specific topology rather than copying the reference grid. Use compact modern sans-serif labels. No pastel or beige overall canvas, giant title, uniform numbered tiles, generic flowchart, blank cards, watermark, fictional integrations, or unreadably small required labels.

### Search-optimized content — mobile

Create a portrait re-composition of the approved desktop workflow with four vertical chapters: RESEARCH; HUMAN-GUIDED PRODUCTION; REVIEW; OUTPUT. Required modules: LINEAR TASKS; Google; DataForSEO; Firecrawl; Perplexity; BRAND RULES; BRIEF; OUTLINE; DRAFT; AUDIT (E-E-A-T & QUALITY CHECK); HUMAN REVIEW & APPROVAL; Google Drive; PUBLISHED ARTICLE; Shopify. Retain representative interface detail, staggered cards, branching and merging routes, and generous black separation. Do not merely shrink the desktop image.

### Presentation publishing — desktop

Create four horizontal zones: SALES AUTHORING; VERCEL DEPLOYMENT; WEBFLOW CMS; PUBLISHED OUTPUT. The first zone shows a sales brief and CUSTOMER BRAND feeding approved DESIGN SYSTEM components plus MAPS + CUSTOM GRAPHICS into a BRANDED HTML PRESENTATION. That reviewed artifact enters Cloud Scale Deploy at `/deploy/presentation`; route it through Vercel API and DEPLOYED PRESENTATION URL, then Webflow API, VALIDATE PAGE NAME, WRITE URL TO IFRAME CMS FIELD, PUBLISH WEBFLOW SITE, and RETURN PUBLISHED LINK. Use a realistic HTML-presentation browser rather than Google Slides. Do not add password or duplicate verification stages.

### Presentation publishing — mobile

Using the generated Presentation desktop image as the exact reference, stack the same four zones vertically. Preserve SALES AUTHORING with CUSTOMER BRAND, DESIGN SYSTEM, MAPS + CUSTOM GRAPHICS, and the BRANDED HTML PRESENTATION before Cloud Scale Deploy `/deploy/presentation`; then preserve Vercel API, deployed URL, Webflow API, page-name validation, iframe CMS field, site publication, published page, and returned link. Keep the Vercel and Webflow marks and realistic HTML-presentation/API/CMS surfaces. Do not merely shrink the desktop image.

### Local prospecting — desktop

Create five zones: DISCOVERY; APOLLO ENRICHMENT; INVENTORY MATCH; PROPOSAL + OUTREACH; HUMAN HANDOFF. Required modules: GOOGLE MAPS DISCOVERY; PUBLIC BUSINESS SIGNALS; FIRECRAWL; Apollo logo and enrichment interface; ENRICHED WORKING RECORD; MAPBOX; NEARBY SCREEN INVENTORY; DISTANCE + FIT; CUSTOM PROPOSAL PDF; PERSONALIZED EMAIL with visible PDF attachment; SALES REVIEW; APPROVED SEND. The proposal PDF must visibly contain a local map, dynamic screen count, customer-specific copy, and a custom graphic or generated image. Converge discovery and Apollo into the record, match inventory, generate the real proposal artifact, attach it to outreach, and gate the send behind sales review. Do not imply unreviewed automatic sending.

### Local prospecting — mobile

Using the generated Local Prospecting desktop image as the exact reference, stack its five zones vertically. Preserve Google Maps, Firecrawl, the Apollo logo and enrichment card, Mapbox, detailed evidence, inventory, CUSTOM PROPOSAL PDF with local map and custom creative, personalized email with the PDF attached, SALES REVIEW, and APPROVED SEND. Use staggered cards and visible branching and merging routes. Do not merely shrink the desktop image or imply unreviewed automatic sending.

### Image-to-website — desktop

Create five zones: RESEARCH; VISUAL DIRECTION; PROOF & APPROVAL; DESIGN SYSTEM; PRODUCTION & PUBLISH. Required modules: COMPETITOR + BEST-IN-CLASS RESEARCH; FIRECRAWL; SOURCE FACTS; a dense HERO EXPLORATIONS board with many materially different website hero sections; multiple MOOD BOARDS covering typography, colour, imagery, composition, and material direction; DIRECTION REVIEW with annotations and selected states; LIVE HTML PROOF; HUMAN APPROVAL; DESIGN.md; HTML STYLE GUIDE; SCALE FULL SITE; LINT AGAINST DESIGN.md; HUMAN DESIGN REVIEW; PUBLISHED WEBSITE. Branch research into broad visual exploration, converge the selected direction and source facts in a realistic live HTML proof, require human approval, branch to `DESIGN.md` and the HTML style guide, then scale and lint before human review and publication.

### Image-to-website — mobile

Using the generated Image-to-Website desktop image as the exact reference, stack its five zones vertically. Preserve the research evidence, dense HERO EXPLORATIONS board, multiple MOOD BOARDS, annotated DIRECTION REVIEW, live HTML proof, approval gate, `DESIGN.md`, HTML style guide, scaled site, lint gate, human design review, and published website. Retain the branching and convergence logic and do not merely shrink the desktop image.

## Review gate

Before wiring a generated image:

1. Confirm the required labels and tools are visible.
2. Confirm the topology matches the actual workflow.
3. Confirm desktop is landscape and mobile is portrait.
4. Confirm cards remain readable in the V2 accordion and detail page.
5. Keep the approved Content desktop and both recovered Dashboard files unchanged.
