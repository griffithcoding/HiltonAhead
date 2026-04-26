import Link from 'next/link';
import { industries } from '@/data/localBusinesses';
import { SectionHead, Divider } from '@/components/ui/Ornament';

/**
 * LocalDirectoryPreview — surfaces the curated business directory on the
 * homepage. Each of the 8 industry categories renders as a small editorial
 * card linking to /local/[industry]. Sits between LatestPosts and
 * Testimonials in the homepage flow. Gives the new directory pages
 * direct inbound link equity from the highest-trafficked URL on the site.
 */
export default function LocalDirectoryPreview() {
  return (
    <section id="local-directory" className="mt-28 md:mt-36">
      <Divider ornament="oyster" className="mb-16 text-gold" />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHead
          number="№ 06"
          eyebrow="The Local Directory"
          plain="The businesses we send"
          italic="our own clients to."
        />
        <Link
          href="/local"
          className="link-underline text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
        >
          Browse the directory →
        </Link>
      </div>

      <p className="mt-8 max-w-[640px] text-[15px] leading-[1.7] text-ink-soft">
        Restaurants, golf courses, water-activity operators, spas, and more —
        each entry hand-picked by people who live on Hilton Head. No
        pay-to-play standard listings. No scraped review data. Just the
        places we actually recommend.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {industries.map((ind) => (
          <li key={ind.slug}>
            <Link
              href={`/local/${ind.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-ink/15 bg-cream/40 px-5 py-5 transition-all hover:border-coral hover:bg-cream hover:-translate-y-0.5"
            >
              <span aria-hidden="true" className="text-3xl">
                {ind.icon}
              </span>
              <span className="display text-[16px] leading-[1.2] text-ink group-hover:text-coral md:text-[18px]">
                {ind.name}
              </span>
              <span className="line-clamp-2 text-[12px] leading-[1.45] text-ink-soft">
                {ind.tagline}
              </span>
              <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-coral">
                See picks →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
