'use client';

import type { QuizAnswers } from './types';

type Props = {
  sessionId: string;
  answers: QuizAnswers;
  topMatchIds: string[];
  onClose: () => void;
};

// Real implementation lands in Task 17.
export default function PdfTakeawayDialog({ onClose }: Props) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink/40">
      <div className="bg-white p-7">
        <p>PDF dialog placeholder</p>
        <button type="button" onClick={onClose} className="mt-4 underline">
          Close
        </button>
      </div>
    </div>
  );
}
