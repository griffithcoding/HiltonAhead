import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import FinalCta from '@/components/sections/FinalCta'
import { SectionHead, Divider } from '@/components/ui/Ornament'
import AffiliateCard from '@/components/affiliate/AffiliateCard'
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure'
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/app/lib/metadata'
import {
  MARRIOTT_PROPERTIES,
  type MarriottProperty,
} from '@/data/marriottProperties'

export const metadata: Metadata = generatePageMetadata({
  title: 'Top Marriott Stays on Hilton Head Island (2026 Insider Picks)',
  description:
    "Every Marriott Bonvoy property on Hilton Head Island — ranked by an insider. Marriott Vacation Club villas, the Westin resort, points-vs-cash math, and when Marriott isn't the right move.",
  path: '/top-marriott-stays-hilton-head',
  keywords: [
    'marriott hilton head',
    'hilton head marriott',
    'marriott vacation club hilton head',
    'westin hilton head',
    'marriott bonvoy hilton head island',
    "marriott's grande ocean",
    "marriott's surfwatch",
    'best marriott resort hilton head',
  ],
})

const FAQS = [
  {
    question: 'Which Marriott property on Hilton Head is best for families?',
    answer:
      "For families with kids 6–15, Marriott's SurfWatch wins — the lazy river and multi-pool complex is the best on-property pool setup on the island, and the newer construction (late 2000s) means better unit layouts than the older properties. For multi-generational families that want maximum amenities and a known-quantity experience, Marriott's Grande Ocean. For families with kids under 6 who can't handle ocean surf, Marriott's Sunset Pointe at Shelter Cove — marina-side calm water and the lowest cash rates of the HHI MVC properties.",
  },
  {
    question: 'Can I book Marriott Vacation Club properties without being a member?',
    answer:
      "Yes. Non-member rentals are available through Marriott.com directly, plus a few authorized rental channels. The unit inventory available to non-members is smaller than what owners can access, and peak weeks (Easter, July 4, Thanksgiving) sell out 6–9 months in advance. Bonvoy points redemption also works for non-members — sometimes at better value than cash during shoulder season.",
  },
  {
    question: 'Is the timeshare presentation pressure real?',
    answer:
      "Yes — if you stay at a Marriott Vacation Club property you'll be offered a discounted gift (resort credit, gift card) in exchange for sitting through a 90-minute sales presentation. You can decline at check-in and they'll move on. If you accept, the presentation is what it advertises — a sales pitch — but the discount or credit is real. Your call. The Westin Hilton Head doesn't pitch timeshares because it's a hotel, not an MVC property.",
  },
  {
    question: 'Should I use Bonvoy points or pay cash on Hilton Head?',
    answer:
      'Points value math: in peak weeks (June–August, RBC Heritage week), point redemptions on HHI MVC villas typically run 0.7–1.0 cent per point — strong value. In shoulder season (April–May, September–October), points value drops to 0.5–0.7 cents per point because cash rates are lower. The rule of thumb: use points when cash rates spike, pay cash when they soften.',
  },
  {
    question: 'Does Sea Pines or Palmetto Dunes charge an extra fee for Marriott guests?',
    answer:
      "Sea Pines charges a gate pass / amenity fee for non-resident guests of properties inside the plantation (~$25–$50 per car, per week). That applies to Marriott's Monarch at Sea Pines and Heritage Club at Harbour Town. Grande Ocean is in South Forest Beach (Sea Pines side but not inside the plantation gate), and SurfWatch/Barony are in different communities — no Sea Pines fee. Palmetto Dunes has no Marriott property inside its gates.",
  },
  {
    question: "When Marriott isn't the right move on Hilton Head, what is?",
    answer:
      "Three scenarios: (1) you want a specific villa floor plan or beachfront block — direct rental via Vrbo on a privately-owned villa often beats MVC availability and price; (2) you want a full-service luxury resort experience — the Sonesta and the Inn at Harbour Town (not Marriott Bonvoy) are stronger; (3) you're booking a week longer than 7 nights — Sea Pines Resort rentals or private villa direct typically beat MVC's standard week pricing.",
  },
]

export default function TopMarriottStaysPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Where to stay', path: '/hilton-head' },
    { name: 'Marriott on Hilton Head', path: '/top-marriott-stays-hilton-head' },
  ])
  const faqSchema = getFaqSchema(FAQS)
  const itemList = getMarriottItemListSchema()

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="mx-auto max-w-[1080px] px-5">
        <Header />

        {/* Hero */}
        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Where to stay"
            plain="Top Marriott stays on"
            italic="Hilton Head Island"
          />
        </section>

        <div className="mt-12 max-w-[760px]">
          <AffiliateDisclosure className="mb-6" />

          {/* TL;DR — citable factoid block for LLM SEO */}
          <aside
            role="note"
            aria-label="Quick summary"
            className="tldr-block my-2 border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
          >
            <p className="eyebrow mb-2 text-sunset">TL;DR</p>
            <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
              <strong>Seven Marriott Bonvoy properties</strong> are on Hilton
              Head: six Marriott Vacation Club villa resorts and one
              full-service Westin hotel. For families:{' '}
              <strong>SurfWatch</strong> (pools) or{' '}
              <strong>Grande Ocean</strong> (amenities). For golfers:{' '}
              <strong>Heritage Club at Harbour Town</strong>. For couples
              wanting a hotel: <strong>The Westin</strong>. For sunset
              views on calm water: <strong>Sunset Pointe at Shelter Cove</strong>.
            </p>
          </aside>

          <p className="mt-8 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Marriott has the deepest footprint of any hotel brand on Hilton
            Head — and that&rsquo;s mostly Marriott Vacation Club villas,
            not standard hotels. If you have Bonvoy points or a strong
            preference for known-quantity hospitality, knowing which of the
            seven properties fits your trip matters more than the brand
            choice itself. Below is the insider read on each, in honest
            order of which we&rsquo;d book first for which traveler.
          </p>
        </div>

        {/* The properties */}
        <section className="mt-20 space-y-14">
          {MARRIOTT_PROPERTIES.map((p, i) => (
            <PropertyCard key={p.slug} property={p} index={i} />
          ))}
        </section>

        {/* Points or cash? */}
        <section className="mt-24">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Bonvoy{' '}
            <span className="display-italic">points or cash?</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            The real math on Hilton Head, by season.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <div className="rounded-2xl border border-rule-soft bg-sand-soft/40 p-5">
              <h3 className="display text-[20px] leading-tight text-ink">
                Peak weeks
              </h3>
              <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-coral">
                Use points
              </p>
              <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">
                Easter, RBC Heritage week, first three weeks of July, Christmas
                week. Cash rates spike 30–50% but point redemptions don&rsquo;t
                move the same way. Point value: 0.7–1.0¢ per point — strong.
              </p>
            </div>
            <div className="rounded-2xl border border-rule-soft bg-sand-soft/40 p-5">
              <h3 className="display text-[20px] leading-tight text-ink">
                Shoulder season
              </h3>
              <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-coral">
                Pay cash
              </p>
              <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">
                April–May and September–October. Cash rates drop 25–35%. Point
                value falls to 0.5–0.7¢ per point. Save the points for a peak
                week or a different trip — pay cash here.
              </p>
            </div>
            <div className="rounded-2xl border border-rule-soft bg-sand-soft/40 p-5">
              <h3 className="display text-[20px] leading-tight text-ink">
                Off-season
              </h3>
              <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-coral">
                Pay cash, then upgrade
              </p>
              <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">
                December–February (excluding Christmas). Pay cash because rates
                are the lowest of the year, but use Bonvoy elite status (Gold+)
                for unit upgrades — easier to come by when occupancy is light.
              </p>
            </div>
          </div>
        </section>

        {/* When NOT to book Marriott */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            When Marriott{' '}
            <span className="display-italic">isn&rsquo;t the right move</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            Marriott is our default recommendation for Bonvoy-loyal travelers
            and points-collectors. It is not always the best fit. Three
            scenarios where we steer clients elsewhere:
          </p>

          <ol className="mt-10 space-y-7">
            <NotForCase
              n={1}
              title="You want a specific villa, not a property"
              body="MVC inventory is what it is — you book a unit type, not a specific oceanfront row. If you want a particular Sea Pines villa with a private pool, or a Forest Beach unit on a specific block, a direct Vrbo rental on a privately-owned villa beats MVC availability and often the price."
              alt="Try Vrbo or a Sea Pines Resort direct rental instead."
            />
            <NotForCase
              n={2}
              title="You want a full-service luxury resort"
              body="The MVC villas are not luxury hotels — they're well-appointed timeshare units. If you want concierge, daily housekeeping, and resort-tier dining at every meal, only the Westin Hilton Head delivers that within Bonvoy. Outside the brand, the Sonesta Resort and the Inn at Harbour Town are stronger luxury picks."
              alt="Book the Westin (in Bonvoy) or Sonesta / Inn at Harbour Town (out of brand)."
            />
            <NotForCase
              n={3}
              title="You&rsquo;re staying longer than 7 nights"
              body="MVC properties price in standard weekly rentals. If you&rsquo;re staying 10, 14, or more nights, private villa direct rentals or Sea Pines Resort multi-week pricing typically beat Marriott&rsquo;s nightly rate at any tier."
              alt="Book a private villa direct or via Sea Pines Resort for stays over a week."
            />
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-24 border-t border-ink/15 pt-16">
          <h2 className="display text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Frequently asked{' '}
            <span className="display-italic">Marriott questions</span>
          </h2>

          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {FAQS.map((f, i) => (
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
              { href: '/hilton-head/sea-pines', label: 'Sea Pines neighborhood' },
              { href: '/hilton-head-oceanfront-villas', label: 'Oceanfront villa picks' },
              { href: '/hilton-head-golf-packages', label: 'Golf trip packages' },
              { href: '/cost-of-hilton-head-trip', label: 'Cost of a HHI trip' },
              { href: '/hilton-head/port-royal', label: 'Port Royal neighborhood' },
              { href: '/hilton-head-honeymoon', label: 'Honeymoon planning' },
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
  )
}

function PropertyCard({
  property,
  index,
}: {
  property: MarriottProperty
  index: number
}) {
  return (
    <article
      id={property.slug}
      className="border-t border-rule-soft pt-10"
    >
      <header className="grid grid-cols-[auto_1fr] gap-5">
        <span className="section-number text-[28px] text-gold">
          {`0${index + 1}`}
        </span>
        <div>
          <p className="eyebrow mb-2 text-ink-soft">
            {property.brand} · {property.neighborhood}
            {property.oceanfront ? ' · Oceanfront' : ''}
          </p>
          <h2 className="display text-[24px] leading-[1.15] text-ink md:text-[30px]">
            {property.name}
          </h2>
          <p className="mt-2 max-w-[640px] text-[15px] italic leading-snug text-ink-soft md:text-[16px]">
            {property.positioning}
          </p>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            {property.insiderTake}
          </p>
          <p className="mt-4 text-[13px] uppercase tracking-[0.12em] text-coral">
            Best for
          </p>
          <p className="mt-1 text-[15px] leading-snug text-ink">
            {property.bestFor}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                Pros
              </p>
              <ul className="mt-2 space-y-1.5 text-[14px] leading-snug text-ink">
                {property.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-gold" aria-hidden="true">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                Watch-outs
              </p>
              <ul className="mt-2 space-y-1.5 text-[14px] leading-snug text-ink">
                {property.cons.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-coral" aria-hidden="true">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-soft">
            <span>
              <span className="font-semibold text-ink">
                ${property.cashRangeUsd.min}–${property.cashRangeUsd.max}
              </span>
              /night (cash, peak)
            </span>
            <span>
              <span className="font-semibold text-ink">
                {(property.pointsRange.min / 1000).toFixed(0)}k–
                {(property.pointsRange.max / 1000).toFixed(0)}k
              </span>{' '}
              Bonvoy points/night
            </span>
          </div>
        </div>

        <AffiliateCard
          programId="marriott"
          deeplink={property.bookingUrl}
          placement={`marriott-listing/${property.slug}`}
          headline={`Check ${property.name}`}
          description="Live rates, availability, and Bonvoy points pricing on Marriott.com."
          cta="View on Marriott.com →"
        />
      </div>
    </article>
  )
}

function NotForCase({
  n,
  title,
  body,
  alt,
}: {
  n: number
  title: string
  body: string
  alt: string
}) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule-soft pt-6">
      <span className="section-number text-[28px] text-gold">{`0${n}`}</span>
      <div>
        <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
          {title}
        </h3>
        <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
          {body}
        </p>
        <p className="mt-3 text-[13px] uppercase tracking-[0.12em] text-coral">
          {alt}
        </p>
      </div>
    </li>
  )
}

function getMarriottItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Marriott Stays on Hilton Head Island',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: MARRIOTT_PROPERTIES.length,
    itemListElement: MARRIOTT_PROPERTIES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': p.brand === 'Westin Resort' ? 'Hotel' : 'LodgingBusiness',
        name: p.name,
        url: `https://hiltonahead.com/top-marriott-stays-hilton-head#${p.slug}`,
        description: p.positioning,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hilton Head Island',
          addressRegion: 'SC',
          addressCountry: 'US',
        },
      },
    })),
  }
}
