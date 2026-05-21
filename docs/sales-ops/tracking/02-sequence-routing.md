# Sequence Routing — Segmentation + Sequence Engine

How an anonymous capture POST becomes an enrolled prospect in an outbound
email sequence, then walks the sequence on a 30-minute cron.

## Architecture at a glance

```
                         ┌───────────────────────────────┐
 SalesProspectForm  ───▶ │ POST /api/sales-prospects      │
                         │  - clamp + validate            │
                         │  - upsert sales_prospects      │
                         │  - inferSegment(signals)       │
                         │  - routeProspect(decision)     │
                         │  - update segment + sequence   │
                         └───────────────┬───────────────┘
                                         │
                  (5 minute enrichment buffer)
                                         │
       ┌────────────────────┐            ▼
       │  GET /api/cron/    │   ┌────────────────────────┐
       │  sales-sequence-   │──▶│ processDueTouches()     │
       │  tick (every 30m)  │   │  - render merge fields  │
       └────────────────────┘   │  - send Resend          │
                                │  - insert sales_touches │
                                │  - advance cursor       │
                                └────────────────────────┘
```

## Files

| Path                                                | Purpose                                                       |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `data/salesSequences.ts`                            | Typed catalog of all 15 sequences (7 segments × 2 + 1 fallback) |
| `app/lib/sales/segmentation.ts`                     | Pure segment inference from capture signals                   |
| `app/lib/sales/sequenceRouter.ts`                   | Maps segment + status → sequence id + start time              |
| `app/lib/sales/sequenceEngine.ts`                   | Render + send + advance worker, used by cron and admin        |
| `app/api/cron/sales-sequence-tick/route.ts`         | Bearer-auth GET endpoint that fires the batch worker          |
| `app/api/sales-prospects/route.ts`                  | Capture endpoint — now calls segmenter + router on insert     |
| `components/sales/SalesProspectForm.tsx`            | Sends `source_page` + `utm_content` to capture                |

## Segmentation rules (priority order)

`inferSegment(SegmentSignals)` returns `{ segment, confidence, signals }`.
Rules fire in order; the first match decides the segment, but every
matching rule contributes to the confidence score.

1. **`sourceCampaign`** — campaign slug substring match.
   `golf` → `golf`, `wedding|bridal|bachelorette` → `wedding`,
   `family|spring-break|easter|thanksgiving` → `family`,
   `couples|anniversary` → `couples`, `honeymoon` → `honeymoon`,
   `snowbird|winter|long-stay` → `snowbird`,
   `corporate|retreat|offsite|sko|kickoff` → `corporate`.

2. **`sourcePage`** — landing-path regex match.
   `/hilton-head-golf-packages` → `golf`, `/hilton-head-weddings` → `wedding`,
   `/hilton-head-family-trip-planner` → `family`,
   `/hilton-head-honeymoon` → `honeymoon`,
   `/hilton-head-winter-rental` → `snowbird`,
   `/hilton-head-spring-break` → `family`,
   `/hilton-head-thanksgiving` → `family`,
   etc.

3. **`intakeNotes`** keyword scan — explicit regex bank per segment.
   Wedding (`wedding|bridal|bachelorette|ceremony|reception|elopement|...`),
   honeymoon, corporate, snowbird, golf (`golf|tee time|harbour town|heritage|...`),
   family (`kids|children|toddler|stroller|...`), couples
   (`anniversary|wife|husband|partner|date night|...`).

4. **`partySize` + `kids`** — last-resort shape hints.
   `partySize >= 8` → golf (default for large planner groups);
   `partySize <= 2` → couples; `3 ≤ partySize ≤ 6 && kids=true` → family;
   `kids=true` alone → family.

5. **Default** `unknown` (confidence 0). Routes to `general-cold-v1`.

`utmContent` is logged into the `signals` array but never decides a segment.

## Sequence catalog

15 total sequences in `data/salesSequences.ts`:

| Segment    | Cold (5-touch)         | Nurture (3-touch)         |
| ---------- | ---------------------- | ------------------------- |
| golf       | `golf-cold-v1`         | `golf-nurture-v1`         |
| family     | `family-cold-v1`       | `family-nurture-v1`       |
| couples    | `couples-cold-v1`      | `couples-nurture-v1`      |
| honeymoon  | `honeymoon-cold-v1`    | `honeymoon-nurture-v1`    |
| snowbird   | `snowbird-cold-v1`     | `snowbird-nurture-v1`     |
| wedding    | `wedding-cold-v1`      | `wedding-nurture-v1`      |
| corporate  | `corporate-cold-v1`    | `corporate-nurture-v1`    |
| general    | `general-cold-v1`      | _(promoted into a segment via a reply)_ |

Cold sequences are 5 touches at day 0/5/12/25/60 (touch 4 is the breakup).
Nurture sequences are 3 touches at day 3/10/21 relative to the engagement
signal that flipped the prospect.

## Routing decisions

`routeProspect({ segment, status, isNew, hasEmail, ... })`:

| Condition                                       | Decision                              |
| ----------------------------------------------- | ------------------------------------- |
| `!hasEmail`                                     | empty sequenceId, `reason='no_email'` |
| `status ∈ {unsubscribed, bounced, booked, converted, archived}` | empty, reason=`status_<x>` |
| `status ∈ {new, queued}`                        | `<segment>-cold-v1` or `general-cold-v1` |
| `status = engaged`                              | `<segment>-nurture-v1` (no general nurture) |
| `status ∈ {contacted, qualified, unresponsive}` | empty, manual workflow                |

`startAtIso` is always `now + 5 minutes` so any post-capture enrichment job
has a window to fill in `first_name`, `feeder_city`, and `country_club`
before touch 1 renders.

## Cron + auth

```
Path:     /api/cron/sales-sequence-tick
Schedule: */30 12-22 * * *   (every 30 min, 8 AM – 6 PM ET in EDT)
Auth:     Authorization: Bearer ${CRON_SECRET}
Batch:    50 prospects per tick
```

vercel.json:
```jsonc
{
  "crons": [
    { "path": "/api/cron/sales-sequence-tick", "schedule": "*/30 12-22 * * *" }
  ]
}
```

Required env:
- `CRON_SECRET` — Bearer token. **Without this, the endpoint returns 503.**
- `SUPABASE_SERVICE_ROLE_KEY` + `NEXT_PUBLIC_SUPABASE_URL` — service client.
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — outbound send. **Missing → soft-skip with a touch detail entry, no DB writes.**
- `UNSUBSCRIBE_HMAC_SECRET` (32+ chars) — required to mint unsubscribe tokens.

The query scans `sales_prospects` where:
- `next_touch_at <= now`
- `email is not null`
- `current_sequence is not null`
- `do_not_contact = false`
- `status in ('queued', 'contacted', 'engaged')`

Ordered by `next_touch_at asc`, limit 50.

## Merge fields

Supported tokens (anything else renders as a literal `{{token}}` for the admin preview to flag):

| Token                | Source                                           | Fallback                     |
| -------------------- | ------------------------------------------------ | ---------------------------- |
| `{{first_name}}`     | `first_name` or first word of `full_name`        | `'there'`                    |
| `{{feeder_city}}`    | `feeder_city || city`                            | `'your city'`                |
| `{{nearest_airport}}`| airport lookup keyed on lowercased feeder city   | `'your airport'`             |
| `{{kid_ages}}`       | `enrichment_data.kid_ages`                       | `'your kids'`                |
| `{{country_club}}`   | `enrichment_data.country_club`                   | `'your home club'`           |
| `{{sender_name}}`    | constant `Will`                                  | n/a                          |
| `{{unsubscribe_url}}`| `${brand.url}/api/sales-unsubscribe?token=...`   | n/a (HMAC required)          |

Airport lookup includes ATL, CLT, LGA, DCA, BOS, ORD, CVG, BNA, RDU, GSP, JAX, MCO, CLE, PIT, YYZ.

Every send appends a CAN-SPAM footer with the unsubscribe URL + physical address (Hilton Head Island, SC 29928) and tags the Resend send with `type=sales_sequence`, `sequence=<id>`, `touch=<step>`.

## Adding a new sequence

1. **Pick the segment.** If it doesn't exist, add it to `Segment` in `app/lib/sales/segmentation.ts`, add SQL enum value to a new migration, add it to `SequenceSegment` in `data/salesSequences.ts`, and add detection rules to `CAMPAIGN_HINTS` / `PAGE_HINTS` / `KEYWORD_HINTS`.
2. **Write the markdown.** Create `docs/sales-ops/email-sequences/0X-<segment>.md` with the 5+3 touch structure.
3. **Transcribe to TS.** Add a `Sequence` literal to `data/salesSequences.ts` with id `<segment>-cold-v1` / `<segment>-nurture-v1` and append to `SEQUENCES`.
4. **Verify the routing.** No change needed — `getSequenceForSegment` resolves any new sequence automatically.
5. **(Optional) Backfill.** Run an admin SQL to re-route existing prospects whose stored segment now matches the new bucket.

## Troubleshooting

**Prospect stuck at `status='queued'` with no touches.**
1. Is `current_sequence` populated? If null, routing returned an empty
   sequenceId — check `routeProspect` decision (no_email is most common).
2. Is `next_touch_at` set and in the past? If null, the capture path
   didn't fire the routing block. Check the API logs for
   `[sales-prospects] segmentation/route failed`.
3. Is the cron actually running? `vercel.json` must list the path AND
   `CRON_SECRET` must be set in production. `curl -i` with no Bearer header
   should return 401; with no env, 503.
4. Is Resend configured? With no `RESEND_API_KEY`, every batch logs
   `outcome: 'skipped', note: 'resend_not_configured'` and the cursor does
   not advance. Set the key and the next tick clears the backlog.

**Prospect bounced unexpectedly.**
Check the latest `sales_touches` row with `touch_type='email_bounce'` —
`metadata.error` is the Resend reason string. Permanent-failure heuristics
in `sequenceEngine.isPermanentFailure` flag `bounce|invalid|suppressed|blocked|does not exist|rejected`. Transient/5xx errors leave the prospect on the
schedule for the next tick.

**Merge field rendering shows `{{first_name}}` literally.**
The prospect row has no `first_name` and no `full_name`. The renderer
falls back to `'there'` — if the literal token still appears, the field
isn't in the supported set. Add it to `MergeContext` and `buildMergeContext`,
not just to a sequence body.

**Wrong sequence enrolled.**
Pull the latest `sales_touches.status_change` row for the prospect and
inspect `metadata.signals` + `metadata.route` — it spells out which rule
matched (campaign slug vs. page vs. keyword). Add a more specific rule to
`segmentation.ts` if a keyword is mis-firing.
