# Today on Hilton Head Dashboard — Design Spec

**Date:** 2026-05-20
**Status:** Approved (Q1–Q3), pending user review of written spec
**Author:** Claude (brainstorming session with William Griffith)
**Source frame:** [docs/brainstorming/2026-05-04-million-dollar-roadmap.md](../../brainstorming/2026-05-04-million-dollar-roadmap.md) — tool #2 of the 3-tool traveler-utility roadmap.

## 1. Overview

A single-page dashboard at `/today-on-hilton-head` that combines six high-frequency data feeds — weather, tides, sunrise/sunset (by location), UV index, water temperature, wind — into a tool-app layout travelers bookmark and open 2–3× per day during their trip. All data sourced from free public APIs (OpenWeather, NOAA Tides & Currents, NOAA buoys, NOAA NWS, astronomy calc). Server-rendered with 15-minute ISR + a client-side Refresh button. One above-fold sponsor slot between the weather and tides panels — the page's highest-frequency-return position is its premium ad inventory.

## 2. Goal & success metrics

**Primary goal — traveler value:** be *the* page a Hilton Head visitor opens daily during their trip for the practical questions ("what's the tide doing? when's sunset? is it warm enough to swim?").

**Secondary goal — SEO leverage:** rank for *"hilton head weather today"*, *"hilton head tides today"*, *"sunset time harbour town"* — the keyword-rich URL gives a real shot at owning a meaningful slice of ~33k/mo weather-related searches.

**Tertiary goal — sponsor inventory:** the daily-return cadence makes this the site's single most valuable ad slot. Sell it.

**Success metrics (90 days post-launch):**
- ≥ 35% of dashboard sessions are return visits within 7 days (sticky-tool signal)
- ≥ 2.0 average panels-engaged-with per session (toggle, refresh, hover/expand counts)
- Sponsor slot CTR ≥ 0.8% (high for a content site)
- Sponsor slot fill: ≥ 50% by day 90 (the slot is sellable at $249–499/mo)
- Organic traffic: ≥ 500 sessions/month from "hilton head weather today" + related queries by day 90

**Anti-goal:** do not let the page feel like weather.com. Editorial voice in headers, descriptions, and the founder note at the bottom — *"What I'm doing today"* — is the differentiator.

## 3. Scope

### In scope (v1)
- New route `app/today-on-hilton-head/page.tsx` (server component with ISR)
- 6 panel components — Weather, Tides, SunriseSunset, UVIndex, WaterTemperature, Wind
- Per-panel location toggle where it matters — SunriseSunset gets a 3-location switcher (Harbour Town / Coligny / South Forest Beach)
- Server-side data fetch helpers (one per API integration) under `app/lib/today/`
- Client-side Refresh button → `revalidatePath('/today-on-hilton-head')` route
- Failure-graceful rendering — panel shows "Last updated X min ago" + retry on API error
- Sponsor slot above-the-fold between weather + tides (reuses `SponsorSlot` type from Restaurant Hub spec)
- New `directory_events` event types: `today_panel_view`, `today_refresh_click`, `today_location_toggle`, `today_sponsor_click`
- Migration `015_today_dashboard_events.sql` — adds the new event types to the CHECK constraint
- Sitemap entry for `/today-on-hilton-head`
- JSON-LD `WebPage` schema with `Speakable` selector contract for AI-overview snippets
- Playwright tests — happy-path render, refresh-button behavior, location toggle, sponsor slot, a11y
- Founder editorial block at the bottom — *"What I'm doing today"* — a single editable note pulled from `data/today-notes.ts` (manually edited; future v2 could auto-pull from a CMS)
- Tracking via existing `trackDirectoryEvent` pattern, using `business_id='today-dashboard'` as the namespace

### Out of scope (v1, deferred)
- Surf forecast (NOAA WaveWatch is free but accuracy is mediocre at HHI's coastal grid resolution — defer until v1.1, may revisit Surfline if revenue justifies the $$$)
- Tonight's events feed (manual curation pending; v1.1 once we know if a founder-admin form is worth building)
- Beach access status / closures (no reliable public feed)
- Bike path closures (no public feed)
- Mosquito/pollen index (defer; not in the 90% of visitor questions)
- Per-day forecast beyond today (defer; today-only is the product)
- Mobile push notifications ("storm alert! tide change!") — v2 with PWA
- Localization
- Founder admin form for the editorial note (v1.1; for v1 founder edits the TS file directly)

### Explicit non-goals
- Do not build our own weather model — use OpenWeather + NOAA.
- Do not display ads from third-party networks (AdSense, etc.). Only direct sponsor inventory.
- Do not cache more than 15 minutes — staleness erodes trust on a "today" page.
- Do not require user accounts, login, or geolocation prompts.

## 4. UX flow & page layout

URL: `/today-on-hilton-head`

### Page sections (top to bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│ <Header /> (existing)                                                 │
├──────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home → Today on Hilton Head                               │
├──────────────────────────────────────────────────────────────────────┤
│ HERO                                                                  │
│  Eyebrow: "Today on Hilton Head" · italic accent: <human-day-string> │
│  Display H1: "Wednesday, May 20, 2026"                                │
│  Subhead: "Tides, weather, sunset, and what I'm doing today."        │
│  [Refresh] button (right-aligned)  · Last updated: Xm ago             │
├──────────────────────────────────────────────────────────────────────┤
│ 2-COLUMN GRID (md+), single-column (sm-) — PANEL ORDER:               │
│                                                                       │
│ ┌──────────────────────────┬──────────────────────────┐               │
│ │ WEATHER                  │ TIDES                    │               │
│ │  Current temp · cond     │  Today: high/low + times │               │
│ │  H/L · feels like        │  Tomorrow: previews      │               │
│ │  Hourly strip (6h)       │  Station: HHI 8678596   │               │
│ │  Last updated: 12m ago   │  Last updated: 4m ago    │               │
│ └──────────────────────────┴──────────────────────────┘               │
│                                                                       │
│ ┌────────────────────── SPONSOR SLOT (above fold) ──────────────────┐ │
│ │ Sponsored by [Advertiser] · italicized · palette-muted             │ │
│ │ [Tracked link]                                                     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌──────────────────────────┬──────────────────────────┐               │
│ │ SUNRISE / SUNSET         │ UV INDEX                 │               │
│ │  Location: [HT|CB|SFB] ▾ │  Now: 6 (High) · scale   │               │
│ │  Sunrise · Sunset · Noon │  Peak today: 9 at 1pm    │               │
│ │  Golden-hour windows     │  Time-to-burn estimator  │               │
│ └──────────────────────────┴──────────────────────────┘               │
│                                                                       │
│ ┌──────────────────────────┬──────────────────────────┐               │
│ │ WATER TEMPERATURE        │ WIND                     │               │
│ │  Skull Creek buoy 8447435│  Current: 12 mph SW      │               │
│ │  72°F · updated 18m ago  │  Gusts: 18 mph           │               │
│ │  "Swimmable" judgment    │  Direction compass icon  │               │
│ └──────────────────────────┴──────────────────────────┘               │
├──────────────────────────────────────────────────────────────────────┤
│ FOUNDER NOTE                                                          │
│  "What I'm doing today"                                               │
│  3-5 sentence editorial — date-stamped — pulled from data/today-notes │
├──────────────────────────────────────────────────────────────────────┤
│ <FinalCta /> + <Footer />                                             │
└──────────────────────────────────────────────────────────────────────┘
```

### Refresh button behavior

- Visible top-right of hero. Aria-label: "Refresh data."
- Click → POST to `/api/today/refresh` (server action or route handler) → calls `revalidatePath('/today-on-hilton-head')` → triggers Next.js to refetch ISR → page re-renders with fresh data.
- Loading state: button shows spinner, "Last updated" timestamp updates after refresh.
- Rate limit: 1 click per 30 seconds per session (client-side; not enforced server-side at v1).
- Tracked event: `today_refresh_click`.

### Location toggle on SunriseSunset

Three small chip-buttons: `Harbour Town · Coligny Beach · South Forest Beach`. Default = Harbour Town. State is client-side only (URL doesn't change). Tracked event: `today_location_toggle` with `{ panel: 'sunset', location: '...' }`.

### Failure UI per panel

When an API errors:
- Panel still renders its frame
- Body shows: *"Couldn't reach <service>. Last updated <relative time>."*
- A small `[Retry]` button calls the panel's fetch endpoint client-side and reflows the panel
- The page still loads — one broken panel never bricks the whole dashboard

## 5. Data model

### Server-side fetch helpers (`app/lib/today/`)

```ts
// app/lib/today/types.ts

export type FetchResult<T> =
  | { ok: true; data: T; fetchedAt: string /* ISO */ }
  | { ok: false; error: string; lastKnown?: T; lastFetchedAt?: string };

export type WeatherSnapshot = {
  temperatureF: number;
  feelsLikeF: number;
  conditionLabel: string;          // "Partly cloudy", "Thunderstorms", etc.
  conditionIconKey: string;        // sun, cloud, rain, storm, etc.
  highF: number;
  lowF: number;
  hourly: Array<{ hour: string; tempF: number; conditionIconKey: string }>; // next 6
};

export type Tide = {
  type: 'high' | 'low';
  timeIso: string;
  heightFt: number;
};

export type TidesSnapshot = {
  today: Tide[];
  tomorrow: Tide[];
  stationName: 'Hilton Head Island (8678596)';
};

export type SunSnapshot = {
  location: 'harbour-town' | 'coligny-beach' | 'south-forest-beach';
  sunriseIso: string;
  sunsetIso: string;
  solarNoonIso: string;
  goldenHourMorningStartIso: string;
  goldenHourMorningEndIso: string;
  goldenHourEveningStartIso: string;
  goldenHourEveningEndIso: string;
};

export type UvSnapshot = {
  current: number;
  currentLabel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  peakToday: number;
  peakHourIso: string;
  timeToBurnMinutes?: number;       // for fair skin at peak
};

export type WaterTempSnapshot = {
  temperatureF: number;
  stationName: 'Skull Creek (8447435)';
  judgment: 'cold' | 'brisk' | 'pleasant' | 'warm';
};

export type WindSnapshot = {
  speedMph: number;
  gustsMph: number;
  directionDegrees: number;
  directionLabel: string;           // "SW", "NNE", etc.
};
```

### Location coordinates (`app/lib/today/locations.ts`)

```ts
export const LOCATIONS = {
  'harbour-town':         { name: 'Harbour Town',         latitude: 32.1382, longitude: -80.8118 },
  'coligny-beach':        { name: 'Coligny Beach',        latitude: 32.1488, longitude: -80.7517 },
  'south-forest-beach':   { name: 'South Forest Beach',   latitude: 32.1525, longitude: -80.7644 },
  'island-center':        { name: 'Hilton Head Island',   latitude: 32.2163, longitude: -80.7526 },
} as const;

export type LocationKey = keyof typeof LOCATIONS;
```

### Founder note (`data/today-notes.ts`)

```ts
export type TodayNote = {
  /** ISO date — the entry's display date (YYYY-MM-DD). */
  date: string;
  /** 3-5 sentence editorial — founder voice. */
  body: string;
};

/**
 * Founder's daily editorial. Append-only. The most recent entry whose
 * date <= today is rendered. If none, the note section hides gracefully.
 */
export const todayNotes: TodayNote[] = [
  // {
  //   date: '2026-05-20',
  //   body: "Tide goes out at 11:42am — perfect for the shelling stretch...",
  // },
];
```

## 6. Routing & SEO

- Route: `app/today-on-hilton-head/page.tsx` (App Router)
- Page-level `export const revalidate = 900;` (15 minutes ISR)
- Refresh endpoint: `app/api/today/refresh/route.ts` → calls `revalidatePath` and returns 200
- Sitemap entry added to `app/sitemap.ts` with `changeFrequency: 'always'` and `priority: 0.9`
- Per-page metadata:
  - `title`: *"Today on Hilton Head — Weather, Tides, Sunset · Hilton Ahead"*
  - `description`: *"Hilton Head's daily dashboard: tides, weather, sunset times, water temperature, wind — updated every 15 minutes."*
  - `keywords`: derived from panel topics
  - Canonical URL
  - OpenGraph + Twitter cards
- JSON-LD schemas:
  - `WebPage` with `dateModified` set to the most recent fetch time
  - `Speakable` selector contract — three CSS classes must each render as real DOM elements per `CLAUDE.md` Speakable rules:
    - `.today-summary` — wraps the hero subhead ("Tides, weather, sunset, and what I'm doing today.") in the page hero block
    - `.today-tides-summary` — wraps the top-line tides description inside the TidesPanel (e.g., "Low tide at 11:42am, high at 6:18pm")
    - `.today-sun-summary` — wraps the top-line sun description inside the SunriseSunsetPanel (e.g., "Sunset at 8:14pm tonight in Harbour Town")
  - Breadcrumb schema

## 7. Refresh / caching strategy

### ISR cadence (page-level)
`export const revalidate = 900;` — page is statically regenerated every 15 minutes on first request after the window.

### Per-panel data freshness (server-side fetch cache)
Each fetch helper uses Next.js `fetch()` with a per-resource `next.revalidate` to allow different panels to refresh at different intervals even within the same page render:

| Panel | `next.revalidate` |
|---|---|
| Weather | 1800 (30 min) — OpenWeather updates ~ every 10 min |
| Tides | 21600 (6 h) — tides are deterministically predicted; no point refetching often |
| Sun (per location) | 86400 (24 h) — pure astronomy calc, no remote call (suncalc) |
| UV | 3600 (1 h) — OpenWeather UV history; not super volatile |
| Water temp | 3600 (1 h) — NOAA buoys update hourly |
| Wind | 1800 (30 min) — NOAA NWS updates every ~ 60 min |

### Manual refresh

`/api/today/refresh` → `revalidatePath('/today-on-hilton-head')` → forces next request to bypass ISR and rebuild. Rate-limited client-side to 1 click per 30s (no server-side limit at v1 — abuse would just rebuild the page faster than ISR; not a security issue).

### Cold-start behavior

First request after deploy: all 6 fetches happen in parallel inside the server component (`Promise.all`). If a fetch fails, panel renders failure UI. Total cold-start budget: < 3s (parallel fetches all complete < 2s except wind which can be slow from NWS).

## 8. API integrations

| API | Endpoint | Cost | Notes |
|---|---|---|---|
| **OpenWeather** (weather + UV) | `/data/2.5/weather` + `/data/2.5/onecall?exclude=...` | Free tier 1000 calls/day | API key env: `OPENWEATHER_API_KEY` |
| **NOAA Tides & Currents** | `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?...&station=8678596` | Free, no key | Station: Hilton Head Island (8678596) |
| **NOAA Buoys (water temp)** | `https://www.ndbc.noaa.gov/data/realtime2/8447435.txt` (text format) | Free, no key | Station: Skull Creek 8447435 — water temp + wave height (wave is in scope-deferred) |
| **NOAA NWS (wind)** | `https://api.weather.gov/points/{lat},{lon}/forecast/hourly` | Free, no key, must set `User-Agent` header | Per `api.weather.gov` policy, identify ourselves |
| **suncalc** (sunrise/sunset/golden hour) | npm package `suncalc` | Free, no remote call | Pure astronomy calc |

### Rate-limit math
- OpenWeather free tier: 1000/day. We hit once per ISR window × 2 endpoints (weather + onecall for UV) = ~ 96 + 24 calls/day = **120/day**. Well under.
- NOAA APIs: no documented limit; we make ~ 4 calls/day to tides (every 6h) and ~ 48 to buoys + wind. Trivial.

### Failure response handling
- Each helper wraps the `fetch` in try/catch, returns `{ ok: false }` on error.
- The panel component receives `FetchResult<T>` and renders failure UI when `ok: false`.
- No client-side keys exposed — all API calls happen server-side.

## 9. Tracking events

New `directory_events` event types via migration `015_today_dashboard_events.sql`:

| Event | When | Payload notes |
|---|---|---|
| `today_panel_view` | Server-side at page render — one per panel that successfully rendered | `{ panel: 'weather' | 'tides' | 'sun' | 'uv' | 'water-temp' | 'wind' }` |
| `today_refresh_click` | Client → `/api/today/refresh` | `{ sinceLastIso: string }` |
| `today_location_toggle` | Client when user switches sun location | `{ panel: 'sun', location: LocationKey }` |
| `today_sponsor_click` | Client click on sponsor slot CTA | `{ advertiserName: string, url: string }` |

All events use `business_id='today-dashboard'`, **`industry_slug='tools'`** (new value introduced in migration 015 + widened in `data/localBusinesses.ts` `IndustrySlug` union + widened in the `VALID_INDUSTRIES` Set in `/api/directory/track`). Cleaner than reusing `'restaurants'`. Future tool dashboards (heat map, weather etc.) all share the `'tools'` namespace.

## 10. Sponsor slot

Above-fold, between Weather and Tides panels — the highest-impression position on a daily-return page.

### Render

Reuses the existing `SponsorSlot` TypeScript type from Restaurant Hub spec (`data/localBusinesses.ts`). For dashboard usage, sponsor data lives in `data/today-sponsor.ts`:

```ts
import type { SponsorSlot } from '@/data/localBusinesses';

export const todaySponsor: SponsorSlot | null = null; // set when sold
```

Renders only when `todaySponsor !== null` and (`endsAt` is unset OR `now < endsAt`).

### Pricing guidance (for the user's sales motion — not in code)

- $249–499/mo depending on demonstrated dashboard traffic
- Sold to dinner-decision-window advertisers: restaurants near the sunset window (Salty Dog, Skull Creek Boathouse), beach gear rentals, charter operators
- Sponsor copy is editorial — written by the founder, not the advertiser. Avoids ad-network slop.
- Tracking: `today_sponsor_click` event per click; monthly attribution report to the sponsor

### v1.1 upgrade

Admin route `/admin/today-sponsor` for self-service slot management (set / clear / expire). **Deferred.**

## 11. Performance budgets

- **LCP** on `/today-on-hilton-head` ≤ 1.5s on 4G (this is a tool, not a brochure)
- **Cold ISR-rebuild** server time ≤ 3s (all 6 fetches in parallel)
- **Page bundle** ≤ 35 KB gzipped (panel components, refresh button, location toggle are client islands)
- **No external fonts beyond what `app/layout.tsx` already loads**
- Panel skeletons render server-side instantly — failure UI replaces only the affected panel

## 12. Accessibility (WCAG AA)

- Each panel is a `<section>` with a heading; six headings cleanly map to outline
- Refresh button has `aria-label`, `aria-busy` while refreshing
- Location toggle is a `<fieldset>` with three radio buttons (semantic correctness > aesthetics)
- "Last updated X min ago" has `aria-live="polite"` so screen readers announce on refresh
- Color contrast: AA on all palette tokens used (verify sponsor-slot copy on the chosen bg during build)
- Speakable selector contract: `.today-summary`, `.today-tides-summary`, `.today-sun-summary` are real DOM classes on the rendered content (validated by `axe-core` + manual check)
- `prefers-reduced-motion`: refresh-button spinner uses CSS animation that respects the media query

## 13. Testing

Playwright only (no unit runner per `CLAUDE.md`).

- `tests/today-dashboard-happy.spec.ts` — load page, assert 6 panels render with at least skeleton + data, refresh button works
- `tests/today-dashboard-refresh.spec.ts` — refresh button fires `today_refresh_click` event, last-updated timestamp changes
- `tests/today-dashboard-location-toggle.spec.ts` — sunset location toggle changes displayed sun times AND fires `today_location_toggle` event
- `tests/today-dashboard-sponsor.spec.ts` — sponsor slot renders when set, hidden when null, click tracked
- `tests/today-dashboard-failure.spec.ts` — intercept one of the API routes with `route.abort()`, assert failure UI renders on that panel + retry button is functional, other panels still render
- `tests/today-dashboard-a11y.spec.ts` — `axe-core` scan + Speakable selectors present

## 14. Operations

- Add env var `OPENWEATHER_API_KEY` (free tier, sign up at openweathermap.org/api). Store in Vercel + `.env.local`.
- NOAA APIs require a `User-Agent` header on api.weather.gov; set to `"HiltonAhead/1.0 (hello@hiltonahead.com)"`.
- Migration `015_today_dashboard_events.sql` to be applied via Supabase CLI before deploy.
- Add the new `'tools'` industry slug to:
  - `data/localBusinesses.ts` `IndustrySlug` union
  - `app/api/directory/track/route.ts` `VALID_INDUSTRIES` Set
- Sitemap regeneration happens automatically via `app/sitemap.ts`.
- Sponsor slot data file (`data/today-sponsor.ts`) starts at `null` — set when first sponsor is sold.

## 15. Open questions / future work

- **Surf forecast** — NOAA WaveWatch III grid resolution is coarse at HHI. Defer to v1.1; consider Surfline API once revenue justifies (~$100–500/mo).
- **Tonight's events** — manual curation via a founder-admin form is the right v2 path. Initial entries can live in `data/events.ts` (already exists per `CLAUDE.md`).
- **Hourly forecast horizon** — currently 6 hours; could extend to 12 or 24 hours if user feedback wants it.
- **PWA support** — adds offline read of last-fetched data + push notifications. Real lift but a great v2.
- **Founder editorial automation** — auto-suggest a daily founder note from the day's data (e.g., "Low tide at 11am means shelling on South Forest Beach"). Could ship in v1.1 as an LLM-suggested draft.
- **Localization** — none in v1.
- **Admin sponsor management** — deferred to v1.1.

## 16. Monetization narrative (for the sales playbook session after this ships)

The dashboard ships **three monetization vectors**:

1. **Sponsor slot ($249–499/mo)** — direct sale to a single advertiser per month. Position is premium because the page is opened multiple times per day by visitors actively planning their day on the island. Same buyer profile as the Restaurant Hub sponsor slots, but better timing-of-impression.

2. **SEO traffic moat** — owning *"hilton head weather today"* + similar long-tail keywords drives **organic traffic that feeds every other revenue stream**: trip-consulting form submissions, newsletter signups, directory page views.

3. **First-party usage data** — every `today_panel_view`, `today_location_toggle`, `today_sponsor_click` adds to the `directory_events` aggregate. **When do visitors check the tides?** **Where do they want to watch sunset?** That data is the foundation of the heat-map data product in tool #3.

---

## Self-review checklist

Inline self-review happens after this draft commits. Specific things to check:

1. **Placeholder scan** — any TBD / TODO blocks
2. **Internal consistency** — Speakable selectors in §6 match the rendered components plan in §4; the migration in §9 matches the event names in §13
3. **Scope check** — fits one implementation plan? Yes (~22–26 tasks expected)
4. **Ambiguity check** — "1 click per 30s" rate limit specified explicitly in §4
5. **API contract** — every API in §8 has a documented endpoint + station ID + key requirement
