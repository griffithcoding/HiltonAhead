import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import {
  partnersMeta,
  partnersByTier,
  type Partner,
} from '@/data/partners';
import PricingTiers from '@/components/pricing/PricingTiers';
import { B2B_TIERS } from '@/data/pricing';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Partners: Trusted Hilton Head Businesses',
  description:
    'The Hilton Head businesses we work with every day. Villa companies, restaurants, charters, and venues we\u2019d recommend whether they paid us or not.',
  path: '/partners',
  keywords: [
    'Hilton Head partners',
    'Hilton Head recommended businesses',
    'Hilton Head villa companies',
    'Hilton Head local businesses',
    'Hilton Head restaurants partners',
    'Hilton Head charter and tour operators',
    'Hilton Head wedding vendors',
    'Hilton Head trusted vendors',
  ],
});

const TIER_LABELS = {
  signature: 'Signature Partner',
  curated: 'Curated Partner',
} as const;

export default function PartnersPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Partners', path: '/partners' },
  ]);

  const grouped = partnersByTier();
  const hasPartners = partnersMeta.hasActivePartners;

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
            eyebrow="Partners"
            plain="The local businesses we"
            italic="actually recommend."
          />
          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
            Every name on this page is a business we&apos;d point clients
            toward whether they paid us or not. Our partner program makes that
            relationship formal. We earn a small sponsorship fee, they get
            access to our readers, and our tier-list rankings remain 100%
            merit-based regardless.
          </p>
        </section>

        <Divider ornament="compass" className="my-16" />

        {hasPartners ? (
          <div className="flex flex-col gap-16">
            {/* Signature — premium block */}
            {grouped.signature.length > 0 && (
              <TierSection
                label={TIER_LABELS.signature}
                subtitle="Our closest working relationships."
                partners={grouped.signature}
                featured
              />
            )}
            {grouped.curated.length > 0 && (
              <TierSection
                label={TIER_LABELS.curated}
                subtitle="Businesses we genuinely send people to."
                partners={grouped.curated}
              />
            )}
          </div>
        ) : (
          // ——— Graceful empty-state ———
          <section className="border-y border-ocean-deep/15 py-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="eyebrow text-coral">Accepting applications</div>
                <h2 className="display mt-4 text-[30px] leading-[1.1] text-ink md:text-[40px]">
                  We&apos;re building the{' '}
                  <span className="display-italic">inaugural partner roster.</span>
                </h2>
                <p className="mt-5 max-w-[560px] text-[15px] leading-[1.75] text-ink-soft md:text-[17px]">
                  As of 2026, we&apos;re opening three Signature and six Curated
                  slots per year. If you run a Hilton Head business and want to
                  be in front of our readers, we&apos;d love to talk.
                </p>
              </div>
              <Link
                href="/sponsorships"
                className="group inline-flex items-center gap-2 self-start bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
              >
                Partner tiers &amp; pricing
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* ——— What the partner program is NOT ——— */}
        <section className="mt-24">
          <SectionHead
            number="№ 02"
            eyebrow="Our disclosure"
            plain="What our partner program"
            italic="is not."
          />
          <div className="mt-10 grid grid-cols-1 gap-8 border-y border-ocean-deep/15 py-10 md:grid-cols-3 md:gap-10 md:py-12">
            {[
              {
                title: 'Not paid rankings',
                body:
                  'Our tier lists (restaurants, stays, activities) stay entirely merit-based. Paying us does not move a business up our rankings, ever. We disclose sponsorships; we don\u2019t hide them.',
              },
              {
                title: 'Not kickbacks on your trip',
                body:
                  'Client fees go one way: from client to us. We don\u2019t take commissions from villa companies or restaurants that affect your rates. Partner fees are separate advertising spend, billed annually, shown publicly.',
              },
              {
                title: 'Not a blanket endorsement',
                body:
                  'Being in our partner program means we know the business, not that every product they offer is the right fit for every client. We still recommend selectively.',
              },
            ].map((item) => (
              <article key={item.title} className="flex flex-col gap-3">
                <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

// ———————————————————————————————————————————————————————————————————

function TierSection({
  label,
  subtitle,
  partners: list,
  featured = false,
  compact = false,
}: {
  label: string;
  subtitle: string;
  partners: Partner[];
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ocean-deep/15 pb-4">
        <div>
          <div className="eyebrow text-coral">{label}</div>
          <div className="display-italic mt-2 text-[18px] text-ink-soft md:text-[20px]">
            {subtitle}
          </div>
        </div>
        <span className="eyebrow text-ink-soft">
          {list.length} {list.length === 1 ? 'partner' : 'partners'}
        </span>
      </div>

      <div
        className={`mt-8 grid gap-8 ${
          featured
            ? 'grid-cols-1 md:grid-cols-2'
            : compact
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {list.map((p) => (
          <PartnerCard key={p.slug} partner={p} size={featured ? 'lg' : compact ? 'sm' : 'md'} />
        ))}
      </div>
    </section>
  );
}

function PartnerCard({
  partner,
  size,
}: {
  partner: Partner;
  size: 'sm' | 'md' | 'lg';
}) {
  const titleClass =
    size === 'lg'
      ? 'text-[28px] md:text-[34px]'
      : size === 'md'
        ? 'text-[22px] md:text-[24px]'
        : 'text-[16px] md:text-[18px]';

  return (
    <article
      className={`flex flex-col gap-4 ${
        size === 'lg' ? 'border-t border-ocean-deep/20 pt-8' : ''
      }`}
    >
      <div className="eyebrow-coral eyebrow">{partner.category}</div>
      <h3 className={`display leading-[1.12] text-ink ${titleClass}`}>
        {partner.name}
      </h3>
      <div className="eyebrow text-ink-soft">{partner.location}</div>
      {size !== 'sm' && (
        <p className="text-[14px] leading-[1.7] text-ink-soft">
          {partner.description}
        </p>
      )}
      {size === 'lg' && partner.quote && (
        <blockquote className="display-italic mt-2 border-l-2 border-coral pl-4 text-[16px] leading-[1.5] text-ink-soft md:text-[18px]">
          &ldquo;{partner.quote}&rdquo;
        </blockquote>
      )}
      <a
        href={partner.website}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="link-underline mt-2 inline-flex items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.22em] text-ocean"
      >
        Visit site ↗
      </a>
    </article>
  );
}
