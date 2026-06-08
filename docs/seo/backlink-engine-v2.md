# Backlink Engine v2 — Strategy

**Date:** 2026-06-08
**Supersedes:** the v1 Resource-Swap Backlink Engine (memory `project_seo_outreach_engine.md`, `docs/heritage-outreach.md`).
**Status:** strategy locked, engine changes pending.

---

## TL;DR

v1 built the *machinery* (CRM, email engine, CAN-SPAM, chamber scraper, swap templates) and the *thesis* (the directory is the carrot for 2-way link swaps). The machinery is good. The thesis is half a strategy.

v2 fixes the half that's missing: **v1 has no concept of which page a link should point at, and no concept of which prospect is worth pitching first.** It sprays links at "a relevant page" from whatever chamber member answers. v2 aims every link at a ranked-by-impact target page, sourced from a ranked-by-authority prospect list, and adds a second motion — pitching our own data/tools as linkable assets — so we earn editorial links instead of only bartering listings.

Five changes, ranked by leverage:

1. **Striking-distance target map** — aim links at pages ranking #8–20, not at random.
2. **Source ladder** — break the 40-member chamber ceiling with 6 more source types.
3. **DR-gate + score prospects** — work the high-DR targets first; stop burning sends on DR-8 swaps.
4. **Linkable-asset PR motion** — pitch the tide/weather/beach-day data, not the directory listing.
5. **Anchor-text policy** — supply 2 suggested anchors per target; hold a safe ratio.

---

## 1. The authority gap (real data)

Ahrefs free Domain Rating, pulled 2026-06-08:

| Domain | DR | Role in our SERPs |
|---|---|---|
| travel.usnews.com | 91 | National authority, owns page 1 |
| hiltonhead.com | 48 | "Official travel guide" — the brand-confusion twin of our domain |
| hiltonheadisland.com | 43 | Official destination/tourism site |
| hiltonheadrv.com | 33 | RV-park blog that still outranks us |
| coastalvacationshhi.com | 8 | **Weakest competitor currently on page 1 for "best time to visit"** |
| **hiltonahead.com** | **0** | Us |

**What this proves.** The best-time page sat on page 4 with the on-page work already shipped (titles, schema, the cannibalization consolidation) yet a DR-0 domain facing DR-43–91 competitors. On-page was necessary and is done; it is not sufficient. Link authority is the **primary** remaining variable — not provably the *only* one. If authority climbs over the next quarter and the page still won't move, the fallback is a content / relevance / E-E-A-T re-audit (§9), not more links.

**The reframe.** We are not trying to out-authority USNews (DR 91). The realistic near-term bar is the *weakest page-1 competitor*, `coastalvacationshhi.com` at **DR 8**. Two facts make this winnable:

- Google ranks a *specific page* on its own URL Rating + relevance, not the domain's DR. So the real job is earning links **to the specific target page**, from **topically-relevant** sources — domain DR follows as a byproduct. A DR-40 link from an off-topic site is worth less than a DR-20 link from a travel/Lowcountry site.
- DR is an Ahrefs *proxy*, not a Google ranking factor — a directional gauge, not a promise. As a rough industry heuristic, ~15–25 relevant referring domains moves a cold domain off DR 0 into the low teens, but the velocity depends on link quality and relevance, not count.

The first 10 real, relevant links matter more here than the next 100 will. Moving off DR 0 is the single highest-leverage authority move this quarter — but see §8 for an honest, phased timeline. Authority is the variable we can *control*; ranking is the *result* we hope for, and §9 says what to do if authority climbs but rank doesn't.

> **Plan-tier note.** The connected Ahrefs account does **not** include API v3 access (only the free DR endpoint resolves; Site Explorer returns "Insufficient plan"). The competitor *referring-domain gap list* — the highest-value input to this strategy — must therefore be pulled from the Ahrefs **web UI** (Site Explorer → Competitors / Link Intersect) and pasted into the engine, or unlocked with an API add-on. Until then, treat the prospect lists below as seeded from manual research, not API automation.

---

## 2. Change 1 — the striking-distance target map (highest leverage)

**Problem in v1.** Templates use `{our_url}` as a free variable. Nothing decides which URL to push. A link to a page already top-5 is largely wasted; a link to a page buried past ~30 is wasted until its content earns relevance; a link to a page in the **striking zone (~#5–30)** with genuinely competitive on-page is where a relevant link does the most work. v1 is blind to this. (Caveat: a mid-SERP stall can also be a content/relevance gap, not a link gap — confirm the page's on-page is actually competitive before spending links on it.)

**v2 rule.** Maintain a ranked **target-page map**. Every outreach opportunity is assigned a target URL *before* the first send, chosen from this map. No link goes to "the homepage" or "whatever's relevant" by default.

**How to build it (you run this in GSC — we don't have GSC API here):**

1. GSC → Search results → last 3 months → filter to **Average position ~5–30**.
2. Sort by Impressions descending — high-impression, mid-position pages have the most upside per relevant link.
3. Drop anything already top-5 (don't waste links). For pages past ~30, check whether the on-page is genuinely competitive; if not, that's a content task, not a link task.
4. The result is the priority target list. Re-pull monthly. Ranking in this vertical is volatile (seasonal + update churn), so page-1 wins aren't permanent — keep a maintenance trickle to defended pages as competitors refresh.

**Seed targets (known, pre-GSC-pull):**

| Priority | Target URL | Why | Suggested anchors |
|---|---|---|---|
| 1 | `/best-time-to-visit-hilton-head` | Just consolidated + on-page-optimized; DR/URL-Rating is the only missing input; high commercial intent | "best time to visit Hilton Head", "when to visit Hilton Head" |
| 2 | `/hilton-head-weather` + `/hilton-head-weather/[month]` | 12-page cluster, informational top-of-funnel, easy editorial link target | "Hilton Head weather by month", "Hilton Head weather in [month]" |
| 3 | Golf money pages (`/hilton-head-golf-packages`, `/hilton-head-golf-courses`, `/hilton-head-stay-and-play`, `/hilton-head-tee-times`) | High-ticket intent, links convert to revenue | "Hilton Head golf packages", "Hilton Head golf trip" |
| 4 | Neighborhood guides (`/hilton-head/[slug]`) | Long-tail, link-earnable from local businesses in that neighborhood | "[Neighborhood] Hilton Head guide" |
| 5 | The interactive tools (tide, beach-day, itinerary) | Linkable assets — see Change 4 | tool name as anchor |

**Engine change required.** `outreach_opportunities` **already has a `target_url` column** (migration `007_outreach_crm.sql`) — it's just not enforced in the UI. So the migration adds only **`target_priority smallint`**, and the app change is making `/admin/outreach/new` + the compose step *require* picking a `target_url` from the map. (Migration **`026_outreach_target_priority.sql`** — verified next free number; `024` and `025` are already taken by `lead_email_engine` and `market_trends`.)

---

## 3. Change 2 — the source ladder

**Problem in v1.** One source: `hhi-chamber`. The chamber publishes **zero** member emails (hidden behind a contact form), so the scraper yields ~40 accounts with blank emails; a separate post-import enrich crawl recovers emails that exist on the members' own websites (~60% in practice) → roughly ~24 reachable per run. That is a trickle, and it's all one prospect *type* (local businesses, mostly low-DR).

**v2 source ladder** — ordered by link value, not ease:

| Tier | Source | Link type | DR band | Notes |
|---|---|---|---|---|
| A | **Competitor referring-domain gap** (Ahrefs Link Intersect: who links to hiltonheadisland.com + hiltonheadrv.com + coastalvacationshhi.com but **not** us) | resource_page, niche_edit | 20–60 | Highest value. Requires Ahrefs web UI export (API is plan-gated). These sites already link to HHI content — proven linkers. |
| A | **"Best of Hilton Head" listicles & roundups** (search `"things to do in Hilton Head" + (resources OR links OR guide)`) | resource_page | 20–50 | Pages whose entire job is to list links. Add-me pitch. |
| B | **Local .gov / .org / tourism boards** (Beaufort County, SC tourism, Visit Beaufort, Lowcountry CVB) | resource_page | 40–70 | High trust. Slow but durable. |
| B | **Unlinked brand-mention reclamation** (search `"Hilton Ahead" -site:hiltonahead.com`; convert mentions to links) | niche_edit | varies | Cheapest possible link — they already wrote our name. |
| B | **Digital PR / journalist** (HARO successor "Connectively"/Featured, regional travel writers) | digital_pr | 50–90 | A primary path to DR 50+ links — not the only one (tourism boards, state travel guides, and regional media also yield DR 30–70). Platforms are saturated; reply rates are low. Pairs with Change 4. |
| C | **Chamber + local business** (v1's existing source) | partnership/swap | 5–25 | Keep, but demote. Volume filler, not the spine. |
| C | **Wedding / vacation-rental vendors** (existing swap templates) | partnership/swap | 5–30 | Keep for the directory-carrot swap. |

**Engine change.** `scripts/outreach/sources/` currently holds one adapter (`hhi-chamber.ts`). Add adapter stubs for the automatable tiers: `roundup-serp.ts` (SERP-scrape "best of" listicles), `brand-mentions.ts` (mention reclamation via SERP). Tiers A-Ahrefs and B-PR are manual-research-fed (operator pastes a CSV in the existing import format) — no scraper, but they ride the same CRM.

---

## 4. Change 3 — DR-gate and score prospects

**Problem in v1.** The `outreach_accounts` table *has* a `domain_rating` column. Nothing populates or sorts by it. So a DR-8 caterer and a DR-50 magazine sit in the same undifferentiated queue, and the operator works whoever's on top. The chamber scraper's `CATEGORY_IDS` is empty → unfiltered → random quality.

**v2 rule.** Every prospect gets a DR before it enters the send queue. The queue sorts by DR descending **within a topical-relevance band** — relevance first, then DR. An on-topic DR-20 travel/Lowcountry site beats an off-topic DR-40 site; a few relevant high-DR links out-perform a pile of low-DR or off-topic ones. Work the relevant-and-high-DR quadrant first.

**How (given the plan-tier limit):**

- DR for any single domain is free via the public endpoint we used above — so the engine *can* populate `domain_rating` one prospect at a time at zero unit cost.
- **Engine change:** in the import action (`app/admin/(gated)/outreach/import/actions.ts`), call the free DR endpoint per imported domain and store it on `outreach_accounts.domain_rating`. Sort the opportunity queue by it.
- Set a floor: **deprioritize (don't delete) DR < 10** unless the link is a directory-carrot swap where the relationship has independent value (a real partner who sends referral business).

---

## 5. Change 4 — the linkable-asset PR motion (the move v1 missed)

**Problem in v1.** Every pitch asks for something (a link) in exchange for a favor (a free listing). That caps us at people who run a website *and* want a directory listing — a small, low-DR pool. It never earns a link from a journalist or a high-DR blog, because we're offering them a listing they don't want.

**v2 insight.** We already own genuinely citable assets that other sites have a *reason* to link to without any swap:

- **Hilton Head water-temperature-by-month dataset** (already on the best-time page) — travel writers cite "what's the water temp" constantly.
- **Live tide chart** (`/hilton-head-tides`) — embeddable, useful, the kind of utility people link to.
- **Beach Day Planner / Itinerary Builder** — interactive tools are link magnets when a roundup needs "a helpful tool."
- **30-year NOAA-based monthly climate table** — a clean data table is the single most-linked content format in travel.

**v2 motion.** Pitch the *asset*, not the listing. Two plays:

1. **Data citation pitch** — to travel writers / bloggers writing Hilton Head pieces: "We maintain a free month-by-month water-temp + crowd dataset for HHI — cite it if useful, here's the page." No swap, no ask beyond attribution. This is what gets DR 50+ links.
2. **Embeddable widget** — offer the tide chart / beach-day planner as an `<iframe>` embed. **Compliance guardrail:** the embed must **not** hard-code a mandatory followed backlink as a condition of use — Google treats forced/widget links as a link-scheme violation. Instead: the iframe *content itself* shows a visible "Powered by Hilton Ahead" attribution (the iframe is the link, which is fine), and any link in the **host page's** HTML is **optional and `rel="nofollow"`-suggested**, added by the publisher's choice. The value here is brand + referral traffic + in-iframe attribution; treat any earned dofollow link as a bonus, not the mechanism.

**Engine change.** New template family in `lib/outreach/templates.ts`: `asset_data_citation` and `asset_widget_embed`. For link typing, **reuse the existing `digital_pr` enum value** for data-citation/editorial links; add one new value **`embed`** to `outreach_link_type` via `ALTER TYPE ... ADD VALUE` (migration `026`). The embeddable variant of `TideForecast` / `BeachDayPlanner` is its own frontend spec — and must follow the no-forced-link guardrail above.

---

## 6. Change 5 — anchor-text policy

**Problem in v1.** Templates tell the publisher "whatever anchor feels right." Safe against over-optimization, but it forfeits the partial-match equity that helps a money page, and it produces an unmanaged anchor profile.

**v2 policy.**

- Supply **2 suggested anchors per target** (see the target map table) — one partial-match, one branded/natural. **Offer, never orchestrate.** Let the publisher use their own words; templated, coordinated anchors across many sites are themselves the risk signal.
- The real 2025 penalty trigger is an **unnatural pattern** — e.g. an exact-match-heavy profile on a domain with almost no brand searches — not a missed ratio. So at DR 0, skew early links **branded / natural / URL**, and let exact- and partial-match accrue organically as real publishers choose them. Relevance of the linking page beats anchor wording.
- Track the actual anchor used per placement in the CRM (the `outreach_activity` "link placed" event captures it) so the *pattern* is observable rather than guessed.

---

## 7. The unfair-carrot swap (v1, kept and tiered)

The directory-listing swap is still valid — it's a real 2-way value exchange and the carrot is genuinely unfair (no national competitor has an attribution-tracked local directory). v2 does not kill it; it **demotes it to Tier C** and **tiers the offer**:

- **Standard swap** (DR < 25 local business): free directory listing ↔ one link from their "Plan Your Visit" / "About the Island" section. Volume filler.
- **Premium swap** (DR 25+ regional site, or a high-traffic operator): offer category-exclusive featured placement + a quarterly attribution report (the Heritage-kit model from `docs/heritage-outreach.md`) ↔ a homepage or resource-page link. Worth a call, not just an email.

The Heritage sponsor-kit play (`docs/heritage-outreach.md`, 4 category-exclusive slots, Feb-2027 ship) is the premium-swap motion already designed — keep its calendar.

---

## 8. Operating plan — phased

Honest framing up front: the highest-value sources (Ahrefs competitor-gap export, digital-PR relationships) are **manual** because the API is plan-gated, and the new source scrapers are **stubs, not built yet**. So Phase 1 is mostly instrumentation + manual research + the first proof-of-motion links. The DR 12–15 / page-1 ambition is **Phase 2**, not 90 days.

**Phase 0 — build (≈20 hrs, ~2–3 weeks part-time, do first).**
- Migration `026` (`target_priority` + `embed` enum value); DR-on-import; anchor capture; two template families; two source-adapter stubs (~10–15 hrs of that total is the new scrapers). If William can't spare the time, delegate dev so Phase 1 starts with the engine ready.

**Phase 1 — months 1–3 (instrument + first links; realistic target: 8–12 placed links, DR 0 → ~8–10).**
- *Research (one-time ≈8–12 hrs):* pull the GSC striking-zone list; manually export Ahrefs Link-Intersect gaps for the 3 named competitors (`hiltonheadisland.com`, `hiltonheadrv.com`, `coastalvacationshhi.com` — expect 100–300 referring domains each; dedupe + filter out directories/PBNs); import as Tier-A prospects.
- *Motions (respect the 6-sends/day cap from `docs/heritage-outreach.md` → ~30/week):* run **brand-mention reclamation** first (fastest — they already named us); pitch **"best-of-HHI" roundups** at the best-time + weather targets; launch the **data-citation pitch** to 15–20 regional travel writers.
- *Validate each motion at ~50 sends* (not 100 — stay within the send cap) before scaling it.

**Phase 2 — months 4–6 (scale what worked; target: 20–25 referring domains, DR ~12–15).**
- Double down on the motion that cleared the kill-bar.
- Build + ship the **embeddable tide widget** (own spec; no forced links per §5) and seed compliant embeds with existing directory partners.
- **Premium-swap calls** to DR-25+ regional sites — coordinate with the Heritage kit (closes Dec 1, 2026) so the same high-value prospect isn't pitched two competing offers.

**On ranking:** authority is the *controllable* target above. The best-time page reaching page 1–2 is the *hoped-for result* of authority + the on-page already shipped — not a guarantee, and explicitly conditional on relevance holding (see §9).

---

## 9. Metrics + kill criteria (v2)

**Leading indicators (weekly):**
- Placed links / sends (reply→placement rate).
- New referring domains (Ahrefs web UI, weekly screenshot).
- DR trajectory (free endpoint, weekly — it's free).
- Target-page average position (GSC, the page-level truth).

**Lagging (monthly):**
- Organic clicks to target pages (GSC).
- Best-time page position for "best time to visit Hilton Head".

**Kill criteria (v2) — track reply rate and placement rate separately (a motion can reply well but convert to zero links):**
- A *motion* (= a pitch-type × target combo) under **5% reply rate at ~50 sends** → rewrite its template before scaling.
- A motion with a healthy reply rate but **< 3 placed links after 60 days** → the ask or the target is wrong; re-scope, don't just resend.
- DR still 0 after 90 days **and** 15+ placed links → diagnose before reacting: (a) confirm links are *indexed* in Ahrefs (it can lag 2–4 weeks); (b) check the refdomain DR distribution — if <50% are DR-10+, reallocate to Tier A/B; only then (c) raise the DR-gate floor.
- Best-time page still > position 20 **with** authority measurably climbing → the bottleneck is relevance / content / E-E-A-T, not links; re-audit on-page before spending more.

---

## 10. Engine changes summary (for the implementation spec)

Concrete, in priority order. Each is small; together they make v2 operable.

1. **Migration `026_outreach_target_priority.sql`** — add **`target_priority smallint`** to `outreach_opportunities` (the `target_url` column already exists from `007`); add **`embed`** to the `outreach_link_type` enum via `ALTER TYPE ... ADD VALUE`. Reuse the existing **`digital_pr`** value for editorial/data-citation links — do **not** add a redundant `editorial` value. Verified next free number: `024`/`025` are taken.
2. **DR-on-import** — `app/admin/(gated)/outreach/import/actions.ts` calls the free DR endpoint per domain, stores `outreach_accounts.domain_rating` (column exists, currently unused); queue sorts by it within the relevance band.
3. **Anchor capture** — the "link placed" activity in `outreach_activity` records the actual anchor text; add a pattern view (observe, don't enforce a ratio).
4. **Template family** — `lib/outreach/templates.ts`: add `asset_data_citation`, `asset_widget_embed`; add suggested-anchor fields to existing swap templates.
5. **Source adapters** — `scripts/outreach/sources/`: add `roundup-serp.ts`, `brand-mentions.ts` (these are **new builds**, ~10–15 hrs — Phase 1 runs manual research until they exist); keep `hhi-chamber.ts` as Tier C.
6. **Embeddable widget** — `<iframe>` variant of `TideForecast`, **no forced/dofollow backlink** (in-iframe attribution only; host-page link optional + nofollow-suggested). Own frontend spec.

Nothing here changes the CAN-SPAM compliance layer (`lib/outreach/compliance.ts`) — that stays exactly as shipped.

---

## What we are NOT doing (guardrails)

- **No paid links, PBNs, or link schemes.** DR 0 → DR 15 the legitimate way is achievable; a manual penalty would erase the whole site. Every link must be editorially earned or a genuine value swap.
- **No exact-match anchor flooding or coordinated anchors.** Per §6: offer suggestions, let publishers choose; an exact-match-heavy pattern is the risk, not a missed ratio.
- **No buying a DR shortcut** (expired domains, link packages). The directory carrot + data assets are the moat; fake authority isn't.
- **No forced widget links.** Embeddable tools attribute *inside the iframe*; they never require a followed backlink in the host page as a condition of use (that's a Google link-scheme violation — see §5).
- **No automation of the Tier-A/B-PR human relationships.** The scraper feeds the queue; a person sends the pitch (William's byline). That's a feature, not a gap.
