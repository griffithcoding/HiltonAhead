import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { brand } from '@/data/brand';
import { services } from '@/data/services';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Services — Hilton Head Travel Consulting',
  description:
    'Custom itineraries, villa booking, group trips, on-island concierge, and hard-to-get reservations for Hilton Head Island.',
  path: '/services',
  keywords: [
    'Hilton Head itinerary planning',
    'Hilton Head villa rental',
    'Hilton Head group travel',
    'Hilton Head concierge',
    'Hilton Head tee times',
    'Hilton Head dinner reservations',
  ],
});

export default function ServicesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const serviceSchemas = services.items.map((s) =>
    getServiceSchema({
      name: s.title,
      description: s.body,
      path: `/services#${s.slug}`,
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {serviceSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Services"
            plain="Everything we do for you,"
            italic="in one place."
          />
          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
            Hilton Head is deceptively big. Twelve square miles of
            neighborhoods, three major resorts, five championship golf courses,
            and a hundred restaurants that range from white-linen to
            barefoot-on-a-deck. Here&apos;s how we navigate it for you.
          </p>
        </section>

        <Divider ornament="compass" className="my-14 text-gold" />

        <div className="divide-y divide-ink/15 border-y border-ink/15">
          {services.items.map((item, i) => (
            <article
              key={item.slug}
              id={item.slug}
              className="grid scroll-mt-24 grid-cols-1 gap-6 py-10 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-center md:gap-10 md:py-14"
            >
              <div className="flex items-baseline gap-4">
                <span className="section-number text-[32px] text-gold md:text-[40px]">
                  {`0${i + 1}`}
                </span>
              </div>

              <div>
                <h2 className="display text-[28px] leading-[1.12] text-ink md:text-[36px]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft">
                  {item.body}
                </p>
              </div>

              <Link
                href={brand.cta.bookingPagePath}
                className="group inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full border border-ink px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-cream md:self-center"
              >
                Request this
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
