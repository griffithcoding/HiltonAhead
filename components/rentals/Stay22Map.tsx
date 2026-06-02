'use client';

import { stay22MapEmbedSrc, type Stay22Center } from '@/app/lib/stay22';

export default function Stay22Map({
  center,
  title,
}: {
  center: Stay22Center;
  title: string;
}) {
  const src = stay22MapEmbedSrc(center);

  return (
    <section aria-label={`Live rental map for ${title}`}>
      <div className="overflow-hidden rounded-3xl border border-rule-soft shadow-sm">
        <iframe
          title={`Live vacation-rental map — ${title}`}
          src={src}
          loading="lazy"
          className="h-[480px] w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Live availability and pricing via Stay22 (Booking.com, VRBO, Airbnb,
        Hotels.com). We may earn a commission from bookings — at no extra cost to
        you.
      </p>
    </section>
  );
}
