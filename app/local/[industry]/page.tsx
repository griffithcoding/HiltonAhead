import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  industries,
  getIndustryBySlug,
  getFeaturedBusiness,
  getRegularBusinesses,
  type IndustrySlug,
} from '@/data/localBusinesses'
import { generatePageMetadata } from '@/app/lib/metadata'
import { getBreadcrumbSchema, getFaqSchema } from '@/app/lib/metadata'
import { brand } from '@/data/brand'
import BusinessCard from '@/components/local/BusinessCard'
import IndustryNav from '@/components/local/IndustryNav'
import SponsorSlot from '@/components/sponsorship/SponsorSlot'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url

export const revalidate = 3600

// ---------------------------------------------------------------------------
// Static params — pre-render all 8 industry pages
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }))
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry } = await params
  const ind = getIndustryBySlug(industry)
  if (!ind) return {}
  return generatePageMetadata({
    title: ind.seoTitle,
    description: ind.metaDescription,
    path: `/local/${ind.slug}`,
    keywords: ind.keywords,
  })
}

// ---------------------------------------------------------------------------
// Schema helpers for individual business cards
// ---------------------------------------------------------------------------
function buildLocalBusinessSchema(
  b: ReturnType<typeof getFeaturedBusiness>,
  industrySlug: string
) {
  if (!b) return null
  return {
    '@context': 'https://schema.org',
    '@type': b.schemaType,
    name: b.name,
    description: b.review,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address,
      addressLocality: 'Hilton Head Island',
      addressRegion: 'SC',
      addressCountry: 'US',
    },
    telephone: b.phone || undefined,
    url: b.website || undefined,
    ...(b.lat && b.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng } }
      : {}),
    priceRange: b.priceRange || undefined,
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry: slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  // Featured Partner program is retired on the front end — surface every
  // business as a regular listing so nothing disappears from the directory.
  const featured = getFeaturedBusiness(slug)
  const regulars = [
    ...(featured ? [featured] : []),
    ...getRegularBusinesses(slug),
  ]
  const hasBusinesses = regulars.length > 0

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Local Directory', path: '/local' },
    { name: industry.name, path: `/local/${slug}` },
  ]

  // ItemList schema for the business listings
  const itemListSchema = hasBusinesses
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: industry.h1,
        numberOfItems: regulars.length,
        itemListElement: regulars.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          url: `${siteUrl}/local/${slug}#${b.id}`,
        })),
      }
    : null

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [
              getBreadcrumbSchema(breadcrumbs),
              getFaqSchema(industry.faqs),
              itemListSchema,
            ].filter(Boolean)
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
        {industry.heroImage.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={industry.heroImage.src}
            alt={industry.heroImage.alt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

        <div className="relative mx-auto max-w-3xl text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-ocean-light">
              <li>
                <Link href="/" className="hover:text-sand">Home</Link>
              </li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li>
                <Link href="/local" className="hover:text-sand">Local Directory</Link>
              </li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li className="text-sand/70">{industry.name}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-3 text-coral">
            {industry.icon} Hilton Head Island
          </p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            {industry.h1}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            {industry.description}
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        {/* Direct sponsor slot — renders the active sponsor or a "your business
            here" house ad. Returns null if no slot is registered for this
            industry in data/sponsorships.ts. */}
        <div className="mb-10">
          <SponsorSlot id={`local-${slug}-pin`} />
        </div>

        {hasBusinesses ? (
          <>
            {/* Scroll nav */}
            <div className="mb-10">
              <IndustryNav businesses={regulars} />
            </div>

            {/* Grid of listings */}
            <div className="mb-16">
              <h2 className="display mb-6 text-2xl font-medium text-ink md:text-3xl">
                Top {industry.name.toLowerCase()} on Hilton Head Island
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {regulars.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Coming soon state for industries without listings yet */
          <div className="mb-16 rounded-3xl border border-rule-soft bg-sand-soft px-8 py-16 text-center">
            <div className="mb-4 text-4xl">{industry.icon}</div>
            <h2 className="display mb-3 text-2xl font-medium text-ink">
              {industry.name} directory coming soon
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-ink-soft">
              We&apos;re building out this section now. If your business belongs here,
              reach out and we&apos;ll add your listing to the first published batch.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-widest text-sand shadow-md transition-all hover:bg-ocean"
            >
              Submit your listing
            </Link>
          </div>
        )}

        {/* FAQ */}
        <section className="mx-auto max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="space-y-px">
            {industry.faqs.map(({ question, answer }, i) => (
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

        {/* Browse other industries */}
        <section className="mt-16 border-t border-rule-soft pt-12">
          <h2 className="display mb-6 text-center text-xl font-medium text-ink">
            Explore other categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industries
              .filter((i) => i.slug !== slug)
              .map((i) => (
                <Link
                  key={i.slug}
                  href={`/local/${i.slug}`}
                  className="flex items-center gap-2 rounded-full border border-rule-soft bg-sand-soft px-4 py-2 text-sm font-medium text-ink transition-all hover:border-ocean/40 hover:text-ocean"
                >
                  <span>{i.icon}</span>
                  <span>{i.name}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  )
}
