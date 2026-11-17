import { withAffiliateParams } from '@/app/lib/affiliates';
import AffiliateAnchor from '@/components/affiliate/AffiliateAnchor';
import type { AffiliateProgramId } from '@/data/affiliateLinks';

/**
 * Inline outbound affiliate link. Stamps the program's tracking ID, sets
 * rel="sponsored nofollow noopener noreferrer" (FTC compliance — non-negotiable),
 * and fires a click beacon to /api/affiliate/track.
 *
 * Use inside body copy for contextual mentions. For prominent boxed CTAs
 * use <AffiliateCard> instead.
 *
 * Server component on purpose: the tracking IDs are server-only env vars, so
 * the stamped URL is built here and handed to the client <AffiliateAnchor>.
 */
export default function AffiliateLink({
  programId,
  deeplink,
  placement,
  className,
  children,
  ariaLabel,
}: {
  programId: AffiliateProgramId;
  /** Optional override; falls back to the program's defaultDeeplink. */
  deeplink?: string;
  /** Optional analytics label, e.g. 'golf-tier-list', 'blog/spring-break'. */
  placement?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const href = withAffiliateParams(programId, deeplink, placement);
  return (
    <AffiliateAnchor
      href={href}
      programId={programId}
      placement={placement}
      className={className}
      ariaLabel={ariaLabel}
    >
      {children}
    </AffiliateAnchor>
  );
}
