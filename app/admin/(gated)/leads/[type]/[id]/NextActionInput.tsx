'use client';

import { useState, useTransition } from 'react';
import { updateNextAction } from './actions';

function isoToDateInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // local YYYY-MM-DD for the date input
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function todayInput(): string {
  const d = new Date();
  return isoToDateInput(d.toISOString());
}

function plusDaysInput(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoToDateInput(d.toISOString());
}

export default function NextActionInput({
  type,
  id,
  current,
}: {
  type: string;
  id: string;
  current: string | null;
}) {
  const [value, setValue] = useState(isoToDateInput(current));
  const [savedValue, setSavedValue] = useState(isoToDateInput(current));
  const [err, setErr] = useState<string | null>(null);
  const [savedPill, setSavedPill] = useState(false);
  const [isPending, startTransition] = useTransition();

  function commit(next: string) {
    if (next === savedValue) return;
    setErr(null);
    startTransition(async () => {
      const res = await updateNextAction(type, id, next);
      if (res.ok) {
        setSavedValue(next);
        setSavedPill(true);
        setTimeout(() => setSavedPill(false), 1800);
      } else {
        setErr(res.error || 'Save failed.');
        setValue(savedValue);
      }
    });
  }

  function quick(days: number) {
    const next = plusDaysInput(days);
    setValue(next);
    commit(next);
  }

  function clear() {
    setValue('');
    commit('');
  }

  // Tone the input red if overdue, gold if today, default otherwise.
  const today = todayInput();
  const tone =
    !value
      ? 'border-ocean-deep/30 text-ink'
      : value < today
        ? 'border-coral text-coral-deep'
        : value === today
          ? 'border-gold text-gold-deep'
          : 'border-palm/60 text-ink';

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value}
          min={todayInput()}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => commit(value)}
          disabled={isPending}
          className={`rounded-sm border bg-sand-soft px-3 py-1.5 text-[13px] focus:border-coral focus:outline-none disabled:opacity-60 ${tone}`}
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            disabled={isPending}
            className="text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-coral disabled:opacity-60"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <button
          type="button"
          onClick={() => quick(0)}
          disabled={isPending}
          className="rounded-full border border-ocean-deep/20 px-2 py-0.5 hover:border-coral hover:text-coral disabled:opacity-60"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => quick(1)}
          disabled={isPending}
          className="rounded-full border border-ocean-deep/20 px-2 py-0.5 hover:border-coral hover:text-coral disabled:opacity-60"
        >
          +1d
        </button>
        <button
          type="button"
          onClick={() => quick(3)}
          disabled={isPending}
          className="rounded-full border border-ocean-deep/20 px-2 py-0.5 hover:border-coral hover:text-coral disabled:opacity-60"
        >
          +3d
        </button>
        <button
          type="button"
          onClick={() => quick(7)}
          disabled={isPending}
          className="rounded-full border border-ocean-deep/20 px-2 py-0.5 hover:border-coral hover:text-coral disabled:opacity-60"
        >
          +1w
        </button>
      </div>
      {isPending && (
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          Saving…
        </span>
      )}
      {savedPill && !isPending && (
        <span className="text-[10px] uppercase tracking-[0.14em] text-palm">
          Saved ✓
        </span>
      )}
      {err && <span className="text-[11px] text-coral-deep">{err}</span>}
    </div>
  );
}
