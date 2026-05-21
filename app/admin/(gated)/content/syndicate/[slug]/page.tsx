/**
 * /admin/content/syndicate/[slug] — derive + render the content pack for
 * one blog post.
 *
 * Server component; admin-gated. The actual rendering of variants happens
 * inside the PackTabs client island so copy-to-clipboard works.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getPostBySlug } from '@/data/posts';
import { getAdminUser } from '@/utils/supabase/admin';
import { syndicatePost } from '@/app/lib/content/syndicate';
import PackTabs from './PackTabs';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ContentSyndicateDetailPage({ params }: PageProps) {
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const pack = syndicatePost(post);

  const platformCounts = pack.assets.reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.platform] = (acc[a.platform] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="text-ink">
      <header className="mb-8">
        <Link
          href="/admin/content/syndicate"
          className="inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-ink-soft transition hover:text-coral"
        >
          ← Syndication
        </Link>
        <div className="mt-3 eyebrow eyebrow-coral">{post.category}</div>
        <h1 className="display mt-2 text-[34px] leading-[1.1] tracking-[-0.02em]">
          {post.title}
        </h1>
        <p className="mt-3 max-w-[640px] text-[14px] leading-[1.6] text-ink-soft">
          {post.excerpt}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-ink-soft">
          <div className="flex items-center gap-2">
            <dt className="font-mono uppercase tracking-[0.12em] text-palm">
              Slug
            </dt>
            <dd className="font-mono">{post.slug}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-mono uppercase tracking-[0.12em] text-palm">
              Published
            </dt>
            <dd>{post.publishedAt}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-mono uppercase tracking-[0.12em] text-palm">
              Generated
            </dt>
            <dd className="font-mono">{pack.generatedAt}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-mono uppercase tracking-[0.12em] text-palm">
              Assets
            </dt>
            <dd>
              {pack.assets.length} ({Object.entries(platformCounts)
                .map(([p, n]) => `${p.replace('_', ' ')} ×${n}`)
                .join(', ')})
            </dd>
          </div>
        </dl>
      </header>

      <PackTabs pack={pack} />

      <footer className="mt-12 border-t border-ocean-deep/10 pt-6 text-[12px] text-ink-soft">
        These drafts are starting points. Edit before publishing. To
        regenerate every post pack to disk, run{' '}
        <code className="rounded-sm bg-sand-deep px-1.5 py-0.5 font-mono text-[11px]">
          npx tsx scripts/syndicate-all.ts
        </code>
        .
      </footer>
    </div>
  );
}
