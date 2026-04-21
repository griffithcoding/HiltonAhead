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
    italic: 'you thought only',
    lineTwo: 'locals knew.',
  },
  /** Classic magazine lede — long-ish, warm, confident. */
  lede:
    "Villa picks. Tee times at Harbour Town. The 7 p.m. table at Skull Creek. The short list of things worth doing and the long list of things worth skipping. We plan Hilton Head the way we'd plan it for family, then hand it to you.",
  primaryCtaLabel: 'Plan my trip',
  secondaryCta: {
    href: '#why-hilton-head',
    label: 'Why Hilton Head',
  },
  /** Three trust signals beneath the lede, tightly kerned and small-caps. */
  proofLine: [
    '12 yrs on-island',
    '400+ trips planned',
    'Partner rates at Sea Pines & Palmetto Dunes',
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
    'Hilton Head is the rare American resort island that kept its trees. No neon, no billboards, no high-rise crush. Just live oaks dripping Spanish moss, a thousand miles of bike path, and a coastline shaped by the Atlantic rather than by developers. The Lowcountry does unhurried better than anywhere else in the South.',
  pillars: [
    {
      title: 'The beach, honestly',
      body:
        "Twelve miles of hard-packed sand you can bike on at low tide. No rocks, no undertow, no condo towers. The Atlantic here is forgiving. Shallow for fifty yards out, warm by mid-May, glassy most mornings.",
    },
    {
      title: 'A table of contents',
      body:
        "Five resort neighborhoods, three championship golf courses in one plantation, two marinas, one iconic lighthouse. Small enough that you'll learn it in a weekend, deep enough that you won't exhaust it in ten years.",
    },
    {
      title: 'The Lowcountry palette',
      body:
        "Moss, marsh, and magnolia. Shrimp off the boat at lunch. Oysters at a dock at sunset. Bourbon on a porch after. There's a reason people who come once tend to come back.",
    },
  ],
} as const;
