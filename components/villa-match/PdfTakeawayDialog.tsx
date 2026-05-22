'use client';

import { useRef, useState } from 'react';
import type { QuizAnswers } from './types';

type Props = {
  sessionId: string;
  answers: QuizAnswers;
  topMatchIds: string[];
  onClose: () => void;
};

type State = 'idle' | 'sending' | 'sent' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "That doesn't look like a valid email address.",
  rate_limited: 'Too many requests — please wait a minute and try again.',
  send_failed: 'Something went wrong sending your PDF. Try again or email us directly.',
};

export default function PdfTakeawayDialog({ sessionId, answers, topMatchIds, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending' || state === 'sent') return;

    setErrorMsg(null);
    setState('sending');

    try {
      const res = await fetch('/api/villa-match/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: email.trim(),
          answers,
          topMatchIds,
          hp_url: honeypotRef.current?.value ?? '',
        }),
      });

      const data: { ok?: boolean; error?: string; retryAfterSec?: number } = await res.json();

      if (!res.ok || !data.ok) {
        const key = data.error ?? 'send_failed';
        setErrorMsg(ERROR_MESSAGES[key] ?? ERROR_MESSAGES.send_failed);
        setState('error');
        return;
      }

      setState('sent');
    } catch {
      setErrorMsg(ERROR_MESSAGES.send_failed);
      setState('error');
    }
  }

  // Trap focus inside dialog on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Email your villa match"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {state === 'sent' ? (
          <div className="text-center">
            <p className="eyebrow text-sunset mb-2">On its way</p>
            <h2 className="display text-[22px] text-ink">Check your inbox.</h2>
            <p className="mt-3 text-[13px] leading-[1.7] text-ink-soft">
              Your Villa Match PDF is headed to <strong>{email}</strong>. Reply to that email
              anytime — we're happy to help you check dates.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-ink/10"
            >
              ✕
            </button>

            <p className="eyebrow text-sunset mb-1">Take it with you</p>
            <h2 className="display text-[20px] text-ink leading-[1.2]">
              Get your Villa Match PDF
            </h2>
            <p className="mt-2 mb-5 text-[13px] leading-[1.7] text-ink-soft">
              We'll email you a one-page summary of your top picks — ideal for sharing with a
              travel partner or keeping for later.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Honeypot */}
              <input
                ref={honeypotRef}
                type="text"
                name="hp_url"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
                autoComplete="off"
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pdf-email" className="eyebrow text-ink-soft text-[10px]">
                  Your email
                </label>
                <input
                  id="pdf-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === 'error') { setState('idle'); setErrorMsg(null); }
                  }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border-0 border-b border-ink/25 bg-transparent py-2 px-1 text-[14px] text-ink outline-none transition focus:border-sunset placeholder:text-ink/30"
                  disabled={state === 'sending'}
                />
              </div>

              {errorMsg && (
                <p role="alert" className="text-[12px] text-sunset leading-[1.5]">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'sending' ? 'Sending…' : 'Email my PDF'}
                {state !== 'sending' && <span aria-hidden="true">→</span>}
              </button>

              <p className="text-center text-[11px] text-ink-soft/60">
                No spam. Reply anytime to start planning.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
