'use client';

import { useState } from 'react';

export default function RealtorReferralForm({ neighborhoodSlug }: { neighborhoodSlug?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      intent: String(fd.get('intent') || ''),
      message: String(fd.get('message') || ''),
      neighborhoodSlug: neighborhoodSlug ?? '',
      sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      const res = await fetch('/api/real-estate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-palm/30 bg-palm-light/20 p-6 text-center">
        <p className="text-sm font-semibold text-palm">Thanks — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-rule-soft bg-sand-soft p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Name" aria-label="Your name" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <input name="email" type="email" required placeholder="Email" aria-label="Email address" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <input name="phone" placeholder="Phone (optional)" aria-label="Phone number (optional)" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
        <select name="intent" aria-label="What you're interested in" className="rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" defaultValue="">
          <option value="" disabled>I&apos;m interested in…</option>
          <option value="buying">Buying</option>
          <option value="selling">Selling</option>
          <option value="both">Both</option>
          <option value="browsing">Just browsing</option>
        </select>
      </div>
      <textarea name="message" rows={3} placeholder="Anything specific you're looking for?" aria-label="Message" className="w-full rounded-xl border border-rule-soft bg-white px-4 py-2.5 text-sm" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-widest text-sand transition-colors hover:bg-ocean disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Connect with our Realtor'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-coral-deep">Something went wrong. Please email hello@hiltonahead.com.</p>
      )}
      <p className="text-xs text-ink-soft">
        Referral disclosure: if you connect with our Realtor partner and complete
        a transaction, we may receive a referral fee — your costs are unaffected.
      </p>
    </form>
  );
}
