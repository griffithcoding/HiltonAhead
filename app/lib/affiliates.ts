/**
 * Affiliate link helpers — server- and client-safe.
 *
 * Mirrors the shape of `app/lib/directoryTracking.ts`:
 *   - withAffiliateParams(programId, deeplink) stamps tracking on outbound URLs.
 *   - trackAffiliateClick(programId, placement, destination) fires a beacon.
 *
 * Tracking ID source: env var named in data/affiliateLinks.ts. If unset, the
 * raw URL is returned so links keep working pre-approval; we just don't earn
 * commission on those clicks. Console-warn once per program in dev.
 */

import {
  AFFILIATE_PROGRAMS,
  type AffiliateProgramId,
} from '@/data/affiliateLinks';

const TRACK_ENDPOINT = '/api/affiliate/track';

const warnedMissingId = new Set<AffiliateProgramId>();

/**
 * Resolve which env var to read for a given program + placement combo.
 * If the program has a `placementTagEnv` map and the placement string
 * prefix-matches one of its keys (case-insensitive), use the placement-
 * specific env var. Otherwise fall back to the program's base
 * `trackingIdEnv`.
 */
function resolveTrackingEnvVar(
  programId: AffiliateProgramId,
  placement?: string,
): string | null {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return null;
  if (placement && program.placementTagEnv) {
    const lower = placement.toLowerCase();
    for (const [key, envName] of Object.entries(program.placementTagEnv)) {
      if (lower.startsWith(key.toLowerCase())) return envName;
    }
  }
  return program.trackingIdEnv;
}

function readTrackingId(
  programId: AffiliateProgramId,
  placement?: string,
): string | null {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return null;
  const envName = resolveTrackingEnvVar(programId, placement);
  if (!envName) return null;

  const value = process.env[envName];
  if (value && value.length > 0) return value;

  // Placement-specific var missing? Fall back to the base tag so we don't
  // silently drop attribution. Per-surface env vars are intentionally
  // optional — placement maps to base tag if no override is configured.
  if (envName !== program.trackingIdEnv) {
    const base = process.env[program.trackingIdEnv];
    if (base && base.length > 0) return base;
  }

  // Only warn for missing *base* env var. Warning on every missing per-
  // surface var would be noise — they're intentionally optional.
  if (
    process.env.NODE_ENV !== 'production' &&
    !warnedMissingId.has(programId)
  ) {
    warnedMissingId.add(programId);
    console.warn(
      `[affiliates] ${program.name}: ${program.trackingIdEnv} not set — links will pass through without tracking.`,
    );
  }
  return null;
}

/**
 * Stamp the program's tracking ID + any required static params onto the URL.
 * Falls back to the unmodified URL on parse failure or missing ID.
 *
 * Two link patterns are supported (per program.linkPattern):
 *   - 'query-stamp' (default): adds ?trackingParam=trackingId to the URL.
 *   - 'partnerize-wrap': wraps the URL through Partnerize's prf.hn redirect.
 *     Used by Expedia + Vrbo (Partnerize) — produces:
 *     `https://prf.hn/click/camref:ID/destination:ENCODED_URL`.
 *     Without a tracking ID the helper returns the raw destination URL so
 *     links keep working pre-approval.
 *
 * @param placement Optional surface label (e.g. `'blog/spring-break'`,
 *   `'faq/lodging'`). Used both for click-tracking analytics AND for
 *   resolving a placement-specific tracking ID via the program's
 *   `placementTagEnv` map (currently Amazon-only).
 */
export function withAffiliateParams(
  programId: AffiliateProgramId,
  deeplink?: string,
  placement?: string,
): string {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return deeplink ?? '';
  const targetUrl = deeplink ?? program.defaultDeeplink;
  if (!targetUrl) return '';

  const trackingId = readTrackingId(programId, placement);

  // Partnerize redirect-wrap. Expedia + Vrbo use this.
  if (program.linkPattern === 'partnerize-wrap') {
    if (!trackingId) return targetUrl;
    return `https://prf.hn/click/camref:${encodeURIComponent(
      trackingId,
    )}/destination:${encodeURIComponent(targetUrl)}`;
  }

  // Default: query-string stamp.
  try {
    const u = new URL(targetUrl);
    if (program.staticParams) {
      for (const [k, v] of Object.entries(program.staticParams)) {
        u.searchParams.set(k, v);
      }
    }
    if (trackingId) {
      u.searchParams.set(program.trackingParam, trackingId);
    }
    return u.toString();
  } catch {
    return targetUrl;
  }
}

/**
 * Fire-and-forget click logging. Uses sendBeacon so the request survives the
 * page navigation that follows the link. No-op on the server.
 */
export function trackAffiliateClick(
  programId: AffiliateProgramId,
  placement: string | undefined,
  destination: string | undefined,
): void {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify({
    programId,
    placement: placement ?? null,
    destination: destination ?? null,
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    } catch {
      // fall through
    }
  }

  try {
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* analytics is best-effort */
    });
  } catch {
    /* swallow */
  }
}
