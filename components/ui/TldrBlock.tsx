import type { ReactNode } from 'react';

/**
 * TL;DR block — direct-answer paragraph rendered above the fold on
 * blog posts, comparison pages, and guides.
 *
 * The `tldr-block` class is referenced by the page-level `Speakable`
 * JSON-LD schema's cssSelector. Voice assistants and AI overviews
 * read this aloud as the canonical short answer.
 *
 * Keep the body to 2–3 sentences. Lead with the direct answer; the
 * supporting why is on the rest of the page.
 */
export default function TldrBlock({
  children,
  label = 'TL;DR',
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside
      role="note"
      aria-label="Quick summary"
      className="tldr-block my-8 max-w-[680px] border-l-2 border-gold bg-sand-soft/40 px-6 py-5"
    >
      <p className="eyebrow mb-2 text-sunset">{label}</p>
      <div className="text-[15px] leading-[1.7] text-ink md:text-[16px]">
        {children}
      </div>
    </aside>
  );
}
