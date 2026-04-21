'use client';

import { useState, useTransition } from 'react';
import { addLeadNote } from './actions';

export default function LeadNoteForm({
  type,
  id,
}: {
  type: string;
  id: string;
}) {
  const [body, setBody] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setErr(null);
    startTransition(async () => {
      const res = await addLeadNote(type, id, trimmed);
      if (res.ok) {
        setBody('');
      } else {
        setErr(res.error || 'Failed to save note.');
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Drop a note — spoke with them, left voicemail, awaiting response…"
        className="w-full resize-none border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-ink-soft">
          {body.length > 0 && `${body.length} / 4000`}
        </span>
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="rounded-full border border-ink bg-ink px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sand transition hover:bg-coral hover:border-coral disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Add note'}
        </button>
      </div>
      {err && <div className="text-[12px] text-coral-deep">{err}</div>}
    </form>
  );
}
