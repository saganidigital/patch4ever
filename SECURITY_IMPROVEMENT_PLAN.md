# Patch4Ever Production Security Improvement Plan

**Target Codebase:** `e:\work\demo websites\patch4ever`  
**Audience:** Site Owner & Maintainers  
**Prepared From:** `SECURITY_FINDINGS_REPORT.md` (Findings `F-01`–`F-16`)  
**Scope:** Actionable, prioritized defensive hardening roadmap for production deployment.

---

## 1. Traceability Matrix (Plan Items -> Findings)

| Plan ID | Priority Phase | Summary | Linked Finding(s) |
|---|---|---|---|
| `P0-1` | Phase 0 (Blocker) | Server-authoritative order pricing, numeric dimensions/derived size, minimum quantity, status locking, strict allowlisting, & reject over-length inputs | `F-01`, `F-09`, `F-12` |
| `P0-2` | Phase 0 (Blocker) | Shared/persistent rate limiting with trusted-proxy IP extraction (preserving local `remoteAddress` fallback), capped local `Map`, & anti-bot protection | `F-02`, `F-03` |
| `P0-3` | Phase 0 (Blocker) | Remove silent `localStorage` fallback on API failures & handle HTTP errors explicitly | `F-04` |
| `P1-1` | Phase 1 (Auth & API) | Enforce `role`/`sub` claims, `jti` token revocation on logout, remove plaintext password fallback, & `.trim()` 32-char secret floor | `F-05` |
| `P1-2` | Phase 1 (Auth & API) | Enforce `Content-Type: application/json`, `Origin` verification, & HTTP `413` body limits across both pre-parsed `req.body` and raw streams | `F-06` |
| `P1-3` | Phase 1 (Auth & API) | Harden cookie attributes (`__Host-` prefix scoped to production/HTTPS, strict `Secure` policy) | `F-11` |
| `P1-4` | Phase 1 (Auth & API) | Strict non-empty catalog schema validation, bounded `GET /api/orders` pagination, & `404` checks on `PATCH`/`DELETE /api/orders` | `F-10`, `F-03` |
| `P1-5` | Phase 1 (Auth & API) | Secure server-side artwork upload flow (signed URLs + magic-byte validation) | `F-09` |
| `P2-1` | Phase 2 (Client & Data) | Remove `SEED_ORDERS` PII from public bundle, lazy-load `AdminPage`, & retire `cryptoStore.js` | `F-07` |
| `P2-2` | Phase 2 (Client & Data) | Sanitize `500`/`503` responses, gate admin-only routes behind auth/method checks (keeping public `POST /api/orders` & `GET /api/catalog`), & remove public setup banner | `F-08` |
| `P2-3` | Phase 2 (Client & Data) | Debounce `AdminPage` `adminNotes`, wire `AdminPage` pagination, unify cart/pricing/`minQty`/`QuotePage`/`OrderPage` catalog state, & harden `ScrollToTop` | `F-03`, `F-09`, `F-10`, `F-15` |
| `P2-4` | Phase 2 (Client & Data) | Tighten email validation & prompt-only CLI password hashing | `F-16` |
| `P3-1` | Phase 3 (Infra & Ops) | Pin `search_path` on PostgreSQL `set_updated_at()` & tighten DB price constraints | `F-12` |
| `P3-2` | Phase 3 (Infra & Ops) | Tighten `vercel.json` CSP (`img-src`, self-hosted fonts), add `COOP`/`CORP` | `F-13` |
| `P3-3` | Phase 3 (Infra & Ops) | Align `vite.config.js` dev headers, trailing-slash/`/api/*` `404`, static source/seed blocks, & env precedence | `F-14` |
| `P3-4` | Phase 3 (Infra & Ops) | Implement legal/contact routes (`/contact`, `/policies/*`) & proper `404` page | `F-15` |
| `P3-5` | Phase 3 (Infra & Ops) | Production monitoring, audit logging, & secret rotation runbook | `F-02`, `F-03`, `F-05` |

---

## 2. Phase 0 — Immediate Production Blockers (Critical & High)

### `P0-1`: Enforce Server-Side Order Pricing, Dimensions, Minimum Quantities, Allowlists, & Locked Status
- **Addresses:** `F-01`, `F-09`, `F-12`
- **Target Files / Configs:**
  - `src/data/pricingData.js` (extract pure pricing tables into a shared module, e.g., `shared/pricing.js` or `api/_lib/pricing.js`)
  - `api/_lib/supabase.js`
  - `api/orders.js`
  - `database_coding/schema.sql`
- **Exact Changes Required:**
  1. Move `lookupUnitPrice`, quantity tiers, leather/PVC multipliers, and size matrices into a shared ESM module importable by both `src/` and `api/` (e.g., `api/_lib/pricing.js` or `shared/pricing.js`).
  2. In `api/orders.js` (`POST /api/orders`), fetch the live `catalog_config` row (`id=eq.default`) from Supabase (falling back to server-side default config) so the server knows authoritative `enabled`, `minQty`, `rushAvailable`, `rushFeePerPatch`, border `pricePerPatch`, backing `pricePerPatch`, and upgrade `pricePerPatch` values.
  3. Validate numeric `width` and `height` (`Number.isFinite`, `0.5 <= val <= 24.0`, normalized to `.toFixed(2)`), reject non-numeric/out-of-range values with `400`, and **derive `size` strictly on the server** (`size = Number(((w + h) / 2).toFixed(2))`) rather than trusting client-supplied `size`.
  4. Strictly allowlist `patchType` (must exist and be `enabled: true` in `catalog_config`), `shape` (allowlisted set), `coverage`/finish variant (canonical `coverage` for embroidered, `2D`/`3D` for PVC, `LEATHER_VARIANTS` key for leather), `border`, `backing`, and `upgrades` (every ID/name must match an enabled item in `catalog_config`); reject unknown or disabled selections with `400`.
  5. Enforce `qty >= typeConfig.minQty` (`400` if below minimum, e.g., reject PVC `< 50`, Leather `< 25`), and enforce `rush`: return `400` (or force `rush: false`) whenever `!typeConfig.rushAvailable`.
  6. Validate field lengths **before** slicing/truncating (`email.length <= 150`, `customerName.length <= 100`, `notes.length <= 2000`, etc.) and return `400` on over-length inputs instead of silent truncation (`cleanStr` slicing).
  7. Recompute `unit_price` and `total_price` strictly on the server from the shared pricing matrix + catalog surcharges; ignore client-supplied `unitPrice` and `totalPrice`.
  8. In `mapOrderToRow` (or a dedicated `mapPublicOrderToRow` for `POST /api/orders`), hardcode:
     - `status: 'proof-pending'`
     - `admin_notes: ''`
     - `source`: allowlist only `['Order Page', 'Free Quote']` (default `'Order Page'`).
  9. Update `database_coding/schema.sql:25-26` constraints to `check (unit_price > 0)` and `check (total_price > 0)` once server pricing is enforced.
- **Verification Criteria:**
  - Submitting `POST /api/orders` with `{ patchType: 'unknown-type', width: 'not-a-num', height: '=CMD()', rush: true, upgrades: ['FakeUpgrade'], email: 'a'.repeat(145) + '@b.com' }` returns `400` (and does not truncate `email` or persist unvalidated fields).
  - Submitting `POST /api/orders` with `{ patchType: 'pvc', qty: 1, unitPrice: 0, totalPrice: 0, status: 'approved', adminNotes: 'injected', source: 'Fake' }` returns `400` for `qty < 50`.
  - Submitting a valid `POST /api/orders` with tampered `unitPrice: 0.01`, `size: 0.5` (for `width: 4, height: 4`), `status: 'completed'`, and `adminNotes: 'hacked'` persists server-calculated `size: 4.00`, server-calculated price, `status: 'proof-pending'`, and `admin_notes: ''`.

### `P0-2`: Replace Ephemeral IP Rate Limiter & Protect Public `POST` Endpoints
- **Addresses:** `F-02`, `F-03`
- **Target Files / Configs:**
  - `api/_lib/auth.js`
  - `api/admin/login.js`
  - `api/orders.js`
  - `api/newsletter.js`
  - Hosting/Edge env (e.g., Upstash Redis / Vercel KV or Supabase rate-limit table + Cloudflare Turnstile / hCaptcha)
- **Exact Changes Required:**
  1. Fix `getClientIp(req)` in `api/_lib/auth.js:134-140`: on Vercel, read trusted platform headers first (`req.headers['x-real-ip']` or Vercel's edge-appended trusted hop if `TRUST_PROXY=true`) instead of unconditionally trusting `forwarded.split(',')[0].trim()`, while **explicitly preserving `req?.socket?.remoteAddress || 'unknown'` as the fallback** when platform headers are absent in local dev/non-Vercel environments.
  2. Replace `const failedAttemptsByIp = new Map()` in `api/_lib/auth.js:7` with a shared durable store (Upstash Redis / Vercel KV sliding window, or a PostgreSQL rate-limit RPC/table in Supabase) keyed by both IP and normalized `email` (account-level throttling) so lockouts persist across serverless isolates and cold starts. Cap any local in-memory fallback `Map` (e.g., max `10,000` keys + periodic sweep of expired entries) so rotating headers cannot leak memory.
  3. Apply IP-based rate limiting to `POST /api/orders` (e.g., max 5 submissions per 15 min per IP) and `POST /api/newsletter` (e.g., max 5 submissions per 15 min per IP).
  4. Add an invisible/managed bot-verification token check (e.g., Cloudflare Turnstile) on `POST /api/orders`, `POST /api/newsletter`, and optionally `POST /api/admin/login` after 2 failures, verified server-side before database writes.
- **Verification Criteria:**
  - Sending 6 failed login attempts from the same connection triggers `429` + `Retry-After` even when rotating `X-Forwarded-For` headers and across separate serverless invocations, while local dev without `x-real-ip` falls back cleanly to `req.socket.remoteAddress`.
  - Exceeding the threshold on `POST /api/orders` or `POST /api/newsletter` returns `429` without inserting rows into Supabase.

### `P0-3`: Remove Silent `localStorage` Fallback on Server Failures
- **Addresses:** `F-04`
- **Target Files / Configs:**
  - `src/data/orderStore.js`
  - `src/pages/OrderPage.jsx`
  - `src/pages/QuotePage.jsx`
  - `src/pages/AdminPage.jsx`
  - `src/components/Footer.jsx`
- **Exact Changes Required:**
  1. In `src/data/orderStore.js:360-533`, remove automatic fallback to `localStorage` in `createOrderAsync`, `updateOrderAsync`, `deleteOrderAsync`, `loadOrdersAsync`, and `saveCatalogConfigAsync` in production builds (`import.meta.env.PROD`, or unconditionally once Supabase is configured).
  2. Check `res.ok` in every API call:
     - On `401` in `AdminPage` (`updateOrderAsync`, `deleteOrderAsync`, `saveCatalogConfigAsync`, `loadOrdersAsync`), immediately clear `authed` state and prompt the admin to sign in again.
     - On `400`/`429`/`500`/`503` in `OrderPage.jsx`, `QuotePage.jsx`, `AdminPage.jsx`, and `Footer.jsx`, throw/return `{ ok: false, error }` and render a clear visible error banner instead of `"ORDER #... CONFIRMED"`, `"Order page settings saved!"`, or `"Thanks for subscribing!"`.
  3. If an offline demo mode is ever desired for local UI previews, gate it explicitly behind a build-time flag (`VITE_DEMO_MODE=true` in development only), never active on HTTP errors or in production.
- **Verification Criteria:**
  - With `/api/orders` or `/api/newsletter` returning `503` or `400`, submitting `/order`, `/quote`, or the footer newsletter shows an error state and does NOT display a confirmation number or `"Thanks for subscribing!"`.
  - When `PUT /api/catalog` returns `401`, `AdminPage` transitions back to the login screen instead of showing `"Order page settings saved!"`.

---

## 3. Phase 1 — Authentication, API, & Input Hardening

### `P1-1`: Harden Session Token Verification, Logout Revocation, Secret Entropy, & Password Hashing
- **Addresses:** `F-05`
- **Target Files / Configs:**
  - `api/_lib/auth.js`
  - `api/admin/login.js`
  - `api/admin/session.js`
  - `api/admin/logout.js`
  - `database_coding/schema.sql` (if storing revoked `jti`s in Supabase)
- **Exact Changes Required:**
  1. In `verifySessionToken` (`api/_lib/auth.js:113-118`), `requireAdmin` (`api/_lib/auth.js:206-217`), and `api/admin/session.js:26-35`:
     - Require `payload.role === 'admin'`.
     - Require `typeof payload.sub === 'string' && sha256Equal(payload.sub.trim().toLowerCase(), process.env.ADMIN_EMAIL.trim().toLowerCase())`.
     - Require `typeof payload.jti === 'string' && payload.jti.length >= 16`.
  2. In `api/admin/login.js:71-79`, include `jti: crypto.randomUUID()` in every minted session token, and reduce `SESSION_REMEMBER_MS` (`L18`, e.g., from 7 days to 24 hours, or require re-auth for destructive actions).
  3. In `api/admin/logout.js:16-25`, record `payload.jti` (until `payload.exp`) in the shared Redis/KV or Supabase `revoked_tokens` table, and reject revoked `jti`s inside `requireAdmin` and `api/admin/session.js`.
  4. Remove the plaintext `ADMIN_PASSWORD` fallback from `verifyPassword` and `isAuthConfigured` (`api/_lib/auth.js:75-77, 128`), requiring `ADMIN_PASSWORD_HASH` (`scrypt:` format) exclusively.
  5. Update `isAuthConfigured()` (`api/_lib/auth.js:130`) to check `process.env.ADMIN_SESSION_SECRET.trim().length >= 32` (rejecting whitespace-only and low-entropy secrets).
  6. Explicitly encode and enforce `scrypt` parameters (e.g., `N: 32768, r: 8, p: 1` with `maxmem: 64 * 1024 * 1024`) in `hashPasswordScrypt` (`api/_lib/auth.js:82-86`) and `verifyPassword` (`L68`, supporting both legacy `scrypt:<salt>:<hash>` and parameterized `scrypt$N$r$p$<salt>$<hash>`).
- **Verification Criteria:**
  - Tokens with `role: 'viewer'` or mismatched `sub` are rejected with `401`.
  - Replaying a session cookie captured before `POST /api/admin/logout` returns `401` on `/api/admin/session` and `/api/orders`.
  - Setting `ADMIN_PASSWORD` without `ADMIN_PASSWORD_HASH`, or setting `ADMIN_SESSION_SECRET = ' '.repeat(32)` / `'a'.repeat(16)`, fails `isAuthConfigured()`.

### `P1-2`: Enforce `Content-Type: application/json`, `Origin` Checks, & `413` Size Limits (Pre-Parsed & Raw)
- **Addresses:** `F-06`
- **Target Files / Configs:**
  - `api/_lib/auth.js`
  - `api/orders.js`, `api/newsletter.js`, `api/catalog.js`, `api/admin/login.js`, `api/admin/logout.js`
- **Exact Changes Required:**
  1. Add a request validation helper in `api/_lib/auth.js` for state-changing methods (`POST`, `PUT`, `PATCH`, `DELETE`):
     - Require `Content-Type` header to match `application/json` (allowing `; charset=utf-8`) on endpoints that accept JSON bodies (`POST /api/orders`, `POST /api/newsletter`, `POST /api/admin/login`, `PATCH /api/orders`, `PUT /api/catalog`), returning `415 Unsupported Media Type` otherwise.
     - Validate `Origin` (or `Referer` if `Origin` is absent on same-origin requests) against `ALLOWED_ORIGINS` / `req.headers.host`, returning `403 Forbidden` on cross-origin requests.
  2. Update `readJsonBody(req)` in `api/_lib/auth.js:170-204` to enforce the `32768`-byte limit across **both** Vercel pre-parsed `req.body` and raw Node streams:
     - Check `Content-Length` header early (`Number(req.headers['content-length']) > 32768` -> reject with `{ status: 413, message: 'Payload too large.' }`).
     - When `req.body !== undefined` (Vercel pre-parsed runtime): enforce `Buffer.byteLength` on `req.body` (string or `JSON.stringify(req.body)`) `<= 32768` (else `{ status: 413 }`), reject invalid JSON strings with `{ status: 400 }`, and reject non-plain-object bodies (`Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null`) with `{ status: 400 }`. Also consider exporting `export const config = { api: { bodyParser: { sizeLimit: '32kb' } } }` (or `bodyParser: false`) on JSON API handlers.
     - On raw streams (`req.on('data', ...)`): collect chunks as `Buffer[]`, track exact `totalBytes`, call `req.destroy()` and reject with `{ status: 413 }` when `totalBytes > 32768`, and reject invalid JSON or non-plain objects with `{ status: 400 }` instead of silently coercing to `{}`.
- **Verification Criteria:**
  - `POST /api/admin/login` or `POST /api/newsletter` with `Content-Type: text/plain` returns `415`.
  - A `POST` with `Origin: https://evil.example` returns `403`.
  - A `>32KB` payload returns `413 Payload Too Large` both via raw Node HTTP stream and when `req.body` is pre-populated (`{ body: { notes: 'A'.repeat(100000) } }`).

### `P1-3`: Harden Cookie Attributes (`__Host-` Prefix Scoped to Production & `Secure` Enforcement)
- **Addresses:** `F-11`
- **Target Files / Configs:**
  - `api/_lib/auth.js`
  - `api/admin/login.js`
  - `api/admin/logout.js`
- **Exact Changes Required:**
  1. Keep `COOKIE_NAME` (`api/_lib/auth.js:3`) explicitly scoped to production/HTTPS (`NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'`): emit `__Host-p4e_admin_token` with `Secure; HttpOnly; SameSite=Strict; Path=/` (and no `Domain` attribute) in production, while keeping `p4e_admin_token` in local `http://localhost` development so browsers do not reject cookies lacking `Secure` over localhost HTTP.
  2. Restrict `isHttpsRequest(req)` (`api/_lib/auth.js:15-18`) so `x-forwarded-proto` is not trusted blindly in untrusted environments (rely on `req.socket.encrypted` or `process.env.VERCEL === '1'`).
- **Verification Criteria:**
  - In Vercel production/preview (`VERCEL=1`), `Set-Cookie` contains `__Host-p4e_admin_token=...; Path=/; SameSite=Strict; ...; HttpOnly; Secure`.
  - Local `vite dev` admin login over `http://localhost` continues to set and accept the session cookie.

### `P1-4`: Strict Non-Empty `PUT /api/catalog` Validation, Bounded `GET /api/orders`, & `404` on Missing IDs
- **Addresses:** `F-10`, `F-03`
- **Target Files / Configs:**
  - `api/catalog.js`
  - `api/orders.js`
- **Exact Changes Required:**
  1. In `api/catalog.js:35-45` (`PUT /api/catalog`), validate and normalize a strict allowlisted schema for every item in `patchTypes`, `borders`, `backings`, and `upgrades`:
     - Require **non-empty** arrays (`>= 1` item, `<= 20` items per list) for `patchTypes`, `borders`, and `backings`, and **at least 1 item with `enabled: true`** in each of `patchTypes`, `borders`, and `backings` (returning `400` otherwise so `OrderPage` can never receive an empty/all-disabled catalog).
     - Strip unknown keys and require valid `id` (`^[a-z0-9-]{1,40}$`), `name` (`string <= 80`), `enabled` (`boolean`), finite integer `minQty` (`1..10000`), and finite non-negative `pricePerPatch` / `rushFeePerPatch` (`0..500`).
  2. In `api/orders.js:65-76` (`GET /api/orders`), enforce bounded pagination (`limit` query param defaulting to `50` and capped at `<= 200`, plus `offset` or keyset cursor and `Prefer: count=exact` if total count is needed) instead of unbounded `select=*`.
  3. In `api/orders.js`:
     - `PATCH` (`L105-106`): If `Array.isArray(updated) && updated.length === 0` (or `!order`), return `404 { error: 'Order not found.' }` instead of `200 { order: null }`.
     - `DELETE` (`L118-122`): Pass `prefer: 'return=representation'` to `supabaseFetch` and return `404 { error: 'Order not found.' }` if the deleted array is empty.
- **Verification Criteria:**
  - `PUT /api/catalog` with empty `patchTypes: []`, zero enabled borders, negative `pricePerPatch`, or unknown properties returns `400`.
  - `GET /api/orders?limit=9999` returns at most `200` rows per page; `PATCH`/`DELETE /api/orders?id=P4E-999999` return `404`.

### `P1-5`: Implement Secure Server-Side Artwork Upload Flow
- **Addresses:** `F-09`
- **Target Files / Configs:**
  - `api/orders.js` or new `api/uploads/sign.js`
  - `src/pages/OrderPage.jsx`, `src/pages/QuotePage.jsx`, `src/data/orderStore.js`
  - Supabase Storage (private bucket, e.g., `order-artwork`)
- **Exact Changes Required:**
  1. Create a private Supabase Storage bucket `order-artwork` (no public read access; admin downloads via short-lived signed URLs).
  2. Issue short-lived signed upload URLs (`api/uploads/sign.js`) with strict MIME/size policies, or validate uploaded file magic bytes server-side (`PNG`, `JPEG`, `GIF`, `WEBP`, `PDF`, `PS/EPS/AI`, `PSD`) and strip/block SVG/HTML/executable content.
  3. Store the server-issued `artwork_key` on the order record rather than trusting arbitrary client filenames alone, and never serve uploaded artwork inline from the main app origin (`Content-Disposition: attachment`).
- **Verification Criteria:**
  - Uploading a real `.png` from `/order` stores the object in private Supabase Storage and links it to the order; an executable renamed to `.png` is rejected by magic-byte inspection.

---

## 4. Phase 2 — Client, Storage, & Error Hygiene

### `P2-1`: Remove `SEED_ORDERS` PII from Public Bundle, Lazy-Load `AdminPage`, & Retire `cryptoStore.js`
- **Addresses:** `F-07`
- **Target Files / Configs:**
  - `src/data/orderStore.js`
  - `src/App.jsx`
  - `src/utils/cryptoStore.js`
  - `database_coding/seed.sql`
- **Exact Changes Required:**
  1. Remove `SEED_ORDERS` (`src/data/orderStore.js:76-273`) from frontend source code so realistic customer records (`mvance@ocalafire.gov`, addresses, phones) are never compiled into `dist/assets/*.js`.
  2. Code-split `AdminPage` in `src/App.jsx:11` using `React.lazy(() => import('./pages/AdminPage'))` with `<Suspense>` so admin UI code is not downloaded by regular storefront visitors.
  3. Remove `src/utils/cryptoStore.js` once `P0-3` removes `localStorage` order persistence (client-side keys stored in `localStorage` alongside ciphertext offer no security boundary). Ensure `AdminPage.jsx` clears any legacy `p4e-orders-enc-v2`, `p4e-storage-salt-v1`, `p4e-storage-seed-v1`, `p4e-orders-v1` keys on load.
  4. Move `database_coding/seed.sql:42-103` sample orders into a separate `database_coding/seed.dev.sql` file with clearly synthetic `@example.com` data so production DB setup only seeds `catalog_config`.
- **Verification Criteria:**
  - Rebuilding `dist/` and searching `dist/assets/*.js` for `ocalafire.gov`, `SEED_ORDERS`, and `Admin Sign In` shows `SEED_ORDERS` absent from all chunks and `AdminPage` isolated in its own lazy chunk.

### `P2-2`: Sanitize `500`/`503` Error Responses & Reorder Auth/Method Guards (Keeping Public Routes Public)
- **Addresses:** `F-08`
- **Target Files / Configs:**
  - `api/orders.js`, `api/catalog.js`, `api/newsletter.js`, `api/admin/login.js`, `api/admin/session.js`
  - `src/pages/AdminPage.jsx`
- **Exact Changes Required:**
  1. Enforce per-method guard ordering in `api/orders.js` (`L30-35`) and `api/catalog.js` (`L7-12`):
     - Validate HTTP method (`405 Method Not Allowed`) **first**.
     - Run `requireAdmin(req)` (`401`) **before** `isSupabaseConfigured()` (`503`) **only on admin-only methods** (`GET`/`PATCH`/`DELETE /api/orders` and `PUT /api/catalog`), so unauthenticated callers never learn database configuration state.
     - Keep `POST /api/orders` and `GET /api/catalog` **public** (do **not** gate them behind `requireAdmin`).
  2. Replace detailed `503` env-var instructions in `api/orders.js:32`, `api/catalog.js:9`, and `api/admin/login.js:31` with generic `"Service temporarily unavailable."` (log the exact missing env vars server-side via `console.error`).
  3. In `api/admin/session.js:17-22`, return `503 { authenticated: false }` without `misconfigured: true`, and remove the unauthenticated setup instruction banner (`AdminPage.jsx:274-289`) in production builds (showing only `"Sign-in is temporarily unavailable. Contact the site administrator."`).
  4. In all `500` `catch` blocks (`api/orders.js:55, 74, 108, 124`, `api/catalog.js:24, 55`, `api/newsletter.js:36`), log `err` server-side and return generic JSON (`{ error: 'An internal error occurred.' }`) instead of `err.message`.
- **Verification Criteria:**
  - Unauthenticated `GET /api/orders`, `PUT /api/catalog`, and `POST /api/catalog` return `401` / `405` regardless of Supabase env configuration, while public `POST /api/orders` and `GET /api/catalog` remain accessible without an admin cookie.
  - No API error response body contains `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, or PostgREST SQL messages.

### `P2-3`: Debounce `AdminPage` Notes, Wire Pagination, Unify Cart/Pricing/Catalog State, & Fix `ScrollToTop`
- **Addresses:** `F-03`, `F-09`, `F-10`, `F-15`
- **Target Files / Configs:**
  - `src/pages/AdminPage.jsx`
  - `src/App.jsx`
  - `src/components/CartDrawer.jsx`
  - `src/pages/PricingPage.jsx`
  - `src/pages/CatalogPage.jsx`
  - `src/pages/QuotePage.jsx`
  - `src/pages/OrderPage.jsx`
- **Exact Changes Required:**
  1. In `src/pages/AdminPage.jsx:1032-1039`, switch `adminNotes` editing to local draft state with an explicit `"Save Notes"` button (or a 600ms debounce + dirty indicator) instead of firing `PATCH /api/orders` on every keystroke, and wire the order list UI to `GET /api/orders` pagination controls (`P1-4`).
  2. In `src/App.jsx:62, 73` (`handleAddToCart` and `handleUpdateQty`) and `src/components/CartDrawer.jsx:83, 124-130`:
     - Store structured pricing specs (`patchType`, `coverage`, `sizeInches`, `leatherVariant`/`pvcStyle`, `extrasPerPatch`, `minQty`) on cart items and recompute `unitPrice` via `lookupUnitPrice` + surcharges on every quantity change instead of multiplying by stale `p.unitPrice`.
     - Enforce `Math.max(item.minQty || 10, item.qty - 10)` in `CartDrawer.jsx:83` and pass cart items into `/order` or `/quote` instead of dropping them.
  3. In `src/pages/PricingPage.jsx:244`, derive `minQty` from the selected `patchType` (`pvc` -> `50`, `leather` -> `25`, etc.) on the `QTY` range slider and clamp `qty` upward whenever switching patch types.
  4. In `src/pages/QuotePage.jsx:153-173, 350-353`, wire the form to `loadCatalogConfigAsync()` (filtering disabled items) and enforce per-type `minQty` matching `OrderPage.jsx`, while computing estimates consistently via `pricingData.js` (`QuotePage.jsx:83`, `CatalogPage.jsx:216-217`, `OrderPage.jsx:114` using `LEATHER_VARIANTS`).
  5. In `src/pages/OrderPage.jsx:45-63, 95-97, 167-168, 191-192`, add a `useEffect` to reconcile `patchType`, `borderId`, `backingId`, and `selectedUpgrades` to enabled items whenever `catalog` loads asynchronously, and guard `typeConfig?.name`, `activeBorder?.name`, and `activeBacking?.name` with optional chaining/safe fallbacks so an empty array never throws `TypeError`.
  6. In `src/App.jsx:17-22` (`ScrollToTop`), wrap hash lookup safely using `document.getElementById(decodeURIComponent(hash.slice(1)))` inside `try/catch` instead of `document.querySelector(hash)`.
- **Verification Criteria:**
  - Navigating to `/#invalid:selector` or `/#/` logs zero uncaught exceptions in the browser console.
  - Typing 20 characters into `adminNotes` sends at most 1 `PATCH` request upon save/debounce.
  - Increasing a cart item's quantity from `50` to `100` updates `unitPrice` to the `100`-tier price; `PricingPage` and `QuotePage` enforce `50` min on PVC and `25` min on Leather; `OrderPage` reconciles disabled types and does not throw on empty catalog arrays.

### `P2-4`: Tighten Email Validation & Remove CLI Arg Password Exposure
- **Addresses:** `F-16`
- **Target Files / Configs:**
  - `api/orders.js`, `api/newsletter.js`
  - `scripts/hash-password.mjs`
- **Exact Changes Required:**
  1. Use a stricter email format check (e.g., `/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/` and total length `<= 150`) in `api/orders.js:14` and `api/newsletter.js:4`.
  2. In `scripts/hash-password.mjs:20-28`, deprecate/warn on `process.argv[2]` and default to masked interactive stdin prompting so admin passwords do not enter shell history.
- **Verification Criteria:**
  - `a@b` or `user@invalid..com` is rejected with `400`; `node scripts/hash-password.mjs` prompts interactively without requiring CLI args.

---

## 5. Phase 3 — Infrastructure, Headers, Dev/Prod Parity, & Operational Hardening

### `P3-1`: Pin `search_path` on PostgreSQL Trigger Function
- **Addresses:** `F-12`
- **Target Files / Configs:**
  - `database_coding/schema.sql`
- **Exact Changes Required:**
  - Update `public.set_updated_at()` (`database_coding/schema.sql:60-68`) to:
    ```sql
    create or replace function public.set_updated_at()
    returns trigger
    language plpgsql
    set search_path = public, pg_temp
    as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;
    ```
- **Verification Criteria:**
  - Re-running Supabase Security Advisor reports zero `function_search_path_mutable` warnings on `public.set_updated_at`.

### `P3-2`: Tighten Production `vercel.json` CSP & Cross-Origin Isolation Headers
- **Addresses:** `F-13`
- **Target Files / Configs:**
  - `vercel.json`, `index.html`
- **Exact Changes Required:**
  1. Replace `img-src 'self' data: blob: https:` in `vercel.json:37` with `img-src 'self' data: blob:` (since all 48 site images in `src/data/assets.js` are already self-hosted locally under `/assets/`, and YouTube thumbnails/players run inside the sandboxed `frame-src` iframe).
  2. Self-host the 4 Google Font families (`Black Ops One`, `Chakra Petch`, `Kaushan Script`, `Roboto Condensed`) under `public/fonts/` so `style-src` and `font-src` can drop `https://fonts.googleapis.com` / `https://fonts.gstatic.com`, and evaluate removing `'unsafe-inline'` from `style-src` (or verify whether Tailwind v4 / React inline `style={{...}}` props require style hashes/refactor to CSS classes).
  3. Add `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` to `vercel.json:14-39`.
- **Verification Criteria:**
  - Response headers on production pages include `COOP`, `CORP`, and tightened `img-src 'self' data: blob:` with zero CSP console violations across all pages.

### `P3-3`: Align `vite.config.js` Dev Server Behavior & Block Static Exposure of Server Files
- **Addresses:** `F-14`
- **Target Files / Configs:**
  - `vite.config.js`
- **Exact Changes Required:**
  1. In `vite.config.js:31-34`, only assign `process.env[k] = v` from `loadEnv` if `process.env[k] === undefined` (or track keys loaded from `.env` separately) so shell-provided env overrides are respected.
  2. In `localApiPlugin` (`vite.config.js:16-58`), normalize trailing slashes on `urlPath` (e.g., `/api/orders/` -> `/api/orders` or strict normalized match) and return `404` JSON (`{ error: 'API route not found.' }`) for any unmatched `/api/*` path instead of falling through to `next()` (SPA HTML).
  3. Block Vite dev static serving (`403`/`404`) for `/api/*`, `/database_coding/*`, `/scripts/*`, and `/vercel.json` in `vite.config.js` middleware so raw backend code, `seed.sql` sample PII, and server configs are never served over HTTP in `vite dev`.
  4. Apply baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `/admin` `Cache-Control: no-store`) in Vite dev middleware (and keep CSP report/compatible with Vite HMR in dev) so local testing catches header issues early.
- **Verification Criteria:**
  - `GET /api/nonexistent` returns `404 application/json`, `GET /api/orders/` resolves consistently (not `200 text/html`), and `GET /api/_lib/auth.js`, `/database_coding/seed.sql`, `/scripts/hash-password.mjs`, and `/vercel.json` return `403`/`404` in `vite dev`.
  - Launching Vite with `ADMIN_EMAIL=override@example.com` preserves the override.

### `P3-4`: Implement Dedicated Legal / Contact Pages & Explicit `404` Handling
- **Addresses:** `F-15`
- **Target Files / Configs:**
  - `src/App.jsx`, `src/pages/CatalogPage.jsx`, new pages (e.g., `src/pages/ContactPage.jsx`, `src/pages/PolicyPage.jsx`, `src/pages/NotFoundPage.jsx`)
- **Exact Changes Required:**
  1. Replace `<Route path="*" element={<CatalogPage ... />} />` (`src/App.jsx:105`) with explicit routes for valid catalog/content slugs (`/embroidered-patches`, `/woven-patches`, `/pvc-patches`, `/printed-patches`, `/name-patches`, `/leather-patches`, `/rush-patches`, `/options`, `/hat-patches`, `/blog/*`, `/reviews`, `/gallery`, `/faq`, `/about`, style slugs), dedicated `/contact` (with an actual contact form backed by rate-limited API), `/policies/privacy-policy`, `/policies/terms-and-conditions`, and a real `NotFoundPage` on `*`.
- **Verification Criteria:**
  - `/policies/privacy-policy` and `/policies/terms-and-conditions` render actual legal disclosures; `/contact` renders a working contact form; `/nonexistent-test-path` renders a 404 UI view.

### `P3-5`: Operational Monitoring, Audit Logging, & Secret Rotation Runbook
- **Addresses:** `F-02`, `F-03`, `F-05`
- **Target Files / Configs:**
  - Hosting platform (Vercel Log Drains / Alerts), Supabase Auth & DB Logs, `.env` / Vercel Env Vars
- **Exact Changes Required:**
  1. Emit structured JSON security logs (without logging passwords, cookies, or full PII) on `admin.login.success`, `admin.login.failure`, `admin.login.rate_limited`, `admin.logout`, `orders.create`, `orders.update`, `orders.delete`, and `catalog.update`.
  2. Rotate `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` before production launch and whenever an admin leaves or a key is suspected exposed.
  3. Enable automated Supabase backups and Vercel Production Deployment Protection / Preview environment isolation so preview deployments do not share production `ADMIN_*` or `SUPABASE_SERVICE_ROLE_KEY` credentials.
- **Verification Criteria:**
  - Production log stream records timestamp, event type, request ID, and truncated IP hash for admin auth and order mutations without leaking credentials.
