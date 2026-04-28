import Link from 'next/link';
import KenBurnsImage from '@/components/ui/KenBurnsImage';
import Reveal from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/Ornament';

interface AftermathChapterProps {
  takeaways: { src: string; alt: string; caption?: string }[];
  /** Where the "want a story like this?" CTA links to. */
  ctaHref: string;
  ctaLabel: string;
  ctaIntro: string;
  relatedTripTypePath?: string;
  relatedTripTypeLabel?: string;
}

export default function AftermathChapter({
  takeaways,
  ctaHref,
  ctaLabel,
  ctaIntro,
  relatedTripTypePath,
  relatedTripTypeLabel,
}: AftermathChapterProps) {
  const grid = takeaways.slice(0, 6);
  return (
    <section
      aria-label="The aftermath"
      className="mx-auto mt-32 max-w-[1280px] px-5 md:mt-44"
    >
      <Reveal>
        <SectionHead
          number="№ 07"
          eyebrow="The aftermath"
          plain="What they"
          italic="took home."
          align="center"
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {grid.map((t, i) => (
          <Reveal key={i} delay={i * 80}>
            <figure className="group">
              <KenBurnsImage
                src={t.src}
                alt={t.alt}
                variant={i % 3 === 0 ? 'in' : i % 3 === 1 ? 'pan-right' : 'pan-up'}
                durationClass={i % 2 === 0 ? 'kb-12s' : 'kb-18s'}
                aspectClass={i % 4 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {t.caption && (
                <figcaption className="display-italic mt-3 text-[13px] leading-[1.5] text-ink-soft">
                  {t.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 border-y border-ocean-deep/15 py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <h3 className="display text-[28px] leading-[1.1] text-ink md:text-[44px]">
              Want a story{' '}
              <span className="display-italic text-coral">like this?</span>
            </h3>
            <p className="mt-4 max-w-[560px] text-[14.5px] leading-[1.7] text-ink-soft md:text-[15px]">
              {ctaIntro}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
            >
              {ctaLabel}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            {relatedTripTypePath && relatedTripTypeLabel && (
              <Link
                href={relatedTripTypePath}
                className="link-underline text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
              >
                {relatedTripTypeLabel} ↓
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
