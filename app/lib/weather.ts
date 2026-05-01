/**
 * National Weather Service (api.weather.gov) integration for Hilton Head.
 *
 * Free for any use including commercial, public-domain, requires a
 * contact User-Agent header per NWS terms.
 *
 * Used by:
 *   - app/api/weather/hilton-head/route.ts (proxy endpoint)
 *   - components/tools/LiveWeather.tsx (server-component fetch)
 *
 * The underlying fetch() calls use Next.js data cache via `next.revalidate`.
 */

const LAT = 32.2163;
const LON = -80.7526;
const USER_AGENT = 'HiltonAhead.com (wgriffith1218@gmail.com)';

export type WeatherPayload =
  | {
      ok: true;
      updatedAt: string;
      current: {
        name: string;
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
        wind: string;
        icon: string;
      };
      periods: Array<{
        name: string;
        isDaytime: boolean;
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
        icon: string;
      }>;
    }
  | { ok: false; error: string };

type RawPeriod = {
  name: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  icon: string;
};

export async function getHiltonHeadWeather(): Promise<WeatherPayload> {
  try {
    const pointsRes = await fetch(
      `https://api.weather.gov/points/${LAT},${LON}`,
      {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
        next: { revalidate: 86400 },
      },
    );

    if (!pointsRes.ok) {
      return { ok: false, error: `points lookup failed (${pointsRes.status})` };
    }

    const pointsData = await pointsRes.json();
    const forecastUrl: string | undefined = pointsData?.properties?.forecast;
    if (!forecastUrl) {
      return { ok: false, error: 'forecast URL missing from points response' };
    }

    const forecastRes = await fetch(forecastUrl, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
      next: { revalidate: 1800 },
    });

    if (!forecastRes.ok) {
      return { ok: false, error: `forecast fetch failed (${forecastRes.status})` };
    }

    const forecastData = await forecastRes.json();
    const periods: RawPeriod[] = forecastData?.properties?.periods ?? [];
    if (periods.length === 0) {
      return { ok: false, error: 'no forecast periods returned' };
    }

    const current = periods[0];
    return {
      ok: true,
      updatedAt: forecastData?.properties?.updated ?? new Date().toISOString(),
      current: {
        name: current.name,
        temperature: current.temperature,
        temperatureUnit: current.temperatureUnit,
        shortForecast: current.shortForecast,
        wind: `${current.windSpeed} ${current.windDirection}`.trim(),
        icon: current.icon,
      },
      periods: periods.slice(0, 7).map((p) => ({
        name: p.name,
        isDaytime: p.isDaytime,
        temperature: p.temperature,
        temperatureUnit: p.temperatureUnit,
        shortForecast: p.shortForecast,
        icon: p.icon,
      })),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}
