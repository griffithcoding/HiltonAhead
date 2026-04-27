import KenBurnsImage from '@/components/ui/KenBurnsImage';
import Reveal from '@/components/ui/Reveal';
import { TravelSeal, WaveLine } from '@/components/ui/Ornament';

interface CoverChapterProps {
  storyNumber: string;            // "01"
  kindLabel: string;              // "AN EVENT" | "A STAY"
  date: string;                   // "October 2025"
  title: { plain: string; italic: string };
  hook: string;
  cover: { src: string; alt: string };
}

export default function CoverChapter({
  storyNumber,
  kindLabel,
  date,
  title,
  hook,
  cover,
}: CoverChapterProps) {
  return (
    <section
      aria-label="Story cover"
      className="bleed relative -mt-10 h-[92vh] min-h-[560px] overflow-hidden md:min-h-[680px]"
    >
      <KenBurnsImage
        src={cover.src}
        alt={cover.alt}
        variant="in"
        durationClass="kb-18s"
        aspectClass="absolute inset-0 h-full w-full"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/30 via-ocean-deep/20 to-ocean-deep/85" />

      {/* Top-right seal */}
      <div className="absolute right-5 top-8 hidden text-sand/85 md:block lg:right-12 lg:top-12">
        <TravelSeal
          size={140}
          topText="HILTON AHEAD · STORIES"
          bottomText={`· ${date.toUpperCase()} ·`}
          motif="compass"
        />
      </div>

      {/* Top-left chapter ticker */}
      <div className="absolute left-5 top-8 flex items-center gap-3 text-sand md:left-10 md:top-12">
        <span className="h-px w-10 bg-sand/70" />
        <span className="text-[10px] uppercase tracking-[0.32em] text-sand/85">
          Story № {storyNumber} · {kindLabel}
        </span>
      </div>

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-5 pb-16 text-sand md:pb-24">
        <Reveal delay={120}>
          <div className="text-sand/70">
            <WaveLine width={88} />
          </div>
        </Reveal>
        <Reveal delay={220}>
          <h1 className="display mt-5 max-w-[1080px] text-balance text-[40px] leading-[1.02] tracking-[-0.025em] text-sand sm:text-[56px] md:text-[88px] lg:text-[112px]">
            {title.plain}{' '}
            <span className="display-italic text-gold">{title.italic}</span>
          </h1>
        </Reveal>
        <Reveal delay={400}>
          <p className="mt-7 max-w-[640px] text-[15px] leading-[1.7] text-sand/85 md:text-[18px]">
            {hook}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
