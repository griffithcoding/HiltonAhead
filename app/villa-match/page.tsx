import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
} from '@/app/lib/metadata';
import VillaMatchQuiz from '@/components/villa-match/VillaMatchQuiz';

export const metadata: Metadata = generatePageMetadata({
  title: 'Villa Match — Find your Hilton Head stay',
  description:
    'Five questions. We match you to the kind of villa your Hilton Head trip actually wants — neighborhood, view, walk-to-beach, all of it. No prices, no fake availability.',
  path: '/villa-match',
  keywords: [
    'Hilton Head villa quiz',
    'find a Hilton Head villa',
    'Hilton Head villa matchmaker',
    'Hilton Head vacation rental match',
  ],
});

export default function VillaMatchPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Villa Match', path: '/villa-match' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Villa Match"
            plain="Find your"
            italic="Hilton Head stay."
          />
        </section>

        <div className="mt-14 max-w-[760px]">
          <p className="text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
            Five questions. We&rsquo;ll match you to the kind of villa your trip
            actually wants &mdash; neighborhood, view, walking distance to the
            beach, all of it. No prices, no fake availability. Real picks.
          </p>
          <Divider ornament="palmetto" className="my-12 text-gold" />
        </div>

        <section className="mt-4 max-w-[760px]">
          <VillaMatchQuiz />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
