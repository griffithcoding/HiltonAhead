'use client';

import {
  withAffiliateParams,
  trackAffiliateClick,
} from '@/app/lib/affiliates';
import {
  AFFILIATE_PROGRAMS,
  type AffiliateProgramId,
} from '@/data/affiliateLinks';

/**
 * Boxed affiliate CTA — ready-to-drop into long-form content at section
 * boundaries (end of blog post, between story chapters, top of neighborhood
 * page, etc.). Carries rel="sponsored nofollow noopener noreferrer".
 *
 * Always pair the page that hosts one of these with <AffiliateDisclosure /> at
 * the top. The disclosure is required by the FTC; the card itself is the
 * money-maker.
 */
export default function AffiliateCard({
  programId,
  deeplink,
  placement,
  headline,
  cta,
  description,
  className,
}: {
  programId: AffiliateProgramId;
  deeplink?: string;
  placement?: string;
  /** Override the default headline. */
  headline?: string;
  /** Override the default CTA copy. */
  cta?: string;
  /** Override the program's default pitch line. */
  description?: string;
  className?: string;
}) {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return null;

  const href = withAffiliateParams(programId, deeplink, placement);
  const headlineCopy = headline ?? `Book on ${program.shortName}`;
  const ctaCopy = cta ?? `Browse on ${program.shortName} →`;
  const descriptionCopy = description ?? program.pitch;

  return (
    <aside
      className={[
        'relative rounded-2xl border border-rule-soft bg-sand-soft p-5 shadow-sm md:p-6',
        className ?? '',
      ].join(' ')}
      aria-label={`Sponsored: ${program.name}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-coral">
          Sponsored
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
          via {program.shortName}
        </span>
      </div>
      <h3 className="display text-lg font-medium leading-snug text-ink md:text-xl">
        {headlineCopy}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {descriptionCopy}
      </p>
      <div className="mt-4">
        <a
          href={href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => trackAffiliateClick(programId, placement, href)}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-sand transition-all hover:bg-ocean"
        >
          {ctaCopy}
        </a>
      </div>
      <p className="mt-3 text-[11px] leading-snug text-ink-soft/70">
        We may earn a commission if you book through this link, at no extra cost
        to you.
      </p>
    </aside>
  );
}
