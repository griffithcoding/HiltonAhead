# Affiliate Summary — Quick Reference

**Date:** 2026-06-01
**Owner:** William Griffith
**Full plan:** [`affiliate-next-steps-2026-05-26.md`](./affiliate-next-steps-2026-05-26.md)
**Inventory:** [`affiliate-accounts-inventory.md`](./affiliate-accounts-inventory.md)

This is the at-a-glance card. Everything below maps to the full plan.

---

## Where things stand

- **Code + infrastructure:** ✅ Done. 11 programs registered, FTC-compliant components live, click tracking → Supabase, admin dashboard at `/admin/affiliates`.
- **Revenue gate:** ⚠️ Blocked on 3 things you control: (1) env vars, (2) pending approvals, (3) card placements.
- **Hard deadline:** Amazon 3-sale floor — account auto-closes if no qualifying sales within 180 days of approval. `/hilton-head-packing-list` is the mitigation page.

---

## Phase 0 — What you need to VERIFY this week

### ✅ Env vars — only 2 missing

Everything else is already set. Add these two in Vercel → Settings → Environment Variables (Environment = **Production**):

| Env var | Get value from | Format |
|---|---|---|
| `AFFILIATE_BOOKING_AID` | partner.booking.com → Account → Affiliate ID | 7-digit number, no prefix |
| `AFFILIATE_AMAZON_TAG_TRIP` | associates.amazon.com → Manage Tracking IDs (create new) | `hiltonahead-trip-20` |

> Already set: `AFFILIATE_AMAZON_TAG`, `AFFILIATE_MARRIOTT_AID`, `AFFILIATE_EXPEDIA_CAMREF`, `AFFILIATE_VRBO_CAMREF`.
> `AFFILIATE_AMAZON_TAG_TRIP` is optional — if unset, it falls back to the primary Amazon tag. Set it only if you want per-page reporting on the packing-list page.

After adding: trigger a redeploy (Vercel usually auto-redeploys on env change; if not, push any commit).

### ✅ Verify clicks are landing (24–48h after redeploy)

1. Confirm env vars deployed:
   ```bash
   vercel env ls --environment=production | grep AFFILIATE
   ```
2. Confirm rendered links carry tracking params:
   ```bash
   curl -s https://www.hiltonahead.com/cost-of-hilton-head-trip | grep -oE 'href="[^"]*(prf\.hn|booking\.com|amazon\.com)[^"]*"' | head -10
   ```
   Expect hrefs with `?aid=`, `?tag=`, or `prf.hn/click/...`
3. Check each network dashboard for clicks (use **incognito** — your own browser's clicks get filtered as fraud control):
   - Amazon → Reports → Earnings
   - Booking.com → Statistics → Clicks
   - Marriott (Impact) → Reports → Click Report
   - Expedia/Vrbo (Partnerize) → Reports → Click report

   **0 clicks after 48h of traffic = env var or tracking format is wrong.** Re-check.

### ✅ Verify status of 6 pending program applications

> ⚠️ **CORRECTED 2026-06-01 (web-verified).** The original "all on Impact" mapping was wrong — those were stub assumptions, never confirmed. Real networks below. Only GetYourGuide was correct.

| Program | Real network | Where to apply / log in | Notes |
|---|---|---|---|
| **Allianz** | **CJ Affiliate** | cj.com → Advertisers → "Allianz" | NOT Impact. Apply inside CJ (Phase 1.1). ~$12–25/sale, 45-day cookie |
| **Hertz** | **CJ Affiliate** | cj.com → Advertisers → "Hertz" (advID 3739701) | NOT Impact. 3% / 24h cookie. Avis is the backup |
| **Viator** | **Viator Partner Program** (own portal) | **partners.viator.com/signup** | NOT viatoraffiliate.com. Sign up w/ Tripadvisor account; 8–12% |
| **GetYourGuide** | **Own self-serve** (also on Awin) | partner.getyourguide.com/signup | ✅ Only one the doc got right. Min 8%, 30-day cookie |
| **GolfNow** | **Own program** (not on major networks) | golfnow.com/business-partnership (form) or affiliate.gnsvc.com (API) | Manual/gatekept. $3/round. May not be worth chasing |
| **Peter Millar** | **Unclear** — Sovrn/VigLink aggregator; no clear public direct program | Try AvantLink/Awin; or monetize via Skimlinks/Sovrn | Low priority. Better golf-apparel play: Titleist/PXG via CJ |

For each: **Approved** → grab the network's tracking ID, paste into the matching Vercel env var. **Pending** → wait (don't re-apply). **Declined** → use backup (Avis for Hertz, TravelInsurance.com for Allianz).

> 🐛 **Code follow-up:** `data/affiliateLinks.ts` stamps Impact's `camref` + `irgwc=1` format on `allianz`, `hertz`, `golfnow`, `petermillar`. These are NOT Impact programs — the link pattern won't track once approved. Rewrite per real network (CJ deeplink for Allianz/Hertz, Viator `pid`, GolfNow own format) **before** placing cards that depend on them. No revenue flowing yet, so not blocking — but it can't earn as-is.

---

## What's next after Phase 0

| Phase | When | What |
|---|---|---|
| **Phase 1** | Week 1–2 | Apply to 6 Tier A networks: CJ Affiliate, Awin, Skimlinks, Avis, TravelInsurance.com, InsureMyTrip. Same-day, ~2h of forms. Narrative template in full plan §1.1. |
| **Phase 2** | Week 2–4 | Fill 15-page placement gap (lodging, insurance, golf, activity pages). Likely 2–3× revenue with zero new programs. |
| **Phase 3** | Month 2 | Tier B apps (Vineyard Vines, REI, Yeti via CJ) + Amazon PA-API (product images, once 3-sale floor met) + Hilton Honors. |
| **Phase 4** | Ongoing | Monthly dashboard check + placement audit; quarterly ASIN audit + approval review. |

---

## Cheat sheet — all 11 programs

| Program | Env var | Status |
|---|---|---|
| Amazon | `AFFILIATE_AMAZON_TAG` | ✅ Set |
| Booking.com | `AFFILIATE_BOOKING_AID` | ⚠️ **Missing — add this** |
| Amazon (trip placement) | `AFFILIATE_AMAZON_TAG_TRIP` | ⚠️ **Optional — add for reporting** |
| Expedia | `AFFILIATE_EXPEDIA_CAMREF` | ✅ Set |
| Vrbo | `AFFILIATE_VRBO_CAMREF` | ✅ Set |
| Marriott | `AFFILIATE_MARRIOTT_AID` | ✅ Set |
| Viator | `AFFILIATE_VIATOR_PID` | ⏳ Pending approval |
| GetYourGuide | `AFFILIATE_GETYOURGUIDE_PARTNER_ID` | ⏳ Pending approval |
| GolfNow | `AFFILIATE_GOLFNOW_CAMREF` | ⏳ Pending approval |
| Allianz | `AFFILIATE_ALLIANZ_CAMREF` | ⏳ Pending approval |
| Hertz | `AFFILIATE_HERTZ_CAMREF` | ⏳ Pending approval |
| Peter Millar | `AFFILIATE_PETERMILLAR_CAMREF` | ⏳ Pending approval |

---

## Success metrics

| Window | Goal |
|---|---|
| **30 days** | All 11 programs verified active; first commission across ≥2 programs |
| **60 days** | 6 Tier A networks applied; 15 placement gaps filled; revenue ≥$500/mo |
| **90 days** | Amazon 3-sale floor met; revenue ≥$2K/mo run rate; insurance attach ≥5% on cost page |

**If 60-day revenue < $250:** it's a traffic problem, not a program problem. Pause applications, ship 2 high-intent SEO pages.

---

## Top watch-outs

1. **Amazon 3-sale floor** — 180-day clock. Packing-list page is the fix.
2. **Vercel env vars deploy lazily** — always redeploy, wait 5 min, verify with curl.
3. **Booking.com AID = numeric only** — paste the full URL by mistake and links break silently.
4. **Test in incognito** — your own clicks from a browser logged into the dashboard get filtered.
