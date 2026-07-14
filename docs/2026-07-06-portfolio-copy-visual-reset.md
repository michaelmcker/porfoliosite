# Portfolio Copy And Visual Reset

Date: 2026-07-06

## Current Diagnosis

The site is directionally useful, but it is not yet a strong portfolio. It has the right ingredients, but the current build still reads like a prototype explaining internal systems.

The biggest issue is not one section. It is the relationship between copy, proof, and graphics:

- The hero has the right visual language, but the headline is weaker than the earlier `Builds that operate` framing.
- Selected work is finally bigger and image-led, but the cases do not yet have strong story arcs.
- Workflow graphics are coded, but they are too literal and too repetitive. They look like wireframe diagrams, not memorable visual systems.
- Many case pages describe a process, then show a process again. They need to show: what was built, why it mattered, what can be opened, and what proof exists.
- Proof is still underdeveloped. It says “inspectable” but does not consistently point to the strongest screenshots, PDFs, URLs, source files, rankings, dashboards, or before/after evidence.
- Language is too internal: “workflow,” “handoff,” “surface,” “queue,” “signals,” and “context” repeat too much. Those can stay in the case details, but the homepage needs clearer outcomes.

## What Is Missing Or Not Built

### 1. A strong top-level promise

Current feeling:

> I build marketing systems that drive demand, clarify positioning, and scale through AI workflows.

Better direction:

> Builds that operate.
> I turn strategy, content, AI, and web work into marketing systems people can use, inspect, and ship.

Why: this is shorter, more ownable, and less like a job-description summary.

### 2. Real case-study pages

The current case pages are mostly process pages. Each selected work page should have:

- What it is.
- Why it was built.
- What I did.
- What can be opened.
- What proof exists.
- What should stay private.

Current pages that need deeper case treatment:

- RCCV.
- Boutique Airbnb site.
- Digital out-of-home proposal tool.
- Fountainhead growth dashboard.
- Local landscaping SEO build.

### 3. A real proof system

The homepage proof strip is placeholder-level. It needs specific but source-safe proof:

- Public sites that can be opened.
- Proposal PDF sample.
- Dashboard/reporting screenshots.
- Ranking or traffic proof where sourced.
- Resume/company history separated from public case labels.

### 4. Better graphic system

The graphics are badly aligned because they are using the same component grammar everywhere:

- Three columns: inputs, hub, outputs.
- Same box sizes regardless of content length.
- Same center circle.
- Decorative lines are CSS pseudo-elements, so they do not actually connect to the nodes.
- Labels are text-first instead of composition-first.
- The graphics compete with the headline instead of carrying the page story.

They should be generated or designed as hero-grade compositions first, then rebuilt or animated from those references.

### 5. Animation plan

Current state:

- Basic reveal animation exists.
- Workflow visuals are static.
- The hero map has motion, but it is not used as a system across pages.

Needed:

- One reusable animated graphic language.
- Section-specific motion states.
- No overcomplicated Three.js until the storyboard is right.
- If using Nano Banana or another animation/image pipeline, use it to create reference frames first, not production logic.

## Proposed Site Script

### Hero

Headline:

> Builds that operate.

Subhead:

> I’m a marketing engineer. I build websites, sales tools, content systems, and AI workflows that turn strategy into work people can open, use, and measure.

Primary CTA:

> View selected work

Secondary CTA:

> Download resume

Graphic:

Abstract operating map. Inputs on the left: market, search, audience, brand, offer. Center: human judgment, AI execution, review. Outputs on the right: websites, proposals, dashboards, content, reports.

Do not make it a dashboard. Do not label every line. It should feel like a living system sketch.

### Selected Work

Section headline:

> Work you can open.

Section copy:

> A short set of public or source-safe examples. The deeper systems are shown after the work, not before it.

Cards:

1. RCCV
   - Community organization website.
   - Visitor paths, events, bulletins, forms, and editorial operations.

2. Boutique Airbnb site
   - Standalone short-term rental site.
   - Brand story, imagery, seasonal content, and direct demand outside booking platforms.

3. Digital out-of-home proposal tool
   - Sales enablement workflow.
   - Local map, custom copy, custom ad plate, and generated PDF proposal.

4. Fountainhead growth dashboard
   - Marketing operations dashboard.
   - Search, AEO, Reddit, content queues, and reporting in one working surface.

### Workflow Systems

Section headline:

> How the work gets made.

Section copy:

> The portfolio pieces are the outputs. These are the systems behind them: research, planning, AI-assisted production, human review, publishing, and measurement.

Workflow names:

- Growth dashboard.
- Content production system.
- Proposal generator.
- Presentation publishing workflow.
- Local prospecting workflow.
- Tool index.

Avoid:

- “Outreach + map enrichment system” as a public-facing label.
- “Agency OS.”
- Long implementation names.

### Case Page Template

Hero:

> [Thing built]

Short description:

> What it does in one sentence.

Right-side graphic:

Workflow lead-out, but section-specific and visually distinct.

Below hero:

1. Built output: real screenshot, PDF, dashboard, or site.
2. Why it mattered: business problem in plain language.
3. My role: strategy, copy, AI workflow, web build, automation, reporting.
4. Proof: sourced claims, public URLs, redacted/private note where needed.
5. What I would improve next: honest roadmap.

### Proof

Section headline:

> Proof, kept honest.

Section copy:

> Some results are public. Some are source-safe summaries. Anything private stays private.

Proof blocks:

- Public websites shipped.
- Proposal PDF sample generated.
- Local SEO pages and ranking proof.
- AI visibility and revenue influence, source-safe.
- Resume-backed enterprise and retail technology experience.

### Resume

Section headline:

> Resume context.

Section copy:

> Company names live here. The public case studies stay category-first unless the work is already public.

## Better Homepage Copy Draft

### Hero

Builds that operate.

I’m a marketing engineer. I build websites, sales tools, content systems, and AI workflows that turn strategy into work people can open, use, and measure.

View selected work.
Download resume.

### Selected Work

Work you can open.

A short set of public or source-safe examples. Websites first, systems second.

RCCV
Community organization website with visitor paths, events, forms, bulletins, and editorial operations.

Boutique Airbnb site
Standalone short-term rental site for a property that needed its own story and direct demand path.

Digital out-of-home proposal tool
Sales workflow that turns business context, screen inventory, a local map, custom copy, and an ad plate into a proposal PDF.

Fountainhead growth dashboard
Operating surface for search, AEO, Reddit, analytics, content queues, and client reporting.

### Workflow Systems

How the work gets made.

The portfolio pieces are the outputs. These are the systems behind them: research, planning, AI-assisted production, human review, publishing, and measurement.

### Proof

Proof, kept honest.

Some work is public. Some results need to stay source-safe. The point is to show what was built, what can be opened, and where the evidence lives.

## Image Generation Prompt: Homepage Storyboard

Use this for the next generated visual reference:

```text
Create a premium Awwwards-quality personal portfolio homepage for a Marketing Engineer.
Visual language: warm paper texture, subtle gradient grid, architectural process drawing, refined serif display type, black ink, muted green, muted blue, ochre, rust.
Tone: confident, sparse, not dashboard-like.

Hero:
Large headline: Builds that operate.
Subhead: I build websites, sales tools, content systems, and AI workflows that turn strategy into work people can open, use, and measure.
Right side: abstract operating map, not a literal chart. Inputs flow through human review and AI execution into websites, proposals, dashboards, content, and reports.

Next section:
Selected work appears immediately below the hero.
Four large image-led case tiles: RCCV, Boutique Airbnb site, Digital out-of-home proposal tool, Fountainhead growth dashboard.
Use generous spacing and real portfolio composition, not small cards.

Below:
Workflow systems section with a beautiful sparse process graphic.
Proof section is restrained and source-safe.

Avoid: dense dashboards, neon, purple, generic SaaS cards, tiny labels, repeated input/output boxes, fake metrics, excessive eyebrow labels, arrows inside buttons.
```

## Image Generation Prompt: Workflow Graphic System

Use this to create graphics that can later be animated:

```text
Create a reusable visual system for portfolio workflow graphics.
Style: paper grid, precise but organic linework, ink drawing, muted colored paths, architectural diagram, premium editorial.
Composition: signals enter from left, pass through a central human judgment and AI execution point, then branch into outputs on the right.
Make each workflow visually distinct:
1. Growth dashboard: search, AEO, community, analytics into reporting and queue.
2. Proposal tool: business, map, inventory, creative into local map, custom pitch, PDF.
3. Website workflow: research, reference, image direction, copy, build into live site.
4. Publishing workflow: HTML artifact, brand rules, prospect context into protected link, CMS entry, tracking.
Output should feel like an animation storyboard with clear layers and paths.
Avoid same-size boxes, repeated center circles, messy overlaps, dense labels, and fake dashboard UI.
```

## Copy Quality Gate

Gate result: PASS for draft direction, not live copy.

U+2014 count in body: 0

Banned phrase matches: 0 in the proposed public-facing copy. Current site still contains some generic/internal terms that should be rewritten during implementation.

Unsupported claims: no new metrics were added.

Broken or unverified links: not checked in this document.

