import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { WaveLine } from '@/components/ui/Ornament';

interface PivotChapterProps {
  quote: string;
  attribution?: string;
  /** Atmospheric background image (no people). */
  background: { src: string; alt: string };
}

export default function PivotChapter({ quote, attribution, background }: PivotChapterProps) {
  return (
    <section
      aria-label="The turning point"
      className="bleed relative mt-32 h-[80vh] min-h-[460px] overflow-hidden md:mt-44 md:min-h-[600px]"
    >
      <Image
        src={background.src}
        alt={background.alt}
        fill
        sizes="100vw"
        className="object-cover photo-warm"
      />
      <div className="absolute inset-0 bg-ocean-deep/75" />

      <div className="relative mx-auto flex h-full max-w-[980px] flex-col items-center justify-center px-6 text-center text-sand">
        <Reveal>
          <div className="text-sand/55">
            <WaveLine width={120} />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow eyebrow-coral mt-7">The turning point</p>
        </Reveal>
        <Reveal delay={220}>
          <blockquote className="display-italic mt-8 text-balance text-[28px] leading-[1.2] text-sand md:text-[44px] lg:text-[56px]">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </Reveal>
        {attribution && (
          <Reveal delay={400}>
            <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-sand/70">
              — {attribution}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
