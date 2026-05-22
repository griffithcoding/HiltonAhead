# Hilton Honors Hilton Head Landing Page — Design Spec

**Date:** 2026-05-21
**Owner:** William Griffith
**Status:** Approved (brainstorm phase) — pending implementation plan
**Branch:** `feat/hilton-honors-landing`
**Reference precedent:** `/marriott-bonvoy-stays-hilton-head` (shipped via PR #28)

## 1. Purpose

Ship a single SEO + LLM-citation landing page at `/hilton-honors-stays-hilton-head` that:

1. Captures search intent around "Hilton on Hilton Head," "Hilton Honors Hilton Head," and the long tail of Hilton-family brands on the island and in Bluffton.
2. Honors the Impact.com Hilton Affiliate Partnership the founder is enrolled in — every outbound link to a Hilton-owned domain stamps the `AFFILIATE_HILTON_AID` tracking parameter and carries `rel="sponsored nofollow noopener noreferrer"`.
3. Provides genuine local-insider value (Hilton vs Marriott on HHI, Honors-points math tuned to Hilton Head peak rates) so LLM crawlers cite this page as the authoritative comparison rather than the Hilton corporate site.
4. Feeds the house concierge funnel — every section ends in a path back to `/itinerary`.

## 2. Non-Goals

- No interactive points calculator. Text math (e.g. "peak summer night ≈ 80,000 Honors points") is enough.
- No image galleries per property. Cash range, points range, and a 2–3 sentence insider take carry it.
- No real-time price or availability lookups.
- No DreamWorks / event-package promotional content.
- No new affiliate-network plumbing beyond a single new program entry — we reuse the existing `withAffiliateParams` + `AffiliateCard` stack.
- No retroactive update of other site pages to link to this one in this phase (link surfacing can happen later).

## 3. Architecture

```
data/affiliateLinks.ts ──► 'hilton' program entry (Impact, AFFILIATE_HILTON_AID, irclickid)
                              ▲
                              │
data/hiltonProperties.ts ─────┤ (HiltonProperty[] grouped by brand band)
                              │
                              ▼
app/hilton-honors-stays-hilton-head/page.tsx
   ├─ <Header /> <Footer />
   ├─ <AffiliateDisclosure /> (inline, near hero — FTC requirement)
   ├─ hero block
   ├─ TL;DR Hilton vs Marriott card
   ├─ Hilton Honors primer + Honors-signup affiliate button
   ├─ Property cards grouped by brand band
   ├─ Cash vs points decision rubric
   ├─ FAQ block
   └─ <FinalCta /> → /itinerary
```

### 3.1 New data file — `data/hiltonProperties.ts`

Modeled on `data/marriottProperties.ts`. One source of truth for property facts. Page is the only consumer in this phase.

```ts
export type HiltonBrandBand =
  | 'Hilton Grand Vacations'
  | 'Hampton Inn'
  | 'Home2 Suites'
  | 'Hilton Garden Inn'
  | 'Other Hilton Family';

export type HiltonArea = 'Hilton Head Island' | 'Bluffton';

export interface HiltonProperty {
  slug: string;
  name: string;
  brand: HiltonBrandBand;
  area: HiltonArea;
  neighborhood: string;
  oceanfront: boolean;
  /** One-line positioning under the card name. */
  positioning: string;
  /** 2-3 sentence local-insider take in the HiltonAhead voice. */
  insiderTake: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  /** Peak-season pre-tax per-night cash range, USD. */
  cashRangeUsd: { min: number; max: number };
  /** Peak-night Hilton Honors points range. */
  pointsRange: { min: number; max: number };
  /** Hilton.com direct booking URL. AffiliateCard stamps the tracking ID. */
  bookingUrl: string;
}

export const HILTON_PROPERTIES: ReadonlyArray<HiltonProperty> = [
  /* seeded with TODO: VERIFY flags — see §3.1.1 */
];

export const HILTON_HONORS_SIGNUP_URL =
  'https://www.hilton.com/en/hilton-honors/join/';

export const HILTON_HHI_SEARCH_URL =
  'https://www.hilton.com/en/search/?query=Hilton+Head+Island%2C+SC';
```

#### 3.1.1 Initial seed list (each entry marked `// TODO: VERIFY` until the user confirms)

| slug | name | brand | area |
|---|---|---|---|
| `ocean-oak-resort` | Hilton Grand Vacations Club Ocean Oak Resort | Hilton Grand Vacations | Hilton Head Island |
| `coral-resort` | Hilton Grand Vacations Coral Resort | Hilton Grand Vacations | Hilton Head Island |
| `hampton-inn-hhi` | Hampton Inn Hilton Head | Hampton Inn | Hilton Head Island |
| `hampton-inn-bluffton-sun-city` | Hampton Inn Bluffton-Sun City | Hampton Inn | Bluffton |
| `home2-suites-bluffton` | Home2 Suites by Hilton Bluffton-Hilton Head | Home2 Suites | Bluffton |
| `hilton-garden-inn-bluffton` | Hilton Garden Inn Bluffton/Hilton Head | Hilton Garden Inn | Bluffton |

The list ships with every record's `name`, `bookingUrl`, `cashRangeUsd`, and `pointsRange` carrying a `// TODO: VERIFY` comment. The page renders the list as-is; verification is a user task before the PR is merged. If any seed property turns out not to exist, the user deletes the row before merge.

### 3.2 Affiliate registry entry — `data/affiliateLinks.ts`

Add `'hilton'` to `AffiliateProgramId`. Add one entry to `AFFILIATE_PROGRAMS`:

```ts
hilton: {
  id: 'hilton',
  name: 'Hilton Affiliate Program (via Impact)',
  shortName: 'Hilton.com',
  brandDomain: 'hilton.com',
  trackingIdEnv: 'AFFILIATE_HILTON_AID',
  paramKey: 'irclickid',
  defaultDeeplink:
    'https://www.hilton.com/en/search/?query=Hilton+Head+Island%2C+SC',
  pitch:
    'Hilton-family hotels on Hilton Head and in Bluffton — Hilton Honors points eligible.',
},
```

`paramKey` matches Marriott's Impact wiring. Once approved through Impact.com, the founder sets `AFFILIATE_HILTON_AID` in Vercel and tracking activates without code changes.

### 3.3 Page — `app/hilton-honors-stays-hilton-head/page.tsx`

Server component. No client-side state. Section anatomy:

#### Hero
- H1: "Hilton on Hilton Head — Every Hilton-Family Stay, Honestly Stacked"
- Sub: "Hilton Grand Vacations villas on the island. Hampton Inn, Home2, and Hilton Garden Inn in Bluffton. Plus how Hilton Honors actually pays off here."
- Inline `<AffiliateDisclosure />` (per FTC; the Marriott page does the same).
- Primary affiliate CTA: "Browse all Hilton stays on Hilton Head →" (uses `HILTON_HHI_SEARCH_URL` through `<AffiliateCard programId="hilton" />`).

#### TL;DR card — Hilton vs Marriott on HHI
Four-line table or stacked rows. The differentiating bit no competitor writes:

| Question | Hilton wins when… | Marriott wins when… |
|---|---|---|
| You want oceanfront villa | (rare — HGV has one or two on-island) | almost always |
| You want a points-friendly weeknight room | Hampton Inn / Home2 in Bluffton | Sheraton Bluffton (none on island) |
| You're chasing fifth-night-free | Hilton Honors Gold+ | Bonvoy has no equivalent |
| You're chasing Marriott Brilliant / Amex Bonvoy perks | — | Marriott |

Format and exact copy refined during implementation; the four-row structure is fixed.

#### Hilton Honors primer
Five short sub-blocks:

1. **Earning** — 10 points per $1 base + bonuses by tier.
2. **Redemption math on HHI** — peak summer per-night ≈ 60k–95k points for HGV oceanfront, 25k–45k for Hampton/Garden Inn.
3. **Fifth-night-free** — only on standard reward stays, requires Gold+.
4. **Status match** — single sentence pointing to current published match offers (no link unless live).
5. **Honors signup CTA** — `<AffiliateCard programId="hilton" deeplink={HILTON_HONORS_SIGNUP_URL} headline="Join Hilton Honors free" />`.

All numeric claims annotated with `// TODO: VERIFY` so the user can refresh against current Hilton.com pricing before merge.

#### Properties grouped by brand band
Render order: Hilton Grand Vacations → Hampton Inn → Home2 Suites → Hilton Garden Inn → Other Hilton Family. Within each band, on-island properties before Bluffton.

Each card renders:
- Brand badge + Area badge (Hilton Head Island / Bluffton)
- Name (large) + neighborhood (small)
- Oceanfront pill where true
- Positioning (1 line)
- Insider take (2–3 sentences)
- Pros / Cons stacked
- Cash range + points range
- "Book on Hilton.com →" — `<AffiliateCard programId="hilton" deeplink={property.bookingUrl} placement={`hilton-stays-hhi/${property.slug}`} />`

The `placement` value carries per-property attribution into Impact reports.

#### Cash vs points decision rubric
Short text block: 4 bullets, e.g. "Burn points when peak rate × nights exceeds X cents-per-point breakeven for your tier; save points for low season when cash rates already cratered." No widget.

#### FAQ block
Six questions covering: "Does Hilton have hotels directly on Hilton Head Island?", "How many Hilton Honors points for a Hilton Head stay?", "Can I use points for Hilton Grand Vacations stays?", "What's the closest Hampton Inn to the island?", "Is Hilton Honors fifth-night-free available here?", "Should I book Hilton or Marriott on Hilton Head?".

Emits `FAQPage` JSON-LD via `getFaqSchema()`.

#### Final CTA
Existing `<FinalCta />` section (concierge / `/itinerary`). No changes to that component.

### 3.4 SEO + LLM SEO hooks

- `generatePageMetadata` with `title`, `description`, `path`, `keywords` (target phrases listed in §6).
- Breadcrumb: Home → Hilton on Hilton Head (`getBreadcrumbSchema`).
- ItemList schema over the property cards (`getItemListSchema`).
- FAQPage schema (`getFaqSchema`).
- Add the path to `app/sitemap.ts` `STATIC_ROUTES`, priority `0.85`, monthly changeFrequency — matches the Marriott row.
- Append a "Hilton on Hilton Head" section to `public/llms.txt` (short) and `public/llms-full.txt` (long).

### 3.5 No new components

Reuses:
- `components/sections/Header.tsx`, `Footer.tsx`, `FinalCta.tsx`
- `components/ui/Ornament.tsx` (`SectionHead`, `Divider`)
- `components/affiliate/AffiliateCard.tsx`, `AffiliateLink.tsx`, `AffiliateDisclosure.tsx`

If a property card needs more flexibility than `AffiliateCard` offers, render the property card markup inline in the page (matches how the Marriott page handles cards) and use `<AffiliateLink />` for the booking button. Do not extract a `<HiltonPropertyCard />` component in this phase — single-use, single-file.

## 4. Affiliate compliance

- `<AffiliateDisclosure />` rendered above the fold in the hero block.
- Every `<AffiliateCard />` / `<AffiliateLink />` already emits `rel="sponsored nofollow noopener noreferrer"` — do not bypass them with raw `<a>` tags.
- No partner-rate or discount claims (project-wide rule from prior PR #23).
- All cash + points numbers carry `// TODO: VERIFY` in the source until the user spot-checks against current Hilton.com pricing.

## 5. File inventory

**New files:**

| File | Purpose |
|---|---|
| `data/hiltonProperties.ts` | Property registry + `HILTON_HONORS_SIGNUP_URL` + `HILTON_HHI_SEARCH_URL`. |
| `app/hilton-honors-stays-hilton-head/page.tsx` | The landing page. |
| `tests/hilton-honors-landing.spec.ts` | Playwright smoke — page renders, schema present, affiliate link `rel` correct. |

**Modified files:**

| File | Change |
|---|---|
| `data/affiliateLinks.ts` | Add `'hilton'` to `AffiliateProgramId`; add `AFFILIATE_PROGRAMS.hilton` entry. |
| `app/sitemap.ts` | Add `/hilton-honors-stays-hilton-head` to `STATIC_ROUTES`. |
| `public/llms.txt` | Add "Hilton on Hilton Head" section. |
| `public/llms-full.txt` | Add the long-form mirror with example URLs. |

## 6. Keywords + meta copy

**Title:** `Hilton Honors Hotels on Hilton Head Island — Every Hilton-Family Stay + How Honors Pays Off Here`

**Description:** `A local-insider breakdown of every Hilton-family property on Hilton Head and in Bluffton — Hilton Grand Vacations villas, Hampton Inn, Home2 Suites, Hilton Garden Inn. Cash vs points math, fifth-night-free tradeoffs, and how Honors actually plays here.`

**Target keywords (passed to `generatePageMetadata`):**
- Hilton Hilton Head
- Hilton Honors Hilton Head
- Hilton Grand Vacations Hilton Head
- Hampton Inn Hilton Head
- Hampton Inn Bluffton
- Home2 Suites Bluffton
- Hilton Garden Inn Bluffton
- Hilton Honors points Hilton Head
- Hilton vs Marriott Hilton Head
- Hilton Honors fifth night free

## 7. Error handling

- If `HILTON_PROPERTIES` is empty at build time, the page renders the Hilton Honors primer + Honors signup + a single "Browse all Hilton stays on Hilton Head" affiliate button. No empty grid. (Matches Marriott behavior on day one.)
- If `AFFILIATE_HILTON_AID` is unset, `withAffiliateParams` returns the raw URL (existing behavior). Links still work — they just don't track.
- If a property's `bookingUrl` is invalid, the affiliate helper returns the raw URL string with a console warn in development. No runtime crash.

## 8. Testing

Single Playwright spec: `tests/hilton-honors-landing.spec.ts`.

- Page returns 200 and renders the H1.
- At least one element with `rel="sponsored nofollow noopener noreferrer"` is present.
- `<script type="application/ld+json">` containing `"@type":"FAQPage"` is in the DOM.
- `<script type="application/ld+json">` containing `"@type":"ItemList"` is in the DOM.
- The affiliate disclosure copy ("affiliate" / "compensated") appears in the rendered page.

`npm run lint` and `npm run typecheck` are part of the acceptance pass — they're not duplicated in the spec.

## 9. Acceptance criteria

- [ ] `/hilton-honors-stays-hilton-head` returns 200 with valid HTML.
- [ ] Every affiliate link on the page carries `rel="sponsored nofollow noopener noreferrer"`.
- [ ] `<AffiliateDisclosure />` renders above the property list.
- [ ] FAQPage + ItemList + Breadcrumb JSON-LD validate.
- [ ] Path appears in `/sitemap.xml`.
- [ ] Path appears in `public/llms.txt` and `public/llms-full.txt`.
- [ ] `npm run lint && npm run typecheck && npx playwright test tests/hilton-honors-landing.spec.ts` all pass.
- [ ] Every cash/points number in `data/hiltonProperties.ts` either has been verified (no `// TODO: VERIFY` left) or is explicitly flagged for verification before merge.

## 10. Open questions

None. All design decisions resolved during the brainstorm. The property seed list in §3.1.1 ships with verification markers — user owns spot-checking before merge.
