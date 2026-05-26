/**
 * Cron-safe lead reply send helper.
 *
 * Mirrors app/lib/outreach/sendCron.ts but writes the activity row to
 * lead_activity (with lead_table + lead_id) instead of outreach_activity.
 *
 * Used by /api/cron/lead-sequence-tick to auto-send followup_1 / followup_2.
 *
 * Daily send cap is shared with manual lead replies — we count
 * lead_activity rows of kind='email_sent' for today. Outreach has its
 * own cap on its own table; both share the same Gmail API budget but
 * keeping the caps independent lets us send up to 200 lead replies AND
 * 200 outreach pitches per day before hitting Gmail's 500/day free tier.
 */

import { createServiceClient } from '@/utils/supabase/service';
import { sendEmailFromAdmin } from '@/utils/gmail/client';
import { renderOutreachHtml } from '@/app/lib/outreach/htmlEmail';
import { newTrackingId } from '@/app/lib/outreach/tracking';

const LEAD_DAILY_SEND_CAP = 200;

export type LeadSendOutcome =
  | { ok: true; messageId: string; threadId: string; trackingId: string }
  | {
      ok: false;
      reason: 'gmail' | 'cap_reached' | 'lead_not_found' | 'no_email';
      error: string;
    };

export async function sendLeadReplyCron(opts: {
  adminEmail: string;
  leadTable: 'itinerary_requests' | 'leads';
  leadId: string;
  to: string;
  subject: string;
  body: string;
  threadId?: string;
  inReplyTo?: string;
  /** Tagged onto activity metadata so we can recognize automated sends later. */
  autoFollowupId?: string;
}): Promise<LeadSendOutcome> {
  const supabase = createServiceClient();

  if (!opts.to) {
    return { ok: false, reason: 'no_email', error: 'No recipient email.' };
  }

  // Daily cap on lead-side auto-sends (separate from outreach cap).
  const startOfTodayUtc = new Date();
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);
  const { count: sentToday } = await supabase
    .from('lead_activity')
    .select('id', { count: 'exact', head: true })
    .eq('kind', 'email_sent')
    .gte('created_at', startOfTodayUtc.toISOString());

  if ((sentToday ?? 0) >= LEAD_DAILY_SEND_CAP) {
    return {
      ok: false,
      reason: 'cap_reached',
      error: `Daily lead-send cap of ${LEAD_DAILY_SEND_CAP} reached.`,
    };
  }

  const trackingId = newTrackingId();
  const htmlBody = renderOutreachHtml(opts.body, trackingId);

  const sendResult = await sendEmailFromAdmin(opts.adminEmail, {
    to: opts.to,
    subject: opts.subject,
    body: opts.body,
    html: htmlBody,
    threadId: opts.threadId,
    inReplyTo: opts.inReplyTo,
  });

  if (!sendResult.ok) {
    return { ok: false, reason: 'gmail', error: sendResult.error };
  }

  await supabase.from('lead_activity').insert({
    lead_table: opts.leadTable,
    lead_id: opts.leadId,
    kind: 'email_sent',
    actor_email: 'cron@hilton-ahead',
    body: opts.subject,
    metadata: {
      to: opts.to,
      tracking_id: trackingId,
      thread_id: sendResult.threadId,
      message_id: sendResult.messageId,
      body_preview: opts.body.slice(0, 280),
      automated: true,
      auto_followup: opts.autoFollowupId ?? null,
    },
  });

  return {
    ok: true,
    messageId: sendResult.messageId,
    threadId: sendResult.threadId,
    trackingId,
  };
}
