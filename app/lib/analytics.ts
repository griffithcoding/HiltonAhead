/**
 * Client-side analytics event helpers.
 *
 * gtag.js is loaded in app/layout.tsx; these wrappers fire conversion events
 * only when window.gtag is present (i.e. browser, post-hydration). All calls
 * are fire-and-forget — they never throw and never block the UI.
 *
 * Uses GA4 recommended event names so reports auto-populate without manual
 * key-event configuration:
 *
 *   - generate_lead   (itinerary + business inquiry submissions)
 *   - sign_up         (newsletter subscription)
 *   - purchase        (Stripe checkout success)
 *
 * Recommended events have built-in semantic meaning in GA4 — they appear in
 * the Lead Generation, Engagement, and Monetization reports respectively.
 * To also count them as conversions in the Key Events report, mark them in
 * Admin → Key events after they've fired at least once.
 */

type GtagFn = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function track(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, params);
  } catch {
    // analytics failures must never surface to the user
  }
}

export type TrackedLeadType =
  | 'itinerary'
  | 'business_inquiry'
  | 'relocation'
  | 'owner'
  | 'wedding';

export function trackLead(source: string, leadType: TrackedLeadType): void {
  track('generate_lead', {
    event_category: 'engagement',
    value: 1.0,
    lead_source: source,
    lead_type: leadType,
  });
}

export function trackNewsletterSignup(source: string): void {
  track('sign_up', {
    event_category: 'engagement',
    value: 1.0,
    method: 'newsletter',
    signup_source: source,
  });
}

export function trackPurchase(opts: {
  value: number;
  currency: string;
  transactionId: string;
  tier?: string;
}): void {
  track('purchase', {
    value: opts.value,
    currency: opts.currency,
    transaction_id: opts.transactionId,
    items: opts.tier
      ? [{ item_id: opts.tier, item_name: opts.tier, quantity: 1, price: opts.value }]
      : undefined,
  });
}
