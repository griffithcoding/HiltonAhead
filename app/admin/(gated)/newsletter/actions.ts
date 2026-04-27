'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/utils/supabase/admin';
import { createServiceClient } from '@/utils/supabase/service';
import { renderAdHocIssue } from '@/app/lib/newsletter/render-adhoc';
import { listActiveSubscribers } from '@/app/lib/newsletter/subscribers';
import { sendIssueToSubscribers } from '@/app/lib/newsletter/send';
import { sendEmail } from '@/app/lib/email';

const OWNER_EMAIL =
  process.env.NEWSLETTER_OWNER_EMAIL || 'wgriffith1218@gmail.com';

// ============================================================================
// Compose & save draft
// ============================================================================
export async function createDraftAction(formData: FormData) {
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const subject = (formData.get('subject') as string | null)?.trim() || '';
  const body = (formData.get('body') as string | null) || '';

  if (!subject) throw new Error('Subject is required.');
  if (!body.trim()) throw new Error('Body is required.');

  const issue = renderAdHocIssue({ subject, body });

  const supabase = createServiceClient();
  const issueId = crypto.randomUUID();
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from('newsletter_issues').insert({
    id: issueId,
    issue_date: today,
    subject: issue.subject,
    body_html: issue.html,
    body_text: issue.text,
    topics_json: {
      ad_hoc: true,
      composed_by: auth.admin.email,
      raw_body: body,
    },
    status: 'pending_approval',
    // approval_token is required (not-null), but unused for the admin-UI flow.
    // Stored value is opaque; the UI doesn't read it.
    approval_token: 'admin_ui',
  });

  if (error) {
    if (error.code === '23505') {
      // Unique constraint on issue_date — cron already drafted today's issue.
      // Bump by one day so this ad-hoc compose can coexist.
      const tomorrow = new Date(Date.now() + 86_400_000)
        .toISOString()
        .slice(0, 10);
      const { error: retryErr } = await supabase
        .from('newsletter_issues')
        .insert({
          id: issueId,
          issue_date: tomorrow,
          subject: issue.subject,
          body_html: issue.html,
          body_text: issue.text,
          topics_json: {
            ad_hoc: true,
            composed_by: auth.admin.email,
            raw_body: body,
          },
          status: 'pending_approval',
          approval_token: 'admin_ui',
        });
      if (retryErr) {
        throw new Error(`Could not save draft: ${retryErr.message}`);
      }
    } else {
      throw new Error(`Could not save draft: ${error.message}`);
    }
  }

  revalidatePath('/admin/newsletter');
  redirect(`/admin/newsletter/${issueId}`);
}

// ============================================================================
// Send a test copy to the owner only
// ============================================================================
export async function sendTestAction(formData: FormData) {
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const issueId = formData.get('issueId') as string;
  if (!issueId) throw new Error('Missing issue id.');

  const supabase = createServiceClient();
  const { data: issue, error } = await supabase
    .from('newsletter_issues')
    .select('id, subject, body_html, body_text, status')
    .eq('id', issueId)
    .maybeSingle();

  if (error || !issue) throw new Error('Issue not found.');

  // Replace the placeholder with a fake URL for the test send so the email
  // renders cleanly in the inbox.
  const html = (issue.body_html as string).replace(
    /\{\{UNSUBSCRIBE_URL\}\}/g,
    'https://www.hiltonahead.com/api/newsletter/unsubscribe?t=test',
  );
  const text = (issue.body_text as string).replace(
    /\{\{UNSUBSCRIBE_URL\}\}/g,
    'https://www.hiltonahead.com/api/newsletter/unsubscribe?t=test',
  );

  const result = await sendEmail({
    to: auth.admin.email || OWNER_EMAIL,
    subject: `[TEST] ${issue.subject}`,
    html,
    text,
    tags: [{ name: 'type', value: 'newsletter_test' }],
  });

  if (result.ok === false && !('skipped' in result && result.skipped)) {
    const msg = 'error' in result ? result.error : 'unknown';
    throw new Error(`Test send failed: ${msg}`);
  }

  revalidatePath(`/admin/newsletter/${issueId}`);
  redirect(`/admin/newsletter/${issueId}?test=sent`);
}

// ============================================================================
// Send to all active subscribers
// ============================================================================
export async function sendToAllAction(formData: FormData) {
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const issueId = formData.get('issueId') as string;
  const confirm = formData.get('confirm') as string;

  if (!issueId) throw new Error('Missing issue id.');
  if (confirm !== 'SEND') {
    throw new Error('Type SEND to confirm.');
  }

  const supabase = createServiceClient();

  // Atomic claim: only proceed if status is still pending_approval.
  const { data: claimed, error: claimErr } = await supabase
    .from('newsletter_issues')
    .update({ status: 'sending' })
    .eq('id', issueId)
    .eq('status', 'pending_approval')
    .select('id, subject, body_html, body_text')
    .maybeSingle();

  if (claimErr) throw new Error(`Could not claim issue: ${claimErr.message}`);
  if (!claimed) {
    throw new Error('This issue is already sending or has been sent.');
  }

  const subscribers = await listActiveSubscribers();
  const sendResult = await sendIssueToSubscribers({
    subscribers,
    subject: claimed.subject as string,
    htmlTemplate: claimed.body_html as string,
    textTemplate: claimed.body_text as string,
  });

  const allSucceeded = sendResult.failed === 0;
  const someSucceeded = sendResult.succeeded > 0;
  const finalStatus = allSucceeded || someSucceeded ? 'sent' : 'failed';

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

  revalidatePath('/admin/newsletter');
  revalidatePath(`/admin/newsletter/${issueId}`);
  redirect(
    `/admin/newsletter/${issueId}?sent=${sendResult.succeeded}&failed=${sendResult.failed}`,
  );
}

// ============================================================================
// Reject (discard) a draft
// ============================================================================
export async function rejectAction(formData: FormData) {
  const auth = await getAdminUser();
  if (!auth) redirect('/admin/login');

  const issueId = formData.get('issueId') as string;
  if (!issueId) throw new Error('Missing issue id.');

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('newsletter_issues')
    .update({ status: 'rejected' })
    .eq('id', issueId)
    .eq('status', 'pending_approval');

  if (error) throw new Error(`Could not reject: ${error.message}`);

  revalidatePath('/admin/newsletter');
  redirect('/admin/newsletter');
}
