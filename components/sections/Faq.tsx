import { faq } from '@/data/faq';

/**
 * FAQ section — single top-level details for collapse,
 * then nested details per Q/A. Server component, no JS needed.
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mt-16">
      <details className="group/faq [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none flex-col items-center gap-3">
          <div className="text-sm uppercase tracking-[0.15em] text-zinc-400">
            {faq.eyebrow}
          </div>
          <h2 id="faq-heading" className="text-center text-[22px] font-medium tracking-tight md:text-[26px]">
            {faq.heading.plain}{' '}
            <span className="text-primary">{faq.heading.accent}</span>
          </h2>
          <svg
            aria-hidden="true"
            className="h-8 w-8 text-zinc-500 transition-transform duration-300 group-open/faq:rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </summary>

        <div className="mt-6 rounded-[24px] border border-white/15 bg-zinc-900/60 px-7 py-2 backdrop-blur-sm">
          <div className="divide-y divide-white/10">
            {faq.items.map((item) => (
              <details
                key={item.question}
                className="group py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-zinc-100 hover:text-white">
                  <span>{item.question}</span>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-3 max-w-[720px] text-[13px] leading-[1.65] text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
