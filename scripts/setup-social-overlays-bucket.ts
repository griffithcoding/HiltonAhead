/**
 * One-shot setup: create the `social-overlays` Supabase Storage bucket.
 *
 * Usage:
 *   npx tsx scripts/setup-social-overlays-bucket.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (loaded via dotenv). Idempotent — re-running on an existing bucket is a no-op.
 *
 * Bucket config (mirrors spec §6.3):
 *   - public read
 *   - 5 MB max object size
 *   - image/png only
 */

// Env loaded via Node 20.6+ --env-file flag; no dotenv needed.
// Usage: node --env-file=.env.local --import tsx scripts/setup-social-overlays-bucket.ts
import { createClient } from '@supabase/supabase-js';

const BUCKET_ID = 'social-overlays';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required (check .env.local)',
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Check if bucket already exists
  const { data: existing, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw new Error(`listBuckets failed: ${listErr.message}`);

  const found = existing?.find((b) => b.id === BUCKET_ID);
  if (found) {
    console.log(`OK — bucket "${BUCKET_ID}" already exists (public=${found.public}).`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET_ID, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png'],
  });

  if (error) throw new Error(`createBucket failed: ${error.message}`);
  console.log(`OK — bucket "${BUCKET_ID}" created (public, 5MB cap, image/png only).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
