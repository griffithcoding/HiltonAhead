/**
 * Activity catalog for the Hilton Head Itinerary Builder.
 *
 * The moat: real HHI things-to-do with the local sequencing logic an OTA
 * lacks — time-of-day fit, neighborhood clustering (so a day doesn't
 * crisscross a 12-mile island), and which activities belong to which kind of
 * trip. Costs are 2026-realistic per-person estimates. Keep every entry true.
 */

export type Slot = 'morning' | 'afternoon' | 'evening';
export type Category =
  | 'beach'
  | 'golf'
  | 'dining'
  | 'water'
  | 'family'
  | 'nature'
  | 'shopping'
  | 'relax';
export type TripType = 'family' | 'couples' | 'golf' | 'beach';

export interface Activity {
  id: string;
  title: string;
  category: Category;
  /** For clustering days by area. */
  neighborhood: string;
  /** Preferred slot, or 'any'. */
  slot: Slot | 'any';
  durationHours: number;
  /** Per-person USD. 0 = free. */
  costPerPerson: number;
  /** One-line local-voice description. */
  blurb: string;
  tripTypes: TripType[];
  affiliate?: { programId: 'viator' | 'getyourguide'; deeplink?: string };
}

export const TRIP_TYPES: { id: TripType; label: string; blurb: string }[] = [
  { id: 'family', label: 'Family', blurb: 'Beach, dolphins, mini-golf, and easy dinners with kids.' },
  { id: 'couples', label: 'Couples', blurb: 'Sunset sails, quiet beaches, Harbour Town dinners.' },
  { id: 'golf', label: 'Golf', blurb: 'Tee times sequenced around the tide, dinners that book up.' },
  { id: 'beach', label: 'Beach & Chill', blurb: 'Sand, bikes, marsh sunsets — minimal agenda.' },
];

export const ACTIVITIES: Activity[] = [
  // ── Beach (free) ──
  { id: 'coligny-beach', title: 'Morning at Coligny Beach', category: 'beach', neighborhood: 'South Forest Beach', slot: 'morning', durationHours: 3, costPerPerson: 0, blurb: 'The main beach — get there before the lot fills and the wind picks up.', tripTypes: ['family', 'beach', 'couples'] },
  { id: 'burkes-shelling', title: 'Low-tide shelling at Burkes Beach', category: 'beach', neighborhood: 'Mid-island', slot: 'morning', durationHours: 2, costPerPerson: 0, blurb: 'Quiet flats at low tide — shells, shark teeth, no crowd.', tripTypes: ['family', 'beach', 'couples'] },
  { id: 'bike-the-beach', title: 'Bike the hard-packed sand', category: 'beach', neighborhood: 'Sea Pines', slot: 'morning', durationHours: 2, costPerPerson: 12, blurb: 'Low tide turns the beach into a flat cruiser highway. Rent at the resort.', tripTypes: ['family', 'beach', 'couples'] },
  { id: 'alder-lane-swim', title: 'Swim + relax at Alder Lane', category: 'beach', neighborhood: 'South Forest Beach', slot: 'afternoon', durationHours: 3, costPerPerson: 0, blurb: 'A quieter swimming beach a few blocks south of Coligny.', tripTypes: ['beach', 'couples', 'family'] },

  // ── Golf ──
  { id: 'harbour-town-golf', title: 'Round at Harbour Town Golf Links', category: 'golf', neighborhood: 'Sea Pines', slot: 'morning', durationHours: 5, costPerPerson: 350, blurb: 'The RBC Heritage course under the lighthouse. Book months ahead.', tripTypes: ['golf', 'couples'] },
  { id: 'atlantic-dunes-golf', title: 'Round at Atlantic Dunes', category: 'golf', neighborhood: 'Sea Pines', slot: 'morning', durationHours: 5, costPerPerson: 220, blurb: 'The Davis Love redesign — walkable, gorgeous, a notch under Harbour Town.', tripTypes: ['golf'] },
  { id: 'palmetto-dunes-golf', title: 'Round at Palmetto Dunes (Jones course)', category: 'golf', neighborhood: 'Palmetto Dunes', slot: 'morning', durationHours: 5, costPerPerson: 180, blurb: 'The oceanfront hole everyone photographs. Great resort conditions.', tripTypes: ['golf', 'family'] },

  // ── Water ──
  { id: 'dolphin-cruise', title: 'Dolphin & nature cruise', category: 'water', neighborhood: 'Shelter Cove', slot: 'afternoon', durationHours: 2, costPerPerson: 45, blurb: 'Bottlenose dolphins work the sound year-round — the reliable sighting.', tripTypes: ['family', 'couples', 'beach'], affiliate: { programId: 'viator' } },
  { id: 'kayak-marsh', title: 'Kayak or SUP the marsh creeks', category: 'water', neighborhood: 'Broad Creek', slot: 'morning', durationHours: 2.5, costPerPerson: 55, blurb: 'Calmer than the ocean and where the dolphins feed at higher water.', tripTypes: ['couples', 'family', 'beach'], affiliate: { programId: 'getyourguide' } },
  { id: 'fishing-charter', title: 'Inshore fishing charter', category: 'water', neighborhood: 'Shelter Cove', slot: 'morning', durationHours: 4, costPerPerson: 150, blurb: 'Redfish and trout in the creeks — a half-day for the whole crew.', tripTypes: ['family', 'golf'], affiliate: { programId: 'viator' } },
  { id: 'sunset-sail', title: 'Sunset sail on Calibogue Sound', category: 'water', neighborhood: 'Sea Pines', slot: 'evening', durationHours: 2, costPerPerson: 60, blurb: 'Last light over the sound with a drink in hand. The couples pick.', tripTypes: ['couples'], affiliate: { programId: 'viator' } },

  // ── Dining (evening) ──
  { id: 'skull-creek-dinner', title: 'Dinner + sunset at Skull Creek', category: 'dining', neighborhood: 'Hilton Head Plantation', slot: 'evening', durationHours: 2, costPerPerson: 55, blurb: 'The west-facing deck that catches the last ten minutes of light.', tripTypes: ['couples', 'family', 'beach'] },
  { id: 'harbour-town-dinner', title: 'Dinner at Harbour Town', category: 'dining', neighborhood: 'Sea Pines', slot: 'evening', durationHours: 2, costPerPerson: 50, blurb: 'Marina-side tables, the lighthouse, kids climbing it after.', tripTypes: ['family', 'couples', 'golf'] },
  { id: 'bluffton-dinner', title: 'Dinner in Old Town Bluffton', category: 'dining', neighborhood: 'Bluffton', slot: 'evening', durationHours: 2.5, costPerPerson: 50, blurb: 'The Lowcountry-foodie night — oysters and the May River.', tripTypes: ['couples', 'golf'] },
  { id: 'coligny-casual-dinner', title: 'Casual dinner near Coligny', category: 'dining', neighborhood: 'South Forest Beach', slot: 'evening', durationHours: 1.5, costPerPerson: 30, blurb: 'Walk-from-the-beach shrimp baskets and ice cream after.', tripTypes: ['family', 'beach'] },

  // ── Family ──
  { id: 'lawton-stables', title: 'Lawton Stables + Forest Preserve', category: 'family', neighborhood: 'Sea Pines', slot: 'morning', durationHours: 2, costPerPerson: 25, blurb: 'Pony rides and the gator-spotting trail through the preserve.', tripTypes: ['family'] },
  { id: 'sandbox-museum', title: "The Sandbox Children's Museum", category: 'family', neighborhood: 'Mid-island', slot: 'afternoon', durationHours: 2, costPerPerson: 12, blurb: 'The rainy-afternoon / too-hot save for under-10s.', tripTypes: ['family'] },
  { id: 'mini-golf', title: 'Pirate-themed mini golf', category: 'family', neighborhood: 'Mid-island', slot: 'evening', durationHours: 1.5, costPerPerson: 14, blurb: 'Waterfalls and a post-dinner round the kids will demand nightly.', tripTypes: ['family'] },
  { id: 'broad-creek-zip', title: 'Ziplining at Broad Creek', category: 'family', neighborhood: 'Broad Creek', slot: 'afternoon', durationHours: 2.5, costPerPerson: 60, blurb: 'Aerial adventure over the marsh — the tween crowd-pleaser.', tripTypes: ['family'] },

  // ── Nature (free / low) ──
  { id: 'pinckney-island', title: 'Bike or walk Pinckney Island', category: 'nature', neighborhood: 'Off-island (US-278)', slot: 'morning', durationHours: 2.5, costPerPerson: 0, blurb: 'A national wildlife refuge of rookeries and gators — free, quiet.', tripTypes: ['couples', 'beach', 'family'] },
  { id: 'coastal-discovery', title: 'Coastal Discovery Museum + Honey Horn', category: 'nature', neighborhood: 'Mid-island', slot: 'afternoon', durationHours: 1.5, costPerPerson: 0, blurb: 'Marsh boardwalks, the big live oak, and Gullah history. Free.', tripTypes: ['family', 'couples', 'beach'] },
  { id: 'forest-preserve-walk', title: 'Sea Pines Forest Preserve loop', category: 'nature', neighborhood: 'Sea Pines', slot: 'morning', durationHours: 1.5, costPerPerson: 0, blurb: 'Quiet trails and a Native American shell ring. Easy and free.', tripTypes: ['couples', 'beach'] },

  // ── Shopping / town ──
  { id: 'harbour-town-shops', title: 'Harbour Town shops + climb the lighthouse', category: 'shopping', neighborhood: 'Sea Pines', slot: 'afternoon', durationHours: 2, costPerPerson: 10, blurb: 'Wander the marina, climb the candy-stripe lighthouse for the view.', tripTypes: ['family', 'couples'] },
  { id: 'tanger-outlets', title: 'Tanger Outlets (Bluffton)', category: 'shopping', neighborhood: 'Bluffton', slot: 'afternoon', durationHours: 2, costPerPerson: 0, blurb: 'The rainy-day / too-hot retail option on the way off-island.', tripTypes: ['family', 'beach'] },
  { id: 'coligny-plaza', title: 'Coligny Plaza browse + ice cream', category: 'shopping', neighborhood: 'South Forest Beach', slot: 'afternoon', durationHours: 1, costPerPerson: 8, blurb: 'Beach shops and the classic post-sand ice cream stop.', tripTypes: ['family', 'beach'] },

  // ── Relax ──
  { id: 'spa-afternoon', title: 'Resort spa afternoon', category: 'relax', neighborhood: 'Palmetto Dunes', slot: 'afternoon', durationHours: 2, costPerPerson: 160, blurb: 'The reset-button afternoon — couples massage or a quiet facial.', tripTypes: ['couples'] },
  { id: 'marsh-golden-hour', title: 'Golden hour over the marsh', category: 'relax', neighborhood: 'Hilton Head Plantation', slot: 'evening', durationHours: 1, costPerPerson: 0, blurb: 'Skull Creek and the west-facing docks at last light. Free, unbeatable.', tripTypes: ['couples', 'beach', 'family'] },
];

/**
 * Per-trip-type ordered slot pools the generator draws from. Listing an
 * activity earlier = higher priority for that trip type. The generator fills
 * each day's morning/afternoon/evening, clustering by neighborhood and never
 * repeating an activity until the pool is exhausted.
 */
export const SLOT_ORDER: Record<TripType, Record<Slot, string[]>> = {
  family: {
    morning: ['coligny-beach', 'lawton-stables', 'burkes-shelling', 'kayak-marsh', 'fishing-charter', 'pinckney-island', 'palmetto-dunes-golf'],
    afternoon: ['dolphin-cruise', 'sandbox-museum', 'broad-creek-zip', 'harbour-town-shops', 'coastal-discovery', 'alder-lane-swim', 'tanger-outlets', 'coligny-plaza'],
    evening: ['harbour-town-dinner', 'mini-golf', 'skull-creek-dinner', 'coligny-casual-dinner', 'marsh-golden-hour'],
  },
  couples: {
    morning: ['burkes-shelling', 'bike-the-beach', 'kayak-marsh', 'pinckney-island', 'forest-preserve-walk', 'coligny-beach', 'harbour-town-golf'],
    afternoon: ['spa-afternoon', 'dolphin-cruise', 'harbour-town-shops', 'coastal-discovery', 'alder-lane-swim'],
    evening: ['sunset-sail', 'skull-creek-dinner', 'bluffton-dinner', 'harbour-town-dinner', 'marsh-golden-hour'],
  },
  golf: {
    morning: ['harbour-town-golf', 'atlantic-dunes-golf', 'palmetto-dunes-golf', 'fishing-charter', 'burkes-shelling'],
    afternoon: ['alder-lane-swim', 'harbour-town-shops', 'dolphin-cruise', 'coastal-discovery'],
    evening: ['bluffton-dinner', 'harbour-town-dinner', 'skull-creek-dinner', 'marsh-golden-hour'],
  },
  beach: {
    morning: ['coligny-beach', 'burkes-shelling', 'bike-the-beach', 'pinckney-island', 'kayak-marsh', 'forest-preserve-walk'],
    afternoon: ['alder-lane-swim', 'dolphin-cruise', 'coastal-discovery', 'coligny-plaza', 'tanger-outlets'],
    evening: ['marsh-golden-hour', 'skull-creek-dinner', 'coligny-casual-dinner', 'harbour-town-dinner'],
  },
};

export const ACTIVITY_BY_ID: Record<string, Activity> = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
);
