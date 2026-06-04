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
import type { AffiliateProgramId } from './affiliateLinks';
import type { AmazonProductCategoryId } from './amazonProducts';

/**
 * Optional affiliate placement on a trip-type landing page. Rendered by
 * `components/sections/TripTypeLanding.tsx` between the tradeoffs and the
 * concierge CTA — never replacing the concierge CTA, always alongside.
 *
 * Pages with at least one entry also auto-render <AffiliateDisclosure>
 * above the fold (FTC requirement — disclosure must be near the recommendation).
 */
export type TripAffiliateSlot = {
  programId: AffiliateProgramId;
  /** Override the program's defaultDeeplink. */
  deeplink?: string;
  /** Analytics label. Defaults to the trip-type slug. */
  placement?: string;
  /** Optional UI overrides — fall back to program defaults if omitted. */
  headline?: string;
  description?: string;
  cta?: string;
};

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
  /**
   * Slug of a /stories/[slug] page that shows a real trip of this type
   * end-to-end. When set, the trip-type page renders a "See the story" rail.
   */
  relatedStorySlug?: string;
  /**
   * Optional affiliate cards to render on the page. Up to 2 fit cleanly in
   * the layout. When set, the page also renders an <AffiliateDisclosure>
   * above the fold per FTC guidance.
   */
  affiliates?: TripAffiliateSlot[];
  /**
   * Optional Amazon product grid category. When set, TripTypeLanding renders
   * <AmazonProductGrid> for that category between the tradeoffs section and
   * any affiliate cards. The grid's own header includes FTC disclosure copy.
   *
   * Pick the category that matches the trip's buyer-intent:
   *   - 'beach-essentials' — generic beach gear (most beach trips)
   *   - 'family-beach' — kids + parents shopping
   *   - 'premium-beach' — oceanfront villa renters (higher AOV products)
   *   - 'couples-beach' — honeymoon / couples weekend
   *   - 'water-sports' — kayak/SUP/boat-day pages
   *   - 'beach-reads' — slower stays where books matter
   */
  amazonProductCategory?: AmazonProductCategoryId;
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
      "Eight golf courses inside fifteen minutes — three of them national Top-100 — and the group's biggest decision becomes which one to play Wednesday. We sequence the Harbour Town tee times by tide and crowd, match the foursome to a villa inside five minutes of the first tee, and have your bags in the cart by 7:42 a.m. for an 8:00 push. You're stretching at the range before the first group on Course 18 has reached the par-3.",
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
      { ...photos.lighthouse,  caption: 'Harbour Town, just past dusk' },
      { ...photos.golfFairway, caption: 'Cart path, Palmetto Dunes' },
      { ...photos.villa,       caption: 'A Sea Pines villa we book for golf groups' },
    ],
    blogPostSlug: 'hilton-head-golf-trip',
    relatedStorySlug: 'fall-golf-weekend',
    affiliates: [
      {
        programId: 'golfnow',
        placement: 'golf-packages',
        headline: 'Browse tee times across Hilton Head',
        description:
          'Live availability for Harbour Town, Palmetto Dunes, Sea Pines, and the rest of the island’s public courses. We still book the priority Sea Pines slots ourselves — GolfNow is for the in-between rounds.',
        cta: 'See live tee times →',
      },
      {
        programId: 'stay22',
        placement: 'golf-packages/stay22',
        headline: 'Compare stay-and-play lodging',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com for rooms and villas near the Sea Pines and Palmetto Dunes clubhouses — resort rooms for the priority tee sheet, whole-house rentals for groups splitting a kitchen.',
        cta: 'Compare golf-trip stays →',
      },
    ],
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
      "Your photographer keeps the flowers; we keep the eighty-seven people. Lodging across the right four properties, transportation from SAV synced to flight arrivals, the rehearsal-dinner table that catches the last light over Calibogue, and a welcome bag waiting in every villa by Thursday afternoon. The parts that turn a destination wedding back into a real vacation — for the friends and family you just flew in from three time zones, and for you.",
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
          'Transportation operators, welcome-bag suppliers, rehearsal-dinner holds at the restaurants that actually deliver. Booking after booking on this island compounds into a rolodex you cannot fake.',
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
    relatedStorySlug: 'october-villa-wedding',
  },

  // ———————————————————————————————————————————————————————————————
  // Stay style: oceanfront villas
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'oceanfront-villas',
    amazonProductCategory: 'premium-beach',
    path: '/hilton-head-oceanfront-villas',
    eyebrow: 'Stay style · Hilton Head Island',
    tagline: {
      plain: 'Hilton Head oceanfront villas,',
      italic: 'narrowed to the ones worth booking.',
    },
    seoTitle: 'Hilton Head Oceanfront Villas: Local Picks, Honest Reviews',
    metaDescription:
      'Hilton Head oceanfront villa rentals chosen by a local. Sea Pines, Palmetto Dunes, and Forest Beach inventory we\u2019ve walked into.',
    keywords: [
      'Hilton Head oceanfront villas',
      'Hilton Head beachfront villa rental',
      'Sea Pines oceanfront',
      'Palmetto Dunes oceanfront villa',
      'Forest Beach oceanfront condo',
      'Hilton Head oceanfront rental',
    ],
    hook:
      "The porches face two directions: into a live-oak canopy and out at an Atlantic that's flat by sunrise. There are roughly three hundred oceanfront villa units on Hilton Head. We regularly book maybe forty — we've walked the floor of every one, which means we know which 'oceanfront' is actually oceanfront and which one is a parking lot away from the dune. You'll wake up to that view by Tuesday morning.",
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
        title: 'Flat fee, not commissions',
        body:
          'We charge a flat planning fee. Whatever rate the property gives you is what you pay — no hidden booking commissions on top, no incentive for us to steer you toward a higher-rate stay.',
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
    affiliates: [
      {
        programId: 'stay22',
        placement: 'trip/oceanfront-villas/stay22',
        headline: 'Compare oceanfront stays',
        description:
          'One map across Booking, Vrbo, Airbnb, and Hotels.com for dune-line villas and oceanfront resort rooms — filter by dates to see what’s genuinely on the sand versus marketed as “oceanfront.”',
        cta: 'Compare oceanfront stays →',
      },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Trip type: family trip planner
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'family-trip-planner',
    amazonProductCategory: 'family-beach',
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
      "A week on Hilton Head should be the parents\u2019 vacation too. The villa that fits the age mix and the porch that catches the breeze. The camp week the kids talk about all August (which sells out in February if you don't know to ask). The dinner reservations that actually welcome kids under ten \u2014 not every restaurant on the island, no matter what the host says on the phone. By the third evening you're outside watching them chase fireflies and you're remembering what a vacation feels like.",
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
    relatedStorySlug: 'summer-family-week',
    affiliates: [
      {
        programId: 'stay22',
        placement: 'trip/family-planner/stay22',
        headline: 'Compare family stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com — multi-bedroom villas with kitchens and pools next to family hotels with a single check-in desk, priced side by side for your dates.',
        cta: 'Compare family stays →',
      },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Seasonal: spring break
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'spring-break',
    amazonProductCategory: 'beach-essentials',
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
    affiliates: [
      {
        programId: 'stay22',
        placement: 'trip/spring-break/stay22',
        headline: 'Compare spring-break stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com for the mid-March through April window. Inventory is widest the week before and after RBC Heritage — filter your dates to skip tournament-week premiums.',
        cta: 'Compare spring stays →',
      },
    ],
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
    hero: photos.mossOak,
    gallery: [
      { ...photos.marsh,       caption: 'Marsh at low sun, November' },
      { ...photos.boardwalk,   caption: 'Boardwalk, Thanksgiving morning' },
      { ...photos.dock,        caption: 'Creek dock, after the meal' },
    ],
    blogPostSlug: 'best-time-to-visit-hilton-head',
    affiliates: [
      {
        programId: 'stay22',
        placement: 'thanksgiving/stay22',
        headline: 'Compare Thanksgiving-week stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com. Inventory is at its widest of the year and rates run roughly half of July — whole-house rentals for multi-gen weeks, resort rooms if cooking isn’t the move.',
        cta: 'Compare Thanksgiving stays →',
      },
    ],
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
    seoTitle: 'Bluffton Travel: Old Town & Palmetto Bluff',
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
    affiliates: [
      {
        programId: 'stay22',
        placement: 'bluffton-planner/stay22',
        deeplink: 'https://www.stay22.com/allez?lat=32.237&lng=-80.860',
        headline: 'Compare Bluffton stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com for Old Town inns, Palmetto Bluff rooms, and May River whole-house rentals — the right base for May River Golf Club and Sandbar weekends.',
        cta: 'Compare Bluffton stays →',
      },
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
      'Harbour Town is the one-square-mile marina village at the south end of Sea Pines. Villa inventory inside this pocket is small (roughly 180 units) and the rate is the island\u2019s steepest for a reason: most guests never need to move their car. We point repeat guests at the four buildings worth chasing.',
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
          'The bar at the 18th green, west-facing over Calibogue Sound. Of every sunset spot on this island, nothing has beat the last ten minutes there. Worth walking to on night one.',
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
    affiliates: [
      {
        programId: 'stay22',
        placement: 'harbour-town-villas/stay22',
        deeplink: 'https://www.stay22.com/allez?lat=32.139&lng=-80.812',
        headline: 'Compare Harbour Town & Sea Pines stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com for private-owner villas inside Sea Pines and the Inn at Harbour Town — the inventory the resort’s public reservation page doesn’t always show.',
        cta: 'Compare Sea Pines stays →',
      },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Activity: beaches
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'beaches',
    amazonProductCategory: 'beach-essentials',
    path: '/hilton-head-beaches',
    eyebrow: 'Activity · Hilton Head beaches',
    tagline: {
      plain: 'The best Hilton Head beaches,',
      italic: 'ranked by use case.',
    },
    seoTitle: 'Hilton Head Beaches: Access, Parking & Picks',
    metaDescription:
      "A local's guide to Hilton Head beaches. Coligny, Alder Lane, Folly Field, Burkes, and Driessen. Parking, access, and which beach for which trip.",
    keywords: [
      'Hilton Head beaches',
      'best Hilton Head beach',
      'Coligny Beach Park',
      'Hilton Head public beach access',
      'Hilton Head beach parking',
      'Hilton Head family beach',
      'Alder Lane beach',
      'Folly Field Beach',
    ],
    hook:
      "Twelve miles of beach, five public access points, and a rising tide that cuts down the usable sand twice a day. We pick the right beach for the right trip. Coligny if you want the boardwalk energy, Alder Lane if you want quiet, Folly Field if you brought kids under five. Here is how we break it down.",
    reasons: [
      {
        title: 'Right beach for the right trip',
        body:
          'Coligny, Alder Lane, Folly Field, Burkes, Fish Haul, and Driessen each have a use case. A 6-year-old learning to boogie-board belongs on Folly Field (calm, shallow). A surfer belongs on Burkes. A couple on a sunrise walk belongs on Fish Haul. We match beach to trip.',
      },
      {
        title: 'Parking and access, honestly',
        body:
          'Coligny Beach Park has free parking but fills by 9:30 a.m. in July. Every other access charges $1-2/hour via meter or app. Alder Lane has the shortest boardwalk-to-sand on the island. We send clients the exact lot that works for their villa.',
      },
      {
        title: 'Tide timing changes the whole day',
        body:
          'Hard-packed low-tide sand is the best biking and running surface on the East Coast. High tide cuts usable beach to 6-8 feet in some stretches. We plan beach days around the tide chart, not the clock.',
      },
      {
        title: 'What the CVB will not tell you',
        body:
          "Two of the five public beach lots have sand-flea conditions in late June (seaweed bloom). One access has a painful walk in from the parking lot at low tide. None of this is in the official guide. We will save you a rough morning.",
      },
    ],
    bestFor: [
      'First-time Hilton Head visitors',
      'Families choosing between beaches by kid age',
      'Couples wanting the quietest stretch of sand',
      'Surfers and boogie-boarders looking for the right break',
    ],
    tradeoffs:
      "Every beach on Hilton Head is public from the high-water mark down. The differences are parking, access points, and crowd levels, not the sand itself. If you are inside a gated community (Sea Pines, Palmetto Dunes, Shipyard), your lodging includes a private access point that beats the public ones. The guidance here is optimized for off-resort or public-access visitors.",
    hero: photos.beachMorning,
    gallery: [
      { ...photos.boardwalk, caption: 'Boardwalk to Coligny, 7 a.m.' },
      { ...photos.beachAerial, caption: 'Atlantic from above' },
      { ...photos.hero, caption: 'Forest Beach at golden hour' },
    ],
    blogPostSlug: 'best-hilton-head-beaches',
  },

  // ———————————————————————————————————————————————————————————————
  // Trip type: honeymoon / couples getaway
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'honeymoon',
    amazonProductCategory: 'couples-beach',
    path: '/hilton-head-honeymoon',
    eyebrow: 'Trip type · Couples & honeymoon',
    tagline: {
      plain: 'A Hilton Head honeymoon,',
      italic: 'planned for two.',
    },
    seoTitle: 'Hilton Head Honeymoon: Local Planning Guide',
    metaDescription:
      "A local's guide to a Hilton Head honeymoon or couples getaway. S-tier villas, romantic dinners, sunset sails, and the quiet pockets that feel made for two.",
    keywords: [
      'Hilton Head honeymoon',
      'Hilton Head couples getaway',
      'Hilton Head romantic getaway',
      'Hilton Head anniversary trip',
      'Hilton Head couples weekend',
      'Hilton Head romantic dinner',
      'Palmetto Bluff honeymoon',
      'Hilton Head proposal',
    ],
    hook:
      "Hilton Head is quietly one of the best couples' trips on the East Coast — and that's the point. Palm-lined beaches you'll have to yourselves at sunrise, Spanish-moss sunsets over Calibogue, twenty miles of bike paths under a live-oak canopy, and a dinner scene that rewards a reservation we've already made for you. We plan honeymoons, anniversaries, and the milestone weekends where the watch comes off at the airport and doesn't go back on until you cross the bridge home.",
    reasons: [
      {
        title: 'The right neighborhood is Shelter Cove or Sea Pines',
        body:
          'Shelter Cove is marina-centric, quieter, and built for adults. Sea Pines gives you Harbour Town, the lighthouse, and four S-tier restaurants within a mile. Both work; we match the couple to the pocket. See the <a href="/hilton-head/shelter-cove">Shelter Cove guide</a> and <a href="/hilton-head/sea-pines">Sea Pines guide</a>.',
      },
      {
        title: 'The dinner sequence matters',
        body:
          "A four-night honeymoon should run: night 1 casual waterfront (Skull Creek), night 2 fine dining (Michael Anthony's or Red Fish), night 3 Bluffton escape (FARM), night 4 sunset sail with charcuterie. We book the sequence, not just individual dinners.",
      },
      {
        title: 'Palmetto Bluff is the splurge layer',
        body:
          "For honeymoons or anniversaries, two nights at Montage Palmetto Bluff (20 minutes off-island in Bluffton) is worth the premium. Book the May River Cottages, not the Inn rooms. We pair this with three nights on Hilton Head for the balance of cost and variety.",
      },
      {
        title: 'The proposal playbook',
        body:
          "Three proven spots: the 18th-hole deck at Quarterdeck (Harbour Town, sunset), the dune overlook at South Beach (private, quiet), or a sunset sail out of Palmetto Bay Marina. We coordinate the photographer, the reservation, and the after-drink without the surprise leaking.",
      },
    ],
    bestFor: [
      'Honeymoons, 4-7 nights',
      'Milestone anniversaries (10, 25, 50 years)',
      "Couples' weekend getaways, 2-3 nights",
      'Proposals requiring logistical coordination',
    ],
    tradeoffs:
      "Hilton Head in high summer (June-August) is a family island. The crowds are manageable but the vibe is family-resort. For a couples' trip, we strongly steer to mid-May, late September through October, or early December. The island is quieter, rates are 30-40% lower, and restaurants become actually walk-in-able.",
    hero: photos.sundown,
    gallery: [
      { ...photos.teaTable, caption: 'Shelter Cove dinner, sunset' },
      { ...photos.lighthouse, caption: 'Harbour Town, 6:30 p.m.' },
      { ...photos.hammock, caption: 'Between rounds, South Beach' },
    ],
    blogPostSlug: 'shelter-cove-guide',
    affiliates: [
      {
        programId: 'stay22',
        placement: 'honeymoon/stay22',
        headline: 'Compare couples’ stays',
        description:
          'One search across Booking, Vrbo, Airbnb, and Hotels.com — Sea Pines and Shelter Cove resort rooms next to private dune-line villas, priced side by side for the dates you want.',
        cta: 'Compare honeymoon stays →',
      },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // Seasonal: winter long-stay / snowbird
  // ———————————————————————————————————————————————————————————————
  {
    slug: 'winter-rental',
    path: '/hilton-head-winter-rental',
    eyebrow: 'Season · Long-stay November through March',
    tagline: {
      plain: 'Hilton Head winter long-stays,',
      italic: 'the quietest deal on the calendar.',
    },
    seoTitle: 'Hilton Head Winter Rental: Monthly & Snowbird Stays 2026',
    metaDescription:
      "A local's guide to winter and monthly Hilton Head rentals. 55-68°F days, 50% below peak rates, and the neighborhoods that stay alive off-season.",
    keywords: [
      'Hilton Head winter rental',
      'Hilton Head monthly rental',
      'Hilton Head snowbird rental',
      'Hilton Head long-term rental',
      'Hilton Head extended stay',
      'Hilton Head off-season rental',
      'Hilton Head winter villa',
      'Hilton Head January rental',
    ],
    hook:
      "Hilton Head November through March is a secret. Days run 55-68°F, nights 40-50°F, rates drop 50-55% below summer, and the island stays just busy enough that restaurants, bike shops, and grocery delivery keep full hours. We plan 30, 60, and 90-day winter stays for snowbirds and remote workers every year. Here is how.",
    reasons: [
      {
        title: 'Monthly villa rates run $3-8k',
        body:
          'A Palmetto Dunes 3BR oceanfront that runs $9k/week in July runs $5-6k for an entire month in January. Sea Pines mid-island 2BRs bottom out around $3k/month. Inventory is wide open; the tradeoff is you are paying by month, not week.',
      },
      {
        title: 'Weather is the real win',
        body:
          "Average January high: 58°F. February: 61°F. March: 67°F. Colder than Florida but warmer than New York, and sunny two-thirds of days. Hard freezes happen 1-3 nights/year. You will wear a jacket at sunset and a sweater most days; ocean swimming is out.",
      },
      {
        title: 'The island stays alive off-season',
        body:
          "Every major restaurant, grocery store, and bike shop stays open year-round. A handful close one night/week (usually Monday). Sea Pines Forest Preserve, Pinckney Island, and the bike paths are better in winter than summer. The island breathes out.",
      },
      {
        title: 'Pickleball, tennis, and golf',
        body:
          "Golf course conditions peak in February-March (overseeding, cool mornings, firm greens). Palmetto Dunes pickleball runs winter leagues for visiting members. Sea Pines tennis is 30% cheaper. If your winter trip is about staying active outside, this is the right calendar.",
      },
    ],
    bestFor: [
      'Snowbirds escaping Northeast or Midwest winters',
      'Remote workers wanting a month of better weather',
      'Retirees on 60-90 day stays',
      "Writers' retreats and sabbatical months",
      'Couples on budget who want off-season pricing',
    ],
    tradeoffs:
      "Winter is not a beach trip. Water is too cold to swim, a few seasonal operators pause (surf school, some sunset sails), and the island is genuinely quiet after 9 p.m. If your version of a Hilton Head trip is pool-plus-ocean-plus-crowds, pick April-October. If you want mild days, empty bike paths, and restaurant reservations becoming walk-in-able, winter is unbeatable.",
    hero: photos.mossOak,
    gallery: [
      { ...photos.marsh, caption: 'Marsh at low sun, January' },
      { ...photos.coastalOak, caption: 'Forest preserve, 4 p.m.' },
      { ...photos.dock, caption: 'Creek dock, November morning' },
    ],
    blogPostSlug: 'best-time-to-visit-hilton-head',
  },
];

export function getTripTypeBySlug(slug: string): TripTypeLanding | undefined {
  return tripTypes.find((t) => t.slug === slug);
}

// ---------------------------------------------------------------------------
// Cross-link relations between trip types. Each trip type lists 3 related
// trip types to feature in the "Other ways to visit" rail at the bottom of
// the landing page. Curated by editorial intent (e.g., honeymoon ↔ weddings,
// thanksgiving ↔ winter-rental).
// ---------------------------------------------------------------------------

export const TRIP_TYPE_RELATIONS: Record<string, string[]> = {
  'golf-packages': ['oceanfront-villas', 'harbour-town-villas', 'family-trip-planner'],
  weddings: ['honeymoon', 'oceanfront-villas', 'harbour-town-villas'],
  honeymoon: ['weddings', 'oceanfront-villas', 'winter-rental'],
  'oceanfront-villas': ['harbour-town-villas', 'family-trip-planner', 'beaches'],
  'family-trip-planner': ['beaches', 'spring-break', 'oceanfront-villas'],
  'spring-break': ['family-trip-planner', 'beaches', 'oceanfront-villas'],
  thanksgiving: ['winter-rental', 'family-trip-planner', 'oceanfront-villas'],
  bluffton: ['family-trip-planner', 'weddings', 'oceanfront-villas'],
  'harbour-town-villas': ['oceanfront-villas', 'golf-packages', 'family-trip-planner'],
  beaches: ['family-trip-planner', 'oceanfront-villas', 'spring-break'],
  'winter-rental': ['thanksgiving', 'oceanfront-villas', 'honeymoon'],
};

/**
 * Returns the resolved TripTypeLanding objects for the given slug's
 * related trip types. Filters out the current slug and any unresolved IDs.
 */
export function getRelatedTripTypes(slug: string): TripTypeLanding[] {
  const slugs = TRIP_TYPE_RELATIONS[slug] ?? [];
  return slugs
    .filter((s) => s !== slug)
    .map((s) => getTripTypeBySlug(s))
    .filter((t): t is TripTypeLanding => !!t);
}

/**
 * Friendly display name for a trip type. Strips the colon-suffix from
 * the SEO title (e.g., "Hilton Head Golf Packages: Planned by a Local"
 * -> "Hilton Head Golf Packages").
 */
export function getTripTypeDisplayName(t: TripTypeLanding): string {
  return t.seoTitle.split(':')[0].trim();
}
