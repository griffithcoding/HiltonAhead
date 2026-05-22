# Impact.com Partner Priority — Next 10 Applications

**Author:** CEO, Hilton Ahead Travel Co
**Date:** 2026-05-21
**Status:** Decision — execute this week

---

## The decision (frame)

Wrong question: "Which Impact partners pay the highest commission?"
Right question: **Which Impact partners compound our positioning (local-insider HHI expert) AND raise revenue-per-visitor on the traffic we already have?**

The $200K+ HHI traveler doesn't buy because we have an affiliate link. They buy when the link is *the obviously correct next step* in our content. So we apply for partners whose products appear naturally inside content we're already shipping — not because someone in Atlanta read a coupon-aggregator blog.

Already covered (no action): Booking.com, Expedia, Vrbo, Viator, GetYourGuide, GolfNow, Amazon, Marriott Bonvoy.

---

## The 10, ranked

### Tier S — apply this week (3)

**1. Allianz Travel Insurance**
- Why: Every 7-day HHI trip from a feeder city costs $4K-$15K. Insurance attach rate on that demo is ~30%. Highest CPL of the list.
- Commission: 25-50% of policy ($15-$120 per sale; $30 typical)
- Approval: Near-automatic — they take long-tail travel sites
- Surfaces it fits: `/cost-of-hilton-head-trip`, every itinerary CTA, newsletter footer, FAQ "Should I get travel insurance?" Q
- Time-to-impact: 7 days from approval to first commission
- Kill criteria: <$200 commission in 60 days post-integration → swap to World Nomads or InsureMyTrip

**2. Peter Millar**
- Why: HHI's *de facto* golf-apparel brand. Official partner of RBC Heritage Foundation. Our Heritage 2027 content already mentions Peter Millar plaid. AOV $180+.
- Commission: 8-12%
- Approval: Medium — gates by traffic quality. Lead with our `/guides/2027-rbc-heritage` page as proof of audience match.
- Surfaces: Heritage guide, golf trip planner, gift-guide content, packing-list posts
- Time-to-impact: 14 days
- Kill criteria: <$300 commission in 90 days → replace with Bonobos or Mizzen+Main

**3. Hertz**
- Why: HHH airport is small; ~80% of fly-in travelers rent a car at Savannah/Hilton Head Intl (SAV) or HHI. Universal need, easy attach.
- Commission: $5-$25 per booking (flat) — low but volume scales
- Approval: Automatic — accepts all travel sites
- Surfaces: Every "Getting to Hilton Head" copy block, the cost calculator, the itinerary form thank-you page
- Time-to-impact: 7 days
- Kill criteria: <500 clicks/month in 60 days → consolidate into a "compare car rentals" widget with Avis + Enterprise added

### Tier A — apply within 2 weeks (4)

**4. Costa Del Mar**
- Why: Florida-headquartered fishing-eyewear brand. Sea Pines marina + Shelter Cove dolphin tours + sportfishing demos are exact ICP. AOV $200+.
- Commission: 6-10%
- Approval: Medium
- Surfaces: Fishing-charter content, /local/water-activities, gift guides
- Kill criteria: <$200 in 90 days → swap to Maui Jim

**5. Vineyard Vines**
- Why: Has an actual HHI retail store in Shelter Cove Town Center. Brand identity = our exact aesthetic. Cross-promotable in person.
- Commission: 5-8%
- Approval: Medium-hard (gates by content fit)
- Surfaces: Family trip planner, honeymoon content, packing posts, shopping page (need to build /shopping-on-hilton-head)
- Kill criteria: <$200 in 90 days → swap to Faherty

**6. Yeti**
- Why: Beach day → cooler. Golf day → cooler. Dock day → cooler. Triple-coverage on our core trip types. AOV $300+ on Tundra coolers.
- Commission: 5-10%
- Approval: Medium
- Surfaces: Beach guides, golf packages, fishing charters, packing lists
- Kill criteria: <$300 in 90 days → swap to RTIC (cheaper alt, higher commission)

**7. Faherty**
- Why: Built-for-coast lifestyle brand. Honeymoon/anniversary demo bullseye. AOV $150+. Wife-buys-for-husband or couples-buy-together pattern crushes for us.
- Commission: 7-12%
- Approval: Medium
- Surfaces: Honeymoon, couples, packing-by-month, gift guides
- Kill criteria: <$200 in 90 days

### Tier B — apply month two (3)

**8. Away (luggage)**
- Why: $200K demo upgrades luggage. "What to pack for HHI" + "the suitcase you actually need" content angle.
- Commission: 5-10%, AOV $275+
- Approval: Medium

**9. Boatsetter**
- Why: Peer-to-peer boat rental marketplace. Shelter Cove and Harbour Town marinas are active. Differentiates from generic "rent a boat" content.
- Commission: 10-15% of rental fee, AOV $400-1500
- Approval: Easy

**10. Maui Jim**
- Why: Premium polarized sunglasses, beach + boat lifestyle. AOV $250+. Complements Costa if both approve.
- Commission: 5-10%
- Approval: Medium

---

## The pick (if I had one application to file today)

**Allianz Travel Insurance.** Highest expected revenue, lowest approval friction, fits a page (`/cost-of-hilton-head-trip`) we already rank for. Insurance is a "while you're booking anyway" decision — zero new content lift, just one card on existing pages.

---

## Pre-mortem — what kills this

1. **Apparel brands reject for low traffic.** Mitigation: front-load Tier S (insurance, car rental) which take any traveler site. Build a 60-day approved-revenue history, then re-apply to Peter Millar + Vineyard Vines with proof.
2. **Approval-pending paralysis.** Don't wait for one before applying to the next. Submit all 3 Tier S applications same day. Apps cost nothing.
3. **Code lift on each integration.** Each new program needs `data/affiliateLinks.ts` entry + env var + at least one `AffiliateCard` placement. Build a single PR that wires up 3-5 stub program entries with `defaultDeeplink` only; integrate cards gradually.
4. **Disclosure fatigue.** Every new affiliate triggers FTC disclosure. We already have `AffiliateDisclosure` — verify it scales to 15+ programs without becoming a wall of text.
5. **Cookie window cannibalization.** Booking.com (30 days) overlaps with Marriott (likely 7 days). When a user clicks Booking.com last, Marriott loses attribution. Order matters in card placement — lead with the highest-commission, longest-cookie program per page.

---

## 30 / 60 / 90 success metrics

| Window | Goal | Measured by |
|---|---|---|
| **30 days** | 3 of 3 Tier S approved (Allianz, Peter Millar, Hertz). First commission recorded. | Impact dashboard "active contracts" count; `affiliate_clicks` table |
| **60 days** | 4 more approvals (any from Tier A). Affiliate revenue ≥$500. ≥2 partners wired into ≥3 content pages each. | Impact earnings report; `data/affiliateLinks.ts` partner count; grep for `<AffiliateCard programId=` instances |
| **90 days** | 8+ of 10 approved. Affiliate revenue ≥$2K/mo run rate. Travel-insurance attach rate ≥5% on `/cost-of-hilton-head-trip` traffic. | Monthly P&L from Impact; conversion funnel from cost-calc page |

If we miss the 60-day revenue threshold by >50%, the issue isn't partner mix — it's traffic. Pause new applications and ship 2 high-intent SEO pages instead.

---

## Application order (literal sequence to do today)

1. Apply to Allianz Travel Insurance (Impact marketplace) — 10 min
2. Apply to Hertz — 10 min
3. Apply to Peter Millar — 15 min (write a proper publisher pitch — mention RBC Heritage content)
4. While waiting, stub `data/affiliateLinks.ts` entries for all 3 with placeholder env vars
5. Move to Tier A applications next Monday
