# Codebase cleanup and separate admin application

Date: 2026-11-07
Status: frontend separation and RBAC foundation implemented on 2026-11-07; remaining domain cleanup and authenticated regression gates tracked separately.
Execution tracker: [architecture-cleanup-tasks.md](architecture-cleanup-tasks.md).

## 1. Objective and boundaries

Create independently runnable/deployable main and admin frontend projects, consolidate repeated domain logic, and enforce backend permissions consistently. Preserve existing accounts, Cloudinary URLs, conversation IDs, medical approval flows and mobile API compatibility.

This pass inventories website, Node API and Python ML sources. Mobile is a compatibility consumer; its native implementation is not being deleted or comprehensively re-audited here. Runtime data, credentials, uploads, models and Git repositories are not unused source files.

The main frontend will contain public pages, ordinary-user accounts and the medical workspace. The admin frontend will contain admin login, dashboard and administration. Medical users remain in main unless a future requirement justifies a third application.

## 2. Current evidence

Inventory excludes node_modules, .git, dist, virtual environments and Python caches. Hash comparison covers JS/JSX/TS/TSX/Python source/config/test files within each project. It found no byte-identical source-file duplicates. This is not proof of no duplicated behavior, nor a cross-language equivalence analysis.

| Project | Files scanned | Existing arrangement |
| --- | ---: | --- |
| wildlife_safty_website | 103 | One Vite build, mixed role routes and credentials |
| wildlife_safty_Backend_Mongodb | 98 | Express routes/controllers/services/repositories, role-specific auth models/services |
| Wildlife_safty_Backend | 14 | Separate Python inference service |

### Verified findings and decisions

| ID | Evidence | Issue / decision | Priority |
| --- | --- | --- | --- |
| A01 | src/routes/AppRoutes.jsx, package.json | Admin/main are one frontend project and build. Split entry points, dependency ownership and deployments. | High |
| A02 | src/features/auth/session.js | Persisted admin identity takes priority over medical/user identity. Separate app sessions and explicit main-workspace selection. | High |
| A03 | src/services/api.js, authenticatedFetch.js | Axios selects token using endpoint/role priority; fetch helper uses current URL. Consolidate session/transport policy. | High |
| A04 | backend middleware/adminAuth.js, authUnified.js, access.js | Authorization exists, but uses several request shapes and role checks. Introduce one principal and permission policy; do not describe current app as having no RBAC at all. | High |
| A05 | backend routes/audit.js | Global and per-user audit routes have no authentication middleware despite admin-only comment. Add permission and own-record checks plus authenticated clients before release. | Critical |
| A06 | backend models/Admin.js vs middleware/authUnified.js | Admin model distinguishes admin/superadmin; unified principal maps admins to admin. Preserve this distinction explicitly before role-management features. | High |
| A07 | CommunityFeed.jsx (800 lines), AuthContext.jsx (657), MedicalProfileSection.jsx (633), AdminArticleSection.jsx (532), AdminProfileSection.jsx (524) | Large modules mix networking, form state and presentation. Split by domain responsibility; line count is a review signal, not an automatic deletion rule. | Medium |
| A08 | backend routes/posts.js and routes/medicalOfficerPosts.js | Two verification URL shapes call the same controller. Retain compatibility aliases temporarily and select one canonical endpoint. | Medium |
| A09 | adminArticlesService.js (366 lines), medicalOfficerArticlesService.js (397) | Similar article lifecycle domains with different powers. Extract shared lifecycle rules after behavior tests; do not merge away review permissions. | Medium |
| A10 | adminChatService.js and role-specific chat services | Conversation ID helper already shared; participant lookup, authorization and presentation still differ. Extract common mechanics only. | Medium |
| A11 | start.py, current Vite config | Launcher assumes a single frontend on 5173. Add independently controllable admin frontend on 5174. | High |
| A12 | src/assets/auth-sidebar1.png, logo.png | Build previously measured approximately 9 MB background and 764 KB logo. Optimize assets; keep branding and verify visual quality. | Medium |
| A13 | Multiple .git directories; root lacks a single repository | Keep existing repo history. Do not move/delete nested .git directories as cleanup. Frontend split can live inside existing frontend repo. | High |

No production source files were deleted in this documentation pass. A complete route-by-route authorization audit, dynamic-import reachability review and authenticated regression suite remain open tasks.

## 3. Target repository and folder structure

Keep the existing website repository as the frontend workspace root to preserve history. Use explicit folder names requested for the two projects:

```text
wildlife_safty/
  wildlife_safty_website/              # existing Git repository / npm workspace
    package.json                       # workspace commands, one lockfile
    apps/
      main-frontend/
        package.json
        index.html
        vite.config.js                 # dev port 5173, strictPort
        .env.example
        src/
          app/                         # providers, main route tree, navigation
          features/                    # public, user and medical application flows
      admin-frontend/
        package.json
        index.html
        vite.config.js                 # dev port 5174, strictPort
        .env.example
        src/
          app/                         # admin-only providers/routes/navigation
          features/                    # users, medical approvals, moderation, audits
    packages/
      ui/                              # buttons, modal, avatar, forms, tokens
      api-client/                      # injected session, transport, errors, uploads
      auth/                            # session interfaces and permission helpers
      features/                        # genuinely shared chat/article/review primitives
      config/                          # lint/style/build configuration
    docs/
  wildlife_safty_Backend_Mongodb/       # existing backend Git repo, keep API compatibility
    src/
      app.js
      server.js
      identity/                        # verified principal, credentials, session adapters
      authorization/                   # permission registry, role mapping, resource rules
      modules/                         # users, articles, chat, predictions, contact, audit
      infrastructure/                  # MongoDB, Firebase, Cloudinary, email
    tests/
    scripts/                           # migrations and operational scripts
  Wildlife_safty_Backend/               # separate Python inference runtime
  wildlife_safty_mobile_app/            # preserve API consumer
  start.py
```

This is a target tree, not the current tree. Backend reorganization is phased; do not physically relocate all modules in the same change as the frontend split. Do not add packages just to hold a single app-specific component. Shared packages must not import either application.

## 4. Separate server and deployment design

| Runtime | Development | Production responsibility |
| --- | --- | --- |
| Main frontend | localhost:5173 | Independent main-site build and origin |
| Admin frontend | localhost:5174 | Independent admin build and origin, own login/session |
| Node API | localhost:5000 | Shared authenticated domain API |
| Email worker | No browser port | Separate supervised worker |
| ML API | localhost:5001 | Separate inference service |

Admin login and admin pages must no longer be served by the main frontend. Main exposes no admin route or automatic admin redirect. Legacy /admin paths render the main application’s local Page not found screen. Users must open the admin origin directly. Back-to-website uses the configured main origin.

A separate admin frontend/server does not require a second copy of the Node business API. The chosen design shares one API with permissions enforced on every protected operation. This avoids duplicated authentication, models and database rules. If independent admin API/network isolation becomes mandatory, add a thin admin gateway/BFF around shared backend modules; do not duplicate the entire backend.

Each frontend must build/start alone. Main build artifacts must not contain admin pages or admin login implementations. Configure both origins in CORS and the appropriate auth-provider allowed-domain lists. Production static hosts use HTTPS and their own SPA fallbacks; Vite dev server is not the production server.

## 5. RBAC plus record-level authorization

Normalize verified identities to a principal such as:

```text
{ subjectId, legacyId, accountType, roles, permissions, sessionId }
```

Authentication verifies identity and account status. RBAC controls operations; ownership/participant rules control the records on which those operations can run. Neither a hidden menu nor an admin subdomain authorizes a request.

Use a stable permission registry and role-to-permission mapping first. Example middleware: authenticate -> requirePermission('articles.review') -> authorizeResource -> controller. Controllers derive actor identity from the principal. Do not accept actor IDs or role claims from request bodies. Reject unknown permissions/roles by default.

| Capability | User | Approved medical officer | Admin | Superadmin |
| --- | --- | --- | --- | --- |
| Profile/history | Own | Own | Own; explicit support permissions only | Explicit policy |
| Chat | Participant | Assigned/participant | Authorized support participant | No automatic access to all messages |
| Articles | Read published | Manage own drafts, submit review | Review/publish/moderate | Same + delegated policy |
| Prediction review | No | Review | Review | Review |
| Contact tickets / users / medical approval | No | No | Authorized management | Authorized management |
| Audit | Own sanitized activity | Own sanitized activity | audit.read permission | audit.read permission |
| Role/permission assignment | No | No | No by default | roles.manage, audited |

Start with static role definitions tested in code. If dynamic roles are required, introduce Role/UserRole persistence and policy-versioned permission refresh only after the permission model is stable. Prevent self-escalation, removal of the final superadmin and assignment of permissions the actor cannot delegate. Role deletion must require reassignment or explicit deactivation; never orphan account records.

Preserve current MongoDB account collections initially using adapters; avoid changing account IDs, password hashes or conversation keys during this refactor. A unified account collection is a separate migration requiring backup, ID mapping and rollback.

## 6. Frontend state and shared feature design

- Admin session accepts only verified admin/superadmin identities; main session accepts ordinary/medical identities. Avoid globally selecting whichever stored role happens to exist.
- Introduce a server-validated session/profile bootstrap. Cached profile data is display data, not authorization evidence.
- Choose one API transport policy with injected session per app. Never search across admin/medical/user tokens to find any available credential. Do not send API tokens to third-party image/ML URLs.
- Shared components receive capabilities and data through props/services; they do not read app-specific localStorage keys.
- Keep distinct role workflows where behavior differs: medical article submission and admin review share editor/display primitives, not the full policy flow.
- Break CommunityFeed into feed query/state, post card/editor, comments, reactions and dialogs. Break profiles into profile query, editor, avatar upload and password/OTP flow. Split AuthContext into app-specific providers plus shared session primitives.
- Decide the production session mechanism separately. If adopting HttpOnly cookies, implement CSRF/origin defenses and logout/revocation together; do not silently mix cookie and bearer policies. Until then use separate origins and explicit per-app bearer sessions with server-side validation.

## 7. Deletion and consolidation rules

For every deletion, record path, reason, import/route/config/CLI references checked, replacement and verification evidence. No imports found is insufficient for dynamically loaded files, public assets, scripts, model resources or runtime configuration.

| Category | Action |
| --- | --- |
| Proven unused component/helper/asset | Delete after dependency/route checks and relevant builds |
| Similar role-specific files | Compare behavior; extract shared logic and preserve policy-specific wrappers |
| Duplicate HTTP/auth logic | Consolidate with compatibility tests and explicit session injection |
| node_modules/dist/__pycache__ | Generated and excluded from source review; check ignore rules, not blind mass deletion |
| uploads and migration manifest | Data/rollback material; retain under prior Cloudinary migration policy |
| Trained models, labels, archive files | Verify runtime/offline/training provenance before deciding; not approved as unused |
| .env/service-account keys | Keep out of Git and packages; never copy into frontend workspace |
| Nested Git repositories | Preserve history; no deletion or flattening in cleanup |
| Old docs | Link to this tracker, archive only after reconciling unfinished tasks |

## 8. Migration and rollback sequence

1. Capture current builds/tests, route contracts, source inventory and deletion ledger. Review unstaged changes without overwriting them.
2. Close authorization gaps (audit routes first) and establish negative role/ownership tests.
3. Normalize principal and permission registry through compatibility adapters. Preserve public/mobile URL contracts.
4. Extract minimal shared UI/transport/session packages without changing behavior.
5. Create main/admin projects, move their entry routes/features, add workspace scripts and separate ports.
6. Verify each independent build and that main has no admin implementation. Test login/refresh/logout in both origins simultaneously.
7. Consolidate domain duplication incrementally. Remove only proven unused legacy files and old route wrappers after callers migrate.
8. Update launcher, CI, hosting rewrites, CORS, docs and monitoring. Stage before production.

Keep the previous deployable artifact and API aliases during rollout. Each phase must be independently reversible. No destructive schema/account migration is part of the initial frontend split. Database migrations later require tested backups and versioned rollback instructions.

## 9. Definition of done

Both frontend projects run/build independently; admin login is absent from main; all protected API routes have explicit permission and resource policy; role changes do not require copying layouts/auth implementations; mobile contracts pass; duplicate consolidation is evidenced; deletion ledger is complete; negative authorization tests and authenticated browser flows pass; deployment settings and rollback are documented. A passing build alone does not satisfy completion.

## Actual phase-one layout

Both apps and one shared package now exist. The initial five suggested packages are consolidated into `packages/shared` until their interfaces justify separate packages. Backend modules remain in their original folders except the new `authorization/policy.js`; wholesale backend relocation is deferred. See the task tracker implementation update for evidence and limitations.
