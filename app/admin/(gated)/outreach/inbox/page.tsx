import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

// ============================================================================
// Outreach inbox — every opportunity that has received an inbound reply,
// sorted by latest activity. Optimized for the "what do I have to handle
// today" workflow.
//
// Source: outreach_opportunities with last_received_at IS NOT NULL,
// enriched with the latest email_received activity row (for the snippet)
// and the engagement view (open/click counts).
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

type InboxRow = {
  id: string;
  stage: Stage;
  last_received_at: string | null;
  reply_count: number;
  account: { domain: string; name: string | null } | null;
  contact: { email: string; first_name: string | null; last_name: string | null } | null;
};

type LatestReply = {
  opportunity_id: string;
  body: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

type EngagementRow = {
  opportunity_id: string;
  open_count: number | null;
  click_count: number | null;
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

function contactDisplayName(c: InboxRow['contact']): string {
  if (!c) return '—';
  const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
  return name || c.email;
}

export default async function OutreachInboxPage() {
  const supabase = await createClient();

  // Pull opportunities that have at least one inbound reply.
  const { data: oppData } = await supabase
    .from('outreach_opportunities')
    .select(
      `id, stage, last_received_at, reply_count,
       account:account_id ( domain, name ),
       contact:contact_id ( email, first_name, last_name )`,
    )
    .not('last_received_at', 'is', null)
    .order('last_received_at', { ascending: false })
    .limit(100);

  const opps = (oppData ?? []) as unknown as InboxRow[];
  const oppIds = opps.map((o) => o.id);

  // Latest email_received body per opportunity (for snippet).
  const latestByOpp = new Map<string, LatestReply>();
  if (oppIds.length > 0) {
    const { data: activityData } = await supabase
      .from('outreach_activity')
      .select('opportunity_id, body, created_at, metadata')
      .in('opportunity_id', oppIds)
      .eq('kind', 'email_received')
      .order('created_at', { ascending: false });

    for (const row of (activityData ?? []) as unknown as LatestReply[]) {
      if (!latestByOpp.has(row.opportunity_id)) {
        latestByOpp.set(row.opportunity_id, row);
      }
    }
  }

  // Open / click counts per opportunity.
  const engagementByOpp = new Map<string, EngagementRow>();
  if (oppIds.length > 0) {
    const { data: engData } = await supabase
      .from('outreach_opp_engagement')
      .select('opportunity_id, open_count, click_count')
      .in('opportunity_id', oppIds);
    for (const row of (engData ?? []) as unknown as EngagementRow[]) {
      engagementByOpp.set(row.opportunity_id, row);
    }
  }

  const total = opps.length;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
      <div className="flex items-end justify-between border-b border-ocean-deep/15 pb-6">
        <div>
          <p className="eyebrow text-coral">Outreach</p>
          <h1 className="display mt-2 text-[32px] leading-[1.05] text-ink md:text-[40px]">
            Inbox
          </h1>
          <p className="mt-2 text-[13px] text-ink-soft">
            Opportunities that replied — most recent first. Click any row
            to open the full thread + compose a response.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-800">
            {total} {total === 1 ? 'reply' : 'replies'}
          </span>
          <Link
            href="/admin/outreach"
            className="rounded-sm border border-ocean-deep/20 bg-sand px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
          >
            ← Pipeline
          </Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="mt-16 border-l-2 border-emerald-300 bg-emerald-50/40 px-6 py-8 text-[14px] text-ink-soft">
          <p className="mb-2 font-medium text-ink">No replies yet.</p>
          <p>
            The reply-poll cron runs every 30 minutes. Once a contact
            answers one of your outreach emails, the conversation will
            show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-ocean-deep/10">
          {opps.map((opp) => {
            const reply = latestByOpp.get(opp.id);
            const eng = engagementByOpp.get(opp.id);
            const contactName = contactDisplayName(opp.contact);
            const accountLabel =
              opp.account?.name || opp.account?.domain || '(no account)';
            const snippet = (reply?.body || '').trim().slice(0, 240);

            return (
              <li key={opp.id}>
                <Link
                  href={`/admin/outreach/${opp.id}`}
                  className="block py-5 transition-colors hover:bg-sand-deep/20"
                >
                  <div className="flex items-start gap-6">
                    <div className="min-w-[180px] max-w-[220px] shrink-0">
                      <div className="text-[14px] font-medium text-ink">
                        {accountLabel}
                      </div>
                      <div className="mt-1 text-[12px] text-ink-soft">
                        {contactName}
                      </div>
                      {opp.contact?.email && (
                        <div className="mt-1 text-[11px] font-mono text-ink-soft">
                          {opp.contact.email}
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
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${
                            STAGE_TONE[opp.stage]
                          }`}
                        >
                          {STAGE_LABEL[opp.stage]}
                        </span>
                        <span>
                          {opp.reply_count}{' '}
                          {opp.reply_count === 1 ? 'reply' : 'replies'}
                        </span>
                        {(eng?.open_count ?? 0) > 0 && (
                          <span>
                            {eng?.open_count} open
                            {(eng?.open_count ?? 0) === 1 ? '' : 's'}
                          </span>
                        )}
                        {(eng?.click_count ?? 0) > 0 && (
                          <span>
                            {eng?.click_count} click
                            {(eng?.click_count ?? 0) === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right text-[11px] text-ink-soft">
                      {timeAgo(opp.last_received_at)}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
