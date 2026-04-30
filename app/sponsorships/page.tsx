import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import CheckoutButton from '@/components/CheckoutButton';
import CalendlyButton from '@/components/CalendlyButton';
import { SectionHead, Divider, TravelSeal } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { sponsorshipTiers, partnersMeta } from '@/data/partners';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'Partner With Us: Sponsor Hilton Ahead',
  description:
    'Sponsorship tiers for Hilton Head businesses. Curated at $400/mo and Signature at $1,000/mo. Limited slots per year.',
  path: '/sponsorships',
  keywords: [
    'Hilton Head advertising',
    'Hilton Head sponsorship',
    'Hilton Head business partnership',
    'Hilton Head local advertising',
  ],
});

export default function SponsorshipsPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Partner With Us', path: '/sponsorships' },
  ]);

  const slotsRemaining = {
    featured:
      partnersMeta.slotsAvailable.featured - partnersMeta.slotsFilled.featured,
    curated:
      partnersMeta.slotsAvailable.curated - partnersMeta.slotsFilled.curated,
    signature:
      partnersMeta.slotsAvailable.signature -
      partnersMeta.slotsFilled.signature,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Partner With Us"
            plain="Reach Hilton Head travelers"
            italic="in their 30-to-180-day booking window."
          />
          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
            We write for the people planning a Hilton Head trip: high income,
            high intent, and not yet spent. Three partnership tiers, limited
            slots per year, honest editorial.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CalendlyButton
              url={brand.scheduling.calendly.url}
              variant="primary"
            >
              Book a partner call
            </CalendlyButton>
            <a
              href="#tiers"
              className="link-underline inline-flex items-center gap-2 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
            >
              Or jump to the tiers ↓
            </a>
          </div>
        </section>

        <Divider ornament="sailboat" className="my-20" />

        {/* ——— Why partner with us ——— */}
        <section>
          <h2 className="eyebrow text-coral">Why it works</h2>
          <h3 className="display mt-4 max-w-[760px] text-[32px] leading-[1.08] text-ink md:text-[44px]">
            Not a newsletter. Not a billboard.{' '}
            <span className="display-italic">
              Qualified buyer attention while people plan their trip.
            </span>
          </h3>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                stat: '30 to 180',
                unit: 'day booking window',
                body:
                  'Our readers land on the site already planning a trip. You\u2019re reaching them while the decision is open, not mid-scroll on Instagram.',
              },
              {
                stat: '$3,500+',
                unit: 'median trip spend',
                body:
                  'Self-selected high-spend travelers. Typical reader drops $4k to $15k in 5 to 10 days on lodging, dining, activities, and shopping.',
              },
              {
                stat: '1 island',
                unit: '12 miles',
                body:
                  'No geographic waste. Every reader is either planning to visit Hilton Head or on-island now. 100% of impressions are local-intent.',
              },
            ].map((item) => (
              <article
                key={item.stat}
                className="flex flex-col gap-3 border-t border-ocean-deep/15 pt-8"
              >
                <div className="display text-[44px] leading-none text-ocean md:text-[56px]">
                  {item.stat}
                </div>
                <div className="eyebrow text-ink-soft">{item.unit}</div>
                <p className="mt-2 text-[14px] leading-[1.7] text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ——— Tiers ——— */}
        <section id="tiers" className="mt-28 md:mt-36 scroll-mt-20">
          <SectionHead
            number="№ 02"
            eyebrow="Tiers"
            plain="Two ways"
            italic="to partner."
          />
          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
            Each tier is capped on slots per year. When a tier fills, we close
            it until the next cycle. Pay annually; cancel before year 2.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
            {sponsorshipTiers.filter((t) => t.tier !== 'featured').map((t, i) => {
              const available =
                slotsRemaining[t.tier as keyof typeof slotsRemaining];
              const isPremium = t.tier === 'signature';
              const isMid = t.tier === 'curated';
              return (
                <article
                  key={t.tier}
                  className={`flex flex-col gap-6 p-8 md:p-10 ${
                    isPremium
                      ? 'border-2 border-coral bg-sand-deep/30 shadow-[0_20px_50px_-15px_rgba(10,41,48,0.2)]'
                      : isMid
                        ? 'border border-ocean-deep/25 bg-sand-soft/50'
                        : 'border border-ocean-deep/15'
                  }`}
                >
                  <header className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`eyebrow ${isPremium ? 'text-coral' : 'text-ocean'}`}
                      >
                        {t.name}
                      </span>
                      {isPremium && (
                        <span className="bg-coral px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-sand">
                          Flagship
                        </span>
                      )}
                    </div>
                    <h3 className="display text-[30px] leading-[1.08] text-ink md:text-[36px]">
                      ${t.price.toLocaleString()}
                      <span className="text-[14px] font-normal text-ink-soft">
                        {' '}
                        / year
                      </span>
                    </h3>
                    <div className="text-[13px] text-ink-soft">
                      ${t.monthlyEquivalent.toLocaleString()}/mo · {t.slots} slots · {available} remaining
                    </div>
                    <p className="display-italic text-[16px] leading-[1.4] text-ink-soft md:text-[17px]">
                      {t.tagline}
                    </p>
                  </header>

                  <ul className="flex flex-col gap-3 border-t border-ocean-deep/15 pt-5">
                    {t.benefits.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-[13.5px] leading-[1.6] text-ink-soft"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-px w-4 shrink-0 ${isPremium ? 'bg-coral' : 'bg-gold'}`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-ocean-deep/15 pt-5">
                    <div className="eyebrow mb-3 text-ink-soft">
                      Ideal for
                    </div>
                    <p className="text-[13px] leading-[1.6] text-ink-soft">
                      {t.idealFor}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <CheckoutButton
                      product={t.productKey}
                      variant={isPremium ? 'primary' : 'outline'}
                    >
                      Subscribe · ${t.price.toLocaleString()}/yr
                    </CheckoutButton>
                    <CalendlyButton
                      url={brand.scheduling.calendly.url}
                      variant="link"
                      className="!justify-start !px-0"
                    >
                      Or book a call first
                    </CalendlyButton>
                  </div>

                  {i === 0 && (
                    <span className="eyebrow text-ink-soft">
                      No setup fee · Cancel before year 2
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ——— FAQ-style guardrails ——— */}
        <section className="mt-28 md:mt-36">
          <SectionHead
            number="№ 03"
            eyebrow="Guardrails"
            plain="The things we"
            italic="won't do."
          />
          <div className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
            {[
              {
                q: 'Do paying partners get higher tier-list rankings?',
                a: 'No. Our restaurant, stays, and activity rankings stay entirely merit-based. Partners get named in additional editorial real estate (sidebar mentions, newsletter, dedicated posts), never placement-for-pay on ranked content.',
              },
              {
                q: 'Will my sponsored links hurt your SEO?',
                a: 'No. We mark every sponsored outbound link with rel="sponsored nofollow" per Google\u2019s webmaster guidelines. That\u2019s industry standard and what every reputable publisher does.',
              },
              {
                q: 'Can I sponsor a specific blog post?',
                a: 'For Signature Partners, yes. The dedicated editorial post in your year is effectively yours, written by our team in our voice, clearly labeled as sponsored content. We don\u2019t accept one-off sponsored posts from non-partners.',
              },
              {
                q: 'How do you pick which tier-list item my business fits?',
                a: 'We write the list based on our honest assessment of all island operators in that category. We don\u2019t flex that for money. If your business isn\u2019t in our S/A tier, a Curated mention goes in a related editorial post (best kept-secrets, neighborhood deep-dive, etc.).',
              },
              {
                q: 'What if my category already has a Signature partner?',
                a: 'We cap one Signature partner per category (one villa company, one wedding venue, one golf course, etc.) to avoid conflicts. If your category is taken, we\u2019ll hold your spot for the following year or place you in Curated in the meantime.',
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
                  <span
                    aria-hidden="true"
                    className="relative h-[14px] w-[14px] shrink-0"
                  >
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

        {/* ——— CTA ——— */}
        <section className="mt-24 border-y border-coral/30 bg-sand-deep/30 px-6 py-16 md:px-12 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_auto] md:items-center">
            <div>
              <TravelSeal
                size={88}
                topText="PARTNER · HILTON AHEAD"
                bottomText="· APPLICATIONS OPEN 2026 ·"
                motif="compass"
                className="text-ocean-deep mb-6"
              />
              <div className="eyebrow text-coral">Ready to talk?</div>
              <h2 className="display mt-4 text-[34px] leading-[1.05] text-ink md:text-[52px]">
                Book a 30-minute{' '}
                <span className="display-italic">partner call.</span>
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                We&apos;ll show you our current analytics, talk through which
                tier fits, and give you 48 hours to decide. No-pressure.
              </p>
            </div>
            <div className="flex flex-col gap-3 self-start md:self-center">
              <CalendlyButton
                url={brand.scheduling.calendly.url}
                variant="primary"
              >
                Book partner call
              </CalendlyButton>
              <Link
                href="/partners"
                className="link-underline inline-flex items-center gap-2 px-2 py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
              >
                See current partners ↗
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
