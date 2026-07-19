# Cloud Metrics Setup

The portfolio refreshes Cool Runnings proof daily in GitHub Actions. The browser reads the checked-in JSON snapshot; it never receives API credentials.

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
- The Action commits a changed snapshot; Vercel deploys that commit through its Git integration.

Exact Google Business Profile calls, directions, and profile views require a separate Business Profile OAuth refresh token. They are intentionally not inferred from GA4.

## Current scheduled-run diagnosis — July 19, 2026

The refresh code has not reached Google Analytics, Search Console, or DataForSEO in the five scheduled failures from July 14 through July 18. GitHub Actions stops at `google-github-actions/auth@v3` with:

> the GitHub Action workflow must specify exactly one of "workload_identity_provider" or "credentials_json"

Repository inspection confirms `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` exist, while the Google configuration is absent:

- repository variable `GCP_PROJECT_ID`;
- secret `GCP_WORKLOAD_IDENTITY_PROVIDER`;
- secret `GCP_SERVICE_ACCOUNT`.

This is an external authentication-configuration blocker, not a metrics-query or JSON-rendering failure. Create the Workload Identity provider and service account described above, add the three repository values, then run `Refresh Cool Runnings metrics` manually. A passing run must complete auth, `npm ci`, the refresh script, and either commit a changed snapshot or print `Metrics are unchanged.`

The separate Cool Runnings Vercel cron is a second, not-yet-live path. Its local implementation passes 31 focused tests and already distinguishes GA4 conversions, explicitly campaign-tagged Business Profile sessions, and direct Business Profile Performance API metrics. The linked Vercel project currently has GA4, Search Console, and Blob values but is missing `CRON_SECRET`, Google Workload Identity configuration, and optional Business Profile OAuth/location configuration. The route code is also uncommitted in that separate worktree. Do not confuse the passing local implementation with an operational production refresh.
