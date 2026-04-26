import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

// ============================================================================
// Backlink outreach pipeline overview
//
// Daily-driver view: every active opportunity with the info you need to
// triage. Filter chips by stage. Click row → opportunity detail.
// ============================================================================

type Stage =
  | 'discovered'
  | 'researched'
  | 'outreached'
  | 'followed_up'
  | 'replied'
  | 'negotiating'
  | 'agreed'
  | 'published'
  | 'declined'
  | 'no_response';

const ACTIVE_STAGES: Stage[] = [
  'discovered',
  'researched',
  'outreached',
  'followed_up',
  'replied',
  'negotiating',
  'agreed',
];

const STAGE_LABEL: Record<Stage, string> = {
  discovered: 'Discovered',
  researched: 'Researched',
  outreached: 'Outreached',
  followed_up: 'Followed Up',
  replied: 'Replied',
  negotiating: 'Negotiating',
  agreed: 'Agreed',
  published: 'Published',
  declined: 'Declined',
  no_response: 'No Response',
};

const STAGE_TONE: Record<Stage, string> = {
  discovered: 'bg-sand-deep/40 text-ink',
  researched: 'bg-ocean/10 text-ocean-deep',
  outreached: 'bg-coral/10 text-coral',
  followed_up: 'bg-coral/20 text-coral',
  replied: 'bg-emerald-100 text-emerald-800',
  negotiating: 'bg-amber-100 text-amber-800',
  agreed: 'bg-emerald-200 text-emerald-900',
  published: 'bg-emerald-600 text-white',
  declined: 'bg-ink/10 text-ink-soft line-through',
  no_response: 'bg-ink/10 text-ink-soft',
};

type OpportunityRow = {
  id: string;
  stage: Stage;
  link_type: string;
  target_url: string | null;
  source_url: string | null;
  campaign: string | null;
  next_action_at: string | null;
  assigned_to: string | null;
  updated_at: string;
  account: {
    id: string;
    domain: string;
    name: string | null;
    domain_rating: number | null;
    vertical: string | null;
  } | null;
  contact: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
};

function fmtRelative(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const future = ms < 0;
  const abs = Math.abs(ms);
  const mins = abs / 60_000;
  if (mins < 60) return `${future ? 'in ' : ''}${Math.max(1, Math.round(mins))}m${future ? '' : ' ago'}`;
  const hrs = mins / 60;
  if (hrs < 48) return `${future ? 'in ' : ''}${Math.round(hrs)}h${future ? '' : ' ago'}`;
  const days = hrs / 24;
  return `${future ? 'in ' : ''}${Math.round(days)}d${future ? '' : ' ago'}`;
}

function contactName(c: OpportunityRow['contact']): string {
  if (!c) return '—';
  const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
  return name || c.email;
}

export default async function OutreachPipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; campaign?: string }>;
}) {
  const params = await searchParams;
  const stageFilter = params.stage ?? 'active';
  const campaignFilter = params.campaign ?? '';

  const supabase = await createClient();

  // Base query
  let query = supabase
    .from('outreach_opportunities')
    .select(
      `
      id, stage, link_type, target_url, source_url, campaign,
      next_action_at, assigned_to, updated_at,
      account:account_id ( id, domain, name, domain_rating, vertical ),
      contact:contact_id ( id, first_name, last_name, email )
    `,
    )
    .order('updated_at', { ascending: false })
    .limit(500);

  if (stageFilter === 'active') {
    query = query.in('stage', ACTIVE_STAGES);
  } else if (stageFilter !== 'all') {
    query = query.eq('stage', stageFilter);
  }

  if (campaignFilter) {
    query = query.eq('campaign', campaignFilter);
  }

  const [opportunitiesRes, countsRes] = await Promise.all([
    query,
    supabase.from('outreach_pipeline_counts').select('*'),
  ]);

  const opportunities = (opportunitiesRes.data ?? []) as unknown as OpportunityRow[];

  // Build counts map for stage chips
  type CountRow = { stage: Stage; total: number; overdue: number; published_count: number };
  const counts = (countsRes.data ?? []) as CountRow[];
  const countByStage: Partial<Record<Stage, number>> = {};
  let activeTotal = 0;
  let publishedTotal = 0;
  let overdueTotal = 0;
  for (const c of counts) {
    countByStage[c.stage] = c.total;
    if (ACTIVE_STAGES.includes(c.stage)) activeTotal += c.total;
    if (c.stage === 'published') publishedTotal = c.total;
    overdueTotal += c.overdue ?? 0;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="display text-[28px] leading-[1.1] text-ink md:text-[34px]">
            Backlink Outreach
          </h1>
          <p className="mt-2 text-[13px] text-ink-soft">
            High-DR sites we&apos;re pursuing for inbound links to hiltonahead.com.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/outreach/import"
            className="rounded-sm border border-ocean-deep/20 bg-sand px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
          >
            Import CSV
          </Link>
          <Link
            href="/admin/outreach/new"
            className="rounded-sm bg-ink px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral"
          >
            + New Opportunity
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Active in pipeline" value={activeTotal} />
        <KpiCard label="Links published" value={publishedTotal} accent="emerald" />
        <KpiCard label="Overdue follow-up" value={overdueTotal} accent={overdueTotal > 0 ? 'coral' : undefined} />
        <KpiCard
          label="Total tracked"
          value={Object.values(countByStage).reduce((a, b) => a + b, 0)}
        />
      </div>

      {/* Stage filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip href="/admin/outreach?stage=active" active={stageFilter === 'active'}>
          Active ({activeTotal})
        </FilterChip>
        <FilterChip href="/admin/outreach?stage=all" active={stageFilter === 'all'}>
          All
        </FilterChip>
        {(Object.keys(STAGE_LABEL) as Stage[]).map((s) => (
          <FilterChip
            key={s}
            href={`/admin/outreach?stage=${s}`}
            active={stageFilter === s}
          >
            {STAGE_LABEL[s]} ({countByStage[s] ?? 0})
          </FilterChip>
        ))}
      </div>

      {/* Pipeline table */}
      {opportunities.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-10 text-center">
          <p className="text-[14px] text-ink-soft">
            No opportunities in this view.
          </p>
          <Link
            href="/admin/outreach/new"
            className="mt-4 inline-block text-[12px] uppercase tracking-[0.18em] text-coral hover:underline"
          >
            Create the first one →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ocean-deep/15 bg-sand">
          <table className="min-w-full text-[13px]">
            <thead className="border-b border-ocean-deep/15 bg-sand-soft">
              <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                <Th>Account</Th>
                <Th>DR</Th>
                <Th>Contact</Th>
                <Th>Stage</Th>
                <Th>Link Type</Th>
                <Th>Target URL</Th>
                <Th>Next action</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => {
                const overdue =
                  o.next_action_at && new Date(o.next_action_at).getTime() < Date.now();
                return (
                  <tr
                    key={o.id}
                    className="border-b border-ocean-deep/10 last:border-b-0 hover:bg-sand-soft/60"
                  >
                    <Td>
                      <Link
                        href={`/admin/outreach/${o.id}`}
                        className="font-medium text-ink hover:text-coral"
                      >
                        {o.account?.name || o.account?.domain || '—'}
                      </Link>
                      {o.account?.vertical && (
                        <div className="mt-0.5 text-[11px] text-ink-soft">
                          {o.account.vertical}
                        </div>
                      )}
                    </Td>
                    <Td>
                      {o.account?.domain_rating != null ? (
                        <span className="font-mono text-[12px] text-ink">
                          {o.account.domain_rating}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </Td>
                    <Td>
                      <div className="text-ink">{contactName(o.contact)}</div>
                      {o.contact?.email && (
                        <div className="mt-0.5 truncate text-[11px] text-ink-soft">
                          {o.contact.email}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <span
                        className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${STAGE_TONE[o.stage]}`}
                      >
                        {STAGE_LABEL[o.stage]}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[12px] text-ink-soft">
                        {o.link_type.replace(/_/g, ' ')}
                      </span>
                    </Td>
                    <Td>
                      {o.target_url ? (
                        <span className="block max-w-[220px] truncate text-[12px] text-ocean-deep">
                          {o.target_url.replace(/^https?:\/\//, '')}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </Td>
                    <Td>
                      <span
                        className={
                          overdue
                            ? 'font-semibold text-coral'
                            : 'text-ink-soft'
                        }
                      >
                        {fmtRelative(o.next_action_at)}
                      </span>
                    </Td>
                    <Td className="text-ink-soft">{fmtRelative(o.updated_at)}</Td>
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
// Subcomponents
// ============================================================================

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'coral';
}) {
  const tone =
    accent === 'emerald'
      ? 'text-emerald-700'
      : accent === 'coral'
        ? 'text-coral'
        : 'text-ink';
  return (
    <div className="rounded-sm border border-ocean-deep/15 bg-sand p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </div>
      <div className={`display mt-2 text-[28px] leading-none ${tone}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition ${
        active
          ? 'border-coral bg-coral/10 text-coral'
          : 'border-ocean-deep/20 bg-sand text-ink-soft hover:border-coral/40 hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
