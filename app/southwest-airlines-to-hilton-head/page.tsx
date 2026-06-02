import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import {
  SOUTHWEST_HHI,
  SOUTHWEST_PERKS,
  SOUTHWEST_FAQS,
} from '@/data/southwestToHiltonHead';

export const metadata: Metadata = generatePageMetadata({
  title: 'Flying Southwest to Hilton Head (via Savannah/SAV) — 2026 Guide',
  description:
    'How to fly Southwest Airlines to Hilton Head Island: SAV is the gateway (45 minutes from the island), two free checked bags, no change fees, and how to use Rapid Rewards points for an award flight.',
  path: '/southwest-airlines-to-hilton-head',
  keywords: [
    'Southwest to Hilton Head',
    'Southwest Airlines Hilton Head',
    'fly Southwest to Savannah',
    'Southwest SAV airport',
    'Hilton Head flights Southwest',
    'Rapid Rewards Hilton Head',
  ],
});

export default function SouthwestToHiltonHeadPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Trip planning', path: '/services' },
    { name: 'Flying Southwest to Hilton Head', path: '/southwest-airlines-to-hilton-head' },
  ]);
  const faqSchema = getFaqSchema(SOUTHWEST_FAQS);

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
            eyebrow="Getting here"
            plain="Flying Southwest to"
            italic="Hilton Head"
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
              Southwest doesn&rsquo;t fly to Hilton Head Island itself — it flies
              into{' '}
              <strong>
                {SOUTHWEST_HHI.airportName} ({SOUTHWEST_HHI.airportCode})
              </strong>
              , about <strong>{SOUTHWEST_HHI.driveMinutesToHhi} minutes</strong>{' '}
              and {SOUTHWEST_HHI.driveMilesToHhi} miles from the island. You get
              two free checked bags, no change fees, and a quick drive up US-278.
              Booking on points? You can top up Rapid Rewards if you&rsquo;re
              short for the award.
            </p>
          </aside>

          <p className="mt-8 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            For most travelers, Southwest is the value way into the Lowcountry.
            It has served Savannah/Hilton Head International (SAV) since{' '}
            {SOUTHWEST_HHI.serviceSince}, and the airport sits a comfortable
            45-minute drive from the island&rsquo;s gates. Below: why SAV beats
            the on-island field for most trips, the perks that actually matter
            for a beach week, and how to handle an award flight on Rapid Rewards.
          </p>
        </div>

        {/* Why SAV */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Why fly into{' '}
            <span className="display-italic">Savannah (SAV)</span>
          </h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            Hilton Head Island Airport (HHH) is a small regional field with
            limited service and higher fares. Savannah/Hilton Head International
            (SAV) is the practical gateway: far more nonstop routes, Southwest
            service, and a straightforward 45-minute, ~{SOUTHWEST_HHI.driveMilesToHhi}-mile
            drive up US-278 to the island. Pick up a rental car at the airport —
            the island is 12 miles long, and most beaches, restaurants, and golf
            courses aren&rsquo;t walkable from any single base.
          </p>
        </section>

        {/* Perks */}
        <section className="mt-20">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            What Southwest gets{' '}
            <span className="display-italic">a beach week right</span>
          </h2>

          <div className="mt-10 space-y-10">
            {SOUTHWEST_PERKS.map((perk) => (
              <article key={perk.title} className="border-t border-rule-soft pt-7">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
                  {perk.title}
                </h3>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
                  {perk.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Rapid Rewards points — the monetized callout (Points.com program
            pays on points purchases, not flight bookings). */}
        <section
          aria-label="Rapid Rewards points for a Hilton Head award flight"
          className="mt-20 md:mt-24"
        >
          <div className="mb-6">
            <h2 className="eyebrow text-coral">Booking on points?</h2>
          </div>
          <AffiliateDisclosure variant="inline" className="mb-5" />
          <AffiliateCard
            programId="southwest"
            placement="southwest-hhi/rapid-rewards"
            headline="Short on Rapid Rewards points for your Hilton Head flight?"
            description="Southwest award flights into Savannah/Hilton Head (SAV) book with no blackout dates and the same two-free-bags benefit. If you're a little short for the award you want, you can buy, gift, or top up Rapid Rewards points directly."
            cta="Top up Rapid Rewards →"
          />
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Southwest &amp; Hilton Head{' '}
            <span className="display-italic">questions</span>
          </h2>

          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {SOUTHWEST_FAQS.map((f, i) => (
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
        <section className="mt-20">
          <Divider ornament="compass" className="mb-10 text-gold" />
          <h3 className="eyebrow text-ink-soft">Plan the rest of your trip</h3>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/cost-of-hilton-head-trip', label: 'What a trip costs' },
              { href: '/best-time-to-visit-hilton-head', label: 'Best time to visit' },
              { href: '/hilton-head-family-trip-planner', label: 'Family trip planning' },
              { href: '/hilton-head-hurricane-season', label: 'Hurricane season' },
              { href: '/hilton-head-oceanfront-villas', label: 'Oceanfront villas' },
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
