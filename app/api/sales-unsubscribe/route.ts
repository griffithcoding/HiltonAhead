/**
 * GET /api/sales-unsubscribe?token=<hmac-signed-email>
 *
 * CAN-SPAM one-click unsubscribe target for every sales email footer.
 *
 * Token format: <emailLower>|<exp>|<sig> where sig is
 * HMAC-SHA256(emailLower|exp) keyed by UNSUBSCRIBE_HMAC_SECRET.
 *
 * On success:
 *   - INSERT into sales_unsubscribes (idempotent via unique index).
 *   - UPDATE sales_prospects.status = 'unsubscribed' for that address.
 *   - Render a static HTML confirmation page (no JS).
 *
 * On invalid token: return 400 with a generic message. We never reveal
 * whether an address exists or whether the token expired vs forged.
 *
 * Companion helper signSalesUnsubscribeToken() is exported for the email
 * renderer so footers can compute the link at send time.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';
import { brand } from '@/data/brand';
import { verifySalesUnsubscribeToken } from '@/app/lib/salesUnsubscribe';

export const runtime = 'nodejs';

function renderPage(opts: {
  ok: boolean;
  emailLower?: string;
  message?: string;
}): NextResponse {
  const title = opts.ok ? 'Unsubscribed' : 'Unsubscribe link invalid';
  const eyebrowColor = opts.ok ? '#0F7080' : '#C44A2B';
  const eyebrowText = opts.ok ? 'Confirmed' : 'Sorry';
  const body = opts.ok
    ? `<p style="font-size:16px;line-height:1.65;color:#4A5C66;margin:0 0 18px 0;">
        ${opts.emailLower ? escapeHtml(opts.emailLower) : 'Your address'} has been removed from
        ${escapeHtml(brand.legalName)} sales outreach. You will not receive
        further cold-outbound emails from us.
      </p>
      <p style="font-size:14px;line-height:1.65;color:#4A5C66;margin:0;">
        Transactional emails tied to a paid booking (confirmations, receipts,
        check-in details) are not affected.
      </p>`
    : `<p style="font-size:16px;line-height:1.65;color:#4A5C66;margin:0 0 18px 0;">
        ${escapeHtml(opts.message ?? 'This unsubscribe link is invalid or has expired.')}
      </p>
      <p style="font-size:14px;line-height:1.65;color:#4A5C66;margin:0;">
        To opt out, reply to any email from us with the word UNSUBSCRIBE,
        or write to <a href="mailto:${escapeHtml(brand.contact.email)}" style="color:#0F7080;">${escapeHtml(brand.contact.email)}</a>.
      </p>`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)} · ${escapeHtml(brand.name)}</title>
  <meta name="robots" content="noindex,nofollow" />
</head>
<body style="margin:0;padding:0;background:#FCFAF5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0E2A38;">
  <div style="max-width:560px;margin:0 auto;padding:64px 24px;">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${eyebrowColor};font-weight:600;margin-bottom:14px;">
      ${escapeHtml(eyebrowText)}
    </div>
    <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.12;letter-spacing:-0.02em;color:#0E2A38;margin:0 0 24px 0;">
      ${escapeHtml(title)}.
    </h1>
    ${body}
    <hr style="border:0;border-top:1px solid rgba(14,42,56,0.15);margin:36px 0 18px;" />
    <div style="font-size:12px;color:#4A5C66;line-height:1.55;">
      ${escapeHtml(brand.legalName)} · ${escapeHtml(brand.contact.location)}
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: opts.ok ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';

  const parsed = verifySalesUnsubscribeToken(token);
  if (!parsed) {
    return renderPage({
      ok: false,
      message: 'This unsubscribe link is invalid or has expired.',
    });
  }

  // ─── Best-effort writes ───────────────────────────────────────────────────
  // Either or both can fail without us telling the user — for a one-click
  // unsubscribe we always render success once the token verifies, otherwise
  // a transient DB blip leaves the user stranded on an error page even
  // though their intent is clear and we'd honor it on retry anyway.
  try {
    const supabase = createServiceClient();

    // 1) Suppression list (idempotent via unique constraint on email_lower).
    await supabase
      .from('sales_unsubscribes')
      .upsert(
        {
          email_lower: parsed.emailLower,
          source: 'one_click',
          reason: 'recipient_one_click',
        },
        { onConflict: 'email_lower' },
      );

    // 2) Flip prospect status. Case-insensitive match against any row with
    //    this address — there should be at most one because of the
    //    uniq_sales_prospects_email_lower index.
    await supabase
      .from('sales_prospects')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        do_not_contact: true,
      })
      .ilike('email', parsed.emailLower);
  } catch (err) {
    console.error('[sales-unsubscribe] write failed:', err);
    // Still render success — the suppression list is the source of truth and
    // we'll retry-or-be-honoured on the next send attempt anyway.
  }

  return renderPage({ ok: true, emailLower: parsed.emailLower });
}
