# Portfolio Scroll Storyboard

Date: 2026-07-04  
Project: Michael McKerracher portfolio  
Status: Draft storyboard for review

## Intent

The page should feel like one continuous marketing-engineering system unfolding, not a set of disconnected sections.

The opening graphic can begin abstract, but it has to transform into recognizable artifacts as the visitor scrolls:

```text
abstract system field
  -> inputs through MM
  -> public portfolio proof
  -> workflow artifacts
  -> practical capability
```

The Three.js layer is the connective tissue. It should not remain a planet map beside every section. It should recede, compress, or become a source layer while foreground artifacts materialize from it.

## Story Structure

### Beat 1: Identity / Calm System

**Section:** Hero  
**Visitor takeaway:** This is a marketing engineer, not a generic designer.

**Frame:**

```text
Michael McKerracher              living system field
AI-enabled marketing systems     abstract, beautiful, lightly labeled
```

**Motion:**

- WebGL field is prominent.
- The `MM` node sits near the synthesis point.
- Lines and particles move slowly, but labels stay minimal.
- No artifact card appears yet.
- Cursor adds slight parallax, not a gimmick.

**Design note:** This should be the closest to the approved hero direction: warm grid, spare editorial type, restrained technical marks.

### Beat 2: Inputs Become Legible

**Section:** First scroll after hero / before portfolio fully arrives  
**Visitor takeaway:** The work starts with context, skill, brand knowledge, and APIs.

**Frame:**

```text
Context
Skills              ->     MM
Brand info
APIs
```

**Motion:**

- Left-side nodes separate from the abstract field.
- Input routes brighten one by one.
- Particles travel inward toward `MM`.
- Axis labels `Inputs / Synthesis / Outputs` become visible.

**Design note:** This is where the abstract graphic earns meaning, but it should still feel like an artful system diagram, not a dashboard.

### Beat 3: Portfolio Outputs

**Section:** Portfolio cards  
**Visitor takeaway:** The system produces real public work.

**Frame:**

```text
MM  -> Websites
    -> Sales materials
    -> Dashboards
    -> 3D + motion
```

**Motion:**

- The field shifts right, following the portfolio cards.
- Output nodes pull forward.
- Project cards remain the main content.
- No workflow artifact overlay yet.

**Content shown:**

- Cool Runnings
- RCCV
- Okanagan Treehouse, as a planned hosted Claude demo
- Public Vertical Impression positioning

**Design note:** Keep this portfolio-first. Do not bury the projects under workflow explanation.

### Beat 4: Proof Compression

**Section:** Successes / proof  
**Visitor takeaway:** Results are handled cautiously and separately from estimates.

**Frame:**

```text
Outputs collapse into proof markers
```

**Motion:**

- Routes dim.
- Output nodes compress toward the proof area.
- The graph becomes quieter and more ledger-like.
- Proof claims on the left carry the narrative.

**Content rule:**

- Only use source-safe claims.
- If a metric is not verified enough for public use, keep it as draft copy or anonymized wording.

### Beat 5: Workflow Intro / System Reopens

**Section:** `How the work gets made`  
**Visitor takeaway:** The real differentiator is the repeatable process.

**Frame:**

```text
portfolio output nodes
  -> reopen into workflow paths
```

**Motion:**

- The compressed proof state expands again.
- Workflow nodes move forward.
- The graph becomes less about projects and more about how the work is produced.
- Still no heavy overlay until the first workflow card.

## Workflow Artifact Sequence

### Beat 6: JSON Prompt To Image

**Section:** JSON prompt to ImageGen output  
**Visitor takeaway:** AI image output is directed through specific, reviewable choices.

**Frame:**

```text
graph recedes
foreground card appears:

JSON prompt  ->  generated person/product image
```

**Motion:**

- The camera zooms into one active dot on the workflow field.
- That dot becomes the origin point for the JSON prompt artifact.
- WebGL opacity drops only after the zoom lands.
- The `Prompt to image` route remains visible as a thin trace behind the card.
- A paper artifact card materializes from the enlarged dot.
- Card enters with a slight 3D tilt, then settles flat.
- The generated image is the visual anchor.

**Content shown:**

- Shirt color
- Headphones
- Coffee cup
- Negative space
- Hard bans / review gate

**Design note:** This should look like a creative direction artifact, not a code sample pasted on a page.

### Beat 7: Image Direction To Website

**Section:** Image to design to website  
**Visitor takeaway:** Generated design directions become implementation rules and a real build.

**Frame:**

```text
prompt
  -> image round
  -> scorecard
  -> code
  -> QA
```

**Motion:**

- The camera zooms back out from the prompt/image dot.
- The system does not return to the full graph. It resolves onto one branch: the website branch.
- Prompt/image card slides away or dissolves into a pipeline plate attached to that branch.
- The WebGL `Websites` output node becomes the active endpoint.
- Step boxes draw left to right along the branch.
- Route particles move across the steps instead of orbiting.

**Design note:** This is where an image-generation pipeline, Taste decomposition, code, and responsive QA become one story.

### Beat 8: Research To Content System

**Section:** SEO content at scale  
**Visitor takeaway:** Content is not just generated; it is researched, structured, checked, and handed off.

**Frame:**

```text
SERP
  -> Keywords
  -> Brand archive
  -> Draft
  -> Audit
```

**Motion:**

- The view stays on a single branch instead of returning to the whole graph.
- The website branch splits into a content branch.
- SERP and keyword nodes pulse on the left edge of that branch.
- The website plate compresses into narrower research columns.
- The route moves through each content step.
- The background graph should look more like a research map than a solar system.

**Content shown:**

- Brain SERP research
- Keyword research
- Existing brand/blog archive
- Outline and draft
- AI-content and brand checks
- Drive or CMS handoff

### Beat 9: Deploy Presentation / Sales Link

**Section:** HTML artifact to Webflow/Vercel sales link  
**Visitor takeaway:** Internal AI-made artifacts become usable sales assets.

**Frame:**

```text
HTML artifact
  -> password gate
  -> Vercel page
  -> Webflow CMS
  -> publish
  -> tracking row
```

**Motion:**

- The camera pans across the system from the workflow branch to the output side.
- Content pipeline recedes into the background.
- A sales-materials output route lights up.
- The deploy artifact appears on the output side, not in the center of the system.
- The artifact plate feels more like a deployment conveyor.
- Steps tighten, because this is operational rather than creative.

**Content rule:**

- Use a fake or redacted presentation title.
- Do not expose private company examples unless explicitly cleared.

### Beat 10: AI Enablement

**Section:** Custom MCTs / MCPs, skills, training  
**Visitor takeaway:** The work becomes team capability, not one-off output.

**Frame:**

```text
Need
  -> MCT / MCP
  -> Skill
  -> Training
  -> Output
```

**Motion:**

- The deploy plate stays on the output side and hands off to the enablement plate.
- The camera remains output-side rather than returning to the middle.
- The system field calms down.
- Nodes stop behaving like deliverables and start behaving like reusable capabilities.
- This should feel like the conclusion of the workflow sequence.

## Motion Grammar Revision

The animation should use three distinct camera moves:

1. **Zoom in on a dot**
   - Used for JSON prompt to image.
   - The viewer enters a single workflow node.
   - Best for showing detailed creative direction, prompt structure, and generated image output.

2. **Zoom out onto one branch**
   - Used for image-to-website and research-to-content.
   - The full system is not shown again.
   - The viewer follows one branch as it becomes a practical production pipeline.

3. **Pan to the output side**
   - Used for deploy presentation and AI enablement.
   - These are not input/research workflows; they are output-side operationalization.
   - The visual should feel like finished artifacts becoming usable by sales or teams.

## Closing Direction

The final page should end with the system resolved:

```text
Marketing engineer
who can research, plan, build, validate, deploy, and train others
using AI without giving up taste or quality control.
```

The page should not over-explain. The motion should do some of the explanatory work.

## Implementation Implications

1. Keep the WebGL field as the base layer.
2. Add a foreground artifact layer for workflow-specific objects.
3. Use scroll progress to crossfade and transform:
   - WebGL prominent in hero and portfolio.
   - WebGL subdued behind artifact plates in workflow sections.
   - Artifact plates become the clear foreground after proof.
4. Avoid making every section dense. The workflow cards can stay sparse if the right-side motion tells the process.
5. For Awwwards-style polish, the next version needs intermediate transition frames, not only final states:
   - node route stretches into a card edge
   - particle becomes a pipeline step
   - output node becomes artifact header dot
   - graph compresses into a paper/spec object

## Open Decisions

1. Should the right-side artifact cards become full-width overlays on desktop for the workflow sequence, or stay contained inside the sticky motion panel?
2. Should the workflow sequence use real generated images for each artifact, or should it use HTML/CSS plates that can animate precisely?
3. Should Okanagan Treehouse get a lightweight Claude-demo landing page before the rest of the portfolio is finalized?
