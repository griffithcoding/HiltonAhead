'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateListing } from '@/app/business/(gated)/actions';

export interface ListingFormValues {
  businessId: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  hours: string;
  instagram: string;
  facebook: string;
  parking: string;
  dressCode: string;
  petFriendly: '' | 'yes' | 'no';
}

const INPUT_CLASS =
  'rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14.5px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30';

/**
 * Owner-facing editor for the factual fields of a directory listing.
 * Editorial copy (review, "notable for"), photos, tier and category stay
 * with the Hilton Ahead team and are not editable here.
 */
export default function ListingEditForm({
  initial,
}: {
  initial: ListingFormValues;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const get = (key: string) => String(fd.get(key) || '');
    const result = await updateListing({
      businessId: initial.businessId,
      name: get('name'),
      tagline: get('tagline'),
      address: get('address'),
      city: get('city'),
      phone: get('phone'),
      website: get('website'),
      hours: get('hours'),
      instagram: get('instagram'),
      facebook: get('facebook'),
      parking: get('parking'),
      dressCode: get('dressCode'),
      petFriendly: get('petFriendly'),
    });
    setPending(false);
    if (result.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onChange={() => setSaved(false)}
      className="flex flex-col gap-10"
    >
      <fieldset className="flex flex-col gap-5">
        <legend className="eyebrow mb-5 text-coral">The basics</legend>
        <Field
          label="Business name"
          name="name"
          defaultValue={initial.name}
          required
          maxLength={120}
        />
        <Field
          label="Tagline"
          name="tagline"
          defaultValue={initial.tagline}
          maxLength={160}
          hint="One line under your name on the listing card."
        />
        <Field
          label="Hours"
          name="hours"
          defaultValue={initial.hours}
          maxLength={200}
          placeholder="Daily 11am–10pm"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="eyebrow mb-5 text-coral">Contact &amp; location</legend>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
          <Field
            label="Street address"
            name="address"
            defaultValue={initial.address}
            maxLength={200}
            autoComplete="street-address"
          />
          <Field
            label="City"
            name="city"
            defaultValue={initial.city}
            maxLength={80}
            autoComplete="address-level2"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={initial.phone}
            maxLength={40}
            autoComplete="tel"
          />
          <Field
            label="Website"
            name="website"
            type="url"
            defaultValue={initial.website}
            maxLength={300}
            placeholder="https://"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Instagram handle"
            name="instagram"
            defaultValue={initial.instagram}
            maxLength={60}
            placeholder="yourbusiness"
          />
          <Field
            label="Facebook"
            name="facebook"
            defaultValue={initial.facebook}
            maxLength={200}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="eyebrow mb-5 text-coral">Good to know</legend>
        <Field
          label="Parking note"
          name="parking"
          defaultValue={initial.parking}
          maxLength={200}
          placeholder="Free lot, fills by 6pm in summer."
        />
        <Field
          label="Dress code"
          name="dressCode"
          defaultValue={initial.dressCode}
          maxLength={200}
          placeholder="Lowcountry casual; collared at dinner."
        />
        <label className="flex flex-col gap-1.5 md:max-w-[280px]">
          <span className="eyebrow text-ink-soft">Pet friendly</span>
          <select
            name="petFriendly"
            defaultValue={initial.petFriendly}
            className={INPUT_CLASS}
          >
            <option value="">Not specified</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </fieldset>

      <div aria-live="polite">
        {error && (
          <div className="border-l-2 border-rose-400 bg-rose-50 px-4 py-3 text-[13px] text-rose-900">
            {error}
          </div>
        )}
        {saved && (
          <div className="border-l-2 border-palm bg-palm/10 px-4 py-3 text-[13px] text-ink">
            Saved. Your public listing now shows these details.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-ocean-deep disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        <p className="text-[12px] leading-[1.5] text-ink-soft">
          Changes go live on your public listing right away.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  maxLength,
  autoComplete,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
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
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
      {hint && <span className="text-[12px] text-ink-soft">{hint}</span>}
    </label>
  );
}
