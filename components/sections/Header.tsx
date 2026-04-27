import Link from 'next/link';
import { brand } from '@/data/brand';
import { nav } from '@/data/nav';
import { hero } from '@/data/hero';
import AdminNavLink from '@/components/AdminNavLink';
import MobileMenu from '@/components/MobileMenu';

/**
 * Editorial masthead header.
 * Top strip: dispatch number + place + cadence (magazine conceit).
 * Main row: wordmark on left, nav on right, CTA as editorial button.
 *
 * Mobile (<md): hamburger drawer (MobileMenu). Desktop nav is hidden.
 * Desktop (md+): inline nav with links + AdminNavLink + CTA.
 */
export default function Header() {
  return (
    <>
      {/* ——— Masthead ribbon ——— */}
      <div className="masthead-rule bleed border-b border-cream/10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-2.5 text-[10px] sm:text-[11px]">
          <span className="font-medium">{hero.masthead.dispatch}</span>
          <span className="hidden sm:inline text-cream/70">
            {hero.masthead.place}
          </span>
          <span className="font-medium">{hero.masthead.cadence}</span>
        </div>
      </div>

      {/* ——— Main header row ——— */}
      <header className="flex flex-row items-center justify-between gap-4 border-b border-ink/10 py-5">
        <Link
          href="/"
          className="group flex min-w-0 flex-col gap-0 -my-1 transition"
        >
          <span className="display text-[22px] leading-none tracking-[-0.02em] text-ink sm:text-[26px] md:text-[30px]">
            {brand.name}
          </span>
          <span className="eyebrow mt-1.5 hidden text-ink-soft sm:block">
            Travel Consulting · Hilton Head Island
          </span>
        </Link>

        {/* Desktop nav (md+) */}
        <div className="hidden flex-wrap items-center gap-6 text-[13px] md:flex lg:gap-8">
          <nav className="flex items-center gap-6 whitespace-nowrap lg:gap-8">
            {nav.links.map((link) =>
              link.children && link.children.length > 0 ? (
                <div
                  key={link.href}
                  className="group relative"
                >
                  <Link
                    href={link.href}
                    className="link-underline inline-flex items-center gap-1.5 text-ink/85 hover:text-ink"
                    aria-haspopup="true"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="text-[8px] leading-none opacity-60 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      ▼
                    </span>
                  </Link>
                  <div
                    role="menu"
                    aria-label={`${link.label} submenu`}
                    className="invisible absolute left-1/2 top-full z-40 mt-3 min-w-[180px] -translate-x-1/2 rounded-md border border-ink/10 bg-cream p-1.5 opacity-0 shadow-[0_12px_32px_-16px_rgba(11,42,53,0.25)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-sm px-3 py-2 text-[13px] text-ink/85 transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-underline text-ink/85 hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
            <AdminNavLink />
          </nav>
          <Link
            href={brand.cta.bookingPagePath}
            className="group inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-cream transition hover:bg-sunset hover:border-sunset"
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

        {/* Mobile hamburger (md:hidden, owned by the component) */}
        <MobileMenu />
      </header>
    </>
  );
}
