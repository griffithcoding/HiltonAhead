/**
 * Photo references — Hilton Head Island & coastal Lowcountry.
 *
 * Unsplash CDN URLs used at build time; swap to local /public shoots
 * once available. All hosts allowed via next.config.ts remotePatterns.
 *
 * Photos labeled "[HH]" are confirmed Hilton Head Island shots:
 *   - Camylla Battani — boats at Harbour Town
 *   - Nikhil Mistry — Harbour Town Lighthouse, sunset pier
 *   - Nikolay Loubet — Harbour Town marina, lighthouse + dock
 *   - Ken Bitar — Harbour Town shops + lighthouse
 *   - Jake Johnson — Sea Pines / dockside cottages
 * All used under the Unsplash License.
 *
 * Naming groups:
 *   .hero, .lighthouse, .mossOak, .marsh, …  — single-use primary shots
 *   .moods                                    — mood board / look-book rail
 *   .gallery                                  — homepage polaroid wall
 *   .neighborhoods                            — per-neighborhood plates
 */

const unsplash = (id: string, w = 1800, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

// Pexels CDN (already in next.config.ts remotePatterns)
const pexels = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

// ——— Primary plates ———————————————————————————————————————————————
const hero        = { src: unsplash('1507525428034-b723cf961d3e', 2200, 82), alt: 'Golden hour over Hilton Head dunes and sea oats' };
// [HH] Harbour Town Lighthouse — Nikhil Mistry
const lighthouse  = { src: unsplash('1633647251095-fe1fec4e4c50', 1800, 80), alt: 'Harbour Town Lighthouse, Sea Pines — Hilton Head Island' };
const mossOak     = { src: unsplash('1533104816931-20fa691ff6ca', 1800, 80), alt: 'Spanish moss draped from a Lowcountry live oak' };
const marsh       = { src: unsplash('1506260408121-e353d10b87c7', 1800, 80), alt: 'Coastal grass rolling toward the horizon at dusk' };
const boardwalk   = { src: unsplash('1506929562872-bb421503ef21', 1800, 80), alt: 'Wooden boardwalk through coastal sea oats' };
// [HH] Harbour Town marina dock with boats and lighthouse — Nikolay Loubet
const dock        = { src: unsplash('1631845085760-638f42d1b2e9', 1800, 80), alt: 'Harbour Town marina dock at twilight, Hilton Head Island' };
// [HH] Sea Pines cottage on the marsh — Jake Johnson
const villa       = { src: unsplash('1628214457196-676766da086e', 1800, 80), alt: 'Lowcountry cottage on the marsh, Hilton Head Island' };
const beachMorning= { src: unsplash('1519046904884-53103b34b206', 1800, 80), alt: 'Lone sailboat anchored off a quiet Atlantic beach' };

// ——— Additional island shots for collages, polaroid walls, rails ———
const palms       = { src: unsplash('1552733407-5d5c46c3bb3b', 1600, 80), alt: 'Palm trees against a warm coastal sky' };
const oysters     = { src: unsplash('1559827260-dc66d52bef19', 1600, 80), alt: 'Fresh-shucked oysters with lemon' };
// [HH] Sailboats at Harbour Town marina — Camylla Battani
const harborBoats = { src: unsplash('1539112416716-92d1f870a487', 1600, 80), alt: 'Sailboats at Harbour Town marina, Sea Pines — Hilton Head' };
const beachAerial = { src: unsplash('1540541338287-41700207dee6', 1600, 80), alt: 'Oceanfront pool overlooking the Atlantic' };
// [HH] Harbour Town shops and lighthouse from the marina — Ken Bitar
const bikePath    = { src: unsplash('1748821454217-37110c80ac11', 1600, 80), alt: 'Harbour Town shops below the lighthouse, Hilton Head' };
// [HH] Sunset on a Hilton Head pier — Nikhil Mistry
const surfSoft    = { src: unsplash('1634948601598-dfe5fa67a48c', 1600, 80), alt: 'Sunset on a Hilton Head pier' };
const coastalOak  = { src: unsplash('1523712999610-f77fbcfc3843', 1600, 80), alt: 'Sunlight filtering through a tall tree canopy' };
// [HH] Harbour Town Lighthouse and dock at golden hour — Nikolay Loubet
const sundown     = { src: unsplash('1631845085830-10c38cc98ac8', 1600, 80), alt: 'Harbour Town Lighthouse and dock at golden hour, Hilton Head' };
const teaTable    = { src: unsplash('1551024601-bec78aea704b', 1400, 80), alt: 'A dinner table set near the water' };
// [HH] Coastal cottage on the docks — Jake Johnson
const hammock     = { src: unsplash('1628214458185-a49d4fc577f3', 1400, 80), alt: 'Coastal cottage on the docks, Hilton Head Island' };
const mealPlate      = { src: unsplash('1565299624946-b28f40a0ae38', 1400, 80), alt: 'Plated Lowcountry dish at a Hilton Head waterfront restaurant' };
// [HH] Confirmed Hilton Head Island marina — Curt Hubner / Pexels
const shelterCoveMarina = { src: pexels(12900135), alt: 'Sailboats and motorboats docked at Shelter Cove Harbour marina, Hilton Head Island' };

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
  mealPlate,
  shelterCoveMarina,

  // ——— Curated sets for specific layouts ———
  /** Layered hero collage — 3 overlapping plates (featured, left-top, right-bottom) */
  heroCollage: [
    { ...hero,        caption: 'Forest Beach, dusk',     label: '01' },
    { ...lighthouse,  caption: 'Harbour Town, marina',   label: '02' },
    { ...harborBoats, caption: 'Shelter Cove, marina',   label: '03' },
  ],

  /** Look-book photo rail — 7 island moods */
  moods: [
    { ...harborBoats, caption: 'Harbour Town, low tide' },
    { ...mossOak,     caption: 'Spanish moss, 6 p.m.' },
    { ...oysters,     caption: 'Hudson’s, Tuesday' },
    { ...mealPlate,   caption: 'Skull Creek · 7 p.m.' },
    { ...bikePath,    caption: 'Harbour Town shops' },
    { ...palms,       caption: 'South Beach, August' },
    { ...hammock,     caption: 'Sea Pines, dockside' },
  ],

  /** Polaroid wall — 4 tilted shots on WhyIsland section */
  polaroidWall: [
    { ...lighthouse, caption: 'Harbour Town · ’96' },
    { ...boardwalk,  caption: 'Coligny · 7:04 a.m.'    },
    { ...dock,       caption: 'Harbour Town, low tide' },
    { ...shelterCoveMarina, caption: 'Shelter Cove · marina' },
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
