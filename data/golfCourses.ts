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
  /**
   * Editorial 60-second aerial flyover narrative — present-tense,
   * second-person, ~150 words. Reads like a guided drone tour. Doubles
   * as the voiceover script if real flyover footage gets produced.
   * Rendered as a disclosure inside CourseCard.
   */
  flyover?: string;
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
    flyover:
      "You lift off Calibogue Sound at first light. The marina drops away — sailboats braced against the dock, a paddleboarder cutting a wake — and the lighthouse rises into frame, red and white against pale sky. Ease east over the 18th. Tight fairway, the lone crepe myrtle on the left, that one bunker Dye left to remind you who's in charge. Track south along the Sound: 17, 16, 15. The greens are small, surgical, framed by water on one side and pine on the other. Climb past the practice area. The signature is what closes you out — drop down behind the 18th green, lighthouse to your right, Sound to your left, the white marker stripes catching morning light. This is where the plaid jackets get handed out every April. You are watching the most ceremonial finishing hole in American golf.",
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
    flyover:
      "You start over Atlantic surf and pivot inland. Palmetto Dunes is a green grid of fairways and lagoons, bordered by dune and beach. Drift north along the property line; the ocean stays in your right peripheral. The 10th tee comes into view — a square box on the dune crest, the Atlantic crashing fifty yards behind it, a fairway running parallel to the sand. This is the only oceanfront tee shot on Hilton Head. Tee off and the wind off the Atlantic moves your ball; that is the design. Track inland through the heart of the course: re-bunkered sand glowing white, greens regrassed last year, lagoons threading the back nine. Loop back over the practice tee, the Marriott rising in the distance, then drop low along the 18th and pull up at the clubhouse. Salt-air round. Top-50 resort course for a reason.",
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
    flyover:
      "You leave Hilton Head and head west across the bridge into the Lowcountry proper. The May River appears below — wide, brown, tidal — and the course unfolds along its bank. This is Nicklaus golf in tidewater terrain. Track the 4th: a par-3 over a finger of marsh, osprey nests on the markers, the water table inches below the green. Climb above the live oaks. They are everywhere here, draped in moss, planted before the country was a country. Drift over the front nine and watch the fairways thread between the oaks like cut ribbon. The Montage's main lodge anchors the property to the south — cypress shingles, white columns, a pool that catches the afternoon sun. Drop low along 18, marsh on your left, oak on your right, then settle on the practice green. This is the closest American golf gets to a private estate.",
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
    flyover:
      "You lift off Plantation Drive and bank east. Heron Point sits inside Sea Pines, a Dye course that earns its place without the lighthouse. Track the front nine: wider than Harbour Town, more forgiving off the tee, but every green has the Dye signature — bunkers carved like blade strokes, false fronts, edges that fall to lagoons. The 6th comes into view, a short par-4 with pot bunkers reachable in two for the brave. Climb over the live-oak corridor between holes and settle above the back nine. Lagoons feed marsh, marsh feeds Calibogue. You can see Harbour Town's lighthouse from up here, two miles south. That's the joke locals tell: Heron Point is the better daily round, Harbour Town is the better souvenir. Drop low across the practice tee, the cart path empty at sunrise, then pull up at the Plantation Club. Most-played round in Sea Pines.",
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
    flyover:
      "You start over the South Beach end of Sea Pines. The course was reborn in 2016 — Davis Love's firm took the old Ocean Course and stripped it back to the dunes underneath. From altitude you can read the bones: links-style routing, grasses that bend in the wind, sand exposed and uncombed. Track the back nine where the dunes get serious. The fairways narrow, the rough goes brown in summer, and the wind off the Atlantic does work on every approach. Climb above the 14th and you can see the South Beach surf line. The course is reasonable for mid-handicappers — wider landing zones than Heron Point — but the wind taxes you on approach. Drop low across the 18th, fairway threading between the last two dunes, green tucked against a lagoon. Settle over the clubhouse. Forest Beach to your left, Atlantic behind you. Modern Sea Pines.",
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
    flyover:
      "You start over the Marriott pool deck and drift inland. Arthur Hills is the gentle one in the Palmetto Dunes triumvirate. From the air you read it as a network of lagoons stitched between fairways — eleven miles of water on this property, much of it on this course. The fairways are wide, the landing zones are kind, and the design forgives a slight push or pull better than Fazio next door. Track the front nine: lagoon on your left through the par-5 second, palmettos lining the third, a green on the fifth that sits low like a saucer in the grass. Climb above the back nine where the routing tightens slightly. The 16th and 17th run parallel, both par-4s, both honest. Drop along the 18th, clubhouse coming into frame, paddleboards leaning against the cart-barn wall. Warm-up round of choice for visiting groups.",
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
    flyover:
      "You start over the same Palmetto Dunes parcel as Arthur Hills, but this is the tighter cousin. George Fazio — Tom's uncle, often confused — built only two par-5s on this layout, which is rare and rewards accuracy over distance. From the air you can see the design intent: fairways that pinch, greens that punish a missed approach, fewer escape routes than next door. Track the front: par-3 third over water, par-4 fifth with bunkers shaped like commas, a green on the seventh that crowns and sheds the long ball. Climb above the back nine. Live oaks line the cart paths, palmettos cluster at the corners, and one of the par-3s runs uncomfortably toward a lagoon. Drop low at the 18th — flat, honest finishing hole, good chance to par if you've behaved. Pull up at the cart barn. Tighter, fairer round than its reputation.",
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
    flyover:
      "You start over the Port Royal complex from the south. Three eighteen-hole tracks share this footprint and you read them differently from altitude. Planters Row, the Robert Trent Jones design, holds the strongest land — wider fairways, more dramatic bunkering, the most championship feel of the three. Track east into Robbers Row, Cobb's older layout, narrower and more wooded, a course that rewards patience. Climb above Barony, the third track — friendlier, mid-handicap-friendly, the variety play. From up here you can see why this is the answer when Sea Pines and Palmetto Dunes are booked: three different rounds at one location, all fair-priced, all walkable, all kept up. Drop low across the practice area: range, short-game, putting green stacked in a wedge. Pull up at the clubhouse. Mid-island's quieter golf address, often forgotten, almost always available.",
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
    flyover:
      "You head twenty-five minutes north of Harbour Town. The traffic thins, the live oaks deepen, and Palmetto Hall opens up below — two parkland courses, an Arthur Hills track and a Robert Cupp track, threading the same plantation. Track the Hills first: rolling, classic, fairways framed by tall pines, greens set on small rises. Climb across to the Cupp side. More angular — Cupp liked geometric mounding — and a bit firmer underfoot. The clubhouse sits between them, a low brick building with a wraparound porch and a bar that closes at dusk. From altitude you can see why this is the value play: low cart paths, no resort traffic, less crowded weekdays. Drop low across the practice green. The drive back south is the tax. The round is the reward. Quieter Hilton Head golf, when the main island's full.",
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
    flyover:
      "You start over the marsh on the north end of the island. Rees Jones built this course in the eighties — Robert Trent Jones's son, his own designer — and the routing leans hard into salt marsh and pluff mud. The 6th comes into view: a par-3 that plays directly over a finger of tidal marsh, the green walled by oyster shell on one side, palmetto on the other. This hole is why the course exists in the rotation. Track north along the back nine. The fairways are wider than the design implies, the greens larger than recent Rees Jones work, and the conditioning is honest — not Sea Pines, but not abandoned either. Climb above the clubhouse, a dated brick affair with a wraparound deck. Drop low across the 18th. North-end value round when groups want more golf than the main resorts can supply.",
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
    flyover:
      "You lift off Pope Avenue and head into Shipyard. Three nines stitch this property: Brigantine, Clipper, Galleon. From the air you can read the variation. Brigantine to the south is the strongest of the three — pines lining the corridors, two par-3s with character, the green on the seventh sitting at the foot of a small lagoon. Climb across into Galleon, the second-strongest, slightly tighter, with a finishing par-5 that bends along a creek. Then you arrive at Clipper, and from up here you can see why locals steer groups away — the routing is tired, the bunkering generic, the conditioning a step behind. Most starters will rotate you onto Brigantine plus Galleon if the tee sheet allows; ask. Drop low across the cart barn, the resort villas catching morning sun. Settle near the practice green. Honest mid-island value when bigger names are booked.",
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
    flyover:
      "You leave Hilton Head and head into Bluffton, then a few miles further to a former rice plantation. Old South sits in this terrain — flat tidewater land, a creek braiding through the routing, live oaks where the plantation house used to be. From the air the course reads simple: Clyde Johnston's layout is honest parkland, fairways wide enough to play loose, greens small enough to demand a wedge. Track the front nine: par-4 third bending around a lagoon, par-5 fifth running long along the creek, a green on the seventh tucked under a moss-draped oak. Climb across the par-3 ninth and you can see Bluffton's church spires in the distance. Drop low across the back, the same tempo, the same mood. Settle at the clubhouse. Best mid-trip afternoon round in the region — under $140, never crowded, surprisingly memorable.",
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
