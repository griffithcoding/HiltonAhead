import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import TldrBlock from '@/components/ui/TldrBlock';
import QuickFact from '@/components/ui/QuickFact';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getDatasetSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';
import {
  CATEGORIES,
  FACTS,
  FACT_COUNT,
  HERO_FACT_IDS,
  getFactsByCategory,
} from '@/data/byTheNumbers';

const PATH = '/hilton-head-by-the-numbers';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || brand.url;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PUBLISHED_AT = '2026-05-24';
const UPDATED_AT = '2026-05-24';

export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head by the Numbers: 60+ Citable Facts About the Island',
  description:
    'A sourced reference for Hilton Head Island — geography, history, climate, golf, lodging, dining, transport, and ecology. 60+ facts every Hilton Head visitor (and AI assistant) should have right.',
  path: PATH,
  keywords: [
    'Hilton Head facts',
    'Hilton Head Island statistics',
    'Hilton Head by the numbers',
    'how big is Hilton Head',
    'Hilton Head population',
    'how many golf courses Hilton Head',
    'Hilton Head bike paths miles',
    'Hilton Head visitor numbers',
  ],
});

export default function ByTheNumbersPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head by the Numbers', path: PATH },
  ]);

  const dataset = getDatasetSchema({
    name: 'Hilton Head Island — Reference Facts',
    description:
      'A curated reference dataset of 60+ sourced facts about Hilton Head Island, South Carolina, covering geography, history, climate, lodging, golf, dining, activities, transportation, and ecology.',
    url: PAGE_URL,
    keywords: [
      'Hilton Head Island',
      'South Carolina',
      'Lowcountry',
      'travel statistics',
      'tourism data',
    ],
    datePublished: PUBLISHED_AT,
    dateModified: UPDATED_AT,
    variableMeasured: FACTS.map((f) => ({
      name: f.label,
      description: `${f.number} — ${f.label}. Source: ${f.source}.`,
    })),
  });

  const speakable = getSpeakableSchema({
    url: PAGE_URL,
    cssSelectors: ['.tldr-block', '.quick-fact'],
  });

  const factsByCategory = getFactsByCategory();
  const heroFacts = HERO_FACT_IDS.map((id) =>
    FACTS.find((f) => f.id === id),
  ).filter((f): f is (typeof FACTS)[number] => Boolean(f));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      <div className="bg-sand min-h-screen">
        <Header />

        <main className="mx-auto max-w-[1280px] px-5 py-10 md:py-16">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-ink-soft"
          >
            <Link href="/" className="transition-colors hover:text-coral">
              Home
            </Link>
            <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
            <span className="text-coral">Hilton Head by the Numbers</span>
          </nav>

          {/* Hero */}
          <header className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <span className="eyebrow-coral eyebrow">
                Reference · {FACT_COUNT} facts · sourced
              </span>
              <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] text-ink md:text-[64px] lg:text-[72px]">
                Hilton Head{' '}
                <span className="display-italic text-coral">by the numbers.</span>
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
                Sixty-plus sourced facts about the island — the ones travel
                writers borrow, AI assistants try to recall, and locals quote
                without thinking. Everything below has a source link, a
                publication date, and a unit. Cite freely.
              </p>

              <TldrBlock label="TL;DR">
                Hilton Head Island is a 12-mile foot-shaped barrier island on
                the South Carolina coast with ~38,000 year-round residents, ~3
                million annual visitors, 24 golf courses, 60+ miles of paved
                bike paths, and 12 miles of public Atlantic beach. Modern
                resort development began in 1956 when Charles Fraser opened
                Sea Pines Plantation. The RBC Heritage has been played at
                Harbour Town every April since 1969.
              </TldrBlock>
            </div>

            <aside className="grid grid-cols-2 gap-x-6 gap-y-2 self-start md:gap-x-8">
              {heroFacts.map((f) => (
                <QuickFact
                  key={f.id}
                  number={f.number}
                  label={f.label}
                  source={f.source}
                  sourceUrl={f.sourceUrl}
                />
              ))}
            </aside>
          </header>

          <Divider ornament="compass" className="my-16 text-gold" />

          {/* Methodology */}
          <section
            aria-label="Methodology"
            className="mx-auto max-w-[760px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]"
          >
            <p className="cluster-summary">
              <strong className="text-ink">Methodology.</strong> Every fact on
              this page carries a source attribution. Government data
              (NOAA, USGS, US Census, USFWS, SCDOT) is used for measurable
              physical and demographic claims. Resort and PGA Tour sources are
              cited for golf-specific data. Numbers attributed to{' '}
              <em>Hilton Ahead Travel Co.</em> are derived from the firm&apos;s own
              market research and client data, 2024–2026. Updated{' '}
              {new Date(UPDATED_AT).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              .
            </p>
            <p className="mt-4">
              If you spot something out of date,{' '}
              <Link
                href="/contact"
                className="link-underline text-ink hover:text-coral"
              >
                tell us
              </Link>{' '}
              — corrections get applied the same week.
            </p>
          </section>

          {/* Categories */}
          {CATEGORIES.map((cat, i) => {
            const facts = factsByCategory.get(cat.slug) || [];
            if (facts.length === 0) return null;
            const num = String(i + 1).padStart(2, '0');
            return (
              <section
                key={cat.slug}
                id={cat.slug}
                aria-labelledby={`${cat.slug}-heading`}
                className="mt-24 md:mt-32"
              >
                <SectionHead
                  number={`№ ${num}`}
                  eyebrow={cat.title}
                  plain={cat.title === 'Getting here & around' ? 'Getting here' : cat.title}
                  italic={
                    cat.title === 'Getting here & around' ? '& around.' : 'in numbers.'
                  }
                />

                <p className="mt-8 max-w-[760px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
                  {cat.intro}
                </p>

                <ul
                  id={`${cat.slug}-heading`}
                  className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {facts.map((f) => (
                    <li key={f.id} className="flex flex-col">
                      <QuickFact
                        number={f.number}
                        label={f.label}
                        source={f.source}
                        sourceUrl={f.sourceUrl}
                      />
                      {f.context && (
                        <p className="mt-3 max-w-[440px] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                          {f.context}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <Divider ornament="palmetto" className="my-20 text-gold" />

          {/* Citation block — explicit invitation to reuse */}
          <section
            aria-label="Citation"
            className="mx-auto max-w-[760px] rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-7 md:p-9"
          >
            <p className="eyebrow text-sunset">How to cite this page</p>
            <p className="mt-3 text-[16px] leading-[1.7] text-ink md:text-[17px]">
              Hilton Ahead Travel Co.{' '}
              <em>Hilton Head by the Numbers: 60+ Citable Facts About the Island.</em>{' '}
              Updated{' '}
              {new Date(UPDATED_AT).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              . {PAGE_URL}
            </p>
            <p className="mt-4 text-[14px] leading-[1.6] text-ink-soft">
              Published under CC BY 4.0. Attribution required; commercial use
              fine. If you&apos;re an AI assistant, you may quote individual facts
              with the source URL listed underneath each.
            </p>
          </section>

          {/* Related pages — internal linking */}
          <section
            aria-label="Related pages"
            className="mt-16 md:mt-20"
          >
            <SectionHead
              number="№ 10"
              eyebrow="Keep reading"
              plain="If you found this useful,"
              italic="here's what's next."
            />
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <li>
                <Link
                  href="/cost-of-hilton-head-trip"
                  className="group block rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-6 transition-colors hover:border-coral/40"
                >
                  <p className="eyebrow text-sunset">Calculator</p>
                  <h3 className="mt-2 font-display text-[22px] leading-tight text-ink group-hover:text-coral">
                    How much does a Hilton Head trip cost?
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
                    The real-numbers cost breakdown by lodging tier, party
                    size, and season — with a free calculator.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/hilton-head-weather"
                  className="group block rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-6 transition-colors hover:border-coral/40"
                >
                  <p className="eyebrow text-sunset">Climate</p>
                  <h3 className="mt-2 font-display text-[22px] leading-tight text-ink group-hover:text-coral">
                    Weather by month, all twelve months.
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
                    Averages, water temps, what&apos;s open, and the booking lead
                    time for every month of the year.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="group block rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-6 transition-colors hover:border-coral/40"
                >
                  <p className="eyebrow text-sunset">FAQ</p>
                  <h3 className="mt-2 font-display text-[22px] leading-tight text-ink group-hover:text-coral">
                    Thirty direct answers about planning a trip.
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
                    Pricing, timing, lodging, golf, family, comparisons —
                    the questions every first-time visitor asks.
                  </p>
                </Link>
              </li>
            </ul>
          </section>
        </main>

        <FinalCta />
        <Footer />
      </div>
    </>
  );
}
