import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { search } from '@/app/lib/search/engine';
import { brand } from '@/data/brand';

const TYPE_LABEL: Record<string, string> = {
  page: 'Page',
  post: 'Post',
  faq: 'FAQ',
};

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  if (!query) {
    return {
      title: 'Search',
      description: `Search ${brand.name} for posts, pages, and FAQs.`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `Search results for "${query}"`,
    description: `Results matching "${query}" across ${brand.name}.`,
    alternates: { canonical: `/search?q=${encodeURIComponent(query)}` },
    robots: { index: true, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const hits = query.length >= 2 ? search(query, { limit: 50 }) : [];

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />
      <main className="py-12">
        <header className="mb-8">
          <p className="eyebrow text-ink-soft">Search</p>
          <h1 className="display mt-1 text-[32px] leading-tight text-ink sm:text-[40px]">
            {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search Hilton Ahead'}
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            {query
              ? `${hits.length} result${hits.length === 1 ? '' : 's'}`
              : 'Type a query in the header to start.'}
          </p>
        </header>

        {query && hits.length === 0 && (
          <section className="rounded-lg border border-ink/10 bg-cream/60 p-6">
            <p className="text-[14px] text-ink">No results for &ldquo;{query}&rdquo;.</p>
            <p className="mt-2 text-[13px] text-ink-soft">Try one of these:</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[13px]">
              {['heritage', 'golf', 'beach', 'restaurants', 'oceanfront villa', 'weather'].map((s) => (
                <li key={s}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="rounded-full border border-ink/15 px-3 py-1 text-ink hover:border-ocean-mid"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hits.length > 0 && (
          <ul className="space-y-3">
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={hit.url}
                  className="block rounded-lg border border-ink/10 bg-cream p-4 transition hover:border-ocean-mid/60 hover:bg-cream/80"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                    <span>{TYPE_LABEL[hit.type] ?? hit.type}</span>
                    <span aria-hidden>·</span>
                    <span>{hit.url}</span>
                  </div>
                  <h2 className="mt-1 text-[16px] font-semibold leading-snug text-ink">{hit.title}</h2>
                  {hit.body && (
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                      {hit.body.length > 200 ? `${hit.body.slice(0, 197)}…` : hit.body}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
