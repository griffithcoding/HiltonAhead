# Affiliate Recovery Plan — Post-Partnerize Rejection

**Date:** 2026-06-XX
**Trigger:** Direct Partnerize publisher applications (Expedia, Vrbo, Hotels.com) all rejected. Common for sub-5k-traffic sites on first pass — not a dead end.
**Status:** Creator Program account (`1110l31904`) still active but only works via Link Builder, not programmatic prf.hn wrap (returns "Invalid Link").

---

## TL;DR

The Partnerize rejection barely matters, because **Stay22 — already integrated in the codebase — covers the same lodging inventory (Booking, Vrbo, Airbnb, Expedia, Hotels.com) through one easy-approval account.** Three actions:

1. **STOP THE BLEEDING (today, 2 min):** Unset the broken Partnerize camref env vars so Expedia/Vrbo cards stop sending users to "Invalid Link."
2. **ACTIVATE STAY22 (today, 10 min):** Sign up at stay22.com, set `NEXT_PUBLIC_STAY22_AID` in Vercel. Activates lodging commission on 7 vacation-rental pages instantly.
3. **RE-ROUTE (this week, code):** Point the 11 dead Expedia/Vrbo cards at Stay22 instead. One PR.

---

## Why the rejection happened (so re-application succeeds later)

Partnerize rejects new publishers for predictable reasons:

| Reason | Was it us? | Fix for re-application |
|--------|-----------|------------------------|
| Insufficient traffic history | Likely — site is young, GSC history thin | Build 60-90 days of real traffic + revenue first |
| No prior affiliate track record | Likely — first network | Stay22 + Amazon revenue history = proof next time |
| Site looked "not ready" at review | Possible | Site has grown a lot since (vacation-rentals hub, tools, 90+ pages) — re-apply showing the bigger surface |
| Generic application narrative | No — we wrote a strong one | n/a |

**Re-apply to Partnerize in 60-90 days** once Stay22 + Amazon show real revenue. The same application that got rejected cold often clears with a revenue history attached.

---

## Action 1 — Stop the bleeding (URGENT, you, 2 min)

The live site has `AFFILIATE_EXPEDIA_CAMREF=1110l31904` set in Vercel. That camref returns "Invalid Link" through prf.hn. Every Expedia + Vrbo card is currently broken on these 11 pages:

- /cost-of-hilton-head-trip
- /hilton-head-vs-kiawah, /hilton-head-vs-charleston, /hilton-head-vs-myrtle-beach
- /sea-pines-vs-palmetto-dunes, /westin-vs-omni-hilton-head, /best-hilton-head-resort-comparison
- /hilton-head-golf-packages, /hilton-head-honeymoon, /hilton-head-thanksgiving, /bluffton-travel-planner

**Fix:** Vercel → Project → Settings → Environment Variables →
- Delete `AFFILIATE_EXPEDIA_CAMREF`
- Delete `AFFILIATE_VRBO_CAMREF`
- Redeploy (or wait for next deploy)

The code's fallback: when the env var is unset, `withAffiliateParams()` returns the raw destination URL. Cards become plain working links to expedia.com / vrbo.com — no commission, but no broken UX. Stops the credibility bleed instantly.

(Alternatively, Action 3's code change supersedes this by routing through Stay22 — but unsetting the env vars is the fastest stop-gap and is safe to do right now.)

---

## Action 2 — Activate Stay22 (today, you, ~10 min)

Stay22 is a hotel/rental affiliate aggregator. Their embeddable map + `allez` redirect engine white-labels Booking.com, Airbnb, Vrbo, Expedia, and Hotels.com inventory. They approve nearly all publishers because their model is taking a slice of your commission — they WANT you onboard.

### Sign up

1. Go to **https://www.stay22.com/** → "Sign up" / "Become a partner" / "Publishers"
2. Create account with hiltonahead.com
3. Approval is typically instant or same-day (vs Partnerize's weeks)
4. Find your **affiliate ID / AID** in the dashboard (often labeled "Your ID", "Publisher ID", or shown in a sample embed snippet as `aid=...`)

### Set the env var

The codebase already has everything wired — it just needs the AID value.

Vercel → Settings → Environment Variables → add:
```
NEXT_PUBLIC_STAY22_AID = [your Stay22 AID]
```
Set for **Production** (and Preview if you want PR previews to track). It's `NEXT_PUBLIC_` because it's embedded client-side in the map iframe — public by design, safe to expose.

Redeploy. The moment it's live:
- All 7 vacation-rental pages' Stay22 maps attribute to your AID
- Every `bestForLinks` Stay22 deeplink earns commission
- The rental cards' outbound links earn commission

### What Stay22 covers vs what you applied for

| You applied to Partnerize for | Stay22 covers it? |
|---|---|
| Expedia | ✅ (Expedia inventory in the aggregator) |
| Vrbo | ✅ |
| Hotels.com | ✅ |
| Booking.com | ✅ (bonus — you didn't even have direct Booking) |
| Airbnb | ✅ (bonus — Airbnb has no public affiliate program at all; Stay22 is the only way) |

**Stay22 gives you MORE lodging coverage than the three Partnerize applications combined would have.**

---

## Action 3 — Re-route the dead Expedia/Vrbo cards through Stay22 (this week, code)

Once Stay22 AID is live, the 11 Expedia/Vrbo `<AffiliateCard>` placements should point at Stay22 search deeplinks instead of broken prf.hn URLs. Options:

### Option A — Swap programId on the cards (simplest)
Change `programId="expedia"` / `programId="vrbo"` to `programId="stay22"` with a Hilton Head-centered deeplink. One edit in ComparisonLanding + cost page + the 4 trip-types. Small PR.

### Option B — Make Expedia/Vrbo programs fall back to Stay22 when their camref is unset (most robust)
In `withAffiliateParams()`, if a `partnerize-wrap` program has no tracking ID, route through the Stay22 engine instead of returning a bare URL. Keeps the existing card markup, centralizes the logic. Slightly more code.

**Recommendation: Option A now** (explicit, easy to review), revisit Option B if we ever get Partnerize approved and want to switch back cleanly.

When you confirm Stay22 AID is set, I'll ship the re-route PR.

---

## The broader affiliate map after this

| Program | Network | Status | Action |
|---------|---------|--------|--------|
| **Stay22** (Booking/Vrbo/Airbnb/Expedia/Hotels) | Stay22 | 🟢 Easy approval — DO THIS | Sign up + set AID |
| **Amazon Associates** | Amazon | 🟢 Active | Already earning |
| Expedia / Vrbo / Hotels.com direct | Partnerize | 🔴 Rejected | Re-apply in 60-90 days w/ revenue history |
| Booking.com direct | Booking Partner Hub | ⚪ Status unknown | Stay22 covers it — deprioritize direct |
| Marriott / Allianz / Hertz / Peter Millar / GolfNow | Impact | ⚪ Status unknown | Verify in Impact dashboard — these are a DIFFERENT network, not affected by Partnerize rejection |
| Viator / GetYourGuide | Direct | ⚪ Sparse | Re-verify; Viator approves most travel sites |
| Southwest / Hilton | Prebuilt link | ⚪ New | Confirm links are set |

### Easy-approval networks to apply to this week (don't repeat the Partnerize mistake of applying to gated networks first)

| Network | Why it approves small sites | URL |
|---------|----------------------------|-----|
| **Stay22** | Takes commission slice; wants publishers | stay22.com |
| **Travelpayouts** | Aggregator for flights+hotels+insurance+car; near-auto approval | travelpayouts.com |
| **Sovrn / Skimlinks** | Auto-converts existing links; low bar | sovrn.com |
| **Impact** | Lower bar than Partnerize; where Allianz/Hertz/etc already live | app.impact.com |
| **CJ Affiliate** | Network-level approval, then per-advertiser | cj.com/publishers |
| **Awin** | $5 refundable deposit, broad acceptance | awin.com/us/publishers |

**Lesson learned:** Apply to AGGREGATORS and low-bar networks FIRST (Stay22, Travelpayouts, Sovrn, Impact). They build the revenue history that gets you into gated networks (Partnerize, premium direct programs) later.

---

## Decommissioning note

Don't delete the Partnerize `linkPattern: 'partnerize-wrap'` code or the Expedia/Vrbo program entries. Leave them dormant (env vars unset). When you re-apply and get approved in 60-90 days, setting the env var to a valid camref reactivates everything with zero code work. The infrastructure was correct — only the camref was wrong.

---

## This week's checklist

- [ ] **Today:** Unset `AFFILIATE_EXPEDIA_CAMREF` + `AFFILIATE_VRBO_CAMREF` in Vercel (stop broken links)
- [ ] **Today:** Sign up at stay22.com, get AID
- [ ] **Today:** Set `NEXT_PUBLIC_STAY22_AID` in Vercel, redeploy
- [ ] **Today:** Verify a vacation-rentals page Stay22 map loads + outbound links carry your AID
- [ ] **This week:** Ship Option A re-route PR (Expedia/Vrbo cards → Stay22)
- [ ] **This week:** Apply to Travelpayouts + Sovrn + verify Impact status
- [ ] **60-90 days out:** Re-apply to Partnerize with Stay22 + Amazon revenue history attached
