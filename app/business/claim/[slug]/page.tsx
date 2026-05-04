import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata } from '@/app/lib/metadata';
import { allBusinesses } from '@/data/localBusinesses';
import ClaimRequestForm from '@/components/business/ClaimRequestForm';

type Params = { slug: string };

/**
 * Claim a specific listing. The slug is the same as `Business.id` from
 * data/localBusinesses.ts (industry-scoped); we resolve via allBusinesses
 * to get the display name + the routing email we'll send the token to.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const biz = allBusinesses.find((b) => b.id === slug);
  return generatePageMetadata({
    title: biz
      ? `Claim ${biz.name} on Hilton Ahead`
      : 'Claim a listing on Hilton Ahead',
    description:
      'Verify ownership and link this listing to your business portal account.',
    path: `/business/claim/${slug}`,
    noindex: true,
  });
}

export default async function ClaimBusinessPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const biz = allBusinesses.find((b) => b.id === slug);
  if (!biz) notFound();

  // Pre-fill the routing email if we have one on file. The applicant can
  // override (e.g. business changed hands) — that path falls into manual
  // admin approval instead of automatic verification.
  const suggestedEmail = biz.inquiryRoutingEmail || biz.ownerEmail || '';
  const hasContactOnFile = !!suggestedEmail;

  return (
    <div className="mx-auto max-w-[1280px] px-5">
      <Header />

      <section className="mx-auto mt-16 max-w-[680px] md:mt-20">
        <SectionHead
          number="№ 01"
          eyebrow="Business Portal · Claim"
          plain={`Claim ${biz.name}`}
          italic="and link it to your account."
        />
        <p className="mt-6 text-[15px] leading-[1.7] text-ink-soft md:text-[17px]">
          We&rsquo;ll send a one-time verification link to the email on file
          for this listing. Click it from that inbox and we&rsquo;ll bind
          your portal account to{' '}
          <span className="font-medium text-ink">{biz.name}</span>.
        </p>

        <div className="mt-6 border-l-2 border-ocean-deep bg-ocean-light/30 px-4 py-3 text-[13.5px] leading-[1.5] text-ink">
          <strong>The listing&rsquo;s contact email:</strong>{' '}
          {hasContactOnFile ? (
            <span className="font-mono text-ink-soft">
              {maskEmail(suggestedEmail)}
            </span>
          ) : (
            <span className="text-ink-soft">
              We don&rsquo;t have one on file — request will be reviewed by
              an admin instead.
            </span>
          )}
        </div>

        <Divider ornament="sailboat" className="my-12" />

        <ClaimRequestForm
          businessSlug={biz.id}
          businessName={biz.name}
          suggestedEmail={suggestedEmail}
          hasContactOnFile={hasContactOnFile}
        />
      </section>

      <Footer />
    </div>
  );
}

/** Show first letter + first 2 of domain so the user can recognize their email without exposing it fully. */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal =
    local.length <= 2
      ? local[0] + '•'
      : local[0] + '•'.repeat(local.length - 2) + local.slice(-1);
  const [d1, ...rest] = domain.split('.');
  const maskedDomain =
    d1.length <= 2
      ? d1[0] + '•'
      : d1[0] + '•'.repeat(d1.length - 2) + d1.slice(-1);
  return `${maskedLocal}@${maskedDomain}.${rest.join('.')}`;
}
