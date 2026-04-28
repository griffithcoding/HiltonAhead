import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * OAuth callback handler.
 *
 * Supabase's signInWithOAuth() redirects the browser here with a `code`
 * query param after Google consents. We:
 *   1. Exchange the code for a Supabase session.
 *   2. Persist Google's refresh_token into gmail_tokens so we can call
 *      the Gmail API server-side (reads + sends) as this admin later.
 *   3. Forward to `next` (default /admin).
 *
 * Supabase only surfaces provider_refresh_token on the first sign-in
 * after consent. We pass prompt=consent on every sign-in (see
 * AdminLoginForm), which forces a fresh token each time.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/admin';

  if (!code) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=missing_code`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    console.error('[auth/callback] exchange error:', error);
    return NextResponse.redirect(
      `${origin}/admin/login?error=oauth_failed`,
    );
  }

  // Persist Gmail API tokens if Google returned them on this session.
  const session = data.session;
  const email = data.user?.email;
  const refreshToken = session.provider_refresh_token;
  const accessToken = session.provider_token;

  if (email && refreshToken) {
    const { error: upsertError } = await supabase
      .from('gmail_tokens')
      .upsert(
        {
          email: email.toLowerCase(),
          refresh_token: refreshToken,
          access_token: accessToken ?? null,
          // Supabase doesn't surface expires_in; assume Google's 1h default.
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          scope:
            'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.readonly',
        },
        { onConflict: 'email' },
      );

    if (upsertError) {
      console.error(
        '[auth/callback] gmail_tokens upsert error:',
        upsertError,
      );
      // Don't fail the sign-in — admin can still use the CRM without Gmail.
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
