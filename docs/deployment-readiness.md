# Deployment readiness — 2026-11-06

## Implemented and verified

- [x] Cloudinary server-side signed uploads for user/admin/medical avatars, community photos and prediction images; 5 MB limit.
- [x] Migrated only images referenced by live MongoDB records: 3 references / 3 unique images. No unused upload-directory files uploaded or deleted.
- [x] Migration rescan found zero remaining local references. All 3 remote images returned HTTP 200 with image content types.
- [x] Reusable migration (`node scripts/migrateImages.cjs`, add `--apply` to write), deterministic asset IDs, local resume manifest, compare-and-set DB updates.
- [x] Website renders absolute Cloudinary URLs and legacy local URLs.
- [x] Firebase signatures/revocation verified; forged-token regression tests.
- [x] Google social-sync derives identity and verified email from Firebase, not request body.
- [x] No default JWT secret; startup requires a non-default secret of at least 32 characters.
- [x] Protected profile routes, post/comment ownership, reaction identity, prediction history/review/export/delete routes. Guest predictions cannot choose another user's ID.
- [x] API CORS allowlist, security headers, authentication/upload throttling, bounded JSON bodies, no chat-content request logging.
- [x] API awaits MongoDB before listening, readiness endpoint `/health`, shutdown handling; duplicate route mounts removed.
- [x] Flask debug disabled by default, configured CORS and upload size; production Waitress entry point provided (`serve.py`).
- [x] Route-level lazy loading and fixed bundled auth logo path. Build passes; main JS reduced from roughly 1.18 MB to roughly 504 KB before gzip.

## Deployment configuration

Backend: copy `.env.example` values into the hosting secret store. Use Node 22+; run `npm ci`. Required: strong JWT_SECRET, MONGODB_URI, exact HTTPS CORS_ORIGINS, Cloudinary credentials, Firebase service account secret/path and existing mail/OTP configuration. Never use VITE_ prefixes for backend secrets. Existing Cloudinary account is supported; project uploads live under `wildlife-safety/`.

Start API with `node server.js`, email worker separately with `node workers/emailWorker.js`. Configure host restart policies, or use the supplied `ecosystem.config.cjs` with PM2. Run one API instance until notification streaming and throttling have shared infrastructure. Set TRUST_PROXY_HOPS only to the actual trusted proxy hop count. Configure HTTPS, SSE proxy buffering off and streaming timeouts.

Frontend: set VITE_API_BASE_URL=https://YOUR_API/api, VITE_ML_URL=https://YOUR_ML and DEPLOY_BUILD=true in the build environment. Run `npm run build`; publish `dist` with SPA fallback (existing vercel.json supplies one). Add the real frontend domain to Firebase authorized domains and backend/ML CORS_ORIGINS.

ML: install requirements, make model/label/species assets available at configured paths, set APP_ENV=production, CORS_ORIGINS and PORT; run `python serve.py` under host supervision. Waitress startup with the model has not yet been deployment-tested.

## Remaining launch gates (not claimed complete)

- [ ] Choose hosting/domain and configure production HTTPS, secrets, email delivery and Firebase authorized domains.
- [ ] Stage and test real Google/password login for each role, allowed AND denied ownership actions, profile/photo upload, identification, review, chat, SSE notifications and email delivery.
- [ ] Complete broader authorization audit of remaining legacy endpoints; these changes are not a claim that every endpoint has been security-audited.
- [ ] Configure database backups, retention and access restrictions; restore a backup to a separate staging database. Migration manifest is not a database backup.
- [ ] Optimize ~9 MB auth background image and ~764 KB logo. Route splitting does not remove those asset costs.
- [ ] Configure ML abuse protection at the gateway, monitoring, readiness alerts, worker monitoring and release rollback.
- [ ] Install and verify production Python dependencies/process supervision on the selected host.

Keep local uploads until migration/staging checks are accepted. Asset deletion is intentionally deferred: shared URLs can be referenced by multiple records. No existing Cloudinary assets from other projects were modified.

Reference: https://cloudinary.com/documentation/upload_images (server-side signed upload protocol).
