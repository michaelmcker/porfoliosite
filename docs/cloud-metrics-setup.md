# Cloud Metrics Setup

The portfolio reads Cool Runnings proof from a checked-in JSON snapshot; the browser never receives API credentials. The live daily refresh runs as a local Codex automation at 7:23 AM America/Vancouver. GitHub Actions remains available as a manual, portable fallback after Workload Identity Federation is configured.

## Google authentication

1. Create a Google Cloud service account for the portfolio metrics job.
2. Create a Workload Identity Pool and GitHub OIDC provider restricted to `michaelmcker/porfoliosite`.
3. Allow that provider to impersonate the service account with `roles/iam.workloadIdentityUser`.
4. Add the service-account email as a Viewer in GA4 property `527841655`.
5. Add the same email as a user on Search Console property `sc-domain:coolrunningslandscaping.com`.
6. Enable the Google Analytics Data API and Search Console API in the Google Cloud project.

Repository configuration:

- Variable: `GCP_PROJECT_ID`
- Secret: `GCP_WORKLOAD_IDENTITY_PROVIDER`
- Secret: `GCP_SERVICE_ACCOUNT`
- Secret: `DATAFORSEO_LOGIN`
- Secret: `DATAFORSEO_PASSWORD`

The Google secrets are identifiers, not a private service-account key. `google-github-actions/auth` exchanges the workflow's GitHub OIDC token for a short-lived Google credential.

## Refresh contract

- Search Console: latest complete 28-day window with a three-day data lag.
- GA4: latest complete 28-day window ending yesterday.
- DataForSEO: current weekly ranking database, checked daily.
- The snapshot is written only after every configured source succeeds.
- The local automation commits a changed snapshot and pushes it; Vercel deploys that commit through its Git integration.
- Local Google credentials stay outside the repository and are passed to the refresh script through `GSC_GOOGLE_APPLICATION_CREDENTIALS` and `GA4_GOOGLE_APPLICATION_CREDENTIALS`.
- The GitHub workflow remains manual until all three Workload Identity values are configured.

Exact Google Business Profile calls, directions, and profile views require a separate Business Profile OAuth refresh token. They are intentionally not inferred from GA4.

## Scheduled-run diagnosis and resolution — July 20, 2026

The refresh code has not reached Google Analytics, Search Console, or DataForSEO in the five scheduled failures from July 14 through July 18. GitHub Actions stops at `google-github-actions/auth@v3` with:

> the GitHub Action workflow must specify exactly one of "workload_identity_provider" or "credentials_json"

Repository inspection confirms `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` exist, while the Google configuration is absent:

- repository variable `GCP_PROJECT_ID`;
- secret `GCP_WORKLOAD_IDENTITY_PROVIDER`;
- secret `GCP_SERVICE_ACCOUNT`.

The original scheduled GitHub path had two independent blockers:

1. Workload Identity values were absent, so the workflow stopped before the refresh script.
2. The GA4 request encoded `properties/527841655` as a URL segment and produced an invalid property path.

The GA4 path is fixed and covered by a regression test. A complete local refresh on July 20 succeeded against Search Console, GA4, and DataForSEO, then wrote a verified snapshot. The broken GitHub schedule is disabled to avoid daily false failures. Its manual trigger stays in place for a future WIF migration.

The active local automation uses separate, least-privilege Google credentials for Search Console and GA4. It must complete every source before writing, commit only the metrics snapshot when it changes, push `main`, and verify the deployed case-study JSON. Any source failure leaves the previous verified snapshot intact.

The separate Cool Runnings Vercel cron is a second, not-yet-live path. Its local implementation passes 31 focused tests and already distinguishes GA4 conversions, explicitly campaign-tagged Business Profile sessions, and direct Business Profile Performance API metrics. The linked Vercel project currently has GA4, Search Console, and Blob values but is missing `CRON_SECRET`, Google Workload Identity configuration, and optional Business Profile OAuth/location configuration. The route code is also uncommitted in that separate worktree. Do not confuse the passing local implementation with an operational production refresh.
