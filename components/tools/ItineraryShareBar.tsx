'use client';

import { useState } from 'react';

/**
 * Save/share bar for the Hilton Head Itinerary Builder.
 *
 * The full plan lives in the URL (SSR-rendered), so "share" is just copying
 * the current location, and "print" is the browser's own print dialog against
 * the print CSS in globals.css (which hides nav/controls via .print-hide).
 */
export default function ItineraryShareBar() {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    if (typeof window !== 'undefined') window.print();
  }

  async function handleCopy() {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) — no-op.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-transparent px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-coral hover:text-coral"
      >
        Print
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-transparent px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-coral hover:text-coral"
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>
    </div>
  );
}
