import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { hero } from '@/data/hero';
import { photos } from '@/data/photos';
import {
  CompassRose,
  PostcardStamp,
  Ticket,
  WaveLine,
  Sailboat,
  TravelSeal,
} from '@/components/ui/Ornament';

/**
 * Hero — photography-forward magazine spread.
 * Left column: gigantic mixed-style display headline (plain + italic
 * trading lines) + lede + CTAs + travel seal. Right column: layered
 * photo collage (main plate, small top-right offset, small bottom-left
 * offset) with ticket-stub captions pinned over photographs.
 */
export default function Hero() {
  const [primary, secondary, tertiary] = photos.heroCollage;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mt-10 md:mt-14"
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
        {/* ——— LEFT: typographic display ——— */}
        <div className="flex flex-col justify-center">
          <div className="rise mb-6 flex items-center gap-4">
            <PostcardStamp>
              <span className="flex items-center gap-2">
                <Sailboat size={16} /> Est. 1956 · Atlantic
              </span>
            </PostcardStamp>
            <span className="eyebrow-coral eyebrow">
              {hero.eyebrow}
            </span>
          </div>

          <h1 id="hero-title" className="sr-only">
            {hero.title.lineOne} {hero.title.italic} {hero.title.lineTwo}
          </h1>

          <div aria-hidden="true" className="relative">
            <div className="rise">
              <span className="display block text-balance text-[40px] leading-[0.96] tracking-[-0.03em] text-ink sm:text-[52px] md:text-[88px] lg:text-[108px]">
                {hero.title.lineOne}
              </span>
            </div>
            <div className="rise rise-delay-1 mt-1">
              <span className="display-italic block text-balance text-[34px] leading-[1] tracking-[-0.02em] text-coral sm:text-[44px] md:text-[74px] lg:text-[92px]">
                {hero.title.italic}
              </span>
            </div>
            <div className="rise rise-delay-2 mt-1">
              <span className="display block text-balance text-[40px] leading-[0.96] tracking-[-0.03em] text-ink sm:text-[52px] md:text-[88px] lg:text-[108px]">
                {hero.title.lineTwo}
              </span>
            </div>
          </div>

          <div className="rise rise-delay-3 mt-10">
            <p className="dropcap max-w-[520px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              {hero.lede}
            </p>
          </div>

          <div className="rise rise-delay-4 mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <Link
              href={brand.cta.bookingPagePath}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
            >
              {hero.primaryCtaLabel}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href={hero.secondaryCta.href}
              className="link-underline inline-flex items-center gap-2 px-2 py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
            >
              {hero.secondaryCta.label}
              <span aria-hidden="true">↓</span>
            </a>
            {hero.tertiaryCta && (
              <Link
                href={hero.tertiaryCta.href}
                className="group inline-flex items-center gap-3 rounded-full border border-coral/40 bg-coral/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-coral-deep transition hover:border-coral hover:bg-coral/10"
              >
                <span className="rounded-full bg-coral px-2 py-0.5 text-[9px] tracking-[0.18em] text-sand">
                  {hero.tertiaryCta.eyebrow}
                </span>
                <span>{hero.tertiaryCta.label}</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            )}
          </div>

          <div className="rise rise-delay-5 mt-10 flex flex-wrap items-center gap-3 gap-y-3">
            <span className="text-coral"><CompassRose size={22} /></span>
            {hero.proofLine.map((signal, i) => (
              <span key={signal} className="flex items-center gap-3">
                <span className="eyebrow text-ink-soft">{signal}</span>
                {i < hero.proofLine.length - 1 && (
                  <span aria-hidden="true" className="h-px w-6 bg-ocean-deep/20" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ——— RIGHT: layered photo collage ——— */}
        <div className="relative min-h-[400px] sm:min-h-[480px] md:min-h-[620px]">
          {/* Primary photograph — off-center main plate.
              No `.rise` wrapper: this is the LCP candidate on mobile and the
              opacity:0 → 1 animation defers Chromium's LCP measurement past
              the image-paint time, costing ~1-2s of LCP. */}
          <figure className="absolute left-[8%] top-0 h-[72%] w-[80%] overflow-hidden rounded-md shadow-[0_30px_80px_-20px_rgba(10,41,48,0.4)]">
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover photo-warm"
            />
            <figcaption className="absolute left-5 top-5">
              <Ticket>№ {primary.label} · {primary.caption}</Ticket>
            </figcaption>
          </figure>

          {/* Top-right small accent — tilts slightly, overlaps primary */}
          <figure
            className="rise rise-delay-3 absolute -right-2 top-[18%] aspect-[4/5] w-[42%] overflow-hidden rounded-md shadow-[0_20px_50px_-15px_rgba(10,41,48,0.5)]"
            style={{ transform: 'rotate(2deg)' }}
          >
            <Image
              src={secondary.src}
              alt={secondary.alt}
              fill
              sizes="(max-width: 1024px) 45vw, 18vw"
              className="object-cover photo-warm"
            />
          </figure>

          {/* Bottom-left small accent — the lighthouse / marsh mood */}
          <figure
            className="rise rise-delay-4 absolute -left-2 bottom-2 aspect-[5/4] w-[48%] overflow-hidden rounded-md shadow-[0_20px_50px_-15px_rgba(10,41,48,0.5)]"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <Image
              src={tertiary.src}
              alt={tertiary.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 20vw"
              className="object-cover photo-warm"
            />
          </figure>

          {/* Travel seal — bottom-right floating ornament */}
          <div className="absolute -right-4 bottom-[8%] hidden text-ocean-deep md:block">
            <TravelSeal
              size={120}
              topText="HILTON HEAD ISLAND"
              bottomText="· ATLANTIC ·"
              motif="palmetto"
            />
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="mt-20 flex items-center justify-center text-ocean-deep/30">
        <WaveLine width={120} />
      </div>
    </section>
  );
}
