/**
 * Weekly newsletter cron handler.
 *
 * Schedule: Sunday 13:00 UTC (= 9 AM ET in EDT, 8 AM ET in EST).
 * Configured in vercel.json. Vercel Cron sends a GET with header
 * `Authorization: Bearer <CRON_SECRET>`.
 *
 * Flow:
 *   1. Find the last issue's created_at — used as the "new posts" cutoff.
 *   2. Build a TopicBundle from posts.ts, events.ts, months.ts.
 *   3. Render the issue HTML + text.
 *   4. Insert a row in newsletter_issues with status='pending_approval'.
 *   5. Sign two HMAC tokens (approve, reject), build magic-link URLs.
 *   6. Email the owner with the rendered preview + 2 buttons.
 *   7. Owner clicks one → /api/newsletter/decide takes over.
 *
 * Auth: Bearer token. Required env: CRON_SECRET.
 * If the env is missing or the header doesn't match, returns 401.
 */

import { NextRequest, NextResponse } from 'next/server';
import { selectTopics } from '@/app/lib/newsletter/topic-discovery';
import {
  renderIssue,
  renderApprovalEmail,
} from '@/app/lib/newsletter/render';
import { signApprovalToken } from '@/app/lib/newsletter/sign';
import { listActiveSubscribers } from '@/app/lib/newsletter/subscribers';
import { createServiceClient } from '@/utils/supabase/service';
import { sendEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
// Use the Node runtime — service-role Supabase client + node:crypto need it.
export const runtime = 'nodejs';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

const OWNER_EMAIL =
  process.env.NEWSLETTER_OWNER_EMAIL || 'wgriffith1218@gmail.com';

function isCronAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${expected}`;
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const supabase = createServiceClient();

    // 1) Last issue → cutoff for new posts.
    const { data: lastIssues, error: lastErr } = await supabase
      .from('newsletter_issues')
      .select('created_at, issue_date')
      .order('created_at', { ascending: false })
      .limit(1);

    if (lastErr) {
      throw new Error(`Failed to fetch last issue: ${lastErr.message}`);
    }

    const lastIssueAt =
      lastIssues && lastIssues[0]
        ? new Date(lastIssues[0].created_at as string)
        : undefined;

    // 2) Build topics + 3) render.
    const now = new Date();
    const bundle = selectTopics({ now, lastIssueAt });
    const issue = renderIssue(bundle);

    // 4) Insert issue (with a generated UUID we can reuse for token signing).
    const issueId = crypto.randomUUID();
    const approveToken = signApprovalToken(issueId, 'approve');
    const rejectToken = signApprovalToken(issueId, 'reject');

    const { error: insertErr } = await supabase
      .from('newsletter_issues')
      .insert({
        id: issueId,
        issue_date: bundle.issueDate,
        subject: issue.subject,
        body_html: issue.html,
        body_text: issue.text,
        topics_json: bundle as unknown as Record<string, unknown>,
        status: 'pending_approval',
        approval_token: approveToken,
      });

    if (insertErr) {
      // unique-constraint conflict on issue_date = duplicate cron fire today.
      if (insertErr.code === '23505') {
        return NextResponse.json(
          { ok: true, skipped: 'already_drafted_today' },
          { status: 200 },
        );
      }
      throw new Error(`Failed to insert issue: ${insertErr.message}`);
    }

    // 5) Subscriber count for the approval email body.
    const subscribers = await listActiveSubscribers();
    const recipientCount = subscribers.length;

    // 6) Magic-link URLs (Vercel host).
    const approveUrl = `${SITE_URL}/api/newsletter/decide?id=${issueId}&t=${encodeURIComponent(approveToken)}`;
    const rejectUrl = `${SITE_URL}/api/newsletter/decide?id=${issueId}&t=${encodeURIComponent(rejectToken)}`;

    const approval = renderApprovalEmail({
      bundle,
      issueId,
      approveUrl,
      rejectUrl,
      previewHtml: issue.html,
      recipientCount,
    });

    // 7) Send approval email to owner. Tags it for filtering in Gmail.
    const sendResult = await sendEmail({
      to: OWNER_EMAIL,
      subject: approval.subject,
      html: approval.html,
      text: approval.text,
      tags: [{ name: 'type', value: 'newsletter_approval' }],
    });

    if (
      sendResult.ok === false &&
      !('skipped' in sendResult && sendResult.skipped)
    ) {
      // Real failure — mark issue failed so a stuck pending_approval doesn't
      // accumulate. Owner can re-trigger by deleting and re-running cron.
      await supabase
        .from('newsletter_issues')
        .update({
          status: 'failed',
          send_error:
            'error' in sendResult ? sendResult.error : 'approval_email_failed',
        })
        .eq('id', issueId);
      return NextResponse.json(
        {
          ok: false,
          error: 'approval_email_failed',
          issueId,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      issueId,
      issueDate: bundle.issueDate,
      recipientCount,
      approvalSent: sendResult.ok === true,
      approvalSkipped:
        sendResult.ok === false &&
        'skipped' in sendResult &&
        sendResult.skipped,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[newsletter-draft] error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
