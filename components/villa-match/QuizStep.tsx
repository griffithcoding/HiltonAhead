'use client';

import type { QuizStepConfig } from './types';

type Props = {
  step: QuizStepConfig;
  value: string | number | undefined;
  onChange: (next: string | number) => void;
};

export default function QuizStep({ step, value, onChange }: Props) {
  return (
    <div>
      <h2 className="display text-[24px] leading-[1.15] text-ink md:text-[32px]">
        {step.question}
      </h2>
      {step.subhead && (
        <p className="mt-3 max-w-[520px] text-[13px] leading-[1.6] text-ink-soft">
          {step.subhead}
        </p>
      )}
      <div className="mt-7">
        {step.kind === 'radio' || step.kind === 'radio-grid' ? (
          <RadioGroup step={step} value={value as string | undefined} onChange={onChange} />
        ) : (
          <NumberStepper
            step={step}
            value={typeof value === 'number' ? value : step.min}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}

function RadioGroup({
  step,
  value,
  onChange,
}: {
  step: Extract<QuizStepConfig, { kind: 'radio' | 'radio-grid' }>;
  value: string | undefined;
  onChange: (next: string) => void;
}) {
  const gridCls =
    step.kind === 'radio-grid'
      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
      : 'flex flex-col gap-3';
  return (
    <div role="radiogroup" aria-labelledby={`step-${step.id}-label`} className={gridCls}>
      {step.options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={
              'group flex flex-col items-start gap-1 border px-5 py-4 text-left transition-colors ' +
              (selected
                ? 'border-coral bg-cream'
                : 'border-ink/15 bg-white hover:border-ink/40')
            }
          >
            <span className="text-[15px] font-medium text-ink">{opt.label}</span>
            {opt.sublabel && (
              <span className="text-[12px] leading-[1.5] text-ink-soft">{opt.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function NumberStepper({
  step,
  value,
  onChange,
}: {
  step: Extract<QuizStepConfig, { kind: 'number-stepper' }>;
  value: number;
  onChange: (next: number) => void;
}) {
  const label = step.labelTemplate.replace('{N}', String(value));
  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(step.min, value - 1))}
        disabled={value <= step.min}
        className="h-11 w-11 border border-ink/20 text-[20px] leading-none text-ink hover:border-coral disabled:opacity-40"
      >
        −
      </button>
      <span aria-live="polite" className="display min-w-[160px] text-center text-[28px] text-ink">
        {label}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(Math.min(step.max, value + 1))}
        disabled={value >= step.max}
        className="h-11 w-11 border border-ink/20 text-[20px] leading-none text-ink hover:border-coral disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
