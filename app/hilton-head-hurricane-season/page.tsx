import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import HurricaneStatus from '@/components/tools/HurricaneStatus';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-hurricane-season';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Hurricane Season: Dates, Risk & Trip Tips (2026)',
  description:
    'When is hurricane season on Hilton Head Island, how real is the risk, and how to protect a trip booked June–November. Live Atlantic storm status, plus refundable-booking and travel-insurance guidance.',
  path: PATH,
  keywords: [
    'hilton head hurricane season',
    'when is hurricane season hilton head',
    'is hilton head safe hurricane season',
    'hilton head hurricane risk',
    'hilton head weather september',
    'hilton head travel insurance',
  ],
});

const TLDR =
  "Atlantic hurricane season runs June 1 to November 30, peaking in early-to-mid September. Direct hits on Hilton Head Island are historically infrequent, but the island sits in the Atlantic basin and does see tropical impacts — rain, surf, and occasionally a mandatory evacuation (most recently Hurricane Matthew in October 2016). Most of the season is fine to travel; if you're visiting August–October, book refundable lodging and consider travel insurance. The live Atlantic-basin status below shows any active systems during season.";

const INTRO =
  "Hurricane season shouldn't scare you off a Hilton Head trip — the odds of a storm landing on your specific week are low. But a little planning makes the downside painless. Here's the live picture, the real risk, and the two moves that protect your trip.";

const CONTENT = [
  {
    title: 'When is hurricane season?',
    body: "The Atlantic hurricane season officially runs June 1 through November 30. Activity ramps through the summer and peaks in early-to-mid September, then tapers through October and November. June, July, and late November are the lowest-risk months inside the window; September is the busiest.",
  },
  {
    title: 'How often does Hilton Head actually get hit?',
    body: "Direct landfalls on Hilton Head are historically infrequent — the South Carolina Lowcountry coast takes fewer direct strikes than Florida or the Outer Banks. Far more common are peripheral effects: a few days of rain, rough surf, and rip currents as a system passes offshore. The notable recent exception was Hurricane Matthew in October 2016, which prompted a mandatory island evacuation and caused significant tree and beach damage.",
  },
  {
    title: 'If a storm threatens your trip',
    body: "Watch the National Hurricane Center (nhc.noaa.gov), not social media. If Beaufort County issues a mandatory evacuation order, it is not optional — leave when told. Most named storms give several days of notice, which is exactly why refundable lodging and travel insurance matter: you can cancel or rebook without eating the cost. Keep a flexible flight or a drive-out plan in shoulder-storm months.",
  },
  {
    title: 'Should you buy travel insurance?',
    body: "For trips in the August–October window, yes — it's cheap relative to a lodging bill and covers cancellation, interruption, and weather-related delays. Pair it with refundable lodging rates and you've removed almost all the financial downside of traveling in season. Outside the peak window the case is weaker, but it's still worth a quote on a big-ticket villa week.",
  },
];

const FAQS = [
  {
    question: 'When is hurricane season on Hilton Head Island?',
    answer:
      "The Atlantic hurricane season runs June 1 through November 30. It peaks in early-to-mid September. June, July, and late November carry the lowest risk inside the window, while September is the most active month.",
  },
  {
    question: 'Does Hilton Head get hit by hurricanes often?',
    answer:
      "Not often. Direct landfalls on the South Carolina Lowcountry are historically infrequent compared with Florida or the Carolinas' Outer Banks. The island more commonly sees peripheral effects — rain, surf, and rip currents — as systems pass offshore. Hurricane Matthew (October 2016) was the most significant recent storm, prompting a mandatory evacuation.",
  },
  {
    question: 'Is it safe to visit Hilton Head during hurricane season?',
    answer:
      "Generally, yes. Most of the June–November window passes without any storm affecting the island, and the early summer is especially low-risk. The sensible precautions for August–October travel are simple: book refundable lodging, buy travel insurance, and watch the National Hurricane Center as your trip approaches.",
  },
  {
    question: 'What happens if a hurricane is forecast during my trip?',
    answer:
      "You'll usually get several days of warning. If Beaufort County issues a mandatory evacuation, you must leave — it's enforced. With refundable lodging and travel insurance, you can cancel or rebook without losing money. This is exactly the scenario those two protections exist for.",
  },
  {
    question: 'Should I get travel insurance for a Hilton Head trip?',
    answer:
      "For trips between August and October, it's recommended — it covers trip cancellation, interruption, and weather delays for a small fraction of your lodging cost. Outside peak storm months the need is lower, but it's still worth a quick quote on an expensive villa week.",
  },
  {
    question: 'What is the riskiest month for hurricanes on Hilton Head?',
    answer:
      "September. The Atlantic basin peaks around September 10, so that's statistically the most active stretch. August and October are the next-highest. If you want to travel in late summer or fall and minimize storm odds, late November and June are the safer ends of the season.",
  },
];

const CROSS_LINKS = [
  { href: '/best-time-to-visit-hilton-head', label: 'Best time to visit Hilton Head' },
  { href: '/hilton-head-weather', label: 'Weather by month' },
  { href: '/hilton-head-tides', label: 'Tide charts' },
  { href: '/hilton-head-winter-rental', label: 'Off-season rentals' },
  { href: '/cost-of-hilton-head-trip', label: 'What a trip costs' },
  { href: '/itinerary', label: 'Plan a trip with us' },
];

export default function HiltonHeadHurricaneSeasonPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Weather', path: '/hilton-head-weather' },
    { name: 'Hurricane season', path: PATH },
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
            eyebrow="Storm safety"
            plain="Hilton Head"
            italic="hurricane season"
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

        {/* Live Atlantic-basin status (renders in season; nothing off-season) */}
        <section className="mt-10 max-w-[760px]">
          <Suspense fallback={null}>
            <HurricaneStatus />
          </Suspense>
        </section>

        {/* Evergreen guidance */}
        <section className="mt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            The honest read on{' '}
            <span className="display-italic">storm risk</span>
          </h2>
          <div className="mt-10 space-y-10">
            {CONTENT.map((b) => (
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

        {/* Affiliate — protect the trip */}
        <section aria-label="Protect your trip" className="mt-20 md:mt-24">
          <h2 className="eyebrow text-coral">Protect your trip</h2>
          <AffiliateDisclosure variant="inline" className="mb-5 mt-6" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <AffiliateCard
              programId="allianz"
              placement="hurricane-season/allianz"
              headline="Travel insurance for storm season"
              description="Covers trip cancellation, interruption, and weather delays — the single best protection for an August–October Hilton Head trip, for a fraction of your lodging bill."
              cta="Get a quote →"
            />
            <AffiliateCard
              programId="stay22"
              placement="hurricane-season/stay22"
              headline="Compare refundable stays"
              description="One search across Booking, Vrbo, Airbnb, and Hotels.com — filter for free-cancellation rates so you can rebook or cancel without losing money if a storm threatens your dates."
              cta="Compare refundable stays →"
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hurricane-season{' '}
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
          <Divider ornament="wave" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Plan around the weather</h3>
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
            source="tool-page/hurricane-season"
            variant="inline"
            heading="Hurricane-season intel"
            body="One dispatch a month — storm-window guidance, the best refundable booking moves, and when the island is at its quiet, cheap best."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
