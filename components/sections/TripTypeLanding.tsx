import Link from 'next/link';
import Image from 'next/image';
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
  type TripTypeLanding as TripType,
  getRelatedTripTypes,
  getTripTypeDisplayName,
} from '@/data/tripTypes';
import { getStoryBySlug } from '@/data/stories';

interface Props {
  trip: TripType;
}

/**
 * Shared renderer for trip-type landing pages
 * (e.g., /hilton-head-golf-packages, /hilton-head-weddings).
 *
 * Mirrors the neighborhood page layout but keyed off trip intent rather
 * than geographic pocket. Skips the "properties" block (trip types are
 * not tied to a fixed property shortlist) and skips geo schema
 * (handled by the caller if wanted — trip types are not Places).
 */
export default function TripTypeLandingPage({ trip }: Props) {
  return (
    <>
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
          <Link href="/services" className="transition-colors hover:text-coral">
            Services
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">{trip.seoTitle.split(':')[0]}</span>
        </nav>

        {/* ——— Hero ——— */}
        <header className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="text-coral">
                <CompassRose size={22} />
              </span>
              <span className="eyebrow-coral eyebrow">
                {trip.eyebrow ?? 'Trip type · Hilton Head Island'}
              </span>
            </div>
            <h1 className="display mt-5 text-balance text-[34px] leading-[1.05] tracking-[-0.025em] text-ink sm:text-[40px] md:text-[64px] lg:text-[76px]">
              {trip.tagline.plain}{' '}
              <span className="display-italic text-coral">
                {trip.tagline.italic}
              </span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              {trip.hook}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/itinerary"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
              >
                Plan this trip
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              {trip.blogPostSlug && (
                <Link
                  href={`/blog/${trip.blogPostSlug}`}
                  className="link-underline inline-flex items-center gap-2 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
                >
                  Read the full guide ↓
                </Link>
              )}
            </div>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[500px]">
            <Image
              src={trip.hero.src}
              alt={trip.hero.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
            <div className="absolute left-4 top-4">
              <Ticket>{trip.seoTitle.split(':')[0]}</Ticket>
            </div>
          </figure>
        </header>

        <Divider ornament="compass" className="my-20" />

        {/* ——— Four reasons ——— */}
        <section>
          <SectionHead
            number="№ 01"
            eyebrow="Why us for this"
            plain="Four reasons the"
            italic="local angle matters."
          />
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            {trip.reasons.map((r, i) => (
              <article
                key={r.title}
                className="flex flex-col gap-4 border-t border-ocean-deep/15 pt-8"
              >
                <span className="section-number text-[24px]">{`0${i + 1}`}</span>
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
        {trip.gallery.length > 0 && (
          <section className="mt-24 rounded-[2px] bg-sand-deep/50 px-6 py-16 md:px-14 md:py-24">
            <div className="mb-10 flex flex-col items-center gap-3 text-center">
              <span className="eyebrow eyebrow-coral">A few frames</span>
              <h3 className="display max-w-[620px] text-[28px] leading-[1.1] text-ink md:text-[38px]">
                In{' '}
                <span className="display-italic text-coral">
                  mood.
                </span>
              </h3>
            </div>
            <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
              {trip.gallery.map((p, i) => (
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
        )}

        {/* ——— Best for / tradeoffs ——— */}
        <section className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <h3 className="eyebrow text-coral">Best for</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {trip.bestFor.map((item) => (
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
              {trip.tradeoffs}
            </p>
          </div>
        </section>

        {/* ——— Affiliate placements (rendered only when configured) ——— */}
        {trip.affiliates && trip.affiliates.length > 0 && (
          <section
            aria-label="Recommended booking partners"
            className="mt-24"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="eyebrow text-coral">If you’d rather book direct</h3>
            </div>
            <AffiliateDisclosure variant="inline" className="mb-5" />
            <div
              className={`grid grid-cols-1 gap-5 ${
                trip.affiliates.length > 1 ? 'md:grid-cols-2 md:gap-6' : ''
              }`}
            >
              {trip.affiliates.map((slot) => (
                <AffiliateCard
                  key={`${slot.programId}-${slot.placement ?? trip.slug}`}
                  programId={slot.programId}
                  deeplink={slot.deeplink}
                  placement={slot.placement ?? trip.slug}
                  headline={slot.headline}
                  description={slot.description}
                  cta={slot.cta}
                />
              ))}
            </div>
          </section>
        )}

        {/* ——— CTA ——— */}
        <section className="mt-24 border-y border-ocean-deep/15 py-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <TravelSeal
                size={72}
                topText="HILTON AHEAD · TRAVEL CO"
                bottomText="· LOCAL DISPATCH ·"
                motif="compass"
                className="text-ocean-deep mb-5"
              />
              <h3 className="display text-[28px] leading-[1.1] text-ink md:text-[40px]">
                Ready to{' '}
                <span className="display-italic text-coral">plan it?</span>
              </h3>
              <p className="mt-3 max-w-[520px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                Tell us your dates and group size. We come back with a plan,
                a quote, and a recommended next step inside one business day.
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

        {/* ——— Related story link (if any) ——— */}
        {trip.relatedStorySlug && (() => {
          const story = getStoryBySlug(trip.relatedStorySlug);
          if (!story) return null;
          return (
            <section
              aria-label="See the story"
              className="mt-20 overflow-hidden rounded-md bg-ocean-deep text-sand"
            >
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Link
                  href={`/stories/${story.slug}`}
                  className="group relative block aspect-[4/3] md:aspect-auto"
                  aria-label={`Read ${story.seoTitle}`}
                >
                  <Image
                    src={story.cover.src}
                    alt={story.cover.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover photo-warm transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <Ticket className="!bg-sand !text-ocean-deep">
                      Story № {story.storyNumber}
                    </Ticket>
                  </div>
                </Link>
                <div className="flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-16">
                  <span className="eyebrow text-coral">See the story</span>
                  <h3 className="display text-[28px] leading-[1.1] text-sand md:text-[36px]">
                    {story.title.plain}{' '}
                    <span className="display-italic text-gold">
                      {story.title.italic}
                    </span>
                  </h3>
                  <p className="text-[14.5px] leading-[1.7] text-sand/80 md:text-[15px]">
                    {story.hook}
                  </p>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="link-underline mt-2 inline-block text-[12px] font-medium uppercase tracking-[0.22em] text-sand"
                  >
                    Read the full story →
                  </Link>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ——— Related blog link (if any) ——— */}
        {trip.blogPostSlug && (
          <section className="mt-16">
            <h3 className="eyebrow text-ink-soft">Deeper on the island</h3>
            <Link
              href={`/blog/${trip.blogPostSlug}`}
              className="mt-4 block text-[18px] italic leading-[1.4] text-ink transition-colors hover:text-coral md:text-[22px]"
            >
              → Read the long-form guide. Logistics, pricing, and the three
              things we&apos;d tell you on a planning call.
            </Link>
          </section>
        )}

        {/* ——— Other ways to visit (cross-link rail) ——— */}
        {(() => {
          const related = getRelatedTripTypes(trip.slug);
          if (related.length === 0) return null;
          return (
            <section
              aria-label="Other ways to visit Hilton Head"
              className="mt-20 border-t border-ink/15 pt-12"
            >
              <h2 className="display text-[22px] leading-[1.2] text-ink md:text-[26px]">
                Other ways to visit
              </h2>
              <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-ink-soft">
                Different trip, different priorities. These are the other
                Hilton Head trip types we plan most often.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rt) => (
                  <li key={rt.slug}>
                    <Link
                      href={rt.path}
                      className="group flex h-full flex-col gap-2 rounded-2xl border border-ink/15 bg-cream/40 px-5 py-4 transition-colors hover:border-coral hover:bg-cream"
                    >
                      <span className="display text-[18px] leading-[1.2] text-ink group-hover:text-coral">
                        {getTripTypeDisplayName(rt)}
                      </span>
                      <span className="line-clamp-2 text-[13px] leading-[1.5] text-ink-soft">
                        {rt.hook}
                      </span>
                      <span className="mt-auto pt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                        See how we plan it →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })()}

        <div className="mt-24">
          <NewsletterSignup
            variant="inline"
            source={`trip_type_${trip.slug}`}
          />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
