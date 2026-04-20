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
    <aside className="my-6 rounded-[16px] border border-primary/30 bg-primary/[0.06] p-5 not-prose">
      {label && (
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          {label}
        </div>
      )}
      <p
        className="text-[14px] leading-[1.65] text-zinc-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </aside>
  );
}

function Quote({ html, attribution }: { html: string; attribution?: string }) {
  return (
    <blockquote className="my-6 border-l-2 border-primary/60 pl-5 not-prose">
      <p
        className="text-[15px] italic leading-[1.65] text-zinc-300"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {attribution && (
        <cite className="mt-2 block text-[12px] not-italic text-zinc-500">
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}

const TIER_STYLES = {
  gold: {
    badge: 'bg-amber-400 text-black',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-400/10',
  },
  primary: {
    badge: 'bg-primary text-black',
    border: 'border-primary/40',
    glow: 'shadow-primary/10',
  },
  zinc: {
    badge: 'bg-zinc-300 text-black',
    border: 'border-white/15',
    glow: 'shadow-white/5',
  },
  rose: {
    badge: 'bg-rose-400 text-black',
    border: 'border-rose-400/30',
    glow: 'shadow-rose-400/10',
  },
} as const;

function TierBlock({
  block,
}: {
  block: Extract<PostBlock, { kind: 'tier' }>;
}) {
  const s = TIER_STYLES[block.accent];
  return (
    <section
      className={`my-8 rounded-[20px] border ${s.border} bg-zinc-900/60 p-6 shadow-lg ${s.glow} backdrop-blur-sm not-prose`}
    >
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold tracking-wider ${s.badge}`}
          >
            {block.label}
          </span>
          {block.subtitle && (
            <span className="text-[13px] text-zinc-400">{block.subtitle}</span>
          )}
        </div>
      </header>

      <ul className="flex flex-col gap-3">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="rounded-[14px] border border-white/10 bg-zinc-950/50 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-[15px] font-semibold text-zinc-50">
                {item.name}
              </h4>
              {item.meta && (
                <span className="text-[11px] text-zinc-500">{item.meta}</span>
              )}
            </div>
            <p className="mt-2 text-[13px] leading-[1.6] text-zinc-400">
              {item.blurb}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
