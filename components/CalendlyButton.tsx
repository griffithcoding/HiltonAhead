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
