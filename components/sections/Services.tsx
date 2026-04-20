import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { photos } from '@/data/photos';
import { SectionHead, Divider, Ticket } from '@/components/ui/Ornament';

/**
 * Services — each item is a photo-left / type-right "editorial spread".
 * Per-item photograph matched by index, contextual captions, and a
 * "Request this" link-underline pinned to each. Feels like a look book,
 * not a pricing grid.
 */

// Index-aligned with services.items
const SERVICE_PHOTOS = [
  { ...photos.teaTable,  tag: 'Itinerary sample' },
  { ...photos.villa,     tag: 'Sea Pines oceanfront' },
  { ...photos.hammock,   tag: 'Group, spring break' },
  { ...photos.harborBoats,tag: 'Concierge, Shelter Cove' },
  { ...photos.oysters,   tag: 'Skull Creek · 7 p.m.' },
];

export default function Services() {
  return (
    <section id="services" className="mt-28 md:mt-36">
      <Divider ornament="palmetto" className="mb-16" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-20">
        <SectionHead
          number="№ 03"
          eyebrow={services.eyebrow}
          plain={services.heading.plain}
          italic={services.heading.accent}
        />
        {services.subheading && (
          <p className="self-end max-w-[440px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            {services.subheading}
          </p>
        )}
      </div>

      {/* ——— Each service as a photo-left / type-right spread ——— */}
      <div className="mt-16 flex flex-col divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
        {services.items.map((item, i) => {
          const photo = SERVICE_PHOTOS[i % SERVICE_PHOTOS.length];
          const reverse = i % 2 === 1; // zig-zag
          return (
            <article
              key={item.slug}
              id={item.slug}
              className={`grid scroll-mt-24 grid-cols-1 items-center gap-10 py-14 md:gap-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] ${
                reverse ? 'lg:[&>figure]:order-2' : ''
              }`}
            >
              {/* Photograph */}
              <figure className="relative aspect-[4/5] overflow-hidden lg:aspect-[4/4.5]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover photo-warm"
                />
                <div className="absolute left-4 top-4">
                  <Ticket>{photo.tag}</Ticket>
                </div>
                <div className="absolute right-4 bottom-4">
                  <span className="section-number text-[72px] leading-none text-sand/85 drop-shadow-[0_2px_10px_rgba(10,41,48,0.5)] md:text-[110px]">
                    {`0${i + 1}`}
                  </span>
                </div>
              </figure>

              {/* Type block */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="eyebrow-coral eyebrow">
                    {i === 0 ? 'Signature service' : `Service № ${String(i + 1).padStart(2, '0')}`}
                  </span>
                </div>
                <h3 className="display text-balance text-[30px] leading-[1.08] text-ink md:text-[40px] lg:text-[48px]">
                  {item.title}
                </h3>
                <p className="max-w-[560px] text-[15px] leading-[1.75] text-ink-soft md:text-[17px]">
                  {item.body}
                </p>
                <Link
                  href="/itinerary"
                  className="link-underline mt-2 inline-flex items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.22em] text-ocean"
                >
                  Request this
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <span className="eyebrow text-ink-soft">
          Every trip is quoted up front
        </span>
        <Link
          href="/services"
          className="link-underline text-[13px] font-medium uppercase tracking-[0.2em] text-ink"
        >
          See all services →
        </Link>
      </div>
    </section>
  );
}
