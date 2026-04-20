import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { brand } from '@/data/brand';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact — Hilton Ahead Travel',
  description:
    'Get in touch with Hilton Ahead. Based on Hilton Head Island, SC. We respond within one business day.',
  path: '/contact',
  keywords: ['contact Hilton Head travel consultant', 'Hilton Head travel agent contact'],
});

export default function ContactPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <div className="mb-3 text-sm uppercase tracking-[0.15em] text-zinc-400">
              Contact
            </div>
            <h1 className="mb-6 text-[34px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[42px]">
              Let&apos;s talk about your <span className="text-primary">trip.</span>
            </h1>
            <p className="max-w-[560px] text-[15px] leading-[1.65] text-zinc-400">
              The fastest way to get a quote is to fill out the itinerary request form —
              it takes about three minutes and gives us what we need to come back with a
              real plan. For everything else, email works.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={brand.cta.bookingPagePath}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105"
              >
                {brand.cta.label}
                <span aria-hidden="true">→</span>
              </Link>
              {brand.contact.email ? (
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-zinc-900/80 px-[17px] py-2.5 text-[13px] text-zinc-200 transition hover:border-white/60 hover:text-white"
                >
                  {brand.contact.email}
                </a>
              ) : null}
            </div>
          </div>

          <aside className="rounded-[20px] border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-sm">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Where we work
            </h2>
            <div className="mt-4 text-[14px] leading-[1.7] text-zinc-200">
              <div className="font-medium">{brand.legalName}</div>
              <div className="text-zinc-400">{brand.contact.location}</div>
            </div>
            <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Response time
            </h3>
            <p className="mt-3 text-[13px] leading-[1.6] text-zinc-400">
              One business day for new requests. Same-day for active clients.
              If your trip is within a week, call it out in the message — we&apos;ll prioritize.
            </p>
          </aside>
        </div>

        <Footer />
      </div>
    </div>
  );
}
