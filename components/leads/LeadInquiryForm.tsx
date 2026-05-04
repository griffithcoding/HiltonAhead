'use client';

import { useState } from 'react';
import { trackLead } from '@/app/lib/analytics';

export type LeadType = 'relocation' | 'owner' | 'wedding';

export interface LeadField {
  /** key in payload.details */
  name: string;
  /** display label */
  label: string;
  /** input kind */
  kind: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'multi';
  /** for select/multi */
  options?: readonly string[];
  /** placeholder / hint */
  placeholder?: string;
  /** spans both columns of the 2-col grid */
  fullWidth?: boolean;
  /** required */
  required?: boolean;
  /** helper text under the field */
  hint?: string;
}

/**
 * Generic lead inquiry form. Used by /move-to-hilton-head,
 * /sell-or-rent-your-villa, and /hilton-head-wedding-inquiry. POSTs to
 * /api/leads with the type discriminator and a `details` bag of the
 * type-specific fields.
 */
export default function LeadInquiryForm({
  type,
  fields,
  ctaLabel = 'Send inquiry',
  successHeading = 'Got it. Thanks.',
  successBody = "We'll review your inquiry and reach out within one business day.",
}: {
  type: LeadType;
  fields: readonly LeadField[];
  ctaLabel?: string;
  successHeading?: string;
  successBody?: string;
}) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [details, setDetails] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function setDetail(name: string, value: string | string[]) {
    setDetails((prev) => ({ ...prev, [name]: value }));
  }

  function toggleMulti(name: string, value: string) {
    setDetails((prev) => {
      const cur = (prev[name] as string[] | undefined) || [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [name]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setSubmitting(true);

    // Strip empties from details
    const cleanedDetails: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(details)) {
      if (Array.isArray(v) && v.length > 0) cleanedDetails[k] = v;
      else if (typeof v === 'string' && v.trim()) cleanedDetails[k] = v.trim();
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          email: email.trim(),
          fullName: fullName.trim() || undefined,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
          details: Object.keys(cleanedDetails).length > 0 ? cleanedDetails : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please email hello@hiltonahead.com.');
        setSubmitting(false);
        return;
      }
      trackLead(`${type}_form`, type);
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again or email hello@hiltonahead.com.');
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6">
        <div className="eyebrow text-sunset">Received</div>
        <h2 className="display mt-3 text-[30px] leading-[1.1] text-ink md:text-[36px]">
          {successHeading}
        </h2>
        <p className="mt-4 max-w-[420px] text-[14px] leading-[1.7] text-ink-soft">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="input"
          />
        </Field>
        <Field label="Your name">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            className="input"
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="input"
          />
        </Field>
      </div>

      {fields.map((f) => {
        const v = details[f.name];
        const wrapClass = f.fullWidth ? '' : 'grid grid-cols-1 gap-4 sm:grid-cols-2';
        const inner = (() => {
          if (f.kind === 'select') {
            return (
              <Field label={f.label} hint={f.hint} required={f.required}>
                <select
                  required={f.required}
                  value={(v as string) || ''}
                  onChange={(e) => setDetail(f.name, e.target.value)}
                  className="input"
                >
                  <option value="">Choose one</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
            );
          }
          if (f.kind === 'multi') {
            const arr = (v as string[] | undefined) || [];
            return (
              <Field label={f.label} hint={f.hint || 'Pick as many as apply.'} required={f.required}>
                <div className="flex flex-wrap gap-2">
                  {f.options?.map((o) => {
                    const active = arr.includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => toggleMulti(f.name, o)}
                        className={`rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition sm:px-3.5 sm:py-1.5 ${
                          active
                            ? 'bg-ink text-cream'
                            : 'border border-ink/25 text-ink hover:border-ink'
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </Field>
            );
          }
          if (f.kind === 'textarea') {
            return (
              <Field label={f.label} hint={f.hint} required={f.required}>
                <textarea
                  required={f.required}
                  value={(v as string) || ''}
                  onChange={(e) => setDetail(f.name, e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder={f.placeholder}
                />
              </Field>
            );
          }
          return (
            <Field label={f.label} hint={f.hint} required={f.required}>
              <input
                type={f.kind}
                required={f.required}
                value={(v as string) || ''}
                onChange={(e) => setDetail(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="input"
              />
            </Field>
          );
        })();

        return f.fullWidth || f.kind === 'multi' || f.kind === 'textarea' ? (
          <div key={f.name}>{inner}</div>
        ) : (
          <div key={f.name} className={wrapClass}>
            {inner}
          </div>
        );
      })}

      <Field label="Anything else we should know?">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input resize-none"
        />
      </Field>

      {error && (
        <div
          role="alert"
          className="border-l-2 border-sunset bg-sunset/5 px-3.5 py-2.5 text-[12px] text-sunset"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending…' : ctaLabel}
        <span aria-hidden="true">→</span>
      </button>

      <style>{`
        .input {
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(26, 41, 35, 0.25);
          background: transparent;
          padding: 0.5rem 0.25rem;
          font-size: 14px;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .input:focus { border-color: var(--sunset); }
        .input::placeholder { color: rgba(26, 41, 35, 0.4); }
        select.input {
          appearance: none;
          padding-right: 1.5rem;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--ink) 50%),
            linear-gradient(135deg, var(--ink) 50%, transparent 50%);
          background-position: calc(100% - 12px) 50%, calc(100% - 7px) 50%;
          background-size: 5px 5px;
          background-repeat: no-repeat;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
        {label}
        {required && <span className="ml-1 text-sunset">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-ink-soft/70">{hint}</span>}
    </label>
  );
}
