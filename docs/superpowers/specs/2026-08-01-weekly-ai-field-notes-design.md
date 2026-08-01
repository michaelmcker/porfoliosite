# Weekly AI Field Notes: Design Specification

- **Date:** 2026-08-01
- **Status:** Approved conversational design, awaiting written-spec review
- **Owner:** Mike McKerracher
- **Primary author:** Codex
**Repository:** `/Users/michaelmckerracher/Job Search/portfolio-site`

## 1. Purpose

Create a weekly portfolio blog authored by Codex, co-authored by Mike McKerracher, and produced through a workflow Mike built.

The system will turn one week of work signals into an interesting editorial article about marketing engineering. It will not publish a diary, tool inventory, client recap, or machine-generated status report. Each entry must find one useful tension in the evidence and develop a point of view around it.

The system has two jobs:

1. Show what Mike is learning by building marketing systems.
2. Demonstrate the quality and restraint of the system that produces the article.

The publication target is the existing portfolio at `michaelmck.site`. GitHub remains the durable source, V2 remains the canonical production source, and a successful push to the production branch triggers the existing Vercel deployment path.

## 2. Non-goals

The first version will not:

- expose client names, client work, client domains, client people, client numbers, or identifying project details;
- summarize personal browsing or inspect raw Chronicle screenshots and OCR;
- auto-publish when Mike has not explicitly approved that week's Saturday brief;
- quote outside sources;
- copy Hemingway sentences or imitate his mannerisms;
- let the automation weaken its own confidentiality or originality rules;
- publish around a failed checker, unavailable checker, merge conflict, test failure, or deployment uncertainty;
- claim that an automated plagiarism check can mathematically prove originality.

## 3. Public authorship and disclosure

Every weekly article begins with a visible authorship line and the same short explanation of the system.

### Approved direction

> **Codex writes this log. Mike McKerracher co-authors it and built the machinery underneath it.**
>
> Once a week, the system looks back at the tools Mike reached for, the skills he called, the research trails he followed, and the places the work fought back. Codex looks for the story inside that evidence. Mike reviews the premise on Saturday. If he approves it, Codex writes, checks, and publishes the piece on Sunday. If he does not, the draft stays in the workshop.
>
> Client names, client work, client numbers, personal browsing, and sensitive details never make it through the door. What remains is the useful part: what we learned, what worked, what did not, and what we will try next.

The tone should be candid and alive. It should not sound like a legal disclaimer. The first sentence states authorship. The remaining copy explains the collaboration, approval boundary, and privacy boundary in plain language.

The series index will include a longer `How this log works` explanation. Individual entries will use the short version above.

## 4. Editorial contract

### Core content

Each entry may cover:

- what was learned;
- tools used and why;
- tools considered but deliberately not used;
- strengths revealed by the work;
- weaknesses or limits revealed by the work;
- a correction, adaptation, or next test.

Each entry must centre on one editorial theory. Examples include:

- the tool that was rejected mattered more than the tool that shipped;
- a repeated failure exposed a missing approval gate;
- the fastest workflow was not the most reliable workflow;
- a design problem was really an evidence problem;
- better automation came from removing a decision, not adding another model.

The article must not reproduce the Saturday list as five equal sections. The evidence is raw material. The Sunday article is a story with an argument.

### Voice

Codex should sound curious, observant, candid, and lightly funny when the evidence earns it. The writing can admit confusion, failed attempts, uncertainty, or an unexpectedly boring answer. It must not become cute, perform vulnerability, or turn every small correction into a grand lesson.

The system will use general principles associated with Hemingway's early journalism:

- begin with a short, concrete opening;
- use active verbs and ordinary nouns;
- lead with observed action or a real decision;
- cut explanation the evidence already carries;
- use detail to create interest instead of adjectives;
- vary sentence length so brevity does not become robotic staccato;
- leave room for the reader to infer the larger point.

The Toronto Star work is the reference for descriptive colour, compact scenes, vignettes, and dialogue. The famous short-sentence newsroom rules came from Hemingway's earlier Kansas City Star training and must not be misattributed. The system adopts broad journalistic craft, not Hemingway's sentences or persona.

### Search and answer-engine role

Weekly entries support the broader `marketing engineer` topic cluster, but they remain editorial first.

Each entry must include:

- one dominant topic;
- a direct summary below the H1;
- three to five useful H2 sections;
- self-contained section openings;
- explicit references to Mike McKerracher where entity clarity helps;
- natural internal links to the relevant portfolio workflow or prior field note;
- Article and BreadcrumbList schema that matches visible content.

No keyword target may force the article away from the week's strongest evidence.

## 5. Weekly workflow

The system uses three fixed Codex automations in `America/Vancouver` time.

### Stage A: Saturday collection and brief

**Schedule:** Saturday at 1:00 a.m.

The collector reads the previous seven days of approved work signals, sanitizes them, selects a theory, and writes:

- a source-count summary;
- an exclusions summary;
- the proposed theory and editorial angle;
- two or three possible titles;
- a structured outline;
- a short note explaining why the angle is worth reading;
- an immutable brief hash.

The run creates a Codex task and notification titled with the week, for example `Weekly Field Notes brief ready: 2026-W31`.

The notification tells Mike to reply in that task with:

`Approve this week's brief.`

Approval records the ISO week, brief hash, approval timestamp, and approving identity. Merely opening the notification does not count as approval.

### Stage B: Saturday approval reminder

**Schedule:** Saturday at 6:00 p.m.

If a valid approval already exists, this stage performs no mutation and reports a quiet no-op. If approval is missing, it sends one reminder with the brief title and review instruction.

Failure to respond is not an error. It does not stop Sunday drafting.

### Stage C: Sunday drafting, checks, and conditional publication

**Schedule:** Sunday at 9:00 a.m.

The Sunday stage always writes the article from the sanitized evidence packet and current brief. It then runs every publication gate.

Publication occurs only when:

1. the Saturday brief has an explicit approval;
2. the stored approval hash matches the current brief hash;
3. all confidentiality, originality, fact, editorial, link, build, and deployment-preflight gates pass;
4. the remote production branch can be updated without conflict.

If Mike has not approved the brief, the Sunday stage still creates the finished draft and gate report. It sends `Weekly Field Notes draft ready, publication withheld`. The article remains private.

If Mike approved the brief and every gate passes, the Sunday stage commits the article, updates the public index/feed/sitemap, pushes the production commit, waits for deployment, verifies the live URL, and sends `Weekly Field Notes published` with the URL and gate summary.

If a gate fails, the system sends `Weekly Field Notes blocked` with the highest-priority reason. It does not publish.

### Immediate first run

Once implementation and its tests are approved, run Stage A immediately instead of waiting for the next Saturday. The ordinary weekly schedule remains unchanged.

## 6. Approval state machine

The weekly state is strict:

1. `collecting`
2. `brief_ready`
3. `approval_pending` or `brief_approved`
4. `drafting`
5. `checking`
6. `draft_ready_review_required`, `blocked`, or `publish_ready`
7. `publishing`
8. `published` or `publish_failed`

Rules:

- Silence never becomes approval.
- Approval applies only to the exact brief hash Mike reviewed.
- Editing the brief after approval invalidates approval.
- A draft can advance without approval, but publication cannot.
- Checker failure cannot be converted to a warning by the same run.
- A missed approval is not counted as an automation failure.

## 7. Input sources and privacy boundary

The Saturday collector may inspect only the previous seven days.

### Allowed sources

- Codex task and session summaries for tool calls, skill calls, corrections, and repeated friction;
- work-related Chronicle summaries for broad public research themes;
- local skill and tool manifests for names and version changes;
- repository changes that show a tool, skill, workflow, or documented adjustment;
- reviewed friction logs and common-problem records;
- prior weekly entries for continuity and overlap control.

### Disallowed sources

- raw Chronicle screenshots, raw OCR, and raw browser history;
- personal, medical, financial, family, employment-application, authentication, or private-message activity;
- credentials, API keys, tokens, cookies, local secrets, and environment contents;
- client emails, meeting transcripts, analytics exports, proposals, deliverables, or contracts as article source text;
- any source whose ownership or publication rights are uncertain.

### Confidentiality transformation

The collector converts allowed signals into public-safe categories before the writer sees them.

Examples:

- a named company becomes `an ecommerce brand`, `a local-service business`, or another broad industry label;
- a named project becomes `a content workflow`, `a website build`, or `a sales tool`;
- a client metric is removed, not rounded or generalized;
- a private URL is removed, not shortened;
- a named person is removed unless the person is Mike or a public author cited for an independent editorial source.

The hard rule blocks all client names, client work, and client-related numbers. A broad industry reference passes only when the surrounding facts cannot identify the company or project.

## 8. Private and public artifacts

Private automation state must never be committed to the public portfolio repository.

### Private state

Store under the Codex automation directory:

For example: `~/.codex/automations/weekly-field-notes/state/2026-W31/`

Each weekly directory contains:

- `run.json`
- `evidence.json`
- `brief.md`
- `approval.json`, when approved
- `draft.md`
- `gate-report.json`
- `publish-result.json`, when attempted

Raw source excerpts are not persisted. `evidence.json` contains normalized, anonymized observations and source-type labels only.

### Public repository artifacts

The portfolio repository receives only:

- the approved Markdown source;
- generated production HTML under the canonical V2 blog source;
- the updated blog index;
- feed and sitemap updates;
- public-safe schema and metadata;
- a minimal publication receipt with checker names and pass/fail counts, never private evidence.

## 9. Originality and plagiarism gate

The system reduces plagiarism risk through source separation and independent checks. It never claims to prove a negative perfectly.

### Source separation

The Sunday writer receives normalized facts and labels, not copied source prose. No external quotes are allowed in version one. Tool documentation may be cited for a factual description, but its wording must not be reused.

### Local corpus scan

Compare the draft with:

- every portfolio article and draft;
- prior weekly entries;
- relevant Fountainhead content available locally;
- the sanitized Saturday brief.

Block an uncited exact run of ten or more words, excluding the permanent authorship disclosure, common headings, product names, and unavoidable technical terms. Flag suspicious repeated sentence structures and close paraphrases for a second review.

### Web overlap scan

Extract the most distinctive eight-to-twelve-word phrases from the article and search for exact matches. Any substantive match triggers a blocking review. If the web check is unavailable, publication fails closed and the draft remains private.

### Citation and claim review

- No unattributed quotations.
- No external quotation in version one.
- No claim sourced only from memory.
- Public factual claims require an inspectable source.
- Disputed, unverifiable, or missing-source material is removed or blocks publication.
- Personal observations must be framed as observations, not universal findings.

## 10. Content quality gates

The Sunday stage runs these gates in order:

1. Brief and approval integrity.
2. Confidentiality and de-identification.
3. Originality and overlap.
4. Claim extraction and fact verification.
5. Fountainhead deterministic content audit.
6. Universal AI-ism scan.
7. Editorial voice and usefulness review.
8. AEO structure and metadata review.
9. Link verification.
10. Static build and repository tests.
11. Production branch and deployment preflight.
12. Live URL readback after publication.

All gates are blocking. The automation may revise draft-level editorial problems and rerun the gates. It may not revise, waive, or bypass confidentiality, originality, approval, branch-safety, or deployment-verification rules.

## 11. Publishing implementation boundary

The current portfolio checkout contains unrelated user work and must not be used as the automation's mutation surface.

The Sunday publisher will:

1. fetch the existing `origin`;
2. create a dedicated temporary Git worktree from current `origin/main`;
3. render the approved article into the V2 blog source;
4. run focused blog tests plus the repository's required test suite;
5. commit only the weekly article and generated index/feed/sitemap artifacts;
6. verify that remote `main` has not moved unexpectedly;
7. push only a safe fast-forward update;
8. wait for Vercel and verify the expected live title, disclosure, canonical URL, and HTTP 200 response;
9. remove the temporary worktree only after recording the result.

Any conflict, non-fast-forward condition, failing test, incomplete build, or uncertain deployment state blocks publication. The automation never stashes, resets, discards, or commits unrelated user work.

## 12. Notification contract

The initial notification channel is the Codex task inbox plus the native macOS notification supplied by Codex when system notifications are enabled.

Each notification includes:

- the ISO week and stage;
- the proposed or published title;
- the current state;
- the exact next action, when action is required;
- the brief, draft, or public URL;
- the gate result or blocking reason.

Email can be added later through the connected Gmail account after separate approval. Slack is not part of version one.

## 13. Idempotency, retries, and bail-out

The ISO week and artifact hashes are the deduplication keys.

- Re-running Saturday updates the current week's brief only when its evidence hash changed.
- Re-running the reminder sends no duplicate when the same pending reminder was already recorded.
- Re-running Sunday does not create a second article or second commit for the same approved brief and content hash.
- A published week is immutable unless Mike explicitly requests a correction.
- The system retries transient read or deployment checks within a bounded window.
- After three consecutive infrastructure failures, the affected automation pauses and notifies Mike.
- Mike can pause or delete each Codex automation at any time.

## 14. Rule evolution

The public-writing rules live in a versioned repository file, with a human-readable explanation beside it.

The automation may propose a new rule when a checker, correction, or repeated friction exposes a gap. Proposed rules go into a review queue. They do not become active until Mike approves them.

The automation can never propose or apply a change that weakens:

- explicit weekly approval;
- client confidentiality;
- personal and sensitive-data exclusions;
- originality checks;
- fact verification;
- fail-closed publication behavior.

Every published article records the rule version used.

## 15. Testing and acceptance criteria

### Unit and fixture tests

- client name is blocked;
- client domain is blocked;
- client number is blocked;
- broad industry label passes;
- personal browsing signal is excluded;
- missing approval produces a private finished draft;
- stale approval hash blocks publication;
- exact ten-word overlap blocks publication;
- checker outage blocks publication;
- repeated run is a no-op;
- article disclosure appears exactly once;
- article metadata and schema match visible content.

### Integration tests

- Saturday creates a sanitized brief and one notification;
- approval writes a hash-bound approval record;
- reminder is silent when approved and notifies when pending;
- Sunday produces a draft without approval but does not publish;
- Sunday publishes from a clean worktree when approval and gates pass;
- remote branch movement blocks unsafe push;
- Vercel readback verifies the expected article after push.

### Visual and browser checks

- blog index and entry work at desktop, laptop, phone, and shallow-wide sizes;
- authorship disclosure is visible without dominating the article;
- type, spacing, and links follow the V2 design contract;
- reduced-motion mode remains complete;
- no horizontal overflow;
- the new blog does not regress existing homepage, proposal, workflow, or case-study routes.

### Definition of done

The system is complete when:

1. all three automations exist and their IDs are documented;
2. an immediate Saturday-equivalent run creates the first sanitized brief;
3. the idempotency check passes on a second run;
4. Mike can approve the exact brief from its Codex task;
5. the Sunday path is proven in both withheld and approved fixtures;
6. a gate failure demonstrably prevents publication;
7. a successful approved run publishes one verified live article;
8. the rules and stop procedure are documented.

## 16. Editorial source notes

- Toronto Public Library, `Ernest Hemingway's Toronto Ties`: https://tpl.ca/blogs/post/ernest-hemingways-toronto-ties/
- The Washington Post archive, `Trove of Hemingway Stories Uncovered`: https://www.washingtonpost.com/archive/lifestyle/1992/03/02/trove-of-hemingway-stories-uncovered/c6f376fa-96de-4586-a1b2-8408da520635/
- Poetry Foundation, `Ernest M. Hemingway`: https://www.poetryfoundation.org/archive/poet.html?id=3065
