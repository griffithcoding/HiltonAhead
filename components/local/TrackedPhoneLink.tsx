'use client';

import { trackDirectoryEvent } from '@/app/lib/directoryTracking';
import type { IndustrySlug } from '@/data/localBusinesses';

/**
 * Phone tel: link that fires a phone_click event before the dialer opens.
 * Renders as a plain <a> so server-rendered styles (className) flow through.
 */
export default function TrackedPhoneLink({
  businessId,
  industrySlug,
  phone,
  className,
  children,
}: {
  businessId: string;
  industrySlug: IndustrySlug;
  phone: string;
  className?: string;
  children: React.ReactNode;
}) {
  const tel = phone.replace(/\D/g, '');
  return (
    <a
      href={`tel:${tel}`}
      className={className}
      onClick={() => trackDirectoryEvent(businessId, industrySlug, 'phone_click')}
    >
      {children}
    </a>
  );
}
