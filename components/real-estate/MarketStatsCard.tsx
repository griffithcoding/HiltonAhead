import type { MarketTrendRow } from '@/app/lib/marketTrends';

function money(n: number | null): string {
  if (n === null) return '—';
  return `$${Math.round(n).toLocaleString()}`;
}

export default function MarketStatsCard({ latest }: { latest?: MarketTrendRow }) {
  if (!latest) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Market data for this neighborhood is being compiled.
      </div>
    );
  }
  const stats = [
    { label: 'Median sale price', value: money(latest.median_sale_price) },
    { label: 'Median $/sqft', value: money(latest.median_ppsf) },
    { label: 'Days on market', value: latest.median_dom ?? '—' },
    {
      label: 'YoY change',
      value: latest.yoy_pct === null ? '—' : `${latest.yoy_pct > 0 ? '+' : ''}${latest.yoy_pct}%`,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-rule-soft bg-sand-soft p-4 text-center">
          <div className="display text-2xl font-medium text-ink">{s.value}</div>
          <div className="mt-1 text-xs text-ink-soft">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
