<div align="center">

# Happiest People Productions Website

Modern marketing & creative production platform built with **Next.js 15 (App Router)**, **React 19**, Tailwind CSS v4 + SCSS, animated motion systems, secure private media delivery (S3 + short‑lived signed URLs + in‑memory cache), and a lightweight custom CMS (Works + Career Applications) backed by MongoDB.

</div>

---

## Quick Links
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Media & File Flow](#media--file-flow)
- [Caching (Signed URLs)](#caching-signed-urls)
- [Works CMS](#works-cms)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Styling & Design System](#styling--design-system)
- [Animations & Interaction](#animations--interaction)
- [Forms & Validation](#forms--validation)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)

---

## Features
- ⚛️ **Modern Stack**: Next.js 15 App Router + React 19 concurrent features.
- 🗃️ **MongoDB Persistence**: Works stored in MongoDB via Mongoose repository layer.
- 🎞️ **Secure Media Pipeline**: Draft images local (temp dir) → promoted to S3 on publish.
- 🔐 **Private Assets**: Career resumes & published work images stored privately in S3 (no public bucket ACLs).
- 🪪 **Ephemeral Signed URLs**: 60s presigned access; cached server-side for efficiency.
- 🚀 **In‑Memory Caching Layer**: Reduces repeated S3 calls (HEAD + presign) with safe 50s TTL.
- 🎚️ **Works CMS**: Reorder, publish/unpublish, upload draft images, YouTube embedding.
- 📄 **Career Application Flow**: Resume upload + form validation + persistence.
- 🧵 **Hybrid Styling**: Tailwind v4 utilities + SCSS pipeline.
- ✨ **Rich Motion**: GSAP timelines, Lenis smooth scrolling, Keen Slider carousels.
- 🧩 **Composable Components**: Widgets & components separated for clarity.
- 🔒 **Custom Auth**: Lightweight JWT (HS256) cookie guard for admin routes.
- 🧪 **TypeScript Everywhere**: Strong typing across repositories, models, and utilities.

---

## Getting Started

### Prerequisites
- Node.js 20 LTS (recommended) or >= 18.17
- Yarn 1.x (provided lock behavior) or alternative package manager

### Install & Run
```bash
yarn install
yarn dev
```
Dev server: http://localhost:3000

### Production
```bash
yarn build
yarn start
```

### Lint / Clean
```bash
yarn lint
yarn purge   # remove node_modules + .next
```

---

## Environment Variables
Create `.env.local` with (minimum):
```bash
# --- Core ---
MONGODB_URI=mongodb+srv://user:pass@cluster-host/?retryWrites=true&w=majority
MONGODB_DB=hpp

# --- Auth (Admin CMS) ---
CMS_USERNAME=admin-username
CMS_PASSWORD=xxxxxxxx
CMS_AUTH_SECRET=32+_character_random_secret

# --- AWS S3 ---
AWS_S3_REGION=aws-s3-region
AWS_S3_BUCKET=aws-s3-bucket-name
AWS_S3_ACCESS_KEY_ID=AKIA...
AWS_S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
# Optional CDN / alternate domain for persisted object URLs
AWS_S3_PUBLIC_BASE_URL=https://cdn.example.com
```
If S3 vars missing: only draft work image uploads succeed; resume uploads & publish image migration fail.

---

## Architecture

### High-Level
| Concern | Implementation |
|---------|----------------|
| App Runtime | Next.js App Router (server & client components) |
| Data Store | MongoDB via Mongoose models + repository pattern |
| Auth | Custom JWT (HS256) cookie + middleware guard |
| Media Storage | Temp filesystem (drafts) + S3 (private) |
| Image Signing | On-demand presign endpoints + React hook consumer |
| Caching | In-memory (per process) short TTL signed URL cache |
| Styling | Tailwind v4 + SCSS generated stylesheet |
| Animation | GSAP + Lenis + Keen Slider |

### Repositories & Models
Located under `src/lib/mongoose` & `src/lib/repositories/*`. Provides isolation from API route handlers.

### Middleware
`middleware.ts` enforces auth for `/admin/*` pages and write operations on protected `/api/*` routes.

---

## Media & File Flow

### Work Image (Draft → Published)
1. Upload (type=work-image) → stored in OS temp: `$TMPDIR/hpp-work-drafts`.
2. Draft served through `/api/admin/work-drafts/image?file=<name>` (no signing; transient).
3. On publish/update with `published: true` → server migrates file to S3 `work-images/` prefix.
4. New S3 URL persisted (using optional `AWS_S3_PUBLIC_BASE_URL` if set).

### Career Resume Upload
- Direct multipart POST `/api/uploads` (default type → resume) → `career-resumes/` S3 private.
- Returns stored absolute URL (not publicly readable).
- Viewing/downloading in admin requires signed URL: `/api/admin/resumes/sign?key=career-resumes/<object>`.

### Security
- No public ACLs required (Bucket Owner Enforced expected).
- Access strictly via presigned GET (60s lifetime).

---

## Caching (Signed URLs)
Module: `src/lib/cache.ts`.

### What is Cached
Signed URLs for S3 objects under:
- `work-images/*`
- `career-resumes/*`

### Default Strategy
| Aspect | Default | Notes |
|--------|---------|-------|
| AWS presign expiry | 60s (configurable) | Actual signed URL validity (`SIGNED_URL_EXPIRES_IN_SECONDS`). |
| Cache TTL | 50s | Must be < presign expiry (`CACHE_SIGNED_URL_TTL_MS`). |
| Soft buffer | 5s | Early eviction window (`CACHE_SIGNED_URL_SOFT_BUFFER_MS`). |
| ETag revalidate interval | 5m | When considering HEAD revalidation if using longer TTLs (`CACHE_ETAG_REVALIDATE_INTERVAL_MS`). |

Key format examples:
- `signed:work-image:work-images/abc123.webp`
- `signed:resume:career-resumes/john-doe-dev-...pdf`

### Environment Variables (Optional)
```bash
# Seconds the presigned URL should be valid (clamped 10..604800). If unset defaults to 60.
SIGNED_URL_EXPIRES_IN_SECONDS=60

# Milliseconds to keep a signed URL in memory (must remain below actual signed URL lifetime).
CACHE_SIGNED_URL_TTL_MS=50000

# Milliseconds safety buffer; entries with less remaining time than this are treated as expired.
CACHE_SIGNED_URL_SOFT_BUFFER_MS=5000

# Milliseconds between potential ETag revalidations (for future longer-lived strategies).
CACHE_ETAG_REVALIDATE_INTERVAL_MS=300000
```
If you extend `SIGNED_URL_EXPIRES_IN_SECONDS` (e.g. 300 for 5 minutes), remember to raise `CACHE_SIGNED_URL_TTL_MS` proportionally but keep a buffer (e.g. TTL 290000, soft buffer 10000).

### 7-Day (Maximum) Example
To use the longest AWS S3 SigV4 presign period (7 days):
```bash
SIGNED_URL_EXPIRES_IN_SECONDS=604800       # 7 * 24 * 60 * 60
CACHE_SIGNED_URL_TTL_MS=604700000          # Slightly under 7 days (buffer ~100k ms)
CACHE_SIGNED_URL_SOFT_BUFFER_MS=60000      # 60s early eviction
CACHE_ETAG_REVALIDATE_INTERVAL_MS=86400000 # Revalidate ETag daily (optional)
```
Notes:
- Always keep `CACHE_SIGNED_URL_TTL_MS + CACHE_SIGNED_URL_SOFT_BUFFER_MS < SIGNED_URL_EXPIRES_IN_SECONDS * 1000`.
- For very long expiries consider using CloudFront signed URLs or shorter lifetimes + refresh pattern for better security.

### Invalidation & Diagnostics Endpoint
Endpoint: `/api/cache/invalidate` (auth required)

#### POST Actions
```jsonc
{ "scope": "all" }                     // clear everything
{ "prefix": "signed:work-image:" }      // clear by prefix
{ "key": "signed:work-image:work-images/foo.webp" } // clear a single exact cache key
```
Response fields include: `ok`, `mode`, and counts/identifiers of what was cleared.

#### GET Actions
| Query | Purpose |
|-------|---------|
| `?snapshot=1` | Returns current cache entries (keys + remaining TTL). |
| `?all=1` | Clears all cache entries. |
| `?prefix=signed:resume:` | Clears only entries with the given prefix. |
| `?key=signed:resume:career-resumes/example.pdf` | Clears a single key. |

Examples:
```
GET /api/cache/invalidate?snapshot=1
GET /api/cache/invalidate?all=1
GET /api/cache/invalidate?prefix=signed:work-image:
GET /api/cache/invalidate?key=signed:work-image:work-images/sample.webp
```

Typically you do NOT need manual invalidation: publishing or uploading creates new S3 object keys → old entries naturally expire.

### Horizontal Scaling
Per-process in‑memory map. With multiple containers/functions each has its own cache. To centralize:
1. Replace internal `Map` with Redis (preserve exported functions).
2. Optionally add request coalescing to prevent duplicate HEAD bursts.

### Future Enhancements (Optional)
- Redis adaptor
- In-flight promise de‑duplication
- Metrics endpoint exposing `snapshotCache()`
- Conditional mid-life ETag revalidation if TTL >> 60s

---

## Works CMS
- CRUD routes: `/api/works` (create, update, delete, reorder, list).
- Reordering done via POST `{ reorder: true, ids: string[] }`.
- Publishing triggers draft image migration.
- Client admin dashboard consumes repository-backed API.
- Data shape (simplified):
```ts
interface Work {
  id: string;
  title: string;
  image?: { url: string; alt: string };
  videoId?: string; // normalized YouTube ID
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Authentication
- Login: `POST /api/auth/login` → sets `hpp_admin_auth` HttpOnly cookie.
- Logout: `POST /api/auth/logout`.
- Middleware guards `/admin/*` and protected write APIs.
- Token lifetime: 2 hours (rotate by changing `CMS_AUTH_SECRET`).
- Stateless verification via `jose` library.

---

## Project Structure
```
src/
  app/                # App Router entrypoints & route segments
  components/         # Reusable UI + logic units
  data/               # Static JSON seeds
  hooks/              # React hooks (e.g., useFetchSignedWorkImages)
  icons/              # Raw SVG sources (SVGR → React components)
  lib/                # Auth, S3, cache, Mongo connection, repositories
  styles/             # SCSS sources + compiled CSS
  types/              # Shared TS interfaces & types
  utils/              # Misc utilities (icons registry, helpers)
  widgets/            # Page-level composite sections
public/               # Static images/videos served as-is
```

---

## Styling & Design System
- Tailwind v4 utilities for layout & spacing.
- SCSS pipeline for advanced composition & tokens.
- Potential future refactor: extract design tokens → CSS custom properties for theme switching.

---

## Animations & Interaction
- **GSAP + @gsap/react**: Scroll & entrance sequences.
- **Lenis**: Smooth scrolling orchestration.
- **Keen Slider**: Sliders & carousels.
- Micro‑interactions via Tailwind state classes.

---

## Forms & Validation
- `formik` + `yup` pattern.
- Career Application form: enriched phone input via `intl-tel-input`.
- Resume upload integrated before persistence call.

---

## Scripts
| Script | Purpose |
|--------|---------|
| `yarn dev` | Next dev (Turbopack) + SCSS watch (concurrently) |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | ESLint (type + next rules) |
| `yarn sass` | One-off SCSS compile |
| `yarn sass:watch` | Watch SCSS only |
| `yarn purge` | Remove `node_modules` + `.next` |

---

## Roadmap
- Add automated tests (Vitest / Testing Library)
- Visual regression (Playwright / Chromatic)
- Structured data + SEO metadata per route
- Redis-backed cache for multi-instance scale
- Dark mode (tokens + prefers-color-scheme)
- Rate limiting + password hardening for auth
- S3 event-driven cache invalidation (EventBridge → webhook)

---

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Resume upload 500 | Missing S3 env vars | Provide all AWS_* variables |
| Draft publish fails (migration) | Temp file cleaned | Re-upload draft image and retry publish |
| Signed URL returns 401 | Missing/expired admin auth | Re-login at `/admin/login` |
| Images not updating after overwrite | Short cache TTL still active | Wait 60s or POST invalidate scope=all |
| Mongo connection hangs in dev hot reload | Multiple connections | Ensure singleton pattern in connection helper |

---

## License
Proprietary / All Rights Reserved.

---

## Contribution
Internal workflow:
1. Branch: `feature/<name>`
2. Implement & keep components focused.
3. `yarn lint` before PR.
4. Include screenshots / short Loom for UI changes.

---

## Appendix: AWS IAM Policy (Example)
Minimal segmented access for required prefixes:
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "ListCareerAndWorkPrefixes",
			"Effect": "Allow",
			"Action": "s3:ListBucket",
			"Resource": "arn:aws:s3:::happiest-people-production",
			"Condition": {
				"StringLike": {
					"s3:prefix": [
						"career-resumes/*",
						"career-resumes/",
						"work-images/*",
						"work-images/"
					]
				}
			}
		},
		{
			"Sid": "CareerResumesRW",
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:GetObject",
				"s3:GetObjectVersion"
			],
			"Resource": "arn:aws:s3:::happiest-people-production/career-resumes/*"
		},
		{
			"Sid": "WorkImagesRW",
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:GetObject",
				"s3:GetObjectVersion"
			],
			"Resource": "arn:aws:s3:::happiest-people-production/work-images/*"
		}
	]
}
```

---

### Notes
- Cache is intentionally ephemeral; safe to clear anytime.
- Changing `AWS_S3_PUBLIC_BASE_URL` affects only newly persisted URLs.
- Consider centralizing logging strategy (pino/winston) for production readiness.