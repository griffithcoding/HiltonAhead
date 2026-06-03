# Vacation Rentals Hub + Per-Neighborhood Real Estate Trends — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a top-level `/vacation-rentals` hub + 6 neighborhood sub-pages that display curated rental listings (photos, price band, beds/baths/sqft, amenities, reviews) with an embedded Stay22 affiliate map, plus a per-neighborhood real estate market-trends section (price-tier map + charts) that captures referral leads to a single partner Realtor.

**Architecture:** New App Router routes under `app/vacation-rentals/` reuse one page template for hub + neighborhood modes. Rental cards come from a hand-maintained `data/rentalsCatalog.ts` (card shape forward-compatible with a future live API). Stay22 map + affiliate deeplinks via a thin `app/lib/stay22.ts` helper. Real estate trends are sourced free from Redfin Data Center CSVs via a monthly cron into a new Supabase `market_trends` table, rendered as a Mapbox price-tier map + Recharts charts, with a referral form POSTing to a new `real_estate_inquiries` table (anon-insert, admin-read) and emailing the partner via Resend.

**Tech Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript strict · Tailwind 4 · Supabase (`@supabase/ssr` + service role) · Resend · `mapbox-gl@^3` · `recharts@^3` · `papaparse@^5` · Playwright.

---

## Verification model (read first)

This repo has **no unit-test runner** (`CLAUDE.md`: "There is no unit-test runner configured"). The only configured test surface is **Playwright** (`tests/`). Strict per-function unit TDD is therefore replaced by:

1. **Type gate** — `npm run typecheck` after every code task. A failing compile is the "red".
2. **Lint gate** — `npm run lint` before each commit.
3. **Integration tests** — Playwright specs that render the real pages and assert DOM/behavior (incl. affiliate deeplink hrefs, form submit). These are written **before** wiring where the page can be rendered, and serve as the acceptance "red→green".
4. **Build gate** — `npm run build` once per phase to catch RSC/client-boundary errors Turbopack dev hides.

Each task ends with a commit. Branch: `feat/vacation-rentals-hub` (per `CLAUDE.md`: no worktrees, 1–2 branches named after the task).

**Pre-flight (run once, do not commit anything yet):**

```bash
git checkout -b feat/vacation-rentals-hub
git status   # expect clean tree apart from the committed spec + this plan
```

---

# PHASE A — Vacation Rentals Surface

Phase A produces a working, shippable rentals site on its own. Phase B bolts onto A's neighborhood pages.

---

### Task A0: Dependencies + environment variables

**Files:**
- Modify: `package.json` (via npm, do not hand-edit)
- Modify: `.env.example`

- [ ] **Step 1: Install runtime + dev dependencies**

```bash
npm install mapbox-gl@^3 recharts@^3 papaparse@^5
npm install -D @types/papaparse@^5
```

Rationale: `mapbox-gl` (Phase B price-tier map), `recharts` v3 (React-19-compatible charts), `papaparse` (Phase B Redfin CSV parsing). `react-map-gl` is intentionally NOT used — we call `mapbox-gl` directly to avoid peer-dep friction with React 19.

- [ ] **Step 2: Verify install + types resolve**

Run: `npm run typecheck`
Expected: PASS (no new errors; new deps unused so far is fine).

- [ ] **Step 3: Add env vars to `.env.example`**

Append:

```bash
# ── Vacation Rentals (Stay22) ──────────────────────────────────────────────
# Stay22 affiliate ID. PUBLIC by nature — it's embedded in client-side map
# iframes and outbound affiliate links. Get it from the Stay22 dashboard
# after free signup at stay22.com.
NEXT_PUBLIC_STAY22_AID=

# ── Real Estate Trends (Phase B) ───────────────────────────────────────────
# Mapbox public token (pk.*). Client-exposed by design. Free tier ≤ 50k MAU.
NEXT_PUBLIC_MAPBOX_TOKEN=

# Base URL for Redfin Data Center regional market CSVs (free, attribution
# required). Used by the monthly refresh cron only (server-side).
REDFIN_DATA_BASE_URL=https://redfin-public-data.s3.us-west-2.amazonaws.com/redfin_market_tracker

# Partner Realtor intake inbox — receives real-estate referral form submissions.
REAL_ESTATE_PARTNER_EMAIL=
# CRON_SECRET already exists (shared with existing cron handlers) — reused here.
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "build: add mapbox-gl, recharts, papaparse + vacation-rentals/real-estate env vars"
```

---

### Task A1: Rental catalog data module

**Files:**
- Create: `data/rentalsCatalog.ts`
- Test: `tests/rentals-catalog.spec.ts`

- [ ] **Step 1: Write the failing Playwright test (pure-module assertions)**

Playwright test files run in Node and can import TS modules. Use a **relative import** (not the `@/` alias) so resolution never depends on Playwright tsconfig-paths support.

`tests/rentals-catalog.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import {
  rentalsCatalog,
  rentalsByNeighborhood,
  allRentals,
  RENTAL_NEIGHBORHOODS,
} from '../data/rentalsCatalog';

test.describe('rentalsCatalog data module', () => {
  test('exposes the 6 neighborhood slugs', () => {
    expect(RENTAL_NEIGHBORHOODS).toEqual([
      'sea-pines',
      'palmetto-dunes',
      'forest-beach',
      'shelter-cove',
      'port-royal',
      'mid-island',
    ]);
  });

  test('every catalog entry has required fields and a valid neighborhood', () => {
    expect(rentalsCatalog.length).toBeGreaterThan(0);
    for (const r of rentalsCatalog) {
      expect(r.id, `id missing on ${JSON.stringify(r)}`).toBeTruthy();
      expect(RENTAL_NEIGHBORHOODS).toContain(r.neighborhood);
      expect(r.photoUrls.length).toBeGreaterThanOrEqual(1);
      expect(r.beds).toBeGreaterThanOrEqual(0);
      expect(r.baths).toBeGreaterThanOrEqual(0);
      expect(r.bookingDeeplink).toMatch(/^https?:\/\//);
      expect(r.pricePerNightBand).toBeTruthy();
    }
  });

  test('ids are unique', () => {
    const ids = rentalsCatalog.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('rentalsByNeighborhood filters correctly', () => {
    const sp = rentalsByNeighborhood('sea-pines');
    expect(sp.every((r) => r.neighborhood === 'sea-pines')).toBe(true);
  });

  test('allRentals returns the full set', () => {
    expect(allRentals().length).toBe(rentalsCatalog.length);
  });
});
```

- [ ] **Step 2: Run it to verify failure**

Run: `npx playwright test tests/rentals-catalog.spec.ts --project=chromium`
Expected: FAIL — "Cannot find module '../data/rentalsCatalog'".

- [ ] **Step 3: Create `data/rentalsCatalog.ts` with types, helpers, and seed data**

```ts
/**
 * Curated vacation-rental catalog for /vacation-rentals.
 *
 * Hand-maintained — NOT fetched from an API. Each entry is an editor's pick
 * linked out to a partner site via an affiliate-stamped deeplink.
 *
 * CARD-SHAPE STABILITY IS A HARD REQUIREMENT. If/when a live API (Stay22
 * Enterprise/Roam, Booking.com Affiliate API) replaces this module, it MUST
 * return objects matching `CatalogRental` so RentalCard/RentalGrid don't change.
 *
 * PHOTOS: host in /public/rentals/<neighborhood>/<id>-<n>.jpg. Do NOT hotlink
 * Airbnb/Booking/VRBO image URLs (TOS exposure). See public/rentals/LICENSING.md.
 *
 * PRICING: use bands ("$450–650 / night summer"), never a hard nightly rate —
 * we don't control live pricing and bands age gracefully.
 */

export type RentalSource = 'booking' | 'vrbo' | 'airbnb' | 'hotels' | 'direct';

export type RentalNeighborhoodSlug =
  | 'sea-pines'
  | 'palmetto-dunes'
  | 'forest-beach'
  | 'shelter-cove'
  | 'port-royal'
  | 'mid-island';

export const RENTAL_NEIGHBORHOODS: readonly RentalNeighborhoodSlug[] = [
  'sea-pines',
  'palmetto-dunes',
  'forest-beach',
  'shelter-cove',
  'port-royal',
  'mid-island',
] as const;

export type CatalogRental = {
  /** Stable unique id, e.g. 'sp-south-beach-villa-1'. Used in URLs/anchors. */
  readonly id: string;
  readonly neighborhood: RentalNeighborhoodSlug;
  /** Headline, e.g. "3BR Oceanfront Villa, South Beach". */
  readonly title: string;
  /** 1–8 photos hosted under /public/rentals/... (leading slash). */
  readonly photoUrls: ReadonlyArray<string>;
  readonly beds: number;
  readonly baths: number;
  /** Optional — omit when unknown. Most aggregators don't expose sqft. */
  readonly sqft?: number;
  /** Human price band, e.g. "$450–650 / night summer · $250–400 shoulder". */
  readonly pricePerNightBand: string;
  /** Short amenity chips, e.g. ['Private pool', 'Beachfront', 'Golf cart']. */
  readonly amenities: ReadonlyArray<string>;
  /** Optional star rating 0–5 and review count, shown only when present. */
  readonly rating?: number;
  readonly reviewCount?: number;
  /** Affiliate-stamped outbound URL (pass through withStay22Params at render). */
  readonly bookingDeeplink: string;
  readonly source: RentalSource;
  /** 1–2 sentences: why we picked it. Editorial voice. */
  readonly editorialNote: string;
};

/**
 * SEED DATA — 6 representative entries to ship a non-empty grid. Expand to
 * ~6 per neighborhood (36 total) during the curation pass (owner task, tracked
 * in the spec's open-items table). Replace placeholder photoUrls with real
 * hosted assets and real partner deeplinks before launch.
 */
export const rentalsCatalog: ReadonlyArray<CatalogRental> = [
  {
    id: 'sp-south-beach-villa-1',
    neighborhood: 'sea-pines',
    title: '3BR Oceanfront Villa · South Beach Lane',
    photoUrls: ['/rentals/sea-pines/sp-south-beach-villa-1-1.jpg'],
    beds: 3,
    baths: 2,
    pricePerNightBand: '$520–780 / night summer · $290–420 shoulder',
    amenities: ['Oceanfront', 'Shared pool', 'Bikes included', '90 sec to sand'],
    rating: 4.8,
    reviewCount: 124,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Sea+Pines+Hilton+Head',
    source: 'booking',
    editorialNote:
      'Our most-booked South Beach pocket — short walk to the sand and an easy bike to Harbour Town.',
  },
  {
    id: 'pd-shelter-cove-condo-1',
    neighborhood: 'palmetto-dunes',
    title: '2BR Lagoon-View Condo · Palmetto Dunes',
    photoUrls: ['/rentals/palmetto-dunes/pd-shelter-cove-condo-1-1.jpg'],
    beds: 2,
    baths: 2,
    pricePerNightBand: '$310–460 / night summer · $190–280 shoulder',
    amenities: ['Lagoon view', 'Resort pool', 'Tennis', 'Free trolley'],
    rating: 4.7,
    reviewCount: 88,
    bookingDeeplink: 'https://www.vrbo.com/search?destination=Palmetto+Dunes+Hilton+Head',
    source: 'vrbo',
    editorialNote:
      'Best value for families who want the resort amenities without the oceanfront premium.',
  },
  {
    id: 'fb-coligny-flat-1',
    neighborhood: 'forest-beach',
    title: '1BR Walk-to-Coligny Flat',
    photoUrls: ['/rentals/forest-beach/fb-coligny-flat-1-1.jpg'],
    beds: 1,
    baths: 1,
    pricePerNightBand: '$220–340 / night summer · $140–210 shoulder',
    amenities: ['Walk to Coligny', '3 min to beach', 'Pool'],
    rating: 4.6,
    reviewCount: 53,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Forest+Beach+Hilton+Head',
    source: 'booking',
    editorialNote: 'Park the car once — Coligny shops, dining, and the beach are all on foot.',
  },
  {
    id: 'sc-marina-condo-1',
    neighborhood: 'shelter-cove',
    title: '2BR Marina-Front Condo · Shelter Cove',
    photoUrls: ['/rentals/shelter-cove/sc-marina-condo-1-1.jpg'],
    beds: 2,
    baths: 2,
    pricePerNightBand: '$280–420 / night summer · $170–260 shoulder',
    amenities: ['Marina view', 'Pool', 'Walk to Harbourfest'],
    rating: 4.5,
    reviewCount: 41,
    bookingDeeplink: 'https://www.vrbo.com/search?destination=Shelter+Cove+Hilton+Head',
    source: 'vrbo',
    editorialNote: 'Front-row seat to the Tuesday Harbourfest fireworks all summer.',
  },
  {
    id: 'pr-sound-home-1',
    neighborhood: 'port-royal',
    title: '4BR Sound-Side Home · Port Royal',
    photoUrls: ['/rentals/port-royal/pr-sound-home-1-1.jpg'],
    beds: 4,
    baths: 3,
    sqft: 2400,
    pricePerNightBand: '$480–690 / night summer · $300–430 shoulder',
    amenities: ['Private pool', 'Gated', 'Tennis', 'Quiet'],
    rating: 4.7,
    reviewCount: 36,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Port+Royal+Hilton+Head',
    source: 'booking',
    editorialNote: 'Roomy, gated, and quiet — our pick for multi-gen groups who want a pool.',
  },
  {
    id: 'mi-mid-island-villa-1',
    neighborhood: 'mid-island',
    title: '3BR Villa near Folly Field',
    photoUrls: ['/rentals/mid-island/mi-mid-island-villa-1-1.jpg'],
    beds: 3,
    baths: 2,
    pricePerNightBand: '$300–450 / night summer · $180–270 shoulder',
    amenities: ['Walk to Folly Field beach', 'Pool', 'Central location'],
    rating: 4.4,
    reviewCount: 29,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Hilton+Head+Island',
    source: 'booking',
    editorialNote: 'Central base camp — short drive to everything, Folly Field beach on foot.',
  },
];

export function rentalsByNeighborhood(
  slug: RentalNeighborhoodSlug,
): CatalogRental[] {
  return rentalsCatalog.filter((r) => r.neighborhood === slug);
}

export function allRentals(): CatalogRental[] {
  return [...rentalsCatalog];
}
```

- [ ] **Step 4: Create the photo licensing note**

`public/rentals/LICENSING.md`:

```md
# Rental photo licensing

Every image under `public/rentals/**` MUST be one of:
- Shot by Hilton Ahead, or
- Used with written permission from the property owner / manager (record the grant below), or
- A properly licensed stock asset.

NEVER hotlink or copy Airbnb / Booking.com / VRBO listing photos — it violates
their TOS and creates copyright exposure.

| File | Source | Permission / license | Date |
|------|--------|----------------------|------|
| (example) sea-pines/sp-south-beach-villa-1-1.jpg | Owner-supplied | Email grant from owner 2026-06-01 | 2026-06-01 |
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/rentals-catalog.spec.ts --project=chromium`
Expected: PASS (5 tests).

- [ ] **Step 6: Typecheck + commit**

```bash
npm run typecheck
git add data/rentalsCatalog.ts public/rentals/LICENSING.md tests/rentals-catalog.spec.ts
git commit -m "feat(rentals): add curated rental catalog data module + tests"
```

---

### Task A2: Neighborhood editorial data module

**Files:**
- Create: `data/vacationRentals.ts`
- Test: `tests/rentals-editorial.spec.ts`

This module derives geofence centers from the existing `data/neighborhoods.ts` (`latitude`/`longitude` confirmed present for all 6 slugs) and adds rental-specific editorial. It is NOT a placeholder: a full worked entry is given for `sea-pines`; the other 5 follow the identical structure with content adapted from each neighborhood's existing `hook`/`reasons`/`bestFor`/`properties` in `data/neighborhoods.ts`.

- [ ] **Step 1: Write the failing test**

`tests/rentals-editorial.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import { rentalAreas, getRentalArea } from '../data/vacationRentals';
import { RENTAL_NEIGHBORHOODS } from '../data/rentalsCatalog';

test.describe('vacationRentals editorial module', () => {
  test('has an entry for every neighborhood slug', () => {
    for (const slug of RENTAL_NEIGHBORHOODS) {
      const area = getRentalArea(slug);
      expect(area, `missing area for ${slug}`).toBeTruthy();
      expect(area!.geofence.center.lat).toBeGreaterThan(31);
      expect(area!.geofence.center.lat).toBeLessThan(33);
      expect(area!.tldr.length).toBeLessThanOrEqual(280);
      expect(area!.faq.length).toBeGreaterThanOrEqual(2);
      expect(area!.bestForLinks.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('rentalAreas keys match RENTAL_NEIGHBORHOODS', () => {
    expect(Object.keys(rentalAreas).sort()).toEqual(
      [...RENTAL_NEIGHBORHOODS].sort(),
    );
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx playwright test tests/rentals-editorial.spec.ts --project=chromium`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `data/vacationRentals.ts`**

```ts
/**
 * Rental-specific editorial per neighborhood for /vacation-rentals/[slug].
 *
 * Geofence centers are the canonical lat/lng from data/neighborhoods.ts.
 * Keep the two in sync — if a neighborhood center changes there, change it here.
 *
 * `bestForLinks` produce Stay22 search deeplinks (see app/lib/stay22.ts). Each
 * param object is merged into the Stay22 query string by stay22SearchDeeplink().
 */

import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export type RentalAreaContent = {
  readonly slug: RentalNeighborhoodSlug;
  readonly name: string;
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly heroImage: { readonly src: string; readonly alt: string };
  readonly geofence: {
    readonly center: { readonly lat: number; readonly lng: number };
    readonly zoom: number;
  };
  /** ≤ 280 chars; rendered in <TldrBlock> (Speakable selector .tldr-block). */
  readonly tldr: string;
  readonly vibe: string;
  readonly whoFor: ReadonlyArray<string>;
  readonly beachAccess: string;
  readonly topAmenities: ReadonlyArray<string>;
  readonly quickFacts: ReadonlyArray<{ readonly label: string; readonly value: string }>;
  readonly bestForLinks: ReadonlyArray<{
    readonly label: string;
    readonly params: Record<string, string | number>;
  }>;
  readonly faq: ReadonlyArray<{ readonly question: string; readonly answer: string }>;
};

const seaPines: RentalAreaContent = {
  slug: 'sea-pines',
  name: 'Sea Pines',
  seoTitle: 'Sea Pines Vacation Rentals — Villas & Homes (2026) | Hilton Ahead',
  metaDescription:
    'Browse curated Sea Pines vacation rentals on Hilton Head: oceanfront villas, walkable South Beach condos, and golf homes — with a live map, price bands, and local picks.',
  h1: 'Sea Pines Vacation Rentals',
  heroImage: { src: '/rentals/sea-pines/hero.jpg', alt: 'Sea Pines oceanfront villas at golden hour' },
  geofence: { center: { lat: 32.134, lng: -80.808 }, zoom: 13 },
  tldr:
    "Sea Pines is the island's iconic 5,200-acre gated original. Expect roughly $300–800/night in summer; most South Beach villas are a 90-second walk to sand and an easy bike to Harbour Town.",
  vibe:
    'The postcard Hilton Head: Harbour Town lighthouse, the Liberty Oak, three resort courses, and 17 miles of bike path. Premium address, best walkable oceanfront on the island.',
  whoFor: [
    'Couples & first-time visitors',
    'Golf trips (Harbour Town access)',
    'Multi-generational family reunions',
    'Anniversaries & proposals',
  ],
  beachAccess:
    'South Beach Lane villas sit ~90 seconds from the sand. Most interior villas are a 5–10 minute bike ride to the nearest beach access.',
  topAmenities: ['Gated entry', 'Resort pools', 'Bike paths', 'On-property golf'],
  quickFacts: [
    { label: 'Summer nightly range (3BR)', value: '$500–800' },
    { label: 'Walk to beach (South Beach)', value: '~90 seconds' },
    { label: 'Gate-in traffic', value: '10am–12pm summer' },
  ],
  bestForLinks: [
    { label: 'Oceanfront villas', params: { rooms: 1, query: 'oceanfront' } },
    { label: 'Family-friendly (kids)', params: { adults: 2, children: 2 } },
    { label: 'Golf trips (4+)', params: { adults: 4 } },
    { label: 'Pet-friendly', params: { query: 'pet friendly' } },
  ],
  faq: [
    {
      question: 'Is there a gate fee to enter Sea Pines?',
      answer:
        'Sea Pines charges a daily vehicle pass for non-guests, but it is waived or included for most overnight rental guests. Confirm with your specific property before arrival.',
    },
    {
      question: 'How far is Sea Pines from the beach?',
      answer:
        'South Beach Lane villas are about a 90-second walk to the sand. Interior villas are typically a 5–10 minute bike ride to the nearest of several beach accesses.',
    },
    {
      question: 'When should I book a Sea Pines rental for summer?',
      answer:
        'The best South Beach villas book 6–9 months out for June–August. Shoulder season (April–May, September–October) opens up 2–3 months ahead at noticeably lower rates.',
    },
  ],
};

/**
 * Remaining 5 areas. Centers are the canonical lat/lng from
 * data/neighborhoods.ts. Editorial is adapted from each neighborhood's existing
 * `hook` / `reasons` / `bestFor` / `tradeoffs` / `properties` in that file —
 * keep the voice consistent with seaPines above. Fill `heroImage.src` with a
 * real hosted asset before launch (see public/rentals/LICENSING.md).
 */
const palmettoDunes: RentalAreaContent = {
  slug: 'palmetto-dunes',
  name: 'Palmetto Dunes',
  seoTitle: 'Palmetto Dunes Vacation Rentals — Villas & Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Palmetto Dunes vacation rentals on Hilton Head: lagoon-view condos, oceanfront villas, three golf courses, and the free resort trolley — with a live map and price bands.',
  h1: 'Palmetto Dunes Vacation Rentals',
  heroImage: { src: '/rentals/palmetto-dunes/hero.jpg', alt: 'Palmetto Dunes lagoon and villas' },
  geofence: { center: { lat: 32.181, lng: -80.738 }, zoom: 13 },
  tldr:
    'Palmetto Dunes is the family-and-golf resort core: three courses, an 11-mile lagoon for kayaking, and a free trolley. Summer rentals run roughly $300–700/night.',
  vibe:
    'Mid-island resort living built for families and golfers. Oceanfront to lagoon-side, with the most self-contained amenity set on the island.',
  whoFor: ['Families with kids', 'Golf groups', 'Watersports lovers', 'Resort-amenity seekers'],
  beachAccess:
    'Oceanfront villas open onto the sand; lagoon-side condos are a short shuttle or bike ride to the beach.',
  topAmenities: ['3 golf courses', '11-mile lagoon', 'Free trolley', 'Tennis & pickleball'],
  quickFacts: [
    { label: 'Summer nightly range (2BR)', value: '$300–500' },
    { label: 'Golf courses on-property', value: '3' },
    { label: 'Lagoon length', value: '11 miles' },
  ],
  bestForLinks: [
    { label: 'Oceanfront villas', params: { query: 'oceanfront' } },
    { label: 'Family condos', params: { adults: 2, children: 2 } },
    { label: 'Golf groups (4+)', params: { adults: 4 } },
    { label: 'Lagoon view', params: { query: 'lagoon' } },
  ],
  faq: [
    {
      question: 'Does Palmetto Dunes have a free shuttle?',
      answer:
        'Yes — a complimentary trolley loops the resort in season, connecting villas, the beach, and dining so you can leave the car parked.',
    },
    {
      question: 'Is Palmetto Dunes good for non-golfers?',
      answer:
        'Very. The 11-mile lagoon system is ideal for kayaking and fishing, and the beach and pools draw families who never pick up a club.',
    },
  ],
};

const forestBeach: RentalAreaContent = {
  slug: 'forest-beach',
  name: 'Forest Beach',
  seoTitle: 'Forest Beach Vacation Rentals — Walk-to-Coligny Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Forest Beach vacation rentals: walk-to-Coligny condos and beach flats on Hilton Head, with a live map, price bands, and local picks. The most walkable beach pocket.',
  h1: 'Forest Beach Vacation Rentals',
  heroImage: { src: '/rentals/forest-beach/hero.jpg', alt: 'Forest Beach near Coligny Plaza' },
  geofence: { center: { lat: 32.158, lng: -80.756 }, zoom: 14 },
  tldr:
    'Forest Beach is the walkable beach pocket beside Coligny Plaza — shops, dining, and sand all on foot. Summer condos run roughly $200–450/night.',
  vibe:
    'The no-car-needed neighborhood. Park once and walk to the beach, Coligny shops, and casual dining. Best value oceanfront-adjacent on the island.',
  whoFor: ['Couples', 'Small families', 'Walkability seekers', 'Shorter stays'],
  beachAccess: 'Most Forest Beach condos are a 3–7 minute walk to the sand via Coligny Beach Park.',
  topAmenities: ['Walk to Coligny', 'Beach access', 'Community pools', 'Casual dining'],
  quickFacts: [
    { label: 'Summer nightly range (1–2BR)', value: '$220–450' },
    { label: 'Walk to Coligny', value: '3–7 min' },
    { label: 'Car needed', value: 'No' },
  ],
  bestForLinks: [
    { label: 'Walk-to-beach condos', params: { query: 'beach' } },
    { label: 'Budget-friendly', params: { query: 'value' } },
    { label: 'Couples', params: { adults: 2 } },
    { label: 'Pet-friendly', params: { query: 'pet friendly' } },
  ],
  faq: [
    {
      question: 'Can I get by without a car in Forest Beach?',
      answer:
        'Yes — Coligny Plaza, the beach, and several restaurants are all walkable. A car or bike helps for exploring the rest of the island.',
    },
    {
      question: 'Is Forest Beach cheaper than Sea Pines?',
      answer:
        'Generally, yes. You trade the gated-resort premium for walkability and still get excellent beach access.',
    },
  ],
};

const shelterCove: RentalAreaContent = {
  slug: 'shelter-cove',
  name: 'Shelter Cove',
  seoTitle: 'Shelter Cove Vacation Rentals — Marina Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Shelter Cove vacation rentals on Hilton Head: marina-front condos near Harbourfest fireworks and dining, with a live map and price bands.',
  h1: 'Shelter Cove Vacation Rentals',
  heroImage: { src: '/rentals/shelter-cove/hero.jpg', alt: 'Shelter Cove marina at dusk' },
  geofence: { center: { lat: 32.184, lng: -80.726 }, zoom: 14 },
  tldr:
    'Shelter Cove is the marina-and-dining hub on Broad Creek — walkable to Harbourfest summer fireworks. Condos run roughly $250–450/night in summer.',
  vibe:
    'Harbor-side living centered on the marina, the Sunday market, and the Tuesday Harbourfest fireworks. Calm water, not oceanfront — a short hop to the beach.',
  whoFor: ['Couples', 'Families wanting calm water', 'Boaters', 'Foodies'],
  beachAccess: 'Not oceanfront — the nearest ocean beach is a 5–10 minute drive; the marina is on Broad Creek.',
  topAmenities: ['Marina', 'Harbourfest fireworks', 'Waterfront dining', 'Community pools'],
  quickFacts: [
    { label: 'Summer nightly range (2BR)', value: '$250–450' },
    { label: 'Setting', value: 'Marina / Broad Creek' },
    { label: 'Drive to ocean beach', value: '5–10 min' },
  ],
  bestForLinks: [
    { label: 'Marina-view condos', params: { query: 'marina' } },
    { label: 'Families', params: { adults: 2, children: 2 } },
    { label: 'Couples', params: { adults: 2 } },
    { label: 'Near dining', params: { query: 'restaurants' } },
  ],
  faq: [
    {
      question: 'Is Shelter Cove on the ocean?',
      answer:
        'No — it sits on Broad Creek around the marina. The calm water is great for kayaking and boating; ocean beaches are a short 5–10 minute drive.',
    },
    {
      question: 'What are the summer fireworks?',
      answer:
        'Harbourfest runs Tuesday evenings in summer with live music and fireworks over the marina — many Shelter Cove rentals have a front-row view.',
    },
  ],
};

const portRoyal: RentalAreaContent = {
  slug: 'port-royal',
  name: 'Port Royal',
  seoTitle: 'Port Royal Vacation Rentals — Gated Homes & Villas (2026) | Hilton Ahead',
  metaDescription:
    'Curated Port Royal vacation rentals on Hilton Head: quiet gated homes and villas near tennis and golf, with a live map and price bands. Great for larger groups.',
  h1: 'Port Royal Vacation Rentals',
  heroImage: { src: '/rentals/port-royal/hero.jpg', alt: 'Port Royal gated community home' },
  geofence: { center: { lat: 32.221, lng: -80.696 }, zoom: 13 },
  tldr:
    'Port Royal is a quiet north-end gated plantation with tennis, golf, and roomy homes — our pick for larger groups who want a private pool. Summer homes run roughly $400–700/night.',
  vibe:
    'Residential, gated, and calm on the island’s north end. Bigger homes and a tennis/golf focus, away from the busiest tourist crush.',
  whoFor: ['Multi-gen groups', 'Tennis players', 'Quiet seekers', 'Private-pool seekers'],
  beachAccess: 'Beach access is via the community; most rentals are a short drive or shuttle to the sand.',
  topAmenities: ['Gated', 'Tennis center', 'Golf', 'Larger homes'],
  quickFacts: [
    { label: 'Summer nightly range (4BR)', value: '$480–700' },
    { label: 'Setting', value: 'Gated, north end' },
    { label: 'Best for', value: 'Groups & families' },
  ],
  bestForLinks: [
    { label: 'Homes with private pool', params: { query: 'private pool' } },
    { label: 'Large groups (8+)', params: { adults: 8 } },
    { label: 'Tennis trips', params: { query: 'tennis' } },
    { label: 'Quiet/secluded', params: { query: 'quiet' } },
  ],
  faq: [
    {
      question: 'Is Port Royal good for big families?',
      answer:
        'Yes — it has some of the island’s roomier rental homes with private pools, and the gated setting keeps things calm for multi-generational groups.',
    },
    {
      question: 'How far is Port Royal from the beach?',
      answer:
        'Beach access is through the community; most homes are a short drive or shuttle ride to the sand rather than a direct walk.',
    },
  ],
};

const midIsland: RentalAreaContent = {
  slug: 'mid-island',
  name: 'Mid-Island',
  seoTitle: 'Mid-Island Vacation Rentals — Central Hilton Head (2026) | Hilton Ahead',
  metaDescription:
    'Curated mid-island Hilton Head vacation rentals near Folly Field and Singleton beaches: central, well-priced villas with a live map and price bands.',
  h1: 'Mid-Island Vacation Rentals',
  heroImage: { src: '/rentals/mid-island/hero.jpg', alt: 'Mid-island Hilton Head villa near Folly Field' },
  geofence: { center: { lat: 32.197, lng: -80.718 }, zoom: 13 },
  tldr:
    'Mid-island is the central, well-priced base camp near Folly Field and Singleton beaches — short drives to everything. Summer villas run roughly $250–500/night.',
  vibe:
    'The practical middle of the island: less resort polish, more value and central location. Folly Field and Singleton beaches are the local-favorite sands here.',
  whoFor: ['Budget-conscious families', 'Central-location seekers', 'Repeat visitors', 'Longer stays'],
  beachAccess: 'Folly Field and Singleton Beach accesses are a short walk or drive from most mid-island rentals.',
  topAmenities: ['Central location', 'Folly Field beach', 'Value pricing', 'Community pools'],
  quickFacts: [
    { label: 'Summer nightly range (3BR)', value: '$300–500' },
    { label: 'Setting', value: 'Central island' },
    { label: 'Nearest beaches', value: 'Folly Field, Singleton' },
  ],
  bestForLinks: [
    { label: 'Walk-to-beach (Folly Field)', params: { query: 'folly field' } },
    { label: 'Value villas', params: { query: 'value' } },
    { label: 'Families', params: { adults: 2, children: 2 } },
    { label: 'Longer stays', params: { query: 'monthly' } },
  ],
  faq: [
    {
      question: 'What beaches are near mid-island rentals?',
      answer:
        'Folly Field Beach and Singleton Beach are the closest — both are local favorites and less crowded than Coligny.',
    },
    {
      question: 'Is mid-island cheaper than the gated plantations?',
      answer:
        'Usually, yes. You trade resort gates and on-property golf for a central location and lower nightly rates.',
    },
  ],
};

export const rentalAreas: Readonly<
  Record<RentalNeighborhoodSlug, RentalAreaContent>
> = {
  'sea-pines': seaPines,
  'palmetto-dunes': palmettoDunes,
  'forest-beach': forestBeach,
  'shelter-cove': shelterCove,
  'port-royal': portRoyal,
  'mid-island': midIsland,
};

export function getRentalArea(
  slug: string,
): RentalAreaContent | undefined {
  return (rentalAreas as Record<string, RentalAreaContent>)[slug];
}

export function allRentalAreas(): RentalAreaContent[] {
  return Object.values(rentalAreas);
}
```

> **Note on coordinates:** `sea-pines` (32.134, -80.808) is copied verbatim from `data/neighborhoods.ts`. The other 5 centers above are island-accurate approximations — during execution, **replace each with the exact `latitude`/`longitude` from the matching entry in `data/neighborhoods.ts`** (read that file, copy the numbers). This is a 2-minute lookup, not a guess to ship.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/rentals-editorial.spec.ts --project=chromium`
Expected: PASS.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add data/vacationRentals.ts tests/rentals-editorial.spec.ts
git commit -m "feat(rentals): add per-neighborhood editorial content module + tests"
```

---

### Task A3: Stay22 helper library

**Files:**
- Create: `app/lib/stay22.ts`
- Test: `tests/stay22.spec.ts`

- [ ] **Step 1: Write the failing test**

`tests/stay22.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import {
  withStay22Params,
  stay22MapEmbedSrc,
  stay22SearchDeeplink,
  STAY22_AID,
} from '../app/lib/stay22';

test.describe('stay22 helpers', () => {
  test('withStay22Params stamps aid on a clean url', () => {
    const out = withStay22Params('https://www.booking.com/x.html');
    expect(out).toContain('aid=');
    expect(out).toContain('booking.com');
  });

  test('withStay22Params does not double-stamp', () => {
    const once = withStay22Params('https://www.booking.com/x.html');
    const twice = withStay22Params(once);
    expect((twice.match(/aid=/g) || []).length).toBe(1);
  });

  test('withStay22Params returns input unchanged when malformed', () => {
    expect(withStay22Params('not a url')).toBe('not a url');
  });

  test('stay22MapEmbedSrc builds an embed url with lat/lng/aid', () => {
    const src = stay22MapEmbedSrc({ lat: 32.134, lng: -80.808, zoom: 13 });
    expect(src).toContain('lat=32.134');
    expect(src).toContain('lng=-80.808');
    expect(src).toContain(`aid=${STAY22_AID}`);
  });

  test('stay22SearchDeeplink merges params', () => {
    const url = stay22SearchDeeplink(
      { lat: 32.134, lng: -80.808 },
      { adults: 4, query: 'oceanfront' },
    );
    expect(url).toContain('adults=4');
    expect(url).toContain('oceanfront');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx playwright test tests/stay22.spec.ts --project=chromium`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `app/lib/stay22.ts`**

```ts
/**
 * Stay22 affiliate helpers.
 *
 * Stay22 is a meta-affiliate aggregating Booking.com, VRBO, Airbnb, Hotels.com,
 * Expedia, etc. The affiliate id (`aid`) is PUBLIC by design — it travels in
 * client-side map iframes and outbound links — so it lives in
 * NEXT_PUBLIC_STAY22_AID, not a server-only secret.
 *
 * Free-tier integration uses:
 *   1. The Interactive Map embed (iframe to /embed/gm).
 *   2. `aid`-stamped outbound deeplinks ("Allez"-style link transformation).
 *
 * NOTE: confirm the exact embed path + accepted query params in the Stay22
 * dashboard after signup. The /embed/gm shape below is Stay22's documented
 * classic map embed; adjust `STAY22_EMBED_BASE` / param names if the dashboard
 * snippet differs. All call sites go through these helpers so a change is local.
 */

export const STAY22_AID =
  process.env.NEXT_PUBLIC_STAY22_AID || 'PLACEHOLDER_AID';

const STAY22_EMBED_BASE = 'https://www.stay22.com/embed/gm';
const STAY22_ALLEZ_BASE = 'https://www.stay22.com/allez';

export type Stay22Center = {
  lat: number;
  lng: number;
  zoom?: number;
};

/** Stamp the Stay22 affiliate id onto an arbitrary outbound booking URL. */
export function withStay22Params(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('aid')) {
      u.searchParams.set('aid', STAY22_AID);
    }
    return u.toString();
  } catch {
    return url; // not a parseable URL — leave untouched
  }
}

/** Build the <iframe src> for the Stay22 interactive map at a given center. */
export function stay22MapEmbedSrc(center: Stay22Center): string {
  const params = new URLSearchParams({
    aid: STAY22_AID,
    lat: String(center.lat),
    lng: String(center.lng),
    zoom: String(center.zoom ?? 13),
    // Brand the markers to the site palette (coral). Hex without '#'.
    maincolor: 'C44A2B',
  });
  return `${STAY22_EMBED_BASE}?${params.toString()}`;
}

/** Build a Stay22 "Allez" search deeplink centered on a neighborhood. */
export function stay22SearchDeeplink(
  center: Stay22Center,
  extra: Record<string, string | number> = {},
): string {
  const params = new URLSearchParams({
    aid: STAY22_AID,
    lat: String(center.lat),
    lng: String(center.lng),
  });
  for (const [k, v] of Object.entries(extra)) {
    params.set(k, String(v));
  }
  return `${STAY22_ALLEZ_BASE}?${params.toString()}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/stay22.spec.ts --project=chromium`
Expected: PASS (5 tests). Note: `STAID_AID` falls back to `'PLACEHOLDER_AID'` in test/dev — assertions check for presence of `aid=`, not a specific value.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add app/lib/stay22.ts tests/stay22.spec.ts
git commit -m "feat(rentals): add Stay22 affiliate map + deeplink helpers"
```

---

### Task A4: Register Stay22 as the 13th affiliate program

**Files:**
- Modify: `data/affiliateLinks.ts`

- [ ] **Step 1: Add `'stay22'` to the `AffiliateProgramId` union**

Find the union type and add `| 'stay22'`:

```ts
export type AffiliateProgramId =
  | 'booking'
  | 'expedia'
  | 'vrbo'
  | 'viator'
  | 'getyourguide'
  | 'golfnow'
  | 'amazon'
  | 'marriott'
  | 'allianz'
  | 'hertz'
  | 'petermillar'
  | 'southwest'
  | 'hilton'
  | 'stay22';
```

- [ ] **Step 2: Add the program entry to the programs object**

Add this entry (matches the `query-stamp` shape; `aid` is the tracking param):

```ts
  stay22: {
    id: 'stay22',
    name: 'Stay22 (Booking · VRBO · Airbnb · Hotels)',
    shortName: 'Stay22',
    brandDomain: 'stay22.com',
    trackingIdEnv: 'NEXT_PUBLIC_STAY22_AID',
    trackingParam: 'aid',
    linkPattern: 'query-stamp',
    defaultDeeplink: 'https://www.stay22.com/allez?lat=32.16&lng=-80.75',
    pitch:
      'One search across Booking.com, VRBO, Airbnb, and Hotels.com for Hilton Head stays — the widest vacation-rental inventory on the island.',
  },
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS. (If the programs object has an exhaustive `Record<AffiliateProgramId, AffiliateProgram>` type, adding the union member without the entry would error — this step makes them consistent.)

- [ ] **Step 4: Commit**

```bash
git add data/affiliateLinks.ts
git commit -m "feat(rentals): register Stay22 as affiliate program #13"
```

---

### Task A5: RentalCard component

**Files:**
- Create: `components/rentals/RentalCard.tsx`

- [ ] **Step 1: Create the card (server component)**

```tsx
import Link from 'next/link';
import type { CatalogRental } from '@/data/rentalsCatalog';
import { withStay22Params } from '@/app/lib/stay22';
import RentalCarousel from '@/components/rentals/RentalCarousel';

const SOURCE_LABEL: Record<CatalogRental['source'], string> = {
  booking: 'Booking.com',
  vrbo: 'VRBO',
  airbnb: 'Airbnb',
  hotels: 'Hotels.com',
  direct: 'the host',
};

export default function RentalCard({ rental }: { rental: CatalogRental }) {
  const href = withStay22Params(rental.bookingDeeplink);
  const specs = [
    `${rental.beds} BR`,
    `${rental.baths} BA`,
    rental.sqft ? `${rental.sqft.toLocaleString()} sqft` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article
      id={rental.id}
      className="flex flex-col overflow-hidden rounded-3xl border border-rule-soft bg-sand-soft shadow-sm transition-shadow hover:shadow-md"
    >
      <RentalCarousel photoUrls={rental.photoUrls} title={rental.title} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="display text-lg font-medium leading-snug text-ink">
          {rental.title}
        </h3>

        <p className="text-sm font-medium text-ink-soft">{specs}</p>

        <p className="text-sm font-semibold text-coral-deep">
          {rental.pricePerNightBand}
        </p>

        {typeof rental.rating === 'number' && (
          <p className="text-sm text-ink-soft" aria-label="guest rating">
            ★ {rental.rating.toFixed(1)}
            {rental.reviewCount ? ` (${rental.reviewCount} reviews)` : ''}
          </p>
        )}

        {rental.amenities.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {rental.amenities.slice(0, 4).map((a) => (
              <li
                key={a}
                className="rounded-full bg-ocean-light/40 px-3 py-1 text-xs font-medium text-ocean-deep"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm italic leading-relaxed text-ink-soft">
          {rental.editorialNote}
        </p>

        <div className="mt-auto pt-2">
          <Link
            href={href}
            target="_blank"
            rel="sponsored noopener"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-sand transition-colors hover:bg-ocean"
          >
            View on {SOURCE_LABEL[rental.source]} →
          </Link>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: FAIL — `RentalCarousel` not found yet. That's expected; A6 creates it. Proceed.

- [ ] **Step 3: Commit (deferred to after A6)**

Do not commit yet — A5 + A6 land together because they're mutually required for compile. Continue to A6.

---

### Task A6: RentalCarousel component (client)

**Files:**
- Create: `components/rentals/RentalCarousel.tsx`

- [ ] **Step 1: Create the carousel**

```tsx
'use client';

import { useState } from 'react';

export default function RentalCarousel({
  photoUrls,
  title,
}: {
  photoUrls: ReadonlyArray<string>;
  title: string;
}) {
  const [i, setI] = useState(0);
  const photos = photoUrls.length > 0 ? photoUrls : ['/rentals/placeholder.jpg'];
  const count = photos.length;
  const go = (delta: number) => setI((prev) => (prev + delta + count) % count);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[i]}
        alt={`${title} — photo ${i + 1} of ${count}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-3 py-1.5 text-sand hover:bg-ink/80"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-3 py-1.5 text-sand hover:bg-ink/80"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, n) => (
              <span
                key={n}
                className={`h-1.5 w-1.5 rounded-full ${
                  n === i ? 'bg-sand' : 'bg-sand/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (A5 + A6 now both resolve).

- [ ] **Step 3: Lint + commit A5 + A6 together**

```bash
npm run lint
git add components/rentals/RentalCard.tsx components/rentals/RentalCarousel.tsx
git commit -m "feat(rentals): add RentalCard + RentalCarousel components"
```

> Add a real `/public/rentals/placeholder.jpg` (neutral villa image, owned/licensed) before launch so empty photo sets degrade gracefully.

---

### Task A7: RentalGrid component

**Files:**
- Create: `components/rentals/RentalGrid.tsx`

- [ ] **Step 1: Create the grid**

```tsx
import type { CatalogRental } from '@/data/rentalsCatalog';
import RentalCard from '@/components/rentals/RentalCard';

export default function RentalGrid({
  rentals,
  heading,
}: {
  rentals: ReadonlyArray<CatalogRental>;
  heading?: string;
}) {
  if (rentals.length === 0) {
    return (
      <div className="rounded-3xl border border-rule-soft bg-sand-soft px-8 py-12 text-center">
        <p className="text-sm leading-relaxed text-ink-soft">
          We&apos;re curating our favorite rentals in this area now. In the
          meantime, browse the live map below for every available stay.
        </p>
      </div>
    );
  }

  return (
    <section>
      {heading && (
        <h2 className="display mb-6 text-2xl font-medium text-ink md:text-3xl">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((r) => (
          <RentalCard key={r.id} rental={r} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/rentals/RentalGrid.tsx
git commit -m "feat(rentals): add RentalGrid component with empty state"
```

> "Load more" pagination is intentionally omitted in v1 — 6 cards per neighborhood fit on one screen. Add it only when a neighborhood exceeds ~12 curated entries (YAGNI).

---

### Task A8: BestForLinkRow component

**Files:**
- Create: `components/rentals/BestForLinkRow.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from 'next/link';
import type { RentalAreaContent } from '@/data/vacationRentals';
import { stay22SearchDeeplink } from '@/app/lib/stay22';

export default function BestForLinkRow({ area }: { area: RentalAreaContent }) {
  if (area.bestForLinks.length === 0) return null;

  return (
    <section aria-label={`Best-for searches in ${area.name}`}>
      <h2 className="display mb-4 text-xl font-medium text-ink">
        Browse the full {area.name} map by trip type
      </h2>
      <div className="flex flex-wrap gap-3">
        {area.bestForLinks.map((link) => (
          <Link
            key={link.label}
            href={stay22SearchDeeplink(area.geofence.center, link.params)}
            target="_blank"
            rel="sponsored noopener"
            className="flex items-center gap-2 rounded-full border border-rule-soft bg-sand-soft px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ocean/40 hover:text-ocean"
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/rentals/BestForLinkRow.tsx
git commit -m "feat(rentals): add BestForLinkRow (pre-filtered Stay22 deeplinks)"
```

---

### Task A9: RentalsHero component

**Files:**
- Create: `components/rentals/RentalsHero.tsx`

- [ ] **Step 1: Create the hero (mirrors the visual language of app/local/[industry]/page.tsx hero)**

```tsx
import Link from 'next/link';

export default function RentalsHero({
  eyebrow,
  h1,
  intro,
  imageSrc,
  imageAlt,
  breadcrumb,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumb: ReadonlyArray<{ name: string; href: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

      <div className="relative mx-auto max-w-3xl text-center">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center justify-center gap-2 text-xs text-ocean-light">
            {breadcrumb.map((b, idx) => (
              <li key={b.href} className="flex items-center gap-2">
                {idx > 0 && <span aria-hidden className="text-ocean-light/40">›</span>}
                {idx < breadcrumb.length - 1 ? (
                  <Link href={b.href} className="hover:text-sand">{b.name}</Link>
                ) : (
                  <span className="text-sand/70">{b.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="eyebrow mb-3 text-coral">{eyebrow}</p>
        <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/rentals/RentalsHero.tsx
git commit -m "feat(rentals): add RentalsHero component"
```

---

### Task A10: Stay22Map component (client)

**Files:**
- Create: `components/rentals/Stay22Map.tsx`

- [ ] **Step 1: Create the map embed wrapper**

```tsx
'use client';

import { stay22MapEmbedSrc, type Stay22Center } from '@/app/lib/stay22';

export default function Stay22Map({
  center,
  title,
}: {
  center: Stay22Center;
  title: string;
}) {
  const src = stay22MapEmbedSrc(center);

  return (
    <section aria-label={`Live rental map for ${title}`}>
      <div className="overflow-hidden rounded-3xl border border-rule-soft shadow-sm">
        <iframe
          title={`Live vacation-rental map — ${title}`}
          src={src}
          loading="lazy"
          className="h-[480px] w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Live availability and pricing via Stay22 (Booking.com, VRBO, Airbnb,
        Hotels.com). We may earn a commission from bookings — at no extra cost to
        you.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/rentals/Stay22Map.tsx
git commit -m "feat(rentals): add Stay22 interactive map embed component"
```

> The `sandbox` attribute is deliberately permissive enough for the Stay22 widget to run its own JS and open booking links in new tabs. If the dashboard snippet uses a `<script>` loader instead of an iframe, swap the iframe for a `next/script` strategy="afterInteractive" loader + the target `<div id="stay22-widget">` — keep the component's public props (`center`, `title`) identical so call sites don't change.

---

### Task A11: Neighborhood page route

**Files:**
- Create: `app/vacation-rentals/[slug]/page.tsx`

> This task wires the **rental** sections only. The real-estate section (`<MarketTrendsSection>`) is added in Phase B Task B12. A clearly-marked insertion point is left in the JSX.

- [ ] **Step 1: Create the page**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getPlaceSchema,
  getItemListSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import {
  getRentalArea,
  allRentalAreas,
} from '@/data/vacationRentals';
import { rentalsByNeighborhood } from '@/data/rentalsCatalog';
import RentalsHero from '@/components/rentals/RentalsHero';
import RentalGrid from '@/components/rentals/RentalGrid';
import BestForLinkRow from '@/components/rentals/BestForLinkRow';
import Stay22Map from '@/components/rentals/Stay22Map';
import TldrBlock from '@/components/ui/TldrBlock';
import QuickFact from '@/components/ui/QuickFact';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const revalidate = 3600;

export function generateStaticParams() {
  return allRentalAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getRentalArea(slug);
  if (!area) return {};
  return generatePageMetadata({
    title: area.seoTitle,
    description: area.metaDescription,
    path: `/vacation-rentals/${area.slug}`,
    keywords: [
      `${area.name} vacation rentals`,
      `${area.name} villas Hilton Head`,
      `${area.name} condos`,
      `${area.name} real estate trends`,
    ],
  });
}

export default async function NeighborhoodRentalsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getRentalArea(slug);
  if (!area) notFound();

  const rentals = rentalsByNeighborhood(area.slug);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Vacation Rentals', path: '/vacation-rentals' },
    { name: area.name, path: `/vacation-rentals/${area.slug}` },
  ];

  const jsonLd = [
    getBreadcrumbSchema(breadcrumbItems),
    getPlaceSchema({
      name: `${area.name}, Hilton Head Island`,
      description: area.vibe,
      url: `${siteUrl}/vacation-rentals/${area.slug}`,
      latitude: area.geofence.center.lat,
      longitude: area.geofence.center.lng,
      containedIn: 'Hilton Head Island, SC',
    }),
    getFaqSchema(area.faq),
    getItemListSchema(
      `${area.name} vacation rentals`,
      rentals.map((r) => ({ name: r.title, description: r.editorialNote })),
    ),
    getSpeakableSchema({
      url: `${siteUrl}/vacation-rentals/${area.slug}`,
      cssSelectors: ['.tldr-block', '.faq-answer'],
    }),
  ];

  // For prev/next cross-links
  const areas = allRentalAreas();
  const idx = areas.findIndex((a) => a.slug === area.slug);
  const next = areas[(idx + 1) % areas.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RentalsHero
        eyebrow={`🏝️ ${area.name} · Hilton Head Island`}
        h1={area.h1}
        intro={area.vibe}
        imageSrc={area.heroImage.src}
        imageAlt={area.heroImage.alt}
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'Vacation Rentals', href: '/vacation-rentals' },
          { name: area.name, href: `/vacation-rentals/${area.slug}` },
        ]}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mx-auto mb-12 max-w-2xl">
          <TldrBlock>{area.tldr}</TldrBlock>
        </div>

        {/* Curated grid */}
        <div className="mb-6 text-xs font-medium text-ink-soft">
          We may earn a commission from bookings made through these links — at no
          extra cost to you.
        </div>
        <div className="mb-12">
          <RentalGrid
            rentals={rentals}
            heading={`Our picks in ${area.name}`}
          />
        </div>

        {/* Best-for deeplinks */}
        <div className="mb-12">
          <BestForLinkRow area={area} />
        </div>

        {/* Live map */}
        <div className="mb-16">
          <Stay22Map center={area.geofence.center} title={area.name} />
        </div>

        {/* Editorial deep-dive */}
        <section className="mx-auto mb-16 max-w-3xl space-y-8">
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Who it&apos;s for</h2>
            <ul className="flex flex-wrap gap-2">
              {area.whoFor.map((w) => (
                <li key={w} className="rounded-full bg-palm-light/40 px-3 py-1 text-sm text-palm">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Beach access</h2>
            <p className="text-base leading-relaxed text-ink-soft">{area.beachAccess}</p>
          </div>
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Top amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {area.topAmenities.map((t) => (
                <li key={t} className="rounded-full bg-ocean-light/40 px-3 py-1 text-sm text-ocean-deep">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {area.quickFacts.map((f) => (
              <QuickFact key={f.label} number={f.value} label={f.label} />
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            PHASE B INSERTION POINT — <MarketTrendsSection slug={area.slug} />
            goes here (Task B12). Renders price-tier map + charts + Realtor form.
           ────────────────────────────────────────────────────────────── */}

        {/* FAQ */}
        <section className="mx-auto mb-16 max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
            {area.name} rental FAQ
          </h2>
          <div className="space-y-px">
            {area.faq.map(({ question, answer }, i) => (
              <details key={i} className="group border-b border-rule-soft py-4 open:pb-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                  <span>{question}</span>
                  <span className="mt-0.5 shrink-0 text-ocean transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="faq-answer mt-3 text-sm leading-relaxed text-ink-soft">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="border-t border-rule-soft pt-10 text-center">
          <Link
            href={`/vacation-rentals/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-ocean-deep"
          >
            Explore {next.name} rentals →
          </Link>
          <div className="mt-3">
            <Link href="/vacation-rentals" className="text-sm text-ink-soft hover:text-ink">
              ← All Hilton Head neighborhoods
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS. If `getPlaceSchema` / `getItemListSchema` / `getSpeakableSchema` signatures differ from those used above, adjust the call to match `app/lib/metadata.ts` (do not change the helpers).

- [ ] **Step 3: Smoke it manually**

Run: `npm run dev`, visit `http://localhost:3000/vacation-rentals/sea-pines`. Expect hero, TL;DR, 1 card, best-for chips, map iframe, editorial, FAQ. Stop dev.

- [ ] **Step 4: Lint + commit**

```bash
npm run lint
git add app/vacation-rentals/[slug]/page.tsx
git commit -m "feat(rentals): add neighborhood rentals page route"
```

---

### Task A12: Hub page route

**Files:**
- Create: `app/vacation-rentals/page.tsx`

- [ ] **Step 1: Create the hub**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getItemListSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { allRentalAreas } from '@/data/vacationRentals';
import { allRentals } from '@/data/rentalsCatalog';
import RentalsHero from '@/components/rentals/RentalsHero';
import RentalGrid from '@/components/rentals/RentalGrid';
import Stay22Map from '@/components/rentals/Stay22Map';
import TldrBlock from '@/components/ui/TldrBlock';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const revalidate = 3600;

// Island-wide map center (mid-island).
const ISLAND_CENTER = { lat: 32.18, lng: -80.74, zoom: 11 };

const HUB_FAQ = [
  {
    question: 'Which Hilton Head neighborhood is best for a vacation rental?',
    answer:
      'Sea Pines for the iconic gated-resort experience and walkable oceanfront, Palmetto Dunes for families and golf, Forest Beach for walkability to Coligny, Shelter Cove for the marina, Port Royal for quiet larger homes, and mid-island for central value.',
  },
  {
    question: 'How far ahead should I book a Hilton Head rental?',
    answer:
      'For summer (June–August), book the best villas 6–9 months out. Shoulder season opens up 2–3 months ahead at lower rates.',
  },
  {
    question: 'Do you book the rentals directly?',
    answer:
      'We surface curated picks and a live map of every available stay, then link you to Booking.com, VRBO, or Airbnb to complete the reservation. We may earn a commission at no extra cost to you.',
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Vacation Rentals — Villas, Condos & Homes by Neighborhood (2026)',
  description:
    'Browse Hilton Head Island vacation rentals by neighborhood: Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, Port Royal, and mid-island. Curated picks, a live map, price bands, amenities, and reviews.',
  path: '/vacation-rentals',
  keywords: [
    'Hilton Head vacation rentals',
    'Hilton Head villas',
    'Hilton Head condos',
    'Hilton Head Airbnb',
    'Hilton Head VRBO',
  ],
});

export default function VacationRentalsHubPage() {
  const areas = allRentalAreas();
  const topRentals = allRentals().slice(0, 12);

  const jsonLd = [
    getBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Vacation Rentals', path: '/vacation-rentals' },
    ]),
    getItemListSchema(
      'Hilton Head vacation-rental neighborhoods',
      areas.map((a) => ({ name: a.name, description: a.vibe })),
    ),
    getFaqSchema(HUB_FAQ),
    getSpeakableSchema({
      url: `${siteUrl}/vacation-rentals`,
      cssSelectors: ['.tldr-block', '.faq-answer'],
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RentalsHero
        eyebrow="🏝️ Hilton Head Island"
        h1="Hilton Head Vacation Rentals"
        intro="Curated villas, condos, and homes by neighborhood — with a live map of every available stay, honest price bands, and local picks."
        imageSrc="/rentals/hero.jpg"
        imageAlt="Hilton Head Island oceanfront villas"
        breadcrumb={[
          { name: 'Home', href: '/' },
          { name: 'Vacation Rentals', href: '/vacation-rentals' },
        ]}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mx-auto mb-12 max-w-2xl">
          <TldrBlock>
            Hilton Head&apos;s rentals split by neighborhood: Sea Pines (iconic,
            gated), Palmetto Dunes (family + golf), Forest Beach (walk to
            Coligny), Shelter Cove (marina), Port Royal (quiet, larger homes),
            and mid-island (central value). Summer runs roughly $200–800/night
            depending on area and proximity to the sand.
          </TldrBlock>
        </div>

        {/* Neighborhood cards */}
        <section className="mb-16">
          <h2 className="display mb-6 text-2xl font-medium text-ink md:text-3xl">
            Choose your neighborhood
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/vacation-rentals/${a.slug}`}
                className="group overflow-hidden rounded-3xl border border-rule-soft bg-sand-soft shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.heroImage.src}
                    alt={a.heroImage.alt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="display text-lg font-medium text-ink">{a.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.vibe}</p>
                  <p className="mt-3 text-sm font-semibold text-coral-deep">
                    {a.quickFacts[0]?.label}: {a.quickFacts[0]?.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top picks across the island */}
        <div className="mb-6 text-xs font-medium text-ink-soft">
          We may earn a commission from bookings made through these links — at no
          extra cost to you.
        </div>
        <div className="mb-16">
          <RentalGrid rentals={topRentals} heading="Editor's picks across the island" />
        </div>

        {/* Island-wide live map */}
        <div className="mb-16">
          <Stay22Map center={ISLAND_CENTER} title="Hilton Head Island" />
        </div>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
            Hilton Head rentals FAQ
          </h2>
          <div className="space-y-px">
            {HUB_FAQ.map(({ question, answer }, i) => (
              <details key={i} className="group border-b border-rule-soft py-4 open:pb-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                  <span>{question}</span>
                  <span className="mt-0.5 shrink-0 text-ocean transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="faq-answer mt-3 text-sm leading-relaxed text-ink-soft">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Typecheck + manual smoke**

Run: `npm run typecheck`, then `npm run dev` → visit `/vacation-rentals`. Expect hero, 6 neighborhood cards, picks grid, island map, FAQ. Stop dev.

- [ ] **Step 3: Lint + commit**

```bash
npm run lint
git add app/vacation-rentals/page.tsx
git commit -m "feat(rentals): add vacation-rentals hub page"
```

---

### Task A13: Nav, footer, and sitemap wiring

**Files:**
- Modify: `data/nav.ts`
- Modify: `data/footerLinks.ts`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Insert the top-level nav item (`data/nav.ts`)**

Insert between the "Local Guide" object and the "Businesses" object in `nav.links`:

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

- [ ] **Step 2: Add a footer column (`data/footerLinks.ts`)**

Insert a new object into the `columns` array (after "Browse Local"):

```ts
    {
      label: 'Vacation Rentals',
      links: [
        { href: '/vacation-rentals', label: 'All Rentals' },
        { href: '/vacation-rentals/sea-pines', label: 'Sea Pines' },
        { href: '/vacation-rentals/palmetto-dunes', label: 'Palmetto Dunes' },
        { href: '/vacation-rentals/forest-beach', label: 'Forest Beach' },
        { href: '/vacation-rentals/shelter-cove', label: 'Shelter Cove' },
        { href: '/vacation-rentals/port-royal', label: 'Port Royal' },
        { href: '/vacation-rentals/mid-island', label: 'Mid-Island' },
      ],
    },
```

- [ ] **Step 3: Add 7 sitemap routes (`app/sitemap.ts`)**

Add to the `STATIC_ROUTES` array:

```ts
  { path: '/vacation-rentals', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/vacation-rentals/sea-pines', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/vacation-rentals/palmetto-dunes', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/vacation-rentals/forest-beach', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/vacation-rentals/shelter-cove', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/vacation-rentals/port-royal', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/vacation-rentals/mid-island', changeFrequency: 'weekly', priority: 0.9 },
```

- [ ] **Step 4: Typecheck + lint + manual nav check**

Run: `npm run typecheck && npm run lint`, then `npm run dev` → confirm "Vacation Rentals" appears in the header nav with the 6-item dropdown, and in the footer. Stop dev.

- [ ] **Step 5: Commit**

```bash
git add data/nav.ts data/footerLinks.ts app/sitemap.ts
git commit -m "feat(rentals): wire vacation rentals into nav, footer, and sitemap"
```

---

### Task A14: Phase A integration test + build gate

**Files:**
- Create: `tests/vacation-rentals.spec.ts`

- [ ] **Step 1: Write the integration test**

```ts
import { test, expect } from '@playwright/test';

test.describe('Vacation Rentals surface', () => {
  test('hub page renders hero, neighborhood cards, and live map', async ({ page }) => {
    await page.goto('/vacation-rentals');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vacation Rentals');
    // 6 neighborhood links
    await expect(page.getByRole('link', { name: /Sea Pines/i }).first()).toBeVisible();
    // Stay22 map iframe
    await expect(page.locator('iframe[src*="stay22.com"]')).toBeVisible();
  });

  test('neighborhood page renders a card with a sponsored affiliate link', async ({ page }) => {
    await page.goto('/vacation-rentals/sea-pines');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sea Pines');
    // TL;DR speakable block present
    await expect(page.locator('.tldr-block')).toBeVisible();
    // At least one outbound booking link, correctly marked sponsored + new tab
    const cta = page.getByRole('link', { name: /View on/i }).first();
    await expect(cta).toHaveAttribute('rel', /sponsored/);
    await expect(cta).toHaveAttribute('target', '_blank');
    // FAQ answers use the speakable selector
    await expect(page.locator('.faq-answer').first()).toBeVisible();
  });

  test('nav contains the Vacation Rentals item', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Vacation Rentals' }).first()).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the integration test**

Run: `npx playwright test tests/vacation-rentals.spec.ts --project=chromium`
Expected: PASS. (Playwright `webServer` in `playwright.config.ts` should boot the dev/preview server; if not configured to, start `npm run dev` in another shell first.)

- [ ] **Step 3: Full production build gate**

Run: `npm run build`
Expected: PASS — all 7 routes compile; no "client component / server import" boundary errors. Fix any RSC boundary issue (e.g., a server component importing a `'use client'` default is fine; the reverse is not).

- [ ] **Step 4: Commit**

```bash
git add tests/vacation-rentals.spec.ts
git commit -m "test(rentals): add Phase A integration smoke + verify build"
```

**✅ Phase A complete — the vacation rentals surface is shippable on its own.**

---

# PHASE B — Per-Neighborhood Real Estate Trends

Phase B adds the market-trends section to the neighborhood pages built in Phase A.

---

### Task B1: Supabase migration — market_trends + real_estate_inquiries

**Files:**
- Create: `supabase/migrations/013_market_trends.sql`

> Numbering: latest existing is `012_directory_events.sql` (per CLAUDE.md). `013` is the next clean number with no `002`-style clash.

- [ ] **Step 1: Write the migration**

```sql
-- 013_market_trends.sql
-- Real estate market trends (Redfin Data Center) + referral inquiries.

-- ── market_trends ──────────────────────────────────────────────────────────
create table if not exists public.market_trends (
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

create index if not exists market_trends_slug_month_idx
  on public.market_trends (neighborhood_slug, month desc);

alter table public.market_trends enable row level security;

-- Public read (market data is non-sensitive, displayed on public pages).
create policy "Public can read market trends"
  on public.market_trends for select
  using (true);

-- Writes only via service role (cron) or admins.
create policy "Admins manage market trends"
  on public.market_trends for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── real_estate_inquiries ───────────────────────────────────────────────────
create table if not exists public.real_estate_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  neighborhood_slug text,
  name text not null,
  email text not null,
  phone text,
  message text,
  intent text,            -- 'buying' | 'selling' | 'both' | 'browsing'
  source_url text,
  ip_hash text            -- SHA-256, mirrors directory_events
);

alter table public.real_estate_inquiries enable row level security;

-- Anonymous insert (public form), mirrors itinerary_requests.
create policy "Anyone can submit a real estate inquiry"
  on public.real_estate_inquiries for insert
  with check (true);

-- No anonymous read — admin/service-role only.
create policy "No public read of inquiries"
  on public.real_estate_inquiries for select
  using (public.is_admin());
```

- [ ] **Step 2: Apply the migration**

Apply via Supabase CLI (`supabase db push`) or paste into the SQL editor (per CLAUDE.md). Confirm both tables exist and RLS is enabled.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/013_market_trends.sql
git commit -m "feat(real-estate): add market_trends + real_estate_inquiries migration"
```

---

### Task B2: Redfin region mapping data module

**Files:**
- Create: `data/realEstateTrends.ts`
- Test: `tests/real-estate-mapping.spec.ts`

- [ ] **Step 1: Write the failing test**

`tests/real-estate-mapping.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import {
  NEIGHBORHOOD_REDFIN_REGIONS,
  PRICE_TIERS,
  priceTierFor,
} from '../data/realEstateTrends';
import { RENTAL_NEIGHBORHOODS } from '../data/rentalsCatalog';

test.describe('realEstateTrends mapping', () => {
  test('every neighborhood has a region mapping with at least one zip', () => {
    for (const slug of RENTAL_NEIGHBORHOODS) {
      const m = NEIGHBORHOOD_REDFIN_REGIONS[slug];
      expect(m, `missing region mapping for ${slug}`).toBeTruthy();
      expect(m.zipCodes.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('priceTierFor buckets values into known tiers', () => {
    expect(priceTierFor(500_000).key).toBe(PRICE_TIERS[0].key);
    expect(priceTierFor(5_000_000).key).toBe(PRICE_TIERS[PRICE_TIERS.length - 1].key);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx playwright test tests/real-estate-mapping.spec.ts --project=chromium`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `data/realEstateTrends.ts`**

```ts
/**
 * Maps each rental neighborhood to its Redfin Data Center region(s) and the
 * Beaufort County zip codes it spans, plus the price-tier color scale used by
 * the market price-tier map.
 *
 * Redfin region IDs: confirm during execution by inspecting the chosen CSV at
 * REDFIN_DATA_BASE_URL (the zip-level "redfin_market_tracker" file). Hilton
 * Head Island zips: 29926 (north/mid), 29928 (south/Sea Pines/Forest Beach),
 * 29938 (PO boxes — usually excluded). If a finer region id is unavailable,
 * fall back to zip-level aggregation, which the cron already does.
 */

import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export type RedfinRegionMapping = {
  /** Redfin region label as it appears in the CSV "region" column. */
  redfinRegion: string;
  zipCodes: readonly string[];
  /** 1-sentence interpretation guide shown under the chart. */
  blurb: string;
};

export const NEIGHBORHOOD_REDFIN_REGIONS: Record<
  RentalNeighborhoodSlug,
  RedfinRegionMapping
> = {
  'sea-pines': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'South-end gated plantation — the island’s priciest tier.',
  },
  'palmetto-dunes': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Mid-island resort core; villa-and-condo heavy.',
  },
  'forest-beach': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Walkable beach condos near Coligny; entry-to-mid tier.',
  },
  'shelter-cove': {
    redfinRegion: 'Zip Code: 29928',
    zipCodes: ['29928'],
    blurb: 'Marina condos on Broad Creek; mid tier.',
  },
  'port-royal': {
    redfinRegion: 'Zip Code: 29926',
    zipCodes: ['29926'],
    blurb: 'North-end gated homes; mid-to-upper tier.',
  },
  'mid-island': {
    redfinRegion: 'Zip Code: 29926',
    zipCodes: ['29926'],
    blurb: 'Central island; the island’s value tier.',
  },
};

export type PriceTier = {
  key: string;
  label: string;
  /** Inclusive lower bound in USD. */
  min: number;
  /** Tailwind-token-aligned hex for the map fill (no leading #). */
  colorHex: string;
};

export const PRICE_TIERS: readonly PriceTier[] = [
  { key: 'under-750k', label: 'Under $750k', min: 0, colorHex: 'F2C84B' }, // gold
  { key: '750k-1.25m', label: '$750k–$1.25M', min: 750_000, colorHex: 'E08A3C' }, // gold-deep
  { key: '1.25m-2m', label: '$1.25M–$2M', min: 1_250_000, colorHex: 'C44A2B' }, // coral
  { key: '2m-plus', label: '$2M+', min: 2_000_000, colorHex: '0A2930' }, // ink
] as const;

export function priceTierFor(medianSalePrice: number): PriceTier {
  let tier = PRICE_TIERS[0];
  for (const t of PRICE_TIERS) {
    if (medianSalePrice >= t.min) tier = t;
  }
  return tier;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/real-estate-mapping.spec.ts --project=chromium`
Expected: PASS.

- [ ] **Step 5: Typecheck + commit**

```bash
npm run typecheck
git add data/realEstateTrends.ts tests/real-estate-mapping.spec.ts
git commit -m "feat(real-estate): add Redfin region mapping + price-tier scale"
```

---

### Task B3: Realtor partner data module

**Files:**
- Create: `data/realEstatePartner.ts`

> **Owner blocker:** real partner identity/email is TBD (spec open-items table). This module ships with safe generic defaults so pages render; swap values when the partner is signed. Email routing uses the `REAL_ESTATE_PARTNER_EMAIL` env var, NOT this file, so the partnership can change with zero code edits.

- [ ] **Step 1: Create the module (single-export, mirrors `data/founder.ts` pattern)**

```ts
/**
 * Single source of truth for the partner Realtor surfaced on real estate
 * trend sections. Update here when the referral partner is signed.
 *
 * The intake EMAIL is read from process.env.REAL_ESTATE_PARTNER_EMAIL at
 * request time (see app/api/real-estate-inquiry/route.ts) — NOT from this file —
 * so the partnership can change without a deploy.
 */

export type RealEstatePartner = {
  /** Display name, or a generic label until a partner is signed. */
  name: string;
  /** Whether a real partner is configured (controls CTA copy). */
  active: boolean;
  brokerage?: string;
  licenseNumber?: string;
  headshotSrc?: string;
  bio: string;
  calendlyUrl?: string;
};

export const realEstatePartner: RealEstatePartner = {
  name: 'Our Hilton Head real estate partner',
  active: false,
  bio: 'We connect serious buyers and sellers with a vetted, full-time Hilton Head Island Realtor who knows these neighborhoods street by street.',
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add data/realEstatePartner.ts
git commit -m "feat(real-estate): add partner Realtor data module (generic default)"
```

---

### Task B4: Real estate inquiry email notification

**Files:**
- Modify: `app/lib/email.ts`

- [ ] **Step 1: Add the notification function**

Append to `app/lib/email.ts` (reuses the existing `sendEmail`, `esc`, and `fieldRow` helpers in that file):

```ts
export interface RealEstateInquiryEmail {
  name: string;
  email: string;
  phone?: string;
  neighborhoodSlug?: string;
  intent?: string;
  message?: string;
  sourceUrl?: string;
}

/** Notify the partner Realtor (+ ops) of a new real estate referral. */
export async function sendRealEstateInquiryNotification(
  req: RealEstateInquiryEmail,
) {
  const partner = process.env.REAL_ESTATE_PARTNER_EMAIL;
  const ops = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
  // Send to partner if configured, always cc ops by sending to both.
  const to = partner ? [partner, ops] : [ops];

  const subject = `New HHI real estate referral — ${req.name}${
    req.neighborhoodSlug ? ` (${req.neighborhoodSlug})` : ''
  }`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:8px;">
      New real estate referral · hiltonahead.com
    </div>
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.15;color:#0A2930;margin:0 0 24px 0;">
      ${esc(req.name)}
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);padding:16px;">
      <tbody>
        ${fieldRow('Email', req.email)}
        ${fieldRow('Phone', req.phone)}
        ${fieldRow('Neighborhood', req.neighborhoodSlug)}
        ${fieldRow('Intent', req.intent)}
        ${fieldRow('Message', req.message)}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  const text = [
    `Name: ${req.name}`,
    `Email: ${req.email}`,
    req.phone ? `Phone: ${req.phone}` : '',
    req.neighborhoodSlug ? `Neighborhood: ${req.neighborhoodSlug}` : '',
    req.intent ? `Intent: ${req.intent}` : '',
    req.message ? `Message: ${req.message}` : '',
    ``,
    `Reply directly — it'll reach ${req.email}.`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: req.email,
    tags: [{ name: 'type', value: 'real_estate_inquiry' }],
  });
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add app/lib/email.ts
git commit -m "feat(real-estate): add referral inquiry email notification"
```

---

### Task B5: Real estate inquiry API route

**Files:**
- Create: `app/api/real-estate-inquiry/route.ts`

- [ ] **Step 1: Create the route (mirrors `app/api/itinerary/route.ts`)**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendRealEstateInquiryNotification } from '@/app/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTENTS = new Set(['buying', 'selling', 'both', 'browsing']);

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().slice(0, max);
  return s || undefined;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }
  const input = body as Record<string, unknown>;

  const email = str(input.email, 320);
  const name = str(input.name, 100);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: 'A name is required.' }, { status: 400 });
  }

  const intentRaw = str(input.intent, 20);
  const normalized = {
    name,
    email,
    phone: str(input.phone, 20),
    neighborhoodSlug: str(input.neighborhoodSlug, 40),
    intent: intentRaw && INTENTS.has(intentRaw) ? intentRaw : undefined,
    message: str(input.message, 4000),
    sourceUrl: str(input.sourceUrl, 300),
  };

  // SHA-256 hash the client IP (mirrors directory_events).
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  let ipHash: string | null = null;
  try {
    const { createHash } = await import('node:crypto');
    ipHash = createHash('sha256').update(ip).digest('hex');
  } catch {
    ipHash = null;
  }

  // 1) Best-effort insert.
  let dbOk = false;
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (hasSupabase) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('real_estate_inquiries').insert({
        name: normalized.name,
        email: normalized.email,
        phone: normalized.phone ?? null,
        neighborhood_slug: normalized.neighborhoodSlug ?? null,
        intent: normalized.intent ?? null,
        message: normalized.message ?? null,
        source_url: normalized.sourceUrl ?? null,
        ip_hash: ipHash,
      });
      if (error) console.error('[real-estate-inquiry] insert error:', error);
      else dbOk = true;
    } catch (err) {
      console.error('[real-estate-inquiry] unexpected error:', err);
    }
  }

  // 2) Best-effort email.
  const emailResult = await sendRealEstateInquiryNotification(normalized);
  const emailOk = emailResult.ok === true;

  if (dbOk || emailOk) return NextResponse.json({ ok: true });

  return NextResponse.json(
    { ok: false, error: 'Could not submit your inquiry. Please email hello@hiltonahead.com.' },
    { status: 500 },
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add app/api/real-estate-inquiry/route.ts
git commit -m "feat(real-estate): add referral inquiry POST handler"
```

---

### Task B6: Redfin refresh cron

**Files:**
- Create: `app/api/cron/refresh-market-data/route.ts`
- Modify: `vercel.json` (create if absent)

- [ ] **Step 1: Create the cron handler (mirrors `app/api/cron/newsletter-draft/route.ts` auth pattern)**

```ts
/**
 * Monthly refresh of neighborhood real estate trends from Redfin Data Center.
 *
 * Schedule: 1st of month, 06:00 UTC (vercel.json). Vercel Cron sends a GET with
 * Authorization: Bearer <CRON_SECRET>.
 *
 * Flow: download the zip-level Redfin market-tracker TSV, parse rows for the
 * Beaufort County zips we care about, map zip → neighborhood(s), compute the
 * latest month's metrics, upsert into market_trends.
 *
 * Redfin publishes tab-separated .tsv (often gzipped). This handler fetches the
 * configured CSV/TSV URL as text. If the file is gzipped, point
 * REDFIN_DATA_BASE_URL at the uncompressed mirror or extend with a gunzip step.
 */

import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createServiceClient } from '@/utils/supabase/service';
import {
  NEIGHBORHOOD_REDFIN_REGIONS,
  type RedfinRegionMapping,
} from '@/data/realEstateTrends';
import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return (req.headers.get('authorization') || '') === `Bearer ${expected}`;
}

type RedfinRow = Record<string, string>;

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const base = process.env.REDFIN_DATA_BASE_URL;
  if (!base) {
    return NextResponse.json({ ok: false, error: 'REDFIN_DATA_BASE_URL not set' }, { status: 500 });
  }

  // Zip-level tracker file. Confirm exact filename at the source during exec.
  const url = `${base}/zip_code_market_tracker.tsv000`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'HiltonAhead/1.0' } });
    if (!res.ok) throw new Error(`Redfin fetch ${res.status}`);
    const text = await res.text();

    const parsed = Papa.parse<RedfinRow>(text, {
      header: true,
      delimiter: '\t',
      skipEmptyLines: true,
    });

    // Collect all zips we care about.
    const wantedZips = new Set<string>();
    const slugsByZip = new Map<string, RentalNeighborhoodSlug[]>();
    for (const [slug, m] of Object.entries(NEIGHBORHOOD_REDFIN_REGIONS) as [
      RentalNeighborhoodSlug,
      RedfinRegionMapping,
    ][]) {
      for (const zip of m.zipCodes) {
        wantedZips.add(zip);
        slugsByZip.set(zip, [...(slugsByZip.get(zip) ?? []), slug]);
      }
    }

    // Redfin column names (zip tracker): region (e.g. "Zip Code: 29928"),
    // period_end, median_sale_price, median_ppsf, median_dom,
    // homes_sold, median_sale_price_yoy. Defend against schema drift.
    type Agg = {
      slug: RentalNeighborhoodSlug;
      month: string;
      median_sale_price: number | null;
      median_ppsf: number | null;
      median_dom: number | null;
      homes_sold: number | null;
      yoy_pct: number | null;
    };
    const latestBySlug = new Map<RentalNeighborhoodSlug, Agg>();

    for (const row of parsed.data) {
      const region = row['region'] || '';
      const zip = region.replace(/[^0-9]/g, '').slice(-5);
      if (!wantedZips.has(zip)) continue;
      const period = row['period_end'];
      if (!period) continue;

      for (const slug of slugsByZip.get(zip) ?? []) {
        const prev = latestBySlug.get(slug);
        if (prev && prev.month >= period) continue; // keep latest period only
        latestBySlug.set(slug, {
          slug,
          month: period,
          median_sale_price: num(row['median_sale_price']),
          median_ppsf: num(row['median_ppsf']),
          median_dom: int(row['median_dom']),
          homes_sold: int(row['homes_sold']),
          yoy_pct: pct(row['median_sale_price_yoy']),
        });
      }
    }

    if (latestBySlug.size === 0) {
      return NextResponse.json(
        { ok: true, skipped: 'no_matching_rows', wanted: [...wantedZips] },
        { status: 200 },
      );
    }

    const supabase = createServiceClient();
    const rows = [...latestBySlug.values()].map((a) => ({
      neighborhood_slug: a.slug,
      month: a.month,
      median_sale_price: a.median_sale_price,
      median_ppsf: a.median_ppsf,
      median_dom: a.median_dom,
      homes_sold: a.homes_sold,
      yoy_pct: a.yoy_pct,
      source: 'redfin-data-center',
      source_url: url,
    }));

    const { error } = await supabase
      .from('market_trends')
      .upsert(rows, { onConflict: 'neighborhood_slug,month' });
    if (error) throw new Error(`upsert failed: ${error.message}`);

    return NextResponse.json({ ok: true, upserted: rows.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[refresh-market-data] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

function num(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v.replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}
function int(v: string | undefined): number | null {
  const n = num(v);
  return n === null ? null : Math.round(n);
}
function pct(v: string | undefined): number | null {
  // Redfin yoy is a fraction (0.123 = 12.3%). Store as percent.
  const n = num(v);
  return n === null ? null : Math.round(n * 1000) / 10;
}
```

- [ ] **Step 2: Register the cron in `vercel.json`**

If `vercel.json` exists, add to its `crons` array; otherwise create it. Merge with any existing crons — do not clobber.

```json
{
  "crons": [
    { "path": "/api/cron/refresh-market-data", "schedule": "0 6 1 * *" }
  ]
}
```

- [ ] **Step 3: Typecheck + manual auth check**

Run: `npm run typecheck`. Then `npm run dev` and verify auth gating:

```bash
curl -i http://localhost:3000/api/cron/refresh-market-data            # expect 401
curl -i -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/refresh-market-data  # expect 200 or a clear error JSON
```

> If the live Redfin filename/columns differ, the handler returns a clear error rather than corrupting data — fix the URL/column names then re-run. Confirm the exact `zip_code_market_tracker` filename + column headers from the source during execution.

- [ ] **Step 4: Commit**

```bash
git add app/api/cron/refresh-market-data/route.ts vercel.json
git commit -m "feat(real-estate): add monthly Redfin market-data refresh cron"
```

---

### Task B7: MarketStatsCard component

**Files:**
- Create: `components/real-estate/MarketStatsCard.tsx`
- Create: `app/lib/marketTrends.ts` (server read helper)

- [ ] **Step 1: Create the server read helper `app/lib/marketTrends.ts`**

```ts
import { createClient } from '@/utils/supabase/server';

export type MarketTrendRow = {
  neighborhood_slug: string;
  month: string;
  median_sale_price: number | null;
  median_ppsf: number | null;
  median_dom: number | null;
  homes_sold: number | null;
  yoy_pct: number | null;
};

/** Read up to `limit` most-recent months for a neighborhood (public RLS read). */
export async function getMarketTrends(
  slug: string,
  limit = 24,
): Promise<MarketTrendRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('market_trends')
      .select('neighborhood_slug, month, median_sale_price, median_ppsf, median_dom, homes_sold, yoy_pct')
      .eq('neighborhood_slug', slug)
      .order('month', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('[marketTrends] read error:', error);
      return [];
    }
    return (data ?? []) as MarketTrendRow[];
  } catch (err) {
    console.error('[marketTrends] unexpected:', err);
    return [];
  }
}
```

- [ ] **Step 2: Create `components/real-estate/MarketStatsCard.tsx`**

```tsx
import type { MarketTrendRow } from '@/app/lib/marketTrends';

function money(n: number | null): string {
  if (n === null) return '—';
  return `$${Math.round(n).toLocaleString()}`;
}

export default function MarketStatsCard({ latest }: { latest?: MarketTrendRow }) {
  if (!latest) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Market data for this neighborhood is being compiled.
      </div>
    );
  }
  const stats = [
    { label: 'Median sale price', value: money(latest.median_sale_price) },
    { label: 'Median $/sqft', value: money(latest.median_ppsf) },
    { label: 'Days on market', value: latest.median_dom ?? '—' },
    {
      label: 'YoY change',
      value: latest.yoy_pct === null ? '—' : `${latest.yoy_pct > 0 ? '+' : ''}${latest.yoy_pct}%`,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-rule-soft bg-sand-soft p-4 text-center">
          <div className="display text-2xl font-medium text-ink">{s.value}</div>
          <div className="mt-1 text-xs text-ink-soft">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npm run typecheck
git add app/lib/marketTrends.ts components/real-estate/MarketStatsCard.tsx
git commit -m "feat(real-estate): add market-trends read helper + stats card"
```

---

### Task B8: TrendChart component (Recharts, client)

**Files:**
- Create: `components/real-estate/TrendChart.tsx`

- [ ] **Step 1: Create the chart**

```tsx
'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { MarketTrendRow } from '@/app/lib/marketTrends';

export default function TrendChart({ rows }: { rows: MarketTrendRow[] }) {
  // rows come newest-first; chart wants oldest-first.
  const data = [...rows]
    .reverse()
    .map((r) => ({
      month: r.month?.slice(0, 7) ?? '',
      price: r.median_sale_price ?? null,
    }))
    .filter((d) => d.price !== null);

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Not enough history yet to chart a trend.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rule-soft bg-sand-soft p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink">Median sale price (24 mo)</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,41,48,0.08)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              width={48}
            />
            <Tooltip
              formatter={(v: number) => [`$${Math.round(v).toLocaleString()}`, 'Median']}
            />
            <Line type="monotone" dataKey="price" stroke="#C44A2B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/real-estate/TrendChart.tsx
git commit -m "feat(real-estate): add median-price trend chart (recharts)"
```

> recharts v3 is React-19 compatible. If `npm run build` later flags an SSR issue, the component is already `'use client'`; ensure it's only imported by client/RSC-safe parents (it is — rendered inside the section component below).

---

### Task B9: MarketPriceMap component (Mapbox, client)

**Files:**
- Create: `components/real-estate/MarketPriceMap.tsx`

> Named `MarketPriceMap` (not `MarketHeatMap` from the spec) because with only center coordinates available — not parcel polygons — this renders **graduated circle markers** colored by price tier, which is the honest representation. True polygon boundaries are out of scope (matches the "no per-transaction" decision).

- [ ] **Step 1: Create the map**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { priceTierFor, PRICE_TIERS } from '@/data/realEstateTrends';

export type PricePoint = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  medianSalePrice: number | null;
};

export default function MarketPriceMap({
  points,
  center,
  zoom = 11,
  focusSlug,
}: {
  points: PricePoint[];
  center: { lat: number; lng: number };
  zoom?: number;
  focusSlug?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !ref.current || mapRef.current) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom,
      attributionControl: true,
    });
    mapRef.current = map;

    for (const p of points) {
      if (p.medianSalePrice === null) continue;
      const tier = priceTierFor(p.medianSalePrice);
      const el = document.createElement('div');
      const size = p.slug === focusSlug ? 26 : 18;
      el.style.cssText = `width:${size}px;height:${size}px;border-radius:9999px;background:#${tier.colorHex};border:2px solid #FBF3E2;box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:pointer;`;
      const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(
        `<strong>${p.name}</strong><br/>Median: $${Math.round(p.medianSalePrice).toLocaleString()}<br/><span style="color:#666">${tier.label}</span>`,
      );
      new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points, center.lat, center.lng, zoom, focusSlug]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Map unavailable — set NEXT_PUBLIC_MAPBOX_TOKEN.
      </div>
    );
  }

  return (
    <div>
      <div ref={ref} className="h-[360px] w-full overflow-hidden rounded-2xl border border-rule-soft" />
      <div className="mt-3 flex flex-wrap gap-3">
        {PRICE_TIERS.map((t) => (
          <span key={t.key} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className="h-3 w-3 rounded-full" style={{ background: `#${t.colorHex}` }} />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/real-estate/MarketPriceMap.tsx
git commit -m "feat(real-estate): add Mapbox price-tier map (graduated markers)"
```

---

### Task B10: RealtorBio component

**Files:**
- Create: `components/real-estate/RealtorBio.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { realEstatePartner } from '@/data/realEstatePartner';

export default function RealtorBio() {
  const p = realEstatePartner;
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-rule-soft bg-sand-soft p-5">
      {p.headshotSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.headshotSrc}
          alt={p.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="display text-lg font-medium text-ink">{p.name}</h3>
        {p.brokerage && <p className="text-xs text-ink-soft">{p.brokerage}</p>}
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.bio}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/real-estate/RealtorBio.tsx
git commit -m "feat(real-estate): add partner Realtor bio component"
```

---

### Task B11: RealtorReferralForm component (client)

**Files:**
- Create: `components/real-estate/RealtorReferralForm.tsx`

- [ ] **Step 1: Create the form**

```tsx
'use client';

import { useState } from 'react';

export default function RealtorReferralForm({ neighborhoodSlug }: { neighborhoodSlug?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      intent: String(fd.get('intent') || ''),
      message: String(fd.get('message') || ''),
      neighborhoodSlug: neighborhoodSlug ?? '',
      sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      const res = await fetch('/api/real-estate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-palm/30 bg-palm-light/20 p-6 text-center">
        <p className="text-sm font-semibold text-palm">Thanks — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-rule-soft bg-sand-soft p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Name" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <input name="phone" placeholder="Phone (optional)" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <select name="intent" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" defaultValue="">
          <option value="" disabled>I&apos;m interested in…</option>
          <option value="buying">Buying</option>
          <option value="selling">Selling</option>
          <option value="both">Both</option>
          <option value="browsing">Just browsing</option>
        </select>
      </div>
      <textarea name="message" rows={3} placeholder="Anything specific you're looking for?" className="w-full rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-widest text-sand transition-colors hover:bg-ocean disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Connect with our Realtor'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-coral-deep">Something went wrong. Please email hello@hiltonahead.com.</p>
      )}
      <p className="text-xs text-ink-soft">
        Referral disclosure: if you connect with our Realtor partner and complete
        a transaction, we may receive a referral fee — your costs are unaffected.
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/real-estate/RealtorReferralForm.tsx
git commit -m "feat(real-estate): add Realtor referral form (client)"
```

---

### Task B12: MarketTrendsSection + wire into neighborhood page

**Files:**
- Create: `components/real-estate/MarketTrendsSection.tsx`
- Modify: `app/vacation-rentals/[slug]/page.tsx`

- [ ] **Step 1: Create the section (server component; assembles map + stats + chart + form)**

```tsx
import { getMarketTrends } from '@/app/lib/marketTrends';
import { getRentalArea, allRentalAreas } from '@/data/vacationRentals';
import { NEIGHBORHOOD_REDFIN_REGIONS } from '@/data/realEstateTrends';
import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';
import MarketStatsCard from '@/components/real-estate/MarketStatsCard';
import TrendChart from '@/components/real-estate/TrendChart';
import MarketPriceMap, { type PricePoint } from '@/components/real-estate/MarketPriceMap';
import RealtorBio from '@/components/real-estate/RealtorBio';
import RealtorReferralForm from '@/components/real-estate/RealtorReferralForm';

export default async function MarketTrendsSection({ slug }: { slug: RentalNeighborhoodSlug }) {
  const area = getRentalArea(slug);
  if (!area) return null;

  const rows = await getMarketTrends(slug, 24);
  const latest = rows[0];

  // Build island-wide price points for the map (latest median per neighborhood).
  const allAreas = allRentalAreas();
  const points: PricePoint[] = [];
  for (const a of allAreas) {
    const r = (await getMarketTrends(a.slug, 1))[0];
    points.push({
      slug: a.slug,
      name: a.name,
      lat: a.geofence.center.lat,
      lng: a.geofence.center.lng,
      medianSalePrice: r?.median_sale_price ?? null,
    });
  }

  const blurb = NEIGHBORHOOD_REDFIN_REGIONS[slug]?.blurb;

  return (
    <section className="mx-auto mb-16 max-w-4xl">
      <h2 className="display mb-2 text-2xl font-medium text-ink md:text-3xl">
        {area.name} real estate market trends
      </h2>
      {blurb && <p className="mb-6 text-sm text-ink-soft">{blurb}</p>}

      <div className="mb-6">
        <MarketStatsCard latest={latest} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarketPriceMap
          points={points}
          center={area.geofence.center}
          zoom={11}
          focusSlug={slug}
        />
        <TrendChart rows={rows} />
      </div>

      <p className="mb-8 text-xs text-ink-soft">
        Source: Redfin Data Center
        {latest?.month ? `, data through ${latest.month}` : ''}. Market figures
        are informational and not investment advice.
      </p>

      <div className="rounded-3xl border border-rule-soft bg-white p-6">
        <h3 className="display mb-4 text-xl font-medium text-ink">
          Considering buying or selling in {area.name}?
        </h3>
        <div className="mb-5">
          <RealtorBio />
        </div>
        <RealtorReferralForm neighborhoodSlug={slug} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into the neighborhood page**

In `app/vacation-rentals/[slug]/page.tsx`, add the import:

```tsx
import MarketTrendsSection from '@/components/real-estate/MarketTrendsSection';
```

Replace the Phase-B insertion-point comment block with:

```tsx
        {/* Real estate market trends */}
        <MarketTrendsSection slug={area.slug} />
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck`, then `npm run dev` → `/vacation-rentals/sea-pines`. Expect the market-trends section: stats (likely "—" until cron runs), map (markers appear once data exists), chart placeholder, Realtor bio + form. Stop dev.

- [ ] **Step 4: Lint + commit**

```bash
npm run lint
git add components/real-estate/MarketTrendsSection.tsx app/vacation-rentals/[slug]/page.tsx
git commit -m "feat(real-estate): assemble market-trends section into neighborhood pages"
```

---

### Task B13: Phase B integration test + build gate

**Files:**
- Modify: `tests/vacation-rentals.spec.ts`

- [ ] **Step 1: Add real-estate assertions**

Append to `tests/vacation-rentals.spec.ts`:

```ts
test.describe('Real estate trends section', () => {
  test('renders the trends heading and referral form on a neighborhood page', async ({ page }) => {
    await page.goto('/vacation-rentals/sea-pines');
    await expect(page.getByRole('heading', { name: /real estate market trends/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Connect with our Realtor/i })).toBeVisible();
    // Referral disclosure present
    await expect(page.getByText(/Referral disclosure/i)).toBeVisible();
  });

  test('referral form submits and shows confirmation', async ({ page }) => {
    // Stub the API so the test is hermetic (no real email/DB).
    await page.route('**/api/real-estate-inquiry', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );
    await page.goto('/vacation-rentals/sea-pines');
    await page.fill('input[name="name"]', 'Test Buyer');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.getByRole('button', { name: /Connect with our Realtor/i }).click();
    await expect(page.getByText(/we'll be in touch/i)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the full Playwright suite**

Run: `npx playwright test --project=chromium`
Expected: PASS (rentals + real-estate specs, plus the data-module specs from A1/A2/A3/B2).

- [ ] **Step 3: Production build gate**

Run: `npm run build`
Expected: PASS. Watch for: `mapbox-gl` accessing `window` during SSR (it's in a `'use client'` component guarded by `useEffect`, so safe); recharts SSR (also client-guarded).

- [ ] **Step 4: Commit**

```bash
git add tests/vacation-rentals.spec.ts
git commit -m "test(real-estate): add trends section + referral form integration tests"
```

---

### Task B14: LLM-citation re-sync + final lint/build

**Files:**
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`

- [ ] **Step 1: Re-sync the LLM context files**

Per CLAUDE.md these are **manually maintained** (not generated). Add a "Vacation Rentals" section to `public/llms.txt` linking the hub + 6 neighborhood pages, and a longer entry in `public/llms-full.txt` summarizing: what each neighborhood offers, price bands, and that the site surfaces a live Stay22 map + curated picks + per-neighborhood real estate trends with a Realtor referral path.

Add to `public/llms.txt` (under the appropriate links section):

```
## Vacation Rentals
- [Hilton Head Vacation Rentals (hub)](https://www.hiltonahead.com/vacation-rentals): villas, condos, and homes by neighborhood with a live map, price bands, amenities, and reviews.
- [Sea Pines Rentals](https://www.hiltonahead.com/vacation-rentals/sea-pines)
- [Palmetto Dunes Rentals](https://www.hiltonahead.com/vacation-rentals/palmetto-dunes)
- [Forest Beach Rentals](https://www.hiltonahead.com/vacation-rentals/forest-beach)
- [Shelter Cove Rentals](https://www.hiltonahead.com/vacation-rentals/shelter-cove)
- [Port Royal Rentals](https://www.hiltonahead.com/vacation-rentals/port-royal)
- [Mid-Island Rentals](https://www.hiltonahead.com/vacation-rentals/mid-island)
```

- [ ] **Step 2: Final full gate**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: all PASS.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt public/llms-full.txt
git commit -m "docs(rentals): re-sync llms.txt with vacation rentals + real estate surface"
```

**✅ Phase B complete.**

---

## Self-Review

**1. Spec coverage** — every spec section maps to a task:

| Spec section | Task(s) |
|---|---|
| §3 Routes + nav | A11, A12, A13 |
| §4.1 rentalsCatalog | A1 |
| §4.2 vacationRentals editorial | A2 |
| §4.3 stay22.ts + affiliateLinks #13 | A3, A4 |
| §4.4 market_trends migration + realEstateTrends | B1, B2 |
| §4.5 refresh cron | B6 |
| §4.6 realEstatePartner + inquiry pipeline | B3, B4, B5 |
| §5.1 rentals components | A5–A10 |
| §5.2 real-estate components | B7–B11 |
| §5.3 page composition | A11, A12, B12 |
| §6 schema/JSON-LD | A11, A12 (Breadcrumb/Place/FAQ/ItemList/Speakable) |
| §7 SEO + LLM-citation | A11, A12, B14 |
| §8 FTC disclosure | A11, A12 (disclosure lines), A5/A8 (`rel="sponsored"`), B11 (referral disclosure) |
| §9 env vars | A0 |
| §10 testing | A1/A2/A3/B2 (module), A14/B13 (integration) |
| §13 acceptance criteria | covered across A14 + B13 + B14 |

**Gap fixed:** spec §5.1 listed a `RentalMap`/"Load more" client component; YAGNI-cut "Load more" in A7 with explicit rationale (≤6 cards). Spec §5.2 named `MarketHeatMap`; renamed to `MarketPriceMap` (B9) with rationale (no parcel polygons → graduated markers). Both deviations documented, not silent.

**2. Placeholder scan** — no "TBD/TODO" left in code steps. The only deferred-content markers are: (a) seed catalog with 1 entry/neighborhood (owner curation, explicitly a launch open-item, not a code placeholder); (b) `realEstatePartner` generic default (intentional, email via env); (c) instruction to copy exact lat/lng from `data/neighborhoods.ts` in A2 (a concrete 2-min lookup, with sea-pines done as the worked example). Each is a real, actionable instruction, not a vague "fill in later."

**3. Type consistency** — verified names across tasks: `CatalogRental`, `RentalNeighborhoodSlug`, `RENTAL_NEIGHBORHOODS`, `rentalsByNeighborhood`, `allRentals` (A1) used identically in A5/A7/A11/A12/B12. `RentalAreaContent`, `getRentalArea`, `allRentalAreas` (A2) used identically in A8/A11/A12/B12. `withStay22Params`, `stay22MapEmbedSrc`, `stay22SearchDeeplink`, `STAY22_AID`, `Stay22Center` (A3) used identically in A5/A8/A10. `MarketTrendRow`, `getMarketTrends` (B7) used in B8/B12. `priceTierFor`, `PRICE_TIERS`, `NEIGHBORHOOD_REDFIN_REGIONS` (B2) used in B6/B9/B12. `PricePoint` (B9) used in B12. `sendRealEstateInquiryNotification` (B4) used in B5. No mismatches.

**4. Known external unknowns flagged inline (not placeholders, but verify-at-execution):**
- Stay22 exact embed path/params → confirm in dashboard (A10 note).
- Redfin exact filename + column headers → confirm at source (B6 note).
- `metadata.ts` helper signatures → adjust call sites if they differ (A11 step 2 note).
- `playwright.config.ts` `webServer` → confirm it boots the app or start dev manually (A14 note).
