/**
 * Google Calendar API client helpers.
 *
 * Read-only access to the admin's primary calendar, reusing the same
 * OAuth refresh token persisted by the auth callback in `gmail_tokens`.
 * The single Google session grants all scopes the admin consented to,
 * so no separate token table is needed.
 *
 * Required env (shared with utils/gmail/client.ts):
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 */

import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { createClient } from '@/utils/supabase/server';

export interface CalendarEventSummary {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  attendees: { email: string; name?: string | null; responseStatus?: string | null }[];
  organizerEmail: string;
  meetingUrl: string;
  status: string;
  htmlLink: string;
}

async function getStoredTokens(email: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  return data;
}

async function persistRefreshedAccessToken(
  email: string,
  accessToken: string,
  expiryDate: number | null | undefined,
) {
  const supabase = await createClient();
  await supabase
    .from('gmail_tokens')
    .update({
      access_token: accessToken,
      expires_at: expiryDate
        ? new Date(expiryDate).toISOString()
        : new Date(Date.now() + 3600 * 1000).toISOString(),
    })
    .eq('email', email.toLowerCase());
}

export async function getCalendarClient(
  adminEmail: string,
): Promise<calendar_v3.Calendar | null> {
  const tokens = await getStoredTokens(adminEmail);
  if (!tokens?.refresh_token) return null;

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.warn(
      '[gcal] GOOGLE_OAUTH_CLIENT_ID / SECRET not set — cannot refresh tokens.',
    );
    return null;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token ?? undefined,
    expiry_date: tokens.expires_at
      ? new Date(tokens.expires_at).getTime()
      : undefined,
  });

  oauth2.on('tokens', (t) => {
    if (t.access_token) {
      persistRefreshedAccessToken(
        adminEmail,
        t.access_token,
        t.expiry_date,
      ).catch((err) =>
        console.error('[gcal] failed to persist refreshed token:', err),
      );
    }
  });

  return google.calendar({ version: 'v3', auth: oauth2 });
}

function summarizeEvent(e: calendar_v3.Schema$Event): CalendarEventSummary {
  const attendees = (e.attendees ?? []).map((a) => ({
    email: (a.email ?? '').toLowerCase(),
    name: a.displayName ?? null,
    responseStatus: a.responseStatus ?? null,
  }));
  const start = e.start?.dateTime ?? e.start?.date ?? '';
  const end = e.end?.dateTime ?? e.end?.date ?? '';
  return {
    id: e.id ?? '',
    title: e.summary ?? '(no title)',
    description: e.description ?? '',
    start,
    end,
    attendees,
    organizerEmail: (e.organizer?.email ?? '').toLowerCase(),
    meetingUrl: e.hangoutLink ?? e.htmlLink ?? '',
    status: e.status ?? 'confirmed',
    htmlLink: e.htmlLink ?? '',
  };
}

/**
 * List events on the admin's primary calendar across a window.
 * Defaults: 14 days back through 60 days forward — enough to surface
 * recent past meetings on the timeline and the upcoming queue.
 */
export async function listEvents(
  adminEmail: string,
  opts: {
    timeMin?: Date;
    timeMax?: Date;
    q?: string;
    maxResults?: number;
  } = {},
): Promise<{ events: CalendarEventSummary[]; connected: boolean; error?: string }> {
  const calendar = await getCalendarClient(adminEmail);
  if (!calendar) return { events: [], connected: false };

  const timeMin =
    opts.timeMin ?? new Date(Date.now() - 14 * 86_400_000);
  const timeMax =
    opts.timeMax ?? new Date(Date.now() + 60 * 86_400_000);

  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      q: opts.q,
      maxResults: opts.maxResults ?? 250,
    });
    const events = (res.data.items ?? [])
      .filter((e) => e.start && (e.start.dateTime || e.start.date))
      .map(summarizeEvent);
    return { events, connected: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Calendar API error';
    console.error('[gcal] listEvents error:', err);
    return { events: [], connected: true, error: message };
  }
}

/** Fetch events specifically with an attendee matching `leadEmail`. */
export async function listEventsForContact(
  adminEmail: string,
  leadEmail: string,
): Promise<{ events: CalendarEventSummary[]; connected: boolean; error?: string }> {
  // Calendar API's q matches free-text in summary/description/attendees
  // so this narrows the response to relevant events only.
  return listEvents(adminEmail, { q: leadEmail });
}
