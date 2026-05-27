'use client';

import { useTransition } from 'react';
import { setLeadSequenceActiveAction } from './actions';

/**
 * Pause / resume the auto-followup sequence for one lead.
 *
 * When `sequence_active` is true, the lead-sequence-tick cron will fire
 * lead_followup_1 (+5d after last send) and lead_followup_2 (+10d after
 * that). Pause to stop autoplay — the operator can still send manual
 * replies via the Gmail panel.
 */
export default function LeadSequenceToggle({
  type,
  id,
  active,
}: {
  type: string;
  id: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();
  const next = !active;

  return (
    <form
      action={() =>
        start(async () => {
          await setLeadSequenceActiveAction(type, id, next);
        })
      }
    >
      <button
        type="submit"
        disabled={pending}
        className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
          active
            ? 'border-emerald-700/30 bg-emerald-50 text-emerald-800 hover:border-coral hover:bg-coral/5 hover:text-coral'
            : 'border-ink/15 bg-ink/5 text-ink-soft hover:border-emerald-700/40 hover:text-emerald-800'
        } ${pending ? 'opacity-60' : ''}`}
        title={
          active
            ? 'Autoplay on — cron will send followups. Click to pause.'
            : 'Paused — cron will not send followups. Click to resume.'
        }
      >
        {pending ? '…' : active ? 'Sequence on' : 'Sequence paused'}
      </button>
    </form>
  );
}
