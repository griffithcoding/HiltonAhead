import { redirect } from 'next/navigation';
import { getBusinessOwner } from '@/utils/supabase/businessOwner';

export const dynamic = 'force-dynamic';

/**
 * Gate for the business owner portal at `/business`.
 *
 * Mirror of app/admin/(gated)/layout.tsx — server-side check on every
 * request. Anyone signed in but with no linked businesses is redirected
 * to /business/login (with a notice) rather than a generic 403, so they
 * can apply or claim from the same surface.
 *
 * IMPORTANT: this only guards navigation. Server actions under /business
 * must call requireBusinessOwner() themselves AND verify the target
 * business_id is in the returned list.
 */
export default async function BusinessGatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getBusinessOwner();
  if (!result) redirect('/business/login');
  if (result.businesses.length === 0)
    redirect('/business/login?notice=no-listing');

  return <>{children}</>;
}
