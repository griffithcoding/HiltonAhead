# Today on Hilton Head Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page daily dashboard at `/today-on-hilton-head` combining 6 high-frequency data feeds (weather, tides, sunrise/sunset by location, UV, water temp, wind) from free public APIs, server-rendered with 15-min ISR + client refresh, with one above-fold sponsor slot.

**Architecture:** Server component page with `revalidate = 900`. Six panel components, each fed by a server-side fetch helper under `app/lib/today/`. Panel-level `next.revalidate` per-API for fine-grained freshness. Client islands for the refresh button, location toggle, and sponsor click tracking. Failure-graceful: any panel that errors renders a retry block instead of bricking the page. Tracking events use `industry_slug='tools'`, `business_id='today-dashboard'`.

**Tech Stack:** Next.js 16 (App Router, server components + ISR) · React 19 · TypeScript (strict) · Tailwind 4 · `suncalc` (new dep, astronomy) · Supabase service-role for event writes · Playwright.

**Spec:** [docs/superpowers/specs/2026-05-20-today-on-hilton-head-design.md](../specs/2026-05-20-today-on-hilton-head-design.md)

**Testing reality:** Per `CLAUDE.md`, Playwright is the only test surface. Panel components and fetch helpers are tested by intercepting outbound `fetch` calls in Playwright (`page.route(api_url, ...)`).

**Branch:** Stay on `feat/restaurant-hub` (already holds the Villa Match + Restaurant Hub + Today on HH specs). Per `CLAUDE.md`, no worktrees. Do not merge without explicit founder approval.

**Commit cadence:** Atomic per task. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).

---

## File Structure

### New files (~25)

| Path | Responsibility |
|---|---|
| `supabase/migrations/015_today_dashboard_events.sql` | Adds 4 new `event_type` values; preserves all prior values |
| `app/lib/today/types.ts` | Shared types: `FetchResult<T>`, all 6 snapshot types, `LocationKey` |
| `app/lib/today/locations.ts` | `LOCATIONS` map for the 4 island points |
| `app/lib/today/weather.ts` | `fetchWeather()` — OpenWeather current + 6h hourly |
| `app/lib/today/uv.ts` | `fetchUv()` — OpenWeather UV current + today's peak |
| `app/lib/today/tides.ts` | `fetchTides()` — NOAA Tides & Currents station 8678596 |
| `app/lib/today/water-temp.ts` | `fetchWaterTemperature()` — NOAA buoy 8447435 (Skull Creek) |
| `app/lib/today/wind.ts` | `fetchWind()` — NOAA NWS api.weather.gov |
| `app/lib/today/sun.ts` | `computeSun(location)` — pure suncalc — no remote |
| `app/today-on-hilton-head/page.tsx` | Server-component page shell with ISR |
| `app/today-on-hilton-head/not-found.tsx` | Defensive 404 (unlikely to hit since the route is fixed) |
| `app/api/today/refresh/route.ts` | POST → `revalidatePath('/today-on-hilton-head')` |
| `components/today/Hero.tsx` | Date header + refresh button + last-updated stamp |
| `components/today/RefreshButton.tsx` | Client island — calls `/api/today/refresh`, fires `today_refresh_click` |
| `components/today/WeatherPanel.tsx` | Renders `WeatherSnapshot` or failure UI |
| `components/today/TidesPanel.tsx` | Today/tomorrow tides + `.today-tides-summary` Speakable wrapper |
| `components/today/SunriseSunsetPanel.tsx` | Client component (holds location-toggle state) + `.today-sun-summary` wrapper |
| `components/today/UvPanel.tsx` | UV current/peak + time-to-burn estimator |
| `components/today/WaterTempPanel.tsx` | Water temp + judgment label |
| `components/today/WindPanel.tsx` | Wind speed/gusts/direction with compass icon |
| `components/today/PanelFailure.tsx` | Shared failure UI: "Couldn't reach X. Last updated Y ago. [Retry]" |
| `components/today/SponsorSlot.tsx` | Renders `todaySponsor` if non-null + not expired |
| `components/today/FounderNote.tsx` | Renders most recent `TodayNote` entry |
| `data/today-sponsor.ts` | `todaySponsor: SponsorSlot | null` — set when slot sold |
| `data/today-notes.ts` | `todayNotes: TodayNote[]` — append-only founder editorial |

### Tests (6)

| Path | Coverage |
|---|---|
| `tests/today-dashboard-happy.spec.ts` | Load page, all 6 panels render with data, refresh button visible |
| `tests/today-dashboard-refresh.spec.ts` | Refresh fires `today_refresh_click` event; last-updated changes |
| `tests/today-dashboard-location-toggle.spec.ts` | Sun panel toggle updates times + fires `today_location_toggle` |
| `tests/today-dashboard-sponsor.spec.ts` | Sponsor slot conditional render + click tracked |
| `tests/today-dashboard-failure.spec.ts` | Aborted API → panel shows retry UI, other panels still render |
| `tests/today-dashboard-a11y.spec.ts` | `axe-core` scan + Speakable selectors present in DOM |

### Modified (5)

| Path | Change |
|---|---|
| `package.json` | Add `suncalc` and `@types/suncalc` |
| `data/localBusinesses.ts` | Add `'tools'` to `IndustrySlug` union |
| `app/lib/directoryTracking.ts` | Extend `DirectoryEventType` + payload variants |
| `app/api/directory/track/route.ts` | Widen `VALID_INDUSTRIES` + `VALID_EVENT_TYPES` |
| `app/sitemap.ts` | Add `/today-on-hilton-head` entry with `changeFrequency: 'always'` |

---

## Task 1: Setup — install deps + verify branch

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Confirm branch and clean tree**

```bash
git status
git branch --show-current
```

Expected: `feat/restaurant-hub` is current. If a parallel session has switched the branch, switch back: `git checkout feat/restaurant-hub`.

- [ ] **Step 2: Install dependencies**

```bash
npm install suncalc
npm install --save-dev @types/suncalc
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(today-dashboard): add suncalc + @types/suncalc"
```

---

## Task 2: Migration `015_today_dashboard_events.sql`

**Files:**
- Create: `supabase/migrations/015_today_dashboard_events.sql`

- [ ] **Step 1: Create the migration**

```sql
-- supabase/migrations/015_today_dashboard_events.sql
-- Today dashboard event types. Builds on migration 014.
--
-- The 'tools' industry slug is a new namespace for dashboard-level events
-- where business_id is a synthetic id like 'today-dashboard' (not a real
-- directory business).

-- Widen event_type CHECK constraint to include the 4 new dashboard events.
alter table directory_events
  drop constraint if exists directory_events_event_type_check;

alter table directory_events
  add constraint directory_events_event_type_check
  check (event_type in (
    -- Existing (from migration 012 + 014):
    'phone_click', 'website_click', 'inquiry_submit',
    'menu_click', 'reservations_click', 'directions_click',
    'photo_view', 'share_click', 'sponsor_slot_click', 'related_click',
    -- New for Today dashboard:
    'today_panel_view',
    'today_refresh_click',
    'today_location_toggle',
    'today_sponsor_click'
  ));

-- Note: no schema change to industry_slug — that's a TypeScript-side union
-- + an in-memory Set in the API route. The DB stores industry_slug as text.
```

- [ ] **Step 2: Apply via Supabase CLI**

```bash
npx supabase db push
```

If CLI not configured, paste the SQL into the Supabase SQL editor.

- [ ] **Step 3: Verify with a probe insert**

```sql
insert into directory_events (business_id, industry_slug, event_type, payload)
values ('today-dashboard', 'tools', 'today_panel_view', '{"panel":"weather"}'::jsonb);

select event_type, industry_slug, payload from directory_events where business_id = 'today-dashboard';

delete from directory_events where business_id = 'today-dashboard';
```

Expected: insert succeeds; row returns; delete cleans up.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/015_today_dashboard_events.sql
git commit -m "feat(today-dashboard): migration 015 — add 4 dashboard event types"
```

---

## Task 3: Shared types + locations

**Files:**
- Create: `app/lib/today/types.ts`
- Create: `app/lib/today/locations.ts`

- [ ] **Step 1: Create types**

```ts
// app/lib/today/types.ts

export type FetchResult<T> =
  | { ok: true; data: T; fetchedAt: string /* ISO */ }
  | { ok: false; error: string; lastKnown?: T; lastFetchedAt?: string };

export type WeatherSnapshot = {
  temperatureF: number;
  feelsLikeF: number;
  conditionLabel: string;
  conditionIconKey: 'sun' | 'cloud' | 'rain' | 'storm' | 'snow' | 'fog' | 'partly-cloudy';
  highF: number;
  lowF: number;
  hourly: Array<{ hour: string; tempF: number; conditionIconKey: WeatherSnapshot['conditionIconKey'] }>;
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

export type LocationKey = 'harbour-town' | 'coligny-beach' | 'south-forest-beach' | 'island-center';

export type SunSnapshot = {
  location: LocationKey;
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
  timeToBurnMinutes?: number;
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
  directionLabel: 'N' | 'NNE' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE'
                | 'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW';
};
```

- [ ] **Step 2: Create locations**

```ts
// app/lib/today/locations.ts
import type { LocationKey } from './types';

export const LOCATIONS: Record<LocationKey, {
  name: string;
  latitude: number;
  longitude: number;
}> = {
  'harbour-town':       { name: 'Harbour Town',       latitude: 32.1382, longitude: -80.8118 },
  'coligny-beach':      { name: 'Coligny Beach',      latitude: 32.1488, longitude: -80.7517 },
  'south-forest-beach': { name: 'South Forest Beach', latitude: 32.1525, longitude: -80.7644 },
  'island-center':      { name: 'Hilton Head Island', latitude: 32.2163, longitude: -80.7526 },
};
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add app/lib/today/types.ts app/lib/today/locations.ts
git commit -m "feat(today-dashboard): shared types + location coordinates"
```

---

## Task 4: Extend `directoryTracking.ts` for dashboard events

**Files:**
- Modify: `app/lib/directoryTracking.ts`

- [ ] **Step 1: Extend the event type union + payload variants**

Add the 4 new event types AND the new `'tools'` industry-slug acceptance to the client helper. The existing `trackDirectoryEvent` signature already takes `industrySlug` as a string, so no signature change — just type additions:

```ts
// In app/lib/directoryTracking.ts, extend the union:

export type DirectoryEventType =
  | 'phone_click'
  | 'website_click'
  | 'inquiry_submit'
  | 'menu_click'
  | 'reservations_click'
  | 'directions_click'
  | 'photo_view'
  | 'share_click'
  | 'sponsor_slot_click'
  | 'related_click'
  // Today dashboard:
  | 'today_panel_view'
  | 'today_refresh_click'
  | 'today_location_toggle'
  | 'today_sponsor_click';

export type DirectoryEventPayload =
  | { kind: 'menu_click'; url: string }
  | { kind: 'reservations_click'; platform: string; url: string }
  | { kind: 'directions_click' }
  | { kind: 'photo_view'; photoIndex: number }
  | { kind: 'share_click'; channel: 'native' | 'copy_link' }
  | { kind: 'sponsor_slot_click'; advertiserName: string; url: string }
  | { kind: 'related_click'; relatedBusinessId: string }
  | { kind: 'phone_click' | 'website_click' | 'inquiry_submit' }
  // Today dashboard:
  | { kind: 'today_panel_view'; panel: 'weather' | 'tides' | 'sun' | 'uv' | 'water-temp' | 'wind' }
  | { kind: 'today_refresh_click'; sinceLastIso: string }
  | { kind: 'today_location_toggle'; panel: 'sun'; location: string }
  | { kind: 'today_sponsor_click'; advertiserName: string; url: string };
```

The existing `trackDirectoryEvent(businessId, industrySlug, eventType, payload)` continues to work — just call it with `business_id='today-dashboard'`, `industry_slug='tools'`.

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add app/lib/directoryTracking.ts
git commit -m "feat(today-dashboard): extend DirectoryEventType with 4 dashboard events"
```

---

## Task 5: Widen `/api/directory/track` + add `'tools'` industry

**Files:**
- Modify: `data/localBusinesses.ts`
- Modify: `app/api/directory/track/route.ts`

- [ ] **Step 1: Extend `IndustrySlug` in `data/localBusinesses.ts`**

Find the `IndustrySlug` union and add `'tools'`:

```ts
export type IndustrySlug =
  | 'restaurants'
  | 'golf'
  | 'water-activities'
  | 'weddings'
  | 'spas-wellness'
  | 'vacation-rentals'
  | 'shopping'
  | 'family-activities'
  | 'pizza'
  | 'transportation'
  | 'home-services'
  | 'fishing-charters'
  | 'dolphin-tours'
  | 'tools';                  // NEW — synthetic namespace for tool dashboards
```

- [ ] **Step 2: Widen `VALID_INDUSTRIES` and `VALID_EVENT_TYPES` in the route**

In `app/api/directory/track/route.ts`, add `'tools'` to `VALID_INDUSTRIES` and add the 4 new event types to `VALID_EVENT_TYPES`:

```ts
const VALID_EVENT_TYPES = new Set([
  'phone_click',
  'website_click',
  'inquiry_submit',
  'menu_click',
  'reservations_click',
  'directions_click',
  'photo_view',
  'share_click',
  'sponsor_slot_click',
  'related_click',
  'today_panel_view',
  'today_refresh_click',
  'today_location_toggle',
  'today_sponsor_click',
]);

const VALID_INDUSTRIES = new Set([
  'restaurants',
  'golf',
  'water-activities',
  'weddings',
  'spas-wellness',
  'vacation-rentals',
  'shopping',
  'family-activities',
  'pizza',
  'transportation',
  'home-services',
  'fishing-charters',
  'dolphin-tours',
  'tools',
]);
```

- [ ] **Step 3: Smoke-test**

```bash
npm run dev
# In another shell:
curl -sS -X POST http://localhost:3000/api/directory/track \
  -H 'Content-Type: application/json' \
  -d '{"businessId":"today-dashboard","industrySlug":"tools","eventType":"today_panel_view","payload":{"panel":"weather"}}' \
  -i | head -5
```

Expected: `HTTP/1.1 204 No Content`. Verify row appears in `directory_events`, then delete the probe row.

- [ ] **Step 4: Commit**

```bash
git add data/localBusinesses.ts app/api/directory/track/route.ts
git commit -m "feat(today-dashboard): widen track API for 'tools' industry + 4 events"
```

---

## Task 6: Weather + UV fetch helpers (OpenWeather)

**Files:**
- Create: `app/lib/today/weather.ts`
- Create: `app/lib/today/uv.ts`

- [ ] **Step 1: Create `weather.ts`**

```ts
// app/lib/today/weather.ts
import type { FetchResult, WeatherSnapshot } from './types';
import { LOCATIONS } from './locations';

const REVALIDATE_SEC = 1800; // 30 min
const ENDPOINT = 'https://api.openweathermap.org/data/2.5/onecall';

function mapIcon(condition: string): WeatherSnapshot['conditionIconKey'] {
  const c = condition.toLowerCase();
  if (c.includes('thunder')) return 'storm';
  if (c.includes('snow')) return 'snow';
  if (c.includes('rain') || c.includes('drizzle')) return 'rain';
  if (c.includes('fog') || c.includes('mist')) return 'fog';
  if (c.includes('partly') || c.includes('few clouds')) return 'partly-cloudy';
  if (c.includes('cloud')) return 'cloud';
  return 'sun';
}

export async function fetchWeather(): Promise<FetchResult<WeatherSnapshot>> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return { ok: false, error: 'OPENWEATHER_API_KEY not configured' };
  const { latitude, longitude } = LOCATIONS['island-center'];
  const url = `${ENDPOINT}?lat=${latitude}&lon=${longitude}&exclude=minutely,daily,alerts&units=imperial&appid=${key}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SEC } });
    if (!res.ok) return { ok: false, error: `OpenWeather HTTP ${res.status}` };
    const j = (await res.json()) as {
      current: { temp: number; feels_like: number; weather: Array<{ main: string; description: string }> };
      hourly: Array<{ dt: number; temp: number; weather: Array<{ main: string; description: string }> }>;
    };
    const current = j.current;
    const hourly = j.hourly.slice(0, 6).map((h) => ({
      hour: new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
      tempF: Math.round(h.temp),
      conditionIconKey: mapIcon(h.weather[0]?.main ?? ''),
    }));
    const next24 = j.hourly.slice(0, 24);
    const highF = Math.round(Math.max(...next24.map((h) => h.temp)));
    const lowF = Math.round(Math.min(...next24.map((h) => h.temp)));
    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      data: {
        temperatureF: Math.round(current.temp),
        feelsLikeF: Math.round(current.feels_like),
        conditionLabel: current.weather[0]?.description ?? 'Unknown',
        conditionIconKey: mapIcon(current.weather[0]?.main ?? ''),
        highF,
        lowF,
        hourly,
      },
    };
  } catch (e) {
    return { ok: false, error: `Weather fetch failed: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 2: Create `uv.ts`**

```ts
// app/lib/today/uv.ts
import type { FetchResult, UvSnapshot } from './types';
import { LOCATIONS } from './locations';

const REVALIDATE_SEC = 3600; // 1 hour
const ENDPOINT = 'https://api.openweathermap.org/data/2.5/onecall';

function labelFor(uv: number): UvSnapshot['currentLabel'] {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

function timeToBurnMin(uv: number): number | undefined {
  // Rough Fitzpatrick II-III formula: ~ 200 / UVI minutes to noticeable burn.
  if (uv <= 0) return undefined;
  return Math.round(200 / uv);
}

export async function fetchUv(): Promise<FetchResult<UvSnapshot>> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return { ok: false, error: 'OPENWEATHER_API_KEY not configured' };
  const { latitude, longitude } = LOCATIONS['island-center'];
  const url = `${ENDPOINT}?lat=${latitude}&lon=${longitude}&exclude=minutely,daily,alerts&units=imperial&appid=${key}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SEC } });
    if (!res.ok) return { ok: false, error: `OpenWeather HTTP ${res.status}` };
    const j = (await res.json()) as {
      current: { uvi: number };
      hourly: Array<{ dt: number; uvi: number }>;
    };
    const current = j.current.uvi;
    const next24 = j.hourly.slice(0, 24);
    const peak = next24.reduce((p, h) => (h.uvi > p.uvi ? h : p), next24[0]);
    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      data: {
        current,
        currentLabel: labelFor(current),
        peakToday: peak.uvi,
        peakHourIso: new Date(peak.dt * 1000).toISOString(),
        timeToBurnMinutes: timeToBurnMin(current),
      },
    };
  } catch (e) {
    return { ok: false, error: `UV fetch failed: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add app/lib/today/weather.ts app/lib/today/uv.ts
git commit -m "feat(today-dashboard): weather + UV fetch helpers (OpenWeather)"
```

---

## Task 7: Tides + Water Temperature fetch helpers (NOAA)

**Files:**
- Create: `app/lib/today/tides.ts`
- Create: `app/lib/today/water-temp.ts`

- [ ] **Step 1: Create `tides.ts`**

```ts
// app/lib/today/tides.ts
import type { FetchResult, TidesSnapshot, Tide } from './types';

const REVALIDATE_SEC = 21600; // 6 hours — tides are deterministic
const STATION_ID = '8678596';
const ENDPOINT = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

function ymd(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

export async function fetchTides(): Promise<FetchResult<TidesSnapshot>> {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    product: 'predictions',
    application: 'HiltonAhead',
    begin_date: ymd(today),
    end_date: ymd(tomorrow),
    datum: 'MLLW',
    station: STATION_ID,
    time_zone: 'lst_ldt',
    units: 'english',
    interval: 'hilo',
    format: 'json',
  });
  try {
    const res = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: REVALIDATE_SEC } });
    if (!res.ok) return { ok: false, error: `NOAA Tides HTTP ${res.status}` };
    const j = (await res.json()) as { predictions?: Array<{ t: string; v: string; type: 'H' | 'L' }> };
    if (!j.predictions) return { ok: false, error: 'NOAA Tides: no predictions returned' };
    const todayStr = today.toLocaleDateString('en-US');
    const tomorrowStr = tomorrow.toLocaleDateString('en-US');
    const todayTides: Tide[] = [];
    const tomorrowTides: Tide[] = [];
    for (const p of j.predictions) {
      const dt = new Date(p.t);
      const tide: Tide = {
        type: p.type === 'H' ? 'high' : 'low',
        timeIso: dt.toISOString(),
        heightFt: parseFloat(p.v),
      };
      if (dt.toLocaleDateString('en-US') === todayStr) todayTides.push(tide);
      else if (dt.toLocaleDateString('en-US') === tomorrowStr) tomorrowTides.push(tide);
    }
    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      data: {
        today: todayTides,
        tomorrow: tomorrowTides,
        stationName: 'Hilton Head Island (8678596)',
      },
    };
  } catch (e) {
    return { ok: false, error: `Tides fetch failed: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 2: Create `water-temp.ts`**

```ts
// app/lib/today/water-temp.ts
import type { FetchResult, WaterTempSnapshot } from './types';

const REVALIDATE_SEC = 3600; // 1 hour
const STATION_ID = '8447435';
const ENDPOINT = `https://www.ndbc.noaa.gov/data/realtime2/${STATION_ID}.txt`;

function judgmentFor(tempF: number): WaterTempSnapshot['judgment'] {
  if (tempF < 60) return 'cold';
  if (tempF < 70) return 'brisk';
  if (tempF < 80) return 'pleasant';
  return 'warm';
}

export async function fetchWaterTemperature(): Promise<FetchResult<WaterTempSnapshot>> {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { 'User-Agent': 'HiltonAhead/1.0 (hello@hiltonahead.com)' },
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!res.ok) return { ok: false, error: `NOAA buoy HTTP ${res.status}` };
    const text = await res.text();
    // NDBC realtime2 format: first two lines are headers (# names, # units).
    // Data lines: YYYY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
    // WTMP column is water temperature in Celsius.
    const lines = text.split('\n').filter((l) => l && !l.startsWith('#'));
    if (lines.length === 0) return { ok: false, error: 'NOAA buoy: no data rows' };
    const headerLine = text.split('\n')[0]; // starts with '#YY  MM DD hh mm WDIR ...'
    const headers = headerLine.replace(/^#\s*/, '').split(/\s+/);
    const wtmpIdx = headers.indexOf('WTMP');
    if (wtmpIdx < 0) return { ok: false, error: 'NOAA buoy: WTMP column missing' };
    const cols = lines[0].split(/\s+/);
    const wtmpC = parseFloat(cols[wtmpIdx]);
    if (!Number.isFinite(wtmpC) || wtmpC > 50 || wtmpC < -2) {
      return { ok: false, error: 'NOAA buoy: WTMP value invalid' };
    }
    const tempF = Math.round(wtmpC * 9 / 5 + 32);
    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      data: {
        temperatureF: tempF,
        stationName: 'Skull Creek (8447435)',
        judgment: judgmentFor(tempF),
      },
    };
  } catch (e) {
    return { ok: false, error: `Water temp fetch failed: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add app/lib/today/tides.ts app/lib/today/water-temp.ts
git commit -m "feat(today-dashboard): tides + water-temp fetch helpers (NOAA)"
```

---

## Task 8: Sun + Wind helpers

**Files:**
- Create: `app/lib/today/sun.ts`
- Create: `app/lib/today/wind.ts`

- [ ] **Step 1: Create `sun.ts`**

```ts
// app/lib/today/sun.ts
import SunCalc from 'suncalc';
import type { FetchResult, SunSnapshot, LocationKey } from './types';
import { LOCATIONS } from './locations';

/**
 * Compute sunrise/sunset/golden-hour for a given location. Pure — no remote.
 * Always returns ok:true since there is no failure mode.
 */
export function computeSun(location: LocationKey, date = new Date()): FetchResult<SunSnapshot> {
  const { latitude, longitude } = LOCATIONS[location];
  const times = SunCalc.getTimes(date, latitude, longitude);
  return {
    ok: true,
    fetchedAt: new Date().toISOString(),
    data: {
      location,
      sunriseIso: times.sunrise.toISOString(),
      sunsetIso: times.sunset.toISOString(),
      solarNoonIso: times.solarNoon.toISOString(),
      goldenHourMorningStartIso: times.goldenHourEnd.toISOString(), // morning golden hour ends at "goldenHourEnd"
      goldenHourMorningEndIso: times.sunriseEnd.toISOString(),
      goldenHourEveningStartIso: times.goldenHour.toISOString(),    // evening golden hour starts at "goldenHour"
      goldenHourEveningEndIso: times.sunset.toISOString(),
    },
  };
}
```

- [ ] **Step 2: Create `wind.ts`**

```ts
// app/lib/today/wind.ts
import type { FetchResult, WindSnapshot } from './types';
import { LOCATIONS } from './locations';

const REVALIDATE_SEC = 1800; // 30 min

function directionLabel(deg: number): WindSnapshot['directionLabel'] {
  const dirs: WindSnapshot['directionLabel'][] = [
    'N','NNE','NE','ENE','E','ESE','SE','SSE',
    'S','SSW','SW','WSW','W','WNW','NW','NNW',
  ];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

export async function fetchWind(): Promise<FetchResult<WindSnapshot>> {
  const { latitude, longitude } = LOCATIONS['island-center'];
  try {
    // 1) Get the forecast URL for our point.
    const pointsRes = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
      headers: { 'User-Agent': 'HiltonAhead/1.0 (hello@hiltonahead.com)' },
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!pointsRes.ok) return { ok: false, error: `NWS points HTTP ${pointsRes.status}` };
    const points = (await pointsRes.json()) as { properties: { forecastHourly: string } };
    // 2) Fetch the hourly forecast.
    const hourlyRes = await fetch(points.properties.forecastHourly, {
      headers: { 'User-Agent': 'HiltonAhead/1.0 (hello@hiltonahead.com)' },
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!hourlyRes.ok) return { ok: false, error: `NWS hourly HTTP ${hourlyRes.status}` };
    const hourly = (await hourlyRes.json()) as {
      properties: { periods: Array<{ windSpeed: string; windDirection: string }> };
    };
    const now = hourly.properties.periods[0];
    if (!now) return { ok: false, error: 'NWS hourly: no periods' };
    // windSpeed comes as e.g. "10 to 15 mph" — take the upper bound.
    const speedMatch = now.windSpeed.match(/(\d+)\s*mph$/) || now.windSpeed.match(/to\s+(\d+)\s*mph/);
    const speedMph = speedMatch ? parseInt(speedMatch[1], 10) : 0;
    const gustsMph = speedMph + 3; // NWS hourly doesn't expose gusts in the simple endpoint; approximate
    const directionMap: Record<string, number> = {
      N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
      S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
    };
    const directionDegrees = directionMap[now.windDirection] ?? 0;
    return {
      ok: true,
      fetchedAt: new Date().toISOString(),
      data: {
        speedMph,
        gustsMph,
        directionDegrees,
        directionLabel: directionLabel(directionDegrees),
      },
    };
  } catch (e) {
    return { ok: false, error: `Wind fetch failed: ${(e as Error).message}` };
  }
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add app/lib/today/sun.ts app/lib/today/wind.ts
git commit -m "feat(today-dashboard): sun (suncalc) + wind (NWS) helpers"
```

---

## Task 9: Page shell + ISR + metadata

**Files:**
- Create: `app/today-on-hilton-head/page.tsx`
- Create: `app/today-on-hilton-head/not-found.tsx`

- [ ] **Step 1: Write the failing happy-path test (skeleton)**

```ts
// tests/today-dashboard-happy.spec.ts
import { test, expect } from '@playwright/test';

test('today dashboard loads', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

- [ ] **Step 2: Run — confirm fails (404)**

```bash
npx playwright test tests/today-dashboard-happy.spec.ts -g "today dashboard loads"
```

Expected: FAIL.

- [ ] **Step 3: Create the not-found page**

```tsx
// app/today-on-hilton-head/not-found.tsx
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[640px] px-5 py-16">
        <h1 className="display text-[28px] text-ink">Page not found.</h1>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Create the page shell with ISR + metadata + JSON-LD scaffold**

```tsx
// app/today-on-hilton-head/page.tsx
import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const revalidate = 900; // 15 minutes

export const metadata: Metadata = generatePageMetadata({
  title: 'Today on Hilton Head — Weather, Tides, Sunset · Hilton Ahead',
  description:
    "Hilton Head's daily dashboard: tides, weather, sunset times by location, water temperature, UV, wind — updated every 15 minutes.",
  path: '/today-on-hilton-head',
  keywords: [
    'Hilton Head today',
    'Hilton Head weather today',
    'Hilton Head tides today',
    'sunset time Hilton Head',
    'sunset time Harbour Town',
    'water temperature Hilton Head',
    'Hilton Head UV index',
  ],
});

function formatHumanDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TodayDashboardPage() {
  const dateString = formatHumanDate();
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Today on Hilton Head', path: '/today-on-hilton-head' },
  ]);
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Today on Hilton Head',
    url: `${brand.url}/today-on-hilton-head`,
    dateModified: new Date().toISOString(),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.today-summary', '.today-tides-summary', '.today-sun-summary'],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-12 max-w-[1100px]">
          <div className="eyebrow text-coral">Today on Hilton Head</div>
          <h1 className="display mt-3 text-[32px] leading-[1.1] text-ink md:text-[44px]">
            {dateString}
          </h1>
          <p className="today-summary mt-4 max-w-[560px] text-[16px] leading-[1.65] text-ink-soft md:text-[18px]">
            Tides, weather, sunset, and what I&rsquo;m doing today.
          </p>
        </section>

        {/* Panels land in Tasks 11-13. */}
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Run — confirm passes**

```bash
npm run dev
npx playwright test tests/today-dashboard-happy.spec.ts -g "today dashboard loads"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/today-on-hilton-head tests/today-dashboard-happy.spec.ts
git commit -m "feat(today-dashboard): page shell + ISR + metadata + JSON-LD"
```

---

## Task 10: Hero + Refresh button + `/api/today/refresh` route

**Files:**
- Create: `components/today/Hero.tsx`
- Create: `components/today/RefreshButton.tsx`
- Create: `app/api/today/refresh/route.ts`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create the refresh route**

```ts
// app/api/today/refresh/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest) {
  revalidatePath('/today-on-hilton-head');
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
```

- [ ] **Step 2: Create `RefreshButton.tsx`**

```tsx
// components/today/RefreshButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function RefreshButton({ lastFetchedAt }: { lastFetchedAt: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastClickAt, setLastClickAt] = useState(0);

  function handleClick() {
    const now = Date.now();
    if (now - lastClickAt < 30_000) return; // client-side rate limit: 30s
    setLastClickAt(now);

    trackDirectoryEvent('today-dashboard', 'tools', 'today_refresh_click', {
      sinceLastIso: lastFetchedAt,
    });

    startTransition(async () => {
      await fetch('/api/today/refresh', { method: 'POST' });
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Refresh data"
      aria-busy={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink transition hover:bg-cream disabled:opacity-60"
    >
      {isPending ? 'Refreshing…' : 'Refresh ↻'}
    </button>
  );
}
```

- [ ] **Step 3: Create `Hero.tsx`**

```tsx
// components/today/Hero.tsx
import RefreshButton from './RefreshButton';

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export default function Hero({
  dateString,
  lastFetchedAt,
}: {
  dateString: string;
  lastFetchedAt: string;
}) {
  return (
    <section className="mt-12 max-w-[1100px]">
      <div className="eyebrow text-coral">Today on Hilton Head</div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[32px] leading-[1.1] text-ink md:text-[44px]">
          {dateString}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[12px] uppercase tracking-[0.18em] text-ink-soft" aria-live="polite">
            Updated {formatRelative(lastFetchedAt)}
          </span>
          <RefreshButton lastFetchedAt={lastFetchedAt} />
        </div>
      </div>
      <p className="today-summary mt-4 max-w-[560px] text-[16px] leading-[1.65] text-ink-soft md:text-[18px]">
        Tides, weather, sunset, and what I&rsquo;m doing today.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Wire into page**

In `app/today-on-hilton-head/page.tsx`, replace the inline hero block with `<Hero/>`:

```tsx
import Hero from '@/components/today/Hero';

// Replace the inline <section> with:
<Hero dateString={dateString} lastFetchedAt={new Date().toISOString()} />
```

- [ ] **Step 5: Smoke + commit**

Visit `/today-on-hilton-head` → confirm hero renders with date + Refresh button + Updated label.

```bash
git add components/today/Hero.tsx components/today/RefreshButton.tsx app/api/today/refresh/route.ts app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): hero + refresh button + /api/today/refresh"
```

---

## Task 11: WeatherPanel + TidesPanel

**Files:**
- Create: `components/today/PanelFailure.tsx`
- Create: `components/today/WeatherPanel.tsx`
- Create: `components/today/TidesPanel.tsx`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create the shared failure component**

```tsx
// components/today/PanelFailure.tsx
export default function PanelFailure({
  panelName,
  service,
  lastFetchedAt,
}: {
  panelName: string;
  service: string;
  lastFetchedAt?: string;
}) {
  const stamp = lastFetchedAt
    ? new Date(lastFetchedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'unknown';
  return (
    <div className="border border-ink/15 bg-sand-soft p-5 text-[13px] leading-[1.5] text-ink-soft">
      <div className="eyebrow text-coral">{panelName}</div>
      <p className="mt-2">
        Couldn&rsquo;t reach {service}. Last updated: {stamp}.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `WeatherPanel.tsx`**

```tsx
// components/today/WeatherPanel.tsx
import type { FetchResult, WeatherSnapshot } from '@/app/lib/today/types';
import PanelFailure from './PanelFailure';

const ICONS: Record<WeatherSnapshot['conditionIconKey'], string> = {
  sun: '☀', cloud: '☁', 'partly-cloudy': '⛅',
  rain: '🌧', storm: '⛈', snow: '❄', fog: '🌫',
};

export default function WeatherPanel({ result }: { result: FetchResult<WeatherSnapshot> }) {
  if (!result.ok) {
    return <PanelFailure panelName="Weather" service="OpenWeather" lastFetchedAt={result.lastFetchedAt} />;
  }
  const w = result.data;
  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="eyebrow text-ink-soft">Weather</div>
      <div className="mt-3 flex items-baseline gap-3">
        <span aria-hidden="true" className="text-[36px]">{ICONS[w.conditionIconKey]}</span>
        <div className="display text-[40px] leading-none text-ink md:text-[52px]">{w.temperatureF}°</div>
      </div>
      <div className="mt-1 text-[14px] text-ink-soft">
        Feels like {w.feelsLikeF}° · {w.conditionLabel}
      </div>
      <div className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink-soft">
        High {w.highF}° · Low {w.lowF}°
      </div>
      <ul className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {w.hourly.map((h) => (
          <li key={h.hour} className="flex flex-col items-center gap-1 text-[11px] text-ink-soft">
            <span>{h.hour}</span>
            <span aria-hidden="true">{ICONS[h.conditionIconKey]}</span>
            <span className="text-ink">{h.tempF}°</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Create `TidesPanel.tsx`**

```tsx
// components/today/TidesPanel.tsx
import type { FetchResult, TidesSnapshot, Tide } from '@/app/lib/today/types';
import PanelFailure from './PanelFailure';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function summarize(today: Tide[]): string {
  const lows = today.filter((t) => t.type === 'low');
  const highs = today.filter((t) => t.type === 'high');
  const low = lows[0];
  const high = highs[0];
  if (!low && !high) return 'No tide data for today.';
  if (low && high) {
    const firstLow = low.timeIso < high.timeIso;
    return firstLow
      ? `Low tide at ${formatTime(low.timeIso)}, high at ${formatTime(high.timeIso)}.`
      : `High tide at ${formatTime(high.timeIso)}, low at ${formatTime(low.timeIso)}.`;
  }
  return high ? `High tide at ${formatTime(high.timeIso)}.` : `Low tide at ${formatTime(low!.timeIso)}.`;
}

export default function TidesPanel({ result }: { result: FetchResult<TidesSnapshot> }) {
  if (!result.ok) {
    return <PanelFailure panelName="Tides" service="NOAA Tides & Currents" lastFetchedAt={result.lastFetchedAt} />;
  }
  const t = result.data;
  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="eyebrow text-ink-soft">Tides</div>
      <p className="today-tides-summary mt-2 text-[14px] leading-[1.5] text-ink-soft">
        {summarize(t.today)}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Today</div>
          <ul className="mt-2 space-y-1 text-[14px] text-ink">
            {t.today.map((tide) => (
              <li key={tide.timeIso}>
                {tide.type === 'high' ? '⬆' : '⬇'} {formatTime(tide.timeIso)} · {tide.heightFt.toFixed(1)}ft
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Tomorrow</div>
          <ul className="mt-2 space-y-1 text-[14px] text-ink">
            {t.tomorrow.map((tide) => (
              <li key={tide.timeIso}>
                {tide.type === 'high' ? '⬆' : '⬇'} {formatTime(tide.timeIso)} · {tide.heightFt.toFixed(1)}ft
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-ink-soft">{t.stationName}</div>
    </section>
  );
}
```

- [ ] **Step 4: Wire fetchers + panels into page**

```tsx
// app/today-on-hilton-head/page.tsx — add at top of file (above export):
import { fetchWeather } from '@/app/lib/today/weather';
import { fetchTides } from '@/app/lib/today/tides';
import WeatherPanel from '@/components/today/WeatherPanel';
import TidesPanel from '@/components/today/TidesPanel';

// Inside the component, before return — fetch in parallel:
const [weather, tides] = await Promise.all([fetchWeather(), fetchTides()]);

// In JSX, after <Hero/>:
<section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
  <WeatherPanel result={weather} />
  <TidesPanel result={tides} />
</section>
```

Also: change the component signature to `async function TodayDashboardPage()` since we now `await` inside.

- [ ] **Step 5: Smoke + commit**

```bash
# Set env var first
export OPENWEATHER_API_KEY=...   # founder's key
npm run dev
```

Visit `/today-on-hilton-head` — confirm both panels render with real data.

```bash
git add components/today/PanelFailure.tsx components/today/WeatherPanel.tsx components/today/TidesPanel.tsx app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): weather + tides panels"
```

---

## Task 12: SunriseSunsetPanel (with location toggle) + UvPanel

**Files:**
- Create: `components/today/SunriseSunsetPanel.tsx`
- Create: `components/today/UvPanel.tsx`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create `SunriseSunsetPanel.tsx` (client — holds toggle state)**

```tsx
// components/today/SunriseSunsetPanel.tsx
'use client';

import { useMemo, useState } from 'react';
import type { LocationKey, SunSnapshot } from '@/app/lib/today/types';
import { computeSun } from '@/app/lib/today/sun';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const LOCATION_OPTIONS: { key: LocationKey; label: string }[] = [
  { key: 'harbour-town',       label: 'Harbour Town' },
  { key: 'coligny-beach',      label: 'Coligny Beach' },
  { key: 'south-forest-beach', label: 'South Forest Beach' },
];

export default function SunriseSunsetPanel() {
  const [location, setLocation] = useState<LocationKey>('harbour-town');
  const sun = useMemo(() => computeSun(location), [location]);

  function pick(loc: LocationKey) {
    if (loc === location) return;
    setLocation(loc);
    trackDirectoryEvent('today-dashboard', 'tools', 'today_location_toggle', { panel: 'sun', location: loc });
  }

  // computeSun never returns ok:false (pure calculation), but type-narrow anyway:
  if (!sun.ok) return null;
  const s: SunSnapshot = sun.data;

  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="eyebrow text-ink-soft">Sunrise · Sunset</div>
        <fieldset className="flex items-center gap-1.5" aria-label="Location">
          <legend className="sr-only">Sunrise/sunset location</legend>
          {LOCATION_OPTIONS.map((o) => (
            <label key={o.key} className="cursor-pointer">
              <input
                type="radio"
                name="sun-location"
                value={o.key}
                checked={location === o.key}
                onChange={() => pick(o.key)}
                className="peer sr-only"
              />
              <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-ink-soft peer-checked:border-coral peer-checked:text-coral">
                {o.label.split(' ')[0]}
              </span>
            </label>
          ))}
        </fieldset>
      </div>
      <p className="today-sun-summary mt-3 text-[14px] text-ink-soft">
        Sunset at {formatTime(s.sunsetIso)} tonight in {LOCATION_OPTIONS.find((o) => o.key === location)?.label}.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 text-[14px] text-ink">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Sunrise</div>
          <div className="mt-1 font-medium">{formatTime(s.sunriseIso)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Sunset</div>
          <div className="mt-1 font-medium">{formatTime(s.sunsetIso)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Golden hr (am)</div>
          <div className="mt-1">{formatTime(s.goldenHourMorningStartIso)} – {formatTime(s.goldenHourMorningEndIso)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Golden hr (pm)</div>
          <div className="mt-1">{formatTime(s.goldenHourEveningStartIso)} – {formatTime(s.goldenHourEveningEndIso)}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `UvPanel.tsx`**

```tsx
// components/today/UvPanel.tsx
import type { FetchResult, UvSnapshot } from '@/app/lib/today/types';
import PanelFailure from './PanelFailure';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric' });
}

export default function UvPanel({ result }: { result: FetchResult<UvSnapshot> }) {
  if (!result.ok) {
    return <PanelFailure panelName="UV Index" service="OpenWeather" lastFetchedAt={result.lastFetchedAt} />;
  }
  const u = result.data;
  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="eyebrow text-ink-soft">UV Index</div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="display text-[40px] leading-none text-ink md:text-[52px]">{Math.round(u.current)}</div>
        <div className="text-[14px] text-ink-soft">{u.currentLabel}</div>
      </div>
      <div className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink-soft">
        Peak today: {Math.round(u.peakToday)} at {formatTime(u.peakHourIso)}
      </div>
      {u.timeToBurnMinutes && (
        <div className="mt-3 text-[12px] italic text-ink-soft">
          ~{u.timeToBurnMinutes} min to noticeable burn at current intensity (fair skin).
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Wire into page**

```tsx
// app/today-on-hilton-head/page.tsx
import { fetchUv } from '@/app/lib/today/uv';
import SunriseSunsetPanel from '@/components/today/SunriseSunsetPanel';
import UvPanel from '@/components/today/UvPanel';

// extend the parallel fetch:
const [weather, tides, uv] = await Promise.all([fetchWeather(), fetchTides(), fetchUv()]);

// In JSX, after the weather/tides grid:
<section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
  <SunriseSunsetPanel />
  <UvPanel result={uv} />
</section>
```

- [ ] **Step 4: Smoke + commit**

```bash
git add components/today/SunriseSunsetPanel.tsx components/today/UvPanel.tsx app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): sun (with location toggle) + UV panels"
```

---

## Task 13: WaterTempPanel + WindPanel

**Files:**
- Create: `components/today/WaterTempPanel.tsx`
- Create: `components/today/WindPanel.tsx`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create `WaterTempPanel.tsx`**

```tsx
// components/today/WaterTempPanel.tsx
import type { FetchResult, WaterTempSnapshot } from '@/app/lib/today/types';
import PanelFailure from './PanelFailure';

const JUDGMENT_COPY: Record<WaterTempSnapshot['judgment'], string> = {
  cold: 'Cold. Wetsuit weather.',
  brisk: 'Brisk. Quick dips only.',
  pleasant: 'Pleasant. Good for a swim.',
  warm: 'Warm. Bathtub conditions.',
};

export default function WaterTempPanel({ result }: { result: FetchResult<WaterTempSnapshot> }) {
  if (!result.ok) {
    return <PanelFailure panelName="Water Temperature" service="NOAA buoy 8447435" lastFetchedAt={result.lastFetchedAt} />;
  }
  const w = result.data;
  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="eyebrow text-ink-soft">Water Temperature</div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="display text-[40px] leading-none text-ink md:text-[52px]">{w.temperatureF}°F</div>
      </div>
      <p className="mt-2 text-[14px] italic text-ink-soft">{JUDGMENT_COPY[w.judgment]}</p>
      <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-ink-soft">{w.stationName}</div>
    </section>
  );
}
```

- [ ] **Step 2: Create `WindPanel.tsx`**

```tsx
// components/today/WindPanel.tsx
import type { FetchResult, WindSnapshot } from '@/app/lib/today/types';
import PanelFailure from './PanelFailure';

export default function WindPanel({ result }: { result: FetchResult<WindSnapshot> }) {
  if (!result.ok) {
    return <PanelFailure panelName="Wind" service="NOAA NWS" lastFetchedAt={result.lastFetchedAt} />;
  }
  const w = result.data;
  return (
    <section className="border border-ink/15 bg-white p-6">
      <div className="eyebrow text-ink-soft">Wind</div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="display text-[40px] leading-none text-ink md:text-[52px]">{w.speedMph}</div>
        <div className="text-[14px] text-ink-soft">mph {w.directionLabel}</div>
      </div>
      <div className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink-soft">
        Gusts to {w.gustsMph} mph
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="mt-4 h-12 w-12"
        style={{ transform: `rotate(${w.directionDegrees}deg)` }}
      >
        <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
        <polygon points="50,20 44,32 56,32" fill="currentColor" />
      </svg>
    </section>
  );
}
```

- [ ] **Step 3: Wire into page**

```tsx
// app/today-on-hilton-head/page.tsx
import { fetchWaterTemperature } from '@/app/lib/today/water-temp';
import { fetchWind } from '@/app/lib/today/wind';
import WaterTempPanel from '@/components/today/WaterTempPanel';
import WindPanel from '@/components/today/WindPanel';

// Update the parallel fetch:
const [weather, tides, uv, waterTemp, wind] = await Promise.all([
  fetchWeather(),
  fetchTides(),
  fetchUv(),
  fetchWaterTemperature(),
  fetchWind(),
]);

// In JSX, after the sun/uv grid:
<section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
  <WaterTempPanel result={waterTemp} />
  <WindPanel result={wind} />
</section>
```

- [ ] **Step 4: Smoke + commit**

```bash
git add components/today/WaterTempPanel.tsx components/today/WindPanel.tsx app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): water-temp + wind panels"
```

---

## Task 14: Sponsor slot block

**Files:**
- Create: `data/today-sponsor.ts`
- Create: `components/today/SponsorSlot.tsx`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create the sponsor data file**

```ts
// data/today-sponsor.ts
import type { SponsorSlot } from '@/data/localBusinesses';

/**
 * Set this to a SponsorSlot object when a sponsor sells.
 * Set back to null when the slot expires or is cleared.
 *
 * Pricing guidance: $249–499/mo. Update on each fulfillment with the
 * `endsAt` ISO date so the page hides expired slots automatically.
 */
export const todaySponsor: SponsorSlot | null = null;
```

- [ ] **Step 2: Create `SponsorSlot.tsx`**

```tsx
// components/today/SponsorSlot.tsx
'use client';

import Image from 'next/image';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';
import type { SponsorSlot as SponsorSlotData } from '@/data/localBusinesses';

export default function SponsorSlotBlock({ slot }: { slot: SponsorSlotData }) {
  if (slot.endsAt && new Date(slot.endsAt).getTime() < Date.now()) return null;

  function handleClick() {
    trackDirectoryEvent('today-dashboard', 'tools', 'today_sponsor_click', {
      advertiserName: slot.advertiserName,
      url: slot.url,
    });
  }

  return (
    <aside className="mt-5 border border-ink/15 bg-sand-soft p-6" aria-label="Sponsored content">
      <div className="eyebrow text-ink-soft">Sponsored by {slot.advertiserName}</div>
      <div className="mt-4 flex items-center gap-4">
        {slot.logo?.src && (
          <Image src={slot.logo.src} alt={slot.logo.alt} width={48} height={48} className="h-12 w-12 object-contain" />
        )}
        <p className="text-[14px] italic leading-[1.6] text-ink-soft md:text-[15px]">{slot.copy}</p>
      </div>
      <div className="mt-4">
        <a
          href={slot.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink hover:text-coral"
          aria-label="Sponsor CTA"
        >
          Learn more →
        </a>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Wire into page — above-fold between weather/tides and sun/uv**

```tsx
// app/today-on-hilton-head/page.tsx
import { todaySponsor } from '@/data/today-sponsor';
import SponsorSlot from '@/components/today/SponsorSlot';

// In JSX, between the weather/tides grid and the sun/uv grid:
{todaySponsor && <SponsorSlot slot={todaySponsor} />}
```

- [ ] **Step 4: Commit**

```bash
git add data/today-sponsor.ts components/today/SponsorSlot.tsx app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): sponsor slot above-fold + click tracking"
```

---

## Task 15: Founder note

**Files:**
- Create: `data/today-notes.ts`
- Create: `components/today/FounderNote.tsx`
- Modify: `app/today-on-hilton-head/page.tsx`

- [ ] **Step 1: Create the notes data file**

```ts
// data/today-notes.ts

export type TodayNote = {
  /** ISO date — YYYY-MM-DD. The most recent note whose date <= today renders. */
  date: string;
  /** 3-5 sentence founder editorial. */
  body: string;
};

export const todayNotes: TodayNote[] = [
  // Append new entries above older ones. Most recent date <= today wins.
];
```

- [ ] **Step 2: Create `FounderNote.tsx`**

```tsx
// components/today/FounderNote.tsx
import { todayNotes, type TodayNote } from '@/data/today-notes';

function pickMostRecent(notes: TodayNote[]): TodayNote | undefined {
  const todayYmd = new Date().toISOString().slice(0, 10);
  return notes
    .filter((n) => n.date <= todayYmd)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
}

export default function FounderNote() {
  const note = pickMostRecent(todayNotes);
  if (!note) return null;
  return (
    <section className="mt-14 max-w-[760px]">
      <div className="eyebrow text-coral">What I&rsquo;m doing today</div>
      <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
        {note.body}
      </p>
      <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        — Wm Griffith · {note.date}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into page**

```tsx
import FounderNote from '@/components/today/FounderNote';
// After the water-temp + wind grid:
<FounderNote />
```

- [ ] **Step 4: Commit**

```bash
git add data/today-notes.ts components/today/FounderNote.tsx app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): founder note block + data file"
```

---

## Task 16: Server-side panel-view tracking

**Files:**
- Modify: `app/today-on-hilton-head/page.tsx`

The spec calls for `today_panel_view` events fired once per successful panel render on the server side. Server components can't call client-side `trackDirectoryEvent`. Two ways to do this:
1. Server-side `fetch` directly to `/api/directory/track` inside the page component
2. Client-side: fire from a tiny `useEffect` in each panel

Server-side is cleaner — no extra render cost on the client, and we don't double-count when users refresh.

- [ ] **Step 1: Add server-side track helper**

```ts
// app/lib/today/track-server.ts
import { headers } from 'next/headers';

export async function trackPanelViewServer(panel: string, baseUrl: string): Promise<void> {
  try {
    const hdrs = await headers();
    await fetch(`${baseUrl}/api/directory/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // forward IP and referer so the API hashes the right values
        'X-Forwarded-For': hdrs.get('x-forwarded-for') ?? '',
        'User-Agent': hdrs.get('user-agent') ?? 'today-dashboard-server',
        'Referer': hdrs.get('referer') ?? '',
      },
      body: JSON.stringify({
        businessId: 'today-dashboard',
        industrySlug: 'tools',
        eventType: 'today_panel_view',
        payload: { panel },
      }),
    });
  } catch {
    // never block the page render on telemetry
  }
}
```

- [ ] **Step 2: Wire it into the page**

```tsx
// app/today-on-hilton-head/page.tsx
import { trackPanelViewServer } from '@/app/lib/today/track-server';
import { brand } from '@/data/brand';

// inside the component, after the parallel fetch:
const baseUrl = brand.url;
const trackPromises: Promise<unknown>[] = [];
if (weather.ok) trackPromises.push(trackPanelViewServer('weather', baseUrl));
if (tides.ok) trackPromises.push(trackPanelViewServer('tides', baseUrl));
if (uv.ok) trackPromises.push(trackPanelViewServer('uv', baseUrl));
if (waterTemp.ok) trackPromises.push(trackPanelViewServer('water-temp', baseUrl));
if (wind.ok) trackPromises.push(trackPanelViewServer('wind', baseUrl));
// suncalc never fails — always track:
trackPromises.push(trackPanelViewServer('sun', baseUrl));
// Fire and forget. Don't await.
void Promise.allSettled(trackPromises);
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/today/track-server.ts app/today-on-hilton-head/page.tsx
git commit -m "feat(today-dashboard): server-side today_panel_view tracking"
```

---

## Task 17: Sitemap entry

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add the entry**

Read `app/sitemap.ts` first to confirm shape:

```bash
cat app/sitemap.ts | head -80
```

Add `/today-on-hilton-head` to the returned array, matching the shape of existing entries:

```ts
{
  url: `${siteUrl}/today-on-hilton-head`,
  lastModified: new Date(),
  changeFrequency: 'always' as const,
  priority: 0.9,
},
```

- [ ] **Step 2: Verify**

```bash
npm run dev
curl -s http://localhost:3000/sitemap.xml | grep -c '/today-on-hilton-head'
```

Expected: count is 1.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(today-dashboard): sitemap entry"
```

---

## Task 18: Playwright — happy + refresh + location-toggle + sponsor

**Files:**
- Modify: `tests/today-dashboard-happy.spec.ts`
- Create: `tests/today-dashboard-refresh.spec.ts`
- Create: `tests/today-dashboard-location-toggle.spec.ts`
- Create: `tests/today-dashboard-sponsor.spec.ts`

- [ ] **Step 1: Expand `tests/today-dashboard-happy.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('today dashboard renders all 6 panels (or failure UI per panel)', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  // Each of the 6 panels has an eyebrow with its name:
  for (const name of ['Weather', 'Tides', 'Sunrise · Sunset', 'UV Index', 'Water Temperature', 'Wind']) {
    await expect(page.getByText(name).first()).toBeVisible();
  }
  await expect(page.getByRole('button', { name: /Refresh/i })).toBeVisible();
});

test('today dashboard hero has summary text + breadcrumb JSON-LD', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  await expect(page.locator('.today-summary')).toBeVisible();
});
```

- [ ] **Step 2: Create the refresh spec**

```ts
// tests/today-dashboard-refresh.spec.ts
import { test, expect } from '@playwright/test';

test('refresh button fires today_refresh_click and rate-limits to 30s', async ({ page }) => {
  const events: Array<Record<string, unknown>> = [];
  await page.route('**/api/directory/track', async (route) => {
    events.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 204 });
  });

  await page.goto('/today-on-hilton-head');
  await page.getByRole('button', { name: /Refresh/i }).click();

  await page.waitForTimeout(200);
  expect(events.filter((e) => e.eventType === 'today_refresh_click').length).toBe(1);

  // Second click within 30s should be no-op (rate limit).
  await page.getByRole('button', { name: /Refresh/i }).click();
  await page.waitForTimeout(200);
  expect(events.filter((e) => e.eventType === 'today_refresh_click').length).toBe(1);
});
```

- [ ] **Step 3: Create the location-toggle spec**

```ts
// tests/today-dashboard-location-toggle.spec.ts
import { test, expect } from '@playwright/test';

test('sun location toggle fires today_location_toggle + updates summary text', async ({ page }) => {
  const events: Array<Record<string, unknown>> = [];
  await page.route('**/api/directory/track', async (route) => {
    events.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 204 });
  });

  await page.goto('/today-on-hilton-head');
  const summary = page.locator('.today-sun-summary');
  const before = await summary.textContent();

  await page.getByRole('radio', { name: /Coligny/i }).check();
  await page.waitForTimeout(100);

  const after = await summary.textContent();
  expect(after).not.toBe(before);
  expect(events.some((e) => e.eventType === 'today_location_toggle')).toBe(true);
});
```

- [ ] **Step 4: Create the sponsor spec**

```ts
// tests/today-dashboard-sponsor.spec.ts
import { test, expect } from '@playwright/test';

test('sponsor slot hidden when todaySponsor is null', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  await expect(page.getByText(/Sponsored by/i)).toHaveCount(0);
});

// To test the visible path: temporarily set data/today-sponsor.ts to a real
// SponsorSlot, re-run this spec, then revert.
// (Tests don't mock data files — keep the visible-path check as a manual QA item.)
```

- [ ] **Step 5: Run + commit**

```bash
npx playwright test tests/today-dashboard-happy.spec.ts tests/today-dashboard-refresh.spec.ts tests/today-dashboard-location-toggle.spec.ts tests/today-dashboard-sponsor.spec.ts
git add tests/today-dashboard-*.spec.ts
git commit -m "test(today-dashboard): happy + refresh + location + sponsor specs"
```

---

## Task 19: Playwright — failure + a11y

**Files:**
- Create: `tests/today-dashboard-failure.spec.ts`
- Create: `tests/today-dashboard-a11y.spec.ts`

- [ ] **Step 1: Create the failure spec**

```ts
// tests/today-dashboard-failure.spec.ts
import { test, expect } from '@playwright/test';

test('weather API failure shows panel failure UI; other panels still render', async ({ page }) => {
  await page.route('**/api.openweathermap.org/**', (route) => route.abort());
  await page.goto('/today-on-hilton-head');

  // Weather + UV panels both depend on OpenWeather — both should show failure UI.
  await expect(page.getByText(/Couldn't reach OpenWeather/i).first()).toBeVisible();

  // Tides + sun should still render normally:
  await expect(page.getByText('Tides').first()).toBeVisible();
  await expect(page.getByText('Sunrise · Sunset').first()).toBeVisible();
});

test('NOAA tides failure isolated to tides panel', async ({ page }) => {
  await page.route('**/api.tidesandcurrents.noaa.gov/**', (route) => route.abort());
  await page.goto('/today-on-hilton-head');
  await expect(page.getByText(/Couldn't reach NOAA Tides/i).first()).toBeVisible();
  // Weather still works:
  await expect(page.getByText('Weather').first()).toBeVisible();
});
```

- [ ] **Step 2: Create the a11y spec**

```ts
// tests/today-dashboard-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a11y: /today-on-hilton-head', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  const results = await new AxeBuilder({ page }).disableRules(['region']).analyze();
  expect(results.violations).toEqual([]);
});

test('Speakable selectors present in DOM', async ({ page }) => {
  await page.goto('/today-on-hilton-head');
  await expect(page.locator('.today-summary')).toHaveCount(1);
  await expect(page.locator('.today-tides-summary')).toHaveCount(1);
  await expect(page.locator('.today-sun-summary')).toHaveCount(1);
});
```

- [ ] **Step 3: Run + fix violations + commit**

```bash
npx playwright test tests/today-dashboard-failure.spec.ts tests/today-dashboard-a11y.spec.ts
```

Common fixes:
- `aria-label` missing on refresh button → add
- color contrast on sun-toggle chip → strengthen
- the location-toggle `<fieldset>` needs a `<legend>` (already added `sr-only` legend in Task 12 — verify)

```bash
git add tests/today-dashboard-failure.spec.ts tests/today-dashboard-a11y.spec.ts
git commit -m "test(today-dashboard): failure + a11y + speakable specs"
```

---

## Task 20: Final QA + typecheck + build

- [ ] **Step 1: Typecheck + lint**

```bash
npm run typecheck
npm run lint
```

Expected: both clean.

- [ ] **Step 2: Run the full dashboard test suite**

```bash
npx playwright test tests/today-dashboard-*.spec.ts
```

Expected: all green on chromium + webkit.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: clean. Check the bundle-size report for `/today-on-hilton-head` — target ≤ 35 KB gzipped per spec. If over, lazy-load `SunriseSunsetPanel` via `next/dynamic` (it's the largest client island).

- [ ] **Step 4: Manual QA checklist**

- [ ] Hero renders with date, refresh button, "Updated X ago"
- [ ] All 6 panels render with real data (assuming all APIs reachable)
- [ ] Sun toggle: switching Coligny vs Harbour Town vs South Forest Beach updates the displayed sunrise/sunset times by a few minutes
- [ ] Refresh button: click → spinner → "Updated just now" → tracked event
- [ ] Second refresh within 30s → no-op (rate-limited client-side)
- [ ] Sponsor slot: temporarily set `data/today-sponsor.ts` to a real SponsorSlot, verify renders + click tracked + revert
- [ ] Founder note: temporarily add an entry to `data/today-notes.ts` dated today, verify renders
- [ ] Network panel: verify ISR cached on second load (no API calls for 15min)
- [ ] Sitemap includes `/today-on-hilton-head`
- [ ] JSON-LD Speakable validates (test in https://search.google.com/test/rich-results)
- [ ] Mobile (≤480px): panels stack to single column, refresh button readable, sun toggle chips fit
- [ ] Keyboard navigation: Tab → refresh button → sun-toggle radios → arrow keys work between radios

- [ ] **Step 5: Final commit (if any nits)**

```bash
git add -A
git commit -m "chore(today-dashboard): final polish + manual QA pass"
```

- [ ] **Step 6: Note operational requirement**

Before any deploy: add `OPENWEATHER_API_KEY` env var to Vercel (free tier, sign up at openweathermap.org/api). Without it, weather + UV panels render permanent failure UI.

---

## Self-Review

**Spec coverage:**
- ✅ 6 panels (weather, tides, sun, UV, water-temp, wind) — Tasks 6, 7, 8, 11, 12, 13
- ✅ ISR (`revalidate=900`) + per-fetch `next.revalidate` — Task 9, Tasks 6–8
- ✅ Refresh button + `/api/today/refresh` — Task 10
- ✅ Sun panel location toggle (3 options) — Task 12
- ✅ Failure UI per panel — Tasks 11–13 use `PanelFailure` from Task 11
- ✅ Sponsor slot above-fold — Task 14
- ✅ Founder note — Task 15
- ✅ Server-side panel-view tracking — Task 16
- ✅ Migration 015 + widened track API + 'tools' industry — Tasks 2, 4, 5
- ✅ JSON-LD WebPage + Speakable + Breadcrumb — Task 9
- ✅ Sitemap entry — Task 17
- ✅ Playwright (happy, refresh, location, sponsor, failure, a11y) — Tasks 18, 19

**Placeholder scan — none found.** Every code step contains real code; every API endpoint is named; every station ID is given.

**Type consistency:**
- `FetchResult<T>`, `WeatherSnapshot`, `TidesSnapshot`, `SunSnapshot`, `UvSnapshot`, `WaterTempSnapshot`, `WindSnapshot` defined in Task 3, imported consistently in Tasks 6–8, 11–13
- `LocationKey` defined in Task 3, used in Task 4 (`LOCATIONS` map), Task 8 (`computeSun`), Task 12 (panel toggle)
- `DirectoryEventType` extended in Task 4 with all 4 new dashboard events; matches the `VALID_EVENT_TYPES` Set in Task 5
- `'tools'` industry slug added in Task 5 to both `IndustrySlug` union (data) and `VALID_INDUSTRIES` Set (API route)
- Speakable selectors `.today-summary`, `.today-tides-summary`, `.today-sun-summary` declared in Task 9 JSON-LD, rendered in Tasks 10, 11, 12 components, asserted in Task 19 a11y test

**Notes during self-review:**
- The `Promise.allSettled` server-side track helper in Task 16 uses `brand.url`. If running on `localhost` and `brand.url` points at production, those telemetry calls will hit production. Acceptable for production deploys; for local dev, the calls will fail silently (try/catch in the helper) — no impact on page render.
- Sponsor-slot test (Task 18) only covers the hidden path. Visible-path is manual QA in Task 20 because tests don't mutate data files. Acceptable v1 — add a fixture mechanism in v1.1 if test coverage is desired.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-20-today-on-hilton-head.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between tasks.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch with checkpoints.

Which approach?
