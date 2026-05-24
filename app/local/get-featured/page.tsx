import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import PricingTiers from '@/components/pricing/PricingTiers';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { B2B_TIERS } from '@/data/pricing';
import { brand } from '@/data/brand';

export const metadata: Metadata = generatePageMetadata({
  title: `List Your Hilton Head Business on ${brand.name}`,
  description:
    'Get your restaurant, villa company, charter, or local service in front of active Hilton Head trip planners. Three tiers — from a verified listing to full editorial placement. 14-day free trial on self-serve plans.',
  path: '/local/get-featured',
  keywords: [
    'advertise hilton head business',
    'hilton head business listing',
    'hilton head local directory',
    'get featured hilton head',
    'hilton head travel directory',
  ],
});

const WHY_POINTS = [
  {
    eyebrow: 'High-intent traffic',
    body: 'Every visitor is actively planning a Hilton Head trip — not browsing a generic search page.',
  },
  {
    eyebrow: 'Attribution you can see',
    body: 'Monthly report shows exactly how many phone clicks, website visits, and inquiries your listing generated.',
  },
  {
    eyebrow: 'Earn editorial trust',
    body: 'We only feature businesses we\'d recommend to our own clients. That credibility transfers to your listing.',
  },
  {
    eyebrow: '14-day free trial',
    body: 'Listed and Featured tiers start with a 14-day trial — no charge until you\'ve seen real results.',
  },
];

export default function GetFeaturedPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local Directory', path: '/local' },
    { name: 'List Your Business', path: '/local/get-featured' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Local Directory"
            plain="Put your business in front of"
            italic="travelers already planning a trip."
          />
          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
            {brand.name} is where Hilton Head trip planners go to find the best
            restaurants, villa companies, charters, and local services. A
            listing here means your name is in the room when the decisions
            happen — with real attribution data to prove it.
          </p>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft">
            Listed and Featured tiers include a{' '}
            <strong className="text-ink">14-day free trial</strong>. See the
            results before you're charged.
          </p>
        </section>

        <Divider ornament="compass" className="my-16" />

        {/* Why */}
        <section>
          <h2 className="eyebrow text-coral">Why it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_POINTS.map((pt) => (
              <div key={pt.eyebrow} className="border-t border-ocean-deep/15 pt-6">
                <div className="eyebrow text-ocean">{pt.eyebrow}</div>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
                  {pt.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider ornament="sailboat" className="my-16" />

        {/* Pricing */}
        <section>
          <SectionHead
            number="№ 02"
            eyebrow="Choose a tier"
            plain="Three ways to reach"
            italic="Hilton Head travelers."
          />
          <p className="mt-4 mb-12 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft">
            All tiers include attribution tracking. Listed and Featured are
            self-serve with a 14-day free trial. Signature is application-only —
            capped at 8 partners per year.
          </p>

          <PricingTiers tiers={B2B_TIERS} applyHref="/business/apply" />
        </section>

        <Divider ornament="compass" className="my-16" />

        {/* FAQ strip */}
        <section className="mx-auto max-w-[720px]">
          <h2 className="eyebrow text-coral">Common questions</h2>
          <dl className="mt-8 divide-y divide-ocean-deep/10">
            {[
              {
                q: 'How does the 14-day trial work?',
                a: 'You\'ll enter your payment details at checkout, but you won\'t be charged until the trial ends. Cancel any time before day 14 and you owe nothing.',
              },
              {
                q: 'What\'s the difference between Listed and Featured?',
                a: 'Listed gives you a verified directory card with contact details and basic analytics. Featured adds top-of-page placement, two newsletter mentions per year, one editorial blog inclusion, and rotation on the /local hub homepage.',
              },
              {
                q: 'How do I know the listing is driving results?',
                a: 'Every subscriber gets a monthly attribution report showing phone clicks, website clicks, and inquiry submissions generated by their listing. That\'s the data we use to tell the upsell story — and the data you use to justify the renewal.',
              },
              {
                q: 'What is Signature and how do I apply?',
                a: 'Signature is our highest-visibility tier — capped at 8 partners per year. It includes a dedicated blog post, six newsletter mentions, neighborhood-page cross-links, and a quarterly performance review. Click "Apply for Signature" to start the conversation.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="text-[15px] font-medium text-ink">{q}</dt>
                <dd className="mt-2 text-[14px] leading-[1.7] text-ink-soft">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Divider ornament="sailboat" className="my-16" />

        {/* Footer links */}
        <section className="flex flex-wrap items-center justify-between gap-4 pb-20 text-[13px] text-ink-soft">
          <p>
            Already a subscriber?{' '}
            <Link href="/business/login" className="link-underline text-ink">
              Sign in to your portal →
            </Link>
          </p>
          <p>
            Questions?{' '}
            <a
              href={`mailto:${brand.contact.email}`}
              className="link-underline text-ink"
            >
              {brand.contact.email}
            </a>
          </p>
        </section>

        <Footer />
      </div>
    </>
  );
}
