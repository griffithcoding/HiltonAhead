import { insiderProof } from '@/data/insiderProof';

/**
 * Local-expert proof section. Stats row on top, neighborhoods grid below.
 * Builds credibility for the "planned by a local" positioning.
 */
export default function InsiderProof() {
  return (
    <section id="how-it-works" className="mt-16">
      <div className="mb-3.5 text-sm uppercase tracking-[0.15em] text-zinc-400">
        {insiderProof.eyebrow}
      </div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="max-w-[620px] text-[22px] font-medium tracking-tight md:text-[26px]">
          {insiderProof.heading.plain}{' '}
          <span className="text-primary">{insiderProof.heading.accent}</span>
        </h2>
        <p className="max-w-[360px] text-[13px] leading-[1.5] text-zinc-400">
          {insiderProof.subheading}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {insiderProof.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[18px] border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-sm"
          >
            <div className="text-[28px] font-semibold text-primary md:text-[32px]">
              {stat.value}
            </div>
            <div className="mt-1 text-[12px] text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Neighborhoods we know cold
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insiderProof.localSpots.map((spot) => (
            <div
              key={spot.neighborhood}
              className="rounded-[16px] border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-sm"
            >
              <div className="text-[14px] font-medium text-zinc-100">
                {spot.neighborhood}
              </div>
              <p className="mt-1 text-[12px] leading-[1.5] text-zinc-400">{spot.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
