import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TripTypeLandingPage from '@/components/sections/TripTypeLanding';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getPlaceSchema,
} from '@/app/lib/metadata';
import { getTripTypeBySlug } from '@/data/tripTypes';

const SLUG = 'beaches';

export async function generateMetadata(): Promise<Metadata> {
  const trip = getTripTypeBySlug(SLUG);
  if (!trip) return {};
  return generatePageMetadata({
    title: trip.seoTitle,
    description: trip.metaDescription,
    path: trip.path,
    keywords: trip.keywords,
  });
}

export default function HiltonHeadBeachesPage() {
  const trip = getTripTypeBySlug(SLUG);
  if (!trip) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Beaches', path: trip.path },
  ]);
  // Place schema anchors the page to Hilton Head's geo, which helps the
  // "Hilton Head beaches" SERP where Google heavily favors local entities.
  const place = getPlaceSchema({
    name: 'Hilton Head Island Beaches',
    description: trip.metaDescription,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${trip.path}`,
    latitude: 32.1663,
    longitude: -80.7562,
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
      <TripTypeLandingPage trip={trip} />
    </>
  );
}
