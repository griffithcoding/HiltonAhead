# Visitor Heat Map — Design Spec

**Date:** 2026-05-20
**Status:** Approved (Q1–Q3), pending user review of written spec
**Author:** Claude (brainstorming session with William Griffith)
**Source frame:** [docs/brainstorming/2026-05-04-million-dollar-roadmap.md](../../brainstorming/2026-05-04-million-dollar-roadmap.md) — tool #3 of the 3-tool traveler-utility roadmap. **The monetization tool.**

## 1. Overview

Two map surfaces, one data backbone:

- **Public lite — `/hilton-head-heat-map`** — a free, SEO-targeted choropleth showing the previous 7 days of click density aggregated by Hilton Head neighborhood (Sea Pines, Palmetto Dunes, Forest Beach, Shipyard, Bluffton). No business detail, no time filter. Marketing surface that ranks for *"hilton head visitor heat map"* / *"where are tourists hilton head"* and drives directory-paid-tier signups.
- **Paid full — `/admin/directory/heat-map`** — gated by paid directory subscription (NOT founder admin). Subscribers see clustered raw click points on a pan/zoomable map, filterable by event type, with a top-10 most-clicked-businesses list and CSV export of their own business's events. Lean v1 ships to all paid directory subscribers; Standard ($249) and Premium ($499) tiers defer to v1.1 with feature gates.

Built on **Leaflet + OpenStreetMap tiles** (both free, no API limits). Data source is the existing `directory_events` table — 100% first-party. No paid foot-traffic data, no scraped check-ins, no PII.

## 2. Goal & success metrics

**Primary goal — monetization:** be the feature that justifies a directory paid-tier subscription at $99/mo per business. Lean v1 unlock for every paid subscriber. The dashboard is the *proof-of-attribution* that makes the subscription stick.

**Secondary goal — SEO traffic + brand authority:** rank for *"hilton head visitor heat map"*, *"hilton head tourist activity map"*, *"hilton head where are the people"*. Become *the* citable local source for "what's busy on the island this week."

**Success metrics (90 days post-launch):**
- Directory paid-tier conversions: ≥ 8 new paid subscribers driven specifically by the heat map (track via signup attribution)
- Subscriber-side engagement: ≥ 60% of paid subscribers open the heat-map dashboard ≥ 1×/week
- Public-side traffic: ≥ 250 monthly organic sessions from heat-map-related queries
- Map render P95 LCP ≤ 2.0s on 4G

**Anti-goals:**
- Do not collect PII from public visitors. IPs already hashed; nothing else captured.
- Do not surface individual click events in the public version (privacy + competitive risk to subscribers).
- Do not let subscribers see competitors' raw clicks — only neighborhood aggregates of competitors.

## 3. Scope

### In scope (v1)
- New public page: `app/hilton-head-heat-map/page.tsx` — server-rendered choropleth, 7-day rolling window
- New paid page: `app/admin/directory/heat-map/page.tsx` — gated by paid directory tier (uses existing portal auth from `dca6721`)
- Map component: `components/heatmap/HeatMap.tsx` (client island wrapping Leaflet)
- Choropleth layer: `components/heatmap/NeighborhoodChoropleth.tsx`
- Clustered-points layer: `components/heatmap/ClusteredPoints.tsx`
- Aggregation server functions: `app/lib/heatmap/`
- Neighborhood boundaries: `data/heatmap-boundaries.ts` (GeoJSON polygons for 5 neighborhoods)
- `Business.latitude` / `Business.longitude` already added in Restaurant Hub spec — heat map uses those
- CSV export API: `app/api/heatmap/csv/route.ts` (gated to paid subscribers, scoped to their own business)
- New `directory_events` event types: `heatmap_filter_change`, `heatmap_export_csv`
- Migration `016_heatmap_events.sql` — widens event_type CHECK constraint
- JSON-LD `Dataset` + `Map` schema for public page
- Sitemap entry for public page
- Playwright tests — public render, paid gate, filter behavior, CSV export, a11y
- Privacy disclosure paragraph at bottom of both pages

### Out of scope (v1, deferred to v1.1+)
- Standard ($249/mo) tier features: custom date range, industry-slug filter, sortable per-business columns
- Premium ($499/mo) tier features: hourly click distribution per business, competitor comparison, weekly emailed PDF dashboard
- Time-window filters beyond the 3 v1 presets (24h / 7d / 30d) — no custom range in lean v1
- Mobile-optimized "Where's everyone right now?" condensed view (defer — desktop-first; mobile gets the same layout, smaller map)
- Public version: per-business detail
- Real-time WebSocket updates — cached 1h is fine for v1
- Foursquare / paid foot-traffic data layers (per Q1 = deferred v2/v3)
- Per-page heatmap widgets embedded on `/local/restaurants/[slug]` pages — v1.1
- Localization

### Explicit non-goals
- No PII captured beyond what `directory_events` already stores (IP hashed via SHA-256 + salt; user-agent capped to 500 chars; referrer capped to 1,000 chars).
- No third-party tracking pixels on the heat map page.
- No exposure of one subscriber's raw clicks to another subscriber.
- No exposure of individual click events to the public — choropleth only aggregates by neighborhood × time window.

## 4. UX flow & page layouts

### Public lite — `/hilton-head-heat-map`

```
┌──────────────────────────────────────────────────────────────────────┐
│ <Header /> (existing)                                                 │
├──────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home → Visitor Heat Map                                   │
├──────────────────────────────────────────────────────────────────────┤
│ HERO                                                                  │
│  Eyebrow: "Heat Map" · italic accent: "Where readers cluster."        │
│  Display H1: "Hilton Head Visitor Heat Map"                           │
│  Subhead: "Where the click traffic is on Hilton Head, last 7 days.   │
│            Updated hourly."                                           │
├──────────────────────────────────────────────────────────────────────┤
│ MAP (full-width, 60vh tall)                                           │
│  Leaflet + OSM tiles                                                  │
│  Choropleth polygons (5 neighborhoods, color by 7d click density)     │
│  Legend (bottom-left): "Click density · low → high"                   │
│  Last updated stamp (bottom-right)                                    │
├──────────────────────────────────────────────────────────────────────┤
│ NEIGHBORHOOD RANKINGS (below map)                                     │
│  Top 5 neighborhoods by clicks last 7d, with simple bar chart         │
│  No per-business detail in public version                             │
├──────────────────────────────────────────────────────────────────────┤
│ EDITORIAL NOTE                                                        │
│  Founder voice — "What this means" — 3-4 sentences explaining the     │
│  current pattern (manually edited in data/heatmap-note.ts)            │
├──────────────────────────────────────────────────────────────────────┤
│ MONETIZATION CTA                                                      │
│  "Run a business on Hilton Head? See the full data."                  │
│  → /local/get-featured                                                │
├──────────────────────────────────────────────────────────────────────┤
│ PRIVACY NOTE                                                          │
│  "No personal data. All clicks aggregated. We never sell raw data."   │
├──────────────────────────────────────────────────────────────────────┤
│ <FinalCta /> + <Footer />                                             │
└──────────────────────────────────────────────────────────────────────┘
```

### Paid full — `/admin/directory/heat-map`

```
┌──────────────────────────────────────────────────────────────────────┐
│ <PortalHeader /> (existing portal/admin layout)                       │
├──────────────────────────────────────────────────────────────────────┤
│ Page title: "Heat Map · <Business Name>"                              │
│ Tier badge: "v1 access" (later: "Standard tier" / "Premium tier")     │
├──────────────────────────────────────────────────────────────────────┤
│ FILTER STRIP                                                          │
│  Window: [24h | 7d | 30d]    (active state highlighted)               │
│  Event type: [all | menu_click | reservations_click | phone_click |  │
│              website_click | directions_click | photo_view |          │
│              share_click | related_click]                             │
│  [Refresh]  ·  Last updated: 18 min ago                               │
├──────────────────────────────────────────────────────────────────────┤
│ MAP (60vh tall)                                                       │
│  Leaflet + OSM tiles                                                  │
│  Clustered raw click points (Leaflet.markercluster)                   │
│  Subscriber's OWN business markers: highlighted (red border)          │
│  Other businesses: shown as neighborhood-aggregate hexbins (NOT raw) │
│  Pan/zoom enabled                                                     │
├──────────────────────────────────────────────────────────────────────┤
│ TOP-10 CLICKED BUSINESSES (right rail or below map on mobile)         │
│  Sortable: subscriber's own businesses always at top; competitors     │
│  shown as anonymized neighborhood aggregates                          │
│  - You: <Business Name>     124 clicks · 38 menu views · 12 calls    │
│  - Sea Pines avg            ~410 clicks per business                  │
│  - Palmetto Dunes avg       ~280 clicks per business                  │
│  - etc.                                                               │
├──────────────────────────────────────────────────────────────────────┤
│ CSV EXPORT                                                            │
│  [Download my data as CSV]                                            │
│  Exports rows: timestamp, event_type, business_id (yours only),       │
│  industry_slug. NO PII, NO competitor data, NO IP.                    │
├──────────────────────────────────────────────────────────────────────┤
│ UPGRADE TEASER (v1.1)                                                 │
│  "Unlock hourly distribution + competitor comparison" → Standard      │
│  Currently disabled — shows when v1.1 ships                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile UX

- Same layout, single-column. Map height drops to 50vh on small viewports.
- Filter strip wraps to two rows on small viewports.
- Top-10 list moves below the map (not a right rail) on small viewports.

## 5. Data model

### Neighborhood boundaries (`data/heatmap-boundaries.ts`)

```ts
/**
 * GeoJSON-style polygons for the 5 neighborhoods we use on the public choropleth.
 * Coordinates are [longitude, latitude] pairs per GeoJSON spec.
 *
 * Boundaries are approximate, hand-traced on a single-island map. Good enough
 * for visual density display — not authoritative parcel data.
 */

export type NeighborhoodBoundary = {
  slug: string;
  name: string;
  /** GeoJSON Polygon coordinate ring (closed — first/last point identical). */
  polygon: Array<[number, number]>;
};

export const NEIGHBORHOODS: NeighborhoodBoundary[] = [
  {
    slug: 'sea-pines',
    name: 'Sea Pines',
    polygon: [
      [-80.842, 32.123], [-80.785, 32.123], [-80.785, 32.165],
      [-80.842, 32.165], [-80.842, 32.123],
    ],
    // TODO during build: replace these placeholder bounding-box coordinates
    // with hand-traced polygons. The 5 polygons should be non-overlapping
    // and cover the populated area of Hilton Head + Bluffton.
  },
  {
    slug: 'palmetto-dunes',
    name: 'Palmetto Dunes',
    polygon: [
      [-80.755, 32.165], [-80.720, 32.165], [-80.720, 32.205],
      [-80.755, 32.205], [-80.755, 32.165],
    ],
  },
  {
    slug: 'forest-beach',
    name: 'Forest Beach',
    polygon: [
      [-80.785, 32.140], [-80.755, 32.140], [-80.755, 32.165],
      [-80.785, 32.165], [-80.785, 32.140],
    ],
  },
  {
    slug: 'shipyard',
    name: 'Shipyard',
    polygon: [
      [-80.785, 32.165], [-80.755, 32.165], [-80.755, 32.185],
      [-80.785, 32.185], [-80.785, 32.165],
    ],
  },
  {
    slug: 'bluffton',
    name: 'Bluffton',
    polygon: [
      [-80.890, 32.215], [-80.820, 32.215], [-80.820, 32.280],
      [-80.890, 32.280], [-80.890, 32.215],
    ],
  },
];
```

**Build-time task:** Replace placeholder bounding boxes with hand-traced polygons using geojson.io. Polygons must not overlap (point-in-polygon ambiguity); a click attributed to a business with lat/long is bucketed into the FIRST matching polygon (deterministic ordering).

### Aggregation result types (`app/lib/heatmap/types.ts`)

```ts
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
  fetchedAt: string;            // ISO
  windowDays: number;           // always 7 in v1 public
  neighborhoods: NeighborhoodAggregate[];
  totalClicksAcrossIsland: number;
};

export type ClickPoint = {
  businessId: string;
  latitude: number;
  longitude: number;
  eventType: string;
  /** ISO truncated to hour for clustering — never the exact second */
  occurredAtHour: string;
};

export type PaidHeatmapData = {
  fetchedAt: string;
  window: TimeWindow;
  eventTypeFilter: string | 'all';
  ownBusinessIds: string[];
  ownClickPoints: ClickPoint[];           // raw clicks for subscriber's own businesses
  neighborhoodAggregates: NeighborhoodAggregate[];
  topByOwnBusiness: Array<{
    businessId: string;
    businessName: string;
    totalClicks: number;
    clicksByEventType: Record<string, number>;
  }>;
  competitorNeighborhoodAverages: Array<{
    neighborhoodSlug: string;
    avgClicksPerBusiness: number;
  }>;
};
```

### Founder note (`data/heatmap-note.ts`)

```ts
export const heatmapNote: { date: string; body: string } | null = null;
// Set this to a manually-edited entry when there's a worthwhile pattern to call out.
// Example:
// {
//   date: '2026-05-20',
//   body: "Palmetto Dunes traffic is up 40% week-over-week. Mid-May beach-trip booking surge — expect this to peak the first week of June.",
// }
```

## 6. Aggregation logic

All aggregation runs server-side; the client never sees raw `directory_events` rows.

### Public choropleth aggregation

```ts
// app/lib/heatmap/public-aggregation.ts (pseudocode)
async function aggregatePublic(): Promise<PublicChoroplethData> {
  const supabase = createServiceClient();
  // Last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: events } = await supabase
    .from('directory_events')
    .select('business_id, event_type')
    .gte('created_at', sevenDaysAgo);

  // Resolve business_id -> lat/long via data/localBusinesses.ts (in-memory lookup)
  // For each event, find which neighborhood polygon contains its (lat, lng) — point-in-polygon
  // Bucket counts per neighborhood, plus a "topEventType" per neighborhood.
  // Return PublicChoroplethData.
}
```

Point-in-polygon: implement once in `app/lib/heatmap/point-in-polygon.ts` (~15 lines, classic ray-casting algorithm).

### Paid aggregation

Same shape but scoped by `auth.user_id → owned business_ids`:

1. Resolve `req.auth.userId` → list of `business_ids` owned by that subscriber via the portal's existing business-ownership table.
2. Run two queries:
   - **Own clicks:** raw rows for these `business_id`s in the time window
   - **All clicks:** counts grouped by `neighborhood_slug` (derived from each event's business → lat/long → polygon)
3. Compute `competitorNeighborhoodAverages` as `(total_clicks_in_neighborhood - own_clicks_in_neighborhood) / (business_count_in_neighborhood - own_business_count)`.
4. Return `PaidHeatmapData`.

### Caching

- Public: cached server-side via Next.js `unstable_cache` with 1h revalidation
- Paid: cached 15min per `user_id` cache key (avoids cross-subscriber data leak)

## 7. Routing & SEO

### Public route — `app/hilton-head-heat-map/page.tsx`

- `export const revalidate = 3600;` (1h)
- Per-page metadata:
  - `title`: *"Hilton Head Visitor Heat Map — Where Travelers Cluster · Hilton Ahead"*
  - `description`: *"Live density map of Hilton Head Island, by neighborhood. Updated hourly. See where the click traffic is on Sea Pines, Palmetto Dunes, Forest Beach, and beyond."*
  - `keywords`: *hilton head visitor heat map, hilton head tourist activity, where are tourists hilton head, hilton head crowd map*
  - OpenGraph + Twitter cards
- JSON-LD schemas:
  - `Dataset` schema (`@type: 'Dataset'`, `name`, `description`, `temporalCoverage`)
  - `Map` schema (`@type: 'Map'`)
  - `Breadcrumb` schema

### Paid route — `app/admin/directory/heat-map/page.tsx`

- No ISR — server component, fetches per request
- `noindex` metadata (private dashboard)
- Reuses existing portal/admin layout gating

### Sitemap

Add public `/hilton-head-heat-map` entry with `changeFrequency: 'hourly'`, `priority: 0.8`.

## 8. API endpoints

### `GET /api/heatmap/csv` (paid only)

Generates a CSV of the authenticated subscriber's OWN business events in the requested window.

```
Query params:
  window: '24h' | '7d' | '30d' (default '7d')
  event_type: optional filter

Auth: must be a paid directory subscriber (gating layer same as /admin/directory/* portal pages)

Response: text/csv, Content-Disposition: attachment; filename="heatmap-<date>.csv"

CSV columns: occurred_at_iso, business_id, business_name, event_type, industry_slug
NO PII columns (no ip_hash, no user_agent, no referrer)

Rate limit: 10 exports / subscriber / day
```

### No public-facing data API in v1

The public page is server-rendered with aggregated data baked in. No `/api/heatmap/public` endpoint — would expose neighborhood-level data structure to scrapers without value.

## 9. Privacy & compliance

### What we already collect (no change)
- `directory_events` rows with hashed IP (SHA-256 + `SUPABASE_SERVICE_ROLE_KEY` salt)
- User agent (capped 500 chars)
- Referrer (capped 1000 chars)
- Event type + payload jsonb

### What the heat map renders
- Public: aggregated counts per neighborhood. No row-level data ever leaves the server.
- Paid: row-level clicks ONLY for businesses the subscriber owns. Everyone else's data shown as neighborhood-aggregate averages.

### What we never expose
- Raw IP (only the salted hash is stored)
- User agents
- Referrers
- Individual click timestamps in the public version
- Competitor business names alongside their click counts

### CCPA / GDPR posture
- No identifiers tied to natural persons. IP-hash is irreversible without the service-role key.
- No "right to access / delete" workflow needed because there's no personally identifiable data to surface.
- Privacy disclosure: short paragraph at the bottom of both pages, plus a link to the existing privacy policy.

### Audit trail
- Every CSV export logs an event (`heatmap_export_csv`) with the subscriber's `user_id` and the requested window. Founder admin can audit exports via existing admin tooling.

## 10. Tracking events

New `directory_events` event types via migration `016_heatmap_events.sql`:

| Event | When | Payload notes |
|---|---|---|
| `heatmap_view` | Page render on public page | `{ surface: 'public' }` |
| `heatmap_view` | Page render on paid page | `{ surface: 'paid' }` |
| `heatmap_filter_change` | Subscriber switches filter on paid page | `{ window: TimeWindow, eventType: string }` |
| `heatmap_export_csv` | Subscriber clicks Download CSV | `{ window: TimeWindow, eventType: string, rowCount: number }` |

All events use `business_id='heat-map'`, `industry_slug='tools'` (matches the Today on Hilton Head namespace).

## 11. Performance budgets

- **Public page LCP** ≤ 2.0s on 4G
- **Public bundle** ≤ 80 KB gzipped (Leaflet is the heavy dep; lazy-load via `next/dynamic` and `ssr: false` so the initial server render is just markup)
- **Map render** ≤ 1.0s after client hydration on 4G
- **Paid aggregation query** ≤ 500ms server-side for the 30-day window (use an index on `directory_events(created_at desc)` — already exists per migration 012)
- **Public choropleth caching:** 1h revalidate, served from edge cache after first build

## 12. Accessibility (WCAG AA)

- Map is decorative for SEO purposes — primary content is in the rankings list below
- Alternative text-equivalent: rankings list is real DOM, screen-reader-accessible, mirrors the visual map
- Leaflet keyboard nav: arrow keys pan, +/- zoom (enabled by default; verify in tests)
- Filter strip on paid page is `<fieldset>` with proper `<legend>` and radio-button semantics
- All buttons have `aria-label` and visible focus states
- Color choices on choropleth must pass colorblind safe checks — use a sequential color scheme like Viridis (built-in to chroma.js or hand-pick from ColorBrewer)
- Privacy paragraph + monetization CTA must hit AA contrast
- `prefers-reduced-motion`: disable any pan/zoom animations

## 13. Testing

Playwright only.

- `tests/heatmap-public.spec.ts` — public page renders, choropleth visible, top-5 list visible, no console errors
- `tests/heatmap-paid-gate.spec.ts` — unauthenticated request to `/admin/directory/heat-map` redirects to login; non-paid subscriber sees upgrade page (not heatmap)
- `tests/heatmap-paid-filter.spec.ts` — paid subscriber can switch window/event-type filter; filter-change event fires
- `tests/heatmap-paid-csv.spec.ts` — paid subscriber can download CSV; verify content shape and that competitor data is NOT included
- `tests/heatmap-a11y.spec.ts` — `axe-core` scan on both public and paid pages

For tests that need an authenticated paid subscriber, use the portal's existing test-auth fixture (per `dca6721`). If no fixture exists, the plan includes a dedicated task to add a minimal one (`tests/_fixtures/paidSubscriberAuth.ts` — Playwright `storageState` fixture that pre-authenticates as a seed-data paid subscriber).

## 14. Operations

- Hand-trace 5 neighborhood polygons during build (~30 min via geojson.io)
- Migration 016 to be applied via Supabase CLI before deploy
- No new env vars
- Leaflet + leaflet.markercluster as new npm deps
- chroma.js (optional, for color scale) — or use Tailwind palette tokens directly
- Verify business latitude/longitude exists on all 11 restaurants from Restaurant Hub spec — businesses without lat/long are silently excluded from the heat map aggregation

## 15. Open questions / future work

- **Standard tier ($249/mo) v1.1 features:** custom date range picker, industry-slug filter, sortable per-business columns, fuller CSV with payload
- **Premium tier ($499/mo) v1.2 features:** hourly distribution chart per business, anonymized competitor comparison, weekly emailed PDF dashboard (reuses Villa Match PDF infrastructure)
- **Per-business widget embed** — drop a small `<HeatMapWidget businessId="..." />` on each `/local/restaurants/[slug]` deep page. v1.1.
- **WebSocket real-time updates** — currently 15-min cache. Consider Supabase Realtime in v2 once data product matters more than the public marketing surface.
- **Foursquare layer** — adds public check-ins on top of first-party data. Free tier sufficient. v2.
- **Placer.ai / SafeGraph** — paid foot-traffic data. v3 only if revenue justifies it (~$50k/yr starting price).
- **Heat map ↔ Today on Hilton Head crossover** — surface a "where's busy right now" mini-widget on the Today dashboard? Possible v1.1.

## 16. Monetization narrative (for the sales playbook session after this ships)

This is **the** revenue tool. Two motion paths:

### Direct (paid subscriber pipeline)
- Public lite ranks on Google for *"hilton head visitor heat map"* → traveler curiosity click → editorial note + CTA → directory paid-tier signup
- Existing directory subscribers see the heat-map dashboard appear in their portal → retention boost ("now I can see what I'm paying for")
- Sales motion: cold email to restaurants → "we have data on where Hilton Head travelers are clicking, would you like to see your share?" → 5-min demo → close at $99/mo
- Tier ladder once v1.1 ships: Lean $99 → Standard $249 → Premium $499. Each tier unlocks more of the heat-map dashboard.

### Indirect (cross-stream amplification)
- Sponsor slots on Restaurant Hub + Today on Hilton Head become more sellable because advertisers can now SEE the dashboards proving traffic
- Newsletter sponsor pricing increases because we can show subscribers per-issue performance via aggregated heatmap data
- The heat map itself can become a paid B2B newsletter ("Hilton Head Weekly: where the click traffic moved") at $19/mo
- Eventually, anonymized aggregate insights become a sellable industry report — sold to Visit Hilton Head, Chamber of Commerce, real-estate firms, hotel operators

The first three streams of the $1M roadmap (consulting fees, directory subs, sponsor slots) all amplify with the heat map live. **This is the keystone tool.**

---

## Self-review checklist

Inline self-review happens after this draft commits.

1. **Placeholder scan** — `// TODO during build:` in the neighborhood-boundaries data file is acceptable (hand-tracing required and noted in §14); flag any others
2. **Internal consistency** — Speakable selectors not used on this page (page is data-product, not editorial); skipped intentionally
3. **Scope check** — fits one implementation plan? Yes (~22–26 tasks expected)
4. **Type consistency** — `TimeWindow`, `NeighborhoodAggregate`, `PaidHeatmapData` defined in §5, used consistently across §6 + §8
5. **Privacy correctness** — §9 makes explicit what we never expose; CSV export shape in §8 confirms it
