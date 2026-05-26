// components/villa-match/types.ts

export type TripType = 'couples' | 'family' | 'golf' | 'wedding' | 'friends';
export type View = 'ocean' | 'marsh' | 'golf' | 'no-preference';
export type WalkToBeach = 'must' | 'nice' | 'fine-to-drive';
export type Budget = 'value' | 'mid' | 'premium' | 'luxury';

export type ArchetypeView = 'ocean' | 'marsh' | 'golf' | 'mixed';
export type ArchetypeWalk = 'steps' | 'short-walk' | 'drive';

export type QuizAnswers = {
  tripType: TripType;
  partySize: number; // 2..30
  view: View;
  walkToBeach: WalkToBeach;
  budget: Budget;
};

export type QuizAnswersPartial = Partial<QuizAnswers>;

export type EventType = 'start' | 'step_complete' | 'complete' | 'pdf_requested';

/**
 * Step config — drives the `<QuizStep>` renderer purely from data.
 * One entry per question, in display order.
 */
export type QuizStepConfig =
  | {
      kind: 'radio';
      id: keyof QuizAnswers;
      question: string;
      subhead?: string;
      options: Array<{ value: string; label: string; sublabel?: string }>;
    }
  | {
      kind: 'radio-grid';
      id: keyof QuizAnswers;
      question: string;
      subhead?: string;
      options: Array<{ value: string; label: string; sublabel?: string; icon?: string }>;
    }
  | {
      kind: 'number-stepper';
      id: keyof QuizAnswers;
      question: string;
      subhead?: string;
      min: number;
      max: number;
      labelTemplate: string; // e.g., "{N} guests"
    };
