import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generatePageMetadata } from '@/app/lib/metadata';
import { brand } from '@/data/brand';
import { itineraryPacks, getPackByUrlSlug } from '@/data/itineraryPacks';
import { INFO_PRODUCT_TIERS, getStripePriceId } from '@/data/pricing';
import BuyButton from '@/components/info-products/BuyButton';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return itineraryPacks.map((p) => ({ pack: p.urlSlug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pack: string }>;
}): Promise<Metadata> {
  const { pack: slug } = await params;
  const pack = getPackByUrlSlug(slug);
  if (!pack) return {};
  return generatePageMetadata({
    title: pack.seoTitle,
    description: pack.metaDescription,
    path: `/itinerary-packs/${slug}`,
    keywords: pack.keywords,
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ItineraryPackPage({
  params,
}: {
  params: Promise<{ pack: string }>;
}) {
  const { pack: slug } = await params;
  const pack = getPackByUrlSlug(slug);
  if (!pack) notFound();

  const tier = INFO_PRODUCT_TIERS.find((t) => t.slug === pack.tierSlug);
  if (!tier) notFound();

  // Checkout is ready when STRIPE_PRICE_* env var is set.
  // In dev without the env var, the buy button falls back to a mailto link.
  const checkoutReady = !!getStripePriceId(tier);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

  // JSON-LD: Product schema for SEO
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pack.title,
    description: pack.metaDescription,
    image: pack.heroImage.src,
    brand: {
      '@type': 'Brand',
      name: brand.name,
    },
    offers: {
      '@type': 'Offer',
      price: pack.priceUsd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/itinerary-packs/${pack.urlSlug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-20 md:py-28">
        {pack.heroImage.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pack.heroImage.src}
            alt={pack.heroImage.alt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-ocean-light">
              <li><Link href="/" className="hover:text-sand">Home</Link></li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li className="text-sand/70">Itinerary Packs</li>
              <li aria-hidden className="text-ocean-light/40">›</li>
              <li className="text-sand/70">{pack.title}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-3 text-coral">
            📄 {pack.duration} · {pack.pages} · Instant download
          </p>
          <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
            {pack.title}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
            {pack.tagline}
          </p>

          {/* Price + CTA in hero */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <BuyButton
              tierSlug={pack.tierSlug}
              priceDisplay={pack.priceDisplay}
              checkoutReady={checkoutReady}
              size="lg"
            />
            <p className="text-xs text-ocean-light/60">
              Instant PDF download · Secure checkout via Stripe · No subscription
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">

        {/* Pitch */}
        <section className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-base leading-relaxed text-ink-soft md:text-lg">
            {pack.pitch}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* What's included */}
          <section>
            <h2 className="display mb-6 text-xl font-medium text-ink md:text-2xl">
              What&apos;s inside
            </h2>
            <ul className="space-y-3">
              {pack.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-0.5 shrink-0 text-coral">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Preview sections */}
          <section>
            <h2 className="display mb-6 text-xl font-medium text-ink md:text-2xl">
              Table of contents preview
            </h2>
            <ol className="space-y-2">
              {pack.previewSections.map((section, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="shrink-0 font-mono text-xs text-ocean/60">{String(i + 1).padStart(2, '0')}</span>
                  <span>{section}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Social proof */}
        {pack.socialProof && (
          <section className="my-16 rounded-3xl border border-rule-soft bg-sand-soft px-8 py-10 text-center">
            <blockquote className="text-base italic leading-relaxed text-ink-soft md:text-lg">
              &ldquo;{pack.socialProof.replace(/^"/, '').replace(/"$/, '')}&rdquo;
            </blockquote>
          </section>
        )}

        {/* Buy section */}
        <section className="mx-auto max-w-md rounded-3xl border border-rule-soft bg-sand-soft px-8 py-10 text-center">
          <p className="eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-coral">
            {pack.duration} itinerary · {pack.pages}
          </p>
          <p className="display mb-2 text-5xl font-medium text-ink">
            {pack.priceDisplay}
          </p>
          <p className="mb-8 text-sm text-ink-soft">One-time purchase · Instant PDF download</p>
          <BuyButton
            tierSlug={pack.tierSlug}
            priceDisplay={pack.priceDisplay}
            checkoutReady={checkoutReady}
            size="lg"
          />
          <p className="mt-4 text-xs text-ink-soft">
            Secure checkout via Stripe. PDF delivered to your inbox immediately.
          </p>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-16 max-w-2xl">
          <h2 className="display mb-8 text-center text-2xl font-medium text-ink">
            Questions
          </h2>
          <div className="space-y-px">
            {[
              {
                q: 'How do I get the PDF after I buy?',
                a: 'Instantly. As soon as your payment clears, we email the PDF to the address you used at checkout. Check your spam folder if it doesn\'t appear within 2 minutes.',
              },
              {
                q: 'Is this a generic guide or actually specific to Hilton Head?',
                a: 'Completely specific. Every restaurant, beach, course, and activity is a real Hilton Head pick — not a template. The content reflects current operating hours, seasonal notes, and reservation realities.',
              },
              {
                q: 'Can I use this for a trip that\'s not the exact duration?',
                a: 'Yes. The day-by-day format is easy to compress or extend. Most buyers treat it as a modular menu — pick the days and activities that fit their schedule.',
              },
              {
                q: 'What format is the PDF in?',
                a: 'A clean, printable PDF optimized for both screen and print. Works on any device — phone, tablet, laptop, or printed.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes. If you\'re not satisfied within 30 days, email us and we\'ll refund you, no questions asked.',
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group border-b border-rule-soft py-4 open:pb-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink">
                  <span>{q}</span>
                  <span className="mt-0.5 shrink-0 text-ocean transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section className="mt-16 border-t border-rule-soft pt-12 text-center">
          <p className="mb-4 text-sm text-ink-soft">
            Want a fully custom itinerary built around your exact dates and preferences?
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-rule-soft bg-sand-soft px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-ocean/40 hover:text-ocean"
          >
            See full travel consulting services →
          </Link>
        </section>
      </div>
    </>
  );
}
