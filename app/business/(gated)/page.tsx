import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { brand } from '@/data/brand';
import { requireBusinessOwner } from '@/utils/supabase/businessOwner';
import { generatePageMetadata } from '@/app/lib/metadata';
import {
  formatMonth,
  getListingStats,
  getOwnedListing,
  STATS_MONTHS,
} from '@/app/lib/businessPortal';
import SignOutButton from '@/components/business/SignOutButton';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Portal',
  description: 'Manage your Hilton Ahead listing.',
  path: '/business',
  noindex: true,
});

export const dynamic = 'force-dynamic';

/**
 * Business portal dashboard (Phase 2).
 *
 * Per listing: a link to the profile editor, a link to the public listing,
 * and monthly phone-click / website-click / inquiry counts from
 * directory_events (via the owner-scoped business_portal_stats function,
 * migration 026).
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
  const listings = await Promise.all(
    auth.businesses.map(async (b) => {
      const [listing, stats] = await Promise.all([
        getOwnedListing(b.business_id),
        getListingStats(b.business_id),
      ]);
      return { owned: b, listing, stats };
    }),
  );

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />

      <section className="mt-16 md:mt-20">
        <SectionHead
          number="№ 01"
          eyebrow="Business Portal"
          plain={`Welcome back, ${primary.business_name}.`}
          italic="Here's how your listing is doing."
        />
        <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
          You&rsquo;re signed in as{' '}
          <span className="font-medium text-ink">{auth.user.email}</span>.
          Update your listing details and see how many travelers called,
          clicked through to your website, or sent an inquiry from Hilton
          Ahead.
        </p>
      </section>

      {listings.map(({ owned, listing, stats }) => {
        const current = stats?.[0];
        const publicHref = listing
          ? `/local/${listing.industry_slug}#${listing.slug}`
          : '/local';
        return (
          <section key={owned.business_id}>
            <Divider ornament="sailboat" className="my-16" />

            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 className="display text-[26px] leading-[1.15] text-ink md:text-[32px]">
                  {owned.business_name}
                </h2>
                <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  Role: {owned.role}
                  {listing?.owner_edited_at && (
                    <>
                      {' · '}Last updated{' '}
                      {new Date(listing.owner_edited_at).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'America/New_York',
                        },
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href={publicHref}
                  className="link-underline text-[13px] text-ink-soft hover:text-ink"
                >
                  View public listing →
                </Link>
                <Link
                  href={`/business/listing/${owned.business_id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-cream transition hover:bg-ocean-deep"
                >
                  Edit listing
                </Link>
              </div>
            </div>

            {stats && current ? (
              <>
                <h3 className="eyebrow mt-10 text-coral">
                  This month · {formatMonth(current.month)}
                </h3>
                <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-3">
                  {[
                    { label: 'Phone clicks', value: current.phone },
                    { label: 'Website clicks', value: current.website },
                    { label: 'Inquiries', value: current.inquiries },
                  ].map((s) => (
                    <div key={s.label} className="bg-cream px-5 py-6">
                      <dt className="text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                        {s.label}
                      </dt>
                      <dd className="display mt-2 text-[40px] leading-none text-ink tabular-nums">
                        {s.value.toLocaleString('en-US')}
                      </dd>
                    </div>
                  ))}
                </dl>

                <h3 className="eyebrow mt-10 text-coral">
                  Last {STATS_MONTHS} months
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-left text-[14px]">
                    <thead>
                      <tr className="border-b border-ink/20 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                        <th scope="col" className="py-2.5 pr-4 font-medium">
                          Month
                        </th>
                        <th scope="col" className="py-2.5 pr-4 text-right font-medium">
                          Phone clicks
                        </th>
                        <th scope="col" className="py-2.5 pr-4 text-right font-medium">
                          Website clicks
                        </th>
                        <th scope="col" className="py-2.5 text-right font-medium">
                          Inquiries
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((m) => (
                        <tr key={m.month} className="border-b border-ink/10">
                          <th scope="row" className="py-3 pr-4 font-normal text-ink">
                            {formatMonth(m.month)}
                          </th>
                          <td className="py-3 pr-4 text-right tabular-nums text-ink">
                            {m.phone.toLocaleString('en-US')}
                          </td>
                          <td className="py-3 pr-4 text-right tabular-nums text-ink">
                            {m.website.toLocaleString('en-US')}
                          </td>
                          <td className="py-3 text-right tabular-nums text-ink">
                            {m.inquiries.toLocaleString('en-US')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12px] leading-[1.5] text-ink-soft">
                  Counts are taps on your phone number, clicks to your website,
                  and inquiry forms sent from your Hilton Ahead listing.
                </p>
              </>
            ) : (
              <p className="mt-8 border-l-2 border-coral bg-coral/10 px-4 py-3 text-[13.5px] leading-[1.5] text-ink">
                Performance numbers aren&rsquo;t available right now. Check
                back shortly.
              </p>
            )}
          </section>
        );
      })}

      <Divider ornament="sailboat" className="my-16" />

      <section>
        <h2 className="eyebrow text-coral">Coming next</h2>
        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: 'Photos + inquiry inbox',
              body: 'Upload your own photo gallery and read traveler inquiries sent to your business.',
            },
            {
              title: 'Rental properties',
              body: 'For rental management companies and individual owners — manage every villa or unit under one business.',
            },
            {
              title: 'Featured upgrade',
              body: 'Optional paid upgrade for top-of-category placement, a badge and dedicated editorial.',
            },
          ].map((c) => (
            <li key={c.title} className="border-t border-ocean-deep/15 pt-6">
              <h3 className="display text-[20px] leading-[1.2] text-ink md:text-[22px]">
                {c.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Divider ornament="sailboat" className="my-16" />

      <section className="flex flex-wrap items-center justify-between gap-4 pb-20">
        <p className="text-[13px] text-ink-soft">
          Need help or have a question? Email{' '}
          <a
            href={`mailto:${brand.contact.email}`}
            className="link-underline text-ink"
          >
            {brand.contact.email}
          </a>
          .
        </p>
        <SignOutButton />
      </section>

      <Footer />
    </div>
  );
}
