import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import { photos } from '@/data/photos';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import { months, getMonthBySlug } from '@/data/months';

export const revalidate = 3600;

type Params = { month: string };

export function generateStaticParams(): Params[] {
  return months.map((m) => ({ month: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { month } = await params;
  const m = getMonthBySlug(month);
  if (!m)
    return generatePageMetadata({
      title: 'Not found',
      description: 'Month not found.',
      path: `/hilton-head-weather/${month}`,
    });

  return generatePageMetadata({
    title: `Hilton Head Weather in ${m.name}: Temps, Crowds, What to Pack`,
    description: `Hilton Head weather in ${m.name}: ${m.avgHigh}°F days, ${m.avgLow}°F nights, ${m.waterTemp}°F water. Crowds, rates, what's open, and what to pack.`,
    path: `/hilton-head-weather/${m.slug}`,
    keywords: [
      `Hilton Head weather ${m.name}`,
      `Hilton Head in ${m.name}`,
      `Hilton Head ${m.name} weather`,
      `Hilton Head ${m.name}`,
      `is ${m.name} a good time to visit Hilton Head`,
      `Hilton Head ${m.name} temperature`,
      `Hilton Head ${m.name} water temperature`,
    ],
  });
}

export default async function MonthPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { month } = await params;
  const m = getMonthBySlug(month);
  if (!m) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head Weather', path: '/hilton-head-weather' },
    { name: m.name, path: `/hilton-head-weather/${m.slug}` },
  ]);
  const faqSchema = getFaqSchema(
    m.faq.map((f) => ({ question: f.q, answer: f.a.replace(/<[^>]+>/g, '') })),
  );
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Hilton Head Weather in ${m.name}`,
    description: `Hilton Head Island weather in ${m.name}: averages, crowds, and travel tips.`,
    datePublished: '2026-04-24',
    dateModified: '2026-04-24',
    author: { '@type': 'Organization', name: 'Hilton Ahead' },
    about: {
      '@type': 'Place',
      name: 'Hilton Head Island',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hilton Head Island',
        addressRegion: 'SC',
        addressCountry: 'US',
      },
    },
  };

  const prev = getMonthBySlug(m.prev);
  const next = getMonthBySlug(m.next);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <Link
            href="/blog/best-time-to-visit-hilton-head"
            className="transition-colors hover:text-coral"
          >
            Hilton Head Weather
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">{m.name}</span>
        </nav>

        {/* Hero */}
        <header className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <span className="eyebrow-coral eyebrow">
              Month {m.monthNumber} of 12 · Hilton Head Island
            </span>
            <h1 className="display mt-5 text-balance text-[40px] leading-[1.04] tracking-[-0.02em] text-ink md:text-[58px] lg:text-[68px]">
              Hilton Head Weather in {m.name}
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] italic leading-[1.7] text-ink-soft md:text-[19px]">
              {m.headline}
            </p>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
              {m.intro}
            </p>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[420px]">
            <Image
              src={photos.marsh.src}
              alt={`Hilton Head Island in ${m.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
          </figure>
        </header>

        <Divider ornament="compass" className="my-16 text-gold" />

        {/* Climate stats card */}
        <section>
          <SectionHead
            number="№ 01"
            eyebrow={`${m.name} climate`}
            plain="The data,"
            italic="at a glance."
          />
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-ocean-deep/15 py-10 md:grid-cols-4">
            <Stat label="Avg high" value={`${m.avgHigh}°F`} />
            <Stat label="Avg low" value={`${m.avgLow}°F`} />
            <Stat label="Ocean temp" value={`${m.waterTemp}°F`} />
            <Stat label="Rainy days" value={`${m.rainyDays}`} />
            <Stat label="Rainfall" value={`${m.rainfallInches}”`} />
            <Stat label="Humidity" value={m.humidity} />
            <Stat label="Sunset" value={m.sunset} />
            <Stat label="Daylight" value={m.daylight} />
            <Stat label="Crowd level" value={m.crowdLevel} />
            <Stat label="Rate vs July" value={`${m.rateIndex}%`} />
          </dl>
        </section>

        {/* What it feels like */}
        <section className="mx-auto mt-20 max-w-[720px]">
          <h2 className="display text-[28px] leading-[1.15] text-ink md:text-[34px]">
            What {m.name} feels like on Hilton Head
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {m.whatItFeelsLike}
          </p>
        </section>

        {/* Should you visit */}
        <section className="mx-auto mt-16 max-w-[720px] border-l-2 border-coral bg-cream-deep/40 px-6 py-6 md:px-8 md:py-8">
          <div className="eyebrow text-coral">Should you visit in {m.name}?</div>
          <p className="mt-3 text-[15px] leading-[1.7] text-ink md:text-[16px]">
            {m.recommendation}
          </p>
        </section>

        {/* Best for / watch out */}
        <section className="mx-auto mt-16 grid max-w-[1080px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="eyebrow text-coral">Best for</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {m.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-ocean-deep/10 pb-3 text-[15px] leading-[1.55] text-ink"
                >
                  <span className="mt-2 h-px w-5 shrink-0 bg-coral" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-coral">Watch out for</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {m.watchOut.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-ocean-deep/10 pb-3 text-[15px] leading-[1.55] text-ink"
                >
                  <span className="mt-2 h-px w-5 shrink-0 bg-ocean-deep/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What's open */}
        <section className="mx-auto mt-20 max-w-[720px]">
          <h2 className="display text-[28px] leading-[1.15] text-ink md:text-[34px]">
            What’s open in {m.name}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {m.whatsOpen}
          </p>
        </section>

        {/* Packing */}
        <section className="mx-auto mt-16 max-w-[720px]">
          <h2 className="display text-[28px] leading-[1.15] text-ink md:text-[34px]">
            What to pack for Hilton Head in {m.name}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {m.packing}
          </p>
        </section>

        {/* Activities */}
        <section className="mx-auto mt-16 max-w-[720px]">
          <h2 className="display text-[28px] leading-[1.15] text-ink md:text-[34px]">
            Best things to do on Hilton Head in {m.name}
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {m.bestActivities.map((activity) => (
              <li
                key={activity}
                className="flex items-start gap-3 border-b border-ocean-deep/10 pb-3 text-[15px] leading-[1.6] text-ink"
                dangerouslySetInnerHTML={{
                  __html: `<span class="mt-2 h-px w-5 shrink-0 bg-coral inline-block"></span> ${activity}`,
                }}
              />
            ))}
          </ul>
        </section>

        {/* Booking */}
        <section className="mx-auto mt-16 max-w-[720px]">
          <h2 className="display text-[28px] leading-[1.15] text-ink md:text-[34px]">
            When to book for {m.name}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {m.bookingNotes}
          </p>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-[820px]">
          <SectionHead
            number="№ 02"
            eyebrow="FAQ"
            plain={`Hilton Head ${m.name}`}
            italic="questions we hear most."
          />
          <dl className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
            {m.faq.map((item) => (
              <div
                key={item.q}
                className="grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10"
              >
                <dt className="display text-[19px] leading-[1.2] text-ink md:text-[21px]">
                  {item.q}
                </dt>
                <dd
                  className="text-[14px] leading-[1.7] text-ink-soft md:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            ))}
          </dl>
        </section>

        {/* Cross-link to all months */}
        <section className="mx-auto mt-20 max-w-[820px]">
          <div className="eyebrow text-coral">Other months</div>
          <ul className="mt-6 grid grid-cols-3 gap-3 text-center sm:grid-cols-4 md:grid-cols-6">
            {months.map((other) => {
              const active = other.slug === m.slug;
              return (
                <li key={other.slug}>
                  <Link
                    href={`/hilton-head-weather/${other.slug}`}
                    className={`block rounded-md border px-3 py-3 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? 'border-coral bg-coral text-cream'
                        : 'border-ocean-deep/15 text-ink hover:border-coral hover:text-coral'
                    }`}
                  >
                    {other.name.slice(0, 3)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Prev / next nav */}
        {(prev || next) && (
          <nav
            aria-label="Adjacent months"
            className="mx-auto mt-16 grid max-w-[820px] grid-cols-1 gap-6 border-t border-ocean-deep/15 pt-10 sm:grid-cols-2 sm:gap-10"
          >
            {prev ? (
              <Link href={`/hilton-head-weather/${prev.slug}`} className="group">
                <div className="eyebrow text-ink-soft">← {prev.name}</div>
                <div className="display mt-2 text-[18px] leading-[1.2] text-ink transition-colors group-hover:text-coral md:text-[20px]">
                  Hilton Head weather in {prev.name}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/hilton-head-weather/${next.slug}`}
                className="group sm:text-right"
              >
                <div className="eyebrow text-ink-soft">{next.name} →</div>
                <div className="display mt-2 text-[18px] leading-[1.2] text-ink transition-colors group-hover:text-coral md:text-[20px]">
                  Hilton Head weather in {next.name}
                </div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        {/* Link to full guide */}
        <section className="mx-auto mt-16 max-w-[820px] text-center">
          <p className="text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            For the full year-round picture, see the{' '}
            <Link
              href="/blog/best-time-to-visit-hilton-head"
              className="link-underline text-ink"
            >
              Hilton Head weather guide and best time to visit
            </Link>
            .
          </p>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </dt>
      <dd className="display mt-2 text-[22px] leading-[1.1] text-ink md:text-[26px]">
        {value}
      </dd>
    </div>
  );
}
