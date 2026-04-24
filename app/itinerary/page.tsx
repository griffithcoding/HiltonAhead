import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import ItineraryForm from './ItineraryForm';
import TripCalculator from '@/components/TripCalculator';
import CalendlyButton from '@/components/CalendlyButton';
import CheckoutButton from '@/components/CheckoutButton';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'Request an Itinerary: Hilton Head Travel',
  description:
    'Tell us about your Hilton Head trip and get a custom itinerary within one business day. No obligation, no sales pitch.',
  path: '/itinerary',
  keywords: [
    'Hilton Head itinerary request',
    'Hilton Head custom trip',
    'Hilton Head vacation planner',
    'Hilton Head trip quote',
    'Hilton Head travel concierge',
    'book Hilton Head travel consultant',
    'Hilton Head travel planning service',
  ],
});

const ITINERARY_FAQ = [
  {
    question: 'How much does a Hilton Head itinerary cost?',
    answer:
      'The flat-fee custom itinerary is $450, delivered within 5-7 days and with revisions included. A $95 discovery session is also available and credits toward your itinerary if you proceed. Full-service group trips are billed as a percentage of trip spend, agreed up front.',
  },
  {
    question: 'How quickly will I hear back after submitting the form?',
    answer:
      'One business day for a real quote with scope and pricing. Same-day for active clients. If your trip is within a week, flag it in the message and we will prioritize.',
  },
  {
    question: 'Do you charge kickbacks or commissions?',
    answer:
      'No. Every fee is flat or percentage-based and agreed up front. We do not take commissions from villa companies, restaurants, or tour operators that affect your rates. Sponsorship income is separate from client work and publicly disclosed.',
  },
  {
    question: 'Can you book villas, dinner reservations, and tee times for me?',
    answer:
      'Yes. Full-service bookings include villa selection and contracts, Harbour Town and Palmetto Dunes tee times, S-tier restaurant reservations, charters, spa appointments, and airport transfers. Itineraries-only include specific recommendations and booking instructions for you to execute.',
  },
  {
    question: 'What kinds of Hilton Head trips do you plan?',
    answer:
      'Family vacations, golf trips, couples getaways, wedding weekends, corporate outings, Thanksgiving and spring break weeks, and RBC Heritage weeks. We also handle winter long-stay trips for snowbirds. If the trip is larger than six travelers, flag it on the form.',
  },
  {
    question: 'Is the discovery session worth it before the itinerary?',
    answer:
      "It is if you want to think through your trip out loud before committing. The $95 fee credits toward the $450 itinerary, so the only real cost is your time. If you already know what you want, skip the call and go straight to the itinerary request form.",
  },
  {
    question: 'Do you plan Bluffton and Palmetto Bluff trips too?',
    answer:
      'Yes. Bluffton and Palmetto Bluff are a 20-25 minute drive off-island, and we plan trips that split time between Hilton Head and Bluffton regularly. Palmetto Bluff is on our S-tier recommendation list for anniversaries and high-stakes weekends.',
  },
];

export default async function ItineraryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const fromCalendly = params.from === 'calendly';
  const paymentStatus = params.payment;
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Request Itinerary', path: '/itinerary' },
  ]);
  const faqSchema = getFaqSchema(ITINERARY_FAQ);

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

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {fromCalendly && (
          <div className="mt-10 border-l-2 border-coral bg-coral/5 px-5 py-4">
            <div className="eyebrow text-coral">Call booked</div>
            <p className="mt-2 max-w-[640px] text-[14px] leading-[1.65] text-ink">
              Thanks. You&apos;ll get a Calendly confirmation in your inbox.
              While you&apos;re here: lock in your planning slot with a deposit
              or a flat-fee itinerary below, and we&apos;ll have the plan
              waiting when we hop on the call.
            </p>
            <a
              href="#payment"
              className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink underline underline-offset-4 hover:text-coral"
            >
              Jump to checkout ↓
            </a>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mt-10 border-l-2 border-ocean bg-ocean/5 px-5 py-4">
            <div className="eyebrow text-ocean">Payment received</div>
            <p className="mt-2 max-w-[640px] text-[14px] leading-[1.65] text-ink">
              Thanks. Your receipt is on the way from Stripe. We&apos;ll be in
              touch within one business day to start planning.
            </p>
          </div>
        )}

        {paymentStatus === 'canceled' && (
          <div className="mt-10 border-l-2 border-sunset bg-sunset/5 px-5 py-4">
            <div className="eyebrow text-sunset">Payment canceled</div>
            <p className="mt-2 max-w-[640px] text-[14px] leading-[1.65] text-ink">
              No charge. Pick another option below or just submit the form and
              we&apos;ll send you a quote first.
            </p>
          </div>
        )}

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Request an Itinerary"
            plain="Tell us about"
            italic="your trip."
          />
          <p className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
            Three minutes of questions. One business day until we send back a
            real quote. No obligation, no sales pitch, and we will tell you if
            a consultant isn&apos;t worth it for your trip size.
          </p>
        </section>

        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-20">
          <aside>
            <h2 className="eyebrow text-sunset">How it goes</h2>
            <ol className="mt-6 flex flex-col gap-8">
              {[
                {
                  title: 'You submit the form',
                  body: 'Just the basics. When, who, what kind of trip.',
                },
                {
                  title: 'We send a quote within one business day',
                  body: 'Flat fee for itineraries, % of spend for full-service group trips.',
                },
                {
                  title: 'You approve, we build',
                  body: 'Full plan delivered within 5 to 7 days. Revisions included.',
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[56px_1fr] items-baseline gap-4"
                >
                  <span className="section-number text-[28px] text-gold">
                    {`0${i + 1}`}
                  </span>
                  <div>
                    <div className="display text-[18px] leading-[1.2] text-ink md:text-[20px]">
                      {step.title}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Divider ornament="palmetto" className="my-10 text-gold" />

            <p className="max-w-[420px] text-[13px] leading-[1.7] text-ink-soft">
              <span className="display-italic text-ink">A small note.</span>{' '}
              Every quote is flat or percentage-based, agreed up front. No
              kickbacks baked into your rates.
            </p>
          </aside>

          <div className="frame p-8 md:p-10">
            <ItineraryForm />
          </div>
        </div>

        {/* ——— Trip Calculator + Calendly ——— */}
        <section className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
          <TripCalculator calendlyUrl={brand.scheduling.calendly.url} />
          <aside className="flex flex-col justify-center gap-5 border-l border-ocean-deep/15 pl-0 md:pl-10">
            <div className="eyebrow text-coral">Prefer to talk?</div>
            <h3 className="display text-[26px] leading-[1.1] text-ink md:text-[34px]">
              Book a 30-minute{' '}
              <span className="display-italic">discovery call.</span>
            </h3>
            <p className="max-w-[420px] text-[14px] leading-[1.7] text-ink-soft">
              Free, no pressure. Faster than the form if you want to think out
              loud about your trip first.
            </p>
            <CalendlyButton
              url={brand.scheduling.calendly.url}
              variant="outline"
            >
              {brand.scheduling.calendly.label}
            </CalendlyButton>
          </aside>
        </section>

        {/* ——— Direct payment for repeat clients / referrals ——— */}
        <section
          id="payment"
          className="scroll-mt-20 mt-20 border-y border-ocean-deep/15 py-14"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[560px]">
              <div className="eyebrow text-coral">Already decided?</div>
              <h3 className="display mt-3 text-[26px] leading-[1.1] text-ink md:text-[34px]">
                Pay your itinerary fee{' '}
                <span className="display-italic">directly.</span>
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                For returning clients and referred guests. $95 discovery
                session (credited toward your itinerary), $450 flat itinerary,
                or a $500 trip-planning deposit applied to your final invoice.
                Secure checkout powered by Stripe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <CheckoutButton product="discovery_fee" variant="outline">
                $95 discovery session
              </CheckoutButton>
              <CheckoutButton product="itinerary_fee" variant="primary">
                $450 custom itinerary
              </CheckoutButton>
              <CheckoutButton product="trip_deposit_500" variant="outline">
                $500 trip deposit
              </CheckoutButton>
            </div>
          </div>
        </section>

        {/* ——— FAQ ——— */}
        <section className="mt-24">
          <SectionHead
            number="№ 04"
            eyebrow="FAQ"
            plain="Questions we"
            italic="hear most."
          />
          <dl className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
            {ITINERARY_FAQ.map((item) => (
              <div key={item.question} className="grid gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10">
                <dt className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                  {item.question}
                </dt>
                <dd className="text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <Footer />
    </>
  );
}
