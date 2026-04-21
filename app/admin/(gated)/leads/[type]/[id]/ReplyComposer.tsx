'use client';

import { useState, useTransition } from 'react';
import { sendGmailReply } from './actions';

export default function ReplyComposer({
  type,
  id,
  to,
  defaultSubject,
  threadId,
  inReplyTo,
}: {
  type: string;
  id: string;
  to: string;
  defaultSubject: string;
  threadId?: string;
  inReplyTo?: string;
}) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setErr(null);
    startTransition(async () => {
      const res = await sendGmailReply(type, id, {
        to,
        subject: subject.trim(),
        body: body.trim(),
        threadId,
        inReplyTo,
      });
      if (res.ok) {
        setBody('');
        setSent(true);
        // Reset the "sent" pill after a moment.
        setTimeout(() => setSent(false), 3000);
      } else {
        setErr(res.error || 'Send failed.');
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          To
        </span>
        <span className="truncate text-[13px] text-ink">{to}</span>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          Subject
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={500}
          required
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-[14px] text-ink focus:border-coral focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          Message
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          maxLength={20000}
          required
          placeholder="Type your reply…"
          className="w-full resize-none border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-[14px] leading-[1.6] text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-ink-soft">
          {body.length > 0 && `${body.length} / 20000`}
          {sent && (
            <span className="ml-3 font-semibold text-palm">Sent ✓</span>
          )}
        </span>
        <button
          type="submit"
          disabled={isPending || !subject.trim() || !body.trim()}
          className="rounded-full border border-ink bg-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-sand transition hover:bg-coral hover:border-coral disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Sending…' : threadId ? 'Send reply' : 'Send'}
        </button>
      </div>

      {err && <div className="text-[12px] text-coral-deep">{err}</div>}
    </form>
  );
}
