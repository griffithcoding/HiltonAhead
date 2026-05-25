import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import StageSelect from './StageSelect';
import NoteForm from './NoteForm';
import PublishForm from './PublishForm';
import ComposeButton from './ComposeButton';
import SequenceToggle from './SequenceToggle';

export const dynamic = 'force-dynamic';

// ============================================================================
// Opportunity detail — full timeline + actions for one backlink deal.
// ============================================================================

type ActivityRow = {
  id: string;
  kind: string;
  actor_email: string | null;
  body: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type OppDetail = {
  id: string;
  stage: string;
  link_type: string;
  target_url: string | null;
  source_url: string | null;
  anchor_text_proposal: string | null;
  campaign: string | null;
  estimated_value: string | null;
  cost: number | null;
  placed_link_url: string | null;
  placed_at: string | null;
  next_action_at: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  account: {
    id: string;
    domain: string;
    name: string | null;
    homepage_url: string | null;
    vertical: string | null;
    domain_rating: number | null;
    monthly_traffic: number | null;
  } | null;
  contact: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string | null;
    linkedin_url: string | null;
  } | null;
};

const KIND_LABEL: Record<string, string> = {
  note: 'Note',
  stage_change: 'Stage change',
  email_sent: 'Email sent',
  email_received: 'Email received',
  sequence_started: 'Sequence started',
  sequence_paused: 'Sequence paused',
  sequence_completed: 'Sequence completed',
  link_published: 'Link published',
  declined: 'Declined',
  system: 'System',
};

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  const supabase = await createClient();

  const [oppRes, activityRes, engagementRes, seqActiveRes] = await Promise.all([
    supabase
      .from('outreach_opportunities')
      .select(
        `
        id, stage, link_type, target_url, source_url, anchor_text_proposal,
        campaign, estimated_value, cost, placed_link_url, placed_at,
        next_action_at, assigned_to, notes, created_at, updated_at,
        account:account_id ( id, domain, name, homepage_url, vertical,
                             domain_rating, monthly_traffic ),
        contact:contact_id ( id, first_name, last_name, email, role, linkedin_url )
      `,
      )
      .eq('id', opportunityId)
      .maybeSingle(),
    supabase
      .from('outreach_activity')
      .select('id, kind, actor_email, body, metadata, created_at')
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false }),
    supabase
      .from('outreach_opp_engagement')
      .select(
        'open_count, click_count, bounce_count, reply_count, last_send_at, last_received_at',
      )
      .eq('opportunity_id', opportunityId)
      .maybeSingle(),
    supabase
      .from('outreach_opportunities')
      .select('sequence_active')
      .eq('id', opportunityId)
      .maybeSingle(),
  ]);

  if (!oppRes.data) notFound();
  const opp = oppRes.data as unknown as OppDetail;
  const activity = (activityRes.data ?? []) as ActivityRow[];
  const engagement = (engagementRes.data ?? null) as {
    open_count: number | null;
    click_count: number | null;
    bounce_count: number | null;
    reply_count: number | null;
    last_send_at: string | null;
    last_received_at: string | null;
  } | null;
  const sequenceActive = (seqActiveRes.data?.sequence_active ?? true) as boolean;

  const contactName = opp.contact
    ? [opp.contact.first_name, opp.contact.last_name].filter(Boolean).join(' ').trim()
    : '';

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          href="/admin/outreach"
          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
        >
          ← Back to pipeline
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-ocean-deep/15 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-[28px] leading-[1.1] text-ink md:text-[32px]">
              {opp.account?.name || opp.account?.domain || 'Unknown account'}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-ink-soft">
              {opp.account?.homepage_url ? (
                <a
                  href={opp.account.homepage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocean-deep hover:text-coral"
                >
                  {opp.account.domain}
                </a>
              ) : (
                <span>{opp.account?.domain}</span>
              )}
              {opp.account?.vertical && <span>· {opp.account.vertical}</span>}
              {opp.account?.domain_rating != null && (
                <span>· DR {opp.account.domain_rating}</span>
              )}
              {opp.campaign && (
                <span className="rounded-sm bg-coral/10 px-2 py-0.5 text-coral">
                  {opp.campaign}
                </span>
              )}
            </div>
          </div>
          <StageSelect opportunityId={opp.id} current={opp.stage} />
        </div>

        {opp.placed_link_url && (
          <div className="mt-4 rounded-sm border border-emerald-700/30 bg-emerald-50/50 p-3 text-[13px]">
            <span className="font-semibold text-emerald-900">Link live: </span>
            <a
              href={opp.placed_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 underline"
            >
              {opp.placed_link_url}
            </a>
            {opp.placed_at && (
              <span className="ml-3 text-emerald-800/70">
                · placed {fmtDate(opp.placed_at)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Engagement strip — open / click / reply counts + sequence toggle. */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-ocean-deep/10 bg-sand/40 px-5 py-3">
        <div className="flex flex-wrap items-center gap-5 text-[12px] text-ink-soft">
          <span>
            <span className="font-medium text-ink">
              {engagement?.open_count ?? 0}
            </span>{' '}
            open{(engagement?.open_count ?? 0) === 1 ? '' : 's'}
          </span>
          <span>
            <span className="font-medium text-ink">
              {engagement?.click_count ?? 0}
            </span>{' '}
            click{(engagement?.click_count ?? 0) === 1 ? '' : 's'}
          </span>
          <span>
            <span className="font-medium text-ink">
              {engagement?.reply_count ?? 0}
            </span>{' '}
            repl{(engagement?.reply_count ?? 0) === 1 ? 'y' : 'ies'}
          </span>
          {(engagement?.bounce_count ?? 0) > 0 && (
            <span className="text-coral">
              <span className="font-medium">{engagement?.bounce_count}</span>{' '}
              bounce{(engagement?.bounce_count ?? 0) === 1 ? '' : 's'}
            </span>
          )}
          {engagement?.last_send_at && (
            <span className="text-ink-soft">
              · last sent {fmtDate(engagement.last_send_at)}
            </span>
          )}
        </div>
        <SequenceToggle opportunityId={opp.id} active={sequenceActive} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main column */}
        <div className="space-y-10">
          {/* Deal facts */}
          <Section title="Deal">
            <Field label="Link type">
              {opp.link_type.replace(/_/g, ' ')}
            </Field>
            <Field label="Our target URL">
              {opp.target_url ? (
                <a
                  href={opp.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-ocean-deep hover:text-coral"
                >
                  {opp.target_url}
                </a>
              ) : (
                <span className="text-ink-soft">—</span>
              )}
            </Field>
            {opp.source_url && (
              <Field label="Their source URL">
                <a
                  href={opp.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-ocean-deep hover:text-coral"
                >
                  {opp.source_url}
                </a>
              </Field>
            )}
            {opp.anchor_text_proposal && (
              <Field label="Anchor text proposed">
                &ldquo;{opp.anchor_text_proposal}&rdquo;
              </Field>
            )}
            {opp.estimated_value && (
              <Field label="Estimated value">{opp.estimated_value}</Field>
            )}
            {opp.notes && (
              <Field label="Notes">
                <p className="whitespace-pre-wrap text-[13px] text-ink-soft">
                  {opp.notes}
                </p>
              </Field>
            )}
          </Section>

          {/* Send outreach email */}
          <Section title="Send outreach">
            <ComposeButton
              opportunityId={opp.id}
              contact={
                opp.contact
                  ? {
                      email: opp.contact.email,
                      first_name: opp.contact.first_name,
                      last_name: opp.contact.last_name,
                    }
                  : null
              }
              account={
                opp.account
                  ? { domain: opp.account.domain, name: opp.account.name }
                  : null
              }
              opportunity={{
                target_url: opp.target_url,
                source_url: opp.source_url,
                anchor_text_proposal: opp.anchor_text_proposal,
                link_type: opp.link_type,
              }}
            />
          </Section>

          {/* Add note */}
          <Section title="Log activity">
            <NoteForm opportunityId={opp.id} />
            <p className="mt-2 text-[11px] text-ink-soft">
              Notes are private to the CRM. For outbound emails use the
              compose button above — sends are auto-logged here.
            </p>
          </Section>

          {/* Mark published */}
          <Section title="Outcome">
            <PublishForm opportunityId={opp.id} />
          </Section>

          {/* Timeline */}
          <Section title={`Timeline (${activity.length})`}>
            {activity.length === 0 ? (
              <p className="text-[13px] text-ink-soft">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((a) => (
                  <li
                    key={a.id}
                    className="flex gap-4 border-l-2 border-ocean-deep/15 pl-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 text-[12px]">
                        <span className="font-semibold text-ink">
                          {KIND_LABEL[a.kind] ?? a.kind}
                        </span>
                        {a.actor_email && (
                          <span className="text-ink-soft">{a.actor_email}</span>
                        )}
                        <span className="text-ink-soft">{fmtDateTime(a.created_at)}</span>
                      </div>
                      {a.body && (
                        <div className="mt-1 whitespace-pre-wrap text-[13px] text-ink">
                          {a.body}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <SidebarBlock title="Contact">
            {opp.contact ? (
              <div className="space-y-1 text-[13px]">
                <div className="font-medium text-ink">
                  {contactName || opp.contact.email}
                </div>
                {opp.contact.role && (
                  <div className="text-ink-soft">{opp.contact.role}</div>
                )}
                <div>
                  <a
                    href={`mailto:${opp.contact.email}`}
                    className="text-ocean-deep hover:text-coral"
                  >
                    {opp.contact.email}
                  </a>
                </div>
                {opp.contact.linkedin_url && (
                  <div>
                    <a
                      href={opp.contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-ink-soft hover:text-coral"
                    >
                      LinkedIn →
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[12px] text-ink-soft">
                No contact yet. Add one to enable outreach sequences.
              </p>
            )}
          </SidebarBlock>

          <SidebarBlock title="Account">
            {opp.account && (
              <div className="space-y-1 text-[13px]">
                {opp.account.domain_rating != null && (
                  <div>
                    <span className="text-ink-soft">DR: </span>
                    <span className="font-mono text-ink">{opp.account.domain_rating}</span>
                  </div>
                )}
                {opp.account.monthly_traffic != null && (
                  <div>
                    <span className="text-ink-soft">Traffic: </span>
                    <span className="font-mono text-ink">
                      {opp.account.monthly_traffic.toLocaleString()}/mo
                    </span>
                  </div>
                )}
                {opp.account.vertical && (
                  <div>
                    <span className="text-ink-soft">Vertical: </span>
                    <span className="text-ink">{opp.account.vertical}</span>
                  </div>
                )}
              </div>
            )}
          </SidebarBlock>

          <SidebarBlock title="Meta">
            <div className="space-y-1 text-[12px] text-ink-soft">
              <div>Created {fmtDate(opp.created_at)}</div>
              <div>Updated {fmtDate(opp.updated_at)}</div>
              {opp.next_action_at && (
                <div>
                  Next action {fmtDate(opp.next_action_at)}
                </div>
              )}
              {opp.assigned_to && <div>Owner: {opp.assigned_to}</div>}
            </div>
          </SidebarBlock>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-ocean-deep/10 py-2 text-[13px]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </div>
      <div className="text-ink">{children}</div>
    </div>
  );
}

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-ocean-deep/15 bg-sand p-4">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
        {title}
      </div>
      {children}
    </div>
  );
}
