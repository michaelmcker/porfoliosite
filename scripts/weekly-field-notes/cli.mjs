#!/usr/bin/env node

import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";

import {
  APPROVAL_PHRASE,
  evaluatePublicationGates,
  findPrivacyViolations,
  makeApproval,
  sha256,
} from "./core.mjs";

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    options[key] = value;
    index += 1;
  }
  return { command, options };
}

function required(options, name) {
  const value = options[name];
  if (!value) throw new Error(`--${name} is required`);
  return value;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function readText(path) {
  return readFile(path, "utf8");
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

async function readOptionalJson(path, fallback = null) {
  return path && await exists(path) ? readJson(path) : fallback;
}

async function writeAtomic(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  const body = typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(temporary, body, { mode: 0o600 });
  await rename(temporary, path);
}

function assertEvidenceShape(evidence, week) {
  if (!evidence || evidence.schemaVersion !== 1 || evidence.week !== week || !Array.isArray(evidence.observations)) {
    throw new Error("Evidence must use schemaVersion 1, match the week, and contain observations");
  }
  const prohibitedKeys = new Set(["raw", "rawExcerpt", "excerpt", "screenshot", "ocr"]);
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [key, nested] of Object.entries(value)) {
      if (prohibitedKeys.has(key)) throw new Error(`Evidence may not persist raw source field: ${key}`);
      visit(nested);
    }
  };
  visit(evidence);
}

async function loadPrivateTerms(options) {
  if (!options["private-terms"]) return [];
  const value = await readJson(options["private-terms"]);
  if (!Array.isArray(value) || value.some((term) => typeof term !== "string")) {
    throw new Error("Private terms must be a JSON array of strings");
  }
  return value;
}

async function initWeek(options) {
  const stateRoot = required(options, "state-root");
  const week = required(options, "week");
  const weekPath = join(stateRoot, week);
  const [evidence, brief, rules, privateTerms] = await Promise.all([
    readJson(required(options, "evidence")),
    readText(required(options, "brief")),
    readJson(required(options, "rules")),
    loadPrivateTerms(options),
  ]);
  assertEvidenceShape(evidence, week);
  const privacyViolations = findPrivacyViolations(`${JSON.stringify(evidence)}\n${brief}`, { ...rules, privateTerms });
  if (privacyViolations.length) {
    throw new Error(`Private evidence rejected: ${privacyViolations.map(({ code }) => code).join(", ")}`);
  }

  const evidenceBody = `${JSON.stringify(evidence, null, 2)}\n`;
  const evidenceHash = sha256(evidenceBody);
  const briefHash = sha256(brief);
  const runPath = join(weekPath, "run.json");
  const previous = await readOptionalJson(runPath);
  if (previous?.evidenceHash === evidenceHash && previous?.briefHash === briefHash) {
    return { action: "noop", week, state: previous.state, evidenceHash, briefHash };
  }

  const now = new Date().toISOString();
  const approvalPath = join(weekPath, "approval.json");
  const approvalInvalidated = await exists(approvalPath);
  if (approvalInvalidated) await rm(approvalPath);
  await Promise.all([
    writeAtomic(join(weekPath, "evidence.json"), evidenceBody),
    writeAtomic(join(weekPath, "brief.md"), brief),
  ]);
  const run = {
    schemaVersion: 1,
    week,
    state: "approval_pending",
    sourceWindow: evidence.window || null,
    evidenceHash,
    briefHash,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    notificationKey: `weekly-field-notes:${week}:brief:${briefHash}`,
    notificationSent: previous?.notificationKey === `weekly-field-notes:${week}:brief:${briefHash}`
      ? Boolean(previous.notificationSent)
      : false,
    consecutiveInfrastructureFailures: previous?.consecutiveInfrastructureFailures || 0,
  };
  await writeAtomic(runPath, run);
  return { action: previous ? "updated" : "created", week, state: run.state, evidenceHash, briefHash, approvalInvalidated };
}

async function approve(options) {
  const stateRoot = required(options, "state-root");
  const week = required(options, "week");
  if (required(options, "phrase") !== APPROVAL_PHRASE) {
    throw new Error(`Approval requires the exact approval phrase: ${APPROVAL_PHRASE}`);
  }
  const weekPath = join(stateRoot, week);
  const [brief, run] = await Promise.all([
    readText(join(weekPath, "brief.md")),
    readJson(join(weekPath, "run.json")),
  ]);
  const approval = makeApproval({ week, brief, identity: required(options, "identity") });
  await writeAtomic(join(weekPath, "approval.json"), approval);
  await writeAtomic(join(weekPath, "run.json"), {
    ...run,
    state: "brief_approved",
    briefHash: approval.briefHash,
    updatedAt: new Date().toISOString(),
  });
  return { action: "approved", week, state: "brief_approved", briefHash: approval.briefHash };
}

async function check(options) {
  const stateRoot = required(options, "state-root");
  const week = required(options, "week");
  const weekPath = join(stateRoot, week);
  const [brief, draft, approval, rules, privateTerms, localCorpus, run] = await Promise.all([
    readText(join(weekPath, "brief.md")),
    readText(join(weekPath, "draft.md")),
    readOptionalJson(join(weekPath, "approval.json")),
    readJson(required(options, "rules")),
    loadPrivateTerms(options),
    readOptionalJson(options.corpus, []),
    readJson(join(weekPath, "run.json")),
  ]);
  const receipts = {
    web: await readOptionalJson(join(weekPath, "web-check.json")),
    facts: await readOptionalJson(join(weekPath, "fact-check.json")),
    editorial: await readOptionalJson(join(weekPath, "editorial-check.json")),
    branch: await readOptionalJson(join(weekPath, "branch-check.json")),
  };
  const report = evaluatePublicationGates({ week, brief, draft, approval, rules, privateTerms, localCorpus, receipts });
  await writeAtomic(join(weekPath, "gate-report.json"), report);
  await writeAtomic(join(weekPath, "run.json"), { ...run, state: report.state, updatedAt: new Date().toISOString() });
  return report;
}

async function status(options) {
  const stateRoot = required(options, "state-root");
  const week = required(options, "week");
  const weekPath = join(stateRoot, week);
  const run = await readJson(join(weekPath, "run.json"));
  return {
    week,
    state: run.state,
    evidenceHash: run.evidenceHash,
    briefHash: run.briefHash,
    hasApproval: await exists(join(weekPath, "approval.json")),
    hasDraft: await exists(join(weekPath, "draft.md")),
    hasGateReport: await exists(join(weekPath, "gate-report.json")),
  };
}

export async function main(argv = process.argv.slice(2)) {
  const { command, options } = parseArgs(argv);
  const commands = { "init-week": initWeek, approve, check, status };
  if (!commands[command]) throw new Error("Command must be init-week, approve, check, or status");
  return commands[command](options);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = await main();
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`Weekly Field Notes: ${error.message}\n`);
    process.exitCode = 1;
  }
}
