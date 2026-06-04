# Pivot — 2026-06: Stop Chasing OTA Affiliates, Consolidate Lodging to Stay22

**Decision date:** 2026-06-04
**Decision owner:** William Griffith (founder)
**Trigger:** Direct Partnerize publisher applications (Expedia, Vrbo, Hotels.com) all rejected — common for sub-5k-traffic sites on first pass. The Creator Program camref (`1110l31904`) does not resolve through `prf.hn` (returns "Invalid Link"), so the Expedia/Vrbo cards shipped earlier were live-broken on 14 surfaces.

---

## The decision, in one line

**Stop applying to gated OTA affiliate networks. Route 100% of lodging clicks through Stay22 — one easy-approval account that compares Booking, Vrbo, Airbnb, Expedia, and Hotels.com in a single search — and refocus revenue energy on the channels that already work and don't require anyone's approval.**

---

## Why

1. **The OTA-direct chase was negative ROI on time.** Weeks of applications, login loops, invalid-link debugging, tax-form hunts → zero working lodging commission, plus a live bug sending users to "Invalid Link."
2. **Stay22 already exists in the codebase** (`app/lib/stay22.ts`, `components/rentals/Stay22Map.tsx`) and covers MORE inventory than the three rejected Partnerize apps combined — including Airbnb, which has no public affiliate program at all.
3. **Stay22 approves nearly everyone** (it takes a slice of commission, so it wants publishers). No gating, no weeks of review.
4. **One channel beats five.** Managing Stay22 alone — one AID, one dashboard — is far less overhead than juggling Booking-direct + Partnerize + Impact + Creator Program + dead Expedia/Vrbo links.
5. **The comparison card is better UX** than a single-OTA card. "See live prices across Booking, Vrbo, Airbnb & Hotels.com" is genuinely more useful to the reader and on-brand for an honest, reader-first site.

---

## What changed in code (this PR)

Replaced **every** OTA-direct lodging card (`expedia`, `vrbo`, `booking`) across the site with a single honest Stay22 "compare booking sites" card. 16 placements across 9 files:

| Surface | Before | After |
|---------|--------|-------|
| 6× comparison pages (`ComparisonLanding`) | Vrbo + Booking pair | 1 Stay22 card |
| `/cost-of-hilton-head-trip` | Vrbo + Expedia pair | 1 Stay22 card |
| 8× trip-type pages (`data/tripTypes.ts`) | Booking + Vrbo pairs | 1 Stay22 card each |
| `/best-time-to-visit-hilton-head` | Vrbo + Booking pair | 1 Stay22 card |
| 6× neighborhood pages (`hilton-head/[slug]`) | Booking + Vrbo pair | 1 Stay22 card |
| `/hilton-head-stay-and-play` | Vrbo + Booking + GolfNow | 1 Stay22 + GolfNow |
| `/hilton-head-hurricane-season` | Booking + Allianz | 1 Stay22 + Allianz |
| `/hilton-head-tides` | Booking + Allianz | 1 Stay22 + Allianz |
| 12× weather-month pages (`weather/[month]`) | Booking + Amazon | 1 Stay22 + Amazon |

**Result:** zero `expedia`/`vrbo`/`booking` card references remain. The broken `prf.hn` links can no longer render (the code never takes the partnerize-wrap path because nothing references those programs). Bug fully cleared without needing to touch Vercel env vars.

Non-lodging programs untouched: **GolfNow** (tee times), **Allianz** (insurance), **Amazon** (gear) all stay as-is.

---

## The one action required to start earning

The Stay22 AID is currently unset — `app/lib/stay22.ts` falls back to `'PLACEHOLDER_AID'`, so every Stay22 link (including the existing vacation-rentals maps) earns $0.

**Do this once, ~10 minutes:**
1. Sign up at **stay22.com** → Publishers (near-instant approval)
2. Copy your **affiliate ID / AID** from the dashboard
3. Vercel → Settings → Environment Variables → add `NEXT_PUBLIC_STAY22_AID = <your AID>` (Production)
4. Redeploy

The moment that env var is set, all 16 new Stay22 cards **plus** the 7 vacation-rental-page maps start earning — across Booking, Vrbo, Airbnb, Expedia, and Hotels.com inventory.

---

## Cleanup (optional, low priority)

- **Unset** `AFFILIATE_EXPEDIA_CAMREF` and `AFFILIATE_VRBO_CAMREF` in Vercel — now inert (no code reads them), but tidy to remove.
- The `expedia` / `vrbo` program entries + `partnerize-wrap` helper code remain dormant in the repo. **Leave them.** If Partnerize ever approves on a 60-90-day re-application, setting a valid camref reactivates them with zero code work.

---

## Revenue reorientation — where the energy goes now

The pivot frees attention from the affiliate-approval treadmill. Ranked by control + proven traction (no third-party approval required):

| Channel | Status | Why it's the focus now |
|---------|--------|------------------------|
| **Consultancy services** ($295 / $895 / $2,500 tiers) | Live, Stripe-wired | Highest $/conversion. We set the price. No network gate. |
| **$49 itinerary packs** (couples, golf) | Live, Stripe-wired | Pure-margin digital product. We own delivery. |
| **Insider Club** ($9/mo, $99/yr) | Live | Recurring revenue. We're the seller. |
| **Local-business sponsorships / directory billing** | Live (`/sponsorships`, `/advertise`) | Placement revenue from Hilton Head businesses — sells visibility, not endorsement. |
| **Stay22** (lodging) | Wired; needs AID | One easy-approval lodging channel. Set it and forget it. |
| **Amazon Associates** (gear) | Active | Already earning; non-lodging, complements Stay22. |
| **GolfNow / Allianz** (Impact) | Wired | Tee times + insurance. Separate network, not affected by the Partnerize rejection. |

**Do NOT re-enter** the OTA-direct-application treadmill (Partnerize, Booking Partner Hub, individual Expedia brands) until there's a 60-90-day Stay22 + Amazon revenue history to attach to a re-application. Aggregators and low-bar networks first; gated networks only with proof in hand.

---

## Lesson learned (for the next monetization push)

Apply to **aggregators and low-bar networks first** (Stay22, Travelpayouts, Sovrn, Impact) — they approve fast and build the revenue history that gets you into gated networks (Partnerize, premium direct programs) later. Applying to gated networks cold, with a young site and no affiliate history, is the slow road that just cost two weeks for nothing.
