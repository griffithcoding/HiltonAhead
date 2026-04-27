import Reveal from '@/components/ui/Reveal';
import { Polaroid, SectionHead } from '@/components/ui/Ornament';

interface BriefChapterProps {
  brief: string;
  pinQuote: { text: string; attribution: string };
  pinPhoto: { src: string; alt: string; caption?: string };
}

export default function BriefChapter({ brief, pinQuote, pinPhoto }: BriefChapterProps) {
  return (
    <section
      aria-label="The brief"
      className="mx-auto mt-32 max-w-[1280px] px-5 md:mt-44"
    >
      <Reveal>
        <SectionHead
          number="№ 02"
          eyebrow="The brief"
          plain="What they"
          italic="came for."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-20">
        <Reveal delay={80}>
          <div className="typed-card">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink-soft">
              Memo · Discovery call
            </div>
            <p className="text-[15px] leading-[1.85] text-ink">
              {brief}
            </p>
            <div className="mt-7 border-t border-ocean-deep/15 pt-5">
              <p className="display-italic text-[18px] leading-[1.4] text-ink md:text-[22px]">
                &ldquo;{pinQuote.text}&rdquo;
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                — {pinQuote.attribution}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={180} direction="right">
          <div className="flex justify-center md:justify-start">
            <Polaroid
              src={pinPhoto.src}
              alt={pinPhoto.alt}
              caption={pinPhoto.caption}
              tiltIndex={1}
              width={280}
              height={350}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
