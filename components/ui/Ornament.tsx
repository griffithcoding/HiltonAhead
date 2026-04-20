/**
 * Decorative SVG ornaments, seals, and stamps.
 * Hand-crafted motifs that fight the flat-grid "AI-generated" feel.
 * Everything inherits color from `currentColor`.
 */
import Image from 'next/image';
import type { ReactNode } from 'react';

// ———————————————————————————————————————————————————————————————————
// Line-art motifs
// ———————————————————————————————————————————————————————————————————

export function CompassRose({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <path d="M20 4 L22 20 L20 36 L18 20 Z" fill="currentColor" opacity="0.9" />
      <path d="M4 20 L20 18 L36 20 L20 22 Z" fill="currentColor" opacity="0.45" />
      <circle cx="20" cy="20" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function PalmettoFrond({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22 C 12 14, 8 8, 4 6 M12 22 C 12 14, 16 8, 20 6 M12 22 C 12 15, 10 9, 7 3 M12 22 C 12 15, 14 9, 17 3 M12 22 L 12 12"
        stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"
      />
    </svg>
  );
}

export function Sailboat({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 6 L20 28 M20 8 L10 28 Z M20 10 L30 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 30 Q20 36 34 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M10 28 L30 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function WaveLine({ width = 64 }: { width?: number }) {
  return (
    <svg width={width} height="12" viewBox="0 0 64 12" fill="none" aria-hidden="true">
      <path
        d="M0 6 Q8 2, 16 6 T 32 6 T 48 6 T 64 6"
        stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

export function Oyster({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <ellipse cx="14" cy="18" rx="11" ry="5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M3 18 C 3 10, 7 4, 14 4 C 21 4, 25 10, 25 18" stroke="currentColor" strokeWidth="0.9" fill="none" />
      <path d="M7 16 L 21 16 M10 12 L 18 12" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

// ———————————————————————————————————————————————————————————————————
// Composed decorations
// ———————————————————————————————————————————————————————————————————

/** Horizontal rule + centered ornament. */
export function Divider({
  ornament = 'compass',
  className = '',
}: {
  ornament?: 'compass' | 'palmetto' | 'sailboat' | 'wave' | 'oyster' | 'none';
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 text-ocean-deep/60 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-ocean-deep/20" />
      {ornament !== 'none' && (
        <span className="shrink-0 text-coral">
          {ornament === 'compass'  && <CompassRose size={22} />}
          {ornament === 'palmetto' && <PalmettoFrond size={18} />}
          {ornament === 'sailboat' && <Sailboat size={26} />}
          {ornament === 'wave'     && <WaveLine width={60} />}
          {ornament === 'oyster'   && <Oyster size={22} />}
        </span>
      )}
      <span className="h-px flex-1 bg-ocean-deep/20" />
    </div>
  );
}

/**
 * Editorial section header — № number + eyebrow + display title.
 */
export function SectionHead({
  number,
  eyebrow,
  plain,
  italic,
  align = 'left',
  tone = 'ink',
}: {
  number: string;
  eyebrow: string;
  plain: string;
  italic?: string;
  align?: 'left' | 'center';
  tone?: 'ink' | 'cream';
}) {
  const text = tone === 'cream' ? 'text-sand' : 'text-ink';
  const muted = tone === 'cream' ? 'text-sand/70' : 'text-ink-soft';
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start';
  return (
    <header className={`flex flex-col gap-4 ${alignClass}`}>
      <div className="flex items-baseline gap-4">
        <span className="section-number text-[34px] md:text-[44px]">{number}</span>
        <span className={`eyebrow ${muted}`}>{eyebrow}</span>
      </div>
      <h2 className={`display max-w-[760px] text-[36px] md:text-[52px] lg:text-[60px] ${text}`}>
        {plain}{' '}
        {italic && <span className="display-italic font-normal">{italic}</span>}
      </h2>
    </header>
  );
}

/**
 * Vintage travel seal — a circular emblem with text arced around the top
 * and bottom, with a motif in the center. Pure SVG, fights the AI-grid feel.
 */
export function TravelSeal({
  size = 140,
  topText = 'HILTON HEAD ISLAND',
  bottomText = 'ATLANTIC · EST · 1956',
  motif = 'palmetto',
  className = '',
}: {
  size?: number;
  topText?: string;
  bottomText?: string;
  motif?: 'palmetto' | 'compass' | 'sailboat' | 'oyster';
  className?: string;
}) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <path id="sealTop"
          d={`M ${size*0.15},${r} A ${r*0.85},${r*0.85} 0 0 1 ${size*0.85},${r}`} />
        <path id="sealBottom"
          d={`M ${size*0.18},${r*1.05} A ${r*0.78},${r*0.78} 0 0 0 ${size*0.82},${r*1.05}`} />
      </defs>
      <circle cx={r} cy={r} r={r - 1.5} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={r} cy={r} r={r - 7} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {/* Radial tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const x1 = r + Math.cos(a) * (r - 12);
        const y1 = r + Math.sin(a) * (r - 12);
        const x2 = r + Math.cos(a) * (r - 7);
        const y2 = r + Math.sin(a) * (r - 7);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        );
      })}
      <text fill="currentColor" fontSize={size * 0.07} letterSpacing="2" fontFamily="var(--font-sans)" fontWeight="700">
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">{topText}</textPath>
      </text>
      <text fill="currentColor" fontSize={size * 0.065} letterSpacing="2" fontFamily="var(--font-sans)" fontWeight="700">
        <textPath href="#sealBottom" startOffset="50%" textAnchor="middle">{bottomText}</textPath>
      </text>
      <g transform={`translate(${r - size * 0.12}, ${r - size * 0.12})`} color="currentColor">
        {motif === 'palmetto' && <PalmettoFrond size={size * 0.24} />}
        {motif === 'compass' && <CompassRose size={size * 0.24} />}
        {motif === 'sailboat' && <Sailboat size={size * 0.24} />}
        {motif === 'oyster' && <Oyster size={size * 0.24} />}
      </g>
    </svg>
  );
}

/** Postcard stamp — small rectangular vintage-travel seal. */
export function PostcardStamp({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`stamp ${className}`}>{children}</span>;
}

/** Ticket stub — perforated-edge caption element. */
export function Ticket({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`ticket ${className}`}>{children}</span>;
}

// ———————————————————————————————————————————————————————————————————
// Polaroid — tilted photo with white frame and italic caption
// ———————————————————————————————————————————————————————————————————

const TILT_CLASS = [
  'polaroid-tilt-1',
  'polaroid-tilt-2',
  'polaroid-tilt-3',
  'polaroid-tilt-4',
] as const;

export function Polaroid({
  src,
  alt,
  caption,
  tiltIndex = 0,
  className = '',
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  tiltIndex?: number;
  className?: string;
  width?: number;
  height?: number;
}) {
  const tilt = TILT_CLASS[tiltIndex % TILT_CLASS.length];
  return (
    <figure className={`polaroid ${tilt} ${className}`}>
      <div
        className="relative overflow-hidden rounded-md"
        style={{ width: width ? `${width}px` : '100%', aspectRatio: width && height ? `${width} / ${height}` : '4 / 5' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 60vw, 280px"
          className="object-cover photo-warm"
        />
      </div>
      {caption && <figcaption className="polaroid-caption">{caption}</figcaption>}
    </figure>
  );
}
