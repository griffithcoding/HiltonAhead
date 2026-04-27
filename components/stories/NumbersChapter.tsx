import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import { SectionHead, Divider } from '@/components/ui/Ornament';

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  caption?: string;
}

interface NumbersChapterProps {
  stats: Stat[];
  intro?: string;
}

export default function NumbersChapter({ stats, intro }: NumbersChapterProps) {
  return (
    <section
      aria-label="The numbers"
      className="mt-32 bg-sand-deep/40 py-24 md:mt-44 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5">
        <Reveal>
          <SectionHead
            number="№ 06"
            eyebrow="The numbers"
            plain="What it actually"
            italic="took."
            align="center"
          />
        </Reveal>
        {intro && (
          <Reveal delay={100}>
            <p className="mx-auto mt-8 max-w-[640px] text-center text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
              {intro}
            </p>
          </Reveal>
        )}

        <Divider ornament="compass" className="mx-auto mt-14 max-w-[420px]" />

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-4 md:gap-x-10">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                <span className="display text-[56px] leading-[1] text-ink md:text-[80px]">
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    decimals={s.decimals}
                  />
                </span>
                <span className="mt-4 text-[10px] uppercase tracking-[0.28em] text-coral">
                  {s.label}
                </span>
                {s.caption && (
                  <span className="display-italic mt-3 max-w-[180px] text-[14px] leading-[1.5] text-ink-soft">
                    {s.caption}
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
