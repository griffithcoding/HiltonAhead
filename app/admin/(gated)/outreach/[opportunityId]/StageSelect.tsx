'use client';

import { useTransition } from 'react';
import { updateStageAction } from '../actions';

const STAGES = [
  'discovered',
  'researched',
  'outreached',
  'followed_up',
  'replied',
  'negotiating',
  'agreed',
  'published',
  'declined',
  'no_response',
] as const;

const STAGE_LABEL: Record<string, string> = {
  discovered: 'Discovered',
  researched: 'Researched',
  outreached: 'Outreached',
  followed_up: 'Followed Up',
  replied: 'Replied',
  negotiating: 'Negotiating',
  agreed: 'Agreed',
  published: 'Published',
  declined: 'Declined',
  no_response: 'No Response',
};

export default function StageSelect({
  opportunityId,
  current,
}: {
  opportunityId: string;
  current: string;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <select
      defaultValue={current}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        if (next === current) return;
        startTransition(async () => {
          await updateStageAction(opportunityId, next);
        });
      }}
      className="rounded-sm border border-ocean-deep/20 bg-sand px-3 py-1.5 text-[12px] font-medium text-ink outline-none focus:border-coral disabled:opacity-50"
    >
      {STAGES.map((s) => (
        <option key={s} value={s}>
          {STAGE_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
