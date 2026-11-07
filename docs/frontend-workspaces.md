# Running and maintaining the frontend workspaces

Run commands from `wildlife_safty_website` after `npm ci`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Main app on port 5173 |
| `npm run dev:admin` | Admin app on port 5174 |
| `npm run build:main` | Build apps/main-frontend/dist |
| `npm run build:admin` | Build apps/admin-frontend/dist |
| `npm run build` | Build both applications |
| `npm run test:architecture` | Session tests and boundary/main-manifest checks (build main first) |

From the parent project, `python start.py web`, `python start.py admin`, or `python start.py all` are supported. Admin login is http://localhost:5174/admin/login. Main is http://localhost:5173. Use one hostname consistently; localhost and 127.0.0.1 have different browser storage. Existing admin sessions on the former main origin are intentionally not migrated: sign in on the new admin origin.

Each app owns its entry HTML, Vite config, routes and deployment output. Shared source lives in packages/shared/src and cannot import an application. A source-boundary test prevents cross-app imports; a build-manifest test prevents admin page code entering main's artifact. Workspace dependencies install at the frontend repository root. Build each project from that same workspace checkout; do not copy app folders without their shared package and lockfile.

Environment configuration merges root development .env, app-local .env, then hosting environment variables. VITE_APP_KIND is fixed by each app's build config, not chosen by the user. Configure VITE_API_BASE_URL, VITE_MAIN_APP_URL and VITE_ADMIN_APP_URL; main also needs VITE_ML_URL. DEPLOY_BUILD=true requires HTTPS deployment URLs. Put both frontend origins into backend CORS_ORIGINS; production does not use the development defaults. Never put backend secrets into VITE_ variables.

Host two frontend projects with workspace root as build root; build command build:main / build:admin and output apps/main-frontend/dist / apps/admin-frontend/dist respectively. Each needs SPA rewrites. Root vercel.json defaults to main; override the admin project's output/build settings or use its app-local rewrite configuration. A shared Node API and email worker remain separate runtime services.

RBAC source of truth: backend authorization/policy.js. Authentication creates req.principal from verified account data; role adapters preserve existing req.admin/req.medicalOfficer consumers. Frontend guards use /api/session, not cached localStorage roles. New operations need backend permission + resource checks and negative tests first. Add permissions to canonical role definitions, then UI routes/navigation. This phase does not add a dynamic role editor or merge account collections.

Tests include denied audit access, own-activity boundaries, admin vs superadmin, unapproved medical accounts and stale admin cache isolation. Authenticated end-to-end login, OTP delivery and multi-role workflow regression still require staging/user sessions.
