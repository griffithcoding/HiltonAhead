# Partnerize Verification Walkthrough

**Goal:** End-to-end confirm that clicks on Expedia/Vrbo cards on hiltonahead.com flow through Partnerize and report to publisher ID `1110l31904`, with pubref attribution showing the source page.

**Time required:** 10 minutes active + 24-hour wait window for dashboard reporting.

**Last verified:** [you, post-PR-#57-deploy]

---

## Step 1 — Confirm the URL shape on the live site

Open `https://www.hiltonahead.com/cost-of-hilton-head-trip` in an incognito browser window.

Scroll to the section near the bottom titled **"If you'd rather book direct"**. You should see two cards: one for **Vrbo** and one for **Expedia**.

**Right-click the Expedia card link → Copy link address.**

The URL should look exactly like this shape:

```
https://prf.hn/click/camref:1110l31904/pubref:cost-of-trip-expedia/destination:https%3A%2F%2Fwww.expedia.com%2FHotel-Search%3Fdestination%3DHilton%2BHead%2BIsland%252C%2BSC
```

### What you're checking
- ✅ Starts with `https://prf.hn/click/`
- ✅ Contains `camref:1110l31904`
- ✅ Contains `pubref:cost-of-trip-expedia`
- ✅ Ends with `destination:` followed by a URL-encoded expedia.com link

### If the URL doesn't match

| Problem | Cause | Fix |
|---------|-------|-----|
| `camref:` is missing | `AFFILIATE_EXPEDIA_CAMREF` env var didn't reach the build | Vercel → Settings → Environment Variables → confirm value is set for Production. Trigger a redeploy. |
| `camref:` shows different number | Old env value cached in Vercel build | Clear Vercel build cache. Redeploy. |
| `pubref:` is missing | Deploy is pre-PR #57 | Wait for latest deploy to complete. Confirm `gh pr view 57` shows MERGED. |
| URL goes directly to expedia.com with `?siteid=` or `?camref=` query stamp | Code is using legacy query-stamp pattern instead of prf.hn wrap | `data/affiliateLinks.ts` Expedia entry missing `linkPattern: 'partnerize-wrap'`. Should be impossible if PR #54 merged. |

---

## Step 2 — Perform a controlled test click

Still in incognito. From the same page:

1. Click the Expedia card link
2. Watch the URL bar — it should briefly show `prf.hn/click/...` then redirect to `expedia.com/Hotel-Search?...`
3. **Land on expedia.com** — the search results page for Hilton Head Island hotels

### Note the timestamp
Write down (or screenshot):
- Date + time of click (your local time)
- Which card you clicked (Expedia or Vrbo)
- Which page you clicked from (e.g., /cost-of-hilton-head-trip)

You'll match this against the Partnerize dashboard in Step 4.

### Repeat with one Vrbo card

Open `https://www.hiltonahead.com/hilton-head-vs-kiawah` → scroll to "If you'd rather book direct" → click Vrbo card → land on vrbo.com.

Two test clicks total. Different surfaces, different programs (Expedia + Vrbo). This validates both networks AND the pubref attribution.

### Why incognito

Partnerize and Expedia both cookie-track. If you have an existing Expedia session, the click may attribute to the prior cookie and not register cleanly. Incognito clears that.

---

## Step 3 — Locate the right report in Partnerize

The Expedia Group dashboard you logged into is `expediagroup.com` Travel Creator Program — that's the Partnerize-powered backend.

**Important:** the **"Link history"** view in the sidebar is ONLY for links you manually built via the Link Builder tool. Our code generates links programmatically, so they won't appear there. Look elsewhere.

### Where to actually look

The dashboard tabs from your earlier screenshot:

```
Dashboard
Performance        ← clicks + bookings live here
Link history       ← only manually-built links; ignore for our use case
Payouts
Tools:
  Travel Shop
  Creator Toolbox
  Link builder
  Link Switcher
  Search widgets
  Banners
```

**Click "Performance"** in the left sidebar. That's where reporting lives.

### What you should see (after 24h)

The Performance view should show:
- **Total clicks** (a number, with daily breakdown)
- **Total bookings** (initially zero — booking only counts when someone completes a stay)
- **Total commission** (zero until first booking)

If you see "0 clicks" → either nobody has clicked yet OR the clicks aren't tagging right. Use Step 4 to dig in.

---

## Step 4 — Verify the pubref attribution

Inside **Performance** → look for a filter or column called one of:

- `pubref`
- `Sub-publisher`
- `Sub ID`
- `Tracking ID`
- `Page details`
- `Custom parameter`

Click that column. You should see your test clicks listed with the pubref values:

```
cost-of-trip-expedia          1 click
compare-hilton-head-vs-kiawah-vrbo  1 click
```

### If pubref column isn't visible

Click "Customize columns" or the settings gear in the table header → enable the pubref / Sub ID column.

If the dashboard genuinely has no pubref column anywhere → open a Partnerize support ticket asking how Sub IDs are surfaced in the Creator Program UI. Some Partnerize tenant configurations hide it by default.

---

## Step 5 — Set up daily monitoring

While you're in the dashboard:

1. **Reports → Scheduled Reports** (or "Email subscriptions")
2. Subscribe to **Daily click summary** to your inbox
3. Subscribe to **Weekly earnings** as well

This eliminates needing to remember to log in.

---

## Step 6 — Confirm payment + tax setup

**Critical** — without this, Partnerize holds your earnings indefinitely.

1. Top-right menu (your name / avatar) → **Account** or **Settings**
2. **Tax Forms** → submit W-9 (US individual or LLC) or W-8BEN (non-US)
3. **Payment Details** → add direct deposit / ACH bank info
4. **Payment threshold** → set to minimum (usually $50)

Until both tax + payment are configured, the "Payouts" tab will show "Pending — payment details required" regardless of how much you've earned.

---

## Common failure modes

### "I clicked but I see 0 clicks in Performance"

- Wait 24 hours before declaring failure. Click data has a reporting lag.
- Make sure your test clicks were in incognito AND that you actually landed on expedia.com / vrbo.com (not on a 404 or redirect-loop).
- Try Step 1 URL inspection — if the live URL is missing `camref:` then the click was never attributed.

### "Clicks show, but pubref column is blank"

- Most likely cause: deploy hasn't picked up PR #57 yet. Confirm:
  ```bash
  gh pr view 57 --json mergedAt
  ```
  Should show a mergedAt date. Vercel auto-deploys main after merge, but the deploy itself takes 2-5 minutes.
- Hard refresh hiltonahead.com (Ctrl+Shift+R) and re-inspect a URL via Step 1.
- If URL has pubref but dashboard doesn't show it, check Step 4 for the right column / filter setting.

### "I see clicks but the URLs in 'Link history' show different camref"

- "Link history" is the wrong tab — see Step 3. Our code doesn't create entries there.

### "Booking shows but commission says $0"

- Commission only finalizes after the stay is *completed*, not booked. Typical 30-90 day lag.
- Commission may also show as "Pending" until Expedia's accounting reconciles (usually monthly).

### "Partnerize says my account is inactive / contract paused"

- Top-right → **Account** → check campaign status. Each brand (Expedia, Vrbo, Hotels.com) is a separate campaign contract.
- If any shows "Paused" or "Pending review" → re-apply or contact support.

---

## When you're done

You'll know verification is complete when:

- ✅ Step 1 URL inspection: `prf.hn/click/camref:1110l31904/pubref:.../destination:...` shape confirmed
- ✅ Step 2 test clicks: 2 clicks fired through prf.hn redirect, landed on Expedia + Vrbo
- ✅ Step 4 (within 24h): Performance shows your 2 test clicks
- ✅ Step 4 (within 24h): Pubref column shows `cost-of-trip-expedia` + `compare-hilton-head-vs-kiawah-vrbo`
- ✅ Step 5: Daily report email subscribed
- ✅ Step 6: Tax + payment details set

Once all six are checked, the pipeline is live and you can stop checking until first real organic click + booking.

---

## After verification — first 30 days

Watch these signals:
1. **Click volume by pubref** — which pages are actually driving traffic
2. **Click-to-booking conversion rate** — should be 1-3% for travel
3. **Average commission per booking** — varies wildly; Expedia stays often $20-$60
4. **Cookie attribution window** — Expedia is 7 days, Vrbo is 30 days

If any pubref has 100+ clicks and 0 bookings after 30 days → wrong-fit page; replace the Expedia/Vrbo card with Booking on that page.

If overall click-to-booking sits below 0.5% → consider whether prf.hn redirect is too jarring; some affiliates use ".prf.hn" subdomain redirects which feel less spammy. Open a Partnerize support ticket asking about "branded redirect domains."
