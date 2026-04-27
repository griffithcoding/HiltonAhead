'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { photos } from '@/data/photos';
import { TravelSeal, WaveLine } from '@/components/ui/Ornament';

/**
 * Island flyover — full-bleed cinematic drone clip with editorial overlay
 * graphics. Sits between Services and InsiderProof on the homepage.
 *
 * Behavior:
 *   - Video preloads "none" until IntersectionObserver fires.
 *   - Once intersecting, .load() + .play() (muted) so iOS autoplay works.
 *   - SVG flight path strokeDashoffset animates with scroll progress.
 *   - Numbered landmark "ticket" badges fade in sequentially with progress.
 *   - HDG / ALT readout cycles subtly with progress.
 *   - prefers-reduced-motion: video paused, path drawn fully, readout static.
 *
 * Footage convention:
 *   /public/footage/hilton-head-flyover.mp4   (H.264, ~3-5MB, 8-12s loop)
 *   /public/footage/hilton-head-flyover.webm  (optional)
 *
 * If the file is missing the poster image still renders — the section
 * degrades to "aerial photo with overlay graphics" gracefully.
 */

const WAYPOINTS = [
  { t: 0.10, label: 'Harbour Town · Lighthouse',  hdg: '047°' },
  { t: 0.30, label: 'Sea Pines · South Beach',    hdg: '058°' },
  { t: 0.52, label: 'Coligny · Forest Beach',     hdg: '067°' },
  { t: 0.74, label: 'Palmetto Dunes · 18th',      hdg: '081°' },
  { t: 0.92, label: 'Shelter Cove · Marina',      hdg: '102°' },
] as const;

// SVG overlay viewBox dimensions
const VB_W = 1600;
const VB_H = 900;

// Flight path — gentle S-curve from upper-left to lower-right
const FLIGHT_PATH_D =
  'M 60 250 C 320 180, 540 360, 760 410 S 1140 540, 1380 480 S 1540 600, 1560 660';

export default function IslandFlyover() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const lengthRef = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [videoReady, setVideoReady] = useState<boolean>(false);

  // Lazy-load + autoplay video when in view
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!reduced) {
              video.load();
              const tryPlay = () => {
                video.play().catch(() => {
                  /* iOS may reject; the poster still shows. */
                });
              };
              if (video.readyState >= 2) tryPlay();
              else video.addEventListener('loadeddata', tryPlay, { once: true });
              setVideoReady(true);
            }
            io.unobserve(section);
          }
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Scroll-driven flight path + waypoint progress
  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const length = path.getTotalLength();
    lengthRef.current = length;
    path.style.strokeDasharray = `${length}`;

    if (reduced) {
      path.style.strokeDashoffset = '0';
      // Defer to next frame so this setState isn't synchronous-in-effect.
      const id = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }

    path.style.strokeDashoffset = `${length}`;

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const startY = vh * 0.95;
      const endY = vh * 0.05;
      const total = section.offsetHeight + (startY - endY);
      const traveled = startY - rect.top;
      const p = Math.min(1, Math.max(0, traveled / Math.max(total, 1)));
      path.style.strokeDashoffset = `${length * (1 - p)}`;
      setProgress(p);
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
  }, []);

  // Active waypoint = the highest waypoint whose .t <= progress
  type Waypoint = (typeof WAYPOINTS)[number];
  const activeWp: Waypoint = (() => {
    let active: Waypoint = WAYPOINTS[0];
    for (const wp of WAYPOINTS) if (progress >= wp.t) active = wp;
    return active;
  })();

  // Cycle the heading number subtly between waypoints
  const hdgDisplay = activeWp.hdg;
  const altFt = 800 + Math.round(progress * 220); // 800 → 1020 ft

  return (
    <section
      ref={sectionRef}
      aria-label="Aerial flyover of Hilton Head Island"
      className="bleed flyover-stage relative mt-28 h-[78vh] min-h-[520px] overflow-hidden md:mt-36 md:h-[82vh] md:min-h-[640px]"
    >
      {/* Layer 0a: Poster image — always present, shows under video while loading */}
      <Image
        src={photos.coastalAerial.src}
        alt={photos.coastalAerial.alt}
        fill
        sizes="100vw"
        className="object-cover photo-warm"
        aria-hidden={videoReady}
      />

      {/* Layer 0b: Video, lazy-loaded */}
      <video
        ref={videoRef}
        className="flyover-video"
        playsInline
        muted
        loop
        autoPlay={false}
        preload="none"
        poster={photos.coastalAerial.src}
        aria-hidden="true"
      >
        <source src="/footage/hilton-head-flyover.webm" type="video/webm" />
        <source src="/footage/hilton-head-flyover.mp4" type="video/mp4" />
      </video>

      {/* Layer 1: Scrim */}
      <div className="flyover-scrim" />

      {/* Layer 2: SVG overlay — flight path, pings, compass corner */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="flyover-overlay"
        aria-hidden="true"
      >
        {/* Hatched grid lines for chart feel */}
        <g stroke="rgba(245,232,208,0.12)" strokeWidth="0.6">
          {Array.from({ length: 9 }).map((_, i) => {
            const y = i * 100;
            return <line key={`h-${i}`} x1="0" y1={y} x2={VB_W} y2={y} />;
          })}
          {Array.from({ length: 17 }).map((_, i) => {
            const x = i * 100;
            return <line key={`v-${i}`} x1={x} y1="0" x2={x} y2={VB_H} />;
          })}
        </g>

        {/* Dashed under-line guidance */}
        <path
          d={FLIGHT_PATH_D}
          stroke="rgba(255,122,92,0.30)"
          strokeWidth="2"
          strokeDasharray="2 8"
          fill="none"
        />

        {/* Animated flight path */}
        <path
          ref={pathRef}
          d={FLIGHT_PATH_D}
          stroke="#FF7A5C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Waypoint pings + labels */}
        {WAYPOINTS.map((wp, i) => {
          const reached = progress >= wp.t;
          // Sample the path point at parameter wp.t — approximate by
          // pre-computed positions for layout. We re-derive via path API
          // on first render using getPointAtLength on a fresh ref isn't
          // available here without a re-render; instead, hard-code positions
          // taken from the path: matching the cubic in FLIGHT_PATH_D.
          // (Empirical samples for the 5 t values).
          const samples: [number, number][] = [
            [195, 246],   // 0.10
            [490, 320],   // 0.30
            [800, 415],   // 0.52
            [1180, 502],  // 0.74
            [1490, 580],  // 0.92
          ];
          const [x, y] = samples[i] ?? [0, 0];
          return (
            <g
              key={i}
              opacity={reached ? 1 : 0.28}
              style={{ transition: 'opacity 0.6s ease' }}
            >
              <circle
                cx={x}
                cy={y}
                r="22"
                fill="rgba(255,122,92,0.18)"
                className={reached ? 'flyover-ping' : ''}
              />
              <circle cx={x} cy={y} r="9" fill="#FF7A5C" stroke="#F5E8D0" strokeWidth="2" />
              <text
                x={x}
                y={y + 3.5}
                fontSize="11"
                fontWeight="700"
                fill="#F5E8D0"
                textAnchor="middle"
                fontFamily="var(--font-sans), sans-serif"
              >
                {i + 1}
              </text>
              {/* Label callout */}
              <g
                transform={`translate(${x + (i % 2 === 0 ? 18 : -18)}, ${y - 36})`}
                opacity={reached ? 1 : 0}
                style={{ transition: 'opacity 0.5s ease 0.1s' }}
              >
                <rect
                  x={i % 2 === 0 ? 0 : -260}
                  y="-22"
                  width="260"
                  height="32"
                  rx="2"
                  fill="rgba(10,41,48,0.85)"
                  stroke="#F5E8D0"
                  strokeWidth="1"
                />
                <text
                  x={i % 2 === 0 ? 14 : -246}
                  y="-2"
                  fontSize="14"
                  fill="#F5E8D0"
                  fontFamily="var(--font-sans), sans-serif"
                  letterSpacing="0.08em"
                  fontWeight="600"
                >
                  {wp.label.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Layer 3a: Top-right compass + seal cluster */}
      <div className="absolute right-5 top-6 hidden text-sand md:right-10 md:top-10 md:block">
        <TravelSeal
          size={130}
          topText="AERIAL SURVEY · HHI"
          bottomText="· 32.21° N · 80.75° W ·"
          motif="compass"
        />
      </div>

      {/* Layer 3b: Bottom-left HUD readout */}
      <div className="absolute bottom-6 left-5 z-[3] flex items-center gap-5 md:bottom-10 md:left-10">
        <span className="flyover-readout">
          HDG <span className="text-coral">{hdgDisplay}</span>
        </span>
        <span className="h-px w-6 bg-sand/40" />
        <span className="flyover-readout">
          ALT <span className="text-coral">{altFt} FT</span>
        </span>
        <span className="h-px w-6 bg-sand/40" />
        <span className="flyover-readout hidden md:inline">
          LOOP <span className="text-coral">{Math.min(99, Math.floor(progress * 100))}%</span>
        </span>
      </div>

      {/* Layer 3c: Editorial headline overlay */}
      <div className="absolute inset-x-0 bottom-0 z-[3] mx-auto flex max-w-[1280px] flex-col items-start justify-end px-5 pb-24 text-sand md:pb-32">
        <div className="text-sand/65">
          <WaveLine width={120} />
        </div>
        <h2 className="display mt-5 max-w-[820px] text-balance text-[34px] leading-[1.04] tracking-[-0.025em] text-sand sm:text-[44px] md:text-[64px] lg:text-[80px]">
          Twelve miles of island,{' '}
          <span className="display-italic text-gold">one aerial pass.</span>
        </h2>
        <p className="mt-5 max-w-[520px] text-[14px] leading-[1.7] text-sand/85 md:text-[16px]">
          From Harbour Town to Port Royal Sound, every villa we book and every
          tee time we hold. Scroll the line.
        </p>
      </div>
    </section>
  );
}
