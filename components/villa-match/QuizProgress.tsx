'use client';

export default function QuizProgress({
  current,
  total,
}: {
  current: number; // 1-indexed
  total: number;
}) {
  return (
    <div className="flex items-center gap-3" aria-label={`Step ${current} of ${total}`}>
      <span className="eyebrow text-ink-soft">
        {current} of {total}
      </span>
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'h-[2px] flex-1 transition-colors ' +
              (i < current ? 'bg-coral' : 'bg-ink/15')
            }
          />
        ))}
      </div>
    </div>
  );
}
