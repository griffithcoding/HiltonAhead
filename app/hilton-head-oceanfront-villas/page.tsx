import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TripTypeLandingPage from '@/components/sections/TripTypeLanding';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/app/lib/metadata';
import { getTripTypeBySlug } from '@/data/tripTypes';

const SLUG = 'oceanfront-villas';

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

export default function HiltonHeadOceanfrontVillasPage() {
  const trip = getTripTypeBySlug(SLUG);
  if (!trip) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Oceanfront Villas', path: trip.path },
  ]);
  const service = getServiceSchema({
    name: 'Hilton Head Oceanfront Villa Booking',
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

      {/* See also — Bonvoy points-vs-cash crosslink */}
      <aside className="mx-auto -mt-8 mb-16 max-w-[1080px] px-5">
        <div className="rounded-2xl border border-rule-soft bg-sand-soft/40 px-5 py-4 text-[14px] text-ink-soft md:px-6 md:py-5 md:text-[15px]">
          <span className="font-semibold uppercase tracking-[0.12em] text-coral">
            See also ·{' '}
          </span>
          Booking on points instead?{' '}
          <Link
            href="/top-marriott-stays-hilton-head"
            className="font-semibold text-ocean-deep underline-offset-2 hover:underline"
          >
            The Marriott Bonvoy map of Hilton Head
          </Link>{' '}
          — seven properties, honest tradeoffs, cash vs points math.
        </div>
      </aside>
    </>
  );
}
