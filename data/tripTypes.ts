/**
 * Trip-type landing pages.
 *
 * Parallel to data/neighborhoods.ts but organized around the kind of trip
 * ("golf packages," "weddings") rather than the geographic pocket. These
 * target high-intent keywords that people search when they've already
 * decided on Hilton Head but not on a villa address.
 *
 * URL convention: each record maps to a top-level keyword-rich route,
 * e.g., /hilton-head-golf-packages. Top-level keeps the slug in the URL
 * for SEO weight instead of burying it under /trip-types/.
 */

import { photos } from './photos';

export type TripTypeLanding = {
  slug: string;
  /** Top-level route, e.g., "/hilton-head-golf-packages". */
  path: string;
  /**
   * Small-caps eyebrow shown above the H1. Defaults to
   * "Trip type · Hilton Head Island" for Hilton Head-specific pages;
   * override for regional pages (e.g., Bluffton) or stay-style pages
   * (e.g., "Stay style · Oceanfront villas").
   */
  eyebrow?: string;
  /** Display H1 (plain + italic trading lines, same convention as neighborhoods). */
  tagline: { plain: string; italic: string };
  /** SEO title used in <title>. */
  seoTitle: string;
  /** SEO meta description, under 158 chars. */
  metaDescription: string;
  keywords: string[];
  /** Short 1-2 sentence hero hook. */
  hook: string;
  /** Four reasons to choose us for this trip type. */
  reasons: Array<{ title: string; body: string }>;
  /** Best-for traveler segments. */
  bestFor: string[];
  /** Honest downsides paragraph. */
  tradeoffs: string;
  /** Hero image and supporting gallery (3 images). */
  hero: { src: string; alt: string };
  gallery: Array<{ src: string; alt: string; caption: string }>;
  /** Slug of the long-form blog post to link out to (if any). */
  blogPostSlug?: string;
};

export const tripTypes: TripTypeLanding[] = [
  {
    slug: 'golf-packages',
    path: '/hilton-head-golf-packages',
    tagline: {
      plain: 'Hilton Head golf packages,',
      italic: 'planned by someone who plays here.',
    },
    seoTitle: 'Hilton Head Golf Packages: Planned by a Local',
    metaDescription:
      'Custom Hilton Head golf trip packages. Harbour Town tee-time priority, Palmetto Dunes three-course mix, villas inside five minutes of first tee.',
    keywords: [
      'Hilton Head golf packages',
      'Hilton Head golf trip',
      'Harbour Town tee times',
      'Hilton Head golf vacation',
      'Sea Pines golf package',
      'Palmetto Dunes golf',
      'Hilton Head stay and play',
    ],
    hook:
      'Eight golf courses inside fifteen minutes, three of them national Top-100. We book the Harbour Town tee times that never surface on the resort\u2019s public page, negotiate villa rates with the partner operators, and land the whole group at first tee with time to stretch.',
    reasons: [
      {
        title: 'Harbour Town priority',
        body:
          'Sea Pines Resort villa guests get 120-day Harbour Town tee-time priority. We book villa + course as a package so your group actually lands on the first-tee sheet at RBC Heritage calibre.',
      },
      {
        title: 'Three courses on one plantation',
        body:
          'Palmetto Dunes runs Robert Trent Jones Oceanfront, Fazio, and Arthur Hills off one tee sheet. One log-in, three courses, and the drive between them is measured in minutes, not miles.',
      },
      {
        title: 'Villa-to-first-tee logistics',
        body:
          'We pick lodging inside the gate so the morning is a five-minute cart ride, not a twenty-minute drive through Cross Island traffic. Range time, breakfast, and beers on eighteen all make it.',
      },
      {
        title: 'Group pricing and pace',
        body:
          'Twelve-guy groups get grouped sensibly across handicap, with skin-game-friendly cart assignments. Afternoon reservations, dinner tee-off, the whole thing.',
      },
    ],
    bestFor: [
      'Six to twelve guys',
      'Spring and fall peak golf weather',
      'Mixed-skill corporate offsites',
      'Milestone birthday weekends',
    ],
    tradeoffs:
      'Summer gets humid and slow: tee times slide, pace is four and a half hours on a good day. Winter has two or three genuinely cold weeks. The sweet windows are mid-March to late May and mid-September to early December. We will tell you honestly if your dates are in a soft spot.',
    hero: photos.hero,
    gallery: [
      { ...photos.lighthouse, caption: 'Harbour Town, just past dusk' },
      { ...photos.bikePath,   caption: 'Cart path, Palmetto Dunes' },
      { ...photos.villa,      caption: 'A Sea Pines villa we book for golf groups' },
    ],
    blogPostSlug: 'hilton-head-golf-trip',
  },
  {
    slug: 'weddings',
    path: '/hilton-head-weddings',
    tagline: {
      plain: 'Hilton Head weddings,',
      italic: 'planned around the guest experience.',
    },
    seoTitle: 'Hilton Head Wedding Planning: Lodging, Logistics, Guests',
    metaDescription:
      'Hilton Head wedding weekends planned from the local side. Group lodging across 8 to 12 properties, airport shuttles, welcome bags, rehearsal logistics.',
    keywords: [
      'Hilton Head wedding planner',
      'Hilton Head wedding weekend',
      'Hilton Head destination wedding',
      'Sea Pines wedding',
      'Palmetto Bluff wedding guest lodging',
      'Hilton Head wedding group travel',
    ],
    hook:
      'We plan the lodging, the logistics, and the guest experience around your venue. Not the ceremony. Not the flowers. The parts that make a destination wedding feel like an actual vacation for the family and friends you just flew in from three time zones.',
    reasons: [
      {
        title: 'Lodging across eight to twelve properties',
        body:
          'One hotel block rarely works for 60 guests (kids, parents, your college roommate who brought three kids). We distribute across villas, resorts, and smaller inns so every household lands somewhere that fits.',
      },
      {
        title: 'We complement your venue planner',
        body:
          'Your Palmetto Bluff, Sea Pines, or private-estate planner owns the ceremony. We own what happens before and after: welcome dinner, rehearsal night, brunch the morning after, airport runs on Sunday.',
      },
      {
        title: 'Vendor relationships that already exist',
        body:
          'Transportation operators, welcome-bag suppliers, rehearsal-dinner holds at the restaurants that actually deliver. Twelve years of booking on this island compounds into a rolodex you cannot fake.',
      },
      {
        title: 'Three days of on-island concierge',
        body:
          'From Thursday night rehearsal through Sunday morning departures, someone is a text away when the flowers run late or cousin Dave\u2019s flight reroutes through Atlanta.',
      },
    ],
    bestFor: [
      'Forty to one hundred guest weddings',
      'Multi-day family-plus-friends weekends',
      'Rehearsal + welcome-night planning',
      'Group transportation and airport shuttles',
    ],
    tradeoffs:
      'We are not your ceremony planner. If you want one person running vows-through-cake, book a full-service wedding planner first and loop us in for lodging and logistics. We also don\u2019t do elopements or weddings under twenty guests; the coordination overhead does not match the payoff for groups that small.',
    hero: photos.dock,
    gallery: [
      { ...photos.harborBoats, caption: 'Shelter Cove marina rehearsal dinner' },
      { ...photos.villa,       caption: 'Family-block villa, Sea Pines' },
      { ...photos.mossOak,     caption: 'Lowcountry oaks, wedding portraits' },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Stay style: oceanfront villas
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'oceanfront-villas',
    path: '/hilton-head-oceanfront-villas',
    eyebrow: 'Stay style · Hilton Head Island',
    tagline: {
      plain: 'Hilton Head oceanfront villas,',
      italic: 'narrowed to the ones worth booking.',
    },
    seoTitle: 'Hilton Head Oceanfront Villas: Local Picks, Honest Reviews',
    metaDescription:
      'Hilton Head oceanfront villa rentals chosen by a local. Sea Pines, Palmetto Dunes, and Forest Beach inventory we\u2019ve walked into, with partner rates.',
    keywords: [
      'Hilton Head oceanfront villas',
      'Hilton Head beachfront villa rental',
      'Sea Pines oceanfront',
      'Palmetto Dunes oceanfront villa',
      'Forest Beach oceanfront condo',
      'Hilton Head oceanfront rental',
    ],
    hook:
      'There are roughly three hundred oceanfront villa units on Hilton Head. We regularly book maybe forty of them. The rest have some mix of old renovations, bad management, or a pool that catches every afternoon shadow after 3 p.m. Here is how we think about the short list.',
    reasons: [
      {
        title: 'We have walked every building',
        body:
          'Not a listings page. Actual visits in the last twelve months. We know which Sea Pines oceanfront stack has the good elevator, which Palmetto Dunes villa line catches the tradewinds at dinner, and which Forest Beach condo tower sounds like a highway at dawn.',
      },
      {
        title: 'Oceanfront is a spectrum',
        body:
          'True-oceanfront (sand-edge patio) runs $7k-$14k a week in peak. Ocean-view (first row inland) runs 40% less and is often the smarter pick for families who do not want a tidepool two steps from the crib.',
      },
      {
        title: 'Partner rates, not commissions',
        body:
          'Forty-plus partner properties quote us below the rate on Vrbo and the resort sites. We pass the spread to you as part of the flat-fee engagement. No hidden booking commissions.',
      },
      {
        title: 'The pool problem',
        body:
          'Most oceanfront pools are north-facing and go shadow by 3 p.m. in summer. We know the three exceptions. On a rainy day, we know which clubhouse pool is worth the drive.',
      },
    ],
    bestFor: [
      'Families wanting "walk out the door to sand"',
      'Anniversary / milestone couples',
      'Groups of eight-plus who need two-plus primary suites',
      'Peak summer weeks where non-oceanfront feels like a compromise',
    ],
    tradeoffs:
      'Oceanfront is expensive. If your budget is under $4k for the week, an ocean-view or interior villa gets you a better property in almost every case. If you have kids under five, the two-second beach access becomes a supervision tax: parents will be up and tracking from the kitchen window. We will tell you honestly when ocean-view is the smarter pick.',
    hero: photos.hero,
    gallery: [
      { ...photos.villa,       caption: 'Sea Pines oceanfront, low season' },
      { ...photos.beachMorning,caption: 'The patio view, 7 a.m.' },
      { ...photos.surfSoft,    caption: 'High tide, end of July' },
    ],
    blogPostSlug: '2026-best-places-to-stay-hilton-head',
  },

  // ———————————————————————————————————————————————————————————————
  // Trip type: family trip planner
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'family-trip-planner',
    path: '/hilton-head-family-trip-planner',
    eyebrow: 'Trip type · Hilton Head Island',
    tagline: {
      plain: 'A Hilton Head family trip,',
      italic: 'without the parent-as-concierge shift.',
    },
    seoTitle: 'Hilton Head Family Vacation Planner: Villas, Camps, Logistics',
    metaDescription:
      'Hilton Head family trip planning. Villa picks by age range, kids\u2019 camp intel, dinner reservations that actually welcome children, and a text line when plans change.',
    keywords: [
      'Hilton Head family vacation',
      'Hilton Head family trip planner',
      'Hilton Head kids camp',
      'Hilton Head family villa rental',
      'family vacation Hilton Head',
      'Hilton Head with kids',
    ],
    hook:
      'A week on Hilton Head should be the parents\u2019 vacation too. We plan villas that actually fit the age mix, book the camp weeks before they sell out in February, and sort the dinner reservations that welcome kids under ten (which is not every restaurant on the island, no matter what the host says on the phone).',
    reasons: [
      {
        title: 'Villa picked to the age mix',
        body:
          'Twin toddlers is a different villa search than two teenagers. We match bedrooms, pool depth, distance-to-sand, and whether a sleepwalking four-year-old will end up in the marsh. Real criteria, not vibes.',
      },
      {
        title: 'Camp and activity bookings, months out',
        body:
          'Palmetto Dunes tennis summer camp fills in mid-February. Sandbox sailing camp sells out in March. The good surf camp has eight spots per session. We book these before the calendar invite hits your inbox.',
      },
      {
        title: 'Kid-welcoming dinners that are still good',
        body:
          'Skull Creek Boathouse, Hudson\u2019s, A Lowcountry Backyard. Not every restaurant on the island welcomes a four-year-old; we know which ones actually mean it and which ones just put up with it.',
      },
      {
        title: 'The rain-day playbook',
        body:
          'Four rainy days in a row in August is common. We have a texted list of indoor plays that are not the aquarium-in-Beaufort drive (one great option, and five local backups).',
      },
    ],
    bestFor: [
      'Families with kids six to fourteen',
      'Multi-generational trips (grandparents plus grandkids)',
      'First-time Hilton Head visitors',
      'Parents who have never planned an island vacation before',
    ],
    tradeoffs:
      'If your kids are all under three, Hilton Head is expensive relative to what you will actually use (beach access is great; the rest you can skip). A closer beach vacation usually serves you better until the youngest is four-plus. We will say so on the discovery call if that is the case.',
    hero: photos.hammock,
    gallery: [
      { ...photos.boardwalk,   caption: 'Boardwalk to Coligny, mornings' },
      { ...photos.bikePath,    caption: 'Sea Pines, kids bike loop' },
      { ...photos.villa,       caption: 'Family villa, Palmetto Dunes' },
    ],
    blogPostSlug: 'hilton-head-with-kids',
  },

  // ———————————————————————————————————————————————————————————————
  // Seasonal: spring break
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'spring-break',
    path: '/hilton-head-spring-break',
    eyebrow: 'Season · Mid-March to April',
    tagline: {
      plain: 'Hilton Head spring break,',
      italic: 'the opposite of the Gulf Coast circus.',
    },
    seoTitle: 'Hilton Head Spring Break: Villa Picks, Weather, Timing',
    metaDescription:
      'Hilton Head spring break from the local side. Peak-week timing, best mid-March vs April tradeoffs, kid-friendly villa picks, and Heritage-tournament overlap warnings.',
    keywords: [
      'Hilton Head spring break',
      'Hilton Head spring vacation',
      'spring break Hilton Head Island',
      'Hilton Head Easter week',
      'RBC Heritage spring break',
      'Hilton Head family spring break',
    ],
    hook:
      'Hilton Head in March and April is one of the country\u2019s best family spring-break destinations, and most people do not realize it. The island stays quiet (no South Padre crowd), the Atlantic warms up enough to swim by early April, and the golf courses are at their peak condition before summer humidity hits.',
    reasons: [
      {
        title: 'Mid-March vs early April',
        body:
          'Mid-March: cooler (60s-low 70s), pool is not comfortable yet, but trails, bike, and restaurants are wide open. Early April: 75-degree afternoons, Atlantic at 68 degrees, the week before tournaments. Both great, different trips.',
      },
      {
        title: 'The Heritage tournament overlap',
        body:
          'The RBC Heritage is mid-April. That week, Sea Pines is full, villa rates are 40% higher, and Harbour Town is closed to public play. Fine if you are going for the tournament; chaos if you are not.',
      },
      {
        title: 'Easter-week specifics',
        body:
          'Easter week is consistently the busiest non-summer week. We book it six-plus months out, and the villas left by March are almost always the ones that were not booked for a reason.',
      },
      {
        title: 'Weather honestly',
        body:
          'March has a 30% chance of a three-day Atlantic low. April is drier. Pack rain gear either way and a plan for two-plus rain days (we will send you the indoor list).',
      },
    ],
    bestFor: [
      'Families looking to avoid Gulf Coast spring-break crowds',
      'Golfers who want peak course condition',
      'Couples who want shoulder-season villa pricing',
      'First visits where summer would feel overwhelming',
    ],
    tradeoffs:
      'If you need guaranteed pool weather and 80-plus degrees every day, pick May or later. The Atlantic does not really warm up for swimming until the second week of April. Hotel/villa rates on the tournament week (mid-April) are bad enough that we steer most clients to the week before or after.',
    hero: photos.beachMorning,
    gallery: [
      { ...photos.marsh,       caption: 'Marsh in early April' },
      { ...photos.palms,       caption: 'South Beach, quiet week' },
      { ...photos.lighthouse,  caption: 'Harbour Town, pre-tournament' },
    ],
    blogPostSlug: 'best-time-to-visit-hilton-head',
  },

  // ———————————————————————————————————————————————————————————————
  // Seasonal: Thanksgiving
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'thanksgiving',
    path: '/hilton-head-thanksgiving',
    eyebrow: 'Season · Thanksgiving week',
    tagline: {
      plain: 'Hilton Head Thanksgiving,',
      italic: 'the value week nobody talks about.',
    },
    seoTitle: 'Hilton Head Thanksgiving Week: Villas, Weather, Dinner',
    metaDescription:
      'Hilton Head Thanksgiving week planning. Surprisingly affordable villas, sixty-degree days, and which restaurants actually serve a real Thanksgiving dinner.',
    keywords: [
      'Hilton Head Thanksgiving',
      'Thanksgiving Hilton Head',
      'Hilton Head November',
      'Hilton Head Thanksgiving dinner',
      'Thanksgiving week villa Hilton Head',
      'Hilton Head fall trip',
    ],
    hook:
      'Thanksgiving week on Hilton Head is consistently mid-60s, sometimes 75, the restaurants are open, and a Sea Pines oceanfront villa runs half of what the same unit costs in July. Yet the island runs 40% empty. We build Thanksgiving weeks for roughly twenty families a year and the pattern does not change.',
    reasons: [
      {
        title: 'Villa rates are halved',
        body:
          'A Palmetto Dunes 4BR oceanfront that costs $9k in July runs $4,200 for Thanksgiving week. Sea Pines stacks that never discount drop their minimums. Villa inventory is the most abundant it is all year.',
      },
      {
        title: 'The weather is honestly great',
        body:
          'Averages: 67-degree days, 52-degree nights, sun most afternoons. Too cold for ocean swimming; perfect for beach walks, bike paths, and long-sleeve dinners on a patio.',
      },
      {
        title: 'Who actually cooks Thanksgiving dinner',
        body:
          'Old Fort Pub and Michael Anthony\u2019s do real Thanksgiving menus. A Lowcountry Backyard does a casual version. Skull Creek runs a buffet. Plenty of villas come with a kitchen if you want to cook; we have a standing list of grocery-delivery operators who work the holiday.',
      },
      {
        title: 'Day-after shopping, quietly',
        body:
          'Tanger Outlets on Black Friday is not Hilton Head\u2019s problem; it is Bluffton\u2019s. The island itself stays calm. If you want outlet shopping, we time a half-day run before 10 a.m. and you are back on the bike path by noon.',
      },
    ],
    bestFor: [
      'Multi-generational family gatherings (four-plus households)',
      'Families who want to skip the host-the-meal pressure',
      'Couples who want shoulder-season value',
      'Anyone who loves Hilton Head but hates summer crowds',
    ],
    tradeoffs:
      'Ocean swimming is out (water hovers mid-60s). Some seasonal operators (surf school, sunset sails) are closed for the year. If your kids will be crushed not to swim, pick a different week; otherwise this is the best trade we know on the calendar.',
    hero: photos.coastalOak,
    gallery: [
      { ...photos.marsh,       caption: 'Marsh at low sun, November' },
      { ...photos.boardwalk,   caption: 'Boardwalk, Thanksgiving morning' },
      { ...photos.dock,        caption: 'Creek dock, after the meal' },
    ],
    blogPostSlug: 'best-time-to-visit-hilton-head',
  },

  // ———————————————————————————————————————————————————————————————
  // Regional: Bluffton
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'bluffton',
    path: '/bluffton-travel-planner',
    eyebrow: 'Regional · Bluffton, SC',
    tagline: {
      plain: 'Bluffton travel planning,',
      italic: 'eighteen minutes off the island.',
    },
    seoTitle: 'Bluffton Travel Planner: Old Town, Palmetto Bluff, Lodging',
    metaDescription:
      'Bluffton travel planning for couples and foodie weekends. Old Town boutique stays, Palmetto Bluff, and a quieter alternative to Hilton Head Island lodging.',
    keywords: [
      'Bluffton travel planner',
      'Bluffton SC vacation',
      'Palmetto Bluff Bluffton',
      'Old Town Bluffton',
      'Bluffton vs Hilton Head',
      'Bluffton couples trip',
    ],
    hook:
      'Bluffton is eighteen minutes off the north end of Hilton Head and runs at sixty cents on the Hilton Head dollar for lodging. Old Town Bluffton has a denser restaurant pocket per square mile than the island itself. For adult trips, foodie weekends, and multi-night Palmetto Bluff stays, we plan as much Bluffton as we do Hilton Head.',
    reasons: [
      {
        title: 'Sixty cents on the dollar',
        body:
          'Same caliber villa or inn, roughly 35-40% lower rate. The Montage Palmetto Bluff and Inn at Palmetto Bluff are the island\u2019s luxury tier at a meaningful discount to Sea Pines premium stays.',
      },
      {
        title: 'The Old Town food pocket',
        body:
          'Calhoun Street alone has FARM, The Cottage, and Captain Woody\u2019s inside a 400-foot walk. Add in Old Town Dispensary and May River Grill, and you have five-plus legitimately good dinners in one walkable square. Hilton Head does not.',
      },
      {
        title: 'Adults-first atmosphere',
        body:
          'Palmetto Bluff\u2019s vibe is wedding-resort, not family-resort. Old Town Bluffton is a nineteenth-century fishing village with wine bars. We book these for couples, milestone anniversaries, and honeymoons that want Hilton Head nature without the Spring-Break-Central-Ocean-Drive energy.',
      },
      {
        title: 'Day-tripping to the island',
        body:
          'You still get the beach: eighteen minutes in the car. We plan the "two days in Bluffton, three days on Hilton Head" split often, usually with the Bluffton nights being the ones you remember at dinner.',
      },
    ],
    bestFor: [
      'Couples\u2019 and anniversary weekends',
      'Foodie-first trips',
      'Destination weddings at Palmetto Bluff',
      'Longer stays (seven-plus nights) looking for variety',
    ],
    tradeoffs:
      'The beach is eighteen minutes away, not two. If sand access matters every single day, stay on Hilton Head itself. Old Town Bluffton is also small; visitors looking for a resort-amenity stack (pools, lazy river, kids club) will feel under-programmed here. Palmetto Bluff solves that but at Sea Pines-level pricing.',
    hero: photos.mossOak,
    gallery: [
      { ...photos.teaTable,   caption: 'Old Town Bluffton dinner table' },
      { ...photos.dock,       caption: 'May River at low tide' },
      { ...photos.harborBoats,caption: 'Boats at Palmetto Bluff' },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Place-specific: Harbour Town villas
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'harbour-town-villas',
    path: '/harbour-town-villas',
    eyebrow: 'Stay location · Sea Pines Resort',
    tagline: {
      plain: 'Harbour Town villas,',
      italic: 'walking distance to the 18th.',
    },
    seoTitle: 'Harbour Town Villas Hilton Head: Rentals Inside Sea Pines',
    metaDescription:
      'Harbour Town villa rentals inside Sea Pines. The four buildings locals actually recommend for golf, marina access, and walking-distance dining.',
    keywords: [
      'Harbour Town villas',
      'Harbour Town villa rental',
      'Sea Pines Harbour Town rental',
      'villas near Harbour Town',
      'Harbour Town Hilton Head condos',
      'Sea Pines marina villa',
    ],
    hook:
      'Harbour Town is the one-square-mile marina village at the south end of Sea Pines. Villa inventory inside this pocket is small (roughly 180 units) and the rate is the island\u2019s steepest for a reason: most guests never need to move their car. We book four buildings here consistently.',
    reasons: [
      {
        title: 'Walking radius beats driving radius',
        body:
          'From a Harbour Town villa, 18th-hole golf, Quarterdeck sunset, the marina shops, and three restaurants are a five-to-eight-minute walk. Park the car Friday, retrieve it Sunday. That is rare on this island.',
      },
      {
        title: 'The four buildings we book',
        body:
          'Harbour Town Villas (marina-view), Inn at Harbour Town (hotel-caliber service, villa amenities), Club Cottages (detached, 3-4BR), and select private owners in Heritage Villas. Each solves a different group size.',
      },
      {
        title: 'Tee-time priority is real here',
        body:
          'Sea Pines Resort guests get 120-day Harbour Town tee-time priority. You cannot buy that access as a day-visitor. The villa is effectively your permit into the RBC Heritage\u2019s course.',
      },
      {
        title: 'Sunset at the Quarterdeck',
        body:
          'The bar at the 18th green, west-facing over Calibogue Sound. In twelve years of booking this island, nothing has beat the last ten minutes of sunset there. Worth walking to on night one.',
      },
    ],
    bestFor: [
      'Golfers prioritizing Harbour Town access',
      'Couples wanting a car-free long weekend',
      'Small groups (four to six) paying for convenience',
      'Milestone birthdays and anniversaries',
    ],
    tradeoffs:
      'Harbour Town villas price 30-50% above comparable Sea Pines interior rentals. If your family spends most of the week on the beach, you are paying a premium for marina views you do not use. South Beach Lane villas (1.5 miles east) trade four extra minutes of driving for 40% savings and direct sand access; worth considering.',
    hero: photos.lighthouse,
    gallery: [
      { ...photos.lighthouse,  caption: 'The 18th hole at sunset' },
      { ...photos.harborBoats, caption: 'Harbour Town marina, 7 p.m.' },
      { ...photos.villa,       caption: 'Heritage Villas, private owner' },
    ],
    blogPostSlug: 'sea-pines-guide',
  },
];

export function getTripTypeBySlug(slug: string): TripTypeLanding | undefined {
  return tripTypes.find((t) => t.slug === slug);
}
