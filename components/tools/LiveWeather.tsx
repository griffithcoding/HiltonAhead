import Link from 'next/link';
import { getHiltonHeadWeather } from '@/app/lib/weather';

/**
 * LiveWeather — async server component.
 *
 * Renders current Hilton Head conditions + 7-period mini-forecast from
 * the National Weather Service. Underlying fetch is cached for 30 min.
 * On any failure, renders a graceful fallback that keeps the page useful.
 */
export default async function LiveWeather() {
  const data = await getHiltonHeadWeather();

  if (!data.ok) {
    return (
      <section className="border border-ink/15 bg-cream-deep/30 px-6 py-6">
        <div className="eyebrow text-sunset">Live conditions</div>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink">
          Live weather is temporarily unavailable. See our{' '}
          <Link href="/hilton-head-weather" className="link-underline">
            month-by-month weather guide
          </Link>{' '}
          for 30-year averages and what each month feels like on the island.
        </p>
      </section>
    );
  }

  const { current, periods } = data;

  return (
    <section className="border border-ocean-deep/15 bg-cream-deep/40 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow text-sunset">Right now on Hilton Head</div>
          <h3 className="display mt-2 text-[22px] leading-[1.15] text-ink md:text-[26px]">
            {current.shortForecast}
          </h3>
        </div>
        <div className="text-right">
          <div className="display text-[36px] leading-none text-ocean md:text-[44px]">
            {current.temperature}°{current.temperatureUnit}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
            Wind {current.wind}
          </div>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {periods.map((p) => (
          <li
            key={p.name}
            className="border border-ink/10 bg-cream/60 px-3 py-3"
          >
            <div className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              {p.name}
            </div>
            <div className="display mt-1 text-[20px] leading-none text-ink">
              {p.temperature}°{p.temperatureUnit}
            </div>
            <div className="mt-1 text-[11px] leading-[1.4] text-ink-soft">
              {p.shortForecast}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] leading-[1.5] text-ink-soft">
        Source: U.S. National Weather Service (api.weather.gov). Updated every 30
        minutes. Detailed monthly averages live in our{' '}
        <Link href="/hilton-head-weather" className="link-underline">
          weather-by-month guide
        </Link>
        .
      </p>
    </section>
  );
}
