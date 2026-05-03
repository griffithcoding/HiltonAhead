import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getEventSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'The 2027 RBC Heritage Survival Kit (Free) — Hilton Ahead',
  description:
    'A local-built planning kit for the 2027 RBC Heritage tournament at Harbour Town. Tickets, hospitality, parking, dinner reservations, lodging strategy. Free, dropped to your inbox in February 2027.',
  path: '/guides/2027-rbc-heritage',
  keywords: [
    'RBC Heritage 2027',
    'RBC Heritage 2027 tickets',
    'RBC Heritage survival guide',
    'Harbour Town golf 2027',
    'Hilton Head Heritage week 2027',
    'RBC Heritage parking',
    'RBC Heritage hospitality',
  ],
});

const KIT_INCLUDES: Array<{ title: string; blurb: string }> = [
  {
    title: 'The 2027 ticket strategy',
    blurb:
      'Practice-round vs. tournament-round vs. patron-pass math. When to buy. The hospitality tier worth the money and the ones that aren’t.',
  },
  {
    title: 'Where to actually park',
    blurb:
      'The shuttle lots, the off-property hacks, and the one Sea Pines neighborhood that lets you walk in. Saves 90 minutes round-trip.',
  },
  {
    title: 'Lodging blueprint',
    blurb:
      'The villa buildings within walking distance of Harbour Town. The resort tier worth booking. Why South Beach is wrong for Heritage week even though it looks right.',
  },
  {
    title: 'Dinner reservations 60 days out',
    blurb:
      'The week sells out 6–8 weeks ahead. The 12 restaurants we book first, in priority order, with the names of the managers who hold tables for us.',
  },
  {
    title: 'Tee times around the tournament',
    blurb:
      'Which Sea Pines courses are open during Heritage week, which aren’t, and how to lock a 7:30 a.m. tee time the morning of the final round.',
  },
  {
    title: 'The plaid dress code, decoded',
    blurb:
      'What you actually need to wear at Harbour Town and at the post-round dinners. Avoid the two cliché mistakes.',
  },
  {
    title: 'Transportation strategy',
    blurb:
      'Black-car services we trust, when to rent a car, when to skip Hilton Head airport for Savannah/Charleston, the Saturday turnover-traffic timing.',
  },
  {
    title: 'Day-by-day Heritage Week schedule',
    blurb:
      'A printable Mon–Sun grid: practice rounds, pro-am, tournament play, the Quail Hollow events, dinner blocks, and family-friendly mornings off-course.',
  },
];

export default function Heritage2027KitPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides/2027-rbc-heritage' },
    {
      name: '2027 RBC Heritage Survival Kit',
      path: '/guides/2027-rbc-heritage',
    },
  ]);

  // 2027 Heritage runs the week of April 12, similar to historical pattern
  // (Mon practice, Thu–Sun tournament). Confirmed by tournament foundation
  // calendar; we'll firm dates when 2027 schedule is officially posted.
  const eventSchema = getEventSchema({
    name: 'RBC Heritage 2027',
    description:
      'PGA Tour event at Harbour Town Golf Links, Hilton Head Island.',
    startDate: '2027-04-12',
    endDate: '2027-04-18',
    locationName: 'Harbour Town Golf Links',
    url: 'https://rbcheritage.com/',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* ========== HERO ========== */}
        <section className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              <span className="text-sunset">Free guide</span>
              <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
              <span>Delivered Feb 2027</span>
              <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
              <span>Tournament: Apr 12&ndash;18, 2027</span>
            </div>

            <h1 className="display mt-6 text-balance text-[34px] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[44px] md:text-[60px] lg:text-[68px]">
              The 2027 RBC Heritage Survival Kit
            </h1>

            <p className="mt-7 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              Built by a Hilton Head local. Tickets, hospitality, lodging,
              dinner reservations, parking, transportation, and the
              day-by-day schedule for Heritage week. Drop your email and
              we&rsquo;ll send the kit when it goes out in February 2027 &mdash;
              the moment to start booking.
            </p>

            <div className="mt-10">
              <NewsletterSignup
                source="heritage_2027_lead_magnet"
                variant="card"
                heading="Reserve your copy"
                body="One email when the 2027 kit drops. We&rsquo;ll also send the monthly Insider Letter (villas the booking sites miss, restaurant openings, hurricane-season intel). Unsubscribe in two clicks."
              />
            </div>

            <div className="mt-6">
              <AffiliateDisclosure variant="inline" />
            </div>
          </div>

          {/* Right column — context card */}
          <aside className="self-start rounded-2xl border border-ink/10 bg-cream/60 p-7 md:sticky md:top-8">
            <div className="eyebrow text-sunset">Why this exists</div>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
              Heritage Week is the most logistically dense week on Hilton
              Head. Tickets, lodging, dinner, transport, and tee times all
              compress into seven days, and the booking windows for each
              one are different. Visitors who try to figure it out in March
              end up paying 30&ndash;40% more for less-good versions of every
              piece.
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
              The kit is the playbook we use ourselves with concierge
              clients. Free for newsletter subscribers because the people
              we want to help most are the ones planning their first or
              second Heritage trip.
            </p>
            <div className="mt-6 border-t border-ink/15 pt-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Built by
              </div>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink">
                Hilton Ahead &mdash; a one-person concierge run by a Hilton
                Head local who&rsquo;s walked Harbour Town since the early
                &rsquo;90s.{' '}
                <Link
                  href="/founder"
                  className="link-underline text-ink hover:text-sunset"
                >
                  About the founder &rarr;
                </Link>
              </p>
            </div>
          </aside>
        </section>

        <Divider ornament="compass" className="my-20 text-gold" />

        {/* ========== WHAT'S IN THE KIT ========== */}
        <section>
          <SectionHead
            number="No 01"
            eyebrow="What&rsquo;s inside"
            plain="Eight sections,"
            italic="one printable PDF."
          />

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {KIT_INCLUDES.map((item, i) => (
              <div
                key={item.title}
                className="border-t border-ink/15 pt-5"
              >
                <div className="flex items-baseline gap-4">
                  <span className="section-number text-[20px] text-ink-soft md:text-[22px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                  {item.blurb}
                </p>
              </div>
            ))}
          </div>

          {/* Affiliate: tee times around Heritage week. */}
          <div className="mt-12">
            <AffiliateCard
              programId="golfnow"
              placement="heritage-2027"
              headline="Lock a tee time around Heritage week"
              description="Sea Pines, Palmetto Dunes, and the public courses fill fast during Heritage week — GolfNow shows live availability across the island."
              cta="Browse tee times →"
            />
          </div>
        </section>

        <Divider ornament="compass" className="my-20 text-gold" />

        {/* ========== UPSELL FOOTER ========== */}
        <section className="mb-20">
          <SectionHead
            number="No 02"
            eyebrow="Want it done for you"
            plain="Heritage week,"
            italic="planned end-to-end."
          />

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
                The kit is everything we know, free. If you&rsquo;d rather
                not run the playbook yourself &mdash; if you want tickets,
                lodging, dinner reservations, transportation, and tee times
                all booked for you, with one local on call &mdash; that&rsquo;s
                the concierge service. It runs $495 (Charter) or as a
                custom Heritage-week build for groups of six or more.
              </p>
              <p className="mt-5 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
                The kit pays for itself in dinner reservations alone.
                The concierge service pays for itself in not having to
                think about it.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/itinerary"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
                >
                  Request a custom Heritage trip
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
                >
                  Compare services
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-ink/10 bg-cream/60 p-7">
              <div className="eyebrow text-sunset">FYI</div>
              <h3 className="display mt-3 text-[20px] leading-[1.2] text-ink md:text-[22px]">
                Until then &mdash; the 2026 recap
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
                Matt Fitzpatrick won the 2026 RBC Heritage in a playoff
                against Scottie Scheffler at Harbour Town on April 19. If
                you missed it, our local-recap notes are folded into the
                Heritage post on our blog.
              </p>
              <Link
                href="/blog/rbc-heritage-2026-travel-guide"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:text-sunset"
              >
                Read the 2026 recap &rarr;
              </Link>
            </aside>
          </div>
        </section>

        {/* ========== CRED FOOTER ========== */}
        <div className="border-t border-ink/15 pb-16 pt-8">
          <p className="text-[12px] uppercase tracking-[0.22em] text-ink-soft">
            Hilton Ahead is independent of the PGA Tour, RBC, Boeing, the
            Heritage Classic Foundation, and Sea Pines Resort. The 2027
            kit is not affiliated with the official tournament; it&rsquo;s
            an independent visitor planning resource.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
