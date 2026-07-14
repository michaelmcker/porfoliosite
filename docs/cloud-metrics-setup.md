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
