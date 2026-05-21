/**
 * /admin/sales-prospects/campaigns/[slug] — per-campaign detail (stub).
 *
 * Placeholder. The campaign drill-down (touch timeline, sequence cursor,
 * pipeline funnel, per-prospect tray) is planned but not built yet.
 * Render a friendly "Coming soon" with a back-link.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function CampaignDetailStub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    redirect('/admin/login');
  }
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/admin/sales-prospects"
        className="text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
      >
        ← Back to sales prospects
      </Link>

      <header className="mt-6">
        <div className="eyebrow eyebrow-coral">Campaign</div>
        <h1 className="display mt-2 text-[32px] leading-[1.1] text-ink md:text-[40px]">
          <span className="font-mono text-[18px] text-ink-soft">{slug}</span>
        </h1>
      </header>

      <div className="mt-10 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-10 text-center">
        <div className="eyebrow eyebrow-ocean mb-3">Coming soon</div>
        <p className="text-[14px] leading-[1.65] text-ink-soft">
          The per-campaign detail view — touch timeline, sequence cursor,
          pipeline funnel, and the prospect tray — is on the roadmap. For now,
          use the main{' '}
          <Link
            href="/admin/sales-prospects"
            className="text-ocean-deep hover:text-coral"
          >
            sales prospects
          </Link>{' '}
          dashboard for the aggregate view.
        </p>
      </div>
    </div>
  );
}
