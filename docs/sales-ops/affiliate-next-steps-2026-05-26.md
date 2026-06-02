# Affiliate Partnerships — Full Next-Steps Plan

**Date:** 2026-05-26
**Owner:** William Griffith
**Companion docs:**
- [`docs/sales-ops/affiliate-accounts-inventory.md`](./affiliate-accounts-inventory.md) — Status matrix for all 11 programs
- [`docs/sales-ops/impact-partners-priority.md`](./impact-partners-priority.md) — Strategy + 30/60/90 metrics

## TL;DR

**Code + infrastructure: ✅ all built.** 11 affiliate programs registered. FTC-compliant `<AffiliateLink>` + `<AffiliateCard>` components live. Click-tracking endpoint logs to Supabase. Admin dashboard at `/admin/affiliates` shows 30-day clicks per program.

**Revenue gate: ⚠️ env vars + placements + applications.** Code can't earn until (a) Vercel env vars are set with your tracking IDs, (b) applications complete approval, and (c) cards land on more pages. Each is a 10-minute job, multiplied by ~30 small jobs.

**Critical deadline: Amazon 3-sale floor.** Account closes if no qualifying sales in 180 days from approval. `/hilton-head-packing-list` page (in progress) is the mitigation.

---

## Phase 0 — This week (≤2 hours total)

Goal: stop leaving money on the table from already-approved programs.

### 0.1 Set Vercel env vars (Production)

Open [vercel.com](https://vercel.com) → HiltonAhead project → **Settings → Environment Variables**.

For each row below, click "Add New", set Environment = **Production**, paste the value from the listed dashboard:

| Env var | Get value from | Format |
|---|---|---|
| `AFFILIATE_AMAZON_TAG` | [associates.amazon.com](https://associates.amazon.com) → Account Settings → Manage Tracking IDs | `username-20` (numeric suffix is the locale) |
| `AFFILIATE_BOOKING_AID` | [partner.booking.com](https://partner.booking.com) → Account → Affiliate ID | 7-digit number |
| `AFFILIATE_MARRIOTT_AID` | [app.impact.com](https://app.impact.com) → Brand: Marriott → Get Link | The `SubID` from the generated tracking link |
| `AFFILIATE_EXPEDIA_CAMREF` | ✅ Already set (publisher ID `1110l31904`) | — |
| `AFFILIATE_VRBO_CAMREF` | ✅ Already set (same Partnerize publisher) | — |

**Optional placement-specific Amazon tags** (create additional Tracking IDs in your Amazon Associates account — all roll up to the same payout — purely for reporting):
- `AFFILIATE_AMAZON_TAG_BLOG` — e.g., `hiltonahead-blog-20`
- `AFFILIATE_AMAZON_TAG_FAQ` — `hiltonahead-faq-20`
- `AFFILIATE_AMAZON_TAG_LOCAL` — `hiltonahead-local-20`
- `AFFILIATE_AMAZON_TAG_NEWSLETTER` — `hiltonahead-news-20`
- `AFFILIATE_AMAZON_TAG_TRIP` — `hiltonahead-trip-20` (for `/hilton-head-packing-list`)

If a placement-specific tag is unset, `withAffiliateParams()` automatically falls back to the primary `AFFILIATE_AMAZON_TAG`.

### 0.2 Trigger redeploy

Vercel redeploys automatically on env var change. If not, push any commit or trigger manual redeploy from the dashboard.

### 0.3 Verify (24-48h later)

```bash
# 1. Confirm env vars landed
vercel env ls --environment=production | grep AFFILIATE

# 2. Check rendered hrefs on production
curl -s https://www.hiltonahead.com/cost-of-hilton-head-trip | grep -oE 'href="[^"]*(prf\.hn|booking\.com|amazon\.com)[^"]*"' | head -10
# Expect: hrefs include ?aid=, ?tag=, or prf.hn/click/...
```

Then visit each network's dashboard:
- **Amazon:** [associates.amazon.com](https://associates.amazon.com) → Reports → Earnings → look for clicks
- **Booking.com:** [partner.booking.com](https://partner.booking.com) → Statistics → Clicks
- **Marriott (Impact):** [app.impact.com](https://app.impact.com) → Reports → Click Report
- **Expedia/Vrbo (Partnerize):** [console.partnerize.com](https://console.partnerize.com) → Reports → Click report

If any dashboard shows 0 clicks after 48 hours of normal site traffic, the env var or tracking format is wrong. Re-check.

### 0.4 Verify application status for 6 pending programs

Log into each, confirm approval state:

| Program | Dashboard | Look for |
|---|---|---|
| Allianz | [app.impact.com](https://app.impact.com) | "Active Brand Contracts" → Allianz |
| Hertz | [app.impact.com](https://app.impact.com) | "Active Brand Contracts" → Hertz |
| Peter Millar | [app.impact.com](https://app.impact.com) | "Active Brand Contracts" → Peter Millar |
| Viator | [viatoraffiliate.com](https://viatoraffiliate.com) | Dashboard → Account → Status |
| GetYourGuide | [partner.getyourguide.com](https://partner.getyourguide.com) | Profile → Approval State |
| GolfNow | [app.impact.com](https://app.impact.com) | "Active Brand Contracts" → GolfNow |

For each result:
- **Approved** → Get the camref/PID/partner_id from "Get Link" or "Tracking IDs", paste into the matching Vercel env var.
- **Pending** → Wait (do not re-apply; that resets the queue).
- **Declined** → Note the reason; revisit after 60-day traffic growth or apply to the backup (Avis for Hertz, TravelInsurance.com for Allianz).

---

## Phase 1 — Week 1-2 (≤6 hours total)

Goal: dramatically expand reach by joining 6 new networks. Each application is 10-20 minutes; total ~2 hours of forms.

### 1.1 Apply to 6 Tier A networks

Apply same day — no need to wait for sequential approvals. Applications cost nothing.

| Rank | Network | Why | URL | Approval timeline |
|---|---|---|---|---|
| 1 | **CJ Affiliate** | Master gateway — one approval unlocks Wayfair, Titleist, PXG, hundreds more | [cj.com/publishers](https://www.cj.com/publishers) | 24-48h |
| 2 | **Awin** | Same gateway logic — Nike + Lululemon US live on Awin | [awin.com/us/publishers](https://www.awin.com/us/publishers) | 48-72h |
| 3 | **Skimlinks / Sovrn Commerce** | Auto-converts existing blog product mentions into affiliate links retroactively | [sovrn.com](https://www.sovrn.com) | 1-5 days |
| 4 | **Avis (via Impact)** | Hertz backup; high auto-approval rate; enables side-by-side rental car widget | [app.impact.com](https://app.impact.com) → Brands → Search "Avis" | 24-48h |
| 5 | **TravelInsurance.com (via Impact)** | Comparison engine — higher CTR than single insurer | [app.impact.com](https://app.impact.com) → Brands → Search "TravelInsurance" | 24-48h |
| 6 | **InsureMyTrip (via Impact)** | Backup-of-backup if Allianz pauses | [app.impact.com](https://app.impact.com) → Brands → Search "InsureMyTrip" | 24-48h |

**Application narrative template** (use for all 6 — paste verbatim into the "Why do you want to join" field):

> Hilton Ahead Travel Co. (hiltonahead.com) is a locally-owned Hilton Head Island travel consultancy with a content library of 80+ SEO-optimized destination pages, 30+ blog posts, and a curated business directory. We earn organic search traffic from buyer-intent queries (best Hilton Head villas, when to visit, family trip planner). Our audience is pre-trip, high-intent travelers planning Hilton Head Island vacations. Our existing affiliate stack includes Amazon Associates, Booking.com, Expedia, Vrbo, and Marriott. FTC disclosures appear above the fold on every page using affiliate links. We do not use paid ads; all traffic is organic.

### 1.2 Once CJ Affiliate approves (24-48h after Step 1.1)

From inside CJ, apply to:
- **Wayfair** — outdoor furniture for villas
- **Titleist** — golf gear (RBC Heritage tie-in)
- **PXG** — premium golf clubs
- **Costa Del Mar** — sunglasses (Lowcountry boating)
- **Vineyard Vines** — Lowcountry brand (currently Tier B but try early via CJ)
- **Yeti** — coolers (already in Amazon grid; CJ pays higher)
- **Maui Jim** — sunglasses

Each takes ~30 seconds from inside CJ once you have the Publisher ID.

### 1.3 Once Awin approves

Apply to:
- **Nike** — athletic apparel
- **Lululemon** — athletic apparel
- **REI** — outdoor gear (alternative to Amazon for "what to pack")

---

## Phase 2 — Week 2-4 (1-2 hours per day for ~5 days)

Goal: fix the placement gap. The inventory doc identified **15 pages where approved programs have no placement yet**. This single batch will likely 2-3× current affiliate revenue without adding any new program.

See [`affiliate-accounts-inventory.md` → "Surfaces × programs gap matrix"](./affiliate-accounts-inventory.md) for the full table. Summary of what to wire up:

### 2.1 Lodging pages — add Booking + Vrbo

| Page | Add | Estimated time |
|---|---|---|
| `/best-hilton-head-resort-comparison` | Marriott + Booking + Expedia cards | 30 min |
| `/hilton-head-oceanfront-villas` | Vrbo + Booking | 20 min |
| `/hilton-head-vs-kiawah` | Booking + Vrbo × 2 (one per side) | 40 min |
| Neighborhood pages × 6 (Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, Port Royal, Mid-Island) | Booking + Vrbo each | 60 min total |

### 2.2 Travel insurance pages — add Allianz (once approved)

| Page | Add | Why |
|---|---|---|
| `/cost-of-hilton-head-trip` | Allianz + Hertz cards | High-CTR placement; cost-calc users are budget-aware = insurance-curious |
| `/hilton-head-honeymoon` | Allianz | Couples trips have higher insurance attach rate |
| `/hilton-head-family-trip-planner` | Allianz + Viator | Family trips highest insurance attach (kids + 4+ travelers = $$ at risk) |
| `/blog/hilton-head-2026-hurricane-forecast` | Allianz | Highest single-placement CTR — hurricane content directly maps to insurance intent |

### 2.3 Golf pages — add GolfNow + Peter Millar (once approved)

| Page | Add |
|---|---|
| `/hilton-head-golf-packages` | GolfNow + Booking + Peter Millar |
| `/guides/2027-rbc-heritage` | Peter Millar + GolfNow + Booking |

### 2.4 Activity pages — add Viator + GetYourGuide

| Page | Add |
|---|---|
| `/blog/hilton-head-things-to-do-ranked-2026` | Viator + GetYourGuide |
| `/local/dolphin-tours` | Viator + GetYourGuide |
| `/local/fishing-charters` | Viator |
| `/local/water-activities` | Viator + GetYourGuide |

**Implementation pattern:** for each page, find the natural body location (usually right before a section break or above a "see more" block), add:

```tsx
<AffiliateCard programId="allianz" placement="trip/cost-calc/insurance" />
```

The component handles FTC disclosure inline. No new env var needed if the program is in the registry.

### 2.5 Cookie window — order cards by attribution value

Per the impact-partners-priority pre-mortem: cookie cannibalization is real. When a user clicks 3 cards on a page, the LAST click wins. So place the highest-commission, longest-cookie program FIRST on the page (so it loads earlier in the DOM / above the fold).

Rough ordering by commission × cookie length:
1. **Marriott** (high commission, 7d cookie) — first
2. **Booking.com** (medium commission, 30d cookie)
3. **Expedia/Vrbo** (medium commission, 7d cookie)
4. **Amazon** (low commission, 24h cookie) — last (since visitors might re-click Amazon multiple times anyway)

---

## Phase 3 — Month 2 (Tier B applications + Amazon image rights)

### 3.1 Tier B applications (only after 60-day approved revenue history)

| Network | Why | Threshold to apply |
|---|---|---|
| **Vineyard Vines** | Lowcountry signature brand | Need 60-day affiliate revenue proof; apply via CJ if Tier A unlocks them |
| **Patagonia / REI** | "What to pack" content | Apply via Awin (REI direct) |
| **GolfPass (NBC Sports)** | Upscale golf audience (Sea Pines, May River) | $25-$40/subscription — better than GolfNow's per-click |
| **Yeti** | Already featured in Amazon grid; direct pays more | Apply via CJ |

### 3.2 Amazon PA-API access (once 3-sale floor met)

After your account has logged 3 qualifying Amazon sales within 180 days of approval:

1. Apply at [associates.amazon.com](https://associates.amazon.com) → Tools → Product Advertising API
2. Wait for approval (usually 24h)
3. Once approved, you can render Amazon product **images** (currently we render text-only) — typically lifts CTR by 30-50%
4. Code update: `components/affiliate/AmazonProductGrid.tsx` — swap text-only cards for image cards. Spec it before building.

### 3.3 Apply for Hilton Honors (currently in design)

Per [`docs/superpowers/specs/2026-05-21-hilton-honors-landing-design.md`](../superpowers/specs/2026-05-21-hilton-honors-landing-design.md): Hilton Honors HHI landing page already designed. Once that ships, apply to the Hilton Honors affiliate program — your brand name (Hilton Ahead) likely earns auto-approval given the obvious topical match.

---

## Phase 4 — Ongoing maintenance

### 4.1 Monthly check (30 min)

Last day of each month:
1. Visit each network dashboard, log commission + clicks
2. Update `docs/sales-ops/affiliate-accounts-inventory.md` Changelog
3. Run the page-placement audit:
   ```bash
   grep -rc "<AffiliateCard programId" app/ --include='*.tsx' | grep -v ':0$' | sort -t: -k2 -n -r
   ```
4. Compare top-revenue programs to top-placement counts — gaps indicate undermonetized pages

### 4.2 Quarterly Amazon ASIN audit

Per `data/amazonProducts.ts` file-level comment:
1. Spot-check 5 random ASINs
2. Confirm each is in-stock and the deeplink returns 200
3. Replace any 404s with search URLs (`amazon.com/s?k=...`) — still pays commission
4. Update `dateAuditedAt` in any modified entries

### 4.3 Quarterly approval-review

Some networks pause publishers with low activity. Once per quarter:
1. Confirm each program shows "Active" in its dashboard
2. For any "Paused" status: usually a 60-day cure period. Push at least 1 click via the program to reactivate

---

## Cheat sheet — env vars + dashboards

Copy this into a password manager or your private notes:

| Program | Env var | Dashboard | Get-ID path |
|---|---|---|---|
| Amazon | `AFFILIATE_AMAZON_TAG` | [associates.amazon.com](https://associates.amazon.com) | Account → Manage Tracking IDs |
| Booking.com | `AFFILIATE_BOOKING_AID` | [partner.booking.com](https://partner.booking.com) | Account → Affiliate ID |
| Expedia | `AFFILIATE_EXPEDIA_CAMREF` | [console.partnerize.com](https://console.partnerize.com) | Reports → My Account |
| Vrbo | `AFFILIATE_VRBO_CAMREF` | Same as Expedia | Same |
| Viator | `AFFILIATE_VIATOR_PID` | [viatoraffiliate.com](https://viatoraffiliate.com) | Account → Partner ID |
| GetYourGuide | `AFFILIATE_GETYOURGUIDE_PARTNER_ID` | [partner.getyourguide.com](https://partner.getyourguide.com) | Profile → Partner ID |
| GolfNow | `AFFILIATE_GOLFNOW_CAMREF` | [app.impact.com](https://app.impact.com) | Brands → GolfNow → Get Link → CampRef |
| Marriott | `AFFILIATE_MARRIOTT_AID` | [app.impact.com](https://app.impact.com) | Brands → Marriott → Get Link → SubID |
| Allianz | `AFFILIATE_ALLIANZ_CAMREF` | [app.impact.com](https://app.impact.com) | Brands → Allianz → Get Link → CampRef |
| Hertz | `AFFILIATE_HERTZ_CAMREF` | [app.impact.com](https://app.impact.com) | Brands → Hertz → Get Link → CampRef |
| Peter Millar | `AFFILIATE_PETERMILLAR_CAMREF` | [app.impact.com](https://app.impact.com) | Brands → Peter Millar → Get Link → CampRef |

---

## Success metrics

From [`impact-partners-priority.md`](./impact-partners-priority.md):

| Window | Goal | Measured by |
|---|---|---|
| **30 days** | All 11 existing programs verified active (env vars set, clicks landing in dashboards). First commission recorded across ≥2 programs. | Vercel env var audit; network dashboards |
| **60 days** | 6 Tier A networks applied (CJ, Awin, Skimlinks, Avis, TravelInsurance.com, InsureMyTrip). 15 pages have missing-card gaps filled. Affiliate revenue ≥$500/mo. | Application status + grep `<AffiliateCard` count |
| **90 days** | Amazon 3-sale floor met. Affiliate revenue ≥$2K/mo run rate. Travel-insurance attach ≥5% on `/cost-of-hilton-head-trip`. | Amazon dashboard + Impact monthly P&L |

**If 60-day revenue < $250:** the issue isn't programs, it's traffic. Pause new applications and ship 2 high-intent SEO pages instead. Re-evaluate at 90 days.

---

## Common watch-outs

1. **Amazon 3-sale floor.** Account auto-closes if no qualifying sales in 180 days from approval. `/hilton-head-packing-list` (in progress) is the direct mitigation.
2. **Vercel env vars deploy lazily.** Always trigger a redeploy after adding/changing an env var. Wait 5 min, then verify with `curl` on production.
3. **Impact Radius camref naming.** Different from Partnerize. If you see `camref=` in URLs but the dashboard expects `subid`, the env var value is in the wrong format — re-paste from the Impact "Get Link" generator, not from a URL.
4. **Booking.com AID format.** Numeric only, no prefix. If you accidentally paste the full URL, links break silently.
5. **Partnerize Expedia/Vrbo.** Wraps URLs through `prf.hn` — clicks not registered there mean wrong publisher ID or wrong camref format.
6. **Pre-existing dashboard cookies.** When you visit your own affiliate dashboards from the same browser that visits the site, your clicks count as your own (fraud control). Use an incognito window or a different browser to test outbound link tracking.
7. **FTC disclosure scaling.** `<AffiliateDisclosure>` is generic — it works for 11 programs and will work for 25+. Watch for the disclosure becoming a wall of text only if you start naming every individual partner in the disclosure copy (don't).

---

## File pointers

- **Code:** `data/affiliateLinks.ts`, `app/lib/affiliates.ts`, `components/affiliate/`
- **Env documentation:** `.env.example` (lines 113-156)
- **Admin dashboard:** `/admin/affiliates` (clicks per program, last 30 days)
- **DB schema:** `supabase/migrations/` — search for `affiliate_events` table
- **Strategy:** `docs/sales-ops/impact-partners-priority.md`
- **Inventory:** `docs/sales-ops/affiliate-accounts-inventory.md`
- **This plan:** `docs/sales-ops/affiliate-next-steps-2026-05-26.md`
