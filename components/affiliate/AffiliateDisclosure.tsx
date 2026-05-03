/**
 * FTC-compliant affiliate disclosure. Drop near the top of any page that
 * contains affiliate links (cards or inline). Server component — no JS.
 *
 * The Federal Trade Commission requires disclosures be "clear and
 * conspicuous" — close to the recommendation, not buried in a footer. We
 * default to a one-liner above the fold.
 */

export default function AffiliateDisclosure({
  variant = 'banner',
  className,
}: {
  /** banner = full-width strip; inline = small italic line */
  variant?: 'banner' | 'inline';
  className?: string;
}) {
  if (variant === 'inline') {
    return (
      <p
        className={[
          'text-[11px] italic leading-snug text-ink-soft/70',
          className ?? '',
        ].join(' ')}
      >
        This page contains affiliate links — we may earn a commission if you
        book through them, at no extra cost to you.
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Affiliate disclosure"
      className={[
        'rounded-lg border border-rule-soft bg-sand-soft/60 px-4 py-2.5 text-[12px] leading-snug text-ink-soft',
        className ?? '',
      ].join(' ')}
    >
      <strong className="font-semibold text-ink">Heads up:</strong>{' '}
      this page includes affiliate links. If you book through one we may earn
      a small commission — it costs you nothing and helps keep the guide free.
      We only link to operators we&rsquo;d actually use ourselves.
    </aside>
  );
}
