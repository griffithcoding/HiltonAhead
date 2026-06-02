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
  HILTON_PROPERTIES,
  HILTON_BRAND_ORDER,
  HILTON_HONORS_SIGNUP_URL,
  type HiltonProperty,
} from '@/data/hiltonProperties';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';

const PATH = '/hilton-honors-stays-hilton-head';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const metadata: Metadata = generatePageMetadata({
  title:
    'Hilton Honors Hotels on Hilton Head Island — Every Hilton-Family Stay + How Honors Pays Off Here',
  description:
    'A local-insider breakdown of every Hilton-family property on Hilton Head and in Bluffton — Hilton Grand Vacations villas, Hampton Inn, Home2 Suites, Hilton Garden Inn, Spark, DoubleTree. Cash vs points math, fifth-night-free tradeoffs, and how Honors actually plays here.',
  path: PATH,
  keywords: [
    'Hilton Hilton Head',
    'Hilton Honors Hilton Head',
    'Hilton Grand Vacations Hilton Head',
    'Hampton Inn Hilton Head',
    'Hampton Inn Bluffton',
    'Home2 Suites Bluffton',
    'Hilton Garden Inn Bluffton',
    'Hilton Honors points Hilton Head',
    'Hilton vs Marriott Hilton Head',
    'Hilton Honors fifth night free',
  ],
});

// ───────────────────────────────────────────────────────────────────────
// TL;DR — Hilton vs Marriott on HHI
// ───────────────────────────────────────────────────────────────────────

const VS_ROWS: ReadonlyArray<{
  question: string;
  hilton: string;
  marriott: string;
}> = [
  {
    question: 'You want an oceanfront villa',
    hilton: 'Only Ocean Oak (one property)',
    marriott: 'Almost always — five oceanfront MVC + the Westin',
  },
  {
    question: 'You want a cheap points-friendly weeknight room',
    hilton: 'Spark, Hampton, or Home2 — strong low-points value',
    marriott: 'No real budget tier on or near the island',
  },
  {
    question: "You're chasing fifth-night-free on awards",
    hilton: 'Hilton Honors Gold+ gets it on standard reward stays',
    marriott: 'Bonvoy has no fifth-night-free equivalent',
  },
  {
    question: 'You want full-service resort + spa',
    hilton: 'Not in the Hilton family here',
    marriott: 'The Westin Hilton Head delivers it',
  },
];

// ───────────────────────────────────────────────────────────────────────
// FAQ
// ───────────────────────────────────────────────────────────────────────

const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'Does Hilton have hotels directly on Hilton Head Island?',
    answer:
      'Yes. The only true oceanfront Hilton-family property is Hilton Grand Vacations Club Ocean Oak Resort on Folly Field beach. Several other Hilton brands sit on the island off the water — Hampton Inn, Home2 Suites, Hilton Garden Inn, Spark, and a DoubleTree — plus more in nearby Bluffton. If you specifically want Hilton points on oceanfront sand here, Ocean Oak is the one.',
  },
  {
    question: 'How many Hilton Honors points for a Hilton Head stay?',
    answer:
      'It ranges widely by brand and season. Peak summer nights run roughly 20,000–45,000 points at the value brands (Spark, Hampton), 35,000–70,000 at the Garden Inn and DoubleTree tier, and 80,000+ for an oceanfront Ocean Oak villa night. Shoulder season (April–May, September–October) drops those bands meaningfully. Always check live award pricing for your exact dates — these are planning ranges, not quotes.',
  },
  {
    question: 'Can I use points for Hilton Grand Vacations stays on Hilton Head?',
    answer:
      'Ocean Oak is a Hilton Grand Vacations (HGV) resort. Standard Hilton Honors award availability there is real but limited and varies week to week — peak summer villa weeks are the hardest to land on points. If you hold HGV Club points, you have more flexibility. For a guaranteed oceanfront villa week, booking cash well ahead is often the surer path.',
  },
  {
    question: "What's the closest Hampton Inn to Hilton Head Island?",
    answer:
      'There is a Hampton Inn on Hilton Head Island itself (mid-island, off US-278), and a newer Hampton Inn & Suites in the Bluffton-Sun City corridor across the bridge. The on-island Hampton saves you the 20–30 minute morning drive; the Bluffton one is usually a bit cheaper on both cash and points. For a beach week, the on-island Hampton is the better base.',
  },
  {
    question: 'Is Hilton Honors fifth-night-free available on Hilton Head?',
    answer:
      'Yes — the fifth-night-free benefit applies to standard reward (all-points) stays for Hilton Honors Gold and Diamond members, and Hilton Head properties are eligible like any other. Book five award nights and you pay points for four. It does not apply to Points & Money rates, so go all-points to capture it. This is the single biggest reason to push a Hilton Head award stay to five nights.',
  },
  {
    question: 'Should I book Hilton or Marriott on Hilton Head?',
    answer:
      'For an oceanfront villa week, Marriott wins on selection — it has five oceanfront Vacation Club properties plus the Westin, versus Hilton’s single Ocean Oak. For a value points room, a quick golf-trip base, or fifth-night-free award math, Hilton wins — it has a budget tier (Spark, Hampton, Home2) that Marriott simply does not offer here. Pick by trip type, not by loyalty reflex.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────

export default function HiltonHonorsStaysHiltonHeadPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Lodging', path: '/hilton-head-oceanfront-villas' },
    { name: 'Hilton Honors on Hilton Head', path: PATH },
  ]);

  const faqSchema = getFaqSchema(FAQS);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hilton-family properties on Hilton Head Island and Bluffton',
    numberOfItems: HILTON_PROPERTIES.length,
    itemListElement: HILTON_PROPERTIES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type':
          p.brand === 'Hilton Grand Vacations' ? 'VacationRental' : 'Hotel',
        name: p.name,
        url: `${siteUrl}${PATH}#${p.slug}`,
        description: p.positioning,
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.area,
          addressRegion: 'SC',
          addressCountry: 'US',
        },
        priceRange: '$$$',
        brand: { '@type': 'Brand', name: 'Hilton' },
      },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}${PATH}`,
    url: `${siteUrl}${PATH}`,
    name: 'Hilton Honors Hotels on Hilton Head Island',
    description:
      'Every Hilton-family property on Hilton Head and in Bluffton, with cash-vs-points math and fifth-night-free tradeoffs.',
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
            number="№ 01"
            eyebrow="Lodging · Hilton Honors"
            plain="Hilton on Hilton Head —"
            italic="every stay, honestly stacked"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <p className="text-[18px] leading-[1.5] text-ink md:text-[20px]">
            One oceanfront villa resort, a value tier Marriott can&rsquo;t match,
            and how Hilton Honors actually pays off here.
          </p>

          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Hilton Grand Vacations villas on the island. Hampton Inn, Home2,
            Hilton Garden Inn, Spark, and a DoubleTree across the island and
            Bluffton. Below is which one earns the points, which earns the cash,
            and the fifth-night-free math no corporate page bothers to explain.
          </p>

          <div className="mt-6">
            <AffiliateDisclosure variant="banner" />
          </div>

          {/* Primary affiliate CTA */}
          <div className="mt-6">
            <AffiliateCard
              programId="hilton"
              placement="hilton-stays-hhi/hero"
              headline="Browse Hilton stays on Hilton Head"
              description="See live rates and award nights across every Hilton-family property on Hilton Head and in Bluffton — Hilton Honors points eligible."
              cta="Browse Hilton on Hilton Head →"
            />
          </div>
        </div>

        {/* TL;DR — Hilton vs Marriott */}
        <section className="mt-16">
          <aside
            role="note"
            aria-label="Hilton vs Marriott on Hilton Head"
            className="tldr-block border-l-2 border-gold bg-sand-soft/40 px-6 py-6 md:px-8 md:py-7"
          >
            <p className="eyebrow mb-4 text-coral">TL;DR — Hilton vs Marriott</p>
            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[560px] text-left text-[14px]">
                <thead className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">If you want…</th>
                    <th className="py-2 pr-4 font-semibold">Hilton</th>
                    <th className="py-2 font-semibold">Marriott</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule-soft">
                  {VS_ROWS.map((r) => (
                    <tr key={r.question} className="align-top">
                      <td className="py-3 pr-4 font-medium text-ink">
                        {r.question}
                      </td>
                      <td className="py-3 pr-4 text-ink-soft">{r.hilton}</td>
                      <td className="py-3 text-ink-soft">{r.marriott}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-ink-soft">
              Loyal to Bonvoy instead?{' '}
              <Link
                href="/marriott-bonvoy-stays-hilton-head"
                className="text-ocean-deep underline hover:text-coral"
              >
                See the Marriott Bonvoy map of Hilton Head →
              </Link>
            </p>
          </aside>
        </section>

        {/* Hilton Honors primer */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            How Hilton Honors{' '}
            <span className="display-italic">actually pays off here</span>
          </h2>

          <div className="mt-8 max-w-[760px] space-y-5 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            <p>
              <strong className="text-ink">Earning.</strong> Hilton Honors
              members earn 10 base points per $1 on most stays, before tier and
              card bonuses. A typical beach week at a mid-tier Hilton Head Hilton
              earns enough for a future value-brand award night or two.
            </p>
            <p>
              <strong className="text-ink">Redemption math on HHI.</strong>{' '}
              Peak-summer award nights run roughly 20k–45k points at the value
              brands, 35k–70k at the Garden Inn / DoubleTree tier, and 80k+ for
              an oceanfront Ocean Oak villa night. Shoulder season cuts those
              bands noticeably — the points stretch furthest in April–May and
              September–October.
            </p>
            <p>
              <strong className="text-ink">Fifth-night-free.</strong> The single
              biggest perk: Gold and Diamond members get the fifth night free on
              standard all-points award stays. Five nights for the points cost of
              four — 20% off any award stay of five nights or more. Push a Hilton
              Head award week to five nights to capture it.
            </p>
            <p>
              <strong className="text-ink">Status.</strong> A Hilton credit card
              or an occasional published status-match offer is the fastest route
              to Gold, which unlocks fifth-night-free and free breakfast at many
              brands. Check for a current match before a big trip.
            </p>
          </div>

          <p className="mt-6 text-[14px] text-ink-soft">
            Not a member yet?{' '}
            <a
              href={HILTON_HONORS_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-deep underline hover:text-coral"
            >
              Join Hilton Honors free →
            </a>
          </p>
        </section>

        {/* Property cards grouped by brand band */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Every Hilton property,{' '}
            <span className="display-italic">band by band</span>
          </h2>

          {HILTON_BRAND_ORDER.map((band) => {
            const inBand = HILTON_PROPERTIES.filter((p) => p.brand === band)
              // On-island before Bluffton within each band.
              .sort((a, b) =>
                a.area === b.area ? 0 : a.area === 'Hilton Head Island' ? -1 : 1,
              );
            if (inBand.length === 0) return null;
            return (
              <div key={band} className="mt-12 first:mt-8">
                <h3 className="eyebrow text-ocean-deep">{band}</h3>
                <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                  {inBand.map((p) => (
                    <PropertyCard key={p.slug} property={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Comparison table */}
        <section className="mt-24">
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            All Hilton stays,{' '}
            <span className="display-italic">side by side</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Peak-season planning ranges. Cash is per-night pre-tax; points is
            per-night standard award. Verify live for your dates.
          </p>

          <div className="mt-8 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-sand-soft/60 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">Oceanfront</th>
                  <th className="px-4 py-3 font-semibold">Cash $/nt</th>
                  <th className="px-4 py-3 font-semibold">Points/nt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft border border-rule-soft">
                {HILTON_PROPERTIES.map((p) => (
                  <tr key={p.slug} className="align-top">
                    <td className="px-4 py-4 font-semibold text-ink">
                      <a
                        href={`#${p.slug}`}
                        className="hover:text-coral hover:underline"
                      >
                        {p.name}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{p.brand}</td>
                    <td className="px-4 py-4 text-ink-soft">{p.area}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cash vs points rubric */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Cash or points —{' '}
            <span className="display-italic">how to decide</span>
          </h2>
          <ul className="mt-8 max-w-[760px] space-y-4 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">
                →
              </span>
              <span>
                <strong className="text-ink">Burn points</strong> on peak-summer
                weekends and an Ocean Oak villa week, where cash rates spike
                hardest — that&rsquo;s where each point buys the most.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">
                →
              </span>
              <span>
                <strong className="text-ink">Pay cash</strong> in shoulder season
                at the value brands, where the nightly rate is already low and
                points are better saved for a pricier trip.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">
                →
              </span>
              <span>
                <strong className="text-ink">Always</strong> stretch an award
                stay to five nights if you&rsquo;re Gold+ — the fifth night free
                beats almost any cash discount you&rsquo;ll find.
              </span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hilton on Hilton Head{' '}
            <span className="display-italic">questions</span>
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

        {/* Cross-links */}
        <section className="mt-20">
          <Divider ornament="wave" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Related planning pages</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/marriott-bonvoy-stays-hilton-head', label: 'Marriott Bonvoy map' },
              { href: '/hilton-head-oceanfront-villas', label: 'Oceanfront villa picks' },
              { href: '/cost-of-hilton-head-trip', label: 'Cost of a Hilton Head trip' },
              { href: '/best-time-to-visit-hilton-head', label: 'Best time to visit' },
              { href: '/hilton-head-family-trip-planner', label: 'Family trip planning' },
              { href: '/southwest-airlines-to-hilton-head', label: 'Flying Southwest to HHI' },
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
// Property card
// ───────────────────────────────────────────────────────────────────────

function PropertyCard({ property: p }: { property: HiltonProperty }) {
  const concierge = `${brand.cta.bookingPagePath}?intent=hilton-property&slug=${p.slug}`;
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
        <span className="text-ink-soft">{p.area}</span>
        {p.oceanfront && (
          <span className="ml-1 rounded-full bg-coral/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-coral-deep">
            Oceanfront
          </span>
        )}
      </div>

      {/* Name */}
      <h4 className="display mt-3 text-[22px] leading-[1.12] text-ink md:text-[26px]">
        {p.name}
      </h4>
      <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-ink-soft/70">
        {p.neighborhood}
      </p>

      {/* Positioning */}
      <p className="mt-3 text-[15px] italic leading-[1.5] text-ink-soft md:text-[16px]">
        {p.positioning}
      </p>

      {/* Insider take */}
      <p className="mt-4 text-[15px] leading-[1.7] text-ink">{p.insiderTake}</p>

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
            {cashLabel} <span className="text-[11px] text-ink-soft/70">/nt</span>
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
          programId="hilton"
          placement={`hilton-stays-hhi/${p.slug}`}
          headline={`Check rates — ${p.name}`}
          cta="See on Hilton.com →"
          description="Live rates and award nights for Hilton Head and Bluffton — Hilton Honors points eligible."
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
