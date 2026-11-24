/**
 * Stay22 affiliate helpers.
 *
 * Stay22 is a meta-affiliate aggregating Booking.com, VRBO, Airbnb, Hotels.com,
 * Expedia, etc. The affiliate id (`aid`) is PUBLIC by design — it travels in
 * client-side map iframes and outbound links — so it lives in
 * NEXT_PUBLIC_STAY22_AID, not a server-only secret.
 *
 * Because it is `NEXT_PUBLIC_`, the value is inlined at BUILD time. Setting it
 * in the host dashboard does nothing until the next deployment is built.
 *
 * Free-tier integration uses:
 *   1. The Interactive Map embed (iframe to /embed/gm).
 *   2. `aid`-stamped outbound deeplinks ("Allez"-style link transformation).
 *
 * NOTE: confirm the exact embed path + accepted query params in the Stay22
 * dashboard after signup. The /embed/gm shape below is Stay22's documented
 * classic map embed; adjust `STAY22_EMBED_BASE` / param names if the dashboard
 * snippet differs. All call sites go through these helpers so a change is local.
 */

/**
 * The affiliate id, or `null` when unconfigured.
 *
 * Deliberately null rather than a placeholder string: an unrecognized `aid` is
 * never credited by Stay22, so stamping one only leaks a fake id into live
 * outbound links and map embeds. Every helper below omits the parameter
 * entirely when this is null, matching `app/lib/affiliates.ts`, where a missing
 * tracking id yields a working but untracked URL.
 */
export const STAY22_AID: string | null =
  process.env.NEXT_PUBLIC_STAY22_AID || null;

const STAY22_EMBED_BASE = 'https://www.stay22.com/embed/gm';
const STAY22_ALLEZ_BASE = 'https://www.stay22.com/allez';

let warnedMissingAid = false;

/** Resolve the aid, warning once in non-production when it is unset. */
function resolveAid(): string | null {
  if (STAY22_AID) return STAY22_AID;
  if (process.env.NODE_ENV !== 'production' && !warnedMissingAid) {
    warnedMissingAid = true;
    console.warn(
      '[stay22] NEXT_PUBLIC_STAY22_AID not set — links will pass through without tracking.',
    );
  }
  return null;
}

export type Stay22Center = {
  lat: number;
  lng: number;
  zoom?: number;
};

/** Stamp the Stay22 affiliate id onto an arbitrary outbound booking URL. */
export function withStay22Params(url: string): string {
  const aid = resolveAid();
  if (!aid) return url; // unconfigured — leave the booking link untracked
  try {
    const u = new URL(url);
    if (!u.searchParams.has('aid')) {
      u.searchParams.set('aid', aid);
    }
    return u.toString();
  } catch {
    return url; // not a parseable URL — leave untouched
  }
}

/** Build the <iframe src> for the Stay22 interactive map at a given center. */
export function stay22MapEmbedSrc(center: Stay22Center): string {
  const aid = resolveAid();
  const params = new URLSearchParams();
  if (aid) params.set('aid', aid);
  params.set('lat', String(center.lat));
  params.set('lng', String(center.lng));
  params.set('zoom', String(center.zoom ?? 13));
  // Brand the markers to the site palette (coral). Hex without '#'.
  params.set('maincolor', 'C44A2B');
  return `${STAY22_EMBED_BASE}?${params.toString()}`;
}

/**
 * Build a Stay22 "Allez" search deeplink centered on a neighborhood.
 *
 * Do not pass raw float coordinates through `extra` — use the `center` param
 * (avoids float-precision artifacts in the query string).
 */
export function stay22SearchDeeplink(
  center: Stay22Center,
  extra: Record<string, string | number> = {},
): string {
  const aid = resolveAid();
  const params = new URLSearchParams();
  if (aid) params.set('aid', aid);
  params.set('lat', String(center.lat));
  params.set('lng', String(center.lng));
  for (const [k, v] of Object.entries(extra)) {
    params.set(k, String(v));
  }
  return `${STAY22_ALLEZ_BASE}?${params.toString()}`;
}
