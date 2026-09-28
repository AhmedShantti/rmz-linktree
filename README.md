# RMZ Linktree

A Linktree-style link-in-bio app for **Rebel Mind Zone (RMZ)** — a public page at `/` and a
password-protected control panel at `/admin` for managing it, built with Next.js (App Router),
TypeScript, Tailwind CSS, and Prisma + SQLite.

## Stack notes

- **Next.js 16 / Tailwind v4.** Tailwind v4 configures theme colors via `@theme` in
  `app/globals.css` (see the RMZ palette block) rather than `tailwind.config.ts`; the same
  values live in `lib/colors.ts` for use in TS/JS (e.g. the appearance color picker).
- **Prisma 7 with SQLite**, via `@prisma/adapter-libsql` (see `lib/prisma.ts`). This one adapter
  works for both a local `file:./prisma/dev.db` and a hosted Turso/LibSQL database, so no code
  changes are needed between dev and production — just the `DATABASE_URL` (and `TURSO_AUTH_TOKEN`
  in production).
- Auth is a single hardcoded admin user: a bcrypt password hash in `.env`, and an `httpOnly`
  signed session cookie (JWT via `jose`). See `lib/auth.ts` and `proxy.ts` (Next 16 renamed the
  `middleware.ts` convention to `proxy.ts` — same mechanism, new file name).
- **One `Link` model for everything.** Regular links and social links (Instagram, TikTok, X, etc.)
  are both rows in the same `Link` table, distinguished only by a `type: "link" | "social"` field.
  They render through the same `LinkButton` component (identical card style, same "featured"
  highlight) and share one `order` sequence, so drag-and-drop reordering in `/admin` moves social
  and regular links together in a single list. There is no separate social-icon row on the public
  page and no separate "Social Links" admin section — adding a social link is just picking
  "Social Link" instead of "Regular Link" on the same Add Link form.

## Running locally

```bash
pnpm install
cp .env.example .env
```

Then fill in `.env`:

- `DATABASE_URL` — leave as `file:./prisma/dev.db` for local dev.
- `SESSION_SECRET` — any long random string, e.g. `openssl rand -hex 32`.
- `ADMIN_PASSWORD_HASH` — a bcrypt hash of your chosen admin password:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
  ```
  **Important:** Next.js expands `$VAR` syntax when it reads `.env` files. A bcrypt hash is full
  of `$`-prefixed segments (`$2b$10$...`), so escape every `$` as `\$` when you paste the hash
  into `.env` — otherwise it gets silently corrupted and login will always fail with no error.
  Example: `ADMIN_PASSWORD_HASH="\$2b\$10\$abc..."`.

Then set up the database and start the app:

```bash
pnpm db:migrate   # creates prisma/dev.db and applies the schema
pnpm db:seed      # seeds a default profile + example links (skipped automatically if already seeded)
pnpm dev
```

Visit `http://localhost:3000` for the public page and `http://localhost:3000/admin/login` for
the control panel.

Other scripts: `pnpm db:studio` opens Prisma Studio to browse the database directly;
`pnpm build` / `pnpm start` for a production build.

## Deploying (Vercel)

Vercel's filesystem is **ephemeral and read-only in production** — two things in this app write
to disk locally and need a swap before deploying:

1. **Database.** Local dev uses a plain SQLite file. For production, create a
   [Turso](https://turso.tech) (LibSQL) database and set `DATABASE_URL` to its `libsql://...`
   URL plus `TURSO_AUTH_TOKEN` in your Vercel project's environment variables — `lib/prisma.ts`
   already uses the adapter that supports both, so no code changes are required. Run
   `pnpm db:migrate` (or `prisma migrate deploy`) against the Turso database once before first
   use.
2. **Uploads.** `app/api/admin/upload/route.ts` currently writes avatar/link-thumbnail uploads to
   `/public/uploads` on the local filesystem, which works in dev but not on Vercel. Swap it for a
   blob store (e.g. [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or S3) before
   relying on uploads in production.

The admin login rate limiter (`lib/rate-limit.ts`) is an in-memory, per-instance counter — fine
for a single-owner tool, but it resets on every redeploy/cold-start and doesn't share state across
serverless instances. Swap for a real rate limiter (e.g. Upstash Ratelimit) if that matters to you.

## Brand assets — swapping in the real ones

- **Fonts.** `lib/fonts.ts` currently uses `next/font/google` with license-free substitutes
  (Sora for TT Norms, Fraunces for Ivar Display), wired into Tailwind as `font-sans` /
  `font-display`. Drop the licensed TT Norms / Ivar Display font files into `/public/fonts` and
  switch `lib/fonts.ts` to `next/font/local` once you have them.
- **Logo.** `components/brand/Logo.tsx` approximates the "rmz" wordmark + three-square accent
  with text and CSS (see the `TODO` at the top of the file). Replace it with the official
  `/public/logo.svg` and a component that renders it once you have the real asset.
- **Wallpaper.** `/public/wallpaper.png` is the surreal editorial photo used as the public page's
  blurred background (dark theme only). Swap the file to replace it — no code changes needed.

## Project structure

```
/app
  page.tsx                → public linktree page (/)
  layout.tsx, globals.css
  /admin
    layout.tsx             → auth shell (sidebar / login passthrough)
    page.tsx                → Links management (default /admin view)
    login/page.tsx
    profile/page.tsx
    appearance/page.tsx
    analytics/page.tsx
  /api/... (public-data, track-click, track-view, admin/*)
/components
  /brand/Logo.tsx
  /public-page/{Avatar,LinkButton,Wallpaper,EmptyState}.tsx
  /admin/{Sidebar,LinkForm,LinkTable,LinkManager,AppearanceManager,ProfileManager,...}.tsx
/lib
  fonts.ts, auth.ts, prisma.ts, colors.ts, data.ts, types.ts, rate-limit.ts, api-auth.ts
/prisma
  schema.prisma, seed.ts, migrations/
/public
  wallpaper.png, /uploads
proxy.ts                    → protects /admin/** (redirects to /admin/login if unauthenticated)
```

## Acceptance checklist

- [x] `/` renders the blurred wallpaper, avatar, name, bio, and link buttons from the database.
- [x] Social links (Instagram, TikTok, X, etc.) render as full-width cards in the **same list**
      as regular links — identical glass/frosted card style, icon + title + optional subtitle —
      with **no separate circular icon row** above the links.
- [x] Clicking a link (regular or social) opens it in a new tab and increments its click count
      (`POST /api/track-click`, fire-and-forget).
- [x] `/admin/login` blocks all other `/admin/**` routes until the correct password is entered
      (enforced by `proxy.ts`, plus every `/api/admin/**` route re-checks the session
      server-side).
- [x] The `/admin` Links page has one "Add Link" form with a Regular Link / Social Link type
      toggle; either type is added to the same single list.
- [x] Add / edit / delete / reorder / toggle active / toggle featured on a link (of either type)
      in `/admin` is reflected on `/` immediately (no redeploy, no cache) — reordering moves
      social and regular links together in one sequence, since they share one `order` column.
- [x] The brand-red "featured" highlight style is available for, and works identically on, both
      regular and social items.
- [x] Appearance settings (theme, blur, scrim, accent color, button style) update the public page
      after saving.
- [x] Analytics shows total page views, total clicks, and a per-link breakdown (covering both
      link types).
- [x] Colors match the RMZ palette exactly: `#d52518`, `#ffca26`, `#f86015`, `#9acc42`,
      `#f3e8cc`, `#0f0f0e`.
- [x] `pnpm lint` and `pnpm build` both succeed with no errors.
