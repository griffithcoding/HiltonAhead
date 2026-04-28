/**
 * Calendly webhook handler.
 *
 * Receives invitee.created / invitee.canceled events from Calendly and
 * upserts into the `meetings` table. Tries to resolve a lead by invitee
 * email so the booking shows up on the lead detail page automatically.
 *
 * Webhook URL to register (via scripts/calendly-register-webhook.ts):
 *   https://www.hiltonahead.com/api/calendly/webhook
 *
 * Required env:
 *   CALENDLY_WEBHOOK_SIGNING_KEY  — returned when registering the
 *                                   webhook subscription via the API.
 *   SUPABASE_SERVICE_ROLE_KEY     — service role for cross-table writes.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createServiceClient } from '@/utils/supabase/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEAD_TABLES = ['itinerary_requests', 'leads', 'newsletter_subscribers'] as const;
type LeadTable = (typeof LEAD_TABLES)[number];

interface CalendlyPayload {
  event: 'invitee.created' | 'invitee.canceled' | string;
  payload: {
    event?: string;          // resource URI of the scheduled event
    uri?: string;            // resource URI of the invitee
    name?: string;
    email?: string;
    cancel_url?: string;
    reschedule_url?: string;
    status?: string;
    scheduled_event?: {
      uri?: string;
      name?: string;
      start_time?: string;
      end_time?: string;
      location?: { type?: string; join_url?: string; location?: string };
      cancellation?: { reason?: string; canceled_by?: string };
    };
    cancellation?: { reason?: string; canceled_by?: string };
    [key: string]: unknown;
  };
}

function verifySignature(
  rawBody: string,
  header: string | null,
  signingKey: string,
): boolean {
  if (!header) return false;
  // Calendly sends "t=<unix>,v1=<hex hmac>"
  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const [k, v] = kv.split('=');
      return [k.trim(), (v ?? '').trim()];
    }),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const expected = crypto
    .createHmac('sha256', signingKey)
    .update(`${t}.${rawBody}`)
    .digest('hex');

  // Constant-time compare.
  const a = Buffer.from(v1, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function resolveLead(
  email: string,
): Promise<{ table: LeadTable; id: string } | null> {
  if (!email) return null;
  const supabase = createServiceClient();
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    return NextResponse.json(
      { ok: false, error: 'Webhook not configured.' },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get('calendly-webhook-signature');

  if (!verifySignature(rawBody, sigHeader, signingKey)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid signature.' },
      { status: 401 },
    );
  }

  let body: CalendlyPayload;
  try {
    body = JSON.parse(rawBody) as CalendlyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad JSON.' }, { status: 400 });
  }

  try {
    if (body.event === 'invitee.created') {
      await handleInviteeCreated(body);
    } else if (body.event === 'invitee.canceled') {
      await handleInviteeCanceled(body);
    }
    return NextResponse.json({ ok: true, event: body.event });
  } catch (err) {
    console.error('[calendly-webhook] handler error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Handler failed.',
      },
      { status: 500 },
    );
  }
}

function inviteeEventId(p: CalendlyPayload['payload']): string {
  // Prefer the scheduled_event URI's tail (stable across invitee actions),
  // fall back to the invitee URI.
  const eventUri = p.scheduled_event?.uri || p.event || p.uri || '';
  const tail = eventUri.split('/').pop() || '';
  return tail || `unknown-${Date.now()}`;
}

async function handleInviteeCreated(body: CalendlyPayload): Promise<void> {
  const supabase = createServiceClient();
  const p = body.payload;
  const sched = p.scheduled_event;
  if (!sched?.start_time) {
    console.warn('[calendly-webhook] invitee.created missing start_time');
    return;
  }

  const attendeeEmail = (p.email ?? '').toLowerCase();
  const lead = attendeeEmail ? await resolveLead(attendeeEmail) : null;
  const meetingUrl = sched.location?.join_url ?? sched.location?.location ?? '';

  const { data: existing } = await supabase
    .from('meetings')
    .select('id')
    .eq('provider', 'calendly')
    .eq('provider_event_id', inviteeEventId(p))
    .maybeSingle();

  const { data: upserted, error } = await supabase
    .from('meetings')
    .upsert(
      {
        provider: 'calendly',
        provider_event_id: inviteeEventId(p),
        lead_table: lead?.table ?? null,
        lead_id: lead?.id ?? null,
        title: sched.name ?? 'Calendly meeting',
        description: null,
        attendee_email: attendeeEmail || null,
        attendee_name: p.name ?? null,
        scheduled_at: sched.start_time,
        end_at: sched.end_time ?? null,
        meeting_url: meetingUrl || null,
        status: 'scheduled',
        metadata: {
          invitee_uri: p.uri,
          scheduled_event_uri: sched.uri,
          cancel_url: p.cancel_url,
          reschedule_url: p.reschedule_url,
          location_type: sched.location?.type,
        },
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'provider,provider_event_id' },
    )
    .select('id')
    .maybeSingle();

  if (error) throw new Error(`meetings upsert failed: ${error.message}`);

  // Only log to lead_activity on first creation, not re-deliveries.
  if (!existing && lead && upserted) {
    await supabase.from('lead_activity').insert({
      lead_table: lead.table,
      lead_id: lead.id,
      kind: 'meeting_booked',
      actor_email: null,
      body: `Calendly: ${sched.name ?? 'meeting'} at ${new Date(sched.start_time).toLocaleString()}`,
      metadata: {
        provider: 'calendly',
        meeting_id: upserted.id,
        attendee_email: attendeeEmail,
      },
    });
  }
}

async function handleInviteeCanceled(body: CalendlyPayload): Promise<void> {
  const supabase = createServiceClient();
  const p = body.payload;
  const id = inviteeEventId(p);

  const { data: meeting } = await supabase
    .from('meetings')
    .select('id, lead_table, lead_id, title, scheduled_at')
    .eq('provider', 'calendly')
    .eq('provider_event_id', id)
    .maybeSingle();

  await supabase
    .from('meetings')
    .update({
      status: 'canceled',
      metadata: {
        cancellation_reason:
          p.cancellation?.reason ?? p.scheduled_event?.cancellation?.reason,
        canceled_by:
          p.cancellation?.canceled_by ??
          p.scheduled_event?.cancellation?.canceled_by,
      },
      synced_at: new Date().toISOString(),
    })
    .eq('provider', 'calendly')
    .eq('provider_event_id', id);

  if (meeting?.lead_id && meeting?.lead_table) {
    await supabase.from('lead_activity').insert({
      lead_table: meeting.lead_table,
      lead_id: meeting.lead_id,
      kind: 'system',
      actor_email: null,
      body: `Calendly meeting canceled: ${meeting.title ?? 'meeting'}`,
      metadata: {
        provider: 'calendly',
        meeting_id: meeting.id,
      },
    });
  }
}
