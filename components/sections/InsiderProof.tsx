import Image from 'next/image';
import { insiderProof } from '@/data/insiderProof';
import { photos } from '@/data/photos';
import { SectionHead, Divider } from '@/components/ui/Ornament';

/**
 * InsiderProof — editorial stats strip + neighborhoods as typeset plaques.
 * A single atmospheric marsh photograph anchors the section on the left.
 */
export default function InsiderProof() {
  return (
    <section id="how-it-works" className="mt-28 md:mt-36">
      <Divider ornament="compass" className="mb-16 text-gold" />

      <SectionHead
        number="№ 03"
        eyebrow={insiderProof.eyebrow}
        plain={insiderProof.heading.plain}
        italic={insiderProof.heading.accent}
      />

      <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft">
        {insiderProof.subheading}
      </p>

      {/* ——— Stats strip — editorial numerals, rule-separated ——— */}
      <dl className="mt-14 grid grid-cols-2 divide-y divide-ink/15 border-y border-ink/15 md:grid-cols-4 md:divide-x md:divide-y-0">
        {insiderProof.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 px-0 py-7 md:px-8 md:py-8 first:md:pl-0 last:md:pr-0"
          >
            <dt className="eyebrow text-ink-soft">{stat.label}</dt>
            <dd className="display text-[44px] leading-none text-ink md:text-[56px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* ——— Neighborhoods + ambient photograph ——— */}
      <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
        <figure className="relative min-h-[420px] md:min-h-[560px]">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={photos.marsh.src}
              alt={photos.marsh.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover photo-warm"
            />
          </div>
          <figcaption className="display-italic mt-3 text-[14px] text-ink-soft">
            — creek marsh at sunset, north end
          </figcaption>
        </figure>

        <div>
          <h3 className="eyebrow text-sunset">
            Neighborhoods we know cold
          </h3>

          <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/15">
            {insiderProof.localSpots.map((spot, i) => (
              <li
                key={spot.neighborhood}
                className="grid grid-cols-[auto_1fr] items-baseline gap-6 py-5 md:grid-cols-[72px_1fr_auto]"
              >
                <span className="section-number text-[18px] text-gold md:text-[20px]">
                  {`№ ${String(i + 1).padStart(2, '0')}`}
                </span>
                <div>
                  <div className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                    {spot.neighborhood}
                  </div>
                  <p className="mt-1 text-[13px] leading-[1.6] text-ink-soft">
                    {spot.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
