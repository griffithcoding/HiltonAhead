import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema, getPlaceSchema } from '@/app/lib/metadata';
import { neighborhoods } from '@/data/neighborhoods';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Island Neighborhoods: Where to Stay & What to Know',
  description:
    'Compare Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, and every neighborhood on Hilton Head Island. A local picks the right fit for your trip.',
  path: '/hilton-head',
  keywords: [
    'Hilton Head neighborhoods',
    'where to stay on Hilton Head Island',
    'best neighborhoods Hilton Head',
    'Sea Pines vs Palmetto Dunes',
    'Hilton Head Island areas',
    'Hilton Head villa neighborhoods',
  ],
});

export default function HiltonHeadHubPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head', path: '/hilton-head' },
  ]);
  const place = getPlaceSchema({
    name: 'Hilton Head Island, SC',
    description:
      'A barrier island off the South Carolina coast with distinct neighborhoods — Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, and more — each with its own character and villa market.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com'}/hilton-head`,
    latitude: 32.2163,
    longitude: -80.7526,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
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
          <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
          <span className="text-coral">Hilton Head</span>
        </nav>

        {/* Hero */}
        <header className="mt-10">
          <div className="eyebrow text-coral">Neighborhood Guide</div>
          <h1 className="display mt-5 max-w-[820px] text-balance text-[40px] leading-[1.02] tracking-[-0.025em] text-ink sm:text-[52px] md:text-[68px]">
            Where to stay on{' '}
            <span className="display-italic text-coral">Hilton Head Island.</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
            Hilton Head has {neighborhoods.length} distinct neighborhoods — each with its own villa
            market, beach access, and personality. Here&rsquo;s how to pick the right one before
            you book.
          </p>
        </header>

        <Divider ornament="compass" className="my-16 text-gold" />

        {/* Neighborhood grid */}
        <section aria-labelledby="neighborhoods-heading">
          <h2 id="neighborhoods-heading" className="sr-only">All Hilton Head neighborhoods</h2>
          <SectionHead
            number="№ 01"
            eyebrow="The neighborhoods"
            plain="Every community,"
            italic="compared."
          />

          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n, i) => (
              <li key={n.slug}>
                <Link
                  href={`/hilton-head/${n.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-ink/15 bg-cream/40 px-6 py-6 transition-colors hover:border-coral hover:bg-cream"
                >
                  <span className="section-number text-[20px]">{`0${i + 1}`}</span>
                  <span className="display text-[22px] leading-[1.15] text-ink group-hover:text-coral md:text-[24px]">
                    {n.name}
                  </span>
                  <span className="flex-1 text-[14px] leading-[1.6] text-ink-soft">
                    {n.bestFor[0] ?? n.hook.slice(0, 80)}
                  </span>
                  <span className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                    Read the guide &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Choosing section */}
        <section className="mt-24 max-w-[720px]" aria-labelledby="how-to-choose-heading">
          <SectionHead
            number="№ 02"
            eyebrow="How to choose"
            plain="The honest"
            italic="breakdown."
          />
          <div className="mt-10 flex flex-col gap-8">
            <article className="border-t border-ink/15 pt-8">
              <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                Want the resort experience with golf included?
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
                Book <Link href="/hilton-head/sea-pines" className="link-underline text-ink hover:text-coral">Sea Pines</Link>.
                Harbour Town Golf Links, Lighthouse Beach, and the Salty Dog Cafe are all inside
                the plantation. It&rsquo;s the most complete self-contained community on the island.
              </p>
            </article>
            <article className="border-t border-ink/15 pt-8">
              <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                Families with kids who want beach + tennis + pools?
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
                <Link href="/hilton-head/palmetto-dunes" className="link-underline text-ink hover:text-coral">Palmetto Dunes</Link> is the pick.
                Three golf courses, the Arthur Hills tennis center, a 3-mile lagoon for kayaking,
                and some of the quietest beach on the island.
              </p>
            </article>
            <article className="border-t border-ink/15 pt-8">
              <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                Walking distance to restaurants, bars, and the action?
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
                <Link href="/hilton-head/forest-beach" className="link-underline text-ink hover:text-coral">Forest Beach</Link> or{' '}
                <Link href="/hilton-head/shelter-cove" className="link-underline text-ink hover:text-coral">Shelter Cove</Link>.
                Both put you within a short walk or bike ride of the island&rsquo;s dining and
                nightlife without the plantation gate fees.
              </p>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 border-y border-ink/15 py-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="eyebrow text-coral">Still not sure?</div>
              <h2 className="display mt-3 text-[28px] leading-[1.1] text-ink md:text-[38px]">
                Tell us what you&rsquo;re after.{' '}
                <span className="display-italic text-coral">We&rsquo;ll match you.</span>
              </h2>
              <p className="mt-3 max-w-[480px] text-[14px] leading-[1.7] text-ink-soft">
                Fill out the itinerary form and describe your group. We come back with the right
                neighborhood, villa shortlist, and a quote — one business day.
              </p>
            </div>
            <Link
              href="/itinerary"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-sunset"
            >
              Request an itinerary
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
