'use client';

import { useEffect, useRef } from 'react';
import { trackPurchase } from '@/app/lib/analytics';

interface Props {
  sessionId: string;
  tier: string;
  value: number;
  currency?: string;
}

/**
 * Fires the GA4 `purchase` event once on mount. The session_id from Stripe
 * dedupes if the user lands on this page twice for the same checkout.
 *
 * Renders nothing.
 */
export default function PurchaseTracker({
  sessionId,
  tier,
  value,
  currency = 'USD',
}: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPurchase({
      transactionId: sessionId,
      tier,
      value,
      currency,
    });
  }, [sessionId, tier, value, currency]);

  return null;
}
