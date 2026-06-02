# Vacation Rentals Hub + Per-Neighborhood Real Estate Trends — Design

**Date:** 2026-06-01
**Status:** Draft — awaiting review
**Branch (planned):** `feat/vacation-rentals-hub`
**Owner:** William Griffith

---

## 1. Context

The site currently has `/local/vacation-rentals` — a curated business directory of **property management companies** on Hilton Head Island. There is no surface where a visitor can browse **individual rental units** with photos, pricing, amenities, and reviews. The user wants:

- A top-level "Vacation Rentals" tab in the main navigation
- A hub page and per-neighborhood sub-pages
- Each page displays rental properties with pricing, gallery, sq ft, basic amenities, and reviews
- Each neighborhood page also shows an **interactive map of real estate market trends** for that area
- The build must be **bootstrapped (zero recurring data cost)**
- Rental-page conversion is not required for v1 (visit/browse intent is the goal)
- Real-estate page captures **referral leads to a single partner Realtor** from day one
- Future-state: collect first-party intent signals (which neighborhoods, what price tier) that become leadable buyer data for the Realtor partner

The challenger path (drop curated cards, lean on the Stay22 map alone) was considered and **explicitly rejected by the owner** in favor of curated cards. The owner accepts the manual-curation maintenance burden in exchange for a catalog-feel page with editorial control.

## 2. Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Rental data source | Stay22 multi-source affiliate (Booking + VRBO + Airbnb + Hotels) | Only path that legally surfaces Airbnb inventory; no per-program approval gauntlet; revenue-share, no subscription |
| Stay22 product on free tier | **Interactive Map widget (confirmed free)** + **Allez/affiliate link transformation** (confirmed free) | Verified at stay22.com 2026-06-01: "Start for free", "Get paid within 30 days" — no subscription surfaced; Roam / Enterprise API tier deferred pending owner's outreach |
| Listing card content | **Curated catalog (hand-picked properties)** | Owner's call. Trade-off accepted: ongoing curation labor for editorial control and catalog feel. ~6 properties per neighborhood at launch (36 total). |
| Routing | Top-level `/vacation-rentals` hub + 6 neighborhood sub-pages | Matches `data/neighborhoods.ts`: Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, Port Royal, Mid-Island |
| Nav placement | New top-level item in `data/nav.ts`, inserted between "Local Guide" and "Businesses" | Highest-intent surface for booking visitors |
| Existing `/local/vacation-rentals` page | **Unchanged** — stays as a property-management directory | Different intent (B2B directory) vs. consumer rental catalog |
| Real estate data source | Redfin Data Center monthly housing-market CSVs (free, attribution required) | Zero recurring cost, no MLS membership required, no scraping liability |
| Real estate display | **Neighborhood-shaped polygon heatmap + trend charts (no per-transaction pins)** | Owner's explicit pivot away from individual-deal display; avoids real estate licensing/liability questions |
| Real estate conversion | **Partner-agent referral form** (single partner Realtor) | Revenue from day 1; partner identity TBD by owner before launch |
| Photo hosting | Own assets, `/public/rentals/...` | Avoids Airbnb/Booking hotlink TOS exposure |

## 3. Routes + navigation

### Routes

```
/vacation-rentals                           # Hub: full-island grid + map + neighborhood comparison
/vacation-rentals/sea-pines                 # Neighborhood detail
/vacation-rentals/palmetto-dunes
/vacation-rentals/forest-beach
/vacation-rentals/shelter-cove
/vacation-rentals/port-royal
/vacation-rentals/mid-island
```

Implementation:

- `app/vacation-rentals/page.tsx` — hub
- `app/vacation-rentals/[slug]/page.tsx` — dynamic neighborhood detail
- Both render the same `<RentalsPage>` template component with different `mode: 'hub' | 'neighborhood'` props

### Nav (`data/nav.ts`)

Insert new top-level link between "Local Guide" (index 1) and "Businesses" (index 2):

```ts
{
  href: '/vacation-rentals',
  label: 'Vacation Rentals',
  children: [
    { href: '/vacation-rentals/sea-pines', label: 'Sea Pines' },
    { href: '/vacation-rentals/palmetto-dunes', label: 'Palmetto Dunes' },
    { href: '/vacation-rentals/forest-beach', label: 'Forest Beach' },
    { href: '/vacation-rentals/shelter-cove', label: 'Shelter Cove' },
    { href: '/vacation-rentals/port-royal', label: 'Port Royal' },
    { href: '/vacation-rentals/mid-island', label: 'Mid-Island' },
  ],
},
```

### Footer (`data/footerLinks.ts`)

Add "Vacation Rentals" section with all 7 links.

### Sitemap (`app/sitemap.ts`)

Add all 7 URLs to the static-routes list.

## 4. Data layer

### 4.1 Rental catalog — `data/rentalsCatalog.ts` (new)

Single source of truth for the curated rental cards. No external API call. Manually maintained.

```ts
export type RentalSource = 'booking' | 'vrbo' | 'airbnb' | 'hotels' | 'direct';
export type NeighborhoodSlug =
  | 'sea-pines'
  | 'palmetto-dunes'
  | 'forest-beach'
  | 'shelter-cove'
  | 'port-royal'
  | 'mid-island';

export type CatalogRental = {
  readonly id: string;                       // stable, e.g. 'sp-oceanside-villa-12'
  readonly slug: string;                     // URL-safe handle (used in id)
  readonly neighborhood: NeighborhoodSlug;
  readonly title: string;                    // "3BR Oceanfront Villa in South Beach"
  readonly photoUrls: ReadonlyArray<string>; // 3-8 photos, hosted in /public/rentals/...
  readonly beds: number;
  readonly baths: number;
  readonly sqft?: number;                    // optional — omit when unknown
  readonly pricePerNightBand: string;        // "$450-650 summer / $250-400 shoulder"
  readonly amenities: ReadonlyArray<string>;
  readonly rating?: number;                  // 0-5, optional
  readonly reviewCount?: number;
  readonly bookingDeeplink: string;          // affiliate-stamped URL
  readonly source: RentalSource;
  readonly editorialNote: string;            // 1-2 sentences explaining the pick
};

export const rentalsCatalog: ReadonlyArray<CatalogRental> = [/* ... */];

export function rentalsByNeighborhood(slug: NeighborhoodSlug): CatalogRental[];
export function allRentals(): CatalogRental[];
```

**Card-shape stability is a hard requirement.** Future swap to a live API (Stay22 Enterprise/Roam or Booking.com API) must preserve `CatalogRental` so consumer components don't change.

### 4.2 Neighborhood editorial — `data/vacationRentals.ts` (new)

Editorial content per neighborhood, keyed by slug. Pattern mirrors `data/localBusinesses.ts`.

```ts
export type RentalAreaContent = {
  readonly slug: NeighborhoodSlug;
  readonly name: string;
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly heroImage: { src: string; alt: string };
  readonly geofence: {
    readonly center: { lat: number; lng: number };
    readonly zoom: number;
    readonly bounds?: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } };
  };
  readonly tldr: string;                     // for <TldrBlock>, ≤ 280 chars
  readonly vibe: string;                     // 2-3 sentence positioning
  readonly whoFor: ReadonlyArray<string>;
  readonly beachAccess: string;
  readonly topAmenities: ReadonlyArray<string>;
  readonly quickFacts: ReadonlyArray<{ label: string; value: string }>;
  readonly bestForLinks: ReadonlyArray<{
    label: string;                           // "Oceanfront villas"
    stay22DeeplinkParams: Record<string, string | number>;
  }>;
  readonly faq: ReadonlyArray<{ question: string; answer: string }>;
};

export const rentalAreas: Readonly<Record<NeighborhoodSlug, RentalAreaContent>>;
```

### 4.3 Stay22 integration — `app/lib/stay22.ts` (new)

Free-tier helpers only. No JSON-listing fetch.

```ts
export const STAY22_AFFILIATE_ID: string;   // from env: STAY22_AFFILIATE_ID
export function stay22MapEmbedConfig(area: RentalAreaContent): Stay22MapConfig;
export function withStay22Params(url: string): string;
export function stay22SearchDeeplink(
  area: RentalAreaContent,
  filters?: Partial<Stay22Filters>
): string;
```

Stay22 affiliate program is added as the **13th entry** in `data/affiliateLinks.ts`, following the prebuilt-link pattern already used for Southwest.

### 4.4 Market trends — `data/realEstateTrends.ts` (new) + Supabase table

Static module exports neighborhood ↔ Redfin region mapping.

```ts
export const NEIGHBORHOOD_REDFIN_REGIONS: Record<NeighborhoodSlug, {
  redfinRegionId: string;                   // Redfin's internal region ID
  zipCodes: readonly string[];              // 29926 / 29928 / 29938 subset
  blurb: string;                            // 1-sentence interpretation guide
}>;
```

Supabase migration: `supabase/migrations/013_market_trends.sql`

```sql
create table if not exists market_trends (
  id uuid primary key default gen_random_uuid(),
  neighborhood_slug text not null,
  month date not null,
  median_sale_price numeric,
  median_ppsf numeric,
  median_dom integer,
  homes_sold integer,
  yoy_pct numeric,
  source text not null default 'redfin-data-center',
  source_url text,
  fetched_at timestamptz not null default now(),
  unique (neighborhood_slug, month)
);

alter table market_trends enable row level security;

create policy "Anyone can read market trends"
  on market_trends for select using (true);

create policy "Only admins can write market trends"
  on market_trends for all using (is_admin()) with check (is_admin());
```

Numbering note: latest existing migration is `012_directory_events.sql` per `CLAUDE.md`. `013` is the next clean number.

### 4.5 Refresh cron — `app/api/cron/refresh-market-data/route.ts` (new)

- Vercel cron, monthly (e.g. 1st of month, 06:00 UTC)
- Pulls Redfin's regional CSV for each `redfinRegionId`
- Parses → upserts into `market_trends` keyed on `(neighborhood_slug, month)`
- Uses `createServiceClient()` (service role) per project convention
- Bearer-secret gated via `CRON_SECRET` env, same pattern as existing crons
- Logs failures to a Supabase `cron_runs` table (or extends existing logging if present)

### 4.6 Realtor partner + inquiry pipeline

- `data/realEstatePartner.ts` (new) — single-export module, like `data/founder.ts`. Fields: name, headshot, brokerage, license #, bio, intake email, optional Calendly URL. **Owner-blocker:** partner identity must be supplied before launch; page renders generic copy otherwise.
- Supabase migration: new sibling `supabase/migrations/014_real_estate_inquiries.sql` for the inquiry table:

```sql
create table if not exists real_estate_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  neighborhood_slug text,
  name text not null,
  email text not null,
  phone text,
  message text,
  intent text,                              -- 'buying' | 'selling' | 'both' | 'browsing'
  source_url text,
  ip_hash text                              -- SHA-256 like directory_events
);

alter table real_estate_inquiries enable row level security;

create policy "Anonymous can insert inquiries"
  on real_estate_inquiries for insert with check (true);

create policy "No anon read"
  on real_estate_inquiries for select using (false);
```

Mirrors the `itinerary_requests` pattern: anon insert, admin-only read via service role.

- `app/api/real-estate-inquiry/route.ts` (new) — POST handler. Inserts row, emails partner via Resend (using `RESEND_FROM_EMAIL` + new `REAL_ESTATE_PARTNER_EMAIL` env), responds 200 on success. Same shape as existing `app/api/itinerary/route.ts`.

## 5. UI components

All new components live in `components/rentals/` and `components/real-estate/`.

### 5.1 `components/rentals/`

| Component | Role | Server/Client |
|---|---|---|
| `RentalCard.tsx` | Single property card | Server |
| `RentalGrid.tsx` | Responsive grid of `RentalCard` | Server |
| `RentalCarousel.tsx` | 3-8 photo carousel inside a card | Client |
| `Stay22Map.tsx` | Stay22 Interactive Map embed wrapper | Client |
| `BestForLinkRow.tsx` | "Best for…" pre-filtered Stay22 deeplinks | Server |
| `RentalsHero.tsx` | Hero w/ image + h1 + tldr | Server |

### 5.2 `components/real-estate/`

| Component | Role | Server/Client |
|---|---|---|
| `MarketHeatMap.tsx` | Mapbox-rendered polygon heatmap, colored by median price tier | Client |
| `TrendChart.tsx` | Recharts line + bar (median price 24-mo, DOM 12-mo) | Client |
| `MarketStatsCard.tsx` | The 4-stat card (median, $/sqft, DOM, YoY%) | Server |
| `RealtorReferralForm.tsx` | Inquiry form → `/api/real-estate-inquiry` | Client |
| `RealtorBio.tsx` | Partner-Realtor bio block | Server |

### 5.3 Page composition

Each `/vacation-rentals/[slug]` page renders, top-to-bottom:

1. `<Breadcrumbs>` (existing component)
2. `<RentalsHero>` — neighborhood photo + h1 + 1-sentence positioning
3. `<TldrBlock>` (existing) — Speakable selector
4. `<RentalGrid>` — ~6 cards initially
5. `<BestForLinkRow>` — 3-5 pre-filtered Stay22 deeplinks
6. `<Stay22Map>` — full-width interactive map, neighborhood-scoped
7. Editorial deep dive (`vibe`, `whoFor`, `beachAccess`, `topAmenities` rendered as sections)
8. `<QuickFact>` blocks (existing) — 2-3 citable factoids
9. Real-estate section:
    - `<MarketStatsCard>` (4 stats)
    - `<MarketHeatMap>` + `<TrendChart>` (×2)
    - `<RealtorBio>` + `<RealtorReferralForm>`
10. FAQ — uses `faq-answer` class (Speakable contract)
11. Cross-link footer: previous/next neighborhood + back-to-hub

Hub page `/vacation-rentals` renders:

1. `<Breadcrumbs>`
2. `<RentalsHero>` (full-island)
3. `<TldrBlock>` (full-island positioning)
4. Neighborhood comparison grid — 6 cards, each: hero image, name, 1-sentence pitch, median-rate band, link to `/vacation-rentals/[slug]`
5. `<RentalGrid>` — top 12 cards across the island
6. `<Stay22Map>` — full-island zoom
7. Island-wide FAQ
8. Footer cross-links

### 5.4 Card visual contract (`RentalCard`)

```
┌─────────────────────────────┐
│ [Photo carousel, 16:10]     │
├─────────────────────────────┤
│ Title                       │
│ 3 BR · 2 BA · 1,400 sqft    │ ← sqft only when present
│ $450-650 / night summer     │
│ ★ 4.8 (124 reviews)         │ ← shown only when present
│ [chip] [chip] [chip] [chip] │
│ Editorial note (italic)     │
│ [View on Booking →]         │ ← rel="sponsored noopener", new tab
└─────────────────────────────┘
```

## 6. Schema / JSON-LD

All emitted via `app/lib/metadata.ts` helpers — no inline schema.

| Page | Schema |
|---|---|
| `/vacation-rentals` (hub) | `Breadcrumbs`, `FAQPage`, `ItemList` (the 6 neighborhood cards) |
| `/vacation-rentals/[slug]` | `Breadcrumbs`, `Place` (neighborhood polygon), `FAQPage`, `ItemList` (the catalog cards), one `LodgingBusiness` per card via `getLodgingBusinessSchema`, `Speakable` (selectors `.faq-answer`, `.tldr-block`) |

If `getLodgingBusinessSchema` does not yet exist (per `CLAUDE.md` it does), extend `app/lib/metadata.ts` — do not write JSON-LD inline anywhere.

## 7. SEO + LLM-citation

- Per-page metadata via existing `generatePageMetadata`
- Target queries: `[neighborhood] vacation rentals hilton head`, `[neighborhood] villas`, `[neighborhood] real estate trends`, `[neighborhood] home values`
- `<TldrBlock>` (`.tldr-block`) on every page — Speakable selector contract
- 2-3 `<QuickFact>` blocks per page
- `faq-answer` selectors on all FAQ answers
- Re-sync `public/llms.txt` and `public/llms-full.txt` after launch (manual, per `CLAUDE.md`)

## 8. Affiliate disclosure + FTC

- A single in-page disclosure line ("We may earn commission from bookings made through these links — at no extra cost to you") appears once near the first `RentalCard` and once near `BestForLinkRow`
- All outbound affiliate links use `rel="sponsored noopener"` and `target="_blank"`
- Realtor referral CTA has a distinct "Referral disclosure" line ("If you connect with our Realtor partner and complete a transaction, we may receive a referral fee — your costs are unaffected.")

## 9. Environment variables (`.env.example` additions)

```
STAY22_AFFILIATE_ID=             # from Stay22 dashboard, free signup
MAPBOX_PUBLIC_TOKEN=             # free tier, ≤ 50k MAU
REDFIN_DATA_BASE_URL=https://redfin-public-data.s3.us-west-2.amazonaws.com/redfin_market_tracker
CRON_SECRET=                     # shared with existing cron handlers
REAL_ESTATE_PARTNER_EMAIL=       # partner Realtor intake
```

## 10. Testing

- Playwright smoke (`tests/vacation-rentals.spec.ts`):
    - Hub page renders, ≥ 6 rental cards visible, Stay22 map iframe present
    - Sea Pines neighborhood page renders, ≥ 4 cards, market-trends section visible, referral form submits to a 200 endpoint (mock or stub)
    - Nav contains "Vacation Rentals" with correct child list
- `npm run typecheck` and `npm run lint` pass with zero new errors
- No unit-test runner exists in repo — Playwright is the verification surface

## 11. Scope — in / out

### In (v1)

- 1 hub page + 6 neighborhood pages
- Curated catalog: 6 properties per neighborhood (36 total)
- Stay22 free Map widget embedded per page
- "Best for" pre-filtered deeplinks (3-5 per neighborhood)
- Mapbox heatmap + 2 trend charts per neighborhood
- Single Realtor-partner referral form
- Redfin Data Center monthly refresh cron
- Schema, sitemap, footer, nav, env updates

### Out (deferred)

- Stay22 Enterprise / Roam API ("native cards from live data") — owner pursuing outreach in parallel; design is forward-compatible
- Multi-Realtor referral routing
- In-page booking (always punts to partner site)
- User accounts / saved searches
- Individual real-estate listings or per-transaction pins
- Multi-language
- A/B testing infrastructure on the new pages
- Per-card click tracking → buyer-intent table (separately reasonable to add later; not v1)

## 12. Open items + blockers

| Item | Owner | Blocks |
|---|---|---|
| Partner Realtor identity + intake email | Owner (William) | `RealtorBio` + Resend integration; v1 launch |
| Stay22 affiliate ID | Owner — signup at stay22.com | Map widget embed; `Stay22_AFFILIATE_ID` env |
| Mapbox public token | Owner — free signup | `MarketHeatMap` rendering |
| Stay22 Roam/Enterprise API confirmation | Owner outreach | Future native-card swap — does **not** block v1 |
| 36 curated property listings (data + photos) | Owner / curation pass | Catalog population — can launch with fewer if needed |
| Redfin region IDs for HHI neighborhoods | Engineering investigation during plan phase | Cron job; trend data |

## 13. Acceptance criteria

A v1 launch is acceptable when:

1. The "Vacation Rentals" top-level nav item exists and links to `/vacation-rentals`
2. The hub page and all 6 neighborhood pages return HTTP 200 with valid metadata, schema, and breadcrumbs
3. At least 3 catalog rentals are visible on each neighborhood page (degraded acceptance if 6 photo sets aren't ready)
4. The Stay22 Map widget loads and renders pins for each neighborhood
5. The Mapbox heatmap renders for each neighborhood with at least one month of Redfin data populated
6. The Realtor referral form successfully POSTs and inserts into `real_estate_inquiries`
7. The partner Realtor receives an email when a form submits (verified in their inbox during smoke test)
8. Playwright smoke passes
9. `npm run typecheck` and `npm run lint` pass with zero new errors
10. FTC disclosures + `rel="sponsored noopener"` present on every affiliate CTA
11. `public/llms.txt` and `public/llms-full.txt` re-synced to reference the new surface

## 14. Risks

| Risk | Mitigation |
|---|---|
| Curated catalog drifts stale (prices, availability) | Editorial note explicitly says "starting from" not a guarantee; price bands not exact prices; quarterly refresh task added to internal calendar |
| Photo licensing exposure | Only own assets in `/public/rentals/...`; permission-granted assets noted in a `LICENSING.md` per neighborhood photo set; no hotlinking |
| Stay22 free tier changes / disappears | Map widget is a self-contained component; if disabled, page degrades gracefully; revisit Roam/Enterprise tier or pivot to Booking.com Affiliate API |
| Redfin Data Center CSV schema changes | Cron logs failures and skips the run rather than corrupting prior data; manual reconciliation if schema changes |
| Realtor partnership dispute / churn | Single env var swap (`REAL_ESTATE_PARTNER_EMAIL`) + `data/realEstatePartner.ts` edit; no architectural lock-in |
| Mixing rental and real-estate intents dilutes the page's SEO focus | Rental content above the fold owns the page's primary intent; real-estate section is visually distinct and below the fold |

---

## Appendix A — File inventory

**New files:**

- `app/vacation-rentals/page.tsx`
- `app/vacation-rentals/[slug]/page.tsx`
- `app/api/real-estate-inquiry/route.ts`
- `app/api/cron/refresh-market-data/route.ts`
- `app/lib/stay22.ts`
- `data/rentalsCatalog.ts`
- `data/vacationRentals.ts`
- `data/realEstateTrends.ts`
- `data/realEstatePartner.ts`
- `components/rentals/RentalCard.tsx`
- `components/rentals/RentalGrid.tsx`
- `components/rentals/RentalCarousel.tsx`
- `components/rentals/Stay22Map.tsx`
- `components/rentals/BestForLinkRow.tsx`
- `components/rentals/RentalsHero.tsx`
- `components/real-estate/MarketHeatMap.tsx`
- `components/real-estate/TrendChart.tsx`
- `components/real-estate/MarketStatsCard.tsx`
- `components/real-estate/RealtorReferralForm.tsx`
- `components/real-estate/RealtorBio.tsx`
- `supabase/migrations/013_market_trends.sql`
- `supabase/migrations/014_real_estate_inquiries.sql`
- `tests/vacation-rentals.spec.ts`
- `public/rentals/...` — photo assets (6 properties × 6 neighborhoods × 3-8 photos)

**Modified files:**

- `data/nav.ts` — top-level "Vacation Rentals" item
- `data/footerLinks.ts` — Vacation Rentals section
- `data/affiliateLinks.ts` — Stay22 as program #13
- `app/sitemap.ts` — 7 new URLs
- `app/lib/metadata.ts` — extend if any helper missing
- `public/llms.txt`, `public/llms-full.txt` — re-sync after launch
- `.env.example` — new vars

## Appendix B — Decision audit trail

The brainstorming session resolved six gating questions:

1. **Data source** → Affiliate widgets (vs. partner feeds / paid aggregator / scraping)
2. **Page feel** → Live API feed (originally), pivoted to **curated cards + Stay22 free map** after verification of Stay22's current public products
3. **Feed provider** → Stay22 multi-source (vs. Booking-only API / EPS / multi-source hybrid)
4. **Routes + nav** → Top-level tab + 6 neighborhood sub-pages (vs. hub only / replace existing / hub + neighborhoods + use-case pages)
5. **Real estate scope** → Neighborhood market trends (vs. partner-Realtor IDX / ATTOM / county scrape)
6. **Real estate conversion** → Partner-agent referral (vs. informational only / email capture / both)
7. **Cards approach (challenge round)** → Curated catalog (owner's call, vs. the lean "map-only" challenger)
