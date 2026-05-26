import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import PhotoRail from '@/components/sections/PhotoRail';
import Services from '@/components/sections/Services';
import IslandFlyover from '@/components/sections/IslandFlyover';
import InsiderProof from '@/components/sections/InsiderProof';
import LatestPosts from '@/components/sections/LatestPosts';
import LocalDirectoryPreview from '@/components/sections/LocalDirectoryPreview';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import Footer from '@/components/sections/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';
import VillaMatchEntryCard from '@/components/villa-match/VillaMatchEntryCard';
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
  title: 'Hilton Head Travel Consulting, Planned by a Local',
  description:
    'Custom Hilton Head itineraries built by a local insider. Villa booking, tee times, dinner reservations, and on-island concierge. Skip the tourist traps.',
  path: '/',
  keywords: [
    'Hilton Head travel consultant',
    'Hilton Head vacation planner',
    'Hilton Head itinerary',
    'Hilton Head villa booking',
    'Hilton Head local guide',
    'Hilton Head concierge',
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
        <Services />
        <VillaMatchEntryCard variant="feature" source="homepage" />
      </div>

      <div className="mx-auto max-w-[1280px] px-5">
        <InsiderProof />
        <LatestPosts />
        <LocalDirectoryPreview />
        <Testimonials />
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
