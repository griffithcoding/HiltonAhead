/**
 * Content for /southwest-airlines-to-hilton-head.
 *
 * Per CLAUDE.md, page content lives in data/ modules, not inline in JSX.
 *
 * Monetization note: the Southwest affiliate (via Impact / Points.com) pays
 * commission on Rapid Rewards *points purchases*, not on flight bookings —
 * Southwest has no flight-booking affiliate. The page is therefore framed as
 * genuine "how to fly Southwest to Hilton Head" help (the traffic driver) with
 * a single honest Rapid Rewards points callout (the earning element). Keep any
 * factual claims here durable and verifiable — do not list specific seasonal
 * routes that churn.
 */

export const SOUTHWEST_HHI = {
  /** SAV is the practical airport for Hilton Head; HHH is on-island but limited. */
  airportCode: 'SAV',
  airportName: 'Savannah/Hilton Head International Airport',
  /** Southwest began SAV service March 2021 and continues to operate there. */
  serviceSince: 2021,
  driveMinutesToHhi: 45,
  driveMilesToHhi: 32,
} as const;

export const SOUTHWEST_PERKS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'Free bags now depend on your card or status',
    body: "Southwest ended its “bags fly free” policy in May 2025. On most fares the first checked bag is now $45 and the second $55 (fees raised April 2026). Rapid Rewards credit card holders and A-List members still check their first bag free, and A-List Preferred members and Choice Extra fares get two. For a family beach week with chairs and a pack-and-play, the co-branded card can pay for itself on one trip.",
  },
  {
    title: 'No change fees (fare difference applies)',
    body: 'Southwest still charges no change fee on any fare; you only pay a fare difference. The catch is Basic: those fares can only be changed by upgrading them, and Basic travel credits expire after six months. If a hurricane-season forecast or a wedding date could move your plans, book Choice or higher, and pair it with travel insurance for non-refundable lodging.',
  },
  {
    title: 'Nonstop into SAV from major hubs',
    body: "Southwest serves Savannah/Hilton Head International (SAV) nonstop from a rotating set of its hubs. Routes are seasonal — check southwest.com for current nonstops from your home city before defaulting to a connection.",
  },
];

export const SOUTHWEST_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'Does Southwest fly to Hilton Head?',
    answer:
      'Not directly — Hilton Head Island Airport (HHH) is a small regional field. Southwest flies into Savannah/Hilton Head International (SAV), about 45 minutes and 32 miles from the island. SAV is the practical gateway for most Hilton Head trips, and Southwest has served it since 2021.',
  },
  {
    question: 'Which airport should I fly into for Hilton Head — SAV or HHH?',
    answer:
      'For Southwest and for most travelers, fly into Savannah/Hilton Head International (SAV). It has far more nonstop routes and lower fares than the on-island HHH field. The trade-off is a 45-minute drive to the island. HHH only makes sense if you find a convenient direct flight on a regional carrier and prize the shorter transfer.',
  },
  {
    question: 'How do I get from Savannah airport (SAV) to Hilton Head?',
    answer:
      'It is a straightforward 45-minute, ~32-mile drive up US-278. A rental car is the most flexible option — the island is 12 miles long and most beaches, restaurants, and golf courses are not walkable from a single base. Car services and rideshares also run the route if you would rather not drive.',
  },
  {
    question: 'Can I use Rapid Rewards points to fly to Hilton Head?',
    answer:
      "Yes. Southwest award flights to SAV book through Rapid Rewards like any other route, with no blackout dates. Bag fees apply as on paid fares unless your Rapid Rewards card or A-List status covers them. If you're a little short on points for the award you want, you can buy, gift, or transfer Rapid Rewards points to top off your balance.",
  },
  {
    question: 'Is it cheaper to fly or drive to Hilton Head?',
    answer:
      'It depends on origin. From within the Southeast (Atlanta, Charlotte, Raleigh), driving usually wins on cost. From farther out, a Southwest fare into SAV plus a rental car is often competitive once you factor in two free checked bags and no change fees. See our full cost breakdown to model your trip.',
  },
];
