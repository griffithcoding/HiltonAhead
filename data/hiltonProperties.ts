/**
 * Hilton-family properties on Hilton Head Island and in Bluffton, SC.
 *
 * Used by /hilton-honors-stays-hilton-head to render per-property cards +
 * ItemList JSON-LD. Single source of truth — do not duplicate property facts
 * elsewhere.
 *
 * Affiliate note: the Hilton program (see `hilton` in data/affiliateLinks.ts)
 * uses linkPattern 'prebuilt-link' — Impact hands over a single finished vanity
 * tracking link, so every Hilton CTA on the page routes through that one link
 * (the cookie is what earns; any subsequent Hilton.com booking is attributed).
 * `bookingUrl` below is retained for ItemList data + future per-property Impact
 * links, but is NOT the live click target today.
 *
 * Every cash + points figure and bookingUrl carries `// TODO: VERIFY` until
 * spot-checked against current Hilton.com pricing. The property *list* itself
 * was web-verified 2026-06-01 against hilton.com Bluffton + Hilton Head Island
 * location pages (the spec's "Coral Resort" seed was dropped — it is in Myrtle
 * Beach, not Hilton Head).
 */

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
  /** 2–3 sentence local-insider take in the HiltonAhead voice. */
  insiderTake: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  /** Peak-season pre-tax per-night cash range, USD. */
  cashRangeUsd: { min: number; max: number };
  /** Peak-night Hilton Honors points range. */
  pointsRange: { min: number; max: number };
  /** Hilton.com booking URL. Retained for data + future per-property links. */
  bookingUrl: string;
}

export const HILTON_PROPERTIES: ReadonlyArray<HiltonProperty> = [
  {
    slug: 'ocean-oak-resort',
    name: 'Hilton Grand Vacations Club Ocean Oak Resort',
    brand: 'Hilton Grand Vacations',
    area: 'Hilton Head Island',
    neighborhood: 'Folly Field / mid-island, oceanfront',
    oceanfront: true,
    positioning:
      'The only true oceanfront Hilton-family stay on the island — villas, not hotel rooms.',
    insiderTake:
      'Ocean Oak is the Hilton answer to a Marriott Vacation Club week — full villas with kitchens and washer/dryers, directly on the Folly Field beach. It is the single property to book if you want Hilton points or HGV on actual oceanfront sand here. Peak summer weeks book months out, and the villa inventory clears fast.',
    bestFor:
      'Families and Hilton-loyal travelers who want an oceanfront villa week with a kitchen.',
    pros: [
      'True oceanfront — direct beach access on Folly Field',
      'Full villas with kitchens and laundry (rare in the Hilton family here)',
      'The only on-island Hilton property on the sand',
    ],
    cons: [
      'Timeshare-style inventory — books well ahead for peak weeks',
      'HGV points and standard Honors award availability vary by week',
    ],
    cashRangeUsd: { min: 320, max: 750 }, // TODO: VERIFY against hilton.com peak rates
    pointsRange: { min: 80000, max: 130000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhhooga-ocean-oak-resort-by-hilton-grand-vacations/', // TODO: VERIFY
  },
  {
    slug: 'hampton-inn-hhi',
    name: 'Hampton Inn Hilton Head',
    brand: 'Hampton Inn',
    area: 'Hilton Head Island',
    neighborhood: 'Mid-island (off US-278, not beachfront)',
    oceanfront: false,
    positioning:
      'The reliable points-friendly weeknight room on the island itself.',
    insiderTake:
      'A clean, predictable Hampton — free hot breakfast, free parking, and a points cost low enough that a weeknight award stay is genuinely good value. You are not on the beach (nothing in this band is), but you are on the island, which beats a Bluffton drive each morning. Fine for a golf trip or a one-night front/back end of a villa week.',
    bestFor:
      'Golf trips, one-night stopovers, and budget-minded points redemptions on-island.',
    pros: [
      'On Hilton Head Island, not across the bridge in Bluffton',
      'Free hot breakfast + free parking',
      'Low points cost — a strong weeknight award value',
    ],
    cons: [
      'Not walkable to the beach — you drive everywhere',
      'Limited-service hotel — no kitchen, basic amenity set',
    ],
    cashRangeUsd: { min: 180, max: 360 }, // TODO: VERIFY
    pointsRange: { min: 30000, max: 55000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhgsahx-hampton-hilton-head/', // TODO: VERIFY
  },
  {
    slug: 'hampton-inn-bluffton-sun-city',
    name: 'Hampton Inn & Suites Bluffton-Sun City',
    brand: 'Hampton Inn',
    area: 'Bluffton',
    neighborhood: 'Bluffton, near Sun City (off US-278)',
    oceanfront: false,
    positioning:
      'The value points room for travelers who do not mind the bridge.',
    insiderTake:
      'Newer Hampton in the Bluffton corridor — typically the lowest cash and points cost of the cluster. The trade is the 20–30 minute drive onto the island each day. Smart for a wedding-guest block, a Sun City family visit, or anyone treating the island as a day trip rather than a base.',
    bestFor:
      'Wedding-guest blocks, Sun City visits, and lowest-cost points nights.',
    pros: [
      'Usually the cheapest cash + points of the group',
      'Newer build, suites available, free breakfast + parking',
      'Easy highway access for day trips onto the island',
    ],
    cons: [
      '20–30 minutes from the Hilton Head beaches',
      'Bluffton location, not the island itself',
    ],
    cashRangeUsd: { min: 150, max: 320 }, // TODO: VERIFY
    pointsRange: { min: 25000, max: 50000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/savbthx-hampton-suites-bluffton-sun-city/', // TODO: VERIFY
  },
  {
    slug: 'home2-suites-hhi',
    name: 'Home2 Suites by Hilton Hilton Head',
    brand: 'Home2 Suites',
    area: 'Hilton Head Island',
    neighborhood: 'Mid-island, off US-278',
    oceanfront: false,
    positioning:
      'All-suite, kitchenette stay — the Hilton pick when you want to cook a little.',
    insiderTake:
      'Every room is a suite with a kitchenette, which quietly fixes the biggest weakness of the limited-service Hilton band on a beach trip: nowhere to make breakfast or store leftovers. Newer, pet-friendly, with a pool. Not the beach, but the best everyday-livability of the non-villa Hilton options here.',
    bestFor:
      'Longer limited-service stays, families who want a kitchenette, pet owners.',
    pros: [
      'Kitchenette in every suite — cook breakfast, store a cooler',
      'Newer property with a pool, pet-friendly',
      'Better for 4+ night stays than a standard hotel room',
    ],
    cons: [
      'Not on the beach',
      'Kitchenette, not a full villa kitchen',
    ],
    cashRangeUsd: { min: 190, max: 380 }, // TODO: VERIFY
    pointsRange: { min: 35000, max: 60000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhhho2ht-home2-suites-hilton-head/', // TODO: VERIFY
  },
  {
    slug: 'hilton-garden-inn-hhi',
    name: 'Hilton Garden Inn Hilton Head Island',
    brand: 'Hilton Garden Inn',
    area: 'Hilton Head Island',
    neighborhood: 'Mid-island, ~15 min to the beaches',
    oceanfront: false,
    positioning:
      'The step-up limited-service option — on-site dining and a notch more polish.',
    insiderTake:
      'A Garden Inn buys you an on-site restaurant and bar, a slightly more business-grade room, and a pool, for a small premium over the Hampton band. Roughly 15 minutes to the sand. The right pick when you want a touch more than a budget room but are not paying villa rates.',
    bestFor:
      'Couples and business-leisure travelers wanting on-site dining without villa prices.',
    pros: [
      'On-site restaurant + bar — no car needed for breakfast or a drink',
      'More polished rooms than the Hampton/Home2 band',
      'Pool, reliable Hilton service',
    ],
    cons: [
      'Not on the beach — ~15 minute drive',
      'Cash rate runs above the Hampton options',
    ],
    cashRangeUsd: { min: 200, max: 400 }, // TODO: VERIFY
    pointsRange: { min: 35000, max: 60000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhhhegi-hilton-garden-inn-hilton-head/', // TODO: VERIFY
  },
  {
    slug: 'doubletree-hhi',
    name: 'DoubleTree by Hilton Hilton Head Island',
    brand: 'Other Hilton Family',
    area: 'Hilton Head Island',
    neighborhood: 'Mid-island, resort-style grounds',
    oceanfront: false,
    positioning:
      'The closest the Hilton family gets to a full-service resort feel on-island.',
    insiderTake:
      'The DoubleTree leans resort — more grounds, more amenities, the warm-cookie welcome — without oceanfront pricing. Not on the beach, but the most "vacation" of the non-villa Hilton options, and a solid Honors redemption when villa inventory is gone. Check whether your dates land it at standard or peak award pricing.',
    bestFor:
      'Travelers who want a resort feel and Honors points but not villa rates.',
    pros: [
      'Most resort-like amenities of the non-villa Hilton options',
      'Reliable mid-tier Honors redemption',
      'Larger grounds and pool than the limited-service band',
    ],
    cons: [
      'Not oceanfront',
      'Peak award pricing can spike on summer weekends',
    ],
    cashRangeUsd: { min: 200, max: 420 }, // TODO: VERIFY
    pointsRange: { min: 40000, max: 70000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhhhddt-doubletree-hilton-head-island/', // TODO: VERIFY
  },
  {
    slug: 'spark-hhi',
    name: 'Spark by Hilton Hilton Head Island',
    brand: 'Other Hilton Family',
    area: 'Hilton Head Island',
    neighborhood: 'Mid-island, off US-278',
    oceanfront: false,
    positioning:
      "Hilton's value brand — the cheapest cash-and-points room on the island.",
    insiderTake:
      'Spark is Hilton’s newest budget flag — a refreshed, no-frills room with free breakfast at the lowest end of the Honors chart. On the island (not Bluffton), which is its main edge over the cheap Bluffton options. Bare-bones, but the right answer when the only goal is the lowest on-island points night.',
    bestFor:
      'Lowest-cost on-island stays and bottom-of-the-chart points nights.',
    pros: [
      'Lowest cash + points cost on the island itself',
      'Free breakfast, recently refreshed rooms',
      'On Hilton Head, not across the bridge',
    ],
    cons: [
      'No-frills value brand — minimal amenities',
      'Not on the beach',
    ],
    cashRangeUsd: { min: 140, max: 300 }, // TODO: VERIFY
    pointsRange: { min: 20000, max: 45000 }, // TODO: VERIFY
    bookingUrl:
      'https://www.hilton.com/en/hotels/hhhhsqx-spark-hilton-head-island/', // TODO: VERIFY
  },
];

/** Hilton Honors free-membership signup. */
export const HILTON_HONORS_SIGNUP_URL =
  'https://www.hilton.com/en/hilton-honors/join/';

/** Filtered Hilton.com search scoped to Hilton Head Island. */
export const HILTON_HHI_SEARCH_URL =
  'https://www.hilton.com/en/search/?query=Hilton+Head+Island%2C+SC';

/** Brand-band render order for the page. */
export const HILTON_BRAND_ORDER: ReadonlyArray<HiltonBrandBand> = [
  'Hilton Grand Vacations',
  'Hampton Inn',
  'Home2 Suites',
  'Hilton Garden Inn',
  'Other Hilton Family',
];
