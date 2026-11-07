# Frontend lint baseline — 2026-11-08

Command: node node_modules/eslint/bin/eslint.js apps packages

Exit: 0. Errors: 0. Warnings: 19.

Remaining warnings: react-hooks/exhaustive-deps (19). No hook rule suppressions added. JSX component parameters are now marked used by the local JSX binding rule; both used and unused cases were checked.

## Remaining hook warnings

- /apps/admin-frontend/src/features/admin/components/AdminArticleSection.jsx:40 — React Hook useEffect has a missing dependency: 'fetchArticles'. Either include it or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/AdminContactSection.jsx:35 — React Hook useEffect has a missing dependency: 'fetchTickets'. Either include it or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/AdminMedicalChatSection.jsx:52 — React Hook useEffect has missing dependencies: 'fetchConversations' and 'fetchOfficerDetails'. Either include them or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/AdminMedicalChatSection.jsx:89 — React Hook useEffect has missing dependencies: 'fetchConversations' and 'fetchMessages'. Either include them or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/AdminMedicalChatSection.jsx:103 — React Hook useEffect has missing dependencies: 'currentOfficer' and 'fetchMessages'. Either include them or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/AdminPredictionOversight.jsx:28 — React Hook useEffect has a missing dependency: 'fetchPredictions'. Either include it or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/GlobalAuditOversight.jsx:31 — React Hook useEffect has a missing dependency: 'fetchLogs'. Either include it or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/MedicalOfficerManagementSection.jsx:47 — React Hook useEffect has a missing dependency: 'fetchMedicalOfficers'. Either include it or remove the dependency array.
- /apps/admin-frontend/src/features/admin/components/UserManagementSection.jsx:29 — React Hook useEffect has a missing dependency: 'fetchUsers'. Either include it or remove the dependency array.
- /apps/main-frontend/src/features/medical/components/MedicalArticleSection.jsx:32 — React Hook useEffect has a missing dependency: 'fetchArticles'. Either include it or remove the dependency array.
- /apps/main-frontend/src/features/medical/components/MedicalOfficerArticleViewPage.jsx:25 — React Hook useEffect has a missing dependency: 'fetchArticle'. Either include it or remove the dependency array.
- /apps/main-frontend/src/features/user/components/PredictionHistorySection.jsx:19 — React Hook useEffect has a missing dependency: 'fetchHistory'. Either include it or remove the dependency array.
- /apps/main-frontend/src/features/user/components/SecuritySection.jsx:18 — React Hook useEffect has a missing dependency: 'refreshUser'. Either include it or remove the dependency array.
- /apps/main-frontend/src/features/user/components/UserArticleViewPage.jsx:23 — React Hook useEffect has a missing dependency: 'fetchArticle'. Either include it or remove the dependency array.
- /apps/main-frontend/src/pages/user/Chat.jsx:137 — React Hook useEffect has missing dependencies: 'fetchConversations' and 'fetchMessages'. Either include them or remove the dependency array.
- /apps/main-frontend/src/pages/user/CommunityFeed.jsx:114 — React Hook useEffect has a missing dependency: 'fetchArticles'. Either include it or remove the dependency array.
- /apps/main-frontend/src/pages/user/Dashboard.jsx:44 — React Hook useEffect has missing dependencies: 'activeUser' and 'refreshUser'. Either include them or remove the dependency array.
- /packages/shared/src/components/notifications/NotificationToasts.jsx:35 — React Hook useEffect has a missing dependency: 'activeUser'. Either include it or remove the dependency array.
- /packages/shared/src/features/chat/components/MedicalOfficerSelector.jsx:56 — React Hook useEffect has a missing dependency: 'fetchMedicalOfficers'. Either include it or remove the dependency array.
