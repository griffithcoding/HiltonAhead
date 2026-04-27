import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { B2C_TIERS, B2B_TIERS, type Tier } from '@/data/pricing';

export const metadata: Metadata = {
  title: 'Checkout canceled — Hilton Ahead',
  robots: { index: false, follow: false },
};

const ALL_TIERS: Tier[] = [...B2C_TIERS, ...B2B_TIERS];

interface PageProps {
  searchParams: Promise<{ tier?: string }>;
}

export default async function CheckoutCanceledPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = ALL_TIERS.find((t) => t.slug === params.tier);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mx-auto mt-20 max-w-[680px] py-10 md:mt-28 md:py-16">
          <div className="eyebrow text-ink-soft">Checkout canceled</div>
          <h1 className="display mt-5 text-balance text-[36px] leading-[1.05] tracking-[-0.025em] text-ink sm:text-[44px] md:text-[60px]">
            No charge.{' '}
            <span className="display-italic text-coral">No pressure.</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
            {tier ? (
              <>
                You backed out before completing the {tier.name} purchase.
                Nothing was charged. The button is still there if you change
                your mind, or you can take a free first step instead.
              </>
            ) : (
              <>
                You backed out before completing checkout. Nothing was charged.
                Try again, or take a free first step instead.
              </>
            )}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Link
              href="/itinerary"
              className="group flex flex-col gap-3 rounded-md border border-ocean-deep/20 bg-sand-soft p-6 transition-colors hover:border-coral hover:bg-cream"
            >
              <div className="eyebrow-coral eyebrow">Free</div>
              <div className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                Tell us about the trip
              </div>
              <p className="text-[13px] leading-[1.65] text-ink-soft">
                We come back with a sample plan and pricing. No commitment.
              </p>
              <span className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                Open the form →
              </span>
            </Link>
            <Link
              href={tier ? `/services#${tier.slug}` : '/services'}
              className="group flex flex-col gap-3 rounded-md border border-ocean-deep/20 bg-sand-soft p-6 transition-colors hover:border-coral hover:bg-cream"
            >
              <div className="eyebrow text-ink-soft">Reconsider</div>
              <div className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                See the tiers again
              </div>
              <p className="text-[13px] leading-[1.65] text-ink-soft">
                Compare what each tier includes side by side.
              </p>
              <span className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                Back to pricing →
              </span>
            </Link>
          </div>

          <p className="mt-10 text-[13px] leading-[1.7] text-ink-soft">
            Questions? Email us at{' '}
            <a
              href="mailto:hiltonahead@gmail.com"
              className="link-underline text-ink"
            >
              hiltonahead@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
