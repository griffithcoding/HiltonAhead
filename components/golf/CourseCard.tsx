import Image from 'next/image';
import { withCampaignUtm, HERITAGE_2027_CAMPAIGN } from '@/app/lib/utm';
import type { GolfCourse } from '@/data/golfCourses';

const ACCESS_LABEL: Record<GolfCourse['access'], string> = {
  public: 'Public',
  'resort-guests': 'Resort guests',
  private: 'Private',
};

/**
 * Editorial card for a single golf course. Replaces the plain
 * numbered row inside a `kind: 'tier'` PostBlock when the block is
 * wired to course slugs.
 *
 * Visual: 16:9 photo · name + designer · 4 stat chips · optional Heritage
 * badge · signature-hole line · UTM-tagged "Book tee time" outbound.
 */
export default function CourseCard({
  course,
  rank,
}: {
  course: GolfCourse;
  rank?: number;
}) {
  const bookingUrl = withCampaignUtm(course.bookingUrl, {
    campaign: HERITAGE_2027_CAMPAIGN,
    content: `course_card_${course.slug}`,
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-ink/12 bg-cream transition-shadow hover:shadow-[0_18px_36px_-22px_rgba(11,42,53,0.35)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={course.photo.src}
          alt={course.photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover photo-warm transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {course.heritageVenue && (
          <span className="tartan-pill absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
            <span aria-hidden="true">★</span>
            RBC Heritage venue
          </span>
        )}
        {typeof rank === 'number' && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink/85 text-[11px] font-semibold text-cream backdrop-blur">
            {rank}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <header>
          <h4 className="display text-[19px] leading-[1.2] text-ink md:text-[22px]">
            {course.name}
          </h4>
          <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
            {course.designer} · {course.location}
          </p>
        </header>

        <ul className="flex flex-wrap gap-1.5">
          <Chip tone="palm">Par {course.par}</Chip>
          <Chip tone="ocean">{course.yardage.toLocaleString()} yd</Chip>
          <Chip tone="gold">${course.peakFeeUsd}</Chip>
          <Chip tone="coral">{ACCESS_LABEL[course.access]}</Chip>
        </ul>

        <p className="text-[13.5px] leading-[1.6] text-ink-soft">
          {course.blurb}
        </p>

        {course.signatureHole && (
          <p className="border-l-2 border-gold pl-3 text-[12px] italic leading-[1.5] text-ink-soft">
            <span className="not-italic font-medium text-ink">Signature: </span>
            {course.signatureHole}
          </p>
        )}

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-between gap-2 rounded-full border border-ink bg-ink px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-cream transition hover:bg-coral hover:border-coral"
        >
          Book tee time
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function Chip({
  tone,
  children,
}: {
  tone: 'palm' | 'ocean' | 'gold' | 'coral';
  children: React.ReactNode;
}) {
  const styles: Record<typeof tone, string> = {
    palm: 'border-palm/40 bg-palm/10 text-palm',
    ocean: 'border-ocean/40 bg-ocean/10 text-ocean-deep',
    gold: 'border-gold/50 bg-gold/15 text-gold-deep',
    coral: 'border-coral/40 bg-coral/10 text-coral-deep',
  };
  return (
    <li
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${styles[tone]}`}
    >
      {children}
    </li>
  );
}
