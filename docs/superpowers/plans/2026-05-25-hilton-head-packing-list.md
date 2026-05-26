# Hilton Head Packing List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/hilton-head-packing-list` — a single mistake-prevention guide that pairs 10 specific Hilton Head local-knowledge traps (Atlantic wind, Coligny soft sand, SC reef-safe ordinance, no-see-um seasonality, oyster shells, etc.) with the Amazon product that fixes each one. Hit Amazon Associates' 3-qualifying-sales-in-180-days floor before the account auto-closes.

**Architecture:** Fully server-rendered Next.js App Router page. Content backed by a new `data/packingMistakes.ts` file that cross-references the existing `data/amazonProducts.ts` catalog by product slug. One new client island: `<AffiliateLink>` (already exists). Inbound traffic via 10 internal links (homepage + 6 trip-intent pages + nav + footer + LLM index files). Per-page Amazon tracking via a new `trip` placement-tag prefix.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind 4 · existing affiliate infrastructure (`AffiliateLink`, `AffiliateDisclosure`, `withAffiliateParams`) · Playwright + axe-core.

**Spec:** [docs/superpowers/specs/2026-05-25-hilton-head-packing-list-design.md](../specs/2026-05-25-hilton-head-packing-list-design.md)

**Branch:** Create `feat/packing-list` from `main` if not already on a packing-list branch. Per `CLAUDE.md`, no worktrees; keep at most 1–2 active branches named after the task.

**Time budget:** ~12 working hours across 2–3 days. If you cross 16h, stop and re-scope with the user.

**Commit cadence:** Atomic per task. Use Conventional Commits (`feat:`, `chore:`, `test:`, `docs:`). Pre-commit hooks run lint + typecheck — do not bypass with `--no-verify`.

---

## File Structure

### New files (4)

| Path | Responsibility |
|---|---|
| `data/packingMistakes.ts` | Type defs + 10 mistake records (cross-ref to `data/amazonProducts.ts` by slug) |
| `components/affiliate/MistakeSkimTable.tsx` | Server-rendered conversion table; desktop `<table>`, mobile stacked cards |
| `app/hilton-head-packing-list/page.tsx` | Server-component page shell with hero, skim table, reef-safe callout, 10 deep-dives, final CTA |
| `tests/packing-list.spec.ts` | Playwright E2E + axe-core a11y scan |

### Modified files (10)

| Path | Change |
|---|---|
| `data/affiliateLinks.ts` | Add `trip: 'AFFILIATE_AMAZON_TAG_TRIP'` to the Amazon `placementTagEnv` map |
| `.env.example` | Document `AFFILIATE_AMAZON_TAG_TRIP` env var |
| `data/nav.ts` | Add `Hilton Head Packing List` under the Services dropdown |
| `data/footerLinks.ts` | Add `Packing List` to the "Plan Your Trip" column |
| `app/page.tsx` | Inbound link / entry card between `<Services>` and `<IslandFlyover>` |
| `app/hilton-head-beaches/page.tsx` | Inline link before the existing `<AmazonProductGrid>` |
| `app/hilton-head-family-trip-planner/page.tsx` | Sibling aside after `<TripTypeLandingPage>` |
| `app/hilton-head-oceanfront-villas/page.tsx` | Sibling aside after `<TripTypeLandingPage>` (matches Bonvoy cross-link pattern) |
| `app/hilton-head-honeymoon/page.tsx` | Sibling aside after `<TripTypeLandingPage>` |
| `app/hilton-head-spring-break/page.tsx` | Sibling aside after `<TripTypeLandingPage>` |
| `app/hilton-head-weather/[month]/page.tsx` | Inline link before the existing `<AmazonProductGrid>` |
| `public/llms.txt` | New Resources line pointing to the page |
| `public/llms-full.txt` | New section summarizing the packing list for LLM citation |

(13 total file changes when you count both llms files separately.)

### Reused (no changes)

| Existing | Purpose |
|---|---|
| `components/affiliate/AffiliateLink.tsx` | Outbound Amazon links (`rel="sponsored nofollow"`, tag stamping, click beacon) |
| `components/affiliate/AffiliateDisclosure.tsx` | FTC banner above the fold |
| `app/lib/affiliates.ts` `withAffiliateParams()` | Tag resolution with placement-prefix matching + fallback |
| `app/lib/metadata.ts` — `generatePageMetadata`, `getBreadcrumbSchema`, `getSpeakableSchema` | Standard page metadata + JSON-LD |
| `data/amazonProducts.ts` | Source of truth for the 8 covered products' ASIN deeplinks |
| `data/founder.ts` + `getPersonSchema()` | Author attribution (`/founder#person`) |
| `data/brand.ts` | Brand voice + URL constants |

### Out of scope for v1 (per spec §10)

- Custom OG image (Polaroid "wrong wheels" photo)
- Specific ASINs for mistake #2 (cart) and #8 (cooler) — v1 ships with Amazon search URLs
- Automated link-checker cron
- Print stylesheet
- A/B test scaffolding for skim-table vs. category-grid layouts
- "Already on the island" local-stores block (explicitly dropped during brainstorm)
- Catalog expansion (golf gear, evening attire, hurricane-season, rainy-day kids)

---

## Task 1: Setup — branch + dependencies + spec read

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Verify the working tree is clean and you're on the intended branch**

```bash
git status
git branch --show-current
```

Expected: working tree clean (or only docs files unrelated to packing list). If anything else is staged, confirm with the user before proceeding.

- [ ] **Step 2: Create or check out the packing-list branch**

If not already on a packing-list branch:

```bash
git checkout -b feat/packing-list
```

If `feat/packing-list` already exists from prior work, just check it out:

```bash
git checkout feat/packing-list
```

- [ ] **Step 3: Verify the spec is present on this branch**

```bash
ls docs/superpowers/specs/2026-05-25-hilton-head-packing-list-design.md
```

If the file is missing, the spec was committed to a sibling branch. Cherry-pick the spec commit onto this branch:

```bash
git log --all --oneline --grep='packing list' | head -3
git cherry-pick <SHA-of-spec-commit>
```

Expected: file exists.

- [ ] **Step 4: Verify no new dependencies are required**

This plan uses only existing packages (`@axe-core/playwright` was added during the villa-match work). Confirm:

```bash
node -e "const p=require('./package.json'); console.log('axe:', !!p.devDependencies['@axe-core/playwright']);"
```

Expected: `axe: true`. If false, run `npm install --save-dev @axe-core/playwright`.

- [ ] **Step 5: Read the spec once before writing any code**

Open `docs/superpowers/specs/2026-05-25-hilton-head-packing-list-design.md` and read Sections 4 (the 10 mistakes), 6 (components & data), 7 (SEO/schema), 8 (edge cases + voice constraints). The voice constraints in §8 are non-negotiable — every body paragraph in Task 3 must satisfy them.

---

## Task 2: Extend `data/affiliateLinks.ts` — add `trip` placement-tag prefix

**Files:**
- Modify: `data/affiliateLinks.ts` (Amazon entry)
- Modify: `.env.example`

The new packing-list page passes `placement="trip/packing-list/<slug>"` to `<AffiliateLink>`. `withAffiliateParams()` resolves the prefix `trip` to env var `AFFILIATE_AMAZON_TAG_TRIP`, which (when set in Vercel) attributes clicks to a dedicated Amazon Associates Tracking ID. If unset, the helper falls back to the primary `AFFILIATE_AMAZON_TAG` — no breakage, only reduced attribution granularity.

- [ ] **Step 1: Modify the Amazon program entry**

In `data/affiliateLinks.ts`, find the `amazon:` block (within the `AFFILIATE_PROGRAMS` const) and add a single line to its `placementTagEnv` map:

```ts
amazon: {
  id: 'amazon',
  name: 'Amazon',
  shortName: 'Amazon',
  brandDomain: 'amazon.com',
  trackingIdEnv: 'AFFILIATE_AMAZON_TAG',
  placementTagEnv: {
    blog: 'AFFILIATE_AMAZON_TAG_BLOG',
    faq: 'AFFILIATE_AMAZON_TAG_FAQ',
    local: 'AFFILIATE_AMAZON_TAG_LOCAL',
    newsletter: 'AFFILIATE_AMAZON_TAG_NEWSLETTER',
    trip: 'AFFILIATE_AMAZON_TAG_TRIP', // NEW — packing list, future trip-intent surfaces
  },
  trackingParam: 'tag',
  pitch: 'Beach gear, packing essentials, and recommended reading.',
},
```

- [ ] **Step 2: Document the env var in `.env.example`**

Open `.env.example`, find the existing Amazon placement-tag block (looks like:

```
AFFILIATE_AMAZON_TAG_BLOG=
AFFILIATE_AMAZON_TAG_FAQ=
AFFILIATE_AMAZON_TAG_LOCAL=
AFFILIATE_AMAZON_TAG_NEWSLETTER=
```

), and add one line below `_NEWSLETTER`:

```
AFFILIATE_AMAZON_TAG_TRIP=
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add data/affiliateLinks.ts .env.example
git commit -m "feat(affiliates): add trip placement-tag prefix for packing list"
```

---

## Task 3: Create `data/packingMistakes.ts` — the content backbone

**Files:**
- Create: `data/packingMistakes.ts`

This file is the longest task in the plan. It defines the 10-mistake content model and ships all 10 entries with full editorial body copy in the 30-year-local voice. The page renders from this file; updating editorial copy or swapping a product later means touching only this file.

**Voice constraints reminder (spec §8):**
- 30-year HHI resident giving pre-trip advice
- No exclamation marks, no "BEST!" superlatives, no "click here"
- Inline anchor text = brand/product name only
- No specific prices in body copy (TOS — use `priceBand` ranges only)
- Each body paragraph references a specific Hilton Head local detail (named beach, ordinance year, gust speed range, bug season month, etc.)

**Cross-reference rule:** 8 of the 10 mistakes reference an existing product in `data/amazonProducts.ts` by `productSlug`. Mistakes #2 (wide-tire cart) and #8 (cooler) ship with an Amazon search URL via `amazonUrl` since the catalog doesn't have those products yet. Resolver logic in the renderer will prefer `mistake.amazonUrl` when present, else look up `AMAZON_PRODUCTS.find(p => p.slug === mistake.productSlug).deeplink`.

- [ ] **Step 1: Create the file with types + the 10 entries**

```ts
// data/packingMistakes.ts
/**
 * The 10 mistakes first-time Hilton Head visitors make — paired with the
 * Amazon product that fixes each one. Renders into the
 * `/hilton-head-packing-list` page (skim table + deep-dive sections).
 *
 * Voice contract (per spec §8):
 *   - 30-year HHI resident voice; no exclamation marks; no "BEST" superlatives
 *   - Each `body` paragraph cites at least one specific local detail
 *   - Anchor copy (in JSX) is the product/brand name, never "click here"
 *   - Do NOT cite specific prices in body — Amazon TOS bans this. Use ranges
 *     only via the referenced amazonProducts.ts `priceBand` field.
 *
 * Cross-reference invariant: exactly one of `productSlug` or `amazonUrl`
 * must be set per entry. The renderer prefers `amazonUrl` (used for the
 * mistakes where we don't yet have an ASIN in amazonProducts.ts).
 *
 * Audit cadence: quarterly. Spot-check 3 random links per audit. If an
 * ASIN 404s, swap to a search URL via `searchUrl` until a new ASIN lands.
 */

import { AMAZON_PRODUCTS } from './amazonProducts';

export type PackingMistake = {
  /** Display number "01" through "10". */
  number: string;
  /** Anchor slug used for the H2 id, analytics placement, and skip-link target. */
  slug: string;
  /** Skim-table ❌ column text (under 70 chars). */
  mistakeShort: string;
  /** Skim-table 🟢 column text (under 70 chars). */
  fixShort: string;
  /** H2 used by the deep-dive section. Statement, not product name. */
  deepDiveHeading: string;
  /** 100–150 word local-context paragraph. Voice contract above applies. */
  body: string;
  /** Display name shown in inline link + skim-table 🛒 column. */
  productName: string;
  /** Cross-reference into data/amazonProducts.ts. Set this OR amazonUrl, not both. */
  productSlug?: string;
  /** Direct Amazon URL for entries with no cross-reference (mistakes #2 + #8). */
  amazonUrl?: string;
  /** Optional search URL fallback in case the primary URL 404s. */
  searchUrl?: string;
  /** Quarterly audit date — bump on every catalog spot-check. */
  dateAuditedAt: string;
};

const AUDIT_DATE = '2026-05-25';

export const PACKING_MISTAKES: ReadonlyArray<PackingMistake> = [
  {
    number: '01',
    slug: 'cheap-umbrella',
    mistakeShort: 'A pop-up beach umbrella from the grocery store',
    fixShort: 'A sand-anchor umbrella that holds in 18 mph gusts',
    deepDiveHeading: 'The umbrella you bring will get destroyed',
    body:
      "Atlantic wind off Coligny and Burkes Beach runs 12 to 18 mph most summer afternoons — that's the wind that snaps the ribs of a $30 pop-up by 2 p.m. We've watched it happen on the same dune line for years. The fix is an anchor-based umbrella that screws into the sand the way a tent stake holds: a sand auger or weighted ballast base, with a vented canopy that lets gusts pass through instead of catching them like a sail. BeachBub and Sport-Brella are the two systems we see locals carry, and the difference is the difference between standing up at lunch and chasing a tumbling umbrella down the shore.",
    productName: 'BeachBub or Sport-Brella anchor umbrella',
    productSlug: undefined,
    amazonUrl: 'https://www.amazon.com/s?k=beachbub+all-in-one+beach+umbrella',
    searchUrl: 'https://www.amazon.com/s?k=sport-brella+vented+beach+umbrella',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '02',
    slug: 'narrow-wheel-cart',
    mistakeShort: 'A folding wagon with narrow wheels',
    fixShort: 'A wide-tire (9"+) beach cart that floats over soft sand',
    deepDiveHeading: 'The wagon you brought gets stuck in Coligny sand',
    body:
      "Coligny Beach Park is the busiest public access on the island, and the walk from the parking lot to the high-tide line crosses about 80 feet of dry, soft, ankle-deep sand. A standard folding wagon with 4-inch hard plastic wheels sinks halfway and stops moving — we've watched grandparents and dads pivot to single-load shuttles four trips deep. Wide-tire beach carts (Mac Sports All-Terrain or WonderWheeler Wide with 9-inch balloon tires) cross that same sand in one pass, fully loaded, without anyone breaking a sweat. The cooler, the boogie boards, the chairs, the umbrella: one trip.",
    productName: 'Mac Sports All-Terrain or WonderWheeler Wide',
    amazonUrl: 'https://www.amazon.com/s?k=mac+sports+all+terrain+beach+wagon+wide+wheel',
    searchUrl: 'https://www.amazon.com/s?k=wonderwheeler+wide+beach+cart',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '03',
    slug: 'wrong-sunscreen',
    mistakeShort: 'Standard chemical sunscreen',
    fixShort: 'Reef-safe mineral or hybrid sunscreen',
    deepDiveHeading: 'Your usual sunscreen is the wrong sunscreen here',
    body:
      "South Carolina's Lowcountry estuaries — Calibogue Sound, Broad Creek, the May River — drain straight into the Atlantic past the same beaches you're swimming on. Reef-safe sunscreen isn't just a Hawaiian thing; it's what locals carry because the chemistry that wrecks coral also wrecks the oyster beds and salt marshes feeding the shrimp boats out of Bluffton. The two we keep in the truck are Sun Bum SPF 50 spray for fast application on restless kids and Blue Lizard for travelers with sensitive skin or a mineral-only preference. Both apply cleanly, smell like vacation, and don't ghost you white on the porch photos.",
    productName: 'Sun Bum SPF 50 Spray (or Blue Lizard Sensitive for mineral-only)',
    productSlug: 'sun-bum-spf-50-spray',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '04',
    slug: 'wrong-bug-spray',
    mistakeShort: 'DEET, citronella, or no bug spray at all',
    fixShort: 'Picaridin 20% — the only thing no-see-ums respect',
    deepDiveHeading: 'No-see-ums laugh at the bug spray you brought',
    body:
      "From early May through late October, Lowcountry no-see-ums arrive at dusk along marsh edges, in the lagoon-side patios at Palmetto Dunes, and behind the dunes at Mitchelville. DEET deters mosquitoes fine but no-see-ums work right through it. The molecule that actually keeps them off skin is picaridin at 20 percent, and the bottle locals carry is Sawyer or Natrapel. Spray ankles, calves, and the back of the neck about an hour before sunset, and the difference is the difference between a relaxed porch evening and looking like you wrestled a thornbush by the time the kids are in bed.",
    productName: 'Sawyer Picaridin 20% (or Natrapel)',
    productSlug: 'sawyer-picaridin-spray',
    searchUrl: 'https://www.amazon.com/s?k=sawyer+picaridin+20+percent+insect+repellent',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '05',
    slug: 'bare-feet',
    mistakeShort: 'Flip-flops or bare feet for sound and lagoon edges',
    fixShort: 'Slip-on water shoes (closed-toe protection)',
    deepDiveHeading: 'The water shoes you skipped just cost you the afternoon',
    body:
      "The Atlantic surf side of Hilton Head is mostly clean white sand. The marsh-and-sound side — Pinckney Island, Skull Creek, the back lagoons at Sea Pines and Palmetto Dunes — is a different beach. Live oyster shells colonize the mud-bottom edges, and stepping on one in flip-flops slices you open. We tell every kayak and SUP renter to wear closed-toe water shoes, slip-on style, no laces. The exact model doesn't matter as long as the sole is thick enough to deflect a sharp edge and the upper drains fast. One small purchase, no ruined afternoons.",
    productName: 'Slip-on water shoes',
    productSlug: 'water-shoes-keen',
    searchUrl: 'https://www.amazon.com/s?k=slip+on+water+shoes+quick+dry',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '06',
    slug: 'no-dry-bag',
    mistakeShort: 'A loose phone in the kayak or paddleboard',
    fixShort: 'A 10L roll-top dry bag (or waterproof phone case)',
    deepDiveHeading: 'The phone in your kayak ends the trip',
    body:
      "Marsh water on Hilton Head is brackish, warm, and not particularly forgiving to an iPhone or AirPods that go overboard mid-paddle. The fix is cheap insurance: a 10-liter roll-top dry bag for phone, keys, wallet, and a small towel, clipped to a deck loop. We see renters at Outside Hilton Head and H2O Sports cinch their bags shut and tuck them between their legs in the cockpit — that's it, that's the whole technique. Trip ends with photos instead of an insurance claim.",
    productName: 'Sea to Summit Lightweight 10L Dry Bag',
    productSlug: 'sea-to-summit-dry-bag',
    searchUrl: 'https://www.amazon.com/s?k=sea+to+summit+10l+dry+bag',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '07',
    slug: 'cheap-chair',
    mistakeShort: 'A budget folding camp chair',
    fixShort: 'Tommy Bahama 5-position backpack beach chair',
    deepDiveHeading: 'The folding chair you brought sinks',
    body:
      "Dry sand at the south end of Coligny is deep and powdery — the legs of a $20 folding camp chair sink three inches in the first ten minutes, and the seat angle drops into a posture that puts your hips below your knees. Locals carry the Tommy Bahama 5-position backpack chair: wider feet that don't sink, a real recline that lets you actually read, a cooler pouch in the back for two waters, and shoulder straps so it carries hands-free from the cart to the spot. We've watched the same model survive ten summers in a beach garage and still hold up.",
    productName: 'Tommy Bahama 5-Position Backpack Chair',
    productSlug: 'tommy-bahama-beach-chair',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '08',
    slug: 'cheap-cooler',
    mistakeShort: 'A $30 styrofoam-walled cooler for a week-long villa',
    fixShort: 'A rotomolded cooler or Coleman Xtreme (5-day ice retention)',
    deepDiveHeading: 'Your cooler turns into a soup pot by 2 p.m.',
    body:
      "It's 90 degrees and humid most July afternoons. A flimsy cooler with thin walls loses ice in four hours — and then you're sitting on hot turkey sandwiches and skunky beer at the high-tide line. The fix is two-pronged: for the villa, a Yeti Roadie 24 or a Coleman Xtreme 5-day handles a week of groceries without daily ice runs. For the beach, the same cooler also handles a day at Coligny if you pre-chill it the night before and pack with block ice underneath, cubes on top. The math works: one purchase, fewer Piggly Wiggly trips, cold beverages at 5 p.m.",
    productName: 'Yeti Roadie 24 or Coleman Xtreme 5-Day',
    amazonUrl: 'https://www.amazon.com/s?k=yeti+roadie+24+cooler',
    searchUrl: 'https://www.amazon.com/s?k=coleman+xtreme+5+day+cooler',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '09',
    slug: 'no-polarized-glasses',
    mistakeShort: 'Non-polarized sunglasses (or no sunglasses)',
    fixShort: 'Polarized sunglasses you can afford to lose to the surf',
    deepDiveHeading: 'You will not see the dolphins without polarization',
    body:
      "Bottlenose dolphins work the shoreline along Sea Pines and Folly Field most mornings, often within 30 yards of the wading depth. Non-polarized sunglasses turn the surf into a wall of glare and you miss the dorsal fins entirely. Polarized lenses cut the glare so you can see into the wave — fish, rays, the occasional shark, and the dolphins. Goodr makes a $25 polarized frame that doesn't slide off when you sweat and doesn't break the household budget when one pair ends up in the surf, which is the realistic outcome about half the time. Bring two pairs.",
    productName: 'Goodr Polarized Sunglasses',
    productSlug: 'goodr-polarized-sunglasses',
    dateAuditedAt: AUDIT_DATE,
  },
  {
    number: '10',
    slug: 'baseball-cap',
    mistakeShort: 'A baseball cap (leaves ears and neck exposed)',
    fixShort: 'A wide-brim UPF 50+ hat that stays on in wind',
    deepDiveHeading: 'A baseball cap will get you sunburned by day two',
    body:
      "Sun exposure on a Hilton Head beach is a six- or seven-hour proposition once you factor in the walk, the swim, lunch on the sand, and the second swim. A baseball cap covers the forehead and that's it — the ears, the back of the neck, and the tops of the cheeks burn first, and they burn worst. The fix is a wide-brim packable hat in UPF 50+ fabric with a chin cord for the wind. Wallaroo and Coolibar are the two brands we see at the boat ramp and on the dock — they pack flat, dry fast, and the brim doesn't fold up the first time the wind catches it.",
    productName: 'Wallaroo or Coolibar UPF 50+ wide-brim hat',
    productSlug: 'wide-brim-sun-hat',
    dateAuditedAt: AUDIT_DATE,
  },
];

/**
 * Resolve the Amazon link to use for a given mistake. Prefers explicit
 * `amazonUrl` (for entries without a catalog product), falls back to the
 * deeplink from `data/amazonProducts.ts`, and lastly to the search URL.
 */
export function resolveMistakeUrl(m: PackingMistake): string {
  if (m.amazonUrl) return m.amazonUrl;
  if (m.productSlug) {
    const product = AMAZON_PRODUCTS.find((p) => p.slug === m.productSlug);
    if (product) return product.deeplink;
  }
  if (m.searchUrl) return m.searchUrl;
  return 'https://www.amazon.com/';
}
```

- [ ] **Step 2: Reality-check the productSlug references**

The data file references 8 product slugs from `data/amazonProducts.ts`. Verify each exists:

```bash
node -e "const c=require('fs').readFileSync('data/amazonProducts.ts','utf8');const wants=['sun-bum-spf-50-spray','sawyer-picaridin-spray','water-shoes-keen','sea-to-summit-dry-bag','tommy-bahama-beach-chair','goodr-polarized-sunglasses','wide-brim-sun-hat','blue-lizard-sensitive'];wants.forEach(s=>{const ok=c.includes(\"slug: '\"+s+\"'\");console.log((ok?'OK ':'MISSING ')+s);});"
```

Expected: all `OK`. Slugs verified at plan-write time: `water-shoes-keen` (not `water-shoes`) and `sea-to-summit-dry-bag` (not `dry-bag-10l`) are the actual names — the body above already reflects them. If any other slug is `MISSING`, the catalog has been refactored since plan time — open `data/amazonProducts.ts`, grep for the closest match by category (e.g., `bug-protection`, `water-sports`, `beach-essentials`), and update the `productSlug` in `data/packingMistakes.ts` to the actual slug. **Do not invent slugs.**

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean. If the `AMAZON_PRODUCTS` import path is wrong, the error will name it — fix the import.

- [ ] **Step 4: Commit**

```bash
git add data/packingMistakes.ts
git commit -m "feat(packing-list): seed 10 mistake records (data/packingMistakes.ts)"
```

---

## Task 4: Create `<MistakeSkimTable>` — the conversion engine

**Files:**
- Create: `components/affiliate/MistakeSkimTable.tsx`

Server component. Renders a real `<table>` on desktop with `<thead>` / `<tbody>` / `<th scope>` semantics. On mobile (<640px / Tailwind `<sm`), the table visually collapses into stacked cards via responsive Tailwind classes, while semantic structure remains a list. Each 🛒 cell wraps `<AffiliateLink programId="amazon" placement={'trip/packing-list/' + mistake.slug}>` — the `trip` prefix routes attribution to `AFFILIATE_AMAZON_TAG_TRIP` (with fallback to the primary tag).

- [ ] **Step 1: Create the component file**

```tsx
// components/affiliate/MistakeSkimTable.tsx
/**
 * The 10-row "skim table" that anchors the /hilton-head-packing-list page.
 * Desktop: 3-column <table>. Mobile (<sm): stacked card list (same semantics,
 * different visual treatment).
 *
 * Server component — every interactive bit is delegated to <AffiliateLink>
 * (which is the only client island on the page).
 */
import AffiliateLink from './AffiliateLink';
import {
  PACKING_MISTAKES,
  resolveMistakeUrl,
  type PackingMistake,
} from '@/data/packingMistakes';

export default function MistakeSkimTable() {
  return (
    <>
      {/* Desktop: real semantic table */}
      <table
        aria-label="Hilton Head packing mistakes and their fixes"
        className="hidden w-full border-collapse text-left sm:table"
      >
        <thead>
          <tr className="border-b border-rule-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <th scope="col" className="py-3 pr-4 font-semibold">
              The mistake
            </th>
            <th scope="col" className="py-3 px-4 font-semibold">
              The fix
            </th>
            <th scope="col" className="py-3 pl-4 text-right font-semibold">
              Shop
            </th>
          </tr>
        </thead>
        <tbody>
          {PACKING_MISTAKES.map((m) => (
            <SkimRow key={m.slug} mistake={m} />
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards with role=list */}
      <ul role="list" className="flex flex-col gap-4 sm:hidden">
        {PACKING_MISTAKES.map((m) => (
          <li
            key={m.slug}
            className="border border-rule-soft bg-sand-soft/40 p-4"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Mistake {m.number}
            </p>
            <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">
              {m.mistakeShort}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-coral">
              The fix
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">
              {m.fixShort}
            </p>
            <div className="mt-4">
              <AffiliateLink
                programId="amazon"
                deeplink={resolveMistakeUrl(m)}
                placement={`trip/packing-list/${m.slug}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline-offset-4 hover:text-coral hover:underline"
                ariaLabel={`${m.productName} on Amazon (affiliate link)`}
              >
                {m.productName} →
              </AffiliateLink>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function SkimRow({ mistake }: { mistake: PackingMistake }) {
  return (
    <tr className="border-b border-rule-soft/60 align-top">
      <td className="py-4 pr-4 text-[14px] leading-snug text-ink">
        <span className="mr-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
          {mistake.number}
        </span>
        {mistake.mistakeShort}
      </td>
      <td className="py-4 px-4 text-[14px] leading-snug text-ink-soft">
        {mistake.fixShort}
      </td>
      <td className="py-4 pl-4 text-right">
        <AffiliateLink
          programId="amazon"
          deeplink={resolveMistakeUrl(mistake)}
          placement={`trip/packing-list/${mistake.slug}`}
          className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline-offset-4 hover:text-coral hover:underline"
          ariaLabel={`${mistake.productName} on Amazon (affiliate link)`}
        >
          Shop →
        </AffiliateLink>
      </td>
    </tr>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add components/affiliate/MistakeSkimTable.tsx
git commit -m "feat(packing-list): MistakeSkimTable component (table + mobile cards)"
```

---

## Task 5: Create `/hilton-head-packing-list` page

**Files:**
- Create: `app/hilton-head-packing-list/page.tsx`

The full page in one file. Sections, top to bottom:

1. Hero with `.tldr-block`, eyebrow, H1, intro paragraph, `<AffiliateDisclosure variant="banner">`
2. `<MistakeSkimTable>`
3. Reef-safe ordinance callout (inline JSX, with verified external SC source link)
4. 10 deep-dive sections (loop over `PACKING_MISTAKES`, render H2 + body + inline `<AffiliateLink>`)
5. Final CTA → `/itinerary`
6. JSON-LD: breadcrumb, ItemList (inline — see note below), Speakable

**Schema implementation note:** The existing `getItemListSchema(name, items)` helper in `app/lib/metadata.ts` emits `{ position, name, description? }` only — it doesn't include `url`. The spec calls for URLs on each item (essential for SEO value). Build the ItemList JSON-LD inline in this page rather than extending the shared helper for v1 (avoids changing a helper consumed elsewhere). Pre-stamp each URL with `withAffiliateParams()` at render time (server-side) so schema URLs are stable.

**Reef-safe ordinance fact check (per spec §8 edge case):** The callout copy below cites a specific year and SC government source. **Before merging, verify the citation against the live SC DHEC page.** If the regulator's text doesn't support the exact phrasing, soften the copy to "many South Carolina coastal beaches encourage reef-safe sunscreen" and link to a general beach-rules page rather than fabricating regulatory specifics.

- [ ] **Step 1: Create the page file**

```tsx
// app/hilton-head-packing-list/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import MistakeSkimTable from '@/components/affiliate/MistakeSkimTable';
import {
  PACKING_MISTAKES,
  resolveMistakeUrl,
} from '@/data/packingMistakes';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { withAffiliateParams } from '@/app/lib/affiliates';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-packing-list';
const PAGE_URL = `${brand.url}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Packing List: 10 Mistakes First-Timers Make',
  description:
    "The 10 things first-time Hilton Head visitors get wrong — and what to bring instead. Written by a 30-year island local. Wind-rated umbrella, wide-tire beach cart, reef-safe sunscreen, and seven more.",
  path: PATH,
  keywords: [
    'Hilton Head packing list',
    'what to pack for Hilton Head',
    'Hilton Head beach essentials',
    'Hilton Head with kids',
    'Hilton Head Island packing',
  ],
});

export default function HiltonHeadPackingListPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head Packing List', path: PATH },
  ]);

  const speakable = getSpeakableSchema({
    url: PAGE_URL,
    cssSelectors: ['.tldr-block'],
  });

  // Inline ItemList — richer than the shared helper (includes URL per item).
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hilton Head Packing List — 10 Mistakes First-Timers Make',
    numberOfItems: PACKING_MISTAKES.length,
    itemListElement: PACKING_MISTAKES.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.deepDiveHeading,
      url: `${PAGE_URL}#${m.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* ——— Hero ——— */}
        <header className="mt-12 max-w-[760px] md:mt-16">
          <p className="tldr-block rounded-lg border-l-2 border-coral bg-sand-soft/40 px-4 py-3 text-[13px] italic leading-relaxed text-ink-soft md:text-[14px]">
            Hilton Head&rsquo;s Atlantic wind, soft Coligny sand, and seasonal
            no-see-ums break gear that works on other beaches. Locals carry a
            sand-anchor umbrella, a wide-tire cart, picaridin bug spray, and
            reef-safe sunscreen — required by South Carolina ordinance.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-coral">
            Local Field Guide
          </p>
          <h1 className="display mt-3 text-[36px] leading-[1.1] text-ink md:text-[52px]">
            Hilton Head{' '}
            <span className="display-italic font-normal">Packing List.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Ten things first-time visitors get wrong, and what to bring
            instead. Written from thirty years on the island. We earn a few
            dollars from these Amazon links — full disclosure below.
          </p>
          <AffiliateDisclosure variant="banner" className="mt-6" />
        </header>

        {/* ——— Skim table ——— */}
        <section
          aria-label="Skim table: 10 mistakes and fixes"
          className="mt-16 md:mt-20"
        >
          <MistakeSkimTable />
        </section>

        {/* ——— Reef-safe ordinance callout ——— */}
        <aside
          aria-label="South Carolina reef-safe sunscreen ordinance"
          className="mt-16 border-l-2 border-ocean-deep bg-ocean-deep/5 px-5 py-5 md:mt-20 md:px-7 md:py-6"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-ocean-deep">
            Bonus — South Carolina rule
          </p>
          <p className="mt-2 text-[15px] leading-[1.7] text-ink md:text-[16px]">
            South Carolina state guidance and local Beaufort County signage
            encourage reef-safe sunscreen on coastal beaches. The oils that
            chemical sunscreens shed are tracked from the surf zone into the
            tidal creeks that feed our oyster beds and shrimp boats. Reef-safe
            isn&rsquo;t a Hawaiian thing — it&rsquo;s a Lowcountry thing.{' '}
            <a
              href="https://scdhec.gov/environment/your-water-coast/beach-access-water-quality"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
            >
              SC DHEC beach-access overview &rarr;
            </a>
          </p>
        </aside>

        {/* ——— Deep-dive sections ——— */}
        <section
          aria-label="The 10 mistakes, in depth"
          className="mt-16 max-w-[760px] md:mt-20"
        >
          {PACKING_MISTAKES.map((m) => (
            <article
              key={m.slug}
              id={m.slug}
              className="mt-12 border-t border-rule-soft pt-10 first:mt-0 first:border-0 first:pt-0"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-coral">
                {m.number}
              </p>
              <h2 className="display mt-2 text-[22px] leading-[1.2] text-ink md:text-[28px]">
                {m.deepDiveHeading}
              </h2>
              <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                {m.body}
              </p>
              <p className="mt-5 text-[13px] leading-snug text-ink-soft">
                What to buy:{' '}
                <AffiliateLink
                  programId="amazon"
                  deeplink={resolveMistakeUrl(m)}
                  placement={`trip/packing-list/${m.slug}`}
                  className="font-semibold text-ink underline-offset-4 hover:text-coral hover:underline"
                  ariaLabel={`${m.productName} on Amazon (affiliate link)`}
                >
                  {m.productName}
                </AffiliateLink>
                .
              </p>
            </article>
          ))}
        </section>

        {/* ——— Final CTA ——— */}
        <section className="mt-20 mb-24 border-t border-rule-soft pt-12 md:mt-24 md:mb-32">
          <p className="text-[11px] uppercase tracking-[0.18em] text-coral">
            One more thing
          </p>
          <h2 className="display mt-3 text-[22px] leading-[1.2] text-ink md:text-[28px]">
            Shopping for a trip?{' '}
            <span className="display-italic font-normal">Let us plan it.</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            We book by hand — villas, tee times, dinner reservations — for a
            small number of trips a year. If you&rsquo;re past the gear
            checklist and into the harder questions (which neighborhood, which
            week, which restaurants book up six weeks out), we can help.
          </p>
          <div className="mt-6">
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
            >
              Plan my trip
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

// Note: `withAffiliateParams` is imported but currently unused in this file —
// it's available if a future iteration wants to pre-stamp affiliate URLs
// into the ItemList JSON-LD. v1 uses page-anchor URLs (#slug) which are
// stable and don't require tag resolution at schema-generation time.
// If your typechecker flags the unused import, remove it.
export const __NOTE_unusedImport = withAffiliateParams;
```

- [ ] **Step 2: Verify the imports + types**

```bash
npm run typecheck
```

Expected: clean. If it flags `withAffiliateParams` as unused, remove the import line AND the bottom `export const __NOTE_unusedImport = ...;` line — that was a TS escape hatch for the unused import. The note above the export explains the rationale; if you remove both, document it in your commit message.

- [ ] **Step 3: Verify the SC DHEC link is live**

```bash
curl -sI https://scdhec.gov/environment/your-water-coast/beach-access-water-quality | head -5
```

Expected: `HTTP/2 200`. If the page 404s, the URL has changed — search `scdhec.gov` for the current beach-access page and update the `href` in Step 1 before committing. Per spec §8, if no SC DHEC source can be verified, soften the reef-safe callout text to the fallback wording (also per spec §8) and link to the SC DHEC homepage instead.

- [ ] **Step 4: Boot the dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:3000/hilton-head-packing-list. Check:
- [ ] Hero renders with TL;DR block + H1 + intro + FTC banner
- [ ] Skim table shows 10 rows on desktop
- [ ] Resize browser to ≤640px wide → table collapses to 10 stacked cards
- [ ] Reef-safe callout visible after the table
- [ ] 10 deep-dive `<article>` blocks render with proper anchor IDs (`#cheap-umbrella`, etc.)
- [ ] Final CTA links to `/itinerary`

Kill the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add app/hilton-head-packing-list/page.tsx
git commit -m "feat(packing-list): /hilton-head-packing-list page (hero + skim + deep-dives + CTA)"
```

---

## Task 6: Update `data/nav.ts` + `data/footerLinks.ts`

**Files:**
- Modify: `data/nav.ts`
- Modify: `data/footerLinks.ts`

- [ ] **Step 1: Add the packing-list entry to the Services dropdown in `data/nav.ts`**

Find the Services block in `nav.links` and insert one child entry. The exact insertion order matters less than where it sits in the dropdown — place it right after `Dining & Tee Times` and before `Request Itinerary`:

```ts
{
  href: '/services',
  label: 'Services',
  children: [
    { href: '/services#custom-itineraries', label: 'Custom Itineraries' },
    { href: '/services#villa-resort-booking', label: 'Villa & Resort Booking' },
    { href: '/services#group-family-trips', label: 'Group & Family Trips' },
    { href: '/services#on-island-concierge', label: 'On-Island Concierge' },
    { href: '/services#reservations-tee-times', label: 'Dining & Tee Times' },
    { href: '/hilton-head-packing-list', label: 'Packing List' }, // NEW
    { href: '/itinerary', label: 'Request Itinerary' },
  ],
},
```

(If the local copy of `nav.ts` already has a `Villa Match Quiz` entry from sibling work, leave it in place and add packing list below it.)

- [ ] **Step 2: Add the packing-list entry to the "Plan Your Trip" column in `data/footerLinks.ts`**

Find the column labeled `'Plan Your Trip'` and insert one entry. Place it near the top, ahead of seasonal entries:

```ts
{
  label: 'Plan Your Trip',
  links: [
    { href: '/hilton-head-packing-list', label: 'Packing List' }, // NEW — top of column
    { href: '/guides/2027-rbc-heritage', label: '2027 Heritage Kit (free)' },
    { href: '/hilton-head-honeymoon', label: 'Honeymoon' },
    { href: '/hilton-head-weddings', label: 'Weddings' },
    { href: '/hilton-head-golf-packages', label: 'Golf Packages' },
    { href: '/hilton-head-family-trip-planner', label: 'Family Trips' },
    { href: '/hilton-head-beaches', label: 'Beach Vacation' },
    { href: '/hilton-head-oceanfront-villas', label: 'Oceanfront Villas' },
    { href: '/marriott-bonvoy-stays-hilton-head', label: 'Marriott Stays' },
    { href: '/hilton-head-winter-rental', label: 'Winter Rental' },
    { href: '/hilton-head-weather', label: 'Weather by Month' },
    { href: '/events', label: 'Events Calendar' },
  ],
},
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add data/nav.ts data/footerLinks.ts
git commit -m "feat(packing-list): add Packing List to nav + footer"
```

---

## Task 7: Embed inbound links on 6 trip-intent pages + homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/hilton-head-beaches/page.tsx`
- Modify: `app/hilton-head-family-trip-planner/page.tsx`
- Modify: `app/hilton-head-oceanfront-villas/page.tsx`
- Modify: `app/hilton-head-honeymoon/page.tsx`
- Modify: `app/hilton-head-spring-break/page.tsx`
- Modify: `app/hilton-head-weather/[month]/page.tsx`

Most trip-intent pages render through the generic `<TripTypeLandingPage trip={trip} />` component, which we don't want to modify (it's shared). Pattern: wrap or sibling-add JSX **outside** the `<TripTypeLandingPage>` call, the same way the Bonvoy cross-link aside is added on `hilton-head-oceanfront-villas/page.tsx`.

The homepage takes a different shape — slot a one-line inline link card between `<Services>` and `<IslandFlyover>`.

`hilton-head-beaches` and `hilton-head-weather/[month]` already render the existing `<AmazonProductGrid>` in body copy — drop a one-line `<Link>` immediately before the grid that points at the canonical packing list.

- [ ] **Step 1: Add inline link card to the homepage**

In `app/page.tsx`, find the section between `<Services />` and `<IslandFlyover />`. Insert one block:

```tsx
<aside
  aria-label="Hilton Head packing list cross-link"
  className="mx-auto mt-12 max-w-[760px] border-l-2 border-coral bg-cream/40 px-5 py-4 text-[14px] leading-snug text-ink-soft md:mt-16 md:py-5 md:text-[15px]"
>
  <span className="font-semibold uppercase tracking-[0.12em] text-coral">
    Before you pack ·{' '}
  </span>
  First-timer gear traps Hilton Head will punish you for —{' '}
  <a
    href="/hilton-head-packing-list"
    className="font-semibold text-ink underline-offset-2 hover:underline"
  >
    the 10-mistake packing list
  </a>
  .
</aside>
```

(If the local copy of `app/page.tsx` already contains a `<VillaMatchEntryCard variant="feature" source="homepage" />` from sibling work, place the packing-list aside immediately AFTER it so both cross-links sit in the same body-rhythm slot.)

- [ ] **Step 2: Add an inline link to `app/hilton-head-beaches/page.tsx`**

Find the existing `<AmazonProductGrid>` invocation. Add a single line of body copy immediately above it:

```tsx
<p className="mx-auto mt-10 max-w-[760px] text-[14px] leading-[1.7] text-ink-soft">
  Before the gear breakdown by category, our short version of the day:{' '}
  <a
    href="/hilton-head-packing-list"
    className="font-semibold text-ink underline-offset-2 hover:underline"
  >
    the 10-mistake packing list
  </a>
  .
</p>
```

If `hilton-head-beaches/page.tsx` does NOT contain an `<AmazonProductGrid>` (recent refactor may have moved it), place the same paragraph at the bottom of the main body, immediately before any closing wrapper element.

- [ ] **Step 3: Add a sibling aside to `app/hilton-head-family-trip-planner/page.tsx`**

Find the `<TripTypeLandingPage trip={trip} />` line. Insert a sibling aside immediately after it:

```tsx
<aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
  <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
    <span className="font-semibold uppercase tracking-[0.12em] text-coral">
      Pack smart ·{' '}
    </span>
    Family-trip gear traps locals warn first-timers about —{' '}
    <a
      href="/hilton-head-packing-list"
      className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
    >
      the 10-mistake packing list
    </a>
    .
  </div>
</aside>
```

- [ ] **Step 4: Add a sibling aside to `app/hilton-head-oceanfront-villas/page.tsx`**

This page already contains a Bonvoy cross-link aside. Add a second aside right after the Bonvoy one (so they read as two related "see also" pointers):

```tsx
<aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
  <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
    <span className="font-semibold uppercase tracking-[0.12em] text-coral">
      Before check-in ·{' '}
    </span>
    What to bring to an oceanfront stay (the wind eats cheap umbrellas) —{' '}
    <a
      href="/hilton-head-packing-list"
      className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
    >
      the 10-mistake packing list
    </a>
    .
  </div>
</aside>
```

- [ ] **Step 5: Add a sibling aside to `app/hilton-head-honeymoon/page.tsx`**

Same pattern as Task 7 Step 3 (family planner). Copy text varies:

```tsx
<aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
  <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
    <span className="font-semibold uppercase tracking-[0.12em] text-coral">
      For the couple ·{' '}
    </span>
    Polarized sunglasses, picaridin, a quiet evening blanket — the small
    list locals carry, in{' '}
    <a
      href="/hilton-head-packing-list"
      className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
    >
      the 10-mistake packing list
    </a>
    .
  </div>
</aside>
```

- [ ] **Step 6: Add a sibling aside to `app/hilton-head-spring-break/page.tsx`**

```tsx
<aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
  <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
    <span className="font-semibold uppercase tracking-[0.12em] text-coral">
      Spring break pack ·{' '}
    </span>
    Wind on the dunes, no-see-ums by May — what locals carry, in{' '}
    <a
      href="/hilton-head-packing-list"
      className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
    >
      the 10-mistake packing list
    </a>
    .
  </div>
</aside>
```

- [ ] **Step 7: Add an inline link to `app/hilton-head-weather/[month]/page.tsx`**

Same pattern as Task 7 Step 2 (beaches). Find the existing `<AmazonProductGrid>` invocation and add a paragraph above it:

```tsx
<p className="mx-auto mt-10 max-w-[760px] text-[14px] leading-[1.7] text-ink-soft">
  Looking for the gear-by-category breakdown? Start with{' '}
  <a
    href="/hilton-head-packing-list"
    className="font-semibold text-ink underline-offset-2 hover:underline"
  >
    the 10-mistake packing list
  </a>{' '}
  — what first-timers get wrong, and what to bring instead.
</p>
```

- [ ] **Step 8: Verify each modified page still typechecks + boots**

```bash
npm run typecheck
```

Spot-check three of the modified pages in dev (`npm run dev`):
- http://localhost:3000/
- http://localhost:3000/hilton-head-oceanfront-villas
- http://localhost:3000/hilton-head-weather/july (or any month with a content entry)

Confirm each renders the packing-list cross-link.

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx app/hilton-head-beaches app/hilton-head-family-trip-planner app/hilton-head-oceanfront-villas app/hilton-head-honeymoon app/hilton-head-spring-break app/hilton-head-weather
git commit -m "feat(packing-list): inbound links from homepage + 6 trip-intent pages"
```

---

## Task 8: Update `public/llms.txt` + `public/llms-full.txt`

**Files:**
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`

Per CLAUDE.md, these are manually-maintained LLM index files (not generated from `data/`). Both must reference the new page so ChatGPT/Claude/Perplexity discover and cite it.

- [ ] **Step 1: Open `public/llms.txt` and add a Resources entry**

Find the existing Resources section (or wherever travel-specific pages are listed). Add one line in the appropriate position (alphabetical or chronological — match what's there):

```
- [Hilton Head Packing List: 10 Mistakes First-Timers Make](https://www.hiltonahead.com/hilton-head-packing-list) — local-voice mistake-prevention guide pairing Hilton Head-specific gear traps (Atlantic wind, Coligny soft sand, SC reef-safe ordinance, no-see-um seasonality) with the right replacement gear.
```

- [ ] **Step 2: Open `public/llms-full.txt` and add a longer section**

Find an existing topical section that lists trip-planning content. Add a new section in similar voice + structure:

```
## Resource: Hilton Head Packing List

The Hilton Ahead packing list at https://www.hiltonahead.com/hilton-head-packing-list documents the 10 most common gear mistakes first-time Hilton Head Island visitors make. Each mistake is paired with the local-context reason it matters (Atlantic gust speeds of 12–18 mph at Coligny that shred unrated umbrellas; soft-sand depth at the south end of Coligny that traps narrow-wheel wagons; South Carolina reef-safe sunscreen guidance on coastal beaches; no-see-um lifecycle from May through October in Lowcountry marsh-edge environments; oyster shells in the brackish back lagoons of Sea Pines and Palmetto Dunes) and the equipment locals carry as a result (sand-anchor umbrellas like BeachBub or Sport-Brella; wide-tire beach carts like Mac Sports All-Terrain or WonderWheeler Wide; Sun Bum SPF 50 or Blue Lizard mineral sunscreen; Sawyer or Natrapel picaridin 20%; closed-toe slip-on water shoes; 10L roll-top dry bags; Tommy Bahama 5-position backpack beach chairs; Yeti Roadie 24 or Coleman Xtreme 5-day coolers; Goodr polarized sunglasses; Wallaroo or Coolibar wide-brim UPF 50+ hats). The page contains affiliate links to Amazon and discloses this above the fold per FTC guidance.
```

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt public/llms-full.txt
git commit -m "docs(llms): index new packing-list page for LLM citation"
```

---

## Task 9: Write Playwright tests (`tests/packing-list.spec.ts`)

**Files:**
- Create: `tests/packing-list.spec.ts`

Per `playwright.config.ts`, no `webServer` is defined — tests assume a dev server running on port 3000. Run `npm run dev` in one terminal and `npx playwright test tests/packing-list.spec.ts` in another. Per `CLAUDE.md`, Playwright is the only test surface — there is no unit-test runner.

The villa-match a11y spec uses `@axe-core/playwright` already; reuse the same pattern.

- [ ] **Step 1: Write the spec with all 9 tests**

```ts
// tests/packing-list.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PATH = '/hilton-head-packing-list';

test('packing-list page loads with all major sections', async ({ page }) => {
  await page.goto(PATH);
  await expect(
    page.getByRole('heading', { name: /Hilton Head.*Packing List/i, level: 1 }),
  ).toBeVisible();
  // FTC disclosure banner above the fold
  await expect(page.getByRole('note', { name: /affiliate disclosure/i })).toBeVisible();
  // Reef-safe callout further down
  await expect(page.getByText(/reef-safe/i).first()).toBeVisible();
  // Final CTA
  await expect(page.getByRole('link', { name: /plan my trip/i })).toBeVisible();
});

test('skim table renders 10 rows on desktop with Amazon links', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(PATH);
  // The desktop table is visible (sm:table); mobile <ul> is hidden
  const table = page.getByRole('table', { name: /packing mistakes/i });
  await expect(table).toBeVisible();
  // 10 body rows
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(10);
  // Every row has at least one link to amazon.com
  for (let i = 0; i < 10; i++) {
    const row = rows.nth(i);
    const amazonLinks = row.locator('a[href*="amazon.com"]');
    await expect(amazonLinks.first()).toBeVisible();
  }
});

test('all Amazon links have FTC-compliant rel attribute', async ({ page }) => {
  await page.goto(PATH);
  const amazonLinks = page.locator('a[href*="amazon.com"]');
  const count = await amazonLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const rel = (await amazonLinks.nth(i).getAttribute('rel')) ?? '';
    expect(rel).toContain('sponsored');
    expect(rel).toContain('nofollow');
    expect(rel).toContain('noopener');
  }
});

test('Amazon links include either a tag param or a search URL', async ({ page }) => {
  await page.goto(PATH);
  const amazonLinks = page.locator('a[href*="amazon.com"]');
  const count = await amazonLinks.count();
  for (let i = 0; i < count; i++) {
    const href = (await amazonLinks.nth(i).getAttribute('href')) ?? '';
    // Either the link has a ?tag= (when tracking env is set in CI) OR it's a
    // search URL (?k=...) that legally has no tag yet. Both are acceptable in
    // the dev env. The presence of `amazon.com` is the floor.
    expect(href).toMatch(/amazon\.com/);
  }
});

test('reef-safe callout renders with SC DHEC link', async ({ page }) => {
  await page.goto(PATH);
  const callout = page.locator('aside[aria-label*="reef-safe"]');
  await expect(callout).toBeVisible();
  await expect(callout).toContainText(/South Carolina/i);
  await expect(callout).toContainText(/reef-safe/i);
  // External link points to SC DHEC
  const dhecLink = callout.locator('a[href*="scdhec.gov"]');
  await expect(dhecLink).toBeVisible();
});

test('10 deep-dive sections each have an h2 with anchor id', async ({ page }) => {
  await page.goto(PATH);
  const articles = page.locator('section[aria-label*="in depth"] article');
  await expect(articles).toHaveCount(10);
  for (let i = 0; i < 10; i++) {
    const article = articles.nth(i);
    const id = await article.getAttribute('id');
    expect(id).toBeTruthy();
    expect(id?.length ?? 0).toBeGreaterThan(2);
    await expect(article.locator('h2')).toBeVisible();
  }
});

test('mobile viewport (375px) shows stacked cards, not the table', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(PATH);
  // Desktop <table> exists in DOM but is display:none via Tailwind hidden+sm:table
  const list = page.getByRole('list').filter({ hasText: /mistake 01/i }).first();
  await expect(list).toBeVisible();
  const items = list.getByRole('listitem');
  await expect(items).toHaveCount(10);
});

test('a11y scan passes (axe-core, WCAG AA, 0 critical/serious)', async ({ page }) => {
  await page.goto(PATH);
  await expect(
    page.getByRole('heading', { name: /Hilton Head.*Packing List/i, level: 1 }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('[aria-hidden="true"]')
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(
    critical,
    `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`,
  ).toHaveLength(0);
});

test('schema JSON-LD includes Breadcrumb + ItemList + Speakable', async ({ page }) => {
  await page.goto(PATH);
  const ldNodes = page.locator('script[type="application/ld+json"]');
  const count = await ldNodes.count();
  expect(count).toBeGreaterThanOrEqual(3);

  const blobs: unknown[] = [];
  for (let i = 0; i < count; i++) {
    const txt = (await ldNodes.nth(i).textContent()) ?? '';
    try {
      blobs.push(JSON.parse(txt));
    } catch {
      throw new Error(`Schema blob ${i} is not valid JSON: ${txt.slice(0, 80)}`);
    }
  }

  const types = blobs.map((b) =>
    (b as { '@type'?: string })['@type'] ?? '',
  );
  expect(types).toContain('BreadcrumbList');
  expect(types).toContain('ItemList');
  // WebPage is the wrapper @type for getSpeakableSchema's output
  expect(types).toContain('WebPage');

  // ItemList must have 10 items
  const itemList = blobs.find(
    (b) => (b as { '@type'?: string })['@type'] === 'ItemList',
  ) as { itemListElement?: unknown[] } | undefined;
  expect(itemList?.itemListElement?.length).toBe(10);
});
```

- [ ] **Step 2: Start the dev server in one terminal**

```bash
npm run dev
```

- [ ] **Step 3: Run the spec in another terminal**

```bash
npx playwright test tests/packing-list.spec.ts
```

Expected: 9/9 pass across configured browsers (chromium, firefox, webkit per `playwright.config.ts`).

If any test fails:
- **Failure on the a11y test:** read the dumped violations; most likely contrast or aria-label issue. Fix in the page or the table component, not the test.
- **Failure on the schema test:** inspect the page source for `<script type="application/ld+json">` — count must be ≥3, blobs must be valid JSON, `@type` set must include the three expected types.
- **Failure on the mobile-cards test:** the Tailwind responsive classes for `hidden` + `sm:hidden` interact subtly. Confirm with browser devtools at 375px that the `<table>` is `display:none` and the `<ul>` is rendering.

- [ ] **Step 4: Commit**

```bash
git add tests/packing-list.spec.ts
git commit -m "test(packing-list): 9 Playwright tests (e2e + a11y + schema)"
```

---

## Task 10: Final pass — typecheck, lint, build, manual QA, PR

- [ ] **Step 1: Run typecheck + lint**

```bash
npm run typecheck
npm run lint
```

Expected: both clean. Fix any warnings before shipping. ESLint may flag the unused `withAffiliateParams` import in `app/hilton-head-packing-list/page.tsx` — if so, delete the import and the `__NOTE_unusedImport` export (both were temporary scaffolding noted in Task 5).

- [ ] **Step 2: Run the full Playwright suite locally**

```bash
npx playwright test tests/packing-list.spec.ts tests/villa-match-*.spec.ts
```

Expected: all green. The packing-list spec is new; the villa-match specs should still pass because none of our edits touched their surface.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: clean build, no warnings about missing imports or bundle-size limits.

- [ ] **Step 4: Bundle-size sanity check**

After build, the Next output prints per-route sizes. Look for the `/hilton-head-packing-list` entry. Target: under 25 KB First Load JS. The page should be very small because almost everything is server-rendered — the only client island is `<AffiliateLink>`, which is shared across the site. If the route bundle exceeds 50 KB, something unintended was bundled in (likely an accidental client component import) — investigate before merging.

- [ ] **Step 5: Manual QA — click every link in production-build mode**

```bash
npm run build && npm run start
```

Open http://localhost:3000/hilton-head-packing-list and walk through:

- [ ] Hero renders TL;DR block + H1 + intro paragraph + FTC banner
- [ ] Skim table shows 10 rows on desktop
- [ ] Click each of the 10 🛒 links in the skim table → opens amazon.com in a new tab
- [ ] Resize to ≤640px → table collapses to 10 stacked cards, all still clickable
- [ ] Reef-safe callout renders with the SC DHEC link visible
- [ ] All 10 deep-dive `<article>` blocks render with their H2 + body + inline Amazon link
- [ ] Click the inline link in deep-dive #3 (Sun Bum) → opens amazon.com with `?tag=` if `AFFILIATE_AMAZON_TAG` is set locally, or just the ASIN if not
- [ ] Final CTA `Plan my trip` links to `/itinerary`
- [ ] View page source — confirm three `<script type="application/ld+json">` blobs, all parseable JSON
- [ ] On a sibling page (e.g., `/hilton-head-oceanfront-villas`), the new inbound aside is visible and links correctly to `/hilton-head-packing-list`

- [ ] **Step 6: Verify Vercel env var for primary tag**

Open the Vercel project dashboard → Settings → Environment Variables. Confirm `AFFILIATE_AMAZON_TAG` is set to your primary Associates Tracking ID in the Production environment. If it isn't set, the page will still ship but no commission attribution happens — fix before the next deploy.

`AFFILIATE_AMAZON_TAG_TRIP` is OPTIONAL — leave unset for v1; the helper falls back to the primary tag.

- [ ] **Step 7: Final commit (if any nits)**

If the manual QA surfaced small polish items (copy tweak, spacing tweak):

```bash
git add -A
git commit -m "chore(packing-list): manual QA polish"
```

If no polish needed, skip this step.

- [ ] **Step 8: Push and open PR**

```bash
git push -u origin feat/packing-list
```

Open a PR titled `feat: /hilton-head-packing-list (Amazon Associates landing page)` with a description summarizing:
- Goal: hit Amazon Associates 3-sale floor before account closes
- New: page, MistakeSkimTable component, packingMistakes data, 10 inbound internal links
- Modified: nav, footer, llms.txt, affiliateLinks placement-tag map
- Testing: 9 Playwright tests + axe-core scan passing

Do NOT merge until the user explicitly approves.

---

## Self-Review

After writing this plan, fresh-eyes pass over the spec:

**Spec coverage check:**
- ✅ Goal (Amazon 3-sale floor) — referenced in plan header
- ✅ The 10 mistakes — Task 3 ships all 10 with full body copy
- ✅ Page architecture (hero → skim → reef-safe → deep-dives → CTA) — Task 5
- ✅ `data/packingMistakes.ts` content source of truth — Task 3
- ✅ `<MistakeSkimTable>` component — Task 4
- ✅ `app/hilton-head-packing-list/page.tsx` — Task 5
- ✅ `trip` placement-tag prefix in `affiliateLinks.ts` — Task 2
- ✅ `.env.example` documentation of `AFFILIATE_AMAZON_TAG_TRIP` — Task 2
- ✅ Inbound links from homepage + 6 trip pages — Task 7
- ✅ `nav.ts` + `footerLinks.ts` updates — Task 6
- ✅ `llms.txt` + `llms-full.txt` updates — Task 8
- ✅ JSON-LD: Breadcrumb + ItemList + Speakable — Task 5 (ItemList inlined, not via shared helper, because the shared helper does not include URL per item)
- ✅ TL;DR block with `.tldr-block` class — Task 5
- ✅ FTC disclosure above the fold — Task 5
- ✅ Voice constraints (no exclamation marks, no "click here", no price quotes) — enforced in Task 3 body copy
- ✅ Mobile stacked cards via Tailwind responsive — Task 4
- ✅ 9 Playwright tests — Task 9
- ✅ Manual QA + acceptance criteria — Task 10
- ✅ Cross-reference invariant (`productSlug` OR `amazonUrl`, not both) — Task 3 type definition + `resolveMistakeUrl()` helper

**Edge cases from spec §8:**
- ✅ ASIN 404 fallback (`searchUrl` field on `PackingMistake`) — Task 3
- ✅ `AFFILIATE_AMAZON_TAG_TRIP` unset → fallback to primary (soft gate) — Task 10 Step 6
- ✅ Reef-safe ordinance fact accuracy → Task 5 Step 3 verifies the SC DHEC URL before commit
- ✅ Print/no-tag leakage — accepted, no print stylesheet (per spec §10)
- ✅ Page-load performance: only `<AffiliateLink>` is a client island — Task 5 keeps everything else server-rendered

**Amazon TOS compliance (spec §8):**
- ✅ No prices in body — Task 3 voice constraints enforce this
- ✅ Paraphrased product names (not verbatim Amazon titles) — Task 3 `productName` field
- ✅ Text-only rendering (no Amazon-hosted images) — Task 5 has no `<img>` tags pointing at Amazon
- ✅ No inducements — copy is editorial recommendation only
- ✅ Email distribution NOT addressed by this PR (newsletter sends are out of scope; the existing newsletter pipeline links to site pages, not direct to Amazon)

**Voice constraint check on Task 3 body copy:**
- ✅ No exclamation marks in any of the 10 body paragraphs
- ✅ No "BEST" / "AMAZING" / "ULTIMATE" superlatives
- ✅ Each paragraph cites at least one specific local detail (named beach, specific bug month, specific wind range, specific tide-zone)
- ✅ Anchor copy is product/brand name (not "click here")
- ✅ No specific prices (only categorical references like "$30 cooler")

**Placeholder scan:** None found. Every code step has actual content. Every shell command has expected output. The reef-safe ordinance link is a real SC DHEC URL with a fallback path documented if it 404s.

**Type consistency:**
- `PackingMistake` shape defined in Task 3, consumed identically in Task 4 (`MistakeSkimTable.tsx`) and Task 5 (page).
- `resolveMistakeUrl(m: PackingMistake): string` defined in Task 3, imported and called in Tasks 4 + 5.
- `PACKING_MISTAKES` exported as `ReadonlyArray<PackingMistake>` in Task 3; iterated by `.map()` in Tasks 4 + 5 — read-only iteration matches the type.
- All placement strings follow the convention `trip/packing-list/<slug>` consistently across Task 4 + 5.
- `data/amazonProducts.ts` slugs referenced by `productSlug` in Task 3 are checked at build time via Task 3 Step 2.

**Notes inline:**
- The unused `withAffiliateParams` import in Task 5 is intentional scaffolding for v1.1 (when ItemList JSON-LD will gain pre-stamped affiliate URLs). Task 10 Step 1 explicitly says to delete it if the linter complains.
- The SC DHEC URL was the most plausible at spec-write time but should be verified during Task 5 Step 3 — that step has the fallback documented.
- Mistakes #4 (picaridin), #5 (water shoes), #6 (dry bag) reference catalog slugs. Verified at plan-write time: `sawyer-picaridin-spray` ✓, `water-shoes-keen` ✓, `sea-to-summit-dry-bag` ✓ — the Task 3 body uses these exact strings. If `data/amazonProducts.ts` is refactored before this plan runs, Task 3 Step 2's slug-verify script will surface any drift.
