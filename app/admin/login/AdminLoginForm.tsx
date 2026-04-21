'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function signInWithGoogle() {
    setErr(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        // Phase 3 — Gmail read + send. Requested on every sign-in; Google
        // only shows the incremental consent screen if the user hasn't
        // already granted these scopes. prompt=consent forces a fresh
        // refresh_token on each sign-in (Supabase passes it via
        // provider_refresh_token on the initial session).
        scopes: [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.send',
        ].join(' '),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      setErr(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="group inline-flex items-center justify-center gap-3 rounded-full border border-ink bg-ink px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand transition hover:bg-sunset hover:border-sunset disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M21.8 10.23h-9.61v3.95h5.51c-.24 1.26-.96 2.33-2.05 3.05l3.31 2.57c1.93-1.78 3.04-4.39 3.04-7.52 0-.71-.06-1.39-.2-2.05z"
          />
          <path
            fill="#FF3D00"
            d="M12.19 22c2.75 0 5.06-.91 6.75-2.45l-3.31-2.57c-.92.61-2.08.97-3.44.97-2.65 0-4.89-1.79-5.69-4.19l-3.41 2.63C4.67 19.75 8.13 22 12.19 22z"
          />
          <path
            fill="#4CAF50"
            d="M6.5 13.76c-.2-.6-.31-1.24-.31-1.76s.11-1.16.31-1.76L3.09 7.61C2.4 8.94 2 10.42 2 12s.4 3.06 1.09 4.39l3.41-2.63z"
          />
          <path
            fill="#1976D2"
            d="M12.19 5.81c1.5 0 2.85.52 3.91 1.53l2.92-2.92C17.25 2.76 14.94 2 12.19 2 8.13 2 4.67 4.25 3.09 7.61l3.41 2.63c.8-2.4 3.04-4.43 5.69-4.43z"
          />
        </svg>
        {loading ? 'Redirecting…' : 'Sign in with Google'}
      </button>

      {err && (
        <div className="text-[12px] text-coral-deep">{err}</div>
      )}

      <p className="mt-2 text-[11px] leading-[1.5] text-ink-soft">
        Google OAuth · whitelist-only. You&apos;ll stay signed in for ~7
        days. Sign out anytime from the admin sidebar.
      </p>
    </div>
  );
}
