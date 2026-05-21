/**
 * Sequence routing — given a segment and a prospect's current state, pick
 * which sequence id from data/salesSequences.ts to enroll them in, and when
 * to fire touch 1.
 *
 * Pure function. No DB. The caller (sequenceEngine + capture route) is
 * responsible for writing the decision back to sales_prospects.
 */

import { getSequenceForSegment } from '@/data/salesSequences';

export type SalesStatusLike =
  | 'new'
  | 'queued'
  | 'contacted'
  | 'engaged'
  | 'qualified'
  | 'converted'
  | 'booked'
  | 'unresponsive'
  | 'unsubscribed'
  | 'bounced'
  | 'archived';

export interface RouteDecision {
  sequenceId: string; // empty string if not routable
  reason: string;
  startAtIso?: string; // ISO timestamp for first-touch fire time
}

export interface RouteInput {
  segment: string;
  campaignSlug?: string;
  status: SalesStatusLike;
  isNew: boolean;
  hasEmail: boolean;
}

/**
 * Five-minute enrichment buffer so any post-capture hook (Apollo, Hunter,
 * Clay) has a chance to fill in first_name / feeder_city / nearest_airport
 * before touch 1 renders.
 */
const ENRICHMENT_BUFFER_MS = 5 * 60 * 1000;

/**
 * Resolve a prospect to a sequence + start time. The decision tree:
 *
 *   1. !hasEmail              → no sequence (we only do email today)
 *   2. status is terminal     → no sequence (bounced / unsub / booked / etc.)
 *   3. status in {new,queued} → cold sequence for segment
 *   4. status is 'engaged'    → nurture sequence for segment
 *   5. anything else           → no sequence (leave to manual workflow)
 *
 * The general-cold-v1 fallback inside getSequenceForSegment handles the
 * 'unknown' segment case so we always have a cold sequence to enroll into
 * for any new prospect with an email.
 */
export function routeProspect(input: RouteInput): RouteDecision {
  if (!input.hasEmail) {
    return { sequenceId: '', reason: 'no_email' };
  }

  // Terminal statuses — never (re-)enroll.
  if (
    input.status === 'unsubscribed' ||
    input.status === 'bounced' ||
    input.status === 'booked' ||
    input.status === 'converted' ||
    input.status === 'archived'
  ) {
    return { sequenceId: '', reason: `status_${input.status}` };
  }

  const startAtIso = new Date(Date.now() + ENRICHMENT_BUFFER_MS).toISOString();

  // Cold enrollment for fresh prospects.
  if (input.status === 'new' || input.status === 'queued') {
    const seq = getSequenceForSegment(input.segment, 'cold');
    if (!seq) {
      // Should be impossible — general-cold-v1 is the universal fallback —
      // but stay defensive so the capture route never throws.
      return { sequenceId: '', reason: 'no_cold_sequence_for_segment' };
    }
    return {
      sequenceId: seq.id,
      reason: `cold_for_${input.segment || 'unknown'}`,
      startAtIso,
    };
  }

  // Nurture promotion after engagement signal.
  if (input.status === 'engaged') {
    const seq = getSequenceForSegment(input.segment, 'nurture');
    if (!seq) {
      // No nurture for general segment — leave to manual workflow.
      return { sequenceId: '', reason: 'no_nurture_for_segment' };
    }
    return {
      sequenceId: seq.id,
      reason: `nurture_for_${input.segment || 'unknown'}`,
      startAtIso,
    };
  }

  // 'contacted', 'qualified', 'unresponsive' — leave to manual workflow.
  return { sequenceId: '', reason: `no_route_for_status_${input.status}` };
}
