import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { requireBusinessOwner } from '@/utils/supabase/businessOwner';
import { generatePageMetadata } from '@/app/lib/metadata';
import SignOutButton from '@/components/business/SignOutButton';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Portal',
  description: 'Manage your Hilton Ahead listing.',
  path: '/business',
  noindex: true,
});

export const dynamic = 'force-dynamic';

/**
 * Phase 0/1 placeholder dashboard.
 *
 * Shows the owner's business name + a "what's coming next" panel. Phase 2
 * replaces this with the real profile editor + photo manager.
 */
export default async function BusinessDashboardPage() {
  const auth = await requireBusinessOwner();
  // Layout already gates this, but a defensive re-check for safety.
  if (!auth.ok) {
    return (
      <div className="mx-auto max-w-[920px] px-5 py-20 text-center">
        <p className="text-ink-soft">{auth.error}</p>
      </div>
    );
  }

  const primary = auth.businesses[0];

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />

      <section className="mt-16 md:mt-20">
        <SectionHead
          number="№ 01"
          eyebrow="Business Portal"
          plain={`Welcome back, ${primary.business_name}.`}
          italic="Your portal is taking shape."
        />
        <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
          You&rsquo;re signed in as{' '}
          <span className="font-medium text-ink">{auth.user.email}</span>. The
          full editor — profile, photos, hours, lead inbox, performance — ships
          in Phase 2. Right now this dashboard confirms your account is linked
          to your listing.
        </p>
      </section>

      <Divider ornament="sailboat" className="my-16" />

      <section>
        <h2 className="eyebrow text-coral">Your listings</h2>
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {auth.businesses.map((b) => (
            <li
              key={b.business_id}
              className="flex flex-wrap items-center justify-between gap-3 py-5"
            >
              <div>
                <div className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                  {b.business_name}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  Role: {b.role}
                </div>
              </div>
              <Link
                href={`/local/${b.business_slug}`}
                className="link-underline text-[13px] text-ink-soft hover:text-ink"
              >
                View public listing →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Divider ornament="sailboat" className="my-16" />

      <section>
        <h2 className="eyebrow text-coral">Coming next</h2>
        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              phase: 'Phase 2',
              title: 'Profile + Photos',
              body: 'Edit your name, tagline, hours, contact details, dress code, parking notes, and upload your photo gallery.',
            },
            {
              phase: 'Phase 3',
              title: 'Inbox + Performance',
              body: 'See traveler inquiries directed to your business and the per-month phone-click / website-click counts we already track.',
            },
            {
              phase: 'Phase 4',
              title: 'Rental properties',
              body: 'For rental management companies and individual owners — manage every villa or unit under one business with seasonal pricing and amenities.',
            },
            {
              phase: 'Phase 5',
              title: 'Featured upgrade',
              body: 'Optional paid upgrade to Featured / Premium tier — top-of-category placement, a badge, dedicated editorial.',
            },
          ].map((c) => (
            <article
              key={c.title}
              className="border-t border-ocean-deep/15 pt-6"
            >
              <div className="eyebrow text-ocean-deep">{c.phase}</div>
              <h3 className="display mt-2 text-[20px] leading-[1.2] text-ink md:text-[22px]">
                {c.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                {c.body}
              </p>
            </article>
          ))}
        </ul>
      </section>

      <Divider ornament="sailboat" className="my-16" />

      <section className="flex flex-wrap items-center justify-between gap-4 pb-20">
        <p className="text-[13px] text-ink-soft">
          Need help or have a question? Email{' '}
          <a
            href="mailto:hello@hiltonahead.com"
            className="link-underline text-ink"
          >
            hello@hiltonahead.com
          </a>
          .
        </p>
        <SignOutButton />
      </section>

      <Footer />
    </div>
  );
}
