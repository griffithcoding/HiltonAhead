import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import { photos } from '@/data/photos';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { posts } from '@/data/posts';

export const metadata: Metadata = generatePageMetadata({
  title: 'Local Guide: Hilton Head Island Travel Tips for 2026',
  description:
    'Local guides to Hilton Head neighborhoods, restaurants, golf, beaches, and 2026 travel tips. Ranked tier lists and honest reviews from someone who actually lives here.',
  path: '/blog',
  keywords: [
    'Hilton Head travel guide',
    'Hilton Head local guide',
    'best restaurants Hilton Head 2026',
    'Hilton Head neighborhoods',
    'Sea Pines guide',
    'Palmetto Dunes guide',
    'Hilton Head golf trip planning',
  ],
});

// Cycle through editorial photography for featured cards.
const FEATURE_PHOTOS = [
  photos.lighthouse,
  photos.villa,
  photos.boardwalk,
  photos.marsh,
  photos.dock,
  photos.beachMorning,
  photos.mossOak,
  photos.hero,
];

export default function BlogIndexPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local Guide', path: '/blog' },
  ]);

  const [featured, ...rest] = posts;
  const photoFor = (idx: number) =>
    FEATURE_PHOTOS[idx % FEATURE_PHOTOS.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Local Guide"
            plain="Written by someone who"
            italic="actually lives here."
          />
          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
            No SEO-farm junk. No &ldquo;top 25&rdquo; lists copied from the
            Visitor&apos;s Bureau. Just the real island, neighborhood by
            neighborhood, season by season, ranked tier by tier.
          </p>
        </section>

        {/* ——— Featured feature ——— */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-16 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14"
          >
            <figure className="relative aspect-[5/4] overflow-hidden rounded-md">
              <Image
                src={photoFor(0).src}
                alt={photoFor(0).alt}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover photo-warm"
                priority
              />
              <span className="absolute left-4 top-4 bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                Featured · 2026
              </span>
            </figure>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                <span className="text-sunset">{featured.category}</span>
                <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                <span>{featured.readTime} read</span>
              </div>
              <h2 className="display mt-5 text-balance text-[34px] leading-[1.05] text-ink md:text-[48px]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-[560px] text-[16px] leading-[1.7] text-ink-soft">
                {featured.excerpt}
              </p>
              <span className="link-underline mt-6 inline-block text-[12px] font-medium uppercase tracking-[0.18em] text-ink">
                Read the full ranking →
              </span>
            </div>
          </Link>
        )}

        <Divider ornament="compass" className="my-20 text-gold" />

        {/* ——— All dispatches grid ——— */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-4"
            >
              <figure className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={photoFor(i + 1).src}
                  alt={photoFor(i + 1).alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover photo-warm"
                />
              </figure>
              <div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  <span className="text-sunset">{post.category}</span>
                  <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="display mt-3 text-[22px] leading-[1.15] text-ink md:text-[24px]">
                  {post.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-sunset">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20">
          <NewsletterSignup variant="card" source="blog_index" />
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
