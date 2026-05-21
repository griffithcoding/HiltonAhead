# Prospect CSV Import — Operations

The cold-outbound funnel runs on enriched prospects loaded by CSV. This doc is
the operator's runbook for that import pipeline. The codepath is:

```
CSV  →  parseProspectCsv()  →  importProspects()  →  sales_prospects
                                              ├──→  sales_touches (csv_imported event)
                                              └──→  status='queued' + next_touch_at
```

There are three entry points:

1. **Admin UI:** `/admin/sales-prospects/import` — paste or upload, see live
   parse preview, run dry-run before going live.
2. **API:** `POST /api/admin/sales-prospects/import` — JSON or multipart. Admin
   only.
3. **CLI:** `npx tsx scripts/import-prospects.ts --file=./leads.csv --campaign=…`

All three call the same `importProspects()` function, so behavior is identical.

---

## CSV column reference

The header row is **required**. Column names are case-insensitive and
whitespace / `_` / `-` are normalized away. Unknown columns are ignored with a
warning (not an error).

| Canonical column        | Required | Aliases (any case)                                          | Notes                                              |
| ----------------------- | -------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `email`                 | yes      | `email_address`, `work_email`, `personal_email`             | Lowercased, validated against `^[^\s@]+@…$`        |
| `first_name`            | no       | `first`, `given_name`, `fname`                              |                                                    |
| `last_name`             | no       | `last`, `surname`, `family_name`, `lname`                   |                                                    |
| `full_name`             | no       | `name`, `contact_name`                                      |                                                    |
| `title`                 | no       | `job_title`, `role`, `position`                             |                                                    |
| `company`               | no       | `company_name`, `org`, `organization`, `employer`           |                                                    |
| `industry`              | no       | `sector`, `vertical`                                        |                                                    |
| `zip`                   | no       | `zip_code`, `postal_code`, `postcode`                       |                                                    |
| `city`                  | no       |                                                             |                                                    |
| `state`                 | no       | `region`, `province`                                        |                                                    |
| `feeder_city`           | no       | `feeder`, `metro`, `market`, `origin`                       | Normalized — see table below                       |
| `segment`               | no       | `bucket`, `persona`                                         | Must be one of: golf, family, couples, honeymoon, snowbird, wedding, corporate, unknown. Unknown values trigger a warning and the row is re-inferred. |
| `estimated_hhi`         | no       | `hhi`, `household_income`, `income`                         | Free text — `$200k-$500k` style                    |
| `party_size_guess`      | no       | `party_size`, `group_size`, `travel_party`                  | Integer, clamped 1–500                             |
| `linkedin_url`          | no       | `linkedin`, `li`, `li_url`                                  |                                                    |
| `instagram_handle`      | no       | `instagram`, `ig`, `ig_handle`                              |                                                    |
| `facebook_url`          | no       | `facebook`, `fb`                                            |                                                    |
| `reddit_username`       | no       | `reddit`                                                    |                                                    |
| `twitter_handle`        | no       | `twitter`, `x`, `x_handle`                                  |                                                    |
| `phone`                 | no       | `phone_number`, `mobile`, `cell`                            |                                                    |
| `source_channel`        | no       | `channel`                                                   | One of the sales_channel enum values               |
| `source_campaign_slug`  | no       | `campaign`, `campaign_slug`                                 | Looked up against `sales_campaigns.slug`           |
| `source_notes`          | no       | `notes`, `intake_notes`, `context`                          | Fed into segmentation keyword scan                 |
| `enrichment_source`     | no       | `source`, `list`                                            | Free text — `apollo`, `manual`, `public_socials`   |
| `enrichment_data`       | no       | `enrichment`, `raw`                                         | If parseable JSON, stored as jsonb; else as string |

---

## Feeder-city normalization

Any of the left-column values (case-insensitive) are rewritten to the
right-column canonical form:

| Input                                          | Canonical        |
| ---------------------------------------------- | ---------------- |
| atlanta, atl                                   | Atlanta          |
| charlotte, clt                                 | Charlotte        |
| nyc, new york, new york city, manhattan, ny    | NYC              |
| washington dc, dc, d.c., washington            | DC               |
| boston, bos                                    | Boston           |
| chicago, chi                                   | Chicago          |
| cincinnati, cinci, cvg                         | Cincinnati       |
| nashville, nash, bna                           | Nashville        |
| raleigh, durham, raleigh-durham, rdu           | Raleigh-Durham   |
| greenville, greenville sc, gsp                 | Greenville-SC    |
| jacksonville, jax                              | Jacksonville     |
| orlando, mco                                   | Orlando          |

Anything not in this table is written through verbatim (just trimmed).

---

## How to enrich

We do **not** buy prospect lists. Period. Every batch must be sourced from one
of the approved channels below, and the `enrichment_source` column tells the
importer which.

### Public LinkedIn profiles

- Only data publicly visible to a logged-out viewer.
- Capture: name, title, company, public profile URL.
- Never scrape email addresses from LinkedIn — find them via the channels
  below.
- Set `enrichment_source = public_socials`.

### Apollo export → CSV cleanup

1. Build the list in Apollo using job-title + location filters (no purchased
   intent data).
2. Export "verified work email" rows only.
3. Strip Apollo internal IDs from the export.
4. Map columns to the canonical schema above.
5. Set `enrichment_source = apollo`.

### Manual research

For premium prospects (the 8-figure-HHI tier), enrich one at a time:

- Google `"[Name]" "[Company]" Hilton Head` for trip history clues
- Local news for charitable boards (signals capacity + community fit)
- Public real-estate records for second-home Hilton Head intent
- Set `enrichment_source = manual`

---

## Compliance

- **No purchased lists** — ever. CAN-SPAM compliance starts at acquisition.
- **Public-profile enrichment only.** If a profile is private or behind a
  paywall, we don't have it.
- **Document the source for each batch.** Use the `enrichment_source` column
  plus a free-form note in `source_notes` like "Apollo export — Atlanta law
  firm partners, 2026-05-21".
- **Honor opt-outs.** Anyone in `sales_unsubscribes.email_lower` is skipped at
  import. We never re-enroll.

---

## Sample CSV

The canonical template is downloadable from
`/api/admin/sales-prospects/import/template` (also kept in
[`docs/sales-ops/templates/sample-prospect-import.csv`](../templates/sample-prospect-import.csv)).

```csv
email,first_name,last_name,company,feeder_city,segment,party_size_guess,linkedin_url,source_channel,source_campaign_slug,source_notes,enrichment_source
allen.brookhaven@example.com,Allen,Brookhaven,Brookhaven Capital,Atlanta,golf,8,https://www.linkedin.com/in/allen-brookhaven-fake,email,atlanta-golf-q1-2026,"Annual partner trip — 8 guys looking for Harbour Town tee times in October",manual
maria.tribeca@example.com,Maria,Tribeca,Spring Studio,NYC,honeymoon,2,https://www.linkedin.com/in/maria-tribeca-fake,instagram,nyc-honeymoon-2026,"Newlyweds — wedding in June, honeymoon early July, oceanfront villa",public_socials
jp.greenville@example.com,Jordan,Pickens,Greenville Pediatrics,Greenville-SC,family,5,https://www.linkedin.com/in/jordan-pickens-fake,email,greenville-sc-family-2026,"Family of 5 (kids 3, 6, 9) — easy weekend drive, Easter break",manual
```

---

## End-to-end: 50 Greenville prospects

1. **Enrich.** Pull 50 Greenville-area parents-of-young-kids via the channels
   above. Targets: pediatric medicine, dental, accounting, law-firm partners.
2. **Build the CSV.** Use the template column order. Set:
   - `feeder_city` = `Greenville-SC`
   - `source_campaign_slug` = `greenville-sc-family-2026`
   - `enrichment_source` per origin
   - `source_notes` — capture the *why*: "kids 4 and 7, on Greenville
     Pediatric Society board". This feeds the segmentation regex.
3. **Dry-run via UI.**
   - Open `/admin/sales-prospects/import`
   - Pick the Greenville campaign + email channel
   - Check **Dry run**
   - Upload the CSV
   - Verify: 50 valid rows, 0 errors, segments mostly `family`. Review
     warnings.
4. **Import live.**
   - Uncheck Dry run, click Import.
   - Expect: 50 inserted (or some updated if you re-import an overlapping
     batch), 0 errored.
5. **Verify in CRM.** Open `/admin/sales-prospects`:
   - "Recent prospects" should show the new rows with segment `family` and
     status `queued`.
   - Click into the Greenville campaign card — the Prospects column should
     jump by 50.
   - Spot-check: a single prospect should have a `sales_touches` row of type
     `status_change` with metadata `{ event: "csv_imported", ... }`.

---

## Troubleshooting

### `Email is required`
The CSV is missing an `email` column header (or one of its aliases). The
parser reports this at line 1.

### Encoding issues (UTF-8 BOM, smart quotes)
The parser strips a leading UTF-8 BOM automatically. If your CSV has smart
quotes (`"…"`) inside quoted fields, they'll be preserved verbatim — they're
not the RFC-4180 escape char (`""`), so they don't break parsing. If Excel
saved your file as UTF-16, re-save as `CSV UTF-8 (Comma delimited)`.

### Windows line endings
CRLF is handled natively. So is bare LF. Mixed line endings work but should
be cleaned up in your editor before import.

### Embedded newlines in `source_notes`
Wrap the whole cell in double quotes:
```csv
…,"Line one.
Line two.",…
```
The parser handles this correctly.

### Dedupe conflicts ("updated" when you expected "inserted")
`sales_prospects` is uniquely indexed on `lower(email)`. If a row already
exists, the importer only fills currently-null columns and appends
`source_notes` with an ISO timestamp prefix. It will NOT overwrite an existing
non-null field. To do that, edit the row in the admin UI manually.

### Unsubscribe skips ("skipped_unsub")
The email is on `sales_unsubscribes.email_lower`. This is by design — we
never re-engage opt-outs. If the prospect genuinely wants back in, they have
to re-subscribe via a capture form first; only then will an import-skip flip
to insert.

### Sequence not assigned ("inserted" but `current_sequence` is null)
Three possible causes:

1. `--no-enqueue` / `autoEnqueue: false` was passed — by design.
2. The email failed the routing rules (no email → no sequence).
3. The segment came out `unknown` AND there's no fallback cold sequence
   configured. Check `data/salesSequences.ts` — `general-cold-v1` should be
   the universal fallback. If it's missing, the router returns
   `no_cold_sequence_for_segment`.

### `Could not parse enrichment_data as JSON`
Warning, not an error. The cell is stored as a plain string. To get jsonb
storage, your cell must be valid JSON — and if it contains commas or
quotes, wrap the whole cell in `"…"` and escape inner quotes as `""`.

### `Service-role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY`
The CLI or API is running without env. Add the keys to `.env.local` (or
export them in the shell). The admin UI gets them from the Vercel
environment automatically.

### Import is slow (>10s for 100 rows)
Each row does a `select` (existing) + `insert/update` + an optional
`sales_touches.insert`. That's 2–3 round-trips per row. 10,000 rows = 20–30k
queries. Batch responsibly — split into 500-row chunks and run them
sequentially with a sanity-check pause between.
