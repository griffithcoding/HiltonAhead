import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { hero } from '@/data/hero';
import { photos } from '@/data/photos';

/**
 * Hero section — 2-column grid on desktop.
 * Left: headline, subtitle, CTAs, trust signals.
 * Right: full-bleed photo.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col justify-center py-4">
        <h1
          id="hero-title"
          className="mb-4 text-[32px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[40px]"
        >
          {hero.title.plain}{' '}
          <span className="text-primary">{hero.title.accent}</span>
        </h1>

        <p className="mb-7 max-w-[480px] text-[15px] leading-[1.6] text-zinc-400">
          {hero.subtitle}
        </p>

        <div className="mb-7 flex flex-wrap gap-3">
          <Link
            href={brand.cta.bookingPagePath}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105 active:scale-[0.98]"
          >
            {hero.primaryCtaLabel}
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={hero.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-zinc-900/80 px-[17px] py-2.5 text-[13px] text-zinc-300 transition hover:border-white/60 hover:text-white"
          >
            {hero.secondaryCta.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-zinc-500">
          {hero.trustSignals.map((signal) => (
            <div key={signal} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary" />
              <dd>{signal}</dd>
            </div>
          ))}
        </dl>
      </div>

      <aside
        aria-label="Hilton Head Island at sunset"
        className="relative min-h-[352px] overflow-hidden rounded-[22px] border border-white/15 shadow-2xl"
      >
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 45vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </aside>
    </section>
  );
}
