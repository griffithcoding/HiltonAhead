'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAdminUser } from '@/utils/supabase/admin';

// ============================================================================
// Outreach CRM server actions
// Used by the new-opportunity form, opportunity detail page, and CSV import.
// All RLS-gated — is_admin() must pass on the JWT.
// ============================================================================

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function nullIfEmpty(s: FormDataEntryValue | null): string | null {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  return t.length === 0 ? null : t;
}

function nullableInt(s: FormDataEntryValue | null): number | null {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!t) return null;
  const n = parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

// ============================================================================
// Create new opportunity (with inline account + contact upsert)
// ============================================================================
export async function createOpportunityAction(formData: FormData) {
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');
  const adminEmail = result.admin.email;

  const supabase = await createClient();

  // 1. Account
  const rawDomain = (formData.get('domain') as string | null) ?? '';
  if (!rawDomain.trim()) {
    throw new Error('Domain is required');
  }
  const domain = normalizeDomain(rawDomain);

  // Upsert account by domain
  const { data: existingAccount } = await supabase
    .from('outreach_accounts')
    .select('id')
    .eq('domain', domain)
    .maybeSingle();

  let accountId: string;
  if (existingAccount) {
    accountId = existingAccount.id;
    // Update non-null fields if provided
    const updates: Record<string, unknown> = {};
    const name = nullIfEmpty(formData.get('account_name'));
    const vertical = nullIfEmpty(formData.get('vertical'));
    const dr = nullableInt(formData.get('domain_rating'));
    if (name) updates.name = name;
    if (vertical) updates.vertical = vertical;
    if (dr != null) updates.domain_rating = dr;
    if (Object.keys(updates).length > 0) {
      await supabase.from('outreach_accounts').update(updates).eq('id', accountId);
    }
  } else {
    const { data: newAccount, error } = await supabase
      .from('outreach_accounts')
      .insert({
        domain,
        name: nullIfEmpty(formData.get('account_name')),
        homepage_url: `https://${domain}`,
        vertical: nullIfEmpty(formData.get('vertical')),
        domain_rating: nullableInt(formData.get('domain_rating')),
        added_by: adminEmail,
      })
      .select('id')
      .single();
    if (error || !newAccount) {
      throw new Error(`Failed to create account: ${error?.message ?? 'unknown'}`);
    }
    accountId = newAccount.id;
  }

  // 2. Contact (optional)
  const contactEmail = nullIfEmpty(formData.get('contact_email'));
  let contactId: string | null = null;
  if (contactEmail) {
    const { data: existingContact } = await supabase
      .from('outreach_contacts')
      .select('id')
      .ilike('email', contactEmail)
      .maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      const { data: newContact, error } = await supabase
        .from('outreach_contacts')
        .insert({
          account_id: accountId,
          email: contactEmail,
          first_name: nullIfEmpty(formData.get('contact_first_name')),
          last_name: nullIfEmpty(formData.get('contact_last_name')),
          role: nullIfEmpty(formData.get('contact_role')),
          added_by: adminEmail,
        })
        .select('id')
        .single();
      if (error || !newContact) {
        throw new Error(`Failed to create contact: ${error?.message ?? 'unknown'}`);
      }
      contactId = newContact.id;
    }
  }

  // 3. Opportunity
  const { data: opp, error: oppError } = await supabase
    .from('outreach_opportunities')
    .insert({
      account_id: accountId,
      contact_id: contactId,
      stage: 'discovered',
      link_type: (formData.get('link_type') as string | null) || 'other',
      target_url: nullIfEmpty(formData.get('target_url')),
      source_url: nullIfEmpty(formData.get('source_url')),
      anchor_text_proposal: nullIfEmpty(formData.get('anchor_text')),
      campaign: nullIfEmpty(formData.get('campaign')),
      estimated_value: nullIfEmpty(formData.get('estimated_value')),
      assigned_to: adminEmail,
      notes: nullIfEmpty(formData.get('notes')),
    })
    .select('id')
    .single();

  if (oppError || !opp) {
    throw new Error(`Failed to create opportunity: ${oppError?.message ?? 'unknown'}`);
  }

  // 4. Activity log entry
  await supabase.from('outreach_activity').insert({
    opportunity_id: opp.id,
    contact_id: contactId,
    kind: 'note',
    actor_email: adminEmail,
    body: 'Opportunity created',
    metadata: { source: 'manual_form' },
  });

  revalidatePath('/admin/outreach');
  redirect(`/admin/outreach/${opp.id}`);
}

// ============================================================================
// Update opportunity stage
// ============================================================================
export async function updateStageAction(opportunityId: string, newStage: string) {
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');

  const supabase = await createClient();

  const { error } = await supabase
    .from('outreach_opportunities')
    .update({ stage: newStage })
    .eq('id', opportunityId);

  if (error) {
    throw new Error(`Stage update failed: ${error.message}`);
  }

  // (the trigger auto-logs the stage_change to outreach_activity)
  revalidatePath(`/admin/outreach/${opportunityId}`);
  revalidatePath('/admin/outreach');
}

// ============================================================================
// Add note to opportunity timeline
// ============================================================================
export async function addNoteAction(opportunityId: string, note: string) {
  if (!note.trim()) return;
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');

  const supabase = await createClient();

  const { error } = await supabase.from('outreach_activity').insert({
    opportunity_id: opportunityId,
    kind: 'note',
    actor_email: result.admin.email,
    body: note.trim(),
  });

  if (error) {
    throw new Error(`Note insert failed: ${error.message}`);
  }

  revalidatePath(`/admin/outreach/${opportunityId}`);
}

// ============================================================================
// Mark opportunity as published (link is live) — captures the placed URL
// ============================================================================
export async function markPublishedAction(opportunityId: string, placedUrl: string) {
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');

  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    stage: 'published',
    placed_at: new Date().toISOString(),
  };
  if (placedUrl.trim()) updates.placed_link_url = placedUrl.trim();

  const { error } = await supabase
    .from('outreach_opportunities')
    .update(updates)
    .eq('id', opportunityId);

  if (error) {
    throw new Error(`Publish update failed: ${error.message}`);
  }

  // Activity log (in addition to the auto stage_change trigger)
  await supabase.from('outreach_activity').insert({
    opportunity_id: opportunityId,
    kind: 'link_published',
    actor_email: result.admin.email,
    body: placedUrl.trim() || 'Link placed (URL not captured)',
    metadata: placedUrl.trim() ? { placed_url: placedUrl.trim() } : {},
  });

  revalidatePath(`/admin/outreach/${opportunityId}`);
  revalidatePath('/admin/outreach');
}

// ============================================================================
// Update next-action timestamp
// ============================================================================
export async function setNextActionAction(
  opportunityId: string,
  nextActionIso: string | null,
) {
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');

  const supabase = await createClient();

  const { error } = await supabase
    .from('outreach_opportunities')
    .update({ next_action_at: nextActionIso })
    .eq('id', opportunityId);

  if (error) {
    throw new Error(`Next-action update failed: ${error.message}`);
  }

  revalidatePath(`/admin/outreach/${opportunityId}`);
  revalidatePath('/admin/outreach');
}
