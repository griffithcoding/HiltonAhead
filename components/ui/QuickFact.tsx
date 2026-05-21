/**
 * Citable factoid block — a bold number plus context.
 * Designed to be self-contained so an LLM can quote it as a single
 * sentence ("Hilton Head Island has 24 golf courses across 12 miles
 * of coastline.").
 *
 * Use sparingly — 1–3 per long-form post. Surface the most quotable
 * statistics (counts, distances, prices, time-saved).
 */
export default function QuickFact({
  number,
  label,
  source,
  sourceUrl,
}: {
  number: string;
  label: string;
  source?: string;
  sourceUrl?: string;
}) {
  return (
    <figure className="quick-fact my-6 inline-flex max-w-full flex-col gap-1 border-l-2 border-coral pl-5">
      <span className="display text-[40px] leading-none text-ink md:text-[52px]">
        {number}
      </span>
      <span className="text-[14px] leading-[1.5] text-ink-soft md:text-[15px]">
        {label}
      </span>
      {source &&
        (sourceUrl ? (
          <a
            href={sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 link-underline"
          >
            Source: {source}
          </a>
        ) : (
          <figcaption className="text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
            Source: {source}
          </figcaption>
        ))}
    </figure>
  );
}
