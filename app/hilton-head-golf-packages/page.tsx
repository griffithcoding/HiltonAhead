import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';
import { golfPackagesPageEnabled } from '@/data/features';
import { golfCourses, getCourseBySlug, type GolfCourse } from '@/data/golfCourses';

const PATH = '/hilton-head-golf-packages';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Golf Packages: Prices Compared',
  description:
    'Green fees vs. stay-and-play package rates at all 12 Hilton Head and Bluffton golf courses, three sample lineups priced both ways, and where to book each one.',
  path: PATH,
  keywords: [
    'Hilton Head golf packages',
    'Hilton Head golf package prices',
    'Hilton Head stay and play',
    'Hilton Head green fees',
    'Hilton Head golf trip cost',
    'Harbour Town green fee',
    'Palmetto Dunes golf package',
  ],
});

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const ACCESS_LABEL: Record<GolfCourse['access'], string> = {
  public: 'Public',
  'resort-guests': 'Resort-guest priority',
  private: 'Private',
};

/** Priciest first, so the table reads top-shelf to value. */
const COURSES = [...golfCourses].sort((a, b) => b.peakFeeUsd - a.peakFeeUsd);

const FEE_MIN = Math.min(...golfCourses.map((c) => c.peakFeeUsd));
const FEE_MAX = Math.max(...golfCourses.map((c) => c.peakFeeUsd));
const PKG_MIN = Math.min(...golfCourses.map((c) => c.stayAndPlayFeeUsd));
const PKG_MAX = Math.max(...golfCourses.map((c) => c.stayAndPlayFeeUsd));

/** Three-round lineups priced both ways, straight from data/golfCourses.ts. */
const LINEUPS = [
  {
    name: 'The Sea Pines three',
    note: 'Harbour Town plus the two other Sea Pines Resort courses. The marquee trip, and the one where a resort stay changes the price most.',
    slugs: ['harbour-town-golf-links', 'heron-point-by-pete-dye', 'atlantic-dunes'],
  },
  {
    name: 'The Palmetto Dunes three',
    note: 'Robert Trent Jones Oceanfront, Arthur Hills, and George Fazio, all inside one resort and minutes apart.',
    slugs: [
      'rtj-oceanfront-palmetto-dunes',
      'arthur-hills-palmetto-dunes',
      'george-fazio-palmetto-dunes',
    ],
  },
  {
    name: 'The value three',
    note: 'Three public courses off the resort tee sheets. The cheapest way to play three rounds in a long weekend.',
    slugs: ['palmetto-hall', 'oyster-reef', 'old-south'],
  },
].map((l) => {
  const courses = l.slugs
    .map((s) => getCourseBySlug(s))
    .filter((c): c is GolfCourse => !!c);
  const walkUp = courses.reduce((sum, c) => sum + c.peakFeeUsd, 0);
  const packaged = courses.reduce((sum, c) => sum + c.stayAndPlayFeeUsd, 0);
  return { ...l, courses, walkUp, packaged };
});

const TLDR = `A Hilton Head golf package bundles lodging with tee times at a lower per-round rate than paying the green fee at the counter. Across the 12 courses we track, peak-season green fees run ${usd(FEE_MIN)} to ${usd(FEE_MAX)} a round and package rates run ${usd(PKG_MIN)} to ${usd(PKG_MAX)}. The table below compares both for every course, with a link to book each one.`;

const WAYS = [
  {
    title: 'Book a resort stay-and-play package',
    body: 'Sea Pines and Palmetto Dunes each sell lodging and golf together. Resort guests usually get earlier booking windows and better rates than outside play, which is the main reason to book this way if Harbour Town is on the list.',
  },
  {
    title: 'Rent a villa and book tee times yourself',
    body: 'The most flexible option for a group that wants a kitchen and its own schedule. Compare rentals near the courses you want, then book rounds one at a time. You give up resort-guest priority on the busiest tee sheets.',
  },
  {
    title: 'Fill in with tee-time deals',
    body: 'For the second and third rounds, compare open tee times a few days out. Twilight slots, summer afternoons, and winter dates are where the lowest rates show up.',
  },
];

const FAQS = [
  {
    question: 'How much does a Hilton Head golf package cost?',
    answer: `Per round, package rates at the 12 courses we track run from about ${usd(PKG_MIN)} to ${usd(PKG_MAX)} in peak season, against walk-up green fees of ${usd(FEE_MIN)} to ${usd(FEE_MAX)}. For a whole trip, a foursome doing 4 nights and 3 rounds in a villa typically lands in the low-to-mid four figures per golfer in peak season, and less in shoulder months.`,
  },
  {
    question: 'Is a package cheaper than booking golf and lodging separately?',
    answer:
      'Usually, yes. Bundled tee-time rates run below walk-up green fees, and the gap widens with more rounds and more golfers. The sample lineups above show three rounds priced both ways.',
  },
  {
    question: 'Can the public play Harbour Town Golf Links?',
    answer:
      "Yes. Harbour Town Golf Links is a resort course at The Sea Pines Resort, open to both the public and resort guests. It isn't a private club. Tee times are limited and premium, so book well ahead, especially in spring. Resort guests get priority access and better rates.",
  },
  {
    question: 'When is the cheapest time for a Hilton Head golf trip?',
    answer:
      'Shoulder season (January to February, August, and November) carries the lowest rates on both golf and lodging. Peak spring and fall cost more, and RBC Heritage week in April is the most expensive window of the year.',
  },
  {
    question: 'How far ahead should I book?',
    answer:
      'In peak season, book 30 to 60 days out for prime morning tee times. RBC Heritage week in mid-April is the exception: those tee times and Sea Pines lodging go six or more months ahead.',
  },
];

const GOLF_PAGES = [
  { href: '/hilton-head-golf-courses', label: 'Course map & match quiz' },
  { href: '/hilton-head-tee-times', label: 'Book tee times' },
  { href: '/hilton-head-stay-and-play', label: 'Stay & play cost estimator' },
  { href: '/blog/hilton-head-golf-courses-ranked', label: 'All 12 courses, ranked' },
  { href: '/blog/hilton-head-golf-packages-course-tiers', label: 'Which course tier suits your group' },
  { href: '/blog/hilton-head-golf-trip', label: 'Planning a golf trip' },
  { href: '/stories/fall-golf-weekend', label: 'Sample golf weekend itinerary' },
  { href: '/guides/2027-rbc-heritage', label: '2027 RBC Heritage kit' },
  { href: '/harbour-town-villas', label: 'Harbour Town villas' },
  { href: '/local/golf', label: 'Golf directory' },
];

export default function HiltonHeadGolfPackagesPage() {
  if (!golfPackagesPageEnabled) redirect('/');

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Golf', path: '/local/golf' },
    { name: 'Golf packages', path: PATH },
  ]);
  const faqSchema = getFaqSchema(FAQS);
  const speakable = getSpeakableSchema({
    url: `${brand.url}${PATH}`,
    cssSelectors: ['.tldr-block', '.faq-answer'],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      {/* w-full: the body is a column flex box and mx-auto disables stretch, so
          without it the price table's min-width would widen the whole page. */}
      <div className="mx-auto w-full max-w-[1080px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Golf"
            plain="Hilton Head golf packages,"
            italic="prices compared"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <aside
            role="note"
            aria-label="Quick summary"
            className="tldr-block my-2 border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
          >
            <p className="eyebrow mb-2 text-sunset">TL;DR</p>
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              {TLDR}
            </p>
          </aside>

          <AffiliateDisclosure variant="inline" className="mt-8" />
        </div>

        {/* Price comparison */}
        <section aria-labelledby="price-table" className="mt-16">
          <h2
            id="price-table"
            className="display text-[28px] leading-[1.1] text-ink md:text-[36px]"
          >
            Green fee vs. package rate,{' '}
            <span className="display-italic">course by course</span>
          </h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            Peak-season rates per round, per golfer. Rates move by week and
            time of day, so treat these as a guide and confirm on the
            course&rsquo;s own page before you book.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/15">
            <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
              <thead className="bg-sand-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Course</th>
                  <th scope="col" className="px-4 py-3 font-medium">Where</th>
                  <th scope="col" className="px-4 py-3 font-medium">Access</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Green fee</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Package rate</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">You save</th>
                  <th scope="col" className="px-4 py-3 font-medium">Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {COURSES.map((c) => {
                  const saving = c.peakFeeUsd - c.stayAndPlayFeeUsd;
                  const pct = Math.round((saving / c.peakFeeUsd) * 100);
                  return (
                    <tr key={c.slug} className="align-top">
                      <th scope="row" className="px-4 py-4 font-medium text-ink">
                        {c.name}
                        <span className="mt-0.5 block text-[12px] font-normal text-ink-soft">
                          {c.designer} · Tier {c.tier}
                        </span>
                      </th>
                      <td className="px-4 py-4 text-ink-soft">{c.location}</td>
                      <td className="px-4 py-4 text-ink-soft">
                        {ACCESS_LABEL[c.access]}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-ink">
                        {usd(c.peakFeeUsd)}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-ink">
                        {usd(c.stayAndPlayFeeUsd)}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-ink-soft">
                        {usd(saving)} ({pct}%)
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={c.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline whitespace-nowrap text-[13px] font-medium text-ink hover:text-coral"
                          aria-label={`Book ${c.name} on the course's site`}
                        >
                          Course site →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <AffiliateCard
              programId="golfnow"
              placement="golf-packages/golfnow"
              headline="Compare live tee times across the island"
              description="Open tee times and tee-time deals across Hilton Head's public and resort courses on GolfNow, often below the pro-shop walk-up rate."
              cta="See tee times on GolfNow →"
            />
          </div>
        </section>

        {/* Sample lineups */}
        <section aria-labelledby="lineups" className="mt-20">
          <h2
            id="lineups"
            className="display text-[28px] leading-[1.1] text-ink md:text-[36px]"
          >
            Three rounds,{' '}
            <span className="display-italic">priced both ways</span>
          </h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            Per golfer, golf only. Lodging is on top either way; the{' '}
            <Link
              href="/hilton-head-stay-and-play"
              className="link-underline text-ink hover:text-coral"
            >
              stay &amp; play estimator
            </Link>{' '}
            adds it in for your group size and season.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {LINEUPS.map((l) => (
              <li
                key={l.name}
                className="flex flex-col rounded-2xl border border-ink/15 bg-cream/40 p-6"
              >
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                  {l.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-soft">
                  {l.note}
                </p>
                <ul className="mt-4 space-y-1 text-[13px] text-ink-soft">
                  {l.courses.map((c) => (
                    <li key={c.slug}>{c.shortName}</li>
                  ))}
                </ul>
                <dl className="mt-auto space-y-2 border-t border-ink/15 pt-5 text-[14px]">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-ink-soft">Green fees</dt>
                    <dd className="tabular-nums text-ink">{usd(l.walkUp)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-ink-soft">Package rates</dt>
                    <dd className="tabular-nums text-ink">{usd(l.packaged)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between font-medium">
                    <dt className="text-ink">Difference</dt>
                    <dd className="tabular-nums text-coral-deep">
                      {usd(l.walkUp - l.packaged)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        {/* Ways to book */}
        <section aria-labelledby="ways-to-book" className="mt-20">
          <h2
            id="ways-to-book"
            className="display text-[28px] leading-[1.1] text-ink md:text-[36px]"
          >
            Three ways to{' '}
            <span className="display-italic">book it</span>
          </h2>
          <div className="mt-10 space-y-10">
            {WAYS.map((w) => (
              <article key={w.title} className="border-t border-rule-soft pt-7">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  {w.title}
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
                  {w.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <AffiliateCard
              programId="stay22"
              placement="golf-packages/stay22"
              headline="Compare lodging near the courses"
              description="One search across Booking, Vrbo, Airbnb, and Hotels.com for rooms and villas near the Sea Pines and Palmetto Dunes clubhouses. Resort rooms for the priority tee sheet, whole-house rentals for groups splitting a kitchen."
              cta="Compare golf-trip stays →"
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Golf package{' '}
            <span className="display-italic">questions</span>
          </h2>

          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {FAQS.map((f, i) => (
              <details
                key={f.question}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="section-number text-[18px] text-gold">
                      {`№ ${String(i + 1).padStart(2, '0')}`}
                    </span>
                    <span className="display text-[19px] leading-[1.25] text-ink md:text-[22px]">
                      {f.question}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative h-[14px] w-[14px] shrink-0"
                  >
                    <span className="absolute left-0 top-[6px] h-[1px] w-full bg-ink" />
                    <span className="absolute left-[6px] top-0 h-full w-[1px] bg-ink transition-transform group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="faq-answer mt-5 max-w-[680px] text-[15px] leading-[1.75] text-ink-soft md:pl-12">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="mt-20">
          <Divider ornament="palmetto" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Every golf page on the site</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOLF_PAGES.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-2xl border border-ink/15 bg-cream/40 px-5 py-4 transition-colors hover:border-coral hover:bg-cream"
                >
                  <span className="text-[14px] font-medium text-ink group-hover:text-coral">
                    {l.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[14px] text-ink-soft group-hover:text-coral"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Lead capture */}
        <section className="mt-20">
          <NewsletterSignup
            source="tool-page/golf-packages"
            variant="inline"
            heading="Golf intel for Hilton Head"
            body="One dispatch a month — twilight deals, the courses playing best right now, and the weeks worth booking early."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
