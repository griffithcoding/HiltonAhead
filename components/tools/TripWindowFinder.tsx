'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { months, type MonthData } from '@/data/months';

type Priority = {
  key: 'warmWater' | 'lowCrowds' | 'lowRates' | 'lowHurricaneRisk' | 'longDaylight';
  label: string;
  hint: string;
};

const PRIORITIES: Priority[] = [
  { key: 'warmWater',        label: 'Warm ocean water',     hint: 'Swimmable Atlantic'        },
  { key: 'lowCrowds',        label: 'Light crowds',          hint: 'Quiet beach + roads'      },
  { key: 'lowRates',         label: 'Low lodging rates',    hint: 'Best villa value'         },
  { key: 'lowHurricaneRisk', label: 'No hurricane risk',    hint: 'Off the storm window'     },
  { key: 'longDaylight',     label: 'Long daylight hours',  hint: 'More usable trip time'    },
];

type Weights = Record<Priority['key'], number>;

const DEFAULT_WEIGHTS: Weights = {
  warmWater: 6,
  lowCrowds: 6,
  lowRates: 5,
  lowHurricaneRisk: 4,
  longDaylight: 3,
};

function crowdScore(level: string): number {
  const l = level.toLowerCase();
  if (l.startsWith('very low')) return 1;
  if (l.startsWith('low'))      return 0.85;
  if (l.startsWith('moderate')) return 0.5;
  if (l.startsWith('heavy'))    return 0.2;
  if (l.startsWith('peak'))     return 0;
  return 0.5;
}

function parseDaylightHours(daylight: string): number {
  const match = daylight.match(/(\d+)\s*hour/i);
  const minMatch = daylight.match(/(\d+)\s*min/i);
  const hours = match ? parseInt(match[1], 10) : 12;
  const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
  return hours + mins / 60;
}

function hurricaneRiskScore(monthNumber: number): number {
  // Atlantic season Jun 1–Nov 30, peak ~Sep 10
  if (monthNumber < 6 || monthNumber > 11) return 1;
  if (monthNumber === 9) return 0;
  if (monthNumber === 8 || monthNumber === 10) return 0.25;
  if (monthNumber === 7) return 0.55;
  if (monthNumber === 6 || monthNumber === 11) return 0.75;
  return 1;
}

type Scored = {
  month: MonthData;
  score: number;
  factors: Array<{ label: string; value: number }>;
};

function scoreMonths(weights: Weights): Scored[] {
  const totalWeight =
    weights.warmWater +
    weights.lowCrowds +
    weights.lowRates +
    weights.lowHurricaneRisk +
    weights.longDaylight || 1;

  return months
    .map((m): Scored => {
      const warmWater = Math.max(0, Math.min(1, (m.waterTemp - 55) / 30));
      const lowCrowds = crowdScore(m.crowdLevel);
      const lowRates = Math.max(0, Math.min(1, (100 - m.rateIndex) / 100));
      const lowHurricaneRisk = hurricaneRiskScore(m.monthNumber);
      const daylightHours = parseDaylightHours(m.daylight);
      const longDaylight = Math.max(0, Math.min(1, (daylightHours - 10) / 4.5));

      const weighted =
        warmWater * weights.warmWater +
        lowCrowds * weights.lowCrowds +
        lowRates * weights.lowRates +
        lowHurricaneRisk * weights.lowHurricaneRisk +
        longDaylight * weights.longDaylight;

      return {
        month: m,
        score: weighted / totalWeight,
        factors: [
          { label: 'Warm water',  value: warmWater },
          { label: 'Light crowds', value: lowCrowds },
          { label: 'Low rates',    value: lowRates },
          { label: 'Hurricane-free', value: lowHurricaneRisk },
          { label: 'Daylight',     value: longDaylight },
        ],
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Trip Window Finder — interactive month-ranking tool.
 *
 * Reads from data/months.ts (no API). Five priority sliders weight
 * the per-month signals; output is a ranked top-3 with one-click
 * CTAs into /itinerary?month=<slug>.
 */
export default function TripWindowFinder() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  const ranked = useMemo(() => scoreMonths(weights), [weights]);
  const topThree = ranked.slice(0, 3);

  const setWeight = (key: Priority['key'], value: number) =>
    setWeights((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="frame p-7 md:p-9">
      <div className="eyebrow-coral eyebrow">Trip-window finder</div>
      <h3 className="display mt-3 text-[24px] leading-[1.15] text-ink md:text-[32px]">
        Find your <span className="display-italic">best week</span> on Hilton Head.
      </h3>
      <p className="mt-3 max-w-[560px] text-[13px] leading-[1.6] text-ink-soft">
        Drag the sliders to weight what matters to you. We rank all 12 months
        against your priorities, using 30-year NOAA climate data plus our
        booking-pattern records.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        {PRIORITIES.map((p) => (
          <Field key={p.key} label={`${p.label} · ${weights[p.key]}/10`} hint={p.hint}>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={weights[p.key]}
              onChange={(e) => setWeight(p.key, Number(e.target.value))}
              className="finder-range"
              aria-label={p.label}
            />
          </Field>
        ))}
      </div>

      <div className="mt-9 grid grid-cols-1 gap-4 border-t border-ocean-deep/15 pt-7 md:grid-cols-3">
        {topThree.map((entry, idx) => (
          <RankedMonth key={entry.month.slug} rank={idx + 1} entry={entry} />
        ))}
      </div>

      <p className="mt-6 text-[12px] leading-[1.6] text-ink-soft">
        Want help locking in a week? Tell us the trip and we&apos;ll map it
        against the next six months of island calendar — flat $450 itinerary,
        guide is free either way.
      </p>

      <style>{`
        .finder-range {
          width: 100%;
          appearance: none;
          background: transparent;
          accent-color: var(--coral);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">{label}</span>
      {children}
      <span className="text-[11px] leading-[1.5] text-ink-soft/80">{hint}</span>
    </label>
  );
}

function RankedMonth({ rank, entry }: { rank: number; entry: Scored }) {
  const { month, score } = entry;
  const pct = Math.round(score * 100);
  const accent =
    rank === 1 ? 'border-coral text-coral' : rank === 2 ? 'border-ocean text-ocean' : 'border-ink/40 text-ink';

  return (
    <article className={`border-l-2 ${accent} pl-5`}>
      <div className="flex items-baseline gap-3">
        <span className="section-number text-[20px] leading-none">
          {String(rank).padStart(2, '0')}
        </span>
        <h4 className="display text-[20px] leading-[1.15] text-ink md:text-[22px]">
          {month.name}
        </h4>
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        Match score · {pct}%
      </div>
      <div className="mt-2 h-1 w-full bg-ink/10">
        <div
          className="h-1 bg-coral"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-[13px] leading-[1.55] text-ink">
        {month.headline}
      </p>
      <p className="mt-2 text-[12px] leading-[1.55] text-ink-soft">
        Air {month.avgHigh}°F · Water {month.waterTemp}°F · Rates {month.rateIndex}% of July peak
      </p>
      <Link
        href={`/itinerary?month=${month.slug}`}
        className="link-underline mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
      >
        Plan a {month.name} trip
        <span aria-hidden="true">→</span>
      </Link>
      <Link
        href={`/hilton-head-weather/${month.slug}`}
        className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-coral"
      >
        Full {month.name} weather guide ↗
      </Link>
    </article>
  );
}
