import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleAuth } from "google-auth-library";

const SEARCH_CONSOLE_API = "https://www.googleapis.com/webmasters/v3/sites";
const GA4_API = "https://analyticsdata.googleapis.com/v1beta/properties";
const DATAFORSEO_API = "https://api.dataforseo.com/v3/dataforseo_labs/google";
const ROW_LIMIT = 25000;
const ACTION_EVENTS = ["generate_lead", "phone_call", "whatsapp_click"];

export function buildDateWindow(now, days = 28, lagDays = 1) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - lagDays));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function requestJson(url, options = {}, fetchImpl = fetch) {
  const response = await fetchImpl(url, options);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

function googlePost(accessToken, body) {
  return {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function querySearchConsole({ accessToken, siteUrl, window, dimensions, fetchImpl }) {
  const body = {
    startDate: window.startDate,
    endDate: window.endDate,
    dataState: "final",
    rowLimit: ROW_LIMIT,
  };
  if (dimensions) body.dimensions = dimensions;
  return requestJson(
    `${SEARCH_CONSOLE_API}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    googlePost(accessToken, body),
    fetchImpl,
  );
}

export async function collectSearchConsole({ accessToken, siteUrl, window, fetchImpl = fetch }) {
  const [aggregateResponse, pageResponse, queryResponse] = await Promise.all([
    querySearchConsole({ accessToken, siteUrl, window, fetchImpl }),
    querySearchConsole({ accessToken, siteUrl, window, dimensions: ["page"], fetchImpl }),
    querySearchConsole({ accessToken, siteUrl, window, dimensions: ["query"], fetchImpl }),
  ]);
  const aggregate = aggregateResponse.rows?.[0] || {};
  const pageRows = pageResponse.rows || [];
  const queryRows = queryResponse.rows || [];
  const isPageOne = (row) => Number(row.position) > 0 && Number(row.position) <= 10;
  return {
    clicks: Number(aggregate.clicks || 0),
    impressions: Number(aggregate.impressions || 0),
    pageRows: pageRows.length,
    pageRowsPosition1To10: pageRows.filter(isPageOne).length,
    queryRows: queryRows.length,
    queryRowsPosition1To10: queryRows.filter(isPageOne).length,
  };
}

export async function collectGa4({ accessToken, propertyId, window, fetchImpl = fetch }) {
  const response = await requestJson(
    `${GA4_API}/${encodeURIComponent(propertyId)}:runReport`,
    googlePost(accessToken, {
      dateRanges: [window],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: { values: ACTION_EVENTS, caseSensitive: true },
        },
      },
    }),
    fetchImpl,
  );
  const counts = Object.fromEntries((response.rows || []).map((row) => [
    row.dimensionValues?.[0]?.value,
    Number(row.metricValues?.[0]?.value || 0),
  ]));
  const formSubmissions = Number(counts.generate_lead || 0);
  const phoneClicks = Number(counts.phone_call || 0);
  const whatsappClicks = Number(counts.whatsapp_click || 0);
  return {
    formSubmissions,
    phoneClicks,
    whatsappClicks,
    websiteConversions: formSubmissions + phoneClicks + whatsappClicks,
    trackedActions: formSubmissions + phoneClicks + whatsappClicks,
  };
}

function dataForSeoPost(login, password, body) {
  return {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify([body]),
  };
}

async function queryDataForSeo({ endpoint, login, password, body, fetchImpl }) {
  const payload = await requestJson(
    `${DATAFORSEO_API}/${endpoint}/live`,
    dataForSeoPost(login, password, body),
    fetchImpl,
  );
  if (payload.status_code !== 20000 || payload.tasks_error) {
    throw new Error(`DataForSEO failed: ${payload.status_code} ${payload.status_message}`);
  }
  const task = payload.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    throw new Error(`DataForSEO task failed: ${task?.status_code} ${task?.status_message}`);
  }
  return task.result?.[0] || {};
}

export async function collectDataForSeo({
  login,
  password,
  target,
  locationName = "Canada",
  languageName = "English",
  fetchImpl = fetch,
}) {
  const common = {
    target,
    location_name: locationName,
    language_name: languageName,
    limit: 1,
  };
  const [keywords, pages] = await Promise.all([
    queryDataForSeo({ endpoint: "ranked_keywords", login, password, body: common, fetchImpl }),
    queryDataForSeo({ endpoint: "relevant_pages", login, password, body: common, fetchImpl }),
  ]);
  return {
    rankedKeywords: Number(keywords.total_count || 0),
    rankingPages: Number(pages.total_count || 0),
    sourceUpdatedAt: keywords.items?.[0]?.keyword_data?.keyword_info?.last_updated_time || null,
  };
}

function requireEnv(env, names) {
  const missing = names.filter((name) => !env[name]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

async function getGoogleAccessToken() {
  const auth = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("Google OIDC credential did not produce an access token");
  return token.token;
}

export async function buildSnapshot({ env = process.env, now = new Date(), fetchImpl = fetch, accessToken }) {
  requireEnv(env, [
    "GSC_SITE_URL",
    "GA4_PROPERTY_ID",
    "DATAFORSEO_LOGIN",
    "DATAFORSEO_PASSWORD",
    "DATAFORSEO_TARGET",
  ]);
  const searchConsoleWindow = buildDateWindow(now, 28, Number(env.GSC_DATA_LAG_DAYS || 3));
  const ga4Window = buildDateWindow(now, 28, 1);
  const googleToken = accessToken || await getGoogleAccessToken();
  const [searchConsole, ga4, dataForSeo] = await Promise.all([
    collectSearchConsole({ accessToken: googleToken, siteUrl: env.GSC_SITE_URL, window: searchConsoleWindow, fetchImpl }),
    collectGa4({ accessToken: googleToken, propertyId: env.GA4_PROPERTY_ID, window: ga4Window, fetchImpl }),
    collectDataForSeo({
      login: env.DATAFORSEO_LOGIN,
      password: env.DATAFORSEO_PASSWORD,
      target: env.DATAFORSEO_TARGET,
      locationName: env.DATAFORSEO_LOCATION_NAME || "Canada",
      languageName: env.DATAFORSEO_LANGUAGE_NAME || "English",
      fetchImpl,
    }),
  ]);
  return {
    schemaVersion: 2,
    generatedAt: now.toISOString(),
    windows: {
      searchConsole: searchConsoleWindow,
      ga4: ga4Window,
      dataForSeo: { cadence: "weekly database, checked daily" },
      googleBusinessProfile: null,
    },
    metrics: { searchConsole, ga4, dataForSeo, googleBusinessProfile: null },
    update: { state: "verified", generatedAt: now.toISOString() },
  };
}

async function main() {
  const snapshot = await buildSnapshot({});
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = resolve(currentDir, "../data/cool-runnings-metrics-current.json");
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  process.stdout.write(`Updated ${outputPath} at ${snapshot.generatedAt}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
