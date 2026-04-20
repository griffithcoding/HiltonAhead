import Link from 'next/link';
import Image from 'next/image';
import { posts } from '@/data/posts';
import { photos } from '@/data/photos';
import { SectionHead, Divider } from '@/components/ui/Ornament';

// Cycle through editorial photography for the first three features.
const FEATURE_PHOTOS = [
  { src: photos.lighthouse.src, alt: photos.lighthouse.alt },
  { src: photos.villa.src, alt: photos.villa.alt },
  { src: photos.boardwalk.src, alt: photos.boardwalk.alt },
];

/**
 * LatestPosts — editorial magazine rail with three featured items.
 * The first is a lead article with a larger plate; the next two are
 * smaller. Hairline rules, italic display captions, subtle ornament.
 */
export default function LatestPosts() {
  const featured = posts.slice(0, 3);
  if (featured.length === 0) return null;

  const [lead, ...rest] = featured;
  const photoFor = (idx: number) =>
    FEATURE_PHOTOS[idx % FEATURE_PHOTOS.length];

  return (
    <section id="local-guide" className="mt-28 md:mt-36">
      <Divider ornament="palmetto" className="mb-16 text-gold" />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHead
          number="№ 04"
          eyebrow="From the Local Guide"
          plain="Ranked, reviewed,"
          italic="written by someone who lives here."
        />
        <Link
          href="/blog"
          className="link-underline text-[12px] font-medium uppercase tracking-[0.18em] text-ink"
        >
          All dispatches →
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-16">
        {/* Lead feature */}
        {lead && (
          <Link
            href={`/blog/${lead.slug}`}
            className="group flex flex-col gap-5"
          >
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={photoFor(0).src}
                alt={photoFor(0).alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover photo-warm"
              />
              <span className="absolute left-4 top-4 bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                Featured · 2026
              </span>
            </figure>
            <div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                <span className="text-sunset">{lead.category}</span>
                <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
                <span>{lead.readTime} read</span>
              </div>
              <h3 className="display mt-4 text-balance text-[32px] leading-[1.1] text-ink md:text-[40px]">
                {lead.title}
              </h3>
              <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-ink-soft">
                {lead.excerpt}
              </p>
              <span className="link-underline mt-5 inline-block text-[12px] font-medium uppercase tracking-[0.18em] text-ink">
                Read the ranking →
              </span>
            </div>
          </Link>
        )}

        {/* Two companion features */}
        <div className="flex flex-col divide-y divide-ink/15 border-t border-ink/15">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[96px_1fr] gap-5 py-7 md:grid-cols-[120px_1fr]"
            >
              <figure className="relative aspect-square overflow-hidden">
                <Image
                  src={photoFor(i + 1).src}
                  alt={photoFor(i + 1).alt}
                  fill
                  sizes="120px"
                  className="object-cover photo-warm"
                />
              </figure>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  <span className="text-sunset">{post.category}</span>
                  <span aria-hidden="true" className="h-px w-4 bg-ink/20" />
                  <span>{post.readTime}</span>
                </div>
                <h4 className="display text-[18px] leading-[1.2] text-ink md:text-[20px]">
                  {post.title}
                </h4>
                <span className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-sunset">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
