# Workstream B — Directory Billing State Audit

**Date:** 2026-05-22
**Scope:** Verify what's actually wired for directory paid-tier billing before we define tiers or wire Stripe subscriptions.
**Method:** Read `data/pricing.ts`, `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, migrations 009/012/014/017, `/admin/directory`, `/business/(gated)`, `/local/get-featured`, `/partners`, `/advertise`, `.env.example`.

---

## Executive summary

**Headline:** The selling surface exists. The fulfillment surface does NOT. A B2B customer can pay $1,800 for "Featured" and **nothing changes on their public listing**. This is the #1 blocker before any sales push.

**Top 3 gaps (ranked by build cost ÷ revenue impact):**

1. **No tier sync from `purchases` → `businesses.tier`.** Stripe webhook writes the purchase but never upgrades the listing. (BLOCKING)
2. **`purchases.tier_slug` CHECK constraint is stale.** It rejects the 7 newer SKUs (`heritage-kit-vip`, `insider-club-monthly`, `insider-club-yearly`, `featured-pin`, `story-sponsor`, `page-display`, `featured-villa`). Webhook would 500 on any of these. (BUG — verify in prod whether any have been attempted)
3. **Public `/local/[industry]` reads from static `data/localBusinesses.ts`, not the `businesses` table.** Even if tier sync existed, the public surface wouldn't render the upgraded placement until the Phase-2 swap. (BLOCKING — but explicit per migration 017 comments)

---

## State by component

### Pricing source-of-truth — `data/pricing.ts`
**Working.** Defines 13 tiers across B2C (6), B2B (3), B2B-Ads (4). Each tier carries `slug`, `audience`, `mode`, `billing`, `stripePriceEnv`. Helpers `getTier`, `getStripePriceId`, `isCheckoutReady` exist.

**Drift:** Admin page at `/admin/directory` describes tiers as *"$4,800/yr Curated and $12,000/yr Signature"*. Real pricing is Featured $1,800/yr, Signature $4,800/yr. **Admin copy is wrong.** Comes from an earlier pricing iteration.

### Selling pages
- **`/partners`** — renders `B2B_TIERS` via `PricingTiers` component. Marketing page exists.
- **`/advertise`** — renders `AD_TIERS` with `<CheckoutButton>` wired to `POST /api/checkout`. Working sell flow.
- **`/local/get-featured`** — **redirects to `/business/apply`** (manual application, not paid). Drops any `?tier=` query param. The Stripe webhook welcome email links here with `?tier=...` and that param is lost.
- **`/services`** — referenced in pricing.ts comment as the B2C sell page. (Not opened, assume exists.)

### Checkout — `app/api/checkout/route.ts`
**Working for one-time + subscriptions, conditional on env.** Reads tier, mode-switches `subscription` vs `payment`, requires `STRIPE_PRICE_*` env for subs, falls back to inline `price_data` for one-time. Sets `metadata.tier_slug` + `tier_audience` for webhook consumption. Application-only tiers route to `/itinerary?tier=...`.

**Risk:** No CSRF token, no rate-limit. Accepts unauthenticated POST. Probably fine since Stripe is the next gate, but worth a note.

### Stripe webhook — `app/api/stripe/webhook/route.ts`
**Working but incomplete.** Handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`. Idempotent upsert keyed on `stripe_session_id`.

**Missing actions on B2B purchase:**
- Does NOT upgrade `businesses.tier`.
- Does NOT link `purchase.business_id` (no such column exists).
- Does NOT trigger any "claim your listing" flow if the customer has no `business_owners` row yet.
- Does NOT validate `tier_slug` against the schema CHECK before insert — would throw.

### Purchases table — migration 009
- Tracks subscription lifecycle (`stripe_subscription_id`, `current_period_end`, `cancel_at_period_end`).
- **CHECK constraint is stale.** Allows only: `compass, charter, heritage, listed, featured, signature`. Missing 7 tiers shipped since.
- **No `business_id` FK.** Email-only link to the business.

### Businesses table — migration 017
- `tier` column: `'free' | 'featured' | 'premium'`. **`premium` doesn't exist in pricing.ts.** `listed` doesn't exist here.
- `business_owners` link to `auth.users` via `auth.uid`.
- RLS allows owners to update their own row. Insert/delete is admin-only.

### Public directory — `/local/[industry]`
- Reads static `data/localBusinesses.ts` (not the `businesses` table — confirmed by `/admin/directory` import).
- Migration 017 comment: *"Phase 2 will swap the public surface to read from this table."* Phase 2 has not shipped.

### Admin directory — `/admin/directory`
- Reads `directory_events` from last 30 days, aggregates per business_id.
- Joins against static `data/localBusinesses.ts`.
- Does NOT join against `purchases` — admin cannot see which businesses have paid.
- Stale tier copy in header ($4,800 / $12,000).
- Mailto link gives a one-click "we sent you X interactions" email draft. This is the manual version of the attribution proof email.

### Business portal — `/business/(gated)`
- Phase 0/1 placeholder.
- Lists "Phase 5: Featured upgrade" as future work — confirms paid upgrade UI is not wired.
- No customer portal link (Stripe-hosted cancel/upgrade) anywhere.

### Attribution data — migrations 012 / 014
- `directory_events` table tracks 13 event types (3 original + 7 page-level + 3 cross-system attribution).
- IP hashed SHA-256, UA stored truncated.
- Indices on `business_id`, `industry_slug`, `event_type`, plus functional index on `payload->>'platform'`.
- **Aggregation is real-time per request.** No materialized monthly rollup. The attribution proof email job (when built) will do this aggregation itself.

### Env config — `.env.example`
**Multiple gaps.** None of these are documented:
- `STRIPE_PRICE_COMPASS`
- `STRIPE_PRICE_CHARTER_RETAINER`
- `STRIPE_PRICE_LISTED_YEARLY`
- `STRIPE_PRICE_FEATURED_YEARLY`
- `STRIPE_PRICE_HERITAGE_KIT_VIP`
- `STRIPE_PRICE_INSIDER_CLUB_MONTHLY`
- `STRIPE_PRICE_INSIDER_CLUB_YEARLY`
- `STRIPE_PRICE_FEATURED_PIN_MONTHLY`
- `STRIPE_PRICE_STORY_SPONSOR`
- `STRIPE_PRICE_PAGE_DISPLAY_MONTHLY`
- `STRIPE_PRICE_FEATURED_VILLA_MONTHLY`
- `STRIPE_WEBHOOK_SECRET`

A fresh deploy doesn't know what to set. **No way to know which env vars are populated in prod without checking Vercel.**

### Cron infra
Only 2 cron routes exist (`newsletter-draft`, `sales-sequence-tick`). Cron auth via `CRON_SECRET`. **No** directory-attribution-proof cron, **no** churn-risk cron.

---

## Tier / SKU drift table

| Layer | Allowed values | Source |
|---|---|---|
| `data/pricing.ts` B2B | `listed`, `featured`, `signature` | code |
| `data/pricing.ts` B2B-Ads | `featured-pin`, `story-sponsor`, `page-display`, `featured-villa` | code |
| `purchases.tier_slug` CHECK | `compass, charter, heritage, listed, featured, signature` only | migration 009 |
| `businesses.tier` CHECK | `free, featured, premium` only | migration 017 |
| `/admin/directory` header copy | `$4,800/yr Curated`, `$12,000/yr Signature` | code (stale) |

**Three different vocabularies. None match.**

---

## Prioritized gap list

### P0 — blocks any B2B sale from actually working

1. **Widen `purchases.tier_slug` CHECK** — new migration adds the 7 missing slugs. Otherwise webhook 500s for newer SKUs.
2. **Tier sync on webhook** — after `checkout.session.completed` for a B2B tier, locate the matching `businesses` row (by `lower(owner_email)`) and update `businesses.tier`. Create the row if no match.
3. **Reconcile `businesses.tier` vocabulary** — either rename `featured/premium` → `featured/signature` (and add `listed`), or map pricing slugs into the existing vocabulary. Pick one. The current `premium` value is dead and `listed` has no home.
4. **Add `business_id` FK to `purchases`** — nullable, populated by webhook when match found. Makes per-business revenue queryable.

### P1 — needed before turning on outbound sales

5. **Public `/local/[industry]` reads from `businesses` table** — Phase-2 swap per migration 017. Without this, paying doesn't visibly change anything.
6. **Tier-driven placement logic** — Featured = top-of-page card, Signature = hero slot + cross-page boosts. Define and implement in the public surface.
7. **`/local/get-featured` becomes a real sell page** — instead of redirecting to `/business/apply`, render `B2B_TIERS` with checkout buttons (same pattern as `/advertise`). Today's redirect drops `?tier=` so the welcome email's CTA is broken.
8. **Customer portal link in `/business/(gated)`** — Stripe-hosted billing portal so owners can cancel/upgrade self-serve. Stripe API gives a signed URL.
9. **Attribution proof email cron** — `app/api/cron/directory-attribution-proof/route.ts`. Monthly aggregate per business + Resend send. Non-optional retention lever.

### P2 — improve, not block

10. **`/admin/directory` shows revenue per business** — join `purchases` for B2B rows, sum amount_cents, show MRR/ARR per listing.
11. **`/admin/directory` tier copy fix** — replace `$4,800/yr Curated, $12,000/yr Signature` with `$600/yr Listed, $1,800/yr Featured, $4,800/yr Signature`.
12. **Free trial mechanism** — add `trial_period_days: 14` to subscription checkout sessions. Pricing.ts already references "14-day free trial" in the roadmap doc.
13. **Document all `STRIPE_PRICE_*` env vars in `.env.example`.** Add `STRIPE_WEBHOOK_SECRET` too.
14. **Churn-risk cron** — flag businesses with `current_period_end` in next 30 days + `cancel_at_period_end = true` OR with engagement drop > 50% MoM.

### P3 — nice-to-have

15. Industry expansion (real estate, photographers, charter captains, instructors).
16. Self-serve onboarding email sequence (trial day 0, 7, 12, 14 expiry).
17. Per-tier feature matrix component (renders what each tier includes from `data/pricing.ts`).

---

## Recommended next concrete tasks (build order)

These are the next ~4 plan-able units. Each ≤ 1 day. Suggest 2–3 of these for a single GSD phase.

### Task B1 — Schema sanity migration *(½ day)*
- New migration `019_purchases_tier_widen.sql`:
  - Widen `purchases.tier_slug` CHECK to include all 13 current slugs from `data/pricing.ts`.
  - Add nullable `business_id uuid references public.businesses(id)`.
  - Add index `idx_purchases_business_id`.
- New migration `020_businesses_tier_align.sql`:
  - Drop `businesses.tier` CHECK.
  - Re-add CHECK matching B2B vocabulary: `('free', 'listed', 'featured', 'signature')`.
  - Migrate any existing `premium` rows → `featured`.

### Task B2 — Webhook tier sync *(½ day)*
- In `handleCheckoutCompleted`: after upsert into `purchases`, if `tier.audience === 'b2b'`:
  - Look up `businesses` by `lower(owner_email) = lower(customer_email)`.
  - If found: update `businesses.tier = tier.slug`, link `purchases.business_id`.
  - If not found: queue a claim-flow email (TBD) and log a warning.
- On `customer.subscription.deleted` for B2B: downgrade `businesses.tier = 'free'`.
- Add unit-style test using Stripe webhook fixture (Playwright or a script under `tests/`).

### Task B3 — Real `/local/get-featured` sell page *(½ day)*
- Replace redirect with a page rendering `B2B_TIERS` (mirror `/advertise` pattern).
- Each tier card → `<form POST /api/checkout>` with `tier` hidden input.
- Application-only `signature` → `/itinerary?tier=signature`.
- Update `/admin/directory` header tier copy in the same commit.

### Task B4 — Public surface tier rendering *(1 day — bigger)*
- `/local/[industry]` reads from `businesses` Supabase table (Phase-2 swap).
- Sort: `tier = 'signature'` first, then `featured`, then `listed`, then `free`.
- Tier badge component for each card (`<TierBadge tier={...} />`).
- Keep `data/localBusinesses.ts` as the seed source until the migration has fully run.

After B1–B4 land, **paying for a tier actually does something visible.** That unlocks every other Workstream B step (proof email, outbound sales, churn flagging, etc.).

---

## Resolved decisions (2026-05-22)

1. **Trial length: 14 days.** Use `trial_period_days: 14` on subscription checkout sessions for B2B tiers.
2. **Signature application: dedicated `/business/apply?tier=signature`.** Separate intake from `/itinerary` (which is for B2C trip-planning leads). Existing `/business/apply` reads `tier` query param and routes Signature applicants to an admin-review queue rather than self-serve checkout.
3. **Free → paid conversion path: apply always starts `free`, upgrade is a separate later decision.** Three upgrade paths:
   - Self-serve from `/business/(gated)` (after claim)
   - Self-serve from public `/local/get-featured`
   - Inbound: monthly attribution proof email contains an upgrade CTA
   Rationale: lower apply friction, more inventory, more traffic data; owners need to see attribution numbers before paying; this is the directory-industry standard (Yelp / Google Business / TripAdvisor).
4. **B2C subscription cancellation does NOT downgrade `businesses.tier`.** Webhook downgrade logic only fires when `tier.audience === 'b2b'`.
5. **`premium` is the deprecated old name for the top tier — rename to `signature`.** Schema-align migration:
   - Vocabulary becomes `'free' | 'listed' | 'featured' | 'signature'`.
   - `UPDATE businesses SET tier='signature' WHERE tier='premium'` before re-adding CHECK.
   - This is a strict superset of today's allowed values plus the migration step, so no rows are orphaned.
