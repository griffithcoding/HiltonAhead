# Traveler Tools — Legitimacy Audit + Monetization Playbook

**Date:** 2026-05-20
**Scope:** Restaurant Hub · Today on Hilton Head · Visitor Heat Map
**Status:** Operational reference — read before going to market.

This doc has two halves:

1. **Legitimacy audit** — what could go wrong legally, what we already mitigate, what to watch
2. **Monetization playbook** — how to actually sell the data products via social / email / print / SEO

---

## Part 1 — Legitimacy audit

### Restaurant Hub

| Risk | Mitigation in spec | Residual exposure |
|---|---|---|
| Menu scraping = copyright issue | We **link out**, never scrape. `menuUrl` is a one-line founder pick + editorial note. Non-goal explicit. | Zero. |
| Google Places photos | Non-goal: do not host or cache Google Places photos. Photo gallery is founder-shot + owner-submitted only. | Zero, IF founder discipline holds at upload time. |
| Owner-submitted photos w/o license | Portal upload flow has founder approval gate before publish. Reject anything ambiguous. | Low — review queue is the safety. |
| "Featured Partner" badge implying endorsement | Existing `featured: boolean` is editorial — founder picks. No FTC issue because it's the *founder's* opinion, not a paid placement misrepresented. | Watch: if Featured ever becomes paid-tier-auto (it shouldn't), add disclosure. |
| Sponsor slot misread as editorial | Each sponsor block has visible "Sponsored by X" label + `aria-label="Sponsored content"`. Editorial separation is explicit. | FTC-clean if labels stay visible. |
| AI-drafted FAQs hallucinating | Founder approval gate before publish (`approved: false` default). Drafts never leak to prod. | Low — founder must hold the line during onboarding. |
| Outbound affiliate links (OpenTable, etc.) | When wired in v1.1, must add affiliate disclosure footer per FTC 16 CFR Part 255. | **TODO**: when affiliate links go live, add a disclosure component. Not v1 yet. |
| Tracking outbound clicks | Already hashed IPs; events table is private (RLS); no PII surfaced. | Zero. |

### Today on Hilton Head

| Risk | Mitigation | Residual |
|---|---|---|
| OpenWeather ToS — must attribute "Weather data by OpenWeather" | Add attribution to the WeatherPanel: small "Weather: OpenWeather" line | **Add during build.** Not currently in the spec — easy fix. |
| NOAA Tides/Buoys/NWS ToS — public domain, but `api.weather.gov` requires identifying `User-Agent` | Spec already specifies `User-Agent: "HiltonAhead/1.0 (hello@hiltonahead.com)"` on every NWS call | Zero. |
| Suncalc.js — MIT licensed, no attribution required | None needed | Zero. |
| Sponsor slot misread as editorial | Same as Restaurant Hub — "Sponsored by" label always visible | Zero. |
| Stale data harming users (someone trusts a 6h-old wind reading) | Each panel shows "Last updated X min ago"; failure UI shows when data is unavailable | Low — explicit honesty about freshness. |
| OpenWeather rate-limit exceeded (free tier 1000/day) | Spec calc: ~120 calls/day at 30min revalidate. Well under. | Zero unless traffic spikes 5x — paid tier is $40/mo. |
| Beach access / closures / mosquito index — DEFERRED for legit reasons | Spec explicitly defers anything without a reliable public feed | Zero. |

### Visitor Heat Map

| Risk | Mitigation | Residual |
|---|---|---|
| Tracking individual users (CCPA/GDPR) | We never store PII. IP hashed SHA-256 with `SUPABASE_SERVICE_ROLE_KEY` salt — irreversible without the salt | Zero. |
| Exposing one subscriber's data to another | Paid aggregation scopes raw clicks to subscriber's own `business_id`s; competitor data shown only as neighborhood aggregates | Zero, IF the `business_owners` ownership table is correctly populated. **Audit during build.** |
| CSV export including PII columns | CSV is hardcoded to 5 columns: `occurred_at_iso, business_id, business_name, event_type, industry_slug`. Test asserts `ip_hash`, `user_agent`, `referrer` are NOT in the export | Zero. |
| Public choropleth revealing individual businesses' performance | Public version aggregates by neighborhood only — no per-business detail. Test asserts this | Zero. |
| Anti-competitive / "competitor surveillance" framing | We surface competitor data only as neighborhood AVERAGES, never individual rival's clicks. Frame in copy as "industry benchmark." | Low — keep the copy tight. |
| Misrepresenting source ("our data shows 50,000 visitors") | Public + paid pages must NOT call this "tourist data" or "visitor traffic" — it's *click traffic on this website*. Headlines reflect this. | **Action item:** double-check every headline + tagline before launch. |
| Selling raw data to third parties | Privacy disclosure explicitly states "we do not sell raw event data" | Zero if held. |
| Data freshness honesty | "Updated hourly" / "last updated X ago" stamps everywhere | Zero. |

### Cross-cutting

| Risk | Mitigation |
|---|---|
| Marketing claims of accuracy | Restaurant Hub: "founder's editorial pick" — opinion, not fact. Today dashboard: data sources cited per panel. Heat map: explicit about being "click traffic on hiltonahead.com" not "tourist density." |
| Brand authenticity / "feels like an ad farm" | Editorial voice non-negotiable. Founder review prose, "What I'm doing today," sponsor-slot copy founder-written |
| Trademark / business name issues | Reuse business name only as it appears in the founder's existing review; don't generate names |
| ADA / WCAG | All three specs include a11y as v1 scope (axe-core in Playwright) |
| State-level privacy laws (Virginia VCDPA, Colorado CPA, etc.) | None triggered because no PII collected. Privacy policy already in place |

**Verdict:** all three tools ship legally clean as specified. **One concrete action item:** add OpenWeather attribution to the Today dashboard during build (one-line "Weather: OpenWeather" in WeatherPanel — small fix).

---

## Part 2 — Monetization playbook

### Pricing summary (recap from specs)

| Product | Tier | Price | What's included |
|---|---|---|---|
| Directory paid tier — Lean | Lean | **$99/mo** | Featured badge + Restaurant Hub deep page + Heat Map lean v1 |
| Directory paid tier — Standard | Standard | $249/mo | Lean + heat-map custom date range + industry filter + sortable columns *(v1.1)* |
| Directory paid tier — Premium | Premium | $499/mo | Standard + hourly distribution + competitor comparison + weekly emailed PDF *(v1.2)* |
| Sponsor slot — Restaurant Hub page | — | $49–249/mo | One sponsor slot on a non-Featured restaurant deep page |
| Sponsor slot — Today on Hilton Head | — | $249–499/mo | One above-fold sponsor on the daily-return dashboard |

### Channel 1 — Email (cold outreach to local businesses)

**Target list:** Hilton Head + Bluffton restaurants, golf operators, spas, charter captains. ~150–300 prospects.

**Sequence (5-touch over 3 weeks):**

| # | Day | Angle |
|---|---|---|
| 1 | 0 | Heat-map data point: *"Last week, 14 of our readers clicked your restaurant. None of them called. Want to see what's happening at your page?"* |
| 2 | 4 | Restaurant Hub teaser: *"We just rebuilt your directory page with a founder review + your menu + reservation links — sample link attached. Free."* |
| 3 | 10 | Competitor framing: *"Sea Pines restaurants averaged 60 clicks per business last week. You got 14. Here's the dashboard that shows why."* |
| 4 | 16 | Calendly: *"15-min walkthrough? I'll show you the data live."* |
| 5 | 21 | Last touch: *"Last note — I'll stop pinging. If you ever want the dashboard, it's $99/mo and you can cancel anytime."* |

**Template files** to add to the codebase (v1.1): `data/outreach-templates/heat-map-cold.ts` — versioned cold-email copy. (Out of scope for the 3 tools; flagged as a follow-up.)

**Volume:** 25 sends/week on personalized outreach (founder-driven). 4-week ramp = 100 prospects through the sequence. Industry benchmark conversion: 1–3% — target 1–3 paid signups per month from outbound alone.

### Channel 2 — Social (X / Threads / LinkedIn for the founder)

**Goal:** brand authority + organic discovery — not direct conversion.

**Cadence:** 2–3 posts/week, founder-voiced.

**Content angles:**

1. **Weekly heat-map screenshot** — "Where Hilton Ahead readers clicked this week. Palmetto Dunes back on top." Embed `/hilton-head-heat-map` URL.
2. **Today dashboard moment** — sunset photo + "Today's sunset window opens at 7:48pm in Harbour Town. The dashboard told me." Link `/today-on-hilton-head`.
3. **Restaurant Hub deep dive** — "Why I link to Skull Creek Boathouse's PDF menu, not their Yelp page." Editorial founder voice. Link the restaurant page.
4. **Behind-the-scenes** — "Today I added a sponsor slot to the Salty Dog's page. Here's how the math works." Pricing transparency = trust.
5. **Data observations** — "Wednesday lunches are spiking. Anyone else noticing this?" Engagement bait that doubles as soft sales for the heat map.

**Distribution:** founder personal X/LinkedIn → Hilton Head Chamber of Commerce LinkedIn → local FB groups (with mod permission). NOT paid social — yet.

### Channel 3 — Newsletter (existing pipe)

The existing newsletter (per `CLAUDE.md` newsletter subsystem) is the highest-converting channel because the audience already trusts the brand.

**Weekly issue structure post-launch:**

- Lead story (editorial, as today)
- **New: "This week on Hilton Head" data block** — top neighborhood by clicks (heat-map data), most-viewed restaurant (Restaurant Hub data), tide highlight (Today dashboard)
- Sponsor slot (sold)
- Founder note
- 1 CTA

**Sponsor pricing for the new data block:** $1,500–3,000 per issue (24 issues/year × ~$2,000 = $48k/year revenue line item).

### Channel 4 — Print / collateral

Hilton Head has a real "print collateral" economy — concierge desks, visitor centers, real-estate offices. One-pagers work here.

**One-pager: "Hilton Ahead Directory — for local businesses"**

| Section | Content |
|---|---|
| Header | "We send Hilton Head travelers to your door. Then we show you the proof." |
| Three columns | Restaurant Hub screenshot · Heat Map dashboard screenshot · Today dashboard screenshot |
| Three bullets | "Editorial review, your menu, your hours — built for travelers" / "See exactly who clicks you, when, from where" / "Sponsor the daily-return page where travelers plan dinner" |
| Pricing | Lean $99 · Standard $249 · Premium $499 · Sponsor slots from $49 |
| Founder photo + signature | "Run by William Griffith, locally based on Hilton Head Island" |
| CTA | "hiltonahead.com/local/get-featured · hello@hiltonahead.com" |

Print on demand (Vistaprint or local printer): 500 copies at ~$0.25 ea = $125. Drop 10/week at concierge desks and local chamber events. **Easy ROI** at one $99/mo signup.

### Channel 5 — SEO / Content

Public-facing assets that draw inbound traffic which converts to directory signups.

**Top 5 SEO targets to write blog posts AROUND once the tools ship:**

1. *"Where are tourists right now on Hilton Head?"* → links to `/hilton-head-heat-map`
2. *"Best time to go to the beach on Hilton Head this week"* → links to `/today-on-hilton-head`
3. *"Hilton Head dinner reservations: which platform actually has tables"* → links to a few Restaurant Hub deep pages
4. *"Hilton Head visitor demographics in 2026 — what the data says"* → publishes anonymized heat-map aggregates as the citation source
5. *"Why I tell Hilton Head business owners to skip Yelp and own their directory listing"* → founder-voice pitch for the directory paid tier

Each post is ~1,000–1,500 words, founder-written, internal-links to the tools.

### Channel 6 — Cross-tool integration (compounding)

The three tools amplify each other when linked together properly:

| Surface | Cross-link to add |
|---|---|
| Restaurant Hub deep pages | Footer block: *"See where Hilton Head visitors cluster → /hilton-head-heat-map"* |
| Today on Hilton Head | Below the founder note: *"Where readers cluster this week → /hilton-head-heat-map"* |
| Visitor Heat Map (public) | CTA block: *"Plan today's beach window → /today-on-hilton-head"* + *"See the best restaurants on the island → /local/restaurants"* |
| Itinerary form (existing) | Question: *"Want today's dashboard emailed daily during your trip?"* — opt-in newsletter signup |
| Newsletter | Every issue features one Restaurant Hub deep page + one Today dashboard tip + one heat-map observation |
| Villa Match (specced separately) | Results page: *"See where other guests cluster → /hilton-head-heat-map"* |
| Trip Sketch (specced separately) | After save: *"Restaurants in your sketch — see the latest reviews → /local/restaurants/[slug]"* |

### Sales motion — directory paid tier signup flow

1. **Awareness** — cold email + social + print + organic SEO drives prospect to `/local/get-featured`
2. **Education** — `/local/get-featured` page explains the three pillars: directory page + heat-map dashboard + (sponsor inventory option). Shows pricing matrix.
3. **Demo** — 15-min Calendly call with founder. Live walkthrough of the heat-map dashboard against the prospect's own business (if claimed).
4. **Trial** — 14-day free trial via Stripe (auto-bills at end). Friction = entering card.
5. **Onboarding** — automated welcome email + manual founder check-in at day 3 + day 12
6. **Retention** — monthly attribution-proof email auto-sent: "You got X clicks last month from Hilton Ahead. Your CSV is attached."

**Target conversion:** 3–5 paid signups/month from all channels combined in months 1–3. Scale to 10–15/month by month 6 once the attribution-proof emails start driving word-of-mouth.

### KPIs and review cadence

| Cadence | Metric | Target by month 3 | Target by month 6 |
|---|---|---|---|
| Daily | New directory trial starts | 1+ | 2–3+ |
| Weekly | Heat-map dashboard MAU among paid subs | 50% | 70% |
| Weekly | Newsletter sponsor slot sold | 50% of issues | 75% of issues |
| Monthly | New paid subscribers | 3–5 | 10–15 |
| Monthly | Sponsor revenue (Restaurant Hub + Today dashboard) | $250 | $1,500 |
| Monthly | Churn rate | < 8% | < 5% |
| Quarterly | Total directory MRR | $1,500 | $7,500 |
| Quarterly | Total monthly site revenue (all streams) | $5k–$10k | $15k–$25k |

### What NOT to do

1. **Don't sell the heat map as "Placer.ai for Hilton Head."** Different data category. Position as *"locally curated click attribution"* — be honest about what it is and what it isn't.
2. **Don't run paid Google/Facebook ads** until organic + cold outbound is fully ramped. Wasted spend at this stage.
3. **Don't discount the directory paid tier** below $99/mo. Anchoring matters; race-to-the-bottom kills the perceived value.
4. **Don't oversell competitor data.** The heat map shows neighborhood aggregates of competitors, not raw rival clicks. Position this as a *privacy feature*, not a limitation.
5. **Don't promise SEO outcomes** to businesses. Position the value as data + visibility — let SEO be a bonus, not a guarantee.

---

## Summary — sequenced 90-day go-to-market

| Days | Workstream |
|---|---|
| 1–14 | Ship Restaurant Hub (already planned) |
| 15–28 | Ship Today on Hilton Head dashboard (already planned) |
| 29–45 | Ship Visitor Heat Map v1 (already planned) |
| 46–55 | Add OpenWeather attribution, founder-approved FAQ entries, hand-trace polygon corrections, audit photos |
| 56–60 | Print 500 one-pagers; staff 5 concierge desks; mail 30 prospects to start cold-outbound list |
| 61–75 | Launch newsletter "This week on Hilton Head" data block; sell first sponsor slot |
| 76–90 | First quarterly review: pricing tier adoption, churn, sponsor fill rate, KPI dashboard |

**Net cumulative revenue target at day 90:** $5,000–$10,000 MRR across directory paid tier + sponsor slots + affiliate.

**That's a real path. Ship the tools, then sell the data.**
