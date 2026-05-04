'use client';

import { useState } from 'react';
import { submitBusinessApplication } from '@/app/business/apply/actions';

const INDUSTRIES: ReadonlyArray<{ slug: string; label: string }> = [
  { slug: 'restaurants', label: 'Restaurants' },
  { slug: 'golf', label: 'Golf' },
  { slug: 'water-activities', label: 'Water activities / charters' },
  { slug: 'weddings', label: 'Weddings & venues' },
  { slug: 'spas-wellness', label: 'Spas & wellness' },
  { slug: 'vacation-rentals', label: 'Vacation rentals / property mgmt' },
  { slug: 'shopping', label: 'Shopping / retail' },
  { slug: 'family-activities', label: 'Family activities' },
  { slug: 'fishing-charters', label: 'Fishing charters' },
  { slug: 'dolphin-tours', label: 'Dolphin / nature tours' },
  { slug: 'transportation', label: 'Transportation / shuttle' },
  { slug: 'home-services', label: 'Home services' },
];

export default function BusinessApplyForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const result = await submitBusinessApplication({
      businessName: String(fd.get('businessName') || ''),
      contactName: String(fd.get('contactName') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || '') || undefined,
      industrySlug: String(fd.get('industrySlug') || ''),
      website: String(fd.get('website') || '') || undefined,
      message: String(fd.get('message') || '') || undefined,
    });
    setPending(false);
    if (result.ok) setDone(true);
    else setError(result.error);
  }

  if (done) {
    return (
      <div className="border-l-2 border-coral bg-coral/10 px-5 py-6">
        <div className="eyebrow text-coral-deep">Application received</div>
        <h3 className="display mt-2 text-[24px] leading-[1.2] text-ink">
          Thanks — we&rsquo;ll be in touch.
        </h3>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
          We review every application by hand. Expect a reply by email within
          about a week. If approved, we&rsquo;ll send a one-time link to
          finish setting up your portal account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Business name" name="businessName" required />
      <Field
        label="Your name"
        name="contactName"
        required
        autoComplete="name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Field
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
      />
      <SelectField
        label="Category"
        name="industrySlug"
        required
        options={INDUSTRIES}
      />
      <Field
        label="Website (optional)"
        name="website"
        type="url"
        placeholder="https://"
      />
      <TextareaField
        label="Anything else? (optional)"
        name="message"
        rows={4}
        placeholder="What makes your business worth a spot in the directory?"
      />

      {error && (
        <div className="border-l-2 border-rose-400 bg-rose-50 px-4 py-3 text-[13px] text-rose-900">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-ocean-deep disabled:opacity-50"
      >
        {pending ? 'Submitting…' : 'Submit application'}
      </button>
      <p className="text-[11px] leading-[1.5] text-ink-soft">
        By submitting you agree we may email you about your application. No
        marketing spam.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="ml-1 text-coral">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14.5px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: ReadonlyArray<{ slug: string; label: string }>;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="ml-1 text-coral">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14.5px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
      >
        <option value="" disabled>
          Pick a category
        </option>
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  name,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14.5px] leading-[1.5] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
      />
    </label>
  );
}
