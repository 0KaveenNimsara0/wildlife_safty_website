# Website cleanup checklist

Updated: 2026-11-06. Checked items are implemented; runtime verification is tracked separately.

## Completed
- [x] Introduce task-focused home page and separate /identify route.
- [x] Combine learning and article browsing; redirect /article-selection.
- [x] Shorten main navigation; preserve contact and wildlife-directory access.
- [x] Remove three unused role sidebars in favor of DashboardLayout.
- [x] Remove no-op auth route wrapper; retain used auth presentation component.
- [x] Make the snake upload area clickable and keyboard accessible.
- [x] Preserve drag/drop, removal and same-file reselection; block image changes during analysis.
- [x] Replace duplicate notification SSE connections with a reference-counted shared connection per session.
- [x] Isolate notification subscriber failures and stop the stream after the last subscriber unmounts.

## Remaining cleanup
- [x] Consolidate ConsultationsSection message presentation with ChatInterface while preserving role APIs and read state.
- [x] Extract shared profile inputs and consolidate base appearance, focus and disabled states; retain distinct verification workflows.
- [x] Trace reset flows: ForgotPassword uses shared-auth OTP endpoints; removed unreferenced legacy ResetPasswordPage.
- [x] Coalesce concurrent notification-list requests per credential; preserve fresh reads after completion.
- [ ] Audit remaining imports/assets and backend duplication.
- [ ] Audit mobile app separately.

## Verification
- [ ] Browser: upload-area click, Enter/Space, cancel, remove, same-file reselection and drag/drop.
- [ ] Browser: one SSE connection across header, sidebar and toast consumers; reconnect and account switching.
- [ ] Regression-check authenticated user/admin/medical workflows.

## Retained intentionally
UserPosts is used by community and its own route. MedicalOfficerArticleHub is used by the medical overview. Both are active reuse, not unused duplicate files.

## Optional content
- [ ] Add a concise How it works/FAQ section once reviewed content is available.

## Audit follow-up (2026-11-06)
- Exact-content source scan completed across website (98), Node API (92), mobile (62), AI backend (10). No exact duplicate source files found; see cross-project-audit.md.
- This scan does not prove semantic feature duplication is absent. Broader backend/mobile workflow review remains open.
- Browser verification attempted through computer-use tooling; inventory and tab creation timed out. Browser checks remain unchecked.
- Targeted lint exposed unused imports/parameters in medical chat; removed them. Existing effect dependency warning remains to resolve with polling lifecycle work.

## Latest cleanup evidence
- [x] Extract duplicate AuthContext session normalization into features/auth/session.js; three Node tests pass.
- [x] Extract Node chat conversation-ID helper; preserve persisted IDs; compatibility check passes.
- [x] Review mobile auth/history/identification boundaries; retain intentional facades and offline workflows (cross-project-audit.md).
- [x] Reject stale medical-chat message responses after conversation switching.
- [ ] Full browser regressions: installed Cypress package lacks its binary; installation attempted.

## Verified in latest pass
- [x] Mobile TypeScript: `tsc --noEmit` passes.
- [x] Auth session normalization: three tests pass.
- [x] Backend mail enqueue / OTP expiry reference / notification event checks pass.
- [x] Medical polling callbacks stabilized; exhaustive-dependencies warning resolved.
- [x] Production frontend build passes after refactor.
- Browser tests cannot start until Cypress binary installation completes; do not treat compilation as browser verification.

## Browser verification update
- [x] In-app browser: identify page renders; clicking Upload a snake photo opens the file chooser.
- [x] Enter on the upload button opens the file chooser; Escape returns focus to the upload button.
- [x] Corrected footer text encoding and the remaining identification CTA destination found during browser inspection.
- [ ] Full Cypress regressions blocked: pinned 16.2.1 binary download stopped at 33,455,993 of 271,022,070 bytes and failed checksum verification. No browser-suite pass is claimed.
- Remaining live checks: real-file selection/removal/drop, authenticated role sessions, toast delivery and stream reconnect/account switching.

- [x] Live browser: signed-out /admin/users redirects to /admin/login; /medical-officer/chat redirects to /medical-officer/login.
- [x] Live browser: /article-selection redirects to /learning and footer identification link resolves to /identify.
- Authenticated live flows remain unverified: the connected browser has no signed-in role session.
