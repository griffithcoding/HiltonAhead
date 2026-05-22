// data/matchArchetypes.ts
/**
 * Stay archetypes for the Villa Match quiz.
 *
 * An archetype is a TYPE of stay (e.g., "4BR oceanfront in Palmetto Dunes"),
 * NOT a specific bookable unit. We don't keep a real inventory — we book from
 * public listings per trip. The quiz returns archetype matches; the founder
 * does the actual property pick after a client submits the itinerary form.
 *
 * Each archetype joins to data/neighborhoods.ts via `neighborhoodSlug`. The
 * UI surfaces 2-3 representative buildings from `neighborhoods[i].properties[]`,
 * filtered by `propertyNameFilters` when present.
 */

import type {
  TripType,
  ArchetypeView,
  ArchetypeWalk,
  Budget,
} from '@/components/villa-match/types';

export type MatchArchetype = {
  id: string;
  neighborhoodSlug: string;
  headline: string;
  bedrooms: { min: number; max: number };
  view: ArchetypeView;
  walkToBeach: ArchetypeWalk;
  budgetBand: Budget;
  bestForTripTypes: TripType[];
  whyItFits: string;
  whatToWatchOut: string;
  /** Filters into neighborhoods[i].properties[].name; falls back to first 2 if absent. */
  propertyNameFilters?: string[];
};

export const matchArchetypes: MatchArchetype[] = [
  // — COUPLES —
  {
    id: 'sea-pines-couples-1br-oceanfront',
    neighborhoodSlug: 'sea-pines',
    headline: '1BR oceanfront in Sea Pines',
    bedrooms: { min: 1, max: 1 },
    view: 'ocean',
    walkToBeach: 'steps',
    budgetBand: 'mid',
    bestForTripTypes: ['couples'],
    whyItFits:
      "Sea Pines is the postcard. South Beach Lane puts the ocean ninety seconds from the kitchen, and you're a fifteen-minute bike ride from Harbour Town for dinner. For a couple, this is the easiest yes on the island.",
    whatToWatchOut:
      'Sea Pines charges a per-vehicle gate pass on top of the rental — small, but show up knowing about it.',
    propertyNameFilters: undefined,
  },
  {
    id: 'palmetto-dunes-couples-2br-oceanfront',
    neighborhoodSlug: 'palmetto-dunes',
    headline: '2BR oceanfront in Palmetto Dunes',
    bedrooms: { min: 2, max: 2 },
    view: 'ocean',
    walkToBeach: 'steps',
    budgetBand: 'premium',
    bestForTripTypes: ['couples'],
    whyItFits:
      "Palmetto Dunes earns its reputation. The 2BR oceanfront stock here is tighter and quieter than Sea Pines and the bike path runs all the way to the lagoon. Bring a partner who likes a slower morning.",
    whatToWatchOut:
      'Premium pricing — there is no "value play" in oceanfront Palmetto Dunes; pick this only if the budget wants to be here.',
  },
  {
    id: 'forest-beach-couples-1br-walkable',
    neighborhoodSlug: 'forest-beach',
    headline: '1BR walk-to-beach in Forest Beach',
    bedrooms: { min: 1, max: 1 },
    view: 'mixed',
    walkToBeach: 'short-walk',
    budgetBand: 'value',
    bestForTripTypes: ['couples', 'friends'],
    whyItFits:
      "Forest Beach is the last walkable village left on the south end. Coligny is a six-minute walk; the beach is ten. For a sub-$5k weekend, this is the honest play — you spend less on the room and more on the meals out.",
    whatToWatchOut:
      'Coligny gets noisy on summer Saturdays. If quiet matters, ask for a unit set back from Pope Avenue.',
  },
  // — FAMILY (walk-to-beach) —
  {
    id: 'sea-pines-family-3br-walkable',
    neighborhoodSlug: 'sea-pines',
    headline: '3BR walk-to-beach in Sea Pines',
    bedrooms: { min: 3, max: 4 },
    view: 'mixed',
    walkToBeach: 'short-walk',
    budgetBand: 'mid',
    bestForTripTypes: ['family', 'friends'],
    whyItFits:
      "South Beach Lane and Beachside Tennis put a family within a four-minute walk of the sand and a bike-or-cart ride from Harbour Town. The 3BR price band drops 25% off oceanfront and you barely notice.",
    whatToWatchOut:
      'Some 3BRs sleep four comfortably, six tightly. We confirm the bedding setup before booking.',
  },
  {
    id: 'palmetto-dunes-family-4br-oceanfront',
    neighborhoodSlug: 'palmetto-dunes',
    headline: '4BR oceanfront in Palmetto Dunes',
    bedrooms: { min: 4, max: 4 },
    view: 'ocean',
    walkToBeach: 'steps',
    budgetBand: 'luxury',
    bestForTripTypes: ['family', 'wedding'],
    whyItFits:
      "If a family of eight wants the water from the kitchen and a private pool, this is the highest-confidence pick on the island. Three miles of unbroken beach, the lagoon for kayaks, and the bike path to the resort restaurants.",
    whatToWatchOut:
      'Demand is brutal between mid-June and mid-August — we lock these eighteen months out, not eighteen weeks.',
  },
  // — FAMILY (drive-to-beach, value end) —
  {
    id: 'forest-beach-family-4br-drive',
    neighborhoodSlug: 'forest-beach',
    headline: '4BR drive-to-beach in Forest Beach',
    bedrooms: { min: 4, max: 5 },
    view: 'mixed',
    walkToBeach: 'short-walk',
    budgetBand: 'mid',
    bestForTripTypes: ['family'],
    whyItFits:
      "The big single-family stock in Forest Beach is the family-of-eight sweet spot — a private pool, a cart for Coligny, and the beach a six-minute walk through the trees.",
    whatToWatchOut:
      'Older home stock means older kitchens. Tell us what matters — we filter for renovated kitchens hard.',
  },
  {
    id: 'shipyard-family-4br-marsh',
    neighborhoodSlug: 'shipyard',
    headline: '4BR with marsh view in Shipyard',
    bedrooms: { min: 4, max: 5 },
    view: 'marsh',
    walkToBeach: 'drive',
    budgetBand: 'value',
    bestForTripTypes: ['family', 'friends'],
    whyItFits:
      "Shipyard is the value-end of \"on-island gated\". Marsh-view villas trade ocean steps for 30% off the comparable Sea Pines line, and the security gate alone keeps the energy quiet at night.",
    whatToWatchOut:
      'Beach is a 4-minute drive or 12-minute bike. Plan the cart-share before you arrive — they sell out fast.',
  },
  // — GOLF —
  {
    id: 'sea-pines-golf-3br-on-course',
    neighborhoodSlug: 'sea-pines',
    headline: '3BR on-course in Sea Pines',
    bedrooms: { min: 3, max: 4 },
    view: 'golf',
    walkToBeach: 'drive',
    budgetBand: 'premium',
    bestForTripTypes: ['golf'],
    whyItFits:
      "On-course Sea Pines means a fairway view from the porch and Harbour Town tee-time priority for resort guests. The right villa puts you a cart-ride from the first tee on three different courses.",
    whatToWatchOut:
      'Beach is now a destination, not the front yard — a 6-minute drive or a 20-minute bike. Right tradeoff for a golf trip; wrong one for a beach trip.',
  },
  {
    id: 'palmetto-dunes-golf-3br-on-course',
    neighborhoodSlug: 'palmetto-dunes',
    headline: '3BR on-course in Palmetto Dunes',
    bedrooms: { min: 3, max: 4 },
    view: 'golf',
    walkToBeach: 'short-walk',
    budgetBand: 'premium',
    bestForTripTypes: ['golf'],
    whyItFits:
      "Palmetto Dunes' three courses share one cart-path system, so a foursome can hop between them inside the same resort. The 3BR on-course stock here is younger than Sea Pines and renovates more often.",
    whatToWatchOut:
      'Tee time priority here is by booking class, not address — we work the priority through the resort, not the villa owner.',
  },
  // — WEDDING / GROUP —
  {
    id: 'palmetto-dunes-wedding-7br-oceanfront',
    neighborhoodSlug: 'palmetto-dunes',
    headline: '7BR oceanfront estate in Palmetto Dunes',
    bedrooms: { min: 6, max: 8 },
    view: 'ocean',
    walkToBeach: 'steps',
    budgetBand: 'luxury',
    bestForTripTypes: ['wedding', 'family'],
    whyItFits:
      "Oceanfront estate stock for 12-16 guests is the rarest inventory class on the island. The right one has a ceremony-capable beach setback, two kitchens, and a generator. We hold these on a short list.",
    whatToWatchOut:
      'Most owners require a 2-night minimum on holiday weeks and a $5-10k refundable damage deposit. We clear the deposit terms before you sign.',
  },
  {
    id: 'sea-pines-wedding-6br-walkable',
    neighborhoodSlug: 'sea-pines',
    headline: '6BR walk-to-beach estate in Sea Pines',
    bedrooms: { min: 6, max: 7 },
    view: 'mixed',
    walkToBeach: 'short-walk',
    budgetBand: 'luxury',
    bestForTripTypes: ['wedding', 'family', 'friends'],
    whyItFits:
      "Sea Pines large-format villas back onto either Harbour Town or the South Beach corridor. For a wedding party that wants Hilton Head's iconic backdrops without buying out an oceanfront estate, this is the responsible luxury pick.",
    whatToWatchOut:
      'The largest 6BRs were once 4BRs with garage conversions — quality varies. We walk these properties on Tuesdays.',
  },
  // — VALUE COUPLES (off-island) —
  {
    id: 'bluffton-couples-2br-marsh',
    neighborhoodSlug: 'bluffton',
    headline: 'Marsh-view 2BR in Bluffton',
    bedrooms: { min: 1, max: 2 },
    view: 'marsh',
    walkToBeach: 'drive',
    budgetBand: 'value',
    bestForTripTypes: ['couples', 'friends'],
    whyItFits:
      "Bluffton is for the couple who already loves Hilton Head and wants to spend $400/night on dinner instead of the room. Old Town walking, May River sunsets, and Hilton Head a 12-minute drive across the bridge.",
    whatToWatchOut:
      'Beach is a real drive (15 minutes minimum, summer traffic adds 30). Pick this only if the trip is about food, water, and quiet — not about beach days.',
  },
  // — LUXURY OCEANFRONT —
  {
    id: 'sea-pines-luxury-5br-oceanfront',
    neighborhoodSlug: 'sea-pines',
    headline: '5BR oceanfront in Sea Pines',
    bedrooms: { min: 5, max: 5 },
    view: 'ocean',
    walkToBeach: 'steps',
    budgetBand: 'luxury',
    bestForTripTypes: ['family', 'friends', 'wedding'],
    whyItFits:
      "True oceanfront 5BR Sea Pines is the smallest inventory pool we book — fewer than thirty units across South Beach Lane and Beachside Tennis. Private pool, dune crossover, and the Harbour Town golf system.",
    whatToWatchOut:
      'Premium-of-the-premium pricing on holiday weeks. We negotiate hardest in the second half of September and the first week of October.',
  },
  // — FRIENDS GETAWAY (mid) —
  {
    id: 'forest-beach-friends-3br-walkable',
    neighborhoodSlug: 'forest-beach',
    headline: '3BR walk-to-beach in Forest Beach',
    bedrooms: { min: 3, max: 4 },
    view: 'mixed',
    walkToBeach: 'short-walk',
    budgetBand: 'mid',
    bestForTripTypes: ['friends', 'family'],
    whyItFits:
      "Six friends, walking to Coligny for dinner, walking to the beach in the morning. Forest Beach is the only neighborhood that lets you ditch the cars for a long weekend.",
    whatToWatchOut:
      'Parking is street-only on most of these. Two cars max if you want to keep the morning easy.',
  },
];
