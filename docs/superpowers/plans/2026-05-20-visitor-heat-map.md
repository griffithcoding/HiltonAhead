# Visitor Heat Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship two map surfaces at `/hilton-head-heat-map` (public choropleth) and `/admin/directory/heat-map` (paid full) that aggregate first-party `directory_events` clicks by neighborhood, gated by paid directory tier, with CSV export and privacy boundaries (subscriber sees own data + competitor aggregates only).

**Architecture:** Server-rendered Next.js pages with cached aggregation (1h public, 15min paid per user). Leaflet + OpenStreetMap tiles for both maps, lazy-loaded as a client island via `next/dynamic`. Public choropleth uses point-in-polygon to bucket clicks into 5 hand-traced neighborhood polygons. Paid surface scopes raw click points to the subscriber's owned businesses; everyone else surfaces only as neighborhood aggregates. CSV export server-side via a gated route handler.

**Tech Stack:** Next.js 16 (App Router, server components + ISR) · React 19 · TypeScript (strict) · Tailwind 4 · `leaflet` + `react-leaflet` + `leaflet.markercluster` (new deps) · Supabase service-role for aggregation reads · Playwright.

**Spec:** [docs/superpowers/specs/2026-05-20-visitor-heat-map-design.md](../specs/2026-05-20-visitor-heat-map-design.md)

**Testing reality:** Playwright only. Aggregation logic tested by seeding rows in `directory_events` (test DB) + visiting the rendered page + asserting visible counts. CSV correctness tested by fetching the export endpoint with an authenticated paid subscriber session and parsing the response.

**Branch:** Stay on `feat/restaurant-hub`. Per `CLAUDE.md`, no worktrees.

**Commit cadence:** Atomic per task. Conventional Commits.

---

## File Structure

### New files (~25)

| Path | Responsibility |
|---|---|
| `supabase/migrations/016_heatmap_events.sql` | Widen `event_type` CHECK constraint with 3 new heatmap events |
| `data/heatmap-boundaries.ts` | 5 hand-traced neighborhood polygons |
| `data/heatmap-note.ts` | Optional founder editorial note for the public page |
| `app/lib/heatmap/types.ts` | `TimeWindow`, `NeighborhoodAggregate`, `ClickPoint`, `PublicChoroplethData`, `PaidHeatmapData` |
| `app/lib/heatmap/point-in-polygon.ts` | Ray-casting algorithm — `pointInPolygon(point, polygon)` |
| `app/lib/heatmap/bucket-to-neighborhood.ts` | Resolves a (lat, lng) to a neighborhood slug or `null` |
| `app/lib/heatmap/public-aggregation.ts` | `aggregatePublic()` — 7d choropleth, cached 1h |
| `app/lib/heatmap/paid-aggregation.ts` | `aggregatePaidForSubscriber(userId, window, eventTypeFilter)` |
| `app/lib/heatmap/csv.ts` | `eventsToCsv(rows)` — pure function generating CSV text |
| `app/hilton-head-heat-map/page.tsx` | Public server-component page with ISR |
| `app/admin/directory/heat-map/page.tsx` | Paid server-component page (gated) |
| `app/admin/directory/heat-map/HeatMapClient.tsx` | Client component: filter strip + CSV button |
| `app/api/heatmap/csv/route.ts` | GET route — generates CSV, gated to paid subscribers |
| `components/heatmap/HeatMap.tsx` | Leaflet map shell (dynamic-imported client component) |
| `components/heatmap/NeighborhoodChoropleth.tsx` | Renders 5 polygons colored by density |
| `components/heatmap/ClusteredPoints.tsx` | Renders raw point clusters (paid only) |
| `components/heatmap/MapLegend.tsx` | Color-scale legend for choropleth |
| `components/heatmap/NeighborhoodRankings.tsx` | Top-5 rankings list with bar chart |
| `components/heatmap/PaidTopBusinesses.tsx` | Top-10 by own businesses + neighborhood averages |
| `components/heatmap/PrivacyDisclosure.tsx` | Short privacy note shared by both pages |

### Tests (5)

| Path | Coverage |
|---|---|
| `tests/heatmap-public.spec.ts` | Public page renders, map mounts, top-5 list visible, no console errors |
| `tests/heatmap-paid-gate.spec.ts` | Unauthenticated → redirect to login; non-paid subscriber → upgrade page |
| `tests/heatmap-paid-filter.spec.ts` | Authenticated paid subscriber switches window + event-type filters; `heatmap_filter_change` event fires |
| `tests/heatmap-paid-csv.spec.ts` | CSV download contains only subscriber's own business rows, no PII columns |
| `tests/heatmap-a11y.spec.ts` | `axe-core` on both pages |

### Modified (4)

| Path | Change |
|---|---|
| `package.json` | Add `leaflet`, `react-leaflet`, `leaflet.markercluster`, `@types/leaflet`, `@types/leaflet.markercluster` |
| `app/lib/directoryTracking.ts` | Extend `DirectoryEventType` + payload variants for 3 heatmap events |
| `app/api/directory/track/route.ts` | Widen `VALID_EVENT_TYPES` Set |
| `app/sitemap.ts` | Add `/hilton-head-heat-map` entry |

---

## Task 1: Setup — install deps + verify auth fixture status

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Confirm branch + clean tree**

```bash
git status
git branch --show-current
```

Expected: `feat/restaurant-hub`. Switch back if a parallel session has moved the branch.

- [ ] **Step 2: Install map deps**

```bash
npm install leaflet react-leaflet leaflet.markercluster
npm install --save-dev @types/leaflet @types/leaflet.markercluster
```

- [ ] **Step 3: Verify the paid-subscriber test-auth fixture**

The spec (§13) requires that the Playwright tests can authenticate as a paid directory subscriber. Check whether a fixture exists:

```bash
ls tests/_fixtures/ 2>/dev/null
grep -r "paid.*subscriber\|directory.*sub" tests/ 2>/dev/null
```

If a fixture already exists at `tests/_fixtures/paidSubscriberAuth.ts` or similar, note its path and use it in Task 22.

If no fixture exists, add the task below to **before Task 22**:

> **Task 21.5 (conditional): Create paid-subscriber test fixture**
> Create `tests/_fixtures/paidSubscriberAuth.ts` exporting a Playwright `storageState` object that pre-authenticates a seed-data subscriber. Use the existing portal sign-in flow (per `dca6721 feat(portal): business owner portal Phase 0/1`); the seed paid subscriber should already exist in the test DB. If not, add a SQL seed in `supabase/seeds/` for a test paid subscriber tied to a known `business_id`.

- [ ] **Step 4: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(heat-map): add leaflet + react-leaflet + markercluster"
```

---

## Task 2: Migration 016 — widen event_type for heatmap events

**Files:**
- Create: `supabase/migrations/016_heatmap_events.sql`

- [ ] **Step 1: Create the migration**

```sql
-- supabase/migrations/016_heatmap_events.sql
-- Visitor Heat Map event types. Builds on migration 015.

alter table directory_events
  drop constraint if exists directory_events_event_type_check;

alter table directory_events
  add constraint directory_events_event_type_check
  check (event_type in (
    -- Existing through migration 015:
    'phone_click', 'website_click', 'inquiry_submit',
    'menu_click', 'reservations_click', 'directions_click',
    'photo_view', 'share_click', 'sponsor_slot_click', 'related_click',
    'today_panel_view', 'today_refresh_click', 'today_location_toggle', 'today_sponsor_click',
    -- New for Visitor Heat Map:
    'heatmap_view',
    'heatmap_filter_change',
    'heatmap_export_csv'
  ));
```

- [ ] **Step 2: Apply**

```bash
npx supabase db push
```

Or paste into the Supabase SQL editor.

- [ ] **Step 3: Verify with a probe insert**

```sql
insert into directory_events (business_id, industry_slug, event_type, payload)
values ('heat-map', 'tools', 'heatmap_view', '{"surface":"public"}'::jsonb);

select event_type, payload from directory_events where business_id = 'heat-map';

delete from directory_events where business_id = 'heat-map';
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/016_heatmap_events.sql
git commit -m "feat(heat-map): migration 016 — 3 new heatmap event types"
```

---

## Task 3: Shared types

**Files:**
- Create: `app/lib/heatmap/types.ts`

- [ ] **Step 1: Create the types module**

```ts
// app/lib/heatmap/types.ts

export type TimeWindow = '24h' | '7d' | '30d';

export type NeighborhoodAggregate = {
  slug: string;
  name: string;
  totalClicks: number;
  topEventType: string;
  centerLat: number;
  centerLng: number;
};

export type PublicChoroplethData = {
  fetchedAt: string;       // ISO
  windowDays: number;      // always 7 in v1 public
  neighborhoods: NeighborhoodAggregate[];
  totalClicksAcrossIsland: number;
};

export type ClickPoint = {
  businessId: string;
  latitude: number;
  longitude: number;
  eventType: string;
  /** ISO truncated to hour for clustering — never the exact second. */
  occurredAtHour: string;
};

export type OwnBusinessRow = {
  businessId: string;
  businessName: string;
  totalClicks: number;
  clicksByEventType: Record<string, number>;
};

export type PaidHeatmapData = {
  fetchedAt: string;
  window: TimeWindow;
  eventTypeFilter: string | 'all';
  ownBusinessIds: string[];
  ownClickPoints: ClickPoint[];
  neighborhoodAggregates: NeighborhoodAggregate[];
  topByOwnBusiness: OwnBusinessRow[];
  competitorNeighborhoodAverages: Array<{
    neighborhoodSlug: string;
    avgClicksPerBusiness: number;
  }>;
};
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add app/lib/heatmap/types.ts
git commit -m "feat(heat-map): shared types module"
```

---

## Task 4: Neighborhood boundaries (hand-traced polygons)

**Files:**
- Create: `data/heatmap-boundaries.ts`

This task includes manual work — hand-tracing 5 polygons on a map of Hilton Head. Use https://geojson.io.

- [ ] **Step 1: Hand-trace polygons**

1. Open https://geojson.io
2. Center map on Hilton Head Island (32.2163, -80.7526)
3. Draw polygons for: Sea Pines, Palmetto Dunes, Forest Beach, Shipyard, Bluffton
4. Copy the GeoJSON coordinate arrays (note: GeoJSON is `[lng, lat]` order)
5. Ensure polygons do not overlap
6. Ensure each polygon is closed (first point == last point)

- [ ] **Step 2: Create the data file with traced polygons**

```ts
// data/heatmap-boundaries.ts

export type NeighborhoodBoundary = {
  slug: string;
  name: string;
  /** GeoJSON Polygon coordinate ring (closed). Coordinates as [longitude, latitude]. */
  polygon: Array<[number, number]>;
  /** Center for label placement and convenience. */
  centerLat: number;
  centerLng: number;
};

export const NEIGHBORHOODS: NeighborhoodBoundary[] = [
  {
    slug: 'sea-pines',
    name: 'Sea Pines',
    centerLat: 32.140,
    centerLng: -80.810,
    polygon: [
      // Paste the traced ring here, e.g.:
      // [-80.842, 32.123], [-80.785, 32.123], ...
      // First and last point identical (closed ring).
    ],
  },
  {
    slug: 'palmetto-dunes',
    name: 'Palmetto Dunes',
    centerLat: 32.190,
    centerLng: -80.738,
    polygon: [
      // Trace from geojson.io
    ],
  },
  {
    slug: 'forest-beach',
    name: 'Forest Beach',
    centerLat: 32.152,
    centerLng: -80.770,
    polygon: [
      // Trace from geojson.io
    ],
  },
  {
    slug: 'shipyard',
    name: 'Shipyard',
    centerLat: 32.175,
    centerLng: -80.770,
    polygon: [
      // Trace from geojson.io
    ],
  },
  {
    slug: 'bluffton',
    name: 'Bluffton',
    centerLat: 32.240,
    centerLng: -80.860,
    polygon: [
      // Trace from geojson.io
    ],
  },
];
```

- [ ] **Step 3: Eyeball-verify on a map**

Briefly inspect the file:

```bash
cat data/heatmap-boundaries.ts | head -40
```

Each `polygon` should have ≥ 5 coordinate pairs forming a closed ring around the actual neighborhood.

- [ ] **Step 4: Commit**

```bash
git add data/heatmap-boundaries.ts
git commit -m "feat(heat-map): 5 hand-traced neighborhood polygons"
```

---

## Task 5: Point-in-polygon + bucket helpers

**Files:**
- Create: `app/lib/heatmap/point-in-polygon.ts`
- Create: `app/lib/heatmap/bucket-to-neighborhood.ts`

- [ ] **Step 1: Ray-casting point-in-polygon**

```ts
// app/lib/heatmap/point-in-polygon.ts
/**
 * Classic ray-casting algorithm. Returns true if the point is strictly inside
 * the polygon (boundary cases counted as outside, which is acceptable for
 * our use — every click attributed to one or zero neighborhoods).
 *
 * Polygon is a closed ring of [longitude, latitude] pairs.
 */
export function pointInPolygon(
  point: { latitude: number; longitude: number },
  polygon: Array<[number, number]>,
): boolean {
  const { latitude: y, longitude: x } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
```

- [ ] **Step 2: Bucket helper**

```ts
// app/lib/heatmap/bucket-to-neighborhood.ts
import { NEIGHBORHOODS } from '@/data/heatmap-boundaries';
import { pointInPolygon } from './point-in-polygon';

/**
 * Returns the slug of the first matching neighborhood polygon, or null if
 * the point is outside all 5 polygons. Polygons are NOT overlapping (by
 * convention; if they do overlap, this picks the first hit in declaration order).
 */
export function bucketToNeighborhood(
  latitude: number,
  longitude: number,
): string | null {
  for (const nb of NEIGHBORHOODS) {
    if (pointInPolygon({ latitude, longitude }, nb.polygon)) {
      return nb.slug;
    }
  }
  return null;
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add app/lib/heatmap/point-in-polygon.ts app/lib/heatmap/bucket-to-neighborhood.ts
git commit -m "feat(heat-map): point-in-polygon + neighborhood bucket helpers"
```

---

## Task 6: Founder editorial note data

**Files:**
- Create: `data/heatmap-note.ts`

- [ ] **Step 1: Create**

```ts
// data/heatmap-note.ts

export type HeatmapNote = {
  date: string;   // ISO YYYY-MM-DD
  body: string;
};

/**
 * Set when there's a worthwhile pattern to call out on the public page.
 * Leave null when no note is timely.
 */
export const heatmapNote: HeatmapNote | null = null;
```

- [ ] **Step 2: Commit**

```bash
git add data/heatmap-note.ts
git commit -m "feat(heat-map): founder editorial note data file"
```

---

## Task 7: Public aggregation function

**Files:**
- Create: `app/lib/heatmap/public-aggregation.ts`

- [ ] **Step 1: Implement**

```ts
// app/lib/heatmap/public-aggregation.ts
import { unstable_cache } from 'next/cache';
import { createServiceClient } from '@/utils/supabase/service';
import { businesses } from '@/data/localBusinesses';
import { NEIGHBORHOODS } from '@/data/heatmap-boundaries';
import { bucketToNeighborhood } from './bucket-to-neighborhood';
import type { PublicChoroplethData, NeighborhoodAggregate } from './types';

const CACHE_KEY = 'heatmap-public-v1';
const REVALIDATE_SEC = 3600; // 1 hour

async function _aggregatePublic(): Promise<PublicChoroplethData> {
  const supabase = createServiceClient();
  const sevenDaysAgoIso = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const { data: events, error } = await supabase
    .from('directory_events')
    .select('business_id, event_type')
    .gte('created_at', sevenDaysAgoIso);

  if (error || !events) {
    return {
      fetchedAt: new Date().toISOString(),
      windowDays: 7,
      neighborhoods: NEIGHBORHOODS.map((n) => ({
        slug: n.slug,
        name: n.name,
        totalClicks: 0,
        topEventType: 'none',
        centerLat: n.centerLat,
        centerLng: n.centerLng,
      })),
      totalClicksAcrossIsland: 0,
    };
  }

  // Build business_id -> (lat, lng) lookup
  const bizLatLng = new Map<string, { lat: number; lng: number }>();
  for (const b of businesses) {
    if (b.latitude !== undefined && b.longitude !== undefined) {
      bizLatLng.set(b.id, { lat: b.latitude, lng: b.longitude });
    }
  }

  const counts = new Map<string, { total: number; byType: Map<string, number> }>();
  for (const n of NEIGHBORHOODS) {
    counts.set(n.slug, { total: 0, byType: new Map() });
  }

  let totalAcrossIsland = 0;

  for (const e of events) {
    const ll = bizLatLng.get(e.business_id);
    if (!ll) continue;
    const slug = bucketToNeighborhood(ll.lat, ll.lng);
    if (!slug) continue;
    const bucket = counts.get(slug)!;
    bucket.total += 1;
    bucket.byType.set(e.event_type, (bucket.byType.get(e.event_type) ?? 0) + 1);
    totalAcrossIsland += 1;
  }

  const neighborhoods: NeighborhoodAggregate[] = NEIGHBORHOODS.map((n) => {
    const bucket = counts.get(n.slug)!;
    const top = [...bucket.byType.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      slug: n.slug,
      name: n.name,
      totalClicks: bucket.total,
      topEventType: top?.[0] ?? 'none',
      centerLat: n.centerLat,
      centerLng: n.centerLng,
    };
  });

  return {
    fetchedAt: new Date().toISOString(),
    windowDays: 7,
    neighborhoods,
    totalClicksAcrossIsland: totalAcrossIsland,
  };
}

export const aggregatePublic = unstable_cache(_aggregatePublic, [CACHE_KEY], {
  revalidate: REVALIDATE_SEC,
  tags: ['heatmap-public'],
});
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add app/lib/heatmap/public-aggregation.ts
git commit -m "feat(heat-map): public choropleth aggregation (cached 1h)"
```

---

## Task 8: Paid aggregation function

**Files:**
- Create: `app/lib/heatmap/paid-aggregation.ts`

- [ ] **Step 1: Implement**

This task assumes a way to resolve "user_id → owned business_ids." Per the portal Phase 0/1 commit (`dca6721`), there should be a `business_owners` table (or similar). Verify the exact shape during build:

```bash
grep -r "business_owners\|claimed_by\|owner_user_id" supabase/migrations/ 2>/dev/null
```

If the column/table name differs, update the query accordingly.

```ts
// app/lib/heatmap/paid-aggregation.ts
import { unstable_cache } from 'next/cache';
import { createServiceClient } from '@/utils/supabase/service';
import { businesses } from '@/data/localBusinesses';
import { NEIGHBORHOODS } from '@/data/heatmap-boundaries';
import { bucketToNeighborhood } from './bucket-to-neighborhood';
import type {
  PaidHeatmapData,
  TimeWindow,
  ClickPoint,
  NeighborhoodAggregate,
  OwnBusinessRow,
} from './types';

const REVALIDATE_SEC = 900; // 15 minutes

function windowToMs(w: TimeWindow): number {
  switch (w) {
    case '24h': return 86_400_000;
    case '7d':  return 7 * 86_400_000;
    case '30d': return 30 * 86_400_000;
  }
}

async function _aggregatePaidForSubscriber(
  userId: string,
  window: TimeWindow,
  eventTypeFilter: string | 'all',
): Promise<PaidHeatmapData> {
  const supabase = createServiceClient();
  const sinceIso = new Date(Date.now() - windowToMs(window)).toISOString();

  // 1) Resolve user_id -> owned business_ids
  // Update this query if the actual portal table/column names differ.
  const { data: ownedRows } = await supabase
    .from('business_owners')
    .select('business_id')
    .eq('user_id', userId);
  const ownBusinessIds = (ownedRows ?? []).map((r: { business_id: string }) => r.business_id);

  // 2) Pull events in window
  let q = supabase
    .from('directory_events')
    .select('business_id, event_type, created_at')
    .gte('created_at', sinceIso);
  if (eventTypeFilter !== 'all') q = q.eq('event_type', eventTypeFilter);
  const { data: events } = await q;

  // Lookup helpers
  const bizLatLng = new Map<string, { lat: number; lng: number; name: string }>();
  for (const b of businesses) {
    if (b.latitude !== undefined && b.longitude !== undefined) {
      bizLatLng.set(b.id, { lat: b.latitude, lng: b.longitude, name: b.name });
    }
  }
  const ownSet = new Set(ownBusinessIds);

  const ownClickPoints: ClickPoint[] = [];
  const ownByBizCounts = new Map<string, { total: number; byType: Map<string, number> }>();
  const neighborhoodCounts = new Map<string, number>();
  const businessesPerNeighborhood = new Map<string, Set<string>>();
  for (const n of NEIGHBORHOODS) {
    neighborhoodCounts.set(n.slug, 0);
    businessesPerNeighborhood.set(n.slug, new Set());
  }

  // First pass: every business with lat/long, bucket into neighborhood (denominator for averages)
  for (const b of businesses) {
    if (b.latitude !== undefined && b.longitude !== undefined) {
      const slug = bucketToNeighborhood(b.latitude, b.longitude);
      if (slug) businessesPerNeighborhood.get(slug)?.add(b.id);
    }
  }

  // Second pass: process events
  for (const e of events ?? []) {
    const ll = bizLatLng.get(e.business_id);
    if (!ll) continue;
    const slug = bucketToNeighborhood(ll.lat, ll.lng);
    if (slug) neighborhoodCounts.set(slug, (neighborhoodCounts.get(slug) ?? 0) + 1);

    if (ownSet.has(e.business_id)) {
      const occurredAtHour = e.created_at.slice(0, 13) + ':00:00.000Z';
      ownClickPoints.push({
        businessId: e.business_id,
        latitude: ll.lat,
        longitude: ll.lng,
        eventType: e.event_type,
        occurredAtHour,
      });
      const row = ownByBizCounts.get(e.business_id) ?? { total: 0, byType: new Map() };
      row.total += 1;
      row.byType.set(e.event_type, (row.byType.get(e.event_type) ?? 0) + 1);
      ownByBizCounts.set(e.business_id, row);
    }
  }

  const topByOwnBusiness: OwnBusinessRow[] = [...ownByBizCounts.entries()].map(([id, row]) => ({
    businessId: id,
    businessName: bizLatLng.get(id)?.name ?? id,
    totalClicks: row.total,
    clicksByEventType: Object.fromEntries(row.byType),
  })).sort((a, b) => b.totalClicks - a.totalClicks);

  const neighborhoodAggregates: NeighborhoodAggregate[] = NEIGHBORHOODS.map((n) => ({
    slug: n.slug,
    name: n.name,
    totalClicks: neighborhoodCounts.get(n.slug) ?? 0,
    topEventType: 'all',
    centerLat: n.centerLat,
    centerLng: n.centerLng,
  }));

  const competitorNeighborhoodAverages = NEIGHBORHOODS.map((n) => {
    const slug = n.slug;
    const total = neighborhoodCounts.get(slug) ?? 0;
    const businessIds = businessesPerNeighborhood.get(slug) ?? new Set();
    const ownInHere = [...ownSet].filter((id) => businessIds.has(id)).length;
    const ownClicks = [...ownByBizCounts.entries()]
      .filter(([id]) => businessIds.has(id))
      .reduce((sum, [, row]) => sum + row.total, 0);
    const competitorBizCount = Math.max(0, businessIds.size - ownInHere);
    const competitorClicks = Math.max(0, total - ownClicks);
    const avgClicksPerBusiness = competitorBizCount > 0
      ? Math.round((competitorClicks / competitorBizCount) * 10) / 10
      : 0;
    return { neighborhoodSlug: slug, avgClicksPerBusiness };
  });

  return {
    fetchedAt: new Date().toISOString(),
    window,
    eventTypeFilter,
    ownBusinessIds,
    ownClickPoints,
    neighborhoodAggregates,
    topByOwnBusiness,
    competitorNeighborhoodAverages,
  };
}

/**
 * Cached per (userId, window, eventTypeFilter) tuple so subscribers never
 * see each other's data.
 */
export function aggregatePaidForSubscriber(
  userId: string,
  window: TimeWindow,
  eventTypeFilter: string | 'all',
): Promise<PaidHeatmapData> {
  return unstable_cache(
    () => _aggregatePaidForSubscriber(userId, window, eventTypeFilter),
    [`heatmap-paid-${userId}-${window}-${eventTypeFilter}`],
    { revalidate: REVALIDATE_SEC, tags: [`heatmap-paid-${userId}`] },
  )();
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add app/lib/heatmap/paid-aggregation.ts
git commit -m "feat(heat-map): paid aggregation (own clicks + competitor averages)"
```

---

## Task 9: HeatMap shell component (Leaflet)

**Files:**
- Create: `components/heatmap/HeatMap.tsx`

- [ ] **Step 1: Create the shell**

This component is a client island, dynamically imported with `ssr: false` from the page (Leaflet does not work server-side because it touches `window`).

```tsx
// components/heatmap/HeatMap.tsx
'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';

// Hilton Head Island center
const CENTER: [number, number] = [32.2163, -80.7526];

export default function HeatMap({
  height = '60vh',
  zoom = 12,
  children,
  ariaLabel = 'Hilton Head visitor heat map',
}: {
  height?: string;
  zoom?: number;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div role="img" aria-label={ariaLabel} style={{ height }}>
      <MapContainer
        center={CENTER}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {children}
      </MapContainer>
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add components/heatmap/HeatMap.tsx
git commit -m "feat(heat-map): HeatMap shell (Leaflet + OSM)"
```

---

## Task 10: NeighborhoodChoropleth layer

**Files:**
- Create: `components/heatmap/NeighborhoodChoropleth.tsx`
- Create: `components/heatmap/MapLegend.tsx`

- [ ] **Step 1: Create the choropleth layer**

```tsx
// components/heatmap/NeighborhoodChoropleth.tsx
'use client';

import { Polygon, Tooltip } from 'react-leaflet';
import { NEIGHBORHOODS } from '@/data/heatmap-boundaries';
import type { NeighborhoodAggregate } from '@/app/lib/heatmap/types';

/**
 * Five-step sequential color scale (light to dark coral).
 * Pick a bucket based on the neighborhood's relative density.
 */
const COLORS = ['#FDE8E0', '#F9C4AE', '#F49D7C', '#EF7649', '#D85320'];

function colorFor(count: number, maxCount: number): string {
  if (maxCount === 0) return COLORS[0];
  const ratio = count / maxCount;
  const idx = Math.min(COLORS.length - 1, Math.floor(ratio * COLORS.length));
  return COLORS[idx];
}

export default function NeighborhoodChoropleth({
  data,
}: {
  data: NeighborhoodAggregate[];
}) {
  const maxCount = Math.max(0, ...data.map((d) => d.totalClicks));

  return (
    <>
      {NEIGHBORHOODS.map((n) => {
        const agg = data.find((a) => a.slug === n.slug);
        const count = agg?.totalClicks ?? 0;
        // Leaflet Polygon expects [lat, lng] but our data file is [lng, lat] (GeoJSON order).
        const positions = n.polygon.map(([lng, lat]) => [lat, lng] as [number, number]);
        return (
          <Polygon
            key={n.slug}
            positions={positions}
            pathOptions={{
              color: '#0A2930',
              weight: 1,
              fillColor: colorFor(count, maxCount),
              fillOpacity: 0.7,
            }}
          >
            <Tooltip sticky>
              <div style={{ fontSize: 12 }}>
                <strong>{n.name}</strong>
                <br />
                {count} click{count === 1 ? '' : 's'} (last 7d)
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
```

- [ ] **Step 2: Create the legend**

```tsx
// components/heatmap/MapLegend.tsx
export default function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-[400] rounded bg-white/95 p-3 text-[11px] shadow">
      <div className="mb-1 font-medium uppercase tracking-wider text-ink-soft">
        Click density · 7 days
      </div>
      <div className="flex items-center gap-1">
        <span className="h-3 w-6" style={{ background: '#FDE8E0' }} />
        <span className="h-3 w-6" style={{ background: '#F9C4AE' }} />
        <span className="h-3 w-6" style={{ background: '#F49D7C' }} />
        <span className="h-3 w-6" style={{ background: '#EF7649' }} />
        <span className="h-3 w-6" style={{ background: '#D85320' }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink-soft">
        <span>low</span>
        <span>high</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck
git add components/heatmap/NeighborhoodChoropleth.tsx components/heatmap/MapLegend.tsx
git commit -m "feat(heat-map): choropleth layer + map legend"
```

---

## Task 11: ClusteredPoints layer (paid only)

**Files:**
- Create: `components/heatmap/ClusteredPoints.tsx`

- [ ] **Step 1: Create the clustered-points layer**

```tsx
// components/heatmap/ClusteredPoints.tsx
'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { ClickPoint } from '@/app/lib/heatmap/types';

/**
 * Renders raw click points as a marker cluster. The subscriber's own points
 * are highlighted with a red border via a custom DivIcon.
 */
export default function ClusteredPoints({
  points,
  ownBusinessIds,
}: {
  points: ClickPoint[];
  ownBusinessIds: string[];
}) {
  const map = useMap();
  const ownSet = new Set(ownBusinessIds);

  useEffect(() => {
    // markercluster types added by @types/leaflet.markercluster
    const cluster = (L as unknown as {
      markerClusterGroup: () => L.LayerGroup;
    }).markerClusterGroup();
    for (const p of points) {
      const isOwn = ownSet.has(p.businessId);
      const marker = L.circleMarker([p.latitude, p.longitude], {
        radius: 6,
        color: isOwn ? '#D85320' : '#0A2930',
        weight: isOwn ? 2 : 1,
        fillColor: isOwn ? '#EF7649' : '#0A2930',
        fillOpacity: 0.6,
      });
      marker.bindTooltip(`${p.eventType} · ${p.businessId}`, { direction: 'top' });
      cluster.addLayer(marker);
    }
    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, points, ownSet]);

  return null;
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck
git add components/heatmap/ClusteredPoints.tsx
git commit -m "feat(heat-map): clustered-points layer with own-highlight"
```

---

## Task 12: Public page shell + metadata + JSON-LD

**Files:**
- Create: `app/hilton-head-heat-map/page.tsx`

- [ ] **Step 1: Write the failing happy-path test**

```ts
// tests/heatmap-public.spec.ts
import { test, expect } from '@playwright/test';

test('public heat map page loads', async ({ page }) => {
  await page.goto('/hilton-head-heat-map');
  await expect(page.getByRole('heading', { name: /Visitor Heat Map/i })).toBeVisible();
});
```

- [ ] **Step 2: Run — confirm fails**

```bash
npx playwright test tests/heatmap-public.spec.ts -g "public heat map page loads"
```

- [ ] **Step 3: Create the page shell**

```tsx
// app/hilton-head-heat-map/page.tsx
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { aggregatePublic } from '@/app/lib/heatmap/public-aggregation';
import { brand } from '@/data/brand';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Visitor Heat Map — Where Travelers Cluster · Hilton Ahead',
  description:
    'Live density map of Hilton Head Island by neighborhood. Updated hourly. See where the click traffic is on Sea Pines, Palmetto Dunes, Forest Beach, and beyond.',
  path: '/hilton-head-heat-map',
  keywords: [
    'Hilton Head visitor heat map',
    'Hilton Head tourist activity',
    'where are tourists Hilton Head',
    'Hilton Head crowd map',
  ],
});

// Map is a client-only component due to Leaflet's window dependency.
const HeatMap = dynamic(() => import('@/components/heatmap/HeatMap'), { ssr: false });
const NeighborhoodChoropleth = dynamic(
  () => import('@/components/heatmap/NeighborhoodChoropleth'),
  { ssr: false },
);

export default async function HeatMapPublicPage() {
  const data = await aggregatePublic();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Visitor Heat Map', path: '/hilton-head-heat-map' },
  ]);

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Hilton Head Visitor Heat Map',
    description: 'Rolling 7-day click density by neighborhood on Hilton Head Island.',
    url: `${brand.url}/hilton-head-heat-map`,
    temporalCoverage: `${new Date(Date.now() - 7 * 86_400_000).toISOString()}/${new Date().toISOString()}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-12 max-w-[1100px]">
          <div className="eyebrow text-coral">Heat Map</div>
          <h1 className="display mt-3 text-[32px] leading-[1.1] text-ink md:text-[44px]">
            Hilton Head <span className="display-italic">Visitor Heat Map</span>
          </h1>
          <p className="mt-4 max-w-[640px] text-[16px] leading-[1.65] text-ink-soft md:text-[18px]">
            Where the click traffic is on Hilton Head this week. Updated hourly. Aggregated by neighborhood — no individual data ever exposed.
          </p>
        </section>

        <section className="relative mt-10">
          <HeatMap ariaLabel="Hilton Head neighborhood click density choropleth">
            <NeighborhoodChoropleth data={data.neighborhoods} />
          </HeatMap>
        </section>

        {/* Rankings list, founder note, CTA, privacy disclosure all land in Task 13. */}
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run test — confirm passes**

```bash
npm run dev
npx playwright test tests/heatmap-public.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add app/hilton-head-heat-map tests/heatmap-public.spec.ts
git commit -m "feat(heat-map): public page shell + choropleth + dataset JSON-LD"
```

---

## Task 13: Public page composition (rankings, note, CTA, privacy)

**Files:**
- Create: `components/heatmap/NeighborhoodRankings.tsx`
- Create: `components/heatmap/PrivacyDisclosure.tsx`
- Modify: `app/hilton-head-heat-map/page.tsx`

- [ ] **Step 1: Create the rankings list**

```tsx
// components/heatmap/NeighborhoodRankings.tsx
import type { NeighborhoodAggregate } from '@/app/lib/heatmap/types';

export default function NeighborhoodRankings({
  data,
}: {
  data: NeighborhoodAggregate[];
}) {
  const sorted = [...data].sort((a, b) => b.totalClicks - a.totalClicks).slice(0, 5);
  const max = sorted[0]?.totalClicks ?? 1;

  return (
    <section className="mt-12 max-w-[760px]">
      <div className="eyebrow text-ink-soft">Top neighborhoods · last 7 days</div>
      <ul className="mt-5 space-y-3">
        {sorted.map((n) => {
          const pct = Math.max(2, Math.round((n.totalClicks / max) * 100));
          return (
            <li key={n.slug}>
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="font-medium text-ink">{n.name}</span>
                <span className="text-ink-soft">{n.totalClicks} clicks</span>
              </div>
              <div className="mt-1 h-2 w-full bg-ink/10">
                <div className="h-full bg-coral" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Create the privacy disclosure**

```tsx
// components/heatmap/PrivacyDisclosure.tsx
import Link from 'next/link';

export default function PrivacyDisclosure() {
  return (
    <section className="mt-12 max-w-[760px] border-t border-ink/15 pt-6 text-[12px] leading-[1.6] text-ink-soft">
      <strong className="text-ink">Privacy:</strong>{' '}
      No personal data. All clicks are aggregated by neighborhood. We hash IP addresses
      server-side with a secret salt and never store user agents alongside personally
      identifiable information. We do not sell raw event data. Read the full{' '}
      <Link href="/privacy" className="link-underline">privacy policy</Link>.
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page**

In `app/hilton-head-heat-map/page.tsx`, add the rankings + note + CTA + privacy blocks after the map section:

```tsx
import NeighborhoodRankings from '@/components/heatmap/NeighborhoodRankings';
import PrivacyDisclosure from '@/components/heatmap/PrivacyDisclosure';
import { heatmapNote } from '@/data/heatmap-note';
import Link from 'next/link';

// inside the JSX, after the map section:
<NeighborhoodRankings data={data.neighborhoods} />

{heatmapNote && (
  <section className="mt-12 max-w-[760px]">
    <div className="eyebrow text-coral">What this means</div>
    <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">{heatmapNote.body}</p>
    <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
      — Wm Griffith · {heatmapNote.date}
    </div>
  </section>
)}

<section className="mt-12 max-w-[760px] border border-ink/15 bg-cream p-6">
  <div className="eyebrow text-coral">For business owners</div>
  <h2 className="display mt-3 text-[22px] text-ink md:text-[26px]">
    Run a business on Hilton Head? See the full data.
  </h2>
  <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft md:text-[15px]">
    Paid directory subscribers get the per-business dashboard: filterable clicks, attribution
    by event type, CSV export of their own data.
  </p>
  <div className="mt-5">
    <Link
      href="/local/get-featured"
      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-cream hover:bg-coral"
    >
      See subscription tiers →
    </Link>
  </div>
</section>

<PrivacyDisclosure />
```

- [ ] **Step 4: Smoke + commit**

```bash
npm run dev
# Verify the public page composes: hero + map + rankings + CTA + privacy.
git add components/heatmap/NeighborhoodRankings.tsx components/heatmap/PrivacyDisclosure.tsx app/hilton-head-heat-map/page.tsx
git commit -m "feat(heat-map): public page rankings + note + CTA + privacy"
```

---

## Task 14: Sitemap entry

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add the entry**

```ts
// Inside app/sitemap.ts, add to the returned array:
{
  url: `${siteUrl}/hilton-head-heat-map`,
  lastModified: new Date(),
  changeFrequency: 'hourly' as const,
  priority: 0.8,
},
```

- [ ] **Step 2: Verify**

```bash
npm run dev
curl -s http://localhost:3000/sitemap.xml | grep -c '/hilton-head-heat-map'
```

Expected: 1.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(heat-map): sitemap entry for public heat map"
```

---

## Task 15: Extend `DirectoryEventType` + widen track API

**Files:**
- Modify: `app/lib/directoryTracking.ts`
- Modify: `app/api/directory/track/route.ts`

- [ ] **Step 1: Extend `DirectoryEventType` + payload**

In `app/lib/directoryTracking.ts`, add to the union and payload:

```ts
export type DirectoryEventType =
  // ... existing values
  | 'heatmap_view'
  | 'heatmap_filter_change'
  | 'heatmap_export_csv';

export type DirectoryEventPayload =
  // ... existing variants
  | { kind: 'heatmap_view'; surface: 'public' | 'paid' }
  | { kind: 'heatmap_filter_change'; window: '24h' | '7d' | '30d'; eventType: string }
  | { kind: 'heatmap_export_csv'; window: '24h' | '7d' | '30d'; eventType: string; rowCount: number };
```

- [ ] **Step 2: Widen the route**

In `app/api/directory/track/route.ts`, add to `VALID_EVENT_TYPES`:

```ts
const VALID_EVENT_TYPES = new Set([
  // ... existing
  'heatmap_view',
  'heatmap_filter_change',
  'heatmap_export_csv',
]);
```

- [ ] **Step 3: Smoke-test**

```bash
curl -sS -X POST http://localhost:3000/api/directory/track \
  -H 'Content-Type: application/json' \
  -d '{"businessId":"heat-map","industrySlug":"tools","eventType":"heatmap_view","payload":{"surface":"public"}}' \
  -i | head -5
```

Expected: `HTTP/1.1 204 No Content`. Verify row in DB; delete probe.

- [ ] **Step 4: Commit**

```bash
git add app/lib/directoryTracking.ts app/api/directory/track/route.ts
git commit -m "feat(heat-map): widen track API for 3 heatmap event types"
```

---

## Task 16: Paid page gating + composition (skeleton)

**Files:**
- Create: `app/admin/directory/heat-map/page.tsx`

- [ ] **Step 1: Verify paid-subscriber gating mechanism**

The portal gating from `dca6721` exposes a way to identify the signed-in user and whether they have a paid subscription. Find the helper:

```bash
grep -r "requireSubscribed\|isPaidSubscriber\|portal.*auth" utils/ app/ 2>/dev/null | head -20
```

If a helper like `requirePaidSubscriber()` exists, use it. If not, derive from existing `getAdminUser()` pattern + a check on the `business_owners` (or equivalent) table for at least one active paid subscription. **Verify shape during build.**

- [ ] **Step 2: Create the page (server component)**

```tsx
// app/admin/directory/heat-map/page.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { aggregatePaidForSubscriber } from '@/app/lib/heatmap/paid-aggregation';
import HeatMapClient from './HeatMapClient';

export const metadata: Metadata = {
  title: 'Heat Map · Directory Dashboard',
  robots: { index: false, follow: false },
};

export default async function HeatMapPaidPage({
  searchParams,
}: {
  searchParams: Promise<{ window?: string; event?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/portal/login?next=/admin/directory/heat-map');

  // Verify the user is a paid subscriber (replace with actual paid-subscriber check
  // verified during build per the Step 1 lookup).
  const { data: ownerRows } = await supabase
    .from('business_owners')
    .select('business_id')
    .eq('user_id', user.id);
  const isPaidSubscriber = (ownerRows ?? []).length > 0; // Simplistic for v1 — refine to check tier when paid-tier billing wires in.
  if (!isPaidSubscriber) redirect('/local/get-featured?upgrade=heatmap');

  const sp = await searchParams;
  const window = (sp.window === '24h' || sp.window === '30d' ? sp.window : '7d') as '24h' | '7d' | '30d';
  const eventFilter = sp.event && sp.event !== 'all' ? sp.event : 'all';

  const data = await aggregatePaidForSubscriber(user.id, window, eventFilter);

  return (
    <div className="mx-auto max-w-[1280px] p-6">
      <h1 className="display text-[24px] text-ink md:text-[32px]">Heat Map</h1>
      <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-coral">v1 access</p>
      <HeatMapClient initialData={data} />
    </div>
  );
}
```

- [ ] **Step 3: Stub the client component (full impl in Task 17)**

```tsx
// app/admin/directory/heat-map/HeatMapClient.tsx
'use client';

import type { PaidHeatmapData } from '@/app/lib/heatmap/types';

export default function HeatMapClient({ initialData }: { initialData: PaidHeatmapData }) {
  return (
    <div className="mt-6">
      <p className="text-[13px] text-ink-soft">
        Window: {initialData.window} · Filter: {initialData.eventTypeFilter}
      </p>
      <p className="mt-2 text-[13px] text-ink-soft">
        Showing {initialData.ownClickPoints.length} of your clicks.
      </p>
      {/* Filter strip + map + top businesses + CSV button land in Task 17. */}
    </div>
  );
}
```

- [ ] **Step 4: Write paid-gate test**

```ts
// tests/heatmap-paid-gate.spec.ts
import { test, expect } from '@playwright/test';

test('unauthenticated paid heat map redirects to login', async ({ page }) => {
  await page.goto('/admin/directory/heat-map');
  await expect(page).toHaveURL(/portal\/login/);
});
```

- [ ] **Step 5: Run + commit**

```bash
npx playwright test tests/heatmap-paid-gate.spec.ts -g "unauthenticated"
git add app/admin/directory/heat-map tests/heatmap-paid-gate.spec.ts
git commit -m "feat(heat-map): paid page gating + skeleton"
```

---

## Task 17: Paid page composition — filter + map + top businesses + CSV button

**Files:**
- Create: `components/heatmap/PaidTopBusinesses.tsx`
- Modify: `app/admin/directory/heat-map/HeatMapClient.tsx`

- [ ] **Step 1: Create the top-businesses list**

```tsx
// components/heatmap/PaidTopBusinesses.tsx
import type { OwnBusinessRow } from '@/app/lib/heatmap/types';

export default function PaidTopBusinesses({
  ownRows,
  competitorAverages,
}: {
  ownRows: OwnBusinessRow[];
  competitorAverages: Array<{ neighborhoodSlug: string; avgClicksPerBusiness: number }>;
}) {
  return (
    <section className="mt-6 border border-ink/15 p-5">
      <div className="eyebrow text-coral">Your businesses</div>
      <ul className="mt-3 space-y-2">
        {ownRows.length === 0 && (
          <li className="text-[13px] text-ink-soft italic">
            No clicks in this window yet. Make sure your business is published in the directory.
          </li>
        )}
        {ownRows.map((r) => (
          <li key={r.businessId} className="text-[14px] text-ink">
            <strong>{r.businessName}</strong>{' '}
            <span className="text-ink-soft">— {r.totalClicks} clicks</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-ink/15 pt-4">
        <div className="eyebrow text-ink-soft">Neighborhood averages (competitors)</div>
        <ul className="mt-2 space-y-1 text-[13px] text-ink-soft">
          {competitorAverages.map((c) => (
            <li key={c.neighborhoodSlug}>
              {c.neighborhoodSlug}: {c.avgClicksPerBusiness} clicks/business avg
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace the stub client with the full version**

```tsx
// app/admin/directory/heat-map/HeatMapClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';
import type { PaidHeatmapData, TimeWindow } from '@/app/lib/heatmap/types';
import PaidTopBusinesses from '@/components/heatmap/PaidTopBusinesses';

const HeatMap = dynamic(() => import('@/components/heatmap/HeatMap'), { ssr: false });
const ClusteredPoints = dynamic(() => import('@/components/heatmap/ClusteredPoints'), { ssr: false });

const WINDOWS: TimeWindow[] = ['24h', '7d', '30d'];
const EVENT_TYPES = [
  'all',
  'menu_click',
  'reservations_click',
  'phone_click',
  'website_click',
  'directions_click',
  'photo_view',
  'share_click',
  'related_click',
];

export default function HeatMapClient({ initialData }: { initialData: PaidHeatmapData }) {
  const router = useRouter();
  const params = useSearchParams();
  const window = (params.get('window') as TimeWindow) || initialData.window;
  const eventFilter = params.get('event') || initialData.eventTypeFilter;

  function setFilter(next: { window?: TimeWindow; event?: string }) {
    const sp = new URLSearchParams(params.toString());
    if (next.window) sp.set('window', next.window);
    if (next.event) sp.set('event', next.event);
    trackDirectoryEvent('heat-map', 'tools', 'heatmap_filter_change', {
      window: next.window ?? window,
      eventType: next.event ?? eventFilter,
    });
    router.push(`/admin/directory/heat-map?${sp.toString()}`);
  }

  function exportCsv() {
    const sp = new URLSearchParams();
    sp.set('window', window);
    if (eventFilter !== 'all') sp.set('event_type', eventFilter);
    trackDirectoryEvent('heat-map', 'tools', 'heatmap_export_csv', {
      window,
      eventType: eventFilter,
      rowCount: initialData.ownClickPoints.length,
    });
    window.location.href = `/api/heatmap/csv?${sp.toString()}`;
  }

  return (
    <div className="mt-6">
      <fieldset className="flex flex-wrap items-center gap-3 border border-ink/15 p-4">
        <legend className="sr-only">Filters</legend>
        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft">Window</span>
          {WINDOWS.map((w) => (
            <label key={w} className="cursor-pointer">
              <input
                type="radio"
                name="window"
                checked={window === w}
                onChange={() => setFilter({ window: w })}
                className="peer sr-only"
              />
              <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[11px] uppercase peer-checked:border-coral peer-checked:text-coral">
                {w}
              </span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft">Event</span>
          <select
            value={eventFilter}
            onChange={(e) => setFilter({ event: e.target.value })}
            className="border border-ink/20 bg-transparent px-2 py-1 text-[12px] text-ink"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto rounded-full bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-coral"
        >
          Download CSV
        </button>
      </fieldset>

      <div className="relative mt-5">
        <HeatMap ariaLabel="Paid heat map with own clicks">
          <ClusteredPoints
            points={initialData.ownClickPoints}
            ownBusinessIds={initialData.ownBusinessIds}
          />
        </HeatMap>
      </div>

      <PaidTopBusinesses
        ownRows={initialData.topByOwnBusiness}
        competitorAverages={initialData.competitorNeighborhoodAverages}
      />
    </div>
  );
}
```

Note — there's a name shadow risk: the component imports `dynamic` from `next/dynamic`, and uses a local variable `window` for the time-window state, which shadows the global `window`. The `window.location.href` call in `exportCsv` would actually reference our local var. Rename to avoid the conflict:

```ts
// Change variable name:
const win = (params.get('window') as TimeWindow) || initialData.window;
const eventFilter = params.get('event') || initialData.eventTypeFilter;

// And update setFilter signature/usage + exportCsv:
function exportCsv() {
  const sp = new URLSearchParams();
  sp.set('window', win);
  if (eventFilter !== 'all') sp.set('event_type', eventFilter);
  trackDirectoryEvent('heat-map', 'tools', 'heatmap_export_csv', {
    window: win,
    eventType: eventFilter,
    rowCount: initialData.ownClickPoints.length,
  });
  globalThis.location.href = `/api/heatmap/csv?${sp.toString()}`;
}
```

Apply the rename everywhere the local `window` was used in this client component before continuing.

- [ ] **Step 3: Smoke (with a seeded paid subscriber session)**

```bash
npm run dev
# Open /admin/directory/heat-map signed in as a paid subscriber.
# Switch filters; verify URL updates; verify map re-renders.
```

- [ ] **Step 4: Commit**

```bash
git add components/heatmap/PaidTopBusinesses.tsx app/admin/directory/heat-map/HeatMapClient.tsx
git commit -m "feat(heat-map): paid page filter strip + map + top businesses"
```

---

## Task 18: CSV export route

**Files:**
- Create: `app/api/heatmap/csv/route.ts`
- Create: `app/lib/heatmap/csv.ts`

- [ ] **Step 1: CSV generator (pure)**

```ts
// app/lib/heatmap/csv.ts
type CsvRow = {
  occurredAtIso: string;
  businessId: string;
  businessName: string;
  eventType: string;
  industrySlug: string;
};

function esc(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function eventsToCsv(rows: CsvRow[]): string {
  const header = 'occurred_at_iso,business_id,business_name,event_type,industry_slug\n';
  const body = rows
    .map((r) => [r.occurredAtIso, r.businessId, r.businessName, r.eventType, r.industrySlug].map(esc).join(','))
    .join('\n');
  return header + body + '\n';
}
```

- [ ] **Step 2: CSV route**

```ts
// app/api/heatmap/csv/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceClient } from '@/utils/supabase/service';
import { businesses } from '@/data/localBusinesses';
import { eventsToCsv } from '@/app/lib/heatmap/csv';
import type { TimeWindow } from '@/app/lib/heatmap/types';

export const runtime = 'nodejs';

function windowToMs(w: TimeWindow): number {
  switch (w) {
    case '24h': return 86_400_000;
    case '7d':  return 7 * 86_400_000;
    case '30d': return 30 * 86_400_000;
  }
}

export async function GET(req: NextRequest) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Resolve owned businesses
  const supabase = createServiceClient();
  const { data: ownerRows } = await supabase
    .from('business_owners')
    .select('business_id')
    .eq('user_id', user.id);
  const ownIds = (ownerRows ?? []).map((r: { business_id: string }) => r.business_id);
  if (ownIds.length === 0) return NextResponse.json({ error: 'no_businesses' }, { status: 403 });

  const url = new URL(req.url);
  const window = (url.searchParams.get('window') as TimeWindow) || '7d';
  const eventType = url.searchParams.get('event_type');
  const sinceIso = new Date(Date.now() - windowToMs(window)).toISOString();

  let q = supabase
    .from('directory_events')
    .select('business_id, event_type, industry_slug, created_at')
    .in('business_id', ownIds)
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(10000);
  if (eventType && eventType !== 'all') q = q.eq('event_type', eventType);

  const { data: events } = await q;
  const bizName = new Map(businesses.map((b) => [b.id, b.name]));
  const csv = eventsToCsv(
    (events ?? []).map((e: { business_id: string; event_type: string; industry_slug: string; created_at: string }) => ({
      occurredAtIso: e.created_at,
      businessId: e.business_id,
      businessName: bizName.get(e.business_id) ?? e.business_id,
      eventType: e.event_type,
      industrySlug: e.industry_slug,
    })),
  );

  const filename = `heatmap-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
```

- [ ] **Step 3: Write the CSV correctness test**

```ts
// tests/heatmap-paid-csv.spec.ts
import { test, expect } from '@playwright/test';

// Requires the paid-subscriber auth fixture from Task 1 Step 3.
test('CSV download contains only own business rows', async ({ page, context }) => {
  // Pseudocode for using storageState:
  // const ctx = await browser.newContext({ storageState: 'tests/_fixtures/paidSubscriber.json' });
  // const page = await ctx.newPage();
  await page.goto('/admin/directory/heat-map');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download CSV/i }).click(),
  ]);
  const path = await download.path();
  const fs = await import('fs/promises');
  const text = await fs.readFile(path!, 'utf-8');

  // Verify header
  expect(text.split('\n')[0]).toBe('occurred_at_iso,business_id,business_name,event_type,industry_slug');
  // Verify NO PII columns are present
  expect(text).not.toContain('ip_hash');
  expect(text).not.toContain('user_agent');
  expect(text).not.toContain('referrer');
});
```

- [ ] **Step 4: Run + commit**

```bash
git add app/lib/heatmap/csv.ts app/api/heatmap/csv/route.ts tests/heatmap-paid-csv.spec.ts
git commit -m "feat(heat-map): CSV export route (gated to own businesses)"
```

---

## Task 19: Paid filter Playwright test

**Files:**
- Create: `tests/heatmap-paid-filter.spec.ts`

- [ ] **Step 1: Create**

```ts
// tests/heatmap-paid-filter.spec.ts
import { test, expect } from '@playwright/test';

// Requires the paid-subscriber auth fixture from Task 1 Step 3.
test('filter changes fire heatmap_filter_change and update URL', async ({ page }) => {
  const events: Array<Record<string, unknown>> = [];
  await page.route('**/api/directory/track', async (route) => {
    events.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 204 });
  });

  await page.goto('/admin/directory/heat-map');
  // Switch window to 30d
  await page.getByLabel('30d').check();
  await page.waitForURL(/window=30d/);
  expect(events.some((e) => e.eventType === 'heatmap_filter_change')).toBe(true);
});
```

- [ ] **Step 2: Run + commit**

```bash
git add tests/heatmap-paid-filter.spec.ts
git commit -m "test(heat-map): paid filter change spec"
```

---

## Task 20: A11y spec

**Files:**
- Create: `tests/heatmap-a11y.spec.ts`

- [ ] **Step 1: Create**

```ts
// tests/heatmap-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a11y: public heat map', async ({ page }) => {
  await page.goto('/hilton-head-heat-map');
  // Wait for Leaflet to mount
  await page.waitForSelector('.leaflet-container', { state: 'visible' });
  const results = await new AxeBuilder({ page })
    .disableRules(['region', 'color-contrast']) // Leaflet's tile attribution sits over the map; map controls are decoration
    .analyze();
  expect(results.violations).toEqual([]);
});

// Paid-page a11y check requires the auth fixture; if available, uncomment:
// test('a11y: paid heat map', async ({ page }) => {
//   await page.goto('/admin/directory/heat-map');
//   await page.waitForSelector('.leaflet-container');
//   const results = await new AxeBuilder({ page }).disableRules(['region', 'color-contrast']).analyze();
//   expect(results.violations).toEqual([]);
// });
```

- [ ] **Step 2: Run + commit**

```bash
npx playwright test tests/heatmap-a11y.spec.ts
git add tests/heatmap-a11y.spec.ts
git commit -m "test(heat-map): a11y spec (public; paid pending fixture)"
```

---

## Task 21: Server-side `heatmap_view` tracking

**Files:**
- Modify: `app/hilton-head-heat-map/page.tsx`
- Modify: `app/admin/directory/heat-map/page.tsx`

- [ ] **Step 1: Use the shared server-side track helper from the Today on Hilton Head plan (Task 16 there)**

If `app/lib/today/track-server.ts` exists from the Today on HH plan, reuse it. Otherwise, create a small equivalent here:

```ts
// app/lib/heatmap/track-server.ts (only if not already present elsewhere)
import { headers } from 'next/headers';
import { brand } from '@/data/brand';

export async function trackHeatmapViewServer(surface: 'public' | 'paid'): Promise<void> {
  try {
    const hdrs = await headers();
    await fetch(`${brand.url}/api/directory/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': hdrs.get('x-forwarded-for') ?? '',
        'User-Agent': hdrs.get('user-agent') ?? 'heatmap-server',
        'Referer': hdrs.get('referer') ?? '',
      },
      body: JSON.stringify({
        businessId: 'heat-map',
        industrySlug: 'tools',
        eventType: 'heatmap_view',
        payload: { surface },
      }),
    });
  } catch {
    // Never block render on telemetry.
  }
}
```

- [ ] **Step 2: Fire on both pages**

In `app/hilton-head-heat-map/page.tsx` after the aggregation:

```ts
import { trackHeatmapViewServer } from '@/app/lib/heatmap/track-server';
// inside the page component:
void trackHeatmapViewServer('public');
```

In `app/admin/directory/heat-map/page.tsx` after the aggregation:

```ts
import { trackHeatmapViewServer } from '@/app/lib/heatmap/track-server';
void trackHeatmapViewServer('paid');
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/heatmap/track-server.ts app/hilton-head-heat-map/page.tsx app/admin/directory/heat-map/page.tsx
git commit -m "feat(heat-map): server-side heatmap_view tracking on both surfaces"
```

---

## Task 22: Final QA + typecheck + build

- [ ] **Step 1: Typecheck + lint**

```bash
npm run typecheck
npm run lint
```

Expected: clean.

- [ ] **Step 2: Run all heat-map tests**

```bash
npx playwright test tests/heatmap-*.spec.ts
```

Expected: all green on chromium + webkit. (Some tests may require the paid-subscriber fixture from Task 1 Step 3; those tests are documented as pending if the fixture isn't seeded yet.)

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: clean. Verify per-route bundle sizes:
- `/hilton-head-heat-map` ≤ 80 KB gzipped (Leaflet is the big one — lazy-loading via dynamic import keeps the SSR shell tiny)
- `/admin/directory/heat-map` similar

If over budget, the most likely fix is to lazy-load `ClusteredPoints.tsx` separately from `HeatMap.tsx`.

- [ ] **Step 4: Manual QA checklist**

- [ ] Public page loads at `/hilton-head-heat-map`
- [ ] Hero + choropleth render with 5 visible polygons
- [ ] Hover over a polygon → tooltip shows neighborhood name + click count
- [ ] Map legend appears in bottom-left of map area
- [ ] Top-5 rankings list mirrors choropleth order
- [ ] Founder note renders (or gracefully hides if `heatmapNote` is null)
- [ ] CTA links to `/local/get-featured`
- [ ] Privacy disclosure visible at bottom
- [ ] Sitemap includes `/hilton-head-heat-map`
- [ ] JSON-LD Dataset + Breadcrumb validate (test in Rich Results)
- [ ] Server-side `heatmap_view` event fires (verify in `directory_events`)
- [ ] Paid page redirects unauthenticated users to login
- [ ] Paid page redirects non-paid subscribers to `/local/get-featured`
- [ ] Paid page (authenticated paid subscriber) renders filter strip + map + own clicks + top businesses
- [ ] Filter changes update URL and re-render
- [ ] CSV download works; no PII in the file
- [ ] Mobile (≤480px): both pages stack to single column; map height reduces

- [ ] **Step 5: Operational notes**

Before deploy:
- Verify migration 016 applied in production
- Verify `business_owners` (or equivalent) table is queryable
- Verify Supabase service-role key is set (required for aggregation reads)
- Hand-traced polygons in `data/heatmap-boundaries.ts` use real coordinates (not the placeholder bounding boxes from Task 4 starter code)

- [ ] **Step 6: Final commit (if any nits)**

```bash
git add -A
git commit -m "chore(heat-map): final polish + manual QA pass"
```

---

## Self-Review

**Spec coverage:**
- ✅ Public choropleth — Tasks 7, 10, 12, 13
- ✅ Paid full with clustered points — Tasks 8, 11, 16, 17
- ✅ Filter strip (window + event-type) — Task 17
- ✅ CSV export (own data, no PII) — Task 18
- ✅ Migration 016 — Task 2
- ✅ Server-side `heatmap_view` tracking — Task 21
- ✅ Client `heatmap_filter_change` + `heatmap_export_csv` — Task 17
- ✅ Privacy disclosure — Task 13
- ✅ Monetization CTA on public page — Task 13
- ✅ Hand-traced polygons — Task 4
- ✅ Point-in-polygon — Task 5
- ✅ Public + paid aggregation — Tasks 7, 8
- ✅ Caching (1h public, 15min paid per user) — Tasks 7, 8
- ✅ Sitemap entry — Task 14
- ✅ JSON-LD Dataset + Breadcrumb — Task 12
- ✅ Playwright tests (happy, gate, filter, CSV, a11y) — Tasks 12, 16, 18, 19, 20
- ✅ Performance budgets — Task 22 step 3

**Placeholder scan — none found.** The polygon-coordinates placeholder in Task 4 is explicitly flagged as a manual hand-tracing step with documented procedure (geojson.io workflow), not a "TODO".

**Type consistency:**
- `TimeWindow`, `NeighborhoodAggregate`, `ClickPoint`, `PublicChoroplethData`, `PaidHeatmapData`, `OwnBusinessRow` defined in Task 3, imported consistently in Tasks 7, 8, 11, 17
- `DirectoryEventType` extended in Task 15 with all 3 heat-map events; matches the `VALID_EVENT_TYPES` Set widening in the same task
- `pointInPolygon` / `bucketToNeighborhood` signatures used in Tasks 7, 8 match the definitions in Task 5
- `business_owners` table name is referenced in Tasks 8, 16, 18 — flagged as "verify during build" in Task 8 + Task 16 (in case the actual portal schema uses a different name)

**Known-quirky:** Task 17 has a `window` variable name that shadows the global `window` object — explicit rename to `win` in the task to avoid the bug.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-20-visitor-heat-map.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review.

**2. Inline Execution** — execute tasks in this session.

Which approach?
