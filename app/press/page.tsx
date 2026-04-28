import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
} from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Press & Media — Hilton Ahead Travel Co.',
  description:
    'Hilton Ahead in the press. Editor inquiries, source requests, and partnership opportunities welcome.',
  path: '/press',
  keywords: [
    'Hilton Ahead press',
    'Hilton Head travel press',
    'Hilton Head media',
    'Hilton Head travel expert source',
  ],
});

/**
 * Press / media page.
 *
 * Today: empty logo grid + a "for editors" inquiry block. Forces Horizon 2
 * outreach to fill the grid. Once placements land, drop entries into
 * `placements` below — each renders as a quoted card with publication name,
 * headline, date, and outbound link.
 */
const placements: Array<{
  publication: string;
  headline: string;
  date: string; // ISO
  url: string;
  excerpt?: string;
}> = [];

export default function PressPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Press', path: '/press' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            number="№ 01"
            eyebrow="Press"
            plain="Hilton Head Travel,"
            italic="Reimagined."
          />
        </section>

        <div className="mt-14 max-w-[760px]">
          <p className="dropcap text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
            We work with editors, producers, and writers covering Hilton Head
            Island, Lowcountry travel, hyperlocal hospitality, and the kinds
            of trips that don&rsquo;t fit into a search box. The founder is
            available for interviews, on-record source requests, and trip
            recommendations for editorial pieces.
          </p>

          <Divider ornament="palmetto" className="my-12 text-gold" />
        </div>

        {placements.length > 0 ? (
          <section className="mt-4">
            <div className="eyebrow text-ink-soft">Featured in</div>
            <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {placements.map((p) => (
                <li
                  key={p.url}
                  className="border border-ink/15 bg-cream p-6 transition-colors hover:border-sunset"
                >
                  <div className="eyebrow text-sunset">{p.publication}</div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display mt-3 block text-[20px] leading-[1.2] text-ink hover:text-sunset md:text-[22px]"
                  >
                    {p.headline}
                  </a>
                  {p.excerpt && (
                    <p className="mt-3 text-[13px] leading-[1.65] text-ink-soft">
                      &ldquo;{p.excerpt}&rdquo;
                    </p>
                  )}
                  <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                    {new Date(p.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-16 max-w-[760px] border-y border-ink/15 py-12 md:mt-20">
          <div className="eyebrow text-sunset">For editors & producers</div>
          <h2 className="display mt-5 text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Working on a Hilton Head story?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-ink-soft md:text-[16px]">
            Source requests, pitch responses, on-record interviews, and
            background checks welcome. We&rsquo;re fastest on email — most
            inquiries get a same-day reply.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:hello@hiltonahead.com?subject=Press%20inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
            >
              Email the founder
              <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/founder"
              className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
            >
              Read the founder bio →
            </Link>
          </div>
        </section>

        <section className="mt-12 max-w-[760px] md:mt-16">
          <div className="eyebrow text-ink-soft">Quick facts</div>
          <ul className="mt-6 space-y-4 text-[14px] leading-[1.65] text-ink-soft md:text-[15px]">
            <li>
              <strong className="text-ink">Founded:</strong> Hilton Head
              Island, SC — full-time local presence since the early
              &rsquo;90s.
            </li>
            <li>
              <strong className="text-ink">Founder:</strong> William
              Griffith — Hilton Head Island resident, 255+ trips
              advised.
            </li>
            <li>
              <strong className="text-ink">Specialties:</strong> custom
              itineraries, villa booking, on-island concierge, dining and
              tee-time reservations, golf and wedding travel.
            </li>
            <li>
              <strong className="text-ink">Coverage:</strong> Hilton Head
              Island, Bluffton, Daufuskie, broader Lowcountry.
            </li>
          </ul>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
