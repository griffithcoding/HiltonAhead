import Link from 'next/link';
import type { CatalogRental } from '@/data/rentalsCatalog';
import { withStay22Params } from '@/app/lib/stay22';
import RentalCarousel from '@/components/rentals/RentalCarousel';

const SOURCE_LABEL: Record<CatalogRental['source'], string> = {
  booking: 'Booking.com',
  vrbo: 'VRBO',
  airbnb: 'Airbnb',
  hotels: 'Hotels.com',
  direct: 'the host',
};

export default function RentalCard({ rental }: { rental: CatalogRental }) {
  const href = withStay22Params(rental.bookingDeeplink);
  const specs = [
    `${rental.beds} BR`,
    `${rental.baths} BA`,
    rental.sqft ? `${rental.sqft.toLocaleString()} sqft` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article
      id={rental.id}
      className="flex flex-col overflow-hidden rounded-3xl border border-rule-soft bg-sand-soft shadow-sm transition-shadow hover:shadow-md"
    >
      <RentalCarousel photoUrls={rental.photoUrls} title={rental.title} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="display text-lg font-medium leading-snug text-ink">
          {rental.title}
        </h3>

        <p className="text-sm font-medium text-ink-soft">{specs}</p>

        <p className="text-sm font-semibold text-coral-deep">
          {rental.pricePerNightBand}
        </p>

        {typeof rental.rating === 'number' && (
          <p className="text-sm text-ink-soft" aria-label="guest rating">
            ★ {rental.rating.toFixed(1)}
            {rental.reviewCount ? ` (${rental.reviewCount} reviews)` : ''}
          </p>
        )}

        {rental.amenities.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {rental.amenities.slice(0, 4).map((a) => (
              <li
                key={a}
                className="rounded-full bg-ocean-light/40 px-3 py-1 text-xs font-medium text-ocean-deep"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm italic leading-relaxed text-ink-soft">
          {rental.editorialNote}
        </p>

        <div className="mt-auto pt-2">
          <Link
            href={href}
            target="_blank"
            rel="sponsored noopener"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-sand transition-colors hover:bg-ocean"
          >
            View on {SOURCE_LABEL[rental.source]} →
          </Link>
        </div>
      </div>
    </article>
  );
}
