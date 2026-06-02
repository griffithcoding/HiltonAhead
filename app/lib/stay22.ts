/**
 * Stay22 affiliate helpers.
 *
 * Stay22 is a meta-affiliate aggregating Booking.com, VRBO, Airbnb, Hotels.com,
 * Expedia, etc. The affiliate id (`aid`) is PUBLIC by design — it travels in
 * client-side map iframes and outbound links — so it lives in
 * NEXT_PUBLIC_STAY22_AID, not a server-only secret.
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

export const STAY22_AID =
  process.env.NEXT_PUBLIC_STAY22_AID || 'PLACEHOLDER_AID';

const STAY22_EMBED_BASE = 'https://www.stay22.com/embed/gm';
const STAY22_ALLEZ_BASE = 'https://www.stay22.com/allez';

export type Stay22Center = {
  lat: number;
  lng: number;
  zoom?: number;
};

/** Stamp the Stay22 affiliate id onto an arbitrary outbound booking URL. */
export function withStay22Params(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('aid')) {
      u.searchParams.set('aid', STAY22_AID);
    }
    return u.toString();
  } catch {
    return url; // not a parseable URL — leave untouched
  }
}

/** Build the <iframe src> for the Stay22 interactive map at a given center. */
export function stay22MapEmbedSrc(center: Stay22Center): string {
  const params = new URLSearchParams({
    aid: STAY22_AID,
    lat: String(center.lat),
    lng: String(center.lng),
    zoom: String(center.zoom ?? 13),
    // Brand the markers to the site palette (coral). Hex without '#'.
    maincolor: 'C44A2B',
  });
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
  const params = new URLSearchParams({
    aid: STAY22_AID,
    lat: String(center.lat),
    lng: String(center.lng),
  });
  for (const [k, v] of Object.entries(extra)) {
    params.set(k, String(v));
  }
  return `${STAY22_ALLEZ_BASE}?${params.toString()}`;
}
