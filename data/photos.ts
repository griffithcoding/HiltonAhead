/**
 * Photo references — Hilton Head Island & Lowcountry imagery.
 * Unsplash URLs used at build time; swap to local /public shoots once
 * available. All URLs allowed via next.config.ts remotePatterns.
 */

const unsplash = (id: string, w = 1800, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const photos = {
  /** Cinematic full-bleed hero — beach dunes with sea oats at golden hour. */
  hero: {
    src: unsplash('1507525428034-b723cf961d3e', 2200, 82),
    alt: 'Golden hour over Hilton Head Island dunes and sea oats',
  },
  /** Harbour Town-ish coastal lighthouse scene, editorial treatment. */
  lighthouse: {
    src: unsplash('1613977257363-707ba9348227', 1600, 80),
    alt: 'Red and white lighthouse at dusk, Harbour Town',
  },
  /** Live oaks with Spanish moss — the unmistakable Lowcountry image. */
  mossOak: {
    src: unsplash('1533104816931-20fa691ff6ca', 1600, 80),
    alt: 'Spanish moss draped from a Lowcountry live oak',
  },
  /** Marsh grass + creek at dusk. */
  marsh: {
    src: unsplash('1566024146175-59d85ca6c7a4', 1600, 80),
    alt: 'Tidal marsh grass glowing at sunset',
  },
  /** Wooden boardwalk through dunes. */
  boardwalk: {
    src: unsplash('1506929562872-bb421503ef21', 1600, 80),
    alt: 'Wooden boardwalk through coastal sea oats',
  },
  /** Dock reaching into calm creek water. */
  dock: {
    src: unsplash('1507133750040-4a8f57021571', 1600, 80),
    alt: 'Weathered dock reaching into Lowcountry water',
  },
  /** Villa / coastal cottage exterior — southern architecture. */
  villa: {
    src: unsplash('1564501049412-61c2a3083791', 1600, 80),
    alt: 'Southern coastal cottage with wraparound porch',
  },
  /** Quiet beach morning. */
  beachMorning: {
    src: unsplash('1502208898353-2d1ad6706e63', 1600, 80),
    alt: 'Quiet beach at sunrise',
  },
  /** Existing compat alias — CTA band still references photos.cta in some pages. */
  cta: {
    src: unsplash('1566024146175-59d85ca6c7a4', 2000, 78),
    alt: 'Lowcountry marsh at sunset',
  },
  /** Existing compat alias. */
  insiderProof: {
    src: unsplash('1506929562872-bb421503ef21', 1600, 78),
    alt: 'Wooden boardwalk through sea oats',
  },
} as const;
