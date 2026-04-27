import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Founder: William Griffith — Hilton Ahead Travel Co.',
  description:
    'Hilton Ahead is run by William Griffith, a Hilton Head Island local who plans every trip himself. No call centers, no franchise, no scripts.',
  path: '/founder',
  keywords: [
    'Hilton Ahead founder',
    'William Griffith Hilton Head',
    'Hilton Head local travel agent',
  ],
});

export default function FounderPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Founder', path: '/founder' },
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
            eyebrow="Bio"
            plain="HiltonAhead&rsquo;s"
            italic="Founder:"
          />
        </section>

        <div className="mt-14 max-w-[680px]">
          <p className="dropcap text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
            William Griffith is the founder of Hilton Ahead, a travel
            consultancy specializing in advising travelers to experience
            Hilton Head to the fullest. I live on Hilton Head Island
            full-time, drive past the villas before I recommend them, and
            keep a working list of which restaurants will hold a seven
            o&rsquo;clock table for somebody I vouch for. The point of this
            practice isn&rsquo;t to look like a travel agency. It&rsquo;s to
            give you the honest local read on a place I actually know and
            have been a part of since the early &rsquo;90s.
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
            July. I plan one trip at a time, by hand, for people who&rsquo;d
            rather text a local than book through a 1-800 number found an
            hour into visiting a third-party site. If that&rsquo;s you, the
            form on the{' '}
            <Link
              href="/contact"
              className="link-underline text-ink hover:text-sunset"
            >
              contact page
            </Link>{' '}
            comes straight to me.
          </p>

          <p className="mt-6 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            I work with all kinds of groups &mdash; golf outings, wedding
            planning, long weekends to see the Salty Dog Cafe after
            exploring Harbour Town, whichever. Let&rsquo;s go!
          </p>

          <Divider ornament="palmetto" className="my-12 text-gold" />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
