import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { photos } from '@/data/photos';

/**
 * Final CTA band. Ambient photo behind dark overlay.
 */
export default function FinalCta() {
  return (
    <section
      id="contact-cta"
      aria-labelledby="final-cta-heading"
      className="relative mt-16 overflow-hidden rounded-[24px] border border-white/20 shadow-xl"
    >
      <Image
        src={photos.cta.src}
        alt=""
        fill
        aria-hidden="true"
        className="object-cover opacity-25"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-900/90 to-zinc-950/95" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-7 text-[13px]">
        <div>
          <h2
            id="final-cta-heading"
            className="mb-1.5 text-[22px] font-medium tracking-tight text-zinc-50 md:text-[24px]"
          >
            Ready to plan your trip?
          </h2>
          <p className="max-w-[460px] leading-[1.5] text-zinc-400">
            Tell us when you&apos;re coming, who&apos;s coming, and what you want out of the trip.
            You&apos;ll hear back within one business day with a quote and next steps.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={brand.cta.bookingPagePath}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105 active:scale-[0.98]"
          >
            {brand.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
          {brand.contact.email ? (
            <span className="rounded-full border border-white/25 bg-zinc-950/70 px-3.5 py-2 text-[12px] text-zinc-200 backdrop-blur-sm">
              or email{' '}
              <a
                href={`mailto:${brand.contact.email}`}
                className="font-medium underline decoration-white/40 underline-offset-2"
              >
                {brand.contact.email}
              </a>
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
