/**
 * Partner / sponsor data.
 *
 * Populate this file with real partners after you close them.
 * The `/partners` page renders a graceful "accepting applications"
 * state when no partners are active yet.
 *
 * Per Google Ads / FTC disclosure guidance, any outbound link from
 * a sponsored slot must carry `rel="sponsored nofollow"`. The
 * component handles this automatically based on tier.
 */

export type PartnerTier = 'featured' | 'curated' | 'signature';

export type Partner = {
  slug: string;
  name: string;
  /** Short tagline — shown under the name on the card. */
  tagline: string;
  /** One paragraph of honest description. */
  description: string;
  tier: PartnerTier;
  category:
    | 'Villa & rentals'
    | 'Dining'
    | 'Golf'
    | 'Boating & charters'
    | 'Weddings & venues'
    | 'Spa & wellness'
    | 'Retail & gifting';
  /** Public URL. Rendered with rel="sponsored nofollow". */
  website: string;
  /** Neighborhood or general locality. */
  location: string;
  /** Date the partnership started (ISO). */
  since: string;
  /** Optional short quote from the partner. */
  quote?: string;
};

/**
 * Active partner list.
 *
 * Empty by default — page renders a "we're accepting applications" state.
 * Add entries as you close partners. Three tiers ranked in the order you'd
 * want them seen.
 */
export const partners: Partner[] = [
  // Example shape — delete and replace with real partners as you close them:
  // {
  //   slug: 'example-villa-co',
  //   name: 'Example Villa Co.',
  //   tagline: 'Sea Pines villa rentals, 1984.',
  //   description:
  //     'Three generations of managing Sea Pines oceanfront rentals. We\u2019ve booked dozens of their properties; they\u2019re the only Sea Pines rental operator we trust for August weddings.',
  //   tier: 'signature',
  //   category: 'Villa & rentals',
  //   website: 'https://example.com',
  //   location: 'Sea Pines',
  //   since: '2026-04-20',
  //   quote: 'The Hilton Ahead team sends us clients who already understand the value of the product. Easiest handoff in the business.',
  // },
];

export const partnersMeta = {
  /** Convenience flag — true when any partners are active. */
  hasActivePartners: partners.length > 0,
  /** For stats on /sponsorships page. */
  slotsAvailable: {
    featured: 12,
    curated: 6,
    signature: 3,
  },
  slotsFilled: {
    featured: partners.filter((p) => p.tier === 'featured').length,
    curated: partners.filter((p) => p.tier === 'curated').length,
    signature: partners.filter((p) => p.tier === 'signature').length,
  },
};

/** Group partners by tier for grid rendering. */
export function partnersByTier() {
  return {
    signature: partners.filter((p) => p.tier === 'signature'),
    curated: partners.filter((p) => p.tier === 'curated'),
    featured: partners.filter((p) => p.tier === 'featured'),
  };
}

/**
 * Sponsorship tier definitions — source of truth for pricing page.
 */
export type SponsorshipTier = {
  tier: PartnerTier;
  name: string;
  /** Annual price in USD. */
  price: number;
  monthlyEquivalent: number;
  productKey: 'partner_tier_1' | 'partner_tier_2' | 'partner_tier_3';
  /** Short sell. */
  tagline: string;
  /** Full benefits list. */
  benefits: string[];
  /** Ideal target — who this tier is for. */
  idealFor: string;
  /** Slots per year we cap the tier at. */
  slots: number;
};

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    tier: 'featured',
    name: 'Featured Partner',
    price: 1200,
    monthlyEquivalent: 100,
    productKey: 'partner_tier_1',
    tagline:
      'Your logo in front of qualified Hilton Head travelers, every page, all year.',
    benefits: [
      'Logo + 75-word blurb in the footer of every page on hiltonahead.com',
      'Named in one monthly newsletter per quarter',
      'Quarterly Instagram field tag (one visit, one post)',
      'Listing on the Partners page',
      'Quarterly analytics summary (pageviews to your link)',
    ],
    idealFor:
      'Charter operators, boutique restaurants, tour companies, tennis & pickleball programs.',
    slots: 12,
  },
  {
    tier: 'curated',
    name: 'Curated Partner',
    price: 4800,
    monthlyEquivalent: 400,
    productKey: 'partner_tier_2',
    tagline:
      'Honest editorial mention in a tier list + monthly reach + co-branded travel assets.',
    benefits: [
      'Everything in Featured Partner',
      'One mention in our restaurant, stays, or activities tier list (placement stays merit-based; we never rank by payment)',
      'Featured in one monthly newsletter per month',
      'Co-branded "Insider\u2019s Weekend at [Partner]" 2-day itinerary template (yours to distribute)',
      'Priority Instagram + photography tagging',
      'Monthly analytics summary',
    ],
    idealFor:
      'Mid-tier restaurants, boutique villa management companies, spa & wellness, wedding photographers.',
    slots: 6,
  },
  {
    tier: 'signature',
    name: 'Signature Partner',
    price: 12000,
    monthlyEquivalent: 1000,
    productKey: 'partner_tier_3',
    tagline:
      'Top-of-footer placement, dedicated editorial, and a co-branded referred-guest Stripe checkout.',
    benefits: [
      'Everything in Curated Partner',
      'Dedicated 1,500-word editorial post written by our team (one per year)',
      'Featured newsletter placement in every issue',
      'Co-branded referred-guest Stripe Checkout product on your page (revenue-share)',
      'Quarterly strategy call + analytics deep-dive',
      'First-refusal on all new editorial placements in your category',
    ],
    idealFor:
      'Major villa management companies, wedding venues, resort golf programs, flagship destination restaurants.',
    slots: 3,
  },
];
