'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { photos } from '@/data/photos';
import { WaveLine } from '@/components/ui/Ornament';

/**
 * Island flyover — full-bleed cinematic drone clip with a 5-stop guided tour.
 *
 * Behavior:
 *   - Video preloads "none" until IntersectionObserver fires, then autoplays muted on loop.
 *   - Orange flight path is drawn blurred at low opacity by default. As the section
 *     scrolls through the viewport, segments resolve to crisp at five waypoints
 *     (t = 0.10, 0.30, 0.52, 0.74, 0.92).
 *   - As the video plays, the line auto-advances through the 5 stops in sync
 *     with the current cue (timeupdate driven). On every video loop, the line
 *     restarts and marches through again.
 *   - Numbered waypoint bubbles (1–5) are clickable: a click seeks the looping
 *     montage to that location's cue, glows the line, and toggles a small chip
 *     showing the location name. A second click on the active bubble dismisses
 *     the chip and ends the highlighted state.
 *   - prefers-reduced-motion: video paused, full path drawn crisp on mount.
 *
 * Footage convention:
 *   /public/footage/hilton-head-flyover.mp4   (~30s aerial montage)
 *   /public/footage/hilton-head-flyover.webm  (optional)
 *
 * Cue times below assume an evenly-spaced 30s montage. Tweak per shot if needed.
 */

type Waypoint = {
  /** Position along FLIGHT_PATH_D, 0–1. Bubble pixel positions are computed
   *  at runtime via getPointAtLength so they always sit ON the rendered line. */
  t: number;
  /** Short label shown in the small click-toggle chip. */
  label: string;
  /** Seconds offset in the looping montage to seek to when clicked.
   *  Shot mid-points for the 6-clip / 30s montage documented in
   *  /public/footage/README.md (5.5s segments + 0.6s crossfades). */
  cue: number;
};

// Five shot-level chapters in playback order. The 6-clip montage has two
// generic "Hilton Head" Skaggs shots; we surface clips 1, 2, 3, 5, 6 as the
// five visual chapters and skip clip 4 (a duplicate generic coastline).
const WAYPOINTS: ReadonlyArray<Waypoint> = [
  { t: 0.10, label: 'Atlantic Beachfront',  cue: 2.5  }, // clip 1 mid
  { t: 0.30, label: 'Marsh & Boardwalk',    cue: 7.7  }, // clip 2 mid
  { t: 0.52, label: 'Resort Fairways',      cue: 12.5 }, // clip 3 mid
  { t: 0.74, label: 'Coastal Resort',       cue: 22.5 }, // clip 5 mid
  { t: 0.92, label: 'Open Coastline',       cue: 27.5 }, // clip 6 mid
];

// SVG viewBox
const VB_W = 1600;
const VB_H = 900;

// Flight path (desktop) — gentle S-curve from upper-left to lower-right.
// Calibrated to the wide aerial crop visible on landscape / desktop viewports.
const FLIGHT_PATH_DESKTOP =
  'M 60 250 C 320 180, 540 360, 760 410 S 1140 540, 1380 480 S 1540 600, 1560 660';

// Flight path (mobile) — vertical S-curve confined to the center column.
// On portrait phones the SVG (preserveAspectRatio="xMidYMid slice") only
// reveals roughly x ∈ [520, 1080] of the viewBox, so the desktop path's
// outer waypoints fall off-screen. This path stays inside that visible
// strip and runs more vertically so all 5 stops remain on canvas.
const FLIGHT_PATH_MOBILE =
  'M 600 180 C 720 300, 980 360, 760 500 S 1020 720, 780 840';

export default function IslandFlyover() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const [stepPositions, setStepPositions] = useState<ReadonlyArray<readonly [number, number]>>([]);
  const [stepIdx, setStepIdx] = useState<number>(-1);              // scroll-driven, -1 = none reached
  const [playingIdx, setPlayingIdx] = useState<number>(-1);        // tracks video.currentTime
  const [activeIdx, setActiveIdx] = useState<number | null>(null); // user-clicked bubble (chip toggle)
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Pick the path geometry that fits the current viewport. Default false on
  // SSR / first render → desktop path; matchMedia flips it after mount with
  // no hydration mismatch.
  const FLIGHT_PATH_D = isMobile ? FLIGHT_PATH_MOBILE : FLIGHT_PATH_DESKTOP;

  // Track the mobile breakpoint so we can swap the flight path. 767px keeps
  // it aligned with Tailwind's `md:` boundary used elsewhere in this file.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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

  // Measure the path's total length and sample each waypoint's exact
  // position on the curve. Using getPointAtLength keeps bubbles ON the
  // line regardless of viewBox tweaks or path edits.
  // Dep on FLIGHT_PATH_D so positions recompute when the mobile/desktop
  // path swaps at the breakpoint.
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    setPathLength(len);
    const positions = WAYPOINTS.map((wp) => {
      const pt = p.getPointAtLength(len * wp.t);
      return [pt.x, pt.y] as [number, number];
    });
    setStepPositions(positions);
  }, [FLIGHT_PATH_D]);

  // Auto-advance: track video playback so the line marches forward through
  // the 5 stops on its own loop. Click overrides simply seek the video; this
  // listener picks the new position up.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      const t = v.currentTime;
      let idx = -1;
      for (let i = 0; i < WAYPOINTS.length; i++) {
        if (t >= WAYPOINTS[i].cue) idx = i;
      }
      setPlayingIdx(idx);
    };
    v.addEventListener('timeupdate', sync);
    v.addEventListener('seeked', sync);
    v.addEventListener('play', sync);
    return () => {
      v.removeEventListener('timeupdate', sync);
      v.removeEventListener('seeked', sync);
      v.removeEventListener('play', sync);
    };
  }, []);

  // Scroll-driven step progression
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setStepIdx(WAYPOINTS.length - 1);
      return;
    }

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

      let idx = -1;
      for (let i = 0; i < WAYPOINTS.length; i++) {
        if (p >= WAYPOINTS[i].t) idx = i;
      }
      setStepIdx(idx);
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

  const handleBubbleClick = (i: number) => {
    const next = activeIdx === i ? null : i;
    setActiveIdx(next);
    if (next !== null) {
      const v = videoRef.current;
      if (v) {
        try {
          v.currentTime = WAYPOINTS[next].cue;
        } catch {
          /* seekable range may not yet cover cue if video is mid-load */
        }
        v.play().catch(() => {});
      }
    }
  };

  const handleBubbleKeyDown = (e: React.KeyboardEvent<SVGGElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBubbleClick(i);
    }
  };

  // Reveal up to whichever step is furthest along — scroll progress, current
  // video time (auto-loop), or the user's last clicked bubble. Each loop of
  // the video resets playingIdx so the line restarts the journey.
  const effectiveIdx = Math.max(stepIdx, playingIdx, activeIdx ?? -1);
  const reachedT = effectiveIdx >= 0 ? WAYPOINTS[effectiveIdx].t : 0;
  const dashOffset = pathLength > 0 ? pathLength * (1 - reachedT) : undefined;

  return (
    <section
      ref={sectionRef}
      aria-label="Aerial flyover of Hilton Head Island"
      className="bleed flyover-stage relative mt-28 h-[82vh] min-h-[560px] overflow-hidden md:mt-36 md:h-[82vh] md:min-h-[640px]"
    >
      <Image
        src={photos.coastalAerial.src}
        alt={photos.coastalAerial.alt}
        fill
        sizes="100vw"
        className="object-cover photo-warm"
        aria-hidden={videoReady}
      />

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

      <div className="flyover-scrim" />

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="flyover-overlay"
      >
        <defs>
          <filter id="flyover-blur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="flyover-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blurred baseline — the full journey, hazy and dim */}
        <path
          d={FLIGHT_PATH_D}
          stroke="#FF7A5C"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
          filter="url(#flyover-blur)"
        />

        {/* Crisp progress — strokeDashoffset reveals up to the effective step */}
        <path
          ref={pathRef}
          d={FLIGHT_PATH_D}
          stroke="#FF7A5C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter={activeIdx !== null ? 'url(#flyover-glow)' : undefined}
          style={{
            strokeDasharray: pathLength || undefined,
            strokeDashoffset: dashOffset,
            transition:
              'stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease',
          }}
        />

        {/* Numbered waypoint bubbles + chip labels.
            Don't render until path positions are measured — otherwise the
            bubbles flash at (0,0) before useEffect fires. */}
        {stepPositions.length === WAYPOINTS.length && WAYPOINTS.map((wp, i) => {
          const reached = i <= effectiveIdx;
          const isActive = i === activeIdx;
          const [x, y] = stepPositions[i];

          // Chip dimensions — small rounded pill, fully rounded ends.
          // Roughly 30% the visual mass of the original 260×32 pill while
          // still fitting the full compound label (e.g., "HARBOUR TOWN ·
          // LIGHTHOUSE"). Per-character estimate at 8px Inter-ish font.
          const chipText = wp.label.toUpperCase();
          const chipFs = 8;
          const chipH = 16;
          const chipW = chipText.length * (chipFs * 0.62) + 16;
          // Position chip just above & to the right of the bubble
          const chipDx = 22;
          const chipDy = -22;

          return (
            <g
              key={i}
              opacity={reached ? 1 : 0.32}
              style={{ transition: 'opacity 0.6s ease' }}
            >
              {/* Hit target: invisible bigger circle for easy clicking */}
              <g
                role="button"
                tabIndex={0}
                aria-label={`Show ${wp.label} on the flyover`}
                aria-pressed={isActive}
                onClick={() => handleBubbleClick(i)}
                onKeyDown={(e) => handleBubbleKeyDown(e, i)}
                // pointerEvents:auto re-enables clicks here; the parent svg
                // sets pointer-events:none so the editorial heading underneath
                // stays interactive.
                style={{ cursor: 'pointer', outline: 'none', pointerEvents: 'auto' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="28"
                  fill="rgba(255,122,92,0.18)"
                  className={reached ? 'flyover-ping' : ''}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="13"
                  fill="#FF7A5C"
                  stroke="#F5E8D0"
                  strokeWidth="2"
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0 0 6px rgba(255,122,92,0.9))'
                      : undefined,
                    transition: 'filter 0.3s ease',
                  }}
                />
                <text
                  x={x}
                  y={y + 4}
                  fontSize="13"
                  fontWeight="700"
                  fill="#F5E8D0"
                  textAnchor="middle"
                  fontFamily="var(--font-sans), sans-serif"
                  pointerEvents="none"
                >
                  {i + 1}
                </text>
              </g>

              {/* Toggleable chip — only renders for the active bubble */}
              <g
                transform={`translate(${x + chipDx}, ${y + chipDy})`}
                opacity={isActive ? 1 : 0}
                style={{
                  transition: 'opacity 0.3s ease',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                aria-hidden={!isActive}
              >
                <rect
                  x={0}
                  y={-chipH / 2}
                  width={chipW}
                  height={chipH}
                  rx={chipH / 2}
                  fill="rgba(10,41,48,0.92)"
                  stroke="#F5E8D0"
                  strokeWidth="1"
                />
                <text
                  x={chipW / 2}
                  y={chipFs / 2 - 1}
                  fontSize={chipFs}
                  fontWeight="600"
                  fill="#F5E8D0"
                  textAnchor="middle"
                  letterSpacing="0.08em"
                  fontFamily="var(--font-sans), sans-serif"
                >
                  {chipText}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/*
        pointer-events-none lets clicks fall through to the SVG bubbles in the
        layer below — the heading has no interactive children, so this is safe.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] mx-auto flex max-w-[1280px] flex-col items-center justify-start px-5 pt-12 text-center text-white md:pt-16"
        style={{ textShadow: '0 2px 18px rgba(10, 41, 48, 0.55)' }}
      >
        <div className="text-white/70">
          <WaveLine width={96} />
        </div>
        <h2 className="display mt-3 max-w-[760px] text-balance text-[26px] leading-[1.05] tracking-[-0.025em] !text-white sm:text-[34px] md:text-[48px] lg:text-[60px]">
          Twelve miles of island,{' '}
          <span className="display-italic text-gold">one aerial pass.</span>
        </h2>
        <p className="mt-4 max-w-[480px] text-[13px] leading-[1.65] text-white/90 md:text-[15px]">
          From Harbour Town to Port Royal Sound, every villa we book and every
          tee time we hold.
        </p>
      </div>
    </section>
  );
}
