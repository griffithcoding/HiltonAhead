import {
  AMAZON_PRODUCT_CATEGORIES,
  AMAZON_PRODUCTS,
  type AmazonProductCategoryId,
} from '@/data/amazonProducts';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';

/**
 * Compact grid of curated Amazon product recommendations.
 *
 * Why this exists: AffiliateCard is a single big CTA; we wanted a denser
 * "shopping list" surface for pages where readers are gear-shopping pre-trip
 * (beaches, family planner, oceanfront villas, etc.). Renders text-only
 * (no product images) — Amazon's PA-API image rights are gated by the
 * 3-sale-in-180-days rule, so we stay on plain links until that unlocks.
 *
 * Every card flows through <AffiliateLink>, which handles:
 *   - rel="sponsored nofollow noopener noreferrer" (FTC + Google)
 *   - tag stamping via withAffiliateParams()
 *   - click beacon → /api/affiliate/track
 *
 * Disclosure: this component renders its own <AffiliateDisclosure variant="inline" />
 * inside the section header. If the host page wants the bigger banner above
 * the fold (recommended), drop a <AffiliateDisclosure /> there too.
 *
 * Server component — no client-side JS needed.
 */
export default function AmazonProductGrid({
  category,
  placement,
  limit,
  className,
  headingOverride,
}: {
  /** Which category bucket to render (matches AmazonProductCategoryId). */
  category: AmazonProductCategoryId;
  /**
   * Placement string passed to AffiliateLink for click analytics AND tag
   * resolution. Convention: `<surface>/<page-slug>/<category>` — e.g.
   * `'trip/beaches/beach-essentials'`. The prefix (e.g. `trip`, `blog`,
   * `faq`, `local`) determines which placement-specific Amazon tag fires
   * (when configured) — see data/affiliateLinks.ts `placementTagEnv`.
   */
  placement: string;
  /** Cap the number rendered. Defaults to all in category. */
  limit?: number;
  className?: string;
  /** Override the category's default heading. */
  headingOverride?: string;
}) {
  const meta = AMAZON_PRODUCT_CATEGORIES[category];
  const products = AMAZON_PRODUCTS.filter((p) => p.category === category).slice(
    0,
    limit ?? Number.POSITIVE_INFINITY,
  );

  if (products.length === 0) return null;

  return (
    <section
      aria-label={`Amazon recommendations: ${meta.title}`}
      className={[
        'my-12 rounded-2xl border border-rule-soft bg-sand-soft/40 p-6 md:my-16 md:p-8',
        className ?? '',
      ].join(' ')}
    >
      <header className="mb-6 md:mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-coral">
            What to bring
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
            via Amazon
          </span>
        </div>
        <h2 className="display text-[24px] font-medium leading-[1.15] text-ink md:text-[30px]">
          {headingOverride ?? meta.title}
        </h2>
        {meta.intro && (
          <p className="mt-3 max-w-[640px] text-[15px] leading-[1.65] text-ink-soft">
            {meta.intro}
          </p>
        )}
        <AffiliateDisclosure variant="inline" className="mt-4" />
      </header>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li
            key={product.slug}
            className="flex flex-col gap-2 border-t border-rule-soft pt-5"
          >
            <h3 className="text-[15px] font-semibold leading-snug text-ink md:text-[16px]">
              {product.name}
            </h3>
            {product.priceBand && (
              <p className="text-[12px] uppercase tracking-[0.14em] text-ink-soft/80">
                {product.priceBand}
              </p>
            )}
            <p className="text-[14px] leading-[1.6] text-ink-soft">
              {product.pitch}
            </p>
            {product.whyLocal && (
              <p className="text-[12px] italic leading-snug text-coral/80">
                {product.whyLocal}
              </p>
            )}
            <div className="mt-auto pt-2">
              <AffiliateLink
                programId="amazon"
                deeplink={product.deeplink}
                placement={`${placement}/${product.slug}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline-offset-4 hover:text-coral hover:underline"
                ariaLabel={`${product.name} on Amazon (affiliate link)`}
              >
                See on Amazon →
              </AffiliateLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
