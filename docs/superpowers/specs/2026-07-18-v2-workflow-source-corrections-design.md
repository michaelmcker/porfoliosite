# V2 Workflow Source Corrections

## Scope

Revise three V2 workflow stories without changing the approved workflow-art direction, accordion behaviour, detail-page layout, Content workflow, or Agency Dashboard.

The existing generated desktop artwork remains the composition reference for each workflow. Revised desktop images keep the same black-canvas, off-white artifact-card, realistic-interface, tool-logo, and coloured-route language. Revised mobile images are generated from the corrected desktop image as purpose-built portrait compositions.

## Presentation Publishing

The workflow begins before deployment. A sales team creates a branded HTML presentation using the company design system, customer branding, maps, and custom graphics. The approved HTML artifact then enters the existing Cloud Scale Deploy pipeline.

Required visual sequence:

1. Sales brief and customer brand inputs.
2. Design-system components, including typography and layout rules.
3. Maps and custom graphics.
4. Branded HTML presentation artifact.
5. Cloud Scale Deploy at `/deploy/presentation`.
6. Vercel API deployment and hosted URL.
7. Webflow API, duplicate-name validation, and iframe CMS-field write.
8. Webflow publication and returned link.

The visual must not imply that Google Slides is the authoring source or that the publishing workflow authors customer content without sales-team review.

## Local Prospecting and Enrichment

Apollo is an explicit enrichment source and should appear with its recognizable logo. The enriched business record and matched nearby inventory feed the real custom-proposal artifact used elsewhere in the portfolio.

The proposal must read as a generated PDF, not a generic card. It visibly contains:

- a local map;
- the dynamic nearby-screen count;
- customer-specific copy;
- a custom graphic or generated image;
- nearby inventory and campaign framing.

The proposal becomes an attachment to personalized outreach. A sales owner reviews the record, recipient, email, proposal, and offer before an approved send. The final state may show the outreach package as sent, but must not imply unreviewed automatic sending.

## Image-to-Website Production

The Visual Direction stage must communicate breadth before selection. It generates many hero-section directions and multiple mood boards rather than a small generic image contact sheet.

Required visual-direction artifacts:

- a dense `HERO EXPLORATIONS` board showing materially different hero compositions;
- a `MOOD BOARDS` board showing typography, colour, imagery, and material direction;
- a human `DIRECTION REVIEW` that selects and annotates a direction;
- the chosen direction converging with source facts into the live HTML proof.

The downstream proof, approval, `DESIGN.md`, HTML style guide, scale, lint, human review, and publishing sequence remains unchanged.

## Copy and Documentation

Update the three workflow detail pages, the workflow-art prompt manifest, `AGENTS.md`, `DESIGN.md`, and `docs/portfolio-working-notes.md` so the corrected stages become durable source truth. Remove statements that Presentation Publishing only receives a pre-existing presentation.

## Verification

- Desktop assets remain landscape; mobile assets remain portrait.
- All six revised images load through the existing responsive `<picture>` elements.
- Required source-truth phrases appear in tests and documentation.
- Content desktop and both Dashboard files retain their locked hashes.
- Repository tests and V2 browser QA pass.
