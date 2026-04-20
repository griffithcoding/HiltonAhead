import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { photos } from '@/data/photos';
import { TravelSeal, WaveLine } from '@/components/ui/Ornament';

/**
 * Final CTA — full-bleed cinematic photograph with an enormous mixed-style
 * display headline, vintage travel seal overlay, and a wave divider.
 */
export default function FinalCta() {
  return (
    <section
      id="contact-cta"
      aria-labelledby="final-cta-heading"
      className="bleed relative mt-28 h-[88vh] min-h-[600px] overflow-hidden md:mt-36"
    >
      <Image
        src={photos.dock.src}
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="object-cover photo-warm"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-ocean-deep/55 to-ocean-deep/90" />

      {/* Decorative wave layer on top */}
      <div className="absolute inset-x-0 top-8 flex justify-center text-sand/40">
        <WaveLine width={140} />
      </div>

      {/* Travel seal floating top-right */}
      <div className="absolute right-6 top-14 hidden text-sand/80 md:block lg:right-16">
        <TravelSeal
          size={150}
          topText="HILTON AHEAD · EST · 2026"
          bottomText="· ATLANTIC · LOWCOUNTRY ·"
          motif="sailboat"
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-5 pb-16 text-sand md:pb-24">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-sand/80">
          <span className="h-px w-12 bg-sand/70" />
          An invitation
        </div>

        <h2
          id="final-cta-heading"
          className="display mt-5 max-w-[920px] text-balance text-[48px] leading-[0.98] tracking-[-0.025em] text-sand md:text-[80px] lg:text-[104px]"
        >
          Tell us when{' '}
          <span className="display-italic text-gold">you&apos;re coming.</span>
          <br />
          We&apos;ll handle the{' '}
          <span className="display-italic text-gold">rest.</span>
        </h2>

        <p className="mt-7 max-w-[560px] text-[15px] leading-[1.7] text-sand/80 md:text-[17px]">
          Three minutes of questions. One business day to a quote. Zero sales
          pitch. The trip gets built for you, not for the algorithm.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href={brand.cta.bookingPagePath}
            className="group inline-flex items-center gap-2 bg-coral px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-sand hover:text-ocean-deep"
          >
            {brand.cta.label}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          {brand.contact.email ? (
            <a
              href={`mailto:${brand.contact.email}`}
              className="link-underline text-[12px] font-medium uppercase tracking-[0.22em] text-sand"
            >
              {brand.contact.email}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
