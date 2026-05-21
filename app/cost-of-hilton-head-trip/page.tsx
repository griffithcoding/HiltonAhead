import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import CostCalculator from '@/components/cost/CostCalculator';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import {
  LODGING_TIERS,
  SEASON_MULTIPLIERS,
  MEDIAN_TRIP_FACT,
} from '@/data/costEstimates';

export const metadata: Metadata = generatePageMetadata({
  title: 'How Much Does a Hilton Head Trip Cost? 2026 Real Numbers',
  description:
    'A complete cost breakdown for a Hilton Head Island trip in 2026. Lodging tiers, food, activities, transport — by party size, by season, by trip length. Plus a free calculator.',
  path: '/cost-of-hilton-head-trip',
  keywords: [
    'cost of Hilton Head vacation',
    'how much is a Hilton Head trip',
    'Hilton Head vacation cost',
    'Hilton Head trip budget',
    'Hilton Head Island prices',
    'Hilton Head trip planner cost',
  ],
});

const FAQS = [
  {
    question: 'How much does a typical week-long Hilton Head trip cost?',
    answer:
      'For a family of four staying mid-tier in shoulder season (April–May or September–October), driving in from the Southeast, eating dinner out most nights, and doing moderate activities: $4,200–$10,500 all-in. The median real-booked rate is around $6,800 — about $240 per person per day. Peak summer in an oceanfront villa runs $12,000–$25,000 for the same group.',
  },
  {
    question: 'What is the single biggest line item on a Hilton Head trip?',
    answer:
      'Lodging — every time. Lodging averages 50–65% of total trip cost depending on tier and season. The next biggest is food (15–25%), then activities (10–20%), then transport (5–15%). Cutting lodging by one tier (oceanfront → mid-tier) saves more than cutting every other category combined.',
  },
  {
    question: 'How can I do Hilton Head on a budget?',
    answer:
      'Three real moves: (1) visit in shoulder season (April–May, September–October) — same weather as summer minus the 35% peak premium; (2) skip oceanfront and pick a mid-island or Forest Beach villa within walking distance of Coligny — same beach access, half the rate; (3) cook breakfast and lunch in the villa kitchen and eat out 3–4 dinners, not every meal. Done well, a family of four can do a week for $3,500–$4,500.',
  },
  {
    question: 'Is Hilton Head more expensive than Myrtle Beach?',
    answer:
      'Yes. Hilton Head is roughly 30–50% more expensive than Myrtle Beach on lodging and ~20% more on dining. The premium buys: gated bike-path communities, no neon/boardwalk, polished golf, and a quieter scene. Both are legitimate beach vacations — different products at different price points.',
  },
  {
    question: 'How does a Hilton Head trip compare to Kiawah Island?',
    answer:
      'Kiawah skews 20–40% more expensive than Hilton Head at the same tier. Kiawah is a single-resort island; lodging concentration drives up rates and Sanctuary-only dining adds. Hilton Head offers more inventory, more dining variety, and more lodging tiers — usually a better cost-per-quality match for most travelers.',
  },
  {
    question: 'When do Hilton Head villa prices peak?',
    answer:
      'Three windows: (1) Easter week — always the spring peak, often 35–45% over shoulder rate; (2) RBC Heritage week (mid-April) — Sea Pines specifically goes vertical; (3) the first three weeks of July — peak summer family week. Christmas week is also elevated but shorter.',
  },
  {
    question: 'Are there hidden costs in a Hilton Head vacation?',
    answer:
      'Yes — three to plan for. (1) Villa cleaning fees ($150–$450 added at checkout, not in nightly rate). (2) South Carolina accommodation tax (~12%) on lodging + a 2% local tax in some districts. (3) Sea Pines and Palmetto Dunes charge a gate pass / amenity fee per car for non-resident guests of villas (~$25–$50/week). We surface all of these up front when we quote a trip.',
  },
  {
    question: 'Do I need a rental car on Hilton Head?',
    answer:
      'For most trips, yes — the island is 12 miles long and most restaurants, beaches, and golf courses are not walkable from any single lodging. Couples staying at a resort with on-site dining can skip the rental car and rely on rideshare for off-property dinners; budget ~$40/day for rideshare. Inside Sea Pines or Palmetto Dunes, bikes plus the resort shuttle handle most in-community moves.',
  },
];

export default function CostOfHiltonHeadTripPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Trip planning', path: '/services' },
    { name: 'Cost of a trip', path: '/cost-of-hilton-head-trip' },
  ]);
  const faqSchema = getFaqSchema(FAQS);

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

      <div className="mx-auto max-w-[1080px] px-5">
        <Header />

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Trip planning"
            plain="How much does a Hilton Head trip"
            italic="actually cost?"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          {/* TL;DR — citable factoid block for LLM SEO */}
          <aside
            role="note"
            aria-label="Quick summary"
            className="tldr-block my-2 border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
          >
            <p className="eyebrow mb-2 text-sunset">TL;DR</p>
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              A family of four spending a week on Hilton Head in shoulder
              season, mid-tier lodging, driving from the Southeast, eats out
              most dinners: roughly{' '}
              <strong>
                ${MEDIAN_TRIP_FACT.totalLow.toLocaleString()}–$
                {MEDIAN_TRIP_FACT.totalHigh.toLocaleString()}
              </strong>{' '}
              all-in. Median is{' '}
              <strong>${MEDIAN_TRIP_FACT.totalMid.toLocaleString()}</strong>{' '}
              — about $240 per person per day. Peak summer in an oceanfront
              villa for the same group: $12,000–$25,000.
            </p>
          </aside>

          <p className="mt-8 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Most Hilton Head cost articles bury you in average daily rates
            from listing sites that aren&rsquo;t what most travelers
            actually pay. This is different. Below is a working calculator
            built on real partner-property rates we book against, with the
            full math shown — pick the inputs that match your trip and you
            get a realistic range in seconds.
          </p>

          <p className="mt-5 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            After the calculator we break down where the money goes, what
            actually moves the total, and the three honest moves to cut
            a trip&rsquo;s cost without compromising the experience.
          </p>
        </div>

        {/* Calculator */}
        <CostCalculator />

        {/* Cost breakdown by category */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            What goes into a{' '}
            <span className="display-italic">Hilton Head trip cost</span>
          </h2>

          <div className="mt-10 space-y-10">
            <CostCategory
              title="Lodging (50–65% of total)"
              body="The biggest line item, always. Hilton Head's lodging tiers run from $120/night for off-resort hotels and basic mid-island rentals up to $2,400/night for full-service Palmetto Bluff estates. The mid-tier — a 3-bedroom Sea Pines or Forest Beach villa around $300–$450/night — is what most families book. Oceanfront commands a 30–60% premium over the same property one row inland."
            />
            <CostCategory
              title="Food (15–25% of total)"
              body="A family of four cooking breakfast and packing beach lunches, eating dinner out 4 of 7 nights, blends to about $110 per person per day. Eating every meal at restaurants pushes that to $175. Cooking mostly drops to $55. The kitchen-vs-no-kitchen choice in your villa effectively doubles or halves your food budget."
            />
            <CostCategory
              title="Activities (10–20% of total)"
              body="A round of golf at Harbour Town is ~$300 in season; a dolphin cruise is $40/person; bike rentals run $35/week per bike; a fishing charter for four is $700–$1,200. A light week of mostly beach + bike runs $25/person/day. A heavy week with two golf rounds and a charter pushes past $175/person/day."
            />
            <CostCategory
              title="Transport (5–15% of total)"
              body="Driving in from Atlanta, Charlotte, or Raleigh: gas + a hotel night if needed, $80–$350 total. Flying into Savannah (SAV) + rental car for a week: $600–$2,200 depending on origin and party size. Hilton Head Airport (HHH) is on-island but seasonally limited; check direct routes from your home before defaulting to SAV."
            />
            <CostCategory
              title="Hidden line items"
              body="Three to watch: villa cleaning fees added at checkout ($150–$450), SC accommodation tax (~12%) on lodging, and Sea Pines / Palmetto Dunes gate-pass fees for non-resident villa guests (~$25–$50 per car per week). The calculator above includes the cleaning fee and tax automatically."
            />
          </div>
        </section>

        {/* Lodging tier reference */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            The four{' '}
            <span className="display-italic">lodging tiers</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            What you get at each price point. Per-night ranges are
            pre-tax, pre-cleaning. Multiply by season multiplier (below)
            for peak weeks.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-rule-soft">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-sand-soft/60 text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                <tr>
                  <th className="px-5 py-3 font-semibold">Tier</th>
                  <th className="px-5 py-3 font-semibold">$/night</th>
                  <th className="px-5 py-3 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft">
                {LODGING_TIERS.map((tier) => (
                  <tr key={tier.id} className="align-top">
                    <td className="px-5 py-4 font-semibold text-ink">{tier.label}</td>
                    <td className="px-5 py-4 tabular-nums text-ink">
                      ${tier.nightlyMin}–${tier.nightlyMax}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{tier.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Seasonal multipliers */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            What{' '}
            <span className="display-italic">season</span>{' '}
            does to the price
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Same villa, three prices depending on the week. Shoulder
            season is the value sweet spot — peak weather, off-peak
            rates.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {SEASON_MULTIPLIERS.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-rule-soft bg-sand-soft/40 p-5"
              >
                <h3 className="display text-[20px] leading-tight text-ink">
                  {s.label}
                </h3>
                <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-coral">
                  ×{s.multiplier.toFixed(2)} on lodging
                </p>
                <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Three honest moves */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Three honest ways to{' '}
            <span className="display-italic">cut the total</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Without compromising the trip. These are the moves we
            recommend on consulting calls when clients ask &ldquo;how do
            we do this for less&rdquo;.
          </p>

          <ol className="mt-8 space-y-6">
            <Move
              n={1}
              title="Shift to shoulder season"
              body="Visit April–May or September–October. Same beach weather as peak summer, often better golf conditions, and lodging rates drop 25–35% across every tier. If your schedule allows, this is the single biggest lever."
              save="Saves $1,200–$3,500 on a typical 7-night mid-tier trip"
            />
            <Move
              n={2}
              title="Drop one tier on lodging, not on neighborhood"
              body="The neighborhood matters more than the oceanfront upgrade. A mid-tier 3BR in Forest Beach with a five-minute walk to the sand beats an oceanfront budget property every time. Keep the location, drop the tier."
              save="Saves $1,500–$4,000 on lodging"
            />
            <Move
              n={3}
              title="Book a villa with a real kitchen and a washer/dryer"
              body="Two breakfasts in the villa instead of out at $40/breakfast for a family of four = $160. Pack lunches three times = another $120. Run laundry mid-trip and you can travel with one less bag (lower airline fees). The kitchen pays for itself by Wednesday."
              save="Saves $400–$900 on food per week"
            />
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Frequently asked{' '}
            <span className="display-italic">cost questions</span>
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

        {/* Cross-links to related pages */}
        <section className="mt-20">
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Plan the rest of your trip</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/hilton-head-oceanfront-villas', label: 'Oceanfront villa picks' },
              { href: '/hilton-head-family-trip-planner', label: 'Family trip planning' },
              { href: '/hilton-head-golf-packages', label: 'Golf trip packages' },
              { href: '/hilton-head-weather', label: 'Weather by month' },
              { href: '/hilton-head/sea-pines', label: 'Sea Pines neighborhood' },
              { href: '/hilton-head/palmetto-dunes', label: 'Palmetto Dunes neighborhood' },
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
                    →
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

function CostCategory({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-t border-rule-soft pt-7">
      <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
        {title}
      </h3>
      <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
        {body}
      </p>
    </article>
  );
}

function Move({
  n,
  title,
  body,
  save,
}: {
  n: number;
  title: string;
  body: string;
  save: string;
}) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule-soft pt-6">
      <span className="section-number text-[28px] text-gold">{`0${n}`}</span>
      <div>
        <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
          {title}
        </h3>
        <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
          {body}
        </p>
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-coral">
          {save}
        </p>
      </div>
    </li>
  );
}
