# Workstream Breakdown — Million-Dollar Roadmap

**Date:** 2026-05-21
**Source:** [2026-05-04-million-dollar-roadmap.md](./2026-05-04-million-dollar-roadmap.md)
**Purpose:** Convert each $-stream into a logically ordered task list with concrete first moves. Each workstream lists steps in **build order** — earlier steps unblock later ones.

---

## At-a-glance: where to start

| Priority | Workstream | Why first |
|---|---|---|
| 1 | **B — Directory subs** | Highest $/hr leverage. Infra 80% there. Recurring revenue. |
| 2 | **A — Villa Match (finish)** | Already on branch `feat/villa-match`. Don't strand WIP. |
| 3 | **E — Info products** | Fastest to first dollar. Stripe already wired. Low build cost. |
| 4 | **C — Affiliate audit** | Cheap. Tells us if Workstream C is real or a rounding error. |
| 5 | **D — Sponsor inventory** | Needs SEO traffic numbers to set rate card. Build after Q2 traffic data. |
| Cross | **Layer 1 agents** | Build incrementally — one cron per workstream as it's ready. |

---

## Workstream A — Trip consulting at scale ($400–500k)

**Constraint:** founder throughput. Every step here either (a) removes founder from low-value steps or (b) lifts $/trip.

### Logical sequence

1. **Finish Villa Match quiz** *(in progress on `feat/villa-match`)*
   - Recover lost PDF takeaway implementation (per memory obs 369, 371)
   - Fix TypeScript errors in recovered code
   - Land 4 test suites already drafted (happy, edge-cases, scoring, a11y)
   - Ship to `/villa-match`, wire from homepage hero + nav
2. **Tiered service ladder — add $199 self-serve consult SKU**
   - Stripe SKU + new `/consult-self-serve` landing page
   - Calendly 30-min event type
   - Auto-confirm email with prep questionnaire
3. **Pricing floor lift: 12%/$2.5k → 14%/$3.5k for groups/weddings**
   - Update `data/pricing.ts`
   - Update copy on `/weddings`, `/group-trips`
   - Backfill in quote-generation logic if any exists
4. **Trip Sketch builder** *(brainstorm #2 queued)*
   - Brainstorm → spec → plan → ship
   - Goal: capture intent earlier; sticky engagement
5. **AI itinerary draft hand-off** *(brainstorm #3 queued)*
   - AI drafts first pass; founder reviews + signs off
   - Target: 3–5× throughput on same founder hours
6. **Auto-quote for repeat clients**
   - Migration: `client_profiles` table
   - "Same as last year" 1-click flow in admin
7. **Layer 1 agents for A:**
   - Daily 7am: first-touch lead reply drafter (drafts in `/admin/leads`)
   - Weekly Mon: pipeline aging report
   - Monthly 15th: trip-anniversary outreach to past clients

### First task to start
Recover + fix the WIP villa-match work that's already on disk (`tests/villa-match-*.spec.ts`, `app/api/villa-match/pdf/route.tsx`, `components/villa-match/PdfTakeawayDialog.tsx`). It's the only workstream with active uncommitted code.

---

## Workstream B — Local directory subs ($250–350k) — RECOMMENDED FIRST

**Why this is the unlock:** recurring SaaS revenue, scales without founder time per sale, infrastructure already 80% built.

### Logical sequence

1. **Audit current billing state** *(half-day investigation)*
   - Read `app/admin/(gated)/directory/*`, `purchases` schema, business portal code
   - Document: what tiers exist? what's billable? what's free?
   - Output: short audit doc with gaps list
2. **Define tier structure**
   - Featured $99/mo, Premium $249/mo, Sponsor $999/mo (or whatever audit suggests)
   - Per-tier feature matrix (placement, photos, attribution access, lead routing)
3. **Wire Stripe subscription billing** *(not one-time `purchases`)*
   - New migration: `directory_subscriptions` table
   - Stripe subscription products + price IDs
   - Webhook handling for sub lifecycle (created, updated, canceled, failed)
   - Customer portal link for self-service cancel/upgrade
4. **Self-serve onboarding flow**
   - Apply → instant claim (already exists) → 14-day free trial → auto-bill
   - Trial expiry email sequence
5. **Attribution proof email — non-optional retention lever**
   - Monthly cron: aggregate `directory_events` per business
   - Resend template: "We sent you X visitors / Y calls / Z inquiries this month"
   - Render via `app/lib/email.ts`
6. **Outbound sales engine — biggest build, biggest payoff**
   - Prospect scraping (Yelp, Google Maps, Chamber)
   - Enrichment (email finder, firmographics)
   - Scoring (industry fit, est. revenue, web presence)
   - Templated outreach + drip sequences
   - Calendly demo booking
   - CRM in `/admin/outreach` (already scaffolded per memory)
7. **Industry expansion**
   - Add real estate agents, photographers, charter captains, instructors to industry catalog
   - +50–150 sellable seats
8. **Churn-risk flagging**
   - Monthly: flag businesses with declining engagement → outreach queue

### First task to start
The audit (step 1). Half a day of reading code. Cannot define tiers or wire billing without knowing what's already there.

---

## Workstream C — Affiliate ($50–100k)

**Recent state:** affiliate links shipped (`ac2261e`). Tier S stubs added (Allianz, Hertz, Peter Millar — see memory obs 351–355). CJ Affiliate pivot decided (memory S123).

### Logical sequence

1. **Audit existing affiliate placements** *(half-day)*
   - Grep affiliate components/data. Which links, which programs, which earning?
   - Output: spreadsheet of every placement + status
2. **Resolve network strategy — Impact vs CJ vs direct**
   - Per memory S123, CJ pivot was discovered mid-stream. Lock the network plan.
3. **Curate top 20 partner list**
   - Resort villa platforms (VRBO, Airbnb, direct)
   - Golf (GolfNow, Sea Pines tee times)
   - Restaurant reservations (Resy, OpenTable)
   - Activities (boat tours, kayak, dolphin cruises)
   - Cross-sell (Disney Aulani for villa-loyal customers)
4. **Placement strategy**
   - High-intent moments: end of neighborhood pages, end of trip-type pages, Villa Match PDF takeaway, newsletter, saved Trip Sketch
   - Build reusable `<AffiliateCTA />` component if not present
5. **A/B test framework**
   - Quarterly placement + copy test
6. **Layer 1 agent:**
   - Monthly: affiliate performance report — earnings by partner, CTR by placement, drop/keep recommendations

### First task to start
The audit + a `data/affiliates.ts` source-of-truth file if one doesn't exist.

---

## Workstream D — Sponsor / ad slots ($80–120k)

### Logical sequence

1. **Sponsor inventory dashboard** *(admin)*
   - Show: available slots, sold slots, expiring soon, revenue per slot
   - Powers: newsletter slots + top-of-page slots on top-50 pages
2. **Public rate card page + intake form**
   - `/advertise` or `/sponsors`
   - Self-serve inquiry → admin notification
3. **Newsletter sponsor slot wiring**
   - 1–2 slots per issue × 24/yr × $1.5k
   - Render in `app/lib/newsletter/render.ts`
   - Inventory tracked per `newsletter_issues`
4. **Top-of-page sponsor slot component**
   - Reusable `<SponsorBanner />` for landing pages
   - Tiered pricing by page traffic
5. **Sponsored content editorial flow**
   - Quarterly paid editorial ("Brought to you by X resort")
   - Disclosure label compliance
6. **Layer 1 agents:**
   - Weekly: inventory refresh
   - Monthly: sponsor performance report to advertisers (impressions, clicks)
   - Quarterly: rate-card review based on traffic growth

### First task to start
**Not yet — wait for Q2 traffic data.** Sell sheet credibility = "X sessions/mo, Y newsletter subscribers." Build inventory dashboard once those numbers are sellable. In the meantime, ship the `<SponsorBanner />` component so it's ready when inventory comes online.

---

## Workstream E — Productized info products ($50–100k)

### Logical sequence

1. **Pick first 2 products** — couples itinerary + golf itinerary
2. **Author PDF content** — polished, branded, ~15–25 pages each
   - Couples: 5-day itinerary with restaurant, beach, sunset, activity picks
   - Golf: 4-day itinerary with course breakdowns, tee-time strategy, dining
3. **Stripe SKUs + landing pages**
   - `/itinerary-packs/couples-hilton-head` — $49
   - `/itinerary-packs/golf-hilton-head` — $49
   - Use existing `/api/checkout` flow
4. **Post-purchase email delivery**
   - Resend transactional with PDF attachment + access link
   - Receipt + upsell to full consult
5. **Expand to 5–7 SKUs over Q1**
   - Family pack ($49), Wedding-guest pack ($49)
   - Neighborhood deep-dives: Sea Pines $79, Palmetto Dunes $79, Forest Beach $79
   - Trip-prep bundle $29 (packing + dining + tides + driving)
6. **Layer 1 agents:**
   - Monthly: seasonal content refresh (restaurants closed/opened, pricing changes)
   - Quarterly: revenue-by-SKU report; cut/replace underperformers

### First task to start
Pick the first 2 SKUs and author the content. Everything else (checkout, delivery) is plumbing on top of existing Stripe + Resend.

---

## Cross-cutting: the operating cadence (Layer 1 agents)

Don't build all at once. Build the cron for each workstream as that workstream lights up. Order:

1. **Newsletter draft** *(already wired)*
2. **Lead first-touch drafter** (Workstream A) — daily 7am
3. **Attribution proof emails** (Workstream B) — monthly 1st
4. **Outbound prospect batch** (Workstream B) — weekly Mon
5. **Pipeline aging report** (Workstream A) — weekly Mon
6. **Sponsor performance reports** (Workstream D) — monthly 1st
7. **Affiliate performance report** (Workstream C) — monthly 1st
8. **Trip-anniversary outreach** (Workstream A) — monthly 15th
9. **Financial dashboard email** (cross-stream) — monthly 5th
10. **SEO content audit** — weekly Fri

Use the `schedule` skill / cron-driven agents already in environment.

---

## Risks to acknowledge before starting any stream

1. **Workstream B outbound legality** — CAN-SPAM compliance, email warming, Chamber relationships. Verify before scaling outreach.
2. **Workstream A founder time** — even productized, 400 trips/yr from 57 is a step-function. AI hand-off has to actually deliver 3–5× throughput.
3. **AI-generated content + Google** — every auto-draft needs human approval. No bulk-publish.
4. **Directory churn** — without attribution proof, businesses drop. Proof email is gating, not nice-to-have.
5. **24-mo timeline is aggressive.** Conservative read: $500k @ 18mo, $1M @ 36mo.

---

## Recommended next move

Pick **one** of these and we'll deep-dive:

- **B/Step 1 — Audit current billing state.** Half-day. Outputs a gaps list. Unblocks the highest-leverage workstream.
- **A/Step 1 — Recover + ship Villa Match.** Active WIP. Don't strand it.
- **E/Step 1 — Pick first 2 info-product SKUs and start authoring.** Fastest path to a new $ source.

Or: run `/gsd-explore` on the chosen workstream to generate a spec before planning.
