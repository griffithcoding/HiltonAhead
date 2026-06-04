import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import CalendlyButton from '@/components/CalendlyButton';
import { brand } from '@/data/brand';
import { photos } from '@/data/photos';
import { SectionHead } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getLocalBusinessSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Hilton Ahead Travel',
  description:
    'Get in touch with Hilton Ahead. Based on Hilton Head Island, SC. We respond within one business day.',
  path: '/contact',
  keywords: [
    'contact Hilton Head travel consultant',
    'Hilton Head travel agent contact',
    'Hilton Head itinerary request',
    'Hilton Head travel planner contact',
    'Hilton Head vacation planning help',
    'Hilton Head concierge contact',
    'book a Hilton Head trip',
    'Hilton Head trip quote',
  ],
});

export default function ContactPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);
  const localBusiness = getLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Contact"
            plain="Let's talk about"
            italic="your trip."
          />
        </section>

        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <p className="dropcap max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
              The fastest way to get a quote is to fill out the itinerary
              request form. It takes about three minutes and gives us what we
              need to come back with a real plan. For everything else, email
              works.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href={brand.cta.bookingPagePath}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
              >
                {brand.cta.label}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <CalendlyButton
                url={brand.scheduling.calendly.url}
                variant="outline"
              >
                Book a call
              </CalendlyButton>
              {brand.contact.email ? (
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="link-underline text-[13px] font-medium text-ink"
                >
                  {brand.contact.email}
                </a>
              ) : null}
            </div>

            <div className="mt-14 grid grid-cols-1 gap-10 border-t border-ink/15 pt-10 sm:grid-cols-2">
              <div>
                <div className="eyebrow text-sunset">Where we work</div>
                <div className="mt-4 text-[15px] leading-[1.7] text-ink">
                  <div className="display text-[20px] text-ink">
                    {brand.legalName}
                  </div>
                  <div className="mt-1 text-ink-soft">
                    {brand.contact.location}
                  </div>
                </div>
              </div>
              <div>
                <div className="eyebrow text-sunset">Response time</div>
                <p className="mt-4 text-[14px] leading-[1.7] text-ink-soft">
                  One business day for new requests. Same-day for active
                  clients. If your trip is within a week, call it out in the
                  message and we&apos;ll prioritize.
                </p>
              </div>
            </div>
          </div>

          <figure className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image
              src={photos.boardwalk.src}
              alt={photos.boardwalk.alt}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover photo-warm"
            />
            <figcaption className="display-italic mt-3 text-[13px] text-ink-soft">
              Boardwalk to the beach, south end
            </figcaption>
          </figure>
        </div>
      </div>

      <Footer />
    </>
  );
}
