/**
 * Photo references — Hilton Head Island & coastal Lowcountry.
 * Unsplash CDN URLs used at build time; swap to local /public shoots
 * once available. All hosts allowed via next.config.ts remotePatterns.
 *
 * Naming groups:
 *   .hero, .lighthouse, .mossOak, .marsh, …  — single-use primary shots
 *   .moods                                    — mood board / look-book rail
 *   .gallery                                  — homepage polaroid wall
 *   .neighborhoods                            — per-neighborhood plates
 */

const unsplash = (id: string, w = 1800, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

// ——— Primary plates ———————————————————————————————————————————————
const hero        = { src: unsplash('1507525428034-b723cf961d3e', 2200, 82), alt: 'Golden hour over Hilton Head dunes and sea oats' };
const lighthouse  = { src: unsplash('1613977257363-707ba9348227', 1800, 80), alt: 'Red-and-white lighthouse at dusk, Harbour Town' };
const mossOak     = { src: unsplash('1533104816931-20fa691ff6ca', 1800, 80), alt: 'Spanish moss draped from a Lowcountry live oak' };
const marsh       = { src: unsplash('1506260408121-e353d10b87c7', 1800, 80), alt: 'Coastal grass rolling toward the horizon at dusk' };
const boardwalk   = { src: unsplash('1506929562872-bb421503ef21', 1800, 80), alt: 'Wooden boardwalk through coastal sea oats' };
const dock        = { src: unsplash('1507133750040-4a8f57021571', 1800, 80), alt: 'Weathered dock reaching into Lowcountry water' };
const villa       = { src: unsplash('1564501049412-61c2a3083791', 1800, 80), alt: 'Southern coastal cottage with a wraparound porch' };
const beachMorning= { src: unsplash('1519046904884-53103b34b206', 1800, 80), alt: 'Lone sailboat anchored off a quiet Atlantic beach' };

// ——— Additional island shots for collages, polaroid walls, rails ———
const palms       = { src: unsplash('1552733407-5d5c46c3bb3b', 1600, 80), alt: 'Palm trees against a warm coastal sky' };
const oysters     = { src: unsplash('1559827260-dc66d52bef19', 1600, 80), alt: 'Fresh-shucked oysters with lemon' };
const harborBoats = { src: unsplash('1502784444187-359ac186c5bb', 1600, 80), alt: 'Sailboats anchored off a Lowcountry sandbar' };
const beachAerial = { src: unsplash('1540541338287-41700207dee6', 1600, 80), alt: 'Oceanfront pool overlooking the Atlantic' };
const bikePath    = { src: unsplash('1506929562872-bb421503ef21', 1600, 80), alt: 'Wooden path winding through coastal pines' };
const surfSoft    = { src: unsplash('1507525428034-b723cf961d3e', 1600, 80), alt: 'Soft surf at golden hour' };
const coastalOak  = { src: unsplash('1523712999610-f77fbcfc3843', 1600, 80), alt: 'Sunlight filtering through a tall tree canopy' };
const sundown     = { src: unsplash('1507525428034-b723cf961d3e', 1600, 80), alt: 'Atlantic horizon at sundown' };
const teaTable    = { src: unsplash('1551024601-bec78aea704b', 1400, 80), alt: 'A dinner table set near the water' };
const hammock     = { src: unsplash('1528127269322-539801943592', 1400, 80), alt: 'Hammock slung between two palms' };

export const photos = {
  // ——— Primary plates (preserves existing imports) ———
  hero,
  lighthouse,
  mossOak,
  marsh,
  boardwalk,
  dock,
  villa,
  beachMorning,

  // Legacy aliases
  cta: marsh,
  insiderProof: boardwalk,

  // ——— Supporting shots ———
  palms,
  oysters,
  harborBoats,
  beachAerial,
  bikePath,
  surfSoft,
  coastalOak,
  sundown,
  teaTable,
  hammock,

  // ——— Curated sets for specific layouts ———
  /** Layered hero collage — 3 overlapping plates (featured, left-top, right-bottom) */
  heroCollage: [
    { ...hero,       caption: 'Forest Beach, dusk',      label: '01' },
    { ...lighthouse, caption: 'Harbour Town, marina',    label: '02' },
    { ...mossOak,    caption: 'Sea Pines, golden hour',  label: '03' },
  ],

  /** Look-book photo rail — 6 island moods */
  moods: [
    { ...harborBoats, caption: 'Low tide, Broad Creek' },
    { ...mossOak,     caption: 'Spanish moss, 6 p.m.' },
    { ...oysters,     caption: 'Hudson\u2019s, Tuesday' },
    { ...bikePath,    caption: 'Sea Pines, forest path' },
    { ...palms,       caption: 'South Beach, August' },
    { ...hammock,     caption: 'Between rounds' },
  ],

  /** Polaroid wall — 4 tilted shots on WhyIsland section */
  polaroidWall: [
    { ...lighthouse, caption: 'Harbour Town · \u201996' },
    { ...boardwalk,  caption: 'Coligny · 7:04 a.m.'    },
    { ...dock,       caption: 'Mackay Creek, low tide' },
    { ...marsh,      caption: 'Broad Creek · August'   },
  ],

  /** Neighborhood plates — 6 images matched to insider-proof list */
  neighborhoods: [
    { ...lighthouse,  label: 'Sea Pines',       caption: 'Harbour Town, 6:30 pm' },
    { ...bikePath,    label: 'Palmetto Dunes',  caption: '11 miles of lagoon'    },
    { ...boardwalk,   label: 'Forest Beach',    caption: 'Coligny, walking distance' },
    { ...harborBoats, label: 'Shelter Cove',    caption: 'Marina, after work'    },
    { ...coastalOak,  label: 'Port Royal',      caption: 'Tucked-away oaks'      },
    { ...villa,       label: 'Mid-Island',      caption: 'Best value, easy access' },
  ],
} as const;
