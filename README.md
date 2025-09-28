<div align="center">

# Happiest People Productions Website

Modern marketing / creative production site built with Next.js 15 App Router, React 19, Tailwind CSS v4 + custom SCSS pipeline, animated interactions (GSAP, Lenis), sliders, rich media (HLS, YouTube modal), and a tailored component system.

</div>

## Table of Contents

1. Overview
2. Tech Stack
3. Quick Start
4. Scripts
5. Project Structure
6. Styling & Design System
7. SVG & Media Handling
8. Forms & Validation
9. Animation & UX Details
10. Key Components (Spotlight)
11. Performance & Build Notes
12. Contributing
13. Roadmap / Future Improvements
14. License
15. Works CMS (Lightweight)
16. Authentication (Admin CMS)

### File Storage & Media Security

This project uses a split strategy:

| Asset Type | Draft Storage | Published Storage | Access Method |
|------------|---------------|-------------------|---------------|
| Career Application Resumes | (No draft state) Direct S3 upload | S3 (private) `career-resumes/` | Signed download endpoint |
| Work Images (Draft) | OS temp dir (`$TMPDIR/hpp-work-drafts`) served via API | S3 (private) `work-images/` (after publish) | Signed image endpoint + client hook |

#### Environment Variables (S3)
```
AWS_S3_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
AWS_S3_ACCESS_KEY_ID=AKIA...
AWS_S3_SECRET_ACCESS_KEY=xxxxxxxx
# Optional: custom CDN / edge domain (used for constructing stored URLs)
AWS_S3_PUBLIC_BASE_URL=https://cdn.example.com
```

If these are missing, only draft work image uploads (temp storage) succeed; resume uploads (which require S3) will fail.

#### Resume Uploads
Endpoint: `POST /api/uploads` with multipart form data (field `file`).
Returns JSON with `url`, `key`, `size`, and `storage: "s3"`.
Objects are private. Direct URL access 403s; a presigned URL is required.

Signed download: `GET /api/admin/resumes/sign?key=career-resumes/<object>` → `{ url }` (valid 60s).

#### Work Image Drafts
Draft upload: `POST /api/uploads` with `type=work-image`.
Behavior:
- Written to temp directory (never inside `public/`).
- Temp filename pattern: `<slug>-<timestamp>-<rand>.<ext>`.
- Returned URL: `/api/admin/work-drafts/image?file=<filename>` (served directly by an API route; no signing needed while in draft).

#### Publishing Work Images
When a draft is published (create or update with `published: true`), migration flow:
1. Detect draft URL (`/api/admin/work-drafts/image?file=...`).
2. Read file from temp dir.
3. Upload to S3 under `work-images/` with private access.
4. Delete temp file.
5. Persist S3 URL in the work record.

#### Signed Work Image Access
Endpoint: `GET /api/admin/works/images/sign?key=work-images/<object>` → `{ url }` (60s presigned GET).

Client hook `useFetchSignedWorkImages(url)`:
- Detects draft temp URLs → uses as-is.
- Detects S3 stored URLs containing `work-images/` → calls signing endpoint.
- Caches single signed URL per mount (does not refresh automatically—future enhancement: auto-refresh before expiry if needed for long sessions).

#### Temp Draft Cleanup
API: `POST /api/admin/work-drafts/cleanup?ageMinutes=10&dryRun=true|false`
- Auth required.
- Deletes temp draft files older than threshold (default 10 minutes).
- Response: `{ deleted, kept, files: [...] }`.
Note: If you reverted or removed this route, re-add or adjust docs accordingly; current codebase may reflect either state—ensure alignment before deployment.

#### Security Notes
- No objects are publicly readable; all published media require signing unless later fronted by a controlled CDN.
- Draft images are transient and never exposed via a predictable public path.
- Ensure IAM policy includes at minimum:
```
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
for `career-resumes/*` and `work-images/*` prefixes.

#### Operational Caveats
- Temp storage is ephemeral: a cold start may discard un-published drafts (re-upload if lost).
- Publishing depends on the temp file still existing; if it disappeared, publish returns a migration error.
- Consider adding monitoring around draft migration failures.

---

## 1. Overview

This repository contains the Next.js application for the Happiest People Productions (HPP) marketing/portfolio website. It leverages the App Router (`/src/app`) with server & client components, advanced SVG handling, responsive media assets, smooth scrolling, animated sliders, and accessible interactive UI elements.

## 2. Tech Stack

Core:
- Next.js `15.4.4` (App Router, Turbopack dev)
- React `19.1.0`
- TypeScript

Styling & UI:
- Tailwind CSS v4 (PostCSS plugin) + SCSS (custom pipeline compiled to `src/styles/main.css`)
- Google Fonts via `next/font` (Figtree, Manrope)

Media & Interaction:
- `gsap` + `@gsap/react` for declarative animations
- `lenis` for smooth scrolling
- `keen-slider` for carousels/sliders
- `hls.js` for adaptive streaming (if/when HLS sources are used)
- Custom Video modal with YouTube embedding

Forms & Validation:
- `formik` for form state management
- `yup` for schema validation
- `intl-tel-input` for international number input styling

Build / Tooling:
- Turbopack dev server (`next dev --turbo`)
- Concurrent SCSS watch via `concurrently`
- Custom webpack SVG pipeline (SVGR components + `?url` raw mode)

## 3. Quick Start

Prerequisites:
- Node.js 20 LTS (Recommended) or >= 18.17
- Yarn (preferred) or npm/pnpm/bun

Install dependencies:
```bash
yarn install
```

Start development (Next.js + SCSS watcher in parallel):
```bash
yarn dev
```
Visit: http://localhost:3000

Production build:
```bash
yarn build
yarn start
```

Lint:
```bash
yarn lint
```

Clean workspace (removes artifacts & dependencies):
```bash
yarn purge
```

## Admin Toast Notifications

User actions in the admin Works CMS (create draft, edit draft, reorder, publish, delete, login, logout, image upload) surface feedback using `react-hot-toast`.

Implementation details:
- Global provider: `src/components/ToasterProvider.tsx` injected in `src/app/layout.tsx`.
- Import the `toast` helper via `import { toast } from '@/components/ToasterProvider';` inside any client component.
- Success styles use teal; error styles use red. Duration defaults to 3500ms.

Common patterns:
```ts
toast.success('Draft added');
toast.error('Upload failed');
toast('Custom neutral message');
```

If you add new admin modules, just call `toast.*` in client components—no extra setup required.
## 4. Scripts

| Script | Description |
| ------ | ----------- |
| `dev` | Runs Next dev with Turbopack + SCSS compiler watcher concurrently |
| `build` | Creates production build (`.next`) |
| `start` | Starts production server |
| `lint` | Runs ESLint (Next config) |
| `sass` | One-off compile of SCSS to `src/styles/main.css` |
| `sass:watch` | Watch SCSS changes only (alternative to full `dev`) |
| `purge` | Remove `node_modules` and `.next` (useful for hard resets) |

## 5. Project Structure (Selected)

```
src/
	app/                # App Router entrypoints (layouts + route segments)
	components/         # Reusable building blocks (UI + logic)
	data/               # Static data & JSON seeds (e.g. works.json)
	hooks/              # Reusable custom React hooks (UI/util logic)
	icons/              # Source SVG icon assets (SVGR → React components)
	lib/                # Server/runtime utilities (auth, db, s3, repositories)
	styles/             # SCSS sources + compiled CSS outputs
	types/              # TypeScript definition modules
	utils/              # Utility helpers (icons registry, class helpers)
	widgets/            # Page-level composite sections (domain-specific)
public/               # Static assets (images, videos, SVG not inlined)
```

Naming Conventions:
- Components: PascalCase directories with `index.ts` re-exports.
- Widgets: Grouped semantic vertical slices (e.g., `HomeBanner`, `CareersBanner`).
- SVGs: Imported via alias `@/icons/...` and transformed to React components.

## 6. Styling & Design System

Hybrid approach:
- Tailwind utility classes (v4) for rapid layout & spacing.
- SCSS for global tokens, layered composition, and complex/legacy patterns.
- A utility `twc` (tailwind class composer) groups variant class sets (see `ImageCard`).

Fonts via `next/font` ensure automatic subsetting and `display=swap` behavior.

## 7. SVG & Media Handling

Custom webpack logic (see `next.config.ts`):
- Default: `import Icon from "@/icons/star.svg";` yields a React component.
- Raw URL: `import starUrl from "@/icons/star.svg?url";` keeps asset as file reference (e.g., for CSS `background-image`).

Images:
- Stored in `public/images` and rendered with `next/image` for optimization.
- Aspect ratios enforced via utility classes (e.g., `aspect-[766/430]`).

Video:
- Static MP4 banner in `public/videos/`.
- YouTube embeds controlled via unmounted/remount pattern for guaranteed playback stop.
- HLS support available if future `.m3u8` sources are introduced (through `hls.js`).

## 8. Forms & Validation

Stack: `formik` + `yup`.
- Centralized schema definitions in `src/types` (e.g., contact/careers forms).
- `intl-tel-input` enhances phone inputs (CSS imported globally in `layout.tsx`).

Recommended Enhancement: Abstract common form field components (TextInput, PhoneInput, Select) for consistency and validation message patterns.

## 9. Animation & UX Details

- `gsap` & `@gsap/react` for timeline-driven entrance + scroll effects.
- `lenis` provides smooth scroll inertia (ensure it’s initialized once—if not yet added, planned).
- `keen-slider` powers carousels (testimonials, media strips, etc.).
- Hover scale, fade, and transform micro-interactions applied via Tailwind + group states.

## 10. Key Components (Spotlight)

### ImageCard with Optional YouTube Video

When a `videoId` is supplied:
- Renders a contextual "Watch Now" button.
- Card or button click opens an accessible modal containing an autoplaying (muted) YouTube iframe.
- On close: iframe unmount ensures playback stops (no background audio).

Example:
```tsx
<ImageCard
	image={{ url: "/images/banner-image.webp", alt: "Sample" }}
	title="Company Reel"
	videoId="dQw4w9WgXcQ"
/>
```

Accessibility:
- Modal uses `role="dialog"` + `aria-modal="true"`.
- Escape closes the modal.
- Focus management: shifts to close control on open.

### Icons Registry
Centralized export in `src/utils/icons.ts` for ergonomic `<Icons.ChevronRight />` usage. Encourages tree-shakeable component imports.

### VideoModal
Detached mounting pattern ensures cleanup on unmount. Supports controlled `open` prop and animation timing via `animationDurationMs`.

## 11. Performance & Build Notes

- Dev: Turbopack for faster incremental updates.
- Production: Source maps disabled (`productionBrowserSourceMaps: false`).
- SVG handling avoids double-loading: excludes `.svg` from default file loader once SVGR rules applied.
- Consider future: Image CDN policies, preloading critical fonts, enabling Next.js image blur placeholders for LCP images.

## 12. Contributing

Internal/Private project (no public contributions yet). For internal contributors:
1. Create a feature branch: `feature/<branch-name>`
2. Run `yarn lint` before committing.
3. Keep components small & colocate styles.
4. Prefer accessibility (ARIA roles, focus states) for all interactive UI.
5. Submit PR with concise summary + screenshots or short Loom for UI changes.

## 13. Roadmap / Future Improvements

- [ ] Add unit/component tests (e.g., Vitest + Testing Library) for critical widgets.
- [ ] Introduce visual regression (Chromatic / Playwright) for marketing pages.
- [ ] Extract a theme token layer (SCSS -> CSS variables) for dark mode readiness.
- [ ] Add SEO metadata per route (OpenGraph, Twitter cards).
- [ ] Implement sitemap + structured data (JSON-LD for organization & job postings).
- [ ] Central animation controller (GSAP context provider) to reduce duplicate setups.
- [ ] Progressive enhancement for users with reduced-motion preferences.
- [ ] Add CI workflow (lint + build + typecheck) on PRs.

## 14. License

Proprietary / All Rights Reserved (update if a formal license is adopted).

## 15. Works CMS (MongoDB + Mongoose)

The Works/Portfolio CMS now persists data in MongoDB instead of an in-repo JSON file.

Architecture:
- Persistence: MongoDB (cluster) accessed via Mongoose.
- Connection helper: `src/lib/mongoose/connection.ts` (singleton w/ dev hot-reload cache).
- Model: `src/lib/mongoose/models/Work.ts` (schema + virtual `id`).
- Repository layer: `src/lib/repositories/workRepository.ts` (CRUD + reorder abstraction).
- API route: `src/app/api/works/route.ts` (uses repository, unchanged external contract).
- Admin UI: `http://localhost:3000/admin/works` (no UX changes required).

Environment Variables (required):
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster-host/?retryWrites=true&w=majority
MONGODB_DB=hpp
```

Data Shape (TypeScript) unchanged:
```ts
interface Work {
  id: string;
  title: string;
  image: { url: string; alt: string };
  videoId?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  published: boolean;
  order: number; // manual ordering
}
```

API Endpoints (still under `/api/works`):
- GET `/api/works` -> `{ data: Work[] }`
- GET `/api/works?published=true`
- POST (create) `{ title, image, videoId?, published?, order? }`
- POST (reorder) `{ reorder: true, ids: string[] }`
- PUT (update) `{ id, ...partial }`
- DELETE `/api/works?id=<id>`

Behavioral Notes:
- Ordering: If `order` not supplied on create, repository assigns `last.order + 1`.
- Reorder uses MongoDB bulkWrite for efficiency.
- `dynamic = 'force-dynamic'` ensures fresh reads.
- Widgets (`HomeWorks`, `WorksList`) now await repository functions directly (server components).

Migration Notes:
- Legacy JSON file `src/data/works.json` and `src/lib/worksStore.ts` removed.
- No seeding script is bundled (populate manually via Admin UI or Mongo shell/import tools).
- Ensure indices: an index on `order` is defined implicitly via schema property + query pattern.

Manual Seeding (example pseudo-steps, optional): Use MongoDB Compass or `mongosh` to insert documents matching shape above.

Future Enhancements:
- Add validation layer (Zod) before persistence.
- Add optimistic UI + toasts in Admin area.
- Consider unique compound index on `{ published: 1, order: 1 }` if filtering frequently.
## 16. Authentication (Admin CMS)

Lightweight custom auth protects the `/admin` area and write API routes using signed JWT cookies.

Components:
- `middleware.ts`: Guards `/admin/*` (except `/admin/login`) and non-GET `/api/` routes (except `/api/auth/*`).
- `src/lib/auth.ts`: Utility (sign / verify HS256 JWT, cookie options).
- `POST /api/auth/login`: Validates credentials against environment variables and issues cookie.
- `POST /api/auth/logout`: Clears auth cookie.
- `src/app/admin/login/page.tsx`: Login form.

Environment Variables (required):
```
CMS_USERNAME=your_admin_user
CMS_PASSWORD=super_secret_password
CMS_AUTH_SECRET=at_least_32_chars_random_secret
```

Cookie:
- Name: `hpp_admin_auth`
- HttpOnly, SameSite=Lax, 2 hour expiry

Flow:
1. User visits `/admin` (or any `/admin/*`) → redirected to `/admin/login` if no valid cookie.
2. Login form POSTs `{ username, password }` to `/api/auth/login`.
3. On success, JWT cookie set; user redirected to the admin dashboard (`/admin`).
4. Publish / create / reorder / upload requests require valid token (middleware returns 401 otherwise).
5. Logout triggers `/api/auth/logout` → cookie cleared → redirect to login.

Security Notes:
- This is minimal—no rate limiting, no password hashing (credentials live only in env), no refresh tokens.
- Rotate `CMS_AUTH_SECRET` to invalidate all sessions.
- For production hardening consider: argon2 hashed credentials in a KV/DB, lockouts on repeated failure, CSRF token on form.

Extensibility Ideas:
- Replace with NextAuth / Auth.js provider if OAuth or multi-user needed.
- Add roles (extend JWT payload with `permissions`).
- Persist sessions in Redis for server-side revocation.

Testing:
- Missing env vars → login route returns 500.
- Wrong credentials → 401 JSON error `{ error: "Invalid credentials" }`.
- Expired token → middleware forces re-login.

To disable auth in local prototype work, temporarily comment out the guard in `middleware.ts` (not recommended for shared branches).


Legacy Note:
- Early versions stored drafts in `public/uploads/work-drafts/`. This has been removed; references to that path are obsolete.


---

### Reference: Learning Resources
If you’re new to parts of the stack:
- Next.js Docs: https://nextjs.org/docs
- React 19 Notes (Server Components, Actions): https://react.dev
- Tailwind CSS v4 (experimental channel) docs
- GSAP: https://gsap.com/docs
- Keen Slider: https://keen-slider.io/docs

---

For questions or internal onboarding, document common Q&A in a new `ONBOARDING.md` (suggested future addition).
