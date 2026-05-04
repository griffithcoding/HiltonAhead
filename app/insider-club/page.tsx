import type { Metadata } from 'next';
import Link from 'next/link';
import { B2C_TIERS, getStripePriceId, type Tier } from '@/data/pricing';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'The Insider Club — year-round local intel for Hilton Head Island',
  description:
    'Subscriber-only newsletter, private locals chat, and reservation help for repeat visitors and second-home owners. $9/mo or $99/yr.',
  path: '/insider-club',
  keywords: [
    'hilton head insider club',
    'hilton head locals newsletter',
    'hilton head membership',
    'hilton head private chat',
    'hilton head reservation help',
  ],
});

const accentClasses: Record<Tier['accent'], string> = {
  gold: 'border-gold/40 bg-gold/5',
  coral: 'border-coral/40 bg-coral/5',
  ocean: 'border-ocean/30 bg-ocean/5',
  ink: 'border-ink/30 bg-ink/5',
};

function MembershipButton({ tier }: { tier: Tier }) {
  const ready = tier.mode === 'self-serve' && Boolean(getStripePriceId(tier));
  if (ready) {
    return (
      <form method="POST" action="/api/checkout">
        <input type="hidden" name="tier" value={tier.slug} />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
        >
          Join — {tier.priceDisplay}
        </button>
      </form>
    );
  }
  return (
    <Link
      href="/itinerary?tier=insider-club"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-sand px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-sand"
    >
      Join the waitlist
    </Link>
  );
}

export default function InsiderClubPage() {
  const tiers = B2C_TIERS.filter(
    (t) => t.slug === 'insider-club-monthly' || t.slug === 'insider-club-yearly',
  );

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Insider Club', path: '/insider-club' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-coral">A members-only intel feed</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            The Insider Club
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            Year-round local intel for repeat visitors, snowbirds, and second-home
            owners. Members-only newsletter, private Discord with the founder,
            reservation help when OpenTable fails you, and early-warning alerts
            on closures and tee-time releases.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 text-coral">What you actually get</p>
          <h2 className="display text-2xl font-medium text-ink md:text-3xl">
            The unfiltered version of the public newsletter.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              h: 'Members-only monthly dispatch',
              b: 'Restaurant openings the week they happen, ordinance changes that affect rentals, hurricane-season risk reads. The stuff we trim out of the public newsletter because it’s too in-the-weeds.',
            },
            {
              h: 'Private locals Discord',
              b: 'A small, quiet channel with the founder, repeat clients, and a handful of trusted operators. Ask a question, get an answer same day.',
            },
            {
              h: 'Reservation help',
              b: 'We hold tables you cannot book on OpenTable. Members get first call. Same for hard-to-get tee times and Heritage-week ticket leads.',
            },
            {
              h: 'Early-warning alerts',
              b: 'Storm-track texts during hurricane season. Course closures. Tee-time release windows. The 48-hour-warning version of the news, not the after-the-fact version.',
            },
          ].map(({ h, b }) => (
            <div key={h} className="rounded-2xl border border-rule-soft bg-sand-soft p-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">{h}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-rule-soft bg-sand-soft/40 px-5 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-2 text-coral">Pricing</p>
            <h2 className="display text-2xl font-medium text-ink md:text-3xl">
              Pick a cadence. Cancel anytime.
            </h2>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.slug}
                className={[
                  'relative flex flex-col rounded-2xl border-2 bg-sand p-6 shadow-sm',
                  accentClasses[tier.accent],
                ].join(' ')}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                    Best value
                  </span>
                )}
                <h3 className="display text-2xl font-medium text-ink">{tier.name}</h3>
                <div className="mt-2 text-3xl font-bold text-ink">{tier.priceDisplay}</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{tier.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-soft">
                  {tier.includes.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <MembershipButton tier={tier} />
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-[12px] leading-relaxed text-ink-soft/80">
            Want the free public newsletter instead?{' '}
            <Link href="/" className="underline hover:text-ink">
              Subscribe on the homepage →
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
          Common questions
        </h2>
        <div className="space-y-px">
          {[
            {
              q: 'How is this different from the free newsletter?',
              a: 'The free Insider Letter is monthly editorial. The Club is short, frequent, and operationally useful — closures and openings the week they happen, plus the chat and reservation channel. If the free newsletter is a magazine, the Club is a group text with a local.',
            },
            {
              q: 'How quickly does the chat get answered?',
              a: 'Same day on weekdays, usually under two hours. The community is small on purpose so questions don’t scroll off.',
            },
            {
              q: 'Cancellation?',
              a: 'Monthly: cancel anytime, no proration. Yearly: refundable for 30 days from purchase, after that it runs to the end of the term.',
            },
            {
              q: 'Is this just the Charter or Compass service repackaged?',
              a: 'No. Concierge service is per-trip and includes itinerary build + bookings. The Club is year-round access to a local — for the times you don’t need a full plan, just a fast answer.',
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

      <section className="border-t border-rule-soft bg-sand-soft/60 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display mb-4 text-2xl font-medium text-ink md:text-3xl">
            Questions before you join?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-ink-soft">
            Email{' '}
            <a href={`mailto:${brand.contact.email}`} className="underline hover:text-ink">
              {brand.contact.email}
            </a>{' '}
            with what you’re hoping to get out of it. Same-business-day reply.
          </p>
        </div>
      </section>
    </>
  );
}
