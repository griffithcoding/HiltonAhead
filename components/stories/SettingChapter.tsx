import Reveal from '@/components/ui/Reveal';
import { Polaroid, SectionHead, Divider } from '@/components/ui/Ornament';

interface SettingChapterProps {
  /** 4 venue/place shots — no people. */
  settings: { src: string; alt: string; caption: string }[];
  intro: string;
}

export default function SettingChapter({ settings, intro }: SettingChapterProps) {
  return (
    <section
      aria-label="The setting"
      className="mt-32 bg-sand-deep/40 py-20 md:mt-44 md:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-5">
        <Reveal>
          <SectionHead
            number="№ 03"
            eyebrow="The setting"
            plain="Where it"
            italic="happened."
            align="center"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-[640px] text-center text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            {intro}
          </p>
        </Reveal>

        <Divider ornament="wave" className="mx-auto mt-16 max-w-[480px]" />

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {settings.slice(0, 4).map((s, i) => (
            <Reveal key={i} delay={120 * i} direction={i % 2 === 0 ? 'up' : 'up'}>
              <Polaroid
                src={s.src}
                alt={s.alt}
                caption={s.caption}
                tiltIndex={i}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
