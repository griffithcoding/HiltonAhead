import { Suspense, type ReactNode } from 'react';
import type { PostBlock } from '@/data/posts';
import { getCourseBySlug } from '@/data/golfCourses';
import CourseCard from '@/components/golf/CourseCard';
import HeritageCountdown from '@/components/tools/HeritageCountdown';
import CourseMatchQuiz from '@/components/tools/CourseMatchQuiz';
import CourseMap from '@/components/tools/CourseMap';
import StayAndPlayEstimator from '@/components/tools/StayAndPlayEstimator';
import TeeTimeFinder from '@/components/tools/TeeTimeFinder';
import TripWindowFinder from '@/components/tools/TripWindowFinder';
import LiveWeather from '@/components/tools/LiveWeather';
import TideForecast from '@/components/tools/TideForecast';
import HurricaneStatus from '@/components/tools/HurricaneStatus';

/**
 * Renders a Post's `body` array of content blocks.
 * Content is author-controlled in `data/posts.ts`, so inline HTML
 * in paragraphs / list items is trusted.
 */
export default function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="prose-blog">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block: PostBlock, key: number | string): ReactNode {
  switch (block.kind) {
    case 'h2':
      return <h2 key={key}>{block.text}</h2>;
    case 'h3':
      return <h3 key={key}>{block.text}</h3>;
    case 'p':
      return (
        <p key={key} dangerouslySetInnerHTML={{ __html: block.html }} />
      );
    case 'ul':
      return (
        <ul key={key}>
          {block.items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={key}>
          {block.items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
      );
    case 'callout':
      return <Callout key={key} label={block.label} html={block.html} />;
    case 'quote':
      return (
        <Quote key={key} html={block.html} attribution={block.attribution} />
      );
    case 'table':
      return <DataTable key={key} block={block} />;
    case 'faq':
      return <FaqBlock key={key} block={block} />;
    case 'tier':
      return <TierBlock key={key} block={block} />;
    case 'embed':
      return <EmbedBlock key={key} block={block} />;
    case 'section':
      return <SectionBlock key={key} block={block} />;
  }
}

function SectionBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'section' }>;
}) {
  return (
    <details
      open={block.defaultOpen ?? false}
      className="group not-prose my-10 border-y border-ink/15"
    >
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 marker:hidden">
        <div className="min-w-0">
          {block.eyebrow && (
            <div className="eyebrow text-coral">{block.eyebrow}</div>
          )}
          <h2 className="display mt-1.5 text-[24px] leading-[1.15] text-ink md:text-[30px]">
            {block.title}
          </h2>
          {block.summary && (
            <p className="mt-1.5 max-w-[640px] text-[13.5px] leading-[1.55] text-ink-soft md:text-[14.5px]">
              {block.summary}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className="relative mt-2 h-4 w-4 shrink-0"
        >
          <span className="absolute left-0 top-[7px] h-[1.5px] w-full bg-ink" />
          <span className="absolute left-[7px] top-0 h-full w-[1.5px] bg-ink transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
        </span>
      </summary>
      <div className="prose-blog pb-8">
        {block.blocks.map((child, i) => renderBlock(child, i))}
      </div>
    </details>
  );
}

function EmbedBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'embed' }>;
}) {
  switch (block.component) {
    // Golf / Heritage page tools (PascalCase ids)
    case 'HeritageCountdown':
      return <HeritageCountdown />;
    case 'CourseMatchQuiz':
      return <CourseMatchQuiz />;
    case 'CourseMap':
      return <CourseMap />;
    case 'StayAndPlayEstimator':
      return <StayAndPlayEstimator />;
    case 'TeeTimeFinder':
      return <TeeTimeFinder />;
    // Best-time-to-visit tools (kebab-case ids — the original best-time
    // tools shipped with this naming and we keep it for data compatibility)
    case 'trip-window-finder':
      return (
        <div className="not-prose my-12 min-h-[420px]">
          <TripWindowFinder />
        </div>
      );
    case 'live-weather':
      return (
        <div className="not-prose my-12 min-h-[260px]">
          <Suspense fallback={<LiveWeatherFallback />}>
            <LiveWeather />
          </Suspense>
        </div>
      );
    case 'tide-forecast':
      return (
        <div className="not-prose my-12 min-h-[360px]">
          <Suspense fallback={<TideForecastFallback />}>
            <TideForecast />
          </Suspense>
        </div>
      );
    case 'hurricane-status':
      return (
        <div className="not-prose my-8">
          <Suspense fallback={null}>
            <HurricaneStatus />
          </Suspense>
        </div>
      );
  }
}

function EmbedSkeleton({ label }: { label: string }) {
  return (
    <div className="border border-ink/10 bg-cream-deep/30 px-5 py-6 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
      {label}…
    </div>
  );
}

// Fallbacks for live data embeds. Rendered while the upstream NWS/NOAA
// fetch streams in via Suspense. They contain the same factual content
// (typical conditions, tide pattern) the live data will display, so any
// crawler indexing the streamed-but-incomplete HTML still gets useful,
// keyword-relevant content instead of a "Loading…" spinner.
function LiveWeatherFallback() {
  return (
    <section className="border border-ink/15 bg-cream-deep/30 px-6 py-6">
      <div className="eyebrow text-sunset">Live Hilton Head conditions</div>
      <p className="mt-3 text-[14px] leading-[1.6] text-ink">
        Hilton Head weather averages 58&deg;F in January, 81&deg;F in May,
        90&deg;F in July, and 77&deg;F in October. Ocean temperature peaks at
        84&deg;F in July&ndash;August and stays swimmable (73&deg;F) through
        mid-October. Live current-conditions feed loading from the National
        Weather Service&hellip;
      </p>
    </section>
  );
}

function TideForecastFallback() {
  return (
    <section className="border border-ink/15 bg-cream-deep/30 px-6 py-6">
      <div className="eyebrow text-sunset">Hilton Head 7-day tide forecast</div>
      <p className="mt-3 text-[14px] leading-[1.6] text-ink">
        Hilton Head sees two high and two low tides per day on a roughly
        12-hour 25-minute cycle. Tide range averages 6&ndash;8 feet, with
        spring tides near the new and full moon running 8&ndash;9 feet.
        Best dolphin-watching is mid-incoming tide; best shrimping and
        shell-finding is the hour around low tide. Live NOAA 7-day
        prediction loading&hellip;
      </p>
    </section>
  );
}

function DataTable({
  block,
}: {
  block: Extract<PostBlock, { kind: 'table' }>;
}) {
  return (
    <figure className="not-prose group relative my-10">
      {/* Mobile scroll hint — fade on the right edge that disappears on md+ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cream to-transparent md:hidden"
      />
      <div className="overflow-x-auto border-y border-ink/15">
        <table className="w-full min-w-[620px] border-collapse text-left text-[13px] md:text-[14px]">
        {block.caption && (
          <caption className="eyebrow border-b border-ink/10 py-3 text-left text-sunset">
            {block.caption}
          </caption>
        )}
        <thead>
          <tr>
            {block.headers.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="border-b border-ink/20 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink md:px-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="even:bg-cream-deep/30">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-ink/10 px-3 py-3 leading-[1.5] md:px-4 ${
                    j === 0 ? 'font-medium text-ink' : 'text-ink-soft'
                  }`}
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <div
        aria-hidden="true"
        className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-soft md:hidden"
      >
        ← scroll →
      </div>
    </figure>
  );
}

function FaqBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'faq' }>;
}) {
  return (
    <section className="not-prose my-12 border-y border-ink/20 py-10">
      {block.label && (
        <div className="eyebrow mb-6 text-sunset">{block.label}</div>
      )}
      <dl className="divide-y divide-ink/10">
        {block.items.map((item, i) => (
          <div key={i} className="py-6 first:pt-0 last:pb-0">
            <dt className="display text-[18px] leading-[1.25] text-ink md:text-[20px]">
              {item.q}
            </dt>
            <dd
              className="mt-3 max-w-[640px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]"
              dangerouslySetInnerHTML={{ __html: item.a }}
            />
          </div>
        ))}
      </dl>
    </section>
  );
}

function Callout({ label, html }: { label?: string; html: string }) {
  return (
    <aside className="not-prose my-8 border-l-2 border-sunset bg-cream-deep/40 px-5 py-4 md:px-6 md:py-5">
      {label && (
        <div className="eyebrow mb-2 text-sunset">{label}</div>
      )}
      <p
        className="text-[14px] leading-[1.7] text-ink md:text-[15px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </aside>
  );
}

function Quote({ html, attribution }: { html: string; attribution?: string }) {
  return (
    <blockquote className="not-prose my-10 border-t border-b border-ink/15 py-6">
      <p
        className="display-italic max-w-[620px] text-[20px] leading-[1.4] text-ink md:text-[24px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {attribution && (
        <cite className="eyebrow mt-4 block text-ink-soft">
          {attribution}
        </cite>
      )}
    </blockquote>
  );
}

const TIER_STYLES = {
  gold: {
    badge: 'bg-gold text-cream',
    accent: 'text-gold',
    label: 'S-Tier',
  },
  primary: {
    badge: 'bg-sunset text-cream',
    accent: 'text-sunset',
    label: 'A-Tier',
  },
  zinc: {
    badge: 'bg-ink text-cream',
    accent: 'text-ink',
    label: 'B-Tier',
  },
  rose: {
    badge: 'bg-transparent text-ink border border-ink',
    accent: 'text-ink-soft',
    label: 'Skip',
  },
} as const;

function TierBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'tier' }>;
}) {
  const s = TIER_STYLES[block.accent];

  // When the tier is wired to course slugs, render structured CourseCards
  // instead of the plain numbered list. The `items` array stays in sync
  // for schema generation in the blog page template.
  const courses = block.courseSlugs
    ? block.courseSlugs
        .map((slug) => getCourseBySlug(slug))
        .filter((c): c is NonNullable<typeof c> => !!c)
    : null;

  return (
    <section className="not-prose my-12 border-y border-ink/20 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-5">
          <span
            className={`inline-flex items-center px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${s.badge}`}
          >
            {block.label}
          </span>
          {block.subtitle && (
            <span className="display-italic text-[16px] leading-[1.25] text-ink-soft md:text-[18px]">
              {block.subtitle}
            </span>
          )}
        </div>
        <span className={`eyebrow ${s.accent}`}>
          {block.items.length} picks
        </span>
      </header>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, i) => (
            <CourseCard key={course.slug} course={course} rank={i + 1} />
          ))}
        </div>
      ) : (
        <ol className="divide-y divide-ink/10">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-5 py-6 md:grid-cols-[64px_1fr] md:gap-8"
            >
              <span
                className={`section-number text-[24px] leading-none md:text-[32px] ${s.accent}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="display text-[19px] leading-[1.2] text-ink md:text-[22px]">
                    {item.name}
                  </h4>
                  {item.meta && (
                    <span className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">
                      {item.meta}
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-[620px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                  {item.blurb}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
