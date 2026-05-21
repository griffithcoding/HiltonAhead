/**
 * Marriott Bonvoy properties on Hilton Head Island.
 *
 * Used by /marriott-bonvoy-stays-hilton-head to render the per-property cards
 * + ItemList JSON-LD. Single source of truth — do not duplicate property
 * facts elsewhere in the codebase.
 *
 * `bookingUrl` is a marriott.com URL (property-specific where available,
 * filtered search otherwise). The AffiliateCard pipeline stamps the
 * Bonvoy tracking ID onto these URLs at render time via the `marriott`
 * program entry in `data/affiliateLinks.ts` — once approved through
 * Impact.com, set AFFILIATE_MARRIOTT_AID in Vercel and tracking activates.
 */

export type MarriottBrand =
  | 'Marriott Vacation Club'
  | 'Westin Resort'

export interface MarriottProperty {
  slug: string
  name: string
  brand: MarriottBrand
  neighborhood: string
  oceanfront: boolean
  /** One-line positioning shown under the card name. */
  positioning: string
  /** Insider take — 2–3 sentences. The HiltonAhead voice, not Marriott marketing copy. */
  insiderTake: string
  /** Who it's for. Used in the TL;DR card and for matchmaker UI later. */
  bestFor: string
  pros: string[]
  cons: string[]
  /** Approximate per-night range (cash, peak season). Pre-tax. */
  cashRangeUsd: { min: number; max: number }
  /** Bonvoy points range per night (peak). */
  pointsRange: { min: number; max: number }
  /** Direct booking URL (will receive the Impact tracking ID stamp). */
  bookingUrl: string
}

export const MARRIOTT_PROPERTIES: ReadonlyArray<MarriottProperty> = [
  {
    slug: 'grande-ocean',
    name: "Marriott's Grande Ocean",
    brand: 'Marriott Vacation Club',
    neighborhood: 'South Forest Beach (Sea Pines side)',
    oceanfront: true,
    positioning: 'The classic oceanfront villa choice — biggest footprint, broadest amenity set.',
    insiderTake:
      "Built in the 1990s and continuously refreshed, Grande Ocean is the property most people picture when they imagine a Marriott Vacation Club week on Hilton Head. Direct beach access, multiple pools, kids' programming in summer. The 2-bedroom oceanside units book up 9 months out for peak weeks — start early.",
    bestFor: 'Multi-generational families wanting full amenities and a known-quantity experience.',
    pros: [
      'True oceanfront — short boardwalk to the sand',
      'Full kitchens, washer/dryer in every unit',
      'Largest amenity set of the MVC properties (pools, kids club, gym, restaurant on-site)',
    ],
    cons: [
      'Peak-week availability is brutal — book 6–9 months ahead',
      'Carries the highest cash rates of the MVC HHI properties',
    ],
    cashRangeUsd: { min: 450, max: 1200 },
    pointsRange: { min: 60000, max: 120000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhgo-marriotts-grande-ocean/overview/',
  },
  {
    slug: 'surfwatch',
    name: "Marriott's SurfWatch",
    brand: 'Marriott Vacation Club',
    neighborhood: 'Mid-island / Folly Field area',
    oceanfront: true,
    positioning: 'The newer build — more modern interiors, family pool complex.',
    insiderTake:
      'Built in the late 2000s, SurfWatch feels noticeably newer than Grande Ocean — open-plan kitchens, brighter interiors, a serious pool complex with a lazy river. The trade-off is location: the north end of the island feels more residential and the dining walk is longer than Sea Pines. Worth it for families who prioritize the pool over the village.',
    bestFor: 'Families with younger kids who will live at the pool complex more than the beach itself.',
    pros: [
      'Newer construction — modern finishes, better unit layouts',
      'Lazy river + multi-pool complex is the best on-property pool setup on HHI',
      'Lower cash rates than Grande Ocean for equivalent unit size',
    ],
    cons: [
      'North end means longer drives to Sea Pines / Harbour Town',
      'Less mature landscaping and tree canopy than the older MVC properties',
    ],
    cashRangeUsd: { min: 380, max: 950 },
    pointsRange: { min: 50000, max: 100000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhsw-marriotts-surfwatch/overview/',
  },
  {
    slug: 'barony-beach-club',
    name: "Marriott's Barony Beach Club",
    brand: 'Marriott Vacation Club',
    neighborhood: 'Port Royal Plantation (north end)',
    oceanfront: true,
    positioning: 'Quietest of the oceanfront MVC properties — gated within Port Royal.',
    insiderTake:
      "Inside the gates of Port Royal Plantation, which means a quieter, more residential feel than Sea Pines or the Coligny area. Barony's beach is less crowded than Grande Ocean's stretch because Port Royal is a residential gate-controlled community, not a public-access plantation. The downside: nothing walkable. You drive for everything except the beach.",
    bestFor: 'Couples and small families wanting quiet, with a car-based vacation rhythm.',
    pros: [
      'Genuinely quiet beach — Port Royal is less trafficked than Coligny stretches',
      'Gated community access is a real amenity for some travelers',
      'Direct beach access from the property',
    ],
    cons: [
      'No walkable dining or shopping — every meal out requires a car',
      'Property is dated compared to SurfWatch',
    ],
    cashRangeUsd: { min: 360, max: 900 },
    pointsRange: { min: 50000, max: 100000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhbb-marriotts-barony-beach-club/overview/',
  },
  {
    slug: 'monarch-at-sea-pines',
    name: "Marriott's Monarch at Sea Pines",
    brand: 'Marriott Vacation Club',
    neighborhood: 'Sea Pines (oceanfront, southern end)',
    oceanfront: true,
    positioning: 'Small, intimate Sea Pines oceanfront — for travelers who want the address, not the crowd.',
    insiderTake:
      "Significantly smaller than Grande Ocean — fewer units, fewer amenities, less commotion. The reason to book Monarch is the Sea Pines address and direct beach access without Grande Ocean's volume. Sea Pines gate pass, Harbour Town five minutes away, and the kind of quiet you don't get at the bigger MVC properties.",
    bestFor: 'Couples or small families who specifically want Sea Pines without resort-scale crowds.',
    pros: [
      'Inside Sea Pines — biking distance to Harbour Town, Lawton Stables, the beach club',
      'Small footprint means less crowded pool and beach',
      'Walking distance to South Beach Marina dining',
    ],
    cons: [
      'Fewer on-site amenities than the bigger MVC properties',
      'Sea Pines gate pass adds ~$25–$50/week per car for non-resident guests',
    ],
    cashRangeUsd: { min: 420, max: 1100 },
    pointsRange: { min: 55000, max: 110000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhms-marriotts-monarch-at-sea-pines/overview/',
  },
  {
    slug: 'heritage-club-at-harbour-town',
    name: "Marriott's Heritage Club at Harbour Town",
    brand: 'Marriott Vacation Club',
    neighborhood: 'Harbour Town (Sea Pines)',
    oceanfront: false,
    positioning: 'The golfer’s pick — steps from Harbour Town Golf Links and the lighthouse.',
    insiderTake:
      "Not oceanfront — and that's the whole point. Heritage Club sits inside Harbour Town, a 90-second walk to the 18th green of the RBC Heritage course. If golf is the trip, this is the address. Beach access is a short drive (or shuttle) to South Beach. The marina restaurants and Harbour Town shops are at your feet.",
    bestFor: 'Golf groups, golf-trip couples, and anyone whose vacation rhythm orbits Harbour Town.',
    pros: [
      'Walk to Harbour Town Golf Links, the Heritage course, and the lighthouse village',
      'Lower nightly rate than oceanfront MVC properties',
      'Bike paths connect you to all of Sea Pines in 10–20 minutes',
    ],
    cons: [
      'Not on the beach — beach access requires a drive or bike',
      'Harbour Town gets busy during RBC Heritage week (April) — book around or in',
    ],
    cashRangeUsd: { min: 320, max: 800 },
    pointsRange: { min: 45000, max: 90000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhhc-marriotts-heritage-club-at-harbour-town/overview/',
  },
  {
    slug: 'sunset-pointe-at-shelter-cove',
    name: "Marriott's Sunset Pointe at Shelter Cove",
    brand: 'Marriott Vacation Club',
    neighborhood: 'Shelter Cove (mid-island, marina side)',
    oceanfront: false,
    positioning: 'Marina-side, not beach-side — the boater’s and calm-water family’s pick.',
    insiderTake:
      "Sunset Pointe is on Broad Creek, not the ocean. That sounds like a downgrade until you have small kids who can't handle ocean surf, or a fishing family who wants the marina at the doorstep. Sunset views over the marsh are genuinely the best on the island. The trade-off is a 5-minute drive (or trolley) to the actual beach.",
    bestFor: 'Families with kids under 6, fishing-oriented trips, and travelers who prioritize marsh sunsets.',
    pros: [
      'Best sunset views on the island, every night',
      'Marina at the doorstep — kayak rentals, dolphin tours, fishing charters',
      'Lowest cash rates of the HHI MVC properties',
    ],
    cons: [
      'Not on the beach — 5–10 min drive to oceanfront sand',
      'Smaller property than the oceanfront MVC sites — fewer pool options',
    ],
    cashRangeUsd: { min: 280, max: 700 },
    pointsRange: { min: 40000, max: 80000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhsp-marriotts-sunset-pointe-at-shelter-cove/overview/',
  },
  {
    slug: 'westin-hilton-head-island',
    name: 'The Westin Hilton Head Island Resort & Spa',
    brand: 'Westin Resort',
    neighborhood: 'Port Royal Plantation (north end)',
    oceanfront: true,
    positioning: 'The only full-service Bonvoy hotel on the island — for when you want a hotel, not a villa.',
    insiderTake:
      "If you want a hotel — daily housekeeping, a real check-in desk, a concierge, restaurants in the lobby — this is the only Bonvoy property on Hilton Head that delivers it. Heavenly Beds, full spa, oceanfront pool deck. The trade-off versus the MVC villas: no kitchen, smaller footprint, and a per-night rate that lands higher than mid-tier villa stays.",
    bestFor: 'Couples on shorter trips, anniversary/honeymoon weekends, business travelers who happen to need a beach.',
    pros: [
      'Full-service hotel — concierge, spa, restaurants, daily housekeeping',
      'Best on-property dining of any Bonvoy property on the island',
      'Easier to book peak weeks than the MVC villas',
    ],
    cons: [
      'No kitchen — food costs run higher than a villa stay',
      'Standard hotel rooms feel small after a multi-bedroom villa',
    ],
    cashRangeUsd: { min: 350, max: 900 },
    pointsRange: { min: 50000, max: 100000 },
    bookingUrl:
      'https://www.marriott.com/en-us/hotels/hhhwi-the-westin-hilton-head-island-resort-and-spa/overview/',
  },
]

/** Default search-style URL — used when a specific property URL isn't appropriate. */
export const MARRIOTT_HHI_SEARCH_URL =
  'https://www.marriott.com/search/findHotels.mi?destinationAddress.destination=Hilton+Head+Island%2C+SC&searchType=InCity'
