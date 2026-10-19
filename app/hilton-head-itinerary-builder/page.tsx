import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import ItineraryControls from '@/components/tools/ItineraryControls';
import ItineraryShareBar from '@/components/tools/ItineraryShareBar';
import {
  buildItinerary,
  withPick,
  alternativesFor,
  lodgingLabel,
} from '@/app/lib/itineraryBuilder';
import type { Slot } from '@/data/itineraryActivities';
import { itineraryPacks } from '@/data/itineraryPacks';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';

const PATH = '/hilton-head-itinerary-builder';

// ───────────────────────────────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Itinerary Builder — Free Day-by-Day Trip Planner',
  description:
    'Build a free, shareable day-by-day Hilton Head Island itinerary. Pick your trip length, type, and lodging, swap any activity, see a real cost estimate, then print it or have a local book the whole week for you.',
  path: PATH,
  keywords: [
    'hilton head itinerary builder',
    'hilton head trip planner free',
    '5 day hilton head itinerary',
    'hilton head 7 day itinerary',
    'what to do in hilton head for a week',
  ],
});

// ───────────────────────────────────────────────────────────────────────
// FAQ (real, citable answers — also feeds FAQPage JSON-LD)
// ───────────────────────────────────────────────────────────────────────

const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'How many days do you need in Hilton Head?',
    answer:
      'Four to five days is the sweet spot for a first Hilton Head trip — enough to get two or three beach mornings, a dolphin cruise or kayak tour, a round of golf or a Harbour Town evening, and a Bluffton dinner without rushing. A long weekend (3 days) works if you stay near Coligny and keep the agenda tight; a full week (7 days) is ideal for families or golfers who want to add a second course, a fishing charter, and a day trip to Savannah or Beaufort. The builder above lets you set 3, 4, 5, or 7 days and shapes the plan accordingly.',
  },
  {
    question: 'What is there to do in Hilton Head for 5 days?',
    answer:
      'A strong 5-day Hilton Head plan: Day 1 settle in with a Coligny beach morning and a casual dinner; Day 2 a dolphin or nature cruise in the afternoon and Harbour Town for sunset; Day 3 golf or a Sea Pines Forest Preserve walk plus a spa or kayak block; Day 4 low-tide shelling or beach biking and dinner in Old Town Bluffton; Day 5 a last swim and a slow morning before you leave. The island is 12 miles long, so the builder clusters each day by neighborhood (Sea Pines, Coligny/Forest Beach, Shelter Cove, Bluffton) so you are not crisscrossing the bridge twice a day.',
  },
  {
    question: 'Is Hilton Head good for families?',
    answer:
      'Yes — Hilton Head is one of the most family-friendly beach destinations on the East Coast. The beaches are wide, flat, and gently sloped (good for little kids), the whole island is laced with paved bike paths, and there is no neon boardwalk scene. Family staples include dolphin cruises out of Shelter Cove, pony rides at Lawton Stables, the Sandbox Children’s Museum for a hot or rainy afternoon, ziplining over Broad Creek, pirate-themed mini golf, and climbing the Harbour Town lighthouse. Pick the "Family" trip type in the builder and the plan fills with exactly these.',
  },
  {
    question: 'Do you need a car in Hilton Head?',
    answer:
      'For most trips, yes. Hilton Head is 12 miles long and the beaches, golf courses, and restaurants are spread across the island, so a car (your own or a rental) is the simplest way to get around. The exceptions: couples staying inside Sea Pines or Palmetto Dunes can lean on bikes plus the resort shuttle for in-community moves and use rideshare for the occasional off-property dinner, and a resort with on-site dining can make a car optional. If you fly into Savannah (SAV), a rental car is effectively required; Hilton Head Airport (HHH) is on-island but has limited routes.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────

const SLOT_LABEL: Record<Slot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

function costLabel(costPerPerson: number): string {
  return costPerPerson === 0 ? 'Free' : `$${costPerPerson}/person`;
}

function money(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

/** Match the trip type to its best-fit itinerary pack (couples/golf real, family/beach → couples as generic). */
function packForType(type: string) {
  const slug =
    type === 'golf'
      ? 'golf-hilton-head'
      : 'couples-hilton-head'; // couples + family/beach generic fall here
  return itineraryPacks.find((p) => p.urlSlug === slug);
}

// ───────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────

export default async function ItineraryBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{
    days?: string;
    type?: string;
    lodging?: string;
    party?: string;
    picks?: string;
  }>;
}) {
  const sp = await searchParams;
  const it = buildItinerary(sp);

  const pack = packForType(it.type);

  // ───── JSON-LD ─────
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Itinerary Builder', path: PATH },
  ]);
  const faqSchema = getFaqSchema(FAQS);
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Hilton Head Itinerary Builder',
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
        <div className="print-hide">
          <Header />
        </div>

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Trip tools"
            plain="Hilton Head"
            italic="itinerary builder"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <h1 className="display text-[30px] leading-[1.1] text-ink md:text-[40px]">
            Build a day-by-day{' '}
            <span className="display-italic">Hilton Head week</span> in seconds.
          </h1>

          {/* TL;DR — citable direct-answer block for LLM SEO */}
          <aside
            role="note"
            aria-label="What this tool does"
            className="tldr-block my-8 border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
          >
            <p className="eyebrow mb-2 text-coral">TL;DR</p>
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              This free planner builds a complete day-by-day Hilton Head Island
              itinerary from a curated catalog of real local activities. Pick
              your trip length (3&ndash;7 days), trip type (family, couples,
              golf, or beach), and lodging tier; the tool fills every morning,
              afternoon, and evening, clusters each day by neighborhood so you
              aren&rsquo;t crisscrossing a 12-mile island, swaps any activity
              you don&rsquo;t want, and rolls up a real cost estimate. Share or
              print the plan &mdash; or have a local book the whole week for you.
            </p>
          </aside>

          <p className="text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Most &ldquo;Hilton Head itinerary&rdquo; articles are one fixed plan
            written for someone else&rsquo;s trip. This isn&rsquo;t. Set the
            shape of your trip below and the builder sequences a week the way a
            local would &mdash; right activity, right time of day, no wasted
            mornings deciding what to do.
          </p>
        </div>

        {/* Controls (client island) */}
        <div className="print-hide">
          <ItineraryControls
            days={it.days}
            type={it.type}
            lodging={it.lodging}
            party={it.party}
          />
        </div>

        {/* Monetization: primary concierge CTA + share bar */}
        <section className="mt-4">
          <div className="rounded-3xl border border-ink/15 bg-ink px-6 py-7 text-sand md:px-9 md:py-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[560px]">
                <p className="eyebrow text-gold">Skip the planning</p>
                <p className="mt-2 text-[19px] leading-[1.3] text-sand md:text-[22px]">
                  Want a local to book this whole week for you?
                </p>
                <p className="mt-2 text-[14px] leading-[1.6] text-sand/75">
                  Hand off the plan and we handle the villa, the tee times, the
                  dinner reservations &mdash; the parts that book up months out.
                </p>
              </div>
              <Link
                href="/itinerary?intent=trip-builder"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-coral px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-sand transition-colors hover:bg-coral-deep"
              >
                Have a local book it &rarr;
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 print-hide">
            <AffiliateDisclosure variant="inline" />
            <ItineraryShareBar />
          </div>
        </section>

        {/* Day-by-day */}
        <section className="mt-12">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Your{' '}
            <span className="display-italic">
              {it.days}-day {it.type} plan
            </span>
          </h2>
          <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Each day is clustered by neighborhood. Swap any slot &mdash; the
            plan rebuilds and the link updates so you can share or print exactly
            what you see.
          </p>

          <div className="mt-10 space-y-8">
            {it.itinerary.map((day, dayIndex) => (
              <article
                key={day.dayNumber}
                className="overflow-hidden rounded-3xl border border-rule-soft bg-cream/40"
              >
                <header className="border-b border-rule-soft bg-sand-soft/50 px-6 py-5 md:px-8">
                  <div className="flex items-baseline gap-4">
                    <span className="section-number text-[22px] text-gold">
                      {`Day ${day.dayNumber}`}
                    </span>
                    {day.neighborhoods.length > 0 && (
                      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ocean-deep">
                        {day.neighborhoods.join(' · ')}
                      </span>
                    )}
                  </div>
                </header>

                <div className="divide-y divide-rule-soft">
                  {day.slots.map((s) => {
                    const activity = s.activity;
                    const alts = alternativesFor(it.type, s.slot, activity?.id);
                    return (
                      <div
                        key={s.slot}
                        className="grid grid-cols-1 gap-3 px-6 py-5 md:grid-cols-[120px_1fr] md:gap-6 md:px-8"
                      >
                        <div className="flex items-center gap-2 md:block">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                            {SLOT_LABEL[s.slot]}
                          </p>
                          {s.isOverride && (
                            <span className="text-[10px] uppercase tracking-[0.12em] text-ink-soft/60 md:mt-1 md:block">
                              swapped
                            </span>
                          )}
                        </div>

                        <div>
                          {activity ? (
                            <>
                              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="display text-[18px] leading-[1.25] text-ink md:text-[20px]">
                                  {activity.title}
                                </h3>
                                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                  {costLabel(activity.costPerPerson)}
                                </span>
                              </div>
                              <p className="mt-2 max-w-[640px] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                                {activity.blurb}
                              </p>

                              {activity.affiliate && (
                                <p className="mt-3">
                                  <AffiliateLink
                                    programId={activity.affiliate.programId}
                                    deeplink={activity.affiliate.deeplink}
                                    placement={`tool/itinerary/${activity.id}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-transparent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-coral hover:text-coral"
                                  >
                                    Book &rarr;
                                  </AffiliateLink>
                                </p>
                              )}

                              {alts.length > 0 && (
                                <details className="mt-3 print-hide [&_summary::-webkit-details-marker]:hidden">
                                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ocean-deep hover:text-coral">
                                    Swap
                                    <span aria-hidden="true">&rarr;</span>
                                  </summary>
                                  <ul className="mt-3 flex flex-col gap-1.5 border-l border-rule-soft pl-4">
                                    {alts.map((alt) => (
                                      <li key={alt.id}>
                                        <Link
                                          href={`/hilton-head-itinerary-builder?${withPick(it, dayIndex, s.slot, alt.id)}`}
                                          className="text-[13px] leading-[1.5] text-ink-soft underline-offset-2 hover:text-coral hover:underline"
                                        >
                                          {alt.title}
                                          <span className="ml-2 text-[11px] text-ink-soft/60">
                                            {costLabel(alt.costPerPerson)}
                                          </span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              )}
                            </>
                          ) : (
                            <p className="text-[14px] italic leading-[1.6] text-ink-soft/70">
                              Open block &mdash; rest, a slow meal, or your own
                              pick.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cost summary */}
        <section className="mt-16">
          <div className="rounded-3xl border border-ocean-deep/15 bg-ocean-deep/5 px-6 py-8 md:px-10 md:py-10">
            <p className="eyebrow text-coral">Estimated trip cost</p>
            <p className="display mt-2 text-[32px] leading-none text-ink md:text-[44px]">
              {money(it.cost.totalLow)}&ndash;{money(it.cost.totalHigh)}
            </p>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
              Estimated trip cost for{' '}
              <strong className="text-ink">
                {it.party} {it.party === 1 ? 'person' : 'people'}
              </strong>{' '}
              ({it.cost.nights} {it.cost.nights === 1 ? 'night' : 'nights'},{' '}
              {lodgingLabel(it.lodging)} lodging).
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 text-[14px] sm:grid-cols-3">
              <CostLine
                label="Lodging"
                value={`${money(it.cost.lodgingLow)}–${money(it.cost.lodgingHigh)}`}
              />
              <CostLine label="Activities" value={money(it.cost.activities)} />
              <CostLine
                label="Food"
                value={`${money(it.cost.foodLow)}–${money(it.cost.foodHigh)}`}
              />
            </div>

            <p className="mt-6 text-[12px] leading-snug text-ink-soft/70 print-hide">
              Adjust lodging/party above to re-estimate. Ranges use 2026
              partner-rate methodology &mdash; a real quote comes back inside one
              business day.
            </p>
          </div>
        </section>

        {/* Pack upsell */}
        {pack && (
          <section className="mt-10">
            <div className="rounded-2xl border-l-2 border-gold bg-sand-soft/40 px-6 py-5">
              <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
                <strong className="font-semibold">
                  Prefer it done-for-you in a PDF?
                </strong>{' '}
                The {pack.priceDisplay} {pack.title} is the same picks and
                sequencing, written out and ready to download.{' '}
                <Link
                  href={`/itinerary-packs/${pack.urlSlug}`}
                  className="text-ocean-deep underline underline-offset-2 hover:text-coral"
                >
                  See what&rsquo;s inside &rarr;
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-20 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Hilton Head trip{' '}
            <span className="display-italic">planning questions</span>
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
        <section className="mt-20 print-hide">
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Plan the rest of your trip</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/cost-of-hilton-head-trip', label: 'Trip cost calculator' },
              {
                href: '/hilton-head-beach-day-planner',
                label: 'Beach day planner',
              },
              { href: '/hilton-head-packing-list', label: 'Packing list' },
              {
                href: '/best-time-to-visit-hilton-head',
                label: 'Best time to visit',
              },
              {
                href: '/hilton-head-oceanfront-villas',
                label: 'Oceanfront villas',
              },
              { href: '/hilton-head-golf-packages', label: 'Golf packages' },
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

      <div className="print-hide">
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────────────

function CostLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-rule-soft bg-cream/60 p-4 md:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] tabular-nums leading-tight text-ink md:text-[16px]">
        {value}
      </p>
    </div>
  );
}
