# Portfolio Motion And Site Plan

Date: 2026-07-03  
Project: Michael McKerracher portfolio / resume site  
Status: Draft for review

## Core Direction

The site should feel like an award-level portfolio, not a dashboard. The first screen should be spare, confident, and visually memorable: Michael McKerracher, Marketing Engineer, with one living marketing-workflow artifact that implies synthesis, judgment, execution, and proof.

Marketing Engineer is the primary framing because it connects the strongest job market language with the actual work: positioning, websites, GTM, content systems, sales enablement, AI workflows, dashboards, and measurable outcomes.

The motion should not explain everything immediately. It should begin as an impressive abstract marketing workflow system, then become more legible as the visitor scrolls. The page should move from identity to workflow synthesis to proof to case studies.

The central idea:

```text
Research + planning + context + APIs
        flow into
Michael as the synthesis point
        producing
websites + sales materials + dashboards + interactive web systems
```

Do not use labels like "content library" or "retail library" in the hero. Those are internal nouns. The hero should communicate what a hiring manager or client actually needs to understand: research and context come in, judgment transforms it, AI accelerates execution, validation keeps it sharp, and useful marketing surfaces come out.

## Recommended Structure

Use a one-page homepage with deep scroll choreography, plus sparse subpages for proof.

The homepage should not try to explain every project. It should sell the shape of the work quickly and then let interested people click deeper.

### Homepage Sections

1. **Hero / Identity**
   - Large name and role.
   - One living 3D/2D system field.
   - Minimal copy.
   - No selected-works panel inside the first viewport.

2. **Synthesis Field**
   - The hero artifact expands or pins briefly.
   - Inputs resolve into a small number of meaningful labels:
     - Context
     - Skills
     - Brand systems
     - APIs / data
   - Michael is shown as the focal point, preferably through `MM`, a central dark node, or a subtle coordinate mark rather than a long label.
   - Outputs resolve on the right:
     - Websites
     - Sales materials
     - Dashboards
     - Interactive systems

3. **Proof Strip**
   - Short, restrained proof claims.
   - Use metrics only when privacy-safe and sourceable.
   - Motion: the output nodes settle into proof cards or ledger rows.

4. **Selected Work**
   - Three or four cards max on the homepage.
   - Cool Runnings, RCCV, Treehouse, and public Vertical Impression positioning can appear here.
   - Each card should feel like a portfolio piece, not a CRM dashboard tile.

5. **Systems / Workflows**
   - A short index of deeper system pages.
   - This is where explanatory SVG diagrams belong.
   - The blog/content engine, proposal/map system, deploy-presentation workflow, and dashboards can be shown here.

6. **Contact / Resume Layer**
   - Compact availability and contact.
   - Link to resume PDF or downloadable proof pack later.

## Animation Philosophy

The animation should be impressive because it is choreographed, not because every object moves.

Use three levels of motion:

1. **Ambient motion**
   - Always-on, quiet.
   - Slow particle travel.
   - Gentle orbiting rings.
   - Fine route shimmer.
   - Cursor parallax on the hero field.

2. **Scroll-state motion**
   - The primary award-level effect.
   - The hero artifact changes meaning as the visitor scrolls.
   - Lines that are abstract in the hero become directional flows in the synthesis section.
   - Output points become proof cards or project links.
   - Grid lines, measurement marks, and labels fade in only when needed.

3. **Interaction motion**
   - Hovering a node should pull the related routes forward.
   - Project cards should distort, reveal, or scrub a small screenshot rather than simply lift with a shadow.
   - Links should feel tactile but restrained.

The motion should never create a dense dashboard. The site should feel editorial, precise, and technical.

## Hero Graphic Redesign

The current Three.js prototype is useful as a test, but the content model is wrong.

Replace the current node taxonomy with:

### Inputs

- Context
- Skills
- Brand information
- APIs / data

Optional secondary input labels can appear later on scroll, not in the opening hero:

- SEO / SERP data
- Google APIs
- Shopify
- CRM / sales context
- Design systems
- Existing content

### Focal Point

The center should not say "Marketing Engineering" across the graphic. That phrase belongs in the page copy.

Possible center treatments:

- `MM`
- `Michael`
- a black coordinate node with no text
- a small label below the node: `synthesis`

Recommended: use a central dark node with a tiny `MM` label that only appears on hover or after scroll.

### Outputs

- Websites
- Sales materials
- Dashboards
- Interactive systems

Optional proof labels appear after the output transition:

- Rankings
- AI sales lift
- Proposal velocity
- Search visibility

## Scroll Choreography

The strongest approach is a pinned hero field with three scroll states.

### State 1: Identity

The first viewport is calm.

Visual:

```text
Michael McKerracher                 abstract moving field
Marketing Engineer                  no explanatory clutter
```

The artifact is mostly unlabeled. It suggests capability and taste.

### State 2: Synthesis

As the user scrolls, the field pins briefly.

Visual:

```text
Context        \
Skills          \
Brand info       ->   MM / synthesis   ->   Websites
APIs / data     /                         ->   Sales materials
                                           ->   Dashboards
                                           ->   Interactive systems
```

Labels appear as if they are annotations on a working drawing.

### State 3: Proof

The output nodes drift downward and become the next section.

Visual:

```text
Websites            Cool Runnings / RCCV / Treehouse
Sales materials     public positioning + sanitized private workflows
Dashboards          proof loops, reporting, AI visibility
Interactive systems Three.js, SVG, content engines, proposal tools
```

This is where the site should transition from art object to portfolio.

### State 4: Pipeline Merge

The initial hero graphic should not simply end. It should travel down the page as the visitor scrolls and merge into more specific graphics.

Concept:

```text
Hero workflow field
  -> output nodes separate
  -> nodes attach to proof / pipeline modules
  -> each module becomes a deeper visual story
```

The hero system becomes the spine of the page. Instead of separate disconnected sections, the visitor feels one marketing-engineering system unfolding:

- the `image / prompt` output becomes the JSON prompt-to-image visual
- the `website` output becomes the image-to-website pipeline visual
- the `sales material` output becomes proposal/deck/deploy workflow proof
- the `dashboard` output becomes measurement and AI visibility proof
- the `enablement` output becomes custom MCTs / MCPs, reusable skills, and team training proof

This is the strongest Awwwards-style opportunity: one animated artifact persists, changes roles, and turns abstract capability into concrete examples.

## Page-Level Motion System

Use a motion system with a few recurring motifs:

- **Routes:** curved lines that connect inputs to outputs.
- **Travelers:** small dots that move along routes and pulse at decision points.
- **Measurement frames:** dashed rectangles, crop marks, and coordinate ticks.
- **Reveals:** labels appear like annotations, not like app UI badges.
- **Morphs:** hero nodes become cards, section numbers, or diagram anchors.
- **Scrubs:** project screenshots reveal on hover through a mask or clipped plane.

Avoid:

- neon
- dark sci-fi surfaces
- dashboard charts in the hero
- over-labeling
- generic floating cards
- heavy button animations that promise an interaction the page does not deliver

## Philosophy Layer

The portfolio needs one clear philosophy running through every project and system page:

```text
AI does not replace taste.
AI expands exploration and execution.
Humans bring judgment, reference, taste, planning, review, and iteration.
```

The site should make this concrete rather than philosophical. Each system should show the same operating loop:

```text
research
  -> plan
  -> AI executes
  -> human validates
  -> AI deploys
  -> measure / learn
  -> next cycle
```

This is the core cycle. It should appear in the hero motion and repeat on system pages in more specific forms.

```text
Research -> Plan -> AI Execute -> Human Validate -> AI Deploy -> Learn
```

This can become the recurring visual motif: messy context enters the system, planning organizes it, AI accelerates production, human review validates taste and correctness, AI handles deployment/handoff, and measurement feeds the next cycle.

The important positioning:

- AI is not shown as magic.
- The human role is not reduced to "prompting."
- The value is judgment applied to faster research, planning, production, deployment, QA, and iteration.
- The work is strongest where taste, research, technical systems, and marketing outcomes meet.

## Skill Lanes

The site should present the work through a few clear skill lanes rather than a long undifferentiated list.

1. **Marketing workflows**
   - Research, planning, AI execution, human validation, AI deployment, measurement, and iteration.

2. **Websites and public surfaces**
   - Portfolio sites, client sites, positioning pages, content systems, and live public work.

3. **Sales enablement and GTM**
   - Proposal systems, deploy-presentation workflows, local-market materials, dashboards, and proof loops.

4. **AI enablement**
   - Custom MCTs / MCPs, reusable skills, workflow training, prompt systems, team handoff, and operating guidance.

AI enablement should be shown as capability-building, not as generic "AI consulting." The stronger language is:

```text
I build the systems, skills, and training that let teams use AI without losing taste, quality control, or operational discipline.
```

## Hero Subject

The hero is not "Agency OS" and not a literal blog diagram. The hero subject is:

```text
Marketing workflows built by a marketing engineer.
```

The first-frame graphic should feel like a WebGL/Three.js marketing workflow engine:

- inputs enter as research, context, brand information, audience signals, and APIs
- the focal point is Michael / `MM` as the synthesis point
- the loop shows AI execution, human validation, and AI deployment
- outputs resolve into websites, sales materials, dashboards, and interactive systems
- enablement resolves into custom MCTs / MCPs, skills, training, and playbooks
- the system keeps moving so the page feels alive and workable

The WebGL animation should make the portfolio feel capable, current, and tactile. It should not become a sci-fi dashboard or a literal org chart.

## Technical Approach

### Three.js

Use Three.js for the homepage hero/synthesis artifact only.

Best uses:

- node field
- route curves
- cursor parallax
- particles traveling through curved paths
- central focal point
- scroll-state transitions
- subtle depth, not full 3D spectacle

Do not use Three.js for literal workflow explanations. Those should be HTML/SVG where labels and accessibility matter.

### GSAP Or Scroll Timeline

Use a timeline to control the hero transitions.

GSAP is the safest fit if available because the desired effect is choreography:

- pin hero field
- scrub route positions
- fade labels in by scroll progress
- transform output nodes into the next section
- respect reduced motion

If we avoid GSAP, use IntersectionObserver plus CSS variables, but the animation will be less precise.

### SVG / HTML Diagrams

Use SVG and HTML for the system pages:

- Content engine
- Local proposal/map workflow
- Deploy-presentation workflow
- Dashboard/proof loop

These pages should be legible and shareable. They can still animate, but their job is explanation.

## Low-Fidelity Wireframes

### Homepage

```text
┌────────────────────────────────────────────────────────────┐
│ MM                         Work  Systems  Resume  Contact  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Michael McKerracher             [living synthesis field]   │
│ Marketing Engineer                                        │
│ short positioning line                                     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ pinned synthesis field                                     │
│ Context / Skills / Brand / APIs -> MM -> Outputs           │
├────────────────────────────────────────────────────────────┤
│ proof strip                                                │
│ $200M+ ecommerce context | AI sales lift | ranking proof    │
├────────────────────────────────────────────────────────────┤
│ selected work                                              │
│ Cool Runnings | RCCV | Treehouse | Public VI positioning    │
├────────────────────────────────────────────────────────────┤
│ systems                                                    │
│ Content engine | Proposal system | Deploy presentation      │
│ Image/video/design pipelines                               │
├────────────────────────────────────────────────────────────┤
│ contact / resume                                           │
└────────────────────────────────────────────────────────────┘
```

### Project Page

```text
┌────────────────────────────────────────────────────────────┐
│ project title + role + live link                           │
├────────────────────────────────────────────────────────────┤
│ large screenshot / interaction preview                     │
├────────────────────────────────────────────────────────────┤
│ problem | build | outcome                                  │
├────────────────────────────────────────────────────────────┤
│ proof / screenshots / privacy-safe notes                   │
├────────────────────────────────────────────────────────────┤
│ next project                                               │
└────────────────────────────────────────────────────────────┘
```

### System Page

```text
┌────────────────────────────────────────────────────────────┐
│ system title + what it solves                              │
├────────────────────────────────────────────────────────────┤
│ animated SVG process diagram                               │
├────────────────────────────────────────────────────────────┤
│ why it was built | what it does | example output            │
├────────────────────────────────────────────────────────────┤
│ privacy-safe artifacts / redacted screenshots               │
└────────────────────────────────────────────────────────────┘
```

### Pipeline Visual Page

This page should show the AI-enabled creative and web-production workflows as real operating systems, not just aesthetic diagrams.

```text
┌────────────────────────────────────────────────────────────┐
│ AI + human taste philosophy                                │
├────────────────────────────────────────────────────────────┤
│ research -> references -> plan -> explore -> build -> review│
├────────────────────────────────────────────────────────────┤
│ JSON prompt / manifest overlay                             │
│ left: structured prompt                                    │
│ center: model / generation stage                           │
│ right: selected image/video/site output                     │
├────────────────────────────────────────────────────────────┤
│ website design pipeline                                    │
│ full-page image prompt -> scorecard -> selected design      │
│ -> image-to-code extraction -> implementation -> QA         │
├────────────────────────────────────────────────────────────┤
│ video pipeline                                             │
│ recipe -> visual law -> motion grammar -> candidates        │
│ -> human approval -> continuation -> stitch                 │
└────────────────────────────────────────────────────────────┘
```

## AI Pipeline Visual Modules

These are strong candidates for rich visuals and subpages.

### 1. JSON Prompt To Image

Show a structured prompt as a living object, not a code block.

Visual concept:

```text
{
  "audience": "hiring manager / founder / marketing lead",
  "reference_roles": ["style", "structure", "content"],
  "visual_law": "warm editorial grid",
  "hard_bans": ["dashboard clutter", "generic AI look"],
  "review_gate": "human taste"
}
        -> generation field
        -> selected image / rejected variants / notes
```

Motion:

- JSON keys light up in sequence.
- Selected fields draw routes into the generated visual.
- Rejected candidates fade into the background as a contact sheet.
- The approved output remains in focus with a human review annotation.

Purpose:

This shows that prompting is structured direction, constraints, review criteria, and taste. It is not a one-line magic trick.

This can receive one of the output nodes from the hero. The node lands on the JSON panel, opens into structured prompt fields, then routes into generated image candidates and the selected output.

### 2. Website Image To Design To Website

This should explain the website design system:

```text
full-page design prompt
  -> generated website image rounds
  -> scorecard / critique
  -> selected direction
  -> design decomposition
  -> HTML / CSS / JS build
  -> responsive QA
  -> shipped page
```

Visual concept:

- Start with a tall generated website screenshot.
- Overlay typography, spacing, grid, color, section rhythm, and interaction notes.
- The image then becomes a wireframe.
- The wireframe becomes code.
- The code becomes the live page.

This is a strong portfolio story because it demonstrates:

- taste
- prompt architecture
- design direction
- frontend translation
- responsive implementation
- review discipline

This can receive the `Websites` output node from the hero. The node lands on a generated website image, which then gains overlays for grid, type, spacing, sections, and QA notes before resolving into the live coded page.

### 3. Video Generation Pipeline

Show the manifest-first video process:

```text
recipe
  -> approved references
  -> visual law
  -> motion grammar
  -> Part 1 candidates
  -> human approval
  -> final frame as Part 2 start frame
  -> stitch / publish
```

Visual concept:

- A horizontal film strip with candidate clips.
- The approved candidate gets a clear review mark.
- Its final frame becomes the start frame for the next stage.
- A manifest panel shows model, references, job IDs, costs, and continuation command as proof of process.

This should be privacy-safe and can use generic/redacted examples if client or internal work should not be exposed.

### 4. Content / Search System

This remains the clearer blog/content workflow:

```text
SERP data
  -> keyword research
  -> brand archive search
  -> outline
  -> blog draft
  -> AI content checker
  -> Google Drive handoff
  -> ranking / sales proof
```

This belongs on a system page, not in the homepage hero.

### 5. AI Enablement System

Show how AI capability gets packaged so other people can use it.

```text
workflow need
  -> custom MCT / MCP / connector
  -> reusable skill
  -> team training
  -> adoption guide
  -> safer repeatable output
```

Visual concept:

- A rough internal workflow enters from the left.
- It is converted into a structured skill/tool layer.
- A training module or playbook wraps around it.
- The output is a team member using the workflow without needing to understand every technical detail.

Proof examples can include:

- custom MCTs / MCPs
- local skills
- deploy-presentation workflow
- image/video/design prompt systems
- content QA rules
- company-safe training docs or redacted playbooks

This should be privacy-reviewed because internal enablement artifacts may expose company process.

### 6. Notion / Knowledge System

There are likely useful examples in Notion and knowledge records. The portfolio should only surface these after a privacy review.

Potential visual treatment:

```text
notes / briefs / research / client context
  -> structured knowledge record
  -> reusable skill / workflow
  -> output artifact
```

This could support a "knowledge into workflows" page, but it needs source review before publishing.

## Visual Language For Pipeline Pages

The pipeline pages should keep the paper/grid aesthetic but allow more technical overlays:

- JSON panels with large readable type, not tiny code blocks.
- Contact sheets of generated candidates.
- Redacted review comments.
- Crop marks and measurement frames.
- Animated route lines between prompt fields and output regions.
- Human-review gates drawn as stamps, pins, or annotation marks.
- Version numbers and manifest rows as proof, not decoration.

Avoid fake terminal windows and fake browser chrome. Use the actual artifact shapes: prompts, manifests, screenshots, scorecards, video frames, and live-page previews.

## Notion / Internal Knowledge Review

Before adding Notion-derived examples to the public portfolio:

1. Pull the candidate records.
2. Classify each as public, anonymized, or private.
3. Strip company names outside resume work-history context unless already approved.
4. Convert private examples into abstracted diagrams, redacted screenshots, or process descriptions.
5. Keep anything sensitive out of the homepage.

Possible categories to look for:

- image prompt recipes
- website prompt scorecards
- content workflow records
- proposal/deck deployment notes
- custom MCT / MCP notes
- skill training records
- AI enablement playbooks
- Google Drive handoff processes
- SERP/API data workflows
- client reporting or dashboard patterns

## Success Metrics And Proof Treatment

The portfolio should use proof aggressively, but every proof claim needs a status:

- **Verified:** source available and safe to publish.
- **Anonymized:** real source exists, but company/client details are removed.
- **Estimate:** calculated from a stated assumption and labeled as an estimate.
- **To source:** useful claim, but not published until tied to a resume line, report, screenshot, export, or dated note.

Potential proof claims:

- **Retail / ecommerce:** use the resume-supported sales-lift claim exactly as written once the resume source is checked.
- **AEO / ecommerce:** `200M+` managed ecommerce organic/search context can be used if source-safe.
- **GTM growth:** `6,000% increase` can be used only when tied to the exact initiative, date range, and wording.
- **AI sales lift:** keep the anonymized examples already discussed if source-safe: `$1k -> ~$20k/month` and `$3k -> ~$60k/month`.
- **Vertical Impression time saved:** use as an estimate unless verified.

Time-saved estimate options:

```text
Scenario A:
4 hours/week saved x 2 employees x 52 weeks = 416 hours/year

Scenario B:
4 hours/week saved x 2 workflows x 2 employees x 52 weeks = 832 hours/year
```

Scenario B equals about 20.8 forty-hour workweeks per year returned to sales work. This should be phrased as an estimate, for example:

```text
Estimated 800+ hours/year returned to sales capacity by reducing manual proposal and deployment work.
```

Do not publish this as a measured result unless we later verify the real workflow time, employee count, and before/after process.

## Recommended Implementation Path

1. Stop iterating on the current literal `three-marketing-map.html` labels.
2. Redesign the hero artifact around input -> synthesis -> output.
3. Build one polished homepage motion prototype:
   - abstract first frame
   - scroll to synthesis
   - scroll to proof transition
4. Make the hero artifact persist down the page and merge into proof/pipeline modules.
5. Build one pipeline visual prototype for JSON prompt -> image -> review -> output.
6. Build one website design pipeline prototype for image -> design decomposition -> code -> QA.
7. Only after the homepage motion and one pipeline page work, build project and remaining system pages.
8. Use the same grid/paper/taste system everywhere so the site feels authored, not assembled.

## Open Questions

1. Should the central point be labeled `MM`, `Michael`, `Synthesis`, or left unlabeled?
2. Should the homepage use a pinned scroll sequence, or should the animation stay entirely inside the first viewport?
3. Which proof claims are approved for the homepage versus deeper pages?
4. Do we want the hero artifact to be mostly Three.js, or should it be a hybrid where Three.js handles particles and SVG handles labels?
5. Which Notion records are safe to inspect and translate into public/anonymized portfolio visuals?
6. Should the AI pipeline pages show real generated assets from this repo, or purpose-built sanitized examples?
7. Which proof claims are verified enough for homepage use, and which should stay on deeper pages as estimates or anonymized examples?

## Current Recommendation

Use a hybrid:

- Three.js for the living field, route motion, cursor response, depth, and scroll-state transformation.
- HTML/SVG labels layered above it for typography control.
- SVG-only diagrams on deeper system pages.

This gives the homepage the award-level animation quality without forcing the explanatory diagrams into a medium that is bad for labels.

## Reference Study: Units

Reference: https://units.gr/en/homepage/

This should not be copied. Units is playful, photo-led, saturated, rounded, and student-housing-specific. The portfolio should remain warmer, quieter, more editorial, and more technical. The useful lesson is not the exact look. It is how confidently the site uses motion, scale, and section transitions.

### What To Borrow

- **Intro as identity moment:** Units opens with a centered brand lockup on a blank warm field and a bottom progress line before revealing the page. For this portfolio, use a shorter identity load or first-paint animation: `Michael McKerracher / Marketing Engineer`, then the synthesis field draws in.
- **One dominant first image/object:** Units does not start with a grid of cards. It uses one large visual surface. For this portfolio, the equivalent is one living synthesis field, not a selected-work panel.
- **Rounded but not generic section containers:** Units uses large rounded section slabs. We should not adopt the bubble/playful look, but we can use large bounded "motion chapters" with softened corners or clipped paper panels.
- **Scroll choreography:** The page uses GSAP/ScrollTrigger-class motion. The important borrow is the page-level sequencing: section transitions feel authored, not just revealed.
- **Text as animated material:** Units loads SplitText and ScrambleText-style tooling. For this portfolio, use restrained type reveals, annotation reveals, and occasional technical text scrambling only where it supports the engineering concept.
- **Graphic-to-content transitions:** Units carries hero energy into map/content sections. For this portfolio, the hero field should decompose into the proof strip and selected-work section.

### What Not To Borrow

- Do not use the chunky playful display type.
- Do not use the saturated yellow/purple student-brand palette.
- Do not use heavy pill buttons as the main visual language.
- Do not use full-bleed lifestyle photography as the hero.
- Do not use bouncy/cartoon motion.
- Do not make the site feel like a consumer brand campaign.

### Technical Facts Observed

- Body background: warm beige, approximately `rgb(244, 233, 225)`.
- Body font: `Aeonik Pro`.
- Display font: `Bunch`, heavy weight.
- Motion stack includes GSAP 3.13, ScrollTrigger, ScrollToPlugin, SplitText, Flip, DrawSVG, MorphSVG, ScrambleText, Draggable, InertiaPlugin, Lottie, and Swiper.

### Translation For This Portfolio

Use Units as evidence that the site needs a real animation system:

```text
identity preload
  -> hero synthesis field draws in
  -> field pins and labels resolve
  -> outputs descend into proof/project sections
  -> system pages use explanatory SVG diagrams
```

The shared DNA is:

- warm surface
- oversized identity
- one primary visual object
- tactile section transitions
- scroll-controlled motion
- animated text used sparingly

The distinct portfolio expression is:

- editorial serif instead of playful sans
- paper/grid drawing language instead of consumer color blocks
- black/moss/blue/carmine accents instead of yellow/purple
- synthesis and proof instead of lifestyle messaging
- precise technical motion instead of playful brand motion
