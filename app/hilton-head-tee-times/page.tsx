import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import NewsletterSignup from '@/components/NewsletterSignup';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import TeeTimeFinder from '@/components/tools/TeeTimeFinder';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

const PATH = '/hilton-head-tee-times';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Tee Times: Book Golf at Every Course (2026)',
  description:
    "Book tee times at every Hilton Head Island golf course — Harbour Town, Palmetto Dunes, Sea Pines and more. Jump straight to each course's booking page or compare live tee times on GolfNow.",
  path: PATH,
  keywords: [
    'hilton head tee times',
    'book tee times hilton head',
    'hilton head golf tee times',
    'harbour town tee times',
    'hilton head golf booking',
    'tee times hilton head island',
  ],
});

const TLDR =
  "Hilton Head Island is one of the country's great golf destinations — a dozen courses including Harbour Town Golf Links, host of the PGA Tour's RBC Heritage. Each course runs its own tee sheet, so booking is fragmented. Use the finder below to jump straight to any course's official booking page, or compare live tee times across the island on GolfNow. Book 30+ days out in peak season; Heritage week in April sells out months ahead.";

const INTRO =
  "Twelve courses, a dozen different booking systems — the Sea Pines portal, GolfNow, foreUP, and direct pro-shop lines. The finder below routes you to the right page with your date and party in hand. Below it: how access and pricing actually work on the island.";

const HOW_IT_WORKS = [
  {
    title: 'Access — public, resort-guest, or both',
    body: "Hilton Head's courses split into public-access, resort-guest-priority, and a couple of private clubs. Most of the marquee courses — Harbour Town included — are open to the public and to resort guests, but resort guests often get earlier booking windows and better rates. The finder labels each course's access type so you know before you click.",
  },
  {
    title: 'Booking windows — and the weeks that vanish',
    body: "In peak season (spring, early summer, and fall) book 30 to 60 days out for prime morning times. RBC Heritage week in mid-April is the exception: Sea Pines and Harbour Town tee times go six-plus months ahead, and lodging inside Sea Pines books a year out. If you're planning around Heritage, lock it early.",
  },
  {
    title: 'Pricing — peak, twilight, and shoulder season',
    body: "Most island courses run roughly $100–$250 in season; premium tracks like Harbour Town push past $300 in peak weeks. The cheapest golf is summer afternoons (heat), winter, and twilight slots — and shoulder-season weekday mornings give you the best balance of price and conditions. GolfNow often lists tee-time deals below the pro-shop walk-up rate.",
  },
];

const FAQS = [
  {
    question: 'How far in advance should I book Hilton Head tee times?',
    answer:
      "In peak season — spring, early summer, and fall — book 30 to 60 days out for prime morning tee times. Resort guests usually get earlier booking windows. The big exception is RBC Heritage week in mid-April: those tee times (and Sea Pines lodging) go six or more months ahead, so plan a Heritage-week golf trip very early.",
  },
  {
    question: 'Can the public play Harbour Town Golf Links?',
    answer:
      "Yes. Harbour Town Golf Links is a resort course at The Sea Pines Resort, open to both the public and resort guests — it isn't a private club. Tee times are limited and premium (it's the RBC Heritage host, with the famous lighthouse 18th), so book well ahead, especially in spring. Resort guests get priority access and better rates.",
  },
  {
    question: 'Do I have to stay at a resort to golf on Hilton Head?',
    answer:
      "No. Several Hilton Head courses are fully public, and others give resort guests priority tee times or preferred rates rather than blocking outside play entirely. The tee-time finder above labels each course's access type — public, resort-guest, or private — so you can filter to what you can actually book.",
  },
  {
    question: 'How much do tee times cost on Hilton Head?',
    answer:
      "Most courses run roughly $100 to $250 per round in season, including cart. Premium courses like Harbour Town climb past $300 in peak weeks. Twilight rates (typically after 2–3 PM), winter, and summer afternoons are meaningfully cheaper. Comparing live tee times on GolfNow often surfaces deals below the pro-shop walk-up price.",
  },
  {
    question: 'When is the cheapest time to golf on Hilton Head?',
    answer:
      "Summer afternoons (it's hot and humid, so rates drop), the winter off-season, and twilight slots year-round are the cheapest. For the best value-to-conditions balance, target shoulder-season weekday mornings — April–May or September–October — when the weather is excellent but rates haven't hit their peak-week ceiling.",
  },
  {
    question: 'What is the most famous golf course on Hilton Head?',
    answer:
      "Harbour Town Golf Links, the Pete Dye design in The Sea Pines Resort, with its iconic candy-striped lighthouse behind the 18th green. It hosts the PGA Tour's RBC Heritage every April, the week after the Masters, and is consistently ranked among the best resort courses in the country.",
  },
];

const CROSS_LINKS = [
  { href: '/hilton-head-golf-packages', label: 'Golf trip packages' },
  { href: '/local/golf', label: 'All golf courses' },
  { href: '/guides/2027-rbc-heritage', label: '2027 RBC Heritage kit' },
  { href: '/hilton-head/sea-pines', label: 'Sea Pines (Harbour Town)' },
  { href: '/cost-of-hilton-head-trip', label: 'What a trip costs' },
  { href: '/hilton-head-weather', label: 'Weather by month' },
];

export default function HiltonHeadTeeTimesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Golf', path: '/local/golf' },
    { name: 'Tee times', path: PATH },
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
            as="h1"
            number="№ 01"
            eyebrow="Golf"
            plain="Hilton Head"
            italic="tee times"
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

        {/* Tee Time Finder tool */}
        <TeeTimeFinder />

        {/* GolfNow — compare live tee times (affiliate) */}
        <section aria-label="Compare tee times" className="mt-6">
          <AffiliateDisclosure variant="inline" className="mb-5" />
          <AffiliateCard
            programId="golfnow"
            placement="tee-times/golfnow"
            headline="Compare live Hilton Head tee times"
            description="Browse open tee times and tee-time deals across Hilton Head's public and resort courses on GolfNow — often below the pro-shop walk-up rate, with instant booking."
            cta="See tee times on GolfNow →"
          />
        </section>

        {/* How booking works */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            How tee-time booking{' '}
            <span className="display-italic">works on the island</span>
          </h2>
          <div className="mt-10 space-y-10">
            {HOW_IT_WORKS.map((b) => (
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
            Hilton Head tee-time{' '}
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
            source="tool-page/tee-times"
            variant="inline"
            heading="Tee times & golf deals"
            body="One dispatch a month — twilight deals, the weeks worth booking early, and the courses playing best right now."
          />
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
