/**
 * Client-side analytics event helpers.
 *
 * gtag.js is loaded in app/layout.tsx; these wrappers fire conversion events
 * only when window.gtag is present (i.e. browser, post-hydration). All calls
 * are fire-and-forget — they never throw and never block the UI.
 *
 * After deploying, mark these event names as Conversions in the GA4 UI:
 *   Admin → Events → toggle "Mark as conversion"
 *
 *   - lead_submitted        (itinerary + business inquiry)
 *   - newsletter_signup
 *   - purchase              (Stripe checkout success)
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

export function trackLead(source: string, leadType: 'itinerary' | 'business_inquiry'): void {
  track('lead_submitted', {
    lead_source: source,
    lead_type: leadType,
  });
}

export function trackNewsletterSignup(source: string): void {
  track('newsletter_signup', {
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
