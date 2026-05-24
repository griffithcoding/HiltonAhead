# Site Search — Design Spec

**Date:** 2026-05-21
**Owner:** William Griffith
**Status:** Approved (brainstorm phase) — pending implementation plan
**Branch target:** `feat/site-search`

## 1. Purpose

Add a strong, always-visible site search to the top nav header of HiltonAhead. Search must serve four goals in priority order:

1. **Navigation** — let visitors jump to any page, post, business, or FAQ in two keystrokes.
2. **Organization** — surface the breadth of the site (50+ landing pages, blog posts, stories, local-business directory, events, FAQs) that the current nav can only sample.
3. **SEO** — ship a crawlable `/search?q=` results page and satisfy the WebSite SearchAction schema that `app/lib/metadata.ts` currently leaves dormant.
4. **LLM SEO** — expose the same `/search?q=` endpoint to LLM crawlers (already allow-listed in `app/robots.ts`) and document it in `public/llms.txt` so ChatGPT / Claude / Perplexity can query the site directly.
5. **Aesthetic** — the search bar must feel native to the editorial masthead, not bolted on. Pill input, Fraunces+Instrument Sans typography, brand palette, subtle `⌘K` chip.

## 2. Non-Goals

- No hosted search service (Algolia, Typesense, Meilisearch).
- No search analytics dashboard in this phase. Logging to a `search_queries` table can be added later via the existing `directory_events` pattern.
- No advanced filters or facets. Grouping by document type is sufficient.
- No spell-correction beyond what MiniSearch's built-in fuzzy matching provides.
- No personalized or session-aware ranking.

## 3. Architecture

```
data/* ──────────────► app/lib/search/corpus.ts ──┐
posts/stories/etc.                                 │
                                                   ▼
                                  app/lib/search/engine.ts (MiniSearch)
                                                   │
                ┌──────────────────────────────────┼─────────────────────────────┐
                ▼                                  ▼                              ▼
   app/api/search/route.ts             app/search/page.tsx           components/search/SearchBar.tsx
   (JSON, live dropdown)               (SSR, crawlable)              (client, debounced fetch)
```

### 3.1 Corpus (`app/lib/search/corpus.ts`)

Single source of truth for the searchable document set. Builds a `SearchableDoc[]` from the existing static data modules. No new content lives here — it only re-shapes what already exists.

```ts
export type SearchableDocType =
  | 'page'        // /about, /founder, /contact, /services, /press, /partners, /sponsorships, /faq, /itinerary
  | 'post'        // data/posts.ts
  | 'story'       // data/stories.ts
  | 'business'    // data/localBusinesses.ts (all industries)
  | 'event'       // data/events.ts
  | 'faq'         // data/faq.ts (faqAll, flat)
  | 'neighborhood'// data/neighborhoods.ts
  | 'month'       // data/months.ts (weather-by-month)
  | 'service'     // data/services.ts
  | 'partner'     // data/partners.ts
  | 'trip-type'   // data/tripTypes.ts
  | 'property';   // data/marriottProperties.ts (and future affiliate property registries)

export type SearchableDoc = {
  id: string;            // stable, unique across the corpus, e.g. "post:best-time-to-visit"
  type: SearchableDocType;
  title: string;
  url: string;           // absolute path
  body: string;          // searchable text body (description + relevant fields concatenated)
  tags: string[];        // e.g. ['golf','heritage','spring'] — used for boosts and badges
  weight?: number;       // optional per-doc multiplier (1.0 default). High-intent pages (e.g. /itinerary) bump to 1.5.
};

export function buildCorpus(): SearchableDoc[];
```

The function is pure and deterministic — same `data/` snapshot produces the same corpus. It runs once per server instance at module load and is reused across requests.

There is no `data/pages.ts` module — the `page` type docs (`/about`, `/founder`, `/contact`, `/services`, `/press`, `/partners`, `/sponsorships`, `/faq`, `/itinerary`) are defined as a static inline array inside `corpus.ts`. This avoids a low-value refactor of perfectly-fine page files. When a new top-level page is added, its entry is appended to that array as part of the same PR.

### 3.2 Engine (`app/lib/search/engine.ts`)

Wraps **[MiniSearch](https://lucaong.github.io/minisearch/)** (≈10 KB gz, MIT, BM25 + prefix + fuzzy + per-field weighting).

```ts
import MiniSearch from 'minisearch';
import { buildCorpus, type SearchableDoc, type SearchableDocType } from './corpus';

const FIELD_WEIGHTS = { title: 4, tags: 2, body: 1 } as const;
const FUZZY = 0.2;       // tolerate ~1 typo per 5 chars
const PREFIX = true;     // match "char" → "charleston"

export type SearchHit = SearchableDoc & {
  score: number;
  match: Record<string, string[]>; // matched terms per field, used for highlighting
};

let cached: MiniSearch<SearchableDoc> | null = null;

function getIndex(): MiniSearch<SearchableDoc> {
  if (cached) return cached;
  const mini = new MiniSearch<SearchableDoc>({
    fields: ['title', 'tags', 'body'],
    storeFields: ['id', 'type', 'title', 'url', 'body', 'tags', 'weight'],
    searchOptions: {
      boost: FIELD_WEIGHTS,
      fuzzy: FUZZY,
      prefix: PREFIX,
      combineWith: 'AND',
    },
  });
  mini.addAll(buildCorpus());
  cached = mini;
  return mini;
}

export function search(
  query: string,
  opts?: { types?: SearchableDocType[]; limit?: number },
): SearchHit[];
```

Search applies the doc's `weight` as a post-hoc score multiplier so high-intent pages (`/itinerary`, `/contact`, `/services`) bubble up.

### 3.3 API route (`app/api/search/route.ts`)

```
GET /api/search?q=<query>&type=<type>&limit=<n>
→ 200 { hits: SearchHit[], total: number, q: string }
→ 400 if q is missing or > 200 chars
```

- Edge runtime where supported, otherwise Node.
- Response cached with `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`.
- No auth — purely public. Rate-limited only by Vercel's default per-IP throttling.

### 3.4 SSR results page (`app/search/page.tsx`)

- Server component. Reads `?q=` from `searchParams`.
- Runs `search(q)` server-side (no client fetch needed for first paint).
- Renders grouped sections by type, each with a card list and a "View all results" link when truncated.
- States: empty query (show popular queries + featured pages), no results (show 5 suggested queries + the top 3 most-viewed posts as fallback).
- Metadata: `noindex` on empty/no-result pages; `index, follow` when there's a real query.
- JSON-LD: `SearchResultsPage` + `ItemList` of the top results, both via new helpers in `app/lib/metadata.ts`.
- Pagination: `?q=…&page=N`, 20 results per page.

### 3.5 Header bar (`components/search/SearchBar.tsx`)

Client component. Lives in `components/sections/Header.tsx` between the nav and the CTA on `md:` and up.

Behaviour:

- Pill `<input>` with placeholder `Search posts, places, FAQs…`.
- Debounced 150 ms; queries < 2 chars do nothing.
- Fetches `/api/search?q=…&limit=8`.
- Dropdown anchored to the input, max-width 480 px, max-height 70 vh, scrolls internally.
- Results grouped by type with Fraunces eyebrow headers.
- Each hit: type badge (color-coded by type using brand tokens), title (bold), one-line snippet with `<mark>` around matches.
- Keyboard: `⌘K` / `Ctrl+K` focuses the bar from anywhere; `↑` `↓` move selection; `Enter` navigates to the highlighted hit or to `/search?q=` if none highlighted; `Esc` clears and blurs.
- Footer row: "See all results for "X" →" → `/search?q=X`.
- `aria-combobox`, `aria-expanded`, `aria-activedescendant` for screen-reader correctness.

### 3.6 Mobile (`components/search/MobileSearchTrigger.tsx`)

- Magnifying-glass icon button placed left of the hamburger inside `MobileMenu` trigger row.
- Opens a full-screen overlay (`fixed inset-0 bg-cream`) with the same `SearchBar` logic, full-width, large input.
- Closes on result tap, Esc, or back gesture.

## 4. SEO / LLM SEO hooks

### 4.1 WebSite SearchAction

Re-enable `potentialAction` in `getWebSiteSchema()` (`app/lib/metadata.ts`). The CLAUDE.md note explicitly reserves this for when `/search?q=` ships.

```json
{
  "@type": "SearchAction",
  "target": "https://hiltonahead.com/search?q={search_term_string}",
  "query-input": "required name=search_term_string"
}
```

### 4.2 New schema helpers in `app/lib/metadata.ts`

- `getSearchResultsPageSchema({ query, totalResults, items })` → `SearchResultsPage` JSON-LD.
- Existing `getItemListSchema` is reused for the results list.

### 4.3 llms.txt

Add a new section to `public/llms.txt`:

```
## Site Search
- https://hiltonahead.com/search?q={query} — Full-site search across posts, stories, businesses, FAQs, and pages. Substitute {query} with URL-encoded keywords.
```

Mirror the section in `public/llms-full.txt` with one or two example queries.

### 4.4 OpenSearch descriptor

- Static `public/opensearch.xml` describing the `/search?q=` endpoint.
- `<link rel="search" type="application/opensearchdescription+xml" title="HiltonAhead" href="/opensearch.xml">` added in `app/layout.tsx`.

### 4.5 Sitemap

Add `/search` (without a query) to `app/sitemap.ts` so the entry page is discoverable. Query URLs are not enumerated.

### 4.6 robots.txt

No change needed. The existing `LLM_USER_AGENTS` allow-list already grants the LLM crawlers access to `/search` and `/api/search`. Do not add a Disallow.

## 5. Design system

- Pill input: `h-9 rounded-full bg-cream/70 border border-ink/15 px-4 text-[13px] text-ink placeholder:text-ink-soft/70 focus:border-ocean-mid focus:ring-2 focus:ring-ocean-mid/30 focus:outline-none transition`.
- ⌘K chip: `ml-2 rounded border border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-ink-soft`.
- Dropdown panel: `bg-cream border border-ink/10 rounded-lg shadow-[0_24px_64px_-24px_rgba(11,42,53,0.35)]`.
- Group headers: `eyebrow text-ink-soft` (existing utility class).
- Type badges: small rounded pills using brand palette per type — `post: ocean-light`, `story: gold`, `business: palm-light`, `event: coral`, `faq: sand-deep`, `page: ink/10`, others fallback to `ink/10`. Colors tuned for legibility on cream.
- Match highlight: `<mark class="bg-gold/30 text-ink rounded-sm px-0.5">`.
- No motion beyond a 100 ms opacity fade on the dropdown.

## 6. Component / file inventory

**New files:**

| File | Purpose |
|---|---|
| `app/lib/search/corpus.ts` | Build the typed `SearchableDoc[]` from `data/`. |
| `app/lib/search/engine.ts` | MiniSearch wrapper, exports `search(query, opts)`. |
| `app/api/search/route.ts` | GET endpoint for live dropdown. |
| `app/search/page.tsx` | SSR results page. |
| `app/search/loading.tsx` | Skeleton state. |
| `components/search/SearchBar.tsx` | Header pill input + dropdown. |
| `components/search/MobileSearchTrigger.tsx` | Mobile icon → overlay. |
| `components/search/ResultCard.tsx` | Shared card component for dropdown + results page. |
| `components/search/TypeBadge.tsx` | Small color-coded badge per doc type. |
| `public/opensearch.xml` | OpenSearch descriptor. |
| `tests/search.spec.ts` | Playwright smoke test for happy path + keyboard nav. |

**Modified files:**

| File | Change |
|---|---|
| `components/sections/Header.tsx` | Insert `<SearchBar />` between nav and CTA; on mobile, add `<MobileSearchTrigger />` near `<MobileMenu />`. |
| `app/lib/metadata.ts` | Re-enable SearchAction in `getWebSiteSchema()`; add `getSearchResultsPageSchema()`. |
| `app/layout.tsx` | Add `<link rel="search">`. |
| `app/sitemap.ts` | Add `/search` entry. |
| `public/llms.txt` | Add "Site Search" section. |
| `public/llms-full.txt` | Add "Site Search" section with examples. |
| `package.json` | Add `minisearch` dependency. |

## 7. Data flow

```
User types in SearchBar
  → debounce 150 ms
  → fetch GET /api/search?q=…&limit=8
    → app/api/search/route.ts
      → search(q) from app/lib/search/engine.ts
        → getIndex() (lazy, cached) loads corpus from app/lib/search/corpus.ts
      → returns SearchHit[]
    → JSON response, s-maxage=60
  → dropdown renders grouped by type
  → user presses Enter / clicks "See all"
    → navigate to /search?q=…
      → app/search/page.tsx runs search(q) server-side
      → renders SearchResultsPage + ItemList JSON-LD
```

## 8. Error handling

- **Empty query in API:** return 400 with `{ error: 'q required' }`.
- **Query > 200 chars:** truncate to 200 server-side, no error.
- **Index build failure:** server logs the error and returns an empty hit list with 200 (so the UI still functions); falls back to a "Try browsing the [sitemap](/sitemap)" message on the `/search` page.
- **Client fetch failure:** dropdown shows "Couldn't reach search. Press Enter to view full results." and Enter still navigates to `/search?q=` which works server-side.
- **No results:** UI shows curated suggestions — link to `/blog`, `/local/restaurants`, `/services`, `/itinerary`, plus 3 most-viewed posts (hard-coded for now).

## 9. Testing

- **Unit (none configured)** — no unit-test runner exists in this repo. Skip.
- **Playwright (`tests/search.spec.ts`):**
  - `/search?q=heritage` returns at least one result and renders schema.
  - Typing in the header bar shows the dropdown.
  - `↓` `↓` `Enter` navigates to the second result.
  - `Esc` closes the dropdown.
  - Mobile: tapping the magnifying glass opens the overlay.
- **Manual smoke:**
  - Lighthouse SEO score on `/search?q=golf` ≥ 95.
  - `curl -A "ClaudeBot" https://hiltonahead.com/search?q=heritage` returns full HTML.
  - Validate JSON-LD via Schema.org validator.

## 10. Open questions

None. All design decisions resolved during the brainstorm.

## 11. Acceptance criteria

- [ ] Header bar visible on `md:+`, mobile icon visible on `< md`.
- [ ] Typing 2+ characters opens a dropdown with grouped results within 200 ms (after debounce).
- [ ] `⌘K` / `Ctrl+K` focuses the bar from anywhere on the page.
- [ ] Keyboard navigation (`↑ ↓ Enter Esc`) works in dropdown and on results page.
- [ ] `/search?q=heritage` renders SSR with grouped results and valid `SearchResultsPage` + `ItemList` JSON-LD.
- [ ] `getWebSiteSchema()` includes `potentialAction.SearchAction`.
- [ ] `public/llms.txt` and `public/llms-full.txt` mention the search endpoint.
- [ ] `public/opensearch.xml` validates against the OpenSearch 1.1 spec.
- [ ] Lighthouse SEO ≥ 95 on `/search?q=…`.
- [ ] `npm run lint && npm run typecheck && npx playwright test tests/search.spec.ts` all pass.
