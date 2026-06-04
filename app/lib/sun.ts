/**
 * Sunrise / sunset / golden-hour for Hilton Head Island.
 *
 * Deterministic astronomical computation (the "sunrise equation") — no API,
 * no key, works for ANY past or future date. Verified against known Hilton
 * Head sunrise/sunset values; accurate to ~2–5 minutes, which is plenty for
 * "best beach hours" guidance. Times are returned as UTC instants — format
 * with `timeZone: 'America/New_York'`.
 *
 * Used by app/lib/beachDay.ts (the Beach Day Planner engine).
 */

const RAD = Math.PI / 180;
const J2000 = 2451545.0;
export const HHI_LAT = 32.2163;
export const HHI_LON = -80.7526;

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  /** Morning golden hour ends ~60 min after sunrise. */
  goldenMorningEnd: Date;
  /** Evening golden hour starts ~60 min before sunset. */
  goldenEveningStart: Date;
  daylightHours: number;
};

function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function fromJulian(j: number): Date {
  return new Date((j - 2440587.5) * 86400000);
}

/**
 * Compute sun times for the calendar day containing `date`, at the given
 * latitude/longitude (defaults to Hilton Head). Pass a date anchored near
 * local noon (e.g. `${YYYY-MM-DD}T12:00:00Z`) to avoid day-boundary drift.
 */
export function getSunTimes(date: Date, lat = HHI_LAT, lon = HHI_LON): SunTimes {
  const lw = -lon; // west longitude, positive
  const jdate = toJulian(date);
  const n = Math.round(jdate - J2000 - 0.0009 - lw / 360);
  const Jstar = J2000 + 0.0009 + lw / 360 + n; // mean solar noon (Julian)
  const M = (357.5291 + 0.98560028 * (Jstar - J2000)) % 360;
  const Mr = M * RAD;
  const C =
    1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lr = lambda * RAD;
  const Jtransit = Jstar + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lr);
  const sinDelta = Math.sin(lr) * Math.sin(23.4397 * RAD);
  const cosDelta = Math.cos(Math.asin(sinDelta));
  const cosOmega =
    (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * sinDelta) /
    (Math.cos(lat * RAD) * cosDelta);
  const omega = Math.acos(Math.max(-1, Math.min(1, cosOmega))) / RAD;

  const sunrise = fromJulian(Jtransit - omega / 360);
  const sunset = fromJulian(Jtransit + omega / 360);
  const solarNoon = fromJulian(Jtransit);

  return {
    sunrise,
    sunset,
    solarNoon,
    goldenMorningEnd: new Date(sunrise.getTime() + 60 * 60_000),
    goldenEveningStart: new Date(sunset.getTime() - 60 * 60_000),
    daylightHours: (sunset.getTime() - sunrise.getTime()) / 3_600_000,
  };
}

/** Format a UTC instant as a local Hilton Head clock time, e.g. "6:22 AM". */
export function fmtHHITime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
  });
}
