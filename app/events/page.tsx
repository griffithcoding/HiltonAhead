import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import { photos } from '@/data/photos';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getEventSchema,
} from '@/app/lib/metadata';
import {
  events,
  getHighlightEvents,
  type EventEntry,
} from '@/data/events';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Events 2026: The Local Calendar',
  description:
    "A local's calendar of Hilton Head Island events for 2026. RBC Heritage, Wine & Food Festival, Concours d'Elegance, holiday lights, and the recurring weekly programs.",
  path: '/events',
  keywords: [
    'Hilton Head events 2026',
    'Hilton Head event calendar',
    'Hilton Head festivals',
    'RBC Heritage 2026',
    'Hilton Head Wine and Food Festival',
    'Concours d’Elegance Hilton Head',
    'Harbour Town holiday lights',
    'things to do Hilton Head this month',
  ],
});

const CATEGORY_LABELS: Record<string, string> = {
  marquee: 'Marquee weeks',
  food: 'Food & wine',
  arts: 'Arts & culture',
  recurring: 'Recurring weekly',
  seasonal: 'Seasonal festivals',
  sports: 'Sports',
  holiday: 'Holiday & seasonal',
};

const CATEGORY_ORDER: Array<keyof typeof CATEGORY_LABELS> = [
  'marquee',
  'seasonal',
  'food',
  'holiday',
  'recurring',
  'arts',
  'sports',
];

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  const startD = new Date(start + 'T12:00:00');
  const endD = new Date(end + 'T12:00:00');
  // Same month and year? "Apr 13-19, 2026"
  if (
    startD.getFullYear() === endD.getFullYear() &&
    startD.getMonth() === endD.getMonth()
  ) {
    return `${startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endD.getDate()}, ${endD.getFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function EventsPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ]);

  // One Event JSON-LD per event for rich result eligibility.
  const eventSchemas = events.map((e) =>
    getEventSchema({
      name: e.name,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      locationName: e.venue || e.location,
      url: e.url,
    }),
  );

  const highlights = getHighlightEvents();

  // Group by category in our preferred display order, dropping empty groups.
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    items: events
      .filter((e) => e.category === cat)
      .sort((a, b) => a.startDate.localeCompare(b.startDate)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {eventSchemas.map((s, i) => (
        <script
          key={`evt-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft"
        >
          <Link href="/" className="transition-colors hover:text-coral">
            Home
          </Link>
          <span aria-hidden="true" className="h-px w-4 bg-ocean-deep/20" />
          <span className="text-coral">Events</span>
        </nav>

        {/* Hero */}
        <header className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <span className="eyebrow-coral eyebrow">2026 calendar</span>
            <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] tracking-[-0.025em] text-ink md:text-[64px] lg:text-[72px]">
              Hilton Head Events,{' '}
              <span className="display-italic text-coral">all year long.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              The events worth planning a trip around, the recurring summer programs,
              and the holiday traditions only locals know to time correctly. Updated
              monthly as new dates land.
            </p>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[420px]">
            <Image
              src={photos.lighthouse.src}
              alt="Hilton Head Island events at Harbour Town"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
          </figure>
        </header>

        <Divider ornament="compass" className="my-16 text-gold" />

        {/* Marquee block: the 3-4 highlight events at top */}
        <section>
          <SectionHead
            number="№ 01"
            eyebrow="Headline weeks"
            plain="The four events that"
            italic="define the calendar."
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {highlights.map((e) => (
              <HighlightCard key={e.slug} event={e} />
            ))}
          </div>
        </section>

        {/* Categorized event lists */}
        {grouped.map((group, i) => (
          <section key={group.cat} className="mt-20">
            <SectionHead
              number={`№ 0${i + 2}`}
              eyebrow={group.label}
              plain=""
              italic={`${group.items.length} ${group.items.length === 1 ? 'event' : 'events'}`}
            />
            <ul className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
              {group.items.map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
            </ul>
          </section>
        ))}

        {/* Closing CTA */}
        <section className="mx-auto mt-24 max-w-[820px] border-y border-ocean-deep/15 py-12 text-center">
          <div className="eyebrow text-coral">Plan around the calendar</div>
          <h2 className="display mt-4 text-[28px] leading-[1.1] text-ink md:text-[36px]">
            Want us to time your trip{' '}
            <span className="display-italic text-coral">around an event?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
            For Heritage week, the Wine & Food Festival, or Concours, lodging
            and dinner reservations need 4-10 months of lead time. Tell us the
            event and dates and we'll lock everything in.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 rounded-full bg-ocean px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
            >
              Request an itinerary
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/blog/best-time-to-visit-hilton-head"
              className="link-underline inline-flex items-center gap-2 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
            >
              See the weather guide ↓
            </Link>
          </div>
        </section>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}

function HighlightCard({ event }: { event: EventEntry }) {
  return (
    <article className="flex flex-col border-t border-coral/40 pt-6">
      <div className="eyebrow text-coral">
        {formatRange(event.startDate, event.endDate)}
      </div>
      <h3 className="display mt-3 text-[26px] leading-[1.12] text-ink md:text-[30px]">
        {event.name}
      </h3>
      <div className="eyebrow mt-2 text-ink-soft">{event.location}</div>
      <p className="mt-4 text-[14.5px] leading-[1.7] text-ink-soft">
        {event.description}
      </p>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-4 inline-flex items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
        >
          Official site ↗
        </a>
      )}
    </article>
  );
}

function EventRow({ event }: { event: EventEntry }) {
  return (
    <li className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[200px_minmax(0,1fr)_auto] md:gap-8 md:py-7">
      <div>
        <div className="eyebrow text-coral">
          {formatRange(event.startDate, event.endDate)}
        </div>
        <div className="mt-1 text-[12px] text-ink-soft">{event.location}</div>
      </div>
      <div>
        <h3 className="display text-[18px] leading-[1.2] text-ink md:text-[20px]">
          {event.name}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.65] text-ink-soft">
          {event.description}
        </p>
      </div>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline self-start text-[11px] font-medium uppercase tracking-[0.18em] text-ink md:self-center"
        >
          Visit site ↗
        </a>
      )}
    </li>
  );
}
