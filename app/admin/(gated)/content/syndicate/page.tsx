/**
 * /admin/content/syndicate — list of all blog posts with a per-row
 * "Syndicate" action that opens the per-post derivation view.
 *
 * Server component, admin-gated. Source of truth is data/posts.ts; this
 * page just lists what's there. When the parallel blog-posts agent ships
 * new entries (featuredOrder >= 100), they show up here automatically.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { posts } from '@/data/posts';
import { getAdminUser } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function ContentSyndicateIndexPage() {
  // (gated) layout already guards navigation, but every server-rendered admin
  // surface re-asserts so direct POSTs / RSC fetches stay protected.
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const sorted = [...posts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  return (
    <div className="text-ink">
      <header className="mb-8">
        <div className="eyebrow eyebrow-coral">Content Ops</div>
        <h1 className="display mt-2 text-[40px] leading-[1.05] tracking-[-0.02em]">
          Syndication engine
        </h1>
        <p className="mt-3 max-w-[640px] text-[14px] leading-[1.6] text-ink-soft">
          Pick a blog post to derive a multi-platform content pack: Instagram
          carousels and reels, LinkedIn, Pinterest, Reddit, newsletter teaser,
          Twitter thread, and a Facebook group post. Each pack is a draft —
          review and edit before scheduling.
        </p>
      </header>

      <div className="overflow-hidden rounded-sm border border-ocean-deep/10 bg-sand-soft">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-ocean-deep/10 bg-sand-deep/30 text-left text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post) => (
              <tr
                key={post.slug}
                className="border-b border-ocean-deep/5 transition hover:bg-sand-deep/20"
              >
                <td className="px-4 py-3 font-mono text-[12px] text-ink-soft">
                  {post.slug}
                </td>
                <td className="px-4 py-3 max-w-[340px]">
                  <div className="font-semibold text-ink">{post.title}</div>
                  <div className="mt-0.5 line-clamp-1 text-[12px] text-ink-soft">
                    {post.excerpt}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-palm/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-palm">
                    {post.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {formatDate(post.publishedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/content/syndicate/${post.slug}`}
                    className="inline-flex items-center rounded-sm border border-ocean-deep/30 bg-sand px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ocean-deep transition hover:border-coral hover:text-coral-deep"
                  >
                    Syndicate
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-[640px] text-[12px] leading-[1.6] text-ink-soft">
        Tip: to regenerate every pack to disk in one go, run{' '}
        <code className="rounded-sm bg-sand-deep px-1.5 py-0.5 font-mono text-[11px]">
          npx tsx scripts/syndicate-all.ts
        </code>{' '}
        from the repo root. Output lives in{' '}
        <code className="rounded-sm bg-sand-deep px-1.5 py-0.5 font-mono text-[11px]">
          docs/sales-ops/content-calendar/derived/
        </code>
        .
      </p>
    </div>
  );
}
