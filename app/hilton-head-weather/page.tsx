import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import { photos } from '@/data/photos';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
} from '@/app/lib/metadata';
import { months } from '@/data/months';

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Weather by Month: All 12 Months in One Place',
  description:
    "Hilton Head Island weather, by month. Average temps, water temps, crowds, and rates for every month of 2026. Pick the right window for your trip.",
  path: '/hilton-head-weather',
  keywords: [
    'Hilton Head weather',
    'Hilton Head weather by month',
    'Hilton Head climate',
    'Hilton Head average temperature',
    'Hilton Head water temperature',
    'best time to visit Hilton Head',
  ],
});

export default function WeatherIndexPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head Weather', path: '/hilton-head-weather' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">Hilton Head Weather</span>
        </nav>

        {/* Hero */}
        <header className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <span className="eyebrow-coral eyebrow">All 12 months · 2026</span>
            <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] tracking-[-0.025em] text-ink md:text-[64px] lg:text-[72px]">
              Hilton Head weather,{' '}
              <span className="display-italic text-coral">month by month.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              Pick the right window for the trip you actually want. Each month has
              its own page with averages, water temps, what's open, and the booking
              lead time you'll need.
            </p>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[420px]">
            <Image
              src={photos.marsh.src}
              alt="Hilton Head Island marsh"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
          </figure>
        </header>

        <Divider ornament="compass" className="my-16 text-gold" />

        {/* All 12 months grid */}
        <section>
          <SectionHead
            number="№ 01"
            eyebrow="The 12 months"
            plain="Pick a month,"
            italic="open the page."
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {months.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/hilton-head-weather/${m.slug}`}
                  className="group block border-t border-ocean-deep/15 pt-6 transition-colors hover:border-coral"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="display text-[24px] leading-[1.1] text-ink transition-colors group-hover:text-coral md:text-[28px]">
                      {m.name}
                    </h3>
                    <span className="text-[12px] uppercase tracking-[0.16em] text-ink-soft">
                      {m.avgHigh}°F / {m.avgLow}°F
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] italic leading-[1.5] text-ink-soft">
                    {m.headline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    <span>Water {m.waterTemp}°F</span>
                    <span>{m.crowdLevel}</span>
                    <span>{m.rateIndex}% of July</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing pointer to the long-form post */}
        <section className="mx-auto mt-20 max-w-[820px] border-t border-ocean-deep/15 pt-12 text-center">
          <p className="text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            For the full year-round narrative with hurricane-season specifics,
            water-temperature deep dive, and packing-by-season notes, see the
            long-form{' '}
            <Link
              href="/blog/best-time-to-visit-hilton-head"
              className="link-underline text-ink"
            >
              Hilton Head weather and best time to visit guide
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
