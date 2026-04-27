import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { B2C_TIERS, B2B_TIERS, type Tier } from '@/data/pricing';
import PurchaseTracker from './PurchaseTracker';

export const metadata: Metadata = {
  title: 'Welcome to Hilton Ahead — Hilton Head Travel Co',
  robots: { index: false, follow: false },
};

const ALL_TIERS: Tier[] = [...B2C_TIERS, ...B2B_TIERS];

interface PageProps {
  searchParams: Promise<{ session_id?: string; tier?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = ALL_TIERS.find((t) => t.slug === params.tier);

  const intakePath =
    !tier || tier.audience === 'b2c'
      ? `/itinerary${tier ? `?tier=${tier.slug}` : ''}`
      : `/local/get-featured?tier=${tier.slug}`;

  return (
    <>
      {tier?.priceUsd && params.session_id ? (
        <PurchaseTracker
          sessionId={params.session_id}
          tier={tier.slug}
          value={tier.priceUsd}
        />
      ) : null}
      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mx-auto mt-20 max-w-[680px] py-10 md:mt-28 md:py-16">
          <div className="eyebrow-coral eyebrow">
            Payment received · Welcome
          </div>
          <h1 className="display mt-5 text-balance text-[36px] leading-[1.05] tracking-[-0.025em] text-ink sm:text-[44px] md:text-[64px]">
            You&apos;re in.{' '}
            <span className="display-italic text-coral">Now the trip.</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
            {tier ? (
              <>
                Thanks for purchasing <strong>{tier.name}</strong>. Confirmation
                landed in your inbox a few seconds ago — check spam if you
                don&apos;t see it.
              </>
            ) : (
              <>
                Your purchase is confirmed. A receipt and welcome email landed
                in your inbox a few seconds ago — check spam if you don&apos;t
                see it.
              </>
            )}
          </p>

          <div className="mt-10 border-y border-ocean-deep/15 py-8">
            <h2 className="display text-[22px] leading-[1.2] text-ink md:text-[26px]">
              {tier?.audience === 'b2b'
                ? 'Next: tell us about your business.'
                : 'Next: tell us about your trip.'}
            </h2>
            <p className="mt-3 max-w-[520px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
              {tier?.audience === 'b2b'
                ? 'Three minutes of intake — business name, industry, contact, what you want featured. We come back inside one business day.'
                : 'Three minutes of intake — dates, group size, what you want out of the trip. We come back inside one business day with the first draft of a plan.'}
            </p>
            <Link
              href={intakePath}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
            >
              {tier?.audience === 'b2b' ? 'Complete partner intake' : 'Complete trip intake'}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="mt-10 text-[13px] leading-[1.7] text-ink-soft">
            Receipt + tax invoice via Stripe. Reply to either email
            with questions, or text us during business hours. We&apos;ll be in
            touch within a business day either way.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-[12px]">
            <Link
              href="/"
              className="link-underline uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
            >
              ← Back to home
            </Link>
            <Link
              href="/blog"
              className="link-underline uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
            >
              Read the local guide
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
