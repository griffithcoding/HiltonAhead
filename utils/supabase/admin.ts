import { createClient } from './server';
import type { User } from '@supabase/supabase-js';

export interface AdminRecord {
  email: string;
  display_name: string | null;
}

/**
 * Return the current user + their admin_users row, or null if the
 * caller is not signed in or not an admin.
 *
 * Relies on the RLS policy on admin_users that only exposes rows
 * when is_admin() is true, so a successful query == confirmed admin.
 */
export async function getAdminUser(): Promise<{ user: User; admin: AdminRecord } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  // Case-insensitive match: admin_users.email may be stored mixed-case.
  const { data } = await supabase
    .from('admin_users')
    .select('email, display_name')
    .ilike('email', user.email)
    .maybeSingle();

  if (!data) return null;
  return { user, admin: data as AdminRecord };
}

/**
 * Gate for server actions. Returns the authenticated admin's user + record,
 * or an { ok: false, error } the caller can return to the client.
 *
 * Every exported server action under /admin must call this first — the
 * (gated) route group only guards navigation, not direct POSTs to
 * server-action endpoints.
 */
export async function requireAdmin(): Promise<
  | { ok: true; user: User; admin: AdminRecord }
  | { ok: false; error: string }
> {
  const result = await getAdminUser();
  if (!result) return { ok: false, error: 'Unauthorized.' };
  return { ok: true, ...result };
}

/**
 * Cheap pass-through to `createClient()` from server.ts, kept here so
 * callers in /admin don't have to reach into a utils subpath.
 */
export { createClient as createAdminClient };
