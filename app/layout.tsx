import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { brand } from '@/data/brand'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.seoTitle}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.seoDescription,
  keywords: [
    'Hilton Head travel',
    'Hilton Head travel consultant',
    'Hilton Head vacation planner',
    'Hilton Head itinerary',
    'Hilton Head villa rental',
    'Hilton Head golf trip',
    'Hilton Head concierge',
    'Sea Pines villa',
    'Palmetto Dunes rental',
    'Hilton Head local guide',
    'Lowcountry travel',
  ],
  authors: [{ name: brand.name, url: siteUrl }],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: brand.name,
    title: `${brand.name} — ${brand.seoTitle}`,
    description: brand.seoDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — ${brand.seoTitle}`,
    description: brand.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      style={{ '--brand-primary': brand.colors.primary } as React.CSSProperties}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
