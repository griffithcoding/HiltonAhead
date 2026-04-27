/**
 * Pricing tier grid for /services (B2C) and /partners (B2B).
 *
 * Server component — no client state. Each card renders a hidden form
 * that POSTs to /api/checkout with the tier slug; the form submission
 * triggers a 303 redirect to Stripe's hosted Checkout page.
 *
 * Application-only tiers (Heritage, Signature) link to the intake
 * form instead of triggering a checkout.
 */

import Link from 'next/link';
import type { Tier } from '@/data/pricing';

interface Props {
  tiers: Tier[];
  /** Optional href to the application form for application-only tiers. */
  applyHref?: string;
}

const ACCENT_RING: Record<NonNullable<Tier['accent']>, string> = {
  gold: 'border-gold/40',
  coral: 'border-coral/40',
  ocean: 'border-ocean-deep/15',
  ink: 'border-ink/20',
};

const ACCENT_TEXT: Record<NonNullable<Tier['accent']>, string> = {
  gold: 'text-gold',
  coral: 'text-coral',
  ocean: 'text-ocean',
  ink: 'text-ink',
};

const POPULAR_BG: Record<NonNullable<Tier['accent']>, string> = {
  gold: 'bg-gold text-ink',
  coral: 'bg-coral text-cream',
  ocean: 'bg-ocean text-cream',
  ink: 'bg-ink text-cream',
};

export default function PricingTiers({ tiers, applyHref = '/itinerary' }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
      {tiers.map((tier) => (
        <TierCard key={tier.slug} tier={tier} applyHref={applyHref} />
      ))}
    </div>
  );
}

function TierCard({ tier, applyHref }: { tier: Tier; applyHref: string }) {
  const accent = tier.accent;
  return (
    <article
      className={`relative flex flex-col rounded-md border bg-sand-soft p-7 md:p-8 ${ACCENT_RING[accent]}`}
    >
      {tier.popular && (
        <span
          className={`absolute -top-3 right-6 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${POPULAR_BG[accent]}`}
        >
          Most popular
        </span>
      )}

      {/* Header */}
      <div className={`eyebrow ${ACCENT_TEXT[accent]}`}>{tier.name}</div>
      <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
        {tier.tagline}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-2 border-t border-ocean-deep/10 pt-6">
        <span className="display text-[40px] leading-none tracking-[-0.02em] text-ink md:text-[48px]">
          {tier.priceDisplay}
        </span>
      </div>
      {tier.commissionAddendum && (
        <div className="mt-2 text-[12px] text-ink-soft">
          {tier.commissionAddendum}
        </div>
      )}

      {/* Includes */}
      <ul className="mt-6 flex flex-1 flex-col gap-2.5">
        {tier.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[13.5px] leading-[1.5] text-ink"
          >
            <span
              aria-hidden="true"
              className={`mt-[6px] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${ACCENT_TEXT[accent]}`}
              style={{ backgroundColor: 'currentColor' }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Ideal for */}
      <div className="mt-6 border-t border-ocean-deep/10 pt-4">
        <div className="eyebrow text-ink-soft">Ideal for</div>
        <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
          {tier.idealFor}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-7">
        {tier.mode === 'self-serve' ? (
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="tier" value={tier.slug} />
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
            >
              {tier.billing === 'subscription_yearly'
                ? `Subscribe — ${tier.priceDisplay}`
                : `Buy ${tier.priceDisplay}`}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <Link
            href={`${applyHref}?tier=${tier.slug}`}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-cream"
          >
            Apply for {tier.name}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
