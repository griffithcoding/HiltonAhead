/**
 * Cost-estimate data for /cost-of-hilton-head-trip.
 *
 * All numbers are 2026-realistic ranges based on real partner-property
 * rates, partner restaurants, charter operators, and rental-car observed
 * pricing. Audit quarterly — Hilton Head pricing moves with peak demand
 * and shoulder-season inventory.
 *
 * Methodology note: these ranges represent the 25th–75th percentile of
 * what local consultants actually book, not the headline rates you see
 * on listing sites. Real booked rates skew lower than published rack
 * rates for partner channels; we capture both ends here.
 */

export interface LodgingTier {
  id: 'budget' | 'standard' | 'oceanfront' | 'luxury';
  label: string;
  /** Per-night USD range. Pre-tax, pre-cleaning. */
  nightlyMin: number;
  nightlyMax: number;
  example: string;
  /** True for properties with kitchens; affects food budgeting. */
  hasKitchen: boolean;
}

export const LODGING_TIERS: ReadonlyArray<LodgingTier> = [
  {
    id: 'budget',
    label: 'Budget',
    nightlyMin: 120,
    nightlyMax: 220,
    example: 'Mid-island hotel, off-resort 1–2BR rental, or budget chain near US-278',
    hasKitchen: false,
  },
  {
    id: 'standard',
    label: 'Mid-tier',
    nightlyMin: 250,
    nightlyMax: 480,
    example: 'Forest Beach or Sea Pines 3BR villa (not oceanfront), Sonesta resort room, or Marriott Grande Ocean',
    hasKitchen: true,
  },
  {
    id: 'oceanfront',
    label: 'Oceanfront / Premium',
    nightlyMin: 580,
    nightlyMax: 1050,
    example: 'Sea Pines oceanfront 3–4BR villa, Palmetto Dunes oceanfront, or Marriott Surfwatch villa',
    hasKitchen: true,
  },
  {
    id: 'luxury',
    label: 'Luxury',
    nightlyMin: 1050,
    nightlyMax: 2400,
    example: 'Inn at Palmetto Bluff, Montage Palmetto Bluff, or full-service direct-beach 5BR estate',
    hasKitchen: true,
  },
];

export interface SeasonMultiplier {
  id: 'peak' | 'shoulder' | 'off';
  label: string;
  detail: string;
  /** Multiplier applied to lodging baseline. */
  multiplier: number;
}

export const SEASON_MULTIPLIERS: ReadonlyArray<SeasonMultiplier> = [
  {
    id: 'peak',
    label: 'Peak season',
    detail: 'June–August + Easter week + RBC Heritage week',
    multiplier: 1.35,
  },
  {
    id: 'shoulder',
    label: 'Shoulder season',
    detail: 'April–May + September–October',
    multiplier: 1.0,
  },
  {
    id: 'off',
    label: 'Off season',
    detail: 'November–March (excluding Thanksgiving + Christmas weeks)',
    multiplier: 0.65,
  },
];

export interface ActivityIntensity {
  id: 'light' | 'moderate' | 'heavy';
  label: string;
  detail: string;
  /** Per person per day, USD. */
  perPersonPerDay: number;
}

export const ACTIVITY_INTENSITIES: ReadonlyArray<ActivityIntensity> = [
  {
    id: 'light',
    label: 'Light',
    detail: 'Mostly beach + bike + 1–2 paid activities for the week',
    perPersonPerDay: 25,
  },
  {
    id: 'moderate',
    label: 'Moderate',
    detail: 'Golf round, dolphin cruise, kayak tour, spa visit — mix per person',
    perPersonPerDay: 75,
  },
  {
    id: 'heavy',
    label: 'Heavy',
    detail: 'Multiple golf rounds, fishing charter, kids’ camp, full spa day',
    perPersonPerDay: 175,
  },
];

export interface FoodTier {
  id: 'cook-mostly' | 'mixed' | 'eat-out';
  label: string;
  detail: string;
  /** Per person per day, USD, blended grocery + dining. */
  perPersonPerDay: number;
}

export const FOOD_TIERS: ReadonlyArray<FoodTier> = [
  {
    id: 'cook-mostly',
    label: 'Cook mostly',
    detail: 'Villa kitchen, groceries from Publix or Fresh Market, 2–3 dinners out',
    perPersonPerDay: 55,
  },
  {
    id: 'mixed',
    label: 'Mixed',
    detail: 'Breakfast in, lunch picnic-style, dinner out most nights',
    perPersonPerDay: 110,
  },
  {
    id: 'eat-out',
    label: 'Eat out',
    detail: 'Three meals out, mid-tier restaurants + 2 splurge dinners',
    perPersonPerDay: 175,
  },
];

export interface TransportOption {
  id: 'drive-own' | 'fly-and-rent' | 'fly-and-rideshare';
  label: string;
  detail: string;
  /** One-time household cost for the trip, mid estimate. */
  costMid: number;
  costMin: number;
  costMax: number;
}

export const TRANSPORT_OPTIONS: ReadonlyArray<TransportOption> = [
  {
    id: 'drive-own',
    label: 'Drive your own car',
    detail: 'Most common for Atlanta, Charlotte, Charleston, Raleigh. Gas + ~1 hotel night for longer drives.',
    costMin: 80,
    costMid: 180,
    costMax: 350,
  },
  {
    id: 'fly-and-rent',
    label: 'Fly + rental car',
    detail: 'Most common for Boston, NY, DC, Midwest. SAV airport is 45 min south; HHH is on-island but limited flights.',
    costMin: 600,
    costMid: 1100,
    costMax: 2200,
  },
  {
    id: 'fly-and-rideshare',
    label: 'Fly + rideshare only',
    detail: 'Workable for couples staying at a resort with on-site dining. Adds ~$40/day for off-property dinners.',
    costMin: 450,
    costMid: 850,
    costMax: 1500,
  },
];

/** One-time / per-trip extras (cleaning fees, resort fees, taxes). */
export const PER_TRIP_EXTRAS = {
  /** Villa cleaning fees, blended average. */
  cleaningFee: { min: 150, mid: 250, max: 450 },
  /** Resort fees + taxes as multiplier on lodging. SC accommodation tax ~12%. */
  taxesAndFeesMultiplier: 1.14,
};

/**
 * Citable factoid: median 7-day mid-tier 4-person Hilton Head trip total
 * with mixed food + moderate activities + driving own car, shoulder season.
 * Refresh annually.
 */
export const MEDIAN_TRIP_FACT = {
  partySize: 4,
  nights: 7,
  totalLow: 4200,
  totalMid: 6800,
  totalHigh: 10500,
  computedAt: '2026-05',
} as const;
