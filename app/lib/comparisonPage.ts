import type { Metadata } from 'next';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getItemListSchema,
  getSpeakableSchema,
  getStoryArticleSchema,
} from '@/app/lib/metadata';
import type { Comparison } from '@/data/comparisons';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || brand.url;
const PUBLISHED_AT = '2026-05-24';
const UPDATED_AT = '2026-05-24';

/**
 * Build Next.js metadata for a comparison page from the Comparison record.
 */
export function getComparisonMetadata(comparison: Comparison): Metadata {
  return generatePageMetadata({
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    path: `/${comparison.slug}`,
    keywords: comparison.keywords ? [...comparison.keywords] : undefined,
  });
}

/**
 * Bundle all JSON-LD blocks a comparison page emits:
 *   - BreadcrumbList
 *   - Article (the comparison itself, framed as editorial)
 *   - FAQPage
 *   - Speakable (TL;DR + FAQ answers + verdict cards)
 *   - ItemList (the options being compared)
 */
export function getComparisonSchemas(comparison: Comparison) {
  const url = `${SITE_URL}/${comparison.slug}`;

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/' },
    { name: comparison.h1, path: `/${comparison.slug}` },
  ]);

  // Reuse the story-article shape but point it at the comparison route.
  // The schema helper accepts any slug + URL via its existing surface; we
  // pass slug-as-comparison and override nothing else. The result is a
  // valid Article with hiltonahead.com as the publisher.
  const article = {
    ...getStoryArticleSchema({
      slug: comparison.slug,
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      publishedAt: PUBLISHED_AT,
      updatedAt: UPDATED_AT,
      keywords: comparison.keywords ? [...comparison.keywords] : [],
      articleSection: 'Comparison',
    }),
    // Re-point the @id / url to the actual comparison route (not /stories/…)
    '@id': url,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const faq = getFaqSchema(comparison.faqs);

  const speakable = getSpeakableSchema({
    url,
    cssSelectors: ['.tldr-block', '.quick-fact', '.faq-answer'],
  });

  const itemList = getItemListSchema(
    comparison.h1,
    comparison.options.map((o) => ({
      name: o.name,
      description: o.subtitle,
    })),
  );

  return { breadcrumb, article, faq, speakable, itemList };
}
