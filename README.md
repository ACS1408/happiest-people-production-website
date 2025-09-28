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

### AWS S3 (Career Application Resumes - Mandatory)

Resume uploads use Amazon S3 through the `/api/uploads` endpoint. S3 configuration is now **required**; if the required env vars are missing the endpoint returns an error (no local filesystem fallback). This enforces consistent, secure resume handling and avoids leaked artifacts in repo or server disks.

Env vars (add to `.env.local`):
```
AWS_S3_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
AWS_S3_ACCESS_KEY_ID=AKIA...
AWS_S3_SECRET_ACCESS_KEY=xxxxxxxx
# Optional custom CDN domain (omit to default to bucket URL)
AWS_S3_PUBLIC_BASE_URL=https://cdn.example.com
```

Upload response shape:
```
{ "url": "https://<bucket-or-cdn>/career-resumes/<key>", "key": "career-resumes/<key>", "name": "originalName.ext", "size": 12345, "storage": "s3" }
```

Private Objects Note: Objects are stored with `ACL: private`. The `url` returned is a reference pattern; direct download will 403 unless you (a) generate a presigned URL, (b) serve via CloudFront signed URLs/cookies, or (c) relax bucket/object permissions. Recommended next enhancement: add a signed download API route issuing short-lived presigned URLs.

Frontend form still POSTs `FormData` with field `file` to `/api/uploads` and then stores the returned `url` in the application record.

#### Signed Resume Downloads

Private resumes are now accessed via a presigned URL endpoint instead of direct S3 links:

`GET /api/admin/resumes/sign?key=career-resumes/<object>` → `{ url: <temporarySignedUrl> }`

- Auth protected (same admin cookie).
- URL validity: 60 seconds.
- The Admin Applications table requests this endpoint on click and then triggers a download.
- If you need longer validity or different content-disposition headers, adjust the presigner configuration.

Hardening ideas:
- Log access attempts (append to an audit collection).
- Rate-limit signing (e.g., store timestamps per admin user/IP).
- Shorter expiry (15–30s) + one-time tokens persisted server-side.

### AWS S3 (Works Images)

Admin Works dashboard image uploads now use the same `/api/uploads` endpoint with a `FormData` field `type=work-image`.

Behavior:
- Stored under prefix: `work-images/`
- Key format: `work-images/<slug-of-original-name>-<timestamp>-<rand><ext>`
- ACL: `public-read` (so marketing site pages can render directly without signing)
- Metadata includes `uploadType=work-image`

Resume uploads remain private; work images are intentionally public for performance & simplicity. If you need private image objects (e.g., staged content), change ACL logic or introduce a draft prefix.

IAM Policy Additions:
Ensure your IAM policy includes:
```
"s3:PutObject",
"s3:GetObject"
```
on `arn:aws:s3:::<bucket>/work-images/*` (and the existing career-resumes prefix).

Optional Enhancements:
- Image optimization pipeline (Sharp in an edge function or an image CDN).
- Automatic WebP/AVIF variant generation.
- Size validations server-side mirroring client 4MB guard.
- Lifecycle expiration for old unpublished images.

#### Draft Workflow (Local -> S3 on Publish)

Work images now follow a draft staging pattern:

1. When uploading via the Admin Works dashboard, images are stored locally under `public/uploads/work-drafts/` (no S3 call yet). The upload response returns a URL like `/uploads/work-drafts/<slug>-<timestamp>-<rand>.<ext>`.
2. Draft entries reference this local path until you click Publish (via the bulk publish action or an update that sets `published: true`).
3. On publish (POST create with `published: true` or PUT update transitioning to published), the API detects the draft path, uploads the file to S3 under `work-images/` with public-read ACL, replaces the URL, and removes the local draft file.
4. Already published works bypass migration if the image URL is not a draft path.

Advantages:
- Faster initial uploads (local write only).
- Avoids orphaned S3 objects for discarded drafts.
- Keeps S3 clean with only published assets.

Operational Notes:
- Local draft files are deleted after successful migration; failures abort the publish request.
- If a publish fails part-way, the draft file remains; reattempt publish to retry migration.
- Consider a periodic cleanup task for very old draft files that were never published.

Security / IAM:
- Draft storage is on the app server filesystem; ensure instances are secured and not world-readable beyond HTTP serving of `/uploads/work-drafts/`.
- S3 policy only needs work-images prefix, not work-drafts (since drafts never reach S3).

Future Enhancements:
- Add a background queue for migration to keep publish request latency low (currently synchronous).
- Generate responsive variants (e.g., 640/1280 widths) during migration.
- Hash-based deduplication: reuse existing identical image key if binary hash matches.

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
	widgets/            # Page-level composite sections (domain-specific)
	utils/              # Utility helpers (icons registry, class helpers)
	types/              # TypeScript definition modules
	styles/             # SCSS sources + compiled CSS outputs
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
1. User visits `/admin/works` → redirected to `/admin/login` if no valid cookie.
2. Login form POSTs `{ username, password }` to `/api/auth/login`.
3. On success, JWT cookie set; user redirected back to works CMS.
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


Backup Tip:
- Commit `src/data/works.json` after editorial changes so history tracks content evolution.


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
