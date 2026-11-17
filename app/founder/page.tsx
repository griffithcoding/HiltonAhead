import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getPersonSchema,
} from '@/app/lib/metadata';
import { founder } from '@/data/founder';

export const metadata: Metadata = generatePageMetadata({
  title: 'Founder: William Griffith — Hilton Ahead Travel Co.',
  description:
    'Hilton Ahead is run by William Griffith, a Hilton Head Island local who plans every trip himself. No call centers, no franchise, no scripts.',
  path: '/founder',
  keywords: [
    'Hilton Ahead founder',
    'William Griffith Hilton Head',
    'Hilton Head local guide',
  ],
});

export default function FounderPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Founder', path: '/founder' },
  ]);
  const person = getPersonSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Founder', path: '/founder' },
          ]}
          className="mt-12"
        />

        {founder.imagePath && (
          <figure className="mx-auto mt-10 w-[220px] md:mt-12 md:w-[280px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md shadow-[0_30px_80px_-20px_rgba(10,41,48,0.4)]">
              <Image
                src={founder.imagePath}
                alt={`${founder.name}, founder of Hilton Ahead`}
                fill
                priority
                sizes="(max-width: 768px) 220px, 280px"
                className="object-cover"
              />
            </div>
            <figcaption className="eyebrow mt-4 text-center text-ink-soft">
              {founder.name}
            </figcaption>
          </figure>
        )}

        <section className="mt-10 md:mt-12">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Bio"
            plain="HiltonAhead&rsquo;s"
            italic="Founder:"
          />
        </section>

        <div className="mt-14 max-w-[680px]">
          <p className="dropcap text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
            William Griffith is the founder of Hilton Ahead, an independent
            travel guide to Hilton Head, written to help travelers
            experience the island to the fullest. I live on Hilton Head Island
            full-time, drive past the villas before I recommend them, and
            keep a working list of which restaurants will hold a seven
            o&rsquo;clock table for somebody I vouch for. The point of this
            practice isn&rsquo;t to look like a booking site. It&rsquo;s to
            give you the honest local read on a place I actually know.
          </p>

          <p className="mt-6 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            I started{' '}
            <Link
              href="/"
              className="link-underline text-ink hover:text-sunset"
            >
              hiltonahead.com
            </Link>{' '}
            because the information gap on this island is lighthouse-level
            glaring. Even searching for reliable, local guidance is met with
            mixed messaging, bloated Google search results with 10K ads,
            loops reading the same TripAdvisor pages you could read
            yourself, you name it. There is just no way to know which Sea
            Pines bike path floods after an August storm or which Skull
            Creek table catches the last ten minutes of sunset in late
            July.
          </p>

          <Divider ornament="palmetto" className="my-12 text-gold" />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
