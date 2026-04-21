import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * OAuth callback handler.
 *
 * Supabase's signInWithOAuth() redirects the browser here with a `code`
 * query param after the provider (Google) consents. We exchange the
 * code for a session cookie, then forward to `next` (default /admin).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/admin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] exchange error:', error);
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=oauth_failed`,
  );
}
