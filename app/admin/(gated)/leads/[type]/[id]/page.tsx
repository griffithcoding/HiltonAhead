import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import LeadStatusSelect from './LeadStatusSelect';
import LeadNoteForm from './LeadNoteForm';
import DealValueInput from './DealValueInput';
import NextActionInput from './NextActionInput';
import GmailPanel from './GmailPanel';

export const dynamic = 'force-dynamic';

type LeadType = 'itinerary' | 'newsletter' | 'lead';

const TYPE_TO_TABLE: Record<LeadType, string> = {
  itinerary: 'itinerary_requests',
  newsletter: 'newsletter_subscribers',
  lead: 'leads',
};

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'quoted', 'booked', 'converted', 'archived', 'lost'];

function isLeadType(t: string): t is LeadType {
  return t === 'itinerary' || t === 'newsletter' || t === 'lead';
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (!isLeadType(type)) notFound();

  const table = TYPE_TO_TABLE[type];
  const supabase = await createClient();

  const [leadRes, activityRes] = await Promise.all([
    supabase.from(table).select('*').eq('id', id).maybeSingle(),
    supabase
      .from('lead_activity')
      .select('*')
      .eq('lead_table', table)
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (!leadRes.data) notFound();
  const lead = leadRes.data as Record<string, unknown>;
  const activity = activityRes.data ?? [];

  const email = (lead.email as string) || '';
  const name = (lead.full_name as string | null) || null;
  const phone = (lead.phone as string | null) || null;
  const status = (lead.status as string | null) || null;
  const createdAt = (lead.created_at as string) || '';
  const dealValue = (lead.deal_value as number | null) ?? null;
  const nextActionAt = (lead.next_action_at as string | null) || null;
  const firstContactedAt = (lead.first_contacted_at as string | null) || null;
  const convertedAt = (lead.converted_at as string | null) || null;

  // Admin email for Gmail panel queries. Guaranteed non-null by the layout.
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const adminEmail = authUser?.email || '';

  return (
    <div className="mx-auto max-w-[980px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        <Link href="/admin/leads" className="hover:text-coral">
          ← All leads
        </Link>
      </nav>

      {/* Header */}
      <header className="mt-6 flex flex-col gap-3 border-b border-ocean-deep/15 pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">
            {type} · captured {formatDateTime(createdAt)}
          </div>
          <h1 className="display mt-3 text-[34px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[44px]">
            {name || email}
          </h1>
          <div className="mt-2 flex flex-wrap gap-4 text-[13px] text-ink-soft">
            <a href={`mailto:${email}`} className="hover:text-coral">
              {email}
            </a>
            {phone && (
              <a href={`tel:${phone}`} className="hover:text-coral">
                {phone}
              </a>
            )}
          </div>
        </div>
        {type !== 'newsletter' && status && (
          <div className="flex shrink-0 flex-col items-end gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Status
              </span>
              <LeadStatusSelect
                type={type}
                id={id}
                current={status}
                options={STATUS_OPTIONS}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Deal value
              </span>
              <DealValueInput type={type} id={id} current={dealValue} />
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Next action
              </span>
              <NextActionInput type={type} id={id} current={nextActionAt} />
            </div>
          </div>
        )}
      </header>

      {/* Lifecycle timestamps */}
      {type !== 'newsletter' && (firstContactedAt || convertedAt || nextActionAt) && (
        <div className="mt-6 flex flex-wrap gap-6 text-[12px] text-ink-soft">
          {firstContactedAt && (
            <span>
              <span className="font-semibold text-ink">First contact:</span>{' '}
              {formatDateTime(firstContactedAt)}
            </span>
          )}
          {convertedAt && (
            <span>
              <span className="font-semibold text-ink">Converted:</span>{' '}
              {formatDateTime(convertedAt)}
            </span>
          )}
          {nextActionAt && (
            <span>
              <span className="font-semibold text-ink">Next action:</span>{' '}
              {formatDateTime(nextActionAt)}
            </span>
          )}
        </div>
      )}

      {/* Two columns — details + activity */}
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
        {/* Details */}
        <section>
          <h2 className="eyebrow text-coral">Details</h2>
          <dl className="mt-5 grid grid-cols-[120px_1fr] gap-y-3 text-[13px]">
            {type === 'itinerary' && <ItineraryFields lead={lead} />}
            {type === 'newsletter' && <NewsletterFields lead={lead} />}
            {type === 'lead' && <GenericFields lead={lead} />}
          </dl>
        </section>

        {/* Activity + notes */}
        <section>
          <h2 className="eyebrow text-coral">Activity</h2>
          <div className="mt-5">
            <LeadNoteForm type={type} id={id} />
          </div>
          {activity.length === 0 ? (
            <div className="mt-6 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-6 text-center text-[13px] text-ink-soft">
              Nothing has happened yet. Drop the first note above.
            </div>
          ) : (
            <ol className="mt-6 flex flex-col gap-0 divide-y divide-ocean-deep/10">
              {activity.map((a) => (
                <li key={a.id} className="py-4">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                    <span className="font-semibold text-coral">{a.kind}</span>
                    <span>·</span>
                    <span>{formatDateTime(a.created_at)}</span>
                    {a.actor_email && (
                      <>
                        <span>·</span>
                        <span>{a.actor_email}</span>
                      </>
                    )}
                  </div>
                  {a.body && (
                    <div className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.6] text-ink">
                      {a.body}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* Gmail panel — reads/sends via Google API */}
      {email && adminEmail && (
        <GmailPanel
          adminEmail={adminEmail}
          leadEmail={email}
          leadId={id}
          type={type}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </dt>
      <dd className="text-ink">{value}</dd>
    </>
  );
}

function ItineraryFields({ lead }: { lead: Record<string, unknown> }) {
  const interests = lead.interests as string[] | null;
  return (
    <>
      <Row label="Party size" value={lead.party_size as number | null} />
      <Row label="Start date" value={lead.start_date as string | null} />
      <Row label="End date" value={lead.end_date as string | null} />
      <Row label="Lodging" value={lead.lodging as string | null} />
      <Row label="Budget" value={lead.budget as string | null} />
      <Row
        label="Interests"
        value={interests && interests.length > 0 ? interests.join(', ') : null}
      />
      <Row label="Source" value={lead.source as string | null} />
      <Row
        label="Notes"
        value={
          lead.notes ? (
            <span className="whitespace-pre-wrap">{lead.notes as string}</span>
          ) : null
        }
      />
    </>
  );
}

function NewsletterFields({ lead }: { lead: Record<string, unknown> }) {
  const interests = lead.interests as string[] | null;
  return (
    <>
      <Row label="Source" value={lead.source as string | null} />
      <Row label="Page URL" value={lead.page_url as string | null} />
      <Row
        label="Interests"
        value={interests && interests.length > 0 ? interests.join(', ') : null}
      />
      <Row
        label="Confirmed"
        value={(lead.confirmed as boolean) ? 'Yes' : 'No'}
      />
      <Row
        label="Unsubscribed"
        value={(lead.unsubscribed as boolean) ? 'Yes' : 'No'}
      />
    </>
  );
}

function GenericFields({ lead }: { lead: Record<string, unknown> }) {
  return (
    <>
      <Row label="Source" value={lead.source as string | null} />
      <Row
        label="Message"
        value={
          lead.message ? (
            <span className="whitespace-pre-wrap">{lead.message as string}</span>
          ) : null
        }
      />
      <Row label="Page URL" value={lead.page_url as string | null} />
    </>
  );
}
