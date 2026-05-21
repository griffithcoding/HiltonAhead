# Sales-Ops System Status

Last updated: 2026-05-21

## What's live

### Database (1 migration, ready to apply)
- `supabase/migrations/018_sales_prospects.sql` — 4 tables, 4 enums, 1 view, 15 seeded campaigns

### Runtime code (16 files)
| Path | Purpose |
|---|---|
| `data/salesSequences.ts` | 15 sequences, 65 SequenceTouch records |
| `app/lib/sales/segmentation.ts` | 5-tier `inferSegment()` (campaign → page → keywords → party → default) |
| `app/lib/sales/sequenceRouter.ts` | `routeProspect()` decides sequence + start time |
| `app/lib/sales/sequenceEngine.ts` | `processDueTouches`, `advanceProspect`, `renderTouch`, merge-field substitution, Resend send |
| `app/lib/salesTracking.ts` | UTM + sendBeacon + 90-day first-touch cookies |
| `app/lib/salesUnsubscribe.ts` | HMAC sign/verify |
| `app/lib/content/syndicate.ts` | Pure post → 23-asset pack derivation |
| `app/lib/content/contentPackToMarkdown.ts` | Pack → markdown serializer |
| `app/api/sales-prospects/route.ts` | Anon capture; calls `inferSegment` + `routeProspect` post-insert |
| `app/api/sales-track/route.ts` | Event ingest with hashed IP |
| `app/api/sales-unsubscribe/route.ts` | HMAC one-click unsub |
| `app/api/cron/sales-sequence-tick/route.ts` | Bearer-auth cron processor (every 30 min 12-22 UTC) |
| `app/api/content/syndicate/route.ts` | On-demand pack JSON |
| `components/sales/SalesProspectForm.tsx` | Embeddable capture form (sends source_page) |
| `components/sales/SalesFooter.tsx` | CAN-SPAM email footer |
| `scripts/syndicate-all.ts` | CLI to regenerate all packs |

### Admin UI (4 routes — all behind `requireAdmin`)
- `/admin/sales-prospects` — KPI strip + campaign stats + last 50 prospects
- `/admin/sales-prospects/campaigns/[slug]` — per-campaign drill-down (stub)
- `/admin/content/syndicate` — pack browser
- `/admin/content/syndicate/[slug]` — per-post pack viewer with copy buttons + tabs

Both new sections linked in the admin sidebar.

### Playbook docs (133 files)
| Bucket | Count |
|---|---|
| Campaign briefs (12 feeder cities) | 12 |
| Email sequences (7 segments) | 7 |
| Social playbooks (7 platforms) | 7 |
| Content calendar (strategy + week-by-week + briefs + clusters + newsletter plan) | 5 |
| Social rolling (4 weeks × 7 platforms) | 28 |
| Newsletter queue (4 variants of #1 + 12 single-segment) | 16 |
| Derived content packs (one per blog post) | 33 |
| Tracking spec (UTM + sequence routing) | 2 |
| READMEs / status | 2 |

### Blog content
- 6 commercial-intent posts added to `data/posts.ts`:
  - hilton-head-trip-cost-2026-real-numbers
  - last-call-july-hilton-head-villa-availability
  - sea-pines-vs-palmetto-dunes-vs-shelter-cove
  - hilton-head-golf-packages-course-tiers
  - hilton-head-spring-break-heritage-week-avoid
  - hilton-head-weather-month-by-month

## How a lead now flows end-to-end

```
Cold outreach (email / LinkedIn / IG / Reddit / FB / Pinterest)
   ↓ UTM-tagged link
Landing page on hiltonahead.com
   ↓ salesTracking captures attribution into 90-day cookie
Visitor fills /itinerary, SalesProspectForm, or newsletter signup
   ↓
POST /api/sales-prospects
   ↓ Service client upsert by lower(email), respects sales_unsubscribes
   ↓ inferSegment(signals) → segment + confidence
   ↓ routeProspect → sequenceId + start time
   ↓ sales_prospects.current_sequence + sequence_step + next_touch_at set
   ↓ Resend ops notification fires
   ↓ Return 200
   
Cron tick (GET /api/cron/sales-sequence-tick, Bearer-auth, every 30 min)
   ↓ processDueTouches(batchSize=50)
   ↓ Render subject + body, merge fields, append UTM + unsubscribe HMAC link
   ↓ Resend send
   ↓ Insert sales_touches (touch_type='email_sent', external_id, body_preview)
   ↓ Advance sequence_step, schedule next_touch_at, update status
   ↓ Hard bounce → status='bounced', stop
   
Admin dashboard at /admin/sales-prospects shows pipeline state
Per-prospect drill-down (future) shows full touch timeline
```

## Pre-flight checklist before sending

1. Apply migration: `npx supabase db push` (or paste SQL into Supabase editor)
2. Add env vars to production:
   - `UNSUBSCRIBE_HMAC_SECRET` — 32 random bytes
   - `SALES_IP_SALT` — 32 random bytes
   - `CRON_SECRET` — Bearer token for cron route
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` — already present
3. Schedule cron: `*/30 12-22 * * *` hitting `/api/cron/sales-sequence-tick` with `Authorization: Bearer $CRON_SECRET`
4. Warm secondary sending domain 2 weeks before first cold send (SPF + DKIM + DMARC)
5. Test capture: `curl -X POST $URL/api/sales-prospects` with sample body
6. Test cron: `curl -H "Authorization: Bearer $CRON_SECRET" $URL/api/cron/sales-sequence-tick`
7. Test unsub: visit signed URL, verify row in `sales_unsubscribes`
8. Verify admin dashboard at `/admin/sales-prospects` loads

## Known caveats

- Typecheck has 2 pre-existing `.next/types` cache errors (affiliates/page.js, cost-of-hilton-head-trip/page.js); both are Next.js build-cache artifacts, not real type errors. Clearing `.next` and rebuilding resolves them.
- `/quiz` referenced as mid-intent capture in some playbook copy but route not yet built. Either add the page or sweep the references.
- LinkedIn touches in sequences are documented but currently no automated send. Manual outreach only — Sales Navigator stays compliant.
- Phone/SMS not implemented this round (Twilio integration pending from prior session memory).
- Per-prospect timeline view in admin is stubbed; only the campaign drill-down placeholder exists.

## Next high-leverage moves

1. **Run the migration + warm the secondary domain.** Everything else waits on this.
2. **Pilot one city first** — Greenville-SC (cheapest cost-per-lead per agent analysis) before scaling to NYC/Boston.
3. **Publish Week 2 content** ("last-call July villa availability") — flagged as highest-commercial-intent launch piece.
4. **Build a `/quiz` page** (5-question segment quiz) and wire it to /api/sales-prospects with high-confidence segment signal.
5. **Wire affiliate-click attribution** to sales_touches so revenue lands against the right prospect/campaign.
