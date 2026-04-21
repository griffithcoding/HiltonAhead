import { listThreadsForContact } from '@/utils/gmail/client';
import ReplyComposer from './ReplyComposer';

function parseSender(raw: string): string {
  // "Name <email@x.com>" or just "email@x.com"
  const m = raw.match(/^(.*?)\s*<([^>]+)>$/);
  if (m) return m[1].replace(/"/g, '').trim() || m[2];
  return raw;
}

function formatRelative(iso: string): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const diffHrs = (Date.now() - t) / 3_600_000;
  if (diffHrs < 1) return `${Math.max(1, Math.round(diffHrs * 60))}m ago`;
  if (diffHrs < 24) return `${Math.round(diffHrs)}h ago`;
  if (diffHrs < 24 * 7) return `${Math.round(diffHrs / 24)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function GmailPanel({
  adminEmail,
  leadEmail,
  leadId,
  type,
}: {
  adminEmail: string;
  leadEmail: string;
  leadId: string;
  type: string;
}) {
  const { threads, connected, error } = await listThreadsForContact(
    adminEmail,
    leadEmail,
    6,
  );

  // Determine the latest thread to reply into (if any).
  const latestThread = threads[0];
  const latestMsg =
    latestThread?.messages[latestThread.messages.length - 1];
  const replyDefaults = latestMsg
    ? {
        subject: latestMsg.subject?.startsWith('Re:')
          ? latestMsg.subject
          : `Re: ${latestMsg.subject || ''}`.trim(),
        threadId: latestThread.id,
        inReplyTo: latestMsg.id,
      }
    : {
        subject: '',
        threadId: undefined,
        inReplyTo: undefined,
      };

  return (
    <section className="mt-16 border-t border-ocean-deep/15 pt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="eyebrow text-coral">Email · Gmail</h2>
          <h3 className="display mt-3 text-[24px] leading-[1.1] text-ink md:text-[30px]">
            Thread with{' '}
            <span className="display-italic text-coral">{leadEmail}</span>
          </h3>
        </div>
        {!connected && (
          <a
            href="/admin/login"
            className="rounded-full border border-ink bg-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral hover:border-coral"
          >
            Connect Gmail
          </a>
        )}
      </div>

      {!connected && (
        <p className="mt-5 max-w-[600px] text-[13px] leading-[1.65] text-ink-soft">
          Gmail isn&apos;t connected yet. Sign out and sign back in — Google
          will show a consent screen asking for read + send access. We only
          ever read threads between you and a specific lead&apos;s address;
          nothing else is queried.
        </p>
      )}

      {connected && error && (
        <div className="mt-5 border-l-2 border-coral bg-coral/5 px-4 py-3 text-[13px] text-ink-soft">
          Gmail error: {error}. Try signing out and in again.
        </div>
      )}

      {connected && !error && (
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          {/* Compose / reply */}
          <div>
            <div className="eyebrow text-ink-soft">
              {latestThread ? 'Reply in thread' : 'Start a new thread'}
            </div>
            <div className="mt-4">
              <ReplyComposer
                type={type}
                id={leadId}
                to={leadEmail}
                defaultSubject={replyDefaults.subject}
                threadId={replyDefaults.threadId}
                inReplyTo={replyDefaults.inReplyTo}
              />
            </div>
          </div>

          {/* Thread list */}
          <div>
            <div className="eyebrow text-ink-soft">
              Recent threads ({threads.length})
            </div>
            {threads.length === 0 ? (
              <div className="mt-4 rounded-sm border border-dashed border-ocean-deep/20 bg-sand-soft p-6 text-center text-[13px] text-ink-soft">
                No email history yet. Anything you send below will start the
                first thread.
              </div>
            ) : (
              <ol className="mt-4 flex flex-col divide-y divide-ocean-deep/10">
                {threads.map((t) => {
                  const latest = t.messages[t.messages.length - 1];
                  const senderName = latest
                    ? parseSender(latest.from)
                    : '—';
                  return (
                    <li key={t.id} className="py-4">
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                        <span className="truncate">{senderName}</span>
                        <span>{formatRelative(t.latestDate)}</span>
                      </div>
                      <div className="mt-1 truncate text-[14px] font-semibold text-ink">
                        {latest?.subject || '(no subject)'}
                      </div>
                      <div className="mt-1 line-clamp-2 text-[12.5px] leading-[1.5] text-ink-soft">
                        {t.snippet}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-soft/70">
                        {t.messages.length} message
                        {t.messages.length > 1 ? 's' : ''}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
