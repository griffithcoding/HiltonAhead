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
  /**
   * Set when exact dates are not yet announced (or the entry is a recurring
   * series without fixed dates). Shown in place of the date range, and the
   * entry is EXCLUDED from Event schema — never publish guessed dates as
   * structured data. startDate/endDate then only drive sorting and expiry.
   */
  datesTba?: string;
  /** Who runs the event. Emitted as schema `organizer` when present. */
  organizer?: { name: string; url?: string };
};

// Dates last verified: Nov 2026. 2027 sources — RBC Heritage: PGA Tour 2027
// schedule + tournament ticket on-sale; Wine & Food: island events calendar;
// Seafood Festival + Gullah Celebration: regional event calendars. Entries
// marked datesTba had no published 2027 dates at time of writing — swap in
// real dates (and drop datesTba) as organizers announce them.

export const events: EventEntry[] = [
  // ——— MARQUEE EVENTS ——————————————————————————————————————————————
  {
    slug: 'rbc-heritage-2027',
    name: 'RBC Heritage Presented by Boeing',
    startDate: '2027-04-12',
    endDate: '2027-04-18',
    location: 'Harbour Town Golf Links, Sea Pines',
    venue: 'Harbour Town Golf Links',
    category: 'marquee',
    description:
      "South Carolina's only PGA Tour stop and a 2027 Signature Event, played at Pete Dye's Harbour Town Golf Links. Monday is closed to spectators, Tuesday has the opening ceremonies, Wednesday is the Pro-Am, and the four tournament rounds run Thursday-Sunday, April 15-18. Grounds tickets are $100 a day, practice days $25, and kids 15 and under are free with a ticketed adult. Lodging roughly doubles; book 9-10 months ahead.",
    url: 'https://rbcheritage.com/',
    organizer: { name: 'Heritage Classic Foundation', url: 'https://rbcheritage.com/' },
    recurring: true,
    isHighlight: true,
  },
  {
    slug: 'wine-and-food-festival-2027',
    name: 'Hilton Head Island Wine & Food Festival',
    startDate: '2027-03-25',
    endDate: '2027-04-04',
    location: 'Multiple venues, Hilton Head Island',
    category: 'marquee',
    description:
      "Eleven days of tastings, winemaker dinners and the signature public tasting at Honey Horn. The 2027 run overlaps Easter weekend (March 28), so lodging tightens early. Marquee tickets sell out 4-6 weeks ahead. Pair with a Sea Pines or Palmetto Dunes stay for the easiest logistics.",
    url: 'https://hiltonheadisland.org/wine-and-food-festival',
    recurring: true,
    isHighlight: true,
  },
  {
    slug: 'concours-delegance-2027',
    name: 'Hilton Head Island Concours d’Elegance & Motoring Festival',
    startDate: '2027-10-28',
    endDate: '2027-10-31',
    datesTba: 'Late Oct / early Nov 2027 (dates TBA)',
    location: 'Honey Horn / Port Royal',
    category: 'marquee',
    description:
      "Multi-day automotive showcase with concours classes, the Car Club Showcase, the Motoring Festival and the concours itself at Port Royal Golf Club. Draws collectors from across the country. The 2026 edition ran Oct 29-Nov 1; 2027 dates had not been announced at our last check. Lodging tightens the prior week; book 3-4 months ahead.",
    url: 'https://www.hhiconcours.com/',
    recurring: true,
    isHighlight: true,
  },

  // ——— SEASONAL FESTIVALS ——————————————————————————————————————————
  {
    slug: 'gullah-celebration-2027',
    name: 'Hilton Head Island Gullah Celebration',
    startDate: '2027-02-01',
    endDate: '2027-02-28',
    location: 'Multiple venues, Hilton Head Island',
    category: 'seasonal',
    description:
      "A month-long celebration of Gullah Geechee culture — language, foodways, music and history — held every February. Events include food expos, arts and crafts showcases and history talks; a mix of free and ticketed events. One of the most distinctive cultural calendars in the Lowcountry. Check the organizer's schedule for individual event dates.",
    url: 'https://www.hiltonheadisland.org/hilton-head-island-gullah-celebration',
    recurring: true,
  },
  {
    slug: 'hilton-head-seafood-festival-2027',
    name: 'Hilton Head Island Seafood Festival',
    startDate: '2027-02-22',
    endDate: '2027-02-28',
    location: 'Honey Horn (Coastal Discovery Museum)',
    venue: 'Coastal Discovery Museum at Honey Horn',
    category: 'food',
    description:
      "A week of Lowcountry seafood events that builds to the main festival day on Saturday, February 27 (noon-5 p.m.) on the Honey Horn lawn at the Coastal Discovery Museum: oyster roasts, live music and craft vendors. A genuine local gathering, not just a tourist event.",
    url: 'https://www.hiltonheadisland.org/seafood-festival',
    recurring: true,
  },
  {
    slug: 'wingfest-2027',
    name: 'Hilton Head Wingfest',
    startDate: '2027-03-01',
    endDate: '2027-03-31',
    datesTba: 'March 2027 (date TBA)',
    location: 'Lowcountry Celebration Park, Coligny',
    category: 'food',
    description:
      "One-day chicken wing competition with local restaurants competing for People's Choice and Judges' Choice, with general-admission tasting tickets. Recent editions have landed on a Saturday in March (March 21 in 2026). We'll post the 2027 date when it is announced.",
    recurring: true,
  },
  {
    slug: 'pat-conroy-literary-festival-2027',
    name: 'Pat Conroy Literary Festival',
    startDate: '2027-10-01',
    endDate: '2027-10-31',
    datesTba: 'October 2027 (dates TBA)',
    location: 'Beaufort, SC (40 min drive)',
    category: 'arts',
    description:
      "Annual celebration of the late South Carolina author Pat Conroy, with readings, panels and writing workshops in Beaufort, usually in late October. A 40-minute drive from Hilton Head and a worthwhile day trip for literary travelers.",
    url: 'https://patconroyliteraryfestival.org/',
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
  // Recurring series run on a weekly pattern without one fixed date range
  // announced in advance, so they carry datesTba and stay out of schema.
  {
    slug: 'music-and-taste-shelter-cove',
    name: 'Music & Taste at Shelter Cove (Thursdays)',
    startDate: '2027-04-01',
    endDate: '2027-10-31',
    datesTba: 'Thursdays, April–October 2027',
    location: 'Shelter Cove Harbour & Marina',
    category: 'recurring',
    description:
      "Free Thursday-evening concert series at Shelter Cove featuring local bands plus food vendors and family activities. Runs weekly April through October. Best paired with dinner at Ela's on the Water or Poseidon. Family-friendly and dog-friendly.",
    recurring: true,
  },
  {
    slug: 'gregg-russell-harbour-town',
    name: 'Gregg Russell at Liberty Oak (Nightly Summer)',
    startDate: '2027-06-01',
    endDate: '2027-08-31',
    datesTba: 'Summer evenings, June–August 2027',
    location: 'Liberty Oak, Harbour Town',
    category: 'recurring',
    description:
      "An island institution: nightly outdoor children's concerts under the Liberty Oak in Harbour Town, June through August. Free, family-oriented, and a Hilton Head tradition for 40+ years. Bring chairs, bug spray, and a sense of nostalgia.",
    recurring: true,
  },
  {
    slug: 'harbourfest-shelter-cove',
    name: 'HarbourFest at Shelter Cove (Tuesdays)',
    startDate: '2027-06-01',
    endDate: '2027-08-31',
    datesTba: 'Tuesdays, mid-June–late August 2027',
    location: 'Shelter Cove Harbour & Marina',
    category: 'recurring',
    description:
      "Tuesday-evening summer festival at Shelter Cove featuring live music, fireworks at 9:30 p.m., kids' activities, and food trucks. Runs weekly mid-June through late August. Free admission; plan dinner reservations 1-2 weeks out for marina-side seats.",
    recurring: true,
  },
  {
    slug: 'bluffton-farmers-market',
    name: 'Bluffton Farmers Market (Thursdays)',
    startDate: '2027-04-01',
    endDate: '2027-10-31',
    datesTba: 'Thursdays, mid-April–October 2027',
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
    datesTba: '2026–27 season, October–April',
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
    datesTba: '2026–27 season, September–June',
    location: 'Arts Center of Coastal Carolina, Mid-island',
    category: 'arts',
    description:
      "Year-round professional theater company producing roughly 6-7 mainstage productions per season plus visual art exhibitions, gallery openings, and a children's theater track. The single best rainy-afternoon option on the island for cultured travelers.",
    recurring: true,
  },
];

/** Look up a single event (used by posts that are about one event). */
export function getEventBySlug(slug: string): EventEntry | undefined {
  return events.find((e) => e.slug === slug);
}

/** True when an entry has confirmed dates and may be emitted as Event schema. */
export function hasConfirmedDates(e: EventEntry): boolean {
  return !e.datesTba;
}

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
