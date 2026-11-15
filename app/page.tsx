import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import PhotoRail from '@/components/sections/PhotoRail';
import Services from '@/components/sections/Services';
import { servicesEnabled } from '@/data/features';
import IslandFlyover from '@/components/sections/IslandFlyover';
import InsiderProof from '@/components/sections/InsiderProof';
import LatestPosts from '@/components/sections/LatestPosts';
import LocalDirectoryPreview from '@/components/sections/LocalDirectoryPreview';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import Footer from '@/components/sections/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';
import {
  generatePageMetadata,
  getTravelAgencySchema,
  getLocalBusinessSchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import { faq } from '@/data/faq';
import { testimonialsMeta } from '@/data/testimonials';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Travel Guide, Written by a Local',
  description:
    'Hilton Head travel guides from a local insider: where to stay, where to eat, tee times, beaches and the details the brochures skip. Skip the tourist traps.',
  path: '/',
  keywords: [
    'Hilton Head travel guide',
    'Hilton Head vacation guide',
    'Hilton Head itinerary',
    'Hilton Head villa rentals',
    'Hilton Head local guide',
    'Hilton Head local tips',
  ],
});

export default function Home() {
  const travelAgencySchema = getTravelAgencySchema();
  const localBusinessSchema = getLocalBusinessSchema(
    testimonialsMeta.hasRealTestimonials
      ? {
          ratingValue: testimonialsMeta.ratingValue,
          reviewCount: testimonialsMeta.reviewCount,
        }
      : undefined,
  );
  const breadcrumbSchema = getBreadcrumbSchema([{ name: 'Home', path: '/' }]);
  const faqSchema = getFaqSchema(faq.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[1280px] px-5 pb-0 pt-0">
        <Header />
        <Hero />
      </div>

      {/* Full-bleed cinematic drone flyover — anchors immediately below the hero */}
      <IslandFlyover />

      {/* Full-bleed look-book photo rail on deep-ocean field */}
      <PhotoRail />

      <div className="mx-auto max-w-[1280px] px-5">
        {servicesEnabled && <Services />}
        <aside
          aria-label="Hilton Head packing list cross-link"
          className="mx-auto mt-12 max-w-[760px] border-l-2 border-coral bg-cream/40 px-5 py-4 text-[14px] leading-snug text-ink-soft md:mt-16 md:py-5 md:text-[15px]"
        >
          <span className="font-semibold uppercase tracking-[0.12em] text-coral">
            Before you pack ·{' '}
          </span>
          First-timer gear traps Hilton Head will punish you for —{' '}
          <a
            href="/hilton-head-packing-list"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            the 10-mistake packing list
          </a>
          .
        </aside>
      </div>

      <div className="mx-auto max-w-[1280px] px-5">
        <InsiderProof />
        <LatestPosts />
        <LocalDirectoryPreview />
        <Faq />
      </div>

      {/* Newsletter card — breathing room before the final full-bleed CTA */}
      <div className="mx-auto max-w-[1280px] px-5 mt-28 md:mt-36">
        <NewsletterSignup variant="card" source="homepage" />
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
