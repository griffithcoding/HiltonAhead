// components/villa-match/quizSteps.ts
/**
 * The 5 quiz steps as data. <QuizStep> renders directly from these entries.
 * Order matters — index = step number - 1.
 */

import type { QuizStepConfig } from './types';

export const QUIZ_STEPS: QuizStepConfig[] = [
  {
    kind: 'radio-grid',
    id: 'tripType',
    question: 'What kind of trip is this?',
    options: [
      { value: 'couples',  label: 'A trip for two' },
      { value: 'family',   label: 'Family vacation' },
      { value: 'golf',     label: 'Golf trip' },
      { value: 'wedding',  label: 'Wedding or group' },
      { value: 'friends',  label: 'Friends getaway' },
    ],
  },
  {
    kind: 'number-stepper',
    id: 'partySize',
    question: 'How many of you?',
    min: 2,
    max: 30,
    labelTemplate: '{N} guests',
  },
  {
    kind: 'radio-grid',
    id: 'view',
    question: 'What does the view need to do?',
    options: [
      { value: 'ocean',         label: 'Ocean',               sublabel: 'I want the water from the kitchen' },
      { value: 'marsh',         label: 'Marsh or lagoon',     sublabel: 'Quiet wins' },
      { value: 'golf',          label: 'Golf course',         sublabel: 'Fairway view is the postcard' },
      { value: 'no-preference', label: 'No strong preference', sublabel: 'Surprise me' },
    ],
  },
  {
    kind: 'radio',
    id: 'walkToBeach',
    question: 'How important is walking to the beach?',
    options: [
      { value: 'must',          label: 'Must',          sublabel: 'Sand under my feet in three minutes' },
      { value: 'nice',          label: 'Nice to have',  sublabel: 'A 10-minute walk is fine' },
      { value: 'fine-to-drive', label: "We'll drive",   sublabel: "It's not the priority" },
    ],
  },
  {
    kind: 'radio',
    id: 'budget',
    question: "What's the budget for the whole trip?",
    subhead:
      "The villa fee is most of your trip. We don't optimize for upselling — pick the band that's real.",
    options: [
      { value: 'value',   label: 'Value',   sublabel: 'Under $5k' },
      { value: 'mid',     label: 'Mid',     sublabel: '$5k to $15k' },
      { value: 'premium', label: 'Premium', sublabel: '$15k to $30k' },
      { value: 'luxury',  label: 'Luxury',  sublabel: '$30k and up' },
    ],
  },
];
