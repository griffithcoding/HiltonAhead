'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminSignOut() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Full reload so the server components re-read session state.
    window.location.href = '/';
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral disabled:opacity-60"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
