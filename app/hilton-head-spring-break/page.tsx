import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TripTypeLandingPage from '@/components/sections/TripTypeLanding';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/app/lib/metadata';
import { getTripTypeBySlug } from '@/data/tripTypes';

const SLUG = 'spring-break';

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

export default function HiltonHeadSpringBreakPage() {
  const trip = getTripTypeBySlug(SLUG);
  if (!trip) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Spring Break', path: trip.path },
  ]);
  const service = getServiceSchema({
    name: 'Hilton Head Spring Break Planning',
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

      <aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
        <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
          <span className="font-semibold uppercase tracking-[0.12em] text-coral">
            Spring break pack ·{' '}
          </span>
          Wind on the dunes, no-see-ums by May — what locals carry, in{' '}
          <a
            href="/hilton-head-packing-list"
            className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
          >
            the 10-mistake packing list
          </a>
          .
        </div>
      </aside>
    </>
  );
}
