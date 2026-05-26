// components/villa-match/MatchResults.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import MatchResultCard from './MatchResultCard';
import PdfTakeawayDialog from './PdfTakeawayDialog';
import type { ScoredArchetype } from './scoring';
import type { QuizAnswers } from './types';
import { brand } from '@/data/brand';

type Props = {
  ranked: ScoredArchetype[];
  answers: QuizAnswers;
  sessionId: string;
  onPdfRequested?: () => void;
};

export default function MatchResults({ ranked, answers, sessionId, onPdfRequested }: Props) {
  const [pdfOpen, setPdfOpen] = useState(false);

  if (ranked.length === 0) {
    return <EmptyState />;
  }

  const [top, ...alts] = ranked;
  const prefill = encodeURIComponent(
    JSON.stringify({
      tripType: answers.tripType,
      partySize: answers.partySize,
      view: answers.view,
      walkToBeach: answers.walkToBeach,
      budget: answers.budget,
      topMatchId: top.archetype.id,
      neighborhoodSlug: top.archetype.neighborhoodSlug,
    }),
  );

  return (
    <div className="space-y-8">
      <MatchResultCard archetype={top.archetype} variant="top" />

      {alts.length > 0 && (
        <div>
          <div className="eyebrow text-ink-soft">Or, depending on the week</div>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            {alts.map((a) => (
              <MatchResultCard key={a.archetype.id} archetype={a.archetype} variant="alt" />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center">
        <Link
          href={`/itinerary?prefill=${prefill}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
        >
          Start checking dates
          <span aria-hidden="true">→</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setPdfOpen(true);
            onPdfRequested?.();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-cream"
        >
          Email me a one-page PDF
        </button>

        {brand.scheduling.calendly.url && (
          <a
            href={brand.scheduling.calendly.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline ml-auto text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
          >
            Or book a 30-min call ↗
          </a>
        )}
      </div>

      {pdfOpen && (
        <PdfTakeawayDialog
          sessionId={sessionId}
          answers={answers}
          topMatchIds={ranked.map((r) => r.archetype.id)}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="frame p-7 md:p-9">
      <h2 className="display text-[26px] leading-[1.15] text-ink md:text-[32px]">
        Your trip doesn&rsquo;t fit a template &mdash;{' '}
        <span className="display-italic">and that&rsquo;s actually a good sign.</span>
      </h2>
      <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
        Tell us a bit more, and we&rsquo;ll build it from scratch.
      </p>
      <div className="mt-7">
        <Link
          href="/itinerary"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral"
        >
          Start the itinerary
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
