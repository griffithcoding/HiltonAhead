import Reveal from '@/components/ui/Reveal';
import HiltonHeadMap, { type RoutePoint } from '@/components/ui/HiltonHeadMap';
import { SectionHead, Ticket } from '@/components/ui/Ornament';

interface MapChapterProps {
  route: RoutePoint[];
  intro: string;
  totalLabel?: string;        // e.g. "12 stops · 4 days · 31 miles"
}

export default function MapChapter({ route, intro, totalLabel }: MapChapterProps) {
  return (
    <section
      aria-label="The route"
      className="mx-auto mt-32 max-w-[1280px] px-5 md:mt-44"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <SectionHead
              number="№ 04"
              eyebrow="The route"
              plain="Twelve miles of island,"
              italic="charted."
            />
            <p className="dropcap mt-10 text-[16px] leading-[1.85] text-ink-soft md:text-[17px]">
              {intro}
            </p>
            {totalLabel && (
              <div className="mt-8">
                <Ticket>{totalLabel}</Ticket>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120} direction="right">
          <div className="rounded-[2px] bg-sand-soft/60 p-3 md:p-6">
            <HiltonHeadMap route={route} tone="ink" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
