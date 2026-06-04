import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getItemListSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { allRentalAreas } from '@/data/vacationRentals';
import { allRentals } from '@/data/rentalsCatalog';
import { photos } from '@/data/photos';
import RentalsHero from '@/components/rentals/RentalsHero';
import RentalGrid from '@/components/rentals/RentalGrid';
import Stay22Map from '@/components/rentals/Stay22Map';
import TldrBlock from '@/components/ui/TldrBlock';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const revalidate = 3600;

// Island-wide map center (mid-island).
const ISLAND_CENTER = { lat: 32.18, lng: -80.74, zoom: 11 };

const HUB_FAQ = [
  {
    question: 'Which Hilton Head neighborhood is best for a vacation rental?',
    answer:
      'Sea Pines for the iconic gated-resort experience and walkable oceanfront, Palmetto Dunes for families and golf, Forest Beach for walkability to Coligny, Shelter Cove for the marina, Port Royal for quiet larger homes, and mid-island for central value.',
  },
  {
    question: 'How far ahead should I book a Hilton Head rental?',
    answer:
      'For summer (June–August), book the best villas 6–9 months out. Shoulder season opens up 2–3 months ahead at lower rates.',
  },
  {
    question: 'Do you book the rentals directly?',
    answer:
      'We surface curated picks and a live map of every available stay, then link you to Booking.com, VRBO, or Airbnb to complete the reservation. We may earn a commission at no extra cost to you.',
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Vacation Rentals by Neighborhood',
  description:
    'Browse Hilton Head Island vacation rentals by neighborhood: Sea Pines, Palmetto Dunes, Forest Beach, Shelter Cove, Port Royal, and mid-island. Curated picks, a live map, price bands, amenities, and reviews.',
  path: '/vacation-rentals',
  keywords: [
    'Hilton Head vacation rentals',
    'Hilton Head villas',
    'Hilton Head condos',
    'Hilton Head Airbnb',
    'Hilton Head VRBO',
  ],
});

export default function VacationRentalsHubPage() {
  const areas = allRentalAreas();
  const topRentals = allRentals().slice(0, 12);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Vacation Rentals', path: '/vacation-rentals' },
  ];

  const jsonLd = [
    getBreadcrumbSchema(breadcrumbItems),
    getItemListSchema(
      'Hilton Head vacation-rental neighborhoods',
      areas.map((a) => ({ name: a.name, description: a.vibe })),
    ),
    getFaqSchema(HUB_FAQ),
    getSpeakableSchema({
      url: `${siteUrl}/vacation-rentals`,
      cssSelectors: ['.tldr-block', '.faq-answer'],
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RentalsHero
        eyebrow="🏝️ Hilton Head Island"
        h1="Hilton Head Vacation Rentals"
        intro="Curated villas, condos, and homes by neighborhood — with a live map of every available stay, honest price bands, and local picks."
        imageSrc={photos.hero.src}
        imageAlt="Hilton Head Island oceanfront villas"
        breadcrumb={breadcrumbItems.map((b) => ({ name: b.name, href: b.path }))}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mx-auto mb-12 max-w-2xl">
          <TldrBlock>
            Hilton Head&apos;s rentals split by neighborhood: Sea Pines (iconic,
            gated), Palmetto Dunes (family + golf), Forest Beach (walk to
            Coligny), Shelter Cove (marina), Port Royal (quiet, larger homes),
            and mid-island (central value). Summer runs roughly $200–800/night
            depending on area and proximity to the sand.
          </TldrBlock>
        </div>

        {/* Neighborhood cards */}
        <section className="mb-16">
          <h2 className="display mb-6 text-2xl font-medium text-ink md:text-3xl">
            Choose your neighborhood
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/vacation-rentals/${a.slug}`}
                className="group overflow-hidden rounded-3xl border border-rule-soft bg-sand-soft shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.heroImage.src}
                    alt={a.heroImage.alt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="display text-lg font-medium text-ink">{a.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.vibe}</p>
                  <p className="mt-3 text-sm font-semibold text-coral-deep">
                    {a.quickFacts[0]?.label}: {a.quickFacts[0]?.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top picks across the island */}
        <div className="mb-6 text-xs font-medium text-ink-soft">
          We may earn a commission from bookings made through these links — at no
          extra cost to you.
        </div>
        <div className="mb-16">
          <RentalGrid rentals={topRentals} heading="Editor's picks across the island" />
        </div>

        {/* Island-wide live map */}
        <div className="mb-16">
          <Stay22Map center={ISLAND_CENTER} title="Hilton Head Island" />
        </div>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
            Hilton Head rentals FAQ
          </h2>
          <div className="space-y-px">
            {HUB_FAQ.map(({ question, answer }) => (
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
      </div>
    </>
  );
}
