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
export type AdTierSlug = 'featured-pin' | 'story-sponsor' | 'page-display';
export type TierSlug = B2CTierSlug | B2BTierSlug | AdTierSlug;

export interface Tier {
  slug: TierSlug;
  audience: 'b2c' | 'b2b' | 'b2b-ads';
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
  billing?: 'one_time' | 'subscription_monthly' | 'subscription_yearly';
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
// B2B-Ads — direct display ad SKUs sold to local businesses (smaller, monthly,
// self-serve). Pitched on /advertise. Distinct from the partner program above.
// ============================================================================

export const AD_TIERS: Tier[] = [
  {
    slug: 'featured-pin',
    audience: 'b2b-ads',
    mode: 'self-serve',
    name: 'Featured Pin',
    tagline: 'Top-of-page sponsored card on a single industry directory page.',
    priceDisplay: '$249/mo',
    priceUsd: 249,
    billing: 'subscription_monthly',
    stripePriceEnv: 'STRIPE_PRICE_FEATURED_PIN_MONTHLY',
    includes: [
      'Sponsored card pinned at top of one /local/[industry] page',
      'Logo, headline, 1-line pitch, outbound link with rel=sponsored',
      'Impression + click counts in monthly performance report',
      'Cancel anytime, monthly billing',
    ],
    idealFor: 'Restaurants, golf courses, and other local operators who want top-of-page placement on a single category.',
    accent: 'coral',
  },
  {
    slug: 'story-sponsor',
    audience: 'b2b-ads',
    mode: 'self-serve',
    name: 'Story Sponsor',
    tagline: 'Brand sponsorship of a single long-form story on /stories.',
    priceDisplay: '$895',
    priceUsd: 895,
    billing: 'one_time',
    stripePriceEnv: 'STRIPE_PRICE_STORY_SPONSOR',
    includes: [
      'Branded sponsor block at top of one published story',
      'One inline native mention written by our team',
      "Sponsor logo + 'Presented by' eyebrow on the story page",
      'Impression + click report after 30 days',
      'One-time fee — story stays sponsored for 90 days',
    ],
    idealFor: 'Wedding venues, premium villa managers, and lifestyle brands aligned with one specific editorial story.',
    accent: 'gold',
    popular: true,
  },
  {
    slug: 'page-display',
    audience: 'b2b-ads',
    mode: 'self-serve',
    name: 'Page Display Slot',
    tagline: 'Display banner on a topical landing page (golf, weddings, honeymoon, etc.).',
    priceDisplay: '$495/mo',
    priceUsd: 495,
    billing: 'subscription_monthly',
    stripePriceEnv: 'STRIPE_PRICE_PAGE_DISPLAY_MONTHLY',
    includes: [
      'Sponsored block on one trip-type landing page (e.g. /hilton-head-weddings)',
      'Visible above the fold or at first natural break',
      'Logo, headline, body, CTA — same shape as the partner cards',
      'Impression + click report monthly',
      'Inventory capped — one sponsor per page surface',
    ],
    idealFor: 'Operators with a clear category match (a wedding venue on /hilton-head-weddings, a golf academy on /golf, etc.).',
    accent: 'ocean',
  },
];

// ============================================================================
// helpers
// ============================================================================

export function getTier(slug: TierSlug): Tier | undefined {
  return [...B2C_TIERS, ...B2B_TIERS, ...AD_TIERS].find((t) => t.slug === slug);
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
