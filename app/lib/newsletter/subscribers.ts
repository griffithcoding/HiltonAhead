/**
 * Subscriber queries used by the newsletter pipeline.
 *
 * Service-role only. Never call from a public route handler — the
 * service-role key bypasses RLS, which means it can read every row.
 */

import { createServiceClient } from '@/utils/supabase/service';

export interface ActiveSubscriber {
  id: string;
  email: string;
  unsubscribe_token: string;
}

/**
 * All non-unsubscribed subscribers, ordered for determinism.
 *
 * In v2, filter by `confirmed = true` once double opt-in lands. For now
 * single opt-in is acceptable: we only mail people who explicitly
 * submitted the signup form on hiltonahead.com.
 */
export async function listActiveSubscribers(): Promise<ActiveSubscriber[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, unsubscribe_token')
    .eq('unsubscribed', false)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load subscribers: ${error.message}`);
  }

  return (data ?? []) as ActiveSubscriber[];
}

/** Mark a subscriber unsubscribed by their token. Returns true if a row matched. */
export async function unsubscribeByToken(token: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('unsubscribe_token', token)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`Unsubscribe failed: ${error.message}`);
  }

  return !!data;
}
