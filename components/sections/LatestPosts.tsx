import Link from 'next/link';
import { posts } from '@/data/posts';

/**
 * "Latest from the Local Guide" — homepage strip that surfaces the top
 * three featured posts and passes link equity to /blog/[slug] pages.
 */
export default function LatestPosts() {
  const featured = posts.slice(0, 3);

  return (
    <section id="local-guide" className="mt-16">
      <div className="mb-3.5 text-sm uppercase tracking-[0.15em] text-zinc-400">
        From the Local Guide
      </div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="max-w-[620px] text-[22px] font-medium tracking-tight md:text-[26px]">
          Ranked, reviewed,{' '}
          <span className="text-primary">written by someone who lives here.</span>
        </h2>
        <Link
          href="/blog"
          className="text-[13px] text-zinc-300 transition-colors hover:text-white"
        >
          See all guides
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`group flex flex-col gap-3 rounded-[18px] border bg-zinc-900/60 p-6 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-zinc-900/80 ${
              i === 0
                ? 'border-primary/30 shadow-lg shadow-primary/10'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
              <span>{post.category}</span>
              <span aria-hidden="true" className="text-zinc-700">
                ·
              </span>
              <span className="text-zinc-500">{post.readTime}</span>
            </div>
            <h3 className="text-[16px] font-semibold leading-[1.3] text-zinc-50 transition-colors group-hover:text-white">
              {post.title}
            </h3>
            <p className="text-[13px] leading-[1.6] text-zinc-400">
              {post.excerpt}
            </p>
            <span className="mt-auto pt-1 text-[12px] text-primary/80 transition-colors group-hover:text-primary">
              Read the ranking
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
