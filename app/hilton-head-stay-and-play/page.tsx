import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import StayAndPlayEstimator from '@/components/tools/StayAndPlayEstimator';
import HeritageCountdown from '@/components/tools/HeritageCountdown';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-stay-and-play';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Stay & Play: Golf Package Cost Estimator (2026)',
  description:
    'Estimate a Hilton Head stay-and-play golf package — lodging plus tee times for your group, by nights, rounds, and season. See the package vs. retail savings, then have us book it to the dollar.',
  path: PATH,
  keywords: [
    'hilton head stay and play',
    'hilton head golf package cost',
    'stay and play hilton head',
    'hilton head golf package',
    'hilton head golf trip cost',
    'hilton head stay and play estimator',
  ],
});

const TLDR =
  "A Hilton Head stay-and-play package bundles lodging with golf at a lower per-round rate than booking tee times separately — typically a villa or resort room plus pre-arranged tee times across the island's courses. Use the estimator below to size your trip by golfers, nights, rounds, and season; it shows package vs. retail and the per-golfer total. Heritage week (April) and peak spring run highest; shoulder season is the value window.";

const INTRO =
  "Stay-and-play is the standard way groups do a Hilton Head golf trip — one booking, a better rate, and tee times locked before you arrive. Size yours below, then we can price it to the dollar.";

const HOW = [
  {
    title: 'What a stay-and-play package includes',
    body: "At its core: lodging (a villa for a foursome, or resort rooms) plus a set number of pre-booked rounds, usually with cart and sometimes range balls. Bundled rates beat walk-up green fees because resorts and booking partners package the inventory. Flights, transfers, and dining are on top — the estimator adds a dining range so the number is realistic.",
  },
  {
    title: 'When to book — and what it costs',
    body: "Peak spring (March–May) and fall are prime; Heritage week (April 12–18, 2027) is the most expensive and books a year out. Shoulder windows (January–February, August, November) cut the multiplier meaningfully. A typical foursome, 4 nights, 3 rounds in a villa lands in the low-to-mid four figures per golfer in peak season — the estimator shows your exact range.",
  },
];

const FAQS = [
  {
    question: 'What is a stay-and-play golf package on Hilton Head?',
    answer:
      "It's a bundled trip: lodging (villa or resort room) plus a set number of pre-arranged tee times, usually with carts. Because the lodging and golf are booked together, the per-round rate is lower than booking each tee time at the walk-up green fee. It's how most golf groups visit Hilton Head.",
  },
  {
    question: 'How much does a Hilton Head stay-and-play package cost?',
    answer:
      "It depends on group size, nights, rounds, lodging tier, and season. A foursome doing 4 nights and 3 rounds in a villa typically lands in the low-to-mid four figures per golfer in peak season, and less in shoulder months. Use the estimator above for your exact range — it factors green fees across all 12 courses, lodging rates, carts, and a dining estimate.",
  },
  {
    question: 'Is a package cheaper than booking golf and lodging separately?',
    answer:
      "Usually, yes — bundled tee-time rates run below walk-up green fees, and that gap widens with more rounds and golfers. The estimator shows both a 'retail' (separate booking) total and a 'package' total side by side so you can see the difference for your specific trip.",
  },
  {
    question: 'When is the cheapest time for a Hilton Head golf trip?',
    answer:
      "Shoulder season — January–February, August, and November — carries the lowest multiplier on both golf and lodging. Peak spring and fall cost more; RBC Heritage week in April is the most expensive window of the year and sells out far in advance.",
  },
  {
    question: 'Can you book the whole stay-and-play trip for me?',
    answer:
      "Yes. The estimator gives you the rough number; our itinerary service prices it to the dollar, negotiates the lodging and tee times, and hands you a finished plan — a flat $450 build fee, with the planning guidance free either way. Hit 'Have us book it' on the estimator to start.",
  },
];

const CROSS_LINKS = [
  { href: '/hilton-head-golf-packages', label: 'Curated golf packages' },
  { href: '/hilton-head-tee-times', label: 'Book tee times' },
  { href: '/hilton-head-golf-courses', label: 'Compare courses' },
  { href: '/cost-of-hilton-head-trip', label: 'Full trip cost' },
  { href: '/hilton-head/sea-pines', label: 'Sea Pines (Harbour Town)' },
  { href: '/itinerary', label: 'Have us build it' },
];

export default function HiltonHeadStayAndPlayPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Golf', path: '/local/golf' },
    { name: 'Stay & play', path: PATH },
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
            number="№ 01"
            eyebrow="Golf"
            plain="Hilton Head"
            italic="stay & play"
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

        {/* RBC Heritage countdown — Heritage week is the peak stay-and-play window */}
        <HeritageCountdown variant="banner" />

        {/* Estimator tool */}
        <StayAndPlayEstimator />

        {/* Lodging options (affiliate) */}
        <section aria-label="Book your lodging" className="mt-6">
          <AffiliateDisclosure variant="inline" className="mb-5" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <AffiliateCard
              programId="vrbo"
              placement="stay-and-play/vrbo"
              headline="Villas for the foursome"
              description="Whole-home rentals are the value play for a golf group — bedrooms for everyone, a kitchen, and space to unwind after the round."
              cta="Search Vrbo villas →"
            />
            <AffiliateCard
              programId="booking"
              placement="stay-and-play/booking"
              headline="Resort rooms near the courses"
              description="Prefer a resort with on-site golf and dining? Compare rooms with free cancellation on most stays."
              cta="Browse resorts →"
            />
            <AffiliateCard
              programId="golfnow"
              placement="stay-and-play/golfnow"
              headline="Add or compare tee times"
              description="Filling in extra rounds beyond your package? Compare live tee-time deals across the island on GolfNow."
              cta="See tee times →"
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            How stay-and-play{' '}
            <span className="display-italic">works here</span>
          </h2>
          <div className="mt-10 space-y-10">
            {HOW.map((b) => (
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
            Stay-and-play{' '}
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
          <Divider ornament="sailboat" className="mb-10 text-gold" />
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
            source="tool-page/stay-and-play"
            variant="inline"
            heading="Golf trip intel"
            body="One dispatch a month — package deals, the weeks worth booking early, and the courses playing best right now."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
