import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { brand } from '@/data/brand';
import { services } from '@/data/services';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getServiceSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Services — Hilton Head Travel Consulting',
  description:
    'Custom itineraries, villa booking, group trips, on-island concierge, and hard-to-get reservations for Hilton Head Island.',
  path: '/services',
  keywords: [
    'Hilton Head itinerary planning',
    'Hilton Head villa rental',
    'Hilton Head group travel',
    'Hilton Head concierge',
    'Hilton Head tee times',
    'Hilton Head dinner reservations',
  ],
});

export default function ServicesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  const serviceSchemas = services.items.map((s) =>
    getServiceSchema({
      name: s.title,
      description: s.body,
      path: `/services#${s.slug}`,
    }),
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {serviceSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <header className="mt-6 mb-10 max-w-[680px]">
          <div className="mb-3 text-sm uppercase tracking-[0.15em] text-zinc-400">
            Services
          </div>
          <h1 className="text-[34px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[44px]">
            Everything we do for you, in <span className="text-primary">one place.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.6] text-zinc-400">
            Hilton Head is deceptively big. Twelve square miles of neighborhoods, three
            major resorts, five championship golf courses, and a hundred restaurants that
            range from white-linen to barefoot-on-a-deck. Here&apos;s how we navigate it for you.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.items.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="flex scroll-mt-24 flex-col gap-4 rounded-[20px] border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-sm"
            >
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-zinc-800/90 text-[24px]"
              >
                {item.icon}
              </div>
              <h2 className="text-[20px] font-semibold text-zinc-50">{item.title}</h2>
              <p className="text-[14px] leading-[1.65] text-zinc-400">{item.body}</p>
              <Link
                href={brand.cta.bookingPagePath}
                className="mt-2 inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-zinc-950/70 px-4 py-2 text-[12px] text-zinc-200 transition hover:border-primary/60 hover:text-white"
              >
                Request this
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <FinalCta />
        <Footer />
      </div>
    </div>
  );
}
