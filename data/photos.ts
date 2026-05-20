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

// ——— Primary plates ———————————————————————————————————————————————
const hero        = { src: unsplash('1507525428034-b723cf961d3e', 2200, 82), alt: 'Golden hour over Hilton Head dunes and sea oats' };
// [HH] Harbour Town Lighthouse — Nikhil Mistry
const lighthouse  = { src: unsplash('1633647251095-fe1fec4e4c50', 1800, 80), alt: 'Harbour Town Lighthouse, Sea Pines — Hilton Head Island' };
// Spanish moss draped from a Southern live oak — Connor McManus (Unsplash). Replaces a CDN-rotated ID that began returning a Santorini village.
const mossOak     = { src: unsplash('1769714638235-ce4a94d2e26f', 1800, 80), alt: 'Spanish moss draped from a Lowcountry live oak' };
// Salt marsh with spartina grass and tidal pools at golden hour — JD Doyle (Unsplash). Replaces a CDN-rotated ID that began returning rolling green hills.
const marsh       = { src: unsplash('1584066984932-73be0879c0c1', 1800, 80), alt: 'Spartina grass and tidal pools across a salt marsh at golden hour' };
const boardwalk   = { src: unsplash('1506929562872-bb421503ef21', 1800, 80), alt: 'Wooden boardwalk through coastal sea oats' };
// [HH] Harbour Town marina dock with boats and lighthouse — Nikolay Loubet
const dock        = { src: unsplash('1631845085760-638f42d1b2e9', 1800, 80), alt: 'Harbour Town marina dock at twilight, Hilton Head Island' };
// [HH] Sea Pines cottage on the marsh — Jake Johnson
const villa       = { src: unsplash('1628214457196-676766da086e', 1800, 80), alt: 'Lowcountry cottage on the marsh, Hilton Head Island' };
const beachMorning= { src: unsplash('1519046904884-53103b34b206', 1800, 80), alt: 'Lone sailboat anchored off a quiet Atlantic beach' };

// ——— Additional island shots for collages, polaroid walls, rails ———
const palms       = { src: unsplash('1552733407-5d5c46c3bb3b', 1600, 80), alt: 'Palm trees against a warm coastal sky' };
// Plate of fresh oysters on the half shell — Nihar Reddy Jangam (Unsplash). Replaces a CDN-rotated ID that began returning an ocean wave.
const oysters     = { src: unsplash('1769816042382-969141ce4b67', 1600, 80), alt: 'Fresh-shucked oysters on the half shell' };
// [HH] Sailboats at Harbour Town marina — Camylla Battani
const harborBoats = { src: unsplash('1539112416716-92d1f870a487', 1600, 80), alt: 'Sailboats at Harbour Town marina, Sea Pines — Hilton Head' };
const beachAerial = { src: unsplash('1540541338287-41700207dee6', 1600, 80), alt: 'Oceanfront pool overlooking the Atlantic' };
// [HH] Harbour Town shops and lighthouse from the marina — Ken Bitar
const bikePath    = { src: unsplash('1748821454217-37110c80ac11', 1600, 80), alt: 'Harbour Town shops below the lighthouse, Hilton Head' };
// [HH] Sunset on a Hilton Head pier — Nikhil Mistry
const surfSoft    = { src: unsplash('1634948601598-dfe5fa67a48c', 1600, 80), alt: 'Sunset on a Hilton Head pier' };
// Lowcountry tidal creek winding through golden marsh — Brian Urso (Unsplash). Stand-in for Broad Creek imagery until press-kit shoot.
const broadCreek  = { src: unsplash('1760526664194-fc5745a576ec', 1600, 80), alt: 'Tidal creek winding through golden Lowcountry marsh at low tide' };
// KNOWN ISSUE — `coastalOak` and `golfTeeBox` (below) share Unsplash photo
// id `1523712999610-f77fbcfc3843` and therefore render as the SAME image
// despite different alt text. Both render as a sun-through-pines canopy,
// which fits each context loosely but means we can't show both side-by-side
// (e.g., a forest preserve next to a tee-box shot) without obvious dupes.
// TODO: replace one of the two with a press-kit photograph (golfTeeBox is
// the better candidate to swap, since it represents a specific course).
const coastalOak  = { src: unsplash('1523712999610-f77fbcfc3843', 1600, 80), alt: 'Sunlight filtering through a tall tree canopy' };
// [HH] Harbour Town Lighthouse and dock at golden hour — Nikolay Loubet
const sundown     = { src: unsplash('1631845085830-10c38cc98ac8', 1600, 80), alt: 'Harbour Town Lighthouse and dock at golden hour, Hilton Head' };
const teaTable    = { src: unsplash('1551024601-bec78aea704b', 1400, 80), alt: 'A dinner table set near the water' };
// [HH] Coastal cottage on the docks — Jake Johnson
const hammock     = { src: unsplash('1628214458185-a49d4fc577f3', 1400, 80), alt: 'Coastal cottage on the docks, Hilton Head Island' };

// ——— Story-specific scenery (no people) ———
// New shots used by /stories/[slug] chapters and the homepage IslandFlyover.
// Same Unsplash CDN pattern as the rest of the file. Swap for press-kit
// imagery once available.
const golfFairway   = { src: unsplash('1535131749006-b7f58c99034b', 1800, 82), alt: 'Empty Lowcountry golf fairway lined with palmetto trees at sunrise' };
// Wooden tee marker on a dewy fairway at sunrise — replaces a CDN id
// (`1523712999610-f77fbcfc3843`) that was shared with `coastalOak` above
// and caused the two photos to render as the same sun-through-canopy
// shot despite different alt text.
const golfTeeBox    = { src: unsplash('1561251224-be0fb13586f9', 1800, 82), alt: 'Wooden tee marker on a dewy fairway at sunrise, sun filtering through trees on the horizon' };
const ceremonyArbor = { src: unsplash('1519741497674-611481863552', 1800, 82), alt: 'Empty wedding arbor on a coastal lawn at golden hour' };
const setTable      = { src: unsplash('1530103862676-de8c9debad1d', 1800, 82), alt: 'Long banquet table set under string lights with no guests' };
// Aerial of tidal marsh with creek braids cutting through spartina — Mike Erskine (Unsplash). Replaces a CDN-rotated ID that began returning rolling green hills.
const coastalAerial = { src: unsplash('1749670293761-4990fc7f0a1f', 1800, 82), alt: 'Aerial of tidal marsh creeks braiding through spartina grass' };
const lagoonAerial  = { src: unsplash('1571939228382-b2f2b585ce15', 1800, 82), alt: 'Aerial of resort lagoons threaded between palm trees' };
const marinaDawn    = { src: unsplash('1518495973542-4542c06a5843', 1800, 82), alt: 'Marina at dawn, sailboats at rest on glassy water' };
const dunesPath     = { src: unsplash('1506929562872-bb421503ef21', 1800, 82), alt: 'Wooden dune crossover path bending toward the Atlantic' };

// ——— Custom Itineraries food slideshow ———
// TODO: replace with photographs from partner restaurants (Hudson's, Skull Creek,
// Charlie's L'Etoile Verte, etc.) once licensed. Currently curated Unsplash shots
// chosen to read as Lowcountry / coastal-Southern dining.
const customItinerariesFood = [
  { src: unsplash('1769816042382-969141ce4b67', 1400, 82), alt: 'Fresh-shucked oysters on the half shell' },
  { src: unsplash('1565299624946-b28f40a0ae38', 1400, 82), alt: 'Shrimp and grits in a cast-iron skillet' },
  { src: unsplash('1467003909585-2f8a72700288', 1400, 82), alt: 'Seared scallops plated with greens' },
  { src: unsplash('1485921325833-c519f76c4927', 1400, 82), alt: 'Wood-grilled fish with charred lemon' },
  { src: unsplash('1504674900247-0877df9cc836', 1400, 82), alt: 'Plated coastal entrée from a chef-driven kitchen' },
];

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
  broadCreek,
  coastalOak,
  sundown,
  teaTable,
  hammock,
  customItinerariesFood,

  // ——— Story-specific (no people) ———
  golfFairway,
  golfTeeBox,
  ceremonyArbor,
  setTable,
  coastalAerial,
  lagoonAerial,
  marinaDawn,
  dunesPath,

  /** Aerial frames — used by IslandFlyover overlays + story covers. */
  aerials: [
    { ...coastalAerial, caption: 'Calibogue Sound · barrier island' },
    { ...lagoonAerial,  caption: 'Palmetto Dunes · resort lagoons' },
    { ...beachAerial,   caption: 'Atlantic edge · oceanfront' },
    { ...marsh,         caption: 'Broad Creek · low tide' },
    { ...dunesPath,     caption: 'Forest Beach · dune crossover' },
    { ...harborBoats,   caption: 'Skull Creek · sailboats' },
  ],

  /** Story setting shots, organized by the trip-type each story covers. */
  storySettings: {
    golf: [
      { ...golfTeeBox,  caption: 'Harbour Town · first tee' },
      { ...lighthouse,  caption: 'Harbour Town · 18th green' },
      { ...golfFairway, caption: 'Palmetto Dunes · Robert Trent Jones' },
      { ...marinaDawn,  caption: 'Sea Pines · marina at dawn' },
    ],
    wedding: [
      { ...ceremonyArbor, caption: 'Sea Pines · ceremony arbor' },
      { ...setTable,      caption: 'Reception · oyster table' },
      { ...mossOak,       caption: 'Live oak · portrait grove' },
      { ...harborBoats,   caption: 'Shelter Cove · rehearsal dinner' },
    ],
    family: [
      { ...dunesPath,    caption: 'Coligny · boardwalk to sand' },
      { ...bikePath,     caption: 'Sea Pines · kids bike loop' },
      { ...beachMorning, caption: 'Forest Beach · 7 a.m.' },
      { ...lagoonAerial, caption: 'Palmetto Dunes · resort lagoons' },
    ],
  },

  // ——— Curated sets for specific layouts ———
  /** Layered hero collage — 3 overlapping plates (featured, left-top, right-bottom) */
  heroCollage: [
    { ...hero,       caption: 'Forest Beach, dusk',      label: '01' },
    { ...lighthouse, caption: 'Harbour Town, marina',    label: '02' },
    { ...bikePath,   caption: 'Harbour Town · the lighthouse', label: '03' },
  ],

  /** Look-book photo rail — 6 island moods */
  moods: [
    { ...harborBoats, caption: 'Harbour Town, low tide' },
    { ...mossOak,     caption: 'Spanish moss, 6 p.m.' },
    { ...oysters,     caption: 'Hudson’s, Tuesday' },
    { ...bikePath,    caption: 'Harbour Town shops' },
    { ...palms,       caption: 'South Beach, August' },
    { ...hammock,     caption: 'Sea Pines, dockside' },
  ],

  /** Polaroid wall — 4 tilted shots on WhyIsland section */
  polaroidWall: [
    { ...lighthouse, caption: 'Harbour Town · ’96' },
    { ...boardwalk,  caption: 'Coligny · 7:04 a.m.'    },
    { ...dock,       caption: 'Harbour Town, low tide' },
    { ...broadCreek, caption: 'Broad Creek · August'   },
  ],

  /**
   * Neighborhood plates — 6 images matched to insider-proof list.
   *
   * TODO: replace with photographs taken at each named neighborhood
   * (Sea Pines / Palmetto Dunes / Forest Beach / Shelter Cove / Port Royal /
   * Mid-Island) once we have a press kit or partner-property shoots.
   * Current shots are Lowcountry-coastal Unsplash imagery chosen to match
   * each neighborhood's character — only Sea Pines (Harbour Town Lighthouse)
   * is verifiably location-specific.
   */
  neighborhoods: [
    { ...lighthouse,   label: 'Sea Pines',       caption: 'Harbour Town, 6:30 pm' },
    { ...golfFairway,  label: 'Palmetto Dunes',  caption: '11 miles of lagoon'    },
    { ...dunesPath,    label: 'Forest Beach',    caption: 'Coligny, walking distance' },
    { ...marinaDawn,   label: 'Shelter Cove',    caption: 'Marina, after work'    },
    { ...mossOak,      label: 'Port Royal',      caption: 'Tucked-away oaks'      },
    { ...villa,        label: 'Mid-Island',      caption: 'Best value, easy access' },
  ],
} as const;
