/**
 * Curated vacation-rental catalog for /vacation-rentals.
 *
 * Hand-maintained — NOT fetched from an API. Each entry is an editor's pick
 * linked out to a partner site via an affiliate-stamped deeplink.
 *
 * CARD-SHAPE STABILITY IS A HARD REQUIREMENT. If/when a live API (Stay22
 * Enterprise/Roam, Booking.com Affiliate API) replaces this module, it MUST
 * return objects matching `CatalogRental` so RentalCard/RentalGrid don't change.
 *
 * PHOTOS: host in /public/rentals/<neighborhood>/<id>-<n>.jpg. Do NOT hotlink
 * Airbnb/Booking/VRBO image URLs (TOS exposure). See public/rentals/LICENSING.md.
 *
 * PRICING: use bands ("$450–650 / night summer"), never a hard nightly rate —
 * we don't control live pricing and bands age gracefully.
 */

export type RentalSource = 'booking' | 'vrbo' | 'airbnb' | 'hotels' | 'direct';

export type RentalNeighborhoodSlug =
  | 'sea-pines'
  | 'palmetto-dunes'
  | 'forest-beach'
  | 'shelter-cove'
  | 'port-royal'
  | 'mid-island';

export const RENTAL_NEIGHBORHOODS: readonly RentalNeighborhoodSlug[] = [
  'sea-pines',
  'palmetto-dunes',
  'forest-beach',
  'shelter-cove',
  'port-royal',
  'mid-island',
] as const;

export type CatalogRental = {
  /** Stable unique id, e.g. 'sp-south-beach-villa-1'. Used in URLs/anchors. */
  readonly id: string;
  readonly neighborhood: RentalNeighborhoodSlug;
  /** Headline, e.g. "3BR Oceanfront Villa, South Beach". */
  readonly title: string;
  /** 1–8 photos hosted under /public/rentals/... (leading slash). */
  readonly photoUrls: ReadonlyArray<string>;
  readonly beds: number;
  readonly baths: number;
  /** Optional — omit when unknown. Most aggregators don't expose sqft. */
  readonly sqft?: number;
  /** Human price band, e.g. "$450–650 / night summer · $250–400 shoulder". */
  readonly pricePerNightBand: string;
  /** Short amenity chips, e.g. ['Private pool', 'Beachfront', 'Golf cart']. */
  readonly amenities: ReadonlyArray<string>;
  /** Optional star rating 0–5 and review count, shown only when present. */
  readonly rating?: number;
  readonly reviewCount?: number;
  /** Affiliate-stamped outbound URL (pass through withStay22Params at render). */
  readonly bookingDeeplink: string;
  readonly source: RentalSource;
  /** 1–2 sentences: why we picked it. Editorial voice. */
  readonly editorialNote: string;
};

/**
 * SEED DATA — 6 representative entries to ship a non-empty grid. Expand to
 * ~6 per neighborhood (36 total) during the curation pass (owner task, tracked
 * in the spec's open-items table). Replace placeholder photoUrls with real
 * hosted assets and real partner deeplinks before launch.
 */
export const rentalsCatalog: ReadonlyArray<CatalogRental> = [
  {
    id: 'sp-south-beach-villa-1',
    neighborhood: 'sea-pines',
    title: '3BR Oceanfront Villa · South Beach Lane',
    photoUrls: ['/rentals/sea-pines/sp-south-beach-villa-1-1.jpg'],
    beds: 3,
    baths: 2,
    pricePerNightBand: '$520–780 / night summer · $290–420 shoulder',
    amenities: ['Oceanfront', 'Shared pool', 'Bikes included', '90 sec to sand'],
    rating: 4.8,
    reviewCount: 124,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Sea+Pines+Hilton+Head',
    source: 'booking',
    editorialNote:
      'Our most-booked South Beach pocket — short walk to the sand and an easy bike to Harbour Town.',
  },
  {
    id: 'pd-shelter-cove-condo-1',
    neighborhood: 'palmetto-dunes',
    title: '2BR Lagoon-View Condo · Palmetto Dunes',
    photoUrls: ['/rentals/palmetto-dunes/pd-shelter-cove-condo-1-1.jpg'],
    beds: 2,
    baths: 2,
    pricePerNightBand: '$310–460 / night summer · $190–280 shoulder',
    amenities: ['Lagoon view', 'Resort pool', 'Tennis', 'Free trolley'],
    rating: 4.7,
    reviewCount: 88,
    bookingDeeplink: 'https://www.vrbo.com/search?destination=Palmetto+Dunes+Hilton+Head',
    source: 'vrbo',
    editorialNote:
      'Best value for families who want the resort amenities without the oceanfront premium.',
  },
  {
    id: 'fb-coligny-flat-1',
    neighborhood: 'forest-beach',
    title: '1BR Walk-to-Coligny Flat',
    photoUrls: ['/rentals/forest-beach/fb-coligny-flat-1-1.jpg'],
    beds: 1,
    baths: 1,
    pricePerNightBand: '$220–340 / night summer · $140–210 shoulder',
    amenities: ['Walk to Coligny', '3 min to beach', 'Pool'],
    rating: 4.6,
    reviewCount: 53,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Forest+Beach+Hilton+Head',
    source: 'booking',
    editorialNote: 'Park the car once — Coligny shops, dining, and the beach are all on foot.',
  },
  {
    id: 'sc-marina-condo-1',
    neighborhood: 'shelter-cove',
    title: '2BR Marina-Front Condo · Shelter Cove',
    photoUrls: ['/rentals/shelter-cove/sc-marina-condo-1-1.jpg'],
    beds: 2,
    baths: 2,
    pricePerNightBand: '$280–420 / night summer · $170–260 shoulder',
    amenities: ['Marina view', 'Pool', 'Walk to Harbourfest'],
    rating: 4.5,
    reviewCount: 41,
    bookingDeeplink: 'https://www.vrbo.com/search?destination=Shelter+Cove+Hilton+Head',
    source: 'vrbo',
    editorialNote: 'Front-row seat to the Tuesday Harbourfest fireworks all summer.',
  },
  {
    id: 'pr-sound-home-1',
    neighborhood: 'port-royal',
    title: '4BR Sound-Side Home · Port Royal',
    photoUrls: ['/rentals/port-royal/pr-sound-home-1-1.jpg'],
    beds: 4,
    baths: 3,
    sqft: 2400,
    pricePerNightBand: '$480–690 / night summer · $300–430 shoulder',
    amenities: ['Private pool', 'Gated', 'Tennis', 'Quiet'],
    rating: 4.7,
    reviewCount: 36,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Port+Royal+Hilton+Head',
    source: 'booking',
    editorialNote: 'Roomy, gated, and quiet — our pick for multi-gen groups who want a pool.',
  },
  {
    id: 'mi-mid-island-villa-1',
    neighborhood: 'mid-island',
    title: '3BR Villa near Folly Field',
    photoUrls: ['/rentals/mid-island/mi-mid-island-villa-1-1.jpg'],
    beds: 3,
    baths: 2,
    pricePerNightBand: '$300–450 / night summer · $180–270 shoulder',
    amenities: ['Walk to Folly Field beach', 'Pool', 'Central location'],
    rating: 4.4,
    reviewCount: 29,
    bookingDeeplink: 'https://www.booking.com/searchresults.html?ss=Hilton+Head+Island',
    source: 'booking',
    editorialNote: 'Central base camp — short drive to everything, Folly Field beach on foot.',
  },
];

export function rentalsByNeighborhood(
  slug: RentalNeighborhoodSlug,
): CatalogRental[] {
  return rentalsCatalog.filter((r) => r.neighborhood === slug);
}

export function allRentals(): CatalogRental[] {
  return [...rentalsCatalog];
}
