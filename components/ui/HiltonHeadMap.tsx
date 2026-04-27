'use client';

import { useEffect, useRef } from 'react';

export type RoutePoint = {
  /** Normalized 0-1 coordinates within the map viewBox. */
  coords: [number, number];
  label: string;
  time?: string;
};

interface HiltonHeadMapProps {
  /** Ordered route — pins are numbered in this order, path connects them. */
  route: RoutePoint[];
  /** Tone matches the surrounding chapter background. */
  tone?: 'sand' | 'ink';
  className?: string;
  /** Show decorative compass rose. Default true. */
  showCompass?: boolean;
  /** Show ocean wave hatching. Default true. */
  showWaves?: boolean;
}

const VB_W = 1000;
const VB_H = 1100;

/**
 * Stylized illustrated map of Hilton Head Island. Hand-tuned silhouette
 * (recognizable, not topographically literal) with Calibogue Sound to the
 * west, Port Royal Sound to the north, the Atlantic to the east, and
 * Broad Creek slicing east-to-west across the middle.
 *
 * Renders the route as a path that draws itself on scroll progress through
 * the wrapper. Numbered pins land on each waypoint with label callouts.
 *
 * Reduced motion users see the path fully drawn instantly.
 */
export default function HiltonHeadMap({
  route,
  tone = 'ink',
  className = '',
  showCompass = true,
  showWaves = true,
}: HiltonHeadMapProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    if (reduced) {
      path.style.strokeDashoffset = '0';
      return;
    }

    path.style.strokeDashoffset = `${length}`;

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const startY = vh * 0.95;
      const endY = vh * 0.15;
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
  }, [route]);

  // Convert normalized coords → SVG units
  const points = route.map(
    (r) => [r.coords[0] * VB_W, r.coords[1] * VB_H] as [number, number],
  );

  // Smooth route path: chain quadratic curves with a perpendicular offset
  // so the line feels like a flight path rather than zig-zag.
  const routeD = points.length
    ? points
        .map(([x, y], i) => {
          if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
          const [px, py] = points[i - 1];
          const mx = (px + x) / 2;
          const my = (py + y) / 2;
          const dx = x - px;
          const dy = y - py;
          const norm = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = norm * 0.07 * (i % 2 === 0 ? 1 : -1);
          const cx = mx + (-dy / norm) * offset;
          const cy = my + (dx / norm) * offset;
          return `Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ')
    : '';

  // Tone palette
  const stroke = tone === 'sand' ? '#F5E8D0' : '#0A4B55';
  const ink = tone === 'sand' ? '#F5E8D0' : '#0A2930';
  const accent = '#FF7A5C';
  const land = tone === 'sand' ? 'rgba(245, 232, 208, 0.05)' : 'rgba(143, 195, 200, 0.18)';
  const water = tone === 'sand' ? 'transparent' : 'rgba(143, 195, 200, 0.10)';

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="Illustrated map of Hilton Head Island showing the trip route"
      >
        {/* Water field */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill={water} />

        {/* Atlantic wave hatching, east side */}
        {showWaves && (
          <g stroke={stroke} strokeWidth="1" opacity="0.18" fill="none">
            {Array.from({ length: 9 }).map((_, i) => {
              const y = 100 + i * 110;
              return (
                <path
                  key={i}
                  d={`M 760 ${y} q 25 -12, 50 0 t 50 0 t 50 0 t 50 0`}
                />
              );
            })}
          </g>
        )}

        {/* Calibogue Sound subtle hatching, west side */}
        {showWaves && (
          <g stroke={stroke} strokeWidth="1" opacity="0.12" fill="none">
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 540 + i * 70;
              return (
                <path key={i} d={`M 30 ${y} q 18 -8, 36 0 t 36 0`} />
              );
            })}
          </g>
        )}

        {/* Island silhouette */}
        <path
          d="
            M 520 50
            C 600 65, 670 140, 695 240
            C 715 340, 720 440, 700 540
            C 685 620, 645 700, 590 760
            C 540 810, 480 845, 410 870
            C 340 890, 280 895, 220 875
            C 165 855, 130 815, 115 765
            C 100 700, 110 645, 145 605
            C 180 565, 230 545, 270 530
            C 305 515, 320 480, 305 440
            C 295 400, 280 360, 290 310
            C 305 250, 340 180, 400 120
            C 440 80, 480 55, 520 50
            Z
          "
          fill={land}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Broad Creek inlet — a curving slice cutting from west into mid-island */}
        <path
          d="M 145 605 C 250 580, 380 560, 460 530 C 510 515, 540 510, 560 540"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Skull Creek inlet on the northwest */}
        <path
          d="M 305 440 C 280 410, 270 360, 290 310"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Geographic labels */}
        <g
          fill={ink}
          fontFamily="var(--font-display), Times New Roman, serif"
          fontStyle="italic"
          opacity="0.55"
        >
          <text x="80" y="380" fontSize="22">Calibogue Sound</text>
          <text x="370" y="80" fontSize="22">Port Royal Sound</text>
          <text x="800" y="430" fontSize="26">Atlantic Ocean</text>
        </g>

        {/* Route — dashed under-line */}
        <path
          d={routeD}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeDasharray="2 8"
          strokeLinecap="round"
          opacity="0.30"
        />

        {/* Route — animated stroke */}
        <path
          ref={pathRef}
          d={routeD}
          fill="none"
          stroke={accent}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pins */}
        {points.map(([x, y], i) => {
          const labelOffsetX = x > VB_W * 0.55 ? 18 : -18;
          const anchor = x > VB_W * 0.55 ? 'start' : 'end';
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill={accent} opacity="0.18" />
              <circle cx={x} cy={y} r="7" fill={accent} stroke={stroke} strokeWidth="2" />
              <text
                x={x}
                y={y + 3}
                fontSize="10"
                fontWeight="700"
                fill="#F5E8D0"
                textAnchor="middle"
                fontFamily="var(--font-sans), Helvetica, sans-serif"
              >
                {i + 1}
              </text>
              <text
                x={x + labelOffsetX}
                y={y - 14}
                fontSize="14"
                fontWeight="600"
                fill={ink}
                textAnchor={anchor}
                fontFamily="var(--font-sans), Helvetica, sans-serif"
                letterSpacing="0.08em"
              >
                {route[i].label.toUpperCase()}
              </text>
              {route[i].time && (
                <text
                  x={x + labelOffsetX}
                  y={y + 2}
                  fontSize="11"
                  fill={ink}
                  opacity="0.6"
                  textAnchor={anchor}
                  fontFamily="var(--font-display), Times, serif"
                  fontStyle="italic"
                >
                  {route[i].time}
                </text>
              )}
            </g>
          );
        })}

        {/* Compass rose decoration, top-right */}
        {showCompass && (
          <g transform={`translate(${VB_W - 110}, 110)`} opacity="0.65">
            <circle r="42" fill="none" stroke={stroke} strokeWidth="1" />
            <circle r="32" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.6" />
            <path d="M 0 -38 L 4 0 L 0 38 L -4 0 Z" fill={stroke} />
            <path d="M -38 0 L 0 -3 L 38 0 L 0 3 Z" fill={stroke} opacity="0.5" />
            <text
              x="0"
              y="-50"
              textAnchor="middle"
              fill={ink}
              fontFamily="var(--font-sans), Helvetica, sans-serif"
              fontSize="12"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              N
            </text>
          </g>
        )}

        {/* Latitude/longitude marker, bottom-left */}
        <text
          x="40"
          y={VB_H - 30}
          fontSize="11"
          fill={ink}
          opacity="0.45"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          letterSpacing="0.18em"
        >
          32.21° N · 80.75° W
        </text>
      </svg>
    </div>
  );
}
