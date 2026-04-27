import Image from 'next/image';

interface KenBurnsImageProps {
  src: string;
  alt: string;
  /** Variant controls the pan direction. Defaults to 'in'. */
  variant?: 'in' | 'out' | 'pan-left' | 'pan-right' | 'pan-up';
  /** Aspect ratio class (default 'aspect-[4/5]'). */
  aspectClass?: string;
  /** Animation duration class (default 'kb-12s'; options 'kb-8s', 'kb-12s', 'kb-18s'). */
  durationClass?: 'kb-8s' | 'kb-12s' | 'kb-18s';
  /** sizes prop forwarded to next/image. */
  sizes?: string;
  className?: string;
  /** Image priority. */
  priority?: boolean;
}

/**
 * Slow scale + translate loop on top of next/image. Pure CSS animation,
 * named keyframes ken-burns-{variant} live in app/globals.css.
 * Reduced motion users see the still image (animation: none).
 */
export default function KenBurnsImage({
  src,
  alt,
  variant = 'in',
  aspectClass = 'aspect-[4/5]',
  durationClass = 'kb-12s',
  sizes = '(max-width: 768px) 100vw, 50vw',
  className = '',
  priority = false,
}: KenBurnsImageProps) {
  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      <div className={`absolute inset-0 ken-burns ken-burns-${variant} ${durationClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover photo-warm"
        />
      </div>
    </div>
  );
}
