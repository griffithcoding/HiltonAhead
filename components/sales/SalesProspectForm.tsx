'use client';

/**
 * SalesProspectForm — embeddable lead-capture form for sales landing pages.
 *
 * Drop into any landing page tied to a sales_campaigns row. Captures
 * email + name + zip, posts to /api/sales-prospects with the campaign
 * attribution attached, and renders a success state in-place.
 *
 * Attribution: the campaign slug + channel are passed as props (set by the
 * page that knows which campaign it serves). First-touch UTMs persisted in
 * cookies by captureLandingAttribution() are folded into the source_notes
 * payload so a multi-step funnel still credits the original click.
 *
 * Palette: sand / ocean / coral / palm / ink tokens from app/globals.css.
 */

import { useEffect, useState, type FormEvent } from 'react';
import {
  parseAttributionFromCookies,
  captureLandingAttribution,
  type SalesChannel,
  type SalesSegment,
} from '@/app/lib/salesTracking';

export interface SalesProspectFormProps {
  campaignSlug: string;
  segment: SalesSegment;
  source_channel: SalesChannel;
  headline?: string;
  subhead?: string;
  ctaLabel?: string;
  /**
   * Landing-page path to send to the segmentation engine as a signal.
   * Defaults to window.location.pathname on the client. Pass an explicit
   * value to override (useful when the form is embedded in a modal).
   */
  sourcePage?: string;
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export default function SalesProspectForm({
  campaignSlug,
  segment,
  source_channel,
  headline = 'Get the local read on Hilton Head.',
  subhead = 'Tell us a little about your trip and we’ll send a custom plan inside one business day. No commitment, no call center.',
  ctaLabel = 'Get my plan',
  sourcePage,
}: SalesProspectFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });

  // Capture landing-page UTMs into first-party cookies on mount.
  useEffect(() => {
    captureLandingAttribution();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === 'submitting') return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState({ kind: 'error', message: 'Please enter a valid email.' });
      return;
    }

    setState({ kind: 'submitting' });

    const attribution = parseAttributionFromCookies();
    const intakeBits: string[] = [];
    if (attribution.campaign && attribution.campaign !== campaignSlug) {
      intakeBits.push(`first_touch_campaign=${attribution.campaign}`);
    }
    if (attribution.channel && attribution.channel !== source_channel) {
      intakeBits.push(`first_touch_channel=${attribution.channel}`);
    }
    if (attribution.content) intakeBits.push(`utm_content=${attribution.content}`);

    // Landing-page path is one of the strongest signals the segmentation
    // engine uses. Default to the current path on the client; allow callers
    // to override via the `sourcePage` prop for embedded contexts (modals).
    const resolvedSourcePage =
      sourcePage ??
      (typeof window !== 'undefined' ? window.location.pathname : undefined);

    try {
      const res = await fetch('/api/sales-prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          full_name: name.trim() || null,
          zip: zip.trim() || null,
          segment,
          source_channel,
          source_campaign_slug: campaignSlug,
          intake_notes: intakeBits.length ? intakeBits.join('; ') : null,
          source_page: resolvedSourcePage ?? null,
          utm_content: attribution.content ?? null,
        }),
      });

      if (!res.ok) {
        setState({
          kind: 'error',
          message: 'Could not submit. Please try again or email us directly.',
        });
        return;
      }

      setState({ kind: 'success' });
    } catch {
      setState({
        kind: 'error',
        message: 'Network error. Please try again in a moment.',
      });
    }
  }

  if (state.kind === 'success') {
    return (
      <div className="rounded-sm border border-palm/30 bg-sand-soft p-8">
        <div className="eyebrow eyebrow-coral mb-3">You’re in</div>
        <h3 className="display text-[26px] leading-[1.1] text-ink">
          Thanks — check your inbox.
        </h3>
        <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
          We’ll come back inside one business day with a sample plan and a
          local read on the dates you’re considering. Reply to that email and
          you’re talking directly to the founder.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-ocean-deep/15 bg-sand-soft p-6 sm:p-8"
      data-campaign={campaignSlug}
      data-channel={source_channel}
      data-segment={segment}
    >
      <div className="eyebrow eyebrow-ocean mb-3">The Insider Plan</div>
      <h3 className="display text-[24px] leading-[1.1] text-ink sm:text-[28px]">
        {headline}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">{subhead}</p>

      <div className="mt-6 grid gap-3">
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="mt-1 w-full rounded-sm border border-ocean-deep/20 bg-sand px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Name <span className="font-normal normal-case tracking-normal text-ink-soft/70">(optional)</span>
          </span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last"
            maxLength={120}
            className="mt-1 w-full rounded-sm border border-ocean-deep/20 bg-sand px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Zip <span className="font-normal normal-case tracking-normal text-ink-soft/70">(helps us read the market)</span>
          </span>
          <input
            type="text"
            name="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="30309"
            maxLength={10}
            className="mt-1 w-full rounded-sm border border-ocean-deep/20 bg-sand px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
            autoComplete="postal-code"
            inputMode="numeric"
          />
        </label>
      </div>

      {state.kind === 'error' && (
        <div className="mt-4 rounded-sm border border-coral/40 bg-coral/10 px-3 py-2 text-[13px] text-coral-deep">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={state.kind === 'submitting'}
        className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sand transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === 'submitting' ? 'Sending…' : ctaLabel}
      </button>

      <p className="mt-4 text-[11px] leading-[1.55] text-ink-soft/80">
        No spam, no resale of your address. One reply from a human, then you
        decide. <span className="whitespace-nowrap">Unsubscribe in one click anytime.</span>
      </p>
    </form>
  );
}
