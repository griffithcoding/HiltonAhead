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

export type PartnerTier = 'featured' | 'curated' | 'signature' | 'heritage';

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
    heritage: 4,
  },
  slotsFilled: {
    featured: partners.filter((p) => p.tier === 'featured').length,
    curated: partners.filter((p) => p.tier === 'curated').length,
    signature: partners.filter((p) => p.tier === 'signature').length,
    heritage: partners.filter((p) => p.tier === 'heritage').length,
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
  /** Annual price in USD. (For Heritage, this is the one-time April-window fee.) */
  price: number;
  monthlyEquivalent: number;
  /**
   * Stripe product key for self-serve checkout. Optional — the Heritage
   * tier is sales-led (Calendly + inquiry form), not self-serve.
   */
  productKey?: 'partner_tier_1' | 'partner_tier_2' | 'partner_tier_3';
  /** Short sell. */
  tagline: string;
  /** Full benefits list. */
  benefits: string[];
  /** Ideal target — who this tier is for. */
  idealFor: string;
  /** Slots per year we cap the tier at. */
  slots: number;
  /**
   * Optional cadence — yearly for ongoing tiers, "one-time" for the
   * Heritage Week tier. Defaults to "yearly" in the renderer.
   */
  cadence?: 'yearly' | 'event';
  /** Optional editorial note shown beneath the price (e.g. "April 2027 only"). */
  priceNote?: string;
};

export const sponsorshipTiers: SponsorshipTier[] = [
  {
    tier: 'heritage',
    name: 'Heritage Week Partner',
    price: 5000,
    monthlyEquivalent: 5000,
    cadence: 'event',
    priceNote: 'One-time · April 2027 window',
    tagline:
      'Category exclusivity in front of high-intent 2027 RBC Heritage visitors — kit, page, and Heritage-week newsletter.',
    benefits: [
      'Featured insert in the 2027 Heritage Kit (free PDF, delivered February 2027)',
      'Logo + 50-word blurb on /guides/2027-rbc-heritage all year',
      'Daily Heritage-week newsletter section (Apr 12–18, 2027)',
      'Two Heritage-themed Instagram posts (April 2027)',
      'Quarterly Heritage attribution report (UTM-tracked clicks + inquiries)',
      'Category exclusivity — one slot per category, no overlap',
    ],
    idealFor:
      'Lodging operators, golf concierges / stay-and-play resellers, premium restaurants near Harbour Town, and full-service transportation or concierge providers. One slot each, four total.',
    slots: 4,
  },
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
      'Logo + 75-word blurb in the footer of every page on hiltonahead.com',
      'Listing on the Partners page',
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
      'Everything in Curated Partner, plus:',
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
