import Link from 'next/link';
import { services } from '@/data/services';
import { SectionHead, Divider } from '@/components/ui/Ornament';

/**
 * Services — editorial asymmetric layout.
 * The first service is rendered large (lead feature); the remaining four
 * sit in a two-column grid. Hairline rules, no rounded cards, section
 * numbers in italic gold.
 */
export default function Services() {
  const [lead, ...rest] = services.items;

  return (
    <section id="services" className="mt-28 md:mt-36">
      <Divider ornament="palmetto" className="mb-16 text-gold" />

      <SectionHead
        number="№ 02"
        eyebrow={services.eyebrow}
        plain={services.heading.plain}
        italic={services.heading.accent}
      />

      {services.subheading && (
        <p className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-ink-soft">
          {services.subheading}
        </p>
      )}

      {/* Lead feature — larger typographic treatment */}
      {lead && (
        <article
          id={lead.slug}
          className="mt-14 grid grid-cols-1 gap-8 border-t border-ink/15 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-14"
        >
          <div className="flex items-start gap-6">
            <span className="section-number text-[28px] text-gold">
              01
            </span>
            <span className="eyebrow text-ink-soft">Signature service</span>
          </div>
          <div>
            <h3 className="display text-[32px] leading-[1.1] text-ink md:text-[44px]">
              {lead.title}
            </h3>
            <p className="mt-5 max-w-[620px] text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
              {lead.body}
            </p>
          </div>
        </article>
      )}

      {/* Remaining four — two-column editorial grid, hairline separators */}
      <div className="mt-10 grid grid-cols-1 gap-10 border-t border-ink/15 pt-10 md:grid-cols-2 md:gap-x-14 md:gap-y-12">
        {rest.map((item, i) => (
          <article
            key={item.slug}
            id={item.slug}
            className="flex flex-col gap-4"
          >
            <div className="flex items-baseline gap-4">
              <span className="section-number text-[22px] text-gold">
                {`0${i + 2}`}
              </span>
              <span className="eyebrow text-ink-soft">Service</span>
            </div>
            <h3 className="display text-[24px] leading-[1.15] text-ink md:text-[28px]">
              {item.title}
            </h3>
            <p className="text-[14px] leading-[1.7] text-ink-soft">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-ink/15 pt-6">
        <span className="eyebrow text-ink-soft">
          Every trip is quoted up front
        </span>
        <Link
          href="/services"
          className="link-underline text-[13px] font-medium uppercase tracking-[0.15em] text-ink"
        >
          See all services →
        </Link>
      </div>
    </section>
  );
}
