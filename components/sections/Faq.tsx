import { faq } from '@/data/faq';
import { SectionHead, Divider } from '@/components/ui/Ornament';

/**
 * FAQ — editorial accordion with hairline rules.
 * No boxed card, no rounded corners. Just type.
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mt-28 md:mt-36">
      <Divider ornament="compass" className="mb-16 text-gold" />

      <SectionHead
        number="№ 05"
        eyebrow={faq.eyebrow}
        plain={faq.heading.plain}
        italic={faq.heading.accent}
      />

      <div className="mt-14 divide-y divide-ink/15 border-y border-ink/15">
        {faq.items.map((item, i) => (
          <details
            key={item.question}
            className="group py-6 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
              <div className="flex items-baseline gap-5">
                <span className="section-number text-[20px] text-gold">
                  {`№ ${String(i + 1).padStart(2, '0')}`}
                </span>
                <span className="display text-[20px] leading-[1.2] text-ink md:text-[24px]">
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

            <div className="mt-5 grid grid-cols-[auto_1fr] gap-5 pl-0 md:pl-[3.25rem]">
              <span aria-hidden="true" className="hidden md:block" />
              <p className="max-w-[680px] text-[15px] leading-[1.75] text-ink-soft">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
