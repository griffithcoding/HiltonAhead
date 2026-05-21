# Restaurant Hub — Integrations Amendment

**Date:** 2026-05-20
**Status:** Amends [2026-05-20-restaurant-hub-design.md](2026-05-20-restaurant-hub-design.md). Approved verbally; spec amendment locks scope.
**Trigger:** User asked for third-party integrations (Google, Facebook check-ins, social media) to be aggregated on each restaurant page so the data product is saleable to businesses.

## 1. What changed

Add **three public-API integrations** to each Restaurant Hub deep page, surfacing aggregated social proof + busy indicators in a single block. Businesses subscribe partly because Hilton Ahead becomes the single source where they don't have to chase metrics across 5 platforms.

## 2. What's IN

| Source | What we pull | Where it renders | Cost |
|---|---|---|---|
| **Google Places API** | Star rating, total review count, "Open now" status, Popular Times busy indicator, opening hours (if more current than `Business.hours`) | New "Social proof" block on the deep page + small "Busy now" chip in the hero | $0 free tier (5k/mo requests, more than enough at v1 traffic) |
| **Yelp Fusion API** | Star rating, total review count, top 3 review snippets, photo URL | "Social proof" block: rating chip + 1 review snippet pulled into editorial block | $0 free tier (500 calls/day) |
| **Foursquare Places** | Total check-in count, recent tip count | "Social proof" block: check-ins-this-month figure (this is what publicly visible "check-ins" actually is now) | $0 free tier (~50k/mo calls) |

**Display block design (new component `SocialProofBlock`):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SOCIAL PROOF                                                            │
│  ★ 4.5  Google  (213 reviews)                                           │
│  ★ 4.2  Yelp     (87 reviews)  "...the hush puppies are unreal..."     │
│  📍 1,420 check-ins this month on Foursquare                            │
│  ● Open now · Usually busy at this hour                                 │
│                                                                         │
│  Sources: Google · Yelp · Foursquare. Last refreshed 18 min ago.        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Hero chip:** below the price/cuisine chips, add one small "Busy now" or "Open now" pill driven by Google's Popular Times data.

## 3. What's OUT (and why)

| Source | Why we don't | Path forward |
|---|---|---|
| **Facebook check-ins** | Meta locked down Graph API post-Cambridge Analytica. Each business owner must individually OAuth-grant page-admin access to their FB Business Page. Founder cannot unlock this for clients at scale. | v1.1 paid-tier upsell: "Connect your FB" wizard that walks the business owner through OAuth. Adds their FB engagement data to their dashboard. Defer. |
| **Instagram** | Same Meta restrictions; requires per-account OAuth. Bonus complication: Meta deprecated the Instagram Basic Display API in late 2024 — only the Instagram Graph API (Business accounts only) is current. | Same as Facebook — v1.1 OAuth-gated upsell. |
| **TripAdvisor** | Paid API only (Content API requires partnership agreement + paid contract starting ~$5k/year). | Defer until directory MRR > $3k/mo justifies the cost. |
| **OpenTable reviews/availability** | Their public API surfaces only reservation availability, not aggregated reviews or check-ins. Already covered by the existing `reservationsLinks[]` in the spec. | Existing reservations link is the right v1 integration. |

## 4. Data model additions

Extend `Business` type in `data/localBusinesses.ts`:

```ts
export type Business = {
  // ... existing fields
  /** Google Places place_id — found via the Places API "Find Place" search. */
  googlePlaceId?: string;
  /** Yelp business_id — slug from yelp.com/biz/<id>. */
  yelpBusinessId?: string;
  /** Foursquare venue id — fsq_id from Foursquare Places API. */
  foursquareVenueId?: string;
};
```

Each restaurant in the directory needs at most these 3 ids populated for the integrations to fire. If any id is missing, that source is silently skipped for that restaurant (graceful degradation — page still renders).

## 5. Server-side fetch helpers

New module: `app/lib/restaurant/integrations/`

| File | Responsibility |
|---|---|
| `app/lib/restaurant/integrations/types.ts` | `SocialProofSnapshot`, `FetchResult<T>` (reuse pattern from `app/lib/today/types.ts`) |
| `app/lib/restaurant/integrations/google.ts` | `fetchGoogleSnapshot(placeId)` — rating, review count, busy now, open now |
| `app/lib/restaurant/integrations/yelp.ts` | `fetchYelpSnapshot(businessId)` — rating, review count, top review snippet |
| `app/lib/restaurant/integrations/foursquare.ts` | `fetchFoursquareSnapshot(venueId)` — check-in count, tip count |
| `app/lib/restaurant/integrations/aggregate.ts` | `fetchSocialProof(business)` — runs all three fetchers in parallel; returns combined `SocialProofSnapshot` |

All fetchers:
- Use Next.js `fetch(..., { next: { revalidate: 86400 } })` — 24h cache (these metrics don't change hour-to-hour)
- Return `FetchResult<T>` so failures are graceful
- Are called from the per-restaurant page's server component as part of the parallel-fetch block

## 6. Render component

New component: `components/local/restaurant/SocialProofBlock.tsx`

- Server component (no client interactivity needed)
- Receives `SocialProofSnapshot` aggregated result
- Renders any combination of the 3 sources that returned `ok: true`
- If all 3 failed/missing → renders nothing (silent degradation)
- "Last refreshed" stamp at the bottom
- Attribution required by Yelp ToS: "Powered by Yelp" with link back to the Yelp page

## 7. ToS / Compliance

| Source | ToS requirement | Implementation |
|---|---|---|
| **Google Places** | Photos must use `photo_reference` not cached. Display Google attribution when showing place details. Cannot store rating data > 30 days. | Use the 24h `next.revalidate` (well under 30d). Add "Powered by Google" small attribution in `SocialProofBlock`. Don't render photos in v1 — use existing founder/owner gallery only. |
| **Yelp Fusion** | "Powered by Yelp" attribution + link back to Yelp business page. Cannot cache review text > 24h. | 24h `next.revalidate`. Visible "Powered by Yelp" link in the block. Review snippet linked back to the Yelp page. |
| **Foursquare Places** | Attribution per their Places API ToS. Check-in counts can be displayed. | Small "Foursquare" attribution in the block. |

All three attributions in one footer line at the bottom of the SocialProofBlock.

## 8. Operational requirements

New env vars to add to Vercel + `.env.local`:
- `GOOGLE_PLACES_API_KEY` (free tier; sign up at console.cloud.google.com)
- `YELP_API_KEY` (free; sign up at yelp.com/developers/v3)
- `FOURSQUARE_API_KEY` (free; sign up at developer.foursquare.com)

One-time per restaurant: populate `googlePlaceId`, `yelpBusinessId`, `foursquareVenueId` on each existing restaurant in `data/localBusinesses.ts`. Found via:
- Google: Place API "Find Place" search → returns `place_id`
- Yelp: yelp.com URL slug (e.g., `skull-creek-boathouse-hilton-head`)
- Foursquare: developer.foursquare.com → Places Search

11 restaurants × 3 lookups = ~30 minutes of founder data entry. Done once per restaurant; rarely changes.

## 9. Tracking

No new event types. The SocialProofBlock is server-rendered; clicks on attribution links use the existing `TrackedWebsiteLink` pattern with `business_id` + `event_type='website_click'` + `payload.source='google'|'yelp'|'foursquare'`.

## 10. Tasks to add to the Restaurant Hub implementation plan

Inserted between original Task 12 (founder review + menu link block) and original Task 13 (photo gallery):

| New task # | Title |
|---|---|
| 12a | Integrations: types module + env vars + business field extensions |
| 12b | Google Places fetcher |
| 12c | Yelp Fusion fetcher |
| 12d | Foursquare Places fetcher |
| 12e | Aggregate fetcher + SocialProofBlock component + wire into page |

(Original Task 13 onward shifts down by 5 task numbers in the execution sequence.)

## 11. Business value (the user's actual ask)

| Without integrations | With integrations |
|---|---|
| Restaurant page = founder review + menu link + photo gallery | Same + aggregated star ratings + check-in counts + busy-now indicator |
| Subscriber dashboard shows "X clicks to your page" | Subscriber dashboard shows "X clicks + your Google rating moved from 4.4 to 4.5 + check-ins up 12% MoM" |
| Sales pitch: "We send you traffic" | Sales pitch: "We aggregate the 4 places your customers compare you on — into the page they're already looking at" |
| Sponsor slot pricing | Same | Higher — page now shows real social-proof metrics, justifying premium ad placement |

This is **the** lever that makes the directory paid tier feel like real product, not a glorified listing.

## 12. Open questions / future work

- **v1.1: Facebook OAuth wizard** for paid subscribers who want to add their FB Page engagement to their dashboard. Per-business OAuth = real lift but enabled by paid-tier conversion.
- **v1.1: TripAdvisor partnership** — only justified at directory MRR > $3k/mo.
- **v1.1: Yelp review-snippet selection logic** — currently pulls "top 3" via the API's default sort. Could let founder hand-pick which snippet to surface per restaurant (override the API).
- **v1.1: Aggregated rating** — combine Google + Yelp ratings into a single weighted "Hilton Ahead score" displayed in the hero. Editorial value depends on how much weight you put in the average vs. picking one source.
- **v1.2: Per-business OAuth deck** — let the business owner connect their own Google Business Profile and Yelp account so we pull data with higher rate limits + private metrics (impressions, query volume).
