import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import {
  SectionHead,
  Divider,
  Ticket,
} from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getStoriesCollectionSchema,
} from '@/app/lib/metadata';
import { stories } from '@/data/stories';

const KIND_LABEL = { event: 'AN EVENT', stay: 'A STAY' } as const;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Stories: Real Trips, Planned End-to-End',
  description:
    'Long-form, scroll-driven Hilton Head stories. Golf weekends, weddings, and family weeks — itineraries, route maps, the numbers, and what made each one work.',
  path: '/stories',
  keywords: [
    'Hilton Head trip stories',
    'Hilton Head itinerary stories',
    'Hilton Head golf weekend story',
    'Hilton Head wedding weekend story',
    'Hilton Head family vacation example',
    'Hilton Head trip planning examples',
  ],
});

export default function StoriesIndexPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Stories', path: '/stories' },
  ]);
  const collection = getStoriesCollectionSchema(
    stories.map((s) => ({
      slug: s.slug,
      title: s.seoTitle,
      description: s.metaDescription,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">Stories</span>
        </nav>

        {/* Hero */}
        <header className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="eyebrow eyebrow-coral">
                Real trips, planned by us
              </span>
            </div>
            <h1 className="display mt-6 text-balance text-[40px] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[52px] md:text-[80px] lg:text-[96px]">
              The trips,{' '}
              <span className="display-italic text-coral">told properly.</span>
            </h1>
            <p className="mt-6 max-w-[580px] text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
              Long-form walkthroughs of real Hilton Head events and stays we
              planned end-to-end. The route, the timing, the venues, the
              numbers, and the moment that made each one work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[11px] text-ink-soft">
              <Ticket>{stories.length} stories</Ticket>
              <Ticket>Updated quarterly</Ticket>
              <Ticket>No people in any frame</Ticket>
            </div>
          </div>

          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[460px]">
            <Image
              src={stories[0].cover.src}
              alt={stories[0].cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
            <div className="absolute left-4 top-4">
              <Ticket>Story № 01 · {stories[0].articleSection.toUpperCase()}</Ticket>
            </div>
          </figure>
        </header>

        <Divider ornament="compass" className="my-20" />

        {/* Magazine grid */}
        <section>
          <SectionHead
            number="The shelf"
            eyebrow="Read each in fifteen minutes"
            plain="Three stories,"
            italic="three different islands."
          />

          <ul className="mt-16 grid grid-cols-1 gap-12 md:gap-16">
            {stories.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={s.slug}>
                  <article
                    className={`group grid grid-cols-1 items-center gap-8 md:gap-14 ${
                      flip ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' : 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'
                    }`}
                  >
                    <Link
                      href={`/stories/${s.slug}`}
                      className={`relative block aspect-[4/3] overflow-hidden rounded-md ${
                        flip ? 'md:order-2' : ''
                      }`}
                    >
                      <Image
                        src={s.cover.src}
                        alt={s.cover.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover photo-warm transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                      <div className="absolute left-4 top-4">
                        <Ticket>
                          № {s.storyNumber} · {KIND_LABEL[s.kind]}
                        </Ticket>
                      </div>
                    </Link>
                    <div className={flip ? 'md:order-1' : ''}>
                      <span className="eyebrow eyebrow-coral">
                        {s.articleSection} · {s.date}
                      </span>
                      <h3 className="display mt-4 text-[28px] leading-[1.1] text-ink md:text-[40px]">
                        <Link
                          href={`/stories/${s.slug}`}
                          className="transition-colors hover:text-coral"
                        >
                          {s.title.plain}{' '}
                          <span className="display-italic">{s.title.italic}</span>
                        </Link>
                      </h3>
                      <p className="mt-5 max-w-[540px] text-[14.5px] leading-[1.75] text-ink-soft md:text-[15.5px]">
                        {s.hook}
                      </p>
                      <Link
                        href={`/stories/${s.slug}`}
                        className="link-underline mt-7 inline-block text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
                      >
                        Read the story →
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-28">
          <NewsletterSignup variant="inline" source="stories_index" />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
