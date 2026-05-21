/**
 * POST /api/admin/sales-prospects/import
 *
 * Admin-only batch CSV import for sales_prospects. Accepts either:
 *   - application/json: { csv: string, campaignSlug?, channel?, dryRun? }
 *   - multipart/form-data: file (CSV), plus campaignSlug/channel/dryRun fields
 *
 * First line MUST be `await requireAdmin()` — this endpoint reaches the
 * service-role client through importProspects, so an unauthenticated call
 * would bypass RLS. Direct POSTs to /api/* are NOT gated by the (gated)
 * layout group; see CLAUDE.md.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/utils/supabase/admin';
import { parseProspectCsv } from '@/app/lib/sales/csvImport';
import { importProspects, type ImportReport } from '@/app/lib/sales/importProspects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CSV_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_ROWS = 10_000;

interface JsonBody {
  csv?: unknown;
  campaignSlug?: unknown;
  channel?: unknown;
  dryRun?: unknown;
  autoSegment?: unknown;
  autoEnqueue?: unknown;
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') ?? '';

  let csv: string | null = null;
  let campaignSlug: string | undefined;
  let channel: string | undefined;
  let dryRun = false;
  let autoSegment: boolean | undefined;
  let autoEnqueue: boolean | undefined;

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file');
      if (file instanceof File) {
        if (file.size > MAX_CSV_BYTES) {
          return NextResponse.json(
            { ok: false, error: `CSV exceeds 5 MB (${file.size} bytes).` },
            { status: 413 },
          );
        }
        csv = await file.text();
      } else if (typeof form.get('csv') === 'string') {
        csv = String(form.get('csv'));
      }
      const cs = form.get('campaignSlug');
      const ch = form.get('channel');
      const dr = form.get('dryRun');
      const as = form.get('autoSegment');
      const ae = form.get('autoEnqueue');
      if (typeof cs === 'string' && cs.trim()) campaignSlug = cs.trim();
      if (typeof ch === 'string' && ch.trim()) channel = ch.trim();
      if (typeof dr === 'string') dryRun = dr === 'true' || dr === '1' || dr === 'on';
      if (typeof as === 'string') autoSegment = !(as === 'false' || as === '0');
      if (typeof ae === 'string') autoEnqueue = !(ae === 'false' || ae === '0');
    } else {
      const body = (await req.json()) as JsonBody;
      if (isString(body.csv)) csv = body.csv;
      if (isString(body.campaignSlug)) campaignSlug = body.campaignSlug.trim() || undefined;
      if (isString(body.channel)) channel = body.channel.trim() || undefined;
      if (typeof body.dryRun === 'boolean') dryRun = body.dryRun;
      if (typeof body.autoSegment === 'boolean') autoSegment = body.autoSegment;
      if (typeof body.autoEnqueue === 'boolean') autoEnqueue = body.autoEnqueue;
    }
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `Could not read request body: ${err instanceof Error ? err.message : 'unknown'}`,
      },
      { status: 400 },
    );
  }

  if (!csv || !csv.trim()) {
    return NextResponse.json(
      { ok: false, error: 'No CSV provided (expected `csv` field or `file` upload).' },
      { status: 400 },
    );
  }

  // Byte-size guard for JSON path (form path already checked above).
  if (csv.length > MAX_CSV_BYTES) {
    return NextResponse.json(
      { ok: false, error: `CSV exceeds 5 MB (${csv.length} chars).` },
      { status: 413 },
    );
  }

  const parsed = parseProspectCsv(csv);

  if (parsed.rows.length > MAX_ROWS) {
    return NextResponse.json(
      {
        ok: false,
        error: `CSV has ${parsed.rows.length} rows — limit is ${MAX_ROWS}. Split into batches.`,
      },
      { status: 400 },
    );
  }

  // If parsing produced no usable rows, return early with the parse issues.
  if (parsed.rows.length === 0) {
    return NextResponse.json(
      {
        ok: true,
        parse: parsed,
        report: {
          total: 0,
          inserted: 0,
          updated: 0,
          skipped: 0,
          errored: 0,
          results: [],
          durationMs: 0,
        } satisfies ImportReport,
      },
      { status: 200 },
    );
  }

  const report = await importProspects(parsed.rows, {
    campaignSlug,
    channel,
    dryRun,
    autoSegment,
    autoEnqueue,
  });

  return NextResponse.json(
    {
      ok: true,
      parse: {
        rowCount: parsed.rows.length,
        errors: parsed.errors,
        warnings: parsed.warnings,
      },
      report,
    },
    { status: 200 },
  );
}
