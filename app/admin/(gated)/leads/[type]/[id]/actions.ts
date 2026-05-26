'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { requireAdmin } from '@/utils/supabase/admin';
import { sendEmailFromAdmin } from '@/utils/gmail/client';
import { renderOutreachHtml } from '@/app/lib/outreach/htmlEmail';
import { newTrackingId } from '@/app/lib/outreach/tracking';

type LeadTableKind = 'itinerary_requests' | 'newsletter_subscribers' | 'leads';

const TYPE_TO_TABLE: Record<string, LeadTableKind> = {
  itinerary: 'itinerary_requests',
  newsletter: 'newsletter_subscribers',
  lead: 'leads',
};

function revalidateLead(type: string, id: string) {
  revalidatePath(`/admin/leads/${type}/${id}`);
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
}

// ============================================================================
// Status
// ============================================================================
export async function updateLeadStatus(
  type: string,
  id: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const table = TYPE_TO_TABLE[type];
  if (!table || table === 'newsletter_subscribers') {
    return { ok: false, error: 'Status not supported for this lead type.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('[admin] updateLeadStatus error:', error);
    return { ok: false, error: error.message };
  }

  revalidateLead(type, id);
  return { ok: true };
}

// ============================================================================
// Notes
// ============================================================================
export async function addLeadNote(
  type: string,
  id: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const table = TYPE_TO_TABLE[type];
  if (!table) return { ok: false, error: 'Invalid lead type.' };

  const trimmed = body.trim().slice(0, 4000);
  if (!trimmed) return { ok: false, error: 'Note cannot be empty.' };

  const supabase = await createClient();

  const { error } = await supabase.from('lead_activity').insert({
    lead_table: table,
    lead_id: id,
    kind: 'note',
    actor_email: auth.user.email ?? null,
    body: trimmed,
    metadata: {},
  });

  if (error) {
    console.error('[admin] addLeadNote error:', error);
    return { ok: false, error: error.message };
  }

  revalidateLead(type, id);
  return { ok: true };
}

// ============================================================================
// Deal value (Phase 2)
// ============================================================================
export async function updateDealValue(
  type: string,
  id: string,
  valueRaw: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const table = TYPE_TO_TABLE[type];
  if (!table || table === 'newsletter_subscribers') {
    return { ok: false, error: 'Deal value not supported for this lead type.' };
  }

  // Empty string clears the value.
  let value: number | null = null;
  if (valueRaw.trim()) {
    const parsed = Number(valueRaw.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { ok: false, error: 'Enter a positive number.' };
    }
    value = Math.round(parsed * 100) / 100;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ deal_value: value })
    .eq('id', id);

  if (error) {
    console.error('[admin] updateDealValue error:', error);
    return { ok: false, error: error.message };
  }

  revalidateLead(type, id);
  return { ok: true };
}

// ============================================================================
// Next-action date (Funnel Pro · B)
// ============================================================================
export async function updateNextAction(
  type: string,
  id: string,
  dateRaw: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const table = TYPE_TO_TABLE[type];
  if (!table || table === 'newsletter_subscribers') {
    return { ok: false, error: 'Next action not supported for this lead type.' };
  }

  // Empty string clears the date.
  let value: string | null = null;
  if (dateRaw.trim()) {
    // Accept either YYYY-MM-DD (from <input type="date">) or full ISO.
    // Date-only inputs are pinned to 9am local — that's when the operator
    // realistically sees their morning queue.
    const trimmed = dateRaw.trim();
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
    const parsed = dateOnly
      ? new Date(`${trimmed}T09:00:00`)
      : new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return { ok: false, error: 'Could not read that date.' };
    }
    value = parsed.toISOString();
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ next_action_at: value })
    .eq('id', id);

  if (error) {
    console.error('[admin] updateNextAction error:', error);
    return { ok: false, error: error.message };
  }

  revalidateLead(type, id);
  return { ok: true };
}

// ============================================================================
// Pause / resume the auto-followup sequence for one lead
// ============================================================================
export async function setLeadSequenceActiveAction(
  type: string,
  id: string,
  active: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const table = TYPE_TO_TABLE[type];
  if (!table || table === 'newsletter_subscribers') {
    return { ok: false, error: 'Sequences not supported for this lead type.' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from(table)
    .update({ sequence_active: active })
    .eq('id', id);

  if (error) {
    return { ok: false, error: error.message };
  }

  // Log to activity so the timeline shows the pause/resume action.
  await supabase.from('lead_activity').insert({
    lead_table: table,
    lead_id: id,
    kind: 'note',
    actor_email: auth.user.email ?? null,
    body: active ? 'Sequence resumed' : 'Sequence paused',
    metadata: { sequence_active: active, source: 'manual_toggle' },
  });

  revalidateLead(type, id);
  return { ok: true };
}

// ============================================================================
// Gmail reply (Phase 3)
// ============================================================================
export async function sendGmailReply(
  type: string,
  id: string,
  opts: {
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    inReplyTo?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const adminEmail = auth.admin.email;
  if (!adminEmail) {
    return { ok: false, error: 'Admin record missing email.' };
  }

  const table = TYPE_TO_TABLE[type];
  if (!table) return { ok: false, error: 'Invalid lead type.' };

  const subject = opts.subject.trim().slice(0, 500);
  const body = opts.body.trim().slice(0, 20_000);
  const to = opts.to.trim();
  if (!to || !subject || !body) {
    return { ok: false, error: 'All fields are required.' };
  }

  // Mint a tracking_id and render the HTML body (tracked open pixel +
  // redirector-wrapped links). The plain-text body still ships as the
  // first MIME part; HTML carries the tracking instrumentation.
  const trackingId = newTrackingId();
  const htmlBody = renderOutreachHtml(body, trackingId);

  // Send via the admin's own Gmail tokens — never the caller's.
  const sendResult = await sendEmailFromAdmin(adminEmail, {
    to,
    subject,
    body,
    html: htmlBody,
    threadId: opts.threadId,
    inReplyTo: opts.inReplyTo,
  });

  if (!sendResult.ok) {
    return { ok: false, error: sendResult.error };
  }

  const supabase = await createClient();
  const { error: logError } = await supabase.from('lead_activity').insert({
    lead_table: table,
    lead_id: id,
    kind: 'email_sent',
    actor_email: adminEmail,
    body: subject,
    metadata: {
      to,
      tracking_id: trackingId,
      thread_id: sendResult.threadId,
      message_id: sendResult.messageId,
      body_preview: body.slice(0, 280),
    },
  });
  if (logError) {
    console.error('[admin] sendGmailReply log error:', logError);
    // Don't fail — email went through.
  }

  revalidateLead(type, id);
  return { ok: true };
}
