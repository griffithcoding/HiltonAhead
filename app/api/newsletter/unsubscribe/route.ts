/**
 * One-click unsubscribe.
 *
 * Supports both GET (link click in email body) and POST (RFC 8058
 * List-Unsubscribe-Post for Gmail/Yahoo bulk-sender compliance).
 *
 * The token is the per-subscriber `unsubscribe_token` stored in the
 * newsletter_subscribers table — no HMAC needed because the token is
 * already high-entropy random bytes generated server-side.
 */

import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/app/lib/newsletter/subscribers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function handle(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');

  if (!token) {
    return htmlResponse(
      'Missing token. If you clicked an unsubscribe link, copy the full URL into a new tab.',
      400,
    );
  }

  try {
    const matched = await unsubscribeByToken(token);
    if (!matched) {
      return htmlResponse(
        'We couldn’t find that subscription. It may already be removed.',
        404,
      );
    }
    return htmlResponse(
      'You’re unsubscribed. We won’t email you the Insider Letter again.',
      200,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[unsubscribe] error:', msg);
    return htmlResponse(
      'Something went wrong. Please email hiltonahead@gmail.com and we’ll remove you manually.',
      500,
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

function htmlResponse(message: string, status: number): NextResponse {
  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Unsubscribe — Hilton Ahead</title></head>
<body style="margin:0;padding:0;background:#F5E8D0;color:#0A2930;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:80px 24px;">
    <div style="background:#fff;padding:40px;border:1px solid rgba(10,41,48,0.15);">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;">
        The Insider Letter
      </div>
      <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.25;margin:12px 0 16px 0;color:#0A2930;">
        ${esc(message)}
      </h1>
      <p style="font-size:13px;line-height:1.7;color:#3D5860;margin:0;">
        <a href="/" style="color:#C44A2B;text-decoration:underline;">← Back to hiltonahead.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
