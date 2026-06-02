'use client';

import { useEffect } from 'react';

export default function AdminTopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin top-level error boundary]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[900px] p-8 font-mono text-[13px]">
      <div className="mb-4 text-[16px] font-semibold text-coral-deep">
        Admin layout crashed
      </div>
      <div className="mb-2 text-ink-soft">
        The /admin layout itself threw — likely an import-time error or auth
        helper failure. Take a screenshot of this and send it back.
      </div>

      <div className="mt-6 rounded-sm border border-coral/30 bg-coral/5 p-4">
        <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-coral-deep">
          Error message
        </div>
        <div className="whitespace-pre-wrap break-words text-ink">
          {error?.message || '(no message)'}
        </div>
      </div>

      {error?.digest && (
        <div className="mt-4 rounded-sm border border-ocean-deep/20 bg-sand-soft p-4">
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            Vercel digest
          </div>
          <div className="text-ink">{error.digest}</div>
        </div>
      )}

      {error?.stack && (
        <div className="mt-4 rounded-sm border border-ocean-deep/20 bg-sand-soft p-4">
          <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            Stack
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words text-[11px] leading-snug text-ink-soft">
            {error.stack}
          </pre>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-ink bg-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral hover:border-coral"
        >
          Retry
        </button>
        {/*
          Intentional full-page navigation. A hard reload fully escapes the
          crashed admin layout; a soft <Link> nav could re-run the same broken
          import/auth code that triggered this boundary.
        */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="rounded-full border border-ocean-deep/30 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:border-ink"
        >
          Back to site
        </a>
      </div>
    </div>
  );
}
