/**
 * Hilton Head + Bluffton golf courses — structured source of truth.
 *
 * Drives:
 *   - The /blog/hilton-head-golf-courses-ranked tier list (rendered as
 *     CourseCards instead of plain text rows)
 *   - The Course Match Quiz, Course Map, and Stay-and-Play Estimator
 *     interactive tools embedded in that post
 *   - SportsActivityLocation JSON-LD per course
 *
 * Photos rotate across the existing data/photos.ts set until a real
 * golf shoot lands. Booking URLs go to each course's official tee-time
 * page so we don't need a live API.
 *
 * The `tier` field is the editorial ranking; tools rank on other fields.
 * `mapPos` is hand-tuned (0–100, % of viewBox) for the SVG island map.
 */

import { photos } from '@/data/photos';

export type GolfCourse = {
  slug: string;
  name: string;
  /** Short version for tight UIs (chips, map cards). */
  shortName: string;
  designer: string;
  location:
    | 'Sea Pines'
    | 'Palmetto Dunes'
    | 'Shipyard'
    | 'Port Royal'
    | 'North Island'
    | 'Bluffton';
  par: number;
  yardage: number;
  /** Peak-season retail green fee, USD. Use the high end for ranking. */
  peakFeeUsd: number;
  /** Stay-and-play package equivalent per round, USD. */
  stayAndPlayFeeUsd: number;
  access: 'public' | 'resort-guests' | 'private';
  oceanViews: boolean;
  forestViews: boolean;
  marshViews: boolean;
  /** Drive time from Harbour Town in minutes — proxy for Heritage-week logistics. */
  minutesFromHarbourTown: number;
  tier: 'S' | 'A' | 'B';
  signatureHole?: string;
  blurb: string;
  bookingUrl: string;
  /** True only for the Harbour Town course that hosts the tournament. */
  heritageVenue: boolean;
  architectStyle: 'links' | 'parkland' | 'lowcountry-marsh' | 'oceanfront';
  /** SVG map position as percent of viewBox (0–100). Hand-placed. */
  mapPos: { x: number; y: number };
  photo: { src: string; alt: string };
};

export const golfCourses: ReadonlyArray<GolfCourse> = [
  {
    slug: 'harbour-town-golf-links',
    name: 'Harbour Town Golf Links',
    shortName: 'Harbour Town',
    designer: 'Pete Dye',
    location: 'Sea Pines',
    par: 71,
    yardage: 6973,
    peakFeeUsd: 550,
    stayAndPlayFeeUsd: 275,
    access: 'resort-guests',
    oceanViews: true,
    forestViews: true,
    marshViews: false,
    minutesFromHarbourTown: 0,
    tier: 'S',
    signatureHole: '18th — red-and-white lighthouse framing the green over Calibogue Sound',
    blurb:
      'The best single course in the Southeast and the crown jewel of Hilton Head golf. Host of the RBC Heritage every April. Tight fairways, small greens, finishing stretch that rewards shot-shaping.',
    bookingUrl: 'https://www.seapines.com/golf/harbour-town-golf-links/',
    heritageVenue: true,
    architectStyle: 'oceanfront',
    mapPos: { x: 18, y: 78 },
    photo: { src: photos.lighthouse.src, alt: 'Harbour Town Lighthouse, Sea Pines — 18th green' },
  },
  {
    slug: 'rtj-oceanfront-palmetto-dunes',
    name: 'Robert Trent Jones Oceanfront',
    shortName: 'RTJ Oceanfront',
    designer: 'Robert Trent Jones',
    location: 'Palmetto Dunes',
    par: 72,
    yardage: 7004,
    peakFeeUsd: 245,
    stayAndPlayFeeUsd: 175,
    access: 'public',
    oceanViews: true,
    forestViews: false,
    marshViews: true,
    minutesFromHarbourTown: 18,
    tier: 'S',
    signatureHole: '10th — directly along the Atlantic, the only oceanfront tee on Hilton Head',
    blurb:
      'The only course on Hilton Head with an oceanfront golf shot. Top-50 resort course (Golfweek). Recently re-bunkered, greens regrassed. Best at first light for the breeze and the colors.',
    bookingUrl: 'https://www.palmettodunes.com/golf/robert-trent-jones-oceanfront-course/',
    heritageVenue: false,
    architectStyle: 'oceanfront',
    mapPos: { x: 64, y: 46 },
    photo: { src: photos.beachAerial.src, alt: 'Oceanfront resort with Atlantic visible — RTJ Oceanfront, Palmetto Dunes' },
  },
  {
    slug: 'may-river-palmetto-bluff',
    name: 'May River at Palmetto Bluff',
    shortName: 'May River',
    designer: 'Jack Nicklaus',
    location: 'Bluffton',
    par: 72,
    yardage: 7174,
    peakFeeUsd: 350,
    stayAndPlayFeeUsd: 235,
    access: 'resort-guests',
    oceanViews: false,
    forestViews: true,
    marshViews: true,
    minutesFromHarbourTown: 30,
    tier: 'S',
    signatureHole: '4th — par-3 over the May River with osprey nests on the markers',
    blurb:
      'Off-island in Bluffton (20 min) but worth the drive. Nicklaus design threading live oaks and tidal marsh. Service at Montage Palmetto Bluff is unmatched in the region.',
    bookingUrl: 'https://www.palmettobluff.com/golf-club/',
    heritageVenue: false,
    architectStyle: 'lowcountry-marsh',
    mapPos: { x: 5, y: 30 },
    photo: { src: photos.marsh.src, alt: 'Tidal marsh at golden hour — May River, Palmetto Bluff' },
  },
  {
    slug: 'heron-point-by-pete-dye',
    name: 'Heron Point by Pete Dye',
    shortName: 'Heron Point',
    designer: 'Pete Dye',
    location: 'Sea Pines',
    par: 71,
    yardage: 7035,
    peakFeeUsd: 250,
    stayAndPlayFeeUsd: 165,
    access: 'resort-guests',
    oceanViews: false,
    forestViews: true,
    marshViews: true,
    minutesFromHarbourTown: 6,
    tier: 'S',
    signatureHole: '6th — short par-4 with Dye-pot bunkers reachable in two for the brave',
    blurb:
      'Sea Pines’ second Dye course, renovated 2007. Wider fairways than Harbour Town, still strategic. The best-value S-tier round on the island. Most groups prefer this for daily play.',
    bookingUrl: 'https://www.seapines.com/golf/heron-point-by-pete-dye/',
    heritageVenue: false,
    architectStyle: 'lowcountry-marsh',
    mapPos: { x: 24, y: 70 },
    photo: { src: photos.golfFairway.src, alt: 'Lowcountry golf fairway lined with palmetto — Heron Point' },
  },
  {
    slug: 'atlantic-dunes',
    name: 'Atlantic Dunes by Davis Love III',
    shortName: 'Atlantic Dunes',
    designer: 'Davis Love III',
    location: 'Sea Pines',
    par: 72,
    yardage: 7010,
    peakFeeUsd: 230,
    stayAndPlayFeeUsd: 150,
    access: 'resort-guests',
    oceanViews: false,
    forestViews: true,
    marshViews: false,
    minutesFromHarbourTown: 8,
    tier: 'A',
    blurb:
      'Newest Sea Pines course (renovated 2016 by Davis Love’s firm). Links-style feel, exposed dunes, challenging winds. Reasonable difficulty for mid-handicappers. Best call when Heron Point is booked.',
    bookingUrl: 'https://www.seapines.com/golf/atlantic-dunes-by-davis-love-iii/',
    heritageVenue: false,
    architectStyle: 'links',
    mapPos: { x: 22, y: 64 },
    photo: { src: photos.dunesPath.src, alt: 'Wooden dune crossover path — links-style golf scenery' },
  },
  {
    slug: 'arthur-hills-palmetto-dunes',
    name: 'Arthur Hills Course',
    shortName: 'Arthur Hills',
    designer: 'Arthur Hills',
    location: 'Palmetto Dunes',
    par: 72,
    yardage: 6651,
    peakFeeUsd: 210,
    stayAndPlayFeeUsd: 145,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: true,
    minutesFromHarbourTown: 16,
    tier: 'A',
    blurb:
      'Most forgiving of the three Palmetto Dunes courses. Lagoon-laced layout with generous landing areas. Best for mid- to high-handicappers or the warm-up round of a 4-day trip.',
    bookingUrl: 'https://www.palmettodunes.com/golf/arthur-hills-course/',
    heritageVenue: false,
    architectStyle: 'parkland',
    mapPos: { x: 60, y: 50 },
    photo: { src: photos.lagoonAerial.src, alt: 'Resort lagoons threading through palms — Palmetto Dunes' },
  },
  {
    slug: 'george-fazio-palmetto-dunes',
    name: 'George Fazio Course',
    shortName: 'Fazio',
    designer: 'George Fazio',
    location: 'Palmetto Dunes',
    par: 70,
    yardage: 6873,
    peakFeeUsd: 210,
    stayAndPlayFeeUsd: 145,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: false,
    minutesFromHarbourTown: 17,
    tier: 'A',
    blurb:
      'Tighter than Arthur Hills, only two par-5s (rare). Rewards accuracy over distance. Often overlooked because visitors assume “Fazio” means Tom (it doesn’t — George was Tom’s uncle).',
    bookingUrl: 'https://www.palmettodunes.com/golf/george-fazio-course/',
    heritageVenue: false,
    architectStyle: 'parkland',
    mapPos: { x: 62, y: 54 },
    photo: { src: photos.coastalOak.src, alt: 'Sunlight through tall coastal pines along a fairway' },
  },
  {
    slug: 'port-royal',
    name: 'Port Royal Golf Club',
    shortName: 'Port Royal',
    designer: 'Trent Jones / Cobb / Dye',
    location: 'Port Royal',
    par: 72,
    yardage: 6855,
    peakFeeUsd: 185,
    stayAndPlayFeeUsd: 130,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: false,
    minutesFromHarbourTown: 22,
    tier: 'A',
    blurb:
      'Three 18-hole tracks in one location. Planters Row (RTJ) is the strongest; Robbers Row (Cobb) is the most historic. A good answer when Sea Pines and Palmetto Dunes are full.',
    bookingUrl: 'https://portroyalgolfclub.com/',
    heritageVenue: false,
    architectStyle: 'parkland',
    mapPos: { x: 47, y: 32 },
    photo: { src: photos.golfTeeBox.src, alt: 'Sunlight filtering through coastal pines along a fairway' },
  },
  {
    slug: 'palmetto-hall',
    name: 'Palmetto Hall Plantation',
    shortName: 'Palmetto Hall',
    designer: 'Arthur Hills / Robert Cupp',
    location: 'North Island',
    par: 72,
    yardage: 6918,
    peakFeeUsd: 165,
    stayAndPlayFeeUsd: 120,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: true,
    minutesFromHarbourTown: 28,
    tier: 'B',
    blurb:
      'Two solid courses 25 minutes north of Harbour Town. Lower green fees, less crowded weekdays. Good value if you’re staying north or if main-island courses are booked. Otherwise the drive is a tax.',
    bookingUrl: 'https://www.palmettohallclub.com/',
    heritageVenue: false,
    architectStyle: 'parkland',
    mapPos: { x: 58, y: 18 },
    photo: { src: photos.mossOak.src, alt: 'Spanish moss draped from a Lowcountry live oak' },
  },
  {
    slug: 'oyster-reef',
    name: 'Oyster Reef Golf Course',
    shortName: 'Oyster Reef',
    designer: 'Rees Jones',
    location: 'North Island',
    par: 72,
    yardage: 7027,
    peakFeeUsd: 160,
    stayAndPlayFeeUsd: 115,
    access: 'public',
    oceanViews: false,
    forestViews: false,
    marshViews: true,
    minutesFromHarbourTown: 26,
    tier: 'B',
    blurb:
      'Rees Jones design (Robert Trent Jones’ son) with a legitimate par-3 over salt marsh. Not destination-worthy on its own, but a respectable value round.',
    bookingUrl: 'https://www.oysterreefgolf.com/',
    heritageVenue: false,
    architectStyle: 'lowcountry-marsh',
    mapPos: { x: 68, y: 22 },
    photo: { src: photos.coastalAerial.src, alt: 'Aerial of tidal marsh creeks braiding through spartina' },
  },
  {
    slug: 'shipyard',
    name: 'Shipyard Golf Club',
    shortName: 'Shipyard',
    designer: 'George Cobb / Willard Byrd',
    location: 'Shipyard',
    par: 72,
    yardage: 6830,
    peakFeeUsd: 175,
    stayAndPlayFeeUsd: 125,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: false,
    minutesFromHarbourTown: 12,
    tier: 'B',
    blurb:
      'Three nines (Brigantine, Clipper, Galleon). Brigantine + Galleon is the good round; Clipper is the weakest 9 in the rotation — skip it if the tee sheet lets you. Decent value, convenient mid-island.',
    bookingUrl: 'https://www.shipyardgolfclub.com/',
    heritageVenue: false,
    architectStyle: 'parkland',
    mapPos: { x: 38, y: 56 },
    photo: { src: photos.boardwalk.src, alt: 'Wooden boardwalk through coastal sea oats' },
  },
  {
    slug: 'old-south',
    name: 'Old South Golf Links',
    shortName: 'Old South',
    designer: 'Clyde Johnston',
    location: 'Bluffton',
    par: 72,
    yardage: 6772,
    peakFeeUsd: 140,
    stayAndPlayFeeUsd: 95,
    access: 'public',
    oceanViews: false,
    forestViews: true,
    marshViews: true,
    minutesFromHarbourTown: 24,
    tier: 'B',
    blurb:
      'Best budget round in the region. Clyde Johnston layout on a former rice plantation. Not a championship test but genuinely enjoyable for a mid-trip afternoon when the S-tier courses have priced you out.',
    bookingUrl: 'https://www.oldsouthgolf.com/',
    heritageVenue: false,
    architectStyle: 'lowcountry-marsh',
    mapPos: { x: 8, y: 22 },
    photo: { src: photos.broadCreek.src, alt: 'Tidal creek winding through golden Lowcountry marsh' },
  },
];

export function getCourseBySlug(slug: string): GolfCourse | undefined {
  return golfCourses.find((c) => c.slug === slug);
}

export function getCoursesByTier(tier: GolfCourse['tier']): GolfCourse[] {
  return golfCourses.filter((c) => c.tier === tier);
}

/** Tier metadata for editorial use — labels and descriptive subtitles. */
export const golfTierMeta = {
  S: {
    label: 'S-Tier',
    accent: 'gold' as const,
    subtitle: 'Courses worth building a trip around.',
  },
  A: {
    label: 'A-Tier',
    accent: 'primary' as const,
    subtitle: 'Strong rounds any day.',
  },
  B: {
    label: 'B-Tier',
    accent: 'zinc' as const,
    subtitle: 'Fine when the calendar is tight.',
  },
} as const;
