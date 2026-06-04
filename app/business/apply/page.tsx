import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import { generatePageMetadata, getBreadcrumbSchema } from '@/app/lib/metadata';
import BusinessApplyForm from '@/components/business/BusinessApplyForm';

export const metadata: Metadata = generatePageMetadata({
  title: 'Apply: Add Your Business to the Hilton Ahead Directory',
  description:
    'Get your Hilton Head or Bluffton business listed in our curated directory. Free baseline listing; optional Featured upgrade later.',
  path: '/business/apply',
  keywords: [
    'Hilton Head business listing',
    'list my Hilton Head business',
    'Bluffton business directory',
    'Hilton Head business portal',
  ],
});

export default function BusinessApplyPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Business Portal', path: '/business/login' },
    { name: 'Apply', path: '/business/apply' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <section className="mt-16 md:mt-20">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Business Portal · Apply"
            plain="Add your business"
            italic="to the Hilton Ahead directory."
          />
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
            We curate every listing on /local. Apply below, and we&rsquo;ll
            review for fit (locally owned or independently operated, real
            address on Hilton Head, Bluffton, or Daufuskie). Approval is
            usually within a week. The baseline listing is free; the optional
            Featured upgrade rolls out in a later phase.
          </p>
        </section>

        <Divider ornament="sailboat" className="my-16" />

        <section className="grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <h2 className="eyebrow text-coral">The form</h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
              Two minutes. We follow up by email after our review.
            </p>
            <div className="mt-8">
              <BusinessApplyForm />
            </div>
          </div>

          <aside className="flex flex-col gap-6 rounded-md border border-ocean-deep/15 bg-sand-soft p-6">
            <div>
              <div className="eyebrow text-ocean-deep">What you get</div>
              <ul className="mt-3 flex flex-col gap-2 text-[13.5px] leading-[1.55] text-ink">
                <li>Listing on /local in your industry category</li>
                <li>Editorial review write-up by our team</li>
                <li>UTM-tagged outbound link to your site (drives traffic + attribution)</li>
                <li>Phone-click and inquiry tracking visible to you in the portal</li>
                <li>Optional Featured upgrade later (top-of-category, badge, dedicated editorial)</li>
              </ul>
            </div>
            <div>
              <div className="eyebrow text-ocean-deep">What we look for</div>
              <ul className="mt-3 flex flex-col gap-2 text-[13.5px] leading-[1.55] text-ink-soft">
                <li>Locally owned or independently operated</li>
                <li>Real address in HHI / Bluffton / Daufuskie</li>
                <li>Open and operating (not seasonal-only without notice)</li>
                <li>Quality bar — we&rsquo;re selective so the directory stays useful</li>
              </ul>
            </div>
            <div>
              <div className="eyebrow text-ocean-deep">Already listed?</div>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-soft">
                Find your business in <Link href="/local" className="link-underline text-ink">/local</Link>{' '}
                and click <em>Own this business? Claim it →</em> on the listing.
              </p>
            </div>
          </aside>
        </section>

        <Divider ornament="sailboat" className="my-16" />

        <Footer />
      </div>
    </>
  );
}
