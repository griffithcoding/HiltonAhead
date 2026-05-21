/**
 * Storied long-form pages at /stories/[slug].
 *
 * Place-as-protagonist editorial pieces. Each record drives a fully
 * scroll-driven 8-chapter narrative rendered by components/sections/StoryPage.
 *
 * No people in any imagery — all settings/takeaway photos are scenery,
 * venues, courses, and resort architecture.
 *
 * URL convention: /stories/{slug}.
 */

import { photos } from './photos';
import type { RoutePoint } from '@/components/ui/HiltonHeadMap';

export type StoryKind = 'event' | 'stay';

export interface TimelineEntry {
  time: string;
  title: string;
  body: string;
  photo?: { src: string; alt: string };
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  caption?: string;
}

export interface Story {
  slug: string;
  /** Display number, e.g. "01", "02". Renders in the cover stamp. */
  storyNumber: string;
  /** Story kind — drives the "AN EVENT" / "A STAY" badge. */
  kind: StoryKind;
  /** Slug into data/tripTypes.ts so we can cross-link to the related trip-type page. */
  tripType: 'golf-packages' | 'weddings' | 'family-trip-planner';
  /** Calendar date label, e.g. "October 2025". */
  date: string;
  /** ISO 8601 publish date for Article schema. */
  publishedAt: string;
  updatedAt?: string;

  /** SEO. */
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  articleSection: string; // "Weddings" | "Golf" | "Family Travel"

  /** Display H1 — same plain/italic split as tripTypes. */
  title: { plain: string; italic: string };
  /** Cover hook copy beneath the H1. */
  hook: string;
  /** Cover image — full-bleed. */
  cover: { src: string; alt: string };

  /** Chapter 02 — the brief. */
  brief: string;
  pinQuote: { text: string; attribution: string };
  pinPhoto: { src: string; alt: string; caption?: string };

  /** Chapter 03 — the setting. 4 polaroids of venues, no people. */
  settings: { src: string; alt: string; caption: string }[];
  settingIntro: string;

  /** Chapter 04 — the route. Map + waypoints. */
  route: RoutePoint[];
  routeIntro: string;
  routeLabel: string;

  /** Chapter 05 — the timeline. */
  timeline: TimelineEntry[];

  /** Chapter 06 — the numbers. */
  stats: Stat[];
  statsIntro?: string;

  /** Chapter 07 — the pivot. */
  pivotQuote: { text: string; attribution?: string };
  pivotBackground: { src: string; alt: string };

  /** Chapter 08 — aftermath + CTA. */
  takeaways: { src: string; alt: string; caption?: string }[];
  aftermathIntro: string;
}

// ---------------------------------------------------------------------------
// Story 01 — A Hilton Head fall golf weekend
// ---------------------------------------------------------------------------
const fallGolfWeekend: Story = {
  slug: 'fall-golf-weekend',
  storyNumber: '01',
  kind: 'event',
  tripType: 'golf-packages',
  date: 'October 2025',
  publishedAt: '2025-11-04T10:00:00-05:00',

  seoTitle: 'A Hilton Head Fall Golf Weekend, Planned to the Half Hour',
  metaDescription:
    'Eight college roommates, three Hilton Head courses, two villas, one perfectly paced October weekend. The day-by-day, costs, and what made the trip work.',
  keywords: [
    'Hilton Head golf weekend',
    'Harbour Town golf',
    'Sea Pines golf trip',
    'Palmetto Dunes RTJ',
    'Hilton Head guys trip',
    'Hilton Head fall golf',
    'Hilton Head stay and play',
  ],
  articleSection: 'Golf',

  title: {
    plain: 'A Hilton Head golf weekend,',
    italic: 'planned to the half hour.',
  },
  hook:
    'Late October. Eight college roommates twenty-five years out, thirty-six holes a day, two villas a block apart inside the Sea Pines gate. Here is how the weekend actually ran — Friday’s wheels-down to Sunday’s wheels-up, on the half hour.',
  cover: {
    src: photos.golfFairway.src,
    alt: 'Empty Lowcountry golf fairway lined with palmetto trees at sunrise',
  },

  brief:
    'Eight college roommates, twenty-five years out. Two of them played D1, four had not swung a club since June, and one was nursing a lower back from a basement reno. They wanted Harbour Town. They wanted a low number on a card. And they wanted to be home by Sunday night dinner so nobody got the cold-side-of-the-bed lecture for missing a Monday morning.',
  pinQuote: {
    text:
      "Don't make it a death march. Two rounds a day, but the second one can't be a 1 PM shotgun in 90-degree humidity.",
    attribution: 'Group leader, planning email',
  },
  pinPhoto: {
    src: photos.lighthouse.src,
    alt: 'Harbour Town Lighthouse glowing red and white at dusk',
    caption: 'Harbour Town · 6:48 p.m.',
  },

  settings: photos.storySettings.golf as unknown as Story['settings'],
  settingIntro:
    'Two villas a block apart at South Beach Lane, three courses inside (and one ten minutes north of) the Sea Pines gate, and a Friday-night oyster table at Hudson’s. The footprint never broke five miles.',

  route: [
    { coords: [0.55, 0.06], label: 'SAV airport',         time: 'Fri · 4:00 PM' },
    { coords: [0.30, 0.83], label: 'Sea Pines villa',     time: 'Fri · 4:45 PM' },
    { coords: [0.18, 0.82], label: 'Harbour Town · 1st',  time: 'Sat · 7:42 AM' },
    { coords: [0.66, 0.42], label: 'RTJ Oceanfront',      time: 'Sat · 2:15 PM' },
    { coords: [0.42, 0.50], label: 'Hudson’s · oysters', time: 'Sat · 7:30 PM' },
    { coords: [0.32, 0.84], label: 'Atlantic Dunes loop', time: 'Sun · 8:00 AM' },
  ],
  routeIntro:
    'Drop bags at the villa, range time before sunset, dinner walking distance from the villa door. Saturday: thirty-six holes split between Harbour Town and Palmetto Dunes RTJ Oceanfront, sandwiched around the Quarterdeck. Sunday: an early walking loop at Atlantic Dunes, planes wheels-up by four. The weekend lived inside Sea Pines except for the Saturday afternoon hop ten minutes north.',
  routeLabel: '6 stops · 3 days · 36 holes/day',

  timeline: [
    {
      time: 'Friday · 4:00 PM',
      title: 'Wheels down at Savannah/Hilton Head',
      body:
        'Two ride-share Suburbans waiting at SAV. Twenty-eight minutes door-to-door to the Sea Pines South Beach gate. Bags up the stairs before anyone’s flight nap wears off.',
      photo: { src: photos.boardwalk.src, alt: 'Wooden boardwalk through coastal sea oats' },
    },
    {
      time: 'Friday · 5:30 PM',
      title: 'Range time, Harbour Town',
      body:
        'We held the range with the resort. Forty-five minutes to find the swings that survived the flight. Then a beer, then a long shower, then a walk to the marina.',
    },
    {
      time: 'Friday · 7:30 PM',
      title: 'Hudson’s, twelve-top against the river',
      body:
        'Walk-in is impossible at Hudson’s on a Friday in October. We held a twelve-top weeks ahead. Eight raw, eight Rockefeller, twelve cold beers, and the kind of view that makes a bad swing on Saturday already worth it.',
      photo: { src: photos.harborBoats.src, alt: 'Sailboats anchored off a Lowcountry sandbar' },
    },
    {
      time: 'Saturday · 7:42 AM',
      title: 'Harbour Town first tee',
      body:
        'The 7:42 tee time on a Saturday in October is the one nobody can buy day-of. Sea Pines villa guests get 120-day priority and we used it. Mist still on the 18th from the Sound. Best opening hour of the year.',
      photo: { src: photos.golfTeeBox.src, alt: 'Golf tee box overlooking a fairway through coastal pines' },
    },
    {
      time: 'Saturday · 12:30 PM',
      title: 'Quarterdeck lunch under the lighthouse',
      body:
        'Sandwiches in the lighthouse’s shadow, twenty-six minutes for everyone to clean up their card. The afternoon-only crew ducked back to the villa pool while the rest reloaded for round two.',
    },
    {
      time: 'Saturday · 2:15 PM',
      title: 'Palmetto Dunes RTJ Oceanfront',
      body:
        'Tee time at RTJ, ten-minute drive from the villa. The 10th tee box hangs over the dune; one guy’s iPhone went into the marsh on a celebratory whip out of the cart. Recovered by the ranger at sunset, dried in rice on the villa counter overnight.',
      photo: { src: photos.lagoonAerial.src, alt: 'Aerial of resort lagoons threaded between palm trees' },
    },
    {
      time: 'Saturday · 7:30 PM',
      title: 'Pool, sundown, takeout',
      body:
        'Skull Creek to-go for the guys who could not face another reservation. Pool was warm; card game broke up at midnight; nobody set an alarm louder than necessary.',
    },
    {
      time: 'Sunday · 8:00 AM',
      title: 'Atlantic Dunes loop, walking',
      body:
        'Last round. Atlantic Dunes, walking for the guys whose backs would let them, carts for the ones who knew better. Final birdies, final back-pat, bags rolling out the South Beach gate by 1:30.',
      photo: { src: photos.marinaDawn.src, alt: 'Marina at dawn, sailboats at rest on glassy water' },
    },
  ],

  stats: [
    { value: 36, suffix: '', label: 'Holes per day' },
    { value: 8, label: 'Roommates' },
    { value: 3, label: 'Courses played', caption: 'Harbour Town, RTJ, Atlantic Dunes' },
    { value: 1, label: 'Phone retrieved', caption: 'RTJ 10th, into the marsh' },
    { value: 4800, prefix: '$', label: 'Per guest, all-in', caption: '3 nights, 4 rounds, dinners, transfers' },
    { value: 0, label: 'Missed tee times' },
  ],
  statsIntro:
    'A clean sheet, not a sales page. What the weekend actually cost and actually held.',

  pivotQuote: {
    text:
      'We finished Saturday’s second round at 6:38 PM. The first beer at the villa pool got handed to the guy nursing the back. He laughed, sat down, and didn’t get up for an hour. That’s when we knew we got the pacing right.',
    attribution: 'Trip planner, post-trip note',
  },
  pivotBackground: {
    src: photos.sundown.src,
    alt: 'Atlantic horizon at sundown',
  },

  takeaways: [
    { ...photos.golfTeeBox,  caption: 'Harbour Town · first tee, mist' },
    { ...photos.lighthouse,  caption: '18th green at sundown' },
    { ...photos.golfFairway, caption: 'RTJ Oceanfront · 10th hole' },
    { ...photos.lagoonAerial, caption: 'Palmetto Dunes · resort lagoons' },
    { ...photos.harborBoats, caption: 'Skull Creek · post-round' },
    { ...photos.marinaDawn,  caption: 'Sea Pines marina · Sunday morning' },
  ],
  aftermathIntro:
    'Eight guys, three courses, zero blown tee times, one phone rescued from a salt marsh. We plan four to six fall weekends like this every year — the calendar fills by July.',
};

// ---------------------------------------------------------------------------
// Story 02 — An October villa wedding
// ---------------------------------------------------------------------------
const octoberVillaWedding: Story = {
  slug: 'october-villa-wedding',
  storyNumber: '02',
  kind: 'event',
  tripType: 'weddings',
  date: 'October 2025',
  publishedAt: '2025-11-12T10:00:00-05:00',

  seoTitle: 'An October Villa Wedding on Hilton Head — A Weekend, Planned',
  metaDescription:
    'Sixty-two guests, thirty-eight villas, one Saturday Sea Pines beach ceremony. The full lodging-and-logistics weekend, day by day, by a local Hilton Head wedding planner.',
  keywords: [
    'Hilton Head wedding weekend',
    'Sea Pines wedding',
    'Hilton Head wedding planner',
    'destination wedding Hilton Head',
    'Hilton Head wedding lodging',
    'Hilton Head wedding logistics',
    'October wedding Hilton Head',
  ],
  articleSection: 'Weddings',

  title: {
    plain: 'An October villa wedding,',
    italic: 'planned around the guests.',
  },
  hook:
    'Sixty-two guests, three flight cities, one Saturday afternoon ceremony at a Sea Pines beachfront under live oaks. Here is how the weekend actually ran for the people who flew in — welcome bag to airport van.',
  cover: {
    src: photos.ceremonyArbor.src,
    alt: 'Empty wedding arbor on a coastal lawn at golden hour',
  },

  brief:
    'Couple from Boston, marrying in October. Thirty-eight households, average age forty-two. Six kids under ten. Three grandparents who needed a ground-floor bedroom and a flight that did not connect. The ceremony planner had ceremony covered. We owned everything else: lodging, ground transport, welcome dinner, brunch, airport runs, and the rolling text thread for everyone who was inevitably going to ask whether to bring waders for the marsh.',
  pinQuote: {
    text:
      'Treat the guest experience like a separate trip. The ceremony is two hours. The weekend is three days.',
    attribution: 'Bride, kickoff call',
  },
  pinPhoto: {
    src: photos.mossOak.src,
    alt: 'Spanish moss draped from a Lowcountry live oak',
    caption: 'Sea Pines · portrait grove',
  },

  settings: photos.storySettings.wedding as unknown as Story['settings'],
  settingIntro:
    'A South Beach Lane villa block for the family, Shelter Cove for the friend group, and a Saturday ceremony on a private Sea Pines beachfront under live oaks. Three pockets, all inside fifteen minutes of one another.',

  route: [
    { coords: [0.55, 0.06], label: 'SAV airport',          time: 'Fri · 1–5 PM' },
    { coords: [0.32, 0.83], label: 'Sea Pines villa block', time: 'Fri · arrivals' },
    { coords: [0.42, 0.50], label: 'Shelter Cove rehearsal', time: 'Fri · 6:00 PM' },
    { coords: [0.46, 0.78], label: 'Beach ceremony',         time: 'Sat · 4:00 PM' },
    { coords: [0.34, 0.82], label: 'Estate reception',       time: 'Sat · 6:30 PM' },
    { coords: [0.42, 0.48], label: 'Skull Creek brunch',     time: 'Sun · 10:00 AM' },
  ],
  routeIntro:
    'Welcome bags into thirty-eight villa doors by 1 PM Friday. Rehearsal dinner that night at Shelter Cove. Saturday ceremony on a private Sea Pines beachfront at 4 PM, reception three hundred steps inland at the family estate. Sunday brunch at Skull Creek for anyone whose flight was after 2 PM. Three coordinated van waves to SAV between 1 and 4.',
  routeLabel: '6 stops · 3 days · 38 villas',

  timeline: [
    {
      time: 'Wednesday · 6:00 PM',
      title: 'Welcome bag staging',
      body:
        'Sixty-two welcome bags assembled at the staging villa. Local oysters, an island map we drew in-house, a card with the weekend’s running text-thread number, and a packet of saltwater taffy from the Salty Dog. Lift-and-deliver team starts Thursday at 8 AM.',
    },
    {
      time: 'Friday · 11:00 AM',
      title: 'Welcome bag delivery',
      body:
        'All thirty-eight villa doors hit by 1 PM. Zero misses. The text thread already had twenty-two messages by 11:30 — “do we tip the resort cleaning?”, “where’s the closest CVS?”, “is sunscreen included?”',
      photo: { src: photos.villa.src, alt: 'Southern coastal cottage with a wraparound porch' },
    },
    {
      time: 'Friday · 1–5 PM',
      title: 'Three SAV van waves',
      body:
        'Sprinter vans rotating between SAV airport and the villa block. Average wait at the curb under twelve minutes. Last family in the door by 5:45.',
    },
    {
      time: 'Friday · 6:00 PM',
      title: 'Rehearsal dinner, Shelter Cove',
      body:
        'A long oyster table at Skull Creek Boathouse, sunset reservation, thirty-two of the closest. One toast per side. No slideshow. Done by 9.',
      photo: { src: photos.harborBoats.src, alt: 'Sailboats anchored off a Lowcountry sandbar' },
    },
    {
      time: 'Saturday · 4:00 PM',
      title: 'The ceremony',
      body:
        'Ceremony planner ran the show. We ran ground-side: golf-cart shuttle from the parking pad to the beach access, coolers of seltzer at the boardwalk, a backup tent under the oaks for the 3 PM weather check. The check came back sunny.',
      photo: { src: photos.ceremonyArbor.src, alt: 'Empty wedding arbor on a coastal lawn' },
    },
    {
      time: 'Saturday · 6:30 PM',
      title: 'Estate reception',
      body:
        'Estate inside Sea Pines, three hundred steps from the ceremony spot. Dinner under string lights, oyster shucker on the lawn, dance floor on a wooden platform built that morning. We held the band’s load-in window at 4 PM sharp.',
      photo: { src: photos.setTable.src, alt: 'Long banquet table set under string lights' },
    },
    {
      time: 'Sunday · 10:00 AM',
      title: 'Skull Creek brunch',
      body:
        'Buffet for forty, river view, the post-mortem laughs that always carry the weekend. The grandparents stayed an hour. Coffee was the right call.',
    },
    {
      time: 'Sunday · 1:00 PM',
      title: 'Departures',
      body:
        'Three SAV waves at 1, 2:30, and 4. We rode the last van. Two missed bags surfaced at Atlanta connections, both home in forty-eight hours.',
      photo: { src: photos.marsh.src, alt: 'Coastal grass rolling toward the horizon at dusk' },
    },
  ],

  stats: [
    { value: 62, label: 'Guests' },
    { value: 38, label: 'Villas booked' },
    { value: 12, label: 'Oysters per person', caption: 'Rehearsal + reception combined' },
    { value: 3, label: 'SAV van waves' },
    { value: 0, label: 'Ceremony delays' },
    { value: 1, label: 'Tide table consulted', caption: 'Low tide at 5:42 PM Saturday' },
  ],
  statsIntro: 'A long-weekend wedding by the numbers.',

  pivotQuote: {
    text:
      'The grandfather of the bride pulled me aside Sunday morning at brunch. He was eighty-four. He said, “I haven’t been to a family thing in fifteen years where I knew where the bathroom was the whole time.” That’s when we knew we’d done our part.',
    attribution: 'Lead trip planner, Sunday morning',
  },
  pivotBackground: {
    src: photos.mossOak.src,
    alt: 'Spanish moss draped from a Lowcountry live oak',
  },

  takeaways: [
    { ...photos.ceremonyArbor, caption: 'Sea Pines · the arbor' },
    { ...photos.setTable,      caption: 'Reception · oyster table' },
    { ...photos.mossOak,       caption: 'Live oak · portraits' },
    { ...photos.harborBoats,   caption: 'Shelter Cove · rehearsal' },
    { ...photos.villa,         caption: 'South Beach Lane · family villa' },
    { ...photos.marsh,         caption: 'Broad Creek · Saturday’s sunset' },
  ],
  aftermathIntro:
    'Ceremony planners run the ceremony. We run the weekend. Sea Pines, Palmetto Bluff, Inn at Palmetto Bluff — we work alongside the venue planner you have already hired and own everything that happens before and after.',
};

// ---------------------------------------------------------------------------
// Story 03 — A summer family week
// ---------------------------------------------------------------------------
const summerFamilyWeek: Story = {
  slug: 'summer-family-week',
  storyNumber: '03',
  kind: 'stay',
  tripType: 'family-trip-planner',
  date: 'July 2025',
  publishedAt: '2025-08-08T10:00:00-04:00',

  seoTitle: 'A Summer Family Week on Hilton Head — Eight Days, Day by Day',
  metaDescription:
    'Two parents, four kids ages 4 to 13, one grandmother, eight days at Palmetto Dunes. The full Hilton Head family week — camps, dinners, rainy-day plays, and the parents got a vacation too.',
  keywords: [
    'Hilton Head family week',
    'Palmetto Dunes family vacation',
    'Hilton Head with kids',
    'Hilton Head summer family trip',
    'Hilton Head tennis camp',
    'Hilton Head sailing camp',
    'Hilton Head villa rental family',
  ],
  articleSection: 'Family Travel',

  title: {
    plain: 'A Hilton Head family week,',
    italic: 'where the parents got a vacation too.',
  },
  hook:
    'Two parents, four kids ages four to thirteen, one grandmother who had not been on a beach trip since 2008. Eight days at Palmetto Dunes. Here is the day-by-day, including the rainy Friday and the Saturday morning the mom remembers.',
  cover: {
    src: photos.beachAerial.src,
    alt: 'Oceanfront pool overlooking the Atlantic',
  },

  brief:
    'Family from Cincinnati. Four kids spanning a decade of ages — four, seven, eleven, thirteen. Grandmother along for the first six nights, flying out before the parents on day six. The mom said it on the discovery call: “I want to read a book on a beach. Cumulatively. For more than twenty minutes. That’s the bar.”',
  pinQuote: {
    text:
      'Camp during the day for the older two, pool with the four-year-old, dinners that don’t require pretending the four-year-old isn’t a four-year-old.',
    attribution: 'Parent, intake form',
  },
  pinPhoto: {
    src: photos.coastalOak.src,
    alt: 'Sunlight filtering through tall coastal pines along a Sea Pines bike path',
    caption: 'Sea Pines · kids bike loop',
  },

  settings: photos.storySettings.family as unknown as Story['settings'],
  settingIntro:
    'A Palmetto Dunes oceanfront 4BR with a private pool and a five-minute boardwalk to sand. Tennis camp at the Sport & Racquet Club for the older two, sailing camp at Shelter Cove for the eleven-year-old, and a kid-zero plan for the four-year-old that did not require a parent to be the cruise director.',

  route: [
    { coords: [0.55, 0.06], label: 'SAV airport',           time: 'Sat · 1:30 PM' },
    { coords: [0.66, 0.42], label: 'Palmetto Dunes villa',  time: 'Sat · 2:30 PM' },
    { coords: [0.66, 0.46], label: 'Sport & Racquet camp',  time: 'M–F 9 AM' },
    { coords: [0.42, 0.50], label: 'Shelter Cove sailing',  time: 'Tue/Thu' },
    { coords: [0.46, 0.72], label: 'Coligny welcome',       time: 'Sun · 6:00 PM' },
    { coords: [0.42, 0.50], label: 'Skull Creek dinner',    time: 'Wed · 6:00 PM' },
  ],
  routeIntro:
    'The family’s footprint stayed inside Palmetto Dunes for sixty percent of the week, with two camp drop-offs at the gate, three dinners off-resort, and one rainy-day trip to Old Town Bluffton. The car never moved more than fifteen minutes from the villa, every single drive.',
  routeLabel: '6 stops · 8 days · 11 beach mornings',

  timeline: [
    {
      time: 'Saturday · 2:00 PM',
      title: 'Villa keys, grocery delivery',
      body:
        'Drive from SAV in thirty-eight minutes (off the bridge, no traffic). Grocery delivery already in the kitchen — Instacart from the Whole Foods in Bluffton, including the four-year-old’s specific yogurt brand. Pool by 3 PM.',
      photo: { src: photos.villa.src, alt: 'Southern coastal cottage with a wraparound porch' },
    },
    {
      time: 'Sunday · 9:00 AM',
      title: 'Beach morning, kid-pace',
      body:
        'Sunscreen, boogie boards, beach umbrella delivered by the resort. Forty minutes of book time logged before the four-year-old needed a goldfish refill. We counted it as a win.',
      photo: { src: photos.dunesPath.src, alt: 'Wooden dune crossover path bending toward the Atlantic' },
    },
    {
      time: 'Monday · 8:45 AM',
      title: 'Tennis camp drop-off',
      body:
        'Older two at Palmetto Dunes Sport & Racquet for the first day of summer week 5. Four-year-old waved them in from the cart. Pre-paid card-on-file at the camp store; saved a daily transaction.',
    },
    {
      time: 'Tuesday · 1:30 PM',
      title: 'Sailing camp pickup',
      body:
        'Eleven-year-old finished his first afternoon at Shelter Cove sailing camp with sunburn on the back of his ears (we forgot to tell them about ear sunscreen) and a grin we sent to the mom by text.',
      photo: { src: photos.harborBoats.src, alt: 'Sailboats anchored off a Lowcountry sandbar' },
    },
    {
      time: 'Wednesday · 6:00 PM',
      title: 'Skull Creek family dinner',
      body:
        'Six-top with the grandmother, river view, kid menu that does not apologize. Hush puppies for the table. Out by 8 PM. The four-year-old asleep before the Cross Island bridge.',
    },
    {
      time: 'Thursday · 11:00 AM',
      title: 'Pool day at the villa',
      body:
        'Storm forecast came in for Friday. Family stayed pool-side at the villa, lunch on the deck, grandmother read a magazine in a chaise for two solid hours. Nobody asked for an itinerary.',
      photo: { src: photos.lagoonAerial.src, alt: 'Aerial of resort lagoons threaded between palm trees' },
    },
    {
      time: 'Friday · 11:00 AM',
      title: 'Heyward House, Old Town Bluffton',
      body:
        'Rainy morning. We sent them to Heyward House and the May River walking path; coffee at the Cottage; back to the villa by 2. Total Bluffton round-trip: fifty minutes off the resort gate.',
    },
    {
      time: 'Saturday · 6:30 AM',
      title: 'Last-morning beach walk',
      body:
        'Mom went alone. Sand was hard-packed and the tide was out. Three dolphins moving north up the surf line. She said it was the morning she’ll think about all winter.',
      photo: { src: photos.beachMorning.src, alt: 'Lone sailboat anchored off a quiet Atlantic beach' },
    },
  ],

  stats: [
    { value: 8, label: 'Days on island' },
    { value: 4, label: 'Kids', caption: 'Ages 4, 7, 11, 13' },
    { value: 11, label: 'Beach mornings' },
    { value: 60, label: 'Chapters read', caption: "Mom's count, paperback" },
    { value: 2, label: 'Camps booked', caption: 'Tennis + sailing, in February' },
    { value: 0, label: 'Urgent-care visits' },
  ],
  statsIntro:
    'What the week actually held — measured in pages, not Instagram posts.',

  pivotQuote: {
    text:
      'Saturday morning, the mom texted me a picture of the sunrise from the boardwalk. She was alone. The caption was three words: I read sixty chapters.',
    attribution: 'Final morning, Palmetto Dunes',
  },
  pivotBackground: {
    src: photos.beachMorning.src,
    alt: 'Lone sailboat anchored off a quiet Atlantic beach at sunrise',
  },

  takeaways: [
    { ...photos.dunesPath,    caption: 'Coligny · the boardwalk' },
    { ...photos.coastalOak,   caption: 'Sea Pines · forest path' },
    { ...photos.lagoonAerial, caption: 'Palmetto Dunes · resort lagoons' },
    { ...photos.beachMorning, caption: 'Forest Beach · 7 a.m.' },
    { ...photos.villa,        caption: 'The villa · 4BR oceanfront' },
    { ...photos.harborBoats,  caption: 'Shelter Cove · sailing camp' },
  ],
  aftermathIntro:
    'Two parents. Four kids. One grandmother. Eight days. The whole week ran inside fifteen minutes of the villa and the parents actually got the trip too. We plan twenty to thirty family weeks like this every summer.',
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const stories: Story[] = [
  fallGolfWeekend,
  octoberVillaWedding,
  summerFamilyWeek,
];

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export function getStoriesByTripType(tripTypeSlug: string): Story[] {
  return stories.filter((s) => s.tripType === tripTypeSlug);
}

export function getStoriesExcept(slug: string): Story[] {
  return stories.filter((s) => s.slug !== slug);
}

/**
 * Friendly display name for a story — strips trailing punctuation
 * from the plain title for use in cross-link rails and crumbs.
 */
export function getStoryDisplayName(s: Story): string {
  return `${s.title.plain.replace(/[,.]$/, '')} ${s.title.italic.replace(/[,.]$/, '')}`.trim();
}
