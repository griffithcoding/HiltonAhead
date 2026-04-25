import Link from 'next/link'

interface Props {
  industryName?: string
  variant?: 'inline' | 'sticky'
}

export default function GetFeaturedBanner({ industryName, variant = 'inline' }: Props) {
  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-5 right-5 z-30 hidden xl:block">
        <Link
          href="/local/get-featured"
          className="flex items-center gap-2 rounded-2xl bg-gold px-4 py-3 text-sm font-bold text-ink shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <span>⭐</span>
          <span className="whitespace-nowrap">Feature your business</span>
        </Link>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-deep via-ocean to-ocean-light/30 px-8 py-12 text-center md:px-12">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-coral/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gold/10" />

      <div className="relative">
        <p className="eyebrow mb-3 text-coral">
          For local businesses
        </p>
        <h2 className="display mb-4 text-3xl font-medium text-sand md:text-4xl">
          Is your{' '}
          {industryName ? (
            <span className="italic text-gold">{industryName.toLowerCase()}</span>
          ) : (
            'business'
          )}{' '}
          listed here?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-ocean-light">
          Hilton Head visitors are high-spending trip planners searching for
          the best local options. A featured listing puts your business at the
          top of this guide — with a direct link, editorial profile, and
          prominent placement across hiltonahead.com.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/local/get-featured"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-ink shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-xl"
          >
            <span>⭐</span>
            Get featured
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-ocean-light/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-ocean-light transition-all duration-200 hover:border-ocean-light/60 hover:text-sand"
          >
            Ask a question
          </Link>
        </div>
      </div>
    </section>
  )
}
