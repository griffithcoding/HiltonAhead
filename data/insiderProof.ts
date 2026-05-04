export const insiderProof = {
  eyebrow: 'Local Expertise',
  heading: {
    plain: 'We live here, so you',
    accent: 'get the real island.',
  },
  subheading:
    'Not a call center in another state. Not a booking engine. A person who drove past that villa this morning.',
  stats: [
    { label: 'Years on island', value: '6' },
    { label: 'Trips advised', value: '255+' },
    { label: 'Partner properties', value: '63' },
    { label: 'Avg. client savings vs. retail', value: '11%' },
  ],
  /**
   * `slug` matches an entry in `data/neighborhoods.ts` — every card on the
   * homepage links to `/hilton-head/${slug}` so the photo wall is a real
   * SEO funnel into our neighborhood landing pages, not just decoration.
   */
  localSpots: [
    {
      slug: 'sea-pines',
      neighborhood: 'Sea Pines',
      note: 'Bike paths, Harbour Town, and the best sunsets on the island.',
    },
    {
      slug: 'palmetto-dunes',
      neighborhood: 'Palmetto Dunes',
      note: 'Three golf courses, 11 miles of lagoons, family-first.',
    },
    {
      slug: 'forest-beach',
      neighborhood: 'Forest Beach',
      note: 'Walk to Coligny. Best base for a short trip.',
    },
    {
      slug: 'shelter-cove',
      neighborhood: 'Shelter Cove',
      note: 'Marina views, live music, best for couples.',
    },
    {
      slug: 'port-royal',
      neighborhood: 'Port Royal',
      note: 'Quiet, less touristy, real locals\' pick.',
    },
    {
      slug: 'mid-island',
      neighborhood: 'Mid-Island',
      note: 'Best value rentals, easy access to everything.',
    },
  ],
} as const;
