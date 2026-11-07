> Updated workspace layout: see [frontend-workspaces.md](frontend-workspaces.md). App routes/providers now live under apps/main-frontend/src and apps/admin-frontend/src; reusable modules formerly under src live under packages/shared/src.

# Frontend maintenance guide

## Ownership
- `src/app/roles.js`: workspace identity aliases, navigation, home/login paths, logout action and optional conversation endpoint.
- `src/routes/AppRoutes.jsx`: actual pages and role-protected route groups.
- `src/layouts/DashboardLayout.jsx`: common workspace shell; never copy it to add a role.
- `src/features/<domain>`: domain pages, workflows and APIs. Keep role-specific credentials and approvals in their existing services.
- `src/components/ui`: reusable presentation: ModalLayer, Avatar, ProfileInput.
- `src/services`: shared HTTP and notification transport. Notification subscribers share one stream per credential.

## Add a role
1. Implement backend authorization, login/session payload and role-specific data access first. Hiding navigation is not authorization.
2. Add a stable role key to roles.js; include actual identity aliases returned by auth, token key and login/logout integration.
3. Add its guarded route group to AppRoutes. Use DashboardLayout with the role key.
4. Add navigation entries matching registered child routes; preserve deep links for details.
5. Verify wrong-role access, reload, logout, notifications, mobile navigation and expired credentials.

## Remove a role
Remove its route group and registry entry together; redirect retired links intentionally. Remove login/session integration only after verifying backend and existing accounts. Do not delete domain components reused by other roles.

## Add a feature
Create its feature components and API module. Register the page, then its navigation entry. Define badge meaning explicitly (unread, pending approval, open tickets), not total records. Use ModalLayer for overlays and shared chat presentation instead of copying markup. Include loading, empty, error and permission states.

## Checks
Use the repository's Vite build command and focused lint/tests for changed modules. `node node_modules/vite/bin/vite.js build` works when the local npm launcher is broken. Browser verification is separate from compilation. Do not mark checklist items complete without evidence.

## Known follow-up work
The large AuthContext and explicit route tree still require incremental decomposition. The registry is a foundation, not a dynamic role-management product. Backend/mobile semantic audit and authenticated browser regression checks remain pending; see public-pages-cleanup.md.
