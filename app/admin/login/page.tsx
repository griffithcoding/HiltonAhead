import type { Metadata } from 'next';
import AdminLoginForm from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin sign-in — HiltonAhead',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5">
      <div className="w-full max-w-[440px] rounded-sm bg-sand-soft p-10 shadow-[0_30px_80px_-20px_rgba(10,41,48,0.2)] ring-1 ring-ocean-deep/10">
        <div className="eyebrow eyebrow-coral">Admin access</div>
        <h1 className="display mt-4 text-[32px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[40px]">
          Sign in{' '}
          <span className="display-italic text-coral">to the dispatch.</span>
        </h1>
        <p className="mt-4 text-[14px] leading-[1.7] text-ink-soft">
          This is the internal CRM for Hilton Ahead. Only whitelisted
          accounts can enter. Sign in with the Google account registered as
          an admin.
        </p>

        {error === 'oauth_failed' && (
          <div className="mt-6 border-l-2 border-coral bg-coral/5 px-4 py-3 text-[13px] text-ink">
            Sign-in failed. Try again, or check that your email is on the
            admin whitelist.
          </div>
        )}
        {error === 'not_admin' && (
          <div className="mt-6 border-l-2 border-coral bg-coral/5 px-4 py-3 text-[13px] text-ink">
            That account isn&apos;t whitelisted for admin access.
          </div>
        )}

        <div className="mt-8">
          <AdminLoginForm />
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
          ← <a href="/" className="link-underline">Back to the site</a>
        </p>
      </div>
    </main>
  );
}
