# Cypress regression checks

Start Vite with `npm run dev`, then use `npm run cy:run` (all), `npm run cy:open` (interactive), or `npm run cy:user`, `npm run cy:admin`, `npm run cy:medical`.

Exactly 100 cases per role: 20 authentication cases at mobile (390), tablet (768), and desktop (1440) widths, plus four outage/rendering checks for ten routes. Total: 300 cases. Viewport repetitions are deliberate responsive regressions, not 300 unique business workflows.

API calls are intercepted; no real credentials, emails, or account writes. Authentication covers required fields, invalid input, password visibility, recovery/registration navigation, payloads, rejection, server errors, rate limits, pending requests, network failures, retries, token persistence, and OTP gating. Route cases use a seeded local session and an explicit 503 response. They check resilience, not successful backend integration. Uncaught exceptions fail tests; none are suppressed.

This suite does NOT prove backend role authorization, successful email/Google login, CRUD persistence, or successful dashboard data rendering. Add separate integration fixtures and dedicated disposable accounts for those. Admin/medical routes currently lack a route-level role guard in AppRoutes; the seeded-session cases do not validate that security boundary.

Failures produce screenshots under cypress/screenshots. Review failures rather than weakening assertions. No full-suite pass is claimed until a run completes.
