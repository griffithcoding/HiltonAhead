/**
 * Cron-safe outreach send helper.
 *
 * Mirrors the manual send flow in app/admin/(gated)/outreach/actions.ts
 * (`sendOutreachEmailAction`) but runs without an admin session — used by
 * the sequence-tick cron when it auto-fires follow-up messages.
 *
 * Both paths share the same daily send cap, CAN-SPAM footer, HTML
 * tracking renderer, and activity-timeline shape so analytics stay
 * consistent.
 */

import { createServiceClient } from '@/utils/supabase/service';
import { sendEmailFromAdmin } from '@/utils/gmail/client';
import { appendCanSpamFooter } from '@/lib/outreach/compliance';
import { renderOutreachHtml } from './htmlEmail';
import { newTrackingId } from './tracking';

// Keep in sync with the constant in the manual action.
const DAILY_SEND_CAP = 200;

export type CronSendOutcome =
  | { ok: true; messageId: string; threadId: string; trackingId: string }
  | {
      ok: false;
      reason:
        | 'opted_out'
        | 'bounced'
        | 'no_contact'
        | 'gmail'
        | 'cap_reached'
        | 'opp_not_found';
      error: string;
    };

/**
 * Look up an admin whose Gmail tokens are stored. Returns the first
 * email we find; if multiple admins ever connect Gmail we'll need to
 * pick deliberately (per-opportunity assigned_to), but for now there's
 * one operator.
 */
export async function pickSenderAdminEmail(): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('gmail_tokens')
    .select('email')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.email ?? null;
}

export async function sendOutreachEmailCron(opts: {
  adminEmail: string;
  opportunityId: string;
  subject: string;
  body: string;
  threadId?: string;
  inReplyTo?: string;
  /**
   * Optional override for the actor recorded on the activity timeline.
   * Defaults to a sentinel ("cron@hilton-ahead") so the operator can
   * filter automated sends in the UI.
   */
  actorEmail?: string;
}): Promise<CronSendOutcome> {
  const supabase = createServiceClient();

  // 1. Load opportunity + contact via service-role.
  const { data: opp, error: oppErr } = await supabase
    .from('outreach_opportunities')
    .select(
      `id, stage, contact_id,
       contact:contact_id ( id, email, opted_out, email_bounced ),
       account:account_id ( id, domain, name )`,
    )
    .eq('id', opts.opportunityId)
    .maybeSingle();

  if (oppErr || !opp) {
    return { ok: false, reason: 'opp_not_found', error: 'Opportunity not found.' };
  }

  const contact = opp.contact as unknown as
    | { id: string; email: string; opted_out: boolean; email_bounced: boolean }
    | null;

  if (!contact) {
    return {
      ok: false,
      reason: 'no_contact',
      error: 'No contact attached.',
    };
  }
  if (contact.opted_out) {
    return { ok: false, reason: 'opted_out', error: 'Contact opted out.' };
  }
  if (contact.email_bounced) {
    return { ok: false, reason: 'bounced', error: 'Address previously bounced.' };
  }

  // 2. Daily cap (shared with manual sends).
  const startOfTodayUtc = new Date();
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);
  const { count: sentToday } = await supabase
    .from('outreach_activity')
    .select('id', { count: 'exact', head: true })
    .eq('kind', 'email_sent')
    .gte('created_at', startOfTodayUtc.toISOString());

  if ((sentToday ?? 0) >= DAILY_SEND_CAP) {
    return {
      ok: false,
      reason: 'cap_reached',
      error: `Daily send cap of ${DAILY_SEND_CAP} reached.`,
    };
  }

  // 3. CAN-SPAM footer + tracking.
  const finalBody = appendCanSpamFooter(opts.body, contact.id);
  const trackingId = newTrackingId();
  const htmlBody = renderOutreachHtml(finalBody, trackingId);

  // 4. Send.
  const sendResult = await sendEmailFromAdmin(opts.adminEmail, {
    to: contact.email,
    subject: opts.subject,
    body: finalBody,
    html: htmlBody,
    threadId: opts.threadId,
    inReplyTo: opts.inReplyTo,
  });

  if (!sendResult.ok) {
    return { ok: false, reason: 'gmail', error: sendResult.error };
  }

  // 5. Activity row.
  await supabase.from('outreach_activity').insert({
    opportunity_id: opts.opportunityId,
    contact_id: contact.id,
    kind: 'email_sent',
    actor_email: opts.actorEmail ?? 'cron@hilton-ahead',
    body: opts.subject,
    metadata: {
      tracking_id: trackingId,
      thread_id: sendResult.threadId,
      message_id: sendResult.messageId,
      to: contact.email,
      subject: opts.subject,
      body_preview: finalBody.slice(0, 280),
      automated: true,
    },
  });

  return {
    ok: true,
    messageId: sendResult.messageId,
    threadId: sendResult.threadId,
    trackingId,
  };
}
