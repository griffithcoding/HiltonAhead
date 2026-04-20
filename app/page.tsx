import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import WhyIsland from '@/components/sections/WhyIsland';
import PhotoRail from '@/components/sections/PhotoRail';
import Services from '@/components/sections/Services';
import InsiderProof from '@/components/sections/InsiderProof';
import LatestPosts from '@/components/sections/LatestPosts';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import Footer from '@/components/sections/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';
import {
  generatePageMetadata,
  getTravelAgencySchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import { faq } from '@/data/faq';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Travel Consulting — Planned by a Local',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[1280px] px-5 pb-0 pt-0">
        <Header />
        <Hero />
        <WhyIsland />
      </div>

      {/* Full-bleed look-book photo rail on deep-ocean field */}
      <PhotoRail />

      <div className="mx-auto max-w-[1280px] px-5">
        <Services />
        <InsiderProof />
        <LatestPosts />
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
