/**
 * FAQ data — single source of truth.
 *
 * `items` is the legacy short list rendered on the homepage FAQ section.
 * `clusters` is the expanded set used on `/faq` and surfaced as
 * intent-specific subsets on neighborhood / trip-type / industry pages.
 *
 * Each cluster is an LLM-citation unit: clear question, direct-answer
 * first sentence, supporting detail. Aim for 60–180 words per answer —
 * long enough to stand alone in an LLM citation, short enough to read.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCluster = {
  slug: string;
  title: string;
  description: string;
  items: ReadonlyArray<FaqItem>;
};

export const faq = {
  eyebrow: 'Common Questions',
  heading: {
    plain: 'Everything you want to know, and',
    accent: 'a few things you didn\'t.',
  },
  /** Legacy homepage list — keep ≤ 5 for above-the-fold density. */
  items: [
    {
      question: 'Why hire a travel consultant for Hilton Head?',
      answer:
        "Because the best of Hilton Head is never on the first page of Google — it's in the heads of the people who live here. We know which oceanfront villa has the pool that goes quiet by 4 p.m. (the one that fills up ten minutes after the cover comes off in March). We know which Skull Creek table catches the last ten minutes of sun in late July. And we know which Harbour Town tee time opens up two Tuesdays out, even when the booking page tells you otherwise. The result: a trip your spouse thinks took a weekend to plan, that actually took thirty years.",
    },
    {
      question: 'How is this different from Airbnb, Vrbo, or a resort concierge?',
      answer:
        "Those sites show you what's bookable, not what's good. A resort concierge only knows their property. We know the whole island, and we work for you, not the listings.",
    },
    {
      question: 'What does it cost?',
      answer:
        "We're paid by you, not by the properties — that's the whole reason we can recommend the right villa instead of the most-commissioned one. Four tiers: $95 discovery session (credited back if you book), $450 flat for a custom itinerary, 8% of trip total (min $800) for signature service with on-island concierge, and 12% (min $2,500) for groups and weddings. Every engagement is quoted up front. No surprise fees, no kickbacks.",
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'For summer (June to August), four to six months out is ideal for villa inventory. For fall golf trips and spring break, two to three months. Last-minute we still take, but your options narrow quickly.',
    },
    {
      question: 'Do you handle groups over 20?',
      answer:
        'Yes. Weddings, reunions, corporate offsites, and golf trips up to 100 people. Group work is where having a local really pays off: vendor coordination, transportation, dietary restrictions, and tee-time blocks all move through one contact.',
    },
  ],
} as const;

/**
 * Full FAQ matrix. Used on /faq and as filtered subsets elsewhere.
 * Order within a cluster: most-asked first.
 */
export const faqClusters: ReadonlyArray<FaqCluster> = [
  {
    slug: 'pricing',
    title: 'Pricing & Service Tiers',
    description: 'What it costs to work with Hilton Ahead and what you get at each level.',
    items: [
      {
        question: 'How much does Hilton Ahead cost?',
        answer:
          'There are four service tiers. The $95 discovery session is a 30-minute scoping call, credited back when you book. A flat $450 custom itinerary covers a complete trip plan with reservations and recommendations. Signature service runs 8% of total trip spend (minimum $800) and adds full on-island concierge. Group and wedding planning runs 12% (minimum $2,500). Every engagement is quoted up front before you commit.',
      },
      {
        question: 'Are there hidden fees or commissions?',
        answer:
          "No. Our fees come from you, not the properties. We don't take kickbacks from villas, resorts, or restaurants — that's the whole reason we can recommend the place that's actually right for you instead of the place that pays the highest commission. If a partner property happens to extend a rate discount, it goes to you.",
      },
      {
        question: 'Do you offer a free consultation?',
        answer:
          "Yes. Every new client starts with a free 15-minute introduction call. If you decide to engage, the $95 discovery session digs deeper into your trip and is credited back when you book any tier.",
      },
      {
        question: 'Will I save money using Hilton Ahead vs. booking myself?',
        answer:
          "Often, yes. Our partner network includes 60+ properties at preferred rates that average 8–12% below public listings. On a $4,000 villa week, that's enough to cover the consulting fee outright. The bigger value is preventing the bad-fit booking — the canal-facing villa marketed as 'oceanfront,' the resort whose pool is closed for renovation the week you're there.",
      },
    ],
  },
  {
    slug: 'timing',
    title: 'Timing & Booking Windows',
    description: 'When to book, when to visit, and when peak season hits.',
    items: [
      {
        question: 'How far in advance should I book a Hilton Head trip?',
        answer:
          "For peak summer (June through August), four to six months out is ideal for villa inventory and Top-100 golf tee times. For shoulder seasons (April–May, September–October), two to three months. Last-minute trips inside 30 days are still doable but options narrow fast — especially for oceanfront stays and groups over six.",
      },
      {
        question: 'When is the best time of year to visit Hilton Head Island?',
        answer:
          "Mid-April through mid-June and mid-September through October are the sweet spots: 75–85°F days, low humidity, ocean warm enough to swim, restaurants not yet on summer chaos pace. November is golf weather. February through March is the quietest and cheapest if you don't need to swim. July and August are warmest and busiest.",
      },
      {
        question: 'When is the RBC Heritage golf tournament?',
        answer:
          "RBC Heritage Presented by Boeing runs the week after The Masters every April at Harbour Town Golf Links in Sea Pines. The 2026 event is April 13–19. Plan lodging and tickets six months out — accommodations within Sea Pines book first.",
      },
      {
        question: 'Is Hilton Head busy during spring break?',
        answer:
          "Yes — late February through early April brings college and family spring-break crowds, peaking the week before Easter. Beach and pool capacity tightens, restaurant waits get long, and tee times require advance booking. Book lodging 60–90 days ahead at minimum.",
      },
    ],
  },
  {
    slug: 'lodging',
    title: 'Where to Stay',
    description: 'Villa vs. resort, neighborhood differences, and what oceanfront actually means.',
    items: [
      {
        question: 'Should I stay in a villa or a resort on Hilton Head?',
        answer:
          "Villas suit groups of four or more, longer stays (5+ nights), and travelers who cook one or two meals in. Resorts suit couples, short stays, and travelers who want daily housekeeping, on-site restaurants, and a single point of contact. The Sea Pines Resort, Palmetto Dunes Oceanfront Resort, and Sonesta cover the resort segment; the rest of the island is villa-and-rental territory.",
      },
      {
        question: 'What does "oceanfront" mean on Hilton Head?',
        answer:
          "Truly oceanfront means the property sits on the dune line with direct beach views. 'Oceanview' often means a partial view from a high floor. 'Ocean-oriented' or 'beach-area' typically means a 3–10 minute walk to the sand. The distinction matters for peak-summer rates — true oceanfront commands a 30–60% premium.",
      },
      {
        question: 'What is the difference between Sea Pines and Palmetto Dunes?',
        answer:
          "Sea Pines is the original 1956 Charles Fraser plantation: 5,000 acres, 17 miles of bike paths, three signature golf courses (including Harbour Town), Harbour Town Marina, and a polished, slightly more formal feel. Palmetto Dunes is younger, beachier, with longer lagoons for kayaking and three of its own golf courses. Sea Pines for the iconic Hilton Head experience; Palmetto Dunes for a more casual beach-week feel.",
      },
      {
        question: 'Where is the best place to stay in Hilton Head for first-time visitors?',
        answer:
          "Most first-timers do best in Sea Pines or North Forest Beach. Sea Pines for the full island-resort experience inside one gated community with bike paths, beaches, and dining; North Forest Beach for walkable proximity to Coligny Plaza, the family-friendly center of the island. Avoid mid-island rentals on US-278 for a first trip — you'll want to be on the beach side, not the highway side.",
      },
    ],
  },
  {
    slug: 'golf',
    title: 'Golf Trips',
    description: 'Tee times, course access, and group golf logistics.',
    items: [
      {
        question: 'Can I play Harbour Town Golf Links as a non-resort guest?',
        answer:
          "Yes — Harbour Town accepts public play through The Sea Pines Resort tee-time system, but rates and access are best for resort guests. Booking through us gives you priority windows and the second-tee combos (Heron Point, Atlantic Dunes) that most public bookers miss.",
      },
      {
        question: 'How many golf courses are on Hilton Head Island?',
        answer:
          "Twenty-four, with another fifteen within a 30-minute drive in Bluffton and the surrounding Lowcountry. The Top-tier shortlist most groups want: Harbour Town, Heron Point, and Atlantic Dunes (Sea Pines); Palmetto Dunes' Robert Trent Jones, George Fazio, and Arthur Hills; Palmetto Hall; May River at Palmetto Bluff; and Colleton River.",
      },
      {
        question: 'What is the best Hilton Head golf course for a 12-person group?',
        answer:
          "For a single-course package, Palmetto Dunes is built for it — three courses on one property, group-friendly carts, and a clubhouse that handles 12-top dinners without a reservation panic. For a Top-100 anchor round, pair Harbour Town or May River with two other courses and rotate.",
      },
      {
        question: 'Do you book tee times for non-clients?',
        answer:
          "We don't book individual tee times standalone — they're included as part of an itinerary engagement. For groups of eight or more, we offer a golf-only planning tier ($600 flat) that covers tee-time blocks, course pairings, and dinner reservations without the full villa-and-itinerary buildout.",
      },
    ],
  },
  {
    slug: 'family',
    title: 'Family Travel',
    description: 'Kids, beaches, multi-generation trips, and what to skip.',
    items: [
      {
        question: 'Is Hilton Head good for families with young kids?',
        answer:
          "Very. The beaches are firm-packed and walkable for strollers, the surf is gentle, the bike paths are flat, and most rental villas come with cribs and high chairs on request. Sea Pines, Palmetto Dunes, and Sonesta have dedicated kid programs. Coligny Plaza is the walkable family hub.",
      },
      {
        question: 'What is the best beach on Hilton Head for families?',
        answer:
          "Coligny Beach Park for amenities (lifeguards, restrooms, showers, snack bar), Driessen Beach Park for a quieter walk-in entry, and Sea Pines beaches if you're staying inside the gate. Avoid the Folly Field stretch at high tide — the slope is steep there.",
      },
      {
        question: 'Are there things to do on Hilton Head when it rains?',
        answer:
          "Yes. The Coastal Discovery Museum at Honey Horn, the Sandbox Children's Museum in Coligny, the Jazz Corner for an early dinner-and-music afternoon, mini-golf at Pirate's Island, and indoor pools at Sonesta and Palmetto Dunes. Most families plan one rainy-day backup; the island gets pop-up afternoon storms June through August.",
      },
    ],
  },
  {
    slug: 'comparisons',
    title: 'Hilton Head vs. Other Destinations',
    description: 'How HHI stacks up against the destinations people compare it to.',
    items: [
      {
        question: 'Hilton Head vs. Kiawah Island — which is better?',
        answer:
          "Kiawah for golf-purist trips and quieter, more remote feel — one resort dominates the island and the dining scene is mostly within the Sanctuary. Hilton Head for variety: 24 golf courses, a real downtown feel in Coligny and Harbour Town, and dozens of independent restaurants. Couples often pick Kiawah; families and groups usually prefer Hilton Head.",
      },
      {
        question: 'Hilton Head vs. Myrtle Beach — which should I visit?',
        answer:
          "Myrtle Beach for a louder, cheaper, boardwalk-and-mini-golf vacation with high-volume oceanfront hotels. Hilton Head for a quieter, more polished beach-week with bike paths, gated communities, and zero neon. Different products at different price points — Myrtle Beach averages ~40% cheaper, Hilton Head delivers a different experience.",
      },
      {
        question: 'Hilton Head vs. Charleston — can I do both?',
        answer:
          "Yes, easily. Charleston is 90 minutes north and pairs well as a 2-night add-on to a Hilton Head week. Best move: arrive Charleston, two nights downtown, drive south Saturday morning, six or seven nights on Hilton Head. Reverse the order if you want to end on the city. We plan combo trips frequently.",
      },
    ],
  },
  {
    slug: 'logistics',
    title: 'Getting There & Around',
    description: 'Flights, drives, rental cars, and on-island transit.',
    items: [
      {
        question: 'What is the closest airport to Hilton Head Island?',
        answer:
          "Hilton Head Airport (HHH) is on the island, served by American Airlines from Charlotte and DFW seasonally. Most travelers fly into Savannah/Hilton Head International (SAV), 45 minutes south, for broader airline coverage. Charleston (CHS) is two hours north and works for combo trips. Atlanta (ATL) is four hours west and is a backup hub for international arrivals.",
      },
      {
        question: 'Do I need a rental car on Hilton Head?',
        answer:
          "For most trips, yes. The island is 12 miles long and most restaurants, beaches, and golf courses aren't walkable from any single lodging. Inside Sea Pines or Palmetto Dunes, bikes plus the resort shuttle handle 70% of in-community moves. For a couple staying at a resort with on-property dining, you can skip the rental car and rely on rideshare for off-property dinners.",
      },
      {
        question: 'How long is the drive from Atlanta to Hilton Head?',
        answer:
          "Four hours, fifteen minutes without traffic — I-285 to I-20 to I-95 south, exit 8 onto US-278 east. Friday afternoon summer traffic can push that to five and a half. The cleanest departure window is Friday before 8am or after 8pm.",
      },
      {
        question: 'Is there public transit on Hilton Head Island?',
        answer:
          "Limited. The Lowcountry Regional Transportation Authority runs a basic bus route, mostly used by service workers. For visitors, plan around rental car, rideshare (Uber and Lyft are reliable), bike rental inside gated communities, and the free Sea Pines Resort shuttle.",
      },
    ],
  },
  {
    slug: 'about',
    title: 'About the Service',
    description: 'How Hilton Ahead works, who runs it, and what to expect.',
    items: [
      {
        question: 'Who runs Hilton Ahead Travel Co.?',
        answer:
          "William Griffith, a Hilton Head Island full-time resident and the founder. Every trip is planned by William personally — there is no franchise, no call center, no white-label backend. The bottleneck is intentional: it's the only way the local read stays honest.",
      },
      {
        question: 'Where is Hilton Ahead based?',
        answer:
          "On Hilton Head Island, South Carolina. We don't operate a public storefront — clients meet us by phone, video, or in person at a coffee spot during the discovery call.",
      },
      {
        question: 'Is Hilton Ahead an Airbnb or a booking site?',
        answer:
          "No. Hilton Ahead is a travel consulting service. We don't list rentals or charge per booking. We work alongside Airbnb, Vrbo, direct villa companies, and resort booking systems to assemble the trip that fits you, then we use our partner network where it produces a better rate or better property than the public listings.",
      },
      {
        question: 'Do you handle international or non-Hilton-Head trips?',
        answer:
          "No. We are intentionally local-only — Hilton Head, Bluffton, Daufuskie, and the immediate Lowcountry. The whole reason this works is depth in one place. For multi-destination US trips outside the Lowcountry or international travel, we'll happily refer you to specialists we trust.",
      },
    ],
  },
];

/** Flat list — useful for FAQPage schema and full-page renders. */
export const faqAll: ReadonlyArray<FaqItem> = faqClusters.flatMap(
  (c) => c.items as readonly FaqItem[],
);
