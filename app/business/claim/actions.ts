'use server';

import { randomBytes } from 'node:crypto';
import { headers } from 'next/headers';
import { createServiceClient } from '@/utils/supabase/service';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { allBusinesses } from '@/data/localBusinesses';
import {
  sendClaimVerificationEmail,
  sendClaimRequestAdminNotification,
} from '@/app/lib/email';

export type StartClaimResult =
  | { ok: true; sentTo: 'listed-email' | 'admin-review' }
  | { ok: false; error: string };

export interface StartClaimInput {
  businessSlug: string;
  emailEnteredByUser: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hiltonahead.com';

/**
 * Issue a claim token for an existing listing.
 *
 * Two paths based on whether the email entered by the requester matches
 * the email on file for the listing:
 *   1. MATCH (case-insensitive) → token sent to that email; user clicks
 *      it to verify and bind the auth row.
 *   2. NO MATCH (or no email on file) → request still recorded, but
 *      flagged for admin manual review. User is told an admin will
 *      follow up.
 *
 * The actual binding (auth.uid → business_id) happens in verifyClaim()
 * AFTER the user clicks the emailed link AND signs in.
 *
 * NOTE: Phase 0/1 doesn't yet have a `businesses` row for every listing
 * (the seed script populates that). We persist the `business_slug` (the
 * Business.id from the TS file) and resolve to a business_id later when
 * the seed script has run. Until then, the verify step looks up by slug.
 */
export async function startBusinessClaim(
  input: StartClaimInput,
): Promise<StartClaimResult> {
  const biz = allBusinesses.find((b) => b.id === input.businessSlug);
  if (!biz) return { ok: false, error: 'Listing not found.' };

  const enteredEmail = input.emailEnteredByUser.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enteredEmail)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  const onFileEmail = (
    biz.inquiryRoutingEmail ||
    biz.ownerEmail ||
    ''
  )
    .trim()
    .toLowerCase();

  const isAutoVerify = onFileEmail !== '' && enteredEmail === onFileEmail;

  const userAgent = (await headers()).get('user-agent') || null;
  const supabase = createServiceClient();

  // Resolve business_id from the businesses table if seeded; otherwise
  // we can't insert because of the FK. Fall back to admin-review path
  // (we still record the request via business_applications message).
  const { data: bizRow } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', input.businessSlug)
    .maybeSingle();

  if (!bizRow) {
    // No row yet — file as an application-style request for an admin to
    // create the business row + manually approve the claim.
    const { error: appErr } = await supabase
      .from('business_applications')
      .insert({
        business_name: biz.name,
        contact_name: biz.ownerName || 'Listing claimant',
        email: enteredEmail,
        industry_slug: biz.industrySlug,
        message: `Claim request for existing listing slug "${input.businessSlug}". Auto-verify path unavailable: businesses row not seeded yet.`,
        user_agent: userAgent,
      });
    if (appErr) {
      console.error('[claim/start] application insert error:', appErr);
      return {
        ok: false,
        error:
          'Could not record your request. Email hello@hiltonahead.com and we will assist.',
      };
    }
    return { ok: true, sentTo: 'admin-review' };
  }

  // Seeded — we can issue a real token (or admin-review if email mismatch).
  const token = randomBytes(32).toString('hex');

  const { error: claimErr } = await supabase
    .from('business_claim_requests')
    .insert({
      business_id: bizRow.id,
      email: enteredEmail,
      token,
      user_agent: userAgent,
    });

  if (claimErr) {
    console.error('[claim/start] claim insert error:', claimErr);
    return {
      ok: false,
      error: 'Could not start the claim. Try again or email us.',
    };
  }

  const verifyUrl = `${SITE_URL}/business/claim/verify?token=${token}`;

  if (isAutoVerify) {
    try {
      await sendClaimVerificationEmail({
        to: enteredEmail,
        businessName: biz.name,
        verifyUrl,
      });
    } catch (e) {
      console.error('[claim/start] verification email error:', e);
    }
    return { ok: true, sentTo: 'listed-email' };
  }

  // Mismatch → notify admins for manual review (the token still works
  // if the admin chooses to forward it after vetting).
  try {
    await sendClaimRequestAdminNotification({
      businessName: biz.name,
      businessSlug: input.businessSlug,
      requesterEmail: enteredEmail,
      onFileEmail,
      verifyUrl,
    });
  } catch (e) {
    console.error('[claim/start] admin notification error:', e);
  }
  return { ok: true, sentTo: 'admin-review' };
}

export type VerifyClaimResult =
  | { ok: true; businessSlug: string; businessName: string }
  | { ok: false; error: string };

/**
 * Consume a claim token AFTER the user has signed in.
 *
 * The token in the URL proves access to the listed email; auth.uid
 * comes from the signed-in session; the binding is created in
 * business_owners. Token is one-use (consumed_at set).
 */
export async function verifyBusinessClaim(
  token: string,
): Promise<VerifyClaimResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: 'You need to sign in first. Use the magic link from the email.',
    };
  }

  // Service-role for the token lookup + binding (bypasses RLS).
  const svc = createServiceClient();

  const { data: claim, error: lookupErr } = await svc
    .from('business_claim_requests')
    .select('id, business_id, email, expires_at, consumed_at, business:businesses!inner(slug, name)')
    .eq('token', token)
    .maybeSingle();

  if (lookupErr || !claim) {
    return { ok: false, error: 'This claim link is invalid or expired.' };
  }
  if (claim.consumed_at) {
    return { ok: false, error: 'This claim link has already been used.' };
  }
  if (new Date(claim.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'This claim link has expired.' };
  }
  if (
    user.email &&
    claim.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    return {
      ok: false,
      error:
        'You are signed in as a different email than the one this link was issued to. Sign out and sign in with the email the link was sent to.',
    };
  }

  // Bind: create owner row if not already present.
  const { error: bindErr } = await svc
    .from('business_owners')
    .upsert(
      {
        user_id: user.id,
        business_id: claim.business_id,
        role: 'owner',
      },
      { onConflict: 'user_id,business_id' },
    );

  if (bindErr) {
    console.error('[claim/verify] bind error:', bindErr);
    return { ok: false, error: 'Could not link your account. Try again.' };
  }

  // Consume the token.
  await svc
    .from('business_claim_requests')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', claim.id);

  // Supabase types the FK join as either a single object or an array
  // depending on schema introspection — normalize.
  const b = Array.isArray(claim.business) ? claim.business[0] : claim.business;
  return {
    ok: true,
    businessSlug: b?.slug ?? '',
    businessName: b?.name ?? 'your business',
  };
}
