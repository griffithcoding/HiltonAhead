import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { SectionHead, Ticket } from '@/components/ui/Ornament';

export interface TimelineEntry {
  time: string;       // "Friday · 4:00 PM"
  title: string;      // "Wheels down at Savannah/Hilton Head"
  body: string;       // 1-2 sentences
  photo?: { src: string; alt: string };
}

interface TimelineChapterProps {
  timeline: TimelineEntry[];
}

export default function TimelineChapter({ timeline }: TimelineChapterProps) {
  return (
    <section
      aria-label="The timeline"
      className="mx-auto mt-32 max-w-[1280px] px-5 md:mt-44"
    >
      <Reveal>
        <SectionHead
          number="№ 05"
          eyebrow="The timeline"
          plain="How the days"
          italic="actually ran."
          align="center"
        />
      </Reveal>

      <div className="relative mt-20">
        {/* Center spine on desktop */}
        <div
          aria-hidden="true"
          className="story-timeline-spine pointer-events-none absolute left-4 top-0 hidden h-full w-[2px] md:left-1/2 md:block md:-translate-x-1/2"
        />

        <ol className="flex flex-col gap-16 md:gap-20">
          {timeline.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <li key={i} className="relative md:grid md:grid-cols-2 md:gap-16">
                {/* Pin */}
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-2 h-3 w-3 rounded-full bg-coral md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal
                  direction={left ? 'left' : 'right'}
                  delay={60}
                  className={`pl-10 md:pl-0 ${left ? 'md:col-start-1 md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}
                >
                  <Ticket>{t.time}</Ticket>
                  <h3 className="display mt-5 text-[24px] leading-[1.15] text-ink md:text-[32px]">
                    {t.title}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.75] text-ink-soft md:text-[15px]">
                    {t.body}
                  </p>
                </Reveal>

                {t.photo && (
                  <Reveal
                    direction={left ? 'right' : 'left'}
                    delay={140}
                    className={`mt-6 pl-10 md:mt-0 md:pl-0 ${left ? 'md:col-start-2 md:pl-12' : 'md:col-start-1 md:row-start-1 md:pr-12'}`}
                  >
                    <figure className="relative aspect-[4/3] overflow-hidden rounded-md">
                      <Image
                        src={t.photo.src}
                        alt={t.photo.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover photo-warm"
                      />
                    </figure>
                  </Reveal>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
