'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { MarketTrendRow } from '@/app/lib/marketTrends';

export default function TrendChart({ rows }: { rows: MarketTrendRow[] }) {
  // rows come newest-first; chart wants oldest-first.
  const data = [...rows]
    .reverse()
    .map((r) => ({
      month: r.month?.slice(0, 7) ?? '',
      price: r.median_sale_price ?? null,
    }))
    .filter((d) => d.price !== null);

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-rule-soft bg-sand-soft p-5 text-sm text-ink-soft">
        Not enough history yet to chart a trend.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rule-soft bg-sand-soft p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink">Median sale price (24 mo)</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,41,48,0.08)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              width={48}
            />
            <Tooltip
              formatter={(v) =>
                v == null ? ['—', 'Median'] : [`$${Math.round(Number(v)).toLocaleString()}`, 'Median']
              }
            />
            <Line type="monotone" dataKey="price" stroke="#C44A2B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
