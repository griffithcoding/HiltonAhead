import type { Metadata } from 'next';
import Link from 'next/link';
import LeadInquiryForm, { type LeadField } from '@/components/leads/LeadInquiryForm';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'Sell or Rent Your Hilton Head Villa — local-vetted property management & resale help',
  description:
    'Hilton Head villa owner thinking about selling or renting? We connect you with the right property manager or listing agent for your situation. No spam, no pressure.',
  path: '/sell-or-rent-your-villa',
  keywords: [
    'sell hilton head villa',
    'rent hilton head villa',
    'hilton head property management',
    'hilton head vacation rental management',
    'hilton head listing agent',
  ],
});

const PROPERTY_TYPES = [
  'Oceanfront villa',
  'Resort condo',
  'Single-family home',
  'Bluffton property',
  'Other',
] as const;

const NEIGHBORHOODS = [
  'Sea Pines',
  'Palmetto Dunes',
  'Forest Beach',
  'Hilton Head Plantation',
  'Shipyard',
  'Indigo Run',
  'Bluffton',
  'Other',
] as const;

const CURRENT_USE = [
  'Self-managed STR',
  'Professionally managed STR',
  'Long-term rental',
  'Personal use only',
  'Sitting empty',
] as const;

const INTENT = [
  'Sell — best price',
  'Sell — fast / off-market OK',
  'Rent — find a manager',
  'Rent — switch managers',
  'Just exploring options',
] as const;

const FIELDS: readonly LeadField[] = [
  { name: 'intent', label: 'What are you considering?', kind: 'select', options: INTENT, required: true },
  { name: 'property_type', label: 'Property type', kind: 'select', options: PROPERTY_TYPES },
  { name: 'neighborhood', label: 'Neighborhood', kind: 'select', options: NEIGHBORHOODS },
  { name: 'current_use', label: 'How is it used today?', kind: 'select', options: CURRENT_USE },
] as const;

export default function SellOrRentYourVillaPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Sell or Rent Your Villa', path: '/sell-or-rent-your-villa' },
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
          <p className="eyebrow mb-3 text-coral">For Hilton Head villa owners</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            Selling or renting your villa? Talk to a local first.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            We&rsquo;re not a brokerage and we&rsquo;re not a property manager — we&rsquo;re
            the locals who know which ones are worth your time and which ones
            burn owners. One short conversation, one curated intro, and that&rsquo;s
            it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              h: 'Vetted referrals only',
              b: 'We hand-pick the property managers and listing agents we recommend. They know we send owners who pay attention; they treat them accordingly.',
            },
            {
              h: 'No commission to us from you',
              b: 'You don’t pay us. Our partners pay a referral fee on closed business. You get a better intro than a cold call would ever produce.',
            },
            {
              h: 'Honest read on the market',
              b: 'Off-season pricing realities, the STR ordinance changes, what nightly rates actually look like in your neighborhood right now.',
            },
          ].map(({ h, b }) => (
            <div key={h} className="rounded-2xl border border-rule-soft bg-sand-soft p-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-coral">{h}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{b}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-rule-soft bg-sand p-6 shadow-sm md:p-10">
          <div className="mb-6">
            <p className="eyebrow mb-2 text-coral">Tell us about the property</p>
            <h2 className="display text-2xl font-medium text-ink md:text-3xl">
              We&rsquo;ll route you to the right partner.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              30-minute call, then a single curated intro. No mailing list, no
              follow-up barrage, no cold-calling agents pestering you afterward.
            </p>
          </div>
          <LeadInquiryForm
            type="owner"
            fields={FIELDS}
            ctaLabel="Send my inquiry"
            successHeading="Got it. We'll review."
            successBody="Expect a reply within one business day with a recommended next step."
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-ink-soft/80">
          Looking to <em>buy</em> a villa instead?{' '}
          <Link href="/move-to-hilton-head" className="underline hover:text-ink">
            Move to Hilton Head →
          </Link>
        </p>
      </section>

      <section className="border-t border-rule-soft bg-sand-soft/40 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display mb-4 text-xl font-medium text-ink md:text-2xl">
            Want to advertise your villa to traveler traffic?
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Self-managed villas can run a {' '}
            <Link href="/advertise" className="underline hover:text-ink">
              Featured Villa promo
            </Link>{' '}
            on neighborhood pages from $149/mo. Or write{' '}
            <a href={`mailto:${brand.contact.email}`} className="underline hover:text-ink">
              {brand.contact.email}
            </a>{' '}
            for a custom plan.
          </p>
        </div>
      </section>
    </>
  );
}
