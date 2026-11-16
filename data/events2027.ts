/**
 * 2027 Hilton Head events guide data. Powers /guides/2027-events.
 *
 * Separate from data/events.ts (the 2026 calendar at /events) so the two can
 * be updated on their own schedules.
 *
 * Every entry carries a `status` so the page never presents a guess as a fact:
 *
 *   confirmed  Date is posted by the organizer or the island's official
 *              tourism calendar. Gets Event JSON-LD.
 *   listed     Date comes from a third-party listing (race or craft-fair
 *              aggregator) that the organizer has not confirmed. No JSON-LD.
 *   expected   2027 date not posted yet. The row shows when the event usually
 *              runs, based on the previous edition (see `basis`). No JSON-LD.
 *
 * TO UPDATE: when an organizer posts a 2027 date, change `status` to
 * 'confirmed', fill in startDate/endDate/dateLabel/sortDate, point `source`
 * at the organizer page, and drop `basis`. Bump EVENTS_2027_CHECKED.
 */

export type Event2027Status = 'confirmed' | 'listed' | 'expected';

export type Event2027Group =
  | 'marquee'
  | 'festivals'
  | 'food'
  | 'parades'
  | 'arts'
  | 'running';

export type Event2027 = {
  slug: string;
  name: string;
  group: Event2027Group;
  status: Event2027Status;
  /** ISO dates. Required for confirmed and listed; omitted for expected. */
  startDate?: string;
  endDate?: string;
  /** Text shown in the date column, e.g. "Feb 1–28, 2027" or "Late May (expected)". */
  dateLabel: string;
  /** ISO date used only for ordering rows within a group. */
  sortDate: string;
  location: string;
  /** Extra scheduling facts (start time, packet pickup, sub-events). */
  detail?: string;
  description: string;
  /** Expected only: what the usual timing is based on. */
  basis?: string;
  /** Where the date was checked. */
  source: { label: string; url: string };
  /** The organizer's own site, when different from `source`. Used as Event url. */
  officialUrl?: string;
  /** On-site guide worth reading alongside this event. */
  internalLink?: { href: string; label: string };
};

/** Date the entries below were last checked against their sources. */
export const EVENTS_2027_CHECKED = '2026-11-16';

export const STATUS_LABELS: Record<Event2027Status, string> = {
  confirmed: 'Confirmed',
  listed: 'Listed — verify',
  expected: 'Date not posted',
};

export const STATUS_HELP: Record<Event2027Status, string> = {
  confirmed:
    'The organizer or the island’s official tourism calendar has posted the 2027 date.',
  listed:
    'A third-party race or craft-fair listing shows this date, but the organizer has not confirmed it. Check before you book.',
  expected:
    'No 2027 date yet. We show the usual timing from the last edition so you know when to watch for an announcement.',
};

export const GROUP_META: Record<
  Event2027Group,
  { label: string; intro?: string }
> = {
  marquee: {
    label: 'Headline weeks',
    intro:
      'The two events that fill the island and set lodging prices. Book rooms and dinner tables early.',
  },
  festivals: { label: 'Festivals & culture' },
  food: {
    label: 'Food & dining',
    intro:
      'Restaurant Week is the easiest way to try a lot of kitchens in one stretch; the Seafood Festival is the island’s other big food week.',
  },
  parades: { label: 'Parades' },
  arts: {
    label: 'Arts & crafts',
    intro:
      'Outdoor art shows and craft markets on Hilton Head and in Old Town Bluffton. Most are free to walk through.',
  },
  running: {
    label: '5Ks & runs',
    intro:
      'Hilton Head Run Club is a membership club for weekly workouts, fun runs and socials, and its RunSignup page lists no dated races. Most island 5Ks are produced by Hilton Head Running Company or Palmetto Running Company, so the dates below come from their race pages and registration sites.',
  },
};

export const GROUP_ORDER: Event2027Group[] = [
  'marquee',
  'festivals',
  'food',
  'parades',
  'arts',
  'running',
];

export const RUN_CLUB_URL = 'https://runsignup.com/MemberOrg/HiltonHeadRunClub';

export const events2027: Event2027[] = [
  // ——— HEADLINE WEEKS ————————————————————————————————————————————
  {
    slug: 'rbc-heritage-2027',
    name: 'RBC Heritage Presented by Boeing',
    group: 'marquee',
    status: 'confirmed',
    startDate: '2027-04-12',
    endDate: '2027-04-18',
    dateLabel: 'Apr 12–18, 2027',
    sortDate: '2027-04-12',
    location: 'Harbour Town Golf Links, Sea Pines',
    description:
      'The 59th edition of the PGA TOUR stop at Harbour Town, played the week after the Masters. Lodging and dinner reservations tighten months ahead.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau',
      url: 'https://www.hiltonheadisland.com/?p=335',
    },
    officialUrl: 'https://rbcheritage.com/',
    internalLink: {
      href: '/guides/2027-rbc-heritage',
      label: 'Our 2027 Heritage planning kit',
    },
  },
  {
    slug: 'wine-and-food-festival-2027',
    name: 'Hilton Head Island Wine & Food Festival',
    group: 'marquee',
    status: 'confirmed',
    startDate: '2027-03-25',
    endDate: '2027-04-04',
    dateLabel: 'Mar 25–Apr 4, 2027',
    sortDate: '2027-03-25',
    location: 'Venues across Hilton Head Island',
    description:
      'Eleven days of tastings and dinners spread across the island. Events are ticketed separately, so check each ticket for its venue.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau',
      url: 'https://www.hiltonheadisland.com/?p=335',
    },
    officialUrl: 'https://hiltonheadwineandfood.com',
  },

  // ——— FESTIVALS & CULTURE ————————————————————————————————————————
  {
    slug: 'gullah-celebration-2027',
    name: 'Hilton Head Island Gullah Celebration',
    group: 'festivals',
    status: 'confirmed',
    startDate: '2027-02-01',
    endDate: '2027-02-28',
    dateLabel: 'Feb 1–28, 2027',
    sortDate: '2027-02-01',
    location: 'Hilton Head Island',
    detail:
      'Posted so far: Feb 5 Friends & Family at First African Baptist Church; Feb 6 Gullah breakfast; Feb 20–21 Roots & Recipes Reunion cook-off. More events are added through the month.',
    description:
      'A month of events honoring the Gullah culture and history of the island, from church gatherings and breakfasts to a cook-off weekend. Tickets are sold through Eventeny.',
    source: {
      label: 'Gullah Celebration (organizer)',
      url: 'https://www.gullahcelebration.org/',
    },
    officialUrl: 'https://www.gullahcelebration.org/',
  },
  {
    slug: 'concours-2027',
    name: 'Hilton Head Island Concours d’Elegance & Motoring Festival',
    group: 'festivals',
    status: 'expected',
    dateLabel: 'Late Oct–early Nov (expected)',
    sortDate: '2027-10-29',
    location: 'Port Royal Golf Club and venues across the island',
    description:
      'A multi-day collector-car festival that ends with the Concours show on the fairways of Port Royal Golf Club. Proceeds go to local charities.',
    basis:
      'The 2026 festival ran Oct 29–Nov 1. The organizer has not posted 2027 dates yet.',
    source: {
      label: 'Hilton Head Island Concours (organizer)',
      url: 'https://www.hhiconcours.com/',
    },
    officialUrl: 'https://www.hhiconcours.com/',
  },

  // ——— FOOD & DINING ——————————————————————————————————————————————
  {
    slug: 'seafood-festival-2027',
    name: 'Hilton Head Island Seafood Festival',
    group: 'food',
    status: 'confirmed',
    startDate: '2027-02-22',
    endDate: '2027-02-28',
    dateLabel: 'Feb 22–28, 2027',
    sortDate: '2027-02-22',
    location: 'Hilton Head Island',
    detail:
      'Third-party guides put the main festival day on Saturday, Feb 27 (noon–5 p.m., Coastal Discovery Museum). Confirm hours on the official 2027 schedule.',
    description:
      'A week of seafood dinners and tastings built around a Saturday festival, marking the festival’s 20th year. Tickets go through the organizer.',
    source: {
      label: 'Hilton Head Island Seafood Festival (organizer)',
      url: 'https://www.hiltonheadseafoodfestival.com/',
    },
    officialUrl: 'https://www.hiltonheadseafoodfestival.com/',
  },
  {
    slug: 'chamber-restaurant-week-2027',
    name: 'Chamber Restaurant Week',
    group: 'food',
    status: 'expected',
    dateLabel: 'Late Jan–early Feb (expected)',
    sortDate: '2027-01-30',
    location: 'Hilton Head Island and Bluffton',
    description:
      'More than 80 restaurants from Bluffton to Hilton Head offer fixed-price menus for a week, run by the Hilton Head Island-Bluffton Chamber of Commerce.',
    basis:
      'The 2026 week was announced as Jan 31–Feb 7, with the Chamber publishing the dates in mid-December 2025. Expect the 2027 announcement around the same time.',
    source: {
      label: 'Hilton Head Island-Bluffton Chamber',
      url: 'https://www.hiltonheadisland.org/chamber-restaurant-week',
    },
  },

  // ——— PARADES ————————————————————————————————————————————————————
  {
    slug: 'st-patricks-parade-2027',
    name: 'Hilton Head St. Patrick’s Day Parade',
    group: 'parades',
    status: 'confirmed',
    startDate: '2027-03-14',
    endDate: '2027-03-14',
    dateLabel: 'Sun, Mar 14, 2027',
    sortDate: '2027-03-14',
    location: 'Pope Avenue, Hilton Head Island',
    detail:
      'Steps off at 2 p.m. The organizer’s page does not mention 2027 IrishFest events yet.',
    description:
      'The 41st annual parade down Pope Avenue, billed as South Carolina’s oldest St. Patrick’s Day parade. The south end gets busy, so arrive early for a spot on the route.',
    source: {
      label: 'Hilton Head Ireland (organizer)',
      url: 'https://www.hiltonheadireland.org/',
    },
    officialUrl: 'https://www.hiltonheadireland.org/',
  },
  {
    slug: 'bluffton-christmas-parade-2027',
    name: 'Bluffton Christmas Parade & Tree Lighting',
    group: 'parades',
    status: 'expected',
    dateLabel: 'Early December (expected)',
    sortDate: '2027-12-03',
    location: 'Bluffton',
    description:
      'A long-running small-town parade with local and regional floats, paired with a tree lighting.',
    basis:
      'The 55th annual parade is set for Dec 4, 2026, and Bluffton describes the parade as an early-December tradition. 2027 date not posted.',
    source: {
      label: 'Visit Bluffton events',
      url: 'https://www.visitbluffton.org/events?page=1',
    },
  },

  // ——— ARTS & CRAFTS ——————————————————————————————————————————————
  {
    slug: 'first-thursday-artisan-alley-2027',
    name: 'First Thursday Artisan Alley',
    group: 'arts',
    status: 'expected',
    dateLabel: 'First Thursday monthly (expected)',
    sortDate: '2027-03-04',
    location: 'The Shops at Sea Pines Center',
    detail: 'Usually 3–6 p.m.',
    description:
      'A monthly pop-up of local makers at the Sea Pines shopping center.',
    basis:
      'The 2026 series ran on first Thursdays from March through December. The 2027 schedule is not posted.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau',
      url: 'https://compass.hiltonheadisland.org/events/first-thursday-artisan-alley',
    },
  },
  {
    slug: 'honey-horn-art-market-2027',
    name: 'Art Market at Historic Honey Horn',
    group: 'arts',
    status: 'listed',
    startDate: '2027-04-24',
    endDate: '2027-04-25',
    dateLabel: 'Apr 24–25, 2027',
    sortDate: '2027-04-24',
    location: 'Historic Honey Horn (Coastal Discovery Museum)',
    description:
      'A juried outdoor market of original work in ceramics, glass, fiber, jewelry, wood, painting and photography.',
    detail:
      'One craft-fair directory shows these dates and an artist application deadline of Jan 10, 2027. The listing has not been verified by the organizer, so confirm with the museum before planning around it.',
    source: {
      label: 'TheCraftMap listing',
      url: 'https://www.thecraftmap.com/fair/art-market-at-historic-honey-horn-hilton-head-island-sc',
    },
  },
  {
    slug: 'bluffton-mayfest-2027',
    name: 'Bluffton Village Festival (Mayfest)',
    group: 'arts',
    status: 'expected',
    dateLabel: 'A Saturday in May (expected)',
    sortDate: '2027-05-08',
    location: 'Old Town Bluffton',
    description:
      'A free, one-day street festival with 130+ artists and food vendors, coordinated by the Rotary Club of Bluffton. The festival dates back to 1978.',
    basis: 'The 2026 festival was Saturday, May 9. 2027 date not posted.',
    source: {
      label: 'Eat It and Like It (2026 coverage)',
      url: 'https://eatitandlikeit.com/?p=11830',
    },
  },
  {
    slug: 'art-festival-shelter-cove-2027',
    name: 'Hilton Head Island Art Festival',
    group: 'arts',
    status: 'expected',
    dateLabel: 'Memorial Day weekend (expected)',
    sortDate: '2027-05-28',
    location: 'Shelter Cove Harbour & Marina',
    description:
      'Free, three-day waterfront art show coordinated by Nash Gallery, with artists showing work made in the USA and live music on the promenade.',
    basis:
      'The 2026 show ran May 22–24, the weekend before Memorial Day. Memorial Day 2027 is May 31, so the same pattern would put it May 28–30. Not confirmed.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau (2026 listing)',
      url: 'https://www.hiltonheadisland.com/?p=50233',
    },
    officialUrl: 'https://www.hiltonheadartfestival.com/',
  },
  {
    slug: 'bluffton-arts-seafood-festival-2027',
    name: 'Historic Bluffton Arts & Seafood Festival',
    group: 'arts',
    status: 'expected',
    dateLabel: 'Mid-October (expected)',
    sortDate: '2027-10-08',
    location: 'Old Town Bluffton',
    description:
      'A fall festival week with a juried fine-art show and street fest, local seafood, an Ugly Dog contest and a pie-eating contest.',
    basis:
      'The 2026 festival ran Oct 9–18, with the street fest on Oct 17–18. 2027 date not posted.',
    source: {
      label: 'Visit Bluffton events',
      url: 'https://www.visitbluffton.org/events?page=1',
    },
  },
  {
    slug: 'crescendo-2027',
    name: 'Crescendo: A Celebration of Arts, Culture & Community',
    group: 'arts',
    status: 'expected',
    dateLabel: 'October–November (expected)',
    sortDate: '2027-10-01',
    location: 'Venues across Hilton Head Island',
    description:
      'The island’s fall arts festival, organized by the Town’s Office of Cultural Affairs and the Arts Council, with performances, exhibits and hands-on workshops at many venues.',
    basis:
      'The 2026 edition was the tenth annual and ran through October and into November. 2027 program not posted.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau',
      url: 'https://compass.hiltonheadisland.org/events/2026-crescendo-celebration',
    },
  },

  // ——— 5Ks & RUNS ————————————————————————————————————————————————
  {
    slug: 'chamber-waves-to-wellness-5k-2027',
    name: 'Chamber Waves to Wellness 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'January (expected)',
    sortDate: '2027-01-09',
    location: 'Tiki Hut at the Beach House Resort, Forest Beach',
    description:
      'A New Year 5K hosted by the Hilton Head Island-Bluffton Chamber and produced by Hilton Head Running Company, benefiting the Island Recreation Association.',
    basis:
      'The 2025 race was Jan 11 with a 9 a.m. start. No 2027 date is posted.',
    source: {
      label: 'RunSignup',
      url: 'https://runsignup.com/Race/WavesToWellness5K/Page/Info',
    },
  },
  {
    slug: 'tulip-trot-5k-2027',
    name: 'Tulip Trot 5K & Walk (Bluffton)',
    group: 'running',
    status: 'listed',
    startDate: '2027-03-20',
    endDate: '2027-03-20',
    dateLabel: 'Sat, Mar 20, 2027',
    sortDate: '2027-03-20',
    location: 'Bluffton',
    detail: '5K plus a 1-mile option.',
    description: 'A spring 5K and walk in Bluffton, just off the island.',
    source: {
      label: 'Find The Run listing',
      url: 'https://www.findtherun.com/races/hilton-head-island-sc/5k?page=2',
    },
  },
  {
    slug: 'plaid-nation-5k-2027',
    name: 'Plaid Nation 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Sat, Apr 10 (expected)',
    sortDate: '2027-04-10',
    location: 'Celebration Park, Pope Avenue',
    description:
      'The kickoff to RBC Heritage week, produced by Palmetto Running Company and benefiting the Heritage Classic Foundation, with an after-party at The Bank beer garden.',
    basis:
      'It has run on the Saturday before Heritage week (Apr 12 in 2025, Apr 11 in 2026). Heritage starts Apr 12, 2027, which points to Saturday, Apr 10. Not confirmed.',
    source: {
      label: 'RunSignup',
      url: 'https://runsignup.com/Race/SC/HiltonHeadIsland/PlaidNation5K',
    },
    internalLink: {
      href: '/guides/2027-rbc-heritage',
      label: 'Our 2027 Heritage planning kit',
    },
  },
  {
    slug: 'pedal-run-5k-2027',
    name: 'Pedal + Run Hilton Head Island',
    group: 'running',
    status: 'listed',
    startDate: '2027-05-01',
    endDate: '2027-05-01',
    dateLabel: 'Sat, May 1, 2027',
    sortDate: '2027-05-01',
    location: 'Hilton Head Island',
    detail: '5K. Course and start time are on the registration page.',
    description:
      'A 5K that appears on a regional race calendar for this date. The listing has few details, so check registration before you travel for it.',
    source: {
      label: 'Find The Run listing',
      url: 'https://www.findtherun.com/races/hilton-head-island-sc/5k?page=2',
    },
  },
  {
    slug: 'freedom-5k-2027',
    name: 'Hilton Head Freedom 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Memorial Day, May 31 (expected)',
    sortDate: '2027-05-31',
    location: 'Port Royal Plantation',
    description:
      'A Memorial Day 5K run/walk honoring service members, with proceeds supporting the Semper Fi & America’s Fund.',
    basis:
      'The 2026 race was held on Memorial Day itself (May 25). Memorial Day 2027 is May 31. Not confirmed.',
    source: {
      label: 'Hilton Head Island Visitor & Convention Bureau',
      url: 'https://www.hiltonheadisland.com/?p=50267',
    },
  },
  {
    slug: 'usa-5k-2027',
    name: 'USA 5K — Hilton Head Island',
    group: 'running',
    status: 'confirmed',
    startDate: '2027-07-04',
    endDate: '2027-07-04',
    dateLabel: 'Sun, Jul 4, 2027',
    sortDate: '2027-07-04',
    location: 'Coligny Beach',
    detail:
      '7:30 a.m. start. Packet pickup July 2 and 3, 1–4 p.m., at Hilton Head Running Company. At last check registration was $30 ($20 for ages 0–12); prices step up as race day nears.',
    description:
      'A Fourth of July 5K run/walk on the hard, flat beach, produced by Hilton Head Running Company and benefiting the Sea Turtle Patrol Hilton Head Island.',
    source: {
      label: 'RunSignup (Hilton Head Running Company)',
      url: 'https://www.givesignup.org/Race/SC/HiltonHeadIsland/USA5KHILTONHEADISLAND',
    },
  },
  {
    slug: 'end-of-summer-5k-2027',
    name: 'Hilton Head End of Summer 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Early September (expected)',
    sortDate: '2027-09-04',
    location: 'Coligny Beach',
    description:
      'A run/walk from Coligny Beach, produced by Palmetto Running Company, with a portion of proceeds going to a college scholarship fund.',
    basis: 'The 2026 race was Saturday, Sept 5. 2027 date not posted.',
    source: {
      label: 'Find A Race listing',
      url: 'https://findarace.com/us/events/hilton-head-end-of-summer-5k',
    },
  },
  {
    slug: 'hilton-head-half-quarter-5k-2027',
    name: 'Hilton Head Half & Quarter Marathon & 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Early November (expected)',
    sortDate: '2027-11-07',
    location: 'Harbour Town, Sea Pines',
    description:
      'The island’s fall distance race, produced by Hilton Head Running Company, with a half marathon, a quarter marathon and a 5K. It is not a closed course, so runners follow traffic rules.',
    basis: 'The 2026 race is Nov 1. 2027 date not posted.',
    source: {
      label: 'RunSignup',
      url: 'https://runsignup.com/Race/SC/HiltonHeadIsland/HiltonHeadHalfMarathon',
    },
  },
  {
    slug: 'turkey-trot-5k-2027',
    name: 'Hilton Head Turkey Trot 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Thanksgiving, Nov 25 (expected)',
    sortDate: '2027-11-25',
    location: 'Hilton Head Island',
    description:
      'The Island Rec Center’s Thanksgiving-morning 5K for runners, walkers and families.',
    basis:
      'The race is held on Thanksgiving morning (Nov 26 in 2026, 8 a.m.). Thanksgiving 2027 is Nov 25. Not confirmed.',
    source: {
      label: 'RunSignup',
      url: 'https://runsignup.com/Race/Info/SC/HiltonHead/HiltonHeadTurkeyTrot',
    },
  },
  {
    slug: 'nutcracker-5k-2027',
    name: 'Nutcracker 5K',
    group: 'running',
    status: 'expected',
    dateLabel: 'Early December (expected)',
    sortDate: '2027-12-04',
    location: 'Hilton Head Running Company, William Hilton Parkway',
    description:
      'A holiday-themed 5K with Hilton Head Dance Theatre performers on the course and a toy drive for the Deep Well Project, produced by Hilton Head Running Company.',
    basis:
      'Past races were held on the first Saturday of December (Dec 7, 2024; a Dec 5, 2026 date is listed). 2027 date not posted.',
    source: {
      label: 'RunSignup',
      url: 'https://runsignup.com/Race/SC/HiltonHeadIsland/Nutcracker5KHiltonHeadIsland',
    },
  },
];

export function getEventsByGroup(group: Event2027Group): Event2027[] {
  const order: Record<Event2027Status, number> = {
    confirmed: 0,
    listed: 0,
    expected: 1,
  };
  return events2027
    .filter((e) => e.group === group)
    .sort(
      (a, b) =>
        order[a.status] - order[b.status] || a.sortDate.localeCompare(b.sortDate),
    );
}

export function getConfirmedEvents(): Event2027[] {
  return events2027
    .filter((e) => e.status === 'confirmed')
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate));
}
