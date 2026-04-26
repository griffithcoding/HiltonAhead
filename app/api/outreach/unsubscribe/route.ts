import { NextRequest } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/outreach/compliance';
import { createServiceClient } from '@/utils/supabase/service';

// ============================================================================
// One-click unsubscribe handler.
//
// CAN-SPAM compliance: any recipient of an outreach email can click the
// unsub link in the footer to opt out. This route MUST be public (no auth)
// and MUST honor the request immediately.
//
// URL pattern: /api/outreach/unsubscribe?c=<contact_uuid>&t=<hmac_token>
//
// On success, sets outreach_contacts.opted_out = true and renders a small
// confirmation page (text/html so it works in any browser preview).
// ============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function htmlPage(title: string, message: string, ok: boolean): Response {
  const color = ok ? '#16604a' : '#a14133';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Hilton Ahead</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      background: #faf6ee; color: #1f2933;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; padding: 32px;
    }
    .card {
      max-width: 480px; background: #fff;
      border: 1px solid #d6dde5; border-radius: 8px;
      padding: 36px 32px; text-align: center;
    }
    h1 { font-size: 22px; margin: 0 0 12px; color: ${color}; }
    p  { font-size: 14px; line-height: 1.6; color: #4a5562; margin: 0 0 12px; }
    a  { color: #0d6e6c; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <p><a href="https://hiltonahead.com">Hilton Ahead — local Hilton Head Island travel consulting</a></p>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const contactId = url.searchParams.get('c') ?? '';
  const token = url.searchParams.get('t') ?? '';

  if (!contactId || !token) {
    return htmlPage(
      'Invalid link',
      'This unsubscribe link is missing required information. If you received an email from us and would like to opt out, please reply with the word "unsubscribe" and we will honor it manually.',
      false,
    );
  }

  // Constant-time HMAC verification
  const valid = verifyUnsubscribeToken(contactId, token);
  if (!valid) {
    return htmlPage(
      'Link expired',
      'This unsubscribe link is no longer valid. If you would like to opt out, please reply to any email from us with the word "unsubscribe" and we will remove you immediately.',
      false,
    );
  }

  // Mark opted_out (uses service role to bypass admin-only RLS — this
  // endpoint is intentionally public and CAN-SPAM-required.)
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('outreach_contacts')
    .update({
      opted_out: true,
      opted_out_at: new Date().toISOString(),
    })
    .eq('id', contactId);

  if (error) {
    return htmlPage(
      'Could not process',
      'Something went wrong on our end. Please reply to any email from us with the word "unsubscribe" and we will remove you immediately.',
      false,
    );
  }

  // Best-effort: log to activity timeline against any active opportunities
  // for this contact. Failure here is non-fatal.
  await supabase
    .from('outreach_opportunities')
    .select('id')
    .eq('contact_id', contactId)
    .then(async ({ data: opps }) => {
      if (!opps || opps.length === 0) return;
      const rows = opps.map((o) => ({
        opportunity_id: o.id,
        contact_id: contactId,
        kind: 'note' as const,
        actor_email: 'system',
        body: 'Contact unsubscribed via one-click link.',
      }));
      await supabase.from('outreach_activity').insert(rows);
    });

  return htmlPage(
    'You are unsubscribed.',
    'We will not email you again from this list. Thanks for letting us know.',
    true,
  );
}
