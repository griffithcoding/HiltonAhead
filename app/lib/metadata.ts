import type { Metadata } from 'next'
import { brand } from '@/data/brand'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  ogTitle?: string
  ogDescription?: string
  keywords?: string[]
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const url = `${siteUrl}${path}`
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: brand.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || title,
      description: ogDescription || description,
    },
  }
}

/**
 * JSON-LD TravelAgency schema for the homepage.
 * schema.org/TravelAgency inherits from LocalBusiness, so we include
 * address + geo so Google can attach us to the "Hilton Head, SC" map pack.
 */
export function getTravelAgencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: brand.name,
    legalName: brand.legalName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: brand.shortDescription,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hilton Head Island',
      addressRegion: 'SC',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.2163,
      longitude: -80.7526,
    },
    areaServed: [
      { '@type': 'Place', name: 'Hilton Head Island' },
      { '@type': 'Place', name: 'Bluffton' },
      { '@type': 'Place', name: 'Lowcountry' },
      { '@type': 'Place', name: 'Sea Pines' },
      { '@type': 'Place', name: 'Palmetto Dunes' },
      { '@type': 'Place', name: 'Forest Beach' },
    ],
    serviceType: [
      'Custom Itineraries',
      'Villa Booking',
      'Resort Booking',
      'Group Travel Planning',
      'Wedding Travel',
      'On-Island Concierge',
      'Dining Reservations',
      'Golf Tee Times',
    ],
    knowsAbout: [
      'Hilton Head Island',
      'Sea Pines Resort',
      'Palmetto Dunes',
      'Harbour Town Golf Links',
      'Lowcountry travel',
      'South Carolina beach vacations',
    ],
  }
}

/** JSON-LD for FAQ page */
export function getFaqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** JSON-LD BreadcrumbList */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

/** JSON-LD for a service page */
export function getServiceSchema(service: {
  name: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    provider: {
      '@type': 'TravelAgency',
      name: brand.name,
      url: siteUrl,
    },
    description: service.description,
    url: `${siteUrl}${service.path}`,
    areaServed: { '@type': 'Place', name: 'Hilton Head Island, SC' },
  }
}

/** JSON-LD BlogPosting for individual articles. */
export function getBlogPostingSchema(post: {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  keywords: string[]
}) {
  const url = `${siteUrl}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Organization', name: post.author, url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.keywords.join(', '),
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteUrl}/blog`,
      name: `${brand.name} Local Guide`,
    },
  }
}

/** JSON-LD ItemList for tier-list posts (helps rich result eligibility). */
export function getItemListSchema(
  name: string,
  items: Array<{ name: string; description?: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
    })),
  }
}
