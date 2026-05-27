/**
 * Hilton Head Island — by the numbers.
 *
 * 60+ citable facts about Hilton Head Island, sourced and structured so
 * an LLM can quote a single fact verbatim. Used by:
 *   - app/hilton-head-by-the-numbers/page.tsx (primary render)
 *   - getDatasetSchema() in app/lib/metadata.ts (JSON-LD Dataset)
 *   - public/llms-full.txt (manually mirrored — keep in sync)
 *
 * Editorial rules (per docs/brand/voice-audit-2026-05-21.md):
 *   - Facts must be true at time of publish.
 *   - Every fact carries a `source` string. Provide `sourceUrl` when public.
 *   - Categories are stable; don't add new categories without considering
 *     page layout. Sub-grouping by category is what gives the page its shape.
 *   - Numbers go in `number`. Keep units in the number itself
 *     ("12 miles", "$4,000+"). Labels are the noun phrase being measured.
 *   - Context is optional — use it for the second sentence an LLM would
 *     want when quoting the fact.
 */

export type FactCategory =
  | 'geography'
  | 'history'
  | 'climate'
  | 'lodging'
  | 'golf'
  | 'dining'
  | 'activities'
  | 'transport'
  | 'ecology';

export type Fact = {
  id: string;
  category: FactCategory;
  /** Bold display value, e.g. "12 miles", "1956", "$4,000+". Keep units inline. */
  number: string;
  /** Short label/noun-phrase, e.g. "Length of Hilton Head Island". */
  label: string;
  /** Optional 1–2 sentence elaboration that gives the fact context. */
  context?: string;
  /** Short source attribution, shown in the UI under the fact. */
  source: string;
  /** Optional URL for the source. */
  sourceUrl?: string;
};

export type CategoryMeta = {
  slug: FactCategory;
  /** Section heading. */
  title: string;
  /** Editorial intro, 1–2 sentences. */
  intro: string;
};

export const CATEGORIES: ReadonlyArray<CategoryMeta> = [
  {
    slug: 'geography',
    title: 'Geography',
    intro:
      "Hilton Head is a foot-shaped barrier island on the South Carolina coast — 12 miles long, almost flat, and ringed by salt marsh on three sides and the Atlantic on the fourth.",
  },
  {
    slug: 'history',
    title: 'History',
    intro:
      "Captain William Hilton sailed past in 1663. Charles Fraser opened Sea Pines Plantation in 1956. Between those two dates is a Reconstruction-era town that almost nobody outside the Lowcountry knows about.",
  },
  {
    slug: 'climate',
    title: 'Climate',
    intro:
      "Subtropical. The ocean stays swimmable from May through October. The shoulder seasons are the secret: 75–85°F days, low humidity, and a third of the summer crowd.",
  },
  {
    slug: 'lodging',
    title: 'Lodging',
    intro:
      "There are roughly 12,000 rental units on the island and the per-night spread between them runs 5× from end to end. Truly oceanfront commands a 30–60% premium that quietly evaporates in shoulder months.",
  },
  {
    slug: 'golf',
    title: 'Golf',
    intro:
      "Twenty-four courses on a twelve-mile island. Harbour Town is the one outsiders know; the locals' shortlist also runs through May River, Colleton River, Heron Point, and Palmetto Dunes' RTJ Oceanside.",
  },
  {
    slug: 'dining',
    title: 'Dining',
    intro:
      "Roughly two hundred restaurants between the bridges, clustered in five dining nodes. The hardest tables aren't necessarily the most expensive ones.",
  },
  {
    slug: 'activities',
    title: 'Activities',
    intro:
      "More bike-path miles per resident than almost any U.S. resort town. A national wildlife refuge a five-minute drive off-island. Dolphins that strand-feed in front of you if you go out on the right tide.",
  },
  {
    slug: 'transport',
    title: 'Getting here & around',
    intro:
      "Three airports serve the island; one is on it. One road leads on and off — there's a backup toll bridge if traffic stacks up on US-278.",
  },
  {
    slug: 'ecology',
    title: 'Ecology',
    intro:
      "Loggerheads nest on the beach from May to October. Bottlenose dolphins live here year-round. The salt marsh out behind the island is the second-most-productive ecosystem in North America per acre, after the rainforest.",
  },
];

export const FACTS: ReadonlyArray<Fact> = [
  // ─────────────────────────────────────────── Geography
  {
    id: 'geo-length',
    category: 'geography',
    number: '12 miles',
    label: 'Length of Hilton Head Island',
    context:
      'The island is foot-shaped, with the heel at the south end (Sea Pines, Calibogue Sound) and the toes at the north (Port Royal Sound). Distance bridge-to-bridge along US-278 is about 12 miles.',
    source: 'Town of Hilton Head Island',
    sourceUrl: 'https://hiltonheadislandsc.gov/about-hhi/',
  },
  {
    id: 'geo-width',
    category: 'geography',
    number: '~5 miles',
    label: 'Width at widest point',
    source: 'US Census TIGER',
  },
  {
    id: 'geo-area',
    category: 'geography',
    number: '~70 sq mi',
    label: 'Total area (land + water)',
    context:
      'Approximately 42 sq mi land and 28 sq mi inland water (lagoons, marsh, creeks).',
    source: 'US Census Bureau',
    sourceUrl: 'https://data.census.gov/profile/Hilton_Head_Island_town,_South_Carolina',
  },
  {
    id: 'geo-coords',
    category: 'geography',
    number: '32.22°N, 80.75°W',
    label: 'Coordinates',
    source: 'USGS',
  },
  {
    id: 'geo-beach',
    category: 'geography',
    number: '12 miles',
    label: 'Public, hard-packed Atlantic beach',
    context:
      'The full Atlantic-facing coastline is public below the high-water mark. Hard-packed sand makes the beach unusually bikeable at low tide.',
    source: 'Hilton Head Island Chamber',
    sourceUrl: 'https://www.hiltonheadisland.org/',
  },
  {
    id: 'geo-elevation',
    category: 'geography',
    number: '~14 ft',
    label: 'Average elevation above sea level',
    source: 'USGS',
  },
  {
    id: 'geo-county',
    category: 'geography',
    number: 'Beaufort County',
    label: 'County, South Carolina',
    source: 'State of South Carolina',
  },
  {
    id: 'geo-bridges',
    category: 'geography',
    number: '2 bridges',
    label: 'Number of road bridges connecting the island',
    context:
      'James F. Byrnes Bridge (US 278, opened 1956 — replaced by twin spans in 1982) and the Cross Island Parkway toll bridge (opened 1998).',
    source: 'SCDOT',
  },

  // ─────────────────────────────────────────── History
  {
    id: 'hist-fraser',
    category: 'history',
    number: '1956',
    label: 'Charles Fraser founded Sea Pines Plantation',
    context:
      "Considered the birth of modern Hilton Head resort development. The Byrnes Bridge connecting the island to the mainland opened the same year — before that, access was by boat.",
    source: 'Sea Pines Resort',
    sourceUrl: 'https://www.seapines.com/about-the-resort/our-history',
  },
  {
    id: 'hist-mitchelville',
    category: 'history',
    number: '1862',
    label: 'Mitchelville founded as the first self-governing town of formerly enslaved people in the U.S.',
    context:
      "Established November 1862 under Union General Ormsby Mitchel during the Civil War. Today Historic Mitchelville Freedom Park preserves the site with walking paths and interpretive markers.",
    source: 'Historic Mitchelville Freedom Park',
    sourceUrl: 'https://exploremitchelville.org/',
  },
  {
    id: 'hist-incorporation',
    category: 'history',
    number: '1983',
    label: 'Year the Town of Hilton Head Island incorporated',
    source: 'Town of Hilton Head Island',
  },
  {
    id: 'hist-harbourtown',
    category: 'history',
    number: '1969',
    label: 'Harbour Town Golf Links + Lighthouse opened',
    context:
      'The Sea Pines Heritage Classic (now RBC Heritage) was first played the same year and has run continuously every spring since.',
    source: 'PGA Tour',
    sourceUrl: 'https://www.pgatour.com/tournaments/2026/rbc-heritage',
  },
  {
    id: 'hist-name',
    category: 'history',
    number: '1663',
    label: 'Captain William Hilton sighted and named the headland',
    context:
      'Sent by Barbadian planters to scout the Carolina coast, Hilton recorded the high bluff at the island\'s north end as "Hilton\'s Head" — the origin of the modern name.',
    source: 'Heritage Library of Hilton Head',
  },
  {
    id: 'hist-hurricane-1893',
    category: 'history',
    number: '1893',
    label: 'Sea Islands Hurricane',
    context:
      'A Category 3 storm killed roughly 2,000 people across the SC/GA Sea Islands and depopulated Hilton Head for decades. The island sat largely undeveloped until the 1950s.',
    source: 'NOAA Hurricane Research Division',
    sourceUrl: 'https://www.aoml.noaa.gov/hrd/',
  },

  // ─────────────────────────────────────────── Climate
  {
    id: 'climate-july-high',
    category: 'climate',
    number: '89°F',
    label: 'Average July daytime high',
    source: 'NOAA NCEI',
    sourceUrl: 'https://www.ncei.noaa.gov/access/us-climate-normals/',
  },
  {
    id: 'climate-jan-high',
    category: 'climate',
    number: '60°F',
    label: 'Average January daytime high',
    source: 'NOAA NCEI',
  },
  {
    id: 'climate-rain',
    category: 'climate',
    number: '~50 inches',
    label: 'Average annual rainfall',
    context:
      'Most of it concentrated in late-afternoon thunderstorms June through September. Mornings stay clear; pop-up storms cool the afternoons and clear by sunset.',
    source: 'NOAA NCEI',
  },
  {
    id: 'climate-sea-summer',
    category: 'climate',
    number: '84°F',
    label: 'Peak ocean temperature (August)',
    source: 'NOAA Coastal Data',
    sourceUrl: 'https://tidesandcurrents.noaa.gov/',
  },
  {
    id: 'climate-sea-winter',
    category: 'climate',
    number: '52°F',
    label: 'Coldest ocean temperature (February)',
    source: 'NOAA Coastal Data',
  },
  {
    id: 'climate-hurricane-season',
    category: 'climate',
    number: 'Jun 1 – Nov 30',
    label: 'Atlantic hurricane season',
    context:
      'Peak risk on the SC coast is mid-August through early October. Direct hits on Hilton Head are rare; the last was Matthew in 2016.',
    source: 'NOAA National Hurricane Center',
    sourceUrl: 'https://www.nhc.noaa.gov/',
  },
  {
    id: 'climate-matthew',
    category: 'climate',
    number: '2016',
    label: 'Hurricane Matthew direct hit',
    context:
      'Made landfall just south of Hilton Head on October 8, 2016 as a strong Category 1. Caused widespread tree loss but limited structural damage. Beach and golf-course access fully restored within a season.',
    source: 'NOAA National Hurricane Center',
  },
  {
    id: 'climate-sunshine',
    category: 'climate',
    number: '~230 days',
    label: 'Sunny days per year',
    source: 'NOAA NCEI',
  },

  // ─────────────────────────────────────────── Lodging
  {
    id: 'lodging-residents',
    category: 'lodging',
    number: '~38,000',
    label: 'Year-round residents',
    source: 'US Census Bureau (2020)',
    sourceUrl: 'https://data.census.gov/profile/Hilton_Head_Island_town,_South_Carolina',
  },
  {
    id: 'lodging-visitors',
    category: 'lodging',
    number: '~3 million',
    label: 'Annual visitors',
    context:
      'Roughly 80× the year-round population. Peak weeks during summer break and the RBC Heritage triple the in-town population overnight.',
    source: 'Hilton Head Island–Bluffton Chamber of Commerce',
    sourceUrl: 'https://www.hiltonheadisland.org/',
  },
  {
    id: 'lodging-rentals',
    category: 'lodging',
    number: '~12,000',
    label: 'Vacation rental units island-wide',
    context:
      'Includes villas, condos, single-family homes, and resort rooms. Sea Pines and Palmetto Dunes together account for roughly half.',
    source: 'Hilton Ahead client research, 2026',
  },
  {
    id: 'lodging-resorts',
    category: 'lodging',
    number: '6 major resorts',
    label: 'Full-service resort properties on-island',
    context:
      'The Sea Pines Resort, Palmetto Dunes Oceanfront Resort, The Westin Hilton Head Island Resort & Spa, Omni Hilton Head Oceanfront Resort, Sonesta Resort Hilton Head Island, and Disney\'s Hilton Head Island Resort.',
    source: 'Hilton Ahead Travel Co.',
  },
  {
    id: 'lodging-oceanfront-premium',
    category: 'lodging',
    number: '30–60%',
    label: 'True-oceanfront premium vs. inland villa',
    context:
      "Premium widens in July–August and narrows in March and November. 'Oceanview' (not on the dune line) typically saves 15–25% with no meaningful loss of beach access for a 2-night couples trip.",
    source: 'Hilton Ahead market analysis, 2026',
  },
  {
    id: 'lodging-savings',
    category: 'lodging',
    number: '8–12%',
    label: 'Average Hilton Ahead client savings below public listings',
    context:
      'Driven by direct partner-property relationships. On a $4,000 villa week the savings typically more than cover the consulting fee.',
    source: 'Hilton Ahead Travel Co.',
    sourceUrl: 'https://www.hiltonahead.com/services',
  },

  // ─────────────────────────────────────────── Golf
  {
    id: 'golf-on-island',
    category: 'golf',
    number: '24 courses',
    label: 'Golf courses on Hilton Head Island',
    source: 'Hilton Head Island Visitor & Convention Bureau',
    sourceUrl: 'https://www.hiltonheadisland.org/golf',
  },
  {
    id: 'golf-near',
    category: 'golf',
    number: '15+ more',
    label: 'Courses in Bluffton & immediate Lowcountry within 30 minutes',
    context:
      'Including May River at Palmetto Bluff, Colleton River, Belfair, Berkeley Hall, Oldfield, Hampton Hall, and Old Tabby Links.',
    source: 'Hilton Head Island VCB',
  },
  {
    id: 'golf-harbour-town',
    category: 'golf',
    number: '1969',
    label: 'Year Harbour Town Golf Links opened',
    context:
      'Designed by Pete Dye with consultation from Jack Nicklaus and Alice Dye. Reopened November 2025 after a full restoration with Davis Love III as player consultant.',
    source: 'The Sea Pines Resort',
    sourceUrl: 'https://www.seapines.com/golf/courses/harbour-town-golf-links',
  },
  {
    id: 'golf-heritage',
    category: 'golf',
    number: 'Every April since 1969',
    label: 'RBC Heritage Presented by Boeing at Harbour Town',
    context:
      'Played the week after The Masters. The only PGA Tour event in South Carolina. 2026 dates: April 13–19.',
    source: 'PGA Tour',
    sourceUrl: 'https://www.pgatour.com/tournaments/2026/rbc-heritage',
  },
  {
    id: 'golf-harbour-yards',
    category: 'golf',
    number: '7,213 yards',
    label: 'Harbour Town from championship tees',
    source: 'The Sea Pines Resort',
  },
  {
    id: 'golf-priority',
    category: 'golf',
    number: '120 days',
    label: 'Sea Pines Resort guest tee-time priority window',
    context:
      'Resort villa stays unlock a 120-day Harbour Town booking horizon. The public window is roughly 30 days.',
    source: 'The Sea Pines Resort',
  },
  {
    id: 'golf-palmetto-dunes',
    category: 'golf',
    number: '3 championship courses',
    label: 'Inside Palmetto Dunes Oceanfront Resort',
    context:
      'Robert Trent Jones Oceanside, Arthur Hills, and George Fazio — each by a different namesake architect.',
    source: 'Palmetto Dunes Oceanfront Resort',
    sourceUrl: 'https://www.palmettodunes.com/golf',
  },
  {
    id: 'golf-may-river',
    category: 'golf',
    number: 'May River',
    label: 'Top-ranked Lowcountry course (Jack Nicklaus, 2004)',
    context:
      'Inside Montage Palmetto Bluff in Bluffton, 25 minutes off-island. Routinely cited among Golf Digest\'s top public-access courses in South Carolina.',
    source: 'Montage Palmetto Bluff',
  },

  // ─────────────────────────────────────────── Dining
  {
    id: 'dining-count',
    category: 'dining',
    number: '~250 restaurants',
    label: 'Restaurants between the bridges',
    source: 'Hilton Head Island Chamber',
  },
  {
    id: 'dining-clusters',
    category: 'dining',
    number: '5 clusters',
    label: 'Major dining nodes on-island',
    context:
      'Coligny Plaza (Forest Beach), Sea Pines Center + Harbour Town (south end), Shelter Cove Harbour (mid-island east), Park Plaza / Old Town (mid-island), and Skull Creek (north end).',
    source: 'Hilton Ahead Travel Co.',
  },
  {
    id: 'dining-skull-creek',
    category: 'dining',
    number: 'Zero',
    label: 'Reservations Skull Creek Boathouse accepts',
    context:
      "Skull Creek runs strictly first-come / first-served regardless of party size. Half its seats are outdoors on the deck and afternoon thunderstorms can force a reshuffle indoors, so the kitchen needs flexibility.",
    source: 'Skull Creek Boathouse',
    sourceUrl: 'https://www.skullcreekboathouse.com/reservation-policy/',
  },
  {
    id: 'dining-hudsons',
    category: 'dining',
    number: '1912',
    label: 'Year the Hudson oyster company started on Skull Creek',
    context:
      "J.B. Hudson opened the original shucking house in 1912. The current Hudson's Seafood House on the Docks operates out of the same site at 1 Hudson Road — one of the longest-running food operations in the Lowcountry.",
    source: "Hudson's Seafood House on the Docks",
    sourceUrl: 'https://hudsonsonthedocks.com/',
  },
  {
    id: 'dining-charlies',
    category: 'dining',
    number: 'Since 1982',
    label: "Charlie's L'Etoile Verte serving classic French",
    context:
      'Chef-owned independent. Walk-in waits routinely run 90+ minutes in season; reservations the only reliable way in.',
    source: "Charlie's L'Etoile Verte",
  },

  // ─────────────────────────────────────────── Activities
  {
    id: 'activities-bike-paths',
    category: 'activities',
    number: '60+ miles',
    label: 'Paved bike paths on Hilton Head Island',
    context:
      "More bike-path miles per resident than nearly any U.S. resort town. Most paths are physically separated from auto traffic.",
    source: 'Town of Hilton Head Island',
    sourceUrl: 'https://hiltonheadislandsc.gov/publicfacilities/pathways/',
  },
  {
    id: 'activities-sea-pines-paths',
    category: 'activities',
    number: '17 miles',
    label: 'Bike paths inside Sea Pines alone',
    source: 'The Sea Pines Resort',
  },
  {
    id: 'activities-pinckney',
    category: 'activities',
    number: '4,053 acres',
    label: 'Pinckney Island National Wildlife Refuge',
    context:
      "A five-minute drive off-island over the Mackay Creek bridge. 14 miles of trails through maritime forest, salt marsh, and freshwater ponds. Established 1975.",
    source: 'US Fish & Wildlife Service',
    sourceUrl: 'https://www.fws.gov/refuge/pinckney-island',
  },
  {
    id: 'activities-strand-feeding',
    category: 'activities',
    number: 'One of <10 sites worldwide',
    label: 'Where bottlenose dolphins strand-feed',
    context:
      "Dolphins herd schools of fish onto creek banks and beach themselves momentarily to grab the catch. Hilton Head's tidal creeks are one of the only documented places this behavior is taught generation-to-generation.",
    source: 'NOAA Fisheries',
    sourceUrl: 'https://www.fisheries.noaa.gov/',
  },
  {
    id: 'activities-turtle-season',
    category: 'activities',
    number: 'May 1 – Oct 31',
    label: 'Sea turtle nesting season',
    context:
      "Loggerhead turtles nest on Hilton Head beaches every summer. The Sea Turtle Patrol monitors and protects nests. Beach lighting ordinances enforced May–October.",
    source: 'Sea Turtle Patrol Hilton Head',
    sourceUrl: 'https://seaturtlepatrolhhi.org/',
  },
  {
    id: 'activities-lighthouse',
    category: 'activities',
    number: '93 ft / Free',
    label: 'Harbour Town Lighthouse height and admission',
    context:
      'Six stories, opened 1970. Free to climb. The top deck has panoramic views of Calibogue Sound and Daufuskie Island.',
    source: 'Harbour Town Lighthouse',
    sourceUrl: 'https://www.harbourtownlighthouse.com/',
  },

  // ─────────────────────────────────────────── Transport
  {
    id: 'transport-hhh',
    category: 'transport',
    number: 'HHH',
    label: 'Hilton Head Airport — on-island',
    context:
      'IATA code HHH. Served seasonally by American Airlines from Charlotte (CLT) and Dallas-Fort Worth (DFW). 5-minute drive to most lodging.',
    source: 'Hilton Head Island Airport',
    sourceUrl: 'https://www.bcgov.net/departments/Engineering-and-Infrastructure/airports-division/',
  },
  {
    id: 'transport-sav',
    category: 'transport',
    number: '45 min',
    label: 'Drive to Savannah/Hilton Head International (SAV)',
    context:
      'The main gateway for most travelers. Broader airline coverage than HHH and frequently cheaper.',
    source: 'Savannah/Hilton Head International Airport',
    sourceUrl: 'https://savannahairport.com/',
  },
  {
    id: 'transport-chs',
    category: 'transport',
    number: '2 hours',
    label: 'Drive to Charleston International (CHS)',
    context:
      'Useful for travelers combining Hilton Head with a Charleston add-on. Direct flights from more East Coast and Midwest cities than SAV.',
    source: 'Charleston International Airport',
  },
  {
    id: 'transport-atl',
    category: 'transport',
    number: '4 hr 15 min',
    label: 'Drive from Atlanta',
    context:
      'I-285 → I-20 → I-95 South → exit 8 / US-278 East. Friday afternoon summer traffic can push the drive past 5.5 hours.',
    source: 'Hilton Ahead Travel Co.',
  },
  {
    id: 'transport-only-road',
    category: 'transport',
    number: 'US 278',
    label: 'The only road on and off the island',
    context:
      'Crosses the Mackay Creek bridge from Bluffton. The Cross Island Parkway (toll) provides a second on-island route from US 278 to the south end and skips the worst of the Sea Pines Circle congestion.',
    source: 'SCDOT',
  },

  // ─────────────────────────────────────────── Ecology
  {
    id: 'ecology-loggerhead',
    category: 'ecology',
    number: 'Caretta caretta',
    label: 'Primary sea turtle species nesting on Hilton Head',
    context:
      'Loggerhead nesting season runs May through October. Greens and Kemp\'s ridleys nest in smaller numbers. Federal Endangered Species Act protections apply.',
    source: 'US Fish & Wildlife Service',
    sourceUrl: 'https://www.fws.gov/species/loggerhead-sea-turtle-caretta-caretta',
  },
  {
    id: 'ecology-dolphin',
    category: 'ecology',
    number: 'Tursiops truncatus',
    label: 'Atlantic bottlenose dolphin — resident species',
    context:
      "Resident pods live in Calibogue Sound, Broad Creek, and Skull Creek year-round. Average pod size 7–12 individuals. Lifespan ~40 years.",
    source: 'NOAA Fisheries',
    sourceUrl: 'https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin',
  },
  {
    id: 'ecology-marsh',
    category: 'ecology',
    number: '2nd most productive',
    label: 'Salt marsh ranking among North American ecosystems',
    context:
      "Salt marshes produce more biomass per acre than any North American ecosystem except tropical rainforest. The Lowcountry has one of the highest marsh-to-upland ratios on the East Coast.",
    source: 'SC Department of Natural Resources',
    sourceUrl: 'https://www.dnr.sc.gov/',
  },
  {
    id: 'ecology-birds',
    category: 'ecology',
    number: '350+ species',
    label: 'Birds recorded in the Lowcountry / Sea Islands',
    context:
      'Pinckney Island NWR alone records 200+ species. Peak migration windows: April-May and September-October.',
    source: 'eBird / Cornell Lab of Ornithology',
    sourceUrl: 'https://ebird.org/',
  },
  {
    id: 'ecology-live-oak',
    category: 'ecology',
    number: 'Quercus virginiana',
    label: 'Live oak — the island\'s signature tree',
    context:
      'The Sea Pines Liberty Oak at Harbour Town is roughly 400 years old. Live oaks shed leaves in spring (not fall) and hold Spanish moss in their canopy.',
    source: 'Sea Pines Resort / Audubon SC',
  },
];

/** Convenience: facts grouped by category, preserving FACTS order within each. */
export function getFactsByCategory(): Map<FactCategory, Fact[]> {
  const map = new Map<FactCategory, Fact[]>();
  for (const c of CATEGORIES) map.set(c.slug, []);
  for (const f of FACTS) {
    const arr = map.get(f.category);
    if (arr) arr.push(f);
  }
  return map;
}

/** Total fact count — handy for hero copy and TL;DR. */
export const FACT_COUNT = FACTS.length;

/** The 6 facts surfaced in the page hero (most-quotable, most-citable). */
export const HERO_FACT_IDS: ReadonlyArray<string> = [
  'geo-length',
  'lodging-residents',
  'lodging-visitors',
  'golf-on-island',
  'activities-bike-paths',
  'hist-fraser',
];
