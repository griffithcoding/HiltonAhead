/**
 * Directory event tracking — bootstrap-friendly, $0 SaaS.
 *
 * We log outbound interactions (phone clicks, website clicks, future inquiry
 * submissions) on /local/[industry] business cards into our own Supabase
 * table. The /admin/directory dashboard aggregates by business so the founder
 * has real attribution data to put in front of owners ("Hilton Ahead sent
 * you 14 visitors and 3 calls last month").
 *
 * Client-side helper fires fire-and-forget POSTs that survive page navigation
 * via sendBeacon. Server-side helper appends UTM params to outbound URLs so
 * a business sees "hiltonahead" in their own GA Source/Medium.
 */

export type DirectoryEventType =
  | 'phone_click'
  | 'website_click'
  | 'inquiry_submit';

const TRACK_ENDPOINT = '/api/directory/track';

/**
 * Append UTM params to an outbound business website URL. Server- and
 * client-safe. Falls back to the unmodified URL on parse failure.
 */
export function withDirectoryUtm(url: string, businessId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'hiltonahead');
    u.searchParams.set('utm_medium', 'directory');
    u.searchParams.set('utm_campaign', businessId);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Fire-and-forget event log from the browser. Uses sendBeacon when available
 * so the request survives the page navigation that follows a link click.
 * Silently no-ops on the server.
 */
export function trackDirectoryEvent(
  businessId: string,
  industrySlug: string,
  eventType: DirectoryEventType,
): void {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify({ businessId, industrySlug, eventType });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    } catch {
      // fall through to fetch
    }
  }

  try {
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never block the user */
    });
  } catch {
    /* swallow */
  }
}
