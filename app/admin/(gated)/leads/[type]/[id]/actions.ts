'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { requireAdmin } from '@/utils/supabase/admin';
import { sendEmailFromAdmin } from '@/utils/gmail/client';

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

  // Send via the admin's own Gmail tokens — never the caller's.
  const sendResult = await sendEmailFromAdmin(adminEmail, {
    to,
    subject,
    body,
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
