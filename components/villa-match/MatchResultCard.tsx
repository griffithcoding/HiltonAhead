// components/villa-match/MatchResultCard.tsx
'use client';

import Image from 'next/image';
import { neighborhoods } from '@/data/neighborhoods';
import type { MatchArchetype } from '@/data/matchArchetypes';

type Props = {
  archetype: MatchArchetype;
  variant: 'top' | 'alt';
};

type Neighborhood = ReturnType<typeof neighborhoods.find>;

export default function MatchResultCard({ archetype, variant }: Props) {
  const neighborhood = neighborhoods.find((n) => n.slug === archetype.neighborhoodSlug);
  const filteredProperties = pickProperties(archetype, neighborhood);

  if (variant === 'alt') {
    return (
      <div className="border border-ink/15 bg-white p-5 transition-colors hover:border-coral">
        <div className="eyebrow text-ink-soft">{neighborhood?.name ?? 'Hilton Head'}</div>
        <div className="display mt-2 text-[18px] leading-[1.2] text-ink">
          {archetype.headline}
        </div>
        <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
          {firstSentence(archetype.whyItFits)}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/15 bg-cream p-7 md:p-9">
      <div className="eyebrow text-coral">Your best match</div>
      <h3 className="display mt-3 text-[28px] leading-[1.15] text-ink md:text-[34px]">
        We&rsquo;d put you in <span className="display-italic">{archetype.headline}.</span>
      </h3>

      {neighborhood?.hero && (
        <div className="mt-7 overflow-hidden">
          <Image
            src={neighborhood.hero.src}
            alt={neighborhood.hero.alt}
            width={1400}
            height={900}
            className="h-auto w-full"
            priority={false}
          />
        </div>
      )}

      <p className="mt-7 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">
        {archetype.whyItFits}
      </p>

      {filteredProperties.length > 0 && (
        <div className="mt-7">
          <div className="eyebrow text-ink-soft">Buildings we&rsquo;d shortlist</div>
          <ul className="mt-3 space-y-2">
            {filteredProperties.map((p) => (
              <li key={p.name} className="text-[14px] leading-[1.6] text-ink">
                <strong className="font-medium">{p.name}</strong>
                <span className="text-ink-soft"> &mdash; {p.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 border-t border-ink/15 pt-5">
        <div className="eyebrow text-ink-soft">What to watch out for</div>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
          {archetype.whatToWatchOut}
        </p>
      </div>
    </div>
  );
}

function pickProperties(
  archetype: MatchArchetype,
  neighborhood: Neighborhood,
) {
  if (!neighborhood) return [];
  if (archetype.propertyNameFilters && archetype.propertyNameFilters.length > 0) {
    const filterSet = new Set(archetype.propertyNameFilters);
    return neighborhood.properties.filter((p) => filterSet.has(p.name)).slice(0, 3);
  }
  return neighborhood.properties.slice(0, 2);
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]*[.!?]/);
  return m ? m[0].trim() : text;
}
