'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface PhotoSlideshowProps {
  photos: ReadonlyArray<{ src: string; alt: string }>;
  /** Time each photo is held before fading to the next (ms). Defaults to 4500. */
  intervalMs?: number;
  /** Forwarded to next/image. */
  sizes?: string;
  /** Applied to each <Image>; caller controls object-fit/filter classes. */
  className?: string;
  /**
   * Whether the first photo should be priority-loaded (preload + high fetch
   * priority). Default false. Set true ONLY when this slideshow is the
   * above-the-fold LCP element on the page; otherwise it hijacks Next.js's
   * image-preload slot away from the actual hero image.
   */
  priority?: boolean;
}

/**
 * Crossfade slideshow. Stacks photos absolutely, transitions opacity over
 * 800ms, auto-advances on a configurable interval. Pauses on hover/focus.
 * Respects prefers-reduced-motion (shows only the first photo).
 *
 * Caller is responsible for the surrounding container (sizing, overflow,
 * borders, overlays). The component fills its parent.
 */
export default function PhotoSlideshow({
  photos,
  intervalMs = 4500,
  sizes,
  className = '',
  priority = false,
}: PhotoSlideshowProps) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (photos.length <= 1) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % photos.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [photos.length, intervalMs]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onFocus={() => { pausedRef.current = true; }}
      onBlur={() => { pausedRef.current = false; }}
    >
      {photos.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          loading={priority && i === 0 ? undefined : 'lazy'}
          className={`${className} transition-opacity duration-[800ms] ease-out`}
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
        />
      ))}
    </div>
  );
}
