import type { Metadata } from 'next'
import Link from 'next/link'
import { generatePageMetadata } from '@/app/lib/metadata'
import { getBreadcrumbSchema, getFaqSchema } from '@/app/lib/metadata'
import BusinessInquiryForm from '@/components/local/BusinessInquiryForm'

export const metadata: Metadata = generatePageMetadata({
  title: 'Get Your Business Featured | Hilton Head Local Guide',
  description:
    "List your Hilton Head Island business in the Local Guide. Standard listings are free. Featured Partner placements offer premium placement and editorial profiles that travel researchers see first.",
  path: '/local/get-featured',
  keywords: [
    'hilton head business listing',
    'advertise hilton head island',
    'hilton head business directory listing',
    'feature hilton head business',
  ],
})

const faqs = [
  {
    question: 'Is a standard listing free?',
    answer: "Yes. Standard listings in the Hilton Head Local Guide are available at no cost to qualified local businesses. We review all submissions and add businesses that meet our editorial standards — genuine local presence, consistent reputation, and relevance to Hilton Head Island visitors.",
  },
  {
    question: 'What does a Featured Partner placement include?',
    answer: "Featured Partners receive: the top slot on their industry page (above all other listings), a larger editorial profile card with expanded review copy, a direct website link prominently displayed, inclusion in relevant blog posts and itinerary recommendations, and priority in our concierge referral flow when clients ask for recommendations.",
  },
  {
    question: 'How long does it take to get listed?',
    answer: "We review all inquiries within 1–2 business days and follow up by email. Standard listings are typically published within 1–2 weeks of approval. Featured Partner placements include a brief onboarding call to confirm details before going live.",
  },
  {
    question: 'Do you accept businesses outside Hilton Head Island?',
    answer: "We primarily focus on Hilton Head Island businesses. We also list select businesses in Bluffton, Daufuskie Island, and Savannah, GA that are directly relevant to Hilton Head visitors. If you're unsure whether your business qualifies, submit an inquiry and we'll let you know.",
  },
  {
    question: 'What types of businesses do you feature?',
    answer: "We cover eight industry categories: restaurants and dining, golf courses and clubs, water activities and tours, weddings and events, spas and wellness, vacation rental management companies, shopping and boutiques, and family and kids activities. If your business doesn't fit neatly into one of these, reach out anyway — we're expanding categories over time.",
  },
]

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Local Directory', path: '/local' },
  { name: 'Get Featured', path: '/local/get-featured' },
]

const tiers = [
  {
    name: 'Standard Listing',
    price: 'Free',
    icon: '📋',
    color: 'border-rule-soft bg-sand-soft',
    headerColor: 'bg-sand-deep',
    features: [
      'Editorial review card (2-3 sentences)',
      'Business name, address, phone, and website',
      'Category tags',
      'Listed in industry directory page',
      'Standard placement within category',
    ],
    note: 'Available to all qualified Hilton Head businesses',
    cta: 'Submit for free',
  },
  {
    name: 'Featured Partner',
    price: 'Paid',
    icon: '⭐',
    color: 'border-gold/50 bg-gradient-to-br from-gold/10 to-sand',
    headerColor: 'bg-gradient-to-r from-gold to-gold-deep',
    features: [
      'Everything in Standard, plus:',
      'Top-of-page Featured Partner placement',
      'Larger premium profile card with full review',
      'Highlighted editorial language ("What makes it stand out")',
      'Direct website link prominently displayed',
      'Included in relevant itinerary posts and planning guides',
      'Priority concierge referral for matching visitor requests',
    ],
    note: 'Pricing discussed on a brief intro call',
    cta: 'Inquire about partnership',
    featured: true,
  },
  {
    name: 'Exclusive / Sponsorship',
    price: 'Custom',
    icon: '💎',
    color: 'border-ocean/30 bg-ocean/5',
    headerColor: 'bg-ocean-deep',
    features: [
      'Everything in Featured Partner, plus:',
      'Exclusive positioning in category (no competing featured)',
      'Co-authored long-form editorial post',
      'Newsletter feature to Hilton Head subscriber list',
      'Social amplification on Hilton Ahead channels',
      'Custom arrangement — ask about your specific goals',
    ],
    note: 'For businesses seeking category ownership',
    cta: 'Start the conversation',
  },
]

export default function GetFeaturedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            getBreadcrumbSchema(breadcrumbs),
            getFaqSchema(faqs),
          ]),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,167,75,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-ocean-light">
              <li><Link href="/" className="hover:text-sand">Home</Link></li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li><Link href="/local" className="hover:text-sand">Local Directory</Link></li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li className="text-sand/70">Get Featured</li>
            </ol>
          </nav>
          <p className="eyebrow mb-3 text-coral">For Hilton Head businesses</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl">
            Get in front of{' '}
            <em className="italic text-gold">travelers who are ready to book</em>
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-ocean-light">
            Hilton Head visitors research before they arrive and spend above average for
            the destination. A listing on hiltonahead.com puts your business in front of
            that audience at the exact moment they&apos;re making decisions.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-rule-soft bg-sand-deep">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-rule-soft md:grid-cols-4">
          {[
            { stat: '30+', label: 'Pages of curated HHI content' },
            { stat: 'Local', label: 'Expert editorial — not scraped data' },
            { stat: 'SEO', label: 'Built for high-intent travel search' },
            { stat: 'Free', label: 'Standard listing at no cost' },
          ].map(({ stat, label }) => (
            <div key={stat} className="p-6 text-center">
              <p className="display mb-1 text-2xl font-medium text-coral">{stat}</p>
              <p className="text-xs text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 text-ocean">Listing options</p>
          <h2 className="display text-3xl font-medium text-ink">
            Choose your level
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative overflow-hidden rounded-3xl border-2 ${tier.color} ${tier.featured ? 'md:-mt-3 md:mb-3' : ''}`}
            >
              {tier.featured && (
                <div className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                  Most popular
                </div>
              )}
              <div className={`px-6 py-5 ${tier.headerColor}`}>
                <p className="mb-1 text-2xl">{tier.icon}</p>
                <h3 className={`font-display text-xl font-medium ${tier.featured ? 'text-ink' : 'text-ink'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm font-semibold ${tier.featured ? 'text-gold-deep' : 'text-ink-soft'}`}>
                  {tier.price}
                </p>
              </div>
              <div className="px-6 py-5">
                <ul className="mb-6 space-y-2.5">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="mt-0.5 shrink-0 text-ocean">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-5 text-xs italic text-ink-soft/70">{tier.note}</p>
                <a
                  href="#inquiry-form"
                  className={`block w-full rounded-full py-3 text-center text-xs font-bold uppercase tracking-widest shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    tier.featured
                      ? 'bg-ink text-sand hover:bg-ocean'
                      : 'bg-sand-deep text-ink hover:bg-ocean hover:text-sand'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof / trust */}
      <section className="border-y border-rule-soft bg-sand-deep px-5 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4 text-ocean">Why hiltonahead.com</p>
          <p className="text-lg leading-relaxed text-ink-soft">
            Hilton Ahead is a local travel consulting service built specifically for
            Hilton Head Island — not an aggregator, not a review platform. Every page
            is written by people who live on the island, and every business recommendation
            reflects genuine editorial judgment. That&apos;s why visitors trust what they
            read here.
          </p>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry-form" className="mx-auto max-w-2xl px-5 py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 text-coral">Take the first step</p>
          <h2 className="display text-3xl font-medium text-ink md:text-4xl">
            Submit your inquiry
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            We review every submission and follow up within 1–2 business days. No
            auto-enrollment, no spam — just a direct conversation about listing your
            business.
          </p>
        </div>
        <div className="rounded-3xl border border-rule-soft bg-sand-soft p-7 shadow-[0_4px_24px_var(--shadow-ink)] md:p-10">
          <BusinessInquiryForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-5 pb-16 md:pb-20">
        <h2 className="display mb-8 text-center text-2xl font-medium text-ink">
          Questions about listing
        </h2>
        <div className="space-y-px">
          {faqs.map(({ question, answer }, i) => (
            <details key={i} className="group border-b border-rule-soft py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                <span>{question}</span>
                <span className="mt-0.5 shrink-0 text-ocean transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
