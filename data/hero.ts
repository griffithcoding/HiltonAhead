export const hero = {
  /** Editorial masthead text (date line + dispatch number). */
  masthead: {
    dispatch: 'Dispatch \u2116 12',
    place: 'Hilton Head Island',
    cadence: 'Spring 2026',
  },
  /** Eyebrow shown just above the display headline. */
  eyebrow: 'Travel Consulting · Planned by a Local',
  /** Display headline. `italic` is rendered in an italic serif cut. */
  title: {
    lineOne: 'The Hilton Head',
    italic: 'the locals',
    lineTwo: 'keep to themselves.',
  },
  /** Classic magazine lede — long-ish, warm, confident. */
  lede:
    "The island is twelve miles long and you have seven days. Somewhere in there is the villa with the porch facing the right way, the 7 p.m. table at Skull Creek (the one that was somehow fully booked when you called), and the tee time at Harbour Town that opens up two Tuesdays before your trip if you know to ask. We plan it the way we plan it for family — every reservation, every drive time, every quiet half-hour — and hand it to you.",
  primaryCtaLabel: 'Plan my trip',
  secondaryCta: {
    href: '#why-hilton-head',
    label: 'Why Hilton Head',
  },
  /** Editorial third CTA — small announcement-style link beside the secondary. */
  tertiaryCta: {
    href: '/guides/2027-rbc-heritage',
    eyebrow: 'Free guide',
    label: '2027 RBC Heritage Survival Kit',
  },
  /** Trust signals beneath the lede, tightly kerned and small-caps. */
  proofLine: [
    '255+ trips advised',
    'Locally based, Hilton Head Island',
  ],
} as const;

/**
 * "Why Hilton Head" — the section that sells the island itself.
 * Content intentionally short, editorial, and evocative rather than a list.
 */
export const whyIsland = {
  sectionNumber: '\u2116 01',
  eyebrow: 'The Island',
  title: {
    plain: 'Twelve miles of beach,',
    italic: '400 years of quiet.',
  },
  lede:
    'Hilton Head is the rare American resort island that kept its trees. No neon, no billboards, no high-rise crush — the building code never let one go up. Live oaks dripping Spanish moss, sixty-odd miles of bike path under that canopy, a coastline shaped by the Atlantic rather than by developers. By the second morning your shoulders drop two inches and you stop checking the time. The Lowcountry does unhurried better than anywhere else in the South.',
  pillars: [
    {
      title: 'The beach, honestly',
      body:
        "Twelve miles of hard-packed sand you can bike on at low tide — pedal a mile north of Coligny and you'll have it almost to yourself. No rocks, no undertow, no condo towers. The Atlantic here is forgiving: shallow for fifty yards out, warm by mid-May, glassy by 6:30 a.m. You'll keep going back at sunrise even on the days you swore you'd sleep in.",
    },
    {
      title: 'A table of contents',
      body:
        "Five resort neighborhoods, three championship golf courses in one plantation, two marinas, one iconic lighthouse. Small enough that you'll learn it in a weekend, deep enough that you won't exhaust it in ten years.",
    },
    {
      title: 'The Lowcountry palette',
      body:
        "Moss, marsh, and magnolia. Shrimp off the boat at lunch — if you know which dock. Oysters at sunset, opened in front of you on a slab of pine. Bourbon on a porch after, while the cicadas start. There's a reason the people who come once start checking flights home before the bourbon's finished.",
    },
  ],
} as const;
