import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import RefreshButton from './RefreshButton';

export const dynamic = 'force-dynamic';

type Tab = 'upcoming' | 'past' | 'canceled';

interface MeetingRow {
  id: string;
  provider: 'google_calendar' | 'calendly';
  title: string | null;
  description: string | null;
  attendee_email: string | null;
  attendee_name: string | null;
  scheduled_at: string;
  end_at: string | null;
  meeting_url: string | null;
  status: 'scheduled' | 'canceled' | 'completed' | 'no_show';
  lead_table: 'itinerary_requests' | 'leads' | 'newsletter_subscribers' | null;
  lead_id: string | null;
  synced_at: string | null;
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function tableToType(table: MeetingRow['lead_table']): string {
  if (table === 'itinerary_requests') return 'itinerary';
  if (table === 'newsletter_subscribers') return 'newsletter';
  return 'lead';
}

export default async function AdminMeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab =
    tab === 'past' || tab === 'canceled' ? tab : 'upcoming';

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('meetings')
    .select(
      'id, provider, title, description, attendee_email, attendee_name, scheduled_at, end_at, meeting_url, status, lead_table, lead_id, synced_at',
    )
    .order('scheduled_at', { ascending: false })
    .limit(500);

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

  const all = (data ?? []) as MeetingRow[];
  const now = Date.now();

  const upcoming = all.filter(
    (m) => m.status === 'scheduled' && new Date(m.scheduled_at).getTime() >= now,
  );
  const past = all.filter(
    (m) =>
      (m.status === 'scheduled' || m.status === 'completed') &&
      new Date(m.scheduled_at).getTime() < now,
  );
  const canceled = all.filter((m) => m.status === 'canceled');

  const rows =
    activeTab === 'upcoming'
      ? upcoming
      : activeTab === 'past'
        ? past
        : canceled;

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow eyebrow-coral">Calendar</div>
          <h1 className="display mt-3 text-[38px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
            Meetings{' '}
            <span className="display-italic text-coral">
              ({all.length.toLocaleString()})
            </span>
          </h1>
        </div>
        <RefreshButton />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
        <Tab
          label="Upcoming"
          count={upcoming.length}
          active={activeTab === 'upcoming'}
          href="/admin/meetings"
        />
        <Tab
          label="Past"
          count={past.length}
          active={activeTab === 'past'}
          href="/admin/meetings?tab=past"
        />
        <Tab
          label="Canceled"
          count={canceled.length}
          active={activeTab === 'canceled'}
          href="/admin/meetings?tab=canceled"
        />
      </div>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-12 text-center text-[14px] text-ink-soft">
          {activeTab === 'upcoming'
            ? 'No upcoming meetings. Refresh from Google Calendar or wait for the next Calendly booking.'
            : activeTab === 'past'
              ? 'No past meetings yet.'
              : 'No canceled meetings.'}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
          <table className="w-full min-w-[1100px] border-collapse text-[13px]">
            <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              <tr>
                <th className="px-3 py-3 font-semibold">When</th>
                <th className="px-3 py-3 font-semibold">Attendee</th>
                <th className="px-3 py-3 font-semibold">Title</th>
                <th className="px-3 py-3 font-semibold">Provider</th>
                <th className="px-3 py-3 font-semibold">Lead</th>
                <th className="px-3 py-3 font-semibold">Link</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10 [&_tr:hover]:bg-sand-soft">
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap px-3 py-3 text-ink">
                    {fmtDateTime(m.scheduled_at)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-ink">
                      {m.attendee_name || '—'}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-soft">
                      {m.attendee_email || '—'}
                    </div>
                  </td>
                  <td className="max-w-[260px] truncate px-3 py-3 text-ink">
                    {m.title || '—'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {m.provider === 'google_calendar' ? 'Google' : 'Calendly'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {m.lead_table && m.lead_id ? (
                      <Link
                        href={`/admin/leads/${tableToType(m.lead_table)}/${m.lead_id}`}
                        className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                      >
                        Open →
                      </Link>
                    ) : (
                      <span className="text-[11px] text-ink-soft/60">
                        unmatched
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {m.meeting_url ? (
                      <a
                        href={m.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
                      >
                        Join →
                      </a>
                    ) : (
                      <span className="text-[11px] text-ink-soft/60">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Tab({
  label,
  count,
  active,
  href,
}: {
  label: string;
  count: number;
  active: boolean;
  href: string;
}) {
  const palette = active
    ? 'border-ink bg-ink text-sand'
    : 'border-ocean-deep/20 bg-sand-soft text-ink-soft hover:border-ink hover:text-ink';
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition ${palette}`}
    >
      <span>{label}</span>
      <span className="font-mono text-[10px]">{count}</span>
    </Link>
  );
}
