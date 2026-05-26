import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

// ============================================================================
// Lead inbox — every lead that has received an inbound reply, sorted by
// latest activity. Optimized for the "what do I have to handle today"
// workflow on the inbound CRM side.
//
// Pulls from both itinerary_requests and leads via the lead_engagement
// view (defined in migration 024), enriched with the latest
// email_received body for the snippet.
// ============================================================================

type LeadKind = 'itinerary' | 'lead';

const TABLE_TO_TYPE: Record<string, LeadKind> = {
  itinerary_requests: 'itinerary',
  leads: 'lead',
};

const TYPE_LABEL: Record<LeadKind, string> = {
  itinerary: 'Itinerary',
  lead: 'Lead',
};

type InboxRow = {
  lead_table: string;
  lead_id: string;
  last_received_at: string | null;
  reply_count: number | null;
  open_count: number | null;
  click_count: number | null;
};

type ParentLead = {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  status: string | null;
};

type LatestReply = {
  lead_table: string;
  lead_id: string;
  body: string | null;
  created_at: string;
};

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return new Date(iso).toLocaleDateString();
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function displayName(p: ParentLead | undefined): string {
  if (!p) return '—';
  return (
    p.full_name?.trim() ||
    p.first_name?.trim() ||
    p.email?.trim() ||
    '—'
  );
}

export default async function LeadInboxPage() {
  const supabase = await createClient();

  // Inbound replies across both tables, sorted by latest reply.
  const { data: engagementRows } = await supabase
    .from('lead_engagement')
    .select(
      'lead_table, lead_id, last_received_at, reply_count, open_count, click_count',
    )
    .not('last_received_at', 'is', null)
    .order('last_received_at', { ascending: false })
    .limit(100);

  const rows = (engagementRows ?? []) as InboxRow[];
  if (rows.length === 0) {
    return <EmptyState />;
  }

  // Bucket by parent table so we can join in one query per table.
  const itinIds = rows
    .filter((r) => r.lead_table === 'itinerary_requests')
    .map((r) => r.lead_id);
  const leadIds = rows
    .filter((r) => r.lead_table === 'leads')
    .map((r) => r.lead_id);

  const [itinRes, leadsRes] = await Promise.all([
    itinIds.length === 0
      ? Promise.resolve({ data: [] })
      : supabase
          .from('itinerary_requests')
          .select('id, email, full_name, first_name, status')
          .in('id', itinIds),
    leadIds.length === 0
      ? Promise.resolve({ data: [] })
      : supabase
          .from('leads')
          .select('id, email, full_name, first_name, status')
          .in('id', leadIds),
  ]);

  const parentByKey = new Map<string, ParentLead>();
  for (const r of (itinRes.data ?? []) as ParentLead[]) {
    parentByKey.set(`itinerary_requests:${r.id}`, r);
  }
  for (const r of (leadsRes.data ?? []) as ParentLead[]) {
    parentByKey.set(`leads:${r.id}`, r);
  }

  // Latest received body per (table, id) for snippets.
  const allIds = [...itinIds, ...leadIds];
  const latestByKey = new Map<string, LatestReply>();
  if (allIds.length > 0) {
    const { data: activityData } = await supabase
      .from('lead_activity')
      .select('lead_table, lead_id, body, created_at')
      .in('lead_id', allIds)
      .eq('kind', 'email_received')
      .order('created_at', { ascending: false });

    for (const row of (activityData ?? []) as LatestReply[]) {
      const key = `${row.lead_table}:${row.lead_id}`;
      if (!latestByKey.has(key)) latestByKey.set(key, row);
    }
  }

  const total = rows.length;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
      <div className="flex items-end justify-between border-b border-ocean-deep/15 pb-6">
        <div>
          <p className="eyebrow text-coral">Leads</p>
          <h1 className="display mt-2 text-[32px] leading-[1.05] text-ink md:text-[40px]">
            Inbox
          </h1>
          <p className="mt-2 text-[13px] text-ink-soft">
            Leads that replied — most recent first. Click any row to open
            the full thread + compose a response.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-800">
            {total} {total === 1 ? 'reply' : 'replies'}
          </span>
          <Link
            href="/admin/leads"
            className="rounded-sm border border-ocean-deep/20 bg-sand px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
          >
            ← All leads
          </Link>
        </div>
      </div>

      <ul className="mt-10 divide-y divide-ocean-deep/10">
        {rows.map((row) => {
          const key = `${row.lead_table}:${row.lead_id}`;
          const parent = parentByKey.get(key);
          const latest = latestByKey.get(key);
          const typeKind = TABLE_TO_TYPE[row.lead_table];
          const href = `/admin/leads/${typeKind}/${row.lead_id}`;
          const snippet = (latest?.body || '').trim().slice(0, 240);

          return (
            <li key={key}>
              <Link
                href={href}
                className="block py-5 transition-colors hover:bg-sand-deep/20"
              >
                <div className="flex items-start gap-6">
                  <div className="min-w-[180px] max-w-[220px] shrink-0">
                    <div className="text-[14px] font-medium text-ink">
                      {displayName(parent)}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                      {TYPE_LABEL[typeKind] || typeKind}
                    </div>
                    {parent?.email && (
                      <div className="mt-1 font-mono text-[11px] text-ink-soft">
                        {parent.email}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[14px] leading-[1.5] text-ink">
                      {snippet || (
                        <span className="italic text-ink-soft">
                          (reply detected, snippet not stored)
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-soft">
                      {parent?.status && (
                        <span className="rounded-full bg-ocean/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ocean-deep">
                          {parent.status}
                        </span>
                      )}
                      <span>
                        {row.reply_count ?? 0}{' '}
                        {(row.reply_count ?? 0) === 1 ? 'reply' : 'replies'}
                      </span>
                      {(row.open_count ?? 0) > 0 && (
                        <span>
                          {row.open_count} open
                          {(row.open_count ?? 0) === 1 ? '' : 's'}
                        </span>
                      )}
                      {(row.click_count ?? 0) > 0 && (
                        <span>
                          {row.click_count} click
                          {(row.click_count ?? 0) === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right text-[11px] text-ink-soft">
                    {timeAgo(row.last_received_at)}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
      <div className="flex items-end justify-between border-b border-ocean-deep/15 pb-6">
        <div>
          <p className="eyebrow text-coral">Leads</p>
          <h1 className="display mt-2 text-[32px] leading-[1.05] text-ink md:text-[40px]">
            Inbox
          </h1>
        </div>
        <Link
          href="/admin/leads"
          className="rounded-sm border border-ocean-deep/20 bg-sand px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
        >
          ← All leads
        </Link>
      </div>
      <div className="mt-16 border-l-2 border-emerald-300 bg-emerald-50/40 px-6 py-8 text-[14px] text-ink-soft">
        <p className="mb-2 font-medium text-ink">No lead replies yet.</p>
        <p>
          The lead-reply-poll cron runs every 30 minutes (at :15 and :45).
          Once a lead answers one of your replies, the conversation shows
          up here.
        </p>
      </div>
    </div>
  );
}
