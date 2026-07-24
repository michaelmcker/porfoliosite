import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function formatMetricsSummary(snapshot) {
  const searchConsole = snapshot.windows.searchConsole;
  const ga4 = snapshot.windows.ga4;
  const dataForSeo = snapshot.metrics.dataForSeo;

  return [
    "## Cool Runnings metrics freshness",
    "",
    `Snapshot generated: ${snapshot.generatedAt}`,
    "",
    "| Source | Current data window | Notes |",
    "| --- | --- | --- |",
    `| Search Console | ${searchConsole.startDate} to ${searchConsole.endDate} | Uses a deliberate three-day reporting lag |`,
    `| Google Analytics 4 | ${ga4.startDate} to ${ga4.endDate} | Uses yesterday as the latest complete day |`,
    `| DataForSEO | ${dataForSeo.sourceUpdatedAt} | Weekly database, checked daily |`,
    "",
  ].join("\n");
}

export async function writeMetricsSummary({
  snapshotPath = resolve("data/cool-runnings-metrics-current.json"),
  outputPath = process.env.GITHUB_STEP_SUMMARY,
} = {}) {
  if (!outputPath) throw new Error("GITHUB_STEP_SUMMARY is required");
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
  await appendFile(outputPath, formatMetricsSummary(snapshot));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await writeMetricsSummary();
}
