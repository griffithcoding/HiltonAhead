/**
 * NOAA NHC active-storms feed for the Atlantic basin.
 *
 * Public-domain. Used to render a "0 active storms" or "X active storms"
 * status badge on the best-time-to-visit post during hurricane season.
 *
 * Used by:
 *   - app/api/hurricane-status/route.ts
 *   - components/tools/HurricaneStatus.tsx
 */

const FEED_URL = 'https://www.nhc.noaa.gov/CurrentStorms.json';

type RawStorm = {
  id: string;
  binNumber?: string;
  name?: string;
  classification?: string; // e.g. "TS", "HU", "TD"
  intensity?: string;      // wind speed in kt
  pressure?: string;
  basin?: string;          // "AT", "EP", etc.
  latitudeNumeric?: number;
  longitudeNumeric?: number;
  movement?: string;
  publicAdvisory?: { url?: string };
  forecastTrack?: { url?: string };
};

export type ActiveStorm = {
  id: string;
  name: string;
  classification: string;
  intensityKt: number | null;
  basin: string;
  advisoryUrl: string | null;
};

export type HurricanePayload =
  | { ok: true; inSeason: false }
  | { ok: true; inSeason: true; activeStorms: ActiveStorm[] }
  | { ok: false; error: string };

const SEASON_MONTHS = new Set([6, 7, 8, 9, 10, 11]);

function classificationLabel(code: string | undefined): string {
  switch ((code || '').toUpperCase()) {
    case 'TD': return 'Tropical Depression';
    case 'TS': return 'Tropical Storm';
    case 'HU': return 'Hurricane';
    case 'MH': return 'Major Hurricane';
    case 'PT': return 'Post-Tropical';
    case 'STD': return 'Subtropical Depression';
    case 'STS': return 'Subtropical Storm';
    default: return code || 'Cyclone';
  }
}

export async function getHurricaneStatus(): Promise<HurricanePayload> {
  const month = new Date().getMonth() + 1;
  if (!SEASON_MONTHS.has(month)) {
    return { ok: true, inSeason: false };
  }

  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'HiltonAhead.com (wgriffith1218@gmail.com)' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      return { ok: false, error: `NHC fetch failed (${res.status})` };
    }
    const data = await res.json();
    const list: RawStorm[] = Array.isArray(data?.activeStorms)
      ? data.activeStorms
      : [];

    const atlantic = list
      .filter((s) => (s.basin || '').toUpperCase() === 'AT')
      .map<ActiveStorm>((s) => ({
        id: s.id,
        name: s.name || 'Unnamed system',
        classification: classificationLabel(s.classification),
        intensityKt: s.intensity ? parseInt(s.intensity, 10) || null : null,
        basin: s.basin || 'AT',
        advisoryUrl: s.publicAdvisory?.url ?? null,
      }));

    return { ok: true, inSeason: true, activeStorms: atlantic };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'unknown error',
    };
  }
}
