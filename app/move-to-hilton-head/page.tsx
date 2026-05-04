import type { Metadata } from 'next';
import Link from 'next/link';
import LeadInquiryForm, { type LeadField } from '@/components/leads/LeadInquiryForm';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'Move to Hilton Head Island — local-vetted relocation help',
  description:
    'Thinking about moving to Hilton Head? Locals walking you through neighborhoods, schools, taxes, and the right realtor for your situation. Free initial call.',
  path: '/move-to-hilton-head',
  keywords: [
    'move to hilton head',
    'hilton head relocation',
    'living on hilton head island',
    'hilton head real estate',
    'best neighborhoods hilton head',
  ],
});

const NEIGHBORHOODS = [
  'Sea Pines',
  'Palmetto Dunes',
  'Hilton Head Plantation',
  'Long Cove',
  'Wexford',
  'Indigo Run',
  'Spanish Wells',
  'Bluffton',
  'Not sure yet',
] as const;

const TIMELINES = [
  'Within 6 months',
  '6–12 months',
  '12–24 months',
  'Just exploring',
] as const;

const BUDGETS = [
  'Under $750k',
  '$750k–$1.5M',
  '$1.5M–$3M',
  '$3M+',
  'Renting first',
] as const;

const INTENT = [
  'Primary residence',
  'Second / vacation home',
  'Retirement',
  'Investment property',
] as const;

const FIELDS: readonly LeadField[] = [
  { name: 'timeline', label: 'When are you looking to move?', kind: 'select', options: TIMELINES, required: true },
  { name: 'intent', label: 'Reason for the move', kind: 'select', options: INTENT },
  { name: 'budget', label: 'Budget band', kind: 'select', options: BUDGETS },
  { name: 'neighborhoods', label: 'Neighborhoods on your radar', kind: 'multi', options: NEIGHBORHOODS },
] as const;

export default function MoveToHiltonHeadPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Move to Hilton Head', path: '/move-to-hilton-head' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-coral">For prospective Hilton Head residents</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            Thinking about moving to Hilton Head?
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            We&rsquo;re locals, not realtors. We&rsquo;ll walk you through neighborhoods,
            schools, taxes, the airport situation, and what nobody tells you about
            living here year-round — then introduce you to the right agent for
            your specific situation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              h: 'Honest neighborhood read',
              b: 'Sea Pines vs. Hilton Head Plantation vs. Bluffton — they look similar online and live very differently. We’ll tell you which one fits.',
            },
            {
              h: 'The right agent intro',
              b: 'We work with one trusted Realtor who knows our standards. No bait-and-switch, no pressure. If they’re not the right fit we say so.',
            },
            {
              h: 'Year-round livability',
              b: 'Hurricane season, summer crowds, winter quiet, the things that don’t show up on a Zillow listing.',
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
            <p className="eyebrow mb-2 text-coral">Tell us about your move</p>
            <h2 className="display text-2xl font-medium text-ink md:text-3xl">
              Free initial call. No pressure.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              30 minutes on the phone with a local. We answer your questions, share
              what we know, and only introduce you to a Realtor if you want one.
            </p>
          </div>
          <LeadInquiryForm
            type="relocation"
            fields={FIELDS}
            ctaLabel="Request my call"
            successHeading="Got it. We'll be in touch."
            successBody="Expect a reply within one business day to schedule the call."
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-ink-soft/80">
          Just visiting?{' '}
          <Link href="/itinerary" className="underline hover:text-ink">
            Plan a trip first →
          </Link>{' '}
          · Already an owner?{' '}
          <Link href="/sell-or-rent-your-villa" className="underline hover:text-ink">
            Selling or renting →
          </Link>
        </p>
      </section>

      <section className="border-t border-rule-soft bg-sand-soft/40 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display mb-4 text-xl font-medium text-ink md:text-2xl">
            Prefer email?
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Write{' '}
            <a href={`mailto:${brand.contact.email}`} className="underline hover:text-ink">
              {brand.contact.email}
            </a>{' '}
            with one line about your timeline and we&rsquo;ll reply same business day.
          </p>
        </div>
      </section>
    </>
  );
}
