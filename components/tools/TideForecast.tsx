import { getHiltonHeadTides } from '@/app/lib/tides';

/**
 * TideForecast — async server component.
 *
 * Renders the next 7 days of high/low tide predictions for Fort Pulaski,
 * GA (NOAA station 8670870). Hilton Head beaches lag the prediction by
 * ~25 minutes — disclosed in the footer.
 */
export default async function TideForecast() {
  const data = await getHiltonHeadTides();

  if (!data.ok) {
    return (
      <section className="border border-ink/15 bg-cream-deep/30 px-6 py-6">
        <div className="eyebrow text-sunset">Tide forecast</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink">
          NOAA tide predictions are temporarily unavailable. View them
          directly at{' '}
          <a
            href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8670870"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            tidesandcurrents.noaa.gov ↗
          </a>
        </p>
      </section>
    );
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <section className="border border-ocean-deep/15 bg-cream-deep/40 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow text-sunset">7-day tide forecast</div>
          <h3 className="display mt-2 text-[22px] leading-[1.15] text-ink md:text-[26px]">
            Plan beach time, dolphin tours, and shrimping around the tide.
          </h3>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-left text-[13px]">
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-ink/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Day
              </th>
              <th
                scope="col"
                className="border-b border-ink/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
              >
                High tides
              </th>
              <th
                scope="col"
                className="border-b border-ink/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
              >
                Low tides
              </th>
            </tr>
          </thead>
          <tbody>
            {data.days.map((day) => {
              const highs = day.events.filter((e) => e.type === 'H');
              const lows = day.events.filter((e) => e.type === 'L');
              return (
                <tr
                  key={day.dateLabel}
                  className="even:bg-cream/40"
                >
                  <td className="border-b border-ink/10 px-3 py-3 font-medium text-ink">
                    {day.dateLabel}
                  </td>
                  <td className="border-b border-ink/10 px-3 py-3 text-ink-soft">
                    {highs.length === 0
                      ? '—'
                      : highs
                          .map(
                            (h) =>
                              `${formatTime(h.time)} (${h.heightFeet.toFixed(1)} ft)`,
                          )
                          .join('  ·  ')}
                  </td>
                  <td className="border-b border-ink/10 px-3 py-3 text-ink-soft">
                    {lows.length === 0
                      ? '—'
                      : lows
                          .map(
                            (l) =>
                              `${formatTime(l.time)} (${l.heightFeet.toFixed(1)} ft)`,
                          )
                          .join('  ·  ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11px] leading-[1.5] text-ink-soft">
        Predictions from NOAA Fort Pulaski station (8670870). Hilton Head
        beaches lag predictions by ~25 minutes; surf conditions can shift
        these times another 10-15 minutes. Cached hourly.
      </p>
    </section>
  );
}
