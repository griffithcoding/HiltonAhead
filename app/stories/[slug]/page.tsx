import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryPage from '@/components/sections/StoryPage';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getStoryArticleSchema,
} from '@/app/lib/metadata';
import { getStoryBySlug, stories } from '@/data/stories';

interface Params {
  slug: string;
}

export function generateStaticParams(): Array<Params> {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return generatePageMetadata({
    title: story.seoTitle,
    description: story.metaDescription,
    path: `/stories/${story.slug}`,
    keywords: story.keywords,
    ogImage: story.cover.src,
    ogImageAlt: story.cover.alt,
  });
}

export default async function StoryRoute(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Stories', path: '/stories' },
    { name: story.title.plain.replace(/[,.]$/, ''), path: `/stories/${story.slug}` },
  ]);
  const article = getStoryArticleSchema({
    slug: story.slug,
    title: story.seoTitle,
    description: story.metaDescription,
    publishedAt: story.publishedAt,
    updatedAt: story.updatedAt,
    imageUrl: story.cover.src,
    imageAlt: story.cover.alt,
    keywords: story.keywords,
    articleSection: story.articleSection,
  });

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
      <StoryPage story={story} />
    </>
  );
}
