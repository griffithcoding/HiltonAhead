'use client';

import { useState } from 'react';

interface BuyButtonProps {
  tierSlug: string;
  priceDisplay: string;
  checkoutReady: boolean;
  size?: 'sm' | 'lg';
}

/**
 * Buy button for info-product landing pages.
 *
 * - If STRIPE_PRICE_* env var is configured (checkoutReady=true): POSTs to
 *   /api/checkout, which returns a redirect to Stripe Checkout.
 * - If env var is missing (dev / pre-launch): shows a "coming soon" mailto.
 */
export default function BuyButton({
  tierSlug,
  priceDisplay,
  checkoutReady,
  size = 'lg',
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClass =
    size === 'lg'
      ? 'px-8 py-4 text-sm'
      : 'px-5 py-2.5 text-xs';

  async function handleBuy() {
    if (!checkoutReady) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierSlug }),
      });
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || 'Checkout unavailable. Please try again.');
        return;
      }
      // Some environments return JSON with a url instead of a redirect
      const data = await res.json().catch(() => ({}));
      if ((data as { url?: string }).url) {
        window.location.href = (data as { url: string }).url;
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!checkoutReady) {
    return (
      <a
        href={`mailto:hello@hiltonahead.com?subject=Itinerary Pack — ${encodeURIComponent(tierSlug)}`}
        className={`inline-flex items-center gap-2 rounded-full bg-ink font-bold uppercase tracking-widest text-sand shadow-md transition-all hover:bg-ocean ${sizeClass}`}
      >
        Request early access — {priceDisplay}
      </a>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full bg-coral font-bold uppercase tracking-widest text-sand shadow-md transition-all hover:bg-coral-deep disabled:opacity-60 ${sizeClass}`}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-sand/40 border-t-sand" />
            Redirecting…
          </>
        ) : (
          <>Buy now — {priceDisplay}</>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
