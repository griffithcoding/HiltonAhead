import Image from 'next/image';
import { photos } from '@/data/photos';
import { whyIsland } from '@/data/hero';
import {
  SectionHead,
  Divider,
  Polaroid,
  Ticket,
  TravelSeal,
} from '@/components/ui/Ornament';

/**
 * "Why Hilton Head" — the section that sells the island itself.
 *
 * Layout:
 *   - Headline + lede (left) paired with a large atmospheric oak plate (right)
 *   - Polaroid wall — four tilted shots layered on a sand-deep field
 *   - Three editorial pillars on hairline-ruled columns
 */
export default function WhyIsland() {
  return (
    <section
      id="why-hilton-head"
      aria-labelledby="why-island-heading"
      className="relative mt-28 md:mt-36"
    >
      <Divider ornament="compass" className="mb-16" />

      {/* ——— Headline + lede + atmospheric plate ——— */}
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-20">
        <div>
          <SectionHead
            number={whyIsland.sectionNumber}
            eyebrow={whyIsland.eyebrow}
            plain={whyIsland.title.plain}
            italic={whyIsland.title.italic}
          />
          <p
            id="why-island-heading"
            className="mt-8 max-w-[560px] text-[17px] leading-[1.75] text-ink-soft md:text-[18px]"
          >
            {whyIsland.lede}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Ticket>
              <span>12 mi · Atlantic coast</span>
            </Ticket>
            <Ticket>
              <span>24 golf courses</span>
            </Ticket>
            <Ticket>
              <span>No high-rises</span>
            </Ticket>
          </div>
        </div>

        <figure className="relative min-h-[380px] md:min-h-[520px]">
          <div className="relative h-full w-full overflow-hidden rounded-md">
            <Image
              src={photos.mossOak.src}
              alt={photos.mossOak.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover photo-warm"
            />
          </div>
          <figcaption className="display-italic mt-4 text-[15px] text-ink-soft">
            — a live oak, mid-island, just before dusk
          </figcaption>
        </figure>
      </div>

      {/* ——— Polaroid wall ——— */}
      <div className="relative mt-24 rounded-[2px] bg-sand-deep/50 px-6 py-20 md:px-14 md:py-28">
        {/* Decorative paper texture behind polaroids */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><circle cx='1' cy='1' r='0.5' fill='%230A2930' opacity='0.2'/></svg>\")",
              backgroundSize: '4px 4px',
            }}
          />
        </div>

        <div className="relative mb-12 flex flex-col items-center gap-4 text-center">
          <span className="eyebrow eyebrow-coral">From our desk</span>
          <h3 className="display max-w-[620px] text-[30px] leading-[1.1] text-ink md:text-[42px]">
            A few <span className="display-italic text-coral">quiet corners</span>{' '}
            we think about often.
          </h3>
        </div>

        <div className="relative mx-auto grid max-w-[980px] grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {photos.polaroidWall.map((p, i) => (
            <Polaroid
              key={i}
              src={p.src}
              alt={p.alt}
              caption={p.caption}
              tiltIndex={i}
              className="w-full"
            />
          ))}
        </div>

        <div className="relative mt-14 flex flex-col items-center gap-3">
          <TravelSeal
            size={96}
            topText="LOWCOUNTRY · ATLANTIC"
            bottomText="· FIELD DISPATCH ·"
            motif="compass"
            className="text-ocean-deep"
          />
          <span className="display-italic text-[14px] text-ink-soft">
            — photographed on-island, every season
          </span>
        </div>
      </div>

      {/* ——— Three pillars ——— */}
      <div className="mt-24 grid grid-cols-1 divide-y divide-ocean-deep/15 border-t border-ocean-deep/15 md:grid-cols-3 md:divide-x md:divide-y-0">
        {whyIsland.pillars.map((pillar, i) => (
          <article
            key={pillar.title}
            className="flex flex-col gap-4 px-0 py-10 md:px-10 md:py-12 first:md:pl-0 last:md:pr-0"
          >
            <span className="section-number text-[28px]">
              {`0${i + 1}`}
            </span>
            <h3 className="display text-[24px] leading-[1.15] text-ink md:text-[28px]">
              {pillar.title}
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-ink-soft">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
