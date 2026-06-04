/**
 * NOAA Tides & Currents — predictions for Hilton Head Island.
 *
 * Public-domain data, no auth. Station 8670870 (Fort Pulaski, GA) is the
 * closest reliable station; Hilton Head's beaches lag predictions by
 * ~25 minutes (disclosed in the widget footer).
 *
 * Used by:
 *   - app/api/tides/hilton-head/route.ts
 *   - components/tools/TideForecast.tsx
 */

const STATION = '8670870';

type RawPrediction = {
  t: string; // "2026-05-01 04:36"
  v: string; // height in feet (string)
  type: 'H' | 'L';
};

export type TideEvent = {
  time: string;       // ISO-ish "2026-05-01T04:36"
  heightFeet: number;
  type: 'H' | 'L';
};

export type TideDay = {
  dateLabel: string;   // "Fri May 1"
  events: TideEvent[]; // 0–4 events for that day
};

export type TidePayload =
  | { ok: true; updatedAt: string; days: TideDay[]; station: string }
  | { ok: false; error: string };

function todayYYYYMMDD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function formatDayLabel(dateString: string): string {
  // dateString: "2026-05-01 04:36"
  const [datePart] = dateString.split(' ');
  const d = new Date(`${datePart}T12:00:00`);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function dayKey(dateString: string): string {
  return dateString.split(' ')[0];
}

/**
 * Today's 7-day tide outlook (used by the live tides widget).
 */
export async function getHiltonHeadTides(): Promise<TidePayload> {
  return fetchTidesRange(todayYYYYMMDD(), 168);
}

/**
 * Tides for an arbitrary future (or past) date. NOAA tide predictions are
 * astronomical and available for years — so the Beach Day Planner can return
 * real tides for any trip date. `beginYYYYMMDD` like "20260704"; `days`
 * window (default 1) → events for that day.
 */
export async function getTidesForDate(
  beginYYYYMMDD: string,
  days = 1,
): Promise<TidePayload> {
  return fetchTidesRange(beginYYYYMMDD, Math.max(24, days * 24));
}

async function fetchTidesRange(
  beginYYYYMMDD: string,
  rangeHours: number,
): Promise<TidePayload> {
  try {
    const begin = beginYYYYMMDD;
    const url = new URL(
      'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
    );
    url.searchParams.set('product', 'predictions');
    url.searchParams.set('begin_date', begin);
    url.searchParams.set('range', String(rangeHours));
    url.searchParams.set('datum', 'MLLW');
    url.searchParams.set('interval', 'hilo');
    url.searchParams.set('format', 'json');
    url.searchParams.set('station', STATION);
    url.searchParams.set('time_zone', 'lst_ldt');
    url.searchParams.set('units', 'english');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'HiltonAhead.com (wgriffith1218@gmail.com)' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { ok: false, error: `NOAA tide fetch failed (${res.status})` };
    }

    const data = await res.json();
    const predictions: RawPrediction[] = data?.predictions ?? [];
    if (predictions.length === 0) {
      return { ok: false, error: 'no predictions returned' };
    }

    const groups = new Map<string, TideEvent[]>();
    for (const p of predictions) {
      const heightFeet = parseFloat(p.v);
      if (Number.isNaN(heightFeet)) continue;
      const key = dayKey(p.t);
      const event: TideEvent = {
        time: p.t.replace(' ', 'T'),
        heightFeet,
        type: p.type,
      };
      const existing = groups.get(key);
      if (existing) {
        existing.push(event);
      } else {
        groups.set(key, [event]);
      }
    }

    const days: TideDay[] = Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 7)
      .map(([key, events]) => ({
        dateLabel: formatDayLabel(`${key} 12:00`),
        events: events.sort((a, b) => a.time.localeCompare(b.time)),
      }));

    return {
      ok: true,
      updatedAt: new Date().toISOString(),
      days,
      station: STATION,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'unknown error',
    };
  }
}
