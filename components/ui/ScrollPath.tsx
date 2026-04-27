'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollPathProps {
  /** SVG `d` path string. */
  d: string;
  /** SVG viewBox (e.g. "0 0 800 600"). */
  viewBox: string;
  /** Stroke color (CSS variable / value). Defaults to currentColor. */
  stroke?: string;
  /** Stroke width. */
  strokeWidth?: number;
  /** Optional dash pattern for the underlying static guideline. */
  dashed?: boolean;
  /** Children rendered alongside the path inside the same SVG (e.g. pins). */
  children?: ReactNode;
  /** Optional className on the wrapping div (which is the scroll target). */
  className?: string;
  /** When the bottom of the wrapper passes this fraction of the viewport,
   *  progress reaches 1.0. Default 0.85 (85% from top). */
  endAtViewportFrac?: number;
  /** When the top of the wrapper hits this fraction of the viewport,
   *  progress starts. Default 0.95 (95% from top, i.e. nearly bottom). */
  startAtViewportFrac?: number;
}

/**
 * SVG path that draws itself based on scroll progress through its
 * containing wrapper. Useful for "the route" lines on storied pages
 * and the homepage flyover flight path. Respects prefers-reduced-motion
 * (the path is fully drawn instantly).
 */
export default function ScrollPath({
  d,
  viewBox,
  stroke = 'currentColor',
  strokeWidth = 2,
  dashed = false,
  children,
  className = '',
  endAtViewportFrac = 0.85,
  startAtViewportFrac = 0.95,
}: ScrollPathProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const lengthRef = useRef<number>(0);
  const reducedRef = useRef<boolean>(false);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const length = path.getTotalLength();
    lengthRef.current = length;

    if (reducedRef.current) {
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = '0';
      return;
    }

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const startY = vh * startAtViewportFrac;
      const endY = vh * endAtViewportFrac;
      // Map: when wrap.top moves from startY → endY, progress 0 → 1.
      // But also extend past the wrapper's bottom by mapping rect.bottom too.
      const total = wrap.offsetHeight + (startY - endY);
      const traveled = startY - rect.top;
      const progress = Math.min(1, Math.max(0, traveled / Math.max(total, 1)));
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [endAtViewportFrac, startAtViewportFrac]);

  return (
    <div ref={wrapRef} className={className}>
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        aria-hidden="true"
      >
        {dashed && (
          <path
            d={d}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray="2 6"
            strokeLinecap="round"
            opacity="0.18"
            fill="none"
          />
        )}
        <path
          ref={pathRef}
          d={d}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {children}
      </svg>
    </div>
  );
}
