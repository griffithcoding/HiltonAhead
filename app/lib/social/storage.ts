/**
 * Supabase Storage upload helper for spotlight overlay PNGs.
 *
 * Bucket: 'social-overlays' (public read, service-role write).
 * Path:   spotlight/<yyyy>/<mm>/<post-id>.png
 *
 * Retries the upload once on failure. Returns { path, url } on success
 * or null on hard failure — caller decides whether to insert a draft
 * with image_url=null (manual-upload prompt in admin queue).
 */

import { createServiceClient } from '@/utils/supabase/service';

const BUCKET = 'social-overlays';

export type UploadResult = { path: string; url: string };

export function buildObjectPath(postId: string, at: Date = new Date()): string {
  const yyyy = at.getUTCFullYear();
  const mm = String(at.getUTCMonth() + 1).padStart(2, '0');
  return `spotlight/${yyyy}/${mm}/${postId}.png`;
}

export async function uploadOverlay(
  postId: string,
  pngBuffer: Buffer,
): Promise<UploadResult | null> {
  const supabase = createServiceClient();
  const path = buildObjectPath(postId);

  for (let attempt = 0; attempt < 2; attempt++) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: true,
      });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { path, url: data.publicUrl };
    }

    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }
    console.error('[social.storage] upload failed twice', { path, error });
    return null;
  }
  return null;
}
