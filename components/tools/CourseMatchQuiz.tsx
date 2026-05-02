'use client';

import { useMemo, useState } from 'react';
import { golfCourses, type GolfCourse } from '@/data/golfCourses';

type HandicapBand = 'low' | 'mid' | 'high';
type Scenery = 'ocean' | 'marsh' | 'forest' | 'no-pref';
type AccessFlex = 'public-only' | 'resort-ok';
type Splurge = 'value' | 'mid' | 'splurge';

const HANDICAP_LABEL: Record<HandicapBand, string> = {
  low: 'Single-digit',
  mid: '10–18',
  high: '19+',
};
const SCENERY_LABEL: Record<Scenery, string> = {
  ocean: 'Ocean',
  marsh: 'Marsh',
  forest: 'Forest',
  'no-pref': 'No preference',
};
const ACCESS_LABEL: Record<AccessFlex, string> = {
  'public-only': 'Public-play only',
  'resort-ok': 'Resort guests OK',
};
const SPLURGE_LABEL: Record<Splurge, string> = {
  value: 'Under $200',
  mid: '$200–$300',
  splurge: 'Splurge OK ($300+)',
};

type Inputs = {
  handicap: HandicapBand;
  scenery: Scenery;
  access: AccessFlex;
  splurge: Splurge;
  daysAvailable: number;
};

function scoreCourse(course: GolfCourse, inputs: Inputs): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Tier weight (S > A > B)
  if (course.tier === 'S') score += 30;
  else if (course.tier === 'A') score += 18;
  else score += 8;

  // Access compatibility — hard gate
  if (inputs.access === 'public-only' && course.access === 'resort-guests') {
    return { score: -1, reasons: ['Requires resort stay'] };
  }
  if (course.access === 'public') {
    score += 6;
    if (inputs.access === 'public-only') reasons.push('Open to public play');
  }

  // Budget alignment — uses peak fee
  const ceiling = inputs.splurge === 'value' ? 200 : inputs.splurge === 'mid' ? 300 : 600;
  if (course.peakFeeUsd <= ceiling) {
    score += 18;
    if (inputs.splurge === 'value' && course.peakFeeUsd <= 175)
      reasons.push(`Within budget at $${course.peakFeeUsd}`);
  } else {
    score -= 12;
  }

  // Scenery preference
  if (inputs.scenery === 'ocean' && course.oceanViews) {
    score += 16;
    reasons.push('Ocean views you asked for');
  }
  if (inputs.scenery === 'marsh' && course.marshViews) {
    score += 14;
    reasons.push('Marsh-side play');
  }
  if (inputs.scenery === 'forest' && course.forestViews) {
    score += 12;
    reasons.push('Lowcountry pines + live oaks');
  }

  // Handicap fit — softer mapping
  if (inputs.handicap === 'high') {
    if (course.peakFeeUsd > 350) score -= 10;
    if (course.slug === 'arthur-hills-palmetto-dunes' || course.slug === 'old-south' || course.slug === 'oyster-reef')
      reasons.push('Forgiving for higher handicaps');
  }
  if (inputs.handicap === 'low') {
    if (course.tier === 'S') {
      score += 8;
      reasons.push('A real test for single-digit players');
    }
  }

  // Days-available bonus — fewer days = prefer S-tier
  if (inputs.daysAvailable <= 2 && course.tier === 'S') score += 10;
  if (inputs.daysAvailable >= 5 && course.tier === 'B') score += 4;

  return { score, reasons };
}

export default function CourseMatchQuiz() {
  const [inputs, setInputs] = useState<Inputs>({
    handicap: 'mid',
    scenery: 'ocean',
    access: 'resort-ok',
    splurge: 'mid',
    daysAvailable: 3,
  });

  const ranked = useMemo(() => {
    return golfCourses
      .map((c) => ({ course: c, ...scoreCourse(c, inputs) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [inputs]);

  return (
    <section className="not-prose my-12 rounded-md border border-ocean-deep/20 bg-cream-deep/30 p-6 md:p-8">
      <header>
        <div className="eyebrow text-coral">Quiz · 30 seconds</div>
        <h3 className="display mt-2 text-[24px] leading-[1.15] text-ink md:text-[28px]">
          Find your three-course lineup.
        </h3>
        <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-ink-soft">
          Five answers. We rank the 12 Hilton Head + Bluffton courses for your
          group and budget.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <ChoiceField
          label="Group's typical handicap"
          value={inputs.handicap}
          options={Object.entries(HANDICAP_LABEL) as [HandicapBand, string][]}
          onChange={(v) => setInputs({ ...inputs, handicap: v })}
        />
        <ChoiceField
          label="Scenery you came for"
          value={inputs.scenery}
          options={Object.entries(SCENERY_LABEL) as [Scenery, string][]}
          onChange={(v) => setInputs({ ...inputs, scenery: v })}
        />
        <ChoiceField
          label="Access flexibility"
          value={inputs.access}
          options={Object.entries(ACCESS_LABEL) as [AccessFlex, string][]}
          onChange={(v) => setInputs({ ...inputs, access: v })}
        />
        <ChoiceField
          label="Per-round budget"
          value={inputs.splurge}
          options={Object.entries(SPLURGE_LABEL) as [Splurge, string][]}
          onChange={(v) => setInputs({ ...inputs, splurge: v })}
        />
        <SliderField
          label={`Days of golf — ${inputs.daysAvailable}`}
          min={1}
          max={5}
          value={inputs.daysAvailable}
          onChange={(v) => setInputs({ ...inputs, daysAvailable: v })}
        />
      </div>

      <div className="mt-8 border-t border-ocean-deep/15 pt-6">
        <div className="eyebrow text-ink-soft">Your lineup</div>
        <ol className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ranked.map((r, i) => (
            <li
              key={r.course.slug}
              className="rounded-md border border-ink/10 bg-cream p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="display text-[16px] leading-[1.15] text-ink md:text-[18px]">
                  {i + 1}. {r.course.shortName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-coral">
                  {r.course.tier}-tier
                </span>
              </div>
              <p className="mt-1 text-[11.5px] uppercase tracking-[0.12em] text-ink-soft">
                {r.course.designer} · ${r.course.peakFeeUsd}
              </p>
              {r.reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-[12.5px] leading-[1.5] text-ink-soft">
                  {r.reasons.slice(0, 3).map((reason, j) => (
                    <li key={j} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-gold" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        {ranked.length < 3 && (
          <p className="mt-4 text-[12.5px] leading-[1.5] text-ink-soft">
            Tighten your filters — fewer courses match your inputs right now.
          </p>
        )}
      </div>
    </section>
  );
}

function ChoiceField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<readonly [T, string]>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map(([v, l]) => {
          const selected = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={selected}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${
                selected
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/25 bg-cream text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SliderField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </legend>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-coral"
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <span>{min} day</span>
        <span>{max} days</span>
      </div>
    </fieldset>
  );
}
