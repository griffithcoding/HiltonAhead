import Link from 'next/link';
import { brand } from '@/data/brand';
import { nav } from '@/data/nav';
import { hero } from '@/data/hero';

/**
 * Editorial masthead header.
 * Top strip: dispatch number + place + cadence (magazine conceit).
 * Main row: wordmark on left, nav on right, CTA as editorial button.
 */
export default function Header() {
  return (
    <>
      {/* ——— Masthead ribbon ——— */}
      <div className="masthead-rule bleed border-b border-cream/10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-2.5">
          <span className="font-medium">{hero.masthead.dispatch}</span>
          <span className="hidden sm:inline text-cream/70">
            {hero.masthead.place}
          </span>
          <span className="font-medium">{hero.masthead.cadence}</span>
        </div>
      </div>

      {/* ——— Main header row ——— */}
      <header className="flex flex-col items-start justify-between gap-4 border-b border-ink/10 py-5 md:flex-row md:items-center">
        <Link
          href="/"
          className="group flex flex-col gap-0 -my-1 transition"
        >
          <span className="display text-[26px] leading-none tracking-[-0.02em] text-ink md:text-[30px]">
            {brand.name}
          </span>
          <span className="eyebrow mt-1.5 text-ink-soft">
            Travel Consulting · Hilton Head Island
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-6 text-[13px] md:gap-8">
          <nav className="flex flex-wrap items-center gap-5 md:gap-7">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-ink/85 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href={brand.cta.bookingPagePath}
            className="group inline-flex items-center gap-2 rounded-none border border-ink bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-cream transition hover:bg-sunset hover:border-sunset"
          >
            {brand.cta.label}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </header>
    </>
  );
}
