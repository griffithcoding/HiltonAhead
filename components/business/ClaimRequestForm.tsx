'use client';

import { useState } from 'react';
import { startBusinessClaim } from '@/app/business/claim/actions';

export default function ClaimRequestForm({
  businessSlug,
  businessName,
  suggestedEmail,
  hasContactOnFile,
}: {
  businessSlug: string;
  businessName: string;
  suggestedEmail: string;
  hasContactOnFile: boolean;
}) {
  const [email, setEmail] = useState(suggestedEmail);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ sentTo: 'listed-email' | 'admin-review' } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await startBusinessClaim({
      businessSlug,
      emailEnteredByUser: email,
    });
    setPending(false);
    if (result.ok) setDone({ sentTo: result.sentTo });
    else setError(result.error);
  }

  if (done) {
    return (
      <div className="border-l-2 border-coral bg-coral/10 px-5 py-6">
        <div className="eyebrow text-coral-deep">Claim request received</div>
        {done.sentTo === 'listed-email' ? (
          <>
            <h3 className="display mt-2 text-[24px] leading-[1.2] text-ink">
              Check your inbox.
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
              We sent a verification link to the email on file for{' '}
              {businessName}. Click it from that inbox, then sign in via
              magic link or Google. Your account will be linked to this
              listing automatically.
            </p>
            <p className="mt-3 text-[12px] leading-[1.5] text-ink-soft">
              Link expires in 14 days. Didn&rsquo;t get it? Check spam, or
              email <a className="link-underline text-ink" href="mailto:hello@hiltonahead.com">hello@hiltonahead.com</a>.
            </p>
          </>
        ) : (
          <>
            <h3 className="display mt-2 text-[24px] leading-[1.2] text-ink">
              We&rsquo;ll review and follow up.
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
              The email you entered didn&rsquo;t match what we have on file
              (or we don&rsquo;t have one yet). An admin will verify the
              claim manually and follow up by email — usually within a week.
            </p>
            <p className="mt-3 text-[12px] leading-[1.5] text-ink-soft">
              Speed it up: forward a recent invoice, lease, or business
              license to <a className="link-underline text-ink" href="mailto:hello@hiltonahead.com">hello@hiltonahead.com</a>.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="eyebrow text-ink-soft">
          Your email <span className="ml-1 text-coral">*</span>
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={
            hasContactOnFile
              ? 'Use the email on file for this listing'
              : 'you@yourbusiness.com'
          }
          className="rounded-sm border border-ink/20 bg-cream px-3 py-2.5 text-[14.5px] text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
        />
        <span className="text-[12px] leading-[1.5] text-ink-soft">
          {hasContactOnFile
            ? "If this matches the email we have on file, we'll send you an instant verification link. If not, an admin will follow up."
            : "Since we don't have an email on file, an admin will manually verify your claim before we link the account."}
        </span>
      </label>

      {error && (
        <div className="border-l-2 border-rose-400 bg-rose-50 px-4 py-3 text-[13px] text-rose-900">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !email.trim()}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-ocean-deep disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Request verification link'}
      </button>
    </form>
  );
}
