import { createClient } from './server';
import type { User } from '@supabase/supabase-js';

export interface OwnedBusiness {
  business_id: string;
  business_slug: string;
  business_name: string;
  role: 'owner' | 'manager';
}

/**
 * Return the current user + every business they own/manage, or null if
 * the caller is not signed in or owns nothing.
 *
 * Mirrors the admin pattern (utils/supabase/admin.ts) — relies on RLS
 * on business_owners + businesses to scope the query, so a successful
 * result is the auth signal.
 */
export async function getBusinessOwner(): Promise<
  | { user: User; businesses: OwnedBusiness[] }
  | null
> {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch (err) {
    // Env vars missing (typically local dev without .env.local). Return
    // null so login/portal pages render the unauth state rather than a 500.
    console.warn(
      '[businessOwner] Supabase client unavailable; treating as unauthenticated.',
      err instanceof Error ? err.message : err,
    );
    return null;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS: business_owners returns only this user's rows; businesses
  // returns rows where the user is in the owner set.
  const { data, error } = await supabase
    .from('business_owners')
    .select('role, business:businesses!inner(id, slug, name)')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[businessOwner] fetch error:', error);
    return { user, businesses: [] };
  }

  const businesses: OwnedBusiness[] = (data ?? [])
    .map((row) => {
      // Supabase joins return a single object when FK is single-valued, but
      // the generated types occasionally type it as an array — normalize.
      const b = Array.isArray(row.business) ? row.business[0] : row.business;
      if (!b) return null;
      return {
        business_id: b.id,
        business_slug: b.slug,
        business_name: b.name,
        role: row.role as 'owner' | 'manager',
      };
    })
    .filter((b): b is OwnedBusiness => b !== null);

  return { user, businesses };
}

/**
 * Gate for `/business` server actions. Returns the authenticated owner +
 * their businesses, or `{ ok: false, error }`.
 *
 * Every server action that mutates a business MUST call this first AND
 * verify the target business_id is in the returned `businesses` list —
 * the (gated) route group only guards navigation, not direct POSTs.
 */
export async function requireBusinessOwner(): Promise<
  | { ok: true; user: User; businesses: OwnedBusiness[] }
  | { ok: false; error: string }
> {
  const result = await getBusinessOwner();
  if (!result) return { ok: false, error: 'Unauthorized.' };
  if (result.businesses.length === 0)
    return {
      ok: false,
      error:
        'No businesses linked to this account. Apply or claim a listing first.',
    };
  return { ok: true, ...result };
}

/**
 * Convenience: assert the signed-in user owns/manages the given
 * business_id. Returns `true` only if the user has an owner row for it.
 */
export async function isOwnerOfBusiness(
  businessId: string,
): Promise<boolean> {
  const result = await getBusinessOwner();
  if (!result) return false;
  return result.businesses.some((b) => b.business_id === businessId);
}
