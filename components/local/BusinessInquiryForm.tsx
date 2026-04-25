'use client'

import { useState } from 'react'
import type { IndustrySlug } from '@/data/localBusinesses'
import { industries } from '@/data/localBusinesses'

const TIERS = [
  { value: 'standard', label: 'Standard Listing — Free' },
  { value: 'featured', label: 'Featured Partner — Highlighted placement' },
  { value: 'exclusive', label: 'Exclusive / Sponsorship — Custom arrangement' },
  { value: 'unsure', label: "Not sure yet — just exploring" },
]

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-coral">*</span>}
      </label>
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
      {children}
    </div>
  )
}

const inputBase =
  'w-full rounded-xl border border-rule-soft bg-sand px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-all duration-200 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20'

export default function BusinessInquiryForm({
  preselectedIndustry,
}: {
  preselectedIndustry?: IndustrySlug
}) {
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState<string>(preselectedIndustry || '')
  const [tierInterest, setTierInterest] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return // bot
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/business-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          phone,
          website,
          industry,
          tierInterest,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please try again or email us directly.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-ocean/20 bg-ocean/5 px-8 py-12 text-center">
        <div className="mb-4 text-4xl">⭐</div>
        <h3 className="display mb-3 text-2xl font-medium text-ink">
          Got it. We&apos;ll be in touch.
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">
          We review every inquiry and follow up within 1–2 business days. Keep an eye on{' '}
          <strong>{email}</strong> for our response.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Business name" required>
          <input
            type="text"
            name="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            maxLength={120}
            placeholder="The Salty Dog Cafe"
            className={inputBase}
          />
        </Field>
        <Field label="Your name" required>
          <input
            type="text"
            name="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            maxLength={80}
            placeholder="Jane Smith"
            className={inputBase}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Email address" required>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={160}
            placeholder="jane@yourbusiness.com"
            className={inputBase}
          />
        </Field>
        <Field label="Phone number">
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={30}
            placeholder="(843) 555-0100"
            className={inputBase}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Industry" required>
          <select
            name="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
            className={`${inputBase} cursor-pointer`}
          >
            <option value="">Select an industry…</option>
            {industries.map((ind) => (
              <option key={ind.slug} value={ind.slug}>
                {ind.icon} {ind.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Business website">
          <input
            type="url"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={240}
            placeholder="https://yourbusiness.com"
            className={inputBase}
          />
        </Field>
      </div>

      <Field
        label="Interested in…"
        hint="Free standard listings are always available. Featured partnerships have dedicated placement and editorial profile."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TIERS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                tierInterest === value
                  ? 'border-ocean bg-ocean/8 text-ink'
                  : 'border-rule-soft bg-sand text-ink-soft hover:border-ocean/30'
              }`}
            >
              <input
                type="radio"
                name="tierInterest"
                value={value}
                checked={tierInterest === value}
                onChange={() => setTierInterest(value)}
                className="accent-ocean"
              />
              {label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Anything else you'd like us to know">
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Awards, notable history, what makes your business stand out on Hilton Head, specific questions about listing options…"
          className={`${inputBase} resize-none`}
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-widest text-sand shadow-md transition-all duration-200 hover:bg-ocean hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Submit inquiry →'}
      </button>

      <p className="text-center text-xs text-ink-soft">
        We review every inquiry within 1–2 business days. No spam, no auto-enrollment.
      </p>
    </form>
  )
}
