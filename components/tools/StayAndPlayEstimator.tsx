'use client';

import { useMemo, useState } from 'react';
import { golfCourses } from '@/data/golfCourses';

type Lodging = 'villa' | 'resort' | 'boutique';
type Window = 'shoulder' | 'peak' | 'heritage';

const LODGING_NIGHTLY: Record<Lodging, number> = {
  villa: 425,
  resort: 525,
  boutique: 695,
};

const WINDOW_MULT: Record<Window, number> = {
  shoulder: 0.85,
  peak: 1.0,
  heritage: 1.6,
};

const LODGING_LABEL: Record<Lodging, string> = {
  villa: 'Villa rental',
  resort: 'Resort property',
  boutique: 'Boutique / Montage',
};
const WINDOW_LABEL: Record<Window, string> = {
  shoulder: 'Shoulder (Jan–Feb, Aug, Nov)',
  peak: 'Peak (Mar–May, Oct)',
  heritage: 'RBC Heritage week (Apr 12–18, 2027)',
};

const AVG_PEAK_FEE =
  golfCourses.reduce((s, c) => s + c.peakFeeUsd, 0) / golfCourses.length;
const AVG_STAY_PLAY_FEE =
  golfCourses.reduce((s, c) => s + c.stayAndPlayFeeUsd, 0) / golfCourses.length;

function dollars(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

export default function StayAndPlayEstimator() {
  const [golfers, setGolfers] = useState(4);
  const [nights, setNights] = useState(4);
  const [rounds, setRounds] = useState(3);
  const [lodging, setLodging] = useState<Lodging>('villa');
  const [travelWindow, setTravelWindow] = useState<Window>('peak');

  const result = useMemo(() => {
    const mult = WINDOW_MULT[travelWindow];
    const teeRetail = AVG_PEAK_FEE * rounds * golfers * mult;
    const teeStayPlay = AVG_STAY_PLAY_FEE * rounds * golfers * mult;
    const cart = 35 * rounds * golfers;
    const lodgingCost = LODGING_NIGHTLY[lodging] * nights * mult;
    const dineLow = 65 * nights * golfers;
    const dineHigh = 125 * nights * golfers;

    const retailTotal = teeRetail + cart + lodgingCost + dineLow;
    const retailHigh = teeRetail + cart + lodgingCost + dineHigh;
    const packageTotal = teeStayPlay + cart + lodgingCost + dineLow;
    const packageHigh = teeStayPlay + cart + lodgingCost + dineHigh;

    return {
      retailLow: retailTotal,
      retailHigh,
      packageLow: packageTotal,
      packageHigh,
      savings: retailTotal - packageTotal,
      perGolferPackage: packageTotal / golfers,
    };
  }, [golfers, nights, rounds, lodging, travelWindow]);

  const itineraryQs = new URLSearchParams({
    source: 'stay-and-play',
    golfers: String(golfers),
    nights: String(nights),
    rounds: String(rounds),
    lodging,
    window: travelWindow,
  }).toString();

  return (
    <section className="not-prose my-12 rounded-md border border-ocean-deep/20 bg-cream-deep/30 p-6 md:p-8">
      <header>
        <div className="eyebrow text-coral">Stay-and-play · estimator</div>
        <h3 className="display mt-2 text-[24px] leading-[1.15] text-ink md:text-[28px]">
          What will the trip actually cost?
        </h3>
        <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-ink-soft">
          Rough math using average green fees across the 12 courses, typical
          lodging rates, and seasonal multipliers. Real numbers vary; the
          itinerary service prices to the dollar.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <SliderField
          label={`Golfers — ${golfers}`}
          min={2}
          max={12}
          value={golfers}
          onChange={setGolfers}
        />
        <SliderField
          label={`Nights — ${nights}`}
          min={2}
          max={7}
          value={nights}
          onChange={setNights}
        />
        <SliderField
          label={`Rounds of golf — ${rounds}`}
          min={1}
          max={5}
          value={rounds}
          onChange={setRounds}
        />
        <ChoiceField
          label="Lodging style"
          value={lodging}
          options={Object.entries(LODGING_LABEL) as [Lodging, string][]}
          onChange={setLodging}
        />
        <div className="md:col-span-2">
          <ChoiceField
            label="Travel window"
            value={travelWindow}
            options={Object.entries(WINDOW_LABEL) as [Window, string][]}
            onChange={setTravelWindow}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-ocean-deep/15 pt-6 md:grid-cols-2">
        <Result
          label="Retail (separate booking)"
          low={result.retailLow}
          high={result.retailHigh}
          tone="muted"
        />
        <Result
          label="Stay-and-play package"
          low={result.packageLow}
          high={result.packageHigh}
          tone="primary"
          footer={`≈ ${dollars(result.perGolferPackage)} per golfer · saves ${dollars(
            result.savings,
          )} vs. retail`}
        />
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[440px] text-[12px] leading-[1.55] text-ink-soft">
          Rough estimate. Includes tee fees, carts, lodging, and 1–2 nights of
          dining at $65–$125 per golfer. Excludes flights, transfers, and tip.
        </p>
        <a
          href={`/itinerary?${itineraryQs}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink bg-ink px-5 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-cream transition hover:bg-coral hover:border-coral"
        >
          Have us book it · $450
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

function Result({
  label,
  low,
  high,
  tone,
  footer,
}: {
  label: string;
  low: number;
  high: number;
  tone: 'primary' | 'muted';
  footer?: string;
}) {
  const isPrimary = tone === 'primary';
  return (
    <div
      className={`rounded-md border p-5 ${
        isPrimary
          ? 'border-coral bg-coral/5'
          : 'border-ink/15 bg-cream'
      }`}
    >
      <div className={`eyebrow ${isPrimary ? 'text-coral' : 'text-ink-soft'}`}>
        {label}
      </div>
      <p className="display mt-2 text-[26px] leading-[1.05] text-ink md:text-[30px]">
        {dollars(low)} – {dollars(high)}
      </p>
      <p className="mt-1 text-[11.5px] uppercase tracking-[0.12em] text-ink-soft">
        Group total · all-in
      </p>
      {footer && (
        <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-soft">
          {footer}
        </p>
      )}
    </div>
  );
}

function ChoiceField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<readonly [T, string]>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map(([v, l]) => {
          const selected = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={selected}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${
                selected
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/25 bg-cream text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SliderField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </legend>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-coral"
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </fieldset>
  );
}
