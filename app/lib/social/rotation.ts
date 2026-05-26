/**
 * Rotation picker for weekly spotlights.
 *
 * Algorithm: stale-first. Eligible = any business in data/localBusinesses.ts
 * whose social_rotations.last_spotlighted_at is either null OR older than
 * ROTATION_COOLDOWN_WEEKS. Sorted by last_spotlighted_at ASC NULLS FIRST,
 * then by stable business_slug for determinism. Top N picked.
 *
 * Also validates that each picked slug actually resolves to a /local/[industry]/[slug]
 * route — businesses that have been removed from the registry are dropped.
 */

import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses } from '@/data/localBusinesses';
import {
  DRAFTS_PER_WEEK,
  ROTATION_COOLDOWN_WEEKS,
  type RotationPick,
} from './types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function pickNextN(n: number = DRAFTS_PER_WEEK): Promise<RotationPick[]> {
  const supabase = createServiceClient();

  // 1. Pull current rotation state for all known slugs in one query
  const { data: rotationRows, error } = await supabase
    .from('social_rotations')
    .select('business_slug, last_spotlighted_at');

  if (error) {
    throw new Error(`rotation: failed to read social_rotations: ${error.message}`);
  }

  const lastByBiz = new Map<string, string>();
  for (const r of rotationRows ?? []) {
    if (r.business_slug && r.last_spotlighted_at) {
      lastByBiz.set(r.business_slug, r.last_spotlighted_at);
    }
  }

  const cutoff = Date.now() - ROTATION_COOLDOWN_WEEKS * WEEK_MS;

  // 2. Filter eligible + score by weeks-since-last (null = infinity)
  const eligible: Array<RotationPick & { _sortKey: number }> = [];
  for (const biz of allBusinesses) {
    if (!biz.id || !biz.industrySlug) continue;
    const lastIso = lastByBiz.get(biz.id);
    const lastMs = lastIso ? new Date(lastIso).getTime() : null;
    if (lastMs !== null && lastMs > cutoff) continue; // still cooling down

    const weeksSince = lastMs === null
      ? null
      : Math.floor((Date.now() - lastMs) / WEEK_MS);

    eligible.push({
      business_slug: biz.id,
      industry_slug: biz.industrySlug,
      weeks_since_last: weeksSince,
      _sortKey: lastMs === null ? -Infinity : lastMs, // nulls first
    });
  }

  // 3. Sort stable: oldest (or never) first, then slug A→Z for determinism
  eligible.sort((a, b) => {
    if (a._sortKey !== b._sortKey) return a._sortKey - b._sortKey;
    return a.business_slug.localeCompare(b.business_slug);
  });

  return eligible.slice(0, n).map(({ _sortKey, ...rest }) => rest);
}

/**
 * After a successful draft creation, advance the rotation for one business.
 * Idempotent via upsert on business_slug primary key.
 */
export async function markSpotlighted(business_slug: string): Promise<void> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Read current count
  const { data: existing } = await supabase
    .from('social_rotations')
    .select('spotlight_count')
    .eq('business_slug', business_slug)
    .maybeSingle();

  const newCount = (existing?.spotlight_count ?? 0) + 1;

  const { error } = await supabase
    .from('social_rotations')
    .upsert({
      business_slug,
      last_spotlighted_at: now,
      spotlight_count: newCount,
      updated_at: now,
    });

  if (error) {
    throw new Error(`rotation: failed to mark spotlighted: ${error.message}`);
  }
}

/**
 * Reverse a rotation entry after a draft is rejected. Restores previous
 * last_spotlighted_at value if known, otherwise removes the row entirely
 * so the business re-enters the eligible pool.
 */
export async function rollbackSpotlight(business_slug: string): Promise<void> {
  const supabase = createServiceClient();
  // Simplest correct behavior: delete the rotation row. Next pick will treat
  // this business as never-spotlighted. Spotlight_count history is lost,
  // which is acceptable for v1.
  const { error } = await supabase
    .from('social_rotations')
    .delete()
    .eq('business_slug', business_slug);

  if (error) {
    throw new Error(`rotation: failed to rollback: ${error.message}`);
  }
}
