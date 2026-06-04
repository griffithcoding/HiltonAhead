/**
 * Blog post content.
 *
 * Each post is a metadata record + ordered list of content blocks.
 * Rendered by components/PostBody.tsx. Content is static and trusted
 * (maintained in this repo), so paragraphs may include inline HTML
 * for <strong>, <em>, and <a href>.
 *
 * ─────────────────────────────────────────────────────────────────────
 * INTRO PATTERN — required for every new post.
 * The first `kind: 'p'` block follows the [moment + problem + payoff]
 * shape laid out in docs/brand/voice-audit-2026-05-21.md:
 *
 *   1. One sentence putting the reader in a moment. Time of day,
 *      place, or body feeling. ("7:14 a.m. on Tuesday and your porch
 *      faces an Atlantic that's glass." / "It's 71° on Hilton Head
 *      this morning and the beach is almost empty.")
 *   2. One sentence stating the problem the post solves.
 *   3. One sentence promising the payoff in concrete terms — what
 *      we'll hand the reader by the end.
 *
 * Voice rules: engage two senses (not just sight). Specific over
 * superlative. Imply, don't narrate. Words to retire: best, top,
 * premier, ultimate, curated, exclusive, unforgettable.
 * ─────────────────────────────────────────────────────────────────────
 */

import type { AffiliateProgramId } from './affiliateLinks';

/**
 * Optional affiliate placement at the foot of a post (between body and the
 * inline concierge CTA). Opt-in per post — leave undefined for posts where
 * a sponsored card would feel off-tone.
 */
export type PostAffiliateSlot = {
  programId: AffiliateProgramId;
  /** Override the program's defaultDeeplink. */
  deeplink?: string;
  /** Analytics label. Defaults to `blog/{slug}`. */
  placement?: string;
  /** Optional UI overrides — fall back to program defaults if omitted. */
  headline?: string;
  description?: string;
  cta?: string;
};

/** Names of inline interactive components the `embed` block can render. */
export type PostEmbedComponent =
  // Golf tier-list / Heritage 2027 page (PascalCase)
  | 'CourseMatchQuiz'
  | 'CourseMap'
  | 'StayAndPlayEstimator'
  | 'HeritageCountdown'
  | 'TeeTimeFinder'
  // Best-time-to-visit page (kebab-case, kept for data compatibility)
  | 'trip-window-finder'
  | 'live-weather'
  | 'tide-forecast'
  | 'hurricane-status';

export type PostBlock =
  | { kind: 'p'; html: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'callout'; label?: string; html: string }
  | { kind: 'quote'; html: string; attribution?: string }
  | {
      kind: 'table';
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      kind: 'faq';
      label?: string;
      items: Array<{ q: string; a: string }>;
    }
  | {
      kind: 'tier';
      label: string;
      subtitle?: string;
      accent: 'gold' | 'primary' | 'zinc' | 'rose';
      items: Array<{
        name: string;
        meta?: string;
        blurb: string;
      }>;
      /**
       * When present, the renderer pulls structured course cards from
       * `data/golfCourses.ts` instead of rendering the numbered text list.
       * `items` still drives the schema/ItemList output, so keep both
       * arrays in sync (one entry per course slug, same order).
       */
      courseSlugs?: string[];
    }
  | {
      /** Inline interactive widget, dispatched by name in PostBody. */
      kind: 'embed';
      component: PostEmbedComponent;
    }
  | {
      /**
       * Collapsible `<details>` section that wraps further blocks.
       * Used to make long posts scannable. Renders an editorial header
       * (eyebrow / title / optional summary) and an open/close indicator.
       */
      kind: 'section';
      /** Optional small uppercase label above the title (e.g. "01 · Conditions"). */
      eyebrow?: string;
      /** Section heading shown in the disclosure summary. */
      title: string;
      /** One-line preview shown alongside the title even when collapsed. */
      summary?: string;
      /** Whether the section is expanded on first paint. Default: false. */
      defaultOpen?: boolean;
      /** Nested blocks rendered inside the disclosure when open. */
      blocks: PostBlock[];
    };

/**
 * Flattens a tree of PostBlocks (which may contain `section` blocks holding
 * nested children) into a single ordered list. Used by schema gatherers in
 * the blog page template that need to find `faq` and `tier` blocks regardless
 * of nesting depth.
 */
export function flattenBlocks(blocks: PostBlock[]): PostBlock[] {
  return blocks.flatMap((b) =>
    b.kind === 'section' ? [b, ...flattenBlocks(b.blocks)] : [b],
  );
}

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category:
    | 'Neighborhoods'
    | 'Stays'
    | 'Dining'
    | 'Activities'
    | 'Golf'
    | 'Planning';
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  keywords: string[];
  /** Order of appearance on /blog (lower = earlier). */
  featuredOrder: number;
  /**
   * Optional hero image override. When set, replaces the category-default
   * photograph on `/blog/[slug]`. Use for posts where the category image
   * doesn't fit the editorial framing.
   */
  coverImage?: { src: string; alt: string };
  /**
   * Neighborhood slugs this post meaningfully covers. Drives the
   * bidirectional internal-link block at the bottom of the post (blog
   * -> /hilton-head/[slug]), complementing the neighborhood -> blog
   * link that already lives on the landing pages. Keep to 1-4 slugs;
   * empty array = general-interest post with no direct neighborhood.
   * Valid values match the slugs in data/neighborhoods.ts:
   *   'sea-pines' | 'palmetto-dunes' | 'forest-beach' | 'shelter-cove'
   */
  relatedNeighborhoods?: string[];
  /**
   * Optional affiliate card rendered at the end of the post body. Leave
   * undefined to skip — keeps the integration tasteful and per-post.
   */
  affiliate?: PostAffiliateSlot;
  body: PostBlock[];
};

// ---------------------------------------------------------------------------
// 1) FLAGSHIP. 2026 exciting new places to stay
// ---------------------------------------------------------------------------

const post2026Stays: Post = {
  slug: '2026-best-places-to-stay-hilton-head',
  title:
    "2026's Most Exciting Places to Stay on Hilton Head. Ranked by a Local",
  excerpt:
    "The newly-renovated resorts, the villa buildings locals actually book, and the one property you should avoid in 2026. An insider's ranking.",
  description:
    'Ranked: the 15 best places to stay on Hilton Head in 2026. Refreshed resorts, top Sea Pines and Palmetto Dunes villa buildings, and one to skip.',
  category: 'Stays',
  readTime: '12 min',
  publishedAt: '2026-03-14',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 1,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'best places to stay Hilton Head 2026',
    'Hilton Head resorts 2026',
    'Hilton Head villa rentals',
    'Sea Pines villas',
    'Palmetto Dunes rentals',
    'new hotels Hilton Head',
  ],
  body: [
    {
      kind: 'p',
      html: "It's 7:14 a.m. on a Tuesday and the right villa porch faces an Atlantic that's glass. The wrong one is forty minutes from any beach worth walking on. Where you stay on Hilton Head matters more than what you do — the island is twelve miles long, and the wrong pin on the map quietly costs you an hour of every day. Here's the list we actually send to clients in 2026.",
    },
    {
      kind: 'p',
      html: "This is the list we actually send to clients in 2026. Updated after the slate of post-storm renovations, the new Omni refresh, and the quiet disappearance of two rental programs we used to trust. Ranked in four tiers. If a property isn't here, it's not an accident.",
    },
    {
      kind: 'callout',
      label: 'How we rank',
      html: "We weigh four things: <strong>location</strong> (how close to beach, restaurants, and tee times), <strong>condition</strong> (when it was last fully renovated), <strong>value</strong> (what you pay vs. what's next door), and <strong>staff</strong> (who actually picks up the phone when something goes wrong). No paid placements, ever.",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'The properties we fight to book first.',
      accent: 'gold',
      items: [
        {
          name: 'The Sea Pines Resort: Harbour Town Inn',
          meta: 'Sea Pines · Refreshed 2025',
          blurb:
            "Finally renovated in 2025 after years of being almost-but-not-quite. The rooms now match the location, which has always been the best hotel address on the island. Harbour Town lighthouse out your window, Heritage-caliber golf a walk away. This is our default for couples and golfers who don't want to cook.",
        },
        {
          name: 'Montage Palmetto Bluff (Bluffton)',
          meta: 'Bluffton · 20 min off-island · Consistently elite',
          blurb:
            "Technically not Hilton Head, but we'd be lying if we left it off. The service bar is set here. Use it for anniversaries, proposals, and the one night you want to remember forever. Book the May River Cottages, not the Inn rooms.",
        },
        {
          name: 'Oceanfront villas on South Beach Lane (Sea Pines)',
          meta: 'Sea Pines · Private rentals · 3-6 BR',
          blurb:
            "The quietest stretch of sand in Sea Pines, two minutes from the marina, ten from Harbour Town. We hand-pick four buildings on this lane. Book 6+ months out for June-August; these do not last.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'Strong choices with one small asterisk.',
      accent: 'primary',
      items: [
        {
          name: 'Omni Hilton Head Oceanfront Resort',
          meta: 'Palmetto Dunes · Lobby + pool refresh completed 2026',
          blurb:
            "The 2026 renovation finally addressed the dated lobby and pool deck. Rooms are next (phased through 2027). Best pick in Palmetto Dunes for people who want a full-service resort with a kids' program and don't want to cook.",
        },
        {
          name: 'Marriott Grande Ocean',
          meta: 'Palmetto Dunes · Villa resort · 2 BR standard',
          blurb:
            "Timeshare-adjacent, but don't let that scare you off. Units are spacious, grounds are impeccable, and the beach access is the shortest walk on the island. We book it for families of 4-6 who want space without renting a standalone villa.",
        },
        {
          name: 'The Inn & Club at Harbour Town',
          meta: "Sea Pines · Golf-trip-first property",
          blurb:
            "The dedicated golf hotel adjacent to the resort. Smaller, quieter, with a staff that knows every member tee-time ritual by heart. If your trip is 70% golf, book here and save the resort points.",
        },
        {
          name: 'Palmera Inn & Suites',
          meta: 'Mid-island · Value pick',
          blurb:
            "A quietly excellent mid-tier hotel two minutes from Coligny. Not oceanfront, but clean, well-run, and half the price of the resorts. We send people here for short family trips where the room is a place to sleep, not hang out.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: "Depends what you're optimizing for.",
      accent: 'zinc',
      items: [
        {
          name: 'Sonesta Resort Hilton Head Island',
          meta: 'Shipyard · Bigger groups · Mixed reviews by building',
          blurb:
            "Ask us which room block before you book. Some wings are genuinely great; others are overdue. Good for groups of 20+ who need convention-style meeting space plus beach access.",
        },
        {
          name: 'Beach House, a Holiday Inn Resort',
          meta: 'Coligny · Walk to everything',
          blurb:
            "The location is unbeatable if you want to ditch the car. The rooms are what they are. A 2010-era renovation coasting a little too long. Works for weekend getaways and honest family-on-a-budget trips.",
        },
        {
          name: "Spinnaker Resorts (Egret Point, Waterside)",
          meta: 'Shipyard & Bluffton · Timeshare units rented nightly',
          blurb:
            "Good units, honestly. The catch is the sales pressure if you engage with the front desk. Skip the \"welcome briefing\" and you're fine. Strong value for families who want a kitchen.",
        },
        {
          name: 'Inn at Harbour Town: standard rooms (pre-renovation wings)',
          meta: 'Sea Pines · Specific room-block caution',
          blurb:
            "Blocks 300 and 400 are still pre-renovation. If you book this hotel, specifically request blocks 100 or 200. We tell every client the same thing, and the hotel will honor the request 90% of the time.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Skip in 2026',
      subtitle: "Previously defensible, now not. We'll explain on the phone.",
      accent: 'rose',
      items: [
        {
          name: 'Redacted VRBO program. Forest Beach mid-rise',
          meta: 'Management change Q4 2025',
          blurb:
            "The previous manager sold to a larger operator late last year. Service quality has cratered since. We've pulled four clients out mid-trip. Happy to name it on a planning call; we won't put it in print.",
        },
        {
          name: 'Any oceanfront condo building north of Folly Field',
          meta: 'Location problem, not property problem',
          blurb:
            "Good buildings, wrong side of the island for most trips. You'll drive 20 minutes to every dinner reservation. Only makes sense if you're here purely for the beach and don't plan to leave the sand.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "What's actually new in 2026",
    },
    {
      kind: 'p',
      html: "Beyond the rankings, three developments are reshaping the island this year:",
    },
    {
      kind: 'h3',
      text: 'The Omni refresh',
    },
    {
      kind: 'p',
      html: "After years of the lobby feeling like a 2004 time capsule, the Omni Palmetto Dunes finished its common-area overhaul in early 2026. The new pool deck is genuinely the best on the island now. Better than Sea Pines. With a swim-up bar that doesn't feel like a compromise. Rooms are phased through 2027, so ask which floor you're on.",
    },
    {
      kind: 'h3',
      text: 'Harbour Town Inn, finally',
    },
    {
      kind: 'p',
      html: "The Sea Pines Resort finally addressed the Harbour Town Inn in 2025. Rooms went from \"oldest hotel product on the island\" to \"quietly the best small hotel we book.\" The location was always there; now the rooms match. Rates jumped 20% to match the quality. It's still worth it.",
    },
    {
      kind: 'h3',
      text: 'Bluffton is the stealth move',
    },
    {
      kind: 'p',
      html: "We're sending more clients to Bluffton this year than ever. Montage Palmetto Bluff aside, the new boutique inventory in Old Town Bluffton, especially around Calhoun Street, offers a quieter, more adult trip at 60% of Sea Pines pricing. The drive onto Hilton Head is 18 minutes. Worth considering for couples and foodie trips.",
    },
    {
      kind: 'h2',
      text: 'Booking strategy for 2026',
    },
    {
      kind: 'p',
      html: "A few rules we apply to every booking:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Summer (June-August):</strong> 5-6 months out for villa inventory, 3-4 months for resorts. If you're reading this in May planning for July, call us immediately.",
        "<strong>Fall golf (September-early November):</strong> 2-3 months out is fine for most resorts, but Harbour Town tee-time blocks lock 4 months ahead.",
        "<strong>Heritage week (RBC Heritage, second week of April):</strong> Rates double. Worth it once in your life, but we'll quietly suggest the week before or after.",
        "<strong>Thanksgiving & Christmas week:</strong> Surprisingly open and surprisingly cheap. The weather is genuinely pleasant (55-65°F). One of the best-value windows on the island.",
        "<strong>Spring break (mid-March to mid-April):</strong> Book in November if you want anything oceanfront.",
      ],
    },
    {
      kind: 'callout',
      label: "When it's worth hiring us",
      html: "If your trip is under $4k total, you don't need a consultant. Use this list, book direct, and email us with specific questions. If your trip is $8k+ or involves a group of 8+, we probably save you more than our fee through vendor relationships and rate negotiation. Honest answer every time.",
    },
    {
      kind: 'h2',
      text: 'The one question we get every week',
    },
    {
      kind: 'p',
      html: "\"Should I book direct or through VRBO/Airbnb?\" The answer in 2026: <strong>book direct through the resort for resorts, and through a local rental company for villas. Never through VRBO or Airbnb for a Hilton Head villa if you can avoid it.</strong>",
    },
    {
      kind: 'p',
      html: "The big platforms don't vet the on-island service. When the AC breaks at 9pm on a Saturday in July, the listing on VRBO has no meaningful recourse. A local rental company has a tech on-call and a phone number that answers. We'll name the four companies we trust on a planning call.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head lodging by neighborhood, at a glance',
    },
    {
      kind: 'p',
      html: "A compressed view of who should stay where, what you'll pay in peak weeks, and how long it takes to reach the beach from the door. Use it to narrow the short-list; use the tiers above to pick the specific property.",
    },
    {
      kind: 'table',
      caption: 'Where to stay on Hilton Head Island: 2026 snapshot',
      headers: ['Neighborhood', 'Best for', 'Property types', 'Avg weekly villa (peak)', 'To the beach'],
      rows: [
        ['Sea Pines', 'Couples, golfers, first-timers', '3 resorts + 400+ villas', '$4,500-9,000', '2-15 min walk or bike'],
        ['Palmetto Dunes', 'Families, long stays', 'Omni, Marriott, 200+ villas', '$3,500-8,000', '2-10 min walk'],
        ['Forest Beach', '3-5 day trips, walkability', 'Condos, small resorts', '$2,500-5,000', 'Walking distance'],
        ['Shelter Cove', 'Couples, date nights', 'Marina condos, timeshares', '$2,000-4,000', '5 min drive'],
        ['Mid-island / Shipyard', 'Budget, short stays', 'Hotels (Palmera, Sonesta)', '$1,500-3,500', '5-10 min drive'],
        ['Bluffton / Palmetto Bluff', 'Anniversaries, quiet escape', 'Montage, boutique inns', '$4,000-12,000', '18-25 min drive'],
      ],
    },
    {
      kind: 'p',
      html: "For neighborhood deep-dives, see the <a href=\"/hilton-head/sea-pines\">Sea Pines</a>, <a href=\"/hilton-head/palmetto-dunes\">Palmetto Dunes</a>, <a href=\"/hilton-head/forest-beach\">Forest Beach</a>, and <a href=\"/hilton-head/shelter-cove\">Shelter Cove</a> guides. For Bluffton, see the <a href=\"/bluffton-travel-planner\">Bluffton travel planner</a>.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head lodging: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Should I stay in Sea Pines or Palmetto Dunes?',
          a: 'Sea Pines for couples, golfers, and first-timers who want the iconic Hilton Head experience (Harbour Town, lighthouse, best restaurants within the gate). Palmetto Dunes for families with kids who want a full-service resort, kids\u2019 programming, and three golf courses on one plantation. Both are S-tier; they attract different travelers.',
        },
        {
          q: 'What is the best resort on Hilton Head Island?',
          a: 'The Inn & Club at Harbour Town is our default S-tier pick as of 2026, following its 2025 renovation. For families, the Omni Hilton Head in Palmetto Dunes just completed its 2026 lobby and pool refresh. For ultra-luxury, Montage Palmetto Bluff (20 minutes off-island in Bluffton) sets the service bar for the region.',
        },
        {
          q: 'How early should I book a Hilton Head villa?',
          a: 'Summer weeks (June-August): 5-6 months out for oceanfront villas, 3-4 for resorts. RBC Heritage week (April 13-19, 2026): 9-10 months out. October (our favorite window): 3-4 months. Winter and early December: two weeks out is usually fine. Spring break: 4-5 months out.',
        },
        {
          q: 'Is VRBO or Airbnb safe to book on Hilton Head?',
          a: 'Technically yes, practically no. The big platforms do not vet on-island service. When the AC fails on a Saturday night in July, there is no meaningful recourse through the listing. Local Hilton Head rental companies have tech staff on call and a phone number that answers. Book through a local rental manager whenever possible.',
        },
        {
          q: 'What is the cheapest neighborhood to stay in on Hilton Head?',
          a: 'Mid-island hotels (Palmera Inn, Beach House) run 40-50% below resort rates and work well for 3-5 day trips where the room is just a place to sleep. Forest Beach is the best-value walkable neighborhood for short stays. In winter, Palmetto Dunes villas drop 50-55% below summer peak.',
        },
        {
          q: 'Is Bluffton a good alternative to staying on Hilton Head?',
          a: 'Increasingly, yes. Bluffton and Palmetto Bluff sit 18-25 minutes off-island and run 40-60% below Sea Pines pricing on comparable properties. Montage Palmetto Bluff is genuinely the best service experience in the region. For couples, quiet weekends, and foodie trips, Bluffton is often the stealth move. See the <a href="/bluffton-travel-planner">Bluffton travel planner</a>.',
        },
        {
          q: 'What does a Sea Pines gate pass cost?',
          a: 'Sea Pines charges $10 per car, per day for non-resort-guest entry. If you stay inside Sea Pines (resort or villa) the pass is included in your rate. The pass is valid for the day and lets you come and go.',
        },
        {
          q: 'Which hotel on Hilton Head is walking distance to the beach?',
          a: 'Inside Sea Pines: Harbour Town Inn and Inn & Club at Harbour Town (short walk or bike to South Beach). Palmetto Dunes: Omni Hilton Head (direct access). Forest Beach: Beach House Holiday Inn Resort (across the street). Coligny: Palmera Inn & Suites is a short walk. All four handle beach access in under 10 minutes door-to-sand.',
        },
        {
          q: 'Are pets allowed at Hilton Head villas?',
          a: 'About 25-30% of private villas accept dogs, with pet fees ranging from $150-400 per stay. Resort hotels are stricter: the Omni and Beach House allow dogs under 50 lbs with advance notice; Sea Pines resort hotels generally do not. Beach rules: dogs are allowed on Hilton Head beaches with a leash from April through September before 10 a.m. and after 5 p.m.',
        },
        {
          q: 'Do I need to rent a car on Hilton Head?',
          a: 'For most trips, yes. The island is 12 miles long and Uber/Lyft coverage is thin after 9 p.m. The exception: if you stay in Forest Beach within walking distance of Coligny Plaza, you can get by without a car for a 3-5 day trip, using bikes and occasional rideshare for dinner reservations elsewhere on the island.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head lodging around the right window',
    },
    {
      kind: 'p',
      html: "Where you stay shapes your trip more than any other single decision. If you want us to match the right property to your group, calendar, and budget, see the <a href=\"/itinerary\">$450 itinerary service</a> or jump to the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas planner</a>. For timing questions, the <a href=\"/blog/best-time-to-visit-hilton-head\">Hilton Head weather guide</a> walks through all 12 months with rates, crowds, and water temps.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 2) TIER LIST. Restaurants
// ---------------------------------------------------------------------------

const postRestaurantsRanked: Post = {
  slug: 'hilton-head-restaurants-ranked-2026',
  title: 'Hilton Head Restaurants, Ranked: The 2026 Local Tier List',
  excerpt:
    "Forget the TripAdvisor top 20. These are the restaurants locals actually eat at. Ranked S through C with honest reviews and what to order.",
  description:
    "Tier-ranked: the best restaurants on Hilton Head in 2026. Where to eat, what to order, and the spots locals quietly skip. Honest reviews.",
  category: 'Dining',
  readTime: '10 min',
  publishedAt: '2026-02-21',
  updatedAt: '2026-04-10',
  author: 'Hilton Ahead',
  featuredOrder: 2,
  relatedNeighborhoods: ['shelter-cove', 'sea-pines', 'forest-beach'],
  keywords: [
    'best restaurants Hilton Head',
    'Hilton Head restaurants',
    'Skull Creek Boathouse review',
    'Harbour Town restaurants',
    'Hilton Head dining',
    'where to eat Hilton Head 2026',
  ],
  body: [
    {
      kind: 'p',
      html: "7:38 p.m. on a Thursday in late June. The host is telling you the wait is ninety minutes, and the table you actually wanted was at the place two doors down. Every visitor's guide to Hilton Head restaurants reads the same — the same twenty places, in a different order, with the same shrimp-and-grits descriptions. This isn't that list. This is the tier list we keep in our heads when we plan a trip.",
    },
    {
      kind: 'p',
      html: "This is the tier list we actually keep in our heads when we plan a trip. The same one we'd text a friend. Ranked by the food first, then the experience, then how hard the reservation is. No kickbacks, no sponsored slots.",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: "If you're only eating here once, eat here.",
      accent: 'gold',
      items: [
        {
          name: 'Skull Creek Boathouse',
          meta: "Squire Pope Rd · Waterfront · $$$ · Reservation required in summer",
          blurb:
            "The sunset table at Skull Creek is still the best single experience on the island. Order the grouper reuben at lunch, the whole local flounder at dinner. Book the 7pm slot on the Dock Bar side. We can usually get this table; not everyone can.",
        },
        {
          name: 'Red Fish',
          meta: "Archer Rd · Fine dining · $$$$ · Book 2 weeks out",
          blurb:
            "The best refined dinner on the island, full stop. The chef changes the menu weekly around what's local and in-season. The wine list is absurdly deep. Order the tasting menu; it's always the move.",
        },
        {
          name: "Michael Anthony's",
          meta: "Orleans Rd · Italian · $$$ · Tough reservation",
          blurb:
            "Destination-level Italian that locals defend with religious intensity. The osso buco is a ten-year-consistent order. If the answer is yes to \"can we get Michael Anthony's tonight?\". Cancel your other plans.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: "Real-deal places we send everybody.",
      accent: 'primary',
      items: [
        {
          name: 'FARM Bluffton',
          meta: "Old Town Bluffton · New American · $$$",
          blurb:
            "Worth the 20-minute drive. Seasonal menu, heavy local-farm sourcing, and a wine list that punches above what Bluffton should have. The summer peach salad is a ritual.",
        },
        {
          name: 'Ela\'s On The Water',
          meta: "Shelter Cove · Mediterranean · $$$ · Sunset views",
          blurb:
            "Marina views, octopus done right, and a staff that will actually describe the fish instead of reading the menu at you. Request a patio table at sunset. It's why you came.",
        },
        {
          name: 'Hudson\'s on the Docks',
          meta: "Squire Pope Rd · Waterfront · $$",
          blurb:
            "If Skull Creek is fully booked, this is where we go. The shrimp come off boats docked 30 feet away. No pretense, no nonsense, perfect for a Tuesday at 6pm with the in-laws.",
        },
        {
          name: "The Studio",
          meta: "Pope Ave · Small plates · $$$ · Bar seats only",
          blurb:
            "The best bar to eat dinner at on the island. Ten seats, open kitchen, chef chats with you. The lamb meatballs are the most-ordered dish five years running. Walk-in only.",
        },
        {
          name: 'Old Fort Pub',
          meta: "Skull Creek · Historic · $$$",
          blurb:
            "The sleeper pick for a special-occasion dinner. 1978-era building, giant oak trees, sunset over Skull Creek. Service is uneven on busy Saturdays but the food holds. Order the she-crab soup.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: "Good at their job. Specific use-cases.",
      accent: 'zinc',
      items: [
        {
          name: "Harbour Town Bakery & Café",
          meta: "Harbour Town · Breakfast · $",
          blurb:
            "The best breakfast stop on the south end. Get the ham biscuit. Eat it on a bench facing the lighthouse. This is a $7 tradition that beats $40 hotel breakfasts.",
        },
        {
          name: "Quarterdeck Harbour Town",
          meta: "Harbour Town · Waterfront · $$$",
          blurb:
            "Tourist-forward but still good. Works for groups of 8+ where you need a predictable menu and a marina view. Don't go out of your way for it.",
        },
        {
          name: "A Lowcountry Backyard",
          meta: "Pope Ave · Comfort food · $$",
          blurb:
            "The \"shrimp and grits for people who don't know where else to get shrimp and grits.\" It's fine. Actually more than fine. But not a destination. Great if you're three blocks away and hungry.",
        },
        {
          name: "Ombra Cucina Italiana",
          meta: "Park Plaza · Italian · $$$",
          blurb:
            "The second-best Italian on the island. Smaller, quieter, easier reservation than Michael Anthony's. Kitchen has range. Order the risotto of the day.",
        },
        {
          name: "Lucky Rooster",
          meta: "Palmetto Bay Marina · Southern · $$$",
          blurb:
            "Chef-y Southern food with the prices to match. Some dishes are stellar, others are trying too hard. Good for a couple's night when you don't want to drive to Bluffton.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'C-Tier',
      subtitle: "Fine for what they are. Don't build a night around them.",
      accent: 'zinc',
      items: [
        {
          name: "Jack's on the Harbor",
          meta: "Shelter Cove · American · $$",
          blurb:
            "Serviceable. Works if you're staying at Shelter Cove and want to walk to dinner. Nothing memorable on the menu.",
        },
        {
          name: "Salty Dog Café",
          meta: "South Beach Marina · Family-forward · $$",
          blurb:
            "Tourist institution. The food is fine, the t-shirts are the business. Bring kids here once, buy a t-shirt, don't come back.",
        },
        {
          name: 'Any oceanfront hotel restaurant',
          meta: "All resorts · $$$-$$$$",
          blurb:
            "Convenience tax is 40%. Walk to a real restaurant instead. The island is small enough to justify it.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "Reservations. The real game",
    },
    {
      kind: 'p',
      html: "Everything above B-tier requires a reservation in summer. Everything S-tier requires a reservation two weeks ahead in peak weeks. A few specifics:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Skull Creek:</strong> Resy releases at 30 days. Set an alarm. The 6:45-7:15pm window is what you want.",
        "<strong>Red Fish:</strong> Call directly. The host is excellent at finding slots if you're flexible. Thursday and Sunday are easier than Friday/Saturday.",
        "<strong>Michael Anthony's:</strong> 2 weeks out minimum. If it says \"fully booked\" online, call anyway. They hold tables.",
        "<strong>FARM Bluffton:</strong> OpenTable, 3 weeks out for weekends. Weeknight walk-ins are sometimes possible at the bar.",
      ],
    },
    {
      kind: 'callout',
      label: "When we get involved",
      html: "For clients on a full trip plan, we hold the 7pm Skull Creek table before you arrive. Same for Red Fish and Michael Anthony's. This alone is why a lot of our clients think our fee pays for itself.",
    },
    {
      kind: 'h2',
      text: "Lunch is the sleeper meal",
    },
    {
      kind: 'p',
      html: "The best lunch values on the island are wildly under-appreciated. Skull Creek's grouper reuben, Hudson's fried shrimp basket, Harbour Town Bakery's ham biscuit. All three are better than 90% of the dinner scene, at a third the price. Budget more for lunch than you think you need to.",
    },
    {
      kind: 'h2',
      text: "What about Bluffton?",
    },
    {
      kind: 'p',
      html: "Short answer: worth the drive, once per trip, for dinner. FARM Bluffton is the obvious move. The Pearl is a quieter alternative. Cottage Café does a perfect casual lunch if you're already over there shopping. See the <a href=\"/bluffton-travel-planner\">Bluffton travel planner</a> for a full food-first itinerary.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head dining at a glance',
    },
    {
      kind: 'p',
      html: "A quick-pick matrix by occasion. Full blurbs on each restaurant are in the tier lists above. Price tiers are per-person dinner, pre-tax, pre-tip: $ = under $25, $$ = $25-50, $$$ = $50-85, $$$$ = $85+.",
    },
    {
      kind: 'table',
      caption: 'Hilton Head & Bluffton: the right restaurant for the occasion',
      headers: ['Occasion', 'Top pick', 'Price', 'Reservation lead time'],
      rows: [
        ['Waterfront seafood + sunset', 'Skull Creek Boathouse', '$$$', '3-4 weeks in peak season'],
        ['Upscale fine dining', "Michael Anthony's", '$$$$', '2-3 weeks'],
        ['Lowcountry / shrimp & grits', 'Red Fish', '$$$', '2-3 weeks'],
        ['Dock-style casual', "Hudson's Seafood House", '$$', '1-2 weeks'],
        ['Best-in-region (Bluffton)', 'FARM Bluffton', '$$$$', '3 weeks (weekend)'],
        ['Date night, quieter', "Ela's on the Water (Shelter Cove)", '$$$', '1-2 weeks'],
        ['Walkable family dinner', 'Poseidon (Shelter Cove)', '$$', 'Walk-in most nights'],
        ['Best breakfast', 'Harbour Town Bakery', '$', 'Walk-in'],
        ['Best lunch value', 'Skull Creek grouper reuben', '$$', 'Walk-in'],
        ['Kid-friendly with view', 'The Crazy Crab (Jarvis Creek)', '$$', 'Walk-in OK'],
      ],
    },
    {
      kind: 'h2',
      text: 'Hilton Head restaurants: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'What is the best seafood restaurant on Hilton Head?',
          a: "Skull Creek Boathouse for waterfront seafood with a sunset, Red Fish for refined Lowcountry seafood, Hudson's for dock-casual fried and raw bar. Skull Creek is the tourist default; Red Fish is the local pick for a serious meal.",
        },
        {
          q: 'What are the hardest dinner reservations to get on Hilton Head?',
          a: "In order: Skull Creek Boathouse (30-day Resy drop, set an alarm), Michael Anthony's (2-3 weeks, call directly), Red Fish (2-3 weeks, call), FARM Bluffton (3 weeks for weekends). During RBC Heritage week (April 13-19, 2026), all four jump to 4+ weeks lead time.",
        },
        {
          q: 'Do I need to book restaurants in advance on Hilton Head?',
          a: "In summer and during Heritage week, yes, for anything above B-tier. Off-season (November-March), weeknight walk-ins are usually fine at all but Michael Anthony's. Our rule: if the restaurant takes reservations, book it at least a week out in peak months.",
        },
        {
          q: 'Are kids welcome at Hilton Head\u2019s best restaurants?',
          a: "Most yes: Skull Creek, Hudson's, The Crazy Crab, Poseidon, and Ela's on the Water all welcome children and have kids' menus. Michael Anthony's and Red Fish are kid-tolerant but quieter; better for children 10+. The one consistent exception is FARM Bluffton, which is calibrated for adults.",
        },
        {
          q: 'What is the dress code at Hilton Head restaurants?',
          a: "Resort casual almost everywhere. Collared shirt for men at dinner at Michael Anthony's, Red Fish, and the Montage. Shorts and flip-flops are fine at Skull Creek, Hudson's, Poseidon, and Harbour Town Bakery. No restaurant on the island requires a jacket.",
        },
        {
          q: 'Where is the best breakfast on Hilton Head?',
          a: 'Harbour Town Bakery (ham biscuits, pastries, coffee with a lighthouse view), Hilton Head Social Bakery (French croissants, counter seating), and the Sea Shack (breakfast tacos, griddle staples). All three are walk-in, all three beat hotel breakfast buffets.',
        },
        {
          q: 'What is the best restaurant on Hilton Head for an anniversary or proposal?',
          a: "Three answers: Michael Anthony's for in-town fine dining, Red Fish for Lowcountry romance with an excellent wine list, and the May River Grill at Montage Palmetto Bluff for the regional S-tier experience. For proposals specifically, book the Harbour Town Lighthouse deck for a pre-dinner drink.",
        },
        {
          q: 'Which Hilton Head restaurants have the best sunset views?',
          a: "Skull Creek Boathouse (Broad Creek, west-facing), Hudson's Seafood House (Skull Creek, north-facing), Ela's on the Water (Shelter Cove marina), and The Rooftop at Poseidon. Request \"water-side\" or \"deck\" on your reservation and arrive 45 minutes before sunset for the table transition.",
        },
        {
          q: 'Is FARM Bluffton worth the drive from Hilton Head?',
          a: "Yes, once per trip. FARM is the single best restaurant in the region and Bluffton is 18-25 minutes from most Hilton Head lodging. Book a weekend dinner 3 weeks out or a Thursday walk-in at the bar. Pair with a walk around Old Town Bluffton beforehand.",
        },
        {
          q: 'Can I walk in at Hilton Head\u2019s best restaurants?',
          a: "The bar seats at Michael Anthony's, Red Fish, Skull Creek, and Ela's all accept walk-ins. Arrive right at 5 p.m. or between 8:30-9:30 p.m. for the highest success rate. Full dining-room walk-ins are essentially impossible in peak season.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head dining week around the reservations',
    },
    {
      kind: 'p',
      html: "Dinner reservations are the hardest-to-solve piece of a Hilton Head trip. If you want us to lock in the four S-tier tables before you arrive, the <a href=\"/itinerary\">$450 itinerary service</a> includes reservation handling. For everyday casual options outside the tier list, browse <a href=\"/local/restaurants\">our restaurants directory</a>. For timing questions, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather and best time guide</a> shows which weeks have the tightest booking windows.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 3) TIER LIST. Things to do
// ---------------------------------------------------------------------------

const postThingsToDoRanked: Post = {
  slug: 'hilton-head-things-to-do-ranked-2026',
  title: "Things to Do on Hilton Head, Ranked: The 2026 Tier List",
  excerpt:
    "The activities worth doing, the activities worth skipping, and the one tourist trap everyone falls for. A local's tier list for 2026.",
  description:
    "Ranked: the best things to do on Hilton Head Island in 2026. Beaches, boats, bikes, tours, and the tourist traps worth skipping.",
  category: 'Activities',
  readTime: '9 min',
  publishedAt: '2026-01-30',
  updatedAt: '2026-04-15',
  author: 'Hilton Ahead',
  featuredOrder: 3,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'things to do Hilton Head',
    'Hilton Head activities',
    'Hilton Head dolphin tour',
    'Hilton Head bike rental',
    'Hilton Head kayak',
    "Hilton Head with kids",
  ],
  body: [
    {
      kind: 'p',
      html: "The \"Top 10 Things to Do on Hilton Head\" lists are stuffed with filler. They have to fill the list even if #8 is a waste of three hours. This one isn't. If an activity is in C-tier, we'll tell you why.",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: "Do these. Every trip.",
      accent: 'gold',
      items: [
        {
          name: 'Sunrise walk to Dragon Tree (Sea Pines)',
          meta: "Free · 45 min · South Forest Beach or Sea Pines access",
          blurb:
            "The oldest live oak on the island, dripping Spanish moss, glowing at 7am. Walk there before the beach fills. Takes 15 min from Harbour Town. Easiest \"core memory\" on the island, costs nothing.",
        },
        {
          name: 'Dolphin cruise with Captain Mark (Harbour Town)',
          meta: "$85/adult · 90 min · Private charter recommended",
          blurb:
            "The biggest quality gap between operators is enormous. Captain Mark runs small-group cruises that actually find dolphins and actually teach you about them. Everybody else does the same loop and calls it a day. Ask for him by name. Full breakdown of every operator and tour style in our <a href=\"/blog/hilton-head-dolphin-tours\">Hilton Head dolphin tours guide</a>.",
        },
        {
          name: 'Bike ride from Coligny to Sea Pines (beach at low tide)',
          meta: "Free · 2 hours · Rent from Hilton Head Bicycle",
          blurb:
            "The single best way to understand Hilton Head geographically. Rent at Coligny, ride the hard sand at low tide south to Sea Pines, grab lunch at South Beach Marina, ride back. Don't skip this.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: "Strong additions if you have the time.",
      accent: 'primary',
      items: [
        {
          name: 'Kayak or paddleboard Broad Creek (Outside Hilton Head)',
          meta: "$55/person · 2 hours · Calibogue Cue trip is the upgrade",
          blurb:
            "Outside Hilton Head (the local outfitter) runs small-group creek tours. The 7am slot is magical. Fog, herons, and zero boat traffic. Skip the bigger operators; they bunch groups of 20. See the <a href=\"/blog/hilton-head-kayaking-guide\">Hilton Head kayaking guide</a> for every route, tour-vs-rental call, and the bioluminescence option in summer.",
        },
        {
          name: 'Sunset sail on a private charter',
          meta: "$500-$1,200 · 2 hours · Calibogue Sound",
          blurb:
            "A splurge that's worth it for couples and groups of 4. We book through two captains we trust. The public sunset cruises feel like a bus; a private sail feels like the Caribbean.",
        },
        {
          name: 'Coastal Discovery Museum',
          meta: "Free · 1-2 hours · Indigo Run",
          blurb:
            "Genuinely interesting for kids 8+. The butterfly garden in summer is underrated. Not a full-day activity, but a solid rainy-afternoon move.",
        },
        {
          name: 'Fishing charter (offshore half-day)',
          meta: "$900-$1,400 · 4-6 hours · 4 person max typical",
          blurb:
            "Worth it for the dads' trip or a father-daughter thing. We work with two captains. Both have private docks and actually find fish. The marina-board operators are hit-or-miss.",
        },
        {
          name: 'Pinckney Island National Wildlife Refuge',
          meta: "Free · 2-3 hours · Hike and birding",
          blurb:
            "A 15-minute drive off-island for a genuinely wild experience. Alligators, egrets, no tourists. Weekday mornings only.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: "Good in the right context.",
      accent: 'zinc',
      items: [
        {
          name: 'Gregg Russell kids concert (Harbour Town Liberty Oak)',
          meta: "Free · Nightly in summer · Bring bug spray",
          blurb:
            "A genuine island institution. Kids love it; adults tolerate it. Worth one night if you have children under 10. Bring chairs. The oak gets crowded.",
        },
        {
          name: 'Harbour Town Lighthouse climb',
          meta: "$5 · 15 min · Spiral staircase, 114 steps",
          blurb:
            "The view is real, the exhibits are dated. Go for the photo at the top, not the museum. Avoid on rainy afternoons. The line is brutal.",
        },
        {
          name: 'Tennis or pickleball clinics (Palmetto Dunes, Sea Pines)',
          meta: "$60-$150/session · 1-2 hours",
          blurb:
            "Palmetto Dunes tennis is as good as any resort program in the country. Sea Pines pickleball has exploded. Book a clinic with a named pro; the rec staff is a mixed bag.",
        },
        {
          name: 'Horseback riding (Lawton Stables, Sea Pines)',
          meta: "$95/person · 1 hour · Ages 8+",
          blurb:
            "Beautiful ride through the Sea Pines forest preserve. Not scenic enough for adults without kids. Kids love it. It's photographable.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'C-Tier. Skip',
      subtitle: "What you'll be tempted by and shouldn't do.",
      accent: 'rose',
      items: [
        {
          name: 'Pirate-themed dinner cruise',
          meta: "$85/adult · 90 min · Shelter Cove",
          blurb:
            "The boat is fine. The food is not. The entertainment is loud. If you must, do the afternoon sightseeing version. No food, no theater, same boat.",
        },
        {
          name: 'Segway island tours',
          meta: "$95/person · 90 min",
          blurb:
            "You're riding past strip malls. There's a better bike version of this for $35.",
        },
        {
          name: 'Most \"haunted history\" ghost tours',
          meta: "$40/person · 75 min",
          blurb:
            "The island is 400 years of Indigenous, Gullah, and Civil War history. The ghost tour reduces it to cheap jump-scares. Pay for a real history tour at the Coastal Discovery Museum instead.",
        },
        {
          name: 'Any \"pick your own seashell\" commercial tour',
          meta: "$60/person · 2 hours",
          blurb:
            "Seashells are free. You can pick them yourself, at low tide, from your hotel. This is the purest tourist trap on the island.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "Activity strategy for a 7-day trip",
    },
    {
      kind: 'p',
      html: "A good week on Hilton Head looks like this:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Day 1:</strong> Arrive, beach, dinner nearby. Don't over-program day 1.",
        "<strong>Day 2:</strong> Bike ride + lunch at South Beach Marina. Afternoon beach.",
        "<strong>Day 3:</strong> Morning kayak or dolphin cruise. Lazy afternoon.",
        "<strong>Day 4:</strong> Golf or tennis morning (one member). Beach day for the rest. Dinner in Bluffton.",
        "<strong>Day 5:</strong> Sunrise walk to Dragon Tree. Coastal Discovery Museum if weather turns. Sunset sail.",
        "<strong>Day 6:</strong> Flex day. Fishing charter, pickleball clinic, or pool-and-book day.",
        "<strong>Day 7:</strong> Harbour Town morning, ham biscuit, photo at the lighthouse, then fly home.",
      ],
    },
    {
      kind: 'callout',
      label: "What we actually do for you",
      html: "We pre-book the activities that matter (Captain Mark's dolphin cruise, the 7am kayak slot, the good fishing captain) and leave the flex days flex. Nothing is worse than a five-activity day where the kids melt down by 2pm.",
    },
    {
      kind: 'h2',
      text: "Best time of year, by activity",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Beach:</strong> Late May through early October. Water is swimmable.",
        "<strong>Golf:</strong> March-May and September-November. Perfect weather, course conditions.",
        "<strong>Fishing:</strong> April-June for inshore, August-October for offshore.",
        "<strong>Biking:</strong> Year-round. Shoulder seasons (April, October) are ideal.",
        "<strong>Dolphin cruises:</strong> Year-round. Summer is highest-density; fall trips are quieter and still productive.",
        "<strong>Birding / Pinckney:</strong> October-March. Migration windows are spectacular.",
      ],
    },
    {
      kind: 'h2',
      text: 'Activity booking lead times and costs',
    },
    {
      kind: 'p',
      html: "The fastest-booking activities go four to six weeks ahead of peak-week dates. Everything else is one-to-two-weeks or walk-in. A compressed view:",
    },
    {
      kind: 'table',
      caption: 'Hilton Head activities: booking window, season, and typical cost',
      headers: ['Activity', 'Booking lead time (peak)', 'Best season', 'Typical cost'],
      rows: [
        ['Private dolphin cruise (Captain Mark)', '4-6 weeks', 'Year-round', '$85/adult'],
        ['Private sunset sail (charter)', '3-4 weeks', 'April-October', '$500-1,200'],
        ['Offshore fishing charter', '4-6 weeks', 'April-October', '$900-1,400'],
        ['Kayak Broad Creek (Outside HH)', '1-2 weeks', 'Year-round (7 a.m. slot best)', '$55/person'],
        ['Bike rental', 'Walk-in most days', 'Year-round', '$20-30/day'],
        ['Horseback ride (Lawton Stables)', '1 week', 'Year-round (ages 8+)', '$95/person'],
        ['Harbour Town Lighthouse climb', 'Walk-in', 'Year-round', '$5'],
        ['Coastal Discovery Museum', 'Walk-in', 'Year-round (rainy-day fallback)', 'Free'],
        ['Pinckney Island Refuge', 'Walk-in (weekday morning)', 'October-March', 'Free'],
        ['Tennis or pickleball clinic', '1-2 weeks', 'Year-round', '$60-150/session'],
        ['RBC Heritage grounds pass', '9-10 months', 'April 13-19, 2026', '$55-85/day'],
      ],
    },
    {
      kind: 'h2',
      text: 'Hilton Head activities: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'What is the single best thing to do on Hilton Head Island?',
          a: 'For most visitors: a dawn bike ride on the hard sand at low tide, from Coligny to Sea Pines. Free, 90 minutes, and the single most Hilton Head moment on the island. Rent from Hilton Head Bicycle the afternoon before so you can start at sunrise.',
        },
        {
          q: 'What are the best free things to do on Hilton Head?',
          a: 'The sunrise walk to Dragon Tree (the oldest live oak on the island), the Coligny-to-Sea Pines low-tide beach bike ride, Pinckney Island National Wildlife Refuge (15 minutes off-island), the Coastal Discovery Museum, Harbour Town sunset, and beach days at Coligny or Forest Beach. None of these cost a dollar.',
        },
        {
          q: 'What is the best dolphin tour on Hilton Head?',
          a: "Captain Mark\u2019s small-group dolphin cruise out of Harbour Town. The quality gap between operators is enormous; Captain Mark actually finds dolphins, actually teaches you about them, and keeps groups small. Everybody else runs the same loop with 40-person boats. Ask for him by name when booking. For the full operator breakdown by tour style (catamaran, sunset, zodiac, kayak), see our <a href=\"/blog/hilton-head-dolphin-tours\">Hilton Head dolphin tours guide</a>.",
        },
        {
          q: 'How much does a Hilton Head sunset sail cost?',
          a: 'Public sunset cruises run $45-65/person on 30-person boats. A private charter for up to 6 runs $500-1,200 for two hours on Calibogue Sound. For couples or groups of 4+, the private charter is almost always the better value; it feels like the Caribbean instead of a bus.',
        },
        {
          q: 'Is Sea Pines Forest Preserve worth visiting?',
          a: 'Yes, especially early morning. The preserve is 605 acres of maritime forest with sandy trails, the occasional alligator, and near-zero crowds before 9 a.m. Start at the Lawton Stables trailhead. Entry is included with a Sea Pines gate pass ($10/day).',
        },
        {
          q: 'What are the best things to do on Hilton Head with kids?',
          a: "Coastal Discovery Museum, the Gregg Russell concert at Harbour Town (free, nightly in summer), horseback rides at Lawton Stables for ages 8+, dolphin cruise with Captain Mark, beach days with boogie boards at Coligny or Folly Field, and the Pirate's Cove mini-golf course. See the <a href=\"/blog/hilton-head-with-kids\">Hilton Head with kids guide</a> for a full 7-day family plan.",
        },
        {
          q: 'Can you swim in the ocean at Hilton Head?',
          a: "Yes, from late May through October. Peak water temperature is 84\u00b0F in July-August. October is the sweet spot: water still 73\u00b0F, crowds gone, rates 30-40% below summer. For monthly water temperatures, see the <a href=\"/blog/best-time-to-visit-hilton-head\">Hilton Head weather guide</a>.",
        },
        {
          q: 'What is the best thing to do when it rains on Hilton Head?',
          a: 'Coastal Discovery Museum (butterfly garden, indoor exhibits, genuinely good for kids 8+), the Sandbox Interactive Children\u2019s Museum, the Arts Center of Coastal Carolina, or a pickleball clinic under a covered court. Summer afternoon thunderstorms typically clear in 30-60 minutes; plan beach time for morning and rainy-day backups for 3-5 p.m.',
        },
        {
          q: 'Do I need to book Hilton Head activities in advance?',
          a: 'For peak weeks (summer, Heritage, Thanksgiving): dolphin cruises 4-6 weeks out, fishing charters 4-6 weeks, private sunset sails 3-4 weeks, kayak tours 1-2 weeks. Off-season (November-March): most activities are walk-in or one-week lead time. Bikes, the lighthouse, and Pinckney never need a booking.',
        },
        {
          q: 'Is the Harbour Town Lighthouse worth the climb?',
          a: 'For the photo at the top, yes. For the museum exhibits, not really. Go early morning (no line, soft light) or right before sunset. Skip rainy afternoons; the stairwell is a bottleneck. Cost is $5 and takes 15 minutes.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head activity week around the right bookings',
    },
    {
      kind: 'p',
      html: "A good Hilton Head week balances two or three booked activities with four or five open days. If you want us to lock Captain Mark, the 7 a.m. kayak slot, and the right fishing captain before you arrive, the <a href=\"/itinerary\">$450 itinerary service</a> includes activity bookings. For timing, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather guide</a> maps each activity to its best month, and our <a href=\"/events\">Hilton Head events calendar</a> shows what's on while you're here.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 4) Sea Pines neighborhood guide
// ---------------------------------------------------------------------------

const postSeaPines: Post = {
  slug: 'sea-pines-guide',
  title: "The Sea Pines Guide: Villas, Bike Paths, and the Best Sunsets",
  excerpt:
    "Sea Pines is the largest and most famous neighborhood on Hilton Head. Here's how to pick the right pocket of it for your trip.",
  description:
    "A local's guide to Sea Pines on Hilton Head. Which villa area to pick, the best bike paths and restaurants, and what the 2026 changes mean.",
  category: 'Neighborhoods',
  readTime: '11 min',
  publishedAt: '2026-01-15',
  updatedAt: '2026-04-05',
  author: 'Hilton Ahead',
  featuredOrder: 4,
  relatedNeighborhoods: ['sea-pines'],
  keywords: [
    'Sea Pines guide',
    'Sea Pines villas',
    'Harbour Town',
    'South Beach Marina',
    'Sea Pines restaurants',
    'Hilton Head neighborhoods',
  ],
  body: [
    {
      kind: 'p',
      html: "Sea Pines is where the island started. In 1956 Charles Fraser drew lines on a napkin and invented the American master-planned resort community. Seventy years later it's 5,200 acres of forest, beach, two marinas, three golf courses, and the most recognizable lighthouse in the Southeast. It's also confusing to first-timers. Here's how to decode it.",
    },
    {
      kind: 'h2',
      text: "The five pockets of Sea Pines",
    },
    {
      kind: 'p',
      html: "\"I'm staying in Sea Pines\" means five very different things depending on which pocket. Each has a feel and a use-case.",
    },
    {
      kind: 'h3',
      text: '1. Harbour Town',
    },
    {
      kind: 'p',
      html: "The postcard. Iconic red-and-white lighthouse, yacht-lined marina, Liberty Oak with live music most nights. Best for couples, first-timers, and anyone who wants to be where the energy is. Villas here walk to dinner — see our shortlist of <a href=\"/harbour-town-villas\">Harbour Town villa picks</a>. Downside: busiest parking, highest rates, cruise-port feel at peak hour.",
    },
    {
      kind: 'p',
      html: "Book here if: you want the lighthouse-view experience and don't mind paying a premium for it.",
    },
    {
      kind: 'h3',
      text: '2. South Beach Marina',
    },
    {
      kind: 'p',
      html: "The quieter, lowercase-c cool cousin of Harbour Town. One mile south, still in Sea Pines. Salty Dog Café lives here (skip it), but Quarterdeck and Salty Dog T-Shirt Factory make a walkable afternoon. Pickleball courts, bike rentals, Calibogue Sound sunsets. The bike path along South Beach Lane hits actual beach access at the end.",
    },
    {
      kind: 'p',
      html: "Book here if: you want the Sea Pines experience without the Harbour Town crowd. This is our most-recommended pocket for families of 4.",
    },
    {
      kind: 'h3',
      text: '3. North Sea Pines (Baynard Cove, Ocean Gate, Turtle Lane)',
    },
    {
      kind: 'p',
      html: "The residential core. Big live oaks, winding roads, older single-family villas. Quiet. The beach access points are unmarked but excellent. Beach Cat 9, 10, and 11 are the locals' favorites. No commercial buildings; you drive to dinner.",
    },
    {
      kind: 'p',
      html: "Book here if: you're a multi-generational family that wants a huge house, private pool, and quiet. Don't book here if you want to walk to anything.",
    },
    {
      kind: 'h3',
      text: '4. The Plantation Club / Club Course area',
    },
    {
      kind: 'p',
      html: "The golf-first quadrant. Wraps Heron Point and Ocean Course. Smaller villas, often with golf-course views. Not oceanfront. Best for golf trips where the tee time is the point and the beach is a day-two thing.",
    },
    {
      kind: 'p',
      html: "Book here if: you're a golf-first party of 4-6 looking to save 30% vs. oceanfront.",
    },
    {
      kind: 'h3',
      text: '5. The Beach Club / Inn area',
    },
    {
      kind: 'p',
      html: "The resort hotel spine. Guest rooms, the Beach Club restaurant, pools, and the main beach access everyone uses. If you stay at the Sea Pines Resort proper, you're here.",
    },
    {
      kind: 'p',
      html: "Book here if: you want hotel service, no cooking, and don't need a kitchen.",
    },
    {
      kind: 'h2',
      text: "Getting in and around",
    },
    {
      kind: 'p',
      html: "Sea Pines has a controlled entrance. $9 per car per visit, waived for overnight guests. The one gate backs up in July/August from 10am to 12pm. Enter before 9am or after 1pm if you can.",
    },
    {
      kind: 'p',
      html: "Inside, everything connects by bike path. 17 miles of them. Renting bikes is a near-mandatory move. We use Hilton Head Bicycle (they'll deliver). You can bike from Harbour Town to South Beach in 18 minutes.",
    },
    {
      kind: 'h2',
      text: "What to eat in Sea Pines",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Harbour Town Bakery</strong>. Breakfast, $. The ham biscuit, always. Eat outside.",
        "<strong>Quarterdeck</strong>. Lunch or dinner, $$$. Marina view, tourist-friendly, predictable menu. Fine for groups.",
        "<strong>CQ's</strong>. Dinner, $$$. Restaurant Row-era chophouse feel. Holds up. Reservation required.",
        "<strong>The Salty Dog Café</strong>. Lunch, $$. Here for the t-shirts, not the food.",
        "<strong>The Links, an American Grill</strong>. Dinner, $$$$. At the Inn & Club at Harbour Town. Quiet upscale. Best for pre-round dinners.",
      ],
    },
    {
      kind: 'callout',
      label: "Where we send clients for dinner",
      html: "Sea Pines has solid in-plantation options but. Honestly. The best dinners on the island are outside its gates. Skull Creek, Red Fish, and Michael Anthony's are all 12-18 minutes away. We plan trips where 2 of 7 nights are in-plantation and the rest are island-wide.",
    },
    {
      kind: 'h2',
      text: "Bike paths worth knowing",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Harbour Town to South Beach Marina</strong>. 2.5 miles, one way. The signature ride. Do it at low tide, take the beach path the last half-mile.",
        "<strong>The Forest Preserve loop</strong>. 4 miles. Spanish moss, zero traffic, actually quiet. Enter near Lawton Stables.",
        "<strong>Ocean to Ocean loop</strong>. 6 miles. North beach to south beach via Sea Pines's interior. A half-day ride; pack water.",
      ],
    },
    {
      kind: 'h2',
      text: "Sea Pines with kids",
    },
    {
      kind: 'p',
      html: "It's built for them. Playgrounds at Lawton Stables. Gregg Russell free concert under the Liberty Oak nightly in summer. Pickleball and tennis clinics. The beach on the South Beach side is calm (south-facing, less surf). Most families are happier here than at a full resort because the villa gives them space to collapse between activities.",
    },
    {
      kind: 'h2',
      text: "What the 2026 changes mean",
    },
    {
      kind: 'p',
      html: "Two things changed for 2026 in Sea Pines. First, the Harbour Town Inn renovation finally wrapped. Rooms are legitimately good now, rates jumped 20%. Second, the resort rolled out a new villa management portal that lets you pre-book tennis and beach chairs from your phone. Worth 10 minutes of your arrival day.",
    },
    {
      kind: 'h2',
      text: "Who Sea Pines isn't for",
    },
    {
      kind: 'p',
      html: "Sea Pines is premium. If your trip budget is under $4k total, you'll get more house and more value in Palmetto Dunes or Forest Beach. If you want nightlife or a walkable mid-island restaurant scene, stay mid-island instead. Sea Pines goes to sleep early.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 5) Palmetto Dunes neighborhood guide
// ---------------------------------------------------------------------------

const postPalmettoDunes: Post = {
  slug: 'palmetto-dunes-guide',
  title: "Palmetto Dunes Guide: Golf, Lagoons, and Family Rentals",
  excerpt:
    "Three championship courses, 11 miles of lagoons, and some of the island's most family-friendly rentals. Here's what to know before you book.",
  description:
    "A local's guide to Palmetto Dunes on Hilton Head. Golf courses, villa picks, the Omni renovation, and how it differs from Sea Pines.",
  category: 'Neighborhoods',
  readTime: '9 min',
  publishedAt: '2026-02-05',
  updatedAt: '2026-04-08',
  author: 'Hilton Ahead',
  featuredOrder: 5,
  relatedNeighborhoods: ['palmetto-dunes'],
  keywords: [
    'Palmetto Dunes guide',
    'Palmetto Dunes villas',
    'Omni Hilton Head',
    'Palmetto Dunes golf',
    'Hilton Head family vacation',
    'Marriott Grande Ocean',
  ],
  body: [
    {
      kind: 'p',
      html: "Palmetto Dunes is the mid-island answer to Sea Pines. It's smaller, newer, flatter, and almost entirely purpose-built around two things: golf and families. If Sea Pines is old-money-coastal, Palmetto Dunes is efficient-family-vacation. That's a compliment.",
    },
    {
      kind: 'h2',
      text: "What makes Palmetto Dunes different",
    },
    {
      kind: 'p',
      html: "Three things you get here that you don't get at Sea Pines:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>One of the country's best resort tennis programs.</strong> Palmetto Dunes' is rated in the US top 10 for a resort, and it earns it. The pros are actual pros; the court count is the island's largest.",
        "<strong>Three championship golf courses in one property.</strong> Robert Trent Jones, Fazio, and Arthur Hills. All walkable from most villas. The Fazio is the most challenging; the Hills is the most forgiving.",
        "<strong>11 miles of lagoons.</strong> Kayakable, stand-up paddleboardable, great for kids. Alligators live here. Don't let the dog swim.",
      ],
    },
    {
      kind: 'h2',
      text: "Where to stay inside Palmetto Dunes",
    },
    {
      kind: 'h3',
      text: 'Omni Hilton Head Oceanfront Resort',
    },
    {
      kind: 'p',
      html: "The flagship hotel. Just finished a lobby and pool-deck renovation in 2026. Genuinely one of the best pool decks on the island now. Room renovations are phased through 2027. Oceanfront rooms first, garden view second, pool view third in priority. If you're booking for 2026, request a floor 4+.",
    },
    {
      kind: 'h3',
      text: 'Marriott Grande Ocean',
    },
    {
      kind: 'p',
      html: "Two-bedroom timeshare-style units, rentable nightly. Best beach-walk distance in Palmetto Dunes (closest of any building). The grounds crew clearly does not take a day off. A staple for families of 4-6 who want space without going full villa.",
    },
    {
      kind: 'h3',
      text: 'Single-family villas',
    },
    {
      kind: 'p',
      html: "The oceanfront villa lanes. Mooring Buoy, Sea Oaks, Shelter Cove Way. Are where the serious bookings live. Five-bedroom houses with private pools, steps from the sand. These are rented through the resort's villa program and a small group of independent managers. Quality is high but variable; we point clients toward four buildings we know firsthand from walking the property.",
    },
    {
      kind: 'h3',
      text: 'Budget villa areas',
    },
    {
      kind: 'p',
      html: "Interior Palmetto Dunes. Queens Grant, Stoney Creek, the older condo buildings. Drops the price by 40% for second-row lodging. Still walkable to the beach (10 min). Good for families who mostly use the lodging to sleep.",
    },
    {
      kind: 'h2',
      text: "Where to eat (with caveats)",
    },
    {
      kind: 'p',
      html: "The honest take: Palmetto Dunes is not a dining destination. It's an activity destination. The in-plantation restaurants are convenience-priced and just okay.",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Dunes House</strong>. Beachfront bar & grill. Fine for a beach-day lunch. Don't go out of your way.",
        "<strong>Alexander's</strong>. Near the Omni. The best of the in-plantation options. Holds up for a casual dinner.",
        "<strong>The Big Jim</strong>. Omni's main restaurant. Breakfast is solid; dinner is hit-or-miss.",
      ],
    },
    {
      kind: 'p',
      html: "For anything better, you drive 8-12 minutes to Shelter Cove (Ela's, Jack's) or 15 minutes to the north-end (Skull Creek, Hudson's).",
    },
    {
      kind: 'h2',
      text: "Golf in Palmetto Dunes",
    },
    {
      kind: 'p',
      html: "Three courses, one booking system, one caveat. For the wider Hilton Head picture, see <a href=\"/local/golf\">our golf directory</a>.",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Robert Trent Jones Oceanfront</strong>. The signature. Hole 10 plays to the beach. Book this first, 60+ days out.",
        "<strong>Fazio</strong>. The toughest. Windy, water-in-play, not for beginners. Excellent conditioning.",
        "<strong>Arthur Hills</strong>. The fun one. Shorter, more forgiving, still interesting. Good for mixed-handicap groups.",
      ],
    },
    {
      kind: 'p',
      html: "The caveat: all three book through the same tee sheet, and summer mornings (before 10am) are genuinely competitive. If you want 8am at RTJ in July, lock it 75 days out.",
    },
    {
      kind: 'h2',
      text: "Tennis and pickleball",
    },
    {
      kind: 'p',
      html: "The Palmetto Dunes Tennis Center is a legitimate reason to choose this neighborhood. 23 clay courts, 8 pickleball courts, clinics twice daily. Family camps in summer. Drop the kids for 2 hours, hit the beach. Book the daily camps 2 weeks out for July.",
    },
    {
      kind: 'h2',
      text: "Lagoons. The underrated move",
    },
    {
      kind: 'p',
      html: "The Outside Hilton Head outfitter operates out of Shelter Cove next door. A 90-minute lagoon kayak at 7am is one of the most underrated activities on the island. Mist, herons, occasional alligator sightings at a safe distance, and you're back in time for breakfast.",
    },
    {
      kind: 'h2',
      text: "Palmetto Dunes vs. Sea Pines. The honest comparison",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Stay in Palmetto Dunes if:</strong> golf or tennis is a real part of the trip, you have kids 6-14, you want a full-service resort option.",
        "<strong>Stay in Sea Pines if:</strong> you want the iconic Hilton Head experience, you care about walkability to dining, you want a more \"adult\" feel.",
      ],
    },
    {
      kind: 'p',
      html: "It's very common for our repeat clients to alternate. Palmetto Dunes for the family summer week, Sea Pines for the couples' fall getaway.",
    },
    {
      kind: 'callout',
      label: "2026 specific",
      html: "The Omni renovation is the biggest news. If your last stay was pre-2025, the pool deck is now worth staying at the Omni just to use. If you want a room that matches, book a renovated floor (4 and up as of spring 2026). Ask us which room numbers specifically.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 6) Forest Beach neighborhood guide
// ---------------------------------------------------------------------------

const postForestBeach: Post = {
  slug: 'forest-beach-guide',
  title: "Forest Beach Guide: Walkable, Affordable, and Underrated",
  excerpt:
    "The best base for a short trip. Walking distance to Coligny, real beach access, and the most value in mid-island rentals.",
  description:
    "A local's guide to Forest Beach on Hilton Head: walking to Coligny Plaza, mid-island rentals, and why it's the best value for 3-5 day trips.",
  category: 'Neighborhoods',
  readTime: '7 min',
  publishedAt: '2026-02-18',
  updatedAt: '2026-04-12',
  author: 'Hilton Ahead',
  featuredOrder: 6,
  relatedNeighborhoods: ['forest-beach'],
  keywords: [
    'Forest Beach guide',
    'Coligny Plaza',
    'Hilton Head budget travel',
    'Forest Beach rentals',
    'walkable Hilton Head neighborhoods',
  ],
  body: [
    {
      kind: 'p',
      html: "Forest Beach is the overlooked middle child of Hilton Head's neighborhoods. No gate, no resort fees, no 19-hole \"plantation\" branding. It's a dense, walkable mid-island stretch with direct beach access, a functioning commercial plaza (Coligny), and the best per-dollar value on the island for 3-5 day trips.",
    },
    {
      kind: 'h2',
      text: "Why we send short-trip clients here",
    },
    {
      kind: 'p',
      html: "Four reasons:",
    },
    {
      kind: 'ol',
      items: [
        "<strong>You can ditch the car.</strong> Most Forest Beach condos are within a 10-minute walk of Coligny Plaza (restaurants, beach, shops). For a 3-night trip, you save $300 in rental-car-time-in-traffic.",
        "<strong>Real beach access.</strong> Coligny Beach Park is the only beach on the island with full-service amenities. Bathrooms, showers, food, lifeguards. Best single beach access on Hilton Head.",
        "<strong>Value.</strong> A 2BR oceanfront condo in Forest Beach in June runs $3,200/week. The equivalent in Sea Pines runs $5,500.",
        "<strong>No gate tax.</strong> Sea Pines charges $9 per car, per day, for guests. Forest Beach doesn't. Over a week, that's $63 per rental car.",
      ],
    },
    {
      kind: 'h2',
      text: "The three pockets of Forest Beach",
    },
    {
      kind: 'h3',
      text: 'North Forest Beach',
    },
    {
      kind: 'p',
      html: "Between the Marriott Beach Resort (Shipyard edge) and Coligny. High-density condo buildings. Sea Crest, The Atrium, Villamare. Walkable to Coligny. Beach access via your condo's private boardwalk. Best value pocket.",
    },
    {
      kind: 'h3',
      text: 'South Forest Beach',
    },
    {
      kind: 'p',
      html: "The stretch from Coligny down toward Sea Pines gate. More single-family homes, some mid-rise condos. Quieter than North, slightly longer walk to restaurants. The Beach House Holiday Inn lives here.",
    },
    {
      kind: 'h3',
      text: 'Coligny Beach immediate area',
    },
    {
      kind: 'p',
      html: "Right on top of the plaza. Loudest and most active. Best if you have teens who will wander to get ice cream twice a night on their own.",
    },
    {
      kind: 'h2',
      text: "Coligny Plaza. What's actually there",
    },
    {
      kind: 'p',
      html: "Coligny is the only real retail plaza on the island. Honest take: the food is middling (tourist-forward), but the convenience is unbeatable. For dinners worth driving to, see <a href=\"/local/restaurants\">our restaurants directory</a>. What's worth knowing:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Skillets Café</strong>. Breakfast. Lines by 9am. Go at 7:30 or 10:30.",
        "<strong>A Lowcountry Backyard</strong>. Lunch. Shrimp & grits without the resort pricing.",
        "<strong>Coligny Theatre</strong>. Movies. Rainy day lifesaver.",
        "<strong>The Sandbox children's museum</strong>. Kids under 8. Worth 90 minutes.",
        "<strong>Pretty much all the gift shops</strong>. Skip, unless you need sunscreen or a phone charger.",
      ],
    },
    {
      kind: 'h2',
      text: "Beach access. The specifics",
    },
    {
      kind: 'p',
      html: "Coligny Beach Park is the headline access. Free parking (though it fills by 9am in summer), full amenities. In addition, every condo in Forest Beach has a private boardwalk access. So if you're staying there, you walk out your back door to the sand.",
    },
    {
      kind: 'p',
      html: "The beach at Forest Beach is wider at low tide than the Sea Pines side. The sand compacts well for bike rides. Lifeguards at Coligny in summer.",
    },
    {
      kind: 'h2',
      text: "Dining beyond Coligny",
    },
    {
      kind: 'p',
      html: "A 5-minute drive opens up the island. From Forest Beach you can reach:",
    },
    {
      kind: 'ul',
      items: [
        "Michael Anthony's (6 min)",
        "Red Fish (9 min)",
        "Skull Creek Boathouse (14 min)",
        "Old Fort Pub (16 min)",
        "Shelter Cove dining (7 min)",
      ],
    },
    {
      kind: 'h2',
      text: "Who Forest Beach is for",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Short-trip travelers</strong> (3-5 days) who want walkable access and good value.",
        "<strong>Budget-conscious families</strong> who want beach-front without resort fees.",
        "<strong>Couples' getaways</strong> who want to walk to dinner and not drive.",
        "<strong>First-time visitors</strong> who want the island's most accessible neighborhood.",
      ],
    },
    {
      kind: 'h2',
      text: "Who it's not for",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Golfers.</strong> You'll drive to every course. Stay at Palmetto Dunes or Sea Pines.",
        "<strong>Quiet-seekers.</strong> Coligny stays active until 11pm in summer.",
        "<strong>Large groups</strong> (10+). Forest Beach has few single-family homes big enough.",
      ],
    },
    {
      kind: 'callout',
      label: "Our Forest Beach default pick",
      html: "For a couple or family of 4 on a 4-night summer trip, we default to a 2BR oceanfront condo in the Sea Crest or Villamare buildings. Walking distance to Coligny, private beach boardwalk, $3,200-$3,800/week, and we know the managers personally. If budget flexes up, we upgrade to single-family on South Forest Beach Lane.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 7) Shelter Cove neighborhood guide
// ---------------------------------------------------------------------------

const postShelterCove: Post = {
  slug: 'shelter-cove-guide',
  title: "Shelter Cove Guide: Marina Views and Date-Night Dinners",
  excerpt:
    "Quiet, elegant, and built for couples. Here's how to string together a Shelter Cove weekend without leaving the marina.",
  description:
    "A local's guide to Shelter Cove on Hilton Head. Marina lodging, four of the island's best dinners, sunset cruises, and the quietest pocket for couples.",
  category: 'Neighborhoods',
  readTime: '7 min',
  publishedAt: '2026-03-03',
  updatedAt: '2026-04-10',
  author: 'Hilton Ahead',
  featuredOrder: 7,
  relatedNeighborhoods: ['shelter-cove'],
  keywords: [
    'Shelter Cove guide',
    'Shelter Cove marina',
    'Hilton Head couples trip',
    'Palmetto Bay Marina',
    "Ela's On The Water",
    'Shelter Cove dining',
  ],
  body: [
    {
      kind: 'p',
      html: "Shelter Cove is the adult pocket of Hilton Head. No theme-park signage, no beach crowds, no spring-break vibe. It's a marina, a handful of hotels and condos, four of the island's best dinners, and sunset views that rival the Mediterranean. If you're on a couples' trip and don't need a beach day every day, this is the move.",
    },
    {
      kind: 'h2',
      text: "What is Shelter Cove, exactly?",
    },
    {
      kind: 'p',
      html: "Shelter Cove is a 200-acre marina-centric development on the north side of the island, facing Broad Creek rather than the ocean. Calling it a \"neighborhood\" is a stretch. It's really one large marina with the buildings arranged around it. But for trip-planning purposes, it's a distinct place with a distinct feel.",
    },
    {
      kind: 'h2',
      text: "Where to stay",
    },
    {
      kind: 'h3',
      text: 'Disney Hilton Head Island Resort',
    },
    {
      kind: 'p',
      html: "Underrated option for families. Open to non-Disney-Vacation-Club members in most seasons. Pool, kids' program, and a free shuttle to their private beach house on the ocean side. The Disney service standard translates. Expensive.",
    },
    {
      kind: 'h3',
      text: 'Shelter Cove Towers',
    },
    {
      kind: 'p',
      html: "Two high-rise residential buildings with rentable condos. Floor-to-ceiling marina views. Best sunset in any hotel room on the island. 2-bedroom units start around $2,800/week off-season, $4,500 in summer.",
    },
    {
      kind: 'h3',
      text: 'Beach House, a Holiday Inn Resort (edge of Shelter Cove)',
    },
    {
      kind: 'p',
      html: "Technically Forest Beach-adjacent but people lump it with Shelter Cove. Beach-side, not marina-side. Budget-friendly. Best for a 2-night add-on when you don't want to spend on a villa.",
    },
    {
      kind: 'h2',
      text: "Eating in Shelter Cove. The main event",
    },
    {
      kind: 'p',
      html: "This is why people come. Four restaurants, tightly clustered, each worth a dinner:",
    },
    {
      kind: 'h3',
      text: "Ela's On The Water",
    },
    {
      kind: 'p',
      html: "Our default Shelter Cove pick. Mediterranean-leaning menu, marina views, strongest wine-by-the-glass program in the pocket. Order the octopus, then whatever fish the server recommends. Request a patio table at sunset.",
    },
    {
      kind: 'h3',
      text: "Jack's on the Harbor",
    },
    {
      kind: 'p',
      html: "Serviceable American. Walks-up-and-in on weekdays. Works if Ela's is full. Menu is wider, execution is B+.",
    },
    {
      kind: 'h3',
      text: "WiseGuys",
    },
    {
      kind: 'p',
      html: "Steakhouse with a Miami-ish lean. Loud bar scene, booming wine program, competent steak. Not subtle. Works for date night if you want \"scene.\" Reservation required.",
    },
    {
      kind: 'h3',
      text: "San Miguel's",
    },
    {
      kind: 'p',
      html: "Casual Mexican, waterfront patio. Best margaritas in the pocket. Works for a lazy lunch or a low-pressure couples' dinner.",
    },
    {
      kind: 'h2',
      text: "Activities in Shelter Cove",
    },
    {
      kind: 'h3',
      text: 'Sunset sail or dolphin cruise',
    },
    {
      kind: 'p',
      html: "The marina is where most of the island's <a href=\"/local/water-activities\">water-activity operators</a> run from. Sunset sail on a 41-foot catamaran. The Vagabond Cruise. Is the obvious move. 90 minutes, BYOB, typically 10-12 people.",
    },
    {
      kind: 'h3',
      text: 'The shopping at Shelter Cove Towne Centre',
    },
    {
      kind: 'p',
      html: "Walkable outdoor plaza with mid-tier retail (Belk, Aerie, mid-range boutiques) and a Kroger for grocery stocking. Rainy-day bailout for trips where one person wants to shop.",
    },
    {
      kind: 'h3',
      text: 'Summer concert series (June-August)',
    },
    {
      kind: 'p',
      html: "Free Tuesday and Thursday night concerts on the marina lawn from June through August. Bring a blanket and wine. Genuinely one of the best low-key evenings you can have on the island.",
    },
    {
      kind: 'h2',
      text: "Shelter Cove as a base. The tradeoff",
    },
    {
      kind: 'p',
      html: "You're staying on a marina, not a beach. The ocean is a 6-minute drive. For a couples' trip, that's a feature. You get beach days without the beach-side crowds. For a kids' trip, it's a friction. The hotel-to-sand routine adds 15 minutes each way.",
    },
    {
      kind: 'callout',
      label: "Our Shelter Cove play",
      html: "For a 3-4 night couples' trip in fall, we often book Shelter Cove Towers for the marina view, plan a beach morning to Singleton Beach (5 min away), a sunset sail one night, and dinners at Ela's, FARM Bluffton (off-island), and Red Fish. Zero golf, zero resort program, zero kids. That's the Shelter Cove recipe.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 8) Hilton Head golf trip
// ---------------------------------------------------------------------------

const postGolfTrip: Post = {
  slug: 'hilton-head-golf-trip',
  title: "Planning a Hilton Head Golf Trip: Tee Times, Lodging, Logistics",
  excerpt:
    "Four-guy golf trips, ten-guy corporate outings, once-in-a-lifetime Harbour Town pilgrimages. Here's how to book each one.",
  description:
    "Planning a Hilton Head golf trip: the best courses ranked, how to land a Harbour Town tee time, where to stay, and corporate outing logistics.",
  category: 'Golf',
  readTime: '11 min',
  publishedAt: '2026-02-12',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 8,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes'],
  keywords: [
    'Hilton Head golf trip',
    'Harbour Town golf',
    'RBC Heritage',
    'Palmetto Dunes golf',
    'Hilton Head tee times',
    'golf trip Hilton Head 2026',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head has 24 golf courses across three clusters (Sea Pines, Palmetto Dunes, Bluffton). More golf per square mile than any resort island in America. The problem isn't finding <a href=\"/local/golf\">the courses</a>. It's figuring out which four to play, which order, and how to sequence lodging so you're not driving across the island between rounds.",
    },
    {
      kind: 'h2',
      text: "The only four courses that matter on a first trip",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Harbour Town Golf Links</strong>. Sea Pines. Host of the RBC Heritage. A pilgrimage. $480+ in season. Book first.",
        "<strong>Robert Trent Jones Oceanfront</strong>. Palmetto Dunes. Hole 10 plays to the Atlantic. The other signature course on the island. $220.",
        "<strong>Atlantic Dunes (formerly Ocean Course)</strong>. Sea Pines. Davis Love III redesign, opened 2016. Strong conditioning, underrated layout. $180.",
        "<strong>May River Golf Club</strong>. Palmetto Bluff, Bluffton. 20 min drive. Jack Nicklaus design, one of the best private-quality experiences in the Southeast. Resort guests only. $275.",
      ],
    },
    {
      kind: 'h2',
      text: "How to book Harbour Town",
    },
    {
      kind: 'p',
      html: "The mechanics matter. Harbour Town is bookable 90 days out. In peak season (March-May, September-early November), the 8am-10am slots go in the first hour. Three rules:",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Stay at the Sea Pines Resort.</strong> Resort guests get preferential booking windows (120 days out) and better rates ($420 vs $480). This alone is why guys with 4-person trips default to The Inn & Club at Harbour Town.",
        "<strong>Avoid Heritage week (second week of April).</strong> Rates double, course is closed to public for tournament. Great to watch; not to play.",
        "<strong>Go in October.</strong> Weather is perfect, courses are in peak post-summer conditioning, rates are 25% below spring peaks.",
      ],
    },
    {
      kind: 'h2',
      text: "The three lodging strategies",
    },
    {
      kind: 'h3',
      text: 'Strategy 1: All-golf, Sea Pines resort',
    },
    {
      kind: 'p',
      html: "Stay at The Inn & Club at Harbour Town. Play Harbour Town, Atlantic Dunes, Heron Point, and add one off-property course. 4 rounds in 4 days, walk to dinner, sleep 30 feet from the first tee. Simplest logistics, highest per-night cost.",
    },
    {
      kind: 'h3',
      text: 'Strategy 2: Variety, Palmetto Dunes base',
    },
    {
      kind: 'p',
      html: "Stay at the Omni or a Palmetto Dunes villa. Play RTJ Oceanfront, Fazio, Arthur Hills in-plantation, then drive to Harbour Town for the big day. Works for 6-8 person trips that need villa space. 10 min drive each way.",
    },
    {
      kind: 'h3',
      text: 'Strategy 3: The stealth move. Palmetto Bluff / Bluffton',
    },
    {
      kind: 'p',
      html: "Stay at Montage Palmetto Bluff or an Old Town Bluffton boutique. Play May River, Old South, Belfair, and make Harbour Town a day trip. Best food, best service, lowest crowd density. 20 min drive to Sea Pines. A real consideration.",
    },
    {
      kind: 'h2',
      text: "Corporate / large-group logistics",
    },
    {
      kind: 'p',
      html: "Groups of 12+ need specific attention. Key moves:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Book tee-time blocks, not individual slots.</strong> Most courses will hold 3-5 foursomes at once for groups of 12-20 if you book 6 months out through the group desk.",
        "<strong>Use a shotgun start where possible.</strong> RTJ and Atlantic Dunes will do shotguns for 20+ players, some Tuesday-Thursday mornings.",
        "<strong>Book transportation.</strong> Charter buses from your lodging to each course. Nobody should be driving a group of 4 in a golf cart across the island.",
        "<strong>Lock the dinner reservation the same day as the tee times.</strong> Skull Creek Boathouse can accommodate groups of 30. We book those 4 months out.",
      ],
    },
    {
      kind: 'h2',
      text: "What you actually pay",
    },
    {
      kind: 'p',
      html: "Mid-range 4-person, 4-night golf trip in October 2026, Sea Pines-based:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Lodging:</strong> 3-bedroom Sea Pines villa, $3,200 total ($800/person).",
        "<strong>Golf:</strong> 4 rounds × $250 avg × 4 players = $4,000 ($1,000/person).",
        "<strong>Dining:</strong> 4 dinners + 4 lunches × 4 = ~$1,600 ($400/person).",
        "<strong>Drinks/incidentals:</strong> $500 ($125/person).",
        "<strong>Transportation (rental cars):</strong> $600 ($150/person).",
        "<strong>Total:</strong> ~$9,900 / $2,475 per person.",
      ],
    },
    {
      kind: 'p',
      html: "Peak-season (April or July) versions of the same trip run 30-40% higher. For prebuilt stay-and-play options, see our <a href=\"/hilton-head-golf-packages\">Hilton Head golf packages</a>.",
    },
    {
      kind: 'h2',
      text: "What most golfers get wrong",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Playing too much.</strong> 4 rounds in 4 days is plenty. A fifth round is a chore; it hurts the fourth round retroactively.",
        "<strong>Ignoring the non-Harbour-Town Sea Pines courses.</strong> Heron Point and Atlantic Dunes are both better than 80% of golf elsewhere in America.",
        "<strong>Booking the same tee time every day.</strong> Mix 8am rounds with 1pm rounds. Lets you sleep, eat lunch, and avoid the heat.",
        "<strong>Dinner after golf.</strong> After 18 in the sun, you want a 7:30 reservation, not 9pm. Book accordingly.",
      ],
    },
    {
      kind: 'callout',
      label: "When we step in",
      html: "For golf trips, we add value in four specific ways: (1) we have tee-time holds at Harbour Town through a partnership, (2) we book the group-rate dinners before you arrive, (3) we handle the villa selection to match the golf schedule, (4) we manage transportation. A typical corporate outing saves $2k-$4k vs. retail through us, plus four hours of logistics.",
    },
    {
      kind: 'h2',
      text: "The RBC Heritage pilgrimage",
    },
    {
      kind: 'p',
      html: "Second week of April, every year. The only full-field PGA Tour event in the Lowcountry. If you've never been: go once. Grounds pass $55, hospitality $1,800. Tournament village is genuinely well-run; course is walkable in a 2-hour loop. We plan Heritage-week trips every year and they're always the easiest sell.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 9) Best time to visit Hilton Head
// ---------------------------------------------------------------------------

const postBestTime: Post = {
  slug: 'best-time-to-visit-hilton-head',
  title: "Hilton Head Weather by Month. The Best Time to Visit in 2026.",
  excerpt:
    "A month-by-month guide to Hilton Head weather, water temperatures, hurricane risk, and the four travel windows locals actually plan trips around.",
  description:
    "A month-by-month guide to Hilton Head weather. Temperatures, ocean temps, hurricane risk, and the four travel windows locals plan trips around in 2026.",
  category: 'Planning',
  readTime: '11 min',
  publishedAt: '2026-03-02',
  updatedAt: '2026-05-01',
  author: 'Hilton Ahead',
  featuredOrder: 2.5,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  coverImage: {
    src: 'https://images.unsplash.com/photo-1631845085830-10c38cc98ac8?auto=format&fit=crop&w=1800&q=80',
    alt: 'Harbour Town Lighthouse and dock at golden hour, Hilton Head Island',
  },
  keywords: [
    'Hilton Head weather',
    'Hilton Head weather by month',
    'best time to visit Hilton Head',
    'Hilton Head water temperature',
    'Hilton Head ocean temperature',
    'Hilton Head hurricane season',
    'Hilton Head weather October',
    'Hilton Head weather June',
    'Hilton Head weather March',
    'when to visit Hilton Head',
    'Hilton Head shoulder season',
    'cheapest time to visit Hilton Head',
    'Hilton Head rainfall',
    'Hilton Head climate',
  ],
  body: [
    {
      kind: 'p',
      html: "It's 71° on Hilton Head this morning and the beach is almost empty. It's also a Wednesday in October — the answer most people don't think to ask. The standard advice (\"come in summer\") is exactly wrong for most of our clients. The island has four genuinely different weather seasons, and picking the right window cuts your trip cost by 40%, adds three hours of beach time per day, and swaps a 90-minute airport-to-villa drive for a 25-minute one. Here's the honest month-by-month read we walk every client through before they book.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>The best time to visit Hilton Head is mid-October.</strong> Ocean water still averages 73\u00b0F, days sit at a dry 75-80\u00b0F, hurricane risk has passed, and lodging rates run 30-40% below summer peak. If school calendars lock you into summer, book mid-June. For golf, <a href=\"/hilton-head-golf-packages\">early May or late October</a>. For families at <a href=\"/hilton-head-spring-break\">spring break</a>, the second half of March.",
    },
    {
      kind: 'embed',
      component: 'trip-window-finder',
    },
    {
      kind: 'section',
      eyebrow: '01 \u00b7 Right now',
      title: 'Live conditions and the 12-month average',
      summary: "Today on the island plus 30-year NOAA averages by month \u2014 high, low, ocean, rainy days, crowds.",
      defaultOpen: true,
      blocks: [
        {
          kind: 'embed',
          component: 'live-weather',
        },
        {
          kind: 'p',
          html: "The Lowcountry sits on the same latitude as Casablanca. Winters are mild, summers are hot and humid, and the Atlantic moderates both ends. Averages here are built from 30-year NOAA data at the nearby Savannah station, adjusted for the 2-3\u00b0F warmer ocean signal Hilton Head reads right on the coast. Want a single page per month? See our <a href=\"/hilton-head-weather\">Hilton Head weather guide by month</a>.",
        },
        {
          kind: 'table',
          caption: "Hilton Head Island: average weather by month",
          headers: ['Month', 'Avg High', 'Avg Low', 'Ocean Temp', 'Rainy Days', 'Crowd Level'],
          rows: [
            ['January',   '58\u00b0F', '41\u00b0F', '55\u00b0F', '8',  'Very low'],
            ['February',  '61\u00b0F', '43\u00b0F', '55\u00b0F', '8',  'Very low'],
            ['March',     '67\u00b0F', '49\u00b0F', '60\u00b0F', '8',  'Low \u2192 rising'],
            ['April',     '74\u00b0F', '55\u00b0F', '67\u00b0F', '7',  'Moderate (Heritage spike)'],
            ['May',       '81\u00b0F', '63\u00b0F', '74\u00b0F', '6',  'Moderate'],
            ['June',      '87\u00b0F', '71\u00b0F', '80\u00b0F', '10', 'Peak'],
            ['July',      '90\u00b0F', '74\u00b0F', '84\u00b0F', '12', 'Peak'],
            ['August',    '89\u00b0F', '73\u00b0F', '84\u00b0F', '13', 'Peak'],
            ['September', '85\u00b0F', '69\u00b0F', '80\u00b0F', '10', 'Moderate'],
            ['October',   '77\u00b0F', '59\u00b0F', '73\u00b0F', '7',  'Low'],
            ['November',  '70\u00b0F', '50\u00b0F', '65\u00b0F', '6',  'Low (Thanksgiving spike)'],
            ['December',  '62\u00b0F', '43\u00b0F', '58\u00b0F', '7',  'Low (holidays lift)'],
          ],
        },
        {
          kind: 'p',
          html: "Browse a single month for a deeper read on weather, what&apos;s open, and what to pack: <a href=\"/hilton-head-weather/january\">January</a>, <a href=\"/hilton-head-weather/february\">February</a>, <a href=\"/hilton-head-weather/march\">March</a>, <a href=\"/hilton-head-weather/april\">April</a>, <a href=\"/hilton-head-weather/may\">May</a>, <a href=\"/hilton-head-weather/june\">June</a>, <a href=\"/hilton-head-weather/july\">July</a>, <a href=\"/hilton-head-weather/august\">August</a>, <a href=\"/hilton-head-weather/september\">September</a>, <a href=\"/hilton-head-weather/october\">October</a>, <a href=\"/hilton-head-weather/november\">November</a>, <a href=\"/hilton-head-weather/december\">December</a>.",
        },
        {
          kind: 'p',
          html: "Two notes people miss. The island is <strong>noticeably warmer than inland Savannah</strong> in winter and <strong>cooler than inland Savannah</strong> in summer. Think of Hilton Head as its own micro-climate. And rainy-day counts here mean afternoon thunderstorms in summer, not all-day washouts. A July afternoon storm clears in 45 minutes and the beach is open again by five.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '02 \u00b7 By season',
      title: 'The four real seasons',
      summary: "Spring, summer, fall, winter \u2014 the weather, crowds, rates, and who each window is for.",
      defaultOpen: false,
      blocks: [
        {
          kind: 'h3',
          text: 'Spring \u00b7 March through mid-May',
        },
        {
          kind: 'p',
          html: "<strong>Weather:</strong> 62-78\u00b0F days, dropping to 49-60\u00b0F at night. Water still cold (58-68\u00b0F) through April, swimmable for most by mid-May. <strong>Crowds:</strong> Low until spring break hits mid-March, then heavy the week of the <a href=\"/blog/rbc-heritage-2026-travel-guide\">RBC Heritage (April 13-19, 2026)</a>. <strong>Rates:</strong> Moderate, except Heritage week doubles everything. <strong>Best for:</strong> golf trips, couples' getaways, serious cyclists, bird-watchers at the end of migration.",
        },
        {
          kind: 'p',
          html: "This is our default recommendation for <a href=\"/hilton-head-golf-packages\">Hilton Head golf packages</a>. Course conditioning is post-winter pristine, overnight lows still dew-set the greens, and rates run 25-35% below summer peaks. Pollen is the one catch. Oak pollen peaks in late March; pack Zyrtec if you're reactive. Avoid the second week of April unless you're specifically coming for Heritage.",
        },
        {
          kind: 'h3',
          text: 'Summer \u00b7 Late May through August',
        },
        {
          kind: 'p',
          html: "<strong>Weather:</strong> 82-92\u00b0F days, 71-74\u00b0F nights, humidity routinely 75-85%. Water 78-84\u00b0F, the warmest of the year and the only window the Atlantic feels bath-warm. <strong>Crowds:</strong> Peak. Coligny at capacity, villa inventory tight, Highway 278 gridlocked on Saturday turnover days. <strong>Rates:</strong> Highest of the year, 50-70% above winter. <strong>Best for:</strong> <a href=\"/hilton-head-family-trip-planner\">families with school-age kids</a> who have no other window.",
        },
        {
          kind: 'p',
          html: "If summer is your only option. Book 5-6 months out for villa inventory, 3-4 for resort rooms, and target the first week of June or the last week of August for slightly softer pricing. Rent bikes for the kids. The heat becomes tolerable on a shaded bike path. Dinner reservations require 2-3 weeks lead time at S-tier restaurants. Afternoon thunderstorms clock in between 3 and 5 p.m. like a Swiss train. Plan beach time for morning, storms for nap time.",
        },
        {
          kind: 'h3',
          text: 'Fall \u00b7 September through early November',
        },
        {
          kind: 'p',
          html: "<strong>Weather:</strong> 72-85\u00b0F through early October, 60-75\u00b0F through early November. Water stays 70\u00b0F+ through October, which most visitors underestimate. <strong>Crowds:</strong> Light after Labor Day (September 7, 2026), near-empty after mid-October. <strong>Rates:</strong> 30-40% below summer. <strong>Best for:</strong> couples, foodies, <a href=\"/blog/hilton-head-golf-trip\">serious golfers</a>, photographers chasing Lowcountry golden hour.",
        },
        {
          kind: 'callout',
          label: "Our favorite window",
          html: "<strong>October is the best month to visit Hilton Head, full stop.</strong> Warm water, empty beaches, perfect 75\u00b0F golf weather, rates 35% below summer, and dinner reservations become walk-in-able at 70% of restaurants. Book <a href=\"/blog/2026-best-places-to-stay-hilton-head\">an S-tier villa</a> by June for October stays.",
        },
        {
          kind: 'h3',
          text: 'Winter \u00b7 Late November through February',
        },
        {
          kind: 'p',
          html: "<strong>Weather:</strong> 55-68\u00b0F days, 40-50\u00b0F nights. The occasional 45\u00b0F rainy stretch. Water too cold to swim at 55-58\u00b0F. <strong>Crowds:</strong> Genuinely quiet. The island breathes out. <strong>Rates:</strong> Lowest of the year, 50-55% below summer on villas, 40% below on resorts. <strong>Best for:</strong> budget-conscious couples, writers' retreats, shoulder-season golfers willing to sweater-up at 7 a.m.",
        },
        {
          kind: 'p',
          html: "The beach is empty and stunning. You'll wear a jacket at sunset. A handful of restaurants close one night a week, some tour operators pause, and the Sea Pines trolley runs a limited schedule. We plan around it. Genuinely underrated for older couples who don't care about swimming and for anyone who prefers <a href=\"/hilton-head/sea-pines\">Sea Pines</a> without the bikes-ten-abreast traffic of July.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '03 \u00b7 The water',
      title: 'Ocean temperature and 7-day tide forecast',
      summary: "Swim windows by month plus live high/low tide times for beach, dolphin tours, and shrimping.",
      defaultOpen: false,
      blocks: [
        {
          kind: 'p',
          html: "Ocean temperature is the single most-asked weather question we get. Hilton Head sits in a slightly warmer pocket than Tybee or Charleston thanks to the shallow shelf off Fish Haul and the bend of the Atlantic coast. Here's what the water actually feels like month by month, and whether it's swimmable for kids, adults, or only for someone in a wetsuit:",
        },
        {
          kind: 'ul',
          items: [
            "<strong>January-February:</strong> 55\u00b0F. Jacket-and-walk weather. Not swimmable without a 5/4 wetsuit.",
            "<strong>March:</strong> 60\u00b0F. Still cold. Fine for a quick plunge if you're 14 years old and impervious.",
            "<strong>April:</strong> 67\u00b0F. The water warms fast late month. Swimmable for kids who don't care about shiver.",
            "<strong>May:</strong> 74\u00b0F. Officially swimmable for most adults by mid-May.",
            "<strong>June:</strong> 80\u00b0F. Bath-warm. This is when the water starts inviting long sessions.",
            "<strong>July-August:</strong> 84\u00b0F. Peak ocean temperature. Warmer than most Florida beaches north of Miami.",
            "<strong>September:</strong> 80\u00b0F. Water still peak-warm even as air temps drop. Underrated swim month.",
            "<strong>October:</strong> 73\u00b0F. Swimmable all month. The sweet spot locals don't advertise.",
            "<strong>November:</strong> 65\u00b0F. Early November still brisk-swimmable; by month-end, too cold.",
            "<strong>December:</strong> 58\u00b0F. Decorative only.",
          ],
        },
        {
          kind: 'embed',
          component: 'tide-forecast',
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '04 \u00b7 Storm risk',
      title: 'Hurricane season \u2014 the honest numbers',
      summary: "Live Atlantic-basin status, historical odds, and our trip-insurance advice.",
      defaultOpen: false,
      blocks: [
        {
          kind: 'embed',
          component: 'hurricane-status',
        },
        {
          kind: 'p',
          html: "Atlantic hurricane season officially runs <strong>June 1 to November 30</strong>. Actual risk to Hilton Head is concentrated in <strong>late August through mid-October</strong>, with the historical peak around September 10. In the last 10 years, only two hurricanes have caused island-wide closures (Matthew in 2016, Irma in 2017). Dorian in 2019 and Idalia in 2023 triggered evacuations that turned out largely precautionary. For this year specifically, see our <a href=\"/blog/hilton-head-2026-hurricane-forecast\">2026 hurricane forecast</a>, which breaks down CSU and TSR April outlooks plus the four travel windows we use to weigh storm risk against rates.",
        },
        {
          kind: 'p',
          html: "The odds of your specific travel week being hit by a named storm are <strong>under 4%</strong>. The odds of a mandatory evacuation are closer to 1%. Hilton Head's barrier-island geometry and the Lowcountry's wide tidal marsh both eat surge; most storms that threaten the island track west or north before landfall.",
        },
        {
          kind: 'p',
          html: "That said. We always recommend trip insurance for September and early-October bookings. A named-storm policy costs roughly 5-7% of trip total and covers full refund if an evacuation order is issued during your travel window. Call us if you want specifics on which policy actually pays out. Most don't.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '05 \u00b7 Month by month',
      title: 'A one-line take on each of the 12 months',
      summary: "What works, what to skip, and which weeks to book early.",
      defaultOpen: false,
      blocks: [
        {
          kind: 'ol',
          items: [
            "<strong>January:</strong> Coldest, cheapest. 55\u00b0F beach walks, bonfires on Forest Beach at sunset. Avoid if you need to swim. Great for a <a href=\"/hilton-head/palmetto-dunes\">Palmetto Dunes</a> villa at half price.",
            "<strong>February:</strong> Slight warm-up. Whale-watching charters run out of Savannah. Valentine's weekend is a real value window.",
            "<strong>March:</strong> The turn. Weather improves rapidly. Second half of the month = <a href=\"/hilton-head-spring-break\">spring break surge</a>.",
            "<strong>April:</strong> Peak spring. Avoid week 2 (Heritage) unless tournament-attending. Otherwise perfect.",
            "<strong>May:</strong> The last quiet month before summer. Water warms by mid-month. Our sleeper pick for couples and golfers.",
            "<strong>June:</strong> Summer begins. Villa inventory gets tight by mid-month. Book by January for prime weeks.",
            "<strong>July:</strong> Peak heat plus peak crowds. Book 6 months out or forget oceanfront. Afternoon storms are reliable; plan around them.",
            "<strong>August:</strong> Still peak. Hurricane watch begins but real risk stays low until late September.",
            "<strong>September:</strong> Post-Labor-Day exodus. Rates drop 25% overnight. Hurricane season peaks mid-month. Have trip insurance.",
            "<strong>October:</strong> <strong>The best month.</strong> Book now.",
            "<strong>November:</strong> First two weeks excellent. <a href=\"/hilton-head-thanksgiving\">Thanksgiving week</a> is quieter than you'd expect. Holiday lights go up the weekend after.",
            "<strong>December:</strong> Holiday lights at <a href=\"/harbour-town-villas\">Harbour Town</a>. Christmas week is surprisingly open and cheap; New Year's booked out.",
          ],
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '06 \u00b7 Logistics',
      title: 'Weeks to avoid \u00b7 pack list \u00b7 when to book',
      summary: "The two weeks not to come, packing by season, and lead times that actually matter.",
      defaultOpen: false,
      blocks: [
        {
          kind: 'h3',
          text: 'Two weeks to absolutely avoid',
        },
        {
          kind: 'p',
          html: "<strong>Week of RBC Heritage (April 13-19, 2026)</strong>. Unless you're attending. Rates double, restaurants overwhelmed, villas booked a year out. If the tournament is the point, see our <a href=\"/blog/rbc-heritage-2026-travel-guide\">Heritage travel guide</a>.",
        },
        {
          kind: 'p',
          html: "<strong>July 4th week</strong>. Peak-on-peak. Fireworks at Shelter Cove are great, but the drive home is 90 minutes for a 15-minute trip. If you must be here for the Fourth, rent a villa <a href=\"/hilton-head/forest-beach\">within walking distance of Coligny</a> and don't move the car.",
        },
        {
          kind: 'h3',
          text: 'What to pack, by season',
        },
        {
          kind: 'ul',
          items: [
            "<strong>Spring:</strong> Layers. Mornings in the 50s, afternoons in the 70s. A light rain shell for the one afternoon storm that's coming. Golfers: a quarter-zip for the 7 a.m. tee time.",
            "<strong>Summer:</strong> UPF sun shirts, reef-safe sunscreen, a wide-brim hat, and sandals that survive sand. Evenings never drop below 72\u00b0F; no jacket needed.",
            "<strong>Fall:</strong> The most variable packing. Shorts and tees through early October, add a light layer mid-month, long sleeves and a fleece by early November.",
            "<strong>Winter:</strong> Jeans, a real sweater, a windbreaker for the beach walk, and flip-flops you won't actually wear. Pack slippers; villa floors are tile.",
          ],
        },
        {
          kind: 'h3',
          text: 'When to book, by season',
        },
        {
          kind: 'p',
          html: "Lodging lead time matters as much as weather. For <strong>summer</strong>, book 5-6 months out for oceanfront villas and 3-4 for resort rooms. For <strong>October</strong>, 3-4 months out; the word is getting around. For <strong>Heritage week</strong>, 9-10 months out. For <strong>winter</strong>, two weeks out is fine unless it's a holiday. For <strong>spring break</strong>, 4-5 months out.",
        },
        {
          kind: 'callout',
          label: "What we actually recommend",
          html: "For most clients we plan <strong>October</strong> first. For families locked into school calendars, <strong>mid-June</strong>. For <a href=\"/hilton-head-golf-packages\">golf</a>, <strong>early May or late October</strong>. For couples on a budget, <strong>early December</strong>. For a <a href=\"/hilton-head-weddings\">Hilton Head wedding</a>, late April or mid-October for the weather and photography sweet spot. These are the five windows we come back to over and over.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '07 \u00b7 FAQ',
      title: 'Frequently asked questions',
      summary: "13 quick answers to the questions we hear most before a booking call.",
      defaultOpen: true,
      blocks: [
        {
          kind: 'faq',
          label: "Questions we hear most",
      items: [
        {
          q: "What is the best month to visit Hilton Head Island?",
          a: "October. Ocean water averages 73\u00b0F, days sit at a dry 75-80\u00b0F, hurricane risk has passed, crowds thin after Labor Day, and lodging rates run 30-40% below summer peak. Early May is a close runner-up for couples and golfers.",
        },
        {
          q: "What is the cheapest time to visit Hilton Head?",
          a: "January and early December. Villa rates run 50-55% below summer peak, and weekday resort rooms can be booked within two weeks of travel. The tradeoff: water is too cold to swim and a handful of restaurants reduce hours.",
        },
        {
          q: "What is the water temperature at Hilton Head by month?",
          a: "Ocean temperature tracks the calendar: April averages 67\u00b0F, May 74\u00b0F, June 80\u00b0F, July and August 84\u00b0F (peak), September 80\u00b0F, and October 73\u00b0F. Winter lows sit near 55\u00b0F. Hilton Head's shallow shelf runs 2-3\u00b0F warmer than neighboring Tybee or Charleston.",
        },
        {
          q: "When is hurricane season on Hilton Head?",
          a: "Atlantic hurricane season runs June 1 through November 30, but the actual risk window for Hilton Head is concentrated from late August through mid-October, peaking around September 10. Historical odds of a named-storm impact in any given week are under 4%, and full evacuations are rarer than 1%.",
        },
        {
          q: "Is Hilton Head warm in March?",
          a: "March averages 67\u00b0F during the day and 49\u00b0F at night, with ocean water around 60\u00b0F. Warm enough for beach walks, bike rides, and golf; still too cold for most adults to swim. The second half of March brings the first real crowds with spring break.",
        },
        {
          q: "How hot is Hilton Head in July?",
          a: "July averages 90\u00b0F during the day and 74\u00b0F at night, with humidity routinely 75-85% and afternoon thunderstorms between 3 and 5 p.m. Ocean water reaches its peak at 84\u00b0F. Plan beach time for morning, indoor or covered activity for afternoon.",
        },
        {
          q: "What is the rainiest month on Hilton Head?",
          a: "August, averaging 13 rainy days. June, July, and September each average 10-12. Rain in summer means afternoon thunderstorms that clear in 30-60 minutes, not all-day washouts. Winter rain is less frequent but longer.",
        },
        {
          q: "Is Hilton Head good to visit in October?",
          a: "October is the single best month to visit Hilton Head. Average high 77\u00b0F, average low 59\u00b0F, ocean water 73\u00b0F (still swimmable), six to seven rainy days total, and hurricane risk effectively past by mid-month. Crowds are light and lodging runs 30-40% below summer.",
        },
        {
          q: "Is November a good time to visit Hilton Head?",
          a: "The first two weeks of November are excellent. Days run 65-72\u00b0F, water is still 65\u00b0F, and the island is quiet. Thanksgiving week fills up for family trips but stays calmer than summer. Late November gets brisk at night and ocean swimming ends for the year.",
        },
        {
          q: "What is shoulder season on Hilton Head?",
          a: "Two shoulder-season windows: April through early May (spring, excluding Heritage week) and September through October (fall, excluding any active-storm windows). Both deliver summer-like weather at 25-35% lower rates, with fall being the better play thanks to warmer water and fewer crowds.",
        },
        {
          q: "Can you swim at Hilton Head in April?",
          a: "Kids yes, most adults no. Water averages 67\u00b0F in April, warming fast through the month. By late April early-season swimmers are in; by Mother's Day weekend, it's swimmable for nearly everyone.",
        },
        {
          q: "How cold does Hilton Head get in winter?",
          a: "Daytime averages run 55-68\u00b0F, overnight lows 40-50\u00b0F. Hard freezes (below 32\u00b0F) happen one to three nights per year on average. Snow is a once-every-10-years event. You'll wear a jacket at sunset and a sweater most days.",
        },
        {
          q: "What week should I absolutely avoid on Hilton Head?",
          a: "Two: the week of RBC Heritage (April 13-19, 2026) and July 4th week. Heritage doubles lodging rates and fills every restaurant; July 4th stacks peak summer crowds on top of fireworks traffic. Every other week has a pocket that works.",
        },
        {
          q: "When does hurricane season end on Hilton Head?",
          a: "Officially November 30. In practice, the real risk drops off sharply after October 15. A late-October or November trip carries the same storm risk as spring.",
        },
          ],
        },
      ],
    },
    {
      kind: 'p',
      html: "Weather is the cheapest trip-planning lever you can pull. Shifting a family beach week from July to early June cuts villa cost by 30% without changing a single reservation. Moving a golf trip from March to early May trades pollen for warmer water and the same tee-sheet prices. Tell us the trip and we'll map it against the next six months of island calendar — the <a href=\"/itinerary\">full itinerary service</a> is $450 flat, and the guide is free either way.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 9.5) 2026 Hurricane Forecast — why it's a smart year to book shoulder season
// ---------------------------------------------------------------------------

const postHurricaneForecast2026: Post = {
  slug: 'hilton-head-2026-hurricane-forecast',
  title:
    "The 2026 Hurricane Forecast: Why This Is a Smart Year to Book Hilton Head",
  excerpt:
    "Below-average season expected. Colorado State and Tropical Storm Risk both call for fewer storms than the 30-year norm thanks to a strong El Niño. Here's how to read it, and how to book around it.",
  description:
    "The 2026 Atlantic hurricane forecast is below-average. CSU and TSR call for ~75% of normal activity. What that means for booking Hilton Head Aug-Oct, and the four logistics every visitor should plan for anyway.",
  category: 'Planning',
  readTime: '8 min',
  publishedAt: '2026-04-30',
  author: 'Hilton Ahead',
  featuredOrder: 1.5,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'Hilton Head hurricane season 2026',
    'Hilton Head 2026 hurricane forecast',
    'is it safe to visit Hilton Head in hurricane season',
    'Hilton Head September October hurricane',
    'Atlantic hurricane forecast 2026',
    'CSU hurricane forecast 2026',
    'El Niño 2026 hurricane',
    'Hilton Head shoulder season',
    'Hilton Head fall booking',
  ],
  body: [
    {
      kind: 'p',
      html: "Every spring we get the same call from clients eyeballing September and October trips: \"Should we even bother booking? Isn't it hurricane season?\" The honest answer for 2026 is the most encouraging it's been in five years. Both major Atlantic forecasters — Colorado State University and the British firm Tropical Storm Risk — released April outlooks calling for a meaningfully below-average season. Here's what the numbers actually say, what they mean for a Hilton Head trip, and the four logistics every shoulder-season visitor should plan for regardless.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Book the September-October shoulder season with confidence.</strong> 2026 is forecast at <strong>~75% of normal Atlantic activity</strong> with US major-hurricane landfall odds at <strong>32% vs the 43% historical average</strong>. Pair that with the standard playbook — refundable lodging, trip insurance, and a flexible booking window — and you get fall water temps, light crowds, and 30-40% lower rates without taking on outsized weather risk.",
    },
    {
      kind: 'h2',
      text: "What the 2026 forecasts actually say",
    },
    {
      kind: 'p',
      html: "There are two forecasts that matter. <strong>Colorado State University</strong> publishes the most-cited seasonal outlook in April, then revises through August. <strong>Tropical Storm Risk</strong> (TSR), a UK private forecasting firm, runs an independent model. When both call the same direction, you can read it with reasonable confidence. For 2026, both called below-average, and the reason is the same: a strong El Niño event has reset the Pacific, and El Niño years drive elevated vertical wind shear across the Atlantic basin, which shears apart developing storms before they can organize.",
    },
    {
      kind: 'table',
      caption: "April 2026 Atlantic hurricane outlooks vs. 30-year average",
      headers: ['Forecaster', 'Named storms', 'Hurricanes', 'Major hurricanes', 'Activity vs. avg'],
      rows: [
        ['Colorado State University (Apr 2026)', '13', '6', '2', '~75%'],
        ['Tropical Storm Risk (Apr 9, 2026)',    '12', '5', '1', '~54% (ACE 66)'],
        ['1991-2020 historical average',         '14.4', '7.2', '3.2', '100%'],
      ],
    },
    {
      kind: 'p',
      html: "Two things to pull out of that table. First, the major-hurricane count is the number that matters most for landfall risk. CSU sees 2 majors; TSR sees 1. Both are below the 30-year norm of 3.2. Second, TSR's <strong>ACE index</strong> (Accumulated Cyclone Energy, basically a season-long power score) lands at 66 — about 54% of average. That's not just fewer storms, it's weaker storms.",
    },
    {
      kind: 'callout',
      label: "What CSU says about US landfall odds",
      html: "Tropical Storm Risk projects a <strong>32% chance</strong> of a major hurricane making US landfall in 2026 (long-term average: 43%). For the Caribbean, the forecast still gives a 35% chance of a major landfall, so any Caribbean leg of a trip carries higher risk than the Carolina coast.",
    },
    {
      kind: 'h2',
      text: "What this means for Hilton Head specifically",
    },
    {
      kind: 'p',
      html: "Hilton Head Island sits on the South Carolina coast, just inside the typical Atlantic hurricane track. Direct hits are historically rare. The last storm to do material damage to the island was <strong>Hurricane Matthew in October 2016</strong>, which prompted a mandatory evacuation and downed thousands of trees but caused no fatalities and no destroyed structures in the resort areas. Since then, the closest call was Dorian in 2019, which tracked offshore. The island has cleared the past six seasons without a meaningful direct impact.",
    },
    {
      kind: 'p',
      html: "Statistically, the highest-risk window on the SC coast is <strong>mid-August through mid-October</strong>, with September the single peak month. That overlaps almost perfectly with the shoulder-season pricing window — which is why the trip-cost discount exists in the first place. Insurance carriers price the risk; lodging operators discount the demand. Both are reading the same signal.",
    },
    {
      kind: 'h2',
      text: "How to book around it (the four-part playbook)",
    },
    {
      kind: 'h3',
      text: '1. Pick lodging with a flexible cancellation policy',
    },
    {
      kind: 'p',
      html: "Most Hilton Head villa rentals default to a 30-60 day cancellation window with hurricane-clause language baked in. <strong>Read the actual hurricane clause before booking.</strong> The good ones refund 100% if a National Hurricane Center cone touches Beaufort County within 72 hours of arrival. The bad ones offer credit only, valid for 12 months. Two- and three-night stays at <a href=\"/blog/2026-best-places-to-stay-hilton-head\">resort hotels</a> are usually more flexible than weeklong villa contracts. If you're doing a long stay during peak season, this clause is the difference between a $4,000 vacation and a $4,000 storage fee.",
    },
    {
      kind: 'h3',
      text: '2. Add Cancel-For-Any-Reason (CFAR) trip insurance',
    },
    {
      kind: 'p',
      html: "Standard travel insurance pays out if a hurricane <em>actually</em> makes landfall during your trip. CFAR pays out if you decide not to come — for any reason — typically with a 75% reimbursement of trip costs and a 48-72 hour pre-trip cutoff. CFAR runs about 10-12% of trip cost vs 4-7% for standard. For a $5,000 family trip in September, that's roughly $250 extra for genuine peace of mind. Cheap insurance against the kind of \"the cone is wobbling\" anxiety that ruins the week before a vacation.",
    },
    {
      kind: 'h3',
      text: '3. Build flexibility into your travel dates',
    },
    {
      kind: 'p',
      html: "If you can move your arrival by 48-72 hours either way, you can almost always dodge a storm. Hurricane tracks become reliable about 4-5 days out. Visitors who lose trips to a storm are usually the ones with locked-in flights and a single arrival day. Drive markets — Atlanta, Charlotte, Charleston, Raleigh — have a structural advantage here. So do guests <a href=\"/blog/best-time-to-visit-hilton-head\">booking shoulder-season weeks</a> with refundable lodging.",
    },
    {
      kind: 'h3',
      text: '4. Know the evacuation logistics before you need them',
    },
    {
      kind: 'p',
      html: "Hilton Head has one road off the island: <strong>US 278</strong>. The William Hilton Parkway bridge crosses Mackay and Skull Creeks to the mainland, then connects to I-95 at Exit 8. Mandatory evacuations are called by the Beaufort County Emergency Management Department roughly 36-48 hours before storm impact, with contraflow on I-26 west out of Charleston. If an evacuation is called, leave immediately rather than waiting — the bottleneck on US 278 forms within 4-6 hours of an order. (Side note for 2026 visitors: there are no current bridge construction disruptions. The <a href=\"/blog/hilton-head-2026-bridge-construction\">US 278 replacement project</a> is in design phase, with construction not expected before 2028.)",
    },
    {
      kind: 'h2',
      text: "The four-window decision frame",
    },
    {
      kind: 'p',
      html: "If you're using the 2026 forecast to pick a window, here's how the math actually plays:",
    },
    {
      kind: 'table',
      caption: "Hilton Head 2026 booking windows: weather, rates, hurricane risk",
      headers: ['Window', 'Hurricane risk', 'Rate vs. summer', 'Best for'],
      rows: [
        ['June 1 - Aug 14',  'Low (early season)',          'Peak',      'School-calendar families'],
        ['Aug 15 - Sep 30',  'Highest (peak window)',       '-15 to -25%', 'Flexible drive-market couples'],
        ['Oct 1 - Oct 31',   'Moderate (declining)',        '-30 to -40%', 'Best overall: water still 73°F, light crowds'],
        ['Nov 1 - Nov 30',   'Very low (season effectively closed Nov 30)', '-40 to -50%', 'Off-season weekenders, golf'],
      ],
    },
    {
      kind: 'callout',
      label: "If we were booking right now",
      html: "We'd book the <strong>second or third week of October</strong>. Water temps still hit 73°F, hurricane risk is sharply lower than September, lodging rates run 35-40% below July, and you can still get dinner reservations the day-of. Couples especially. Pair it with our <a href=\"/blog/best-time-to-visit-hilton-head\">month-by-month weather guide</a> if you want to compare across the calendar.",
    },
    {
      kind: 'h2',
      text: "What can change between now and August",
    },
    {
      kind: 'p',
      html: "The April outlooks are the least accurate of the year. CSU explicitly notes their April forecast is historically less reliable than the June and August updates because Atlantic and Pacific conditions can shift meaningfully through early summer. The El Niño signal is the dominant factor right now, and that pattern is well-established — but if El Niño collapses faster than expected by July, the outlook can revise upward. Watch for the <strong>August 5 update</strong> from CSU, which is the most predictive of the season's actual activity. We track it and update this post when revisions land.",
    },
    {
      kind: 'h2',
      text: "If you want a custom answer",
    },
    {
      kind: 'p',
      html: "The right window depends on who's traveling, what they want to do, and how flexible they are. We've planned 100+ Hilton Head trips through hurricane season, and the question we ask first is always: \"how many work-from-anywhere days do you have for a flex window?\" Two days of arrival flexibility plus refundable lodging plus CFAR insurance gets the risk down to noise. <a href=\"/itinerary\">Tell us the trip</a> and we'll map it against the next six months of forecast updates and rate movement. The guide is free.",
    },
    {
      kind: 'faq',
      label: "FAQ",
      items: [
        {
          q: "Is it safe to visit Hilton Head during hurricane season?",
          a: "Yes, with sensible logistics. Hurricane season runs June 1 - November 30. Direct hurricane impacts on Hilton Head are historically rare — the last meaningful damage was Hurricane Matthew in October 2016. The 2026 forecast is below-average. Book lodging with a strong hurricane clause, add CFAR trip insurance, and build 48-72 hours of arrival flexibility.",
        },
        {
          q: "What is the worst month for hurricanes on Hilton Head?",
          a: "September. The peak of Atlantic hurricane season runs roughly September 10-20, when SST and atmospheric conditions are most favorable for storm development. October risk drops sharply, especially after October 15.",
        },
        {
          q: "Will the 2026 hurricane season be bad?",
          a: "No. As of April 2026, both Colorado State University and Tropical Storm Risk forecast a below-average season — about 75% of normal activity — driven by a strong El Niño in the Pacific. CSU forecasts 13 named storms, 6 hurricanes, and 2 majors. TSR forecasts 12 named storms, 5 hurricanes, and 1 major.",
        },
        {
          q: "Should I buy hurricane trip insurance for a Hilton Head trip?",
          a: "If you're traveling between mid-August and mid-October, yes. Standard trip insurance (4-7% of trip cost) covers actual storm impact. Cancel-For-Any-Reason coverage (10-12%) covers the broader anxiety window — typically reimbursing 75% of trip costs if you cancel up to 48 hours before arrival.",
        },
        {
          q: "What happens if a hurricane is approaching during my Hilton Head stay?",
          a: "Beaufort County calls mandatory evacuations 36-48 hours before storm impact. Leave immediately when called — US 278 is the only road off the island and bottlenecks within hours of an evacuation order. Contraflow runs on I-26 west out of Charleston. Most lodging contracts refund 100% if an evacuation order is in effect during your stay.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 9.7) US 278 Bridge — anti-FUD post for 2026 visitors
// ---------------------------------------------------------------------------

const postBridge2026Debunker: Post = {
  slug: 'hilton-head-2026-bridge-construction',
  title:
    "Will the US 278 Bridge Project Affect Your 2026 Hilton Head Trip? No.",
  excerpt:
    "The Mackay Creek bridge replacement is real, the funding gap is real, but construction won't start until 2028. Here's what's actually happening in 2026, and the one logistics note worth knowing.",
  description:
    "The US 278 / William Hilton Parkway bridge replacement is in design phase only. No construction in 2026. Current geotech work is barge-based, zero traffic impact. Full breakdown of the project status.",
  category: 'Planning',
  readTime: '6 min',
  publishedAt: '2026-04-30',
  author: 'Hilton Ahead',
  featuredOrder: 1.8,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes'],
  keywords: [
    'Hilton Head bridge construction 2026',
    'US 278 bridge Hilton Head',
    'William Hilton Parkway construction',
    'Hilton Head traffic 2026',
    'Mackay Creek bridge',
    'Hilton Head bridge project status',
    'driving to Hilton Head 2026',
    'Hilton Head bridge replacement timeline',
  ],
  body: [
    {
      kind: 'p',
      html: "The most common 2026 question we're getting from drive-market clients is some version of: \"I read that they're tearing down the bridge to Hilton Head — is my trip going to be a nightmare?\" Short answer: no, and the longer answer is worth understanding because the project is real and will eventually matter. Here's the actual status of the US 278 / William Hilton Parkway bridge replacement project as of late April 2026, and what it means for trips this year.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>No bridge construction will affect 2026 Hilton Head visitors.</strong> The project is in <strong>design phase (60% complete)</strong>, with construction not expected to start before <strong>2028</strong> due to a $190M funding gap. Current geotech exploration work is <strong>barge-based</strong>, occurring outside the travel lanes. Zero current traffic impact.",
    },
    {
      kind: 'h2',
      text: "What the project actually is",
    },
    {
      kind: 'p',
      html: "US 278 (William Hilton Parkway) is the only road on and off Hilton Head Island. It crosses two creeks — Mackay Creek and Skull Creek — via twin bridges built in 1956 and 1982. The 1956 eastbound span (the older of the two) has been flagged as structurally deficient by SCDOT for years. The current $311M plan replaces the eastbound bridge first, then later expands the corridor approaches on both ends. The full corridor plan totals eight projects from Jenkins Island to Jarvis Creek, aimed at congestion, safety, and emergency-evacuation capacity.",
    },
    {
      kind: 'h2',
      text: "Where the project actually is (April 2026)",
    },
    {
      kind: 'p',
      html: "Three things to know about the current state:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Design is 60% complete</strong> as of late April 2026. SCDOT presented an updated corridor master-plan briefing to Hilton Head Town Council on April 29, 2026.",
        "<strong>Construction has not been funded.</strong> Beaufort County is short approximately $190M of the $311M total cost and is currently evaluating whether to proceed without federal funding. If they do, construction could start as early as 2028.",
        "<strong>Current on-site activity is barge-based geotechnical exploration only.</strong> Crews are taking soil samples from the water, not the road. The geotech work occurs outside US 278 travel lanes and has no traffic impact.",
      ],
    },
    {
      kind: 'callout',
      label: "What this means for your 2026 trip",
      html: "Drive on, drive off. Same as always. The bridge is structurally monitored by SCDOT and remains fully open. There is no lane closure schedule, no detour, and no construction equipment in the travel lanes through the entire 2026 season.",
    },
    {
      kind: 'h2',
      text: "The one logistics note worth knowing for 2026",
    },
    {
      kind: 'p',
      html: "Even without construction, US 278 has predictable congestion windows. <strong>Saturday turnover days</strong> (the peak inbound day for weeklong rentals) routinely show 20-45 minute backups eastbound between roughly 11 a.m. and 4 p.m. June through August. The bottleneck is the Bluffton Parkway / Highway 46 merge, not the bridge itself. If you're driving in on a summer Saturday, either arrive before 10 a.m. or after 5 p.m. — both windows clear quickly. Outbound Sunday traffic mirrors the same pattern westbound.",
    },
    {
      kind: 'h2',
      text: "When the bridge work will actually matter",
    },
    {
      kind: 'p',
      html: "Realistically, this is a <strong>2029-2031 problem, not a 2026 problem</strong>. Even on the optimistic timeline (county proceeds without federal funding, breaks ground in 2028), construction is projected to take 2.5 years. Expect approach-lane work, occasional weekend closures of one direction with detours via the parallel westbound bridge, and full corridor disruption sometime in the early 2030s. We'll update this post as funding decisions and timelines firm up. If you're planning a major Hilton Head investment — second home, multi-year vacation rental — the timeline is worth tracking. If you're booking a 2026 family week, it's noise.",
    },
    {
      kind: 'h2',
      text: "What's not changing in 2026",
    },
    {
      kind: 'ul',
      items: [
        "Both eastbound and westbound US 278 bridge spans remain fully open all year.",
        "No lane closures are scheduled through 2026 hurricane season (June-November).",
        "The evacuation route remains intact and unimpeded.",
        "The toll-free crossing remains free. (There has been no public discussion of tolling the bridge to fund the replacement.)",
      ],
    },
    {
      kind: 'h2',
      text: "Plan your drive",
    },
    {
      kind: 'p',
      html: "If you're driving in from Atlanta, Charlotte, Charleston, or Raleigh, the airport-vs-drive math <strong>strongly favors driving in 2026</strong> — airfares are up 17.3% year over year per the US Travel Association's March Travel Price Index, while gas prices have remained relatively stable. <a href=\"/itinerary\">Send us your trip details</a> and we'll factor real arrival timing — including which side of the Saturday turnover wave to land on — into the itinerary.",
    },
    {
      kind: 'faq',
      label: "FAQ",
      items: [
        {
          q: "Is the Hilton Head bridge closing in 2026?",
          a: "No. The US 278 bridge replacement project is in design phase only. Construction is not expected to start before 2028. Both bridge spans remain fully open through 2026.",
        },
        {
          q: "When will the new Hilton Head bridge be built?",
          a: "Design is 60% complete as of April 2026. Construction is unfunded and unscheduled — Beaufort County is currently short approximately $190M. If they proceed without federal funding, construction could start in 2028 and take roughly 2.5 years to complete.",
        },
        {
          q: "Will there be Hilton Head traffic delays from bridge construction in 2026?",
          a: "No. Current geotechnical exploration is barge-based and occurs outside US 278 travel lanes. There are no scheduled lane closures or detours. Normal Saturday turnover-day congestion still applies on summer weekends.",
        },
        {
          q: "How will the bridge replacement be paid for?",
          a: "The $311M project has a $190M funding shortfall. The Beaufort County Council is currently weighing whether to proceed without federal funds. No tolls have been proposed; the bridge would remain free. Funding decisions are expected during 2026.",
        },
        {
          q: "What's the best time to drive across the bridge to Hilton Head?",
          a: "On summer Saturdays (the peak rental turnover day), arrive before 10 a.m. or after 5 p.m. to avoid the eastbound bottleneck at Bluffton Parkway / Hwy 46. Mid-week travel is unrestricted.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 10) RBC Heritage 2026 travel guide
// ---------------------------------------------------------------------------

const postRbcHeritage: Post = {
  slug: 'rbc-heritage-2026-travel-guide',
  title: "RBC Heritage 2026: The Local's Travel Guide",
  excerpt:
    "Tickets, hospitality, lodging, and the three things visitors always get wrong. Everything you need for Heritage week, April 13-19, 2026.",
  description:
    "Local travel guide to RBC Heritage 2026 at Harbour Town. Tickets, hospitality, lodging, parking strategy, and insider logistics for the tournament.",
  category: 'Golf',
  readTime: '9 min',
  publishedAt: '2026-02-28',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 3.5,
  relatedNeighborhoods: ['sea-pines'],
  keywords: [
    'RBC Heritage 2026',
    'RBC Heritage tickets',
    'Harbour Town Golf Links',
    'RBC Heritage hospitality',
    'RBC Heritage lodging',
    'Hilton Head PGA Tour',
  ],
  body: [
    {
      kind: 'p',
      html: "RBC Heritage is the only full-field PGA Tour event south of Augusta and the single most important week of the year on Hilton Head Island. April 13-19, 2026. Here's what first-timers consistently get wrong and how locals actually do it.",
    },
    {
      kind: 'h2',
      text: "The week at a glance",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Monday-Wednesday:</strong> Practice rounds. Cheaper tickets, smaller crowds, photograph freely.",
        "<strong>Thursday-Sunday:</strong> Tournament rounds. Full PGA Tour field, packed grounds, leaderboard drama by Saturday back nine.",
        "<strong>Sunday 5-7 p.m.:</strong> Winner dons the plaid jacket on 18. Stay for it.",
      ],
    },
    {
      kind: 'h2',
      text: "Tickets. Buy these, skip those",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Grounds pass ($55-$85/day):</strong> Full access to the course. What most visitors should buy. Best value Wednesday or Thursday.",
        "<strong>Weekly grounds ($295):</strong> All seven days. Only if you're actually going three or more times.",
        "<strong>Hospitality ($900-1,800/day):</strong> Upgraded food/drink, shaded seating, usually hole 18 or 17. Worth it for Saturday or Sunday.",
        "<strong>18th Hole Hospitality ($2,200+):</strong> The premium experience. Book 4+ months out. Corporate-entertaining tier.",
      ],
    },
    {
      kind: 'callout',
      label: "Our Heritage default",
      html: "For first-timers who want one great day: <strong>Saturday grounds pass plus a morning spent at hole 17</strong>. The short par-3 with the water carry is the most photogenic hole on the Atlantic coast, and Saturday's leaderboard pressure makes it theater.",
    },
    {
      kind: 'h2',
      text: "Where to stay during Heritage week",
    },
    {
      kind: 'p',
      html: "Lodging doubles in price and books out 9-10 months ahead. Three strategies:",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Sea Pines (on-resort):</strong> Walk to the course. $800-1,500/night for a villa. Book by July 2025 for 2026.",
        "<strong>Mid-island (Palmetto Dunes / Shipyard):</strong> 10-15 min drive. $500-900/night. More inventory, often your best bet if you're booking inside 6 months.",
        "<strong>Bluffton / off-island:</strong> 20-30 min drive. $300-500/night. The stealth play. Traffic is manageable if you leave Bluffton by 8 a.m.",
      ],
    },
    {
      kind: 'h2',
      text: "Parking strategy. Don't skip this",
    },
    {
      kind: 'p',
      html: "On-site Heritage parking is a multi-hour ordeal. The move: <strong>park at the Honey Horn / Coastal Discovery Museum lot on US-278</strong> and take the free shuttle in. Adds 25 min each way but cuts 90 min of traffic.",
    },
    {
      kind: 'p',
      html: "Better: have us arrange a private car or rideshare from your lodging. Total spend is $60-80 round trip; we recover that in Heritage-week time.",
    },
    {
      kind: 'h2',
      text: "Where to eat. Heritage-week adjusted",
    },
    {
      kind: 'p',
      html: "Every Hilton Head restaurant is at 130% capacity. Standard reservation rules change. Specifics:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Skull Creek Boathouse:</strong> Walk-ins dead. Book 3 weeks out.",
        "<strong>Red Fish:</strong> 4 weeks out. Call directly. They hold Heritage tables for returning clients.",
        "<strong>Michael Anthony's:</strong> 4 weeks out. Or the bar (5-10 p.m., walk-up).",
        "<strong>FARM Bluffton:</strong> The stealth move. 20 min drive, 15% easier reservation.",
        "<strong>On-course food at Heritage:</strong> Better than you think. The lobster roll at the 17th-hole tent is genuinely good.",
      ],
    },
    {
      kind: 'h2',
      text: "Three things visitors always get wrong",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Not buying Wednesday tickets:</strong> Practice rounds are 60% cheaper and you can walk inside the ropes at holes 15-18. First-timers underrate this.",
        "<strong>Driving onto the property Saturday morning:</strong> Grid-lock from 9-11 a.m. Arrive before 8 a.m. or after 11:30.",
        "<strong>Not staying for the plaid jacket:</strong> The winner is crowned at the 18th green around 6 p.m. Sunday. Tradition matters. Stay.",
      ],
    },
    {
      kind: 'h2',
      text: "The corporate / hospitality play",
    },
    {
      kind: 'p',
      html: "Groups of 6-20 use Heritage as an entertaining week. Our corporate Heritage package includes: 18th-hole hospitality passes, a villa base, private transport, three reserved dinners, and a round at Atlantic Dunes on Friday. Runs $6k-9k per person. We book these 8-12 months out.",
    },
    {
      kind: 'callout',
      label: "Price reality",
      html: "A \"normal\" Heritage-week trip for 4. Sea Pines villa, 3 nights, Thursday+Saturday grounds, 4 reserved dinners. Runs $6,500-9,000 all in for the group. For context, the same trip the following week (week after Heritage) runs $3,800-4,600.",
    },
    {
      kind: 'h2',
      text: "If you've never been. Go once",
    },
    {
      kind: 'p',
      html: "Heritage is one of the most walkable, well-run PGA Tour events. Course access is better than Augusta, the crowds more polite than Phoenix, the backdrop more photogenic than pretty much anywhere. Plaid jackets, lighthouse, Atlantic sunset on the 18th. Worth a bucket-list week.",
    },
    {
      kind: 'callout',
      label: "Planning for 2027?",
      html: "The 2027 RBC Heritage runs <strong>April 12-18, 2027</strong>. We're publishing a <a href=\"/guides/2027-rbc-heritage\">free 2027 Heritage Survival Kit</a> in February 2027 — tickets, parking, lodging, dinner reservations, the full week-by-week playbook. Reserve your copy now and we'll send it the moment it drops.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 11) Hilton Head with kids
// ---------------------------------------------------------------------------

const postWithKids: Post = {
  slug: 'hilton-head-with-kids',
  title: "Hilton Head With Kids: The Honest 7-Day Plan",
  excerpt:
    "The twelve activities that work, the three tourist traps to skip, and how to pace a week so the kids don't melt down on day 3.",
  description:
    "A local's honest Hilton Head with kids guide. Best beaches for toddlers, kid-friendly restaurants, and a meltdown-proof daily rhythm that works.",
  category: 'Planning',
  readTime: '10 min',
  publishedAt: '2026-03-18',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 4.5,
  relatedNeighborhoods: ['palmetto-dunes', 'forest-beach'],
  keywords: [
    'Hilton Head with kids',
    'Hilton Head family vacation',
    'Hilton Head toddler friendly',
    'Hilton Head kids activities',
    'family beach vacation South Carolina',
    'Hilton Head family resort',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head is the rare American beach destination genuinely built for kids. 12 miles of gentle Atlantic coast, 60 miles of paved bike path, a lighthouse you can climb, and restaurants that don't pretend kids don't exist. Here's the plan we give families. For a quick scan of the <a href=\"/local/family-activities\">kid-friendly things to do</a> on the island, start with our family activities directory.",
    },
    {
      kind: 'h2',
      text: "Where to stay with kids, ranked",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Palmetto Dunes (Omni or Marriott Grande Ocean):</strong> Best kids' programming, lagoons for kayaking, shortest beach walks. Our #1 for families of 4-8.",
        "<strong>Sea Pines (Beach Club villas):</strong> Gregg Russell nightly kids' concert, bike-path heaven, Lawton Stables for horseback. Best for multi-generational.",
        "<strong>Forest Beach (Sea Crest / Villamare condos):</strong> Walk to Coligny, best for budget families. Direct beach access from back door.",
        "<strong>Disney Hilton Head (Shelter Cove):</strong> Yes, really. Disney-level service, kids' programming, free shuttle to their private beach house.",
      ],
    },
    {
      kind: 'h2',
      text: "The daily rhythm that actually works",
    },
    {
      kind: 'p',
      html: "Families who melt down by day 3 are over-programming. The island rewards two-activity days, not five-activity ones. Our default rhythm:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Morning (7-10 a.m.):</strong> Active. Bike ride, kayak, beach before heat. This is when kids are best.",
        "<strong>Midday (11 a.m.-2 p.m.):</strong> Pool + lunch. Out of the sun. Short quiet time for little ones.",
        "<strong>Afternoon (3-5 p.m.):</strong> Second beach session or activity. Water is warmest now.",
        "<strong>Evening (6-8 p.m.):</strong> One dinner out OR grill at the villa. Not both. Not every night.",
      ],
    },
    {
      kind: 'callout',
      label: "The one rule",
      html: "Alternate villa-dinner nights with restaurant-dinner nights. Seven restaurant dinners in a row is the #1 source of family-trip burnout. Pick two nights for real restaurants, cook or pick-up the other five.",
    },
    {
      kind: 'h2',
      text: "Best beaches for kids by age",
    },
    {
      kind: 'h3',
      text: "Toddlers (0-4)",
    },
    {
      kind: 'p',
      html: "<strong>South Beach (Sea Pines):</strong> South-facing, protected from wind, smallest waves on the island. The shoreline is hard-packed. Great for stroller walks. Bathrooms, snack bar, and lifeguards in summer.",
    },
    {
      kind: 'h3',
      text: "Kids 5-10",
    },
    {
      kind: 'p',
      html: "<strong>Coligny Beach Park (Forest Beach):</strong> The only beach with full amenities. Lifeguards, bathrooms, showers, food. Walk to ice cream after. Best single kid-beach on the island.",
    },
    {
      kind: 'h3',
      text: "Tweens & teens (11+)",
    },
    {
      kind: 'p',
      html: "<strong>Burkes Beach (mid-island):</strong> Wider waves, fewer families, good for boogie-boarding and learning to surf. Access from Folly Field. Fewer amenities. Bring your own.",
    },
    {
      kind: 'h2',
      text: "Kid-friendly activities, ranked",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: "The ones kids remember forever.",
      accent: 'gold',
      items: [
        {
          name: 'Dolphin cruise with Captain Mark (Harbour Town)',
          meta: '$85/adult · 90 min · All ages',
          blurb:
            "Small-group boat, guaranteed dolphin sightings, kids learn the names of local pods. Better than the big-boat operators by a mile.",
        },
        {
          name: 'Bike the beach at low tide',
          meta: 'Free w/ rental · Ages 5+',
          blurb:
            "Rent bikes at Hilton Head Bicycle, ride 4 miles of hard sand at low tide. No cars, no stoplights. Pack snacks and make it a morning.",
        },
        {
          name: 'Gregg Russell kids\u2019 concert (Sea Pines Liberty Oak)',
          meta: 'Free · Nightly in summer',
          blurb:
            "Under the 400-year-old oak in Harbour Town. Kids dance, parents rest. Bring chairs and bug spray. A genuine island tradition.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: "Strong additions.",
      accent: 'primary',
      items: [
        {
          name: 'Coastal Discovery Museum',
          meta: 'Free · Ages 6+ · 1-2 hrs',
          blurb:
            "Butterfly garden in summer, marsh boardwalk, rainy-day lifesaver. Weekday mornings best.",
        },
        {
          name: 'Lawton Stables horseback ride',
          meta: '$95 · Ages 8+ · 1 hr',
          blurb:
            "Through the Sea Pines forest preserve. Beautiful, photogenic, kids love it.",
        },
        {
          name: 'Sandbox Children\u2019s Museum (Coligny)',
          meta: '$9/kid · Ages 1-8',
          blurb:
            "Best rainy-afternoon backup. 90 min of sensory play. Clean, well-staffed.",
        },
        {
          name: 'Salty Dog T-shirt factory',
          meta: 'Free · All ages · 30 min',
          blurb:
            "Watch the t-shirts being made. Buy one. It's a rite of passage. Skip the restaurant.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Skip with kids',
      subtitle: "What tourism boards push that doesn't work.",
      accent: 'rose',
      items: [
        {
          name: 'Harbour Town Lighthouse climb',
          meta: '$5 · 114 steps',
          blurb:
            "Under-5s can't do the stairs. 6+ are bored after 30 seconds. Pay for the photo, skip the climb.",
        },
        {
          name: 'Pirate-themed dinner cruise',
          meta: '$85/adult',
          blurb:
            "Loud, average food, over-long. The afternoon sightseeing version (no dinner) is fine.",
        },
        {
          name: 'Any commercial \"seashell tour\"',
          meta: '$60+/person',
          blurb:
            "Seashells are free at low tide. Just take them off the beach.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "Restaurants that welcome kids (and the ones that don't)",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Hudson\u2019s on the Docks:</strong> Casual, waterfront, fast. Kids eat, parents drink.",
        "<strong>Skull Creek Boathouse (early seating):</strong> 5-5:30 p.m. is genuinely family-friendly. After 7 it's date-night territory.",
        "<strong>Harbour Town Bakery:</strong> Breakfast. Ham biscuits. Eat outside near the lighthouse.",
        "<strong>Skillets Caf\u00e9 (Coligny):</strong> Pancakes. Kids pancakes. Pancakes for dinner if you want.",
        "<strong>Avoid for kids:</strong> Red Fish, Michael Anthony's, WiseGuys, Ela's. Adult restaurants doing adult things.",
      ],
    },
    {
      kind: 'h2',
      text: "What we actually book for families",
    },
    {
      kind: 'p',
      html: "A typical family-of-4 summer week through us: 3BR oceanfront villa in Palmetto Dunes, bikes delivered day 1, Captain Mark cruise pre-booked, Skull Creek 5:30 pm reservation for Tuesday, Gregg Russell Thursday night, kayak clinic Saturday morning. Total trip $6,200-8,500 all in. Our fee: $450 flat for the itinerary, or 8% of trip total if you want us to book the villa and handle concierge. Saves ~10 hrs of research and gets you the restaurant tables you can't get yourself. For the broader breakdown of <a href=\"/hilton-head-family-trip-planner\">Hilton Head family vacations</a> — neighborhoods, budgets, and trip lengths — see the family trip planner.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 12) Best Hilton Head beaches
// ---------------------------------------------------------------------------

const postBestBeaches: Post = {
  slug: 'best-hilton-head-beaches',
  title: "The Best Hilton Head Beaches, Ranked by Use Case",
  excerpt:
    "Coligny, Alder Lane, Folly Field, Burkes, Driessen, Fish Haul. Which beach for which trip, and the parking and tide reality nobody writes down.",
  description:
    "A local's guide to Hilton Head beaches. Coligny, Alder Lane, Folly Field, Burkes, Driessen, Fish Haul. Parking, access, and the right beach for your trip.",
  category: 'Activities',
  readTime: '10 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 2.8,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'best Hilton Head beaches',
    'Hilton Head public beach access',
    'Coligny Beach Park',
    'Alder Lane Beach',
    'Folly Field Beach',
    'Burkes Beach',
    'Driessen Beach Park',
    'Fish Haul Beach',
    'Hilton Head beach parking',
    'Hilton Head family beach',
  ],
  body: [
    {
      kind: 'p',
      html: "Pedal a mile north of Coligny at 7 a.m. and the sand belongs to you and three early walkers. Every beach on Hilton Head is public from the high-water mark down — the island has five dedicated access parks, four gated-community access points, and twelve miles of Atlantic shoreline. The question isn't whether you can get to the beach. It's which beach makes sense for your specific trip. Here's the local-authority breakdown.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Coligny Beach Park</strong> for first-timers who want boardwalk energy and free parking (get there by 9 a.m. in summer). <strong>Alder Lane</strong> for quiet couples. <strong>Folly Field</strong> for kids under five. <strong>Burkes</strong> for surfers and boogie-boarders. <strong>Fish Haul</strong> for sunrise walks. If you're inside a gated community (<a href=\"/hilton-head/sea-pines\">Sea Pines</a>, <a href=\"/hilton-head/palmetto-dunes\">Palmetto Dunes</a>, Shipyard), your private access beats all of them.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head public beaches at a glance',
    },
    {
      kind: 'p',
      html: "All five public access points have restrooms, outdoor showers, and seasonal lifeguards (May-September). The differences are parking supply, amenities, and crowd density. Here is what every beach actually offers:",
    },
    {
      kind: 'table',
      caption: 'Hilton Head public beach access: parking, amenities, and character',
      headers: ['Beach', 'Parking', 'Parking cost', 'Best for', 'Crowd level (July)'],
      rows: [
        ['Coligny Beach Park', '~200 spots, fills early', 'Free', 'First-timers, boardwalk shops, families', 'Very high'],
        ['Alder Lane Beach', '~45 metered spots', '$2/hr via ParkMobile', 'Quiet walks, couples, handicap access', 'Low'],
        ['Folly Field Beach Park', '~130 spots', '$2/hr via ParkMobile', 'Families with young kids (calm, shallow)', 'Medium-high'],
        ['Burkes Beach', '~50 spots', '$2/hr via ParkMobile', 'Surfers, boogie-boarders, quieter escape', 'Low-medium'],
        ['Driessen Beach Park', '~200 spots, ample', '$2/hr via ParkMobile', 'Lighter crowds, playground, grills', 'Medium'],
        ['Fish Haul Beach Park', '~40 spots', 'Free', 'Sunrise walks, birding, long walks', 'Very low'],
      ],
    },
    {
      kind: 'p',
      html: "Public access is only half the story. If you're staying inside <a href=\"/hilton-head/sea-pines\">Sea Pines</a>, <a href=\"/hilton-head/palmetto-dunes\">Palmetto Dunes</a>, or Shipyard, you have private gate-pass beach access points that never fill up and require zero parking hassle. Budget that into your lodging decision.",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: "The beaches we send clients to by default.",
      accent: 'gold',
      items: [
        {
          name: 'Coligny Beach Park',
          meta: 'Forest Beach · Free parking · Bathrooms, showers, playground',
          blurb:
            "The most popular beach on Hilton Head, and deservedly so. Wide sand, calm surf, free parking (if you arrive by 9 a.m. in summer), playground, outdoor showers, lifeguards, and Coligny Plaza shops and restaurants one block back. The only downside is the crowd; in peak July it can feel like a music festival. For first-time visitors, this is the right introduction to the island.",
        },
        {
          name: 'Alder Lane Beach Access',
          meta: 'South end · $2/hr parking · Shortest boardwalk on the island',
          blurb:
            "The quietest of the public accesses. A short boardwalk takes you straight to the sand, there's handicap beach matting, restrooms and outdoor showers, and seasonal lifeguards. Parking is tight (45 spots) but almost never completely full, even in July. This is where we send couples and anyone who wants the beach without the boardwalk scene.",
        },
        {
          name: 'Folly Field Beach Park',
          meta: 'Mid-island · $2/hr parking · Calm shallow surf, wheelchair accessible',
          blurb:
            "The best family beach on the island. Calm, shallow water that works for boogie-boarding, toddlers in the shore break, and first-time ocean swimmers. Wheelchair-accessible boardwalk, restrooms, showers, seasonal rentals, and a parking lot that almost always has spaces. For families with kids under seven, this is the right default.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: "Strong picks for the right trip.",
      accent: 'primary',
      items: [
        {
          name: 'Burkes Beach',
          meta: 'Mid-island · $2/hr parking · Surf break',
          blurb:
            "The best surf on Hilton Head (such as it is). Waves here are bigger than anywhere else on the island, which still isn't big by East Coast standards but means boogie boards, skim boards, and small longboards work on a 2-4 ft swell. Parking is tight and the walk from lot to sand is longer than Alder or Folly. Worth it if surf is why you're here.",
        },
        {
          name: 'Driessen Beach Park',
          meta: 'Mid-island · $2/hr parking · Playground, grills, pavilion',
          blurb:
            "Lighter crowds than Coligny with the same family amenities (playground, grills, picnic pavilion). A longer walk from the parking lot to the sand (about 4 minutes through a pine-shaded boardwalk), which deters the beach-umbrella-on-wheels crowd. For a day-long beach trip with gear and kids, this is often the move.",
        },
        {
          name: 'Fish Haul Beach Park',
          meta: 'North end · Free parking · Secluded, birding-friendly',
          blurb:
            "The most secluded public beach on the island. Free parking, a 5-minute walk through maritime forest to the sand, and then a wide quiet stretch that's often nearly empty. Best for sunrise walks, birding, and long beach walks (you can walk 2+ miles north toward Port Royal Sound without crowds). Not a classic swim beach; the shelf here is steeper.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'How tide timing changes your beach day',
    },
    {
      kind: 'p',
      html: "Hilton Head's tidal range runs 6-8 feet. That matters more than any other single variable. At low tide, the beach is 150-200 feet wide of hard-packed sand that you can bike, run, or walk for miles. At high tide, the usable beach narrows to 6-20 feet in some stretches. Two hours before high tide is the sweet spot for swimming (deepest water close to shore); low tide is the sweet spot for biking and shell-collecting.",
    },
    {
      kind: 'p',
      html: "Check the NOAA tide chart for \"Hilton Head Island\" or pull it up on any weather app. Match your beach plan to the tide, not the clock. A 2 p.m. beach day at dead-low tide is a very different beach than a 2 p.m. day at high tide.",
    },
    {
      kind: 'h2',
      text: 'Which beach for which trip',
    },
    {
      kind: 'ul',
      items: [
        "<strong>Couples, honeymoon:</strong> Alder Lane for the day, Fish Haul at sunrise. See the <a href=\"/hilton-head-honeymoon\">Hilton Head honeymoon planner</a>.",
        "<strong>Families with toddlers and preschoolers:</strong> Folly Field Beach Park for calm shallow water.",
        "<strong>Families with kids 7-14:</strong> Coligny for the boardwalk energy, or Driessen for a quieter version.",
        "<strong>Biking the beach at low tide:</strong> Enter at Coligny, ride south to Sea Pines, or north from Driessen. Hard-packed sand for 6+ miles.",
        "<strong>Surfers and boogie-boarders:</strong> Burkes Beach. Check the swell forecast for the east coast.",
        "<strong>Sunrise walkers, birders:</strong> Fish Haul (north end) or Alder Lane (south end).",
        "<strong>Groups with gear, grills, playground needs:</strong> Driessen Beach Park has the best pavilion setup.",
      ],
    },
    {
      kind: 'h2',
      text: 'Beach amenity and rental intel',
    },
    {
      kind: 'p',
      html: "Beach umbrellas, chairs, boogie boards, and kayaks are rentable at Coligny, Folly Field, Driessen, and Burkes through Shore Beach Services (the island concession). Rates run $30-50/day for a chair-and-umbrella setup. Pre-book for peak weeks; the rental racks can run out by 9 a.m. on a hot Saturday. If you're staying inside a gated community, many villa rentals include a beach cart and some include chair-and-umbrella service.",
    },
    {
      kind: 'h2',
      text: 'Best time of year to visit the beach',
    },
    {
      kind: 'p',
      html: "Ocean water temperatures shape beach quality more than air temperature. Peak water temp is 84\u00b0F in July-August. September stays at 80\u00b0F while air temps drop to the 80s. October (73\u00b0F water) is the sweet spot most visitors miss: swimmable water, light crowds, beach rates 30-40% below summer. For the full month-by-month breakdown, see the <a href=\"/blog/best-time-to-visit-hilton-head\">Hilton Head weather guide</a>.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head beaches: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'What is the best beach on Hilton Head Island?',
          a: "Coligny Beach Park for most first-time visitors (free parking, most amenities, classic boardwalk scene). Alder Lane if you want quiet. Folly Field if you have young kids. There isn't one best beach; the sand itself is similar along most of the 12-mile shoreline. The differences are parking, crowd density, and nearby amenities.",
        },
        {
          q: 'How much does beach parking cost on Hilton Head?',
          a: "Coligny Beach Park and Fish Haul Beach Park have free parking. All other public access points charge $2/hour via the ParkMobile app or coin meter, with daily caps around $12-16. Inside gated communities (Sea Pines, Palmetto Dunes, Shipyard), beach access is included with your lodging or a day-pass ($10-15).",
        },
        {
          q: 'Can you walk on Hilton Head beaches at low tide?',
          a: "Yes, and it's one of the best things to do on the island. At low tide the beach is 150-200 feet of hard-packed sand. You can walk (or bike) continuously for 12 miles from Port Royal Sound to Sea Pines with only the Cross Island Parkway bridge as an interruption. Low-tide walks are easier than high-tide walks and the hard sand is easier on knees.",
        },
        {
          q: 'Are dogs allowed on Hilton Head beaches?',
          a: "Yes, with restrictions. From April 1 through September 30, dogs are allowed on the beach only before 10 a.m. and after 5 p.m. From October 1 through March 31, dogs are allowed all day. Leashes are required year-round. Owners must clean up; fines are enforced.",
        },
        {
          q: 'Can you swim in the ocean at Hilton Head?',
          a: "Yes, from late May through October. Peak water temperature is 84\u00b0F in July-August. Early-season swimmers can start mid-April (67\u00b0F water) if they don't mind cold; by May (74\u00b0F) it's comfortable for most adults. October is the quietest warm-water month (73\u00b0F, crowds gone).",
        },
        {
          q: "What's the difference between Coligny Beach and Alder Lane?",
          a: "Coligny is the busier beach: free parking, playground, wide sand, boardwalk shops and restaurants one block back, classic summer-crowd energy. Alder Lane is quieter: $2/hour metered parking, short boardwalk, shorter walk to the sand, genuinely less crowded even in July. Couples and anyone wanting quiet should pick Alder; families and first-time visitors should pick Coligny.",
        },
        {
          q: 'Is Coligny Beach Park parking really free?',
          a: "Yes, but you have to arrive early. The lot has roughly 200 spaces and fills by 9:30 a.m. on summer Saturdays and by 10:30 a.m. on weekdays. If the lot is full, the next-closest paid lots are 0.3 miles back. Alternative: park at Coligny Plaza (paid) and walk two minutes to the beach.",
        },
        {
          q: "Are there lifeguards on Hilton Head beaches?",
          a: "Seasonal lifeguards are posted at Coligny, Alder Lane, Folly Field, Burkes, and Driessen from Memorial Day through Labor Day, roughly 10 a.m. to 5 p.m. Fish Haul and off-hours access points are unguarded. Follow posted flags (green = OK, yellow = caution, red = dangerous current).",
        },
        {
          q: 'Can I rent beach chairs and umbrellas on Hilton Head?',
          a: "Yes, at Coligny, Folly Field, Driessen, and Burkes through Shore Beach Services. A chair-and-umbrella setup runs $30-50/day. Boogie boards, beach wagons, and kayaks are also rentable. Pre-book for peak weeks; rental inventory can run out by 9 a.m. on hot Saturdays.",
        },
        {
          q: 'Which Hilton Head beach is best for young kids?',
          a: "Folly Field Beach Park. The water is calm and shallow, wheelchair-accessible boardwalk, restrooms and showers, seasonal lifeguards, and parking usually available. Coligny works too but the crowds in peak season are intense for toddlers. See the <a href=\"/blog/hilton-head-with-kids\">Hilton Head with kids guide</a> for a full family plan.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head beach week',
    },
    {
      kind: 'p',
      html: "The beach is the reason most people come to Hilton Head, but the wrong address turns a beach-focused week into a drive-to-the-beach week. If you want us to match your group to the right lodging for the beach you actually want, the <a href=\"/itinerary\">$450 itinerary service</a> handles it. For oceanfront villa specifics, see the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas planner</a>; for the broader trip frame, our <a href=\"/hilton-head-beaches\">Hilton Head beach vacation guide</a> covers villa-to-sand logistics. For timing, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather guide</a> walks through water temperatures month by month.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 13) 3-day Hilton Head itinerary
// ---------------------------------------------------------------------------

const post3DayItinerary: Post = {
  slug: 'hilton-head-3-day-itinerary',
  title: "3 Days on Hilton Head: The Local's Hour-by-Hour Plan",
  excerpt:
    "Three days, three districts, and the twelve things worth doing. A tight itinerary for first-timers who want the full island without rushing it.",
  description:
    "A local's 3-day Hilton Head itinerary. Hour-by-hour plan through Harbour Town, Coligny, Sea Pines, Bluffton, and the best dinners in between.",
  category: 'Planning',
  readTime: '11 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 2.6,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'Hilton Head 3 day itinerary',
    '48 hours Hilton Head',
    'weekend in Hilton Head',
    'Hilton Head weekend getaway',
    'Hilton Head 72 hours',
    'Hilton Head long weekend',
    'Hilton Head short trip',
    '3 days in Hilton Head',
  ],
  body: [
    {
      kind: 'p',
      html: "You land Friday at noon and lift off Monday at 10 a.m. — 68 hours, two dinners, and a beach day that has to actually be a beach day. The classic mistake on a 3-day Hilton Head trip is trying to see all twelve miles in one push. You can't, and forcing it means 45 minutes of driving between every meal. Pick three districts, anchor each day in one, and let the island do its thing. Here's the itinerary we send to weekenders.",
    },
    {
      kind: 'callout',
      label: 'The short version',
      html: "<strong>Day 1:</strong> Forest Beach + Coligny (settle in, ocean day, casual dinner). <strong>Day 2:</strong> Sea Pines + Harbour Town (bike, golf or lighthouse, S-tier dinner). <strong>Day 3:</strong> Bluffton day trip + sunset sail (one Lowcountry town, one water exit). Three districts, twelve things, one car key per day.",
    },
    {
      kind: 'h2',
      text: 'Before you arrive',
    },
    {
      kind: 'p',
      html: "Four bookings handle 80% of the trip quality. Book them before you land:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Villa or hotel:</strong> 3-4 months out in peak season. See the <a href=\"/blog/2026-best-places-to-stay-hilton-head\">2026 best places to stay</a> post.",
        "<strong>Saturday dinner:</strong> 2-3 weeks out at Skull Creek Boathouse or Michael Anthony's (our S-tier picks).",
        "<strong>Sunday morning activity:</strong> Dolphin cruise with Captain Mark (2-3 weeks), kayak with Outside Hilton Head (1-2 weeks), or a tee time.",
        "<strong>Bike rental:</strong> Book 1 week out through Hilton Head Bicycle; they deliver to the villa.",
      ],
    },
    {
      kind: 'h2',
      text: 'Day 1. Arrival, beach, Forest Beach dinner',
    },
    {
      kind: 'h3',
      text: "Morning \u2014 arrive, unpack, don't over-program",
    },
    {
      kind: 'p',
      html: "Most flights land at Savannah/Hilton Head International (SAV) before noon. A 45-minute drive puts you at the villa by 1 p.m. Skip the \u201Clet's hit the beach immediately\u201D move. Unpack, grab lunch at <strong>Harbour Town Bakery</strong> (the ham biscuit is the move) or <strong>Sea Shack</strong> if you're in Forest Beach.",
    },
    {
      kind: 'h3',
      text: "Afternoon \u2014 Coligny Beach, low-stakes",
    },
    {
      kind: 'p',
      html: "Head to <a href=\"/hilton-head-beaches\">Coligny Beach Park</a> (free parking) or the gated access if you're staying in Sea Pines, Palmetto Dunes, or Shipyard. Bring minimal gear on day 1. Walk the beach, figure out which direction the tide is running, scout dinner options at Coligny Plaza. Two hours is plenty.",
    },
    {
      kind: 'h3',
      text: "Evening \u2014 walkable dinner",
    },
    {
      kind: 'p',
      html: "Night 1 is not the night for your S-tier reservation. You'll be tired. Go walkable-casual: <strong>Poseidon</strong> at Shelter Cove (rooftop, sunset), <strong>A Lowcountry Backyard</strong> (shrimp and grits, kid-friendly), or <strong>The Sea Shack</strong> for walk-in seafood. Home by 9 p.m. Day 2 needs energy.",
    },
    {
      kind: 'h2',
      text: 'Day 2. Sea Pines, bike, and the serious dinner',
    },
    {
      kind: 'h3',
      text: "Morning \u2014 bike ride at low tide",
    },
    {
      kind: 'p',
      html: "Check the tide chart the night before. Low tide anywhere 7-11 a.m. means you bike on hard-packed sand. Start at Coligny or your villa, ride south toward Sea Pines for 30-45 minutes, grab breakfast at <a href=\"/hilton-head/sea-pines\">South Beach Marina</a> or Salty Dog Cafe. The best single hour on Hilton Head.",
    },
    {
      kind: 'h3',
      text: "Afternoon \u2014 choose your Sea Pines",
    },
    {
      kind: 'p',
      html: "Pick one of three: (1) <strong>Harbour Town + lighthouse</strong> \u2014 climb it for the photo, browse shops, grab a drink at Quarterdeck. (2) <strong>Nine holes at Atlantic Dunes</strong> if you golf. (3) <strong>Sea Pines Forest Preserve</strong> walk to the Dragon Tree \u2014 605 acres of maritime forest, nearly empty on weekday afternoons. Pair with a pool afternoon at the villa before dinner.",
    },
    {
      kind: 'h3',
      text: "Evening \u2014 your S-tier dinner",
    },
    {
      kind: 'p',
      html: "Book <strong>Skull Creek Boathouse</strong> (waterfront, sunset, the 6:45-7:15 p.m. window), <strong>Michael Anthony's</strong> (fine dining, quieter), or <strong>Red Fish</strong> (Lowcountry refined). Arrive 15 minutes before your reservation, request water-side or patio, and order oysters. Don't plan anything after; good dinners on Hilton Head run two hours.",
    },
    {
      kind: 'h2',
      text: 'Day 3. Bluffton day trip and the water exit',
    },
    {
      kind: 'h3',
      text: "Morning \u2014 drive to Old Town Bluffton",
    },
    {
      kind: 'p',
      html: "Leave by 9 a.m. for the 18-minute drive to <a href=\"/bluffton-travel-planner\">Old Town Bluffton</a>. Walk Calhoun Street, poke into the galleries, visit Heyward House if history is your thing. Lunch at <strong>The Cottage</strong> (pimento cheese biscuit, coastal salads) or <strong>Captain Woody's</strong> (casual seafood). Back on the island by 2 p.m.",
    },
    {
      kind: 'h3',
      text: "Afternoon \u2014 pool or Pinckney",
    },
    {
      kind: 'p',
      html: "Hot weather: pool afternoon at the villa. Cooler weather or birders: <strong>Pinckney Island National Wildlife Refuge</strong> for a 90-minute hike (alligators, egrets, no crowds). Either way, rest before the evening activity.",
    },
    {
      kind: 'h3',
      text: "Evening \u2014 sunset sail, then home",
    },
    {
      kind: 'p',
      html: "The proper Hilton Head exit is on the water. Book a <strong>private sunset sail</strong> out of Palmetto Bay Marina ($500-1,200 for up to 6, 90 minutes). The public sunset cruises are fine but feel like a bus; the private charter feels like the Caribbean. Dinner at the marina afterward at <strong>Ela's on the Water</strong>.",
    },
    {
      kind: 'h2',
      text: '3-day itinerary at a glance',
    },
    {
      kind: 'table',
      caption: 'Hilton Head 3-day itinerary: time-block summary',
      headers: ['Day', 'Morning', 'Afternoon', 'Evening'],
      rows: [
        ['Day 1 (Arrival)', 'Fly in, villa check-in, Harbour Town Bakery lunch', 'Coligny or gated beach, 2 hours', 'Walkable dinner (Poseidon / Sea Shack)'],
        ['Day 2 (Sea Pines)', 'Low-tide beach bike ride, breakfast at South Beach', 'Lighthouse OR Forest Preserve OR 9 holes', "Skull Creek or Michael Anthony's (booked 2-3 weeks out)"],
        ['Day 3 (Bluffton + water)', 'Old Town Bluffton, Calhoun Street, lunch at The Cottage', 'Pool OR Pinckney Island hike', "Private sunset sail, Ela's on the Water"],
      ],
    },
    {
      kind: 'h2',
      text: 'Where to stay for a 3-day trip',
    },
    {
      kind: 'p',
      html: "For 3 days, prioritize walkability. Two great bases: <a href=\"/hilton-head/forest-beach\">Forest Beach</a> (walk to Coligny, Sea Shack, and the beach) or a <a href=\"/harbour-town-villas\">Harbour Town villa</a> (walk to the marina, lighthouse, and S-tier golf). Both let you park the car Friday and barely touch it until Sunday. Full-resort properties work too but the walkability premium is real on a short trip.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head 3-day itinerary: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Is 3 days enough for Hilton Head?',
          a: "Yes, for a first visit. Three days is tight but workable if you anchor each day in one district and skip the urge to drive the whole island. For a family vacation with pool time, 5-7 days is better. For a couples\u2019 weekend, a food trip, or a golf getaway, 3 days is the sweet spot.",
        },
        {
          q: 'What is the best Hilton Head weekend itinerary?',
          a: "The short version: Day 1 beach and casual dinner in Forest Beach or Coligny. Day 2 Sea Pines (bike, Harbour Town or golf) plus S-tier dinner. Day 3 Bluffton day trip plus a sunset sail. Three districts, three dinners, minimal driving. The full hour-by-hour is in this post above.",
        },
        {
          q: 'What are the must-do activities on a 3-day Hilton Head trip?',
          a: "Four: a low-tide beach bike ride, one S-tier dinner, Harbour Town at sunset, and a sunset sail. Everything else is optional. If you have kids, swap the sunset sail for a Captain Mark dolphin cruise.",
        },
        {
          q: 'Should I visit Bluffton on a 3-day Hilton Head trip?',
          a: "Yes, for at least half a day. Bluffton is 18 minutes off the north end of the island and gives you a second Lowcountry flavor (19th-century fishing village, galleries, Palmetto Bluff nearby). Lunch or dinner in Old Town Bluffton is a standard part of our 3-day plans.",
        },
        {
          q: 'Do I need a car for a 3-day Hilton Head trip?',
          a: "Yes, unless you stay in a walkable neighborhood (Forest Beach near Coligny, or a Harbour Town villa inside Sea Pines) and stay put for the weekend. Uber and Lyft coverage thins out after 9 p.m. The Bluffton day trip on Day 3 requires driving.",
        },
        {
          q: "What's the best time of year for a 3-day Hilton Head trip?",
          a: "Mid-October is the single best weekend of the year (73\u00b0F water, empty beaches, rates 30-40% below summer, reservations walk-in-able). Early May is a close second. Thanksgiving week is an underrated value play. For the full month-by-month, see the <a href=\"/blog/best-time-to-visit-hilton-head\">weather and best time guide</a>.",
        },
        {
          q: 'Is 3 days in Hilton Head enough to golf?',
          a: "Yes, for one round. Morning rounds at Atlantic Dunes or Heron Point work on Day 2 without wrecking the rest of the day. For a golf-focused trip, plan on 4-5 days to play multiple courses. See the <a href=\"/blog/hilton-head-golf-trip\">Hilton Head golf trip guide</a>.",
        },
        {
          q: "How is this different from the CVB's \u201C48 hours\u201D itinerary?",
          a: "The Visit Hilton Head Island CVB publishes a 48-hour plan that covers Coligny, Harbour Town, and one dinner. Our 3-day plan adds the Bluffton half-day, swaps in specific restaurant picks, pins each day to a single district so you don't burn 45 minutes in traffic per meal, and calls out which bookings actually need to happen before you land.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Want us to book it?',
    },
    {
      kind: 'p',
      html: "A 3-day Hilton Head trip lives or dies on the four reservations above. If you want us to lock the villa, the Saturday dinner, the sunset sail, and the bike delivery before you land, the <a href=\"/itinerary\">$450 itinerary service</a> handles it. For longer trips, see the <a href=\"/blog/hilton-head-7-day-itinerary\">7-day itinerary</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 14) 7-day Hilton Head itinerary
// ---------------------------------------------------------------------------

const post7DayItinerary: Post = {
  slug: 'hilton-head-7-day-itinerary',
  title: "A Perfect Week on Hilton Head: The 7-Day Plan",
  excerpt:
    "Seven days, five districts, and the pacing that keeps a family trip from melting down by Wednesday. Our full week-on-the-island plan.",
  description:
    "A local's 7-day Hilton Head itinerary. Pacing, daily activities, best dinner sequence, Bluffton day trip, and the rest days that make a week work.",
  category: 'Planning',
  readTime: '13 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 2.7,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'Hilton Head 7 day itinerary',
    'week in Hilton Head',
    'Hilton Head week trip',
    'Hilton Head vacation plan',
    'Hilton Head 7 days',
    'one week Hilton Head',
    'Hilton Head family week itinerary',
    'Hilton Head activities week',
  ],
  body: [
    {
      kind: 'p',
      html: "By Wednesday the watch is on the dresser and you've stopped checking it. A week on Hilton Head is longer than most visitors think they need and shorter than they realize once they arrive — seven days is enough to hit every district, play a real round of golf, do a proper Bluffton night, and still have three rest days. The mistake is trying to program all seven. Here's the plan we send clients.",
    },
    {
      kind: 'callout',
      label: 'The principle',
      html: "Alternate <strong>anchor days</strong> (one big activity, one real dinner) with <strong>flex days</strong> (pool, beach, nap, walk-in lunch). A seven-day trip needs at least three flex days or everyone melts down by Wednesday. We build the week around booked reservations, not around filling every slot.",
    },
    {
      kind: 'h2',
      text: 'Day 1 (Saturday). Arrival',
    },
    {
      kind: 'p',
      html: "Fly into Savannah. Check into the villa, unpack, grocery run if self-catering. First dinner walkable-casual (Poseidon at Shelter Cove, A Lowcountry Backyard, or Sea Shack). Save the S-tier restaurant for Tuesday when jet lag is gone.",
    },
    {
      kind: 'h2',
      text: 'Day 2 (Sunday). First beach day',
    },
    {
      kind: 'p',
      html: "Low-key. Beach morning, pool afternoon, walk to the marina for dinner (<a href=\"/hilton-head/shelter-cove\">Ela's on the Water</a> if you're in Shelter Cove, South Beach Marina if you're in Sea Pines). Don't drive more than 10 minutes all day. Sundays are for the neighborhood.",
    },
    {
      kind: 'h2',
      text: 'Day 3 (Monday). The signature activity day',
    },
    {
      kind: 'p',
      html: "Pick one marquee activity: <strong>Captain Mark's dolphin cruise</strong> out of Harbour Town, a <strong>sunset sail</strong> on Calibogue Sound, a <strong>kayak tour of Broad Creek</strong> with Outside Hilton Head (7 a.m. slot is best), or an <strong>offshore fishing charter</strong>. Afternoon rest. Dinner at your second-favorite option; S-tier gets Tuesday.",
    },
    {
      kind: 'h2',
      text: 'Day 4 (Tuesday). S-tier dinner night',
    },
    {
      kind: 'p',
      html: "Program light during the day. Bike Sea Pines, climb the lighthouse, walk the Forest Preserve to Dragon Tree, hit Coligny for a walking tour. At night, the big reservation: <strong>Skull Creek Boathouse</strong>, <strong>Michael Anthony's</strong>, or <strong>Red Fish</strong>. Arrive early, sit by the water if possible, order oysters, let dinner take two hours.",
    },
    {
      kind: 'h2',
      text: 'Day 5 (Wednesday). The flex day',
    },
    {
      kind: 'p',
      html: "This is the day the trip breathes. No alarms, no reservations, no itinerary. Pool, book, beach, nap. If the weather turns, the <strong>Coastal Discovery Museum</strong> is worth 90 minutes. If you have energy, rent a kayak or paddleboard at South Beach Marina. Walk-in dinner wherever you feel like it.",
    },
    {
      kind: 'h2',
      text: 'Day 6 (Thursday). Bluffton day trip',
    },
    {
      kind: 'p',
      html: "Morning: drive 18 minutes to <a href=\"/bluffton-travel-planner\">Old Town Bluffton</a>. Walk Calhoun Street, Heyward House, galleries. Lunch at The Cottage. Afternoon: Palmetto Bluff for a walk along the May River, or straight back to the villa for pool time. Evening: dinner at <strong>FARM Bluffton</strong> (book 3 weeks out). If you only eat one dinner in Bluffton all week, make it this one.",
    },
    {
      kind: 'h2',
      text: 'Day 7 (Friday). Golf morning or beach day',
    },
    {
      kind: 'p',
      html: "Two tracks depending on the group. Track A: <strong>golf</strong> at Atlantic Dunes, Heron Point, or Harbour Town (if you have Sea Pines stay-and-play priority). Track B: <strong>full beach day</strong> at a different beach than earlier in the week (try Driessen or Alder Lane for variety; see the <a href=\"/blog/best-hilton-head-beaches\">beaches guide</a>). Dinner at Hudson's for the casual Hilton Head sunset send-off.",
    },
    {
      kind: 'h2',
      text: 'Day 8 (Saturday). Departure',
    },
    {
      kind: 'p',
      html: "Late check-out if possible. Harbour Town Bakery ham biscuit on the way to the airport. Don't program an activity on departure day; traffic to SAV doubles on Saturday mornings and every extra activity is a risk to a morning flight. Airport by one hour before departure for domestic.",
    },
    {
      kind: 'h2',
      text: '7-day itinerary at a glance',
    },
    {
      kind: 'table',
      caption: 'Hilton Head 7-day itinerary: week-at-a-glance',
      headers: ['Day', 'Theme', 'Morning', 'Afternoon', 'Evening'],
      rows: [
        ['Sat', 'Arrival', 'Fly in, villa, groceries', 'Unpack, pool', 'Walkable casual dinner'],
        ['Sun', 'First beach day', 'Beach', 'Pool', 'Marina dinner, in-neighborhood'],
        ['Mon', 'Signature activity', 'Dolphin cruise, kayak, or sail', 'Rest / pool', 'Second-tier dinner'],
        ['Tue', 'S-tier dinner', 'Bike or lighthouse', 'Light program', "Skull Creek / Michael Anthony's / Red Fish"],
        ['Wed', 'Flex day', 'No alarms', 'Pool, book, nap', 'Walk-in dinner'],
        ['Thu', 'Bluffton', 'Old Town walk', 'Palmetto Bluff or pool', 'FARM Bluffton (booked 3 weeks out)'],
        ['Fri', 'Golf or big beach', 'Tee time or new beach', 'Pool, packing begins', "Hudson's sunset dinner"],
        ['Sat', 'Departure', 'Harbour Town Bakery', 'Drive to SAV', '\u2014'],
      ],
    },
    {
      kind: 'h2',
      text: 'Pacing, honestly',
    },
    {
      kind: 'p',
      html: "The 7-day trap is over-programming. Four activity days plus three flex days is the right split for a family; five plus two is the right split for couples on a food-focused trip. More than five structured days and someone (usually a kid) melts down by Thursday. Three booked dinners (Days 4, 6, and 7) plus four open dinners is the right balance. Book the three that matter; let the rest drift.",
    },
    {
      kind: 'h2',
      text: 'What this week actually costs',
    },
    {
      kind: 'p',
      html: "A family of four in a 3BR Palmetto Dunes oceanfront villa, mid-June:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Villa (7 nights):</strong> $6,500-8,500 peak, $4,500-6,000 shoulder (late May or September).",
        "<strong>Food:</strong> $1,200-1,800 with three big dinners plus groceries for lunch and breakfast.",
        "<strong>Activities:</strong> $600-1,200 (dolphin cruise, one golf round, bike rental, one sunset sail).",
        "<strong>Gas and transport:</strong> $150-250.",
        "<strong>Total:</strong> $8,500-11,500 all in for a peak-week trip of four.",
      ],
    },
    {
      kind: 'h2',
      text: 'Hilton Head 7-day itinerary: frequently asked questions',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Is 7 days too long on Hilton Head?',
          a: "No, for most trips. The island has enough to fill a week if you pace it right (four active days, three flex days) and add a Bluffton day trip. Where 7 days starts to feel long: a couples\u2019 weekend with no beach interest, or a winter trip where pool days are off the menu.",
        },
        {
          q: 'What is the best Hilton Head week itinerary for a family?',
          a: "Alternating anchor days and flex days: beach day, big activity, rest, S-tier dinner, pool day, Bluffton trip, golf or big-beach finale. Three booked dinners (Days 4, 6, 7) plus four open dinners. The full day-by-day is in this post above.",
        },
        {
          q: 'Which day of the week is best to fly into Hilton Head?',
          a: "Saturday is the most common (villa turnover day) but Sunday arrivals avoid the traffic on US-278 onto the island. If your villa allows, a Sunday-to-Saturday week gets you quieter airport and road experiences on both ends.",
        },
        {
          q: 'Should I plan a Bluffton trip into a 7-day Hilton Head vacation?',
          a: "Yes. A Bluffton day trip (Day 6 in our plan) adds one of the best dinners in the region (FARM), a walkable 19th-century fishing village, and access to Palmetto Bluff. It's the single best variety day we build into a Hilton Head week. See the <a href=\"/bluffton-travel-planner\">Bluffton travel planner</a>.",
        },
        {
          q: 'How much does a 7-day Hilton Head trip cost?',
          a: "A family-of-four peak-summer trip in a 3BR oceanfront villa runs $8,500-11,500 all in. Shoulder season (late May, September, October) drops that to $6,000-8,500. Winter long-stays are dramatically cheaper (see the <a href=\"/hilton-head-winter-rental\">Hilton Head winter rental page</a>).",
        },
        {
          q: 'Do I need to pre-book activities for a week on Hilton Head?',
          a: "Book three things before arrival: your S-tier dinner (Skull Creek, Michael Anthony's, or Red Fish, 2-3 weeks out), your signature activity (dolphin cruise, sunset sail, or charter, 4-6 weeks out in peak), and the Bluffton dinner (FARM, 3 weeks out). Everything else can be done on arrival or walk-in.",
        },
        {
          q: 'What should I do on a rainy day during a Hilton Head week?',
          a: "Coastal Discovery Museum, Sandbox Children's Museum, the Arts Center of Coastal Carolina, or a pickleball clinic under a covered court. Summer thunderstorms typically clear in 30-60 minutes; plan beach time for morning and indoor backups for 3-5 p.m.",
        },
        {
          q: 'Is a 7-day Hilton Head trip worth it?',
          a: "For families with kids, almost always yes. For couples, 4-5 days is often a better balance than a full week. For golfers, 5 days gets you three rounds with rest days. Length depends on use case; pace matters more than total days.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan the week with us',
    },
    {
      kind: 'p',
      html: "A Hilton Head week lives or dies on the villa pick, the three dinners, and the signature activity. Everything else can be flex. If you want us to lock those four things before you arrive, the <a href=\"/itinerary\">$450 itinerary service</a> handles it. For shorter trips, see the <a href=\"/blog/hilton-head-3-day-itinerary\">3-day itinerary</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 15) Hilton Head vs Myrtle Beach comparison
// ---------------------------------------------------------------------------

const postHHvsMyrtleBeach: Post = {
  slug: 'hilton-head-vs-myrtle-beach',
  title: "Hilton Head vs Myrtle Beach: Which South Carolina Coast Is Right for You",
  excerpt:
    "Both sit on the South Carolina coast. They could not be more different. A local-side breakdown of who each one is actually for.",
  description:
    "Hilton Head vs Myrtle Beach: cost, vibe, beaches, food, activities, and who each coastline is for. A local's straight-answer comparison for 2026.",
  category: 'Planning',
  readTime: '9 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 3.2,
  keywords: [
    'Hilton Head vs Myrtle Beach',
    'Myrtle Beach vs Hilton Head',
    'Myrtle Beach or Hilton Head',
    'which is better Myrtle Beach or Hilton Head',
    'Hilton Head Myrtle Beach comparison',
    'South Carolina beach comparison',
  ],
  body: [
    {
      kind: 'p',
      html: "Both sit on the South Carolina coast. Both have wide Atlantic beaches. That's where the similarity ends. Hilton Head and Myrtle Beach are aimed at genuinely different travelers and the wrong pick can ruin a vacation. Here is the straight comparison we walk clients through.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Hilton Head</strong> if you want upscale-quiet: golf, restaurants, bike paths, wildlife refuges, Spanish-moss oaks, and a resort feel without neon. <strong>Myrtle Beach</strong> if you want energy: amusement parks, boardwalks, outlet shopping, live shows, cheap hotels, and the beach-vacation-of-America vibe. Both are good at what they do. They are not substitutes.",
    },
    {
      kind: 'h2',
      text: 'The fundamental difference',
    },
    {
      kind: 'p',
      html: "Myrtle Beach is a 60-mile strip of beach towns (\u201CThe Grand Strand\u201D) built around high-volume affordable tourism. Seventeen million visitors a year. Think Orlando-by-the-sea: SkyWheel, Ripley's, mini-golf every third block, chain restaurants, $75-a-night motels in the off-season. Myrtle is for families who want lots to do at a reasonable cost.",
    },
    {
      kind: 'p',
      html: "Hilton Head is a 12-mile barrier island built around gated residential communities and resort golf. Three million visitors a year. Think Kiawah-meets-Amelia: live oaks, bike paths, Harbour Town lighthouse, five championship golf courses, $150-a-night-minimum lodging, restaurants that require reservations. Hilton Head is for travelers who pay more for quiet.",
    },
    {
      kind: 'h2',
      text: 'Side-by-side comparison',
    },
    {
      kind: 'table',
      caption: 'Hilton Head vs Myrtle Beach: the category-by-category breakdown',
      headers: ['Dimension', 'Hilton Head', 'Myrtle Beach'],
      rows: [
        ['Overall vibe', 'Upscale-quiet, Spanish moss, gated', 'Energetic boardwalk, family-amusement, neon'],
        ['Avg lodging (peak, 3BR)', '$4,500-9,000/week', '$1,500-4,500/week'],
        ['Avg lodging (peak, hotel)', '$250-500/night', '$120-280/night'],
        ['Beach character', '12 mi wide hard-packed, undeveloped dunes', '60 mi Grand Strand, high-rises dense at waterline'],
        ['Restaurant scene', 'Reservations-required, 15-20 S-tier', 'Chain dense, 250+ choices, walk-in easy'],
        ['Golf', '5 championship courses incl. Harbour Town (PGA)', '90+ courses, mass-market pricing'],
        ['Family amusement', 'Minimal (no piers, no SkyWheel)', 'Dominant (Family Kingdom, SkyWheel, mini-golf)'],
        ['Shopping', 'Tanger Outlets (Bluffton, 20 min)', 'Broadway at the Beach, Tanger, Coastal Grand'],
        ['Airport', 'SAV (45 min drive)', 'MYR (on-site)'],
        ['Best for', 'Couples, golfers, quiet families, retirees', 'Big families, spring break, budget trips'],
        ['Summer crowds', 'Heavy on specific beaches; never Myrtle-level', 'Intense throughout, Grand Strand stacked'],
        ['Water temp (peak)', '84\u00b0F July/Aug', '84\u00b0F July/Aug'],
      ],
    },
    {
      kind: 'h2',
      text: 'When Hilton Head is the right pick',
    },
    {
      kind: 'ul',
      items: [
        "You prioritize a <strong>quieter vacation</strong> over lots to do.",
        "You're a <strong>golfer</strong> (Hilton Head has the serious courses).",
        "You care about <strong>restaurants</strong> as a primary trip component.",
        "You want <strong>bike paths and wildlife refuges</strong> over boardwalks and SkyWheels.",
        "You're on a <strong>couples\u2019, honeymoon, or anniversary</strong> trip.",
        "You can absorb <strong>30-50% higher lodging costs</strong> for a more refined experience.",
        "You want to feel like you're in the Lowcountry, not in a beach-themed amusement district.",
      ],
    },
    {
      kind: 'h2',
      text: 'When Myrtle Beach is the right pick',
    },
    {
      kind: 'ul',
      items: [
        "You have a <strong>big family or multi-household group</strong> where everyone needs something different.",
        "Your <strong>budget is tight</strong> ($2k-4k total for the week).",
        "You want <strong>amusement parks, piers, and boardwalks</strong> as part of the trip.",
        "It's your <strong>kids\u2019 first beach vacation</strong> and novelty matters more than sophistication.",
        "You want <strong>huge restaurant variety</strong> with easy walk-in access.",
        "You're a <strong>casual golfer</strong> who wants 90+ courses at mid-market pricing.",
        "You like <strong>spring break energy</strong>. (Hilton Head is the opposite of this.)",
      ],
    },
    {
      kind: 'h2',
      text: 'Cost reality check',
    },
    {
      kind: 'p',
      html: "A summer-week comparison for a family of four, roughly equivalent units:",
    },
    {
      kind: 'table',
      caption: 'Cost comparison: family of four, 7 nights in July',
      headers: ['Cost category', 'Hilton Head', 'Myrtle Beach'],
      rows: [
        ['3BR oceanfront villa', '$7,500', '$3,200'],
        ['3 big dinners', '$450-600', '$200-350'],
        ['Family activities', '$400-600 (cruise, bikes, golf)', '$400-800 (SkyWheel, pier, putt-putt)'],
        ['Groceries and casual meals', '$800', '$600'],
        ['Gas and transport', '$200', '$150'],
        ['Approx total', '$9,400-9,700', '$4,550-5,100'],
      ],
    },
    {
      kind: 'p',
      html: "The roughly-2x cost gap is real and consistent. Hilton Head is not more expensive because it's \u201Cfancier\u201D; it's more expensive because the barrier-island geography and development pattern restrict supply. That supply constraint is also why the beaches stay quieter.",
    },
    {
      kind: 'h2',
      text: 'Can I do both on one trip?',
    },
    {
      kind: 'p',
      html: "Technically yes, they are 3 hours apart by car. Practically, no. The vibes are so different that splitting a week between them dilutes both experiences. If you're on the fence, pick Hilton Head for refinement and take a future trip to Myrtle, or vice versa. The one case where combining works: a 10-14 day South Carolina coast tour that also includes Charleston (then you're doing a sampler, not a beach vacation).",
    },
    {
      kind: 'h2',
      text: 'Hilton Head vs Myrtle Beach: FAQ',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Is Hilton Head or Myrtle Beach better for families?',
          a: "Both are good for families, for different kinds. Hilton Head wins for families with kids under 7 (calm beaches, bike paths, resort programs), families that like quieter trips, and multi-generational trips with grandparents. Myrtle Beach wins for families with kids 7-14 who love amusement parks, families on budget, and first-time beach vacations where novelty matters.",
        },
        {
          q: 'Which is more expensive, Hilton Head or Myrtle Beach?',
          a: "Hilton Head is roughly 2x the cost for equivalent accommodations. A peak-summer 3BR oceanfront villa runs $7-9k on Hilton Head vs $3-5k on Myrtle Beach. Food, golf, and activities also trend 30-50% higher on Hilton Head.",
        },
        {
          q: 'Which has better beaches, Hilton Head or Myrtle Beach?',
          a: "Different rather than better. Hilton Head has 12 miles of hard-packed sand fronted by low dunes and sea oats, biking at low tide, and no high-rises on the waterline. Myrtle Beach has 60 miles of Grand Strand with condo high-rises and piers. If you want bikable, walkable, undeveloped, Hilton Head wins. If you want the classic commercial beach-town experience, Myrtle.",
        },
        {
          q: 'Which has better golf, Hilton Head or Myrtle Beach?',
          a: "Hilton Head has the better single course (Harbour Town Golf Links, a PGA Tour venue) and 5 championship courses inside 15 minutes. Myrtle Beach has 90+ courses at mid-market pricing. If you want one exceptional course, Hilton Head. If you want volume and variety, Myrtle.",
        },
        {
          q: 'Is Hilton Head worth the extra money over Myrtle Beach?',
          a: "For couples, anniversary trips, and golfers: yes, easily. For families with young kids on a budget: probably not; Myrtle Beach delivers a great family experience at a much lower cost. For families with teens who want amusement parks, Myrtle is the better match regardless of budget.",
        },
        {
          q: "Which is better for a couples\u2019 trip, Hilton Head or Myrtle Beach?",
          a: "Hilton Head, almost always. The restaurant scene, Palmetto Bluff, the quieter beaches, and the sunset sail culture all favor couples. Myrtle Beach is designed for families and tends to feel like a theme park for a couples\u2019 weekend. See the <a href=\"/hilton-head-honeymoon\">Hilton Head honeymoon and couples planner</a>.",
        },
        {
          q: 'Is Myrtle Beach good for a spring break trip?',
          a: "Yes, Myrtle Beach runs a traditional spring break scene with full hotels, bars, and beach energy. Hilton Head is the opposite of spring break; it's deliberately quiet even during Easter week. For the spring-break vibe, Myrtle. For the Hilton Head version (which is a family trip, not a college trip), see our <a href=\"/hilton-head-spring-break\">Hilton Head spring break page</a>.",
        },
        {
          q: 'Which is easier to drive around, Hilton Head or Myrtle Beach?',
          a: "Hilton Head is easier once you're on the island (12 miles, simple layout, one main road). Myrtle Beach has more traffic on Ocean Boulevard and US-17 but also more parking supply. Airport-to-hotel is 10-20 minutes on Myrtle Beach vs 45 minutes on Hilton Head.",
        },
        {
          q: 'When is the best time to visit Hilton Head vs Myrtle Beach?',
          a: "Both have peak summer (June-August) and warm fall (September-October). Hilton Head's shoulder season is noticeably cheaper than Myrtle Beach's in the same windows. Myrtle Beach stays busier longer into October because its spring break season and summer energy draw mid-market families year-round. For Hilton Head specifically, see our <a href=\"/blog/best-time-to-visit-hilton-head\">weather and best time guide</a>.",
        },
        {
          q: 'Is Hilton Head or Myrtle Beach safer?',
          a: "Both are safe tourist destinations. Hilton Head has lower overall crime rates and less of a late-night scene, which most visitors read as safer. Myrtle Beach has more police presence on Ocean Boulevard and stronger visible security around the boardwalk, but also more late-night bar activity.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Still not sure?',
    },
    {
      kind: 'p',
      html: "If you've read this and you're still torn, the deciding question is: <strong>what do you want to do at 4 p.m. on Day 3</strong>? If the answer is \u201Cnap, swim, maybe a bike ride,\u201D Hilton Head. If it's \u201Cride the Ferris wheel, grab funnel cake, walk the pier,\u201D Myrtle Beach. Both are legitimate answers. We just plan one of them. If you picked Hilton Head, start with the <a href=\"/blog/best-time-to-visit-hilton-head\">weather guide</a> or the <a href=\"/blog/hilton-head-3-day-itinerary\">3-day itinerary</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 16) Sea Pines vs Palmetto Dunes comparison
// ---------------------------------------------------------------------------

const postSeaPinesVsPalmettoDunes: Post = {
  slug: 'sea-pines-vs-palmetto-dunes',
  title: "Sea Pines vs Palmetto Dunes: Which Hilton Head Neighborhood Is Right for You",
  excerpt:
    "The two biggest gated plantations on Hilton Head. Same price point, completely different trip. Here is who each one is actually for.",
  description:
    "Sea Pines vs Palmetto Dunes: side-by-side comparison of Hilton Head's two biggest gated communities. Golf, beach, lodging, restaurants, and the right pick.",
  category: 'Neighborhoods',
  readTime: '10 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 3.8,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes'],
  keywords: [
    'Sea Pines vs Palmetto Dunes',
    'Palmetto Dunes vs Sea Pines',
    'Hilton Head neighborhoods comparison',
    'Sea Pines or Palmetto Dunes',
    'which Hilton Head community',
    'Hilton Head gated community comparison',
  ],
  body: [
    {
      kind: 'p',
      html: "These are the two biggest gated communities on Hilton Head. They sit back-to-back in the middle of the island and attract fundamentally different travelers. Picking the wrong one is the single most common mistake we fix on a planning call. Here is the side-by-side.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Sea Pines</strong> for couples, golfers (Harbour Town), first-time visitors who want the iconic Hilton Head experience, and travelers who value dining inside the gate. <strong>Palmetto Dunes</strong> for families with kids, larger groups, multi-generational trips, and travelers who want a full-service resort with kids\u2019 programs. Both are S-tier, both are on the ocean. The trip types are different.",
    },
    {
      kind: 'h2',
      text: 'The basic orientation',
    },
    {
      kind: 'p',
      html: "<strong>Sea Pines</strong> sits on the south end of Hilton Head. 5,200 acres, 400+ villas, 3 resort hotels, and the island's iconic features: Harbour Town, the lighthouse, the Forest Preserve, South Beach Marina. Three golf courses including Harbour Town Golf Links (PGA Tour). See the full <a href=\"/hilton-head/sea-pines\">Sea Pines guide</a>.",
    },
    {
      kind: 'p',
      html: "<strong>Palmetto Dunes</strong> sits mid-island, just north of Sea Pines. 2,000 acres, 200+ villas, 2 resort hotels (Omni, Marriott Grande Ocean), 3 miles of oceanfront beach, three championship golf courses, an 11-mile lagoon for kayaking, and the best resort tennis program in the country. See the full <a href=\"/hilton-head/palmetto-dunes\">Palmetto Dunes guide</a>.",
    },
    {
      kind: 'h2',
      text: 'Side-by-side comparison',
    },
    {
      kind: 'table',
      caption: 'Sea Pines vs Palmetto Dunes: 2026 side-by-side',
      headers: ['Dimension', 'Sea Pines', 'Palmetto Dunes'],
      rows: [
        ['Size', '5,200 acres', '2,000 acres'],
        ['Villa inventory', '400+ units', '200+ units'],
        ['Oceanfront beach', '~5 miles', '~3 miles'],
        ['Golf courses', '3 (Harbour Town, Heron Point, Atlantic Dunes)', '3 (Robert Trent Jones, Fazio, Arthur Hills)'],
        ['Best golf', 'Harbour Town (PGA Tour venue)', 'RTJ Oceanfront (Top 50 resort course)'],
        ['Marquee feature', 'Harbour Town + lighthouse', '11-mile lagoon + tennis'],
        ['Dining inside the gate', '6-8 options, 2 S-tier', '3-4 options, mostly resort-hotel'],
        ['Best for', 'Couples, golfers, first-timers', 'Families, groups, tennis enthusiasts'],
        ['Kids\u2019 programming', 'Light (Sea Pines Resort only)', 'Strong (Omni program, tennis camp)'],
        ['Gate fee (non-resort)', '$10/car/day', '$8/car/day'],
        ['3BR oceanfront villa (peak)', '$6,000-9,000/week', '$5,500-8,000/week'],
        ['3BR interior villa (shoulder)', '$3,000-5,000/week', '$3,500-5,500/week'],
        ['Bike-path network', 'Excellent (connects to Forest Preserve)', 'Very good (lagoon loops)'],
        ['Walk to the beach', 'Varies by villa, 2-15 min', 'Most villas 2-10 min'],
        ['Drive to Coligny / off-gate dining', '5-12 min', '8-15 min'],
      ],
    },
    {
      kind: 'h2',
      text: 'Why to pick Sea Pines',
    },
    {
      kind: 'ul',
      items: [
        "<strong>Harbour Town.</strong> The lighthouse, the marina, the 18th at the RBC Heritage course. There is no Palmetto Dunes equivalent.",
        "<strong>Dining inside the gate.</strong> Two S-tier options (Salty Dog, Quarterdeck) plus the resort dining rooms mean you can eat well without leaving the plantation.",
        "<strong>The Forest Preserve.</strong> 605 acres of maritime forest, bike paths, the Dragon Tree. Palmetto Dunes has lagoons; Sea Pines has forest.",
        "<strong>Harbour Town Golf Links.</strong> A 120-day resort-guest priority system gets you onto a PGA Tour course. Non-guests cannot reliably book this.",
        "<strong>The iconic Hilton Head experience.</strong> If this is your first visit, Sea Pines is what postcards, Heritage week, and every Hilton Head article mean when they say \u201CHilton Head.\u201D",
      ],
    },
    {
      kind: 'h2',
      text: 'Why to pick Palmetto Dunes',
    },
    {
      kind: 'ul',
      items: [
        "<strong>Kids\u2019 programming.</strong> The Omni has a full kids\u2019 program, Palmetto Dunes tennis runs summer camps, and the lagoon kayaking is exactly the activity a 10-year-old wants. Sea Pines is quieter for kids.",
        "<strong>Three golf courses on one plantation.</strong> Robert Trent Jones Oceanfront, Fazio, and Arthur Hills all run off one clubhouse. For a golf group that wants variety in a 3-day stay, Palmetto Dunes beats Sea Pines.",
        "<strong>Tennis.</strong> Palmetto Dunes Tennis is ranked in the US top 10 resort programs. Sea Pines tennis is good but not at this level.",
        "<strong>The lagoon.</strong> 11 miles of kayakable freshwater creek running through the plantation. Sunrise kayaking here is one of the top 5 experiences on the island.",
        "<strong>Shorter beach walk, most villas.</strong> Palmetto Dunes has a denser oceanfront villa layout. More properties sit a 2-5 minute walk to the sand than in Sea Pines.",
      ],
    },
    {
      kind: 'h2',
      text: 'When we pick one over the other',
    },
    {
      kind: 'p',
      html: "Our default decision tree, based on hundreds of trips:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Couples, honeymoon, anniversary:</strong> Sea Pines. Better dining, Harbour Town sunset, more romantic feel. See the <a href=\"/hilton-head-honeymoon\">honeymoon planner</a>.",
        "<strong>Family with kids 6-14:</strong> Palmetto Dunes. Better programming, shorter beach walk, kids\u2019 camp infrastructure. See the <a href=\"/hilton-head-family-trip-planner\">family trip planner</a>.",
        "<strong>Family with kids under 6:</strong> Palmetto Dunes (Omni kids\u2019 pool and sitter service). Sea Pines works if you're in a villa with a private pool.",
        "<strong>Golf trip, serious:</strong> Sea Pines for Harbour Town access. See the <a href=\"/hilton-head-golf-packages\">golf packages page</a>.",
        "<strong>Golf trip, variety focus:</strong> Palmetto Dunes for three courses off one tee sheet.",
        "<strong>Tennis or pickleball trip:</strong> Palmetto Dunes, no question.",
        "<strong>First-time Hilton Head visit:</strong> Sea Pines. It is what people mean when they say Hilton Head.",
        "<strong>Multi-generational trip:</strong> Palmetto Dunes, Marriott Grande Ocean or a 5BR oceanfront villa. Wider range of bedroom counts and kids\u2019 programming for the grandkids.",
      ],
    },
    {
      kind: 'h2',
      text: 'The honest downsides of each',
    },
    {
      kind: 'h3',
      text: 'Sea Pines downsides',
    },
    {
      kind: 'ul',
      items: [
        "Kid programming is thin outside of the resort hotels.",
        "Restaurants inside the gate are a smaller set than non-gated Hilton Head.",
        "Traffic on Sea Pines Circle can be real during Heritage week.",
      ],
    },
    {
      kind: 'h3',
      text: 'Palmetto Dunes downsides',
    },
    {
      kind: 'ul',
      items: [
        "Less \u201CHilton Head atmosphere.\u201D It feels resort-y, not historic.",
        "Fewer standalone restaurants inside the gate; you'll drive to Shelter Cove or Sea Pines for better dining variety.",
        "The Omni renovation is phased through 2027. Ask us which floor.",
      ],
    },
    {
      kind: 'h2',
      text: 'Cost comparison, honestly',
    },
    {
      kind: 'p',
      html: "For equivalent 3BR oceanfront villas in peak week (July), Sea Pines runs roughly 10-15% higher than Palmetto Dunes. For resort hotels, Omni (Palmetto Dunes) is comparable to the Sea Pines Resort hotels. For value seekers: a mid-island interior villa in Palmetto Dunes runs $3,500-4,500/week in peak and gets you full Palmetto Dunes amenity access. The Sea Pines equivalent runs $4,500-5,500/week.",
    },
    {
      kind: 'h2',
      text: 'Sea Pines vs Palmetto Dunes: FAQ',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Is Sea Pines or Palmetto Dunes better for families?',
          a: "Palmetto Dunes, in most cases. The Omni kids\u2019 program, tennis camp, lagoon kayaking, and shorter beach walks favor families with kids 5-14. Sea Pines works for families too but is quieter and less programmed. For multi-generational trips, Palmetto Dunes is the more forgiving choice.",
        },
        {
          q: 'Is Sea Pines or Palmetto Dunes better for golf?',
          a: "Depends on priority. Sea Pines for Harbour Town Golf Links (a PGA Tour venue with 120-day resort-guest priority). Palmetto Dunes for three championship courses off one tee sheet (RTJ Oceanfront, Fazio, Arthur Hills). A serious golfer picks Sea Pines; a golf group that wants variety picks Palmetto Dunes.",
        },
        {
          q: 'Which is bigger, Sea Pines or Palmetto Dunes?',
          a: "Sea Pines is 5,200 acres with 400+ villas. Palmetto Dunes is 2,000 acres with 200+ villas. Sea Pines is more than double the geographic footprint and has a more varied neighborhood mix (Harbour Town, South Beach, Baynard Cove, Sea Pines interior).",
        },
        {
          q: 'How much is the gate fee at Sea Pines vs Palmetto Dunes?',
          a: "Sea Pines charges $10 per car per day for non-resort-guest day entry. Palmetto Dunes charges $8 per car per day. Both waive the fee if you're a resort or villa guest. Both passes are valid the day issued.",
        },
        {
          q: "Can I visit Sea Pines and Palmetto Dunes if I'm not staying there?",
          a: "Yes, both allow day visitors with a gate pass ($8-10). You can drive in, park, walk the beach, climb the Harbour Town lighthouse, eat at a restaurant, or play golf as a day visitor. Both plantations welcome non-guest visitors; the pass is the only hurdle.",
        },
        {
          q: 'Which has better beaches, Sea Pines or Palmetto Dunes?',
          a: "Palmetto Dunes has a 3-mile continuous stretch of oceanfront with a denser villa layout, meaning most villas are a 2-10 minute walk to sand. Sea Pines has 5 miles of beach but the villas are spread over a larger footprint, so walk times vary more (2-15 minutes). Beach quality itself is similar.",
        },
        {
          q: 'Is Sea Pines worth the extra money over Palmetto Dunes?',
          a: "For specific trips, yes. For a Harbour Town golf trip, a first-time visit, or a couples\u2019 weekend focused on dining, Sea Pines justifies the 10-15% premium. For a family summer week, you're not gaining enough over Palmetto Dunes to justify the gap. Pick by trip type, not by price point.",
        },
        {
          q: 'Which has better restaurants, Sea Pines or Palmetto Dunes?',
          a: "Sea Pines, inside the gate. Harbour Town has 3-4 legitimately good options (Quarterdeck, Links, Topside). South Beach Marina has 2 more. Palmetto Dunes has the Omni dining rooms and one or two bar-restaurants but you'll drive to Shelter Cove or outside the gate for a real dinner scene.",
        },
        {
          q: 'Can I bike between Sea Pines and Palmetto Dunes?',
          a: "Yes. Both plantations connect to the Hilton Head bike path network. A bike ride from a Palmetto Dunes villa to Harbour Town runs 25-35 minutes and is mostly on dedicated paths. This is one of the better day rides on the island.",
        },
        {
          q: 'Which is quieter, Sea Pines or Palmetto Dunes?',
          a: "Sea Pines, in most weeks. Palmetto Dunes\u2019 family programming and tennis camps generate more energy in peak season. Outside Heritage week (April 13-19, 2026), Sea Pines is noticeably quieter, especially in the South Beach and Heritage Villa pockets.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Not sure? We can match you',
    },
    {
      kind: 'p',
      html: "The Sea Pines vs Palmetto Dunes question is the most common planning-call opener we get. If you want us to match your trip to the right gate, the <a href=\"/itinerary\">$450 itinerary service</a> includes the neighborhood pick and villa short-list. For lodging-specific guidance, see the <a href=\"/blog/2026-best-places-to-stay-hilton-head\">2026 best places to stay</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 17) Hilton Head golf courses ranked
// ---------------------------------------------------------------------------

const postGolfCoursesRanked: Post = {
  slug: 'hilton-head-golf-courses-ranked',
  title: "Hilton Head Golf Courses Ranked: The 2026 Tier List",
  excerpt:
    "Twelve championship courses inside twenty minutes. Harbour Town on top, the value picks underneath, the one course you can skip. A local's ranked list.",
  description:
    "A local's ranked tier list of every Hilton Head golf course for 2026. Harbour Town, Robert Trent Jones, Arthur Hills, Heron Point, and the stay-and-play math.",
  category: 'Golf',
  readTime: '12 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-05-01',
  author: 'Hilton Ahead',
  featuredOrder: 3.6,
  coverImage: {
    src: 'https://images.unsplash.com/photo-1631845085830-10c38cc98ac8?auto=format&fit=crop&w=1800&q=82',
    alt: 'Harbour Town Lighthouse and dock at golden hour, Hilton Head — host of the RBC Heritage',
  },
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes'],
  keywords: [
    'Hilton Head golf courses',
    'best golf course Hilton Head',
    'Harbour Town Golf Links',
    'Palmetto Dunes golf',
    'Robert Trent Jones Oceanfront',
    'Heron Point by Pete Dye',
    'Atlantic Dunes Davis Love',
    'stay and play Hilton Head',
    'Hilton Head golf tee times',
    'Shipyard Golf Club',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head has more championship golf per square mile than anywhere in the US except Pinehurst. Twelve courses inside a twenty-minute radius, four nationally ranked, and one (Harbour Town) that hosts the PGA Tour every April. Most visitors play one or two and leave. The optimized golf trip plays four in five days and picks each for a reason. Here is the ranked list we send to every golf group.",
    },
    {
      kind: 'embed',
      component: 'HeritageCountdown',
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Must-play:</strong> Harbour Town. <strong>Best ocean-view round:</strong> RTJ Oceanfront at Palmetto Dunes. <strong>Best value S-tier:</strong> Heron Point by Pete Dye. <strong>Best stay-and-play economics:</strong> Atlantic Dunes. <strong>Best Bluffton splurge:</strong> May River at Palmetto Bluff. <strong>The one to skip:</strong> Shipyard's Clipper nine (always rough), covered below.",
    },
    {
      kind: 'embed',
      component: 'CourseMatchQuiz',
    },
    {
      kind: 'embed',
      component: 'TeeTimeFinder',
    },
    {
      kind: 'section',
      eyebrow: '01 \u00b7 The lay of the land',
      title: 'The 2026 Hilton Head golf landscape at a glance',
      summary: '12 courses, 4 nationally ranked, 1 PGA Tour venue.',
      blocks: [
        {
          kind: 'p',
          html: "Most Hilton Head golf is resort-play, which means you book through the resort at either the guest rate (cheaper) or the non-guest rate. Stay-and-play packages almost always beat retail green fees; we have priced dozens. Here is the compressed view:",
        },
        {
          kind: 'table',
          caption: 'Hilton Head + Bluffton: course-by-course snapshot',
          headers: ['Course', 'Designer', 'Location', 'Peak green fee (retail)', 'Public/resort'],
          rows: [
            ['Harbour Town Golf Links', 'Pete Dye', 'Sea Pines', '$400-550', 'Sea Pines resort guests + Heritage'],
            ['Heron Point by Pete Dye', 'Pete Dye', 'Sea Pines', '$190-250', 'Sea Pines resort guests'],
            ['Atlantic Dunes by Davis Love III', 'Davis Love III', 'Sea Pines', '$170-230', 'Sea Pines resort guests'],
            ['Robert Trent Jones Oceanfront', 'Robert Trent Jones', 'Palmetto Dunes', '$195-245', 'Public + Palmetto Dunes guests'],
            ['Arthur Hills Course', 'Arthur Hills', 'Palmetto Dunes', '$165-210', 'Public + Palmetto Dunes guests'],
            ['George Fazio Course', 'George Fazio', 'Palmetto Dunes', '$165-210', 'Public + Palmetto Dunes guests'],
            ['Shipyard Golf Club (27 holes)', 'George Cobb / Willard Byrd', 'Shipyard', '$130-175', 'Public'],
            ['Port Royal Golf Club (3 courses)', 'Fazio / Cobb / Jones', 'Port Royal', '$135-185', 'Public'],
            ['Palmetto Hall (2 courses)', 'Arthur Hills / Robert Cupp', 'North island', '$125-165', 'Public'],
            ['Oyster Reef Golf Course', 'Rees Jones', 'North island', '$120-160', 'Public'],
            ['May River Golf Club', 'Jack Nicklaus', 'Palmetto Bluff, Bluffton', '$275-350', 'Montage Palmetto Bluff guests'],
            ['Old South Golf Links', 'Clyde Johnston', 'Bluffton', '$90-140', 'Public'],
          ],
        },
        {
          kind: 'p',
          html: "Stay-and-play pricing beats retail by 20-40% on every course above. Book through the resort (Sea Pines, Palmetto Dunes, Montage) and pair green fees with lodging for the best math. For Harbour Town specifically, there is no public-play equivalent; you need to be inside the gate.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '02 \u00b7 The crown',
      title: 'S-Tier \u2014 courses worth building a trip around',
      summary: 'Harbour Town, RTJ Oceanfront, May River, Heron Point.',
      defaultOpen: true,
      blocks: [
        {
          kind: 'tier',
          label: 'S-Tier',
          subtitle: 'Courses worth building a trip around.',
          accent: 'gold',
          courseSlugs: [
            'harbour-town-golf-links',
            'rtj-oceanfront-palmetto-dunes',
            'may-river-palmetto-bluff',
            'heron-point-by-pete-dye',
          ],
          items: [
            {
              name: 'Harbour Town Golf Links (Sea Pines)',
              meta: 'Pete Dye \u00b7 Par 71 \u00b7 6,973 yards \u00b7 Sea Pines resort priority',
              blurb:
                "The best single course in the Southeast and the crown jewel of Hilton Head golf. Host of the RBC Heritage every April. Famous for the 18th hole with the red-and-white lighthouse framing the green. Tight fairways, small greens, and a finishing stretch that rewards shot-shaping. Stay-and-play through Sea Pines Resort is the only reliable way to book; 120-day priority window for resort guests.",
            },
            {
              name: 'Robert Trent Jones Oceanfront (Palmetto Dunes)',
              meta: 'Robert Trent Jones \u00b7 Par 72 \u00b7 7,004 yards \u00b7 Public',
              blurb:
                "The 10th hole plays directly along the Atlantic, making RTJ the only course on Hilton Head with an oceanfront golf shot. Ranked top-50 resort course by Golfweek. Recently re-bunkered and greens regrassed. Best time to play: early morning for the ocean breeze and light. Pair with Arthur Hills and Fazio on a 3-day Palmetto Dunes package.",
            },
            {
              name: 'May River at Palmetto Bluff (Bluffton)',
              meta: 'Jack Nicklaus \u00b7 Par 72 \u00b7 7,174 yards \u00b7 Montage guests',
              blurb:
                "Technically off-island (20 min in Bluffton) but worth the drive. Nicklaus design threading live oaks and marsh. The service level at Montage Palmetto Bluff is unmatched in the region. A round here plus one night at the Montage plus dinner at the May River Grill is the S-tier Lowcountry golf experience. $275-350 green fees.",
            },
            {
              name: 'Heron Point by Pete Dye (Sea Pines)',
              meta: 'Pete Dye \u00b7 Par 71 \u00b7 7,035 yards \u00b7 Sea Pines guests',
              blurb:
                "Sea Pines' second Dye course, renovated in 2007. Wider fairways than Harbour Town, slightly more forgiving, still Pete Dye-strategic. The best-value S-tier round on the island at $190-250. Most golf groups actually prefer this to Harbour Town for day-to-day play; Harbour Town is ceremony, Heron Point is golf.",
            },
          ],
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '03 \u00b7 The everyday',
      title: 'A-Tier \u2014 strong rounds any day',
      blocks: [
        {
          kind: 'tier',
          label: 'A-Tier',
          subtitle: 'Strong rounds any day.',
          accent: 'primary',
          courseSlugs: [
            'atlantic-dunes',
            'arthur-hills-palmetto-dunes',
            'george-fazio-palmetto-dunes',
            'port-royal',
          ],
          items: [
            {
              name: 'Atlantic Dunes by Davis Love III (Sea Pines)',
              meta: 'Davis Love III \u00b7 Par 72 \u00b7 7,010 yards \u00b7 Sea Pines guests',
              blurb:
                "The newest Sea Pines course (renovated 2016 from the old Ocean Course by Davis Love's firm). Links-style feel, exposed dunes, challenging winds. Reasonable difficulty for mid-handicappers. Best call when Heron Point is booked. $170-230 retail.",
            },
            {
              name: 'Arthur Hills Course (Palmetto Dunes)',
              meta: 'Arthur Hills \u00b7 Par 72 \u00b7 6,651 yards \u00b7 Public',
              blurb:
                "The most forgiving of the three Palmetto Dunes courses. Lagoon-laced layout with generous landing areas. Best for mid to high handicappers or the first round of a trip when you want to warm up. Pairs well with the tougher RTJ on Day 2.",
            },
            {
              name: 'George Fazio Course (Palmetto Dunes)',
              meta: 'George Fazio \u00b7 Par 70 \u00b7 6,873 yards \u00b7 Public',
              blurb:
                "Tighter than Arthur Hills, with only two par-5s (rare). Rewards accuracy over distance. Often overlooked by visitors who assume \u201CFazio\u201D means Tom Fazio (it doesn't; George was Tom's uncle). A legitimately good test; lower green fees than the bigger names.",
            },
            {
              name: 'Port Royal Golf Club (3 courses)',
              meta: 'Robert Trent Jones / George Cobb / Pete Dye \u00b7 Public',
              blurb:
                "Three 18-hole tracks in one location. Planters Row (RTJ) is the strongest; Robbers Row (Cobb) the most historic. Good choice when Sea Pines and Palmetto Dunes are booked or when you want variety at a lower price point. Worth it in the mid-March to mid-May sweet spot.",
            },
          ],
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '04 \u00b7 The value picks',
      title: 'B-Tier \u2014 fine when the calendar is tight',
      blocks: [
        {
          kind: 'tier',
          label: 'B-Tier',
          subtitle: 'Fine when the calendar is tight.',
          accent: 'zinc',
          courseSlugs: ['palmetto-hall', 'oyster-reef', 'shipyard', 'old-south'],
          items: [
            {
              name: 'Palmetto Hall Plantation',
              meta: 'Arthur Hills / Robert Cupp \u00b7 Public \u00b7 North island',
              blurb:
                "Two solid courses 25 minutes north of the action. Lower green fees ($125-165), less crowded on weekdays. Good value if you're staying on the north end or if the main-island courses are booked. Otherwise, the drive is an additional tax.",
            },
            {
              name: 'Oyster Reef Golf Course',
              meta: 'Rees Jones \u00b7 Public \u00b7 North island',
              blurb:
                "A Rees Jones design (Robert Trent Jones' son) with a legitimate par-3 over salt marsh. Not destination-worthy on its own, but a respectable value round. Best for a group that wants more golf than Sea Pines and Palmetto Dunes can provide in a 5-day trip.",
            },
            {
              name: 'Shipyard Golf Club (27 holes)',
              meta: 'George Cobb / Willard Byrd \u00b7 Public \u00b7 Mid-island',
              blurb:
                "Three nines (Brigantine, Clipper, Galleon) combined into 18-hole rotations. Brigantine plus Galleon is the good round. Clipper is always the weakest nine; skip it if the tee sheet lets you. Decent value ($130-175) and convenient mid-island location.",
            },
            {
              name: 'Old South Golf Links (Bluffton)',
              meta: 'Clyde Johnston \u00b7 Public \u00b7 20 min off-island',
              blurb:
                "The best budget round in the region ($90-140). Clyde Johnston layout on a former rice plantation. Not a championship test but genuinely enjoyable for a mid-trip afternoon round when the S-tier courses have priced you out.",
            },
          ],
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '05 \u00b7 Where they sit',
      title: 'The 12 courses, mapped',
      summary: 'Sea Pines, Palmetto Dunes, mid-island, Bluffton \u2014 at a glance.',
      blocks: [
        {
          kind: 'embed',
          component: 'CourseMap',
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '06 \u00b7 Logistics',
      title: 'Tee-time booking priority, by course',
      summary: 'When each course opens its tee sheet, and what actually books in peak.',
      blocks: [
        {
          kind: 'p',
          html: "The single biggest mistake on a Hilton Head golf trip is assuming you can book Harbour Town walk-up or 30 days out. You cannot. Here is how each course's tee sheet actually opens:",
        },
        {
          kind: 'table',
          caption: 'Hilton Head golf: when each course opens its tee sheet',
          headers: ['Course', 'Resort-guest priority', 'Public booking', 'Booking reality (peak)'],
          rows: [
            ['Harbour Town Golf Links', '120 days (Sea Pines Resort only)', '30 days (rare cancellations)', 'Book Sea Pines lodging 4+ months out'],
            ['Heron Point / Atlantic Dunes', '90 days (Sea Pines Resort)', '30 days', 'Good availability inside 45 days'],
            ['RTJ Oceanfront / Arthur Hills / Fazio', '60 days (Palmetto Dunes stay)', '30 days (all 3 open)', 'Tee times inside 2 weeks are feasible'],
            ['Shipyard / Port Royal / Palmetto Hall', 'No resort priority', '60 days open to public', 'Walk-up Monday-Thursday often works'],
            ['May River (Montage)', '90 days (Montage stay only)', 'Not public', 'Stay at Montage or skip'],
            ['Old South / Oyster Reef', 'No priority tier', '60 days open', 'Easy to book inside 1 week'],
          ],
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '07 \u00b7 The numbers',
      title: 'Stay-and-play math, honestly',
      summary: 'Run the rough total before you decide.',
      blocks: [
        {
          kind: 'p',
          html: "Retail green fees plus separate lodging is almost always worse economics than a stay-and-play package. A three-round Sea Pines stay-and-play (Harbour Town + Heron Point + Atlantic Dunes over 4 nights at the Inn & Club at Harbour Town) runs roughly $299-399/player/night with breakfast, rounds, and villa lodging included. Same three rounds retail plus the same lodging runs $300-450/player/night more. The stay-and-play is simply a better number.",
        },
        {
          kind: 'p',
          html: "The one exception: if your group is 8+ and you want a standalone villa, direct villa booking plus retail green fees can beat the resort package because the villa economics scale. We run the numbers both ways for every group.",
        },
        {
          kind: 'embed',
          component: 'StayAndPlayEstimator',
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '08 \u00b7 The blueprint',
      title: 'A 4-round, 5-day Hilton Head golf trip',
      blocks: [
        {
          kind: 'p',
          html: "The optimized trip most groups ask us for:",
        },
        {
          kind: 'ul',
          items: [
            "<strong>Day 1:</strong> Arrive, warm-up round at <strong>Atlantic Dunes</strong>. Casual, get the body moving.",
            "<strong>Day 2:</strong> <strong>Heron Point</strong> morning. Afternoon range session or bike ride.",
            "<strong>Day 3:</strong> <strong>Harbour Town Golf Links</strong>. The ceremony round. Book the 10 a.m. tee time, lunch at Quarterdeck after.",
            "<strong>Day 4:</strong> Recovery day. Beach, pool, and a walk to the lighthouse.",
            "<strong>Day 5:</strong> <strong>May River at Palmetto Bluff</strong> or <strong>RTJ Oceanfront</strong> as the finale. Different vibe, different designer, strong closing round.",
          ],
        },
        {
          kind: 'p',
          html: "For the full trip logistics including lodging, dinner reservations, and non-golf programming, see the <a href=\"/blog/hilton-head-golf-trip\">Hilton Head golf trip guide</a> and the <a href=\"/hilton-head-golf-packages\">Hilton Head golf packages landing page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '09 \u00b7 Questions',
      title: 'Hilton Head golf FAQ',
      defaultOpen: true,
      blocks: [
        {
          kind: 'faq',
          label: 'Questions we hear most',
          items: [
            {
              q: 'What is the best golf course on Hilton Head?',
              a: "Harbour Town Golf Links, without serious debate. It's a PGA Tour venue, hosts the RBC Heritage every April, and has the most iconic 18th hole in the Southeast (lighthouse, Calibogue Sound, small green). Heron Point and Robert Trent Jones Oceanfront are the closest seconds; Heron Point for Pete Dye purists, RTJ for the oceanfront shot.",
            },
            {
              q: 'Can the public play Harbour Town Golf Links?',
              a: "Technically yes, but reliably no. The course prioritizes Sea Pines Resort guests with a 120-day booking window. Public tee times open at 30 days and are almost always full by that point. If you want to play Harbour Town, book a stay-and-play package through Sea Pines Resort 4+ months out. Non-guests who show up looking for a walk-up round nearly always leave disappointed.",
            },
            {
              q: 'How much does a round at Harbour Town cost?',
              a: "Peak-season green fees run $400-550 for non-guests and $325-450 for Sea Pines Resort guests. Stay-and-play packages effectively net the round to $200-275 per player when bundled with 4+ nights of lodging. Heritage week (April 13-19, 2026) the course is closed to public play.",
            },
            {
              q: 'Is Robert Trent Jones Oceanfront really oceanfront?',
              a: "The 10th hole plays directly along the Atlantic, with the beach visible from the tee. It's the only actual oceanfront golf hole on Hilton Head. The rest of the course is inland but within 300 yards of the ocean. Call it \u201Coceanfront\u201D in the literal PGA-marketing sense; not every hole is on the water.",
            },
            {
              q: 'How many golf courses are on Hilton Head Island?',
              a: "Twelve championship-grade courses inside Hilton Head and Bluffton (20 minutes off-island). Counting the three nines at Shipyard and the three courses at Port Royal as one \u201Ccourse\u201D each, the total is 12. Within 30 minutes including Palmetto Bluff and beyond, the count exceeds 20.",
            },
            {
              q: 'When is the best time of year to golf on Hilton Head?',
              a: "March through May and October through early November. Course conditioning peaks in March after winter overseeding. October delivers dry, 75\u00b0F afternoons with the greens still dense. Summer golf is playable but the humidity and afternoon storms force morning-only play. Winter golf is the budget play: cooler air, slower greens, 30-40% lower green fees. See the <a href=\"/blog/best-time-to-visit-hilton-head\">weather and best time guide</a>.",
            },
            {
              q: 'What is a stay-and-play package on Hilton Head?',
              a: "Bundled lodging plus green fees plus usually daily breakfast, sold by the major resorts (Sea Pines, Palmetto Dunes, Montage Palmetto Bluff). Prices run $299-399/player/night for S-tier courses and $225-325/player/night for A-tier. These beat retail pricing 20-40% and handle the booking priority simultaneously. See the <a href=\"/hilton-head-golf-packages\">Hilton Head golf packages page</a>.",
            },
            {
              q: 'Which Hilton Head course is easiest for a beginner or high-handicapper?',
              a: "Arthur Hills Course at Palmetto Dunes for a full championship layout with wider fairways and forgiving landing areas. Old South Golf Links in Bluffton at a lower price point. Oyster Reef is also reasonable. Avoid Harbour Town if you're over a 20 handicap; the small greens and demanding approach shots will frustrate you at $450 a round.",
            },
            {
              q: 'Is Shipyard Golf Club worth playing?',
              a: "Yes on the Brigantine and Galleon nines; the Clipper nine is the weakest 9 holes in the main Hilton Head course rotation and we routinely steer groups away. Shipyard's pricing ($130-175) makes it a fine value round when the bigger names are booked.",
            },
            {
              q: 'How far ahead do I need to book a Hilton Head golf trip?',
              a: "Harbour Town stays: 9-10 months out for RBC Heritage week, 4-6 months out for March-May peak. Other Sea Pines and Palmetto Dunes packages: 3-4 months out in peak. Non-resort public courses (Shipyard, Port Royal, Palmetto Hall): 2-4 weeks out is fine. For a full trip plan, see the <a href=\"/blog/hilton-head-golf-trip\">golf trip guide</a> or contact us.",
            },
          ],
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head golf trip',
    },
    {
      kind: 'p',
      html: "A Hilton Head golf trip lives or dies on the Harbour Town tee time, the stay-and-play structure, and the non-golf nights (S-tier dinners matter). If you want us to handle the whole thing, the <a href=\"/hilton-head-golf-packages\">Hilton Head golf packages</a> page is the trip-type planner, and the <a href=\"/itinerary\">$450 itinerary service</a> includes the 4-round schedule plus lodging plus dinner reservations. For the full trip overview, see the <a href=\"/blog/hilton-head-golf-trip\">Hilton Head golf trip guide</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 18) Hilton Head romantic restaurants (honeymoon segment)
// ---------------------------------------------------------------------------

const postRomanticRestaurants: Post = {
  slug: 'hilton-head-romantic-restaurants',
  title: "The Best Hilton Head Restaurants for a Honeymoon, Anniversary, or Proposal",
  excerpt:
    "Where to book the big dinner. Romantic restaurants on Hilton Head and in Bluffton, sorted by occasion and booked by a local.",
  description:
    "A local's guide to Hilton Head's most romantic restaurants. Michael Anthony's, Red Fish, May River Grill, and the right spot for every occasion.",
  category: 'Dining',
  readTime: '10 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 3.9,
  relatedNeighborhoods: ['sea-pines', 'shelter-cove'],
  keywords: [
    'Hilton Head romantic restaurants',
    'Hilton Head anniversary dinner',
    'Hilton Head honeymoon dinner',
    'where to propose Hilton Head',
    'Hilton Head date night',
    'romantic restaurants Hilton Head',
    'best anniversary restaurant Hilton Head',
    'Palmetto Bluff wedding proposal',
  ],
  body: [
    {
      kind: 'p',
      html: "Romantic dinner logistics are different from family dinner logistics. Different restaurants, different time slots, different reservation windows, and a different answer to \u201Cis this worth the wait?\u201D We plan honeymoons, anniversaries, and proposal dinners every month. Here are the Hilton Head and Bluffton restaurants we actually book for them, sorted by occasion.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Fine dining, intimate:</strong> Michael Anthony's. <strong>Waterfront with sunset:</strong> Red Fish or Skull Creek Boathouse. <strong>Splurge for the memory:</strong> May River Grill at Montage Palmetto Bluff. <strong>Anniversary in Shelter Cove:</strong> Ela's on the Water. <strong>Proposal-specific:</strong> The 18th-hole deck at Quarterdeck for the pre-dinner drink, then Michael Anthony's for the toast.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head romantic restaurants at a glance',
    },
    {
      kind: 'p',
      html: "Ten restaurants that work for a big-occasion dinner on Hilton Head or in Bluffton. Price tiers are per-person dinner before tax and tip: $$ = $25-50, $$$ = $50-85, $$$$ = $85+. Reservation lead time is for peak season (summer, Heritage week); off-season lead times are 30-50% shorter. For everyday dining options outside the romantic-occasion list, see <a href=\"/local/restaurants\">our full restaurants directory</a>.",
    },
    {
      kind: 'table',
      caption: 'Hilton Head + Bluffton: romantic restaurants by occasion',
      headers: ['Restaurant', 'Location', 'Occasion fit', 'Price', 'Lead time'],
      rows: [
        ["Michael Anthony's", 'Mid-island', 'Anniversary, honeymoon, proposal toast', '$$$$', '3 weeks'],
        ['Red Fish', 'Pope Avenue', 'Lowcountry romance, anniversary', '$$$', '2-3 weeks'],
        ['Skull Creek Boathouse', 'Hilton Head Plantation', 'Sunset + water-side', '$$$', '3-4 weeks'],
        ["Ela's on the Water", 'Shelter Cove', 'Date night, quieter marina', '$$$', '1-2 weeks'],
        ['May River Grill (Montage)', 'Palmetto Bluff, Bluffton', 'Honeymoon splurge, milestone', '$$$$', '3 weeks (Montage guests priority)'],
        ['Old Fort Pub', 'Skull Creek', 'Historic, tucked-away romance', '$$$', '2 weeks'],
        ['FARM Bluffton', 'Old Town Bluffton', 'Serious-dinner destination', '$$$$', '3 weeks (weekend)'],
        ['Frankie Bones', 'Mid-island', 'Italian, quiet booths', '$$', '1 week'],
        ["CQ's Restaurant", 'Harbour Town', 'Historic, fireside in winter', '$$$', '2 weeks'],
        ['Ombra Cucina Italiana', 'Shelter Cove', 'Modern Italian, date night', '$$$', '1-2 weeks'],
      ],
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'The room feels like a special occasion.',
      accent: 'gold',
      items: [
        {
          name: "Michael Anthony's",
          meta: 'Mid-island \u00b7 Italian fine dining \u00b7 $$$$',
          blurb:
            "The quiet answer for a serious anniversary or honeymoon dinner. Dimly lit, professional service, a wine list with enough depth to actually open a second bottle for a toast. The tasting menu is the move for a milestone. Pair with a reservation for the early seating (5:30-6:00 p.m.) for the proposal window; the room is quieter and servers will accommodate any pre-game.",
        },
        {
          name: 'Red Fish',
          meta: 'Pope Avenue \u00b7 Refined Lowcountry \u00b7 $$$',
          blurb:
            "The in-town pick for Lowcountry romance. Family-run, excellent wine list, and a kitchen that actually cooks the shrimp and grits at a fine-dining level. The corner tables near the wine racks are the quietest in the room; call directly and ask for them. Best paired with a sunset drink at the bar 30 minutes before your reservation.",
        },
        {
          name: 'May River Grill at Montage Palmetto Bluff',
          meta: 'Palmetto Bluff, Bluffton \u00b7 S-tier service \u00b7 $$$$',
          blurb:
            "The single best dining experience in the region for a honeymoon or milestone anniversary. Overlooks the May River, service calibrated at the Montage level, cuisine grounded in Lowcountry tradition but executed at fine-dining precision. Book the outdoor porch in good weather. 20 minutes off-island; worth pairing with a one-night Montage stay.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'Strong choices with their own specific magic.',
      accent: 'primary',
      items: [
        {
          name: 'Skull Creek Boathouse',
          meta: 'Hilton Head Plantation \u00b7 Waterfront \u00b7 $$$',
          blurb:
            "The single best sunset reservation on the island. Creek-side tables, water for 270 degrees, the marsh lighting up at golden hour. Book the 6:45-7:15 p.m. slot 3-4 weeks out and request \u201Cwater-side\u201D or \u201Cdeck\u201D on the reservation. The catch: the kitchen is not Michael Anthony's-level; you're paying for the view and the vibe, both of which deliver.",
        },
        {
          name: "Ela's on the Water",
          meta: 'Shelter Cove \u00b7 Marina-side \u00b7 $$$',
          blurb:
            "The quieter date-night pick on Hilton Head proper. Marina views, tables spaced for conversation, and a menu that leans coastal without cliche. Valet parks the car; you walk four steps to a water-side table. A good pick for a low-key anniversary night or the second romantic dinner of a trip (the first being something bigger).",
        },
        {
          name: 'Old Fort Pub',
          meta: 'Skull Creek (historic site) \u00b7 $$$',
          blurb:
            "Built on the site of a Revolutionary War fort, with century-old live oaks out the window. Historic ambiance more than modern fine dining; the menu skews traditional. Works for couples who want \u201Cold Lowcountry\u201D atmosphere over current-day precision. Ask for the porch table; it's the best seat on the island on a 70-degree evening.",
        },
        {
          name: 'FARM Bluffton',
          meta: 'Old Town Bluffton \u00b7 Modern Lowcountry \u00b7 $$$$',
          blurb:
            "Not traditionally romantic in a candle-lit sense but it's the best dinner in the region, which makes it the right pick for a big-day celebration. Intimate room, calibrated service, farm-to-table Lowcountry cuisine. Book 3 weeks ahead for weekends; weeknight bar seats are sometimes a walk-in possibility. See the <a href=\"/bluffton-travel-planner\">Bluffton travel planner</a>.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Where to propose on Hilton Head',
    },
    {
      kind: 'p',
      html: "Three proven spots that we've coordinated for clients. Each pairs naturally with a pre-dinner drink and flows into one of the S-tier restaurants above. (For full ceremony venues, see our <a href=\"/hilton-head-weddings\">Hilton Head wedding planning</a> page.)",
    },
    {
      kind: 'h3',
      text: 'The 18th-hole deck at Quarterdeck, Harbour Town',
    },
    {
      kind: 'p',
      html: "West-facing over Calibogue Sound. Arrive 45 minutes before sunset with a drink, walk to the end of the deck, execute there. Calendar-accurate: in June, sunset is 8:29 p.m.; in October, 6:50 p.m. Pair with dinner at <strong>CQ's Restaurant</strong> (3 min walk) or drive to <strong>Michael Anthony's</strong> (15 min). Photographers know this spot; we connect clients with one if they want.",
    },
    {
      kind: 'h3',
      text: 'The dune overlook at South Beach (Sea Pines)',
    },
    {
      kind: 'p',
      html: "Private, quiet, sand dunes, sea oats, nearly always nobody there. Approach from the South Beach Marina boardwalk, walk 200 yards east. Best at sunrise (fewer people, golden light on the water) or sunset (warmer light, more dramatic). Pair with breakfast at Salty Dog Cafe or dinner at Skull Creek.",
    },
    {
      kind: 'h3',
      text: 'Private sunset sail on Calibogue Sound',
    },
    {
      kind: 'p',
      html: "Book a private charter out of Palmetto Bay Marina ($500-1,200, 90 minutes). Execute at the quietest moment of the sail, usually when the captain anchors briefly for champagne. Pair with dinner at <strong>Ela's on the Water</strong> 100 yards from the marina or at <strong>Michael Anthony's</strong> (15 min drive). Worth noting: captains are excellent at discreetly coordinating.",
    },
    {
      kind: 'h2',
      text: 'Timing a romantic dinner reservation',
    },
    {
      kind: 'p',
      html: "The best reservation windows for big-occasion dinners:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>5:30-6:00 p.m.:</strong> Quietest room, full staff attention, lets you linger without rushing into a 9 p.m. turnover. Our default for proposals.",
        "<strong>6:45-7:15 p.m.:</strong> The sunset slot. Book this window for water-side restaurants (Skull Creek, Ela's). Arrive 15 min early for the full light transition.",
        "<strong>8:00-8:30 p.m.:</strong> The fine-dining slot. Slower service, more intimate because it's the last seating. Best for anniversaries where you want a long, unhurried dinner.",
        "<strong>Avoid Saturday 7:00-8:00 p.m.:</strong> The noisiest hour at every Hilton Head restaurant in peak season. For a quieter room, shift 30 min earlier or later.",
      ],
    },
    {
      kind: 'h2',
      text: 'Hilton Head romantic restaurants: FAQ',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'What is the most romantic restaurant on Hilton Head?',
          a: "Michael Anthony's for fine-dining romance, Red Fish for Lowcountry intimacy, and May River Grill at Montage Palmetto Bluff for the regional splurge. If you want water-side and sunset, Skull Creek Boathouse (book the 6:45-7:15 p.m. slot). All four are reservation-required; none take reliable walk-ups in peak season.",
        },
        {
          q: 'Where should I propose on Hilton Head Island?',
          a: "Three proven spots: the 18th-hole deck at Quarterdeck (Harbour Town, sunset over Calibogue Sound), the dune overlook at South Beach (quiet, sand dunes, Sea Pines), or a private sunset sail out of Palmetto Bay Marina. Each pairs naturally with dinner at Michael Anthony's or Ela's on the Water.",
        },
        {
          q: 'What is the best Hilton Head anniversary dinner?',
          a: "Michael Anthony's for a fine-dining anniversary in town. May River Grill at Montage Palmetto Bluff for a milestone (10th, 25th, 50th). Red Fish as the Lowcountry-romance pick. For a quieter second-choice, Old Fort Pub has the best historic-ambiance room on the island.",
        },
        {
          q: 'How far in advance should I book a romantic dinner on Hilton Head?',
          a: "Michael Anthony's: 3 weeks in peak, 1-2 off-season. Red Fish: 2-3 weeks. Skull Creek Boathouse: 3-4 weeks (especially for the sunset slot). May River Grill: 3 weeks if you're staying at Montage; otherwise longer. FARM Bluffton: 3 weeks for weekends. Call directly rather than OpenTable for any of these; staff can flex more than the platform allows.",
        },
        {
          q: "Is Michael Anthony's worth the price on Hilton Head?",
          a: "For a serious anniversary or honeymoon, yes. The kitchen executes at a level that most Hilton Head restaurants don't reach, the wine list has real depth, and the service calibration is fine-dining precision rather than resort-casual. Per-person dinner runs $85-130 before wine. Not worth it for a random Tuesday; very worth it for a once-a-decade dinner.",
        },
        {
          q: 'Is Palmetto Bluff worth the drive for a special-occasion dinner?',
          a: "Yes, for a honeymoon or 10+ year anniversary. The Montage Palmetto Bluff sets the regional service bar, the May River Grill overlooks a tidal river framed by live oaks, and the overall experience is genuinely different from anything on Hilton Head proper. 20-minute drive from most Hilton Head lodging. Worth pairing with one overnight stay at the Montage for the full experience.",
        },
        {
          q: 'What is the dress code at Hilton Head romantic restaurants?',
          a: "Resort casual everywhere, with a collared shirt expected at Michael Anthony's, Red Fish, May River Grill, and FARM Bluffton. Jackets are not required at any Hilton Head restaurant; a blazer is welcome at Michael Anthony's and May River Grill in winter. Flip-flops and shorts are fine at Skull Creek, Hudson's, and Old Fort Pub (the latter only at the porch tables in warm weather).",
        },
        {
          q: 'Can I book a private dining room on Hilton Head?',
          a: "Yes, at Michael Anthony's (two small private rooms, seat 8-14), May River Grill (Montage private dining), and Sea Pines Resort properties for larger groups. For a proposal or milestone dinner with family, private dining is a solid move; the rest of the room's noise disappears. Expect a $300-800 room fee plus food minimum, depending on restaurant and size.",
        },
        {
          q: "What's the most underrated romantic restaurant on Hilton Head?",
          a: "Old Fort Pub, for the historic atmosphere most visitors don't know about. Built on a Revolutionary War fort site with century-old live oaks outside the porch. The cuisine is traditional rather than cutting-edge, but the room is unlike anywhere else on the island. Request a porch table in warm weather.",
        },
        {
          q: 'Is the Quarterdeck at Harbour Town a good dinner restaurant?',
          a: "The food is fine rather than exceptional. The magic is the 18th-hole view at sunset, which is unmatched. Book for the pre-dinner drink (4:30-5:30 p.m., watch the sun set, propose if that's the plan) and move to Michael Anthony's, CQ's, or Skull Creek for the actual dinner. Quarterdeck is a venue first, a restaurant second.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan the romantic dinner sequence',
    },
    {
      kind: 'p',
      html: "A four-night honeymoon should run a restaurant sequence, not a random list. We plan them as: night 1 waterfront casual (Skull Creek), night 2 fine dining (Michael Anthony's or Red Fish), night 3 Bluffton escape (FARM or May River Grill), night 4 sunset sail with wine. If you want us to book the sequence and coordinate the proposal logistics, the <a href=\"/hilton-head-honeymoon\">Hilton Head honeymoon planner</a> covers the full package.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 19) Hilton Head winter guide (snowbird segment)
// ---------------------------------------------------------------------------

const postWinterGuide: Post = {
  slug: 'hilton-head-winter-guide',
  title: "Hilton Head in Winter: The Month-by-Month Snowbird Guide",
  excerpt:
    "55-68\u00b0F days, half-price villas, and a quiet island that feels unlocked. Here's exactly what November through March looks like on Hilton Head.",
  description:
    "A local's month-by-month Hilton Head winter guide. What's open, rental costs, weather, activities, and the snowbird logistics nobody writes down.",
  category: 'Planning',
  readTime: '12 min',
  publishedAt: '2026-04-24',
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 4.2,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'Hilton Head in winter',
    'Hilton Head winter guide',
    'Hilton Head snowbird',
    'Hilton Head January',
    'Hilton Head February',
    'Hilton Head December',
    'Hilton Head November',
    'Hilton Head March',
    'Hilton Head monthly rental cost',
    'Hilton Head winter activities',
    "what's open Hilton Head winter",
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head November through March is the island most visitors never see. Days run 55-68\u00b0F, nights 40-50\u00b0F, villa rates drop 50-55% below summer, and the bike paths, beaches, and wildlife refuges stay beautiful. Thirty to ninety-day snowbird rentals are increasingly the smart play, and we've planned enough of them to know which months, neighborhoods, and logistics matter. Here is the full picture.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Best single winter month:</strong> March (67\u00b0F days, course conditioning peak, spring bird migration starts). <strong>Cheapest month:</strong> January (deepest rate cut, 58\u00b0F days, quietest island). <strong>Underrated value play:</strong> Thanksgiving week and early December (still mild, reservations easy, holiday vibe). <strong>The trap:</strong> Booking a 1-week winter trip and expecting it to feel the same as a summer week. Pick 30+ days for the full winter Hilton Head experience.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head winter at a glance',
    },
    {
      kind: 'p',
      html: "Five winter months, each distinct. Here is the month-by-month breakdown with weather, water temperature, rental cost index, and what stays open. Rental cost index is relative to the July peak at 100. The lower the number, the cheaper the month.",
    },
    {
      kind: 'table',
      caption: 'Hilton Head winter months: weather, rental cost, and island activity',
      headers: ['Month', 'Avg high / low', 'Water temp', 'Rental cost (vs July)', 'Island activity'],
      rows: [
        ['November', '70\u00b0F / 50\u00b0F', '65\u00b0F', '55-65%', 'Thanksgiving surge then drops off; restaurants all open'],
        ['December', '62\u00b0F / 43\u00b0F', '58\u00b0F', '40-50% (Christmas week 60-70%)', 'Harbour Town holiday lights; bike rentals and most restaurants fully open'],
        ['January', '58\u00b0F / 41\u00b0F', '55\u00b0F', '40-45%', 'Quietest month; a few restaurants close 1 night/week; full gym and activity access'],
        ['February', '61\u00b0F / 43\u00b0F', '55\u00b0F', '40-48%', "Valentine's week bump; whale-watching charters from Savannah; golf conditioning improves"],
        ['March', '67\u00b0F / 49\u00b0F', '60\u00b0F', '55-65% (spring break surge wks 3-4)', 'Course conditioning peak; bird migration; spring break March 14-28 surges rates'],
      ],
    },
    {
      kind: 'h2',
      text: 'November on Hilton Head',
    },
    {
      kind: 'p',
      html: "The transition month. First two weeks feel like the best of the year: 70\u00b0F afternoons, empty beaches, light tourism, full restaurant scene. Thanksgiving week itself surges (villa rates lift 60-70%, restaurants book out 2-3 weeks ahead, but it's still 40% below July). See the <a href=\"/hilton-head-thanksgiving\">Hilton Head Thanksgiving planning page</a>. After Thanksgiving, the island empties and pricing drops into true winter mode.",
    },
    {
      kind: 'h2',
      text: 'December on Hilton Head',
    },
    {
      kind: 'p',
      html: "The quiet holiday month. 62\u00b0F days, 43\u00b0F nights. Harbour Town lights up for the holidays. Christmas week is surprisingly affordable (lower than Thanksgiving) and the island is calm. New Year's week books out; book 2+ months ahead for a NYE villa. January through March is cheaper, but December has the holiday atmosphere that snowbird couples often want. Restaurants all open; a handful reduce to 6 nights/week.",
    },
    {
      kind: 'h2',
      text: 'January on Hilton Head',
    },
    {
      kind: 'p',
      html: "The cheapest month. 58\u00b0F average high, 41\u00b0F low. Ocean swimming is out (55\u00b0F water). Villa rates bottom at 40-45% of July peak. Some restaurants (3-4) close Mondays; everything else runs full hours. Great month for long bike rides (cool, dry), Pinckney Island hiking (bird migration peak), gym-plus-golf days, and reading-on-the-porch weeks. Most 30-day rentals we place are in January.",
    },
    {
      kind: 'h2',
      text: 'February on Hilton Head',
    },
    {
      kind: 'p',
      html: "Slight warm-up. 61\u00b0F average high. Valentine's week creates a mini-spike in couples' rentals (book early). Whale-watching charters run out of Savannah in late February as the gray-whale migration passes offshore. Course conditioning noticeably improves toward month's end. February is the second-cheapest month behind January and often the right month for snowbirds who want slightly warmer weather.",
    },
    {
      kind: 'h2',
      text: 'March on Hilton Head',
    },
    {
      kind: 'p',
      html: "The winter exit month. 67\u00b0F average high, 49\u00b0F low. Week 1-2: still winter pricing and light crowds. Week 3-4: spring break surge (mid-March through early April), rates lift 60-70%, villa inventory tightens fast. If you want the \u201Cend of winter\u201D feel at winter pricing, book March 1-15. If you want the warmth of early spring without spring break crowds, book March 8-15 specifically.",
    },
    {
      kind: 'h2',
      text: "What stays open in winter",
    },
    {
      kind: 'p',
      html: "The \u201Cis anything open?\u201D question is the single most-asked question we get from first-time snowbird clients. The honest answer:",
    },
    {
      kind: 'h3',
      text: 'Restaurants',
    },
    {
      kind: 'p',
      html: "All major restaurants stay open year-round. Skull Creek, Michael Anthony's, Red Fish, Hudson's, Salty Dog Cafe, all open every month. Of the top 30 island restaurants, 3-4 close one night a week (usually Monday or Tuesday) from January through mid-February. Nothing shuts down for the winter; the island has enough year-round residents to sustain the scene.",
    },
    {
      kind: 'h3',
      text: 'Golf',
    },
    {
      kind: 'p',
      html: "All 12+ courses stay open year-round. Winter greens are slower (seasonal dormancy) but playable through March. Green fees drop 30-40% below summer. Harbour Town remains open to Sea Pines Resort guests with standard priority. Tee sheets are noticeably less crowded. See the <a href=\"/blog/hilton-head-golf-courses-ranked\">Hilton Head golf courses ranked</a>.",
    },
    {
      kind: 'h3',
      text: 'Activities',
    },
    {
      kind: 'p',
      html: "Bike rentals (Hilton Head Bicycle), kayak tours (Outside Hilton Head, 7 a.m. slot still best), Coastal Discovery Museum, Sea Pines Forest Preserve, Harbour Town Lighthouse, and Pinckney Island all run year-round. Seasonal closures: one or two of the 6 sunset-sail operators reduce winter schedule (Captain Mark runs year-round; others may not); surf school is out until May.",
    },
    {
      kind: 'h3',
      text: 'Gyms, groceries, medical',
    },
    {
      kind: 'p',
      html: "Sea Pines Racquet Club, Palmetto Dunes tennis complex, and Lifestyle Family Fitness all run winter programs. Hilton Head Hospital on Hospital Center Blvd is the full-service medical facility (24/7 ER). Walgreens, CVS, and a full Publix grocery are all year-round. Delivery via Instacart and DoorDash runs every day.",
    },
    {
      kind: 'h2',
      text: 'Monthly snowbird rental economics',
    },
    {
      kind: 'p',
      html: "What a 30/60/90-day Hilton Head winter rental actually costs:",
    },
    {
      kind: 'table',
      caption: 'Hilton Head winter monthly rental: January 2026 pricing',
      headers: ['Property type', '30 days', '60 days', '90 days'],
      rows: [
        ['2BR interior villa, mid-island', '$2,800-3,500', '$5,200-6,600', '$7,500-9,500'],
        ['3BR oceanfront villa, Palmetto Dunes', '$5,500-6,800', '$10,200-12,500', '$14,800-18,000'],
        ['3BR oceanfront villa, Sea Pines', '$6,200-7,500', '$11,500-14,000', '$16,500-20,000'],
        ['2BR Harbour Town villa', '$5,000-6,000', '$9,200-11,200', '$13,500-16,500'],
        ['Shelter Cove marina condo, 2BR', '$3,200-4,000', '$5,800-7,400', '$8,400-10,800'],
        ['Palmetto Bluff inn room (Montage)', '$11,000-13,500', '$21,500-26,000', '$32,000-38,000'],
      ],
    },
    {
      kind: 'p',
      html: "Monthly vs weekly: a 30-day rental runs roughly 2.5-3x the weekly rate (not 4x). Rental companies offer monthly-rate discounts to lock inventory during winter. Utilities, cleaning, and taxes typically add 10-15% on top. Most villa owners require first month upfront plus a security deposit.",
    },
    {
      kind: 'h2',
      text: 'Hilton Head winter snowbird logistics',
    },
    {
      kind: 'h3',
      text: 'Payment structure',
    },
    {
      kind: 'p',
      html: "Most winter long-stays bill as: 25-50% at booking, remainder 30 days before arrival. Some owners bill month-by-month for 90+ day stays. Always get a written lease for stays over 28 days (it's required by state short-term-rental law anyway, and your rights are stronger under a lease).",
    },
    {
      kind: 'h3',
      text: 'Cancellation flexibility',
    },
    {
      kind: 'p',
      html: "Winter long-stay cancellation policies are more flexible than summer. Most allow cancellation up to 60 days out with a partial refund, and some allow shifting dates without penalty. Always confirm in writing before booking.",
    },
    {
      kind: 'h3',
      text: 'Utilities and wifi',
    },
    {
      kind: 'p',
      html: "Included in most rates. Double-check WiFi speed before booking if you're working remotely; speeds vary wildly (some villas run 50 Mbps, others 500+). Ask for a speed test screenshot if it matters to your week.",
    },
    {
      kind: 'h3',
      text: 'Delivery, services, mail',
    },
    {
      kind: 'p',
      html: "Grocery delivery (Instacart, Publix, Harris Teeter) runs daily. Amazon delivers reliably in 1-2 days. USPS General Delivery works if you need a temporary mailing address; better to have mail forwarded to a local P.O. Box if your stay exceeds 30 days. Cleaning services are bookable a la carte; most long-stay rentals include one mid-stay cleaning.",
    },
    {
      kind: 'h2',
      text: 'Best winter activities by month',
    },
    {
      kind: 'ul',
      items: [
        "<strong>November:</strong> Thanksgiving restaurants (book by Nov 1), holiday lights preview at Harbour Town, peak fall bird migration at Pinckney Island.",
        "<strong>December:</strong> Holiday lights throughout Harbour Town, Christmas Eve service at the Church of the Cross in Bluffton, beach bonfires on Forest Beach.",
        "<strong>January:</strong> Long bike rides (cool, dry), Sea Pines Forest Preserve hikes, gym-plus-golf days, indoor cooking and wine projects in the villa.",
        "<strong>February:</strong> Valentine's dinners (book 2 weeks out), whale-watching from Savannah, kayaking Broad Creek at low tide.",
        "<strong>March:</strong> Bird migration, golf in peak condition, beach walks warming up, spring break planning if you're staying through April.",
      ],
    },
    {
      kind: 'h2',
      text: 'Hilton Head winter guide: FAQ',
    },
    {
      kind: 'faq',
      label: 'Questions we hear most',
      items: [
        {
          q: 'Is Hilton Head worth visiting in the winter?',
          a: "For snowbirds, remote workers, and couples who want a quiet mild-weather escape, yes. Days run 55-68\u00b0F, the island is genuinely quiet, and villa rates are 50-55% below summer peak. For beach-first trips where pool weather matters, pick a warmer destination or wait until May.",
        },
        {
          q: "What's the weather like on Hilton Head in January?",
          a: "Average high 58\u00b0F, average low 41\u00b0F. Sunny about two-thirds of days. Hard freezes (below 32\u00b0F) happen one to three nights per month. Snow is a once-every-10-years event. You'll wear a jacket at sunset and a sweater most days. Ocean swimming is out (water averages 55\u00b0F).",
        },
        {
          q: 'How much does a monthly rental cost on Hilton Head?',
          a: "A 2BR interior villa runs $2,800-3,500 for 30 days in winter. A 3BR oceanfront villa in Palmetto Dunes or Sea Pines runs $5,500-7,500. Harbour Town villas and Palmetto Bluff stays run higher. Utilities, cleaning, and taxes typically add 10-15% on top. For a full breakdown see the <a href=\"/hilton-head-winter-rental\">Hilton Head winter rental planner</a>.",
        },
        {
          q: "What's open on Hilton Head in January?",
          a: "All major restaurants, all 12+ golf courses, bike rentals, kayak tours, Coastal Discovery Museum, Sea Pines Forest Preserve, Harbour Town Lighthouse, grocery stores, and medical facilities run year-round. A handful of restaurants (3-4 of 30 top spots) close one night a week. Nothing major shuts for the winter.",
        },
        {
          q: 'Can you swim in the ocean on Hilton Head in winter?',
          a: "No, not comfortably. Water temperature averages 55\u00b0F in January-February. You can walk the beach, bike the hard-packed sand, and kayak without an issue, but swimming requires a wetsuit that most visitors don't bring. Early-season swimming starts in April (67\u00b0F water); full swim season is May-October.",
        },
        {
          q: 'Is Hilton Head a good snowbird destination compared to Florida?',
          a: "Different rather than better. Hilton Head is cooler (55-68\u00b0F in January vs 75\u00b0F in south Florida) and quieter, with fewer tourists and 50-60% lower rental rates than Naples, Marco Island, or south Florida beach towns. If you want 80\u00b0F pool weather, Florida wins. If you want mild days, empty bike paths, and significantly lower costs, Hilton Head is the right pick.",
        },
        {
          q: 'How long do most snowbirds stay on Hilton Head?',
          a: "The most common winter long-stay we book is 30 days in January or February. About 30% of our snowbird clients do 60-day stays, and 15% do 90-day stays. Under 14 days is too short to amortize the travel effort; over 90 days has South Carolina tax implications worth discussing with your accountant.",
        },
        {
          q: 'Can I golf on Hilton Head in winter?',
          a: "Yes, all 12+ courses stay open year-round. Winter greens are slower (seasonal dormancy) and green fees run 30-40% below summer. Conditioning is actually excellent in February-March because cool nights firm the greens. Tee sheets are open; Harbour Town still requires Sea Pines Resort priority. See the <a href=\"/blog/hilton-head-golf-courses-ranked\">Hilton Head golf courses ranked</a>.",
        },
        {
          q: 'What should I pack for Hilton Head in winter?',
          a: "Jeans, long-sleeve tees, a sweater, a windbreaker for beach walks, waterproof shoes, a light rain shell, and one dinner-out outfit. A swimsuit is optional; villa pools and hot tubs are usable some days. Flip-flops you probably won't wear except on 65\u00b0F afternoons. Packlist weighs less than summer; no beach gear needed.",
        },
        {
          q: 'Are there snowbird communities on Hilton Head?',
          a: "Yes, informally. Palmetto Dunes, Sea Pines, and Shelter Cove all have substantial winter long-stay populations, with pickleball leagues, weekly happy hours, and tennis round-robins that visitors can join. Contact the property management company or HOA of your rental for local schedules.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan your Hilton Head winter stay',
    },
    {
      kind: 'p',
      html: "Winter long-stays are the quietest deal on the Hilton Head calendar. If you want us to match you to the right neighborhood, villa, and length of stay, the <a href=\"/hilton-head-winter-rental\">Hilton Head winter rental planner</a> is the landing page; the <a href=\"/itinerary\">$450 itinerary service</a> covers full long-stay logistics (villa short-list, utilities, delivery setup, local gym and medical contacts). For weather specifics by month, see the <a href=\"/blog/best-time-to-visit-hilton-head\">Hilton Head weather guide</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 20) ACTIVITIES. Hilton Head fishing guide
// ---------------------------------------------------------------------------

const postFishingGuide: Post = {
  slug: 'hilton-head-fishing-guide',
  title: 'Hilton Head Fishing Guide: Inshore, Offshore & Charters in 2026',
  excerpt:
    'Bull redfish in October, mahi offshore in July, sharks all summer. A local breakdown of what to fish, when, how to book a charter, and what it costs.',
  description:
    'The complete guide to fishing on Hilton Head Island: inshore redfish and trout, offshore mahi and tuna, shark fishing season, best charter operators, prices, and tips from people who live here.',
  category: 'Activities',
  readTime: '10 min',
  publishedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 20,
  relatedNeighborhoods: ['shelter-cove'],
  keywords: [
    'hilton head fishing',
    'hilton head fishing charters',
    'inshore fishing hilton head',
    'hilton head shark fishing',
    'offshore fishing hilton head island',
    'best time to fish hilton head',
    'hilton head fishing guide 2026',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head sits at the intersection of three distinct fisheries: the shallow tidal creeks and estuaries of Broad Creek and the May River, the nearshore Atlantic waters out to the Gulf Stream continental shelf, and Port Royal Sound — one of the deepest natural harbors on the East Coast. That combination means you can be sight-casting for redfish in four inches of water at 7am and trolling for mahi in 80-foot blue water by noon. Fishing here is not a side activity. It's a reason to come.",
    },
    {
      kind: 'callout',
      label: 'Quick reference',
      html: '<strong>Inshore best months:</strong> September–November (bull reds), April–June (flounder). <strong>Offshore best months:</strong> June–September (mahi, wahoo, tuna). <strong>Shark season:</strong> May–September. <strong>No license required</strong> if you book a licensed charter.',
    },
    {
      kind: 'h2',
      text: 'Inshore fishing: the backwater season',
    },
    {
      kind: 'p',
      html: "Inshore fishing on Hilton Head targets the shallow estuaries around Broad Creek, Calibogue Sound, Port Royal Sound, and the May River in Bluffton. The primary inshore species — redfish, flounder, spotted seatrout, sheepshead, and black drum — live in these waters year-round, but the seasons matter.",
    },
    {
      kind: 'table',
      caption: 'Inshore species calendar (Hilton Head Island)',
      headers: ['Species', 'Peak Season', 'Where', 'Method'],
      rows: [
        ['Redfish (Red Drum)', 'Sep–Nov (bull reds), Apr–Jun (slot fish)', 'Broad Creek flats, oyster bars', 'Topwater, live shrimp, DOA Shrimp lure'],
        ['Flounder', 'Apr–Jun, Sep–Oct', 'Creek mouths, dock pilings', 'Bucktail jigs, live mud minnows'],
        ['Spotted Seatrout', 'Spring and fall', 'Grass flats, Calibogue Sound', 'Popping cork with live shrimp'],
        ['Sheepshead', 'Dec–Mar', 'Dock pilings, jetties', 'Fiddler crabs on light tackle'],
        ['Black Drum', 'Mar–May', 'Oyster beds', 'Cut shrimp on bottom'],
        ['Tarpon (catch-and-release)', 'Jul–Sep', 'Port Royal Sound', 'Live mullet, fly fishing'],
      ],
    },
    {
      kind: 'p',
      html: 'October is the standout month. Bull redfish — fish that have been growing all summer in the creeks — move onto the flats in schools. A sight-fishing guide working the grass edges in October can put you on 20+ fish in a half-day. <strong>If you fish one month on Hilton Head, fish October.</strong>',
    },
    {
      kind: 'h2',
      text: 'Offshore fishing: Gulf Stream access',
    },
    {
      kind: 'p',
      html: "Hilton Head sits about 40 miles from the Gulf Stream, which makes offshore trips practical but not short — plan on a 1.5-hour run each way on a 35-foot center console. The offshore fishery peaks June through September when warm blue water pushes northwest and mahi, wahoo, and yellowfin tuna arrive behind floating weed lines.",
    },
    {
      kind: 'table',
      caption: 'Offshore species calendar',
      headers: ['Species', 'Peak Season', 'Depth/Location', 'Method'],
      rows: [
        ['Mahi-Mahi', 'Jun–Sep', 'Gulf Stream, 60–120 ft, weed lines', 'Trolling, live bait'],
        ['Wahoo', 'Jul–Sep', 'Gulf Stream, deep water', 'High-speed trolling'],
        ['Yellowfin Tuna', 'Jul–Oct', 'Gulf Stream, 80–150 ft', 'Chunking, trolling'],
        ['King Mackerel', 'May–Oct', 'Nearshore, 20–40 ft', 'Live bait, trolling'],
        ['Red Snapper', 'Jun–Aug (open season)', 'Betsy Ross Reef (~18 mi offshore)', 'Bottom fishing, circle hooks'],
        ['Black Sea Bass', 'Year-round', 'Any reef structure', 'Bottom fishing'],
        ['Barracuda', 'May–Oct', 'Nearshore reefs', 'Trolling, casting lures'],
      ],
    },
    {
      kind: 'callout',
      html: '<strong>Betsy Ross Reef</strong> is the largest artificial reef in South Carolina, positioned about 18 miles southeast of Hilton Head. It holds concentrations of red snapper, black sea bass, grouper, and amberjack. A nearshore bottom-fishing trip to the reef is a strong option for groups who want fish-on-rod action without a Gulf Stream run.',
    },
    {
      kind: 'h2',
      text: 'Shark fishing: the sleeper hit',
    },
    {
      kind: 'p',
      html: "Shark fishing gets undersold on Hilton Head, which is a shame because it's one of the most accessible big-game experiences in the Southeast. Fifteen to twenty species arrive in the nearshore waters in May, and charter trips running 2–3 hours out of Shelter Cove routinely hook blacktip, bull, lemon, hammerhead, and tiger sharks. No offshore run required — most shark action happens 3–15 miles out.",
    },
    {
      kind: 'p',
      html: "Expect sharks in the 4–8 foot range on most trips; the occasional bull or tiger pushes past 10 feet. All sharks are catch-and-release. The <strong>best window is June through August</strong>, with action tapering in September as water temperatures cool.",
    },
    {
      kind: 'h2',
      text: 'Charter fishing: what to book and what to pay',
    },
    {
      kind: 'p',
      html: "Most charters operate out of <strong><a href=\"/hilton-head/shelter-cove\">Shelter Cove Harbour & Marina</a></strong> (mid-island, off US-278) or <strong>Broad Creek Marina</strong> on the south end. Shelter Cove is the better logistical base — central, easy parking, restaurants for post-trip lunch. For offshore trips, Palmetto Bay Marina also has full-day offshore boats.",
    },
    {
      kind: 'table',
      caption: 'Charter fishing price guide (Hilton Head Island, 2026 estimates)',
      headers: ['Trip Type', 'Duration', 'Price Range (whole boat)', 'Best For'],
      rows: [
        ['Inshore (backwater)', '2–3 hours', '$275–$350', 'Families, first-timers, kids under 10'],
        ['Inshore (extended)', '4 hours', '$375–$450', 'Serious inshore anglers'],
        ['Nearshore reef', '4–5 hours', '$500–$650', 'Mixed groups, bottomfish focus'],
        ['Shark fishing', '3–4 hours', '$500–$700', 'Groups seeking big-game action'],
        ['Offshore full day', '8–10 hours', '$1,200–$1,800', 'Mahi/tuna/wahoo pursuit'],
        ['Fly fishing (inshore)', '4 hours', '$450–$600', 'Fly anglers targeting redfish/tarpon'],
      ],
    },
    {
      kind: 'tier',
      label: 'Top charter operators',
      subtitle: 'Our honest read on the options.',
      accent: 'gold',
      items: [
        {
          name: 'Shelter Cove-based inshore guides',
          meta: 'Inshore / nearshore',
          blurb: 'The best inshore guides on the island operate out of Shelter Cove. Book through the marina directly or ask us — we vet the captains and know which ones work well with kids and beginners vs. serious anglers who want to sight-fish.',
        },
        {
          name: 'Off the Hook Fishing Charters',
          meta: 'Nearshore / shark',
          blurb: 'Solid reputation for nearshore reef trips and shark fishing. Boats run out of Broad Creek. Captains are knowledgeable and patient with non-anglers.',
        },
        {
          name: 'Offshore full-day boats',
          meta: 'Offshore / Gulf Stream',
          blurb: 'For Gulf Stream offshore trips, you want a purpose-built offshore boat (35+ feet) with twin engines. Booking these 3–4 weeks ahead in summer is smart — the best captains fill up fast. We handle this as part of our concierge service.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Fishing without a charter',
    },
    {
      kind: 'p',
      html: "If you want to fish independently, South Carolina requires a recreational saltwater fishing license for anyone 16 and older fishing from shore or a private vessel. A 14-day non-resident license runs about $11. You do <em>not</em> need a license if you're on a licensed charter boat.",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Fishing piers:</strong> The public fishing pier at Folly Field Beach Park is free and stocked with spots for mullet, speckled trout, and flounder.',
        '<strong>Kayak fishing:</strong> Renting a kayak and paddling Broad Creek at low tide is a legitimate inshore fishing option — redfish and flounder concentrate around the oyster bars on the edges.',
        '<strong>Shore fishing:</strong> The beach near the jetties at the north end of the island (near Port Royal Plantation) is a known spot for bluefish and whiting runs in fall.',
      ],
    },
    {
      kind: 'h2',
      text: 'What to bring on a charter',
    },
    {
      kind: 'ul',
      items: [
        'Polarized sunglasses — essential for sight-fishing and spotting fish on the flats',
        'Sunscreen (reef-safe preferred — the Lowcountry takes its estuaries seriously)',
        'Motion sickness medication if going offshore (take 30 min before departure)',
        'A cooler and ice if you want to keep fish — most inshore charters assume catch-and-release unless discussed upfront',
        'Layers in spring/fall — it is cold on the water at 6am even in May',
      ],
    },
    {
      kind: 'faq',
      label: 'Fishing FAQ',
      items: [
        {
          q: 'Do I need a fishing license on a charter?',
          a: "No. When you book a licensed charter captain, their vessel license covers all anglers on board. You need your own license only if fishing from shore, a kayak, or a private boat.",
        },
        {
          q: 'Can kids fish on Hilton Head?',
          a: "Yes — a 2-hour inshore trip out of Shelter Cove is one of the best family activities on the island. Kids under 10 love it. The fish are active, the boats are stable, and the captain handles the bait. Ask specifically for a 'family-friendly' or 'beginner' inshore captain when booking.",
        },
        {
          q: 'What is the best month to fish Hilton Head?',
          a: "October for inshore (bull redfish on the flats). July for offshore (peak mahi and wahoo season). May or September for a solid all-around trip that includes both inshore and nearshore options.",
        },
        {
          q: 'Can I keep what I catch?',
          a: "For inshore fishing, keeping redfish (within slot limits), flounder (during open season), and other species is allowed per SC regulations. Offshore, you can keep mahi, king mackerel, and reef fish within bag limits. Sharks and tarpon are catch-and-release. Ask your captain — they know the current season rules.",
        },
        {
          q: 'How far in advance should I book?',
          a: "Summer (June–August): 2–4 weeks ahead, especially for weekend dates. Fall inshore season (September–November): 1–2 weeks is usually fine. Offshore full-day trips in prime season should be booked a month out. We can handle charter booking as part of our concierge service.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Book it as part of your trip plan',
    },
    {
      kind: 'p',
      html: "Fishing charters are one of the items we handle most often for clients — finding the right captain for your group's skill level, coordinating timing with other activities, and making sure you're fishing the right species window for your travel dates. Browse the <a href=\"/local/water-activities\">local charter and tour operators</a> we recommend, or, if you want us to build a trip around a fishing day (or two), the <a href=\"/itinerary\">itinerary service</a> is the right place to start.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 21) ACTIVITIES. Dog-friendly Hilton Head guide
// ---------------------------------------------------------------------------

const postDogFriendly: Post = {
  slug: 'hilton-head-dog-friendly-guide',
  title: 'Dog-Friendly Hilton Head: The Complete Guide for 2026',
  excerpt:
    'Yes, you can bring your dog — but the rules vary by season and most visitors get them wrong. Here\'s the honest guide: beach hours, dog parks, pet-friendly villas, and where to eat with your dog.',
  description:
    'Everything you need to know about bringing your dog to Hilton Head Island: seasonal beach rules, off-leash parks, pet-friendly restaurants and villas, and tips from people who live here year-round.',
  category: 'Activities',
  readTime: '8 min',
  publishedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 21,
  relatedNeighborhoods: ['forest-beach', 'sea-pines', 'shelter-cove'],
  keywords: [
    'hilton head dog friendly',
    'dogs on hilton head beach',
    'hilton head pet friendly rentals',
    'hilton head dog park',
    'can I bring my dog to hilton head beach',
    'pet friendly hilton head island',
    'dog friendly hilton head vacation',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head is genuinely dog-friendly — more so than most beach destinations in the Southeast. But the beach rules are seasonal and specific, and getting them wrong means watching a beach patrol officer politely ask you to leave at 9am on a July morning. Here's everything you need to know before you arrive.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>October 1 – March 31:</strong> Dogs allowed on the beach anytime, on leash or under voice control. <strong>April 1 – Friday before Memorial Day:</strong> Dogs allowed 10am–5pm on leash. <strong>Memorial Day weekend – September 30:</strong> Dogs NOT allowed on the beach between 10am and 5pm — you can go early morning or evening. These are town ordinances, enforced.",
    },
    {
      kind: 'h2',
      text: 'Beach rules by season',
    },
    {
      kind: 'p',
      html: "Hilton Head Island's beach rules are set by the Town of Hilton Head Island, and they actually make sense once you understand the reasoning: the summer restriction protects both nesting shorebirds and beachgoers during peak hours.",
    },
    {
      kind: 'table',
      caption: 'Hilton Head dog beach rules (Town ordinance)',
      headers: ['Season', 'Dates', 'Dogs Allowed?', 'Hours', 'Leash Rule'],
      rows: [
        ['Winter / shoulder', 'Oct 1 – Mar 31', 'Yes', 'Anytime', 'On leash or voice control'],
        ['Spring', 'Apr 1 – Fri before Memorial Day', 'Yes', '10am – 5pm on leash only', 'Leash required'],
        ['Summer', 'Memorial Day – Sep 30', 'Restricted', 'Before 10am and after 5pm only', 'Leash required'],
      ],
    },
    {
      kind: 'p',
      html: "The summer restriction is the one that catches people. If you're traveling in July or August with your dog, plan your beach time for <strong>the early morning</strong> — first light to 9:30am is genuinely one of the best times to be on the beach anyway, before the crowd and the heat. Then pick up and head to a dog park or shaded trail for midday.",
    },
    {
      kind: 'h2',
      text: 'Dog parks and off-leash areas',
    },
    {
      kind: 'p',
      html: "Hilton Head has several excellent options for off-leash exercise and shaded trail time — important during summer.",
    },
    {
      kind: 'tier',
      label: 'Dog parks and trail access',
      subtitle: "Ranked by off-leash freedom and how much your dog will actually love it.",
      accent: 'primary',
      items: [
        {
          name: 'Chaplin Community Park Dog Park',
          meta: 'Off-leash, fenced',
          blurb: "The island's dedicated off-leash dog park. Fully fenced with double-gate entry. Located just off William Hilton Parkway between Singleton Beach Road and Burke's Beach Road. Separate sections for large and small dogs. Free.",
        },
        {
          name: 'Sea Pines Forest Preserve',
          meta: 'On-leash trails, forested',
          blurb: "Four miles of shaded trails through a 605-acre maritime forest. Dogs must be on leash, but the shade and wildlife make this one of the best dog walks on the island — great for a midday outing when the beach is restricted. Small vehicle entrance fee for non-Sea-Pines guests.",
        },
        {
          name: 'Shelter Cove Community Park',
          meta: 'On-leash, waterfront',
          blurb: 'A waterfront park at Shelter Cove Harbour with paved paths and green space. Dogs on leash welcome. Good post-dinner walk with your dog while the rest of your group grabs ice cream at the marina.',
        },
        {
          name: 'Pinckney Island National Wildlife Refuge',
          meta: 'On-leash, free, excellent wildlife',
          blurb: 'Just across the bridge from Hilton Head (before you get to the island). Five miles of trails through salt marsh, ponds, and maritime forest. Dogs on leash allowed. One of the genuinely great dog hikes in the Lowcountry. Free, no facilities.',
        },
        {
          name: 'Jarvis Creek Park',
          meta: 'On-leash, kayak launch',
          blurb: 'A mid-island park with a boat ramp, picnic area, and walking path along Jarvis Creek. Good for a quick leg-stretch with your dog. Free.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Pet-friendly villas and accommodation',
    },
    {
      kind: 'p',
      html: "Most vacation villas on Hilton Head allow pets, but the policies — and the pet fees — vary significantly by property. Here's what to know before you book.",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Pet fees are almost universal:</strong> Expect a non-refundable pet fee of $75–$200, or a refundable pet deposit of $150–$500. Ask upfront — some properties charge both.',
        '<strong>Weight limits are common:</strong> Many properties cap at 25–50 lbs per dog. If your dog is larger, filter explicitly or call the rental company to confirm.',
        '<strong>Fenced yards are rare but findable:</strong> If a fenced yard is important, filter for it specifically or contact us — we know which villa buildings have enclosed patios and ground-floor units with yard access.',
        '<strong>Best neighborhoods for dogs:</strong> Forest Beach and Shelter Cove tend to have the most dog-friendly rental inventory. Forest Beach is flat, walkable to Coligny Beach, and has easy pavement for morning walks. Sea Pines has the Forest Preserve access.',
        '<strong>Ask about the dog gate situation:</strong> Many villas have interior staircases or open floor plans — a dog gate matters if you have a senior dog or a puppy.',
      ],
    },
    {
      kind: 'h2',
      text: 'Dog-friendly restaurants and bars',
    },
    {
      kind: 'p',
      html: "The outdoor patio scene on Hilton Head is genuinely dog-welcoming at several spots. These are the ones where your dog will actually be comfortable and welcomed, not just technically tolerated.",
    },
    {
      kind: 'tier',
      label: 'Pet-friendly patios worth visiting',
      subtitle: 'Outdoor dining where dogs are genuinely welcome.',
      accent: 'primary',
      items: [
        {
          name: 'The Salty Dog Cafe',
          meta: 'South Beach Marina, Sea Pines',
          blurb: "Hilton Head's most iconic outdoor dining spot has a large dog-friendly patio and an actual dog-themed culture (the cartoon mascot is a Lab). The area around South Beach Marina is dog-friendly in general — a good evening destination.",
        },
        {
          name: 'Hudson\'s Seafood House on the Docks',
          meta: 'Shelter Cove area',
          blurb: 'Outdoor waterfront deck with a relaxed atmosphere. Dogs welcome on the patio. Good for casual seafood dinner without feeling like you\'re inconveniencing anyone.',
        },
        {
          name: 'Coligny Plaza outdoor spots',
          meta: 'Forest Beach / Coligny area',
          blurb: 'Several casual restaurants and bars around Coligny Plaza have outdoor seating where dogs are welcome. Good for the after-beach lunch crowd. Ask at each spot — some outdoor sections are technically covered patios with open sides.',
        },
        {
          name: 'Harbour Town waterfront',
          meta: 'Sea Pines',
          blurb: 'The walkable marina area at Harbour Town has multiple options with outdoor seating. Dog-friendly in the open-air walkway sense. Check with individual spots for formal pet policies.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Veterinary and emergency services',
    },
    {
      kind: 'p',
      html: "If something happens to your dog while you're on the island, here's what to know:",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Hilton Head Island Veterinary Clinic</strong> on William Hilton Parkway handles routine and urgent care during business hours.',
        '<strong>Bluffton Animal Medical Center</strong> (15 min away in Bluffton) is a solid backup option.',
        '<strong>Nearest 24/7 emergency vet:</strong> VCA Coastal Animal Hospital in Savannah, GA (~45 min). For after-hours emergencies, this is where you go.',
        "If your dog eats something on the beach — check for <strong>blue-green algae warnings</strong> (rare but present in some lagoons in summer). Don't let your dog drink from standing water in the lagoon system.",
      ],
    },
    {
      kind: 'h2',
      text: 'What to pack for your dog',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Fresh water and a portable bowl</strong> — always, especially in summer when pavement gets hot and shade is limited between spots',
        '<strong>Dog booties or paw wax</strong> — optional but genuinely useful in July/August when asphalt reaches 120°F in direct sun',
        '<strong>Leash (multiple)</strong> — 6-foot for trails and parks, a longer training lead for open beach time in winter',
        '<strong>Poop bags (more than you think)</strong> — all public spaces require cleanup; beach patrols issue fines',
        '<strong>A printed copy of beach hour rules</strong> — saves the awkward Google scramble when you\'re standing at the beach access with a ranger nearby',
        '<strong>Your vet\'s contact info and your dog\'s vaccination records</strong> — some pet-friendly rentals ask for proof of rabies vaccination',
      ],
    },
    {
      kind: 'faq',
      label: 'Dog-friendly Hilton Head FAQ',
      items: [
        {
          q: 'Can my dog go on Hilton Head Beach in summer?',
          a: "Yes, but only before 10am and after 5pm from Memorial Day through September 30. During those restricted hours, dogs must still be on leash. The early morning beach — usually 6:30–9am — is one of the most beautiful times to be there anyway.",
        },
        {
          q: 'Are there dog-friendly beaches in the area with no restrictions?',
          a: "Hilton Head has the best overall dog experience of any Lowcountry beach. Nearby Hunting Island State Park (about 45 min north) allows leashed dogs on its beach year-round with no time restrictions. Worth a day trip if you want a full beach day in summer.",
        },
        {
          q: 'Do vacation rentals allow dogs?',
          a: "Most do, with a pet fee. Filter specifically for pet-friendly listings on VRBO or Airbnb, or let us find you a villa — we know which buildings have the best setups for dogs (ground-floor access, enclosed patios, easy beach walk).",
        },
        {
          q: 'Is the Sea Pines Forest Preserve dog-friendly?',
          a: "Yes — dogs on leash are welcome on the trails. There's a small vehicle entry fee if you're not staying within Sea Pines. It's one of the best midday dog activities when the beach is restricted.",
        },
        {
          q: 'What is the Hilton Head leash law?',
          a: "Dogs must be on a leash on all public beaches and in all public parks and common areas. The exception is the Chaplin Community Park off-leash enclosure. Voice control is technically allowed on the beach October–March but leash is still safer near crowds.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Finding a dog-friendly villa',
    },
    {
      kind: 'p',
      html: "Finding the right pet-friendly villa — ground-floor access, walkable to the beach, fenced outdoor space — takes more than a VRBO filter. If you want us to shortlist options for your dog's size, travel dates, and neighborhood preference, the <a href=\"/itinerary\">itinerary service</a> covers villa matching as part of the full planning package.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 22) PLANNING. Hilton Head weekend getaway — drive market
// ---------------------------------------------------------------------------

const postWeekendGetaway: Post = {
  slug: 'hilton-head-weekend-getaway',
  title: 'The Perfect Hilton Head Weekend Getaway: Charlotte, Atlanta & Savannah',
  excerpt:
    'Four hours from Charlotte, four hours from Atlanta, 45 minutes from Savannah. Here\'s the exact route, a 2-night and 3-night itinerary, and what to do with the time you have.',
  description:
    'Planning a weekend trip to Hilton Head from Charlotte, Atlanta, or Savannah? Drive times, exact routes, 2-night and 3-night itineraries, where to stay, and what to eat. A local\'s guide for the drive market.',
  category: 'Planning',
  readTime: '9 min',
  publishedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 22,
  relatedNeighborhoods: ['forest-beach', 'palmetto-dunes'],
  keywords: [
    'hilton head weekend getaway',
    'charlotte to hilton head road trip',
    'atlanta to hilton head drive',
    'hilton head 2 day itinerary',
    'hilton head weekend trip from charlotte',
    'savannah and hilton head weekend',
    'hilton head road trip from atlanta',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head is one of the most underrated long-weekend destinations on the East Coast — not because it's obscure, but because most people assume it's a week-long trip. It isn't. Charlotte is 4.5 hours away. Atlanta is 4 hours. Savannah is 45 minutes. You can leave Friday at 2pm and have your feet in the sand before dinner. Here's how to do it right.",
    },
    {
      kind: 'callout',
      label: 'The drive case in one line',
      html: 'Charlotte: 250 miles via I-26 E → I-95 S → US-278 E. Atlanta: 240 miles via I-75 S → I-16 E → I-95 N → US-278 E. Savannah: 40 miles via US-278 E, straight shot.',
    },
    {
      kind: 'h2',
      text: 'Getting there: from Charlotte',
    },
    {
      kind: 'p',
      html: "The Charlotte to Hilton Head drive is one of the most painless coastal routes in the South — almost entirely interstate until the final 15 miles. Realistic drive time: <strong>4 to 4.5 hours without stops</strong>, depending on I-26 traffic through Columbia.",
    },
    {
      kind: 'ol',
      items: [
        'Take I-77 S from Charlotte to I-26 E toward Columbia (about 90 minutes)',
        'Stay on I-26 E through Columbia — this is your halfway point, good for gas and coffee',
        'Pick up I-95 S at the junction near Santee (about 30 minutes past Columbia)',
        'Exit onto US-278 E toward Hilton Head Island at Exit 8 — 30 more minutes across Bluffton',
        '<strong>Stop in Old Town Bluffton</strong> before crossing the bridge — it\'s 10 minutes off route, walkable, and worth a quick stretch',
      ],
    },
    {
      kind: 'h2',
      text: 'Getting there: from Atlanta',
    },
    {
      kind: 'p',
      html: "Atlanta to Hilton Head is about 4 hours on a good traffic day. The route goes south through Macon before cutting east toward Savannah and the coast.",
    },
    {
      kind: 'ol',
      items: [
        'Take I-75 S from Atlanta through Macon (about 90 minutes)',
        'Exit at I-16 E toward Savannah — straight, easy highway for 90 miles',
        'Pick up I-95 N just outside Savannah — drive 20 miles north',
        'Take Exit 8 onto US-278 E — Hilton Head Island is 30 minutes east',
        '<strong>Savannah detour option:</strong> If you leave Atlanta early, drop off the highway in Savannah for 2–3 hours (brunch, River Street walk, Forsyth Park) before finishing the drive. Savannah to Hilton Head is 45 min.',
      ],
    },
    {
      kind: 'h2',
      text: 'Getting there: from Savannah',
    },
    {
      kind: 'p',
      html: "Savannah sits 40 miles from Hilton Head via US-278 — an easy 45-minute drive. The Savannah/Hilton Head International Airport (SAV) is the closest major airport to the island, making it a natural feeder for both fly-drive trips and Savannah-combination weekends.",
    },
    {
      kind: 'p',
      html: "The classic combination: <strong>Friday night in Savannah</strong> (dinner on River Street, ghost tour, stay in the historic district) → <strong>Saturday and Sunday on Hilton Head</strong>. The two places have completely different vibes — Savannah's cobblestones vs. Hilton Head's beach trails — and work well as a pair.",
    },
    {
      kind: 'h2',
      text: '2-night weekend itinerary',
    },
    {
      kind: 'p',
      html: "Arriving Friday afternoon, leaving Sunday. This is the most common format — efficient and genuinely satisfying if you pick the right base.",
    },
    {
      kind: 'table',
      caption: '2-night weekend: Friday PM arrival, Sunday morning departure',
      headers: ['Time', 'Activity', 'Notes'],
      rows: [
        ['Friday 5–6pm', 'Arrive, check in', 'Mid-island location best for 2-night trips — central to everything'],
        ['Friday 7pm', 'Dinner: casual arrival meal', "Skull Creek Dockside or Charlie's L\'Etoile Verte — nothing fancy, get your bearings"],
        ['Saturday 8am', 'Morning beach walk or bike ride', 'Rent bikes the night before if possible — shops close early'],
        ['Saturday 10am', 'Beach setup', 'Choose a beach based on your vibe: Coligny (lively) or Folly Field (quiet)'],
        ['Saturday 1pm', 'Lunch at a beach bar', 'Reilley\'s Grill & Bar or Coligny beach area options'],
        ['Saturday 3pm', 'Optional activity', 'Dolphin tour, kayak rental, or golf afternoon if your group plays'],
        ['Saturday 7pm', 'Dinner', 'Book this in advance — The Boathouse at Harbour Town or One Hot Mama\'s for something memorable'],
        ['Sunday 8am', 'Early beach walk or Harbour Town coffee', 'Harbour Town has a coffee shop with marina views — excellent before the drive home'],
        ['Sunday 10am', 'Depart', 'Head out before 10am to avoid Sunday afternoon traffic on I-95/I-26'],
      ],
    },
    {
      kind: 'h2',
      text: '3-night weekend itinerary',
    },
    {
      kind: 'p',
      html: "Three nights — Thursday or Friday arrival, Monday morning departure — is the format where Hilton Head really opens up. You have time for golf, a dolphin tour, a nicer dinner, and still have a lazy beach day.",
    },
    {
      kind: 'table',
      caption: '3-night getaway: Friday arrival, Monday departure',
      headers: ['Day', 'Morning', 'Afternoon', 'Evening'],
      rows: [
        ['Friday', 'Drive — depart by noon if coming from Charlotte/Atlanta', 'Arrive, check in, grocery run to stock villa', 'Casual dinner, early night'],
        ['Saturday', 'Beach day — full morning', 'Dolphin tour or kayak tour (~2.5 hours, departs early afternoon)', 'Dinner at a waterfront restaurant (make a reservation)'],
        ['Sunday', 'Golf if applicable — tee time at 8am', 'Harbour Town walk, lighthouse climb, shopping', 'Best dinner of the trip — Hudson\'s or Poseidon'],
        ['Monday', 'Early morning beach walk (best light of the trip)', 'Depart by 9–10am', '—'],
      ],
    },
    {
      kind: 'h2',
      text: 'Where to stay for a long weekend',
    },
    {
      kind: 'p',
      html: "For a 2–3 night weekend trip, villa location matters more than it does on a week-long trip. You want to minimize driving on the island. If beach time tops the agenda, our <a href=\"/hilton-head-oceanfront-villas\">oceanfront villa picks</a> shortlist the buildings where you walk straight to the sand.",
    },
    {
      kind: 'tier',
      label: 'Best bases for a weekend trip',
      subtitle: 'Ranked for ease and access on a short stay.',
      accent: 'primary',
      items: [
        {
          name: 'Palmetto Dunes (mid-island)',
          meta: 'Best all-around weekend base',
          blurb: 'Central to restaurants, golf, and beach activities. The 11-mile lagoon system is great for morning kayaking. Three championship courses on property. Strong villa inventory across price points.',
        },
        {
          name: 'Forest Beach / Coligny area',
          meta: 'Best for beach-first weekenders',
          blurb: "Walking distance to Coligny Beach Park, bike rentals, and half a dozen casual restaurants. Best for groups who want to minimize driving. Not the most scenic setting but wildly practical for a 48-hour beach trip.",
        },
        {
          name: 'Sea Pines (south end)',
          meta: 'Best for a splurge or golf weekend',
          blurb: 'Harbour Town is here. The Salty Dog is here. Three golf courses and the Forest Preserve are here. If you want the full Hilton Head experience in two nights and price is secondary, book into Sea Pines.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'What to eat in a long weekend',
    },
    {
      kind: 'p',
      html: "You have roughly five or six meal slots on a long weekend. Here's how to allocate them:",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Friday night arrival dinner:</strong> Casual, no reservation needed. Skull Creek Dockside, Reilley\'s, or Fish Camp Bar & Grill.',
        '<strong>Saturday lunch:</strong> Grab-and-go near the beach. Rock Fish Seafood & Chicken, Big Bamboo Cafe.',
        "<strong>Saturday dinner:</strong> The one you book in advance. Hudson's Seafood House, Poseidon, or The Boathouse.",
        "<strong>Sunday morning:</strong> Coffee and pastry at Harbour Town Marina (Brown Dog Deli is right there) before a late checkout.",
        '<strong>Road-trip fuel (Bluffton stop):</strong> Old Town Bluffton\'s May River Coffee is the best coffee between I-95 and the island — worth a stop.',
      ],
    },
    {
      kind: 'h2',
      text: 'Weekend trip by season',
    },
    {
      kind: 'table',
      caption: 'When to go for a Hilton Head weekend',
      headers: ['Season', 'Months', 'Vibe', 'Crowds', 'Price', 'Verdict'],
      rows: [
        ['Spring', 'March–May', 'Warm, green, RBC Heritage buzz in April', 'Building — manageable', 'Lower than summer', 'Best overall weekend window'],
        ['Summer', 'June–August', 'Hot, full beach scene, families', 'Peak', 'Highest', 'Fun but book 4+ weeks out'],
        ['Fall', 'September–November', 'Cooler evenings, uncrowded, best fishing', 'Low', 'Drops 30–50% from summer', 'Best value weekend — our recommendation'],
        ['Winter', 'December–February', 'Quiet, locals-only feel', 'Very low', 'Lowest', 'Great for couples, not for beach swimmers'],
      ],
    },
    {
      kind: 'faq',
      label: 'Weekend getaway FAQ',
      items: [
        {
          q: 'Is Hilton Head worth a long weekend (vs. a full week)?',
          a: "Yes — completely. A 3-night weekend covers the highlights: a beach day, an activity (golf, dolphin tour, kayaking), and two good dinners. What you lose with less time is the slower pace — the afternoon nap on the beach, the second-round-of-golf feeling. If your schedule allows a week, take it. But a 3-night trip is not a compromise.",
        },
        {
          q: 'Can I do Hilton Head without a car?',
          a: "Not easily for a weekend trip. The island has a seasonal trolley (Breeze Transit) and Uber/Lyft, but coverage is limited. Renting a golf cart on the island is a fun and practical option for getting around within a neighborhood. But to get from the highway to the island, you need a car or a rideshare from Savannah.",
        },
        {
          q: 'Best time to visit Hilton Head for a weekend?',
          a: "September and October are our strongest recommendation — fall light, warm water (still 78°F in September), no summer crowds, and prices that are 30–50% lower than July. April is a close second: the island is beautiful in spring and the RBC Heritage golf tournament adds an optional bonus activity.",
        },
        {
          q: 'Should I fly into Savannah or Charlotte for a Hilton Head weekend?',
          a: "Savannah/Hilton Head International (SAV) is the obvious choice — 45 minutes from the island. Charleston (CHS, about 2 hours north) is a solid backup with more flight options. Atlanta (ATL) is 4 hours driving but has the most flights. If you're coming from the Northeast, flying to SAV is usually the most efficient option.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Plan it properly',
    },
    {
      kind: 'p',
      html: "A long weekend works best with a little upfront planning — the right villa, one dinner reservation, and one activity booked. If you want us to handle the logistics, the <a href=\"/itinerary\">itinerary service</a> is built for exactly this: 30 minutes on a call, a custom plan for your dates, and everything confirmed before you leave the driveway.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 23) ACTIVITIES. Hilton Head dolphin tour guide
// ---------------------------------------------------------------------------

const postDolphinTours: Post = {
  slug: 'hilton-head-dolphin-tours',
  title: 'Hilton Head Dolphin Tours: The Honest Guide for 2026',
  excerpt:
    "Calibogue Sound is one of the most reliable dolphin-watching spots on the East Coast. Here's which tour to book, when to go, and the one quirky behavior locals know that visitors miss.",
  description:
    "Hilton Head dolphin tours, ranked: catamaran cruises, zodiac speedboats, sunset trips, and kayak encounters. Prices, operators, best times of year, and tips for spotting dolphins from a local.",
  category: 'Activities',
  readTime: '8 min',
  publishedAt: '2026-04-25',
  author: 'Hilton Ahead',
  featuredOrder: 23,
  relatedNeighborhoods: ['shelter-cove', 'sea-pines'],
  keywords: [
    'hilton head dolphin tours',
    'best dolphin tour hilton head',
    'hilton head dolphin watching',
    'hilton head boat tours',
    'dolphin cruise hilton head',
    'sunset dolphin tour hilton head',
    'hilton head dolphin tour 2026',
  ],
  body: [
    {
      kind: 'p',
      html: "Calibogue Sound — the wide, brackish stretch of water between Hilton Head and Daufuskie Island — holds one of the most reliable resident populations of bottlenose dolphins on the South Atlantic coast. There are roughly 350 dolphins that live in these waters year-round, plus seasonal visitors that push the count past 500 in summer. The practical version: it's almost impossible to take a Hilton Head dolphin tour and <em>not</em> see dolphins. The real question is which tour, at what time, with which operator — see our <a href=\"/local/water-activities\">Hilton Head water-activity operators</a> for the full vetted list.",
    },
    {
      kind: 'callout',
      label: 'Quick read',
      html: '<strong>Best tour overall:</strong> 90-minute Calibogue Sound cruise out of Shelter Cove or Harbour Town. <strong>Most underrated:</strong> sunset trip in late spring or fall. <strong>Best for kids under 7:</strong> the catamaran (stable, slow, no spray). <strong>Most likely to see strand feeding:</strong> small-boat tour at low tide on the May River side.',
    },
    {
      kind: 'h2',
      text: 'What you are actually going to see',
    },
    {
      kind: 'p',
      html: "The dolphins here are <strong>Atlantic bottlenose dolphins</strong> (Tursiops truncatus), the same species you see at aquariums but living wild in roughly 6–25 feet of water. Pods of 4–12 are typical; you'll routinely see mothers with calves from May through August. Most operators run multi-stop loops through Calibogue Sound, Broad Creek, and the inland waterways — dolphins follow tide and bait, so a good captain reads water rather than driving to a fixed spot.",
    },
    {
      kind: 'p',
      html: "The thing that makes Hilton Head special is <strong>strand feeding</strong> — a learned behavior where dolphins coordinate to push fish onto a muddy bank, then beach themselves briefly to eat. It's been documented in only a handful of places worldwide. The Lowcountry pods around the May River and Calibogue Sound are one of those places. You won't see it on every tour, but if you book a small-boat tour at low tide with a captain who knows the strand-feeding sites, your odds jump dramatically.",
    },
    {
      kind: 'h2',
      text: 'Types of dolphin tours, ranked',
    },
    {
      kind: 'tier',
      label: 'Tour styles',
      subtitle: 'Pick the format that matches your group.',
      accent: 'gold',
      items: [
        {
          name: 'Catamaran cruise (90 min)',
          meta: 'Best for families, mixed ages',
          blurb: 'Stable double-hull boats that hold 30–40 people. No spray, easy to walk around, bathroom on board. Lower viewing angle than a powerboat but kids and grandparents do well. The default option for most visitors and the one we book most.',
        },
        {
          name: 'Sunset dolphin cruise (2 hr)',
          meta: 'Best for couples, photographers',
          blurb: "Departs ~90 minutes before sunset from Shelter Cove or Harbour Town. Dolphins feed actively at golden hour, light is dramatic, and crowds thin out. The single best version of this trip in spring (April–May) and fall (September–October) when temperatures are perfect on the water.",
        },
        {
          name: 'Zodiac / RIB speedboat (1–2 hr)',
          meta: 'Best for adults, thrill-seekers',
          blurb: 'Rigid inflatable boats with twin outboards — faster, closer to the water, more exciting. You cover more sound than a catamaran can. Not recommended for kids under 7, anyone with back issues, or pregnant guests. Run mostly out of Broad Creek Marina.',
        },
        {
          name: 'Kayak dolphin encounter (2.5 hr)',
          meta: 'Best for experienced paddlers',
          blurb: 'Guided kayak tours through Broad Creek or the Pinckney Island NWR put you at water level when dolphins surface 20 feet away. A real, quiet wildlife encounter — not a theme-park ride. You need to be a comfortable paddler and OK with the dolphins setting the pace.',
        },
        {
          name: 'Private charter (custom)',
          meta: 'Best for groups, special occasions',
          blurb: 'Book the whole boat and the captain runs your itinerary — dolphins, lighthouse, sandbar stop, sunset finish. Worth it for groups of 6+ where the per-person math is similar to a private. We arrange these as part of the concierge service.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Best operators and prices',
    },
    {
      kind: 'p',
      html: "Most dolphin tours operate out of three marinas: <strong>Shelter Cove Harbour & Marina</strong> (mid-island, easiest parking, walking distance to restaurants for after), <strong>Harbour Town Marina</strong> (south end, inside Sea Pines, scenic), and <strong>Broad Creek Marina</strong> (Palmetto Dunes side, where most speedboat operators run from).",
    },
    {
      kind: 'table',
      caption: 'Hilton Head dolphin tour price guide (2026 estimates, per person)',
      headers: ['Tour Type', 'Duration', 'Price (Adult)', 'Price (Kids)', 'Best Departure'],
      rows: [
        ['Catamaran cruise', '90 min', '$35–$45', '$20–$30', 'Mid-morning or sunset'],
        ['Sunset cruise', '2 hr', '$50–$75', '$30–$45', '90 min before sunset'],
        ['Zodiac/RIB speedboat', '1–2 hr', '$45–$70', '$30–$50 (age 7+ only)', 'Mid-morning'],
        ['Guided kayak tour', '2.5 hr', '$65–$85', '$50–$65 (age 10+)', 'Two hours before high tide'],
        ['Private charter (whole boat)', '2 hr', '$650–$950 total', 'included', 'Flexible — discuss with operator'],
      ],
    },
    {
      kind: 'tier',
      label: 'Operators worth booking',
      subtitle: "Our honest read — we don't take commissions.",
      accent: 'primary',
      items: [
        {
          name: 'Outside Hilton Head',
          meta: 'Naturalist-led tours, kayak + boat',
          blurb: 'The closest thing the island has to a true eco-tour outfit. Guides are actual marine naturalists, not just captains with a script. They run kayak tours, dolphin/nature catamaran cruises, and Pinckney Island trips. Best operator for kids who are curious about the wildlife (not just there for a boat ride).',
        },
        {
          name: 'Vagabond Cruise',
          meta: 'Catamaran out of Harbour Town',
          blurb: "The classic Sea Pines option. Departs from Harbour Town, runs Calibogue Sound and the Daufuskie shoreline. Good captains, large stable boat, decent for big multigenerational groups. Book the morning trip in summer to dodge afternoon thunderstorms.",
        },
        {
          name: 'Shelter Cove fleet',
          meta: 'Multiple operators, mid-island',
          blurb: 'Shelter Cove Harbour hosts several dolphin tour boats — Adventure Cruises, Pau Hana Boat Tours, and others. Quality varies by captain, not by company. Book through the marina or ask us — we know which captains are running this season.',
        },
        {
          name: 'Lowcountry Nature Tours',
          meta: 'Speedboat + nature-focused',
          blurb: "Speedboat-style trips with a heavy nature emphasis. Captain Amber's tours specifically are a regular recommendation among locals — high spotting rate, good narration, no theme-park vibe.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Best time of year for a dolphin tour',
    },
    {
      kind: 'p',
      html: "Dolphins are here every month of the year — the population is resident. What changes is the experience around the dolphins (water comfort, crowds, light, ancillary wildlife).",
    },
    {
      kind: 'table',
      caption: 'Dolphin tour by season',
      headers: ['Season', 'Months', 'Dolphin activity', 'Crowd level', 'Verdict'],
      rows: [
        ['Spring', 'March–May', 'High — calves born, active feeding', 'Light to moderate', 'Best month: late April–May'],
        ['Summer', 'June–August', 'High — daily activity, calves visible', 'Heavy — book ahead', 'Fine, but go at sunrise or sunset'],
        ['Fall', 'September–October', 'Very high — bait fish runs, feeding peaks', 'Moderate', 'Best overall window for tours'],
        ['Winter', 'November–February', 'Steady — fewer dolphins but quieter sound', 'Very low', 'Surprisingly good if dressed for cold'],
      ],
    },
    {
      kind: 'callout',
      label: 'Local tip',
      html: 'Book the <strong>second tour of the morning</strong> rather than the first. The first boat of the day spooks the pods; the second arrives after they\'ve resettled and the captain has radio intel from the earlier trip on where the dolphins are working.',
    },
    {
      kind: 'h2',
      text: 'What to bring (and what not to bring)',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Polarized sunglasses</strong> — cuts glare and lets you spot dorsal fins from farther out',
        '<strong>Light jacket or windbreaker</strong> in spring and fall — even at 75°F on land, the wind on the water adds a 10°F chill',
        '<strong>Reef-safe sunscreen</strong> applied <em>before</em> boarding (boats often discourage spray-on sunscreen on deck)',
        '<strong>A real camera or phone in a waterproof case</strong> — saltwater spray is brutal on electronics, especially on speedboats',
        '<strong>Motion sickness medication</strong> if you\'re prone — Calibogue Sound is usually flat but afternoon chop builds in summer',
        '<strong>Skip:</strong> heels, dangling jewelry, anything that can blow off — the wind takes things you didn\'t expect to lose',
      ],
    },
    {
      kind: 'h2',
      text: 'Tips for actually seeing dolphins (not just being on a boat)',
    },
    {
      kind: 'ol',
      items: [
        '<strong>Watch the birds.</strong> Diving pelicans and feeding gulls almost always mean dolphins are working bait below.',
        '<strong>Look for slick spots.</strong> A dolphin pushing fish leaves a flat patch on the water surface — captains call them "footprints."',
        '<strong>Listen, don\'t just look.</strong> A dolphin\'s exhale at the surface is a distinct sharp puff — quieter than you expect, but unmistakable once you\'ve heard it.',
        '<strong>Go at low tide if strand feeding matters to you.</strong> The behavior happens on exposed mud banks. Mid-tide is most reliable for general dolphin viewing.',
        '<strong>Don\'t lean over the rail when one surfaces close.</strong> Dolphins swim under boats; the next surface is often on the other side.',
      ],
    },
    {
      kind: 'h2',
      text: 'Combining a dolphin tour with the rest of your day',
    },
    {
      kind: 'p',
      html: "A 90-minute dolphin tour leaves the rest of your day open, which is the right way to use it. The patterns we recommend:",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Morning tour → beach afternoon:</strong> 9:30am Shelter Cove cruise → noon lunch at the marina → afternoon at Burkes Beach (15 min away)',
        '<strong>Afternoon tour → sunset dinner:</strong> 4pm tour from Harbour Town → 6:30pm dinner at Quarterdeck on the marina',
        '<strong>Sunset tour → late dinner:</strong> 6:30pm sunset cruise → 9pm dinner at <a href="/blog/hilton-head-romantic-restaurants">a romantic restaurant</a> (book ahead)',
        '<strong>Family day:</strong> Catamaran in the morning → lunch at <a href="/hilton-head/shelter-cove">Shelter Cove</a> → bike rentals or mini golf afternoon',
        "<strong>Activity stack:</strong> Pair with a fishing charter the same day — many operators can handle both. See the <a href=\"/blog/hilton-head-fishing-guide\">Hilton Head fishing guide</a>.",
      ],
    },
    {
      kind: 'faq',
      label: 'Dolphin tour FAQ',
      items: [
        {
          q: 'Will I definitely see dolphins?',
          a: "Almost always — most operators on Hilton Head report a 95–99% spotting rate, and many offer a 'see-them-or-cruise-again-free' guarantee. The resident population means there is no truly bad month. The exceptions are rare: heavy storms, days right after a cold snap, or unusual current conditions.",
        },
        {
          q: 'What is the best dolphin tour for young kids?',
          a: "A 90-minute catamaran cruise out of Shelter Cove or Harbour Town. Stable boat, no spray, bathroom on board, easy to walk around. Avoid the speedboat tours for kids under 7 — even kids who love boats can get rattled by the speed and bouncing.",
        },
        {
          q: 'Sunset cruise or daytime cruise — which is better?',
          a: "Sunset cruise wins for couples and photographers. Daytime works better for families because dolphins are visible against bright water and it's easier to see them clearly. If your trip is in summer (June–August), daytime tours are hot and crowded — go for the sunset slot.",
        },
        {
          q: 'How early should I book?',
          a: "Summer (June–August): book 1–2 weeks ahead, especially for sunset slots and weekend trips. Spring and fall: 3–4 days is usually enough. Winter: walk-up bookings are typically fine. RBC Heritage week (April) and the July 4th weekend always sell out — book a month in advance.",
        },
        {
          q: 'Are dolphin tours running in winter?',
          a: "Yes — most operators run year-round, with reduced winter schedules (typically 1–2 daily departures instead of 4–6). Dolphins are still here. Expect cooler water temps, fewer sightings of calves, and a much quieter experience on the boat. Bring a real jacket; the wind on the sound bites in January.",
        },
        {
          q: 'Can I see dolphins without booking a tour?',
          a: "Yes, occasionally — kayakers in Broad Creek and Sea Pines lagoon system encounter pods regularly, and the boardwalk at Shelter Cove sometimes spots dolphins working the marina entrance. But for a reliable hour with a pod, the tour is the move. See our <a href=\"/blog/hilton-head-kayaking-guide\">Hilton Head kayaking guide</a> for paddler routes that often produce dolphin encounters.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Make it part of a bigger plan',
    },
    {
      kind: 'p',
      html: "A dolphin tour is one of the easier activities to slot into a Hilton Head trip — but the right tour, at the right time of day, with the right captain, is a different experience than picking the first option off a hotel concierge brochure. If you want us to handle that piece (and pair it intelligently with the rest of your week), the <a href=\"/itinerary\">itinerary service</a> includes operator selection and timing as part of the standard plan. For a 3-day version of the trip, see the <a href=\"/blog/hilton-head-3-day-itinerary\">Hilton Head 3-day itinerary</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 24) ACTIVITIES. Hilton Head kayaking guide
// ---------------------------------------------------------------------------

const postKayakingGuide: Post = {
  slug: 'hilton-head-kayaking-guide',
  title: 'Hilton Head Kayaking Guide: Where to Paddle, Bioluminescence Tours & Operators',
  excerpt:
    "Calibogue Sound at sunrise, the Sea Pines lagoon system in the morning, bioluminescent paddle tours in summer. A local breakdown of every kayak option on the island.",
  description:
    "The complete guide to kayaking on Hilton Head Island: best paddle routes (Broad Creek, Sea Pines lagoons, Calibogue Sound), bioluminescence kayaking in summer, tour operators, prices, and a tour-vs-rental decision guide.",
  category: 'Activities',
  readTime: '8 min',
  publishedAt: '2026-04-25',
  author: 'Hilton Ahead',
  featuredOrder: 24,
  relatedNeighborhoods: ['shelter-cove', 'sea-pines'],
  keywords: [
    'hilton head kayaking',
    'kayaking hilton head island',
    'hilton head paddleboarding',
    'hilton head bioluminescence kayaking',
    'sea turtle kayak hilton head',
    'broad creek kayaking',
    'hilton head kayak rental',
    'hilton head kayaking guide 2026',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head's geography is built for paddling. The island sits between the Atlantic, two major sounds (Calibogue and Port Royal), and a lattice of tidal creeks and lagoons that snake through every neighborhood. You can launch a kayak from a Sea Pines lagoon at 7am, see herons, alligators, and dolphins before lunch, and never paddle the same water twice. This is a guide to the routes worth your time, the <a href=\"/local/water-activities\">kayak operators we trust</a>, and the calls (tour vs. rental, dawn vs. sunset, salt vs. fresh) most visitors get wrong.",
    },
    {
      kind: 'callout',
      label: 'Quick read',
      html: '<strong>Best route for beginners:</strong> Sea Pines lagoon system at low wind. <strong>Best wildlife paddle:</strong> Broad Creek at high tide. <strong>Best one-time-only experience:</strong> bioluminescent kayak tour, May–September, on a moonless night. <strong>Skip:</strong> open Calibogue Sound if there is any chop or wind above 10 mph.',
    },
    {
      kind: 'h2',
      text: 'Where to kayak — by route',
    },
    {
      kind: 'p',
      html: "Hilton Head has four distinct paddling environments, and each rewards a different type of trip. Pick by what you actually want from the day, not by what's closest to your villa.",
    },
    {
      kind: 'tier',
      label: 'Paddle routes ranked',
      subtitle: 'Where to launch and what each route is good for.',
      accent: 'gold',
      items: [
        {
          name: 'Broad Creek',
          meta: 'Best wildlife paddle on the island',
          blurb: 'The tidal creek that splits Hilton Head from north to south is the most productive paddle for wildlife — dolphins working bait, ospreys overhead, occasional manatees in summer. Launch from Broad Creek Marina or Shelter Cove. Fish at high tide; flats and oysters at low. The full creek is a 4–5 hour round trip; most paddlers do a 2-hour out-and-back.',
        },
        {
          name: 'Sea Pines lagoon system',
          meta: 'Best for beginners and families',
          blurb: '11 miles of interconnected lagoons inside Sea Pines Plantation. Calm water, no boat traffic, and serious alligator viewing — they sun on the banks and ignore the kayaks (do not return the favor). Sea Pines residents and renters can launch from multiple put-ins; day visitors can rent from the Sea Pines Plantation activity center. The lagoon route is the safest paddle on the island and the best for mixed-skill groups.',
        },
        {
          name: 'Pinckney Island National Wildlife Refuge',
          meta: 'Best for serious naturalists',
          blurb: 'Off-island just over the bridge — but a 15-minute drive from any villa. Pinckney is a 4,000-acre wildlife refuge accessible by kayak from a put-in just before the bridge. Roseate spoonbills, herons, alligators, and rookeries you cannot see from any other vantage. Best paddled with a guided tour the first time; the marsh maze is genuinely confusing without a guide.',
        },
        {
          name: 'Calibogue Sound (advanced)',
          meta: 'For experienced paddlers only',
          blurb: 'The wide sound between Hilton Head and Daufuskie produces the best dolphin encounters and the most dramatic scenery — but it is exposed water with real boat traffic, tidal currents, and fast-changing conditions. Only paddle this with a guide or after a clear briefing on launch points and wind windows. Beginners get into trouble here every season.',
        },
        {
          name: 'Sandbar trips at low tide',
          meta: 'Best half-day adventure',
          blurb: 'A specialty paddle: launch on a falling tide from Shelter Cove, paddle to a sandbar that emerges only on low water, picnic for an hour, and paddle back as the tide turns. Several guided operators run this; doing it without a guide requires reading tide charts well. The reward is a private beach in the middle of the sound that does not exist for most of the day.',
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Bioluminescent kayaking — the once-a-summer experience',
    },
    {
      kind: 'p',
      html: "From <strong>late May through September</strong>, the warm brackish water of the Lowcountry produces blooms of dinoflagellates — single-celled organisms that emit blue-green light when disturbed. Drag your paddle through the water at night and the wake glows. Knock on the hull and a halo of stars lights the surface. This is not metaphor. It looks exactly like the photos.",
    },
    {
      kind: 'p',
      html: "<strong>Conditions matter.</strong> The bioluminescence is strongest on dark, moonless nights, in waters with the right salinity, after warm days. A bright moon washes the effect out — book around the new moon for the best display. The launches are usually after 9pm and sometimes as late as 10:30pm in midsummer. Plan for a late dinner before, or a snack in the car after.",
    },
    {
      kind: 'callout',
      label: 'When to book a bio tour',
      html: '<strong>Peak window:</strong> July and August. <strong>Best dates:</strong> 2–3 nights on either side of the new moon. <strong>Operators that consistently run good bio tours:</strong> Outside Hilton Head, Hilton Head Kayak Co, and Pau Hana Boat Tours (occasional). Book <strong>1–2 weeks ahead</strong> in summer; tours fill fast in July.',
    },
    {
      kind: 'h2',
      text: 'Tour vs. rental — which makes sense',
    },
    {
      kind: 'p',
      html: "This is the call most visitors get wrong. The default is to rent — it's cheaper and feels more flexible — but a guided tour is genuinely better for the first paddle on the island, and almost always worth the upcharge for any complicated route.",
    },
    {
      kind: 'table',
      caption: 'Tour vs. rental decision guide',
      headers: ['Scenario', 'Tour or Rental?', 'Why'],
      rows: [
        ['First time paddling on Hilton Head', 'Tour', 'Tides, wildlife sites, and wind windows take a season to learn — a guide compresses that'],
        ['Sea Pines lagoon paddle', 'Rental', 'Calm, contained, hard to get lost — go on your own'],
        ['Broad Creek wildlife paddle', 'Either, lean tour', 'A guide will put you on dolphins; without one you might miss them'],
        ['Pinckney Island NWR', 'Tour', "The marsh is a maze; you'll spend more time finding the route than enjoying it"],
        ['Calibogue Sound', 'Tour only', 'Conditions matter too much; do not paddle this alone if you don\'t live here'],
        ['Bioluminescence', 'Tour only', 'Night paddling, no rental shop will let you take a kayak after dark anyway'],
        ['Repeat visit, comfortable on water', 'Rental', "You've done a tour; now do your own thing"],
      ],
    },
    {
      kind: 'h2',
      text: 'Best operators and prices',
    },
    {
      kind: 'tier',
      label: 'Kayak operators worth booking',
      subtitle: 'Our honest read on the options.',
      accent: 'primary',
      items: [
        {
          name: 'Outside Hilton Head',
          meta: 'Tours + rentals; multiple launch points',
          blurb: 'The best naturalist-led kayak operator on the island. Tours are guided by actual marine biologists, not just paddlers with a script. They run Broad Creek, Pinckney Island, sandbar trips, sunset paddles, and the bioluminescence tour. Rentals also available. Default first call.',
        },
        {
          name: 'Hilton Head Kayak Co',
          meta: 'Tours focused on small groups',
          blurb: 'Smaller, less corporate operation. Group sizes capped at 6–8 paddlers; better for couples or anyone wanting a more relaxed pace. Strong for sunrise and sunset paddles. They run a solid bioluminescence tour in summer.',
        },
        {
          name: 'Sea Pines Plantation activity center',
          meta: 'Rentals only, lagoon access',
          blurb: 'For lagoon paddling inside Sea Pines, this is the simplest option — rent on-site, launch into the lagoon system, return when done. Day-pass paddlers can also access via a guest pass. No guides, but the route is benign.',
        },
        {
          name: 'Shelter Cove launches',
          meta: 'Multiple rental + tour options',
          blurb: 'Shelter Cove Harbour has a couple of paddle outfits launching from the marina docks. Easy parking, restaurants on either side of the trip. Quality varies; ask the marina office which boat is running this season.',
        },
      ],
    },
    {
      kind: 'table',
      caption: 'Hilton Head kayaking price guide (2026 estimates)',
      headers: ['Activity', 'Duration', 'Price (per person)', 'Best For'],
      rows: [
        ['Lagoon rental (single)', 'Hourly, $20–$30', '—', 'Beginners, kids, casual paddlers'],
        ['Lagoon rental (tandem)', 'Hourly, $30–$45', '—', 'Couples, parent-with-child'],
        ['Half-day rental', '4 hours', '$45–$70', 'Day paddlers wanting full freedom'],
        ['Guided dolphin/wildlife tour', '2–2.5 hours', '$65–$85', 'First-time paddlers, naturalist focus'],
        ['Sandbar paddle tour', '3 hours', '$75–$95', 'Adventurous groups, low-tide window'],
        ['Bioluminescence tour', '90 min–2 hr', '$75–$110', 'Once-in-a-trip experience, summer only'],
        ['Pinckney Island guided', '3 hours', '$85–$110', 'Birders, wildlife photographers'],
        ['Sunset paddle', '90 min', '$60–$85', 'Couples, photographers, easy ask'],
      ],
    },
    {
      kind: 'h2',
      text: 'Wildlife you will likely see',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Bottlenose dolphins</strong> — pods of 4–12 work bait through Broad Creek and Calibogue Sound. See the <a href="/blog/hilton-head-dolphin-tours">Hilton Head dolphin tours guide</a> for more on the resident population.',
        "<strong>Alligators</strong> — Sea Pines lagoons have a healthy population. They sun on banks and ignore boats. Do not approach within 30 feet, and do not feed them under any circumstances (this is enforced).",
        '<strong>Roseate spoonbills</strong> — at Pinckney Island, especially in spring and early summer. The pink plumage is unmistakable.',
        '<strong>Sea turtles</strong> — May through October, especially in Calibogue Sound. Loggerhead nesting beaches are protected; do not approach turtles in the water.',
        '<strong>Bald eagles, ospreys, herons, ibis</strong> — year-round across all routes. Pinckney is the strongest birding paddle.',
        '<strong>Manatees (occasional)</strong> — June through September in warmer water. A real treat when you see one.',
      ],
    },
    {
      kind: 'h2',
      text: 'What to bring',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Reef-safe sunscreen</strong> — applied 30 minutes before launch (oxybenzone-based formulas damage the estuaries; the Lowcountry is serious about this)',
        '<strong>Polarized sunglasses with a strap</strong> — glare cuts your wildlife spotting, and you will tip them into the water without a strap',
        '<strong>Quick-dry clothing or a swimsuit under shorts</strong> — assume you will get wet from paddle drip and the occasional small wave',
        '<strong>Water bottle</strong> with a clip — clip it to the deck rigging; loose bottles roll into the water',
        '<strong>Phone in a waterproof pouch</strong> — saltwater destroys electronics, and dry bags are not as reliable as people assume',
        '<strong>Light jacket in shoulder season</strong> — even at 70°F on land, water-level paddling adds a 5–10°F chill',
        '<strong>Bug spray for dawn/dusk paddles</strong> — May through September; the no-see-ums are real in marsh country',
      ],
    },
    {
      kind: 'h2',
      text: 'Best time of year — and time of day',
    },
    {
      kind: 'table',
      caption: 'Kayaking seasons on Hilton Head',
      headers: ['Season', 'Months', 'Conditions', 'What is happening', 'Verdict'],
      rows: [
        ['Spring', 'March–May', 'Cool mornings, warming water', 'Wildlife active, calves born', 'Best overall paddling window'],
        ['Summer', 'June–August', 'Hot, afternoon storms, warm water', 'Bioluminescence, manatees, dolphin calves', 'Paddle dawn or after 6pm only'],
        ['Fall', 'September–November', 'Mild, low humidity, dry', 'Bait runs, dolphins feeding', 'Strongest day-paddle conditions'],
        ['Winter', 'December–February', 'Cool, calm, low traffic', 'Quiet, no crowds', 'Underrated; dress for cold water'],
      ],
    },
    {
      kind: 'callout',
      label: 'Tide and time-of-day rule',
      html: '<strong>Paddle the rising tide</strong> when possible. Easier paddling, more wildlife, and you finish on the high — which makes the take-out simple. Avoid afternoon paddles in summer (June–August) — the thunderstorm risk is real, and Calibogue Sound builds chop quickly. Sunrise paddles are the most underrated experience on the island.',
    },
    {
      kind: 'faq',
      label: 'Hilton Head kayaking FAQ',
      items: [
        {
          q: 'Do I need experience to kayak on Hilton Head?',
          a: "For Sea Pines lagoons or a guided tour, no — the lagoon water is calm, and guided tours are sized for beginners. For Broad Creek on your own, you should be comfortable handling tide and minor current. For Calibogue Sound, you should be a confident open-water paddler. The honest move for first-timers: take a guided tour the first paddle, then rent on subsequent trips.",
        },
        {
          q: 'What is the best kayak tour for kids?',
          a: "For kids 6–10, the Sea Pines lagoon paddle in a tandem with a parent is ideal — calm water, alligator viewing, and short distances. For kids 10+, the dolphin tour out of Broad Creek is a more memorable experience. Most operators have a minimum age of 7 for guided tours, with younger kids only allowed in tandem with a parent.",
        },
        {
          q: 'When is bioluminescence the strongest on Hilton Head?',
          a: "Late July through August, on dark moonless nights, after consecutive warm days. The water needs to hit roughly 80°F to produce the strongest blooms. Operators only run the tour seasonally — typically late May through September — and check conditions night-of. If a tour is canceled for poor bioluminescence, most operators offer a free reschedule.",
        },
        {
          q: 'Can I see dolphins from a kayak?',
          a: "Yes — and it's one of the best wildlife encounters available on the island. Broad Creek dolphin pods routinely surface within 20–30 feet of kayaks; they're habituated to small craft and ignore them. The kayak experience is quieter than a tour boat — you hear the exhales clearly. Do not chase or follow dolphins; let them set the encounter.",
        },
        {
          q: 'Are kayaks allowed on the beaches?',
          a: "Surf-launching from Hilton Head's main beaches (Coligny, Folly Field, Burkes) is legal but discouraged outside of dawn and dusk — beach traffic, swimmers, and shorebreak make it impractical. Most paddlers launch from inland marinas or lagoons. Sit-on-tops and surfskis can be carried over from a beach access; always check posted signs at each beach for current rules.",
        },
        {
          q: 'Is winter kayaking on Hilton Head worth it?',
          a: "Surprisingly, yes — for the right paddler. Water is cold (50–60°F), but air temperatures often hit 65°F on sunny December days. Crowds are zero, marsh visibility is at its best (no leaf canopy), and bird activity peaks. Dress for immersion: a wetsuit or layered fleece under a paddle jacket. The <a href=\"/blog/hilton-head-winter-guide\">Hilton Head winter guide</a> covers cool-season activities in more detail.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Where this fits in a trip',
    },
    {
      kind: 'p',
      html: "Kayaking is not a fill-time activity on Hilton Head — it's a hero activity, and most groups want to slot exactly one paddle into a 4–7 day trip. The pattern that works: <strong>kayak in the morning of day 2 or 3</strong>, after a beach day on day 1, before the bigger commitments (golf, dolphin tour, dinner reservations) later in the week. If you're staying near <a href=\"/hilton-head/shelter-cove\">Shelter Cove</a> or <a href=\"/hilton-head/sea-pines\">Sea Pines</a>, the launches are within 10 minutes of your villa.",
    },
    {
      kind: 'p',
      html: "If you want help picking the route, the operator, and the time of day to match conditions during your dates — that's exactly what the <a href=\"/itinerary\">itinerary service</a> handles. Tell us who's paddling, what level of adventure they're up for, and we map it to the right launch and the right captain.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 25) Best pizza on Hilton Head & Bluffton (tier list)
// ---------------------------------------------------------------------------

const postBestPizza: Post = {
  slug: 'best-pizza-hilton-head-2026',
  title:
    'The Best Pizza on Hilton Head Island & Bluffton: Ranked S to Skip',
  excerpt:
    "Wood-fired Neapolitan, NY-style slices, late-night takeout, and the only Detroit-square pop-up on the island. 13 spots ranked by a local.",
  description:
    "The 13 best pizza spots on Hilton Head Island and in Bluffton, ranked S to Skip. Wood-fired Neapolitan, NY-style, late-night, Detroit-square, and the takeout standards.",
  category: 'Dining',
  readTime: '6 min',
  publishedAt: '2026-04-26',
  author: 'Hilton Ahead Editors',
  keywords: [
    'best pizza hilton head',
    'pizza hilton head island',
    'hilton head pizza',
    'bluffton pizza',
    'wood fired pizza hilton head',
    'ny style pizza hilton head',
    'pizza delivery hilton head',
    'late night pizza hilton head',
  ],
  featuredOrder: 25,
  body: [
    {
      kind: 'p',
      html: "Pizza on Hilton Head used to mean a flabby NY slice from a strip mall. The last five years changed that. We got a true 800°F wood-fired Neapolitan, a Calabrian-Italian thin crust, a Detroit-square pop-up, and a 2024 chef-driven coastal-Italian room across the bridge in Bluffton. The strip-mall slice is still around — but it's no longer the only option.",
    },
    {
      kind: 'p',
      html: "This is the working tier list. 13 spots from Hilton Head Island and the immediate Bluffton/Lowcountry area, ranked from <strong>S</strong> (the absolute best) to <strong>Skip</strong> (popular but overrated). Built from local-blog reviews, Tripadvisor signal, the <em>We Love Hilton Head Island</em> Facebook group, and what we actually order on a Friday night.",
    },
    { kind: 'h2', text: 'How we ranked' },
    {
      kind: 'p',
      html: "Three filters, in order: <strong>1)</strong> the dough — is it made fresh, does it taste like more than salt and yeast? <strong>2)</strong> the bake — properly leoparded char on a Neapolitan, crispy bottom on a NY pie, no soggy crusts. <strong>3)</strong> consistency — does it deliver the same pie on a Tuesday in February as a Saturday in July? A spot that nails one and fails another doesn't make S-tier.",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'The absolute best on the island',
      accent: 'gold',
      items: [
        {
          name: 'Local Pie Wood Fired Pizza',
          meta: 'South End · Wood-fired Neapolitan',
          blurb:
            "The first and only true 800°F wood-fired Neapolitan operation on the island. Regionally sourced mozzarella, San Marzano sauce, and the kind of leoparded char you'd expect from a Naples-trained kitchen. Sister location at 15 State of Mind St in Bluffton.",
        },
        {
          name: 'Dough Boys Pizza',
          meta: 'South End · NY-style hand-tossed',
          blurb:
            "Tripadvisor's #1 pizza on Hilton Head since 2013. Organic spring-wheat dough made fresh daily, San Marzano sauce, and a decade-plus of consistency. Island-wide delivery. The default order is the classic cheese.",
        },
        {
          name: 'Joelle',
          meta: 'Old Town Bluffton · Coastal Italian + wood-fired',
          blurb:
            "A 2024 opening from a chef couple in Old Town Bluffton. <em>The Local Palate</em> and <em>Post and Courier</em> both raved in their first-look reviews. Wood-fired pies anchor a coastal-Italian menu with house-made pasta sides — best treated as a full date-night dinner.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'Consistently great',
      accent: 'primary',
      items: [
        {
          name: "Giuseppi's Pizza & Pasta",
          meta: 'Shelter Cove · NY-style + pub',
          blurb:
            "Open since 1984 and the original SERG Restaurant Group concept. NY-style pies plus a full pasta menu. Big-group friendly and the family-room standard for Mid-Island. Locals reflexively recommend it.",
        },
        {
          name: 'Pomodori',
          meta: 'South End + Old Town Bluffton · Calabrian thin crust',
          blurb:
            "Chef Amanda trained in Calabria and brought regional thin-crust pies to two locations. Phone-only orders, no online platform — call early on Friday because the Calabrian chili honey pie sells out. Closed Sundays.",
        },
        {
          name: 'Firemost Pizza',
          meta: 'Broad Creek Marina · Tavern thin-and-crispy',
          blurb:
            "Founded July 2025 by HHI locals and already pulling regulars away from the chains. Square-cut tavern pies, marina patio seating, and a sunset view that makes it the right Friday call.",
        },
        {
          name: 'School Pizza',
          meta: 'Bluffton (pop-up) · Detroit-style square',
          blurb:
            "No storefront — the only Detroit-style on the island. Bakes every other Sunday at Lot 9 Brewing, Side Hustle, or Locals Only Taproom. Crispy edges, deep cheese, brewery hang. Pre-orders via Instagram fill fast.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: 'Solid backup',
      accent: 'zinc',
      items: [
        {
          name: 'New York City Pizza',
          meta: 'Heritage Plaza, Pope Avenue · NY by-the-slice',
          blurb:
            "Counter-style cheese-slice-and-go on Pope Avenue. Open until 10pm Friday and Saturday — closest thing to a true late-night slice on the island. Delivery via Toast.",
        },
        {
          name: 'Mellow Mushroom',
          meta: 'Office Park Rd · Pub chain',
          blurb:
            "Yes, a chain. But consistent execution and the latest open hours on Hilton Head proper (11pm daily). Specialty pies plus a full beer list — the right call for a sports-bar pizza setting.",
        },
        {
          name: "TJ's Take & Bake Pizza Co.",
          meta: 'North End · Take-and-bake',
          blurb:
            "Build your own raw pie, take it back to the villa, finish it in the rental kitchen. The right call for beach-house dinners with kids and large families. Closed Sundays.",
        },
        {
          name: "Mangiamo's Hilton Head Pizza Co.",
          meta: 'Main St + Bluffton · NY-style delivery',
          blurb:
            "Two locations and reliable island-wide delivery. The cheese-slice-and-wings combo is the workhorse. Not a destination, but a dependable backup when the S-tier spots are slammed.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Skip',
      subtitle: 'Popular, but you can do better',
      accent: 'rose',
      items: [
        {
          name: 'Bella Italia',
          meta: 'Port Royal Plaza · Italian-American',
          blurb:
            "Tripadvisor #4 mostly on tourist volume. Locals on the <em>We Love HHI</em> Facebook group rate it middling. Specialty and gluten-free pies are competent but unremarkable. Drive five more minutes to Dough Boys or Local Pie.",
        },
        {
          name: "Fat Baby's Pizza & Subs",
          meta: 'South End · Thin-crust counter',
          blurb:
            "Tripadvisor ranks it #2 on the island, but reviews skew \"fine, fast, forgettable.\" If you're already there and starving, fine. If you can drive five more minutes — do that instead.",
        },
      ],
    },
    { kind: 'h2', text: 'Notes for visitors' },
    {
      kind: 'h3',
      text: 'Late-night pizza on Hilton Head',
    },
    {
      kind: 'p',
      html: "Mellow Mushroom on Office Park Rd is open until 11pm seven days, the latest pizza on HHI proper. New York City Pizza on Pope Avenue runs until 10pm Friday and Saturday for slice-by-the-counter orders. Everything else closes by 9pm in summer and 8pm off-season.",
    },
    {
      kind: 'h3',
      text: 'Pizza delivery to vacation rentals',
    },
    {
      kind: 'p',
      html: "Dough Boys, Mangiamo's, and Mellow Mushroom all deliver island-wide. TJ's Take & Bake delivers raw pies you finish in your villa oven — useful when you want pizza without leaving the rental and the oven is already preheating.",
    },
    {
      kind: 'h3',
      text: 'Best pizza for kids',
    },
    {
      kind: 'p',
      html: "Giuseppi's at Shelter Cove is the family-room standard — NY-style pies, pasta on the menu, and big-group seating. Dough Boys works for takeout family dinners. Skip the wood-fired Neapolitan for picky eaters; the slight char and fresh basil are not what 7-year-olds want.",
    },
    {
      kind: 'callout',
      label: 'Pro tip',
      html: "If you're staying in Sea Pines or Palmetto Dunes for a week and want to do one date-night dinner with great pizza, drive across the bridge to Joelle in Old Town Bluffton. It's 25 minutes from Sea Pines, and the menu is more than just pizza — house-made pasta sides, a serious wine list, and it's the most-talked-about new room in the Lowcountry.",
    },
    {
      kind: 'faq',
      label: 'Pizza FAQ',
      items: [
        {
          q: 'What is the #1 pizza on Hilton Head Island?',
          a: "By Tripadvisor signal, Dough Boys Pizza on the South End. By local-blog and chef-credentials signal, Local Pie Wood Fired Pizza is the most-acclaimed. Both are S-tier on our list.",
        },
        {
          q: 'Where do locals get pizza on Hilton Head?',
          a: "Locals lean Local Pie for date-night Neapolitan, Dough Boys for the standard takeout cheese pie, Pomodori when they want something different, and Giuseppi's when they have kids in the car. The <em>We Love Hilton Head Island</em> Facebook group has a long-running pizza thread that surfaces the same names.",
        },
        {
          q: 'Is there pizza in Bluffton?',
          a: "Yes — and it's worth crossing the bridge. Joelle (S-tier), Pomodori's Bluffton location (A-tier), and School Pizza's biweekly pop-up all give Bluffton three serious options. Joelle alone is worth the 25-minute drive from Sea Pines.",
        },
        {
          q: 'Where can I get gluten-free pizza on Hilton Head?',
          a: "Bella Italia, Mellow Mushroom, and Mangiamo's all offer gluten-free crusts. Local Pie does a wood-fired GF option on request. Call ahead in summer — the GF dough sometimes runs out by Friday night.",
        },
        {
          q: 'Are there any 24-hour or very-late-night pizza places?',
          a: "No. Mellow Mushroom (11pm) and NYC Pizza on Pope (10pm Fri/Sat) are the latest. After that, Domino's delivery from Bluffton is technically the only option, and it's not worth ordering.",
        },
        {
          q: 'Can I get pizza delivered to a Sea Pines villa?',
          a: "Yes. Dough Boys, Mellow Mushroom, and Mangiamo's all deliver into Sea Pines. Add a 15-20 minute pad to whatever ETA they quote — the gate adds time. NYC Pizza delivers via Toast on Pope Avenue.",
        },
      ],
    },
    { kind: 'h2', text: 'Want help with the rest of the trip?' },
    {
      kind: 'p',
      html: "Pizza is one decision out of about forty when you plan a Hilton Head week. Restaurants for the bigger dinners, tee times, beach gear, neighborhood selection — the <a href=\"/itinerary\">itinerary service</a> handles all of it as one plan. Tell us your dates, group, and what kind of trip you want, and we send back a full week with reservations made.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 27) PLANNING. What a Hilton Head Trip Actually Costs in 2026
// ---------------------------------------------------------------------------

const postTripCost2026: Post = {
  slug: 'hilton-head-trip-cost-2026-real-numbers',
  title: 'What a Hilton Head Trip Actually Costs in 2026 (Real Numbers)',
  excerpt:
    'Four real Hilton Head 2026 trip budgets: couples weekend, family week, golf trip, and snowbird month. Actual villa, golf, food, and bridge numbers.',
  description:
    'Real 2026 Hilton Head trip budgets from a local planner. Villa rates by neighborhood, what golf costs, the bridge toll, and the $400 mistake first-timers make.',
  category: 'Planning',
  readTime: '11 min',
  publishedAt: '2026-06-01',
  author: 'Will Griffith',
  featuredOrder: 100,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'cost of hilton head trip',
    'how much does a hilton head vacation cost',
    'hilton head vacation budget',
    'hilton head villa rental price',
    'hilton head trip cost 2026',
    'hilton head golf trip cost',
  ],
  body: [
    {
      kind: 'p',
      html: "I get this question every week, usually from someone who has been reading conflicting numbers on travel blogs that haven't been updated since 2022. Here is the honest version, written in May 2026 with rates we have actually quoted clients this season.",
    },
    {
      kind: 'p',
      html: "The shortcut: a real Hilton Head trip in 2026 costs anywhere from $2,800 to $9,500 depending on party size, neighborhood, and month. The bigger the group and the further from June through August, the better the math gets. If you want a per-night number you can use for back-of-envelope planning, the rate-card answer is <strong>roughly $400 to $700 per night for a 3-bedroom villa in a good location</strong>, plus golf, food, and the things people forget to budget for.",
    },
    {
      kind: 'p',
      html: "Below are four real trips at four real party sizes, with line-item numbers. After that, the four costs that surprise first-time visitors. Then the calculator we built so you can run your own scenario in 90 seconds.",
    },
    {
      kind: 'h2',
      text: 'Why averages lie',
    },
    {
      kind: 'p',
      html: "When TripAdvisor says \"average Hilton Head trip costs $1,200,\" they are averaging a $300 weekend at a Coligny motel with a $9,000 family week in Sea Pines. That number doesn't help anyone. The real costs cluster around the trip type, not the destination, so I am going to give you four typical clusters instead.",
    },
    {
      kind: 'h2',
      text: 'The four sample trips',
    },
    {
      kind: 'section',
      eyebrow: '01',
      title: 'Couples weekend at Sea Pines — $2,840 total',
      summary: '3 nights, mid-September, 2 adults, no golf.',
      defaultOpen: true,
      blocks: [
        {
          kind: 'ul',
          items: [
            'Villa (3 nights, 2BR cottage on South Beach Lane): $1,560',
            'Bridge toll into Sea Pines (1 week pass): $9',
            'Groceries from Fresh Market for in-villa breakfast and snacks: $140',
            'Dinner 1 — The Quarterdeck at Harbour Town, with wine: $185',
            'Dinner 2 — Lucky Rooster, mid-island: $210',
            'Dinner 3 — Charlie\'s L\'Etoile Verte: $245',
            'Beach gear delivery (chairs + umbrella, Sandbox setup): $95',
            'Bike rentals (2 bikes, 3 days, Hilton Head Bicycle Co.): $75',
            'Gas + parking: $80',
            'Two coffee + breakfast pastry stops at ELA\'s on the Water: $48',
            'Buffer for two cocktails at Salty Dog: $90',
            'Tax + service buffer (~10% of villa): $102',
          ],
        },
        {
          kind: 'p',
          html: "This is the trip I plan most for first-time couples. September is the smartest month on Hilton Head — pre-Labor Day rates have dropped, water is still 82°F, and the dinner reservations open up. A 2BR is overkill for two but the rate gap to a 1BR isn't worth it for three nights. See more on couples logistics in the <a href=\"/blog/hilton-head-honeymoon-7-day-itinerary\">7-day honeymoon itinerary</a> or the standalone <a href=\"/hilton-head-honeymoon\">honeymoon page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '02',
      title: 'Family week at Palmetto Dunes — $6,420 total',
      summary: '7 nights, second week of June, 4 adults + 3 kids.',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Villa (7 nights, 4BR oceanfront row at Inverness Village): $4,200',
            'Cleaning + booking fees: $385',
            'Groceries (Publix delivery, Sunday + Wednesday): $510',
            'Eat-out dinners (4 nights — Lucky Rooster, ELA\'s, Skull Creek Boathouse, Hudson\'s): $640',
            'Beach gear week-long rental (2 umbrellas + 6 chairs + boogie boards): $215',
            'Mini-golf at Pirate\'s Island + ice cream: $75',
            'Tube and kayak rentals on the lagoon: $135',
            'One dolphin tour for the kids (Outside Hilton Head): $180',
            'Gas + the bridge: $80',
          ],
        },
        {
          kind: 'p',
          html: "Notice the villa is two-thirds of the budget. That ratio is correct for a family week — once you have a real kitchen, breakfast and lunch costs collapse. Palmetto Dunes wins this trip because the lagoon system means the kids have free entertainment for 4+ hours a day inside the neighborhood. We dig into the math on the <a href=\"/hilton-head-family-trip-planner\">family trip planner</a> page and rank villa buildings on the <a href=\"/blog/palmetto-dunes-guide\">Palmetto Dunes guide</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '03',
      title: '4-guy golf trip in October — $4,950 total ($1,238 per person)',
      summary: '4 nights, late October, 4 adults, 4 rounds of golf.',
      blocks: [
        {
          kind: 'ul',
          items: [
            'The Inn & Club at Harbour Town (4 nights, two doubles): $2,160',
            'Harbour Town Golf Links (RBC Heritage course) — 1 round: $475 pp = $1,900 group',
            'Atlantic Dunes by Davis Love III — 1 round: $215 pp',
            'Robert Trent Jones Oceanfront at Palmetto Dunes — 1 round: $185 pp',
            'May River at Palmetto Bluff — 1 round: $225 pp',
            'Caddie tips (Harbour Town caddie strongly recommended): $80 pp',
            'Dinners (Harbour Town Bakery, Quarterdeck, Skull Creek Boathouse, in-villa steaks): $290 pp',
            'Cigars + bourbon at the Inn bar: optional but planned for',
          ],
        },
        {
          kind: 'p',
          html: "The Harbour Town round is the price-anchor of any HHI golf trip; the other three are negotiated through our <a href=\"/hilton-head-golf-packages\">golf package</a> rates. Late October is the perfect window — locked-in inventory, 78°F days, no afternoon thunderstorms. If you want the full breakdown of which course tier matches which group, read <a href=\"/blog/hilton-head-golf-courses-ranked\">our ranked-by-tier course list</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: '04',
      title: '28-day snowbird at Forest Beach — $9,200 total',
      summary: 'Full month of February, 2 adults, walk-everywhere mode.',
      blocks: [
        {
          kind: 'ul',
          items: [
            '28-night villa (2BR, two blocks off Coligny): $6,400',
            'Groceries for the month (Publix + Bluffton Farmers Market): $980',
            'Eat-out dinners (8 dinners across the month): $640',
            'Gas (rental car drives are short — Coligny is walkable): $90',
            'Bridge toll + occasional Bluffton drives: $30',
            'Two greens fees at Palmetto Hall (locals\' price, $85 each): $170',
            'Pickleball court time and a yoga drop-in: $140',
            'Pharmacy run + dry cleaning + miscellaneous: $250',
            'Internet upgrade on the villa (faster speed bundle): $75',
            'Coffee + breakfast out twice a week: $425',
          ],
        },
        {
          kind: 'p',
          html: "A Forest Beach snowbird month is the best per-night value on the island in 2026 — works out to about $329 per day, with a real kitchen and a walkable neighborhood. The <a href=\"/hilton-head-winter-rental\">winter rental page</a> walks through the logistics; we lock most of these in August for the following January through March.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'What lodging actually costs in 2026',
    },
    {
      kind: 'p',
      html: "Villa rates went up roughly 6% in 2026 over 2025, slightly above general inflation. The bigger story is supply: roughly 80 short-term-rental permits expired and were not renewed under the town's new ordinance, which has tightened summer inventory more than the rate change has. Here are the realistic per-night ranges we are quoting in May 2026, by neighborhood:",
    },
    {
      kind: 'ul',
      items: [
        'Sea Pines, 3BR oceanfront row (peak): $750 to $1,100/night',
        'Sea Pines, 2BR off-beach (peak): $420 to $580/night',
        'Palmetto Dunes, 3BR oceanfront (peak): $680 to $950/night',
        'Palmetto Dunes, 4BR lagoon villa (peak): $520 to $720/night',
        'Forest Beach, 2BR walk-to-Coligny (peak): $340 to $480/night',
        'Shelter Cove, 2BR harbor view (peak): $300 to $440/night',
        'Off-peak (Jan–Mar, Nov): subtract 35 to 50% from any range above',
      ],
    },
    {
      kind: 'p',
      html: "If you are flexible with neighborhood, the Sea Pines vs Palmetto Dunes choice can swing your week by $1,500 to $2,000 in either direction depending on what you optimize for. We wrote a side-by-side breakdown on <a href=\"/blog/sea-pines-vs-palmetto-dunes\">Sea Pines vs Palmetto Dunes</a>, and the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas page</a> lists the specific buildings we book first.",
    },
    {
      kind: 'h2',
      text: 'Golf, dining, gas, and the bridge',
    },
    {
      kind: 'p',
      html: "Golf is the single biggest variable after lodging. Harbour Town is $475 in season, $325 in shoulder season, and worth booking twice if you are here for a week. Everything else on the island runs $145 to $275 in season. A four-round golf trip in October is roughly $1,100 to $1,300 per person at the course; in May, the same trip is $1,700 to $2,100.",
    },
    {
      kind: 'p',
      html: "Dining cost out for a couple at the better restaurants — Lucky Rooster, Charlie\'s L\'Etoile Verte, ELA\'s on the Water, The Quarterdeck — runs $180 to $240 with wine. The mid-tier and seafood-shack tier (Skull Creek Boathouse, Hudson\'s, A Lowcountry Backyard) runs $90 to $140 for two. A family of four eating out runs $140 to $220 a dinner depending on tier. Plan three to four eat-out dinners per week and cook the rest. The <a href=\"/blog/hilton-head-restaurants-ranked-2026\">ranked restaurants list</a> breaks down which rooms are worth the dollar.",
    },
    {
      kind: 'p',
      html: "Gas is the same as anywhere else in coastal South Carolina. The bridge to Sea Pines is the only toll on the island and costs $9 for a 7-day pass — confused for $9 per day in most online write-ups. Parking at the beach access points (Coligny, Driessen, Folly Field) is $10 to $20 a day in season, free in winter.",
    },
    {
      kind: 'h2',
      text: 'The $400 mistake most first-timers make',
    },
    {
      kind: 'p',
      html: "Renting a car at Savannah Airport and then a separate car at Hilton Head Airport because somebody didn't realize they both serve the island. SAV is 45 minutes from the bridge and 70% cheaper for the rental, and HHH is on the island but rental inventory is thin. If you fly into HHH and rent there, expect to pay $90 to $130 a day in season for an SUV. The same SUV at SAV is $45 to $70. Multiplied across a week, that is the $400 mistake.",
    },
    {
      kind: 'p',
      html: "The second-biggest mistake is booking a non-oceanfront condo at Folly Field thinking \"it's still Hilton Head.\" Geographically it is. Functionally, you'll drive 20 minutes to every dinner reservation and lose three hours of your trip to traffic on Pope Avenue. The math doesn't work — the apparent $80/night savings disappears in gas and aggravation.",
    },
    {
      kind: 'h2',
      text: 'Use our calculator',
    },
    {
      kind: 'p',
      html: "We built a <a href=\"/cost-of-hilton-head-trip\">live cost calculator</a> that runs your specific party size, neighborhood, and month against our current quoted rates. It takes 90 seconds and gives a low-mid-high range with a confidence note. The model gets updated quarterly with what we actually quoted clients the prior quarter, so it stays calibrated to real 2026 numbers rather than blog-post averages from 2022.",
    },
    {
      kind: 'faq',
      label: 'Hilton Head trip cost FAQ',
      items: [
        {
          q: 'How much does a 7-day Hilton Head trip cost in 2026 for a family of four?',
          a: "For peak season (June through early August), $5,800 to $7,800 all-in for a family of four staying in a 3BR Palmetto Dunes or Sea Pines villa. Shoulder season (April–May, September–October) drops that to $4,200 to $5,800. Winter is $3,200 to $4,500.",
        },
        {
          q: 'Is Hilton Head cheaper than Myrtle Beach?',
          a: "No. Hilton Head villas run roughly 35–50% higher than comparable Myrtle Beach inventory in peak season. The tradeoff is what you get — gated neighborhoods, top-100 golf, and restaurants with serious chefs. If pure cost is the priority, Myrtle Beach wins. If the trip needs to be good, Hilton Head wins. We compared them directly in our <a href=\"/blog/hilton-head-vs-myrtle-beach\">Hilton Head vs Myrtle Beach</a> post.",
        },
        {
          q: 'How much should I budget per day on Hilton Head?',
          a: "Outside of lodging, plan $180 to $260 per couple per day for food, beach setups, and one paid activity. Families with kids run $260 to $360 per day all-in. Golf days add $200 to $475 per golfer on top.",
        },
        {
          q: 'What is the cheapest time to visit Hilton Head?',
          a: "First half of December and the second half of January are the lowest rates of the year — villa rates drop 50–60% from summer. Weather is roughly 60°F daytime, water is cold, but the island is calm, restaurants are open, and the value math is unbeatable.",
        },
        {
          q: 'Is the bridge to Hilton Head free?',
          a: "Yes — the bridge from US-278 onto the island is free. The only toll is the Sea Pines security gate, which is $9 for a 7-day pass per car. Non-Sea Pines parts of the island have no tolls or gates.",
        },
        {
          q: 'How much does a Hilton Head villa cost per night?',
          a: "Realistic 2026 ranges: $300 to $480 for a 2BR off-beach, $420 to $750 for a 3BR mid-tier oceanfront, and $750 to $1,200 for a premium oceanfront row in Sea Pines or Palmetto Dunes. Off-peak (Nov–Mar) is 35 to 50% lower. Heritage Week (April) is the only window where rates spike above summer peak.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Want us to run your number?',
    },
    {
      kind: 'p',
      html: "Tell us your party size, dates, and what kind of trip you want. We send back a real budget — line-itemed villa, golf, dinners, beach gear, the bridge — usually within a day. No fee until you book through us. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 28) STAYS. Last-Call July Villa Availability
// ---------------------------------------------------------------------------

const postLastCallJuly: Post = {
  slug: 'last-call-july-hilton-head-villa-availability',
  title: "Last-Call July 2026: What's Left for Hilton Head Villa Availability",
  excerpt:
    "Updated weekly: the Hilton Head villas still open for July 2026, by neighborhood. Real inventory honesty, real prices, and the weeks to pivot to.",
  description:
    "It's June 2026. Here's what's still bookable on Hilton Head for July — by neighborhood, with prices. Plus the smart pivot to August if you're shut out.",
  category: 'Stays',
  readTime: '9 min',
  publishedAt: '2026-06-02',
  author: 'Will Griffith',
  featuredOrder: 101,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'july availability hilton head villas',
    'last minute hilton head rentals',
    'available villas july 2026 hilton head',
    'palmetto dunes july availability',
    'hilton head july 4 villa',
    'hilton head villa rental july',
  ],
  body: [
    {
      kind: 'p',
      html: "It is the third week of May 2026 and our inbox is full of \"do you have anything left for July\" emails. Short answer: <strong>yes, but only for two specific weeks, and only in three neighborhoods</strong>. Long answer below, with what we are actually quoting today.",
    },
    {
      kind: 'p',
      html: "This is the post I would have wanted three weeks ago when the panic emails started coming in. I will update it weekly through June 30 as inventory shifts. The honest framing: most of July is gone, the Heritage hangover for premium oceanfront row is severe, and if you are a four-person family hoping to stay under $5,000 you should be looking at the second half of the month or pivoting to early August.",
    },
    {
      kind: 'callout',
      label: 'Last updated',
      html: "May 20, 2026. The numbers below are real quotes we have given clients this week. If you want a live check on a specific date range, the fastest path is the <a href=\"/itinerary\">itinerary form</a> — we run inventory across roughly 200 buildings and reply same-day in summer.",
    },
    {
      kind: 'h2',
      text: 'The state of July 2026 inventory',
    },
    {
      kind: 'p',
      html: "July is always the tightest month on Hilton Head — peak family week, school out, water 84°F. In 2026 the squeeze is harder than 2025 because the town's short-term-rental ordinance reduced the permitted-villa pool by roughly 80 units across the island, and a handful of large management companies stopped renewing buildings they couldn't keep at standards. So even though demand is similar to last summer, the inventory denominator is smaller.",
    },
    {
      kind: 'p',
      html: "The two weeks that are still genuinely bookable: <strong>July 11–18</strong> (post-July 4 lull) and <strong>July 25 – August 1</strong> (pre-final-week sag). The two weeks that are functionally gone: July 4 week and July 18–25. We will still try if you ask, but expect to pay 25% over summer peak rates and accept whatever building has the cancellation.",
    },
    {
      kind: 'h2',
      text: "Sea Pines — what's left",
    },
    {
      kind: 'p',
      html: "Tight, but not impossible. South Beach Lane is gone for all of July except a single 4BR that came back as a cancellation late last week (call us). The oceanfront-row buildings — Beachside Tennis, Sea Crest, Turtle Lane Club — show 3 to 6 units across the entire month, all premium pricing.",
    },
    {
      kind: 'ul',
      items: [
        '<strong>South Beach Lane 3BR</strong> — 1 unit, July 11–18, $1,150/night',
        '<strong>Sea Crest oceanfront row 3BR</strong> — 2 units, July 25 – Aug 1, $980/night',
        '<strong>Beachside Tennis 4BR villa</strong> — 1 unit, July 11–18, $1,280/night',
        '<strong>Off-beach Harbour Town walkable 2BR</strong> — 3 units across the month, $620–$720/night',
        '<strong>Forest pocket interior 3BR (Greenwood, Otter Road)</strong> — 6 units across July, $580–$720/night',
      ],
    },
    {
      kind: 'p',
      html: "If your trip absolutely has to be Sea Pines, the move right now is to book the interior pocket properties and pay the gate-and-bike difference rather than insisting on oceanfront row. The <a href=\"/blog/sea-pines-guide\">Sea Pines guide</a> covers which interior buildings still feel like a real Sea Pines trip; the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas page</a> lists what we book first when there is inventory.",
    },
    {
      kind: 'h2',
      text: "Palmetto Dunes — what's left",
    },
    {
      kind: 'p',
      html: "Better than Sea Pines for July inventory, mostly because there are simply more units. Inverness Village and Mariners Watch each show 8 to 12 available weeks across the month. Oceanfront row is the constraint — Captain's Walk and Inverness Oceanfront are nearly gone.",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Inverness Village 4BR lagoon</strong> — 6 units, scattered across July, $640–$780/night',
        '<strong>Mariners Watch 3BR lagoon</strong> — 9 units across July, $520–$660/night',
        '<strong>Captain\'s Walk 3BR oceanfront</strong> — 2 units, both July 25 – Aug 1, $920/night',
        '<strong>Inverness Oceanfront 4BR row</strong> — 1 unit, July 11–18, $1,180/night',
        '<strong>Hampton Place / Shorewood courtyard 2BR</strong> — 7 units, $420–$540/night',
      ],
    },
    {
      kind: 'p',
      html: "Palmetto Dunes is the right play if you have kids and need lagoon-system access, the Robert Trent Jones course in your trip, and a kitchen. The full breakdown of which Palmetto Dunes buildings we book first is on the <a href=\"/blog/palmetto-dunes-guide\">Palmetto Dunes guide</a>, and the family-trip logistics live on the <a href=\"/hilton-head-family-trip-planner\">family planner page</a>.",
    },
    {
      kind: 'h2',
      text: 'Forest Beach + Coligny walkability',
    },
    {
      kind: 'p',
      html: "Forest Beach is your best shot for July inventory under $500/night. The two- to three-block walk to Coligny means you can ditch the rental car for the week, which is a big deal in July when the south-end traffic doubles. About 14 units across the month are still bookable, plus another 6 in walking distance of Coligny but outside the Forest Beach gates proper.",
    },
    {
      kind: 'ul',
      items: [
        '<strong>Forest Beach 2BR, two blocks from sand</strong> — 8 units, $380–$480/night',
        '<strong>Forest Beach 3BR with private deck</strong> — 4 units, $520–$640/night',
        '<strong>Coligny Beach Club condo (walk to sand)</strong> — 5 units, $310–$420/night',
        '<strong>Sailmaker oceanfront row 3BR (gated, but Forest Beach feel)</strong> — 2 units, $920/night',
      ],
    },
    {
      kind: 'p',
      html: "Forest Beach is the unsung hero of July inventory — under-the-radar with serious walkability. Full neighborhood notes live on the <a href=\"/blog/forest-beach-guide\">Forest Beach guide</a>.",
    },
    {
      kind: 'h2',
      text: 'When to give up and pivot to August',
    },
    {
      kind: 'p',
      html: "If you cannot get the dates or neighborhood you want, pivoting to August 8–15 is the smartest move on the board right now. The water is the same temperature, the air is the same temperature, the dinner reservations are easier, and rates drop 12 to 18% from peak July. Several buildings that are completely full in July show 3 to 6 open units that exact week.",
    },
    {
      kind: 'p',
      html: "We will not lie to you — the absolute best July weeks for kids out of school are gone. But the August pivot is mathematically better unless you have a hard school-calendar constraint.",
    },
    {
      kind: 'h2',
      text: 'How we book on your behalf',
    },
    {
      kind: 'p',
      html: "We pull inventory across roughly 200 buildings — the big rental companies, smaller boutique operators, and three private-owner programs that don't show up on the public OTAs. We send you a curated 5-property shortlist within a day, you pick, and we book direct. No upcharge.",
    },
    {
      kind: 'faq',
      label: 'July 2026 Hilton Head villa FAQ',
      items: [
        {
          q: 'Is there any chance for July 4 week 2026 availability?',
          a: "Realistically, no. July 4 is sold out across the island except for a handful of cancellation slots that we get notified about and pass to clients on a waiting list. If you want to try, get on the waiting list — but plan around the assumption you'll be redirected to July 11 or earlier in June.",
        },
        {
          q: 'How much does a 3BR Hilton Head villa cost in July 2026?',
          a: "Real range we are quoting: $580 to $1,150 per night for a 3BR. The bottom of the range is interior Sea Pines or mid-tier Palmetto Dunes; the top is oceanfront row in either neighborhood. Forest Beach 3BRs sit at $520 to $640 — best per-night value for walkability.",
        },
        {
          q: 'Should I book July 2026 or pivot to August?',
          a: "Pivot if you have any flexibility. Early-August inventory is materially better, prices are 12 to 18% lower, and the weather is identical. The only reason to insist on July is a hard school-calendar lock or a family reunion already booked around a specific week.",
        },
        {
          q: 'What about September? Is that a viable backup?',
          a: "Yes, and it's the smartest backup of all. Post-Labor Day rates drop 22 to 30%, the water is 82°F, hurricanes have not become a real concern yet (peak risk is Sept 10 to Oct 10), and dinner reservations open up dramatically. We send roughly 30% of our clients here on September weeks now.",
        },
        {
          q: 'Are there last-minute deals on Hilton Head in July?',
          a: "Almost never. Hilton Head doesn't do summer fire-sale pricing the way some destinations do — the supply is constrained and the demand stays through Labor Day. The deals come in November and the second half of January, not July.",
        },
        {
          q: 'Can I book a hotel instead if villa inventory is gone?',
          a: "Yes. The Omni Hilton Head, Sonesta Resort, and Marriott Grande Ocean all still have hotel-style availability for most of July. Rates run $380 to $620 per night for the comparable 2-queen room. Not always cheaper than a villa, but easier to book last-minute. See the <a href=\"/blog/2026-best-places-to-stay-hilton-head\">2026 stays ranking</a> for which hotels are actually in shape this year.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Let us run your dates',
    },
    {
      kind: 'p',
      html: "Send us your party size, exact date window, and budget. We run inventory against everything we have access to and come back same-day in summer with a real shortlist. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 29) NEIGHBORHOODS. Sea Pines vs Palmetto Dunes vs Shelter Cove
// ---------------------------------------------------------------------------

const postThreeWayCompare: Post = {
  slug: 'sea-pines-vs-palmetto-dunes-vs-shelter-cove',
  title: "Sea Pines vs Palmetto Dunes vs Shelter Cove",
  excerpt:
    "Three Hilton Head neighborhoods, three trip personalities. A locals' honest side-by-side on villas, beaches, dining, golf, and what you'd actually choose.",
  description:
    "Side-by-side: Sea Pines vs Palmetto Dunes vs Shelter Cove. Villa rates, beach access, dining proximity, and the trip personality each one fits.",
  category: 'Neighborhoods',
  readTime: '12 min',
  publishedAt: '2026-06-03',
  author: 'Will Griffith',
  featuredOrder: 102,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'shelter-cove'],
  keywords: [
    'sea pines vs palmetto dunes',
    'sea pines vs shelter cove',
    'palmetto dunes vs shelter cove',
    'best neighborhood hilton head',
    'where to stay hilton head',
    'hilton head neighborhoods compared',
  ],
  body: [
    {
      kind: 'p',
      html: "I get asked this comparison roughly four times a week. The honest answer is that the three neighborhoods solve different problems, and the right pick depends on whether you have kids, whether you golf, and how much driving you are willing to do for a dinner reservation. Below is the side-by-side I would write on a napkin if you called me.",
    },
    {
      kind: 'p',
      html: "We already have full neighborhood deep-dives — <a href=\"/blog/sea-pines-guide\">Sea Pines</a>, <a href=\"/blog/palmetto-dunes-guide\">Palmetto Dunes</a>, <a href=\"/blog/shelter-cove-guide\">Shelter Cove</a> — but this post is the comparison most people actually want before they read those.",
    },
    {
      kind: 'h2',
      text: 'The one-paragraph summary',
    },
    {
      kind: 'p',
      html: "<strong>Sea Pines</strong> is the prestige play — biggest, oldest, most polished, most expensive. Pick it if golf or a polished resort feel matters. <strong>Palmetto Dunes</strong> is the family workhorse — lagoon system, lower price, three good golf courses inside the gate. Pick it if you have kids or you want amenities-per-dollar. <strong>Shelter Cove</strong> is the dining-and-marina pick — no beach inside the neighborhood, but the best walking-distance restaurant cluster on the island. Pick it if your trip is dinners and sunsets more than beach days.",
    },
    {
      kind: 'h2',
      text: 'The grid',
    },
    {
      kind: 'table',
      caption: 'Quick comparison — Sea Pines vs Palmetto Dunes vs Shelter Cove',
      headers: ['Factor', 'Sea Pines', 'Palmetto Dunes', 'Shelter Cove'],
      rows: [
        ['Size', '5,200 acres', '2,000 acres', '~200 acres'],
        ['Beachfront', '5 miles direct', '3 miles direct', '0 miles (Broad Creek/marina)'],
        ['Gated', 'Yes ($9/week pass)', 'Yes (free)', 'No'],
        ['Golf courses inside', '3 (Harbour Town, Heron Point, Atlantic Dunes)', '3 (Robert Trent Jones, George Fazio, Arthur Hills)', '0'],
        ['Top restaurant tier', 'Quarterdeck, Harbour Town Bakery & Cafe', 'ELA\'s on the Water, Java Burrito', 'Hudson\'s, Skull Creek, Poseidon, Watusi'],
        ['Walkability', "Moderate (need a bike)", 'Moderate (golf cart)', 'High (true walking neighborhood)'],
        ['Family-fit score (10)', '8', '10', '6'],
        ['Couples-fit score (10)', '10', '7', '9'],
        ['Golf-trip-fit score (10)', '10', '9', '4'],
        ['3BR peak villa rate', '$580–$1,150', '$520–$950', '$300–$580'],
      ],
    },
    {
      kind: 'h2',
      text: 'Sea Pines: when it wins',
    },
    {
      kind: 'p',
      html: "Sea Pines wins for any trip where the resort itself is the experience. Harbour Town at sunset, biking the 12 miles of trails, lunch at the Quarterdeck, dinner at Charlie's L'Etoile Verte, the lighthouse. It is the only neighborhood on the island that feels like a complete world — you can functionally never leave the gates for a week and be perfectly entertained.",
    },
    {
      kind: 'p',
      html: "Best for: golf trips, honeymoons, anniversaries, big family reunions where the budget allows, and any trip where prestige factors in. Worst for: budget-driven family weeks, people who hate gated communities on principle, and anyone who plans to drive off the island most days (the $9 gate pass adds friction).",
    },
    {
      kind: 'p',
      html: "Full Sea Pines breakdown lives on the <a href=\"/blog/sea-pines-guide\">Sea Pines guide</a>; the dedicated landing is at <a href=\"/hilton-head/sea-pines\">our Sea Pines page</a>.",
    },
    {
      kind: 'h2',
      text: 'Palmetto Dunes: when it wins',
    },
    {
      kind: 'p',
      html: "Palmetto Dunes wins on amenities per dollar for anyone with kids. The 11-mile lagoon system means a kayak or tube rental keeps a 9-year-old entertained for four hours a day. The bike trails are excellent, the Robert Trent Jones Oceanfront golf course is one of the prettiest in the Lowcountry, and the dining inside Shelter Cove (right next door) is closer to the gate than Sea Pines's dining is to its own gate.",
    },
    {
      kind: 'p',
      html: "The tradeoff is that Palmetto Dunes feels slightly less polished than Sea Pines — fewer crushed-shell paths, more 1990s villa exteriors, less of the \"old money\" cohesion. None of which matters for a family week. Best for: families with kids 5-15, golfers on a budget, active-lifestyle trips. Worst for: couples-only weekends (it's overbuilt for two), and anyone who wants the polished-resort aesthetic of Sea Pines.",
    },
    {
      kind: 'p',
      html: "Full Palmetto Dunes context on the <a href=\"/blog/palmetto-dunes-guide\">guide</a> and <a href=\"/hilton-head/palmetto-dunes\">landing page</a>.",
    },
    {
      kind: 'h2',
      text: 'Shelter Cove: when it wins',
    },
    {
      kind: 'p',
      html: "Shelter Cove is the most misunderstood neighborhood on the island. It is not a beach neighborhood — it sits on Broad Creek and the marina, not the Atlantic. But what it gives up in beach access, it more than makes up in <em>walking-to-dinner</em> density: Hudson's, Skull Creek Boathouse, Poseidon, Watusi, and Tiki Hut at Coligny are all within a 3-mile circle. Add the marina, the Tuesday-night fireworks in summer, the Shelter Cove Park, and the sunset over Broad Creek — and Shelter Cove starts to feel like the Lowcountry version of a real walkable town.",
    },
    {
      kind: 'p',
      html: "Best for: couples who want dinners and sunsets and don't need to be 20 steps from the sand, foodie weekends, second-trip clients who already \"did\" Sea Pines and want something different. Worst for: golf trips (no courses inside), families whose kids absolutely need to wake up and see the ocean, and anyone who books on the assumption the marina equals the beach.",
    },
    {
      kind: 'p',
      html: "More context on the <a href=\"/blog/shelter-cove-guide\">Shelter Cove guide</a> and <a href=\"/hilton-head/shelter-cove\">landing</a>.",
    },
    {
      kind: 'section',
      eyebrow: 'Drill-down',
      title: 'Five common trip types — which neighborhood wins',
      summary: 'Family week, golf trip, anniversary, foodie weekend, snowbird month.',
      blocks: [
        {
          kind: 'h3',
          text: 'Family week with kids 7–13',
        },
        {
          kind: 'p',
          html: "Palmetto Dunes wins, by a wide margin. The lagoon-system rentals, the bike paths, the proximity to Pirate's Island mini-golf, the lower villa rates, and the Robert Trent Jones course if dad wants to slip in a round — all add up. Sea Pines is a close second if budget isn't a constraint. Shelter Cove only works for this trip if your kids are older and you've made peace with driving 5 minutes to the beach each day.",
        },
        {
          kind: 'h3',
          text: '4-guy golf trip',
        },
        {
          kind: 'p',
          html: "Sea Pines, almost always. Harbour Town tee-time priority for guests, the Inn & Club's golfer-first culture, and the proximity to the airport for the late-Sunday departure. Palmetto Dunes is the value backup if the Harbour Town round can be a day-trip and the rest of the rounds are RTJ-and-Hills. Shelter Cove is wrong for a golf trip — no courses inside, longer drives to every tee.",
        },
        {
          kind: 'h3',
          text: 'Anniversary or honeymoon',
        },
        {
          kind: 'p',
          html: "Tie between Sea Pines and Shelter Cove — pick by personality. Sea Pines if you want the polish, the bike rides, the Quarterdeck. Shelter Cove if you want to walk to dinner four nights in a row and watch sunsets over Broad Creek. We send both to the <a href=\"/hilton-head-honeymoon\">honeymoon page</a> with a different recommended split.",
        },
        {
          kind: 'h3',
          text: 'Foodie weekend',
        },
        {
          kind: 'p',
          html: "Shelter Cove, alone in first place. The 3-mile walking radius covers Hudson's, Skull Creek, Poseidon, Watusi, and a 6-minute drive picks up Lucky Rooster and ELA's. Nothing else on the island has that dining density inside walking distance.",
        },
        {
          kind: 'h3',
          text: 'Snowbird month',
        },
        {
          kind: 'p',
          html: "Forest Beach actually wins this one outside our three, but among the three, Palmetto Dunes for active snowbirds (lagoon, pickleball, golf at locals' rates) and Shelter Cove for walking-around snowbirds. Sea Pines is overpriced for a long stay. Full context on the <a href=\"/hilton-head-winter-rental\">winter rental page</a>.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "What I'd actually book if you put a gun to my head",
    },
    {
      kind: 'p',
      html: "Sea Pines for a high-stakes trip (anniversary, milestone birthday, golf-trip-of-a-lifetime). Palmetto Dunes for a family week. Shelter Cove for any second or third trip to the island when you already know the beach and you want to try a different mode. That is the calculus that ends up in 85% of my client recommendations.",
    },
    {
      kind: 'p',
      html: "If you want the oceanfront row specifically, look at the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas page</a> — that's the subset of inventory where Sea Pines and Palmetto Dunes both shine and where Shelter Cove is by definition not in play.",
    },
    {
      kind: 'faq',
      label: 'Sea Pines vs Palmetto Dunes vs Shelter Cove FAQ',
      items: [
        {
          q: 'Which is the most expensive neighborhood on Hilton Head?',
          a: "Sea Pines, by 18 to 28% on a like-for-like 3BR comparison. The premium reflects the brand, the gated experience, Harbour Town, and the polish. The next tier down is Palmetto Dunes; Shelter Cove villas are typically 25 to 35% cheaper than Sea Pines equivalents.",
        },
        {
          q: 'Does Shelter Cove have a beach?',
          a: "Not inside the neighborhood — Shelter Cove fronts Broad Creek and the marina, not the Atlantic. The closest beach access is Coligny (5-minute drive) or the Folly Field beach park (8 minutes). Some Shelter Cove villas come with a shuttle to a designated beach drop-off; ask before booking if beach access is a make-or-break.",
        },
        {
          q: 'Is Palmetto Dunes or Sea Pines better for golf?',
          a: "Sea Pines for a single best-round trip (Harbour Town is the marquee course on the island). Palmetto Dunes for variety on a budget (three solid courses inside the gate at lower rates than Harbour Town). The honest answer for most golf trips is play both — stay Sea Pines, day-trip Palmetto Dunes for one round.",
        },
        {
          q: 'Can I walk from Shelter Cove to dinner?',
          a: "Yes, more than any other neighborhood on the island. Hudson's, Skull Creek Boathouse, Poseidon, Watusi, and Tiki Hut are all within a 1- to 3-mile walking radius. Bring comfortable shoes and you can functionally ditch the rental car for the week.",
        },
        {
          q: 'Which neighborhood is best for first-time Hilton Head visitors?',
          a: "Sea Pines for couples and small groups. Palmetto Dunes for families. Avoid Shelter Cove for a first trip unless you have explicitly decided you do not want beach-first lodging — the surprise of \"oh, the beach is a 5-minute drive away\" lands badly on a first visit.",
        },
        {
          q: 'Are Sea Pines villa rates worth it over Palmetto Dunes?',
          a: "Depends on the trip. For golf or a milestone occasion, yes. For a family week with kids who will spend most of their waking hours in the lagoon, no — Palmetto Dunes gives you the same vacation for less money. We swing about 60/40 toward Palmetto Dunes when budget is the explicit constraint.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Tell us your trip',
    },
    {
      kind: 'p',
      html: "If you want the side-by-side run against your specific dates and party, send the brief over and we'll come back with a real recommendation. We don't push you toward the more expensive option — about 35% of our client recommendations are Palmetto Dunes or Forest Beach over Sea Pines, because that's the right call. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 30) GOLF. Hilton Head Golf Packages — Which Course Tier
// ---------------------------------------------------------------------------

const postGolfTiers: Post = {
  slug: 'hilton-head-golf-packages-course-tiers',
  title: "Hilton Head Golf Packages: Which Course Tier Is Right for Your Group",
  excerpt:
    "Real golf-package math by tier. Harbour Town at the top, the workhorse mid-tier rounds, and the smart fourth-round picks that punch above price.",
  description:
    "Hilton Head golf packages broken into four real tiers, with honest prices. Which combination fits a 4-day trip for buddies, members, or a milestone group.",
  category: 'Golf',
  readTime: '11 min',
  publishedAt: '2026-06-04',
  author: 'Will Griffith',
  featuredOrder: 103,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes'],
  keywords: [
    'hilton head golf packages',
    'harbour town golf links cost',
    'hilton head golf trip cost',
    'palmetto dunes golf',
    'stay and play hilton head',
    'best hilton head golf courses',
    'hilton head golf tiers',
  ],
  body: [
    {
      kind: 'p',
      html: "There are 23 golf courses inside 25 minutes of Hilton Head Island, which means most groups end up planning four-round trips with no idea how to mix them. The wrong mix means you spend $400 on a course that doesn't justify the price; the right mix means every round earns its slot.",
    },
    {
      kind: 'p',
      html: "Below is the tier breakdown we use when we build a golf trip for a client. Real 2026 in-season rates, real tradeoffs, and the four-round itinerary we run for most groups. Pair this with the <a href=\"/hilton-head-golf-packages\">stay-and-play page</a> for what we negotiate on the villa side and the <a href=\"/blog/hilton-head-golf-courses-ranked\">ranked-list post</a> for full course-by-course detail.",
    },
    {
      kind: 'h2',
      text: 'The four tiers',
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'The marquee round. Book one per trip.',
      accent: 'gold',
      items: [
        {
          name: 'Harbour Town Golf Links (Sea Pines)',
          meta: 'In-season green fee: $475 · The RBC Heritage host course',
          blurb: "There is nothing else like this on the island, or in the southeast. Pete Dye's small greens, the 18th hole into the lighthouse, the caddies who have looped here for 20 years. The price is real but the experience is real. Book it twice if your trip is golf-first; once if it's a mixed trip. Caddie strongly recommended — $80 plus tip is the local convention.",
        },
        {
          name: 'May River at Palmetto Bluff (Bluffton)',
          meta: 'In-season green fee: $295 · 20 minutes off-island',
          blurb: "Jack Nicklaus design at Palmetto Bluff. The condition of the course is the best in the region — staff has the maintenance dialed in to a fault. Slightly less iconic than Harbour Town but in real terms a better golf experience. Worth the 20-minute drive from any villa on the island. Pair it with lunch at the River House when you finish.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'The workhorse mid-tier. Two rounds per trip from this list.',
      accent: 'primary',
      items: [
        {
          name: 'Robert Trent Jones Oceanfront (Palmetto Dunes)',
          meta: 'In-season green fee: $245 · Inside Palmetto Dunes gate',
          blurb: "The course everyone photographs — actual ocean view from the 10th tee. Plays harder than it looks because of the wind off the Atlantic. The best second-round play of any trip; book it for the day after Harbour Town when you want a course that's beautiful but won't crush you mentally.",
        },
        {
          name: 'Atlantic Dunes by Davis Love III (Sea Pines)',
          meta: 'In-season green fee: $215 · Inside Sea Pines',
          blurb: "Renovated to the studs in 2016. Davis Love grew up here, and you can feel it in the routing. Generous fairways, fair greens, and one of the best practice ranges on the island. We use this for the \"day two warm-up round\" before Harbour Town or as the recovery round after.",
        },
        {
          name: 'Heron Point by Pete Dye (Sea Pines)',
          meta: 'In-season green fee: $245 · Inside Sea Pines',
          blurb: "The other Pete Dye on the property. Less ceremonial than Harbour Town but the holes are just as well-routed. Tight off the tee, severe bunkering. Strong A-tier pick if you've already played Harbour Town and want more Dye in your trip.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: 'Smart fourth-round options. Lower price, real quality.',
      accent: 'zinc',
      items: [
        {
          name: 'Arthur Hills (Palmetto Dunes)',
          meta: 'In-season green fee: $185',
          blurb: "The least-talked-about course in Palmetto Dunes, which means it's also the least-crowded. Walkable routing, fair par-3s, doesn't try to crush you. Good fourth-round pick for a 4-man group where one player isn't 100% sold on golf.",
        },
        {
          name: 'George Fazio (Palmetto Dunes)',
          meta: 'In-season green fee: $195',
          blurb: "Fazio's quieter design, traditionally known as the strategic-thinking course on the island. Greens are firm, par-4s tilt long. The course that rewards a course-management round, which is its own pleasure on a buddy trip.",
        },
        {
          name: 'Palmetto Hall (Mid-Island, public)',
          meta: 'In-season green fee: $145',
          blurb: "Public-access, semi-private feel. Two courses (Arthur Hills + Robert Cupp). Best per-dollar round on the island for a mid-tier player. We use this as the budget fourth round or the relaxed-pace closer to a trip.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Skip or save for later',
      subtitle: 'Decent rounds but rarely the right call.',
      accent: 'rose',
      items: [
        {
          name: 'Old South (Bluffton)',
          meta: 'In-season green fee: $135',
          blurb: "Fine course. Not bad. Just not on the same plane as the courses above, and the 20-minute drive across the bridge to play a B-minus round doesn't pencil out unless the group has very specific budget constraints.",
        },
        {
          name: "Eagle's Pointe (Bluffton)",
          meta: 'In-season green fee: $125',
          blurb: "Davis Love III also designed this one, but it's not in the same condition as Atlantic Dunes. Worth playing if you're in Bluffton anyway, but not worth a special trip from Hilton Head proper.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'The four-round itinerary we run most often',
    },
    {
      kind: 'p',
      html: "For a Thursday-arrive, Sunday-depart trip with four rounds, this is the order that works best after running it 40+ times with groups:",
    },
    {
      kind: 'ol',
      items: [
        '<strong>Thursday afternoon</strong> — Atlantic Dunes (Sea Pines). Warm-up round. Loose, generous, no pressure. Get your legs.',
        '<strong>Friday morning</strong> — Harbour Town Golf Links. The marquee round. 8am-9am tee time, caddies booked, post-round lunch at the Quarterdeck.',
        '<strong>Saturday morning</strong> — Robert Trent Jones Oceanfront (Palmetto Dunes). Recovery from Harbour Town with a course that has views but doesn\'t demand perfection.',
        '<strong>Sunday morning</strong> — May River at Palmetto Bluff (off-island). The send-off round. Best course condition you\'ll play all year, lunch at the River House before the drive back to the airport.',
      ],
    },
    {
      kind: 'p',
      html: "Total green-fee cost per player: ~$1,230. Total trip cost per player (villa + golf + food, mid-budget): $1,800 to $2,200 for a 4-night trip. Mid-October is the sweet spot for this exact itinerary; we shift it earlier in the spring for groups that want milder mornings.",
    },
    {
      kind: 'section',
      eyebrow: 'Detail',
      title: 'When the four-round itinerary changes',
      summary: 'Member groups, mixed-skill groups, and milestone trips.',
      blocks: [
        {
          kind: 'h3',
          text: 'Member or low-handicap groups',
        },
        {
          kind: 'p',
          html: "We swap out Atlantic Dunes for Heron Point on day 1 and keep everything else the same. Heron Point is more demanding off the tee and a better intellectual warm-up before Harbour Town. Greens are similar enough in speed that the day-2 transition feels right.",
        },
        {
          kind: 'h3',
          text: 'Mixed-skill groups (one or two players who want a relaxed round)',
        },
        {
          kind: 'p',
          html: "Swap the Sunday May River round for Palmetto Hall — saves $150/player and the pace is more forgiving for the player who's struggling. Save May River for a future trip when the whole group is ready.",
        },
        {
          kind: 'h3',
          text: 'Milestone trip — 50th birthday, retirement, etc.',
        },
        {
          kind: 'p',
          html: "Two Harbour Town rounds in the week, with the second one on Sunday morning so the trip ends on the marquee course. Add a private dinner at the Quarterdeck on Saturday night, with the lighthouse outside the window. Roughly $400 extra per player but the kind of trip people talk about for ten years.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'What you actually pay for in a "package"',
    },
    {
      kind: 'p',
      html: "Most golf packages on Hilton Head are not packages in the discount sense — they are bundles that lock in tee times and villa together. The discount averages 8 to 12% on the green fees and 4 to 8% on the villa. Where the value really shows up is in tee-time priority: a Sea Pines villa guest can book Harbour Town tee times 120 days out, which is a meaningful advantage in season.",
    },
    {
      kind: 'p',
      html: "We negotiate against this calendar to land your group on the first-tee sheet at the times you actually want, not whatever's left over. The villa side of the package matters too — staying at the Inn & Club at Harbour Town vs. a Palmetto Dunes villa shifts your morning drive from 0 minutes to 12, which adds up across four rounds.",
    },
    {
      kind: 'faq',
      label: 'Hilton Head golf package FAQ',
      items: [
        {
          q: 'How much does a 4-round Hilton Head golf trip cost in 2026?',
          a: "Real range: $1,100 to $1,500 per player in green fees, $400 to $800 per player in villa cost (4 nights, foursome splitting a 3BR), and $250 to $400 in food and drinks. Total per player: $1,800 to $2,500 in shoulder season, $2,400 to $3,200 in peak.",
        },
        {
          q: 'How far in advance do I need to book Harbour Town?',
          a: "120 days out for the prime spring and fall slots if you want a 7am to 9am morning tee time. Sea Pines villa guests get priority access at that window. Inside 60 days, you'll be choosing from 12pm to 2pm slots in shoulder season and almost nothing in peak.",
        },
        {
          q: 'Is the Harbour Town caddie really worth it?',
          a: "Yes. The caddies know every hole's wind tendency at every time of day, where to miss safe, and which putts break against the green's apparent slope. $80 plus tip per bag. Standard tip is another $40 to $60 per bag on top.",
        },
        {
          q: 'When is the best time of year to golf Hilton Head?',
          a: "Mid-September through early November, and mid-March through late April (excluding Heritage Week). Temperatures sit in the high-60s to mid-70s, wind is manageable, course conditions are at their best, and rates are 25 to 35% below summer peak.",
        },
        {
          q: 'Can I play Harbour Town if I\'m not staying at Sea Pines?',
          a: "Yes — Harbour Town accepts public tee times. You won't get the 120-day window or the resort-guest pricing, but you can absolutely book a round at standard public-rate green fees. Plan on 60 to 30 days out, expect afternoon tee times in peak season.",
        },
        {
          q: 'Do you offer stay-and-play packages?',
          a: "Yes — we negotiate the villa and the rounds together, lock the tee times, and arrange the logistics (cart drop, caddies, lunches). No upcharge; we make our money on the villa side. Full details on the <a href=\"/hilton-head-golf-packages\">stay-and-play page</a>.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Build the trip',
    },
    {
      kind: 'p',
      html: "Tell us how many golfers, what dates, and what handicap range. We send back a four-round itinerary with tee times locked, villa picked, and a budget — usually within a day. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 31) ACTIVITIES. Spring Break on Hilton Head — Heritage Week
// ---------------------------------------------------------------------------

const postSpringBreakHeritage: Post = {
  slug: 'hilton-head-spring-break-heritage-week-avoid',
  title: "Spring Break on Hilton Head: The Heritage Week to Avoid",
  excerpt:
    "Hilton Head spring break has one week to avoid and three weeks to book. Heritage Tournament logistics, family-week timing, and the smart pivot.",
  description:
    "When to book Hilton Head spring break in 2026 and 2027 — the Heritage Tournament week to avoid for family trips, and the three weeks that work.",
  category: 'Activities',
  readTime: '9 min',
  publishedAt: '2026-06-05',
  author: 'Will Griffith',
  featuredOrder: 104,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'hilton head spring break',
    'heritage tournament 2027',
    'rbc heritage spring break',
    'when to book hilton head spring break',
    'hilton head april family',
    'hilton head spring break family',
  ],
  body: [
    {
      kind: 'p',
      html: "Spring break on Hilton Head is one of the best moves on the southeastern calendar — water is warm enough by mid-April, dinner reservations open up, and rates have not yet hit summer peak. But one week ruins the math for family trips: the week of the RBC Heritage tournament. Below is the week to avoid, the three weeks to book instead, and the planning logic for booking 2027 from where we are now.",
    },
    {
      kind: 'p',
      html: "If you are golf-curious or want to attend the Heritage as a spectator, that is a different post — the <a href=\"/blog/rbc-heritage-2026-travel-guide\">Heritage tournament guide</a> covers that angle. This one is about families and couples trying to do a normal spring beach week.",
    },
    {
      kind: 'h2',
      text: 'The week to avoid for family trips',
    },
    {
      kind: 'p',
      html: "<strong>The week of the RBC Heritage tournament.</strong> In 2026 that was April 13–19; in 2027 it will be <strong>April 12–18, 2027</strong>. The tournament is the PGA Tour event that follows the Masters, and it brings roughly 100,000 spectators to the island across the week. Five things happen all at once that make it the wrong week for a family trip:",
    },
    {
      kind: 'ul',
      items: [
        'Villa rates spike 35 to 60% over the spring-break average. A 3BR Sea Pines villa that would normally rent for $580/night runs $850 to $980.',
        'Sea Pines traffic is at its worst. The gate line backs up to US-278 between 8am and 11am, and the bike trails are packed with spectators heading to the course.',
        'Harbour Town is closed to non-spectators all week. Restaurants in Sea Pines are at 100% reservations capacity through dinner; you cannot walk in anywhere.',
        'Every dinner reservation on the island gets harder. Lucky Rooster, ELA\'s, Charlie\'s — all booked out two to three weeks ahead during Heritage Week.',
        'Beach access in Sea Pines requires patience. The parking and the bike-rack space at Tower Beach get genuinely full by 10am.',
      ],
    },
    {
      kind: 'p',
      html: "If you are bringing kids and you want a normal spring beach week with bike rides and lazy mornings, Heritage Week is the wrong call. There is no way to enjoy the tournament-week intensity unless you came specifically for the golf.",
    },
    {
      kind: 'h2',
      text: 'The three weeks to book instead',
    },
    {
      kind: 'p',
      html: "Spring break on Hilton Head has three clean windows that all beat Heritage Week for a family trip:",
    },
    {
      kind: 'h3',
      text: 'Window 1: Mid-March (March 14–21, 2026 / March 13–20, 2027)',
    },
    {
      kind: 'p',
      html: "The earliest week the water is genuinely swimmable for kids (mid-70s by late afternoon). Air temperatures are 72 to 78°F. Villa rates are at their lowest of the spring — roughly 25 to 35% below Heritage Week prices. The tradeoff: dolphin sightings drop, some restaurants are still on shoulder hours, and the wind can pick up.",
    },
    {
      kind: 'h3',
      text: 'Window 2: Late March / early April (March 28 – April 4, 2026)',
    },
    {
      kind: 'p',
      html: "Peak spring-break sweet spot. Water is 74 to 76°F, air is 76 to 82°F, all restaurants are running their full menus and full reservation books, and dolphin sightings are reliable. Rates are 12 to 20% over the mid-March price but the experience is dialed in. This is the week we book most family trips.",
    },
    {
      kind: 'h3',
      text: 'Window 3: The week after Heritage (April 19–26, 2026 / April 18–25, 2027)',
    },
    {
      kind: 'p',
      html: "The Heritage post-week is actually one of the smartest secrets on the calendar. Restaurants are emptier than they were the week before. The crowds have left. The weather has warmed up another two degrees. And rates drop back down to the late-March levels. The only downside is that the tournament infrastructure (grandstands, hospitality tents) is still being torn down in Sea Pines for the first 48 hours, so plan on slightly more traffic around Harbour Town for Monday and Tuesday.",
    },
    {
      kind: 'p',
      html: "More detail on month-by-month family timing is on the <a href=\"/hilton-head-spring-break\">spring break page</a> and the <a href=\"/hilton-head-family-trip-planner\">family planner</a>.",
    },
    {
      kind: 'h2',
      text: 'The exception — Heritage Week if you want it',
    },
    {
      kind: 'p',
      html: "If you have a golfer in the family who would love to watch the tournament live, Heritage Week becomes the right call — but you book it as a tournament trip, not a family beach trip. Stay outside of Sea Pines (we put Heritage-spectator clients in Shelter Cove or Palmetto Dunes more often than Sea Pines, because the spectator shuttle is easier and the dinner reservations are open). Book hospitality tickets six months out. Plan the beach time for the back end of the trip after the tournament finishes.",
    },
    {
      kind: 'p',
      html: "Full Heritage logistics — where to stay as a spectator, ticketing, the daily-pass strategy — are on the <a href=\"/blog/rbc-heritage-2026-travel-guide\">Heritage travel guide</a>. We also have the dedicated <a href=\"/hilton-head-golf-packages\">golf package page</a> if your trip is mostly about playing rather than spectating.",
    },
    {
      kind: 'h2',
      text: 'Booking 2027 from May 2026',
    },
    {
      kind: 'p',
      html: "If you read this in May or June of 2026 and want a 2027 spring break trip, here is what is already booked, what is still open, and the right move.",
    },
    {
      kind: 'h3',
      text: 'Already filling',
    },
    {
      kind: 'p',
      html: "Sea Pines oceanfront row for the week of March 28 – April 4, 2027 is already 60% booked. Palmetto Dunes oceanfront for the same week is 40% booked. The April 19–26, 2027 post-Heritage week is roughly 30% booked across the island. Inventory will tighten quickly from here — by September, the prime weeks will be 80%+ committed.",
    },
    {
      kind: 'h3',
      text: 'What we recommend',
    },
    {
      kind: 'p',
      html: "Book by end of June 2026 if you want oceanfront row in Sea Pines or Palmetto Dunes. Off-beach interior pockets can wait until October. Forest Beach 2BRs are the most flexible — we have booked them as late as January for that April. The closer to the beach you want, the earlier you book.",
    },
    {
      kind: 'callout',
      label: 'Heritage 2027 dates',
      html: "The RBC Heritage 2027 will run from <strong>Monday, April 12 through Sunday, April 18, 2027</strong>. Treat that as a hard \"do not book a family beach trip\" window. The weeks immediately before and after are the smart pivots.",
    },
    {
      kind: 'faq',
      label: 'Hilton Head spring break FAQ',
      items: [
        {
          q: 'When is the best week for spring break on Hilton Head?',
          a: "Late March through the first week of April, avoiding the week of the RBC Heritage golf tournament. In 2027 that means March 28 – April 4 or April 19–25 are the two top picks. Both have warm-enough water, full restaurant operations, and rates 25 to 30% below Heritage Week.",
        },
        {
          q: 'Is the water warm enough to swim in March on Hilton Head?',
          a: "By the last week of March, yes — the water hits 70°F most days, and the air sits around 74 to 78°F. Kids who would happily swim in a hotel pool will swim in the ocean. Adults sometimes find March water too cold for full swimming but fine for wading.",
        },
        {
          q: 'How crowded is Hilton Head during Heritage Week?',
          a: "Roughly 100,000 spectators come to the island across the four tournament days plus the surrounding practice rounds. Sea Pines is the epicenter. Other neighborhoods are 20 to 30% busier than a normal April week but still functional. Avoid Sea Pines unless you came for the tournament.",
        },
        {
          q: 'Should I book spring break 2027 right now?',
          a: "If you want Sea Pines or Palmetto Dunes oceanfront row, yes — book by end of June 2026. Interior pockets and Forest Beach are still flexible into the fall. After September, the rate-plus-availability math gets noticeably worse.",
        },
        {
          q: 'What about Easter weekend specifically?',
          a: "Easter 2026 was April 5; Easter 2027 is March 28. Both fall outside Heritage Week and inside our recommended windows. Easter weekend itself sees a 10 to 15% spike on Saturday and Sunday rates but the surrounding week is normal spring-break pricing.",
        },
        {
          q: 'Where should we stay for spring break with kids 5 to 10?',
          a: "Palmetto Dunes, almost always. The lagoon system is open year-round, the bike paths are full but not packed, and the family-trip restaurants (ELA's, Skull Creek, Hudson's) are at their full menus by late March. Sea Pines is a strong second; Forest Beach for budget-driven family trips.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Get the dates locked',
    },
    {
      kind: 'p',
      html: "Tell us your spring-break window (school district matters — we ask) and what kind of trip you want. We come back with two date options, two villa shortlists, and a budget. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 32) PLANNING. Real Hilton Head Weather Month-by-Month
// ---------------------------------------------------------------------------

const postWeatherMonthByMonth: Post = {
  slug: 'hilton-head-weather-month-by-month',
  title: "The Real Hilton Head Weather Month-by-Month (From a Local)",
  excerpt:
    "Hilton Head weather, month by month, by someone who lives here. Real water temps, real rain risk, and which trip type fits which month.",
  description:
    "Real Hilton Head weather month by month — actual water temps, rain risk, hurricane window, and which trip type works best in each month.",
  category: 'Planning',
  readTime: '12 min',
  publishedAt: '2026-06-06',
  author: 'Will Griffith',
  featuredOrder: 105,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'hilton head weather by month',
    'best month to visit hilton head',
    'hilton head water temperature',
    'hilton head rain season',
    'hilton head hurricane month',
    'hilton head weather guide',
  ],
  body: [
    {
      kind: 'p',
      html: "Most month-by-month Hilton Head weather pages are AI-generated tables copy-pasted from generic Lowcountry averages. The numbers in those tables are off by enough to ruin a trip — particularly the water-temperature numbers and the rain-risk averages. This is what it actually feels like here, month by month, written from living on the island.",
    },
    {
      kind: 'p',
      html: "Use this with the standalone monthly pages — <a href=\"/hilton-head-weather/january\">January</a>, <a href=\"/hilton-head-weather/march\">March</a>, <a href=\"/hilton-head-weather/april\">April</a>, <a href=\"/hilton-head-weather/june\">June</a>, <a href=\"/hilton-head-weather/october\">October</a>, <a href=\"/hilton-head-weather/december\">December</a> — for the deeper drill-downs.",
    },
    {
      kind: 'h2',
      text: 'The quick table',
    },
    {
      kind: 'table',
      caption: 'Hilton Head real weather, month by month',
      headers: ['Month', 'High °F', 'Low °F', 'Water °F', 'Rain risk', 'Best for'],
      rows: [
        ['January', '58', '40', '54', 'Low', 'Snowbirds, winter rentals, golf in the 60s'],
        ['February', '62', '42', '54', 'Low', 'Snowbirds, off-season couples, golf'],
        ['March', '69', '49', '60', 'Low–Med', 'Spring break (late), early golf, couples'],
        ['April', '76', '57', '67', 'Med', 'Spring break, Heritage Week, golf prime'],
        ['May', '83', '65', '74', 'Med', 'Family pre-summer, golf, weddings'],
        ['June', '88', '72', '80', 'High (afternoon storms)', 'Family peak start, beach prime'],
        ['July', '91', '74', '84', 'High (afternoon storms)', 'Family peak, hot afternoons'],
        ['August', '90', '74', '85', 'High (storms + early hurricane risk)', 'Family late peak, hottest water'],
        ['September', '85', '69', '82', 'Med (peak hurricane risk Sep 10–Oct 10)', 'Couples, second golf prime, family if flexible'],
        ['October', '78', '60', '76', 'Low (post-hurricane window)', 'Golf prime, couples, foodie weekends'],
        ['November', '69', '49', '67', 'Low', 'Thanksgiving, late golf, holiday couples'],
        ['December', '60', '42', '57', 'Low', 'Holiday couples, winter rentals begin'],
      ],
    },
    {
      kind: 'p',
      html: "Source notes: high/low are 30-year NOAA averages for the Savannah station, the closest official station to Hilton Head Island. Water temps are NOAA buoy data for the offshore station, which runs 1 to 2°F warmer than the closer-to-shore actual swim temperature.",
    },
    {
      kind: 'h2',
      text: 'Month-by-month, the real version',
    },
    {
      kind: 'section',
      eyebrow: 'Q1',
      title: 'January — quiet, cheap, and underrated',
      summary: 'Snowbird month. Mid-50s water. Locked-in rates.',
      defaultOpen: false,
      blocks: [
        {
          kind: 'p',
          html: "January on Hilton Head is the calmest month of the year. Highs run 58°F, lows around 40°F. Cold snaps drop into the high-20s for two or three nights a year and then bounce back. The water is mid-50s — you are not swimming, but you are walking the beach in a fleece and feeling deeply okay about the world. Restaurants are at 30 to 40% capacity and the dinner reservations are walk-in easy. Best for: snowbird stays, winter rentals, romantic weekend escapes. Worst for: anyone expecting to swim, anyone who needs the marina open for dolphin tours. Full details on the <a href=\"/hilton-head-weather/january\">January page</a> and the <a href=\"/hilton-head-winter-rental\">winter rental landing</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q1',
      title: 'February — second month of the snowbird quiet',
      summary: 'Slightly warmer than January. Same dynamics.',
      blocks: [
        {
          kind: 'p',
          html: "February is January with a couple more degrees and slightly longer days. Highs in the low-60s, lows in the low-40s. Water still cold. The first hint of warmth happens in the last week — a 70°F day or two slips into the forecast. Best for: golf trips for cold-weather refugees, snowbirds, off-season couples weekends. Restaurants are still on shoulder hours but full menus are in operation.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q1',
      title: 'March — the shoulder turns',
      summary: 'Air warms up. Water still cool. Spring-break starts late month.',
      blocks: [
        {
          kind: 'p',
          html: "March is the inflection month. The first week feels like February — high 60s, low 50s water. By the last week, highs are pushing 75°F and water is 65 to 68°F. Air-temperature spring-break weather is comfortable by mid-month; water-temperature spring-break is comfortable only in the last week. Best for: spring break families with older kids (the cooler water doesn't bother teens as much as it bothers 5-year-olds), early golf trips, and couples who want the island before the crowds arrive. Detail on the <a href=\"/hilton-head-weather/march\">March page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q2',
      title: 'April — the best month of the year',
      summary: 'Heritage Week is the exception. Otherwise, the cleanest weather on the calendar.',
      blocks: [
        {
          kind: 'p',
          html: "April is the closest the Hilton Head climate gets to perfect. Highs in the mid-70s, lows around 60°F, water 67°F by mid-month and 70°F by month-end. Air is dry, breeze is light, mornings are 64°F-and-bright. The one exception is Heritage Week — the second full week of April — which becomes a tournament week with all the side effects, see the <a href=\"/blog/hilton-head-spring-break-heritage-week-avoid\">spring break post</a>. Outside of Heritage Week, April is the best month for golf trips, the best month for couples weekends, and one of the two best months for weddings. Full details on the <a href=\"/hilton-head-weather/april\">April page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q2',
      title: 'May — water swimmable for everyone',
      summary: 'The first family-friendly month. Pre-summer prices.',
      blocks: [
        {
          kind: 'p',
          html: "May is when the water hits 74°F and stays there — the threshold where 7-year-olds will happily spend three hours in the ocean. Air temperatures are mid-80s, humidity is creeping up but not oppressive. Afternoon thunderstorms are occasional but not the every-day pattern they will be by July. Best for: families who can shift their school calendar earlier, weddings, and second-trip clients who want summer water without summer rates. Rates are 18 to 25% below June peak.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q2',
      title: 'June — the family peak begins',
      summary: '80°F water. 88°F days. Afternoon storms.',
      blocks: [
        {
          kind: 'p',
          html: "June is the start of family peak season. Schools are out the second week. Water is 80°F. Air is 88°F. Afternoon thunderstorms become a near-daily 30% probability, usually between 3pm and 6pm, lasting 30 to 60 minutes. The local rhythm shifts: beach in the morning, lunch, nap or pool, beach again at 4:30pm after the storm passes. Best for: families with school-age kids, big-group reunions. Full breakdown on the <a href=\"/hilton-head-weather/june\">June page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q3',
      title: 'July — hottest month of the year',
      summary: '91°F days. 84°F water. Crowds peak.',
      blocks: [
        {
          kind: 'p',
          html: "July is the hottest month — highs 91°F, water 84°F, humidity 80%+. The morning beach window is the best time of the day; by 1pm the sand is too hot for bare feet. Afternoon thunderstorms continue. This is also the peak crowd month, with the July 4 week and the two weeks following it functionally booked out across the island. If you want July, see our <a href=\"/blog/last-call-july-hilton-head-villa-availability\">last-call July inventory post</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q3',
      title: 'August — same as July, with hurricane risk starting',
      summary: 'Last full peak month. Hurricane season begins to bite.',
      blocks: [
        {
          kind: 'p',
          html: "August feels identical to July weather-wise but the hurricane risk starts climbing. The Atlantic hurricane season runs June 1 through November 30, but real Hilton Head risk window is August 20 through October 10. August trips are still typically fine, but it's the first month where checking the NOAA hurricane outlook before locking dates is genuinely worth doing. See our <a href=\"/blog/hilton-head-2026-hurricane-forecast\">hurricane forecast post</a> for the framework.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q3',
      title: 'September — the smartest month for most people',
      summary: 'Post-Labor Day quiet. Warm water. Lower rates.',
      blocks: [
        {
          kind: 'p',
          html: "September is the most underrated month on the calendar. Post-Labor Day, the crowds drop by 60% overnight. Water stays at 82°F through the month. Air temperatures sit in the mid-80s with the humidity easing slightly. Rates drop 22 to 30% from summer peak. The one caveat is hurricane risk — September 10 through October 10 is the peak Atlantic hurricane window. Trip insurance matters more in this month than any other. We send roughly 30% of our annual client volume here now.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q4',
      title: 'October — the second-best month of the year',
      summary: 'Golf prime, foodie weekends, post-hurricane calm.',
      blocks: [
        {
          kind: 'p',
          html: "October is April's autumn twin. Highs in the high-70s, water still 76°F through mid-month, air dry, breezes off the ocean. The post-hurricane window opens by October 10 and the rest of the month is one of the lowest-risk weather periods of the year. Best for: golf trips (this is when locals book their best rounds), couples weekends, foodie weekends, and late-season weddings. Full breakdown on the <a href=\"/hilton-head-weather/october\">October page</a>.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q4',
      title: 'November — Thanksgiving and the back end of the season',
      summary: 'Mid-60s highs. Thanksgiving week is the only peak.',
      blocks: [
        {
          kind: 'p',
          html: "November is mid-60s highs, mid-40s lows, mostly dry. The water is still 67°F early month and 60°F by month-end — wading temperature only. Thanksgiving week is the one peak window in an otherwise quiet month, with restaurants booking out three weeks ahead. Outside of Thanksgiving week, the rest of the month is one of the lowest-rate periods of the year. See the <a href=\"/hilton-head-thanksgiving\">Thanksgiving page</a> for the specific week.",
        },
      ],
    },
    {
      kind: 'section',
      eyebrow: 'Q4',
      title: 'December — quiet winter, holiday couples',
      summary: 'Low-60s highs. First weeks are off-peak. Christmas is a small peak.',
      blocks: [
        {
          kind: 'p',
          html: "December returns to January's calm pattern — low-60s highs, low-40s lows, dry. The first two weeks are the cheapest of the year on the island. Christmas week is the only winter peak — Sea Pines decorates Harbour Town with lights and families come back for the holidays. Best for: romantic winter escapes, holiday couples, and snowbird stays starting. Detail on the <a href=\"/hilton-head-weather/december\">December page</a>.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Which trip type fits which month',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Couples weekend</strong>: October > April > September > March. Mild weather, dinner reservations open, no kids.',
        '<strong>Family week with kids</strong>: May > June > August > July. Warm water, full restaurant menus, lagoon systems open.',
        '<strong>Golf trip</strong>: October > April > March > May. Cooler mornings, no thunderstorm pattern, peak course conditions.',
        '<strong>Wedding</strong>: April > October > May > June. Mild temps, low rain risk, post-hurricane calm.',
        '<strong>Snowbird month</strong>: January > February > March (late). Low rates, walking weather, light crowds.',
        '<strong>Foodie weekend</strong>: October > November (non-Thanksgiving) > March > December. Restaurants quiet enough to walk in.',
      ],
    },
    {
      kind: 'p',
      html: "For more trip-type specifics, see the dedicated landings — <a href=\"/hilton-head-family-trip-planner\">family planner</a>, <a href=\"/hilton-head-golf-packages\">golf packages</a>, <a href=\"/hilton-head-weddings\">weddings</a>, <a href=\"/hilton-head-honeymoon\">honeymoon</a>, <a href=\"/hilton-head-winter-rental\">winter rentals</a>, <a href=\"/hilton-head-beaches\">beaches</a>.",
    },
    {
      kind: 'faq',
      label: 'Hilton Head weather FAQ',
      items: [
        {
          q: 'What is the best month to visit Hilton Head?',
          a: "October for adults and couples; May or early June for families with kids who need warm water. April is the close second for both categories, with the caveat that Heritage Week is the exception. September is the smartest pick if you're flexible and willing to track the hurricane outlook.",
        },
        {
          q: 'How warm is the water at Hilton Head in June?',
          a: "June water averages 80°F. By the last week, it's 82°F. This is the first month of the year where the water is unambiguously swimmable for everyone in the family, including young kids who would otherwise complain about cold.",
        },
        {
          q: 'When is hurricane season on Hilton Head?',
          a: "Atlantic hurricane season runs June 1 through November 30, but the real Hilton Head risk window is mid-August through mid-October, with peak risk September 10 through October 10. We track the NOAA outlook for any client trip in that window and have written a full <a href=\"/blog/hilton-head-2026-hurricane-forecast\">hurricane planning guide</a>.",
        },
        {
          q: 'Does Hilton Head get cold in winter?',
          a: "Cold by Lowcountry standards, mild by anywhere else's standards. Highs run 58 to 62°F December through February, lows in the low 40s. A handful of nights drop into the high 20s. Most of the winter is fleece-and-beach-walk weather rather than coat-and-stay-inside weather.",
        },
        {
          q: 'Is it humid in Hilton Head?',
          a: "Yes, in summer. June through August humidity runs 75 to 85%, which compounds the heat. From October through May, humidity sits at 55 to 70% and is rarely noticeable. The first cool-air shift each fall typically arrives around October 8 to 15.",
        },
        {
          q: 'What month has the least rain on Hilton Head?',
          a: "Statistically, October and November tie for the lowest rainfall — about 2 to 2.5 inches across the month. June through August see 5 to 6 inches each, mostly from afternoon thunderstorms rather than all-day rain.",
        },
      ],
    },
    {
      kind: 'h2',
      text: 'Pick your month and tell us',
    },
    {
      kind: 'p',
      html: "If you know roughly when you can travel, we can tell you which week inside that month is the smartest pick — based on tides, restaurant reservation patterns, hurricane outlook, and current villa inventory. <a href=\"/itinerary\">We'll build the plan for you</a>.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** All posts, ordered by featuredOrder ascending. */
export const posts: Post[] = [
  post2026Stays,
  postRestaurantsRanked,
  postThingsToDoRanked,
  postSeaPines,
  postPalmettoDunes,
  postForestBeach,
  postShelterCove,
  postGolfTrip,
  postBestTime,
  postHurricaneForecast2026,
  postBridge2026Debunker,
  postRbcHeritage,
  postWithKids,
  postBestBeaches,
  post3DayItinerary,
  post7DayItinerary,
  postHHvsMyrtleBeach,
  postSeaPinesVsPalmettoDunes,
  postGolfCoursesRanked,
  postRomanticRestaurants,
  postWinterGuide,
  postFishingGuide,
  postDogFriendly,
  postWeekendGetaway,
  postDolphinTours,
  postKayakingGuide,
  postBestPizza,
  postTripCost2026,
  postLastCallJuly,
  postThreeWayCompare,
  postGolfTiers,
  postSpringBreakHeritage,
  postWeatherMonthByMonth,
].sort((a, b) => a.featuredOrder - b.featuredOrder);

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | undefined;
  next: Post | undefined;
} {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? posts[idx - 1] : undefined,
    next: idx < posts.length - 1 ? posts[idx + 1] : undefined,
  };
}

// ---------------------------------------------------------------------------
// Topical relations — used by the blog template to render two cross-link
// rails:
//   1. Related Posts (other articles in the topical cluster)
//   2. Related Local Directory (industry pages where readers can act on intent)
//
// Maintained as a separate map so we can update relationships without
// editing every post object.
// ---------------------------------------------------------------------------

import type { IndustrySlug } from './localBusinesses';

type PostRelation = {
  posts: string[]; // up to 3 post slugs to feature as Related Reading
  industries: IndustrySlug[]; // up to 3 directory categories to feature
};

export const POST_RELATIONS: Record<string, PostRelation> = {
  '2026-best-places-to-stay-hilton-head': {
    posts: ['sea-pines-vs-palmetto-dunes', 'sea-pines-guide', 'palmetto-dunes-guide'],
    industries: ['vacation-rentals'],
  },
  'hilton-head-restaurants-ranked-2026': {
    posts: ['hilton-head-romantic-restaurants', 'hilton-head-things-to-do-ranked-2026', 'best-time-to-visit-hilton-head'],
    industries: ['restaurants'],
  },
  'hilton-head-things-to-do-ranked-2026': {
    posts: ['hilton-head-restaurants-ranked-2026', 'best-hilton-head-beaches', 'hilton-head-with-kids'],
    industries: ['water-activities', 'family-activities', 'golf'],
  },
  'sea-pines-guide': {
    posts: ['palmetto-dunes-guide', 'sea-pines-vs-palmetto-dunes', 'hilton-head-golf-trip'],
    industries: ['vacation-rentals', 'golf', 'restaurants'],
  },
  'palmetto-dunes-guide': {
    posts: ['sea-pines-guide', 'sea-pines-vs-palmetto-dunes', '2026-best-places-to-stay-hilton-head'],
    industries: ['vacation-rentals', 'golf', 'water-activities'],
  },
  'forest-beach-guide': {
    posts: ['shelter-cove-guide', 'best-hilton-head-beaches', 'hilton-head-with-kids'],
    industries: ['vacation-rentals', 'restaurants', 'shopping'],
  },
  'shelter-cove-guide': {
    posts: ['forest-beach-guide', 'hilton-head-fishing-guide', 'hilton-head-dolphin-tours'],
    industries: ['restaurants', 'water-activities', 'shopping'],
  },
  'hilton-head-golf-trip': {
    posts: ['hilton-head-golf-courses-ranked', 'rbc-heritage-2026-travel-guide', 'sea-pines-guide'],
    industries: ['golf', 'vacation-rentals'],
  },
  'best-time-to-visit-hilton-head': {
    posts: ['hilton-head-3-day-itinerary', 'hilton-head-winter-guide', 'best-hilton-head-beaches'],
    industries: ['water-activities', 'family-activities'],
  },
  'rbc-heritage-2026-travel-guide': {
    posts: ['hilton-head-golf-trip', 'hilton-head-golf-courses-ranked', 'sea-pines-guide'],
    industries: ['golf', 'vacation-rentals', 'restaurants'],
  },
  'hilton-head-with-kids': {
    posts: ['best-hilton-head-beaches', 'hilton-head-things-to-do-ranked-2026', 'hilton-head-3-day-itinerary'],
    industries: ['family-activities', 'water-activities'],
  },
  'best-hilton-head-beaches': {
    posts: ['hilton-head-with-kids', 'forest-beach-guide', 'hilton-head-things-to-do-ranked-2026'],
    industries: ['water-activities', 'family-activities'],
  },
  'hilton-head-3-day-itinerary': {
    posts: ['hilton-head-7-day-itinerary', 'hilton-head-things-to-do-ranked-2026', 'hilton-head-restaurants-ranked-2026'],
    industries: ['restaurants', 'water-activities'],
  },
  'hilton-head-7-day-itinerary': {
    posts: ['hilton-head-3-day-itinerary', 'hilton-head-things-to-do-ranked-2026', 'hilton-head-restaurants-ranked-2026'],
    industries: ['restaurants', 'water-activities', 'golf'],
  },
  'hilton-head-vs-myrtle-beach': {
    posts: ['2026-best-places-to-stay-hilton-head', 'best-time-to-visit-hilton-head', 'hilton-head-things-to-do-ranked-2026'],
    industries: ['vacation-rentals'],
  },
  'sea-pines-vs-palmetto-dunes': {
    posts: ['sea-pines-guide', 'palmetto-dunes-guide', '2026-best-places-to-stay-hilton-head'],
    industries: ['vacation-rentals', 'golf'],
  },
  'hilton-head-golf-courses-ranked': {
    posts: ['hilton-head-golf-trip', 'rbc-heritage-2026-travel-guide', 'sea-pines-guide'],
    industries: ['golf'],
  },
  'hilton-head-romantic-restaurants': {
    posts: ['hilton-head-restaurants-ranked-2026', 'hilton-head-3-day-itinerary', 'best-time-to-visit-hilton-head'],
    industries: ['restaurants', 'weddings'],
  },
  'hilton-head-winter-guide': {
    posts: ['best-time-to-visit-hilton-head', '2026-best-places-to-stay-hilton-head', 'hilton-head-romantic-restaurants'],
    industries: ['vacation-rentals', 'restaurants'],
  },
  'hilton-head-fishing-guide': {
    posts: ['hilton-head-kayaking-guide', 'hilton-head-dolphin-tours', 'shelter-cove-guide'],
    industries: ['water-activities'],
  },
  'hilton-head-dog-friendly-guide': {
    posts: ['best-hilton-head-beaches', 'forest-beach-guide', 'hilton-head-with-kids'],
    industries: ['family-activities', 'restaurants'],
  },
  'hilton-head-2026-hurricane-forecast': {
    posts: ['best-time-to-visit-hilton-head', 'hilton-head-2026-bridge-construction', '2026-best-places-to-stay-hilton-head'],
    industries: ['vacation-rentals'],
  },
  'hilton-head-2026-bridge-construction': {
    posts: ['hilton-head-2026-hurricane-forecast', 'best-time-to-visit-hilton-head', 'hilton-head-weekend-getaway'],
    industries: ['vacation-rentals'],
  },
  'hilton-head-weekend-getaway': {
    posts: ['hilton-head-3-day-itinerary', 'best-time-to-visit-hilton-head', '2026-best-places-to-stay-hilton-head'],
    industries: ['restaurants', 'vacation-rentals'],
  },
  'hilton-head-dolphin-tours': {
    posts: ['hilton-head-kayaking-guide', 'hilton-head-fishing-guide', 'hilton-head-with-kids'],
    industries: ['water-activities', 'family-activities'],
  },
  'hilton-head-kayaking-guide': {
    posts: ['hilton-head-dolphin-tours', 'hilton-head-fishing-guide', 'shelter-cove-guide'],
    industries: ['water-activities', 'family-activities'],
  },
};

/**
 * Returns up to 3 related posts for the given post slug.
 * Filters out the current post and any slugs that don't resolve to a real post.
 */
export function getRelatedPosts(slug: string): Post[] {
  const slugs = POST_RELATIONS[slug]?.posts ?? [];
  return slugs
    .filter((s) => s !== slug)
    .map((s) => getPostBySlug(s))
    .filter((p): p is Post => !!p);
}

/**
 * Returns the IndustrySlug array for a post's related local directory pages.
 */
export function getRelatedIndustries(slug: string): IndustrySlug[] {
  return POST_RELATIONS[slug]?.industries ?? [];
}
