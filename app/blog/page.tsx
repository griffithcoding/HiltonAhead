import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import { posts } from '@/data/posts';

export const metadata: Metadata = generatePageMetadata({
  title: 'Local Guide — Hilton Head Island Travel Tips for 2026',
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

export default function BlogIndexPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Local Guide', path: '/blog' },
  ]);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <header className="mt-6 mb-10 max-w-[680px]">
          <div className="mb-3 text-sm uppercase tracking-[0.15em] text-zinc-400">
            Local Guide
          </div>
          <h1 className="text-[34px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[44px]">
            Written by someone who{' '}
            <span className="text-primary">actually lives here.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.65] text-zinc-400">
            No SEO-farm junk. No &ldquo;top 25&rdquo; lists copied from the
            Visitor&apos;s Bureau. Just the real island — neighborhood by
            neighborhood, season by season, ranked tier by tier.
          </p>
        </header>

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 block overflow-hidden rounded-[22px] border border-primary/30 bg-gradient-to-br from-primary/[0.12] via-zinc-900/60 to-zinc-950/80 p-8 shadow-xl shadow-primary/10 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-primary/20"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.15em]">
                <span className="rounded-full bg-primary px-2.5 py-0.5 font-semibold text-black">
                  Featured · 2026
                </span>
                <span className="text-primary">{featured.category}</span>
                <span className="text-zinc-600" aria-hidden>
                  ·
                </span>
                <span className="text-zinc-500">
                  {featured.readTime} read
                </span>
              </div>
              <h2 className="max-w-[760px] text-[26px] leading-[1.2] tracking-[-0.01em] text-zinc-50 transition-colors group-hover:text-white md:text-[32px]">
                {featured.title}
              </h2>
              <p className="max-w-[720px] text-[14px] leading-[1.6] text-zinc-300">
                {featured.excerpt}
              </p>
              <div className="text-[13px] font-medium text-primary transition-colors group-hover:text-white">
                Read the full ranking
                <span aria-hidden="true" className="ml-1.5">
                  →
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-[18px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-zinc-900/80"
            >
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
                <span>{post.category}</span>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <span className="text-zinc-500">{post.readTime}</span>
              </div>
              <h3 className="text-[17px] font-semibold leading-[1.3] text-zinc-50 transition-colors group-hover:text-white">
                {post.title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-zinc-400">
                {post.excerpt}
              </p>
              <span className="mt-auto pt-1 text-[12px] text-zinc-500 transition-colors group-hover:text-zinc-300">
                /blog/{post.slug}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <NewsletterSignup variant="card" source="blog_index" />
        </div>

        <FinalCta />
        <Footer />
      </div>
    </div>
  );
}
