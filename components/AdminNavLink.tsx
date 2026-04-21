'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Conditionally renders an "Admin" nav item if the current visitor is
 * signed in AND their email is in the admin_users table.
 *
 * Client-side by design — keeps the public pages SSG/cacheable.
 * The link itself is gated by server-side checks in /admin/(gated)/layout.tsx,
 * so hiding it here is a UX convenience, not a security boundary.
 */
export default function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) return;

      // RLS on admin_users returns 0 rows when the caller isn't an admin.
      const { data } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email.toLowerCase())
        .maybeSingle();

      if (mounted) setIsAdmin(!!data);
    }

    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="link-underline text-coral hover:text-coral-deep"
    >
      Admin
    </Link>
  );
}
