/**
 * Newsletter approval / rejection magic-link handler.
 *
 * Owner clicks "Approve & send" or "Reject" in the approval email.
 * Both buttons hit this route with `?id=<issueId>&t=<token>`.
 *
 * On approve: flip status to 'sending', load all active subscribers,
 *             send via Resend Batch API, mark 'sent' or 'failed'.
 * On reject:  flip status to 'rejected'. No send.
 *
 * Replay protection: the issue must be in `status = 'pending_approval'`.
 * A second click on either link is a no-op once the issue has progressed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyApprovalToken } from '@/app/lib/newsletter/sign';
import { createServiceClient } from '@/utils/supabase/service';
import { listActiveSubscribers } from '@/app/lib/newsletter/subscribers';
import { sendIssueToSubscribers } from '@/app/lib/newsletter/send';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const issueId = url.searchParams.get('id');
  const token = url.searchParams.get('t');

  if (!issueId || !token) {
    return htmlResponse('Missing parameters.', 400);
  }

  const payload = verifyApprovalToken(token);
  if (!payload || payload.issueId !== issueId) {
    return htmlResponse('This approval link is invalid or expired.', 401);
  }

  const supabase = createServiceClient();

  // Load issue.
  const { data: issue, error: loadErr } = await supabase
    .from('newsletter_issues')
    .select('id, status, subject, body_html, body_text, issue_date')
    .eq('id', issueId)
    .maybeSingle();

  if (loadErr) {
    console.error('[decide] load error:', loadErr);
    return htmlResponse(
      'Could not load this issue. Try again or check the database.',
      500,
    );
  }
  if (!issue) {
    return htmlResponse('Issue not found.', 404);
  }
  if (issue.status !== 'pending_approval') {
    return htmlResponse(
      `This issue has already been ${issue.status}. No further action will be taken.`,
      200,
    );
  }

  // ——— Reject: flip status, done. ————————————————————————————————
  if (payload.action === 'reject') {
    const { error: rejErr } = await supabase
      .from('newsletter_issues')
      .update({ status: 'rejected' })
      .eq('id', issueId)
      .eq('status', 'pending_approval');

    if (rejErr) {
      console.error('[decide] reject update failed:', rejErr);
      return htmlResponse('Could not mark rejected. Try again.', 500);
    }
    return htmlResponse(
      'Issue rejected. It will not be sent to subscribers.',
      200,
    );
  }

  // ——— Approve: flip to 'sending', then run the send. ——————————————
  const { data: updRow, error: updErr } = await supabase
    .from('newsletter_issues')
    .update({ status: 'sending' })
    .eq('id', issueId)
    .eq('status', 'pending_approval')
    .select('id')
    .maybeSingle();

  if (updErr) {
    console.error('[decide] sending update failed:', updErr);
    return htmlResponse('Could not start send.', 500);
  }
  if (!updRow) {
    // Race — someone else already moved it. Treat as no-op.
    return htmlResponse(
      'This issue has already been processed. No action taken.',
      200,
    );
  }

  // Load subscribers.
  let subscribers: Awaited<ReturnType<typeof listActiveSubscribers>>;
  try {
    subscribers = await listActiveSubscribers();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase
      .from('newsletter_issues')
      .update({ status: 'failed', send_error: `subscriber_load: ${msg}` })
      .eq('id', issueId);
    return htmlResponse(
      `Could not load subscribers: ${msg}. Issue marked failed.`,
      500,
    );
  }

  // Run the Resend Batch send.
  const sendResult = await sendIssueToSubscribers({
    subscribers,
    subject: issue.subject as string,
    htmlTemplate: issue.body_html as string,
    textTemplate: issue.body_text as string,
  });

  // Final state.
  const allSucceeded = sendResult.failed === 0;
  const someSucceeded = sendResult.succeeded > 0;
  const finalStatus = allSucceeded
    ? 'sent'
    : someSucceeded
      ? 'sent' // partial success still counts as sent; details in send_error
      : 'failed';

  await supabase
    .from('newsletter_issues')
    .update({
      status: finalStatus,
      sent_at: someSucceeded ? new Date().toISOString() : null,
      recipient_count: sendResult.succeeded,
      send_error:
        sendResult.errors.length > 0
          ? sendResult.errors.join('\n').slice(0, 1000)
          : null,
    })
    .eq('id', issueId);

  if (allSucceeded) {
    return htmlResponse(
      `Sent to ${sendResult.succeeded} subscriber${sendResult.succeeded === 1 ? '' : 's'}.`,
      200,
    );
  }
  if (someSucceeded) {
    return htmlResponse(
      `Sent to ${sendResult.succeeded}, failed for ${sendResult.failed}. Check Resend dashboard for details.`,
      200,
    );
  }
  return htmlResponse(
    `Send failed for all ${sendResult.failed} recipients. Check Resend dashboard.`,
    500,
  );
}

// ——— minimal styled HTML response —————————————————————————————————

function htmlResponse(message: string, status: number): NextResponse {
  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Insider Letter — Approval</title></head>
<body style="margin:0;padding:0;background:#F5E8D0;color:#0A2930;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:80px 24px;">
    <div style="background:#fff;padding:36px;border:1px solid rgba(10,41,48,0.15);">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C44A2B;font-weight:600;">
        The Insider Letter
      </div>
      <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.25;margin:12px 0 16px 0;color:#0A2930;">
        ${esc(message)}
      </h1>
      <p style="font-size:13px;line-height:1.7;color:#3D5860;margin:0;">
        You can close this tab.
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
