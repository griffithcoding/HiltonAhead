/**
 * Seasonal-angle generator for the weekly newsletter.
 *
 * Pure logic — no LLM. Picks 1-2 hooks based on calendar signals:
 * water-temp thresholds, hurricane-season windows, peak rate index,
 * holiday proximity, daylight changes, and known booking lead-times
 * (RBC Heritage in April, Wine & Food in March, Concours in October).
 *
 * Each angle returns a short headline + 1-2 sentence body. The render
 * layer wraps these in the issue's "Insider note" section.
 */

import type { MonthData } from '@/data/months';
import { getEventBySlug, hasConfirmedDates, type EventEntry } from '@/data/events';

/** "Mar 25–Apr 4" style range for newsletter copy. */
function shortRange(e: EventEntry): string {
  const fmt = (iso: string) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return e.startDate === e.endDate ? fmt(e.startDate) : `${fmt(e.startDate)}–${fmt(e.endDate)}`;
}

export interface SeasonalAngle {
  headline: string;
  body: string;
  /** Optional CTA the render layer can append. */
  ctaText?: string;
  ctaUrl?: string;
}

/** Pick 1-2 angles for the current date. Order = priority. */
export function pickSeasonalAngles(
  now: Date,
  month: MonthData,
): SeasonalAngle[] {
  const angles: SeasonalAngle[] = [];
  const monthNum = month.monthNumber;
  const day = now.getDate();
  const year = now.getFullYear();

  // ——— Water temp thresholds (the question every traveler asks) ———
  if (month.waterTemp >= 75 && month.waterTemp < 80) {
    angles.push({
      headline: `Water temp just hit ${month.waterTemp}°F`,
      body: `That's the comfortable swim threshold — the Atlantic finally feels like the Atlantic. Crowds haven't caught up yet, so beach access is still easy. The next two weeks are the sweet spot.`,
    });
  } else if (month.waterTemp >= 80) {
    angles.push({
      headline: `Water's at ${month.waterTemp}°F`,
      body: `Bath-tub warm. Kids will stay in until they're prunes. Pack reef-safe sunscreen — UV index runs 9-11 most July afternoons.`,
    });
  } else if (month.waterTemp >= 65 && month.waterTemp < 72) {
    angles.push({
      headline: `Water's still ${month.waterTemp}°F — bracing but doable`,
      body: `Locals don't swim until June. If the kids are determined, mid-day on a sunny day in the shallow tidal pools warms 5-8 degrees above the open ocean.`,
    });
  }

  // ——— Hurricane season heads-up (Jun 1–Nov 30; peak Aug-Oct) ———
  if (monthNum === 6 && day < 15) {
    angles.push({
      headline: 'Hurricane season starts June 1',
      body: `That's not a reason to skip Hilton Head — most years pass without a direct hit. But verify your travel insurance covers named-storm cancellations, and watch the cone if you're booking July-October.`,
    });
  } else if (monthNum >= 8 && monthNum <= 10) {
    angles.push({
      headline: 'Peak hurricane window is open',
      body: `Storms develop on 5-7 day cycles. If you're traveling in the next 10 days, check the National Hurricane Center cone before flying. Most disruptions are flight delays, not on-island damage.`,
    });
  }

  // ——— Booking lead-time pressure for marquee weeks ———
  // Heritage: 2nd or 3rd week of April. Lodging tightens 9-10 months out.
  if ((monthNum >= 7 && monthNum <= 9) || (monthNum === 10 && day < 15)) {
    angles.push({
      // Always about NEXT April's tournament; exact dates come from
      // data/events.ts when that year's entry exists, never hardcoded.
      headline: `RBC Heritage ${year + 1} lodging is filling now`,
      body: (() => {
        const h = getEventBySlug('rbc-heritage');
        const when =
          h && hasConfirmedDates(h) && h.startDate.startsWith(String(year + 1))
            ? `Heritage week (${shortRange(h)}, ${year + 1})`
            : `Heritage week (mid-April ${year + 1})`;
        return `${when} needs 9-10 months of lead time for Sea Pines villas. Premium oceanfronts within walking distance of Harbour Town go first. We have a few interior holds we're still releasing.`;
      })(),
      ctaText: 'Lock in Heritage week →',
      ctaUrl: 'https://www.hiltonahead.com/itinerary',
    });
  }

  // Wine & Food: late March. Tickets sell out 4-6 weeks ahead.
  if (monthNum === 2 || (monthNum === 3 && day < 15)) {
    angles.push({
      headline: 'Wine & Food Festival tickets — book 4-6 weeks out',
      body: (() => {
        const w = getEventBySlug('wine-and-food-festival');
        const when =
          w && hasConfirmedDates(w) && w.startDate.startsWith(String(year))
            ? `this year's festival (${shortRange(w)})`
            : 'the festival';
        return `The public tasting at Honey Horn always sells out, and the winemaker dinners go faster. If ${when} is on your radar, lock the lodging this week and the dinner reservations next week.`;
      })(),
    });
  }

  // ——— Concours season (late Oct / early Nov) ———
  if (monthNum === 8 || monthNum === 9) {
    angles.push({
      headline: 'Concours d’Elegance — late October',
      body: `The multi-day automotive showcase (Motoring Festival at Honey Horn, concours at Port Royal) tightens lodging the prior week. Check the organizer for this year's dates and book by mid-September.`,
    });
  }

  // ——— Snowbird window opens (Nov / Dec) ———
  if (monthNum === 10 || monthNum === 11) {
    angles.push({
      headline: 'Snowbird leases for Jan-Mar are closing fast',
      body: `Three-month winter rentals in Sea Pines and Palmetto Dunes book out by early December. Rate index drops to 35-45% of July, which is why this is the best value on the island.`,
      ctaText: 'See winter-rental options →',
      ctaUrl: 'https://www.hiltonahead.com/hilton-head-winter-rental',
    });
  }

  // ——— Holiday lights (late Nov - early Jan) ———
  if (monthNum === 11 || (monthNum === 12 && day <= 31)) {
    angles.push({
      headline: 'Harbour Town holiday lights run nightly',
      body: `Best window: 5-7 p.m. for the sunset-into-dark transition. Weeknights are quieter than Fridays. Free to walk; restaurants stay open later for the crowd.`,
    });
  }

  // ——— Daylight signals (shoulder months) ———
  if (monthNum === 11 && day >= 7) {
    angles.push({
      headline: 'Sunset is now 5:15 p.m.',
      body: `Plan dinners earlier — the island gets dark fast in November and most kitchens close by 9. The Salt Marsh Brewing patio at 4:30 catches the last light off the marsh.`,
    });
  }
  if (monthNum === 5 && day >= 7) {
    angles.push({
      headline: 'Sunset is now 8:20 p.m.',
      body: `Beach time stretches until 7:30, dinner reservations work at 8:30, and the kids will not go to bed. May is the most generous month of the year on the island.`,
    });
  }

  // Fall back to month's own copy if nothing else triggered.
  if (angles.length === 0) {
    angles.push({
      headline: `${month.name} on Hilton Head`,
      body: month.intro,
    });
  }

  // Cap at 2.
  return angles.slice(0, 2);
}
