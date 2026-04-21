'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus } from './actions';

export default function LeadStatusSelect({
  type,
  id,
  current,
  options,
}: {
  type: string;
  id: string;
  current: string;
  options: string[];
}) {
  const [value, setValue] = useState(current);
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    setErr(null);
    startTransition(async () => {
      const res = await updateLeadStatus(type, id, next);
      if (!res.ok) {
        setErr(res.error || 'Failed to update');
        setValue(current);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={value}
        onChange={onChange}
        disabled={isPending}
        className="rounded-full border border-ocean-deep/30 bg-sand-soft px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink focus:border-coral focus:outline-none disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          Saving…
        </span>
      )}
      {err && <span className="text-[11px] text-coral-deep">{err}</span>}
    </div>
  );
}
