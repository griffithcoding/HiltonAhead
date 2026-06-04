'use client';

import { useRouter } from 'next/navigation';

/**
 * Date picker for the Beach Day Planner. A client island that drives the
 * server-rendered page via the URL (`?date=YYYY-MM-DD`) so shared links SSR
 * the full plan. The page itself stays a server component.
 *
 * "Today" is computed in the Hilton Head timezone (America/New_York), not the
 * visitor's local zone, so the plan always matches island time.
 */

const HHI_TZ = 'America/New_York';

/** Format a Date as "YYYY-MM-DD" in the Hilton Head timezone. */
function isoInHHI(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: HHI_TZ }).format(d);
}

/** Today (HHI), then add `days` calendar days, returned as an ISO date. */
function isoOffsetFromToday(days: number): string {
  const todayIso = isoInHHI(new Date());
  // Anchor at noon UTC to dodge DST edge cases when adding days.
  const anchor = new Date(`${todayIso}T12:00:00Z`);
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return anchor.toISOString().slice(0, 10);
}

/** ISO date of the next Saturday (today counts if today is Saturday). */
function nextSaturdayIso(): string {
  const todayIso = isoInHHI(new Date());
  const anchor = new Date(`${todayIso}T12:00:00Z`);
  const dow = anchor.getUTCDay(); // 0 Sun … 6 Sat
  const delta = (6 - dow + 7) % 7;
  anchor.setUTCDate(anchor.getUTCDate() + delta);
  return anchor.toISOString().slice(0, 10);
}

export default function BeachDayPicker({ value }: { value: string }) {
  const router = useRouter();
  const today = isoInHHI(new Date());

  function go(iso: string) {
    router.push(`/hilton-head-beach-day-planner?date=${iso}`);
  }

  const quickButtons: ReadonlyArray<{ label: string; iso: string }> = [
    { label: 'Today', iso: today },
    { label: 'Tomorrow', iso: isoOffsetFromToday(1) },
    { label: 'This weekend', iso: nextSaturdayIso() },
  ];

  return (
    <div className="rounded-2xl border border-rule-soft bg-cream/40 px-5 py-5 md:px-6 md:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="beach-day-date"
            className="eyebrow text-ink-soft"
          >
            Pick your beach day
          </label>
          <input
            id="beach-day-date"
            type="date"
            value={value}
            min={today}
            onChange={(e) => {
              if (e.target.value) go(e.target.value);
            }}
            className="rounded-full border border-ink/20 bg-sand px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ocean-deep"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Quick date shortcuts"
        >
          {quickButtons.map((b) => {
            const active = b.iso === value;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => go(b.iso)}
                aria-pressed={active}
                className={[
                  'rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors',
                  active
                    ? 'border-ocean-deep bg-ocean-deep text-sand'
                    : 'border-rule-soft bg-transparent text-ink-soft hover:border-ocean-deep hover:text-ocean-deep',
                ].join(' ')}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
