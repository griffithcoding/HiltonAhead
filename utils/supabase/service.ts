import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client.
 *
 * Bypasses RLS. Use ONLY in trusted server contexts (cron route handlers,
 * server actions that have already verified an admin or a Bearer secret).
 *
 * Never import this module from a client component, a public route handler,
 * or any code that runs on a request that hasn't been authenticated.
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL       (public — already configured)
 *   SUPABASE_SERVICE_ROLE_KEY      (server-only — add in Vercel)
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Service-role Supabase client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
