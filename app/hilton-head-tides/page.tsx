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
import TideForecast from '@/components/tools/TideForecast';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-tides';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Tides: Live 7-Day Tide Chart & Times (2026)',
  description:
    'Live Hilton Head Island tide chart — high and low tide times for the next 7 days from NOAA, plus when to hit the beach, find shells, and book dolphin tours around the tide.',
  path: PATH,
  keywords: [
    'hilton head tides',
    'hilton head tide chart',
    'hilton head tide times',
    'tide times hilton head',
    'low tide hilton head',
    'hilton head tide schedule',
  ],
});

const TLDR =
  "Hilton Head Island has semidiurnal tides — two high tides and two low tides roughly every 24 hours, with a tidal range of about 6–8 feet. Low tide exposes wide, firm sand that's ideal for beach walks, shelling, and biking; high tide sits closer to the dunes and is better for swimming. The live 7-day chart below comes from NOAA's Fort Pulaski station, the closest official gauge — Hilton Head beaches run about 25 minutes behind those times.";

const INTRO =
  "Whether you're planning a sunrise beach walk, a shelling run at Coligny, a dolphin tour out of Broad Creek, or a cast off the sandbar, the tide sets the window. Here's the live forecast, then a quick guide to what each tide is good for.";

const TIDE_USES = [
  {
    title: 'Low tide — walking, shelling, biking, kids',
    body: "The hour or two either side of low tide is the island's best all-around beach window. The water pulls back to reveal a wide, flat, hard-packed apron of sand — firm enough to bike or run on, gentle enough for toddlers in the warm tidal pools left behind. It's also prime time for shells and sand dollars, especially along Port Royal and the sandbars off South Beach.",
  },
  {
    title: 'High tide — swimming and dune-side beach days',
    body: "At high tide the beach narrows and the water comes up toward the dunes and the beach-access boardwalks. If your plan is mostly swimming and you'd rather not walk far to get waist-deep, high tide is your friend. Just bring less gear — there's less dry sand to spread out on, especially during spring tides around the full and new moon.",
  },
  {
    title: 'A moving tide — fishing, shrimping, dolphin tours',
    body: "On-water activities want moving water, not slack. Dolphins feed on the falling tide, inshore fish and shrimp follow the current, and the marsh creeks need enough water to float a kayak. Booking a dolphin cruise, fishing charter, or kayak tour? Aim for a slot on a rising or falling tide — and check the chart above before you reserve.",
  },
];

const FAQS = [
  {
    question: 'What are the tides doing on Hilton Head today?',
    answer:
      "Hilton Head runs on a semidiurnal cycle — two high tides and two low tides about every 24 hours and 50 minutes, so each day's tides arrive roughly 50 minutes later than the day before. The live chart above shows the exact high and low times for the next seven days. Times are NOAA predictions for the Fort Pulaski station; Hilton Head beaches lag them by about 25 minutes.",
  },
  {
    question: 'Is it better to go to the beach at high tide or low tide?',
    answer:
      "Low tide is the local favorite for most beach activities: it exposes a wide, flat, hard-packed apron of sand that's perfect for walking, running, biking, building castles, and finding shells. High tide pulls the water up near the dunes, shrinks the beach, and is better if your main goal is swimming without a long walk to waist-deep water. For families with small kids, the hour either side of low tide leaves warm, shallow tidal pools.",
  },
  {
    question: 'When is the best time to find shells on Hilton Head?',
    answer:
      "Go at low tide, and ideally the low tide that follows a spring tide around the new or full moon, which drags more shells up onto the flats. Early-morning low tides beat afternoon ones — fewer people have walked the beach ahead of you. The north end (Port Royal, Fish Haul) and the toe of the island near South Beach are the most productive stretches.",
  },
  {
    question: 'Do tides affect dolphin tours, kayaking, and fishing?',
    answer:
      "Yes, significantly. Most dolphin and nature-tour operators schedule around the tide because dolphins feed on moving water and the salt-marsh creeks are only navigable above a certain level. Kayak and SUP outfitters favor the slack hour around high tide. Inshore fishing and shrimping are best on a moving tide, especially the falling tide. If you're booking an on-water activity, check the chart above and pick a slot on a moving tide.",
  },
  {
    question: 'Why does Hilton Head use the Fort Pulaski tide station?',
    answer:
      "Fort Pulaski (NOAA station 8670870), just across the Savannah River, is the nearest long-record official tide gauge to Hilton Head Island. There is no NOAA prediction station directly on the Hilton Head beachfront, so Fort Pulaski is the standard reference along this stretch of the Lowcountry. Hilton Head's open beaches see the tide about 25 minutes after the Fort Pulaski prediction; back-creek and marsh times vary more.",
  },
  {
    question: 'How big is the tidal range on Hilton Head?',
    answer:
      "The mean range is roughly 6 to 7 feet, and around the new and full moon (spring tides) it can push to 8 feet or more — a large range for the U.S. East Coast. It means the beach can look dramatically different from morning to afternoon, and it's why timing matters so much for shelling, kayaking, and finding the firm sand for a beach walk.",
  },
];

const CROSS_LINKS = [
  { href: '/hilton-head-weather', label: 'Weather by month' },
  { href: '/blog/best-time-to-visit-hilton-head', label: 'Best time to visit' },
  { href: '/hilton-head-beaches', label: 'Hilton Head beaches' },
  { href: '/hilton-head/sea-pines', label: 'Sea Pines neighborhood' },
  { href: '/hilton-head/forest-beach', label: 'Forest Beach neighborhood' },
  { href: '/cost-of-hilton-head-trip', label: 'What a trip costs' },
];

export default function HiltonHeadTidesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local guide', path: '/blog' },
    { name: 'Tides', path: PATH },
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

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Beach & tides"
            plain="Hilton Head"
            italic="tide chart & times"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          {/* TL;DR — citable block for LLM SEO + voice */}
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

        {/* Live tide forecast */}
        <section className="mt-12">
          <Suspense fallback={<TideFallback />}>
            <TideForecast />
          </Suspense>
        </section>

        {/* What each tide is good for */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            What each tide is{' '}
            <span className="display-italic">good for</span>
          </h2>
          <div className="mt-10 space-y-10">
            {TIDE_USES.map((u) => (
              <article key={u.title} className="border-t border-rule-soft pt-7">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  {u.title}
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
                  {u.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hilton Head tide{' '}
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
          <h3 className="eyebrow text-ink-soft">Plan the rest of your trip</h3>
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

        {/* Affiliate — plan and protect the beach trip */}
        <section
          aria-label="Plan your beach days"
          className="mt-20 md:mt-24"
        >
          <h2 className="eyebrow text-coral">Plan your beach days</h2>
          <AffiliateDisclosure variant="inline" className="mb-5 mt-6" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <AffiliateCard
              programId="booking"
              placement="tides/booking"
              headline="Stay steps from the sand"
              description="Oceanfront and near-beach hotels on Hilton Head with free cancellation on most stays — so you can plan your days around the tide, not the front desk."
              cta="Browse beach stays →"
            />
            <AffiliateCard
              programId="allianz"
              placement="tides/allianz"
              headline="Lock a refundable, insured trip"
              description="Coastal weather and tides shift. Travel insurance covers trip cancellation, medical, and baggage delay — worth it on a beach trip during storm season."
              cta="Get a quote →"
            />
          </div>
        </section>

        {/* Lead capture */}
        <section className="mt-20">
          <NewsletterSignup
            source="tool-page/tides"
            variant="inline"
            heading="Tide & beach intel"
            body="One dispatch a month — the best beach windows, the shelling tides, and where locals go when the crowds hit Coligny."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

function TideFallback() {
  return (
    <div className="border border-ocean-deep/15 bg-cream-deep/40 p-6 md:p-8">
      <div className="eyebrow text-sunset">7-day tide forecast</div>
      <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
        Loading the latest NOAA tide predictions…
      </p>
    </div>
  );
}
