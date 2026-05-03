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

function readTrackingId(programId: AffiliateProgramId): string | null {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return null;
  const value = process.env[program.trackingIdEnv];
  if (value && value.length > 0) return value;
  if (process.env.NODE_ENV !== 'production' && !warnedMissingId.has(programId)) {
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
 */
export function withAffiliateParams(
  programId: AffiliateProgramId,
  deeplink?: string,
): string {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return deeplink ?? '';
  const targetUrl = deeplink ?? program.defaultDeeplink;
  if (!targetUrl) return '';

  const trackingId = readTrackingId(programId);

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
