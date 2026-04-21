'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

type LeadTableKind = 'itinerary_requests' | 'newsletter_subscribers' | 'leads';

const TYPE_TO_TABLE: Record<string, LeadTableKind> = {
  itinerary: 'itinerary_requests',
  newsletter: 'newsletter_subscribers',
  lead: 'leads',
};

/**
 * Update the status column on itinerary_requests or leads.
 * Newsletter subscribers don't have a status — the UI won't call this for them.
 */
export async function updateLeadStatus(
  type: string,
  id: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
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

  revalidatePath(`/admin/leads/${type}/${id}`);
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
  return { ok: true };
}

/**
 * Append a note to the lead's activity timeline.
 */
export async function addLeadNote(
  type: string,
  id: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const table = TYPE_TO_TABLE[type];
  if (!table) return { ok: false, error: 'Invalid lead type.' };

  const trimmed = body.trim().slice(0, 4000);
  if (!trimmed) return { ok: false, error: 'Note cannot be empty.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('lead_activity').insert({
    lead_table: table,
    lead_id: id,
    kind: 'note',
    actor_email: user?.email ?? null,
    body: trimmed,
    metadata: {},
  });

  if (error) {
    console.error('[admin] addLeadNote error:', error);
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/leads/${type}/${id}`);
  return { ok: true };
}
