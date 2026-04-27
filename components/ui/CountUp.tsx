'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Final numeric target. */
  value: number;
  /** Optional suffix appended after the number (e.g. '+', 'mi', 'pp'). */
  suffix?: string;
  /** Optional prefix prepended before the number (e.g. '$'). */
  prefix?: string;
  /** Decimal places to render. Defaults to 0. */
  decimals?: number;
  /** Total animation duration in ms. Defaults to 1400. */
  duration?: number;
  /** Renders className on the inner span. */
  className?: string;
  /** Locale string format (default 'en-US'). */
  locale?: string;
}

/**
 * Number that animates 0 → target when scrolled into view. Uses
 * requestAnimationFrame with eased timing. Locale-formatted output.
 * Respects prefers-reduced-motion (renders the final value immediately).
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1400,
  className = '',
  locale = 'en-US',
}: CountUpProps) {
  const [display, setDisplay] = useState<number>(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Defer to next frame so this setState isn't synchronous-in-effect.
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) rafRef.current = requestAnimationFrame(tick);
              else setDisplay(value);
            };
            rafRef.current = requestAnimationFrame(tick);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
