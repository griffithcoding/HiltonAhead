import { realEstatePartner } from '@/data/realEstatePartner';

export default function RealtorBio() {
  const p = realEstatePartner;
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-rule-soft bg-sand-soft p-5">
      {p.headshotSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.headshotSrc}
          alt={p.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="display text-lg font-medium text-ink">{p.name}</h3>
        {p.brokerage && <p className="text-xs text-ink-soft">{p.brokerage}</p>}
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.bio}</p>
      </div>
    </div>
  );
}
