/**
 * Hilton Head Local Business Directory
 *
 * Data for /local — the curated business guide and B2B lead-gen surface.
 *
 * CONTENT NOTE: Specific facts (addresses, phone numbers, hours, years
 * established) are marked // TODO: VERIFY — confirm these before publishing.
 * Review text is deliberately written in evergreen editorial language;
 * avoid time-sensitive superlatives that age poorly.
 *
 * IMAGES: heroImage.src placeholders are marked // TODO: REPLACE with actual
 * business photos. Use 800×600 px images, compressed to <200 KB.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IndustrySlug =
  | 'restaurants'
  | 'golf'
  | 'water-activities'
  | 'weddings'
  | 'spas-wellness'
  | 'vacation-rentals'
  | 'shopping'
  | 'family-activities';

export type Industry = {
  slug: IndustrySlug;
  name: string;
  icon: string;
  tagline: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  description: string;
  keywords: string[];
  heroImage: { src: string; alt: string };
  faqs: Array<{ question: string; answer: string }>;
};

export type Business = {
  /** URL-safe unique ID within the industry. */
  id: string;
  industrySlug: IndustrySlug;
  /** true = featured partner slot (top of page, premium card) */
  featured: boolean;
  name: string;
  tagline: string;
  /** Schema.org type string for JSON-LD */
  schemaType: string;
  /** UI category chips */
  categories: string[];
  /** $ | $$ | $$$ | $$$$ */
  priceRange?: string;
  /** 2-3 sentence editorial review. No invented facts; flag uncertain details. */
  review: string;
  /** 1-2 sentence standout reason shown in card body. */
  notableFor: string;
  address: string;
  city: string;
  phone?: string;
  website?: string;
  /** Display string, e.g. "Daily 11am–10pm" */
  hours?: string;
  instagram?: string;
  facebook?: string;
  heroImage: {
    /** Empty string = use placeholder. TODO: Replace with actual business photo. */
    src: string;
    alt: string;
    credit?: string;
  };
  lat?: number;
  lng?: number;
};

// ---------------------------------------------------------------------------
// Industry definitions (all 8)
// ---------------------------------------------------------------------------

export const industries: Industry[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants & Dining',
    icon: '🦞',
    tagline: "Hilton Head's best tables, from dockside to fine dining.",
    seoTitle: 'Best Restaurants in Hilton Head Island, SC (2026)',
    metaDescription:
      'The top 10 restaurants on Hilton Head Island — from waterfront seafood houses to French bistros and rooftop bars. Curated by locals who eat here every week.',
    h1: 'Best Restaurants in Hilton Head Island',
    description:
      "Hilton Head has more than 250 restaurants, but only a handful are worth planning your evening around. This is our working list of the ten we actually send clients to — the ones that have earned their reputation over years and still show up consistently. From Lowcountry classics on the docks to Italian fine dining and a rooftop bar with genuine sunset views, these are the tables that define eating well on the island.",
    keywords: [
      'best restaurants hilton head island',
      'hilton head island dining',
      'hilton head seafood restaurants',
      'hilton head waterfront dining',
      'top restaurants hilton head sc',
      'hilton head island food guide',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format',
      alt: 'Waterfront restaurant dining on Hilton Head Island',
    },
    faqs: [
      {
        question: 'Do I need reservations at Hilton Head restaurants?',
        answer: 'For dinner at any of the top tables — yes, especially in summer. Hudson\'s, Charlie\'s L\'Etoile Verte, and Poseidon book out weeks ahead in July and August. Call or use OpenTable at least a week in advance in peak season. Off-season (October–March) you can often walk in.',
      },
      {
        question: 'What kind of food is Hilton Head known for?',
        answer: "Lowcountry seafood: fresh shrimp, oysters from Daufuskie and the May River, crab, and locally caught fish. You'll find this style at Hudson's, Old Oyster Factory, and Fishcamp on Broad Creek. The island also has strong Italian, French, and contemporary American options.",
      },
      {
        question: 'Is there a good happy hour on Hilton Head?',
        answer: "Several spots run strong happy hours: Skull Creek Boathouse has well-priced raw bar specials at the bar seats. Poseidon's rooftop is especially good at sunset. One Hot Mama's runs regular drink specials through the week.",
      },
      {
        question: 'Where do locals eat on Hilton Head?',
        answer: "A Lowcountry Backyard gets consistent local love for its unpretentious take on Lowcountry cuisine. Charlie's L'Etoile Verte has been a local institution for decades. Truffles Cafe is where the year-round crowd goes on a Tuesday night.",
      },
    ],
  },
  {
    slug: 'golf',
    name: 'Golf Courses & Clubs',
    icon: '⛳',
    tagline: 'World-class fairways from Pete Dye to Jack Nicklaus.',
    seoTitle: 'Best Golf Courses on Hilton Head Island, SC (2026)',
    metaDescription:
      'Top golf courses on Hilton Head Island — Harbour Town Golf Links, Palmetto Dunes, and the best public and semi-private courses. Ranked by locals.',
    h1: 'Best Golf Courses on Hilton Head Island',
    description:
      "Hilton Head Island has more than 20 championship golf courses packed into 12 miles of island. The range is genuine — from the PGA Tour's crown jewel at Harbour Town to oceanfront resort courses and Lowcountry layouts winding through live oaks and tidal marshes. This is our ranked guide to the ten worth booking a tee time on.",
    keywords: [
      'best golf courses hilton head island',
      'hilton head golf courses ranked',
      'harbour town golf links tee times',
      'palmetto dunes golf hilton head',
      'hilton head public golf courses',
      'hilton head golf trip guide',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&q=80&auto=format',
      alt: 'Golf course fairway with Lowcountry live oaks on Hilton Head Island',
    },
    faqs: [
      {
        question: 'How many golf courses are on Hilton Head Island?',
        answer: 'There are more than 20 championship golf courses on and immediately around Hilton Head Island, with additional courses in nearby Bluffton. Sea Pines alone has three — including Harbour Town Golf Links, host of the PGA Tour\'s RBC Heritage.',
      },
      {
        question: 'Is Harbour Town Golf Links open to the public?',
        answer: 'Harbour Town Golf Links is a semi-private course within Sea Pines Resort. Non-resort guests can book tee times but pay a higher green fee. During the RBC Heritage tournament week in April, the course is closed to public play.',
      },
      {
        question: 'What is the best golf course in Hilton Head for beginners?',
        answer: 'The George Fazio Course at Palmetto Dunes is widely considered the most forgiving of the premier resort courses — wide fairways and relatively few forced carries. Hilton Head National also has courses that work well for higher-handicap players.',
      },
      {
        question: 'Can I book a golf package on Hilton Head?',
        answer: 'Yes — most Hilton Head travel consultants including Hilton Ahead specialize in building golf packages combining villa accommodation with pre-booked tee times at multiple courses. Booking these together (rather than separately) typically saves money and ensures preferred tee times.',
      },
    ],
  },
  {
    slug: 'water-activities',
    name: 'Water Activities & Tours',
    icon: '🐬',
    tagline: 'Dolphin tours, kayaking, parasailing, and the best of Calibogue Sound.',
    seoTitle: 'Best Water Activities & Tours on Hilton Head Island (2026)',
    metaDescription:
      'Top water activity operators on Hilton Head Island: dolphin tours, kayak tours, parasailing, paddleboarding, fishing charters, and sunset cruises.',
    h1: 'Best Water Activities & Tours on Hilton Head Island',
    description:
      "Hilton Head is surrounded by water on three sides — the Atlantic Ocean, Calibogue Sound, and a network of tidal creeks and lagoons — and the water activity scene reflects it. These are the ten operators we trust for everything from a gentle dolphin kayak tour with kids to a full-day offshore fishing charter.",
    keywords: [
      'hilton head water activities',
      'hilton head dolphin tours',
      'hilton head kayak tours',
      'hilton head parasailing',
      'hilton head boat tours',
      'hilton head island watersports',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80&auto=format',
      alt: 'Kayaking through Hilton Head Island tidal creeks',
    },
    faqs: [
      {
        question: 'What water activities are best for families with young kids?',
        answer: 'Dolphin kayak tours (Kayak Hilton Head and Outside Hilton Head both run beginner-friendly tours) are excellent for kids 6 and up. H2O Sports at Palmetto Dunes offers protected lagoon paddleboarding that works well with young children. For something with a bigger wow factor, a short catamaran dolphin cruise is reliably impressive.',
      },
      {
        question: 'What is the best time of year for water activities on Hilton Head?',
        answer: 'June through September for swimming and watersports (warm water, full schedule). April and May and September and October for kayaking and tours (comfortable temperature, no crowds). Dolphin watching is good year-round — bottlenose dolphins are resident in the Sound — but summer has the most sighting opportunities.',
      },
      {
        question: 'Do I need to book water activities in advance?',
        answer: 'In summer (June–August), popular tours like the sunset dolphin cruise and shark fishing can sell out a week ahead. Book as soon as you know your dates. In shoulder seasons (April–May, September–October), 2–3 days ahead is usually fine.',
      },
      {
        question: 'Where do most water activity tours depart from?',
        answer: 'Shelter Cove Harbour & Marina (mid-island) is the main hub — dolphin tours, fishing charters, and kayak rentals all operate from here. H2O Sports is based at Palmetto Dunes. Outside Hilton Head operates from multiple locations.',
      },
    ],
  },
  {
    slug: 'weddings',
    name: 'Weddings & Events',
    icon: '💍',
    tagline: 'Oceanfront ceremonies, Lowcountry receptions, and the best vendors on the island.',
    seoTitle: 'Best Wedding Venues & Planners on Hilton Head Island (2026)',
    metaDescription:
      'Top wedding venues, planners, and photographers on Hilton Head Island — oceanfront resorts, private estates, and boutique planners who know the island.',
    h1: 'Best Wedding Venues & Planners on Hilton Head Island',
    description:
      "Hilton Head has been a destination wedding location for decades — the combination of 12 miles of beach, championship golf resort settings, and a roster of genuinely talented local vendors makes it one of the Southeast's premier wedding destinations. These are the venues and vendors we'd confidently recommend to guests planning a Hilton Head wedding.",
    keywords: [
      'hilton head island wedding venues',
      'hilton head wedding planners',
      'hilton head beach wedding',
      'hilton head destination wedding',
      'hilton head wedding photographers',
      'best wedding venues hilton head sc',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format',
      alt: 'Beach wedding ceremony on Hilton Head Island',
    },
    faqs: [
      {
        question: 'Can you have a beach wedding on Hilton Head Island?',
        answer: 'Yes — beach ceremonies are allowed on Hilton Head Island beaches with a town permit. Most wedding planners handle the permitting process as part of their service. The most popular ceremony spots are in front of Sea Pines Beach Club and along the protected stretches of North Forest Beach.',
      },
      {
        question: 'What is the best time of year for a Hilton Head wedding?',
        answer: 'April, May, and October are the most popular months — comfortable temperatures (70s–low 80s), lower humidity than July/August, and beautiful light. June has increasingly become popular as well. Avoid July and August for outdoor ceremonies if heat is a concern.',
      },
      {
        question: 'How far in advance should I book a Hilton Head wedding venue?',
        answer: 'For peak season (April, May, October) at major venues like Sea Pines or the Omni, 12–18 months ahead is common for Saturday dates. Weekday and Sunday weddings and smaller venues have more flexibility. Start your venue search as soon as your date range is confirmed.',
      },
      {
        question: 'Does Hilton Head have a wedding planning concierge service?',
        answer: 'Hilton Ahead offers group travel and wedding concierge services — coordinating guest accommodations, villa rentals for the wedding party, and on-island logistics. Contact us via the itinerary form to discuss your event.',
      },
    ],
  },
  {
    slug: 'spas-wellness',
    name: 'Spas & Wellness',
    icon: '🌿',
    tagline: 'From oceanfront resort spas to beloved local day spas.',
    seoTitle: 'Best Spas & Wellness Centers on Hilton Head Island (2026)',
    metaDescription:
      'Top spas, massage studios, and wellness centers on Hilton Head Island. From the Westin\'s Heavenly Spa to boutique day spas and beach yoga specialists.',
    h1: 'Best Spas & Wellness on Hilton Head Island',
    description:
      "The wellness scene on Hilton Head is quietly excellent — deep-tissue therapists who've been working on island visitors for decades, resort spas with ocean views, and a handful of boutique studios that punch above their weight. This is our guide to the ten worth knowing about.",
    keywords: [
      'hilton head island spas',
      'best spa hilton head island',
      'hilton head day spa',
      'hilton head massage',
      'hilton head wellness center',
      'westin spa hilton head',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80&auto=format',
      alt: 'Spa treatment room on Hilton Head Island',
    },
    faqs: [
      {
        question: 'Which spa on Hilton Head Island is best for couples?',
        answer: "The Heavenly Spa at the Westin is the go-to for couples packages — they have dedicated couples' treatment suites and the outdoor garden setting is genuinely beautiful. The Art of Massage & Yoga also offers excellent couples massage options.",
      },
      {
        question: 'Is there beach yoga on Hilton Head Island?',
        answer: 'Yes — The Art of Massage & Yoga runs group beach yoga sessions through the warmer months. A few independent instructors also offer sunrise beach yoga classes. Advance booking is required for beach sessions.',
      },
      {
        question: 'Do I need to book spa treatments in advance on Hilton Head?',
        answer: 'In summer, the resort spas (Westin, Omni) book out 1–2 weeks ahead for popular weekend time slots. Boutique day spas are generally easier to access on shorter notice. Call ahead whenever possible.',
      },
      {
        question: 'Are there spas inside the Hilton Head resorts?',
        answer: "The Westin Hilton Head Island Resort & Spa has the island's most prominent resort spa (Heavenly Spa). The Omni Hilton Head Oceanfront Resort also has a full spa. Sea Pines Resort has spa services at their Beach Club.",
      },
    ],
  },
  {
    slug: 'vacation-rentals',
    name: 'Vacation Rental Companies',
    icon: '🏡',
    tagline: 'Local management companies with the best villa inventory on the island.',
    seoTitle: 'Best Vacation Rental Companies on Hilton Head Island (2026)',
    metaDescription:
      'Top vacation rental companies on Hilton Head Island — who manages the best properties, their specialties, and what to know before booking direct.',
    h1: 'Best Vacation Rental Companies on Hilton Head Island',
    description:
      "Hilton Head has dozens of vacation rental management companies, but the ones worth calling are the locally owned firms with deep inventory relationships — companies where someone actually picks up the phone and knows which buildings were last renovated and which have pool maintenance issues. This is our guide to the ten management companies that consistently deliver for clients.",
    keywords: [
      'hilton head island vacation rental companies',
      'best vacation rentals hilton head',
      'hilton head villa rental management',
      'hilton head property management',
      'hilton head vacation rental agents',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format',
      alt: 'Luxury oceanfront villa on Hilton Head Island',
    },
    faqs: [
      {
        question: 'Is it better to book a Hilton Head villa directly or through a travel consultant?',
        answer: 'For a standard 1-week booking, direct booking with the management company is fine. For group trips, wedding parties, multi-villa bookings, or specific requests (golf-adjacent, pet-friendly, fenced yard), working with a consultant like Hilton Ahead saves time — we maintain relationships with multiple firms and can compare inventory across companies quickly.',
      },
      {
        question: 'Which vacation rental companies have the best oceanfront inventory on Hilton Head?',
        answer: 'Beach Properties of Hilton Head, The Vacation Company, and Seashore Vacations consistently have strong oceanfront and oceanside inventory. Island Getaway Rentals specializes in the Sea Pines and Palmetto Dunes neighborhoods. For luxury properties specifically, Destination Vacation HHI and Sunset Rentals focus on the premium segment.',
      },
      {
        question: 'When should I book a Hilton Head vacation rental?',
        answer: 'Peak summer (late June–August): 4–6 months ahead for the best properties. Spring break and RBC Heritage week (April): 3–4 months ahead. Shoulder seasons (May, September, October): 2–3 months is usually fine. Holiday weeks (Thanksgiving, Christmas/New Year): book 6+ months ahead.',
      },
      {
        question: 'Are there minimum stay requirements for Hilton Head vacation rentals?',
        answer: 'Most summer rentals have a 7-night minimum starting Saturday. Shoulder seasons often allow 3–4 night minimums. Winter and long-stay rentals (30+ days, popular with snowbirds) are their own category with monthly pricing structures.',
      },
    ],
  },
  {
    slug: 'shopping',
    name: 'Shopping & Boutiques',
    icon: '🛍️',
    tagline: 'Local boutiques, art galleries, and the island\'s best shopping corridors.',
    seoTitle: 'Best Shopping on Hilton Head Island: Boutiques & Local Stores (2026)',
    metaDescription:
      'The best shopping on Hilton Head Island — local boutiques, art galleries, surf shops, and specialty stores across Coligny Plaza, Harbour Town, and Shelter Cove.',
    h1: 'Best Shopping on Hilton Head Island',
    description:
      "Hilton Head's shopping scene is concentrated at a few distinct nodes: Coligny Plaza near Forest Beach, the boutique-filled marina walkways at Harbour Town in Sea Pines, and the waterfront shops at Shelter Cove. Here are the ten local shops and galleries worth browsing.",
    keywords: [
      'hilton head island shopping',
      'hilton head boutiques',
      'coligny plaza shopping',
      'harbour town shops hilton head',
      'hilton head art galleries',
      'best shops hilton head sc',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format',
      alt: 'Shopping boutiques and galleries on Hilton Head Island',
    },
    faqs: [
      {
        question: 'Where is the best shopping on Hilton Head Island?',
        answer: "Coligny Plaza (Forest Beach) is the most accessible and busiest shopping area — mix of surf shops, boutiques, restaurants, and casual stores, all walkable from Coligny Beach. Harbour Town in Sea Pines has higher-end boutiques and galleries in a marina setting. Shelter Cove Town Centre offers a more polished outdoor mall experience.",
      },
      {
        question: 'Is there an outlet mall near Hilton Head?',
        answer: "There's no outlet mall on Hilton Head Island itself. The closest options are in Savannah, GA (~45 minutes), which has Tanger Outlets and several retail centers near I-95.",
      },
      {
        question: 'Are there art galleries on Hilton Head Island?',
        answer: "Yes — Harbour Town in Sea Pines has several galleries specializing in Lowcountry and coastal art. The Arts Center of Coastal Carolina in Shelter Cove area also showcases local and regional artists. The annual Fall and Spring Studio Tours give access to working artist studios across the island.",
      },
      {
        question: 'What local souvenirs are worth buying on Hilton Head?',
        answer: "Lowcountry artwork (especially pluff mud paintings and coastal photography), local honey and jams, sweetgrass baskets from Gullah artisans, and branded gear from the RBC Heritage golf tournament. Avoid the generic beach-town merchandise and look for work by island-based artists at Harbour Town galleries.",
      },
    ],
  },
  {
    slug: 'family-activities',
    name: 'Family & Kids Activities',
    icon: '🎡',
    tagline: 'Mini golf, water parks, nature centers, and genuine kid-rated fun.',
    seoTitle: 'Best Family Activities for Kids on Hilton Head Island (2026)',
    metaDescription:
      'Top family and kids activities on Hilton Head Island — mini golf, the Coastal Discovery Museum, kayak tours, horseback rides, and the best nature programs.',
    h1: 'Best Family & Kids Activities on Hilton Head Island',
    description:
      "Hilton Head is an excellent family destination — it was essentially designed as a low-car, nature-forward resort community, which means kids can bike to the beach, explore maritime forests, catch crabs off the docks, and do something meaningful every day without getting in a car. These are the ten activities families consistently love.",
    keywords: [
      'hilton head island family activities',
      'hilton head kids activities',
      'hilton head with children',
      'hilton head family vacation',
      'things to do with kids hilton head',
      'hilton head island mini golf',
    ],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1569317002804-ab77bc7f8a7f?w=1200&q=80&auto=format',
      alt: 'Family activities and outdoor fun on Hilton Head Island',
    },
    faqs: [
      {
        question: 'What age range is Hilton Head best for?',
        answer: 'It works well across all ages. For toddlers (2–5): the flat bike trails, calm protected lagoon water, and large beach are ideal. For school-age (6–12): biking, dolphin kayak tours, mini golf, and the Coastal Discovery Museum hit the sweet spot. Teens enjoy parasailing, paddleboarding, and the beach scene at Coligny.',
      },
      {
        question: 'What is the most popular family activity on Hilton Head?',
        answer: 'Biking is consistently the top family activity — you can rent bikes delivered to your villa, and the 60+ miles of paved trails are flat, safe, and connect the whole island. Dolphin tours are a close second.',
      },
      {
        question: 'Is there a water park on Hilton Head Island?',
        answer: 'Shelter Cove Community Park has a spray-ground water play area for younger kids. Palmetto Dunes has extensive lagoon water play opportunities. For a full water park, the closest option is in Savannah, GA (~45 minutes).',
      },
      {
        question: 'What is the Coastal Discovery Museum?',
        answer: "The Coastal Discovery Museum at Honey Horn Plantation is one of the island's best family attractions — 68 acres of tabby ruins, live oaks, working gardens, and coastal habitats. They run exceptional nature programs for kids year-round, many free or low-cost with the standard admission.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Businesses — Food & Beverage (10 complete profiles for PR A)
// ---------------------------------------------------------------------------

// NOTE ON VERIFICATION: All addresses, phone numbers, and hours below are
// sourced from web research and are flagged // TODO: VERIFY. Confirm before
// publishing. All photography placeholders should be replaced with real
// business images. Review text is editorial and intentionally evergreen.

const fbBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'salty-dog-cafe',
    industrySlug: 'restaurants',
    featured: true,
    name: "The Salty Dog Cafe",
    tagline: "South Beach Marina's iconic open-air cafe and Hilton Head's most recognized landmark.",
    schemaType: 'Restaurant',
    categories: ['Seafood', 'Casual Dining', 'Bar', 'Waterfront', 'Iconic'],
    priceRange: '$$',
    review:
      "The Salty Dog Cafe is as much a cultural institution as it is a restaurant. Sitting at the edge of South Beach Marina in Sea Pines, it has been serving cold drinks and fresh seafood to generations of Hilton Head visitors since 1987. The logo is on half the T-shirts you'll see on the island, the dogs lounging by the outdoor tables are regulars, and the marina setting makes every visit feel unhurried in the right way.",
    notableFor:
      "The most recognized restaurant brand on Hilton Head Island — the open-air deck on South Beach Marina is the quintessential warm-evening dinner spot.",
    address: '232 S Sea Pines Dr', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-2233', // TODO: VERIFY
    website: 'https://www.thesaltydog.com',
    hours: 'Daily 11am–10pm (seasonal hours vary)', // TODO: VERIFY
    instagram: 'thesaltydogcafe',
    heroImage: {
      src: '', // TODO: REPLACE with actual Salty Dog Cafe photo
      alt: 'The Salty Dog Cafe at South Beach Marina, Sea Pines, Hilton Head Island',
    },
    lat: 32.1459,
    lng: -80.8089,
  },
  // ——— Regular listings ———
  {
    id: 'hudsons-seafood',
    industrySlug: 'restaurants',
    featured: false,
    name: "Hudson's Seafood House on the Docks",
    tagline: "Fresh-off-the-boat seafood at Hilton Head's oldest working marina.",
    schemaType: 'Restaurant',
    categories: ['Seafood', 'Waterfront', 'Family-Friendly', 'Lowcountry', 'Classic'],
    priceRange: '$$$',
    review:
      "Hudson's has been operating at its working dock location since 1967, and the fact that it still sources its shrimp, oysters, and fish from local fishermen makes it rare among waterfront restaurants in any beach town. The view over the creek is genuine — you'll watch actual shrimp boats unload while you eat. It's not the flashiest dining experience on the island, but it's one of the most honest.",
    notableFor:
      "One of the oldest restaurants on Hilton Head Island, with direct relationships with local fishing boats and a dock setting that's the real thing.",
    address: '1 Hudson Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 681-2772', // TODO: VERIFY
    website: 'https://www.hudsonsseafood.com',
    hours: 'Lunch and dinner daily (seasonal hours)', // TODO: VERIFY exact hours
    heroImage: {
      src: '', // TODO: REPLACE with actual Hudson's photo
      alt: "Hudson's Seafood House on the Docks, Hilton Head Island",
    },
    lat: 32.2354,
    lng: -80.7892,
  },
  {
    id: 'skull-creek-boathouse',
    industrySlug: 'restaurants',
    featured: false,
    name: 'Skull Creek Boathouse',
    tagline: 'Waterfront bar, raw bar, and all-day dining with some of the best sunset views on the island.',
    schemaType: 'Restaurant',
    categories: ['Waterfront', 'Bar', 'Casual Dining', 'Sunset Views', 'American'],
    priceRange: '$$',
    review:
      "Skull Creek Boathouse occupies a prime spot on the creek where the water traffic is constant — boats, kayakers, and the occasional dolphin pass by throughout the evening. The raw bar seats are the move: order oysters, grab a drink, and watch the light change over the marsh. The food is reliably good and the energy is reliably relaxed — it's one of those places that works equally well for a family lunch or a long sundowner with friends.",
    notableFor:
      "One of the best raw bar setups on the island, with waterfront Skull Creek views that make the hour before sunset genuinely worth planning around.",
    address: '397 Squire Pope Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 681-3663', // TODO: VERIFY
    website: 'https://www.skullcreekboathouse.com',
    hours: 'Daily 11am–10pm (seasonal)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual Skull Creek Boathouse photo
      alt: 'Skull Creek Boathouse waterfront dining, Hilton Head Island',
    },
  },
  {
    id: 'old-oyster-factory',
    industrySlug: 'restaurants',
    featured: false,
    name: 'Old Oyster Factory',
    tagline: "Broad Creek waterfront dining in a converted 1920s oyster cannery.",
    schemaType: 'Restaurant',
    categories: ['Seafood', 'Waterfront', 'Oysters', 'Romantic', 'Classic'],
    priceRange: '$$$',
    review:
      "The Old Oyster Factory's appeal is the combination of genuine history — the building is a converted 1920s cannery on the banks of Broad Creek — and a menu that still centers the oysters that built it. The views across the marsh are excellent, the setting sun behind the dock is the kind of cliché that earns its reputation, and the fresh oyster selection is among the best on the island.",
    notableFor:
      "The best oyster selection on Hilton Head Island, served in a converted historic cannery on Broad Creek — one of the island's most romantic dinner settings.",
    address: '101 Marshland Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 681-6040', // TODO: VERIFY
    website: 'https://www.oldoysterfactory.com',
    hours: 'Dinner nightly; limited lunch (seasonal)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual Old Oyster Factory photo
      alt: 'Old Oyster Factory restaurant on Broad Creek, Hilton Head Island',
    },
    lat: 32.2078,
    lng: -80.7634,
  },
  {
    id: 'charlies-letoile-verte',
    industrySlug: 'restaurants',
    featured: false,
    name: "Charlie's L'Etoile Verte",
    tagline: "A Hilton Head institution: French bistro standards, consistently delivered for over 40 years.",
    schemaType: 'Restaurant',
    categories: ['French', 'Fine Dining', 'Romantic', 'Classic', 'Long-Established'],
    priceRange: '$$$',
    review:
      "Charlie's L'Etoile Verte is where the island's long-term residents eat when they want a serious dinner. The French bistro menu — escargot, crab cakes, duck, filet — has been reliably executed for more than four decades, which is an exceptional track record in a beach town where restaurants turn over quickly. The room is warm, the wine list is thoughtful, and the service is unhurried in the European style.",
    notableFor:
      "One of Hilton Head's oldest continuously operating restaurants and the island's most trusted fine-dining option — French bistro cooking done consistently well.",
    address: '8 New Orleans Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-9277', // TODO: VERIFY
    // website: '', // TODO: VERIFY if website exists
    hours: 'Dinner Tue–Sun; closed Mon (seasonal — TODO: VERIFY)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual Charlie's photo
      alt: "Charlie's L'Etoile Verte French bistro, Hilton Head Island",
    },
  },
  {
    id: 'one-hot-mamas',
    industrySlug: 'restaurants',
    featured: false,
    name: "One Hot Mama's American Grill",
    tagline: 'Award-winning BBQ, bold flavors, and the kind of casual energy that makes a place a true local favorite.',
    schemaType: 'Restaurant',
    categories: ['BBQ', 'American', 'Casual', 'Award-Winning', 'Family-Friendly'],
    priceRange: '$$',
    review:
      "One Hot Mama's has been racking up Best of the Island awards for its BBQ since the early 2000s, and the Greenwood Drive location has become a genuine locals' hangout in a way that's harder to manufacture than it looks. The ribs and pulled pork are the anchors; the cocktail program is stronger than you'd expect; the service is warm and unpretentious. It's a useful option for groups where tastes diverge — carnivore and non-carnivore, kids and adults.",
    notableFor:
      "Consistently one of the top-voted restaurants in Hilton Head Island's local awards, with a BBQ program that's been winning for over two decades.",
    address: '7 Greenwood Dr', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 682-6262', // TODO: VERIFY
    website: 'https://www.onehotmamas.com',
    hours: 'Daily from 11:30am (seasonal hours)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual One Hot Mama's photo
      alt: "One Hot Mama's American Grill, Hilton Head Island",
    },
  },
  {
    id: 'a-lowcountry-backyard',
    industrySlug: 'restaurants',
    featured: false,
    name: 'A Lowcountry Backyard Restaurant',
    tagline: 'Lowcountry cooking without the tourist markup — where locals actually eat.',
    schemaType: 'Restaurant',
    categories: ['Lowcountry', 'Casual', 'Local Favorite', 'American', 'Farm-to-Table'],
    priceRange: '$$',
    review:
      "A Lowcountry Backyard has the thing that's genuinely hard to fake in a resort town: the sense that the people eating there actually live nearby. It bills itself as farm-to-table Lowcountry cuisine, and the menu follows through — shrimp and grits, she-crab soup, grouper preparations — with enough execution consistency to justify the frequent appearances on local \"best of\" lists. Good for a relaxed weeknight dinner when you want to eat well without the production.",
    notableFor:
      "One of the most respected locally-owned restaurants on the island for its genuine Lowcountry farm-to-table approach — a consistent presence on local best-of lists.",
    address: '32 Palmetto Bay Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-9273', // TODO: VERIFY
    website: 'https://www.alowcountrybackyard.com',
    hours: 'Lunch and dinner (seasonal hours — TODO: VERIFY)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual A Lowcountry Backyard photo
      alt: 'A Lowcountry Backyard Restaurant, Hilton Head Island',
    },
  },
  {
    id: 'poseidon-hhi',
    industrySlug: 'restaurants',
    featured: false,
    name: 'Poseidon',
    tagline: "Rooftop views over Shelter Cove marina, a strong craft cocktail program, and the island's most ambitious upscale menu.",
    schemaType: 'Restaurant',
    categories: ['Upscale', 'Rooftop', 'Cocktails', 'Waterfront', 'Modern American'],
    priceRange: '$$$',
    review:
      "Poseidon occupies the rooftop position at Shelter Cove Harbour, and the combination of marina views, an ambitious cocktail list, and seafood preparations that lean contemporary rather than classic gives it a different energy from most Hilton Head waterfront dining. The kitchen focuses on coastal-sourced ingredients executed with more technique than typical beach town cooking. It's the right place for a night out that's specifically not casual.",
    notableFor:
      "The island's best rooftop dining — marina views from the top floor, a craft cocktail program that takes itself seriously, and cooking that earns its upscale positioning.",
    address: '1 Shelter Cove Ln', // TODO: VERIFY exact address
    city: 'Hilton Head Island, SC 29928',
    // phone: '', // TODO: FIND phone number
    website: 'https://www.poseidonhhi.com',
    hours: 'Dinner nightly (seasonal hours)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual Poseidon photo
      alt: 'Poseidon rooftop restaurant at Shelter Cove, Hilton Head Island',
    },
    lat: 32.1997,
    lng: -80.7549,
  },
  {
    id: 'gusto-ristorante',
    industrySlug: 'restaurants',
    featured: false,
    name: 'Gusto Ristorante',
    tagline: 'Northern Italian cooking from a Roman chef — one of the island\'s best chef-driven dining rooms.',
    schemaType: 'Restaurant',
    categories: ['Italian', 'Fine Dining', 'Romantic', 'Chef-Driven', 'Classic'],
    priceRange: '$$$',
    review:
      "Gusto Ristorante is owned and operated by chef Giancarlo Balestra, who brought Northern Italian technique to Hilton Head and has maintained a quiet but consistent following among the island's discerning regulars. The pasta is made in-house, the wine list leans Italian, and the room in Sea Turtle Marketplace is low-key elegant in the way that lets the food do the talking. Among Italian options on the island, it's in a category of its own.",
    notableFor:
      "Chef-owned Italian fine dining with in-house pasta and a genuinely Roman culinary pedigree — the strongest Italian table on Hilton Head Island.",
    address: '6 Executive Park Rd', // TODO: VERIFY exact address within Sea Turtle Marketplace
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-3600', // TODO: VERIFY
    // website: '', // TODO: FIND website
    hours: 'Dinner Tue–Sun (seasonal — TODO: VERIFY)', // TODO: VERIFY
    heroImage: {
      src: '', // TODO: REPLACE with actual Gusto photo
      alt: 'Gusto Ristorante Italian restaurant, Hilton Head Island',
    },
  },
  {
    id: 'truffles-cafe',
    industrySlug: 'restaurants',
    featured: false,
    name: "Truffles Cafe",
    tagline: "Hilton Head's longest-running bistro — since 1983, the dependable neighborhood classic.",
    schemaType: 'Restaurant',
    categories: ['American', 'Bistro', 'Classic', 'Casual', 'Established'],
    priceRange: '$$',
    review:
      "Truffles Cafe has been feeding Hilton Head Island since 1983 — an almost unbelievable run in a beach market where restaurants rarely outlast a decade. The menu occupies the intelligent middle ground: Jumbo Lump Crab Cakes, Gourmet Chicken Pot Pie, Southern-inflected pastas and salads, nothing trying too hard. It's the kind of place where islanders bring visiting parents who don't want to deal with a loud bar scene or experimental cooking.",
    notableFor:
      "One of the oldest continuously operating restaurants on Hilton Head Island — 40+ years of consistent Lowcountry-influenced bistro cooking in a low-key setting.",
    address: '71 Lighthouse Rd', // TODO: VERIFY — Truffles has had multiple locations; confirm current address
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-6136', // TODO: VERIFY
    website: 'https://www.trufflescafe.com',
    hours: 'Lunch and dinner daily (seasonal)', // TODO: VERIFY exact hours
    heroImage: {
      src: '', // TODO: REPLACE with actual Truffles Cafe photo
      alt: "Truffles Cafe, Hilton Head Island, South Carolina",
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Water Activities (10 profiles)
// ---------------------------------------------------------------------------

const waterBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'outside-hilton-head',
    industrySlug: 'water-activities',
    featured: true,
    name: 'Outside Hilton Head',
    tagline: "The island's original nature guide service — dolphin tours, kayak, eco adventures, and Daufuskie day trips since 1979.",
    schemaType: 'TouristInformationCenter',
    categories: ['Dolphin Tours', 'Kayak', 'Eco Tours', 'Daufuskie Island', 'Family-Friendly'],
    priceRange: '$$',
    review:
      "Outside Hilton Head has been running guided tours off this island since 1979, which makes it the longest-established outdoor outfitter on Hilton Head and one of the most experienced anywhere on the South Carolina coast. Every tour is led by USCG-licensed captains or trained naturalists — the dolphin eco tours are particularly good, as guides combine marine biology with the kind of local knowledge that takes decades to accumulate. The Daufuskie Island day trip is the most complete off-island excursion available from Hilton Head.",
    notableFor:
      "The gold-standard guided tour operator on Hilton Head Island — 45+ years of dolphin tours, kayak expeditions, and nature programs, all led by working naturalists.",
    address: '50 Shelter Cove Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-6996',
    website: 'https://www.outsidehiltonhead.com',
    hours: 'Daily 7:30am–6pm, 365 days a year',
    instagram: 'outsidehiltonhead',
    heroImage: {
      src: '',
      alt: 'Outside Hilton Head guided kayak and dolphin tour, Hilton Head Island',
    },
    lat: 32.1997,
    lng: -80.7549,
  },
  // ——— Regular listings ———
  {
    id: 'vagabond-cruise',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Vagabond Cruise',
    tagline: "Hilton Head's original sightseeing cruise operator — dolphin tours, dinner cruises, and the famous Stars & Stripes America's Cup yacht.",
    schemaType: 'TouristAttraction',
    categories: ['Dolphin Cruises', 'Sailing', 'Dinner Cruises', 'Daufuskie Island', 'Sightseeing'],
    priceRange: '$$',
    review:
      "Vagabond Cruise has operated out of Harbour Town Yacht Basin since 1968, making it the oldest continuously running cruise operation on Hilton Head Island. The dolphin cruises and shrimp trawling excursions are popular with families; the sailing trips aboard Stars & Stripes — a former America's Cup racing yacht — are a genuinely rare experience. The Daufuskie Island ferry service gives day-trippers access to the uninhabited barrier island without renting a private boat.",
    notableFor:
      "In business since 1968 and still operating the Stars & Stripes, an actual America's Cup racing yacht — the most storied boat in Hilton Head's charter fleet.",
    address: '149 Lighthouse Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 363-9026',
    website: 'https://www.vagabondcruise.com',
    hours: 'Daily 8am–8pm (seasonal schedule — confirm departures)',
    heroImage: {
      src: '',
      alt: 'Vagabond Cruise dolphin tour at Harbour Town Yacht Basin, Hilton Head Island',
    },
  },
  {
    id: 'h2o-sports',
    industrySlug: 'water-activities',
    featured: false,
    name: 'H2O Sports',
    tagline: 'Parasailing, kayak tours, and dolphin watch trips from the base of the Harbour Town Lighthouse.',
    schemaType: 'SportsActivityLocation',
    categories: ['Parasailing', 'Kayak Tours', 'Dolphin Watch', 'Waterfront', 'Rentals'],
    priceRange: '$$',
    review:
      "H2O Sports operates from one of the best addresses on the island — the dock at Harbour Town Yacht Basin, directly under the lighthouse. The location makes it easy to add a parasail flight or dolphin tour to any Sea Pines afternoon without extra driving. The guided kayak tours wind through the tidal creeks behind Harbour Town, where wildlife sightings (herons, dolphins, loggerhead turtles) are reliable in season.",
    notableFor:
      "Parasailing and guided kayak tours launched directly from Harbour Town marina — the most scenically positioned water sports operator on the island.",
    address: '149 Lighthouse Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-4386',
    website: 'https://www.h2osports.com',
    hours: 'Mon–Fri 9am–6pm, Sat 9am–4pm', // TODO: VERIFY
    heroImage: {
      src: '',
      alt: 'H2O Sports parasailing and kayak tours at Harbour Town, Hilton Head Island',
    },
  },
  {
    id: 'kayak-hilton-head',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Kayak Hilton Head',
    tagline: 'Guided dolphin kayak tours with multiple daily departures — among the most-reviewed tour operators on the island.',
    schemaType: 'SportsActivityLocation',
    categories: ['Kayak Tours', 'Dolphin Watching', 'Paddleboard', 'Eco Tours', 'Family-Friendly'],
    priceRange: '$$',
    review:
      "Kayak Hilton Head focuses on one thing — guided paddling tours — and the depth of experience shows. The dolphin kayak tours run multiple departures daily and are consistently among the top-rated outdoor experiences on TripAdvisor for the island. The creek-level vantage point puts you close enough to dolphins, shorebirds, and marsh wildlife that a dedicated kayak tour consistently outperforms larger boat tours for wildlife observation.",
    notableFor:
      "Consistently the top-rated kayak tour operator on Hilton Head — multiple daily dolphin tours with guides who know exactly where the creek wildlife will be.",
    address: '18 Simmons Rd', // TODO: VERIFY
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 684-1910',
    website: 'https://www.kayakhiltonhead.com',
    hours: 'Daily 7:30am–7:30pm (seasonal)',
    heroImage: {
      src: '',
      alt: 'Kayak Hilton Head guided dolphin kayak tour, Hilton Head Island',
    },
  },
  {
    id: 'island-water-sports',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Island Water Sports',
    tagline: 'Sailing charters, kayak tours, paddleboarding, and powerboat rentals from South Beach Marina in Sea Pines.',
    schemaType: 'SportsActivityLocation',
    categories: ['Sailing', 'Kayak', 'Paddleboard', 'Boat Rentals', 'Family-Friendly'],
    priceRange: '$$',
    review:
      "Island Water Sports sits at South Beach Marina — the same marina as the Salty Dog Cafe — giving it the most concentrated foot traffic of any water sports operator in Sea Pines. The menu is wide: sailing charters, kayak and paddleboard tours, banana boat rides, wildlife eco tours, and powerboat rentals. It's a practical option for visitors staying in the south end of the island who want multiple activity types in one stop.",
    notableFor:
      "The most versatile water sports operation in Sea Pines — sailing, kayak, paddleboard, and boat rentals all from South Beach Marina.",
    address: '232 S Sea Pines Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-7007',
    website: 'https://www.islandwatersportshhi.com',
    hours: 'Daily 8am–7pm (Tue closes 5pm)', // TODO: VERIFY
    heroImage: {
      src: '',
      alt: 'Island Water Sports sailing and kayak at South Beach Marina, Sea Pines, Hilton Head',
    },
  },
  {
    id: 'hilton-head-outfitters',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Hilton Head Outfitters',
    tagline: "Kayak and canoe rentals on Palmetto Dunes' famous 11-mile interconnected lagoon system.",
    schemaType: 'SportsActivityLocation',
    categories: ['Kayak Rentals', 'Canoe', 'Paddleboard', 'Bike Rentals', 'Lagoon Tours'],
    priceRange: '$',
    review:
      "The appeal of Hilton Head Outfitters is the setting: Palmetto Dunes' lagoon system is one of the most extraordinary freshwater paddling environments in the coastal Southeast — 11 miles of interconnected waterways running through the resort, visible from every bridge. Launching from the Outfitters' dock puts you directly onto those lagoons for a completely calm, sheltered paddle through marsh grass and live oaks, with alligator sightings common year-round.",
    notableFor:
      "The best-positioned kayak rental on the island for calm-water paddling — direct access to Palmetto Dunes' 11-mile lagoon system, the largest in the western hemisphere.",
    address: '80 Queens Folly Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(866) 380-1783',
    website: 'https://www.hiltonheadoutfitters.com',
    hours: 'Daily 9am–5pm (seasonal)',
    heroImage: {
      src: '',
      alt: 'Kayak rental on Palmetto Dunes lagoon system, Hilton Head Island',
    },
  },
  {
    id: 'lowcountry-watersports',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Lowcountry Watersports',
    tagline: 'Dolphin tours, kayak tours, jet ski rentals, and Daufuskie Island excursions from Palmetto Bay Marina.',
    schemaType: 'SportsActivityLocation',
    categories: ['Dolphin Tours', 'Jet Ski', 'Kayak Tours', 'Boat Rentals', 'Sunset Cruises'],
    priceRange: '$$',
    review:
      "Lowcountry Watersports operates from Palmetto Bay Marina on Broad Creek, which puts it away from the resort-area crowds and gives access to some of the island's best dolphin-watching territory. The 90-minute dolphin tour comes with a sighting guarantee — uncommon in this market and a sign of genuine confidence in the guides. The jet ski and boat rental fleet rounds out the offering for visitors who want to explore independently.",
    notableFor:
      "One of the few dolphin tours on Hilton Head Island offered with a guaranteed sighting — backed by guides who know the resident bottlenose dolphin population intimately.",
    address: '86 Helmsman Way, Suite 101',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 684-2004',
    website: 'https://www.lowcountrywatersports.com',
    hours: 'Seasonal — check website for current schedule', // TODO: VERIFY
    heroImage: {
      src: '',
      alt: 'Lowcountry Watersports dolphin tour at Palmetto Bay Marina, Hilton Head Island',
    },
  },
  {
    id: 'sky-pirate-parasail',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Sky Pirate Parasail & Watersports',
    tagline: 'USCG-certified parasailing with panoramic island views from Broad Creek Marina.',
    schemaType: 'SportsActivityLocation',
    categories: ['Parasailing', 'Jet Ski', 'Tubing', 'Watersports', 'Adventure'],
    priceRange: '$$',
    review:
      "Sky Pirate operates a USCG-certified 12-passenger parasail vessel out of Broad Creek Marina, with solo, tandem, and triple flights that put riders 500–1,000 feet above the island — high enough to see both the Atlantic Ocean and the Intracoastal Waterway simultaneously. The jet ski and tubing rentals make it a full-day activity hub. The Broad Creek location is less trafficked than the resort marinas, which typically means faster departure times.",
    notableFor:
      "Dedicated parasail specialist with USCG certification and the only operation offering triple parasail flights — up to three riders airborne at once over Hilton Head.",
    address: '18 Simmons Rd',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 842-2566',
    website: 'https://www.skypirateparasail.com',
    hours: 'Daily 8am–8pm (seasonal)',
    heroImage: {
      src: '',
      alt: 'Parasailing over Hilton Head Island with Sky Pirate Parasail, Broad Creek Marina',
    },
  },
  {
    id: 'sea-monkeys-watersports',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Sea Monkeys Watersports',
    tagline: "Independent watercraft rentals — jet skis, pontoons, kayaks, and paddleboards at Hilton Head's north end.",
    schemaType: 'SportsActivityLocation',
    categories: ['Jet Ski', 'Pontoon Rentals', 'Kayak Rentals', 'Paddleboard', 'Boat Rentals'],
    priceRange: '$$',
    review:
      "Sea Monkeys is the no-fuss watercraft rental operation on the north end of the island — jet ski rentals, pontoon boats, kayaks, and paddleboards available without the resort markup. The Jenkins Island Road location accesses quieter waterways than the south-end marinas, which makes it a better choice for families who want to explore rather than join a tour group. Locally owned and operated with a straightforward pricing model.",
    notableFor:
      "The most straightforward watercraft rental on Hilton Head's north end — no resort premium, with access to quieter tidal creeks away from the marina crowds.",
    address: '43A Jenkins Island Rd',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 842-4754',
    website: 'https://www.seamonkeyshhi.com',
    hours: 'Mon–Sat 7am–8pm', // TODO: VERIFY
    heroImage: {
      src: '',
      alt: 'Jet ski and boat rentals at Sea Monkeys Watersports, Hilton Head Island',
    },
  },
  {
    id: 'live-oac',
    industrySlug: 'water-activities',
    featured: false,
    name: 'Live OAC (Outdoor Adventure Company)',
    tagline: 'Wakeboarding, waterskiing, tubing, and dolphin eco tours — one boat outing with multiple activities.',
    schemaType: 'SportsActivityLocation',
    categories: ['Wakeboarding', 'Waterskiing', 'Tubing', 'Dolphin Tours', 'Fishing'],
    priceRange: '$$$',
    review:
      "Live OAC fills a gap in the Hilton Head water sports market: a private charter company that can combine wake sports, tubing, wildlife watching, and light inshore fishing on a single outing rather than booking separate tours. The setup works well for groups — a 2-hour charter can move through waterskiing, dolphin spotting, and tubing in sequence. The Intracoastal Waterway access from their Waterway Lane base gives flexibility on where to run each activity.",
    notableFor:
      "The only Hilton Head operator combining wake sports (waterskiing, wakeboarding, tubing) with dolphin eco tours in a single customizable private charter.",
    address: '1 Waterway Ln',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 384-1414',
    website: 'https://www.liveoac.com',
    hours: 'Daily 8am–8pm (seasonal)', // TODO: VERIFY
    heroImage: {
      src: '',
      alt: 'Wakeboarding and dolphin tour charter with Live OAC, Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Business registry — add entries here as more industries are built out
// ---------------------------------------------------------------------------

export const allBusinesses: Business[] = [
  ...fbBusinesses,
  ...waterBusinesses,
  // Golf, weddings, etc. added in subsequent commits
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getBusinessesByIndustry(slug: string): Business[] {
  return allBusinesses.filter((b) => b.industrySlug === slug);
}

export function getFeaturedBusiness(slug: string): Business | undefined {
  return allBusinesses.find((b) => b.industrySlug === slug && b.featured);
}

export function getRegularBusinesses(slug: string): Business[] {
  return allBusinesses.filter((b) => b.industrySlug === slug && !b.featured);
}
