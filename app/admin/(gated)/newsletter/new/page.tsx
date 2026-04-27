import Link from 'next/link';
import { createDraftAction } from '../actions';

export const dynamic = 'force-dynamic';

const STARTER_BODY = `# A quick note from the island

Lead paragraph here. Keep it conversational — pretend you're texting a
friend who's planning a trip. Two or three sentences max before the first
section break.

## What's new this week

A short paragraph about something timely — a season change, a new opening,
a piece of operator-only knowledge.

- Bullet point one
- Bullet point two
- Bullet point three

## Insider tip

> The kind of thing only locals know. One sentence is plenty.

A closing nudge with a [link to the relevant page](https://www.hiltonahead.com/plan-trip)
if there is one. End on something warm.`;

export default function ComposeNewsletterPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/newsletter"
          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
        >
          ← Back to newsletter
        </Link>
      </div>

      <h1 className="display text-[28px] leading-[1.1] text-ink md:text-[32px]">
        Compose a dispatch
      </h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        Saves as a draft. You'll preview it and send a test to yourself before
        the list goes out.
      </p>

      <form action={createDraftAction} className="mt-10 space-y-6">
        <fieldset className="rounded-sm border border-ocean-deep/15 bg-sand p-6">
          <legend className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
            Subject line
          </legend>
          <input
            type="text"
            name="subject"
            required
            maxLength={200}
            placeholder="Hilton Ahead — Spring fronts on Calibogue Sound"
            className="mt-3 w-full rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2.5 text-[14px] text-ink outline-none focus:border-coral"
          />
          <p className="mt-2 text-[11px] text-ink-soft">
            Lead with "Hilton Ahead —" so it threads with prior issues in
            Gmail.
          </p>
        </fieldset>

        <fieldset className="rounded-sm border border-ocean-deep/15 bg-sand p-6">
          <legend className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
            Body
          </legend>
          <textarea
            name="body"
            required
            rows={22}
            defaultValue={STARTER_BODY}
            className="mt-3 w-full resize-y rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2.5 font-mono text-[12.5px] leading-[1.7] text-ink outline-none focus:border-coral"
          />
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-ink-soft">
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">#</code> H1
              section
            </div>
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">##</code> H2
              subsection
            </div>
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">{'>'}</code>{' '}
              Insider note (coral border)
            </div>
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">- item</code>{' '}
              Bulleted list
            </div>
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">**bold**</code>{' '}
              Bold text
            </div>
            <div>
              <code className="rounded-sm bg-sand-deep/40 px-1">
                [text](url)
              </code>{' '}
              Link
            </div>
          </div>
          <p className="mt-3 text-[11px] text-ink-soft">
            The brand masthead, signoff, and unsubscribe footer wrap your
            body automatically. No need to add them.
          </p>
        </fieldset>

        <div className="flex items-center justify-end gap-3 border-t border-ocean-deep/10 pt-6">
          <Link
            href="/admin/newsletter"
            className="rounded-sm border border-ocean-deep/20 bg-sand px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-sm bg-ink px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral"
          >
            Save draft & preview →
          </button>
        </div>
      </form>
    </div>
  );
}
