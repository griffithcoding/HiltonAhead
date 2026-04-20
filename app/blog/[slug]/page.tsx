import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import NewsletterSignup from '@/components/NewsletterSignup';
import PostBody from '@/components/PostBody';
import {
  generatePageMetadata,
  getBlogPostingSchema,
  getBreadcrumbSchema,
} from '@/app/lib/metadata';
import {
  posts,
  getPostBySlug,
  getAdjacentPosts,
  type Post,
} from '@/data/posts';

type Params = { slug: string };

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
  if (!post) return generatePageMetadata({
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <article className="mt-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-[12px] text-zinc-500"
          >
            <Link href="/" className="transition-colors hover:text-zinc-300">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/blog"
              className="transition-colors hover:text-zinc-300"
            >
              Local Guide
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-300">{post.category}</span>
          </nav>

          <header className="mx-auto mb-10 max-w-[760px]">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-primary">
              <span>{post.category}</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-zinc-500">{post.readTime} read</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <time dateTime={post.publishedAt} className="text-zinc-500">
                {formatDate(post.publishedAt)}
              </time>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <>
                  <span aria-hidden="true" className="text-zinc-700">·</span>
                  <span className="text-zinc-500">
                    Updated {formatDate(post.updatedAt)}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-[32px] leading-[1.1] tracking-[-0.02em] text-zinc-50 md:text-[44px]">
              {post.title}
            </h1>

            <p className="mt-5 text-[16px] leading-[1.6] text-zinc-400">
              {post.excerpt}
            </p>
          </header>

          <div className="mx-auto max-w-[760px]">
            <PostBody blocks={post.body} />
          </div>

          <div className="mx-auto mt-12 max-w-[760px] rounded-[20px] border border-primary/25 bg-gradient-to-br from-primary/[0.08] to-transparent p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-[18px] font-medium text-zinc-50">
                  Want this applied to your trip?
                </h2>
                <p className="mt-1.5 max-w-[420px] text-[13px] leading-[1.6] text-zinc-400">
                  The guide is free. The custom itinerary is $200 flat and
                  takes the research off your plate entirely.
                </p>
              </div>
              <Link
                href="/itinerary"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105"
              >
                Request an itinerary
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-[760px]">
            <NewsletterSignup
              variant="inline"
              source={`blog_post_${post.slug}`}
            />
          </div>

          {(prev || next) && (
            <nav
              aria-label="More posts"
              className="mx-auto mt-14 max-w-[760px] border-t border-white/10 pt-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </nav>
          )}
        </article>

        <FinalCta />
        <Footer />
      </div>
    </div>
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
      className={`group flex flex-col gap-2 rounded-[16px] border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-zinc-900/70 ${
        direction === 'next' ? 'sm:text-right' : ''
      }`}
    >
      <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
        {direction === 'prev' ? '← Previous' : 'Next →'}
      </div>
      <div className="text-[14px] font-medium leading-[1.35] text-zinc-100 transition-colors group-hover:text-white">
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
