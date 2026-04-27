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
      <strong>Reply directly</strong> to this email — it’ll go to
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

// ——— Business / "get featured" inquiry notification ———

export interface BusinessInquiryEmail {
  businessName: string;
  contactName?: string;
  email: string;
  phone?: string;
  industry?: string;
  website?: string;
  tierInterest?: string;
  message?: string;
  userAgent?: string | null;
}

export async function sendBusinessInquiryNotification(req: BusinessInquiryEmail) {
  const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';

  const subject = `New business inquiry — ${req.businessName}${req.industry ? ` (${req.industry})` : ''}`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#E8A74B;font-weight:600;margin-bottom:8px;">
      New partner inquiry · hiltonahead.com/local
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#0A2930;margin:0 0 24px 0;letter-spacing:-0.02em;">
      ${esc(req.businessName)}
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);padding:16px;">
      <tbody>
        ${fieldRow('Contact', req.contactName)}
        ${fieldRow('Email', req.email)}
        ${fieldRow('Phone', req.phone)}
        ${fieldRow('Industry', req.industry)}
        ${fieldRow('Website', req.website)}
        ${fieldRow('Tier interest', req.tierInterest)}
        ${fieldRow('Message', req.message)}
      </tbody>
    </table>
    <div style="margin-top:24px;font-size:12px;color:#6B7280;line-height:1.6;">
      <strong>Reply directly</strong> to this email — it’ll go to ${esc(req.email)}.
    </div>
    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:32px 0 16px;" />
    <div style="font-size:11px;color:#9CA3AF;line-height:1.5;">
      Source: get_featured_form<br/>
      User agent: ${esc((req.userAgent || '').slice(0, 200))}
    </div>
  </div>
</body>
</html>`;

  const text = [
    `New business inquiry — hiltonahead.com`,
    ``,
    `Business: ${req.businessName}`,
    req.contactName ? `Contact: ${req.contactName}` : '',
    `Email: ${req.email}`,
    req.phone ? `Phone: ${req.phone}` : '',
    req.industry ? `Industry: ${req.industry}` : '',
    req.website ? `Website: ${req.website}` : '',
    req.tierInterest ? `Tier interest: ${req.tierInterest}` : '',
    req.message ? `Message: ${req.message}` : '',
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
    tags: [{ name: 'type', value: 'business_inquiry' }],
  });
}

// ——— Newsletter welcome ———

/**
 * Full welcome email. Fires immediately on subscribe via the newsletter API
 * route. Thanks the reader, orients them to Hilton Ahead and the island,
 * and offers three escalating next steps (plan a trip, read the guide,
 * see pricing). Designed to convert warm traffic into either a content
 * engagement or a lead within the first 60 seconds of subscribing.
 */
export async function sendNewsletterWelcome(to: string) {
  const siteUrl = 'https://www.hiltonahead.com';
  const subject = 'Welcome to The Insider Letter — Hilton Ahead';

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A2930;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:14px;">
      The Insider Letter
    </div>
    <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.1;color:#0A2930;margin:0 0 18px 0;letter-spacing:-0.02em;">
      You’re on the list.
    </h1>
    <p style="font-size:16px;line-height:1.7;color:#3D5860;margin:0 0 16px 0;">
      Thanks for subscribing — we’re glad you’re here. Hilton
      Ahead is a locally-run trip planning service for Hilton Head Island.
      Just shy of 400 trips planned, and every itinerary still written by
      hand. No call centers, no franchise, no scripts — just an honest
      local read on the place we actually live.
    </p>
    <p style="font-size:16px;line-height:1.7;color:#3D5860;margin:0;">
      The first dispatch lands in a week or two. Until then, here’s
      what’s already waiting.
    </p>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:32px 0;" />

    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:10px;">
      About the island
    </div>
    <h2 style="font-family:Georgia,serif;font-size:22px;line-height:1.2;color:#0A2930;margin:0 0 14px 0;letter-spacing:-0.01em;">
      Twelve miles of beach. Six golf resorts. A hundred restaurants the booking sites won’t tell you about.
    </h2>
    <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:0 0 12px 0;">
      Hilton Head Island sits at the southern tip of South Carolina, an
      hour from Savannah and three from Charleston. Sea Pines and Palmetto
      Dunes anchor the resort scene. Harbour Town hosts the RBC Heritage
      every April. Skull Creek Boathouse holds tables for locals at
      sunset. Forest Beach has the only oceanfront walk-up bars on the
      island. Bluffton, just over the bridge, has a quiet old-town main
      street worth a half-day on its own.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#3D5860;margin:0;">
      The island runs on local intel. The Insider Letter is how we share
      ours.
    </p>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:32px 0;" />

    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:10px;">
      Three things to do right now
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tbody>
        <tr>
          <td style="padding:0 0 18px 0;">
            <div style="font-family:Georgia,serif;font-size:18px;color:#0A2930;margin-bottom:4px;">
              1. <a href="${siteUrl}/itinerary" style="color:#0A2930;text-decoration:none;border-bottom:1px solid #C44A2B;">Tell us about your trip.</a>
            </div>
            <div style="font-size:14px;line-height:1.65;color:#3D5860;">
              Three minutes of intake — dates, group size, what you want.
              We come back inside one business day with a sample plan and
              pricing. No commitment.
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 18px 0;">
            <div style="font-family:Georgia,serif;font-size:18px;color:#0A2930;margin-bottom:4px;">
              2. <a href="${siteUrl}/blog" style="color:#0A2930;text-decoration:none;border-bottom:1px solid #C44A2B;">Read the local guide.</a>
            </div>
            <div style="font-size:14px;line-height:1.65;color:#3D5860;">
              Tier lists for restaurants, beaches, and stays. Neighborhood
              breakdowns. The Sea Pines vs Palmetto Dunes piece is the
              shortcut for anyone choosing where to stay first.
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <div style="font-family:Georgia,serif;font-size:18px;color:#0A2930;margin-bottom:4px;">
              3. <a href="${siteUrl}/services" style="color:#0A2930;text-decoration:none;border-bottom:1px solid #C44A2B;">See how we work.</a>
            </div>
            <div style="font-size:14px;line-height:1.65;color:#3D5860;">
              Three plans — Compass ($295) for a focused consult,
              Charter ($895) for a full itinerary build, Heritage ($2,500+)
              for snowbirds and Heritage Week. Pick what fits.
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div style="margin:32px 0 0;text-align:center;">
      <a href="${siteUrl}/itinerary" style="display:inline-block;background:#0A2930;color:#F5E8D0;padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;border-radius:999px;">
        Plan my trip →
      </a>
    </div>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:36px 0 20px;" />

    <p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 10px 0;">
      Reply to this email anytime — it goes straight to William, the
      founder. Questions about the island, a specific villa, a tee time,
      or the trip you’re considering: hit reply.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 8px 0;">
      — William Griffith<br/>
      <span style="font-size:12px;color:#6B7280;">Founder, Hilton Ahead Travel Co.</span>
    </p>
    <p style="font-size:11px;color:#9CA3AF;line-height:1.6;margin:24px 0 0;">
      Hilton Head Island, SC · One dispatch a month ·
      One-click unsubscribe in every issue.
    </p>
  </div>
</body>
</html>`;

  const text = [
    `Welcome to The Insider Letter — Hilton Ahead`,
    ``,
    `Thanks for subscribing — we're glad you're here.`,
    ``,
    `Hilton Ahead is a locally-run trip planning service for Hilton Head`,
    `Island. Just shy of 400 trips planned, and every itinerary still`,
    `written by hand.`,
    ``,
    `The first dispatch lands in a week or two. Until then, here's`,
    `what's already waiting:`,
    ``,
    `1. Tell us about your trip — three minutes of intake, sample plan`,
    `   back inside one business day, no commitment.`,
    `   ${siteUrl}/itinerary`,
    ``,
    `2. Read the local guide — tier lists, neighborhood breakdowns,`,
    `   honest reviews from someone who lives here.`,
    `   ${siteUrl}/blog`,
    ``,
    `3. See how we work — Compass ($295), Charter ($895), Heritage`,
    `   ($2,500+). Pick what fits.`,
    `   ${siteUrl}/services`,
    ``,
    `Reply to this email anytime — it goes straight to William, the`,
    `founder.`,
    ``,
    `— William Griffith`,
    `Founder, Hilton Ahead Travel Co.`,
    `Hilton Head Island, SC`,
  ].join('\n');

  return sendEmail({
    to,
    subject,
    html,
    text,
    // Replies go directly to the operator inbox.
    replyTo: 'hiltonahead@gmail.com',
    tags: [{ name: 'type', value: 'newsletter_welcome' }],
  });
}
