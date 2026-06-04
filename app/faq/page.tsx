import type { Metadata } from 'next';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import FinalCta from '@/components/sections/FinalCta';
import { SectionHead, Divider } from '@/components/ui/Ornament';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  generatePageMetadata,
  getBreadcrumbSchema,
  getFaqSchema,
  getSpeakableSchema,
} from '@/app/lib/metadata';
import { faqAll, faqClusters } from '@/data/faq';
import { brand } from '@/data/brand';

const FAQ_PATH = '/faq';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hilton Head Travel FAQ — Pricing, Timing, Lodging, Golf',
  description:
    'Direct answers to the questions travelers ask before booking a Hilton Head trip. Pricing, booking windows, neighborhood differences, golf access, family travel, and how Hilton Ahead works.',
  path: FAQ_PATH,
  keywords: [
    'Hilton Head FAQ',
    'Hilton Head travel questions',
    'Hilton Head pricing',
    'Hilton Head villa rental questions',
    'Hilton Head golf trip questions',
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;

export default function FaqPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: FAQ_PATH },
  ]);
  const faqSchema = getFaqSchema(faqAll);
  // Speakable selectors point at every answer paragraph and every cluster TLDR.
  // Voice + AI-overview surfaces will read these aloud as direct answers.
  const speakable = getSpeakableSchema({
    url: `${siteUrl}${FAQ_PATH}`,
    cssSelectors: ['.faq-answer', '.cluster-summary'],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      <div className="mx-auto max-w-[1280px] px-5">
        <Header />

        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: FAQ_PATH },
          ]}
          className="mt-12"
        />

        <section className="mt-8 md:mt-10">
          <SectionHead
            as="h1"
            number="№ 01"
            eyebrow="Frequently Asked"
            plain="Direct answers to the"
            italic="questions before you book."
          />

          <p className="mt-8 max-w-[680px] text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            Thirty answers, no fluff. Pricing, timing, lodging, golf, family
            travel, comparisons, logistics, and how the service itself works.
            If your question isn&rsquo;t here, the contact form is the fastest
            way to reach a real person on the island.
          </p>

          <nav
            aria-label="FAQ topics"
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-ink/15 py-5 text-[13px] uppercase tracking-[0.18em] text-ink-soft"
          >
            {faqClusters.map((cluster) => (
              <a
                key={cluster.slug}
                href={`#${cluster.slug}`}
                className="link-underline hover:text-sunset"
              >
                {cluster.title}
              </a>
            ))}
          </nav>
        </section>

        <div className="mt-16">
          {faqClusters.map((cluster, ci) => (
            <section
              key={cluster.slug}
              id={cluster.slug}
              className="mt-20 first:mt-0 scroll-mt-24"
              aria-labelledby={`${cluster.slug}-heading`}
            >
              <Divider
                ornament={ci % 2 === 0 ? 'palmetto' : 'compass'}
                className="mb-12 text-gold"
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-16">
                <div>
                  <p className="eyebrow text-sunset">{`№ ${String(ci + 1).padStart(2, '0')}`}</p>
                  <h2
                    id={`${cluster.slug}-heading`}
                    className="display mt-3 text-[28px] leading-[1.05] text-ink md:text-[36px]"
                  >
                    {cluster.title}
                  </h2>
                  <p className="cluster-summary mt-4 max-w-[320px] text-[14px] leading-[1.65] text-ink-soft">
                    {cluster.description}
                  </p>
                </div>

                <div className="divide-y divide-ink/15 border-y border-ink/15">
                  {cluster.items.map((item, i) => (
                    <details
                      key={item.question}
                      className="group py-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
                        <div className="flex items-baseline gap-4">
                          <span className="section-number text-[18px] text-gold">
                            {`${ci + 1}.${i + 1}`}
                          </span>
                          <span className="display text-[19px] leading-[1.25] text-ink md:text-[22px]">
                            {item.question}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className="relative h-[14px] w-[14px] shrink-0"
                        >
                          <span className="absolute left-0 top-[6px] h-[1px] w-full bg-ink" />
                          <span className="absolute left-[6px] top-0 h-full w-[1px] bg-ink transition-transform group-open:rotate-90 group-open:opacity-0" />
                        </span>
                      </summary>

                      <div className="mt-5 grid grid-cols-[auto_1fr] gap-5 pl-0 md:pl-12">
                        <span aria-hidden="true" className="hidden md:block" />
                        <p className="faq-answer max-w-[680px] text-[15px] leading-[1.75] text-ink-soft">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <FinalCta />
      <Footer />
    </>
  );
}
