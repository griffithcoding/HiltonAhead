import Link from 'next/link';
import { brand } from '@/data/brand';
import { footerLinks } from '@/data/footerLinks';
import NewsletterSignup from '@/components/NewsletterSignup';

/**
 * Footer: brand + 3 link columns + compact newsletter signup.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 pt-10 text-zinc-400">
      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <div className="text-[13px] font-semibold tracking-[0.1em] text-zinc-200">
            {brand.name.toUpperCase()}
          </div>
          <p className="mt-3 max-w-[260px] text-[12px] leading-[1.6] text-zinc-500">
            {footerLinks.tagline}
          </p>
        </div>
        {footerLinks.columns.map((col) => (
          <div key={col.label}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {col.label}
            </div>
            <ul className="mt-3 space-y-2 text-[12px]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-400 transition-colors hover:text-zinc-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <NewsletterSignup variant="compact" source="footer" />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px]">
        <span>
          © {year} {brand.legalName}. All rights reserved.
        </span>
        <span>{footerLinks.locationTagline}</span>
      </div>
    </footer>
  );
}
