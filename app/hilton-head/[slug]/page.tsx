import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import {
  SectionHead,
  Divider,
  Polaroid,
  Ticket,
  TravelSeal,
  CompassRose,
} from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getPlaceSchema,
} from '@/app/lib/metadata';
import {
  neighborhoods,
  getNeighborhoodBySlug,
} from '@/data/neighborhoods';

export const revalidate = 3600;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) {
    return generatePageMetadata({
      title: 'Not found',
      description: 'Neighborhood not found.',
      path: `/hilton-head/${slug}`,
    });
  }
  return generatePageMetadata({
    title: `${n.name} Hilton Head: Villas, Stays & Planning`,
    description: n.metaDescription,
    path: `/hilton-head/${n.slug}`,
    keywords: n.keywords,
  });
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hilton Head', path: '/hilton-head' },
    { name: n.name, path: `/hilton-head/${n.slug}` },
  ]);
  const place = getPlaceSchema({
    name: `${n.name}, Hilton Head Island`,
    description: n.metaDescription,
    url: `${siteUrl}/hilton-head/${n.slug}`,
    latitude: n.latitude,
    longitude: n.longitude,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(place) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* ——— Breadcrumb ——— */}
        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-ink-soft">Hilton Head</span>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">{n.name}</span>
        </nav>

        {/* ——— Hero ——— */}
        <header className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="text-coral"><CompassRose size={22} /></span>
              <span className="eyebrow-coral eyebrow">
                Neighborhood · Hilton Head Island
              </span>
            </div>
            <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] tracking-[-0.025em] text-ink md:text-[64px] lg:text-[76px]">
              {n.tagline.plain}{' '}
              <span className="display-italic text-coral">
                {n.tagline.italic}
              </span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              {n.hook}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/itinerary"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
              >
                Plan a {n.name} trip
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              {n.blogPostSlug ? (
                <Link
                  href={`/blog/${n.blogPostSlug}`}
                  className="link-underline inline-flex items-center gap-2 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
                >
                  Read the full guide ↓
                </Link>
              ) : null}
            </div>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[500px]">
            <Image
              src={n.hero.src}
              alt={n.hero.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
            <div className="absolute left-4 top-4">
              <Ticket>{n.name} · Hilton Head</Ticket>
            </div>
          </figure>
        </header>

        <Divider ornament="compass" className="my-20" />

        {/* ——— Why this neighborhood ——— */}
        <section>
          <SectionHead
            number="№ 01"
            eyebrow={`Why ${n.name}`}
            plain="Four reasons we book"
            italic={`here often.`}
          />
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            {n.reasons.map((r, i) => (
              <article
                key={r.title}
                className="flex flex-col gap-4 border-t border-ocean-deep/15 pt-8"
              >
                <span className="section-number text-[24px]">
                  {`0${i + 1}`}
                </span>
                <h3 className="display text-[22px] leading-[1.15] text-ink md:text-[26px]">
                  {r.title}
                </h3>
                <p className="text-[14.5px] leading-[1.7] text-ink-soft">
                  {r.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ——— Gallery ——— */}
        <section className="mt-24 rounded-[2px] bg-sand-deep/50 px-6 py-16 md:px-14 md:py-24">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <span className="eyebrow eyebrow-coral">A few frames</span>
            <h3 className="display max-w-[620px] text-[28px] leading-[1.1] text-ink md:text-[38px]">
              {n.name} <span className="display-italic text-coral">in mood.</span>
            </h3>
          </div>
          <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {n.gallery.map((p, i) => (
              <Polaroid
                key={i}
                src={p.src}
                alt={p.alt}
                caption={p.caption}
                tiltIndex={i}
              />
            ))}
          </div>
        </section>

        {/* ——— Best for / tradeoffs ——— */}
        <section className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <h3 className="eyebrow text-coral">Best for</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {n.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 border-b border-ocean-deep/10 pb-4 text-[15px] text-ink"
                >
                  <span className="h-px w-6 bg-coral" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow text-coral">The honest tradeoffs</h3>
            <p className="mt-6 text-[15px] leading-[1.75] text-ink-soft">
              {n.tradeoffs}
            </p>
          </div>
        </section>

        {/* ——— Properties ——— */}
        <section className="mt-24">
          <SectionHead
            number="№ 02"
            eyebrow="Where we book you"
            plain="Properties we've vetted"
            italic="in person."
          />
          <div className="mt-12 grid grid-cols-1 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15 md:grid-cols-2 md:divide-x md:divide-y-0">
            {n.properties.map((prop, i) => (
              <article
                key={prop.name}
                className="grid grid-cols-[auto_1fr] items-baseline gap-5 py-8 md:px-10 md:py-12 first:md:pl-0 last:md:pr-0"
              >
                <span className="section-number text-[22px]">
                  {`0${i + 1}`}
                </span>
                <div>
                  <h4 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                    {prop.name}
                  </h4>
                  <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
                    {prop.note}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ——— Affiliate booking cards (browse direct) ———
            Booking + Vrbo side-by-side. Booking's commission tier is
            higher per stay, so it gets the first slot. Both function
            in pre-AID fallback mode — they still hit a real Hilton
            Head search results page, just without our tracking ID. */}
        <section
          aria-label="Direct booking options"
          className="mt-16"
        >
          <h3 className="eyebrow text-coral">Or browse on your own</h3>
          <AffiliateDisclosure variant="inline" className="mt-3 mb-5" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <AffiliateCard
              programId="booking"
              deeplink={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${n.name} Hilton Head Island, SC`)}`}
              placement={`neighborhood/${n.slug}/booking`}
              headline={`Hotels & stays in ${n.name}`}
              description={`Free cancellation on most ${n.name} stays. Filter by dates to see what’s actually available before you commit.`}
              cta={`Search ${n.name} stays →`}
            />
            <AffiliateCard
              programId="vrbo"
              deeplink={`https://www.vrbo.com/search?q=${encodeURIComponent(`${n.name} Hilton Head Island, SC`)}`}
              placement={`neighborhood/${n.slug}/vrbo`}
              headline={`Whole-house rentals in ${n.name}`}
              description={`Vrbo's ${n.name} inventory beyond our shortlist — useful if your dates overlap with the high-demand weeks our partners are already booked.`}
              cta={`Browse ${n.name} on Vrbo →`}
            />
          </div>
        </section>

        {/* ——— CTA ——— */}
        <section className="mt-24 border-y border-ocean-deep/15 py-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <TravelSeal
                size={72}
                topText={`${n.name.toUpperCase()} · HILTON HEAD`}
                bottomText="· LOCAL DISPATCH ·"
                motif="compass"
                className="text-ocean-deep mb-5"
              />
              <h3 className="display text-[28px] leading-[1.1] text-ink md:text-[40px]">
                Ready to plan a{' '}
                <span className="display-italic text-coral">
                  {n.name} trip?
                </span>
              </h3>
              <p className="mt-3 max-w-[520px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                Tell us your dates and group. We come back with villa picks,
                a dining plan, and a quote in one business day.
              </p>
            </div>
            <Link
              href="/itinerary"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
            >
              Request an itinerary
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </section>

        {/* ——— Related: link to blog post ——— */}
        {n.blogPostSlug ? (
        <section className="mt-16">
          <h3 className="eyebrow text-ink-soft">Deeper on the island</h3>
          <Link
            href={`/blog/${n.blogPostSlug}`}
            className="mt-4 block text-[18px] italic leading-[1.4] text-ink transition-colors hover:text-coral md:text-[22px]"
          >
            → Read the full {n.name} guide. Neighborhoods, bike paths,
            dining, and the three things we\u2019d add that no tourist list
            mentions.
          </Link>
        </section>
        ) : null}

        {/* \u2014\u2014\u2014 Other neighborhoods (cross-link rail) \u2014\u2014\u2014 */}
        <section aria-label="Other Hilton Head neighborhoods" className="mt-20 border-t border-ink/15 pt-12">
          <h2 className="display text-[22px] leading-[1.2] text-ink md:text-[26px]">
            Other neighborhoods to consider
          </h2>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-ink-soft">
            {n.name} is one of {neighborhoods.length} distinct communities on
            Hilton Head Island. Compare the alternatives to find the right fit
            for your trip.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods
              .filter((other) => other.slug !== n.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/hilton-head/${other.slug}`}
                    className="group flex h-full flex-col gap-2 rounded-2xl border border-ink/15 bg-cream/40 px-5 py-4 transition-colors hover:border-coral hover:bg-cream"
                  >
                    <span className="display text-[18px] leading-[1.2] text-ink group-hover:text-coral">
                      {other.name}
                    </span>
                    <span className="line-clamp-2 text-[13px] leading-[1.5] text-ink-soft">
                      {other.bestFor[0] ?? other.keywords[0]}
                    </span>
                    <span className="mt-auto pt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                      Read the guide \u2192
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <div className="mt-24">
          <NewsletterSignup
            variant="inline"
            source={`neighborhood_${n.slug}`}
          />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
