# Architecture cleanup tasks

Updated: 2026-11-07
Design: [architecture-cleanup-plan.md](architecture-cleanup-plan.md).
Status key: `[x]` verified/documented; `[ ]` pending. Existing implementation work is not marked complete merely because it is described in the plan.

## Phase 0 — baseline and detailed audit

- [x] T00 Inventory website/Node/ML source files: 103 / 98 / 14; exact-content scan found no identical source files within these projects.
- [x] T01 Inspect role registry, session resolver, HTTP credential selection, backend guards and representative routes; record findings A01–A13.
- [x] T02 Define independent main/admin frontend architecture, shared API decision, folder structure and migration sequence.
- [x] T03 Create this progress tracker and completion criteria.
- [ ] T04 Capture fresh build/test/lint baselines and Git status for each repository; distinguish pre-existing failures. Evidence: commands, exit codes, relevant logs.
- [ ] T05 Build complete route/method/auth/permission/resource-policy matrix for every Node route, including alternate URLs and shared OTP endpoints. Evidence: no unexplained public sensitive route.
- [ ] T06 Trace static/dynamic imports, router entry points, public assets and CLI scripts; classify unused candidates. Evidence: deletion ledger, not name-based guesses.
- [ ] T07 Compare semantic duplication in auth, articles, profiles, chat, prediction review and forms; record merge/retain rationale.

## Phase 1 — permission foundation (depends on T05)

- [x] T10 Protect global audit access with audit.read; own activity endpoint permits only self or explicit audit access. Update main/admin/medical callers to attach correct credentials; test anonymous, wrong-user, allowed-role cases. Finding A05 is a launch blocker.
- [x] T11 Define canonical roles and preserve admin vs superadmin. Normalize legacy medical aliases at one boundary.
- [x] T12 Add principal adapter and permission registry with deny-by-default behavior. Keep legacy account IDs/collections stable.
- [ ] T13 Apply per-route permissions and resource rules; preserve medical approval/deactivation checks. Add tests for spoofed body identity and alternate-route bypasses.
- [ ] T14 Specify secure role add/remove/delegation behavior; implement roles.manage policy before exposing role-management UI. Test last-superadmin and self-escalation protection.
- [ ] T15 Add server-validated session bootstrap and permission refresh/revocation behavior. Evidence: stale or disabled identity cannot authorize operations.

## Phase 2 — shared frontend foundation (depends on T11–T15)

- [x] T20 Configure npm workspace inside existing website repository; retain Git history and one workspace lockfile.
- [x] T21 Extract minimal UI package: tokens, ModalLayer, Avatar, ProfileInput, buttons and reusable form primitives.
- [ ] T22 Consolidate Axios/fetch credential policy into injected-session API client; normalize errors, multipart uploads and cancellation. Test no credential leakage to other origins.
- [x] T23 Extract shared auth contracts/permission helpers; remove admin-first stored-session selection.
- [ ] T24 Extract reusable feature primitives only where both apps actually consume them. Enforce packages cannot import app internals.

## Phase 3 — independent applications (depends on Phase 2)

- [x] T30 Create apps/main-frontend with its own package, entry point, router, environment example, build and dev port 5173.
- [x] T31 Create apps/admin-frontend with its own package, entry point, admin-only auth provider/router, environment example, build and dev port 5174.
- [x] T32 Move admin login/register, administration pages and navigation into admin app; keep medical/public/user workflows in main.
- [x] T33 Add explicit VITE_MAIN_APP_URL / VITE_ADMIN_APP_URL settings. Preserve approved legacy admin deep links using safe redirects; update cross-app navigation.
- [x] T34 Remove admin routes/providers/features from main imports. Evidence: main dependency graph/build has no admin application modules.
- [ ] T35 Verify independent start/build/preview output, deep-link reloads and simultaneous separate-origin login/logout. Logout in one app must not select a different app's stale credentials.

## Phase 4 — backend/domain and source cleanup (incremental after policy tests)

- [ ] T40 Introduce domain module boundaries and infrastructure adapters; move backend files incrementally while keeping external API contracts.
- [ ] T41 Consolidate article lifecycle mechanics with explicit author/reviewer policies and transition tests.
- [ ] T42 Consolidate shared chat mechanics without changing conversation IDs, participant visibility or unread semantics.
- [ ] T43 Select canonical post-verification endpoint; retain tested aliases until web/mobile callers migrate.
- [ ] T44 Split CommunityFeed, profile sections and AuthContext by responsibility; remove repeated state/networking patterns.
- [ ] T45 Optimize auth background/logo and verify their appearance; remove source assets only after usage review.
- [ ] T46 Delete proven unused source/config/assets from T06 ledger; retain data, secrets, model assets and repo metadata. Run affected builds after each batch.
- [ ] T47 Remove obsolete imports, stale role/route constants and temporary compatibility wrappers once no caller remains.

## Phase 5 — operations, regression and release

- [ ] T50 Update start.py for main/admin/all modes, separate frontend readiness checks and scoped process shutdown.
- [ ] T51 Add CI for both frontend builds, backend permission tests and shared package tests; add route contract checks for mobile compatibility.
- [ ] T52 Configure separate hosting roots/SPA rewrites, HTTPS origins, CORS, Firebase domains and backend worker supervision. Never ship backend secrets in frontend artifacts.
- [ ] T53 Run staging flows for all roles: login/OTP/Google, refresh/logout, denied URLs/API calls, profiles/Cloudinary, articles/review, predictions, chat/unread/toasts, contact tickets and audits.
- [ ] T54 Verify backup restore, deployment rollback, Cloudinary retention and monitoring on selected hosting.
- [ ] T55 Reconcile previous cleanup/deployment docs; record actual remaining limitations. Mark overall cleanup complete only after evidence for T04–T54.

## Deletion ledger

Initial legacy frontend deletion batch completed after workspace/import/config review; broader unused-source review remains pending.

| Path | Why unused/duplicated | Reference checks | Replacement | Validation | State |
| --- | --- | --- | --- | --- | --- |
| root src/ | Empty directories after source relocation; verified zero files | Recursive file inventory | apps/*/src + packages/shared/src | Both builds + boundary test | Removed |
| root dist/ | Stale combined generated build | App Vite output configs | apps/*/dist | Both builds | Removed |
| root vite.config.js | Compatibility forwarding config no longer required | Workspace scripts + launcher | App-local Vite configs; preview now delegates to workspace | Both builds | Removed |
| build-main.log, build-admin.log | Generated verification logs | No runtime dependency | Task log retains outcomes | Build outputs inspected | Removed |
| public/vite.svg | Starter branding | Both HTML references replaced | Bundled project logo favicon | Both builds | Removed |
| packages/shared/src/assets/auth-sidebar.png | No source/config references; active layout imports auth-sidebar1.png | Repository reference search + active AuthLayout | Existing auth-sidebar1.png retained | Both builds | Removed |

## Execution log

| Date | Task | Evidence | Result |
| --- | --- | --- | --- |
| 2026-11-07 | T00 | Pruned filesystem inventory + SHA-256 grouping | 215 source files across 3 projects; no identical source groups within a project |
| 2026-11-07 | T01 | Read role/session/transport/guard implementations and representative routes | A01–A13 documented; audit endpoint auth gap identified |
| 2026-11-07 | T02–T03 | Architecture and task documents created | Planning complete; application split and deletion work not started |

Next executable batch: T04–T07, then T10. Do not start by copying the entire website into two folders: that doubles the maintenance problem.


## Implementation update — 2026-11-07: admin separation and RBAC foundation

- Source moved, not duplicated: `apps/main-frontend/src`, `apps/admin-frontend/src`, `packages/shared/src`.
- Consolidated initial shared packages into one `@wildlife/shared` package to avoid premature package fragmentation. Public API contracts can be split into smaller packages later.
- Admin has its own verified-session provider. Main no longer implements admin auth methods or imports admin pages. Its cached session resolver ignores stale admin storage.
- `/api/session` returns safe identity metadata plus canonical principal/permissions. Role adapters preserve existing controller contracts. Admin/superadmin permissions remain distinct; database account IDs are unchanged.
- Audit endpoints now require authentication and enforce global-audit permission or own-activity access; browser callers attach the selected app credential.
- Explicit permissions added to administration, article, contact and prediction-review/export routes. Full legacy endpoint coverage and dynamic role-management UI remain pending (T13/T14).
- User/medical credential selection is explicit by workspace and selected main session; admin uses only its own origin/session token. Notification fetch/SSE share this selection policy.
- Both independent Vite production builds passed. Source-boundary checker passed and main manifest excludes admin pages. Backend security/RBAC tests: 10 passed; session-isolation tests: 3 passed.
- Browser verified main landing on 5173, admin login on 5174, and old main `/admin/users` redirect to separate admin login. Real authenticated multi-role browser flows remain pending; T35/T53 are not marked complete.
- `start.py admin` and interactive option 9 start admin; `all` includes both apps. Python syntax checked. Process shutdown implementation remains inherited and needs T50's scoped-shutdown review.

Remaining before calling this phase fully regression-tested: authenticated login/OTP and concurrent-origin sessions, expiry/logout behavior, all-role upload/chat/notification workflows. No dynamic account-role migration was performed.

T22 partial: credential policy is unified; complete error/cancellation normalization remains for the API-client cleanup phase.

### Final checks for this batch

- Both final workspace builds passed after source relocation and fixes.
- Undefined-variable scan across app/shared JS/JSX passed. Fixed stale `officerData` in medical profile, stale `apiRole` in notification dropdown, and bundled the header logo using an import.
- Live API: `/health` 200, anonymous `/api/session` 401 and `/api/audit` 401; localhost:5174 CORS allowed.
- App-boundary/main-manifest checks and 3 session-isolation tests passed. Backend suite: 10 security/RBAC tests passed.
- Frontend/backend tracked diffs pass whitespace checks. No account data or conversation identifiers migrated.
- Next sequential batch: complete T05/T13 endpoint-policy coverage and authenticated T35/T53 regression before wider domain/file cleanup.


## Legacy frontend cleanup batch

Removed only the proven obsolete paths listed in the deletion ledger. Kept workspace package/lockfile, shared build/theme configuration, environment files and historical docs with unresolved tasks. Rewrote root README for the current workspace structure and added an admin preview command. Both app builds and boundary checks passed after deletion. T06/T46 remain open for broader source cleanup; this batch does not claim all unused-code candidates have been reviewed.

## Main/admin isolation correction

User requested no admin redirects from the main site. Removed the legacy /admin/* redirect and its cross-origin navigation code. Unknown main-site paths, including /admin/login, now render a local Page not found screen. Prior redirect requirements/checks in this document are superseded by this decision. Admin login remains exclusively on the admin application origin.
