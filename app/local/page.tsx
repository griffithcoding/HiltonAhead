import type { Metadata } from 'next'
import Link from 'next/link'
import { industries } from '@/data/localBusinesses'
import { generatePageMetadata } from '@/app/lib/metadata'
import { getBreadcrumbSchema, getFaqSchema } from '@/app/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Local Business Directory',
  description:
    "The curated guide to Hilton Head Island's top local businesses — restaurants, golf courses, spas, water activities, wedding vendors, and more. Expertly reviewed by locals.",
  path: '/local',
  keywords: [
    'hilton head local businesses',
    'hilton head island business directory',
    'best businesses hilton head',
    'hilton head guide local',
    'hilton head island directory',
  ],
})

const pageFaqs = [
  {
    question: 'How are businesses selected for the Hilton Head Local Guide?',
    answer: "We curate every listing editorially — no pay-to-play. We evaluate businesses based on local reputation, consistency, and visitor experience. Rankings stay merit-based regardless of any commercial relationship.",
  },
  {
    question: 'Can my business get listed in the Hilton Head Local Guide?',
    answer: "Yes. Standard listings are available at no cost — reach out via our contact page and we'll review your business. We aim to respond to qualified inquiries within 1–2 business days.",
  },
  {
    question: 'How current is the business information?',
    answer: "We review listings periodically and flag information that needs verification. Specific details like hours and phone numbers may change — always confirm directly with the business before visiting. If you notice outdated info, contact us and we'll update it promptly.",
  },
]

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Local Business Directory', path: '/local' },
]

const industryColors: Record<string, string> = {
  restaurants: 'from-coral/20 to-coral/5',
  golf: 'from-palm/20 to-palm/5',
  'water-activities': 'from-ocean/20 to-ocean/5',
  weddings: 'from-gold/20 to-gold/5',
  'spas-wellness': 'from-palm-light/20 to-palm-light/5',
  'vacation-rentals': 'from-sand-deep to-sand',
  shopping: 'from-coral/10 to-gold/5',
  'family-activities': 'from-ocean-light/20 to-gold/5',
}

export default function LocalDirectoryPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            getBreadcrumbSchema(breadcrumbs),
            getFaqSchema(pageFaqs),
          ]),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ocean-deep to-ocean px-5 py-20 text-center md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,122,92,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,167,75,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow mb-4 text-coral">Hilton Head Island</p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            The Local Business{' '}
            <em className="italic text-gold">Directory</em>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-ocean-light">
            Expertly curated by locals who live and work on Hilton Head Island.
            The restaurants, golf courses, spas, and activity operators worth
            your time — and none that aren&apos;t.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/local/restaurants"
              className="rounded-full bg-coral px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-sand shadow-lg transition-all hover:-translate-y-0.5 hover:bg-coral-deep hover:shadow-xl"
            >
              Browse restaurants
            </Link>
            <Link
              href="/local/get-featured"
              className="rounded-full border border-ocean-light/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-ocean-light transition-all hover:border-ocean-light/60 hover:text-sand"
            >
              ⭐ Feature your business
            </Link>
          </div>
        </div>
      </section>

      {/* Industry grid */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 text-ocean">Eight categories</p>
          <h2 className="display text-3xl font-medium text-ink md:text-4xl">
            Browse by industry
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => {
            const gradient = industryColors[industry.slug] || 'from-sand-deep to-sand'
            return (
              <Link
                key={industry.slug}
                href={`/local/${industry.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-rule-soft bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:border-ocean/30 hover:shadow-[0_8px_28px_var(--shadow-ink)]"
                style={{ background: undefined }}
              >
                <div className={`flex flex-1 flex-col bg-gradient-to-br p-6 ${gradient}`}>
                  <div className="mb-3 text-3xl">{industry.icon}</div>
                  <h3 className="mb-1 font-display text-lg font-medium leading-snug text-ink group-hover:text-ocean">
                    {industry.name}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-ink-soft">
                    {industry.tagline}
                  </p>
                  <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-ocean">
                    <span>Browse listings</span>
                    <svg
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Value prop for businesses */}
      <section className="border-y border-rule-soft bg-sand-deep py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow mb-3 text-coral">For local businesses</p>
              <h2 className="display mb-4 text-3xl font-medium text-ink md:text-4xl">
                Get in front of{' '}
                <em className="italic text-ocean">serious travelers</em>
              </h2>
              <p className="mb-6 leading-relaxed text-ink-soft">
                Hilton Head visitors are high-intent planners — they research before they
                arrive and book before they leave the house. A listing on hiltonahead.com
                puts your business in front of the right audience at the right moment.
              </p>
              <Link
                href="/local/get-featured"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-widest text-sand shadow-md transition-all hover:bg-ocean hover:shadow-lg"
              >
                ⭐ See listing options
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '30+', label: 'Pages of curated Hilton Head content' },
                { stat: 'Local', label: 'Expert-written editorial — not aggregated reviews' },
                { stat: 'SEO', label: 'Optimized for high-intent travel search queries' },
                { stat: 'Free', label: 'Standard listings at no cost to qualified businesses' },
              ].map(({ stat, label }) => (
                <div
                  key={stat}
                  className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-center"
                >
                  <p className="display mb-1 text-2xl font-medium text-coral">{stat}</p>
                  <p className="text-xs leading-snug text-ink-soft">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-5 py-16 md:py-20">
        <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
          About this directory
        </h2>
        <div className="space-y-px">
          {pageFaqs.map(({ question, answer }, i) => (
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
