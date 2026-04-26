'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAdminUser } from '@/utils/supabase/admin';

// ============================================================================
// CSV bulk import for backlink prospects.
//
// Expected columns (header row required, case-insensitive):
//   domain                  required
//   account_name            optional
//   vertical                optional
//   domain_rating           optional (integer 0-100)
//   monthly_traffic         optional (integer)
//   contact_email           optional
//   contact_first_name      optional
//   contact_last_name       optional
//   contact_role            optional
//   link_type               optional (default 'other')
//   target_url              optional
//   anchor_text             optional
//   campaign                optional
//   notes                   optional
//
// Each row creates: 1 account (upserted by domain), 0-1 contact (upserted by
// email), 1 opportunity (always new — no dedup).
// ============================================================================

export type ImportResult = {
  rowsTotal: number;
  rowsImported: number;
  rowsSkipped: number;
  errors: { row: number; error: string }[];
};

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

// Minimal CSV parser — supports quoted fields and commas inside quotes.
// Not RFC 4180-perfect (no escaped CRLF inside quotes) but good enough for
// the typical exports from Ahrefs / Semrush / Hunter.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  const pushField = () => {
    cur.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(cur);
    cur = [];
  };

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ',') {
      pushField();
      i++;
      continue;
    }
    if (c === '\r') {
      // skip — handled by \n
      i++;
      continue;
    }
    if (c === '\n') {
      pushRow();
      i++;
      continue;
    }
    field += c;
    i++;
  }
  // last field/row
  if (field.length > 0 || cur.length > 0) {
    pushRow();
  }
  return rows;
}

export async function importCsvAction(formData: FormData): Promise<void> {
  const result = await getAdminUser();
  if (!result) redirect('/admin/login');
  const adminEmail = result.admin.email;

  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('No file uploaded');
  }
  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length === 0) {
    throw new Error('Empty CSV');
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const dataRows = rows.slice(1).filter((r) => r.some((cell) => cell.trim().length > 0));

  // Helper to read a column by name (case-insensitive)
  const col = (row: string[], key: string): string | null => {
    const idx = header.indexOf(key);
    if (idx === -1) return null;
    const v = row[idx];
    return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
  };

  if (header.indexOf('domain') === -1) {
    throw new Error('CSV must include a "domain" column');
  }

  const supabase = await createClient();
  const errors: { row: number; error: string }[] = [];
  let imported = 0;
  let skipped = 0;

  for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
    const row = dataRows[rowIdx];
    const rowNum = rowIdx + 2; // +1 for header, +1 to be 1-indexed

    try {
      const rawDomain = col(row, 'domain');
      if (!rawDomain) {
        skipped++;
        continue;
      }
      const domain = normalizeDomain(rawDomain);

      // 1. Upsert account
      const { data: existingAccount } = await supabase
        .from('outreach_accounts')
        .select('id')
        .eq('domain', domain)
        .maybeSingle();

      let accountId: string;
      if (existingAccount) {
        accountId = existingAccount.id;
      } else {
        const drStr = col(row, 'domain_rating');
        const trafStr = col(row, 'monthly_traffic');
        const { data: newAcc, error: accErr } = await supabase
          .from('outreach_accounts')
          .insert({
            domain,
            name: col(row, 'account_name'),
            homepage_url: `https://${domain}`,
            vertical: col(row, 'vertical'),
            domain_rating: drStr ? parseInt(drStr, 10) : null,
            monthly_traffic: trafStr ? parseInt(trafStr, 10) : null,
            source: 'csv_import',
            added_by: adminEmail,
          })
          .select('id')
          .single();
        if (accErr || !newAcc) {
          throw new Error(`account: ${accErr?.message ?? 'unknown'}`);
        }
        accountId = newAcc.id;
      }

      // 2. Upsert contact (optional)
      let contactId: string | null = null;
      const contactEmail = col(row, 'contact_email');
      if (contactEmail) {
        const { data: existingContact } = await supabase
          .from('outreach_contacts')
          .select('id')
          .ilike('email', contactEmail)
          .maybeSingle();
        if (existingContact) {
          contactId = existingContact.id;
        } else {
          const { data: newContact, error: contactErr } = await supabase
            .from('outreach_contacts')
            .insert({
              account_id: accountId,
              email: contactEmail,
              first_name: col(row, 'contact_first_name'),
              last_name: col(row, 'contact_last_name'),
              role: col(row, 'contact_role'),
              source: 'csv_import',
              added_by: adminEmail,
            })
            .select('id')
            .single();
          if (contactErr || !newContact) {
            throw new Error(`contact: ${contactErr?.message ?? 'unknown'}`);
          }
          contactId = newContact.id;
        }
      }

      // 3. Always create a new opportunity per row
      const { error: oppErr } = await supabase
        .from('outreach_opportunities')
        .insert({
          account_id: accountId,
          contact_id: contactId,
          stage: 'discovered',
          link_type: col(row, 'link_type') ?? 'other',
          target_url: col(row, 'target_url'),
          anchor_text_proposal: col(row, 'anchor_text'),
          campaign: col(row, 'campaign'),
          notes: col(row, 'notes'),
          assigned_to: adminEmail,
        });
      if (oppErr) {
        throw new Error(`opportunity: ${oppErr.message}`);
      }

      imported++;
    } catch (err) {
      errors.push({ row: rowNum, error: err instanceof Error ? err.message : String(err) });
      skipped++;
    }
  }

  revalidatePath('/admin/outreach');

  // Stash result in URL params and redirect to the import page so it can show
  // a result summary. (Server actions in Next.js can't return data to forms
  // that use action= without conversion to client component, so we use
  // searchParams as the carrier.)
  const params = new URLSearchParams({
    total: String(dataRows.length),
    imported: String(imported),
    skipped: String(skipped),
  });
  if (errors.length > 0) {
    params.set('errors', JSON.stringify(errors.slice(0, 10)));
  }
  redirect(`/admin/outreach/import?${params.toString()}`);
}
