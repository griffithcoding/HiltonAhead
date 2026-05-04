import type { Metadata } from 'next';
import Link from 'next/link';
import LeadInquiryForm, { type LeadField } from '@/components/leads/LeadInquiryForm';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: 'Plan a Hilton Head Wedding — local-vetted venue + vendor matchmaking',
  description:
    'Planning a Hilton Head Island wedding? One inquiry, three curated venue + vendor introductions. We know who delivers and who doesn’t. No spam.',
  path: '/hilton-head-wedding-inquiry',
  keywords: [
    'hilton head wedding',
    'hilton head wedding venues',
    'hilton head wedding planner',
    'sea pines weddings',
    'palmetto bluff weddings',
    'hilton head wedding photographer',
  ],
});

const SEASONS = [
  'Spring 2026',
  'Summer 2026',
  'Fall 2026',
  'Spring 2027',
  'Summer 2027',
  'Fall 2027',
  '2028 or later',
  'Flexible',
] as const;

const GUEST_COUNT = [
  'Under 30 (intimate)',
  '30–75',
  '75–150',
  '150–250',
  '250+',
] as const;

const BUDGETS = [
  'Under $40k',
  '$40k–$75k',
  '$75k–$150k',
  '$150k+',
  'Not sure yet',
] as const;

const VENUE_TYPES = [
  'Beachfront',
  'Resort',
  'Plantation / estate',
  'Restaurant / private dining',
  'Yacht / waterfront',
  'Backyard / private home',
  'Open to suggestions',
] as const;

const VENDOR_NEEDS = [
  'Venue',
  'Photographer',
  'Florist',
  'Caterer',
  'Officiant',
  'Hair & makeup',
  'Music / DJ',
  'Planner / coordinator',
] as const;

const FIELDS: readonly LeadField[] = [
  { name: 'wedding_season', label: 'When are you targeting?', kind: 'select', options: SEASONS, required: true },
  { name: 'guest_count', label: 'Approximate guest count', kind: 'select', options: GUEST_COUNT },
  { name: 'budget', label: 'Total budget band', kind: 'select', options: BUDGETS },
  { name: 'venue_type', label: 'Venue type', kind: 'select', options: VENUE_TYPES },
  { name: 'vendor_needs', label: 'What do you need help with?', kind: 'multi', options: VENDOR_NEEDS },
] as const;

export default function HiltonHeadWeddingInquiryPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Wedding Inquiry', path: '/hilton-head-wedding-inquiry' },
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
          <p className="eyebrow mb-3 text-coral">For Hilton Head couples</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            Plan a Hilton Head wedding without ten cold-call sales pitches.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            One short inquiry, then we curate three to five introductions —
            venues, photographers, florists, planners — that actually fit your
            date, guest count, and budget. Locals only, vetted relationships.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              h: 'Curated, not crowdsourced',
              b: 'You won’t get blasted by twelve venues. We send three to five matches who can actually do your date and your scope.',
            },
            {
              h: 'No fee from you',
              b: 'Vendors pay us a referral fee on closed business. You get a warm intro to the right people, free.',
            },
            {
              h: 'We’ve worked with all of them',
              b: 'The photographers know our concierge clients. The venues take our calls. The planners answer the same day.',
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
            <p className="eyebrow mb-2 text-coral">Tell us about the wedding</p>
            <h2 className="display text-2xl font-medium text-ink md:text-3xl">
              Three to five intros, inside one week.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              We&rsquo;ll review and reply within one business day. No mass-blast,
              no recurring marketing emails, no resold lead going to twenty
              vendors.
            </p>
          </div>
          <LeadInquiryForm
            type="wedding"
            fields={FIELDS}
            ctaLabel="Request introductions"
            successHeading="Received. We're on it."
            successBody="We'll review and reply within one business day with three to five curated introductions."
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-ink-soft/80">
          Looking for the full island wedding planning brief?{' '}
          <Link href="/hilton-head-weddings" className="underline hover:text-ink">
            Read the wedding guide →
          </Link>
        </p>
      </section>

      <section className="border-t border-rule-soft bg-sand-soft/40 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display mb-4 text-xl font-medium text-ink md:text-2xl">
            Wedding venue or vendor reading this?
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Hilton Ahead routes qualified couples to a small group of vetted partners.
            Email{' '}
            <a href={`mailto:${brand.contact.email}`} className="underline hover:text-ink">
              {brand.contact.email}
            </a>{' '}
            to discuss being on that list. We work on per-lead or monthly retainer.
          </p>
        </div>
      </section>
    </>
  );
}
