# V2 Proposal Annotation and Outreach Handoff Design

Date: July 16, 2026

## Decision

Keep the existing working V2 proposal builder and generated-PDF contract. Refine only its presentation layer.

The four explanations become warm-paper callout boxes placed entirely in the dark margins around the proposal. Their thin hard-gold arrows terminate at the proposal edge or at the relevant edge-aligned pin; neither copy nor containers may cover the proposal image. The boxes use consistent internal padding, larger body type, stronger contrast, and left-aligned copy on both sides.

## Layout

### Desktop

- Preserve the form-left, proposal-right workspace.
- Keep the proposal as the dominant object.
- Use two 160–176px callout columns around a slightly narrower proposal.
- Give each callout `18–20px` internal padding, a quiet warm border, and an opaque warm-paper background.
- Keep the number small and gold, the title editorial and dark, and the explanation readable at approximately `13px`.
- Curved arrows start at the box edge and end before crossing into proposal content.

### Tablet and Mobile

- Keep the proposal above the explanations.
- Remove the curved paths.
- Keep the four numbered pins on the proposal.
- Render the explanations as full-width warm-paper cards with consistent `18px` padding and a readable gap between cards.

## Outreach Handoff

Add a compact section between the annotated builder and the large gold outcome statement.

The section explains that the proposal is not an isolated artifact:

1. the local prospecting and enrichment workflow identifies and reviews a relevant business;
2. the same approved business context and nearby inventory generate the tailored proposal;
3. the proposal is attached or linked inside a reviewed, personalized outreach email;
4. a salesperson reviews the recipient, copy, commercial terms, and send decision.

The visual should resemble an authored email object, not another dashboard. It includes a restrained email header, two short personalized paragraphs, a proposal attachment row, and a clear human-review note. It links to `/v2/workflows/local-prospecting-enrichment.html`.

Do not invent recipient names, claim automatic sending, expose private contact data, or change the proposal API.

## Copy

Section heading:

> Built to travel with the outreach.

Introduction:

> This proposal was one output of the local prospecting workflow: reviewed business context became a tailored email and a custom proposal a salesperson could send.

Email example:

> Hi {{business name}},
>
> We found a group of elevator screens within walking distance of your business and put together a local campaign idea using your name, category, and nearby inventory.
>
> I’ve included a tailored proposal with the creative concept, local screen count, and map.

Human-review note:

> The workflow prepared the context, draft, and attachment. A salesperson reviewed the recipient, language, offer, and final send.

## Verification

- Existing generation, blob preview, open, and download behavior still passes.
- Desktop QA asserts no callout overlaps the proposal and each callout has an opaque background with at least 18px padding.
- Mobile QA asserts the proposal remains visible, pins remain complete, and callout cards do not overflow.
- The page contains one accurate link to the local prospecting workflow and explicit human-review language.
- V1 proposal presentation files remain unchanged.
