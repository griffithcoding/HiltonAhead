# Partnerize Direct Publisher Application Walkthrough

**Goal:** Get a direct Partnerize publisher account that exposes raw camref URLs, so our existing prf.hn-wrap code works without per-URL Link Builder ceremony.

**Current state:** Approved in Expedia Group Travel Creator Program (which is Partnerize-powered but constrained). Need direct publisher access.

**Time:** 30 min to fill out application. **2–4 weeks** for review.

**Application URL:** https://www.partnerize.com/en/become-partner

---

## Why this is worth doing

| With Creator Program only | With direct Partnerize publisher access |
|---|---|
| Manual Link Builder for every URL | Programmatic camref wrapping — every link auto-tracks |
| 10 hardcoded links cover ~10 surfaces | Unlimited dynamic surfaces (neighborhood pages, comparison pages, blog post mentions) |
| Stuck on Expedia Group brands only | Access to dozens of advertisers on Partnerize network |
| No real pubref reporting in dashboard | Full SubID / pubref click reports |
| Cap on what you can earn | No cap |

The code we already shipped (PR #54 + #57) was built for direct publisher pattern. It works the second you have a valid camref. So this application is the "unlock the rest of the system" step.

---

## Pre-application checklist — gather these first

You'll fill faster if you have these in one tab.

### Site facts
- **Domain:** hiltonahead.com
- **Site type:** Editorial travel consultancy + blog + directory
- **Vertical:** Travel & tourism (specifically: destination guide + booking advisory)
- **Geographic focus:** Hilton Head Island, SC + Lowcountry, USA
- **Years operating:** Since [start year — fill in]
- **Page count:** ~75+ live pages (50 marketing + blog + comparison + by-the-numbers + directory)

### Traffic numbers (estimate honestly — Partnerize will check)

Open Google Search Console + Google Analytics → pull last 30 days:
- **Monthly unique visitors:** ______
- **Monthly pageviews:** ______
- **Top traffic source:** Google organic (likely)
- **Geographic split:** US-heavy, Southeast + Northeast + Midwest

If under 5k monthly visitors, the application is harder but not impossible. Lead with **intent quality**, not volume: travelers searching "Hilton Head villa rental" convert at 5–10× a general travel site visitor.

### Business facts
- **Legal entity name:** Hilton Ahead Travel Co.
- **Business type:** LLC / sole prop / corporation (whichever applies)
- **Tax ID (EIN or SSN):** [your EIN]
- **Bank:** [routing + account number for ACH]
- **Address:** Hilton Head Island, SC — full mailing address
- **Tax form:** W-9 (US-based)

### Content samples (have URLs ready)
Best to point at proof of editorial substance:
- https://www.hiltonahead.com/hilton-head-by-the-numbers (60-fact reference page — looks legit)
- https://www.hiltonahead.com/blog/hilton-head-restaurants-ranked-2026 (long-form editorial)
- https://www.hiltonahead.com/best-hilton-head-resort-comparison (decision-stage content)
- https://www.hiltonahead.com/founder (E-E-A-T — real human, 30 years on island)

### How you promote (one sentence each)
- **Organic search:** SEO-optimized destination guides, comparison pages, monthly weather pages
- **Email newsletter:** Insider Club, $9/mo subscription + free tier
- **Social:** Instagram primary, building presence
- **Paid ads:** None currently (mention this — Partnerize sometimes restricts paid-search affiliates)

---

## Step-by-step application

### Step 1 — Go to the application

https://www.partnerize.com/en/become-partner

Click **"Apply now"** or **"Get started"** (button copy varies).

### Step 2 — Account type

Select **"Affiliate / Publisher"** (not "Advertiser" — that's for brands looking to recruit affiliates).

### Step 3 — Account details

| Field | Answer |
|-------|--------|
| Company name | Hilton Ahead Travel Co. |
| Website URL | https://www.hiltonahead.com |
| Country | United States |
| Email | hello@hiltonahead.com (or your business email) |
| Phone | [your business phone] |

### Step 4 — Site profile

| Field | Answer |
|-------|--------|
| Site category | Travel — Destination Guide / Travel Advisory |
| Site description | Locally-run travel consultancy for Hilton Head Island, South Carolina. Published editorial guides, neighborhood comparisons, monthly weather data, and an island business directory. Audience is high-intent US travelers actively planning a Hilton Head trip. |
| Monthly unique visitors | [your honest number] |
| Monthly pageviews | [your honest number] |
| Geographic audience | US-primary, ~80% Southeast US |
| Monetization channels | Affiliate links, sponsored partner listings, paid consultancy services, paid newsletter subscriptions |

### Step 5 — How you promote (narrative box)

If they ask for a free-form description of how you'll promote partner brands, paste something like:

> Hilton Ahead Travel Co. is an editorial site focused exclusively on Hilton Head Island, South Carolina — written and operated by a 30-year island resident. We monetize through three channels: (1) affiliate revenue from contextual links on our 70+ content pages, (2) sponsored partner placements with local Hilton Head businesses, and (3) paid travel consultancy services. We do not engage in paid search bidding on advertiser brand keywords, do not use coupon/discount-code spam tactics, and do not run pop-ups or interstitials. Every affiliate link carries FTC-required `rel="sponsored nofollow"` and a visible disclosure block. We're looking to partner with Expedia, Vrbo, Hotels.com, Booking.com, and other lodging + experience networks to monetize our existing high-intent destination traffic.

### Step 6 — Tax + payment

| Field | Answer |
|-------|--------|
| Tax form | W-9 (US individual / LLC / S-corp — whichever applies) |
| EIN or SSN | [your tax ID] |
| Payment method | ACH / direct deposit (fastest) |
| Bank routing | [routing #] |
| Bank account | [account #] |
| Payment threshold | $50 (set to minimum) |

### Step 7 — Verticals of interest

Partnerize will ask which advertiser categories you want to partner with. Check all that apply but emphasize:

- ✅ **Travel — Lodging** (Expedia, Vrbo, Booking, Hotels.com)
- ✅ **Travel — Tours & Activities** (Viator if available on Partnerize, GetYourGuide alt)
- ✅ **Travel — Insurance** (Allianz alt — they may be on Partnerize as well)
- ✅ **Apparel** (if you want Peter Millar etc. — they're actually on Impact, but Partnerize has similar)

### Step 8 — Submit + wait

Once submitted, expect:
- **Auto-acknowledgment email** within minutes
- **First human review** within 3–5 business days
- **Possible follow-up questions** (5–10 min to answer)
- **Final decision** in 2–4 weeks

---

## What to do during the wait

The application is in flight. Meanwhile (Path C immediate-revenue plan):

### Generate 5 hardcoded Link Builder links

In your Expedia Creator Program dashboard right now:

1. Click **Link Builder** in left sidebar
2. Paste each of these 5 URLs one at a time, generate the tracked short link, copy result
3. Paste all 5 back to me

```
1. https://www.expedia.com/Hotel-Search?destination=Hilton+Head+Island%2C+SC
2. https://www.vrbo.com/vacation-rentals/usa/south-carolina/lowcountry-and-resort-islands/hilton-head-island
3. https://www.vrbo.com/vacation-rentals/usa/south-carolina/lowcountry-and-resort-islands/hilton-head-island/sea-pines
4. https://www.vrbo.com/vacation-rentals/usa/south-carolina/lowcountry-and-resort-islands/hilton-head-island/palmetto-dunes
5. https://www.expedia.com/Hilton-Head-Island-Hotels.d6049791.Travel-Guide-Hotels
```

Once you paste the 5 generated short links, I:
1. Add them to `data/affiliateLinks.ts` as hardcoded `deeplink` values per surface
2. Wire them into the 5 highest-traffic pages
3. Ship as a small PR

Result: revenue flows immediately via Creator Program, even before Partnerize approves you.

---

## If Partnerize rejects you

Happens to ~30–40% of applicants on first pass for smaller sites. Three responses in order:

### Re-apply in 60–90 days

Build a 60-day affiliate revenue history through the Creator Program first. Show:
- Real click volume (whatever you've earned)
- Proof of FTC compliance
- Newer content (more pages, more depth)

Re-application with proof of revenue + compliance usually clears the bar.

### Or: apply via Impact instead

If you got approved for Allianz / Hertz / Peter Millar / Marriott Bonvoy earlier, those are on **Impact.com** (different network from Partnerize). You can also apply to:

- **Hotels.com via Impact** (some advertisers run on both)
- **Avis** (Impact)
- **TravelInsurance.com** (Impact)
- **InsureMyTrip** (Impact)

Impact's bar is lower than Partnerize. Run both networks in parallel — they don't conflict.

### Or: apply to CJ Affiliate / Awin / Skimlinks

Master networks with hundreds of advertisers each. Lower individual-advertiser approval friction once you're in the network. Already in your Tier A application list per the monetization playbook.

---

## After approval

Partnerize will email you with:
1. **Login credentials** for `console.partnerize.com`
2. **Your real camref** — looks like `1011lABCDE` typically
3. **First campaign opt-ins** — apply to Expedia, Vrbo, Hotels.com individually within Partnerize console (separate contracts from the Creator Program)

When you have the real camref:
1. Update `AFFILIATE_EXPEDIA_CAMREF` in Vercel from `1110l31904` to the new value
2. Update `AFFILIATE_VRBO_CAMREF` to the same (or its own if separate)
3. Redeploy Vercel (auto on env var change)
4. Re-run the Step 1 URL verification — `prf.hn/click/camref:NEW_VALUE/...` should now resolve to a valid contract
5. Remove the hardcoded Creator Program links (they were a temporary bridge)

---

## Tracking the application

Once submitted, save these to a note:
- **Application date:**
- **Confirmation number / email subject:**
- **Reviewer contact (if assigned):**
- **Follow-up dates:**
- **Decision date:**

If 4 weeks pass with no response, email Partnerize publisher support directly with your application details to escalate.
