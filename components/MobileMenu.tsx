'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { nav } from '@/data/nav';
import AdminNavLink from '@/components/AdminNavLink';

/**
 * Mobile-only header menu (md:hidden).
 *
 * Hamburger icon → full-screen overlay drawer with nav links, CTA, and
 * the admin link (if signed in). ESC closes; body scroll locked while open.
 *
 * Pairs with Header.tsx — Header renders the desktop nav inside a
 * `hidden md:flex` wrapper, and renders this component as the mobile
 * trigger. The desktop nav and this component never render together.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // ESC to close + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Trigger — only visible on mobile */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(true)}
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink md:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </svg>
      </button>

      {/* Drawer */}
      {open && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-cream md:hidden"
        >
          {/* Drawer header — wordmark + close */}
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <span className="display text-[24px] leading-none tracking-[-0.02em] text-ink">
              {brand.name}
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="5" y1="5" x2="17" y2="17" />
                <line x1="17" y1="5" x2="5" y2="17" />
              </svg>
            </button>
          </div>

          {/* Drawer body — links + CTA */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display border-b border-ink/10 py-4 text-[28px] leading-tight text-ink transition-colors hover:text-sunset"
              >
                {link.label}
              </Link>
            ))}

            {/* Admin link (only renders if signed in admin user) */}
            <div className="mt-2 py-2" onClick={() => setOpen(false)}>
              <AdminNavLink />
            </div>

            <Link
              href={brand.cta.bookingPagePath}
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition hover:bg-sunset"
            >
              {brand.cta.label}
              <span aria-hidden="true">→</span>
            </Link>

            <p className="mt-6 text-[12px] leading-[1.7] text-ink-soft">
              Travel Consulting · Hilton Head Island, SC
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
