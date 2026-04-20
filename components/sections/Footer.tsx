import Link from 'next/link';
import { brand } from '@/data/brand';
import { footerLinks } from '@/data/footerLinks';
import NewsletterSignup from '@/components/NewsletterSignup';
import { CompassRose } from '@/components/ui/Ornament';

/**
 * Editorial footer: ink-on-ink block with a masthead-style signoff,
 * link columns as small-caps lists, and a compact newsletter signup.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bleed mt-0 bg-ink text-cream">
      <div className="mx-auto max-w-[1280px] px-5 pt-20 pb-10">
        {/* Masthead row */}
        <div className="flex items-start justify-between gap-8 border-b border-cream/15 pb-10">
          <div>
            <div className="flex items-baseline gap-4">
              <CompassRose size={28} />
              <span className="display text-[28px] leading-none text-cream md:text-[34px]">
                {brand.name}
              </span>
            </div>
            <p className="mt-4 max-w-[320px] text-[13px] leading-[1.7] text-cream/70">
              {footerLinks.tagline}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="eyebrow text-cream/60">A dispatch</div>
            <div className="display-italic mt-2 text-[20px] text-cream/90">
              from {brand.contact.location}
            </div>
          </div>
        </div>

        <div className="grid gap-12 pt-12 md:grid-cols-[1fr_1fr_1fr_1.6fr]">
          {footerLinks.columns.map((col) => (
            <div key={col.label}>
              <div className="eyebrow text-cream/60">{col.label}</div>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-cream/85 transition-colors hover:text-sunset"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <NewsletterSignup
              variant="compact"
              source="footer"
              heading="The Insider Letter"
              body="One dispatch a month. Villas the booking sites miss, openings, and the tee times that just dropped."
            />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-cream/15 pt-6 text-[11px] uppercase tracking-[0.18em] text-cream/60">
          <span>
            © {year} {brand.legalName}
          </span>
          <span className="display-italic normal-case tracking-normal">
            Made on Hilton Head Island
          </span>
        </div>
      </div>
    </footer>
  );
}
