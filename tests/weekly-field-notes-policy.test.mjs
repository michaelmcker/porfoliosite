import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  evaluatePublicationGates,
  findLocalOverlap,
  findPrivacyViolations,
  isoWeek,
  makeApproval,
  sha256,
  validateApproval,
} from "../scripts/weekly-field-notes/core.mjs";

const root = new URL("../", import.meta.url);
const fixture = (name) => readFile(new URL(`tests/fixtures/weekly-field-notes/${name}`, root), "utf8");

const rules = {
  version: 1,
  allowedDomains: ["michaelmck.site", "github.com", "openai.com"],
  localOverlap: { shingleWords: 8, maxSharedRatio: 0.08 },
};

const passingReceipts = {
  web: { status: "pass", checkedAt: "2026-08-02T16:00:00.000Z", queryCount: 4, matches: [] },
  facts: { status: "pass", checkedAt: "2026-08-02T16:01:00.000Z", unsupportedClaims: [] },
  editorial: { status: "pass", checkedAt: "2026-08-02T16:02:00.000Z", blockingIssues: [] },
  branch: { status: "pass", checkedAt: "2026-08-02T16:03:00.000Z", baseSha: "abc123", remoteSha: "abc123", testsPassed: true },
};

test("ISO weeks use the Vancouver calendar date", () => {
  assert.equal(isoWeek(new Date("2026-08-01T08:00:00.000Z"), "America/Vancouver"), "2026-W31");
  assert.equal(isoWeek(new Date("2027-01-01T18:00:00.000Z"), "America/Vancouver"), "2026-W53");
});

test("brief hashes are stable and approval is bound to the exact brief", async () => {
  const brief = await fixture("safe-brief.md");
  assert.equal(sha256(brief), sha256(brief));
  assert.notEqual(sha256(brief), sha256(`${brief}\nchanged`));

  const approval = makeApproval({
    week: "2026-W31",
    brief,
    identity: "Mike",
    approvedAt: "2026-08-01T17:00:00.000Z",
  });

  assert.deepEqual(validateApproval({ approval, brief, week: "2026-W31" }), { valid: true, reason: null });
  assert.deepEqual(validateApproval({ approval, brief: `${brief}\nchanged`, week: "2026-W31" }), {
    valid: false,
    reason: "brief_hash_mismatch",
  });
  assert.deepEqual(validateApproval({ approval: null, brief, week: "2026-W31" }), {
    valid: false,
    reason: "approval_missing",
  });
});

test("privacy checks block runtime private terms, client figures, secrets, contact data, and private domains", () => {
  const text = [
    "Project Nightjar improved a client metric by 17%.",
    "Email editor@example.org or use api_key=sk-example-secret.",
    "The unpublished trail sits at https://private-work.example/path.",
  ].join(" ");
  const violations = findPrivacyViolations(text, {
    ...rules,
    privateTerms: ["Project Nightjar"],
  });
  const codes = violations.map(({ code }) => code);

  assert.ok(codes.includes("private_term"));
  assert.ok(codes.includes("client_adjacent_figure"));
  assert.ok(codes.includes("email_address"));
  assert.ok(codes.includes("credential_pattern"));
  assert.ok(codes.includes("non_allowlisted_domain"));
  assert.equal(findPrivacyViolations("Codex and GitHub were useful this week.", rules).length, 0);
});

test("local overlap detects reused source prose but ignores unrelated writing", () => {
  const copied = "The small system exposed its own mistakes and made the final decision easier to trust.";
  const corpus = [{ id: "older-entry", text: `Last month, ${copied} That was the useful part.` }];
  const result = findLocalOverlap(`This week, ${copied} The lesson held.`, corpus, rules.localOverlap);

  assert.equal(result.status, "fail");
  assert.equal(result.matches[0].sourceId, "older-entry");
  assert.equal(findLocalOverlap("A new observation uses wholly different concrete language.", corpus, rules.localOverlap).status, "pass");
});

test("publication gates draft without approval but never publish", async () => {
  const [brief, draft] = await Promise.all([fixture("safe-brief.md"), fixture("safe-draft.md")]);
  const base = {
    week: "2026-W31",
    brief,
    draft,
    rules,
    privateTerms: [],
    localCorpus: [],
    receipts: passingReceipts,
  };

  const withheld = evaluatePublicationGates({ ...base, approval: null });
  assert.equal(withheld.state, "draft_ready_review_required");
  assert.equal(withheld.publishAllowed, false);
  assert.equal(withheld.gates.approval.reason, "approval_missing");

  const approval = makeApproval({ week: "2026-W31", brief, identity: "Mike" });
  const ready = evaluatePublicationGates({ ...base, approval });
  assert.equal(ready.state, "publish_ready");
  assert.equal(ready.publishAllowed, true);

  const missingWebCheck = evaluatePublicationGates({
    ...base,
    approval,
    receipts: { ...passingReceipts, web: null },
  });
  assert.equal(missingWebCheck.state, "blocked");
  assert.equal(missingWebCheck.publishAllowed, false);
  assert.equal(missingWebCheck.gates.web.status, "fail");
});
