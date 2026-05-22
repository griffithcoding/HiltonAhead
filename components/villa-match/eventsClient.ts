// components/villa-match/eventsClient.ts
// Full implementation in Task 13. Stub here so state machine compiles.
import type { EventType, QuizAnswersPartial } from './types';

const ENDPOINT = '/api/villa-match/events';

export type EventPayload = {
  sessionId: string;
  eventType: EventType;
  step?: number;
  answers?: QuizAnswersPartial;
};

export function trackVillaMatchEvent(payload: EventPayload): void {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      return;
    } catch {
      // fall through
    }
  }

  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // swallow — analytics never blocks UX
  }
}
