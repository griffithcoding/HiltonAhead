import type { PostBlock } from '@/data/posts';

/**
 * Renders a Post's `body` array of content blocks.
 * Content is author-controlled in `data/posts.ts`, so inline HTML
 * in paragraphs / list items is trusted.
 */
export default function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="prose-blog">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'h2':
            return <h2 key={i}>{block.text}</h2>;
          case 'h3':
            return <h3 key={i}>{block.text}</h3>;
          case 'p':
            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
            );
          case 'ul':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            );
          case 'callout':
            return <Callout key={i} label={block.label} html={block.html} />;
          case 'quote':
            return (
              <Quote key={i} html={block.html} attribution={block.attribution} />
            );
          case 'tier':
            return <TierBlock key={i} block={block} />;
        }
      })}
    </div>
  );
}

function Callout({ label, html }: { label?: string; html: string }) {
  return (
    <aside className="not-prose my-8 border-l-2 border-sunset bg-cream-deep/40 px-5 py-4 md:px-6 md:py-5">
      {label && (
        <div className="eyebrow mb-2 text-sunset">{label}</div>
      )}
      <p
        className="text-[14px] leading-[1.7] text-ink md:text-[15px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </aside>
  );
}

function Quote({ html, attribution }: { html: string; attribution?: string }) {
  return (
    <blockquote className="not-prose my-10 border-t border-b border-ink/15 py-6">
      <p
        className="display-italic max-w-[620px] text-[20px] leading-[1.4] text-ink md:text-[24px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {attribution && (
        <cite className="eyebrow mt-4 block text-ink-soft">
          {attribution}
        </cite>
      )}
    </blockquote>
  );
}

const TIER_STYLES = {
  gold: {
    badge: 'bg-gold text-cream',
    accent: 'text-gold',
    label: 'S-Tier',
  },
  primary: {
    badge: 'bg-sunset text-cream',
    accent: 'text-sunset',
    label: 'A-Tier',
  },
  zinc: {
    badge: 'bg-ink text-cream',
    accent: 'text-ink',
    label: 'B-Tier',
  },
  rose: {
    badge: 'bg-transparent text-ink border border-ink',
    accent: 'text-ink-soft',
    label: 'Skip',
  },
} as const;

function TierBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'tier' }>;
}) {
  const s = TIER_STYLES[block.accent];

  return (
    <section className="not-prose my-12 border-y border-ink/20 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-5">
          <span
            className={`inline-flex items-center px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${s.badge}`}
          >
            {block.label}
          </span>
          {block.subtitle && (
            <span className="display-italic text-[16px] leading-[1.25] text-ink-soft md:text-[18px]">
              {block.subtitle}
            </span>
          )}
        </div>
        <span className={`eyebrow ${s.accent}`}>
          {block.items.length} picks
        </span>
      </header>

      <ol className="divide-y divide-ink/10">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="grid grid-cols-[auto_1fr] gap-5 py-6 md:grid-cols-[64px_1fr] md:gap-8"
          >
            <span
              className={`section-number text-[24px] leading-none md:text-[32px] ${s.accent}`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="display text-[19px] leading-[1.2] text-ink md:text-[22px]">
                  {item.name}
                </h4>
                {item.meta && (
                  <span className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">
                    {item.meta}
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-[620px] text-[14px] leading-[1.7] text-ink-soft md:text-[15px]">
                {item.blurb}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
