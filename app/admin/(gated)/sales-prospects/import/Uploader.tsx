'use client';

/**
 * Client island for the CSV import flow.
 *
 * Three phases:
 *   1. Source — pick file or paste CSV.
 *   2. Preview — parse in-browser, show row count + warnings/errors + first 5
 *      rows. No network call yet.
 *   3. Import — POST JSON to /api/admin/sales-prospects/import. The server
 *      re-parses (defense in depth) and returns a structured ImportReport.
 *
 * Tailwind palette only (sand, ocean, coral, palm, ink). Never imports from
 * the service client or any server-only module — parsing happens client-side
 * via the pure csvImport lib.
 */

import { useMemo, useState } from 'react';
import {
  parseProspectCsv,
  type ParseResult,
  type CsvProspectRow,
} from '@/app/lib/sales/csvImport';

interface CampaignOption {
  slug: string;
  name: string;
}

interface ImportResult {
  line: number;
  email: string;
  outcome: 'inserted' | 'updated' | 'skipped_unsub' | 'skipped_dupe' | 'errored';
  segment?: string;
  sequenceId?: string;
  error?: string;
}

interface ImportReport {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errored: number;
  results: ImportResult[];
  durationMs: number;
}

interface ImportResponse {
  ok: boolean;
  error?: string;
  parse?: {
    rowCount: number;
    errors: Array<{ line: number; field?: string; message: string }>;
    warnings: Array<{ line: number; field?: string; message: string }>;
  };
  report?: ImportReport;
}

const CHANNELS = [
  'email',
  'linkedin',
  'instagram',
  'facebook',
  'reddit',
  'pinterest',
  'tiktok',
] as const;

const COLS_FOR_PREVIEW: Array<keyof CsvProspectRow> = [
  'email',
  'full_name',
  'company',
  'feeder_city',
  'segment',
];

export default function Uploader({ campaigns }: { campaigns: CampaignOption[] }) {
  const [tab, setTab] = useState<'file' | 'paste'>('file');
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [campaignSlug, setCampaignSlug] = useState('');
  const [channel, setChannel] = useState<string>('email');
  const [dryRun, setDryRun] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [report, setReport] = useState<ImportResponse | null>(null);
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Live parse for preview. parseProspectCsv is pure + cheap, so memoize.
  const parsed: ParseResult | null = useMemo(() => {
    if (!csvText.trim()) return null;
    try {
      return parseProspectCsv(csvText);
    } catch (err) {
      console.error('[Uploader] parse threw:', err);
      return null;
    }
  }, [csvText]);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    setCsvText(text);
    setReport(null);
  };

  const handleImport = async () => {
    if (!parsed || parsed.rows.length === 0) return;
    setIsImporting(true);
    setReport(null);
    try {
      const res = await fetch('/api/admin/sales-prospects/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          csv: csvText,
          campaignSlug: campaignSlug || undefined,
          channel,
          dryRun,
        }),
      });
      const json = (await res.json()) as ImportResponse;
      setReport(json);
    } catch (err) {
      setReport({
        ok: false,
        error: err instanceof Error ? err.message : 'Network error.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const previewRows = parsed?.rows.slice(0, 5) ?? [];
  const erroredResults = report?.report?.results.filter((r) => r.outcome === 'errored') ?? [];
  const visibleErrors = showAllErrors ? erroredResults : erroredResults.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* ─── Options ──────────────────────────────────────────────────────── */}
      <section className="rounded-sm border border-ocean-deep/15 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Campaign
            </label>
            <select
              value={campaignSlug}
              onChange={(e) => setCampaignSlug(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ocean-deep/20 bg-sand-soft px-3 py-2 text-[13px] text-ink"
            >
              <option value="">— No campaign attribution —</option>
              {campaigns.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Default channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ocean-deep/20 bg-sand-soft px-3 py-2 text-[13px] text-ink"
            >
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-ink">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="h-4 w-4 accent-coral"
              />
              <span>
                <strong className="text-ink">Dry run</strong>
                <span className="ml-2 text-ink-soft">— parse only, no DB writes</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* ─── Source toggle ───────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`rounded-sm border px-4 py-2 text-[12px] uppercase tracking-[0.16em] ${
              tab === 'file'
                ? 'border-coral bg-coral text-white'
                : 'border-ocean-deep/20 bg-sand-soft text-ink-soft hover:text-ink'
            }`}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setTab('paste')}
            className={`rounded-sm border px-4 py-2 text-[12px] uppercase tracking-[0.16em] ${
              tab === 'paste'
                ? 'border-coral bg-coral text-white'
                : 'border-ocean-deep/20 bg-sand-soft text-ink-soft hover:text-ink'
            }`}
          >
            Paste CSV
          </button>
        </div>

        {tab === 'file' ? (
          <div className="rounded-sm border border-dashed border-ocean-deep/30 bg-sand-soft p-8 text-center">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
              className="mx-auto block text-[13px] text-ink"
            />
            {fileName && (
              <div className="mt-3 font-mono text-[12px] text-ink-soft">{fileName}</div>
            )}
          </div>
        ) : (
          <textarea
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setFileName(null);
              setReport(null);
            }}
            placeholder="email,first_name,company,feeder_city,source_notes&#10;ali@example.com,Ali,Acme Capital,Atlanta,Asked about golf in October"
            className="block h-48 w-full rounded-sm border border-ocean-deep/20 bg-sand-soft p-3 font-mono text-[12px] text-ink"
          />
        )}
      </section>

      {/* ─── Preview ─────────────────────────────────────────────────────── */}
      {parsed && (
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="display text-[20px] leading-[1.1] text-ink">Preview</h2>
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {parsed.rows.length} valid row{parsed.rows.length === 1 ? '' : 's'} ·{' '}
              {parsed.warnings.length} warning{parsed.warnings.length === 1 ? '' : 's'} ·{' '}
              {parsed.errors.length} error{parsed.errors.length === 1 ? '' : 's'}
            </span>
          </div>

          {parsed.errors.length > 0 && (
            <div className="mb-3 rounded-sm border border-coral/30 bg-coral/5 p-3 text-[12px] text-coral-deep">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em]">
                Parse errors (these rows will be skipped)
              </div>
              <ul className="ml-5 list-disc">
                {parsed.errors.slice(0, 10).map((e, i) => (
                  <li key={i}>
                    Line {e.line}
                    {e.field ? ` · ${e.field}` : ''}: {e.message}
                  </li>
                ))}
                {parsed.errors.length > 10 && (
                  <li className="italic">… and {parsed.errors.length - 10} more.</li>
                )}
              </ul>
            </div>
          )}

          {parsed.warnings.length > 0 && (
            <div className="mb-3 rounded-sm border border-gold/30 bg-gold/5 p-3 text-[12px] text-ink">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-gold-deep">
                Warnings
              </div>
              <ul className="ml-5 list-disc">
                {parsed.warnings.slice(0, 10).map((w, i) => (
                  <li key={i}>
                    Line {w.line}
                    {w.field ? ` · ${w.field}` : ''}: {w.message}
                  </li>
                ))}
                {parsed.warnings.length > 10 && (
                  <li className="italic">… and {parsed.warnings.length - 10} more.</li>
                )}
              </ul>
            </div>
          )}

          {previewRows.length > 0 && (
            <div className="overflow-x-auto rounded-sm ring-1 ring-ocean-deep/10">
              <table className="w-full min-w-[720px] border-collapse text-[12px]">
                <thead className="bg-sand-deep/40 text-left text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  <tr>
                    {COLS_FOR_PREVIEW.map((c) => (
                      <th key={c} className="px-3 py-2 font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_tr]:border-t [&_tr]:border-ocean-deep/10">
                  {previewRows.map((row, i) => (
                    <tr key={i}>
                      {COLS_FOR_PREVIEW.map((c) => (
                        <td key={c} className="px-3 py-2 text-ink">
                          {String(row[c] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || parsed.rows.length === 0}
              className="rounded-sm bg-coral px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isImporting
                ? 'Importing…'
                : `${dryRun ? 'Dry-run' : 'Import'} ${parsed.rows.length} prospect${parsed.rows.length === 1 ? '' : 's'}`}
            </button>
            <span className="text-[12px] text-ink-soft">
              {campaignSlug ? (
                <>
                  Campaign: <strong className="text-ink">{campaignSlug}</strong> ·{' '}
                </>
              ) : (
                <span className="italic">No campaign attribution. </span>
              )}
              Channel: <strong className="text-ink">{channel}</strong>
              {dryRun && (
                <span className="ml-2 rounded-sm bg-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-gold-deep">
                  DRY RUN
                </span>
              )}
            </span>
          </div>
        </section>
      )}

      {/* ─── Report ──────────────────────────────────────────────────────── */}
      {report && (
        <section className="rounded-sm border border-ocean-deep/15 bg-white p-5">
          <h2 className="display mb-4 text-[20px] leading-[1.1] text-ink">
            Import {dryRun ? 'dry-run' : 'result'}
          </h2>

          {!report.ok && (
            <div className="mb-4 rounded-sm border border-coral/40 bg-coral/10 p-3 text-[13px] text-coral-deep">
              {report.error ?? 'Import failed.'}
            </div>
          )}

          {report.report && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: 'Total', value: report.report.total, tone: 'text-ink' },
                  {
                    label: 'Inserted',
                    value: report.report.inserted,
                    tone: 'text-palm',
                  },
                  {
                    label: 'Updated',
                    value: report.report.updated,
                    tone: 'text-ocean-deep',
                  },
                  {
                    label: 'Skipped',
                    value: report.report.skipped,
                    tone: 'text-ink-soft',
                  },
                  {
                    label: 'Errored',
                    value: report.report.errored,
                    tone:
                      report.report.errored > 0 ? 'text-coral-deep' : 'text-ink-soft',
                  },
                ].map((k) => (
                  <div
                    key={k.label}
                    className="rounded-sm border border-ocean-deep/15 bg-sand-soft p-3"
                  >
                    <div className={`display text-[22px] leading-none ${k.tone}`}>
                      {k.value.toLocaleString()}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                      {k.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                {report.report.durationMs.toLocaleString()} ms
              </div>

              {erroredResults.length > 0 && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowAllErrors((s) => !s)}
                    className="text-[12px] uppercase tracking-[0.16em] text-coral-deep hover:text-coral"
                  >
                    {showAllErrors ? '▼' : '▶'} {erroredResults.length} errored
                    row{erroredResults.length === 1 ? '' : 's'}
                  </button>
                  <ul className="mt-2 ml-5 list-disc text-[12px] text-ink-soft">
                    {visibleErrors.map((r) => (
                      <li key={`${r.line}-${r.email}`}>
                        Line {r.line} · {r.email} —{' '}
                        <span className="text-coral-deep">{r.error}</span>
                      </li>
                    ))}
                    {!showAllErrors && erroredResults.length > visibleErrors.length && (
                      <li className="italic">
                        … and {erroredResults.length - visibleErrors.length} more.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
