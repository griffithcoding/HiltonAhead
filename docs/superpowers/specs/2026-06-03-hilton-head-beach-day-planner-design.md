# Hilton Head Beach Day Planner — Design Spec

**Date:** 2026-06-03
**Owner:** William Griffith
**Status:** Approved concept ("Build A") → design for sign-off before build
**Strategic purpose:** Link-worthy interactive tool that fuses real tide/weather data with 30-year local knowledge — the kind of destination-intelligence tool OTAs (Vrbo/Airbnb) structurally can't build. Goal: earn backlinks → domain authority → fix the traffic bottleneck (100 organic clicks/mo), while capturing leads + monetizing activity suggestions.

---

## What it does

Visitor enters a **date** (their trip day) → the tool returns, for that day:
- **The best beach** on the island for those conditions (Coligny, Burkes, Folly Field, Driessen, Alder Lane, Mitchelville, South Beach…)
- **The best hours** to be there (driven by tide state + sun + crowd patterns)
- **What to do, keyed to the tide** (low tide → shelling/shark teeth at the sandbars; high tide → swimming/kayak; sunset spot)
- **Conditions**: tide times/heights, weather (or seasonal averages), sunrise/sunset/golden hour
- A **shareable, link-worthy result** + a "save my beach plan" email capture + contextual monetization

## The moat (why an OTA can't copy this)
The recommendation engine runs on **William's local rules encoded as data** — which beach works at which tide, where the low-tide sandbars and shark-tooth beds are, shade, parking/crowd, the marsh sunset spots. Real data + irreplaceable local knowledge = defensible.

---

## Data reality (the key architecture decision)

| Signal | Source | Horizon | Beyond horizon |
|---|---|---|---|
| **Tides** | NOAA (`tides.ts`, station 8670870) | **Any future date** (astronomical — predictable for years) | n/a — always real |
| **Weather** | NWS (`weather.ts`) | **~7 days** | Fall back to **seasonal averages** (`data/months.ts`) — labeled "typical for [month]" |
| **Sun / golden hour** | computed (`lib/sun.ts`, deterministic, no API/key) | Any date | n/a — always real |

→ For a trip **this week**: precise (real tides + real forecast + sun).
→ For a trip **months out** (the dreamer): real tides + sun + *seasonal* weather. Still genuinely useful, clearly labeled.

---

## Architecture

```
data/beachDayRules.ts ──► beaches[] + tide/time/condition ruleset (the local-knowledge moat)
app/lib/sun.ts ──────────► sunrise/sunset/golden-hour (deterministic NOAA solar formula, no dep)
app/lib/tides.ts ────────► add getTidesForDate(beginDate, days) — parameterize existing fetch
app/lib/weather.ts ──────► reuse; add seasonal fallback from data/months.ts
app/lib/beachDay.ts ─────► ENGINE: (date, tides, weather|seasonal, sun) → BeachDayPlan
        │
        ▼
app/api/beach-day/route.ts ─► GET ?date=YYYY-MM-DD → BeachDayPlan JSON (server-fetches data)
        │
        ▼
components/tools/BeachDayPlanner.tsx ─► client island: date picker + results UI
        │
        ▼
app/hilton-head-beach-day-planner/page.tsx ─► server shell: SEO + schema + island + monetization + cross-links
```

### New files
| File | Responsibility |
|---|---|
| `data/beachDayRules.ts` | Beaches + attributes + the tide/time/condition → recommendation ruleset (local knowledge) |
| `app/lib/sun.ts` | Sunrise/sunset/golden-hour for a date at HHI lat/lon — pure function, no dependency |
| `app/lib/beachDay.ts` | The recommendation engine + `BeachDayPlan` type |
| `app/api/beach-day/route.ts` | Date → plan JSON; server-side fetches tides/weather, computes sun, runs engine |
| `components/tools/BeachDayPlanner.tsx` | Client island — date picker, loading/error states, results |
| `app/hilton-head-beach-day-planner/page.tsx` | Page shell (server) |
| `tests/beach-day-planner.spec.ts` | Playwright smoke + a11y |

### Modified
| File | Change |
|---|---|
| `app/lib/tides.ts` | Extract a `getTidesForDate(beginYYYYMMDD, days)` (keep existing `getHiltonHeadTides` as a thin caller) |
| `app/sitemap.ts` | Add the route (priority ~0.9 — tools convert + earn links) |
| `data/nav.ts`, `data/footerLinks.ts` | Add "Beach Day Planner" under Local Guide / Plan Your Trip |
| `public/llms.txt`, `public/llms-full.txt` | Index the tool |

---

## UX flow
1. Hero: H1 "Hilton Head Beach Day Planner", one-line value prop, TL;DR block.
2. **Date picker** (defaults to today; "today / tomorrow / pick a date"). Pre-fill from `?date=` query for shareable links.
3. **Result card** for the day:
   - Best beach (name + why) + best-hours window
   - Tide timeline (high/low times + heights) — reuse TideForecast styling
   - Weather (real or "typical for July") + sunrise/sunset/golden hour
   - 2–3 tide-keyed activity suggestions (each a monetization slot)
4. **Save/share:** "Email me this plan" (lead capture) + share button (URL carries `?date=`).
5. Cross-links: packing list, oceanfront villas, things-to-do, tides page.

## Monetization (light, non-intrusive)
- Activity suggestions → `<AffiliateLink>` (Viator/GetYourGuide) or future featured-partner slot.
- "What to bring for these conditions" → packing-list page (Amazon).
- Email capture → newsletter/lead pipeline (`generate_lead`, `lead_type` reuse) → feeds concierge funnel.

## SEO / shareability / LLM
- `generatePageMetadata` targeting: "hilton head beach day planner", "best time to go to the beach hilton head", "hilton head beach conditions", "hilton head tide chart beach".
- JSON-LD: `WebApplication` + `Breadcrumb` + `FAQ` (3–4 Qs: "what's the best time for the beach in HH", "low vs high tide", "where are shark teeth").
- **Shareable result = self-distribution:** `?date=` SSR-renders that day's plan + a dynamic OG image ("Your perfect Hilton Head beach day: Fri Jul 4 — Burkes Beach, 7–10am") → the link-bait mechanic.
- Add to `llms.txt`/`llms-full.txt`.

## Edge cases / guardrails
- NOAA/NWS fetch fails → degrade gracefully (show tides if weather fails; seasonal if both fail) — never a blank tool.
- Date > NOAA prediction range or invalid → friendly message + clamp.
- All external fetch server-side via the API route (keeps keys/UA server-side; tides.ts already sets the NWS/NOAA User-Agent).
- Past dates → allow (people verify a memory) but nudge to future.
- Accessibility: date input labeled; results announced; AA contrast (axe test).

## Out of scope (v1)
- Multi-day "whole trip" view (v1 = one date; date-range is a fast-follow).
- Live webcams / water temp (separate tool).
- User accounts / saved plans (email capture only).
- Real-time crowd data (use static crowd patterns in the ruleset).

## Success criteria
- Returns a correct, real tide-driven plan for any valid date; weather real ≤7d, seasonal beyond, clearly labeled.
- Shareable `?date=` link SSR-renders + OG image.
- Lighthouse/axe clean; `npm run build` + `lint` green; Playwright smoke passes.
- At least one monetization slot + email capture wired.
- In sitemap, nav/footer, llms.txt.

## Distribution (the other 50% — William's job, not code)
Pitch the tool to 10 "things to do in Hilton Head" bloggers/journalists + relevant subreddits/FB groups for links. A tool nobody links to is just another page. The shareable `?date=` result is built to make this easy.
