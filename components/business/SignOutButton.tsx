'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * Sign-out button for the business portal. Clears the Supabase session
 * client-side and pushes the visitor to /business/login.
 */
export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/business/login?notice=signed-out');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition hover:border-ink hover:bg-ink hover:text-cream disabled:opacity-50"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
