import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { photos } from '@/data/photos';

/**
 * Final CTA — full-bleed cinematic photograph with a large serif
 * headline. Ink overlay tuned low so the photograph breathes.
 */
export default function FinalCta() {
  return (
    <section
      id="contact-cta"
      aria-labelledby="final-cta-heading"
      className="bleed relative mt-28 h-[72vh] min-h-[520px] overflow-hidden md:mt-36"
    >
      <Image
        src={photos.dock.src}
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="object-cover photo-warm"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/35 to-ink/75" />

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-5 pb-14 text-cream md:pb-20">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/80">
          <span className="h-px w-12 bg-cream/70" />
          An invitation
        </div>

        <h2
          id="final-cta-heading"
          className="display mt-5 max-w-[820px] text-balance text-[44px] leading-[0.98] tracking-[-0.02em] text-cream md:text-[72px] lg:text-[88px]"
        >
          Tell us when you&apos;re coming.{' '}
          <span className="display-italic">We&apos;ll handle the rest.</span>
        </h2>

        <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-cream/80 md:text-[17px]">
          Three minutes of questions, one business day to a quote, zero sales
          pitch. The trip gets built for you, not for the algorithm.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={brand.cta.bookingPagePath}
            className="group inline-flex items-center gap-2 bg-cream px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-sunset hover:text-cream"
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
              className="link-underline text-[12px] font-medium uppercase tracking-[0.18em] text-cream"
            >
              {brand.contact.email}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
