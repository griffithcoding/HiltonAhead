/**
 * Comparison content — Hilton Head vs. other destinations, neighborhoods,
 * and resorts.
 *
 * Comparison pages are the highest-converting SEO format for travel buyers
 * actively choosing between options. The shape supports 2-way and 3-way
 * comparisons; render via components/sections/ComparisonLanding.tsx.
 *
 * Voice rules (per docs/brand/voice-audit-2026-05-21.md):
 *   - Specific over superlative. Imply, don't narrate.
 *   - Words to retire in body copy: best, top, premier, ultimate, curated,
 *     exclusive, unforgettable. (URL slugs are exempt — they target search.)
 *   - Each dimension's commentary should be a single sentence with a
 *     concrete number or place name where possible.
 *
 * Editorial rules:
 *   - The verdict block ("Pick X if...") is the most-quotable section —
 *     LLMs will surface this when users ask the comparison question.
 *   - Three verdict bullets per option. No more, no fewer.
 *   - FAQ items are the second-most-quotable surface. 3–5 per page.
 */

export type ComparisonOption = {
  /** Display name, e.g. "Hilton Head Island". */
  name: string;
  /** Internal site URL if applicable, e.g. "/hilton-head/sea-pines". Used for crosslinks. */
  href?: string;
  /** Short subtitle that runs under the name on the comparison hero. */
  subtitle: string;
  /** Three concise bullets describing who this option suits. */
  pickIf: ReadonlyArray<string>;
  /** Optional 1–2 sentence editorial summary used on verdict cards. */
  summary?: string;
};

export type DimensionAdvantage = 'left' | 'right' | 'middle' | 'tie';

export type ComparisonDimension = {
  /** Short dimension name, e.g. "Beach access" or "Golf course count". */
  name: string;
  /** Value text for each option, in the same order as `Comparison.options`. */
  values: ReadonlyArray<string>;
  /** Which option wins this dimension. 'tie' when both/all are equivalent. */
  advantage: DimensionAdvantage;
  /** One sentence elaborating. Should include a concrete number or place. */
  commentary: string;
};

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type Comparison = {
  /** Route slug — the URL path under app/. e.g. "hilton-head-vs-kiawah" → /hilton-head-vs-kiawah. */
  slug: string;
  /** Meta title (50–60 chars). */
  metaTitle: string;
  /** Meta description (150–160 chars). */
  metaDescription: string;
  /** Page H1 — usually "X vs Y" framing. */
  h1: string;
  /** Italic display word(s) styled with display-italic in the H1. */
  h1Italic: string;
  /** Plain word(s) preceding the italic word in the H1. */
  h1Plain: string;
  /** Eyebrow text shown above the H1 (e.g. "Comparison · sourced · 2026"). */
  eyebrow: string;
  /** TL;DR direct answer paragraph — 2–4 sentences. Voice-search and Speakable eligible. */
  tldr: string;
  /** The 2 or 3 options being compared. Order matters; table columns follow. */
  options: ReadonlyArray<ComparisonOption>;
  /** Dimensions table. 5–8 dimensions per comparison reads cleanest. */
  dimensions: ReadonlyArray<ComparisonDimension>;
  /** 3–5 FAQ items. Surface the questions LLMs most commonly answer wrong. */
  faqs: ReadonlyArray<ComparisonFaq>;
  /** Related comparison slugs to cross-link at page bottom. */
  relatedSlugs?: ReadonlyArray<string>;
  /** Optional keywords pumped into <meta keywords>. */
  keywords?: ReadonlyArray<string>;
};

// ─────────────────────────────────────────────────────────────────────────
// Comparisons
// ─────────────────────────────────────────────────────────────────────────

export const COMPARISONS: ReadonlyArray<Comparison> = [
  // ───────────────────────────────────────── Hilton Head vs Kiawah Island
  {
    slug: 'hilton-head-vs-kiawah',
    metaTitle: 'Hilton Head vs Kiawah: Honest 2026 Comparison',
    metaDescription:
      'Hilton Head vs Kiawah Island — which to pick for golf, families, couples, dining, and price. A 30-year Hilton Head local walks through every dimension.',
    h1Plain: 'Hilton Head',
    h1Italic: 'vs. Kiawah.',
    h1: 'Hilton Head vs. Kiawah',
    eyebrow: 'Comparison · 2026 · written by a Hilton Head local',
    tldr:
      "Pick Kiawah for a quieter, more remote golf-purist trip where one resort owns the island and the beach feels private. Pick Hilton Head for variety — 24 golf courses instead of 7, real downtown areas in Coligny and Harbour Town, hundreds of restaurants, and a wider lodging price range. Couples often choose Kiawah; families and groups usually pick Hilton Head.",
    options: [
      {
        name: 'Hilton Head Island',
        href: '/',
        subtitle: 'A 12-mile foot-shaped barrier island with five neighborhoods, three towns, and 200+ restaurants.',
        pickIf: [
          'You want variety — multiple resorts, dozens of restaurants, multiple beach pockets.',
          'You have kids or a multigenerational group with different agendas.',
          'You want more lodging options across more price points.',
        ],
        summary:
          'More choices, more density, more competition for restaurant tables — but also more ways to tailor a trip to a specific group.',
      },
      {
        name: 'Kiawah Island',
        subtitle: 'A 10-mile barrier island 45 minutes south of Charleston, dominated by one resort.',
        pickIf: [
          'You want a quieter, more remote feel with less commercial density.',
          'You are a golf-purist building a trip around the Ocean Course.',
          'You also want a short hop into downtown Charleston.',
        ],
        summary:
          'One resort and one set of golf courses, but the trip pairs naturally with two days in Charleston.',
      },
    ],
    dimensions: [
      {
        name: 'Golf course count',
        values: ['24 on-island, 15+ in Bluffton', '7 (5 public, 2 private)'],
        advantage: 'left',
        commentary:
          'Hilton Head has 24 courses on the island plus 15+ more within 30 minutes. Kiawah\'s seven include the Ocean Course (a top-3 U.S. resort course by most rankings) but the volume sits with Hilton Head.',
      },
      {
        name: 'Marquee course',
        values: ['Harbour Town (Pete Dye, 1969)', 'The Ocean Course (Pete Dye, 1991)'],
        advantage: 'tie',
        commentary:
          'Both Pete Dye designs, both PGA-tour venues. Harbour Town hosts the RBC Heritage every April; the Ocean Course has hosted two PGA Championships and the 1991 Ryder Cup.',
      },
      {
        name: 'Distance to Charleston',
        values: ['~2 hours', '~45 minutes'],
        advantage: 'right',
        commentary:
          'Kiawah pairs with a 2-day Charleston add-on without giving up a beach day. Hilton Head pairs less naturally — most people doing both make Charleston a separate trip.',
      },
      {
        name: 'Restaurant variety',
        values: ['~250', '~20 inside Kiawah + ~10 nearby'],
        advantage: 'left',
        commentary:
          'Hilton Head has 250 restaurants between the bridges; Kiawah\'s dining is essentially the resort plus a handful of nearby Johns Island spots. Couples often eat at the resort; bigger groups feel the limits.',
      },
      {
        name: 'Crowd density',
        values: ['~3 million annual visitors', '~600,000 annual visitors'],
        advantage: 'right',
        commentary:
          "Kiawah feels noticeably emptier, especially mid-week and shoulder season. Hilton Head's peak weeks (June–August + RBC week) get genuinely crowded.",
      },
      {
        name: 'Lodging price floor',
        values: ['$1,800/wk (off-season inland villa)', '$3,200/wk (Kiawah villa)'],
        advantage: 'left',
        commentary:
          'Hilton Head has off-resort inventory in Mid-Island and Folly Field that drops below $2,000/wk in shoulder seasons. Kiawah\'s lowest-tier villa-week sits closer to $3,200.',
      },
      {
        name: 'Family-friendliness',
        values: ['Strong (Coligny Plaza, Pirates Cove, Sandbox Museum)', 'Moderate (resort programs only)'],
        advantage: 'left',
        commentary:
          'Hilton Head has multiple kid-aimed neighborhoods (Coligny, Shelter Cove, Forest Beach). Kiawah\'s kid offering is essentially the resort\'s Kamp Kiawah program.',
      },
      {
        name: 'Couples / honeymoon fit',
        values: ['Strong but variable by neighborhood', 'Very strong (uniform quiet)'],
        advantage: 'right',
        commentary:
          'For a quiet couples trip Kiawah\'s uniformity wins — there\'s no chance of waking up next to a Sea Pines bachelorette block. On Hilton Head you pick the right neighborhood (Palmetto Bluff, Wexford, Long Cove) for the same effect.',
      },
    ],
    faqs: [
      {
        question: 'Is Kiawah more expensive than Hilton Head?',
        answer:
          'Yes, on average. Kiawah\'s lodging price floor sits ~$1,200/wk higher than Hilton Head\'s, and the resort\'s dining and golf-course green fees run 15–25% higher than the Hilton Head equivalent. Hilton Head has more off-resort inventory that lowers the floor.',
      },
      {
        question: 'Can I see both Hilton Head and Kiawah on one trip?',
        answer:
          "It's a 2-hour drive between the two — possible but not natural. The cleaner pairing is Kiawah + Charleston (45 minutes), or Hilton Head + Savannah (45 minutes). Doing all three on one trip works only if you're allocating 10+ nights total.",
      },
      {
        question: 'Which is better for a golf-only trip?',
        answer:
          "If your group is happy playing the same 5–7 courses, Kiawah's concentrated offering wins. If you want to play different architects across the week (Pete Dye, Jack Nicklaus, Robert Trent Jones, Davis Love, Tom Fazio), Hilton Head's 24-course depth is the better fit.",
      },
      {
        question: 'Which beach is better, Hilton Head or Kiawah?',
        answer:
          'Both are long, flat, hard-packed Atlantic beaches. Kiawah feels emptier and less commercial. Hilton Head\'s beach is more livelier with more beach-bar density (Coligny, Tiki Hut at Sea Crest). Sand quality is roughly equivalent.',
      },
      {
        question: 'Hilton Head or Kiawah for a family with kids under 10?',
        answer:
          'Hilton Head, in most cases. Kiawah\'s family program is excellent but contained inside the resort. Hilton Head gives you walkable kid-friendly density at Coligny, dolphin tours from multiple marinas, mini-golf, and Disney\'s Hilton Head Island Resort if Disney IP is part of the appeal.',
      },
    ],
    relatedSlugs: ['hilton-head-vs-charleston', 'sea-pines-vs-palmetto-dunes'],
    keywords: [
      'Hilton Head vs Kiawah',
      'Kiawah vs Hilton Head',
      'Hilton Head Island vs Kiawah Island',
      'Kiawah or Hilton Head',
      'which is better Hilton Head or Kiawah',
    ],
  },

  // ───────────────────────────────────────── Hilton Head vs Charleston
  {
    slug: 'hilton-head-vs-charleston',
    metaTitle: 'Hilton Head vs Charleston: 2026 Vacation Comparison',
    metaDescription:
      'Hilton Head vs Charleston — beach vs city, golf vs historic district, family vs couples. A Hilton Head local walks through the trade-offs and how to do both.',
    h1Plain: 'Hilton Head',
    h1Italic: 'vs. Charleston.',
    h1: 'Hilton Head vs. Charleston',
    eyebrow: 'Comparison · 2026 · written by a Hilton Head local',
    tldr:
      "Different products. Hilton Head is a beach-and-golf island; Charleston is a historic American city. Pick Hilton Head when the trip is centered on the water, the bike paths, or a tee sheet. Pick Charleston when it's centered on dinner reservations, walking tours, and antebellum architecture. Two hours apart by car — combining them on one trip is realistic and common.",
    options: [
      {
        name: 'Hilton Head Island',
        href: '/',
        subtitle: '12-mile barrier island, 12 miles of beach, 24 golf courses, 60+ miles of bike path.',
        pickIf: [
          'The trip is built around the beach, golf, or biking with kids.',
          'You want a single base for 5–7 nights without packing the car daily.',
          'Your group ranges in age and energy and needs varied agendas to coexist.',
        ],
        summary:
          'Spread-out by design. You rent a villa or check into a resort, and most days the car barely leaves the driveway.',
      },
      {
        name: 'Charleston',
        subtitle: 'Historic peninsula city; 2-hour drive north of Hilton Head.',
        pickIf: [
          'The trip is centered on restaurants, history, and downtown walking.',
          'You want to spend 2–4 nights in a single dense, walkable district.',
          'You\'re a couple, a small adult group, or a multigenerational trip with older parents.',
        ],
        summary:
          'A city, not a destination. The trip is the streets, the dinner reservations, and the day trips out to Boone Hall, Magnolia, or Folly Beach.',
      },
    ],
    dimensions: [
      {
        name: 'Beach',
        values: ['12 miles of hard-packed Atlantic beach', 'Folly Beach (~30 min drive)'],
        advantage: 'left',
        commentary:
          'Hilton Head\'s beach is on-property at every oceanfront stay. Charleston\'s closest beach (Folly) is a half-hour drive and gets crowded on summer weekends.',
      },
      {
        name: 'Dining variety',
        values: ['~250 restaurants', '~600 restaurants in metro Charleston'],
        advantage: 'right',
        commentary:
          'Charleston has been Bon Appétit\'s top food city more than once. Hilton Head\'s 250 are spread out and lean toward Lowcountry seafood; Charleston has depth across cuisines.',
      },
      {
        name: 'Walking the trip',
        values: ['Bikes inside Sea Pines / Palmetto Dunes', 'Walkable historic peninsula'],
        advantage: 'right',
        commentary:
          'Charleston\'s peninsula is one of the most walkable downtown districts in the U.S. Hilton Head\'s walkable pockets are limited to inside Sea Pines, Harbour Town, and around Coligny Plaza.',
      },
      {
        name: 'History / culture',
        values: ['Mitchelville Freedom Park, Gullah Heritage Trail', 'Antebellum Charleston, Fort Sumter, market'],
        advantage: 'right',
        commentary:
          'Charleston is one of the most preserved historic districts in the U.S. Hilton Head\'s historical layer (Mitchelville, Gullah) is significant but less visible.',
      },
      {
        name: 'Golf',
        values: ['24 on-island, 15+ in Bluffton', '~30 in metro Charleston'],
        advantage: 'tie',
        commentary:
          'Both have plenty. Hilton Head\'s courses are more concentrated (most within 15 minutes); Charleston\'s require more driving but include the Ocean Course at Kiawah.',
      },
      {
        name: 'Family-friendliness',
        values: ['Strong — beaches, bikes, mini-golf, Disney resort', 'Moderate — depends on kids\' age'],
        advantage: 'left',
        commentary:
          'Charleston works for kids 8 and up. Younger kids do better at Hilton Head where there\'s a beach 100 yards from the lodging and walkable pirate-themed dining.',
      },
      {
        name: 'Pairing potential',
        values: ['Can add Savannah (45 min) or Charleston (2 hr)', 'Can add Kiawah (45 min) or Hilton Head (2 hr)'],
        advantage: 'tie',
        commentary:
          'Both work as a base for the Lowcountry corridor. A 7-night trip of 5 nights Hilton Head + 2 nights Charleston is one of the most-requested itineraries we plan.',
      },
    ],
    faqs: [
      {
        question: 'Should I do Hilton Head or Charleston for a beach vacation?',
        answer:
          'Hilton Head. Charleston\'s nearest beach (Folly) is 30 minutes from downtown and significantly busier. Hilton Head\'s beach is at every oceanfront stay, with miles of bikeable hard-packed sand.',
      },
      {
        question: 'How far apart are Hilton Head and Charleston?',
        answer:
          'About 2 hours by car — 105 miles via I-95 + US-17. The route is straightforward, with one stop in Yemassee or Walterboro typical.',
      },
      {
        question: 'Can I do both Hilton Head and Charleston in one week?',
        answer:
          'Yes — the cleanest split is 5 nights on Hilton Head + 2 nights in Charleston (or 4+3 if you want more city time). Drive day adds ~3 hours total including a lunch stop.',
      },
      {
        question: 'Which has better restaurants?',
        answer:
          'Charleston has more depth and more chef-driven concepts. Hilton Head has tighter Lowcountry-seafood concentration with several decades-old institutions (Skull Creek Boathouse, Hudson\'s, Charlie\'s L\'Etoile Verte). For a foodie trip, Charleston wins; for a beach trip with good seafood dinners, Hilton Head is plenty.',
      },
      {
        question: 'Where should I stay if I want to do both?',
        answer:
          'Stay Hilton Head first. The drive-day vibe is cleaner heading from beach-week → city than the reverse, and Charleston hotels are easier to find walkable lodging in than Hilton Head villas to leave mid-week.',
      },
    ],
    relatedSlugs: ['hilton-head-vs-kiawah', 'hilton-head-vs-myrtle-beach'],
    keywords: [
      'Hilton Head vs Charleston',
      'Charleston vs Hilton Head',
      'Hilton Head or Charleston',
      'Hilton Head and Charleston vacation',
    ],
  },

  // ───────────────────────────────────────── Hilton Head vs Myrtle Beach
  {
    slug: 'hilton-head-vs-myrtle-beach',
    metaTitle: 'Hilton Head vs Myrtle Beach: Real Differences in 2026',
    metaDescription:
      'Hilton Head vs Myrtle Beach — beach, golf, family fit, price, vibe. Two completely different products at different price points. Here\'s how to pick.',
    h1Plain: 'Hilton Head',
    h1Italic: 'vs. Myrtle Beach.',
    h1: 'Hilton Head vs. Myrtle Beach',
    eyebrow: 'Comparison · 2026 · written by a Hilton Head local',
    tldr:
      "Two completely different beach vacations. Myrtle Beach is louder, cheaper, and built around the strand, boardwalks, mini-golf, and live entertainment. Hilton Head is quieter, more polished, gated-community style, with bike paths and no neon. Myrtle averages roughly 40% cheaper per night. Pick Myrtle if the vacation is boardwalk-energy with kids; pick Hilton Head for a quieter, more design-controlled week.",
    options: [
      {
        name: 'Hilton Head Island',
        href: '/',
        subtitle: 'Master-planned barrier island; gated communities, bike paths, and zero billboards.',
        pickIf: [
          'You want a quiet, design-controlled beach week.',
          'Your group includes adults who don\'t want boardwalk-noise lodging.',
          'You play golf at architect-named courses (Pete Dye, Jack Nicklaus, RTJ).',
        ],
        summary:
          'You won\'t see a neon sign here. Tree ordinances cap building heights and ban billboards. The vibe is engineered.',
      },
      {
        name: 'Myrtle Beach',
        subtitle: '60-mile strand of high-rises, mini-golf, and Carolina-style boardwalk energy.',
        pickIf: [
          'You want a louder, more affordable beach trip with kids.',
          'Your group enjoys mini-golf, arcades, live country music, and oceanfront dining strip.',
          'You\'re booking a high-rise hotel directly on the sand for under $300/night.',
        ],
        summary:
          'A different product altogether. Myrtle Beach is the East-Coast Vegas of beach towns — bigger, louder, cheaper, and unembarrassed about all three.',
      },
    ],
    dimensions: [
      {
        name: 'Beach style',
        values: ['Hard-packed, bikeable, gated-community feel', 'Wide, soft, very busy, surfer-friendly'],
        advantage: 'tie',
        commentary:
          'Both are great Atlantic beaches but feel completely different. Hilton Head\'s beaches feel low-density. Myrtle\'s feel like a vacation event.',
      },
      {
        name: 'Lodging price floor',
        values: ['$1,800/wk shoulder villa', '$1,000/wk hotel or condo'],
        advantage: 'right',
        commentary:
          'Myrtle\'s sheer inventory volume keeps rates low. A 7-night summer hotel stay in Myrtle averages ~40% below the Hilton Head equivalent.',
      },
      {
        name: 'Golf course count',
        values: ['24 on-island, 15+ in Bluffton', '~80 in the Grand Strand'],
        advantage: 'right',
        commentary:
          'Myrtle is the largest golf-course concentration on the East Coast. Hilton Head has fewer but on average higher-tier courses.',
      },
      {
        name: 'Marquee course quality',
        values: ['Harbour Town, May River, Colleton River', 'Caledonia, True Blue, Tidewater'],
        advantage: 'left',
        commentary:
          'Hilton Head\'s top-3 are PGA-tour or PGA-tour-caliber. Myrtle has excellent public courses but the tier-1 ceiling sits lower.',
      },
      {
        name: 'Restaurants',
        values: ['~250, Lowcountry-leaning', '~2,000+ including chains'],
        advantage: 'tie',
        commentary:
          'Myrtle has more sheer count but most are chains. Hilton Head has fewer total but a higher independent-restaurant share. Foodies pick Hilton Head; families on a budget pick Myrtle.',
      },
      {
        name: 'Family entertainment',
        values: ['Beach, bikes, dolphin tours, mini-golf', 'Boardwalk, SkyWheel, Ripley\'s, hundreds of attractions'],
        advantage: 'right',
        commentary:
          'Myrtle has more pre-built kid entertainment. Hilton Head\'s "what to do with kids" leans on the natural environment (beach, bikes, marsh tours).',
      },
      {
        name: 'Crowd level',
        values: ['~3 million annual visitors', '~19 million annual visitors'],
        advantage: 'left',
        commentary:
          'Myrtle Beach is one of the most-visited beach destinations in the U.S. Hilton Head is roughly 6× quieter by visitor volume.',
      },
    ],
    faqs: [
      {
        question: 'Is Myrtle Beach cheaper than Hilton Head?',
        answer:
          'Yes — typically 30–40% cheaper for lodging and 20–30% cheaper for dining. Myrtle Beach\'s scale and chain-driven economy keeps the price floor low. Hilton Head has fewer chains and more independent operations at higher price points.',
      },
      {
        question: 'Which has better golf, Hilton Head or Myrtle Beach?',
        answer:
          'Different answers depending on what you mean. Myrtle has more courses (~80 in the Grand Strand vs. ~40 in HH + Bluffton). Hilton Head\'s top-tier courses (Harbour Town, May River, Colleton River) sit higher than Myrtle\'s top tier on most professional rankings.',
      },
      {
        question: 'Hilton Head or Myrtle Beach for a family with young kids?',
        answer:
          'Hilton Head if you want a quiet beach week with bikes and dolphin tours. Myrtle Beach if you want boardwalk entertainment, arcades, mini-golf, and on-strand water parks. Different vacation feel altogether.',
      },
      {
        question: 'Which has a better nightlife scene?',
        answer:
          'Myrtle Beach, by a wide margin — Broadway at the Beach, House of Blues, Carolina Opry, live entertainment most nights. Hilton Head\'s nightlife is dinner-and-a-drink-on-a-marina-deck. Anyone looking for a club scene should pick Myrtle.',
      },
    ],
    relatedSlugs: ['hilton-head-vs-charleston', 'hilton-head-vs-kiawah'],
    keywords: [
      'Hilton Head vs Myrtle Beach',
      'Myrtle Beach vs Hilton Head',
      'Hilton Head or Myrtle Beach',
      'which is better Hilton Head or Myrtle Beach',
    ],
  },

  // ───────────────────────────────────────── Sea Pines vs Palmetto Dunes
  {
    slug: 'sea-pines-vs-palmetto-dunes',
    metaTitle: 'Sea Pines vs Palmetto Dunes: Honest 2026 Comparison',
    metaDescription:
      'Sea Pines vs Palmetto Dunes — the two largest gated communities on Hilton Head, compared by a local. Beach access, golf, dining, gate fees, and which fits which trip.',
    h1Plain: 'Sea Pines',
    h1Italic: 'vs. Palmetto Dunes.',
    h1: 'Sea Pines vs. Palmetto Dunes',
    eyebrow: 'Comparison · 2026 · written by a Hilton Head local',
    tldr:
      "Sea Pines is the original 1956 Charles Fraser plantation — 5,000 acres, Harbour Town Lighthouse, Harbour Town Golf Links, three architects-named courses, the polished side of Hilton Head. Palmetto Dunes is younger, beachier, more casual, with three courses of its own and longer lagoons for kayaking. Sea Pines for the iconic Hilton Head experience; Palmetto Dunes for a more relaxed beach-and-resort feel.",
    options: [
      {
        name: 'Sea Pines',
        href: '/hilton-head/sea-pines',
        subtitle: '5,000-acre 1956-original plantation. Harbour Town, Liberty Oak, 17 miles of bike paths.',
        pickIf: [
          'You want the iconic Hilton Head: Harbour Town Lighthouse, Sea Pines Forest Preserve, big resort feel.',
          'You\'re playing Harbour Town Golf Links or want the 120-day tee-time priority window.',
          'You prefer a slightly more formal, designed-community aesthetic.',
        ],
        summary:
          'The original. Slightly more formal, slightly higher gate fee, the polished face of Hilton Head.',
      },
      {
        name: 'Palmetto Dunes',
        href: '/hilton-head/palmetto-dunes',
        subtitle: 'Oceanfront resort community; three championship courses, 11-mile lagoon system.',
        pickIf: [
          'You want the shortest possible walk from villa to beach.',
          'You kayak or paddleboard — the 11-mile lagoon system is the longest on Hilton Head.',
          'You\'re a family on a beach-first week with golf as a side option.',
        ],
        summary:
          'Beachier, more casual, more lagoon. The default modern-family Hilton Head pick.',
      },
    ],
    dimensions: [
      {
        name: 'Founded',
        values: ['1956 (Charles Fraser)', '1965'],
        advantage: 'tie',
        commentary:
          'Sea Pines is the original master-planned resort community in the U.S. — every neighborhood after it (including Palmetto Dunes) draws from its template.',
      },
      {
        name: 'Golf courses (inside the gate)',
        values: ['3 (Harbour Town, Heron Point, Atlantic Dunes)', '3 (RTJ Oceanside, Arthur Hills, George Fazio)'],
        advantage: 'tie',
        commentary:
          'Three courses each. Sea Pines has the marquee course (Harbour Town). Palmetto Dunes has the only true oceanside course (RTJ Oceanside).',
      },
      {
        name: 'Beach access',
        values: ['Short walks; bike-friendly', 'Many villas <2 min walk; oceanfront concentration'],
        advantage: 'right',
        commentary:
          'Palmetto Dunes was designed with shorter villa-to-beach walks. Some Palmetto Dunes villas are 90 seconds from sand; Sea Pines averages 5–10 minutes.',
      },
      {
        name: 'Bike paths inside the gate',
        values: ['17 miles', '8 miles + lagoon paths'],
        advantage: 'left',
        commentary:
          'Sea Pines has nearly the entire island\'s bike-path mileage concentrated inside its 5,000 acres. Palmetto Dunes is bikeable but with less internal mileage.',
      },
      {
        name: 'Lagoons / kayaking',
        values: ['Lakeside paths, Lake Joe', '11-mile lagoon system, kayak rentals on-site'],
        advantage: 'right',
        commentary:
          'Palmetto Dunes\' 11-mile lagoon is the longest navigable water inside any Hilton Head community. Outside Hilton Head sells guided kayak tours from inside the gate.',
      },
      {
        name: 'Dining inside the gate',
        values: ['Harbour Town + Sea Pines Center (~12 options)', 'Shelter Cove + on-property (~8 options)'],
        advantage: 'left',
        commentary:
          'Sea Pines has more in-gate dining concentration (Harbour Town\'s waterfront restaurants + Sea Pines Center). Palmetto Dunes pairs naturally with Shelter Cove Harbour next door.',
      },
      {
        name: 'Daily gate fee (non-guests)',
        values: ['$10 (Sea Pines)', 'No gate fee — open community'],
        advantage: 'right',
        commentary:
          'Sea Pines charges day visitors $10 at the gate (waived for resort guests). Palmetto Dunes has no gate fee. Inside-villa stays are unaffected either way.',
      },
      {
        name: 'Feel',
        values: ['Polished, slightly formal, iconic', 'Casual, beachier, family-default'],
        advantage: 'tie',
        commentary:
          'Personal preference. Sea Pines does the postcard. Palmetto Dunes does the beach week.',
      },
    ],
    faqs: [
      {
        question: 'Sea Pines or Palmetto Dunes for first-time visitors?',
        answer:
          'Sea Pines if you want to see the icons — Harbour Town Lighthouse, Liberty Oak, the bike paths through the maritime forest. Palmetto Dunes if you want the shortest possible walk from villa to ocean and want a less formal feel. Both work for first-time visitors.',
      },
      {
        question: 'Which has better golf?',
        answer:
          'Sea Pines has Harbour Town (the RBC Heritage venue) plus Heron Point and Atlantic Dunes — three Davis Love III / Pete Dye-quality courses. Palmetto Dunes has RTJ Oceanside (the only oceanside course on the island) plus Arthur Hills and George Fazio. If your group has to play Harbour Town, stay at Sea Pines for the 120-day priority window. Otherwise the two communities are roughly comparable in golf quality.',
      },
      {
        question: 'Which is more family-friendly?',
        answer:
          'Palmetto Dunes, marginally. Shorter beach walks, on-site bike/kayak/paddleboard rental, and an oceanfront pool scene at the Omni and Marriott Grande Ocean. Sea Pines works for families too but the design assumes a slightly older guest profile.',
      },
      {
        question: 'How much does it cost to stay in each?',
        answer:
          "Both run roughly the same lodging price floor (~$2,500/wk shoulder villa, $4,500–$8,000/wk peak). True oceanfront commands a 30–60% premium in both. Sea Pines\' inn (The Inn & Club at Harbour Town) is the most expensive bed-only lodging in either community.",
      },
      {
        question: 'Can I visit Sea Pines if I\'m not staying there?',
        answer:
          'Yes — Sea Pines charges day visitors $10 at the gate. That gets you into the Forest Preserve, Harbour Town for restaurants, the Sea Pines bike paths, and Harbour Town Lighthouse. Resort guests pay no gate fee.',
      },
    ],
    relatedSlugs: ['hilton-head-vs-kiawah', 'westin-vs-omni-hilton-head'],
    keywords: [
      'Sea Pines vs Palmetto Dunes',
      'Palmetto Dunes vs Sea Pines',
      'Sea Pines or Palmetto Dunes',
      'Hilton Head Sea Pines or Palmetto Dunes for family',
    ],
  },

  // ───────────────────────────────────────── Westin vs Omni Hilton Head
  {
    slug: 'westin-vs-omni-hilton-head',
    metaTitle: 'Westin vs Omni Hilton Head: 2026 Honest Comparison',
    metaDescription:
      'The Westin vs Omni Hilton Head Oceanfront Resort — a local\'s honest comparison of rooms, beach, pools, dining, and which floors actually got renovated.',
    h1Plain: 'The Westin',
    h1Italic: 'vs. the Omni.',
    h1: 'The Westin vs. the Omni',
    eyebrow: 'Comparison · 2026 · written by a Hilton Head local',
    tldr:
      "The Westin Hilton Head Island Resort & Spa is the quieter pick — north-end Port Royal, three pools, full spa, refined Lowcountry dining. The Omni Hilton Head Oceanfront Resort sits inside Palmetto Dunes with three championship golf courses across the street, Shelter Cove Marina walkable, and a livelier pool scene. Westin for couples and a quieter feel; Omni for golf groups and families who want the lagoon-and-marina action of Palmetto Dunes.",
    options: [
      {
        name: 'The Westin Hilton Head Island Resort & Spa',
        subtitle: 'Port Royal neighborhood, north end. The only resort inside the Port Royal gate.',
        pickIf: [
          'You want a quieter, more refined feel with fewer kids in the pool.',
          'You\'re here for spa, beach, and dinner — not golf as the centerpiece.',
          'You\'re a couple or a small adult group.',
        ],
        summary:
          'Quieter, slightly more formal, no on-property golf. Port Royal\'s three courses are across the gate.',
      },
      {
        name: 'Omni Hilton Head Oceanfront Resort',
        subtitle: 'Palmetto Dunes Oceanfront Resort, mid-island. Walkable to Shelter Cove Harbour.',
        pickIf: [
          'You\'re a golf group — three Palmetto Dunes championship courses across the road.',
          'You want lagoon + marina + beach in one resort (Shelter Cove walkable).',
          'You\'re a family — bigger pool scene, kid programs, easier access to Palmetto Dunes activities.',
        ],
        summary:
          'Livelier, more activity-dense, inside Palmetto Dunes\' lagoon + golf + marina ecosystem.',
      },
    ],
    dimensions: [
      {
        name: 'Location',
        values: ['Port Royal (north end)', 'Palmetto Dunes (mid-island)'],
        advantage: 'tie',
        commentary:
          'Westin is the only resort inside the Port Royal gate — quiet, residential, three Port Royal golf courses nearby. Omni is inside Palmetto Dunes\' resort community, walking distance to Shelter Cove Marina.',
      },
      {
        name: 'Beach',
        values: ['Direct oceanfront, wide flat beach', 'Direct oceanfront, slightly less elbow room'],
        advantage: 'left',
        commentary:
          'Westin\'s north-end beach is wider and less crowded than Palmetto Dunes\' mid-island beach in peak summer. Both are direct oceanfront.',
      },
      {
        name: 'Pools',
        values: ['3 outdoor (1 adult-only) + 1 indoor', '2 outdoor + 1 indoor, more family energy'],
        advantage: 'left',
        commentary:
          'Westin\'s adult-only pool is the key differentiator for couples. Omni\'s pools skew family + group; busier and louder during peak summer afternoons.',
      },
      {
        name: 'Renovation status',
        values: ['Renovated 2018–2020', 'Phased renovation 2022–2025; floor 4 + ocean-tower wings updated'],
        advantage: 'right',
        commentary:
          'Westin\'s 2018–2020 refresh hits all guest rooms. Omni\'s renovation is phased: floor 4 + ocean-tower wings are the updated rooms; older wings still feel ~2010-era. Always confirm wing/floor at booking.',
      },
      {
        name: 'Golf',
        values: ['Port Royal\'s 3 courses across the gate', '3 Palmetto Dunes courses across the road'],
        advantage: 'right',
        commentary:
          'Omni\'s on-resort golf is meaningfully better. Palmetto Dunes\' RTJ Oceanside, Arthur Hills, and George Fazio are within walking distance and the Omni handles tee-time integration.',
      },
      {
        name: 'Dining on property',
        values: ['Carolina Room (refined), Splash Pool Bar', 'HH Prime, Pineapple Pool Bar + Patio, Camp Omni'],
        advantage: 'tie',
        commentary:
          'Both have decent property dining. Omni has more variety; Westin\'s Carolina Room is the higher-end single restaurant.',
      },
      {
        name: 'Spa',
        values: ['Heavenly Spa (full-service, 11,000 sq ft)', 'Spa at the Omni (~6,000 sq ft, fewer treatments)'],
        advantage: 'left',
        commentary:
          'Westin\'s Heavenly Spa is among the largest hotel spas on the Carolina coast. Omni\'s spa is solid but smaller and less comprehensive.',
      },
      {
        name: 'Walkable amenities',
        values: ['Limited; rental car recommended', 'Shelter Cove Harbour walkable (dining, shopping, fireworks)'],
        advantage: 'right',
        commentary:
          'Omni guests can walk to Shelter Cove for dinners and the Tuesday HarbourFest fireworks all summer. Westin guests drive to most off-property dining.',
      },
    ],
    faqs: [
      {
        question: 'Which is more family-friendly, Westin or Omni?',
        answer:
          'Omni — bigger pool scene, Camp Omni kids programming, Palmetto Dunes\' on-resort kayak/paddleboard rentals, walkable to Shelter Cove\'s family attractions. Westin works for families but the vibe skews quieter-couple.',
      },
      {
        question: 'Which floors of the Omni are actually renovated?',
        answer:
          'Floor 4 + the ocean-tower wings completed the most recent renovation (2024). Older garden-view rooms still feel 2010-era. Specify "renovated ocean tower" at booking — Omni won\'t volunteer the distinction.',
      },
      {
        question: 'Is the Westin or Omni closer to the airport?',
        answer:
          'Westin — about 15 minutes from Hilton Head Airport (HHH) and 50 minutes from Savannah/Hilton Head International (SAV). Omni is 20 minutes from HHH and 55 minutes from SAV. Small difference.',
      },
      {
        question: 'Which has better golf?',
        answer:
          'Omni, decisively. Three Palmetto Dunes championship courses are walking-distance and the Omni handles tee-time integration for guests. The Westin\'s nearest courses (Port Royal\'s three) are good but require a car ride and a separate booking.',
      },
      {
        question: 'Which is the better couples / honeymoon pick?',
        answer:
          'Westin. Adult-only pool, Heavenly Spa, quieter beach, less family energy. Couples who don\'t need golf or marina action will be happier at the Westin.',
      },
    ],
    relatedSlugs: ['best-hilton-head-resort-comparison', 'sea-pines-vs-palmetto-dunes'],
    keywords: [
      'Westin vs Omni Hilton Head',
      'Omni vs Westin Hilton Head',
      'Hilton Head Westin or Omni',
      'Westin Hilton Head vs Omni Hilton Head Oceanfront',
    ],
  },

  // ───────────────────────────────────────── Omni vs Sonesta vs Marriott (3-way)
  {
    slug: 'best-hilton-head-resort-comparison',
    metaTitle: 'Omni vs Sonesta vs Marriott Hilton Head: 3-Way Compare',
    metaDescription:
      'The three biggest mid-island Hilton Head resorts compared — Omni, Sonesta, and Marriott Grande Ocean. Beach, pools, rooms, dining, family fit, and how to pick.',
    h1Plain: 'Omni, Sonesta,',
    h1Italic: 'or Marriott.',
    h1: 'Omni, Sonesta, or Marriott',
    eyebrow: 'Comparison · 2026 · 3 resorts · Hilton Head local',
    tldr:
      "Three different mid-island lodging options — Omni Hilton Head Oceanfront Resort (full-service resort inside Palmetto Dunes), Sonesta Resort Hilton Head (centrally located, set back from beach), and Marriott Grande Ocean (timeshare-style 2-bedroom villas inside Palmetto Dunes). Pick the Omni for resort amenities and pool scene, Sonesta for value and central location, and Marriott Grande Ocean for groups or families who want villa space with light resort coverage.",
    options: [
      {
        name: 'Omni Hilton Head Oceanfront Resort',
        subtitle: 'Palmetto Dunes. Full-service resort, oceanfront, three pools, three golf courses adjacent.',
        pickIf: [
          'You want full resort amenities (pools, spa, kid programs, on-property dining).',
          'You\'re a golf group with Palmetto Dunes tee times.',
          'You want walkable access to Shelter Cove Harbour.',
        ],
        summary:
          'The most resort-y of the three. Pool scene, dining, activity programming all in-house.',
      },
      {
        name: 'Sonesta Resort Hilton Head Island',
        subtitle: 'Shipyard Plantation. Centrally located, set back from beach (~5-min walk through the dunes).',
        pickIf: [
          'You want a central location with lower price than oceanfront.',
          'You don\'t need to step onto sand directly from the pool deck.',
          'You\'re here for the island as a whole, not the resort property.',
        ],
        summary:
          'Quieter, cheaper, less polish. Beach is across a short dune walk — fine for most travelers, deal-breaker for some.',
      },
      {
        name: 'Marriott Grande Ocean',
        subtitle: 'Palmetto Dunes. 2-bedroom Marriott Vacation Club villas with 5–10 min beach walks.',
        pickIf: [
          'Your group is 4+ people and needs 2BR/2BA villa space.',
          'You want kitchen + washer/dryer for a longer (5+ night) stay.',
          'You\'re using Marriott Bonvoy points or have Marriott Vacation Club access.',
        ],
        summary:
          'Villa product, not full-service resort. Pool + activities are slimmer; villa space is much bigger.',
      },
    ],
    dimensions: [
      {
        name: 'Distance to beach',
        values: ['Direct oceanfront', '~5-minute walk through dunes', '5–10 minutes walk through community'],
        advantage: 'left',
        commentary:
          'Only the Omni is true oceanfront. Sonesta\'s shorter walk is fine for most travelers; Marriott Grande Ocean varies by villa building (some closer, some further).',
      },
      {
        name: 'Pool scene',
        values: ['3 outdoor + 1 indoor; activity-driven', '2 outdoor + 1 indoor; quieter', '1 large outdoor + 2 satellite'],
        advantage: 'left',
        commentary:
          'Omni\'s pools have the most programming (DJ, games, kids activities). Sonesta is quieter. Marriott Grande Ocean has a respectable pool but timeshare-style energy.',
      },
      {
        name: 'Room / villa size',
        values: ['Hotel rooms 350–550 sq ft', 'Hotel rooms 350–500 sq ft', '2BR villas 1,100–1,300 sq ft'],
        advantage: 'right',
        commentary:
          'Marriott Grande Ocean\'s 2BR villas are ~3× the square footage of a hotel room. For families or groups of 4+, this is the decisive factor.',
      },
      {
        name: 'Kitchen / washer dryer',
        values: ['Mini-fridge + microwave', 'Mini-fridge + microwave', 'Full kitchen + W/D in unit'],
        advantage: 'right',
        commentary:
          'Marriott Grande Ocean\'s in-unit kitchen and laundry make 5+ night stays meaningfully cheaper (cooking breakfast in, doing laundry mid-trip).',
      },
      {
        name: 'On-property dining',
        values: ['3 full restaurants + pool bar', '2 restaurants + pool bar', '1 restaurant (limited hours)'],
        advantage: 'left',
        commentary:
          'Omni has the most on-property dining. Marriott Grande Ocean assumes you\'ll cook in or eat at the Palmetto Dunes pool restaurants nearby.',
      },
      {
        name: 'Resort fee (2026)',
        values: ['~$30/night', '~$25/night', 'None (HOA included in nightly rate)'],
        advantage: 'right',
        commentary:
          'Marriott Grande Ocean rolls all community fees into the nightly rate — easier to compare apples-to-apples. Omni and Sonesta resort fees are added at booking.',
      },
      {
        name: 'Family-friendliness',
        values: ['Strong (Camp Omni, family pool, marina nearby)', 'Moderate (kid pool, less programming)', 'Strong (villa space, kid pool, in-unit kitchen)'],
        advantage: 'tie',
        commentary:
          'Omni for activity-heavy families. Marriott Grande Ocean for space-heavy families. Sonesta works for both but has the least kid-aimed programming.',
      },
      {
        name: 'Price range (peak summer)',
        values: ['$450–$900/night', '$300–$600/night', '$425–$700/night (per villa, not per room)'],
        advantage: 'middle',
        commentary:
          'Sonesta is the cheapest entry point. Marriott Grande Ocean\'s per-villa pricing distributes across 4–6 people, making it the cheapest per-person for groups.',
      },
    ],
    faqs: [
      {
        question: 'Which of the three has the best beach access?',
        answer:
          'The Omni — it\'s the only one of the three that\'s truly oceanfront. Sonesta is a 5-minute dune-path walk away. Marriott Grande Ocean varies by villa building (the closest are 3-minute walks, the furthest are 10).',
      },
      {
        question: 'Is the Sonesta worth it given the beach walk?',
        answer:
          'For most travelers, yes — the 5-minute dune walk is shorter than it sounds and the price is meaningfully below true oceanfront. Couples and families who don\'t plan to bounce in and out of the room all day rarely regret the choice.',
      },
      {
        question: 'Marriott Grande Ocean or Marriott Surfwatch?',
        answer:
          'Marriott Grande Ocean for the bigger pool scene and Palmetto Dunes proximity. Surfwatch for slightly newer construction (2008+) and a more secluded feel. Both are MVC inventory; pricing usually breaks similar.',
      },
      {
        question: 'Which has the best deal for a family of 4?',
        answer:
          'Marriott Grande Ocean almost always wins on per-person cost. A 2BR/2BA villa at ~$550/night for 4 people works out to $137/person/night with kitchen and laundry included. Two hotel rooms at the Omni or Sonesta will run higher per person and you give up the kitchen.',
      },
      {
        question: 'Can I use points at any of these?',
        answer:
          'Omni — Select Guest points. Sonesta — Sonesta Travel Pass. Marriott Grande Ocean — Marriott Bonvoy points (relatively expensive in points; usually a poor cash-vs-points trade). For Marriott Bonvoy-loyal travelers, the Westin or the Marriott Grande Ocean / Surfwatch / Barony cluster is where the points work.',
      },
    ],
    relatedSlugs: ['westin-vs-omni-hilton-head', 'sea-pines-vs-palmetto-dunes'],
    keywords: [
      'Omni vs Sonesta vs Marriott Hilton Head',
      'best Hilton Head resort',
      'Hilton Head resort comparison',
      'Marriott Grande Ocean vs Omni',
      'Sonesta vs Omni Hilton Head',
    ],
  },
];

/** Convenience lookup. */
export function getComparisonBySlug(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
