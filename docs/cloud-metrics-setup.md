# Cloud Metrics Setup

The portfolio reads Cool Runnings proof from a checked-in JSON snapshot; the browser never receives API credentials. The laptop-bound Codex automation was deleted on July 20, 2026. The intended production refresh is the scheduled GitHub Action at 14:23 UTC, authenticated to Google through short-lived Workload Identity Federation.

## Google authentication

1. Create a Google Cloud service account for the portfolio metrics job.
2. Create a Workload Identity Pool and GitHub OIDC provider restricted to `michaelmcker/porfoliosite`.
3. Allow that provider to impersonate the service account with `roles/iam.workloadIdentityUser`.
4. Add the service-account email as a Viewer in GA4 property `527841655`.
5. Add the same email as a user on Search Console property `sc-domain:coolrunningslandscaping.com`.
6. Enable the Google Analytics Data API and Search Console API in the Google Cloud project.

Repository configuration:

- Variable: `GCP_PROJECT_ID`
- Variable: `GCP_WORKLOAD_IDENTITY_PROVIDER`
- Variable: `GCP_SERVICE_ACCOUNT`
- Secret: `DATAFORSEO_LOGIN`
- Secret: `DATAFORSEO_PASSWORD`

The three Google values are non-secret identifiers. `google-github-actions/auth` exchanges the workflow's signed GitHub OIDC token for a short-lived Google credential. Do not upload local authorized-user JSON or OAuth refresh tokens to GitHub.

## Refresh contract

- Search Console: latest complete 28-day window with a three-day data lag.
- GA4: latest complete 28-day window ending yesterday.
- DataForSEO: current weekly ranking database, checked daily.
- The snapshot is written only after every configured source succeeds.
- The GitHub Action commits a changed snapshot and pushes it; Vercel deploys that commit through its Git integration.
- The workflow waits for production to serve the exact new `generatedAt` value before succeeding.
- The local credential-path environment variables remain supported for manual diagnostics only; they are not the production authentication path.

Exact Google Business Profile calls, directions, and profile views require a separate Business Profile OAuth refresh token. They are intentionally not inferred from GA4.

## Scheduled-run diagnosis and resolution — July 20, 2026

The refresh code did not reach Google Analytics, Search Console, or DataForSEO in the five scheduled failures from July 14 through July 18. GitHub Actions stopped at `google-github-actions/auth@v3` with:

> the GitHub Action workflow must specify exactly one of "workload_identity_provider" or "credentials_json"

Repository inspection confirms `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` exist, while the Google configuration is absent:

- repository variable `GCP_PROJECT_ID`;
- repository variable `GCP_WORKLOAD_IDENTITY_PROVIDER`;
- repository variable `GCP_SERVICE_ACCOUNT`.

The scheduled GitHub path had two independent blockers:

1. Workload Identity values were absent, so the workflow stopped before the refresh script.
2. The GA4 request encoded `properties/527841655` as a URL segment and produced an invalid property path.

The GA4 path is fixed and covered by a regression test. A complete local refresh on July 20 succeeded against Search Console, GA4, and DataForSEO, then wrote a verified snapshot. The GitHub workflow now has both a daily schedule and manual trigger, but it is not operational until Workload Identity and property access are configured and one manual run passes.

The production workflow must complete every source before writing, commit only the metrics snapshot when it changes, push `main`, and verify the deployed case-study JSON. Any source failure leaves the previous verified snapshot intact.

The separate Cool Runnings Vercel cron is a second, not-yet-live path. Its local implementation passes 31 focused tests and already distinguishes GA4 conversions, explicitly campaign-tagged Business Profile sessions, and direct Business Profile Performance API metrics. The linked Vercel project currently has GA4, Search Console, and Blob values but is missing `CRON_SECRET`, Google Workload Identity configuration, and optional Business Profile OAuth/location configuration. The route code is also uncommitted in that separate worktree. Do not confuse the passing local implementation with an operational production refresh.
