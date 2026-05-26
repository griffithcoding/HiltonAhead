# Affiliate Accounts Inventory — Current State

**Last updated:** 2026-05-26
**Sources of truth:**
- Code registry → `data/affiliateLinks.ts` (11 programs registered)
- Stamping helper → `app/lib/affiliates.ts` (`withAffiliateParams`, two link patterns)
- Production env → Vercel env panel (only verifiable in dashboard / `vercel env ls`)
- Network status → each network's own partner dashboard

> "Registered in code" ≠ "approved by network" ≠ "earning commission." The registry says we know how to *format* a link with the right tracking param if the env var exists. Whether the env var is *populated*, and whether the commission *reports back*, has to be confirmed in (a) Vercel env panel and (b) each network's partner dashboard.

---

## Status matrix — 11 registered programs

| # | Program | Env var | Network | Confidence active | Notes |
|---|---------|---------|---------|-------------------|-------|
| 1 | **Amazon Associates** | `AFFILIATE_AMAZON_TAG` + 4 per-surface (`_BLOG`, `_FAQ`, `_LOCAL`, `_NEWSLETTER`) | Amazon | **HIGH** | 35-product grids live on 7 beach-intent pages. Per-surface tag splitting shipped 2026-05-20 (PR #25 + #26). |
| 2 | **Expedia** | `AFFILIATE_EXPEDIA_CAMREF` | **Partnerize** | **HIGH** | Approved. Publisher ID `1110l31904`. Wired via `linkPattern: 'partnerize-wrap'` (PR #54, merged 2026-05-26). Env var set in Vercel prod 2026-05-26. |
| 3 | **Vrbo** | `AFFILIATE_VRBO_CAMREF` | **Partnerize** | **HIGH** | Same Partnerize publisher as Expedia (Expedia Group same network). Env var set 2026-05-26. |
| 4 | **Booking.com** | `AFFILIATE_BOOKING_AID` | Booking.com Partner Hub | **MEDIUM** | `<AffiliateCard programId="booking">` referenced on /cost-of-hilton-head-trip + 9 lodging pages (PR #27, 2026-05-21). Approval state needs dashboard verification. |
| 5 | **Marriott Bonvoy** | `AFFILIATE_MARRIOTT_AID` | Impact Radius | **MEDIUM** | Dedicated `/marriott-bonvoy-stays-hilton-head` page exists, plus `/best-hilton-head-resort-comparison` mentions Marriott Grande Ocean. Approval state needs Impact dashboard check. |
| 6 | **Allianz Travel Insurance** | `AFFILIATE_ALLIANZ_CAMREF` | Impact Radius | **UNKNOWN** | Stubbed via PR #33 (2026-05-21). Zero placements yet. Application status TBD. |
| 7 | **Hertz** | `AFFILIATE_HERTZ_CAMREF` | Impact Radius | **UNKNOWN** | Stubbed via PR #33. Zero placements. |
| 8 | **Peter Millar** | `AFFILIATE_PETERMILLAR_CAMREF` | Impact Radius | **UNKNOWN** | Stubbed via PR #33. Application notes flag "medium approval — gates by traffic quality." |
| 9 | **Viator (Tripadvisor)** | `AFFILIATE_VIATOR_PID` | Viator Affiliate | **LOW–MEDIUM** | Registered, sparse placement on activity pages. Verify in viatoraffiliate.com. |
| 10 | **GetYourGuide** | `AFFILIATE_GETYOURGUIDE_PARTNER_ID` | GetYourGuide | **LOW–MEDIUM** | Registered, sparse placement. Verify in partner.getyourguide.com. |
| 11 | **GolfNow** | `AFFILIATE_GOLFNOW_CAMREF` | Impact Radius | **LOW** | Registered, very few placements live. |

---

## Verification: how to confirm each program is earning

Run once per program. Refresh quarterly.

```bash
# 1. Check env vars set in production
vercel env ls --environment=production | grep AFFILIATE

# 2. Pull live HTML, inspect rendered affiliate hrefs
curl -s https://www.hiltonahead.com/cost-of-hilton-head-trip | grep -oE 'href="[^"]*(prf\.hn|booking\.com|amazon\.com)[^"]*"' | head -5

# 3. Visit each network's dashboard and confirm:
#    - Amazon Associates: associates.amazon.com → Reports → Earnings → look for clicks
#    - Partnerize (Expedia/Vrbo): partnerize.com → Reports → Click report
#    - Booking.com: partner.booking.com → Statistics → Clicks
#    - Impact: app.impact.com → Reports → Run Reports → Click Report
```

---

## Partnerize-specific: how Expedia/Vrbo URLs look in production

Cards on the live site emit URLs in this shape:

```
https://prf.hn/click/camref:1110l31904/destination:https%3A%2F%2Fwww.expedia.com%2FHotel-Search...
```

If you inspect an Expedia card on hiltonahead.com and the href does **not** start with `prf.hn/click/camref:1110l31904/`, the env var didn't propagate to the deploy — clear Vercel build cache and redeploy.

The `prf.hn` redirect counts the click against publisher ID `1110l31904`, sets the Partnerize cookie, and forwards the user to the destination URL. Conversion attribution flows back from Expedia/Vrbo to Partnerize automatically.

---

## What we need next — application priority

### Already-on-the-list (verify state; do nothing new if approved)

Allianz, Hertz, Peter Millar — all have stubs in code. Confirm each is in the Impact dashboard. If any is still "pending," nudge or re-apply.

### Tier A — apply within 2 weeks (high revenue, easy approval)

| Rank | Network | Why | Commission | Apply at |
|------|---------|-----|-----------|----------|
| 1 | **CJ Affiliate** | Master gateway. Once accepted, apply to Wayfair, Titleist, PXG without separate apps. | Varies | cj.com/publishers |
| 2 | **Awin** | Same gateway logic. Nike + Lululemon live on Awin US. | Varies | awin.com/us/publishers |
| 3 | **Skimlinks / Sovrn Commerce** | Auto-converts existing blog product mentions into affiliate links retroactively. | 7–25% commission share | sovrn.com (merged with Skimlinks) |
| 4 | **Avis** (Impact) | Hertz backup; we'll likely auto-approve. Side-by-side rental car widget on /cost-of-hilton-head-trip. | $5–$25/booking | app.impact.com |
| 5 | **TravelInsurance.com** (Impact) | Comparison engine — higher CTR than Allianz alone. | 10–20% of policy | app.impact.com |
| 6 | **InsureMyTrip** (Impact) | Backup if Allianz pauses. | 15–25% | app.impact.com |

### Tier B — apply once we have 60-day approved revenue history

| Rank | Network | Why | Commission |
|------|---------|-----|-----------|
| 7 | **Vineyard Vines** | Lowcountry signature brand. Gates on traffic. | 5–8% |
| 8 | **Patagonia / REI** | "What to pack" content. High LTV. | 5–8% |
| 9 | **GolfPass (NBC Sports)** | More upscale than GolfNow. Better attach to Sea Pines + May River audiences. | $25–$40/subscription |
| 10 | **Yeti** | Already feature in our beach-page Amazon grids. Direct pays higher than Amazon. | 5–10% |

### Tier C — hold (luxury / financial-services compliance burden)

- Four Seasons / Aman / Belmond (luxury chains — only accept established luxury-travel publishers)
- Tom Ford / Mr Porter (gate by Alexa traffic + page-quality review)
- Charles Schwab / Fidelity (financial-services compliance — skip unless we build a dedicated relocation vertical)

---

## Surfaces × programs gap matrix (what's missing where)

Pages where the program is approved but no `<AffiliateCard>` placement exists yet. Each row is ~30 min of code work.

| Page | Should have | Status |
|------|-------------|--------|
| `/cost-of-hilton-head-trip` | Allianz + Hertz + Booking | Booking present; Allianz + Hertz missing |
| `/hilton-head-honeymoon` | Allianz + Booking + Viator | Booking likely present; Allianz + Viator missing |
| `/hilton-head-family-trip-planner` | Allianz + Booking + Viator + Amazon | Amazon ✅; Allianz + Viator missing |
| `/hilton-head-golf-packages` | GolfNow + Booking + Peter Millar | All three missing |
| `/guides/2027-rbc-heritage` | Peter Millar + GolfNow + Booking | All three missing |
| `/blog/hilton-head-2026-hurricane-forecast` | Allianz (highest CTR placement) | Missing |
| `/blog/hilton-head-things-to-do-ranked-2026` | Viator + GetYourGuide | Largely missing |
| `/local/dolphin-tours` | Viator + GetYourGuide | Missing |
| `/local/fishing-charters` | Viator | Missing |
| `/local/water-activities` | Viator + GetYourGuide | Missing |
| Neighborhood pages (Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, Port Royal, Mid-Island) | Booking + Vrbo widget | Need to verify per-neighborhood |
| `/hilton-head-vs-kiawah` | Booking + Vrbo × 2 (one for each side) | Missing — added 2026-05-25 |
| `/best-hilton-head-resort-comparison` | Marriott Bonvoy + Booking + Expedia | Missing |
| `/hilton-head-oceanfront-villas` | Vrbo + Booking | Missing |
| `/marriott-bonvoy-stays-hilton-head` | Marriott + Booking + Expedia | Marriott likely present; verify |

**A single 8-hour batch placing the missing cards on the 15 pages above will likely 2–3× current affiliate revenue without applying to any new program.**

---

## Decision matrix — should I apply to program X?

```
APPLY IF:
- AOV × commission_rate × estimated_attach_rate > $5/page-view contribution at our traffic
- Approval requirements are achievable today (no "min 100k UV/month" gates)
- Surface exists where the card belongs (don't apply to Pottery Barn if we have
  no home-goods content)

DON'T APPLY IF:
- We already have a near-duplicate in the same vertical (don't run Hertz + Avis
  in parallel just to do it; pick one and double the cards instead)
- Application requires luxury-press-quality proof we don't yet have
- Network is on Awin/CJ and we haven't joined Awin/CJ yet (join the master first)
```

Lifecycle for each new program:

```
APPLIED → PENDING REVIEW → APPROVED → ENV VAR SET → CARD PLACED → FIRST CLICK → FIRST $ → KILL CRITERIA TRIPPED?
```

A program in "APPROVED" status with no card placed is leaving money on the table. A program with a card placed and no first click within 60 days has a *placement* problem, not a *program* problem.

---

## Changelog

- **2026-05-26** — Expedia + Vrbo migrated from legacy EPS siteid pattern to Partnerize camref + prf.hn wrap (PR #54). Env vars renamed `*_SITEID` → `*_CAMREF`. Publisher ID `1110l31904` set in Vercel prod. Both marked HIGH confidence active.
- **2026-05-21** — Tier S Impact stubs registered (Allianz, Hertz, Peter Millar) via PR #33.
- **2026-05-20** — Amazon Associates per-surface tag splitting + 35-product grids on 7 pages shipped (PRs #25 + #26).
