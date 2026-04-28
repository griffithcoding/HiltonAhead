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

function fmtDurationHours(hrs: number): string {
  if (!Number.isFinite(hrs)) return '—';
  if (hrs < 1) return `${Math.max(1, Math.round(hrs * 60))}m`;
  if (hrs < 48) return `${hrs.toFixed(1)}h`;
  return `${(hrs / 24).toFixed(1)}d`;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = Math.floor((sorted.length - 1) * p);
  return sorted[idx];
}

function fmtMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

// ============================================================================
interface LeadRow {
  id?: string;
  email?: string;
  status?: string | null;
  created_at: string;
  first_contacted_at?: string | null;
  converted_at?: string | null;
  deal_value?: number | null;
  source?: string | null;
  next_action_at?: string | null;
  full_name?: string | null;
  phone?: string | null;
  // Discriminator added at combine-time so we can build /admin/leads/{type}/{id} links.
  _type?: 'itinerary' | 'lead';
}

interface SourceStats {
  source: string;
  count: number;
  contacted: number;
  converted: number;
  revenue: number;
}

function computeSourceStats(rows: LeadRow[]): SourceStats[] {
  const grouped = new Map<string, SourceStats>();
  for (const r of rows) {
    const key = (r.source || 'unknown').toLowerCase();
    const s = grouped.get(key) || {
      source: key,
      count: 0,
      contacted: 0,
      converted: 0,
      revenue: 0,
    };
    s.count++;
    if (r.first_contacted_at) s.contacted++;
    if (r.converted_at) s.converted++;
    if (r.deal_value) s.revenue += Number(r.deal_value);
    grouped.set(key, s);
  }
  return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
}

function computeResponseTime(rows: LeadRow[]): {
  median: number;
  p90: number;
  sampleSize: number;
} {
  const durations: number[] = [];
  for (const r of rows) {
    if (r.first_contacted_at) {
      const hrs =
        (new Date(r.first_contacted_at).getTime() -
          new Date(r.created_at).getTime()) /
        3_600_000;
      if (hrs >= 0 && Number.isFinite(hrs)) durations.push(hrs);
    }
  }
  durations.sort((a, b) => a - b);
  return {
    median: percentile(durations, 0.5),
    p90: percentile(durations, 0.9),
    sampleSize: durations.length,
  };
}

// ============================================================================
export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    itinerariesRes,
    newslettersRes,
    leadsRes,
    activityRes,
    purchasesRes,
    meetingsRes,
  ] = await Promise.all([
    supabase
      .from('itinerary_requests')
      .select(
        'id, email, full_name, phone, status, source, created_at, first_contacted_at, converted_at, deal_value, next_action_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('newsletter_subscribers')
      .select('id, email, source, created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('leads')
      .select(
        'id, email, full_name, phone, status, source, created_at, first_contacted_at, converted_at, deal_value, next_action_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('lead_activity')
      .select(
        'id, lead_table, lead_id, kind, body, actor_email, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('purchases')
      .select(
        'id, customer_email, customer_name, tier_slug, amount_cents, status, paid_at, created_at, current_period_end, cancel_at_period_end, stripe_subscription_id',
      )
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase
      .from('meetings')
      .select(
        'id, provider, title, attendee_email, attendee_name, scheduled_at, lead_table, lead_id',
      )
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5),
  ]);

  const itineraries: LeadRow[] = (itinerariesRes.data ?? []).map((r) => ({
    ...r,
    _type: 'itinerary' as const,
  }));
  const newsletters = newslettersRes.data ?? [];
  const leads: LeadRow[] = (leadsRes.data ?? []).map((r) => ({
    ...r,
    _type: 'lead' as const,
  }));
  const activity = activityRes.data ?? [];

  const itStatus = countByStatus(itineraries);
  const leadStatus = countByStatus(leads);

  const now = Date.now();
  const last7 = (iso: string) => now - new Date(iso).getTime() < 7 * 86_400_000;
  const itLast7 = itineraries.filter((r) => last7(r.created_at)).length;
  const nlLast7 = newsletters.filter((r) => last7(r.created_at)).length;
  const leadsLast7 = leads.filter((r) => last7(r.created_at)).length;

  // Combine itinerary + leads for response-time and source analysis
  // (newsletters don't have status/lifecycle).
  const priced: LeadRow[] = [...itineraries, ...leads];
  const response = computeResponseTime(priced);
  const sourceStats = computeSourceStats(priced);

  const openPipeline =
    (itStatus['new'] || 0) +
    (itStatus['contacted'] || 0) +
    (itStatus['quoted'] || 0);
  const openPipelineValue = itineraries
    .filter(
      (r) =>
        r.status &&
        ['new', 'contacted', 'quoted'].includes(r.status.toLowerCase()),
    )
    .reduce((sum, r) => sum + (Number(r.deal_value) || 0), 0);

  const convertedRevenue = priced
    .filter((r) => r.converted_at)
    .reduce((sum, r) => sum + (Number(r.deal_value) || 0), 0);

  // ----- Stripe revenue (real money, not deal_value estimates) -----
  const purchases = purchasesRes.data ?? [];
  const upcomingMeetings = meetingsRes.data ?? [];
  const paidPurchases = purchases.filter((p) => p.status === 'paid');
  const totalRevenueCents = paidPurchases.reduce(
    (s, p) => s + (Number(p.amount_cents) || 0),
    0,
  );
  // Avg/week: weeks since first paid purchase, capped at 12 (rolling
  // 12-week window). Avoids misleading lifetime average for old data.
  const earliestPaid = paidPurchases.reduce<number>((min, p) => {
    const t = new Date(p.paid_at ?? p.created_at).getTime();
    return min === 0 || t < min ? t : min;
  }, 0);
  const weeksElapsed = earliestPaid
    ? Math.max(1, (Date.now() - earliestPaid) / (7 * 86_400_000))
    : 1;
  const weeksDivisor = Math.min(weeksElapsed, 12);
  const avgRevenuePerWeek = totalRevenueCents / weeksDivisor;
  // Active subs = paid subscriptions whose period hasn't lapsed.
  const activeSubs = purchases.filter(
    (p) =>
      p.stripe_subscription_id &&
      p.status === 'paid' &&
      (!p.current_period_end ||
        new Date(p.current_period_end).getTime() > Date.now()),
  );
  const arrCents = activeSubs.reduce(
    (s, p) => s + (Number(p.amount_cents) || 0),
    0,
  );

  // ----- Follow-up queue -----
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();
  const todayEnd = todayStart + 86_400_000 - 1;

  const dueQueue = priced
    .filter((r) => r.next_action_at)
    .map((r) => ({ ...r, _t: new Date(r.next_action_at!).getTime() }))
    .filter((r) => r._t <= todayEnd)
    .sort((a, b) => a._t - b._t);

  const overdueCount = dueQueue.filter((r) => r._t < todayStart).length;
  const dueTodayCount = dueQueue.length - overdueCount;

  const openStatuses = new Set(['new', 'contacted', 'qualified', 'quoted']);
  const unscheduledOpenCount = priced.filter(
    (r) =>
      !r.next_action_at &&
      openStatuses.has((r.status || '').toLowerCase()),
  ).length;

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
        <Stat
          label="Itinerary reqs"
          total={itineraries.length}
          delta7={itLast7}
        />
        <Stat
          label="Newsletter subs"
          total={newsletters.length}
          delta7={nlLast7}
        />
        <Stat label="Other leads" total={leads.length} delta7={leadsLast7} />
        <Stat
          label="Open pipeline"
          total={openPipeline}
          sub={openPipelineValue > 0 ? fmtMoney(openPipelineValue) : 'no value yet'}
        />
      </section>

      {/* ——— Performance — response time + booked deals (manual) ——— */}
      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <PerfCard
          label="Response time · median"
          value={fmtDurationHours(response.median)}
          hint={
            response.sampleSize > 0
              ? `n=${response.sampleSize} contacted leads`
              : 'no contacted leads yet'
          }
        />
        <PerfCard
          label="Response time · p90"
          value={fmtDurationHours(response.p90)}
          hint="90% of leads contacted within"
        />
        <PerfCard
          label="Booked deals · manual"
          value={convertedRevenue > 0 ? fmtMoney(convertedRevenue) : '—'}
          hint={`deal_value of ${priced.filter((r) => r.converted_at).length} converted`}
        />
      </section>

      {/* ——— Stripe revenue — real money ——— */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="display text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Stripe{' '}
            <span className="display-italic text-coral">revenue.</span>
          </h2>
          <Link
            href="/admin/purchases"
            className="text-[11px] uppercase tracking-[0.22em] text-ink-soft hover:text-coral"
          >
            All purchases →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <PerfCard
            label="Total revenue"
            value={
              totalRevenueCents > 0 ? fmtMoney(totalRevenueCents / 100) : '—'
            }
            hint={`${paidPurchases.length} paid purchase${paidPurchases.length === 1 ? '' : 's'}`}
          />
          <PerfCard
            label="Avg revenue / week"
            value={
              avgRevenuePerWeek > 0 ? fmtMoney(avgRevenuePerWeek / 100) : '—'
            }
            hint={`over ${weeksDivisor.toFixed(1)} weeks`}
          />
          <PerfCard
            label="Active subscriptions"
            value={activeSubs.length.toString()}
            hint={
              activeSubs.length > 0
                ? `${fmtMoney(arrCents / 100)} ARR`
                : 'no active subs'
            }
          />
          <PerfCard
            label="Last purchase"
            value={
              paidPurchases[0]?.paid_at
                ? timeSince(paidPurchases[0].paid_at)
                : '—'
            }
            hint={paidPurchases[0]?.tier_slug ?? 'none yet'}
          />
        </div>
      </section>

      {/* ——— Upcoming meetings ——— */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="display text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Upcoming{' '}
            <span className="display-italic text-coral">meetings.</span>
          </h2>
          <Link
            href="/admin/meetings"
            className="text-[11px] uppercase tracking-[0.22em] text-ink-soft hover:text-coral"
          >
            All meetings →
          </Link>
        </div>
        {upcomingMeetings.length === 0 ? (
          <div className="mt-5 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
            No upcoming meetings. Refresh from Google Calendar on the
            meetings page or wait for the next Calendly booking.
          </div>
        ) : (
          <ol className="mt-5 divide-y divide-ocean-deep/10 border-y border-ocean-deep/10">
            {upcomingMeetings.map((m) => (
              <li
                key={m.id}
                className="grid grid-cols-[140px_1fr_120px_auto] items-center gap-4 py-4 text-[13px]"
              >
                <span className="font-mono text-[12px] text-ink-soft">
                  {new Date(m.scheduled_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">
                    {m.title || 'Meeting'}
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-soft">
                    {m.attendee_name || m.attendee_email || '—'}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  {m.provider === 'google_calendar' ? 'Google' : 'Calendly'}
                </span>
                {m.lead_table && m.lead_id ? (
                  <Link
                    href={`/admin/leads/${
                      m.lead_table === 'itinerary_requests'
                        ? 'itinerary'
                        : m.lead_table === 'newsletter_subscribers'
                          ? 'newsletter'
                          : 'lead'
                    }/${m.lead_id}`}
                    className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                  >
                    Open →
                  </Link>
                ) : (
                  <span className="text-[11px] text-ink-soft/60">unmatched</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ——— Today's follow-up queue ——— */}
      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="display text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Today's{' '}
            <span className="display-italic text-coral">queue.</span>
          </h2>
          <div className="flex gap-3 text-[11px] uppercase tracking-[0.18em]">
            <Link
              href="/admin/leads?due=overdue"
              className={`rounded-full border px-3 py-1 ${overdueCount > 0 ? 'border-coral/50 bg-coral/10 text-coral-deep hover:border-coral' : 'border-ocean-deep/20 text-ink-soft'}`}
            >
              Overdue · {overdueCount}
            </Link>
            <Link
              href="/admin/leads?due=today"
              className={`rounded-full border px-3 py-1 ${dueTodayCount > 0 ? 'border-gold/50 bg-gold/10 text-gold-deep hover:border-gold' : 'border-ocean-deep/20 text-ink-soft'}`}
            >
              Today · {dueTodayCount}
            </Link>
            <Link
              href="/admin/leads?due=unscheduled"
              className="rounded-full border border-ocean-deep/20 px-3 py-1 text-ink-soft hover:border-ink hover:text-ink"
            >
              Unscheduled · {unscheduledOpenCount}
            </Link>
          </div>
        </div>
        {dueQueue.length === 0 ? (
          <div className="mt-6 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
            No follow-ups scheduled for today. Set a "next action" on a lead to see it here.
          </div>
        ) : (
          <ol className="mt-6 divide-y divide-ocean-deep/10 border-y border-ocean-deep/10">
            {dueQueue.slice(0, 8).map((r) => {
              const isOverdue = r._t < todayStart;
              return (
                <li
                  key={`${r._type}-${r.id}`}
                  className="grid grid-cols-[110px_1fr_140px_auto] items-center gap-4 py-4 text-[13px]"
                >
                  <span
                    className={
                      isOverdue
                        ? 'font-semibold uppercase tracking-[0.14em] text-[10px] text-coral-deep'
                        : 'font-semibold uppercase tracking-[0.14em] text-[10px] text-gold-deep'
                    }
                  >
                    {isOverdue ? 'Overdue' : 'Today'}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-ink">
                      {r.full_name || r.email}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-3 text-[11px] text-ink-soft">
                      <span>{r.email}</span>
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          className="font-mono text-ocean-deep hover:text-coral"
                        >
                          {r.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    {r.status} · {r.deal_value ? fmtMoney(Number(r.deal_value)) : 'no value'}
                  </span>
                  <Link
                    href={`/admin/leads/${r._type}/${r.id}`}
                    className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                  >
                    Open →
                  </Link>
                </li>
              );
            })}
            {dueQueue.length > 8 && (
              <li className="py-3 text-center text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                + {dueQueue.length - 8} more —{' '}
                <Link
                  href="/admin/leads?due=today"
                  className="hover:text-coral"
                >
                  see all
                </Link>
              </li>
            )}
          </ol>
        )}
      </section>

      {/* ——— Source attribution ——— */}
      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="display text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Where leads{' '}
            <span className="display-italic text-coral">come from.</span>
          </h2>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            All-time
          </span>
        </div>
        {sourceStats.length === 0 ? (
          <div className="mt-6 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
            No leads with tracked sources yet.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-sm ring-1 ring-ocean-deep/10">
            <table className="w-full border-collapse text-[13px]">
              <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold text-right">Leads</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Contacted
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Converted
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Conv. %
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10">
                {sourceStats.map((s) => (
                  <tr key={s.source}>
                    <td className="px-4 py-3 font-mono text-[12px] text-ink">
                      {s.source}
                    </td>
                    <td className="px-4 py-3 text-right text-ink">
                      {s.count}
                    </td>
                    <td className="px-4 py-3 text-right text-ink-soft">
                      {s.contacted}
                    </td>
                    <td className="px-4 py-3 text-right text-ink-soft">
                      {s.converted}
                    </td>
                    <td className="px-4 py-3 text-right text-ink-soft">
                      {s.count > 0
                        ? `${Math.round((s.converted / s.count) * 100)}%`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[12px] text-ink">
                      {s.revenue > 0 ? fmtMoney(s.revenue) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              <li
                key={a.id}
                className="grid grid-cols-[110px_120px_1fr_auto] gap-4 py-4 text-[13px]"
              >
                <span className="text-ink-soft">{timeSince(a.created_at)}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
                  {a.kind}
                </span>
                <span className="truncate text-ink">{a.body}</span>
                <Link
                  href={`/admin/leads/${leadTableToUrlSegment(a.lead_table)}/${a.lead_id}`}
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

function leadTableToUrlSegment(table: string): string {
  if (table === 'itinerary_requests') return 'itinerary';
  if (table === 'newsletter_subscribers') return 'newsletter';
  return 'lead';
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

function PerfCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-sm border border-ocean-deep/10 bg-sand-soft p-5">
      <div className="eyebrow text-ink-soft">{label}</div>
      <div className="display mt-2 text-[32px] leading-none tracking-[-0.02em] text-ink">
        {value}
      </div>
      <div className="mt-2 text-[11px] text-ink-soft">{hint}</div>
    </div>
  );
}

function Funnel({ title, counts }: { title: string; counts: StatusCount }) {
  const order = [
    'new',
    'contacted',
    'qualified',
    'quoted',
    'booked',
    'converted',
    'archived',
    'lost',
  ];
  const rows = order.filter((k) => counts[k]).map((k) => [k, counts[k]] as const);
  const max = Math.max(1, ...rows.map(([, n]) => n));

  // Compute rate-of-progression from previous active stage.
  const rates: Record<string, string> = {};
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1][1];
    const curr = rows[i][1];
    if (prev > 0) {
      rates[rows[i][0]] = `${Math.round((curr / prev) * 100)}%`;
    }
  }

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
            <li
              key={status}
              className="grid grid-cols-[100px_1fr_60px_40px] items-center gap-3 text-[13px]"
            >
              <span className="capitalize text-ink-soft">{status}</span>
              <div className="relative h-5 overflow-hidden rounded-sm bg-sand-deep/30">
                <div
                  className="h-full bg-coral/80"
                  style={{ width: `${(n / max) * 100}%` }}
                />
              </div>
              <span className="text-right text-[11px] text-ink-soft">
                {rates[status] || ''}
              </span>
              <span className="text-right font-mono text-[12px] text-ink">
                {n}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
