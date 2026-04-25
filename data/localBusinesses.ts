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
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop',
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
    website: 'https://www.hudsonsonthedocks.com',
    hours: 'Lunch and dinner daily (seasonal hours)', // TODO: VERIFY exact hours
    heroImage: {
      src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80&auto=format&fit=crop',
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
    hours: 'Dinner Tue–Sat; closed Sun & Mon (seasonal — confirm)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
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
    website: 'https://www.hhibackyard.com',
    hours: 'Lunch and dinner (seasonal hours — TODO: VERIFY)', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=1200&q=80&auto=format&fit=crop',
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
    address: '38 Shelter Cove Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 341-3838',
    website: 'https://www.poseidonhhi.com',
    hours: 'Dinner nightly (seasonal hours)', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80&auto=format&fit=crop',
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
    phone: '(843) 842-3600',
    website: 'https://www.gustohhi.com',
    hours: 'Mon–Sat 5pm–10pm; closed Sun (seasonal — confirm)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1200&q=80&auto=format&fit=crop',
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
    website: 'https://www.seamonkeyswatersports.com',
    hours: 'Mon–Sat 7am–8pm', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1200&q=80&auto=format&fit=crop',
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
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80&auto=format&fit=crop',
      alt: 'Wakeboarding and dolphin tour charter with Live OAC, Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Golf (10 profiles)
// ---------------------------------------------------------------------------

const golfBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'harbour-town-golf-links',
    industrySlug: 'golf',
    featured: true,
    name: 'Harbour Town Golf Links',
    tagline: "Pete Dye's masterpiece and the only PGA Tour course on Hilton Head — host of the RBC Heritage since 1969.",
    schemaType: 'GolfCourse',
    categories: ['PGA Tour', 'Pete Dye Design', 'Championship', 'Iconic', 'Sea Pines'],
    priceRange: '$$$$',
    review:
      "Harbour Town Golf Links is one of the most important golf courses built in the twentieth century. Pete Dye — with input from a then-unknown Jack Nicklaus — designed it in 1969, and the par-71 layout immediately changed how architects thought about coastal golf: tight fairways, small greens, pot bunkers, and the famous 18th hole framed by the red-and-white lighthouse over Calibogue Sound. It hosts the PGA Tour's RBC Heritage every April — South Carolina's only Tour event — which means the conditioning standards are maintained at Tour level year-round. Playing it is the central golf pilgrimage on Hilton Head Island.",
    notableFor:
      "The definitive Hilton Head golf experience — PGA Tour conditions, the iconic lighthouse 18th, and a design by Pete Dye that has influenced every course built since.",
    address: '11 Lighthouse Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-8484',
    website: 'https://www.seapines.com/golf/courses/harbour-town-golf-links',
    hours: 'Tee times approx. 7am–5:30pm daily (closed ~4 weeks/year for RBC Heritage)', // TODO: VERIFY current season hours
    heroImage: {
      src: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&q=80&auto=format&fit=crop',
      alt: 'Harbour Town Golf Links 18th hole with lighthouse, Sea Pines, Hilton Head Island',
    },
    lat: 32.1432,
    lng: -80.8104,
  },
  // ——— Regular listings ———
  {
    id: 'heron-point-pete-dye',
    industrySlug: 'golf',
    featured: false,
    name: 'Heron Point by Pete Dye',
    tagline: "Sea Pines' most playable championship layout — a full Pete Dye redesign through marshland and lagoons.",
    schemaType: 'GolfCourse',
    categories: ['Pete Dye Design', 'Championship', 'Sea Pines', 'Resort Golf', 'Marsh Views'],
    priceRange: '$$$',
    review:
      "Heron Point is the rebuilt version of Sea Pines' original Sea Marsh Course, completely redesigned by Pete Dye and reopened in 2007 after a multi-million-dollar renovation. The result is a course with authentic Dye DNA — waste bunkers, railroad ties, elevation changes within a flat coastal landscape — but a routing that rewards strategic play over pure power. The marsh and lagoon views throughout the back nine are among the best golf scenery on the island.",
    notableFor:
      "Pete Dye's second course at Sea Pines — a complete rebuild that delivers the architect's signature bold bunkering and marsh corridors at a lower green fee than Harbour Town.",
    address: '100 N Sea Pines Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-8484',
    website: 'https://www.seapines.com/golf/courses/heron-point-by-pete-dye',
    hours: 'Daily 8am–6pm (seasonal)', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80&auto=format&fit=crop',
      alt: 'Heron Point by Pete Dye golf course, Sea Pines Resort, Hilton Head Island',
    },
  },
  {
    id: 'atlantic-dunes-davis-love',
    industrySlug: 'golf',
    featured: false,
    name: 'Atlantic Dunes by Davis Love III',
    tagline: "A 2016 redesign of Hilton Head's very first golf course — links-style coastal terrain with native dunes and ocean views.",
    schemaType: 'GolfCourse',
    categories: ['Davis Love III Design', 'Links Style', 'Sea Pines', 'Coastal Golf', 'Award-Winning'],
    priceRange: '$$$',
    review:
      "Atlantic Dunes sits on the footprint of Hilton Head's original golf course — the Ocean Course, built in 1960 — completely redesigned by Davis Love III and reopened in 2016. The redesign restored the natural coastal dune system, introduced bermuda fairways and bentgrass greens, and incorporated native vegetation throughout. It won South Carolina Golf Course of the Year the year it opened. The routing makes the most of its oceanside real estate: several holes play alongside the Atlantic with genuine sea-breeze variables.",
    notableFor:
      "Built on the site of Hilton Head's first-ever golf course and named SC Golf Course of the Year — one of the best modern redesigns on the East Coast.",
    address: '100 N Sea Pines Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-1477',
    website: 'https://www.seapines.com/golf/courses/atlantic-dunes-by-davis-love',
    hours: 'Daily 8am–6pm (seasonal)', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=1200&q=80&auto=format&fit=crop',
      alt: 'Atlantic Dunes by Davis Love III golf course, Sea Pines Resort, Hilton Head Island',
    },
  },
  {
    id: 'rtj-oceanside-palmetto-dunes',
    industrySlug: 'golf',
    featured: false,
    name: 'Robert Trent Jones Oceanside Course',
    tagline: "Palmetto Dunes' flagship course — one of the few layouts on Hilton Head with an oceanfront hole.",
    schemaType: 'GolfCourse',
    categories: ['Robert Trent Jones', 'Oceanfront', 'Palmetto Dunes', 'Championship', 'Resort Golf'],
    priceRange: '$$$',
    review:
      "The Robert Trent Jones Oceanside Course at Palmetto Dunes was designed in 1969 — the same year as Harbour Town — and is the only other course on Hilton Head with a hole that genuinely plays alongside the Atlantic Ocean. The par-3 10th is that hole, and it's worth the round on its own. The course was renovated by Roger Rulewich and named South Carolina Golf Course of the Year in 2003. At par 72 and 6,710 yards from the tips, it challenges competitive players while remaining accessible to a wide range of handicaps.",
    notableFor:
      "One of only two courses on Hilton Head Island with a hole directly on the Atlantic Ocean — the 10th at Oceanside is among the most photographed golf holes in South Carolina.",
    address: '7 Trent Jones Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(844) 207-9301',
    website: 'https://www.palmettodunes.com/golf/robert-trent-jones-course',
    hours: 'Daily; pro shop approx. 7am–6pm', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?w=1200&q=80&auto=format&fit=crop',
      alt: 'Robert Trent Jones Oceanside Course at Palmetto Dunes, Hilton Head Island',
    },
  },
  {
    id: 'arthur-hills-palmetto-dunes',
    industrySlug: 'golf',
    featured: false,
    name: 'Arthur Hills Course at Palmetto Dunes',
    tagline: "Palmetto Dunes' most demanding layout — precision driving through tightly wooded corridors and lagoons.",
    schemaType: 'GolfCourse',
    categories: ['Arthur Hills Design', 'Palmetto Dunes', 'Championship', 'Wooded', 'Challenging'],
    priceRange: '$$$',
    review:
      "The Arthur Hills Course is the most technically demanding of Palmetto Dunes' three offerings. Opened in 1986, it routes through natural hardwoods and wetlands with tight fairways that punish wayward drives and greens that require specific approach angles to hold. It's the course at Palmetto Dunes that low-handicappers prefer for the challenge, and the condition-to-price ratio is consistently among the best on the island.",
    notableFor:
      "The tightest, most technically demanding layout on Palmetto Dunes — the course that better players seek out when they want to be tested rather than accommodated.",
    address: '2 Leamington Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-9138',
    website: 'https://www.palmettodunes.com/golf/arthur-hills-course',
    hours: 'Daily; open year-round', // TODO: VERIFY hours
    heroImage: {
      src: 'https://images.unsplash.com/photo-1538648759472-7251f7cb2c2f?w=1200&q=80&auto=format&fit=crop',
      alt: 'Arthur Hills Golf Course at Palmetto Dunes, Hilton Head Island',
    },
  },
  {
    id: 'george-fazio-palmetto-dunes',
    industrySlug: 'golf',
    featured: false,
    name: 'George Fazio Course at Palmetto Dunes',
    tagline: "The island's only par-70 public course — deceptively difficult, with heavy bunkering and complex approach angles.",
    schemaType: 'GolfCourse',
    categories: ['George Fazio Design', 'Palmetto Dunes', 'Par-70', 'Public Access', 'Beginner-Friendly'],
    priceRange: '$$',
    review:
      "The George Fazio Course is often the entry point for first-time golfers at Palmetto Dunes — it plays shorter than its sister courses and the fairways are more forgiving. But the 'beginner-friendly' label understates its complexity: the par-70 design features some of the most intricate bunkering on the resort, and the greens reward players who understand approach angles rather than just hit hard. It was designed by Tom Fazio's uncle George Fazio and opened in 1974.",
    notableFor:
      "Hilton Head Island's only par-70 public course — shorter than its Palmetto Dunes siblings but cleverly bunkered in ways that keep better players honest.",
    address: '7 Carnoustie Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(844) 207-9301',
    website: 'https://www.palmettodunes.com/golf/george-fazio-course',
    hours: 'Pro shop 6:30am–6pm daily', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1632946269126-0f8edbe8b068?w=1200&q=80&auto=format&fit=crop',
      alt: 'George Fazio Golf Course at Palmetto Dunes, Hilton Head Island',
    },
  },
  {
    id: 'shipyard-golf-club',
    industrySlug: 'golf',
    featured: false,
    name: 'Shipyard Golf Club',
    tagline: "27 holes through Carolina pines and lagoons — a former Senior PGA Tour host with the island's most distinctive alligator holes.",
    schemaType: 'GolfCourse',
    categories: ['27 Holes', 'Heritage Golf', 'Semi-Private', 'Wooded', 'Historic'],
    priceRange: '$$',
    review:
      "Shipyard Golf Club's 27 holes are divided into three nine-hole courses — Clipper, Galleon, and Brigantine — routing through the Shipyard Plantation's interior forest of Carolina pines, live oaks, and waterways. It hosted the Senior PGA Tour in the early 1980s. The so-called 'Alligator Cove' stretch on one of the nines is a perennial talking point — sightings are genuine and frequent. For value and variety, Shipyard offers more combination options (18 from three possible configurations) than most courses on the island.",
    notableFor:
      "Three nine-hole courses you can mix and match — former Senior PGA Tour host with alligator sightings that are part of the local lore, not a marketing gimmick.",
    address: '45 Shipyard Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 681-1503',
    website: 'https://hiltonheadgolf.net/clubs/shipyard',
    hours: 'Mon–Sat 7am–8pm; open year-round', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1623567341691-1f47b5cf949e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Shipyard Golf Club fairway through Carolina pines, Hilton Head Island',
    },
  },
  {
    id: 'palmetto-hall-plantation',
    industrySlug: 'golf',
    featured: false,
    name: 'Palmetto Hall Plantation',
    tagline: "Two championship layouts by Arthur Hills and Robert Cupp — 36 holes of risk-reward golf on the island's north end.",
    schemaType: 'GolfCourse',
    categories: ['36 Holes', 'Arthur Hills', 'Robert Cupp', 'Semi-Private', 'Heritage Golf'],
    priceRange: '$$',
    review:
      "Palmetto Hall is the 36-hole campus in the north of the island operated by Heritage Golf Group. The Arthur Hills Course (1991) emphasizes precision through wooded corridors; the Robert Cupp Course (1993) opens up with more generous landing areas and bolder risk-reward architecture. Having two distinct design philosophies in one complex lets golfers choose their challenge level — methodical versus aggressive — without driving to a different club.",
    notableFor:
      "Two architecturally distinct championship courses on one property — play the precision-focused Arthur Hills one day and the bold Robert Cupp layout the next.",
    address: '108 Fort Howell Dr',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 342-2582',
    website: 'https://hiltonheadgolf.net/clubs/palmetto-hall',
    hours: 'Open year-round; hours seasonal', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1592937238247-cd0090e02f65?w=1200&q=80&auto=format&fit=crop',
      alt: 'Palmetto Hall Plantation golf course, Hilton Head Island',
    },
  },
  {
    id: 'country-club-hilton-head',
    industrySlug: 'golf',
    featured: false,
    name: 'Country Club of Hilton Head',
    tagline: "A Rees Jones design inside Hilton Head Plantation — has hosted USGA qualifiers and plays at slope 147.",
    schemaType: 'GolfCourse',
    categories: ['Rees Jones Design', 'Semi-Private', 'Hilton Head Plantation', 'Challenging', 'Reciprocal Access'],
    priceRange: '$$$',
    review:
      "The Country Club of Hilton Head is a Rees Jones design inside the gated Hilton Head Plantation community, playing to a slope rating of 147 from the championship tees — among the more demanding slope ratings on the island. It has hosted a USGA U.S. Open Qualifier and operates as a private club (Invited/ClubCorp) with reciprocal access for members of affiliated clubs. The north-end location keeps it quieter than the resort courses despite its championship credentials.",
    notableFor:
      "A Rees Jones-designed course that has hosted USGA qualifiers — slope 147 puts it among the most technically demanding layouts on Hilton Head Island.",
    address: '70 Skull Creek Dr',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 681-2582',
    website: 'https://www.invitedclubs.com/clubs/country-club-of-hilton-head',
    hours: 'Mon–Fri 5:30am–9pm, Sat 6am–6pm, Sun 7:30am–6pm', // TODO: VERIFY — confirm reciprocal/visitor access
    heroImage: {
      src: 'https://images.unsplash.com/photo-1605144884374-ecbb643615f6?w=1200&q=80&auto=format&fit=crop',
      alt: 'Country Club of Hilton Head golf course, Hilton Head Plantation',
    },
  },
  {
    id: 'hilton-head-national',
    industrySlug: 'golf',
    featured: false,
    name: 'Hilton Head National Golf Club',
    tagline: "Gary Player and Bobby Weed's public course — no homes on the fairways, consistently ranked among SC's best public layouts.",
    schemaType: 'GolfCourse',
    categories: ['Gary Player Design', 'Public Access', 'No Homes', 'Value', 'Bluffton Adjacent'],
    priceRange: '$$',
    review:
      "Hilton Head National is technically just outside the island in Bluffton, but it draws Hilton Head visitors specifically because no homes border any of its fairways or greens — a rarity in a market dominated by plantation-community courses where residential development competes with the golf experience. Designed by Gary Player and Bobby Weed, it opened in 1989 and is consistently ranked among South Carolina's top public access courses. The price-to-quality ratio is the best in the Hilton Head area.",
    notableFor:
      "The best value public course in the Hilton Head area — no fairway homes, Gary Player design, and a conditioning standard that competes with courses costing twice as much.",
    address: '60 Hilton Head National Dr',
    city: 'Bluffton, SC 29910', // 5 min from HHI bridge
    phone: '(843) 842-5900',
    website: 'https://www.hiltonheadnational.com',
    hours: 'Daily 8am–5:30pm; open year-round',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1587205476864-4a5a195167b4?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head National Golf Club fairway, Bluffton near Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Vacation Rentals (10 profiles)
// ---------------------------------------------------------------------------

const vacationRentalBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'sea-pines-resort-rentals',
    industrySlug: 'vacation-rentals',
    featured: true,
    name: 'Sea Pines Resort',
    tagline: "Hilton Head's largest resort community — 400+ managed villas, cottages, and homes inside 5,000 acres of Sea Pines Plantation.",
    schemaType: 'LodgingBusiness',
    categories: ['Resort Community', 'Villas', 'Oceanfront', 'Golf Included', 'Full-Service'],
    priceRange: '$$$',
    review:
      "Sea Pines Resort manages more than 400 rental properties inside the 5,000-acre plantation that occupies the southern tip of Hilton Head Island. The inventory runs from one-bedroom villas to seven-bedroom oceanfront homes, and guests access all resort amenities — Harbour Town, the Salty Dog Marina, 36+ holes of golf, 20 miles of bike paths, and three beach accesses — as part of their stay. The Resort's property management program is the largest and most established on the island, with a full-service front desk staffed around the clock.",
    notableFor:
      "The island's most complete resort rental experience — booking through Sea Pines Resort means full access to Harbour Town, the PGA Tour golf courses, and 20 miles of private bike paths.",
    address: '32 Greenwood Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-3333',
    website: 'https://www.seapines.com/vacation-rentals',
    hours: 'Rental desk daily 7am–11pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Sea Pines Resort villas and Harbour Town marina, Hilton Head Island',
    },
    lat: 32.1432,
    lng: -80.8104,
  },
  // ——— Regular listings ———
  {
    id: 'palmetto-dunes-resort-rentals',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Palmetto Dunes Oceanfront Resort',
    tagline: "200+ managed villas and homes inside Hilton Head's most amenity-rich resort community.",
    schemaType: 'LodgingBusiness',
    categories: ['Oceanfront', 'Villas', 'Resort Community', 'Golf Included', 'Lagoon System'],
    priceRange: '$$$',
    review:
      "Palmetto Dunes Oceanfront Resort manages 200+ rental properties inside one of the most amenity-packed resort communities on the Eastern Seaboard: three championship golf courses, an 11-mile lagoon system, a private beach, tennis, and a marina all within the plantation gates. The resort's property management program has been recognized as among the best-run in the Southeast, with consistent maintenance standards and a strong repeat-guest base that books a year in advance for peak weeks.",
    notableFor:
      "The top-rated resort management program on Hilton Head — properties inside a community with three championship golf courses and an 11-mile paddling lagoon.",
    address: '4 Queens Folly Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(877) 567-6507',
    website: 'https://www.palmettodunes.com/vacation-rentals',
    hours: 'Rental office open daily', // TODO: VERIFY hours
    heroImage: {
      src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80&auto=format&fit=crop',
      alt: 'Palmetto Dunes Oceanfront Resort rental villas, Hilton Head Island',
    },
  },
  {
    id: 'the-vacation-company',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'The Vacation Company',
    tagline: "Locally operated for 30+ years — nearly 400 rentals across Sea Pines, Palmetto Dunes, Shipyard, and Forest Beach.",
    schemaType: 'LodgingBusiness',
    categories: ['Locally Owned', 'Sea Pines', 'Palmetto Dunes', 'Forest Beach', 'Full-Service'],
    priceRange: '$$$',
    review:
      "The Vacation Company has been managing Hilton Head Island vacation rentals for more than three decades — long enough to have built a repeat-guest network that fills a significant portion of its inventory before the calendar opens to new bookings. With nearly 400 properties across multiple communities, it's one of the larger independent management operations on the island and offers the local knowledge and service responsiveness that national platforms can't match.",
    notableFor:
      "One of the longest-standing independent rental companies on the island — 30+ years of local management across Sea Pines, Palmetto Dunes, Shipyard, and Forest Beach.",
    address: '50 Palmetto Bay Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-6100',
    website: 'https://www.vacationcompany.com',
    hours: 'Mon–Sat 9am–5pm; closed Sun',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Island vacation rental villa managed by The Vacation Company',
    },
  },
  {
    id: 'vacasa-hilton-head',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Vacasa Hilton Head Island',
    tagline: "460+ Hilton Head rentals under national management — 24/7 guest service, 3D home tours, and the island's deepest inventory.",
    schemaType: 'LodgingBusiness',
    categories: ['Largest Inventory', '24/7 Support', 'Online Booking', 'National Platform', 'Full-Service'],
    priceRange: '$$$',
    review:
      "Vacasa's Hilton Head operation began as Resort Rentals of Hilton Head Island — one of the oldest rental management companies on the island, in business since 1958 — and has grown under national management to over 460 properties. The platform provides 24/7 guest services, 3D virtual home tours for every property, and consistent maintenance standards across the portfolio. For visitors who want the widest selection and a reliable booking platform, it's the largest single catalog of Hilton Head rentals available.",
    notableFor:
      "The largest single inventory of managed Hilton Head rentals — 460+ properties on a nationally backed platform with roots on the island going back to 1958.",
    address: '21 Executive Park Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 310-6983',
    website: 'https://www.vacasa.com/usa/South-Carolina/Hilton-Head-Island',
    hours: '24/7 guest services by phone',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Island oceanfront vacation rental, Vacasa portfolio',
    },
  },
  {
    id: 'beach-properties-hhi',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Beach Properties of Hilton Head',
    tagline: "Premium oceanfront and ocean-oriented homes since 1995 — focused inventory, strong owner relationships, 400+ high-end properties.",
    schemaType: 'LodgingBusiness',
    categories: ['Luxury', 'Oceanfront', 'High-End', 'Locally Owned', 'Premium Inventory'],
    priceRange: '$$$$',
    review:
      "Beach Properties of Hilton Head has built its reputation since 1995 around the premium end of the rental market — oceanfront and ocean-oriented homes rather than interior plantation villas. The 400+ property portfolio skews toward larger homes (4–8 bedrooms) and luxury inventory, with a focus on repeat owner relationships and high-end guest services. For visitors planning a larger family reunion or group trip in a premium property, it's the specialist on the island.",
    notableFor:
      "The specialist in luxury and oceanfront rental homes on Hilton Head — 400+ premium properties with a 30-year track record in the high-end market.",
    address: '862 William Hilton Pkwy',
    city: 'Hilton Head Island, SC 29928',
    phone: '(800) 671-5155',
    website: 'https://www.beach-property.com',
    hours: 'Daily 9am–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop',
      alt: 'Luxury oceanfront vacation home on Hilton Head Island, Beach Properties',
    },
  },
  {
    id: 'destination-vacation-hhi',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Destination Vacation Hilton Head',
    tagline: "Locally owned luxury rental management in Sea Pines, Palmetto Dunes, and Forest Beach — concierge-level service.",
    schemaType: 'LodgingBusiness',
    categories: ['Luxury', 'Locally Owned', 'Sea Pines', 'Concierge Service', 'Boutique'],
    priceRange: '$$$',
    review:
      "Destination Vacation Hilton Head Island operates as a boutique management company focused on the luxury end of three major communities: Sea Pines, Palmetto Dunes, and Forest Beach. The smaller portfolio means individual attention to both property owners and guests — this is the operation that knows its inventory intimately and can match guests to specific properties with precision. The concierge approach is a meaningful differentiator from larger platforms where properties are managed at scale.",
    notableFor:
      "Boutique luxury rental management with a concierge-level matching approach — small enough to know every property personally, covering the island's three top communities.",
    address: '7 Executive Park Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-7774',
    website: 'https://www.destinationvacationhhi.com',
    hours: 'Mon–Sat 9am–5pm, Sun 10am–4pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Island luxury vacation villa managed by Destination Vacation',
    },
  },
  {
    id: 'sunset-rentals-hhi',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Sunset Rentals',
    tagline: "28+ years on Hilton Head — boutique management with a strong repeat-guest base in Sea Pines and Palmetto Dunes.",
    schemaType: 'LodgingBusiness',
    categories: ['Boutique', 'Sea Pines', 'Palmetto Dunes', 'Repeat Guests', 'Locally Owned'],
    priceRange: '$$$',
    review:
      "Sunset Rentals has operated on Hilton Head Island for more than 28 years as a family-owned, boutique vacation rental management company. It's the kind of operation where staff recognize returning guests by name — the repeat booking rate is unusually high, which speaks to consistent service delivery. The portfolio focuses on Sea Pines, Palmetto Dunes, Shipyard, and Forest Beach, with a thoughtful selection of villas and homes rather than maximum inventory.",
    notableFor:
      "A family-owned boutique rental company with a loyal repeat-guest base — 28 years on the island and a personalized approach that larger platforms don't replicate.",
    address: '21 New Orleans Rd, Suite D',
    city: 'Hilton Head Island, SC 29928',
    phone: '(800) 276-8991',
    website: 'https://www.sunsetrentals.com',
    hours: 'Mon–Sat 9am–5:30pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Island vacation rental, Sunset Rentals portfolio',
    },
  },
  {
    id: 'dunes-real-estate',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Dunes Real Estate',
    tagline: "Founded 1979 — full-service real estate and rental management with the island's deepest institutional knowledge.",
    schemaType: 'LodgingBusiness',
    categories: ['Established 1979', 'Sales & Rentals', 'Palmetto Dunes', 'Full-Service', 'Local Expert'],
    priceRange: '$$$',
    review:
      "Dunes Real Estate was founded in 1979, making it one of the oldest continuously operating real estate and rental management firms on Hilton Head Island. The combination of sales and rental management under one roof means the staff carry genuine institutional knowledge about property values, community conditions, and rental performance that a pure rental platform can't offer. The Palmetto Dunes office gives strong access to that community's premium properties.",
    notableFor:
      "In business since 1979 and one of the oldest real estate firms on the island — the combined sales and rental operation carries decades of institutional property knowledge.",
    address: '6 Queens Folly Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-1111',
    website: 'https://www.dunesrealestate.com',
    hours: 'Mon–Sat 9am–5pm, Sun 12pm–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80&auto=format&fit=crop',
      alt: 'Dunes Real Estate office, Hilton Head Island vacation rental management',
    },
  },
  {
    id: 'vacation-time-hhi',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Vacation Time of Hilton Head',
    tagline: "South Forest Beach specialists — oceanfront villas and family beach homes steps from Coligny Beach.",
    schemaType: 'LodgingBusiness',
    categories: ['Forest Beach', 'Oceanfront', 'Family-Friendly', 'Beach Access', 'Locally Owned'],
    priceRange: '$$',
    review:
      "Vacation Time of Hilton Head is the rental specialist for South Forest Beach — the stretch of the island centered around Coligny Beach that draws families who want walkable beach access and the casual energy of the Coligny Plaza corridor. The portfolio is concentrated in oceanfront and ocean-view villas and homes in this zone, which makes it the most efficient search for visitors whose priority is morning-to-evening beach access without a car trip.",
    notableFor:
      "The Forest Beach and Coligny area specialist — the most focused inventory of walkable oceanfront properties in Hilton Head's most family-friendly beach corridor.",
    address: '3 LeMoyne Ave',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-5151',
    website: 'https://www.vthhi.com',
    hours: 'Daily 9am–6pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop',
      alt: 'Oceanfront vacation rental in Forest Beach, Hilton Head Island',
    },
  },
  {
    id: 'island-time-hhi',
    industrySlug: 'vacation-rentals',
    featured: false,
    name: 'Island Time Hilton Head',
    tagline: "100+ curated luxury homes and villas — locally operated with a personal-service focus across multiple HHI communities.",
    schemaType: 'LodgingBusiness',
    categories: ['Luxury', 'Curated Portfolio', 'Locally Owned', 'Personal Service', 'Multi-Community'],
    priceRange: '$$$',
    review:
      "Island Time Hilton Head manages a carefully curated portfolio of 100+ luxury homes and villas across multiple communities on Hilton Head Island. The smaller portfolio enables a higher level of personal service — guests work with staff who know the properties well enough to make specific recommendations rather than filter results from a database. For visitors who want a hands-on booking experience rather than a self-service platform, it's a strong alternative to the larger operators.",
    notableFor:
      "A curated portfolio of 100+ luxury properties managed with genuine personal attention — the boutique operator for visitors who want specific recommendations, not database filters.",
    address: '1 Chamber of Commerce Dr, Suite B',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-3456',
    website: 'https://www.islandtimehhi.com',
    hours: 'Seasonal — check website for current hours', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop',
      alt: 'Luxury vacation home rental managed by Island Time Hilton Head',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Weddings (10 profiles)
// ---------------------------------------------------------------------------

const weddingBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'westin-hhi-weddings',
    industrySlug: 'weddings',
    featured: true,
    name: 'The Westin Hilton Head Island Resort & Spa',
    tagline: "Oceanfront ceremonies for up to 600 guests — the Grand Ocean Terrace puts the Atlantic directly behind your ceremony.",
    schemaType: 'EventVenue',
    categories: ['Oceanfront', 'Full-Service Resort', 'Large Venue', 'Spa', 'Ceremony + Reception'],
    priceRange: '$$$$',
    review:
      "The Westin Hilton Head Island Resort & Spa is the most complete wedding venue on the island — oceanfront ceremony spaces, a Grand Ballroom that handles up to 600 guests, five food and beverage outlets for rehearsal dinners and post-wedding brunches, a full-service spa for wedding party prep, and on-site accommodations to keep the entire group together. The Grand Ocean Terrace ceremony location seats up to 180 directly on the beach, with the Atlantic Ocean as the backdrop. It's the hotel that can handle every component of a multi-day wedding weekend without the couple leaving the property.",
    notableFor:
      "The most comprehensive wedding resort on Hilton Head Island — beach ceremony space, a 600-person ballroom, on-site spa, and accommodations all in one property.",
    address: '2 Grasslawn Ave',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 681-4000',
    website: 'https://www.westinhhiweddings.com',
    hours: 'Events team available during business hours', // TODO: VERIFY direct events line
    instagram: 'westinhiltonhead',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop',
      alt: 'Oceanfront wedding ceremony at The Westin Hilton Head Island Resort, South Carolina',
    },
    lat: 32.2033,
    lng: -80.7456,
  },
  // ——— Regular listings ———
  {
    id: 'omni-hhi-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'Omni Hilton Head Oceanfront Resort',
    tagline: "AAA Four Diamond oceanfront resort — beachfront ceremonies, Lowcountry catering, and up to 250 guests.",
    schemaType: 'EventVenue',
    categories: ['Oceanfront', 'Four Diamond', 'Lowcountry Cuisine', 'Intimate', 'Ceremony + Reception'],
    priceRange: '$$$$',
    review:
      "The Omni Hilton Head Oceanfront Resort is an AAA Four Diamond property with beachfront ceremony locations and indoor reception spaces that accommodate up to 250 guests. The catering team specializes in Lowcountry-inspired menus — shrimp and grits stations, she-crab soup, Lowcountry boil setups — that give receptions a sense of place that generic banquet food can't match. For couples who want an elegant but not enormous venue, it's one of the strongest options on the island.",
    notableFor:
      "AAA Four Diamond oceanfront resort with Lowcountry-focused catering — the right scale for elegant weddings up to 250 guests who want genuine coastal cuisine.",
    address: '23 Ocean Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-8000',
    website: 'https://www.omnihotels.com/hotels/hilton-head/weddings',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop',
      alt: 'Wedding reception at Omni Hilton Head Oceanfront Resort, Hilton Head Island',
    },
  },
  {
    id: 'sea-pines-beach-club-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'Sea Pines Beach Club',
    tagline: "Private oceanfront ceremony and reception venue inside Sea Pines — the Atlantic Ocean on one side, live oaks on the other.",
    schemaType: 'EventVenue',
    categories: ['Oceanfront', 'Exclusive', 'Sea Pines', 'Outdoor Ceremony', 'Private'],
    priceRange: '$$$$',
    review:
      "The Sea Pines Beach Club is the flagship oceanfront event venue within Sea Pines Resort — private, exclusive, and set directly on the Atlantic. The combination of the beach ceremony space and the club's indoor reception capabilities makes it one of the few venues on the island where ceremony and reception can both happen without moving guests between locations. Access to the full Sea Pines Resort amenities — golf, spa, marina, dining — makes it a natural anchor for a wedding weekend.",
    notableFor:
      "Sea Pines Resort's premier oceanfront wedding venue — private beachfront ceremony space and reception in one of the island's most exclusive plantation communities.",
    address: '87 N Sea Pines Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-1888',
    website: 'https://www.seapines.com/gather/weddings',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=1200&q=80&auto=format&fit=crop',
      alt: 'Sea Pines Beach Club oceanfront wedding venue, Hilton Head Island',
    },
  },
  {
    id: 'inn-harbour-town-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'The Inn & Club at Harbour Town',
    tagline: "Hilton Head's only Forbes Four-Star hotel — a boutique 60-room property that can be fully reserved for a wedding weekend.",
    schemaType: 'EventVenue',
    categories: ['Forbes Four-Star', 'Boutique Hotel', 'Harbour Town', 'Exclusive Buyout', 'Intimate'],
    priceRange: '$$$$',
    review:
      "The Inn & Club at Harbour Town holds the only Forbes Four-Star hotel rating on Hilton Head Island. At 60 rooms, it's small enough to be fully reserved for a wedding party — giving couples the rare experience of a private boutique hotel exclusively for their guests. The Fairway Parlor event space overlooks the first fairway at Harbour Town Golf Links, and the marina setting provides a backdrop that's distinctly Hilton Head rather than generic beachfront.",
    notableFor:
      "The island's only Forbes Four-Star hotel — a 60-room boutique property in Harbour Town that can be entirely reserved for your wedding party.",
    address: '7 Lighthouse Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 363-8100',
    website: 'https://www.seapines.com/accommodations/inn-club',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80&auto=format&fit=crop',
      alt: 'The Inn and Club at Harbour Town, Hilton Head Island wedding venue',
    },
  },
  {
    id: 'harbour-town-yacht-club-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'Harbour Town Yacht Club',
    tagline: "Panoramic marina views from the fourth-floor Club Room — ceremony and reception above the Harbour Town lighthouse.",
    schemaType: 'EventVenue',
    categories: ['Marina Views', 'Waterfront', 'Sea Pines', 'Club Room', 'Intimate'],
    priceRange: '$$$',
    review:
      "The Harbour Town Yacht Club's fourth-floor Club Room delivers some of the most dramatic wedding views on Hilton Head: the marina, the lighthouse, Calibogue Sound, and on clear days the mainland beyond. The space works best for intimate events — ceremony and reception for couples who want a distinctive setting without the scale of a full resort ballroom. The Harbour Town retail and restaurant corridor directly below makes it easy for out-of-town guests to fill the days around the wedding.",
    notableFor:
      "The most visually iconic wedding setting in Sea Pines — panoramic views of Harbour Town marina and the lighthouse from the fourth-floor Club Room.",
    address: '149 Lighthouse Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-1400',
    website: 'https://htyc.com/weddings',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format&fit=crop',
      alt: 'Harbour Town Yacht Club wedding venue, marina views, Hilton Head Island',
    },
  },
  {
    id: 'palmetto-dunes-events',
    industrySlug: 'weddings',
    featured: false,
    name: 'Palmetto Dunes Oceanfront Resort — Events',
    tagline: "Multiple ceremony and reception venues — beach, marina pavilion, and golf veranda — across one 2,000-acre oceanfront resort.",
    schemaType: 'EventVenue',
    categories: ['Multi-Venue', 'Oceanfront', 'Marina', 'Resort', 'Ceremony + Reception'],
    priceRange: '$$$',
    review:
      "Palmetto Dunes offers one of the most flexible wedding setups on Hilton Head — multiple distinct venues within the same resort: the Dunes House with its beachside deck, the Shelter Cove Harbour Pavilion with marina views, and the Veranda at Arthur Hills overlooking the golf course. The in-house Dunes Catering & Events team has operated since 2000 and handles food and beverage across all venues, which simplifies logistics considerably versus venues that require outside caterers.",
    notableFor:
      "Three distinct ceremony and reception venues within one resort — couples can move from beach ceremony to marina reception to golf course dinner without leaving Palmetto Dunes.",
    address: '4 Queens Folly Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-9142',
    website: 'https://www.palmettodunesevents.com',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=1200&q=80&auto=format&fit=crop',
      alt: 'Palmetto Dunes outdoor wedding venue on Hilton Head Island',
    },
  },
  {
    id: 'hilton-beachfront-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'Hilton Beachfront Resort & Spa Hilton Head',
    tagline: "The island's largest oceanfront conference and event resort — 46,000 sq ft of event space and a dedicated oceanfront deck for 300.",
    schemaType: 'EventVenue',
    categories: ['Largest Venue', 'Oceanfront', 'Grand Scale', 'Full-Service', 'Conference Resort'],
    priceRange: '$$$',
    review:
      "The Hilton Beachfront Resort & Spa — formerly the Hilton Head Marriott — is the largest full-service oceanfront event resort on the island, with more than 46,000 square feet of event space across 10 rooms and the Basshead Deck, which accommodates 300 guests with direct ocean views. For large weddings of 200+ that require on-site hotel accommodations, no other venue on Hilton Head matches the scale. The full-service Spa Soleil is available for wedding party prep.",
    notableFor:
      "The island's largest wedding and event venue — 46,000 sq ft of event space and the Basshead Deck for 300 with ocean views, in one full-service oceanfront resort.",
    address: 'One Hotel Circle',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-8400',
    website: 'https://www.hilton.com/en/hotels/hhhrshh-hilton-beachfront-resort-and-spa-hilton-head-island/',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Beachfront Resort oceanfront wedding event space, Hilton Head Island',
    },
  },
  {
    id: 'amanda-rose-weddings',
    industrySlug: 'weddings',
    featured: false,
    name: 'Amanda Rose Weddings & Events',
    tagline: "15+ years planning Hilton Head weddings — the most-reviewed independent wedding planner on the island.",
    schemaType: 'ProfessionalService',
    categories: ['Full Planning', 'Day-Of Coordination', 'Local Expert', '15+ Years', 'Lowcountry Specialist'],
    priceRange: '$$$',
    review:
      "Amanda Rose Weddings & Events has been planning weddings on Hilton Head Island for more than 15 years and appears in the vendor listings of virtually every major resort and venue on the island — which is the strongest possible signal of established reputation in this market. Services range from full-service planning (venue selection through send-off) to day-of coordination. The vendor relationships built over 15 years translate directly into smoother logistics for clients, particularly at venues where she has planned dozens of events.",
    notableFor:
      "The most widely recommended independent wedding planner on Hilton Head Island — 15+ years and relationships with every major venue on the island.",
    address: 'Hilton Head Island, SC',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 422-7907',
    website: 'https://www.amandaroseweddings.com',
    hours: 'By appointment',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1606490194859-07c18c9f0968?w=1200&q=80&auto=format&fit=crop',
      alt: 'Amanda Rose Weddings beach wedding planning, Hilton Head Island',
    },
  },
  {
    id: 'spencer-special-events',
    industrySlug: 'weddings',
    featured: false,
    name: 'Spencer Special Events',
    tagline: "Luxury wedding design and full coordination for Hilton Head, Bluffton, and Savannah — consistently top-rated on WeddingWire and The Knot.",
    schemaType: 'ProfessionalService',
    categories: ['Luxury Planning', 'Full Design', 'WeddingWire Top-Rated', 'Lowcountry', 'Destination Weddings'],
    priceRange: '$$$',
    review:
      "Spencer Special Events provides full-service luxury wedding design and planning for the Hilton Head and Lowcountry market, consistently earning top ratings on WeddingWire and The Knot. The firm handles everything from initial concept and venue selection through florals, rentals, and day-of execution — the integrated approach means one point of contact rather than managing multiple vendors independently. For destination couples planning a Hilton Head wedding from out of town, the full-service model significantly reduces the complexity of remote planning.",
    notableFor:
      "Full-service luxury wedding design and coordination — top-rated on both WeddingWire and The Knot for the Hilton Head market, with full vendor integration.",
    address: 'Hilton Head Island, SC',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 757-9797',
    website: 'https://www.spencerspecialevents.com',
    hours: 'By appointment',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop',
      alt: 'Spencer Special Events luxury wedding design, Hilton Head Island',
    },
  },
  {
    id: 'simply-southern-events',
    industrySlug: 'weddings',
    featured: false,
    name: 'Simply Southern Events',
    tagline: "Lowcountry wedding coordination for beach, church, and coastal ceremonies — personalized planning for every budget.",
    schemaType: 'ProfessionalService',
    categories: ['Day-Of Coordination', 'Full Planning', 'Beach Weddings', 'Accessible Pricing', 'Lowcountry'],
    priceRange: '$$',
    review:
      "Simply Southern Events is the Lowcountry wedding coordinator for couples who want genuine personalization without the luxury planning premium. Services range from day-of coordination (for couples who have done the planning themselves and need expert execution) to full planning packages. The focus on beach and coastal ceremonies suits the Hilton Head market well, and the Bluffton base gives practical access to every venue on the island and in the surrounding Lowcountry.",
    notableFor:
      "A personalized, accessible Lowcountry wedding coordinator — strong day-of coordination for couples who have planned themselves and need expert execution on the day.",
    address: 'Bluffton, SC (serves all of Hilton Head Island)',
    city: 'Bluffton, SC 29910',
    website: 'https://www.asimplysouthernevent.com',
    hours: 'By appointment',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80&auto=format&fit=crop',
      alt: 'Simply Southern Events Lowcountry beach wedding coordination, Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Spas & Wellness (10 profiles)
// ---------------------------------------------------------------------------

const spaBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'heavenly-spa-westin',
    industrySlug: 'spas-wellness',
    featured: true,
    name: 'Heavenly Spa by Westin',
    tagline: "8,000 sq ft of resort spa inside the Westin — the island's most complete full-service spa experience.",
    schemaType: 'DaySpa',
    categories: ['Full-Service Spa', 'Resort Spa', 'Couples Treatments', 'Salon', 'Signature Massages'],
    priceRange: '$$$$',
    review:
      "Heavenly Spa by Westin is the benchmark resort spa on Hilton Head Island — 8,000 square feet of treatment space with nine private rooms, a full-service salon, and a retail boutique. The signature treatments rotate seasonally but consistently center around the Westin's wellness philosophy: restorative massage techniques, marine-sourced ingredients, and body treatments designed to work with the coastal environment. It's open to hotel guests and outside visitors alike, and it's the spa most consistently recommended by locals for special-occasion treatments.",
    notableFor:
      "The largest and most complete resort spa on Hilton Head Island — 9 treatment rooms, a full salon, and the brand prestige of the Westin Heavenly Spa program.",
    address: '2 Grasslawn Ave',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 681-1019',
    website: 'https://www.westinhiltonheadspa.com',
    hours: 'Daily 9am–6pm (closed Thanksgiving and Christmas)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop',
      alt: 'Heavenly Spa by Westin treatment room, Hilton Head Island resort spa',
    },
    lat: 32.2033,
    lng: -80.7456,
  },
  // ——— Regular listings ———
  {
    id: 'ocean-tides-spa-omni',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Ocean Tides Spa at Omni Hilton Head',
    tagline: "Full-service resort spa at the Omni — signature oceanfront treatments including the Paradise Glow and Ocean Tides Facial.",
    schemaType: 'DaySpa',
    categories: ['Resort Spa', 'Facials', 'Body Treatments', 'Couples', 'Manicure & Pedicure'],
    priceRange: '$$$',
    review:
      "Ocean Tides Spa sits inside the Omni Hilton Head Oceanfront Resort and offers a focused menu of massages, facials, body treatments, and nail services. The signature treatments — the Paradise Glow Body Treatment and the Ocean Tides Signature Facial — are designed around coastal ingredients and the property's oceanfront setting. Like most resort spas, it's available to non-hotel guests by appointment, and the Omni's AAA Four Diamond positioning means the service quality is consistently maintained.",
    notableFor:
      "The spa at Hilton Head's only AAA Four Diamond resort — signature treatments inspired by the coastal environment and consistently maintained Four Diamond service.",
    address: '23 Ocean Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 341-8056',
    website: 'https://www.omnihotels.com/hotels/hilton-head/spa',
    hours: 'Tue–Sat 9am–5pm; closed Mon and Sun', // TODO: VERIFY — hours may expand in peak season
    heroImage: {
      src: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1200&q=80&auto=format&fit=crop',
      alt: 'Ocean Tides Spa at Omni Hilton Head resort, Hilton Head Island',
    },
  },
  {
    id: 'spa-soleil-hilton',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Spa Soleil',
    tagline: "16-treatment-room spa inside the island's largest oceanfront resort — massages, facials, body treatments, and salon.",
    schemaType: 'DaySpa',
    categories: ['Resort Spa', 'Full-Service', 'Large Spa', 'Massages', 'Salon Services'],
    priceRange: '$$$',
    review:
      "Spa Soleil operates inside the Hilton Beachfront Resort & Spa — formerly the Hilton Head Marriott — which is the largest resort on the island. With 16 treatment rooms, it's one of the highest-capacity spas in the area, which means appointment availability is more reliable than at smaller boutique spas, particularly during peak season weeks when resort spas routinely book solid. The full menu covers massages, facials, body treatments, nails, and salon services.",
    notableFor:
      "16 treatment rooms at the island's largest resort — the highest-capacity spa on Hilton Head, with better appointment availability during peak season than smaller operations.",
    address: 'One Hotel Circle',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-8420',
    website: 'https://www.hilton.com/en/hotels/hhhrshh-hilton-beachfront-resort-and-spa-hilton-head-island/spa/',
    hours: 'Daily 8am–6pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80&auto=format&fit=crop',
      alt: 'Spa Soleil treatment room at Hilton Beachfront Resort, Hilton Head Island',
    },
  },
  {
    id: 'hilton-head-health',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Hilton Head Health (H3)',
    tagline: "America's top-ranked weight loss and wellness retreat — immersive multi-week programs on Hilton Head Island since 1976.",
    schemaType: 'HealthClub',
    categories: ['Wellness Retreat', 'Weight Loss', 'Immersive Programs', 'Fitness', 'Nutrition'],
    priceRange: '$$$$',
    review:
      "Hilton Head Health — known as H3 — is in a category of its own among island wellness offerings. It's not a day spa or yoga studio; it's an immersive residential wellness retreat that has operated on Hilton Head since 1976, specializing in week-long and multi-week programs combining clinical nutrition, behavioral change coaching, fitness programming, and mindfulness. It has been ranked as America's top weight loss and wellness resort by multiple publications. The programs attract people from across the country specifically to Hilton Head Island.",
    notableFor:
      "America's top-ranked wellness and weight loss retreat, operating on Hilton Head Island since 1976 — the island's only residential immersive wellness program.",
    address: '14 Valencia Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-3286',
    website: 'https://www.hhhealth.com',
    hours: 'Residential programs — contact for schedule',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Health wellness retreat campus, Hilton Head Island',
    },
  },
  {
    id: 'art-of-massage-yoga',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Art of Massage & Yoga',
    tagline: "Holistic wellness studio — organic facials, restorative bodywork, private yoga, and beach yoga sessions.",
    schemaType: 'DaySpa',
    categories: ['Holistic Wellness', 'Yoga', 'Organic Facials', 'Beach Yoga', 'Couples Massage'],
    priceRange: '$$',
    review:
      "Art of Massage & Yoga occupies a genuine niche on Hilton Head — a holistic wellness studio that combines therapeutic massage, organic facials, energy work, and yoga instruction under one roof with practitioners who hold advanced credentials across multiple modalities. The beach yoga sessions are particularly popular with visitors who want their wellness practice to connect with the coastal environment. It's the right choice for guests who want thoughtfully integrated wellness rather than a standard hotel spa menu.",
    notableFor:
      "Hilton Head's most holistic independent wellness studio — organic skincare, multi-modality bodywork, and beach yoga sessions all from a single locally-rooted practice.",
    address: '14 New Orleans Rd, Suite 2',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 422-8378',
    website: 'https://www.artofmassagehiltonhead.com',
    hours: 'Mon–Fri 9am–5pm (weekend sessions available — contact for schedule)', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Art of Massage and Yoga wellness studio, Hilton Head Island',
    },
  },
  {
    id: 'jiva-yoga-center',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Jiva Yoga Center',
    tagline: "Seven-days-a-week yoga classes in multiple styles — Vinyasa, Kundalini, Yin, SUP Yoga, and private instruction.",
    schemaType: 'HealthClub',
    categories: ['Yoga Studio', 'Multi-Style', 'SUP Yoga', 'Private Sessions', 'Beach Yoga'],
    priceRange: '$',
    review:
      "Jiva Yoga Center is the most complete yoga studio on Hilton Head Island — seven-days-a-week classes in Vinyasa, Hatha, Kundalini, Ashtanga, Yin, and Gentle/Restorative styles, plus private sessions and stand-up paddleboard yoga on the island's waterways. The two locations (William Hilton Pkwy and Mathews Dr) give access from both ends of the island, and the combination of class variety and experienced instructors makes it a practical option for visitors of any yoga background who want to maintain their practice during a stay.",
    notableFor:
      "The most comprehensive yoga studio on Hilton Head Island — seven-day-a-week classes in every major style, plus SUP yoga and private instruction.",
    address: '1032 William Hilton Pkwy',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 247-4549',
    website: 'https://www.jivayogacenter.com',
    hours: 'Mon–Fri 9am–7:15pm (varies by day), Sat–Sun 9am–12:30pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80&auto=format&fit=crop',
      alt: 'Jiva Yoga Center studio class, Hilton Head Island',
    },
  },
  {
    id: 'hh-beach-yoga',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'HH Beach Yoga (Island Yoga)',
    tagline: "Beach yoga sessions at Hilton Head's best locations — beginner-friendly classes on the sand and in the studio.",
    schemaType: 'HealthClub',
    categories: ['Beach Yoga', 'Beginner-Friendly', 'Studio Classes', 'Gentle Yoga', 'Restorative'],
    priceRange: '$',
    review:
      "HH Beach Yoga specializes in what visitors come to Hilton Head for: yoga on the actual beach. The studio offers both outdoor beach sessions at prime island locations and indoor classes — Gentle Yoga, Yoga 101, Vinyasa Flow, and Restorative — for less weather-dependent practice. The beginner-inclusive approach makes it the right first yoga experience for guests who want to try it in the best possible setting without needing prior experience.",
    notableFor:
      "The island's specialist in beach yoga sessions — guided classes on the sand at Hilton Head's best beach locations, with no yoga experience required.",
    address: 'Mobile / by-appointment service across Hilton Head Island',
    city: 'Hilton Head Island, SC 29928',
    phone: '(803) 420-2829',
    website: 'https://www.hhbeachyoga.com',
    hours: 'By appointment — text Crystal to book',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80&auto=format&fit=crop',
      alt: 'Beach yoga class on Hilton Head Island, South Carolina',
    },
  },
  {
    id: 'bikram-hot-yoga-hhi',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Bikram Hot Yoga Hilton Head',
    tagline: "Dedicated hot yoga studio — the traditional 26-posture Bikram series in a heated room, 6 days a week.",
    schemaType: 'HealthClub',
    categories: ['Hot Yoga', 'Bikram', 'Heated Studio', 'Traditional Practice', 'Daily Classes'],
    priceRange: '$',
    review:
      "Bikram Hot Yoga Hilton Head is the island's only dedicated hot yoga studio, offering the traditional 26-posture Bikram series in a properly heated room six days a week with early morning, midday, and evening class options. For visitors who practice Bikram at home and want to maintain the format during their stay, it's the one place on the island that delivers the authentic heated Bikram experience rather than a modified hot yoga variation.",
    notableFor:
      "The only dedicated Bikram hot yoga studio on Hilton Head Island — traditional 26-posture series, proper heat, and multiple daily class times.",
    address: '10 Executive Park Rd, Suite 101',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 689-9642',
    website: 'https://www.bikramhh.com',
    hours: 'Mon/Wed/Fri 5:30am–7:45pm; Tue/Thu 7:30am–8pm; Sat–Sun 7:30am–6pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200&q=80&auto=format&fit=crop',
      alt: 'Bikram Hot Yoga studio interior, Hilton Head Island',
    },
  },
  {
    id: 'back-in-balance-hhi',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Back In Balance Wellness Spa',
    tagline: "Therapeutic massage clinic — deep tissue, sports massage, and advanced bodywork from a locally trusted practice.",
    schemaType: 'DaySpa',
    categories: ['Therapeutic Massage', 'Deep Tissue', 'Sports Massage', 'By Appointment', 'Clinical'],
    priceRange: '$$',
    review:
      "Back In Balance Wellness Spa is a therapeutic massage and bodywork clinic with a strong reputation among the island's full-time residents — the signal that distinguishes a genuinely effective practice from a tourist-oriented one. The service menu focuses on functional outcomes: deep tissue work, sports massage, and specialized modalities for chronic tension and injury recovery. It's a better choice for visitors who want therapeutic results from their massage than the relaxation-oriented resort spa experience.",
    notableFor:
      "A therapeutically focused massage clinic trusted by local residents — the right choice when you want clinical results rather than a resort spa ambiance.",
    address: '33 Bow Cir, Building 62, Suite C',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 422-4841',
    website: 'https://www.backinbalancehhi.com',
    hours: 'Mon–Fri 8am–6:30pm, Sat–Sun 9am–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80&auto=format&fit=crop',
      alt: 'Back In Balance Wellness Spa massage therapy, Hilton Head Island',
    },
  },
  {
    id: 'hhi-spa-wellness',
    industrySlug: 'spas-wellness',
    featured: false,
    name: 'Hilton Head Island Spa & Wellness',
    tagline: "Boutique day spa specializing in Pure Organic Anti-Aging facials and an extensive massage menu — open seven days a week.",
    schemaType: 'DaySpa',
    categories: ['Organic Facials', 'Anti-Aging', 'Couples Massage', 'Seven Days', 'Boutique'],
    priceRange: '$$',
    review:
      "Hilton Head Island Spa & Wellness is a boutique day spa built around two specialties: Pure Organic Anti-Aging Facials and a broad massage menu that runs from Swedish and deep tissue to craniosacral, sports, Reiki, and couples massage. Seven-day availability (including Sundays with a 10am–3pm window) makes it practical for visitors whose schedules don't flex around typical spa hours. The mid-island location is accessible from most communities.",
    notableFor:
      "Open seven days a week including Sunday mornings — Pure Organic facials and an unusually wide massage menu from Swedish to craniosacral and Reiki.",
    address: '42 New Orleans Rd, Suite 203',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 816-3355',
    website: 'https://www.hiltonheadislandspa.com',
    hours: 'Mon 9am–5:30pm, Tue–Sat 9am–6pm, Sun 10am–3pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Island Spa & Wellness boutique day spa treatment room',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Shopping & Boutiques (10 profiles)
// ---------------------------------------------------------------------------

const shoppingBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'village-at-wexford',
    industrySlug: 'shopping',
    featured: true,
    name: 'The Village at Wexford',
    tagline: "Upscale European-style courtyard shopping with 30+ award-winning merchants, live jazz, and Lilly Pulitzer.",
    schemaType: 'ShoppingCenter',
    categories: ['Boutiques', 'Gift Shops', 'Jewelry', 'Upscale', 'Live Entertainment'],
    priceRange: '$$$',
    review:
      "The Village at Wexford is the most refined shopping destination on Hilton Head Island — a European-style courtyard complex with 30+ merchants ranging from Lilly Pulitzer and fine jewelry to gift boutiques, galleries, and top-rated restaurants. The regular live jazz performances in the courtyard make it a destination in the evening rather than just a retail errand, and the merchant caliber is consistently above what you'll find at the more tourist-oriented centers. It's the shopping option that repeat visitors seek out specifically.",
    notableFor:
      "Hilton Head's most curated retail destination — European courtyard setting, 30+ award-winning merchants, and live jazz performances that make it a destination rather than a chore.",
    address: '1000 William Hilton Pkwy',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-2400',
    website: 'https://www.villageatwexford.com',
    hours: 'Mon–Thu 9am–9pm, Fri–Sun 10am–9pm (individual store hours vary)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1572533177115-5bea803c0f49?w=1200&q=80&auto=format&fit=crop',
      alt: 'The Village at Wexford courtyard shopping center, Hilton Head Island',
    },
    lat: 32.1844,
    lng: -80.7325,
  },
  // ——— Regular listings ———
  {
    id: 'coligny-plaza',
    industrySlug: 'shopping',
    featured: false,
    name: 'Coligny Plaza',
    tagline: "The island's original beach shopping center — 60+ shops steps from Coligny Beach, open late in season.",
    schemaType: 'ShoppingCenter',
    categories: ['Beach Shopping', 'Surf Shops', 'Souvenirs', 'Family-Friendly', 'Open Late'],
    priceRange: '$$',
    review:
      "Coligny Plaza has anchored the Forest Beach shopping corridor since the 1950s and remains the most-visited retail hub on the island. With 60+ shops, restaurants, and services in an open-air format walkable from Coligny Beach, it serves every visitor segment — surf gear, T-shirts, ice cream, beach rentals, and casual dining all in one place. The free parking and late evening hours in season make it a reliable base for families who want to extend their beach day without driving across the island.",
    notableFor:
      "The island's best-located shopping center — 60+ shops steps from Coligny Beach, free parking, and the late hours that let families turn a beach day into an evening out.",
    address: '1 N Forest Beach Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-6050',
    website: 'https://www.colignyplaza.com',
    hours: 'Mon & Fri 8am–10pm, Tue–Thu & Sat–Sun 10am–9pm (seasonal)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Coligny Plaza beach shopping center, Forest Beach, Hilton Head Island',
    },
  },
  {
    id: 'shelter-cove-towne-centre',
    industrySlug: 'shopping',
    featured: false,
    name: 'Shelter Cove Towne Centre',
    tagline: "Waterfront lifestyle center on Broad Creek marina — shops, dining, farmers market, and nightly summer entertainment.",
    schemaType: 'ShoppingCenter',
    categories: ['Marina', 'Waterfront', 'Live Events', 'Dining', 'Farmers Market'],
    priceRange: '$$',
    review:
      "Shelter Cove Towne Centre is Hilton Head's waterfront lifestyle center — 35+ shops and restaurants on the banks of Broad Creek marina, with a community park, playground, and a calendar of free outdoor events that includes summer concerts, a Tuesday farmers market, and holiday programming. The marina setting makes it a natural gathering spot in the evenings; boats dock alongside the restaurants, and the combination of shopping, dining, and entertainment covers most of what families and couples need for a full afternoon.",
    notableFor:
      "The only marina-front shopping center on Hilton Head Island — boutiques, dining, and free summer concerts in a waterfront setting that keeps people there all evening.",
    address: '40 Shelter Cove Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-3090',
    website: 'https://www.sheltercovetownecentre.com',
    hours: 'Individual store hours vary; grounds always accessible',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1517696522815-46a004b80a2d?w=1200&q=80&auto=format&fit=crop',
      alt: 'Shelter Cove Towne Centre waterfront shopping, Hilton Head Island',
    },
  },
  {
    id: 'harbour-town-shops',
    industrySlug: 'shopping',
    featured: false,
    name: 'Harbour Town Shops at Sea Pines',
    tagline: "20+ locally owned boutiques and galleries around the Harbour Town lighthouse — the most photographed shopping in the Southeast.",
    schemaType: 'ShoppingCenter',
    categories: ['Boutiques', 'Art Galleries', 'Lighthouse Setting', 'Gifts', 'Sea Pines'],
    priceRange: '$$$',
    review:
      "The 20+ shops clustered around the Harbour Town lighthouse are as much a part of the Sea Pines experience as the golf and the marina. Bailey's Ltd. has anchored the row for over 40 years with decorative gifts and accessories; the Harbour Town Surf Shop serves the water sports crowd; and the combination of galleries, clothing boutiques, and specialty shops makes it worth a full afternoon. The setting — sailboats, the lighthouse, waterfront dining — is the most distinctive retail environment on the island.",
    notableFor:
      "Shopping around one of the most recognized landmarks in the South — 20+ boutiques at the base of the Harbour Town lighthouse, where the setting is as good as the stores.",
    address: '149 Lighthouse Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 363-4530',
    website: 'https://www.seapines.com/experiences/harbour-town/shopping-dining',
    hours: 'Most shops daily 10am–6pm (seasonal)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1582517339790-63168430ee86?w=1200&q=80&auto=format&fit=crop',
      alt: 'Harbour Town lighthouse boutiques and shops, Sea Pines Resort, Hilton Head Island',
    },
  },
  {
    id: 'coastal-bliss-boutique',
    industrySlug: 'shopping',
    featured: false,
    name: 'Coastal Bliss Boutique',
    tagline: "Voted Hilton Head's Best Women's Clothing Store — locally owned since 2013 with curated coastal style at every price point.",
    schemaType: 'ClothingStore',
    categories: ['Women\'s Boutique', 'Coastal Style', 'Award-Winning', 'Locally Owned', 'Resort Wear'],
    priceRange: '$$',
    review:
      "Coastal Bliss Boutique has been voted Hilton Head's Best Women's Clothing Store and operates from its Shelter Cove Towne Centre location with a curated selection of coastal resort wear that covers everything from casual beach cover-ups to elevated occasion pieces. Owner Blake Schmid opened the boutique in 2013 with a specific vision: locally owned, thoughtfully curated, and priced across a range that doesn't require a special occasion. The island's best independent women's clothing boutique.",
    notableFor:
      "Voted Hilton Head's best women's boutique — locally owned and curated with genuine coastal style, from casual cover-ups to occasion-worthy pieces.",
    address: '38 Shelter Cove Ln, Suite 126',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 802-4050',
    website: 'https://www.coastalblisshiltonhead.com',
    hours: 'Mon–Sat 10am–7pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1572533177115-5bea803c0f49?w=1200&q=80&auto=format&fit=crop',
      alt: 'Coastal Bliss Boutique women\'s clothing store, Shelter Cove, Hilton Head Island',
    },
  },
  {
    id: 'gifted-hilton-head',
    industrySlug: 'shopping',
    featured: false,
    name: 'Gifted Hilton Head',
    tagline: "Award-winning upscale gifts, fine jewelry, and custom Hilton Head pieces — the island's best destination for occasion shopping.",
    schemaType: 'JewelryStore',
    categories: ['Fine Jewelry', 'Gifts', 'Custom Items', 'Baby Gifts', 'Award-Winning'],
    priceRange: '$$$',
    review:
      "Gifted Hilton Head has been one of the island's most decorated boutiques for over 15 years — consistently recognized for the quality and originality of its gift and jewelry selection. The store carries fine jewelry, baby gifts, custom Hilton Head-branded items, candles, tableware, and locally curated pieces across a range that makes it equally useful for a first-anniversary present and a high-quality souvenir. It's the shop visitors return to specifically rather than discovering accidentally.",
    notableFor:
      "The island's most awarded gift and jewelry boutique — 15+ years of curated fine gifts and custom Hilton Head pieces that set a standard above generic resort shopping.",
    address: '1000 William Hilton Pkwy, Suite J2',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-8787',
    website: 'https://www.giftedhiltonhead.com',
    hours: 'Mon–Sat 10am–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Gifted Hilton Head fine jewelry and gift boutique, Village at Wexford',
    },
  },
  {
    id: 'nash-gallery',
    industrySlug: 'shopping',
    featured: false,
    name: 'Nash Gallery',
    tagline: "Family-owned fine craft gallery since 1989 — 150+ American craftsmen, 100% made in North America, no mass production.",
    schemaType: 'ArtGallery',
    categories: ['Fine Craft', 'Art Gallery', 'American Made', 'Jewelry', 'Glass & Ceramics'],
    priceRange: '$$$',
    review:
      "Nash Gallery has operated at Shelter Cove Harbour since 1989 with a mission that remains unusual in gallery retail: every piece is made by North American craftspeople, nothing is imported, and nothing is mass-produced. The 150+ artists represented work in glass, ceramics, studio jewelry, metal sculpture, and mixed media — giving collectors genuinely distinctive work rather than the coastal art clichés that fill most beach town galleries. It's one of the most respected fine craft destinations on the East Coast.",
    notableFor:
      "Fine craft gallery operating since 1989 with a strict 100%-made-in-North-America policy — 150+ craftspeople whose work you won't find in any other gallery.",
    address: '13 Harbourside Ln, Suite 2H',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-6424',
    website: 'https://www.nashgallery.com',
    hours: 'Mon 11am–4pm, Tue–Sat 10am–5pm, Sun 11am–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1545558014401-f43c5b4b4f55?w=1200&q=80&auto=format&fit=crop',
      alt: 'Nash Gallery fine American craft at Shelter Cove Harbour, Hilton Head Island',
    },
  },
  {
    id: 'vivid-gallery-hhi',
    industrySlug: 'shopping',
    featured: false,
    name: 'Vivid Gallery',
    tagline: "Fine art photography inside the Harbour Town Lighthouse — Lowcountry large-format prints with proceeds to Parkinson's research.",
    schemaType: 'ArtGallery',
    categories: ['Photography', 'Fine Art', 'Lighthouse Gallery', 'Lowcountry Prints', 'Charitable'],
    priceRange: '$$$',
    review:
      "Vivid Gallery occupies a unique position — literally — as the only gallery inside the Harbour Town Lighthouse. Photographer Jeff Keefer's large-format canvas prints of Hilton Head and the Lowcountry are produced at a quality that rewards the close inspection the gallery setting enables. The story behind the work is meaningful: a portion of canvas print proceeds goes to the Michael J. Fox Foundation for Parkinson's research, which gives purchases a dimension beyond interior decoration.",
    notableFor:
      "The only gallery inside the Harbour Town Lighthouse — large-format Lowcountry photography by Jeff Keefer, with canvas print sales supporting Parkinson's research.",
    address: '71 Lighthouse Rd, Suite 214',
    city: 'Hilton Head Island, SC 29928',
    phone: '(912) 414-4383',
    website: 'https://www.vivid-gallery-hhi.com',
    hours: 'Check website for current hours', // TODO: VERIFY — inside Lighthouse complex
    heroImage: {
      src: 'https://images.unsplash.com/photo-1545558014401-f43c5b4b4f55?w=1200&q=80&auto=format&fit=crop',
      alt: 'Vivid Gallery Lowcountry photography inside Harbour Town Lighthouse, Hilton Head Island',
    },
  },
  {
    id: 'hilton-head-outfitters-retail',
    industrySlug: 'shopping',
    featured: false,
    name: 'Hilton Head Outfitters',
    tagline: "The activity hub inside Palmetto Dunes — bike rentals, Segways, kayaks, beach gear, and guided tours all in one stop.",
    schemaType: 'SportingGoodsStore',
    categories: ['Outdoor Gear', 'Bike Rentals', 'Beach Equipment', 'Segway Tours', 'Activity Booking'],
    priceRange: '$$',
    review:
      "Hilton Head Outfitters is the practical hub for active visitors staying at or near Palmetto Dunes — bikes, kayaks, paddleboards, Segways, and beach gear all available for rent with guided tours bookable at the same counter. For families who want to spend full days exploring the resort without driving off-property, it eliminates the need to bring or source equipment from multiple providers. It's among the most positively reviewed activity operations on the island for its combination of selection and staff quality.",
    notableFor:
      "One-stop activity and equipment hub inside Palmetto Dunes — bikes, kayaks, beach gear, and Segway tours with the friendliest staff operation on the island.",
    address: '80 Queens Folly Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(866) 380-1783',
    website: 'https://www.hiltonheadoutfitters.com',
    hours: 'Daily 9am–5pm (seasonal)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80&auto=format&fit=crop',
      alt: 'Hilton Head Outfitters bike and kayak rentals at Palmetto Dunes Resort',
    },
  },
  {
    id: 'coastal-treasures-harbour-town',
    industrySlug: 'shopping',
    featured: false,
    name: 'Coastal Treasures',
    tagline: "Handcrafted gifts, local art, and curated wine selection in the heart of Harbour Town — the island's most distinctive souvenir shop.",
    schemaType: 'GiftShop',
    categories: ['Gifts', 'Local Art', 'Wine', 'Handcrafted', 'Harbour Town'],
    priceRange: '$$',
    review:
      "Coastal Treasures sits in Harbour Town and distinguishes itself from generic resort gift shops through a curatorial approach that favors handcrafted items, locally made art, and a thoughtful wine selection over mass-produced merchandise. It's the place visitors come when they want something they won't find at the airport gift shop — items that actually reflect the island rather than just displaying its name. The Harbour Town location puts it within easy reach of the lighthouse, marina, and restaurants.",
    notableFor:
      "The Harbour Town gift shop that actually reflects the island — handcrafted pieces, local art, and a curated wine selection that justify the word 'treasure' in the name.",
    address: '149 Lighthouse Rd, Suite B',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-3643',
    website: 'https://www.coastaltreasures-hiltonhead.com',
    hours: 'Seasonal — call for current hours', // TODO: VERIFY
    heroImage: {
      src: 'https://images.unsplash.com/photo-1622726196151-bfa9875199b0?w=1200&q=80&auto=format&fit=crop',
      alt: 'Coastal Treasures gift shop in Harbour Town, Sea Pines, Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Businesses — Family & Kids Activities (10 profiles)
// ---------------------------------------------------------------------------

const familyBusinesses: Business[] = [
  // ——— FEATURED PARTNER ———
  {
    id: 'coastal-discovery-museum',
    industrySlug: 'family-activities',
    featured: true,
    name: 'Coastal Discovery Museum',
    tagline: "70 acres of historic Honey Horn Plantation — free admission, nature trails, Gullah history, and the island's best guided programs.",
    schemaType: 'Museum',
    categories: ['Museum', 'Nature Programs', 'Gullah Culture', 'Free Admission', 'Historic Site'],
    priceRange: '$',
    review:
      "The Coastal Discovery Museum at Honey Horn is one of the best family attractions in coastal South Carolina, full stop. Set on 70 acres of a historic plantation with tabby ruins, centuries-old live oaks, and working gardens, it offers free admission with rotating exhibits on Hilton Head's natural history, the Gullah Geechee culture that shaped the island, and the Lowcountry ecosystem. The guided nature programs — salt marsh walks, sea turtle patrols, nature art workshops — are legitimately excellent, and the price (free to low-cost) makes it accessible every day of a week-long stay.",
    notableFor:
      "Free admission to 70 acres of historic plantation land with exceptional nature programs and Gullah cultural interpretation — the best all-ages attraction on Hilton Head Island.",
    address: '70 Honey Horn Dr',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 689-6767',
    website: 'https://www.coastaldiscovery.org',
    hours: 'Mon–Sat 9am–4:30pm, Sun 11am–4:30pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1623902114358-9ee816e91401?w=1200&q=80&auto=format&fit=crop',
      alt: 'Coastal Discovery Museum at Honey Horn Plantation, Hilton Head Island',
    },
    lat: 32.2378,
    lng: -80.7603,
  },
  // ——— Regular listings ———
  {
    id: 'the-sandbox-museum',
    industrySlug: 'family-activities',
    featured: false,
    name: 'The Sandbox: An Interactive Children\'s Museum',
    tagline: "Two floors, 11+ hands-on exhibits — Hilton Head's dedicated children's museum near Coligny Beach.",
    schemaType: 'Museum',
    categories: ['Children\'s Museum', 'Interactive', 'Indoor', 'Ages 1–10', 'Rainy Day'],
    priceRange: '$',
    review:
      "The Sandbox fills a real need on Hilton Head Island — a dedicated children's museum with 11+ hands-on interactive exhibits spread across two floors, specifically designed for young children ages 1 to 10. The themed areas span imaginative play (a miniature grocery store, a construction zone, a veterinary clinic), creative arts, and basic science exploration. It's the island's go-to answer for rainy mornings, recovery days, or families with kids too young to log a full beach day.",
    notableFor:
      "Hilton Head's only dedicated children's museum — 11+ interactive exhibits for ages 1–10, the island's best solution for rainy days or high-energy mornings.",
    address: '80 Nassau St',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-7645',
    website: 'https://www.thesandbox.org',
    hours: 'Mon–Sat 10am–5pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80&auto=format&fit=crop',
      alt: 'The Sandbox interactive children\'s museum, Hilton Head Island',
    },
  },
  {
    id: 'lawton-stables',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Lawton Stables',
    tagline: "The only horseback riding on Hilton Head Island — guided trail rides through Sea Pines Forest Preserve.",
    schemaType: 'SportsActivityLocation',
    categories: ['Horseback Riding', 'Trail Rides', 'Sea Pines', 'Pony Rides', 'Farm Animals'],
    priceRange: '$$',
    review:
      "Lawton Stables is the only place on Hilton Head Island to go horseback riding — and the setting makes it genuinely exceptional. The one-hour western-style trail rides wind through Sea Pines Forest Preserve, a 600-acre protected maritime forest with ancient live oaks, deer, and the quiet that comes from being inside one of the most carefully managed natural areas on the East Coast. Pony rides for young children, a small animal farm, and carriage tours round out the offering for families with mixed age groups.",
    notableFor:
      "The only horseback riding on Hilton Head Island — guided trail rides through the 600-acre Sea Pines Forest Preserve, with pony rides and a farm for younger kids.",
    address: '190 Greenwood Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-2586',
    website: 'https://www.lawtonstables.com',
    hours: 'Tue–Sun 8am–5pm; closed Monday',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1598711033236-3e0b403a14e8?w=1200&q=80&auto=format&fit=crop',
      alt: 'Lawton Stables horseback riding in Sea Pines Forest Preserve, Hilton Head Island',
    },
  },
  {
    id: 'pirates-island-golf',
    industrySlug: 'family-activities',
    featured: false,
    name: "Pirate's Island Adventure Golf",
    tagline: "Two 18-hole pirate-themed courses with caves, waterfalls, and props — Hilton Head's most elaborate mini golf.",
    schemaType: 'SportsActivityLocation',
    categories: ['Mini Golf', 'Family Entertainment', 'Themed', 'Ages 3+', 'Evening Activity'],
    priceRange: '$',
    review:
      "Pirate's Island Adventure Golf is consistently the highest-rated mini golf option on Hilton Head Island — two 18-hole courses themed around a pirate ship wreck, with genuine caves, waterfalls, sound effects, and props that go well beyond the standard flat-green mini golf format. It's near Shelter Cove, so it pairs naturally with dinner at the marina restaurants, and the evening lighting makes it better at dusk than in afternoon heat. Consistently cited on TripAdvisor as a top family activity.",
    notableFor:
      "The island's most elaborately themed mini golf — caves, waterfalls, and pirate props that make it a genuine event rather than a filler activity.",
    address: '8 Marina Side Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-4001',
    website: 'https://www.piratesislandgolf.com',
    hours: 'Daily 9am–10pm (seasonal)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1564607890610-2172bf275043?w=1200&q=80&auto=format&fit=crop',
      alt: "Pirate's Island Adventure Golf mini golf course, Hilton Head Island",
    },
  },
  {
    id: 'legendary-golf-hhi',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Legendary Golf',
    tagline: "Voted #1 mini golf in South Carolina — 41+ years, two 18-hole outdoor courses with real water hazards and elevation.",
    schemaType: 'SportsActivityLocation',
    categories: ['Mini Golf', '#1 in SC', 'Outdoor', 'Water Features', 'Family Classic'],
    priceRange: '$',
    review:
      "Legendary Golf has been operating on Hilton Head Island for more than 41 years and has been voted the number one miniature golf course in both Beaufort County and South Carolina. The two 18-hole outdoor courses feature real water hazards, ponds, waterfalls, elevation changes, and shaded tree canopy — a significant step above the flat painted-concrete variety. The long operating history shows in the maintenance quality; the courses are genuinely well-kept. The inspirational plaques on each hole are a distinctive touch that regular visitors remember.",
    notableFor:
      "Voted #1 miniature golf in South Carolina — 41+ years on the island, two outdoor courses with genuine water features and the shaded canopy that makes afternoon play bearable.",
    address: '900 William Hilton Pkwy',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-3399',
    website: 'https://www.legendarygolfhhi.com',
    hours: 'Daily 9am–9pm (seasonal)',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1575721087345-4cd6f2a157ca?w=1200&q=80&auto=format&fit=crop',
      alt: 'Legendary Golf miniature golf course, Hilton Head Island, SC',
    },
  },
  {
    id: 'adventure-cove-mini-golf',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Adventure Cove Mini Golf & Arcade',
    tagline: "36 holes of Caribbean-themed mini golf plus the island's largest arcade — open late every night.",
    schemaType: 'AmusementPark',
    categories: ['Mini Golf', 'Arcade', 'Caribbean Theme', 'Late Hours', 'Family Entertainment'],
    priceRange: '$',
    review:
      "Adventure Cove combines two 18-hole Caribbean-themed mini golf courses — Lost Lagoon and Paradise Falls — with the largest arcade on Hilton Head Island. The 11pm closing time makes it the go-to evening activity for families whose kids have boundless energy after dinner, and the arcade gives younger children an option when their siblings are working through the mini golf. The tropical cave-and-lagoon theming on the courses is genuinely elaborate.",
    notableFor:
      "Two 18-hole Caribbean courses plus the island's largest arcade — open until 11pm, making it the default answer when families need an evening activity after dinner.",
    address: '18 Folly Field Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 842-9990',
    website: 'https://www.adventurecove.com',
    hours: 'Daily 10am–11pm',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&q=80&auto=format&fit=crop',
      alt: 'Adventure Cove Caribbean mini golf and arcade, Hilton Head Island',
    },
  },
  {
    id: 'coligny-beach-park',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Coligny Beach Park',
    tagline: "Free public beach access, kids' splash pad, accessible mat, and 397 free parking spaces — the island's family beach hub.",
    schemaType: 'Park',
    categories: ['Public Beach', 'Free Admission', 'Splash Pad', 'Accessible', 'Lifeguards'],
    priceRange: '$',
    review:
      "Coligny Beach Park is the most family-engineered beach access point on Hilton Head Island — shallow water extending far offshore (30 feet out to reach 3 feet depth), a kids' splash pad adjacent to the beach, seasonal lifeguards, accessible beach matting for mobility devices, covered gazebos, outdoor showers and changing rooms, and 397 free parking spaces. It's directly walkable to Coligny Plaza's restaurants and shops. Named a national Best Family Beach, and the infrastructure backs up the designation.",
    notableFor:
      "The best-equipped public beach access on Hilton Head Island — free admission, free parking, kids' splash pad, accessible matting, and one of the shallowest shorelines on the East Coast.",
    address: '1 N Forest Beach Dr',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 785-4713',
    website: 'https://hiltonheadislandsc.gov/parks/ColignyBeach',
    hours: 'Daily 6am–9pm (summer); 6am–6pm (winter); lifeguards seasonal',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
      alt: 'Coligny Beach Park public beach with families, Forest Beach, Hilton Head Island',
    },
    lat: 32.1366,
    lng: -80.7614,
  },
  {
    id: 'harbour-town-lighthouse',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Harbour Town Lighthouse & Museum',
    tagline: "Climb Hilton Head's most iconic landmark — 114 steps, 9 floors of island history, panoramic views at the top.",
    schemaType: 'TouristAttraction',
    categories: ['Landmark', 'Museum', 'Views', 'History', 'Ages 4+'],
    priceRange: '$',
    review:
      "The Harbour Town Lighthouse is the most recognized structure on Hilton Head Island and the visual centerpiece of Sea Pines Resort. Visitors climb 114 steps through nine landings, each featuring interpretive exhibits covering the island's Civil War history, Gullah cultural heritage, the development of Sea Pines, and the RBC Heritage PGA tournament. The panoramic view from the top takes in the marina, Calibogue Sound, Daufuskie Island, and on clear days the South Carolina mainland. Children as young as four can manage the climb; the lighthouse museum adds genuine educational value to what would otherwise be a tourist photo stop.",
    notableFor:
      "Hilton Head Island's defining landmark — climb 114 steps through Civil War history, Gullah culture, and RBC Heritage golf exhibits to panoramic views of Calibogue Sound.",
    address: '149 Lighthouse Rd',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 671-2810',
    website: 'https://www.harbourtownlighthouse.com',
    hours: 'Daily 10am–sundown, year-round',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1582517339790-63168430ee86?w=1200&q=80&auto=format&fit=crop',
      alt: 'Harbour Town Lighthouse red and white striped tower, Sea Pines, Hilton Head Island',
    },
    lat: 32.1432,
    lng: -80.8104,
  },
  {
    id: 'pinckney-island-refuge',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Pinckney Island National Wildlife Refuge',
    tagline: "4,000+ acres of tidal marsh and maritime forest — free wildlife refuge with 14 miles of trails 1 mile from the Hilton Head bridge.",
    schemaType: 'Park',
    categories: ['Wildlife', 'Bird Watching', 'Hiking', 'Free', 'No Cars'],
    priceRange: '$',
    review:
      "Pinckney Island National Wildlife Refuge sits one mile from the Hilton Head bridge and is one of the most accessible free wildlife experiences in the Lowcountry. The 4,053-acre refuge has 14 miles of unpaved trails through salt marsh, freshwater ponds, and maritime forest — no motorized vehicles allowed, which means it stays genuinely quiet even in high season. The bird list runs to 250+ species; alligators, deer, and wading birds are reliable sightings year-round. The Ibis Pond Loop (1.2 miles) is the right trail for families.",
    notableFor:
      "A 4,000-acre free wildlife refuge one mile from Hilton Head — no cars, 250+ bird species, reliable alligator sightings, and an easy 1.2-mile family trail.",
    address: 'US Hwy 278 at Pinckney Island (approx. 1 mile west of HHI bridge)',
    city: 'Hilton Head Island, SC 29926',
    phone: '(843) 784-2468',
    website: 'https://www.fws.gov/refuge/pinckney-island',
    hours: 'Daily sunrise to sunset',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=1200&q=80&auto=format&fit=crop',
      alt: 'Pinckney Island National Wildlife Refuge salt marsh trail, near Hilton Head Island',
    },
  },
  {
    id: 'outside-hhi-family-tours',
    industrySlug: 'family-activities',
    featured: false,
    name: 'Outside Hilton Head — Family Eco Tours',
    tagline: "USCG-guided family kayak tours, nature programs, and dolphin trips designed specifically for kids and families.",
    schemaType: 'TouristInformationCenter',
    categories: ['Kayak Tours', 'Dolphin Tours', 'Eco Programs', 'Kids Camps', 'Family-Friendly'],
    priceRange: '$$',
    review:
      "Outside Hilton Head's family programming is the most established on the island — guided kayak tours designed for children as young as five, family-format dolphin watches, and summer kids camps run by trained naturalists who are as good with children as they are with coastal ecology. The 46-year operating history means the programs are refined rather than improvised, and the USCG-licensed guides ensure every on-water activity is properly structured for safety. For families who want nature education alongside the adventure, this is the right operator.",
    notableFor:
      "46 years of family-format guided nature tours — the most experienced and safety-focused outdoor program operator for families with young children on Hilton Head Island.",
    address: '50 Shelter Cove Ln',
    city: 'Hilton Head Island, SC 29928',
    phone: '(843) 686-6996',
    website: 'https://www.outsidehiltonhead.com',
    hours: 'Daily 7:30am–6pm, 365 days a year',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=1200&q=80&auto=format&fit=crop',
      alt: 'Family kayak eco tour with Outside Hilton Head, Hilton Head Island',
    },
  },
];

// ---------------------------------------------------------------------------
// Business registry
// ---------------------------------------------------------------------------

export const allBusinesses: Business[] = [
  ...fbBusinesses,
  ...waterBusinesses,
  ...golfBusinesses,
  ...vacationRentalBusinesses,
  ...weddingBusinesses,
  ...spaBusinesses,
  ...shoppingBusinesses,
  ...familyBusinesses,
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
