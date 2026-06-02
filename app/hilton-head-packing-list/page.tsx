import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import MistakeSkimTable from '@/components/affiliate/MistakeSkimTable';
import {
  PACKING_MISTAKES,
  resolveMistakeUrl,
} from '@/data/packingMistakes';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-packing-list';
const PAGE_URL = `${brand.url}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Packing List: 10 Mistakes First-Timers Make',
  description:
    "The 10 things first-time Hilton Head visitors get wrong — and what to bring instead. Written by a 30-year island local. Wind-rated umbrella, wide-tire beach cart, reef-safe sunscreen, and seven more.",
  path: PATH,
  keywords: [
    'Hilton Head packing list',
    'what to pack for Hilton Head',
    'Hilton Head beach essentials',
    'Hilton Head with kids',
    'Hilton Head Island packing',
  ],
});

export default function HiltonHeadPackingListPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head Packing List', path: PATH },
  ]);

  const speakable = getSpeakableSchema({
    url: PAGE_URL,
    cssSelectors: ['.tldr-block'],
  });

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hilton Head Packing List — 10 Mistakes First-Timers Make',
    numberOfItems: PACKING_MISTAKES.length,
    itemListElement: PACKING_MISTAKES.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.deepDiveHeading,
      url: `${PAGE_URL}#${m.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* ——— Hero ——— */}
        <header className="mt-12 max-w-[760px] md:mt-16">
          <p className="tldr-block rounded-lg border-l-2 border-coral bg-sand-soft/40 px-4 py-3 text-[13px] italic leading-relaxed text-ink-soft md:text-[14px]">
            Hilton Head&rsquo;s Atlantic wind, soft Coligny sand, and seasonal
            no-see-ums break gear that works on other beaches. Locals carry a
            sand-anchor umbrella, a wide-tire cart, picaridin bug spray, and
            reef-safe sunscreen — required by South Carolina ordinance.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-coral">
            Local Field Guide
          </p>
          <h1 className="display mt-3 text-[36px] leading-[1.1] text-ink md:text-[52px]">
            Hilton Head{' '}
            <span className="display-italic font-normal">Packing List.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Ten things first-time visitors get wrong, and what to bring
            instead. Written from thirty years on the island. We earn a few
            dollars from these Amazon links — full disclosure below.
          </p>
          <AffiliateDisclosure variant="banner" className="mt-6" />
        </header>

        {/* ——— Skim table ——— */}
        <section
          aria-label="Skim table: 10 mistakes and fixes"
          className="mt-16 md:mt-20"
        >
          <MistakeSkimTable />
        </section>

        {/* ——— Reef-safe ordinance callout ——— */}
        <aside
          aria-label="South Carolina reef-safe sunscreen ordinance"
          className="mt-16 border-l-2 border-ocean-deep bg-ocean-deep/5 px-5 py-5 md:mt-20 md:px-7 md:py-6"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-ocean-deep">
            Bonus — South Carolina rule
          </p>
          <p className="mt-2 text-[15px] leading-[1.7] text-ink md:text-[16px]">
            South Carolina state guidance and local Beaufort County signage
            encourage reef-safe sunscreen on coastal beaches. The oils that
            chemical sunscreens shed are tracked from the surf zone into the
            tidal creeks that feed our oyster beds and shrimp boats. Reef-safe
            isn&rsquo;t a Hawaiian thing — it&rsquo;s a Lowcountry thing.{' '}
            <a
              href="https://scdhec.gov/environment/your-water-coast/beach-access-water-quality"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
            >
              SC DHEC beach-access overview &rarr;
            </a>
          </p>
        </aside>

        {/* ——— Deep-dive sections ——— */}
        <section
          aria-label="The 10 mistakes, in depth"
          className="mt-16 max-w-[760px] md:mt-20"
        >
          {PACKING_MISTAKES.map((m) => (
            <article
              key={m.slug}
              id={m.slug}
              className="mt-12 border-t border-rule-soft pt-10 first:mt-0 first:border-0 first:pt-0"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-coral">
                {m.number}
              </p>
              <h2 className="display mt-2 text-[22px] leading-[1.2] text-ink md:text-[28px]">
                {m.deepDiveHeading}
              </h2>
              <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                {m.body}
              </p>
              <p className="mt-5 text-[13px] leading-snug text-ink-soft">
                What to buy:{' '}
                <AffiliateLink
                  programId="amazon"
                  deeplink={resolveMistakeUrl(m)}
                  placement={`trip/packing-list/${m.slug}`}
                  className="font-semibold text-ink underline-offset-4 hover:text-coral hover:underline"
                  ariaLabel={`${m.productName} on Amazon (affiliate link)`}
                >
                  {m.productName}
                </AffiliateLink>
                .
              </p>
            </article>
          ))}
        </section>

        {/* ——— Final CTA ——— */}
        <section className="mt-20 mb-24 border-t border-rule-soft pt-12 md:mt-24 md:mb-32">
          <p className="text-[11px] uppercase tracking-[0.18em] text-coral">
            One more thing
          </p>
          <h2 className="display mt-3 text-[22px] leading-[1.2] text-ink md:text-[28px]">
            Shopping for a trip?{' '}
            <span className="display-italic font-normal">Let us plan it.</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            We book by hand — villas, tee times, dinner reservations — for a
            small number of trips a year. If you&rsquo;re past the gear
            checklist and into the harder questions (which neighborhood, which
            week, which restaurants book up six weeks out), we can help.
          </p>
          <div className="mt-6">
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
            >
              Plan my trip
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
