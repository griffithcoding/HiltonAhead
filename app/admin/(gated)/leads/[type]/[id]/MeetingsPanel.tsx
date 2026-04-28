import { createClient } from '@/utils/supabase/server';

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface MeetingRow {
  id: string;
  provider: 'google_calendar' | 'calendly';
  title: string | null;
  scheduled_at: string;
  end_at: string | null;
  attendee_email: string | null;
  attendee_name: string | null;
  meeting_url: string | null;
  status: 'scheduled' | 'canceled' | 'completed' | 'no_show';
}

export default async function MeetingsPanel({
  leadEmail,
  leadTable,
  leadId,
}: {
  leadEmail: string;
  leadTable: string;
  leadId: string;
}) {
  const supabase = await createClient();

  // Match by attendee email (most common — synced events) OR by direct
  // lead_id assignment (manually attached). The .or() syntax handles both.
  const { data, error } = await supabase
    .from('meetings')
    .select(
      'id, provider, title, scheduled_at, end_at, attendee_email, attendee_name, meeting_url, status',
    )
    .or(
      `and(lead_table.eq.${leadTable},lead_id.eq.${leadId}),attendee_email.eq.${leadEmail.toLowerCase()}`,
    )
    .order('scheduled_at', { ascending: false });

  if (error) {
    return (
      <section className="mt-12">
        <h2 className="eyebrow text-coral">Meetings</h2>
        <div className="mt-5 rounded-sm border border-coral/30 bg-coral/5 p-4 font-mono text-[12px] text-coral-deep">
          {error.message}
        </div>
      </section>
    );
  }

  const meetings = (data ?? []) as MeetingRow[];
  const now = Date.now();
  const upcoming = meetings.filter(
    (m) => new Date(m.scheduled_at).getTime() >= now && m.status === 'scheduled',
  );
  const past = meetings.filter(
    (m) => !upcoming.includes(m),
  );

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between">
        <h2 className="eyebrow text-coral">Meetings</h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          {meetings.length} total
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="mt-5 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-6 text-center text-[13px] text-ink-soft">
          No meetings on file. Calendly bookings and Google Calendar events
          for {leadEmail} will appear here.
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {upcoming.length > 0 && (
            <MeetingList title="Upcoming" rows={upcoming} />
          )}
          {past.length > 0 && (
            <MeetingList title="Past / canceled" rows={past} />
          )}
        </div>
      )}
    </section>
  );
}

function MeetingList({ title, rows }: { title: string; rows: MeetingRow[] }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        {title}
      </div>
      <ol className="divide-y divide-ocean-deep/10 border-y border-ocean-deep/10">
        {rows.map((m) => (
          <li
            key={m.id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 text-[13px]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">
                  {m.title || 'Meeting'}
                </span>
                <ProviderPill provider={m.provider} />
                <StatusPill status={m.status} />
              </div>
              <div className="mt-0.5 text-[11px] text-ink-soft">
                {fmtDateTime(m.scheduled_at)}
              </div>
            </div>
            {m.meeting_url && (
              <a
                href={m.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
              >
                Open →
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProviderPill({ provider }: { provider: 'google_calendar' | 'calendly' }) {
  const label = provider === 'google_calendar' ? 'Google' : 'Calendly';
  return (
    <span className="rounded-full border border-ocean-deep/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: MeetingRow['status'] }) {
  const tone =
    status === 'scheduled'
      ? 'bg-ocean/10 text-ocean-deep'
      : status === 'completed'
        ? 'bg-palm/15 text-palm'
        : 'bg-coral/15 text-coral-deep';
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
  );
}
