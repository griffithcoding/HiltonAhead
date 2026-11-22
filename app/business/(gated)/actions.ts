'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { requireBusinessOwner } from '@/utils/supabase/businessOwner';

export type UpdateListingResult =
  | { ok: true }
  | { ok: false; error: string };

export interface UpdateListingInput {
  businessId: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  hours: string;
  instagram: string;
  facebook: string;
  parking: string;
  dressCode: string;
  /** 'yes' | 'no' | '' (not specified) */
  petFriendly: string;
}

const MAX: Record<string, number> = {
  name: 120,
  tagline: 160,
  address: 200,
  city: 80,
  phone: 40,
  website: 300,
  hours: 200,
  instagram: 60,
  facebook: 200,
  parking: 200,
  dressCode: 200,
};

const LABEL: Record<string, string> = {
  name: 'Business name',
  tagline: 'Tagline',
  address: 'Address',
  city: 'City',
  phone: 'Phone',
  website: 'Website',
  hours: 'Hours',
  instagram: 'Instagram',
  facebook: 'Facebook',
  parking: 'Parking note',
  dressCode: 'Dress code',
};

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Save an owner's edits to their listing.
 *
 * Gate: requireBusinessOwner() + the target id must be in the caller's
 * owned set. The write goes through the user-scoped SSR client, so RLS and
 * the column grants in migration 026 also apply — an owner cannot change
 * tier, status, slug or editorial copy even with a hand-built request.
 */
export async function updateListing(
  input: UpdateListingInput,
): Promise<UpdateListingResult> {
  const auth = await requireBusinessOwner();
  if (!auth.ok) return { ok: false, error: auth.error };

  const owned = auth.businesses.find((b) => b.business_id === input.businessId);
  if (!owned) return { ok: false, error: 'You do not manage this listing.' };

  const fields = {
    name: clean(input.name),
    tagline: clean(input.tagline),
    address: clean(input.address),
    city: clean(input.city),
    phone: clean(input.phone),
    website: clean(input.website),
    hours: clean(input.hours),
    // Stored as a bare handle — the card builds the instagram.com URL.
    instagram: clean(input.instagram)
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/^@/, '')
      .replace(/\/+$/, ''),
    facebook: clean(input.facebook),
    parking: clean(input.parking),
    dressCode: clean(input.dressCode),
  };

  if (!fields.name) return { ok: false, error: 'Business name is required.' };
  for (const [key, value] of Object.entries(fields)) {
    if (value.length > MAX[key]) {
      return {
        ok: false,
        error: `${LABEL[key]} is too long (max ${MAX[key]} characters).`,
      };
    }
  }
  if (fields.phone && !/^[0-9+().\-\s]{7,}$/.test(fields.phone)) {
    return { ok: false, error: 'Enter a valid phone number.' };
  }
  if (fields.website) {
    let url: URL | null = null;
    try {
      url = new URL(fields.website);
    } catch {
      url = null;
    }
    if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:')) {
      return {
        ok: false,
        error: 'Website must be a full address starting with https://',
      };
    }
  }
  if (fields.instagram && !/^[A-Za-z0-9._]+$/.test(fields.instagram)) {
    return {
      ok: false,
      error: 'Instagram should be just your handle, e.g. thesaltydogcafe.',
    };
  }
  const petFriendly =
    input.petFriendly === 'yes' ? true : input.petFriendly === 'no' ? false : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('businesses')
    .update({
      name: fields.name,
      tagline: fields.tagline || null,
      address: fields.address || null,
      city: fields.city || null,
      phone: fields.phone || null,
      website: fields.website || null,
      hours: fields.hours || null,
      instagram: fields.instagram || null,
      facebook: fields.facebook || null,
      parking: fields.parking || null,
      dress_code: fields.dressCode || null,
      pet_friendly: petFriendly,
      owner_edited_at: new Date().toISOString(),
    })
    .eq('id', input.businessId)
    .select('industry_slug')
    .maybeSingle();

  if (error) {
    console.error('[business/actions] updateListing error:', error);
    return { ok: false, error: 'Could not save your changes. Try again.' };
  }
  if (!data) return { ok: false, error: 'Listing not found.' };

  revalidatePath('/business');
  revalidatePath(`/business/listing/${input.businessId}`);
  revalidatePath(`/local/${data.industry_slug}`);
  return { ok: true };
}
