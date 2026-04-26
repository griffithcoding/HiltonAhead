import Link from 'next/link';
import { createOpportunityAction } from '../actions';

export const dynamic = 'force-dynamic';

const LINK_TYPES = [
  { v: 'guest_post', l: 'Guest post' },
  { v: 'resource_page', l: 'Resource page' },
  { v: 'niche_edit', l: 'Niche edit (insert into existing post)' },
  { v: 'broken_link', l: 'Broken-link replacement' },
  { v: 'unlinked_mention', l: 'Unlinked mention → linked' },
  { v: 'digital_pr', l: 'Digital PR / press' },
  { v: 'directory', l: 'Directory listing' },
  { v: 'partnership', l: 'Partnership / cross-link' },
  { v: 'other', l: 'Other' },
];

const VERTICALS = [
  'travel',
  'wedding',
  'golf',
  'real-estate',
  'food',
  'lifestyle',
  'family',
  'south-carolina',
  'beach',
  'other',
];

export default function NewOpportunityPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/outreach"
          className="text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-coral"
        >
          ← Back to pipeline
        </Link>
      </div>

      <h1 className="display text-[28px] leading-[1.1] text-ink md:text-[32px]">
        New backlink opportunity
      </h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        Add a website you&apos;re targeting for a link. Account is upserted by
        domain (no duplicates).
      </p>

      <form action={createOpportunityAction} className="mt-10 space-y-10">
        {/* Account */}
        <Section title="Account (the website)">
          <Field label="Domain *" name="domain" required placeholder="example.com" />
          <Field label="Publication / Site name" name="account_name" placeholder="Travel + Leisure" />
          <Row>
            <Select label="Vertical" name="vertical" options={VERTICALS} />
            <Field label="Domain Rating (Ahrefs DR)" name="domain_rating" type="number" placeholder="0–100" />
          </Row>
        </Section>

        {/* Contact */}
        <Section title="Contact (optional — add later if unknown)">
          <Field label="Email" name="contact_email" type="email" placeholder="editor@example.com" />
          <Row>
            <Field label="First name" name="contact_first_name" />
            <Field label="Last name" name="contact_last_name" />
          </Row>
          <Field label="Role" name="contact_role" placeholder="Editor / Owner / Writer / PR" />
        </Section>

        {/* Opportunity */}
        <Section title="The link we want">
          <Select label="Link type" name="link_type" options={LINK_TYPES.map((x) => x.v)} optionLabels={LINK_TYPES.map((x) => x.l)} />
          <Field
            label="Our target URL (the page we want linked)"
            name="target_url"
            type="url"
            placeholder="https://hiltonahead.com/local/golf"
          />
          <Field
            label="Their source URL (for niche edits / broken-link)"
            name="source_url"
            type="url"
            placeholder="https://example.com/blog/golf-trips-southeast"
          />
          <Field
            label="Anchor text proposal"
            name="anchor_text"
            placeholder="Hilton Head golf packages"
          />
          <Row>
            <Field
              label="Campaign tag"
              name="campaign"
              placeholder="q2-2026-golf-push"
            />
            <Select
              label="Estimated value"
              name="estimated_value"
              options={['', 'low', 'medium', 'high']}
              optionLabels={['—', 'Low', 'Medium', 'High']}
            />
          </Row>
        </Section>

        <Section title="Notes">
          <Textarea label="Internal notes" name="notes" rows={4} />
        </Section>

        <div className="flex items-center justify-end gap-3 border-t border-ocean-deep/10 pt-6">
          <Link
            href="/admin/outreach"
            className="rounded-sm border border-ocean-deep/20 bg-sand px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-coral hover:text-coral"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-sm bg-ink px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-sand hover:bg-coral"
          >
            Create opportunity
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// Form helpers
// ============================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-sm border border-ocean-deep/15 bg-sand p-6">
      <legend className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-coral">
        {title}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 3,
}: {
  label: string;
  name: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        className="resize-none rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  optionLabels,
}: {
  label: string;
  name: string;
  options: string[];
  optionLabels?: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="rounded-sm border border-ocean-deep/15 bg-sand-soft px-3 py-2 text-[13px] text-ink outline-none focus:border-coral"
      >
        <option value="">— select —</option>
        {options.map((o, i) => (
          <option key={o || `i-${i}`} value={o}>
            {optionLabels?.[i] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}
