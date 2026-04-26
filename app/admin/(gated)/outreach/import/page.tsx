import Link from 'next/link';
import { importCsvAction } from './actions';

export const dynamic = 'force-dynamic';

const SAMPLE_CSV = `domain,account_name,vertical,domain_rating,monthly_traffic,contact_email,contact_first_name,contact_last_name,contact_role,link_type,target_url,anchor_text,campaign,notes
travelandleisure.com,Travel + Leisure,travel,91,12500000,editor@travelandleisure.com,Jane,Doe,Editor,guest_post,https://hiltonahead.com/local/restaurants,Hilton Head restaurants,q2-2026-restaurants,High DR magazine pitch
explorehiltonhead.com,Explore Hilton Head,travel,42,42000,info@explorehiltonhead.com,,,Owner,partnership,https://hiltonahead.com,Hilton Ahead local guide,partnerships,Local cross-promo
charlestoncitypaper.com,Charleston City Paper,lifestyle,71,890000,arts@charlestoncitypaper.com,Sarah,Lee,Editor,niche_edit,https://hiltonahead.com/local/weddings,Hilton Head wedding venues,q2-2026-weddings,Has existing SC weddings article`;

export default async function CsvImportPage({
  searchParams,
}: {
  searchParams: Promise<{
    total?: string;
    imported?: string;
    skipped?: string;
    errors?: string;
  }>;
}) {
  const params = await searchParams;
  const hasResult =
    params.total != null && params.imported != null && params.skipped != null;

  let parsedErrors: { row: number; error: string }[] = [];
  if (params.errors) {
    try {
      parsedErrors = JSON.parse(params.errors);
    } catch {
      // ignore
    }
  }

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
        Import prospects from CSV
      </h1>
      <p className="mt-2 text-[13px] text-ink-soft">
        Bulk-add outreach opportunities. Each row creates one opportunity (and
        upserts the account + contact).
      </p>

      {hasResult && (
        <div
          className={`mt-8 rounded-sm border p-5 ${
            parsedErrors.length > 0
              ? 'border-amber-700/40 bg-amber-50'
              : 'border-emerald-700/40 bg-emerald-50'
          }`}
        >
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink">
            Import complete
          </div>
          <div className="mt-2 text-[14px] text-ink">
            <strong>{params.imported}</strong> imported,{' '}
            <strong>{params.skipped}</strong> skipped (out of {params.total} rows).
          </div>
          {parsedErrors.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-amber-900">
                First {parsedErrors.length} errors:
              </div>
              <ul className="mt-2 space-y-1 text-[12px] text-ink">
                {parsedErrors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Upload form */}
      <form action={importCsvAction} className="mt-8 space-y-6">
        <div className="rounded-sm border border-ocean-deep/15 bg-sand p-6">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-coral">
              CSV file
            </span>
            <input
              type="file"
              name="file"
              accept=".csv,text/csv"
              required
              className="mt-3 block w-full text-[13px] text-ink file:mr-4 file:rounded-sm file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[11px] file:font-medium file:uppercase file:tracking-[0.18em] file:text-sand hover:file:bg-coral"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
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
            Import
          </button>
        </div>
      </form>

      {/* Format reference */}
      <div className="mt-12 rounded-sm border border-ocean-deep/10 bg-sand-soft p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
          CSV format
        </h2>
        <p className="mt-3 text-[13px] text-ink-soft">
          Required column: <code className="rounded-sm bg-sand px-1.5 py-0.5">domain</code>.
          Optional columns:{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">account_name</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">vertical</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">domain_rating</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">monthly_traffic</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">contact_email</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">contact_first_name</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">contact_last_name</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">contact_role</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">link_type</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">target_url</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">anchor_text</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">campaign</code>,{' '}
          <code className="rounded-sm bg-sand px-1.5 py-0.5">notes</code>.
        </p>
        <p className="mt-3 text-[12px] text-ink-soft">
          Domains are normalized (https://, www., trailing paths removed).
          Existing accounts/contacts are matched and reused.
        </p>
        <details className="mt-5">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] text-ink hover:text-coral">
            Sample CSV
          </summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre rounded-sm bg-ink/95 p-4 text-[11px] text-sand">
{SAMPLE_CSV}
          </pre>
        </details>
      </div>
    </div>
  );
}
