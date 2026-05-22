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
  /**
   * Slug of the long-form blog post to link out to. Optional — newer
   * neighborhood landings ship before their companion guide, and the page
   * conditionally hides the "Read the full guide" CTAs when absent.
   */
  blogPostSlug?: string;
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
      'Sea Pines villas, Harbour Town Golf Links, and locals-only advice for the largest neighborhood on Hilton Head.',
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
        title: 'Built for repeat visitors',
        body:
          'We walk South Beach Lane villas in person before recommending them, and Sea Pines resort guests get 120-day Harbour Town tee-time priority we plan around.',
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
      { name: 'South Beach Lane villas (private)', note: 'Walkable villas, 90 sec to sand' },
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
    hero: photos.lagoonAerial,
    gallery: [
      { ...photos.lagoonAerial, caption: '11 miles of resort lagoon' },
      { ...photos.marsh,        caption: 'Broad Creek, morning' },
      { ...photos.villa,        caption: 'A villa we book' },
      { ...photos.hammock,      caption: 'Between rounds' },
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
  {
    slug: 'port-royal',
    name: 'Port Royal',
    tagline: {
      plain: 'Port Royal: the north end',
      italic: 'Hilton Head keeps to itself.',
    },
    metaDescription:
      'Port Royal Plantation Hilton Head: three Robert Trent Jones courses, the Westin resort, and the quietest oceanfront on the island.',
    keywords: [
      'Port Royal Hilton Head',
      'Port Royal Plantation',
      'Westin Hilton Head Island Resort',
      'Port Royal golf',
      'Robber’s Row Hilton Head',
      'Barony golf course',
      'Hilton Head north end',
    ],
    hook:
      'A 1,400-acre gated plantation on the island’s quiet north end. Three Robert Trent Jones Sr. courses, a single resort anchor (the Westin), and an oceanfront beach where you’ll walk a mile without seeing a chair rental.',
    latitude: 32.225,
    longitude: -80.690,
    reasons: [
      {
        title: 'Three RTJ courses, one gate',
        body:
          'Barony, Robber’s Row, and Planter’s Row — three Robert Trent Jones Sr. designs inside the same plantation. Quietest tee sheets on the island most weeks.',
      },
      {
        title: 'The Westin as your one anchor',
        body:
          'No competing resorts diluting the experience. The Westin’s 2024 lobby refresh, three pools, and the only oceanfront spa on the north end. Heavenly Bed for the hard sleepers.',
      },
      {
        title: 'Beach you can actually find solitude on',
        body:
          'Port Royal’s mile of Atlantic shoreline gets a fraction of Coligny’s foot traffic. Bring a chair, walk five minutes, and you’ll have your own stretch of sand.',
      },
      {
        title: 'Closest to the airport',
        body:
          '12 minutes from HHH (Savannah/Hilton Head Airport) and 35 from SAV. If you’re flying in for a Friday-to-Sunday golf trip, you’re tee-off-ready before lunch.',
      },
    ],
    bestFor: [
      'Golfers booking 36-hole days',
      'Repeat visitors who’ve done Sea Pines',
      'Travelers who want quiet over scene',
      'Short-haul flyers (HHH-friendly)',
    ],
    tradeoffs:
      'The dining inside the plantation is limited — you’ll drive 10 to 18 minutes to the island’s best dinners. Atlantic water on the north end runs a few degrees cooler with more current; better for shelling than for swimming with toddlers. And the Westin sets the tone: if a single big resort isn’t your speed, Sea Pines or Shelter Cove will fit better.',
    properties: [
      { name: 'The Westin Hilton Head Island Resort & Spa', note: 'Oceanfront, three pools, only resort inside the gate' },
      { name: 'Port Royal villa rentals (private)', note: 'Single-family homes on the courses, 3 to 6 BR' },
      { name: 'Beach Villas at Port Royal', note: 'Mid-priced 2-3BR, short walk to the sand' },
      { name: 'Barony Beach Club', note: 'Marriott Vacation Club inventory; oceanfront 2BR' },
    ],
    hero: photos.marsh,
    gallery: [
      { ...photos.marsh,        caption: 'North end · marsh edge'      },
      { ...photos.golfFairway,  caption: 'Robber’s Row · early tee' },
      { ...photos.beachMorning, caption: 'Port Royal beach · 7 a.m.'   },
      { ...photos.mossOak,      caption: 'Plantation interior · oaks'  },
    ],
    // No companion blog guide yet — link will hide automatically.
  },
  {
    slug: 'mid-island',
    name: 'Mid-Island',
    tagline: {
      plain: 'Mid-Island: the locals’',
      italic: 'no-gate value pick.',
    },
    metaDescription:
      'Mid-Island Hilton Head: Folly Field, Singleton Beach, and Bradley Beach. The best per-dollar rentals on the island, no gate fees, walkable beach access.',
    keywords: [
      'Mid-Island Hilton Head',
      'Folly Field Beach',
      'Singleton Beach Hilton Head',
      'Bradley Beach Hilton Head',
      'Hilton Head Beach & Tennis Resort',
      'Hilton Head value rentals',
      'Hilton Head no gate fee',
    ],
    hook:
      'Not a plantation — a stretch of un-gated island between Sea Pines and Port Royal. Folly Field, Singleton Beach, and Bradley Beach. Where families on a third or fourth visit start booking once they realize the gate fees aren’t buying them anything.',
    latitude: 32.183,
    longitude: -80.722,
    reasons: [
      {
        title: 'No gate, no premium',
        body:
          'Sea Pines charges $9 per car per day. Palmetto Dunes is bundled into rental rates. Mid-Island charges nothing — over a 7-day trip, that’s up to $150 back in your pocket.',
      },
      {
        title: 'Folly Field is the local secret',
        body:
          'Wide, hard-packed sand, easy parking at Folly Field Road and Bradley Beach access points. A fraction of Coligny’s crowd, half the walk-in distance from most rentals.',
      },
      {
        title: 'Best $/sq ft on the island',
        body:
          'A 3BR Folly Field beach house in shoulder season runs $2,400 to $3,200 a week. The same square footage in Sea Pines starts at $4,500. The math is hard to argue with.',
      },
      {
        title: 'Errands without a hike',
        body:
          'Publix, the post office, the urgent care, the locals’ hardware store — all within 5 minutes. For a 10-day stay with kids, that proximity quietly saves an hour a day.',
      },
    ],
    bestFor: [
      'Repeat visitors who know the island',
      'Multi-family or long-stay groups',
      'Budget-conscious families',
      'Beach-first travelers (no resort needed)',
    ],
    tradeoffs:
      'Mid-Island isn’t curated — you’ll see a thirty-year-old condo block next to a renovated beach house. Property quality varies block by block, which is why we vet specific addresses rather than “Mid-Island” as a whole. There’s no resort spine, no concierge, no on-site golf. If you want full-service, look at Palmetto Dunes or Sea Pines instead.',
    properties: [
      { name: 'Hilton Head Beach & Tennis Resort', note: 'Direct beach, 1-2BR condos, family workhorse' },
      { name: 'Folly Field beach houses', note: 'Single-family 3-5BR, our best value picks' },
      { name: 'Singleton Beach condos', note: 'Quieter pocket, 2BR oceanfront, mid-tier' },
      { name: 'Bradley Beach rentals', note: 'Walking distance to sand, residential feel' },
    ],
    hero: photos.villa,
    gallery: [
      { ...photos.villa,        caption: 'Mid-Island beach house'        },
      { ...photos.beachMorning, caption: 'Folly Field · low tide'        },
      { ...photos.dunesPath,    caption: 'Beach access · Singleton'      },
      { ...photos.palms,        caption: 'Quiet block, mid-island'       },
    ],
    // No companion blog guide yet — link will hide automatically.
  },
  // — SHIPYARD —
  {
    slug: 'shipyard',
    name: 'Shipyard',
    tagline: { plain: 'Shipyard:', italic: 'gated calm on the south end.' },
    metaDescription:
      'Shipyard Plantation villas — a quiet gated community on the south end of Hilton Head, with golf, tennis, and easy beach access.',
    keywords: ['Shipyard Plantation', 'Shipyard villas Hilton Head', 'Hilton Head gated community'],
    hook:
      'A gated residential community on the south end of the island. Quieter than Sea Pines, 30% cheaper than comparable Palmetto Dunes units, and a four-minute drive to the beach.',
    latitude: 32.142,
    longitude: -80.779,
    reasons: [
      { title: 'Value-end gated living', body: 'Security gate without the Sea Pines price premium — marsh-view villas here run 25–30% below comparable oceanfront stock.' },
      { title: 'Golf on-property', body: 'Van der Meer Shipyard tennis complex and Shipyard Golf Club sit inside the gate.' },
      { title: 'Quiet nights', body: 'No commercial strips inside the gate means genuinely quiet evenings — right call for families.' },
      { title: 'Drive to the beach, not a hike', body: 'Beach club access is a 4-minute cart ride — easy, just not walkable.' },
    ],
    bestFor: ['families', 'golf groups', 'budget-conscious couples'],
    tradeoffs: 'Beach is not walkable. Summer cart rentals sell out — book before you arrive.',
    properties: [
      { name: 'Shipyard Villas', note: 'Condo stock near the golf course; reliable mid-range' },
      { name: 'Spinnaker', note: 'Marsh-view building with larger floor plans for families' },
    ],
    hero: photos.marsh,
    gallery: [
      { ...photos.marsh,    caption: 'Tidal marsh, Shipyard south end' },
      { ...photos.palms,    caption: 'Shipyard entrance drive' },
      { ...photos.villa,    caption: 'Shipyard villa with marsh view' },
    ],
  },
  // — BLUFFTON —
  {
    slug: 'bluffton',
    name: 'Bluffton',
    tagline: { plain: 'Bluffton:', italic: 'Old Town at the May River.' },
    metaDescription:
      'Stay in Bluffton, SC — walkable Old Town, May River oysters, and Hilton Head a 12-minute drive across the bridge.',
    keywords: ['Bluffton SC rentals', 'Old Town Bluffton', 'May River Bluffton', 'stay near Hilton Head'],
    hook:
      'Old Town Bluffton is the off-island alternative for travelers who want May River sunsets and great restaurants without paying oceanfront rates. Hilton Head is 12 minutes across the bridge.',
    latitude: 32.237,
    longitude: -80.860,
    reasons: [
      { title: 'May River dining', body: 'Bluffton Oyster Company, Mellow Mushroom, and the Old Town restaurant row all within walking distance.' },
      { title: '30% under island rates', body: 'Same trip, a fraction of the villa cost — extra budget goes to dinners and excursions.' },
      { title: 'Genuine small-town feel', body: 'Art galleries, Saturday market, and a walkable Main Street that tourists haven\'t overrun yet.' },
      { title: 'Beach still accessible', body: '12-minute drive across the bridge — not a beach trip, but a day at the beach is easy.' },
    ],
    bestFor: ['food-focused couples', 'repeat visitors', 'budget-first travelers'],
    tradeoffs: 'Beach is a 15-minute drive minimum; summer traffic adds 20–30 min. Pick this only if the beach is secondary.',
    properties: [
      { name: 'Old Town Bluffton rentals', note: 'Cottage-style homes near the river; walkable to dining' },
      { name: 'Palmetto Bluff area', note: 'Luxury cottages in the Palmetto Bluff resort community' },
    ],
    hero: photos.broadCreek,
    gallery: [
      { ...photos.broadCreek, caption: 'May River tidal creek at low tide' },
      { ...photos.mossOak,    caption: 'Live oak canopy, Old Town Bluffton' },
      { ...photos.teaTable,   caption: 'Riverside dining on the May River' },
    ],
  },
];

export function getNeighborhoodBySlug(
  slug: string,
): NeighborhoodLanding | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}
