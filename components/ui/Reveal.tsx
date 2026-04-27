'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Slide direction on reveal. Defaults to 'up'. */
  direction?: Direction;
  /** Delay (ms) after intersection before the reveal animates. */
  delay?: number;
  /** Travel distance (px) for the slide portion. */
  distance?: number;
  /** Once true, the element won't re-hide if scrolled out. Defaults true. */
  once?: boolean;
  /** Pixels of root margin (negative = trigger earlier). */
  rootMargin?: string;
  className?: string;
  /** Render `as` element (default `div`). */
  as?: 'div' | 'section' | 'article' | 'figure' | 'span' | 'li' | 'header' | 'aside';
}

/**
 * Wrap any element with reveal-on-scroll behavior. Sets `data-revealed`
 * once the wrapper enters the viewport; CSS in globals.css animates the
 * pre-revealed → revealed transition. Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 24,
  once = true,
  rootMargin = '0px 0px -10% 0px',
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute('data-revealed', 'true');
            if (once) io.unobserve(el);
          } else if (!once) {
            el.setAttribute('data-revealed', 'false');
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  const style: CSSProperties = {
    '--reveal-distance': `${distance}px`,
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      data-revealed="false"
      data-reveal-direction={direction}
      style={style}
      className={`reveal-root ${className}`}
    >
      {children}
    </Tag>
  );
}
