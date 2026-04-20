/**
 * Photo references. Hero/CTA use Unsplash Source URLs at build time —
 * swap to local /public images once you have shoots on-island.
 */
export const photos = {
  hero: {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70',
    alt: 'Sunset over the dunes on Hilton Head Island',
  },
  cta: {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60',
    alt: 'Coastline at dusk',
  },
  insiderProof: {
    src: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=60',
    alt: 'Beach boardwalk through sea oats',
  },
} as const;
