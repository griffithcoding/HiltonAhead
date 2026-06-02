/**
 * Rental-specific editorial per neighborhood for /vacation-rentals/[slug].
 *
 * Geofence centers are the canonical lat/lng from data/neighborhoods.ts.
 * Keep the two in sync — if a neighborhood center changes there, change it here.
 *
 * `bestForLinks` produce Stay22 search deeplinks (see app/lib/stay22.ts). Each
 * param object is merged into the Stay22 query string by stay22SearchDeeplink().
 */

import type { RentalNeighborhoodSlug } from '@/data/rentalsCatalog';

export type RentalAreaContent = {
  readonly slug: RentalNeighborhoodSlug;
  readonly name: string;
  readonly seoTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly heroImage: { readonly src: string; readonly alt: string };
  readonly geofence: {
    readonly center: { readonly lat: number; readonly lng: number };
    readonly zoom: number;
  };
  /** ≤ 280 chars; rendered in <TldrBlock> (Speakable selector .tldr-block). */
  readonly tldr: string;
  readonly vibe: string;
  readonly whoFor: ReadonlyArray<string>;
  readonly beachAccess: string;
  readonly topAmenities: ReadonlyArray<string>;
  readonly quickFacts: ReadonlyArray<{ readonly label: string; readonly value: string }>;
  readonly bestForLinks: ReadonlyArray<{
    readonly label: string;
    readonly params: Record<string, string | number>;
  }>;
  readonly faq: ReadonlyArray<{ readonly question: string; readonly answer: string }>;
};

const seaPines: RentalAreaContent = {
  slug: 'sea-pines',
  name: 'Sea Pines',
  seoTitle: 'Sea Pines Vacation Rentals — Villas & Homes (2026) | Hilton Ahead',
  metaDescription:
    'Browse curated Sea Pines vacation rentals on Hilton Head: oceanfront villas, walkable South Beach condos, and golf homes — with a live map, price bands, and local picks.',
  h1: 'Sea Pines Vacation Rentals',
  heroImage: { src: '/rentals/sea-pines/hero.jpg', alt: 'Sea Pines oceanfront villas at golden hour' },
  // lat/lng from data/neighborhoods.ts sea-pines entry
  geofence: { center: { lat: 32.134, lng: -80.808 }, zoom: 13 },
  tldr:
    "Sea Pines is the island's iconic 5,200-acre gated original. Expect roughly $300–800/night in summer; most South Beach villas are a 90-second walk to sand and an easy bike to Harbour Town.",
  vibe:
    'The postcard Hilton Head: Harbour Town lighthouse, the Liberty Oak, three resort courses, and 17 miles of bike path. Premium address, best walkable oceanfront on the island.',
  whoFor: [
    'Couples & first-time visitors',
    'Golf trips (Harbour Town access)',
    'Multi-generational family reunions',
    'Anniversaries & proposals',
  ],
  beachAccess:
    'South Beach Lane villas sit ~90 seconds from the sand. Most interior villas are a 5–10 minute bike ride to the nearest beach access.',
  topAmenities: ['Gated entry', 'Resort pools', 'Bike paths', 'On-property golf'],
  quickFacts: [
    { label: 'Summer nightly range (3BR)', value: '$500–800' },
    { label: 'Walk to beach (South Beach)', value: '~90 seconds' },
    { label: 'Gate-in traffic', value: '10am–12pm summer' },
  ],
  bestForLinks: [
    { label: 'Oceanfront villas', params: { rooms: 1, query: 'oceanfront' } },
    { label: 'Family-friendly (kids)', params: { adults: 2, children: 2 } },
    { label: 'Golf trips (4+)', params: { adults: 4 } },
    { label: 'Pet-friendly', params: { query: 'pet friendly' } },
  ],
  faq: [
    {
      question: 'Is there a gate fee to enter Sea Pines?',
      answer:
        'Sea Pines charges a daily vehicle pass for non-guests, but it is waived or included for most overnight rental guests. Confirm with your specific property before arrival.',
    },
    {
      question: 'How far is Sea Pines from the beach?',
      answer:
        'South Beach Lane villas are about a 90-second walk to the sand. Interior villas are typically a 5–10 minute bike ride to the nearest of several beach accesses.',
    },
    {
      question: 'When should I book a Sea Pines rental for summer?',
      answer:
        'The best South Beach villas book 6–9 months out for June–August. Shoulder season (April–May, September–October) opens up 2–3 months ahead at noticeably lower rates.',
    },
  ],
};

/**
 * Remaining 5 areas. Centers are the canonical lat/lng from
 * data/neighborhoods.ts. Editorial is adapted from each neighborhood's existing
 * `hook` / `reasons` / `bestFor` / `tradeoffs` / `properties` in that file —
 * keep the voice consistent with seaPines above. Fill `heroImage.src` with a
 * real hosted asset before launch (see public/rentals/LICENSING.md).
 */
const palmettoDunes: RentalAreaContent = {
  slug: 'palmetto-dunes',
  name: 'Palmetto Dunes',
  seoTitle: 'Palmetto Dunes Vacation Rentals — Villas & Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Palmetto Dunes vacation rentals on Hilton Head: lagoon-view condos, oceanfront villas, three golf courses, and the free resort trolley — with a live map and price bands.',
  h1: 'Palmetto Dunes Vacation Rentals',
  heroImage: { src: '/rentals/palmetto-dunes/hero.jpg', alt: 'Palmetto Dunes lagoon and villas' },
  // lat/lng from data/neighborhoods.ts palmetto-dunes entry
  geofence: { center: { lat: 32.19, lng: -80.741 }, zoom: 13 },
  tldr:
    'Palmetto Dunes is the family-and-golf resort core: three courses, an 11-mile lagoon for kayaking, and a free trolley. Summer rentals run roughly $300–700/night.',
  vibe:
    'Mid-island resort living built for families and golfers. Oceanfront to lagoon-side, with the most self-contained amenity set on the island.',
  whoFor: ['Families with kids', 'Golf groups', 'Watersports lovers', 'Resort-amenity seekers'],
  beachAccess:
    'Oceanfront villas open onto the sand; lagoon-side condos are a short shuttle or bike ride to the beach.',
  topAmenities: ['3 golf courses', '11-mile lagoon', 'Free trolley', 'Tennis & pickleball'],
  quickFacts: [
    { label: 'Summer nightly range (2BR)', value: '$300–500' },
    { label: 'Golf courses on-property', value: '3' },
    { label: 'Lagoon length', value: '11 miles' },
  ],
  bestForLinks: [
    { label: 'Oceanfront villas', params: { query: 'oceanfront' } },
    { label: 'Family condos', params: { adults: 2, children: 2 } },
    { label: 'Golf groups (4+)', params: { adults: 4 } },
    { label: 'Lagoon view', params: { query: 'lagoon' } },
  ],
  faq: [
    {
      question: 'Does Palmetto Dunes have a free shuttle?',
      answer:
        'Yes — a complimentary trolley loops the resort in season, connecting villas, the beach, and dining so you can leave the car parked.',
    },
    {
      question: 'Is Palmetto Dunes good for non-golfers?',
      answer:
        'Very. The 11-mile lagoon system is ideal for kayaking and fishing, and the beach and pools draw families who never pick up a club.',
    },
  ],
};

const forestBeach: RentalAreaContent = {
  slug: 'forest-beach',
  name: 'Forest Beach',
  seoTitle: 'Forest Beach Vacation Rentals — Walk-to-Coligny Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Forest Beach vacation rentals: walk-to-Coligny condos and beach flats on Hilton Head, with a live map, price bands, and local picks. The most walkable beach pocket.',
  h1: 'Forest Beach Vacation Rentals',
  heroImage: { src: '/rentals/forest-beach/hero.jpg', alt: 'Forest Beach near Coligny Plaza' },
  // lat/lng from data/neighborhoods.ts forest-beach entry
  geofence: { center: { lat: 32.141, lng: -80.788 }, zoom: 14 },
  tldr:
    'Forest Beach is the walkable beach pocket beside Coligny Plaza — shops, dining, and sand all on foot. Summer condos run roughly $200–450/night.',
  vibe:
    'The no-car-needed neighborhood. Park once and walk to the beach, Coligny shops, and casual dining. Best value oceanfront-adjacent on the island.',
  whoFor: ['Couples', 'Small families', 'Walkability seekers', 'Shorter stays'],
  beachAccess: 'Most Forest Beach condos are a 3–7 minute walk to the sand via Coligny Beach Park.',
  topAmenities: ['Walk to Coligny', 'Beach access', 'Community pools', 'Casual dining'],
  quickFacts: [
    { label: 'Summer nightly range (1–2BR)', value: '$220–450' },
    { label: 'Walk to Coligny', value: '3–7 min' },
    { label: 'Car needed', value: 'No' },
  ],
  bestForLinks: [
    { label: 'Walk-to-beach condos', params: { query: 'beach' } },
    { label: 'Budget-friendly', params: { query: 'value' } },
    { label: 'Couples', params: { adults: 2 } },
    { label: 'Pet-friendly', params: { query: 'pet friendly' } },
  ],
  faq: [
    {
      question: 'Can I get by without a car in Forest Beach?',
      answer:
        'Yes — Coligny Plaza, the beach, and several restaurants are all walkable. A car or bike helps for exploring the rest of the island.',
    },
    {
      question: 'Is Forest Beach cheaper than Sea Pines?',
      answer:
        'Generally, yes. You trade the gated-resort premium for walkability and still get excellent beach access.',
    },
  ],
};

const shelterCove: RentalAreaContent = {
  slug: 'shelter-cove',
  name: 'Shelter Cove',
  seoTitle: 'Shelter Cove Vacation Rentals — Marina Condos (2026) | Hilton Ahead',
  metaDescription:
    'Curated Shelter Cove vacation rentals on Hilton Head: marina-front condos near Harbourfest fireworks and dining, with a live map and price bands.',
  h1: 'Shelter Cove Vacation Rentals',
  heroImage: { src: '/rentals/shelter-cove/hero.jpg', alt: 'Shelter Cove marina at dusk' },
  // lat/lng from data/neighborhoods.ts shelter-cove entry
  geofence: { center: { lat: 32.182, lng: -80.731 }, zoom: 14 },
  tldr:
    'Shelter Cove is the marina-and-dining hub on Broad Creek — walkable to Harbourfest summer fireworks. Condos run roughly $250–450/night in summer.',
  vibe:
    'Harbor-side living centered on the marina, the Sunday market, and the Tuesday Harbourfest fireworks. Calm water, not oceanfront — a short hop to the beach.',
  whoFor: ['Couples', 'Families wanting calm water', 'Boaters', 'Foodies'],
  beachAccess: 'Not oceanfront — the nearest ocean beach is a 5–10 minute drive; the marina is on Broad Creek.',
  topAmenities: ['Marina', 'Harbourfest fireworks', 'Waterfront dining', 'Community pools'],
  quickFacts: [
    { label: 'Summer nightly range (2BR)', value: '$250–450' },
    { label: 'Setting', value: 'Marina / Broad Creek' },
    { label: 'Drive to ocean beach', value: '5–10 min' },
  ],
  bestForLinks: [
    { label: 'Marina-view condos', params: { query: 'marina' } },
    { label: 'Families', params: { adults: 2, children: 2 } },
    { label: 'Couples', params: { adults: 2 } },
    { label: 'Near dining', params: { query: 'restaurants' } },
  ],
  faq: [
    {
      question: 'Is Shelter Cove on the ocean?',
      answer:
        'No — it sits on Broad Creek around the marina. The calm water is great for kayaking and boating; ocean beaches are a short 5–10 minute drive.',
    },
    {
      question: 'What are the summer fireworks?',
      answer:
        'Harbourfest runs Tuesday evenings in summer with live music and fireworks over the marina — many Shelter Cove rentals have a front-row view.',
    },
  ],
};

const portRoyal: RentalAreaContent = {
  slug: 'port-royal',
  name: 'Port Royal',
  seoTitle: 'Port Royal Vacation Rentals — Gated Homes & Villas (2026) | Hilton Ahead',
  metaDescription:
    'Curated Port Royal vacation rentals on Hilton Head: quiet gated homes and villas near tennis and golf, with a live map and price bands. Great for larger groups.',
  h1: 'Port Royal Vacation Rentals',
  heroImage: { src: '/rentals/port-royal/hero.jpg', alt: 'Port Royal gated community home' },
  // lat/lng from data/neighborhoods.ts port-royal entry
  geofence: { center: { lat: 32.225, lng: -80.690 }, zoom: 13 },
  tldr:
    'Port Royal is a quiet north-end gated plantation with tennis, golf, and roomy homes — our pick for larger groups who want a private pool. Summer homes run roughly $400–700/night.',
  vibe:
    'Residential, gated, and calm on the island\'s north end. Bigger homes and a tennis/golf focus, away from the busiest tourist crush.',
  whoFor: ['Multi-gen groups', 'Tennis players', 'Quiet seekers', 'Private-pool seekers'],
  beachAccess: 'Beach access is via the community; most rentals are a short drive or shuttle to the sand.',
  topAmenities: ['Gated', 'Tennis center', 'Golf', 'Larger homes'],
  quickFacts: [
    { label: 'Summer nightly range (4BR)', value: '$480–700' },
    { label: 'Setting', value: 'Gated, north end' },
    { label: 'Best for', value: 'Groups & families' },
  ],
  bestForLinks: [
    { label: 'Homes with private pool', params: { query: 'private pool' } },
    { label: 'Large groups (8+)', params: { adults: 8 } },
    { label: 'Tennis trips', params: { query: 'tennis' } },
    { label: 'Quiet/secluded', params: { query: 'quiet' } },
  ],
  faq: [
    {
      question: 'Is Port Royal good for big families?',
      answer:
        'Yes — it has some of the island\'s roomier rental homes with private pools, and the gated setting keeps things calm for multi-generational groups.',
    },
    {
      question: 'How far is Port Royal from the beach?',
      answer:
        'Beach access is through the community; most homes are a short drive or shuttle ride to the sand rather than a direct walk.',
    },
  ],
};

const midIsland: RentalAreaContent = {
  slug: 'mid-island',
  name: 'Mid-Island',
  seoTitle: 'Mid-Island Vacation Rentals — Central Hilton Head (2026) | Hilton Ahead',
  metaDescription:
    'Curated mid-island Hilton Head vacation rentals near Folly Field and Singleton beaches: central, well-priced villas with a live map and price bands.',
  h1: 'Mid-Island Vacation Rentals',
  heroImage: { src: '/rentals/mid-island/hero.jpg', alt: 'Mid-island Hilton Head villa near Folly Field' },
  // lat/lng from data/neighborhoods.ts mid-island entry
  geofence: { center: { lat: 32.183, lng: -80.722 }, zoom: 13 },
  tldr:
    'Mid-island is the central, well-priced base camp near Folly Field and Singleton beaches — short drives to everything. Summer villas run roughly $250–500/night.',
  vibe:
    'The practical middle of the island: less resort polish, more value and central location. Folly Field and Singleton beaches are the local-favorite sands here.',
  whoFor: ['Budget-conscious families', 'Central-location seekers', 'Repeat visitors', 'Longer stays'],
  beachAccess: 'Folly Field and Singleton Beach accesses are a short walk or drive from most mid-island rentals.',
  topAmenities: ['Central location', 'Folly Field beach', 'Value pricing', 'Community pools'],
  quickFacts: [
    { label: 'Summer nightly range (3BR)', value: '$300–500' },
    { label: 'Setting', value: 'Central island' },
    { label: 'Nearest beaches', value: 'Folly Field, Singleton' },
  ],
  bestForLinks: [
    { label: 'Walk-to-beach (Folly Field)', params: { query: 'folly field' } },
    { label: 'Value villas', params: { query: 'value' } },
    { label: 'Families', params: { adults: 2, children: 2 } },
    { label: 'Longer stays', params: { query: 'monthly' } },
  ],
  faq: [
    {
      question: 'What beaches are near mid-island rentals?',
      answer:
        'Folly Field Beach and Singleton Beach are the closest — both are local favorites and less crowded than Coligny.',
    },
    {
      question: 'Is mid-island cheaper than the gated plantations?',
      answer:
        'Usually, yes. You trade resort gates and on-property golf for a central location and lower nightly rates.',
    },
  ],
};

export const rentalAreas: Readonly<
  Record<RentalNeighborhoodSlug, RentalAreaContent>
> = {
  'sea-pines': seaPines,
  'palmetto-dunes': palmettoDunes,
  'forest-beach': forestBeach,
  'shelter-cove': shelterCove,
  'port-royal': portRoyal,
  'mid-island': midIsland,
};

export function getRentalArea(
  slug: string,
): RentalAreaContent | undefined {
  return (rentalAreas as Record<string, RentalAreaContent>)[slug];
}

export function allRentalAreas(): RentalAreaContent[] {
  return Object.values(rentalAreas);
}
