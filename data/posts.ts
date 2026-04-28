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
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 1.5,
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
      html: "The Lowcountry sits on the same latitude as Casablanca. Winters are mild, summers are hot and humid, and the Atlantic moderates both ends. Here's what every month actually looks like on the island. Averages are built from 30-year NOAA data at the nearby Savannah station, adjusted for the 2-3\u00b0F warmer ocean signal Hilton Head reads right on the coast. Want a single page per month? See our <a href=\"/hilton-head-weather\">Hilton Head weather guide by month</a>.",
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
      html: "The classic mistake on a 3-day Hilton Head trip is trying to see all twelve miles of the island in one push. You can't, and forcing it means 45 minutes of driving between every meal. Better plan: pick three districts, anchor each day in one, and let the island do its thing. Here is the itinerary we send to weekenders.",
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
      html: "A week on Hilton Head is longer than most visitors think they need and shorter than they realize once they arrive. Seven days is enough to hit every district, play a real round of golf, do a proper Bluffton night, and still have three rest days. The mistake is trying to program all seven. Here is the plan we send clients.",
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
  updatedAt: '2026-04-24',
  author: 'Hilton Ahead',
  featuredOrder: 3.6,
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
      kind: 'callout',
      label: 'The short answer',
      html: "<strong>Must-play:</strong> Harbour Town. <strong>Best ocean-view round:</strong> RTJ Oceanfront at Palmetto Dunes. <strong>Best value S-tier:</strong> Heron Point by Pete Dye. <strong>Best stay-and-play economics:</strong> Atlantic Dunes. <strong>Best Bluffton splurge:</strong> May River at Palmetto Bluff. <strong>The one to skip:</strong> Shipyard's Clipper nine (always rough), covered below.",
    },
    {
      kind: 'h2',
      text: 'The 2026 Hilton Head golf landscape at a glance',
    },
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
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'Courses worth building a trip around.',
      accent: 'gold',
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
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'Strong rounds any day.',
      accent: 'primary',
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
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: 'Fine when the calendar is tight.',
      accent: 'zinc',
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
    {
      kind: 'h2',
      text: 'Tee-time booking priority, by course',
    },
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
    {
      kind: 'h2',
      text: 'Stay-and-play math, honestly',
    },
    {
      kind: 'p',
      html: "Retail green fees plus separate lodging is almost always worse economics than a stay-and-play package. A three-round Sea Pines stay-and-play (Harbour Town + Heron Point + Atlantic Dunes over 4 nights at the Inn & Club at Harbour Town) runs roughly $299-399/player/night with breakfast, rounds, and villa lodging included. Same three rounds retail plus the same lodging runs $300-450/player/night more. The stay-and-play is simply a better number.",
    },
    {
      kind: 'p',
      html: "The one exception: if your group is 8+ and you want a standalone villa, direct villa booking plus retail green fees can beat the resort package because the villa economics scale. We run the numbers both ways for every group.",
    },
    {
      kind: 'h2',
      text: 'A 4-round, 5-day Hilton Head golf trip',
    },
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
    {
      kind: 'h2',
      text: 'Hilton Head golf courses: frequently asked questions',
    },
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
  relatedNeighborhoods: ['forest-beach', 'shelter-cove'],
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
// H2 STUBS — Brand-visibility plan, Q2 2026 slate.
// Outline-only posts created so the founder can expand each into a full piece.
// All have full metadata, schema-ready category, FAQ block (FAQPage schema),
// and at least one tier block where applicable (ItemList schema).
// ---------------------------------------------------------------------------

const postHarbourTownTeeTime: Post = {
  slug: 'harbour-town-tee-time-guide',
  title: 'How to Get a Harbour Town Tee Time (And What to Do If You Can’t)',
  excerpt:
    'The booking windows, the priority tiers, the workarounds, and the three Hilton Head courses you should book if Harbour Town is sold out.',
  description:
    'Step-by-step guide to booking Harbour Town Golf Links tee times. Resort-guest priority windows, public booking timing, and three excellent backup courses if Harbour Town is full.',
  category: 'Golf',
  readTime: '8 min',
  publishedAt: '2026-05-01',
  author: 'Hilton Ahead',
  featuredOrder: 26,
  relatedNeighborhoods: ['sea-pines'],
  keywords: [
    'Harbour Town tee time',
    'Harbour Town Golf Links booking',
    'Sea Pines tee times',
    'Hilton Head golf booking',
    'RBC Heritage course',
  ],
  body: [
    {
      kind: 'p',
      html: '<strong>Outline — to expand.</strong> Harbour Town tee times move in three tiers: resort guests (120 days out), Sea Pines property owners, and the public (~30 days out). Most visitors find the Resy page empty, panic, and book a worse course. The fix is structural, not luck.',
    },
    {
      kind: 'callout',
      label: 'Quick answer',
      html: 'Book a Sea Pines property through us; we route you through the 120-day resort window. If it’s already too late, the three best backups are Atlantic Dunes (Sea Pines), George Fazio (Palmetto Dunes), and May River (Bluffton).',
    },
    { kind: 'h2', text: 'The three booking tiers' },
    { kind: 'p', html: 'Resort guests, owners, public.' },
    { kind: 'h2', text: 'When to call vs. when to use Resy' },
    { kind: 'p', html: 'Phone is faster for premium tee blocks than the website.' },
    { kind: 'h2', text: 'Three backup courses worth booking' },
    {
      kind: 'tier',
      label: 'If Harbour Town is full',
      subtitle: 'Three courses we book most often as substitutes.',
      accent: 'gold',
      items: [
        {
          name: 'Atlantic Dunes by Davis Love III',
          meta: 'Sea Pines',
          blurb:
            'The newer Sea Pines course. Different feel from Harbour Town — more open, dune-style, less penal off the tee. Resort guest priority same as Harbour Town.',
        },
        {
          name: 'George Fazio at Palmetto Dunes',
          meta: 'Palmetto Dunes',
          blurb:
            'The toughest course on the island. If you want a true championship test and Harbour Town is gone, Fazio is the closer-to-equal substitute, often with more availability.',
        },
        {
          name: 'May River Golf Club',
          meta: 'Bluffton (Palmetto Bluff)',
          blurb:
            '20 minutes off-island. Pete Dye design, Inn at Palmetto Bluff hospitality. The locals’ favorite for a non-Sea Pines round.',
        },
      ],
    },
    { kind: 'h2', text: 'What to do the day-of if your tee time vanishes' },
    { kind: 'p', html: 'Standby protocol; pro shop relationships.' },
    {
      kind: 'faq',
      label: 'Frequently asked',
      items: [
        {
          q: 'How far in advance can I book a Harbour Town tee time?',
          a: 'Sea Pines resort guests can book 120 days out. Outside guests typically book about 30 days out. Premium morning slots in March, April, and October are first to fill.',
        },
        {
          q: 'Do I have to stay at The Inn & Club at Harbour Town to get priority?',
          a: 'No. Any Sea Pines property booked through the resort’s booking system qualifies for the resort-guest priority window. We book four villa buildings on South Beach Lane that all qualify.',
        },
        {
          q: 'What is the dress code at Harbour Town?',
          a: 'Collared shirts, golf slacks or knee-length shorts, soft-spike shoes. No denim or athletic shorts. Strict and enforced.',
        },
      ],
    },
    { kind: 'h2', text: 'Get help booking' },
    {
      kind: 'p',
      html: 'If you’re trying to lock in Harbour Town for a 2026 trip, <a href="/itinerary">tell us about your trip</a> and we’ll route you through the priority window.',
    },
  ],
};

const postHurricaneInsurance: Post = {
  slug: 'hilton-head-hurricane-season-travel-insurance',
  title: 'Hurricane Season Travel Insurance: What Actually Matters for a Hilton Head Trip',
  excerpt:
    'Most travel insurance is theater. Here’s what actually pays out when a hurricane closes Hilton Head, and which two policy types are worth the money.',
  description:
    'Travel insurance for Hilton Head during hurricane season. Cancel-for-any-reason vs. named-storm coverage, when to buy, what villa rental contracts cover, and the three carriers locals trust.',
  category: 'Planning',
  readTime: '7 min',
  publishedAt: '2026-05-08',
  author: 'Hilton Ahead',
  featuredOrder: 27,
  keywords: [
    'Hilton Head travel insurance',
    'hurricane season Hilton Head',
    'cancel for any reason travel insurance',
    'Hilton Head villa rental cancellation',
    'Hilton Head hurricane evacuation',
  ],
  body: [
    {
      kind: 'p',
      html: '<strong>Outline — to expand.</strong> Atlantic hurricane season runs June 1 to November 30. Hilton Head sees a direct or near-miss storm about every three years on average. Most travelers buy the wrong insurance and find out at the worst moment.',
    },
    {
      kind: 'callout',
      label: 'The short version',
      html: 'Standard “travel insurance” covers cancellation for documented illness or named perils. <strong>Cancel-For-Any-Reason (CFAR)</strong> is the only policy that lets you cancel for a forecast — and it must be purchased within 14 to 21 days of the first trip deposit.',
    },
    { kind: 'h2', text: 'What standard policies actually cover' },
    { kind: 'p', html: 'Trip cancellation, interruption, medical, lost baggage.' },
    { kind: 'h2', text: 'Cancel-For-Any-Reason — the only hurricane-relevant coverage' },
    { kind: 'p', html: 'Why CFAR exists; cost premium (~40% over base); 14-day buying window.' },
    { kind: 'h2', text: 'What villa rental contracts already cover' },
    { kind: 'p', html: 'Most reputable HH villa management companies have a force-majeure clause covering mandatory evacuations; smaller operators often do not.' },
    {
      kind: 'tier',
      label: 'Carriers we’ve seen pay out',
      subtitle: 'Three travel-insurance carriers that have actually delivered for Hilton Head clients.',
      accent: 'gold',
      items: [
        {
          name: 'Travel Guard (AIG)',
          meta: 'Comprehensive + CFAR add-on',
          blurb: 'Largest US travel insurer; CFAR coverage is straightforward and pays in our experience. Buy within 15 days of first deposit.',
        },
        {
          name: 'Allianz',
          meta: 'OneTrip Prime',
          blurb: 'Strong on medical evacuation and trip-interruption. CFAR is available as an upgrade. Reasonable claims process.',
        },
        {
          name: 'Berkshire Hathaway Travel Protection',
          meta: 'ExactCare Value',
          blurb: 'Lower-cost option without CFAR; works for travelers who only need illness/medical coverage and accept hurricane risk.',
        },
      ],
    },
    { kind: 'h2', text: 'When to skip insurance entirely' },
    { kind: 'p', html: 'Spring shoulder, late fall, and February: hurricane risk is functionally zero, and the policy premium often exceeds the deposit at risk.' },
    {
      kind: 'faq',
      label: 'Frequently asked',
      items: [
        {
          q: 'When should I buy travel insurance for a Hilton Head trip?',
          a: 'For Cancel-For-Any-Reason coverage, within 14 to 21 days of your first trip deposit. Standard policies have more flexible windows but still must be in place before any cancellation event begins.',
        },
        {
          q: 'Will my insurance pay out if a hurricane is forecast but doesn’t hit?',
          a: 'Standard policies, no — they require an actual named-storm landfall or mandatory evacuation. CFAR policies, yes — you can cancel for any reason, including a forecast you don’t like, typically for 50 to 75% of trip cost.',
        },
        {
          q: 'Do credit cards cover hurricane cancellations?',
          a: 'Some premium cards (Chase Sapphire Reserve, Amex Platinum) include trip cancellation insurance, but the named-peril triggers are stricter than a standalone policy. Read your card’s benefits guide before relying on it.',
        },
      ],
    },
  ],
};

const postCompassItinerary: Post = {
  slug: 'inside-a-compass-itinerary',
  title: 'What $295 Buys You: Inside a Compass Itinerary',
  excerpt:
    'A walk-through of exactly what arrives in your inbox when you book the $295 Compass plan. The villa shortlist, the reservation list, the neighborhood guide, and the 30 days of email.',
  description:
    'See what’s included in the $295 Compass plan from Hilton Ahead. A real example of the villa shortlist, restaurant + tee-time reservation list, neighborhood PDF, and 60-minute consultation.',
  category: 'Planning',
  readTime: '6 min',
  publishedAt: '2026-05-15',
  author: 'Hilton Ahead',
  featuredOrder: 28,
  keywords: [
    'Hilton Head trip planner',
    'Compass plan Hilton Ahead',
    'Hilton Head travel consultant cost',
    'Hilton Head custom itinerary',
    'Hilton Head trip planning service',
  ],
  body: [
    {
      kind: 'p',
      html: '<strong>Outline — to expand.</strong> Compass is the entry-level Hilton Ahead plan, $295 one-time. It’s designed for first-time visitors who want a focused consult, not a full custom build. Here’s exactly what shows up in your inbox.',
    },
    {
      kind: 'callout',
      label: 'In one paragraph',
      html: 'You get a 60-minute video call, a curated 3-villa shortlist with notes, a restaurant + tee-time reservation list, a neighborhood guide PDF, and 30 days of email follow-up. Designed to save 15 to 20 hours of research and skip the $5,500 villa that should have been a $3,200 villa.',
    },
    { kind: 'h2', text: 'The 60-minute consultation' },
    { kind: 'p', html: 'What we cover; how we run the call.' },
    { kind: 'h2', text: 'The 3-villa shortlist' },
    { kind: 'p', html: 'How we choose; what each note includes.' },
    { kind: 'h2', text: 'The reservation list' },
    { kind: 'p', html: 'Restaurants by neighborhood; tee times if applicable; spa or activity bookings.' },
    { kind: 'h2', text: 'The neighborhood guide PDF' },
    { kind: 'p', html: 'Beach access, parking, the off-the-radar coffee shop, the bike-path map.' },
    { kind: 'h2', text: '30 days of email follow-up' },
    { kind: 'p', html: 'Question windows; how to actually use it.' },
    { kind: 'h2', text: 'When Compass is right — and when to upgrade' },
    {
      kind: 'p',
      html: 'Compass is right for solo, couples, and small-family first trips. Upgrade to <a href="/services">Charter or Heritage</a> if you want full booking handled, ground transport, or trip-week concierge.',
    },
    {
      kind: 'faq',
      label: 'Frequently asked',
      items: [
        {
          q: 'How is Compass different from a free travel agent?',
          a: 'Free agents are paid by the villa companies they book — their incentives skew toward the most commission-friendly properties. We charge a flat fee so the recommendations are aligned to you, not the platforms paying the kickback.',
        },
        {
          q: 'How long does a Compass consultation take from booking to delivery?',
          a: 'Five to seven days from purchase to delivered itinerary. The 60-minute call typically happens in days 1–3, the materials arrive 48–72 hours later, and the email window stays open for 30 days after delivery.',
        },
        {
          q: 'Can I upgrade to Charter after starting with Compass?',
          a: 'Yes. The $295 credits toward a Charter retainer if you upgrade within 30 days of the consultation. Most upgrades happen because the trip got bigger or more groups joined.',
        },
      ],
    },
    {
      kind: 'p',
      html: '<a href="/services#compass">Book Compass →</a>',
    },
  ],
};

const postWeddingVenuesByVibe: Post = {
  slug: 'hilton-head-wedding-venues-by-vibe',
  title: 'Hilton Head Wedding Venues, by Vibe: Lowcountry Elegant vs Beachfront Casual',
  excerpt:
    'Five wedding venue archetypes on Hilton Head Island, from oak-canopied Sea Pines elegance to barefoot Forest Beach. Costs, capacities, and the trade-offs nobody tells you.',
  description:
    'Hilton Head wedding venues organized by atmosphere: Lowcountry elegant, beachfront casual, marina sunset, intimate plantation, and budget-conscious. Capacities, ranges, and locals’ picks.',
  category: 'Planning',
  readTime: '11 min',
  publishedAt: '2026-05-22',
  author: 'Hilton Ahead',
  featuredOrder: 29,
  keywords: [
    'Hilton Head wedding venues',
    'Sea Pines wedding venues',
    'Palmetto Bluff wedding',
    'Hilton Head beach wedding',
    'Hilton Head wedding planner',
  ],
  body: [
    {
      kind: 'p',
      html: '<strong>Outline — to expand.</strong> The right Hilton Head wedding venue is a function of two things you already know: how many people, and what you want guests to feel. We sort by the second one.',
    },
    {
      kind: 'callout',
      label: 'How we group venues',
      html: 'Five archetypes: <strong>Lowcountry elegant</strong> (oak canopies, plantation settings), <strong>beachfront casual</strong> (barefoot, sunset over the Atlantic), <strong>marina sunset</strong> (waterfront docks, Shelter Cove and Harbour Town), <strong>intimate plantation</strong> (under 60 guests, private feel), <strong>budget-conscious</strong> (under $25K all-in, real options).',
    },
    {
      kind: 'tier',
      label: 'Lowcountry Elegant',
      subtitle: 'Oak canopies, ballrooms, plantation grandeur.',
      accent: 'gold',
      items: [
        {
          name: 'The Inn at Palmetto Bluff',
          meta: 'Bluffton · 80–250 guests',
          blurb: 'The flagship Lowcountry venue. May River backdrop, signature oak chapel, full concierge wedding team. Most expensive on this list, by design.',
        },
        {
          name: 'Sea Pines Resort — The Country Club',
          meta: 'Sea Pines · 80–300 guests',
          blurb: 'Renovated ballroom plus oceanfront ceremony lawn. The classic Hilton Head wedding everyone’s seen on Instagram, executed well.',
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Beachfront Casual',
      subtitle: 'Barefoot, sunset, Atlantic backdrop.',
      accent: 'primary',
      items: [
        {
          name: 'Coligny Beach Park (public)',
          meta: 'Forest Beach · up to 100 guests',
          blurb: 'Permitted ceremony only; reception offsite. The most affordable beach option, with full lifeguard amenities and parking nearby.',
        },
        {
          name: 'Sonesta Resort beach lawn',
          meta: 'Shipyard · 60–180 guests',
          blurb: 'Mid-island, refreshed property, oceanfront ceremony lawn plus indoor reception space. A common choice for 100–150 guest weddings.',
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Marina Sunset',
      subtitle: 'Waterfront docks, west-facing, golden-hour ceremonies.',
      accent: 'primary',
      items: [
        {
          name: 'Shelter Cove waterfront pavilion',
          meta: 'Shelter Cove · 40–120 guests',
          blurb: 'Sunset over Broad Creek, four restaurants within a 2-minute walk for rehearsal dinner. Strong choice for 50–100 guest weddings.',
        },
        {
          name: 'Harbour Town — Quarterdeck lawn',
          meta: 'Sea Pines · 40–100 guests',
          blurb: 'Lighthouse backdrop, marina foreground. Iconic. Limited capacity and tightly booked — inquire 12+ months out.',
        },
      ],
    },
    { kind: 'h2', text: 'What you actually pay for' },
    { kind: 'p', html: 'Site fee vs F&B minimum vs full-service planning. The breakdowns differ wildly.' },
    { kind: 'h2', text: 'Wedding-week logistics' },
    { kind: 'p', html: 'Block lodging, vendor coordination, transportation, dietary, kids; we handle these in the Heritage tier.' },
    {
      kind: 'faq',
      label: 'Frequently asked',
      items: [
        {
          q: 'How far in advance should we book a Hilton Head wedding venue?',
          a: 'Twelve to eighteen months for premium venues (Palmetto Bluff, Sea Pines Country Club, Harbour Town). Six to nine months can work for shoulder seasons or smaller venues. Heritage Week (mid-April) is impossible to book inside 18 months.',
        },
        {
          q: 'Can we have a beach ceremony on Hilton Head?',
          a: 'Yes — beachfront permits are issued by the town. Ceremonies only, no reception infrastructure. Some properties (Sonesta, certain Sea Pines villas) have private oceanfront lawns that allow full setups.',
        },
        {
          q: 'What’s the typical all-in cost for a 100-guest Hilton Head wedding?',
          a: 'Lowcountry elegant: $90–150K. Marina sunset: $55–95K. Beachfront casual: $45–80K. Budget-conscious (off-season, all-inclusive resort): $25–35K is achievable.',
        },
      ],
    },
    {
      kind: 'p',
      html: '<a href="/itinerary?tier=heritage">Plan a Hilton Head wedding with us</a>.',
    },
  ],
};

const postPublicBeachAccess: Post = {
  slug: 'hilton-head-public-beach-access-ranked',
  title: 'Every Public Beach Access on Hilton Head, Ranked',
  excerpt:
    'Eight named public beach access points, ranked by parking, restrooms, crowd, and walk-to-sand distance. The two no-go points and the one nobody knows about.',
  description:
    'Ranked guide to every public beach access on Hilton Head Island: Coligny, Driessen, Folly Field, Burkes, Mitchelville, Singleton, Alder Lane, Islanders. Parking, amenities, and which to skip.',
  category: 'Activities',
  readTime: '9 min',
  publishedAt: '2026-05-29',
  author: 'Hilton Ahead',
  featuredOrder: 30,
  keywords: [
    'Hilton Head public beach access',
    'Coligny Beach Park',
    'Driessen Beach Park',
    'Folly Field Beach',
    'Hilton Head free beach parking',
  ],
  body: [
    {
      kind: 'p',
      html: '<strong>Outline — to expand.</strong> Hilton Head has eight named public beach access points. They are not equivalent. Some are full parks with lifeguards and food; some are dead-end roads with five parking spots. Pick wrong and your morning is parking, not beach.',
    },
    {
      kind: 'callout',
      label: 'Quick answer',
      html: 'Coligny for amenities, Driessen for families, Burkes if you want quiet. Avoid Mitchelville on summer weekends — it fills by 9 a.m. and the walk is the longest on the list.',
    },
    {
      kind: 'tier',
      label: 'A-Tier — Full-amenity access',
      subtitle: 'Parks with parking, restrooms, lifeguards, food.',
      accent: 'gold',
      items: [
        {
          name: 'Coligny Beach Park',
          meta: 'Forest Beach',
          blurb: 'The flagship. Free parking lot (fills by 11 a.m. June–August), restrooms, outdoor showers, food, lifeguards, walking-distance restaurants. Best single beach access on the island.',
        },
        {
          name: 'Driessen Beach Park',
          meta: 'Mid-Island / Shipyard',
          blurb: 'Larger lot than Coligny, longer dune-walk to sand, better for families with gear. Pavilions, restrooms, picnic areas. Less crowded than Coligny on weekends.',
        },
        {
          name: 'Folly Field Beach Park',
          meta: 'Mid-Island',
          blurb: 'Smaller lot, fills earlier, but the beach itself is wider and quieter. Rent boards next door at the rental shop.',
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier — Functional access, fewer amenities',
      subtitle: 'Parking + path to sand, but bring your own everything.',
      accent: 'primary',
      items: [
        {
          name: 'Burkes Beach',
          meta: 'Mid-Island',
          blurb: 'Free street parking, no restrooms, short boardwalk. The locals’ quieter pick. Bring your own water and shade.',
        },
        {
          name: 'Singleton Beach',
          meta: 'Mid-Island / Shelter Cove side',
          blurb: 'About 30 free spaces on a dead-end road. Closest public access from Shelter Cove. No amenities at all.',
        },
        {
          name: 'Alder Lane Beach',
          meta: 'Forest Beach (north)',
          blurb: 'Small free lot at the end of Alder Lane. Walking-distance from north Forest Beach condos. Restrooms but no lifeguards.',
        },
      ],
    },
    {
      kind: 'tier',
      label: 'C-Tier — Skip on busy days',
      subtitle: 'Long walks, tiny lots, or far from anything.',
      accent: 'zinc',
      items: [
        {
          name: 'Mitchelville Beach Park',
          meta: 'North End',
          blurb: 'Historic significance (Mitchelville was a Reconstruction-era freedmen’s settlement) but the parking is small and the dune walk is the longest on the island. Skip on summer weekends.',
        },
        {
          name: 'Islanders Beach Park',
          meta: 'Mid-Island',
          blurb: 'Restricted to Hilton Head Island residents with permit. Don’t bother unless you have a friend with a sticker.',
        },
      ],
    },
    { kind: 'h2', text: 'Beach gear logistics' },
    { kind: 'p', html: 'Rentals delivered (Beach Scouts), where to park umbrellas, glass-bottle rules.' },
    { kind: 'h2', text: 'Best access for each kind of trip' },
    { kind: 'p', html: 'First-timers, families, surfers (yes, the south end), couples.' },
    {
      kind: 'faq',
      label: 'Frequently asked',
      items: [
        {
          q: 'Is parking at Hilton Head public beaches free?',
          a: 'Yes — all named public beach access lots are free. Sea Pines and Palmetto Dunes charge gate fees ($9 and $0 respectively for guests of certain properties), but the public access points outside those plantations don’t charge for parking.',
        },
        {
          q: 'When do public beach lots fill up in summer?',
          a: 'Coligny fills by 10–11 a.m. on summer weekends, by 12 p.m. on weekdays. Driessen and Folly Field fill 30–60 minutes after that. Burkes and Alder Lane have rolling turnover; you can usually find a spot.',
        },
        {
          q: 'Can I drink alcohol on Hilton Head public beaches?',
          a: 'Glass containers are prohibited. Alcohol in cans or plastic is permitted on public beaches but not inside Coligny Beach Park itself (private park rules differ from beach rules).',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 31) Hilton Head Airport Guide
// ---------------------------------------------------------------------------

const postAirportGuide: Post = {
  slug: 'hilton-head-airport-guide',
  title: 'Hilton Head Airport vs. Savannah Airport: Which One to Fly Into',
  excerpt:
    'Two airports serve Hilton Head. One is 10 minutes away. The other has every major airline and saves you $300. Here is exactly how to choose.',
  description:
    'Hilton Head Island Airport (HXD) vs. Savannah/Hilton Head International (SAV): flights, drive times, car rentals, and which one locals actually recommend for your trip.',
  category: 'Planning',
  readTime: '7 min',
  publishedAt: '2026-04-27',
  author: 'Hilton Ahead',
  featuredOrder: 31,
  relatedNeighborhoods: [],
  keywords: [
    'hilton head airport',
    'savannah airport to hilton head',
    'fly into hilton head island',
    'hilton head island airport HXD',
    'savannah hilton head international airport SAV',
    'closest airport to hilton head',
    'hilton head airport shuttle',
  ],
  body: [
    {
      kind: 'p',
      html: 'Two airports serve Hilton Head Island. <strong>Hilton Head Island Airport (HXD)</strong> is 10 minutes from Coligny Beach. <strong>Savannah/Hilton Head International Airport (SAV)</strong> is 45 minutes away and has every major airline. The right choice depends on your city, your budget, and your willingness to pay for convenience.',
    },
    {
      kind: 'callout',
      label: 'Bottom line up front',
      html: '<strong>Most travelers should fly into SAV.</strong> More routes, lower fares, all major carriers. HXD is the right call only if you find a direct flight and the fare difference is under $100 per person. We explain both below.',
    },
    {
      kind: 'h2',
      text: 'Hilton Head Island Airport (HXD)',
    },
    {
      kind: 'p',
      html: 'HXD is a small regional airport on the north end of the island, operated by Beaufort County. It handles about 100,000 passengers a year — tiny compared to SAV\'s 3 million. The upsides: <strong>10-minute drive to most of the island</strong>, rarely crowded security, easy parking, and no rental car shuttle (the lot is steps from the terminal).',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Airlines:</strong> American Eagle and United Express offer seasonal service from Charlotte (CLT), Washington Dulles (IAD), and New York (LGA/EWR). Service expands from March through October.',
        '<strong>Fares:</strong> Typically $50–$200 more per person than SAV on the same travel window because of limited competition.',
        '<strong>Rental cars:</strong> Available on-site (Avis, Hertz, National). <strong>Book early</strong> — the lot is small and sells out in peak season.',
        '<strong>Ground transport:</strong> HXD has no Uber/Lyft surge issues. It\'s a short, flat drive to any plantation.',
      ],
    },
    {
      kind: 'h2',
      text: 'Savannah/Hilton Head International Airport (SAV)',
    },
    {
      kind: 'p',
      html: 'SAV sits 40 miles from Hilton Head — a straight, easy drive across US-278. It is the dominant airport for Hilton Head trips: <strong>American, Delta, Southwest, United, JetBlue, and Frontier</strong> all fly here. You will almost always find a cheaper or more convenient flight into SAV than HXD.',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Drive time to Hilton Head:</strong> 40–50 minutes via I-95 N and US-278 E. Toll-free. The route is simple and well-marked.',
        '<strong>Rental cars:</strong> All major carriers. On-site garage. Book at least 4 weeks out for summer; prices triple in June–August.',
        '<strong>Rideshare:</strong> Uber and Lyft operate from SAV. Expect $60–$90 to Hilton Head each way. Not practical for groups vs. a rental.',
        '<strong>Shuttle services:</strong> Several private shuttles run Savannah to HHI: Around Town Tours, Island Shuttle, and Lowcountry Valet. Budget $50–$80 per vehicle for a scheduled pickup.',
      ],
    },
    {
      kind: 'h2',
      text: 'The Drive from SAV to Hilton Head: Step by Step',
    },
    {
      kind: 'ol',
      items: [
        'Exit SAV onto I-95 N (toward Ridgeland). Drive 8 miles.',
        'Take Exit 8 toward Hilton Head Island / Bluffton.',
        'Merge onto US-278 E. You\'ll pass through Bluffton — keep going east.',
        'Cross the James F. Bryan bridge onto Hilton Head Island. You are now on the island.',
        'US-278 becomes William Hilton Parkway. Stay on it to reach most plantations and hotels.',
      ],
    },
    {
      kind: 'h2',
      text: 'Other Airports Worth Considering',
    },
    {
      kind: 'table',
      caption: 'Airport options for Hilton Head travel',
      headers: ['Airport', 'Code', 'Drive Time', 'Best for'],
      rows: [
        ['Hilton Head Island Airport', 'HXD', '10–15 min', 'Convenience, seasonal direct flights from CLT/IAD/LGA'],
        ['Savannah/Hilton Head Intl', 'SAV', '40–50 min', 'Best fares, all major airlines, most routes'],
        ['Charleston International', 'CHS', '2 hr', 'Overflow option when SAV fares are high or sold out'],
        ['Jacksonville International', 'JAX', '2.5 hr', 'Southern FL travelers, sometimes cheaper on Southwest'],
      ],
    },
    {
      kind: 'h2',
      text: 'Which Airport Should You Actually Use?',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Use HXD if:</strong> You find a direct flight from Charlotte, DC, or New York, and the fare premium is under $100/person. The 35-minute time savings adds up when you have 5+ people.',
        '<strong>Use SAV if:</strong> You are flying from anywhere in the Midwest, Texas, Florida, or the West Coast. The route options and fare competition are simply better.',
        '<strong>Use CHS if:</strong> SAV fares are spiked (Heritage Week, Memorial Day, July 4th) and Charleston has a lower price. Two hours is a manageable drive.',
      ],
    },
    {
      kind: 'h2',
      text: 'Car Rentals: The One Thing You Must Not Overlook',
    },
    {
      kind: 'p',
      html: 'You need a car on Hilton Head Island. Uber and Lyft exist but are unreliable at peak hours (Friday evening arrivals, Saturday night restaurant rush), and wait times can hit 30–45 minutes in peak season. There is no public transit on the island.',
    },
    {
      kind: 'p',
      html: 'Book your rental car at the same time you book your flight — particularly for SAV in summer. The on-airport inventory sells out. Off-airport alternatives (Enterprise on William Hilton Parkway) are available but require a separate pickup.',
    },
    {
      kind: 'faq',
      label: 'Airport FAQ',
      items: [
        {
          q: 'How far is Savannah Airport from Hilton Head?',
          a: 'About 40 miles via I-95 N and US-278 E. Drive time is 40–50 minutes with normal traffic. Friday afternoon arrivals can run 60 minutes through Bluffton.',
        },
        {
          q: 'Does Hilton Head Island Airport have direct flights?',
          a: 'Yes, seasonal direct service from Charlotte (CLT), Washington Dulles (IAD), and New York (LGA/EWR) via American Eagle and United Express. Service runs primarily March through October.',
        },
        {
          q: 'Is there a shuttle from Savannah Airport to Hilton Head?',
          a: 'Yes. Around Town Tours, Island Shuttle, and several other operators run scheduled service. Expect $50–$80 one-way per vehicle. Book in advance — summer demand is high.',
        },
        {
          q: 'Can I take an Uber from Savannah Airport to Hilton Head?',
          a: 'Technically yes, but expect $70–$95 each way and limited availability. For groups of 3+, a rental car is cheaper over a 5+ day trip.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 32) How to Get to Hilton Head Island
// ---------------------------------------------------------------------------

const postGettingToHHI: Post = {
  slug: 'how-to-get-to-hilton-head-island',
  title: 'How to Get to Hilton Head Island: Driving, Flying, and Everything In Between',
  excerpt:
    'One bridge connects Hilton Head to the mainland. Here is how to get there from anywhere — drive routes, airport options, rental car tips, and what to do once you are over the bridge.',
  description:
    'Complete guide to getting to Hilton Head Island: closest airports (SAV vs HXD), driving directions from Atlanta, Charlotte, and Columbia, car rental tips, and what to do first after crossing the bridge.',
  category: 'Planning',
  readTime: '8 min',
  publishedAt: '2026-04-27',
  author: 'Hilton Ahead',
  featuredOrder: 32,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach'],
  keywords: [
    'how to get to hilton head island',
    'driving to hilton head',
    'hilton head directions',
    'hilton head bridge',
    'hilton head from charlotte drive',
    'hilton head from atlanta',
    'hilton head island transportation',
    'getting around hilton head island',
  ],
  body: [
    {
      kind: 'p',
      html: 'Hilton Head Island sits on the South Carolina coast, connected to the mainland by a single causeway. Once you cross the James F. Bryan bridge over Skull Creek, you are on the island — and the rules change: no chains, no billboards, slower speeds, and a culture that actively works to keep tourists from feeling like they\'re in a tourist trap.',
    },
    {
      kind: 'callout',
      label: 'The one fact to know',
      html: '<strong>You will need a car.</strong> There is no train, no ferry, no meaningful bus service to or on Hilton Head Island. Every trip starts with either driving or renting a vehicle at the closest airport (SAV, 40 minutes away).',
    },
    {
      kind: 'h2',
      text: 'Flying In',
    },
    {
      kind: 'p',
      html: 'Two airports serve the island. <strong>Savannah/Hilton Head International (SAV)</strong> is the practical choice for most travelers — 40 miles away, served by all major carriers. <strong>Hilton Head Island Airport (HXD)</strong> is 10 minutes from Coligny but has limited seasonal service from a handful of cities. See our full <a href="/blog/hilton-head-airport-guide">airport comparison guide</a> for the complete breakdown.',
    },
    {
      kind: 'h2',
      text: 'Driving to Hilton Head: The Routes That Matter',
    },
    {
      kind: 'p',
      html: 'Every road onto Hilton Head Island ends the same way: <strong>US-278 East across the bridge</strong>. The only variables are how you reach US-278. Here are the three routes we actually use with clients.',
    },
    {
      kind: 'h3',
      text: 'From Charlotte, NC (4 to 4.5 hours)',
    },
    {
      kind: 'ol',
      items: [
        'I-77 S from Charlotte to I-26 E toward Columbia — about 90 minutes',
        'I-26 E through Columbia (good gas/coffee stop at the halfway point)',
        'I-95 S at the Santee junction — about 30 minutes past Columbia',
        'Exit 8 onto US-278 E toward Bluffton and Hilton Head — 30 more minutes',
        'Cross the Bryan bridge. You are on the island.',
      ],
    },
    {
      kind: 'h3',
      text: 'From Atlanta, GA (4 to 4.5 hours)',
    },
    {
      kind: 'ol',
      items: [
        'I-75 S from Atlanta through Macon — about 90 minutes',
        'I-16 E toward Savannah — 90 flat miles, easy highway',
        'I-95 N just outside Savannah — 20 miles north',
        'Exit 8 onto US-278 E — Hilton Head is 30 minutes east',
        '<strong>Optional:</strong> Stop in Savannah for 2 hours before finishing the drive. River Street, brunch, 45-minute drive to the island afterward.',
      ],
    },
    {
      kind: 'h3',
      text: 'From Columbia, SC (2 hours)',
    },
    {
      kind: 'ol',
      items: [
        'I-26 E from Columbia toward Charleston — about 60 minutes',
        'Exit onto I-95 S at the junction near Hardeeville',
        'Exit 8 onto US-278 E — 30 minutes to the island',
      ],
    },
    {
      kind: 'h2',
      text: 'Bluffton: The Last Town Before the Bridge',
    },
    {
      kind: 'p',
      html: 'US-278 passes through Bluffton before reaching the island. <strong>Old Town Bluffton</strong> is worth a 30-minute stop on the way in: walkable streets, good coffee, excellent BBQ at Smoke on the Water, and a stretch of historic Lowcountry architecture along the May River. Most people skip it on arrival day. The ones who don\'t are glad they stopped.',
    },
    {
      kind: 'h2',
      text: 'Crossing the Bridge and Arriving on Island',
    },
    {
      kind: 'p',
      html: 'The James F. Bryan bridge is free in both directions. Once you cross, US-278 becomes <strong>William Hilton Parkway</strong> — the island\'s main east-west artery. The speed limit drops. Traffic circles (roundabouts) replace most intersections. GPS works fine here, but first-timers sometimes miss that many of the island\'s best addresses are inside <strong>gated plantation communities</strong> (Sea Pines, Palmetto Dunes, Hilton Head Plantation). You will stop at a guard gate and will need your rental address or reservation confirmation.',
    },
    {
      kind: 'callout',
      label: 'Gated community tip',
      html: 'Print or screenshot your villa confirmation before arrival. Sea Pines charges a $10 per-vehicle fee for day visitors but waives it for guests staying inside the plantation. Have your property address ready at the gate.',
    },
    {
      kind: 'h2',
      text: 'Getting Around Once You Are There',
    },
    {
      kind: 'p',
      html: 'The island is 12 miles long and 5 miles wide. Everything worth doing is reachable by car in under 20 minutes. The bike path network (more than 60 miles of paved trails) means you can leave the car for anything inside a plantation or along the main corridors — but the car stays essential for restaurant runs and cross-island moves.',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Bike rentals:</strong> Available inside most plantations and near Coligny. Bikes make sense for flat, local errands — Sea Pines to Harbour Town, Forest Beach to Coligny.',
        '<strong>Rideshare:</strong> Uber and Lyft exist but availability is spotty on Friday nights and during events. Do not plan a dinner reservation around a rideshare pickup.',
        '<strong>Golf carts:</strong> Legal on some roads and allowed inside all plantations. If your villa comes with a golf cart, use it — it is the best way to move around Sea Pines and Palmetto Dunes.',
      ],
    },
    {
      kind: 'faq',
      label: 'Navigation FAQ',
      items: [
        {
          q: 'Is there a toll to get onto Hilton Head Island?',
          a: 'No. The causeway and bridge are toll-free in both directions.',
        },
        {
          q: 'Do I need a car on Hilton Head Island?',
          a: 'Almost always yes. The island has no public transit, and rideshare availability is unreliable during peak hours and events. The one exception: if you are staying in a walkable spot near Coligny and your entire trip stays in the Forest Beach/Coligny corridor.',
        },
        {
          q: 'How do I get into a gated plantation like Sea Pines?',
          a: 'Tell the gate guard the address where you are staying. Guests are waved through. Day visitors pay a $10 per-vehicle access fee (Sea Pines charges this; Palmetto Dunes does not).',
        },
        {
          q: 'What is the fastest route from Savannah to Hilton Head?',
          a: 'I-95 N to Exit 8, then US-278 E straight to the island. About 40 minutes from the SAV airport terminal. No tolls.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 33) Hilton Head Weather & Packing Guide
// ---------------------------------------------------------------------------

const postWeatherPackingGuide: Post = {
  slug: 'hilton-head-weather-packing-guide',
  title: 'Hilton Head Weather & Packing Guide: What to Bring for Every Month',
  excerpt:
    'Hilton Head runs hot from May through October and mild the rest of the year. Here is what the weather actually feels like — and exactly what to pack for your trip.',
  description:
    'Hilton Head Island weather by season: temperatures, humidity, rain, hurricane risk, and month-by-month packing lists. What locals actually bring versus what tourists over-pack.',
  category: 'Planning',
  readTime: '9 min',
  publishedAt: '2026-04-27',
  author: 'Hilton Ahead',
  featuredOrder: 33,
  relatedNeighborhoods: [],
  keywords: [
    'hilton head weather',
    'hilton head packing list',
    'what to pack for hilton head',
    'hilton head weather by month',
    'hilton head island temperature',
    'hilton head humidity',
    'hilton head hurricane season tips',
    'hilton head april weather',
    'hilton head june weather',
  ],
  body: [
    {
      kind: 'p',
      html: 'Hilton Head sits at 32° North latitude — the same band as Casablanca and Savannah. The climate is subtropical: long, hot, humid summers, a legitimately pleasant spring and fall, and mild winters that are cooler than most visitors expect. If you are packing for a Hilton Head trip, the two things that catch people off guard are <strong>how oppressive the humidity gets in July and August</strong> and <strong>how cool evenings can run in April and October</strong>.',
    },
    {
      kind: 'h2',
      text: 'Season-by-Season Weather Overview',
    },
    {
      kind: 'table',
      caption: 'Hilton Head monthly weather at a glance',
      headers: ['Month', 'High (°F)', 'Low (°F)', 'Ocean Temp', 'Rain Risk', 'Crowd Level'],
      rows: [
        ['January', '60°', '40°', '55°', 'Low', 'Very Low'],
        ['February', '63°', '42°', '56°', 'Low', 'Very Low'],
        ['March', '69°', '49°', '59°', 'Moderate', 'Low'],
        ['April', '76°', '56°', '65°', 'Moderate', 'Medium (Heritage Week)'],
        ['May', '83°', '63°', '72°', 'Moderate', 'Medium'],
        ['June', '89°', '70°', '79°', 'High (afternoon storms)', 'High'],
        ['July', '92°', '74°', '83°', 'High (daily storms)', 'Peak'],
        ['August', '91°', '74°', '84°', 'High (daily storms)', 'Peak'],
        ['September', '86°', '69°', '81°', 'High (hurricane risk)', 'Medium'],
        ['October', '77°', '58°', '74°', 'Moderate', 'Medium'],
        ['November', '69°', '50°', '65°', 'Low', 'Low'],
        ['December', '62°', '43°', '57°', 'Low', 'Very Low'],
      ],
    },
    {
      kind: 'h2',
      text: 'Spring (March – May): The Sweet Spot',
    },
    {
      kind: 'p',
      html: 'Spring is when locals and repeat visitors book their trips. Temperatures are warm enough for the beach by May (ocean hits 70°+ by late April), crowds are manageable, and the island is green from recent rain. April brings the <strong>RBC Heritage PGA Tour event</strong> at Harbour Town — book well in advance that week. May is our personal favorite month: 83° highs, empty beaches at sunrise, and restaurants that still have tables.',
    },
    {
      kind: 'h3',
      text: 'Spring Packing List',
    },
    {
      kind: 'ul',
      items: [
        'Light layers for evenings (a zip fleece or thin jacket — you will need it after sunset in March and April)',
        'Swimwear (ocean is cool in March, comfortable by May)',
        'Comfortable walking shoes for Harbour Town and Bluffton',
        'Light rain jacket — spring fronts bring short, heavy showers',
        'Golf attire if applicable (Heritage week dress code at Harbour Town)',
        'Sunscreen SPF 50+: UV index climbs fast even in mild weather',
      ],
    },
    {
      kind: 'h2',
      text: 'Summer (June – August): Hot, Humid, and Worth It',
    },
    {
      kind: 'p',
      html: 'Summer on Hilton Head is tropical. Highs in the low 90s, humidity that makes 90° feel like 100°, and afternoon thunderstorms that roll in almost every day between 2 and 5 p.m. The pattern is predictable: <strong>mornings are clear and beautiful</strong>, early afternoons get heavy, storms roll through, evenings clear out again. Beach activities front-load to 8 a.m.–noon; restaurants and marina activities pick up at 6 p.m. The ocean is bathwater warm and the sea oats are at their peak.',
    },
    {
      kind: 'h3',
      text: 'Summer Packing List',
    },
    {
      kind: 'ul',
      items: [
        'Lightweight, breathable fabrics (linen, moisture-wicking athletic wear)',
        'Rash guards for kids and adults — sun exposure is intense, and a rash guard is more practical than constant reapplication',
        'Reef-safe SPF 50+ sunscreen in quantity: you will use it',
        'Water shoes (beach entrances have shells and occasional jellyfish)',
        'Compact umbrella or small packable rain poncho for afternoon storms',
        'Insect repellent: marshside dining and evening walks attract no-see-ums after rain',
        'Light dress or resort-casual outfit for dinner (most restaurants are smart casual)',
      ],
    },
    {
      kind: 'callout',
      label: 'Heat management tip',
      html: 'Plan active beach time before noon. The heat index peaks 1–4 p.m. and afternoon storms are almost daily in July. The real golden hours are <strong>7–10 a.m.</strong> (empty beach, low sun angle) and <strong>6–8 p.m.</strong> (sunset on the west side of the island or Harbour Town).',
    },
    {
      kind: 'h2',
      text: 'Fall (September – November): Warm and Quiet',
    },
    {
      kind: 'p',
      html: 'September is the second half of summer — still hot, ocean at its warmest, but crowds thinning after Labor Day. October is underrated: 77° highs, 74° ocean temps, no crowds, and restaurants returning to their best form after peak-season exhaustion. The catch: <strong>September sits squarely in hurricane season</strong>. We recommend <a href="/blog/hilton-head-hurricane-season-travel-insurance">travel insurance with named-storm coverage</a> for any September trip.',
    },
    {
      kind: 'h3',
      text: 'Fall Packing List',
    },
    {
      kind: 'ul',
      items: [
        'Swimwear still essential through October — ocean stays warm',
        'Light jacket or fleece for November evenings',
        'Sunscreen still required (UV index stays high through October)',
        'Travel insurance documentation if traveling in September (hurricane contingency)',
        'Layers: October days are warm, evenings can dip into the high 50s',
      ],
    },
    {
      kind: 'h2',
      text: 'Winter (December – February): The Snowbird Season',
    },
    {
      kind: 'p',
      html: 'Winter on Hilton Head is mild compared to most of the country — highs in the low 60s, lows in the 40s, very little rain, zero crowds. It is not a beach-swimming month, but it is excellent for golf, long bike rides, oyster roasts, and exploring Bluffton at a pace impossible in summer. See our full <a href="/blog/hilton-head-winter-guide">winter guide</a> for snowbird logistics.',
    },
    {
      kind: 'h3',
      text: 'Winter Packing List',
    },
    {
      kind: 'ul',
      items: [
        'A real jacket: 40° mornings are common in January and February',
        'Layers for afternoons that warm to 60°+',
        'Golf attire (winter golf is the hidden gem of Hilton Head)',
        'Comfortable walking shoes — the island is still walkable and beautiful',
        'No swimwear needed unless you are using a heated resort pool',
      ],
    },
    {
      kind: 'h2',
      text: 'Hurricane Season: What Travelers Actually Need to Know',
    },
    {
      kind: 'p',
      html: 'Hurricane season runs June 1 through November 30, with the statistical peak from mid-August through mid-October. Hilton Head sits on a barrier island — any category 3+ storm tracking inland across the Georgia/Carolina coast will trigger <strong>mandatory evacuation orders</strong>. In practice, direct hits are rare (the island has been under serious hurricane threat perhaps a dozen times in the past 30 years), but the risk is real enough to plan for.',
    },
    {
      kind: 'ul',
      items: [
        'Buy <strong>cancel-for-any-reason (CFAR)</strong> travel insurance if traveling June–October. Standard trip-interruption policies often exclude named storms.',
        'Watch the National Hurricane Center (nhc.noaa.gov) from about 5 days out if you see a system forming in the Atlantic or Gulf.',
        'If an evacuation order is issued, leave early. US-278 to the mainland is one road and traffic backs up badly.',
        'Villa rental contracts typically do not automatically refund for evacuations — your travel insurance should cover the shortfall.',
      ],
    },
    {
      kind: 'faq',
      label: 'Weather FAQ',
      items: [
        {
          q: 'What is the best weather month on Hilton Head?',
          a: 'May and October are the locals\' picks. May brings warm temperatures (low 80s), a swimmable ocean (70°+), light crowds, and no hurricane risk. October is equally pleasant — still warm, ocean at 74°, and the island is almost empty compared to summer.',
        },
        {
          q: 'Does it rain a lot on Hilton Head?',
          a: 'Summer brings daily afternoon thunderstorms — usually 2–5 p.m. They are short (30–60 minutes) and predictable. Plan morning beach time, duck inside for the afternoon storm, and come back out for sunset. Spring and fall have occasional frontal rain. Winter is the driest season.',
        },
        {
          q: 'How bad is the humidity on Hilton Head in summer?',
          a: 'It is genuinely oppressive from July through mid-August. Heat index regularly hits 100–105°F. Anyone sensitive to heat should either visit in spring/fall or plan to limit outdoor exposure to mornings and evenings in peak summer.',
        },
        {
          q: 'Is Hilton Head good in April?',
          a: 'Yes, with one caveat: book early if traveling during the RBC Heritage tournament (mid-April). Accommodation prices double and the island fills. The week before or after Heritage is excellent — warm, green, and quiet.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 34) First-Timer's Guide to Hilton Head Island
// ---------------------------------------------------------------------------

const postFirstTimerGuide: Post = {
  slug: 'first-time-hilton-head-guide',
  title: 'First-Timer\'s Guide to Hilton Head Island: Everything You Need to Know Before You Go',
  excerpt:
    'The 12 things that will make or break your first Hilton Head trip — which part of the island to base in, how the gated plantation system works, and what the locals know that the reviews do not say.',
  description:
    'Complete first-timer\'s guide to Hilton Head Island, SC. Where to stay, how the plantations work, what to do first, best beaches, dining picks, and the seven mistakes first-time visitors make.',
  category: 'Planning',
  readTime: '10 min',
  publishedAt: '2026-04-27',
  author: 'Hilton Ahead',
  featuredOrder: 34,
  relatedNeighborhoods: ['sea-pines', 'palmetto-dunes', 'forest-beach', 'shelter-cove'],
  keywords: [
    'first time hilton head',
    'hilton head island guide',
    'hilton head tips for first timers',
    'what to know before going to hilton head',
    'hilton head vacation guide',
    'hilton head island what to do',
    'hilton head island overview',
    'hilton head beginner guide',
  ],
  body: [
    {
      kind: 'p',
      html: 'Hilton Head Island is 12 miles long and 5 miles wide, connected to the South Carolina mainland by a single two-lane causeway. It has 12 miles of beach, 24 golf courses, more than 200 miles of bike paths, and a land-use code that bans chains, billboard signs, and anything that would disrupt the oak canopy. First-timers are often surprised by how <em>quiet</em> it feels — no neon, no strip malls, no Boardwalk.',
    },
    {
      kind: 'callout',
      label: 'The most important thing to understand first',
      html: 'Hilton Head is organized into <strong>gated plantation communities</strong>. Most of the island\'s best beaches, golf courses, and rental villas are inside one of these gates. Where you stay determines what is walkable, bikeable, and driveable — so choosing your neighborhood is the most important planning decision you will make.',
    },
    {
      kind: 'h2',
      text: 'The Neighborhoods (Choose Wisely)',
    },
    {
      kind: 'p',
      html: 'There are four main areas first-timers should understand. Read the full comparison in our <a href="/blog/sea-pines-vs-palmetto-dunes">Sea Pines vs. Palmetto Dunes guide</a>, but here is the short version:',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Sea Pines (South End):</strong> The most prestigious address. Home to Harbour Town, the lighthouse, and the Heritage golf course. Best for: couples, golfers, and anyone who wants to bike everywhere. Book 6+ months out for summer.',
        '<strong>Palmetto Dunes (Mid-island):</strong> Three golf courses, 11 miles of lagoons, and the Omni resort. Best for: families, groups, and anyone who wants a resort experience with a room service option.',
        '<strong>Forest Beach / Coligny (Mid-south):</strong> The only walkable, ungated part of the island. Coligny Plaza shopping, the most casual dining strip, and budget-friendlier rentals. Best for: first-timers who want to ditch the car occasionally.',
        '<strong>Shelter Cove (Mid-island):</strong> Marina district, live music at night, date-night restaurants. Best for: couples who want waterfront energy rather than pure beach.',
      ],
    },
    {
      kind: 'h2',
      text: 'The Plantation System (What the Gate Actually Means)',
    },
    {
      kind: 'p',
      html: 'Every gated plantation has a security checkpoint. As a guest, you drive up, give the gate guard the address where you are staying, and you are waved through. There is no hassle — it is designed to be easy for guests and to keep out day-tripper traffic. <strong>Sea Pines charges a $10 per-vehicle day fee for non-guests</strong>; all other plantations are free to enter as a guest.',
    },
    {
      kind: 'p',
      html: 'Some plantations also operate their own beach access, pool clubs, and golf courses that are exclusive to guests and property owners. This is what makes a Sea Pines villa so different from a Forest Beach rental — the villa comes with access to the plantation\'s private amenities.',
    },
    {
      kind: 'h2',
      text: 'Five Things to Do Your First 48 Hours',
    },
    {
      kind: 'ol',
      items: [
        '<strong>Sunrise on the beach.</strong> Any beach. Hilton Head faces east, which means the Atlantic sunrise is directly in front of you. Set an alarm. You will not regret it.',
        '<strong>Harbour Town at golden hour.</strong> The marina, the lighthouse, the candy-striped lighthouse reflection on the water. Go between 5 and 7 p.m. Get a drink at the Quarterdeck and sit outside.',
        '<strong>Bike the Sea Pines perimeter trail.</strong> Even if you are not staying in Sea Pines, a day pass gets you in. The south-end loop from Harbour Town to South Beach is 5 miles of flat, shaded trail through maritime forest.',
        '<strong>Oysters at Skull Creek.</strong> Skull Creek Boathouse or Hudson\'s on the Docks. Wednesday through Sunday, raw bar open, sunset table, local oysters. Book a table; do not show up and hope.',
        '<strong>Bluffton day trip.</strong> Old Town Bluffton is 20 minutes off-island and looks nothing like Hilton Head. May River waterfront, artisan shops, excellent barbecue. Go on a weekday morning when it is quiet.',
      ],
    },
    {
      kind: 'h2',
      text: 'The Seven Mistakes First-Timers Make',
    },
    {
      kind: 'ul',
      items: [
        '<strong>Booking without knowing which plantation they are in.</strong> "Hilton Head oceanfront villa" covers a 12-mile range of addresses. Know whether you are in Sea Pines, Palmetto Dunes, or Forest Beach before you confirm.',
        '<strong>Not renting a car.</strong> Uber/Lyft exist but are unreliable at peak hours. You need a car.',
        '<strong>Planning outdoor activities during the 2–5 p.m. window in summer.</strong> That is the daily storm window. Stay inside or book it for morning.',
        '<strong>Skipping the bike trails.</strong> More than 60 miles of paved paths. The rental bikes at the plantation offices are usually cheaper than the storefronts on the main road.',
        '<strong>Eating only at the resort.</strong> The best food is not at the resort restaurants. Skull Creek Boathouse, Poseidon, and Salty Dog Cafe near South Beach are the dinners your trip will be remembered by.',
        '<strong>Going to Coligny Beach mid-afternoon in July.</strong> It is packed wall to wall. Go to any plantation beach access — they are quieter, cleaner, and the water is the same ocean.',
        '<strong>Not booking restaurants in advance.</strong> The top tables (Hudson\'s, Poseidon, Harbourmaster Grille) book out 1–2 weeks out in summer. Call when you book your villa.',
      ],
    },
    {
      kind: 'h2',
      text: 'What Hilton Head Is Not',
    },
    {
      kind: 'p',
      html: 'It is not Myrtle Beach. There are no carnival rides, no chain restaurants with animatronic sharks, no beach bars with neon signs. The island actively regulates its aesthetics — signs have to blend with the tree canopy, chain restaurants cannot operate within a plantation gate, and the speed limit is 35 mph across most of the island.',
    },
    {
      kind: 'p',
      html: 'That is the point. Hilton Head is a resort island that has been <em>deliberately</em> kept quiet. If you are looking for nightlife, you will find it at Shelter Cove on weekends. If you are looking for Daytona, you are in the wrong place.',
    },
    {
      kind: 'h2',
      text: 'Should You Hire a Local Planner?',
    },
    {
      kind: 'p',
      html: 'That depends on your group and budget. The island is easy to navigate independently if you do the research. Where local knowledge makes the biggest difference: <strong>choosing the right villa building</strong> (not all "oceanfront" properties are equal — some have a view, some face a parking lot), <strong>getting restaurant reservations the hotels can\'t get you</strong>, and <strong>knowing which activities are worth the money and which are tourist traps</strong>.',
    },
    {
      kind: 'p',
      html: 'Our <a href="/services">planning services</a> start at $295 for a 30-minute discovery call plus a written itinerary. If this is your first trip and you want it to go right, that\'s the fastest way to compress two years of local knowledge into your specific dates.',
    },
    {
      kind: 'faq',
      label: 'First-Timer FAQ',
      items: [
        {
          q: 'How many days do you need on Hilton Head?',
          a: 'Three to four days is the minimum to feel the island properly. A week gives you enough time to slow down, explore both ends, do a Bluffton day trip, and eat your way through the best restaurants. We do not recommend two-night trips — the drive time each way makes it feel rushed.',
        },
        {
          q: 'Is Hilton Head family-friendly?',
          a: 'Very. It is one of the better family beach destinations in the Southeast — flat, calm water on the south end, excellent bike trails, dolphin tours, and enough kid-friendly activities to fill a week without resorting to chain restaurants or water parks.',
        },
        {
          q: 'Is Hilton Head expensive?',
          a: 'Peak summer (July 4th through Labor Day) is genuinely expensive — oceanfront villa rates run $5,000–$15,000 per week. Spring and fall are significantly cheaper. Dining ranges from casual (Fish Camp at $25/person) to splurge (Poseidon at $80+/person). Budget realistically for car rental and villa access fees.',
        },
        {
          q: 'What is Hilton Head known for?',
          a: 'Golf (24 courses including the Heritage PGA Tour course at Harbour Town), beaches (12 miles, some of the widest on the East Coast), bike trails (60+ miles of paved paths), and a low-key, anti-commercial aesthetic that keeps chains and billboards off the island.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 35) Hilton Head nightlife & bar scene 2026
// ---------------------------------------------------------------------------

const postNightlifeGuide: Post = {
  slug: 'hilton-head-nightlife-bars-2026',
  title: 'Hilton Head Nightlife & Bars 2026: Where Locals Actually Go at Night',
  excerpt:
    "Sunset docks, live jazz, craft breweries in Bluffton, and the one beach bar that never closes before midnight. The honest guide to drinking and staying out on Hilton Head.",
  description:
    "The complete 2026 guide to Hilton Head nightlife — sunset bars, live music venues, beach bars, rooftop cocktails, craft breweries, and what to skip. Written by a local, not a listicle farm.",
  category: 'Dining',
  readTime: '9 min',
  publishedAt: '2026-04-28',
  author: 'Hilton Ahead',
  featuredOrder: 35,
  relatedNeighborhoods: ['shelter-cove', 'sea-pines', 'forest-beach'],
  keywords: [
    'hilton head nightlife',
    'hilton head bars',
    'bars on hilton head island',
    'hilton head bar scene',
    'hilton head nightlife 2026',
    'hilton head live music',
    'hilton head beach bars',
    'best bars hilton head',
    'skull creek boathouse bar',
    'salty dog cafe bar',
    'hilton head craft beer',
    'bluffton bars',
    'hilton head happy hour',
    'hilton head rooftop bar',
    'late night hilton head',
  ],
  body: [
    {
      kind: 'p',
      html: "Hilton Head's reputation is golf and beach. Its nightlife reputation is \"closes at 9pm.\" Both are partially right and mostly wrong. The island has no club district, no crawl strip, and no place where you stumble from bar to bar until 2am — and locals like it that way. What it does have: a few sunset-dock bars that genuinely compete with anywhere in the South, a live jazz room that books real national acts, a Bluffton craft brewery scene that opened in earnest in 2023–2025, and a handful of spots that stay lively until midnight or later.",
    },
    {
      kind: 'p',
      html: "This guide is organized by what you're actually looking for — sunset views, live music, craft beer, beach scene, late-night options — with a honest tier ranking of every venue worth considering in 2026. The short version: <strong>Skull Creek Boathouse</strong> for sunsets, <strong>The Jazz Corner</strong> for music, <strong>Lot 9 Brewing</strong> in Bluffton for craft beer, <strong>Coconutz</strong> for the beach-bar hang. Everything else is a supporting cast.",
    },
    { kind: 'h2', text: 'The tier rankings' },
    {
      kind: 'p',
      html: "Ranked on three factors: <strong>atmosphere</strong> (does the room or dock actually feel good at night?), <strong>drink quality</strong> (craft cocktails, real wine list, or well-executed beer selection — not just rail liquor and domestic draft), and <strong>staying power</strong> (is it still good at 10pm, or does it empty out when the kitchen closes?).",
    },
    {
      kind: 'tier',
      label: 'S-Tier',
      subtitle: 'The rooms that earn the night',
      accent: 'gold',
      items: [
        {
          name: 'Skull Creek Boathouse',
          meta: 'North End · Waterfront sunset dock bar',
          blurb:
            "The unambiguous answer to \"best bar on Hilton Head.\" A 200-seat waterfront deck on Skull Creek, facing the last ten minutes of Lowcountry sunset every evening. The drink program is serious — local craft on draft, a frozen cocktail rail, and a full raw bar. Wednesday locals nights and weekend live music on the outdoor stage. Book a dock table 48 hours out in summer; walk-in bar seats work if you arrive by 5:30pm.",
        },
        {
          name: 'The Jazz Corner',
          meta: 'Shelter Cove · Live jazz club',
          blurb:
            "The serious answer to live music on Hilton Head. A purpose-built jazz supper club at Shelter Cove with national touring acts Thursday–Saturday and local standouts Sunday–Wednesday. The bar runs craft cocktails and a wine list that matches the room. Tickets sell out for headliner weeks — check the calendar when you book your trip, not when you arrive.",
        },
        {
          name: 'Quarterdeck at Harbour Town',
          meta: 'Sea Pines · Lighthouse waterfront bar',
          blurb:
            "The Harbour Town Lighthouse deck bar — open-air dock seating right on the marina, iconic red-and-white lighthouse backdrop, and a crowd that mixes Sea Pines resort guests with locals who come specifically for the setting. Cocktails are resort-priced and worth it for the view. Live acoustic music most evenings in season. One of the only bars where the \"Instagram vs. reality\" gap closes in reality's favor.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'A-Tier',
      subtitle: 'Reliable nights out',
      accent: 'primary',
      items: [
        {
          name: 'Salty Dog Cafe',
          meta: 'South Beach Marina, Sea Pines · Marina bar & grill',
          blurb:
            "The most famous name on the island, and it mostly lives up to it for atmosphere. The outdoor bar at South Beach Marina feels like Key West lite — string lights, sand underfoot, boat traffic, T-shirt shop next door. Best in the 5–7pm range before the crowds thin out. The drinks are fine, not exceptional. Come for the setting, not the cocktail list.",
        },
        {
          name: 'Big Jim\'s Oyster Bar',
          meta: 'North End · Waterfront oyster bar',
          blurb:
            "Lowcountry casual in the best sense — raw bar, cold local beer, picnic-table seating on the water, and a crowd that ranges from after-work locals to tourists who found it in year three of coming to the island. The oysters are the order. Happy hour runs 4–6pm with $1 off drafts and half-price oyster specials.",
        },
        {
          name: 'Coconutz Sports Bar & Grill',
          meta: 'South End · Beach bar near Coligny',
          blurb:
            "The closest thing to a beach bar that stays open past 11pm on the island. Three bars, a large outdoor patio, live music Thursday–Saturday, and a vibe that skews younger than anywhere else on Hilton Head. Not sophisticated — intentionally not sophisticated. The right call when the group wants to stay out, not wind down.",
        },
        {
          name: 'Skull Creek Dockside',
          meta: 'North End · Dockside tiki bar',
          blurb:
            "The sister property to Skull Creek Boathouse, lighter in execution — a tiki-bar vibe, frozen drinks, and dock seating without the prix fixe expectations. More casual, faster service, better for walk-ins. Good fallback when the Boathouse deck is full.",
        },
        {
          name: 'Hudson\'s Seafood House on the Docks',
          meta: 'North End · Working waterfront bar',
          blurb:
            "A working shrimp dock turned seafood institution. The bar area runs local draft and a respectable bourbon list while shrimp boats unload 20 feet away. Not primarily a nightlife venue, but the sunset timing is reliable and the locals-to-tourists ratio skews local — that's usually a good sign.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'B-Tier',
      subtitle: 'Good for the right night',
      accent: 'zinc',
      items: [
        {
          name: "Reilley's Grill & Bar",
          meta: 'Coligny area · Irish-ish pub',
          blurb:
            "The closest thing to a neighborhood bar on Hilton Head — pool table, flat screens, affordable pours, late kitchen. Not a destination, but the right call when the group wants a low-key Tuesday and everything fancier is booked. Open until midnight Sunday–Thursday, 1am Friday–Saturday.",
        },
        {
          name: 'The Square Onion',
          meta: 'Mid-Island · Casual neighborhood bar',
          blurb:
            "A mid-island standby with a covered patio, live music on weekends, and a menu that runs later than most. The crowd is mixed age. Not a destination on its own but worth knowing when you need somewhere in the middle of the island.",
        },
        {
          name: 'Tiki Hut at Coligny',
          meta: 'Coligny Beach Park · Beachfront bar',
          blurb:
            "Beachfront tiki bar at the main public beach access. Daytime and late-afternoon crowd, not a night venue per se — kitchen closes by 9pm. Good for an afternoon beer watching people play in the ocean. Sunsets face west-ish from this side of the island, so the view is decent but not Skull Creek caliber.",
        },
        {
          name: 'Comedy Magic Cabaret',
          meta: 'Shelter Cove · Show bar',
          blurb:
            "A cocktail-show hybrid — a comedy and magic dinner show that runs Thursday–Saturday nights in the Shelter Cove area. Not a traditional bar, but the right answer for a group that wants something to do after 8pm that isn't just another restaurant. Book in advance; Saturday shows sell out.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'Skip',
      subtitle: 'Popular, but your time is better spent elsewhere',
      accent: 'rose',
      items: [
        {
          name: 'Hotel lobby bars (generic)',
          meta: 'Various resort properties',
          blurb:
            "The bar at the Westin, the bar at the Marriott, the bar at the Sonesta — fine if you're already staying there and want a nightcap, not worth a special trip. Overpriced rail cocktails, generic wine list, a crowd that's all from the same hotel floor. Use any of the A-tier or B-tier spots instead.",
        },
        {
          name: 'The Crazy Crab (bar area only)',
          meta: 'Harbour Town & North End · Seafood tourist institution',
          blurb:
            "Good seafood restaurant, mediocre bar. The bar area is an afterthought — tight, noisy, and serving the queue waiting for tables. The restaurant itself is solid; the bar is not a destination. Go for the crab, not the cocktail.",
        },
      ],
    },
    { kind: 'h2', text: 'The Bluffton craft beer scene' },
    {
      kind: 'p',
      html: "If you have a car and any interest in craft beer, driving the 20 minutes across the bridge to Bluffton is one of the best nightlife decisions you can make on this trip. Three serious taprooms opened 2022–2025, and Old Town Bluffton has genuinely walkable late-night energy that Hilton Head proper doesn't.",
    },
    {
      kind: 'tier',
      label: 'Bluffton Breweries',
      subtitle: 'Worth the bridge',
      accent: 'primary',
      items: [
        {
          name: 'Lot 9 Brewing',
          meta: 'Bluffton · Full-production craft brewery',
          blurb:
            "The anchor of the Bluffton craft beer scene. A 3,000 sq ft taproom with 12–16 taps rotating through lagers, IPAs, sours, and seasonals — all brewed on-site. Large outdoor biergarten, food trucks Thursday–Sunday, and the venue where School Pizza's Detroit-style pop-up appears every other weekend. Closes at 10pm Sun–Thu, 11pm Fri–Sat.",
        },
        {
          name: 'Burnt Church Distillery',
          meta: 'Old Town Bluffton · Craft distillery + cocktail bar',
          blurb:
            "A working distillery on the May River with a cocktail bar serving house-made vodka, gin, and whiskey. The tasting flight is the right intro; the cocktail menu uses house spirits well. Patio seating on the river. Opens at noon daily; closes at 9pm Sun–Thu, 10pm Fri–Sat.",
        },
        {
          name: 'Hilton Head Brewing Co.',
          meta: 'South End, HHI · Brewpub',
          blurb:
            "On-island option for craft beer — a brewpub format with house-brewed lagers and ales plus a full food menu. The tap list rotates seasonally. Good for groups that want craft beer without crossing the bridge. Not as interesting as Lot 9's lineup but convenient.",
        },
      ],
    },
    { kind: 'h2', text: 'Planning your night by intent' },
    {
      kind: 'h3',
      text: 'Best bars for sunset on Hilton Head',
    },
    {
      kind: 'p',
      html: "The island faces east into the Atlantic — actual ocean sunsets don't exist here. The sunset action is on the western marsh and Intracoastal side. <strong>Skull Creek Boathouse</strong> (North End) is the best seat for it; the sun drops behind the marsh grass right off the dock around 8:15pm in July, 6:45pm in November. <strong>Quarterdeck at Harbour Town</strong> (Sea Pines) is close behind — the lighthouse provides foreground. <strong>Hudson's on the Docks</strong> works too, and the shrimp boats are better decoration than a lighthouse.",
    },
    {
      kind: 'h3',
      text: 'Best bars for live music',
    },
    {
      kind: 'p',
      html: "<strong>The Jazz Corner</strong> is the serious answer — real touring acts, Thursday through Saturday. <strong>Skull Creek Boathouse</strong> has outdoor live music on the deck Wednesday and weekends — usually acoustic or small ensemble, good background rather than foreground. <strong>Coconutz</strong> books cover bands Thursday–Saturday that skew classic rock and top 40 — fun if you want dancing, not if you want to hear the music. For the Bluffton side, Lot 9 Brewing brings in live acoustic and Americana acts on weekend evenings.",
    },
    {
      kind: 'h3',
      text: 'Late-night options (open past 11pm)',
    },
    {
      kind: 'p',
      html: "Options narrow past 11pm — this is genuinely a limitation of the island. <strong>Coconutz</strong> is the main answer, running until midnight or 1am. <strong>Reilley's</strong> goes to 1am Friday–Saturday. <strong>Mellow Mushroom</strong> is the late-night kitchen (11pm every day). After midnight, the island is functionally closed. If late-night is essential to your trip, plan your heavy nights early in the week and scale back Thursday–Sunday when reservation crowds thin the bar options.",
    },
    {
      kind: 'h3',
      text: 'Best happy hours',
    },
    {
      kind: 'p',
      html: "Most of the serious bars run 4–6pm specials. <strong>Big Jim's Oyster Bar</strong>: $1 off drafts, half-price oysters. <strong>Skull Creek Boathouse</strong>: discounted dock drinks and raw bar items. <strong>Quarterdeck at Harbour Town</strong>: resort prices drop 20–25% in the happy hour window. <strong>Lot 9 Brewing</strong>: $1 off pints daily 3–5pm. Show up early — summer happy hour crowds form by 4:30pm at any waterfront spot.",
    },
    {
      kind: 'h3',
      text: 'The neighborhood breakdown',
    },
    {
      kind: 'p',
      html: "<strong>North End (Skull Creek area):</strong> best waterfront nightlife — Skull Creek Boathouse, Skull Creek Dockside, Hudson's, Big Jim's. If you care about sunset bars, this is where to be. <strong>Harbour Town / Sea Pines:</strong> Quarterdeck, Salty Dog (South Beach), and the marina ambiance — more polished, better for couples and older crowds. <strong>Coligny / South End:</strong> Coconutz, Tiki Hut, beach-bar energy. Best for groups that want noise and outdoor space. <strong>Shelter Cove:</strong> The Jazz Corner and the Comedy Magic Cabaret — mid-island, easy from any neighborhood, entertainment-focused rather than bar-focused.",
    },
    {
      kind: 'callout',
      label: 'Local insight',
      html: "Wednesday nights at Skull Creek Boathouse are a local institution — midweek crowd, shorter wait for dock tables, and the kitchen is less slammed. The deck empties slightly earlier than weekends, but the sunset is identical. If you're here for a full week, put Wednesday night on the Skull Creek deck and save the weekend slots for Harbour Town or Jazz Corner.",
    },
    { kind: 'h2', text: 'What Hilton Head nightlife is not' },
    {
      kind: 'p',
      html: "There's no club district. No strip with back-to-back bars. No last call at 2am anywhere reputable. Hilton Head controls its commercial character tightly — no chain restaurants inside the gated communities, no illuminated signs, no drive-thru liquor stores. That same restraint applies to nightlife. The result is a bar scene that's nicer than it sounds but smaller than most beach destinations. The upside: you won't end up at a bad bar accidentally because there aren't many bars to end up at. The downside: the options above are basically all of them.",
    },
    {
      kind: 'faq',
      label: 'Nightlife FAQ',
      items: [
        {
          q: 'What is the nightlife like on Hilton Head Island?',
          a: 'Low-key and scenery-driven rather than scene-driven. The island has excellent sunset dock bars (Skull Creek Boathouse, Quarterdeck), a serious live jazz club (The Jazz Corner), and a handful of beach bars and breweries. It is not a party destination — there is no club district or 2am closing time. Most bars close by 11pm, with a few exceptions.',
        },
        {
          q: 'What bars are open late on Hilton Head?',
          a: "Coconutz (closes midnight–1am), Reilley's (closes 1am Friday–Saturday), and Mellow Mushroom (kitchen open until 11pm) are the main late-night options. After midnight, options are functionally zero.",
        },
        {
          q: 'Where is the best sunset bar on Hilton Head?',
          a: "Skull Creek Boathouse on the North End. The deck faces the Intracoastal waterway and the marsh, and the sun drops directly behind it in summer. Arrive by 5:30pm to get a dock table. Quarterdeck at Harbour Town in Sea Pines is a close second, with the lighthouse in the frame.",
        },
        {
          q: 'Is there live music on Hilton Head?',
          a: "Yes. The Jazz Corner at Shelter Cove is the main venue — national touring jazz acts Thursday through Saturday, local acts the rest of the week. Skull Creek Boathouse runs live acoustic music on the deck Wednesday nights and weekends. Coconutz books cover bands Thursday–Saturday.",
        },
        {
          q: 'What are the best bars near Coligny Beach?',
          a: "Coconutz Sports Bar is the most active option near Coligny — beach bar vibe, live music on weekends, open until midnight or later. The Tiki Hut at Coligny Beach Park is good for afternoon drinks but closes early. Reilley's is a short drive and stays open later.",
        },
        {
          q: 'Can I walk to bars from Sea Pines?',
          a: "From Sea Pines proper, the walkable nightlife is the Salty Dog Cafe at South Beach Marina and the Quarterdeck at Harbour Town — both are bikeable (3–5 miles) within the plantation. Skull Creek Boathouse is a 15-minute drive north and worth every minute.",
        },
        {
          q: 'Are there any craft breweries on Hilton Head?',
          a: "Hilton Head Brewing Co. is on the island's South End. The better craft beer options are in Bluffton — Lot 9 Brewing (the strongest tap list), Burnt Church Distillery (cocktails with house-made spirits), and the biweekly School Pizza pop-up at Lot 9. Drive 20 minutes across the bridge for the full Bluffton taproom crawl.",
        },
        {
          q: 'Is the Salty Dog Cafe good for a night out?',
          a: "Good for atmosphere, not for serious drinking. The South Beach Marina setting is genuinely great — string lights, boats, outdoor bar. The drinks are fine but not exceptional, and the area quiets down quickly after the restaurant rush. Come for the 5–7pm golden hour, then move on to Skull Creek or Quarterdeck if you want to stay out.",
        },
        {
          q: 'What is there to do on Hilton Head at night besides bars?',
          a: "The Jazz Corner (live jazz dinner shows), Comedy Magic Cabaret (Shelter Cove, Thursday–Saturday), evening dolphin tours (sunset cruises through most marinas), firefly walks at Sea Pines Forest Preserve (seasonal May–June), and stargazing on the less-lit north-end beaches. The island's low light pollution makes a dark beach at 10pm genuinely beautiful.",
        },
        {
          q: 'What is the bar scene like in Bluffton compared to Hilton Head?',
          a: "Bluffton punches above its size for late-evening options. Old Town Bluffton has walkable blocks with Burnt Church Distillery, Lot 9 Brewing, and a handful of restaurant bars that close 10–11pm. The energy is more local and less resort-polished than Hilton Head. If craft beer or a more neighborhood-bar feel matters, Bluffton is worth the 20-minute drive.",
        },
      ],
    },
    { kind: 'h2', text: 'Build it into your trip' },
    {
      kind: 'p',
      html: "If you're planning a Hilton Head week, the nightlife calendar writes itself: one evening at Skull Creek Boathouse for sunset, one night at The Jazz Corner (book ahead), a Bluffton brewery run one evening, and Coconutz or Reilley's if the group wants to stay out late. That's four nights of actual plans from a 12-mile island. The <a href=\"/itinerary\">itinerary service</a> books the Jazz Corner tickets and Skull Creek reservations when we build your plan — they're both the kind of thing that sells out before you think to check.",
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
  postHarbourTownTeeTime,
  postHurricaneInsurance,
  postCompassItinerary,
  postWeddingVenuesByVibe,
  postPublicBeachAccess,
  postAirportGuide,
  postGettingToHHI,
  postWeatherPackingGuide,
  postFirstTimerGuide,
  postNightlifeGuide,
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
  'hilton-head-airport-guide': {
    posts: ['how-to-get-to-hilton-head-island', 'hilton-head-weekend-getaway', 'hilton-head-3-day-itinerary'],
    industries: ['vacation-rentals'],
  },
  'how-to-get-to-hilton-head-island': {
    posts: ['hilton-head-airport-guide', 'first-time-hilton-head-guide', 'hilton-head-weekend-getaway'],
    industries: ['vacation-rentals'],
  },
  'hilton-head-weather-packing-guide': {
    posts: ['best-time-to-visit-hilton-head', 'hilton-head-hurricane-season-travel-insurance', 'first-time-hilton-head-guide'],
    industries: ['water-activities', 'family-activities'],
  },
  'first-time-hilton-head-guide': {
    posts: ['how-to-get-to-hilton-head-island', 'sea-pines-vs-palmetto-dunes', 'hilton-head-3-day-itinerary'],
    industries: ['vacation-rentals', 'restaurants'],
  },
  'best-pizza-hilton-head-2026': {
    posts: ['best-restaurants-hilton-head-2026', 'forest-beach-guide', 'shelter-cove-guide'],
    industries: ['restaurants'],
  },
  'hilton-head-nightlife-bars-2026': {
    posts: ['best-restaurants-hilton-head-2026', 'shelter-cove-guide', 'sea-pines-guide'],
    industries: ['restaurants'],
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
