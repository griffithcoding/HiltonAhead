'use client';

import { useEffect, useMemo, useState } from 'react';
import QuizProgress from './QuizProgress';
import QuizStep from './QuizStep';
import { QUIZ_STEPS } from './quizSteps';
import type { QuizAnswers, QuizAnswersPartial } from './types';
import { rankMatches } from './scoring';
import { matchArchetypes } from '@/data/matchArchetypes';
import { trackVillaMatchEvent } from './eventsClient';
import MatchResults from './MatchResults';

const TOTAL_STEPS = QUIZ_STEPS.length;

export default function VillaMatchQuiz() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [stepIndex, setStepIndex] = useState(0); // 0..TOTAL_STEPS - 1
  const [answers, setAnswers] = useState<QuizAnswersPartial>({ partySize: 4 });
  const [done, setDone] = useState(false);

  const step = QUIZ_STEPS[stepIndex];
  const currentValue = answers[step.id];
  const canAdvance = currentValue !== undefined;

  useEffect(() => {
    trackVillaMatchEvent({ sessionId, eventType: 'start' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function handleChange(next: string | number) {
    setAnswers((prev) => ({ ...prev, [step.id]: next as never }));
  }

  function handleNext() {
    if (!canAdvance) return;
    trackVillaMatchEvent({
      sessionId,
      eventType: stepIndex === TOTAL_STEPS - 1 ? 'complete' : 'step_complete',
      step: stepIndex + 1,
      answers,
    });
    if (stepIndex < TOTAL_STEPS - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const ranked = useMemo(() => {
    if (!done) return null;
    // Cast safe: `done` is set only after all 5 fields are filled.
    return rankMatches(answers as QuizAnswers, matchArchetypes);
  }, [done, answers]);

  if (done && ranked) {
    return (
      <MatchResults
        ranked={ranked}
        answers={answers as QuizAnswers}
        sessionId={sessionId}
        onPdfRequested={() =>
          trackVillaMatchEvent({ sessionId, eventType: 'pdf_requested' })
        }
      />
    );
  }

  return (
    <div className="frame p-7 md:p-9">
      <QuizProgress current={stepIndex + 1} total={TOTAL_STEPS} />
      <div className="mt-7">
        <QuizStep step={step} value={currentValue} onChange={handleChange} />
      </div>
      <div className="mt-9 flex items-center gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="link-underline text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-coral disabled:opacity-40"
        >
          {stepIndex === TOTAL_STEPS - 1 ? 'See my matches' : 'Next'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
