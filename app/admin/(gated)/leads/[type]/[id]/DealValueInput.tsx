'use client';

import { useState, useTransition } from 'react';
import { updateDealValue } from './actions';

function format(value: number | null): string {
  if (value === null) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export default function DealValueInput({
  type,
  id,
  current,
}: {
  type: string;
  id: string;
  current: number | null;
}) {
  const [raw, setRaw] = useState(format(current));
  const [err, setErr] = useState<string | null>(null);
  const [savedPill, setSavedPill] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [savedValue, setSavedValue] = useState(format(current));

  function commit() {
    if (raw === savedValue) return;
    setErr(null);
    startTransition(async () => {
      const res = await updateDealValue(type, id, raw);
      if (res.ok) {
        setSavedValue(raw);
        setSavedPill(true);
        setTimeout(() => setSavedPill(false), 1800);
      } else {
        setErr(res.error || 'Save failed.');
      }
    });
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[15px] text-ink-soft">$</span>
      <input
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        placeholder="0"
        inputMode="decimal"
        disabled={isPending}
        className="w-28 border-b border-ocean-deep/30 bg-transparent px-1 py-1 text-[15px] text-ink focus:border-coral focus:outline-none disabled:opacity-60"
      />
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
