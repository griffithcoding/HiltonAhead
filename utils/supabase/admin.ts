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

  const { data } = await supabase
    .from('admin_users')
    .select('email, display_name')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();

  if (!data) return null;
  return { user, admin: data as AdminRecord };
}

/**
 * Cheap pass-through to `createClient()` from server.ts, kept here so
 * callers in /admin don't have to reach into a utils subpath.
 */
export { createClient as createAdminClient };
