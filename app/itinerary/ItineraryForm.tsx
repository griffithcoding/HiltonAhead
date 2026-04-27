'use client';

import { useState } from 'react';

const LODGING_OPTIONS = ['Oceanfront villa', 'Resort', 'Condo', 'No preference'] as const;
const INTERESTS = [
  'Golf',
  'Beach',
  'Dining',
  'Fishing',
  'Biking',
  'Boating',
  'Tennis / Pickleball',
  'Kids & family',
  'Wedding / event',
  'Just relaxing',
] as const;
const BUDGET_BANDS = [
  'Under $5k',
  '$5k to $15k',
  '$15k to $40k',
  '$40k+',
  'Not sure yet',
] as const;

type Lodging = (typeof LODGING_OPTIONS)[number];
type Budget = (typeof BUDGET_BANDS)[number];

export default function ItineraryForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lodging, setLodging] = useState<Lodging | ''>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<Budget | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim() || undefined,
          phone: phone.trim() || undefined,
          partySize: partySize ? Number(partySize) : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          lodging: lodging || undefined,
          interests: interests.length > 0 ? interests : undefined,
          budget: budget || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please email hello@hiltonahead.com.');
        setSubmitting(false);
        return;
      }
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
          Got it. <span className="display-italic">Thanks.</span>
        </h2>
        <p className="mt-4 max-w-[420px] text-[14px] leading-[1.7] text-ink-soft">
          We&apos;ll review your request and get back to you within one business
          day with a quote and a suggested next step. Check spam if you
          don&apos;t hear from us by then.
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="input"
          />
        </Field>
        <Field label="Party size">
          <input
            type="number"
            min={1}
            max={500}
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="End date">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Lodging preference">
        <select
          value={lodging}
          onChange={(e) => setLodging(e.target.value as Lodging | '')}
          className="input"
        >
          <option value="">Choose one</option>
          {LODGING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field label="What are you here for?" hint="Pick as many as apply.">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const active = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition sm:px-3.5 sm:py-1.5 ${
                  active
                    ? 'bg-ink text-cream'
                    : 'border border-ink/25 text-ink hover:border-ink'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Budget (total trip spend)">
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value as Budget | '')}
          className="input"
        >
          <option value="">Choose one</option>
          {BUDGET_BANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Anything else we should know?">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Dietary restrictions, mobility concerns, special occasions, etc."
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
        {submitting ? 'Sending…' : 'Send request'}
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
        .input:focus {
          border-color: var(--sunset);
        }
        .input::placeholder {
          color: rgba(26, 41, 35, 0.4);
        }
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
    <label className="flex flex-col gap-2">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="text-sunset"> *</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-ink-soft/70">{hint}</span>}
    </label>
  );
}
