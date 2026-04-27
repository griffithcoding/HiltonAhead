'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin error boundary]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[900px] p-8 font-mono text-[13px]">
      <div className="mb-4 text-[16px] font-semibold text-coral-deep">
        Admin route crashed
      </div>
      <div className="mb-2 text-ink-soft">
        This page is showing the actual server error so we can diagnose it.
        Take a screenshot and send it back.
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
        <a
          href="/admin"
          className="rounded-full border border-ocean-deep/30 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:border-ink"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
