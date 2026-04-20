/**
 * Decorative editorial ornaments.
 * Small, stroked-line SVGs used as section separators, dingbats,
 * and masthead flourishes. All inherit color from `currentColor`.
 */

export function CompassRose({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />
      <path
        d="M20 4 L22 20 L20 36 L18 20 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M4 20 L20 18 L36 20 L20 22 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="20" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function PalmettoFrond({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22 C 12 14, 8 8, 4 6 M12 22 C 12 14, 16 8, 20 6 M12 22 C 12 15, 10 9, 7 3 M12 22 C 12 15, 14 9, 17 3 M12 22 L 12 12"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Editorial divider: thin line with a centered ornament. */
export function Divider({
  ornament = 'compass',
  className = '',
}: {
  ornament?: 'compass' | 'palmetto' | 'none';
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 text-ink/60 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-ink/15" />
      {ornament !== 'none' && (
        <span className="shrink-0">
          {ornament === 'compass' ? (
            <CompassRose size={22} />
          ) : (
            <PalmettoFrond size={18} />
          )}
        </span>
      )}
      <span className="h-px flex-1 bg-ink/15" />
    </div>
  );
}

/**
 * Editorial section header — number + eyebrow + display title.
 * Used at the top of each major section.
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
  const text = tone === 'cream' ? 'text-cream' : 'text-ink';
  const muted = tone === 'cream' ? 'text-cream/70' : 'text-ink-soft';
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start';
  return (
    <header className={`flex flex-col gap-4 ${alignClass}`}>
      <div className="flex items-baseline gap-4">
        <span
          className={`section-number text-[34px] md:text-[40px] ${
            tone === 'cream' ? 'text-gold' : 'text-gold'
          }`}
        >
          {number}
        </span>
        <span className={`eyebrow ${muted}`}>{eyebrow}</span>
      </div>
      <h2
        className={`display max-w-[720px] text-[34px] md:text-[48px] lg:text-[54px] ${text}`}
      >
        {plain}{' '}
        {italic && (
          <span className="display-italic font-normal">{italic}</span>
        )}
      </h2>
    </header>
  );
}
