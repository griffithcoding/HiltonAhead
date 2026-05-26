/**
 * Weekly cron — generates 5 IG spotlight drafts for unspotlighted businesses.
 *
 * Schedule: 0 13 * * 1 (Mon 13:00 UTC = 09:00 ET in EST; 08:00 ET in EDT).
 *
 * Auth:  Authorization: Bearer ${CRON_SECRET}
 * Query: ?preview=true → dry-run, returns picks + sample caption, no writes
 *
 * Behavior:
 *  - Idempotent: if >= DRAFTS_PER_WEEK drafts already exist for today, return
 *    { skipped: 'already-generated' }.
 *  - Spend-capped: env SOCIAL_GENERATE_MAX_USD (default 2.00). If exceeded
 *    mid-run, stops early and reports { stopped: 'cost-cap' }.
 *  - Per-business try/catch — one failure does not kill the batch. Failed
 *    businesses log + are NOT advanced in social_rotations.
 *  - On any success, notify operator via notifyAdminSocialQueue.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { allBusinesses, type Business } from '@/data/localBusinesses';
import { photos } from '@/data/photos';
import { pickNextN, markSpotlighted } from '@/app/lib/social/rotation';
import { generateCaption } from '@/app/lib/social/caption';
import { buildHashtagsFor } from '@/app/lib/social/hashtags';
import { composeOverlay } from '@/app/lib/social/overlay';
import { uploadOverlay } from '@/app/lib/social/storage';
import { notifyAdminSocialQueue } from '@/app/lib/email';
import {
  DRAFTS_PER_WEEK,
  SCHEDULE_SLOT_DAYS,
  SCHEDULE_SLOT_HOUR_UTC,
  SOCIAL_GENERATE_MAX_USD_DEFAULT,
} from '@/app/lib/social/types';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TEMPLATE_ROTATION = ['spotlight-v1', 'spotlight-v2', 'spotlight-v3'];

// Build flat photo pool once at module load from the nested data/photos.ts.
// No per-business industry matching (photos.ts has no industry tags); we use
// a deterministic hash on business.id to spread photos evenly across the pool.
const PHOTO_POOL: string[] = (() => {
  const urls = new Set<string>();
  // Singleton plates
  urls.add(photos.hero.src);
  urls.add(photos.lighthouse.src);
  urls.add(photos.cta.src);
  urls.add(photos.insiderProof.src);
  // Array collections — each item has .src
  for (const arr of [photos.heroCollage, photos.moods, photos.polaroidWall, photos.neighborhoods, photos.aerials]) {
    for (const item of arr) {
      if (item && typeof item === 'object' && 'src' in item && typeof item.src === 'string') {
        urls.add(item.src);
      }
    }
  }
  return Array.from(urls);
})();

function bearerOk(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const got = req.headers.get('authorization');
  return got === `Bearer ${expected}`;
}

function lookupBusiness(id: string): Business | undefined {
  return allBusinesses.find((b) => b.id === id);
}

function pickPhotoFor(business: Business): string | null {
  if (PHOTO_POOL.length === 0) return null;
  // Deterministic per-business pick: hash business.id → pool index.
  const hash = Array.from(business.id).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return PHOTO_POOL[hash % PHOTO_POOL.length];
}

function utmCampaignFor(businessId: string, at: Date): string {
  const yymmdd = at.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  return `spotlight-${businessId}-${yymmdd}`;
}

function slotForIndex(weekStart: Date, idx: number): Date {
  // weekStart = today @ 00:00 UTC; idx 0..4 maps Tue..Sat
  const day = SCHEDULE_SLOT_DAYS[idx % SCHEDULE_SLOT_DAYS.length];
  const d = new Date(weekStart);
  const currentDay = d.getUTCDay();
  const delta = (day - currentDay + 7) % 7 || 7; // always future-ish
  d.setUTCDate(d.getUTCDate() + delta);
  d.setUTCHours(SCHEDULE_SLOT_HOUR_UTC, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  if (!bearerOk(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const preview = url.searchParams.get('preview') === 'true';

  const supabase = createServiceClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

  // Idempotency check
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setUTCHours(0, 0, 0, 0);

  if (!preview) {
    const { count } = await supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());
    if ((count ?? 0) >= DRAFTS_PER_WEEK) {
      return NextResponse.json({ ok: true, skipped: 'already-generated', count });
    }
  }

  const picks = await pickNextN(DRAFTS_PER_WEEK);
  if (picks.length === 0) {
    return NextResponse.json({ ok: true, generated: 0, note: 'no eligible businesses' });
  }

  const spendCap = Number(process.env.SOCIAL_GENERATE_MAX_USD ?? SOCIAL_GENERATE_MAX_USD_DEFAULT);
  let totalCost = 0;
  const generated: unknown[] = [];
  const failed: unknown[] = [];

  for (let i = 0; i < picks.length; i++) {
    if (totalCost >= spendCap) {
      return NextResponse.json({
        ok: true,
        stopped: 'cost-cap',
        generated: generated.length,
        failed: failed.length,
        totalCost,
      });
    }

    const pick = picks[i];
    const biz = lookupBusiness(pick.business_slug);
    if (!biz) {
      failed.push({ id: pick.business_slug, reason: 'business not in registry' });
      continue;
    }

    try {
      const captionResult = await generateCaption(biz);
      totalCost += captionResult.generation_cost_usd ?? 0;
      const hashtags = buildHashtagsFor(biz.industrySlug, captionResult.hashtags);

      if (preview) {
        generated.push({
          id: biz.id,
          industry: biz.industrySlug,
          caption: captionResult.caption,
          hashtags,
          usedFallback: captionResult.used_fallback,
        });
        continue;
      }

      const scheduledAt = slotForIndex(todayStart, i);
      const utmCampaign = utmCampaignFor(biz.id, scheduledAt);
      const templateName = TEMPLATE_ROTATION[i % TEMPLATE_ROTATION.length];
      const postId = randomUUID();

      // Overlay (best-effort — null on failure means manual upload required)
      let imagePath: string | null = null;
      let imageUrl: string | null = null;
      const photoUrl = pickPhotoFor(biz);
      if (photoUrl) {
        try {
          const buf = await composeOverlay(biz, photoUrl, templateName, captionResult.caption);
          const uploaded = await uploadOverlay(postId, buf);
          if (uploaded) {
            imagePath = uploaded.path;
            imageUrl = uploaded.url;
          }
        } catch (overlayErr) {
          console.error('[social-generate] overlay failed', biz.id, overlayErr);
        }
      }

      const { error: insertErr } = await supabase.from('social_posts').insert({
        id: postId,
        business_slug: biz.id,
        industry_slug: biz.industrySlug,
        platform: 'instagram',
        caption: captionResult.caption,
        hashtags,
        image_path: imagePath,
        image_url: imageUrl,
        overlay_template: templateName,
        status: 'draft',
        scheduled_at: scheduledAt.toISOString(),
        utm_campaign: utmCampaign,
        created_by_ai: true,
        generated_by_model: captionResult.generated_by_model,
        generation_cost_usd: captionResult.generation_cost_usd,
        edit_notes: captionResult.used_fallback ? 'LLM-content-filtered, template fallback' : null,
      });

      if (insertErr) {
        failed.push({ id: biz.id, reason: insertErr.message });
        continue;
      }

      await markSpotlighted(biz.id);
      generated.push({ id: biz.id, scheduledAt, utmCampaign });
    } catch (err) {
      console.error('[social-generate] per-business failure', biz.id, err);
      failed.push({
        id: biz.id,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (preview) {
    return NextResponse.json({
      ok: true,
      preview: true,
      picks: picks.length,
      sampleCount: generated.length,
      generated,
      failed,
      estimatedTotalCost: totalCost,
    });
  }

  await notifyAdminSocialQueue({
    generated: generated.length,
    failed: failed.length,
    costUsd: totalCost,
    baseUrl,
  });

  // Structured single-line log per spec §8.7
  console.info(JSON.stringify({
    event: 'social-generate.run',
    run_id: randomUUID(),
    drafts_generated: generated.length,
    drafts_failed: failed.length,
    total_cost_usd: totalCost,
    duration_ms: Date.now() - startedAt,
  }));

  return NextResponse.json({
    ok: true,
    generated: generated.length,
    failed: failed.length,
    totalCost,
  });
}

// Vercel cron will GET this route by default; expose POST for ad-hoc curl too.
export const POST = GET;
