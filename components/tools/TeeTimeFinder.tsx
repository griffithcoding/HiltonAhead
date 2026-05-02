'use client';

import { useMemo, useState } from 'react';
import { golfCourses, type GolfCourse } from '@/data/golfCourses';
import { withCampaignUtm, HERITAGE_2027_CAMPAIGN } from '@/app/lib/utm';

type TimeOfDay = 'morning' | 'midday' | 'afternoon';

const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: 'Morning · before 11 AM',
  midday: 'Midday · 11 AM – 2 PM',
  afternoon: 'Afternoon · after 2 PM',
};

const ACCESS_LABEL: Record<GolfCourse['access'], string> = {
  public: 'Public',
  'resort-guests': 'Resort guests',
  private: 'Private',
};

/**
 * Default date — 30 days from today, formatted YYYY-MM-DD for the
 * native <input type="date"> picker. 30 is the typical booking window
 * for a Hilton Head trip; users can adjust freely.
 */
function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * TeeTimeFinder — single-screen tee-time router.
 *
 * Pick a course, a date, a party size, and a time-of-day window. The
 * "Open booking page" button forwards the user to the chosen course's
 * official bookingUrl (UTM-tagged for attribution) in a new tab. We do
 * not inject query params per host — each course runs its own booking
 * system (Sea Pines portal, GolfNow, Foreup, direct), and guessing
 * param shapes per host risks breaking the URL. Instead, the widget
 * surfaces a "Bring this with you" summary the user can re-enter on
 * whatever page they land on.
 *
 * Embedded above the tier list via PostBody's kind: 'embed' dispatcher.
 */
export default function TeeTimeFinder() {
  const sortedCourses = useMemo(
    () => [...golfCourses].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [slug, setSlug] = useState<string>(
    () =>
      sortedCourses.find((c) => c.heritageVenue)?.slug ??
      sortedCourses[0]?.slug ??
      '',
  );
  const [date, setDate] = useState<string>(defaultDate());
  const [players, setPlayers] = useState<number>(4);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  const course = useMemo(
    () => sortedCourses.find((c) => c.slug === slug) ?? sortedCourses[0],
    [sortedCourses, slug],
  );

  const bookingHref = useMemo(() => {
    if (!course) return '#';
    return withCampaignUtm(course.bookingUrl, {
      campaign: HERITAGE_2027_CAMPAIGN,
      content: `tee_time_finder_${course.slug}`,
    });
  }, [course]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 365);
    return d.toISOString().slice(0, 10);
  }, []);

  if (!course) return null;

  return (
    <section
      className="not-prose my-12 overflow-hidden rounded-md border border-ink/15 bg-cream"
      aria-labelledby="tee-time-finder-heading"
    >
      <header className="flex flex-col gap-2 border-b border-ink/10 bg-ocean/15 px-5 py-5 md:px-7 md:py-6">
        <span className="eyebrow text-ocean-deep">Tee Time Finder</span>
        <h3
          id="tee-time-finder-heading"
          className="display text-[24px] leading-[1.1] text-ink md:text-[28px]"
        >
          Pick a course. Pick a date.{' '}
          <span className="display-italic">
            We&rsquo;ll send you to the right page.
          </span>
        </h3>
        <p className="max-w-[640px] text-[13px] leading-[1.6] text-ink-soft md:text-[14px]">
          12 courses, 12 different booking systems. Use this to land on the
          right one — your selections come with you so you can re-enter on the
          booking page in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 px-5 py-6 md:grid-cols-[1.1fr_1fr] md:gap-8 md:px-7 md:py-7">
        {/* ——— Inputs ——— */}
        <div className="flex flex-col gap-5">
          <Field label="Course">
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
            >
              {sortedCourses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} — Tier {c.tier}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-ink-soft">
              {course.designer} · {course.location} · ${course.peakFeeUsd} peak ·{' '}
              {ACCESS_LABEL[course.access]}
            </p>
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={date}
              min={today}
              max={maxDate}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
            />
          </Field>

          <Field label="Players">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPlayers(n)}
                  aria-pressed={players === n}
                  className={`min-w-[48px] rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                    players === n
                      ? 'border-ocean-deep bg-ocean-deep text-cream'
                      : 'border-ink/20 bg-cream text-ink hover:border-ink/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Time of day">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {(['morning', 'midday', 'afternoon'] as TimeOfDay[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeOfDay(t)}
                  aria-pressed={timeOfDay === t}
                  className={`rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.04em] transition ${
                    timeOfDay === t
                      ? 'border-ocean-deep bg-ocean-deep text-cream'
                      : 'border-ink/20 bg-cream text-ink hover:border-ink/40'
                  }`}
                >
                  {TIME_LABEL[t]}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* ——— Summary + CTA ——— */}
        <aside className="flex flex-col gap-4 rounded-sm border border-ocean-deep/20 bg-sand-soft p-5">
          <div className="eyebrow text-coral-deep">Bring this with you</div>
          <dl className="flex flex-col gap-3 text-[13.5px] leading-[1.5]">
            <SummaryRow label="Course" value={course.name} />
            <SummaryRow label="Date" value={prettyDate(date)} />
            <SummaryRow
              label="Party"
              value={`${players} ${players === 1 ? 'player' : 'players'}`}
            />
            <SummaryRow label="Time" value={TIME_LABEL[timeOfDay]} />
            {course.heritageVenue && (
              <SummaryRow
                label="Note"
                value="Heritage week sells out 6+ months early. Open a Sea Pines membership window if 2027."
              />
            )}
          </dl>

          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-between gap-2 rounded-full bg-ocean-deep px-5 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-ink"
          >
            Open booking page
            <span aria-hidden="true">→</span>
          </a>

          <p className="text-[11px] leading-[1.55] text-ink-soft">
            Each course runs its own tee sheet. We send you to the right
            booking page; bookings happen on the course&rsquo;s site, not here.
            Drive time from Harbour Town: {course.minutesFromHarbourTown} min.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3">
      <dt className="eyebrow text-ink-soft">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
