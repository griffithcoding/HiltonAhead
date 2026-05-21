'use client';

/**
 * Tiny client island used inside the syndication detail page so we don't
 * convert the whole page to a client component. Copies the supplied text
 * to the clipboard with a brief inline "Copied" confirmation.
 */

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label = 'Copy',
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'ok' | 'err'>('idle');

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setState('ok');
    } catch {
      setState('err');
    } finally {
      window.setTimeout(() => setState('idle'), 1400);
    }
  }

  const display =
    state === 'ok' ? 'Copied' : state === 'err' ? 'Copy failed' : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        'inline-flex items-center rounded-sm border border-ocean-deep/30 bg-sand px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ocean-deep transition hover:border-coral hover:text-coral-deep'
      }
    >
      {display}
    </button>
  );
}
