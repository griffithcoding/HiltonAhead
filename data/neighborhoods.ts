/**
 * Neighborhood landing pages — /hilton-head/[slug]
 *
 * These are conversion-focused landing pages targeting the exact
 * neighborhood keyword (e.g., "Sea Pines Hilton Head"). They link
 * to the matching long-form blog post for deep-dive content, and
 * push toward the itinerary CTA.
 */

import { photos } from './photos';

export type NeighborhoodLanding = {
  slug: string;
  name: string;
  /** Short SEO H1 tagline (plain + italic). */
  tagline: { plain: string; italic: string };
  /** Meta description — under 158 chars. */
  metaDescription: string;
  keywords: string[];
  /** Short 1–2 sentence hook for the hero. */
  hook: string;
  /** Geographic center for Place schema. */
  latitude: number;
  longitude: number;
  /** Four reasons to stay here, each ~20 words. */
  reasons: Array<{ title: string; body: string }>;
  /** Best-for traveler types. */
  bestFor: string[];
  /** What to watch out for — single paragraph. */
  tradeoffs: string;
  /** Which villa buildings / properties we book here (concise 3–5). */
  properties: Array<{ name: string; note: string }>;
  /** The one photograph that represents this neighborhood. */
  hero: { src: string; alt: string };
  /** Supporting photos (3–4) for the gallery. */
  gallery: Array<{ src: string; alt: string; caption: string }>;
  /** Slug of the long-form blog post to link out to. */
  blogPostSlug: string;
};

export const neighborhoods: NeighborhoodLanding[] = [
  {
    slug: 'sea-pines',
    name: 'Sea Pines',
    tagline: {
      plain: 'Sea Pines: the island',
      italic: 'as it was designed to be.',
    },
    metaDescription:
      'Sea Pines villas, Harbour Town Golf Links, and locals-only advice for the largest neighborhood on Hilton Head. Book through us for partner rates.',
    keywords: [
      'Sea Pines villas',
      'Sea Pines Resort Hilton Head',
      'Harbour Town villa rental',
      'Sea Pines oceanfront',
      'Sea Pines golf packages',
    ],
    hook:
      '5,200 acres of forest, beach, and lighthouse. The island\u2019s largest neighborhood and our most-booked pocket for couples, golf trips, and first-time visitors who want the postcard experience.',
    latitude: 32.134,
    longitude: -80.808,
    reasons: [
      {
        title: 'The iconic experience',
        body:
          'Harbour Town lighthouse, the Liberty Oak, three resort golf courses, and 17 miles of bike path. This is the Hilton Head people imagine.',
      },
      {
        title: 'Best walkable oceanfront',
        body:
          'South Beach Lane villas put you 90 seconds from the sand and 15 minutes on a bike to Harbour Town. Golf, dinner, sunset, all without the car.',
      },
      {
        title: 'Partner-rate advantage',
        body:
          'We book four villa buildings on South Beach Lane we\u2019ve personally vetted. Resort guests also get 120-day Harbour Town tee-time priority.',
      },
      {
        title: 'Sunset nobody else gets',
        body:
          'Harbour Town faces west over Calibogue Sound. The last 10 minutes of sunset at the Quarterdeck bar is unmatched on the Atlantic coast.',
      },
    ],
    bestFor: [
      'Couples & first-time visitors',
      'Golf trips (Harbour Town access)',
      'Multi-generational family reunions',
      'Anniversaries & proposals',
    ],
    tradeoffs:
      'You\u2019ll pay a premium for the address. The entrance gate backs up 10 a.m. to 12 p.m. in summer. And the best dinners are actually outside the plantation gates (we plan around this).',
    properties: [
      { name: 'The Inn & Club at Harbour Town', note: 'Golf-first hotel; walk to first tee' },
      { name: 'South Beach Lane villas (private)', note: '4 buildings we book, 90 sec to sand' },
      { name: 'Baynard Cove & Ocean Gate', note: 'Residential-feel single-family homes' },
      { name: 'Harbour Town Villas', note: 'Marina views, short walk to lighthouse' },
    ],
    hero: photos.lighthouse,
    gallery: [
      { ...photos.lighthouse,  caption: 'Harbour Town · 7 p.m.' },
      { ...photos.mossOak,     caption: 'Forest preserve, interior' },
      { ...photos.bikePath,    caption: '17 mi of bike path' },
      { ...photos.villa,       caption: 'A Sea Pines villa we book' },
    ],
    blogPostSlug: 'sea-pines-guide',
  },
  {
    slug: 'palmetto-dunes',
    name: 'Palmetto Dunes',
    tagline: {
      plain: 'Palmetto Dunes: three courses,',
      italic: 'eleven miles of lagoon.',
    },
    metaDescription:
      'Palmetto Dunes villas, Omni Resort, and three championship golf courses. Hilton Head\u2019s best mid-island neighborhood for golf and family trips.',
    keywords: [
      'Palmetto Dunes villas',
      'Palmetto Dunes Hilton Head',
      'Omni Hilton Head',
      'Marriott Grande Ocean',
      'Palmetto Dunes golf',
    ],
    hook:
      'Efficient, family-first, and genuinely well-run tennis. The mid-island answer to Sea Pines. Three golf courses in one plantation, oceanfront villas, and the Omni\u2019s freshly-renovated resort spine.',
    latitude: 32.19,
    longitude: -80.741,
    reasons: [
      {
        title: 'Three courses, one tee sheet',
        body:
          'Robert Trent Jones Oceanfront, Fazio, and Arthur Hills. All walkable from most villas, all bookable through one system.',
      },
      {
        title: 'The 2026 Omni refresh',
        body:
          'Lobby and pool deck fully renovated in early 2026. Best pool on the island now. Room renovation phased through 2027. We know which floors.',
      },
      {
        title: 'US top-10 tennis program',
        body:
          '23 clay courts, 8 pickleball, legitimate pros. Drop the kids at camp for 2 hours, hit the beach. Book clinics 2 weeks out.',
      },
      {
        title: '11 miles of lagoon',
        body:
          'Kayak, paddleboard, or fish Broad Creek at 7 a.m. before the island wakes up. One of the most underrated mornings on Hilton Head.',
      },
    ],
    bestFor: [
      'Golf trips (6 to 8 players)',
      'Families with kids 6 to 14',
      'Tennis and pickleball focused trips',
      'Full-service resort travelers',
    ],
    tradeoffs:
      'Not a dining destination on its own. The in-plantation restaurants are convenience-priced and just okay. You\u2019ll drive 8 to 12 minutes to the best dinners.',
    properties: [
      { name: 'Omni Hilton Head Oceanfront Resort', note: 'Ask us about floor 4+ renovated rooms' },
      { name: 'Marriott Grande Ocean', note: '2BR villas, shortest beach walk' },
      { name: 'Mooring Buoy / Sea Oaks villas', note: 'Private oceanfront, 5BR' },
      { name: 'Queens Grant (interior)', note: 'Value pick, 10-min walk to beach' },
    ],
    hero: photos.bikePath,
    gallery: [
      { ...photos.bikePath,  caption: 'Lagoon path' },
      { ...photos.marsh,     caption: 'Broad Creek, morning' },
      { ...photos.villa,     caption: 'A villa we book' },
      { ...photos.hammock,   caption: 'Between rounds' },
    ],
    blogPostSlug: 'palmetto-dunes-guide',
  },
  {
    slug: 'forest-beach',
    name: 'Forest Beach',
    tagline: {
      plain: 'Forest Beach:',
      italic: 'walkable and honest.',
    },
    metaDescription:
      'Forest Beach Hilton Head: the best walkable neighborhood for 3 to 5 day trips. Direct beach access, Coligny plaza, no gate fees.',
    keywords: [
      'Forest Beach Hilton Head',
      'Coligny Plaza',
      'Hilton Head walkable neighborhoods',
      'Forest Beach condo rental',
      'Hilton Head short trip',
    ],
    hook:
      'The overlooked middle child. Direct beach access, walkable Coligny plaza, and the best per-dollar value on the island for short trips.',
    latitude: 32.141,
    longitude: -80.788,
    reasons: [
      {
        title: 'Ditch the car',
        body:
          'Most Forest Beach condos are a 10-minute walk to Coligny (restaurants, beach, shops). For a 3-night trip, you save $300 in rental-car hassle.',
      },
      {
        title: 'Coligny Beach Park',
        body:
          'The only beach on the island with full amenities. Bathrooms, showers, food, lifeguards. Best single beach access on Hilton Head.',
      },
      {
        title: 'No gate tax',
        body:
          'Sea Pines charges $9 per car per day for guests. Forest Beach doesn\u2019t. Over a week, that\u2019s $63 per rental car.',
      },
      {
        title: 'Real value',
        body:
          'A 2BR oceanfront condo in June runs $3,200/week. The equivalent in Sea Pines runs $5,500. Best value on the island for short stays.',
      },
    ],
    bestFor: [
      'Short trips (3 to 5 days)',
      'Budget-conscious families',
      'Couples who want to walk to dinner',
      'First-time island visitors',
    ],
    tradeoffs:
      'Not quiet. Coligny stays active until 11 p.m. in summer. Not ideal for golfers (you\u2019ll drive to every course) or large groups (few single-family homes big enough).',
    properties: [
      { name: 'Sea Crest & Villamare condos', note: 'Our default 2BR picks, $3,200 to $3,800/wk' },
      { name: 'Beach House, a Holiday Inn Resort', note: 'Budget-friendly, direct beach' },
      { name: 'South Forest Beach single-family', note: 'Upgrade to standalone house' },
      { name: 'The Atrium', note: 'North Forest Beach, high-density condos' },
    ],
    hero: photos.boardwalk,
    gallery: [
      { ...photos.boardwalk,   caption: 'Boardwalk to Coligny' },
      { ...photos.beachMorning,caption: 'Morning, south end' },
      { ...photos.palms,       caption: 'Coligny, walking distance' },
      { ...photos.surfSoft,    caption: 'Low tide, walkable' },
    ],
    blogPostSlug: 'forest-beach-guide',
  },
  {
    slug: 'shelter-cove',
    name: 'Shelter Cove',
    tagline: {
      plain: 'Shelter Cove: the',
      italic: 'adult pocket of the island.',
    },
    metaDescription:
      'Shelter Cove Hilton Head: marina views, four of the island\u2019s best dinners, and a quieter base for couples\u2019 trips and date nights.',
    keywords: [
      'Shelter Cove Hilton Head',
      'Shelter Cove marina',
      'Hilton Head couples trip',
      'Ela\u2019s on the Water',
      'Hilton Head marina rental',
    ],
    hook:
      'No theme-park signage, no beach-resort crush. A 200-acre marina-centric development with four of the island\u2019s best dinners and some of its quietest lodging.',
    latitude: 32.182,
    longitude: -80.731,
    reasons: [
      {
        title: 'Four dinners, one square mile',
        body:
          'Ela\u2019s, Jack\u2019s, WiseGuys, and San Miguel\u2019s all within a 2-minute walk. The densest dining pocket on the island.',
      },
      {
        title: 'Sunset from your room',
        body:
          'Shelter Cove Towers face west over Broad Creek. Floor-to-ceiling marina views, and the best sunset from any hotel room on Hilton Head.',
      },
      {
        title: 'Free summer concerts',
        body:
          'Free Tuesday and Thursday concerts on the marina lawn from June to August. Bring a blanket and wine. One of the best low-key evenings on the island.',
      },
      {
        title: 'Built for couples',
        body:
          'No kids\u2019 program, no spring-break vibe. Adults only in spirit. Ideal for fall anniversaries, milestone birthdays, and child-free long weekends.',
      },
    ],
    bestFor: [
      'Couples\u2019 getaways',
      'Anniversaries & proposals',
      'Foodie weekends',
      'Milestone birthdays',
    ],
    tradeoffs:
      'You\u2019re on a marina, not a beach. The ocean is a 6-minute drive. A feature for adults, friction for kids. Not ideal for golf-first groups.',
    properties: [
      { name: 'Shelter Cove Towers', note: 'Best marina-view condos on the island' },
      { name: 'Disney Hilton Head Island Resort', note: 'Open to non-members; free beach shuttle' },
      { name: 'Beach House (edge)', note: 'Beach-side, budget add-on' },
      { name: 'Single-family rentals', note: 'Limited inventory; book 6 mo out' },
    ],
    hero: photos.harborBoats,
    gallery: [
      { ...photos.harborBoats, caption: 'Shelter Cove Marina' },
      { ...photos.dock,        caption: 'Quiet end-of-dock table' },
      { ...photos.teaTable,    caption: 'Dinner at Ela\u2019s' },
      { ...photos.sundown,     caption: 'Sunset, looking west' },
    ],
    blogPostSlug: 'shelter-cove-guide',
  },
];

export function getNeighborhoodBySlug(
  slug: string,
): NeighborhoodLanding | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}
