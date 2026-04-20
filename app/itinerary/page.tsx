import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import ItineraryForm from './ItineraryForm';
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <div className="mb-3 text-sm uppercase tracking-[0.15em] text-zinc-400">
              Request an Itinerary
            </div>
            <h1 className="mb-5 text-[32px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[40px]">
              Tell us about your <span className="text-primary">trip.</span>
            </h1>
            <p className="max-w-[460px] text-[14px] leading-[1.65] text-zinc-400">
              This takes about three minutes. You&apos;ll hear back within one business day
              with a quote and a suggested next step. No obligation, no sales pitch.
            </p>

            <div className="mt-7 space-y-4 text-[13px] text-zinc-400">
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[11px] text-primary"
                >
                  1
                </span>
                <div>
                  <div className="font-medium text-zinc-200">You submit the form</div>
                  <p className="mt-1 leading-[1.5]">
                    Just the basics — when, who, what kind of trip.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[11px] text-primary"
                >
                  2
                </span>
                <div>
                  <div className="font-medium text-zinc-200">
                    We send a quote within one business day
                  </div>
                  <p className="mt-1 leading-[1.5]">
                    Flat fee for itineraries, % of spend for full-service group trips.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[11px] text-primary"
                >
                  3
                </span>
                <div>
                  <div className="font-medium text-zinc-200">You approve, we build</div>
                  <p className="mt-1 leading-[1.5]">
                    Full plan delivered within 5–7 days. Revisions included.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm md:p-8">
            <ItineraryForm />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
