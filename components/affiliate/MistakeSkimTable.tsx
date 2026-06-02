// components/affiliate/MistakeSkimTable.tsx
/**
 * The 10-row "skim table" that anchors the /hilton-head-packing-list page.
 * Desktop: 3-column <table>. Mobile (<sm): stacked card list (same semantics,
 * different visual treatment).
 *
 * Server component — every interactive bit is delegated to <AffiliateLink>
 * (which is the only client island on the page).
 */
import AffiliateLink from './AffiliateLink';
import {
  PACKING_MISTAKES,
  resolveMistakeUrl,
  type PackingMistake,
} from '@/data/packingMistakes';

export default function MistakeSkimTable() {
  return (
    <>
      {/* Desktop: real semantic table */}
      <table
        aria-label="Hilton Head packing mistakes and their fixes"
        className="hidden w-full border-collapse text-left sm:table"
      >
        <thead>
          <tr className="border-b border-rule-soft text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <th scope="col" className="py-3 pr-4 font-semibold">
              The mistake
            </th>
            <th scope="col" className="py-3 px-4 font-semibold">
              The fix
            </th>
            <th scope="col" className="py-3 pl-4 text-right font-semibold">
              Shop
            </th>
          </tr>
        </thead>
        <tbody>
          {PACKING_MISTAKES.map((m) => (
            <SkimRow key={m.slug} mistake={m} />
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards with role=list */}
      <ul role="list" className="flex flex-col gap-4 sm:hidden">
        {PACKING_MISTAKES.map((m) => (
          <li
            key={m.slug}
            className="border border-rule-soft bg-sand-soft/40 p-4"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Mistake {m.number}
            </p>
            <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">
              {m.mistakeShort}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-coral">
              The fix
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">
              {m.fixShort}
            </p>
            <div className="mt-4">
              <AffiliateLink
                programId="amazon"
                deeplink={resolveMistakeUrl(m)}
                placement={`trip/packing-list/${m.slug}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline-offset-4 hover:text-coral hover:underline"
                ariaLabel={`${m.productName} on Amazon (affiliate link)`}
              >
                {m.productName} →
              </AffiliateLink>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function SkimRow({ mistake }: { mistake: PackingMistake }) {
  return (
    <tr className="border-b border-rule-soft/60 align-top">
      <td className="py-4 pr-4 text-[14px] leading-snug text-ink">
        <span className="mr-2 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
          {mistake.number}
        </span>
        {mistake.mistakeShort}
      </td>
      <td className="py-4 px-4 text-[14px] leading-snug text-ink-soft">
        {mistake.fixShort}
      </td>
      <td className="py-4 pl-4 text-right">
        <AffiliateLink
          programId="amazon"
          deeplink={resolveMistakeUrl(mistake)}
          placement={`trip/packing-list/${mistake.slug}`}
          className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline-offset-4 hover:text-coral hover:underline"
          ariaLabel={`${mistake.productName} on Amazon (affiliate link)`}
        >
          Shop →
        </AffiliateLink>
      </td>
    </tr>
  );
}
