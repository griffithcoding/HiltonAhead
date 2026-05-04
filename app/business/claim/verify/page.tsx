import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead } from '@/components/ui/Ornament';
import { generatePageMetadata } from '@/app/lib/metadata';
import { verifyBusinessClaim } from '@/app/business/claim/actions';
import { getBusinessOwner } from '@/utils/supabase/businessOwner';

export const metadata: Metadata = generatePageMetadata({
  title: 'Verify your business claim',
  description: 'Confirm your portal account ownership of a Hilton Ahead listing.',
  path: '/business/claim/verify',
  noindex: true,
});

export const dynamic = 'force-dynamic';

/**
 * Token consumption page. Two states:
 *   1. User is NOT signed in → bounce to /business/login with the
 *      verify URL preserved as `next`. After magic-link sign-in they
 *      come back here and we attempt to bind.
 *   2. User IS signed in → call verifyBusinessClaim(token). Show
 *      success or specific failure.
 */
export default async function VerifyClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token?.trim();

  if (!token) {
    return (
      <PageShell>
        <ErrorBlock>This claim link is missing a token.</ErrorBlock>
      </PageShell>
    );
  }

  // If not signed in, route through login first; preserve the verify URL.
  const owner = await getBusinessOwner();
  if (!owner) {
    const next = `/business/claim/verify?token=${encodeURIComponent(token)}`;
    redirect(`/business/login?next=${encodeURIComponent(next)}`);
  }

  const result = await verifyBusinessClaim(token);

  return (
    <PageShell>
      {result.ok ? (
        <div className="border-l-2 border-coral bg-coral/10 px-5 py-6">
          <div className="eyebrow text-coral-deep">Linked</div>
          <h2 className="display mt-2 text-[28px] leading-[1.15] text-ink md:text-[32px]">
            {result.businessName} is now in your portal.
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">
            You can now sign in any time at{' '}
            <Link href="/business/login" className="link-underline text-ink">
              /business/login
            </Link>{' '}
            and manage this listing.
          </p>
          <Link
            href="/business"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-cream transition hover:bg-ocean-deep"
          >
            Open the portal →
          </Link>
        </div>
      ) : (
        <ErrorBlock>{result.error}</ErrorBlock>
      )}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />
      <section className="mx-auto mt-16 max-w-[680px] md:mt-20">
        <SectionHead
          number="№ 01"
          eyebrow="Business Portal · Claim"
          plain="Verifying your link"
          italic="and binding your account."
        />
        <div className="mt-10">{children}</div>
      </section>
      <Footer />
    </div>
  );
}

function ErrorBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-rose-400 bg-rose-50 px-5 py-6">
      <div className="eyebrow text-rose-700">Couldn&rsquo;t verify</div>
      <p className="mt-2 text-[14px] leading-[1.6] text-rose-900">
        {children}
      </p>
      <p className="mt-3 text-[13px] text-ink-soft">
        Need help? Email{' '}
        <a className="link-underline text-ink" href="mailto:hello@hiltonahead.com">
          hello@hiltonahead.com
        </a>
        .
      </p>
    </div>
  );
}
