// components/villa-match/VillaMatchEntryCard.tsx
import Link from 'next/link';
import { SectionHead, Divider } from '@/components/ui/Ornament';

type Props = {
  variant: 'compact' | 'standard' | 'feature';
  source: string;
  ctaText?: string;
  headline?: string;
  body?: string;
};

const DEFAULTS = {
  eyebrow: 'Villa Match',
  headline: 'Find your Hilton Head stay in five questions.',
  body: "We'll match you to the kind of villa your trip actually wants. No prices, no fake availability.",
  cta: 'Start the match',
};

export default function VillaMatchEntryCard({
  variant,
  source,
  ctaText = DEFAULTS.cta,
  headline = DEFAULTS.headline,
  body = DEFAULTS.body,
}: Props) {
  const href = `/villa-match?source=${encodeURIComponent(source)}`;

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="group flex items-center justify-between gap-4 border border-ink/15 bg-cream px-5 py-4 transition-colors hover:border-coral"
      >
        <div>
          <div className="eyebrow text-coral">{DEFAULTS.eyebrow}</div>
          <div className="mt-1 text-[14px] text-ink">{headline}</div>
        </div>
        <span className="text-[12px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-ink">
          {ctaText} →
        </span>
      </Link>
    );
  }

  if (variant === 'standard') {
    return (
      <div className="border border-ink/15 bg-cream p-7 md:p-9">
        <div className="eyebrow text-coral">{DEFAULTS.eyebrow}</div>
        <h3 className="display mt-3 text-[22px] leading-[1.15] text-ink md:text-[28px]">
          {headline}
        </h3>
        <p className="mt-3 max-w-[480px] text-[14px] leading-[1.65] text-ink-soft md:text-[15px]">
          {body}
        </p>
        <div className="mt-6">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  // feature variant
  return (
    <section className="mt-16 md:mt-20">
      <SectionHead
        number="№ 02"
        eyebrow={DEFAULTS.eyebrow}
        plain="Find your"
        italic="Hilton Head stay."
      />
      <div className="mt-8 max-w-[760px]">
        <p className="text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">{body}</p>
        <Divider ornament="palmetto" className="my-8 text-gold" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </Link>
          <span className="text-[12px] uppercase tracking-[0.18em] text-ink-soft">
            5 questions · 90 seconds
          </span>
        </div>
      </div>
    </section>
  );
}
