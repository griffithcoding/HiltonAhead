/**
 * RBC Heritage 2027 countdown banner.
 *
 * Server component. Computes days remaining to the 2027 tournament
 * window (Apr 12–18, 2027). Renders nothing once the window closes.
 *
 * Used as a `kind: 'embed'` block at the top of golf / Heritage posts.
 */

const TOURNAMENT_START = new Date('2027-04-12T00:00:00-04:00');
const TOURNAMENT_END = new Date('2027-04-18T23:59:59-04:00');

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HeritageCountdown({
  variant = 'banner',
}: {
  variant?: 'banner' | 'inline';
}) {
  const now = new Date();
  if (now > TOURNAMENT_END) return null;

  const isLive = now >= TOURNAMENT_START;
  const days = isLive
    ? daysBetween(now, TOURNAMENT_END) + 1
    : daysBetween(now, TOURNAMENT_START);

  const headline = isLive
    ? 'Heritage week is live'
    : days === 0
      ? 'Heritage tees off today'
      : `${days} ${days === 1 ? 'day' : 'days'} until the 2027 RBC Heritage`;

  const sub = isLive
    ? `Final round Sunday, Apr 18 · Plaid jackets on the 18th green`
    : `Apr 12–18, 2027 · Harbour Town Golf Links · Stay-and-play windows close ~9 months out`;

  if (variant === 'inline') {
    return (
      <p className="not-prose my-4 inline-flex flex-wrap items-baseline gap-2 text-[13px] leading-[1.5] text-ink-soft">
        <span className="display text-[15px] text-ink">{headline}.</span>
        <span>{sub}</span>
      </p>
    );
  }

  return (
    <aside
      aria-label="2027 RBC Heritage countdown"
      className="not-prose my-8 overflow-hidden rounded-md border border-coral/40"
    >
      <div className="tartan-pill flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7 sm:py-6">
        <div className="min-w-0">
          <div className="eyebrow text-coral-deep">RBC Heritage · 2027</div>
          <p className="display mt-1.5 text-[22px] leading-[1.15] text-ink md:text-[26px]">
            {headline}
          </p>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-ink-soft">
            {sub}
          </p>
        </div>
        <a
          href="/guides/2027-rbc-heritage"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink bg-ink px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-coral hover:border-coral sm:self-auto"
        >
          Get the free 2027 Heritage Kit
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  );
}
