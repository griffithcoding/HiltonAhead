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
  body: PostBlock[];
};

// ---------------------------------------------------------------------------
// 1) FLAGSHIP — 2026 exciting new places to stay
// ---------------------------------------------------------------------------

const post2026Stays: Post = {
  slug: '2026-best-places-to-stay-hilton-head',
  title:
    "2026's Most Exciting Places to Stay on Hilton Head — Ranked by a Local",
  excerpt:
    "The newly-renovated resorts, the villa buildings locals actually book, and the one property you should avoid in 2026. An insider's ranking.",
  description:
    'The 15 best places to stay on Hilton Head Island in 2026 — ranked. Newly-renovated resorts, best villa buildings in Sea Pines and Palmetto Dunes, and the properties locals actually recommend.',
  category: 'Stays',
  readTime: '12 min',
  publishedAt: '2026-03-14',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 1,
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
      html: "This is the list we actually send to clients in 2026 — updated after the slate of post-storm renovations, the new Omni refresh, and the quiet disappearance of two rental programs we used to trust. Ranked in four tiers. If a property isn't here, it's not an accident.",
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
          name: 'The Sea Pines Resort — Harbour Town Inn',
          meta: 'Sea Pines · Refreshed 2025',
          blurb:
            "Finally renovated in 2025 after years of being almost-but-not-quite. The rooms now match the location, which has always been the best hotel address on the island — Harbour Town lighthouse out your window, Heritage-caliber golf a walk away. This is our default for couples and golfers who don't want to cook.",
        },
        {
          name: 'Montage Palmetto Bluff (Bluffton)',
          meta: 'Bluffton · 20 min off-island · Consistently elite',
          blurb:
            "Technically not Hilton Head, but we'd be lying if we left it off. The service bar is set here. Use it for anniversaries, proposals, and the one night you want to remember forever. Book the May River Cottages, not the Inn rooms.",
        },
        {
          name: 'Oceanfront villas on South Beach Lane (Sea Pines)',
          meta: 'Sea Pines · Private rentals · 3–6 BR',
          blurb:
            "The quietest stretch of sand in Sea Pines, two minutes from the marina, ten from Harbour Town. We hand-pick four buildings on this lane. Book 6+ months out for June–August; these do not last.",
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
            "Timeshare-adjacent, but don't let that scare you off. Units are spacious, grounds are impeccable, and the beach access is the shortest walk on the island. We book it for families of 4–6 who want space without renting a standalone villa.",
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
            "The location is unbeatable if you want to ditch the car. The rooms are what they are — a 2010-era renovation coasting a little too long. Works for weekend getaways and honest family-on-a-budget trips.",
        },
        {
          name: "Spinnaker Resorts (Egret Point, Waterside)",
          meta: 'Shipyard & Bluffton · Timeshare units rented nightly',
          blurb:
            "Good units, honestly. The catch is the sales pressure if you engage with the front desk — skip the \"welcome briefing\" and you're fine. Strong value for families who want a kitchen.",
        },
        {
          name: 'Inn at Harbour Town — standard rooms (pre-renovation wings)',
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
          name: 'Redacted VRBO program — Forest Beach mid-rise',
          meta: 'Management change Q4 2025',
          blurb:
            "The previous manager sold to a larger operator late last year. Service quality has cratered since — we've pulled four clients out mid-trip. Happy to name it on a planning call; we won't put it in print.",
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
      html: "After years of the lobby feeling like a 2004 time capsule, the Omni Palmetto Dunes finished its common-area overhaul in early 2026. The new pool deck is genuinely the best on the island now — better than Sea Pines — with a swim-up bar that doesn't feel like a compromise. Rooms are phased through 2027, so ask which floor you're on.",
    },
    {
      kind: 'h3',
      text: 'Harbour Town Inn, finally',
    },
    {
      kind: 'p',
      html: "The Sea Pines Resort finally addressed the Harbour Town Inn in 2025. Rooms went from \"oldest hotel product on the island\" to \"quietly the best small hotel we book.\" The location was always there; now the rooms match. Rates jumped 20% to match the quality — it's still worth it.",
    },
    {
      kind: 'h3',
      text: 'Bluffton is the stealth move',
    },
    {
      kind: 'p',
      html: "We're sending more clients to Bluffton this year than ever. Montage Palmetto Bluff aside, the new boutique inventory in Old Town Bluffton — especially around Calhoun Street — offers a quieter, more adult trip at 60% of Sea Pines pricing. The drive onto Hilton Head is 18 minutes. Worth considering for couples and foodie trips.",
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
        "<strong>Summer (June–August):</strong> 5–6 months out for villa inventory, 3–4 months for resorts. If you're reading this in May planning for July, call us immediately.",
        "<strong>Fall golf (September–early November):</strong> 2–3 months out is fine for most resorts, but Harbour Town tee-time blocks lock 4 months ahead.",
        "<strong>Heritage week (RBC Heritage, second week of April):</strong> Rates double. Worth it once in your life, but we'll quietly suggest the week before or after.",
        "<strong>Thanksgiving & Christmas week:</strong> Surprisingly open and surprisingly cheap. The weather is genuinely pleasant (55–65°F). One of the best-value windows on the island.",
        "<strong>Spring break (mid-March to mid-April):</strong> Book in November if you want anything oceanfront.",
      ],
    },
    {
      kind: 'callout',
      label: "When it's worth hiring us",
      html: "If your trip is under $4k total, you don't need a consultant — use this list, book direct, and email us with specific questions. If your trip is $8k+ or involves a group of 8+, we probably save you more than our fee through vendor relationships and rate negotiation. Honest answer every time.",
    },
    {
      kind: 'h2',
      text: 'The one question we get every week',
    },
    {
      kind: 'p',
      html: "\"Should I book direct or through VRBO/Airbnb?\" The answer in 2026: <strong>book direct through the resort for resorts, and through a local rental company for villas — never through VRBO or Airbnb for a Hilton Head villa if you can avoid it.</strong>",
    },
    {
      kind: 'p',
      html: "The big platforms don't vet the on-island service. When the AC breaks at 9pm on a Saturday in July, the listing on VRBO has no meaningful recourse. A local rental company has a tech on-call and a phone number that answers. We'll name the four companies we trust on a planning call.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 2) TIER LIST — Restaurants
// ---------------------------------------------------------------------------

const postRestaurantsRanked: Post = {
  slug: 'hilton-head-restaurants-ranked-2026',
  title: 'Hilton Head Restaurants, Ranked: The 2026 Local Tier List',
  excerpt:
    "Forget the TripAdvisor top 20. These are the restaurants locals actually eat at — ranked S through C with honest reviews and what to order.",
  description:
    "A locally-ranked tier list of the best restaurants on Hilton Head Island in 2026. Where to eat, what to order, and which spots to skip — honest reviews from someone who actually lives here.",
  category: 'Dining',
  readTime: '10 min',
  publishedAt: '2026-02-21',
  updatedAt: '2026-04-10',
  author: 'Hilton Ahead',
  featuredOrder: 2,
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
      html: "This is the tier list we actually keep in our heads when we plan a trip — the same one we'd text a friend. Ranked by the food first, then the experience, then how hard the reservation is. No kickbacks, no sponsored slots.",
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
            "Destination-level Italian that locals defend with religious intensity. The osso buco is a ten-year-consistent order. If the answer is yes to \"can we get Michael Anthony's tonight?\" — cancel your other plans.",
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
            "Marina views, octopus done right, and a staff that will actually describe the fish instead of reading the menu at you. Request a patio table at sunset — it's why you came.",
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
            "The \"shrimp and grits for people who don't know where else to get shrimp and grits.\" It's fine — actually more than fine — but not a destination. Great if you're three blocks away and hungry.",
        },
        {
          name: "Ombra Cucina Italiana",
          meta: "Park Plaza · Italian · $$$",
          blurb:
            "The second-best Italian on the island. Smaller, quieter, easier reservation than Michael Anthony's. Kitchen has range — order the risotto of the day.",
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
          meta: "All resorts · $$$–$$$$",
          blurb:
            "Convenience tax is 40%. Walk to a real restaurant instead. The island is small enough to justify it.",
        },
      ],
    },
    {
      kind: 'h2',
      text: "Reservations — the real game",
    },
    {
      kind: 'p',
      html: "Everything above B-tier requires a reservation in summer. Everything S-tier requires a reservation two weeks ahead in peak weeks. A few specifics:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Skull Creek:</strong> Resy releases at 30 days. Set an alarm. The 6:45–7:15pm window is what you want.",
        "<strong>Red Fish:</strong> Call directly. The host is excellent at finding slots if you're flexible. Thursday and Sunday are easier than Friday/Saturday.",
        "<strong>Michael Anthony's:</strong> 2 weeks out minimum. If it says \"fully booked\" online, call anyway — they hold tables.",
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
      html: "The best lunch values on the island are wildly under-appreciated. Skull Creek's grouper reuben, Hudson's fried shrimp basket, Harbour Town Bakery's ham biscuit — all three are better than 90% of the dinner scene, at a third the price. Budget more for lunch than you think you need to.",
    },
    {
      kind: 'h2',
      text: "What about Bluffton?",
    },
    {
      kind: 'p',
      html: "Short answer: worth the drive, once per trip, for dinner. FARM Bluffton is the obvious move. The Pearl is a quieter alternative. Cottage Café does a perfect casual lunch if you're already over there shopping.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 3) TIER LIST — Things to do
// ---------------------------------------------------------------------------

const postThingsToDoRanked: Post = {
  slug: 'hilton-head-things-to-do-ranked-2026',
  title: "Things to Do on Hilton Head, Ranked: The 2026 Tier List",
  excerpt:
    "The activities worth doing, the activities worth skipping, and the one tourist trap everyone falls for. A local's tier list for 2026.",
  description:
    "Ranked list of the best things to do on Hilton Head Island in 2026 — beaches, boats, bikes, tours, and tourist traps. Honest tiers from a local travel consultant.",
  category: 'Activities',
  readTime: '9 min',
  publishedAt: '2026-01-30',
  updatedAt: '2026-04-15',
  author: 'Hilton Ahead',
  featuredOrder: 3,
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
      html: "The \"Top 10 Things to Do on Hilton Head\" lists are stuffed with filler — they have to fill the list even if #8 is a waste of three hours. This one isn't. If an activity is in C-tier, we'll tell you why.",
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
            "Outside Hilton Head (the local outfitter) runs small-group creek tours. The 7am slot is magical — fog, herons, and zero boat traffic. Skip the bigger operators; they bunch groups of 20.",
        },
        {
          name: 'Sunset sail on a private charter',
          meta: "$500–$1,200 · 2 hours · Calibogue Sound",
          blurb:
            "A splurge that's worth it for couples and groups of 4. We book through two captains we trust. The public sunset cruises feel like a bus; a private sail feels like the Caribbean.",
        },
        {
          name: 'Coastal Discovery Museum',
          meta: "Free · 1–2 hours · Indigo Run",
          blurb:
            "Genuinely interesting for kids 8+. The butterfly garden in summer is underrated. Not a full-day activity, but a solid rainy-afternoon move.",
        },
        {
          name: 'Fishing charter (offshore half-day)',
          meta: "$900–$1,400 · 4–6 hours · 4 person max typical",
          blurb:
            "Worth it for the dads' trip or a father-daughter thing. We work with two captains — both have private docks and actually find fish. The marina-board operators are hit-or-miss.",
        },
        {
          name: 'Pinckney Island National Wildlife Refuge',
          meta: "Free · 2–3 hours · Hike and birding",
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
            "A genuine island institution. Kids love it; adults tolerate it. Worth one night if you have children under 10. Bring chairs — the oak gets crowded.",
        },
        {
          name: 'Harbour Town Lighthouse climb',
          meta: "$5 · 15 min · Spiral staircase, 114 steps",
          blurb:
            "The view is real, the exhibits are dated. Go for the photo at the top, not the museum. Avoid on rainy afternoons — the line is brutal.",
        },
        {
          name: 'Tennis or pickleball clinics (Palmetto Dunes, Sea Pines)',
          meta: "$60–$150/session · 1–2 hours",
          blurb:
            "Palmetto Dunes tennis is legitimately world-class. Sea Pines pickleball has exploded. Book a clinic with a named pro; the rec staff is a mixed bag.",
        },
        {
          name: 'Horseback riding (Lawton Stables, Sea Pines)',
          meta: "$95/person · 1 hour · Ages 8+",
          blurb:
            "Beautiful ride through the Sea Pines forest preserve. Not scenic enough for adults without kids. Kids love it — it's photographable.",
        },
      ],
    },
    {
      kind: 'tier',
      label: 'C-Tier — Skip',
      subtitle: "What you'll be tempted by and shouldn't do.",
      accent: 'rose',
      items: [
        {
          name: 'Pirate-themed dinner cruise',
          meta: "$85/adult · 90 min · Shelter Cove",
          blurb:
            "The boat is fine. The food is not. The entertainment is loud. If you must, do the afternoon sightseeing version — no food, no theater, same boat.",
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
        "<strong>Day 6:</strong> Flex day — fishing charter, pickleball clinic, or pool-and-book day.",
        "<strong>Day 7:</strong> Harbour Town morning, ham biscuit, photo at the lighthouse, then fly home.",
      ],
    },
    {
      kind: 'callout',
      label: "What we actually do for you",
      html: "We pre-book the activities that matter — Captain Mark's dolphin cruise, the 7am kayak slot, the good fishing captain — and leave the flex days flex. Nothing is worse than a five-activity day where the kids melt down by 2pm.",
    },
    {
      kind: 'h2',
      text: "Best time of year, by activity",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Beach:</strong> Late May through early October. Water is swimmable.",
        "<strong>Golf:</strong> March–May and September–November. Perfect weather, course conditions.",
        "<strong>Fishing:</strong> April–June for inshore, August–October for offshore.",
        "<strong>Biking:</strong> Year-round. Shoulder seasons (April, October) are ideal.",
        "<strong>Dolphin cruises:</strong> Year-round. Summer is highest-density; fall trips are quieter and still productive.",
        "<strong>Birding / Pinckney:</strong> October–March. Migration windows are spectacular.",
      ],
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
    "A local's complete guide to Sea Pines Resort on Hilton Head Island — how to pick the right villa area, where to eat, which bike paths to ride, and what the 2026 changes mean for travelers.",
  category: 'Neighborhoods',
  readTime: '11 min',
  publishedAt: '2026-01-15',
  updatedAt: '2026-04-05',
  author: 'Hilton Ahead',
  featuredOrder: 4,
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
      html: "The residential core. Big live oaks, winding roads, older single-family villas. Quiet. The beach access points are unmarked but excellent — Beach Cat 9, 10, and 11 are the locals' favorites. No commercial buildings; you drive to dinner.",
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
      html: "Book here if: you're a golf-first party of 4–6 looking to save 30% vs. oceanfront.",
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
      html: "Sea Pines has a controlled entrance — $9 per car per visit, waived for overnight guests. The one gate backs up in July/August from 10am to 12pm. Enter before 9am or after 1pm if you can.",
    },
    {
      kind: 'p',
      html: "Inside, everything connects by bike path — 17 miles of them. Renting bikes is a near-mandatory move. We use Hilton Head Bicycle (they'll deliver). You can bike from Harbour Town to South Beach in 18 minutes.",
    },
    {
      kind: 'h2',
      text: "What to eat in Sea Pines",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Harbour Town Bakery</strong> — breakfast, $. The ham biscuit, always. Eat outside.",
        "<strong>Quarterdeck</strong> — lunch or dinner, $$$. Marina view, tourist-friendly, predictable menu. Fine for groups.",
        "<strong>CQ's</strong> — dinner, $$$. Restaurant Row-era chophouse feel. Holds up. Reservation required.",
        "<strong>The Salty Dog Café</strong> — lunch, $$. Here for the t-shirts, not the food.",
        "<strong>The Links, an American Grill</strong> — dinner, $$$$. At the Inn & Club at Harbour Town. Quiet upscale. Best for pre-round dinners.",
      ],
    },
    {
      kind: 'callout',
      label: "Where we send clients for dinner",
      html: "Sea Pines has solid in-plantation options but — honestly — the best dinners on the island are outside its gates. Skull Creek, Red Fish, and Michael Anthony's are all 12–18 minutes away. We plan trips where 2 of 7 nights are in-plantation and the rest are island-wide.",
    },
    {
      kind: 'h2',
      text: "Bike paths worth knowing",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Harbour Town to South Beach Marina</strong> — 2.5 miles, one way. The signature ride. Do it at low tide, take the beach path the last half-mile.",
        "<strong>The Forest Preserve loop</strong> — 4 miles. Spanish moss, zero traffic, actually quiet. Enter near Lawton Stables.",
        "<strong>Ocean to Ocean loop</strong> — 6 miles. North beach to south beach via Sea Pines's interior. A half-day ride; pack water.",
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
      html: "Two things changed for 2026 in Sea Pines. First, the Harbour Town Inn renovation finally wrapped — rooms are legitimately good now, rates jumped 20%. Second, the resort rolled out a new villa management portal that lets you pre-book tennis and beach chairs from your phone. Worth 10 minutes of your arrival day.",
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
    "A local's guide to staying in Palmetto Dunes on Hilton Head — golf courses, villa selection, the Omni renovation, restaurants, and what makes it different from Sea Pines.",
  category: 'Neighborhoods',
  readTime: '9 min',
  publishedAt: '2026-02-05',
  updatedAt: '2026-04-08',
  author: 'Hilton Ahead',
  featuredOrder: 5,
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
        "<strong>A world-class tennis center.</strong> Palmetto Dunes' tennis program is rated in the US top 10 for a resort. The pros are actual pros; the court count is the island's largest.",
        "<strong>Three championship golf courses in one property.</strong> Robert Trent Jones, Fazio, and Arthur Hills — all walkable from most villas. The Fazio is the most challenging; the Hills is the most forgiving.",
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
      html: "The flagship hotel. Just finished a lobby and pool-deck renovation in 2026 — genuinely one of the best pool decks on the island now. Room renovations are phased through 2027. Oceanfront rooms first, garden view second, pool view third in priority. If you're booking for 2026, request a floor 4+.",
    },
    {
      kind: 'h3',
      text: 'Marriott Grande Ocean',
    },
    {
      kind: 'p',
      html: "Two-bedroom timeshare-style units, rentable nightly. Best beach-walk distance in Palmetto Dunes (closest of any building). The grounds are meticulously maintained. A staple for families of 4–6 who want space without going full villa.",
    },
    {
      kind: 'h3',
      text: 'Single-family villas',
    },
    {
      kind: 'p',
      html: "The oceanfront villa lanes — Mooring Buoy, Sea Oaks, Shelter Cove Way — are where the serious bookings live. Five-bedroom houses with private pools, steps from the sand. These are rented through the resort's villa program and a small group of independent managers. Quality is high but variable; we stick to four buildings we've personally vetted.",
    },
    {
      kind: 'h3',
      text: 'Budget villa areas',
    },
    {
      kind: 'p',
      html: "Interior Palmetto Dunes — Queens Grant, Stoney Creek, the older condo buildings — drops the price by 40% for second-row lodging. Still walkable to the beach (10 min). Good for families who mostly use the lodging to sleep.",
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
        "<strong>Dunes House</strong> — beachfront bar & grill. Fine for a beach-day lunch. Don't go out of your way.",
        "<strong>Alexander's</strong> — near the Omni. The best of the in-plantation options. Holds up for a casual dinner.",
        "<strong>The Big Jim</strong> — Omni's main restaurant. Breakfast is solid; dinner is hit-or-miss.",
      ],
    },
    {
      kind: 'p',
      html: "For anything better, you drive 8–12 minutes to Shelter Cove (Ela's, Jack's) or 15 minutes to the north-end (Skull Creek, Hudson's).",
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
        "<strong>Robert Trent Jones Oceanfront</strong> — the signature. Hole 10 plays to the beach. Book this first, 60+ days out.",
        "<strong>Fazio</strong> — the toughest. Windy, water-in-play, not for beginners. Excellent conditioning.",
        "<strong>Arthur Hills</strong> — the fun one. Shorter, more forgiving, still interesting. Good for mixed-handicap groups.",
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
      html: "The Palmetto Dunes Tennis Center is a legitimate reason to choose this neighborhood. 23 clay courts, 8 pickleball courts, clinics twice daily. Family camps in summer — drop the kids for 2 hours, hit the beach. Book the daily camps 2 weeks out for July.",
    },
    {
      kind: 'h2',
      text: "Lagoons — the underrated move",
    },
    {
      kind: 'p',
      html: "The Outside Hilton Head outfitter operates out of Shelter Cove next door. A 90-minute lagoon kayak at 7am is one of the most underrated activities on the island — mist, herons, occasional alligator sightings at a safe distance, and you're back in time for breakfast.",
    },
    {
      kind: 'h2',
      text: "Palmetto Dunes vs. Sea Pines — the honest comparison",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Stay in Palmetto Dunes if:</strong> golf or tennis is a real part of the trip, you have kids 6–14, you want a full-service resort option.",
        "<strong>Stay in Sea Pines if:</strong> you want the iconic Hilton Head experience, you care about walkability to dining, you want a more \"adult\" feel.",
      ],
    },
    {
      kind: 'p',
      html: "It's very common for our repeat clients to alternate — Palmetto Dunes for the family summer week, Sea Pines for the couples' fall getaway.",
    },
    {
      kind: 'callout',
      label: "2026 specific",
      html: "The Omni renovation is the biggest news. If your last stay was pre-2025, the pool deck is now worth staying at the Omni just to use. If you want a room that matches, book a renovated floor (4 and up as of spring 2026) — ask us which room numbers specifically.",
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
    "A local's guide to Forest Beach on Hilton Head — walkability to Coligny Plaza, mid-island villa rentals, beach access points, and why it's the best value neighborhood for 3–5 night trips.",
  category: 'Neighborhoods',
  readTime: '7 min',
  publishedAt: '2026-02-18',
  updatedAt: '2026-04-12',
  author: 'Hilton Ahead',
  featuredOrder: 6,
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
      html: "Forest Beach is the overlooked middle child of Hilton Head's neighborhoods. No gate, no resort fees, no 19-hole \"plantation\" branding. It's a dense, walkable mid-island stretch with direct beach access, a functioning commercial plaza (Coligny), and the best per-dollar value on the island for 3–5 day trips.",
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
        "<strong>Real beach access.</strong> Coligny Beach Park is the only beach on the island with full-service amenities — bathrooms, showers, food, lifeguards. Best single beach access on Hilton Head.",
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
      html: "Between the Marriott Beach Resort (Shipyard edge) and Coligny. High-density condo buildings — Sea Crest, The Atrium, Villamare. Walkable to Coligny. Beach access via your condo's private boardwalk. Best value pocket.",
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
      text: "Coligny Plaza — what's actually there",
    },
    {
      kind: 'p',
      html: "Coligny is the only real retail plaza on the island. Honest take: the food is middling (tourist-forward), but the convenience is unbeatable. What's worth knowing:",
    },
    {
      kind: 'ul',
      items: [
        "<strong>Skillets Café</strong> — breakfast. Lines by 9am. Go at 7:30 or 10:30.",
        "<strong>A Lowcountry Backyard</strong> — lunch. Shrimp & grits without the resort pricing.",
        "<strong>Coligny Theatre</strong> — movies. Rainy day lifesaver.",
        "<strong>The Sandbox children's museum</strong> — kids under 8. Worth 90 minutes.",
        "<strong>Pretty much all the gift shops</strong> — skip, unless you need sunscreen or a phone charger.",
      ],
    },
    {
      kind: 'h2',
      text: "Beach access — the specifics",
    },
    {
      kind: 'p',
      html: "Coligny Beach Park is the headline access. Free parking (though it fills by 9am in summer), full amenities. In addition, every condo in Forest Beach has a private boardwalk access — so if you're staying there, you walk out your back door to the sand.",
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
        "<strong>Short-trip travelers</strong> (3–5 days) who want walkable access and good value.",
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
      html: "For a couple or family of 4 on a 4-night summer trip, we default to a 2BR oceanfront condo in the Sea Crest or Villamare buildings. Walking distance to Coligny, private beach boardwalk, $3,200–$3,800/week, and we know the managers personally. If budget flexes up, we upgrade to single-family on South Forest Beach Lane.",
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
    "A local's guide to Shelter Cove on Hilton Head — marina lodging, the best dinners, sunset dolphin cruises, and why it's the most adult-friendly pocket of the island.",
  category: 'Neighborhoods',
  readTime: '7 min',
  publishedAt: '2026-03-03',
  updatedAt: '2026-04-10',
  author: 'Hilton Ahead',
  featuredOrder: 7,
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
      html: "Shelter Cove is a 200-acre marina-centric development on the north side of the island, facing Broad Creek rather than the ocean. Calling it a \"neighborhood\" is a stretch — it's really one large marina with the buildings arranged around it. But for trip-planning purposes, it's a distinct place with a distinct feel.",
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
      text: "Eating in Shelter Cove — the main event",
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
      html: "The marina is where most of the island's boat operators run from. Sunset sail on a 41-foot catamaran — the Vagabond Cruise — is the obvious move. 90 minutes, BYOB, typically 10–12 people.",
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
      text: 'Summer concert series (June–August)',
    },
    {
      kind: 'p',
      html: "Free Tuesday and Thursday night concerts on the marina lawn from June through August. Bring a blanket and wine. Genuinely one of the best low-key evenings you can have on the island.",
    },
    {
      kind: 'h2',
      text: "Shelter Cove as a base — the tradeoff",
    },
    {
      kind: 'p',
      html: "You're staying on a marina, not a beach. The ocean is a 6-minute drive. For a couples' trip, that's a feature — you get beach days without the beach-side crowds. For a kids' trip, it's a friction — the hotel-to-sand routine adds 15 minutes each way.",
    },
    {
      kind: 'callout',
      label: "Our Shelter Cove play",
      html: "For a 3–4 night couples' trip in fall, we often book Shelter Cove Towers for the marina view, plan a beach morning to Singleton Beach (5 min away), a sunset sail one night, and dinners at Ela's, FARM Bluffton (off-island), and Red Fish. Zero golf, zero resort program, zero kids. That's the Shelter Cove recipe.",
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
    "A complete guide to planning a golf trip to Hilton Head Island — the best courses ranked, how to book Harbour Town, where to stay, and the corporate outings logistics most guides skip.",
  category: 'Golf',
  readTime: '11 min',
  publishedAt: '2026-02-12',
  updatedAt: '2026-04-18',
  author: 'Hilton Ahead',
  featuredOrder: 8,
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
      html: "Hilton Head has 24 golf courses across three clusters (Sea Pines, Palmetto Dunes, Bluffton). More golf per square mile than any resort island in America. The problem isn't finding a course — it's figuring out which four to play, which order, and how to sequence lodging so you're not driving across the island between rounds.",
    },
    {
      kind: 'h2',
      text: "The only four courses that matter on a first trip",
    },
    {
      kind: 'ol',
      items: [
        "<strong>Harbour Town Golf Links</strong> — Sea Pines. Host of the RBC Heritage. A pilgrimage. $480+ in season. Book first.",
        "<strong>Robert Trent Jones Oceanfront</strong> — Palmetto Dunes. Hole 10 plays to the Atlantic. The other signature course on the island. $220.",
        "<strong>Atlantic Dunes (formerly Ocean Course)</strong> — Sea Pines. Davis Love III redesign, opened 2016. Strong conditioning, underrated layout. $180.",
        "<strong>May River Golf Club</strong> — Palmetto Bluff, Bluffton. 20 min drive. Jack Nicklaus design, one of the best private-quality experiences in the Southeast. Resort guests only. $275.",
      ],
    },
    {
      kind: 'h2',
      text: "How to book Harbour Town",
    },
    {
      kind: 'p',
      html: "The mechanics matter. Harbour Town is bookable 90 days out. In peak season (March–May, September–early November), the 8am–10am slots go in the first hour. Three rules:",
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
      html: "Stay at the Omni or a Palmetto Dunes villa. Play RTJ Oceanfront, Fazio, Arthur Hills in-plantation, then drive to Harbour Town for the big day. Works for 6–8 person trips that need villa space. 10 min drive each way.",
    },
    {
      kind: 'h3',
      text: 'Strategy 3: The stealth move — Palmetto Bluff / Bluffton',
    },
    {
      kind: 'p',
      html: "Stay at Montage Palmetto Bluff or an Old Town Bluffton boutique. Play May River, Old South, Belfair, and make Harbour Town a day trip. Best food, best service, lowest crowd density. 20 min drive to Sea Pines — a real consideration.",
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
        "<strong>Book tee-time blocks, not individual slots.</strong> Most courses will hold 3–5 foursomes at once for groups of 12–20 if you book 6 months out through the group desk.",
        "<strong>Use a shotgun start where possible.</strong> RTJ and Atlantic Dunes will do shotguns for 20+ players, some Tuesday–Thursday mornings.",
        "<strong>Book transportation.</strong> Charter buses from your lodging to each course. Nobody should be driving a group of 4 in a golf cart across the island.",
        "<strong>Lock the dinner reservation the same day as the tee times.</strong> Skull Creek Boathouse can accommodate groups of 30 — we book those 4 months out.",
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
      html: "Peak-season (April or July) versions of the same trip run 30–40% higher.",
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
      html: "For golf trips, we add value in four specific ways: (1) we have tee-time holds at Harbour Town through a partnership, (2) we book the group-rate dinners before you arrive, (3) we handle the villa selection to match the golf schedule, (4) we manage transportation. A typical corporate outing saves $2k–$4k vs. retail through us, plus four hours of logistics.",
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
