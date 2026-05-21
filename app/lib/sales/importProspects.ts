/**
 * Server-side batch import of CSV-parsed prospect rows into sales_prospects.
 *
 * Mirrors the per-row logic of POST /api/sales-prospects (unsub skip, dedupe
 * merge-only-null-fields + append note, segmentation, sequence routing) but
 * processes many rows in one call with a structured report at the end.
 *
 * NEVER import this from a client component — it uses the service-role client
 * and bypasses RLS. The two server-side callers are:
 *   - /api/admin/sales-prospects/import (POST)
 *   - scripts/import-prospects.ts (CLI)
 *
 * Best-effort throughout: a single row error never aborts the batch. Every
 * row produces an ImportResult so the caller can show a precise report.
 */

import type { CsvProspectRow } from './csvImport';
import { createServiceClient } from '@/utils/supabase/service';
import { inferSegment, type Segment } from './segmentation';
import { routeProspect } from './sequenceRouter';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImportOptions {
  campaignSlug?: string;
  channel?: string;
  dryRun?: boolean;
  autoSegment?: boolean;
  autoEnqueue?: boolean;
}

export type ImportOutcome =
  | 'inserted'
  | 'updated'
  | 'skipped_unsub'
  | 'skipped_dupe'
  | 'errored';

export interface ImportResult {
  line: number;
  email: string;
  outcome: ImportOutcome;
  segment?: string;
  sequenceId?: string;
  error?: string;
}

export interface ImportReport {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errored: number;
  results: ImportResult[];
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

const VALID_CHANNELS = new Set([
  'email',
  'linkedin',
  'instagram',
  'facebook',
  'reddit',
  'pinterest',
  'tiktok',
  'direct_mail',
  'referral',
  'organic',
  'paid_search',
  'paid_social',
  'direct',
]);

function validChannel(c: string | undefined): string | null {
  if (!c) return null;
  return VALID_CHANNELS.has(c) ? c : null;
}

function pickIf<T>(existing: T | null | undefined, incoming: T | undefined | null): T | undefined {
  if (existing != null && existing !== '') return undefined;
  if (incoming == null || incoming === '') return undefined;
  return incoming;
}

// ---------------------------------------------------------------------------
// importProspects — main entry
// ---------------------------------------------------------------------------

export async function importProspects(
  rows: CsvProspectRow[],
  opts: ImportOptions,
): Promise<ImportReport> {
  const startedAt = Date.now();
  const autoSegment = opts.autoSegment !== false;
  const autoEnqueue = opts.autoEnqueue !== false;
  const channel = validChannel(opts.channel);

  const results: ImportResult[] = [];
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let errored = 0;

  // Bail fast if no rows.
  if (rows.length === 0) {
    return {
      total: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errored: 0,
      results: [],
      durationMs: Date.now() - startedAt,
    };
  }

  // Service client (bypasses RLS). Callers MUST have already verified admin.
  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch (err) {
    // Mark every row as errored — caller still gets a structured report.
    const msg = err instanceof Error ? err.message : 'service_client_unavailable';
    return {
      total: rows.length,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errored: rows.length,
      results: rows.map((r, i) => ({
        line: i + 2,
        email: r.email,
        outcome: 'errored',
        error: msg,
      })),
      durationMs: Date.now() - startedAt,
    };
  }

  // ─── Pre-fetch suppression list ─────────────────────────────────────────
  const unsubSet = new Set<string>();
  try {
    const { data: unsubs } = await supabase
      .from('sales_unsubscribes')
      .select('email_lower');
    for (const u of unsubs ?? []) {
      if (u && typeof (u as { email_lower?: string }).email_lower === 'string') {
        unsubSet.add(((u as { email_lower: string }).email_lower).toLowerCase());
      }
    }
  } catch (err) {
    console.error('[importProspects] unsub prefetch failed:', err);
  }

  // ─── Resolve campaign slug → UUID ───────────────────────────────────────
  let campaignId: string | null = null;
  if (opts.campaignSlug) {
    try {
      const { data: campaign } = await supabase
        .from('sales_campaigns')
        .select('id')
        .eq('slug', opts.campaignSlug)
        .maybeSingle();
      if (campaign?.id) campaignId = (campaign as { id: string }).id;
    } catch (err) {
      console.error('[importProspects] campaign lookup failed:', err);
    }
  }

  // ─── Per-row loop ───────────────────────────────────────────────────────
  for (let i = 0; i < rows.length; i++) {
    const lineNum = i + 2; // header is line 1
    const row = rows[i];
    const emailLower = row.email.toLowerCase();

    try {
      // 1. Suppression skip
      if (unsubSet.has(emailLower)) {
        skipped++;
        results.push({
          line: lineNum,
          email: row.email,
          outcome: 'skipped_unsub',
        });
        continue;
      }

      // 2. Lookup existing prospect
      const { data: existing } = await supabase
        .from('sales_prospects')
        .select(
          'id, email, full_name, first_name, last_name, title, company, industry, zip, city, state, feeder_city, segment, estimated_hhi, party_size_guess, linkedin_url, instagram_handle, facebook_url, reddit_username, twitter_handle, phone, source_channel, source_campaign, source_notes, enrichment_source, enrichment_data, status, current_sequence',
        )
        .ilike('email', emailLower)
        .maybeSingle();

      const isUpdate = !!existing;

      // 3. Build payload — merge-only-null-fields when updating
      const targetChannel = channel ?? row.source_channel ?? null;
      const sourceCampaignUuid = campaignId ?? null;

      // Effective segment: row.segment if provided, else infer if autoSegment.
      let effectiveSegment: Segment | undefined;
      if (row.segment) {
        effectiveSegment = row.segment as Segment;
      } else if (autoSegment) {
        const seg = inferSegment({
          email: row.email,
          fullName: row.full_name,
          intakeNotes: row.source_notes,
          sourceCampaign: opts.campaignSlug,
          partySize: row.party_size_guess,
        });
        if (seg.segment !== 'unknown') effectiveSegment = seg.segment;
      }

      // Route → sequence (only for new prospects with email)
      let sequenceId: string | undefined;
      let nextTouchAt: string | undefined;
      if (autoEnqueue && !isUpdate && row.email) {
        const decision = routeProspect({
          segment: effectiveSegment ?? 'unknown',
          campaignSlug: opts.campaignSlug,
          status: 'new',
          isNew: true,
          hasEmail: true,
        });
        if (decision.sequenceId && decision.startAtIso) {
          sequenceId = decision.sequenceId;
          nextTouchAt = decision.startAtIso;
        }
      }

      // ─── Dry run: report what *would* happen and continue ────────────────
      if (opts.dryRun) {
        if (isUpdate) {
          updated++;
          results.push({
            line: lineNum,
            email: row.email,
            outcome: 'updated',
            segment: effectiveSegment,
          });
        } else {
          inserted++;
          results.push({
            line: lineNum,
            email: row.email,
            outcome: 'inserted',
            segment: effectiveSegment,
            sequenceId,
          });
        }
        continue;
      }

      // ─── Update path ────────────────────────────────────────────────────
      if (isUpdate && existing) {
        const e = existing as Record<string, unknown> & { id: string };
        const update: Record<string, unknown> = {};

        // String fields — only fill if currently null/empty.
        const stringFields: Array<keyof CsvProspectRow> = [
          'full_name',
          'first_name',
          'last_name',
          'title',
          'company',
          'industry',
          'zip',
          'city',
          'state',
          'feeder_city',
          'estimated_hhi',
          'linkedin_url',
          'instagram_handle',
          'facebook_url',
          'reddit_username',
          'twitter_handle',
          'phone',
          'enrichment_source',
        ];
        for (const f of stringFields) {
          const incoming = row[f];
          if (typeof incoming === 'string') {
            const merged = pickIf(e[f] as string | null, incoming);
            if (merged != null) update[f] = merged;
          }
        }

        // party_size_guess
        if (typeof row.party_size_guess === 'number' && e.party_size_guess == null) {
          update.party_size_guess = row.party_size_guess;
        }

        // Segment — only refine if existing is null/unknown and we have a real value.
        if (
          effectiveSegment &&
          effectiveSegment !== 'unknown' &&
          (!e.segment || e.segment === 'unknown')
        ) {
          update.segment = effectiveSegment;
        }

        // Source channel — fill if empty.
        if (targetChannel && !e.source_channel) {
          update.source_channel = targetChannel;
        }

        // Source campaign — fill if empty.
        if (sourceCampaignUuid && !e.source_campaign) {
          update.source_campaign = sourceCampaignUuid;
        }

        // Enrichment data — only fill if existing is null.
        if (row.enrichment_data != null && e.enrichment_data == null) {
          update.enrichment_data = row.enrichment_data;
        }

        // Source notes — append (don't overwrite). Stamp with ISO date.
        if (row.source_notes) {
          const prefix = e.source_notes ? `${e.source_notes}\n\n` : '';
          update.source_notes = `${prefix}[${new Date().toISOString()}] ${row.source_notes}`;
        }

        if (Object.keys(update).length > 0) {
          const { error: updErr } = await supabase
            .from('sales_prospects')
            .update(update)
            .eq('id', e.id);
          if (updErr) throw updErr;
        }

        updated++;
        results.push({
          line: lineNum,
          email: row.email,
          outcome: 'updated',
          segment: (update.segment as string | undefined) ?? (e.segment as string | undefined),
        });
        continue;
      }

      // ─── Insert path ────────────────────────────────────────────────────
      const insertRow: Record<string, unknown> = {
        email: row.email,
        full_name: row.full_name ?? null,
        first_name: row.first_name ?? null,
        last_name: row.last_name ?? null,
        title: row.title ?? null,
        company: row.company ?? null,
        industry: row.industry ?? null,
        zip: row.zip ?? null,
        city: row.city ?? null,
        state: row.state ?? null,
        feeder_city: row.feeder_city ?? null,
        segment: effectiveSegment ?? 'unknown',
        estimated_hhi: row.estimated_hhi ?? null,
        party_size_guess: row.party_size_guess ?? null,
        linkedin_url: row.linkedin_url ?? null,
        instagram_handle: row.instagram_handle ?? null,
        facebook_url: row.facebook_url ?? null,
        reddit_username: row.reddit_username ?? null,
        twitter_handle: row.twitter_handle ?? null,
        phone: row.phone ?? null,
        source_channel: targetChannel,
        source_campaign: sourceCampaignUuid,
        source_notes: row.source_notes
          ? `[${new Date().toISOString()}] ${row.source_notes}`
          : null,
        enrichment_source: row.enrichment_source ?? 'csv_import',
        enrichment_data: row.enrichment_data ?? null,
        status: sequenceId ? 'queued' : 'new',
        current_sequence: sequenceId ?? null,
        sequence_step: sequenceId ? 0 : 0,
        next_touch_at: nextTouchAt ?? null,
      };

      const { data: insertedRow, error: insertErr } = await supabase
        .from('sales_prospects')
        .insert(insertRow)
        .select('id')
        .maybeSingle();

      if (insertErr) throw insertErr;

      inserted++;
      results.push({
        line: lineNum,
        email: row.email,
        outcome: 'inserted',
        segment: effectiveSegment,
        sequenceId,
      });

      // Best-effort touch log so the admin dashboard can show why a prospect
      // landed in a particular sequence (mirrors capture-route behavior).
      if (insertedRow && (effectiveSegment || sequenceId)) {
        try {
          await supabase.from('sales_touches').insert({
            prospect_id: (insertedRow as { id: string }).id,
            campaign_id: sourceCampaignUuid,
            channel: targetChannel ?? 'email',
            touch_type: 'status_change',
            sequence: sequenceId ?? null,
            sequence_step: sequenceId ? 0 : null,
            metadata: {
              event: 'csv_imported',
              segment: effectiveSegment ?? 'unknown',
              sequence: sequenceId ?? null,
              campaign_slug: opts.campaignSlug ?? null,
            },
          });
        } catch (err) {
          // Touch log failures must not flip the row outcome.
          console.error('[importProspects] touch log failed:', err);
        }
      }
    } catch (err) {
      errored++;
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        line: lineNum,
        email: row.email,
        outcome: 'errored',
        error: msg,
      });
      console.error('[importProspects] row error:', { line: lineNum, email: row.email, err });
      // Continue with next row — partial failure must not lose successful rows.
    }
  }

  return {
    total: rows.length,
    inserted,
    updated,
    skipped,
    errored,
    results,
    durationMs: Date.now() - startedAt,
  };
}
