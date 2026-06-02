import Link from 'next/link';
import type { RentalAreaContent } from '@/data/vacationRentals';
import { stay22SearchDeeplink } from '@/app/lib/stay22';

export default function BestForLinkRow({ area }: { area: RentalAreaContent }) {
  if (area.bestForLinks.length === 0) return null;

  return (
    <section aria-label={`Best-for searches in ${area.name}`}>
      <h2 className="display mb-4 text-xl font-medium text-ink">
        Browse the full {area.name} map by trip type
      </h2>
      <div className="flex flex-wrap gap-3">
        {area.bestForLinks.map((link) => (
          <Link
            key={link.label}
            href={stay22SearchDeeplink(area.geofence.center, link.params)}
            target="_blank"
            rel="sponsored noopener"
            className="flex items-center gap-2 rounded-full border border-rule-soft bg-sand-soft px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ocean/40 hover:text-ocean"
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}
