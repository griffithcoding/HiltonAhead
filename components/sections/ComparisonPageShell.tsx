import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import ComparisonLanding from '@/components/sections/ComparisonLanding';
import { getComparisonBySlug } from '@/data/comparisons';
import { getComparisonSchemas } from '@/app/lib/comparisonPage';
import { notFound } from 'next/navigation';

/**
 * Page shell for comparison routes. Each individual comparison page
 * (app/hilton-head-vs-kiawah/page.tsx, etc.) is a one-line wrapper around
 * this component, passing the canonical slug.
 *
 * Responsibilities:
 *   - Look up the Comparison record from data/comparisons.ts
 *   - Emit JSON-LD (Breadcrumb, Article, FAQPage, Speakable, ItemList)
 *   - Render Header → Breadcrumb → ComparisonLanding → Footer
 *
 * If you need page-specific overrides (custom hero image, extra schema, etc.)
 * inline the layout in the page file instead of using this shell.
 */
export default function ComparisonPageShell({ slug }: { slug: string }) {
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const { breadcrumb, article, faq, speakable, itemList } =
    getComparisonSchemas(comparison);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="bg-sand min-h-screen">
        <Header />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-[1280px] items-center gap-3 px-5 pt-8 text-[12px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">{comparison.h1}</span>
        </nav>

        <ComparisonLanding comparison={comparison} />

        <Footer />
      </div>
    </>
  );
}
