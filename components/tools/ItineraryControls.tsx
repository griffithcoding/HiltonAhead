'use client';

import { useRouter } from 'next/navigation';
import { TRIP_TYPES } from '@/data/itineraryActivities';
import { LODGING_TIERS } from '@/data/costEstimates';

/**
 * Client controls for the Hilton Head Itinerary Builder.
 *
 * State lives in the URL — every change pushes a new querystring and the
 * server re-generates the plan. Changing days/type/lodging/party intentionally
 * DROPS the `picks` param so the itinerary regenerates from scratch (per-slot
 * overrides only make sense against a fixed generation).
 */

const TRIP_LENGTHS = [3, 4, 5, 7] as const;

export default function ItineraryControls({
  days,
  type,
  lodging,
  party,
}: {
  days: number;
  type: string;
  lodging: string;
  party: number;
}) {
  const router = useRouter();

  function go(next: { days?: number; type?: string; lodging?: string; party?: number }) {
    const params = new URLSearchParams({
      days: String(next.days ?? days),
      type: next.type ?? type,
      lodging: next.lodging ?? lodging,
      party: String(next.party ?? party),
    });
    // picks intentionally omitted — the plan regenerates.
    router.push(`/hilton-head-itinerary-builder?${params.toString()}`);
  }

  const partyClamped = Math.max(1, Math.min(12, party));

  return (
    <div className="my-10 rounded-2xl border border-rule-soft bg-sand-soft/40 p-6 md:my-12 md:p-8">
      <header className="mb-7">
        <span className="eyebrow text-coral">Build your week</span>
        <p className="mt-2 max-w-[640px] text-[14px] leading-[1.65] text-ink-soft md:text-[15px]">
          Set the shape of the trip and the planner builds a day-by-day plan
          you can tweak. Change anything and it rebuilds.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Trip length */}
        <Field label="Trip length">
          <ButtonRow>
            {TRIP_LENGTHS.map((d) => (
              <Pill
                key={d}
                active={days === d}
                onClick={() => go({ days: d })}
                ariaLabel={`${d}-day trip`}
              >
                {d} days
              </Pill>
            ))}
          </ButtonRow>
        </Field>

        {/* Trip type */}
        <Field label="Trip type">
          <ButtonRow>
            {TRIP_TYPES.map((t) => (
              <Pill
                key={t.id}
                active={type === t.id}
                onClick={() => go({ type: t.id })}
                ariaLabel={`${t.label} trip`}
              >
                {t.label}
              </Pill>
            ))}
          </ButtonRow>
        </Field>

        {/* Lodging tier */}
        <Field label="Lodging tier">
          <ButtonRow>
            {LODGING_TIERS.map((t) => (
              <Pill
                key={t.id}
                active={lodging === t.id}
                onClick={() => go({ lodging: t.id })}
                ariaLabel={`${t.label} lodging`}
              >
                {t.label}
              </Pill>
            ))}
          </ButtonRow>
        </Field>

        {/* Party size */}
        <Field label="Party size" hint={`${partyClamped} ${partyClamped === 1 ? 'person' : 'people'}`}>
          <div className="flex items-center gap-3">
            <Stepper
              ariaLabel="Decrease party size"
              disabled={partyClamped <= 1}
              onClick={() => go({ party: partyClamped - 1 })}
            >
              &minus;
            </Stepper>
            <span
              className="min-w-[2.5rem] text-center text-[22px] font-semibold tabular-nums text-ink"
              aria-live="polite"
            >
              {partyClamped}
            </span>
            <Stepper
              ariaLabel="Increase party size"
              disabled={partyClamped >= 12}
              onClick={() => go({ party: partyClamped + 1 })}
            >
              +
            </Stepper>
          </div>
        </Field>
      </div>
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
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow block text-ink">{label}</span>
        {hint && <span className="text-[12px] text-ink-soft/80">{hint}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({
  active,
  onClick,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={[
        'rounded-full border px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition',
        active
          ? 'border-ink bg-ink text-sand'
          : 'border-rule-soft bg-cream text-ink-soft hover:border-ink/40 hover:text-ink',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Stepper({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-rule-soft bg-cream text-[20px] leading-none text-ink transition hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
