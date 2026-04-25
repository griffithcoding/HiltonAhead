/**
 * Per-month weather + travel data for Hilton Head Island.
 *
 * Each entry powers /hilton-head-weather/[slug]. The dynamic page renders
 * structured data (climate facts, what-is-open) plus editorial prose so
 * each month has its own indexable URL with a unique title, meta
 * description, and ~700-word body — distinct ranking signals for queries
 * like "Hilton Head weather October" vs the head term "Hilton Head weather."
 *
 * Climate values are 30-year NOAA averages from the Savannah station,
 * adjusted +2-3°F on water temp to reflect Hilton Head's shallow shelf.
 */

export type MonthData = {
  slug: string; // URL slug, e.g. 'january'
  name: string; // display name, e.g. 'January'
  monthNumber: number; // 1-12
  prev: string; // slug of previous month for nav
  next: string; // slug of next month

  // Climate data
  avgHigh: number; // °F
  avgLow: number; // °F
  waterTemp: number; // °F
  rainyDays: number; // days with measurable precip
  rainfallInches: number;
  humidity: string; // descriptor
  daylight: string; // approximate hours
  sunset: string; // mid-month sunset time

  // Travel context
  crowdLevel: string;
  rateIndex: number; // % of July peak villa rate (July = 100)
  bestFor: string[];
  watchOut: string[];

  // Editorial copy (written, not generated)
  headline: string; // 1-line tagline under H1
  intro: string; // 2-3 sentence opening paragraph
  whatItFeelsLike: string; // longer narrative
  recommendation: string; // direct answer to "should I visit"

  whatsOpen: string;
  packing: string;
  bestActivities: string[]; // 4-6 month-specific activities
  bookingNotes: string;

  faq: Array<{ q: string; a: string }>;
};

const MONTH_ORDER = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const;

function neighbor(slug: string, offset: number): string {
  const idx = MONTH_ORDER.indexOf(slug as (typeof MONTH_ORDER)[number]);
  const next = (idx + offset + 12) % 12;
  return MONTH_ORDER[next];
}

const raw: Omit<MonthData, 'prev' | 'next'>[] = [
  // ——— JANUARY ———————————————————————————————————————————————————
  {
    slug: 'january',
    name: 'January',
    monthNumber: 1,
    avgHigh: 58, avgLow: 41, waterTemp: 55,
    rainyDays: 8, rainfallInches: 3.4,
    humidity: '60-70%',
    daylight: '10 hours 15 min',
    sunset: '5:35 p.m. (mid-month)',
    crowdLevel: 'Very low',
    rateIndex: 42,
    bestFor: [
      'Snowbirds on 30-day rentals',
      'Budget couples and writers’ retreats',
      'Long bike rides on cool dry days',
      'Bird-watching at Pinckney Island',
    ],
    watchOut: [
      'Ocean is too cold to swim (55°F)',
      'A handful of restaurants close one night a week',
      'Hard freezes happen 1-3 nights per month',
    ],
    headline: 'The cheapest, quietest month on Hilton Head.',
    intro: "January is when Hilton Head exhales. Rates bottom at 40-45% of July peak, the bike paths are cool and dry, and the only crowds are at the four or five restaurants that locals frequent year-round. It is the month we book most of our snowbird long-stays.",
    whatItFeelsLike: "Days run sunny and cool, averaging 58°F with frequent 65°F afternoons. Mornings start at 41°F (warm jacket weather) and ease into shorts-and-sweater range by 11 a.m. Skies are clear about two-thirds of days. The Atlantic is too cold to swim at 55°F, but the beach itself is wide and empty, the hard-packed sand at low tide stretches for miles, and you will share it with two or three other people.",
    recommendation: "Yes, if you want a quiet escape from a colder Northeast or Midwest winter and you can amortize the travel over at least a week. No, if you need pool weather or ocean swimming. Most snowbirds we book stay 30 days; a handful do 60 or 90.",
    whatsOpen: "All 12+ golf courses, all major restaurants (3-4 close one night a week, usually Monday), the Coastal Discovery Museum, all bike rentals, kayak tours (the 7 a.m. slot is genuinely spectacular in winter mist), Pinckney Island, the Sea Pines Forest Preserve, and every grocery and pharmacy. Surf school is closed until May; one or two of the six sunset-sail operators reduce hours.",
    packing: "Jeans, long-sleeve tees, a real sweater, a windbreaker for the beach walk, waterproof shoes, one dinner-out outfit. A swimsuit is optional (villa hot tubs only). Skip the flip-flops; pack closed-toe shoes for cool mornings.",
    bestActivities: [
      'Long bike rides on the hard-packed beach at low tide',
      'Sea Pines Forest Preserve hike to the Dragon Tree',
      'Pinckney Island National Wildlife Refuge (peak winter bird migration)',
      'Sunrise kayak tour with Outside Hilton Head (book ahead, 7 a.m.)',
      'Indoor cooking projects at the villa (it is 41°F at night)',
      'Off-island day trip to Savannah for a museum afternoon',
    ],
    bookingNotes: "Two-week lead time is fine for villas; same-day for resort rooms. Monthly rentals run $2,800-3,500 for a 2BR interior villa, $5,500-7,500 for a 3BR oceanfront. Restaurants take walk-ins almost everywhere. Golf tee times are bookable inside a week.",
    faq: [
      {
        q: 'Is Hilton Head worth visiting in January?',
        a: 'For snowbirds, remote workers, and budget-conscious couples, yes. Days are sunny and 58°F, the island is genuinely quiet, and villa rates are 50-55% below summer peak. For families with kids who need pool time, pick a different month.',
      },
      {
        q: 'How cold is Hilton Head in January?',
        a: 'Average high 58°F, average low 41°F. Sunny two-thirds of days. Hard freezes (below 32°F) happen one to three nights per month on average. Snow is essentially non-existent (once-every-decade event).',
      },
      {
        q: 'Can you swim at Hilton Head in January?',
        a: 'No. Ocean water averages 55°F, which requires a 5/4 wetsuit for any meaningful swim. Beach walks, biking the hard sand at low tide, and kayaking remain great. Villa hot tubs are usable.',
      },
      {
        q: 'What is open on Hilton Head in January?',
        a: 'Almost everything year-round operations. All major restaurants (a few close one night/week), all 12+ golf courses, bike rentals, kayak tours, the Coastal Discovery Museum, gyms, and groceries. Seasonal items like surf school resume in May.',
      },
    ],
  },

  // ——— FEBRUARY ——————————————————————————————————————————————————
  {
    slug: 'february',
    name: 'February',
    monthNumber: 2,
    avgHigh: 61, avgLow: 43, waterTemp: 55,
    rainyDays: 8, rainfallInches: 2.9,
    humidity: '60-70%',
    daylight: '10 hours 50 min',
    sunset: '6:00 p.m. (mid-month)',
    crowdLevel: 'Very low (Valentine’s week lifts)',
    rateIndex: 44,
    bestFor: [
      'Snowbirds extending into a second month',
      'Valentine’s couples weekends',
      'Whale-watching charters from Savannah',
      'Off-season golf with course conditioning improving',
    ],
    watchOut: [
      'Water still 55°F (no swimming)',
      'Valentine’s week books out 2-3 weeks ahead',
      'Pollen counts begin rising late month',
    ],
    headline: 'Slightly warmer than January, slightly more open. Still the deal of the year.',
    intro: "February is January with a sweater traded for a long-sleeve tee. Average high climbs to 61°F, the daylight stretches another 35 minutes, and the island starts visibly waking up. Course conditioning improves week over week as overseeding sets and dew-set greens firm up.",
    whatItFeelsLike: "Mornings still start cool (43°F average low), afternoons feel genuinely mild, and the sun-to-cloud ratio is better than January. Wind off the water can be sharp on overcast days. Locals call this “porch weather” — the days you sit outside with coffee and a book without quite needing a heater.",
    recommendation: "Yes for couples, snowbirds, and golfers willing to layer up at the 7 a.m. tee time. The Valentine’s week (Feb 12-16) sees a real bump in couples’ traffic; book by January if that is your target window. Off-Valentine’s, February is January cheap with February light.",
    whatsOpen: "Same as January — all 12+ golf courses, all major restaurants (3-4 still close one night/week), bike rentals, kayak tours, Coastal Discovery Museum, gyms, groceries. Whale-watching charters out of Savannah become available late month as the right-whale migration passes offshore.",
    packing: "Layers. Long-sleeve tees, a quarter-zip, a windbreaker, jeans. Add one dressier outfit for Valentine’s dinner if applicable. A swimsuit is still mostly optional.",
    bestActivities: [
      "Valentine's dinner at Michael Anthony's, Red Fish, or May River Grill",
      'Whale-watching charter out of Savannah (late February)',
      'Course conditioning peaks for off-season golf',
      'Long bike rides on quiet paths',
      'Sea Pines Forest Preserve hike',
      'Indoor projects: cooking, reading, working from a villa porch',
    ],
    bookingNotes: "Book Valentine's week 2-3 weeks ahead at S-tier restaurants and 4-6 weeks ahead for villas. Outside Valentine's, two-week lead time on villas is fine. Resort rooms are still walk-in-able.",
    faq: [
      {
        q: 'Is Hilton Head warm enough to visit in February?',
        a: 'Warm enough for golf, biking, beach walks, and dinners on a covered porch. Not warm enough for ocean swimming or all-day pool sessions. Daytime average is 61°F with frequent 70°F afternoons; nights drop to the low 40s.',
      },
      {
        q: 'Is Valentine’s Day busy on Hilton Head?',
        a: 'Yes, but quietly so. Resort hotels and villas see a bump in couples’ bookings, and S-tier restaurants book out 2-3 weeks ahead for the Friday-Sunday closest to February 14. Outside that window, February is one of the quietest months on the island.',
      },
      {
        q: 'Can you golf on Hilton Head in February?',
        a: 'Yes. All 12+ courses are open, green fees run 30-40% below summer, and conditioning steadily improves through the month. Mornings can be cold (40s) so a 9 or 10 a.m. tee time is more comfortable than a sunrise round.',
      },
      {
        q: 'Are restaurants busy in February?',
        a: "Apart from Valentine's weekend, no. Most S-tier restaurants take walk-ins or same-day reservations. The bar seats at Michael Anthony's and Red Fish, which are nearly impossible in summer, are usually open in February.",
      },
    ],
  },

  // ——— MARCH ————————————————————————————————————————————————————————
  {
    slug: 'march',
    name: 'March',
    monthNumber: 3,
    avgHigh: 67, avgLow: 49, waterTemp: 60,
    rainyDays: 8, rainfallInches: 3.6,
    humidity: '55-70%',
    daylight: '11 hours 50 min',
    sunset: '7:25 p.m. (mid-month, post-DST)',
    crowdLevel: 'Low through week 2, surge week 3-4 (spring break)',
    rateIndex: 60,
    bestFor: [
      'Golfers chasing peak course conditions',
      'Bird migration watching at Pinckney Island',
      'Spring break families willing to book early',
      'Couples on the cusp of warm-weather travel',
    ],
    watchOut: [
      'Spring break crush mid-March through early April',
      'Oak pollen peaks in the second half of March',
      'Water still cool at 60°F (most adults won’t swim)',
    ],
    headline: 'The turn. Course conditioning peaks, weather warms fast, and spring break arrives in week 3.',
    intro: "March is the month Hilton Head turns. Average high climbs from 64°F at month-start to 70°F by month-end, the courses go from “winter slow” to peak conditioning, and the spring-break wave begins around mid-month. Weeks 1-2 are the last truly quiet days until October.",
    whatItFeelsLike: "Mornings still need a quarter-zip; afternoons hit 70°F by week 3 and feel close to summer. The island visibly fills: villa-rental signage flips from monthly to weekly, restaurant phones get harder to reach, and the bike paths see real traffic again. Oak pollen is the one consistent complaint; a Zyrtec a day handles it.",
    recommendation: "Yes for the first two weeks (March 1-15) at off-peak rates and quiet streets. Yes for spring break families (March 14-28) but book by January for oceanfront villas. No if you want truly empty beaches — those days are over by mid-month.",
    whatsOpen: "Everything year-round operations plus the seasonal openings: surf school resumes mid-month, all 6 sunset-sail operators run full schedules, the Sea Pines trolley adds frequency. Course conditioning is peak. Whale-watching out of Savannah continues through early month.",
    packing: "Real layers. Mornings 49°F, afternoons 67-72°F. A quarter-zip + tee shirt + light jacket combo handles 80% of the trip. One dinner outfit, light rain shell. By late March, swim trunks become functional even if the ocean is still 60°F.",
    bestActivities: [
      'Golf at peak course conditioning (book Sea Pines stay-and-play)',
      'Bike rides under blooming dogwoods in Sea Pines',
      'Pinckney Island for spring bird migration',
      "<a href=\"/hilton-head-spring-break\">Spring break planning</a> at S-tier restaurants",
      'Sunset sails resume reliable schedules late month',
      'Sea Pines Forest Preserve walk to Dragon Tree',
    ],
    bookingNotes: "Spring break weeks (March 14-28 typically) require 4-5 months lead time for oceanfront villas. Heritage week is mid-April but its booking pressure starts now. S-tier restaurant reservations need 2 weeks for any Friday or Saturday by mid-March.",
    faq: [
      {
        q: 'Is March a good time to visit Hilton Head?',
        a: 'Excellent for the first two weeks (cool, quiet, course conditioning at peak) and excellent for spring-break families in weeks 3-4 if you book by January. Avoid mid-March if you want quiet; the spring-break crush is real.',
      },
      {
        q: 'Is Hilton Head busy during spring break?',
        a: "Yes. Hilton Head is one of the busiest non-summer family destinations in the Southeast for spring break, especially the weeks of March 14-28. Coligny restaurants, villa rentals, and golf courses all see the same demand spike. The vibe stays family-oriented (no Gulf Coast college-spring-break energy). See the <a href=\"/hilton-head-spring-break\">Hilton Head spring break planner</a>.",
      },
      {
        q: 'How is the weather on Hilton Head in March?',
        a: 'Average high 67°F, low 49°F. Ocean water at 60°F (cold for swimming). Sunny most days; pollen counts rise late month. Mornings need layers; afternoons feel like spring.',
      },
      {
        q: 'When is the best week to visit Hilton Head in March?',
        a: 'March 1-13 for quiet and value. March 14-28 for the family spring-break atmosphere with warmer afternoons. Avoid March 30-April 6 (overlap with the start of Heritage week pricing pressure).',
      },
    ],
  },

  // ——— APRIL ————————————————————————————————————————————————————————
  {
    slug: 'april',
    name: 'April',
    monthNumber: 4,
    avgHigh: 74, avgLow: 55, waterTemp: 67,
    rainyDays: 7, rainfallInches: 3.0,
    humidity: '55-70%',
    daylight: '13 hours',
    sunset: '7:50 p.m. (mid-month)',
    crowdLevel: 'Heavy week 2 (Heritage), moderate otherwise',
    rateIndex: 75,
    bestFor: [
      'RBC Heritage tournament attendees',
      'Golfers chasing peak conditions',
      'Easter family trips',
      'Couples on shoulder-season getaways',
    ],
    watchOut: [
      'Heritage week (Apr 13-19, 2026) doubles villa rates',
      'Pollen peaks early month',
      'Ocean still cool at 67°F',
    ],
    headline: 'The shoulder-season sweet spot. Heritage week is the asterisk.',
    intro: "April is one of the best months on Hilton Head, with one large caveat: the second week. The <a href=\"/blog/rbc-heritage-2026-travel-guide\">RBC Heritage tournament</a> April 13-19 doubles rates and packs the island. Outside that week, April delivers 74°F afternoons, blooming dogwoods, dry weather, and quiet beaches.",
    whatItFeelsLike: "By week 1, the island is genuinely warm. Sunscreen weather. Locals start eating dinner outside again. Late afternoons hit 75-78°F. By Heritage week, energy is at fever pitch — plaid jackets, corporate hospitality tents, scoreboard cheers from Harbour Town. The week after Heritage feels like the calm after a storm and is one of the best weeks to be on the island.",
    recommendation: "Yes for weeks 1, 3, and 4. Yes for Heritage week if you're attending the tournament; no otherwise (rates double, restaurants overwhelmed, traffic surges). For a golf trip, late April is course-conditioning peak. For Easter, book 4-5 months ahead.",
    whatsOpen: "Everything seasonal is now open: surf school, sunset sails, paddleboard rentals, all charters, all golf in peak condition. The full restaurant slate is back. Heritage week brings Harbour Town parking restrictions and shuttle services.",
    packing: "Shorts and tees by day, light layer for evenings. One dressier outfit. Pack swim shorts even though water is still 67°F — by Mother's Day weekend, kids will want to swim. Sunscreen.",
    bestActivities: [
      "<a href=\"/blog/rbc-heritage-2026-travel-guide\">RBC Heritage tournament</a> if attending (April 13-19)",
      'Golf the week before or after Heritage (peak conditioning, normal pricing)',
      'Bike rides through Sea Pines and the Forest Preserve',
      'Sunset sails resume reliable evening schedules',
      'Easter brunch at Old Fort Pub or May River Grill',
      'First swimmable beach days late month for kids',
    ],
    bookingNotes: "Heritage week (April 13-19, 2026): book 9-10 months ahead. Easter week: 4-5 months ahead. The week after Heritage is genuinely available inside 4-6 weeks and is one of our favorite quiet pickups.",
    faq: [
      {
        q: 'Is April a good time to visit Hilton Head?',
        a: 'Excellent, except Heritage week (April 13-19, 2026). Outside that week, April delivers 74°F afternoons, dry weather, course conditioning at peak, and rates 25% below summer. Heritage week itself doubles lodging and books out 9-10 months ahead.',
      },
      {
        q: 'Should I visit during the RBC Heritage?',
        a: "Yes if you're attending the tournament — it's one of the best PGA Tour weeks of the year. No if you want a normal Hilton Head trip; rates double, restaurants overwhelmed, and Harbour Town is restricted. See the <a href=\"/blog/rbc-heritage-2026-travel-guide\">Heritage travel guide</a>.",
      },
      {
        q: 'Can you swim at Hilton Head in April?',
        a: 'Kids yes by mid-month, adults mostly no. Water averages 67°F in April, warming fast through the month. By late April early-season swimmers are in; by Mother’s Day weekend, it’s swimmable for nearly everyone.',
      },
      {
        q: 'When is Easter on Hilton Head?',
        a: 'Easter falls on April 5, 2026. Easter brunches at Old Fort Pub, May River Grill, and the Sea Pines Resort book out 6+ weeks ahead. Villa demand surges Easter week regardless of Heritage.',
      },
    ],
  },

  // ——— MAY ——————————————————————————————————————————————————————————
  {
    slug: 'may',
    name: 'May',
    monthNumber: 5,
    avgHigh: 81, avgLow: 63, waterTemp: 74,
    rainyDays: 6, rainfallInches: 3.0,
    humidity: '60-75%',
    daylight: '13 hours 50 min',
    sunset: '8:15 p.m.',
    crowdLevel: 'Moderate (Memorial Day surge end of month)',
    rateIndex: 80,
    bestFor: [
      'Couples wanting summer weather without summer crowds',
      'Beach families with kids ages 5-12',
      'Golfers wanting warm rounds before peak humidity',
      'Anniversaries, weddings, milestone trips',
    ],
    watchOut: [
      'Memorial Day weekend books out 4-5 months ahead',
      'Mosquito and sand-flea season starts mid-month',
      'Afternoon humidity climbs to summer levels',
    ],
    headline: 'Last quiet month before summer. Bath-warm water by Mother’s Day.',
    intro: "May is the sleeper pick on the Hilton Head calendar. Water hits 74°F (swimmable for adults), afternoons reach the low 80s, but villa rates are still 20% below July peak and the bike paths are not yet stacked. Couples and families with elementary-age kids find their best week of the year here.",
    whatItFeelsLike: "Real summer. Shorts and tees by 9 a.m., humidity bumps to 65-75% by afternoon, and the long daylight (sunset at 8:15) means pool hangs run until 8:30 p.m. The Atlantic crosses the swimming threshold by mid-month and feels comfortable by month-end. Memorial Day weekend (May 23-25, 2026) brings the year's first real summer crowd.",
    recommendation: "Strongly yes for couples and families. May is the single most underrated week on the calendar. Book before mid-March for oceanfront villas; Memorial Day weekend specifically requires 4-5 months lead. The week before Memorial Day (May 17-22, 2026) is a hidden gem.",
    whatsOpen: "Everything. Full seasonal slate. Surf school, sunset sails, all charters, all golf, all activities. The Sea Pines trolley runs full schedule. Bike rentals back to summer staffing.",
    packing: "Summer wardrobe. Shorts, tees, swimsuits, sandals. One light layer for occasional cooler evenings. Sunscreen, sun shirts, hats. Swim trunks for ocean and pool.",
    bestActivities: [
      "First real ocean swim days for adults (water hits 74°F)",
      'Golf in dry, sunny conditions before summer humidity',
      'Sunset sails on Calibogue Sound (long daylight)',
      'Captain Mark dolphin cruise out of Harbour Town',
      'Long bike rides at low tide (still cool enough to enjoy)',
      'Memorial Day weekend cookout at the villa',
    ],
    bookingNotes: "Mid-May (10-22): book 6-8 weeks ahead. Memorial Day weekend: 4-5 months ahead. Restaurants need 2-week lead time at S-tier spots. Activity bookings (dolphin cruise, sunset sail) tighten as the month progresses.",
    faq: [
      {
        q: 'Is May a good time to visit Hilton Head?',
        a: "Yes, May is one of our top three months. Water swimmable by mid-month, afternoons in the low 80s, rates 20% below summer peak, and crowds noticeably lighter than June. Memorial Day weekend is the only crowded window.",
      },
      {
        q: 'Can you swim at Hilton Head in May?',
        a: 'Yes by mid-month for adults. Ocean averages 74°F in May; early-season swimmers are in by week 1, and by Mother’s Day weekend the water is comfortable for nearly everyone. Pool weather all month.',
      },
      {
        q: 'How busy is Memorial Day on Hilton Head?',
        a: 'Very. Memorial Day weekend (May 23-25, 2026) is the year’s first peak summer weekend. Villa rates lift 30-40%, restaurants overwhelm, and traffic on US-278 bottlenecks Friday afternoon and Sunday morning. Book 4-5 months ahead or shift to the previous week.',
      },
      {
        q: 'Are mosquitoes bad on Hilton Head in May?',
        a: 'Mosquitoes start showing up mid-month, especially near marsh edges at dusk. Sand fleas are an occasional issue at lesser-maintained beaches. Bring DEET-based repellent for evening kayak runs or marsh hikes; daytime beach is usually fine.',
      },
    ],
  },

  // ——— JUNE ————————————————————————————————————————————————————————
  {
    slug: 'june',
    name: 'June',
    monthNumber: 6,
    avgHigh: 87, avgLow: 71, waterTemp: 80,
    rainyDays: 10, rainfallInches: 5.5,
    humidity: '70-85%',
    daylight: '14 hours 25 min',
    sunset: '8:30 p.m.',
    crowdLevel: 'Peak begins',
    rateIndex: 90,
    bestFor: [
      'Families with school-age kids (school out)',
      'Beach-first vacations',
      'First-time Hilton Head visitors',
      'Multi-generational trips',
    ],
    watchOut: [
      'Afternoon thunderstorms reliably 3-5 p.m.',
      'Atlantic hurricane season officially open (low risk this early)',
      'Villa inventory tight; book by January',
    ],
    headline: 'Summer arrives. Bath-warm water, long daylight, full island energy.',
    intro: "June is when the Hilton Head summer engine kicks on. Schools close, families arrive, the Atlantic hits 80°F, and Coligny Plaza hums every night until 9. It’s the warmest, most family-friendly window of the year and, accordingly, one of the most expensive.",
    whatItFeelsLike: "Hot and humid, but not yet at July’s peak. Afternoons in the high 80s, with humidity that reads more comfortable than August because the heat is fresher. Afternoon thunderstorms appear reliably between 3 and 5 p.m. — they clear in 30-60 minutes and the beach reopens with double-digit dolphins playing in the surf.",
    recommendation: "Yes for families. The first week of June (school just out for many districts) often has slightly softer pricing and lighter crowds than mid-month. Late June onward, book 5-6 months ahead for oceanfront. The week of June 22-28 is one of our highest-volume booking weeks.",
    whatsOpen: "Everything operating at peak summer staffing. All charters, all golf, all activities, all seasonal restaurants. Sea Pines trolley runs every 15 minutes. Bike rental shops have full inventory. Sunset sails depart twice per evening.",
    packing: "Pure summer. Swimsuits (multiple), UPF sun shirts, reef-safe sunscreen, wide-brim hats, sandals that survive sand. Evenings stay 70°F+; no jacket needed. A light rain shell for the afternoon storm.",
    bestActivities: [
      "Beach mornings, pool afternoons, dinners at 7 p.m.",
      "<a href=\"/blog/hilton-head-with-kids\">Family programming</a> at Palmetto Dunes and Sea Pines kids' camps",
      'Dolphin cruise with Captain Mark (book 3-4 weeks ahead)',
      'Sunset sail on Calibogue Sound',
      'Bike to South Beach at low tide for breakfast',
      'Long ocean swim sessions in 80°F water',
    ],
    bookingNotes: "Peak booking window now in effect. Oceanfront villas: 5-6 months ahead. Resort rooms: 3-4 months. S-tier restaurants: 2-3 weeks. Charters and dolphin cruises: 3-4 weeks. Heritage Heritage-week price comparisons no longer apply; this is the new high.",
    faq: [
      {
        q: 'Is June a good time to visit Hilton Head?',
        a: 'Yes for families. Water is 80°F (peak swim season starts), schools are out, and the island is at full programming. Crowds and prices are high but not at July peak. Book 5-6 months ahead for oceanfront villas.',
      },
      {
        q: 'How hot is Hilton Head in June?',
        a: 'Average high 87°F, low 71°F. Humidity 70-85% most days. Afternoon thunderstorms 3-5 p.m. typically. Mornings are bearable; afternoons require AC, pool, or beach. Plan beach time for morning, indoor activities for late afternoon.',
      },
      {
        q: 'Is June or July better on Hilton Head?',
        a: 'June for slightly milder humidity, lighter early-month crowds, and 5-10% cheaper villa rates than July. July for peak ocean temperature (84°F) and the longest daylight. Both are great family months; June edges it for first-time visitors.',
      },
      {
        q: 'Are hurricanes a concern in June?',
        a: 'Atlantic hurricane season officially opens June 1, but actual risk to Hilton Head is concentrated August-October. Historical odds of a named storm impact in June are below 1%. No special precautions needed for early-summer trips.',
      },
    ],
  },

  // ——— JULY ————————————————————————————————————————————————————————
  {
    slug: 'july',
    name: 'July',
    monthNumber: 7,
    avgHigh: 90, avgLow: 74, waterTemp: 84,
    rainyDays: 12, rainfallInches: 6.0,
    humidity: '75-85%',
    daylight: '14 hours 25 min',
    sunset: '8:30 p.m.',
    crowdLevel: 'Peak (highest of year)',
    rateIndex: 100,
    bestFor: [
      'Families locked into school summer',
      'Peak ocean swimming (84°F)',
      'Wedding rehearsal-dinner weeks',
      'Multi-generational reunions',
    ],
    watchOut: [
      'July 4th week is peak-on-peak (avoid if you can)',
      'Reliable afternoon thunderstorms 3-5 p.m.',
      'Coligny gridlock on weekends',
    ],
    headline: 'The hottest month, the warmest water, the highest rates.',
    intro: "July is Hilton Head at full volume. Average high 90°F, water 84°F, and humidity that turns the morning bike ride into a sauna by 9 a.m. It’s also the most expensive month and the only week most school-calendar families can travel. We book it heavily.",
    whatItFeelsLike: "Genuinely tropical. Mornings start steamy. Afternoons require either AC or saltwater. The 3-5 p.m. thunderstorm is a daily ritual — plan for it, embrace it, watch from the screened porch with a beer. Evenings stay warm (75°F+) and the daylight runs until past 8:30.",
    recommendation: "Yes if July is your only family window. Book 6 months ahead for oceanfront, 4 months for resorts. Avoid July 4th week (peak-on-peak; rates lift another 20% on top of already-peak July). The first or last week of July are slightly easier on inventory.",
    whatsOpen: "Everything, all hours, full staffing. The Sea Pines trolley runs every 10 minutes. Restaurants run two seatings. Charters depart hourly. Bike shops can run out of inventory by 9 a.m. on weekends.",
    packing: "Multiple swimsuits, UPF sun shirts, reef-safe sunscreen, wide-brim hats, water shoes, polarized sunglasses. Cooler bag for the beach. A light long-sleeve for the AC blast at restaurants. No long pants needed except for evening dinners.",
    bestActivities: [
      'Peak ocean swimming (water at 84°F)',
      'Morning bike ride at low tide (start by 7:30 a.m.)',
      'Pool afternoons during the 3-5 p.m. storm window',
      'Sunset sail at 6 p.m. on Calibogue Sound',
      "Captain Mark dolphin cruise (book 4-6 weeks ahead)",
      'Late-evening dinners at 8 p.m. (cooler air, full sunset)',
    ],
    bookingNotes: "The hardest booking month. Oceanfront villas: 6 months ahead minimum. Resort rooms: 4 months. S-tier restaurants: 3-4 weeks. Charters: 4-6 weeks. July 4th week itself: 9-10 months ahead.",
    faq: [
      {
        q: 'How hot does Hilton Head get in July?',
        a: 'Average high 90°F, average low 74°F. Humidity 75-85% most days. Heat index can reach 100°F+ on still afternoons. Plan beach time for morning, AC and pool for the afternoon storm window.',
      },
      {
        q: 'Is July too crowded on Hilton Head?',
        a: 'July is the most crowded month of the year. Coligny Plaza, the bike paths, the public beach access, restaurants — all packed. If you need quieter, shift to October or May. If you must travel in July, target the first or last week instead of the middle.',
      },
      {
        q: 'Is July 4th worth it on Hilton Head?',
        a: "Skull Creek's fireworks show is excellent. The crowds and traffic around it are not. We generally steer clients to the week before or after July 4th for the same beach experience without the gridlock. If you must be here for the Fourth, stay walkable from your destination and don't move the car.",
      },
      {
        q: 'How much does a July week on Hilton Head cost?',
        a: 'A family-of-four 7-night trip in a 3BR oceanfront villa runs $8,500-11,500 all in (villa, food, activities, transport). Same trip in May or October runs $6,000-8,500. The premium for July is real and consistent.',
      },
    ],
  },

  // ——— AUGUST ——————————————————————————————————————————————————————
  {
    slug: 'august',
    name: 'August',
    monthNumber: 8,
    avgHigh: 89, avgLow: 73, waterTemp: 84,
    rainyDays: 13, rainfallInches: 6.6,
    humidity: '75-90%',
    daylight: '13 hours 30 min',
    sunset: '8:00 p.m.',
    crowdLevel: 'Peak through mid-August, dropping late month',
    rateIndex: 95,
    bestFor: [
      'Late-summer family trips',
      'Last-week-before-school escapes',
      'Peak ocean conditions (84°F water)',
      'Wedding-week multi-generational rentals',
    ],
    watchOut: [
      'Wettest month of the year (6.6 inches)',
      'Hurricane risk begins to climb late month',
      'Heat index regularly above 100°F',
    ],
    headline: 'Still peak. Hottest water of the year, soggy afternoons, and the front edge of hurricane season.',
    intro: "August is July with more rain. Water stays at 84°F (still peak), afternoons stay above 88°F, but rainfall jumps and the first hurricane outlooks start to matter late month. The last two weeks see real rate softening as families return to school.",
    whatItFeelsLike: "Heaviest of the year for humidity. Pop-up storms run throughout the day, not just at 3-5 p.m. The Atlantic remains bath-warm. By mid-August, the late-summer melancholy creeps in — cicadas, longer evening shadows, and the first signs that the island is getting ready to exhale into September.",
    recommendation: "Yes if you are tied to the school calendar. Late August (Aug 17-31) softens noticeably as families head home; you can sometimes find resort discounts in the last week. Hurricane risk is still low this early but trip insurance is worth considering for stays after Aug 20.",
    whatsOpen: "Everything still at peak. Full staffing through Labor Day weekend (Sept 5-7, 2026). After Labor Day, the seasonal scale-back begins.",
    packing: "Same as July. Multiple swimsuits, sun shirts, sunscreen, water shoes, light rain shell. The shell is more useful than in July because rain is more frequent. Pack DEET; mosquitoes are at their worst.",
    bestActivities: [
      'Peak ocean conditions for swimming and boogie boarding',
      'Sunset sails (sunset slightly earlier, 8 p.m.)',
      'Indoor museum or rainy-afternoon Coastal Discovery Museum visit',
      'Offshore fishing charters (good late-summer bite)',
      'Late-month deal hunting on resort rooms',
      "Wedding weekend logistics (peak wedding month)",
    ],
    bookingNotes: "First two weeks book like July (5-6 months out). Late August (after Aug 17) opens up significantly; deals appear inside 4-6 weeks. Trip insurance for late-August bookings is recommended (5-7% of trip total).",
    faq: [
      {
        q: 'Is August a good time to visit Hilton Head?',
        a: 'Yes for families locked into the school calendar. Ocean is at peak temperature (84°F), but rainfall is the highest of the year (6.6 inches across 13 days). The last two weeks of August soften noticeably and offer the first late-summer deals.',
      },
      {
        q: 'Is August hurricane season on Hilton Head?',
        a: 'Atlantic hurricane season runs June 1-November 30, but actual risk to Hilton Head is concentrated late August through mid-October. August carries low-but-rising risk; the historical peak is around September 10. Trip insurance for late-August stays is worth considering.',
      },
      {
        q: 'Is the ocean warm in August?',
        a: 'Yes — 84°F, the warmest of the year along with July. Bath-warm and inviting. Best month for long ocean swims, boogie boarding, and water-based activities for kids who like extended swim sessions.',
      },
      {
        q: 'Are restaurants busy in late August?',
        a: 'Less so than mid-August. The week after Labor Day brings real relief. Through the first half of the month, S-tier restaurants still need 2-3 weeks lead time. The last week of August often has Friday/Saturday slots open inside 1-2 weeks.',
      },
    ],
  },

  // ——— SEPTEMBER ————————————————————————————————————————————————————
  {
    slug: 'september',
    name: 'September',
    monthNumber: 9,
    avgHigh: 85, avgLow: 69, waterTemp: 80,
    rainyDays: 10, rainfallInches: 5.5,
    humidity: '70-85%',
    daylight: '12 hours 30 min',
    sunset: '7:25 p.m.',
    crowdLevel: 'Peak through Labor Day; quiet week 2 onward',
    rateIndex: 70,
    bestFor: [
      'Couples post-Labor Day',
      'Adults-only trips',
      'Empty-beach golfers',
      'Underrated swim month (water still 80°F)',
    ],
    watchOut: [
      'Hurricane season peaks mid-September',
      'Some seasonal operators reduce hours after Labor Day',
      'Trip insurance recommended',
    ],
    headline: 'After Labor Day, the island empties. Water is still 80°F.',
    intro: "September is the most underrated month on the Hilton Head calendar. The first week is still peak (Labor Day weekend caps the summer crush), but from week 2 onward, families are back at school, the beaches go quiet, and the water stays at 80°F well into October. We book this window heavily for couples and empty-nesters.",
    whatItFeelsLike: "Late summer with the lid coming off. Mornings begin to cool slightly. Beaches become genuinely empty after Labor Day (Sept 7, 2026). Locals come out of their air conditioning. The long-season businesses start to relax. Hurricane forecasts dominate the local news but actual storm impacts on the island are rare.",
    recommendation: "Strongly yes for couples and adults-only trips after Sept 8. The combination of warm water, empty beaches, and 30% off summer pricing is genuinely the best deal on the calendar before October. Hurricane risk is real but historically low; trip insurance is worth the 5-7% premium.",
    whatsOpen: "Everything year-round operations. Surf school and a couple of sunset-sail operators reduce schedule mid-month. Restaurants stay full. Golf shifts to peak shoulder-season conditions; conditioning improves week over week through the month.",
    packing: "Late summer wardrobe. Swimsuits still essential, light layers for slightly cooler evenings, sun shirts and hats. One nicer outfit for dinner. Pack DEET for the late-summer mosquito tail end.",
    bestActivities: [
      'Empty-beach swims in 80°F water',
      'Golf with summer-firm greens minus summer humidity',
      'Sunset sails at 7 p.m. (earlier sunset)',
      "<a href=\"/hilton-head-honeymoon\">Couples’ trip</a> with restaurant reservations actually obtainable",
      'Pinckney Island as fall migration begins',
      "Late-September dolphin cruises with Captain Mark",
    ],
    bookingNotes: "Inside-Labor Day: still peak booking pressure. Post-Labor Day: massive relief. Villa inventory opens up significantly; S-tier restaurants take 1-week lead time again. Hurricane-window stays (Sept 10-Oct 5) should carry trip insurance.",
    faq: [
      {
        q: 'Is September a good time to visit Hilton Head?',
        a: 'Excellent after Labor Day. Water still 80°F, beaches empty, restaurants reservable, rates 30% below summer peak. The single best month for couples and adults-only trips before October takes that crown.',
      },
      {
        q: 'Is hurricane season risky for a Hilton Head trip in September?',
        a: 'Atlantic hurricane season peaks around September 10. Historical odds of a named-storm impact during a specific September week on Hilton Head are around 4%. The probability of a mandatory evacuation is closer to 1%. Trip insurance (5-7% of trip total) is worth the cost for any September booking.',
      },
      {
        q: 'Is the water still warm in September?',
        a: 'Yes — 80°F average, identical to early summer. Most visitors don’t realize this. The Atlantic cools slowly; September water feels just like June water. Underrated swim month.',
      },
      {
        q: 'How crowded is Hilton Head after Labor Day?',
        a: 'Light. Labor Day weekend (Sept 5-7, 2026) is the last surge; from Sept 8 onward, beaches feel near-empty by summer standards. Coligny is walkable. Restaurants take same-week reservations again.',
      },
    ],
  },

  // ——— OCTOBER ——————————————————————————————————————————————————————
  {
    slug: 'october',
    name: 'October',
    monthNumber: 10,
    avgHigh: 77, avgLow: 59, waterTemp: 73,
    rainyDays: 7, rainfallInches: 3.0,
    humidity: '60-75%',
    daylight: '11 hours 25 min',
    sunset: '6:45 p.m.',
    crowdLevel: 'Low',
    rateIndex: 65,
    bestFor: [
      'Couples and golfers (the single best month)',
      'Photographers chasing Lowcountry golden hour',
      'First-time visitors seeking the quiet version',
      'Wedding weekends',
    ],
    watchOut: [
      'Concours d’Elegance (late Oct/early Nov) lifts rates',
      'Hurricane risk drops sharply after Oct 15',
      'Restaurant reservations easier but not unlimited',
    ],
    headline: 'The single best month to visit Hilton Head Island.',
    intro: "October is our default recommendation for almost every trip type. Average high 77°F, water still swimmable at 73°F, six rainy days max, hurricane risk past by mid-month, and rates 30-40% below summer. The light is golden, the beaches are empty, and dinner reservations become walk-in-able at 70% of restaurants.",
    whatItFeelsLike: "Genuinely perfect. Sunny days, dry air, mid-70s afternoons, mid-50s nights. The Lowcountry shifts into its photogenic golden-hour mode — the marsh grass turns a deeper bronze, the live oaks throw long shadows, and the sunset over Calibogue Sound runs 30 minutes longer than summer felt. Locals come out of summer hibernation.",
    recommendation: "Yes, with no caveats. October is the answer to almost every “when should we go” question. Book 3-4 months ahead; the word is getting around. The Concours d’Elegance & Motoring Festival (Oct 29-Nov 1, 2026) creates a small late-month surge; outside that, every week is a green light.",
    whatsOpen: "Everything year-round operations. Most seasonal operators run through mid-October at least. Surf school closes mid-month. Sunset-sail operators run reduced but reliable schedules. Golf is at its second peak (after March-April).",
    packing: "Layers. Mornings 59°F, afternoons 75-78°F. Quarter-zip + tee + light jacket. Swimsuit still functional. One dinner-out outfit. The overall pack is lighter than summer (no need for multiple swimsuits) but more layered.",
    bestActivities: [
      "<a href=\"/blog/hilton-head-3-day-itinerary\">Three-day itinerary</a> at the year’s best moment",
      'Golf at peak fall conditioning',
      'Empty-beach swimming in 73°F water',
      'Sunset photography at Harbour Town',
      'Bike rides at low tide on cool dry afternoons',
      'Wedding weekends (peak photogenic light)',
    ],
    bookingNotes: "3-4 months ahead for villas. Resort rooms 6-8 weeks. S-tier restaurants 1-2 weeks. Concours weekend (Oct 29-Nov 1, 2026): book 4-5 months ahead. Most other October weeks have inventory available inside 6-8 weeks.",
    faq: [
      {
        q: 'Is October the best time to visit Hilton Head?',
        a: 'For most travelers, yes. October combines warm water (73°F), perfect 75°F afternoons, six rainy days max, post-hurricane risk window, light crowds, and rates 30-40% below summer peak. It’s our default recommendation for couples, golfers, and first-time visitors.',
      },
      {
        q: 'Can you swim at Hilton Head in October?',
        a: 'Yes, all month. Ocean averages 73°F in October, warming late-month swimmers in early October and cooling toward 68-70°F by month-end. Most adults are comfortable. Pool weather most days.',
      },
      {
        q: 'How is the weather on Hilton Head in October?',
        a: 'Average high 77°F, low 59°F. Sunny most days. Six rainy days total (much drier than summer). Humidity drops to 60-75%. The single best weather month on the calendar.',
      },
      {
        q: 'Is hurricane season over by October?',
        a: 'Practically yes after Oct 15. Atlantic hurricane season officially runs through November 30, but the real risk window for Hilton Head closes by mid-October. A late-October trip carries roughly the same storm risk as a March trip.',
      },
    ],
  },

  // ——— NOVEMBER ————————————————————————————————————————————————————
  {
    slug: 'november',
    name: 'November',
    monthNumber: 11,
    avgHigh: 70, avgLow: 50, waterTemp: 65,
    rainyDays: 6, rainfallInches: 2.6,
    humidity: '60-70%',
    daylight: '10 hours 30 min',
    sunset: '5:15 p.m.',
    crowdLevel: 'Low (Thanksgiving-week surge)',
    rateIndex: 55,
    bestFor: [
      'Off-season couples’ trips',
      'Thanksgiving family weeks',
      'Long-stay snowbirds checking in',
      'Late-fall golfers',
    ],
    watchOut: [
      'Daylight Saving ends Nov 1; sunset at 5:15 p.m.',
      'Thanksgiving week books out 6+ weeks ahead',
      'Ocean swimming ends mid-month',
    ],
    headline: 'First two weeks are excellent value. <a href=\"/hilton-head-thanksgiving\">Thanksgiving week</a> is quietly busy.',
    intro: "November is the second of two value bookends to summer (October is the first). The first two weeks deliver mid-60s to low-70s afternoons, light crowds, and rates 40% below summer. <a href=\"/hilton-head-thanksgiving\">Thanksgiving week</a> sees a real bump but stays calmer than you’d expect.",
    whatItFeelsLike: "Late autumn. The first weeks still feel like extended October. Afternoons hit 70-72°F under blue skies; mornings dip into the 50s. After Daylight Saving ends on Nov 1, the days shorten quickly — sunset by 5:15 p.m. by mid-month means dinner reservations move earlier. Locals start lighting porch fire pits.",
    recommendation: "Strongly yes for the first two weeks (Nov 1-13) at off-season pricing. Yes for Thanksgiving week if you book by mid-September; the island runs about 60% full and stays calmer than the summer norm. The week after Thanksgiving is the cheapest, quietest week before snowbird-season pricing kicks in.",
    whatsOpen: "Most of the seasonal scale-back is complete by mid-month. Surf school is closed. Sunset-sail operators reduce hours. The Sea Pines trolley shifts to off-season. All major restaurants stay open; a couple close one night per week. Holiday lights at Harbour Town go up the weekend after Thanksgiving.",
    packing: "Real layers. Sweater, jeans, jacket, comfortable shoes. One dinner-out outfit. Optional swimsuit (villa hot tubs only by mid-month). Pack a light scarf for evening fires on the porch.",
    bestActivities: [
      'Long bike rides under cooler air',
      "<a href=\"/hilton-head-thanksgiving\">Thanksgiving dinner</a> at Old Fort Pub or Michael Anthony's",
      "Pinckney Island for fall migration's tail end",
      'Course conditioning still excellent for golf',
      'Holiday lights preview at Harbour Town (last week of November)',
      'Long beach walks at sunrise',
    ],
    bookingNotes: "First two weeks: 4-6 weeks lead time for villas. Thanksgiving week (Nov 22-29, 2026): 6-8 weeks ahead. Restaurants serving Thanksgiving dinner: book by Nov 1. Post-Thanksgiving week (Nov 30 onward): essentially walk-in-able.",
    faq: [
      {
        q: 'Is November a good time to visit Hilton Head?',
        a: 'The first two weeks are excellent. Days run 65-72°F, water is still 65°F, the island is quiet, and rates run 40% below summer. Thanksgiving week is busier but still calmer than summer. Late November is the cheapest week of the year before December holidays.',
      },
      {
        q: 'Is Thanksgiving busy on Hilton Head?',
        a: 'Yes, but quietly so. Villa rates lift 60-70% over the previous week, restaurants book 2-3 weeks ahead, and family trips fill the gated communities. The vibe stays family-and-couples; no spring-break atmosphere. See the <a href=\"/hilton-head-thanksgiving\">Thanksgiving planner</a>.',
      },
      {
        q: 'Can you swim at Hilton Head in November?',
        a: 'Brisk-swimming through the first week. By mid-month, water averages 65°F and most adults are out. Pool weather only with heated pools (some villas have them). The beach itself is wonderful for walks all month.',
      },
      {
        q: 'When does the Hilton Head holiday season start?',
        a: 'Holiday lights at Harbour Town go up the weekend after Thanksgiving (around Nov 28-29, 2026) and run through New Year’s. Hilton Head Christmas events are concentrated at Harbour Town and the Sea Pines Resort.',
      },
    ],
  },

  // ——— DECEMBER ————————————————————————————————————————————————————
  {
    slug: 'december',
    name: 'December',
    monthNumber: 12,
    avgHigh: 62, avgLow: 43, waterTemp: 58,
    rainyDays: 7, rainfallInches: 3.0,
    humidity: '60-70%',
    daylight: '10 hours',
    sunset: '5:15 p.m.',
    crowdLevel: 'Very low (Christmas week and NYE lift)',
    rateIndex: 45,
    bestFor: [
      'Holiday lights at Harbour Town',
      'Christmas-week families seeking warm weather',
      'New Year’s Eve celebrations',
      'Snowbird arrival month',
    ],
    watchOut: [
      'Christmas week books out 2+ months ahead',
      'New Year’s Eve has limited inventory',
      'Holiday lights crowd Harbour Town nightly',
    ],
    headline: 'Holiday lights, mild days, and one of the cheapest weeks of the year tucked between Christmas and NYE.',
    intro: "December is the holiday version of January. Days run 60-65°F under sunny skies, the holiday lights at Harbour Town turn the marina into a postcard, and the island runs about 30% full. Christmas week itself surges (book 2+ months out), but the week between Christmas and New Year’s and the first three weeks of December are all quiet, cheap, and surprisingly mild.",
    whatItFeelsLike: "Lowcountry winter, with sun. Mid-day feels like late autumn elsewhere. Mornings need a sweater, afternoons need just a long-sleeve. The holiday lights at Harbour Town transform sunset walks into something genuinely magical — lighthouse, moss-draped oaks, fairy-lit pavilions, and the marina restaurants spilling onto the boardwalk.",
    recommendation: "Yes for the first three weeks (Dec 1-21) at the year's near-cheapest rates. Yes for Christmas week if you booked early. Yes for the December 27-30 window (genuinely affordable, weather still mild). New Year’s Eve itself is small but books out fast; book by October for an NYE villa.",
    whatsOpen: "Year-round operations stay open. Holiday lights at Harbour Town run nightly Nov 28-Jan 5. Christmas Eve and Day services at the Church of the Cross in Bluffton. A handful of restaurants close Christmas Day and a few close one or two days a week through the month.",
    packing: "Winter layers, but lighter than the Northeast. Sweater, jeans, jacket, beach-walk windbreaker, comfortable closed-toe shoes. One holiday outfit if you have NYE plans. Optional swimsuit for villa hot tubs only.",
    bestActivities: [
      'Holiday lights walk through Harbour Town (every night Nov 28-Jan 5)',
      'Christmas Eve service at the Church of the Cross in Bluffton',
      "Christmas dinner at Old Fort Pub or Michael Anthony's",
      'Long beach walks under cool clear skies',
      'Course conditioning for off-season golf',
      "New Year's Eve fireworks over Calibogue Sound",
    ],
    bookingNotes: "Christmas week (Dec 20-27, 2026): 2-3 months ahead. New Year’s Eve: 2 months ahead minimum. First three weeks of December and the Dec 27-30 window: 2-3 weeks ahead is fine. Restaurants serving Christmas Day: book by early December.",
    faq: [
      {
        q: 'Is December a good time to visit Hilton Head?',
        a: 'Yes for travelers who want mild weather, holiday atmosphere, and budget pricing. Days are 60-65°F and sunny most of the time. The first three weeks of December and the post-Christmas window are among the year’s best values; Christmas week and NYE require advance booking.',
      },
      {
        q: 'How cold is Hilton Head in December?',
        a: 'Average high 62°F, low 43°F. Sunny most days. Hard freezes happen 1-2 nights per month. You’ll wear a sweater most days and a jacket at sunset. Ocean swimming is out (water 58°F).',
      },
      {
        q: 'Are the Harbour Town holiday lights worth seeing?',
        a: 'Yes — it’s one of the most charming Lowcountry holiday traditions. Lights run nightly from the weekend after Thanksgiving through January 5. Best visited 5-7 p.m. for the sunset-into-dark transition. Free to walk; restaurants and shops stay open later for the crowd.',
      },
      {
        q: 'Is Christmas week busy on Hilton Head?',
        a: 'Quietly busy. Villa rates lift 50-60% over the previous week (still 30% below summer peak), restaurants book 2-3 weeks ahead, and family trips fill many of the gated communities. The vibe is family-warm; no spring-break or summer-resort energy. The week after Christmas (Dec 27-30) is one of the year’s underrated values.',
      },
    ],
  },
];

export const months: MonthData[] = raw.map((m) => ({
  ...m,
  prev: neighbor(m.slug, -1),
  next: neighbor(m.slug, +1),
}));

export function getMonthBySlug(slug: string): MonthData | undefined {
  return months.find((m) => m.slug === slug);
}
