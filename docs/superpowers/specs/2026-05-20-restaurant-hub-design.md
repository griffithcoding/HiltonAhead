# Restaurant Hub — Design Spec

**Date:** 2026-05-20
**Status:** Approved (Q1–Q5), pending user review of written spec
**Author:** Claude (brainstorming session with William Griffith)
**Source frame:** [docs/brainstorming/2026-05-04-million-dollar-roadmap.md](../../brainstorming/2026-05-04-million-dollar-roadmap.md) — tool #1 of the 3-tool traveler-utility roadmap.

## 1. Overview

A per-restaurant deep page at `/local/restaurants/[business-slug]` that turns Hilton Ahead's existing 11-restaurant directory into a **single-source-of-truth utility** travelers return to multiple times per trip. Each page links out to the canonical menu (founder's editorial pick) + all available reservation platforms, surfaces founder review + "what to order" picks + a hybrid photo gallery, and instruments **10 distinct tracked outbound events** that feed the heat-map data product and per-business attribution reporting.

The page is also **page-level ad inventory**: one Featured-Partner badge (already wired) + one sponsor slot below the gallery (new) sold to non-Featured competitors who want exposure on this restaurant's page.

## 2. Goal & success metrics

**Primary goal — traveler value:** be the page a Hilton Head visitor bookmarks and returns to 3+ times per trip when deciding where to eat.

**Secondary goal — monetization data:** generate the per-business click attribution that lets the directory paid tier sell at $99–499/mo with proof, not promises.

**Success metrics (90 days post-launch):**
- ≥ 60% of pages have 2+ tracked events per visitor session
- ≥ 25% click-through rate on menu links
- ≥ 8% click-through rate on reservations links (≥ one platform)
- Directory paid-tier signups: +5 in first 90 days, driven specifically by per-page click attribution reports
- Sponsor slot fill rate: ≥ 30% of available slots by day 90

**Anti-goal:** do not let the page feel like a Yelp clone. Editorial voice is non-negotiable.

## 3. Scope

### In scope (v1)
- New route `app/local/restaurants/[slug]/page.tsx` (per-restaurant deep page)
- `Business` type extensions: `menuUrl`, `menuSourceNote`, `reservationsLinks[]`, `whatToOrder[]`, `signatureDish`, `dietaryTags`, `relatedFounderPicks[]`, `sponsorSlot`, `faqs[]`
- Tracked outbound link components (extends `TrackedWebsiteLink`/`TrackedPhoneLink` pattern):
  - `TrackedMenuLink`, `TrackedReservationsLink`, `TrackedDirectionsLink`, `TrackedShareButton`
- Photo gallery component (founder + owner-submitted, founder-approved)
- Related restaurants algorithm — founder-curated 1–2 + algorithmic fallback (neighborhood → category)
- AI-drafted FAQ pipeline + founder approval workflow
- New `directory_events.event_type` values (10 total covered in §7) — migration `014_directory_events_payload_and_events.sql` drops + recreates the existing CHECK constraint to widen the allowed values AND adds a new `payload jsonb` column for per-event detail
- Sponsor-slot data model + render
- Sitemap entries for all per-restaurant pages
- JSON-LD Restaurant schema per page (richer than current industry-level page)
- Playwright tests — happy path, related-restaurants logic, tracking event firing, a11y
- Owner-submitted-photo intake flow via existing business portal (extends portal Phase 0/1)

### Out of scope (v1, deferred)
- Live wait-time / live availability scraping — `Today on Hilton Head` dashboard handles per-day signal; per-restaurant live data is v1.1
- User-submitted reviews / ratings (wrong fit — editorial expert site)
- Per-restaurant booking transactions on-site (links out only)
- Other industries beyond restaurants — pattern generalizes, but ships restaurants first
- Heat-map visualization on the restaurant page — heat map is its own tool (#3 in roadmap)
- Owner login / claim-business flow refinements beyond what portal already does
- A/B test of sponsor-slot placement — capture baseline first, then test
- Localization

### Explicit non-goals
- Do not scrape menus. Link out only. Legal + maintenance cliff.
- Do not invent facts about restaurants. Founder voice or owner-confirmed only; `lastVerified` date shown publicly as the trust signal.
- Do not show ratings out of 5 — editorial voice does the work; numeric ratings dilute it.
- Do not host or cache Google Places photos (TOS).

## 4. UX flow & page layout

URL: `/local/restaurants/[business-slug]` — `business-slug` = `Business.id` for that restaurant.

### Page sections (top to bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│ <Header />  (existing)                                                │
├──────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Local → Restaurants → [Name]                              │
├──────────────────────────────────────────────────────────────────────┤
│ HERO                                                                  │
│  Eyebrow: "Restaurants"  + Featured-Partner badge (if business.featured)│
│  Display H1 — italic accent: "[Name] — [tagline.]"                    │
│  Price range • Cuisine chips • Last verified <relative date>          │
│  [Hero image]                                                         │
├──────────────────────────────────────────────────────────────────────┤
│ CTAs BAR (sticky on mobile)                                           │
│  [View menu →]  [Reserve: Resy | OpenTable | Direct]  [Call] [Map]    │
├──────────────────────────────────────────────────────────────────────┤
│ FOUNDER REVIEW  (existing Business.review)                            │
│  2–3 sentence editorial review                                        │
├──────────────────────────────────────────────────────────────────────┤
│ WHAT TO ORDER                                                         │
│  3–5 dishes with one-line founder note each                           │
│  Signature dish callout (italic block)                                │
├──────────────────────────────────────────────────────────────────────┤
│ MENU LINK BLOCK                                                       │
│  [View menu →]  ← tracked                                              │
│  Editorial note: "We link to their PDF — Yelp menu is six months old."│
├──────────────────────────────────────────────────────────────────────┤
│ PHOTO GALLERY                                                         │
│  3–5 photos, lightbox on click — tracked as photo_view                │
│  Credit line per photo                                                │
├──────────────────────────────────────────────────────────────────────┤
│ SPONSOR SLOT  (only renders if business.sponsorSlot != null)          │
│  "Sponsored by [advertiser name]" — small, italicized, palette-muted  │
│  Link to advertiser page or affiliate URL, tracked                    │
├──────────────────────────────────────────────────────────────────────┤
│ PRACTICAL DETAILS                                                     │
│  Address (clickable → directions)  |  Phone  |  Hours                 │
│  Dietary tags · Dress code · Kid-friendliness · Pet-friendly         │
│  Reservations: lead-time guidance (peak / off-peak)                   │
├──────────────────────────────────────────────────────────────────────┤
│ FAQ                                                                   │
│  3–5 Qs — AI-drafted from review + founder-approved                   │
├──────────────────────────────────────────────────────────────────────┤
│ RELATED RESTAURANTS                                                   │
│  "Eat here next" — 3 cards                                            │
│  Founder-picked first; algorithmic fallback by neighborhood → category│
├──────────────────────────────────────────────────────────────────────┤
│ SHARE                                                                 │
│  Native share button (Web Share API) — tracked                        │
├──────────────────────────────────────────────────────────────────────┤
│ <FinalCta /> (existing) + <Footer /> (existing)                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile sticky CTA bar

Below 768px viewport, the CTAs bar pins to bottom: `[Menu] [Reserve ▾] [Call] [Map]`. Reserve opens a sheet listing available platforms. Always tap-target ≥ 44×44px.

## 5. Data model

### Extensions to `Business` type (`data/localBusinesses.ts`)

```ts
export type ReservationsLink = {
  platform: 'resy' | 'opentable' | 'direct' | 'tock' | 'sevenrooms' | 'yelp';
  url: string;
  /** Optional label override; defaults to a human-readable platform name. */
  label?: string;
};

export type FounderRelatedPick = {
  /** id of another Business in the same industry. */
  businessId: string;
  /** One-sentence note on why they pair well. */
  note: string;
};

export type WhatToOrderItem = {
  dish: string;
  note: string;        // one-line founder annotation
  /** Marks the single signature dish; shows in the signature callout block. */
  signature?: boolean;
};

export type SponsorSlot = {
  /** Display name on the badge */
  advertiserName: string;
  /** Outbound URL — affiliate-stamped if applicable */
  url: string;
  /** 1–2 line copy */
  copy: string;
  /** Optional small logo */
  logo?: { src: string; alt: string };
  /** ISO date — when this sponsor slot expires */
  endsAt?: string;
  /** Internal accounting id for billing/reporting */
  invoiceRef?: string;
};

export type RestaurantFaq = {
  question: string;
  answer: string;
  /** Marks AI-drafted entries the founder has reviewed/approved. */
  approved: boolean;
};

// Add to Business type:
export type Business = {
  // ... existing fields unchanged
  /** Restaurant Hub — link to the canonical menu URL (founder's editorial pick). */
  menuUrl?: string;
  /** One-line editorial note on WHY this menu source. Renders next to the link. */
  menuSourceNote?: string;
  /** All available reservation platforms; multi-shown when more than one. */
  reservationsLinks?: ReservationsLink[];
  /** Founder picks 3–5 dishes; one may be marked signature. */
  whatToOrder?: WhatToOrderItem[];
  /** Founder-curated related-restaurant picks; algorithm fills the gap to 3. */
  relatedFounderPicks?: FounderRelatedPick[];
  /** Page-level ad inventory; null = no sponsor slot rendered. */
  sponsorSlot?: SponsorSlot | null;
  /** Restaurant FAQ entries (3–5). */
  faqs?: RestaurantFaq[];
  /** Photos beyond hero — 3–5 gallery shots. */
  galleryPhotos?: Array<{
    src: string;
    alt: string;
    credit?: string;
    /** owner-submitted vs founder-shot, for editorial discipline. */
    source: 'founder' | 'owner-submitted';
    /** Founder-approved before publish */
    approved: boolean;
  }>;
};
```

### Migration impact

No new tables. Two existing tables extended:

- `directory_events.event_type` enum: 7 new values added (see §7)
- No DB schema change for `Business` data — `data/localBusinesses.ts` is a TS module, not a DB row. The 11 restaurants get populated by the founder during build.

### Sponsor-slot persistence (v1)

For v1, `Business.sponsorSlot` is set in `data/localBusinesses.ts` directly. The user (founder) updates the file when a sponsor sells, deploys, sponsor goes live. Lightweight + git-versioned.

v1.1 will move sponsor slot data to a `restaurant_sponsor_slots` Supabase table + admin form for self-service updates without a redeploy. **Deferred.**

## 6. Routing & SEO

- Route: `app/local/restaurants/[slug]/page.tsx`
- Slug = `Business.id` (already URL-safe)
- Sitemap entry per restaurant added to `app/sitemap.ts`
- `next.config.ts` `remotePatterns` already covers Unsplash + Pexels; owner-submitted photo storage (Supabase Storage) needs to be added if owner-submitted photos use external host — verify during build.

### Per-page metadata

- `title`: `${name} — Hilton Head ${cuisine} • Hilton Ahead`
- `description`: `Business.notableFor` + neighborhood callout (~155 chars max)
- `keywords`: derived from `business.categories`, `business.cuisine`, `business.address` city
- Canonical URL: `${siteUrl}/local/restaurants/${slug}`
- OpenGraph image: `business.heroImage.src`
- JSON-LD: `Restaurant` schema with `priceRange`, `address`, `telephone`, `openingHoursSpecification`, `servesCuisine`, `acceptsReservations`, `menu` (links to `menuUrl`)

## 7. Tracking events

Add 7 new values to `directory_events.event_type` enum + 3 cross-system event types. The route `/api/directory/track` validation set updated accordingly.

### New event types (per-restaurant page only)

| Event | When fires | Payload notes |
|---|---|---|
| `menu_click` | User clicks the canonical menu link | businessId + url |
| `reservations_click` | User clicks any reservations platform link | businessId + platform |
| `directions_click` | User clicks address (→ Google Maps) | businessId |
| `photo_view` | User opens lightbox / clicks a gallery photo | businessId + photoIndex |
| `share_click` | User clicks share button (Web Share API) | businessId |
| `sponsor_slot_click` | User clicks sponsor slot CTA | businessId + advertiserName |
| `related_click` | User clicks a related-restaurant card | businessId (source) + relatedBusinessId |

### Revenue-attribution events (cross-system)

These fire when a Restaurant Hub click feeds into Villa Match / Trip Sketch / itinerary form, attributing downstream revenue back to the restaurant:

| Event | When fires | Payload notes |
|---|---|---|
| `saved_to_trip_sketch` | Trip Sketch saves a restaurant card → emails PDF | businessId (mapped from the saved sketch) |
| `added_to_itinerary` | Itinerary form submission references a restaurant via `prefill` or freeform notes | businessId + itinerary_request id |
| `sent_in_pdf_takeaway` | Villa Match PDF takeaway includes a restaurant recommendation block | businessId |

### Schema compatibility

`directory_events` already has `business_id`, `industry_slug`, `event_type`, `ip_hash`, `user_agent`, `referrer`, `created_at`. Two changes needed via migration `014_directory_events_payload_and_events.sql`:

1. Add `payload jsonb` column (nullable) for per-event details (platform, photoIndex, related_business_id, advertiser_name, etc.).
2. Drop the existing `event_type` CHECK constraint and recreate it with the widened allowed-values set (existing 3 + new 7 = 10 total page events; the 3 cross-system attribution events are written by the Villa Match / Trip Sketch / itinerary pipelines, not by /api/directory/track, so they live in a separate `directory_event_type` set inside those routes — verify final wiring during build).

Also update the API route's `VALID_EVENT_TYPES` Set in `app/api/directory/track/route.ts` to match.

### Existing events still used

`phone_click`, `website_click`, `inquiry_submit` — already wired. No change.

## 8. Related-restaurants algorithm

Always returns exactly **3** related cards.

```
1. Take Business.relatedFounderPicks[] up to 2 entries.
2. If <3 picks, fill remaining slots by:
   a) Same neighborhood (haversine distance < 2 miles from business lat/long), random pick
   b) If <3 still, same category/cuisine (any neighborhood)
   c) If <3 still, any restaurant in the industry except self
3. Dedupe — never include the current restaurant.
4. Always show 3, even if it means digging into 'any restaurant'.
```

Algorithm is pure function — colocated with the page component. No client-side compute (server-rendered).

## 9. FAQ — AI-drafted + founder-approved

### Generation pipeline (one-time per restaurant during onboarding)

1. Run a script (e.g., `scripts/draft-restaurant-faqs.ts`) per business that prompts an LLM (Claude API or similar) with: `Business.review`, `Business.notableFor`, `address`, `hours`, `priceRange`, `dietaryTags`, `dressCode`, `kid-friendly`, `pet-friendly`, `reservationsLinks[].platform`.
2. LLM returns 5 candidate Q&A pairs in a strict JSON schema.
3. Output written to a draft file (`data/restaurant-faq-drafts/${slug}.json`).
4. Founder edits + sets `approved: true` per entry.
5. Approved entries merged into `Business.faqs[]` in `data/localBusinesses.ts`.

### Runtime

Page renders ONLY entries where `approved === true`. Drafts never leak to production.

### Cost & ops

11 restaurants × 5 Qs each × ~$0.01 per generation = ~$0.55 one-time. Future re-runs (when hours/menus change) negligible.

## 10. Sponsor-slot inventory mechanic

- Sold per-page, per-month
- Currently `Business.sponsorSlot` is a single slot per restaurant (1× sponsor allowed at any time)
- Sponsor "ends at" via `SponsorSlot.endsAt` ISO date — page conditionally renders slot only when `now < endsAt` (or `endsAt` is undefined for evergreen sponsors)
- Tracking: `sponsor_slot_click` event fires on click, linkable back to invoice via `invoiceRef`
- v1.1: admin dashboard at `/admin/sponsor-slots` listing all slots, expiring soon, fill rate per page, revenue per sponsor. **Deferred — data captured day one.**

### Pricing guidance (not committed in code — for the user's sales motion)

- Featured-Partner (existing `featured: true`) — earned via directory paid tier, separate billing
- Sponsor slot on a top-traffic restaurant page — sell at $99–249/mo depending on the host page's organic traffic
- Sponsor slot on a midtier page — $49–99/mo
- All slot revenue is incremental to directory subscription

## 11. Photo gallery — submission + approval flow

### Founder-submitted

Drop photos in `public/local/restaurants/${slug}/` and reference in `Business.galleryPhotos[]` with `source: 'founder'`, `approved: true`.

### Owner-submitted (extends existing business portal)

- Owner logs into business portal (existing route from `dca6721 feat(portal): business owner portal Phase 0/1`)
- New page in portal: "Photos" tab per owned business
- Upload form → uploads to Supabase Storage bucket `restaurant-photos` (private bucket)
- Entry inserted as `approved: false`, `source: 'owner-submitted'`
- Admin page `/admin/directory/photos-review` lists pending — founder approves/rejects
- Approved photos get a public Supabase Storage URL stamped into `data/localBusinesses.ts` via a small commit (manual or scripted via admin tool)

### Storage cost

11 restaurants × 5 photos × ~400KB = ~22MB. Free tier of Supabase Storage covers 1GB.

## 12. Performance budgets

- LCP on `/local/restaurants/[slug]` ≤ 2.0s on 4G
- Per-page bundle ≤ 25 KB gzipped (no client-side JS beyond Web Share API + photo lightbox + tracking helpers — most of the page is server components)
- Hero + gallery photos: `next/image` with appropriate `sizes`; gallery photos lazy-load below the fold
- Web Share API tested for graceful fallback (no-op + show copy-link button when unavailable)

## 13. Accessibility (WCAG AA)

- All tap targets ≥ 44×44px (especially mobile sticky CTA bar)
- Photo gallery lightbox: focus trap, Esc to close, arrow keys to navigate, `aria-label` on each photo
- Sponsor slot uses `aria-label="Sponsored content"` and visible "Sponsored by" text — both readable, both flag the relationship
- Color contrast: all palette token combos used must hit AA; verify sponsor-slot copy on its bg color during build
- Reservation platform sheet on mobile uses proper `<dialog>` semantics
- `axe-core` scan must pass on a sample of 3 restaurant pages (one per density: small/medium/large content)

## 14. Testing

Per `CLAUDE.md`, Playwright is the only test surface.

- `tests/restaurant-hub-happy.spec.ts` — load a known restaurant page, assert all sections render, click menu link, click a reservations platform, assert tracked events fire (intercept `/api/directory/track` and assert payload)
- `tests/restaurant-hub-related.spec.ts` — assert exactly 3 related-restaurants shown, never includes self, founder picks come first when present
- `tests/restaurant-hub-sponsor.spec.ts` — page with sponsor slot renders + click tracked; page without sponsor slot does not render the section
- `tests/restaurant-hub-a11y.spec.ts` — `axe-core` scan on 3 sample pages
- `tests/restaurant-hub-photos.spec.ts` — gallery opens, navigates, closes; `photo_view` event fires per open

## 15. Operations

- Photo storage: Supabase Storage bucket `restaurant-photos` (create during build)
- LLM cost for FAQ generation: negligible (~$0.55 total)
- No new env vars required beyond existing Supabase + Resend keys
- Sitemap regeneration on deploy (handled by Next.js automatically via `app/sitemap.ts`)

## 16. Open questions / future work

- **Live wait-time integration** — Yelp Fusion has it but is paid + rate-limited. Defer until `Today on Hilton Head` ships and we know the API budget.
- **Owner self-service sponsor-slot purchase** — v1.1; for now, sponsors are sold via founder outreach and stamped into the data file.
- **Per-page A/B test of sponsor-slot position** — capture baseline first.
- **Restaurant generalizes to other industries** — pattern works for golf, spas, charters. Roll out as part of Workstream B directory build-out after restaurants prove the model.
- **Owner-submitted photo SLA** — define max turnaround for founder approval (probably 48h) and surface that in the portal.
- **AI FAQ refresh cadence** — quarterly re-draft when hours/menus change? Or on-demand from founder?

## 17. Monetization narrative (for the Q&A session after this ships)

This page is the production-ready inventory for **three revenue streams**:

1. **Directory paid tier** — businesses pay $99–499/mo for Featured status + the attribution dashboard that aggregates events from THIS page (and across all directory pages).
2. **Sponsor slots** — $49–249/mo per slot on a non-Featured page. Sold to competitors who want exposure on a top-restaurant page.
3. **Affiliate revenue** — reservation platform links can be wrapped with affiliate IDs where programs exist:
   - **OpenTable** has an Affiliate Network program (via Impact Radius); restaurant page revshare. Verify eligibility for travel-content site during build.
   - **Resy** does not run a public affiliate program at time of writing; placeholder for future direct partnership.
   - **Yelp** has limited affiliate options via Reservations API — unlikely fit.
   - Reservation affiliate revenue is incremental — do not plan against it for v1 monetization narrative; treat as upside once Featured + Sponsor inventory is selling.

The data captured (10 tracked event types per page × 11 restaurants × growing traffic) becomes the heat-map foundation in tool #3 and the attribution proof email that drives directory retention.

---

## Self-review checklist (run before user review gate)

Inline self-review will happen after this draft is committed. Specific items to check:

1. **Placeholder scan** — any TBD / TODO blocks
2. **Internal consistency** — does the data model in §5 match the events in §7 match the metadata in §6
3. **Scope check** — does this fit one implementation plan? Yes (~25–30 tasks expected).
4. **Ambiguity check** — could "founder picks 1–2 related + algorithmic fallback" be misread? It's spelled out in §8.
5. **Legal compliance** — explicit non-goals around scraping and Google Places photos handled in §3.
