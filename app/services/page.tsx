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
  getFaqSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Services: Hilton Head Travel Consulting',
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
    'Hilton Head travel consultant services',
    'Hilton Head wedding logistics',
  ],
});

const SERVICES_FAQ = [
  {
    question: 'What services does Hilton Ahead actually book for clients?',
    answer:
      'Villa and resort lodging, Harbour Town and Palmetto Dunes tee times, S-tier dinner reservations, dolphin and fishing charters, private-car airport transfers, spa appointments, group dinners for weddings and corporate trips, and full-week family itineraries. We are based on the island and do most of this by a phone call, not a booking form.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'Three main options: a $95 discovery session (credits toward the itinerary), a $450 flat custom itinerary with revisions, and full-service trip planning billed as a percentage of trip spend for groups of 6+ or weddings. No kickbacks from vendors; every fee is agreed up front.',
  },
  {
    question: 'Can you get me a Harbour Town tee time?',
    answer:
      'Yes, if you stay inside Sea Pines Resort. Villa guests get 120-day tee-time priority at Harbour Town Golf Links. If you book the villa through us, we land the tee sheet. Public bookings are nearly impossible inside 60 days.',
  },
  {
    question: 'Do you handle wedding logistics?',
    answer:
      'Yes. Hilton Head wedding weekends are one of our core services. We coordinate group lodging across 8-12 properties, airport shuttles, welcome bags, rehearsal dinner venues, and a point of contact during the weekend itself. We are not the wedding planner, we are the travel operations team around them.',
  },
  {
    question: 'Do you plan Bluffton and Palmetto Bluff trips?',
    answer:
      'Yes. Bluffton and Palmetto Bluff sit 20-25 minutes off-island, and we regularly split trips between Hilton Head and Bluffton for couples and small groups. Palmetto Bluff is on our S-tier list for anniversaries and proposals.',
  },
  {
    question: 'How far ahead do I need to book?',
    answer:
      'Summer villas: 5-6 months out. October: 3-4 months. RBC Heritage week: 9-10 months. Winter: two weeks is fine unless it is a holiday. Spring break: 4-5 months. Dinner reservations at S-tier restaurants: 2-3 weeks lead time in summer, 1 week off-season.',
  },
  {
    question: 'What makes you different from booking direct with a resort?',
    answer:
      'We tell you which building to ask for, which room number to avoid, which restaurant disappoints on a Saturday, and whether a property is in-between renovation cycles. A resort cannot say "skip the Omni in May 2026, they are mid-renovation." We can, and do, in writing.',
  },
  {
    question: 'Do you offer on-island concierge once my trip starts?',
    answer:
      'For full-service clients, yes. Text-line support during your trip window for restaurant swaps, weather pivots, last-minute charter bookings, and anything else that comes up. For flat-fee itinerary clients, we handle pre-trip changes but the concierge line is not included.',
  },
];

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
  const faqSchema = getFaqSchema(SERVICES_FAQ);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
            barefoot-on-a-deck. Here&apos;s how we sort it for you.
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

        {/* ——— FAQ ——— */}
        <section className="mt-20">
          <SectionHead
            number="№ 02"
            eyebrow="FAQ"
            plain="Questions we"
            italic="hear most."
          />
          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {SERVICES_FAQ.map((item) => (
              <div key={item.question} className="grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10">
                <dt className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                  {item.question}
                </dt>
                <dd className="text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
