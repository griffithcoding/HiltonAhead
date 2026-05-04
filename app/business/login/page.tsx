import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead } from '@/components/ui/Ornament';
import { generatePageMetadata } from '@/app/lib/metadata';
import { getBusinessOwner } from '@/utils/supabase/businessOwner';
import BusinessLoginForm from '@/components/business/BusinessLoginForm';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Portal Sign In',
  description:
    'Sign in to manage your Hilton Ahead business listing. Magic-link by email or Google.',
  path: '/business/login',
  noindex: true,
});

export const dynamic = 'force-dynamic';

const NOTICE_COPY: Record<string, string> = {
  'no-listing':
    "You're signed in, but no listing is linked to this account yet. Apply or claim a business below.",
  'signed-out': 'Signed out. See you next time.',
  'check-email': 'Check your inbox — we just sent a sign-in link.',
};

export default async function BusinessLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const auth = await getBusinessOwner();

  // Already signed in with a linked listing → straight to portal.
  if (auth && auth.businesses.length > 0) {
    redirect(params.next || '/business');
  }

  const notice = params.notice ? NOTICE_COPY[params.notice] : null;

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />

      <section className="mx-auto mt-16 max-w-[640px] md:mt-24">
        <SectionHead
          number="№ 01"
          eyebrow="Business Portal"
          plain="Sign in"
          italic="to your listing."
        />
        <p className="mt-6 text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
          For owners and managers of Hilton Head + Bluffton businesses listed
          in our directory. Sign in to update your profile, upload photos,
          and (Phase 2 onward) manage your inquiries, performance, and
          rental properties.
        </p>

        {notice && (
          <div className="mt-8 border-l-2 border-coral bg-coral/10 px-4 py-3 text-[13.5px] leading-[1.5] text-ink">
            {notice}
          </div>
        )}
        {params.error && (
          <div className="mt-8 border-l-2 border-rose-400 bg-rose-50 px-4 py-3 text-[13.5px] leading-[1.5] text-rose-900">
            {params.error === 'oauth_failed'
              ? 'Sign-in failed. Try again or use the email magic-link.'
              : params.error === 'missing_code'
                ? 'Sign-in link was incomplete. Try again.'
                : 'Sign-in failed. Try again.'}
          </div>
        )}

        <div className="mt-10">
          <BusinessLoginForm next={params.next} />
        </div>

        <div className="mt-12 border-t border-ink/10 pt-8">
          <h2 className="display text-[22px] leading-[1.2] text-ink md:text-[26px]">
            Don&rsquo;t have a listing yet?
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
            Apply to be added to the directory. We review every application
            for fit before approving.
          </p>
          <a
            href="/business/apply"
            className="link-underline mt-4 inline-flex items-center gap-2 text-[13px] text-ink"
          >
            Apply for a listing →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
