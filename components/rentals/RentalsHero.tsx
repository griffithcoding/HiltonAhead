import Link from 'next/link';

export default function RentalsHero({
  eyebrow,
  h1,
  intro,
  imageSrc,
  imageAlt,
  breadcrumb,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumb: ReadonlyArray<{ name: string; href: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ocean-deep to-ocean px-5 py-16 md:py-24">
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

      <div className="relative mx-auto max-w-3xl text-center">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center justify-center gap-2 text-xs text-ocean-light">
            {breadcrumb.map((b, idx) => (
              <li key={b.href} className="flex items-center gap-2">
                {idx > 0 && <span aria-hidden className="text-ocean-light/40">›</span>}
                {idx < breadcrumb.length - 1 ? (
                  <Link href={b.href} className="hover:text-sand">{b.name}</Link>
                ) : (
                  <span className="text-sand/70">{b.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="eyebrow mb-3 text-coral">{eyebrow}</p>
        <h1 className="display mb-5 text-4xl font-medium text-sand md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-ocean-light md:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}
