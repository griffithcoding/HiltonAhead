import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import CourseMap from '@/components/tools/CourseMap';
import CourseMatchQuiz from '@/components/tools/CourseMatchQuiz';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-golf-courses';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Golf Courses: Map & Quiz',
  description:
    'All 12 Hilton Head & Bluffton golf courses on one map, plus a 30-second quiz that ranks them for your handicap, scenery, budget, and trip length. Harbour Town, Palmetto Dunes, May River and more.',
  path: PATH,
  keywords: [
    'hilton head golf courses',
    'best golf courses hilton head',
    'hilton head golf course map',
    'which hilton head golf course',
    'harbour town golf',
    'hilton head golf course finder',
  ],
});

const TLDR =
  "Hilton Head Island and neighboring Bluffton have a dozen golf courses — from the PGA Tour's Harbour Town Golf Links to forgiving resort layouts and marsh-lined Lowcountry tracks. They span three quality tiers and a mix of public and resort-guest access. Use the map below to see where each sits, then take the 30-second quiz to get a three-course lineup matched to your handicap, scenery, budget, and trip length.";

const INTRO =
  "There's no single 'best' Hilton Head course — there's the best course for your group. Start with the lay of the land, then let the finder narrow twelve options to your three.";

const CHOOSING = [
  {
    title: 'Pedigree — designer and tournament history',
    body: "At the top sits Harbour Town Golf Links, the Pete Dye design that hosts the RBC Heritage each April. Other courses carry names like Robert Trent Jones, George Fazio, and Arthur Hills, and Bluffton's May River at Palmetto Bluff is a Jack Nicklaus signature. The finder weights this as course 'tier.'",
  },
  {
    title: 'Access — public vs. resort-guest',
    body: "Some courses welcome any public booking; others give priority (or better rates) to guests of the affiliated resort, and a couple are private. If you're not staying inside Sea Pines or Palmetto Dunes, filter the quiz to public-play so you only see what you can actually book.",
  },
  {
    title: 'Scenery — ocean, marsh, or Lowcountry forest',
    body: "The views are part of the round. A few holes touch the Atlantic or Calibogue Sound, many wind through salt marsh, and others run under live oaks and Lowcountry pines. Tell the quiz what you came to see and it favors courses that deliver it.",
  },
];

const FAQS = [
  {
    question: 'How many golf courses are on Hilton Head Island?',
    answer:
      "Counting the island and immediately neighboring Bluffton, there are about a dozen courses commonly played on a Hilton Head golf trip — a mix of resort, semi-private, and public layouts. The map above pins all twelve we track, with designer, location, and green fee for each.",
  },
  {
    question: 'What is the best golf course on Hilton Head?',
    answer:
      "By reputation and ranking it's Harbour Town Golf Links — the RBC Heritage host with the iconic lighthouse 18th. But the 'best' course for your trip depends on your handicap, budget, and what you want to see. That's exactly what the quiz above sorts out, returning a three-course lineup tuned to your group.",
  },
  {
    question: 'Which Hilton Head golf courses are open to the public?',
    answer:
      "Several courses take public tee times directly; others prioritize resort guests or offer them better rates, and a couple are private clubs. Set the access filter in the quiz to 'public-play only' and it drops anything you'd need a resort stay to book.",
  },
  {
    question: 'What are the most forgiving courses for higher handicappers?',
    answer:
      "Generally the resort and value-tier courses play more forgiving than the championship layouts — wider corridors, fewer forced carries, and friendlier green complexes. Set your handicap band to 19+ in the quiz and it nudges its picks toward the more playable tracks while still keeping the scenery you asked for.",
  },
  {
    question: 'How much does a round of golf cost on Hilton Head?',
    answer:
      "Most courses run roughly $100–$250 in season including cart; premium tracks like Harbour Town climb past $300 in peak weeks. Twilight, winter, and summer-afternoon rates are meaningfully cheaper. Each pin on the map shows the course's peak green fee.",
  },
];

const CROSS_LINKS = [
  { href: '/hilton-head-tee-times', label: 'Book tee times' },
  { href: '/hilton-head-stay-and-play', label: 'Stay & play cost' },
  { href: '/hilton-head-golf-packages', label: 'Golf trip packages' },
  { href: '/local/golf', label: 'Golf directory' },
  { href: '/guides/2027-rbc-heritage', label: '2027 RBC Heritage kit' },
  { href: '/hilton-head/sea-pines', label: 'Sea Pines (Harbour Town)' },
];

export default function HiltonHeadGolfCoursesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Golf', path: '/local/golf' },
    { name: 'Courses', path: PATH },
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

      <div className="mx-auto max-w-[1080px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Golf"
            plain="Hilton Head"
            italic="golf courses"
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

          <p className="mt-8 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {INTRO}
          </p>
        </div>

        {/* Course map */}
        <CourseMap />

        {/* Course-match quiz */}
        <CourseMatchQuiz />

        {/* Book CTA (affiliate) */}
        <section aria-label="Book tee times" className="mt-6">
          <AffiliateDisclosure variant="inline" className="mb-5" />
          <AffiliateCard
            programId="golfnow"
            placement="golf-courses/golfnow"
            headline="Booked your lineup? Lock the tee times"
            description="Once you know your three courses, compare live tee times and tee-time deals across the island on GolfNow — often below the pro-shop walk-up rate."
            cta="See tee times on GolfNow →"
          />
        </section>

        {/* How to choose */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            How the courses{' '}
            <span className="display-italic">differ</span>
          </h2>
          <div className="mt-10 space-y-10">
            {CHOOSING.map((b) => (
              <article key={b.title} className="border-t border-rule-soft pt-7">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  {b.title}
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
                  {b.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hilton Head golf{' '}
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
          <h3 className="eyebrow text-ink-soft">Plan the rest of your golf trip</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CROSS_LINKS.map((l) => (
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
            source="tool-page/golf-courses"
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
