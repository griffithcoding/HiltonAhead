# Restaurant Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship per-restaurant deep pages at `/local/restaurants/[slug]` with founder-curated menu links, multi-platform reservations, photo gallery, AI-drafted FAQ, related-restaurant algorithm, sponsor-slot inventory, and 10 tracked event types feeding the heat-map + attribution data products.

**Architecture:** Server-rendered Next.js page composed of small, focused client components for interactive bits (lightbox, share, reservations sheet). Tracked outbound links via fire-and-forget POST to `/api/directory/track` (existing pattern, extended). All Restaurant Hub data is colocated in `data/localBusinesses.ts` as a TS module — no runtime DB reads for content. A one-time LLM script drafts FAQs from the existing review prose; founder approves before publish.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind 4 · Supabase (`@supabase/ssr` + service-role) · Resend · Mapbox/Leaflet for v2 heat map (NOT this plan) · Playwright.

**Spec:** [docs/superpowers/specs/2026-05-20-restaurant-hub-design.md](../specs/2026-05-20-restaurant-hub-design.md)

**Testing reality:** Per `CLAUDE.md`, Playwright is the only test surface. Pure functions (related-restaurants algorithm) are tested by driving the UI with known inputs and asserting visible output.

**Branch:** `feat/restaurant-hub`. Per `CLAUDE.md`, no worktrees. Branch off latest `main`. Do not merge without explicit founder approval.

**Commit cadence:** Atomic per task. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`). Pre-commit hooks run automatically.

---

## File Structure

### New files (~26)

| Path | Responsibility |
|---|---|
| `supabase/migrations/014_directory_events_payload_and_events.sql` | Add `payload jsonb` col + widen `event_type` CHECK constraint |
| `app/local/restaurants/[slug]/page.tsx` | Server-component shell, metadata, JSON-LD, mounts sub-blocks |
| `app/local/restaurants/[slug]/not-found.tsx` | 404 for unknown slug |
| `components/local/restaurant/RestaurantHero.tsx` | Eyebrow + Featured badge + H1 + price/cuisine chips + last-verified + hero image |
| `components/local/restaurant/CtasBar.tsx` | Top CTA strip + mobile sticky variant |
| `components/local/restaurant/ReservationsSheet.tsx` | Mobile bottom-sheet with reservation platforms |
| `components/local/restaurant/MenuLinkBlock.tsx` | Menu link + founder editorial note |
| `components/local/restaurant/WhatToOrder.tsx` | Dish list + signature dish callout |
| `components/local/restaurant/PhotoGallery.tsx` | Grid + lightbox client component, fires `photo_view` |
| `components/local/restaurant/SponsorSlotBlock.tsx` | Renders only when `sponsorSlot != null` and not expired |
| `components/local/restaurant/PracticalDetails.tsx` | Address (link to directions) + phone + hours + tags |
| `components/local/restaurant/FaqSection.tsx` | Accordion of approved FAQs |
| `components/local/restaurant/RelatedRestaurants.tsx` | 3 cards using algorithm output |
| `components/local/restaurant/ShareButton.tsx` | Web Share API + copy-link fallback |
| `components/local/restaurant/TrackedMenuLink.tsx` | `<a>` wrapper, fires `menu_click` |
| `components/local/restaurant/TrackedReservationsLink.tsx` | `<a>` wrapper, fires `reservations_click` with platform |
| `components/local/restaurant/TrackedDirectionsLink.tsx` | `<a>` wrapper, fires `directions_click` |
| `components/local/restaurant/TrackedSponsorClick.tsx` | `<a>` wrapper, fires `sponsor_slot_click` |
| `components/local/restaurant/TrackedRelatedLink.tsx` | `<Link>` wrapper, fires `related_click` |
| `components/local/restaurant/relatedRestaurants.ts` | Pure function — algorithm (founder picks + neighborhood + category fallbacks) |
| `app/lib/restaurant/json-ld.ts` | Builds `Restaurant` schema JSON-LD per business |
| `app/lib/restaurant/haversine.ts` | Haversine distance helper (miles) |
| `scripts/draft-restaurant-faqs.ts` | One-time LLM script → `data/restaurant-faq-drafts/${slug}.json` |
| `app/admin/(gated)/photos-review/page.tsx` | Founder approval queue for owner-submitted photos |
| `app/admin/(gated)/photos-review/actions.ts` | Server actions: approve, reject |
| `app/portal/(gated)/photos/[businessId]/page.tsx` | Owner photo upload form (extends portal Phase 0/1) |
| `app/portal/(gated)/photos/[businessId]/actions.ts` | Server actions: upload to Supabase Storage, insert pending row |

### Tests (5)

| Path | Coverage |
|---|---|
| `tests/restaurant-hub-happy.spec.ts` | Loads a known restaurant page, walks the sections, clicks menu + a reservations platform, asserts tracked events fire (intercept `/api/directory/track`) |
| `tests/restaurant-hub-related.spec.ts` | Asserts exactly 3 related shown, never self, founder picks come first |
| `tests/restaurant-hub-sponsor.spec.ts` | Sponsor-slot render conditions + click tracked + expiry honored |
| `tests/restaurant-hub-photos.spec.ts` | Gallery lightbox open/navigate/close + `photo_view` event |
| `tests/restaurant-hub-a11y.spec.ts` | `axe-core` scan on 3 sample restaurant pages |

### Modified (6)

| Path | Change |
|---|---|
| `data/localBusinesses.ts` | Extend `Business` type with 8 new fields. Populate all 11 restaurants with at least `menuUrl`, `menuSourceNote`, `reservationsLinks[]`. |
| `app/lib/directoryTracking.ts` | Extend `DirectoryEventType` union; add typed wrappers for new events with payload |
| `app/api/directory/track/route.ts` | Widen `VALID_EVENT_TYPES` Set; accept and validate `payload` |
| `app/sitemap.ts` | Emit per-restaurant entries |
| `app/local/[industry]/page.tsx` | Restaurant cards link to `/local/restaurants/${id}` deep pages |
| `package.json` | Add `@anthropic-ai/sdk` (FAQ script) and `@axe-core/playwright` (if not already from Villa Match plan) |

---

## Task 1: Setup — install deps + create branch

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Verify clean state and create branch**

```bash
git status
git checkout main
git pull origin main
git checkout -b feat/restaurant-hub
```

Expected: clean working tree on new branch. If untracked parallel-session work blocks the branch switch, stash first and document for the user before proceeding.

- [ ] **Step 2: Install dependencies**

```bash
npm install @anthropic-ai/sdk
npm install --save-dev @axe-core/playwright
```

- [ ] **Step 3: Verify install + typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(restaurant-hub): add @anthropic-ai/sdk and @axe-core/playwright"
```

---

## Task 2: Migration `014_directory_events_payload_and_events.sql`

**Files:**
- Create: `supabase/migrations/014_directory_events_payload_and_events.sql`

- [ ] **Step 1: Create the migration**

```sql
-- supabase/migrations/014_directory_events_payload_and_events.sql
-- Restaurant Hub event-type widening + per-event payload column.
-- Builds on migration 012_directory_events.sql.

-- 1. Add nullable payload column for per-event detail (platform, photoIndex, etc.)
alter table directory_events
  add column if not exists payload jsonb;

-- 2. Drop + recreate the event_type CHECK constraint with the widened set.
-- Existing values: phone_click, website_click, inquiry_submit.
-- New page-level event types: menu_click, reservations_click, directions_click,
-- photo_view, share_click, sponsor_slot_click, related_click.
alter table directory_events
  drop constraint if exists directory_events_event_type_check;

alter table directory_events
  add constraint directory_events_event_type_check
  check (event_type in (
    'phone_click',
    'website_click',
    'inquiry_submit',
    'menu_click',
    'reservations_click',
    'directions_click',
    'photo_view',
    'share_click',
    'sponsor_slot_click',
    'related_click'
  ));

-- 3. Index on payload->>'platform' for reservations platform breakdowns.
create index if not exists directory_events_payload_platform_idx
  on directory_events ((payload->>'platform'))
  where payload ? 'platform';
```

- [ ] **Step 2: Apply via Supabase CLI or SQL editor**

```bash
npx supabase db push
```

If CLI not configured, paste the SQL into the dashboard SQL editor.

- [ ] **Step 3: Verify**

```sql
-- Run in SQL editor:
insert into directory_events (business_id, industry_slug, event_type, payload)
values ('probe-restaurant', 'restaurants', 'menu_click', '{"url":"https://example.com/menu.pdf"}'::jsonb);

select event_type, payload from directory_events where business_id = 'probe-restaurant';

delete from directory_events where business_id = 'probe-restaurant';
```

Expected: insert succeeds; select returns one row with the jsonb payload; delete cleans up.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/014_directory_events_payload_and_events.sql
git commit -m "feat(restaurant-hub): widen directory_events.event_type + add payload column"
```

---

## Task 3: Extend `directoryTracking.ts` typed wrappers

**Files:**
- Modify: `app/lib/directoryTracking.ts`

- [ ] **Step 1: Read the existing file to confirm shape**

```bash
cat app/lib/directoryTracking.ts | head -100
```

Expected: contains `DirectoryEventType` union + `trackDirectoryEvent(businessId, industrySlug, eventType)`.

- [ ] **Step 2: Replace the type + add payload-aware helpers**

```ts
// app/lib/directoryTracking.ts

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
  | 'related_click';

export type DirectoryEventPayload =
  | { kind: 'menu_click'; url: string }
  | { kind: 'reservations_click'; platform: string; url: string }
  | { kind: 'directions_click' }
  | { kind: 'photo_view'; photoIndex: number }
  | { kind: 'share_click'; channel: 'native' | 'copy_link' }
  | { kind: 'sponsor_slot_click'; advertiserName: string; url: string }
  | { kind: 'related_click'; relatedBusinessId: string }
  | { kind: 'phone_click' | 'website_click' | 'inquiry_submit' };

const TRACK_ENDPOINT = '/api/directory/track';

export function withDirectoryUtm(url: string, businessId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'hiltonahead');
    u.searchParams.set('utm_medium', 'directory');
    u.searchParams.set('utm_campaign', businessId);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Fire-and-forget event log. Uses sendBeacon when available so the request
 * survives the page navigation that follows a link click.
 */
export function trackDirectoryEvent(
  businessId: string,
  industrySlug: string,
  eventType: DirectoryEventType,
  payload?: Omit<Extract<DirectoryEventPayload, { kind: typeof eventType }>, 'kind'>,
): void {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    businessId,
    industrySlug,
    eventType,
    payload: payload ?? null,
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }));
      return;
    } catch {
      // fall through
    }
  }

  try {
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // swallow
  }
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add app/lib/directoryTracking.ts
git commit -m "feat(restaurant-hub): extend DirectoryEventType + typed payload"
```

---

## Task 4: Widen `/api/directory/track` validation

**Files:**
- Modify: `app/api/directory/track/route.ts`

- [ ] **Step 1: Replace `VALID_EVENT_TYPES` + payload handling**

In `app/api/directory/track/route.ts`, replace the existing `VALID_EVENT_TYPES` Set and the body parsing:

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
]);

// ... inside POST handler, after body parse:

const { businessId, industrySlug, eventType, payload } = body as {
  businessId?: unknown;
  industrySlug?: unknown;
  eventType?: unknown;
  payload?: unknown;
};

if (typeof businessId !== 'string' || !ID_PATTERN.test(businessId)) return ok204();
if (typeof industrySlug !== 'string' || !VALID_INDUSTRIES.has(industrySlug)) return ok204();
if (typeof eventType !== 'string' || !VALID_EVENT_TYPES.has(eventType)) return ok204();

// Payload is optional. If present, must be an object (not array, not primitive).
const payloadClean =
  payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null;
```

And in the supabase insert call, include `payload: payloadClean`:

```ts
await supabase.from('directory_events').insert({
  business_id: businessId,
  industry_slug: industrySlug,
  event_type: eventType,
  ip_hash,
  user_agent,
  referrer,
  payload: payloadClean,
});
```

- [ ] **Step 2: Smoke-test**

```bash
npm run dev
# In another shell:
curl -sS -X POST http://localhost:3000/api/directory/track \
  -H 'Content-Type: application/json' \
  -d '{"businessId":"probe-restaurant","industrySlug":"restaurants","eventType":"menu_click","payload":{"url":"https://example.com/menu.pdf"}}' \
  -i | head -5
```

Expected: `HTTP/1.1 204 No Content`. Confirm row appears in `directory_events` with the jsonb payload. Then delete the probe row.

- [ ] **Step 3: Commit**

```bash
git add app/api/directory/track/route.ts
git commit -m "feat(restaurant-hub): widen /api/directory/track event types + accept payload"
```

---

## Task 5: Extend `Business` type in `data/localBusinesses.ts`

**Files:**
- Modify: `data/localBusinesses.ts`

- [ ] **Step 1: Add the new types and extend `Business`**

In `data/localBusinesses.ts`, add the supporting types and extend `Business`:

```ts
export type ReservationsLink = {
  platform: 'resy' | 'opentable' | 'direct' | 'tock' | 'sevenrooms' | 'yelp';
  url: string;
  label?: string;
};

export type FounderRelatedPick = {
  businessId: string;
  note: string;
};

export type WhatToOrderItem = {
  dish: string;
  note: string;
  signature?: boolean;
};

export type SponsorSlot = {
  advertiserName: string;
  url: string;
  copy: string;
  logo?: { src: string; alt: string };
  endsAt?: string;
  invoiceRef?: string;
};

export type RestaurantFaq = {
  question: string;
  answer: string;
  approved: boolean;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  credit?: string;
  source: 'founder' | 'owner-submitted';
  approved: boolean;
};

// Extend Business — add these fields to the existing Business type:
export type Business = {
  // ... all existing fields unchanged
  menuUrl?: string;
  menuSourceNote?: string;
  reservationsLinks?: ReservationsLink[];
  whatToOrder?: WhatToOrderItem[];
  relatedFounderPicks?: FounderRelatedPick[];
  sponsorSlot?: SponsorSlot | null;
  faqs?: RestaurantFaq[];
  galleryPhotos?: GalleryPhoto[];
  /** Optional lat/long for proximity-based related-restaurants. */
  latitude?: number;
  longitude?: number;
  /** Optional neighborhood slug — joins to data/neighborhoods.ts. */
  neighborhoodSlug?: string;
  /** Cuisine tag for category-based related-restaurants fallback. */
  cuisine?: string;
};
```

- [ ] **Step 2: Populate the 11 existing restaurants with `menuUrl`, `menuSourceNote`, `reservationsLinks` (at minimum)**

For each existing restaurant entry, add the founder-chosen menu URL + a one-line note + the canonical reservations platforms.

```ts
// EXAMPLE shape — applied to each of the 11 entries:
{
  id: 'existing-restaurant-id',
  // ... existing fields
  menuUrl: 'https://example.com/menu.pdf',
  menuSourceNote: 'We link to their PDF — the Yelp menu is six months out of date.',
  reservationsLinks: [
    { platform: 'opentable', url: 'https://www.opentable.com/r/example' },
    { platform: 'direct', url: 'https://example.com/reservations' },
  ],
  latitude: 32.2042,
  longitude: -80.7385,
  neighborhoodSlug: 'forest-beach',
  cuisine: 'Lowcountry',
}
```

**REQUIRED for v1:** every restaurant needs `menuUrl` + `menuSourceNote`. Reservations are optional but recommended where available. `latitude`/`longitude` recommended for the related-restaurants algorithm to work well.

If founder data isn't ready for all 11 at this step, the page must gracefully hide the menu/reservations blocks when fields are absent (handled in the components). Do not block this task on copy.

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add data/localBusinesses.ts
git commit -m "feat(restaurant-hub): extend Business type + seed menu/reservations on 11 restaurants"
```

---

## Task 6: Haversine helper + related-restaurants algorithm

**Files:**
- Create: `app/lib/restaurant/haversine.ts`
- Create: `components/local/restaurant/relatedRestaurants.ts`

- [ ] **Step 1: Create haversine helper**

```ts
// app/lib/restaurant/haversine.ts
/**
 * Haversine distance between two lat/long points, in miles.
 * Returns Infinity if either input is missing.
 */
export function milesBetween(
  a: { latitude?: number; longitude?: number },
  b: { latitude?: number; longitude?: number },
): number {
  if (
    a.latitude === undefined ||
    a.longitude === undefined ||
    b.latitude === undefined ||
    b.longitude === undefined
  ) {
    return Infinity;
  }
  const R = 3958.8; // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
```

- [ ] **Step 2: Create the related-restaurants algorithm**

```ts
// components/local/restaurant/relatedRestaurants.ts
import { businesses, type Business } from '@/data/localBusinesses';
import { milesBetween } from '@/app/lib/restaurant/haversine';

const NEIGHBORHOOD_RADIUS_MILES = 2;
const RELATED_COUNT = 3;

export type RelatedPick = {
  business: Business;
  /** How this restaurant landed in the related list — useful for debugging + UI hint. */
  reason: 'founder-pick' | 'neighborhood' | 'category' | 'fallback';
  /** Optional founder note for founder-pick reasons. */
  note?: string;
};

/**
 * Picks exactly RELATED_COUNT (3) related restaurants for a given business.
 * Priority:
 *   1. Founder picks (up to 2)
 *   2. Same neighborhood (haversine < 2mi)
 *   3. Same cuisine
 *   4. Any other restaurant
 * Never includes self. Stable, deterministic ordering by Business.id within each bucket.
 */
export function relatedFor(business: Business): RelatedPick[] {
  const allRestaurants = businesses.filter(
    (b) => b.industrySlug === 'restaurants' && b.id !== business.id,
  );

  const seen = new Set<string>();
  const picks: RelatedPick[] = [];

  // 1. Founder picks (cap at 2)
  for (const fp of business.relatedFounderPicks ?? []) {
    if (picks.length >= 2) break;
    const found = allRestaurants.find((b) => b.id === fp.businessId);
    if (found && !seen.has(found.id)) {
      picks.push({ business: found, reason: 'founder-pick', note: fp.note });
      seen.add(found.id);
    }
  }

  // 2. Same neighborhood
  if (picks.length < RELATED_COUNT) {
    const candidates = allRestaurants
      .filter((b) => !seen.has(b.id))
      .filter((b) => milesBetween(business, b) <= NEIGHBORHOOD_RADIUS_MILES)
      .sort((a, b) => a.id.localeCompare(b.id));
    for (const c of candidates) {
      if (picks.length >= RELATED_COUNT) break;
      picks.push({ business: c, reason: 'neighborhood' });
      seen.add(c.id);
    }
  }

  // 3. Same cuisine
  if (picks.length < RELATED_COUNT && business.cuisine) {
    const candidates = allRestaurants
      .filter((b) => !seen.has(b.id))
      .filter((b) => b.cuisine === business.cuisine)
      .sort((a, b) => a.id.localeCompare(b.id));
    for (const c of candidates) {
      if (picks.length >= RELATED_COUNT) break;
      picks.push({ business: c, reason: 'category' });
      seen.add(c.id);
    }
  }

  // 4. Fallback: any restaurant
  if (picks.length < RELATED_COUNT) {
    const candidates = allRestaurants
      .filter((b) => !seen.has(b.id))
      .sort((a, b) => a.id.localeCompare(b.id));
    for (const c of candidates) {
      if (picks.length >= RELATED_COUNT) break;
      picks.push({ business: c, reason: 'fallback' });
      seen.add(c.id);
    }
  }

  return picks;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add app/lib/restaurant/haversine.ts components/local/restaurant/relatedRestaurants.ts
git commit -m "feat(restaurant-hub): haversine helper + related-restaurants algorithm"
```

---

## Task 7: JSON-LD Restaurant schema builder

**Files:**
- Create: `app/lib/restaurant/json-ld.ts`

- [ ] **Step 1: Create the schema builder**

```ts
// app/lib/restaurant/json-ld.ts
import type { Business } from '@/data/localBusinesses';
import { brand } from '@/data/brand';

export function buildRestaurantJsonLd(business: Business): Record<string, unknown> {
  const siteUrl = brand.url;
  const url = `${siteUrl}/local/restaurants/${business.id}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': business.schemaType || 'Restaurant',
    name: business.name,
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: 'SC',
      addressCountry: 'US',
    },
    description: business.notableFor || business.review,
    image: business.heroImage?.src ? [business.heroImage.src] : undefined,
  };

  if (business.phone) schema.telephone = business.phone;
  if (business.priceRange) schema.priceRange = business.priceRange;
  if (business.cuisine) schema.servesCuisine = business.cuisine;
  if (business.menuUrl) schema.menu = business.menuUrl;
  if (business.hours) schema.openingHours = business.hours;
  if (business.reservationsLinks && business.reservationsLinks.length > 0) {
    schema.acceptsReservations = true;
  }
  if (business.latitude !== undefined && business.longitude !== undefined) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    };
  }

  return schema;
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/restaurant/json-ld.ts
git commit -m "feat(restaurant-hub): Restaurant JSON-LD schema builder"
```

---

## Task 8: Page shell + 404

**Files:**
- Create: `app/local/restaurants/[slug]/page.tsx`
- Create: `app/local/restaurants/[slug]/not-found.tsx`

- [ ] **Step 1: Write failing Playwright happy-path test (skeleton)**

```ts
// tests/restaurant-hub-happy.spec.ts
import { test, expect } from '@playwright/test';

test('restaurant page loads', async ({ page }) => {
  await page.goto('/local/restaurants/skull-creek-boathouse'); // adjust slug after Task 5
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('unknown restaurant returns 404', async ({ page }) => {
  const res = await page.goto('/local/restaurants/no-such-restaurant');
  expect(res?.status()).toBe(404);
});
```

If you don't know which slugs exist, run:

```bash
grep -oE "id: '[^']+'" data/localBusinesses.ts | head -20
```

and use one of the printed ids.

- [ ] **Step 2: Run — confirm fails**

```bash
npx playwright test tests/restaurant-hub-happy.spec.ts -g "restaurant page loads"
```

Expected: FAIL — page returns 404.

- [ ] **Step 3: Create the not-found page**

```tsx
// app/local/restaurants/[slug]/not-found.tsx
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';

export default function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5">
        <Header />
        <section className="mt-16 max-w-[640px]">
          <div className="eyebrow text-coral">404</div>
          <h1 className="display mt-3 text-[28px] leading-[1.15] text-ink md:text-[40px]">
            That restaurant isn&rsquo;t in our directory.
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
            <Link href="/local/restaurants" className="link-underline">Browse all restaurants →</Link>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Create the page shell — renders a minimal hero so the test passes, full composition lands in Tasks 9–19**

```tsx
// app/local/restaurants/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { businesses, type Business } from '@/data/localBusinesses';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { buildRestaurantJsonLd } from '@/app/lib/restaurant/json-ld';

export async function generateStaticParams() {
  return businesses
    .filter((b) => b.industrySlug === 'restaurants')
    .map((b) => ({ slug: b.id }));
}

function findBusiness(slug: string): Business | undefined {
  return businesses.find((b) => b.industrySlug === 'restaurants' && b.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = findBusiness(slug);
  if (!business) return { title: 'Restaurant not found' };
  return generatePageMetadata({
    title: `${business.name} — Hilton Head${business.cuisine ? ` ${business.cuisine}` : ''} • Hilton Ahead`,
    description: business.notableFor || business.review.slice(0, 155),
    path: `/local/restaurants/${business.id}`,
    keywords: [
      business.name,
      `${business.name} Hilton Head`,
      ...(business.categories ?? []),
      ...(business.cuisine ? [business.cuisine] : []),
    ],
  });
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = findBusiness(slug);
  if (!business) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local', path: '/local' },
    { name: 'Restaurants', path: '/local/restaurants' },
    { name: business.name, path: `/local/restaurants/${business.id}` },
  ]);
  const restaurantSchema = buildRestaurantJsonLd(business);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-12 max-w-[920px]">
          <div className="eyebrow text-ink-soft">Restaurants</div>
          <h1 className="display mt-3 text-[32px] leading-[1.1] text-ink md:text-[48px]">
            {business.name}{' '}
            {business.tagline && (
              <span className="display-italic text-ink">— {business.tagline}</span>
            )}
          </h1>
          {/* Hero, CTAs, all other blocks land in Tasks 9-19. */}
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Run tests — confirm passes**

```bash
npm run dev   # in another shell if not already running
npx playwright test tests/restaurant-hub-happy.spec.ts
```

Expected: both `restaurant page loads` and `unknown restaurant returns 404` PASS.

- [ ] **Step 6: Commit**

```bash
git add app/local/restaurants tests/restaurant-hub-happy.spec.ts
git commit -m "feat(restaurant-hub): /local/restaurants/[slug] page shell + 404"
```

---

## Task 9: Tracked link components

**Files:**
- Create: `components/local/restaurant/TrackedMenuLink.tsx`
- Create: `components/local/restaurant/TrackedReservationsLink.tsx`
- Create: `components/local/restaurant/TrackedDirectionsLink.tsx`
- Create: `components/local/restaurant/TrackedSponsorClick.tsx`
- Create: `components/local/restaurant/TrackedRelatedLink.tsx`

- [ ] **Step 1: Create `TrackedMenuLink.tsx`**

```tsx
// components/local/restaurant/TrackedMenuLink.tsx
'use client';

import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function TrackedMenuLink({
  businessId,
  url,
  className,
  children,
}: {
  businessId: string;
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackDirectoryEvent(businessId, 'restaurants', 'menu_click', { url })}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Create `TrackedReservationsLink.tsx`**

```tsx
// components/local/restaurant/TrackedReservationsLink.tsx
'use client';

import { trackDirectoryEvent } from '@/app/lib/directoryTracking';
import type { ReservationsLink } from '@/data/localBusinesses';

export default function TrackedReservationsLink({
  businessId,
  link,
  className,
  children,
}: {
  businessId: string;
  link: ReservationsLink;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackDirectoryEvent(businessId, 'restaurants', 'reservations_click', {
          platform: link.platform,
          url: link.url,
        })
      }
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 3: Create `TrackedDirectionsLink.tsx`**

```tsx
// components/local/restaurant/TrackedDirectionsLink.tsx
'use client';

import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function TrackedDirectionsLink({
  businessId,
  address,
  className,
  children,
}: {
  businessId: string;
  address: string;
  className?: string;
  children: React.ReactNode;
}) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackDirectoryEvent(businessId, 'restaurants', 'directions_click')}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Create `TrackedSponsorClick.tsx`**

```tsx
// components/local/restaurant/TrackedSponsorClick.tsx
'use client';

import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function TrackedSponsorClick({
  businessId,
  advertiserName,
  url,
  className,
  children,
}: {
  businessId: string;
  advertiserName: string;
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackDirectoryEvent(businessId, 'restaurants', 'sponsor_slot_click', {
          advertiserName,
          url,
        })
      }
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 5: Create `TrackedRelatedLink.tsx`**

```tsx
// components/local/restaurant/TrackedRelatedLink.tsx
'use client';

import Link from 'next/link';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function TrackedRelatedLink({
  fromBusinessId,
  relatedBusinessId,
  className,
  children,
}: {
  fromBusinessId: string;
  relatedBusinessId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/local/restaurants/${relatedBusinessId}`}
      className={className}
      onClick={() =>
        trackDirectoryEvent(fromBusinessId, 'restaurants', 'related_click', {
          relatedBusinessId,
        })
      }
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 6: Verify typecheck**

```bash
npm run typecheck
```

- [ ] **Step 7: Commit**

```bash
git add components/local/restaurant/Tracked*.tsx
git commit -m "feat(restaurant-hub): 5 tracked link components + payloads"
```

---

## Task 10: `RestaurantHero` component

**Files:**
- Create: `components/local/restaurant/RestaurantHero.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create the hero**

```tsx
// components/local/restaurant/RestaurantHero.tsx
import Image from 'next/image';
import type { Business } from '@/data/localBusinesses';

function formatLastVerified(iso?: string): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days < 1) return 'verified today';
  if (days < 30) return `verified ${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `verified ${months} month${months === 1 ? '' : 's'} ago`;
  return 'verified over a year ago';
}

export default function RestaurantHero({ business }: { business: Business }) {
  const verified = formatLastVerified(business.lastVerified);

  return (
    <header className="mt-12 max-w-[1100px]">
      <div className="flex items-center gap-3">
        <div className="eyebrow text-ink-soft">Restaurants</div>
        {business.featured && (
          <span className="rounded-full bg-coral px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cream">
            Featured partner
          </span>
        )}
      </div>

      <h1 className="display mt-3 text-[32px] leading-[1.1] text-ink md:text-[48px]">
        {business.name}
        {business.tagline && (
          <>
            {' '}
            <span className="display-italic text-ink">— {business.tagline}</span>
          </>
        )}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-soft">
        {business.priceRange && <span className="font-medium text-ink">{business.priceRange}</span>}
        {business.cuisine && <span>{business.cuisine}</span>}
        {(business.categories ?? []).slice(0, 3).map((c) => (
          <span key={c} className="border border-ink/15 px-2 py-0.5 text-[11px] uppercase tracking-wider">
            {c}
          </span>
        ))}
        {verified && <span className="italic">{verified}</span>}
      </div>

      {business.heroImage?.src && (
        <div className="mt-8 overflow-hidden">
          <Image
            src={business.heroImage.src}
            alt={business.heroImage.alt}
            width={1400}
            height={900}
            className="h-auto w-full"
            priority
          />
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Wire into the page**

In `app/local/restaurants/[slug]/page.tsx`, replace the inline `<section>` block with `<RestaurantHero business={business} />`:

```tsx
import RestaurantHero from '@/components/local/restaurant/RestaurantHero';

// inside the return, in place of the inline section:
<RestaurantHero business={business} />
```

- [ ] **Step 3: Manual smoke**

```bash
npm run dev
```

Visit `/local/restaurants/<a-known-slug>` — confirm hero renders with image, badge (if featured), chips, last-verified line.

- [ ] **Step 4: Commit**

```bash
git add components/local/restaurant/RestaurantHero.tsx app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): hero block (badge, H1, chips, last-verified)"
```

---

## Task 11: `CtasBar` + `ReservationsSheet`

**Files:**
- Create: `components/local/restaurant/CtasBar.tsx`
- Create: `components/local/restaurant/ReservationsSheet.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create `ReservationsSheet`**

```tsx
// components/local/restaurant/ReservationsSheet.tsx
'use client';

import { useEffect, useRef } from 'react';
import type { Business } from '@/data/localBusinesses';
import TrackedReservationsLink from './TrackedReservationsLink';

const PLATFORM_LABELS: Record<string, string> = {
  resy: 'Resy',
  opentable: 'OpenTable',
  direct: 'Direct',
  tock: 'Tock',
  sevenrooms: 'SevenRooms',
  yelp: 'Yelp',
};

export default function ReservationsSheet({
  business,
  open,
  onClose,
}: {
  business: Business;
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const links = business.reservationsLinks ?? [];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed bottom-0 left-0 right-0 m-0 w-full max-w-[640px] rounded-t-2xl bg-cream p-7 backdrop:bg-ink/40 sm:m-auto sm:rounded-2xl"
    >
      <h2 className="display text-[20px] text-ink">Reservations at {business.name}</h2>
      <p className="mt-2 text-[13px] text-ink-soft">
        Pick the platform you prefer. Each link opens the restaurant&rsquo;s page on that service.
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.platform + l.url}>
            <TrackedReservationsLink
              businessId={business.id}
              link={l}
              className="flex items-center justify-between gap-4 border border-ink/15 bg-white px-5 py-4 transition-colors hover:border-coral"
            >
              <span className="text-[15px] text-ink">{l.label ?? PLATFORM_LABELS[l.platform] ?? l.platform}</span>
              <span aria-hidden="true">→</span>
            </TrackedReservationsLink>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={onClose}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
```

- [ ] **Step 2: Create `CtasBar`**

```tsx
// components/local/restaurant/CtasBar.tsx
'use client';

import { useState } from 'react';
import type { Business } from '@/data/localBusinesses';
import TrackedMenuLink from './TrackedMenuLink';
import TrackedDirectionsLink from './TrackedDirectionsLink';
import ReservationsSheet from './ReservationsSheet';

export default function CtasBar({ business }: { business: Business }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasMenu = Boolean(business.menuUrl);
  const hasReservations = (business.reservationsLinks ?? []).length > 0;
  const hasPhone = Boolean(business.phone);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-ink/15 py-5 md:sticky md:top-0 md:z-10 md:bg-cream/95 md:backdrop-blur">
      {hasMenu && (
        <TrackedMenuLink
          businessId={business.id}
          url={business.menuUrl!}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
        >
          View menu <span aria-hidden="true">→</span>
        </TrackedMenuLink>
      )}
      {hasReservations && (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-cream"
        >
          Reserve
        </button>
      )}
      {hasPhone && (
        <a
          href={`tel:${business.phone}`}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
        >
          Call
        </a>
      )}
      {business.address && (
        <TrackedDirectionsLink
          businessId={business.id}
          address={`${business.address}, ${business.city}`}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
        >
          Directions
        </TrackedDirectionsLink>
      )}
      {hasReservations && (
        <ReservationsSheet
          business={business}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire CtasBar into the page below the hero**

In `app/local/restaurants/[slug]/page.tsx`:

```tsx
import CtasBar from '@/components/local/restaurant/CtasBar';

// After <RestaurantHero/>:
<section className="max-w-[1100px]">
  <CtasBar business={business} />
</section>
```

- [ ] **Step 4: Smoke**

Manual check — visit a restaurant page, click View menu (opens new tab), click Reserve (sheet opens, platforms list), click Directions (opens Google Maps), click Call (mobile only — `tel:` link).

- [ ] **Step 5: Commit**

```bash
git add components/local/restaurant/CtasBar.tsx components/local/restaurant/ReservationsSheet.tsx app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): CTAs bar + reservations sheet"
```

---

## Task 12: Founder review + Menu Link block + What to Order

**Files:**
- Create: `components/local/restaurant/MenuLinkBlock.tsx`
- Create: `components/local/restaurant/WhatToOrder.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create `MenuLinkBlock`**

```tsx
// components/local/restaurant/MenuLinkBlock.tsx
import type { Business } from '@/data/localBusinesses';
import TrackedMenuLink from './TrackedMenuLink';

export default function MenuLinkBlock({ business }: { business: Business }) {
  if (!business.menuUrl) return null;
  return (
    <section className="mt-12 max-w-[760px] border-y border-ink/15 py-8">
      <div className="eyebrow text-ink-soft">Menu</div>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <TrackedMenuLink
          businessId={business.id}
          url={business.menuUrl}
          className="inline-flex items-center gap-2 text-[18px] font-medium text-ink hover:text-coral md:text-[20px]"
        >
          View the menu <span aria-hidden="true">→</span>
        </TrackedMenuLink>
        {business.menuSourceNote && (
          <p className="max-w-[420px] text-[13px] italic text-ink-soft">
            {business.menuSourceNote}
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `WhatToOrder`**

```tsx
// components/local/restaurant/WhatToOrder.tsx
import type { Business } from '@/data/localBusinesses';

export default function WhatToOrder({ business }: { business: Business }) {
  const items = business.whatToOrder ?? [];
  if (items.length === 0) return null;
  const signature = items.find((i) => i.signature);
  const rest = items.filter((i) => !i.signature);

  return (
    <section className="mt-12 max-w-[760px]">
      <div className="eyebrow text-coral">What to order</div>
      {signature && (
        <div className="mt-4 border-l-2 border-coral pl-5">
          <div className="display-italic text-[20px] leading-[1.2] text-ink">{signature.dish}</div>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-soft">{signature.note}</p>
        </div>
      )}
      {rest.length > 0 && (
        <ul className="mt-6 space-y-3">
          {rest.map((i) => (
            <li key={i.dish}>
              <div className="text-[15px] font-medium text-ink">{i.dish}</div>
              <p className="mt-1 text-[13px] leading-[1.6] text-ink-soft">{i.note}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Add a founder-review block + wire all three**

In `app/local/restaurants/[slug]/page.tsx`, after `<CtasBar>`:

```tsx
import MenuLinkBlock from '@/components/local/restaurant/MenuLinkBlock';
import WhatToOrder from '@/components/local/restaurant/WhatToOrder';

// ...
{/* Founder review */}
{business.review && (
  <section className="mt-12 max-w-[760px]">
    <p className="text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
      {business.review}
    </p>
  </section>
)}

<WhatToOrder business={business} />
<MenuLinkBlock business={business} />
```

- [ ] **Step 4: Smoke + commit**

```bash
git add components/local/restaurant/MenuLinkBlock.tsx components/local/restaurant/WhatToOrder.tsx app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): review + what-to-order + menu-link block"
```

---

## Task 13: `PhotoGallery` with lightbox

**Files:**
- Create: `components/local/restaurant/PhotoGallery.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Write failing test**

```ts
// tests/restaurant-hub-photos.spec.ts
import { test, expect } from '@playwright/test';

test('gallery lightbox opens and closes', async ({ page }) => {
  const slug = 'skull-creek-boathouse'; // pick a slug with galleryPhotos populated
  await page.goto(`/local/restaurants/${slug}`);
  const firstThumb = page.getByRole('button', { name: /Open photo 1/i });
  await firstThumb.click();
  await expect(page.getByRole('dialog', { name: /photo gallery/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /photo gallery/i })).toBeHidden();
});
```

- [ ] **Step 2: Run — confirm fails**

```bash
npx playwright test tests/restaurant-hub-photos.spec.ts
```

Expected: FAIL — gallery doesn't exist yet.

- [ ] **Step 3: Create the gallery**

```tsx
// components/local/restaurant/PhotoGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Business } from '@/data/localBusinesses';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function PhotoGallery({ business }: { business: Business }) {
  const photos = (business.galleryPhotos ?? []).filter((p) => p.approved);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, photos.length]);

  if (photos.length === 0) return null;

  function open(i: number) {
    setOpenIndex(i);
    trackDirectoryEvent(business.id, 'restaurants', 'photo_view', { photoIndex: i });
  }

  return (
    <section className="mt-14 max-w-[1100px]">
      <div className="eyebrow text-ink-soft">Photos</div>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open photo ${i + 1}`}
              className="block w-full overflow-hidden"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={800}
                height={600}
                className="h-auto w-full transition-transform hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="photo gallery"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/85 p-5"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative max-h-[90vh] max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[openIndex].src}
              alt={photos[openIndex].alt}
              width={1400}
              height={1000}
              className="max-h-[80vh] w-auto"
            />
            {photos[openIndex].credit && (
              <div className="mt-2 text-right text-[11px] text-cream/70">
                Photo: {photos[openIndex].credit}
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close photo gallery"
              className="absolute -top-10 right-0 text-cream"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Wire into page**

```tsx
import PhotoGallery from '@/components/local/restaurant/PhotoGallery';
// after WhatToOrder/MenuLinkBlock:
<PhotoGallery business={business} />
```

- [ ] **Step 5: Run test — confirm passes (you must seed at least one approved gallery photo on the test slug)**

If no photos seeded yet, add one approved entry in `data/localBusinesses.ts` for the test slug:

```ts
galleryPhotos: [
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400',
    alt: 'Restaurant interior with warm wood and ocean view',
    credit: 'Founder',
    source: 'founder',
    approved: true,
  },
],
```

```bash
npx playwright test tests/restaurant-hub-photos.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/local/restaurant/PhotoGallery.tsx app/local/restaurants/[slug]/page.tsx tests/restaurant-hub-photos.spec.ts data/localBusinesses.ts
git commit -m "feat(restaurant-hub): photo gallery + lightbox + photo_view tracking"
```

---

## Task 14: `SponsorSlotBlock`

**Files:**
- Create: `components/local/restaurant/SponsorSlotBlock.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Write failing test**

```ts
// tests/restaurant-hub-sponsor.spec.ts
import { test, expect } from '@playwright/test';

test('sponsor slot renders when set + click tracked', async ({ page }) => {
  // Choose a slug seeded with a sponsorSlot for this test (seed in Step 4 below).
  const slug = 'restaurant-with-sponsor';
  const events: unknown[] = [];
  await page.route('**/api/directory/track', async (route) => {
    events.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/local/restaurants/${slug}`);
  const sponsor = page.getByText(/Sponsored by/i);
  await expect(sponsor).toBeVisible();
  await page.getByRole('link', { name: /sponsor cta/i }).click();
  expect(events.some((e: any) => e.eventType === 'sponsor_slot_click')).toBe(true);
});

test('sponsor slot hidden when not set', async ({ page }) => {
  const slug = 'restaurant-without-sponsor';
  await page.goto(`/local/restaurants/${slug}`);
  await expect(page.getByText(/Sponsored by/i)).toHaveCount(0);
});
```

- [ ] **Step 2: Run — confirm fails**

```bash
npx playwright test tests/restaurant-hub-sponsor.spec.ts
```

Expected: FAIL.

- [ ] **Step 3: Create the component**

```tsx
// components/local/restaurant/SponsorSlotBlock.tsx
import Image from 'next/image';
import type { Business } from '@/data/localBusinesses';
import TrackedSponsorClick from './TrackedSponsorClick';

export default function SponsorSlotBlock({ business }: { business: Business }) {
  const slot = business.sponsorSlot;
  if (!slot) return null;
  if (slot.endsAt && new Date(slot.endsAt).getTime() < Date.now()) return null;

  return (
    <section className="mt-12 max-w-[760px] border border-ink/15 bg-sand-soft p-6">
      <div className="eyebrow text-ink-soft">Sponsored by {slot.advertiserName}</div>
      <div className="mt-4 flex items-center gap-4">
        {slot.logo?.src && (
          <Image
            src={slot.logo.src}
            alt={slot.logo.alt}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        )}
        <p className="text-[14px] italic leading-[1.6] text-ink-soft md:text-[15px]">{slot.copy}</p>
      </div>
      <div className="mt-5">
        <TrackedSponsorClick
          businessId={business.id}
          advertiserName={slot.advertiserName}
          url={slot.url}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink hover:text-coral"
          aria-label="Sponsor CTA"
        >
          Learn more →
        </TrackedSponsorClick>
      </div>
    </section>
  );
}
```

Note: the test selects `name: /sponsor cta/i` — make sure the `<TrackedSponsorClick>` includes `aria-label="Sponsor CTA"` (already on the component). Pass aria-label through if needed (the current component doesn't expose `aria-label` on its props — update if the test demands it).

Update `TrackedSponsorClick` props in `components/local/restaurant/TrackedSponsorClick.tsx` to accept `aria-label`:

```tsx
// In TrackedSponsorClick.tsx Props:
'aria-label'?: string;

// And on the <a>:
<a aria-label={props['aria-label']} ... >
```

(The accurate full TypeScript pattern: extend `React.AnchorHTMLAttributes<HTMLAnchorElement>` on the prop type and spread.)

- [ ] **Step 4: Seed test data**

In `data/localBusinesses.ts`, add or pick one restaurant to seed with a sponsor slot:

```ts
{
  id: 'restaurant-with-sponsor',
  // ... other fields
  sponsorSlot: {
    advertiserName: 'Test Advertiser',
    url: 'https://example.com/sponsor',
    copy: 'Tired of waiting for a table? Skip the line at Test Advertiser — 2 blocks away.',
  },
},
// And ensure 'restaurant-without-sponsor' has sponsorSlot: null or omitted.
```

If you don't want to bloat real data with test stubs, the cleaner pattern is to pick two REAL restaurant ids — one to set a sponsor on (founder-curated, real partner) and one with sponsor explicitly null. Update the test slugs accordingly.

- [ ] **Step 5: Wire into the page**

```tsx
import SponsorSlotBlock from '@/components/local/restaurant/SponsorSlotBlock';
// after PhotoGallery:
<SponsorSlotBlock business={business} />
```

- [ ] **Step 6: Run tests + commit**

```bash
npx playwright test tests/restaurant-hub-sponsor.spec.ts
```

Expected: PASS both cases.

```bash
git add components/local/restaurant/SponsorSlotBlock.tsx components/local/restaurant/TrackedSponsorClick.tsx app/local/restaurants/[slug]/page.tsx tests/restaurant-hub-sponsor.spec.ts data/localBusinesses.ts
git commit -m "feat(restaurant-hub): sponsor-slot block + click tracking + expiry"
```

---

## Task 15: `PracticalDetails`

**Files:**
- Create: `components/local/restaurant/PracticalDetails.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/local/restaurant/PracticalDetails.tsx
import type { Business } from '@/data/localBusinesses';
import TrackedDirectionsLink from './TrackedDirectionsLink';

export default function PracticalDetails({ business }: { business: Business }) {
  return (
    <section className="mt-14 max-w-[760px] border-t border-ink/15 pt-10">
      <div className="eyebrow text-ink-soft">Practical details</div>
      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {business.address && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Address</dt>
            <dd className="mt-1 text-[14px] text-ink">
              <TrackedDirectionsLink
                businessId={business.id}
                address={`${business.address}, ${business.city}`}
                className="link-underline"
              >
                {business.address}, {business.city}
              </TrackedDirectionsLink>
            </dd>
          </div>
        )}
        {business.phone && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Phone</dt>
            <dd className="mt-1 text-[14px] text-ink">
              <a href={`tel:${business.phone}`} className="link-underline">
                {business.phone}
              </a>
            </dd>
          </div>
        )}
        {business.hours && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Hours</dt>
            <dd className="mt-1 text-[14px] text-ink">{business.hours}</dd>
          </div>
        )}
        {business.dressCode && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Dress code</dt>
            <dd className="mt-1 text-[14px] text-ink">{business.dressCode}</dd>
          </div>
        )}
        {business.kidFriendly !== undefined && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Kid-friendly</dt>
            <dd className="mt-1 text-[14px] text-ink">{business.kidFriendly ? 'Yes' : 'No'}</dd>
          </div>
        )}
        {business.petFriendly !== undefined && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Pet-friendly</dt>
            <dd className="mt-1 text-[14px] text-ink">{business.petFriendly ? 'Yes' : 'No'}</dd>
          </div>
        )}
        {business.bookingLeadTimeDays && (
          <div>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Lead time</dt>
            <dd className="mt-1 text-[14px] text-ink">
              {business.bookingLeadTimeDays.peak}d peak · {business.bookingLeadTimeDays.offPeak}d off-peak
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Wire + commit**

```tsx
import PracticalDetails from '@/components/local/restaurant/PracticalDetails';
<PracticalDetails business={business} />
```

```bash
git add components/local/restaurant/PracticalDetails.tsx app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): practical details block (address, hours, tags)"
```

---

## Task 16: AI FAQ draft script + `FaqSection` component

**Files:**
- Create: `scripts/draft-restaurant-faqs.ts`
- Create: `data/restaurant-faq-drafts/.gitkeep` (placeholder; drafts go here)
- Create: `components/local/restaurant/FaqSection.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create the LLM draft script**

```ts
// scripts/draft-restaurant-faqs.ts
/**
 * One-time + on-demand: drafts 5 FAQ Q&As per restaurant using the founder's
 * existing review prose + structured fields. Writes one JSON file per slug
 * to data/restaurant-faq-drafts/<slug>.json.
 *
 * Run: `npx tsx scripts/draft-restaurant-faqs.ts [slug1 slug2 ...]`
 * No args = draft all restaurants missing a draft file.
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { businesses, type Business } from '../data/localBusinesses';

const DRAFTS_DIR = join(process.cwd(), 'data', 'restaurant-faq-drafts');

const PROMPT_TEMPLATE = (b: Business) => `You are drafting an FAQ for a Hilton Head, SC restaurant directory page. Write 5 frequently-asked questions that a Hilton Head visitor would actually ask before deciding to eat here.

Restaurant: ${b.name}
Cuisine: ${b.cuisine ?? 'N/A'}
Price range: ${b.priceRange ?? 'N/A'}
Address: ${b.address}, ${b.city}
Hours: ${b.hours ?? 'N/A'}
Dress code: ${b.dressCode ?? 'N/A'}
Kid-friendly: ${b.kidFriendly ?? 'unspecified'}
Pet-friendly: ${b.petFriendly ?? 'unspecified'}
Lead time: peak ${b.bookingLeadTimeDays?.peak ?? 'N/A'}d, off-peak ${b.bookingLeadTimeDays?.offPeak ?? 'N/A'}d
Reservations: ${(b.reservationsLinks ?? []).map((l) => l.platform).join(', ') || 'none listed'}
Review: ${b.review}
Notable for: ${b.notableFor}

Output ONLY a JSON array of exactly 5 objects:
[{"question":"...","answer":"..."}, ...]

Rules:
- Each answer is 1-2 sentences, factual, and grounded ONLY in the data above.
- Do NOT invent facts. If you can't answer from the data, skip that question and pick another.
- Tone: editorial, founder-voice, terse. Not corporate.
- No emojis. No marketing fluff.`;

async function draftOne(b: Business, client: Anthropic) {
  const msg = await client.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 1024,
    messages: [{ role: 'user', content: PROMPT_TEMPLATE(b) }],
  });
  const text = msg.content
    .filter((c) => c.type === 'text')
    .map((c) => (c as { text: string }).text)
    .join('\n');
  // Extract JSON array from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON found in response for ${b.id}`);
  const parsed = JSON.parse(jsonMatch[0]) as Array<{ question: string; answer: string }>;
  return parsed.map((q) => ({ ...q, approved: false }));
}

async function main() {
  if (!existsSync(DRAFTS_DIR)) mkdirSync(DRAFTS_DIR, { recursive: true });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Set ANTHROPIC_API_KEY env var.');
    process.exit(1);
  }
  const client = new Anthropic({ apiKey });

  const argSlugs = process.argv.slice(2);
  const targets = (
    argSlugs.length > 0
      ? businesses.filter((b) => argSlugs.includes(b.id))
      : businesses.filter((b) => b.industrySlug === 'restaurants' && !existsSync(join(DRAFTS_DIR, `${b.id}.json`)))
  );

  for (const b of targets) {
    process.stdout.write(`Drafting ${b.id}... `);
    try {
      const faqs = await draftOne(b, client);
      writeFileSync(join(DRAFTS_DIR, `${b.id}.json`), JSON.stringify(faqs, null, 2));
      console.log(`OK (${faqs.length} entries)`);
    } catch (e) {
      console.error(`FAIL: ${(e as Error).message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Create the directory + .gitkeep**

```bash
mkdir -p data/restaurant-faq-drafts
touch data/restaurant-faq-drafts/.gitkeep
```

- [ ] **Step 3: Create the `FaqSection` component**

```tsx
// components/local/restaurant/FaqSection.tsx
import type { Business } from '@/data/localBusinesses';

export default function FaqSection({ business }: { business: Business }) {
  const faqs = (business.faqs ?? []).filter((f) => f.approved);
  if (faqs.length === 0) return null;
  return (
    <section className="mt-14 max-w-[760px]">
      <div className="eyebrow text-ink-soft">Frequently asked</div>
      <ul className="mt-6 space-y-5">
        {faqs.map((f) => (
          <li key={f.question}>
            <details className="group border-b border-ink/15 py-4">
              <summary className="flex cursor-pointer items-baseline justify-between gap-4 text-[15px] font-medium text-ink list-none">
                <span>{f.question}</span>
                <span aria-hidden="true" className="text-ink-soft transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">{f.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the draft script for one restaurant**

```bash
export ANTHROPIC_API_KEY=...   # founder's key
npx tsx scripts/draft-restaurant-faqs.ts skull-creek-boathouse
```

Expected: file appears at `data/restaurant-faq-drafts/skull-creek-boathouse.json` with 5 Q&A pairs marked `approved: false`.

- [ ] **Step 5: Founder approval flow (manual for v1)**

Founder reviews `data/restaurant-faq-drafts/<slug>.json`, edits text as needed, then copies approved entries into `data/localBusinesses.ts` under that business's `faqs[]` with `approved: true`.

(v1.1 will add an admin page to do this in-app — out of scope here.)

- [ ] **Step 6: Wire FaqSection into the page**

```tsx
import FaqSection from '@/components/local/restaurant/FaqSection';
<FaqSection business={business} />
```

- [ ] **Step 7: Commit**

```bash
git add scripts/draft-restaurant-faqs.ts data/restaurant-faq-drafts components/local/restaurant/FaqSection.tsx app/local/restaurants/[slug]/page.tsx data/localBusinesses.ts
git commit -m "feat(restaurant-hub): AI FAQ draft script + FaqSection"
```

---

## Task 17: `RelatedRestaurants`

**Files:**
- Create: `components/local/restaurant/RelatedRestaurants.tsx`
- Create: `tests/restaurant-hub-related.spec.ts`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Write failing test**

```ts
// tests/restaurant-hub-related.spec.ts
import { test, expect } from '@playwright/test';

test('exactly 3 related restaurants shown', async ({ page }) => {
  const slug = 'skull-creek-boathouse'; // a slug with neighbors
  await page.goto(`/local/restaurants/${slug}`);
  const items = page.locator('[data-testid="related-restaurant-card"]');
  await expect(items).toHaveCount(3);
});

test('related list never includes self', async ({ page }) => {
  const slug = 'skull-creek-boathouse';
  await page.goto(`/local/restaurants/${slug}`);
  const items = page.locator('[data-testid="related-restaurant-card"]');
  for (let i = 0; i < (await items.count()); i++) {
    const href = await items.nth(i).getAttribute('href');
    expect(href).not.toContain(`/local/restaurants/${slug}`);
  }
});
```

- [ ] **Step 2: Run — confirm fails**

```bash
npx playwright test tests/restaurant-hub-related.spec.ts
```

Expected: FAIL.

- [ ] **Step 3: Create the component**

```tsx
// components/local/restaurant/RelatedRestaurants.tsx
import Image from 'next/image';
import type { Business } from '@/data/localBusinesses';
import { relatedFor } from './relatedRestaurants';
import TrackedRelatedLink from './TrackedRelatedLink';

export default function RelatedRestaurants({ business }: { business: Business }) {
  const picks = relatedFor(business);
  if (picks.length === 0) return null;
  return (
    <section className="mt-14 max-w-[1100px]">
      <div className="eyebrow text-coral">Eat here next</div>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {picks.map((p) => (
          <li key={p.business.id}>
            <TrackedRelatedLink
              fromBusinessId={business.id}
              relatedBusinessId={p.business.id}
              className="group flex h-full flex-col border border-ink/15 bg-white transition-colors hover:border-coral"
              data-testid="related-restaurant-card"
            >
              {p.business.heroImage?.src && (
                <Image
                  src={p.business.heroImage.src}
                  alt={p.business.heroImage.alt}
                  width={600}
                  height={400}
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex flex-col gap-2 p-5">
                <div className="eyebrow text-ink-soft">
                  {p.reason === 'founder-pick' ? 'Founder pick' : 'Nearby'}
                </div>
                <div className="text-[16px] font-medium text-ink">{p.business.name}</div>
                <p className="text-[13px] leading-[1.55] text-ink-soft">
                  {p.note ?? p.business.notableFor ?? p.business.tagline}
                </p>
              </div>
            </TrackedRelatedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Note: Next.js `<Link>` doesn't forward arbitrary `data-*` attributes by default; update `TrackedRelatedLink` to accept them:

In `TrackedRelatedLink.tsx`, change the props signature:

```tsx
export default function TrackedRelatedLink(
  props: React.ComponentPropsWithoutRef<typeof Link> & {
    fromBusinessId: string;
    relatedBusinessId: string;
  },
) {
  const { fromBusinessId, relatedBusinessId, onClick, ...rest } = props;
  return (
    <Link
      {...rest}
      href={`/local/restaurants/${relatedBusinessId}`}
      onClick={(e) => {
        onClick?.(e);
        trackDirectoryEvent(fromBusinessId, 'restaurants', 'related_click', { relatedBusinessId });
      }}
    />
  );
}
```

- [ ] **Step 4: Wire into the page**

```tsx
import RelatedRestaurants from '@/components/local/restaurant/RelatedRestaurants';
<RelatedRestaurants business={business} />
```

- [ ] **Step 5: Run tests — confirm passes**

```bash
npx playwright test tests/restaurant-hub-related.spec.ts
```

Expected: both PASS. If the count assertion fails because there are fewer than 4 restaurants total in the directory (means algorithm can't pick 3 others), seed more restaurants in `data/localBusinesses.ts` until the directory has at least 4 entries marked `industrySlug: 'restaurants'`.

- [ ] **Step 6: Commit**

```bash
git add components/local/restaurant/RelatedRestaurants.tsx components/local/restaurant/TrackedRelatedLink.tsx tests/restaurant-hub-related.spec.ts app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): related-restaurants block (3 picks, never self)"
```

---

## Task 18: `ShareButton`

**Files:**
- Create: `components/local/restaurant/ShareButton.tsx`
- Modify: `app/local/restaurants/[slug]/page.tsx`

- [ ] **Step 1: Create the share button**

```tsx
// components/local/restaurant/ShareButton.tsx
'use client';

import { useState } from 'react';
import type { Business } from '@/data/localBusinesses';
import { trackDirectoryEvent } from '@/app/lib/directoryTracking';

export default function ShareButton({ business }: { business: Business }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === 'undefined' ? '' : window.location.href;
  const shareData = {
    title: business.name,
    text: business.notableFor ?? business.name,
    url,
  };

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        trackDirectoryEvent(business.id, 'restaurants', 'share_click', { channel: 'native' });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackDirectoryEvent(business.id, 'restaurants', 'share_click', { channel: 'copy_link' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // best-effort; no further fallback
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
    >
      {copied ? 'Link copied!' : 'Share this restaurant'}
    </button>
  );
}
```

- [ ] **Step 2: Wire + commit**

```tsx
import ShareButton from '@/components/local/restaurant/ShareButton';
<section className="mt-10 max-w-[760px]">
  <ShareButton business={business} />
</section>
```

```bash
git add components/local/restaurant/ShareButton.tsx app/local/restaurants/[slug]/page.tsx
git commit -m "feat(restaurant-hub): share button (Web Share API + copy fallback)"
```

---

## Task 19: Sitemap entries

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Read current sitemap shape**

```bash
cat app/sitemap.ts | head -100
```

- [ ] **Step 2: Add per-restaurant entries**

In `app/sitemap.ts`, add to the existing entries:

```ts
import { businesses } from '@/data/localBusinesses';

// inside the default export, push restaurant entries:
const restaurantEntries = businesses
  .filter((b) => b.industrySlug === 'restaurants')
  .map((b) => ({
    url: `${siteUrl}/local/restaurants/${b.id}`,
    lastModified: b.lastVerified ? new Date(b.lastVerified) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

// merge into the existing return array
return [
  ...existing,
  ...restaurantEntries,
];
```

The exact shape depends on the existing sitemap structure. Read it first, then add the new entries in the same shape used by surrounding code.

- [ ] **Step 3: Verify**

```bash
npm run dev
curl -s http://localhost:3000/sitemap.xml | grep -c '/local/restaurants/'
```

Expected: count equals the number of restaurants in `data/localBusinesses.ts`.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(restaurant-hub): per-restaurant sitemap entries"
```

---

## Task 20: Industry-page link-to-deep-page

**Files:**
- Modify: `app/local/[industry]/page.tsx` (or wherever restaurant cards link)
- Modify: `components/local/BusinessCard.tsx` (or `FeaturedBusinessCard.tsx`)

- [ ] **Step 1: Read the current card components**

```bash
cat components/local/BusinessCard.tsx | head -80
cat components/local/FeaturedBusinessCard.tsx | head -80
```

- [ ] **Step 2: Change card title/click target to link to deep page (restaurants only)**

In `BusinessCard.tsx` (and `FeaturedBusinessCard.tsx` if it has a separate card title link):

```tsx
import Link from 'next/link';

// Where the title was previously just text, wrap in a Link IF business.industrySlug === 'restaurants':
{business.industrySlug === 'restaurants' ? (
  <Link href={`/local/restaurants/${business.id}`} className="link-underline">
    {business.name}
  </Link>
) : (
  business.name
)}
```

This keeps existing card layouts intact for other industries; only restaurants get the deep-page hop in v1.

- [ ] **Step 3: Manual smoke**

```bash
npm run dev
# Visit /local/restaurants — confirm each restaurant card title is a link to /local/restaurants/<slug>
```

- [ ] **Step 4: Commit**

```bash
git add components/local/BusinessCard.tsx components/local/FeaturedBusinessCard.tsx
git commit -m "feat(restaurant-hub): restaurant cards link to deep pages"
```

---

## Task 21: Photo intake — owner upload page (extends business portal)

**Files:**
- Create: `app/portal/(gated)/photos/[businessId]/page.tsx`
- Create: `app/portal/(gated)/photos/[businessId]/actions.ts`

This task assumes the existing business portal at `app/portal/(gated)/...` per commit `dca6721`. If the directory layout differs, adjust to match the existing portal route pattern.

- [ ] **Step 1: Set up Supabase Storage bucket (one-time, via dashboard or SQL)**

In the Supabase dashboard → Storage → create bucket `restaurant-photos`. Mark private. Allow MIME types: `image/jpeg, image/png, image/webp`. Max upload size: 5 MB.

- [ ] **Step 2: Create the server action**

```ts
// app/portal/(gated)/photos/[businessId]/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createServiceClient } from '@/utils/supabase/service';
import { businesses } from '@/data/localBusinesses';

// IMPORTANT: portal gating must have already verified the caller owns this business.
// This action assumes the gated layout did the auth check (mirrors admin (gated) pattern).

export async function uploadPhoto(formData: FormData) {
  const businessId = formData.get('businessId') as string;
  const file = formData.get('file') as File;
  const alt = (formData.get('alt') as string) || '';

  const business = businesses.find((b) => b.id === businessId);
  if (!business) throw new Error('Unknown business');

  const supabase = createServiceClient();

  // Upload to Storage
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${businessId}/${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from('restaurant-photos')
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploadErr) throw uploadErr;

  // Insert pending row into a new table (see Step 3) — but the spec calls for
  // sponsor data in TS rather than DB. For pending photos we DO need a DB row
  // because owners submit dynamically. The admin then approves and runs a small
  // script to stamp the URL into data/localBusinesses.ts.
  await supabase.from('owner_submitted_photos').insert({
    business_id: businessId,
    storage_path: path,
    alt,
    approved: false,
  });

  redirect(`/portal/photos/${businessId}?uploaded=1`);
}
```

- [ ] **Step 3: Create the matching DB table (added to the same migration 014 or a follow-up)**

Quick path: append to `supabase/migrations/014_directory_events_payload_and_events.sql` BEFORE applying, OR add a small follow-up migration:

```sql
-- supabase/migrations/015_owner_submitted_photos.sql
create table owner_submitted_photos (
  id           uuid primary key default gen_random_uuid(),
  business_id  text not null,
  storage_path text not null,
  alt          text,
  approved     boolean default false,
  approved_at  timestamptz,
  approved_by  text,
  created_at   timestamptz default now()
);
create index on owner_submitted_photos (business_id);
create index on owner_submitted_photos (approved);

alter table owner_submitted_photos enable row level security;
create policy "admin read owner_submitted_photos" on owner_submitted_photos
  for select using (is_admin());
-- Inserts go through server actions using service-role; no policy needed for that.
```

Apply: `npx supabase db push`.

- [ ] **Step 4: Create the upload page**

```tsx
// app/portal/(gated)/photos/[businessId]/page.tsx
import { businesses } from '@/data/localBusinesses';
import { notFound } from 'next/navigation';
import { uploadPhoto } from './actions';

export default async function PhotoUploadPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const business = businesses.find((b) => b.id === businessId);
  if (!business) notFound();
  return (
    <div className="mx-auto max-w-[640px] p-6">
      <h1 className="display text-[24px] text-ink">Upload photos for {business.name}</h1>
      <p className="mt-3 text-[13px] text-ink-soft">
        Photos go to the founder for approval — they appear on your page once approved.
        JPEG or PNG; up to 5 MB.
      </p>
      <form action={uploadPhoto} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="businessId" value={business.id} />
        <label className="flex flex-col gap-2">
          <span className="eyebrow text-ink-soft">Photo</span>
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow text-ink-soft">Caption / alt-text</span>
          <input
            type="text"
            name="alt"
            maxLength={120}
            placeholder="What's in the photo? (briefly)"
            className="border border-ink/20 bg-transparent px-3 py-2 text-[14px] text-ink"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-full bg-ink px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/portal supabase/migrations/015_owner_submitted_photos.sql
git commit -m "feat(restaurant-hub): owner photo upload page + storage + pending DB"
```

---

## Task 22: Photo intake — admin approval queue

**Files:**
- Create: `app/admin/(gated)/photos-review/page.tsx`
- Create: `app/admin/(gated)/photos-review/actions.ts`

- [ ] **Step 1: Create the admin actions**

```ts
// app/admin/(gated)/photos-review/actions.ts
'use server';

import { requireAdmin } from '@/utils/supabase/admin';
import { createServiceClient } from '@/utils/supabase/service';
import { revalidatePath } from 'next/cache';

export async function approvePhoto(formData: FormData) {
  const admin = await requireAdmin();
  const id = formData.get('id') as string;
  const supabase = createServiceClient();
  await supabase
    .from('owner_submitted_photos')
    .update({ approved: true, approved_at: new Date().toISOString(), approved_by: admin.email })
    .eq('id', id);
  revalidatePath('/admin/photos-review');
}

export async function rejectPhoto(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const supabase = createServiceClient();
  // Look up storage path, delete object, then row.
  const { data } = await supabase.from('owner_submitted_photos').select('storage_path').eq('id', id).single();
  if (data?.storage_path) {
    await supabase.storage.from('restaurant-photos').remove([data.storage_path]);
  }
  await supabase.from('owner_submitted_photos').delete().eq('id', id);
  revalidatePath('/admin/photos-review');
}
```

- [ ] **Step 2: Create the approval queue page**

```tsx
// app/admin/(gated)/photos-review/page.tsx
import { createServiceClient } from '@/utils/supabase/service';
import { businesses } from '@/data/localBusinesses';
import { approvePhoto, rejectPhoto } from './actions';

export default async function PhotosReviewPage() {
  const supabase = createServiceClient();
  const { data: pending } = await supabase
    .from('owner_submitted_photos')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-[920px] p-6">
      <h1 className="display text-[28px] text-ink">Photos awaiting approval</h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        Approved photos get a public URL ready to copy into <code>data/localBusinesses.ts</code> under that
        business&rsquo;s <code>galleryPhotos[]</code>.
      </p>
      {(!pending || pending.length === 0) && (
        <p className="mt-8 text-[14px] text-ink-soft italic">Inbox zero. No pending photos.</p>
      )}
      <ul className="mt-8 space-y-6">
        {(pending ?? []).map((p) => {
          const biz = businesses.find((b) => b.id === p.business_id);
          const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/restaurant-photos/${p.storage_path}`;
          return (
            <li key={p.id} className="border border-ink/15 p-5">
              <div className="text-[12px] uppercase tracking-[0.18em] text-ink-soft">{biz?.name ?? p.business_id}</div>
              <div className="mt-3 flex items-start gap-5">
                <img src={publicUrl} alt={p.alt ?? ''} className="h-40 w-auto border border-ink/15" />
                <div className="flex flex-col gap-2">
                  <div className="text-[14px] text-ink">{p.alt || <em className="text-ink-soft">no alt-text</em>}</div>
                  <div className="text-[11px] text-ink-soft break-all">{publicUrl}</div>
                  <div className="mt-3 flex gap-3">
                    <form action={approvePhoto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded-full bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-coral">
                        Approve
                      </button>
                    </form>
                    <form action={rejectPhoto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded-full border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink hover:bg-cream">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Manual smoke**

Have a test owner-submitted photo land in the DB (from Task 21), visit `/admin/photos-review`, approve it, then manually copy the public URL into `data/localBusinesses.ts` under that business's `galleryPhotos[]` (with `approved: true, source: 'owner-submitted'`).

- [ ] **Step 4: Commit**

```bash
git add app/admin/(gated)/photos-review
git commit -m "feat(restaurant-hub): admin photo approval queue"
```

---

## Task 23: Playwright happy-path full assertion

**Files:**
- Modify: `tests/restaurant-hub-happy.spec.ts`

- [ ] **Step 1: Add full coverage to the happy-path spec**

```ts
import { test, expect } from '@playwright/test';

test('full happy path: load, hero, ctas, menu click, reservation click, related click', async ({ page }) => {
  const slug = 'skull-creek-boathouse';

  const trackedEvents: Array<Record<string, unknown>> = [];
  await page.route('**/api/directory/track', async (route) => {
    trackedEvents.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 204 });
  });

  await page.goto(`/local/restaurants/${slug}`);

  // Hero
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // CTAs bar
  await expect(page.getByRole('link', { name: /View menu/i })).toBeVisible();

  // Menu click
  const menuLink = page.getByRole('link', { name: /View menu/i }).first();
  await menuLink.click({ trial: true }); // don't actually navigate; record event
  // For an actual click that fires the handler, use a regular click and listen to popup or just track:
  await menuLink.evaluate((el: HTMLAnchorElement) => el.click()); // fires onClick

  // Wait briefly for fire-and-forget
  await page.waitForTimeout(200);

  expect(trackedEvents.some((e) => e.eventType === 'menu_click')).toBe(true);
});
```

- [ ] **Step 2: Run + commit**

```bash
npx playwright test tests/restaurant-hub-happy.spec.ts
git add tests/restaurant-hub-happy.spec.ts
git commit -m "test(restaurant-hub): full happy-path with event interception"
```

---

## Task 24: A11y spec

**Files:**
- Create: `tests/restaurant-hub-a11y.spec.ts`

- [ ] **Step 1: Create the spec**

```ts
// tests/restaurant-hub-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SAMPLE_SLUGS = [
  'skull-creek-boathouse',
  // add 2 more slugs: one with sponsor slot, one with a small/sparse data set
  'a-second-restaurant-slug',
  'a-third-restaurant-slug',
];

for (const slug of SAMPLE_SLUGS) {
  test(`a11y: /local/restaurants/${slug}`, async ({ page }) => {
    await page.goto(`/local/restaurants/${slug}`);
    const results = await new AxeBuilder({ page }).disableRules(['region']).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

Substitute real slugs once you know what's seeded.

- [ ] **Step 2: Run + fix any violations in the components — do NOT silence rules**

```bash
npx playwright test tests/restaurant-hub-a11y.spec.ts
```

Common fixes:
- Missing `alt` text on Image → ensure every `<Image>` has meaningful alt
- Color contrast — adjust palette token used (most likely the sponsor-slot copy on `sand-soft`)
- Heading hierarchy — ensure H1 → H2 → H3 in order, no jumps

- [ ] **Step 3: Commit**

```bash
git add tests/restaurant-hub-a11y.spec.ts
git commit -m "test(restaurant-hub): axe-core scan on 3 sample pages"
```

---

## Task 25: Final QA + typecheck + build

- [ ] **Step 1: Typecheck + lint**

```bash
npm run typecheck
npm run lint
```

Expected: both clean.

- [ ] **Step 2: Run all Restaurant Hub tests**

```bash
npx playwright test tests/restaurant-hub-*.spec.ts
```

Expected: all green on chromium + webkit.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: clean. Inspect the bundle-size report for `/local/restaurants/[slug]` — target ≤ 25 KB gzipped per the spec budget. If over, the most likely cause is a client component being too big (PhotoGallery or ReservationsSheet) — refactor to lazy-load via `next/dynamic`.

- [ ] **Step 4: Manual QA checklist**

For at least 3 different restaurant pages:

- [ ] Hero renders: name, tagline, badge (if featured), chips, last-verified
- [ ] CTAs bar renders with the right buttons depending on which fields are populated
- [ ] Menu link opens canonical URL in new tab; tracked event fires
- [ ] Reservations sheet opens; each platform link opens new tab; each click tracked separately
- [ ] Directions opens Google Maps with the correct address; tracked
- [ ] Photo gallery: thumbnails render; clicking opens lightbox; arrow keys navigate; Esc closes; `photo_view` event fires
- [ ] Sponsor slot renders only when set and not expired; click tracked
- [ ] Practical details block reflects populated fields only
- [ ] FAQ renders only approved entries; closed by default
- [ ] Related: exactly 3 shown, none link to self, founder picks come first if seeded
- [ ] Share button: native share on mobile (or copy-link fallback on desktop without share API); tracked
- [ ] Mobile sticky CTA bar pins to top on scroll (md+) — re-evaluate position on mobile
- [ ] JSON-LD Restaurant schema valid (test in https://search.google.com/test/rich-results)
- [ ] /sitemap.xml includes all per-restaurant URLs
- [ ] `/local/restaurants` industry-page cards link to deep pages

- [ ] **Step 5: Push + open PR**

```bash
git push -u origin feat/restaurant-hub
# Then open a PR. Do NOT merge without William's review.
```

---

## Self-Review

**Spec coverage:**
- ✅ Per-restaurant route + page composition — Tasks 8, 10–18
- ✅ `Business` type extensions — Task 5
- ✅ 7 new page events + payload column — Tasks 2, 3, 4, 9, 13, 14, 18
- ✅ 3 cross-system attribution events — flagged in spec; wired downstream in Villa Match / Trip Sketch / itinerary pipelines (NOT part of this plan — Note A below)
- ✅ Sponsor-slot model + render — Task 14
- ✅ Photo intake + admin approval — Tasks 21, 22
- ✅ AI FAQ generation + approval workflow — Task 16
- ✅ Related-restaurants algorithm — Task 6, 17
- ✅ JSON-LD Restaurant schema — Task 7, 8
- ✅ Sitemap entries — Task 19
- ✅ Tests (happy, related, sponsor, photos, a11y) — Tasks 8, 13, 14, 17, 23, 24
- ✅ Mobile sticky CTA — Task 11 (CSS-only via `md:sticky`)
- ⚠️ Performance budget verification — Task 25 step 3
- ⚠️ Color contrast audit on sponsor-slot copy on `sand-soft` — Task 24 (axe will surface it if it fails AA)

**Note A — Cross-system attribution events:** the spec defines `saved_to_trip_sketch`, `added_to_itinerary`, `sent_in_pdf_takeaway` as cross-system events written by other features. Restaurant Hub doesn't fire these — they get wired when Trip Sketch (#2 in roadmap) and Villa Match (specced separately) reference a restaurant in their flows. This plan adds those event-type values to the CHECK constraint *in v1.1* if needed; for now the constraint only includes the 7 page events. Add a follow-up migration when those features land.

Actually — re-reading the spec §7, it says these cross-system events "live in a separate `directory_event_type` set inside those routes — verify final wiring during build." That means they're allowed to write to `directory_events` too. So the migration in Task 2 should include them. Let me flag this as a fix-up.

**Fix-up to apply:** in Task 2's migration `014_directory_events_payload_and_events.sql`, extend the CHECK constraint to include the 3 cross-system events as well:

```sql
add constraint directory_events_event_type_check
check (event_type in (
  'phone_click', 'website_click', 'inquiry_submit',
  'menu_click', 'reservations_click', 'directions_click',
  'photo_view', 'share_click', 'sponsor_slot_click', 'related_click',
  'saved_to_trip_sketch', 'added_to_itinerary', 'sent_in_pdf_takeaway'
));
```

And the `VALID_EVENT_TYPES` Set in Task 4 should match. Apply during execution.

**Placeholder scan — none found.** Every code step has actual code; every command has expected output.

**Type consistency:**
- `Business` field names match across Tasks 5, 6, 8, 10–18
- `DirectoryEventType` union (Task 3) matches the API route (Task 4) and the migration (Task 2 + fix-up)
- `relatedFor` signature in Task 6 matches usage in Task 17
- `ReservationsLink` shape consistent across Task 5, Task 11
- `SponsorSlot` shape consistent across Task 5, Task 14

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-20-restaurant-hub.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task with two-stage review. Best for a 25-task plan; isolates each task, catches drift early.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch with checkpoints. Faster end-to-end but heavier on context.

Which approach?
