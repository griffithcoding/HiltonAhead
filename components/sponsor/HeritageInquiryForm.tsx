'use client';

import { useState } from 'react';
import type { HeritageCategory } from '@/data/heritageSponsors';

const CATEGORY_LABEL: Record<HeritageCategory, string> = {
  lodging: 'Lodging',
  golf: 'Golf / tee times',
  dining: 'Dining / reservations',
  transportation: 'Transportation / concierge',
};

type Status = 'idle' | 'submitting' | 'ok' | 'error';

/**
 * Inquiry form for the Heritage 2027 Partner SKU. POSTs to the
 * existing /api/business-inquiry endpoint with `tier_interest` set to
 * a Heritage marker so admin views can filter for Heritage leads.
 */
export default function HeritageInquiryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      businessName: String(fd.get('businessName') || ''),
      contactName: String(fd.get('contactName') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      industry: String(fd.get('category') || ''),
      website: String(fd.get('website') || ''),
      tierInterest: 'heritage_2027',
      message: String(fd.get('message') || ''),
    };

    try {
      const res = await fetch('/api/business-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error || 'Could not submit. Please email hello@hiltonahead.com directly.');
        return;
      }
      setStatus('ok');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
      setError('Network error. Please try again or email hello@hiltonahead.com.');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-md border border-coral/40 bg-coral/5 p-6">
        <div className="eyebrow text-coral">Got it</div>
        <p className="display mt-2 text-[22px] leading-[1.15] text-ink md:text-[26px]">
          We&rsquo;ll be in touch within 24 hours.
        </p>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-ink-soft">
          We typically reply with a 20-minute call slot, the kit sample, and
          the slot status for your category.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-md border border-ocean-deep/20 bg-cream p-6 md:grid-cols-2 md:gap-5 md:p-8"
    >
      <Field label="Business name" name="businessName" required />
      <Field label="Contact name" name="contactName" />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />

      <fieldset className="md:col-span-2">
        <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Category of interest
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.entries(CATEGORY_LABEL) as [HeritageCategory, string][]).map(
            ([v, l]) => (
              <label
                key={v}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/25 bg-cream px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-cream hover:border-ink hover:text-ink"
              >
                <input
                  type="radio"
                  name="category"
                  value={v}
                  className="sr-only"
                  defaultChecked={v === 'lodging'}
                />
                {l}
              </label>
            ),
          )}
        </div>
      </fieldset>

      <Field label="Website" name="website" className="md:col-span-2" />

      <fieldset className="md:col-span-2">
        <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
          What you&rsquo;d want featured
        </legend>
        <textarea
          name="message"
          rows={4}
          className="mt-2 w-full rounded-md border border-ocean-deep/25 bg-cream px-3 py-2.5 text-[14px] leading-[1.55] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
          placeholder="A villa for Heritage week, a stay-and-play, a private dining room, etc."
        />
      </fieldset>

      <div className="md:col-span-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[440px] text-[11.5px] leading-[1.55] text-ink-soft">
          We&rsquo;ll reply within 24 hours with a 20-min call slot and your
          category&rsquo;s slot status.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Request a Heritage call'}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && (
        <p className="md:col-span-2 text-[12px] text-coral" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  className = '',
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
        {required && <span className="ml-1 text-coral">*</span>}
      </legend>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-md border border-ocean-deep/25 bg-cream px-3 py-2.5 text-[14px] leading-[1.55] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
      />
    </fieldset>
  );
}
