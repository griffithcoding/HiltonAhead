/**
 * Transactional email helpers.
 *
 * Uses Resend (resend.com). Configure via env vars:
 *   RESEND_API_KEY     — API key from https://resend.com/api-keys
 *   RESEND_FROM_EMAIL  — sender address, e.g. "Hilton Ahead <hello@hiltonahead.com>"
 *                        If you haven't verified a custom domain yet, use the
 *                        default: "Hilton Ahead <onboarding@resend.dev>"
 *   RESEND_TO_EMAIL    — where internal notifications go, e.g. "hiltonahead@gmail.com"
 *
 * All `send*` helpers no-op gracefully (return { ok: false, skipped: true })
 * when RESEND_API_KEY is not configured, so the rest of the request flow
 * continues to work in development.
 */

import { Resend } from 'resend';

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const DEFAULT_FROM = 'Hilton Ahead <onboarding@resend.dev>';

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}): Promise<
  | { ok: true; id: string }
  | { ok: false; skipped: true }
  | { ok: false; error: string }
> {
  const client = getClient();
  if (!client) return { ok: false, skipped: true };

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  try {
    const result = await client.emails.send({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
      tags: opts.tags,
    });
    if (result.error) {
      console.error('[email] resend error:', result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id || '' };
  } catch (err) {
    console.error('[email] unexpected error:', err);
    return { ok: false, error: 'Email send failed.' };
  }
}

// ——— Internal notification templates ———

/** Escape HTML for safe inclusion in email body. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fieldRow(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '';
  const v = String(value);
  return `<tr>
    <td style="padding:8px 12px 8px 0;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;color:#0A2930;font-size:14px;line-height:1.5;">${esc(v)}</td>
  </tr>`;
}

export interface ItineraryRequestEmail {
  email: string;
  fullName?: string;
  phone?: string;
  partySize?: number;
  startDate?: string;
  endDate?: string;
  lodging?: string;
  interests?: string[];
  budget?: string;
  notes?: string;
  userAgent?: string | null;
  source?: string;
}

/** Build + send the "new itinerary request" notification to the ops inbox. */
export async function sendItineraryNotification(req: ItineraryRequestEmail) {
  const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';

  const subject = `New itinerary request — ${req.fullName || req.email}${
    req.partySize ? ` (party of ${req.partySize})` : ''
  }`;

  const interests = req.interests?.join(', ') || '';
  const dates =
    req.startDate && req.endDate
      ? `${req.startDate} → ${req.endDate}`
      : req.startDate || req.endDate || '';

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:8px;">
      New itinerary request · hiltonahead.com
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#0A2930;margin:0 0 24px 0;letter-spacing:-0.02em;">
      ${esc(req.fullName || 'A traveler')}${
    req.partySize ? ` · party of ${req.partySize}` : ''
  }
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);padding:16px;">
      <tbody>
        ${fieldRow('Email', req.email)}
        ${fieldRow('Full name', req.fullName)}
        ${fieldRow('Phone', req.phone)}
        ${fieldRow('Party size', req.partySize)}
        ${fieldRow('Dates', dates)}
        ${fieldRow('Lodging', req.lodging)}
        ${fieldRow('Interests', interests)}
        ${fieldRow('Budget', req.budget)}
        ${fieldRow('Notes', req.notes)}
      </tbody>
    </table>

    <div style="margin-top:24px;font-size:12px;color:#6B7280;line-height:1.6;">
      <strong>Reply directly</strong> to this email — it\u2019ll go to
      ${esc(req.email)}. Or open your CRM/Supabase dashboard to respond.
    </div>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:32px 0 16px;" />
    <div style="font-size:11px;color:#9CA3AF;line-height:1.5;">
      Source: ${esc(req.source || 'itinerary_form')}<br/>
      User agent: ${esc((req.userAgent || '').slice(0, 200))}
    </div>
  </div>
</body>
</html>`;

  const text = [
    `New itinerary request — hiltonahead.com`,
    ``,
    `Email: ${req.email}`,
    req.fullName ? `Full name: ${req.fullName}` : '',
    req.phone ? `Phone: ${req.phone}` : '',
    req.partySize ? `Party size: ${req.partySize}` : '',
    dates ? `Dates: ${dates}` : '',
    req.lodging ? `Lodging: ${req.lodging}` : '',
    interests ? `Interests: ${interests}` : '',
    req.budget ? `Budget: ${req.budget}` : '',
    req.notes ? `Notes: ${req.notes}` : '',
    ``,
    `Reply directly to this email — it'll go to ${req.email}.`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: req.email,
    tags: [{ name: 'type', value: 'itinerary_request' }],
  });
}

// ——— Newsletter welcome (kept short — just a confirmation) ———

export async function sendNewsletterWelcome(to: string) {
  const subject = 'You\u2019re on the list — Hilton Ahead';
  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:12px;">
      The Insider Letter
    </div>
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.12;color:#0A2930;margin:0 0 16px 0;letter-spacing:-0.02em;">
      You\u2019re on the list.
    </h1>
    <p style="font-size:15px;line-height:1.7;color:#3D5860;">
      Thanks for subscribing. The first dispatch lands in a week or two \u2014
      villa deals, openings, seasonal intel, and the tee times that just
      dropped. No spam, no forwarding your email anywhere, one-click
      unsubscribe in every issue.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#3D5860;margin-top:24px;">
      \u2014 Hilton Ahead<br/>
      <span style="color:#9CA3AF;font-size:12px;">Hilton Head Island, SC</span>
    </p>
  </div>
</body>
</html>`;
  return sendEmail({
    to,
    subject,
    html,
    text:
      'You\u2019re on the list. First dispatch lands in a week or two. Reply anytime.',
    // Replies go directly to the operator inbox. Reply-To can be any
    // address; it does not need to be on the sending domain. The
    // send.hiltonahead.com subdomain has no mailbox.
    replyTo: 'hiltonahead@gmail.com',
    tags: [{ name: 'type', value: 'newsletter_welcome' }],
  });
}
