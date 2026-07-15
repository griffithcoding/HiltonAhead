# Web-design / SEO outreach prospects — Hilton Head & Bluffton

Batch tag: `enrichment_source = 'web-audit-2026-06'` · segment `corporate` · target table `public.sales_prospects` (migration 018).

These are **local businesses with high demand but weak/outdated websites** — outreach
targets for web-design & SEO work. They are deliberately tagged `corporate` and
`source_channel = direct` so they stay filterable and separate from the feeder-city
**travel** leads that normally populate `sales_prospects`.

## Two files, two contact situations

Research ran with page-fetching blocked, so contact info comes from search snippets /
Google Business / directory listings only — no email was fabricated.

| File | Rows | Why |
|---|---|---|
| `hhi-bluffton-web-design-2026.csv` | 19 | Businesses **with a verified email** — load via the standard importer. |
| `hhi-bluffton-web-design-phone-only.sql` | 19 | Businesses with **no verifiable email** (phone only). The CSV importer requires an email; `sales_prospects.email` is nullable, so these insert via SQL. |

## Load the CSV (19 with email)

```bash
# needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env
npx tsx scripts/import-prospects.ts \
  --file=./scripts/prospects/hhi-bluffton-web-design-2026.csv \
  --channel=direct --no-enqueue --no-segment
```

`--no-enqueue` keeps these B2B prospects out of the travel email sequences.
`--no-segment` keeps the `corporate` segment instead of re-inferring a travel segment.
Add `--dry-run` first to preview. Re-running is safe — the importer dedupes on email.

## Load the phone-only batch (19)

Paste `hhi-bluffton-web-design-phone-only.sql` into the Supabase SQL editor (or run
with psql using the service role). Idempotent: guarded by `NOT EXISTS` on company + city.

## Honesty caveat

Every website weakness is **INFERRED** (from URL patterns like `.php`/`.asp`/`.html`,
duplicate domains, or Facebook-only presence) or **CONFIRMED** where noted (no site /
dead domain). None were confirmed by loading the live page. Before outreach, open each
site + run Google PageSpeed Insights to turn the inferred tells into citable findings.
A few emails are generic `info@`/`office@` addresses flagged in `source_notes` — confirm
those before sending.
