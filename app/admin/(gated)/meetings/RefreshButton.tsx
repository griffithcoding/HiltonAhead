'use client';

import { useState, useTransition } from 'react';
import { syncGoogleCalendar } from './actions';

export default function RefreshButton() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function onClick() {
    setMsg(null);
    startTransition(async () => {
      const res = await syncGoogleCalendar();
      if (!res.ok) {
        setMsg(res.error || 'Sync failed.');
      } else {
        setMsg(
          `Synced — ${res.inserted ?? 0} new, ${res.updated ?? 0} updated, ${res.total ?? 0} total.`,
        );
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="rounded-full border border-ink bg-ink px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sand transition hover:bg-coral hover:border-coral disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Syncing…' : 'Refresh from Google Calendar'}
      </button>
      {msg && <span className="text-[12px] text-ink-soft">{msg}</span>}
    </div>
  );
}
