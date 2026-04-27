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
  /**
   * 4–6 FAQ entries phrased as literal user/AI-search queries
   * ("Is X worth it?", "Best month for Y?"). Drives FAQPage schema
   * + on-page rendering for AI-assistant citation surface area.
   */
  faqs: Array<{ question: string; answer: string }>;
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
    faqs: [
      {
        question: 'Is Sea Pines worth the gate fee?',
        answer:
          'For a 4+ day trip with golf or kids who bike, yes. The $9/day pass covers one car, and the trade-off is 5,200 acres of forest preserve, 17 miles of bike paths, and walk-to-beach access from most villas. For a 2-night couples trip with no golf, the gate fee math gets thinner — Forest Beach is a better value at that length.',
      },
      {
        question: 'What is the best month to stay in Sea Pines?',
        answer:
          'May and October are the local picks: 75–82°F days, water still warm, no crowds, lower rates. June through August is peak family season; book 5–6 months out. November through February is quiet and mild (50s–60s) — fewer dining options open, but the best per-dollar value of the year for a long weekend.',
      },
      {
        question: 'How far in advance should I book a Sea Pines villa?',
        answer:
          'Summer (June–August): 5–6 months out for the South Beach Lane buildings. Spring break and Heritage Week (mid-April): book by January at the latest. Fall and winter: 6–8 weeks is usually fine. Wedding-week blocks: a year minimum if you want contiguous units.',
      },
      {
        question: 'Can non-resort guests book tee times at Harbour Town Golf Links?',
        answer:
          'Yes, but priority goes to Sea Pines resort guests, who can book up to 120 days out. Outside guests can book about 30 days out, and prime morning slots vanish first. The workaround: book a property through us and we route you through the resort priority window.',
      },
      {
        question: 'Where should I eat dinner if I am staying in Sea Pines?',
        answer:
          'Inside the gates: The Quarterdeck for the sunset view, CQ’s for a quieter date night. Outside the gates (5–10 min drive): Skull Creek Boathouse for sunset waterfront, Charlie’s L’Etoile Verte for fine dining, Hudson’s for casual seafood on the docks. Most of the best dinners on the island are technically outside Sea Pines.',
      },
    ],
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
    faqs: [
      {
        question: 'Is Palmetto Dunes better than Sea Pines for a family trip?',
        answer:
          'For families with kids 6 to 14 who want to balance pool, beach, and tennis without driving — yes. Palmetto Dunes is mid-island, which means shorter drives to dinner and the airport, and the Omni’s 2026-renovated pool deck is the best on the island. Sea Pines wins for older kids who bike everywhere or for golf-first families who want Harbour Town in walking distance.',
      },
      {
        question: 'Is the Omni Hilton Head renovated yet?',
        answer:
          'The lobby and pool deck completed in early 2026 and are excellent. Room renovations are phased through 2027, so floor matters: ask for floor 4 or higher in the renovated sections. We track which rooms have been refreshed and route bookings accordingly.',
      },
      {
        question: 'How good is the tennis program at Palmetto Dunes?',
        answer:
          'It’s a US top-10 program. 23 clay courts, 8 pickleball courts, real teaching pros. Drop-in clinics fill 2 weeks out in summer; book through the Palmetto Dunes Tennis Center directly. Worth the trip even if tennis isn’t your primary reason for being on the island.',
      },
      {
        question: 'What is the best month for Palmetto Dunes golf?',
        answer:
          'Mid-March through mid-May, and mid-September through early November. Daytime highs 70–82°F, courses in best condition, and tee sheets manageable. Avoid the second week of April (Heritage Week) unless you’re going for the tournament — courses and rates are both at peak.',
      },
      {
        question: 'How do I get to the beach from inland Palmetto Dunes villas?',
        answer:
          'Free trolley loops continuously from spring through fall, hitting all major villa clusters and the beach club. Bikes are the locals’ way (paths run alongside the lagoon), about 8–12 minutes from the interior to oceanfront. Some villas include bikes; we confirm before booking.',
      },
    ],
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
    faqs: [
      {
        question: 'Is Forest Beach walkable?',
        answer:
          'Yes — the most walkable neighborhood on Hilton Head. Most condos sit within a 10-minute walk of Coligny Plaza (restaurants, shops, beach, lifeguards). For a 3 to 5 day trip, you can skip the rental car entirely and Uber to fewer-than-10 dinners.',
      },
      {
        question: 'What is Coligny Beach Park like?',
        answer:
          'The only public beach access on Hilton Head with full amenities: free parking, restrooms, outdoor showers, food, lifeguards, and a small playground. It gets busy at peak (10 a.m. to 4 p.m. in summer), but mornings before 9 and evenings after 5 are uncrowded year-round.',
      },
      {
        question: 'Is Forest Beach safe at night?',
        answer:
          'Yes. It’s a tourist district anchored by Coligny Plaza, lit and active until about 11 p.m. in summer. The biggest annoyance is bar noise spillover on weekend nights — pick a south-end condo if you want quieter.',
      },
      {
        question: 'How does Forest Beach compare to Sea Pines for value?',
        answer:
          'A 2BR oceanfront condo in June runs about $3,200/week in Forest Beach and $5,500/week in Sea Pines for an equivalent unit. There’s no $9/day gate fee. The trade is fewer amenities (no plantation-wide bike paths, smaller pools), but for short trips that’s often the right trade.',
      },
      {
        question: 'How busy is Forest Beach in summer?',
        answer:
          'Coligny gets crowded 10 a.m. to 4 p.m. in June through August — expect packed restaurants and full beach access stations. Mornings and evenings are calmer. Beach itself never feels crammed because it’s 12 miles long; people cluster within 100 yards of access points.',
      },
    ],
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
    faqs: [
      {
        question: 'Is Shelter Cove on the beach?',
        answer:
          'No. Shelter Cove faces Broad Creek (a marina), not the Atlantic. The ocean is a 6-minute drive or a longer walk to the closest public access at Singleton Beach. For couples and foodies, the marina vibe is the feature; for a beach-first family trip, Forest Beach or Palmetto Dunes is a better fit.',
      },
      {
        question: 'What restaurants are in Shelter Cove?',
        answer:
          'Four of the densest dining picks on the island, all within a 2-minute walk of each other: Ela’s on the Water (waterfront fine dining), Jack’s (chef-driven seasonal), WiseGuys (steakhouse + bar), and San Miguel’s (casual Mexican). Reservations 2 weeks out for Friday/Saturday in summer.',
      },
      {
        question: 'Is Shelter Cove good for couples without kids?',
        answer:
          'Yes — it’s the adults’ pocket of the island. No theme-park vibe, no spring-break crush. Quiet, marina-centric, four good dinners, and floor-to-ceiling sunset views from the Towers. Ideal for anniversaries, milestone birthdays, and child-free long weekends.',
      },
      {
        question: 'When are the free concerts at Shelter Cove?',
        answer:
          'Free concerts on the marina lawn run Tuesdays and Thursdays from June through August, typically 6 to 8 p.m. Bring a blanket, wine is allowed, no tickets needed. One of the best low-cost summer evenings on the island.',
      },
      {
        question: 'Where do I park for dinner at Shelter Cove?',
        answer:
          'Free public parking in the Shelter Cove Towne Centre lot, a 2-minute walk to all four restaurants. It fills up Friday and Saturday after 6:30 p.m. in summer — arrive by 6 or use the overflow lot near the Kroger.',
      },
    ],
  },
];

export function getNeighborhoodBySlug(
  slug: string,
): NeighborhoodLanding | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}
