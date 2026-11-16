import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import TldrBlock from '@/components/ui/TldrBlock';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import { photos } from '@/data/photos';
import { brand } from '@/data/brand';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getEventSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import {
  events2027,
  EVENTS_2027_CHECKED,
  GROUP_META,
  GROUP_ORDER,
  RUN_CLUB_URL,
  STATUS_HELP,
  STATUS_LABELS,
  getConfirmedEvents,
  getEventsByGroup,
  type Event2027,
  type Event2027Status,
} from '@/data/events2027';

const PATH = '/guides/2027-events';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Events 2027: Festivals, 5Ks, Parades & More',
  description:
    'Hilton Head event dates for 2027: RBC Heritage, Wine & Food Festival, St. Patrick’s parade, Gullah Celebration, 5Ks, art shows and Restaurant Week. Updated as dates post.',
  path: PATH,
  keywords: [
    'Hilton Head events 2027',
    'Hilton Head festivals 2027',
    'Hilton Head 5K 2027',
    'Hilton Head Restaurant Week 2027',
    'Hilton Head St. Patrick’s Day parade 2027',
    'Hilton Head Wine and Food Festival 2027',
    'Hilton Head Gullah Celebration 2027',
    'Hilton Head arts and crafts festival 2027',
  ],
});

const DOT: Record<Event2027Status, string> = {
  confirmed: 'bg-palm',
  listed: 'bg-gold',
  expected: 'bg-ink-soft/50',
};

function formatChecked(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Events2027Page() {
  const confirmed = getConfirmedEvents();
  const listed = events2027.filter((e) => e.status === 'listed').length;
  const waiting = events2027.filter((e) => e.status === 'expected').length;

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: '2027 Events Guide', path: PATH },
  ];
  const breadcrumb = getBreadcrumbSchema(crumbs);
  const speakable = getSpeakableSchema({
    url: `${siteUrl}${PATH}`,
    cssSelectors: ['.tldr-block'],
  });
  // Event JSON-LD only for dates posted by the organizer or the official
  // tourism calendar. Listed and expected dates stay out of structured data.
  const eventSchemas = confirmed.map((e) =>
    getEventSchema({
      name: e.name,
      description: e.description,
      startDate: e.startDate as string,
      endDate: e.endDate as string,
      locationName: e.location,
      url: e.officialUrl ?? e.source.url,
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
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

        <Breadcrumbs items={crumbs} className="mt-10" />

        <header className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <span className="eyebrow eyebrow-coral">2027 events guide</span>
            <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] tracking-[-0.025em] text-ink md:text-[64px] lg:text-[72px]">
              Hilton Head in 2027,{' '}
              <span className="display-italic text-coral">date by date.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
              Festivals, parades, art shows, Restaurant Week and the island 5Ks,
              with every date marked by how sure we are of it. Checked{' '}
              {formatChecked(EVENTS_2027_CHECKED)}.
            </p>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-auto md:h-full md:min-h-[420px]">
            <Image
              src={photos.dock.src}
              alt={photos.dock.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover photo-warm"
              priority
            />
          </figure>
        </header>

        <TldrBlock>
          <p>
            Confirmed 2027 dates, in order:{' '}
            {confirmed.map((e) => `${e.name} (${e.dateLabel})`).join('; ')}.{' '}
            {listed} more carry a date from a race or craft-fair listing that
            the organizer has not confirmed, and {waiting} have not posted 2027
            dates yet, so their rows show last year’s timing and are
            marked as expected.
          </p>
        </TldrBlock>

        <section aria-labelledby="how-to-read" className="mt-2 max-w-[820px]">
          <h2 id="how-to-read" className="display text-[22px] text-ink">
            How to read the dates
          </h2>
          <dl className="mt-4 grid gap-3 text-[14px] leading-[1.6] text-ink-soft">
            {(Object.keys(STATUS_LABELS) as Event2027Status[]).map((s) => (
              <div key={s} className="flex flex-wrap items-start gap-x-3 gap-y-1">
                <dt className="shrink-0">
                  <StatusPill status={s} />
                </dt>
                <dd className="min-w-0 flex-1">{STATUS_HELP[s]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Divider ornament="compass" className="my-16 text-gold" />

        {GROUP_ORDER.map((group, i) => {
          const items = getEventsByGroup(group);
          if (items.length === 0) return null;
          const meta = GROUP_META[group];
          return (
            <section key={group} className={i === 0 ? '' : 'mt-20'}>
              <SectionHead
                number={`№ 0${i + 1}`}
                eyebrow={meta.label}
                plain=""
                italic={`${items.length} ${items.length === 1 ? 'event' : 'events'}`}
              />
              {meta.intro && (
                <p className="mt-6 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft">
                  {meta.intro}
                </p>
              )}
              {group === 'running' && (
                <a
                  href={RUN_CLUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
                >
                  Hilton Head Run Club on RunSignup ↗
                </a>
              )}
              <ul className="mt-10 divide-y divide-ocean-deep/15 border-y border-ocean-deep/15">
                {items.map((e) => (
                  <EventRow key={e.slug} event={e} />
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mx-auto mt-24 max-w-[820px] border-y border-ocean-deep/15 py-12">
          <h2 className="display text-[26px] leading-[1.15] text-ink md:text-[32px]">
            How we checked these dates
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
            We start with the organizer’s own site or the island’s
            official tourism calendar. When only a race or craft-fair directory
            has a date, the row says so. When nothing is posted, we show the
            last edition’s timing and label it as an estimate, never as a
            date. Organizers change dates, so confirm before you book anything
            non-refundable.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-medium uppercase tracking-[0.18em] text-ink">
            <li>
              <Link href="/events" className="link-underline">
                2026 events calendar
              </Link>
            </li>
            <li>
              <Link href="/guides/2027-rbc-heritage" className="link-underline">
                2027 Heritage planning kit
              </Link>
            </li>
            <li>
              <Link href="/best-time-to-visit-hilton-head" className="link-underline">
                Best time to visit
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <Footer />
    </>
  );
}

function StatusPill({ status }: { status: Event2027Status }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ocean-deep/20 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink">
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function EventRow({ event }: { event: Event2027 }) {
  return (
    <li className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[210px_minmax(0,1fr)_auto] md:gap-8 md:py-7">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean-deep">
          {event.dateLabel}
        </div>
        <div className="mt-1 text-[12px] text-ink-soft">{event.location}</div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="display text-[18px] leading-[1.2] text-ink md:text-[20px]">
            {event.name}
          </h3>
          <StatusPill status={event.status} />
        </div>
        <p className="mt-2 text-[14px] leading-[1.65] text-ink-soft">
          {event.description}
        </p>
        {event.detail && (
          <p className="mt-2 text-[13.5px] leading-[1.6] text-ink">{event.detail}</p>
        )}
        {event.basis && (
          <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
            <span className="font-medium text-ink">How we estimated this: </span>
            {event.basis}
          </p>
        )}
        {event.internalLink && (
          <Link
            href={event.internalLink.href}
            className="link-underline mt-3 inline-flex text-[12px] font-medium uppercase tracking-[0.16em] text-ink"
          >
            {event.internalLink.label} →
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-2 self-start md:items-end md:self-center">
        <a
          href={event.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-ink"
          aria-label={`Source for ${event.name}: ${event.source.label}`}
        >
          Source ↗
        </a>
        {event.officialUrl && event.officialUrl !== event.source.url && (
          <a
            href={event.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-ink"
          >
            Official site ↗
          </a>
        )}
      </div>
    </li>
  );
}
