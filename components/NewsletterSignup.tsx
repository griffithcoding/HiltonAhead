'use client';

import { useId, useState } from 'react';

const INTEREST_OPTIONS = [
  'Villa deals',
  'Restaurants',
  'Golf',
  'Family trips',
  'Couples getaways',
] as const;

type Variant = 'card' | 'inline' | 'compact';

interface Props {
  /** Attribution — e.g. "footer", "blog_index", "blog_post_<slug>", "homepage_hero". */
  source: string;
  /** Visual style. `card` = hero CTA band, `inline` = blog-post inline, `compact` = footer. */
  variant?: Variant;
  /** Override the default heading. */
  heading?: string;
  /** Override the default body line. */
  body?: string;
}

export default function NewsletterSignup({
  source,
  variant = 'card',
  heading,
  body,
}: Props) {
  const formId = useId();
  const emailId = `${formId}-email`;
  const nameId = `${formId}-name`;
  const honeypotId = `${formId}-website`;

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const title = heading ?? 'The Insider Letter';
  const blurb =
    body ??
    'One email a month. Villa deals the booking sites miss, restaurant openings, hurricane-season intel, and the tee times that just dropped.';

  function toggleInterest(v: string) {
    setInterests((prev) =>
      prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim() || undefined,
          interests: interests.length > 0 ? interests : undefined,
          source,
          website, // honeypot
          pageUrl:
            typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not subscribe. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={
          variant === 'compact'
            ? 'rounded-[12px] border border-primary/30 bg-primary/[0.08] px-4 py-3'
            : 'rounded-[18px] border border-primary/30 bg-primary/[0.08] p-6'
        }
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-black"
          >
            ✓
          </span>
          <div>
            <div className="text-[14px] font-medium text-zinc-50">
              You&apos;re on the list.
            </div>
            <div className="text-[12px] text-zinc-400">
              First letter arrives in a week or two. Check spam the first time.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact footer variant — email + button only, no interests, single line on md+.
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label
          htmlFor={emailId}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400"
        >
          {title}
        </label>
        <p className="text-[12px] leading-[1.55] text-zinc-500">{blurb}</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            className="flex-1 rounded-full border border-white/15 bg-zinc-950/60 px-3.5 py-2 text-[12px] text-zinc-100 outline-none transition focus:border-primary"
          />
          <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-black shadow-md shadow-primary/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Subscribing…' : 'Subscribe'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
        {error && (
          <div className="text-[11px] text-rose-300" role="alert">
            {error}
          </div>
        )}
      </form>
    );
  }

  // Inline (used mid-blog-post): smaller, no interests picker by default.
  if (variant === 'inline') {
    return (
      <div className="rounded-[18px] border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            {title}
          </div>
          <h3 className="text-[16px] font-semibold text-zinc-50">
            Get the next one in your inbox.
          </h3>
          <p className="text-[13px] leading-[1.6] text-zinc-400">{blurb}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={emailId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              className="flex-1 rounded-full border border-white/15 bg-zinc-950/70 px-4 py-2.5 text-[13px] text-zinc-100 outline-none transition focus:border-primary"
            />
            <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Subscribing…' : 'Send me the letter'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          {error && (
            <div className="text-[12px] text-rose-300" role="alert">
              {error}
            </div>
          )}
          <div className="text-[11px] text-zinc-500">
            No spam. Unsubscribe in one click. We never share your email.
          </div>
        </form>
      </div>
    );
  }

  // Card (default): homepage-style lead magnet with full fields + interests.
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-primary/25 bg-gradient-to-br from-primary/[0.1] via-zinc-900/60 to-zinc-950/80 p-7 shadow-xl shadow-primary/10 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-black"
          >
            ✉
          </span>
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            {title}
          </div>
        </div>
        <h3 className="mt-2 max-w-[520px] text-[22px] font-medium leading-[1.25] tracking-tight text-zinc-50 md:text-[24px]">
          Intel you won&apos;t find on the first page of Google.
        </h3>
        <p className="mt-3 max-w-[520px] text-[13px] leading-[1.65] text-zinc-400">
          {blurb}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3"
          aria-describedby={`${formId}-disclaimer`}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label htmlFor={emailId} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-zinc-300">
                Email <span className="text-primary">*</span>
              </span>
              <input
                id={emailId}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="rounded-[10px] border border-white/15 bg-zinc-950/70 px-3 py-2.5 text-[13px] text-zinc-100 outline-none transition focus:border-primary"
              />
            </label>
            <label htmlFor={nameId} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-zinc-300">
                First name (optional)
              </span>
              <input
                id={nameId}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="given-name"
                className="rounded-[10px] border border-white/15 bg-zinc-950/70 px-3 py-2.5 text-[13px] text-zinc-100 outline-none transition focus:border-primary"
              />
            </label>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-[11px] font-medium text-zinc-300">
              What do you want us to cover? (pick any)
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((o) => {
                const active = interests.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggleInterest(o)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] transition ${
                      active
                        ? 'border-primary bg-primary text-black'
                        : 'border-white/20 bg-zinc-950/40 text-zinc-300 hover:border-white/40'
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />

          {error && (
            <div
              role="alert"
              className="rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-[12px] text-rose-200"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-black shadow-lg shadow-primary/25 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Subscribing…' : 'Get the insider letter'}
            <span aria-hidden="true">→</span>
          </button>

          <div
            id={`${formId}-disclaimer`}
            className="text-[11px] text-zinc-500"
          >
            One email a month. No spam. Unsubscribe in one click.
          </div>
        </form>
      </div>
    </div>
  );
}

function HoneypotField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // Hidden from users + assistive tech; bots fill it.
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
