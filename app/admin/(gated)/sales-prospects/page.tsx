/**
 * /admin/sales-prospects — sales pipeline dashboard.
 *
 * Server component, no client-side data fetching. Two sections:
 *   1. Campaign performance — one row per sales_campaigns row, joined to the
 *      sales_campaign_stats view (prospects_total / contacted / engaged /
 *      qualified / converted / booked / unsubscribed).
 *   2. Recent prospects — the latest 50 rows from sales_prospects.
 *
 * Layout note: this page is gated by app/admin/(gated)/layout.tsx but we
 * additionally call requireAdmin() here as a belt-and-braces check that
 * matches the rule in CLAUDE.md ("every exported server action MUST start
 * with requireAdmin()") — same hygiene applies to admin-only reads of
 * sensitive tables.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

interface CampaignStatRow {
  id: string;
  slug: string;
  name: string;
  feeder_city: string | null;
  segment: string;
  primary_channel: string;
  is_active: boolean;
  prospects_total: number;
  prospects_contacted: number;
  prospects_engaged: number;
  prospects_qualified: number;
  prospects_converted: number;
  prospects_booked: number;
  prospects_unsubscribed: number;
  prospects_bounced: number;
}

interface ProspectRow {
  id: string;
  email: string | null;
  full_name: string | null;
  segment: string;
  feeder_city: string | null;
  status: string;
  source_channel: string | null;
  created_at: string;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s === 'new' || s === 'queued'
      ? 'bg-coral/15 text-coral-deep'
      : s === 'contacted'
        ? 'bg-ocean/20 text-ocean-deep'
        : s === 'engaged' || s === 'qualified'
          ? 'bg-gold/20 text-gold-deep'
          : s === 'converted' || s === 'booked'
            ? 'bg-palm/15 text-palm'
            : s === 'unsubscribed' || s === 'bounced' || s === 'archived'
              ? 'bg-ocean-deep/10 text-ink-soft'
              : 'bg-ocean-deep/10 text-ink-soft';
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {s}
    </span>
  );
}

function ChannelTag({ channel }: { channel: string | null }) {
  if (!channel) return <span className="text-ink-soft/60">—</span>;
  return (
    <span className="inline-flex w-fit rounded-sm border border-ocean-deep/15 bg-sand-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
      {channel}
    </span>
  );
}

export default async function AdminSalesProspectsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    redirect('/admin/login');
  }

  const supabase = await createClient();

  const [statsRes, prospectsRes] = await Promise.all([
    supabase
      .from('sales_campaign_stats')
      .select(
        'id, slug, name, feeder_city, segment, primary_channel, is_active, prospects_total, prospects_contacted, prospects_engaged, prospects_qualified, prospects_converted, prospects_booked, prospects_unsubscribed, prospects_bounced',
      )
      .order('prospects_total', { ascending: false }),
    supabase
      .from('sales_prospects')
      .select(
        'id, email, full_name, segment, feeder_city, status, source_channel, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const queryErrors: Array<{ table: string; error: unknown }> = [];
  if (statsRes.error) queryErrors.push({ table: 'sales_campaign_stats', error: statsRes.error });
  if (prospectsRes.error) queryErrors.push({ table: 'sales_prospects', error: prospectsRes.error });

  if (queryErrors.length > 0) {
    return (
      <div className="mx-auto max-w-[900px] p-8 font-mono text-[13px]">
        <div className="mb-4 text-[16px] font-semibold text-coral-deep">
          Supabase query errors
        </div>
        <div className="mb-4 text-ink-soft">
          The sales-prospects page hit one or more query errors. Likely the
          018 migration hasn’t been applied to this database yet.
        </div>
        {queryErrors.map((e, i) => (
          <div
            key={i}
            className="mt-4 rounded-sm border border-coral/30 bg-coral/5 p-4"
          >
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-coral-deep">
              {e.table}
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-[12px] text-ink">
              {JSON.stringify(e.error, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  const stats = (statsRes.data ?? []) as CampaignStatRow[];
  const prospects = (prospectsRes.data ?? []) as ProspectRow[];

  // Top-line aggregates across all campaigns.
  const totals = stats.reduce(
    (acc, s) => {
      acc.total += Number(s.prospects_total) || 0;
      acc.contacted += Number(s.prospects_contacted) || 0;
      acc.engaged += Number(s.prospects_engaged) || 0;
      acc.qualified += Number(s.prospects_qualified) || 0;
      acc.converted += Number(s.prospects_converted) || 0;
      acc.booked += Number(s.prospects_booked) || 0;
      return acc;
    },
    { total: 0, contacted: 0, engaged: 0, qualified: 0, converted: 0, booked: 0 },
  );

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow eyebrow-coral">Cold outbound CRM</div>
          <h1 className="display mt-2 text-[34px] leading-[1.1] text-ink md:text-[42px]">
            Sales prospects
          </h1>
          <p className="mt-3 max-w-[680px] text-[14px] leading-[1.65] text-ink-soft">
            Feeder-city campaigns, multi-channel touches, and the path from
            enriched contact → booked trip. Distinct from{' '}
            <Link href="/admin/leads" className="text-ocean-deep hover:text-coral">
              inbound leads
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/sales-prospects/import"
          className="mt-2 inline-flex items-center gap-2 rounded-sm bg-coral px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-coral-deep"
        >
          Import prospects →
        </Link>
      </header>

      {/* ─── KPI strip ────────────────────────────────────────────────────── */}
      <section className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: 'Prospects', value: totals.total },
          { label: 'Contacted', value: totals.contacted },
          { label: 'Engaged', value: totals.engaged },
          { label: 'Qualified', value: totals.qualified },
          { label: 'Converted', value: totals.converted },
          { label: 'Booked', value: totals.booked },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-sm border border-ocean-deep/15 bg-sand-soft p-4"
          >
            <div className="display text-[24px] leading-none text-ink">
              {k.value.toLocaleString()}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              {k.label}
            </div>
          </div>
        ))}
      </section>

      {/* ─── Campaign performance ────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="display text-[22px] leading-[1.1] text-ink">
            Campaign performance
          </h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {stats.length} campaign{stats.length === 1 ? '' : 's'}
          </span>
        </div>

        {stats.length === 0 ? (
          <div className="rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-10 text-center text-[14px] text-ink-soft">
            No campaigns yet. Insert rows into{' '}
            <code className="font-mono text-[12px]">sales_campaigns</code> to
            begin tracking outbound performance.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
            <table className="w-full min-w-[1100px] border-collapse text-[13px]">
              <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                <tr>
                  <th className="px-3 py-3 font-semibold">Campaign</th>
                  <th className="px-3 py-3 font-semibold">Feeder</th>
                  <th className="px-3 py-3 font-semibold">Segment</th>
                  <th className="px-3 py-3 font-semibold">Channel</th>
                  <th className="px-3 py-3 text-right font-semibold">Prospects</th>
                  <th className="px-3 py-3 text-right font-semibold">Contacted</th>
                  <th className="px-3 py-3 text-right font-semibold">Engaged</th>
                  <th className="px-3 py-3 text-right font-semibold">Qualified</th>
                  <th className="px-3 py-3 text-right font-semibold">Converted</th>
                  <th className="px-3 py-3 text-right font-semibold">Booked</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
                {stats.map((s) => (
                  <tr key={s.id} className={s.is_active ? '' : 'opacity-60'}>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/sales-prospects/campaigns/${s.slug}`}
                        className="block font-semibold text-ink hover:text-coral"
                      >
                        {s.name}
                      </Link>
                      <div className="mt-0.5 font-mono text-[10px] text-ink-soft">
                        {s.slug}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                      {s.feeder_city || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                      {s.segment}
                    </td>
                    <td className="px-3 py-3">
                      <ChannelTag channel={s.primary_channel} />
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-ink">
                      {Number(s.prospects_total || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">
                      {Number(s.prospects_contacted || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">
                      {Number(s.prospects_engaged || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">
                      {Number(s.prospects_qualified || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">
                      {Number(s.prospects_converted || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-palm">
                      {Number(s.prospects_booked || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ─── Recent prospects ────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="display text-[22px] leading-[1.1] text-ink">
            Recent prospects
          </h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            Last {prospects.length}
          </span>
        </div>

        {prospects.length === 0 ? (
          <div className="rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-10 text-center text-[14px] text-ink-soft">
            No prospects yet. Once enrichment ingest or capture forms start
            firing they’ll land here.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
            <table className="w-full min-w-[960px] border-collapse text-[13px]">
              <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                <tr>
                  <th className="px-3 py-3 font-semibold">In</th>
                  <th className="px-3 py-3 font-semibold">Contact</th>
                  <th className="px-3 py-3 font-semibold">Segment</th>
                  <th className="px-3 py-3 font-semibold">Feeder</th>
                  <th className="px-3 py-3 font-semibold">Channel</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
                {prospects.map((p) => (
                  <tr key={p.id}>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                      {fmtDate(p.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-ink">
                        {p.full_name || '—'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-soft">
                        {p.email || (
                          <span className="italic text-ink-soft/60">
                            (no email)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                      {p.segment}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                      {p.feeder_city || '—'}
                    </td>
                    <td className="px-3 py-3">
                      <ChannelTag channel={p.source_channel} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
