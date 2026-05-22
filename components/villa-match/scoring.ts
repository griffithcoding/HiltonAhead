// components/villa-match/scoring.ts
/**
 * Pure scoring functions for the Villa Match quiz. No React, no I/O —
 * runs client-side as a useMemo result.
 *
 * score = tripType * 0.30 + budget * 0.25 + walk * 0.20 + view * 0.15 + party * 0.10
 *
 * Hard floor: budget more than 1 band off the archetype disqualifies the
 * archetype entirely (returns score 0). Everything else is partial credit.
 */

import type { MatchArchetype } from '@/data/matchArchetypes';
import type { QuizAnswers, Budget } from './types';

const BUDGET_ORDER: Budget[] = ['value', 'mid', 'premium', 'luxury'];

function budgetDistance(a: Budget, b: Budget): number {
  return Math.abs(BUDGET_ORDER.indexOf(a) - BUDGET_ORDER.indexOf(b));
}

function scoreTripType(answers: QuizAnswers, arc: MatchArchetype): number {
  return arc.bestForTripTypes.includes(answers.tripType) ? 1 : 0.3;
}

function scoreBudget(answers: QuizAnswers, arc: MatchArchetype): number {
  const d = budgetDistance(answers.budget, arc.budgetBand);
  if (d === 0) return 1;
  if (d === 1) return 0.5;
  return 0; // hard floor — caller treats 0 as "disqualified"
}

function scoreWalk(answers: QuizAnswers, arc: MatchArchetype): number {
  const a = answers.walkToBeach;
  const w = arc.walkToBeach;
  if ((a === 'must' && w === 'steps') || (a === 'nice' && w === 'short-walk') || (a === 'fine-to-drive' && w === 'drive')) {
    return 1;
  }
  // partial credit: must + short-walk; nice + (steps OR drive)
  if ((a === 'must' && w === 'short-walk') || (a === 'nice' && (w === 'steps' || w === 'drive'))) {
    return 0.7;
  }
  return 0.3;
}

function scoreView(answers: QuizAnswers, arc: MatchArchetype): number {
  if (answers.view === 'no-preference') return 0.7;
  if (answers.view === arc.view) return 1;
  // archetype 'mixed' is a soft match for any non-no-preference choice
  if (arc.view === 'mixed') return 0.7;
  return 0.3;
}

function scoreParty(answers: QuizAnswers, arc: MatchArchetype): number {
  const lower = arc.bedrooms.min * 1.5;
  const upper = arc.bedrooms.max * 2;
  return answers.partySize >= lower && answers.partySize <= upper ? 1 : 0.5;
}

export function scoreArchetype(answers: QuizAnswers, arc: MatchArchetype): number {
  const budget = scoreBudget(answers, arc);
  if (budget === 0) return 0; // hard-floor disqualification
  return (
    scoreTripType(answers, arc) * 0.3 +
    budget * 0.25 +
    scoreWalk(answers, arc) * 0.2 +
    scoreView(answers, arc) * 0.15 +
    scoreParty(answers, arc) * 0.1
  );
}

export type ScoredArchetype = { archetype: MatchArchetype; score: number };

export function rankMatches(
  answers: QuizAnswers,
  archetypes: MatchArchetype[],
  topN = 3,
): ScoredArchetype[] {
  return archetypes
    .map((arc) => ({ archetype: arc, score: scoreArchetype(answers, arc) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // stable tie-breaker: id ascending
      return a.archetype.id.localeCompare(b.archetype.id);
    })
    .slice(0, topN);
}
