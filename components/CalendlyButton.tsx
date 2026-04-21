'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

interface Props {
  /** Full Calendly event URL, e.g. https://calendly.com/hiltonahead/discovery */
  url: string;
  /** Button label. */
  children?: React.ReactNode;
  /** Visual variant. */
  variant?: 'primary' | 'outline' | 'link';
  className?: string;
  /**
   * Where to send the user after they successfully book a Calendly meeting.
   * Defaults to the itinerary page payment section so they can pay directly.
   * Pass `null` to disable the redirect entirely.
   */
  redirectAfterScheduled?: string | null;
}

/**
 * Calendly popup button.
 *
 * Loads the Calendly script lazily on first render (not on every page)
 * and opens a modal instead of navigating away. Zero render cost until
 * the user hovers or clicks.
 *
 * Usage:
 *   <CalendlyButton url="https://calendly.com/hiltonahead/discovery">
 *     Book a 20-min call
 *   </CalendlyButton>
 */
export default function CalendlyButton({
  url,
  children = 'Book a discovery call',
  variant = 'primary',
  className = '',
  redirectAfterScheduled = '/itinerary?from=calendly#payment',
}: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Defer script injection to first interaction to keep initial page fast.
    if (loaded) return;
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);

    // Also inject the stylesheet
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(l);

    return () => {
      s.remove();
      l.remove();
    };
  }, [loaded]);

  // Listen for Calendly's postMessage events. When a meeting is successfully
  // scheduled, redirect the visitor to the Stripe checkout section so they
  // can pay the itinerary or deposit fee while they\u2019re still warm.
  useEffect(() => {
    if (!redirectAfterScheduled) return;
    function handleMessage(e: MessageEvent) {
      // Only trust messages from Calendly's domain.
      const fromCalendly =
        typeof e.origin === 'string' && e.origin.includes('calendly.com');
      if (!fromCalendly) return;
      const payload = e.data as { event?: string } | undefined;
      if (payload?.event === 'calendly.event_scheduled') {
        // Small delay so the Calendly confirmation flashes before we redirect.
        window.setTimeout(() => {
          window.location.href = redirectAfterScheduled as string;
        }, 600);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [redirectAfterScheduled]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    } else {
      // Fallback if script hasn't loaded: open in new tab.
      window.open(url, '_blank');
    }
  }

  const styles =
    variant === 'primary'
      ? 'bg-ocean text-sand hover:bg-coral'
      : variant === 'outline'
        ? 'border border-ink text-ink hover:bg-ink hover:text-sand'
        : 'link-underline text-ink';

  const padding =
    variant === 'link' ? 'px-1 py-2' : 'px-6 py-3.5';

  const radius = variant === 'link' ? '' : 'rounded-full';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] transition ${styles} ${padding} ${radius} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </button>
  );
}
