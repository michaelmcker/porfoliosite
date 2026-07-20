import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDateWindow,
  buildSnapshot,
  collectDataForSeo,
  collectGa4,
} from "../scripts/refresh-cool-runnings-metrics.mjs";

test("buildDateWindow returns an inclusive 28-day window with lag", () => {
  assert.deepEqual(buildDateWindow(new Date("2026-07-13T18:00:00Z"), 28, 3), {
    startDate: "2026-06-13",
    endDate: "2026-07-10",
  });
});

test("collectDataForSeo reports ranking keyword and page totals", async () => {
  const responses = [
    { status_code: 20000, tasks_error: 0, tasks: [{ status_code: 20000, result: [{ total_count: 42 }] }] },
    { status_code: 20000, tasks_error: 0, tasks: [{ status_code: 20000, result: [{ total_count: 13 }] }] },
  ];
  const fetchImpl = async () => ({ ok: true, json: async () => responses.shift() });
  const result = await collectDataForSeo({
    login: "login",
    password: "password",
    target: "example.com",
    fetchImpl,
  });
  assert.deepEqual(result, { rankedKeywords: 42, rankingPages: 13, sourceUpdatedAt: null });
});

test("collectGa4 preserves the GA4 properties path segment", async () => {
  let requestedUrl = "";
  const fetchImpl = async (url) => {
    requestedUrl = url;
    return { ok: true, json: async () => ({ rows: [] }) };
  };

  await collectGa4({
    accessToken: "analytics-token",
    propertyId: "properties/527841655",
    window: { startDate: "2026-06-22", endDate: "2026-07-19" },
    fetchImpl,
  });

  assert.equal(
    requestedUrl,
    "https://analyticsdata.googleapis.com/v1beta/properties/527841655:runReport",
  );
});

test("buildSnapshot does not return a partial snapshot", async () => {
  const fetchImpl = async (url, options) => {
    if (url.includes("searchAnalytics")) {
      const body = JSON.parse(options.body);
      if (!body.dimensions) return { ok: true, json: async () => ({ rows: [{ clicks: 10, impressions: 100 }] }) };
      return {
        ok: true,
        json: async () => ({ rows: [{ keys: ["one"], position: 4 }, { keys: ["two"], position: 14 }] }),
      };
    }
    if (url.includes("analyticsdata")) {
      return {
        ok: true,
        json: async () => ({ rows: [
          { dimensionValues: [{ value: "generate_lead" }], metricValues: [{ value: "2" }] },
          { dimensionValues: [{ value: "phone_call" }], metricValues: [{ value: "3" }] },
        ] }),
      };
    }
    if (url.includes("ranked_keywords")) {
      return { ok: true, json: async () => ({ status_code: 20000, tasks_error: 0, tasks: [{ status_code: 20000, result: [{ total_count: 8 }] }] }) };
    }
    if (url.includes("relevant_pages")) {
      return { ok: true, json: async () => ({ status_code: 20000, tasks_error: 0, tasks: [{ status_code: 20000, result: [{ total_count: 5 }] }] }) };
    }
    throw new Error(`Unexpected URL ${url}`);
  };
  const snapshot = await buildSnapshot({
    env: {
      GSC_SITE_URL: "sc-domain:example.com",
      GA4_PROPERTY_ID: "properties/123",
      DATAFORSEO_LOGIN: "login",
      DATAFORSEO_PASSWORD: "password",
      DATAFORSEO_TARGET: "example.com",
    },
    now: new Date("2026-07-13T18:00:00Z"),
    fetchImpl,
    accessToken: "token",
  });
  assert.equal(snapshot.update.state, "verified");
  assert.equal(snapshot.metrics.searchConsole.pageRowsPosition1To10, 1);
  assert.equal(snapshot.metrics.ga4.websiteConversions, 5);
  assert.equal(snapshot.metrics.dataForSeo.rankingPages, 5);
});

test("buildSnapshot sends distinct scoped tokens to Search Console and GA4", async () => {
  const googleAuthorizations = [];
  const fetchImpl = async (url, options) => {
    if (url.includes("searchAnalytics")) {
      googleAuthorizations.push({ source: "gsc", authorization: options.headers.authorization });
      const body = JSON.parse(options.body);
      if (!body.dimensions) {
        return { ok: true, json: async () => ({ rows: [{ clicks: 10, impressions: 100 }] }) };
      }
      return { ok: true, json: async () => ({ rows: [] }) };
    }
    if (url.includes("analyticsdata")) {
      googleAuthorizations.push({ source: "ga4", authorization: options.headers.authorization });
      return { ok: true, json: async () => ({ rows: [] }) };
    }
    if (url.includes("ranked_keywords") || url.includes("relevant_pages")) {
      return {
        ok: true,
        json: async () => ({
          status_code: 20000,
          tasks_error: 0,
          tasks: [{ status_code: 20000, result: [{ total_count: 0 }] }],
        }),
      };
    }
    throw new Error(`Unexpected URL ${url}`);
  };

  await buildSnapshot({
    env: {
      GSC_SITE_URL: "sc-domain:example.com",
      GA4_PROPERTY_ID: "properties/123",
      DATAFORSEO_LOGIN: "login",
      DATAFORSEO_PASSWORD: "password",
      DATAFORSEO_TARGET: "example.com",
    },
    now: new Date("2026-07-20T18:00:00Z"),
    fetchImpl,
    accessTokens: {
      searchConsole: "search-console-token",
      ga4: "analytics-token",
    },
  });

  assert.deepEqual(
    new Set(
      googleAuthorizations
        .filter(({ source }) => source === "gsc")
        .map(({ authorization }) => authorization),
    ),
    new Set(["Bearer search-console-token"]),
  );
  assert.deepEqual(
    new Set(
      googleAuthorizations
        .filter(({ source }) => source === "ga4")
        .map(({ authorization }) => authorization),
    ),
    new Set(["Bearer analytics-token"]),
  );
});
