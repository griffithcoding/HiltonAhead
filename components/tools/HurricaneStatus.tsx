import Link from 'next/link';
import { getHurricaneStatus } from '@/app/lib/hurricane';

/**
 * HurricaneStatus — async server component.
 *
 * Renders a green "0 active Atlantic storms" badge OR an amber list of
 * named systems during Atlantic hurricane season (Jun–Nov). Returns null
 * the rest of the year — clean Dec–May post layout, zero render cost.
 */
export default async function HurricaneStatus() {
  const data = await getHurricaneStatus();

  if (!data.ok) {
    return (
      <aside className="border-l-2 border-ink/20 bg-cream-deep/30 px-5 py-4">
        <div className="eyebrow text-ink-soft">Hurricane status</div>
        <p className="mt-2 text-[13px] leading-[1.6] text-ink">
          Live storm feed unavailable. See the{' '}
          <Link
            href="/blog/hilton-head-2026-hurricane-forecast"
            className="link-underline"
          >
            2026 hurricane forecast
          </Link>{' '}
          or check{' '}
          <a
            href="https://www.nhc.noaa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            nhc.noaa.gov ↗
          </a>
          .
        </p>
      </aside>
    );
  }

  if (!data.inSeason) {
    // Out of season (Dec–May): render nothing
    return null;
  }

  const { activeStorms } = data;

  if (activeStorms.length === 0) {
    return (
      <aside className="border-l-2 border-palm bg-palm/10 px-5 py-4">
        <div className="eyebrow text-palm-deep">Atlantic basin · live</div>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink">
          <strong>Zero active storms</strong> in the Atlantic basin right now.
          For the full season outlook, see our{' '}
          <Link
            href="/blog/hilton-head-2026-hurricane-forecast"
            className="link-underline"
          >
            2026 hurricane forecast
          </Link>
          .
        </p>
      </aside>
    );
  }

  return (
    <aside className="border-l-2 border-coral bg-coral/10 px-5 py-4">
      <div className="eyebrow text-coral-deep">
        Atlantic basin · {activeStorms.length} active{' '}
        {activeStorms.length === 1 ? 'system' : 'systems'}
      </div>
      <ul className="mt-3 space-y-2">
        {activeStorms.map((s) => (
          <li key={s.id} className="text-[14px] leading-[1.5] text-ink">
            <strong>{s.classification} {s.name}</strong>
            {s.intensityKt ? ` · ${s.intensityKt} kt sustained winds` : ''}
            {s.advisoryUrl && (
              <>
                {' · '}
                <a
                  href={s.advisoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  NHC advisory ↗
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] leading-[1.5] text-ink-soft">
        See our{' '}
        <Link
          href="/blog/hilton-head-2026-hurricane-forecast"
          className="link-underline"
        >
          2026 hurricane forecast
        </Link>{' '}
        for evacuation logistics and trip-insurance guidance.
      </p>
    </aside>
  );
}
