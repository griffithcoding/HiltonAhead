import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import { brand } from '@/data/brand';
import {
  MARRIOTT_PROPERTIES,
  type MarriottProperty,
} from '@/data/marriottProperties';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';

const PATH = '/marriott-bonvoy-stays-hilton-head';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

// ───────────────────────────────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = generatePageMetadata({
  title: 'The Marriott Bonvoy Map of Hilton Head — 7 Properties, Honestly Ranked',
  description:
    'A local-insider breakdown of every Marriott Bonvoy property on Hilton Head Island — six MVC villas plus the Westin. Cash vs points tradeoffs, neighborhood honesty, best-for picks.',
  path: PATH,
  keywords: [
    'Marriott Hilton Head',
    'Marriott Bonvoy Hilton Head',
    'Marriott Vacation Club Hilton Head',
    "Marriott's Grande Ocean",
    "Marriott's SurfWatch",
    "Marriott's Barony Beach Club",
    "Marriott's Monarch at Sea Pines",
    "Marriott's Heritage Club at Harbour Town",
    "Marriott's Sunset Pointe at Shelter Cove",
    'Westin Hilton Head Island',
    'Bonvoy points Hilton Head',
  ],
});

// ───────────────────────────────────────────────────────────────────────
// Filters (server-rendered via searchParams)
// ───────────────────────────────────────────────────────────────────────

type BrandFilter = 'all' | 'mvc' | 'westin';

interface SearchParams {
  brand?: string;
  oceanfront?: string;
}

function brandMatches(filter: BrandFilter, p: MarriottProperty): boolean {
  if (filter === 'all') return true;
  if (filter === 'mvc') return p.brand === 'Marriott Vacation Club';
  if (filter === 'westin') return p.brand === 'Westin Resort';
  return true;
}

function parseBrand(raw: string | undefined): BrandFilter {
  if (raw === 'mvc' || raw === 'westin') return raw;
  return 'all';
}

// ───────────────────────────────────────────────────────────────────────
// TL;DR picks
// ───────────────────────────────────────────────────────────────────────

const TLDR_PICKS: ReadonlyArray<{
  label: string;
  slug: string;
  why: string;
}> = [
  {
    label: 'Best oceanfront on points',
    slug: 'surfwatch',
    why: 'Lower points band than Grande Ocean, newer build, lazy-river pool complex.',
  },
  {
    label: 'Best cash deal',
    slug: 'sunset-pointe-at-shelter-cove',
    why: 'Lowest nightly of the seven — trade the beach for marina sunsets.',
  },
  {
    label: 'Best for families',
    slug: 'grande-ocean',
    why: 'Largest amenity set, true oceanfront, summer kids programming.',
  },
  {
    label: 'Best for couples',
    slug: 'westin-hilton-head-island',
    why: 'The only full-service hotel of the seven — concierge, spa, oceanfront pool deck.',
  },
  {
    label: 'Best for golfers',
    slug: 'heritage-club-at-harbour-town',
    why: 'A 90-second walk to the 18th green at Harbour Town Golf Links.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// FAQ
// ───────────────────────────────────────────────────────────────────────

const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'Which Marriott on Hilton Head is closest to the beach?',
    answer:
      "Four are directly oceanfront with a short boardwalk to the sand: Marriott's Grande Ocean, Marriott's SurfWatch, Marriott's Barony Beach Club, and Marriott's Monarch at Sea Pines. The Westin is also oceanfront. Marriott's Heritage Club at Harbour Town and Marriott's Sunset Pointe at Shelter Cove are not on the ocean — Heritage is inside Harbour Town village, and Sunset Pointe is on Broad Creek by the marina.",
  },
  {
    question: 'Which Marriott Bonvoy property on Hilton Head uses the fewest points?',
    answer:
      "Marriott's Sunset Pointe at Shelter Cove sits at the lowest points band (roughly 40,000–80,000 per night peak), followed by Marriott's Heritage Club at Harbour Town (45,000–90,000). Both are off-water properties, which is the trade-off. Grande Ocean tops the points scale at 60,000–120,000 in peak season.",
  },
  {
    question: 'Which has the best pool for kids?',
    answer:
      "Marriott's SurfWatch. The pool complex with a lazy river is the best on-property kids' setup of any Bonvoy property on the island. Grande Ocean has more pools overall but no lazy river. If the kids are going to live at the pool more than at the beach, book SurfWatch.",
  },
  {
    question: "What's the cancellation policy on Bonvoy points stays at MVC properties?",
    answer:
      "MVC villa stays booked through Marriott.com on points generally follow the standard Marriott cancellation policy — typically cancellable up to a few days before check-in — but specific dates and properties can require longer windows during peak season (RBC Heritage week, July 4 week, Christmas/New Year's). Always confirm the exact cancellation window on the booking confirmation; we double-check this every time we book on a client's behalf.",
  },
  {
    question: 'Can I use a Bonvoy free-night certificate at the Hilton Head MVC properties?',
    answer:
      "Free-night certificates from the Bonvoy Brilliant or Boundless cards (35,000–85,000-point certs) can be used at the Westin Hilton Head Island Resort & Spa. The MVC properties (Grande Ocean, SurfWatch, Barony, Monarch, Heritage Club, Sunset Pointe) are generally not eligible for standard free-night certs — they book through the MVC system rather than standard Marriott hotel inventory. Confirm at booking; the rules are evolving.",
  },
  {
    question: 'Is the Westin or Marriott Vacation Club better for couples?',
    answer:
      'Couples on a 2–4 night trip with no kids: the Westin. Daily housekeeping, a real concierge, oceanfront pool deck, the spa, dinner in the lobby. Couples on a 7-night-plus stay or anyone who wants to cook a few meals: an MVC villa beats the Westin — bigger units, kitchen, washer/dryer, lower per-night cost over a week. Monarch at Sea Pines is the most couples-friendly MVC property because of its smaller footprint.',
  },
  {
    question: 'Are there resort fees at the Marriott properties on Hilton Head?',
    answer:
      'The Westin charges a daily resort fee (currently around $40/day; verify at booking). The MVC villa properties do not charge a daily resort fee, but if the property is inside Sea Pines (Monarch, Heritage Club) you will pay the Sea Pines gate pass fee for your car — roughly $25–$50 per week per vehicle for non-resident guests. Always read the fine print on the reservation summary before confirming.',
  },
  {
    question: 'When are peak weeks at the Hilton Head Marriott properties?',
    answer:
      'Three windows reliably go to the highest points and cash bands: Easter week (movable, typically late March/April), RBC Heritage week (mid-April — Sea Pines properties spike hardest), and the first three weeks of July. Thanksgiving and the Christmas/New Year window are also elevated. Book peak weeks 6–9 months ahead for MVC inventory; the Westin opens up later but still tight.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────

export default async function TopMarriottStaysHiltonHeadPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const brandFilter = parseBrand(sp.brand);
  const oceanfrontOnly = sp.oceanfront === '1';

  const filteredProperties = MARRIOTT_PROPERTIES.filter(
    (p) =>
      brandMatches(brandFilter, p) && (!oceanfrontOnly || p.oceanfront),
  );

  // ───── JSON-LD ─────
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Lodging', path: '/hilton-head-oceanfront-villas' },
    { name: 'Marriott Bonvoy on Hilton Head', path: PATH },
  ]);

  const faqSchema = getFaqSchema(FAQS);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Marriott Bonvoy properties on Hilton Head Island',
    numberOfItems: MARRIOTT_PROPERTIES.length,
    itemListElement: MARRIOTT_PROPERTIES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': p.brand === 'Westin Resort' ? 'Hotel' : 'VacationRental',
        name: p.name,
        url: `${siteUrl}${PATH}#${p.slug}`,
        description: p.positioning,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hilton Head Island',
          addressRegion: 'SC',
          addressCountry: 'US',
        },
        priceRange: '$$$',
        brand: { '@type': 'Brand', name: p.brand },
      },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}${PATH}`,
    url: `${siteUrl}${PATH}`,
    name: 'The Marriott Bonvoy Map of Hilton Head',
    description:
      'A local-insider breakdown of every Marriott Bonvoy property on Hilton Head — six MVC villas plus the Westin.',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}#website` },
    about: { '@type': 'Place', name: 'Hilton Head Island, SC' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[1080px] px-5">
        <Header />

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Lodging · Bonvoy"
            plain="The Marriott Bonvoy"
            italic="map of Hilton Head"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <p className="text-[18px] leading-[1.5] text-ink md:text-[20px]">
            Seven properties, three points-vs-cash tradeoffs, and the one you actually want.
          </p>

          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Most Bonvoy roundups on Hilton Head read like Marriott&rsquo;s own
            site with extra steps. This is different. We book at these
            properties for clients every season — the notes below are which
            ones earn the points, which ones earn the cash, and which one you
            should actually pick for your trip. Honest about each tradeoff.
          </p>

          <div className="mt-6">
            <AffiliateDisclosure variant="banner" />
          </div>
        </div>

        {/* TL;DR */}
        <section className="mt-14">
          <aside
            role="note"
            aria-label="Quick picks summary"
            className="tldr-block border-l-2 border-gold bg-sand-soft/40 px-6 py-6 md:px-8 md:py-7"
          >
            <p className="eyebrow mb-3 text-coral">TL;DR — quick picks</p>
            <ul className="space-y-3">
              {TLDR_PICKS.map((p) => (
                <li
                  key={p.slug}
                  className="grid grid-cols-1 gap-1 md:grid-cols-[200px_1fr] md:gap-5"
                >
                  <a
                    href={`#${p.slug}`}
                    className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ocean-deep hover:text-coral"
                  >
                    {p.label}
                  </a>
                  <span className="text-[15px] leading-[1.55] text-ink-soft md:text-[16px]">
                    <a
                      href={`#${p.slug}`}
                      className="display-italic text-ink hover:text-coral"
                    >
                      {
                        MARRIOTT_PROPERTIES.find((mp) => mp.slug === p.slug)
                          ?.name
                      }
                    </a>
                    {' — '}
                    {p.why}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Filter strip */}
        <section className="mt-14" aria-label="Filter properties">
          <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="eyebrow text-ink-soft">Filter</span>

              <div className="flex items-center gap-2">
                <FilterChip
                  href={buildQuery({ brand: undefined, oceanfront: oceanfrontOnly ? '1' : undefined })}
                  active={brandFilter === 'all'}
                  label="All brands"
                />
                <FilterChip
                  href={buildQuery({ brand: 'mvc', oceanfront: oceanfrontOnly ? '1' : undefined })}
                  active={brandFilter === 'mvc'}
                  label="MVC villas"
                />
                <FilterChip
                  href={buildQuery({ brand: 'westin', oceanfront: oceanfrontOnly ? '1' : undefined })}
                  active={brandFilter === 'westin'}
                  label="Westin"
                />
              </div>

              <span className="hidden h-4 w-px bg-rule-soft md:inline-block" />

              <FilterChip
                href={buildQuery({
                  brand: brandFilter === 'all' ? undefined : brandFilter,
                  oceanfront: oceanfrontOnly ? undefined : '1',
                })}
                active={oceanfrontOnly}
                label="Oceanfront only"
              />

              <span className="ml-auto text-[12px] text-ink-soft">
                Showing {filteredProperties.length} of{' '}
                {MARRIOTT_PROPERTIES.length}
              </span>
            </div>
          </div>
        </section>

        {/* Property cards */}
        <section className="mt-12">
          {filteredProperties.length === 0 ? (
            <p className="rounded-2xl border border-rule-soft bg-sand-soft/40 px-6 py-8 text-center text-[15px] text-ink-soft">
              No properties match this filter combination.{' '}
              <Link href={PATH} className="text-ocean-deep underline">
                Clear filters
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {filteredProperties.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          )}
        </section>

        {/* Points-vs-cash explainer */}
        <section className="mt-24">
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Points vs cash —{' '}
            <span className="display-italic">how to actually decide</span>
          </h2>

          <div className="mt-8 max-w-[760px] space-y-5 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            <p>
              Bonvoy points on Hilton Head sit in a roughly 30–50 cents-per-point
              redemption band when you do the math against current cash rates —
              with the high end on peak weeks at the oceanfront MVC properties
              and the low end on off-water or shoulder-season nights. That&rsquo;s
              above the 0.85-cent average Bonvoy redemption rate everywhere
              else, which is why HHI is a strong points-burn destination, not
              a points-earn one.
            </p>
            <p>
              The single biggest perk to know about: the{' '}
              <strong className="text-ink">5th-night-free benefit</strong> on
              standard-rate award stays for Platinum, Titanium, and Ambassador
              elites. Five award nights at Grande Ocean become four nights of
              points spend — that&rsquo;s 20% off any award stay 5 nights or
              longer. Stack that with shoulder season for peak value.
            </p>
            <p>
              The MVC villa properties (Grande Ocean, SurfWatch, Barony, Monarch,
              Heritage Club, Sunset Pointe) book through the Marriott Vacation
              Club inventory pool — sometimes available as standard Bonvoy
              points stays, sometimes only as cash, depending on the week. The
              Westin books like a normal Marriott hotel and is the most
              reliably available on points.
            </p>
            <p>
              The honest take: book cash if you&rsquo;re traveling shoulder
              season at a mid-tier MVC property, and burn points on peak weeks
              at the oceanfront properties where cash rates push past $700. The
              math flips against you when you redeem points at off-peak rates.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            All seven properties,{' '}
            <span className="display-italic">side by side</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Peak-season ranges. Cash is per-night pre-tax. Points is per-night
            standard-rate award.
          </p>

          <div className="mt-8 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-sand-soft/60 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Oceanfront</th>
                  <th className="px-4 py-3 font-semibold">Cash $/nt</th>
                  <th className="px-4 py-3 font-semibold">Points/nt</th>
                  <th className="px-4 py-3 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft border border-rule-soft">
                {MARRIOTT_PROPERTIES.map((p) => (
                  <tr key={p.slug} className="align-top">
                    <td className="px-4 py-4 font-semibold text-ink">
                      <a
                        href={`#${p.slug}`}
                        className="hover:text-coral hover:underline"
                      >
                        {p.name}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-ink-soft">
                      {p.brand === 'Marriott Vacation Club' ? 'MVC' : 'Westin'}
                    </td>
                    <td className="px-4 py-4 text-ink-soft">
                      {p.oceanfront ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-ink-soft">
                      ${p.cashRangeUsd.min}–${p.cashRangeUsd.max}
                    </td>
                    <td className="px-4 py-4 tabular-nums text-ink-soft">
                      {(p.pointsRange.min / 1000).toFixed(0)}k–
                      {(p.pointsRange.max / 1000).toFixed(0)}k
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{p.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When Marriott isn't the right move */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            When Marriott{' '}
            <span className="display-italic">isn&rsquo;t the right move</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Marriott is our default recommendation for Bonvoy-loyal travelers
            and points-collectors. It is not always the best fit. Three
            scenarios where we steer clients elsewhere:
          </p>

          <ol className="mt-10 space-y-7">
            <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule-soft pt-6">
              <span className="section-number text-[28px] text-gold">01</span>
              <div>
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  You want a specific villa, not a property
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                  MVC inventory is what it is — you book a unit type, not a
                  specific oceanfront row. If you want a particular Sea Pines
                  villa with a private pool, or a Forest Beach unit on a specific
                  block, a direct Vrbo rental on a privately-owned villa beats
                  MVC availability and often the price.
                </p>
                <p className="mt-3 text-[13px] uppercase tracking-[0.12em] text-coral">
                  Try Vrbo or a Sea Pines Resort direct rental instead.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule-soft pt-6">
              <span className="section-number text-[28px] text-gold">02</span>
              <div>
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  You want a full-service luxury resort
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                  The MVC villas are not luxury hotels — they&rsquo;re
                  well-appointed timeshare units. If you want concierge, daily
                  housekeeping, and resort-tier dining at every meal, only the
                  Westin Hilton Head delivers that within Bonvoy. Outside the
                  brand, the Sonesta Resort and the Inn at Harbour Town are
                  stronger luxury picks.
                </p>
                <p className="mt-3 text-[13px] uppercase tracking-[0.12em] text-coral">
                  Book the Westin (in Bonvoy) or Sonesta / Inn at Harbour Town (out of brand).
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule-soft pt-6">
              <span className="section-number text-[28px] text-gold">03</span>
              <div>
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  You&rsquo;re staying longer than 7 nights
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                  MVC properties price in standard weekly rentals. If
                  you&rsquo;re staying 10, 14, or more nights, private villa
                  direct rentals or Sea Pines Resort multi-week pricing
                  typically beat Marriott&rsquo;s nightly rate at any tier.
                </p>
                <p className="mt-3 text-[13px] uppercase tracking-[0.12em] text-coral">
                  Book a private villa direct or via Sea Pines Resort for stays over a week.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Frequently asked{' '}
            <span className="display-italic">Bonvoy on HHI</span> questions
          </h2>

          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {FAQS.map((f, i) => (
              <details
                key={f.question}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="section-number text-[18px] text-gold">
                      {`№ ${String(i + 1).padStart(2, '0')}`}
                    </span>
                    <span className="display text-[19px] leading-[1.25] text-ink md:text-[22px]">
                      {f.question}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative h-[14px] w-[14px] shrink-0"
                  >
                    <span className="absolute left-0 top-[6px] h-[1px] w-full bg-ink" />
                    <span className="absolute left-[6px] top-0 h-full w-[1px] bg-ink transition-transform group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="faq-answer mt-5 max-w-[680px] text-[15px] leading-[1.75] text-ink-soft md:pl-12">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-20">
          <div className="rounded-3xl border border-ocean-deep/20 bg-ocean-deep/5 px-6 py-10 text-center md:px-12 md:py-14">
            <p className="eyebrow text-coral">Skip the guesswork</p>
            <h2 className="display mt-3 text-[26px] leading-[1.15] text-ink md:text-[34px]">
              Want us to book the right{' '}
              <span className="display-italic">Bonvoy property</span> for you?
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
              Tell us your dates, party size, points balance, and what
              you&rsquo;re optimizing for. We&rsquo;ll come back with the right
              property at the right rate — points or cash — and book it on your
              behalf at no extra cost.
            </p>
            <div className="mt-7">
              <Link
                href={brand.cta.bookingPagePath + '?intent=marriott-bonvoy'}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-[12px] font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
              >
                {brand.cta.label} →
              </Link>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="mt-20">
          <Divider ornament="wave" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Related planning pages</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: '/hilton-head-oceanfront-villas',
                label: 'Oceanfront villa picks',
              },
              {
                href: '/hilton-head-family-trip-planner',
                label: 'Family trip planning',
              },
              { href: '/hilton-head-honeymoon', label: 'Honeymoon trips' },
              { href: '/harbour-town-villas', label: 'Harbour Town villas' },
              {
                href: '/cost-of-hilton-head-trip',
                label: 'Cost of a Hilton Head trip',
              },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-2xl border border-ink/15 bg-cream/40 px-5 py-4 transition-colors hover:border-coral hover:bg-cream"
                >
                  <span className="text-[14px] font-medium text-ink group-hover:text-coral">
                    {l.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[14px] text-ink-soft group-hover:text-coral"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────────────

function PropertyCard({ property: p }: { property: MarriottProperty }) {
  const concierge = `${brand.cta.bookingPagePath}?intent=marriott-property&slug=${p.slug}`;
  const cashLabel = `$${p.cashRangeUsd.min}–$${p.cashRangeUsd.max}`;
  const pointsLabel = `${(p.pointsRange.min / 1000).toFixed(0)}k–${(
    p.pointsRange.max / 1000
  ).toFixed(0)}k pts`;

  return (
    <article
      id={p.slug}
      className="flex flex-col rounded-3xl border border-rule-soft bg-cream/40 p-6 md:p-7"
    >
      {/* Eyebrow */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
        <span className="font-semibold text-ocean-deep">{p.brand}</span>
        <span className="text-ink-soft/60">·</span>
        <span className="text-ink-soft">{p.neighborhood}</span>
        {p.oceanfront && (
          <span className="ml-1 rounded-full bg-coral/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-coral-deep">
            Oceanfront
          </span>
        )}
      </div>

      {/* Name */}
      <h2 className="display mt-3 text-[24px] leading-[1.12] text-ink md:text-[28px]">
        {p.name}
      </h2>

      {/* Positioning */}
      <p className="mt-2 text-[15px] italic leading-[1.5] text-ink-soft md:text-[16px]">
        {p.positioning}
      </p>

      {/* Insider take */}
      <p className="mt-5 text-[15px] leading-[1.7] text-ink md:text-[15px]">
        {p.insiderTake}
      </p>

      {/* Best for */}
      <div className="mt-5 rounded-xl border-l-2 border-gold bg-sand-soft/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
          Best for
        </p>
        <p className="mt-1 text-[14px] leading-[1.5] text-ink md:text-[15px]">
          {p.bestFor}
        </p>
      </div>

      {/* Pros / Cons */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-palm">
            Pros
          </p>
          <ul className="mt-2 space-y-1.5 text-[13.5px] leading-[1.5] text-ink-soft">
            {p.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span aria-hidden="true" className="text-palm">
                  +
                </span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
            Cons
          </p>
          <ul className="mt-2 space-y-1.5 text-[13.5px] leading-[1.5] text-ink-soft">
            {p.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span aria-hidden="true" className="text-coral">
                  −
                </span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing strip */}
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-rule-soft pt-5">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Cash, peak
          </dt>
          <dd className="mt-1 text-[15px] tabular-nums text-ink">
            {cashLabel}{' '}
            <span className="text-[11px] text-ink-soft/70">/nt</span>
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Points, peak
          </dt>
          <dd className="mt-1 text-[15px] tabular-nums text-ink">
            {pointsLabel}{' '}
            <span className="text-[11px] text-ink-soft/70">/nt</span>
          </dd>
        </div>
      </dl>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3">
        <AffiliateCard
          programId="marriott"
          deeplink={p.bookingUrl}
          placement={`marriott-landing/${p.slug}`}
          headline={`Book ${p.name.replace(/^Marriott's\s+/, '')}`}
          cta="Check Marriott availability →"
          description={`Direct to Marriott.com — Bonvoy points eligible. ${p.neighborhood}.`}
        />
        <Link
          href={concierge}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-transparent px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-ink transition-all hover:border-coral hover:text-coral"
        >
          Have us book it for you →
        </Link>
      </div>
    </article>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors',
        active
          ? 'border-ocean-deep bg-ocean-deep text-sand'
          : 'border-rule-soft bg-transparent text-ink-soft hover:border-ocean-deep hover:text-ocean-deep',
      ].join(' ')}
      scroll={false}
    >
      {label}
    </Link>
  );
}

// ───────────────────────────────────────────────────────────────────────
// URL builder
// ───────────────────────────────────────────────────────────────────────

function buildQuery(params: {
  brand?: string;
  oceanfront?: string;
}): string {
  const qs = new URLSearchParams();
  if (params.brand) qs.set('brand', params.brand);
  if (params.oceanfront) qs.set('oceanfront', params.oceanfront);
  const s = qs.toString();
  return s ? `${PATH}?${s}` : PATH;
}
