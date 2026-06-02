/**
 * Outreach reply-detection cron.
 *
 * Schedule: every 30 minutes. Configured in vercel.json.
 *
 * Approach: for each opportunity where we sent an outreach email within
 * the last 30 days and haven't yet recorded an inbound reply, fetch the
 * associated Gmail thread metadata. If any message in the thread comes
 * from the contact's address (not us), log an `email_received` activity
 * row. The trigger in migration 023 then auto-fills `last_received_at`
 * and bumps `reply_count`, which causes the sequence-tick cron to
 * naturally skip this opportunity from then on.
 *
 * Idempotency: we de-dupe by Gmail message ID. The cron can re-run
 * arbitrarily often without double-counting.
 *
 * Auth: Bearer CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { getGmailClient } from '@/utils/gmail/client';
import { pickSenderAdminEmail } from '@/app/lib/outreach/sendCron';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const POLL_WINDOW_DAYS = 30;

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return (req.headers.get('authorization') || '') === `Bearer ${expected}`;
}

/** Extract "you@example.com" from a Gmail "Name <you@example.com>" header. */
function parseEmailHeader(raw: string | undefined | null): string {
  if (!raw) return '';
  const m = raw.match(/<([^>]+)>/);
  return (m ? m[1] : raw).trim().toLowerCase();
}

type CandidateRow = {
  id: string;
  contact: { id: string; email: string } | null;
  activity: { metadata: Record<string, unknown> | null }[] | null;
};

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 503 },
    );
  }
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const adminEmail = await pickSenderAdminEmail();
  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: 'No admin Gmail tokens on file.' },
      { status: 200 },
    );
  }

  const gmail = await getGmailClient(adminEmail);
  if (!gmail) {
    return NextResponse.json(
      { ok: false, error: 'Admin Gmail not connected — token refresh failed.' },
      { status: 200 },
    );
  }

  const supabase = createServiceClient();
  const cutoff = new Date(Date.now() - POLL_WINDOW_DAYS * 86_400_000).toISOString();

  // Pull opportunities that sent in the last 30 days and haven't
  // received a reply yet. We pull the latest email_sent activity row
  // alongside so we have the thread_id without a second query.
  const { data: oppRows, error } = await supabase
    .from('outreach_opportunities')
    .select(
      `id,
       contact:contact_id ( id, email ),
       activity:outreach_activity ( metadata )`,
    )
    .is('last_received_at', null)
    .not('last_send_at', 'is', null)
    .gte('last_send_at', cutoff)
    .order('last_send_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[outreach-reply-poll] query error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const candidates = ((oppRows ?? []) as unknown as CandidateRow[]).filter(
    (r) => r.contact?.email,
  );

  let polled = 0;
  let repliesLogged = 0;
  const errors: string[] = [];

  for (const opp of candidates) {
    // Newest email_sent activity carries the thread_id.
    const threadId = opp.activity
      ?.map((a) => a.metadata as Record<string, unknown> | null)
      .find((m) => m && typeof m.thread_id === 'string')?.thread_id as
      | string
      | undefined;

    if (!threadId || !opp.contact) continue;

    polled++;
    try {
      const threadRes = await gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'metadata',
        metadataHeaders: ['From', 'Date', 'Message-Id', 'Subject'],
      });

      const messages = threadRes.data.messages ?? [];
      if (messages.length < 2) continue; // Only our send — no reply yet.

      const contactEmailLc = opp.contact.email.toLowerCase();

      for (const m of messages) {
        const headers = m.payload?.headers ?? [];
        const fromHeader = headers.find(
          (h) => h.name?.toLowerCase() === 'from',
        )?.value;
        const messageIdHeader = headers.find(
          (h) => h.name?.toLowerCase() === 'message-id',
        )?.value;
        const subjectHeader = headers.find(
          (h) => h.name?.toLowerCase() === 'subject',
        )?.value;
        const dateHeader = headers.find(
          (h) => h.name?.toLowerCase() === 'date',
        )?.value;

        const fromEmail = parseEmailHeader(fromHeader);
        if (fromEmail !== contactEmailLc) continue;

        // Already logged this message id?
        const gmailMessageId = m.id ?? '';
        const { data: existing } = await supabase
          .from('outreach_activity')
          .select('id')
          .eq('opportunity_id', opp.id)
          .eq('kind', 'email_received')
          .filter('metadata->>gmail_message_id', 'eq', gmailMessageId)
          .maybeSingle();

        if (existing) continue;

        await supabase.from('outreach_activity').insert({
          opportunity_id: opp.id,
          contact_id: opp.contact.id,
          kind: 'email_received',
          actor_email: opp.contact.email,
          body: m.snippet ?? subjectHeader ?? '(reply)',
          metadata: {
            gmail_message_id: gmailMessageId,
            gmail_thread_id: threadId,
            rfc822_message_id: messageIdHeader || null,
            subject: subjectHeader || null,
            date: dateHeader || null,
            snippet: m.snippet || null,
            detected_by: 'reply-poll-cron',
          },
        });
        repliesLogged++;

        // Move stage to 'replied' if it isn't already past that.
        const PRE_REPLY_STAGES = ['outreached', 'followed_up'];
        const { data: oppStage } = await supabase
          .from('outreach_opportunities')
          .select('stage')
          .eq('id', opp.id)
          .maybeSingle();
        if (oppStage && PRE_REPLY_STAGES.includes(oppStage.stage)) {
          await supabase
            .from('outreach_opportunities')
            .update({ stage: 'replied', sequence_active: false })
            .eq('id', opp.id);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      errors.push(`${opp.id}: ${msg}`);
    }
  }

  return NextResponse.json({
    ok: true,
    senderAdmin: adminEmail,
    candidates: candidates.length,
    polled,
    repliesLogged,
    errors: errors.slice(0, 10),
  });
}
