'use client';

import { useMemo, useState, useTransition } from 'react';
import { sendOutreachEmailAction, type SendOutreachResult } from '../actions';
import {
  OUTREACH_TEMPLATES,
  renderTemplateString,
  type RenderVars,
} from '@/lib/outreach/templates';

type Props = {
  opportunityId: string;
  contact: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  account: {
    domain: string;
    name: string | null;
  } | null;
  opportunity: {
    target_url: string | null;
    source_url: string | null;
    anchor_text_proposal: string | null;
    link_type: string;
  };
};

const DEFAULT_TEMPLATE_BY_LINK_TYPE: Record<string, string> = {
  guest_post: 'guest_post_intro',
  resource_page: 'resource_page_intro',
  niche_edit: 'niche_edit_intro',
  broken_link: 'broken_link_intro',
  unlinked_mention: 'unlinked_mention_intro',
  partnership: 'partnership_intro',
};

export default function ComposeButton({
  opportunityId,
  contact,
  account,
  opportunity,
}: Props) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState<string>(
    DEFAULT_TEMPLATE_BY_LINK_TYPE[opportunity.link_type] ?? 'guest_post_intro',
  );
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<SendOutreachResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const vars: RenderVars = useMemo(
    () => ({
      first_name: contact?.first_name ?? null,
      publication: account?.name ?? account?.domain ?? null,
      their_url: opportunity.source_url,
      our_url: opportunity.target_url,
      anchor: opportunity.anchor_text_proposal,
    }),
    [contact, account, opportunity],
  );

  // When template changes (and the user hasn't typed yet), refill from template
  function applyTemplate(id: string) {
    const tpl = OUTREACH_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setTemplateId(id);
    setSubject(renderTemplateString(tpl.subject, vars));
    setBody(renderTemplateString(tpl.body, vars));
    setTouched(true);
  }

  function openModal() {
    if (!touched) applyTemplate(templateId); // pre-fill on first open
    setResult(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleSend() {
    startTransition(async () => {
      const r = await sendOutreachEmailAction(opportunityId, subject, body);
      setResult(r);
      if (r.ok) {
        // Reset on success but keep modal open briefly so the user sees "Sent."
        setTimeout(() => {
          setOpen(false);
          setTouched(false);
        }, 900);
      }
    });
  }

  const noContact = !contact;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={noContact}
        title={
          noContact ? 'Add a contact to this opportunity before sending.' : ''
        }
        className="rounded-sm bg-coral px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-sand transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink-soft/40 disabled:text-sand"
      >
        ✉ Send email
      </button>
      {noContact && (
        <p className="mt-2 text-[11px] text-ink-soft">
          Add a contact above before sending.
        </p>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compose outreach email"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm md:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-2xl rounded-sm border border-ocean-deep/15 bg-sand shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ocean-deep/15 px-6 py-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
                  Compose outreach
                </div>
                <div className="mt-1 text-[13px] text-ink">
                  to <span className="font-mono">{contact?.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-ink-soft hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              {/* Template picker */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                  Template
                </span>
                <select
                  value={templateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
                >
                  {OUTREACH_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Subject */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                  Subject
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setTouched(true);
                  }}
                  className="rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
                />
              </label>

              {/* Body */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                  Body
                </span>
                <textarea
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setTouched(true);
                  }}
                  rows={14}
                  className="resize-y rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 font-mono text-[12.5px] leading-[1.55] text-ink outline-none focus:border-coral"
                />
                <span className="text-[11px] text-ink-soft">
                  CAN-SPAM footer (physical address + unsubscribe link) is
                  appended automatically before send.
                </span>
              </label>

              {/* Result */}
              {result && (
                <div
                  className={`rounded-sm border p-3 text-[12px] ${
                    result.ok
                      ? 'border-emerald-700/40 bg-emerald-50 text-emerald-900'
                      : 'border-coral/40 bg-coral/5 text-coral'
                  }`}
                >
                  {result.ok ? (
                    <span>✓ Sent. Logged to timeline.</span>
                  ) : (
                    <span>
                      <strong>Send failed:</strong> {result.error}
                      {result.code === 'gmail' && (
                        <>
                          {' '}
                          <em>
                            (Likely cause: Gmail OAuth needs to be re-consented
                            with the &ldquo;Send email on your behalf&rdquo;
                            scope.)
                          </em>
                        </>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-ocean-deep/15 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-sm border border-ocean-deep/20 bg-sand px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending || !subject.trim() || !body.trim()}
                onClick={handleSend}
                className="rounded-sm bg-ink px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand hover:bg-coral disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Sending…' : 'Send via Gmail'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
