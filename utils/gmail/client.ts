/**
 * Gmail API client helpers.
 *
 * Uses the refresh token persisted in `gmail_tokens` by the auth callback
 * to talk to Gmail as the admin. `googleapis` handles token refresh
 * automatically; we persist new access tokens back to the DB so the next
 * server request doesn't have to refresh from scratch.
 *
 * Required env vars:
 *   GOOGLE_OAUTH_CLIENT_ID      — from Google Cloud Console
 *   GOOGLE_OAUTH_CLIENT_SECRET  — from Google Cloud Console
 *
 * These must match the Client ID + Secret you pasted into Supabase's
 * Google provider settings. (They're the same pair.)
 */

import { google } from 'googleapis';
import type { gmail_v1 } from 'googleapis';
import { createClient } from '@/utils/supabase/server';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  date: string;
  isUnread: boolean;
}

export interface GmailThreadSummary {
  id: string;
  snippet: string;
  messages: GmailMessageSummary[];
  latestDate: string;
}

async function getStoredTokens(email: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  return data;
}

async function persistRefreshedAccessToken(
  email: string,
  accessToken: string,
  expiryDate: number | null | undefined,
) {
  const supabase = await createClient();
  await supabase
    .from('gmail_tokens')
    .update({
      access_token: accessToken,
      expires_at: expiryDate
        ? new Date(expiryDate).toISOString()
        : new Date(Date.now() + 3600 * 1000).toISOString(),
    })
    .eq('email', email.toLowerCase());
}

/**
 * Build an authenticated Gmail API client for `adminEmail`.
 * Returns null if we have no stored tokens (user hasn't connected
 * Gmail yet). Callers should treat null as "needs re-auth".
 */
export async function getGmailClient(
  adminEmail: string,
): Promise<gmail_v1.Gmail | null> {
  const tokens = await getStoredTokens(adminEmail);
  if (!tokens?.refresh_token) return null;

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.warn(
      '[gmail] GOOGLE_OAUTH_CLIENT_ID / SECRET not set — cannot refresh tokens.',
    );
    return null;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token ?? undefined,
    expiry_date: tokens.expires_at
      ? new Date(tokens.expires_at).getTime()
      : undefined,
  });

  // Persist new access tokens when googleapis refreshes.
  oauth2.on('tokens', (t) => {
    if (t.access_token) {
      persistRefreshedAccessToken(
        adminEmail,
        t.access_token,
        t.expiry_date,
      ).catch((err) =>
        console.error('[gmail] failed to persist refreshed token:', err),
      );
    }
  });

  return google.gmail({ version: 'v1', auth: oauth2 });
}

/** Decode RFC 4648 base64url → utf-8 string. */
function decodeBody(data: string | null | undefined): string {
  if (!data) return '';
  try {
    return Buffer.from(data, 'base64url').toString('utf-8');
  } catch {
    return '';
  }
}

function header(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  if (!headers) return '';
  const h = headers.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value ?? '';
}

function summarizeMessage(msg: gmail_v1.Schema$Message): GmailMessageSummary {
  const headers = msg.payload?.headers ?? [];
  return {
    id: msg.id ?? '',
    threadId: msg.threadId ?? '',
    from: header(headers, 'From'),
    to: header(headers, 'To'),
    subject: header(headers, 'Subject'),
    snippet: msg.snippet ?? '',
    date: header(headers, 'Date'),
    isUnread: (msg.labelIds ?? []).includes('UNREAD'),
  };
}

/**
 * List recent Gmail threads between the admin and `leadEmail`.
 * Gracefully returns [] if no tokens or the API errors — callers can
 * still render the page.
 */
export async function listThreadsForContact(
  adminEmail: string,
  leadEmail: string,
  limit = 8,
): Promise<{ threads: GmailThreadSummary[]; connected: boolean; error?: string }> {
  const gmail = await getGmailClient(adminEmail);
  if (!gmail) {
    return { threads: [], connected: false };
  }

  try {
    const listRes = await gmail.users.threads.list({
      userId: 'me',
      q: `from:${leadEmail} OR to:${leadEmail}`,
      maxResults: limit,
    });

    const threadIds = (listRes.data.threads ?? [])
      .map((t) => t.id)
      .filter((id): id is string => !!id);

    const threads = await Promise.all(
      threadIds.map(async (id) => {
        const res = await gmail.users.threads.get({
          userId: 'me',
          id,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date'],
        });
        const messages = (res.data.messages ?? []).map(summarizeMessage);
        const latestDate =
          messages[messages.length - 1]?.date || messages[0]?.date || '';
        return {
          id,
          snippet: res.data.snippet ?? '',
          messages,
          latestDate,
        };
      }),
    );

    return { threads, connected: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gmail API error';
    console.error('[gmail] listThreadsForContact error:', err);
    return { threads: [], connected: true, error: message };
  }
}

/**
 * Fetch one thread with full message bodies.
 */
export async function getThread(
  adminEmail: string,
  threadId: string,
): Promise<
  | { ok: true; messages: Array<GmailMessageSummary & { body: string }> }
  | { ok: false; error: string }
> {
  const gmail = await getGmailClient(adminEmail);
  if (!gmail) return { ok: false, error: 'No Gmail connection.' };

  try {
    const res = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });

    const messages = (res.data.messages ?? []).map((m) => {
      const summary = summarizeMessage(m);
      // Extract plain-text body (fall back to HTML-stripped).
      let body = '';
      const parts = m.payload?.parts;
      if (parts) {
        const plain = parts.find(
          (p) => p.mimeType === 'text/plain' && p.body?.data,
        );
        if (plain) {
          body = decodeBody(plain.body?.data);
        } else {
          const html = parts.find(
            (p) => p.mimeType === 'text/html' && p.body?.data,
          );
          if (html) {
            body = decodeBody(html.body?.data).replace(/<[^>]+>/g, ' ');
          }
        }
      } else if (m.payload?.body?.data) {
        body = decodeBody(m.payload.body.data);
      }
      return { ...summary, body };
    });

    return { ok: true, messages };
  } catch (err) {
    console.error('[gmail] getThread error:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gmail API error',
    };
  }
}

/**
 * Send a plain-text email (optionally threaded to an existing
 * conversation). Returns the sent message's ID on success.
 */
export async function sendEmailFromAdmin(
  adminEmail: string,
  opts: {
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    inReplyTo?: string;
  },
): Promise<{ ok: true; messageId: string; threadId: string } | { ok: false; error: string }> {
  const gmail = await getGmailClient(adminEmail);
  if (!gmail) return { ok: false, error: 'Gmail not connected. Re-sign-in to grant access.' };

  // RFC 2822 message.
  const lines: string[] = [
    `From: ${adminEmail}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
  ];
  if (opts.inReplyTo) {
    lines.push(`In-Reply-To: ${opts.inReplyTo}`);
    lines.push(`References: ${opts.inReplyTo}`);
  }
  lines.push('', opts.body);
  const raw = Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: opts.threadId,
      },
    });
    return {
      ok: true,
      messageId: res.data.id ?? '',
      threadId: res.data.threadId ?? '',
    };
  } catch (err) {
    console.error('[gmail] sendEmail error:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gmail send failed.',
    };
  }
}
