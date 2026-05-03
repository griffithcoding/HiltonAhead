import type { Metadata } from 'next';
import Link from 'next/link';
import { AD_TIERS, getStripePriceId, type Tier } from '@/data/pricing';
import { generatePageMetadata } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: `Advertise on ${brand.name} — display ads for Hilton Head operators`,
  description:
    'Reach travelers actively planning a Hilton Head trip. Self-serve display ad slots, monthly billing, full impression and click reporting. From $249/mo.',
  path: '/advertise',
  keywords: [
    'advertise hilton head',
    'hilton head business advertising',
    'hilton head sponsorship',
    'local advertising hilton head',
  ],
});

const accentClasses: Record<Tier['accent'], string> = {
  gold: 'border-gold/40 bg-gold/5',
  coral: 'border-coral/40 bg-coral/5',
  ocean: 'border-ocean/30 bg-ocean/5',
  ink: 'border-ink/30 bg-ink/5',
};

function CheckoutButton({ tier }: { tier: Tier }) {
  const ready = tier.mode === 'self-serve' && Boolean(getStripePriceId(tier));
  const label = ready ? 'Buy now' : 'Request this slot';
  const href = ready ? undefined : `/itinerary?tier=${tier.slug}`;

  if (ready) {
    return (
      <form method="POST" action="/api/checkout">
        <input type="hidden" name="tier" value={tier.slug} />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
        >
          {label} — {tier.priceDisplay}
        </button>
      </form>
    );
  }

  return (
    <Link
      href={href!}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-sand px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-sand"
    >
      {label}
    </Link>
  );
}

export default function AdvertisePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-coral">For Hilton Head operators</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            Reach travelers planning a Hilton Head trip — right now.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            Sponsored slots on the pages travelers actually use to plan: the local
            directory, our long-form stories, and the trip-type landing pages. No
            networks, no programmatic — direct, measured, and capped by category.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 text-coral">Why advertise here</p>
          <h2 className="display text-2xl font-medium text-ink md:text-3xl">
            Better intent than Facebook. Better attribution than billboards.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">
              Intent-matched audience
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Our readers arrive searching things like &ldquo;hilton head things to
              do&rdquo; and &ldquo;hilton head wedding venues.&rdquo; They&apos;re
              already mid-decision.
            </p>
          </div>
          <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">
              Real attribution
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Every slot tracks impressions and clicks server-side. You get a
              monthly performance report — not a screenshot of a Canva graphic.
            </p>
          </div>
          <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">
              Category-capped
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              One sponsor per page surface. You&apos;re not stacked next to seven
              competitors fighting for the same click.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-rule-soft bg-sand-soft/40 px-5 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-2 text-coral">Pricing</p>
            <h2 className="display text-2xl font-medium text-ink md:text-3xl">
              Three slot types. Self-serve. Cancel anytime.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AD_TIERS.map((tier) => (
              <div
                key={tier.slug}
                className={[
                  'relative flex flex-col rounded-2xl border-2 bg-sand p-6 shadow-sm',
                  accentClasses[tier.accent],
                ].join(' ')}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                    Most popular
                  </span>
                )}
                <h3 className="display text-2xl font-medium text-ink">
                  {tier.name}
                </h3>
                <div className="mt-2 text-3xl font-bold text-ink">
                  {tier.priceDisplay}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {tier.tagline}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-soft">
                  {tier.includes.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[12px] italic leading-snug text-ink-soft/70">
                  Best for: {tier.idealFor}
                </p>
                <div className="mt-5">
                  <CheckoutButton tier={tier} />
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-ink-soft/80">
            Looking for the year-round Featured / Signature partner program (logo
            on every page, monthly newsletter mentions, full editorial)?{' '}
            <Link href="/partners" className="underline hover:text-ink">
              See partner tiers →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
          Common questions
        </h2>
        <div className="space-y-px">
          {[
            {
              q: 'How do you measure impressions and clicks?',
              a: 'Every slot fires a server-side event when it loads in a real browser, and again when the CTA is clicked. We deliver a monthly report with totals plus a 90-day rolling chart. We do not bill on bot traffic — anything we filter out as a bot does not count toward your impressions.',
            },
            {
              q: 'How fast does the slot go live?',
              a: 'Within one business day of payment. We need creative (logo, headline, body, link) — if you do not have copy ready we can write it for you in the same window.',
            },
            {
              q: 'What if my category page is not listed?',
              a: 'We open new page-display surfaces as the editorial calendar fills out. If you have a clear category match, ask — we will quote on adding the surface.',
            },
            {
              q: 'Is this the same as the Featured / Signature partner program?',
              a: 'No. The partner program is annual, includes editorial and newsletter inclusion, and gets you on every page in the footer. Ad slots are smaller, monthly, and live on one specific page surface. Both are sold; many businesses run both.',
            },
            {
              q: 'Refund policy?',
              a: 'Monthly subscriptions: cancel anytime, no proration. Story Sponsor (one-time): refundable for 7 days from purchase if the story has not been edited; non-refundable after that.',
            },
          ].map(({ q, a }, i) => (
            <details key={i} className="group border-b border-rule-soft py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                <span>{q}</span>
                <span className="mt-0.5 shrink-0 text-ocean transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-rule-soft bg-sand-soft/60 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display mb-4 text-2xl font-medium text-ink md:text-3xl">
            Questions? Want a custom slot?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-ink-soft">
            Email{' '}
            <a
              href={`mailto:${brand.contact.email}`}
              className="underline hover:text-ink"
            >
              {brand.contact.email}
            </a>{' '}
            with a one-line description of your business and which page you want
            to appear on. We respond same business day.
          </p>
          <Link
            href={brand.scheduling.calendly.url}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
            target="_blank"
            rel="noopener noreferrer"
          >
            {brand.scheduling.calendly.label}
          </Link>
        </div>
      </section>
    </>
  );
}
