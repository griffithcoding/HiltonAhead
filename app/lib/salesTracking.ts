/**
 * Sales prospect tracking — client + server safe.
 *
 * Mirrors app/lib/directoryTracking.ts in spirit but targets the cold-outbound
 * sales funnel (sales_prospects + sales_touches). All sales landing pages and
 * email-link redirects route through these helpers so attribution lands in
 * Supabase rather than just Google Analytics.
 *
 * Pipeline:
 *   - withSalesUtm()              — stamp outbound URLs (emails, social bios,
 *                                   QR codes, Reddit-comment links).
 *   - trackSalesEvent()           — browser fire-and-forget event log via
 *                                   navigator.sendBeacon, fetch fallback.
 *   - parseAttributionFromCookies — read landing-page UTMs persisted in
 *                                   first-party cookies (90-day window) so a
 *                                   form submit weeks later still credits the
 *                                   original campaign + channel.
 */

// ============================================================================
// Enum types — mirror the SQL enums in supabase/migrations/018_sales_prospects.sql
// Keep these in sync if the migration changes.
// ============================================================================

export type SalesSegment =
  | 'golf'
  | 'family'
  | 'couples'
  | 'honeymoon'
  | 'snowbird'
  | 'wedding'
  | 'corporate'
  | 'unknown';

export type SalesChannel =
  | 'email'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'reddit'
  | 'pinterest'
  | 'tiktok'
  | 'direct_mail'
  | 'referral'
  | 'organic'
  | 'paid_search'
  | 'paid_social'
  | 'direct';

export type SalesStatus =
  | 'new'
  | 'queued'
  | 'contacted'
  | 'engaged'
  | 'qualified'
  | 'converted'
  | 'booked'
  | 'unresponsive'
  | 'unsubscribed'
  | 'bounced'
  | 'archived';

export type SalesTouchType =
  | 'email_sent'
  | 'email_open'
  | 'email_click'
  | 'email_reply'
  | 'email_bounce'
  | 'linkedin_invite'
  | 'linkedin_accepted'
  | 'linkedin_message'
  | 'linkedin_reply'
  | 'instagram_dm'
  | 'instagram_reply'
  | 'facebook_message'
  | 'facebook_reply'
  | 'reddit_comment'
  | 'reddit_reply'
  | 'sms_sent'
  | 'sms_reply'
  | 'call_logged'
  | 'note'
  | 'status_change';

// ============================================================================
// Constants
// ============================================================================

const TRACK_ENDPOINT = '/api/sales-track';

/** First-touch attribution window, in days. */
const ATTRIBUTION_TTL_DAYS = 90;

const COOKIE_CAMPAIGN = 'ha_sales_campaign';
const COOKIE_CHANNEL = 'ha_sales_channel';
const COOKIE_CONTENT = 'ha_sales_content';

const UTM_SOURCE = 'hilton-ahead-sales';

// ============================================================================
// UTM stamping
// ============================================================================

/**
 * Append Hilton Ahead sales UTM params to an outbound URL.
 *
 *   utm_source   = 'hilton-ahead-sales'  (constant — distinguishes from /local)
 *   utm_medium   = channel               ('email', 'linkedin', 'instagram', …)
 *   utm_campaign = campaignSlug          ('atlanta-golf-q1-2026', …)
 *   utm_content  = content (optional)    ('touch1', 'bio-link', 'comment-42', …)
 *
 * Server- and client-safe. Falls back to the unmodified URL on parse failure
 * so a malformed input never breaks the email render.
 */
export function withSalesUtm(
  url: string,
  campaignSlug: string,
  channel: SalesChannel | string,
  content?: string,
): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', UTM_SOURCE);
    u.searchParams.set('utm_medium', String(channel));
    u.searchParams.set('utm_campaign', campaignSlug);
    if (content) u.searchParams.set('utm_content', content);
    return u.toString();
  } catch {
    return url;
  }
}

// ============================================================================
// Cookie helpers (client only)
// ============================================================================

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');
  for (const raw of parts) {
    const c = raw.trim();
    if (c.startsWith(prefix)) {
      try {
        return decodeURIComponent(c.slice(prefix.length));
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

function writeCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; expires=${expires}` +
    `; path=/` +
    `; SameSite=Lax`;
}

/**
 * On the landing page, persist first-touch UTMs so a form submit days or weeks
 * later still credits the original campaign. Call this from a tiny client
 * component mounted in the root layout (or per-landing-page).
 *
 * First-touch wins: existing cookies are NOT overwritten.
 */
export function captureLandingAttribution(): void {
  if (typeof window === 'undefined') return;
  const sp = new URLSearchParams(window.location.search);
  const source = sp.get('utm_source');
  // Only capture if this looks like our outbound traffic.
  if (source !== UTM_SOURCE) return;

  const campaign = sp.get('utm_campaign');
  const channel = sp.get('utm_medium');
  const content = sp.get('utm_content');

  if (campaign && !readCookie(COOKIE_CAMPAIGN)) {
    writeCookie(COOKIE_CAMPAIGN, campaign, ATTRIBUTION_TTL_DAYS);
  }
  if (channel && !readCookie(COOKIE_CHANNEL)) {
    writeCookie(COOKIE_CHANNEL, channel, ATTRIBUTION_TTL_DAYS);
  }
  if (content && !readCookie(COOKIE_CONTENT)) {
    writeCookie(COOKIE_CONTENT, content, ATTRIBUTION_TTL_DAYS);
  }
}

export interface SalesAttribution {
  campaign?: string;
  channel?: string;
  content?: string;
}

/**
 * Read first-touch attribution previously persisted by captureLandingAttribution.
 * Browser only — returns an empty object on the server.
 */
export function parseAttributionFromCookies(): SalesAttribution {
  if (typeof document === 'undefined') return {};
  return {
    campaign: readCookie(COOKIE_CAMPAIGN),
    channel: readCookie(COOKIE_CHANNEL),
    content: readCookie(COOKIE_CONTENT),
  };
}

// ============================================================================
// Event tracking
// ============================================================================

export interface SalesEventPayload {
  prospectId: string;
  eventType: SalesTouchType | string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget event log from the browser.
 *
 * Uses navigator.sendBeacon when available so the request survives any page
 * navigation that follows. Silently no-ops on the server.
 */
export function trackSalesEvent(
  prospectId: string,
  eventType: SalesTouchType | string,
  metadata?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  if (!prospectId || !eventType) return;

  const payload: SalesEventPayload = { prospectId, eventType, metadata };
  const body = JSON.stringify(payload);

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.sendBeacon === 'function'
  ) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
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
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never block the user */
    });
  } catch {
    /* swallow */
  }
}
