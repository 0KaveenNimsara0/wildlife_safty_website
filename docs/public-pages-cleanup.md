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
- [ ] Consolidate ConsultationsSection message presentation with ChatInterface while preserving role APIs and read state.
- [ ] Extract shared profile form presentation without merging distinct verification workflows.
- [ ] Trace generated password-reset links before removing apparently unused ResetPasswordPage.
- [ ] Consolidate repeated notification data fetches; shared transport alone does not eliminate these.
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
