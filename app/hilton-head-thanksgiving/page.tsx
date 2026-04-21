import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TripTypeLandingPage from '@/components/sections/TripTypeLanding';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/app/lib/metadata';
import { getTripTypeBySlug } from '@/data/tripTypes';

const SLUG = 'thanksgiving';

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

export default function HiltonHeadThanksgivingPage() {
  const trip = getTripTypeBySlug(SLUG);
  if (!trip) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Thanksgiving', path: trip.path },
  ]);
  const service = getServiceSchema({
    name: 'Hilton Head Thanksgiving Week Planning',
    description: trip.metaDescription,
    path: trip.path,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <TripTypeLandingPage trip={trip} />
    </>
  );
}
