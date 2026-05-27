/**
 * Lead follow-up sequence tick.
 *
 * Schedule: daily at 13:30 UTC (= 9:30 AM ET in EDT). Configured in
 * vercel.json. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
 *
 * Two follow-up rules, applied to every lead in itinerary_requests + leads
 * that is sequence_active, has at least one email_sent in lead_activity,
 * and has no inbound reply yet:
 *
 *   No prior auto-followup + last_send_at + 5d  <= now()
 *     → send lead_followup_1 (tagged auto_followup='lead_followup_1')
 *
 *   Prior auto_followup='lead_followup_1' + that send + 10d <= now()
 *     → send lead_followup_2 (tagged auto_followup='lead_followup_2')
 *     → set sequence_active = false   (terminal)
 *
 * Status allowlist (only follow up for leads still "in motion"):
 *   null, 'new', 'contacted', 'followed_up', 'qualified'
 *
 * Skips:
 *   - newsletter_subscribers (no send model exists)
 *   - statuses outside the allowlist (booked / converted / lost / etc.)
 *   - leads with no contact email
 *
 * Auth: Bearer CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { pickSenderAdminEmail } from '@/app/lib/outreach/sendCron';
import { sendLeadReplyCron } from '@/app/lib/leads/sendCron';
import {
  getLeadTemplateById,
  renderLeadTemplateString,
} from '@/lib/leads/templates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const DAY_MS = 86_400_000;
const FOLLOWUP_1_DELAY_MS = 5 * DAY_MS;
const FOLLOWUP_2_DELAY_MS = 10 * DAY_MS;

// Active-pipeline statuses. Everything else (booked, converted, lost,
// unqualified, opted_out, etc.) skips followups.
const STATUS_ALLOWLIST = new Set([null, '', 'new', 'contacted', 'followed_up', 'qualified']);

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return (req.headers.get('authorization') || '') === `Bearer ${expected}`;
}

type LeadRow = {
  id: string;
  status: string | null;
  last_send_at: string | null;
  contact_email: string | null;
  contact_first_name: string | null;
  topic: string | null;
};

type LeadActivityRow = {
  lead_id: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

async function loadCandidates(
  supabase: ReturnType<typeof createServiceClient>,
  table: 'itinerary_requests' | 'leads',
): Promise<LeadRow[]> {
  // Common-shape projection across the two heterogeneous lead tables.
  // We don't pretend to share schema — just project to a common contact +
  // topic surface the followup templates need.
  if (table === 'itinerary_requests') {
    const { data } = await supabase
      .from('itinerary_requests')
      .select(
        'id, status, last_send_at, sequence_active, last_received_at, email, first_name, trip_type',
      )
      .eq('sequence_active', true)
      .is('last_received_at', null)
      .not('last_send_at', 'is', null)
      .limit(200);
    return ((data ?? []) as Array<Record<string, unknown>>).map((r) => ({
      id: r.id as string,
      status: (r.status as string | null) ?? null,
      last_send_at: (r.last_send_at as string | null) ?? null,
      contact_email: (r.email as string | null) ?? null,
      contact_first_name: (r.first_name as string | null) ?? null,
      topic: r.trip_type
        ? `your ${String(r.trip_type).toLowerCase()} trip`
        : 'your Hilton Head trip',
    }));
  }
  // 'leads' table
  const { data } = await supabase
    .from('leads')
    .select(
      'id, status, last_send_at, sequence_active, last_received_at, email, first_name, kind',
    )
    .eq('sequence_active', true)
    .is('last_received_at', null)
    .not('last_send_at', 'is', null)
    .limit(200);
  return ((data ?? []) as Array<Record<string, unknown>>).map((r) => ({
    id: r.id as string,
    status: (r.status as string | null) ?? null,
    last_send_at: (r.last_send_at as string | null) ?? null,
    contact_email: (r.email as string | null) ?? null,
    contact_first_name: (r.first_name as string | null) ?? null,
    topic: r.kind
      ? `your ${String(r.kind).replace(/_/g, ' ').toLowerCase()} inquiry`
      : 'your inquiry',
  }));
}

/**
 * Inspect lead_activity to determine which auto-followup (if any) was
 * most recently sent for this lead. Returns the id of the most recent
 * auto_followup template, or undefined if the last send was manual.
 */
async function lastAutoFollowupId(
  supabase: ReturnType<typeof createServiceClient>,
  leadTable: 'itinerary_requests' | 'leads',
  leadId: string,
): Promise<{ id?: string; sentAt: string | null }> {
  const { data } = await supabase
    .from('lead_activity')
    .select('created_at, metadata')
    .eq('lead_table', leadTable)
    .eq('lead_id', leadId)
    .eq('kind', 'email_sent')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = data as LeadActivityRow | null;
  const id = row?.metadata && typeof row.metadata.auto_followup === 'string'
    ? (row.metadata.auto_followup as string)
    : undefined;
  return { id, sentAt: row?.created_at ?? null };
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
      { ok: false, error: 'No admin Gmail tokens on file — connect Gmail first.' },
      { status: 200 },
    );
  }

  const supabase = createServiceClient();
  const now = Date.now();

  const results: Array<{
    leadTable: string;
    leadId: string;
    outcome: string;
    error?: string;
  }> = [];

  for (const table of ['itinerary_requests', 'leads'] as const) {
    const candidates = await loadCandidates(supabase, table);

    for (const lead of candidates) {
      if (!STATUS_ALLOWLIST.has(lead.status)) continue;
      if (!lead.contact_email) continue;
      if (!lead.last_send_at) continue;

      const lastSendMs = new Date(lead.last_send_at).getTime();
      const { id: priorAutoId } = await lastAutoFollowupId(
        supabase,
        table,
        lead.id,
      );

      // Decide which followup, if any, is due.
      let templateId: 'lead_followup_1' | 'lead_followup_2' | null = null;
      let terminal = false;

      if (!priorAutoId) {
        // No auto-followup yet — fire #1 once 5d has passed since last send.
        if (now - lastSendMs >= FOLLOWUP_1_DELAY_MS) {
          templateId = 'lead_followup_1';
        }
      } else if (priorAutoId === 'lead_followup_1') {
        // Already auto-followed-up once — fire #2 10d after that send.
        if (now - lastSendMs >= FOLLOWUP_2_DELAY_MS) {
          templateId = 'lead_followup_2';
          terminal = true;
        }
      }
      // priorAutoId === 'lead_followup_2' → terminal, nothing more to do.

      if (!templateId) continue;

      const template = getLeadTemplateById(templateId);
      if (!template) continue;

      const vars = {
        first_name: lead.contact_first_name,
        topic: lead.topic,
      };
      const subject = renderLeadTemplateString(template.subject, vars);
      const body = renderLeadTemplateString(template.body, vars);

      const send = await sendLeadReplyCron({
        adminEmail,
        leadTable: table,
        leadId: lead.id,
        to: lead.contact_email,
        subject,
        body,
        autoFollowupId: templateId,
      });

      if (!send.ok) {
        if (send.reason === 'cap_reached') {
          results.push({
            leadTable: table,
            leadId: lead.id,
            outcome: 'stopped_cap_reached',
          });
          return NextResponse.json({
            ok: true,
            senderAdmin: adminEmail,
            sent: results.filter((r) => r.outcome.startsWith('sent_')).length,
            results,
          });
        }
        results.push({
          leadTable: table,
          leadId: lead.id,
          outcome: `failed_${send.reason}`,
          error: send.error,
        });
        continue;
      }

      // Terminal → pause sequence so we don't keep checking.
      if (terminal) {
        await supabase
          .from(table)
          .update({ sequence_active: false })
          .eq('id', lead.id);
      }

      results.push({
        leadTable: table,
        leadId: lead.id,
        outcome: `sent_${templateId}${terminal ? '_terminal' : ''}`,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    senderAdmin: adminEmail,
    sent: results.filter((r) => r.outcome.startsWith('sent_')).length,
    results,
  });
}
