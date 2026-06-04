import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import BeachDayPicker from '@/components/tools/BeachDayPicker';
import {
  buildBeachDayPlan,
  isValidIsoDate,
  type BeachDayPlan,
} from '@/app/lib/beachDay';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';

const PATH = '/hilton-head-beach-day-planner';
const HHI_TZ = 'America/New_York';

// ───────────────────────────────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = generatePageMetadata({
  title:
    'Hilton Head Beach Day Planner — Best Beach + Best Hours for Your Trip',
  description:
    'Pick any date and get a custom Hilton Head beach plan: the best beach and hours for that day, live tides, sun and golden-hour times, the weather, and tide-keyed activities. Free, no signup.',
  path: PATH,
  keywords: [
    'hilton head beach day planner',
    'best time to go to the beach hilton head',
    'hilton head beach conditions',
    'hilton head tide chart beach',
    'best beach hilton head',
  ],
});

// ───────────────────────────────────────────────────────────────────────
// FAQ (real, citable answers — also feeds FAQPage JSON-LD)
// ───────────────────────────────────────────────────────────────────────

const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "What's the best time of day for the beach on Hilton Head?",
    answer:
      'Morning — roughly from an hour after sunrise to about 11am. The afternoon sea breeze on Hilton Head builds to 12–18 mph, which kicks up chop, shreds cheap umbrellas, and pushes the heat index up. Mornings are calmer, cooler, less crowded, and parking at Coligny and the public lots is still open. If you only get one window a day, take the morning. The planner above gives you the exact best-hours window for your specific date.',
  },
  {
    question: 'Is low or high tide better at Hilton Head?',
    answer:
      'It depends what you came to do. Hilton Head beaches are wide and flat, so low tide exposes hundreds of feet of hard-packed sand — that is the window for shelling, shark-tooth hunting, tide pools with the kids, and beach biking. High tide narrows the beach but brings the water to you, which makes it the better window for actually swimming. Neither is "better" in the abstract; the planner reads the day\'s tide chart and tells you which window falls in daylight and what each is good for.',
  },
  {
    question: 'Where can you find shark teeth on Hilton Head?',
    answer:
      "The north end at low tide. Mitchelville Beach Park and the Fish Haul / Port Royal area expose the widest, oldest flats on the island when the tide drops, and that is where fossilized shark teeth and whole shells turn up. Bring a mesh bag, go in the first hour or two after low tide, and look along the tide line and in the darker shell beds. The planner flags the low-tide window for your date so you can time the hunt.",
  },
  {
    question: 'How far out can this plan the weather?',
    answer:
      'Tides and sun times are exact for any date — they are astronomical, so a beach day next July is as precise as tomorrow. The weather forecast is live for about seven days out (National Weather Service); beyond that the planner shows the seasonal average for that month instead. The honest move is to plan the shape of your beach day now using tides and sun, then check back within a week of your trip for the live forecast.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────

/** Today as "YYYY-MM-DD" in the Hilton Head timezone. */
function todayInHHI(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: HHI_TZ }).format(
    new Date(),
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const WEATHER_SOURCE_LABEL: Record<BeachDayPlan['weather']['source'], string> = {
  forecast: 'Live forecast',
  seasonal: 'Seasonal average',
};

const WINDOW_TONE: Record<BeachDayPlan['windows'][number]['kind'], string> = {
  morning: 'text-coral',
  'low-tide': 'text-ocean-deep',
  'high-tide': 'text-palm',
  sunset: 'text-gold-deep',
};

// ───────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────

export default async function BeachDayPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  const theDate =
    sp.date && isValidIsoDate(sp.date) ? sp.date : todayInHHI();

  const plan = await buildBeachDayPlan(theDate);

  // ───── JSON-LD ─────
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Beach Day Planner', path: PATH },
  ]);
  const faqSchema = getFaqSchema(FAQS);
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Hilton Head Beach Day Planner',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="mx-auto max-w-[1080px] px-5">
        <Header />

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Beach tools"
            plain="Hilton Head"
            italic="beach day planner"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <h1 className="display text-[30px] leading-[1.1] text-ink md:text-[40px]">
            Pick a day. Get the{' '}
            <span className="display-italic">best beach and the best hours</span>{' '}
            for it.
          </h1>

          {/* TL;DR — citable direct-answer block for LLM SEO */}
          <aside
            role="note"
            aria-label="What this tool does"
            className="tldr-block my-8 border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
          >
            <p className="eyebrow mb-2 text-coral">TL;DR</p>
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              This free planner takes any date and builds a Hilton Head beach
              day around it: which beach to pick and the best hours to go, the
              day&rsquo;s tide windows (low tide for shelling and shark teeth,
              high tide for swimming), sunrise, sunset and golden hour, the
              weather, and activities matched to that day&rsquo;s tides. Tides
              and sun are exact for any date; weather is live within about a
              week, seasonal beyond that.
            </p>
          </aside>

          <p className="text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Most beach-day advice is generic. This isn&rsquo;t. Hilton
            Head&rsquo;s beaches are wide and flat, so the tide changes what
            the beach even is — a low-tide morning is a different trip than a
            high-tide afternoon. Pick your date below and the planner reads the
            real tide chart, sun times, and forecast and tells you exactly how
            to play the day.
          </p>
        </div>

        {/* Picker */}
        <section className="mt-10">
          <BeachDayPicker value={plan.isoDate} />
          <div className="mt-5">
            <p className="display text-[22px] leading-tight text-ink md:text-[26px]">
              Your plan for{' '}
              <span className="display-italic">{plan.dateLabel}</span>
            </p>
            <p className="mt-2 max-w-[720px] text-[14px] leading-[1.6] text-ink-soft">
              {plan.localNote}
            </p>
          </div>
        </section>

        {/* Top pick */}
        <section className="mt-12">
          <div className="rounded-3xl border border-ocean-deep/20 bg-ocean-deep/5 px-6 py-8 md:px-10 md:py-10">
            <p className="eyebrow text-coral">Top pick for this day</p>
            <h2 className="display mt-2 text-[28px] leading-[1.12] text-ink md:text-[36px]">
              {plan.topPick.beach}
            </h2>
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-ocean-deep">
              Best hours · {plan.topPick.bestHours}
            </p>
            <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink md:text-[16px]">
              {plan.topPick.why}
            </p>
          </div>
        </section>

        {/* Windows */}
        <section className="mt-16">
          <h2 className="display text-[26px] leading-[1.1] text-ink md:text-[34px]">
            The day&rsquo;s{' '}
            <span className="display-italic">windows</span>
          </h2>
          <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            When to be on the sand, where, and for what. Tide-keyed to your
            date.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {plan.windows.map((w) => (
              <article
                key={`${w.kind}-${w.label}`}
                className="flex flex-col rounded-2xl border border-rule-soft bg-cream/40 p-5 md:p-6"
              >
                <p
                  className={[
                    'text-[11px] font-semibold uppercase tracking-[0.14em]',
                    WINDOW_TONE[w.kind],
                  ].join(' ')}
                >
                  {w.label}
                </p>
                <p className="mt-2 text-[18px] tabular-nums text-ink md:text-[20px]">
                  {w.time}
                </p>
                {w.beach && (
                  <p className="mt-1 text-[13px] font-medium text-ink-soft">
                    {w.beach}
                  </p>
                )}
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                  {w.what}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Tide timeline */}
        <section className="mt-16">
          <h2 className="display text-[26px] leading-[1.1] text-ink md:text-[34px]">
            Tide{' '}
            <span className="display-italic">timeline</span>
          </h2>
          <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Highs and lows for {plan.dateLabel}. Beach tides lag the Fort
            Pulaski station by roughly 25 minutes.
          </p>

          {plan.tides.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-rule-soft bg-sand-soft/40 px-6 py-6 text-[15px] text-ink-soft">
              Tide data is unavailable for this date right now. Sun times and
              the windows above still apply — check the{' '}
              <Link href="/hilton-head-tides" className="text-ocean-deep underline">
                full tide chart
              </Link>{' '}
              for a backup.
            </p>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-rule-soft">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-sand-soft/60 text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Time</th>
                    <th className="px-5 py-3 font-semibold">Tide</th>
                    <th className="px-5 py-3 font-semibold">Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule-soft">
                  {plan.tides.map((t, i) => (
                    <tr key={`${t.minutes}-${i}`} className="align-middle">
                      <td className="px-5 py-4 tabular-nums text-ink">
                        {t.time}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={[
                            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]',
                            t.type === 'High'
                              ? 'bg-ocean-deep/10 text-ocean-deep'
                              : 'bg-coral/15 text-coral-deep',
                          ].join(' ')}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 tabular-nums text-ink-soft">
                        {t.height}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sun & conditions */}
        <section className="mt-16">
          <h2 className="display text-[26px] leading-[1.1] text-ink md:text-[34px]">
            Sun &amp;{' '}
            <span className="display-italic">conditions</span>
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            <SunStat label="Sunrise" value={plan.sun.sunrise} />
            <SunStat label="Sunset" value={plan.sun.sunset} />
            <SunStat label="Golden hour, AM" value={plan.sun.goldenMorning} />
            <SunStat label="Golden hour, PM" value={plan.sun.goldenEvening} />
          </div>

          <div className="mt-6 rounded-2xl border border-rule-soft bg-cream/40 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={[
                  'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
                  plan.weather.source === 'forecast'
                    ? 'bg-palm/15 text-palm'
                    : 'bg-gold/20 text-gold-deep',
                ].join(' ')}
              >
                {WEATHER_SOURCE_LABEL[plan.weather.source]}
              </span>
              <span className="text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                {plan.sun.daylight} of daylight
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink md:text-[16px]">
              {plan.weather.summary}
            </p>
          </div>
        </section>

        {/* Activities (affiliate links appear here → disclosure above) */}
        <section className="mt-16">
          <h2 className="display text-[26px] leading-[1.1] text-ink md:text-[34px]">
            What to{' '}
            <span className="display-italic">do</span>
          </h2>
          <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Matched to {plan.dateLabel}&rsquo;s tides — these are the moves that
            actually line up with the water.
          </p>

          <AffiliateDisclosure variant="inline" className="mt-5" />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {plan.activities.map((a) => (
              <article
                key={a.title}
                className="flex flex-col rounded-2xl border border-rule-soft bg-cream/40 p-5 md:p-6"
              >
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                  <span
                    className={[
                      'rounded-full px-2.5 py-0.5',
                      a.tide === 'low'
                        ? 'bg-coral/15 text-coral-deep'
                        : a.tide === 'high'
                          ? 'bg-ocean-deep/10 text-ocean-deep'
                          : 'bg-sand-soft text-ink-soft',
                    ].join(' ')}
                  >
                    {a.tide === 'any' ? 'Any tide' : `${a.tide} tide`}
                  </span>
                </div>
                <h3 className="display mt-3 text-[19px] leading-[1.2] text-ink md:text-[21px]">
                  {a.title}
                </h3>
                <p className="mt-2 grow text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                  {a.detail}
                </p>
                {a.affiliate && (
                  <p className="mt-4">
                    <AffiliateLink
                      programId={a.affiliate.programId}
                      deeplink={a.affiliate.deeplink}
                      placement={`tool/beach-day/${slugify(a.title)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-transparent px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-coral hover:text-coral"
                    >
                      Book this &rarr;
                    </AffiliateLink>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Pack for these conditions */}
        <section className="mt-14">
          <div className="rounded-2xl border-l-2 border-gold bg-sand-soft/40 px-6 py-5">
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              <strong className="font-semibold">Pack for these conditions.</strong>{' '}
              That afternoon sea breeze eats cheap umbrellas and the south end
              of Coligny is soft sand. Our{' '}
              <Link
                href="/hilton-head-packing-list"
                className="text-ocean-deep underline underline-offset-2 hover:text-coral"
              >
                Hilton Head packing list
              </Link>{' '}
              covers the gear that actually survives an island beach day.
            </p>
          </div>
        </section>

        {/* Data note */}
        <p className="mt-10 max-w-[760px] text-[12px] leading-[1.6] text-ink-soft/70">
          {plan.dataNote}
        </p>

        {/* FAQ */}
        <section className="mt-20 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Beach day{' '}
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
            {[
              { href: '/hilton-head-tides', label: 'Full tide charts' },
              { href: '/hilton-head-beaches', label: 'Beach guide' },
              { href: '/hilton-head-packing-list', label: 'Packing list' },
              {
                href: '/best-time-to-visit-hilton-head',
                label: 'Best time to visit',
              },
              { href: '/hilton-head-weather', label: 'Weather by month' },
              {
                href: '/hilton-head-oceanfront-villas',
                label: 'Oceanfront villas',
              },
            ].map((l) => (
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
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────────────

function SunStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-rule-soft bg-sand-soft/40 p-4 md:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] tabular-nums leading-tight text-ink md:text-[16px]">
        {value}
      </p>
    </div>
  );
}
