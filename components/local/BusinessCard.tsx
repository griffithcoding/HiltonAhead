import type { Business } from '@/data/localBusinesses'
import TrackedPhoneLink from './TrackedPhoneLink'
import TrackedWebsiteLink from './TrackedWebsiteLink'

interface Props {
  business: Business
  /** Paid tier from the businesses DB table — drives badge rendering. */
  tier?: 'listed' | 'featured' | 'signature'
}

const TIER_BADGE: Record<string, { label: string; className: string }> = {
  signature: {
    label: '★ Signature',
    className: 'bg-gold/90 text-ink',
  },
  featured: {
    label: '◆ Featured',
    className: 'bg-coral/90 text-sand',
  },
  listed: {
    label: '✓ Verified',
    className: 'bg-ocean/90 text-sand',
  },
}

function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null
  const cfg = TIER_BADGE[tier]
  if (!cfg) return null
  return (
    <div
      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${cfg.className}`}
    >
      {cfg.label}
    </div>
  )
}

function PriceRange({ value }: { value?: string }) {
  if (!value) return null
  return (
    <span className="text-xs font-medium tracking-wide text-palm-light">
      {value}
    </span>
  )
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full border border-rule-soft bg-sand-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink-soft">
      {label}
    </span>
  )
}

function PlaceholderImage({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sand-deep to-ocean-light/20 p-4 text-center">
      <div className="mb-2 text-3xl opacity-40">🏖️</div>
      <p className="text-xs font-medium uppercase tracking-widest text-ink-soft opacity-60">
        {category}
      </p>
      <p className="mt-1 text-[10px] text-ink-soft opacity-40">Photo coming soon</p>
    </div>
  )
}

export default function BusinessCard({ business, tier }: Props) {
  const primaryCategory = business.categories[0] || 'Local Business'

  return (
    <article
      id={business.id}
      className="group flex flex-col overflow-hidden rounded-2xl border border-rule-soft bg-sand-soft shadow-[0_2px_12px_var(--shadow-ink)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_var(--shadow-ink)]"
    >
      {/* Image */}
      <div className="relative h-52 w-full flex-shrink-0 overflow-hidden bg-sand-deep">
        {business.heroImage.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.heroImage.src}
            alt={business.heroImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage name={business.name} category={primaryCategory} />
        )}
        <TierBadge tier={tier} />
        {/* Price range overlay */}
        {business.priceRange && (
          <div className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-sand backdrop-blur-sm">
            {business.priceRange}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {business.categories.slice(0, 3).map((cat) => (
            <CategoryTag key={cat} label={cat} />
          ))}
        </div>

        {/* Name + tagline */}
        <h3 className="mb-1 font-display text-lg font-medium leading-snug text-ink">
          {business.name}
        </h3>
        <p className="mb-3 text-sm font-medium leading-snug text-ocean">
          {business.tagline}
        </p>

        {/* Local quote — pull-quote style when set */}
        {business.localQuote && (
          <blockquote className="mb-3 border-l-2 border-coral pl-3 text-[13px] italic leading-snug text-ink-soft">
            &ldquo;{business.localQuote}&rdquo;
          </blockquote>
        )}

        {/* Review excerpt */}
        <p className="mb-3 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
          {business.review}
        </p>

        {/* Best for */}
        {business.bestFor && (
          <p className="mb-3 text-xs leading-snug text-ink-soft">
            <span className="font-semibold text-ink">Best for:</span> {business.bestFor}
          </p>
        )}

        {/* Practical chips — gate pass, parking, pet-friendly */}
        {(business.gatePass || business.parking || business.petFriendly) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {business.gatePass === 'sea-pines' && (
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-gold-deep">
                Sea Pines gate pass
              </span>
            )}
            {business.gatePass === 'palmetto-dunes' && (
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-gold-deep">
                Palmetto Dunes gate pass
              </span>
            )}
            {business.parking && (
              <span className="rounded-full border border-rule-soft bg-sand-deep px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink-soft">
                🅿 {business.parking}
              </span>
            )}
            {business.petFriendly && (
              <span className="rounded-full border border-rule-soft bg-sand-deep px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink-soft">
                🐕 Pet friendly
              </span>
            )}
          </div>
        )}

        {/* Address + phone */}
        <div className="mb-4 space-y-1 border-t border-rule-soft pt-4 text-xs text-ink-soft">
          <p className="flex items-start gap-1.5">
            <span className="mt-0.5 shrink-0 text-ocean">📍</span>
            <span>
              {business.address}, {business.city}
            </span>
          </p>
          {business.phone && (
            <p className="flex items-center gap-1.5">
              <span className="shrink-0 text-ocean">📞</span>
              <TrackedPhoneLink
                businessId={business.id}
                industrySlug={business.industrySlug}
                phone={business.phone}
                className="transition-colors hover:text-coral"
              >
                {business.phone}
              </TrackedPhoneLink>
            </p>
          )}
          {business.hours && (
            <p className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0 text-ocean">🕐</span>
              <span>{business.hours}</span>
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {business.website ? (
            <TrackedWebsiteLink
              businessId={business.id}
              industrySlug={business.industrySlug}
              url={business.website}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-widest text-sand transition-colors duration-200 hover:bg-ocean"
            >
              Visit site
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </TrackedWebsiteLink>
          ) : null}
          {/* Social links */}
          <div className="ml-auto flex items-center gap-2">
            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${business.name} on Instagram`}
                className="text-ink-soft transition-colors hover:text-coral"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
          </div>
        </div>
        {/* Owner claim CTA — discreet footer link, single line. The portal
            handles email-verification + binding. */}
        <a
          href={`/business/claim/${business.id}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-coral"
        >
          Own this business? Claim it →
        </a>
      </div>
    </article>
  )
}
