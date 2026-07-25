# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio site for Rowell Mark Blanca (rowellblanca.dev), built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and SCSS modules. It now also includes a self-hosted admin CRM (leads, projects, testimonials, messages) backed by Prisma/NeonDB (PostgreSQL). No test suite exists in this repo.

## Commands

```bash
npm run dev          # start dev server at http://localhost:3000
npm run build        # production build
npm run start         # run production build
npm run lint          # next lint (eslint-config-next)
npm run seed          # seed NeonDB with portfolio projects + sample CRM leads (scripts/seed.js)
npm run seed:reset    # same, but purges existing Project rows first
npx prisma generate    # regenerate the Prisma client into lib/generated/client after schema.prisma changes
npx prisma db push     # push schema.prisma changes to NeonDB (no migrations folder is checked in)
```

There is no test runner configured — do not assume Jest/Vitest exist.

## Environment variables

See `.env.example` for the full list. Required locally:
- `DATABASE_URL` — NeonDB (Postgres) connection string, used by Prisma (`lib/prisma.ts`).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — fallback admin credentials used by `lib/auth.ts` when the `User` table has no matching row (lets admin login work before the DB is seeded).
- `MAILTRAP_HOST` / `MAILTRAP_PORT` / `MAILTRAP_USER` / `MAILTRAP_PASS` (+ optional `MAILTRAP_TO`, `MAILTRAP_FROM`) — SMTP creds for `lib/mailer.ts`, used by the contact API route to email new inquiries.
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — fallback form submission used by `components/ui/contactForm.tsx`.

Firebase env vars (`utils/firebaseconfig.tsx`) are no longer read anywhere else in the app — the project detail page and all project listings now go through `/api/projects` (Prisma/NeonDB) instead of Firestore. Treat `utils/firebaseconfig.tsx` as legacy/unused rather than removing data from it without checking first.

## Architecture

### Public site vs. admin CRM
- **Public site** (`app/(marketing pages)`, `components/homepage/`, `components/footer/`): the original portfolio — About, Contact, My Work, dynamic project detail page.
- **Admin CRM** (`app/admin/**`, `app/api/admin/**`, `app/api/crm/**`): a self-hosted back office for managing leads, projects, testimonials, and contact messages, backed by NeonDB via Prisma. `components/layout/layout-shell.tsx` (used from `app/layout.tsx`) detects `/admin` and `/login` paths and skips the public header/footer/intro-loading chrome for them.
- `app/login/page.tsx` is a thin re-export of `app/admin/login/page.tsx` (kept so both `/login` and `/admin/login` resolve to the same form).

### Auth model (important gotcha)
- Auth is a custom cookie session, **not** middleware-gated. `lib/auth.ts` sets an httpOnly `admin_session_token` cookie (`setAdminSessionCookie`) containing the user payload as JSON — it is not a signed/opaque token, just JSON in an httpOnly cookie.
- There is no `middleware.ts`. Route protection happens per-request inside each API route handler via `isAdminAuthenticated()` (see `app/api/crm/leads/route.ts`, `app/api/projects/route.ts` POST/PUT/DELETE, `app/api/upload/route.ts`, etc.) — GET on `/api/projects` and `/api/testimonials` is intentionally public (read-only, used by the public site).
- Admin *pages* under `app/admin/**` are not server-protected either; `app/admin/layout.tsx` does a client-side auth check by calling `/api/crm/leads` and redirecting if it 401s. When adding a new admin page/route, remember to call `isAdminAuthenticated()` yourself — it is not automatic.
- `lib/auth.ts` also has a **hardcoded credential fallback**: if `email === ADMIN_EMAIL` (or `rowellblanca94@gmail.com`) and password matches `ADMIN_PASSWORD` (or the literal string `RowellDev2026!`), login succeeds even with no `User` row in the DB. This exists so admin login works before the DB is seeded — be aware of it when touching `authenticateAdminUser`.
- Passwords are hashed with Node's `crypto.pbkdf2Sync` (`lib/crypto.ts`), not bcrypt/argon2.

### Data layer: Prisma/NeonDB replaced Firestore for projects
- `prisma/schema.prisma` defines `User`, `Lead` (+ `LeadNote`), `Project`, `Testimonial`, `ContactMessage`. The Prisma client is generated to the non-standard path `lib/generated/client` (not `node_modules/.prisma`), imported via `lib/prisma.ts` — always import the client from `@/lib/prisma`, not directly from `@prisma/client`. `lib/generated/client` is gitignored; run `npx prisma generate` after cloning or after schema changes.
- `app/api/projects/route.ts` is the single source of truth for project data on the public site now (`GET` supports `?permalink=`, `?category=`, `?featured=true`). If the DB is empty or unreachable it serves a hardcoded `FALLBACK_PROJECTS` array from the same file — keep that array in sync with `scripts/seed.js`'s `SEED_PROJECTS` if you add/change portfolio entries, since they're two independently-maintained copies of the same data.
- `json/projects.json` is a leftover from the pre-Prisma static dataset and is no longer imported anywhere — don't assume it's live data.
- The `spotlight` flag on `Project` is exclusive: creating/updating a project with `spotlight: true` runs a raw `UPDATE "Project" SET "spotlight" = false` first (see POST/PUT in `app/api/projects/route.ts`) to enforce "only one spotlighted project at a time."
- `app/mywork/[projects]/page.tsx` (dynamic project detail) and the homepage showcase components (`components/homepage/featured-project.tsx`, `components/homepage/showcase-portfolios.tsx`, `components/ui/tabs.tsx`) all fetch `/api/projects` client-side rather than reading Firestore or JSON directly.

### Contact form flow
- `app/api/contact/route.ts` is the server route the public contact form posts to: it writes a `ContactMessage` row, creates a corresponding `Lead` row (so every contact submission shows up in the CRM leads pipeline), then sends a notification email via `lib/mailer.ts` (Mailtrap SMTP). DB and email failures are caught independently and don't fail the request — the route still returns success if the DB write fails but email succeeds, or vice versa.
- `components/ui/contactForm.tsx` (the older Web3Forms-based form) still posts directly to the Web3Forms API from the client as a separate/fallback path — the two contact mechanisms are not unified.

### Styling
- Tailwind utility classes are the default for layout/spacing; a handful of components with more complex/animated markup (`header`, `banner`, `loading-intro`) use co-located `*.module.scss` files instead. `next.config.mjs` adds `styles/` as a Sass include path even though no top-level `styles/` directory currently exists — don't assume it does.
- `tailwind.config.ts` defines the site's custom color tokens (`primary`, `primary-accent`, `text-accent`, `accent-color`, `accent-color-slate`) and a plugin that mirrors every Tailwind color as a CSS variable (`--<color>`) on `:root` — use the custom tokens/CSS vars over hardcoded hex values to stay consistent with the existing theme. The admin CRM UI (`app/admin/**`) instead uses its own hardcoded navy/slate palette (`#0b1a30`, `#1d63ed`, etc.) directly in classNames rather than the shared tokens — match that local palette when editing admin screens, not the marketing-site tokens.

### Misc
- **`components/ui/`** holds a set of animated/effect primitives adapted from the Aceternity UI pattern (background beams/boxes, hero parallax, lamp, moving border, tabs, accordion, floating navbar, plus newer additions like `contact-modal.tsx`, `portfolio-card.tsx`, `fuzzy-text.tsx`, `rotating-text.tsx`) — treat these as generic, reusable visual primitives, distinct from `components/homepage/` and `components/footer/`, which are page-section-specific compositions.
- **Path alias**: `@/*` maps to the repo root (see `tsconfig.json`), used throughout for imports (`@/components/...`, `@/assets/...`, `@/lib/...`).
- **Social links** (facebook/instagram/linkedin/git) are hardcoded inline in multiple components (`app/mywork/[projects]/page.tsx`, `components/footer/contact-form-section.tsx`) rather than shared from a single source — when updating a social URL, grep for all occurrences.
- File uploads (`app/api/upload/route.ts`, used by the admin projects/testimonials editors) write directly to `public/uploads/` on the server filesystem — this only works on a persistent filesystem (not serverless platforms with ephemeral/read-only filesystems like standard Vercel deployments).
