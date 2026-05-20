import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import {
  AFFILIATE_PROGRAMS,
  ALL_AFFILIATE_PROGRAMS,
  type AffiliateProgramId,
} from '@/data/affiliateLinks';

export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 30;

interface AffiliateEventRow {
  program_id: string;
  placement: string | null;
  destination: string | null;
  event_type: string;
  created_at: string;
}

type ProgramTotals = {
  clicks: number;
  last: string | null;
};

type PlacementTotals = {
  programId: string;
  placement: string;
  clicks: number;
  last: string | null;
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function programLabel(id: string): string {
  const program = AFFILIATE_PROGRAMS[id as AffiliateProgramId];
  return program?.name ?? id;
}

function isKnownProgram(id: string): id is AffiliateProgramId {
  return id in AFFILIATE_PROGRAMS;
}

export default async function AdminAffiliatesPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program: programFilter } = await searchParams;
  const supabase = await createClient();

  const since = new Date(
    Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from('affiliate_events')
    .select('program_id, placement, destination, event_type, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50_000);

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

  const events = (data ?? []) as AffiliateEventRow[];

  // Aggregate per program (always over the full window — filter only narrows
  // the placement table below).
  const programTotals = new Map<string, ProgramTotals>();
  for (const ev of events) {
    const t = programTotals.get(ev.program_id) ?? { clicks: 0, last: null };
    t.clicks += 1;
    if (!t.last || ev.created_at > t.last) t.last = ev.created_at;
    programTotals.set(ev.program_id, t);
  }

  // Aggregate per (program, placement) — for the table. Empty placement
  // becomes the literal "(none)" so the row still surfaces.
  const placementMap = new Map<string, PlacementTotals>();
  for (const ev of events) {
    if (programFilter && ev.program_id !== programFilter) continue;
    const placement = ev.placement ?? '(none)';
    const key = `${ev.program_id}::${placement}`;
    const p = placementMap.get(key) ?? {
      programId: ev.program_id,
      placement,
      clicks: 0,
      last: null,
    };
    p.clicks += 1;
    if (!p.last || ev.created_at > p.last) p.last = ev.created_at;
    placementMap.set(key, p);
  }

  const placementRows = Array.from(placementMap.values()).sort((a, z) => {
    if (z.clicks !== a.clicks) return z.clicks - a.clicks;
    return a.placement.localeCompare(z.placement);
  });

  // Top-line stats over the full unfiltered set.
  const totalClicks = events.length;
  const programsWithActivity = programTotals.size;
  const topProgram = (() => {
    let best: { id: string; clicks: number } | null = null;
    for (const [id, t] of programTotals.entries()) {
      if (!best || t.clicks > best.clicks) best = { id, clicks: t.clicks };
    }
    return best;
  })();
  const lastClick = events[0]?.created_at ?? null;

  // Programs to show as filter pills — every registered program plus any
  // unknown program_ids that surfaced in the data (defensive — if registry
  // ever drifts, we'd still see the data).
  const knownIds = new Set<string>(ALL_AFFILIATE_PROGRAMS.map((p) => p.id));
  const seenIds = new Set<string>(programTotals.keys());
  const programIds = Array.from(new Set([...knownIds, ...seenIds])).sort();

  return (
    <div>
      <header className="mb-8">
        <div className="eyebrow eyebrow-coral">Affiliates</div>
        <h1 className="display mt-2 text-[28px] leading-[1.1] text-ink md:text-[34px]">
          Outbound clicks
          <span className="display-italic text-ink-soft">
            {' '}— last {WINDOW_DAYS} days
          </span>
        </h1>
        <p className="mt-3 max-w-[640px] text-[14px] leading-[1.6] text-ink-soft">
          Server-logged clicks on every <code>&lt;AffiliateCard&gt;</code> and{' '}
          <code>&lt;AffiliateLink&gt;</code> across the site. Compare against
          the network dashboards (Booking, Vrbo, Impact, Amazon Associates) to
          spot tracking gaps. If <em>our</em> count is higher than{' '}
          <em>theirs</em>, the program&rsquo;s tracking ID env var is probably
          unset.
        </p>
      </header>

      {/* KPIs */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total clicks', value: totalClicks.toLocaleString() },
          {
            label: 'Programs active',
            value: programsWithActivity.toLocaleString(),
          },
          {
            label: 'Top program',
            value: topProgram
              ? `${programLabel(topProgram.id)} (${topProgram.clicks})`
              : '—',
          },
          { label: 'Last click', value: fmtDate(lastClick) },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-sm border border-ocean-deep/15 bg-sand-soft p-4"
          >
            <div className="display text-[20px] leading-tight text-ink md:text-[22px]">
              {k.value}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {k.label}
            </div>
          </div>
        ))}
      </section>

      {/* Per-program totals */}
      <section className="mb-8">
        <h2 className="eyebrow text-ink-soft">Clicks per program</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-ocean-deep/15">
          <table className="w-full text-[13px]">
            <thead className="bg-sand-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              <tr>
                <th className="p-3 text-left font-semibold">Program</th>
                <th className="p-3 text-right font-semibold">Clicks</th>
                <th className="p-3 text-right font-semibold">Share</th>
                <th className="p-3 text-left font-semibold">Last click</th>
                <th className="p-3 text-left font-semibold">Tracking ID env</th>
              </tr>
            </thead>
            <tbody>
              {ALL_AFFILIATE_PROGRAMS.map((program) => {
                const t = programTotals.get(program.id) ?? {
                  clicks: 0,
                  last: null,
                };
                const share =
                  totalClicks > 0
                    ? Math.round((t.clicks / totalClicks) * 1000) / 10
                    : 0;
                return (
                  <tr
                    key={program.id}
                    className={`border-t border-ocean-deep/10 ${
                      t.clicks > 0 ? '' : 'opacity-60'
                    }`}
                  >
                    <td className="p-3 align-top">
                      <div className="font-semibold text-ink">
                        {program.name}
                      </div>
                      <div className="text-[11px] text-ink-soft">
                        {program.brandDomain}
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold tabular-nums text-ink">
                      {t.clicks}
                    </td>
                    <td className="p-3 text-right tabular-nums text-ink-soft">
                      {share}%
                    </td>
                    <td className="p-3 text-ink-soft">{fmtDate(t.last)}</td>
                    <td className="p-3 font-mono text-[11px] text-ink-soft">
                      {program.trackingIdEnv}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Program filter for placement table */}
      <nav className="mb-3 flex flex-wrap gap-2 text-[12px]">
        <Link
          href="/admin/affiliates"
          className={`rounded-full border px-3 py-1.5 transition ${
            !programFilter
              ? 'border-ink bg-ink text-sand'
              : 'border-rule-soft bg-sand-soft text-ink-soft hover:border-ocean/40 hover:text-ocean'
          }`}
        >
          All programs
        </Link>
        {programIds.map((id) => (
          <Link
            key={id}
            href={`/admin/affiliates?program=${id}`}
            className={`rounded-full border px-3 py-1.5 transition ${
              programFilter === id
                ? 'border-ink bg-ink text-sand'
                : 'border-rule-soft bg-sand-soft text-ink-soft hover:border-ocean/40 hover:text-ocean'
            }`}
          >
            {isKnownProgram(id) ? AFFILIATE_PROGRAMS[id].shortName : id}
          </Link>
        ))}
      </nav>

      {/* Placement breakdown */}
      <section>
        <h2 className="eyebrow text-ink-soft">Top placements</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-ocean-deep/15">
          <table className="w-full text-[13px]">
            <thead className="bg-sand-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              <tr>
                <th className="p-3 text-left font-semibold">Placement</th>
                <th className="p-3 text-left font-semibold">Program</th>
                <th className="p-3 text-right font-semibold">Clicks</th>
                <th className="p-3 text-left font-semibold">Last click</th>
              </tr>
            </thead>
            <tbody>
              {placementRows.map((row) => (
                <tr
                  key={`${row.programId}::${row.placement}`}
                  className="border-t border-ocean-deep/10"
                >
                  <td className="p-3 align-top">
                    <div className="font-mono text-[12px] text-ink">
                      {row.placement}
                    </div>
                  </td>
                  <td className="p-3 align-top text-ink-soft">
                    {programLabel(row.programId)}
                  </td>
                  <td className="p-3 text-right font-semibold tabular-nums text-ink">
                    {row.clicks}
                  </td>
                  <td className="p-3 text-ink-soft">{fmtDate(row.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {placementRows.length === 0 && (
          <div className="mt-8 rounded-sm border border-ocean-deep/15 bg-sand-soft p-8 text-center text-[13px] text-ink-soft">
            No clicks logged in the last {WINDOW_DAYS} days
            {programFilter ? ` for ${programLabel(programFilter)}` : ''}.
          </div>
        )}
      </section>
    </div>
  );
}
