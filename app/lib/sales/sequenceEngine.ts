/**
 * Sales sequence engine.
 *
 * Reads sales_prospects rows whose next_touch_at is due, renders the current
 * touch from data/salesSequences.ts, sends via Resend, logs to sales_touches,
 * and advances the cursor (sequence_step + next_touch_at).
 *
 * Architecture invariants:
 *   - Uses createServiceClient — always server-side.
 *   - Idempotent per (prospect, step): the sequence_step is advanced AFTER
 *     a successful Resend send (or after a permanent fail). A crashed worker
 *     re-trying the same prospect re-sends the same step at most once.
 *   - Bounded by batchSize (default 50). The cron runs every 30 minutes,
 *     so we cap throughput to keep Resend rate-limit safe and to avoid
 *     pathological loops.
 *   - Best-effort: every per-prospect error is caught, logged, and counted.
 *     A single bad row never kills the batch.
 *
 * Outside the batch loop:
 *   - advanceProspect(prospectId) — manual nudge for the admin dashboard
 *   - renderTouch(touch, prospect)  — exported so a "preview" UI can dry-run a
 *                                     send without committing
 */

import { brand } from '@/data/brand';
import {
  getSequence,
  type Sequence,
  type SequenceTouch,
} from '@/data/salesSequences';
import { sendEmail } from '@/app/lib/email';
import {
  signSalesUnsubscribeToken,
} from '@/app/lib/salesUnsubscribe';
import { withSalesUtm } from '@/app/lib/salesTracking';
import { createServiceClient } from '@/utils/supabase/service';
import { routeProspect, type SalesStatusLike } from './sequenceRouter';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_BATCH_SIZE = 50;
const SENDER_NAME = 'Will';

/**
 * Lookup: feeder-city / metro slug → nearest commercial airport for the
 * merge field. Used by the engine's renderer and exported so the docs /
 * admin UI can preview which airport will appear in the merged copy.
 */
export const NEAREST_AIRPORT: Record<string, string> = {
  atlanta: 'ATL',
  charlotte: 'CLT',
  nyc: 'LGA',
  newyork: 'LGA',
  newyorkcity: 'LGA',
  ny: 'LGA',
  dc: 'DCA',
  washington: 'DCA',
  boston: 'BOS',
  chicago: 'ORD',
  cincinnati: 'CVG',
  nashville: 'BNA',
  raleigh: 'RDU',
  'raleigh-durham': 'RDU',
  greenville: 'GSP',
  'greenville-sc': 'GSP',
  jacksonville: 'JAX',
  orlando: 'MCO',
  cleveland: 'CLE',
  pittsburgh: 'PIT',
  toronto: 'YYZ',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProspectRow {
  id: string;
  email: string;
  first_name: string | null;
  full_name: string | null;
  feeder_city: string | null;
  city: string | null;
  status: SalesStatusLike;
  current_sequence: string | null;
  sequence_step: number;
  do_not_contact: boolean;
  source_campaign: string | null;
  enrichment_data?: Record<string, unknown> | null;
}

export interface RenderResult {
  subject: string;
  body: string;
  ctaUrl: string;
}

export interface ProcessResult {
  processed: number;
  sent: number;
  errors: number;
  details: Array<{
    prospectId: string;
    touchStep: number;
    outcome: 'sent' | 'skipped' | 'errored';
    note?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Merge field rendering
// ---------------------------------------------------------------------------

/**
 * Normalize a city/feeder-city string into the airport-lookup key (lower,
 * no whitespace, strip punctuation).
 */
function airportKey(city: string): string {
  return city.toLowerCase().replace(/[^a-z]/g, '');
}

function nearestAirportFor(city: string | null | undefined): string {
  if (!city) return 'your airport';
  const k = airportKey(city);
  return NEAREST_AIRPORT[k] || 'your airport';
}

function firstNameOf(row: Pick<ProspectRow, 'first_name' | 'full_name'>): string {
  if (row.first_name && row.first_name.trim()) return row.first_name.trim();
  if (row.full_name) {
    const first = row.full_name.trim().split(/\s+/)[0];
    if (first) return first;
  }
  return 'there';
}

/**
 * Build the {{merge_field}} → value table for a given prospect.
 * Unsupported tokens render as the literal string '(not provided)'.
 */
export interface MergeContext {
  first_name: string;
  feeder_city: string;
  nearest_airport: string;
  kid_ages: string;
  country_club: string;
  sender_name: string;
  unsubscribe_url: string;
  // B2B directory fields — populated for the b2b-directory-upgrade-v1 sequence
  business_name: string;
  total_interactions: string;
  listing_url: string;
}

export function buildMergeContext(
  row: ProspectRow,
  opts: { unsubscribeUrl: string },
): MergeContext {
  const feederCity = (row.feeder_city || row.city || '').trim();

  // Pull soft enrichment fields if a downstream job has filled them in.
  const enrich = (row.enrichment_data || {}) as Record<string, unknown>;
  const kidAges = typeof enrich.kid_ages === 'string' ? enrich.kid_ages : '';
  const countryClub = typeof enrich.country_club === 'string' ? enrich.country_club : '';

  // B2B directory fields — set by the directory-prospect-scan cron
  const businessName = typeof enrich.business_name === 'string' ? enrich.business_name : '';
  const totalInteractions =
    typeof enrich.total_interactions === 'number'
      ? String(enrich.total_interactions)
      : typeof enrich.total_interactions === 'string'
        ? enrich.total_interactions
        : '';
  const listingUrl = typeof enrich.listing_url === 'string' ? enrich.listing_url : '';

  return {
    first_name: firstNameOf(row),
    feeder_city: feederCity || 'your city',
    nearest_airport: nearestAirportFor(feederCity),
    kid_ages: kidAges || 'your kids',
    country_club: countryClub || 'your home club',
    sender_name: SENDER_NAME,
    unsubscribe_url: opts.unsubscribeUrl,
    business_name: businessName || 'your business',
    total_interactions: totalInteractions || '0',
    listing_url: listingUrl,
  };
}

/**
 * Replace every `{{token}}` in `text` with the matching value from `ctx`.
 * Unknown tokens are left as-is so we can spot them in the admin preview.
 */
function applyMerge(text: string, ctx: MergeContext): string {
  return text.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_, raw) => {
    const key = String(raw).toLowerCase() as keyof MergeContext;
    const value = ctx[key];
    if (typeof value === 'string' && value.length > 0) return value;
    return `{{${raw}}}`;
  });
}

// ---------------------------------------------------------------------------
// Touch rendering
// ---------------------------------------------------------------------------

/**
 * Render a single touch for a prospect. Pure-ish — takes a prospect row +
 * touch + context and returns the final subject / body / ctaUrl ready to
 * hand to Resend.
 *
 * The body ends with a CAN-SPAM-style footer: physical address + a literal
 * one-click unsubscribe URL.
 */
export async function renderTouch(
  touch: SequenceTouch,
  prospect: ProspectRow,
  opts?: { sequenceId?: string },
): Promise<RenderResult> {
  const unsubToken = signSalesUnsubscribeToken(prospect.email);
  const unsubscribeUrl = `${brand.url}/api/sales-unsubscribe?token=${unsubToken}`;
  const ctx = buildMergeContext(prospect, { unsubscribeUrl });

  const subject = applyMerge(touch.subject, ctx);
  const bodyMerged = applyMerge(touch.body, ctx);

  // Stamp the CTA URL with sales UTM.
  const ctaUrl = withSalesUtm(
    touch.ctaUrl,
    opts?.sequenceId || prospect.current_sequence || 'sales',
    'email',
    `touch-${touch.step}`,
  );

  const footer = [
    '',
    '—',
    `Unsubscribe in one click: ${unsubscribeUrl}`,
    'Hilton Ahead Travel Co · Hilton Head Island, SC 29928',
    'hello@hiltonahead.com',
  ].join('\n');

  const body = `${bodyMerged}${footer}`;
  return { subject, body, ctaUrl };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysToMs(days: number): number {
  return Math.max(0, days) * 24 * 60 * 60 * 1000;
}

function plainTextToHtml(text: string): string {
  const escape = (s: string): string =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  // Auto-link http(s) URLs so the unsubscribe link in the footer is clickable.
  const linked = escape(text).replace(
    /(https?:\/\/[^\s<>]+)/g,
    '<a href="$1" style="color:#0F7080;text-decoration:underline;">$1</a>',
  );
  return `<!doctype html><html><body style="margin:0;padding:0;background:#FCFAF5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0E2A38;"><div style="max-width:640px;margin:0 auto;padding:32px 24px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${linked}</div></body></html>`;
}

/**
 * Heuristic for whether the Resend response indicates a permanent send
 * failure (hard bounce, suppressed address, validation rejection).
 * Transient network / 5xx errors are NOT treated as permanent.
 */
function isPermanentFailure(error: string | undefined): boolean {
  if (!error) return false;
  const e = error.toLowerCase();
  return (
    e.includes('bounce') ||
    e.includes('invalid') ||
    e.includes('suppressed') ||
    e.includes('blocked') ||
    e.includes('does not exist') ||
    e.includes('rejected')
  );
}

// ---------------------------------------------------------------------------
// Batch processor
// ---------------------------------------------------------------------------

/**
 * Find every prospect whose touch is due, send it, advance the cursor.
 * Returns counters for the cron caller to surface in logs.
 *
 * The query intentionally restricts to status ∈ {queued, contacted, engaged}.
 * 'new' rows are bumped to 'queued' by the capture route at enrollment time;
 * if a row is still 'new' here it means routing failed and we don't want to
 * re-attempt blindly.
 */
export async function processDueTouches(
  opts?: { batchSize?: number; nowIso?: string },
): Promise<ProcessResult> {
  const result: ProcessResult = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: [],
  };

  const batchSize = opts?.batchSize ?? DEFAULT_BATCH_SIZE;
  const nowIso = opts?.nowIso ?? new Date().toISOString();

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error('[sequence-engine] service client unavailable:', err);
    return result;
  }

  const { data: rows, error } = await supabase
    .from('sales_prospects')
    .select(
      'id, email, first_name, full_name, feeder_city, city, status, current_sequence, sequence_step, do_not_contact, source_campaign, enrichment_data',
    )
    .lte('next_touch_at', nowIso)
    .not('email', 'is', null)
    .not('current_sequence', 'is', null)
    .eq('do_not_contact', false)
    .in('status', ['queued', 'contacted', 'engaged'])
    .order('next_touch_at', { ascending: true })
    .limit(batchSize);

  if (error) {
    console.error('[sequence-engine] query failed:', error);
    return result;
  }
  if (!rows || rows.length === 0) return result;

  for (const raw of rows) {
    result.processed += 1;
    const row = raw as unknown as ProspectRow;
    try {
      await processOne(supabase, row, result);
    } catch (err) {
      console.error(
        '[sequence-engine] unexpected error for prospect',
        row.id,
        err,
      );
      result.errors += 1;
      result.details.push({
        prospectId: row.id,
        touchStep: row.sequence_step,
        outcome: 'errored',
        note: err instanceof Error ? err.message : 'unknown',
      });
    }
  }

  return result;
}

async function processOne(
  supabase: ReturnType<typeof createServiceClient>,
  row: ProspectRow,
  result: ProcessResult,
): Promise<void> {
  const sequenceId = row.current_sequence ?? '';
  let sequence: Sequence | undefined = sequenceId
    ? getSequence(sequenceId)
    : undefined;

  // Fallback: re-route if the stored sequence id is unknown (catalog rename, etc.)
  if (!sequence) {
    const decision = routeProspect({
      segment: 'unknown',
      campaignSlug: undefined,
      status: row.status,
      isNew: false,
      hasEmail: Boolean(row.email),
    });
    if (decision.sequenceId) sequence = getSequence(decision.sequenceId);
  }

  if (!sequence) {
    result.details.push({
      prospectId: row.id,
      touchStep: row.sequence_step,
      outcome: 'skipped',
      note: 'no_sequence_resolved',
    });
    return;
  }

  // sequence_step is 0-indexed: 0 means "touch 1 is the next to fire".
  const idx = row.sequence_step;
  const touch = sequence.touches[idx];

  if (!touch) {
    // Sequence complete — settle the prospect.
    const newStatus: SalesStatusLike =
      row.status === 'engaged' ? 'engaged' : 'unresponsive';
    await supabase
      .from('sales_prospects')
      .update({
        status: newStatus,
        next_touch_at: null,
      })
      .eq('id', row.id);
    result.details.push({
      prospectId: row.id,
      touchStep: idx,
      outcome: 'skipped',
      note: `sequence_complete->${newStatus}`,
    });
    return;
  }

  const rendered = await renderTouch(touch, row, { sequenceId: sequence.id });

  // Send via Resend.
  const sendResult = await sendEmail({
    to: row.email,
    subject: rendered.subject,
    text: rendered.body,
    html: plainTextToHtml(rendered.body),
    tags: [
      { name: 'type', value: 'sales_sequence' },
      { name: 'sequence', value: sequence.id },
      { name: 'touch', value: String(touch.step) },
    ],
  });

  // Permanent failure → bounce out.
  if (sendResult.ok === false && 'error' in sendResult && isPermanentFailure(sendResult.error)) {
    await supabase
      .from('sales_prospects')
      .update({
        status: 'bounced',
        next_touch_at: null,
      })
      .eq('id', row.id);
    await supabase.from('sales_touches').insert({
      prospect_id: row.id,
      campaign_id: row.source_campaign,
      channel: 'email',
      touch_type: 'email_bounce',
      sequence: sequence.id,
      sequence_step: touch.step,
      subject: rendered.subject,
      body_preview: rendered.body.slice(0, 300),
      metadata: { error: sendResult.error },
    });
    result.errors += 1;
    result.details.push({
      prospectId: row.id,
      touchStep: touch.step,
      outcome: 'errored',
      note: `permanent_fail:${sendResult.error.slice(0, 80)}`,
    });
    return;
  }

  // Transient failure — leave next_touch_at as-is so we retry next tick.
  if (sendResult.ok === false && !('skipped' in sendResult)) {
    result.errors += 1;
    result.details.push({
      prospectId: row.id,
      touchStep: touch.step,
      outcome: 'errored',
      note: `send_failed:${'error' in sendResult ? sendResult.error.slice(0, 80) : 'unknown'}`,
    });
    return;
  }

  // Skipped (no Resend key): treat as a soft skip so dev environments don't churn.
  if (sendResult.ok === false && 'skipped' in sendResult) {
    result.details.push({
      prospectId: row.id,
      touchStep: touch.step,
      outcome: 'skipped',
      note: 'resend_not_configured',
    });
    return;
  }

  // Success → log the touch + advance the cursor.
  const messageId = sendResult.ok === true ? sendResult.id : '';

  await supabase.from('sales_touches').insert({
    prospect_id: row.id,
    campaign_id: row.source_campaign,
    channel: 'email',
    touch_type: 'email_sent',
    sequence: sequence.id,
    sequence_step: touch.step,
    subject: rendered.subject,
    body_preview: rendered.body.slice(0, 300),
    external_id: messageId || null,
    metadata: {
      cta_url: rendered.ctaUrl,
      is_breakup: Boolean(touch.isBreakup),
    },
  });

  // Compute next_touch_at from dayOffset deltas between this and the next touch.
  const nextTouch = sequence.touches[idx + 1];
  let nextTouchAt: string | null = null;
  if (nextTouch) {
    const deltaDays = nextTouch.dayOffset - touch.dayOffset;
    nextTouchAt = new Date(Date.now() + daysToMs(deltaDays)).toISOString();
  }

  const newStatus: SalesStatusLike =
    row.status === 'queued' ? 'contacted' : row.status;

  await supabase
    .from('sales_prospects')
    .update({
      sequence_step: idx + 1,
      next_touch_at: nextTouchAt,
      last_touched_at: new Date().toISOString(),
      status: newStatus,
    })
    .eq('id', row.id);

  result.sent += 1;
  result.details.push({
    prospectId: row.id,
    touchStep: touch.step,
    outcome: 'sent',
  });
}

// ---------------------------------------------------------------------------
// Single-prospect helper for admin "send next now" actions
// ---------------------------------------------------------------------------

/**
 * Run the engine for one prospect, ignoring next_touch_at scheduling. Used
 * by the admin "send next touch now" button. Same contracts as the batch
 * loop — writes a sales_touches row and advances sequence_step on success.
 */
export async function advanceProspect(prospectId: string): Promise<void> {
  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error('[sequence-engine] service client unavailable:', err);
    return;
  }

  const { data } = await supabase
    .from('sales_prospects')
    .select(
      'id, email, first_name, full_name, feeder_city, city, status, current_sequence, sequence_step, do_not_contact, source_campaign, enrichment_data',
    )
    .eq('id', prospectId)
    .maybeSingle();

  if (!data) return;
  const row = data as unknown as ProspectRow;
  if (!row.email || row.do_not_contact) return;

  const result: ProcessResult = { processed: 0, sent: 0, errors: 0, details: [] };
  await processOne(supabase, row, result);
}
