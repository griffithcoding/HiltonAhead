/**
 * Hand-tuned SVG map of Hilton Head + Bluffton golf.
 *
 * Server component. No external map vendor — a stylized illustration of
 * the island with `mapPos` from data/golfCourses.ts placing 12 numbered
 * pins. Below the map, a short list mirrors each pin so the data is
 * accessible without hovering, and so the schema can pick up names.
 *
 * For an interactive Mapbox/Leaflet upgrade later, swap this component
 * out — the data shape is stable.
 */

import { golfCourses } from '@/data/golfCourses';

export default function CourseMap() {
  return (
    <section className="not-prose my-12 overflow-hidden rounded-md border border-ocean-deep/20 bg-cream-deep/30">
      <header className="border-b border-ocean-deep/15 px-5 py-4 md:px-7 md:py-5">
        <div className="eyebrow text-coral">The 12 courses · at a glance</div>
        <h3 className="display mt-1.5 text-[20px] leading-[1.2] text-ink md:text-[24px]">
          Where each course sits on the island.
        </h3>
      </header>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-ocean-light/35">
          <svg
            viewBox="0 0 100 80"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Stylized map of Hilton Head Island and Bluffton with 12 golf courses pinned"
            className="h-full w-full"
          >
            {/* Water — subtle gradient base */}
            <defs>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(184, 224, 233)" />
                <stop offset="100%" stopColor="rgb(146, 196, 209)" />
              </linearGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(228, 222, 198)" />
                <stop offset="100%" stopColor="rgb(213, 207, 178)" />
              </linearGradient>
              <pattern id="heritage-zone" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="rgb(213, 207, 178)" />
                <path d="M0 6L6 0" stroke="rgba(178, 34, 52, 0.22)" strokeWidth="0.6" />
                <path d="M0 0L6 6" stroke="rgba(11, 42, 53, 0.16)" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="80" fill="url(#water)" />

            {/* Mainland (Bluffton + north) — rough shape */}
            <path
              d="M 0 12 L 26 8 L 38 14 L 30 24 L 16 28 L 0 26 Z"
              fill="url(#land)"
              stroke="rgba(11, 42, 53, 0.18)"
              strokeWidth="0.3"
            />

            {/* Bluffton landmass */}
            <path
              d="M 0 18 L 14 22 L 12 38 L 0 36 Z"
              fill="url(#land)"
              stroke="rgba(11, 42, 53, 0.18)"
              strokeWidth="0.3"
            />

            {/* Hilton Head Island (foot/boot shape) */}
            <path
              d="M 30 18 C 36 14, 50 12, 58 16
                 C 70 20, 78 28, 72 38
                 C 68 46, 70 56, 64 62
                 C 56 70, 42 76, 30 74
                 C 22 72, 18 64, 22 56
                 C 24 48, 24 38, 28 30 Z"
              fill="url(#land)"
              stroke="rgba(11, 42, 53, 0.22)"
              strokeWidth="0.4"
            />

            {/* Sea Pines = Heritage Country — tartan-tinted overlay */}
            <path
              d="M 22 56 C 24 52, 26 50, 30 50
                 L 38 58 C 36 64, 30 70, 24 70
                 C 20 68, 19 62, 22 56 Z"
              fill="url(#heritage-zone)"
              stroke="rgba(178, 34, 52, 0.45)"
              strokeWidth="0.4"
              strokeDasharray="0.8 0.8"
            />
            <text
              x="26"
              y="63"
              fontSize="2.2"
              fontWeight="600"
              fill="rgba(11, 42, 53, 0.7)"
              textAnchor="middle"
              fontFamily="'Instrument Sans', sans-serif"
              letterSpacing="0.1"
            >
              HERITAGE
            </text>

            {/* Course pins */}
            {golfCourses.map((c, i) => (
              <g key={c.slug} transform={`translate(${c.mapPos.x} ${c.mapPos.y})`}>
                <circle
                  r="2.4"
                  fill={c.heritageVenue ? 'rgb(178, 34, 52)' : c.tier === 'S' ? 'rgb(184, 134, 11)' : c.tier === 'A' ? 'rgb(11, 42, 53)' : 'rgb(11, 42, 53)'}
                  fillOpacity={c.tier === 'B' ? 0.55 : 1}
                  stroke="rgb(248, 244, 232)"
                  strokeWidth="0.5"
                />
                <text
                  x="0"
                  y="0.7"
                  fontSize="1.9"
                  fontWeight="700"
                  fill="rgb(248, 244, 232)"
                  textAnchor="middle"
                  fontFamily="'Instrument Sans', sans-serif"
                >
                  {i + 1}
                </text>
              </g>
            ))}

            {/* Compass rose (decorative) */}
            <g transform="translate(92 70)" opacity="0.6">
              <circle r="3" fill="none" stroke="rgba(11, 42, 53, 0.4)" strokeWidth="0.3" />
              <path d="M0 -3 L0.6 0 L0 3 L-0.6 0 Z" fill="rgba(11, 42, 53, 0.55)" />
              <text x="0" y="-3.6" fontSize="1.4" fill="rgba(11, 42, 53, 0.65)" textAnchor="middle">N</text>
            </g>
          </svg>
        </div>

        <ol className="divide-y divide-ocean-deep/12 max-h-[480px] overflow-y-auto">
          {golfCourses.map((c, i) => (
            <li key={c.slug} className="flex gap-3 px-5 py-3 md:px-6">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-cream ${
                  c.heritageVenue
                    ? 'bg-coral'
                    : c.tier === 'S'
                      ? 'bg-gold'
                      : 'bg-ink/85'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[13.5px] font-medium leading-[1.25] text-ink">
                    {c.shortName}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
                    {c.location}
                  </span>
                </div>
                <p className="text-[11.5px] uppercase tracking-[0.12em] text-ink-soft">
                  {c.designer} · ${c.peakFeeUsd} · {c.tier}-tier
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
