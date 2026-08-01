import { createHash } from "node:crypto";

export const APPROVAL_PHRASE = "Approve this week's brief.";

export function sha256(value) {
  return createHash("sha256").update(String(value), "utf8").digest("hex");
}

function localDateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, Number(value)]));
}

export function isoWeek(date = new Date(), timeZone = "America/Vancouver") {
  const { year, month, day } = localDateParts(date, timeZone);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = calendarDate.getUTCDay() || 7;
  calendarDate.setUTCDate(calendarDate.getUTCDate() + 4 - weekday);
  const isoYear = calendarDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil((((calendarDate - yearStart) / 86400000) + 1) / 7);
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

export function makeApproval({ week, brief, identity, approvedAt = new Date().toISOString() }) {
  if (!week || !brief || !identity) throw new Error("week, brief, and identity are required");
  return {
    schemaVersion: 1,
    week,
    briefHash: sha256(brief),
    approvedAt,
    approvedBy: identity,
    phrase: APPROVAL_PHRASE,
  };
}

export function validateApproval({ approval, brief, week }) {
  if (!approval) return { valid: false, reason: "approval_missing" };
  if (approval.phrase !== APPROVAL_PHRASE) return { valid: false, reason: "approval_phrase_mismatch" };
  if (approval.week !== week) return { valid: false, reason: "approval_week_mismatch" };
  if (approval.briefHash !== sha256(brief)) return { valid: false, reason: "brief_hash_mismatch" };
  if (!approval.approvedBy || !approval.approvedAt) return { valid: false, reason: "approval_incomplete" };
  return { valid: true, reason: null };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pushUnique(violations, violation) {
  if (!violations.some(({ code, match }) => code === violation.code && match === violation.match)) {
    violations.push(violation);
  }
}

export function findPrivacyViolations(text, rules = {}) {
  const source = String(text);
  const violations = [];

  for (const term of rules.privateTerms || []) {
    if (!term || term.length < 3) continue;
    const match = source.match(new RegExp(escapeRegex(term), "i"));
    if (match) pushUnique(violations, { code: "private_term", match: match[0] });
  }

  const patterns = [
    ["email_address", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
    ["credential_pattern", /\b(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*[^\s,;]+/i],
    ["credential_pattern", /\bsk-[A-Za-z0-9_-]{8,}\b/],
    ["client_adjacent_figure", /\b(?:client|customer|account|company|brand|project)\b[^.!?\n]{0,64}\b\d[\d,.]*(?:\s*%|\s*(?:dollars?|users?|leads?|sales?|clicks?|views?))?/i],
    ["client_adjacent_figure", /\b\d[\d,.]*(?:\s*%)?[^.!?\n]{0,64}\b(?:client|customer|account|company|brand|project)\b/i],
  ];
  for (const [code, pattern] of patterns) {
    const match = source.match(pattern);
    if (match) pushUnique(violations, { code, match: match[0] });
  }

  const allowed = new Set((rules.allowedDomains || []).map((domain) => domain.toLowerCase()));
  for (const match of source.matchAll(/https?:\/\/([^\s/)]+)/gi)) {
    const domain = match[1].toLowerCase().replace(/^www\./, "").replace(/[.,;:!?]+$/, "");
    const permitted = [...allowed].some((candidate) => domain === candidate || domain.endsWith(`.${candidate}`));
    if (!permitted) pushUnique(violations, { code: "non_allowlisted_domain", match: domain });
  }

  return violations;
}

function words(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(text, size) {
  const tokens = words(text);
  const result = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) {
    result.add(tokens.slice(index, index + size).join(" "));
  }
  return result;
}

export function findLocalOverlap(draft, corpus = [], options = {}) {
  const size = options.shingleWords || 8;
  const threshold = options.maxSharedRatio ?? 0.08;
  const draftShingles = shingles(draft, size);
  if (draftShingles.size === 0) return { status: "pass", sharedRatio: 0, matches: [] };

  const matches = [];
  const allShared = new Set();
  for (const source of corpus) {
    const sourceShingles = shingles(source.text || "", size);
    const shared = [...draftShingles].filter((value) => sourceShingles.has(value));
    if (shared.length) {
      shared.forEach((value) => allShared.add(value));
      matches.push({ sourceId: source.id, sharedCount: shared.length, examples: shared.slice(0, 3) });
    }
  }
  const sharedRatio = allShared.size / draftShingles.size;
  return {
    status: sharedRatio > threshold ? "fail" : "pass",
    sharedRatio,
    matches: matches.sort((a, b) => b.sharedCount - a.sharedCount),
  };
}

function receiptGate(receipt, name, predicate = () => true) {
  const passed = Boolean(receipt && receipt.status === "pass" && receipt.checkedAt && predicate(receipt));
  return {
    status: passed ? "pass" : "fail",
    reason: passed ? null : `${name}_receipt_missing_or_failed`,
  };
}

export function evaluatePublicationGates({
  week,
  brief,
  draft,
  approval,
  rules,
  privateTerms = [],
  localCorpus = [],
  receipts = {},
}) {
  const approvalResult = validateApproval({ approval, brief, week });
  const privacyViolations = findPrivacyViolations(`${brief}\n${draft}`, { ...rules, privateTerms });
  const overlap = findLocalOverlap(draft, localCorpus, rules.localOverlap);
  const minimumQueries = rules.webCheck?.minimumQueries ?? 1;

  const gates = {
    approval: { status: approvalResult.valid ? "pass" : "fail", reason: approvalResult.reason },
    privacy: {
      status: privacyViolations.length ? "fail" : "pass",
      reason: privacyViolations.length ? "privacy_violation" : null,
      violations: privacyViolations,
    },
    localOriginality: {
      status: overlap.status,
      reason: overlap.status === "pass" ? null : "local_overlap",
      ...overlap,
    },
    web: receiptGate(receipts.web, "web", (receipt) => (receipt.queryCount || 0) >= minimumQueries && (receipt.matches || []).length === 0),
    facts: receiptGate(receipts.facts, "facts", (receipt) => (receipt.unsupportedClaims || []).length === 0),
    editorial: receiptGate(receipts.editorial, "editorial", (receipt) => (receipt.blockingIssues || []).length === 0),
    branch: receiptGate(receipts.branch, "branch", (receipt) => receipt.testsPassed === true && receipt.baseSha === receipt.remoteSha),
  };

  const nonApprovalFailures = Object.entries(gates).filter(([name, gate]) => name !== "approval" && gate.status !== "pass");
  const publishAllowed = approvalResult.valid && nonApprovalFailures.length === 0;
  let state = "publish_ready";
  if (!approvalResult.valid && approvalResult.reason === "approval_missing" && nonApprovalFailures.length === 0) {
    state = "draft_ready_review_required";
  } else if (!publishAllowed) {
    state = "blocked";
  }

  return {
    schemaVersion: 1,
    week,
    state,
    publishAllowed,
    checkedAt: new Date().toISOString(),
    gates,
  };
}
