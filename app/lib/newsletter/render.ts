/**
 * Render a TopicBundle into the subscriber email (HTML + text + subject)
 * and the owner-facing approval email.
 *
 * The subscriber HTML contains an `{{UNSUBSCRIBE_URL}}` placeholder that
 * the send layer replaces with a per-recipient signed URL before each
 * Resend Batch send.
 *
 * Inline styles only — no external CSS, no <style> blocks (Outlook
 * strips them inconsistently). Table-based layout for the same reason.
 */

import type { TopicBundle, TopicPost, TopicEvent } from './topic-discovery';

// ——— brand palette (matches app/lib/email.ts) ————————————————————————
const C = {
  bg: '#F5E8D0', // sand / cream
  bgSoft: '#FBF3E2', // cream-deep
  ink: '#0A2930',
  inkSoft: '#3D5860',
  muted: '#9CA3AF',
  coral: '#C44A2B',
  gold: '#E8A74B',
  border: 'rgba(10,41,48,0.1)',
  borderStrong: 'rgba(10,41,48,0.2)',
};

const SITE = 'https://www.hiltonahead.com';

// ——— public types ——————————————————————————————————————————————————

export interface RenderedIssue {
  subject: string;
  /** HTML containing `{{UNSUBSCRIBE_URL}}` placeholder. */
  html: string;
  /** Plain text containing `{{UNSUBSCRIBE_URL}}` placeholder. */
  text: string;
}

export interface RenderedApprovalEmail {
  subject: string;
  html: string;
  text: string;
}

// ——— escape helpers ——————————————————————————————————————————————

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ——— format helpers ————————————————————————————————————————————————

function formatEventDate(start: string, end: string): string {
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end + 'T12:00:00');
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (start === end) {
    return s.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  }
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('en-US', opts)}-${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString('en-US', { ...opts, year: 'numeric' })} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

// ——— subject line ————————————————————————————————————————————————

function buildSubject(bundle: TopicBundle): string {
  // Pick the strongest hook: first seasonal angle if present,
  // otherwise the first new post title, otherwise the month name.
  if (bundle.seasonalAngles[0]) {
    return `Hilton Ahead — ${bundle.seasonalAngles[0].headline}`;
  }
  if (bundle.newPosts[0]) {
    return `Hilton Ahead — ${bundle.newPosts[0].title.slice(0, 60)}`;
  }
  return `Hilton Ahead — ${bundle.currentMonth.name} on the island`;
}

// ——— main: subscriber issue ——————————————————————————————————————————

export function renderIssue(bundle: TopicBundle): RenderedIssue {
  const subject = buildSubject(bundle);
  const html = renderIssueHtml(bundle);
  const text = renderIssueText(bundle);
  return { subject, html, text };
}

function renderIssueHtml(b: TopicBundle): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(buildSubject(b))}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:36px 24px 8px 24px;">
          <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.coral};font-weight:600;">
            The Insider Letter
          </div>
          <div style="font-size:11px;color:${C.muted};margin-top:4px;">
            Week of ${esc(b.weekOf)} · Hilton Head Island, SC
          </div>
        </td></tr>

        ${renderHeroSection(b)}
        ${b.newPosts.length ? renderPostsSection(b.newPosts) : ''}
        ${b.upcomingEvents.length ? renderEventsSection(b.upcomingEvents) : ''}
        ${renderMonthSection(b)}
        ${renderSignoffSection()}
        ${renderFooter()}

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderHeroSection(b: TopicBundle): string {
  const lead = b.seasonalAngles[0];
  if (!lead) {
    return `
      <tr><td style="padding:8px 24px 16px 24px;">
        <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;color:${C.ink};margin:0;letter-spacing:-0.02em;">
          ${esc(b.currentMonth.name)} on the island.
        </h1>
        <p style="font-size:15px;line-height:1.7;color:${C.inkSoft};margin:16px 0 0 0;">
          ${esc(b.currentMonth.intro)}
        </p>
      </td></tr>`;
  }
  return `
    <tr><td style="padding:8px 24px 16px 24px;">
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;color:${C.ink};margin:0;letter-spacing:-0.02em;">
        ${esc(lead.headline)}
      </h1>
      <p style="font-size:15px;line-height:1.7;color:${C.inkSoft};margin:16px 0 0 0;">
        ${esc(lead.body)}
      </p>
      ${
        lead.ctaUrl
          ? `<p style="margin:18px 0 0 0;">
              <a href="${esc(lead.ctaUrl)}" style="display:inline-block;background:${C.ink};color:${C.bg};text-decoration:none;padding:10px 18px;border-radius:999px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">
                ${esc(lead.ctaText || 'Plan it →')}
              </a>
            </p>`
          : ''
      }
    </td></tr>`;
}

function renderPostsSection(posts: TopicPost[]): string {
  return `
    <tr><td style="padding:32px 24px 0 24px;">
      <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 24px 0;" />
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.coral};font-weight:600;">
        New on the blog
      </div>
    </td></tr>
    ${posts
      .map(
        (p) => `
    <tr><td style="padding:18px 24px 0 24px;">
      <a href="${SITE}/blog/${esc(p.slug)}" style="text-decoration:none;color:inherit;">
        <div style="font-family:Georgia,serif;font-size:20px;line-height:1.25;color:${C.ink};letter-spacing:-0.01em;">
          ${esc(p.title)}
        </div>
        <div style="font-size:14px;line-height:1.65;color:${C.inkSoft};margin:8px 0 0 0;">
          ${esc(p.excerpt)}
        </div>
        <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.muted};margin:10px 0 0 0;">
          Read · ${esc(p.category)}
        </div>
      </a>
    </td></tr>`,
      )
      .join('')}`;
}

function renderEventsSection(items: TopicEvent[]): string {
  return `
    <tr><td style="padding:32px 24px 0 24px;">
      <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 24px 0;" />
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.coral};font-weight:600;">
        On the calendar
      </div>
    </td></tr>
    ${items
      .map(
        (e) => `
    <tr><td style="padding:14px 24px 0 24px;">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.gold};font-weight:600;">
        ${esc(formatEventDate(e.startDate, e.endDate))}
      </div>
      <div style="font-family:Georgia,serif;font-size:18px;line-height:1.25;color:${C.ink};margin-top:4px;">
        ${esc(e.name)}
      </div>
      <div style="font-size:12px;color:${C.muted};margin-top:2px;">${esc(e.location)}</div>
      <div style="font-size:13.5px;line-height:1.65;color:${C.inkSoft};margin-top:8px;">
        ${esc(e.description.slice(0, 220))}${e.description.length > 220 ? '…' : ''}
      </div>
      ${
        e.url
          ? `<div style="margin-top:8px;"><a href="${esc(e.url)}" style="color:${C.coral};text-decoration:underline;font-size:12px;">Official site →</a></div>`
          : ''
      }
    </td></tr>`,
      )
      .join('')}`;
}

function renderMonthSection(b: TopicBundle): string {
  const m = b.currentMonth;
  return `
    <tr><td style="padding:32px 24px 0 24px;">
      <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 24px 0;" />
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.coral};font-weight:600;">
        ${esc(m.name)} on the island
      </div>
    </td></tr>
    <tr><td style="padding:14px 24px 0 24px;">
      <div style="font-family:Georgia,serif;font-size:18px;line-height:1.3;color:${C.ink};">
        ${esc(m.headline)}
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;background:${C.bgSoft};border:1px solid ${C.border};width:100%;">
        <tr>
          ${cell('Avg high', `${m.avgHigh}°F`)}
          ${cell('Avg low', `${m.avgLow}°F`)}
          ${cell('Water', `${m.waterTemp}°F`)}
          ${cell('Crowds', m.crowdLevel)}
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.7;color:${C.inkSoft};margin:14px 0 0 0;">
        ${esc(m.intro)}
      </p>
      <p style="margin:14px 0 0 0;">
        <a href="${SITE}/hilton-head-weather/${esc(m.slug)}" style="color:${C.coral};text-decoration:underline;font-size:13px;">
          Full ${esc(m.name)} report →
        </a>
      </p>
    </td></tr>
    ${
      b.seasonalAngles[1]
        ? `
    <tr><td style="padding:24px 24px 0 24px;">
      <div style="border-left:2px solid ${C.coral};padding:8px 0 8px 16px;background:${C.bgSoft};">
        <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.coral};font-weight:600;">
          Insider note
        </div>
        <div style="font-family:Georgia,serif;font-size:16px;line-height:1.3;color:${C.ink};margin-top:6px;">
          ${esc(b.seasonalAngles[1].headline)}
        </div>
        <div style="font-size:14px;line-height:1.65;color:${C.inkSoft};margin-top:6px;">
          ${esc(b.seasonalAngles[1].body)}
        </div>
      </div>
    </td></tr>`
        : ''
    }`;
}

function cell(label: string, value: string): string {
  return `<td style="padding:12px 14px;text-align:center;border-right:1px solid ${C.border};">
    <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${esc(label)}</div>
    <div style="font-size:15px;color:${C.ink};margin-top:4px;font-weight:600;">${esc(value)}</div>
  </td>`;
}

function renderSignoffSection(): string {
  return `
    <tr><td style="padding:32px 24px 0 24px;">
      <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 20px 0;" />
      <p style="font-size:14px;line-height:1.7;color:${C.inkSoft};margin:0;">
        That's the dispatch. Reply to this email if you're considering a trip
        and want a sample plan — replies come straight to the operator inbox.
      </p>
      <p style="font-size:14px;line-height:1.7;color:${C.inkSoft};margin:12px 0 0 0;">
        — Hilton Ahead<br/>
        <a href="${SITE}" style="color:${C.coral};text-decoration:underline;">hiltonahead.com</a>
      </p>
    </td></tr>`;
}

function renderFooter(): string {
  return `
    <tr><td style="padding:36px 24px 36px 24px;">
      <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 16px 0;" />
      <div style="font-size:11px;line-height:1.7;color:${C.muted};">
        You're receiving this because you subscribed at hiltonahead.com.
        One dispatch a week. <a href="{{UNSUBSCRIBE_URL}}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a> in one click.
      </div>
      <div style="font-size:11px;line-height:1.7;color:${C.muted};margin-top:10px;">
        Hilton Ahead Travel Co · Hilton Head Island, SC 29928
      </div>
    </td></tr>`;
}

function renderIssueText(b: TopicBundle): string {
  const lines: string[] = [];
  lines.push(`THE INSIDER LETTER — Week of ${b.weekOf}`);
  lines.push(`Hilton Head Island, SC`);
  lines.push('');

  if (b.seasonalAngles[0]) {
    lines.push(b.seasonalAngles[0].headline.toUpperCase());
    lines.push(b.seasonalAngles[0].body);
    if (b.seasonalAngles[0].ctaUrl) {
      lines.push(`-> ${b.seasonalAngles[0].ctaText || 'Plan it'}: ${b.seasonalAngles[0].ctaUrl}`);
    }
    lines.push('');
  }

  if (b.newPosts.length) {
    lines.push('NEW ON THE BLOG');
    lines.push('---------------');
    for (const p of b.newPosts) {
      lines.push(`* ${p.title}`);
      lines.push(`  ${p.excerpt}`);
      lines.push(`  ${SITE}/blog/${p.slug}`);
      lines.push('');
    }
  }

  if (b.upcomingEvents.length) {
    lines.push('ON THE CALENDAR');
    lines.push('---------------');
    for (const e of b.upcomingEvents) {
      lines.push(`* ${formatEventDate(e.startDate, e.endDate)} — ${e.name}`);
      lines.push(`  ${e.location}`);
      lines.push(`  ${e.description.slice(0, 200)}${e.description.length > 200 ? '…' : ''}`);
      lines.push('');
    }
  }

  lines.push(`${b.currentMonth.name.toUpperCase()} ON THE ISLAND`);
  lines.push('-------------------');
  lines.push(b.currentMonth.headline);
  lines.push(
    `Avg high ${b.currentMonth.avgHigh}°F · Avg low ${b.currentMonth.avgLow}°F · Water ${b.currentMonth.waterTemp}°F · Crowds: ${b.currentMonth.crowdLevel}`,
  );
  lines.push('');
  lines.push(b.currentMonth.intro);
  lines.push(`Full ${b.currentMonth.name} report: ${SITE}/hilton-head-weather/${b.currentMonth.slug}`);
  lines.push('');

  if (b.seasonalAngles[1]) {
    lines.push('INSIDER NOTE');
    lines.push('------------');
    lines.push(b.seasonalAngles[1].headline);
    lines.push(b.seasonalAngles[1].body);
    lines.push('');
  }

  lines.push('---');
  lines.push(
    'Reply to this email if you’re considering a trip and want a sample plan.',
  );
  lines.push('— Hilton Ahead · hiltonahead.com');
  lines.push('');
  lines.push('Unsubscribe: {{UNSUBSCRIBE_URL}}');
  lines.push('Hilton Ahead Travel Co · Hilton Head Island, SC 29928');

  return lines.join('\n');
}

// ——— owner-facing approval email ——————————————————————————————————————

export function renderApprovalEmail({
  bundle,
  issueId,
  approveUrl,
  rejectUrl,
  previewHtml,
  recipientCount,
}: {
  bundle: TopicBundle;
  issueId: string;
  approveUrl: string;
  rejectUrl: string;
  /** Subscriber-facing HTML to embed inline as a preview. */
  previewHtml: string;
  recipientCount: number;
}): RenderedApprovalEmail {
  const subject = `[Approval needed] Insider Letter — week of ${bundle.weekOf}`;

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#EEE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
    <div style="background:#fff;border:1px solid ${C.borderStrong};padding:24px;">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.coral};font-weight:600;">
        Approval needed · Insider Letter
      </div>
      <h1 style="font-family:Georgia,serif;font-size:24px;margin:8px 0 0 0;color:${C.ink};">
        Week of ${esc(bundle.weekOf)}
      </h1>
      <div style="font-size:13px;color:${C.inkSoft};margin-top:6px;">
        Will send to ${recipientCount} subscriber${recipientCount === 1 ? '' : 's'}.
        Issue ID: ${esc(issueId)}
      </div>

      <div style="margin-top:20px;">
        <a href="${esc(approveUrl)}" style="display:inline-block;background:#0F7A4D;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:0.05em;margin-right:8px;">
          ✓ Approve &amp; send
        </a>
        <a href="${esc(rejectUrl)}" style="display:inline-block;background:#7A1F1F;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:0.05em;">
          ✕ Reject
        </a>
      </div>

      <div style="font-size:12px;color:${C.muted};margin-top:14px;">
        Approval links expire in 14 days. Both buttons require no login.
      </div>

      <hr style="border:0;border-top:1px solid ${C.border};margin:24px 0;" />
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};font-weight:600;margin-bottom:14px;">
        ↓ Subscriber preview ↓
      </div>
    </div>

    <div style="margin-top:18px;border:1px solid ${C.borderStrong};">
      ${previewHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, '#preview-unsubscribe')}
    </div>
  </div>
</body>
</html>`;

  const text = [
    `[Approval needed] Insider Letter — week of ${bundle.weekOf}`,
    ``,
    `Will send to ${recipientCount} subscribers. Issue ID: ${issueId}`,
    ``,
    `Approve & send: ${approveUrl}`,
    `Reject: ${rejectUrl}`,
    ``,
    `Both links expire in 14 days. No login required.`,
    ``,
    `--- Subscriber preview (text version) ---`,
    ``,
    renderIssueText(bundle).replace(/\{\{UNSUBSCRIBE_URL\}\}/g, '[per-recipient unsubscribe link]'),
  ].join('\n');

  return { subject, html, text };
}
