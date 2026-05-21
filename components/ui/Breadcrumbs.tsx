import Link from 'next/link';

export type BreadcrumbItem = {
  name: string;
  /** Path WITHOUT the leading site URL. The last item should still pass the path. */
  path: string;
};

/**
 * Visible breadcrumbs to mirror the JSON-LD `BreadcrumbList`.
 * Schema-only breadcrumbs are invisible to LLM crawlers parsing rendered
 * HTML — having both the schema and visible UI signals page hierarchy
 * unambiguously to traditional and AI crawlers.
 *
 * The last item is rendered as plain text (not a link) and marked
 * `aria-current="page"` per WCAG breadcrumb pattern.
 */
export default function Breadcrumbs({
  items,
  className = '',
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-[12px] uppercase tracking-[0.18em] text-ink-soft ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-3">
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="link-underline hover:text-sunset"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-ink/30">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
