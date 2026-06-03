'use client';

import { useState } from 'react';
import { photos as photoLib } from '@/data/photos';

export default function RentalCarousel({
  photoUrls,
  title,
}: {
  photoUrls: ReadonlyArray<string>;
  title: string;
}) {
  const [i, setI] = useState(0);
  const photos = photoUrls.length > 0 ? photoUrls : [photoLib.villa.src];
  const count = photos.length;
  const go = (delta: number) => setI((prev) => (prev + delta + count) % count);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[i]}
        alt={`${title} — photo ${i + 1} of ${count}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-ink/60 text-sand hover:bg-ink/80"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-ink/60 text-sand hover:bg-ink/80"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((url, n) => (
              <span
                key={url}
                className={`h-1.5 w-1.5 rounded-full ${
                  n === i ? 'bg-sand' : 'bg-sand/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
