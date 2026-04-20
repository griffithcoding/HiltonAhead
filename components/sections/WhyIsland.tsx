import Image from 'next/image';
import { photos } from '@/data/photos';
import { whyIsland } from '@/data/hero';
import { SectionHead, Divider } from '@/components/ui/Ornament';

/**
 * "Why Hilton Head" — sells the island itself before selling us.
 * Asymmetric editorial layout: left column is narrative; right column is
 * a tall cinematic plate of Spanish moss / marshland. Three pillars below.
 */
export default function WhyIsland() {
  return (
    <section
      id="why-hilton-head"
      aria-labelledby="why-island-heading"
      className="mt-28 md:mt-36"
    >
      <Divider ornament="compass" className="mb-16 text-gold" />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-20">
        <div>
          <SectionHead
            number={whyIsland.sectionNumber}
            eyebrow={whyIsland.eyebrow}
            plain={whyIsland.title.plain}
            italic={whyIsland.title.italic}
          />

          <p
            id="why-island-heading"
            className="mt-8 max-w-[540px] text-[17px] leading-[1.75] text-ink-soft md:text-[18px]"
          >
            {whyIsland.lede}
          </p>
        </div>

        <div className="relative min-h-[340px] md:min-h-[460px]">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={photos.mossOak.src}
              alt={photos.mossOak.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover photo-warm"
            />
          </div>
          <span
            aria-hidden="true"
            className="display-italic absolute -bottom-6 left-6 text-[14px] text-ink-soft md:-bottom-8 md:left-8 md:text-[15px]"
          >
            — a live oak at dusk, mid-island
          </span>
        </div>
      </div>

      {/* ——— Three pillars ——— */}
      <div className="mt-20 grid grid-cols-1 divide-y divide-ink/10 border-t border-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {whyIsland.pillars.map((pillar, i) => (
          <article
            key={pillar.title}
            className="flex flex-col gap-4 px-0 py-8 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0"
          >
            <span className="section-number text-[24px] text-gold">
              {`0${i + 1}`}
            </span>
            <h3 className="display text-[22px] leading-[1.15] text-ink md:text-[26px]">
              {pillar.title}
            </h3>
            <p className="text-[14px] leading-[1.7] text-ink-soft">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
