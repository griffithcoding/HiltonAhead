import Image from 'next/image';
import { insiderProof } from '@/data/insiderProof';
import { photos } from '@/data/photos';
import { SectionHead, Divider, WaveLine, Ticket } from '@/components/ui/Ornament';

/**
 * InsiderProof — editorial stats strip + a six-up neighborhood photo wall,
 * each image overlaid with its neighborhood name as ticket-stub caption.
 */
export default function InsiderProof() {
  const neighborhoods = insiderProof.localSpots.map((spot, i) => ({
    ...spot,
    photo: photos.neighborhoods[i % photos.neighborhoods.length],
  }));

  return (
    <section id="how-it-works" className="mt-28 md:mt-36">
      <Divider ornament="sailboat" className="mb-16" />

      <SectionHead
        number="№ 04"
        eyebrow={insiderProof.eyebrow}
        plain={insiderProof.heading.plain}
        italic={insiderProof.heading.accent}
      />

      <p className="mt-6 max-w-[580px] text-[15px] leading-[1.75] text-ink-soft md:text-[17px]">
        {insiderProof.subheading}
      </p>

      {/* ——— Stats strip — oceanic numerals, rule-separated ——— */}
      <dl className="mt-14 grid grid-cols-2 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15 md:grid-cols-4 md:divide-x md:divide-y-0">
        {insiderProof.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 px-0 py-8 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0"
          >
            <dt className="eyebrow text-ink-soft">{stat.label}</dt>
            <dd className="display text-[48px] leading-none text-ocean md:text-[64px] lg:text-[72px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* ——— Neighborhood photo wall ——— */}
      <div className="mt-24">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="eyebrow eyebrow-coral">Neighborhoods we know cold</span>
          <h3 className="display max-w-[620px] text-[28px] leading-[1.1] text-ink md:text-[40px]">
            Six pockets. <span className="display-italic text-coral">Different island each time.</span>
          </h3>
          <span className="mt-3 text-ocean-deep/40"><WaveLine width={80} /></span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((spot, i) => (
            <article
              key={spot.neighborhood}
              className="group relative aspect-[5/6] overflow-hidden rounded-md"
            >
              <Image
                src={spot.photo.src}
                alt={spot.photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover photo-warm"
              />
              {/* Gradient scrim for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-ocean-deep/25 to-transparent" />

              {/* Numeral pinned top-left */}
              <span className="absolute left-5 top-4 section-number text-[40px] text-sand/85 md:text-[54px]">
                {`0${i + 1}`}
              </span>

              {/* Ticket stub with neighborhood name, top-right */}
              <div className="absolute right-4 top-5">
                <Ticket>{spot.neighborhood}</Ticket>
              </div>

              {/* Editorial copy pinned bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <div className="display text-[24px] leading-[1.1] text-sand md:text-[28px]">
                  {spot.neighborhood}
                </div>
                <p className="mt-2 max-w-[320px] text-[13px] leading-[1.6] text-sand/85">
                  {spot.note}
                </p>
                <div className="display-italic mt-3 text-[12px] text-sand/65">
                  {spot.photo.caption}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
