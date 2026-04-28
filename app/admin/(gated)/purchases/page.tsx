import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

const TIER_LABELS: Record<string, string> = {
  compass: 'Compass',
  charter: 'Charter',
  heritage: 'Heritage',
  listed: 'Listed',
  featured: 'Featured',
  signature: 'Signature',
};

const TIER_OPTIONS = ['compass', 'charter', 'heritage', 'listed', 'featured', 'signature'];
const STATUS_OPTIONS = ['paid', 'pending', 'refunded', 'failed', 'expired'];

function fmtMoney(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface PurchaseRow {
  id: string;
  customer_email: string;
  customer_name: string | null;
  tier_slug: string;
  tier_audience: string;
  amount_cents: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  stripe_subscription_id: string | null;
}

interface LeadIndexEntry {
  table: 'itinerary_requests' | 'leads' | 'newsletter_subscribers';
  id: string;
}

export default async function AdminPurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tier?: string }>;
}) {
  const { q, status, tier } = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('purchases')
    .select(
      'id, customer_email, customer_name, tier_slug, tier_audience, amount_cents, currency, status, paid_at, created_at, current_period_end, cancel_at_period_end, stripe_subscription_id',
    )
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="mx-auto max-w-[900px] p-8 font-mono text-[13px]">
        <div className="mb-4 text-[16px] font-semibold text-coral-deep">
          Supabase query error
        </div>
        <pre className="rounded-sm border border-coral/30 bg-coral/5 p-4 whitespace-pre-wrap break-words">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  const all = (data ?? []) as PurchaseRow[];

  // Build email → lead lookup so we can link customers to lead pages.
  const emails = Array.from(
    new Set(all.map((p) => p.customer_email.toLowerCase()).filter(Boolean)),
  );
  const leadIndex = new Map<string, LeadIndexEntry>();
  if (emails.length > 0) {
    const [itRes, lRes, nlRes] = await Promise.all([
      supabase.from('itinerary_requests').select('id, email').in('email', emails),
      supabase.from('leads').select('id, email').in('email', emails),
      supabase.from('newsletter_subscribers').select('id, email').in('email', emails),
    ]);
    for (const r of itRes.data ?? []) {
      leadIndex.set((r.email as string).toLowerCase(), {
        table: 'itinerary_requests',
        id: r.id as string,
      });
    }
    for (const r of lRes.data ?? []) {
      const k = (r.email as string).toLowerCase();
      if (!leadIndex.has(k)) leadIndex.set(k, { table: 'leads', id: r.id as string });
    }
    for (const r of nlRes.data ?? []) {
      const k = (r.email as string).toLowerCase();
      if (!leadIndex.has(k))
        leadIndex.set(k, {
          table: 'newsletter_subscribers',
          id: r.id as string,
        });
    }
  }

  // Filtering happens client-side over the fetched rows — fine for sub-1k volume.
  const filtered = all
    .filter((p) => (status ? p.status === status : true))
    .filter((p) => (tier ? p.tier_slug === tier : true))
    .filter((p) => {
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        p.customer_email.toLowerCase().includes(needle) ||
        (p.customer_name || '').toLowerCase().includes(needle) ||
        p.tier_slug.includes(needle)
      );
    });

  const totalPaid = filtered
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + p.amount_cents, 0);

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">Stripe</div>
          <h1 className="display mt-3 text-[38px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
            Purchases{' '}
            <span className="display-italic text-coral">
              ({filtered.length.toLocaleString()})
            </span>
          </h1>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Paid total · filtered
          </div>
          <div className="display mt-1 text-[28px] leading-none tracking-[-0.02em] text-ink">
            {fmtMoney(totalPaid)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="mt-8 flex flex-wrap gap-3 text-[13px]">
        <input
          type="search"
          name="q"
          defaultValue={q || ''}
          placeholder="Search email, name, tier…"
          className="w-full max-w-[380px] border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink placeholder:text-ink-soft/60 focus:border-coral focus:outline-none"
        />
        <select
          name="tier"
          defaultValue={tier || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">All tiers</option>
          {TIER_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {TIER_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status || ''}
          className="border-b border-ocean-deep/30 bg-transparent px-1 py-2 text-ink focus:border-coral focus:outline-none"
        >
          <option value="">Any status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-ink bg-ink px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral hover:border-coral"
        >
          Apply
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-12 text-center text-[14px] text-ink-soft">
          No purchases match these filters.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
          <table className="w-full min-w-[1100px] border-collapse text-[13px]">
            <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              <tr>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Tier</th>
                <th className="px-3 py-3 font-semibold text-right">Amount</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Lead</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
              {filtered.map((p) => {
                const lead = leadIndex.get(p.customer_email.toLowerCase());
                const tierLabel = TIER_LABELS[p.tier_slug] ?? p.tier_slug;
                return (
                  <tr key={p.id}>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-soft">
                      {fmtDate(p.paid_at ?? p.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-ink">
                        {p.customer_name || '—'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-soft">
                        {p.customer_email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="font-medium text-ink">{tierLabel}</span>
                      <span className="ml-2 rounded-full border border-ocean-deep/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                        {p.tier_audience}
                      </span>
                      {p.stripe_subscription_id && (
                        <span className="ml-2 rounded-full bg-ocean/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ocean-deep">
                          Sub
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-ink">
                      {fmtMoney(p.amount_cents, p.currency)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <StatusPill status={p.status} />
                      {p.cancel_at_period_end && (
                        <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-coral-deep">
                          Cancels at period end
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {lead ? (
                        <Link
                          href={`/admin/leads/${tableToType(lead.table)}/${lead.id}`}
                          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                        >
                          Open →
                        </Link>
                      ) : (
                        <span className="text-[11px] text-ink-soft/60">—</span>
                      )}
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

function tableToType(table: LeadIndexEntry['table']): string {
  if (table === 'itinerary_requests') return 'itinerary';
  if (table === 'newsletter_subscribers') return 'newsletter';
  return 'lead';
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'paid'
      ? 'bg-palm/15 text-palm'
      : status === 'pending'
        ? 'bg-gold/15 text-gold-deep'
        : 'bg-coral/15 text-coral-deep';
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
  );
}
