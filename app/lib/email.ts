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

// ——— Lead inquiries (relocation / owner / wedding) ———

export type LeadType = 'relocation' | 'owner' | 'wedding';

export interface LeadNotificationPayload {
  type: LeadType;
  email: string;
  fullName?: string;
  phone?: string;
  notes?: string;
  details?: Record<string, unknown>;
  source: string;
  userAgent?: string | null;
}

const LEAD_LABELS: Record<LeadType, { eyebrow: string; subjectPrefix: string; color: string }> = {
  relocation: {
    eyebrow: 'New relocation inquiry · /move-to-hilton-head',
    subjectPrefix: 'New relocation lead',
    color: '#0F7A4D',
  },
  owner: {
    eyebrow: 'New owner inquiry · /sell-or-rent-your-villa',
    subjectPrefix: 'New owner lead',
    color: '#E8A74B',
  },
  wedding: {
    eyebrow: 'New wedding inquiry · /hilton-head-wedding-inquiry',
    subjectPrefix: 'New wedding lead',
    color: '#C44A2B',
  },
};

function detailRows(details?: Record<string, unknown>): string {
  if (!details) return '';
  return Object.entries(details)
    .map(([k, v]) => {
      const label = k
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const value = Array.isArray(v) ? v.join(', ') : String(v);
      return fieldRow(label, value);
    })
    .join('');
}

export async function sendLeadNotification(req: LeadNotificationPayload) {
  const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
  const meta = LEAD_LABELS[req.type];
  const subject = `${meta.subjectPrefix} — ${req.fullName || req.email}`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${meta.color};font-weight:600;margin-bottom:8px;">
      ${esc(meta.eyebrow)}
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#0A2930;margin:0 0 24px 0;letter-spacing:-0.02em;">
      ${esc(req.fullName || 'A lead')}
    </h1>
    <table style="width:100%;border-collapse:collapse;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);padding:16px;">
      <tbody>
        ${fieldRow('Email', req.email)}
        ${fieldRow('Phone', req.phone)}
        ${detailRows(req.details)}
        ${fieldRow('Notes', req.notes)}
      </tbody>
    </table>
    <div style="margin-top:24px;font-size:12px;color:#6B7280;line-height:1.6;">
      <strong>Reply directly</strong> to this email — it'll go to ${esc(req.email)}.
    </div>
    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:32px 0 16px;" />
    <div style="font-size:11px;color:#9CA3AF;line-height:1.5;">
      Source: ${esc(req.source)}<br/>
      User agent: ${esc((req.userAgent || '').slice(0, 200))}
    </div>
  </div>
</body>
</html>`;

  const text = [
    `${meta.subjectPrefix} — ${req.fullName || req.email}`,
    ``,
    `Email: ${req.email}`,
    req.phone ? `Phone: ${req.phone}` : '',
    ...(req.details
      ? Object.entries(req.details).map(
          ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`,
        )
      : []),
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
    tags: [{ name: 'type', value: `lead_${req.type}` }],
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
      255+ trips advised, and every itinerary still written by hand. No
      call centers, no franchise, no scripts — just an honest local read
      on the place we actually live.
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
    `Island. 255+ trips advised, and every itinerary still written by`,
    `hand.`,
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

// ---------------------------------------------------------------------------
// Business Portal — application + claim emails
// ---------------------------------------------------------------------------

export interface BusinessApplicationEmail {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industrySlug: string;
  website?: string;
  message?: string;
  applicationId: string;
}

/** Internal: notify admin of a new /business/apply submission. */
export async function sendBusinessApplicationNotification(
  req: BusinessApplicationEmail,
) {
  const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
  const subject = `[Portal] New business application: ${req.businessName}`;

  const html = `
    <h2>New business portal application</h2>
    <p>Review and approve in Supabase, then forward the magic-link.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px;">
      ${fieldRow('Business name', req.businessName)}
      ${fieldRow('Contact name', req.contactName)}
      ${fieldRow('Email', req.email)}
      ${fieldRow('Phone', req.phone)}
      ${fieldRow('Category', req.industrySlug)}
      ${fieldRow('Website', req.website)}
      ${fieldRow('Application ID', req.applicationId)}
    </table>
    ${req.message ? `<h3 style="font-family:system-ui,sans-serif;">Message</h3><p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;">${esc(req.message)}</p>` : ''}
  `;
  return sendEmail({
    to,
    subject,
    html,
    replyTo: req.email,
    tags: [{ name: 'type', value: 'business_application' }],
  });
}

/** Public: ack to applicant. */
export async function sendBusinessApplicationAck(opts: {
  to: string;
  contactName: string;
  businessName: string;
}) {
  const subject = `We received your application — ${opts.businessName}`;
  const html = `
    <p>Hi ${esc(opts.contactName)},</p>
    <p>Thanks for applying to be listed on Hilton Ahead. We review every application by hand for fit (locally owned, real address on Hilton Head / Bluffton / Daufuskie, currently open).</p>
    <p>Expect a reply within about a week. If approved, we'll send a one-time link to finish setting up your portal account.</p>
    <p style="color:#4A5C66;font-size:13px;margin-top:24px;">— Hilton Ahead</p>
  `;
  return sendEmail({
    to: opts.to,
    subject,
    html,
    replyTo: 'hello@hiltonahead.com',
    tags: [{ name: 'type', value: 'business_application_ack' }],
  });
}

/** Public: claim verification link. */
export async function sendClaimVerificationEmail(opts: {
  to: string;
  businessName: string;
  verifyUrl: string;
}) {
  const subject = `Verify your claim: ${opts.businessName}`;
  const html = `
    <p>Someone (hopefully you) requested to claim ${esc(opts.businessName)} on Hilton Ahead.</p>
    <p>Click the link below to verify and link your portal account. The link expires in 14 days.</p>
    <p style="margin:24px 0;">
      <a href="${opts.verifyUrl}" style="background:#0E2A38;color:#FCFAF5;padding:12px 20px;text-decoration:none;border-radius:999px;font-family:system-ui,sans-serif;font-size:13px;">Verify and link my account →</a>
    </p>
    <p style="color:#4A5C66;font-size:12px;">If you didn't request this, ignore the email — no action is taken without clicking the link.</p>
    <p style="color:#4A5C66;font-size:12px;word-break:break-all;">Direct URL: ${esc(opts.verifyUrl)}</p>
  `;
  return sendEmail({
    to: opts.to,
    subject,
    html,
    replyTo: 'hello@hiltonahead.com',
    tags: [{ name: 'type', value: 'business_claim_verify' }],
  });
}

/** Internal: a claim came in from an email that doesn't match the listing. */
export async function sendClaimRequestAdminNotification(opts: {
  businessName: string;
  businessSlug: string;
  requesterEmail: string;
  onFileEmail: string;
  verifyUrl: string;
}) {
  const to = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';
  const subject = `[Portal] Manual review needed — claim for ${opts.businessName}`;
  const html = `
    <h2>Claim request — manual review needed</h2>
    <p>The requester's email does not match the email on file for this listing.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px;">
      ${fieldRow('Business', `${opts.businessName} (${opts.businessSlug})`)}
      ${fieldRow('Requester email', opts.requesterEmail)}
      ${fieldRow('On-file email', opts.onFileEmail || '(none)')}
    </table>
    <p style="margin-top:16px;">If you decide the request is legitimate (e.g. business changed hands), forward the URL below to the requester. They'll click it, sign in via magic link to <strong>${esc(opts.requesterEmail)}</strong>, and the binding completes automatically.</p>
    <p style="color:#4A5C66;font-size:12px;word-break:break-all;">${esc(opts.verifyUrl)}</p>
  `;
  return sendEmail({
    to,
    subject,
    html,
    replyTo: opts.requesterEmail,
    tags: [{ name: 'type', value: 'business_claim_admin_review' }],
  });
}

// ---------------------------------------------------------------------------
// B2B Directory — monthly attribution proof email
// ---------------------------------------------------------------------------

export interface AttributionProofEmail {
  to: string;
  contactName?: string;
  businessName: string;
  businessSlug: string;
  tierSlug: 'listed' | 'featured' | 'signature';
  phoneClicks: number;
  websiteClicks: number;
  inquirySubmits: number;
  /** ISO date string for subscription renewal; null for Signature (manually managed). */
  renewalDate: string | null;
  windowDays: number;
}

/**
 * Monthly attribution report sent to each active B2B directory subscriber.
 * Shows phone clicks, website visits, and inquiry submissions their listing
 * generated in the last `windowDays` days. Fires from the attribution-proof cron.
 */
export async function sendAttributionProofEmail(opts: AttributionProofEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';
  const total = opts.phoneClicks + opts.websiteClicks + opts.inquirySubmits;
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const tierLabel =
    opts.tierSlug === 'signature'
      ? 'Signature Partner'
      : opts.tierSlug === 'featured'
      ? 'Featured Listing'
      : 'Verified Listing';

  const subject =
    total > 0
      ? `Your Hilton Ahead listing: ${total} interaction${total === 1 ? '' : 's'} in the last ${opts.windowDays} days`
      : `Your Hilton Ahead listing — monthly report for ${month}`;

  const renewalLine = opts.renewalDate
    ? `<p style="font-size:12px;color:#9CA3AF;margin:20px 0 0;">
        Subscription renews ${new Date(opts.renewalDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} — cancel any time before then at
        <a href="${siteUrl}/business/portal" style="color:#6B7280;">your portal</a>.
       </p>`
    : '';

  const zeroNote =
    total === 0
      ? `<p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 20px;">
          No interactions were recorded this period. This can happen when a listing is
          newly published or the directory is still building traffic in this category.
          We'll keep your listing live and report again next month.
         </p>`
      : '';

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A2930;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:14px;">
      ${esc(tierLabel)} · hiltonahead.com/local
    </div>

    <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.1;color:#0A2930;margin:0 0 8px 0;letter-spacing:-0.02em;">
      ${esc(opts.businessName)}
    </h1>
    <p style="font-size:14px;color:#6B7280;margin:0 0 28px 0;">
      Last ${opts.windowDays} days · ${esc(month)}
    </p>

    ${zeroNote}

    <!-- Stats -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;margin-bottom:28px;">
      <tr>
        <td style="width:33%;padding-right:8px;">
          <div style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;">${opts.phoneClicks}</div>
            <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Phone clicks</div>
          </div>
        </td>
        <td style="width:33%;padding:0 4px;">
          <div style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;">${opts.websiteClicks}</div>
            <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Website visits</div>
          </div>
        </td>
        <td style="width:33%;padding-left:8px;">
          <div style="background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:8px;padding:16px 12px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:34px;line-height:1;color:#0A2930;">${opts.inquirySubmits}</div>
            <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6B7280;margin-top:6px;">Inquiries</div>
          </div>
        </td>
      </tr>
    </table>

    ${
      total > 0
        ? `<p style="font-size:15px;line-height:1.7;color:#3D5860;margin:0 0 24px 0;">
            That's <strong style="color:#0A2930;">${total} conversation${total === 1 ? '' : 's'}</strong>
            that started on your Hilton Ahead listing — travelers actively planning
            a trip to the island who reached out to you directly.
           </p>`
        : ''
    }

    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/business/portal"
         style="display:inline-block;background:#0A2930;color:#F5E8D0;padding:13px 26px;font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;border-radius:999px;">
        View your portal →
      </a>
    </div>

    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.15);margin:28px 0 20px;" />

    <p style="font-size:14px;line-height:1.7;color:#3D5860;margin:0 0 8px 0;">
      Reply to this email with any questions — it goes straight to William.
    </p>
    <p style="font-size:14px;color:#3D5860;margin:0;">
      — William Griffith<br/>
      <span style="font-size:12px;color:#6B7280;">Founder, Hilton Ahead Travel Co.</span>
    </p>

    ${renewalLine}

    <p style="font-size:11px;color:#9CA3AF;margin:24px 0 0;">
      You're receiving this because your business is listed on
      hiltonahead.com/local/${esc(opts.businessSlug)}.
    </p>
  </div>
</body>
</html>`;

  const text = [
    `${opts.businessName} — Hilton Ahead listing report`,
    `Last ${opts.windowDays} days · ${month}`,
    ``,
    `Phone clicks:   ${opts.phoneClicks}`,
    `Website visits: ${opts.websiteClicks}`,
    `Inquiries:      ${opts.inquirySubmits}`,
    `Total:          ${total}`,
    ``,
    total > 0
      ? `That's ${total} conversation${total === 1 ? '' : 's'} that started on your Hilton Ahead listing.`
      : `No interactions recorded this period — we'll report again next month.`,
    ``,
    `View your portal: ${siteUrl}/business/portal`,
    ``,
    `— William Griffith, Hilton Ahead Travel Co.`,
    opts.renewalDate
      ? `Renews ${new Date(opts.renewalDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} — cancel any time at ${siteUrl}/business/portal`
      : ``,
  ]
    .filter((l) => l !== null && l !== undefined)
    .join('\n');

  return sendEmail({
    to: opts.to,
    subject,
    html,
    text,
    replyTo: 'hiltonahead@gmail.com',
    tags: [
      { name: 'type', value: 'attribution_proof' },
      { name: 'tier', value: opts.tierSlug },
    ],
  });
}

// ---------------------------------------------------------------------------
// B8 — Churn-risk report (admin internal)
// ---------------------------------------------------------------------------

export interface ChurnRiskBusiness {
  name: string;
  slug: string;
  industrySlug: string;
  tier: string;
  priorCount: number;
  currentCount: number;
  changePct: number; // negative = decline
}

export interface ChurnRiskReportEmail {
  /** Period label shown in subject, e.g. "May 2026" */
  monthLabel: string;
  atRisk: ChurnRiskBusiness[];
  totalPaidSubscribers: number;
}

export async function sendChurnRiskReport(opts: ChurnRiskReportEmail) {
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) return { ok: false as const, skipped: true as const };

  const { monthLabel, atRisk, totalPaidSubscribers } = opts;

  const subject =
    atRisk.length === 0
      ? `Directory health: all ${totalPaidSubscribers} paid subscribers stable — ${monthLabel}`
      : `⚠ ${atRisk.length} of ${totalPaidSubscribers} paid directory subscribers at churn risk — ${monthLabel}`;

  const rowsHtml = atRisk
    .map((b) => {
      const arrow = b.changePct <= -50 ? '🔴' : '🟡';
      const pct = `${b.changePct > 0 ? '+' : ''}${b.changePct}%`;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;font-weight:600;color:#0E2A38;">${b.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;color:#5C7A8A;font-size:12px;">${b.tier}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;text-align:center;color:#5C7A8A;">${b.priorCount}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;text-align:center;color:#5C7A8A;">${b.currentCount}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;text-align:center;font-weight:700;color:#C0392B;">${arrow} ${pct}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E8DCC8;">
            <a href="https://www.hiltonahead.com/local/${b.industrySlug}#${b.slug}" style="color:#0F7080;font-size:12px;">View listing</a>
          </td>
        </tr>`;
    })
    .join('');

  const noRiskHtml = `
    <p style="color:#5C7A8A;font-size:14px;margin-top:16px;">
      All ${totalPaidSubscribers} paid subscribers show stable or growing engagement this month. No action required.
    </p>`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:Georgia,serif;">
  <div style="max-width:680px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8A7A6A;margin:0 0 24px;">
      Hilton Ahead · Directory Health Report
    </p>
    <h1 style="font-size:22px;font-weight:400;color:#0E2A38;margin:0 0 8px;">
      ${atRisk.length > 0 ? `${atRisk.length} subscriber${atRisk.length > 1 ? 's' : ''} at churn risk` : 'All subscribers stable'}
    </h1>
    <p style="font-size:13px;color:#5C7A8A;margin:0 0 28px;">${monthLabel} · ${totalPaidSubscribers} paid subscribers monitored</p>

    ${
      atRisk.length > 0
        ? `<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;font-size:13px;">
            <thead>
              <tr style="background:#0E2A38;color:#F5E8D0;">
                <th style="padding:10px 12px;text-align:left;font-weight:600;letter-spacing:0.06em;">Business</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;letter-spacing:0.06em;">Tier</th>
                <th style="padding:10px 12px;text-align:center;font-weight:600;letter-spacing:0.06em;">Prior 30d</th>
                <th style="padding:10px 12px;text-align:center;font-weight:600;letter-spacing:0.06em;">Current 30d</th>
                <th style="padding:10px 12px;text-align:center;font-weight:600;letter-spacing:0.06em;">Change</th>
                <th style="padding:10px 12px;font-weight:600;letter-spacing:0.06em;"></th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <p style="font-size:12px;color:#8A7A6A;margin-top:16px;">
            Threshold: ≥30% drop in directory events (phone clicks + website clicks + inquiries) vs the prior 30 days.
            Reach out before their renewal date to pre-empt cancellation.
          </p>`
        : noRiskHtml
    }

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #E8DCC8;">
      <a href="https://www.hiltonahead.com/admin/directory"
         style="display:inline-block;background:#0E2A38;color:#F5E8D0;padding:10px 20px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:999px;">
        Open directory admin →
      </a>
    </div>
  </div>
</body>
</html>`;

  const text = atRisk.length === 0
    ? `All ${totalPaidSubscribers} paid directory subscribers are stable for ${monthLabel}.`
    : [
        `CHURN RISK REPORT — ${monthLabel}`,
        `${atRisk.length} of ${totalPaidSubscribers} paid subscribers show declining engagement.\n`,
        ...atRisk.map(
          (b) => `• ${b.name} (${b.tier}) — prior: ${b.priorCount}, current: ${b.currentCount} (${b.changePct}%)`
        ),
        '\nhttps://www.hiltonahead.com/admin/directory',
      ].join('\n');

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [{ name: 'type', value: 'churn_risk_report' }],
  });
}

// ---------------------------------------------------------------------------
// E1 — Info product delivery (Workstream E)
// ---------------------------------------------------------------------------

export interface InfoProductDeliveryEmail {
  customerEmail: string;
  customerName: string | null;
  tierSlug: string;
  productName: string;
  /** Resolved from DOWNLOAD_URL_ITINERARY_PACK_COUPLES / _GOLF env vars */
  downloadUrl: string | null;
}

/**
 * Send the post-purchase delivery email for a digital itinerary pack.
 *
 * If `downloadUrl` is null (env var not set yet), sends a "coming soon"
 * email and notifies the operator — this allows the checkout to work
 * before the real PDF is ready.
 *
 * Env vars required per product:
 *   DOWNLOAD_URL_ITINERARY_PACK_COUPLES  — direct URL to couples PDF
 *   DOWNLOAD_URL_ITINERARY_PACK_GOLF     — direct URL to golf PDF
 */
export async function sendInfoProductDelivery(opts: InfoProductDeliveryEmail) {
  const { customerEmail, customerName, productName, downloadUrl } = opts;

  const firstName = customerName?.split(' ')[0] ?? 'there';

  const subject = downloadUrl
    ? `Your ${productName} is ready to download`
    : `Your ${productName} — download arriving shortly`;

  const downloadBlock = downloadUrl
    ? `
    <div style="margin:32px 0;text-align:center;">
      <a href="${downloadUrl}"
         style="display:inline-block;background:#C44A2B;color:#F5E8D0;padding:16px 36px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:999px;">
        Download your PDF →
      </a>
    </div>
    <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:-12px;">
      Link: <a href="${downloadUrl}" style="color:#0F7080;">${downloadUrl}</a>
    </p>`
    : `
    <div style="margin:32px 0;padding:20px;background:#FBF3E2;border:1px solid rgba(10,41,48,0.1);border-radius:12px;text-align:center;">
      <p style="color:#0A2930;font-size:14px;line-height:1.6;margin:0;">
        Your PDF is being prepared and will arrive in a separate email within the next few minutes.
        If it doesn't appear, please email us at <a href="mailto:hello@hiltonahead.com" style="color:#0F7080;">hello@hiltonahead.com</a>
        and we'll send it immediately.
      </p>
    </div>`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F5E8D0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;margin-bottom:8px;">
      Hilton Ahead · Your purchase
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#0A2930;margin:0 0 16px 0;letter-spacing:-0.02em;">
      Hi ${esc(firstName)}, your guide is ready.
    </h1>
    <p style="font-size:15px;line-height:1.7;color:#3D5A6A;margin:0 0 8px 0;">
      Thank you for purchasing the <strong>${esc(productName)}</strong>.
      ${downloadUrl ? 'Click the button below to download your PDF.' : ''}
    </p>
    ${downloadBlock}
    <hr style="border:0;border-top:1px solid rgba(10,41,48,0.12);margin:32px 0;" />
    <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:0 0 16px 0;">
      Questions? Just reply to this email or reach us at
      <a href="mailto:hello@hiltonahead.com" style="color:#0F7080;">hello@hiltonahead.com</a>.
      We&apos;re a small team and we actually read every message.
    </p>
    <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:0;">
      Want a fully custom itinerary built around your exact dates?
      <a href="https://www.hiltonahead.com/services" style="color:#0F7080;">See our consulting services →</a>
    </p>
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(10,41,48,0.08);">
      <p style="font-size:11px;color:#9CA3AF;margin:0;">
        Hilton Ahead · Hilton Head Island travel specialists<br />
        <a href="https://www.hiltonahead.com" style="color:#9CA3AF;">hiltonahead.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = downloadUrl
    ? [
        `Hi ${firstName},`,
        ``,
        `Your ${productName} is ready. Download it here:`,
        `${downloadUrl}`,
        ``,
        `Questions? Reply to this email or contact hello@hiltonahead.com.`,
        ``,
        `— Hilton Ahead`,
      ].join('\n')
    : [
        `Hi ${firstName},`,
        ``,
        `Thank you for purchasing the ${productName}.`,
        `Your PDF is being prepared and will arrive shortly.`,
        `If you don't receive it within a few minutes, email hello@hiltonahead.com.`,
        ``,
        `— Hilton Ahead`,
      ].join('\n');

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    text,
    tags: [{ name: 'type', value: 'info_product_delivery' }],
  });
}

/** Resolve download URL for an info-product tier slug. */
export function resolveDownloadUrl(tierSlug: string): string | null {
  const map: Record<string, string> = {
    'itinerary-pack-couples':
      process.env.DOWNLOAD_URL_ITINERARY_PACK_COUPLES ?? '',
    'itinerary-pack-golf':
      process.env.DOWNLOAD_URL_ITINERARY_PACK_GOLF ?? '',
  };
  return map[tierSlug] || null;
}

/**
 * Notify the operator that a fresh batch of social drafts is ready (or that
 * the generator ran with failures). Soft-fail: never throws — generator must
 * not be killed by an email outage.
 */
export async function notifyAdminSocialQueue(opts: {
  generated: number;
  failed: number;
  costUsd: number;
  baseUrl: string;
}): Promise<void> {
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) return;

  const total = opts.generated + opts.failed;
  const subject = opts.failed > 0
    ? `[social] ${opts.generated}/${total} drafts ready (${opts.failed} failed)`
    : `[social] ${opts.generated} drafts ready for review`;

  const queueUrl = `${opts.baseUrl}/admin/social`;
  const html = `
    <p>${opts.generated} draft${opts.generated === 1 ? '' : 's'} generated.</p>
    ${opts.failed > 0 ? `<p><strong>${opts.failed} failed</strong> — see queue for details.</p>` : ''}
    <p>Generator cost: $${opts.costUsd.toFixed(4)}</p>
    <p><a href="${queueUrl}">Open the queue →</a></p>
  `;
  const text = `${subject}\nGenerator cost: $${opts.costUsd.toFixed(4)}\nQueue: ${queueUrl}`;

  try {
    await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error('[social.email] notifyAdminSocialQueue failed', err);
  }
}
