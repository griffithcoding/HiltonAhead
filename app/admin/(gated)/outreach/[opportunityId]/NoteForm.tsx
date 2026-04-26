'use client';

import { useRef, useTransition } from 'react';
import { addNoteAction } from '../actions';

export default function NoteForm({ opportunityId }: { opportunityId: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const note = (formData.get('note') as string | null) ?? '';
        if (!note.trim()) return;
        startTransition(async () => {
          await addNoteAction(opportunityId, note);
          if (ref.current) ref.current.value = '';
        });
      }}
      className="space-y-3"
    >
      <textarea
        ref={ref}
        name="note"
        rows={3}
        placeholder="Logged what you did, what you said, what they said…"
        className="w-full resize-none rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm bg-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Add note'}
        </button>
      </div>
    </form>
  );
}
