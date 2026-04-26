'use client';

import { useState, useTransition } from 'react';
import { markPublishedAction } from '../actions';

export default function PublishForm({ opportunityId }: { opportunityId: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-emerald-700/40 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800 hover:bg-emerald-100"
      >
        Mark link published
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-emerald-700/40 bg-emerald-50/50 p-4">
      <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-900">
        Placed link URL (optional)
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article-with-our-link"
        className="mt-2 w-full rounded-sm border border-emerald-700/30 bg-sand px-3 py-2 text-[13px] text-ink outline-none focus:border-emerald-700"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await markPublishedAction(opportunityId, url);
              setOpen(false);
              setUrl('');
            });
          }}
          className="rounded-sm bg-emerald-700 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Confirm published'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
