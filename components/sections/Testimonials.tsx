import { testimonials, testimonialsMeta } from '@/data/testimonials';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { insiderProof } from '@/data/insiderProof';

/**
 * Testimonials — editorial quote cards with star ratings.
 *
 * Graceful fallback: if all testimonials are placeholders, we render a
 * social-proof stats strip instead of fake-quote blocks. As soon as real
 * testimonials are added to data/testimonials.ts (with isPlaceholder:false),
 * the quote cards render automatically.
 */
export default function Testimonials() {
  const realTestimonials = testimonials.filter((t) => !t.isPlaceholder);
  const hasReal = realTestimonials.length > 0;
  const visibleQuotes = hasReal ? realTestimonials : testimonials;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="mt-28 md:mt-36"
    >
      <Divider ornament="oyster" className="mb-16" />

      <SectionHead
        number="№ 05"
        eyebrow={hasReal ? 'Clients' : 'Track record'}
        plain={hasReal ? 'What travelers' : 'Four hundred trips,'}
        italic={hasReal ? 'actually say.' : 'one consistent promise.'}
      />

      {hasReal ? (
        // Real testimonials — quote cards with editorial treatment
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {visibleQuotes.slice(0, 3).map((t, i) => (
            <figure
              key={i}
              className="flex flex-col gap-5 border-t border-ocean-deep/15 pt-8"
            >
              <div className="flex gap-1 text-coral" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s}>★</span>
                ))}
              </div>
              <blockquote className="display-italic text-[20px] leading-[1.4] text-ink md:text-[22px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto">
                <div className="display text-[16px] text-ink">{t.author}</div>
                <div className="eyebrow mt-1 text-ink-soft">
                  {t.location} · {t.tripType}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        // Placeholder/launch state — lead with stats instead of fake quotes
        <div className="mt-14">
          <p className="max-w-[620px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
            Real client testimonials are coming as our 2026 travelers return
            home and write them. In the meantime, the numbers tell the story.
          </p>
          <dl className="mt-12 grid grid-cols-2 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15 md:grid-cols-4 md:divide-x md:divide-y-0">
            {insiderProof.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 px-0 py-8 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0"
              >
                <dt className="eyebrow text-ink-soft">{stat.label}</dt>
                <dd className="display text-[44px] leading-none text-ocean md:text-[56px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

/** Expose aggregate rating for schema — used in layout/homepage JSON-LD. */
export const testimonialsAggregate = testimonialsMeta;
