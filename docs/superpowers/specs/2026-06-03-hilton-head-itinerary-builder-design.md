# Hilton Head Itinerary Builder ("Dream Week") — Design Spec

**Date:** 2026-06-03
**Owner:** William Griffith
**Status:** Approved concept ("Build B next") → design for build
**Strategic purpose:** The *monetization* counterpart to the Beach Day Planner. A free, shareable day-by-day trip builder whose real job is **lead capture** — "build your dream week → have a local book it" funnels high-intent planners into the concierge / planning-fee pipeline. Also: affiliate on activities + $49 itinerary-pack upsell.

---

## Scope decision (the key call)
**Generate + tweak, URL-state-driven, SSR** — NOT a heavyweight drag-and-drop builder.
- Pick trip length + trip type → the tool **generates a smart day-by-day itinerary** from the catalog → user **swaps/removes** activities per day.
- All state lives in the **URL** (`?days=5&type=family&lodging=standard&picks=...`) → server-renders the full plan (shareable + indexable + printable by default), with a small client island for the controls. Same pattern that made the Beach Day Planner clean.
- This captures ~90% of the value at ~30% of the effort/риск of drag-drop. (If we later want true drag-drop, it's a v2 on top of this.)

---

## What it does
1. Visitor sets **trip length** (3/4/5/7 days) + **trip type** (Family · Couples · Golf · Beach & Chill) + optional **lodging tier**.
2. Tool generates a **day-by-day itinerary** (morning / afternoon / evening slots) from the curated catalog, tuned to the trip type.
3. Visitor **swaps or removes** any activity (client controls update the URL).
4. Live **cost estimate** (lodging + activities + food) updates with the plan.
5. **Save / share / print** + two money CTAs: **"Have a local book this for you"** (→ concierge lead) and **"Skip the work — get the $49 pack"** (→ itinerary-pack upsell). Activity rows carry affiliate links (Viator/GetYourGuide).

## The moat
`data/itineraryActivities.ts` — a curated catalog of real HHI things-to-do with local sequencing logic (what pairs with what, time-of-day fit, neighborhood clustering so you're not crisscrossing the island). OTAs list activities; they don't *sequence a week* like a local.

---

## Architecture (mirrors the Beach Day Planner)

```
data/itineraryActivities.ts ─► activity catalog + per-trip-type templates (the content moat)
data/costEstimates.ts (reuse) ─► LODGING_TIERS for the cost rollup
app/lib/itineraryBuilder.ts ──► generator + cost rollup + types (Itinerary, ItineraryDay, Slot)
        │
        ▼
app/hilton-head-itinerary-builder/page.tsx ─► SSR: reads ?days/type/lodging/picks → generate → render
        │
        ▼
components/tools/ItineraryControls.tsx ─► client island: selectors + per-activity swap/remove (push URL)
```

### New files
| File | Responsibility |
|---|---|
| `data/itineraryActivities.ts` | Activity catalog (id, title, category, neighborhood, cost, duration, timeOfDay, blurb, affiliate?, tideNote?) + trip-type templates |
| `app/lib/itineraryBuilder.ts` | `buildItinerary({days, type, lodging, picks})` → `Itinerary`; cost rollup; URL encode/decode of `picks`; types |
| `components/tools/ItineraryControls.tsx` | Client controls — trip length/type/lodging + swap/remove activity (updates URL) |
| `app/hilton-head-itinerary-builder/page.tsx` | SSR page shell |
| `tests/itinerary-builder.spec.ts` | Playwright smoke + a11y |

### Modified
| File | Change |
|---|---|
| `app/sitemap.ts` | Add route, priority 0.9 |
| `data/nav.ts`, `data/footerLinks.ts` | Add "Trip Builder" (Services / Plan Your Trip) |
| `public/llms.txt`, `public/llms-full.txt` | Index the tool |
| `app/globals.css` | Small `@media print` block for the printable itinerary |

---

## Activity catalog shape
```ts
type Slot = 'morning' | 'afternoon' | 'evening';
type Category = 'beach' | 'golf' | 'dining' | 'water' | 'family' | 'nature' | 'shopping' | 'relax';
interface Activity {
  id: string;
  title: string;
  category: Category;
  neighborhood: string;          // for clustering (don't crisscross the island)
  slot: Slot | 'any';
  durationHours: number;
  costPerPerson: number;          // 0 for free (beach, biking)
  blurb: string;                  // local-voice, 1 line
  tripTypes: TripType[];          // which templates it belongs to
  affiliate?: { programId: 'viator' | 'getyourguide'; deeplink?: string };
}
```
Trip-type templates = ordered preference lists the generator draws from to fill each day's 3 slots, clustering by neighborhood per day.

## Cost rollup
- Lodging: chosen `LODGING_TIERS` nightly midpoint × nights.
- Activities: sum of `costPerPerson × partySize` across the week (partySize default 4, adjustable).
- Food: per-day estimate from cost methodology (cook-some vs eat-out, keyed to lodging `hasKitchen`).
- Output a **range** (low–high), framed "what a local would budget."

## Monetization (the point of this tool)
1. **Concierge CTA** (primary): "Have a local book this week for you" → `/itinerary` with the built plan passed through (prefilled summary) → `generate_lead` (`lead_type:'itinerary'`). This is the planning-fee/concierge funnel.
2. **Itinerary-pack upsell:** "Want it done-for-you in a PDF? The $49 [matching] pack" → `/itinerary-packs/[pack]` matched to trip type.
3. **Affiliate:** activity rows with `affiliate` → `<AffiliateLink>` (Viator/GYG), FTC-disclosed.
4. **Email-to-save:** "Email me this itinerary" → lead capture.

## SEO / shareability / LLM
- `generatePageMetadata`: "hilton head itinerary builder", "hilton head trip planner free", "5 day hilton head itinerary", "hilton head 7 day itinerary", "what to do in hilton head for a week".
- JSON-LD: `WebApplication` + `Breadcrumb` + `FAQ` (4 Qs: "how many days do you need in HH", "what to do in HH for 5 days", "is HH good for families", "do I need a car").
- Shareable `?...=` URL SSR-renders the plan; print CSS for "print itinerary." Add to llms.txt.

## Edge cases / guardrails
- Invalid/missing params → default to 5-day / family / standard.
- `picks` decode failure → fall back to generated defaults (never a blank tool).
- Clustering: each day prefers activities in 1–2 neighborhoods (no Sea Pines-to-north-end-and-back whiplash).
- A11y: labeled controls, keyboard add/remove, AA contrast (axe test).

## Out of scope (v1)
- True drag-and-drop reordering (v2).
- Real-time availability/booking (it links out / hands to concierge).
- Accounts / server-saved plans (URL + email only).
- PDF export (use print CSS; PDF is a fast-follow — the villa-match PDF route is not on main).

## Success criteria
- Generates a sensible, neighborhood-clustered day-by-day plan for each trip type/length.
- Swap/remove updates the URL and re-renders server-side; shared links reproduce the plan.
- Cost range renders; concierge CTA + pack upsell + ≥1 affiliate link + email capture wired.
- `npm run build`/`lint`/typecheck clean; Playwright smoke passes; in sitemap/nav/footer/llms.

## Distribution (William's job)
Same as the planner: this is link-bait + a lead magnet. Share built itineraries; pitch "free Hilton Head trip planner" to travel forums/blogs.
