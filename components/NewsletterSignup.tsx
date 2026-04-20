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

/**
 * Editorial newsletter signup.
 * `card`  — large homepage / blog-index panel on cream (dark sunset accent)
 * `inline`— slim panel embedded in blog posts (cream field)
 * `compact` — two-line footer treatment (designed to live on dark ink)
 */
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
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const title = heading ?? 'The Insider Letter';
  const blurb =
    body ??
    'One dispatch a month. Villas the booking sites miss, restaurant openings, hurricane-season intel, and the tee times that just dropped.';

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
          website,
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

  // ===== SUBMITTED (shared across variants, palette-aware) =====
  if (submitted) {
    const onDark = variant === 'compact';
    return (
      <div
        className={
          onDark
            ? 'border-l-2 border-sunset pl-4 py-2'
            : 'border-l-2 border-sunset bg-cream-deep/40 px-5 py-4'
        }
      >
        <div
          className={`display-italic text-[18px] ${
            onDark ? 'text-cream' : 'text-ink'
          }`}
        >
          You&apos;re on the list.
        </div>
        <div
          className={`mt-1 text-[12px] ${
            onDark ? 'text-cream/70' : 'text-ink-soft'
          }`}
        >
          First dispatch arrives in a week or two. Check spam the first time.
        </div>
      </div>
    );
  }

  // ===== COMPACT (footer, on dark ink) =====
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <div className="eyebrow text-cream/60">{title}</div>
          <p className="mt-2 text-[13px] leading-[1.65] text-cream/75">
            {blurb}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            aria-label="Email address"
            className="flex-1 border-b border-cream/30 bg-transparent px-1 py-2 text-[13px] text-cream placeholder:text-cream/40 outline-none transition focus:border-sunset"
          />
          <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 bg-cream px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-sunset hover:text-cream disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Subscribe'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
        {error && (
          <div className="text-[11px] text-sunset" role="alert">
            {error}
          </div>
        )}
      </form>
    );
  }

  // ===== INLINE (mid-blog-post, on cream) =====
  if (variant === 'inline') {
    return (
      <aside className="border-y border-ink/15 py-10">
        <div className="flex flex-col gap-2">
          <div className="eyebrow text-sunset">{title}</div>
          <h3 className="display text-[24px] leading-[1.2] text-ink md:text-[28px]">
            Get the next dispatch in your inbox.
          </h3>
          <p className="max-w-[560px] text-[14px] leading-[1.7] text-ink-soft">
            {blurb}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={emailId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              aria-label="Email address"
              className="flex-1 border-b border-ink/40 bg-transparent px-1 py-2.5 text-[14px] text-ink outline-none transition focus:border-sunset"
            />
            <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send me the letter'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          {error && (
            <div className="text-[12px] text-sunset" role="alert">
              {error}
            </div>
          )}
          <div className="eyebrow text-ink-soft">
            No spam. Unsubscribe in one click.
          </div>
        </form>
      </aside>
    );
  }

  // ===== CARD (homepage / blog-index, full editorial lead magnet) =====
  return (
    <section className="border-y border-ink/15">
      <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:py-20">
        <div>
          <div className="eyebrow text-sunset">{title}</div>
          <h3 className="display mt-5 text-balance text-[34px] leading-[1.05] text-ink md:text-[48px]">
            Intel you won&apos;t find on the{' '}
            <span className="display-italic">first page of Google.</span>
          </h3>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-ink-soft">
            {blurb}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          aria-describedby={`${formId}-disclaimer`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label htmlFor={emailId} className="flex flex-col gap-2">
              <span className="eyebrow text-ink-soft">
                Email <span className="text-sunset">*</span>
              </span>
              <input
                id={emailId}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="border-b border-ink/40 bg-transparent px-1 py-2.5 text-[14px] text-ink outline-none transition focus:border-sunset"
              />
            </label>
            <label htmlFor={nameId} className="flex flex-col gap-2">
              <span className="eyebrow text-ink-soft">First name</span>
              <input
                id={nameId}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="given-name"
                className="border-b border-ink/40 bg-transparent px-1 py-2.5 text-[14px] text-ink outline-none transition focus:border-sunset"
              />
            </label>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="eyebrow text-ink-soft">
              What should we cover?
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((o) => {
                const active = interests.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggleInterest(o)}
                    className={`px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition ${
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
          </fieldset>

          <HoneypotField id={honeypotId} value={website} onChange={setWebsite} />

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
            className="mt-1 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Get the insider letter'}
            <span aria-hidden="true">→</span>
          </button>

          <div
            id={`${formId}-disclaimer`}
            className="eyebrow text-ink-soft"
          >
            One dispatch · Unsubscribe anytime
          </div>
        </form>
      </div>
    </section>
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
