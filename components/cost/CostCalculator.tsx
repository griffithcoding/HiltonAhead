'use client';

import { useState, useMemo } from 'react';
import {
  LODGING_TIERS,
  SEASON_MULTIPLIERS,
  ACTIVITY_INTENSITIES,
  FOOD_TIERS,
  TRANSPORT_OPTIONS,
  PER_TRIP_EXTRAS,
  type LodgingTier,
  type SeasonMultiplier,
  type ActivityIntensity,
  type FoodTier,
  type TransportOption,
} from '@/data/costEstimates';

/**
 * Interactive cost calculator for /cost-of-hilton-head-trip.
 *
 * Math is transparent on purpose — readers see exactly what goes into the
 * estimate. The brand voice is "honest local read"; a black-box calculator
 * would undercut that.
 *
 * Output: low / mid / high estimate (the spread captures how property
 * choice, restaurant choice, and activity choice vary within a tier).
 */
export default function CostCalculator() {
  const [partySize, setPartySize] = useState(4);
  const [nights, setNights] = useState(7);
  const [lodgingId, setLodgingId] = useState<LodgingTier['id']>('standard');
  const [seasonId, setSeasonId] = useState<SeasonMultiplier['id']>('shoulder');
  const [foodId, setFoodId] = useState<FoodTier['id']>('mixed');
  const [activityId, setActivityId] = useState<ActivityIntensity['id']>('moderate');
  const [transportId, setTransportId] = useState<TransportOption['id']>('drive-own');

  const lodging = LODGING_TIERS.find((t) => t.id === lodgingId)!;
  const season = SEASON_MULTIPLIERS.find((s) => s.id === seasonId)!;
  const food = FOOD_TIERS.find((f) => f.id === foodId)!;
  const activity = ACTIVITY_INTENSITIES.find((a) => a.id === activityId)!;
  const transport = TRANSPORT_OPTIONS.find((t) => t.id === transportId)!;

  const totals = useMemo(() => {
    // Lodging: nightly tier × nights × season multiplier × taxes/fees + cleaning
    const lodgingLow =
      lodging.nightlyMin * nights * season.multiplier *
        PER_TRIP_EXTRAS.taxesAndFeesMultiplier +
      PER_TRIP_EXTRAS.cleaningFee.min;
    const lodgingMid =
      ((lodging.nightlyMin + lodging.nightlyMax) / 2) *
        nights *
        season.multiplier *
        PER_TRIP_EXTRAS.taxesAndFeesMultiplier +
      PER_TRIP_EXTRAS.cleaningFee.mid;
    const lodgingHigh =
      lodging.nightlyMax * nights * season.multiplier *
        PER_TRIP_EXTRAS.taxesAndFeesMultiplier +
      PER_TRIP_EXTRAS.cleaningFee.max;

    // Food: per person per day × party × nights (assume meals tied to nights, +1 day)
    const days = nights + 1;
    const foodTotal = food.perPersonPerDay * partySize * days;
    // Light/heavy spread around food estimate (±25%)
    const foodLow = foodTotal * 0.75;
    const foodHigh = foodTotal * 1.25;

    // Activities: per person per day × party × days
    const activityTotal = activity.perPersonPerDay * partySize * days;
    const activityLow = activityTotal * 0.7;
    const activityHigh = activityTotal * 1.3;

    // Transport: scale flights by party size, drives by household
    let transportMin = transport.costMin;
    let transportMid = transport.costMid;
    let transportMax = transport.costMax;
    if (transport.id === 'fly-and-rent' || transport.id === 'fly-and-rideshare') {
      // Flights scale per person; rental/rideshare is per-household; rough split:
      // 60% per-person (flights) + 40% per-household (car/rideshare)
      transportMin = transport.costMin * 0.4 + transport.costMin * 0.6 * (partySize / 4);
      transportMid = transport.costMid * 0.4 + transport.costMid * 0.6 * (partySize / 4);
      transportMax = transport.costMax * 0.4 + transport.costMax * 0.6 * (partySize / 4);
    }

    const total = {
      low: Math.round(lodgingLow + foodLow + activityLow + transportMin),
      mid: Math.round(lodgingMid + foodTotal + activityTotal + transportMid),
      high: Math.round(lodgingHigh + foodHigh + activityHigh + transportMax),
    };

    const perPerson = {
      low: Math.round(total.low / partySize),
      mid: Math.round(total.mid / partySize),
      high: Math.round(total.high / partySize),
    };

    const perPersonPerDay = {
      mid: Math.round(total.mid / partySize / days),
    };

    return {
      total,
      perPerson,
      perPersonPerDay,
      breakdown: {
        lodging: { low: Math.round(lodgingLow), mid: Math.round(lodgingMid), high: Math.round(lodgingHigh) },
        food: { low: Math.round(foodLow), mid: Math.round(foodTotal), high: Math.round(foodHigh) },
        activities: { low: Math.round(activityLow), mid: Math.round(activityTotal), high: Math.round(activityHigh) },
        transport: { low: Math.round(transportMin), mid: Math.round(transportMid), high: Math.round(transportMax) },
      },
    };
  }, [partySize, nights, lodging, season, food, activity, transport]);

  return (
    <div className="my-12 rounded-2xl border border-rule-soft bg-sand-soft/40 p-6 md:my-16 md:p-10">
      <header className="mb-8">
        <span className="eyebrow text-coral">Estimate your trip</span>
        <h2 className="display mt-2 text-[28px] leading-[1.1] text-ink md:text-[34px]">
          What will a Hilton Head trip{' '}
          <span className="display-italic">actually cost?</span>
        </h2>
        <p className="mt-4 max-w-[640px] text-[15px] leading-[1.65] text-ink-soft">
          Pick the inputs that match your trip and we&rsquo;ll compute a
          realistic low / mid / high range. The math is shown below — no
          black box.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Party size */}
        <Field label="Party size" hint={`${partySize} ${partySize === 1 ? 'person' : 'people'}`}>
          <input
            type="range"
            min={1}
            max={12}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="w-full accent-coral"
            aria-label="Party size"
          />
        </Field>

        {/* Nights */}
        <Field label="Length of trip" hint={`${nights} ${nights === 1 ? 'night' : 'nights'}`}>
          <input
            type="range"
            min={2}
            max={14}
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            className="w-full accent-coral"
            aria-label="Trip length in nights"
          />
        </Field>

        {/* Lodging tier */}
        <Field label="Lodging" hint={`${lodging.label} — $${lodging.nightlyMin}–${lodging.nightlyMax}/night`}>
          <SelectGroup
            value={lodgingId}
            onChange={(v) => setLodgingId(v as LodgingTier['id'])}
            options={LODGING_TIERS.map((t) => ({ value: t.id, label: t.label }))}
          />
          <p className="mt-2 text-[12px] leading-snug text-ink-soft/80">
            <em>{lodging.example}</em>
          </p>
        </Field>

        {/* Season */}
        <Field label="When you’ll go" hint={season.detail}>
          <SelectGroup
            value={seasonId}
            onChange={(v) => setSeasonId(v as SeasonMultiplier['id'])}
            options={SEASON_MULTIPLIERS.map((s) => ({ value: s.id, label: s.label }))}
          />
        </Field>

        {/* Food */}
        <Field label="Food approach" hint={food.detail}>
          <SelectGroup
            value={foodId}
            onChange={(v) => setFoodId(v as FoodTier['id'])}
            options={FOOD_TIERS.map((f) => ({ value: f.id, label: f.label }))}
          />
        </Field>

        {/* Activities */}
        <Field label="Activity load" hint={activity.detail}>
          <SelectGroup
            value={activityId}
            onChange={(v) => setActivityId(v as ActivityIntensity['id'])}
            options={ACTIVITY_INTENSITIES.map((a) => ({ value: a.id, label: a.label }))}
          />
        </Field>

        {/* Transport */}
        <Field label="Getting there" hint={transport.detail}>
          <SelectGroup
            value={transportId}
            onChange={(v) => setTransportId(v as TransportOption['id'])}
            options={TRANSPORT_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
          />
        </Field>
      </div>

      {/* Result */}
      <div className="mt-10 rounded-xl border border-ocean-deep/15 bg-cream/60 p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="eyebrow text-sunset">Total trip cost (estimated range)</span>
            <p className="display mt-2 text-[28px] leading-none text-ink md:text-[40px]">
              ${totals.total.low.toLocaleString()}–${totals.total.high.toLocaleString()}
            </p>
            <p className="mt-1 text-[14px] text-ink-soft">
              Mid estimate <strong>${totals.total.mid.toLocaleString()}</strong> · roughly{' '}
              ${totals.perPersonPerDay.mid.toLocaleString()}/person/day
            </p>
          </div>
          <div className="text-[13px] text-ink-soft/80">
            ${totals.perPerson.low.toLocaleString()}–${totals.perPerson.high.toLocaleString()} per person
          </div>
        </div>

        <hr className="my-6 border-rule-soft" />

        <h3 className="eyebrow mb-4 text-ink">Where the money goes (mid estimate)</h3>
        <ul className="grid grid-cols-1 gap-3 text-[14px] md:grid-cols-2">
          <Line
            label="Lodging"
            mid={totals.breakdown.lodging.mid}
            note={`${nights} nights × ${lodging.label}, ${season.label.toLowerCase()}, +14% taxes/fees`}
          />
          <Line
            label="Food"
            mid={totals.breakdown.food.mid}
            note={`${food.label} × ${partySize} × ${nights + 1} days`}
          />
          <Line
            label="Activities"
            mid={totals.breakdown.activities.mid}
            note={`${activity.label} × ${partySize} × ${nights + 1} days`}
          />
          <Line
            label="Transport"
            mid={totals.breakdown.transport.mid}
            note={transport.label}
          />
        </ul>
      </div>

      <p className="mt-6 text-[12px] leading-snug text-ink-soft/70">
        Estimates use 2026 partner-rate ranges (25th–75th percentile of what
        we actually book). Real quotes vary with specific property, exact
        dates, and group composition. Want a real quote? The{' '}
        <a href="/itinerary" className="link-underline text-coral hover:text-sunset">
          itinerary form
        </a>{' '}
        comes back with one inside one business day.
      </p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="eyebrow block text-ink">{label}</label>
      {hint && <p className="mt-1 text-[12px] text-ink-soft/80">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SelectGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            'rounded-full border px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition',
            value === o.value
              ? 'border-ink bg-ink text-sand'
              : 'border-rule-soft bg-cream text-ink-soft hover:border-ink/40 hover:text-ink',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Line({
  label,
  mid,
  note,
}: {
  label: string;
  mid: number;
  note: string;
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-rule-soft pb-2 last:border-b-0">
      <div>
        <span className="font-semibold text-ink">{label}</span>
        <span className="ml-2 text-[12px] text-ink-soft/80">{note}</span>
      </div>
      <span className="tabular-nums text-ink">
        ${mid.toLocaleString()}
      </span>
    </li>
  );
}
