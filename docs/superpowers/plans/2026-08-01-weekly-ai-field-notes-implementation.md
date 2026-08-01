# Weekly AI Field Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public weekly field-notes section to the portfolio and a private, scheduled Codex workflow that collects a safe brief on Saturday, writes and checks the article on Sunday, and publishes only when Mike explicitly approved the unchanged brief.

**Architecture:** The public repository owns deterministic policy checks, approval hashing, static rendering, the field-notes UI, and tests. Private evidence, briefs, drafts, approvals, and run receipts live under `~/.codex/automations/weekly-field-notes/state/`. Three Codex automations orchestrate the human/editorial work from private runbooks. The Sunday publisher uses a temporary clean worktree based on current `origin/main`; it never mutates Mike's working checkout.

**Tech Stack:** Node.js 22, the built-in Node test runner, static HTML/CSS, Markdown source, Git/GitHub, Vercel, Codex automations, macOS notifications.

---

## Task 1: Lock the deterministic weekly policy with failing tests

**Files:**
- Create: `tests/weekly-field-notes-policy.test.mjs`
- Create: `tests/fixtures/weekly-field-notes/safe-brief.md`
- Create: `tests/fixtures/weekly-field-notes/safe-draft.md`
- Create: `content/field-notes/rules.json`
- Create: `scripts/weekly-field-notes/core.mjs`

- [ ] Write tests for the ISO-week helper, stable SHA-256 hashes, exact brief-hash approval, stale approval rejection, missing approval withholding, confidentiality blocking with runtime private terms, client-adjacent metrics, credentials, email addresses, and non-allowlisted domains.
- [ ] Write tests for local eight-word shingle overlap, the required web-check receipt, the required factual-review receipt, and fail-closed gate results.
- [ ] Run `node --test tests/weekly-field-notes-policy.test.mjs` and confirm failure because the implementation does not exist.
- [ ] Add a versioned public rules file containing generic privacy, originality, citation, editorial, and branch-safety thresholds. Do not store private company or project names in the repository.
- [ ] Implement only the pure functions needed by the tests in `core.mjs`: `isoWeek`, `sha256`, `makeApproval`, `validateApproval`, `findPrivacyViolations`, `findLocalOverlap`, and `evaluatePublicationGates`.
- [ ] Rerun `node --test tests/weekly-field-notes-policy.test.mjs` until it passes.
- [ ] Commit with `git commit -m "test: lock weekly field notes publishing gates"`.

## Task 2: Add the state CLI and prove the approval boundary

**Files:**
- Create: `tests/weekly-field-notes-cli.test.mjs`
- Create: `scripts/weekly-field-notes/cli.mjs`
- Modify: `package.json`

- [ ] Write CLI integration tests in a temporary directory for `init-week`, `approve`, `check`, and `status`.
- [ ] Prove `init-week` creates only the expected private filenames, repeated identical initialization is a no-op, and a changed evidence hash invalidates an existing approval.
- [ ] Prove `approve` accepts only the exact phrase `Approve this week's brief.`, binds Mike's approval to the current brief hash, and never treats silence as approval.
- [ ] Prove `check` produces `draft_ready_review_required` without approval and `publish_ready` only with a matching approval plus passing receipts.
- [ ] Run `node --test tests/weekly-field-notes-cli.test.mjs` and confirm the intended failures.
- [ ] Implement JSON/Markdown reads and atomic writes in `cli.mjs`; never persist raw excerpts.
- [ ] Add package commands: `field-notes`, `field-notes:test`, and `field-notes:build`.
- [ ] Rerun the CLI tests and the policy tests.
- [ ] Commit with `git commit -m "feat: add hash-bound field notes state CLI"`.

## Task 3: Build the public log and static article renderer

**Files:**
- Create: `tests/weekly-field-notes-render.test.mjs`
- Create: `scripts/weekly-field-notes/render.mjs`
- Create: `content/field-notes/README.md`
- Create: `v2/field-notes/index.html`
- Create: `v2/field-notes/field-notes.css`
- Create: `v2/field-notes/feed.xml`
- Modify: `scripts/promote-v2-to-root.mjs`
- Modify: `.vercelignore`

- [ ] Write renderer tests using a safe fixture article. Require escaped HTML, canonical URLs, title/description, publication date, authorship disclosure at the top, accessible landmarks, related-entry navigation, Blog/BlogPosting JSON-LD, and RSS output.
- [ ] Test that a second build produces byte-identical output and that unpublished Markdown is ignored.
- [ ] Test that `npm run promote:v2` copies `v2/field-notes/` to the root `field-notes/` route while leaving V2 canonical source intact.
- [ ] Run the renderer test and confirm the intended failures.
- [ ] Implement a deliberately small Markdown subset: headings, paragraphs, unordered lists, links, emphasis, and horizontal rules. Reject raw HTML.
- [ ] Build the empty series index with this approved disclosure: “Codex writes this log. Mike McKerracher co-authors it and built the machinery underneath it.” Explain the Saturday approval boundary and private-work boundary in plain language.
- [ ] Add responsive editorial CSS using the existing vendored DM Sans and Fraunces fonts, strong focus states, readable measures, reduced-motion support, and no remote assets.
- [ ] Generate the feed from only published entries.
- [ ] Update the promotion script to recursively copy the field-notes directory and exclude Markdown sources from Vercel output through `.vercelignore`.
- [ ] Rerun renderer tests, then `npm run promote:v2`.
- [ ] Commit with `git commit -m "feat: add the Marketing Engineering Field Notes log"`.

## Task 4: Connect the log to portfolio discovery and SEO

**Files:**
- Create: `tests/weekly-field-notes-site.test.mjs`
- Modify: `v2/index.html`
- Modify: `sitemap.xml`
- Modify: `robots.txt`

- [ ] Write a site contract test requiring a primary navigation link to `/field-notes/`, a canonical field-notes index, RSS discovery, Blog schema, a sitemap entry, and crawl permission.
- [ ] Test that private automation paths, approval files, evidence files, drafts, gate reports, and runtime private terms never appear in public HTML or the Vercel file set.
- [ ] Run `node --test tests/weekly-field-notes-site.test.mjs` and confirm failure.
- [ ] Add `Field Notes` to the V2 primary navigation and promote V2 so the production root receives the same link.
- [ ] Add `/field-notes/` and `/field-notes/feed.xml` discovery metadata without exposing a draft article URL.
- [ ] Update the sitemap with the index only; individual entries are added by the renderer after they are publishable.
- [ ] Rerun the site test and all field-notes tests.
- [ ] Commit with `git commit -m "feat: connect field notes to portfolio discovery"`.

## Task 5: Install the private runbooks and first-run state contract

**Files:**
- Create outside repository: `~/.codex/automations/weekly-field-notes/RUNBOOK-SATURDAY.md`
- Create outside repository: `~/.codex/automations/weekly-field-notes/RUNBOOK-REMINDER.md`
- Create outside repository: `~/.codex/automations/weekly-field-notes/RUNBOOK-SUNDAY.md`
- Create outside repository: `~/.codex/automations/weekly-field-notes/memory.md`

- [ ] Write the Saturday runbook with a seven-day window, allowed source types, raw-source exclusion, anonymization rules, four required observation groups (tools, called skills, visited research categories, friction), evidence hashing, editorial-angle selection, and one-notification idempotency.
- [ ] Require the Saturday output to include learned, used, deliberately not used, strength, weakness, adjustment, and next test, while telling a single story rather than filling a template.
- [ ] Write the reminder runbook so it quietly exits when approval is valid and sends exactly one reminder otherwise. A missed approval is not a failure.
- [ ] Write the Sunday runbook so it always drafts, applies the Fountainhead content system and journalism craft rules, runs privacy/originality/fact/editorial gates, and withholds on missing or stale approval.
- [ ] Define the clean publishing sequence: fetch, temporary worktree from `origin/main`, render, test, verify unchanged remote head, commit, push, wait for Vercel, check live URL, write result, then remove the temporary worktree.
- [ ] Define a three-consecutive-infrastructure-failure bail-out, weekly idempotency keys, safe reruns, the manual stop command, and notification messages for every terminal state.
- [ ] Record paths and future automation IDs in private `memory.md`; never write them into public article content.

## Task 6: Create and validate the three Codex automations

**Automations:**
- Saturday collector: 1:00 a.m. `America/Vancouver`
- Saturday reminder: 6:00 p.m. `America/Vancouver`
- Sunday writer/publisher: 9:00 a.m. `America/Vancouver`

- [ ] Create the Saturday automation with a minimal prompt that reads the full Saturday runbook, uses the portfolio project, writes private state, and reports `Weekly Field Notes brief ready:` followed by the computed ISO week.
- [ ] Create the reminder automation with a prompt that reads the reminder runbook and reports only a pending reminder or quiet no-op.
- [ ] Create the Sunday automation with a prompt that reads the full Sunday runbook and reports exactly one of: published, publication withheld, or blocked.
- [ ] Leave normal Codex/macOS notifications enabled. Do not add email or Slack.
- [ ] List the automations and verify their schedules, active state, project path, and unique IDs.
- [ ] Update private `memory.md` with the verified IDs and manual pause/resume instructions.

## Task 7: Run the first Saturday collection now

**Files:**
- Create outside repository: `~/.codex/automations/weekly-field-notes/state/2026-W31/run.json`
- Create outside repository: `~/.codex/automations/weekly-field-notes/state/2026-W31/evidence.json`
- Create outside repository: `~/.codex/automations/weekly-field-notes/state/2026-W31/brief.md`

- [ ] Scan only July 25 through July 31, 2026 using persisted Codex/Chronicle summaries, task summaries, local Git metadata, skill manifests, and broad browser research categories.
- [ ] Convert every source into an anonymized observation before writing it. Persist no raw excerpt, company name, company domain, private person, client number, credential, or sensitive browsing detail.
- [ ] Choose one arguable editorial theory, write a lively brief with title options, opening image, supporting observations, counterpoint, ending, and next test.
- [ ] Run the deterministic privacy check against the evidence and brief before saving them.
- [ ] Record evidence and brief hashes plus `brief_ready` / `approval_pending` state.
- [ ] Rerun the same first-run command and verify it is a no-op with no second notification.
- [ ] Present the brief in the current Codex task and instruct Mike to reply exactly: `Approve this week's brief.`

## Task 8: Full verification and branch handoff

**Files:**
- Modify as required by test evidence only.

- [ ] Run `npm run field-notes:test`.
- [ ] Run `npm test` and confirm the baseline suite plus all new tests pass.
- [ ] Run `npm run promote:v2`, then rerun `npm test` to detect root/V2 drift.
- [ ] Start a local server and inspect `/field-notes/` at desktop and mobile widths for navigation, readable line length, focus behavior, disclosure prominence, schema, and console/network errors.
- [ ] Run `git status --short`, inspect the full diff, and scan tracked additions for placeholders, private state, credentials, private names, and client-adjacent figures.
- [ ] Use `superpowers:finishing-a-development-branch` to present merge/push/deploy choices. Do not publish the first article until the exact weekly approval exists and all Sunday gates pass.
