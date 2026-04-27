import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/utils/supabase/service';
import { listActiveSubscribers } from '@/app/lib/newsletter/subscribers';
import {
  rejectAction,
  sendTestAction,
  sendToAllAction,
} from '../actions';

export const dynamic = 'force-dynamic';

type IssueDetail = {
  id: string;
  issue_date: string;
  subject: string;
  body_html: string;
  body_text: string;
  status: string;
  recipient_count: number | null;
  sent_at: string | null;
  send_error: string | null;
  created_at: string;
  topics_json: { ad_hoc?: boolean; composed_by?: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending_approval: 'Draft (pending)',
  approved: 'Approved',
  sending: 'Sending…',
  sent: 'Sent',
  rejected: 'Rejected',
  failed: 'Failed',
};

export default async function IssueDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ issueId: string }>;
  searchParams: Promise<{ test?: string; sent?: string; failed?: string }>;
}) {
  const { issueId } = await params;
  const sp = await searchParams;

  const supabase = createServiceClient();
  const { data: issue } = await supabase
    .from('newsletter_issues')
    .select(
      'id, issue_date, subject, body_html, body_text, status, recipient_count, sent_at, send_error, created_at, topics_json',
    )
    .eq('id', issueId)
    .maybeSingle();

  if (!issue) notFound();
  const i = issue as IssueDetail;

  // Subscribers count for the send button confirmation copy.
  const subscribers = await listActiveSubscribers().catch(() => []);
  const subsCount = subscribers.length;

  const canSend = i.status === 'pending_approval';
  const isAdHoc = i.topics_json?.ad_hoc === true;

  // Render preview body — replace placeholder so the unsubscribe link
  // shows as a real-looking URL inside the iframe preview.
  const previewHtml = i.body_html.replace(
    /\{\{UNSUBSCRIBE_URL\}\}/g,
    'https://www.hiltonahead.com/api/newsletter/unsubscribe?t=preview',
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/newsletter"
          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
        >
          ← All issues
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="rounded-sm bg-sand-deep/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink">
              {STATUS_LABEL[i.status] || i.status}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              {isAdHoc ? 'Ad-hoc' : 'Weekly cron'} · {i.issue_date}
            </span>
          </div>
          <h1 className="display mt-3 text-[26px] leading-[1.15] text-ink md:text-[30px]">
            {i.subject}
          </h1>
        </div>
      </div>

      {/* Status banners */}
      {sp.test === 'sent' && (
        <Banner tone="emerald">
          Test sent. Check your inbox — Resend tags it `newsletter_test` so it
          should thread separately.
        </Banner>
      )}
      {sp.sent && (
        <Banner tone="emerald">
          Sent to {sp.sent} subscriber{sp.sent === '1' ? '' : 's'}
          {sp.failed && Number(sp.failed) > 0
            ? ` (${sp.failed} failed — check Resend dashboard)`
            : ''}
          .
        </Banner>
      )}
      {i.status === 'failed' && i.send_error && (
        <Banner tone="coral">
          <strong>Send failed.</strong>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px]">
            {i.send_error}
          </pre>
        </Banner>
      )}
      {i.status === 'sent' && (
        <Banner tone="emerald">
          Already sent to {i.recipient_count ?? 0} subscriber
          {i.recipient_count === 1 ? '' : 's'}
          {i.sent_at
            ? ` on ${new Date(i.sent_at).toLocaleString('en-US')}`
            : ''}
          .
        </Banner>
      )}

      {/* Action panel */}
      {canSend && (
        <div className="mt-8 rounded-sm border border-ocean-deep/15 bg-sand p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
            Send controls
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Test send */}
            <form action={sendTestAction}>
              <input type="hidden" name="issueId" value={i.id} />
              <button
                type="submit"
                className="w-full rounded-sm border border-ocean-deep/20 bg-sand-soft px-4 py-3 text-left text-[13px] hover:border-coral hover:bg-coral/5"
              >
                <div className="font-semibold text-ink">
                  Send test → me
                </div>
                <div className="mt-1 text-[12px] text-ink-soft">
                  One copy to your admin email. Subject prefixed [TEST].
                </div>
              </button>
            </form>

            {/* Reject */}
            <form action={rejectAction}>
              <input type="hidden" name="issueId" value={i.id} />
              <button
                type="submit"
                className="w-full rounded-sm border border-ocean-deep/20 bg-sand-soft px-4 py-3 text-left text-[13px] hover:border-coral hover:bg-coral/5"
              >
                <div className="font-semibold text-ink">Reject draft</div>
                <div className="mt-1 text-[12px] text-ink-soft">
                  Marks rejected. Won't ever send. Doesn't delete the row.
                </div>
              </button>
            </form>
          </div>

          {/* Send-to-all is the only destructive action — guarded by
              a confirmation field. */}
          <form
            action={sendToAllAction}
            className="mt-6 rounded-sm border border-coral/30 bg-coral/5 p-4"
          >
            <input type="hidden" name="issueId" value={i.id} />
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-coral-deep">
              Send to all subscribers
            </div>
            <p className="mt-1 text-[12.5px] text-ink-soft">
              Will deliver via Resend Batch API to{' '}
              <strong>{subsCount.toLocaleString()}</strong> active
              subscriber{subsCount === 1 ? '' : 's'}. This is irreversible.
              Type <code className="rounded-sm bg-sand px-1.5 font-mono">SEND</code>{' '}
              below to enable the button.
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                name="confirm"
                placeholder="Type SEND"
                required
                pattern="SEND"
                className="flex-1 rounded-sm border border-ocean-deep/20 bg-sand-soft px-3 py-2 font-mono text-[13px] text-ink outline-none focus:border-coral"
              />
              <button
                type="submit"
                className="rounded-sm bg-coral px-6 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-sand hover:bg-coral-deep"
              >
                Send to {subsCount.toLocaleString()} →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview */}
      <div className="mt-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
          Subscriber preview
        </div>
        <div className="mt-3 overflow-hidden rounded-sm border border-ocean-deep/15 bg-white">
          <iframe
            title="Issue preview"
            srcDoc={previewHtml}
            sandbox=""
            className="block h-[800px] w-full border-0"
          />
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] text-ink hover:text-coral">
            Plain-text version
          </summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-sm bg-ink/95 p-4 font-mono text-[11px] leading-[1.7] text-sand">
            {i.body_text}
          </pre>
        </details>
      </div>
    </div>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: 'emerald' | 'coral';
  children: React.ReactNode;
}) {
  const cls =
    tone === 'emerald'
      ? 'border-emerald-700/40 bg-emerald-50 text-emerald-900'
      : 'border-coral/40 bg-coral/5 text-coral-deep';
  return (
    <div className={`mt-6 rounded-sm border p-4 text-[13px] ${cls}`}>
      {children}
    </div>
  );
}
