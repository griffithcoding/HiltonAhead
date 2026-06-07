import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import TripWindowFinder from '@/components/tools/TripWindowFinder';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/best-time-to-visit-hilton-head';

export const metadata: Metadata = generatePageMetadata({
  title: 'Best Time to Visit Hilton Head: Month-by-Month Guide (2026)',
  description:
    "The best time to visit Hilton Head is mid-October — 73°F water, empty beaches, lodging 30-40% off summer peak. Rank all 12 months by what matters to you and read the honest season-by-season breakdown.",
  path: PATH,
  keywords: [
    'best time to visit hilton head',
    'cheapest time to visit hilton head',
    'when to visit hilton head',
    'hilton head best month',
    'least crowded time hilton head',
    'hilton head weather by month',
    'best month hilton head',
    'hilton head shoulder season',
  ],
});

const TLDR =
  "The best time to visit Hilton Head is mid-October. Ocean water still averages 73°F, days sit at a dry 75-80°F, hurricane risk has passed, and lodging rates run 30-40% below summer peak. Close runners-up: early May (golf, couples), mid-June (families locked to school calendars), and early December (budget). Use the finder below to rank all 12 months against your priorities — water temperature, crowds, rates, hurricane risk, and daylight.";

const INTRO =
  "There's no universal best month — only the best month for your priorities. A honeymooning couple, a golf foursome, and a family of five each want a different week. Set your priorities below and let the finder rank the year; then read the season-by-season notes underneath.";

const SEASONS = [
  {
    title: 'Spring (March–May) — the sweet spot',
    body: "Warming air, blooming Lowcountry, and rates that haven't hit summer peak. April and May are arguably the best all-around window: comfortable temperatures, fewer crowds than summer, and good golf conditions. The exceptions are Easter week and RBC Heritage week (mid-April), when Sea Pines specifically books out and prices spike.",
  },
  {
    title: 'Summer (June–August) — peak everything',
    body: "Hottest, busiest, and most expensive. The ocean is at its warmest (low 80s), daylight is long, and every family with school-age kids is here — the first three weeks of July are the absolute peak. Book months ahead, expect premium rates, and embrace the lively beach scene. It's also the start of hurricane season, though direct impacts are rare.",
  },
  {
    title: 'Fall (September–November) — the quiet value window',
    body: "September and October are a local favorite: warm water lingering from summer, thinning crowds once school resumes, and softening rates. September carries the highest hurricane-season risk of the year, so refundable bookings help. By November the island is genuinely quiet and cheap, with cool-but-pleasant days.",
  },
  {
    title: 'Winter (December–February) — cheap and calm',
    body: "The off-season. Ocean water is too cold for most swimmers and some seasonal businesses scale back, but lodging is at its cheapest, the bike paths and beaches are empty, and mild winter days are great for golf and long walks. It's the snowbird and budget window — and the easiest time to get a great villa rate.",
  },
];

const FAQS = [
  {
    question: 'What is the best time to visit Hilton Head Island?',
    answer:
      "For most travelers, April–May or September–October. These shoulder-season windows pair warm, swimmable weather with lighter crowds and lodging rates well below the July peak. Use the finder above to weight your own priorities — a couple chasing warm water will land on a different month than a family hunting the lowest rates.",
  },
  {
    question: 'What is the cheapest time to visit Hilton Head?',
    answer:
      "Winter — December through February — is the cheapest, with off-season lodging rates and empty beaches (the trade-off is cold ocean water). For a balance of low price and good weather, late fall (November) and the shoulder months of the spring and fall give you most of the savings without the winter chill.",
  },
  {
    question: 'When is the water warm enough to swim at Hilton Head?',
    answer:
      "Roughly June through October. Ocean temperatures climb into the upper 70s by June and peak in the low 80s in July and August, staying comfortable into October. May and late October are borderline — pleasant for wading, brisk for a long swim. The finder factors water temperature directly when you weight it.",
  },
  {
    question: 'When is Hilton Head least crowded?',
    answer:
      "Winter (December–February) is quietest, followed by early spring and late fall. If you want warm-ish weather with thin crowds, target the shoulder windows — late April/May before summer break, and September/October after it. Peak July is the most crowded stretch of the year.",
  },
  {
    question: 'When should I avoid visiting Hilton Head?',
    answer:
      "It depends on what you're avoiding. For crowds and high prices, skip the first three weeks of July and Easter/RBC Heritage week in April. For cold water, skip December–March. For hurricane peace of mind, the lowest-risk months are the winter and early summer; September carries the highest storm odds.",
  },
  {
    question: 'When is the best time to visit Hilton Head with kids?',
    answer:
      "Mid-June, before the July heat-plus-humidity peak and before peak villa rates. Water has hit 80°F, school is out for most US districts, and the island is busy but not yet full. Families who can travel off the school calendar should pick the second half of September instead — water still 80°F, crowds gone, rates 25-30% lower.",
  },
  {
    question: 'Is May or September better for Hilton Head?',
    answer:
      "September wins for water (80°F vs May's 74°F) and crowds (post-Labor Day exodus vs May's pre-summer build). May wins for storm risk (effectively zero vs September's hurricane peak around the 10th) and pollen-free outdoor activity. For couples or golfers, pick May. For beach families with trip insurance, pick the second half of September.",
  },
  {
    question: 'What is the off-season at Hilton Head?',
    answer:
      "Two distinct off-seasons. The deep off-season runs early January through mid-March — lodging rates 50-55% below summer, restaurants open but on reduced hours, ocean too cold to swim. The soft off-season runs mid-November through mid-December (excluding Thanksgiving) — mild 60-70°F days, lodging 40-45% off summer, holiday lights at Harbour Town in early December.",
  },
  {
    question: 'Is Hilton Head crowded in October?',
    answer:
      "No. Crowds drop noticeably after Labor Day and again after Columbus Day weekend. By mid-October, beach access is easy, you can get same-week dinner reservations at most A-tier restaurants, and the Cross Island Parkway moves freely. The only October crowd spike is Columbus Day weekend (Oct 12, 2026) for families using the long weekend.",
  },
];

const CROSS_LINKS = [
  { href: '/hilton-head-weather', label: 'Weather by month' },
  { href: '/hilton-head-tides', label: 'Tide charts' },
  { href: '/hilton-head-hurricane-season', label: 'Hurricane season' },
  { href: '/cost-of-hilton-head-trip', label: 'What a trip costs' },
  { href: '/hilton-head-packing-list', label: 'Packing list' },
  { href: '/itinerary', label: 'Plan a trip with us' },
];

export default function BestTimeToVisitHiltonHeadPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Weather', path: '/hilton-head-weather' },
    { name: 'Best time to visit', path: PATH },
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
            eyebrow="Trip planning"
            plain="Best time to visit"
            italic="Hilton Head"
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

        {/* Trip-window finder tool */}
        <section className="mt-12">
          <TripWindowFinder />
        </section>

        {/* Season-by-season */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hilton Head{' '}
            <span className="display-italic">season by season</span>
          </h2>
          <div className="mt-10 space-y-10">
            {SEASONS.map((s) => (
              <article key={s.title} className="border-t border-rule-soft pt-7">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Best-time-to-visit{' '}
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
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Keep planning</h3>
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

        {/* Book the window (affiliate) */}
        <section aria-label="Book your window" className="mt-20 md:mt-24">
          <h2 className="eyebrow text-coral">Found your window? Book it</h2>
          <AffiliateDisclosure variant="inline" className="mb-5 mt-6" />
          <div className="max-w-[640px]">
            <AffiliateCard
              programId="stay22"
              placement="best-time/stay22"
              headline="Compare stays for your dates"
              description="One search across Booking, Vrbo, Airbnb, and Hotels.com — the best shoulder-season inventory goes early, so compare live prices and lock your week."
              cta="Compare stays →"
            />
          </div>
        </section>

        {/* Lead capture */}
        <section className="mt-20">
          <NewsletterSignup
            source="tool-page/best-time"
            variant="inline"
            heading="Know the best weeks first"
            body="One dispatch a month — the value windows, the weeks to avoid, and the villa deals worth jumping on before they're gone."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
