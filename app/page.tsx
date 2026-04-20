import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
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
      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />
        <Hero />
        <Services />
        <InsiderProof />
        <LatestPosts />
        <Faq />
        <section className="mt-16">
          <NewsletterSignup variant="card" source="homepage" />
        </section>
        <FinalCta />
        <Footer />
      </div>
    </div>
  );
}
