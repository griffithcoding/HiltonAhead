# Hilton Ahead

Marketing site for Hilton Ahead — travel consulting for Hilton Head Island, SC.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4 (CSS-based config in `app/globals.css`)
- TypeScript
- Supabase (SSR + anon-only inserts for `/itinerary` form)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap, OG |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key — used by the itinerary form |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role — for future admin/cron reads |

## Supabase

Single migration for the MVP: `supabase/migrations/001_itinerary_requests.sql`.

Apply via the Supabase CLI or paste into the SQL editor. Table is public-insert / no-read by design — the service role key is required to see submissions.

## Brand values

All brand-surface values (name, color, domain, CTA target, contact email) live in `data/brand.ts`. Don't hardcode them anywhere else.

## Scripts

- `npm run dev` — Turbopack dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
