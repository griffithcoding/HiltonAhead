/**
 * Outreach follow-up sequence tick.
 *
 * Schedule: daily at 09:00 ET (= 13:00 UTC during EDT, 14:00 during EST).
 * Configured in vercel.json. Vercel Cron sends a GET with header
 * `Authorization: Bearer <CRON_SECRET>`.
 *
 * Two follow-up rules, applied to every opportunity that is sequence_active
 * AND has no inbound reply yet:
 *
 *   stage = 'outreached'   AND last_send_at + 5 days  <= now()
 *     → send followup_1, advance to 'followed_up'
 *
 *   stage = 'followed_up'  AND last_send_at + 10 days <= now()
 *     → send followup_2, advance to 'no_response'   (terminal)
 *     → set sequence_active = false                 (no more autoplay)
 *
 * Auth: Bearer CRON_SECRET. Missing → 503 (deploy misconfig).
 *
 * Idempotent: if a row was already followed-up today, the stage check
 * naturally excludes it; the cron will pick it up next tick when the
 * +5d / +10d math passes again.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import {
  pickSenderAdminEmail,
  sendOutreachEmailCron,
} from '@/app/lib/outreach/sendCron';
import { getTemplateById, renderTemplateString } from '@/lib/outreach/templates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

const DAY_MS = 24 * 60 * 60 * 1000;
const FOLLOWUP_1_DELAY_MS = 5 * DAY_MS;
const FOLLOWUP_2_DELAY_MS = 10 * DAY_MS; // 10 days after followup_1

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return (req.headers.get('authorization') || '') === `Bearer ${expected}`;
}

type OppRow = {
  id: string;
  stage: string;
  last_send_at: string | null;
  contact: {
    id: string;
    email: string;
    first_name: string | null;
  } | null;
  account: {
    name: string | null;
    domain: string;
  } | null;
  target_url: string | null;
  source_url: string | null;
  anchor_text_proposal: string | null;
};

function pickFollowupTemplate(stage: string) {
  if (stage === 'outreached') return getTemplateById('followup_1');
  if (stage === 'followed_up') return getTemplateById('followup_2');
  return undefined;
}

function nextStage(stage: string): string {
  if (stage === 'outreached') return 'followed_up';
  if (stage === 'followed_up') return 'no_response';
  return stage;
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
  const followup1Cutoff = new Date(now - FOLLOWUP_1_DELAY_MS).toISOString();
  const followup2Cutoff = new Date(now - FOLLOWUP_2_DELAY_MS).toISOString();

  // Pull both buckets in one query — we'll branch on stage server-side.
  // RLS: service-role bypasses, so we see every row.
  const { data: candidates, error } = await supabase
    .from('outreach_opportunities')
    .select(
      `id, stage, last_send_at, target_url, source_url, anchor_text_proposal,
       contact:contact_id ( id, email, first_name ),
       account:account_id ( name, domain )`,
    )
    .eq('sequence_active', true)
    .is('last_received_at', null)
    .in('stage', ['outreached', 'followed_up'])
    .not('last_send_at', 'is', null)
    .order('last_send_at', { ascending: true })
    .limit(50); // cap per tick

  if (error) {
    console.error('[outreach-sequence-tick] query error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (candidates ?? []) as unknown as OppRow[];
  const due = rows.filter((r) => {
    if (!r.last_send_at) return false;
    const cutoff = r.stage === 'outreached' ? followup1Cutoff : followup2Cutoff;
    return r.last_send_at <= cutoff;
  });

  const results: Array<{
    opportunityId: string;
    stage: string;
    outcome: string;
    error?: string;
  }> = [];

  for (const opp of due) {
    if (!opp.contact?.email) {
      results.push({
        opportunityId: opp.id,
        stage: opp.stage,
        outcome: 'skipped_no_contact',
      });
      continue;
    }

    const template = pickFollowupTemplate(opp.stage);
    if (!template) {
      results.push({
        opportunityId: opp.id,
        stage: opp.stage,
        outcome: 'skipped_no_template',
      });
      continue;
    }

    const vars = {
      first_name: opp.contact.first_name,
      publication: opp.account?.name || opp.account?.domain || 'your site',
      their_url: opp.source_url,
      our_url: opp.target_url,
      anchor: opp.anchor_text_proposal,
    };
    const subject = renderTemplateString(template.subject, vars);
    const body = renderTemplateString(template.body, vars);

    const send = await sendOutreachEmailCron({
      adminEmail,
      opportunityId: opp.id,
      subject,
      body,
    });

    if (!send.ok) {
      // Hit the cap → stop the tick entirely; the rest of the queue
      // will roll over to tomorrow.
      if (send.reason === 'cap_reached') {
        results.push({
          opportunityId: opp.id,
          stage: opp.stage,
          outcome: 'stopped_cap_reached',
        });
        break;
      }
      results.push({
        opportunityId: opp.id,
        stage: opp.stage,
        outcome: `failed_${send.reason}`,
        error: send.error,
      });
      // If the contact is opted out / bounced, pause this sequence so we
      // don't retry every day.
      if (send.reason === 'opted_out' || send.reason === 'bounced') {
        await supabase
          .from('outreach_opportunities')
          .update({ sequence_active: false })
          .eq('id', opp.id);
      }
      continue;
    }

    // Advance stage. followup_2 → no_response is terminal — also disable
    // the sequence flag so it stays out of future queries.
    const newStage = nextStage(opp.stage);
    const update: Record<string, unknown> = { stage: newStage };
    if (newStage === 'no_response') update.sequence_active = false;

    await supabase
      .from('outreach_opportunities')
      .update(update)
      .eq('id', opp.id);

    results.push({
      opportunityId: opp.id,
      stage: opp.stage,
      outcome: `sent_${template.id}_->_${newStage}`,
    });
  }

  return NextResponse.json({
    ok: true,
    senderAdmin: adminEmail,
    examined: rows.length,
    due: due.length,
    sent: results.filter((r) => r.outcome.startsWith('sent_')).length,
    results,
  });
}
