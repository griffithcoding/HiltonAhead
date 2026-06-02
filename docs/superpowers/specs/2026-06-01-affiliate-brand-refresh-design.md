# Affiliate Brand Refresh — Design Spec

**Date:** 2026-06-01
**Owner:** William Griffith
**Status:** Approved (brainstorming) → ready for implementation plan
**Strategy chosen:** Approach A — "Swap weak programs + 3 new money pages"
**Companion docs:**
- [`docs/sales-ops/affiliate-summary.md`](../../sales-ops/affiliate-summary.md)
- [`docs/sales-ops/affiliate-accounts-inventory.md`](../../sales-ops/affiliate-accounts-inventory.md)
- [`docs/sales-ops/affiliate-next-steps-2026-05-26.md`](../../sales-ops/affiliate-next-steps-2026-05-26.md)

---

## Problem

The affiliate registry carries four low-yield / poorly-matched programs that don't reflect how money actually moves on a Hilton Head trip:

| Brand | Problem | Verdict |
|---|---|---|
| **Hertz** | 3% / 24h cookie (CJ). Rental-car shoppers compare for days. | Swap |
| **GolfNow** | $3/round flat, gatekept own program, manual form. | Cut/demote |
| **Peter Millar** | No clear public program; ~zero purchase intent on a travel site. | Cut |
| **Allianz (standalone)** | Single insurer = lower CTR than a comparison engine. | Demote to one option inside a comparison page |

Additionally, the prior planning docs mapped Allianz/Hertz/Peter Millar/GolfNow to **Impact** — a stub assumption that web-verification (2026-06-01) proved wrong (Allianz/Hertz are CJ; GolfNow is its own gatekept program; Peter Millar has no clear public program). This refresh fixes that and replaces them with verified higher-yield, higher-relevance brands.

## Goal

Swap the weak brands for verified high-yield brands that match real Hilton Head spend, build 3 dedicated money pages, and fill placement gaps — without partnership outreach (all self-serve / direct programs).

**Priority lens:** Balanced — high $/visitor AND genuine traveler value.
**Build scope:** New money pages OK + placement fills.

---

## Verified replacement brands (networks + rates confirmed via web research 2026-06-01)

| Brand | What | Rate / cookie | Network | HHI fit |
|---|---|---|---|---|
| **Discover Cars** | Rental-car aggregator | ~70% of profit, $20+/booking, **365-day cookie** | Direct (best) — discovercars.com/affiliate; also CJ / Travelpayouts | Everyone flies into Savannah/HHH and needs a car |
| **InsureMyTrip** | Travel-insurance comparison | % of policy | **Impact** | Comparison out-converts single insurer; ties to hurricane content |
| **Squaremouth** | Travel-insurance comparison | up to **$50/sale** | Own program | Same; second quote source for the comparison page |
| **ShipSticks** | Golf-club + luggage shipping | **10%**, no min payout | Direct | Fly-in golfers + RBC Heritage crowd |
| **Vrbo / Booking / Marriott** | Villa + hotel (already registered) | existing | Partnerize / Booking / Impact | **Lodging is the #1 HHI spend** — lean harder |

**Keep unchanged:** Viator + GetYourGuide (tours/dolphin/fishing), Amazon (gear / packing-list 3-sale floor).
**Note:** Airbnb has no open affiliate program (closed 2021) — not available except limited via Travelpayouts. Out of scope.

---

## Design

### §1 — Registry changes (`data/affiliateLinks.ts`)

**Remove** from `AffiliateProgramId` union and `AFFILIATE_PROGRAMS`: `golfnow`, `hertz`, `petermillar`.
- **Pre-req:** grep the codebase for `programId="golfnow"` / `"hertz"` / `"petermillar"` and remove/replace any placements first, so removal can't break a page build. Inventory indicates GolfNow has few placements; Hertz/Peter Millar zero.

**Add** four rows:

| id | env var | trackingParam / linkPattern | network | default deeplink |
|---|---|---|---|---|
| `discovercars` | `AFFILIATE_DISCOVERCARS_AID` | `a_aid` / query-stamp *(VERIFY)* | direct | Discover Cars search scoped to Hilton Head / SAV airport |
| `insuremytrip` | `AFFILIATE_INSUREMYTRIP_CAMREF` | camref + `irgwc=1` / query-stamp *(VERIFY — may need redirect-wrap)* | Impact | insuremytrip.com |
| `squaremouth` | `AFFILIATE_SQUAREMOUTH_ID` | TBD / *(VERIFY)* | own | squaremouth.com |
| `shipsticks` | `AFFILIATE_SHIPSTICKS_AID` | direct param / *(VERIFY)* | direct | shipsticks.com |

**Keep** `allianz` (demoted; reused as one option on the insurance page).

**Link-format discipline (anti-mistake rule — central to this effort):**
Every new program's real deeplink parameter and tracking domain MUST be copied from that network's own "Get Link / Create Link" generator and confirmed with a live test click **before** the program is marked active. No inferring params from third-party blog posts — that is exactly what produced the wrong Impact mappings. Each new registry row carries a `// VERIFY: confirm param + domain from <network> Get-Link before activating` comment until confirmed.

**Possible `withAffiliateParams()` extension:** the helper currently supports `query-stamp` and `partnerize-wrap`. If a verified network (e.g. Impact for InsureMyTrip, or a direct program) requires a click-redirect domain rather than a destination query param, add a generalized `redirect-wrap` pattern (parameterized redirect base + path template) rather than special-casing. Decide at build time after seeing the real link. Do not pre-build it speculatively (YAGNI).

### §2 — Three new money pages

All three follow existing site conventions (CLAUDE.md): thin shell over a `data/` module, brand values from `data/brand.ts`, JSON-LD via `app/lib/metadata.ts`, `<Breadcrumbs>` + `<TldrBlock>` for LLM-SEO, FTC disclosure automatic via `<AffiliateCard>`, registered in nav/footer + sitemap.

| Route | Target intent | Money brand(s) | Data module | Schema helpers |
|---|---|---|---|---|
| `/savannah-airport-to-hilton-head` | "how to get from Savannah/HHH airport to Hilton Head" (broad intent; rental car is the natural answer) | Discover Cars | `data/airportTransfer.ts` | `getHowToSchema` + `getFaqSchema` + `getBreadcrumbSchema` |
| `/hilton-head-travel-insurance` | "do I need travel insurance / hurricane coverage for Hilton Head" | InsureMyTrip + Squaremouth + Allianz (compare) | `data/travelInsurance.ts` | `getFaqSchema` + `getBreadcrumbSchema` |
| `/ship-golf-clubs-to-hilton-head` | "fly with vs ship golf clubs to Hilton Head" + RBC Heritage timing | ShipSticks | `data/golfShipping.ts` | `getHowToSchema` + `getFaqSchema` + `getBreadcrumbSchema` |

**Slug decision:** `/savannah-airport-to-hilton-head` chosen over a bare `/hilton-head-rental-car` — broader search volume, and the rental-car CTA sits inside genuine "how do I get there" help. (Approved.)

**ShipSticks page decision:** gets its own lightweight page AND cards on golf pages (approved).

### §3 — Placement fills on existing pages

| Page | Add | Remove |
|---|---|---|
| `/cost-of-hilton-head-trip` | Discover Cars + insurance | (planned Hertz/Allianz-standalone) |
| `/hilton-head-golf-packages`, `/hilton-head-golf-courses`, `/hilton-head-stay-and-play`, `/guides/2027-rbc-heritage` | ShipSticks; lean Booking/Vrbo | GolfNow, Peter Millar |
| `/hilton-head-hurricane-season` | insurance (highest-CTR insurance placement) | — |
| `/hilton-head-honeymoon`, `/hilton-head-family-trip-planner` | insurance + Viator | — |
| Activity/local pages (`dolphin-tours`, `fishing-charters`, `water-activities`, `things-to-do`) | Viator / GetYourGuide | — |
| Lodging pages (resort-comparison, oceanfront-villas, neighborhoods) | Vrbo / Booking | — |

**Card ordering** by commission × cookie length (longest-cookie / highest-value first in DOM): Marriott → Booking → Vrbo → Discover Cars → insurance → Amazon.

### §4 — Docs + application action items

Code/docs kept in sync:
- `data/affiliateLinks.ts` (registry), `.env.example` (new env vars), `affiliate-accounts-inventory.md`, `affiliate-summary.md`, `affiliate-next-steps-2026-05-26.md` (remove cut programs; fix the wrong Impact mapping).

User applications required (see "How this makes money" below):
- **Discover Cars** — apply direct at discovercars.com/affiliate
- **ShipSticks** — direct partner/affiliate form
- **InsureMyTrip** — apply via Impact (app.impact.com)
- **Squaremouth** — apply via its own affiliate page
- Keep existing: Booking, Expedia, Vrbo, Marriott, Viator, GetYourGuide, Amazon. CJ remains a later step for golf gear (Titleist/PXG).

### §5 — Out of scope (YAGNI)

- Travelpayouts gateway (Approach B)
- Wedding registry (Zola) + relocation/moving verticals (Approach C)
- Amazon PA-API product images (separate track)
- Removing Allianz entirely (it stays, reused on the insurance page)

---

## How this makes money (mechanics)

1. **Visitor reads a page** (e.g. `/savannah-airport-to-hilton-head`) and clicks an affiliate card/link.
2. `withAffiliateParams()` has already stamped the outbound URL with **your tracking ID** (from the env var) — e.g. `?a_aid=YOURID` for Discover Cars. The click also fires a first-party beacon to `/api/affiliate/track` (your own analytics).
3. The destination site (Discover Cars, ShipSticks, etc.) drops **its cookie** crediting you, for the cookie window (365 days for Discover Cars).
4. When the visitor **completes a qualifying action** (car rental returned, policy purchased, clubs shipped), the network records a **conversion** against your tracking ID.
5. The network pays you a **commission** on its monthly cycle to PayPal / bank.

**Pre-conditions for a single dollar to flow:** (a) you're **approved** by that program, (b) the **env var holds your real tracking ID** in Vercel production, (c) a **card is placed** on a page, (d) the link format is **verified correct** so the click registers.

---

## Required signups (what you must do, by brand)

| Brand | Sign up where | Then |
|---|---|---|
| **Discover Cars** | discovercars.com/affiliate (direct) | Copy your `a_aid` from their dashboard → set `AFFILIATE_DISCOVERCARS_AID` in Vercel |
| **ShipSticks** | ShipSticks partner/affiliate form (direct) | Copy tracking ID → set `AFFILIATE_SHIPSTICKS_AID` |
| **InsureMyTrip** | app.impact.com (Impact) | Copy camref → set `AFFILIATE_INSUREMYTRIP_CAMREF` |
| **Squaremouth** | squaremouth.com/about/affiliates | Copy tracking ID → set `AFFILIATE_SQUAREMOUTH_ID` |
| **Booking / Expedia / Vrbo / Marriott / Viator / GetYourGuide / Amazon** | Already registered | No new signup — just ensure env vars set (see summary doc) |

The **code work** (this spec) makes the site *ready to earn*. The **signups + env vars** (your action) are what actually turn earning on. Both are required; neither alone produces revenue.

---

## Success criteria

- Registry no longer contains golfnow/hertz/petermillar; build passes (no broken `programId` refs).
- 4 new programs registered with `// VERIFY` discipline; `.env.example` documents the new vars.
- 3 new pages live, each with correct schema, breadcrumbs, TLDR, and at least one verified-format affiliate card.
- Placement gaps filled per §3; card ordering applied.
- All docs synced; no remaining "Impact" claims for CJ/own-program brands.
- `npm run typecheck`, `npm run lint`, `npm run build` all green.

## Risks / watch-outs

- **Unverified link formats** are the #1 risk — enforce the VERIFY rule; a wrong param = clicks that never register (silent $0).
- **Approval lag** — some programs take days; place cards only after approval + env var, or links pass through untracked (no commission) until then. (`withAffiliateParams` already falls back to the raw URL safely.)
- **Allianz removal** — do NOT delete; it's reused on the insurance page.
- **Branch hygiene** — work stays on `feat/affiliate-brand-refresh` (no worktrees).
