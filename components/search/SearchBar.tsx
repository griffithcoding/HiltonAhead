'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchableDocType } from '@/app/lib/search/corpus';

type ApiHit = {
  id: string;
  type: SearchableDocType;
  title: string;
  url: string;
  body: string;
};

const DEBOUNCE_MS = 150;
const MIN_CHARS = 2;

const TYPE_LABEL: Record<SearchableDocType, string> = {
  page: 'Page',
  post: 'Post',
  faq: 'FAQ',
};

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ApiHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listboxId = useId();

  // Cmd+K / Ctrl+K to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (q.trim().length < MIN_CHARS) {
      setHits([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
        if (!res.ok) {
          setHits([]);
          setOpen(true);
          return;
        }
        const body = (await res.json()) as { hits: ApiHit[] };
        setHits(body.hits ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        setHits([]);
        setOpen(true);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  // Click outside closes
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function goTo(url: string) {
    setOpen(false);
    setQ('');
    router.push(url);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && hits[active]) {
        goTo(hits[active].url);
      } else if (q.trim().length >= MIN_CHARS) {
        goTo(`/search?q=${encodeURIComponent(q.trim())}`);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQ('');
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative w-[220px] lg:w-[280px]">
      <div className="relative flex items-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 h-4 w-4 text-ink-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => q.length >= MIN_CHARS && setOpen(true)}
          placeholder="Search posts, FAQs…"
          aria-label="Search the site"
          aria-controls={listboxId}
          aria-expanded={open}
          role="combobox"
          autoComplete="off"
          className="h-9 w-full rounded-full border border-ink/15 bg-cream/70 pl-9 pr-12 text-[13px] text-ink placeholder:text-ink-soft/70 focus:border-ocean-mid focus:bg-cream focus:outline-none focus:ring-2 focus:ring-ocean-mid/30 transition"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-3 rounded border border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-ink-soft"
        >
          ⌘K
        </kbd>
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-ink/10 bg-cream p-2 shadow-[0_24px_64px_-24px_rgba(11,42,53,0.35)]"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-4 text-[13px] text-ink-soft">
              No results. Press Enter to view the full results page.
            </p>
          ) : (
            <>
              <ul className="space-y-1">
                {hits.map((hit, i) => (
                  <li key={hit.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => goTo(hit.url)}
                      className={`flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition ${
                        i === active ? 'bg-ink/[0.05]' : 'hover:bg-ink/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                        <span>{TYPE_LABEL[hit.type] ?? hit.type}</span>
                      </div>
                      <span className="text-[13px] font-medium text-ink">{hit.title}</span>
                      {hit.body && (
                        <span className="line-clamp-1 text-[12px] text-ink-soft">{hit.body}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-ink/10 pt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(q)}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-[12px] text-ocean-deep hover:bg-ink/[0.04]"
                >
                  See all results for &ldquo;{q}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
