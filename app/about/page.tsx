import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import InsiderProof from '@/components/sections/InsiderProof';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'About — Local Travel Consulting for Hilton Head',
  description:
    'Hilton Ahead is a locally-run travel consulting service on Hilton Head Island. Twelve years on the island, 400+ trips planned, real relationships with the properties and restaurants.',
  path: '/about',
  keywords: [
    'Hilton Head local travel agent',
    'Hilton Head travel expert',
    'Hilton Head vacation consultant',
  ],
});

export default function AboutPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a2a_0,#081619_45%,#03090b_100%)] text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1120px] px-5 pt-8 pb-18">
        <Header />

        <header className="mt-6 mb-10 max-w-[720px]">
          <div className="mb-3 text-sm uppercase tracking-[0.15em] text-zinc-400">About</div>
          <h1 className="text-[34px] leading-[1.05] tracking-[-0.02em] text-zinc-50 md:text-[44px]">
            Travel consulting run by someone who actually{' '}
            <span className="text-primary">lives here.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
            <p>
              Most &ldquo;Hilton Head travel experts&rdquo; you&apos;ll find online are call centers in
              Orlando, Phoenix, or Salt Lake City, reading the same reviews you could
              read yourself. Hilton Ahead isn&apos;t that.
            </p>
            <p>
              We live on the island. We drive past the villas before recommending them.
              We know which Sea Pines bike path floods after a summer storm, which
              Palmetto Dunes lagoon still holds the good fish, and which Skull Creek
              table catches the last ten minutes of sunset in late July.
            </p>
            <p>
              That local depth is the only reason this service works. Google can tell
              you the top ten things to do. We can tell you which five actually match
              your group, which three are worth skipping, and which one to add that
              isn&apos;t on any list yet.
            </p>
            <h2 className="pt-4 text-[18px] font-semibold text-zinc-100">
              How we work
            </h2>
            <p>
              Every engagement starts with a 20-minute discovery call — free, no pressure.
              We figure out your dates, your group, your budget, and the kind of trip you
              actually want (a real one, not the Pinterest version). From there, we send
              a flat-fee or percentage-of-spend quote, and once you approve it, we build.
            </p>
            <p>
              For a couple doing a long weekend, that&apos;s usually a one-page itinerary,
              three dinner reservations, and a villa pick. For a 40-person wedding week,
              it&apos;s a full production plan: lodging across 8–10 properties, group
              transportation, rehearsal dinner, welcome bags, and on-island support for
              the three days you&apos;re here.
            </p>
            <p>
              Either way, you text us when something changes. We handle it.
            </p>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[18px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                What you get
              </h3>
              <ul className="mt-4 space-y-3 text-[13px] text-zinc-300">
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  <span>A real human who answers texts — same-day, seven days a week.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  <span>Rates at 60+ partner properties (villas, resorts, inns).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  <span>Reservation holds at the restaurants and tee times you can&apos;t book online.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">·</span>
                  <span>On-island support during your stay. Not a hotline — your consultant.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-[18px] border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">
                What you don&apos;t get
              </h3>
              <ul className="mt-4 space-y-3 text-[13px] text-zinc-300">
                <li className="flex gap-2">
                  <span>·</span>
                  <span>Kickback-driven recommendations. We get paid by you, not the properties.</span>
                </li>
                <li className="flex gap-2">
                  <span>·</span>
                  <span>Generic &ldquo;top 10&rdquo; lists. Your trip is built from a blank page.</span>
                </li>
                <li className="flex gap-2">
                  <span>·</span>
                  <span>A call center in another state.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <InsiderProof />
        <FinalCta />
        <Footer />
      </div>
    </div>
  );
}
