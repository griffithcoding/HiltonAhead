/**
 * Pricing tier definitions for /services (B2C) and /partners (B2B).
 *
 * Each tier maps to a Stripe Price ID via env var. The /api/checkout
 * route reads `stripePriceEnv` for the requested tier, looks up the
 * env var, and creates a Stripe Checkout Session with that price.
 *
 * Stripe products to create in dashboard before launch:
 *   - Compass — $295 one-time payment
 *   - Charter Retainer — $895 one-time payment (commission billed manually)
 *   - Listed (B2B) — $600/year recurring
 *   - Featured (B2B) — $1,800/year recurring
 *
 * Heritage ($2,500 + 10%) and Signature ($4,800/yr) are
 * application-only — no self-serve checkout, sales-led close.
 */

export type TierMode = 'self-serve' | 'application-only';

export type B2CTierSlug = 'compass' | 'charter' | 'heritage';
export type B2BTierSlug = 'listed' | 'featured' | 'signature';
export type TierSlug = B2CTierSlug | B2BTierSlug;

export interface Tier {
  slug: TierSlug;
  audience: 'b2c' | 'b2b';
  mode: TierMode;
  /** Display name. */
  name: string;
  /** One-line tagline. */
  tagline: string;
  /** Display price in USD (or per-year for B2B). */
  priceDisplay: string;
  /** Numeric price in dollars (for analytics + JSON-LD). null for application-only. */
  priceUsd: number | null;
  /** Optional commission addendum, e.g. "+ 7% of trip cost". */
  commissionAddendum?: string;
  /** Stripe billing pattern (only for self-serve). */
  billing?: 'one_time' | 'subscription_yearly';
  /** Env var name holding the Stripe Price ID. */
  stripePriceEnv?: string;
  /** What's included — 4-7 bullets. */
  includes: string[];
  /** Ideal customer (1 sentence). */
  idealFor: string;
  /** UI accent color (matches brand palette). */
  accent: 'gold' | 'coral' | 'ocean' | 'ink';
  /** Mark "most popular" for visual emphasis. */
  popular?: boolean;
}

// ============================================================================
// B2C — Consumer travel consulting tiers
// ============================================================================

export const B2C_TIERS: Tier[] = [
  {
    slug: 'compass',
    audience: 'b2c',
    mode: 'self-serve',
    name: 'Compass',
    tagline: 'A focused consultation for first-time visitors.',
    priceDisplay: '$295',
    priceUsd: 295,
    billing: 'one_time',
    stripePriceEnv: 'STRIPE_PRICE_COMPASS',
    includes: [
      '60-minute video consultation',
      'Curated 3-villa shortlist with notes',
      'Restaurant + tee-time reservation list',
      'Neighborhood guide PDF',
      '30 days of email support',
    ],
    idealFor: 'First-time HHI visitors, $5K-$10K trip budget.',
    accent: 'ocean',
  },
  {
    slug: 'charter',
    audience: 'b2c',
    mode: 'self-serve',
    name: 'Charter',
    tagline: 'Full itinerary build with bookings handled end-to-end.',
    priceDisplay: '$895',
    priceUsd: 895,
    commissionAddendum: '+ 7% of net commissionable trip cost',
    billing: 'one_time',
    stripePriceEnv: 'STRIPE_PRICE_CHARTER_RETAINER',
    includes: [
      'Full custom itinerary build',
      '2 video planning calls',
      'Lodging negotiation + booking',
      'Restaurant, tee-time, and activity reservations',
      'Trip-week text-line support',
      '60 days post-trip support',
      'Welcome gift on arrival',
    ],
    idealFor: 'Returning visitors, honeymoons, $10K-$25K trips.',
    accent: 'coral',
    popular: true,
  },
  {
    slug: 'heritage',
    audience: 'b2c',
    mode: 'application-only',
    name: 'Heritage',
    tagline: '9-month lead planning for Heritage week, snowbirds, and ultra-luxury.',
    priceDisplay: '$2,500',
    priceUsd: 2500,
    commissionAddendum: '+ 10% of net trip cost',
    includes: [
      'Everything in Charter',
      '9-month lead planning for RBC Heritage / Wine & Food / snowbird leases',
      'Private airport transfers',
      'Pro-shop + tournament access (where available)',
      'On-island concierge handoff',
      'Dedicated planning lead',
    ],
    idealFor: 'Heritage attendees, snowbirds, $25K+ trips.',
    accent: 'gold',
  },
];

// ============================================================================
// B2B — Local-business directory + partner placement tiers
// ============================================================================

export const B2B_TIERS: Tier[] = [
  {
    slug: 'listed',
    audience: 'b2b',
    mode: 'self-serve',
    name: 'Listed',
    tagline: 'Verified directory listing across the local network.',
    priceDisplay: '$600/yr',
    priceUsd: 600,
    billing: 'subscription_yearly',
    stripePriceEnv: 'STRIPE_PRICE_LISTED_YEARLY',
    includes: [
      'Verified directory listing on /local',
      'Hero image + contact details + booking link',
      '1 industry-page placement',
      'Basic analytics dashboard',
    ],
    idealFor: 'Solo operators, single-location restaurants and shops.',
    accent: 'ocean',
  },
  {
    slug: 'featured',
    audience: 'b2b',
    mode: 'self-serve',
    name: 'Featured',
    tagline: 'Top-of-page placement plus editorial inclusion.',
    priceDisplay: '$1,800/yr',
    priceUsd: 1800,
    billing: 'subscription_yearly',
    stripePriceEnv: 'STRIPE_PRICE_FEATURED_YEARLY',
    includes: [
      'Everything in Listed',
      'Top-3 industry-page placement',
      '1 dedicated blog inclusion per year',
      '2 newsletter mentions per year',
      '/local hub homepage rotation',
    ],
    idealFor: 'Established businesses with marketing budget; multi-location operators.',
    accent: 'coral',
    popular: true,
  },
  {
    slug: 'signature',
    audience: 'b2b',
    mode: 'application-only',
    name: 'Signature',
    tagline: 'Maximum visibility — capped at 8 partners per year.',
    priceDisplay: '$4,800/yr',
    priceUsd: 4800,
    includes: [
      'Everything in Featured',
      '1 dedicated blog post (not just inclusion)',
      '6 newsletter mentions per year',
      'Neighborhood-page cross-link inclusion',
      'Trip-type page sponsorship slot',
      '$500 event-sponsorship credit',
      'Quarterly performance report',
    ],
    idealFor:
      'Top-of-category operators (resort spas, $5M+ restaurants, premier villa managers).',
    accent: 'gold',
  },
];

// ============================================================================
// helpers
// ============================================================================

export function getTier(slug: TierSlug): Tier | undefined {
  return [...B2C_TIERS, ...B2B_TIERS].find((t) => t.slug === slug);
}

export function getStripePriceId(tier: Tier): string | null {
  if (!tier.stripePriceEnv) return null;
  return process.env[tier.stripePriceEnv] || null;
}

/** True if the env var is configured (i.e. self-serve checkout is wired). */
export function isCheckoutReady(tier: Tier): boolean {
  if (tier.mode !== 'self-serve') return false;
  return !!getStripePriceId(tier);
}
