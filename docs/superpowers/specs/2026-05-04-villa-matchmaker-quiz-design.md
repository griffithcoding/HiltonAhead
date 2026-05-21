# Villa Matchmaker Quiz — Design Spec

**Date:** 2026-05-04
**Status:** Approved (sections 1–7), pending user review of written spec
**Author:** Claude (brainstorming session with William Griffith)
**Source survey:** [docs/brainstorming/2026-05-04-travel-features-survey.md](../../brainstorming/2026-05-04-travel-features-survey.md)

## 1. Overview

A 5-question interactive quiz at `/villa-match` that returns a ranked top-3 of *stay archetypes* (e.g., "4BR oceanfront in Palmetto Dunes") matched to the user's trip type, party size, view priority, walk-to-beach need, and budget band. Each match surfaces founder-voice reasoning, a representative shortlist of building names from `data/neighborhoods.ts`, and an honest tradeoff. Soft email capture via an optional one-page PDF takeaway. Conversion CTA hands users into the existing `/itinerary` form pre-filled with the match.

## 2. Goal & success metrics

**Primary goal:** convert browsers into qualified `/itinerary` form leads.

**Success metrics (90-day):**
- Quiz completion rate (start → step 5 finish) ≥ 60%
- Quiz-completer → `/itinerary` form submit ≥ 18%
- Quiz-completer → PDF email capture ≥ 25%
- Quiz contributes ≥ 15% of total `/itinerary` form submissions

**Anti-goal:** do not chase email capture at the cost of trust. Soft gate only.

## 3. Scope

### In scope (v1)
- Standalone page `/villa-match`
- Embedded entry-card component on high-intent surfaces (homepage, oceanfront-villas page, Harbour Town page, neighborhood pages, trip-type pages, footer)
- Server-side telemetry table (`villa_match_events`)
- Server-side lead capture table (`villa_match_leads`)
- One-page PDF generation via `@react-pdf/renderer`, sent via Resend
- GA4 event instrumentation
- Playwright happy-path + scoring + edge-case + a11y tests

### Out of scope (v1, deferred)
- `/admin/villa-match` analytics dashboard — data captured day one; dashboard in a follow-up phase
- A/B test of email-gate timing — capture data first
- Adaptive scoring (per-trip-type branching) — revisit after 3 months of real submissions
- Pet-friendly toggle — v1.1 if requested
- Internationalization

### Explicit non-goals
- No real-time inventory, prices, or availability (William has no formal villa inventory)
- No "partner rate" claims anywhere in copy or PDF (he doesn't have them)
- No booking transactions on this surface

## 4. UX flow

### Page hero (`/villa-match`)

> **№ 01 · Villa Match**
> Find your *Hilton Head stay.*
>
> Five questions. We'll match you to the kind of villa your trip actually wants — neighborhood, view, walking distance to the beach, all of it. No prices, no fake availability. Real picks.

### Quiz steps

| # | Question | Input kind | Options |
|---|---|---|---|
| Q1 | What kind of trip is this? | radio-grid | A trip for two · Family vacation · Golf trip · Wedding or group · Friends getaway |
| Q2 | How many of you? | number stepper (2–30) | "{N} guests" |
| Q3 | What does the view need to do? | radio-grid | Ocean — water from the kitchen · Marsh or lagoon — quiet wins · Golf course — fairway view is the postcard · No strong preference — surprise me |
| Q4 | How important is walking to the beach? | radio | Must — sand under feet in three minutes · Nice — a 10-min walk is fine · We'll drive |
| Q5 | What's the budget for the whole trip? | radio | Value <$5k · Mid $5k–$15k · Premium $15k–$30k · Luxury $30k+ |

**Q5 subhead:** *"The villa fee is most of your trip. We don't optimize for upselling — pick the band that's real."*

### Results layout

- **Top pick (large card):** eyebrow "Your best match" · plain "We'd put you in" · italic "{archetype headline}." · 2–3 sentence why-it-fits · 2–3 representative property names from `neighborhoods[i].properties[]` · 1-sentence honest tradeoff
- **Alternatives (2 small cards):** eyebrow "Or, depending on the week" · headline · neighborhood · one-sentence pitch
- **CTAs (results page):**
  - Primary filled: **Start checking dates →** `/itinerary?prefill=<encoded>`
  - Secondary outlined: **Email me a one-page PDF** → opens `PdfTakeawayDialog`
  - Tertiary link: **Or book a 30-min call →** `brand.calendlyUrl`

### Empty / edge state (rare — 0 matches)

> *Your trip doesn't fit a template — and that's actually a good sign.*
> Tell us a bit more, and we'll build it from scratch.
> [CTA] **Start the itinerary →**

### PDF dialog

> **We'll send the picks.**
> One page. Your three matches, the buildings we'd shortlist, and a couple of dates to consider. No drip campaign, no spam.
>
> [email input]
> [submit] **Send me the PDF**

## 5. Data model

### `QuizAnswers`

```ts
type QuizAnswers = {
  tripType: 'couples' | 'family' | 'golf' | 'wedding' | 'friends';
  partySize: number; // 2–30
  view: 'ocean' | 'marsh' | 'golf' | 'no-preference';
  walkToBeach: 'must' | 'nice' | 'fine-to-drive';
  budget: 'value' | 'mid' | 'premium' | 'luxury';
};
```

### `data/matchArchetypes.ts` (new file)

```ts
type MatchArchetype = {
  id: string;                          // 'palmetto-dunes-oceanfront-family-4br'
  neighborhoodSlug: string;            // joins to data/neighborhoods.ts
  headline: string;                    // "4BR oceanfront in Palmetto Dunes"
  bedrooms: { min: number; max: number };
  view: 'ocean' | 'marsh' | 'golf' | 'mixed';
  walkToBeach: 'steps' | 'short-walk' | 'drive';
  budgetBand: 'value' | 'mid' | 'premium' | 'luxury';
  bestForTripTypes: TripType[];
  whyItFits: string;                   // founder-voice, 2–3 sentences
  whatToWatchOut: string;              // honest tradeoff, 1 sentence
  propertyNameFilters?: string[];      // pulls from neighborhoods[i].properties[].name
};
```

**v1 archetype coverage (~14):**
- Couples 1BR/2BR · Sea Pines, Palmetto Dunes, Forest Beach
- Family 3BR/4BR walk-to-beach · Sea Pines, Palmetto Dunes
- Family 4BR/5BR drive-to-beach · Forest Beach, Shipyard
- Golf 3BR on-course · Sea Pines, Palmetto Dunes
- Wedding 7BR oceanfront estate
- Value-couples marsh-view · Bluffton, off-island
- Luxury oceanfront 4–5BR
- (Final list of 14 confirmed during build)

## 6. Scoring algorithm

Pure function, ~30 lines, runs client-side.

```
score = tripType  × 0.30
      + budget    × 0.25
      + walk      × 0.20
      + view      × 0.15
      + party     × 0.10
```

**Per-dimension scoring (all return 0..1):**
- `tripType`: 1.0 if archetype lists user's tripType in `bestForTripTypes`; else 0.3
- `budget`: 1.0 exact band match; 0.5 if 1 band off; **0 (disqualifying floor)** if more than 1 band off
- `walk`: 1.0 exact; 0.7 partial fit (e.g., user said "must walk" + archetype is "short-walk"); 0.3 mismatch
- `view`: 1.0 exact; 0.7 if user picked "no-preference"; 0.3 mismatch
- `party`: 1.0 if `partySize ∈ [bedrooms.min × 1.5, bedrooms.max × 2]`; 0.5 otherwise

**Hard floor:** budget more than 1 band off the archetype → score = 0 → disqualified.

**Output:** archetypes sorted by score descending; ties broken by `id` ascending (deterministic). Top 3 returned. If fewer than 3 valid, show what we have. If 0 valid, render the empty/edge state.

## 7. Architecture

```
User on /villa-match  ── or ── entry card on /, /hilton-head/[slug], /hilton-head-oceanfront-villas, …
     │
     ▼
<VillaMatchQuiz/>  (client component, 5 steps, local state)
     │  ├─► POST /api/villa-match/events  (fire-and-forget per step)
     │
     ▼  on Q5 submit
Pure scoring fn (client-side):
   answers × matchArchetypes  →  top 3
   joins to neighborhoods.ts → properties[] + photos
     │
     ▼
<MatchResults/>  top 1 (large) + #2 #3 (alternatives)
   ├─► CTA "Email me a one-page PDF"  → POST /api/villa-match/pdf
   │       (server: render PDF → Resend → insert villa_match_leads)
   ├─► CTA "Start checking dates"     → /itinerary?prefill=<encoded-match>
   └─► Tertiary "Book a 30-min call"  → brand.calendlyUrl
```

### File inventory

**New:**
- `app/villa-match/page.tsx` — server component shell, metadata, breadcrumb JSON-LD
- `components/villa-match/VillaMatchQuiz.tsx`
- `components/villa-match/QuizStep.tsx`
- `components/villa-match/QuizProgress.tsx`
- `components/villa-match/MatchResults.tsx`
- `components/villa-match/MatchResultCard.tsx`
- `components/villa-match/PdfTakeawayDialog.tsx`
- `components/villa-match/VillaMatchEntryCard.tsx`
- `components/villa-match/scoring.ts` — pure function + types
- `data/matchArchetypes.ts`
- `app/api/villa-match/events/route.ts`
- `app/api/villa-match/pdf/route.ts`
- `app/lib/villa-match-pdf.tsx` — `@react-pdf/renderer` template
- `supabase/migrations/013_villa_match.sql`
- `tests/villa-match-happy.spec.ts`
- `tests/villa-match-scoring.spec.ts`
- `tests/villa-match-edge-cases.spec.ts`
- `tests/villa-match-a11y.spec.ts`

**Modified:**
- `data/nav.ts` — add Villa Match entry
- `data/footerLinks.ts` — add Villa Match under "Explore" or new "Tools" column (final placement decided during build)
- High-intent surface pages — add `<VillaMatchEntryCard/>`:
  - `app/page.tsx` — `feature` variant, slotted between hero and Trip Calculator section
  - `app/hilton-head-oceanfront-villas/page.tsx` — `standard` variant, near top-of-fold
  - `app/harbour-town-villas/page.tsx` — `standard` variant, near top-of-fold
  - `app/hilton-head/[slug]/page.tsx` — `compact` variant, inline above the existing `properties[]` section (scoped to slugs: `sea-pines`, `palmetto-dunes`, `forest-beach`, `shipyard`)
  - `app/trip-types/[slug]/page.tsx` (or wherever trip-type pages render) — `standard` variant for slugs: `family`, `couples`, `golf`
- `package.json` — add `@react-pdf/renderer` dependency

## 8. API contracts

### `POST /api/villa-match/events`

```
Request body: {
  sessionId: string,        // client-generated UUID, persists across steps
  eventType: 'start' | 'step_complete' | 'complete' | 'pdf_requested',
  step?: number,            // 1–5 for step_complete
  answers?: Partial<QuizAnswers>
}
Response: 204 No Content (always — never block UX)
Server: SHA-256 hashes req IP, captures UA + referrer, inserts row into villa_match_events
```

### `POST /api/villa-match/pdf`

```
Request body: {
  sessionId: string,
  email: string,
  answers: QuizAnswers,
  topMatchIds: string[]     // 1–3 archetype ids
  hp_url?: string           // honeypot — non-empty = silent 200, no-op
}
Response 200: { ok: true }
Response 400: { error: 'invalid_email' | 'invalid_payload' }
Response 429: { error: 'rate_limited', retryAfterSec: number }
Response 500: { error: 'send_failed' }
Server pipeline:
  1. honeypot check (hp_url non-empty → silent 200, no-op)
  2. validate email (regex + disposable-domain check via app/lib/villa-match/disposable-domains.ts)
  3. rate-limit (in-memory Map: 3 / ip_hash / hour)
  4. render one-page PDF via @react-pdf/renderer
  5. send via Resend (from RESEND_FROM_EMAIL to user's email)
  6. insert villa_match_leads row (with pdf_sent_at = now())
```

**PDF layout (one page, US Letter):**
- Header: HiltonAhead wordmark + "Your Villa Match" title
- Hero block: top-pick headline (italic accent), 2–3 sentence why-it-fits in founder voice
- Properties block: 2–3 representative building names with one-line notes
- Tradeoff block: honest "what to watch out for" sentence
- Alternates strip: #2 and #3 archetypes — single line each (headline · neighborhood)
- Footer: founder photo (small), email (`brand.contactEmail`), Calendly link (`brand.calendlyUrl`), site URL
- Brand palette tokens via `data/brand.ts` (no raw hex in PDF JSX)

## 9. Database schema (migration `013_villa_match.sql`)

```sql
create table villa_match_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  event_type  text not null check (event_type in ('start','step_complete','complete','pdf_requested')),
  step        smallint,
  answers     jsonb,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  created_at  timestamptz default now()
);
create index on villa_match_events (session_id);
create index on villa_match_events (created_at desc);

-- citext extension assumed enabled by an earlier migration (used by admin_users).
-- If a build-time check shows it's not, prepend: create extension if not exists citext;

create table villa_match_leads (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null,
  email         citext not null,
  answers       jsonb not null,
  top_match_ids text[] not null,
  pdf_sent_at   timestamptz,
  ip_hash       text,
  user_agent    text,
  referrer      text,
  created_at    timestamptz default now()
);
create index on villa_match_leads (email);
create index on villa_match_leads (created_at desc);

alter table villa_match_events enable row level security;
alter table villa_match_leads  enable row level security;

-- anon-insert via API only (service-role bypasses RLS for the writes)
-- admin read via is_admin() helper from migration 003

create policy "admin read events" on villa_match_events for select using (is_admin());
create policy "admin read leads"  on villa_match_leads  for select using (is_admin());
```

## 10. Entry-card component

```tsx
<VillaMatchEntryCard
  variant="compact" | "standard" | "feature"
  source={string}             // page slug — feeds funnel analytics via ?source=
  ctaText?: string            // override default
/>
```

| Variant | Use-case | Layout |
|---|---|---|
| `compact` | Inline strip on neighborhood pages near existing properties section | One row: eyebrow + 1-line headline + arrow CTA. ~80px tall. |
| `standard` | Section block on `/hilton-head-oceanfront-villas`, `/harbour-town-villas`, trip-type pages | Eyebrow + display headline + 2-line body + filled CTA. ~240px tall. |
| `feature` | Homepage hero or "tools" section | Full-bleed editorial: ornament number, eyebrow, plain + italic headline, body, photo, filled CTA + tertiary link. |

All variants:
- Route to `/villa-match?source={slug}` for funnel attribution
- Use `SectionHead` + `Divider` ornament conventions on `feature`
- Palette tokens only — no raw hex
- `compact` and `standard` render as **server components** (zero JS); `feature` is interactive

**Default copy (overridable via props):**
- Eyebrow: *Villa Match*
- Headline: *Find your Hilton Head stay in five questions.*
- Body: *We'll match you to the kind of villa your trip actually wants. No prices, no fake availability.*
- CTA: *Start the match →*

## 11. Error handling

| Surface | Failure mode | Behavior |
|---|---|---|
| Quiz step validation | Empty/invalid input | "Next" disabled until valid; inline message |
| `/api/villa-match/events` | Network fail | Silent (telemetry never blocks UX) |
| `/api/villa-match/pdf` | Bad email | 400 + inline error in dialog |
| Same | Rate-limited | 429 + friendly: *"Already sent — check your inbox or refresh the page"* |
| Same | Resend / DB throws | 500 + retryable message; CTA falls back to *"Email us directly →"* (`brand.contactEmail`) |
| Scoring returns 0 matches | Edge state | Empathy state → `/itinerary` |

## 12. Accessibility (WCAG AA)

- Radio groups: `role="radiogroup"` + arrow-key nav
- Step transitions announced via `aria-live="polite"`
- Focus management: first option gets focus on each step; first CTA on results
- Tab/Shift-Tab traversal complete; Enter to select; Esc returns to previous step
- All palette token combos used must hit AA contrast (audit `coral` on `sand-soft` — historically marginal)
- `prefers-reduced-motion` → all transitions disabled
- Number stepper has explicit `+`/`–` buttons (not just slider) for keyboard + screen reader
- `axe-core` scan must pass on each step + results

## 13. Testing

Per `CLAUDE.md`, no unit-test runner is configured — Playwright is the testing surface.

- `tests/villa-match-happy.spec.ts` — full happy path: enter quiz → answer 5 → results render → open PDF dialog → mock API → assert success state
- `tests/villa-match-scoring.spec.ts` — drive 5–6 known input combos through the UI; assert top-match headline. Treats scoring as a black-box contract.
- `tests/villa-match-edge-cases.spec.ts` — 0-match empathy state, network errors on PDF, validation errors
- `tests/villa-match-a11y.spec.ts` — `axe-core` on each step + results
- Browsers: chromium + webkit (firefox nice-to-have)

## 14. Analytics (GA4 events)

Already wired in the analytics helper per recent commit `2ab3c7f` (verify exact path during build — likely `app/lib/analytics.ts`). New events:

| Event | When | Params |
|---|---|---|
| `villa_match_started` | First step renders | `source` (page slug if entered via entry card) |
| `villa_match_step_completed` | User clicks Next | `step_number`, `field_id` |
| `villa_match_completed` | All 5 answered, results render | `top_match_id` |
| `villa_match_pdf_requested` | User opens PDF dialog | — |
| `villa_match_pdf_sent` | Server confirms Resend success | — |
| `villa_match_to_form` | User clicks "Start checking dates" | `top_match_id` |
| `villa_match_to_calendly` | User clicks "Book 30-min call" | — |

The `villa_match_events` Supabase table is the source of truth for funnel analytics — independent of GA4.

## 15. Performance budgets

- Quiz client-component bundle ≤ 30 KB gzipped
- LCP on `/villa-match` ≤ 2.0s on 4G
- `compact` and `standard` entry-card variants render as server components (zero client JS)
- PDF generation is server-side only — no client lib bloat
- Step transitions CSS-only (no framer-motion unless already in stack)

## 16. Operations

- Resend env already set per `CLAUDE.md`: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
- Rate-limit on `/api/villa-match/pdf`: in-memory Map keyed on `ip_hash` (3 / hour). Per-instance leak acceptable for v1; upgrade to Vercel KV if abuse appears.
- Disposable-email blocklist lives at `app/lib/villa-match/disposable-domains.ts` — ~30 top domains inline; no new dep.
- Migration `013_villa_match.sql` to be applied via Supabase CLI before deploy.

## 17. Open questions / future work

- **Budget bands calibration** — Approved as listed. Revisit if 90-day data shows lopsided distribution (e.g., 80% pick "Mid").
- **"Surprise me" view option** — Approved. Consider replacing with photo-pick UI in v1.1 if completion data shows users hesitate on this step.
- **Adaptive scoring (per-trip-type branching)** — Survey item D from initial scoping; deferred. Revisit at 3 months.
- **Pet-friendly toggle** — Deferred to v1.1; gather inbound demand signal first.
- **Admin dashboard** (`/admin/villa-match`) — Punted to a follow-up phase; data captured day one.
- **A/B test of email-gate timing** (soft vs. tiered vs. none) — Capture the soft-gate baseline first, then test against it.
