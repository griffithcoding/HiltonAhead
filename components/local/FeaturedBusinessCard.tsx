import type { Business } from '@/data/localBusinesses'

interface Props {
  business: Business
}

export default function FeaturedBusinessCard({ business }: Props) {
  return (
    <article
      id={business.id}
      className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-sand-soft via-sand to-sand-deep shadow-[0_4px_32px_var(--shadow-ink)]"
    >
      {/* Featured Partner ribbon */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-r from-gold to-gold-deep px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">⭐</span>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
            Featured Partner
          </span>
        </div>
        <span className="text-xs font-medium text-ink/70">
          Hilton Head Local Guide
        </span>
      </div>

      <div className="pt-11">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Image column */}
          <div className="relative min-h-64 bg-sand-deep md:min-h-80">
            {business.heroImage.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.heroImage.src}
                alt={business.heroImage.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 w-full flex-col items-center justify-center bg-gradient-to-br from-ocean/10 to-coral/10 text-center p-8 md:min-h-80">
                <div className="mb-3 text-5xl opacity-30">🏖️</div>
                <p className="text-xs font-medium uppercase tracking-widest text-ink-soft opacity-50">
                  Featured Business Photo
                </p>
                <p className="mt-1 text-[10px] text-ink-soft opacity-30">
                  Replace with actual business image
                </p>
              </div>
            )}
          </div>

          {/* Content column */}
          <div className="flex flex-col justify-center p-7 md:p-8 lg:p-10">
            {/* Category chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {business.categories.slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="inline-block rounded-full border border-ocean/20 bg-ocean/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ocean"
                >
                  {cat}
                </span>
              ))}
              {business.priceRange && (
                <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-[10px] font-semibold tracking-widest text-gold-deep">
                  {business.priceRange}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="display mb-2 text-2xl font-medium leading-snug text-ink md:text-3xl">
              {business.name}
            </h3>

            {/* Tagline */}
            <p className="mb-4 text-base font-medium leading-snug text-ocean">
              {business.tagline}
            </p>

            {/* Full review (more space on featured card) */}
            <p className="mb-6 text-sm leading-relaxed text-ink-soft">
              {business.review}
            </p>

            {/* Info */}
            <div className="mb-6 space-y-1.5 border-t border-rule-soft pt-4 text-xs text-ink-soft">
              <p className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-ocean">📍</span>
                <span>
                  {business.address}, {business.city}
                </span>
              </p>
              {business.phone && (
                <p className="flex items-center gap-2">
                  <span className="shrink-0 text-ocean">📞</span>
                  <a
                    href={`tel:${business.phone.replace(/\D/g, '')}`}
                    className="transition-colors hover:text-coral"
                  >
                    {business.phone}
                  </a>
                </p>
              )}
              {business.hours && (
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-ocean">🕐</span>
                  <span>{business.hours}</span>
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-sand shadow-md transition-all duration-200 hover:bg-ocean hover:shadow-lg"
                >
                  Visit website
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${business.name} on Instagram`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule-soft bg-sand text-ink-soft transition-colors hover:text-coral"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
