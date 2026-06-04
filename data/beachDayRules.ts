/**
 * The local-knowledge layer behind the Hilton Head Beach Day Planner.
 *
 * This is the moat: which beach works at which tide, where the low-tide flats
 * and shark-tooth beds are, crowd + parking + shade reality. An OTA can fuse
 * tide APIs; it can't encode 30 years of "which beach, when, and why." Keep
 * every claim true to Hilton Head — this file is the product's credibility.
 *
 * Tide truth for HHI: the beaches are wide and flat. At LOW tide the sand
 * stretches out hard-packed — flats for shelling, shark teeth, tide pools,
 * beach biking. At HIGH tide the beach narrows and the swimming is best.
 * Afternoon sea breeze runs 12–18 mph (eats cheap umbrellas), so mornings win.
 */

export type BeachName =
  | 'Coligny Beach Park'
  | 'Burkes Beach'
  | 'Folly Field Beach Park'
  | 'Driessen Beach Park'
  | 'Alder Lane Beach'
  | 'Mitchelville Beach Park';

export type TideState = 'low' | 'high';

export interface Beach {
  name: BeachName;
  area: string;
  /** Lower = quieter. 1–5. */
  crowd: number;
  parking: string;
  /** What this beach is best at. */
  bestFor: TideState | 'any';
  note: string;
}

export const BEACHES: Record<BeachName, Beach> = {
  'Coligny Beach Park': {
    name: 'Coligny Beach Park',
    area: 'South Forest Beach (central)',
    crowd: 5,
    parking: 'Paid lot — fills by 10am in summer',
    bestFor: 'high',
    note: 'The main public access — showers, restrooms, Coligny Plaza across the street. Widest dry sand, best when the tide is up and you want the full beach-day scene.',
  },
  'Alder Lane Beach': {
    name: 'Alder Lane Beach',
    area: 'South Forest Beach',
    crowd: 3,
    parking: 'Metered street + small lot',
    bestFor: 'high',
    note: 'A quieter swimming alternative to Coligny a few blocks south — same water, half the crowd. Good mid-to-high tide for an actual swim.',
  },
  'Driessen Beach Park': {
    name: 'Driessen Beach Park',
    area: 'Mid-island (Bradley Beach)',
    crowd: 3,
    parking: 'Good lot + boardwalk',
    bestFor: 'any',
    note: 'Family pick — long boardwalk over the dunes, playground, calmer crowd than Coligny. Works at most tides; the flats open up nicely at low.',
  },
  'Folly Field Beach Park': {
    name: 'Folly Field Beach Park',
    area: 'Mid-island',
    crowd: 3,
    parking: 'Public lot',
    bestFor: 'any',
    note: 'Solid mid-island public access next to the bigger hotels. Gentle, family-friendly, decent parking. A reliable default.',
  },
  'Burkes Beach': {
    name: 'Burkes Beach',
    area: 'Mid-island (by the Sandbox / Chaplin)',
    crowd: 2,
    parking: 'Very limited — go early',
    bestFor: 'low',
    note: 'Quiet, local-feeling. At low tide the flats run way out — the spot for shelling, tide pools, and an uncrowded walk. Parking is the catch; arrive early.',
  },
  'Mitchelville Beach Park': {
    name: 'Mitchelville Beach Park',
    area: 'North end (Port Royal / Fish Haul)',
    crowd: 1,
    parking: 'Lot at the park',
    bestFor: 'low',
    note: 'The north-end quiet beach with real history. Low tide exposes the best shelling and shark-tooth hunting on the island. Calm water, almost no crowd.',
  },
};

/** Pick the swimming beach (tide up): trade crowd for amenities. */
export function swimBeach(preferQuiet: boolean): BeachName {
  return preferQuiet ? 'Alder Lane Beach' : 'Coligny Beach Park';
}

/** Pick the flats beach (tide out): shelling, shark teeth, tide pools. */
export function flatsBeach(): BeachName {
  return 'Mitchelville Beach Park';
}

export type TideKey = 'low' | 'high' | 'any';

export interface ActivityTemplate {
  title: string;
  detail: string;
  tide: TideKey;
  /** Optional affiliate hook — wired to <AffiliateLink> on the page. */
  affiliate?: { programId: 'viator' | 'getyourguide'; deeplink?: string };
}

/**
 * Tide-keyed activity menu. The engine surfaces the ones that match the day's
 * daytime tide windows. Affiliate hooks monetize without nagging.
 */
export const ACTIVITIES: ActivityTemplate[] = [
  {
    title: 'Hunt for shark teeth on the flats',
    detail:
      'At low tide the exposed sand at the north end (Mitchelville, Fish Haul) gives up fossil shark teeth and whole shells. Bring a mesh bag.',
    tide: 'low',
  },
  {
    title: 'Bike the hard-packed sand',
    detail:
      'Low tide turns the beach into a firm, flat highway — the classic Hilton Head beach-cruiser ride. Easiest from Coligny north.',
    tide: 'low',
  },
  {
    title: 'Tide-pool with the kids',
    detail:
      'Warm, ankle-deep pools form on the flats at low water — the safest "ocean" for toddlers, no surf.',
    tide: 'low',
  },
  {
    title: 'Swim while the tide is up',
    detail:
      'Mid-to-high tide is the real swimming window — more water, fewer long walks out to it. Alder Lane and Coligny are the easiest entries.',
    tide: 'high',
  },
  {
    title: 'Kayak or SUP the creek',
    detail:
      'Higher water opens the marsh creeks behind the island — calmer than the ocean and where the dolphins feed.',
    tide: 'high',
    affiliate: { programId: 'getyourguide' },
  },
  {
    title: 'Dolphin & nature cruise',
    detail:
      'Bottlenose dolphins work the shoreline and Calibogue Sound year-round. A small-boat tour is the reliable way to see them up close.',
    tide: 'any',
    affiliate: { programId: 'viator' },
  },
];
