'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/utils/supabase/admin';
import { createServiceClient } from '@/utils/supabase/service';
import { listEvents, type CalendarEventSummary } from '@/utils/google-calendar/client';

const LEAD_TABLES = ['itinerary_requests', 'leads', 'newsletter_subscribers'] as const;
type LeadTable = (typeof LEAD_TABLES)[number];

interface SyncResult {
  ok: boolean;
  error?: string;
  inserted?: number;
  updated?: number;
  total?: number;
  needsReauth?: boolean;
}

async function resolveLeadByEmail(
  supabase: ReturnType<typeof createServiceClient>,
  email: string,
): Promise<{ table: LeadTable; id: string } | null> {
  if (!email) return null;
  for (const table of LEAD_TABLES) {
    const { data } = await supabase
      .from(table)
      .select('id')
      .ilike('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.id) return { table, id: data.id as string };
  }
  return null;
}

function pickLeadAttendee(
  event: CalendarEventSummary,
  organizerEmail: string,
): { email: string; name: string | null } | null {
  // Prefer the first non-organizer attendee — that's typically the lead.
  for (const a of event.attendees) {
    if (a.email && a.email !== organizerEmail) {
      return { email: a.email, name: a.name ?? null };
    }
  }
  return null;
}

export async function syncGoogleCalendar(): Promise<SyncResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const adminEmail = auth.user.email;
  if (!adminEmail) return { ok: false, error: 'No admin email on session.' };

  const { events, connected, error } = await listEvents(adminEmail);
  if (!connected) {
    return {
      ok: false,
      error: 'Google Calendar not connected. Sign out and back in to grant access.',
      needsReauth: true,
    };
  }
  if (error) return { ok: false, error };

  const supabase = createServiceClient();
  let inserted = 0;
  let updated = 0;

  for (const ev of events) {
    if (!ev.id || !ev.start) continue;
    const attendee = pickLeadAttendee(ev, adminEmail.toLowerCase());
    const lead = attendee ? await resolveLeadByEmail(supabase, attendee.email) : null;

    const { data: existing } = await supabase
      .from('meetings')
      .select('id, synced_at')
      .eq('provider', 'google_calendar')
      .eq('provider_event_id', ev.id)
      .maybeSingle();

    const status: 'scheduled' | 'canceled' =
      ev.status === 'cancelled' ? 'canceled' : 'scheduled';

    const { data: row, error: upsertErr } = await supabase
      .from('meetings')
      .upsert(
        {
          provider: 'google_calendar',
          provider_event_id: ev.id,
          lead_table: lead?.table ?? null,
          lead_id: lead?.id ?? null,
          title: ev.title,
          description: ev.description || null,
          attendee_email: attendee?.email ?? null,
          attendee_name: attendee?.name ?? null,
          scheduled_at: ev.start,
          end_at: ev.end || null,
          meeting_url: ev.meetingUrl || null,
          status,
          metadata: {
            organizer: ev.organizerEmail,
            html_link: ev.htmlLink,
            google_status: ev.status,
            attendees: ev.attendees,
          },
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'provider,provider_event_id' },
      )
      .select('id')
      .maybeSingle();

    if (upsertErr) {
      console.error('[gcal-sync] upsert error:', upsertErr);
      continue;
    }

    if (!existing) {
      inserted++;
      // Only log to lead_activity on first sight of the event.
      if (lead && row) {
        await supabase.from('lead_activity').insert({
          lead_table: lead.table,
          lead_id: lead.id,
          kind: 'meeting_booked',
          actor_email: null,
          body: `Google Calendar: ${ev.title} at ${new Date(ev.start).toLocaleString()}`,
          metadata: {
            provider: 'google_calendar',
            meeting_id: row.id,
            attendee_email: attendee?.email,
          },
        });
      }
    } else {
      updated++;
    }
  }

  revalidatePath('/admin/meetings');
  revalidatePath('/admin');

  return { ok: true, inserted, updated, total: events.length };
}
