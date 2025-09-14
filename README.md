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
