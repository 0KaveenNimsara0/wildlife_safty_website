# Dashboard UI and frontend architecture plan

## Decision
Keep React, Vite, Tailwind and React Router. Use one shared dashboard shell with role-specific navigation and content. Use a calm wildlife-service design: forest green brand, warm neutral background, white surfaces, readable text, restrained borders and shadows. Keep the public website layout separate.

## Findings from source review
- AdminLayout, MedicalLayout and user Dashboard each implement their own header and layout.
- UserSidebar is light; MedicalOfficerSidebar is dark and introduces indigo branding. Sidebar behaviors and layers differ.
- User dashboard uses local tabs and query parameters; other portals use nested routes.
- Layouts and sidebars duplicate navigation labels. Medical labels already disagree.
- Admin layout refers to /admin/chat, but router only defines /admin/chat/officer/:officerId.
- Admin and medical route groups are not wrapped by the shared ProtectedRoute. That guard currently checks session presence, not role. Backend authorization must be verified separately.
- Sidebar components read localStorage and handle logout independently.
- Static system-online labels and an admin Global Scan button without a handler should not appear as working features.

## UI specification
- Desktop: 256px white sidebar, 64px white topbar, warm neutral content canvas.
- Sidebar: WildLife Safety identity, small role label, grouped navigation, account area and sign out at bottom. Same component for every role.
- Navigation rows: minimum 44px touch target, 20px Lucide icons, 14px labels, forest-tinted active background and aria-current. No all-caps body labels.
- Topbar: mobile menu toggle, current section/breadcrumb, return-to-site link, notifications and profile. Titles remain visible on small screens.
- Content: maximum 1280px, 24–32px desktop padding, 16px mobile padding; page heading, description and primary action in a consistent PageHeader.
- Cards: 12px radius, subtle border, optional light shadow. Typography: 28–32px page titles, 18–20px section headings, 14–16px body.
- Use semantic success, warning, error and information colors independently of brand. Status always has text or icon as well as color.
- Mobile: sidebar drawer below 1024px, backdrop, Escape dismissal, focus trap/restoration, inert closed navigation, close on route change. Avoid nested page scroll areas; contain wide tables locally.
- Shared loading, empty, error/retry and permission-denied states. Respect reduced motion and visible keyboard focus.

## Navigation
User: My activity (identification history, saved articles, activity); Account (profile, security, notifications). Keep profile as the initial landing page during migration; add an overview only when useful data exists.
Admin: Workspace (overview, prediction reviews); Management (users, medical officers, articles, contact tickets); Account/system (audit logs, notifications, profile). Resolve communications entry against an actual list/detail flow before exposing it.
Medical: Workspace (overview, prediction reviews, consultations, articles); Account (activity, notifications, profile).
Use clear labels instead of Current Node, Intelligence or Oversight Hub.

## Target organization
src/
  app/                  # route tree, providers, role navigation definitions
  layouts/
    PublicLayout.jsx
    DashboardLayout.jsx # shared shell renders Outlet
    AuthLayout.jsx
  components/
    dashboard/          # Sidebar, Topbar, mobile drawer, PageHeader
    ui/                 # Button, Card, Badge, Field, Alert, Dialog, table primitives
  features/
    auth/               # session adapter, role guard, profile/logout hooks
    user/               # user route pages and account workflows
    admin/              # admin route pages and workflows
    medical/            # medical route pages and workflows
    prediction/         # domain API, hooks and presentation
    chat/
    community/
    notifications/
  services/             # shared HTTP client and existing streaming infrastructure
  assets/styles/        # semantic tokens and base styles

Dependencies flow from app/routes to layouts/features, then shared UI/services. Shared UI must not import role-specific features or fetch data. Keep existing domain APIs and migrate incrementally; avoid a wholesale folder move.

## State and routing
Use a navigation definition per role with stable key, label, icon, destination and group. The sidebar and breadcrumbs derive from the same source, including nested detail routes.
Move user tabs to nested routes such as /dashboard/profile and /dashboard/history. Redirect existing ?tab= links to preserve bookmarks. Preserve existing admin/medical URLs and article links.
Normalize role/session through AuthContext or an adapter around it. Components consume the adapter rather than reading tokens themselves. Retain current credential contracts until verified against backend behavior. Explicit loading state prevents premature redirects; guard roles and handle expired sessions. Client guards do not replace server authorization.
Keep drawer/form state local, navigation/filter state in URL, session in context, and API access in feature APIs/hooks. Consolidate existing HTTP handling before adding a new state library. Share notification data to avoid sidebar/header polling duplication.

## Delivery sequence
1. Inventory every route and auth contract; capture current desktop/mobile screens and representative loading/error states. Resolve broken navigation targets.
2. Build semantic tokens, dashboard shell, sidebar/topbar and page-header primitives. Validate the shell in one portal before migrating others.
3. Move all three portals onto the shell with role configurations; centralize identity and logout; preserve existing business actions.
4. Convert user tabs to child routes with compatibility redirects; introduce verified role-aware route protection.
5. Standardize overview cards, tables, filters, forms and detail pages using shared primitives. Migrate one workflow at a time.
6. Remove obsolete layouts/sidebar copies after references are gone. Run production build and focused existing Cypress workflows; visually inspect 375px, 768px and 1440px views.

## Completion criteria
All roles render the same shell and interaction patterns. Every menu target resolves and nested pages retain correct active navigation. Reload/back/forward and legacy user links work. Mobile menu supports keyboard and touch without horizontal page overflow. Logout and expired-session handling work for each role. Profile updates, notifications, article CRUD, prediction history and consultations retain behavior. No unsupported online indicators or inert action buttons. Confirm text contrast and actual browser rendering, not just compilation.

Implementation progress: all three portals now use DashboardLayout, grouped role navigation, a native dialog mobile drawer, and a common topbar. User sections have URL routes with legacy query compatibility. Public header navigation spacing and its responsive breakpoint have been updated. Role authorization audit, individual feature-page standardization and browser visual verification remain follow-up work.
