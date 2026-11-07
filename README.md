# Wildlife Safety frontend workspace

Two independently hosted React applications share reusable code:

- `apps/main-frontend`: public pages, normal users and medical officers; port 5173.
- `apps/admin-frontend`: admin login and administration; port 5174.
- `packages/shared`: UI, theme, transport, session helpers and shared feature components.

## Commands

Run `npm ci` from this directory. Install dependencies once for the whole workspace.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start main frontend |
| `npm run dev:admin` | Start admin frontend |
| `npm run build` | Build both applications |
| `npm run build:main` / `npm run build:admin` | Build one application |
| `npm run preview` / `npm run preview:admin` | Preview its production build |
| `npm run test:architecture` | Check session isolation and source/build boundaries; build main first |

Build outputs are `apps/main-frontend/dist` and `apps/admin-frontend/dist`. There is no combined root `src` or root `dist` application. Use workspace commands, not a root-level bare Vite command.

Backend services remain separate: Node/MongoDB API, Python ML service and email worker. Firebase handles supported identity flows; application image uploads use Cloudinary through the backend.

See [workspace setup and deployment](docs/frontend-workspaces.md), [architecture plan](docs/architecture-cleanup-plan.md) and [task tracker](docs/architecture-cleanup-tasks.md). App-local `.env.example` files list frontend settings; never place backend secrets in `VITE_` variables.
