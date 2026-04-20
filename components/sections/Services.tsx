import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { photos } from '@/data/photos';

/**
 * Services grid — 5 offerings on the island.
 * Server component.
 */
export default function Services() {
  return (
    <section id="services" className="mt-12">
      <div className="mb-3.5 text-sm uppercase tracking-[0.15em] text-zinc-400">
        {services.eyebrow}
      </div>
      <div className="mb-[18px] flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="max-w-[620px] text-[22px] font-medium tracking-tight md:text-[26px]">
          {services.heading.plain}{' '}
          <span className="text-primary">{services.heading.accent}</span>
        </h2>
        {services.subheading && (
          <p className="max-w-[360px] text-[13px] leading-[1.5] text-zinc-400">
            {services.subheading}
          </p>
        )}
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-white/20 shadow-xl">
        <Image
          src={photos.cta.src}
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-900/90 to-zinc-950/95" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="relative z-10 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="flex flex-col gap-3 rounded-[18px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-sm"
            >
              <div
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-zinc-800/90 text-[20px]"
              >
                {item.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-zinc-50">{item.title}</h3>
              <p className="text-[13px] leading-[1.6] text-zinc-400">{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[13px] text-zinc-300 transition-colors hover:text-white"
        >
          See all services
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
