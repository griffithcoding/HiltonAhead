/**
 * Render an ad-hoc (manually composed) newsletter issue.
 *
 * The cron-driven path uses TopicBundle → renderIssue. The compose UI
 * skips topic discovery entirely: the owner writes a subject + body
 * (markdown-ish text) and we wrap it in the same brand chrome — masthead,
 * footer with unsubscribe placeholder, inline-style table layout for
 * Outlook compatibility.
 *
 * Same {{UNSUBSCRIBE_URL}} contract as renderIssue: the send layer
 * substitutes a per-recipient signed URL on each Resend Batch send.
 */

import type { RenderedIssue } from './render';

const C = {
  bg: '#F5E8D0',
  bgSoft: '#FBF3E2',
  ink: '#0A2930',
  inkSoft: '#3D5860',
  muted: '#9CA3AF',
  coral: '#C44A2B',
  border: 'rgba(10,41,48,0.1)',
};

const SITE = 'https://www.hiltonahead.com';

export interface AdHocComposeInput {
  subject: string;
  /** Markdown-ish body. Blank lines = paragraphs, lines starting `# ` = h1,
   * `## ` = h2, `> ` = blockquote, `[label](url)` = link, `**text**` = bold. */
  body: string;
  /** Human-readable date label, e.g. "Apr 26, 2026". Defaults to today. */
  weekOf?: string;
}

export function renderAdHocIssue(input: AdHocComposeInput): RenderedIssue {
  const subject = input.subject.trim();
  const weekOf = input.weekOf || formatTodayLong();
  const html = renderHtml(input.body, subject, weekOf);
  const text = renderText(input.body, subject, weekOf);
  return { subject, html, text };
}

// ——— HTML rendering ————————————————————————————————————————————————

function renderHtml(body: string, subject: string, weekOf: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Masthead -->
        <tr><td style="padding:36px 24px 8px 24px;">
          <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.coral};font-weight:600;">
            The Insider Letter
          </div>
          <div style="font-size:11px;color:${C.muted};margin-top:4px;">
            ${esc(weekOf)} · Hilton Head Island, SC
          </div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:8px 24px 24px 24px;">
          ${markdownToHtml(body)}
        </td></tr>

        <!-- Signoff -->
        <tr><td style="padding:24px 24px 0 24px;">
          <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 20px 0;" />
          <p style="font-size:14px;line-height:1.7;color:${C.inkSoft};margin:0;">
            — Hilton Ahead<br/>
            <a href="${SITE}" style="color:${C.coral};text-decoration:underline;">hiltonahead.com</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:36px 24px 36px 24px;">
          <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 16px 0;" />
          <div style="font-size:11px;line-height:1.7;color:${C.muted};">
            You're receiving this because you subscribed at hiltonahead.com.
            <a href="{{UNSUBSCRIBE_URL}}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a> in one click.
          </div>
          <div style="font-size:11px;line-height:1.7;color:${C.muted};margin-top:10px;">
            Hilton Ahead Travel Co · Hilton Head Island, SC 29928
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ——— Markdown-ish rendering ————————————————————————————————————————

/**
 * Tiny, deliberately limited markdown subset. Designed for fast composition
 * by the founder, not for arbitrary user content. Output is inline-styled
 * to survive Outlook/Gmail rendering.
 *
 *   # H1            -> serif h1
 *   ## H2           -> serif h2
 *   > quote         -> coral-bordered insider note
 *   - item          -> bulleted list
 *   [text](url)     -> link
 *   **text**        -> bold
 *   blank line      -> paragraph break
 */
function markdownToHtml(input: string): string {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let para: string[] = [];
  let list: string[] = [];

  function flushPara() {
    if (para.length === 0) return;
    const joined = para.join(' ').trim();
    if (joined) {
      blocks.push(
        `<p style="font-size:15px;line-height:1.7;color:${C.inkSoft};margin:0 0 16px 0;">${inline(joined)}</p>`,
      );
    }
    para = [];
  }
  function flushList() {
    if (list.length === 0) return;
    const items = list
      .map(
        (item) =>
          `<li style="font-size:15px;line-height:1.7;color:${C.inkSoft};margin:0 0 6px 0;">${inline(item)}</li>`,
      )
      .join('');
    blocks.push(
      `<ul style="margin:0 0 18px 0;padding:0 0 0 22px;">${items}</ul>`,
    );
    list = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith('# ')) {
      flushPara();
      flushList();
      blocks.push(
        `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;color:${C.ink};margin:8px 0 18px 0;letter-spacing:-0.02em;">${inline(line.slice(2))}</h1>`,
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara();
      flushList();
      blocks.push(
        `<h2 style="font-family:Georgia,serif;font-size:20px;line-height:1.25;color:${C.ink};margin:24px 0 12px 0;">${inline(line.slice(3))}</h2>`,
      );
      continue;
    }
    if (line.startsWith('> ')) {
      flushPara();
      flushList();
      blocks.push(
        `<blockquote style="margin:0 0 18px 0;padding:12px 16px;border-left:2px solid ${C.coral};background:${C.bgSoft};font-size:14px;line-height:1.65;color:${C.inkSoft};">${inline(line.slice(2))}</blockquote>`,
      );
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushPara();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();

  return blocks.join('\n');
}

function inline(s: string): string {
  // Escape first, then re-introduce safe markup for **bold** and [text](url).
  let out = esc(s);
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label: string, url: string) =>
      `<a href="${url}" style="color:${C.coral};text-decoration:underline;">${label}</a>`,
  );
  out = out.replace(
    /\*\*([^*]+)\*\*/g,
    (_, t: string) => `<strong style="color:${C.ink};">${t}</strong>`,
  );
  return out;
}

// ——— Text rendering ————————————————————————————————————————————————

function renderText(body: string, subject: string, weekOf: string): string {
  const lines: string[] = [];
  lines.push(`THE INSIDER LETTER — ${weekOf}`);
  lines.push(`Hilton Head Island, SC`);
  lines.push('');
  lines.push(subject);
  lines.push('-'.repeat(Math.min(subject.length, 60)));
  lines.push('');
  lines.push(stripMarkdown(body).trim());
  lines.push('');
  lines.push('— Hilton Ahead · hiltonahead.com');
  lines.push('');
  lines.push('Unsubscribe: {{UNSUBSCRIBE_URL}}');
  lines.push('Hilton Ahead Travel Co · Hilton Head Island, SC 29928');
  return lines.join('\n');
}

function stripMarkdown(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+/gm, '* ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/\*\*([^*]+)\*\*/g, '$1');
}

// ——— helpers ————————————————————————————————————————————————

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTodayLong(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
