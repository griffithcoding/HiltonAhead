# Million-Dollar Roadmap — Hilton Ahead Travel Co.

**Date:** 2026-05-04
**Goal stated:** "$1M from hiltonahead.com using a fully self-sufficient workflow"
**Reality check:** $1M will not come from one workflow. It comes from a **layered revenue stack** running on a **recurring operating cadence** that does not depend on founder discipline.

## Current snapshot (best estimate from codebase signals)

Revenue surfaces already in flight (per recent commits + CLAUDE.md):
- Trip consulting fees (Stripe `/api/checkout` → `purchases` table) — primary
- Affiliate links (commit `ac2261e feat(monetization): affiliate links, direct sponsor slots, ad SKUs, newsletter sponsors`) — just shipped
- Direct sponsor slots / display ads — just shipped
- Newsletter sponsors — just shipped
- Local directory + business portal (`dca6721`, `d230e01`) — paid tier scaffold in place
- Lead-capture pages (`d230e01`) — 4 new pages

**Estimated current run-rate:**
- ~57 trips/year × ~$1k avg fee = **~$57k/yr in trip-fee revenue**
- Affiliate / sponsor / directory: pre-revenue (scaffolding shipped, not yet monetized at scale)

**Gap to $1M:** ~17–18× current revenue. Aggressive but not impossible at 24-month horizon with multi-stream stacking.

---

## The five revenue workstreams

| # | Stream | 24-mo target | Mechanism |
|---|---|---|---|
| A | Trip consulting fees | $400–500k | Scale founder throughput via productized intake (Villa Match, AI draft hand-off, pre-qualified leads). 400 trips/yr × $1.1k avg. |
| B | Local directory subs | $250–350k | Paid tier sales engine. 200 businesses × $1.5k/yr = $300k. Sales = directory CRM + automated outreach + 1-call close. |
| C | Affiliate revenue | $50–100k | Curate 20–30 highest-fee partners (resort rentals, golf, restaurant reservations, tickets). Place at high-intent moments. |
| D | Sponsor / ad slots | $80–120k | Newsletter sponsors ($1–3k each, 24 issues/yr × 1–2 slots), top-of-page sponsor slots on top 50 SEO pages. |
| E | Productized info products | $50–100k | DIY itineraries ($49), neighborhood guides ($79), packing-list bundles ($29). Off-the-shelf, zero founder time per sale. |
| | **Total** | **$830k–$1.17M** | |

Mid-point: **~$1M**.

---

## Workstream A — Trip consulting at scale ($400–500k)

**Constraint:** founder is the bottleneck. Cannot scale linearly.

**Plays:**
1. **Villa Match quiz** (specced + planned — `2026-05-04-villa-matchmaker-quiz`) — pre-qualifies inbound, routes only ready-to-quote leads to founder.
2. **AI itinerary draft hand-off** (queued, brainstorm #3) — AI handles 80% of intake; founder reviews + finalizes. 3–5× throughput on same hours.
3. **Trip Sketch builder** (queued, brainstorm #2) — sticky engagement surface that captures intent earlier in funnel.
4. **Auto-quote for repeat clients** — saved profile, "same as last year" 1-click rebooking.
5. **Tiered service ladder** — add a $199 "self-serve consult" (30 min Calendly + email follow-up, no full itinerary) for budget-conscious leads who'd otherwise bounce.
6. **Group / wedding pricing minimum lift** — current 12%/$2.5k floor → push to 14%/$3.5k. Same volume, more revenue.

**Self-sufficient automation:**
- Scheduled daily: scan unanswered inbound, draft first-touch reply, queue for founder approval
- Scheduled weekly: pipeline aging report, nudge stale leads
- Scheduled monthly: client-trip-anniversary outreach ("you booked 12 months ago — same time next year?")

---

## Workstream B — Local directory subs ($250–350k) — HIGHEST $ / HOUR LEVERAGE

**Why this is the biggest unlock:** recurring subscription revenue, scales without founder time per sale once the engine runs.

**Current state:** `/local/[industry]` directory live, attribution tracking live (`directory_events`), business portal Phase 0/1 shipped (apply, claim, sign in).

**Plays:**
1. **Paid tier productization** — define tiers (Featured $99/mo, Premium $249/mo, Sponsor $999/mo). Currently business portal exists but pricing/billing not fully wired — verify in `purchases` + portal code.
2. **Automated outbound sales engine** — scrape Hilton Head business listings (Yelp, Google Maps, Chamber). Enrich. Score. Send templated cold outreach. Drip sequence. Calendly book → 15-min demo → close.
3. **Self-serve onboarding** — apply → instant claim → 14-day free trial → auto-bill via Stripe.
4. **Attribution proof report** — automated monthly email to each subscriber: "Hilton Ahead sent you X visitors, Y calls, Z inquiries this month." Single biggest retention lever.
5. **Industry expansion** — current industries: 13 listed in `directory/track`. Add: real estate agents, photographers, charter captains, instructors. Adds 50–150 sellable seats.

**Self-sufficient automation:**
- Scheduled weekly: prospect enrichment + outreach batch (10–20 businesses)
- Scheduled monthly: attribution proof email to all subscribers
- Scheduled monthly: churn-risk flagging (low engagement → outreach)
- Scheduled quarterly: pricing audit + competitor review

**Math:** 200 paid businesses at $1.5k avg ARR = $300k/yr. At 5–10 closes/mo from automated outbound, hit 200 in 24–36 months.

---

## Workstream C — Affiliate ($50–100k)

**Plays:**
1. **Audit existing affiliate placements** (per `ac2261e`) — what's wired, what's earning?
2. **Curate top 20 partners** — resort villa platforms (VRBO, Airbnb, direct), golf tee-time platforms (GolfNow, Sea Pines), restaurant reservations (Resy, OpenTable), tickets (Hilton Head boat tours, Disney Aulani for cross-sell, etc.).
3. **Placement strategy** — affiliate CTAs at the highest-intent moments: end of neighborhood pages, end of trip-type pages, in newsletter, in saved Trip Sketch, in PDF takeaways.
4. **A/B test placement copy + position** — automated quarterly.

**Self-sufficient automation:**
- Scheduled monthly: affiliate program audit — which earned, which to drop, which to add
- Scheduled monthly: placement-CTR report

---

## Workstream D — Sponsor / ad slots ($80–120k)

**Plays:**
1. **Newsletter sponsor slot** — sell 1–2 slots per issue × 24 issues/yr × $1.5k = $36–72k.
2. **Top-of-page sponsor slot** on top-50 SEO landing pages — sell to local businesses ($500–1.5k/mo per page tier). Top 10 pages × $1k = $10k/mo = $120k/yr potential.
3. **Sponsored content** — once a quarter, a paid editorial feature ("Brought to you by X resort").
4. **Sponsor inventory dashboard** — automated booking calendar, sold/available, expiring.

**Self-sufficient automation:**
- Scheduled weekly: sponsor inventory refresh
- Scheduled monthly: sponsor performance report to advertisers (impressions, clicks)
- Scheduled quarterly: rate-card review based on traffic growth

---

## Workstream E — Productized info products ($50–100k)

**Plays:**
1. **"Hilton Head Itinerary Pack"** — 4 pre-built itineraries (couples, family, golf, wedding) as polished PDFs. $49 each.
2. **"Neighborhood Deep-Dive"** — Sea Pines / Palmetto Dunes / Forest Beach as standalone purchasable guides. $79 each.
3. **"Trip-Prep Bundle"** — packing list + dining reservations cheat sheet + tide-times planner + driving guide. $29.
4. **Stripe checkout** — already wired (`/api/checkout`); just need product SKUs + landing pages.

**Self-sufficient automation:**
- Scheduled monthly: refresh seasonal content (which restaurants closed, which opened, current pricing)
- Scheduled quarterly: revenue-by-SKU report; cut/replace underperformers

**Math:** 1,500 units/year × $50 avg = $75k. Realistic given current SEO traffic.

---

## The self-sufficient operating cadence

The point of "self-sufficient" is **no manual workflow per task** — everything runs on schedule, founder reviews dashboards + approves judgment calls only.

### Layer 1 — Scheduled agents

Using the `schedule` skill / cron-driven agents (already available in this environment):

| Cadence | Job | Output |
|---|---|---|
| Daily 7am | First-touch lead reply drafter | Drafts sit in `/admin/leads` for 1-click send |
| Daily 7am | GA4 + funnel snapshot | One-pager email: yesterday's traffic, conversions, top pages, anomalies |
| Daily 9pm | Newsletter draft (when issue due) | Already wired (per CLAUDE.md `newsletter-draft` cron) |
| Weekly Mon | Directory outreach batch | 10–20 new prospects emailed via templates |
| Weekly Mon | Pipeline aging report | Stale leads flagged for founder nudge |
| Weekly Fri | SEO content audit | Pages losing rank, opportunities for refresh |
| Monthly 1st | Attribution proof emails to directory subscribers | Auto-sent |
| Monthly 1st | Sponsor performance reports | Auto-sent |
| Monthly 5th | Financial dashboard | Revenue by stream, MoM trend, anomalies |
| Monthly 15th | Trip-anniversary outreach to past clients | Drafts in queue |
| Quarterly | Revenue review + workstream rebalance | Founder reviews + redirects effort |

### Layer 2 — Automated content engine

Recurring SEO + newsletter content production:
- Auto-draft seasonal/month-specific landing-page refreshes (e.g., "Hilton Head in April 2027" auto-updates each year)
- Auto-extract Q&A from itinerary form submissions → blog/FAQ content (with founder approval)
- Auto-curate weekly newsletter from approved content queue

### Layer 3 — Sales engine

- Inbound: Villa Match → Trip Sketch → AI draft → human qualified → quote (60% automated)
- Outbound (directory): prospect → enrich → email → drip → demo book → close (80% automated)
- Renewal: directory churn-risk flagging, win-back templates (100% automated)

### Layer 4 — Dashboards (founder reviews 30 min/day)

- `/admin/dashboard` — daily KPIs across all 5 streams
- `/admin/directory` — directory funnel + retention
- `/admin/leads` — itinerary form pipeline
- `/admin/newsletter` — issue queue + sponsor inventory
- `/admin/purchases` — Stripe revenue (already exists)

---

## Sequencing — what to build first

**90-day plan** to set the engine in motion. After that, the operating cadence carries it.

### Days 1–30 — Foundation
1. **Villa Match quiz** ship (already planned)
2. **Directory paid-tier productization** — define tiers, wire Stripe billing, instrument trial
3. **Affiliate audit** — what's earning, what to drop, what to add
4. **Sponsor inventory dashboard** — make existing sponsor SKUs sellable

### Days 31–60 — Engine
5. **Directory outbound sales engine** — prospect scraping + enrichment + first templated outreach batches
6. **Trip Sketch builder** ship (brainstorm #2)
7. **Attribution proof email** for directory subscribers
8. **Lead first-touch reply drafter** scheduled agent
9. **Financial dashboard** (cross-stream)

### Days 61–90 — Scale levers
10. **AI itinerary draft hand-off** ship (brainstorm #3)
11. **First 2 productized info products** (couples + golf itinerary packs)
12. **Newsletter sponsor inventory** sellable
13. **Scheduled-agent cadence** fully wired (Layer 1 above)

---

## Honest risks

1. **Directory sales engine assumes cold-outbound legality + deliverability** — verify CAN-SPAM, Hilton Head Chamber relationships, and email warming before scaling.
2. **Founder time** is the constraint Workstream A can't escape — productizing intake helps, but 400 trips/yr is still a step-function from 57.
3. **Trip-type page authenticity** — heavy AI-generated content risks Google penalties and brand damage. Every auto-draft needs human approval before publishing.
4. **Subscription churn** in directory — without attribution proof, businesses drop. The proof email is non-optional, not a nice-to-have.
5. **24-month timeline is aggressive.** A more conservative read: $500k at 18 months (B + half-A + C + half-D), $1M at 36 months once compounding kicks in.

---

## What I need from you

**Pick the first workstream to deep-spec next.** My recommendation order:

1. **Workstream B (directory paid-tier)** — highest $ / hour of build, recurring revenue, infrastructure already 80% there. Spec next.
2. **Finish Workstream A (Villa Match → Trip Sketch → AI hand-off)** — already in motion, finish what we started.
3. **Workstream E (info products)** — fastest to revenue, lowest build cost. Easy parallel.
4. **Layer 1 (scheduled agents)** — the operating-cadence backbone. Build incrementally as each workstream needs it.

Or, if you want, I can run the brainstorming arc on each workstream in sequence and assemble a master execution plan covering all 5 streams.
