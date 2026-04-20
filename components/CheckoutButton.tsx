'use client';

import { useState } from 'react';

type ProductKey =
  | 'itinerary_fee'
  | 'trip_deposit_500'
  | 'group_retainer_2500'
  | 'discovery_fee';

interface Props {
  product: ProductKey;
  children?: React.ReactNode;
  className?: string;
  /** Optional prefill email for the Stripe Checkout customer. */
  email?: string;
  /** Optional free-form reference (e.g. itinerary request ID). */
  reference?: string;
  variant?: 'primary' | 'outline';
}

/**
 * Pay button — creates a Stripe Checkout Session via /api/checkout
 * and redirects the browser to the hosted Stripe Checkout page.
 */
export default function CheckoutButton({
  product,
  children = 'Pay online',
  className = '',
  email,
  reference,
  variant = 'primary',
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, email, reference }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error || 'Could not start checkout.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  const styles =
    variant === 'primary'
      ? 'bg-ocean text-sand hover:bg-coral'
      : 'border border-ink text-ink hover:bg-ink hover:text-sand';

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
      >
        {submitting ? 'Redirecting…' : children}
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </button>
      {error && (
        <div className="text-[11px] text-coral" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
