/**
 * Lead reply-detection cron.
 *
 * Schedule: every 30 minutes. Configured in vercel.json.
 *
 * For each lead in itinerary_requests + leads that sent within the last
 * 30 days and hasn't recorded an inbound reply yet, fetches the Gmail
 * thread metadata (thread_id pulled from the most recent email_sent
 * lead_activity row). If any message comes from the lead's own address,
 * we log an `email_received` row — the migration-024 trigger then
 * auto-fills last_received_at and bumps reply_count, naturally pausing
 * the sequence-tick cron from then on.
 *
 * Idempotent: de-duped by Gmail message ID. The cron can re-run
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

type LeadCandidate = {
  leadTable: 'itinerary_requests' | 'leads';
  leadId: string;
  contactEmail: string;
};

async function loadCandidates(
  supabase: ReturnType<typeof createServiceClient>,
  cutoff: string,
): Promise<LeadCandidate[]> {
  const out: LeadCandidate[] = [];

  const [itinRes, leadsRes] = await Promise.all([
    supabase
      .from('itinerary_requests')
      .select('id, email')
      .is('last_received_at', null)
      .not('last_send_at', 'is', null)
      .gte('last_send_at', cutoff)
      .order('last_send_at', { ascending: false })
      .limit(200),
    supabase
      .from('leads')
      .select('id, email')
      .is('last_received_at', null)
      .not('last_send_at', 'is', null)
      .gte('last_send_at', cutoff)
      .order('last_send_at', { ascending: false })
      .limit(200),
  ]);

  for (const row of (itinRes.data ?? []) as Array<{ id: string; email: string | null }>) {
    if (row.email) out.push({ leadTable: 'itinerary_requests', leadId: row.id, contactEmail: row.email });
  }
  for (const row of (leadsRes.data ?? []) as Array<{ id: string; email: string | null }>) {
    if (row.email) out.push({ leadTable: 'leads', leadId: row.id, contactEmail: row.email });
  }
  return out;
}

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
  const candidates = await loadCandidates(supabase, cutoff);

  let polled = 0;
  let repliesLogged = 0;
  const errors: string[] = [];

  for (const cand of candidates) {
    // Newest email_sent lead_activity row carries the thread_id.
    const { data: latestSend } = await supabase
      .from('lead_activity')
      .select('metadata')
      .eq('lead_table', cand.leadTable)
      .eq('lead_id', cand.leadId)
      .eq('kind', 'email_sent')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const threadId =
      (latestSend?.metadata as Record<string, unknown> | undefined)?.thread_id;
    if (typeof threadId !== 'string' || !threadId) continue;

    polled++;
    try {
      const threadRes = await gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'metadata',
        metadataHeaders: ['From', 'Date', 'Message-Id', 'Subject'],
      });

      const messages = threadRes.data.messages ?? [];
      if (messages.length < 2) continue; // Our send only — no reply yet.

      const contactLc = cand.contactEmail.toLowerCase();

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
        if (fromEmail !== contactLc) continue;

        const gmailMessageId = m.id ?? '';

        // De-dupe by gmail_message_id in metadata.
        const { data: existing } = await supabase
          .from('lead_activity')
          .select('id')
          .eq('lead_table', cand.leadTable)
          .eq('lead_id', cand.leadId)
          .eq('kind', 'email_received')
          .filter('metadata->>gmail_message_id', 'eq', gmailMessageId)
          .maybeSingle();

        if (existing) continue;

        await supabase.from('lead_activity').insert({
          lead_table: cand.leadTable,
          lead_id: cand.leadId,
          kind: 'email_received',
          actor_email: cand.contactEmail,
          body: m.snippet ?? subjectHeader ?? '(reply)',
          metadata: {
            gmail_message_id: gmailMessageId,
            gmail_thread_id: threadId,
            rfc822_message_id: messageIdHeader || null,
            subject: subjectHeader || null,
            date: dateHeader || null,
            snippet: m.snippet || null,
            detected_by: 'lead-reply-poll-cron',
          },
        });
        repliesLogged++;

        // Pause the sequence so we don't keep auto-followup-ing a
        // lead that already responded. The trigger updates
        // last_received_at; the sequence-tick query naturally excludes
        // this lead, but flipping sequence_active makes intent explicit
        // and surfaces it in the engagement-strip toggle.
        await supabase
          .from(cand.leadTable)
          .update({ sequence_active: false })
          .eq('id', cand.leadId);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      errors.push(`${cand.leadTable}:${cand.leadId} ${msg}`);
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
