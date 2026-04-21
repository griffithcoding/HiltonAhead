import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

type StatusCount = Record<string, number>;

function countByStatus(rows: Array<{ status?: string | null }>): StatusCount {
  const out: StatusCount = {};
  for (const r of rows) {
    const k = (r.status || 'unknown').toLowerCase();
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

function timeSince(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = ms / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(ms / 60_000))}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [itinerariesRes, newslettersRes, leadsRes, activityRes] =
    await Promise.all([
      supabase
        .from('itinerary_requests')
        .select('id, email, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('newsletter_subscribers')
        .select('id, email, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('leads')
        .select('id, email, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('lead_activity')
        .select('id, lead_table, lead_id, kind, body, actor_email, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  const itineraries = itinerariesRes.data ?? [];
  const newsletters = newslettersRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const activity = activityRes.data ?? [];

  const itStatus = countByStatus(itineraries);
  const leadStatus = countByStatus(leads);

  const now = Date.now();
  const last7 = (iso: string) => now - new Date(iso).getTime() < 7 * 86_400_000;
  const itLast7 = itineraries.filter((r) => last7(r.created_at)).length;
  const nlLast7 = newsletters.filter((r) => last7(r.created_at)).length;
  const leadsLast7 = leads.filter((r) => last7(r.created_at)).length;

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">Overview</div>
          <h1 className="display mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[52px]">
            The{' '}
            <span className="display-italic text-coral">dispatch desk.</span>
          </h1>
        </div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
          Last 7 days
        </div>
      </div>

      {/* ——— Top stats ——— */}
      <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Itinerary reqs" total={itineraries.length} delta7={itLast7} />
        <Stat label="Newsletter subs" total={newsletters.length} delta7={nlLast7} />
        <Stat label="Other leads" total={leads.length} delta7={leadsLast7} />
        <Stat
          label="Open pipeline"
          total={(itStatus['new'] || 0) + (itStatus['contacted'] || 0) + (itStatus['quoted'] || 0)}
          sub="itinerary req."
        />
      </section>

      {/* ——— Funnels ——— */}
      <section className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
        <Funnel title="Itinerary funnel" counts={itStatus} />
        <Funnel title="General leads" counts={leadStatus} />
      </section>

      {/* ——— Recent activity ——— */}
      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="display text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Recent{' '}
            <span className="display-italic text-coral">activity.</span>
          </h2>
          <Link
            href="/admin/leads"
            className="text-[11px] uppercase tracking-[0.22em] text-ink-soft hover:text-coral"
          >
            All leads →
          </Link>
        </div>
        {activity.length === 0 ? (
          <div className="mt-6 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
            No activity yet. Status changes and notes will appear here.
          </div>
        ) : (
          <ol className="mt-6 divide-y divide-ocean-deep/10 border-y border-ocean-deep/10">
            {activity.map((a) => (
              <li key={a.id} className="grid grid-cols-[110px_100px_1fr_auto] gap-4 py-4 text-[13px]">
                <span className="text-ink-soft">{timeSince(a.created_at)}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
                  {a.kind}
                </span>
                <span className="truncate text-ink">{a.body}</span>
                <Link
                  href={`/admin/leads/${a.lead_table.replace('_requests', '').replace('newsletter_subscribers', 'newsletter').replace('leads', 'lead')}/${a.lead_id}`}
                  className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                >
                  View →
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  total,
  delta7,
  sub,
}: {
  label: string;
  total: number;
  delta7?: number;
  sub?: string;
}) {
  return (
    <div className="rounded-sm border border-ocean-deep/10 bg-sand-soft p-5">
      <div className="eyebrow text-ink-soft">{label}</div>
      <div className="display mt-2 text-[38px] leading-none tracking-[-0.02em] text-ink">
        {total.toLocaleString()}
      </div>
      {delta7 !== undefined && (
        <div className="mt-2 text-[12px] text-coral">+{delta7} in 7d</div>
      )}
      {sub && (
        <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
          {sub}
        </div>
      )}
    </div>
  );
}

function Funnel({ title, counts }: { title: string; counts: StatusCount }) {
  const order = ['new', 'contacted', 'qualified', 'quoted', 'booked', 'converted', 'archived', 'lost'];
  const rows = order.filter((k) => counts[k]).map((k) => [k, counts[k]] as const);
  const max = Math.max(1, ...rows.map(([, n]) => n));

  return (
    <div>
      <h3 className="display text-[22px] leading-[1.1] text-ink md:text-[26px]">
        {title}
      </h3>
      {rows.length === 0 ? (
        <div className="mt-4 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-6 text-center text-[13px] text-ink-soft">
          No leads in this funnel yet.
        </div>
      ) : (
        <ol className="mt-4 flex flex-col gap-2">
          {rows.map(([status, n]) => (
            <li key={status} className="grid grid-cols-[100px_1fr_40px] items-center gap-3 text-[13px]">
              <span className="capitalize text-ink-soft">{status}</span>
              <div className="relative h-5 overflow-hidden rounded-sm bg-sand-deep/30">
                <div
                  className="h-full bg-coral/80"
                  style={{ width: `${(n / max) * 100}%` }}
                />
              </div>
              <span className="text-right font-mono text-[12px] text-ink">{n}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
