'use client';

import {
  trackDirectoryEvent,
  withDirectoryUtm,
} from '@/app/lib/directoryTracking';
import type { IndustrySlug } from '@/data/localBusinesses';

/**
 * Outbound website link with auto-applied utm params and a tracked click.
 * The UTM tags ensure the business sees "hiltonahead / directory" in their
 * own GA Source/Medium — that visibility is half the upsell.
 */
export default function TrackedWebsiteLink({
  businessId,
  industrySlug,
  url,
  className,
  children,
  ariaLabel,
}: {
  businessId: string;
  industrySlug: IndustrySlug;
  url: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={withDirectoryUtm(url, businessId)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackDirectoryEvent(businessId, industrySlug, 'website_click')}
    >
      {children}
    </a>
  );
}
