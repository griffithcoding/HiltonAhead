import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import ItineraryForm from './ItineraryForm';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Request an Itinerary — Hilton Head Travel',
  description:
    'Tell us about your Hilton Head trip and get a custom itinerary within one business day. No obligation, no sales pitch.',
  path: '/itinerary',
  keywords: [
    'Hilton Head itinerary request',
    'Hilton Head custom trip',
    'Hilton Head vacation planner',
  ],
});

export default function ItineraryPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Request Itinerary', path: '/itinerary' },
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
            eyebrow="Request an Itinerary"
            plain="Tell us about"
            italic="your trip."
          />
          <p className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
            Three minutes of questions. One business day to a quote. No
            obligation, no sales pitch.
          </p>
        </section>

        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-20">
          <aside>
            <h2 className="eyebrow text-sunset">How it goes</h2>
            <ol className="mt-6 flex flex-col gap-8">
              {[
                {
                  title: 'You submit the form',
                  body: 'Just the basics — when, who, what kind of trip.',
                },
                {
                  title: 'We send a quote within one business day',
                  body: 'Flat fee for itineraries, % of spend for full-service group trips.',
                },
                {
                  title: 'You approve, we build',
                  body: 'Full plan delivered within 5–7 days. Revisions included.',
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[56px_1fr] items-baseline gap-4"
                >
                  <span className="section-number text-[28px] text-gold">
                    {`0${i + 1}`}
                  </span>
                  <div>
                    <div className="display text-[18px] leading-[1.2] text-ink md:text-[20px]">
                      {step.title}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Divider ornament="palmetto" className="my-10 text-gold" />

            <p className="max-w-[420px] text-[13px] leading-[1.7] text-ink-soft">
              <span className="display-italic text-ink">A small note —</span>{' '}
              every quote is flat or percentage-based, agreed up front. No
              kickbacks baked into your rates.
            </p>
          </aside>

          <div className="frame p-8 md:p-10">
            <ItineraryForm />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
