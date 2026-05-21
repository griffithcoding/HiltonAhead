import type { MetadataRoute } from 'next'
import { brand } from '@/data/brand'
import { services } from '@/data/services'
import { posts } from '@/data/posts'
import { neighborhoods } from '@/data/neighborhoods'
import { tripTypes } from '@/data/tripTypes'
import { stories } from '@/data/stories'
import { months } from '@/data/months'
import { industries } from '@/data/localBusinesses'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || brand.url

const STATIC_ROUTES: ReadonlyArray<{
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/itinerary', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/cost-of-hilton-head-trip', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/marriott-bonvoy-stays-hilton-head', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/stories', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/hilton-head-weather', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/partners', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sponsorships', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/founder', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/press', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/guides/2027-rbc-heritage', changeFrequency: 'monthly', priority: 0.85 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path === '/' ? '' : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: p.featuredOrder <= 3 ? 0.9 : 0.7,
  }))

  const neighborhoodEntries: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${BASE_URL}/hilton-head/${n.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.95, // high — these are conversion-focused SEO landing pages
  }))

  const tripTypeEntries: MetadataRoute.Sitemap = tripTypes.map((t) => ({
    url: `${BASE_URL}${t.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9, // keyword-rich trip-intent pages
  }))

  // Storied long-form pages — high editorial value, low churn.
  const storyEntries: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${BASE_URL}/stories/${s.slug}`,
    lastModified: new Date(s.updatedAt || s.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Per-month weather/travel pages — distinct ranking signals for
  // queries like "Hilton Head weather October" vs head term.
  const monthEntries: MetadataRoute.Sitemap = months.map((m) => ({
    url: `${BASE_URL}/hilton-head-weather/${m.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const serviceEntries: MetadataRoute.Sitemap = services.items.map((s) => ({
    url: `${BASE_URL}/services#${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Local business directory
  const localIndexEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/local`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
  ]

  const localIndustryEntries: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${BASE_URL}/local/${i.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88, // high — commercial intent destination pages
  }))

  return [
    ...staticEntries,
    ...postEntries,
    ...neighborhoodEntries,
    ...tripTypeEntries,
    ...storyEntries,
    ...monthEntries,
    ...serviceEntries,
    ...localIndexEntry,
    ...localIndustryEntries,
  ]
}
