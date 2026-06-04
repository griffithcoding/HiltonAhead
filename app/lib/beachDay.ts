/**
 * Hilton Head Beach Day Planner — the recommendation engine.
 *
 * Given a trip date, fuses real NOAA tides (any date) + NWS forecast (≤7 days,
 * else seasonal averages) + computed sun times, then maps the day onto
 * tide-keyed windows using the local-knowledge ruleset in data/beachDayRules.ts.
 *
 * `buildBeachDayPlan(isoDate)` is the single entry point the page calls.
 */

import { getTidesForDate, type TideEvent } from './tides';
import { getForecastForDate } from './weather';
import { getSunTimes, fmtHHITime } from './sun';
import { months } from '@/data/months';
import {
  BEACHES,
  ACTIVITIES,
  swimBeach,
  flatsBeach,
  type BeachName,
  type TideKey,
} from '@/data/beachDayRules';

export interface PlanWindow {
  kind: 'morning' | 'low-tide' | 'high-tide' | 'sunset';
  label: string;
  time: string;
  beach: BeachName | null;
  what: string;
}

export interface PlanActivity {
  title: string;
  detail: string;
  tide: TideKey;
  affiliate?: { programId: 'viator' | 'getyourguide'; deeplink?: string };
}

export interface BeachDayPlan {
  isoDate: string;
  dateLabel: string;
  daysOut: number;
  weather: {
    source: 'forecast' | 'seasonal';
    tempHigh: number | null;
    waterTemp: number | null;
    summary: string;
  };
  sun: {
    sunrise: string;
    sunset: string;
    goldenMorning: string;
    goldenEvening: string;
    daylight: string;
  };
  tides: { time: string; type: 'High' | 'Low'; height: string; minutes: number }[];
  topPick: { beach: BeachName; bestHours: string; why: string };
  windows: PlanWindow[];
  activities: PlanActivity[];
  localNote: string;
  dataNote: string;
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(s: string): boolean {
  if (!ISO_RE.test(s)) return false;
  const d = new Date(`${s}T12:00:00`);
  return !Number.isNaN(d.getTime());
}

function localMinutesOf(d: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return h * 60 + m;
}

/** NOAA returns local ("lst_ldt") times like "2026-07-04T04:36". */
function tideMinutes(isoish: string): number {
  const hm = isoish.split('T')[1] ?? '00:00';
  const [h, m] = hm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function fmtMinutes(min: number): string {
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const ap = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
}

export async function buildBeachDayPlan(isoDate: string): Promise<BeachDayPlan> {
  const dl = new Date(`${isoDate}T12:00:00`);
  const dateLabel = dl.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const today = new Date();
  const daysOut = Math.round(
    (new Date(`${isoDate}T12:00:00`).getTime() -
      new Date(today.toISOString().slice(0, 10) + 'T12:00:00').getTime()) /
      86_400_000,
  );

  // ── Sun (always available) ──
  const sunAnchor = new Date(`${isoDate}T12:00:00Z`);
  const s = getSunTimes(sunAnchor);
  const sunriseMin = localMinutesOf(s.sunrise);
  const sunsetMin = localMinutesOf(s.sunset);

  // ── Tides (real for any date) ──
  const compact = isoDate.replaceAll('-', '');
  const tideRes = await getTidesForDate(compact, 1);
  const rawEvents: TideEvent[] =
    tideRes.ok && tideRes.days[0] ? tideRes.days[0].events : [];
  const tides = rawEvents.map((e) => ({
    time: fmtMinutes(tideMinutes(e.time)),
    type: e.type === 'H' ? ('High' as const) : ('Low' as const),
    height: `${e.heightFeet.toFixed(1)} ft`,
    minutes: tideMinutes(e.time),
  }));

  // daytime tide extremes
  const daytime = tides.filter(
    (t) => t.minutes >= sunriseMin && t.minutes <= sunsetMin,
  );
  const dayLow = daytime.find((t) => t.type === 'Low') ?? null;
  const dayHigh = daytime.find((t) => t.type === 'High') ?? null;

  // ── Weather (forecast ≤7d, else seasonal) ──
  const forecast = daysOut >= 0 && daysOut <= 6 ? await getForecastForDate(isoDate) : null;
  const month = months[dl.getMonth()];
  const weather: BeachDayPlan['weather'] = forecast
    ? {
        source: 'forecast',
        tempHigh: forecast.tempHigh,
        waterTemp: month?.waterTemp ?? null,
        summary: `${forecast.shortForecast}, high ~${forecast.tempHigh}°F. Water ~${month?.waterTemp ?? '—'}°F. Wind ${forecast.windSummary}.`,
      }
    : {
        source: 'seasonal',
        tempHigh: month?.avgHigh ?? null,
        waterTemp: month?.waterTemp ?? null,
        summary: `Typical for ${month?.name ?? 'this month'}: high ~${month?.avgHigh ?? '—'}°F, water ~${month?.waterTemp ?? '—'}°F, about ${month?.rainyDays ?? '—'} rainy days that month.`,
      };

  // ── Windows ──
  const morningStart = Math.min(sunriseMin + 60, 8 * 60);
  const morningEnd = 11 * 60;
  const morningHasLow = dayLow ? dayLow.minutes <= 12 * 60 + 30 : false;
  const morningBeach: BeachName = morningHasLow ? flatsBeach() : swimBeach(false);

  const windows: PlanWindow[] = [
    {
      kind: 'morning',
      label: 'Best overall window',
      time: `${fmtMinutes(morningStart)} – ${fmtMinutes(morningEnd)}`,
      beach: morningBeach,
      what: morningHasLow
        ? 'Beat the afternoon sea breeze (12–18 mph) and the crowds. A morning low tide means wide flats — shelling, tide pools, and an easy walk.'
        : 'Beat the afternoon sea breeze (12–18 mph) and the crowds. Tide is up — easy swimming and the fullest beach.',
    },
  ];
  if (dayLow) {
    windows.push({
      kind: 'low-tide',
      label: `Low tide — flats open up (${dayLow.time})`,
      time: `${fmtMinutes(Math.max(0, dayLow.minutes - 90))} – ${fmtMinutes(dayLow.minutes + 90)}`,
      beach: flatsBeach(),
      what: 'The sand runs way out: shark teeth and shelling at the north end, tide pools for the kids, hard-packed sand for beach biking.',
    });
  }
  if (dayHigh) {
    windows.push({
      kind: 'high-tide',
      label: `High tide — best swimming (${dayHigh.time})`,
      time: `${fmtMinutes(Math.max(0, dayHigh.minutes - 90))} – ${fmtMinutes(dayHigh.minutes + 90)}`,
      beach: swimBeach(false),
      what: 'More water, shorter walk to it. The window for an actual swim or to kayak the calmer creeks behind the island.',
    });
  }
  windows.push({
    kind: 'sunset',
    label: 'Golden hour',
    time: `${fmtHHITime(s.goldenEveningStart)} – ${fmtHHITime(s.sunset)}`,
    beach: null,
    what: 'Last light over the marsh and Calibogue Sound. Skull Creek and the west-facing docks catch the best of it.',
  });

  // ── Top pick + activities ──
  const topPick = {
    beach: morningBeach,
    bestHours: `${fmtMinutes(morningStart)} – ${fmtMinutes(morningEnd)}`,
    why: `${BEACHES[morningBeach].note} ${BEACHES[morningBeach].parking}.`,
  };

  const hasLow = Boolean(dayLow);
  const hasHigh = Boolean(dayHigh);
  const activities: PlanActivity[] = ACTIVITIES.filter((a) =>
    a.tide === 'any' || (a.tide === 'low' && hasLow) || (a.tide === 'high' && hasHigh),
  ).map((a) => ({ title: a.title, detail: a.detail, tide: a.tide, affiliate: a.affiliate }));

  const localNote =
    daysOut > 6
      ? 'Tide and sun times below are exact (they’re astronomical). Weather is the seasonal average — check back within a week of your trip for the live forecast.'
      : 'Live tide, sun, and weather for your date. Tides at the beach lag the Fort Pulaski station by ~25 minutes.';

  const dataNote =
    'Tides: NOAA station 8670870 (Fort Pulaski). Weather: National Weather Service. Sun times computed for Hilton Head. Beach picks are local guidance, not guarantees.';

  return {
    isoDate,
    dateLabel,
    daysOut,
    weather,
    sun: {
      sunrise: fmtHHITime(s.sunrise),
      sunset: fmtHHITime(s.sunset),
      goldenMorning: `${fmtHHITime(s.sunrise)} – ${fmtHHITime(s.goldenMorningEnd)}`,
      goldenEvening: `${fmtHHITime(s.goldenEveningStart)} – ${fmtHHITime(s.sunset)}`,
      daylight: `${s.daylightHours.toFixed(1)} hrs`,
    },
    tides,
    topPick,
    windows,
    activities,
    localNote,
    dataNote,
  };
}
