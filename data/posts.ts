/**
 * Blog post content.
 *
 * Each post is a metadata record + ordered list of content blocks.
 * Rendered by components/PostBody.tsx. Content is static and trusted
 * (maintained in this repo), so paragraphs may include inline HTML
 * for <strong>, <em>, and <a href>.
 */

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
    };

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
   * Neighborhood slugs this post meaningfully covers. Drives the
   * bidirectional internal-link block at the bottom of the post (blog
   * -> /hilton-head/[slug]), complementing the neighborhood -> blog
   * link that already lives on the landing pages. Keep to 1-4 slugs;
   * empty array = general-interest post with no direct neighborhood.
   * Valid values match the slugs in data/neighborhoods.ts:
   *   'sea-pines' | 'palmetto-dunes' | 'forest-beach' | 'shelter-cove'
   */
  relatedNeighborhoods?: string[];
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
      html: "Here's the truth nobody tells you: where you stay on Hilton Head matters more than what you do. The island is twelve miles long, and the wrong address adds forty minutes of driving to every beach day and every dinner reservation.",
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
      html: "Every visitor's guide to Hilton Head restaurants reads the same: the same twenty places, in a different order, with the same shrimp-and-grits descriptions. This isn't that list.",
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
      html: "Dinner reservations are the hardest-to-solve piece of a Hilton Head trip. If you want us to lock in the four S-tier tables before you arrive, the <a href=\"/itinerary\">$450 itinerary service</a> includes reservation handling. For timing questions, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather and best time guide</a> shows which weeks have the tightest booking windows.",
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
            "The biggest quality gap between operators is enormous. Captain Mark runs small-group cruises that actually find dolphins and actually teach you about them. Everybody else does the same loop and calls it a day. Ask for him by name.",
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
            "Outside Hilton Head (the local outfitter) runs small-group creek tours. The 7am slot is magical. Fog, herons, and zero boat traffic. Skip the bigger operators; they bunch groups of 20.",
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
          a: "Captain Mark\u2019s small-group dolphin cruise out of Harbour Town. The quality gap between operators is enormous; Captain Mark actually finds dolphins, actually teaches you about them, and keeps groups small. Everybody else runs the same loop with 40-person boats. Ask for him by name when booking.",
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
      html: "A good Hilton Head week balances two or three booked activities with four or five open days. If you want us to lock Captain Mark, the 7 a.m. kayak slot, and the right fishing captain before you arrive, the <a href=\"/itinerary\">$450 itinerary service</a> includes activity bookings. For timing, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather guide</a> maps each activity to its best month.",
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
      html: "The postcard. Iconic red-and-white lighthouse, yacht-lined marina, Liberty Oak with live music most nights. Best for couples, first-timers, and anyone who wants to be where the energy is. Villas here walk to dinner. Downside: busiest parking, highest rates, cruise-port feel at peak hour.",
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
      html: "The oceanfront villa lanes. Mooring Buoy, Sea Oaks, Shelter Cove Way. Are where the serious bookings live. Five-bedroom houses with private pools, steps from the sand. These are rented through the resort's villa program and a small group of independent managers. Quality is high but variable; we stick to four buildings we've personally vetted.",
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
      html: "Three courses, one booking system, one caveat.",
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
      html: "Coligny is the only real retail plaza on the island. Honest take: the food is middling (tourist-forward), but the convenience is unbeatable. What's worth knowing:",
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
      html: "The marina is where most of the island's boat operators run from. Sunset sail on a 41-foot catamaran. The Vagabond Cruise. Is the obvious move. 90 minutes, BYOB, typically 10-12 people.",
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
      html: "Hilton Head has 24 golf courses across three clusters (Sea Pines, Palmetto Dunes, Bluffton). More golf per square mile than any resort island in America. The problem isn't finding a course. It's figuring out which four to play, which order, and how to sequence lodging so you're not driving across the island between rounds.",
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
      html: "Peak-season (April or July) versions of the same trip run 30-40% higher.",
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
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 2.5,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
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
      html: "The standard advice. \"come in summer\". Is exactly wrong for most of our clients. Hilton Head Island has four genuinely different weather seasons, and picking the right window can cut your trip cost by 40%, add three hours of beach time per day, and swap a 90-minute airport-to-villa drive for a 25-minute one. Here's the honest month-by-month breakdown we walk every client through before they book.",
    },
    {
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>The best time to visit Hilton Head is mid-October.</strong> Ocean water still averages 73\u00b0F, days sit at a dry 75-80\u00b0F, hurricane risk has passed, and lodging rates run 30-40% below summer peak. If school calendars lock you into summer, book mid-June. For golf, <a href=\"/hilton-head-golf-packages\">early May or late October</a>. For families at <a href=\"/hilton-head-spring-break\">spring break</a>, the second half of March.",
    },
    {
      kind: 'h2',
      text: "Hilton Head weather at a glance",
    },
    {
      kind: 'p',
      html: "The Lowcountry sits on the same latitude as Casablanca. Winters are mild, summers are hot and humid, and the Atlantic moderates both ends. Here's what every month actually looks like on the island. Averages are built from 30-year NOAA data at the nearby Savannah station, adjusted for the 2-3\u00b0F warmer ocean signal Hilton Head reads right on the coast.",
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
      html: "Two notes people miss. The island is <strong>noticeably warmer than inland Savannah</strong> in winter and <strong>cooler than inland Savannah</strong> in summer. Think of Hilton Head as its own micro-climate. And rainy-day counts here mean afternoon thunderstorms in summer, not all-day washouts. A July afternoon storm clears in 45 minutes and the beach is open again by five.",
    },
    {
      kind: 'h2',
      text: "The four real seasons on Hilton Head",
    },
    {
      kind: 'h3',
      text: 'Spring. March through mid-May',
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
      text: 'Summer. Late May through August',
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
      text: 'Fall. September through early November',
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
      text: 'Winter. Late November through February',
    },
    {
      kind: 'p',
      html: "<strong>Weather:</strong> 55-68\u00b0F days, 40-50\u00b0F nights. The occasional 45\u00b0F rainy stretch. Water too cold to swim at 55-58\u00b0F. <strong>Crowds:</strong> Genuinely quiet. The island breathes out. <strong>Rates:</strong> Lowest of the year, 50-55% below summer on villas, 40% below on resorts. <strong>Best for:</strong> budget-conscious couples, writers' retreats, shoulder-season golfers willing to sweater-up at 7 a.m.",
    },
    {
      kind: 'p',
      html: "The beach is empty and stunning. You'll wear a jacket at sunset. A handful of restaurants close one night a week, some tour operators pause, and the Sea Pines trolley runs a limited schedule. We plan around it. Genuinely underrated for older couples who don't care about swimming and for anyone who prefers <a href=\"/hilton-head/sea-pines\">Sea Pines</a> without the bikes-ten-abreast traffic of July.",
    },
    {
      kind: 'h2',
      text: "Hilton Head water temperature by month",
    },
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
      kind: 'h2',
      text: "Month-by-month planning notes",
    },
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
    {
      kind: 'h2',
      text: "The two weeks to absolutely avoid",
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
      kind: 'h2',
      text: "Hurricane season on Hilton Head: the honest numbers",
    },
    {
      kind: 'p',
      html: "Atlantic hurricane season officially runs <strong>June 1 to November 30</strong>. Actual risk to Hilton Head is concentrated in <strong>late August through mid-October</strong>, with the historical peak around September 10. In the last 10 years, only two hurricanes have caused island-wide closures (Matthew in 2016, Irma in 2017). Dorian in 2019 and Idalia in 2023 triggered evacuations that turned out largely precautionary.",
    },
    {
      kind: 'p',
      html: "The odds of your specific travel week being hit by a named storm are <strong>under 4%</strong>. The odds of a mandatory evacuation are closer to 1%. Hilton Head's barrier-island geometry and the Lowcountry's wide tidal marsh both eat surge; most storms that threaten the island track west or north before landfall.",
    },
    {
      kind: 'p',
      html: "That said. We always recommend trip insurance for September and early-October bookings. A named-storm policy costs roughly 5-7% of trip total and covers full refund if an evacuation order is issued during your travel window. Call us if you want specifics on which policy actually pays out. Most don't.",
    },
    {
      kind: 'h2',
      text: "What to pack, by season",
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
      kind: 'h2',
      text: "When to book, by season",
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
    {
      kind: 'h2',
      text: "Hilton Head weather: frequently asked questions",
    },
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
    {
      kind: 'h2',
      text: "Plan your trip around the right window",
    },
    {
      kind: 'p',
      html: "Weather is the cheapest trip-planning lever you can pull. Shifting a family beach week from July to early June cuts villa cost by 30% without changing a single reservation. Moving a golf trip from March to early May trades pollen for warmer water and the same tee-sheet prices. If you want us to pick the window for you, tell us the trip and we'll map it against the next six months of island calendar. The <a href=\"/itinerary\">full itinerary service</a> is $450 flat, and the guide is free either way.",
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
      html: "Hilton Head is the rare American beach destination genuinely built for kids. 12 miles of gentle Atlantic coast, 60 miles of paved bike path, a lighthouse you can climb, and restaurants that don't pretend kids don't exist. Here's the plan we give families.",
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
      html: "A typical family-of-4 summer week through us: 3BR oceanfront villa in Palmetto Dunes, bikes delivered day 1, Captain Mark cruise pre-booked, Skull Creek 5:30 pm reservation for Tuesday, Gregg Russell Thursday night, kayak clinic Saturday morning. Total trip $6,200-8,500 all in. Our fee: $450 flat for the itinerary, or 8% of trip total if you want us to book the villa and handle concierge. Saves ~10 hrs of research and gets you the restaurant tables you can't get yourself.",
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
      html: "Every beach on Hilton Head is public from the high-water mark down. The island has five dedicated public access parks, four gated-community access points, and twelve miles of Atlantic shoreline. The question isn't whether you can get to the beach; it's which beach makes sense for your specific trip. Here is the local-authority breakdown.",
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
      html: "The beach is the reason most people come to Hilton Head, but the wrong address turns a beach-focused week into a drive-to-the-beach week. If you want us to match your group to the right lodging for the beach you actually want, the <a href=\"/itinerary\">$450 itinerary service</a> handles it. For oceanfront villa specifics, see the <a href=\"/hilton-head-oceanfront-villas\">oceanfront villas planner</a>. For timing, the <a href=\"/blog/best-time-to-visit-hilton-head\">weather guide</a> walks through water temperatures month by month.",
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
  postRbcHeritage,
  postWithKids,
  postBestBeaches,
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
