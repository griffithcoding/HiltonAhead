/**
 * Hilton Head Itinerary Builder — the generator engine.
 *
 * Deterministic: same inputs → same itinerary, so a shared URL reproduces the
 * exact plan (and SSR is stable). Fills each day's morning/afternoon/evening
 * from the trip-type pools in data/itineraryActivities.ts, clusters by
 * neighborhood so a day doesn't crisscross the island, applies per-slot user
 * overrides (`picks`), and rolls up a cost range.
 */

import {
  ACTIVITY_BY_ID,
  SLOT_ORDER,
  type Activity,
  type Slot,
  type TripType,
} from '@/data/itineraryActivities';
import { LODGING_TIERS, type LodgingTier } from '@/data/costEstimates';

const SLOTS: Slot[] = ['morning', 'afternoon', 'evening'];
const SLOT_LETTER: Record<Slot, string> = { morning: 'm', afternoon: 'a', evening: 'e' };
const LETTER_SLOT: Record<string, Slot> = { m: 'morning', a: 'afternoon', e: 'evening' };
const VALID_DAYS = [3, 4, 5, 7];
const VALID_TYPES: TripType[] = ['family', 'couples', 'golf', 'beach'];
const VALID_LODGING = LODGING_TIERS.map((t) => t.id);

/** Graceful "flex" fallbacks when a pool runs dry on a long trip. */
const FLEX: Record<Slot, string> = {
  morning: 'coligny-beach',
  afternoon: 'alder-lane-swim',
  evening: 'marsh-golden-hour',
};

export interface BuiltSlot {
  slot: Slot;
  activity: Activity | null;
  isOverride: boolean;
}
export interface ItineraryDay {
  dayNumber: number;
  slots: BuiltSlot[];
  neighborhoods: string[];
}
export interface ItineraryCost {
  nights: number;
  party: number;
  lodgingLow: number;
  lodgingHigh: number;
  activities: number;
  foodLow: number;
  foodHigh: number;
  totalLow: number;
  totalHigh: number;
}
export interface Itinerary {
  days: number;
  type: TripType;
  lodging: LodgingTier['id'];
  party: number;
  itinerary: ItineraryDay[];
  cost: ItineraryCost;
  /** Canonical re-encoded picks, for the share/print URL. */
  picksParam: string;
}

export interface BuildInput {
  days?: number | string;
  type?: string;
  lodging?: string;
  party?: number | string;
  picks?: string;
}

function clampInt(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

export function normalizeInput(input: BuildInput): {
  days: number;
  type: TripType;
  lodging: LodgingTier['id'];
  party: number;
  overrides: Map<string, string>;
} {
  const daysRaw = clampInt(input.days, 5, 3, 7);
  const days = VALID_DAYS.includes(daysRaw) ? daysRaw : 5;
  const type = VALID_TYPES.includes(input.type as TripType)
    ? (input.type as TripType)
    : 'family';
  const lodging = VALID_LODGING.includes(input.lodging as LodgingTier['id'])
    ? (input.lodging as LodgingTier['id'])
    : 'standard';
  const party = clampInt(input.party, 4, 1, 12);

  // picks: "0m:harbour-town-golf,1e:bluffton-dinner"
  const overrides = new Map<string, string>();
  if (typeof input.picks === 'string' && input.picks.length > 0) {
    for (const token of input.picks.split(',')) {
      const m = token.match(/^(\d+)([mae]):([a-z0-9-]+)$/);
      if (!m) continue;
      const [, d, letter, id] = m;
      const dayIdx = Number(d);
      if (dayIdx < 0 || dayIdx >= days) continue;
      if (!ACTIVITY_BY_ID[id]) continue;
      overrides.set(`${dayIdx}-${LETTER_SLOT[letter]}`, id);
    }
  }
  return { days, type, lodging, party, overrides };
}

function pickForSlot(
  type: TripType,
  slot: Slot,
  used: Set<string>,
  preferHood?: string,
): string | null {
  const pool = SLOT_ORDER[type][slot];
  if (preferHood) {
    for (const id of pool) {
      if (!used.has(id) && ACTIVITY_BY_ID[id]?.neighborhood === preferHood) return id;
    }
  }
  for (const id of pool) {
    if (!used.has(id)) return id;
  }
  return null;
}

export function buildItinerary(input: BuildInput): Itinerary {
  const { days, type, lodging, party, overrides } = normalizeInput(input);
  const used = new Set<string>();
  for (const id of overrides.values()) used.add(id);

  const itinerary: ItineraryDay[] = [];
  const canonicalPicks: string[] = [];

  for (let d = 0; d < days; d++) {
    const slots: BuiltSlot[] = [];
    let dayHood: string | undefined;
    for (const slot of SLOTS) {
      const key = `${d}-${slot}`;
      let id: string | null;
      let isOverride = false;
      if (overrides.has(key)) {
        id = overrides.get(key)!;
        isOverride = true;
        canonicalPicks.push(`${d}${SLOT_LETTER[slot]}:${id}`);
      } else {
        id = pickForSlot(type, slot, used, dayHood);
        if (!id) id = FLEX[slot]; // graceful fill if the pool ran dry
      }
      if (id) used.add(id);
      const activity = id ? (ACTIVITY_BY_ID[id] ?? null) : null;
      if (slot === 'morning' && activity) dayHood = activity.neighborhood;
      slots.push({ slot, activity, isOverride });
    }
    const neighborhoods = Array.from(
      new Set(slots.map((s) => s.activity?.neighborhood).filter(Boolean) as string[]),
    );
    itinerary.push({ dayNumber: d + 1, slots, neighborhoods });
  }

  const cost = rollUpCost(itinerary, days, lodging, party);
  return {
    days,
    type,
    lodging,
    party,
    itinerary,
    cost,
    picksParam: canonicalPicks.join(','),
  };
}

function rollUpCost(
  itinerary: ItineraryDay[],
  days: number,
  lodgingId: LodgingTier['id'],
  party: number,
): ItineraryCost {
  const nights = days;
  const tier = LODGING_TIERS.find((t) => t.id === lodgingId) ?? LODGING_TIERS[1];
  const lodgingLow = tier.nightlyMin * nights;
  const lodgingHigh = tier.nightlyMax * nights;

  let activities = 0;
  for (const day of itinerary) {
    for (const s of day.slots) {
      if (s.activity) activities += s.activity.costPerPerson * party;
    }
  }

  // Food: kitchen → cook some; no kitchen → eat out. Per person per day.
  const foodLowPP = tier.hasKitchen ? 40 : 70;
  const foodHighPP = tier.hasKitchen ? 70 : 110;
  const foodLow = foodLowPP * party * days;
  const foodHigh = foodHighPP * party * days;

  return {
    nights,
    party,
    lodgingLow,
    lodgingHigh,
    activities,
    foodLow,
    foodHigh,
    totalLow: lodgingLow + activities + foodLow,
    totalHigh: lodgingHigh + activities + foodHigh,
  };
}

/** Build the canonical share/permalink query for an itinerary. */
export function shareQuery(it: Itinerary): string {
  const q = new URLSearchParams();
  q.set('days', String(it.days));
  q.set('type', it.type);
  q.set('lodging', it.lodging);
  q.set('party', String(it.party));
  if (it.picksParam) q.set('picks', it.picksParam);
  return q.toString();
}

export function lodgingLabel(id: LodgingTier['id']): string {
  return LODGING_TIERS.find((t) => t.id === id)?.label ?? id;
}

/**
 * Share query for the same itinerary but with one slot overridden to `newId`.
 * Used to render server-side "swap" links (no client state needed).
 */
export function withPick(
  it: Itinerary,
  dayIndex: number,
  slot: Slot,
  newId: string,
): string {
  const map = new Map<string, string>();
  if (it.picksParam) {
    for (const tok of it.picksParam.split(',')) {
      const m = tok.match(/^(\d+)([mae]):([a-z0-9-]+)$/);
      if (m) map.set(`${m[1]}-${LETTER_SLOT[m[2]]}`, m[3]);
    }
  }
  map.set(`${dayIndex}-${slot}`, newId);
  const picks = Array.from(map.entries())
    .map(([k, id]) => {
      const [d, s] = k.split('-');
      return `${d}${SLOT_LETTER[s as Slot]}:${id}`;
    })
    .join(',');
  const q = new URLSearchParams();
  q.set('days', String(it.days));
  q.set('type', it.type);
  q.set('lodging', it.lodging);
  q.set('party', String(it.party));
  if (picks) q.set('picks', picks);
  return q.toString();
}

/** Alternative activities for a slot in a trip type, excluding the current one. */
export function alternativesFor(
  type: TripType,
  slot: Slot,
  excludeId?: string,
): Activity[] {
  return SLOT_ORDER[type][slot]
    .filter((id) => id !== excludeId)
    .map((id) => ACTIVITY_BY_ID[id])
    .filter((a): a is Activity => Boolean(a));
}
