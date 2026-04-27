import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

type LeadType = 'itinerary' | 'newsletter' | 'lead';

type UnifiedLead = {
  id: string;
  type: LeadType;
  email: string;
  name: string | null;
  phone: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
  trip: string | null;
  lodging: string | null;
  dealValue: number | null;
  nextActionAt: string | null;
  summary: string | null;
};

// ============================================================================
// Stage-aging thresholds (hours) — how long is "too long" for each status
// before the row turns yellow / red. Solo-operator triage tuning.
// ============================================================================
const STAGE_AGE_HOURS: Record<string, { warn: number; alert: number }> = {
  new: { warn: 12, alert: 24 },
  contacted: { warn: 48, alert: 72 },
  qualified: { warn: 72, alert: 120 },
  quoted: { warn: 120, alert: 168 },
};

function fmtShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
}

function fmtRelative(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const mins = ms / 60_000;
  if (mins < 60) return `${Math.max(1, Math.round(mins))}m`;
  const hrs = mins / 60;
  if (hrs < 48) return `${Math.round(hrs)}h`;
  return `${Math.round(hrs / 24)}d`;
}

function fmtMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function endOfTodayMs(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function fmtTrip(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  const fmt = (s: string) => {
    const d = new Date(s);
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
  };
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  return fmt((start || end)!);
}

function stageAgeTone(
  status: string | null,
  updatedAt: string | null,
): 'fresh' | 'warn' | 'alert' {
  if (!status || !updatedAt) return 'fresh';
  const t = STAGE_AGE_HOURS[status.toLowerCase()];
  if (!t) return 'fresh';
  const hrs = (Date.now() - new Date(updatedAt).getTime()) / 3_600_000;
  if (hrs >= t.alert) return 'alert';
  if (hrs >= t.warn) return 'warn';
  return 'fresh';
}

// ============================================================================
export default async function AdminLeadsList({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
    due?: string;
  }>;
}) {
  const { q, type, status, due } = await searchParams;
  const supabase = await createClient();

  const [itRes, nlRes, lRes] = await Promise.all([
    supabase
      .from('itinerary_requests')
      .select(
        'id, email, full_name, phone, status, party_size, start_date, end_date, lodging, budget, deal_value, next_action_at, created_at, updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
    supabase
      .from('newsletter_subscribers')
      .select('id, email, full_name, source, created_at')
      .order('created_at', { ascending: false })
      .limit(300),
    supabase
      .from('leads')
      .select(
        'id, email, full_name, phone, status, source, message, deal_value, next_action_at, created_at, updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(300),
  ]);

  const combined: UnifiedLead[] = [
    ...(itRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'itinerary',
        email: r.email,
        name: r.full_name,
        phone: r.phone,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        trip: fmtTrip(r.start_date, r.end_date),
        lodging: r.lodging,
        dealValue: r.deal_value,
        nextActionAt: r.next_action_at,
        summary:
          [
            r.party_size ? `Party of ${r.party_size}` : null,
            r.budget,
          ]
            .filter(Boolean)
            .join(' · ') || null,
      }),
    ),
    ...(nlRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'newsletter',
        email: r.email,
        name: r.full_name,
        phone: null,
        status: null,
        created_at: r.created_at,
        updated_at: null,
        trip: null,
        lodging: null,
        dealValue: null,
        nextActionAt: null,
        summary: r.source ? `via ${r.source}` : null,
      }),
    ),
    ...(lRes.data ?? []).map(
      (r): UnifiedLead => ({
        id: r.id,
        type: 'lead',
        email: r.email,
        name: r.full_name,
        phone: r.phone,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        trip: null,
        lodging: null,
        dealValue: r.deal_value,
        nextActionAt: r.next_action_at,
        summary: r.message?.slice(0, 80) || (r.source ? `via ${r.source}` : null),
      }),
    ),
  ];

  const todayStart = startOfTodayMs();
  const todayEnd = endOfTodayMs();
  const weekEnd = todayEnd + 6 * 86_400_000;

  // Filters (client-side over the fetched 900 max rows — fine for this volume).
  const filtered = combined
    .filter((r) => (type ? r.type === type : true))
    .filter((r) => (status ? (r.status || '').toLowerCase() === status.toLowerCase() : true))
    .filter((r) => {
      if (!due) return true;
      if (!r.nextActionAt) return false;
      const t = new Date(r.nextActionAt).getTime();
      if (due === 'overdue') return t < todayStart;
      if (due === 'today') return t >= todayStart && t <= todayEnd;
      if (due === 'week') return t <= weekEnd;
      if (due === 'unscheduled') return false; // handled separately
      return true;
    })
    .filter((r) => {
      if (due !== 'unscheduled') return true;
      // Only meaningful for status-bearing leads
      if (r.type === 'newsletter') return false;
      const open = ['new', 'contacted', 'qualified', 'quoted'];
      return open.includes((r.status || '').toLowerCase()) && !r.nextActionAt;
    })
    .filter((r) => {
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        r.email.toLowerCase().includes(needle) ||
        (r.name || '').toLowerCase().includes(needle) ||
        (r.phone || '').toLowerCase().includes(needle) ||
        (r.lodging || '').toLowerCase().includes(needle) ||
        (r.summary || '').toLowerCase().includes(needle)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  // Counts for the due-filter chips
  const dueCounts = countDue(combined, todayStart, todayEnd);

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">All contacts</div>
          <h1 className="display mt-3 text-[38px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
            Leads{' '}
            <span className="display-italic text-coral">
              ({filtered.length.toLocaleString()})
            </span>
          </h1>
        </div>
      </div>

      {/* ——— Due-now chips (one-click triage) ——— */}
      <div className="mt-8 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
        <DueChip label="All" count={null} active={!due} href={hrefWith({ q, type, status, due: undefined })} />
        <DueChip
          label="Overdue"
          tone="alert"
          count={dueCounts.overdue}
          active={due === 'overdue'}
          href={hrefWith({ q, type, status, due: 'overdue' })}
        />
        <DueChip
          label="Due today"
          tone="warn"
          count={dueCounts.today}
          active={due === 'today'}
          href={hrefWith({ q, type, status, due: 'today' })}
        />
        <DueChip
          label="Next 7 days"
          count={dueCounts.week}
          active={due === 'week'}
          href={hrefWith({ q, type, status, due: 'week' })}
        />
        <DueChip
          label="Unscheduled (open)"
          tone="warn"
          count={dueCounts.unscheduled}
          active={due === 'unscheduled'}
          href={hrefWith({ q, type, status, due: 'unscheduled' })}
        />
      </div>

      {/* ——— Filters ——— */}
      <form className="mt-5 flex flex-wrap gap-3 text-[13px]">
        {/* Preserve due filter when submitting search/type/status */}
        {due && <input type="hidden" name="due" value={due} />}
        <input
          type="search"
          name="q"
          defaultValue={q || ''}
          placeholder="Search email, name, phone, lodging…"
          className="w-full max-w-[380px] border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
        />
        <select
          name="type"
          defaultValue={type || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">All types</option>
          <option value="itinerary">Itinerary</option>
          <option value="newsletter">Newsletter</option>
          <option value="lead">Contact form</option>
        </select>
        <select
          name="status"
          defaultValue={status || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">Any status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="quoted">Quoted</option>
          <option value="booked">Booked</option>
          <option value="converted">Converted</option>
          <option value="archived">Archived</option>
          <option value="lost">Lost</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-ink bg-ink px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral hover:border-coral"
        >
          Apply
        </button>
      </form>

      {/* ——— Table ——— */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-12 text-center text-[14px] text-ink-soft">
          No leads match these filters yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
          <table className="w-full min-w-[1100px] border-collapse text-[13px]">
            <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              <tr>
                <th className="px-3 py-3 font-semibold">In</th>
                <th className="px-3 py-3 font-semibold">Contact</th>
                <th className="px-3 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Trip / Lodging</th>
                <th className="px-3 py-3 font-semibold">Detail</th>
                <th className="px-3 py-3 font-semibold text-right">Deal</th>
                <th className="px-3 py-3 font-semibold">Next ▶</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
              {filtered.map((r) => {
                const tone = stageAgeTone(r.status, r.updated_at);
                return (
                  <tr key={`${r.type}-${r.id}`}>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                      <div>{fmtShortDate(r.created_at)}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
                        {fmtRelative(r.created_at)} ago
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/leads/${r.type}/${r.id}`}
                        className="block"
                      >
                        <div className="font-semibold text-ink hover:text-coral">
                          {r.name || '—'}
                        </div>
                        <div className="mt-0.5 text-[11px] text-ink-soft">
                          {r.email}
                        </div>
                      </Link>
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          className="mt-0.5 block text-[11px] font-mono text-ocean-deep hover:text-coral"
                        >
                          {r.phone}
                        </a>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                      {r.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {r.status ? (
                        <div className="flex flex-col gap-1">
                          <StatusPill status={r.status} />
                          {tone !== 'fresh' && (
                            <StageAgePill tone={tone} updatedAt={r.updated_at} />
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-ink-soft/60">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[12px] text-ink-soft">
                      {r.trip && (
                        <div className="font-medium text-ink">{r.trip}</div>
                      )}
                      {r.lodging && (
                        <div className="mt-0.5 max-w-[180px] truncate">
                          {r.lodging}
                        </div>
                      )}
                      {!r.trip && !r.lodging && (
                        <span className="text-ink-soft/60">—</span>
                      )}
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-3 text-ink-soft">
                      {r.summary || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-[12px] text-ink">
                      {r.dealValue ? fmtMoney(Number(r.dealValue)) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <NextActionCell iso={r.nextActionAt} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function hrefWith(params: {
  q?: string;
  type?: string;
  status?: string;
  due?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.type) sp.set('type', params.type);
  if (params.status) sp.set('status', params.status);
  if (params.due) sp.set('due', params.due);
  const qs = sp.toString();
  return qs ? `/admin/leads?${qs}` : '/admin/leads';
}

function countDue(
  rows: UnifiedLead[],
  todayStart: number,
  todayEnd: number,
): { overdue: number; today: number; week: number; unscheduled: number } {
  const weekEnd = todayEnd + 6 * 86_400_000;
  let overdue = 0;
  let today = 0;
  let week = 0;
  let unscheduled = 0;
  const open = new Set(['new', 'contacted', 'qualified', 'quoted']);
  for (const r of rows) {
    if (r.nextActionAt) {
      const t = new Date(r.nextActionAt).getTime();
      if (t < todayStart) overdue++;
      else if (t <= todayEnd) today++;
      if (t <= weekEnd) week++;
    } else if (
      r.type !== 'newsletter' &&
      open.has((r.status || '').toLowerCase())
    ) {
      unscheduled++;
    }
  }
  return { overdue, today, week, unscheduled };
}

function DueChip({
  label,
  count,
  active,
  href,
  tone,
}: {
  label: string;
  count: number | null;
  active: boolean;
  href: string;
  tone?: 'warn' | 'alert';
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition';
  const palette = active
    ? 'border-ink bg-ink text-sand'
    : tone === 'alert'
      ? 'border-coral/50 bg-coral/10 text-coral-deep hover:border-coral'
      : tone === 'warn'
        ? 'border-gold/50 bg-gold/10 text-gold-deep hover:border-gold'
        : 'border-ocean-deep/20 bg-sand-soft text-ink-soft hover:border-ink hover:text-ink';
  return (
    <Link href={href} className={`${base} ${palette}`}>
      <span>{label}</span>
      {count !== null && (
        <span className="font-mono text-[10px]">{count}</span>
      )}
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s === 'new'
      ? 'bg-coral/15 text-coral-deep'
      : s === 'contacted'
        ? 'bg-ocean/15 text-ocean-deep'
        : s === 'qualified' || s === 'quoted'
          ? 'bg-gold/15 text-gold-deep'
          : s === 'booked' || s === 'converted'
            ? 'bg-palm/15 text-palm'
            : 'bg-ocean-deep/10 text-ink-soft';
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {s}
    </span>
  );
}

function StageAgePill({
  tone,
  updatedAt,
}: {
  tone: 'warn' | 'alert';
  updatedAt: string | null;
}) {
  const palette =
    tone === 'alert'
      ? 'bg-coral text-sand'
      : 'bg-gold/80 text-ink';
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em] ${palette}`}
      title={`In stage for ${fmtRelative(updatedAt)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {fmtRelative(updatedAt)} idle
    </span>
  );
}

function NextActionCell({ iso }: { iso: string | null }) {
  if (!iso) return <span className="text-ink-soft/60">—</span>;
  const t = new Date(iso).getTime();
  const todayStart = startOfTodayMs();
  const todayEnd = endOfTodayMs();
  const isOverdue = t < todayStart;
  const isToday = t >= todayStart && t <= todayEnd;
  const tone = isOverdue
    ? 'text-coral-deep font-semibold'
    : isToday
      ? 'text-gold-deep font-semibold'
      : 'text-ink';
  const label = isOverdue
    ? `Overdue · ${fmtShortDate(iso)}`
    : isToday
      ? 'Today'
      : fmtShortDate(iso);
  return <span className={`text-[12px] ${tone}`}>{label}</span>;
}
