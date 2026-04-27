import Image from 'next/image';
import { photos } from '@/data/photos';
import { Ticket } from '@/components/ui/Ornament';

/**
 * Photo rail — a full-bleed look-book strip of island moods.
 * Six images on a horizontal scroll on mobile, 6-up grid on desktop,
 * each tagged with a small ticket-stub caption.
 *
 * Placed between WhyIsland and Services to make the site feel
 * photography-dense without making every section image-heavy.
 */
export default function PhotoRail() {
  return (
    <section
      aria-label="Hilton Head mood board"
      className="bleed mt-28 bg-ocean-deep py-20 text-sand md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5">
        <div className="mb-14 flex flex-col items-center justify-center text-center">
          <div className="eyebrow eyebrow-coral">Paradise in every pixel</div>
          <h2 className="display mt-5 max-w-[680px] text-[32px] leading-[1.08] text-sand md:text-[48px]">
            One month of Hilton Head in seven frames.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-7">
          {photos.moods.map((m, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-md ${
                i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]'
              }`}
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover photo-warm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/70 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
              <figcaption className="absolute bottom-3 left-3 right-3">
                <Ticket className="!bg-sand !text-ocean-deep">
                  {m.caption}
                </Ticket>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-5 text-sand/60">
          <span className="h-px w-16 bg-sand/30" />
          <span className="display-italic text-[14px] text-sand/80">
            Every frame, on-island. Every frame, ours.
          </span>
          <span className="h-px w-16 bg-sand/30" />
        </div>
      </div>
    </section>
  );
}
