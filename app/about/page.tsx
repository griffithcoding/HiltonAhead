import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import InsiderProof from '@/components/sections/InsiderProof';
import { photos } from '@/data/photos';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getLocalBusinessSchema,
  getPersonSchema,
} from '@/app/lib/metadata';
import { testimonialsMeta } from '@/data/testimonials';

export const metadata: Metadata = generatePageMetadata({
  title: 'About: Local Travel Consulting for Hilton Head',
  description:
    'Hilton Ahead is a locally-run travel consulting service on Hilton Head Island. 255+ trips advised, real relationships with the properties and restaurants.',
  path: '/about',
  keywords: [
    'Hilton Head local travel agent',
    'Hilton Head travel expert',
    'Hilton Head vacation consultant',
  ],
});

export default function AboutPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);
  const localBusiness = getLocalBusinessSchema(
    testimonialsMeta.hasRealTestimonials
      ? {
          ratingValue: testimonialsMeta.ratingValue,
          reviewCount: testimonialsMeta.reviewCount,
        }
      : undefined,
  );
  const person = getPersonSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
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
            { name: 'About', path: '/about' },
          ]}
          className="mt-12"
        />

        <section className="mt-8 md:mt-10">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="About"
            plain="One trip, one porch,"
            italic="thirty years of paying attention."
          />
        </section>

        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <p className="dropcap max-w-[600px] text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
              Most &ldquo;Hilton Head travel experts&rdquo; you&apos;ll find online are
              call centers in Orlando, Phoenix, or Salt Lake City, reading the
              same reviews you could read yourself. Hilton Ahead isn&apos;t
              that.
            </p>

            <p className="mt-6 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              We live on the island. We drive past the villas before
              recommending them. We know which Sea Pines bike path floods after
              an August storm, which Palmetto Dunes lagoon still holds the good
              fish, and which Skull Creek table catches those last ten minutes of
              sunset in late July (you have to ask for table 7).
            </p>

            <p className="mt-6 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              That local depth is the only reason this service works. Google
              can tell you the top ten things to do. We can tell you which five
              actually match your group, which three are worth skipping, and
              which one to add that isn&apos;t on any list yet.
            </p>

            <Divider ornament="palmetto" className="my-12 text-gold" />

            <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
              How <span className="display-italic">we work.</span>
            </h2>

            <p className="mt-5 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              Every engagement starts with a 30-minute discovery call. Free,
              no pressure. We figure out your dates, your group, your budget,
              and the kind of trip you actually want (a real one, not the
              Pinterest version). From there, we send a flat-fee or
              percentage-of-spend quote, and once you approve it, we build.
            </p>

            <p className="mt-5 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              For a couple doing a long weekend, that&apos;s usually a one-page
              itinerary, three dinner reservations, and a villa pick. For a
              40-person wedding week, it&apos;s a full production plan: lodging
              across 8 to 10 properties, group transportation, rehearsal dinner,
              welcome bags, and on-island support for the three days
              you&apos;re here.
            </p>

            <p className="mt-5 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              Either way, you text us when something changes. We handle it.
            </p>

            <p className="mt-8 max-w-[600px] text-[15px] leading-[1.75] text-ink-soft">
              Curious who&apos;s on the other end of those texts?{' '}
              <Link
                href="/founder"
                className="font-medium text-coral underline decoration-coral/30 underline-offset-4 transition-colors hover:decoration-coral"
              >
                Read the founder&apos;s story →
              </Link>
            </p>
          </div>

          <aside className="flex flex-col gap-10">
            <figure className="relative aspect-[3/4] overflow-hidden rounded-md">
              <Image
                src={photos.villa.src}
                alt={photos.villa.alt}
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover photo-warm"
              />
              <figcaption className="display-italic mt-3 text-[13px] text-ink-soft">
                A Sea Pines villa we book often
              </figcaption>
            </figure>

            <div className="border-t border-ink/15 pt-8">
              <h3 className="eyebrow text-sunset">What you get</h3>
              <ul className="mt-5 space-y-4 text-[14px] leading-[1.65] text-ink-soft">
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                  <span>
                    A real human who answers texts. Same-day, seven days a
                    week.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                  <span>
                    Rates at 60+ partner properties (villas, resorts, inns).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                  <span>
                    Reservation holds at the restaurants and tee times you
                    can&apos;t book online.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                  <span>
                    On-island support during your stay. Not a hotline. Your
                    consultant.
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-ink/15 pt-8">
              <h3 className="eyebrow text-sunset">What you don&apos;t get</h3>
              <ul className="mt-5 space-y-4 text-[14px] leading-[1.65] text-ink-soft">
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-ink/40" />
                  <span>
                    Kickback-driven recommendations. We get paid by you, not
                    the properties.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-ink/40" />
                  <span>
                    Generic &ldquo;top 10&rdquo; lists. Your trip is built from
                    a blank page.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-ink/40" />
                  <span>A call center in another state.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <InsiderProof />
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
