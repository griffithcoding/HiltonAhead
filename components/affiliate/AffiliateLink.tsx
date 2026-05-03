'use client';

import {
  withAffiliateParams,
  trackAffiliateClick,
} from '@/app/lib/affiliates';
import type { AffiliateProgramId } from '@/data/affiliateLinks';

/**
 * Inline outbound affiliate link. Stamps the program's tracking ID, sets
 * rel="sponsored nofollow noopener noreferrer" (FTC compliance — non-negotiable),
 * and fires a click beacon to /api/affiliate/track.
 *
 * Use inside body copy for contextual mentions. For prominent boxed CTAs
 * use <AffiliateCard> instead.
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
  const href = withAffiliateParams(programId, deeplink);
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackAffiliateClick(programId, placement, href)}
    >
      {children}
    </a>
  );
}
