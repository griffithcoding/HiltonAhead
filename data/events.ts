/**
 * Hilton Head Island event calendar.
 *
 * Powers /events. Event schema is emitted per item, which makes the page
 * eligible for Google Event rich results (date, location, ticket info in
 * SERPs). Update annually as confirmed dates land.
 *
 * Categorized for filtering and editorial grouping. Use 'marquee' for the
 * 3-4 island-defining events; 'recurring' for weekly/monthly programs;
 * 'seasonal' for one-off festivals; 'arts' for performing-arts series.
 */

export type EventCategory =
  | 'marquee'
  | 'recurring'
  | 'food'
  | 'sports'
  | 'arts'
  | 'seasonal'
  | 'holiday';

export type EventEntry = {
  slug: string;
  name: string;
  /** ISO date string (YYYY-MM-DD). For multi-day events, this is the start date. */
  startDate: string;
  /** ISO date string. For single-day events, equal to startDate. */
  endDate: string;
  /** Display location: venue or neighborhood. */
  location: string;
  /** More precise venue if applicable, used in Event schema. */
  venue?: string;
  category: EventCategory;
  description: string;
  /** Official URL if available; used as schema 'url'. */
  url?: string;
  /** Annually recurring? Set true for evergreen events (Heritage, etc.). */
  recurring?: boolean;
  /** If true, show in the "marquee" hero block at top of page. */
  isHighlight?: boolean;
};

export const events: EventEntry[] = [
  // ——— MARQUEE EVENTS ——————————————————————————————————————————————
  {
    slug: 'rbc-heritage-2026',
    name: 'RBC Heritage Presented by Boeing',
    startDate: '2026-04-13',
    endDate: '2026-04-19',
    location: 'Harbour Town Golf Links, Sea Pines',
    venue: 'Harbour Town Golf Links',
    category: 'marquee',
    description:
      "The PGA Tour's only stop in South Carolina, hosted at Pete Dye's iconic Harbour Town Golf Links. The full week includes practice rounds (Mon-Wed), a Pro-Am (Wed), four tournament rounds (Thu-Sun), Plaid Nation Saturday, and the plaid jacket presentation Sunday at 6 p.m. Tickets run $55-2,200; lodging doubles from typical April rates. Book 9-10 months ahead.",
    url: 'https://rbcheritage.com/',
    recurring: true,
    isHighlight: true,
  },
  {
    slug: 'wine-and-food-festival-2026',
    name: 'Hilton Head Island Wine & Food Festival',
    startDate: '2026-03-22',
    endDate: '2026-03-28',
    location: 'Multiple venues, Hilton Head Island',
    category: 'marquee',
    description:
      "A week of tastings, winemaker dinners, and the signature Public Tasting at Honey Horn. Now in its 41st year. Tickets sell out 4-6 weeks ahead. Pair with a Sea Pines or Palmetto Dunes stay for the easiest logistics.",
    recurring: true,
    isHighlight: true,
  },
  {
    slug: 'concours-delegance-2026',
    name: 'Hilton Head Island Concours d’Elegance & Motoring Festival',
    startDate: '2026-10-29',
    endDate: '2026-11-01',
    location: 'Honey Horn / Port Royal',
    category: 'marquee',
    description:
      "Four-day automotive showcase featuring concours classes, the Car Club Showcase, the Motoring Festival, and the Sunday gala on the lawn at Honey Horn. Draws collectors and enthusiasts from across the country. Lodging tightens the prior week; book 3-4 months ahead.",
    recurring: true,
    isHighlight: true,
  },

  // ——— SEASONAL FESTIVALS ——————————————————————————————————————————
  {
    slug: 'gullah-celebration-2026',
    name: 'Native Islander Gullah Celebration',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    location: 'Multiple venues, Hilton Head Island',
    category: 'seasonal',
    description:
      "A month-long celebration of Gullah Geechee culture — language, foodways, music, and history. Events include the Taste of Gullah, Arts, Crafts & Food Expo, and the De Aarts ob We People showcase. Free and ticketed events both. One of the most distinctive cultural calendars in the Lowcountry.",
    recurring: true,
  },
  {
    slug: 'hilton-head-seafood-festival-2026',
    name: 'Hilton Head Island Seafood Festival',
    startDate: '2026-02-13',
    endDate: '2026-02-15',
    location: 'Honey Horn',
    category: 'food',
    description:
      "Three days of Lowcountry seafood, oyster roasts, live music, and craft vendors at the Honey Horn lawn. Friday is the Captain's Dinner; Saturday is the main festival; Sunday is the family-focused brunch. A genuine local gathering, not just a tourist event.",
    recurring: true,
  },
  {
    slug: 'wingfest-2026',
    name: 'Hilton Head Wingfest',
    startDate: '2026-04-11',
    endDate: '2026-04-11',
    location: 'Lowcountry Celebration Park, Coligny',
    category: 'food',
    description:
      "One-day chicken wing competition with 30+ local restaurants competing for People's Choice and Judges' Choice. Tickets are general-admission and include unlimited tastings. Falls the weekend before RBC Heritage; works as a pre-Heritage warm-up.",
    recurring: true,
  },
  {
    slug: 'pat-conroy-literary-festival-2026',
    name: 'Pat Conroy Literary Festival',
    startDate: '2026-10-23',
    endDate: '2026-10-25',
    location: 'Beaufort, SC (40 min drive)',
    category: 'arts',
    description:
      "Annual celebration of the late South Carolina author Pat Conroy, with readings, panels, and writing workshops at the USCB Center for the Arts in Beaufort. A 40-minute drive from Hilton Head and a worthwhile Saturday day-trip for literary travelers.",
    recurring: true,
  },

  // ——— HOLIDAY / SEASONAL —————————————————————————————————————————
  {
    slug: 'harbour-town-holiday-lights-2026',
    name: 'Harbour Town Holiday Lights',
    startDate: '2026-11-28',
    endDate: '2027-01-05',
    location: 'Harbour Town, Sea Pines',
    category: 'holiday',
    description:
      "Nightly holiday-light display throughout Harbour Town, transforming the marina, lighthouse, and surrounding pavilions. Free to walk; restaurants and shops stay open later for the crowd. Best visited 5-7 p.m. for the sunset-into-dark transition. Runs daily Nov 28 through New Year's.",
    recurring: true,
    isHighlight: true,
  },
  {
    slug: 'new-years-eve-fireworks-2026',
    name: "New Year's Eve Fireworks",
    startDate: '2026-12-31',
    endDate: '2026-12-31',
    location: 'Shelter Cove Harbour & Marina',
    category: 'holiday',
    description:
      "Annual fireworks display over Calibogue Sound at midnight, with restaurants at Shelter Cove serving prix fixe dinners and rooftop access at Poseidon. Book the dinner reservation 6-8 weeks ahead; villa lodging for the week 2+ months ahead.",
    recurring: true,
  },

  // ——— RECURRING WEEKLY / MONTHLY ————————————————————————————————
  {
    slug: 'music-and-taste-shelter-cove',
    name: 'Music & Taste at Shelter Cove (Thursdays)',
    startDate: '2026-04-09',
    endDate: '2026-10-29',
    location: 'Shelter Cove Harbour & Marina',
    category: 'recurring',
    description:
      "Free Thursday-evening concert series at Shelter Cove featuring local bands plus food vendors and family activities. Runs weekly April through October. Best paired with dinner at Ela's on the Water or Poseidon. Family-friendly and dog-friendly.",
    recurring: true,
  },
  {
    slug: 'gregg-russell-harbour-town',
    name: 'Gregg Russell at Liberty Oak (Nightly Summer)',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    location: 'Liberty Oak, Harbour Town',
    category: 'recurring',
    description:
      "An island institution: nightly outdoor children's concerts under the Liberty Oak in Harbour Town, June through August. Free, family-oriented, and a Hilton Head tradition for 40+ years. Bring chairs, bug spray, and a sense of nostalgia.",
    recurring: true,
  },
  {
    slug: 'harbourfest-2026',
    name: 'HarbourFest at Shelter Cove (Tuesdays)',
    startDate: '2026-06-09',
    endDate: '2026-08-25',
    location: 'Shelter Cove Harbour & Marina',
    category: 'recurring',
    description:
      "Tuesday-evening summer festival at Shelter Cove featuring live music, fireworks at 9:30 p.m., kids' activities, and food trucks. Runs weekly mid-June through late August. Free admission; plan dinner reservations 1-2 weeks out for marina-side seats.",
    recurring: true,
  },
  {
    slug: 'bluffton-farmers-market',
    name: 'Bluffton Farmers Market (Thursdays)',
    startDate: '2026-04-16',
    endDate: '2026-10-29',
    location: 'Calhoun Street, Old Town Bluffton',
    category: 'recurring',
    description:
      "Weekly Thursday-afternoon farmers market on Calhoun Street in Old Town Bluffton. Local produce, baked goods, fresh pasta, flowers. Runs roughly mid-April through end of October from 1 p.m. to dusk. A natural pairing with a dinner at FARM or The Cottage.",
    recurring: true,
  },

  // ——— ARTS & CULTURE ————————————————————————————————————————————
  {
    slug: 'hilton-head-symphony-orchestra-season',
    name: 'Hilton Head Symphony Orchestra Season',
    startDate: '2026-10-01',
    endDate: '2027-04-30',
    location: 'First Presbyterian Church, Mid-island',
    category: 'arts',
    description:
      "Full October-through-April orchestral season with monthly concerts at First Presbyterian Church. Programs run from classical canon to pops and themed evenings. Single tickets typically $35-65; subscription packages available. Worth it for a snowbird stay.",
    recurring: true,
  },
  {
    slug: 'arts-center-coastal-carolina-season',
    name: 'Arts Center of Coastal Carolina Season',
    startDate: '2026-09-15',
    endDate: '2027-06-30',
    location: 'Arts Center of Coastal Carolina, Mid-island',
    category: 'arts',
    description:
      "Year-round professional theater company producing roughly 6-7 mainstage productions per season plus visual art exhibitions, gallery openings, and a children's theater track. The single best rainy-afternoon option on the island for cultured travelers.",
    recurring: true,
  },
];

export function getUpcomingEvents(now: Date = new Date()): EventEntry[] {
  const todayIso = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.endDate >= todayIso)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getHighlightEvents(): EventEntry[] {
  return events.filter((e) => e.isHighlight);
}

export function eventsByCategory(): Record<EventCategory, EventEntry[]> {
  const result: Record<EventCategory, EventEntry[]> = {
    marquee: [], recurring: [], food: [], sports: [],
    arts: [], seasonal: [], holiday: [],
  };
  for (const e of events) result[e.category].push(e);
  return result;
}
