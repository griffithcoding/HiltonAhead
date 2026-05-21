# Hilton Ahead Sales Ops — Multi-Channel Outreach Engine

Built 2026-05-20. The full sales/marketing system to recruit $200K+ HHI travelers from feeder metros into the Hilton Ahead funnel.

---

## What lives here

### Infrastructure (committed code)
| File | What it does |
|---|---|
| `supabase/migrations/018_sales_prospects.sql` | 4 tables + 4 enums + 1 view. Cold-outbound CRM distinct from inbound `lead_inquiries`. Seeded with 15 feeder-city campaigns. |
| `app/api/sales-prospects/route.ts` | Anon POST capture endpoint. Dedupe by lower(email), silent unsub-respect, Resend admin notify. |
| `app/api/sales-track/route.ts` | Event ingest. Hashes IP server-side. Writes to `sales_touches`. |
| `app/api/sales-unsubscribe/route.ts` | HMAC-verified one-click unsubscribe. CAN-SPAM compliant. |
| `app/lib/salesTracking.ts` | UTM stamping + sendBeacon event tracking + 90-day first-touch attribution cookies. |
| `app/lib/salesUnsubscribe.ts` | HMAC sign/verify helpers for unsubscribe tokens. |
| `components/sales/SalesProspectForm.tsx` | Embeddable capture form for landing pages. |
| `components/sales/SalesFooter.tsx` | CAN-SPAM email footer component. |
| `app/admin/(gated)/sales-prospects/page.tsx` | Admin dashboard — campaign stats + last 50 prospects. |
| `app/admin/(gated)/sales-prospects/campaigns/[slug]/page.tsx` | Per-campaign drill-down stub. |

### Playbooks (docs)
- **campaigns/** — 12 feeder-city campaign briefs (Atlanta, Charlotte, NYC, DC, Boston, Chicago, Cincinnati, Nashville, Raleigh-Durham, Greenville SC, Jacksonville, Orlando)
- **email-sequences/** — 7 segment-specific sequences (golf, family, couples, honeymoon, snowbird, wedding, corporate) — each 5-touch cold + 3-touch nurture
- **social-playbooks/** — 7 platform playbooks (IG, FB, TikTok, Pinterest, Reddit, LinkedIn, YouTube Shorts) — each with 20 ready-to-post pieces
- **content-calendar/** — 13-week SEO calendar (Jun–Aug 2026): strategy, week-by-week, 12 full post briefs, 5 keyword clusters, 13 newsletter issues
- **tracking/** — UTM conventions + event-type vocabulary

---

## How the pieces connect

```
Feeder-city campaign brief
   ↓
Email sequence template (segment-matched)
   ↓ (every send includes UTM + campaign_slug)
Recipient clicks → lands on hiltonahead.com
   ↓
salesTracking.ts captures attribution → cookie (90-day first-touch)
   ↓
Recipient fills /itinerary or SalesProspectForm or newsletter signup
   ↓
/api/sales-prospects writes to sales_prospects (with source_campaign UUID)
   ↓
Every subsequent touch (email open/click/reply, LinkedIn message, IG DM)
   logs to sales_touches via /api/sales-track
   ↓
Admin sees pipeline at /admin/sales-prospects
   ↓
When prospect converts → status='converted', converted_itinerary_id = itinerary_request UUID
```

---

## 30-day launch checklist

### Week 1: Foundation
- [ ] Run migration `018_sales_prospects.sql` in Supabase (CLI or SQL editor)
- [ ] Add env vars: `UNSUBSCRIBE_HMAC_SECRET` (32-byte random), `SALES_IP_SALT` (32-byte random)
- [ ] Verify `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` already set
- [ ] Set up secondary sending domain (e.g., `mail.hiltonahead.com`) with SPF + DKIM + DMARC
- [ ] Warm secondary domain 2 weeks minimum before first cold send
- [ ] Test /admin/sales-prospects dashboard loads
- [ ] Test /api/sales-prospects with curl, verify row inserted
- [ ] Test /api/sales-unsubscribe HMAC flow end-to-end

### Week 2: Content kickoff
- [ ] Publish Week 1 content (cost-of-trip cluster anchor — see `content-calendar/01-week-by-week.md`)
- [ ] Publish Week 2 piece on **last-call July villa availability** — flagged as highest commercial-intent launch week
- [ ] Set up Instagram + LinkedIn accounts (handle: `@hiltonaheadtravel`)
- [ ] Update `data/brand.ts` social URLs after accounts live
- [ ] Pin 4 starter posts on Pinterest (lowest-effort distribution)

### Week 3: Outreach pilot
- [ ] Pilot ONE feeder city first — Greenville SC (lowest cost-per-lead bet per agent analysis) OR Jacksonville (drive market, easy to convert)
- [ ] Build enriched list (50-100 prospects) via public LinkedIn + business registries (no purchased lists)
- [ ] Send Touch 1 emails — max 50/day per sender
- [ ] Monitor bounce rate (<2%) and complaint rate (<0.1%) — pause if exceeded
- [ ] Log every send into `sales_touches` (manual or scripted)

### Week 4: Measure + decide
- [ ] Check campaign stats view: open rate, reply rate, qualified rate
- [ ] Compute cost per qualified lead for the Greenville pilot
- [ ] Decide which city goes next (DC + Raleigh-Durham are next-best drive markets)
- [ ] Tighten the email sequence that performed worst
- [ ] Plan Week 5-8 social posting using the playbooks

---

## Live route verification (corrections from agent recon)

The codebase uses `/hilton-head-{type}` pattern (NOT `/trip-types/{type}`). Verified live routes:
- `/hilton-head-golf-packages`
- `/hilton-head-weddings`
- `/hilton-head-oceanfront-villas`
- `/hilton-head-family-trip-planner`
- `/hilton-head-spring-break`
- `/hilton-head-thanksgiving`
- `/hilton-head-beaches`
- `/hilton-head-honeymoon`
- `/hilton-head-winter-rental`
- `/hilton-head-wedding-inquiry` (separate from /hilton-head-weddings)
- `/hilton-head-weather`
- `/itinerary`
- `/cost-of-hilton-head-trip`
- `/admin/sales-prospects` (new)

Routes referenced in playbooks but NOT live in code (handle before campaigns ship):
- `/quiz` — referenced as mid-intent capture surface; create or remove from sequences
- `/trip-types/*` — agent prompts used this; live paths use `/hilton-head-*` (campaigns agent corrected, others may need a sweep)

---

## Compliance posture (non-negotiable)

- CAN-SPAM: every email has unsubscribe + physical address — `SalesFooter` component enforces
- GDPR: explicit opt-in, deletion endpoint (use existing admin tooling)
- CCPA/VCDPA/CPA: minimum data, no sale of data, deletion endpoint
- No purchased lists. Enrichment from public profiles only.
- Reddit: never link unless directly asked. Value-first comments with disclosure.
- Instagram: single DM only. Multi-touch reads as spam.

---

## KPIs to watch

| Metric | Week 1 target | Week 4 target | Week 12 target |
|---|---|---|---|
| Email open rate | n/a (warming) | 35%+ | 40%+ |
| Email reply rate | n/a | 3%+ | 5%+ |
| Bounce rate | <2% | <1% | <1% |
| LinkedIn accept rate | n/a | 30%+ | 40%+ |
| Cost per qualified lead | n/a | <$50 | <$30 |
| Qualified → booked rate | n/a | n/a | 15%+ |
| Revenue per outreach dollar | n/a | n/a | 5x+ |

---

## Next steps (post-launch)

1. **A/B test framework** — currently per-segment A/B is documented but execution is manual. Build a flag column on `sales_touches` if you want automated arm assignment.
2. **Automated sending** — sequences are currently send-by-hand templates. Wire a cron job + Resend batch send when warm-domain history is established.
3. **LinkedIn automation** — explicitly not built. Manual outreach only. Sales Navigator + manual cadence stays compliant.
4. **Affiliate revenue attribution** — `sales_touches` doesn't yet record outbound affiliate clicks. If a prospect clicks Booking.com from an email, log it via the existing `affiliate_events` table (migration 013) and join on `prospect_id`.
5. **Phone / SMS** — out of scope this round. CRM state from prior session notes Twilio is on the wishlist.

---

## Quick links to deliverables

| | Path |
|---|---|
| **Campaigns** | [docs/sales-ops/campaigns/](./campaigns) |
| **Email sequences** | [docs/sales-ops/email-sequences/](./email-sequences) |
| **Social playbooks** | [docs/sales-ops/social-playbooks/](./social-playbooks) |
| **Content calendar** | [docs/sales-ops/content-calendar/](./content-calendar) |
| **Tracking conventions** | [docs/sales-ops/tracking/01-utm-conventions.md](./tracking/01-utm-conventions.md) |
| **Migration** | [supabase/migrations/018_sales_prospects.sql](../../supabase/migrations/018_sales_prospects.sql) |
| **Admin dashboard** | `/admin/sales-prospects` (gated) |
| **Capture endpoint** | `POST /api/sales-prospects` |
