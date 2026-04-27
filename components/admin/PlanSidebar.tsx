/**
 * Right-sidebar plan view in /admin/(gated).
 *
 * Renders the structured `currentPlan` from data/current-plan.ts with
 * blockers at top, then waiting decisions, next steps, short-term work,
 * and (collapsed) strategic backlog and recently-shipped items.
 *
 * Server component — no client state needed; the strategic + shipped
 * sections use native <details>/<summary> for collapse without JS.
 */

import {
  currentPlan,
  groupByPriority,
  type PlanItem,
  type PlanItemPriority,
  type ShippedItem,
} from '@/data/current-plan';

const SECTION_LABEL: Record<PlanItemPriority, string> = {
  blocker: 'Blockers',
  waiting: 'Waiting on decision',
  next: 'Next steps',
  'short-term': 'Short-term · approved',
  strategic: 'Strategic backlog',
};

const SECTION_ACCENT: Record<PlanItemPriority, string> = {
  blocker: 'text-coral',
  waiting: 'text-gold-deep',
  next: 'text-coral',
  'short-term': 'text-ink',
  strategic: 'text-ink-soft',
};

export default function PlanSidebar() {
  const grouped = groupByPriority();

  return (
    <aside className="border-l border-ocean-deep/10 bg-sand-soft/30 px-6 py-8 lg:min-h-screen">
      {/* Header */}
      <div className="mb-1 flex items-baseline justify-between">
        <div className="eyebrow eyebrow-coral">The plan</div>
        <div className="text-[10px] text-ink-soft">
          {currentPlan.updatedAt}
        </div>
      </div>
      <div className="mb-6 text-[11px] leading-snug text-ink-soft">
        {currentPlan.generatedFrom}
      </div>

      {/* Always-visible sections */}
      {(['blocker', 'waiting', 'next', 'short-term'] as const).map(
        (priority) => {
          const items = grouped[priority];
          if (items.length === 0) return null;
          return (
            <Section
              key={priority}
              label={SECTION_LABEL[priority]}
              accent={SECTION_ACCENT[priority]}
              items={items}
              count={items.length}
            />
          );
        },
      )}

      {/* Collapsed strategic */}
      {grouped.strategic.length > 0 && (
        <CollapsibleSection
          label={SECTION_LABEL.strategic}
          accent={SECTION_ACCENT.strategic}
          items={grouped.strategic}
        />
      )}

      {/* Collapsed shipped */}
      {currentPlan.shipped.length > 0 && (
        <ShippedDetails items={currentPlan.shipped} />
      )}
    </aside>
  );
}

// ============================================================================
// Sections
// ============================================================================

function Section({
  label,
  accent,
  items,
  count,
}: {
  label: string;
  accent: string;
  items: PlanItem[];
  count: number;
}) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-baseline justify-between">
        <div
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accent}`}
        >
          {label}
        </div>
        <div className="text-[10px] text-ink-soft">{count}</div>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function CollapsibleSection({
  label,
  accent,
  items,
}: {
  label: string;
  accent: string;
  items: PlanItem[];
}) {
  return (
    <details className="group mb-6">
      <summary
        className={`flex cursor-pointer list-none items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.18em] ${accent} hover:text-ink`}
      >
        <span>
          <span className="mr-1 inline-block transition-transform group-open:rotate-90">
            ▶
          </span>
          {label}
        </span>
        <span>{items.length}</span>
      </summary>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </ul>
    </details>
  );
}

function ShippedDetails({ items }: { items: ShippedItem[] }) {
  return (
    <details className="group mt-8 border-t border-ocean-deep/10 pt-5">
      <summary className="flex cursor-pointer list-none items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft hover:text-ink">
        <span>
          <span className="mr-1 inline-block transition-transform group-open:rotate-90">
            ▶
          </span>
          Recently shipped
        </span>
        <span>{items.length}</span>
      </summary>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="text-[12px] leading-snug text-ink-soft">
            <div className="text-ink">{item.text}</div>
            {(item.commit || item.files) && (
              <div className="mt-0.5 flex gap-2 text-[10px] text-ink-soft">
                {item.commit && (
                  <span className="font-mono">{item.commit}</span>
                )}
                {item.files !== undefined && <span>{item.files} files</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

// ============================================================================
// Item row
// ============================================================================

function ItemRow({ item }: { item: PlanItem }) {
  const inProgress = item.status === 'in-progress';

  return (
    <li
      className={`group flex flex-col gap-1 border-l-2 ${
        item.priority === 'blocker'
          ? 'border-coral/60'
          : item.priority === 'waiting'
            ? 'border-gold/50'
            : 'border-ocean-deep/15'
      } pl-3`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`text-[12.5px] leading-snug ${
            inProgress ? 'text-coral font-medium' : 'text-ink'
          }`}
        >
          {item.text}
          {item.link && (
            <>
              {' '}
              <a
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-coral hover:underline"
                aria-label={`Open: ${item.text}`}
              >
                ↗
              </a>
            </>
          )}
        </div>
      </div>

      {item.detail && (
        <div className="text-[11px] leading-snug text-ink-soft">
          {item.detail}
        </div>
      )}

      {(item.estimate || item.blockedBy) && (
        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          {item.estimate && <span>{item.estimate}</span>}
          {item.blockedBy && <span>blocked: {item.blockedBy}</span>}
        </div>
      )}
    </li>
  );
}
