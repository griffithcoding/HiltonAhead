import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/utils/supabase/admin';
import AdminSignOut from './AdminSignOut';
import PlanSidebar from '@/components/admin/PlanSidebar';

export const metadata: Metadata = {
  title: 'Admin — HiltonAhead',
  robots: { index: false, follow: false },
};

// Force dynamic — this layout reads auth cookies on every request.
export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/outreach', label: 'Backlink Outreach' },
];

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getAdminUser();
  if (!result) {
    redirect('/admin/login');
  }
  const { admin } = result;

  return (
    <div className="min-h-screen bg-sand text-ink">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:max-w-[1700px] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* ——— Sidebar ——— */}
        <aside className="border-r border-ocean-deep/10 bg-sand-soft p-6 md:min-h-screen">
          <Link
            href="/"
            className="block"
          >
            <div className="display text-[22px] leading-none tracking-[-0.02em] text-ink">
              Hilton Ahead
            </div>
            <div className="eyebrow eyebrow-coral mt-1">Internal CRM</div>
          </Link>

          <nav className="mt-10 flex flex-col gap-1 text-[13px]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-ink/80 transition hover:bg-sand-deep/40 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="rounded-sm border border-ocean-deep/10 bg-sand p-3 text-[12px]">
              <div className="font-semibold text-ink">
                {admin.display_name || 'Admin'}
              </div>
              <div className="mt-0.5 truncate text-ink-soft">
                {admin.email}
              </div>
              <div className="mt-3">
                <AdminSignOut />
              </div>
            </div>
            <Link
              href="/"
              className="mt-4 block text-[11px] uppercase tracking-[0.22em] text-ink-soft hover:text-coral"
            >
              ← Back to site
            </Link>
          </div>
        </aside>

        {/* ——— Main ——— */}
        <main className="p-8 md:p-12">{children}</main>

        {/* ——— Right: plan view (lg+ only) ——— */}
        <div className="hidden lg:block">
          <PlanSidebar />
        </div>
      </div>
    </div>
  );
}
