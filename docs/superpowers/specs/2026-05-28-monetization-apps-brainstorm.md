# Money-Making Apps & Affiliate Plays — Opportunity Map

**Date:** 2026-05-28
**Author:** William Griffith (with Claude Opus 4.8)
**Status:** Brainstorm / pre-design. Pick a track → design doc → `gsd-ultraplan-phase`.
**Purpose:** Answer "what new apps can I add to make money?" grounded in the *actual* HiltonAhead codebase (revenue surfaces, affiliate stack, dormant tools, SEO gaps).

---

## TL;DR

The site is **not** under-monetized in the way it looks. It already runs consulting, a membership, a B2B directory, sponsorship/ad SKUs, $49 info-products, and an 11-program affiliate stack. The money is leaking in three specific places:

1. **You built 9 interactive apps and never shipped them.** They sit in `components/tools/` wired to no route. This is the single highest-leverage, lowest-effort win on the board.
2. **Dining — your #1 traffic vertical — earns $0.** No OpenTable/Resy affiliate, no reservation CTA.
3. **Affiliate cards are deployed on a fraction of high-intent pages.** 6 neighborhood pages + several trip-types have lodging intent and no booking link.

The flashy net-new build (an **AI Trip-Planner Concierge** powered by Opus/Haiku) is real and worth doing — but it should come *after* the dormant apps and leaks are closed, because those pay this month.

---

## 1. Ground truth — what makes money today (LIVE)

| Mechanism | Price | Status |
|---|---|---|
| Compass consultation | $295 one-time | LIVE |
| Charter full-service | $895 + 7% commission | LIVE |
| Heritage ultra-luxury | $2,500 + 10% (sales-led) | LIVE |
| Insider Club | $9/mo · $99/yr | LIVE |
| B2B Directory (Listed/Featured/Signature) | $600 / $1,800 / $4,800 per yr | LIVE |
| Partner tiers (Featured/Curated/Signature) | $1,200 / $4,800 / $12,000 per yr | LIVE |
| Heritage Week partner | $5,000 one-time | LIVE (sales-led) |
| Ad SKUs (Featured Pin / Page Display / Story / Featured Villa) | $249/mo · $495/mo · $895 · $149/mo | LIVE |
| Itinerary Packs (Couples, Golf) | $49 one-time each | LIVE |
| **Affiliates (11 programs)** | commission | **Infra LIVE, under-deployed** |
| Newsletter sponsorship | TBD | STUBBED |

Affiliate programs registered (`data/affiliateLinks.ts`): Booking.com, Expedia, Vrbo, Viator, GetYourGuide, GolfNow, Amazon, Marriott Bonvoy, Allianz, Hertz, Peter Millar. Per-surface attribution is sophisticated (Amazon per-surface tags; Partnerize `pubref` on Expedia/Vrbo). FTC `rel="sponsored nofollow"` enforced. Admin analytics at `/admin/affiliates`.

**Takeaway:** infrastructure is best-in-class. The problem is *deployment + coverage*, not plumbing.

---

## 2. The unlock — 9 apps you already built and never shipped

All in `components/tools/`, wired to **no public route**:

| Component | What it does | Money surface it becomes |
|---|---|---|
| `TideForecast` | NOAA tide data (Fort Pulaski), 7-day | `/hilton-head-tides` — peak "planning now" intent; newsletter capture + Allianz/Booking "lock a refundable stay" card |
| `TeeTimeFinder` | Tee-time search by date/daypart/access | `/hilton-head-tee-times` — **GolfNow affiliate already registered** |
| `CourseMatchQuiz` | Golf course recommender (handicap/scenery/budget) | Lead magnet on tee-time page → GolfNow + email capture |
| `StayAndPlayEstimator` | Golf + lodging package cost | `/hilton-head-stay-and-play` — Booking/Vrbo + GolfNow |
| `TripWindowFinder` | Best-month-to-visit picker | `/best-time-to-visit-hilton-head` money page → lodging affiliate |
| `LiveWeather` | Current conditions | Embed on `hilton-head-weather/*` → Amazon gear + Allianz |
| `HurricaneStatus` | Storm/safety status | Embed on weather pages → Allianz "refundable stay" |
| `HeritageCountdown` | RBC Heritage 2027 countdown | On `/guides/2027-rbc-heritage` (already a revenue surface) |
| `CourseMap` | Interactive course browse | On tee-time / golf hub |

**Effort:** route + page shell + lead/affiliate wiring per tool. Days, not weeks. **This is the literal answer to "what apps am I missing": you're missing the routes, not the apps.**

---

## 3. Money leaks (high revenue, medium effort)

- **Dining ($0 today).** Add `opentable` to `data/affiliateLinks.ts` (OpenTable runs Impact/CJ affiliate); render a reservation CTA on `/local/restaurants` cards and the dining tier-list posts. Viator "food tours" cards as a secondary capture. *#1 traffic vertical, currently a monetary dead-end.*
- **Lodging aggregator pages (don't exist).** The highest-commercial-intent format — exact-match transactional queries → Booking/Vrbo deeplink on every row:
  `/hilton-head-resorts`, `/best-hilton-head-vacation-rentals`, `/hilton-head-villas-with-private-pool`, `/pet-friendly-hilton-head-rentals`, `/hilton-head-condos-on-the-beach`. Powered by existing `getLodgingBusinessSchema` + `getItemListSchema`.
- **Neighborhood + trip-type affiliate gaps.** 6 neighborhood pages (`/hilton-head/[slug]`) and `beaches` / `winter-rental` trip-types render no affiliate card despite prime "book a villa here" intent.
- **New affiliate programs to add:** Airbnb, Hilton Honors (sister brand to Marriott; on-island properties), OpenTable. Then: REI/golf-equipment (Callaway, GolfDiscount) for golf-intent pages; WorldNomads/SafetyWing alongside Allianz.
- **Affiliate ROI dashboard / fulfillment.** Clicks log to `affiliate_events` but there's no payout-reconciliation view — you can't yet see which *pages* earn. Per-surface `pubref` is already captured; surface it.
- **Compliance:** add a site-wide disclosure (currently per-component only); cover local directory + newsletter if affiliate links go there.

---

## 4. Net-new flagship — AI Trip-Planner Concierge (the "Opus 4.8" hook)

A conversational planner embedded site-wide, powered by Claude (Haiku for cheap turns, Opus for the final itinerary), **grounded in your own content** (directory, neighborhoods, golf courses, events, affiliate inventory).

- **Flow:** visitor chats trip intent → concierge builds a day-by-day itinerary → **captures the lead into the CRM** (`itinerary_requests`) → recommends **affiliate** lodging/tours/tee-times inline → upsells the **$295 Compass** or **$49 packs** as the "done-for-you" version.
- **Why it fits:** the site is already engineered for LLM citation (`llms.txt`, speakable, schema). An on-site concierge is the natural conversion layer and a genuine differentiator vs. static competitors.
- **Monetization stack in one feature:** lead-gen + affiliate + product upsell + Insider Club funnel.
- **Build:** real (streaming chat, retrieval over `data/`, tool-calls to affiliate link builder + lead insert, rate-limiting/abuse guard, cost controls). High effort, high payoff. Use prompt caching on the grounding corpus.

---

## 5. New content clusters (lead-gen LTV)

- **Relocation / real-estate cluster** — highest LTV on the site (realtor referral fees are $1,000s). One thin page today (`/move-to-hilton-head`). Build: `/cost-of-living-hilton-head`, `/best-neighborhoods-to-live-hilton-head`, `/retiring-in-hilton-head`, `/hilton-head-vs-bluffton-to-live`, `/hilton-head-vs-savannah-living`. Reuse the comparison engine with a "to live" framing.
- **Tours/experiences money pages** — Viator + GetYourGuide registered but only in blog/directory. Build `/hilton-head-things-to-do`, `/hilton-head-dolphin-tours`, `/hilton-head-boat-tours`, `/hilton-head-fishing-charters`.
- **More "vs" comparisons** — `/hilton-head-vs-st-simons`, `/hilton-head-vs-isle-of-palms`, `/hilton-head-vs-destin`, `/hilton-head-vs-amelia-island`. (Comparison engine is your best-converting format.)
- **Wedding deepening** — Lowcountry wedding lead-gen; high-value leads, existing `/hilton-head-weddings` surface.

---

## 6. Quick SEO/GEO wins (hours — fold in regardless of track)

- **Sitemap:** add `/itinerary-packs/[pack]` (the **$49 paid products are not indexed**), `/move-to-hilton-head`, `/sell-or-rent-your-villa`. (`app/sitemap.ts`)
- **SearchAction:** re-add `potentialAction` to `getWebSiteSchema()` — `/search` shipped, so the sitelinks searchbox is now safe. (`app/lib/metadata.ts`; update stale `CLAUDE.md` note.)
- **TLDR / QuickFact deployment:** render `.tldr-block` + `.quick-fact` on 32+ blog posts and trip-type pages (`components/PostBody.tsx`, `TripTypeLanding.tsx`). This is the **#1 GEO citation lever** and it's dormant on nearly every long-form page.
- **Entity/local signals:** populate `brand.social` (≥1 claimed profile) and `brand.contact.phone`; start collecting real reviews via the CRM for `AggregateRating` stars.

---

## 7. Ranked opportunity menu (revenue × ease)

| Rank | Play | Revenue lever | Effort | Why now |
|---|---|---|---|---|
| 1 | **Ship the 9 dormant tools** as routes w/ lead + affiliate capture | affiliate + lead + traffic | **S** | Already built; literal answer to "missing apps" |
| 2 | **Dining monetization** (OpenTable + reservation CTAs) | affiliate | S | #1 traffic vertical earning $0 |
| 3 | **Neighborhood/trip-type affiliate cards** | affiliate | S | Lodging intent already ranking, no link |
| 4 | **Lodging aggregator pages** | affiliate | M | Highest-commercial-intent format missing |
| 5 | **Quick SEO/GEO wins** (sitemap, SearchAction, TLDR) | index + citations | XS | Pure config; compounds everything |
| 6 | **AI Trip-Planner Concierge** | lead + affiliate + upsell | L | Flagship differentiator; the Opus 4.8 play |
| 7 | **Relocation/real-estate cluster** | referral fees (highest LTV) | M | Untapped, highest $/lead |
| 8 | **Tours/experiences + more "vs" pages** | affiliate | M | Reuse strongest formats |

---

## 8. Recommended sequencing (if it were my call)

- **Sprint 1 (this week):** #5 quick wins (hours) + #1 ship dormant tools (start with **tides** and **tee-times** — highest intent, GolfNow already wired).
- **Sprint 2:** #2 dining + #3 neighborhood/trip-type affiliate cards + new programs (Airbnb, Hilton Honors, OpenTable). Affiliate ROI dashboard.
- **Sprint 3:** #4 lodging aggregator pages.
- **Sprint 4+:** #6 AI Concierge (flagship), then #7 relocation cluster.

---

## 9. Open decisions (need from William)

1. **Which track first?** (drives the design doc + `gsd-ultraplan-phase`)
2. **Affiliate accounts:** which programs are *approved with live IDs* right now vs. need application? (Airbnb / Hilton Honors / OpenTable status?)
3. **AI Concierge appetite:** build it now as the flagship, or sequence it after the cheap wins land?
4. **Revenue posture:** optimize for *fastest cash this month* (affiliate/dining/tools) vs. *biggest moat* (AI concierge + clusters)?

---

*Next step: pick a track → I write the design doc for it → route into `gsd-ultraplan-phase`. The quick SEO/GEO wins (#5) I'll fold in regardless since they're hours of config and compound every other play.*
