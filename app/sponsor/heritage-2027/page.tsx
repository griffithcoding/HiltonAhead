import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import CalendlyButton from '@/components/CalendlyButton';
import HeritageRoiCalculator from '@/components/sponsor/HeritageRoiCalculator';
import HeritageInquiryForm from '@/components/sponsor/HeritageInquiryForm';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';
import {
  HERITAGE_AUDIENCE,
  HERITAGE_TOURNAMENT,
  heritageSlots,
  type HeritageSlot,
} from '@/data/heritageSponsors';

export const metadata: Metadata = generatePageMetadata({
  title: '2027 RBC Heritage Partner SKU — Hilton Ahead',
  description:
    'A category-exclusive sponsor SKU tied to the 2027 RBC Heritage. $5,000 · 4 slots · April 2027. Featured in the free Heritage Kit, the guide page, and the Heritage-week newsletter.',
  path: '/sponsor/heritage-2027',
  keywords: [
    'RBC Heritage 2027 sponsor',
    'Hilton Head sponsorship Heritage week',
    'Harbour Town sponsor partner',
    'Hilton Head travel guide sponsor',
  ],
});

const STATUS_LABEL: Record<HeritageSlot['status'], string> = {
  open: 'Open',
  reserved: 'Reserved',
  confirmed: 'Confirmed',
};

const STATUS_STYLE: Record<HeritageSlot['status'], string> = {
  open: 'border-coral/40 bg-coral/5 text-coral',
  reserved: 'border-gold/50 bg-gold/10 text-gold-deep',
  confirmed: 'border-palm/40 bg-palm/10 text-palm',
};

export default function HeritageSponsorPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Partner With Us', path: '/sponsorships' },
    { name: 'RBC Heritage 2027', path: '/sponsor/heritage-2027' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* ——— Hero ——— */}
        <section className="mt-16 md:mt-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
          >
            <Link href="/" className="transition-colors hover:text-coral">
              Home
            </Link>
            <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
            <Link href="/sponsorships" className="transition-colors hover:text-coral">
              Partner With Us
            </Link>
            <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
            <span className="text-coral">Heritage 2027</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <div className="eyebrow text-coral">RBC Heritage · 2027 Partner SKU</div>
              <h1 className="display mt-4 text-balance text-[36px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[60px] lg:text-[72px]">
                Get in front of 2027 Heritage visitors.{' '}
                <span className="display-italic">Before they book.</span>
              </h1>
              <p className="mt-7 max-w-[580px] text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
                Four category-exclusive slots in the free 2027 Heritage Kit
                and across our Heritage-week editorial. $5,000, one-time, for
                the most concentrated buyer-attention window on the island.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#inquiry"
                  className="group inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-ink"
                >
                  Reserve a slot
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <CalendlyButton
                  url={brand.scheduling.calendly.url}
                  variant="outline"
                >
                  Book a 20-min Heritage call
                </CalendlyButton>
              </div>
            </div>

            <aside className="rounded-md border-2 border-coral bg-cream p-6 md:p-8">
              <div className="tartan-pill -m-6 mb-6 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink md:-m-8 md:mb-7 md:px-8">
                Apr 12–18, 2027 · Harbour Town
              </div>
              <div className="eyebrow text-coral">The window</div>
              <p className="display mt-3 text-[24px] leading-[1.15] text-ink md:text-[28px]">
                One tournament. Four sponsors. Zero overlap.
              </p>
              <ul className="mt-6 space-y-3 text-[13.5px] leading-[1.55] text-ink-soft">
                <li>
                  <strong className="text-ink">February 2027</strong> — Free Heritage
                  Kit ships to ~3,000 high-intent visitors with your insert
                </li>
                <li>
                  <strong className="text-ink">All April 2027</strong> — Logo + 50-word
                  blurb on /guides/2027-rbc-heritage
                </li>
                <li>
                  <strong className="text-ink">Apr 12–18</strong> — Daily
                  Heritage-week newsletter + two Instagram tags
                </li>
                <li>
                  <strong className="text-ink">Q3 2027</strong> — Quarterly attribution
                  report (clicks, calls, inquiries)
                </li>
              </ul>
            </aside>
          </div>
        </section>

        {/* ——— Audience proof ——— */}
        <section className="mt-24 md:mt-32">
          <div className="eyebrow text-coral">The audience</div>
          <h2 className="display mt-3 max-w-[760px] text-[30px] leading-[1.08] text-ink md:text-[44px]">
            The only Hilton Head buyer pool concentrated{' '}
            <span className="display-italic">in a single April week.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <Stat
              big={`${HERITAGE_AUDIENCE.kitSubscribersTarget.toLocaleString()}+`}
              label="Free kit subscribers (target)"
              body="Email-gated 8-section PDF delivered February 2027. Self-selected high-intent, planning 9–10 months ahead."
            />
            <Stat
              big={`${HERITAGE_AUDIENCE.organicMonthlyVisitors.toLocaleString()}`}
              label="Organic visitors / month"
              body="Inbound traffic spikes from Jan through Apr as Heritage planning queries peak. Long-tail search owns most of it."
            />
            <Stat
              big={`${HERITAGE_AUDIENCE.newsletterSubscribers.toLocaleString()}+`}
              label="Insider Letter subscribers"
              body="Hilton Head readers who already chose to hear from us monthly. Heritage-week editions get the strongest open rates of the year."
            />
          </div>
        </section>

        {/* ——— Slot status ——— */}
        <section className="mt-24 md:mt-32">
          <div className="eyebrow text-coral">Slot status · live</div>
          <h2 className="display mt-3 text-[28px] leading-[1.08] text-ink md:text-[40px]">
            Four slots. One per category.
          </h2>
          <p className="mt-4 max-w-[640px] text-[14.5px] leading-[1.65] text-ink-soft md:text-[15.5px]">
            Category exclusivity is the product. We won&rsquo;t take two
            lodging operators or two restaurants. First booking holds the
            window through April {HERITAGE_TOURNAMENT.windowEnd.slice(0, 4)}.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {heritageSlots.map((slot) => (
              <article
                key={slot.category}
                className="flex flex-col gap-3 rounded-md border border-ocean-deep/20 bg-cream p-6 md:p-7"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display text-[20px] leading-[1.15] text-ink md:text-[24px]">
                    {slot.label}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${STATUS_STYLE[slot.status]}`}
                  >
                    {STATUS_LABEL[slot.status]}
                  </span>
                </header>
                <p className="text-[13.5px] leading-[1.55] text-ink-soft">
                  {slot.pitch}
                </p>
                {slot.sponsor && (
                  <p className="border-t border-ink/10 pt-3 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                    Held by {slot.sponsor}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ——— ROI ——— */}
        <section className="mt-24 md:mt-32">
          <HeritageRoiCalculator />
        </section>

        {/* ——— Sample inserts ——— */}
        <section className="mt-24 md:mt-32">
          <div className="eyebrow text-coral">Sample placements</div>
          <h2 className="display mt-3 max-w-[700px] text-[28px] leading-[1.08] text-ink md:text-[40px]">
            Where your brand appears.
          </h2>
          <p className="mt-4 max-w-[640px] text-[14.5px] leading-[1.65] text-ink-soft">
            Three placement formats across the kit, the guide page, and the
            Heritage-week newsletter. Designed by us, in our voice, clearly
            labeled as Sponsored.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SampleInsert
              eyebrow="Inside the PDF kit"
              title="Featured insert"
              body='A full-page editorial spread inside the Feb 2027 PDF: 200-word write-up, hero photo, booking link. Each kit subscriber sees four — yours and three other categories.'
              footer="Estimated reach · 3,000+"
            />
            <SampleInsert
              eyebrow="On /guides/2027-rbc-heritage"
              title="Always-on logo block"
              body='Your logo + 50-word blurb in a dedicated "Heritage 2027 partners" section on the always-on guide page. Keeps surfacing through Apr.'
              footer="Always on · Jan–May 2027"
            />
            <SampleInsert
              eyebrow="In the Insider Letter"
              title="Heritage-week feature"
              body='Daily Apr 12–18 editions feature one partner per category in a short editorial slot. Open rates run 40%+ during Heritage week.'
              footer="7 placements · 2,400+ subscribers"
            />
          </div>
        </section>

        {/* ——— Inquiry form ——— */}
        <section id="inquiry" className="mt-24 scroll-mt-24 md:mt-32">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div>
              <div className="eyebrow text-coral">Reserve · 24-hour reply</div>
              <h2 className="display mt-3 text-[30px] leading-[1.05] text-ink md:text-[44px]">
                Get the kit sample, slot status, and a 20-min call slot.
              </h2>
              <p className="mt-5 max-w-[440px] text-[14.5px] leading-[1.65] text-ink-soft">
                Tell us your category. We&rsquo;ll reply within 24 hours with
                an open-slot confirmation, a sample of last year&rsquo;s kit
                page, and a calendar link to lock the slot.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <CalendlyButton url={brand.scheduling.calendly.url} variant="primary">
                  Or skip ahead — book a call
                </CalendlyButton>
              </div>
            </div>
            <HeritageInquiryForm />
          </div>
        </section>

        {/* ——— FAQ ——— */}
        <section className="mt-24 md:mt-32">
          <div className="eyebrow text-coral">FAQ</div>
          <h2 className="display mt-3 text-[26px] leading-[1.08] text-ink md:text-[36px]">
            Answers we get asked first.
          </h2>
          <div className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
            {[
              {
                q: 'When does the slot start and end?',
                a: 'The window runs April 1 to April 30, 2027. The kit insert ships in February 2027. Logo on /guides/2027-rbc-heritage goes up the moment payment confirms. Newsletter placements run Apr 12–18.',
              },
              {
                q: 'What does category exclusivity actually mean?',
                a: 'We take one lodging operator, one golf / tee-time concierge, one restaurant or reservation service, and one transportation / concierge provider. We don’t double up. Adjacent categories (e.g., a villa company and a resort) can co-exist if their offerings don’t overlap; we’ll work that out on the call.',
              },
              {
                q: 'How is performance reported?',
                a: 'Every outbound link to your brand from our pages carries utm_campaign=heritage_2027. We aggregate clicks plus directory-tracked phone-calls and inquiries into a quarterly report. You see Hilton Ahead as a source in your own analytics; we cross-check with our directory event log.',
              },
              {
                q: 'What are the editorial guardrails?',
                a: 'Sponsorship is clearly labeled. We won’t inflate ranking on tier-list content. We won’t recommend a partner we wouldn’t recommend pre-deal. Editorial control of the kit’s tier lists stays with us.',
              },
              {
                q: 'What if my category is taken?',
                a: 'We’ll offer a Curated or Signature slot for the rest of 2027 with a Heritage-week emphasis baked in, and right of first refusal on Heritage 2028. Pricing differs (see /sponsorships).',
              },
              {
                q: 'Refund policy?',
                a: 'Full refund up to 30 days before the kit ships (so until early January 2027). After that, kit and digital placements are non-refundable; we’ll prorate any portion we’re unable to deliver.',
              },
            ].map((item, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="section-number text-[20px] text-gold">
                      {`№ ${String(i + 1).padStart(2, '0')}`}
                    </span>
                    <span className="display text-[18px] leading-[1.2] text-ink md:text-[22px]">
                      {item.q}
                    </span>
                  </div>
                  <span aria-hidden="true" className="relative h-[14px] w-[14px] shrink-0">
                    <span className="absolute left-0 top-[6px] h-[1px] w-full bg-ink" />
                    <span className="absolute left-[6px] top-0 h-full w-[1px] bg-ink transition-transform group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-5 max-w-[720px] text-[14.5px] leading-[1.75] text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ——— Closing CTA ——— */}
        <section className="my-24 border-y border-coral/30 bg-sand-deep/30 px-6 py-16 md:my-32 md:px-12 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_auto] md:items-center">
            <div>
              <div className="eyebrow text-coral">Last word</div>
              <h2 className="display mt-3 text-[34px] leading-[1.05] text-ink md:text-[52px]">
                Heritage 2027 is{' '}
                <span className="display-italic">{daysToTournament()}</span>{' '}
                away.
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                We pitch this once. {heritageSlots.filter((s) => s.status === 'open').length} of {heritageSlots.length} slots are open.
                We&rsquo;ll close the window when the kit ships, no exceptions.
              </p>
            </div>
            <div className="flex flex-col gap-3 self-start md:self-center">
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-ink"
              >
                Reserve a slot
                <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/sponsor/heritage-2027/deck?print=1"
                className="link-underline inline-flex items-center gap-2 px-2 py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
              >
                Or download the pitch deck ↓
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

function Stat({ big, label, body }: { big: string; label: string; body: string }) {
  return (
    <article className="flex flex-col gap-3 border-t border-ocean-deep/15 pt-8">
      <div className="display text-[44px] leading-none text-ocean md:text-[56px]">
        {big}
      </div>
      <div className="eyebrow text-ink-soft">{label}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-ink-soft">{body}</p>
    </article>
  );
}

function SampleInsert({
  eyebrow,
  title,
  body,
  footer,
}: {
  eyebrow: string;
  title: string;
  body: string;
  footer: string;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-md border border-ocean-deep/20 bg-cream p-6">
      <span className="inline-flex w-max items-center rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-coral">
        Sponsored sample
      </span>
      <div className="eyebrow text-ink-soft">{eyebrow}</div>
      <h3 className="display text-[20px] leading-[1.15] text-ink md:text-[22px]">
        {title}
      </h3>
      <p className="text-[13.5px] leading-[1.55] text-ink-soft">{body}</p>
      <p className="mt-auto pt-3 text-[11px] uppercase tracking-[0.14em] text-coral">
        {footer}
      </p>
    </article>
  );
}

function daysToTournament(): string {
  const start = new Date(HERITAGE_TOURNAMENT.start);
  const today = new Date();
  const days = Math.max(0, Math.floor((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return `${days} days`;
}
