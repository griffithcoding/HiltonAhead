import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { hero } from '@/data/hero';
import { photos } from '@/data/photos';
import { CompassRose } from '@/components/ui/Ornament';

/**
 * Hero — cinematic full-bleed photograph with the editorial headline
 * spilling from the image into the cream field below. Drop-capped lede,
 * two CTAs, and a small-caps proof row. Staggered rise on load.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative"
    >
      {/* ——— Hero photograph (full-bleed) ——— */}
      <div className="bleed relative h-[68vh] min-h-[520px] max-h-[780px] overflow-hidden">
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover photo-warm"
        />
        {/* Subtle scrim so the bottom legend is always readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />

        {/* Editorial caption on the image — bottom-left */}
        <figcaption className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-5 pb-6 text-cream">
          <div className="rise rise-delay-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em]">
            <span className="h-px w-10 bg-cream/70" />
            <span>{hero.masthead.place}, SC · 32.2° N, 80.7° W</span>
          </div>
          <div className="rise rise-delay-3 hidden items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-cream/80 md:flex">
            <span>Photograph, golden hour over the dunes</span>
            <span className="h-px w-10 bg-cream/70" />
          </div>
        </figcaption>
      </div>

      {/* ——— Headline spilling from the photograph into cream field ——— */}
      <div className="relative -mt-20 md:-mt-32 lg:-mt-40">
        <div className="rise pointer-events-none">
          <h1
            id="hero-title"
            className="display text-balance px-5 text-[56px] leading-[0.92] tracking-[-0.025em] text-cream md:text-[96px] lg:text-[128px]"
          >
            {hero.title.lineOne}
          </h1>
        </div>

        <div className="rise rise-delay-1 mt-1">
          <h2
            aria-hidden="true"
            className="display-italic px-5 text-[44px] leading-[0.95] tracking-[-0.02em] text-ink md:text-[76px] lg:text-[104px]"
          >
            {hero.title.italic}
          </h2>
        </div>

        <div className="rise rise-delay-2">
          <h2
            aria-hidden="true"
            className="display px-5 text-[56px] leading-[0.92] tracking-[-0.025em] text-ink md:text-[96px] lg:text-[128px]"
          >
            {hero.title.lineTwo}
          </h2>
        </div>
      </div>

      {/* ——— Lede + CTAs + proof ——— */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-16">
        <div className="rise rise-delay-3">
          <p className="dropcap max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
            {hero.lede}
          </p>
        </div>

        <div className="rise rise-delay-4 flex flex-col gap-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={brand.cta.bookingPagePath}
              className="group inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
            >
              {hero.primaryCtaLabel}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <a
              href={hero.secondaryCta.href}
              className="link-underline inline-flex items-center gap-2 px-1.5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
            >
              {hero.secondaryCta.label}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <hr className="rule-thin" />

          <dl className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            <span className="text-sunset">
              <CompassRose size={18} />
            </span>
            {hero.proofLine.map((signal, i) => (
              <span key={signal} className="flex items-center gap-3">
                <dd>{signal}</dd>
                {i < hero.proofLine.length - 1 && (
                  <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                )}
              </span>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
