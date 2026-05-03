'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { getActiveSponsor, getSlot } from '@/data/sponsorships';

const TRACK_ENDPOINT = '/api/sponsor/track';

function fireBeacon(payload: string) {
  if (typeof window === 'undefined') return;
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(TRACK_ENDPOINT, blob);
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}

/**
 * Drop-in display ad slot. Renders the active sponsor for the given slot id;
 * if no sponsor is booked, renders a "Your business here" house ad linking to
 * /advertise so unsold inventory becomes a lead-gen unit.
 *
 * Usage:
 *   <SponsorSlot id="local-restaurants-pin" />
 *
 * Tracking:
 *   - One impression beacon on first mount per page-view.
 *   - One click beacon on every CTA click.
 *
 * The sponsor link carries rel="sponsored nofollow noopener noreferrer" — same
 * discipline as partners/affiliate, no exceptions.
 */
export default function SponsorSlot({ id }: { id: string }) {
  const slot = getSlot(id);
  const sponsor = slot ? getActiveSponsor(id) : undefined;
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (!slot) return;
    fireBeacon(
      JSON.stringify({
        slotId: id,
        sponsorId: sponsor?.sponsorId ?? null,
        eventType: 'sponsor_impression',
      }),
    );
  }, [id, slot, sponsor?.sponsorId]);

  if (!slot) return null;

  const handleClick = () => {
    fireBeacon(
      JSON.stringify({
        slotId: id,
        sponsorId: sponsor?.sponsorId ?? null,
        eventType: 'sponsor_click',
      }),
    );
  };

  if (!sponsor) {
    return (
      <aside
        aria-label="Advertise here"
        className="rounded-2xl border border-dashed border-rule-soft bg-sand-soft/60 p-5 md:p-6"
      >
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft/70">
          Open ad slot
        </div>
        <h3 className="display text-lg font-medium leading-snug text-ink md:text-xl">
          Your business here
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Reach Hilton Head visitors actively planning a trip. Self-serve, monthly,
          cancel anytime.
        </p>
        <div className="mt-4">
          <Link
            href="/advertise"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
          >
            Advertise on Hilton Ahead →
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label={`Sponsored: ${sponsor.sponsorName}`}
      className="rounded-2xl border border-rule-soft bg-sand-soft p-5 shadow-sm md:p-6"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-coral">
          Sponsored
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
          {sponsor.sponsorName}
        </span>
      </div>
      <h3 className="display text-lg font-medium leading-snug text-ink md:text-xl">
        {sponsor.headline}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {sponsor.body}
      </p>
      <div className="mt-4">
        <a
          href={sponsor.url}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
        >
          Visit {sponsor.sponsorName} →
        </a>
      </div>
    </aside>
  );
}
