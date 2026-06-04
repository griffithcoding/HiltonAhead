import Link from 'next/link';
import { Divider, SectionHead } from '@/components/ui/Ornament';
import TldrBlock from '@/components/ui/TldrBlock';
import AffiliateCard from '@/components/affiliate/AffiliateCard';
import AffiliateDisclosure from '@/components/affiliate/AffiliateDisclosure';
import type { Comparison, ComparisonDimension } from '@/data/comparisons';
import { COMPARISONS } from '@/data/comparisons';

/**
 * Shared layout for comparison pages — handles 2-way and 3-way comparisons.
 *
 * Render order (top → bottom):
 *   1. Breadcrumb (caller-supplied)
 *   2. Hero with H1 + tldr (Speakable target: `.tldr-block`)
 *   3. Option summary cards (one per option)
 *   4. Dimension table
 *   5. "Pick X if..." verdict cards
 *   6. FAQ
 *   7. Related comparisons
 *
 * The JSON-LD schemas (Article + BreadcrumbList + FAQPage + Speakable + ItemList)
 * are emitted by the caller page wrapper — not this component — so each page
 * can supply its own breadcrumb path without prop-drilling.
 */
export default function ComparisonLanding({ comparison }: { comparison: Comparison }) {
  const { options, dimensions, faqs, relatedSlugs } = comparison;
  const optionCount = options.length;
  // Grid columns for the option-summary section + verdict cards:
  // 2-way → 1 col mobile, 2 cols desktop
  // 3-way → 1 col mobile, 3 cols desktop
  const optionGridCols =
    optionCount === 3
      ? 'grid-cols-1 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2';

  const related = (relatedSlugs ?? [])
    .map((slug) => COMPARISONS.find((c) => c.slug === slug))
    .filter((c): c is Comparison => Boolean(c));

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-10 md:py-16">
      {/* Hero */}
      <header className="mt-2 md:mt-6">
        <span className="eyebrow-coral eyebrow">{comparison.eyebrow}</span>
        <h1 className="display mt-5 text-balance text-[44px] leading-[1.02] text-ink md:text-[64px] lg:text-[72px]">
          {comparison.h1Plain}{' '}
          <span className="display-italic text-coral">{comparison.h1Italic}</span>
        </h1>

        <TldrBlock label="Direct answer">{comparison.tldr}</TldrBlock>
      </header>

      <Divider ornament="compass" className="my-12 md:my-16 text-gold" />

      {/* Option summary cards */}
      <section aria-labelledby="options-heading">
        <SectionHead
          number="№ 01"
          eyebrow="The choices"
          plain="The"
          italic={optionCount === 3 ? 'three options.' : 'two options.'}
        />
        <ul
          id="options-heading"
          className={`mt-12 grid gap-8 md:gap-10 ${optionGridCols}`}
        >
          {options.map((opt, i) => (
            <li
              key={opt.name}
              className="flex flex-col rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-7 md:p-8"
            >
              <span className="eyebrow text-sunset">Option {String.fromCharCode(65 + i)}</span>
              <h3 className="mt-3 font-display text-[28px] leading-tight text-ink md:text-[32px]">
                {opt.href ? (
                  <Link href={opt.href} className="link-underline hover:text-coral">
                    {opt.name}
                  </Link>
                ) : (
                  opt.name
                )}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft md:text-[16px]">
                {opt.subtitle}
              </p>
              {opt.summary && (
                <p className="mt-4 text-[14px] italic leading-[1.6] text-ink-soft/80">
                  {opt.summary}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Dimensions table */}
      <section aria-labelledby="dimensions-heading" className="mt-24 md:mt-32">
        <SectionHead
          number="№ 02"
          eyebrow="Side-by-side"
          plain="Every dimension,"
          italic="compared."
        />

        <p className="mt-8 max-w-[760px] text-[17px] leading-[1.7] text-ink-soft md:text-[19px]">
          Each row covers one decision dimension. The highlighted column wins
          that dimension; ties get a tie label. Commentary is one sentence with
          a concrete number or place name.
        </p>

        {/* Desktop: real table */}
        <div
          id="dimensions-heading"
          className="mt-12 hidden md:block overflow-hidden rounded-md border border-ocean-deep/15"
        >
          <table className="w-full table-fixed border-collapse text-left text-[14px] md:text-[15px]">
            <thead>
              <tr className="bg-sand-soft text-ink">
                <th
                  scope="col"
                  className="w-[180px] border-b border-ocean-deep/15 px-5 py-4 text-[12px] uppercase tracking-[0.18em] text-ink-soft"
                >
                  Dimension
                </th>
                {options.map((opt) => (
                  <th
                    key={opt.name}
                    scope="col"
                    className="border-b border-l border-ocean-deep/15 px-5 py-4 font-display text-[17px] text-ink"
                  >
                    {opt.name}
                  </th>
                ))}
                <th
                  scope="col"
                  className="w-[42%] border-b border-l border-ocean-deep/15 px-5 py-4 text-[12px] uppercase tracking-[0.18em] text-ink-soft"
                >
                  Commentary
                </th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((d) => (
                <DimensionRow
                  key={d.name}
                  dimension={d}
                  optionCount={optionCount}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked dimension cards */}
        <ul className="mt-10 grid grid-cols-1 gap-6 md:hidden">
          {dimensions.map((d) => (
            <li
              key={d.name}
              className="rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-5"
            >
              <p className="eyebrow text-sunset">{d.name}</p>
              <ul className="mt-3 space-y-2">
                {options.map((opt, i) => (
                  <li
                    key={opt.name}
                    className={`flex flex-col gap-1 rounded-sm px-3 py-2 text-[14px] leading-[1.5] ${
                      isWinningIndex(d.advantage, i, optionCount)
                        ? 'bg-coral/8 ring-1 ring-coral/30'
                        : ''
                    }`}
                  >
                    <span className="text-[12px] uppercase tracking-[0.16em] text-ink-soft">
                      {opt.name}
                    </span>
                    <span className="text-ink">{d.values[i]}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{d.commentary}</p>
            </li>
          ))}
        </ul>
      </section>

      <Divider ornament="palmetto" className="my-20 text-gold" />

      {/* Verdict — "Pick X if" */}
      <section aria-labelledby="verdict-heading" className="mt-2">
        <SectionHead
          number="№ 03"
          eyebrow="Verdict"
          plain="Pick this if,"
          italic="pick that if."
        />

        <ul
          id="verdict-heading"
          className={`mt-12 grid gap-8 md:gap-10 ${optionGridCols}`}
        >
          {options.map((opt) => (
            <li
              key={`pick-${opt.name}`}
              className="quick-fact flex flex-col rounded-md border-l-2 border-coral bg-sand-soft/40 p-7 md:p-8"
            >
              <p className="eyebrow text-sunset">Pick {opt.name} if</p>
              <ul className="mt-4 space-y-3 text-[15px] leading-[1.65] text-ink md:text-[16px]">
                {opt.pickIf.map((bullet, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-coral" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* If you'd rather book it yourself — one Stay22 card that compares
          live prices across Booking, Vrbo, Airbnb, and Hotels.com for
          Hilton Head, our destination of expertise. */}
      <section
        aria-label="If you'd rather book it yourself"
        className="mt-24 md:mt-32"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="eyebrow text-coral">If you’d rather book it yourself</h3>
        </div>
        <AffiliateDisclosure variant="inline" className="mb-5" />
        <div className="max-w-[640px]">
          <AffiliateCard
            programId="stay22"
            placement={`compare/${comparison.slug}/stay22`}
            headline="Compare every Hilton Head booking site"
            description="One map across Booking, Vrbo, Airbnb, and Hotels.com — live prices side by side for the same dates, so you can see what each site actually charges before you commit."
            cta="Compare stays →"
          />
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mt-24 md:mt-32">
        <SectionHead
          number="№ 04"
          eyebrow="Common questions"
          plain="What people"
          italic="actually ask."
        />

        <dl className="mt-12 space-y-8 md:space-y-10">
          {faqs.map((qa) => (
            <div
              key={qa.question}
              className="rounded-md border border-ocean-deep/15 bg-sand-soft/30 p-6 md:p-7"
            >
              <dt className="font-display text-[22px] leading-tight text-ink md:text-[24px]">
                {qa.question}
              </dt>
              <dd className="faq-answer mt-3 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
                {qa.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related comparisons */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24 md:mt-32">
          <SectionHead
            number="№ 05"
            eyebrow="Keep comparing"
            plain="Other"
            italic="comparisons."
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {related.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="group block rounded-md border border-ocean-deep/15 bg-sand-soft/40 p-6 transition-colors hover:border-coral/40"
                >
                  <p className="eyebrow text-sunset">Comparison</p>
                  <h3 className="mt-2 font-display text-[22px] leading-tight text-ink group-hover:text-coral">
                    {c.h1}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
                    {c.metaDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Final concierge CTA */}
      <section className="mt-24 md:mt-32 rounded-md border border-coral/30 bg-coral/5 p-8 md:p-10">
        <p className="eyebrow text-sunset">Still picking?</p>
        <h2 className="mt-3 font-display text-[28px] leading-tight text-ink md:text-[36px]">
          Tell us your group + dates, and we&apos;ll send the honest answer back same day.
        </h2>
        <p className="mt-4 max-w-[640px] text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">
          We plan trips on Hilton Head full-time. Two minutes of intake gets you
          a real recommendation by email — no obligation, no sales pitch, and
          we&apos;ll tell you if a consultant isn&apos;t worth it for your trip size.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/itinerary"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3 text-[14px] uppercase tracking-[0.16em] text-sand hover:bg-coral transition-colors"
          >
            Get a recommendation
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-sm border border-ink/40 px-6 py-3 text-[14px] uppercase tracking-[0.16em] text-ink hover:border-coral hover:text-coral transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────

function DimensionRow({
  dimension,
  optionCount,
}: {
  dimension: ComparisonDimension;
  optionCount: number;
}) {
  return (
    <tr className="border-b border-ocean-deep/10 last:border-b-0">
      <th
        scope="row"
        className="bg-sand-soft/50 px-5 py-4 align-top font-sans text-[14px] font-medium text-ink"
      >
        {dimension.name}
      </th>
      {dimension.values.map((value, i) => {
        const wins = isWinningIndex(dimension.advantage, i, optionCount);
        return (
          <td
            key={i}
            className={`border-l border-ocean-deep/10 px-5 py-4 align-top text-[14px] leading-[1.5] text-ink md:text-[15px] ${
              wins ? 'bg-coral/8 ring-inset ring-1 ring-coral/30' : ''
            }`}
          >
            {value}
            {wins && (
              <span
                aria-label="Advantage"
                className="ml-2 inline-block rounded-sm bg-coral/15 px-2 py-[2px] text-[10px] uppercase tracking-[0.16em] text-coral"
              >
                ✓ edge
              </span>
            )}
          </td>
        );
      })}
      <td className="border-l border-ocean-deep/10 px-5 py-4 align-top text-[13px] leading-[1.55] text-ink-soft md:text-[14px]">
        {dimension.commentary}
        {dimension.advantage === 'tie' && (
          <span
            aria-label="Tied"
            className="ml-2 inline-block rounded-sm bg-ink/10 px-2 py-[2px] text-[10px] uppercase tracking-[0.16em] text-ink-soft"
          >
            Tie
          </span>
        )}
      </td>
    </tr>
  );
}

function isWinningIndex(
  advantage: ComparisonDimension['advantage'],
  index: number,
  optionCount: number,
): boolean {
  if (advantage === 'tie') return false;
  if (advantage === 'left') return index === 0;
  if (advantage === 'right') return index === optionCount - 1;
  if (advantage === 'middle') return optionCount === 3 && index === 1;
  return false;
}
