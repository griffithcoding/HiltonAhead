import { createClient } from '@/utils/supabase/server';

function fmtMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const TIER_LABELS: Record<string, string> = {
  compass: 'Compass',
  charter: 'Charter',
  heritage: 'Heritage',
  listed: 'Listed',
  featured: 'Featured',
  signature: 'Signature',
};

export default async function PurchasesPanel({ leadEmail }: { leadEmail: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('purchases')
    .select(
      'id, tier_slug, tier_audience, amount_cents, currency, status, paid_at, created_at, current_period_end, cancel_at_period_end, stripe_subscription_id, stripe_session_id',
    )
    .ilike('customer_email', leadEmail)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="mt-12">
        <h2 className="eyebrow text-coral">Purchases</h2>
        <div className="mt-5 rounded-sm border border-coral/30 bg-coral/5 p-4 font-mono text-[12px] text-coral-deep">
          {error.message}
        </div>
      </section>
    );
  }

  const purchases = data ?? [];
  const totalPaid = purchases
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + (p.amount_cents || 0), 0);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between">
        <h2 className="eyebrow text-coral">Purchases</h2>
        {totalPaid > 0 && (
          <span className="text-[12px] uppercase tracking-[0.18em] text-ink-soft">
            Total paid · {fmtMoney(totalPaid, purchases[0]?.currency ?? 'usd')}
          </span>
        )}
      </div>

      {purchases.length === 0 ? (
        <div className="mt-5 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-6 text-center text-[13px] text-ink-soft">
          No Stripe purchases on file for {leadEmail}.
        </div>
      ) : (
        <ol className="mt-5 divide-y divide-ocean-deep/10 border-y border-ocean-deep/10">
          {purchases.map((p) => {
            const isSub = !!p.stripe_subscription_id;
            const tierLabel = TIER_LABELS[p.tier_slug] ?? p.tier_slug;
            return (
              <li
                key={p.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 text-[13px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{tierLabel}</span>
                    <TierAudiencePill audience={p.tier_audience} />
                    <StatusPill status={p.status} />
                    {isSub && (
                      <span className="rounded-full bg-ocean/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ocean-deep">
                        Subscription
                      </span>
                    )}
                    {p.cancel_at_period_end && (
                      <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-coral-deep">
                        Cancels at period end
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-ink-soft">
                    <span>{fmtDate(p.paid_at ?? p.created_at)}</span>
                    {isSub && p.current_period_end && (
                      <span>renews {fmtDate(p.current_period_end)}</span>
                    )}
                    <span className="font-mono">{p.stripe_session_id.slice(0, 18)}…</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[14px] text-ink">
                  {fmtMoney(p.amount_cents, p.currency)}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'paid'
      ? 'bg-palm/15 text-palm'
      : status === 'pending'
        ? 'bg-gold/15 text-gold-deep'
        : status === 'expired' || status === 'failed'
          ? 'bg-ocean-deep/10 text-ink-soft'
          : 'bg-coral/15 text-coral-deep';
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
  );
}

function TierAudiencePill({ audience }: { audience: string }) {
  return (
    <span className="rounded-full border border-ocean-deep/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
      {audience}
    </span>
  );
}
