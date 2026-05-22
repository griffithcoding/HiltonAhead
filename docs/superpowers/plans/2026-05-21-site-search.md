# Site Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an always-visible site search in the header that powers a crawlable `/search?q=` results page, fulfilling the dormant `SearchAction` schema and giving LLM crawlers a documented query endpoint.

**Architecture:** Client-side debounced fetch from a header `SearchBar` → `/api/search` route → MiniSearch index built from the `data/` corpus at module load → SSR fallback page at `/search?q=` runs the same search and emits `SearchResultsPage` + `ItemList` JSON-LD. Mobile uses a magnifying-glass icon that opens a full-screen overlay around the same `SearchBar`.

**Tech Stack:** Next.js 16 App Router · React 19 client component · MiniSearch ≈10 KB · Tailwind 4 brand tokens · Playwright e2e tests.

**Spec:** `docs/superpowers/specs/2026-05-21-site-search-design.md`

**Branch:** `feat/site-search` (already checked out, spec already committed)

---

## File Structure

**New files:**

| Path | Purpose |
|---|---|
| `app/lib/search/corpus.ts` | Pure function building `SearchableDoc[]` from all `data/` modules + static pages. |
| `app/lib/search/engine.ts` | MiniSearch wrapper exporting `search(q, opts)`. |
| `app/api/search/route.ts` | GET endpoint returning JSON hits for the live dropdown. |
| `app/search/page.tsx` | SSR results page reading `?q=`. |
| `app/search/loading.tsx` | Skeleton state. |
| `components/search/SearchBar.tsx` | Client component, pill input + dropdown. |
| `components/search/MobileSearchTrigger.tsx` | Magnifier icon + full-screen overlay reusing `SearchBar`. |
| `components/search/ResultCard.tsx` | Card used in dropdown + results page. |
| `components/search/TypeBadge.tsx` | Color-coded badge per doc type. |
| `public/opensearch.xml` | OpenSearch 1.1 descriptor. |
| `tests/search-api.spec.ts` | API route smoke. |
| `tests/search-page.spec.ts` | SSR results page smoke. |
| `tests/search-bar.spec.ts` | Header bar + dropdown + mobile overlay. |

**Modified files:**

| Path | Change |
|---|---|
| `components/sections/Header.tsx` | Insert `<SearchBar />` between desktop nav and CTA; insert `<MobileSearchTrigger />` left of `<MobileMenu />`. |
| `app/lib/metadata.ts` | Re-enable `potentialAction.SearchAction` in `getWebSiteSchema()`; add `getSearchResultsPageSchema()`. |
| `app/layout.tsx` | Add `<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml">`. |
| `app/sitemap.ts` | Add `/search` to `STATIC_ROUTES`. |
| `public/llms.txt` | Add "Site Search" section. |
| `public/llms-full.txt` | Add "Site Search" section with examples. |
| `package.json` / `package-lock.json` | Add `minisearch` dependency. |

---

## Task 1: Install MiniSearch + scaffold `lib/search/`

**Files:**
- Modify: `package.json`
- Create: `app/lib/search/corpus.ts`
- Create: `app/lib/search/engine.ts`

- [ ] **Step 1: Install MiniSearch**

```bash
npm install minisearch
```

Expected: `package.json` gains `"minisearch": "^7.x"` in `dependencies`.

- [ ] **Step 2: Create the corpus skeleton**

Create `app/lib/search/corpus.ts`:

```ts
/**
 * Single source of truth for the searchable document set.
 * Pulls from data/ modules — no new content lives here.
 */

export type SearchableDocType =
  | 'page'
  | 'post'
  | 'story'
  | 'business'
  | 'industry'
  | 'event'
  | 'faq'
  | 'neighborhood'
  | 'month'
  | 'service'
  | 'partner'
  | 'trip-type'
  | 'property';

export type SearchableDoc = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
  tags: string[];
  weight: number;
};

export function buildCorpus(): SearchableDoc[] {
  return [];
}
```

- [ ] **Step 3: Create the engine stub**

Create `app/lib/search/engine.ts`:

```ts
import type { SearchableDoc, SearchableDocType } from './corpus';

export type SearchHit = SearchableDoc & {
  score: number;
};

export type SearchOpts = {
  types?: SearchableDocType[];
  limit?: number;
};

export function search(_query: string, _opts?: SearchOpts): SearchHit[] {
  return [];
}
```

- [ ] **Step 4: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/lib/search/corpus.ts app/lib/search/engine.ts
git commit -m "feat(search): install minisearch + scaffold lib/search skeleton"
```

---

## Task 2: Corpus — static pages

**Files:**
- Modify: `app/lib/search/corpus.ts`

- [ ] **Step 1: Add the static pages array and wire it into `buildCorpus()`**

Replace the body of `app/lib/search/corpus.ts` with:

```ts
import { brand } from '@/data/brand';

export type SearchableDocType =
  | 'page'
  | 'post'
  | 'story'
  | 'business'
  | 'industry'
  | 'event'
  | 'faq'
  | 'neighborhood'
  | 'month'
  | 'service'
  | 'partner'
  | 'trip-type'
  | 'property';

export type SearchableDoc = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
  tags: string[];
  weight: number;
};

const STATIC_PAGES: ReadonlyArray<Omit<SearchableDoc, 'id' | 'type'>> = [
  { url: '/', title: brand.name, body: brand.shortDescription, tags: ['home', 'hilton head'], weight: 1.0 },
  { url: '/services', title: 'Services', body: 'Custom itineraries, villa and resort booking, group and family trips, on-island concierge, dining and tee-time reservations.', tags: ['services', 'concierge', 'itinerary'], weight: 1.5 },
  { url: '/itinerary', title: 'Request a Custom Itinerary', body: 'Send a request and a local insider returns a day-by-day plan within 24 hours.', tags: ['itinerary', 'plan', 'concierge'], weight: 1.8 },
  { url: '/contact', title: 'Contact', body: 'Reach William Griffith directly to plan your Hilton Head trip.', tags: ['contact'], weight: 1.2 },
  { url: '/about', title: 'About', body: 'A locally-run travel consulting service for Hilton Head Island.', tags: ['about'], weight: 1.0 },
  { url: '/founder', title: 'Founder', body: 'William Griffith — full-time Hilton Head resident and travel consultant.', tags: ['founder', 'william griffith'], weight: 1.0 },
  { url: '/faq', title: 'Frequently Asked Questions', body: 'Eight clusters of common questions covering booking, pricing, on-island logistics, weather, and weddings.', tags: ['faq', 'questions'], weight: 1.1 },
  { url: '/partners', title: 'Partners', body: 'Curated local partner network across villas, dining, golf, charters, weddings, and spas.', tags: ['partners'], weight: 0.8 },
  { url: '/sponsorships', title: 'Partner With Us', body: 'Sponsorship tiers for Hilton Head businesses ready to join the partner network.', tags: ['sponsorship', 'business'], weight: 0.8 },
  { url: '/press', title: 'Press', body: 'Press mentions and media inquiries for Hilton Ahead Travel Co.', tags: ['press', 'media'], weight: 0.6 },
  { url: '/cost-of-hilton-head-trip', title: 'Cost of a Hilton Head Trip', body: 'Realistic Hilton Head trip cost calculator — villa, dining, golf, and activities.', tags: ['cost', 'budget', 'calculator'], weight: 1.4 },
  { url: '/marriott-bonvoy-stays-hilton-head', title: 'Marriott Bonvoy Stays on Hilton Head', body: 'Every Marriott Bonvoy property on Hilton Head Island with insider takes.', tags: ['marriott', 'bonvoy', 'hotels'], weight: 1.3 },
  { url: '/hilton-head-weather', title: 'Hilton Head Weather by Month', body: '12-month climate, water temperature, and crowd guide for Hilton Head Island.', tags: ['weather', 'month', 'climate'], weight: 1.2 },
  { url: '/events', title: 'Events Calendar', body: 'Marquee, recurring, food, sports, arts, seasonal, and holiday events on Hilton Head Island.', tags: ['events', 'calendar'], weight: 1.1 },
  { url: '/blog', title: 'Local Guide', body: 'Long-form blog posts on Hilton Head travel, golf, beaches, dining, and neighborhoods.', tags: ['blog', 'guide'], weight: 1.0 },
  { url: '/stories', title: 'Stories', body: 'Place-as-protagonist editorial pieces — long-form scroll-driven narratives.', tags: ['stories', 'editorial'], weight: 0.9 },
  { url: '/guides/2027-rbc-heritage', title: '2027 RBC Heritage Kit', body: 'Free guide to the 2027 RBC Heritage tournament — tickets, lodging, parking, and on-course tips.', tags: ['heritage', 'golf', 'tournament', '2027'], weight: 1.4 },
];

export function buildCorpus(): SearchableDoc[] {
  const docs: SearchableDoc[] = [];

  for (const p of STATIC_PAGES) {
    docs.push({
      id: `page:${p.url}`,
      type: 'page',
      ...p,
    });
  }

  return docs;
}
```

- [ ] **Step 2: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/lib/search/corpus.ts
git commit -m "feat(search): seed corpus with static pages"
```

---

## Task 3: Corpus — posts + stories + trip-types

**Files:**
- Modify: `app/lib/search/corpus.ts`

- [ ] **Step 1: Import the three data modules at the top of `corpus.ts`**

Add these imports below the `brand` import:

```ts
import { posts } from '@/data/posts';
import { stories } from '@/data/stories';
import { tripTypes } from '@/data/tripTypes';
```

- [ ] **Step 2: Add three loops to `buildCorpus()` after the static-page loop, before `return docs`**

```ts
  for (const post of posts) {
    const bodyText = post.blocks
      .map((b) => {
        if (b.kind === 'p' || b.kind === 'callout') return stripHtml(b.html);
        if (b.kind === 'h2' || b.kind === 'h3') return b.text;
        if (b.kind === 'ul' || b.kind === 'ol') return b.items.join(' ');
        if (b.kind === 'quote') return stripHtml(b.html);
        if (b.kind === 'faq') return b.items.map((i) => `${i.q} ${i.a}`).join(' ');
        return '';
      })
      .join(' ')
      .slice(0, 4000);

    docs.push({
      id: `post:${post.slug}`,
      type: 'post',
      title: post.title,
      url: `/blog/${post.slug}`,
      body: `${post.description ?? ''} ${bodyText}`.trim(),
      tags: post.tags ?? [],
      weight: post.featuredOrder <= 3 ? 1.3 : 1.0,
    });
  }

  for (const story of stories) {
    docs.push({
      id: `story:${story.slug}`,
      type: 'story',
      title: story.title,
      url: `/stories/${story.slug}`,
      body: `${story.dek ?? ''} ${story.summary ?? ''}`.trim(),
      tags: [story.kind, story.tripTypeSlug ?? ''].filter(Boolean) as string[],
      weight: 1.0,
    });
  }

  for (const trip of tripTypes) {
    docs.push({
      id: `trip:${trip.slug}`,
      type: 'trip-type',
      title: trip.seoTitle ?? `${trip.tagline.plain} ${trip.tagline.italic}`,
      url: trip.path,
      body: trip.metaDescription ?? trip.hook ?? '',
      tags: trip.keywords ?? [],
      weight: 1.2,
    });
  }
```

- [ ] **Step 3: Add the `stripHtml` helper at the bottom of the file (before the `buildCorpus` export, or after it as a module-private helper)**

```ts
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
```

- [ ] **Step 4: Reconcile any property-name mismatches**

If `npm run typecheck` complains about fields like `post.description`, `post.tags`, `post.featuredOrder`, `story.title`, `story.dek`, `story.summary`, `story.tripTypeSlug`, `trip.seoTitle`, `trip.hook`, or `trip.keywords` — read the actual type in `data/posts.ts`, `data/stories.ts`, `data/tripTypes.ts` and adjust the field reads. Use `??` and `[]` fallbacks for optional fields. Do NOT add `as unknown as`. Do NOT widen the SearchableDoc type — keep `body` and `tags` non-optional and feed them safe defaults at extract time.

- [ ] **Step 5: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add app/lib/search/corpus.ts
git commit -m "feat(search): index posts, stories, trip-type pages"
```

---

## Task 4: Corpus — FAQs + industries + businesses + events

**Files:**
- Modify: `app/lib/search/corpus.ts`

- [ ] **Step 1: Add imports**

```ts
import { faqAll, faqClusters } from '@/data/faq';
import { industries, allBusinesses } from '@/data/localBusinesses';
import { events } from '@/data/events';
```

- [ ] **Step 2: Add four loops to `buildCorpus()`**

```ts
  for (let i = 0; i < faqAll.length; i++) {
    const item = faqAll[i];
    const cluster = faqClusters.find((c) => c.items.some((it) => it.question === item.question));
    const clusterSlug = cluster?.slug ?? 'general';
    docs.push({
      id: `faq:${clusterSlug}:${i}`,
      type: 'faq',
      title: item.question,
      url: `/faq#${clusterSlug}`,
      body: item.answer,
      tags: ['faq', clusterSlug],
      weight: 1.2,
    });
  }

  for (const ind of industries) {
    docs.push({
      id: `industry:${ind.slug}`,
      type: 'industry',
      title: ind.h1,
      url: `/local/${ind.slug}`,
      body: `${ind.metaDescription} ${ind.description}`,
      tags: ind.keywords,
      weight: 1.1,
    });
  }

  for (const biz of allBusinesses) {
    docs.push({
      id: `business:${biz.industrySlug}:${biz.id}`,
      type: 'business',
      title: biz.name,
      url: `/local/${biz.industrySlug}#${biz.id}`,
      body: `${biz.tagline} ${biz.categories?.join(' ') ?? ''}`.trim(),
      tags: [biz.industrySlug, ...(biz.categories ?? [])],
      weight: biz.featured ? 1.2 : 0.9,
    });
  }

  for (const ev of events) {
    docs.push({
      id: `event:${ev.slug}`,
      type: 'event',
      title: ev.name,
      url: `/events#${ev.slug}`,
      body: `${ev.description} ${ev.location} ${ev.venue ?? ''}`.trim(),
      tags: [ev.category, ev.location.toLowerCase()],
      weight: ev.isHighlight ? 1.3 : 1.0,
    });
  }
```

- [ ] **Step 3: Reconcile property-name mismatches**

If typecheck complains, open the relevant `data/` file and use the actual field names. Faq items only have `question` + `answer`. Industries have `slug`, `name`, `h1`, `metaDescription`, `description`, `keywords`. Businesses have `id`, `industrySlug`, `name`, `tagline`, `categories`, `featured`. Events have `slug`, `name`, `description`, `location`, `venue`, `category`, `isHighlight`.

- [ ] **Step 4: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add app/lib/search/corpus.ts
git commit -m "feat(search): index FAQs, industries, businesses, events"
```

---

## Task 5: Corpus — neighborhoods + months + services + partners + properties

**Files:**
- Modify: `app/lib/search/corpus.ts`

- [ ] **Step 1: Add imports**

```ts
import { neighborhoods } from '@/data/neighborhoods';
import { months } from '@/data/months';
import { services } from '@/data/services';
import { partners } from '@/data/partners';
import { MARRIOTT_PROPERTIES } from '@/data/marriottProperties';
```

- [ ] **Step 2: Add five loops to `buildCorpus()`**

```ts
  for (const n of neighborhoods) {
    docs.push({
      id: `neighborhood:${n.slug}`,
      type: 'neighborhood',
      title: n.name,
      url: `/hilton-head/${n.slug}`,
      body: `${n.hook} ${n.metaDescription} ${n.tradeoffs}`.trim(),
      tags: n.keywords,
      weight: 1.4,
    });
  }

  for (const m of months) {
    docs.push({
      id: `month:${m.slug}`,
      type: 'month',
      title: `Hilton Head in ${m.name}`,
      url: `/hilton-head-weather/${m.slug}`,
      body: `${m.headline} ${m.intro} High ${m.avgHigh}, low ${m.avgLow}, water ${m.waterTemp}. ${m.bestFor.join(', ')}.`,
      tags: ['weather', m.slug, ...m.bestFor.map((s) => s.toLowerCase())],
      weight: 1.1,
    });
  }

  for (const svc of services.items) {
    docs.push({
      id: `service:${svc.id ?? svc.title.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'service',
      title: svc.title,
      url: svc.href ?? `/services#${svc.id}`,
      body: svc.body ?? svc.summary ?? '',
      tags: ['service'],
      weight: 1.3,
    });
  }

  for (const p of partners) {
    docs.push({
      id: `partner:${p.slug}`,
      type: 'partner',
      title: p.name,
      url: `/partners#${p.slug}`,
      body: `${p.tagline} ${p.description}`,
      tags: [p.category, p.tier, p.location.toLowerCase()],
      weight: 0.8,
    });
  }

  for (const prop of MARRIOTT_PROPERTIES) {
    docs.push({
      id: `property:marriott:${prop.slug}`,
      type: 'property',
      title: prop.name,
      url: `/marriott-bonvoy-stays-hilton-head#${prop.slug}`,
      body: `${prop.positioning} ${prop.insiderTake ?? ''} ${prop.neighborhood} ${prop.brand}`.trim(),
      tags: [prop.brand, prop.neighborhood, prop.oceanfront ? 'oceanfront' : 'inland'],
      weight: 1.0,
    });
  }
```

- [ ] **Step 3: Reconcile property-name mismatches against the actual types**

Check `data/services.ts` for the `services.items[number]` shape and use the real fields. Same for `MarriottProperty.insiderTake` — if the field has a different name, read `data/marriottProperties.ts` and use whatever the real field is called.

- [ ] **Step 4: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add app/lib/search/corpus.ts
git commit -m "feat(search): index neighborhoods, months, services, partners, properties"
```

---

## Task 6: Engine — wire MiniSearch over the corpus

**Files:**
- Modify: `app/lib/search/engine.ts`

- [ ] **Step 1: Replace `engine.ts` with the real implementation**

```ts
import MiniSearch from 'minisearch';
import { buildCorpus, type SearchableDoc, type SearchableDocType } from './corpus';

export type SearchHit = SearchableDoc & {
  score: number;
};

export type SearchOpts = {
  types?: SearchableDocType[];
  limit?: number;
};

const FIELD_WEIGHTS = { title: 4, tags: 2, body: 1 } as const;

let cached: MiniSearch<SearchableDoc> | null = null;
let cachedDocs: SearchableDoc[] | null = null;

function getIndex(): { mini: MiniSearch<SearchableDoc>; docs: SearchableDoc[] } {
  if (cached && cachedDocs) return { mini: cached, docs: cachedDocs };

  const docs = buildCorpus();
  const mini = new MiniSearch<SearchableDoc>({
    fields: ['title', 'tags', 'body'],
    storeFields: ['id', 'type', 'title', 'url', 'body', 'tags', 'weight'],
    extractField: (doc, field) => {
      const value = (doc as unknown as Record<string, unknown>)[field];
      if (Array.isArray(value)) return value.join(' ');
      return value == null ? '' : String(value);
    },
    searchOptions: {
      boost: FIELD_WEIGHTS,
      fuzzy: 0.2,
      prefix: true,
      combineWith: 'AND',
    },
  });
  mini.addAll(docs);

  cached = mini;
  cachedDocs = docs;
  return { mini, docs };
}

export function search(query: string, opts: SearchOpts = {}): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const { mini } = getIndex();
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);

  const raw = mini.search(q, {
    filter: opts.types
      ? (result) => opts.types!.includes((result as unknown as SearchableDoc).type)
      : undefined,
  });

  return raw
    .map((r) => {
      const doc = r as unknown as SearchableDoc & { score: number };
      return { ...doc, score: doc.score * (doc.weight ?? 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function corpusSize(): number {
  return getIndex().docs.length;
}
```

- [ ] **Step 2: Typecheck passes**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Build the app to confirm the index initializes at runtime**

```bash
npm run build
```

Expected: Build completes. If the corpus build throws, the error surfaces here.

- [ ] **Step 4: Commit**

```bash
git add app/lib/search/engine.ts
git commit -m "feat(search): wire MiniSearch index with weighted ranking"
```

---

## Task 7: API route `/api/search`

**Files:**
- Create: `app/api/search/route.ts`
- Create: `tests/search-api.spec.ts`

- [ ] **Step 1: Write the failing Playwright test**

Create `tests/search-api.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test('GET /api/search returns hits for a known term', async ({ request }) => {
  const res = await request.get(`${BASE}/api/search?q=heritage&limit=5`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('hits');
  expect(Array.isArray(body.hits)).toBe(true);
  expect(body.hits.length).toBeGreaterThan(0);
  expect(body.hits[0]).toHaveProperty('title');
  expect(body.hits[0]).toHaveProperty('url');
  expect(body.hits[0]).toHaveProperty('type');
  expect(body.total).toBeGreaterThanOrEqual(body.hits.length);
});

test('GET /api/search rejects empty query', async ({ request }) => {
  const res = await request.get(`${BASE}/api/search?q=`);
  expect(res.status()).toBe(400);
});

test('GET /api/search supports type filter', async ({ request }) => {
  const res = await request.get(`${BASE}/api/search?q=hilton&type=post&limit=3`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  for (const hit of body.hits) expect(hit.type).toBe('post');
});
```

- [ ] **Step 2: Run the test, watch it fail**

In one terminal: `npm run dev`. In another:

```bash
npx playwright test tests/search-api.spec.ts
```

Expected: All three tests fail with 404 (route doesn't exist yet).

- [ ] **Step 3: Implement the route**

Create `app/api/search/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { search, type SearchHit } from '@/app/lib/search/engine';
import type { SearchableDocType } from '@/app/lib/search/corpus';

export const runtime = 'nodejs';

const MAX_QUERY = 200;
const ALLOWED_TYPES: ReadonlyArray<SearchableDocType> = [
  'page', 'post', 'story', 'business', 'industry', 'event',
  'faq', 'neighborhood', 'month', 'service', 'partner',
  'trip-type', 'property',
];

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const rawQ = url.searchParams.get('q') ?? '';
  const q = rawQ.trim().slice(0, MAX_QUERY);

  if (q.length < 2) {
    return NextResponse.json({ error: 'q required (min 2 chars)' }, { status: 400 });
  }

  const typeParam = url.searchParams.get('type');
  const types = typeParam
    ? typeParam.split(',').filter((t): t is SearchableDocType =>
        ALLOWED_TYPES.includes(t as SearchableDocType),
      )
    : undefined;

  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 10, 1), 50) : 10;

  const hits: SearchHit[] = search(q, { types: types && types.length > 0 ? types : undefined, limit });

  return NextResponse.json(
    { q, total: hits.length, hits },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' } },
  );
}
```

- [ ] **Step 4: Run the test, watch it pass**

```bash
npx playwright test tests/search-api.spec.ts
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add app/api/search/route.ts tests/search-api.spec.ts
git commit -m "feat(search): /api/search route + smoke tests"
```

---

## Task 8: SSR `/search` page + shared result components

**Files:**
- Create: `components/search/TypeBadge.tsx`
- Create: `components/search/ResultCard.tsx`
- Create: `app/search/page.tsx`
- Create: `app/search/loading.tsx`
- Create: `tests/search-page.spec.ts`

- [ ] **Step 1: Create `TypeBadge.tsx`**

```tsx
import type { SearchableDocType } from '@/app/lib/search/corpus';

const LABEL: Record<SearchableDocType, string> = {
  page: 'Page',
  post: 'Post',
  story: 'Story',
  business: 'Business',
  industry: 'Directory',
  event: 'Event',
  faq: 'FAQ',
  neighborhood: 'Neighborhood',
  month: 'Weather',
  service: 'Service',
  partner: 'Partner',
  'trip-type': 'Trip Type',
  property: 'Stay',
};

const CLASS: Record<SearchableDocType, string> = {
  page: 'bg-ink/10 text-ink',
  post: 'bg-ocean-light/40 text-ocean-deep',
  story: 'bg-gold/30 text-ink',
  business: 'bg-palm-light/40 text-palm-deep',
  industry: 'bg-palm-light/30 text-palm-deep',
  event: 'bg-coral/30 text-ink',
  faq: 'bg-sand-deep/40 text-ink',
  neighborhood: 'bg-ocean-light/50 text-ocean-deep',
  month: 'bg-sand-soft/60 text-ink',
  service: 'bg-ocean-mid/30 text-ocean-deep',
  partner: 'bg-gold/20 text-ink',
  'trip-type': 'bg-coral/20 text-ink',
  property: 'bg-ocean-light/30 text-ocean-deep',
};

export function TypeBadge({ type }: { type: SearchableDocType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${CLASS[type]}`}
    >
      {LABEL[type]}
    </span>
  );
}
```

- [ ] **Step 2: Create `ResultCard.tsx`**

```tsx
import Link from 'next/link';
import { TypeBadge } from './TypeBadge';
import type { SearchHit } from '@/app/lib/search/engine';

function highlight(text: string, q: string): React.ReactNode {
  if (!q || !text) return text;
  const terms = q
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (terms.length === 0) return text;
  const re = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-gold/30 text-ink rounded-sm px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function ResultCard({ hit, query }: { hit: SearchHit; query: string }) {
  const snippet = hit.body.length > 180 ? `${hit.body.slice(0, 177)}…` : hit.body;
  return (
    <Link
      href={hit.url}
      className="block rounded-lg border border-ink/10 bg-cream p-4 transition hover:border-ocean-mid/60 hover:bg-cream/80"
    >
      <div className="flex items-center gap-2">
        <TypeBadge type={hit.type} />
        <span className="text-[11px] text-ink-soft">{hit.url}</span>
      </div>
      <h3 className="mt-2 text-[15px] font-semibold text-ink leading-snug">
        {highlight(hit.title, query)}
      </h3>
      {snippet && (
        <p className="mt-1 text-[13px] text-ink-soft leading-relaxed line-clamp-2">
          {highlight(snippet, query)}
        </p>
      )}
    </Link>
  );
}
```

- [ ] **Step 3: Create `app/search/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <main className="mx-auto max-w-[920px] px-5 py-12">
      <div className="h-8 w-48 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-ink/5" />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create `app/search/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { search, type SearchHit } from '@/app/lib/search/engine';
import type { SearchableDocType } from '@/app/lib/search/corpus';
import { ResultCard } from '@/components/search/ResultCard';
import { brand } from '@/data/brand';

const GROUP_ORDER: SearchableDocType[] = [
  'page', 'service', 'trip-type', 'neighborhood', 'property',
  'industry', 'business', 'post', 'story', 'faq', 'event',
  'month', 'partner',
];

const GROUP_TITLE: Record<SearchableDocType, string> = {
  page: 'Pages',
  service: 'Services',
  'trip-type': 'Trip Planning',
  neighborhood: 'Neighborhoods',
  property: 'Stays',
  industry: 'Directories',
  business: 'Businesses',
  post: 'Guides & Posts',
  story: 'Stories',
  faq: 'FAQs',
  event: 'Events',
  month: 'Weather by Month',
  partner: 'Partners',
};

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  if (!query) {
    return {
      title: 'Search',
      description: `Search ${brand.name} for posts, stories, businesses, events, FAQs, and pages.`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `Search results for "${query}"`,
    description: `Results matching "${query}" across ${brand.name} posts, stories, businesses, FAQs, and pages.`,
    alternates: { canonical: `/search?q=${encodeURIComponent(query)}` },
    robots: { index: true, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const hits = query.length >= 2 ? search(query, { limit: 100 }) : [];

  const grouped = new Map<SearchableDocType, SearchHit[]>();
  for (const hit of hits) {
    const list = grouped.get(hit.type) ?? [];
    list.push(hit);
    grouped.set(hit.type, list);
  }

  return (
    <main className="mx-auto max-w-[920px] px-5 py-12">
      <header className="mb-8">
        <p className="eyebrow text-ink-soft">Search</p>
        <h1 className="display mt-1 text-[32px] leading-tight text-ink sm:text-[40px]">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search Hilton Ahead'}
        </h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          {query
            ? `${hits.length} result${hits.length === 1 ? '' : 's'}`
            : 'Type a query in the header to start.'}
        </p>
      </header>

      {query && hits.length === 0 && (
        <section className="rounded-lg border border-ink/10 bg-cream/60 p-6">
          <p className="text-[14px] text-ink">No results for &ldquo;{query}&rdquo;.</p>
          <p className="mt-2 text-[13px] text-ink-soft">Try one of these:</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-[13px]">
            {['heritage', 'golf', 'beach', 'restaurants', 'oceanfront villa', 'weather'].map((s) => (
              <li key={s}>
                <Link
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-ink/15 px-3 py-1 text-ink hover:border-ocean-mid"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {GROUP_ORDER.map((type) => {
        const items = grouped.get(type);
        if (!items || items.length === 0) return null;
        return (
          <section key={type} className="mb-10">
            <h2 className="eyebrow mb-3 text-ink-soft">{GROUP_TITLE[type]}</h2>
            <div className="space-y-3">
              {items.slice(0, 8).map((hit) => (
                <ResultCard key={hit.id} hit={hit} query={query} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
```

- [ ] **Step 5: Write the Playwright test**

Create `tests/search-page.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test('/search?q= renders grouped results SSR', async ({ page }) => {
  await page.goto(`${BASE}/search?q=heritage`);
  await expect(page.locator('h1')).toContainText('heritage');
  const cards = page.locator('a[href]:has(h3)');
  await expect(cards.first()).toBeVisible();
});

test('/search with no query shows the empty prompt', async ({ page }) => {
  await page.goto(`${BASE}/search`);
  await expect(page.locator('h1')).toContainText('Search Hilton Ahead');
});

test('/search with garbage query shows suggested terms', async ({ page }) => {
  await page.goto(`${BASE}/search?q=zzqxnonsense`);
  await expect(page.getByText('No results for')).toBeVisible();
  await expect(page.getByRole('link', { name: 'heritage' })).toBeVisible();
});
```

- [ ] **Step 6: Run the tests**

```bash
npx playwright test tests/search-page.spec.ts
```

Expected: 3 passed (dev server must be running on :3000).

- [ ] **Step 7: Commit**

```bash
git add app/search components/search tests/search-page.spec.ts
git commit -m "feat(search): SSR /search page + ResultCard + TypeBadge"
```

---

## Task 9: Header `SearchBar` (desktop)

**Files:**
- Create: `components/search/SearchBar.tsx`
- Modify: `components/sections/Header.tsx`
- Create: `tests/search-bar.spec.ts`

- [ ] **Step 1: Write the failing Playwright test**

Create `tests/search-bar.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Header SearchBar', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('shows dropdown after typing 2+ chars', async ({ page }) => {
    await page.goto(BASE);
    const input = page.getByPlaceholder(/Search posts/i);
    await expect(input).toBeVisible();
    await input.fill('heritage');
    const dropdown = page.getByRole('listbox', { name: /search results/i });
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('a')).not.toHaveCount(0);
  });

  test('Enter navigates to /search?q=', async ({ page }) => {
    await page.goto(BASE);
    const input = page.getByPlaceholder(/Search posts/i);
    await input.fill('golf');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=golf/);
  });

  test('Cmd+K / Ctrl+K focuses the bar', async ({ page, browserName }) => {
    await page.goto(BASE);
    const key = browserName === 'webkit' ? 'Meta+k' : 'Control+k';
    await page.keyboard.press(key);
    const input = page.getByPlaceholder(/Search posts/i);
    await expect(input).toBeFocused();
  });

  test('Escape clears and blurs', async ({ page }) => {
    await page.goto(BASE);
    const input = page.getByPlaceholder(/Search posts/i);
    await input.fill('heritage');
    await input.press('Escape');
    await expect(input).toHaveValue('');
  });
});
```

- [ ] **Step 2: Run the test, watch it fail**

```bash
npx playwright test tests/search-bar.spec.ts --project=chromium
```

Expected: All four tests fail — placeholder not found.

- [ ] **Step 3: Create `components/search/SearchBar.tsx`**

```tsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchableDocType } from '@/app/lib/search/corpus';
import { TypeBadge } from './TypeBadge';

type ApiHit = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
};

type Props = {
  variant?: 'header' | 'overlay';
  autoFocus?: boolean;
  onNavigate?: () => void;
};

const DEBOUNCE_MS = 150;
const MIN_CHARS = 2;

export default function SearchBar({ variant = 'header', autoFocus = false, onNavigate }: Props) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ApiHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listboxId = useId();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-focus when requested (overlay variant)
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Debounced fetch
  useEffect(() => {
    if (q.trim().length < MIN_CHARS) {
      setHits([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
        if (!res.ok) {
          setHits([]);
          setOpen(true);
          return;
        }
        const body = (await res.json()) as { hits: ApiHit[] };
        setHits(body.hits ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        setHits([]);
        setOpen(true);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  // Click outside closes
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function goTo(url: string) {
    setOpen(false);
    setQ('');
    onNavigate?.();
    router.push(url);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && hits[active]) {
        goTo(hits[active].url);
      } else if (q.trim().length >= MIN_CHARS) {
        goTo(`/search?q=${encodeURIComponent(q.trim())}`);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQ('');
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className={isHeader ? 'relative w-[260px] lg:w-[320px]' : 'relative w-full'}>
      <div className="relative flex items-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 h-4 w-4 text-ink-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => q.length >= MIN_CHARS && setOpen(true)}
          placeholder="Search posts, places, FAQs…"
          aria-label="Search the site"
          aria-controls={listboxId}
          aria-expanded={open}
          role="combobox"
          autoComplete="off"
          className={
            isHeader
              ? 'h-9 w-full rounded-full border border-ink/15 bg-cream/70 pl-9 pr-14 text-[13px] text-ink placeholder:text-ink-soft/70 focus:border-ocean-mid focus:bg-cream focus:outline-none focus:ring-2 focus:ring-ocean-mid/30 transition'
              : 'h-12 w-full rounded-lg border border-ink/15 bg-cream pl-10 pr-4 text-[16px] text-ink placeholder:text-ink-soft/70 focus:border-ocean-mid focus:outline-none focus:ring-2 focus:ring-ocean-mid/30'
          }
        />
        {isHeader && (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-3 rounded border border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-ink-soft"
          >
            ⌘K
          </kbd>
        )}
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-ink/10 bg-cream p-2 shadow-[0_24px_64px_-24px_rgba(11,42,53,0.35)]"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-4 text-[13px] text-ink-soft">No results. Press Enter to view the full results page.</p>
          ) : (
            <>
              <ul className="space-y-1">
                {hits.map((hit, i) => (
                  <li key={hit.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => goTo(hit.url)}
                      className={`flex w-full flex-col items-start gap-1 rounded-md px-3 py-2 text-left transition ${
                        i === active ? 'bg-ink/[0.05]' : 'hover:bg-ink/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <TypeBadge type={hit.type} />
                        <span className="text-[13px] font-medium text-ink">{hit.title}</span>
                      </div>
                      {hit.body && (
                        <span className="line-clamp-1 text-[12px] text-ink-soft">{hit.body}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-ink/10 pt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(q)}`}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="block rounded-md px-3 py-2 text-[12px] text-ocean-deep hover:bg-ink/[0.04]"
                >
                  See all results for &ldquo;{q}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Mount `SearchBar` in `components/sections/Header.tsx`**

Add the import at the top with the other component imports:

```tsx
import SearchBar from '@/components/search/SearchBar';
```

Inside the `<div className="hidden flex-wrap items-center gap-6 text-[13px] md:flex lg:gap-8">` block, insert `<SearchBar />` between the closing `</nav>` and the booking CTA `<Link>`:

```tsx
          </nav>
          <SearchBar />
          <Link
            href={brand.cta.bookingPagePath}
            ...
```

- [ ] **Step 5: Typecheck + run tests**

```bash
npm run typecheck
npx playwright test tests/search-bar.spec.ts --project=chromium
```

Expected: typecheck clean, 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/search/SearchBar.tsx components/sections/Header.tsx tests/search-bar.spec.ts
git commit -m "feat(search): header SearchBar with debounced dropdown + ⌘K"
```

---

## Task 10: Mobile search trigger + overlay

**Files:**
- Create: `components/search/MobileSearchTrigger.tsx`
- Modify: `components/sections/Header.tsx`
- Modify: `tests/search-bar.spec.ts`

- [ ] **Step 1: Create `MobileSearchTrigger.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

export default function MobileSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-cream/70 text-ink transition hover:bg-cream"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-cream md:hidden">
          <div className="mx-auto flex max-w-[640px] flex-col gap-4 px-5 pt-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-ink-soft">Search</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="rounded-full border border-ink/15 px-3 py-1 text-[12px] text-ink hover:bg-ink/5"
              >
                Close
              </button>
            </div>
            <SearchBar variant="overlay" autoFocus onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Mount it in `Header.tsx` next to `<MobileMenu />`**

Import at the top:

```tsx
import MobileSearchTrigger from '@/components/search/MobileSearchTrigger';
```

Replace `<MobileMenu />` at the bottom of the `<header>` with a flex wrapper containing both:

```tsx
        <div className="flex items-center gap-2 md:hidden">
          <MobileSearchTrigger />
          <MobileMenu />
        </div>
```

- [ ] **Step 3: Extend `tests/search-bar.spec.ts` with the mobile case**

Append at the end of the file:

```ts
test.describe('Mobile search overlay', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('icon opens overlay with autofocused input', async ({ page }) => {
    await page.goto(BASE);
    await page.getByLabel('Open search').click();
    const input = page.getByPlaceholder(/Search posts/i);
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('Close button dismisses the overlay', async ({ page }) => {
    await page.goto(BASE);
    await page.getByLabel('Open search').click();
    await page.getByRole('button', { name: 'Close search' }).click();
    await expect(page.getByPlaceholder(/Search posts/i)).toHaveCount(0);
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npx playwright test tests/search-bar.spec.ts --project=chromium
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/search/MobileSearchTrigger.tsx components/sections/Header.tsx tests/search-bar.spec.ts
git commit -m "feat(search): mobile search overlay with magnifier trigger"
```

---

## Task 11: SEO schema — `SearchAction` + `SearchResultsPage`

**Files:**
- Modify: `app/lib/metadata.ts`
- Modify: `app/search/page.tsx`

- [ ] **Step 1: Re-enable `potentialAction` in `getWebSiteSchema()`**

Open `app/lib/metadata.ts`, find:

```ts
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: brand.name,
    alternateName: brand.legalName,
    description: brand.shortDescription,
    inLanguage: 'en-US',
    publisher: { '@id': `${siteUrl}#organization` },
  }
}
```

Add the `potentialAction` field before the closing `}`:

```ts
    publisher: { '@id': `${siteUrl}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
```

- [ ] **Step 2: Add `getSearchResultsPageSchema()` at the bottom of `metadata.ts`**

```ts
export function getSearchResultsPageSchema(input: {
  query: string;
  totalResults: number;
  items: ReadonlyArray<{ url: string; name: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${input.query}"`,
    url: `${siteUrl}/search?q=${encodeURIComponent(input.query)}`,
    isPartOf: { '@id': `${siteUrl}#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.totalResults,
      itemListElement: input.items.slice(0, 20).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: it.url.startsWith('http') ? it.url : `${siteUrl}${it.url}`,
        name: it.name,
      })),
    },
  };
}
```

- [ ] **Step 3: Emit the schema from `app/search/page.tsx`**

Add the import at the top of `app/search/page.tsx`:

```ts
import { getSearchResultsPageSchema } from '@/app/lib/metadata';
```

Inside the component, after computing `hits` and before the `return`:

```ts
  const schema =
    query && hits.length > 0
      ? getSearchResultsPageSchema({
          query,
          totalResults: hits.length,
          items: hits.map((h) => ({ url: h.url, name: h.title })),
        })
      : null;
```

Inside the returned `<main>`, before `<header>`, render:

```tsx
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
```

- [ ] **Step 4: Verify schema renders**

```bash
npm run dev
```

In another shell:

```bash
curl -s "http://localhost:3000/search?q=heritage" | grep -c "SearchResultsPage"
```

Expected: `1`.

Also verify the WebSite SearchAction appears on the homepage:

```bash
curl -s http://localhost:3000/ | grep -c "SearchAction"
```

Expected: `1`.

- [ ] **Step 5: Typecheck + tests still pass**

```bash
npm run typecheck
npx playwright test tests/search-page.spec.ts
```

Expected: clean + 3 passed.

- [ ] **Step 6: Commit**

```bash
git add app/lib/metadata.ts app/search/page.tsx
git commit -m "feat(search): enable WebSite SearchAction + emit SearchResultsPage schema"
```

---

## Task 12: LLM SEO assets — llms.txt, opensearch.xml, sitemap, layout link

**Files:**
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`
- Create: `public/opensearch.xml`
- Modify: `app/layout.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Append the Site Search section to `public/llms.txt`**

At the end of the file, append:

```
## Site Search

- [Site search endpoint](https://www.hiltonahead.com/search?q={query}) — Full-site search across posts, stories, businesses, FAQs, neighborhoods, events, and pages. Substitute `{query}` with URL-encoded keywords (e.g., `golf+packages`, `oceanfront+villa`, `heritage+2027`).
```

- [ ] **Step 2: Append the same section to `public/llms-full.txt` with examples**

At the end of the file, append:

```
## Site Search

A crawlable, JSON-LD-annotated search results page at `/search?q={query}`. Examples:

- https://www.hiltonahead.com/search?q=heritage — RBC Heritage tournament content.
- https://www.hiltonahead.com/search?q=oceanfront+villa — oceanfront villa neighborhoods, listings, and posts.
- https://www.hiltonahead.com/search?q=restaurants — restaurant directory and dining posts.
- https://www.hiltonahead.com/search?q=weather+october — month-specific weather pages.

The page emits `SearchResultsPage` + `ItemList` JSON-LD with the top 20 results. A JSON API at `/api/search?q={query}` returns the same hits as a structured payload for programmatic consumers.
```

- [ ] **Step 3: Create `public/opensearch.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Hilton Ahead</ShortName>
  <Description>Search Hilton Ahead Travel Co. for posts, stories, businesses, FAQs, and pages.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="32" height="32" type="image/svg+xml">https://www.hiltonahead.com/logo/hilton-ahead-mark.svg</Image>
  <Url type="text/html" template="https://www.hiltonahead.com/search?q={searchTerms}"/>
  <Url type="application/json" template="https://www.hiltonahead.com/api/search?q={searchTerms}"/>
  <moz:SearchForm xmlns:moz="http://www.mozilla.org/2006/browser/search/">https://www.hiltonahead.com/search</moz:SearchForm>
</OpenSearchDescription>
```

- [ ] **Step 4: Add `<link rel="search">` to `app/layout.tsx`**

Find the `<head>` section (inside the returned `<html>`). If the layout uses Next's metadata API for icons and links, add `search` under `metadata.alternates`:

In `metadata`:

```ts
  alternates: {
    canonical: siteUrl,
    types: {
      'application/opensearchdescription+xml': '/opensearch.xml',
    },
  },
```

If `alternates.types` is not respected by Next 16 for the search descriptor, fall back to rendering it directly inside `<head>` via the body of `RootLayout`:

```tsx
<link rel="search" type="application/opensearchdescription+xml" title="Hilton Ahead" href="/opensearch.xml" />
```

Pick whichever path actually emits the tag — verify by `curl -s http://localhost:3000 | grep opensearch`.

- [ ] **Step 5: Add `/search` to the sitemap**

Open `app/sitemap.ts`. Add to the `STATIC_ROUTES` array:

```ts
  { path: '/search', changeFrequency: 'monthly', priority: 0.4 },
```

(Low priority — it's an entry point, not a content page. Query URLs are not enumerated.)

- [ ] **Step 6: Verify**

```bash
npm run build
```

In dev:

```bash
curl -s http://localhost:3000/opensearch.xml | head -5
curl -s http://localhost:3000/ | grep -i "opensearchdescription"
curl -s http://localhost:3000/sitemap.xml | grep -c "/search"
```

Expected: opensearch.xml served, link in head, sitemap contains `/search`.

- [ ] **Step 7: Commit**

```bash
git add public/llms.txt public/llms-full.txt public/opensearch.xml app/layout.tsx app/sitemap.ts
git commit -m "feat(search): llms.txt entry, opensearch descriptor, sitemap, layout link"
```

---

## Task 13: Acceptance pass

**Files:** none (verification only)

- [ ] **Step 1: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: both pass with 0 errors.

- [ ] **Step 2: Run the full Playwright suite for search**

```bash
npx playwright test tests/search-api.spec.ts tests/search-page.spec.ts tests/search-bar.spec.ts
```

Expected: all tests pass on chromium.

- [ ] **Step 3: Production build + serve**

```bash
npm run build
npm run start
```

In another shell, smoke-test the LLM-crawler path:

```bash
curl -A "ClaudeBot" -s http://localhost:3000/search?q=golf | grep -c "SearchResultsPage"
curl -A "GPTBot" -s http://localhost:3000/search?q=heritage | grep -c "<h1"
```

Expected: both return `1` or higher.

- [ ] **Step 4: Manual smoke (visual + keyboard)**

In the browser at `http://localhost:3000`:

- Header bar is visible between nav and CTA on desktop.
- ⌘K (mac) / Ctrl+K (win/linux) focuses the bar.
- Typing `heritage` opens the dropdown within ~200 ms.
- ↑ ↓ Enter navigate to a result.
- Esc clears.
- Shrink the viewport to ≤ 768 px: bar collapses, magnifier icon appears next to the hamburger; tapping it opens the full-screen overlay.
- Visit `/search?q=golf` — grouped results render, View-source contains `<script type="application/ld+json">` with `"@type":"SearchResultsPage"`.

- [ ] **Step 5: Lighthouse SEO check (optional but recommended)**

Run Lighthouse on `/search?q=golf` (Chrome DevTools → Lighthouse → SEO category).

Expected: score ≥ 95. If below, the most likely culprits are missing canonical (already set) or meta description (already set) — re-check `generateMetadata` output for the query case.

- [ ] **Step 6: Final commit if any polish was needed**

If steps 1–5 surfaced no issues, no commit. Otherwise, fix inline and commit with `fix(search): <what>`.

---

## Self-Review

**Spec coverage:**

- ✅ §1 Purpose — every goal mapped to a task (nav: 9–10; org: 4–5; SEO: 11–12; LLM SEO: 12; aesthetic: 9).
- ✅ §3 Architecture — corpus (Tasks 2–5), engine (6), API (7), SSR page (8), SearchBar (9), MobileSearchTrigger (10).
- ✅ §3.6 Mobile — Task 10.
- ✅ §4 SEO/LLM hooks — Tasks 11 (schema) and 12 (llms.txt, opensearch, sitemap, layout link).
- ✅ §5 Design system — colors and classes embedded in component code (Tasks 8–10).
- ✅ §8 Error handling — empty/no-result states in `/search` page (Task 8), 400 in API (Task 7), fetch-failure message in dropdown (Task 9).
- ✅ §9 Testing — Playwright tests in Tasks 7, 8, 9, 10; acceptance pass Task 13.
- ✅ §11 Acceptance criteria — covered in Task 13.

**Placeholder scan:** No "TBD" / "TODO" / "implement later" in code blocks. Steps that depend on the real data-module shape (Tasks 3–5) include explicit "reconcile property-name mismatches" guidance with named fields to check, not a generic "fix the types."

**Type consistency:** `SearchableDoc`, `SearchableDocType`, and `SearchHit` are defined in Task 1 and referenced consistently in Tasks 2–11. The API response shape (`{ q, total, hits }`) defined in Task 7 matches the `ApiHit`/fetch handler in Task 9. `getSearchResultsPageSchema` signature in Task 11 matches its call site in `app/search/page.tsx`.

**Known gotcha:** Two `data/` field reads (`post.description`, `story.dek/summary`, `service.body/summary/id`, `marriottProperty.insiderTake`) are inferred and may need adjustment when the executor reads the actual types. Tasks 3 and 5 call this out explicitly.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-21-site-search.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
