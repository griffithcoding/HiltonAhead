/**
 * Send a rendered newsletter issue to all active subscribers.
 *
 * Uses Resend's batch endpoint (max 100 emails per call, ~10 calls/sec
 * sustained). Each per-recipient send substitutes the {{UNSUBSCRIBE_URL}}
 * placeholder with that subscriber's unique token-signed URL, and adds
 * the List-Unsubscribe + List-Unsubscribe-Post headers (Gmail/Yahoo
 * 2024 bulk-sender requirement).
 *
 * Sending domain is configured via env:
 *   NEWSLETTER_FROM_EMAIL — preferred, e.g. "Hilton Ahead Insider Letter <newsletter@hiltonahead.com>"
 *   RESEND_FROM_EMAIL     — fallback (used by transactional helpers in app/lib/email.ts)
 *   onboarding@resend.dev — final fallback for local dev only
 */

import { Resend } from 'resend';
import type { ActiveSubscriber } from './subscribers';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hiltonahead.com';

const REPLY_TO = process.env.RESEND_TO_EMAIL || 'hiltonahead@gmail.com';

const BATCH_SIZE = 100;

export interface SendIssueResult {
  attempted: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured.');
  return new Resend(key);
}

function getFromAddress(): string {
  return (
    process.env.NEWSLETTER_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    'Hilton Ahead Insider Letter <onboarding@resend.dev>'
  );
}

function buildUnsubUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?t=${encodeURIComponent(token)}`;
}

/**
 * Per-recipient render: substitute the unsubscribe placeholder once
 * per email so each subscriber gets a unique, single-purpose token.
 */
function personalize({
  htmlTemplate,
  textTemplate,
  unsubUrl,
}: {
  htmlTemplate: string;
  textTemplate: string;
  unsubUrl: string;
}): { html: string; text: string } {
  const html = htmlTemplate.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubUrl);
  const text = textTemplate.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubUrl);
  return { html, text };
}

/**
 * Send the issue to every recipient in `subscribers`.
 *
 * Errors are accumulated, not thrown. The caller (the decide route)
 * decides whether to mark the issue 'sent' or 'failed' based on
 * succeeded vs failed counts.
 */
export async function sendIssueToSubscribers({
  subscribers,
  subject,
  htmlTemplate,
  textTemplate,
}: {
  subscribers: ActiveSubscriber[];
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
}): Promise<SendIssueResult> {
  const result: SendIssueResult = {
    attempted: subscribers.length,
    succeeded: 0,
    failed: 0,
    errors: [],
  };
  if (subscribers.length === 0) return result;

  const client = getClient();
  const from = getFromAddress();

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const chunk = subscribers.slice(i, i + BATCH_SIZE);

    const payload = chunk.map((sub) => {
      const unsubUrl = buildUnsubUrl(sub.unsubscribe_token);
      const { html, text } = personalize({
        htmlTemplate,
        textTemplate,
        unsubUrl,
      });
      return {
        from,
        to: [sub.email],
        subject,
        html,
        text,
        replyTo: REPLY_TO,
        headers: {
          'List-Unsubscribe': `<${unsubUrl}>, <mailto:unsubscribe@hiltonahead.com>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        tags: [{ name: 'type', value: 'newsletter_issue' }],
      };
    });

    try {
      const { error } = await client.batch.send(payload);
      if (error) {
        result.failed += chunk.length;
        result.errors.push(
          `Batch [${i}–${i + chunk.length - 1}]: ${error.message ?? 'unknown error'}`,
        );
      } else {
        result.succeeded += chunk.length;
      }
    } catch (err) {
      result.failed += chunk.length;
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Batch [${i}–${i + chunk.length - 1}] threw: ${msg}`);
    }
  }

  return result;
}
