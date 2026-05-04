/**
 * Seed the public.businesses table from data/localBusinesses.ts.
 *
 * In Phase 0/1, the static TS file remains the SOURCE OF TRUTH for the
 * public /local/* pages. This script copies each Business row into the
 * dynamic businesses table so:
 *   1. The claim flow has a real `businesses` row to bind owners to.
 *   2. Phase 2 can swap the public render layer to read from the table
 *      without a separate data migration.
 *
 * Idempotent — uses upsert on `slug`. Run any time the TS file changes
 * to backfill new rows. Existing owner-edited rows are not clobbered
 * for fields the owner has likely touched (name, hours, contact); we
 * only update fields that are pure editorial (review, notable_for,
 * categories, hero_image) and the audit field last_verified.
 *
 * Usage:
 *   npx tsx scripts/seed-businesses.ts
 *
 * Required env (in shell or .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  — service-role key, server-only
 */

import { createClient } from '@supabase/supabase-js';
import { allBusinesses } from '../data/localBusinesses';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
  );
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(`Seeding ${allBusinesses.length} businesses…`);

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (const b of allBusinesses) {
    // Find existing row by slug.
    const { data: existing } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('slug', b.id)
      .maybeSingle();

    const editorialFields = {
      industry_slug: b.industrySlug,
      schema_type: b.schemaType,
      categories: b.categories,
      price_range: b.priceRange ?? null,
      review: b.review,
      notable_for: b.notableFor,
      hero_image_src: b.heroImage.src || null,
      hero_image_alt: b.heroImage.alt || null,
      gate_pass: b.gatePass ?? null,
      pet_friendly: b.petFriendly ?? null,
      booking_lead_peak: b.bookingLeadTimeDays?.peak ?? null,
      booking_lead_off_peak: b.bookingLeadTimeDays?.offPeak ?? null,
      last_verified: b.lastVerified
        ? new Date(b.lastVerified).toISOString()
        : null,
    };

    if (existing) {
      // Don't clobber owner-edited fields (name, hours, contact, social).
      const { error } = await supabase
        .from('businesses')
        .update(editorialFields)
        .eq('id', existing.id);
      if (error) {
        console.error(`  ✗ ${b.id}: ${error.message}`);
        failed += 1;
      } else {
        updated += 1;
      }
    } else {
      const { error } = await supabase.from('businesses').insert({
        slug: b.id,
        name: b.name,
        tagline: b.tagline,
        address: b.address,
        city: b.city,
        phone: b.phone ?? null,
        website: b.website ?? null,
        hours: b.hours ?? null,
        instagram: b.instagram ?? null,
        facebook: b.facebook ?? null,
        lat: b.lat ?? null,
        lng: b.lng ?? null,
        local_quote: b.localQuote ?? null,
        best_for: b.bestFor ?? null,
        parking: b.parking ?? null,
        dress_code: b.dressCode ?? null,
        owner_name: b.ownerName ?? null,
        owner_email: b.ownerEmail ?? null,
        inquiry_routing_email: b.inquiryRoutingEmail ?? null,
        ...editorialFields,
      });
      if (error) {
        console.error(`  ✗ ${b.id}: ${error.message}`);
        failed += 1;
      } else {
        inserted += 1;
      }
    }
  }

  console.log(
    `Done. inserted=${inserted}, updated=${updated}, failed=${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
