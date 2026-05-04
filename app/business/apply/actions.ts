'use server';

import { headers } from 'next/headers';
import { createServiceClient } from '@/utils/supabase/service';
import {
  sendBusinessApplicationNotification,
  sendBusinessApplicationAck,
} from '@/app/lib/email';

export type ApplyResult =
  | { ok: true }
  | { ok: false; error: string };

export interface ApplyInput {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industrySlug: string;
  website?: string;
  message?: string;
}

const VALID_INDUSTRIES = new Set([
  'restaurants',
  'golf',
  'water-activities',
  'weddings',
  'spas-wellness',
  'vacation-rentals',
  'shopping',
  'family-activities',
  'pizza',
  'transportation',
  'home-services',
  'fishing-charters',
  'dolphin-tours',
]);

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Public-facing application submission for /business/apply.
 *
 * Writes to public.business_applications via the service-role client
 * (bypasses RLS so the insert isn't subject to the anon-only insert
 * policy quirks; the table itself only allows anon insert anyway, so
 * the privileged path is here purely for predictable error handling).
 *
 * Best-effort email notification on both sides — we never block the
 * applicant on email infra.
 */
export async function submitBusinessApplication(
  input: ApplyInput,
): Promise<ApplyResult> {
  // Validate
  if (!input.businessName.trim())
    return { ok: false, error: 'Business name is required.' };
  if (!input.contactName.trim())
    return { ok: false, error: 'Your name is required.' };
  if (!isEmail(input.email))
    return { ok: false, error: 'A valid email is required.' };
  if (!VALID_INDUSTRIES.has(input.industrySlug))
    return { ok: false, error: 'Pick a category for your business.' };
  if (input.businessName.length > 200)
    return { ok: false, error: 'Business name is too long.' };
  if ((input.message?.length ?? 0) > 2000)
    return { ok: false, error: 'Message is too long (max 2000 chars).' };

  const userAgent = (await headers()).get('user-agent') || null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('business_applications')
    .insert({
      business_name: input.businessName.trim(),
      contact_name: input.contactName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      industry_slug: input.industrySlug,
      website: input.website?.trim() || null,
      message: input.message?.trim() || null,
      user_agent: userAgent,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[business/apply] insert error:', error);
    return {
      ok: false,
      error:
        'Something went wrong saving your application. Email hello@hiltonahead.com if it persists.',
    };
  }

  // Best-effort emails. Don't fail the apply on email errors.
  try {
    await Promise.all([
      sendBusinessApplicationNotification({
        businessName: input.businessName,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone,
        industrySlug: input.industrySlug,
        website: input.website,
        message: input.message,
        applicationId: data.id,
      }),
      sendBusinessApplicationAck({
        to: input.email,
        contactName: input.contactName,
        businessName: input.businessName,
      }),
    ]);
  } catch (emailErr) {
    console.error('[business/apply] email error (non-fatal):', emailErr);
  }

  return { ok: true };
}
