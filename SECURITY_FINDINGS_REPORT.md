# Patch4Ever Defensive Security Findings Report

**Target Workspace (Read-Only):** `e:\work\demo websites\patch4ever`  
**Assessment Date:** 2026-11-26  
**Scope:** Full static codebase, configuration, SQL schema/seed, build artifact (`dist/`), dependency (`npm audit`), and non-destructive local runtime verification (`http://127.0.0.1:5174`, Vite `7.3.8`, Node `v24.19.0`).  
**Companion Remediation Plan:** `SECURITY_IMPROVEMENT_PLAN.md` (co-located in this folder, 1:1 traceability across `F-01`–`F-16` and `P0-1`–`P3-5`).  
**Constraint Compliance:** Strictly read-only defensive assessment. Zero files inside `e:\work\demo websites\patch4ever` were modified; all `.env` secret values are strictly redacted (`<REDACTED>`).

---

## 1. Executive Summary & Severity Breakdown

Patch4Ever is a React `19.3.1` + Vite `7.3.8` + Tailwind CSS `4.3.5` single-page application paired with 6 Vercel Node.js serverless API functions (`api/*.js`) and 2 shared server helpers (`api/_lib/*.js`) backed by Supabase PostgREST (`database_coding/schema.sql`).

Overall, the repository exhibits strong baseline hygiene in several areas: zero known `npm audit` dependency vulnerabilities across 160 packages, zero unsafe DOM injection sinks (`dangerouslySetInnerHTML`, `innerHTML`, `eval`), `HttpOnly; SameSite=Strict` admin cookies, `scrypt` + `timingSafeEqual` password verification, Supabase RLS enabled on all three tables with `SUPABASE_SERVICE_ROLE_KEY` isolated on the server, CSV formula injection neutralization, sandboxed YouTube embeds, and solid production headers in `vercel.json`.

However, **production deployment without remediation exposes critical business-logic and authentication loopholes**, primarily:
1. Unauthenticated `POST /api/orders` trusts client-supplied `unitPrice`, `totalPrice`, `qty` (ignoring per-type `minQty`), `status` (including `approved`/`completed`), `source`, `adminNotes`, unvalidated `patchType`/`width`/`height`/`upgrades`/`rush`, and silently truncates over-length emails (`F-01`, **Critical**).
2. Admin login rate limiting relies on a client-controllable `X-Forwarded-For` header (in local/multi-proxy setups) and an ephemeral, uncapped process-local `Map` (`F-02`, **High**), while public `POST /api/orders` and `POST /api/newsletter` have zero rate limiting/anti-bot controls and `GET /api/orders` is unpaginated (`F-03`, **High**).
3. Client persistence wrappers in `src/data/orderStore.js` and `src/components/Footer.jsx` silently mask server `4xx`/`5xx`/`503` failures with `localStorage` fallbacks and synthetic success confirmations (`F-04`, **High**).
4. Admin session verification omits `role`, `sub`, and `jti`/revocation checks while still permitting a plaintext `ADMIN_PASSWORD` fallback and weak/whitespace 16-character `ADMIN_SESSION_SECRET` values (`F-05`, **High**).

### Severity Breakdown (16 Verified Findings)

| Severity | Count | Finding IDs |
|---|---:|---|
| **Critical** | 1 | `F-01` |
| **High** | 4 | `F-02`, `F-03`, `F-04`, `F-05` |
| **Medium** | 6 | `F-06`, `F-07`, `F-08`, `F-09`, `F-10`, `F-11` |
| **Low** | 4 | `F-12`, `F-13`, `F-14`, `F-15` |
| **Informational** | 1 | `F-16` |
| **Total** | **16** | `F-01` – `F-16` |

---

## 2. 100% Assessment Coverage Matrix

Every route/page, UI component, data/crypto utility, backend API endpoint/helper, SQL object, configuration/script/entry file, public asset directory, `dist/` artifact, and dependency lockfile present in `e:\work\demo websites\patch4ever` (`112` non-`dist` source/config/public files + `71` files in `dist/` + `160` locked packages) is accounted for below:

### 2.1 Frontend Routes, Pages, Entry & Styles (`src/`)

| Item / Route | File Path | Role / Exposure | Findings / Status |
|---|---|---|---|
| Entry mount | `src/main.jsx` | Mounts `<App />` in `<StrictMode>` (`L1-10`) | Clean; imports `index.css` and `App` |
| Router & Shell | `src/App.jsx` | Defines routes, `ScrollToTop`, dark-mode state, in-memory `cart` (`L1-130`) | `F-07` (static `AdminPage` import `L11`), `F-09` (stale `unitPrice` on cart qty updates `L62, 73`), `F-15` (`ScrollToTop` `querySelector(hash)` & `*` route) |
| Global styles | `src/index.css` | Tailwind v4 `@theme`, tactical CSS classes, reduced-motion rules (`L1-624`) | Clean; pure CSS, no `url(http...)` external trackers |
| `/` | `src/pages/HomePage.jsx` | Landing page, hero, patch type cards, video modal trigger, reviews, blog (`L1-922`) | `F-15` (links `/contact` form at `L507, 524-529`); positive: `rel="noopener noreferrer"` (`L622-623`) |
| `/make-your-own-patches`, `/order` | `src/pages/OrderPage.jsx` | 9-step custom patch order builder & submit (`L1-860`) | `F-01`, `F-04` (false confirmation on error), `F-09` (filename-only artwork; `1.28` leather multiplier `L114`), `F-10` (crash on empty `catalog` `L95-97, 167-168, 191-192` & disabled `patchType` retention `L53-63`) |
| `/quote` | `src/pages/QuotePage.jsx` | 10-step free quote request form (`L1-567`) | `F-01`, `F-04`, `F-09` (omits coverage/backing surcharges `L83`; filename-only artwork `L105`; static `PATCH_TYPES` & hardcoded `min={10}` `L153-173, 350-353`) |
| `/pricing` | `src/pages/PricingPage.jsx` | Interactive price calculator & static matrices (`L1-442`) | `F-09` (hardcoded `min={10}` on `QTY` range slider `L244` ignores `pvc` `50` / `leather` `25` minimums; adds to in-memory cart `L85-94`) |
| `/admin`, `/admin/login`, `/admin/*` | `src/pages/AdminPage.jsx` | Admin sign-in, overview KPIs, order CRUD, catalog editor, CSV export (`L1-1046`) | `F-03` (`adminNotes` `PATCH` per keystroke `L1032-1039`), `F-04` (`L226-231`), `F-07`, `F-08` (`L274-289`) |
| `*` (catch-all) | `src/pages/CatalogPage.jsx` | Dynamic product/style/blog/info landing pages (`L1-272`) | `F-09` (`fromPrice * 3` Quick Add `L216-217`), `F-15` (catch-all 200 on missing routes & `/contact`/`/policies/*`) |

### 2.2 Frontend UI Components (`src/components/`)

| Component | File Path | Behavior / Sinks | Findings / Status |
|---|---|---|---|
| `Header` | `src/components/Header.jsx` | Top utility bar, mega-menus, sticky peek bar, mobile drawer (`L1-600`) | Clean; React JSX escaping only |
| `Footer` | `src/components/Footer.jsx` | Newsletter signup (`POST /api/newsletter`), social/BBB/legal links (`L1-288`) | `F-04` (`handleSubscribe` ignores `res.ok` `L18-28`), `F-15` (dead legal links `L268-273`); positive: `rel="noopener noreferrer"` |
| `FooterPaw` | `src/components/FooterPaw.jsx` | Easter-egg `IntersectionObserver` + `mousemove` animation (`L1-124`) | Clean; uses `createElement` + `img.src = ASSETS.footerPaw` (`L37-48`), no `innerHTML` |
| `CartDrawer` | `src/components/CartDrawer.jsx` | Slide-over cart list, qty +/- controls, `/quote` link (`L1-136`) | `F-09` (hardcoded `Math.max(10, item.qty - 10)` at `L83`; cart items not passed to `/quote` at `L124-130`) |
| `VideoModal` | `src/components/VideoModal.jsx` | YouTube modal player (`L1-47`) | Positive control: `YOUTUBE_ID_RE`, `youtube-nocookie.com`, `sandbox`, `strict-origin-when-cross-origin` |
| `Logo` | `src/components/Logo.jsx` | Inline SVG brand mark (`L1-23`) | Clean; static JSX SVG |
| `SplitPillCTA` | `src/components/SplitPillCTA.jsx` | Dual CTA linking `/make-your-own-patches` and `/quote` (`L1-37`) | Clean; static React Router `<Link>` |
| `StyleIcon` | `src/components/StyleIcon.jsx` | Allowlisted `lucide-react` icon mapper (`L1-50`) | Clean; static `ICONS[name] || Shield` (`L48`) |
| `TextReveal` | `src/components/TextReveal.jsx` | `useInViewOnce`, `MaskedText`, `RevealBlock` scroll animations (`L1-121`) | Clean; JSX text & transition delays only |

### 2.3 Frontend Data & Crypto Utilities (`src/data/`, `src/utils/`)

| Module | File Path | Purpose | Findings / Status |
|---|---|---|---|
| Order & Catalog Store | `src/data/orderStore.js` | Artwork extension check, `SEED_ORDERS`, API + `localStorage` fallback, CSV export (`L1-608`) | `F-04` (`L360-533`), `F-07` (`SEED_ORDERS` `L76-273`), `F-09` (`validateArtworkFile` `L11-30`); positive: `safeCsvCell` (`L544-551`) |
| Pricing Matrices | `src/data/pricingData.js` | Patch pricing tables & `lookupUnitPrice` (`L1-146`) | `F-01` (client-only pricing, not shared/enforced on server), `F-09` (`LEATHER_VARIANTS` vs `OrderPage.jsx:114`) |
| Site Content | `src/data/siteData.js` | Static copy, contact info, Trustpilot links, footer links (`L1-382`) | `F-15` (references unimplemented `/contact` and `/payment-form` `L371, 378`) |
| Asset Manifest | `src/data/assets.js` | 48 local `/assets/*` key-value mappings (`L1-51`) | Clean; all 48 entries resolve locally under `/assets/` |
| Web Crypto Storage | `src/utils/cryptoStore.js` | AES-GCM-256 + PBKDF2 wrapper for `localStorage` (`L1-96`) | `F-07` (`SALT_KEY`/`SEED_KEY` stored alongside ciphertext `L3-4, 23-52`; plaintext fallback `L60-63`) |

### 2.4 Backend API Endpoints & Helpers (`api/`)

| Endpoint / Module | File Path | Methods / Exports | Findings / Status |
|---|---|---|---|
| Admin Login | `api/admin/login.js` | `POST` (`handler`, `L1-94`) | `F-02`, `F-05`, `F-06`, `F-08` (`503` env var leak `L28-33`), `F-11` |
| Admin Logout | `api/admin/logout.js` | `POST` (`handler`, `L1-26`) | `F-05` (no server revocation), `F-06` (no `Origin` check), `F-11` |
| Admin Session | `api/admin/session.js` | `GET` (`handler`, `L1-36`) | `F-05` (no `role`/`sub` check `L26-30`), `F-08` (`503 { misconfigured: true }` `L17-22`) |
| Orders API | `api/orders.js` | `GET`, `POST`, `PATCH`, `DELETE` (`L1-130`) | `F-01` (`POST`), `F-03` (`POST` unthrottled & `GET` unpaginated `L67-70`), `F-06`, `F-08` (`L30-35, 55, 74, 108, 124`), `F-10` (`L98-125`), `F-16` (`EMAIL_RE` `L14`) |
| Catalog API | `api/catalog.js` | `GET`, `PUT` (`L1-61`) | `F-06`, `F-08` (`L7-12, 24, 55`), `F-10` (shallow `PUT` check allowing `[]` `L36-45`) |
| Newsletter API | `api/newsletter.js` | `POST` (`L1-38`) | `F-03`, `F-06`, `F-08` (`L14-19, 36`), `F-16` (`EMAIL_RE` `L4`); positive: `ignore-duplicates` (`L32`) |
| Auth Helper | `api/_lib/auth.js` | Cookie, password, HMAC token, rate-limit, body parser, `requireAdmin` (`L1-217`) | `F-02` (uncapped `Map` `L7, 142-168`), `F-05` (whitespace secret `L130`), `F-06` (`req.body` bypass `L170-189`), `F-11` |
| Supabase Helper | `api/_lib/supabase.js` | `VALID_ORDER_STATUSES`, `supabaseFetch`, `mapOrderToRow`, `mapRowToOrder` (`L1-143`) | `F-01` (`mapOrderToRow` `L77-111`); positive: server-only `SUPABASE_SERVICE_ROLE_KEY` |

### 2.5 Database, Hosting Configs, Scripts, Public Assets, Build (`dist/`), & Dependencies

| Area | File / Target | Coverage Notes | Findings / Status |
|---|---|---|---|
| SQL Schema | `database_coding/schema.sql` | Sequence `p4e_order_number_seq`, tables `orders`, `catalog_config`, `newsletter_subscribers`, triggers, RLS (`L1-94`) | `F-01` & `F-12` (`unit_price >= 0` `L25-26`; mutable `search_path` `L60-68`); positive: RLS (`L85-94`) |
| SQL Seed | `database_coding/seed.sql` | Default `catalog_config` + 7 sample orders `P4E-1042`..`P4E-1048` (`L1-103`) | `F-07` (realistic PII seeded if executed in prod `L42-103`); `F-14` (exposed via Vite dev static server) |
| Hosting Config | `vercel.json` | Vite build (`outputDirectory: "dist"`), SPA rewrite `/((?!api/).*)`, security headers, `/admin` headers (`L1-68`) | `F-13` (CSP `'unsafe-inline'` & `img-src https:`, missing `COOP`/`CORP` `L14-39`); `F-14` (`/vercel.json` exposed via Vite dev) |
| Dev Server | `vite.config.js` | `localApiPlugin` dev middleware + Vite plugins (`L1-65`) | `F-14` (missing headers, `/api/*` & `/api/orders/` HTML fallback, static serving of `/api/*`, `/database_coding/*`, `/scripts/*`, `/vercel.json`, env overwrite `L31-34`) |
| HTML Entry | `index.html` | Root HTML, meta tags, Google Fonts stylesheet, `/theme-init.js`, `/src/main.jsx` (`L1-26`) | `F-13` (external Google Fonts `L14-19`); positive: no inline `<script>` |
| Theme Script | `public/theme-init.js` | Reads `localStorage.getItem('p4e-theme')` and sets `.dark` class (`L1-7`) | Clean; `try/catch` wrapped, no DOM text sinks |
| Static Assets | `public/assets/` | 67 static image files across root & 7 subdirs (`blog/`, `clients/`, `designing/`, `home/`, `masks/`, `misc/`, `types/`) | Clean; binary/image assets only (19 legacy/unused `.jpg`/`.webp` files alongside 48 active assets) |
| Env & Git Config | `.env`, `.env.example`, `.gitignore`, `.vscode/settings.json` | `.env` gitignored (`.gitignore:5`, absent from `git ls-files` & `git log`); `.env` has `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (`<REDACTED>`), `ADMIN_SESSION_SECRET` (`<REDACTED>`), empty `SUPABASE_*` | `F-04`/`F-08` (empty `SUPABASE_*` triggers `503` + `localStorage` fallback locally); `.vscode/settings.json` clean; `/.env` blocked (`403`) by Vite |
| CLI Scripts | `scripts/hash-password.mjs`, `scripts/fetch-assets.mjs` | Scrypt/secret generator (`L1-29`); build-time asset downloader (`L1-115`) | `F-16` (`process.argv[2]` password exposure in `hash-password.mjs:20-22`); `F-14` (`scripts/hash-password.mjs` served in Vite dev); `fetch-assets.mjs` not used at runtime |
| Production Build | `dist/` (`71` files) | `dist/index.html`, `dist/theme-init.js`, `dist/assets/index-siYlojo7.js` (`487,942` B), `dist/assets/index-CtQk4qhL.css` (`98,778` B), 67 asset files | `F-07` (`mvance@ocalafire.gov` & `Admin Sign In` present in `index-siYlojo7.js`); positive: zero `.env` secrets bundled |
| Dependencies | `package.json`, `package-lock.json` | `react@19.3.1`, `react-dom@19.3.1`, `react-router-dom@7.18.6`, `lucide-react@0.511.0`, `vite@7.3.8`, `tailwindcss@4.3.5`, `@tailwindcss/vite@4.3.5`, `@vitejs/plugin-react@4.7.0` (`lockfileVersion: 3`) | Clean: `npm audit --json` = `0` vulnerabilities across `160` packages (`9` prod, `152` dev, `82` optional, `62` peer) |

---

## 3. Detailed Security Findings (`F-01` – `F-16`)

### `F-01` — Unauthenticated `POST /api/orders` Trusts Client-Supplied Pricing, Quantity, Status, Order Specs, Source, and `adminNotes`, and Silently Truncates Emails
- **Severity:** **Critical**
- **Affected Files:**
  - `api/orders.js:38-57`
  - `api/_lib/supabase.js:3-11, 77-111`
  - `src/pages/OrderPage.jsx:189-190`, `src/pages/QuotePage.jsx:91`
  - `src/data/pricingData.js:114-146`
  - `database_coding/schema.sql:25-26`
- **Technical Description:**
  The public order creation branch (`POST /api/orders`) runs before `requireAdmin(req)` (`api/orders.js:60`) and passes raw client JSON directly through `mapOrderToRow(body)` into Supabase using `SUPABASE_SERVICE_ROLE_KEY`. Beyond trusting pricing, quantity, status, and internal notes, `mapOrderToRow` fails to validate core order specifications and silently truncates emails before validation:
  1. **Pricing, Quantity, Status, & Admin Fields (`api/_lib/supabase.js:78-85, 99-100, 109`):** Trusts client-supplied `unitPrice`, `totalPrice`, `qty` (clamped only to `1..1000000`, ignoring per-type `minQty` such as PVC `50` or Leather `25`), `status` (allowing any value in `VALID_ORDER_STATUSES`, including `'approved'`, `'in-production'`, `'shipped'`, and `'completed'`), `source`, and `adminNotes`:
     ```js
     // api/_lib/supabase.js:78-85, 99-100, 109
     const qty = Math.round(clampNum(data?.qty, 1, 1000000, 10))
     const unitPrice = Number(clampNum(data?.unitPrice, 0, 10000, 0).toFixed(2))
     const totalPrice = Number(clampNum(data?.totalPrice, 0, 10000000, unitPrice * qty).toFixed(2))
     const status = VALID_ORDER_STATUSES.includes(data?.status) ? data.status : 'proof-pending'
     ...
     admin_notes: cleanStr(data?.adminNotes, 2000),
     ```
  2. **Unvalidated `patchType`, `shape`, `coverage`, `border`, `backing`, & `upgrades` (`api/_lib/supabase.js:86-96`):** `patch_type` (`cleanStr(data?.patchType, 40, 'embroidered')`), `shape`, `coverage`, `border`, `backing`, and `upgrades` (`slice(0, 10)` of arbitrary strings up to 80 chars) are not checked against `catalog_config`. Meanwhile, `OrderPage.jsx:189-190` sends `finishLabel` as `coverage` (e.g., `'3D Molded PVC'`, `'Genuine Leather · Debossed'`), whereas `QuotePage.jsx:91` sends `'75%'` or `'Standard'`.
  3. **Non-Numeric `width`/`height` Decoupled from `size` (`api/_lib/supabase.js:88-90`):** `width` and `height` (`cleanStr(String(data?.width ?? '3.00'), 16, '3.00')`) accept non-numeric strings (including formula-like strings such as `'=CMD()'`) and are completely decoupled from `size` (`clampNum(data?.size, 0.5, 24, 3)`).
  4. **Unchecked `rush` Flag (`api/_lib/supabase.js:98`):** `rush: Boolean(data?.rush)` permits `rush: true` even on patch types where `rushAvailable` is `false` (e.g., PVC, Leather, Name).
  5. **Silent 150-Character Email Truncation Before Validation (`api/_lib/supabase.js:102`, `api/orders.js:42`):** `mapOrderToRow` slices `email` to 150 characters (`cleanStr(data?.email, 150).toLowerCase()`) *before* `EMAIL_RE.test(row.email)` runs in `api/orders.js:42`, silently mutating a 151-character email rather than rejecting it with `400`.
  Meanwhile, `database_coding/schema.sql:25-26` allows `unit_price >= 0` and `total_price >= 0`, and `src/data/pricingData.js` exists only on the client.
- **Reproducible Evidence:**
  - Unit check 1 (`verify_checks.log`): `mapOrderToRow({ patchType: 'pvc', qty: 1, unitPrice: 0, totalPrice: 0, status: 'approved', source: 'Tampered', adminNotes: 'Injected' })` produced `{"source":"Tampered","status":"approved","patch_type":"pvc",...,"qty":1,"unit_price":0,"total_price":0,...,"admin_notes":"Injected"}`.
  - Unit check 2 (`runtime_checks_r2.log`): `mapOrderToRow({ patchType: 'unknown-type', rush: true, width: 'not-a-num', height: '=CMD()', size: 0.5, qty: 1, unitPrice: 0, totalPrice: 0, status: 'approved', upgrades: ['FakeUpgrade'], customerName: 'Test User', email: 'a'.repeat(145) + '@b.com' })` accepted all unvalidated values and silently truncated the 151-char email to 150 chars (`...aaaa@b.co`).
- **Impact:** Any unauthenticated user can persist `$0.00` orders, bypass minimum order quantities, pre-mark unapproved/unpaid orders as `'approved'`/`'completed'`, spoof `source`, inject internal `admin_notes`, persist arbitrary/inconsistent specs (`rush: true` on non-rush types, non-numeric dimensions), and corrupt customer contact emails via silent truncation.

---

### `F-02` — Admin Login Rate Limiter Bypassable via `X-Forwarded-For` Spoofing, Uncapped `Map` Growth, & Ephemeral In-Memory State
- **Severity:** **High**
- **Affected Files:**
  - `api/_lib/auth.js:5-7, 134-168`
  - `api/admin/login.js:35-42`
- **Technical Description:**
  Login brute-force protection (`5` failed attempts per `15` minutes) is keyed on `getClientIp(req)` (`api/_lib/auth.js:134-140`), which unconditionally trusts the leftmost IP in `X-Forwarded-For`:
  ```js
  // api/_lib/auth.js:134-140
  export function getClientIp(req) {
    const forwarded = req?.headers?.['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.trim()) {
      return forwarded.split(',')[0].trim()
    }
    return req?.socket?.remoteAddress || 'unknown'
  }
  ```
  Deployment & memory-exhaustion nuances:
  1. **Deployment-Specific Header Trust:** On Vercel Edge specifically, Vercel overwrites/normalizes `x-forwarded-for` at the edge; however, in local Vite/Node development or multi-proxy deployments, `forwarded.split(',')[0].trim()` (`L137`) is trivially spoofed by any client.
  2. **Ephemeral Isolate State & Missing Email Throttling:** `const failedAttemptsByIp = new Map()` (`api/_lib/auth.js:7`) resides only in process-local memory (lost on Vercel serverless cold starts and unshared across concurrent isolates, with no account-level throttling on `email`).
  3. **Uncapped `Map` Memory Leak (`api/_lib/auth.js:7, 142-168`):** `failedAttemptsByIp` has no maximum entry cap, and `pruneAttempts(ip, now)` (`L142-148`) only prunes the single `ip` key being queried—meaning rotating `X-Forwarded-For` against any persistent Node process causes unbounded `Map` growth.
- **Reproducible Evidence:**
  Verified against isolated Vite `5174`: sending 5 failed `POST /api/admin/login` requests with `X-Forwarded-For: 198.51.100.10` returned `401 Unauthorized`, the 6th returned `429 Too Many Requests` (`Retry-After: 899`), and the immediate 7th request from the exact same connection with `X-Forwarded-For: 203.0.113.99` bypassed the lockout and returned `401 Unauthorized`.
- **Impact:** Unlimited credential-stuffing / password brute-force attempts against `/api/admin/login` across serverless isolates (or via header spoofing in non-Vercel-Edge setups) and unbounded memory growth under rotating IP headers in persistent Node processes.

---

### `F-03` — Unthrottled Public `POST` Endpoints, Unbounded `GET /api/orders`, & Un-debounced Admin Keystroke `PATCH` Amplification
- **Severity:** **High**
- **Affected Files:**
  - `api/orders.js:38-57, 65-76` (`POST /api/orders`, `GET /api/orders`)
  - `api/newsletter.js:6-38` (`POST /api/newsletter`)
  - `src/pages/AdminPage.jsx:215-218, 1032-1039`
- **Technical Description:**
  1. Neither `POST /api/orders` (`api/orders.js:38-57`) nor `POST /api/newsletter` (`api/newsletter.js:6-38`) applies any IP rate limiting, cooldown, or bot-verification challenge (e.g., Turnstile/hCaptcha).
  2. `GET /api/orders` (`api/orders.js:67-70`) executes `supabaseFetch('orders', { method: 'GET', query: 'select=*&order=created_at.desc' })` with **no `limit` or pagination**, returning the entire `orders` table in one response.
  3. In `src/pages/AdminPage.jsx:1032-1039`, the `adminNotes` `<textarea>` calls `onChange={(e) => handleNotesChange(selectedOrder.id, e.target.value)}`, which immediately invokes `updateOrderAsync` -> `fetch('/api/orders?id=...', { method: 'PATCH' })` on every single keystroke.
- **Reproducible Evidence:** Direct code inspection of `api/orders.js:38-57, 67-70` (no `checkRateLimit` import or call; unpaginated `select=*`), `api/newsletter.js:6-38` (no rate limiter), and `src/pages/AdminPage.jsx:215-218, 1032-1039`.
- **Impact:** Automated spam/database flooding of `orders` (exhausting `p4e_order_number_seq` and cluttering admin queues) and `newsletter_subscribers`, unbounded memory/bandwidth growth on `GET /api/orders` as order volume scales, and redundant `PATCH` traffic with race conditions when editing admin notes.

---

### `F-04` — Silent `localStorage` Fallback & Missing `res.ok` Checks Mask API Failures as False Successes
- **Severity:** **High**
- **Affected Files:**
  - `src/data/orderStore.js:360-380, 391-481, 520-533`
  - `src/pages/OrderPage.jsx:183-209, 241-268`
  - `src/pages/QuotePage.jsx:84-109, 123-143`
  - `src/pages/AdminPage.jsx:226-231`
  - `src/components/Footer.jsx:14-29`
- **Technical Description:**
  All client persistence helpers silently swallow HTTP errors (`400`, `401`, `500`, `503`) and network failures:
  - `createOrderAsync` (`src/data/orderStore.js:391-429`): If `POST /api/orders` returns non-OK or throws, it falls through to `loadOrdersLocalFallback()`, fabricates a local `P4E-*` ID, saves to browser `localStorage`, and returns the object. `OrderPage.jsx:208, 245` then displays `"ORDER #P4E-1049 CONFIRMED"` and `QuotePage.jsx:108, 127` displays `"Quote Request Received!"`—even though nothing reached the server.
  - `saveCatalogConfigAsync` (`src/data/orderStore.js:520-533`): Does not inspect `res.ok` on `PUT /api/catalog`; `AdminPage.jsx:226-230` unconditionally displays `"Order page settings saved!"` even on `401 Unauthorized` (expired admin session) or `503`.
  - `Footer.jsx:18-28`: `handleSubscribe` ignores `res.ok` and unconditionally executes `setSubscribed(true)` (`"Thanks for subscribing!"`).
  - `loadOrdersAsync` (`src/data/orderStore.js:373-379`): Falls back to `loadOrdersLocalFallback()` (seeding `SEED_ORDERS`) on `503` or network exceptions.
- **Reproducible Evidence:** Confirmed locally: with `.env` Supabase variables blank, `GET /api/orders`, `POST /api/orders`, and `PUT /api/catalog` all return HTTP `503`, which `orderStore.js` catches/bypasses into `localStorage` without surfacing any error to UI callers.
- **Impact:** Silent data loss of real customer orders, quote requests, newsletter signups, and admin configuration edits in production during transient outages, validation rejections, or expired admin sessions.

---

### `F-05` — Stateless Session Verification Omits `role`/`sub`/`jti` Validation & Logout Revocation; Plaintext Password Fallback & Whitespace/Weak Secret Floor
- **Severity:** **High**
- **Affected Files:**
  - `api/_lib/auth.js:58-86, 97-132, 206-217`
  - `api/admin/login.js:17-18, 56-79`
  - `api/admin/session.js:26-35`
  - `api/admin/logout.js:16-25`
- **Technical Description:**
  1. `verifySessionToken` (`api/_lib/auth.js:113-118`), `requireAdmin` (`L206-217`), and `api/admin/session.js:26-35` only check the HMAC-SHA256 signature and `payload.exp > Date.now()`. They never verify `payload.role === 'admin'` or match `payload.sub` against `process.env.ADMIN_EMAIL`. Note that `api/admin/login.js:71-79` is currently the sole caller of `signSessionToken` and hardcodes `role: 'admin'`, so an attacker cannot mint a non-admin token without already possessing `ADMIN_SESSION_SECRET`; the practical risks are stale tokens surviving `ADMIN_EMAIL` rotation (`sub` unchecked) and future multi-role expansion bugs.
  2. Tokens are minted with up to 7-day lifetimes (`SESSION_REMEMBER_MS = 7 * 24 * 60 * 60 * 1000`, `api/admin/login.js:18`) without a `jti` token ID. `POST /api/admin/logout` (`api/admin/logout.js:16-25`) only clears the browser cookie (`Max-Age=0`), leaving captured/logged-out tokens valid until `exp`.
  3. `verifyPassword` (`api/_lib/auth.js:75-77`) and `isAuthConfigured` (`L128`) still accept a plaintext `ADMIN_PASSWORD` environment variable (`sha256Equal`) when `ADMIN_PASSWORD_HASH` is unset.
  4. `isAuthConfigured` (`api/_lib/auth.js:130`) checks `Boolean(process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16)` **without `.trim()`** (unlike `ADMIN_EMAIL` at `L125` and `ADMIN_PASSWORD_HASH` at `L127`), accepting `' '.repeat(16)` (16 spaces) as configured and allowing weak 16-byte secrets below 256-bit HMAC key strength. `hashPasswordScrypt`/`verifyPassword` (`L68, 84`) also rely on implicit Node `scryptSync` defaults without encoding explicit `N`/`r`/`p` cost parameters.
- **Reproducible Evidence:**
  - Unit check 1 (`verify_checks.log`): Signed `{ sub: 'viewer@example.com', role: 'viewer', exp: Date.now() + 60000 }` and confirmed `verifySessionToken(tok, sec)` returned `{"sub":"viewer@example.com","role":"viewer","exp":...}` instead of `null`.
  - Unit check 2 (`runtime_checks_r2.log`): Setting `ADMIN_SESSION_SECRET = ' '.repeat(16)` returned `isAuthConfigured() = true`.
- **Impact:** Stale sessions surviving admin email rotation, inability to revoke stolen/logged-out admin sessions for up to 7 days, potential plaintext credential exposure in environment configs, and acceptance of whitespace-only or low-entropy HMAC secrets.

---

### `F-06` — Missing `Content-Type: application/json` & `Origin` Checks and `req.body` Pre-Parsing Bypass of `readJsonBody` Size Limit
- **Severity:** **Medium**
- **Affected Files:**
  - `api/_lib/auth.js:170-204`
  - `api/orders.js`, `api/newsletter.js`, `api/catalog.js`, `api/admin/login.js`, `api/admin/logout.js`
- **Technical Description:**
  1. `readJsonBody(req)` (`api/_lib/auth.js:170-204`) parses `JSON.parse(raw)` regardless of the request's `Content-Type` header (accepting `text/plain` or omitted `Content-Type`).
  2. None of the state-changing endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) verify `Origin` or `Referer` headers against the site origin.
  3. **Vercel Pre-Parsed `req.body` Bypasses the 32KB Limit (`api/_lib/auth.js:171-178`):** `readJsonBody` immediately returns `req.body` if `req.body && typeof req.body === 'object'` (`L171`, which also passes JS arrays since `typeof [] === 'object'`) or parses `typeof req.body === 'string'` (`L172-177`) *before* the `raw.length > 32768` check (`L186`) is ever reached. In Vercel's Node.js serverless runtime (which pre-parses `application/json` bodies up to 4.5 MB by default), the 32KB cap is completely bypassed.
  4. On raw streams (`L183-202`), `readJsonBody` measures `raw.length` (UTF-16 characters rather than byte length), does not call `req.destroy()` when oversized, and silently resolves `{}` on both oversized payloads (`L188`) and malformed JSON (`L176, L199`) instead of returning HTTP `413` or `400`.
- **Reproducible Evidence:**
  - Live check on Vite `5174`: `POST /api/admin/login` with `Content-Type: text/plain` and body `{"email":"","password":""}` was parsed by `readJsonBody` and reached credential validation (`400 {"error":"Valid email and password are required."}`).
  - Unit check (`runtime_checks_r2.log`): `readJsonBody({ body: { notes: 'A'.repeat(100000) } })` returned an object with `notes.length = 100000`, bypassing the 32KB cap.
- **Impact:** Simple cross-origin requests (`Content-Type: text/plain`) bypass CORS preflight against public `POST /api/orders` and `POST /api/newsletter`; in Vercel production, attackers can submit multi-megabyte JSON bodies bypassing the intended 32KB cap; and malformed/oversized payloads silently coerce to `{}` instead of failing explicitly with `413`/`400`.

---

### `F-07` — Ineffective Client-Side Encryption (`cryptoStore.js`), Bundled `SEED_ORDERS` PII, Static `AdminPage`, & Realistic PII in `seed.sql`
- **Severity:** **Medium**
- **Affected Files:**
  - `src/utils/cryptoStore.js:3-4, 23-63`
  - `src/data/orderStore.js:76-273`
  - `src/App.jsx:11, 102-104`
  - `dist/assets/index-siYlojo7.js`
  - `database_coding/seed.sql:42-103`
- **Technical Description:**
  1. `cryptoStore.js:23-52` stores `SALT_KEY` (`p4e-storage-salt-v1`) and `SEED_KEY` (`p4e-storage-seed-v1`) in plaintext inside the exact same `localStorage` as the encrypted ciphertext (`p4e-orders-enc-v2`). Any XSS script or local inspector reading `localStorage` can trivially re-derive the AES-GCM key. On non-secure HTTP contexts where `window.crypto.subtle` is undefined, `cryptoStore.js:60-63` falls back to plaintext `localStorage.setItem`.
  2. `src/App.jsx:11` statically imports `AdminPage`, which imports `orderStore.js`, compiling `SEED_ORDERS` (`src/data/orderStore.js:76-273` — 7 customer records with names, `.gov`/`.org`/`.com` emails, phones, street addresses, and internal notes) and all admin portal UI code into the single public bundle `dist/assets/index-siYlojo7.js` (`487,942` bytes).
  3. `database_coding/seed.sql:42-103` seeds those same 7 realistic customer records directly into PostgreSQL `orders`.
- **Reproducible Evidence:**
  Direct inspection of `dist/assets/index-siYlojo7.js` confirmed `mvance@ocalafire.gov` (`true`) and `Admin Sign In` (`true`) are present in the compiled public JS bundle.
- **Impact:** False sense of confidentiality from client-side `localStorage` encryption, unnecessary public exposure of sample customer PII and admin UI internals, and risk of polluting a production database with mock orders if `seed.sql` is run unmodified.

---

### `F-08` — Configuration & Database Error Information Disclosure + DB Check Prior to Auth/Method Guards
- **Severity:** **Medium**
- **Affected Files:**
  - `api/orders.js:30-35, 55, 74, 108, 124`
  - `api/catalog.js:7-12, 24, 55`
  - `api/newsletter.js:14-19, 36`
  - `api/admin/login.js:28-33`
  - `api/admin/session.js:17-22`
  - `src/pages/AdminPage.jsx:274-289`
- **Technical Description:**
  1. In `api/orders.js:30-35` and `api/catalog.js:7-12`, `isSupabaseConfigured()` executes **before** `requireAdmin(req)` and HTTP method (`405`) checks, disclosing database configuration status to unauthenticated callers.
  2. `503` responses in `api/orders.js:32`, `api/catalog.js:9`, and `api/admin/login.js:31` return exact internal environment variable names (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).
  3. `api/admin/session.js:20` returns `misconfigured: true`, causing `AdminPage.jsx:274-289` to render an unauthenticated banner detailing env vars and `node scripts/hash-password.mjs`.
  4. All `500` `catch` blocks (`api/orders.js:55, 74, 108, 124`, `api/catalog.js:24, 55`, `api/newsletter.js:36`) return raw `err.message` from `supabaseFetch` directly to clients.
- **Reproducible Evidence:**
  Live checks on Vite `5174` confirmed unauthenticated `GET /api/orders`, `PUT /api/catalog`, and `POST /api/catalog` all returned `503 Service Unavailable` with `{"error":"Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.","unconfigured":true}` instead of `401`/`405`.
- **Impact:** Aids attacker reconnaissance by exposing backend stack, env var names, misconfiguration state, and raw PostgREST/PostgreSQL error details.

---

### `F-09` — Artwork Files Are Never Uploaded Server-Side & Client Pricing/Cart/Min-Qty Calculation Inconsistencies
- **Severity:** **Medium**
- **Affected Files:**
  - `src/data/orderStore.js:11-30` (`validateArtworkFile`)
  - `src/pages/OrderPage.jsx:114, 147-162, 204`
  - `src/pages/QuotePage.jsx:60-78, 83, 105, 153-173, 350-353`
  - `src/pages/PricingPage.jsx:244`
  - `src/pages/CatalogPage.jsx:216-217`
  - `src/components/CartDrawer.jsx:83, 124-130`
  - `src/App.jsx:62, 73`
  - `src/data/pricingData.js:103-112`
- **Technical Description:**
  1. `validateArtworkFile` (`orderStore.js:11-30`) validates only `file.name` extension and `file.size`, without inspecting file magic bytes. More critically, neither `OrderPage.jsx:161, 204` nor `QuotePage.jsx:70-73, 105` ever uploads the file binary to a server or object store—only `artworkName` (the filename string) is sent in JSON.
  2. Client pricing, catalog alignment, and minimum-quantity logic diverges across all 4 purchasing views and the cart:
     - `OrderPage.jsx:114` uses a flat `1.28` multiplier for all `'Genuine'` leather options (`Genuine Leather · Debossed` is `1.32` in `pricingData.js:110`, and `Faux Leather · UV Printed` is `1.15` in `pricingData.js:105` rather than `1.00`).
     - `QuotePage.jsx:83` calls `lookupUnitPrice` without `coverage` or backing/addon surcharges; additionally, `QuotePage.jsx:153-173` maps static `PATCH_TYPES` (ignoring `catalog_config` disabled patch types) and `L350-353` hardcodes `min={10}` and `Math.max(10, ...)` for all patch types (allowing `qty=10` for PVC `min=50` and Leather `min=25`).
     - `PricingPage.jsx:244` hardcodes `min={10}` on the `QTY` range slider regardless of `patchType` (allowing `qty=10` for PVC and Leather).
     - `CatalogPage.jsx:216-217` prices `"Quick Add 100"` using `fromPrice * 3` instead of `lookupUnitPrice`.
     - `src/App.jsx:62, 73` (`handleAddToCart` and `handleUpdateQty`, backing `CartDrawer`) updates `totalPrice` as `(p.qty + item.qty) * p.unitPrice` and `newQty * p.unitPrice`, reusing stale `p.unitPrice` instead of recalculating tier pricing when quantities cross volume breakpoints.
     - `CartDrawer.jsx:83` enforces `Math.max(10, item.qty - 10)` regardless of higher minimums (PVC `50`, Leather `25`, Hats `12`), and `"Submit Order"` (`L124-130`) navigates to `/quote` without passing cart items.
- **Reproducible Evidence:** Unit check confirmed `lookupUnitPrice({ patchType: 'leather', sizeInches: 3, qty: 100 }) * 1.28 = 4.93`, whereas `LEATHER_VARIANTS['genuine-debossed'].rows['3.00'][2] = 5.08`; direct code inspection verified `App.jsx:62, 73`, `PricingPage.jsx:244`, and `QuotePage.jsx:153-173, 350-353`.
- **Impact:** Lost customer artwork uploads, unvalidated file types if future upload handling relies on `validateArtworkFile`, inconsistent customer quotes vs. catalog pricing, stale cart unit prices after quantity adjustments, and sub-minimum orders submitted from `/pricing` and `/quote`.

---

### `F-10` — Shallow `PUT /api/catalog` Validation Causes `OrderPage` Crash on Empty Arrays, Disabled `patchType` Retention, & `200` on Missing Order IDs
- **Severity:** **Medium**
- **Affected Files:**
  - `api/catalog.js:36-45`
  - `api/orders.js:98-125`
  - `src/pages/OrderPage.jsx:45-63, 95-97, 167-168, 191-192`
- **Technical Description:**
  1. `PUT /api/catalog` (`api/catalog.js:36-45`) checks only `Array.isArray` on `patchTypes`, `borders`, `backings`, and `upgrades`—allowing empty arrays (`[]`), negative prices, missing fields, and arbitrary extra keys.
  2. When `catalog_config` contains empty arrays (or all items disabled), `OrderPage.jsx:95-97` sets `typeConfig`, `activeBorder`, and `activeBacking` via `catalog.*[0]` (`undefined` when empty). `OrderPage.jsx:167-168` (`handleAddOrderToCart`) and `L191-192` (`handlePlaceOrder`) then unconditionally dereference `typeConfig.name`, `activeBorder.name`, and `activeBacking.name`, throwing an unhandled `TypeError` and crashing `/order` for all visitors.
  3. Furthermore, `OrderPage.jsx:45-47` loads `catalog_config` asynchronously and updates `enabledTypes` (`L53-56`), but never reconciles `patchType` (`L61-63`), `borderId`, or `backingId`—leaving a disabled patch type selected after load.
  4. In `api/orders.js:98-106`, `PATCH` returns `200 { order: null }` if no row matches `id`, and `DELETE` (`L118-122`) omits `prefer: 'return=representation'` and always returns `200 { deleted: id }` even for nonexistent order IDs.
- **Reproducible Evidence:** Direct inspection of `api/catalog.js:36-45`, `api/orders.js:98-125`, and `src/pages/OrderPage.jsx:45-63, 95-97, 167-168, 191-192`.
- **Impact:** A malformed or empty catalog update breaks `OrderPage` rendering/checkout for all storefront visitors, disabled patch types remain active on `/order`, and admin order mutations silently report success on nonexistent IDs.

---

### `F-11` — Admin Session Cookie Lacks `__Host-` Prefix & `isHttpsRequest` Trusts `x-forwarded-proto`
- **Severity:** **Medium**
- **Affected Files:**
  - `api/_lib/auth.js:3, 15-18`
  - `api/admin/login.js:81-87`
  - `api/admin/logout.js:16-22`
- **Technical Description:**
  `COOKIE_NAME` (`api/_lib/auth.js:3`) is `p4e_admin_token` rather than `__Host-p4e_admin_token`, lacking browser-enforced `Secure` + `Path=/` + no-`Domain` guarantees against subdomain cookie-tossing. Additionally, `isHttpsRequest(req)` (`api/_lib/auth.js:15-18`) checks `process.env.NODE_ENV === 'production' || proto === 'https'` using the spoofable `x-forwarded-proto` header. Note that browsers reject `__Host-` cookies without `Secure` over plain `http://localhost`, so `__Host-p4e_admin_token` must remain scoped to production/HTTPS (`NODE_ENV === 'production' || VERCEL_ENV === 'production'`) to avoid breaking local `vite dev` admin sign-in.
- **Reproducible Evidence:** Unit check confirmed `isHttpsRequest({ headers: {} })` returns `false` (omitting `Secure` on cookie) while `isHttpsRequest({ headers: { 'x-forwarded-proto': 'https' } })` returns `true` (adding `Secure`).
- **Impact:** In non-production or misconfigured proxy deployments, cookie security flags depend on untrusted headers and production cookies lack `__Host-` prefix protections.

---

### `F-12` — PostgreSQL Trigger `public.set_updated_at()` Lacks Pinned `search_path` & Schema Permits `$0.00` Orders
- **Severity:** **Low**
- **Affected Files:**
  - `database_coding/schema.sql:25-26, 60-68`
- **Technical Description:**
  1. `public.set_updated_at()` (`database_coding/schema.sql:60-68`) does not specify `SET search_path = public, pg_temp` (flagged by PostgreSQL/Supabase Security Advisor as `function_search_path_mutable`).
  2. `orders.unit_price` and `orders.total_price` (`database_coding/schema.sql:25-26`) use `check (unit_price >= 0)` and `check (total_price >= 0)`, permitting zero-dollar orders at the database layer.
- **Reproducible Evidence:** Direct inspection of `database_coding/schema.sql:25-26, 60-68`.
- **Impact:** Defense-in-depth gap in PostgreSQL schema hardening and trigger execution context.

---

### `F-13` — Production `vercel.json` CSP Permits `'unsafe-inline'` Styles & Broad `img-src https:`, Missing `COOP`/`CORP`
- **Severity:** **Low**
- **Affected Files:**
  - `vercel.json:14-39` (`L37` CSP)
  - `index.html:14-19`
- **Technical Description:**
  1. `vercel.json:37` sets `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;` and `img-src 'self' data: blob: https:;`. Because all 48 site images in `src/data/assets.js` are already self-hosted locally under `/assets/` (and YouTube runs inside `frame-src`), allowing arbitrary `https:` image origins provides an unnecessary tracking-pixel / data-exfiltration channel if HTML/CSS injection ever occurred, while `'unsafe-inline'` weakens `style-src`.
  2. `index.html:14-19` loads Google Fonts stylesheets externally instead of self-hosting.
  3. `vercel.json:14-39` omits `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`.
- **Reproducible Evidence:** Direct inspection of `vercel.json:14-39`, `index.html:14-19`, and `src/data/assets.js:1-51`.
- **Impact:** Broader attack surface for CSS/image exfiltration and missing cross-origin isolation headers.

---

### `F-14` — Vite Dev Server Security Header, Route Parity, & Static Source/Seed Exposure Gaps
- **Severity:** **Low**
- **Affected Files:**
  - `vite.config.js:5-61` (`L17-34`)
  - `vercel.json:4-8`
  - `package.json:9` (`preview`)
- **Technical Description:**
  1. `vite.config.js` does not emit `vercel.json` security headers (`CSP`, `HSTS`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, or `/admin` `Cache-Control: no-store` & `X-Robots-Tag`) on HTML/static responses.
  2. `localApiPlugin` (`vite.config.js:17-28`) uses exact-match `routes[urlPath]` and calls `next()` for everything else. As a result, `vite dev` serves `200 text/html` SPA fallback on both unknown `/api/*` paths and trailing-slash API routes (such as `/api/orders/`), and serves raw server/DB/config/script files (`/api/_lib/auth.js`, `/api/orders.js`, `/database_coding/schema.sql`, `/database_coding/seed.sql` containing sample PII, `/vercel.json`, and `/scripts/hash-password.mjs`) via Vite's dev static middleware (`/.env` is blocked with `403` by Vite `fs.deny`). In contrast, `vercel.json:4` deploys `outputDirectory: "dist"` only, so these raw files are not exposed in Vercel production—making this specifically a local/LAN `vite dev` exposure.
  3. `vite.config.js:31-34` unconditionally overwrites `process.env[k] = v` from `.env` on every `/api/*` request, overriding shell-supplied environment variables.
  4. `npm run preview` (`package.json:9`) runs `vite preview`, where `configureServer` does not execute, leaving `/api/*` unmounted.
- **Reproducible Evidence:**
  Verified against isolated Vite `5174` (`runtime_checks.log` & `runtime_checks_r2.log`):
  - `GET /`, `GET /admin`, `GET /api/nonexistent`, and `GET /api/orders/` -> `200 OK text/html` (`cache-control: no-cache`, no `CSP`/`X-Frame-Options`).
  - `GET /.env` -> `403`.
  - `GET /api/_lib/auth.js` -> `200 text/javascript` (`23,829` B), `GET /api/orders.js` -> `200 text/javascript` (`22,379` B), `GET /database_coding/schema.sql` -> `200 application/sql` (`3,645` B), `GET /database_coding/seed.sql` -> `200 application/sql` (`7,357` B), `GET /vercel.json` -> `200 application/json` (`1,838` B), `GET /scripts/hash-password.mjs` -> `200 text/javascript` (`5,692` B).
- **Impact:** Local testing under `vite dev` or `vite preview` fails to exercise production header/routing behavior, can mask CSP or `/api/*` 404 regressions, and exposes server source, config, and `seed.sql` sample PII to any client able to reach the `vite dev` socket (e.g., if launched with `--host`).

---

### `F-15` — Uncaught `DOMException` in `ScrollToTop` on Invalid URL Hash & Catch-All Route Serving `200` for Unimplemented Pages
- **Severity:** **Low**
- **Affected Files:**
  - `src/App.jsx:14-27, 105`
  - `src/pages/CatalogPage.jsx:52-64, 66-272`
  - `src/pages/HomePage.jsx:507, 524-529`
  - `src/components/Footer.jsx:268-273`
  - `src/data/siteData.js:371, 378`
- **Technical Description:**
  1. `ScrollToTop` (`src/App.jsx:18`) passes `location.hash` directly to `document.querySelector(hash)` without `try/catch` or escaping. Any invalid CSS selector hash (such as `/#/` or `/#123` or `/#a:b`) throws an uncaught `DOMException` (`SyntaxError: ... is not a valid selector`).
  2. `<Route path="*" element={<CatalogPage ... />} />` (`src/App.jsx:105`) renders generic `"Custom Patches"` marketing content with HTTP `200` for arbitrary unknown paths as well as linked routes `/policies/privacy-policy`, `/policies/terms-and-conditions` (`Footer.jsx:268-273`), `/payment-form` (`siteData.js:378`), and `/contact` (which lacks the contact form advertised at `HomePage.jsx:507, 524-529`).
- **Reproducible Evidence:** Direct inspection of `src/App.jsx:18, 105` and live Vite `5174` check confirming `GET /contact`, `GET /policies/privacy-policy`, and `GET /nonexistent-test-path` all return `200 OK`.
- **Impact:** Client-side runtime error on malformed hash URLs and missing privacy/terms legal disclosures and contact form before production launch.

---

### `F-16` — Permissive `EMAIL_RE` Validation & CLI Argument Password Exposure
- **Severity:** **Informational**
- **Affected Files:**
  - `api/orders.js:14`
  - `api/newsletter.js:4`
  - `scripts/hash-password.mjs:20-22`
- **Technical Description:**
  1. Both `api/orders.js:14` and `api/newsletter.js:4` validate emails only with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, accepting invalid domains such as `a@b.c` or consecutive dots `user@domain..com`.
  2. `scripts/hash-password.mjs:20-22` (and `.env.example:3`) encourages passing plaintext admin passwords via `process.argv[2]`, which exposes the password in shell history and process listings (interactive prompt is only a fallback).
- **Reproducible Evidence:** Direct inspection of `api/orders.js:14`, `api/newsletter.js:4`, `scripts/hash-password.mjs:20-28`, and `.env.example:3`.
- **Impact:** Minor data-quality issue for email inputs and operational secret-hygiene exposure during admin setup.

---

## 4. Positive Security Controls Observed

1. **Row Level Security & Server-Only Service Role Key (`database_coding/schema.sql:85-94`, `api/_lib/supabase.js:13-29`):** RLS is enabled on `orders`, `catalog_config`, and `newsletter_subscribers`. Public `anon`/`authenticated` roles can only `SELECT` `catalog_config`; customer orders and newsletter emails have no public policies and are accessed solely server-side via `SUPABASE_SERVICE_ROLE_KEY`.
2. **Zero Dangerous DOM Injection Sinks (`src/**`, `public/theme-init.js`, `index.html`):** Static scan confirmed `0` occurrences of `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`, `eval(`, or `new Function`. `FooterPaw.jsx:37-48` constructs DOM nodes with `createElement` and property assignment using static `ASSETS.footerPaw`.
3. **Strong Password Hashing & Timing-Safe Comparisons (`api/_lib/auth.js:51-69, 82-86`, `scripts/hash-password.mjs:9-11`, `api/admin/login.js:64`):** Uses `crypto.scryptSync` with 16-byte random salts, `crypto.timingSafeEqual` (and SHA-256 pre-hashing in `sha256Equal`), plus a 300ms delay on invalid admin logins.
4. **Hardened Admin Cookie Flags & No-Store API Headers (`api/admin/login.js:81-87`, `api/_lib/auth.js:9-13`):** Admin cookie uses `HttpOnly; SameSite=Strict; Path=/` (plus `Secure` in production/HTTPS). All API responses emit `Cache-Control: no-store, no-cache, must-revalidate, private`, `Pragma: no-cache`, and `X-Content-Type-Options: nosniff`.
5. **Comprehensive Baseline Production Headers (`vercel.json:11-66`):** Enforces 2-year HSTS with `preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, strict `script-src 'self'` / `object-src 'none'` / `frame-ancestors 'none'` CSP, and `/admin` `Cache-Control: no-store` + `X-Robots-Tag: noindex, nofollow`.
6. **Sandboxed & ID-Validated Video Embed (`src/components/VideoModal.jsx:4, 16, 36-40`):** Validates `YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/`, uses `youtube-nocookie.com`, and applies `sandbox="allow-scripts allow-same-origin allow-presentation"` + `referrerPolicy="strict-origin-when-cross-origin"`.
7. **External Link Tabnabbing Protection (`src/components/Footer.jsx:166-254`, `src/pages/HomePage.jsx:622-623`):** All 8 `target="_blank"` anchors include `rel="noopener noreferrer"`.
8. **CSV Formula Injection Neutralization (`src/data/orderStore.js:544-551`):** `safeCsvCell` prefixes values matching `/^\s*[=+\-@\t\r]/` with `'` and escapes quotes prior to CSV export.
9. **Clean Dependency & Git Secret Baseline (`npm audit`, `.gitignore:5-6`, `dist/`):** `0` known vulnerabilities across `160` packages; `.env` is gitignored and absent from git history and `dist/assets/index-siYlojo7.js`; `ORDER_ID_RE` (`api/orders.js:15`) + `encodeURIComponent` guards PostgREST query parameters; `resolution=ignore-duplicates` (`api/newsletter.js:32`) prevents newsletter subscriber enumeration.

---

## 5. Non-Destructive Local Check Evidence Summary

All dynamic and unit checks were verified non-destructively (with `.env` Supabase variables blank, leaving external DB untouched, and isolating a temporary Vite `7.3.8` server on `127.0.0.1:5174` that was cleanly terminated afterwards without touching `PID 1200` on `:5173`):

- **Baseline Repo & Secrets Verification:**
  - `git -C "e:\work\demo websites\patch4ever" status --short --branch`: `main...origin/main` with pre-existing `M public/assets/hero-patch-wall.webp`, `M src/data/assets.js`, and 16 pre-existing untracked `.jpg` files; zero modifications introduced.
  - `.env` inspection (redacted): `ADMIN_EMAIL=admin@patch4ever.com`, `ADMIN_PASSWORD_HASH=<REDACTED len=168>`, `ADMIN_SESSION_SECRET=<REDACTED len=64>`, `SUPABASE_URL=` (empty), `SUPABASE_SERVICE_ROLE_KEY=` (empty).
  - `dist/assets/index-siYlojo7.js` (`487,942` bytes): contains `mvance@ocalafire.gov` (`true`) and `Admin Sign In` (`true`); contains zero `.env` secrets (`scrypt:` = `false`, `SUPABASE_SERVICE_ROLE_KEY` = `false`).
- **Dependency Audit (`npm audit --prefix "e:\work\demo websites\patch4ever" --json`):**
  - `0` vulnerabilities (`info: 0, low: 0, moderate: 0, high: 0, critical: 0`) across `160` total packages (`9` prod, `152` dev, `82` optional, `62` peer).
- **Isolated Vite `5174` HTTP Checks (`teamwork_worker_1\runtime_checks.log`, `teamwork_worker_2\verify_checks.log`, `teamwork_worker_3\runtime_checks_r2.log`):**
  - `GET /`, `/admin`, `/contact`, `/policies/privacy-policy`, `/nonexistent-test-path` -> `200 OK` (`text/html`, `cache-control: no-cache`, no `CSP`/`X-Frame-Options`).
  - `GET /api/nonexistent` and `GET /api/orders/` (trailing slash) -> `200 OK` (`text/html` SPA fallback).
  - `GET /.env` -> `403`; `GET /api/_lib/auth.js` -> `200 text/javascript`; `GET /api/orders.js` -> `200 text/javascript`; `GET /database_coding/schema.sql` -> `200 application/sql`; `GET /database_coding/seed.sql` -> `200 application/sql`; `GET /vercel.json` -> `200 application/json`; `GET /scripts/hash-password.mjs` -> `200 text/javascript`.
  - `GET /api/admin/session` (unauthenticated) -> `401 Unauthorized` `{"authenticated":false}` (`cache-control: no-store...`, `x-content-type-options: nosniff`).
  - `GET /api/orders`, `PUT /api/catalog`, `POST /api/catalog` -> `503 Service Unavailable` disclosing `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before `requireAdmin`/`405`.
  - `GET /api/admin/login`, `GET /api/admin/logout`, `GET /api/newsletter` -> `405 Method Not Allowed` (`Allow: POST`).
  - `POST /api/admin/login` (`Content-Type: text/plain`, empty credentials) -> `400 Bad Request` `{"error":"Valid email and password are required."}` (confirming `text/plain` JSON parsing).
  - `POST /api/admin/login` brute-force test: 5 attempts with `X-Forwarded-For: 198.51.100.10` -> `401`, attempt #6 -> `429 Too Many Requests` (`Retry-After: 899`), next attempt with `X-Forwarded-For: 203.0.113.99` -> `401` (confirming IP header spoof bypass in local Vite/Node).
- **Module Unit Checks (Node `v24.19.0`, `verify_checks.log` & `runtime_checks_r2.log`):**
  - `isHttpsRequest({ headers: {} })` -> `false`; `isHttpsRequest({ headers: { 'x-forwarded-proto': 'https' } })` -> `true`.
  - `verifySessionToken` accepted a signed `{ sub: 'viewer@example.com', role: 'viewer' }` payload.
  - `isAuthConfigured()` with `ADMIN_SESSION_SECRET = ' '.repeat(16)` returned `true`.
  - `readJsonBody({ body: { notes: 'A'.repeat(100000) } })` returned `notes.length === 100000` (bypassing the 32KB cap).
  - `mapOrderToRow` accepted tampered `qty: 1`, `unitPrice: 0`, `totalPrice: 0`, `status: 'approved'`, `source: 'Tampered'`, `adminNotes: 'Injected'`, `patchType: 'unknown-type'`, `rush: true`, `width: 'not-a-num'`, `height: '=CMD()'`, `upgrades: ['FakeUpgrade']`, and silently truncated a 151-char `email` to 150 chars (`...aaaa@b.co`).
  - `lookupUnitPrice({ patchType: 'leather', sizeInches: 3, qty: 100 }) * 1.28 = 4.93` vs. `LEATHER_VARIANTS['genuine-debossed'].rows['3.00'][2] = 5.08`.
