import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getPlaceSchema,
  getItemListSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import {
  getRentalArea,
  allRentalAreas,
} from '@/data/vacationRentals';
import { rentalsByNeighborhood } from '@/data/rentalsCatalog';
import RentalsHero from '@/components/rentals/RentalsHero';
import RentalGrid from '@/components/rentals/RentalGrid';
import BestForLinkRow from '@/components/rentals/BestForLinkRow';
import Stay22Map from '@/components/rentals/Stay22Map';
import TldrBlock from '@/components/ui/TldrBlock';
import QuickFact from '@/components/ui/QuickFact';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const revalidate = 3600;

export function generateStaticParams() {
  return allRentalAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getRentalArea(slug);
  if (!area) notFound();
  return generatePageMetadata({
    title: area.seoTitle,
    description: area.metaDescription,
    path: `/vacation-rentals/${area.slug}`,
    keywords: [
      `${area.name} vacation rentals`,
      `${area.name} villas Hilton Head`,
      `${area.name} condos`,
      `${area.name} real estate trends`,
    ],
  });
}

export default async function NeighborhoodRentalsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getRentalArea(slug);
  if (!area) notFound();

  const rentals = rentalsByNeighborhood(area.slug);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Vacation Rentals', path: '/vacation-rentals' },
    { name: area.name, path: `/vacation-rentals/${area.slug}` },
  ];

  const jsonLd = [
    getBreadcrumbSchema(breadcrumbItems),
    getPlaceSchema({
      name: `${area.name}, Hilton Head Island`,
      description: area.vibe,
      url: `${siteUrl}/vacation-rentals/${area.slug}`,
      latitude: area.geofence.center.lat,
      longitude: area.geofence.center.lng,
      containedIn: 'Hilton Head Island, SC',
    }),
    getFaqSchema(area.faq),
    getItemListSchema(
      `${area.name} vacation rentals`,
      rentals.map((r) => ({ name: r.title, description: r.editorialNote })),
    ),
    getSpeakableSchema({
      url: `${siteUrl}/vacation-rentals/${area.slug}`,
      cssSelectors: ['.tldr-block', '.faq-answer'],
    }),
  ];

  // For prev/next cross-links
  const areas = allRentalAreas();
  const idx = areas.findIndex((a) => a.slug === area.slug);
  const next = areas[(idx + 1) % areas.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RentalsHero
        eyebrow={`🏝️ ${area.name} · Hilton Head Island`}
        h1={area.h1}
        intro={area.vibe}
        imageSrc={area.heroImage.src}
        imageAlt={area.heroImage.alt}
        breadcrumb={breadcrumbItems.map((b) => ({ name: b.name, href: b.path }))}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mx-auto mb-12 max-w-2xl">
          <TldrBlock>{area.tldr}</TldrBlock>
        </div>

        {/* Curated grid */}
        <div className="mb-6 text-xs font-medium text-ink-soft">
          We may earn a commission from bookings made through these links — at no
          extra cost to you.
        </div>
        <div className="mb-12">
          <RentalGrid
            rentals={rentals}
            heading={`Our picks in ${area.name}`}
          />
        </div>

        {/* Best-for deeplinks */}
        <div className="mb-12">
          <BestForLinkRow area={area} />
        </div>

        {/* Live map */}
        <div className="mb-16">
          <Stay22Map center={area.geofence.center} title={area.name} />
        </div>

        {/* Editorial deep-dive */}
        <section className="mx-auto mb-16 max-w-3xl space-y-8">
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Who it&apos;s for</h2>
            <ul className="flex flex-wrap gap-2">
              {area.whoFor.map((w) => (
                <li key={w} className="rounded-full bg-palm-light/40 px-3 py-1 text-sm text-palm">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Beach access</h2>
            <p className="text-base leading-relaxed text-ink-soft">{area.beachAccess}</p>
          </div>
          <div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">Top amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {area.topAmenities.map((t) => (
                <li key={t} className="rounded-full bg-ocean-light/40 px-3 py-1 text-sm text-ocean-deep">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {area.quickFacts.map((f) => (
              <QuickFact key={f.label} number={f.value} label={f.label} />
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            PHASE B INSERTION POINT — <MarketTrendsSection slug={area.slug} />
            goes here (Task B12). Renders price-tier map + charts + Realtor form.
           ────────────────────────────────────────────────────────────── */}

        {/* FAQ */}
        <section className="mx-auto mb-16 max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
            {area.name} rental FAQ
          </h2>
          <div className="space-y-px">
            {area.faq.map(({ question, answer }) => (
              <details key={question} className="group border-b border-rule-soft py-4 open:pb-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                  <span>{question}</span>
                  <span className="mt-0.5 shrink-0 text-ocean transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="faq-answer mt-3 text-sm leading-relaxed text-ink-soft">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="border-t border-rule-soft pt-10 text-center">
          <Link
            href={`/vacation-rentals/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-ocean-deep"
          >
            Explore {next.name} rentals →
          </Link>
          <div className="mt-3">
            <Link href="/vacation-rentals" className="text-sm text-ink-soft hover:text-ink">
              ← All Hilton Head neighborhoods
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
