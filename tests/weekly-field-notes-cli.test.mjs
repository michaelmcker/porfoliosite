import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const rootPath = new URL("../", import.meta.url).pathname;
const cliPath = join(rootPath, "scripts/weekly-field-notes/cli.mjs");
const rulesPath = join(rootPath, "content/field-notes/rules.json");
const briefPath = join(rootPath, "tests/fixtures/weekly-field-notes/safe-brief.md");
const draftPath = join(rootPath, "tests/fixtures/weekly-field-notes/safe-draft.md");

async function run(args, { reject = true } = {}) {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [cliPath, ...args], { cwd: rootPath });
    assert.equal(stderr, "");
    return JSON.parse(stdout);
  } catch (error) {
    if (reject) throw error;
    return { code: error.code, stdout: error.stdout, stderr: error.stderr };
  }
}

async function makeWeek() {
  const temp = await mkdtemp(join(tmpdir(), "weekly-field-notes-"));
  const stateRoot = join(temp, "state");
  const evidencePath = join(temp, "evidence.json");
  await writeFile(evidencePath, JSON.stringify({
    schemaVersion: 1,
    week: "2026-W31",
    window: { start: "2026-07-25", end: "2026-07-31" },
    observations: [{ category: "friction", note: "A shortcut hid the source of a decision." }],
    sourceTypes: ["task_summary", "git_metadata"],
  }));
  return { temp, stateRoot, evidencePath, weekPath: join(stateRoot, "2026-W31") };
}

async function initWeek(paths) {
  return run([
    "init-week",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--evidence", paths.evidencePath,
    "--brief", briefPath,
    "--rules", rulesPath,
  ]);
}

test("init-week is idempotent and invalidates approval when evidence changes", async () => {
  const paths = await makeWeek();
  const first = await initWeek(paths);
  assert.equal(first.action, "created");
  assert.deepEqual((await readdir(paths.weekPath)).sort(), ["brief.md", "evidence.json", "run.json"]);

  const initialRun = JSON.parse(await readFile(join(paths.weekPath, "run.json"), "utf8"));
  const second = await initWeek(paths);
  assert.equal(second.action, "noop");
  assert.deepEqual(JSON.parse(await readFile(join(paths.weekPath, "run.json"), "utf8")), initialRun);

  await run([
    "approve",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--phrase", "Approve this week's brief.",
    "--identity", "Mike",
  ]);
  assert.ok((await readdir(paths.weekPath)).includes("approval.json"));

  const evidence = JSON.parse(await readFile(paths.evidencePath, "utf8"));
  evidence.observations.push({ category: "adjustment", note: "The proof moved into a clean workspace." });
  await writeFile(paths.evidencePath, JSON.stringify(evidence));
  const changed = await initWeek(paths);
  assert.equal(changed.action, "updated");
  assert.equal(changed.approvalInvalidated, true);
  assert.ok(!(await readdir(paths.weekPath)).includes("approval.json"));
});

test("approve requires the exact phrase and binds the current brief hash", async () => {
  const paths = await makeWeek();
  await initWeek(paths);

  const rejected = await run([
    "approve",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--phrase", "Looks good",
    "--identity", "Mike",
  ], { reject: false });
  assert.notEqual(rejected.code, 0);
  assert.match(rejected.stderr, /exact approval phrase/i);

  const accepted = await run([
    "approve",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--phrase", "Approve this week's brief.",
    "--identity", "Mike",
  ]);
  assert.equal(accepted.action, "approved");

  const approval = JSON.parse(await readFile(join(paths.weekPath, "approval.json"), "utf8"));
  const runState = JSON.parse(await readFile(join(paths.weekPath, "run.json"), "utf8"));
  assert.equal(approval.briefHash, runState.briefHash);
  assert.equal(runState.state, "brief_approved");
});

test("check creates a finished withheld draft, then publish-ready state after approval", async () => {
  const paths = await makeWeek();
  await initWeek(paths);
  await writeFile(join(paths.weekPath, "draft.md"), await readFile(draftPath, "utf8"));
  await writeFile(join(paths.weekPath, "web-check.json"), JSON.stringify({ status: "pass", checkedAt: "2026-08-02T16:00:00.000Z", queryCount: 4, matches: [] }));
  await writeFile(join(paths.weekPath, "fact-check.json"), JSON.stringify({ status: "pass", checkedAt: "2026-08-02T16:01:00.000Z", unsupportedClaims: [] }));
  await writeFile(join(paths.weekPath, "editorial-check.json"), JSON.stringify({ status: "pass", checkedAt: "2026-08-02T16:02:00.000Z", blockingIssues: [] }));
  await writeFile(join(paths.weekPath, "branch-check.json"), JSON.stringify({ status: "pass", checkedAt: "2026-08-02T16:03:00.000Z", baseSha: "abc", remoteSha: "abc", testsPassed: true }));

  const withheld = await run([
    "check",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--rules", rulesPath,
  ]);
  assert.equal(withheld.state, "draft_ready_review_required");
  assert.equal(withheld.publishAllowed, false);

  await run([
    "approve",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--phrase", "Approve this week's brief.",
    "--identity", "Mike",
  ]);
  const ready = await run([
    "check",
    "--state-root", paths.stateRoot,
    "--week", "2026-W31",
    "--rules", rulesPath,
  ]);
  assert.equal(ready.state, "publish_ready");
  assert.equal(ready.publishAllowed, true);

  const status = await run(["status", "--state-root", paths.stateRoot, "--week", "2026-W31"]);
  assert.equal(status.state, "publish_ready");
  assert.equal(status.hasApproval, true);
  assert.equal(status.hasDraft, true);
});
