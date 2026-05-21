/**
 * scripts/import-prospects.ts
 *
 * CLI batch-import for sales_prospects.
 *
 * Usage:
 *   npx tsx scripts/import-prospects.ts --file=./leads.csv \
 *     --campaign=atlanta-golf-q1-2026 --channel=email \
 *     [--dry-run] [--no-segment] [--no-enqueue]
 *
 * Env requirements:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY    (NEVER commit; load via .env.local or shell)
 *
 * The script writes through the service-role client so it bypasses RLS. Only
 * run from a trusted machine. Exits 0 on full success, 1 if any rows errored
 * (parse or insert).
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseProspectCsv } from '@/app/lib/sales/csvImport';
import { importProspects } from '@/app/lib/sales/importProspects';

// ─── ANSI helpers (no chalk dep) ────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function color(c: string, s: string | number): string {
  return `${c}${s}${C.reset}`;
}

// ─── Arg parser ────────────────────────────────────────────────────────────
interface Args {
  file?: string;
  campaign?: string;
  channel?: string;
  dryRun: boolean;
  noSegment: boolean;
  noEnqueue: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false, noSegment: false, noEnqueue: false };
  for (const a of argv.slice(2)) {
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--no-segment') args.noSegment = true;
    else if (a === '--no-enqueue') args.noEnqueue = true;
    else if (a.startsWith('--file=')) args.file = a.slice('--file='.length);
    else if (a.startsWith('--campaign=')) args.campaign = a.slice('--campaign='.length);
    else if (a.startsWith('--channel=')) args.channel = a.slice('--channel='.length);
  }
  return args;
}

function usage(msg?: string): never {
  if (msg) console.error(color(C.red, msg));
  console.error(
    `\n${color(C.bold, 'Usage:')} npx tsx scripts/import-prospects.ts --file=<csv> [--campaign=<slug>] [--channel=<email|linkedin|...>] [--dry-run] [--no-segment] [--no-enqueue]\n`,
  );
  process.exit(1);
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      color(
        C.red,
        '\nMissing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
      ),
    );
    console.error(
      color(C.dim, 'Add them to .env.local or export them in your shell before running.\n'),
    );
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  if (!args.file) usage('Missing --file=<path-to-csv>');

  const absPath = resolve(process.cwd(), args.file!);
  let csv: string;
  try {
    csv = await readFile(absPath, 'utf8');
  } catch (err) {
    console.error(color(C.red, `Could not read file: ${absPath}`));
    console.error(color(C.dim, String(err)));
    process.exit(1);
    return;
  }

  console.log(`\n${color(C.bold + C.cyan, 'Sales-prospect importer')}`);
  console.log(`  ${color(C.dim, 'file')}      ${absPath}`);
  console.log(`  ${color(C.dim, 'campaign')}  ${args.campaign ?? color(C.dim, '(none)')}`);
  console.log(`  ${color(C.dim, 'channel')}   ${args.channel ?? 'email'}`);
  console.log(`  ${color(C.dim, 'mode')}      ${args.dryRun ? color(C.yellow, 'DRY RUN') : color(C.green, 'LIVE')}`);
  console.log(`  ${color(C.dim, 'segment')}   ${args.noSegment ? 'off' : 'on'}`);
  console.log(`  ${color(C.dim, 'enqueue')}   ${args.noEnqueue ? 'off' : 'on'}`);
  console.log();

  const parsed = parseProspectCsv(csv);
  console.log(
    `${color(C.bold, 'Parse:')} ${color(C.green, parsed.rows.length)} valid · ${color(C.yellow, parsed.warnings.length)} warnings · ${color(C.red, parsed.errors.length)} errors`,
  );
  if (parsed.errors.length > 0) {
    for (const e of parsed.errors.slice(0, 10)) {
      console.log(
        `  ${color(C.red, '✗')} line ${e.line}${e.field ? ` · ${e.field}` : ''}: ${e.message}`,
      );
    }
    if (parsed.errors.length > 10) {
      console.log(color(C.dim, `  … and ${parsed.errors.length - 10} more.`));
    }
  }
  if (parsed.warnings.length > 0 && parsed.warnings.length <= 5) {
    for (const w of parsed.warnings) {
      console.log(
        `  ${color(C.yellow, '!')} line ${w.line}${w.field ? ` · ${w.field}` : ''}: ${w.message}`,
      );
    }
  }

  if (parsed.rows.length === 0) {
    console.log(color(C.red, '\nNothing to import.\n'));
    process.exit(parsed.errors.length > 0 ? 1 : 0);
    return;
  }

  console.log();
  const report = await importProspects(parsed.rows, {
    campaignSlug: args.campaign,
    channel: args.channel,
    dryRun: args.dryRun,
    autoSegment: !args.noSegment,
    autoEnqueue: !args.noEnqueue,
  });

  console.log(
    `${color(C.bold, 'Import:')} ${color(C.green, report.inserted)} inserted · ${color(C.cyan, report.updated)} updated · ${color(C.dim, report.skipped)} skipped · ${color(C.red, report.errored)} errored · ${report.durationMs}ms`,
  );

  if (report.errored > 0) {
    for (const r of report.results.filter((x) => x.outcome === 'errored').slice(0, 10)) {
      console.log(`  ${color(C.red, '✗')} line ${r.line} · ${r.email} — ${r.error}`);
    }
    if (report.errored > 10) {
      console.log(color(C.dim, `  … and ${report.errored - 10} more.`));
    }
  }

  const totalFailures = parsed.errors.length + report.errored;
  console.log();
  if (totalFailures > 0) {
    console.log(color(C.red, `Done with ${totalFailures} failure(s).\n`));
    process.exit(1);
  } else {
    console.log(color(C.green, 'Done.\n'));
    process.exit(0);
  }
}

void main().catch((err) => {
  console.error(color(C.red, '\nUnhandled error:'));
  console.error(err);
  process.exit(1);
});
