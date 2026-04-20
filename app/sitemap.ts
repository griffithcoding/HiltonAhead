import type { MetadataRoute } from 'next'
import { brand } from '@/data/brand'
import { services } from '@/data/services'
import { posts } from '@/data/posts'
import { neighborhoods } from '@/data/neighborhoods'

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
  { path: '/itinerary', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
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

  const serviceEntries: MetadataRoute.Sitemap = services.items.map((s) => ({
    url: `${BASE_URL}/services#${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries, ...neighborhoodEntries, ...serviceEntries]
}
