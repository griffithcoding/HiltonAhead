'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type TripType = 'couples' | 'family' | 'golf' | 'wedding';
type Season = 'summer' | 'spring' | 'fall' | 'winter';

const TRIP_TYPE_OPTIONS: Array<{ value: TripType; label: string }> = [
  { value: 'couples', label: "Couples' getaway" },
  { value: 'family', label: 'Family vacation' },
  { value: 'golf', label: 'Golf trip' },
  { value: 'wedding', label: 'Wedding / group' },
];

const SEASON_OPTIONS: Array<{ value: Season; label: string; multiplier: number }> = [
  { value: 'summer', label: 'Summer (Jun–Aug)', multiplier: 1.35 },
  { value: 'spring', label: 'Spring (Mar–May)', multiplier: 1.1 },
  { value: 'fall',   label: 'Fall (Sep–Nov)',   multiplier: 0.95 },
  { value: 'winter', label: 'Winter (Dec–Feb)', multiplier: 0.7 },
];

/**
 * Trip Calculator — lightweight estimator.
 *
 * Inputs: party size, nights, trip type, season.
 * Output: a 3-band estimate (low / mid / high) for total trip spend,
 * plus an honest note about our fee and recommended next step.
 *
 * The math is intentionally simple and conservative. It's marketing
 * scaffolding, not a quote \u2014 the real quote comes after the form.
 */
export default function TripCalculator({ calendlyUrl }: { calendlyUrl?: string }) {
  const [tripType, setTripType] = useState<TripType>('family');
  const [partySize, setPartySize] = useState(4);
  const [nights, setNights] = useState(5);
  const [season, setSeason] = useState<Season>('fall');

  const { low, mid, high, ourFee, feeType } = useMemo(() => {
    // Baseline per-person-per-night by trip type (total spend)
    const baseline: Record<TripType, number> = {
      couples: 420,
      family: 280,
      golf: 520,
      wedding: 380,
    };
    const base = baseline[tripType];
    const multiplier = SEASON_OPTIONS.find((s) => s.value === season)?.multiplier ?? 1;
    const mid = Math.round(base * partySize * nights * multiplier);
    const low = Math.round(mid * 0.7);
    const high = Math.round(mid * 1.35);

    // Our fee: flat $200 for trips under $4k, 8% for $4k-$15k, 6% for $15k+
    let ourFee: number;
    let feeType: 'flat' | 'percent';
    if (mid < 4000) {
      ourFee = 200;
      feeType = 'flat';
    } else if (mid < 15000) {
      ourFee = Math.round(mid * 0.08);
      feeType = 'percent';
    } else {
      ourFee = Math.round(mid * 0.06);
      feeType = 'percent';
    }

    return { low, mid, high, ourFee, feeType };
  }, [tripType, partySize, nights, season]);

  const fmt = (n: number) =>
    n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

  return (
    <div className="frame p-7 md:p-9">
      <div className="eyebrow-coral eyebrow">Trip estimator</div>
      <h3 className="display mt-3 text-[24px] leading-[1.15] text-ink md:text-[32px]">
        Rough budget for{' '}
        <span className="display-italic">your Hilton Head trip.</span>
      </h3>
      <p className="mt-3 max-w-[520px] text-[13px] leading-[1.6] text-ink-soft">
        A starting-point range based on 400+ trips we&apos;ve booked. Not a
        quote — the real one comes after you fill out the itinerary form.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Trip type">
          <select
            className="calc-input"
            value={tripType}
            onChange={(e) => setTripType(e.target.value as TripType)}
          >
            {TRIP_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="When">
          <select
            className="calc-input"
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
          >
            {SEASON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Party size · ${partySize}`}>
          <input
            type="range"
            min={2}
            max={30}
            step={1}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="calc-range"
          />
        </Field>
        <Field label={`Nights · ${nights}`}>
          <input
            type="range"
            min={2}
            max={14}
            step={1}
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            className="calc-range"
          />
        </Field>
      </div>

      <div className="mt-9 border-t border-ocean-deep/15 pt-7">
        <div className="eyebrow text-ink-soft">Estimated total trip spend</div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="display text-[40px] leading-none text-ocean md:text-[52px]">
            {fmt(mid)}
          </span>
          <span className="text-[14px] text-ink-soft">
            ({fmt(low)} – {fmt(high)})
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-ocean-deep/10 pt-5 sm:grid-cols-2">
          <div>
            <div className="eyebrow text-ink-soft">Our fee</div>
            <div className="display mt-1.5 text-[22px] text-ink">
              {fmt(ourFee)}
              <span className="ml-2 text-[12px] font-normal text-ink-soft">
                {feeType === 'flat' ? 'flat' : `(~${feeType === 'percent' ? Math.round((ourFee / mid) * 100) : 0}% of total)`}
              </span>
            </div>
          </div>
          <div>
            <div className="eyebrow text-ink-soft">Typical savings through us</div>
            <div className="display mt-1.5 text-[22px] text-ocean">
              {fmt(Math.round(mid * 0.11))}
              <span className="ml-2 text-[12px] font-normal text-ink-soft">
                (~11% via partner rates)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/itinerary"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-sand transition hover:bg-coral"
        >
          Get a real quote
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        {calendlyUrl && (
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center justify-center gap-2 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-ink"
          >
            Or book a 20-min call ↗
          </a>
        )}
      </div>

      <style>{`
        .calc-input {
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(10, 41, 48, 0.25);
          background: transparent;
          padding: 0.5rem 0.25rem;
          font-size: 14px;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s ease;
          appearance: none;
        }
        .calc-input:focus { border-color: var(--coral); }
        .calc-range {
          width: 100%;
          appearance: none;
          background: transparent;
          accent-color: var(--coral);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
