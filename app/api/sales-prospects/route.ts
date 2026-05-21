/**
 * POST /api/sales-prospects — anonymous lead capture endpoint.
 *
 * Used by:
 *   - components/sales/SalesProspectForm.tsx (embedded landing forms)
 *   - email-driven "express interest" landing pages
 *   - any future inbound capture surface tied to a sales_campaigns row
 *
 * Flow:
 *   1. Parse + validate the JSON body.
 *   2. If the email is on sales_unsubscribes, return ok:true silently —
 *      never re-engage and never leak that the address is suppressed.
 *   3. Resolve source_campaign_slug → campaign UUID.
 *   4. Upsert by lower(email) into sales_prospects. On conflict, only fill
 *      previously-null fields and append intake_notes to source_notes.
 *   5. Fire a Resend admin notification (best effort, off-loop).
 *   6. Always return { ok: true } so callers cannot distinguish
 *      "new prospect" from "already known" or "suppressed".
 *
 * Auth: the table has an anon-insert RLS policy but we use the service client
 * here because we additionally need to (a) read sales_unsubscribes for the
 * dedupe check, (b) read sales_campaigns to resolve the slug, (c) read
 * existing sales_prospects rows to do a true upsert. None of those reads are
 * exposed to anon, and routing them through the service client keeps RLS
 * tight everywhere else.
 *
 * TODO(rate-limit): cap to 5 req/min per IP. Reuse the directory-track ip
 * hash pattern with an in-memory LRU or, ideally, a Supabase RPC that
 * increments per-hash counters. Until then, this endpoint is best-effort
 * abuse-protected only by the upsert (a single IP cannot spam more than
 * the rate at which a single email can be re-inserted).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { sendEmail } from '@/app/lib/email';
import { brand } from '@/data/brand';
import type { SalesChannel, SalesSegment } from '@/app/lib/salesTracking';
import { inferSegment } from '@/app/lib/sales/segmentation';
import { routeProspect } from '@/app/lib/sales/sequenceRouter';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SEGMENTS = new Set<SalesSegment>([
  'golf',
  'family',
  'couples',
  'honeymoon',
  'snowbird',
  'wedding',
  'corporate',
  'unknown',
]);

const VALID_CHANNELS = new Set<SalesChannel>([
  'email',
  'linkedin',
  'instagram',
  'facebook',
  'reddit',
  'pinterest',
  'tiktok',
  'direct_mail',
  'referral',
  'organic',
  'paid_search',
  'paid_social',
  'direct',
]);

interface ProspectBody {
  email?: unknown;
  full_name?: unknown;
  zip?: unknown;
  city?: unknown;
  state?: unknown;
  segment?: unknown;
  source_channel?: unknown;
  source_campaign_slug?: unknown;
  intake_notes?: unknown;
  source_page?: unknown;
  utm_content?: unknown;
}

function clamp(s: unknown, max: number): string | null {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!t) return null;
  return t.slice(0, max);
}

function clampSegment(s: unknown): SalesSegment {
  if (typeof s === 'string' && VALID_SEGMENTS.has(s as SalesSegment)) {
    return s as SalesSegment;
  }
  return 'unknown';
}

function clampChannel(s: unknown): SalesChannel | null {
  if (typeof s === 'string' && VALID_CHANNELS.has(s as SalesChannel)) {
    return s as SalesChannel;
  }
  return null;
}

/** Always-200 acknowledgement so the client cannot fingerprint dedupe state. */
function ackOk() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  // ─── Parse ────────────────────────────────────────────────────────────────
  let raw: ProspectBody;
  try {
    raw = (await req.json()) as ProspectBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON.' },
      { status: 400 },
    );
  }

  const email = clamp(raw.email, 320);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email is required.' },
      { status: 400 },
    );
  }
  const emailLower = email.toLowerCase();

  const payload = {
    email,
    emailLower,
    full_name: clamp(raw.full_name, 200),
    zip: clamp(raw.zip, 20),
    city: clamp(raw.city, 120),
    state: clamp(raw.state, 60),
    segment: clampSegment(raw.segment),
    source_channel: clampChannel(raw.source_channel),
    source_campaign_slug: clamp(raw.source_campaign_slug, 120),
    intake_notes: clamp(raw.intake_notes, 4000),
    source_page: clamp(raw.source_page, 500),
    utm_content: clamp(raw.utm_content, 200),
  };

  // ─── Service client ───────────────────────────────────────────────────────
  // Bail gracefully if not configured (matches itinerary endpoint pattern).
  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error('[sales-prospects] service client unavailable:', err);
    return NextResponse.json(
      {
        ok: false,
        error: `Could not save your request. Please email ${brand.contact.email} directly.`,
      },
      { status: 500 },
    );
  }

  // ─── Suppression check ────────────────────────────────────────────────────
  // If the address is on the unsubscribe list, we return ok:true but do not
  // insert. CAN-SPAM + simple courtesy — once they say no, the answer is no.
  try {
    const { data: unsub } = await supabase
      .from('sales_unsubscribes')
      .select('id')
      .eq('email_lower', emailLower)
      .maybeSingle();
    if (unsub) {
      return ackOk();
    }
  } catch (err) {
    console.error('[sales-prospects] suppression check failed:', err);
    // Continue — better to risk a touch than to silently drop a real lead.
  }

  // ─── Resolve campaign slug ────────────────────────────────────────────────
  let campaignId: string | null = null;
  if (payload.source_campaign_slug) {
    try {
      const { data: campaign } = await supabase
        .from('sales_campaigns')
        .select('id')
        .eq('slug', payload.source_campaign_slug)
        .maybeSingle();
      if (campaign?.id) campaignId = campaign.id as string;
    } catch (err) {
      console.error('[sales-prospects] campaign lookup failed:', err);
      // Best-effort: missing campaign isn't fatal, we still capture the lead.
    }
  }

  // ─── Upsert (case-insensitive on email) ───────────────────────────────────
  // sales_prospects.email is unique but the dedup index is on lower(email).
  // We do a read-then-write to keep "only fill null fields + append note"
  // semantics, which a single .upsert() can't express.
  let prospectId: string | null = null;
  let wasCreated = false;
  let storedSegment: SalesSegment = 'unknown';
  try {
    const { data: existing } = await supabase
      .from('sales_prospects')
      .select(
        'id, email, full_name, zip, city, state, feeder_city, segment, source_channel, source_campaign, source_notes',
      )
      .ilike('email', emailLower)
      .maybeSingle();

    if (existing) {
      // Merge: only set fields that are currently null. Append intake notes.
      const update: Record<string, unknown> = {};
      if (!existing.full_name && payload.full_name) update.full_name = payload.full_name;
      if (!existing.zip && payload.zip) update.zip = payload.zip;
      if (!existing.city && payload.city) update.city = payload.city;
      if (!existing.state && payload.state) update.state = payload.state;
      if (
        (!existing.segment || existing.segment === 'unknown') &&
        payload.segment !== 'unknown'
      ) {
        update.segment = payload.segment;
      }
      if (!existing.source_channel && payload.source_channel) {
        update.source_channel = payload.source_channel;
      }
      if (!existing.source_campaign && campaignId) {
        update.source_campaign = campaignId;
      }
      if (payload.intake_notes) {
        const prefix = existing.source_notes
          ? `${existing.source_notes}\n\n`
          : '';
        const stamp = new Date().toISOString();
        update.source_notes = `${prefix}[${stamp}] ${payload.intake_notes}`;
      }
      if (Object.keys(update).length > 0) {
        await supabase
          .from('sales_prospects')
          .update(update)
          .eq('id', existing.id);
      }
      prospectId = existing.id as string;
      storedSegment = (existing.segment as SalesSegment) || payload.segment;
    } else {
      const insertRow = {
        email: payload.email,
        full_name: payload.full_name,
        zip: payload.zip,
        city: payload.city,
        state: payload.state,
        segment: payload.segment,
        source_channel: payload.source_channel,
        source_campaign: campaignId,
        source_notes: payload.intake_notes
          ? `[${new Date().toISOString()}] ${payload.intake_notes}`
          : null,
        status: 'new' as const,
      };
      const { data: inserted, error: insertErr } = await supabase
        .from('sales_prospects')
        .insert(insertRow)
        .select('id')
        .maybeSingle();
      if (insertErr) {
        console.error('[sales-prospects] insert error:', insertErr);
      } else if (inserted?.id) {
        prospectId = inserted.id as string;
        wasCreated = true;
        storedSegment = payload.segment;
      }
    }
  } catch (err) {
    console.error('[sales-prospects] upsert unexpected error:', err);
    // Fall through and still attempt the admin email so the lead isn't lost.
  }

  // ─── Segmentation + sequence routing ──────────────────────────────────────
  // Best-effort: a failure here NEVER blocks the capture ack. The segmenter
  // refines the stored segment using all the signal we have (campaign slug,
  // landing page, intake-notes keywords, optional utm_content); the router
  // picks a sequence and schedules touch 1 with a 5-minute enrichment buffer.
  if (prospectId) {
    try {
      const segResult = inferSegment({
        email: payload.email,
        fullName: payload.full_name ?? undefined,
        intakeNotes: payload.intake_notes ?? undefined,
        sourcePage: payload.source_page ?? undefined,
        sourceCampaign: payload.source_campaign_slug ?? undefined,
        utmContent: payload.utm_content ?? undefined,
      });

      const inferredSegment = segResult.segment as SalesSegment;
      const shouldUpdateSegment =
        wasCreated &&
        inferredSegment !== 'unknown' &&
        inferredSegment !== storedSegment;

      const decision = routeProspect({
        segment: inferredSegment,
        campaignSlug: payload.source_campaign_slug ?? undefined,
        status: 'new',
        isNew: wasCreated,
        hasEmail: true,
      });

      const prospectUpdate: Record<string, unknown> = {};
      if (shouldUpdateSegment) {
        prospectUpdate.segment = inferredSegment;
      }
      if (wasCreated && decision.sequenceId && decision.startAtIso) {
        prospectUpdate.current_sequence = decision.sequenceId;
        prospectUpdate.sequence_step = 0;
        prospectUpdate.next_touch_at = decision.startAtIso;
        prospectUpdate.status = 'queued';
      }

      if (Object.keys(prospectUpdate).length > 0) {
        await supabase
          .from('sales_prospects')
          .update(prospectUpdate)
          .eq('id', prospectId);
      }

      if (shouldUpdateSegment) {
        await supabase.from('sales_touches').insert({
          prospect_id: prospectId,
          campaign_id: campaignId,
          channel: 'email',
          touch_type: 'status_change',
          metadata: {
            event: 'segmented',
            segment: inferredSegment,
            confidence: segResult.confidence,
            signals: segResult.signals,
            route: decision,
          },
        });
      }
    } catch (err) {
      console.error('[sales-prospects] segmentation/route failed:', err);
      // Never break capture on a segmentation failure.
    }
  }

  // ─── Fire-and-forget admin notification ───────────────────────────────────
  // Don't await it inside the response path — surface the ack to the user
  // first. Resend handles retries.
  void notifyAdmin({
    email: payload.email,
    full_name: payload.full_name,
    zip: payload.zip,
    city: payload.city,
    state: payload.state,
    segment: payload.segment,
    source_channel: payload.source_channel,
    campaign_slug: payload.source_campaign_slug,
    intake_notes: payload.intake_notes,
    prospect_id: prospectId,
  });

  return ackOk();
}

// ============================================================================
// Internal: admin notification (best-effort, no-op without RESEND_API_KEY)
// ============================================================================

interface AdminNotifyInput {
  email: string;
  full_name: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  segment: string;
  source_channel: string | null;
  campaign_slug: string | null;
  intake_notes: string | null;
  prospect_id: string | null;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function notifyAdmin(req: AdminNotifyInput): Promise<void> {
  try {
    const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
    const subject = `[Sales] New prospect — ${req.full_name || req.email}${
      req.campaign_slug ? ` (${req.campaign_slug})` : ''
    }`;

    const rows = [
      ['Email', req.email],
      ['Name', req.full_name],
      ['Location', [req.city, req.state, req.zip].filter(Boolean).join(', ')],
      ['Segment', req.segment],
      ['Channel', req.source_channel],
      ['Campaign', req.campaign_slug],
      ['Notes', req.intake_notes],
      ['Prospect ID', req.prospect_id],
    ];

    const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#FCFAF5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0E2A38;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#0F7080;font-weight:600;margin-bottom:8px;">
      New sales prospect · ${esc(brand.domain)}
    </div>
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.15;color:#0E2A38;margin:0 0 20px 0;letter-spacing:-0.02em;">
      ${esc(req.full_name || req.email)}
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FFFEFA;border:1px solid rgba(14,42,56,0.1);padding:16px;">
      <tbody>
        ${rows
          .map(([label, value]) =>
            value
              ? `<tr>
                  <td style="padding:8px 12px 8px 0;color:#4A5C66;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(
                    label as string,
                  )}</td>
                  <td style="padding:8px 0;color:#0E2A38;font-size:14px;line-height:1.5;">${esc(
                    String(value),
                  )}</td>
                </tr>`
              : '',
          )
          .join('')}
      </tbody>
    </table>
    <div style="margin-top:20px;font-size:12px;color:#4A5C66;line-height:1.6;">
      View in CRM: <a href="${brand.url}/admin/sales-prospects" style="color:#0F7080;">${brand.url}/admin/sales-prospects</a>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to,
      subject,
      html,
      replyTo: req.email,
      tags: [{ name: 'type', value: 'sales_prospect' }],
    });
  } catch (err) {
    console.error('[sales-prospects] admin notify failed:', err);
  }
}
