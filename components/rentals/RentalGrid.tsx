import type { CatalogRental } from '@/data/rentalsCatalog';
import RentalCard from '@/components/rentals/RentalCard';

export default function RentalGrid({
  rentals,
  heading,
}: {
  rentals: ReadonlyArray<CatalogRental>;
  heading?: string;
}) {
  if (rentals.length === 0) {
    return (
      <div className="rounded-3xl border border-rule-soft bg-sand-soft px-8 py-12 text-center">
        <p className="text-sm leading-relaxed text-ink-soft">
          We&apos;re curating our favorite rentals in this area now. In the
          meantime, browse the live map below for every available stay.
        </p>
      </div>
    );
  }

  return (
    <section>
      {heading && (
        <h2 className="display mb-6 text-2xl font-medium text-ink md:text-3xl">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((r) => (
          <RentalCard key={r.id} rental={r} />
        ))}
      </div>
    </section>
  );
}
