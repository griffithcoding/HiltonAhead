import Link from 'next/link';
import { createServiceClient } from '@/utils/supabase/service';

export const dynamic = 'force-dynamic';

type IssueRow = {
  id: string;
  issue_date: string;
  subject: string;
  status: string;
  recipient_count: number | null;
  sent_at: string | null;
  created_at: string;
  topics_json: { ad_hoc?: boolean; composed_by?: string } | null;
};

const STATUS_TONE: Record<string, string> = {
  pending_approval: 'bg-gold/15 text-gold-deep',
  approved: 'bg-emerald-100 text-emerald-800',
  sending: 'bg-coral/10 text-coral',
  sent: 'bg-emerald-200 text-emerald-900',
  rejected: 'bg-ink/10 text-ink-soft line-through',
  failed: 'bg-coral/20 text-coral-deep',
};

const STATUS_LABEL: Record<string, string> = {
  pending_approval: 'Draft',
  approved: 'Approved',
  sending: 'Sending',
  sent: 'Sent',
  rejected: 'Rejected',
  failed: 'Failed',
};

function fmtRelative(iso: string | null): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const mins = ms / 60_000;
  if (mins < 60) return `${Math.max(1, Math.round(mins))}m ago`;
  const hrs = mins / 60;
  if (hrs < 48) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default async function NewsletterListPage() {
  const supabase = createServiceClient();

  const [issuesRes, subsRes] = await Promise.all([
    supabase
      .from('newsletter_issues')
      .select(
        'id, issue_date, subject, status, recipient_count, sent_at, created_at, topics_json',
      )
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('unsubscribed', false),
  ]);

  const issues = (issuesRes.data ?? []) as IssueRow[];
  const activeSubs = subsRes.count ?? 0;

  const sentCount = issues.filter((i) => i.status === 'sent').length;
  const draftCount = issues.filter((i) => i.status === 'pending_approval')
    .length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="display text-[28px] leading-[1.1] text-ink md:text-[34px]">
            The{' '}
            <span className="display-italic text-coral">insider letter.</span>
          </h1>
          <p className="mt-2 text-[13px] text-ink-soft">
            Compose ad-hoc dispatches or review the weekly cron-drafted issue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/newsletter/new"
            className="rounded-sm bg-ink px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral"
          >
            + Compose new
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Active subscribers" value={activeSubs} />
        <Kpi label="Issues sent" value={sentCount} accent="emerald" />
        <Kpi
          label="Drafts pending"
          value={draftCount}
          accent={draftCount > 0 ? 'coral' : undefined}
        />
        <Kpi label="Total issues" value={issues.length} />
      </div>

      {/* Issues table */}
      {issues.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-10 text-center">
          <p className="text-[14px] text-ink-soft">
            No issues yet. Compose your first one or wait for Sunday's cron.
          </p>
          <Link
            href="/admin/newsletter/new"
            className="mt-4 inline-block text-[12px] uppercase tracking-[0.18em] text-coral hover:underline"
          >
            Compose now →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-ocean-deep/15 bg-sand">
          <table className="min-w-full text-[13px]">
            <thead className="border-b border-ocean-deep/15 bg-sand-soft">
              <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                <Th>Subject</Th>
                <Th>Status</Th>
                <Th>Type</Th>
                <Th>Sent to</Th>
                <Th>Sent</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i) => {
                const isAdHoc = i.topics_json?.ad_hoc === true;
                return (
                  <tr
                    key={i.id}
                    className="border-b border-ocean-deep/10 last:border-b-0 hover:bg-sand-soft/60"
                  >
                    <Td>
                      <Link
                        href={`/admin/newsletter/${i.id}`}
                        className="font-medium text-ink hover:text-coral"
                      >
                        {i.subject}
                      </Link>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                        {i.issue_date}
                      </div>
                    </Td>
                    <Td>
                      <span
                        className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${STATUS_TONE[i.status] || 'bg-ink/10 text-ink-soft'}`}
                      >
                        {STATUS_LABEL[i.status] || i.status}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[12px] text-ink-soft">
                        {isAdHoc ? 'Ad-hoc' : 'Weekly'}
                      </span>
                    </Td>
                    <Td>
                      {i.recipient_count != null ? (
                        <span className="font-mono text-[12px] text-ink">
                          {i.recipient_count.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </Td>
                    <Td className="text-ink-soft">{fmtRelative(i.sent_at)}</Td>
                    <Td className="text-ink-soft">
                      {fmtRelative(i.created_at)}
                    </Td>
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

function Kpi({
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
