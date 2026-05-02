import type { Metadata } from 'next';
import { generatePageMetadata } from '@/app/lib/metadata';
import { brand } from '@/data/brand';
import { sponsorshipTiers } from '@/data/partners';
import {
  HERITAGE_AUDIENCE,
  HERITAGE_TOURNAMENT,
  heritageSlots,
} from '@/data/heritageSponsors';

export const metadata: Metadata = generatePageMetadata({
  title: 'Heritage 2027 Partner Deck — Hilton Ahead',
  description: 'Six-slide pitch deck for the 2027 RBC Heritage Partner SKU.',
  path: '/sponsor/heritage-2027/deck',
  noindex: true,
});

const heritageTier = sponsorshipTiers.find((t) => t.tier === 'heritage')!;

const SLIDES = [
  { n: 1, label: 'Cover' },
  { n: 2, label: 'The tournament' },
  { n: 3, label: 'The audience' },
  { n: 4, label: 'The SKU' },
  { n: 5, label: 'The funnel' },
  { n: 6, label: 'Next step' },
];

/**
 * Print-optimized 6-slide pitch deck. Add ?print=1 to hide the slide
 * navigation and let Cmd-P render to a clean PDF.
 *
 * Each slide is a full-bleed page-sized block with `break-after: page`
 * so browser print produces one slide per page.
 */
export default async function HeritageDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ print?: string }>;
}) {
  const sp = await searchParams;
  const printMode = sp.print === '1';

  return (
    <>
      <style>{`
        @media print {
          @page { size: 11in 8.5in landscape; margin: 0.4in; }
          .deck-nav { display: none !important; }
          .deck-slide { break-after: page; min-height: 7.6in !important; }
        }
        .deck-slide { min-height: 92vh; }
      `}</style>

      <main
        className={`mx-auto px-6 py-10 ${
          printMode ? 'max-w-[1280px]' : 'max-w-[1100px]'
        }`}
      >
        {!printMode && (
          <nav
            aria-label="Slide navigation"
            className="deck-nav mb-10 flex flex-wrap items-center gap-3 border-b border-ocean-deep/15 pb-6"
          >
            <span className="eyebrow text-coral">Heritage 2027 deck</span>
            {SLIDES.map((s) => (
              <a
                key={s.n}
                href={`#slide-${s.n}`}
                className="rounded-full border border-ocean-deep/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft transition hover:border-ink hover:text-ink"
              >
                {String(s.n).padStart(2, '0')} · {s.label}
              </a>
            ))}
            <span className="ml-auto text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Cmd/Ctrl-P → save as PDF
            </span>
          </nav>
        )}

        {/* ——— Slide 1 — Cover ——— */}
        <section
          id="slide-1"
          className="deck-slide flex flex-col justify-between gap-8 border border-ocean-deep/15 bg-cream px-10 py-12"
        >
          <div className="tartan-pill -mx-10 -mt-12 px-10 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
            ★ &nbsp; 2027 RBC Heritage · Partner Deck &nbsp; ★
          </div>
          <div>
            <div className="eyebrow text-coral">Hilton Ahead × your brand</div>
            <h1 className="display mt-4 text-[56px] leading-[1.02] text-ink md:text-[80px]">
              Get in front of <br />
              2027 Heritage visitors.{' '}
              <span className="display-italic">Before they book.</span>
            </h1>
            <p className="mt-8 max-w-[640px] text-[18px] leading-[1.55] text-ink-soft">
              A category-exclusive partner SKU tied to the most concentrated
              buyer-attention week on Hilton Head. {heritageSlots.length} slots,
              one per category, ${heritageTier.price.toLocaleString()} all-in.
            </p>
          </div>
          <footer className="flex flex-wrap items-baseline justify-between gap-4 text-[12px] uppercase tracking-[0.2em] text-ink-soft">
            <span>Hilton Ahead Travel Co.</span>
            <span>{brand.url.replace('https://', '')}</span>
            <span>April 12–18, 2027 · Harbour Town</span>
          </footer>
        </section>

        {/* ——— Slide 2 — The tournament ——— */}
        <DeckSlide id="slide-2" eyebrow="The tournament" title="One April week. One island. PGA Tour stage.">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="display text-[24px] leading-[1.15] text-ink md:text-[28px]">
                Why Heritage week is different.
              </h3>
              <ul className="mt-6 space-y-4 text-[15px] leading-[1.6] text-ink-soft">
                <li>
                  <strong className="text-ink">~250,000 visitors</strong> across the
                  tournament window — the biggest week of the year for Hilton Head
                  inbound.
                </li>
                <li>
                  <strong className="text-ink">9–10 month booking lead time</strong> for
                  villa, golf, and high-end dining. Decisions are locked far ahead of
                  most travel categories.
                </li>
                <li>
                  <strong className="text-ink">Search peaks Jan–Apr</strong>, not in the
                  week itself — the kit drops in February to catch decisions, not
                  arrivals.
                </li>
                <li>
                  <strong className="text-ink">High HHI</strong> — single-week trips
                  averaging $4k–$15k per group.
                </li>
              </ul>
            </div>
            <div className="rounded-md border border-coral/30 bg-coral/5 p-7">
              <div className="eyebrow text-coral">The kit</div>
              <h4 className="display mt-3 text-[22px] leading-[1.15] text-ink md:text-[26px]">
                Free, email-gated, 8-section PDF.
              </h4>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-soft">
                Delivered {HERITAGE_TOURNAMENT.kitDeliveryMonth}: ticket strategy,
                parking hacks, lodging blueprint, dinner-priority list, tee times,
                plaid dress code, transportation, day-by-day schedule.
              </p>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-soft">
                Subscribers self-select for high intent and high spend. Your insert
                lives inside their planning artifact, not lost in a feed.
              </p>
            </div>
          </div>
        </DeckSlide>

        {/* ——— Slide 3 — The audience ——— */}
        <DeckSlide id="slide-3" eyebrow="The audience" title="Concentrated. Intent-qualified. Pre-spend.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DeckStat
              big={`${HERITAGE_AUDIENCE.kitSubscribersTarget.toLocaleString()}+`}
              label="Free kit subscribers (target)"
            />
            <DeckStat
              big={`${HERITAGE_AUDIENCE.organicMonthlyVisitors.toLocaleString()}`}
              label="Monthly organic visitors"
            />
            <DeckStat
              big={`${HERITAGE_AUDIENCE.newsletterSubscribers.toLocaleString()}+`}
              label="Insider Letter list"
            />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="display text-[22px] leading-[1.15] text-ink md:text-[26px]">
                Behavior, not demographics.
              </h3>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-soft">
                Our readers showed up because they&rsquo;re booking. The signal is
                stronger than any geographic targeting because they self-identified
                their trip-window.
              </p>
            </div>
            <div>
              <h3 className="display text-[22px] leading-[1.15] text-ink md:text-[26px]">
                Trust transfer.
              </h3>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-soft">
                We&rsquo;re a local-run editorial source. Sponsored placements run
                with the same voice and the same care as the unpaid editorial. That
                trust transfers to the partner.
              </p>
            </div>
          </div>
        </DeckSlide>

        {/* ——— Slide 4 — The SKU ——— */}
        <DeckSlide id="slide-4" eyebrow="The SKU" title="Heritage Week Partner. $5,000. 4 slots. Category-exclusive.">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_minmax(0,0.9fr)]">
            <div className="rounded-md border-2 border-coral bg-cream p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <span className="display text-[40px] leading-none text-ink md:text-[52px]">
                  ${heritageTier.price.toLocaleString()}
                </span>
                <span className="text-[12px] uppercase tracking-[0.16em] text-ink-soft">
                  {heritageTier.priceNote}
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-soft">
                {heritageTier.tagline}
              </p>
              <ul className="mt-6 flex flex-col gap-3 border-t border-ocean-deep/15 pt-5">
                {heritageTier.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-[13.5px] leading-[1.55] text-ink-soft">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-coral" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="display text-[22px] leading-[1.15] text-ink md:text-[26px]">
                The four categories.
              </h3>
              <ul className="mt-5 space-y-3">
                {heritageSlots.map((slot) => (
                  <li
                    key={slot.category}
                    className="flex items-baseline justify-between gap-3 border-b border-ocean-deep/12 pb-3"
                  >
                    <span className="text-[14.5px] font-medium text-ink">
                      {slot.label}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.14em] text-coral">
                      {slot.status === 'open' ? 'Open' : slot.status === 'reserved' ? 'Reserved' : 'Booked'}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12.5px] leading-[1.55] text-ink-soft">
                We won&rsquo;t double up inside a category. First reservation
                holds the window through April 30, 2027.
              </p>
            </div>
          </div>
        </DeckSlide>

        {/* ——— Slide 5 — The funnel ——— */}
        <DeckSlide id="slide-5" eyebrow="The funnel" title="Kit → page → directory → conversion.">
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              {
                n: '01',
                title: 'February 2027 — Kit ships',
                body: 'Subscriber receives the free Heritage Kit PDF in inbox. Your insert is one of four.',
              },
              {
                n: '02',
                title: 'Spring planning — Guide page',
                body: '/guides/2027-rbc-heritage gets returning visits as planning matures. Your logo + blurb stays on the page.',
              },
              {
                n: '03',
                title: 'Apr 12–18 — Heritage week newsletter',
                body: 'Daily editorial editions. Each carries a featured-partner block — yours rotates daily.',
              },
              {
                n: '04',
                title: 'Outbound clicks — UTM-tracked',
                body: 'Every link to your brand carries utm_campaign=heritage_2027. We see the click; you see Hilton Ahead in your analytics.',
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-md border border-ocean-deep/20 bg-cream p-6"
              >
                <div className="section-number text-[26px] text-gold md:text-[34px]">
                  {step.n}
                </div>
                <h4 className="display mt-3 text-[20px] leading-[1.15] text-ink md:text-[22px]">
                  {step.title}
                </h4>
                <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-md border border-coral/30 bg-coral/5 p-6">
            <div className="eyebrow text-coral">Quarterly report</div>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
              We send a one-page Q3 2027 attribution summary: kit-attributed
              clicks, page-attributed clicks, directory-tracked phone calls and
              inquiries, and a soft estimate of revenue at your reported close
              rate. No black-box math; we share the source data.
            </p>
          </div>
        </DeckSlide>

        {/* ——— Slide 6 — Next step ——— */}
        <DeckSlide id="slide-6" eyebrow="Next step" title="Reserve a slot. We close when the kit ships.">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="display text-[24px] leading-[1.15] text-ink md:text-[28px]">
                The path.
              </h3>
              <ol className="mt-6 space-y-4 text-[14.5px] leading-[1.6] text-ink-soft">
                <li>
                  <strong className="text-ink">1. 20-minute call</strong> — confirm
                  category fit and slot availability.
                </li>
                <li>
                  <strong className="text-ink">2. Asset brief</strong> — we draft the
                  insert and blurb in our voice; you approve.
                </li>
                <li>
                  <strong className="text-ink">3. Invoice + payment</strong> — net-30.
                  Window holds the moment payment confirms.
                </li>
                <li>
                  <strong className="text-ink">4. Quarterly check-in</strong> — Q3
                  attribution summary; renewal or right-of-first-refusal for 2028.
                </li>
              </ol>
            </div>
            <div className="rounded-md border border-coral/40 bg-cream p-7">
              <div className="eyebrow text-coral">Two paths to start</div>
              <p className="display mt-3 text-[20px] leading-[1.15] text-ink md:text-[24px]">
                Book the call or reply with your category.
              </p>
              <ul className="mt-6 space-y-4 text-[14px] leading-[1.6] text-ink-soft">
                <li>
                  <strong className="text-ink">Calendly</strong>{' '}
                  <span className="text-ink-soft">
                    {brand.scheduling.calendly.url.replace('https://', '')}
                  </span>
                </li>
                <li>
                  <strong className="text-ink">Direct</strong>{' '}
                  {brand.contact.email}
                </li>
                <li>
                  <strong className="text-ink">Web form</strong>{' '}
                  {brand.url.replace('https://', '')}/sponsor/heritage-2027#inquiry
                </li>
              </ul>
            </div>
          </div>
          <footer className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-ocean-deep/15 pt-6 text-[12px] uppercase tracking-[0.18em] text-ink-soft">
            <span>{brand.legalName}</span>
            <span>Hilton Head Island, SC</span>
            <span>Heritage 2027 · v1</span>
          </footer>
        </DeckSlide>
      </main>
    </>
  );
}

function DeckSlide({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="deck-slide mt-8 flex flex-col gap-10 border border-ocean-deep/15 bg-cream px-10 py-12"
    >
      <header className="border-b border-ocean-deep/15 pb-6">
        <div className="eyebrow text-coral">{eyebrow}</div>
        <h2 className="display mt-3 text-[34px] leading-[1.05] text-ink md:text-[48px]">
          {title}
        </h2>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function DeckStat({ big, label }: { big: string; label: string }) {
  return (
    <article className="rounded-md border border-ocean-deep/20 bg-cream p-6">
      <div className="display text-[42px] leading-none text-ocean md:text-[54px]">
        {big}
      </div>
      <div className="eyebrow mt-4 text-ink-soft">{label}</div>
    </article>
  );
}
