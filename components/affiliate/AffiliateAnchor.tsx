'use client';

import { trackAffiliateClick } from '@/app/lib/affiliates';
import type { AffiliateProgramId } from '@/data/affiliateLinks';

/**
 * The outbound <a> for an affiliate link, plus its click beacon. This is the
 * only client-side part of an affiliate link.
 *
 * `href` must arrive already stamped with the tracking ID. The tracking IDs
 * live in server-only env vars, so the URL has to be built on the server (in
 * <AffiliateCard> / <AffiliateLink>) and passed down. Building it here would
 * drop the ID whenever the page is reached by in-site navigation.
 */
export default function AffiliateAnchor({
  href,
  programId,
  placement,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  programId: AffiliateProgramId;
  placement?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
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
