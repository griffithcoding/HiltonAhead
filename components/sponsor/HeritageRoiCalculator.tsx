'use client';

import { useMemo, useState } from 'react';
import { HERITAGE_AUDIENCE } from '@/data/heritageSponsors';

const SPONSOR_FEE = 5000;

function dollars(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

/**
 * Rough Heritage Week ROI calculator.
 *
 * Inputs: avg customer ticket, expected conversion %.
 * Output: estimated revenue from each audience pool, plus break-even
 * customer count. Numbers are guidance only — caveated in the UI.
 */
export default function HeritageRoiCalculator() {
  const [ticket, setTicket] = useState(2500);
  const [conversionPct, setConversionPct] = useState(0.5);

  const result = useMemo(() => {
    const conv = conversionPct / 100;
    const kitRevenue = HERITAGE_AUDIENCE.kitSubscribersTarget * conv * ticket;
    const orgRevenue = HERITAGE_AUDIENCE.organicMonthlyVisitors * conv * ticket * 0.4;
    const total = kitRevenue + orgRevenue;
    const breakEven = Math.ceil(SPONSOR_FEE / Math.max(ticket, 1));
    return { kitRevenue, orgRevenue, total, breakEven };
  }, [ticket, conversionPct]);

  return (
    <section className="my-10 rounded-md border border-ocean-deep/20 bg-cream-deep/30 p-6 md:p-8">
      <header>
        <div className="eyebrow text-coral">ROI · rough estimate</div>
        <h3 className="display mt-2 text-[24px] leading-[1.15] text-ink md:text-[28px]">
          Will it pay back?
        </h3>
        <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-ink-soft">
          Plug in your average customer ticket and conversion rate. We pull
          audience numbers from kit subscribers + April organic visitors.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <SliderField
          label={`Average customer ticket — ${dollars(ticket)}`}
          min={500}
          max={15000}
          step={250}
          value={ticket}
          onChange={setTicket}
        />
        <SliderField
          label={`Conversion rate — ${conversionPct.toFixed(2)}%`}
          min={0.1}
          max={3}
          step={0.05}
          value={conversionPct}
          onChange={setConversionPct}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label="From kit subscribers" value={dollars(result.kitRevenue)} />
        <Stat label="From April organic" value={dollars(result.orgRevenue)} />
        <Stat
          label="Estimated revenue"
          value={dollars(result.total)}
          highlight
        />
      </div>

      <div className="mt-6 rounded-md border border-coral/30 bg-coral/5 p-4">
        <div className="text-[12px] leading-[1.5] text-ink-soft">
          Break-even at <strong className="text-ink">{result.breakEven}</strong>{' '}
          customer{result.breakEven === 1 ? '' : 's'} ·{' '}
          {dollars(SPONSOR_FEE)} sponsor fee · 4-slot category exclusivity
        </div>
      </div>

      <p className="mt-4 max-w-[640px] text-[11.5px] leading-[1.55] text-ink-soft">
        Rough estimate. Audience numbers are forecasts based on prior April
        traffic patterns. Actual performance depends on your offer, asset
        quality, and category. Conversion ranges of 0.3%–1.2% are typical for
        editorial-driven travel referrals.
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-4 ${
        highlight ? 'border-coral bg-cream' : 'border-ink/12 bg-cream'
      }`}
    >
      <div className={`eyebrow ${highlight ? 'text-coral' : 'text-ink-soft'}`}>
        {label}
      </div>
      <p className="display mt-2 text-[22px] leading-[1.05] text-ink md:text-[26px]">
        {value}
      </p>
    </div>
  );
}

function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
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
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-coral"
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <span>{label.split('—')[0].trim().split(' ').pop() === 'rate' ? `${min}%` : dollars(min)}</span>
        <span>{label.split('—')[0].trim().split(' ').pop() === 'rate' ? `${max}%` : dollars(max)}</span>
      </div>
    </fieldset>
  );
}
