import Link from 'next/link';
import { brand } from '@/data/brand';
import { nav } from '@/data/nav';

/**
 * Site header with wordmark, nav, status pill, and primary CTA.
 * Server component — no client state.
 */
export default function Header() {
  return (
    <header className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <Link
        href="/"
        className="group flex items-center gap-3 rounded-xl px-2 py-1.5 -mx-2 -my-1.5 transition-colors hover:bg-white/5"
      >
        <div
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-black shadow-lg transition-shadow group-hover:shadow-primary/40 group-hover:shadow-xl"
        >
          H
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[13px] font-semibold tracking-[0.1em] text-zinc-100 transition-colors group-hover:text-white">
            {brand.name.toUpperCase()}
          </div>
          <div className="text-[11px] text-zinc-400 transition-colors group-hover:text-zinc-300">
            Hilton Head · Planned by a Local
          </div>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-4 text-[13px] md:gap-[18px]">
        <nav className="flex flex-wrap items-center gap-4 md:gap-[18px]">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {nav.statusPill ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-zinc-900/75 px-2.5 py-0.5 text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary ring-4 ring-primary/30" />
            {nav.statusPill.label}
          </span>
        ) : null}
        <Link
          href={brand.cta.bookingPagePath}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[12px] font-medium text-black shadow-md shadow-primary/20 transition hover:brightness-105 active:scale-[0.98]"
        >
          {brand.cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
