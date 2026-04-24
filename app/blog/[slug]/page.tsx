import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import PostBody from '@/components/PostBody';
import { Divider } from '@/components/ui/Ornament';
import { photos } from '@/data/photos';
import {
  generatePageMetadata,
  getBlogPostingSchema,
  getBreadcrumbSchema,
  getItemListSchema,
  getReviewSchema,
  getLodgingBusinessSchema,
  getPlaceSchema,
  getEventSchema,
  getFaqSchema,
} from '@/app/lib/metadata';
import {
  posts,
  getPostBySlug,
  getAdjacentPosts,
  type Post,
} from '@/data/posts';
import { getNeighborhoodBySlug } from '@/data/neighborhoods';

type Params = { slug: string };

// Category → hero photograph mapping. Choose an image that matches the
// post's category so each article gets a contextual editorial plate.
const CATEGORY_PHOTOS: Record<Post['category'], { src: string; alt: string }> = {
  Stays: photos.villa,
  Dining: photos.dock,
  Activities: photos.boardwalk,
  Neighborhoods: photos.mossOak,
  Golf: photos.hero,
  Planning: photos.marsh,
};

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post)
    return generatePageMetadata({
      title: 'Not found',
      description: 'Post not found.',
      path: `/blog/${slug}`,
    });
  return generatePageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const heroPhoto = CATEGORY_PHOTOS[post.category] ?? photos.hero;

  const postSchema = getBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    keywords: post.keywords,
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local Guide', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  // ——— Extra schemas derived from the post's tier blocks ———
  const tierBlocks = post.body.filter(
    (b): b is Extract<typeof post.body[number], { kind: 'tier' }> =>
      b.kind === 'tier',
  );
  const allTierItems = tierBlocks.flatMap((t) => t.items);

  // ItemList schema for tier-list posts (restaurants, stays, activities)
  const itemListSchema =
    tierBlocks.length > 0
      ? getItemListSchema(
          post.title,
          allTierItems.map((i) => ({ name: i.name, description: i.blurb })),
        )
      : null;

  // Review schemas — category-specific rating (S=5, A=4.5, B=4, C=3, rose=2.5)
  const tierRating: Record<string, number> = {
    gold: 5,
    primary: 4.5,
    zinc: 4,
    rose: 2.5,
  };
  const reviewItemType: 'Restaurant' | 'LodgingBusiness' | 'TouristAttraction' =
    post.category === 'Dining'
      ? 'Restaurant'
      : post.category === 'Stays'
        ? 'LodgingBusiness'
        : 'TouristAttraction';

  const reviewSchemas = tierBlocks.flatMap((tier) =>
    tier.items.map((item) =>
      getReviewSchema({
        itemName: item.name,
        itemType: reviewItemType,
        reviewBody: item.blurb,
        ratingValue: tierRating[tier.accent] ?? 4,
        authorName: post.author,
        datePublished: post.publishedAt,
        locationName: item.meta?.includes('Bluffton')
          ? 'Bluffton'
          : 'Hilton Head Island',
      }),
    ),
  );

  // LodgingBusiness schemas for Stays posts (supplements Reviews with aggregate)
  const lodgingSchemas =
    post.category === 'Stays'
      ? allTierItems.map((item) =>
          getLodgingBusinessSchema({
            name: item.name,
            description: item.blurb,
            priceRange: '$$$',
            locationName: 'Hilton Head Island',
          }),
        )
      : [];

  // Place schema for Neighborhoods posts
  const placeSchema =
    post.category === 'Neighborhoods'
      ? getPlaceSchema({
          name: post.title.split(':')[0].replace(/ Guide$/, '').trim(),
          description: post.excerpt,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`,
          latitude: 32.2163,
          longitude: -80.7526,
        })
      : null;

  // Event schema for Golf / RBC Heritage post
  const eventSchema =
    post.slug.includes('golf') || post.slug.includes('heritage')
      ? getEventSchema({
          name: 'RBC Heritage 2026',
          description:
            'PGA Tour event at Harbour Town Golf Links, Hilton Head Island.',
          startDate: '2026-04-13',
          endDate: '2026-04-19',
          locationName: 'Harbour Town Golf Links',
          url: 'https://rbcheritage.com/',
        })
      : null;

  // FAQPage schema — aggregates every faq block in the post. Google can
  // award FAQ rich results and "People Also Ask" placements from this.
  const faqItems = post.body
    .filter((b): b is Extract<typeof post.body[number], { kind: 'faq' }> =>
      b.kind === 'faq',
    )
    .flatMap((b) => b.items)
    .map((item) => ({
      question: item.q,
      answer: item.a.replace(/<[^>]+>/g, '').trim(),
    }));
  const faqSchema = faqItems.length > 0 ? getFaqSchema(faqItems) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
      )}
      {reviewSchemas.map((s, i) => (
        <script
          key={`rev-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {lodgingSchemas.map((s, i) => (
        <script
          key={`lodge-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {placeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
        />
      )}
      {eventSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <article className="mt-10">
          {/* ——— Breadcrumb ——— */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
          >
            <Link href="/" className="transition-colors hover:text-sunset">
              Home
            </Link>
            <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
            <Link
              href="/blog"
              className="transition-colors hover:text-sunset"
            >
              Local Guide
            </Link>
            <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
            <span className="text-sunset">{post.category}</span>
          </nav>

          {/* ——— Title block ——— */}
          <header className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                <span className="text-sunset">{post.category}</span>
                <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                <span>{post.readTime} read</span>
                <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <>
                    <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  </>
                )}
              </div>

              <h1 className="display mt-6 text-balance text-[40px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[60px] lg:text-[68px]">
                {post.title}
              </h1>

              <p className="mt-7 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
                {post.excerpt}
              </p>
            </div>

            <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[460px]">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover photo-warm"
                priority
              />
            </figure>
          </header>

          <Divider ornament="compass" className="my-16 text-gold" />

          {/* ——— Body ——— */}
          <div className="mx-auto max-w-[720px]">
            <PostBody blocks={post.body} />
          </div>

          {/* ——— Inline CTA ——— */}
          <div className="mx-auto mt-20 max-w-[720px] border-y border-ink/15 py-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="eyebrow text-sunset">Want this applied?</div>
                <h2 className="display mt-3 text-[24px] leading-[1.15] text-ink md:text-[28px]">
                  Let us plan your trip around it.
                </h2>
                <p className="mt-2 max-w-[420px] text-[14px] leading-[1.65] text-ink-soft">
                  The guide is free. A custom itinerary is $450 flat. Takes
                  the research off your plate entirely.
                </p>
              </div>
              <Link
                href="/itinerary"
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
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
          </div>

          {/* ——— Bidirectional internal links to neighborhood landing pages ——— */}
          {post.relatedNeighborhoods && post.relatedNeighborhoods.length > 0 && (
            <aside
              aria-label="Neighborhoods featured in this post"
              className="mx-auto mt-16 max-w-[720px]"
            >
              <div className="eyebrow text-sunset">Neighborhoods in this post</div>
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {post.relatedNeighborhoods
                  .map((slug) => getNeighborhoodBySlug(slug))
                  .filter(
                    (n): n is NonNullable<typeof n> => n !== undefined,
                  )
                  .map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/hilton-head/${n.slug}`}
                        className="group flex items-baseline justify-between gap-4 border-t border-ink/15 pt-4 transition-colors hover:border-coral"
                      >
                        <span>
                          <span className="display text-[18px] leading-[1.2] text-ink group-hover:text-coral md:text-[20px]">
                            {n.name}
                          </span>
                          <span className="mt-1 block max-w-[280px] text-[12px] leading-[1.5] text-ink-soft">
                            {n.bestFor[0] ?? n.keywords[0]}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[12px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-coral"
                        >
                          Visit →
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </aside>
          )}

          {/* ——— Newsletter inline ——— */}
          <div className="mx-auto mt-12 max-w-[720px]">
            <NewsletterSignup
              variant="inline"
              source={`blog_post_${post.slug}`}
            />
          </div>

          {/* ——— Prev / Next ——— */}
          {(prev || next) && (
            <nav
              aria-label="More dispatches"
              className="mx-auto mt-16 grid max-w-[720px] grid-cols-1 gap-6 border-t border-ink/15 pt-10 sm:grid-cols-2 sm:gap-10"
            >
              {prev ? (
                <PostNavCard direction="prev" post={prev} />
              ) : (
                <span />
              )}
              {next ? (
                <PostNavCard direction="next" post={next} />
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

function PostNavCard({
  direction,
  post,
}: {
  direction: 'prev' | 'next';
  post: Post;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-3 ${
        direction === 'next' ? 'sm:text-right sm:items-end' : ''
      }`}
    >
      <div className="eyebrow text-ink-soft">
        {direction === 'prev' ? '← Previous dispatch' : 'Next dispatch →'}
      </div>
      <div className="display text-[20px] leading-[1.2] text-ink transition-colors group-hover:text-sunset md:text-[22px]">
        {post.title}
      </div>
    </Link>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
