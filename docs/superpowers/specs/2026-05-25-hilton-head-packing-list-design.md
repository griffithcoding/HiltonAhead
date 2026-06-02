# Hilton Head Packing List — Design Spec

**Date:** 2026-05-25
**Status:** Approved (sections 1–6), pending user review of written spec
**Author:** Claude (brainstorming session with William Griffith)
**Strategic context:** First Amazon Associates landing page following recent program approval. Goal is to hit Amazon's 3-qualifying-sales-in-180-days floor before the account auto-closes.

## 1. Overview

A single-page editorial guide at `/hilton-head-packing-list` framed as **"the 10 things first-time Hilton Head visitors get wrong"**, each paired with the Amazon product that fixes the mistake. The page pairs a skim-friendly above-fold conversion table with editorial deep-dive sections that earn search-engine trust through 30-year-local context (Atlantic gust speeds, Coligny sand profile, SC reef-safe ordinance, no-see-um seasonality). Built on the existing `<AffiliateLink>` + `data/amazonProducts.ts` infrastructure already shipped to seven beach-intent pages.

## 2. Goal & success metrics

**Primary goal:** convert pre-trip Hilton Head visitors into Amazon purchases attributed to this site, fast enough to satisfy the Amazon Associates 3-sale floor (180 days from approval) and start commission flow.

**Success metrics (90-day):**
- Cumulative Amazon qualifying sales attributed to the page ≥ 3 (account-survival floor)
- Monthly page views by month 3 ≥ 400
- Page click-through to Amazon ≥ 5%
- Top-3 SERP position for "Hilton Head packing list" by month 3
- ≥ 1 LLM citation appearance (ChatGPT/Claude/Perplexity) on "what to pack for Hilton Head" prompts

**Anti-goal:** do NOT damage editorial brand voice in pursuit of clicks. The page must read like a 30-year local giving pre-trip advice, not like an affiliate listicle.

## 3. Scope

### In scope (v1)
- Standalone page at `/hilton-head-packing-list`
- 10-row skim table at top (the conversion engine)
- SC reef-safe ordinance callout block (backlink bait, LLM citation candidate)
- 10 deep-dive sections (~150 words each), each pairing one local mistake with one Amazon product
- New `data/packingMistakes.ts` content source of truth
- New `<MistakeSkimTable>` component (server-rendered)
- Internal linking from homepage + 6 trip-intent pages + nav + footer
- `data/affiliateLinks.ts` extension: `trip` placement-tag prefix
- Schema: `Breadcrumb` + `ItemList` + `Speakable` (for the TL;DR block)
- Manual update of `public/llms.txt` and `public/llms-full.txt`
- Playwright E2E coverage (9 tests) + axe-core a11y scan

### Out of scope (v1, deferred to v1.1)
- Custom OG image ("Wrong wheels" Polaroid)
- Specific ASINs for mistake #2 (wide-tire beach cart) and #8 (cooler) — v1 uses Amazon search URLs
- Automated link-checker cron
- Print stylesheet
- A/B test of skim-table vs. category-grid layouts
- Catalog expansion (golf, evening, hurricane-season categories)

### Explicit non-goals
- No Amazon-hosted product images (PA-API image rights gated by 3-sale floor)
- No verbatim Amazon product titles (TOS — use paraphrased names)
- No price quotes in body copy (TOS — use `priceBand` ranges only)
- No email distribution of raw Amazon URLs (TOS — site → Amazon only)
- No programmatic per-audience or per-month variants

## 4. The 10 mistakes (content backbone)

Each entry maps to one Amazon product. 8 of 10 already have ASINs in `data/amazonProducts.ts`; #2 and #8 ship with Amazon search URLs in v1 and get specific ASINs in v1.1.

| # | Mistake (first-timer angle) | Local fix | Product coverage |
|---|---|---|---|
| 1 | Cheap pop-up umbrella — Atlantic gusts shred the ribs | Sand-anchor umbrella (BeachBub / Sport-Brella) | ✅ `premium-beach` |
| 2 | Narrow-wheel beach wagon — stuck 50 ft from the car at Coligny | Wide-tire (9"+) cart (Mac Sports / WonderWheeler) | ⚠️ search URL in v1 |
| 3 | Regular sunscreen — breaks SC reef-safe ordinance | Sun Bum SPF 50 or Blue Lizard | ✅ `beach-essentials` |
| 4 | DEET bug spray (or none) — no-see-ums laugh at it May–Oct | Picaridin 20% (Sawyer / Natrapel) | ✅ `bug-protection` |
| 5 | Bare feet in the sound or lagoon — oyster shells, marsh mud | Slip-on water shoes | ✅ `water-sports` |
| 6 | Phone in the kayak with no bag — marsh water bricks it | 10L roll-top dry bag | ✅ `water-sports` |
| 7 | Folding camp chair — sinks in sand, no recline | Tommy Bahama 5-position backpack chair | ✅ `beach-essentials` |
| 8 | $30 cooler for a week-long villa — ice gone in 4 hrs at 90°F | Yeti Roadie 24 or Coleman Xtreme | ⚠️ search URL in v1 |
| 9 | Non-polarized sunglasses — can't see fish, dolphins, the break | Goodr polarized | ✅ `beach-essentials` |
| 10 | Baseball cap instead of wide brim — burned ears + neck by day 2 | Wallaroo or Coolibar UPF 50 | ✅ `beach-essentials` |

### Why these 10 (selection rationale)
- All 10 fixes are single-item purchases under $80 — Amazon's commission sweet spot
- 8/10 already have ASINs → near-zero data work to launch
- Spans the full gear stack (head, face, feet, sand, sun, water, bug) so the page reads comprehensive, not cherry-picked
- All 10 have a specific Hilton Head-local angle (named beach, named ordinance, named bug season) — defensible against generic packing-list competitors

## 5. Page architecture & layout

### Route
`/hilton-head-packing-list` (matches dominant search query, follows existing site pattern: `hilton-head-oceanfront-villas`, `hilton-head-weather`).

### Layout flow (top → bottom)

```
┌────────────────────────────────────────────────┐
│ <Header />                                     │
├────────────────────────────────────────────────┤
│ HERO (~120 words)                              │
│   .tldr-block (2 sentences, Speakable)         │
│   eyebrow: "Local Field Guide"                 │
│   H1: "Hilton Head Packing List"               │
│   sub: 1-paragraph editorial intro             │
│   <AffiliateDisclosure variant="banner" />     │
├────────────────────────────────────────────────┤
│ ⚡ SKIM TABLE (the conversion engine)          │
│   10 rows × 3 cols                             │
│   ❌ The mistake | 🟢 The fix | 🛒 Shop link    │
│   Desktop = <table>, Mobile <sm = stacked      │
│   cards with role="list"                       │
├────────────────────────────────────────────────┤
│ 🛡️ REEF-SAFE ORDINANCE CALLOUT                  │
│   ~100 words, pull-quote treatment             │
│   External link to SC DHEC for credibility     │
├────────────────────────────────────────────────┤
│ DEEP-DIVE SECTIONS (10 × ~150w = 1500w)        │
│   Each: H2 (mistake statement, id=slug)        │
│         + local "why" paragraph                │
│         + inline <AffiliateLink>               │
├────────────────────────────────────────────────┤
│ FINAL CTA (~50w)                               │
│   "Shopping for a trip? Let us plan it" →      │
│   /itinerary                                   │
├────────────────────────────────────────────────┤
│ <Footer />                                     │
└────────────────────────────────────────────────┘
```

### Word budget
| Section | Words |
|---|---|
| Hero (TL;DR + intro) | 120 |
| Skim-table microcopy | 100 |
| Reef-safe callout | 100 |
| 10 deep-dive sections | 1500 |
| Final CTA | 50 |
| **Body total** | **~1,870** |

With headings and captions: **~2,400 total page words**. Sweet spot for ranking on this query type without padding.

### Mobile behavior (< 640px)
The skim `<table>` collapses to stacked full-width cards via Tailwind responsive utilities (no JS, no media-query hooks). Each card shows `❌ mistake → 🟢 fix → 🛒 button` stacked vertically. Underlying semantics switch to `role="list"` + `<li>` so screen readers get a coherent structure on both viewports.

## 6. Components & data

### New: `data/packingMistakes.ts`

Content source of truth, modeled on existing `data/posts.ts` and `data/tripTypes.ts` patterns.

```ts
export type PackingMistake = {
  /** Display number "01" through "10". */
  number: string;
  /** Anchor slug used for the H2 id and analytics placement. */
  slug: string;
  /** Skim-table ❌ column text. */
  mistakeShort: string;
  /** Skim-table 🟢 column text. */
  fixShort: string;
  /** H2 used by the deep-dive section. */
  deepDiveHeading: string;
  /** 100–150 word local-context paragraph. */
  body: string;
  /** Primary Amazon link — prefer ASIN, fall back to search URL. */
  amazonUrl: string;
  /** Optional Amazon search URL fallback if ASIN 404s mid-quarter. */
  searchUrl?: string;
  /** Display name shown in inline link + skim-table 🛒 column. */
  productName: string;
  /** Optional cross-reference into `data/amazonProducts.ts` slug for de-dup. */
  productSlug?: string;
  /** Quarterly audit date — surfaces in admin dashboard. */
  dateAuditedAt: string;
};

export const PACKING_MISTAKES: ReadonlyArray<PackingMistake>;
```

### New: `components/affiliate/MistakeSkimTable.tsx`

Server component. Reads `PACKING_MISTAKES`, renders a real `<table>` with proper `<thead>` / `<tbody>` / `<th scope>` semantics on desktop, collapses to mobile cards via Tailwind responsive classes. Each 🛒 cell wraps an `<AffiliateLink>` with `placement={'trip/packing-list/' + mistake.slug}`.

### New: `app/hilton-head-packing-list/page.tsx`

Server component, ~150 lines of JSX. Composes the layout blocks above. Inlines the hero, reef-safe callout, deep-dive sections, and final CTA — none are extracted into components (single-use, no reuse value).

### Reused (no changes needed)
| Existing | Used for |
|---|---|
| `<AffiliateLink>` | Every outbound Amazon link |
| `<AffiliateDisclosure>` | FTC banner at hero |
| `generatePageMetadata()` | `<title>` + meta description + OG defaults |
| `getBreadcrumbSchema()` | Breadcrumb JSON-LD |
| `getItemListSchema()` | 10-item ItemList JSON-LD |
| `getSpeakableSchema()` | Speakable selectors for `.tldr-block` |
| `app/lib/affiliates.ts` `withAffiliateParams()` | Tag stamping |
| Tailwind tokens (sand, ocean, coral, ink) | Styling |

### Modified: `data/affiliateLinks.ts`

Add a `trip` prefix to the Amazon `placementTagEnv` map:

```ts
amazon: {
  // …existing config
  placementTagEnv: {
    blog: 'AFFILIATE_AMAZON_TAG_BLOG',
    faq: 'AFFILIATE_AMAZON_TAG_FAQ',
    local: 'AFFILIATE_AMAZON_TAG_LOCAL',
    newsletter: 'AFFILIATE_AMAZON_TAG_NEWSLETTER',
    trip: 'AFFILIATE_AMAZON_TAG_TRIP',  // NEW
  },
}
```

If `AFFILIATE_AMAZON_TAG_TRIP` is unset in production, `withAffiliateParams()` falls back to the primary `AFFILIATE_AMAZON_TAG` — no breakage, only reduced attribution granularity.

### Modified: `.env.example`
Document the new env var:
```
AFFILIATE_AMAZON_TAG_TRIP=
```

## 7. SEO, schema, and internal linking

### Target queries (priority order)

| Query | Est. monthly volume | SERP gap |
|---|---|---|
| "Hilton Head packing list" | 1,000–1,500 | No Hilton Head-specific authority site owns this |
| "what to pack for Hilton Head" | 600–900 | Same page ranks |
| "Hilton Head beach essentials" | 200–400 | Generic affiliate listicles only |
| "Hilton Head with kids what to bring" | 100–200 | Generic family blogs |
| "no see ums Hilton Head" | 300–500 | Reddit + Facebook groups (no authority page) |

### Page metadata

```ts
generatePageMetadata({
  title: 'Hilton Head Packing List: 10 Mistakes First-Timers Make',
  description:
    "The 10 things first-time Hilton Head visitors get wrong — and what to bring instead. Written by a 30-year island local. Wind-rated umbrella, wide-tire beach cart, reef-safe sunscreen, and seven more.",
  path: '/hilton-head-packing-list',
  keywords: [
    'Hilton Head packing list',
    'what to pack for Hilton Head',
    'Hilton Head beach essentials',
    'Hilton Head with kids',
    'Hilton Head Island packing',
  ],
});
```

### JSON-LD schema (3 blobs)

1. **`getBreadcrumbSchema([Home, Hilton Head Packing List])`**
2. **`getItemListSchema(...)`** — 10 items, each `{ position, name, url }` where `url` is the Amazon deeplink with tag pre-stamped by `withAffiliateParams()` at schema-generation time. Schema URLs must be stable (no runtime tag substitution).
3. **`getSpeakableSchema({ cssSelectors: ['.tldr-block'] })`** — makes the TL;DR a candidate for LLM citation.

If `getArticleSchema()` exists in `app/lib/metadata.ts` at implementation time, add an Article blob with author=William Griffith (via `data/founder.ts` `getPersonSchema('/founder#person')`). If not present, skip — don't build a new helper for v1.

### TL;DR block (Speakable contract)

Above the H1 in the hero:

> *Hilton Head's Atlantic wind, soft Coligny sand, and seasonal no-see-ums break gear that works on other beaches. Locals carry a sand-anchor umbrella, a wide-tire cart, picaridin bug spray, and reef-safe sunscreen — required by South Carolina ordinance.*

Class: `.tldr-block`. Referenced by `getSpeakableSchema()`. Per CLAUDE.md, removing or renaming this class without updating the schema helper callers is a contract break.

### Inbound internal linking

10 link surfaces drive traffic to the new page from day one:

| From | Link treatment | Anchor text |
|---|---|---|
| `app/page.tsx` (homepage) | New small entry card between `<Services>` and `<IslandFlyover>` | "Pack the right gear" |
| `app/hilton-head-beaches/page.tsx` | Inline link in opening copy | "the full packing list" |
| `app/hilton-head-family-trip-planner/page.tsx` | Inline link + "see also" block at bottom | "family Hilton Head packing list" |
| `app/hilton-head-oceanfront-villas/page.tsx` | Footer aside (matches existing Bonvoy cross-link pattern) | "what to bring to an oceanfront stay" |
| `app/hilton-head-weather/[month]/page.tsx` | Inline link before the existing AmazonProductGrid | "complete Hilton Head packing list" |
| `app/hilton-head-spring-break/page.tsx` | Inline link in body | "spring break packing list" |
| `app/hilton-head-honeymoon/page.tsx` | Inline link in body | "couples packing list" |
| `data/nav.ts` | New child under Services dropdown | "Hilton Head Packing List" |
| `data/footerLinks.ts` | New entry under "Plan Your Trip" column | "Packing List" |
| `public/llms.txt` + `llms-full.txt` | New Resources line | manual update per CLAUDE.md |

### Outbound links FROM the page

- Hero subhead → `/founder` ("written by a 30-year local")
- Reef-safe callout → SC DHEC reef-safe ordinance source (external, dofollow — earns credibility)
- Final CTA → `/itinerary`
- Optional "see more gear by category" footer link → `/hilton-head-beaches`

### Robots / LLM crawler policy
No changes. The existing `app/robots.ts` `LLM_USER_AGENTS` allow-list already permits GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. The new page is crawlable for LLM citation by default.

## 8. Edge cases, compliance, voice

### Edge cases

**ASIN goes 404 or "Currently unavailable"** — each `PackingMistake` carries both `amazonUrl` (primary, ASIN-preferred) and optional `searchUrl` (fallback). Quarterly audit (matches existing `amazonProducts.ts` cadence per its file-level comment) spot-checks 3 random ASINs; broken ones get `amazonUrl` swapped to `searchUrl` until a new ASIN lands.

**`AFFILIATE_AMAZON_TAG_TRIP` env var not set** — `withAffiliateParams()` falls back to primary `AFFILIATE_AMAZON_TAG`. Acceptance gate is SOFT: launch allowed with fallback active; placement-specific tag can lag.

**Reef-safe ordinance fact accuracy** — callout copy MUST be verified against the SC DHEC source URL during implementation, not extrapolated. If the exact regulatory text cannot be confirmed, the callout reverts to softer phrasing ("many South Carolina coastal beaches strongly encourage reef-safe sunscreen") rather than fabricating specifics. Do not fake regulatory citations.

**Print / no-tag URLs** — accept the leakage. Print-then-type behavior loses commission. Not worth a print stylesheet for v1.

**Page-load performance** — keep `<AffiliateLink>` as the only client component on the page. Skim table, deep-dive sections, hero, and CTAs are all server-rendered. LCP target: < 2.5s on mobile (Lighthouse).

### Amazon TOS hard rules

These are non-negotiable design constraints reproduced from Amazon Associates Operating Agreement:

| Forbidden | Spec enforcement |
|---|---|
| Citing exact prices in body copy | Use `priceBand` ranges only ("$15–25") |
| Verbatim Amazon product titles | Paraphrased `productName` field |
| Hosting Amazon product images | Text-only rendering; no `<img>` of Amazon assets |
| Inducements ("click and we'll send you X") | Never offer anything in exchange for clicks |
| Distributing affiliate links via email | Newsletter MUST link to the site page, not directly to Amazon |

FTC compliance: `<AffiliateDisclosure variant="banner">` above the fold; every Amazon link via `<AffiliateLink>` which sets `rel="sponsored nofollow noopener noreferrer"`.

### Voice constraints (non-negotiable)

| ❌ Don't write | ✅ Do write |
|---|---|
| "The BEST beach umbrella!" | "The umbrella you bring will get destroyed by Atlantic wind." |
| "Click here to grab it" | "BeachBub's anchor system." (link wraps brand name) |
| "Don't forget your sunscreen!" | "South Carolina banned non-reef-safe sunscreen at most coastal beaches in 2023. Reef-safe brands are now what locals carry." |
| Exclamation marks | Periods. Always periods. |
| Generic "great for families" | "We see this exact chair on every Coligny Beach setup most weekends." |

**Anchor text rule:** inline `<AffiliateLink>` text is ALWAYS the brand or product name (e.g., "Sun Bum SPF 50"), NEVER "click here", "Amazon link", or the bare URL. Better for SEO, a11y, and brand voice.

**Tone test:** read each section aloud. If it sounds like a 30-year HHI resident giving a friend pre-trip advice, ship. If it sounds like Wirecutter, rewrite.

### A11y constraints

- Skim table is a real `<table>` with `<thead>` / `<tbody>` / `<th scope="col">` (NOT a CSS grid faking it)
- Each deep-dive H2 has `id` matching `mistake.slug` for anchor-link support
- Mobile-card variant uses `role="list"` + `<li>` so the structure remains navigable when the `<table>` collapses
- Inline Amazon links get a visited-state style so users can tell which they've already opened
- All interactive elements meet WCAG 2.1 AA color-contrast minimums (covered by existing Tailwind palette — verify with axe scan)

## 9. Testing & acceptance criteria

### Playwright E2E — new spec file `tests/packing-list.spec.ts`

```ts
test('packing-list page loads with all sections');
test('skim table renders 10 rows with Amazon links');
test('all Amazon links have FTC-compliant rel attribute');
test('Amazon link includes tracking tag on click');
test('reef-safe callout renders with verified copy and SC DHEC link');
test('10 deep-dive sections each have an h2 with anchor id');
test('mobile viewport (375px) shows stacked cards, not table');
test('a11y scan passes (axe-core, WCAG AA, 0 critical/serious)');
test('schema JSON-LD includes Breadcrumb + ItemList + Speakable');
```

### Manual QA checklist (pre-merge)

- [ ] Click each of 10 Amazon links → verify `?tag=hiltonahead-…` lands in URL
- [ ] View page source → confirm tracking tag (placement-specific or primary fallback)
- [ ] FTC banner visible above fold on ≤ 375px mobile viewport
- [ ] Reef-safe callout copy matches verified SC DHEC source
- [ ] Google Rich Results Test → Breadcrumb + ItemList both valid
- [ ] Lighthouse mobile: LCP < 2.5s, CLS < 0.1
- [ ] Spot-check 3 random ASINs → not 404, not "Currently unavailable"
- [ ] `llms.txt` + `llms-full.txt` updated with new page entry
- [ ] All 10 inbound internal links present in their respective pages

### Acceptance criteria (ship gate)

The PR merges only when ALL of these are true:

| Check | How verified |
|---|---|
| `npm run typecheck` clean | CI |
| `npm run lint` clean | CI |
| `npm run build` succeeds | CI |
| `npx playwright test tests/packing-list.spec.ts` — 9/9 pass | CI |
| 10 inbound internal links wired | Manual grep |
| Primary `AFFILIATE_AMAZON_TAG` set in Vercel (placement-specific is soft) | Vercel UI |

### Time budget

~12 working hours across 2–3 days for the implementer. Anything over 16 hours, stop and re-scope.

## 10. v1 cut lines

Explicitly deferred from initial ship; revisit per the trigger column:

| Feature | Deferred because | Trigger to revisit |
|---|---|---|
| Custom OG image ("Wrong wheels" Polaroid) | Photography time | After 500 monthly views |
| Specific ASINs for mistake #2 (cart) and #8 (cooler) | Research time | Within 2 weeks post-launch |
| Automated link-checker cron | Engineering cost > value at current catalog size | When `amazonProducts.ts` exceeds 75 products |
| Print stylesheet | Fringe behavior | Never, probably |
| A/B skim-table layout test | No traffic baseline yet | Month 3 with analytics in hand |
| "Already on the island" local-stores block (Piggly Wiggly, Coligny shops, Amazon Prime same-day) | Dropped during brainstorm — pure-conversion focus | If brand-voice complaints surface |
| Catalog expansion (golf gear, evening attire, hurricane-season, rainy-day kids) | Speed-to-launch trade | Month 2 |

## 11. Permanently out of scope

- Amazon PA-API image rendering (gated by 3-sale floor — chicken/egg)
- Email distribution of raw Amazon links (TOS violation, no workaround)
- Programmatic per-month or per-audience packing-list variants (would dilute canonical authority)
- Pricing claims of any kind in body copy (TOS)
- International audiences / hreflang (US-only audience profile)
- AMP pages (deprecated by Google)

## 12. Implementation order (suggested for writing-plans)

1. **Data layer** — create `data/packingMistakes.ts` with 10 entries (copy will need 1500w of editorial writing; this is the longest single task)
2. **Affiliate config** — add `trip` prefix to `data/affiliateLinks.ts`, document env var in `.env.example`
3. **Skim-table component** — `components/affiliate/MistakeSkimTable.tsx`, including responsive collapse
4. **Page shell + hero** — `app/hilton-head-packing-list/page.tsx` with metadata, schemas, FTC banner
5. **Reef-safe callout** — verify SC DHEC source, write copy, add as inline JSX block
6. **Deep-dive sections** — 10 sequential JSX blocks reading from `PACKING_MISTAKES`
7. **Final CTA** — inline JSX
8. **Internal links** — modify 7 trip-intent pages + `nav.ts` + `footerLinks.ts`
9. **LLM index files** — manually update `public/llms.txt` + `public/llms-full.txt`
10. **Tests** — write Playwright spec, run axe-core scan
11. **Manual QA + deploy**

## 13. Key brainstorming decisions

Reproduced for future reference:

| Decision | Choice (rationale) |
|---|---|
| Primary win condition | Hit 3-sale floor in 90 days (account survival > authority > volume) |
| Page format | Single mega `/hilton-head-packing-list` page (vs hub+spokes or listicle network) |
| Frame | "What first-time visitors get wrong" mistake-prevention (vs generic checklist or trip-archetype walkthrough) |
| Catalog scope | Ship with existing 36 products; expand post-launch (vs pre-launch 60-product rebuild) |
| Layout order | Hero → Skim Table → Reef-safe → Deep-dives → Final CTA (no "Already on island" block) |
| Mobile skim table | Stacked cards via Tailwind responsive (no JS) |
| Reef-safe callout link | External to SC DHEC source (credibility > authority retention) |
| TL;DR + Speakable schema | Keep (LLM-citation play, brand-voice fit) |
| `trip` placement-tag prefix | Add (clean attribution separates trip pages from blog/faq/local/newsletter) |
| ASIN audit cadence | Quarterly manual (no automated cron in v1) |
